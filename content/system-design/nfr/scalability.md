---
contributors: []
date: '2025-02-21T23:36:39.652315'
description: Default Description
draft: false
lastmod: '2025-02-21T23:36:39.652315'
summary: ''
title: Scalability
toc: true
weight: 810
---
Why scalability problems start with organizations and people, not technology, and what to do about it.

# Ontology
# Definitions

Definition. What is it that we really mean by scalability? A service is said to be scalable if when we increase the resources in a system, it results in increased performance in a manner *proportional* to resources added. Increasing performance in general means serving more units of work, but it can also be to handle larger units of work, such as when datasets grow.

Our review of the literature showed two main uses of the term scalability:
Definition 1. Scalability is the ability to handle increased workload (without adding resources to a system).
Definition 2. Scalability by extension. Scalability is the ability to handle increased workload by repeatedly applying a costeffective strategy for extending a system’s capacity. 

Capacity.


# Sources
highscalability.com
https://systemdesignprimer.netlify.app/getting-started
Designing Fine-Grained Microservices Book
https://www.lecloud.net/tagged/scalability/chrono
some slides - https://www.slideshare.net/jboner/scalability-availability-stability-patterns
http://horicky.blogspot.com/2010/10/scalable-system-design-patterns.html
https://resources.sei.cmu.edu/asset_files/TechnicalNote/2006_004_001_14681.pdf

https://github.com/binhnguyennus/awesome-scalability

# Common

There isn't one right way to scale a system, as the technique used will depend on the type of constraint you might have. We have a number of different types of scaling we can bring to bear to help with performance, robustness, or perhaps both:
- Vertical scaling. In a nutshell, this means getting a bigger machine. 
- Horizontal duplication. Having multiple things capable of doing the same work. 
- Data partitioning. Dividing work based on some attribute of the data, e.g., customer group. 
- Functional decomposition. Separation of work based on the type, e.g., microservice decomposition.

Understanding what combination of these scaling techniques is most appropriate will fundamentally come down to the nature of the scaling issue you are facing.

# Combining Models

One of the main drivers behind the original Scale Cube was to stop us from thinking narrowly in terms of one type of scaling, and to help us understand that it often makes sense to scale our application along multiple axes, depending on our need. 

It’s worth noting that by scaling along one axis, other axes might be easier to make use of. For example, the functional decomposition of Order enables us to then spin up multiple duplicates of the Order microservice, and also to partition the load on order processing. Without that initial functional decomposition, we’d be limited to applying those techniques on the monolith as a whole.

The goal when scaling isn’t necessarily to scale along all axes, but we should be aware that we have these different mechanisms at our disposal. Given this choice, it’s important we understand the pros and cons of each mechanism to work out which ones make the most sense.

# Vertical Scaling

Benefits.
It is fast. On virtualized infrastructure, especially on a public cloud provider, implementing this form of scaling will be fast.
Benefits for other types. It’s also worth noting that vertical scaling can make it easier to perform other types of scaling.
Transparency. Your code or database is unlikely to need any changes to make use of the larger underlying infrastructure, assuming the operating system and chipsets remain the same. Even if changes are needed to your application to make use of the change of hardware, they might be limited to things like increasing the amount of memory available to your runtime through runtime flags.

# Horizontal Duplication

With horizontal duplication, you duplicate part of your system to handle more workloads. The exact mechanisms vary—we'll look at implementations shortly—but fundamentally horizontal duplication requires you to have a way of *distributing the work* across these duplicates.

As with vertical scaling, this type of scaling is on the simpler end of the spectrum and is often one of the things I’ll try early on. If your monolithic system can’t handle the load, spin up multiple copies of it and see if that helps!

- *Load Balancer.* Probably the most obvious form of horizontal duplication that comes to mind is making use of a load balancer to distribute requests across multiple copies of your functionality. Load balancer capabilities differ, but you'd expect them all to have some mechanism to distribute load across the nodes, and to detect when a node is unavailable and remove it from the load balancer pool. #pattern/lb
- *Queue*. Another example of horizontal duplication could be the competing consumer pattern. 
- Making use of *read replicas* to scale read traffic. In the case of FoodCo, a form of horizontal duplication has been used to reduce the read load on the primary database through the use of read replicas. This has reduced read load on the primary database node, freeing up resources to handle writes, and has worked very effectively, as a lot of the load on the main system was read-heavy. These reads could easily be redirected to these read replicas, and it's common to use a load balancer over multiple read replicas.

# Data Partitioning

Data partitioning requires that we distribute load based on some aspect of data—perhaps distributing load based on the user, for example. 
More often than not, partitioning will be done by the subsystem you rely on. For example, Cassandra uses partitions to distribute both reads and writes across the nodes in a given "ring," and Kafka supports distributing messages across partitioned topics.
Source: 
https://docs.microsoft.com/en-us/azure/architecture/best-practices/data-partitioning
https://docs.microsoft.com/en-us/azure/architecture/patterns/sharding

## Horizontal partitioning (sharding)
In this strategy, each partition is a separate data store, but all partitions have the same schema. Each partition is known as a _shard_ and holds a specific subset of the data, such as all the orders for a specific set of customers.
The most important factor is the choice of a sharding key. It can be difficult to change the key after the system is in operation. The key must ensure that data is partitioned to spread the workload as evenly as possible across the shards.


sharding
https://medium.com/@jeeyoungk/how-sharding-works-b4dec46b3f6
facebook shard manager paper
https://kousiknath.medium.com/all-things-sharding-techniques-and-real-life-examples-in-nosql-data-storage-systems-3e8beb98830a
https://engineering.fb.com/2020/08/24/production-engineering/scaling-services-with-shard-manager/

## Vertical partitioning
In this strategy, each partition holds a subset of the fields for items in the data store. The fields are divided according to their pattern of use. For example, frequently accessed fields might be placed in one vertical partition and less frequently accessed fields in another.
## Benefits and Limitations
It's worth pointing out that data partitioning has limited utility in terms of improving system robustness. This is why, as outlined earlier, it is common to combine data partitioning with a technique like horizontal duplication to improve the robustness of a given partition.

# Functional Decomposition
With functional decomposition, you extract functionality and allow it to be scaled independently. Extracting functionality from an existing system and creating a new microservice is almost the canonical example of functional decomposition.
By itself, functional decomposition isn't going to make our system more robust, but it at least opens up the opportunity for us to build a system that can tolerate a partial failure of functionality, something we explored in more detail in Chapter 12.

# Scalability patterns

## Queue-Based Load leveling pattern

Use a queue that acts as a buffer between a task and a service it invokes in order to smooth intermittent heavy loads that can cause the service to fail or the task to time out. This can help to minimize the impact of peaks in demand on availability and responsiveness for both the task and the service.

A service might experience peaks in demand that cause it to overload and be unable to respond to requests in a timely manner. Flooding a service with a large number of concurrent requests can also result in the service failing if it's unable to handle the contention these requests cause.

Refactor the solution and introduce a queue between the task and the service. The task and the service run asynchronously. 

The queue decouples the tasks from the service, and the service can handle the messages at its own pace regardless of the volume of requests from concurrent tasks. Additionally, there's no delay to a task if the service isn't available at the time it posts a message to the queue.

This pattern provides the following benefits:

It can help to maximize availability because delays arising in services won't have an immediate and direct impact on the application, which can continue to post messages to the queue even when the service isn't available or isn't currently processing messages.

It can help to maximize scalability because both the number of queues and the number of services can be varied to meet demand.

It can help to control costs because the number of service instances deployed only have to be adequate to meet average load rather than the peak load.

link: https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling

## Priority queue

Prioritize requests sent to services so that requests with a higher priority are received and processed more quickly than those with a lower priority. This pattern is useful in applications that offer different service level guarantees to individual clients.

Using a priority-queuing mechanism can provide the following advantages:

It allows applications to meet business requirements that require the prioritization of availability or performance, such as offering different levels of service to different groups of customers.

The multiple message queue approach can help maximize application performance and scalability by partitioning messages based on processing requirements. For example, you can prioritize critical tasks so that they're handled by receivers that run immediately, and less important background tasks can be handled by receivers that are scheduled to run at times that are less busy.

link: https://learn.microsoft.com/en-us/azure/architecture/patterns/priority-queue

# Caching

You can use cache to reduce load on a target system (which data cache holds). Thus allowing another parts of the system to be scaled effectively. [caching](system-design/topics/caching.md)

# CQRS

The Command Query Responsibility Segregation (CQRS) pattern refers to an alter‐
nate model for storing and querying information. Rather than our having a single
model for how we both manipulate and retrieve data, as is common, responsibilities
for reads and writes are instead handled by separate models. These separate read and
write models, implemented in code, could be deployed as separate units, giving us the
ability to scale reads and writes independently. CQRS is often, though not always,
used in conjunction with event sourcing, where—rather than storing the current state
of an entity as a single record—we instead project the state of an entity by looking at
the history of events related to that entity.
Arguably, CQRS is doing something very similar in our application tier to what read
replicas can do in the data tier, although due to the large number of different ways
CQRS can be implemented, this is a simplification.
Personally, although I see value in the CQRS pattern in some situations, it’s a com‐
plex pattern to execute well. I’ve spoken to very smart people who have hit not insig‐
nificant issues in making CQRS work. As such, if you are considering CQRS as a way
to help scale your application, regard it as one of the harder forms of scaling you’d
need to implement, and perhaps try some of the easier stuff first.

One final note on CQRS and event sourcing: from the point of view of a microservice
architecture, the decision to use or not use these techniques is an internal implemen‐
tation detail of a microservice. If you’ve decided to implement a microservice by split‐
ting responsibility for reads and writes across different processes and models, for
example, this should be invisible to consumers of the microservice. If inbound
requests need to be redirected to the appropriate model based on the request being
made, make this the responsibility of the microservice implementing CQRS. Keeping
these implementation details hidden from consumers gives you a lot of flexibility to
change your mind later, or to change how you are using these patterns.

# Communications and Asynchronism

We can see communication style as enabler to scalability. 
You can use asyncronism to parallelization of workload of service.

# Queues

**Patterns.** 
Idempotency. Asynchronism. Map-Reduce. Space-based Architectures. Stateless services.

stateless services and idempotent API as a key to scalability


stateless services and idempotent API as a key to scalability what is about: common things, links and my thoughts on SD*

# Stateless services

Steve should always get the same results of his request back, independent what server he  "landed on". That leads to the *first golden rule for scalability*: every server contains exactly the same codebase and does not store any user-related data, like sessions or profile pictures, on local disc or memory. 

Sessions need to be stored in a centralized data store which is accessible to all your application servers. It can be an external database or an external persistent cache, like Redis. An external persistent cache will have better performance than an external database. By external I mean that the data store does not reside on the application servers. Instead, it is somewhere in or near the data center of your application servers.

# Path or Instruction
1. Choose database: SQL or NoSQL for appropriate functionality after first vertical and horizontal duplication. 
2. Start Small
3. Define scalability axes chain

The architecture that gets you started may not be the architecture that keeps you
going when your system has to handle very different volumes of load. As we’ve
already seen, there are some forms of scaling that can have extremely limited impact
on the architecture of your system—vertical scaling and horizontal duplication, for
example. At certain points, though, you need to do something pretty radical to
change the architecture of your system to support the next level of growth.
A redesign may mean splitting apart an existing monolith, as it did for Gilt. Or it
might mean picking new data stores that can handle the load better. It could also
mean adopting new techniques, such as moving from synchronous request-response
to event-based systems, adopting new deployment platforms, changing whole tech‐
nology stacks, or everything in between.
There is a danger that people will see the need to rearchitect when certain scaling
thresholds are reached as a reason to build for massive scale from the beginning. This
can be disastrous. At the start of a new project, we often don’t know exactly what we
want to build, nor do we know if it will be successful. We need to be able to rapidly
experiment and understand what capabilities we need to build. If we tried building
for massive scale up front, we’d end up front-loading a huge amount of work to pre‐
pare for load that may never come, while diverting effort away from more important
activities, like understanding if anyone will actually want to use our product. Eric
Ries tells the story of spending six months building a product that no one ever down‐
loaded. He reflected that he could have put up a link on a web page that 404’d when
people clicked on it to see if there was any demand, spent six months on the beach
instead, and learned just as much!

# Autoscaling
A news site is a great example of a type of business in which you may want a mix of
predictive and reactive scaling. On the last news site I worked on, we saw very clear
daily trends, with views climbing from the morning to lunchtime and then starting to
decline. This pattern was repeated day in and day out, with traffic generally lower on
the weekend. That gave us a fairly clear trend that could drive proactive scaling of
resources, whether up or down. On the other hand, a big news story would cause an
unexpected spike, requiring more capacity and often at short notice.

# High-Level Trade-Offs
## Performance vs Scalability

Another way to look at performance vs scalability:
-   If you have a **performance** problem, your system is slow for a single user.
-   If you have a **scalability** problem, your system is fast for a single user but slow under heavy load.

And we have another considerations: firstly you have to build performant system, and after it you should brind scalability to your system. 

Scalability problem may lead to performance problem.  #scalability 

## Latency vs Throughput
Latency and throughput are the two most important measures of the performance of a system. 

**Latency** is the time to perform some action or to produce some result.
**Throughput** is the number of such actions or results per unit of time.

Generally, you should aim for **maximal throughput** with **acceptable latency**.

## Availability vs Consistency
Here should be analysis of CAP theorem