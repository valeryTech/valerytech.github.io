---
draft: false
toc: true
title: "Messaging and Events"
description: "Messaging models, reasons to put a queue between services, and the behavior to specify: delivery, ordering, idempotency, retention, replay, schemas, consumer-group rebalancing, task queues and job scheduling, and implementation references."
linkTitle: "Messaging"
---

Detail note for the messaging option in [service communication]({{< ref "system-design/elements/communication" >}}). It covers communication models, reasons to put a queue between services, and the behavior to specify. Product names and framework references are kept as study material.

## Communication models


**Point-to-point:** a queue distributes messages to consumers. Clarify consumer assignment and retry behavior as part of the design.

**Publish/subscribe:** publishers classify messages without directing each message to a particular receiver; subscribers receive the classes of messages they subscribe to. A broker often mediates publication and delivery.

**Data stream:** a continuous flow of data, such as sensor readings, browser activity, or financial transaction logs. The original notes identify timeliness, continuity, heterogeneous data, and imperfect input as characteristics to examine.

## Why put a queue between services


- **Buffering bursts:** messages that need expensive processing wait in the queue while earlier ones are processed, which reduces the risk of overloading the receiver. The Azure catalog calls this [queue-based load leveling](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling); explain the acceptable delay, backlog, and processing capacity.
- **Prioritizing work:** separate queues or priorities serve different classes of work according to their service requirements. See the [priority queue pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/priority-queue).
- **Fan-out:** the queue or topic delivers a message to several systems, so the sender does not have to call each one.
- **Decoupling:** the sender does not need the receiver's address or availability.

Implementations combine these properties differently: guaranteed delivery, no duplicate delivery, preserved ordering, or at-least-once delivery paired with [idempotent consumers]({{< ref "system-design/elements/communication" >}}#idempotent-consumer).

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

## Consumer groups and rebalancing


In a log-based broker such as Kafka, a consumer group shares a topic's partitions: each partition is read by one consumer in the group at a time. When a consumer joins, leaves, crashes, or stops sending heartbeats, the group reassigns partitions. That reassignment is a rebalance.

- **Eager rebalancing** revokes every partition from every consumer and assigns them again, so the whole group pauses.
- **Cooperative rebalancing** moves only the partitions that need to move, and the other consumers keep working.
- **Static membership** gives each consumer a stable identity, so a restart within the session timeout keeps its partitions instead of triggering a rebalance.
- Kafka 4.0 made a broker-coordinated protocol (KIP-848) generally available. Consumers opt in through configuration, and the broker then computes assignments incrementally instead of a leader consumer.

**What a rebalance means for the design:**

- A partition that moves mid-batch is read again from its last committed offset, so the new owner reprocesses some messages. Consumers must be [idempotent]({{< ref "system-design/elements/communication" >}}#idempotent-consumer).
- A consumer that takes longer than the maximum poll interval to process a batch is treated as dead. Slow processing can cause repeated rebalances, each pausing work, so bound the batch size or hand long work to a [task queue](#task-queues-and-scheduling).
- Parallelism within a group is capped by the number of partitions: extra consumers sit idle.

The [Kafka notes]({{< ref "engineering/topics/kafka" >}}#consumer-groups) cover assignment strategies, offsets, and commit options.

## Task queues and scheduling


A task is a command addressed to one worker: "resize this image". An event is a fact for any number of subscribers: "an image was uploaded". The difference decides the mechanism.

**Task queue:**

1. A producer enqueues a task.
2. A worker takes it and holds it for a visibility timeout, or lease, during which no other worker sees it.
3. The worker acknowledges on success. If the lease expires first, the task becomes visible again; failures are retried with backoff.
4. After a set number of attempts, the task goes to a dead-letter queue for inspection.

Delivery is at least once, so every task must be idempotent. SQS, RabbitMQ, and Celery work this way.

**Delayed and recurring jobs:**

- Store each job with its next run time, indexed on that time.
- A scheduler repeatedly selects due jobs and claims each one, with `SELECT ... FOR UPDATE SKIP LOCKED` or a conditional update that sets an owner and a lease expiry, then enqueues it.
- Run one active scheduler, chosen by [leader election]({{< ref "system-design/elements/data-at-scale" >}}#coordination), or partition the job table so each scheduler owns some jobs.
- Decide what happens to runs missed during an outage: run them all, run only the latest, or skip.
- Exactly-once execution is not available. A job that ran but did not record completion runs again, so jobs need idempotency keys, and leases need [fencing tokens]({{< ref "system-design/elements/data-at-scale" >}}#coordination).

**Workflow engines:** work with several durable steps, waits, and compensations belongs in an engine such as Temporal or AWS Step Functions rather than in chained tasks. That is saga orchestration; see [data across services]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services).

The [job scheduler case]({{< ref "system-design/projects/job-scheduler" >}}) applies this.

## Event-based architecture uses


Domain events, event-carried state transfer, integration and workflow events, and event sourcing are covered in [data across services]({{< ref "system-design/elements/data-across-services" >}}#representing-change). Describe the purpose of an event and the state it represents before choosing the communication mechanism.

## Topics to develop


- Kafka partitions and their distribution across brokers.
- In-sync replicas (ISR).
- Delivery semantics in Kafka.
- Retry composition and limits.
- Event schemas and integration contracts.
- Saga-based workflows: see [data across services]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services).

Tools mentioned in the original notes: Kafka, RabbitMQ, SQS, SNS, and EventBridge. Eventuate is listed as a framework to examine.

## Sources

### Patterns and implementation


- [Saga pattern](https://microservices.io/patterns/data/saga.html).
- [Eventuate](https://eventuate.io/) and [Eventuate Tram](https://eventuate.io/docs/manual/eventuate-tram/latest/about-eventuate-tram.html).
- [Designing event-driven architectures -- AWS](https://aws.amazon.com/blogs/architecture/lets-architect-designing-event-driven-architectures/).
- [AWS messaging](https://aws.amazon.com/messaging/).
- [Choosing serverless messaging services](https://aws.amazon.com/blogs/compute/choosing-between-messaging-services-for-serverless-applications/).
- [AWS event-driven architecture](https://aws.amazon.com/event-driven-architecture/).
- [Six event-driven architecture patterns -- Wix](https://medium.com/wix-engineering/6-event-driven-architecture-patterns-part-1-93758b253f47).

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

### Rebalancing and scheduling


- [KIP-848: the next generation of the consumer rebalance protocol -- Apache Kafka](https://cwiki.apache.org/confluence/display/KAFKA/KIP-848%3A+The+Next+Generation+of+the+Consumer+Rebalance+Protocol).
- [Amazon SQS visibility timeout -- AWS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html).

The [original collection]({{< ref "system-design/archive/messaging-v0" >}}) retains the earlier outline and source reminders.

## Library sources


- [Schmidt and Volpicella 2024](/sources/software-engineering/systems-and-operations/schmidt-2024-aws-fundamentals.pdf.enc), *AWS Fundamentals: AWS For The Real World*
- Xu and Lam 2022, *System Design Interview: An Insider's Guide, Volume 2* -- chapter 4, a distributed message queue, on *Consumer groups and rebalancing*
- Educative 2023: distributed task scheduler, *Grokking Modern System Design Interview* -- on *Task queues and scheduling*
- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 12, stream processing
