---
draft: false
toc: true
title: "Url Shortener Nfrs V0"
linkTitle: "Url Shortener Nfrs V0"
---
---

title: "URL Shortener NFRs v0"

linkTitle: "URL Shortener NFRs v0"

Other to consider:

- Document how deactivate/expire signals propagate to caches and storage to bound staleness and avoid serving dead links beyond the intended window
- Adopt cache‑aside on the app with optional background warm on create, and define stale‑on‑error behavior for resilience during short origin disruptions
- Specify edge and regional cache TTLs for hot keys, negative‑cache TTLs for 404/410, and cache‑bust rules on deactivate/expire to ensure user‑visible correctness with minimal origin hits
- Observability: Emit edge and app metrics for success rate, latency (p95/p99), dependency health, and burn‑rate, add synthetic checks for top links, and define alert thresholds aligned to SLOs.
- Provide concise runbooks for cache hot‑key misses, regional degradations, store throttling, and rollback procedures to accelerate MTTR within the error budget
- Capture cutover mechanics such as DNS/health‑based routing, data replication mode, and rollback safety so the path to 99.99% is real but gated

API and contract polish

- Add versioning guidance, structured error taxonomy, idempotency keys for create, and rate‑limit headers to make client integration predictable and safe under retries

Testing and resilience:

- Define load test profiles for peak QPS and cache‑hit ratios that map to the latency SLO, and introduce lightweight chaos tests against cache and store failures to validate graceful degradation.
- Add canary and rollback guidance to reduce blast radius on changes that affect the hot redirect path
- Add safe defaults for TTLs, retries, and backoff policies to prevent thundering herds during partial outages

As a Staff Engineer, my first action is to break down that monolithic DAU number into a workload characterization based on user archetypes. For a URL-shortener, the most impactful division is between **Creators** and **Consumers**.

## User Archetypes and Their Impact on Scale


Let's define these user types and analyze how they shape the system design.

### 1. Consumers (The Readers)


This is the overwhelming majority of your traffic. These are the end-users who click a shortened link.

- **Behavior**: Executes a single, high-frequency action: resolving a short URL. This is a **read-only** operation.
- **Scale Dimension**: This is your **Queries Per Second (QPS)** driver. If 100M DAU click an average of 1.5 links per day, that's 150M resolves, heavily concentrated during peak hours. This could translate to tens or hundreds of thousands of QPS on the read path.
- **Architectural Impact**:
	- **Extreme Latency Sensitivity**: Redirects must be near-instantaneous (<100ms).
	- **High Availability is Core Value**: The resolve path _is_ the product. It must be designed for 99.9% or higher availability.
	- **Drives Caching Strategy**: This workload is perfect for aggressive, multi-layer caching (Edge/CDN, in-memory caches like Redis) to serve the vast majority of requests without touching the primary database.
	- **Stateless and Horizontally Scalable**: The redirect service can be a simple, stateless application scaled out globally to be close to users.

### 2. Creators (The Writers)


This is a much smaller, but vital, user segment. These are users who generate the short links.

- **Behavior**: Executes write-heavy operations: creating a link, optionally adding a custom alias or expiration.
- **Scale Dimension**: This drives **Transactions Per Second (TPS)** on the write path and your total storage volume (e.g., planning for over 1 billion links). The TPS will be orders of magnitude lower than the read path QPS.
- **Architectural Impact**:
	- **Consistency is Key**: When a creator gets a short URL, it must be durably stored and unique.
	- **Less Latency-Sensitive**: A user will tolerate 500ms to create a link, whereas a 500ms redirect is unacceptable.
	- **Requires More Complex Logic**: This path involves validation, potential collision checks for custom aliases, and calling a code generation service.
> This asymmetry is an important factor (?)
**Drives Service Decomposition**: The vastly different traffic patterns and requirements of Creators vs. Consumers are the primary justification for splitting the system into a **Write Service** and a **Read/Redirect Service**. You scale them independently.

I'll design a **read-optimized redirect service** that is massively scalable and globally distributed, likely fronted by a CDN. The **write service** will be a separate, more centralized component focused on data integrity. This allows us to scale and provision resources for each path independently, which is far more efficient and resilient."

# Consistency

#todo add PACELC and other tools perspective and reasoning

- **Requirement**: The system will favor **Availability over strong Consistency (AP in the CAP theorem)**.
- **Architectural Implication**: A newly created or updated link does not need to be globally visible instantaneously. A brief propagation delay (seconds) is acceptable. This allows for the use of **eventual consistency** models in caches and read replicas, which simplifies achieving high availability and low latency in a distributed environment.

While the initial write must be strongly consistent, **eventual consistency** is the correct and necessary model for propagating that write to the globally distributed Read Path. Using eventual consistency here is a deliberate trade-off that enables high availability and low latency for reads.

Here is the step-by-step reasoning for how this hybrid consistency model works:

## Step 1: Strongly Consistent Write (The "CP" part)


1. A user sends a `POST` request to create a short link. The request is routed to the **Write Service**, which is connected to the **primary database** (e.g., located in `us-east-1`).
2. The Write Service begins a database transaction. It validates the request and inserts the new link data into the primary database. This operation is **ACID-compliant**.
3. Upon successful commit of the transaction, a `201 Created` response is sent to the user.

At this exact moment, the system has made a guarantee to the creator, but the new link is only guaranteed to be visible to requests that can query the primary database directly.

## Step 2: Asynchronous Replication (The "AP" part)


This is where the system transitions to an eventually consistent model to update the read path.

1. The change in the primary database is captured. This can be done via database logs (Change Data Capture - CDC) or application-level triggers.
2. This change event is published to a **messaging system** (like Kafka or AWS SNS). This action is asynchronous and does not block the response to the creator.
3. Multiple subscribers listen for this event:
	- **Database Replicas**: Read replicas in other geographic regions (e.g., `eu-west-1`, `ap-southeast-1`) consume the event and apply the change to their local copy of the data.
	- **Cache Invalidation/Update Service**: A service consumes the event and sends invalidation or update commands to the global **CDN and edge caches**.

## Step 3: Propagation Delay & Convergence


1. There is a brief **propagation delay** (typically milliseconds to a few seconds) between the initial write (Step 3) and the completion of the replication (Step 6).
2. During this window, a request for the new short link that hits a read replica or edge cache in `eu-west-1` might fail (e.g., with a `404 Not Found`) because the data has not yet arrived.
3. Once the replication and cache updates are complete, the system has **converged**. All components in the distributed read path now have the new data, and any request for the short link will resolve correctly worldwide.

This model provides the ideal outcome: the **creator** gets the immediate, strong guarantee they need, while the millions of **consumers** get the highly available, low-latency experience required, accepting a brief and typically unnoticeable replication delay.

## Potential Pitfalls


As a Staff Software Engineer, I'd focus on the following potential pitfalls in the hybrid consistency implementation. These are issues that can arise even with a well-designed system and require specific architectural safeguards.

### Excessive Replication Lag


This is the most common pitfall in an eventually consistent system.

- **Symptom**: A user creates a short link in one region and immediately shares it with someone in another. The recipient gets a `404 Not Found` error because the data has not yet arrived at their local read replica.
- **Root Cause**: The asynchronous replication process (via the messaging system and database replication) is slower than the user's ability to share the link. This can be caused by network congestion between regions, an under-provisioned messaging queue, or slow write performance on the read replicas.
- **Mitigation**:
	1. **Monitor Lag**: Implement robust monitoring to track the replication delay between the primary and all replicas. Set up alerts if the lag exceeds a defined threshold (e.g., 5 seconds).
	2. **Read-After-Write Consistency**: For the user who just created the link, route their subsequent read requests for that link to the primary data center for a short period (e.g., one minute). This masks the replication lag for the creator, who is the most likely person to test the link immediately.

### Cache Invalidation Failures


A failure in the cache update mechanism can lead to users seeing stale data.

- **Symptom**: A user updates the destination URL for an existing short link, but users continue to be redirected to the old URL for an extended period.
- **Root Cause**: The cache invalidation message published by the Write Service was lost or failed to be processed by the edge caches. The edge caches will continue serving the stale entry until its Time-To-Live (TTL) expires.
- **Mitigation**:
	1. **Durable Messaging**: Use a messaging system with at-least-once delivery guarantees and a Dead Letter Queue (DLQ) to capture and retry failed invalidation messages.
	2. **Short TTLs**: Set a reasonably short TTL (e.g., 5-15 minutes) on all cache entries. This acts as a fallback, ensuring that even if an invalidation fails, the stale data will be purged from the cache automatically in a timely manner.

### Inconsistent State After Primary Failover


A poorly managed failover of the primary database can lead to data loss.

- **Symptom**: The primary database in `us-east-1` fails. The system fails over to the standby replica in `us-west-2`. After the new primary is active, links that were successfully created just moments before the failure are now gone.
- **Root Cause**: The write operations were acknowledged by the old primary but had not yet been asynchronously replicated to the standby before the failure occurred.
- **Mitigation**: Use **synchronous replication** between the primary database and its designated hot standby replica (ideally in a nearby but separate AZ). This ensures that any write is committed in at least two locations before a success response is sent to the user. This increases write latency slightly but provides a much stronger durability guarantee (a Recovery Point Objective, or RPO, of zero).

## Transactional Outbox


Yes, the transactional outbox pattern is an excellent and robust solution for this exact problem. It directly addresses the potential pitfall of a "dual write" failure, where a database commit succeeds but the subsequent message publication fails.

### The Problem: Dual Writes


The standard approach involves two separate actions:

1. Begin a database transaction.
2. Write the new link to the `links` table.
3. Commit the transaction.
4. Publish a `link_created` message to a message broker like Kafka.

The critical failure point is between steps 3 and 4. The database has committed the new link, but the application could crash or the message broker could be unavailable before the message is sent. This results in a "ghost" link -- one that exists in the primary database but is never replicated to the read path.

### How the Transactional Outbox Pattern Solves It


This pattern ensures that saving the data and creating the event for replication happen in a single, atomic step.

Here is the step-by-step implementation:

1. **Atomic Write**: The Write Service starts a single database transaction. Inside this transaction, it performs two writes:
	- It `INSERTs` the new link data into the `links` table.
	- It `INSERTs` an event record (e.g., `{ event_type: 'link_created', link_id: 'xyz123', payload: '...' }`) into a separate `outbox` table within the **same database**.
2. **Transaction Commit**: The service commits the transaction. Because this is an ACID-compliant operation, we have an absolute guarantee that if the link exists, the corresponding event record in the `outbox` table also exists.
3. **Asynchronous Message Relay**: A separate, independent process (a "message relay" or "poller") constantly monitors the `outbox` table for new event records.
4. **Guaranteed Publication**: For each new event it finds, the relay process:
	- Publishes the event to the actual message broker (Kafka, SNS, etc.).
	- Waits for a successful acknowledgment from the broker.
	- Only after receiving the acknowledgment, it marks the event in the `outbox` table as "processed" (or deletes it).

### Benefits of This Pattern


- **Reliability**: It prevents lost messages and guarantees that every committed database change will eventually be published to the rest of the system.
- **Decoupling**: The core Write Service is simplified. It no longer needs to know about the message broker; its only responsibility is to write to its own database. This improves separation of concerns.

# PACELC


The PACELC theorem states that in a distributed system, there is a trade-off: in the event of a network **P**artition, a system must choose between **A**vailability and **C**onsistency. **E**lse (in normal operation), it must choose between **L**atency and **C**onsistency.

Applying this principle to our URL shortener design forces us to make deliberate, distinct choices for the Read Path and the Write Path.

### Read Path (Redirects)


The Read Path is designed as a **PA/EL** system.

- **Partition (PA)**: If a network partition occurs (e.g., a read replica in one region cannot communicate with the primary), the system will choose **Availability (A) over Consistency (C)**.
	- **Reasoning**: It is better to serve a redirect request using slightly stale data (e.g., pointing to an old URL that was recently updated) than to return an error. The core function -- redirection -- is maintained, ensuring a good user experience. Failing the request would be a more severe failure.
- **Else (EL)**: In normal operation, the system chooses **Latency (L) over Consistency (C)**.
	- **Reasoning**: The primary goal is to make redirects feel instantaneous (<100ms). To achieve this, requests are served from the nearest edge cache, even if it means the data is not the most up-to-date version from the primary database. We accept a brief eventual consistency window in exchange for extremely low latency.

### Write Path (Creations)


The Write Path is designed as a **PC/EC** system.

- **Partition (PC)**: If the Write Service cannot reliably communicate with the primary database due to a partition, it will choose **Consistency (C) over Availability (A)**.
	- **Reasoning**: The system must never enter an inconsistent state, such as allowing two users to claim the same custom alias. If a write cannot be guaranteed to be unique and durable, the system must reject the request by returning an error. Sacrificing availability (temporarily refusing to create links) is preferable to data corruption.
- **Else (EC)**: In normal operation, the system chooses **Consistency (C) over Latency (L)**.
	- **Reasoning**: When a user creates a link, the guarantee of durability and uniqueness is more important than the speed of the response. The system performs synchronous writes to a primary database within an ACID transaction, which may add minor latency, to ensure the data is correct before returning a success message.

# Read Path


Numbers Calculation. To design a scalable system, you must translate business metrics into specific engineering targets that drive architectural decisions.

## Scale and Scalability


Estimating Peak Load

We start with the business scale and refine it to calculate the peak load, which is the most critical metric for capacity planning.

1. **Total Daily Requests**: With **100 million DAU** and an estimated average of **2 clicks per user**, the system handles **200 million redirects per day**.
2. **Peak Traffic Window**: Assuming 80% of traffic occurs during a 4-hour window (14,400 seconds), the peak load is **160 million** requests.
3. **Peak QPS**: This gives us our primary design target.
	- `160,000,000 requests / 14,400 seconds` ≈ **11,111 QPS**

We will design the retrieve path to handle a peak load of **~12,000 QPS**.

Peak QPS (~12k)

Now that we have 12k QPS, what does this value tell us? It shows that a single-server architecture cannot handle this load. Therefore, we have to consider our options and apply the appropriate distributed system patterns to build a **system** capable of this load.

Options: horizontal scaling with stateless services + LB (RR); caching; read replicas;

Assuming a **99% cache hit rate**:

- **Cache Load**: `12,000 QPS * 99%` ≈ **11,880 QPS**
- **Database Load**: `12,000 QPS * 1%` = **120 QPS**

This implementation of an in-memory cache (like Redis) shifts the **primary scaling challenge** from the database to the cache, which is built to handle this type of load.

Possible patterns are:

- Horizontal Scaling
- Caching
- DB Scaling Patterns

## Latency (p95 < 100ms)


concepts: latency target,

trade off: User Perception vs. Technical Cost

**Requirement**: The **95th percentile (p95)** response time for a redirect, measured from the edge, must be **less than 100 milliseconds**.

How had we derive it? Studies on human perception have consistently shown that actions completed within 100 milliseconds are perceived by the human brain as instantaneous.

For a URL redirect, the goal is to make the transition seamless, as if the user clicked directly on the final destination link. To achieve this "instantaneous" feeling, we must target the sub-100ms range.

**Architectural Implication**: To meet this target for a global user base, caching must be pushed to a **Content Delivery Network (CDN) or an edge network**. Serving requests from a centralized region would introduce unacceptable network latency for distant users.

This tight latency budget is the primary justification for using a **CDN or an edge network**. By placing a server (or at least a cache) physically close to the user, we dramatically reduce the Round Trip Time (RTT). This allows the DNS, TCP, and TLS steps to complete in a fraction of the time, preserving a significant portion of the 100ms budget for the actual application logic (the redirect lookup).

### Tiered SLO


While less common, a more advanced approach is to define tiered SLOs:

- **Normal Operation (< 12k QPS)**: p95 < 100ms.
- **Surge/Peak Event (> 12k QPS)**: The system should remain available, but the latency target might be relaxed to p99 < 500ms.

This acknowledges that under extreme, unexpected load, gracefully degrading performance is an acceptable trade-off to prevent a complete outage.

## Availability


For the Read Path's availability, I propose a baseline of **99.9%** for the MVP, which is achievable with a standard **single-region, multi-AZ** architecture.

Later, we can move to the **99.99%** level to accommodate future business requirements..

For example if we use url-shortener for High-Stakes, Time-Sensitive Campaigns

When short links are used for major, time-bound events, any downtime can lead to significant financial or reputational damage.

- **Reasoning**: Consider a link for a Black Friday sale, a Super Bowl ad, or a product launch announcement sent to millions of users. The link _must_ work during a very specific and high-traffic window.
- **Justification**: The potential lost revenue or marketing spend from even a few minutes of downtime during the peak of the campaign is greater than the cost of building a higher-availability system.
