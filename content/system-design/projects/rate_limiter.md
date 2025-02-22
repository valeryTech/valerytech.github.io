---
contributors: []
date: '2025-02-21T23:36:39.657743'
description: Default Description
draft: false
lastmod: '2025-02-21T23:36:39.657743'
summary: ''
title: Rate Limiter
toc: true
weight: 810
---
Rate limiter (RL) example

Sources:
	https://www.youtube.com/watch?v=FU4WlwfS3G0
	chapter from SD interview insider's guide
	https://medium.com/criteo-engineering/distributed-rate-limiting-algorithms-a35f7e24783
	https://www.mailgun.com/blog/it-and-engineering/gubernator-cloud-native-distributed-rate-limiting-microservices/


**todo:**
review video and 
discuss Rate Limiter with Vladimir
write paper and place it to my site
communicate with other people and get feedback about my composed solution



# structure of the article:
introduction

Which things should be in the article?


## Understand the problem and establish the design scope

As usual, let's start with the problem statement. 

-   So, here is an example. We have launched a web application which has become highly popular. Suddenly, one or several clients started to send much more requests than they did previously. And because of this, other clients of our application begin to experience higher latency for their requests, or a higher rate of failed requests. These situations may lead to a so-called "noisy neighbor problem" when one client utilizes too many shared resources on a service host, like CPU, memory, disk, or network I/O.
-   Get another example. We may need cost reduction. Limiting excess requests means fewer servers and allocating more resources to high-priority APIs. 

As a solution to these kinds of problems, we can use throttling. 

Architectural characteristics:

-   low latency
-   accuracy
-   scalability
-   high availability
-   fault tolerance
-   integration easy

Possible requirement types for RL:

-   where to place: client-side or server-side
-   scale: startup or big company
-   what information give to clients of throttled requests
-   kind of throttling: soft or hard
-   throttling rules: user id, IP, other properties
-   level of RL
-   should RL be part of an application or done as a separate service

  

Further, we can list some patterns to use:

-   autoscaling capability of our service
-   load balancer
-   rate limiter <-- select this option

  

## Create a High-Level Design

https://youtu.be/FU4WlwfS3G0?t=559

### Check design with envelope estimation
 
## Desing Deep Dive
There are 3 possible ways:
OOP 
	https://youtu.be/FU4WlwfS3G0?t=1009
Going Distributed:
	We need to decide between availability and performance trade-offs.

# Distributed algorithms

What we need is a centralized and synchronous storage system and an algorithm that can leverage it to compute the current rate for each client. An in-memory cache (like Memcached or Redis) is ideal. *But not all rate-limiting algorithms can be implemented with every caching system.* So let's see what kind of algorithm exists.

  

## Wrapping Up


Algorithms




Criteo has said that a rate limiter is a critical piece of software, and its very goal is to protect the rest of the system from a heavy load. But I'm afraid I have to disagree with this point because there is a case where we can use it to suppress requests from a client on a free plan in a scheme with paid/free contracts. 

You can refill a bucket at a fixed rate and on a token retrieval call. 

- list definitions of the chosen architectural charateristics

Follow up:
performance optimization




So we have two models: one metamodel that contains a broad problem analysis and the part containing things mostly belonging to the SD interview process. 

