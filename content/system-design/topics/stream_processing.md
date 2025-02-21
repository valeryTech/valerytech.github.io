---
contributors: []
date: 2025-02-21T16:55:53.175711
description: Default Description
draft: false
lastmod: 2025-02-21T16:55:53.175711
summary: ''
title: Stream Processing
toc: true
weight: 810
---

dictionary:
today's mission-critical application
event streaming platform
data-driven organizations

Kafka as a Central Nervous System
Kafka gives you a really different way of thinking about data
Kafka is necessary but not sufficient for building modern data pipelines
Kafka + Schema ~ Rest + Json

# Sources

https://gist.github.com/aviflax/7f453a41a06a200a2f5d
https://medium.com/microservicegeeks/best-books-on-apache-kafka-and-event-stream-processing-c0d267e352bd

# Events etc

investigate topic: events, event-driven architecture, event streams
real time data streams with Kafka
stateless service and caches
Data Mesh and Data as a Product. contract, schema, api.

data pipelines done right
data pipeline technologies
modern data pipelines
data flow
streaming pipelines

5 principles of modern data flow:

1. Streaming - reality is real time: organization really wants to what is going on right now.
1. Decentralized
1. Declarative (ksqlDB SQL syntax)
1. Developer-Oriented (ksqlDB pipelines as code, can be checked into git)
1. Governed & Observable

* You should pick and white down links to info source when writing an article
* topic: Log abstraction and its possibilities in data engineering architecture

# Event-driven architecture vs. event streaming

Both event-driven architecture and event streaming center around *events*. Events are records of something that occurred, such as a mouse click, keystroke or loading a program. The difference in the platforms is in how the events are received.

# Event Driven Architecture (EDA)

# Event

common definition
definition from DDD

# Streams

The big advantage of storing raw event data is that you have maximum flexibility for analysis. For example, you can trace the sequence of pages that one person visited over the course of their session. You can't do that if you've squashed all the events into counters. That sort of analysis is really important for some offline processing tasks such as training a recommender system (e.g., "people who bought X also bought Y"). For such use cases, it's best to simply keep all the raw events so that you can later feed them all into your shiny new machine-learning system.

On the other hand, the aggregated data is the form in which it's ideal to read data from the database. If a customer is looking at the contents of their shopping cart, they are not interested in the entire history of modifications that led to the current state: they only want to know what's in the cart right now. An analytics application normally doesn't need to show the user the full list of all page views - only the aggregated summary in the form of a chart. Thus, when you're reading, you can get the best performance if the history of changes has already been squashed together into a single object representing the current state.

In general, the form of data that's best optimized for writing is not the same as the form that is best optimized for reading. It can thus make sense to separate the way you write to your system from the way you read from it (this idea is sometimes known as command-query responsibility segregation, or CQRS).

## Immutable Facts and the Source of Truth

From the Twitter and Facebook examples we can see a certain pat tern: the input events, corresponding to the buttons in the user interface, are quite simple. They are immutable facts, we can simply store them all, and we can treat them as the source of truth.

You can derive everything that you can see on a website - that is, everything that you read from the database - from those raw events. There is a process that derives those aggregates from the raw events, and which updates the caches when new events come in, and that process is entirely deterministic. You could, if necessary, re-run it from scratch: if you feed in the entire history of everything that ever happened on the site, you can reconstruct every cache entry to be exactly as it was before. The database you read from is just a cached view of the event log.

The beautiful thing about this separation between source of truth and caches is that in your caches, you can denormalize data to your heart's content. In regular databases, it is often considered best practice to normalize data, because if something changes, you then only need to change it one place. Normalization makes writes fast and simple, but it means you must do more work (joins) at read time. To speed up reads, you can denormalize data; that is, duplicate information in various places so that it can be read faster.

## Denormalization

Also, denormalization is just another form of duplicating data, similar to caching—if some value is too expensive to recompute on reads, you can store that value somewhere, but now you need to also keep it up-to-date when the underlying data changes. Materialized aggregates, such as those in the analytics example in Chapter 1, are again a form of redundant data.

I'm not saying that this duplication of data is bad—far from it. Caching, indexing, and other forms of redundant data are often essential for achieving good performance on reads. However, keeping the data synchronized between all these various different representations and storage systems becomes a real challenge.

# Stream processing

 > 
 > A key characteristic of stream processing is that the events are processed as soon as (or almost as soon as) they are available. This is to minimize the latency between the original event's entrance into the streaming system and the end result from processing the event. In most cases, the latency varies from a few milliseconds to seconds, which can be considered real-time or near real-time; hence, stream processing is also called real-time processing.

This is definition from Grokking - What is real-time here? We can do batching with near-real timings as well.

We would like streaming systems to process the events and generate results as soon as possible after the events are collected. This is desirable because it allows the results to be available with minimal delays and the proper reactions to be performed in time. Their real-time nature makes streaming systems very useful in many scenarios, such as the laboratory and the website, where low-latency results are desired.

The multi-stage architecture in batch and stream processing systems

# Streaming systems

If we *remove the latency* with the request/response model, I bet we can handle the traffic and keep an accurate real-time count of vehicles. One benefit is that streaming systems will handle this *type of data flow* better than the request/response model.

# Patterns

# Example Framework

Your job or components don't run by themselves. They are driven by a streaming engine. Let's take a look under the hood and inspect how your job is executed by the Streamwork engine. There are three moving parts (at the current state), and we are going to look into them one by one: source executor, operator executor, and job starter.

During the job execution, you've hopefully noticed the events automatically move from the sensor reader object to the vehicle counter object without you needing to implement any additional logic. Fancy, right?

terms:
the life of a data element
simple streaming engine

**Elements**

Job, also known as a Pipeline or a Topology, is an implementation of a streaming system. A job is composed of components (sources and operators) and streams connecting the components.

https://developer.confluent.io/patterns/ - event streaming patterns from Confluent
microservices patterns in java
ddd by vlad

````js
function fancyAlert(arg) { if(arg) { $.facebox({div:'#foo'}) } } 
````
