---
draft: false
toc: true
title: "Building-Block Map and Study Template"
description: "A map of core system design components and patterns, with a study template, technical references, and topics for further development."
document_status: "canonical"
linkTitle: "Building-Block Map"
---

Organize the toolbox into core concepts, components and technologies, and patterns. Study them in relation to a problem: what does this element do, and why does this design need it?

The original topic collection is preserved in [building-block notes]({{< ref "system-design/archive/building-blocks-v0" >}}).

## How to study a building block


For each component or pattern, record:

1. The problem it solves and a concrete use case.
2. How it works, including the important request or data flow.
3. The assumptions and constraints under which it is useful.
4. Trade-offs, failure behavior, and alternatives.
5. Relevant implementations and examples from practice cases.

Keep concepts separate from product names. Use a specific implementation to deepen the explanation when its behavior matters.

## Request routing and delivery

### DNS


Study backlog: add a description of its role in the request path and how to discuss it during a design interview.

### CDN


A content delivery network serves content from distributed locations closer to users. The original notes emphasize reducing delivery distance and reducing requests handled by origin servers.

### Load balancer


Distributes incoming traffic across a pool of backend servers. Explain both the routing policy and how the backend pool is discovered and kept current.

Policies to study include random selection, round robin and weighted round robin, least connections, load-aware selection, hashing, and path-based routing. Distinguish L4 and L7 behavior where it matters.

The source notes discuss static configuration and registration with a coordination service such as etcd or ZooKeeper. NGINX and HAProxy are implementation examples to examine.

### Proxy


A forward proxy acts on behalf of clients; a reverse proxy acts on behalf of servers. The notes identify filtering, logging, caching, traffic distribution, and request or response changes as capabilities to consider.

### API gateway


See [API gateway]({{< ref "system-design/elements/api-gateway" >}}) for routing, shared request handling, and deciding whether a separate gateway belongs in the design.

## Communication and service boundaries


- [Messaging and events]({{< ref "system-design/elements/messaging" >}}): point-to-point and publish/subscribe models, delivery, ordering, retention, and retry questions.
- [Queue notes]({{< ref "engineering/topics/queues" >}}): related background.
- **Sidecar pattern:** place supporting functionality in a separate process alongside an application.
- **Service mesh:** study the infrastructure responsibilities identified in the notes: traffic management, discovery, load balancing, telemetry, and failure controls.
- [Microservices]({{< ref "engineering/topics/microservices" >}}): broader service-design notes.

## Data, distribution, and capacity


- [Database notes]({{< ref "engineering/data/databases" >}}): storage models, indexes, replication, and related fundamentals.
- [Scalability]({{< ref "system-design/nfr/scalability" >}}): duplication, partitioning, functional decomposition, caching, and asynchronous work.
- [Consistency]({{< ref "system-design/nfr/consistency" >}}): operation-specific guarantees and trade-offs.
- [Caching]({{< ref "engineering/topics/caching" >}}): cache behavior and use cases.
- [Distributed systems]({{< ref "engineering/topics/distributed-systems" >}}): coordination and distributed-system foundations.
- [Key-value store exercise]({{< ref "system-design/projects/key-value-store" >}}), [rate limiter]({{< ref "system-design/projects/rate-limiter" >}}), and [Snowflake ID sources]({{< ref "system-design/projects/infra/slowflake-id" >}}): focused applications.

## Topics to develop


The existing notes identify these gaps:

- API contracts, communication mechanisms, and protocols.
- Distributed coordination, leader election, transactions, sagas, and vector clocks.
- Consistent hashing, scatter-gather, and distributed computation such as MapReduce.
- Key-value stores and in-memory data grids.
- Rate limiting, including distributed and tier-based policies.
- Security: authentication, authorization, password hashing and salting, and usability trade-offs.
- Common design templates, including a CRUD service, control plane, and management interface.

Use [practice]({{< ref "system-design/system-design" >}}#a-practice-loop) to decide which gap to study next. The original notes mention these topic catalogs and pattern references:

- [Azure architecture patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/).
- [Modern system-design building blocks -- Educative](https://www.educative.io/courses/grokking-the-system-design-interview/introduction-to-building-blocks-for-modern-system-design).
- [Sequencer -- Educative](https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/system-design-sequencer).
- [System-design master template -- DesignGurus](https://www.designgurus.io/course-play/grokking-the-system-design-interview/doc/system-design-master-template).
- [Designing Data-Intensive Applications, second edition](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/).
