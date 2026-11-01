---
draft: false
toc: true
title: "Data Across Services"
description: "Design question hub on data ownership between services: database per service, sagas, API composition, CQRS, domain events, event sourcing, and publishing changes reliably with an outbox."
linkTitle: "Data Across Services"
---

**Question:** when each service owns its data, how do you keep data consistent across services, answer queries that need data from several of them, and publish changes without losing them?

This question appears as soon as a design has more than one service with its own storage. With a single database, one ACID transaction and one SQL join handle these questions. Splitting the data removes both options.

## Forces


- **Independent change:** a service whose schema is private can change it without coordinating with other teams. This pushes toward private data. See [boundaries]({{< ref "system-design/elements/boundaries" >}}).
- **Consistency:** an invariant spanning two services can no longer be enforced by one local transaction. Decide what each operation needs to observe. See [consistency]({{< ref "system-design/nfr/consistency" >}}) and [transactions]({{< ref "engineering/distributed-systems/transactions" >}}).
- **Query latency and availability:** a query that calls several services waits for the slowest and fails when any of them fails. A local copy removes the calls but serves data that may be stale.
- **Simplicity:** a shared database is the simplest arrangement to build and the hardest to change later.

## Who owns the data


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Database per service | Each service's data is private and reached only through its API. The separation can be private tables, a private schema, or a separate database server. | Services must change and deploy independently, or need different storage. | Cross-service updates need a [saga](#operations-that-change-several-services); cross-service queries need [API composition or CQRS](#queries-that-need-several-services). |
| Shared database | Several services read and write the same database. | Early in a migration, a small team, or data whose consistency cannot be relaxed. | Schema changes need coordination across services; one service's load or locks affect the others. |

Ownership matters more than physical separation: the rule is that no other service reads or writes the tables directly.

Before choosing a coordination pattern, check the boundary. If an invariant must hold atomically across two services in most operations, the data may belong in one service.

## Operations that change several services


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Saga | A sequence of local transactions. Each step commits in one service and triggers the next by a message or event. If a step fails, compensating transactions undo the earlier steps. | A business operation spans services and can tolerate intermediate states being visible. | No isolation between concurrent sagas; compensations must be designed; steps communicate by [messaging]({{< ref "system-design/elements/communication" >}}) and need [reliable publishing](#publishing-changes-reliably). |
| Distributed transaction (two-phase commit) | A coordinator asks every participant to prepare, then to commit. | Every participant supports it and the availability cost is acceptable. | The coordinator and all participants must be available to commit; many brokers and NoSQL stores do not support it. The pattern language avoids it. |

**Coordinating a saga:**

- **Choreography:** each participant reacts to the events of the others. There is no central component, but the flow exists only implicitly across services.
- **Orchestration:** an orchestrator tells each participant what to do next. The flow is explicit in one place, at the cost of a component that knows every step.

**Structure of a saga:**

- **Compensatable steps** can be undone.
- The **pivot** step decides whether the saga will complete.
- **Retriable steps** after the pivot must eventually succeed.

Ordering the steps this way limits how much needs compensation.

**Missing isolation:** Richardson describes sagas as ACD. Every step either completes or is compensated, but there is no isolation: another request can see or overwrite intermediate state. He lists countermeasures, among them:

- a **semantic lock**: a status such as `PENDING` that marks a record as in use;
- **commutative updates**;
- **rereading a value** before overwriting it.

## Queries that need several services


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| API composition | A composer (a client, the [API gateway]({{< ref "system-design/elements/api-gateway" >}}), or a service) calls the owning services and joins the results in memory. | Result sets are small, the owners are available, and the data must be current. | Latency of several calls; availability depends on every owner; large in-memory joins are inefficient. |
| CQRS | A separate query model, such as a materialized view, is kept up to date by subscribing to the owners' [domain events](#representing-change). | Queries join many sources, need a different store (search, analytics), or the read load differs greatly from the write load. | The view lags behind the owners, so clients may read stale data; more infrastructure; event handlers must be [idempotent]({{< ref "system-design/elements/communication" >}}#idempotent-consumer). |
| Command-side replica | A service that implements a command keeps a queryable copy of another service's data, updated from its events. | A command must validate against another service's data without a synchronous call. | The copy is stale by the replication delay, and the service now depends on another service's event contract. |

The [scalability reading notes]({{< ref "system-design/nfr/scalability" >}}) also discuss CQRS as a scaling technique. They tie it to event sourcing and stress hiding the separate models behind the service interface. Use it where read and write needs differ enough to justify the extra moving parts.

**A stated position against replicas:** some organizations rule that a consuming domain must not keep a copy of another domain's state, and must ask the system of record instead. That rule rules out CQRS views and command-side replicas that span domains, and accepts the latency and availability coupling of synchronous queries in exchange for a single source of truth.

## Representing change


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Domain event | An aggregate publishes an event whenever its state changes. | Other services need to react: saga steps, CQRS views, replicas, notifications. | The event schema becomes a contract between teams; publication must survive failures. |
| Event sourcing | An aggregate is stored as its sequence of events, and its state is rebuilt by replaying them. The stored events are also the published events. | A history of changes is needed (audit, temporal queries), or events are already central to the design. | Queries need a separate read model (CQRS); stored events must remain readable as schemas evolve; snapshots for long histories. |

Describe the purpose of an event and the state it represents before choosing the mechanism. The original messaging collection also distinguishes:

- **event-carried state transfer:** events carry enough state for consumers to maintain a copy. This is the mechanism behind replicas and CQRS views.
- **integration events:** events published across a boundary, as distinct from events used inside one domain.
- **workflow events:** events that drive the steps of a process.

Event sourcing is a question of how state is persisted and reconstructed. Keep it distinct from the choice of queue or broker in [messaging]({{< ref "system-design/elements/messaging" >}}).

## Publishing changes reliably


**The dual-write problem:** a service commits a change to its database and then publishes a message. If the process crashes or the broker is unavailable between the two, the change exists but nobody hears about it. Publishing first has the opposite problem.

| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Transactional outbox | Write the message to an outbox table in the same local transaction as the business change. A separate relay publishes it to the broker afterwards. | Any service that must publish when its data changes. | Delivery is at least once, so consumers must be [idempotent]({{< ref "system-design/elements/communication" >}}#idempotent-consumer); ordering per entity needs care. |
| Polling publisher | The relay polls the outbox table, publishes new rows, then marks or deletes them. | Moderate volume; any database. | Polling load and added delay. |
| Transaction log tailing | The relay reads the database's commit log (change data capture) and publishes the outbox inserts or the changes themselves. | Higher volume; the database exposes a change stream. | Database-specific tooling and operation. See the change streams in the [DynamoDB notes]({{< ref "engineering/topics/dynamodb" >}}). |

Event sourcing avoids the dual write: appending to the event store is both the state change and the publication.

The [URL-shortener NFR draft]({{< ref "system-design/projects/url-shortener/url-shortener-nfrs-v0" >}}#transactional-outbox) works through an outbox in detail. The write service records each new link and a `link_created` event in one transaction, and a relay propagates it to the read path.

## Leads to


- Sagas and replicas communicate by messaging, so you need delivery semantics and ordering. See [communication]({{< ref "system-design/elements/communication" >}}) and [messaging]({{< ref "system-design/elements/messaging" >}}).
- At-least-once publication leads to [idempotent consumers]({{< ref "system-design/elements/communication" >}}#idempotent-consumer).
- Views and replicas introduce staleness: specify what each operation may observe in [consistency]({{< ref "system-design/nfr/consistency" >}}).
- Frequent cross-service invariants suggest revisiting the [boundaries]({{< ref "system-design/elements/boundaries" >}}).

## Seen in cases


- [URL shortener]({{< ref "system-design/projects/url-shortener/url-shortener-nfrs-v0" >}}#transactional-outbox): outbox for read-path propagation; different PACELC choices for the read and write paths.
- [Ticketmaster]({{< ref "system-design/projects/ticketmaster" >}}): the reservation flow can be read in saga terms. A `RESERVED` status with an expiry works as a semantic lock, the external payment is the pivot, and expiry releases the ticket when checkout is abandoned. The walkthrough itself does not use the term.
- **AI and RAG:** the RAG runtime layers prefer an authoritative system of record over document retrieval for facts that exist as rows. They give the index freshness targets, versioning, and invalidation. Reading the index as a CQRS-style derived view is an interpretation, not the note's own framing.

## Gaps


- A worked saga with compensations and isolation countermeasures; no case uses one explicitly yet.
- Choosing between choreography and orchestration in a concrete flow.
- Event schema design and evolution; ordering guarantees per aggregate.
- A case that needs CQRS or a command-side replica.
- Two-phase commit, XA, and sagas with the outbox are covered in the [transactions notes]({{< ref "engineering/distributed-systems/transactions" >}}#distributed-transactions); no case here compares them on a concrete flow yet.

## Sources


- [Database per service](https://microservices.io/patterns/data/database-per-service.html), [shared database](https://microservices.io/patterns/data/shared-database.html), [saga](https://microservices.io/patterns/data/saga.html), [command-side replica](https://microservices.io/patterns/data/command-side-replica.html), [API composition](https://microservices.io/patterns/data/api-composition.html), [CQRS](https://microservices.io/patterns/data/cqrs.html), [domain event](https://microservices.io/patterns/data/domain-event.html), [event sourcing](https://microservices.io/patterns/data/event-sourcing.html) -- microservices.io.
- [Transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html), [transaction log tailing](https://microservices.io/patterns/data/transaction-log-tailing.html), [polling publisher](https://microservices.io/patterns/data/polling-publisher.html) -- microservices.io.
- [Eventuate](https://eventuate.io/) and [Eventuate Tram](https://eventuate.io/docs/manual/eventuate-tram/latest/about-eventuate-tram.html): a framework implementing these patterns. [Example applications](https://eventuate.io/exampleapps.html).
- Richardson 2019: chapter 3 (transactional messaging), 4 (sagas), 5 (aggregates and domain events), 6 (event sourcing), 7 (API composition and CQRS).
- Newman 2021: chapter 6 (workflow, sagas, orchestration and choreography). Newman 2020: chapter 4 (decomposing the database).

## Library sources


- [Richardson 2019](/sources/cdfacd78fbf9383e0e2361fff5f38b30.bin), *Microservices Patterns: With Examples in Java* -- chapters 3-7
- [Newman 2021](/sources/af58a5432d5991ea30cd296ba11a12dc.bin), *Building Microservices: Designing Fine-Grained Systems, Second Edition* -- chapter 6
- [Newman 2020](/sources/bd80be1c01a1cbf103cccdc8957f91bc.bin), *Monolith to Microservices: Evolutionary Patterns to Transform Your Monolith* -- chapter 4

Further reading:

- [Ford et al. 2022](/sources/08f60e529d971e5ad6408c46accea44c.bin), *Software Architecture: The Hard Parts*
- [Kleppmann and Riccomini 2026](/sources/f639f3efb30ff1f78d5f3bec89441c6e.bin), *Designing Data-Intensive Applications, Second Edition*
- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional* -- chapter 12, "Bounded Contexts Must Own Their Data Storage" (from a separate database down to a namespace in a shared one; reporting as its own context fed by events) and "Command-Query Separation" (CQRS, separate read stores); chapter 6, "Consistency" (between contexts: asynchronous messages, with reconciliation or compensation instead of two-phase commit); on *Who owns the data*, *Queries that need several services* and *Operations that change several services*
