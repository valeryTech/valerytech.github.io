---
draft: false
toc: true
title: "URL Shortener"
linkTitle: "URL Shortener"
---
# **Core Requirements**

## Functional Requirements


1. Users should be able to access the original URL by using the shortened URL.
2. Users should be able to submit a long URL and receive a shortened version.
	- Optionally, users should be able to specify a custom alias for their shortened URL.
	- Optionally, users should be able to specify an expiration date for their shortened URL.

**Below the line (out of scope):**

- User authentication and account management.
- Analytics on link clicks (e.g., click counts, geographic data).

## NFRs


...

# API design

## Starting Point


Before designing the API, we have already established the **Functional Requirements (FRs)**, **Non-Functional Requirements (NFRs)**, and the **core components** of the system. So, where do we begin the API design process? A logical place to start is with the system's primary function: the link resolution and redirection path.

## Read Path (FR-R, CV)

### The Core Principle: Conforming to Web Standards


Our primary goal is simple: when a user clicks a short link, their browser must automatically land on the original long URL.

To achieve this, we must adhere to a critical external constraint: browsers and other HTTP clients already have a universal, built-in standard for handling redirection. Therefore, our API cannot use a custom format (like returning a JSON object with the URL). Instead, it **must** "speak the browser's language" by issuing a standard **HTTP redirect**. This ensures maximum compatibility and provides a seamless user experience.

xxx

When designing the API endpoint for our link resolution path, our main consideration is a critical external constraint: we must conform to the established standards for how browsers and other HTTP clients handle redirects.

/xxx

### The API Contract


The technical contract for our redirection endpoint is minimal, interoperable, and directly follows web standards.

- **Request:** The client sends an `HTTP GET` request to the path corresponding to the unique short code. `GET /{code}`
- **Response:** The server replies with a **`302 Found`** status code. The response body is empty, but it includes a crucial `Location` header containing the full destination URL. `HTTP/1.1 302 Found` `Location: <long_url>`

### Redirect status semantics


I think it make sense to discuss redirect semantics later when we have information about HLD and could make informed decisions on caching and choose redirect status semantics deliberately.

We need an initial default and a path to stricter caching later.

- **Default `302 Found`**: safe while iterating; does not instruct permanent caching.
- **Later opt-in `301 Moved Permanently`** per link: only when destinations are stable and you want SEO/edge caching.
- **307/308** (method-preserving) aren't necessary for a GET-only resolve path; keep the surface area minimal.

### Error semantics must be explicit


- Unknown code -> **`404 Not Found`** (the code never existed).
- Expired/deactivated -> **`410 Gone`** (the resource existed but is intentionally unavailable).

This split is useful for analytics, abuse detection, and client behavior.

## Write Path (FR-C, EN)


"2. Users should be able to submit a long URL and receive a shortened version.

- Optionally, users should be able to specify a custom alias for their shortened URL.
- Optionally, users should be able to specify an expiration date for their shortened URL."

How to reason about API?

Our system has to provide the minimal write capability (creation)

### The API Contract


To shorten a URL, we'll need a POST endpoint that takes in the long URL and optionally a custom alias and expiration date, and returns the shortened URL. We use post here because we are creating a new entry in our database mapping the long url to the newly created short url.

- **Endpoint:** `POST /v1/links`
- **Body:** `{ long_url, custom_alias?, expires_at? }`
- **Response:**
	- `201 Created` with `{ code, short_url, expires_at? }`
	- `Location: /v1/links/{code}` (resource pointer)
	- `409 Conflict` if `custom_alias` is taken
	- `422 Unprocessable Entity` for invalid URL (non-http/https, too long, malformed)

### Additional (later?)


**Idempotency:** Support `Idempotency-Key` so client retries don't duplicate links.

**Validation/normalization at write time** reduces surprises at read time:

- Accept only `http`/`https`.
- Normalize host casing, strip surrounding whitespace, optionally punycode IDNs.
- Enforce a max URL length and reserve namespaces (`/api`, `/admin`, `/healthz`, etc.) so aliases can't shadow system paths.

## Management and Analytics (FR-M, EH)


...

## phrases/concepts


minimal API you should expose

Minimal API surface (MVP)

MVP API for a URL-shortener

Expose only what's necessary for the core loop

External Contract

So, we're defined a contract with backend.

## **API Design Checklist**


- **Functional Coverage**: Ensure that the defined endpoints and their capabilities cover all specified **Functional Requirements (FRs)**.
- **Performance and Reliability**: Verify that the design meets key **Non-Functional Requirements (NFRs)**, such as latency, throughput, and availability targets.
- **Consistency and Predictability**: Maintain consistent naming conventions, URL structures (e.g., `/users/{userId}`), and data formats (e.g., JSON) across the entire API.
- **Robust Error Handling**: Implement a clear error handling strategy that uses standard **HTTP status codes** (e.g., `400` for bad requests, `404` for not found, `500` for server errors) and provides informative error messages.
- **Security Measures**: Incorporate necessary security practices, including **input validation** to prevent injection attacks, **rate limiting** to prevent abuse, and appropriate **authentication/authorization** for protected endpoints.
- **Developer Experience (DX)**: Design for ease of use with intuitive endpoint names, clear request/response schemas, and comprehensive **documentation**.

# High-Level Design (R-W combination)


Alright, looking at the system's requirements, the core user value is delivered on the **read path** -- the link resolution and redirection. This flow will handle orders of magnitude more traffic than the write path and is extremely sensitive to latency and availability.

Now that we've established the functional requirement for redirection and defined the public API contract (`GET /{code}`), let's detail the internal workflow. How does our system handle an incoming request to this endpoint?

These components should be connected in a simple (?), linear flow to resolve a short link and redirect the user.

## Request Processing Flow


Here is the sequence of events when a user clicks a short link, triggering a `GET /{short_code}` request from the client:

1. The request hits our **Primary Server**.
2. The Primary Server performs a lookup to find the long URL. It queries the **database** using the **short URL code** from the request.
3. Once the long URL is retrieved, the server constructs a proper **HTTP redirect response**.
4. Finally, the server responds to the user's client, importantly with a **302 redirect** status code and the long URL in the `Location` header.

Excalidraw Diagram Note

The "Primary Server" box in the diagram should contain a sub-process labeled "Lookup long URL from short code."

## Data Store and Performance Strategy


As a Staff Engineer, I'd reframe the "considerations" into a clear strategy that analyzes trade-offs and provides a justified recommendation. The goal is to demonstrate a deep understanding of how system design choices impact performance at scale.

By introducing a cache and splitting the services, you effectively solve the performance concerns of using a relational database like Postgres for a read-heavy workload.

(?) **Key Quality**: The **Primary Server** is designed as a **"stateless" service**, meaning the server itself doesn't store any information about past requests. This is a crucial design principle that allows multiple server instances to handle any request, making the system easier to scale and maintain.

## Reflection


maybe in the next time I should start with Write Path because I forgot about different edge cases. Also there is no expired cases which can be present due to optional `expires_at` field in the write path

## Checklist


- check your Design against API
- find out edge cases and business rules

## Redirection response strategy


analysis and trade-offs

the thing with 301 - it's not reversible

**If you don't want the redirect to be cached**

This indefinite caching is only the _default_ caching by these browsers in the absence of headers that specify otherwise. The logic is that you are specifying a "permanent" redirect and not giving them any other caching instructions, so they'll treat it as if you wanted it indefinitely cached.

The browsers still honor the Cache-Control and Expires headers like with any other response, if they are specified.

You can add headers such as `Cache-Control: max-age=3600` or `Expires: Thu, 01 Dec 2014 16:00:00 GMT` to your 301 redirects. You could even add `Cache-Control: no-cache` so it won't be cached permanently by the browser or `Cache-Control: no-store` so it can't even be stored in temporary storage by the browser.

phrases: components breakdown, core components, Here is how these components work together when a user clicks a link:

# High-Level Design (W-R combination)


We'll start our design by going one-by-one through our functional requirements and designing a single system to satisfy them.
> (?) proactively addresses the design trade-offs and questions you raised.

## Write Path


The system must satisfy the primary write-path requirement: _"Users should be able to submit a long URL and receive a shortened version."_ This involves ingestion, validation, code generation, and persistence.

**Responses:**

- **`201 Created` (Success):** Returned when a link is created successfully.
	- **Body:** `{ "short_url": "https://short.io/AbC123", "expires_at": "2026-01-01T00:00:00Z" }`
- **`400 Bad Request`:** Returned for malformed input, such as an invalid `long_url` format.
- **`409 Conflict`:** Returned if the requested `custom_alias` already exists.
- **`422 Unprocessable Entity`:** Returned for semantic validation errors, such as an `expires_at` timestamp that is in the past.

Write flow:

1. Client sends a POST request to  `POST /v1/links` endpoint with the long url, custom alias, and expiration date
2. The Primary Server receives the request and validates the long URL. This is to ensure that the URL is valid (there's no point in shortening an invalid URL) and that it doesn't already exist in our system (we don't want collisions).
- To validate that the URL is valid, we can use popular open-source libraries like [is-url](https://www.npmjs.com/package/is-url) or write our own simple validation.
- To check if the URL already exists in our system, we can query our database to see if the long URL is already present.
- Another moment here is expiration date: The Write component would need to validate that this is a valid timestamp in the future.
1. If the URL is valid and doesn't already exist, we can proceed to generate a short URL unless
	- For now, **we'll abstract this away as some magic function** that takes in the long URL and returns a short URL. We'll dive deep into how to generate short URLs in the next section.
	- If the user has specified a custom alias, we can use that as the short code (after validating that it doesn't already exist).
2. Once we have the short URL, we can proceed to insert it into our database, storing the short code (or custom alias), long URL, and expiration date.
3. Finally, we can return the short URL to the client.

## Crucial Warnings ⚠️


To maintain focus on the high-level system design, it's critical to recognize and defer deep dives into solved or separable problems.

- **URL Validation**: Avoid implementing URL validation from scratch. This is a well-understood but complex problem with numerous edge cases.
	- **Awareness**: URL validation is a deceptively complex problem with many edge cases (e.g., Unicode characters, custom TLDs). Attempting to implement this from scratch during a design session is a common pitfall.
	- **Strategy**: We will treat URL validation as a solved problem. Our design assumes the use of a robust, well-tested open-source library. We will focus on the integration, not the implementation. (The focus should be on the integration, not the implementation.)
- **Short Code Generation Subsystem**:
	- **Awareness**: The algorithm for generating a unique, non-colliding short code is a critical system component deserving of its own deep-dive discussion (e.g., Base-62 counter vs. hashing).
	- **Strategy**: For the purpose of this HLD flow, we abstract this component away behind a clear interface. We define its **contract** (it must return a unique code) but intentionally **defer** the discussion of its internal implementation to a separate stage. This allows us to make progress on the overall system architecture.

The **Write Service** orchestrates the link creation process in the following sequence:

1. **Ingestion & Validation:** The service receives the `POST` request and performs initial validation on the payload.
	- **`long_url` Validation:** We must validate that the URL is syntactically correct. This is a complex problem space, so we will delegate this to a standard, well-tested open-source library rather than implementing it ourselves. This prevents us from getting bogged down in edge cases of URL parsing.
	- **`expires_at` Validation:** If provided, the timestamp is validated to ensure it's a valid date and is in the future.
2. **Uniqueness Check:** If a `custom_alias` is provided, the service must perform a read query against the database to ensure the alias is not already in use. If it is, the service rejects the request with a `409 Conflict`.
3. **Short Code Generation:**
	- If a `custom_alias` was provided and is available, it is used as the short code.
	- If no alias is provided, the service calls a dedicated **Code Generation Service**. We will treat this as a component with a well-defined contract and **abstract away its internal implementation for a later deep dive.** This allows us to focus on the overall system flow without getting stuck on the specific generation algorithm at this stage.
4. **Persistence:** The Write Service constructs a new link entity containing the `short_code`, `long_url`, and optional `expires_at` timestamp. This entity is then persisted to our primary database.
5. **Response:** Upon successful persistence, the service constructs and returns the `201 Created` response containing the final short URL.

## Read Path


This flow outlines the sequence of events when a user requests a short URL, now including the logic for handling expired links.

1. A `GET` request for a short URL hits our **Primary Server**.
2. The **Validation Layer** inspects the short URL code first.
- **If the code is malformed** (e.g., contains invalid characters or has the wrong length), the layer immediately rejects the request with a **`400 Bad Request`**. The process stops here.
1. The server parses the request to extract the **short URL code**.
2. It then performs a lookup in the **database** using this code to retrieve the corresponding link data (which includes the long URL and its expiration date).
3. The server evaluates the result and takes one of the following actions:
	- **If the link is not found**, it returns a **`404 Not Found`** error.
	- **If the link is found but is expired**, it returns a **`410 Gone`** error.
	- **If the link is found and is valid**, it constructs and returns an **HTTP `302 Found` redirect** with the long URL in the `Location` header.

## Design Checklist


...

# Potential Deep-Dives


how we come up to them?

Deep Dives for URL-shortener

Hi Evan, Our DB writes are not very high write throughput, even if we assume some peak it won't cross 1K QPS. Why not use simple auto increment id and take base62 encoding on it? One potential problem with this approach is our counter metrics are exposed outside but it's not a big deal though. You will have less moving parts in the system. What am I missing?

-> I think the problem here is that when the RDB is sharded, it is impossible to keep a global counter - each RDB shard has its own auto increment, if one is down, the new instance wont be able to know which new id to start from.

-> Yes, this setup seems quite fine to me too.

**At which point should we pass from auto-incremented ID to a Redis counter** (..?) - this would be nice to have this idea discussed above as it's the simplest of all.

A single Postgres DB with the right hardware, and read replicas, could handle an heavy load quite well.

# Resources


url-shortener resources

<https://www.youtube.com/watch?v=Cg3XIqs_-4c>

<https://www.youtube.com/watch?v=HHUi8F_qAXM> <- interesting approach to generation

bbg

<https://www.youtube.com/watch?v=iUU4O1sWtJA>
