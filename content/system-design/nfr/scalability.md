---
draft: false
toc: true
title: "Scalability"
description: "How to connect workload and bottlenecks to vertical scaling, duplication, partitioning, decomposition, caching, queues, autoscaling, and growth decisions."
document_status: "canonical"
linkTitle: "Scalability"
---

Describe the workload, identify the constraint, and choose a way to extend capacity. The appropriate technique depends on what is limiting the system.

The [original reading notes]({{< ref "system-design/archive/scalability-reading-notes" >}}) retain the competing definitions of scalability, longer excerpts, and complete source list.

## Define what grows


Record the units of work, request rates, data sizes, concurrency, read/write mix, and expected bursts. Tie the capacity discussion to latency or another relevant service target. Distinguish the capacity available now from the strategy for extending it.

Performance and scalability are related questions: how does an operation behave at the current load, and how does that behavior change as load or resources increase? Use an estimate when it helps locate a bottleneck or compare options.

## Four scaling strategies


| Strategy | Mechanism in the reading notes | Questions to examine |
| --- | --- | --- |
| Vertical scaling | Use a larger machine. | Which resource is limiting? What capacity and cost limits remain? |
| Horizontal duplication | Run multiple copies and distribute work among them. | How is work distributed? What state must be shared? Does a downstream dependency remain the bottleneck? |
| Data partitioning | Divide data and work by an attribute such as customer or key. | Does the key spread the actual workload? What happens to cross-partition operations and a busy partition? |
| Functional decomposition | Separate work by function so it can scale independently. | Which function has a distinct scaling need? What communication and coordination does the boundary introduce? |

These strategies can be combined. Use the combination that addresses the constraint; there is no requirement to apply every axis.

## Horizontal duplication


The reading notes give three examples:

- A load balancer distributing requests over application instances.
- A queue distributing work among competing consumers.
- Read replicas taking suitable read traffic away from a primary database.

When discussing stateless application instances, explain where session or other required state lives and how a request can be handled by another instance. See [load balancing]({{< ref "system-design/elements/elements" >}}#load-balancer) and [messaging]({{< ref "system-design/elements/messaging" >}}).

## Data partitioning


**Horizontal partitioning (sharding)** divides records across stores with the same schema. The partition key is a central design choice: examine the access patterns and the resulting distribution of requests and data.

**Vertical partitioning** divides fields according to how they are used, such as frequently and infrequently accessed fields.

Partitioning and redundancy answer different questions. Describe how each partition remains usable under the failures the design must tolerate.

## Patterns to consider after identifying the constraint


- **Queue-based load leveling:** buffer work to smooth intermittent demand. Explain the acceptable delay, backlog, and processing capacity. [Original pattern reference](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling).
- **Priority queues:** serve different classes of work according to their service requirements. [Original pattern reference](https://learn.microsoft.com/en-us/azure/architecture/patterns/priority-queue).
- **Caching:** reduce demand on the system holding the underlying data. Explain the selected data and invalidation behavior. See [caching notes]({{< ref "engineering/topics/caching" >}}).
- **CQRS:** separate read and write models where their different needs justify the additional complexity. The reading notes discuss the relationship with event sourcing and the importance of hiding implementation details behind the service interface.
- **Asynchronous work:** consider which work can leave the request path and what the client observes before it completes.

## Growth and autoscaling


Begin with a design appropriate to the current requirements and identify what would trigger the next change. The architecture used to get started may need revision at a later scale.

Distinguish predictable load, such as daily traffic patterns, from unexpected spikes. The notes discuss combining predictive and reactive scaling. Include the time needed to add useful capacity when reasoning about a burst.

## Trade-offs to revisit


- Latency versus throughput: what response time is acceptable at the required processing rate?
- Shared versus partitioned state: what coordination does the access pattern require?
- Availability and consistency: what behavior is needed during a failure? See [consistency questions]({{< ref "system-design/nfr/consistency" >}}).
- Complexity and growth: what evidence justifies a more involved scaling mechanism now?

## Sources


- Ian Gorton, *Foundations of Scalable Systems* (2022).
- *Designing Fine-Grained Microservices*.
- [Data partitioning -- Microsoft](https://docs.microsoft.com/en-us/azure/architecture/best-practices/data-partitioning).
- [Sharding pattern -- Microsoft](https://docs.microsoft.com/en-us/azure/architecture/patterns/sharding).
- [Scaling services with Shard Manager -- Meta](https://engineering.fb.com/2020/08/24/production-engineering/scaling-services-with-shard-manager/).
- [Full excerpts and additional sources]({{< ref "system-design/archive/scalability-reading-notes" >}}).
