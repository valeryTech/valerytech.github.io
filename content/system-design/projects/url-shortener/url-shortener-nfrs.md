---
draft: false
toc: true
title: "URL Shortener: NFR Explorations"
description: "A comparison of URL-shortener quality-target proposals, connecting workload, latency, availability, consistency, lifecycle behavior, measurement, and architectural implications."
linkTitle: "NFR Explorations"
---

The notes contain two proposed target sets. Keep them distinct and choose an explicit set for each design attempt. These are practice assumptions, not measurements or guarantees of a particular deployment.

## Alternative target sets


| Area | Hello Interview variant recorded in the notes | Personal v1 proposal |
| --- | --- | --- |
| Workload | 1 billion links and 100 million daily active users | Read-heavy; explore tens of thousands of read QPS at peak |
| Resolve latency | Less than 100 ms; percentile and measurement boundary need clarification | p95 below 100 ms for cached redirects |
| Resolve availability | 99.99% | 99.9%, with a reason to examine a higher target if business needs require it |
| Consistency | Prioritize availability where appropriate | Explore asynchronous global propagation while defining post-create visibility |
| Uniqueness | A short code maps to a single destination | Enforce the same invariant in the write path |

The scale discussion also considers a base62 keyspace and sufficient code capacity for at least a billion mappings. Code length is one question; allocation and collision handling still need an explanation.

## Make the targets usable


For each target, connect user value, measurement, and a design implication. Follow the [general NFR method]({{< ref "system-design/nfr/non-functional-requirements" >}}).

**Resolve latency:** clarify cached versus uncached requests and the end-to-end boundary. Explain how the hot path meets the selected target.

**Availability:** define eligible requests, successful outcomes, timeouts, and where measurement occurs. The earlier proposal uses successful redirects divided by eligible resolve requests, measured at the edge. Confirm how valid not-found or expired responses are classified.

**Consistency:** specify behavior by operation. If a write is acknowledged before propagation finishes, what does an immediate resolve in another region do? Which uniqueness guarantees must still hold at creation?

**Lifecycle:** if a link expires or is deactivated, how long may a cached mapping remain usable?

**Basic operations and abuse controls:** the personal proposal includes rate limits, reserved aliases, domain blocking, resolve success/latency metrics, and structured create errors. Decide which are in scope. The recorded Hello Interview variant leaves analytics consistency and advanced malicious-link filtering outside the initial exercise.

## Availability and architecture


The earlier reasoning maps availability percentages to deployment recipes such as multi-AZ, edge caching, and multi-region active/active. Keep these as candidate mechanisms to evaluate. A percentage alone does not establish either a necessary architecture or an achieved service level.

Discuss the failure model, dependency availability, recovery behavior, cache semantics, cost, and operational burden. If a higher target matters for paid campaigns, partner commitments, or another user need, explain that need before adding complexity.

For a time-based SLI over a 30-day period, 99.9% corresponds to 43.2 minutes outside the target and 99.99% to 4.32 minutes. For a request-based SLI, the budget is a fraction of eligible requests instead. Choose the measurement before interpreting the budget.

## Use requirements in two passes


1. Establish the important qualities and assumptions before architecture.
2. Return to them during deep dives, identify where the baseline falls short, and refine the design.

Give numbers when they distinguish choices; otherwise state the uncertainty and identify the decision the missing value would affect. Targets for creation, management, or other secondary paths can also matter when their requirements demand it.

## Additional reasoning


- [Consistency and NFR draft]({{< ref "system-design/projects/url-shortener/url-shortener-nfrs-v0" >}}): user archetypes, replication, outbox, PACELC, read scale, and latency tiers.
- [Requirements and user/business context]({{< ref "system-design/projects/url-shortener/url-shortener-useful" >}}).
- [Earlier NFR reasoning]({{< ref "system-design/archive/url-shortener-nfrs-before-refactor" >}}): retains the original architecture table, scripts, and decision tree.
- [Working design]({{< ref "system-design/projects/url-shortener/url-shortener" >}}).
