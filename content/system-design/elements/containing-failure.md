---
draft: false
toc: true
title: "Containing Failure"
description: "Design question hub on stopping a slow or failing dependency from spreading: timeouts, retries with backoff, circuit breakers, bulkheads, load shedding, back pressure, degraded operation, and testing these controls with fault injection."
linkTitle: "Containing Failure"
---

**Question:** when a dependency is slow or failing, how do you stop the failure from spreading to its callers and the rest of the system?

[Reliability and availability]({{< ref "system-design/nfr/reliability-availability" >}}) covers redundancy and failover: keeping enough healthy capacity. This hub covers how a caller behaves when a call goes wrong.

## Forces


- **Availability:** in a synchronous chain, the request succeeds only if every service on the path does.
- **Latency:** a slow dependency is often worse than a failed one. Waiting callers hold threads and connections until they run out, and the slowdown moves upstream.
- **Correctness:** repeating a call can repeat its side effect.
- **Capacity:** retries add load to a dependency that is already struggling, and many clients retrying together can keep it down.

## Options


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Timeout | Bound how long the caller waits for a reply. | Every remote call. | Choosing the value; the operation may still complete on the other side after the caller gives up. |
| Retry with backoff and jitter | Repeat a failed call after increasing, randomized delays, within a limit or budget. | Transient failures. | Amplifies load; repeats side effects unless the operation is [idempotent]({{< ref "system-design/elements/communication" >}}#idempotent-consumer). |
| Circuit breaker | A proxy counts failures. Past a threshold it fails calls immediately for a period, then lets a trial request through to test recovery. | A dependency is likely to stay unavailable for a while; the caller must protect its own resources. | Needs a fallback or a clear error for the client; thresholds to tune. |
| Bulkhead | Separate resources such as thread pools, connection pools, or instances per dependency or per workload. | One dependency or tenant must not starve the others. | Lower utilization; deciding the partitions. |
| Load shedding and back pressure | Reject or slow incoming work when over capacity, close to the edge. | Overload, especially bursts. | Rejected work; clients must handle refusals, such as 429 and 503 responses. |
| Fail fast | Check that required resources are available before starting work that would fail later. | Expensive requests with checkable preconditions. | The check itself can be wrong or stale. |
| Fallback or degraded operation | Serve a cached, default, or partial result instead of an error. | A partial answer is more useful than none. | Stale or incomplete results. A fallback path rarely runs, so it is poorly tested and can fail when needed; the AWS Builders' Library warns about this. |

Choose these together. A retry inside a timeout inside a circuit breaker behaves differently from the same pieces arranged another way. Retries at several layers multiply.

## Testing the controls


A failure control that has never fired is a guess. Fault injection makes it fire on purpose.

- **At the network layer:** a [service mesh]({{< ref "system-design/elements/request-path" >}}#between-services-sidecar-and-service-mesh) can add a delay to, or return an error for, a chosen share of calls to one service, without code changes. Istio, for example, configures this per route. It tests whether timeouts, retries, circuit breakers, and fallbacks behave as designed.
- **As an experiment:** chaos engineering frames each test as a hypothesis about steady state, such as "checkout success stays above 99 percent if the recommendation service adds two seconds of latency". Start with a small blast radius, such as one header-selected test user or 1 percent of traffic, have a way to stop at once, and widen only when the hypothesis holds.
- **Limits:** network-level injection simulates slow and failing calls, not corrupted data, a full disk, or clock skew. Those need other tools or game days.

A fallback is the control most worth testing this way, because it rarely runs otherwise.

## Leads to


- Retries and redelivery lead to [idempotency]({{< ref "system-design/elements/communication" >}}#idempotent-consumer).
- A degraded mode needs a definition of what the client observes. Record it with the [NFRs]({{< ref "system-design/nfr/non-functional-requirements" >}}) for the affected operation.
- Asynchronous [messaging]({{< ref "system-design/elements/messaging" >}}) removes some synchronous dependencies altogether, at the cost of eventual consistency.
- A [service mesh]({{< ref "system-design/elements/request-path" >}}#between-services-sidecar-and-service-mesh) can apply timeouts, retries, and circuit breaking outside application code.
- Detecting these failures needs [metrics, tracing, and health checks]({{< ref "system-design/elements/operating-services" >}}#observability).

## Seen in cases


- [URL shortener]({{< ref "system-design/projects/url-shortener/url-shortener-additional" >}}#prepare-a-degradation-plan-for-the-cv-path): a degradation plan. When the database is overloaded, serve cached redirects, cache 404/410 responses briefly, and trip circuit breakers to protect latency.
- [Public chat room]({{< ref "system-design/projects/chat-room" >}}): an unresolved question about bursts that exceed a fixed buffer, which is a load-shedding or back-pressure decision.
- The [extended framework collection]({{< ref "system-design/interview/frameworks/sd-framework-old" >}}) lists missing discussion of retries, circuit breakers, and database failover among the most influential interview errors.
- **AI and RAG:** the tool runtime in the [boundary map]({{< ref "engineering/eng-exp/design-pressure" >}}) retries within bounds and normalizes errors, and the enforcement step validates invariants and then falls back or repairs. The [deterministic agent template]({{< ref "engineering/delivery-techniques/skeletons" >}}) caps recursion with a specific exception.

## Gaps


- Choosing timeout values from latency percentiles.
- Retry budgets and how retries at different layers interact.
- Cell-based architecture as a way to limit the scope of a failure.
- Separating robustness against anticipated disturbances from resilience to surprise (Woods).

## Sources


- [Circuit breaker](https://microservices.io/patterns/reliability/circuit-breaker.html) -- microservices.io. In the pattern language, this is the only pattern in the reliability group; the others come from Nygard and Newman.
- [CircuitBreaker -- Martin Fowler](https://martinfowler.com/bliki/CircuitBreaker.html).
- AWS Builders' Library: [timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/), [load shedding](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/), [avoiding fallback](https://aws.amazon.com/builders-library/avoiding-fallback-in-distributed-systems/).
- Nygard 2018: part I, stability antipatterns and stability patterns; chapter 17, chaos engineering. Newman 2021: chapter 12 (resiliency). Richardson 2019: chapter 3 (circuit breaker).
- [Fault injection -- Istio](https://istio.io/latest/docs/tasks/traffic-management/fault-injection/).
- [Principles of chaos engineering](https://principlesofchaos.org/).

## Library sources


- [Nygard 2018](/sources/system-design/reliability/nygard-2018-release-it-2nd-edition.pdf.enc), *Release It! Design and Deploy Production-Ready Software, Second Edition* -- part I; chapter 17 on *Testing the controls*
- [Newman 2021](/sources/system-design/microservices/newman-2021-building-microservices-2nd-edition.pdf.enc), *Building Microservices: Designing Fine-Grained Systems, Second Edition* -- chapter 12

Further reading:

- [Woods 2015](/sources/system-design/reliability/woods-2015-four-concepts-for-resilience.pdf.enc), *Four Concepts for Resilience and the Implications for the Future of Resilience Engineering* ([doi:10.1016/j.ress.2015.03.018](https://doi.org/10.1016/j.ress.2015.03.018))
- [AWS 2024](/sources/software-engineering/systems-and-operations/aws-2024-reducing-scope-of-impact-cell-based-architecture.pdf.enc), *Reducing the Scope of Impact with Cell-Based Architecture*
- [Richardson 2019](/sources/system-design/microservices/richardson-2019-microservices-patterns.pdf.enc), *Microservices Patterns: With Examples in Java* -- chapter 3
