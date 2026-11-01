---
draft: false
toc: true
title: "URL Shortener"
description: "A working URL-shortener design covering requirements, redirect and creation APIs, data ownership, read/write flows, uniqueness, caching, consistency, and deep-dive choices."
document_status: "canonical"
linkTitle: "URL Shortener"
---

Working design for the core loop: create a short link and resolve it to the original URL. The [case index]({{< ref "system-design/projects/url-shortener" >}}) links the NFR explorations, product context, implementation experiments, and earlier design variants.

## Core requirements


1. A user can resolve a short URL to its original destination.
2. A user can submit a long URL and receive a short URL.
3. Optional extensions: a custom alias and an expiration time.

Authentication/account management and click analytics are outside the initial scope. Decide explicitly whether custom aliases and expiry are included in a particular attempt.

Resolution is the core moment of value; creation enables it. This helps prioritize the discussion while keeping both paths complete.

## Quality requirements and assumptions


The [NFR explorations]({{< ref "system-design/projects/url-shortener/url-shortener-nfrs" >}}) contain different proposed targets. Before using any of them, confirm the assumed workload, latency measurement, availability objective, and acceptable delay before a newly created link resolves.

Keep these decisions visible:

- Short codes identify a single mapping; define how uniqueness is enforced.
- Reads and writes may have different traffic and service targets.
- If creation is replicated asynchronously, define where a newly created link is immediately usable and what other regions can observe.
- If expiry or deactivation is supported, define how promptly caches must reflect it.

## API contract

### Resolve: `GET /{code}`


The client is following a link in a browser. Return an HTTP redirect with a `Location` header containing the destination URL.

| Outcome | Response in this design |
| --- | --- |
| Active link | `302 Found`, with `Location: <long_url>` |
| Unknown code | `404 Not Found` |
| Known expired or deactivated link | `410 Gone`, if that state is retained and recognized |
| Malformed code | `400 Bad Request` |

Start with `302` while deciding caching and mutability behavior. The earlier notes consider `301` for deliberately permanent destinations, and `307`/`308` when method preservation matters. The initial resolve contract accepts GET requests, so that distinction is not a core requirement here.

Treat redirect status and cache policy as explicit decisions. The original design discusses `Cache-Control: no-store` for an uncached baseline; any later cache must fit the expiry, deactivation, and destination-change behavior promised to users.

### Create: `POST /v1/links`


Request:

```json
{
  "long_url": "https://example.com/article",
  "custom_alias": "optional-alias",
  "expires_at": "2027-01-01T00:00:00Z"
}
```


Only `long_url` is required. A successful response is `201 Created` with `{ code, short_url, expires_at? }` and a resource pointer such as `Location: /v1/links/{code}`. The resource pointer does not add a management endpoint to the initial scope.

Use one error convention throughout the exercise. The earlier drafts differed; this working contract uses:

- `400 Bad Request` for an unreadable or malformed request.
- `409 Conflict` for an unavailable custom alias.
- `422 Unprocessable Entity` for a well-formed request with an invalid URL or expiration value.

Validation considerations from the original notes:

- Accept `http` and `https` URLs.
- Use an established parser/validation library rather than designing URL parsing during the interview.
- Decide on normalization and maximum length.
- Reserve system paths such as `/api`, `/admin`, and `/healthz` so aliases cannot shadow them.
- Validate an optional expiration timestamp.

An `Idempotency-Key` is a possible extension for retrying creation without producing additional links. Describe its semantics if it is included.

## Core data


The baseline mapping contains `code`, `long_url`, and optional `expires_at`. Add lifecycle information only when the chosen requirements need it, such as distinguishing a known deactivated link from an unknown code.

Choose the store and key behavior from these operations. The initial architecture needs code lookup and unique code allocation; a specific database or separate generation service is a decision to justify.

## Baseline design


Start with a service and its mapping store. Keep code generation behind a clear interface while explaining the complete create flow. Add caches, replicas, partitioning, or a separate service when the selected requirements justify them.

### Read path


1. The service receives `GET /{code}` and validates the code format.
2. It looks up the mapping by code.
3. It distinguishes unknown, expired/deactivated, and active mappings according to the stored state.
4. For an active mapping, it returns the redirect and selected cache policy.

The system resolves the mapping; it does not need to fetch and serve the destination page to perform the redirect.

### Write path


1. The service receives the create request and validates the input.
2. It uses a requested custom alias or obtains a candidate code from the generation mechanism.
3. It persists the mapping while enforcing the code's uniqueness. A preliminary availability check needs a concurrency-safe write behind it.
4. It handles a collision or alias conflict according to the allocation strategy and API contract.
5. It returns the short URL after the chosen persistence condition is satisfied.

Checking whether a long URL already exists is a separate deduplication policy. The uniqueness requirement here is on the short code; decide explicitly if repeated creation of the same destination should reuse a link.

### Two walkthrough orders


**Read first:** explain resolution, then show how creation supplies its mapping. This puts the core user value first and helps focus the latency and availability discussion.

**Write first:** create and persist a mapping, then trace a request resolving it. This makes the data lifecycle easy to follow.

Both orders appear in the [earlier full design variants]({{< ref "system-design/archive/url-shortener-design-v0" >}}). Keep the same contract and assumptions when changing the presentation order.

## Deep dives


Choose the issues that follow from the agreed requirements:

- **Code allocation:** compare a database-generated ID encoded in base62, random codes with collision handling, pre-generated key allocation, or another identifier scheme. Explain uniqueness, coordination, failure, and the workload that motivates the choice.
- **Read scaling:** compare the baseline store with replicas, caching, and partitioning. Connect the choice to actual request rates and hot-link behavior.
- **Caching and lifecycle:** explain misses, expiry, deactivation, invalidation, and what may be served during an origin failure.
- **Consistency:** trace a create followed immediately by resolve, including a request reaching another region.
- **Reliability:** identify dependency failures, fallback behavior, and how the selected SLO would be measured.
- **Abuse and operations:** connect rate limits, basic validation, metrics, and structured errors to the paths they protect or observe.

A simple initial store remains an option. The question "when would a separate counter, generator, or partitioned store become necessary?" is part of the design discussion.

## Review checklist


- Every in-scope operation has a complete request-to-response flow.
- The API, stored state, and error semantics agree.
- Code uniqueness is explained under concurrency.
- Retry and newly-created-link behavior are explicit where relevant.
- Cache policy fits the selected lifecycle semantics.
- Each added component solves a stated problem.
- Remaining assumptions, risks, and next investigations are recorded.

## Sources and related notes


- [Requirements and product framing]({{< ref "system-design/projects/url-shortener/url-shortener-useful" >}}).
- [Interview checklist and design skeleton]({{< ref "system-design/projects/url-shortener/url-shortener-additional" >}}).
- [Key-generation review]({{< ref "system-design/to-sort/sd-reviews" >}}#tiny-url).
- [Design video](https://www.youtube.com/watch?v=Cg3XIqs_-4c).
- [Code-generation discussion](https://www.youtube.com/watch?v=HHUi8F_qAXM).
- [Additional design video](https://www.youtube.com/watch?v=iUU4O1sWtJA).
