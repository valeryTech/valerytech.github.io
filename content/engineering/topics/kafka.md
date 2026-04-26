---
draft: false
toc: true
title: "Kafka"
linkTitle: "Kafka"
---
Kafka is a distributed system consisting of **servers** and **clients** that communicate via a high-performance [TCP network protocol](https://kafka.apache.org/protocol.html).

Apache Kafka itself has specific characteristics, as of: distributed, fault tolerant, has horizontal scalability, resilient architecture.

Var:

- Serialization/deserealization type must not change during a topic lifecycle.
- You can use Kafka Consumers Replica Fetching (reading from ISR not a Leader) to improve latency and also decrease network costs if using a cloud.
- In Kafka, there is no support for wildcard topic selection on server side. The topic name has to be an exact match.

# Questions


How Apache Kafka is scaling?

What the main parts of AK?

to investigate and/or create:

definition of integration

definition of Kafka

various scenarios to play

play scenario when producer `acks=all` and none of the brokers are available

producer flow

consumer flow

producer modes and acks

how to monitor/profile producers and consumers (average batch size, etc.)

how to quickly find and process specific type of messages?

errors:

- when a producer is crashed
- when a consumer is crashed

how producer works internally

how consumer works internally

tuning Kafka

build and replay scenarios

questions from internet:

<https://www.projectpro.io/article/kafka-interview-questions-and-answers/438#mcetoc_1g6amq60m3qp>

# Use cases


check and describe videos from conduktor's course and definitife guide

# Main Concepts


An **event** records the fact that "something happened" in the world or in your business. It is also called record or message in the documentation. When you read or write data to Kafka, you do this in the form of events. Conceptually, an event has a key, value, timestamp, and optional metadata headers. (1)

**Producers** are those client applications that publish (write) events to Kafka, and **consumers** are those that subscribe to (read and process) these events. In Kafka, producers and consumers are fully decoupled and agnostic of each other, which is a key design element to achieve the high scalability that Kafka is known for. For example, producers never need to wait for consumers.

The documentation of Kafka introduces a chapter with API description aslo. So this is a important point to the creators of Kafka.

## Topics


Definition 1. Events are organized and durably stored in **topics**. Very simplified, a topic is similar to a folder in a filesystem, and the events are the files in that folder. An example topic name could be "payments". Topics in Kafka are always multi-producer and multi-subscriber: a topic can have zero, one, or many producers that write events to it, as well as zero, one, or many consumers that subscribe to these events. Events in a topic can be read as often as needed -- unlike traditional messaging systems, events are not deleted after consumption.

Definition 2. Kafka topics are the categories used to organize messages.

Definition 3. According to another definitions topic is a particular stream of data.

You cannot query topics.

Kafka topics are **immutable**: once data is written to a partition, it cannot be changed

## Partitions


**What are Kafka Partitions?**

Topics are broken down into a number of partitions. A single topic may have more than one partition, it is common to see topics with 100 partitions.

## Offsets


The offset is an integer value that Kafka adds to each message as it is written into a partition. Each message in a given partition has a unique offset.

*Kafka Offset Ordering*

Offset only has a meaning for a specific partition.

If a topic has more than one partition, Kafka guarantees the order of messages within a partition, but there is no ordering of messages across partitions.

# Producers


Applications that send data into topics are known as Kafka producers.

There are many reasons an application might need to write messages to Kafka: recording user activities for auditing or analysis, recording metrics, storing log messages, recording information from smart appliances, communicating asynchronously with other applications, buffering information before writing to a database, and much more.

Those diverse use cases also imply diverse requirements: is every message critical, or can we tolerate loss of messages? Are we OK with accidentally duplicating messages? Are there any strict latency or throughput requirements we need to support?

A Kafka producer sends messages to a topic, and messages are distributed to partitions according to a mechanism such as key hashing. Producers know to which partition to write to (and which Kafka broker has it).

There are three primary methods of sending messages:

**Fire-and-forget**

We send a message to the server and don't really care if it arrives successfully or not. Most of the time, it will arrive successfully, since Kafka is highly available and the producer will retry sending messages automatically. However, in case of nonretriable errors or timeout, messages will get lost and the application will not get any information or exceptions about this.

**Synchronous send**

Technically, Kafka producer is always asynchronous -- we send a message and the send() method returns a Future object. However, we use can use get() to wait on the Future and see if the send() was successful or not before sending the next record.

If you send messages synchronously, the sending thread will spend this time waiting and doing nothing else, not even sending additional messages. This leads to very poor performance, and as a result, synchronous sends are usually not used in production applications (but are very common in code examples).

**Asynchronous send**

We call the send() method with a callback function. A callback method the user can implement to provide asynchronous handling of request completion. This method will be called when the record sent to the server has been acknowledged.

**Errors.**

KafkaProducer has two types of errors. Retriable errors are those that can be resolved by sending the message again. For example, a connection error can be resolved because the connection may get reestablished. A "not leader for partition" error can be resolved when a new leader is elected for the partition and the client metadata is refreshed. KafkaProducer can be configured to retry those errors automatically, so the application code will get retriable exceptions only when the number of retries was exhausted and the error was not resolved. Some errors will not be resolved by retrying -- for example, "Message size too large." In those cases, KafkaProducer will not

attempt a retry and will return the exception immediately.

Also there are some alogrithms created by conduktor in the udemy course.

Producer reprocessing images?

**Idempotent producer**

**Message Keys**.

Each event message contains an optional key and a value. Keys serve two goals: they are additional information that gets stored with the message, and they are typically also used to decide which one of the topic partitions the message will be written to (keys also play an important role in compacted topics). All messages with the same key will go to the same partition. This means that if a process is reading only a subset of the partitions in a topic, all the records for a single key will be read by the same process.

**Key hashing.** A Kafka partitiones which resides in `Producer` is a code that takes a record and determines to which partition to sent it into. Adding partitions to a topic completely alters the hashing formula and thus keys to partitions mapping.

**Headers**. There can be a list of optional Kafka message headers in the form of key-value pairs. It is common to add headers to specify metadata about the message, especially for tracing.

**Partition + Offset**. Once a message is sent into a Kafka topic, it receives a partition number and an offset id. The combination of topic+partition+offset uniquely identifies the message

## Structure of Producer


Producer has a batch per partitions for messages to send. The sizes of these batches are controllable.

## Settings


**Message Durability.**

For data durability, the `KafkaProducer` has the configuration setting `acks`. The `acks` configuration specifies how many acknowledgments the producer receives to consider a record delivered to the broker. The options to choose from are:

- `none`: The producer considers the records successfully delivered once it sends the records to the broker. This is basically "fire and forget."
- `one`: The producer waits for the lead broker to acknowledge that it has written the record to its log.
- `all`: The producer waits for an acknowledgment from the lead broker and from the following brokers that they have successfully written the record to their logs.

**Message Ordering.**

**Queuing Limits**: Use `buffer.memory` to limit the total memory that is available to the Java client for collecting unsent messages. When this limit is hit, the producer will block on additional sends for as long as `max.block.ms` before raising an exception. Additionally, to avoid keeping records queued indefinitely, you can set a timeout using `request.timeout.ms`.

**Batching and compression.**

Two settings to influence the batching mechanism:

`linger.ms` - how long to wait until we send a batch (for example `5ms`)

`batch.size` -  maximum number of bytes that will be included into a batch (for example 32KB or 64KB)

For a message to be successfully written into a Kafka topic, a producer must specify a level of acknowledgment (acks).

<https://strimzi.io/blog/2020/10/15/producer-tuning/>

- also you should use producer compression

# Consumers


Applications that need to read data from Kafka use a KafkaConsumer to subscribe to Kafka topics and receive messages from these topics. Reading data from Kafka is a bit different than reading data from other messaging systems, and there are a few unique concepts and ideas involved. It can be difficult to understand how to use the Consumer API without understanding these concepts first.

Kafka consumers are also known to implement a "pull model". This means that Kafka consumers must request data from Kafka brokers in order to get it (instead of having Kafka brokers continuously push data to consumers). This implementation was made so that consumers can control the speed at which the topics are being consumed.

The consumer API is centered around the `poll()` method, which is used to retrieve records from the brokers. The `subscribe()` method controls which topics will be fetched in poll. Typically, consumer usage involves an initial call to `subscribe()` to setup the topics of interest and then a loop which calls `poll()` until the application is shutdown.

The poll loop does a lot more than just get data. The first time you call poll() with a new consumer, it is responsible for finding the GroupCoordinator, joining the consumer group, and receiving a partition assignment. If a rebalance is triggered, it will be handled inside the poll loop as well, including related callbacks. This means that almost everything that can go wrong with a consumer or in the callbacks used in its listeners is likely to show up as an exception thrown by poll().

Keep in mind that if poll() is not invoked for longer than max.poll.interval.ms, the consumer will be considered dead and evicted from the consumer group, so avoid doing anything that can block for unpredictable intervals inside the poll loop.

## Consumer Groups


We have seen that consumers can consume data from Kafka topics partitions individually, but for horizontal scalability purposes it is recommended to consume Kafka topics as a group. Consumers that are part of the same application and therefore performing the same "logical job" can be grouped together as a Kafka consumer group.

The benefit of leveraging a Kafka consumer group is that the consumers within the group will coordinate to split the work of reading from different partitions.

## Partition Assignment


Kafka Clients allows you to implement your own partition assignment strategies for consumers. This can be very useful to adapt to specific deployment scenarios, such as the failover example we used in this post. In addition, the ability to transmit user data to the consumer leader during rebalancing can be leveraged to implement more complex and stateful algorithms, such as one developed for Kafka Stream (<https://medium.com/streamthoughts/understanding-kafka-partition-assignment-strategies-and-how-to-write-your-own-custom-assignor-ebeda1fc06f3>)

## Static Group Membership


By default, the identity of a consumer as a member of its consumer group is transient. When consumers leave a consumer group, the partitions that were assigned to the consumer are revoked, and when it rejoins, it is assigned a new member ID and a new set of partitions through the rebalance protocol.

All this is true unless you configure a consumer with a unique group.instance.id, which makes the consumer a static member of the group. When a consumer first joins a consumer group as a static member of the group, it is assigned a set of partitions according to the partition assignment strategy the group is using, as normal. However, when this consumer shuts down, it does not automatically leave the group -- it remains a member of the group until its session times out. When the consumer rejoins the group, it is recognized with its static identity and is reassigned the same partitions it previously held without triggering a rebalance. The group coordinator that caches the assignment for each member of the group does not need to trigger a rebalance but can just send the cache assignment to the rejoining static member.

Terms:

Coordinator; heartbeats; rebalance process;

## Consumer Position


Keeping track of *what* has been consumed is, surprisingly, one of the key performance points of a messaging system.

Kafka brokers use an internal topic named `__consumer_offsets` that keeps track of what messages a given **consumer group** last successfully processed.

Kafka handles this differently than other messaging systems (from documentation). Our topic is divided into a set of totally ordered partitions, each of which is consumed by exactly one consumer within each subscribing consumer group at any given time. This means that the position of a consumer in each partition is just a single integer, the offset of the next message to consume. This makes the state about what has been consumed very small, just one number for each partition. This state can be periodically checkpointed. This makes the equivalent of message acknowledgements very cheap.

There is a side benefit of this decision. A consumer can deliberately *rewind* back to an old offset and re-consume data. This violates the common contract of a queue, but turns out to be an essential feature for many consumers. For example, if the consumer code has a bug and is discovered after some messages are consumed, the consumer can re-consume those messages once the bug is fixed.

## Partition rebalance


As we saw in the previous section, consumers in a consumer group share ownership of the partitions in the topics they subscribe to. When we add a new consumer to the group, it starts consuming messages from partitions previously consumed by another consumer. The same thing happens when a consumer shuts down or crashes; it leaves the group, and the partitions it used to consume will be consumed by one of the remaining consumers. Reassignment of partitions to consumers also happens when the topics the consumer group is consuming are modified (e.g., if an administrator adds new partitions).

Moving partition ownership from one consumer to another is called a rebalance. Rebalances are important because they provide the consumer group with high availability and scalability (allowing us to easily and safely add and remove consumers), but in the normal course of events they can be fairly undesirable.

There are two types of rebalances, depending on the partition assignment strategy that the consumer group uses:

Strategies:

- Eager Rebalance. By default, consumers perform eager rebalancing, which means that all consumers stop consuming from Apache Kafka and give up the membership of their partitions. During this period of time, the entire consumer group stops processing, this is also called a *"stop the world"* event. They will rejoin the consumer group and get a new partition assignment, but *don't necessarily "get back"* the partitions that were previously assigned to them.
- Cooperative rebalances. These (also called incremental rebalances) typically involve reassigning only a small subset of the partitions from one consumer to another, and allowing consumers to continue processing records from all the partitions that are not reassigned. This is achieved by rebalancing in two or more phases.

<https://medium.com/streamthoughts/apache-kafka-rebalance-protocol-or-the-magic-behind-your-streams-applications-e94baf68e4f2>

**Rebalance Listeners**

As we mentioned in the previous section about committing offsets, a consumer will want to do some cleanup work before exiting and also before partition rebalancing.

If you know your consumer is about to lose ownership of a partition, you will want to commit offsets of the last event you've processed. Perhaps you also need to close file handles, database connections, and such.

The Consumer API allows you to run your own code when partitions are added or removed from the consumer. You do this by passing a ConsumerRebalanceListener when calling the subscribe() method we discussed previously.

## Consumer Flow

## Why use Consumer Offsets


Offsets are critical for many applications. If a Kafka client crashes, a rebalance occurs and the latest committed offset help the remaining Kafka consumers know where to restart reading and processing messages.

In case a new consumer is added to a group, another consumer group rebalance happens and consumer offsets are yet again leveraged to notify consumers where to start reading data from.

Therefore consumer offsets must be committed regularly.

## Delivery Semantics

## Automatic Offset Committing Strategy


By default, the property `enable.auto.commit=true` and therefore offsets are committed automatically with a frequency controlled by the config `auto.commit.interval.ms`.

The process of committing the offsets happens when: the `.poll()` function is called AND the time between two calls to `.poll()` is greater than the setting `auto.commit.interval.ms` (5 seconds by default).

## Commit current offset


Most developers exercise more control over the time at which offsets are committed -- both to eliminate the possibility of missing messages and to reduce the number of messages duplicated during rebalancing. The Consumer API has the option of committing the current offset at a point that makes sense to the application developer rather than based on a timer.

How to commit

This means that to be in an "at-least-once" processing use case (the most desirable one), you need to ensure all the messages in your consumer code are successfully processed before performing another `.poll()` call (which is the case in the sample code defined above). If this is not the case, then offsets could be committed before the messages are actually processed, therefore resulting in an "at-most once" processing pattern, possibly resulting in message skipping (which is undesirable).

In that (rare) case, you must disable `enable.auto.commit`, and most likely most processing to a separate thread, and then from time to time call `.commitSync()` or `.commitAsync()`with the correct offsets manually.

(<https://www.conduktor.io/kafka/delivery-semantics-for-kafka-consumers#Automatic-Offset-Committing-Strategy-4>)

## Faults and Errors processing


In a distributed system, consumers might encounter all sorts of issues including network issues, crashes, restarts etc.

## Offset management


<https://docs.confluent.io/3.0.0/clients/consumer.html#detailed-examples>

## Consumer Advanced Topics


<https://www.conduktor.io/kafka/advanced-kafka-consumer-with-java>

# Exactly one semantics


<https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/>

and add some from definitive guide

# Partitioning


**Keys partitioning**

When the default partitioner is used, the mapping of keys to partitions is consistent only as long as the number of partitions in a topic does not change. So as long as the number of partitions is constant, you can be sure that, for example, records regarding user 045189 will always get written to partition 34. This allows all kinds of optimization when reading data from partitions. However, the moment you add new partitions to the topic, this is no longer guaranteed -- the old records will stay in partition 34 while new records may get written to a different partition. When partitioning keys is important, the easiest solution is to create topics with sufficient partitions and never add partitions.

see also [Consumer rebalancing](#consumer-rebalancing)

**When `key is null`**

In case the key (`key=null`) is not specified by the producer, messages are distributed evenly across partitions in a topic. This means messages are sent in a round-robin fashion. But in the last versions of Kafka Stricky Partitioner is a DefaultPartitioner which is used when there is no key is noticed in a record. It will fill a batch of messages sent to a single partition before switching to the next partition. This allows sending the same number of messages to Kafka in fewer requests, leading to lower latency and reduced CPU utilization on the broker.

**When `key!=null`**

When choosing a partition strategy, its important to plan for resource bottlenecks and storage efficiency. In addition to the default partitioner, Apache Kafka clients also provide RoundRobin Partitioner and UniformStickyPartitioner. These provide random partition assignment and sticky random partition assignment even when messages have keys.

**Custom partitioning strategy**

However, Kafka does not limit you to just hash partitions, and sometimes there are good reasons to partition data differently.

sources

<https://www.learningjournal.guru/courses/kafka/kafka-foundation-training/custom-partitioner/>

# Reprocessing


DLQs can keep service delays from blocking the processing of your messages. For example, instead of using a unique topic for each customer to which you need to send data (potentially millions of topics),  you may prefer to use a shared topic, or a series of shared topics that contain all of your customers. But if you are sending to multiple customers from a shared topic and one customer's REST API is down -- instead of delaying the process entirely -- you can have that customer's events divert into a dead letter queue. You can then process them later from that queue.

Dead letter & reprocessing:

<https://www.confluent.io/blog/kafka-connect-deep-dive-error-handling-dead-letter-queues/>

<https://eng.uber.com/reliable-reprocessing/>

en: Utilizing these properties, the Uber Insurance Engineering team extended Kafka's role in our existing event-driven architecture by using non-blocking request reprocessing and dead letter queues (DLQ) to achieve decoupled, observable error-handling without disrupting real-time traffic.

A DLQ should allow listing for viewing the contents of the queue, purging for clearing those contents, and merging for reprocessing the dead-lettered messages, allowing comprehensive resolution for all failures affected by a shared issue. At Uber, we needed a retry strategy that would reliably and scalably afford us these capabilities .

# Compactification

# Tuning Apache Kafka


Optimum performance involves the consideration of two key measures: latency and throughput. Latency refers to the time taken to process one event. Hence a lower latency is required for better performance. Throughput denotes the number of events that can be processed in a specific amount of time, and hence, the goal is to always have a higher throughput. Many systems tend to optimize one and end up compromising the other, but Kafka attains a perfect balance of the two.

**Tuning Apache Kafka for optimal performance involves:**

- Tuning Kafka Producer: Data that the producers publish to the brokers is stored in a batch and sent only when the batch is ready. To tune the producers, two parameters are taken into consideration -
	- Batch Size: The batch size has to be decided based on the nature of the volume of messages sent by the producer. Producers which send messages frequently will work better with larger batch sizes so that throughput can be maximized without compromising heavily on the latency. In cases where the producers do not send messages frequently, smaller batch size is preferred. In such cases, if the batch size is very large, it may never get full or take a long time to fill up. This will increase the latency and hence, compromise performance.
	- Linger Time: The linger time is added to create a delay to allow more records to be filled up in the batch so that larger batches can be sent. A longer linger time allows more messages to be sent in one batch but can result in compromising latency. On the other hand, a reduced linger time results in fewer messages getting sent faster, and as a result, there is lower latency but reduced throughput too.
- Tuning Kafka Brokers: Every partition has a leader associated with it and zero or more followers for the leader. While the Kafka cluster is running, due to failures in some of the brokers or due to reallocation of partitions, an imbalance may occur among the brokers in the cluster. Some brokers might be overworked compared to others. In such cases, it is important to monitor the brokers and ensure that the workload is balanced across the various brokers present in the cluster.
- Tuning Kafka Consumers: While tuning consumers, it is important to keep in mind that a consumer can read many partitions, but one consumer can only read one partition. A good practice to follow is to keep the number of consumers equal to or lower than the partition count. If the customers are lower than the partition count, the number of partitions can be an exact multiple of the number of consumers. More consumers than partitions will result in some consumers remaining idle.

# Partition Count


**How to Choose the Number of Partitions**

<https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/>

<https://www.conduktor.io/kafka/kafka-topics-choosing-the-replication-factor-and-partitions-count>

The first thing to understand is that a topic partition is the unit of parallelism in Kafka. On both the producer and the broker side, writes to different partitions can be done fully in parallel. So expensive operations such as compression can utilize more hardware resources. On the consumer side, Kafka always gives a single partition's data to one consumer thread. Thus, the degree of parallelism in the consumer (within a consumer group) is bounded by the number of partitions being consumed. Therefore, in general, the more partitions there are in a Kafka cluster, the higher the throughput one can achieve.

A rough formula for picking the number of partitions is based on throughput. You measure the throughout that you can achieve on a single partition for production (call it *p*) and consumption (call it *c*). Let's say your target throughput is *t*. Then you need to have at least *max(t/p, t/c)* partitions. The per-partition throughput that one can achieve on the producer depends on configurations such as the batching size, compression codec, type of acknowledgement, replication factor, etc. However, in general, one can produce at 10s of MB/sec on just a single partition as shown in this [benchmark](https://engineering.linkedin.com/kafka/benchmarking-apache-kafka-2-million-writes-second-three-cheap-machines). The consumer throughput is often application dependent since it corresponds to how fast the consumer logic can process each message. So, you really need to measure it.

Although it's possible to increase the number of partitions over time, one has to be careful if messages are produced with keys. When publishing a keyed message, Kafka deterministically maps the message to a partition based on the hash of the key. This provides a guarantee that messages with the same key are always routed to the same partition. This guarantee can be important for certain applications since messages within a partition are always delivered in order to the consumer. If the number of partitions changes, such a guarantee may no longer hold. To avoid this situation, a common practice is to over-partition a bit. Basically, you determine the number of partitions based on a future target throughput, say for one or two years later. Initially, you can just have a small Kafka cluster based on your current throughput. Over time, you can add more brokers to the cluster and proportionally move a subset of the existing partitions to the new brokers (which can be done online). This way, you can keep up with the throughput growth without breaking the semantics in the application when keys are used.

There are several factors to consider when choosing the number of partitions:

- What is the throughput you expect to achieve for the topic? For example, do you expect to write 100 KBps or 1 GBps?
- What is the maximum throughput you expect to achieve when consuming from a single partition? A partition will always be consumed completely by a single consumer (even when not using consumer groups, the consumer must read all messages in the partition). If you know that your slower consumer writes the data to a database and this database never handles more than 50 MBps from each thread writing to it, then you know you are limited to 50 MBps throughput when consuming from a partition.
- You can go through the same exercise to estimate the maximum throughput per  producer for a single partition, but since producers are typically much faster than If you are sending messages to partitions based on keys, adding partitions later can be very challenging, so calculate throughput based on your expected future usage, not the current usage.
- Consider the number of partitions you will place on each broker and available diskspace and network bandwidth per broker.
- Avoid overestimating, as each partition uses memory and other resources on the broker and will increase the time for metadata updates and leadership transfers.
- Will you be mirroring data? You may need to consider the throughput of your mirroring configuration as well. Large partitions can become a bottleneck in many mirroring configurations.
- If you are using cloud services, do you have IOPS (input/output operations per second) limitations on your VMs or disks? There may be hard caps on the number of IOPS allowed depending on your cloud service and VM configuration that will cause you to hit quotas. Having too many partitions can have the side effect of increasing the amount of IOPS due to the parallelism involved.consumers, it is usually safe to skip this.

# APIs


Kafka & ecosystem had introduced over time some new API that are higher level that solves specific sets of problems.

**Kafka Connect.** Connect Cluster (workers).

# Use the power of record headers

# Kafka Streams


it's an easy data processing and tranformation library within Kafka.

# Sources


intro

<https://kafka.apache.org/intro>

<https://www.conduktor.io/kafka/>

<https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/>

<https://www.confluent.io/blog/5-things-every-kafka-developer-should-know/>

<https://developer.confluent.io/podcast/if-streaming-is-the-answer-why-are-we-still-doing-batch/>

<https://www.confluent.io/blog/transactions-apache-kafka/>

conferences

Kafka Summit

<https://www.confluent.io/events/kafka-summit-london-2022/>

use cases

<https://www.confluent.io/blog/area/technology/?categories=use-cases>

docs

<https://kafka.apache.org/documentation.html#theproducer>

<https://kafka.apache.org/30/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html>

courses

<https://developer.confluent.io/learn-kafka/> #courses/kafka

<https://developer.confluent.io/learn-kafka/apache-kafka/events/> #courses/kafka

Flink vs Kafka <https://www.youtube.com/watch?v=Wqko7MunKZs>

# Questions (interview)


Explain some of the differences between the old consumer (in 0.8) and the new consumer (introduced in 0.9)?

What are all the major APIs in Kafka and when would you use one (like Kafka Connect) versus another (like Kafka Streams)?

What is the role of zookeeper in a Kafka cluster?

Explain what is a commit log, a topic, a partition, a segment, a consumer group, an offset?

What are the major extensibility points?

What is the difference between compacted topics and normal topics?

How is data ever deleted from Kafka?

What's is a leader?

What does it mean to have a replication factor of 3?

How does Kafka behave like a PubSub topic and also like a message queue?

What does the poll() method do in a consumer application?

What does serdes mean?

Explain the format of a Kafka message?

<https://a-great-day-out-with.github.io/kafka/index.html>

deep kafka audit and interesting topic: <https://www.redpanda.com/blog/redpanda-official-jepsen-report-and-analysis>
