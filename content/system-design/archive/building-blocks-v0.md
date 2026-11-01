---
draft: false
toc: true
title: "Building-Block Collection Before the Refactor"
description: "The building-block topics collected before the October 2026 refactor, rewritten as a map: how courses divide what to learn, Educative's building blocks and interviewing.io's concepts by hub, and where each original section now lives."
document_status: "archived"
linkTitle: "Building Blocks"
---

Part of the [system design archive]({{< ref "system-design/archive" >}}).

**Question:** where did each building-block topic collected before the refactor go, and how do the course lists of building blocks map onto the design-question hubs?

Before the October 19, 2026 refactor, this note collected four kinds of material:

- how courses divide what to learn;
- a study list;
- a template for describing a pattern;
- short entries on components.

The refactor moved each topic into a hub of the [pattern map]({{< ref "system-design/elements/elements" >}}). This version, rewritten on November 4, 2026, records what the collection held and where each part lives now. The original wording is in git history.

## How sources divide the material


Courses divide what to learn differently. The main difference is the unit each one teaches; the sources call it an element, a building block, a pattern, or a high-level strategy.

| Source | Unit | Structure |
| --- | --- | --- |
| [Hello Interview](https://www.hellointerview.com/learn/system-design/in-a-hurry/core-concepts) | A stage of preparation | Core concepts, then key technologies and patterns, then a delivery framework, then common problems and practice |
| [interviewing.io](https://interviewing.io/guides/system-design-interview) | A concept | Twelve fundamental concepts, [mapped below](#interviewingio-fundamental-concepts-by-hub) |
| Educative, *Grokking Modern System Design* | A component, designed once as a small system and then reused | Sixteen building blocks, [mapped below](#educative-building-blocks-by-hub) |
| [Azure architecture patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/) | A cloud design pattern | A catalog tagged by concern, such as messaging, resiliency, and data management |
| *Designing Data-Intensive Applications*, second edition | A data system trade-off | Chapters on storage, replication, sharding, transactions, and consistency |
| [microservices.io](https://microservices.io/patterns/index.html) | A pattern in a language | Groups of patterns, each one's consequences leading to the next |

A component list says what exists, but it does not say when to use a component or what it costs. The pattern map uses the design question as its unit. Each hub asks one question, and a component appears as an option with the conditions under which it fits and the next question it raises. Any course list can be read through the hubs, which is what the two tables below do.

**Hello Interview's stages in these notes:**

- **Core concepts and patterns:** the hubs and the [NFR notes]({{< ref "system-design/nfr" >}}).
- **Key technologies:** the engineering topic notes listed in [where detail lives]({{< ref "system-design/elements/elements" >}}#where-detail-lives).
- **Delivery framework:** the [Hello Interview framework]({{< ref "system-design/interview/frameworks/framework-hi" >}}).
- **Common problems:** the [practice cases]({{< ref "system-design/projects" >}}).
- **Practice:** the [practice loop]({{< ref "system-design/interview/study-and-practice" >}}#a-practice-loop).

**The collection's own split** had five layers:

1. Foundational knowledge.
2. Key characteristics of systems, now the [NFR notes]({{< ref "system-design/nfr" >}}).
3. Components such as load balancers, caches, proxies, and leader election, now options in the hubs.
4. Real tools and products, now the engineering topic notes.
5. Patterns, now the hubs.

## interviewing.io fundamental concepts by hub


| Concept | Where it lives |
| --- | --- |
| APIs | [Contracts and API design]({{< ref "system-design/elements/communication" >}}#contracts-and-api-design) |
| Databases: SQL versus NoSQL | Storage choice in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| Scaling | [Scalability]({{< ref "system-design/nfr/scalability" >}}) and [data at scale]({{< ref "system-design/elements/data-at-scale" >}}) |
| CAP theorem | [CAP and PACELC]({{< ref "engineering/distributed-systems/guarantees" >}}#cap-and-pacelc) |
| Web authentication and basic security | [Security]({{< ref "system-design/elements/operating-services" >}}#security) |
| Load balancers | [Load balancer]({{< ref "system-design/elements/request-path" >}}#load-balancer) |
| Caching | Caching in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| Message queues | [Messaging]({{< ref "system-design/elements/messaging" >}}) |
| Indexing | [Indexes]({{< ref "system-design/elements/data-at-scale" >}}#indexes) |
| Failover | [Reliability and availability]({{< ref "system-design/nfr/reliability-availability" >}}) |
| Replication | Replication in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| Consistent hashing | Partitioning in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) |

## Educative building blocks by hub


Educative designs each building block once, as a small system with its own requirements, so later designs can reuse it without repeating the detail.

| Building block | Where it lives | Coverage |
| --- | --- | --- |
| Domain Name System | [DNS]({{< ref "system-design/elements/request-path" >}}#dns) | Routing uses, TTL costs, and anycast |
| Load balancers | [Load balancer]({{< ref "system-design/elements/request-path" >}}#load-balancer) and [service discovery]({{< ref "system-design/elements/request-path" >}}#service-discovery) | Policies and pool discovery |
| Databases | Storage choice, replication, and partitioning in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) | Options rows |
| Key-value store | [Key-value stores and data grids]({{< ref "system-design/elements/data-at-scale" >}}#key-value-stores-and-data-grids) and the [key-value store case]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design) | Section and a Dynamo-style design |
| Content delivery network | [CDN]({{< ref "system-design/elements/request-path" >}}#cdn) | Short definition |
| Sequencer | Unique ID generation in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) and the [Snowflake IDs case]({{< ref "system-design/projects/infra/slowflake-id" >}}) | Options row and case. Educative's focus on causality connects to [logical clocks]({{< ref "system-design/elements/data-at-scale" >}}#coordination). |
| Service monitoring | [Observability]({{< ref "system-design/elements/operating-services" >}}#observability) | Patterns listed |
| Distributed caching | Caching in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) | Options row |
| Distributed messaging queue | [Messaging]({{< ref "system-design/elements/messaging" >}}) | Pattern note |
| Publish-subscribe system | [Messaging]({{< ref "system-design/elements/messaging" >}}) and [communication]({{< ref "system-design/elements/communication" >}}) | Pattern note |
| Rate limiter | [Rate limiting across nodes]({{< ref "system-design/elements/data-at-scale" >}}#rate-limiting-across-nodes) and the [rate limiter case]({{< ref "system-design/projects/rate-limiter" >}}) | Section and case |
| Blob store | Object storage under storage choice in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) | Named only |
| Distributed search | [Search index]({{< ref "system-design/elements/data-at-scale" >}}#search-index) | Section |
| Distributed logging | Log aggregation under [observability]({{< ref "system-design/elements/operating-services" >}}#observability) | Named only |
| Distributed task scheduling | [Task queues and scheduling]({{< ref "system-design/elements/messaging" >}}#task-queues-and-scheduling) and the [job scheduler case]({{< ref "system-design/projects/job-scheduler" >}}) | Section and a design sketch |
| Sharded counters | Hot-key splitting in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) | Options row |

## Study list


| Topic | Where it lives |
| --- | --- |
| Building blocks | The [hubs]({{< ref "system-design/elements/elements" >}}#the-hubs) |
| Reasoning about non-functional requirements | [NFR guide]({{< ref "system-design/nfr/non-functional-requirements" >}}) |
| Common trade-offs, kept in one list and refined with practice | [Common trade-offs]({{< ref "system-design/elements/common-trade-offs" >}}) |
| Asynchronous patterns, communication, and protocols | [Communication]({{< ref "system-design/elements/communication" >}}) and [messaging]({{< ref "system-design/elements/messaging" >}}). The collection proposed communication and protocols as a category of its own; it became the communication hub. |
| Distributed coordination, transactions, and sagas | [Operations that change several services]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services) and [coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination) |
| Common technical problems | [Practice cases]({{< ref "system-design/projects" >}}) |
| Data and databases | [Data at scale]({{< ref "system-design/elements/data-at-scale" >}}) |
| API construction | [Contracts and API design]({{< ref "system-design/elements/communication" >}}#contracts-and-api-design) |
| Vector clocks | [Coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination) |
| Stateless services and idempotent APIs as the basis of scalability | Stateless instances in [scalability]({{< ref "system-design/nfr/scalability" >}}); [idempotent consumer]({{< ref "system-design/elements/communication" >}}#idempotent-consumer) |
| MapReduce and scatter-gather | Batch processing and scatter-gather in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options), with [tail latency]({{< ref "system-design/elements/data-at-scale" >}}#scatter-gather-and-tail-latency) |
| Consistent hashing | Partitioning in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) |

## Pattern template


The collection described a pattern with six fields. The [pattern note format]({{< ref "system-design/elements/elements" >}}#hub-and-pattern-format) keeps five of them and adds one.

| Original field | Pattern note field |
| --- | --- |
| Definition and the problems it solves | The problem it solves and a concrete use case |
| Algorithm, with a scenario | How it works, including the important request or data flow |
| Rule of thumb for when to use it | The assumptions and constraints under which it is useful; the hub's *Fits when* column |
| Trade-offs and analogues | Trade-offs, failure behavior, and alternatives |
| Specific implementations | Relevant implementations and examples from practice cases |
| *(none)* | What it leads to: the problems it creates and the patterns that address them |

The added field is what links one pattern to the next, which turns a catalog into a language.

## Component entries


| Original section | What it held | Where it lives |
| --- | --- | --- |
| DNS | A to-do: describe DNS and its use in an interview. | [DNS]({{< ref "system-design/elements/request-path" >}}#dns) |
| CDN | A definition: distributed proxy servers serve content from locations closer to users. Two gains: users get content from nearby data centers, and origin servers skip the requests the CDN fulfills. | [CDN]({{< ref "system-design/elements/request-path" >}}#cdn) |
| Load balancer | Purpose: redundancy, reliability, and performance. Terms: the policy, or server selection strategy, and the backend pool. Policies: random, round robin, weighted round robin, load- or timeout-based, least connections, IP hashing, path-based, and combinations. Levels: L4 and L7. Service discovery: a static file of addresses is hard to keep current, so servers register with a coordination service such as etcd or ZooKeeper under a time-to-live and drop out when they stop renewing. Examples: NGINX and HAProxy. | [Load balancer]({{< ref "system-design/elements/request-path" >}}#load-balancer) and [service discovery]({{< ref "system-design/elements/request-path" >}}#service-discovery) |
| Proxy | A forward proxy acts for clients and a reverse proxy for servers. Uses: filtering, logging, caching, load balancing, and changing requests and responses. | [Proxy]({{< ref "system-design/elements/request-path" >}}#proxy) |
| API gateway | A link, with a to-do on trade-offs. | [API gateway]({{< ref "system-design/elements/api-gateway" >}}) and [external API]({{< ref "system-design/elements/request-path" >}}#external-api) |
| Pub/sub | A to-do on operational problems such as consumer rebalancing. | [Consumer groups and rebalancing]({{< ref "system-design/elements/messaging" >}}#consumer-groups-and-rebalancing) |
| Asynchronism | Message queues and task queues. | [Messaging]({{< ref "system-design/elements/messaging" >}}) and [task queues and scheduling]({{< ref "system-design/elements/messaging" >}}#task-queues-and-scheduling) |
| Sidecar | Functionality split out of the application into a separate process. | [Sidecar and service mesh]({{< ref "system-design/elements/request-path" >}}#between-services-sidecar-and-service-mesh) |
| Service mesh | Moves the complexity of many services into an infrastructure layer: load balancing, discovery, traffic management, circuit breaking, telemetry, and fault injection. | [Sidecar and service mesh]({{< ref "system-design/elements/request-path" >}}#between-services-sidecar-and-service-mesh), [control plane]({{< ref "system-design/elements/control-plane" >}}), and fault injection in [testing the controls]({{< ref "system-design/elements/containing-failure" >}}#testing-the-controls) |
| Distributed computation | A heading only. | Batch processing and scatter-gather in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| Key-value store | In-memory data grids, as a heading. | [Key-value stores and data grids]({{< ref "system-design/elements/data-at-scale" >}}#key-value-stores-and-data-grids) and the [key-value store case]({{< ref "system-design/projects/key-value-store" >}}) |
| Rate limiting | Distributing the limiter is the hard part; limits per tier are harder still. | [Rate limiting across nodes]({{< ref "system-design/elements/data-at-scale" >}}#rate-limiting-across-nodes) and the [rate limiter case]({{< ref "system-design/projects/rate-limiter" >}}#limits-by-tier) |
| Security | Security as a trade-off between total safety, a wall, and total convenience, a hole in the wall. Authentication, which establishes who is calling, separated from authorization. Two checks at a door, the peephole and a password, as the picture for multi-factor authentication. Storing password hashes, salting, and rainbow tables. Sources: Newman and the interviewing.io guide. | [Security]({{< ref "system-design/elements/operating-services" >}}#security), including password storage |
| Sequencer | A link to Educative's lesson. | Unique ID generation in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| Templates | Hello Interview's simple CRUD service pattern, the DesignGurus master template, and the control plane with other frameworks used in production. | [Not yet placed]({{< ref "system-design/elements/elements" >}}#not-yet-placed) and the [control plane]({{< ref "system-design/elements/control-plane" >}}) |

## Topics filled after the rewrite


When this note was rewritten, no hub explained the topics below. Later the same day each was written into the note that should hold it. Gaps that remain are listed in each hub's own Gaps section.

| Topic | Now in |
| --- | --- |
| CAP theorem, PACELC, and consistency models | [Consistency guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}#cap-and-pacelc) |
| Indexing | [Indexes]({{< ref "system-design/elements/data-at-scale" >}}#indexes) |
| Sharded counters | Hot-key splitting in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) |
| Distributed search | [Search index]({{< ref "system-design/elements/data-at-scale" >}}#search-index) |
| MapReduce and scatter-gather | [Data at scale]({{< ref "system-design/elements/data-at-scale" >}}#scatter-gather-and-tail-latency) |
| Distributed coordination and vector clocks | [Coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination) |
| Key-value stores and in-memory data grids | [Key-value stores and data grids]({{< ref "system-design/elements/data-at-scale" >}}#key-value-stores-and-data-grids) and the [key-value store case]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design) |
| Rate limiting across nodes and by tier | [Rate limiting across nodes]({{< ref "system-design/elements/data-at-scale" >}}#rate-limiting-across-nodes) and the [rate limiter case]({{< ref "system-design/projects/rate-limiter" >}}#enforcement-across-nodes) |
| DNS | [DNS]({{< ref "system-design/elements/request-path" >}}#dns) |
| Fault injection in a service mesh | [Testing the controls]({{< ref "system-design/elements/containing-failure" >}}#testing-the-controls) |
| Consumer rebalancing | [Consumer groups and rebalancing]({{< ref "system-design/elements/messaging" >}}#consumer-groups-and-rebalancing) |
| Task queues and distributed task scheduling | [Task queues and scheduling]({{< ref "system-design/elements/messaging" >}}#task-queues-and-scheduling) and the [job scheduler case]({{< ref "system-design/projects/job-scheduler" >}}#a-design-sketch) |
| Password hashing, salting, and rainbow tables | [Security]({{< ref "system-design/elements/operating-services" >}}#security) |
| One list of common trade-offs | [Common trade-offs]({{< ref "system-design/elements/common-trade-offs" >}}) |

## Sources


- [Hello Interview: core concepts](https://www.hellointerview.com/learn/system-design/in-a-hurry/core-concepts), [key technologies](https://www.hellointerview.com/learn/system-design/in-a-hurry/key-technologies), and [delivery framework](https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery).
- [interviewing.io system design interview guide](https://interviewing.io/guides/system-design-interview).
- [Introduction to building blocks for modern system design -- Educative](https://www.educative.io/courses/grokking-the-system-design-interview/introduction-to-building-blocks-for-modern-system-design).
- [Sequencer -- Educative](https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/system-design-sequencer).
- [System-design master template -- DesignGurus](https://www.designgurus.io/course-play/grokking-the-system-design-interview/doc/system-design-master-template).
- [Azure architecture patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/).
- [System Design Primer](https://github.com/donnemartin/system-design-primer), named in the collection as a source of patterns such as MapReduce, consistent hashing, and scatter-gather.
- [Designing Data-Intensive Applications, second edition -- O'Reilly](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/).

## Library sources


- Educative 2023, *Grokking Modern System Design Interview for Engineers and Managers* -- the sixteen building blocks in *Educative building blocks by hub*
- [Design Gurus 2019](/sources/system-design/interviews/designgurus-2019-grokking-the-system-design-interview.pdf.enc), *Grokking the System Design Interview* -- the basics part works as a glossary of building blocks
- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- the book the collection named
- [Newman 2021](/sources/system-design/microservices/newman-2021-building-microservices-2nd-edition.pdf.enc), *Building Microservices: Designing Fine-Grained Systems, Second Edition* -- chapter 11, security, named in the security entry
