---
contributors: []
date: 2025-02-21T17:37:47.897097
description: Default Description
draft: false
lastmod: 2025-02-21T17:37:47.897097
summary: ''
title: Events
toc: true
weight: 810
---

# Sources

https://microservices.io/patterns/data/saga.html
coursehunter
https://www.youtube.com/watch?v=SbL3a9YOW7s
https://eventuate.io/docs/manual/eventuate-tram/latest/about-eventuate-tram.html
https://www.youtube.com/watch?v=gA2-eqDVSng
https://aws.amazon.com/blogs/architecture/lets-architect-designing-event-driven-architectures/
https://aws.amazon.com/messaging/
https://aws.amazon.com/blogs/compute/choosing-between-messaging-services-for-serverless-applications/
https://aws.amazon.com/event-driven-architecture/
https://www.youtube.com/watch?v=28B4L1fnnGM
https://www.youtube.com/@CodeOpinion/

https://www.youtube.com/watch?v=A_mstzRGfIE
https://www.developertoarchitect.com/lessons/lesson165.html

https://medium.com/wix-engineering/6-event-driven-architecture-patterns-part-1-93758b253f47

event tips:
https://www.youtube.com/watch?v=9r9WDzzTcr0
https://serverlessland.com/event-driven-architecture/visuals/good-and-hard-parts-of-event-architectures
https://www.aklivity.io/post/the-continued-rise-of-event-driven-architectures
https://www.infoq.com/presentations/event-driven-arch-challenges/
https://www.equalexperts.com/blog/tech-focus/event-driven-architecture-the-good-the-bad-and-the-ugly/
https://serverlessland.com/event-driven-architecture/visuals/common-issued-with-eda

common https://www.developertoarchitect.com/resources.html

topics:
tools: Kafka, RabbitMQ, SQS, SNS, EventBridge
models: pub/sub, ...
managing distributed models
frameworks:
https://eventuate.io/

patterns

# Common

````
				   |
````

Pros: refactor v
isolation
delivery semantics
ordering
replaying or repeated consuming (by persistence mechanishm)
content-based filtering
retention
scalability? In Kafka there is distributing partitions over brokers (horizontal scalability).

Events used to:

* Event Sourcing
* Event Carried State Transfer
* Domain Events
* Integration Events
* Workflow Events

event schemas
idempotency

Architectural Charateristics:

* MQ should be configurable to high throughput or low-latency

# Terms

* Integration (definition?) (protocol, format, data schema & evolution)
* Data Stream - continuous flow of data. Some examples of data streams include sensor data, activity logs from web browsers, and financial transaction logs. General Characteristics of Data Streams: time sensitive, continuous, heterogeneous, imperfect.

# Messaging models

The most popular messaging models are point-to-point and publish-subscribe.

## Point-to-point

Point-to-point model is common for traditional message queues. In this model, a message sent to a queue can be consumed by one and only one consumer.

## Pub/Sub pattern

Before discussing the specifics of Apache Kafka, it is important for us to understand the concept of publish/subscribe messaging and why it is a critical component of data-driven applications. Publish/subscribe (pub/sub) messaging is a pattern that is characterized by the sender (publisher) of a piece of data (message) not specifically directing it to a receiver. *Instead, the publisher classifies the message somehow, and that receiver (subscriber) subscribes to receive certain classes of messages.* Pub/sub systems often have a broker, a central point where messages are published, to facilitate this pattern.

# ISR (In-Sync Replicas)

# Delivery Semantics

implementing delivery semantics in Kafka

# Retry composition

# Parameters and Limits

# Event-Sourcing

ES is about state, about persisting state. It's an iternal implementation detail.
