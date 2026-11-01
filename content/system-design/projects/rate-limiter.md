---
draft: false
toc: true
title: "Rate Limiter: Reading and Design Outline"
description: "A partial rate-limiter article and design outline covering throttling use cases, requirements, high-level design, estimation, and distributed algorithms."
linkTitle: "Rate Limiter: Reading and Design Outline"
---
# Rate Limiter


Partial article plan, source excerpts, and personal critique. Includes open tasks and questions about distributed algorithms. Return to [practice cases]({{< ref "system-design/projects" >}}).

# Sources


<https://www.youtube.com/watch?v=FU4WlwfS3G0>

chapter from SD interview insider's guide

<https://medium.com/criteo-engineering/distributed-rate-limiting-algorithms-a35f7e24783>

<https://www.mailgun.com/blog/it-and-engineering/gubernator-cloud-native-distributed-rate-limiting-microservices/>

# structure of the article


introduction

Which things should be in the article?

## Understand the problem and establish the design scope


As usual, let's start with the problem statement.

- So, here is an example. We have launched a web application which has become highly popular. Suddenly, one or several clients started to send much more requests than they did previously. And because of this, other clients of our application begin to experience higher latency for their requests, or a higher rate of failed requests. These situations may lead to a so-called "noisy neighbor problem" when one client utilizes too many shared resources on a service host, like CPU, memory, disk, or network I/O.
- Get another example. We may need cost reduction. Limiting excess requests means fewer servers and allocating more resources to high-priority APIs.

As a solution to these kinds of problems, we can use throttling.

Architectural characteristics:

- low latency
- accuracy
- scalability
- high availability
- fault tolerance
- integration easy

Possible requirement types for RL:

- where to place: client-side or server-side
- scale: startup or big company
- what information give to clients of throttled requests
- kind of throttling: soft or hard
- throttling rules: user id, IP, other properties
- level of RL
- should RL be part of an application or done as a separate service

Further, we can list some patterns to use:

- autoscaling capability of our service
- load balancer
- rate limiter <-- select this option

## Create a High-Level Design


<https://youtu.be/FU4WlwfS3G0?t=559>

### Check design with envelope estimation

## Desing Deep Dive


There are 3 possible ways:

OOP

<https://youtu.be/FU4WlwfS3G0?t=1009>

Going Distributed:

We need to decide between availability and performance trade-offs.

# Distributed algorithms


What we need is a centralized and synchronous storage system and an algorithm that can leverage it to compute the current rate for each client. An in-memory cache (like Memcached or Redis) is ideal. *But not all rate-limiting algorithms can be implemented with every caching system.* So let's see what kind of algorithm exists.

## Enforcement across nodes


The hub lists four ways for several nodes to share one limit: a central store, an owner node, a local share, and local counts synchronized periodically. See [rate limiting across nodes]({{< ref "system-design/elements/data-at-scale" >}}#rate-limiting-across-nodes). For this case:

- **Central store, as the default:** a Redis cluster partitioned by client key. Each check runs one Lua script that reads, updates, and sets the expiry of the client's bucket atomically, so two nodes cannot both admit the last request. The cost is one round trip, under a millisecond in the same zone, per request.
- **Algorithm and store fit:** a token bucket needs two fields per client (tokens and last refill time) and works with any store that runs an atomic script. A sliding-window log needs a sorted set of timestamps per client, which is exact but grows with the limit; a sliding-window counter approximates it with two counters.
- **When Redis is unreachable:** fail open with a local limit per node, the global limit divided by the node count, so an outage of the limiter does not become an outage of the API.
- **Hot clients:** one client's key lands on one Redis shard. For a very large client, keep a small local allowance per node and refill it from the central bucket in batches.

## Limits by tier


The critique above is right that a limiter also enforces contracts: a free plan gets less than a paid one.

- Key each limit by client and tier, and read the tier's limits from configuration, so changing a plan needs no deployment.
- Apply several limits at once, such as 10 requests per second for bursts and 10,000 per day as a quota. Reject when any limit is exhausted.
- Return 429 with `Retry-After` and the remaining-quota headers, so well-behaved clients back off instead of retrying at once.
- A paid tier may get a softer response at its limit, such as queueing or a short grace allowance instead of rejection.

## Wrapping Up


Algorithms

Criteo has said that a rate limiter is a critical piece of software, and its very goal is to protect the rest of the system from a heavy load. But I'm afraid I have to disagree with this point because there is a case where we can use it to suppress requests from a client on a free plan in a scheme with paid/free contracts.

You can refill a bucket at a fixed rate and on a token retrieval call.

- list definitions of the chosen architectural charateristics

Follow up:

performance optimization

So we have two models: one metamodel that contains a broad problem analysis and the part containing things mostly belonging to the SD interview process.

## Library sources


- [Xu 2020](/sources/system-design/interviews/xu-2020-system-design-interview-an-insiders-guide.pdf.enc), *System Design Interview: An Insider's Guide* -- chapter 4, a rate limiter
- Educative 2023: rate limiter, *Grokking Modern System Design Interview*
