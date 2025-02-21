---
contributors: []
date: 2025-02-21T15:53:28.152776
description: Default Description
draft: false
lastmod: 2025-02-21T15:53:28.152776
summary: ''
title: Elements
toc: true
weight: 810
---

syn: element, pattern, high-level strategy

From
https://docs.microsoft.com/en-us/azure/architecture/patterns/
interviewing.io
system-design-primer

* Distributed computing with MapReduce
* Consistent hashing
* Scatter gather
  stateless services and idempotent API as a key to scalability

**pattern description blueprint:**
a definition of a pattern;
which problems this patterns solves;
specific algorithm(s) of work and {scenario}/{case};  
trade-offs and analogues;
specific implementations / solutions { s }

also, you can introduce a rule of thumb practice (when to use )

# dns

todo: add description and usage of DNS in a SD interview

## cdn

A content delivery network (CDN) is a globally distributed network of proxy servers, serving content from locations closer to the user.

Serving content from CDNs can significantly improve performance in two ways:

* Users receive content from data centers close to them
* Your servers do not have to serve requests that the CDN fulfills

# Load Balancer

*Load balancing* refers to efficiently distributing incoming network traffic across a group of backend servers, also known as a server farm or server pool.

Why do we need LB?
LB is to provide redundancy, reliability, and improve performance.

terms: LB policy (server selection strategy), backend set list (server pool).

LB policies: purely random, RR, weighted RR, load- or timeout-based, least (+weighted) connections, ip-based (hashing), path based (functional decomposition), combined policy and model.

On which levels LB can be done? L4 and L7

Service Discovery.

Service discovery is the mechanism the load balancer uses to discover the pool of servers it can route requests to. A naive way to implement it is to use a static configuration file that lists the IP addresses of all the servers, which is painful to manage and keep up to date. A more flexible solution is to have a fault-tolerant coordination service, like, e.g., etcd or Zookeeper, manage the list of servers. When a new server comes online, it registers itself to the coordination service with a TTL. When the server unregisters itself, or the TTL expires because it hasn't renewed its registration, the server is removed from the pool.

Examples of Load Balancers: nginx, haproxy, ... .

# proxy

Proxy runs on behalf of client where is RP is running on behalf of server. Can do many interesting things: filter requests, logging, caching, LB, changing infromation in requests and responses.

# API Gateway

[api_gateway](api_gateway.md)

trade-offs

# pub/sub

todo: resolve some problems, situations (for example, rebalancing)
See 'events' file for more detailed view.
todo: refactor to messaging

# asynchronism

message queues, task queues
[queues](../topics/queues.md)

# sidecar pattern

Segregating the functionalities of an application into a separate process can be viewed as Sidecar Pattern.

# service mesh

The evolution of service mesh architecture has been a game changer. It shifts the complexity associated with microservice architecture to a separate infrastructure layer and provides a lot of functionalities like load balancing, service discovery, traffic management, circuit breaking, telemetry, fault injection, and more.

# distributed calculations

# key-value store

IM data grid

# rate limiting

going distributed problems and solutions:
tier-base RL is more complicated

# security

The question of security is all about the trade off between total safety (a wall) vs total convenience (a hole in the wall).

processes: authentication (figuring out who are you talking to) and authorization ()

sources: sam newmans book, interviewing.io sd section,

That way you can rely on two factors to authenticate who’s at the door: looking through the peephole and asking for the password to authenticate.

hashing (store the hashes of passwords in a db)
salting, rainbow tables

# sequencer

from https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/system-design-sequencer
