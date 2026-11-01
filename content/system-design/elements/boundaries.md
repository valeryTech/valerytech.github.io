---
draft: false
toc: true
title: "Architecture Style and Service Boundaries"
description: "Design question hub on whether to build one deployable unit or several, where to draw service boundaries, and how to migrate incrementally with the strangler application and anti-corruption layer."
linkTitle: "Boundaries"
---

**Question:** should the system be one deployable unit or several, where should the boundaries go, and how do you move from one arrangement to the other?

Every other hub in this section depends on this answer. Once a design has several services, it needs answers for [data across services]({{< ref "system-design/elements/data-across-services" >}}), [communication]({{< ref "system-design/elements/communication" >}}), [the request path]({{< ref "system-design/elements/request-path" >}}), [containing failure]({{< ref "system-design/elements/containing-failure" >}}), and [operating services]({{< ref "system-design/elements/operating-services" >}}).

## Forces


- **Independent deployment and team autonomy:** teams that release on their own schedule need parts they can change and deploy alone. Team structure and system structure tend to mirror each other (Conway's law).
- **Different scaling needs:** a function with a distinct load profile can scale separately. See functional decomposition in [scalability]({{< ref "system-design/nfr/scalability" >}}#four-scaling-strategies).
- **Fault isolation:** a failure in one service need not take down the others, provided failure is [contained]({{< ref "system-design/elements/containing-failure" >}}).
- **Cost of distribution:** network calls, partial failure, cross-service consistency, and more to deploy and observe.
- **Cohesion and change:** things that change together should stay together. A feature that needs changes in several services needs coordinated releases.

## Architectural style


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Monolithic architecture | The application is one deployable unit. It can still be modular inside. | A small team, an early product, or a domain whose boundaries are still unclear. | Every change ships together; one scaling profile; without modular discipline the code loses its internal boundaries. |
| Microservice architecture | A collection of independently deployable, loosely coupled services, each owning its data. | Several teams need to release independently, or parts of the system have very different scaling, availability, or technology needs. | Everything in the other hubs: distributed data, communication, discovery, failure handling, deployment, and observability. |

**Defining properties of microservices** (from the Newman excerpts in [collected reading]({{< ref "system-design/to-sort/sd-to-sort" >}})):

- **Independent deployability:** this is how releases are normally done, not only something that is possible.
- **Modeled around a business domain:** cross-service changes are expensive, so boundaries should make them rare.
- **Owning their own state:** other services ask for data through the service's interface.
- **Information hiding:** the implementation can change freely as long as the networked interface stays compatible.

A **modular monolith** sits between the two: boundaries are enforced inside one deployable unit. Modularity concerns what can change independently, not only how the system is divided. See [The Golden Age of Modularity](https://vladikk.com/2025/03/30/golden-age-of-modularity/).

**In an interview:** the [extended framework collection]({{< ref "system-design/interview/frameworks/sd-framework-old" >}}) advises designing a basic working system first, such as a monolith. It lists defaulting to microservices, or bringing Kafka, Kubernetes, and microservices to a small-scale problem, among common interview errors and biases. Walkthroughs often draw separate services anyway. Treat them as a logical decomposition and say whether they need to be deployed separately.

## Where to draw boundaries


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Decompose by business capability | Services correspond to what the business does, such as order management or delivery. | Capabilities are stable and recognizable. | Capabilities can be coarse; requires understanding the business. |
| Decompose by subdomain | Services correspond to domain-driven design subdomains (core, supporting, generic) and their bounded contexts. | The domain is complex enough to justify modeling it. | Modeling effort; boundaries shift as understanding improves. |
| Self-contained service | A service can answer synchronous requests without waiting for other services. | A request path must stay available when other services are down. | Relies on local copies of other services' data, so it is eventually consistent. See [CQRS and command-side replicas]({{< ref "system-design/elements/data-across-services" >}}#queries-that-need-several-services). |
| Service per team | Each team owns one service. | Team boundaries match domain boundaries; autonomy is the main goal. | The team structure determines the service size. |

**Heuristics for a boundary:**

- **Atomic invariants:** keep data that must change atomically in one service.
- **Coordinated changes:** cut where changes rarely need coordination.
- **Coupling:** balance integration strength, distance, and volatility (Khononov). Strong coupling is acceptable between components that are close together or rarely change. See [Coupling and Modularity]({{< ref "engineering/architecture/coupling" >}}) for the full model.
- **Ownership:** check who owns the data each operation needs. A boundary that forces most requests to call several services is probably in the wrong place.

## Refactoring to services


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Strangler application | Route functionality incrementally to new services around the existing system until the old one can be retired. | An existing system must keep running during the migration. | Two systems run in parallel for a long time; a routing layer to maintain. |
| Anti-corruption layer | A translation layer between the new service's model and the legacy model. | The legacy model would otherwise leak into the new design. | Translation code to maintain. |

Newman (2020) adds:

- **branch by abstraction:** replace an implementation behind an abstraction inside the monolith;
- **parallel run:** run old and new implementations side by side and compare their results (see the [deployment notes]({{< ref "engineering/platform/deployment" >}}));
- **decorating collaborator** and **change data capture;**
- a chapter on decomposing the database.

He also argues for not migrating when the goals do not require it.

## Leads to


- Private data per service leads to [data across services]({{< ref "system-design/elements/data-across-services" >}}).
- Services that call each other lead to [communication]({{< ref "system-design/elements/communication" >}}) and [the request path]({{< ref "system-design/elements/request-path" >}}).
- More deployable units lead to [operating services]({{< ref "system-design/elements/operating-services" >}}) and [containing failure]({{< ref "system-design/elements/containing-failure" >}}).

## Seen in cases


- [Ticketmaster]({{< ref "system-design/projects/ticketmaster" >}}): separates event browsing from booking. The two have different load and consistency needs.
- [Scalability]({{< ref "system-design/nfr/scalability" >}}): functional decomposition as one of four scaling strategies.
- **AI and RAG:** the [boundary map in design pressure]({{< ref "engineering/eng-exp/design-pressure" >}}) splits a single-turn RAG and tool assistant into modules that can each be tested with fixtures. The boundaries are at code scale, but they are chosen by the same question: what must change and be verified independently.

## Gaps


- A worked decomposition of one case by capability and by subdomain, comparing the results.
- Domain-driven design: bounded contexts and context mapping. The ACL is one context-mapping pattern.
- Team structure: Newman, chapter 15.

## Sources


- [Monolithic architecture](https://microservices.io/patterns/monolithic.html), [microservice architecture](https://microservices.io/patterns/microservices.html), [decompose by business capability](https://microservices.io/patterns/decomposition/decompose-by-business-capability.html), [decompose by subdomain](https://microservices.io/patterns/decomposition/decompose-by-subdomain.html), [self-contained service](https://microservices.io/patterns/decomposition/self-contained-service.html), [service per team](https://microservices.io/patterns/decomposition/service-per-team.html), [strangler application](https://microservices.io/patterns/refactoring/strangler-application.html), [anti-corruption layer](https://microservices.io/patterns/refactoring/anti-corruption-layer.html) -- microservices.io. Full [pattern index](https://microservices.io/patterns/index.html).
- [Microservices -- Martin Fowler and James Lewis](https://martinfowler.com/articles/microservices.html) and [Microservices and the First Law of Distributed Objects](https://www.martinfowler.com/articles/distributed-objects-microservices.html).
- The microservices chapter of *Fundamentals of Software Architecture* (Richards and Ford).
- [Video](https://www.youtube.com/watch?v=LcJKxPXYudE): noted as good, including its comments.
- Richardson 2019: chapter 2 (decomposition), chapter 13 (refactoring). Newman 2021: chapters 1-3 and 15. Newman 2020: chapters 1-3.

## Library sources


- [Newman 2020](/sources/system-design/microservices/newman-2020-monolith-to-microservices.pdf.enc), *Monolith to Microservices: Evolutionary Patterns to Transform Your Monolith* -- on *Refactoring to services*
- [Newman 2021](/sources/system-design/microservices/newman-2021-building-microservices-2nd-edition.pdf.enc), *Building Microservices: Designing Fine-Grained Systems, Second Edition* -- on *Architectural style*
- [Richardson 2019](/sources/system-design/microservices/richardson-2019-microservices-patterns.pdf.enc), *Microservices Patterns: With Examples in Java* -- chapters 2 and 13
- [Khononov 2025](/sources/software-engineering/craft/khononov-2025-balancing-coupling-in-software-design.pdf.enc), *Balancing Coupling in Software Design* -- on *Where to draw boundaries*

Further reading:

- [Richards and Ford 2025](/sources/software-engineering/architecture/richards-2025-fundamentals-of-software-architecture.pdf.enc), *Fundamentals of Software Architecture, 2nd Edition*
- [Dragoni et al. 2017](/sources/software-engineering/architecture/dragoni-2017-microservices-yesterday-today-tomorrow.pdf.enc), *Microservices: yesterday, today, and tomorrow* ([arXiv:1606.04036](https://arxiv.org/abs/1606.04036))
- Gandhi et al. 2024, *Head First Software Architecture*
