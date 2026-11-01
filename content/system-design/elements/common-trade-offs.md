---
draft: false
toc: true
title: "Common Trade-offs in System Design"
description: "The trade-offs that recur across system design problems: what each side gains and costs, the signal that tips the choice, and the hub where the decision is made."
document_status: "draft"
linkTitle: "Common Trade-offs"
---

**Question:** which trade-offs come up in almost every design, and what decides each one?

Each hub's options table holds the trade-offs for its own question. The same few pairs recur across hubs and cases, and the [mock-interview observations]({{< ref "system-design/archive/mock-interview-observations-v0" >}}) name them as the ones interviewers probe. This note lists them in one place. Refine it as practice shows which signals matter.

For the method of analysing a single trade-off (objectives, criteria, alternatives, and a recorded decision), see [trade-off analysis]({{< ref "engineering/topics/trade-offs" >}}).

## The trade-offs


| Trade-off | First side gains | Second side gains | The signal that tips it | Decided in |
| --- | --- | --- | --- | --- |
| Consistency versus availability and latency | Every read is current; no conflicts to resolve. | Answers during a partition; no wait for replicas. | The cost of a wrong or stale answer, such as a double booking, against the cost of no answer. | [CAP and PACELC]({{< ref "engineering/distributed-systems/guarantees" >}}#cap-and-pacelc) |
| Relational versus access-pattern-shaped storage (SQL versus NoSQL) | Ad hoc queries, joins, constraints, and transactions. | Predictable horizontal scaling for known access patterns. | Whether the access patterns are known and stable, and whether writes exceed one node. | [Storage choice]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| Synchronous versus asynchronous | A simple flow with an immediate result. | Decoupling, buffering of bursts, and independent failure. | Whether the caller needs the result to continue. | [Communication]({{< ref "system-design/elements/communication" >}}#options) |
| Push versus poll | The client sees changes sooner. | No long-lived connections to hold. | How fresh updates must be, and how many clients are connected. | [Push versus poll]({{< ref "system-design/elements/communication" >}}#push-versus-poll) |
| Fan-out on write versus on read | Reads are fast: each user's feed is ready. | Writes are cheap: nothing is copied. | The follower distribution. A hybrid pushes for most users and pulls for accounts with millions of followers. | [Precompute versus compute on read](#precompute-versus-compute-on-read) |
| Freshness versus cache hit rate | Reads are current. | Lower latency and load on the source. | How long each operation can tolerate a stale value. | [Caching]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| Normalize versus denormalize | One copy of each fact; simple writes. | Reads without joins. | The read-to-write ratio and the cost of joins at the data size. | [Storage choice]({{< ref "system-design/elements/data-at-scale" >}}#options) and [CQRS]({{< ref "system-design/elements/data-across-services" >}}#queries-that-need-several-services) |
| Precompute versus compute on read | Fast, predictable reads. | No storage or work for results nobody reads; always current. | How often a result is read compared with how often its inputs change. | [Batch processing]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| One deployable unit versus several services | One build, one transaction scope, simple debugging. | Independent deployment, scaling, and team ownership. | A force that demands the split, such as a team or release schedule of its own. | [Boundaries]({{< ref "system-design/elements/boundaries" >}}) |
| Exact versus approximate | Correct numbers. | Small, fixed memory and speed: HyperLogLog, count-min sketches, sampling. | Whether a user or a contract depends on the exact number, as billing does and a view count does not. | [Hot-key splitting]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| Latency versus throughput | Each item is handled at once. | Batching cuts round trips and cost per item. | The latency budget against the cost per call. | [Scalability]({{< ref "system-design/nfr/scalability" >}}#trade-offs-to-revisit) |
| Stateless versus stateful services | Instances can be added, replaced, and load balanced freely. | No extra hop to a store; state stays near the computation. | Whether the state can live in a shared store within the latency budget. | [Horizontal duplication]({{< ref "system-design/nfr/scalability" >}}#horizontal-duplication) |
| Managed versus self-hosted | Less operations work and a faster start. | Control, cost at large scale, and no lock-in. | The team's operating capacity and the scale at which the managed price exceeds the cost of running it. | [Deployment]({{< ref "system-design/elements/operating-services" >}}#deployment) |
| Simple now versus general for later | Less to build and understand. | No rework when the anticipated need arrives. | Evidence that the need will arrive, and the cost of the move when it does. | [Defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}) |

## Precompute versus compute on read


A news feed is the standard example. Fan-out on write copies each new post into the feed of every follower when it is created, so reading a feed is a single lookup. Fan-out on read assembles the feed from the followed accounts when the user opens it. Writing is then cheap, but reading is slow. An account with millions of followers makes fan-out on write expensive, so a common design pushes posts from ordinary accounts and merges posts from very large accounts at read time.

The same choice appears with materialized views, leaderboards, and search indexes: each is a precomputed answer kept up to date by the writes.

## Using the list


- In a design, name the trade-off, the side chosen, and the signal from the requirements that chose it. That is one sentence per decision.
- Record the signal that would reverse the choice as a trigger; see [defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}).
- Most trade-offs are decided per operation, not per system. A booking and a feed in the same product can sit on opposite sides.

## Library sources


- [Weinstock and Goodenough 2006](/sources/09470289da9930a37201c614f7ea89ea.bin), *On System Scalability* -- what scalability costs, quoted in [scalability]({{< ref "system-design/nfr/scalability" >}}#what-scalability-costs)
- [Kleppmann and Riccomini 2026](/sources/f639f3efb30ff1f78d5f3bec89441c6e.bin), *Designing Data-Intensive Applications, Second Edition* -- chapter 1, data systems architecture as trade-offs; chapter 2, the home-timeline case study, on *Precompute versus compute on read*
- [Ford et al. 2022](/sources/08f60e529d971e5ad6408c46accea44c.bin), *Software Architecture: The Hard Parts* -- trade-off analysis for distributed architectures
