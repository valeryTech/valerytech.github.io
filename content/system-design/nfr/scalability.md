---
draft: false
toc: true
title: "Scalability"
description: "How to state a scalability claim, link workload and bottlenecks to scaling moves (vertical scaling, duplication, partitioning, decomposition, caching, queues, autoscaling), and weigh the costs in performance, money, operability and functionality."
document_status: "canonical"
linkTitle: "Scalability"
---

Describe the workload, identify the constraint, and choose a way to extend capacity. The appropriate technique depends on what is limiting the system.

The [original reading notes]({{< ref "system-design/archive/scalability-reading-notes" >}}) retain longer excerpts and the complete source list.

## What scalability means


There is no single agreed definition. Duboc, Rosenblum and Wicks open their paper by calling scalability "poorly defined and poorly understood": often asserted, rarely validated. Phrases like "X is a scalable system" convey little more than "X is good" ([Duboc et al. 2007](/sources/software-engineering/systems-and-operations/duboc-2007-framework-software-system-scalability.pdf.enc)).

**A working definition.** Gorton sidesteps "definition wars": scalability is a system's capability to handle growth in some dimension of its operations. His examples of dimensions are concurrent requests, data volume, the value derived from stored data, and a stable response time as load grows. Unlike physical systems, software often needs to scale *down* as well, to cut cost ([Gorton 2022](/sources/software-engineering/systems-and-operations/gorton-2022-foundations-of-scalable-systems.pdf.enc)).

**Two senses of the word.** Weinstock and Goodenough found two uses in the literature ([Weinstock and Goodenough 2006](/sources/software-engineering/systems-and-operations/weinstock-2006-on-system-scalability.pdf.enc)):

1. The ability to handle increased workload *without adding resources*: headroom in the current configuration. Informal claims ("it handled a large model quickly") usually mean this.
2. The ability to handle increased workload *by repeatedly applying a cost-effective strategy for extending capacity*. Here what matters is the strategy for adding capacity and its cost, not the current headroom. The report concentrates on this sense.

Every system scales to some point, and none scales indefinitely, so a claim without bounds says nothing.

### State the claim precisely


Both papers conclude that "the system is scalable" means nothing on its own.

- **Demand and response bounds** (Weinstock and Goodenough): name one or more demand measures with an allowed range and one or more response measures with an allowed range. For example: "at least 10,000 simultaneous users with response delays never exceeding 1 second". Demand measures interact: a fix that admits more users can add database entries, or take memory from the database, so the system stays slow for a different reason ([p. 9](/sources/software-engineering/systems-and-operations/weinstock-2006-on-system-scalability.pdf.enc)). A scalability requirement should also limit the incremental cost of handling the extra load ([p. 10, note 4](/sources/software-engineering/systems-and-operations/weinstock-2006-on-system-scalability.pdf.enc)).
- **Scaling dimensions and dependent variables** (Duboc et al.): separate what grows (scaling dimensions such as concurrent users, input volume, or cluster nodes) from what is measured (dependent variables such as throughput, latency, memory, failures, or operating cost). Also list what is fixed or chosen to cope, such as the algorithm, thread-pool size, or machine configuration. Then speak of "scalability with respect to throughput" or "with respect to latency and memory consumption", never of scalability in general ([Duboc et al. 2007, §3.1](/sources/software-engineering/systems-and-operations/duboc-2007-framework-software-system-scalability.pdf.enc)).

### How capacity grows


- **Without adding resources** (the first sense). Tune or optimise: a better algorithm or data structure, an extra index, a faster runtime. Gorton calls this *optimization*, his second basic principle next to *replication* ([Gorton 2022](/sources/software-engineering/systems-and-operations/gorton-2022-foundations-of-scalable-systems.pdf.enc)). Or **do less work**: Weinstock and Goodenough list "decreasing the services it provides when the system is heavily loaded" as a way to raise capacity without new resources ([p. 13](/sources/software-engineering/systems-and-operations/weinstock-2006-on-system-scalability.pdf.enc)). See *Functionality versus scalability* below.
- **By adding resources** (the second sense). Replicate, partition, or decompose, as in the strategies below. Added units rarely add their full capacity because of overhead, and they can even slow the system at low load. Weinstock and Goodenough measure this as efficiency, the actual capacity of *n* units divided by *n* times the capacity of one. A design whose efficiency falls off slowly as units are added scales better in the second sense ([p. 14](/sources/software-engineering/systems-and-operations/weinstock-2006-on-system-scalability.pdf.enc)). Gorton calls systems whose capability grows exponentially while costs grow linearly *hyperscale* ([Gorton 2022](/sources/software-engineering/systems-and-operations/gorton-2022-foundations-of-scalable-systems.pdf.enc)).

## Define what grows


Record the units of work, request rates, data sizes, concurrency, read/write mix, and expected bursts. Tie the capacity discussion to latency or another relevant service target. These are Duboc's scaling dimensions and dependent variables. Distinguish the capacity available now from the strategy for extending it: Weinstock and Goodenough's first and second senses.

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

When discussing stateless application instances, explain where session or other required state lives and how a request can be handled by another instance. See [load balancing]({{< ref "system-design/elements/request-path" >}}#load-balancer) and [messaging]({{< ref "system-design/elements/messaging" >}}).

## Data partitioning


**Horizontal partitioning (sharding)** divides records across stores with the same schema. The partition key is a central design choice: examine the access patterns and the resulting distribution of requests and data.

**Vertical partitioning** divides fields according to how they are used, such as frequently and infrequently accessed fields.

Partitioning and redundancy answer different questions. Describe how each partition remains usable under the failures the design must tolerate.

## Patterns that address this


Choose a pattern after identifying the constraint. The options and their costs are in the building-block hubs:

- **Replication, partitioning, consistent hashing, and caching:** [data at scale]({{< ref "system-design/elements/data-at-scale" >}}). For caching, explain the selected data and invalidation behavior.
- **Queue-based load leveling and priority queues:** buffer bursts and serve classes of work by their requirements. See [why put a queue between services]({{< ref "system-design/elements/messaging" >}}#why-put-a-queue-between-services).
- **CQRS:** separate read and write models where their different needs justify the additional complexity. The reading notes discuss the relationship with event sourcing and the importance of hiding implementation details behind the service interface. See [data across services]({{< ref "system-design/elements/data-across-services" >}}#queries-that-need-several-services).
- **Asynchronous work:** consider which work can leave the request path and what the client observes before it completes. See [service communication]({{< ref "system-design/elements/communication" >}}).
- **Functional decomposition:** see [architecture style and service boundaries]({{< ref "system-design/elements/boundaries" >}}).
- **Load shedding and back pressure:** protect capacity during overload. See [containing failure]({{< ref "system-design/elements/containing-failure" >}}).

## Growth and autoscaling


Begin with a design appropriate to the current requirements and identify what would trigger the next change. The architecture used to get started may need revision at a later scale.

Distinguish predictable load, such as daily traffic patterns, from unexpected spikes. The notes discuss combining predictive and reactive scaling. Include the time needed to add useful capacity when reasoning about a burst.

## Trade-offs to revisit


- Latency versus throughput: what response time is acceptable at the required processing rate?
- Shared versus partitioned state: what coordination does the access pattern require?
- Availability and consistency: what behavior is needed during a failure? See [consistency questions]({{< ref "system-design/nfr/consistency" >}}).
- Complexity and growth: what evidence justifies a more involved scaling mechanism now?

### What scalability costs


Weinstock and Goodenough frame these as "To achieve scalability I have to give up what?" ([Weinstock and Goodenough 2006, §2.3](/sources/software-engineering/systems-and-operations/weinstock-2006-on-system-scalability.pdf.enc)):

- **Performance versus scalability:** accept some performance at low load in exchange for a higher ceiling. A design tuned for best-case performance at today's load may not grow. Decide how much to give up.
- **Cost versus scalability:** a scalable design usually costs more up front ("pay me now, or pay me later"). If demand never comes, the extra cost is wasted. If it comes and the cheaper design cannot grow, changing it may be impractical. Justifying the cost needs explicit scalability requirements and a life-cycle cost estimate under different growth scenarios.
- **Operability versus scalability:** very large systems exceed what people can operate by hand. Automation buys scale at the price of fine-grained human control.
- **Functionality versus scalability:** a system may handle more users or demand if it provides less service overall. Design levels of functionality that can be withdrawn under load. In the e-commerce study the report cites, the site served large amounts of static data from cache and shed personalization as load rose. This is the deliberate "do less work" route to capacity. Ask which features are essential at peak, which can be degraded or dropped, and how users see the reduced mode.

## Sources


- Ian Gorton, *Foundations of Scalable Systems* (2022).
- *Designing Fine-Grained Microservices*.
- [Data partitioning -- Microsoft](https://docs.microsoft.com/en-us/azure/architecture/best-practices/data-partitioning).
- [Sharding pattern -- Microsoft](https://docs.microsoft.com/en-us/azure/architecture/patterns/sharding).
- [Scaling services with Shard Manager -- Meta](https://engineering.fb.com/2020/08/24/production-engineering/scaling-services-with-shard-manager/).
- [Full excerpts and additional sources]({{< ref "system-design/archive/scalability-reading-notes" >}}).

## Library sources


- [Gorton 2022](/sources/software-engineering/systems-and-operations/gorton-2022-foundations-of-scalable-systems.pdf.enc), *Foundations of Scalable Systems: Designing Distributed Architectures* -- on *What scalability means*
- [Weinstock and Goodenough 2006](/sources/software-engineering/systems-and-operations/weinstock-2006-on-system-scalability.pdf.enc), *On System Scalability* -- on *What scalability means* and *What scalability costs*
- [Duboc et al. 2007](/sources/software-engineering/systems-and-operations/duboc-2007-framework-software-system-scalability.pdf.enc), *A Framework for Characterization and Analysis of Software System Scalability* -- on *State the claim precisely*

Further reading:

- [Atchison 2020](/sources/software-engineering/systems-and-operations/atchison-2020-architecting-for-scale.pdf.enc), *Architecting for Scale*
