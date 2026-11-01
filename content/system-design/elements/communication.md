---
draft: false
toc: true
title: "Service Communication"
description: "Design question hub on how services communicate: synchronous and asynchronous styles, remote procedure invocation, messaging, domain-specific protocols, push versus poll, idempotent consumers, and API contracts."
linkTitle: "Communication"
---

**Question:** how does one service ask another to do something or tell it that something happened, and what does the sender assume about the reply?

Decide the style of communication first and the technology second. Newman's observation is that teams often pick a technology before considering which kinds of interaction they need.

## Forces


- **Latency:** a synchronous caller waits for the whole chain of calls behind it.
- **Availability:** with synchronous calls, a request succeeds only if every service on its path is up. Asynchronous messaging decouples the sender from the receiver's availability.
- **Feedback and consistency:** a synchronous reply tells the caller the outcome now. With messaging, the outcome arrives later or must be observed separately.
- **Bursts and throughput:** a queue absorbs bursts that would otherwise overload the receiver.
- **Operability:** a broker is more infrastructure to run, and asynchronous flows are harder to trace.
- **Change:** every message or API becomes a contract that must evolve compatibly.

## Interaction styles


Two dimensions describe an interaction (Richardson, chapter 3):

| | One-to-one | One-to-many |
| --- | --- | --- |
| **Synchronous** | Request/response | -- |
| **Asynchronous** | Asynchronous request/response; one-way notification | Publish/subscribe; publish with asynchronous responses |

Newman (chapter 4) distinguishes synchronous blocking from asynchronous nonblocking communication. Within the asynchronous styles, he separates request-response, event-driven collaboration, and communication through common data such as a shared file store or data lake.

**Request-response versus event-driven collaboration:**

- **Request-response:** the sender asks for something and expects an answer.
- **Event-driven:** the sender announces that something happened and does not know who reacts.

Choosing one of these determines who depends on whom.

## Options


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Remote procedure invocation | The client sends a request and waits for the reply: REST, gRPC, GraphQL. | The caller needs the answer to continue; simple queries; clients outside the system. | Temporal coupling and added latency; requires [discovery]({{< ref "system-design/elements/request-path" >}}#service-discovery) and [timeouts, retries, and circuit breakers]({{< ref "system-design/elements/containing-failure" >}}). |
| Messaging | Services exchange messages through a broker: a queue, publish/subscribe, or a stream. The sender does not wait for processing. | Work can complete later; several consumers react to one event; bursts must be buffered; long-running workflows such as [sagas]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services). | A broker to operate; eventual consistency; duplicate delivery requires [idempotent consumers](#idempotent-consumer); end-to-end tracing is harder. Details in [messaging]({{< ref "system-design/elements/messaging" >}}). |
| Domain-specific protocol | Use the protocol standard for the domain: SMTP for email, media streaming protocols for video. | The domain already has a protocol and an ecosystem around it. | Specialized infrastructure and expertise. |

## Push versus poll


When a client needs updates, it can poll for changes or the server can push them over a long-lived connection (WebSocket, server-sent events, long polling). Pushing reduces the delay before the client sees a change. It costs connection state on the server and a way to route a message to the server holding the connection.

The original notes add that a system sometimes needs to switch between the two. The [chat-room]({{< ref "system-design/projects/chat-room" >}}) and [live commenting]({{< ref "system-design/projects/live-commenting" >}}) cases depend on this choice.

## Idempotent consumer


**Problem:** at-least-once delivery, client retries, and outbox relays all deliver some messages more than once. Processing a duplicate must not repeat the side effect.

**Mechanisms:**

- Record the ID of each processed message in the same transaction as the side effect, and skip IDs already recorded.
- Make the operation naturally idempotent, for example by setting a state instead of incrementing a counter.
- For client requests, accept an idempotency key and return the original result on a repeat. The [URL-shortener design]({{< ref "system-design/projects/url-shortener/url-shortener" >}}) considers an `Idempotency-Key` for link creation.

**Leads to:** a store of processed IDs with a retention policy, and a decision about how long duplicates can arrive.

## Contracts and API design


The API or message schema is the part of a service that other teams depend on. Questions to develop:

- API design principles and evolution: versioning, backward compatibility, deprecation.
- What an API is (an interface, the fringe of a system, an algebra of operations) and how it differs from a protocol and a service-level agreement.
- Terminology from hexagonal architecture (ports and adapters) for the boundary between a service and its transports.
- Schema evolution for events, which consumers may read long after publication.
- [Consumer-driven contract tests]({{< ref "system-design/elements/operating-services" >}}#testing) as a way to check compatibility.

Reading: [How Slack designs its APIs](https://slack.engineering/how-we-design-our-apis-at-slack/), [API design articles -- Martin Fowler](https://www.martinfowler.com/tags/API%20design.html), and the communication and contract chapters of *Software Architecture: The Hard Parts* ([PDF](/sources/software-engineering/architecture/ford-2022-software-architecture-the-hard-parts.pdf.enc)).

## Leads to


- Synchronous calls need a way to find instances and survive failures: [request path]({{< ref "system-design/elements/request-path" >}}) and [containing failure]({{< ref "system-design/elements/containing-failure" >}}).
- Messaging needs delivery, ordering, and retention decisions: [messaging]({{< ref "system-design/elements/messaging" >}}).
- Events that carry state lead to the replica and CQRS choices in [data across services]({{< ref "system-design/elements/data-across-services" >}}#queries-that-need-several-services).
- Asynchronous flows need correlation IDs and [distributed tracing]({{< ref "system-design/elements/operating-services" >}}#observability).

## Seen in cases


- [Public chat room]({{< ref "system-design/projects/chat-room" >}}): message delivery and an unresolved question about bursts exceeding a fixed buffer.
- [URL shortener]({{< ref "system-design/projects/url-shortener/url-shortener-additional" >}}): an asynchronous bus for cache invalidation, replication, and expiry jobs alongside the synchronous redirect path.
- [Ticketmaster]({{< ref "system-design/projects/ticketmaster" >}}): the payment processor notifies the booking service of the payment result rather than the booking service waiting on it.
- **AI and RAG:** [design pressure]({{< ref "engineering/eng-exp/design-pressure" >}}) treats tools and retrieval as APIs with versioning, compatibility rules, error semantics, and normalization rules.

## Gaps


- A comparison of REST, gRPC, and GraphQL for internal and external APIs.
- Asynchronous request/response: correlation IDs, reply channels, and timeouts.
- Back pressure between producers and consumers.

## Sources


- [Remote procedure invocation](https://microservices.io/patterns/communication-style/rpi.html), [messaging](https://microservices.io/patterns/communication-style/messaging.html), [domain-specific protocol](https://microservices.io/patterns/communication-style/domain-specific.html), [idempotent consumer](https://microservices.io/patterns/communication-style/idempotent-consumer.html) -- microservices.io.
- Richardson 2019, chapter 3. Newman 2021, chapters 4 and 5.
- Detailed notes: [messaging]({{< ref "system-design/elements/messaging" >}}), [Kafka]({{< ref "engineering/topics/kafka" >}}), [streaming]({{< ref "engineering/topics/streaming" >}}), [EDA resources]({{< ref "engineering/topics/event-driven-architecture" >}}).

## Library sources


- [Newman 2021](/sources/system-design/microservices/newman-2021-building-microservices-2nd-edition.pdf.enc), *Building Microservices: Designing Fine-Grained Systems, Second Edition* -- chapters 4-5
- [Richardson 2019](/sources/system-design/microservices/richardson-2019-microservices-patterns.pdf.enc), *Microservices Patterns: With Examples in Java* -- chapter 3
- [Ford et al. 2022](/sources/software-engineering/architecture/ford-2022-software-architecture-the-hard-parts.pdf.enc), *Software Architecture: The Hard Parts* -- on *Contracts and API design*

Further reading:

- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- chapter 3, "Communicating Between Bounded Contexts" (events over queues, DTOs serialized at the boundary) and "Contracts Between Bounded Contexts" (who owns the contract: shared kernel, consumer-driven, conformist); on *Contracts and API design*
