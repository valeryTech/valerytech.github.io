---
draft: false
toc: true
title: "Design Questions and Pattern Map"
description: "A map of system design building blocks organized as design questions, with the hub and pattern note format, how the questions lead into each other, and where detailed notes live."
document_status: "canonical"
linkTitle: "Pattern Map"
---

The building blocks are organized as design questions, following the structure of a pattern language such as [microservices.io](https://microservices.io/patterns/index.html). Each hub states one question, the forces that bear on it, and the competing options. Each option changes the design in a way that raises the next question. Following those links from one hub to the next is what makes the collection a language rather than a catalog.

The [original topic collection]({{< ref "system-design/archive/building-blocks-v0" >}}) records where each pre-refactor topic went and maps the Educative and interviewing.io building-block lists onto these hubs.

## The hubs


| Hub | Question |
| --- | --- |
| [Architecture style and service boundaries]({{< ref "system-design/elements/boundaries" >}}) | One deployable unit or several? Where do the boundaries go? How do you migrate? |
| [Data across services]({{< ref "system-design/elements/data-across-services" >}}) | Who owns the data? How do operations and queries span services? How are changes published reliably? |
| [Service communication]({{< ref "system-design/elements/communication" >}}) | Synchronous or asynchronous? Which mechanism? How are duplicates handled? |
| [The request path]({{< ref "system-design/elements/request-path" >}}) | How does a request reach a healthy instance of the right service? |
| [Containing failure]({{< ref "system-design/elements/containing-failure" >}}) | How do you stop a slow or failing dependency from spreading? |
| [Data at scale]({{< ref "system-design/elements/data-at-scale" >}}) | How do you store and serve more than one machine can? |
| [Operating services]({{< ref "system-design/elements/operating-services" >}}) | What does each service need to be deployed, configured, observed, secured, and tested? |

**Where the microservices.io groups went:**

| microservices.io group | Hub |
| --- | --- |
| Architectural style, service boundaries, refactoring to services | [Boundaries]({{< ref "system-design/elements/boundaries" >}}) |
| Service collaboration, transactional messaging | [Data across services]({{< ref "system-design/elements/data-across-services" >}}) |
| Communication styles | [Communication]({{< ref "system-design/elements/communication" >}}) |
| External API, service discovery | [Request path]({{< ref "system-design/elements/request-path" >}}) |
| Reliability | [Containing failure]({{< ref "system-design/elements/containing-failure" >}}), extended with Nygard's and Newman's patterns |
| Deployment, cross-cutting concerns, observability, security, testing, UI design | [Operating services]({{< ref "system-design/elements/operating-services" >}}) |
| *(not covered)* | [Data at scale]({{< ref "system-design/elements/data-at-scale" >}}): replication, partitioning, caching, identifiers, rate limiting |

## Hub and pattern format


**Each hub:**

1. **Question:** the problem the options answer.
2. **Forces:** the qualities and constraints that push toward one option or another. Link the relevant [NFR notes]({{< ref "system-design/nfr" >}}); a quality is a force, not a container for patterns.
3. **Options:** for each pattern, how it works, when it fits, and what it costs, including the next question it raises.
4. **Leads to:** the hubs those consequences point to.
5. **Seen in cases:** where a [practice case]({{< ref "system-design/projects" >}}) uses or needs the pattern.
6. **Gaps:** what is not yet understood or written.
7. **Sources:** the pattern pages and book chapters.

**A single pattern** gets its own note only when there is substantial material for it, as with the [API gateway]({{< ref "system-design/elements/api-gateway" >}}) and [messaging]({{< ref "system-design/elements/messaging" >}}). Until then it lives as a row in its hub. For such a note, record:

1. The problem it solves and a concrete use case.
2. How it works, including the important request or data flow.
3. The assumptions and constraints under which it is useful.
4. Trade-offs, failure behavior, and alternatives.
5. What it leads to: the problems it creates and the patterns that address them.
6. Relevant implementations and examples from practice cases.

Keep concepts separate from product names. Use a specific implementation to deepen the explanation when its behavior matters.

## How the questions connect


Four chains run through the hubs. Each step is a consequence of the one before.

1. **Splitting data:** [microservices]({{< ref "system-design/elements/boundaries" >}}) -> [database per service]({{< ref "system-design/elements/data-across-services" >}}#who-owns-the-data) -> [sagas]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services) and [API composition or CQRS]({{< ref "system-design/elements/data-across-services" >}}#queries-that-need-several-services) -> [domain events]({{< ref "system-design/elements/data-across-services" >}}#representing-change) -> [transactional outbox]({{< ref "system-design/elements/data-across-services" >}}#publishing-changes-reliably) -> [idempotent consumer]({{< ref "system-design/elements/communication" >}}#idempotent-consumer).
2. **Calling across the network:** [remote procedure invocation]({{< ref "system-design/elements/communication" >}}#options) -> [service discovery]({{< ref "system-design/elements/request-path" >}}#service-discovery) and an [API gateway]({{< ref "system-design/elements/request-path" >}}#external-api) -> [timeouts, retries, and circuit breakers]({{< ref "system-design/elements/containing-failure" >}}) -> [idempotency]({{< ref "system-design/elements/communication" >}}#idempotent-consumer).
3. **Running many services:** [more deployable units]({{< ref "system-design/elements/boundaries" >}}) -> [a deployment platform]({{< ref "system-design/elements/operating-services" >}}#deployment) -> [a chassis or a service mesh]({{< ref "system-design/elements/operating-services" >}}#cross-cutting-concerns) -> [distributed tracing]({{< ref "system-design/elements/operating-services" >}}#observability).
4. **Growing one service's data:** [growth]({{< ref "system-design/nfr/scalability" >}}) -> [replication, partitioning, and caching]({{< ref "system-design/elements/data-at-scale" >}}) -> [consistency questions]({{< ref "system-design/nfr/consistency" >}}) -> [reliable propagation to caches and replicas]({{< ref "system-design/elements/data-across-services" >}}#publishing-changes-reliably).

For prototyping, [defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}) gives one starting option per hub, the signal to move past it, and the technique that tests the move. [Common trade-offs]({{< ref "system-design/elements/common-trade-offs" >}}) lists the pairs that recur across hubs.

## Same patterns in other domains


The same forces recur at other scales and in other kinds of systems. Some rows below are close correspondences; others are interpretations, marked as such.

| System design pattern | In the engineering notes | In AI and RAG designs |
| --- | --- | --- |
| Start with one deployable unit and split when a force demands it ([boundaries]({{< ref "system-design/elements/boundaries" >}})) | Model concrete workflows before committing to shared abstractions: [premature abstraction]({{< ref "engineering/premature-abstraction" >}}), [YAGNI]({{< ref "engineering/architecture/yagni" >}}), [AHA]({{< ref "engineering/aha-programming" >}}). The same force acts at module scale, as in Khononov's view of coupling at every scale. | Independently testable modules in the [boundary map for a RAG and tool assistant]({{< ref "engineering/eng-exp/design-pressure" >}}) |
| Contracts between services and consumer-driven contract tests ([communication]({{< ref "system-design/elements/communication" >}}#contracts-and-api-design), [testing]({{< ref "system-design/elements/operating-services" >}}#testing)) | Contracts and invariants in the [test strategy]({{< ref "engineering/topics/tests/test-strategy-foundations" >}}) | Tools and retrieval treated as versioned APIs with error semantics; tests as an architectural force ([design pressure]({{< ref "engineering/eng-exp/design-pressure" >}})) |
| One entry point that routes and applies shared policies ([request path]({{< ref "system-design/elements/request-path" >}})) | n/a | The request-and-routing module of the boundary map; layers 0-2 of the RAG runtime: normalization, policy, routing and planning |
| Bounded retries, fallbacks, and caps ([containing failure]({{< ref "system-design/elements/containing-failure" >}})) | n/a | Bounded retries in the tool runtime; fallback or repair after invariant checks; the recursion limit in the deterministic agent template |
| System of record versus a derived view ([data across services]({{< ref "system-design/elements/data-across-services" >}}#queries-that-need-several-services)) | n/a | "Authoritative tools beat doc retrieval" in the RAG runtime; the index with freshness targets, versioning, and invalidation. Reading the index as a CQRS-style read model is an interpretation. |
| Service template versus microservice chassis; externalized configuration ([operating services]({{< ref "system-design/elements/operating-services" >}}#cross-cutting-concerns)) | [Golden paths]({{< ref "engineering/delivery-techniques/skeletons" >}}), which prefer copied scaffolding to an internal library; [Twelve-Factor]({{< ref "engineering/platform/twelve-factor" >}}); the service-readiness layer of the [operating model]({{< ref "engineering/platform/operating-model" >}}) | The observable RAG, deterministic agent, and eval harness templates |
| Gradual release and change tracking ([operating services]({{< ref "system-design/elements/operating-services" >}}#deployment)) | Feature flags, canaries, and dark launches in the [lifecycle techniques]({{< ref "engineering/architecture/techniques" >}}) and [deployment notes]({{< ref "engineering/platform/deployment" >}}) | Blast-radius control through versioned prompts, models, indexes, and tool schemas released behind flags |
| Start simple and move on when a trigger fires ([defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}})) | Choose the technique by the risk being reduced ([lifecycle techniques]({{< ref "engineering/architecture/techniques" >}}#a-useful-decision-rule)) | The hierarchy of needs in the RAG runtime: no AI, then an LLM transformation, then a system of record, then retrieval, then ask or abstain |

## Patterns and techniques share one record


A structure pattern answers *what to build*; a process technique answers *how to learn whether it is right*. The hub format above and the technique record in the [delivery techniques guide]({{< ref "engineering/delivery-techniques/engineering-delivery-techniques-guide" >}}) record the same kinds of things:

| Hub field | Technique record field |
| --- | --- |
| Question and forces | Goal and primary risk |
| Mechanism | What must be real; what can be simplified |
| Costs | Expected lifespan; non-goals |
| Leads to | Decision or next step |
| Gaps | Record what remains unknown |

That shared shape is what lets the [flow]({{< ref "system-design" >}}) alternate between the two: pick an option, test it with a technique, record the decision and its trigger.

## Where detail lives


- **Hubs** in this folder answer *which option, and why*.
- **Pattern notes** in this folder ([API gateway]({{< ref "system-design/elements/api-gateway" >}}), [messaging]({{< ref "system-design/elements/messaging" >}}), [control plane]({{< ref "system-design/elements/control-plane" >}})) hold an option or a cross-hub pattern that has grown beyond a table row.
- **Platform notes** in [platform and delivery]({{< ref "engineering/platform" >}}) hold the mechanisms behind [operating services]({{< ref "system-design/elements/operating-services" >}}): Twelve-Factor, deployment, infrastructure as code, Kubernetes, GitOps, and developer experience.
- **Engineering topic notes** hold how a mechanism works: [Kafka]({{< ref "engineering/topics/kafka" >}}), [DynamoDB]({{< ref "engineering/topics/dynamodb" >}}), [partitioning]({{< ref "engineering/distributed-systems/partitioning" >}}), [replication]({{< ref "engineering/distributed-systems/replication" >}}), [caching]({{< ref "engineering/topics/caching" >}}), [transactions]({{< ref "engineering/distributed-systems/transactions" >}}), [Kubernetes]({{< ref "engineering/platform/kubernetes" >}}), and [distributed systems]({{< ref "engineering/distributed-systems/reading" >}}).
- **Distributed-systems notes** in [distributed systems]({{< ref "engineering/distributed-systems" >}}) hold the theory behind the data hubs: system models, time and order, consistency guarantees and CAP, consensus, coordination avoidance, distributed computation, and verification.
- **Quality requirements** live in the [NFR notes]({{< ref "system-design/nfr" >}}), which link to the hubs that address each quality.

## Not yet placed


Common design templates, such as a CRUD service and a management interface, do not fit a single hub yet. The control plane now has its own [pattern note]({{< ref "system-design/elements/control-plane" >}}). Each hub lists its own gaps.

Each hub's options table holds the trade-offs for its own question. The ones that recur across hubs, such as consistency versus latency, SQL versus NoSQL, and push versus pull, are collected in [common trade-offs]({{< ref "system-design/elements/common-trade-offs" >}}), with the signal that tips each one.

Use [practice]({{< ref "system-design/interview/study-and-practice" >}}#a-practice-loop) to decide which gap to study next.

## Pattern catalogs


- [Microservices pattern language -- microservices.io](https://microservices.io/patterns/index.html).
- [Azure architecture patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/).
- [Modern system-design building blocks -- Educative](https://www.educative.io/courses/grokking-the-system-design-interview/introduction-to-building-blocks-for-modern-system-design).
- [Sequencer -- Educative](https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/system-design-sequencer).
- [System-design master template -- DesignGurus](https://www.designgurus.io/course-play/grokking-the-system-design-interview/doc/system-design-master-template).
- [Designing Data-Intensive Applications, second edition](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/).

## Library sources


- [Richardson 2019](/sources/system-design/microservices/richardson-2019-microservices-patterns.pdf.enc), *Microservices Patterns: With Examples in Java* -- the pattern language the hubs follow
