---
draft: false
toc: true
title: "Messaging and Events"
description: "Messaging models and event-driven design questions covering delivery, ordering, idempotency, retention, replay, schemas, event sourcing, and implementation references."
linkTitle: "Messaging"
---

These notes separate communication models, behavior to specify, and event-based architecture uses. Product names and framework references are kept as study material.

## Communication models


**Point-to-point:** a queue distributes messages to consumers. Clarify consumer assignment and retry behavior as part of the design.

**Publish/subscribe:** publishers classify messages without directing each message to a particular receiver; subscribers receive the classes of messages they subscribe to. A broker often mediates publication and delivery.

**Data stream:** a continuous flow of data, such as sensor readings, browser activity, or financial transaction logs. The original notes identify timeliness, continuity, heterogeneous data, and imperfect input as characteristics to examine.

## Behavior to specify


- Delivery semantics and retry behavior.
- Ordering and the scope within which it matters.
- Idempotency and handling repeated consumption.
- Persistence, retention, and replay.
- Filtering and subscription rules.
- Event schemas, contracts, and their evolution.
- Required throughput, acceptable latency, and scaling behavior.
- Isolation between producers, consumers, and workloads.

Treat these as design questions. Different products and configurations provide different behavior.

## Event-based architecture uses


The original collection lists event sourcing, event-carried state transfer, domain events, integration events, and workflow events. Describe the purpose of an event and the state it represents before choosing the communication mechanism.

The event-sourcing notes focus on how state is persisted and reconstructed. Keep that state-modeling question distinct from choosing a queue or event broker.

## Topics to develop


- Kafka partitions and their distribution across brokers.
- In-sync replicas (ISR).
- Delivery semantics in Kafka.
- Retry composition and limits.
- Event schemas and integration contracts.
- Distributed models and saga-based workflows.

Tools mentioned in the original notes: Kafka, RabbitMQ, SQS, SNS, and EventBridge. Eventuate is listed as a framework to examine.

## Sources

### Patterns and implementation


- [Saga pattern](https://microservices.io/patterns/data/saga.html).
- [Eventuate](https://eventuate.io/) and [Eventuate Tram](https://eventuate.io/docs/manual/eventuate-tram/latest/about-eventuate-tram.html).
- [Designing event-driven architectures — AWS](https://aws.amazon.com/blogs/architecture/lets-architect-designing-event-driven-architectures/).
- [AWS messaging](https://aws.amazon.com/messaging/).
- [Choosing serverless messaging services](https://aws.amazon.com/blogs/compute/choosing-between-messaging-services-for-serverless-applications/).
- [AWS event-driven architecture](https://aws.amazon.com/event-driven-architecture/).
- [Six event-driven architecture patterns — Wix](https://medium.com/wix-engineering/6-event-driven-architecture-patterns-part-1-93758b253f47).

### Trade-offs and further reading


- [Good and hard parts of event architectures](https://serverlessland.com/event-driven-architecture/visuals/good-and-hard-parts-of-event-architectures).
- [Common EDA issues](https://serverlessland.com/event-driven-architecture/visuals/common-issued-with-eda).
- [The continued rise of event-driven architectures](https://www.aklivity.io/post/the-continued-rise-of-event-driven-architectures).
- [Event-driven architecture challenges](https://www.infoq.com/presentations/event-driven-arch-challenges/).
- [The good, the bad, and the ugly](https://www.equalexperts.com/blog/tech-focus/event-driven-architecture-the-good-the-bad-and-the-ugly/).
- [Developer to Architect: lesson 165](https://www.developertoarchitect.com/lessons/lesson165.html) and [resources](https://www.developertoarchitect.com/resources.html).
- [CodeOpinion](https://www.youtube.com/@CodeOpinion/).

### Videos to review


- [Video 1](https://www.youtube.com/watch?v=SbL3a9YOW7s).
- [Video 2](https://www.youtube.com/watch?v=gA2-eqDVSng).
- [Video 3](https://www.youtube.com/watch?v=28B4L1fnnGM).
- [Video 4](https://www.youtube.com/watch?v=A_mstzRGfIE).
- [Event tips](https://www.youtube.com/watch?v=9r9WDzzTcr0).

The [original collection]({{< ref "system-design/archive/messaging-v0" >}}) retains the earlier outline and source reminders.
