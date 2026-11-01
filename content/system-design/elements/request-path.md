---
draft: false
toc: true
title: "The Request Path"
description: "Design question hub on how a request reaches a healthy service instance: DNS, CDN, load balancers, proxies, API gateways, backends for frontends, service discovery, sidecars, and service meshes."
linkTitle: "Request Path"
---

**Question:** how does a client's request reach a healthy instance of the right service, and where along the way are shared policies applied?

Trace one concrete request from the client to the service that answers it. Each hop on the path should have a reason to be there.

## Forces


- **Latency:** distance to the user and the number of hops. Edge caching and geographic routing reduce both.
- **Availability:** unhealthy instances must leave the pool quickly and new ones must join it.
- **Scalability:** work is spread across instances, which requires that any instance can serve the request or that routing knows which one can. See [horizontal duplication]({{< ref "system-design/nfr/scalability" >}}#horizontal-duplication).
- **Change:** instances come and go, and internal services are split or merged, while the external API stays stable.
- **Shared policies:** TLS termination, authentication, rate limiting, and logging can live in one place or in every service.

## Reaching the system

### DNS


The first hop. A client resolves a name to addresses, and resolvers, operating systems, and browsers cache the answer for the record's time to live (TTL).

| Use | Mechanism | Costs |
| --- | --- | --- |
| Route to the nearest region | Latency-based or geographic records return the address of the closest healthy region. | Resolver location stands in for user location, which is not always accurate. |
| Shift traffic gradually | Weighted records send a share of resolutions to a new region, cluster, or provider. | Only coarse control: caches hold old answers for a TTL. |
| Fail over | Health-checked records stop returning a failed endpoint. | Failover takes at least one TTL, and some resolvers ignore short TTLs. |

DNS balances per resolution, not per request, and does not see an instance's health. A load balancer still sits behind each address. Anycast is the alternative CDNs use: the same IP address is announced from many locations, and network routing delivers each packet to the nearest one, so no DNS change is needed to move traffic.

In an interview, DNS usually takes one sentence: the client resolves the name and reaches the nearest region. It matters again when failover comes up, because the TTL bounds how fast clients move.

### CDN


A content delivery network serves content from distributed locations closer to users. The original notes emphasize reducing delivery distance and reducing the requests that reach origin servers.

## Reaching an instance

### Load balancer


Distributes incoming traffic across a pool of backend servers. Explain both the routing policy and how the backend pool is discovered and kept current (see [service discovery](#service-discovery)).

Policies to study include random selection, round robin and weighted round robin, least connections, load-aware selection, hashing, and path-based routing. Distinguish L4 and L7 behavior where it matters. NGINX and HAProxy are implementation examples to examine.

### Proxy


A forward proxy acts on behalf of clients; a reverse proxy acts on behalf of servers. The notes identify filtering, logging, caching, traffic distribution, and request or response changes as capabilities to consider.

## External API


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Direct client-to-service calls | Each client calls the services it needs. | One service, or internal clients only. | Clients depend on the internal service layout; many round trips over slow networks. |
| [API gateway]({{< ref "system-design/elements/api-gateway" >}}) | A single entry point routes requests to services and may compose responses and apply shared policies. | Several services behind one external API. | Another component and hop to operate; one team can become a bottleneck for every API change. |
| Backends for frontends | One gateway per kind of client, such as mobile, web, or third-party, usually owned by the team building that client. | Clients need different data shapes, protocols, or release schedules. | Duplication across the gateways. |

A gateway that combines responses from several services is doing [API composition]({{< ref "system-design/elements/data-across-services" >}}#queries-that-need-several-services).

## Service discovery


A client of an RPC-based service needs the network location of a current, healthy instance.

| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Service registry | A database of instance locations, kept highly available: etcd, ZooKeeper, Consul. | Needed by both discovery styles below. | Another critical component; entries can be stale. |
| Client-side discovery | The client queries the registry and chooses an instance itself. | Clients are under your control and you want to avoid an extra hop. | Discovery and load-balancing logic in every client and language. |
| Server-side discovery | The client calls a router or load balancer, which queries the registry. | A platform provides the router, as Kubernetes services and cloud load balancers do. | An extra hop; the router must be highly available. |
| Self-registration | An instance registers itself and renews its entry; the entry expires when renewals stop. | No platform registrar is available. | Instance code depends on the registry. |
| Third-party registration | A registrar, usually the deployment platform, registers and deregisters instances. | A deployment platform is in use. | Depends on the platform. |

The original notes describe the naive form as a static configuration file listing server addresses, which is hard to keep current. The more flexible form registers each server with a coordination service such as etcd or ZooKeeper using a time-to-live. When a server stops renewing, the entry expires and the server leaves the pool. Health checks decide which registered instances receive traffic; see [health check API]({{< ref "system-design/elements/operating-services" >}}#observability).

## Between services: sidecar and service mesh


- **Sidecar:** supporting functionality runs in a separate process alongside the application instance.
- **Service mesh:** sidecar proxies plus a control plane take over traffic management, discovery, load balancing, telemetry, and failure controls such as retries and circuit breaking. These concerns move out of application code into infrastructure.

A mesh is an alternative to putting the same concerns in a shared library; see [microservice chassis]({{< ref "system-design/elements/operating-services" >}}#cross-cutting-concerns). The mesh itself is an instance of the [control plane and data plane]({{< ref "system-design/elements/control-plane" >}}) split. Because the proxies carry every call, a mesh can also inject faults to test those failure controls; see [testing the controls]({{< ref "system-design/elements/containing-failure" >}}#testing-the-controls).

## Leads to


- Every synchronous hop needs [timeouts, retries, and circuit breakers]({{< ref "system-design/elements/containing-failure" >}}).
- The gateway is a natural place to authenticate and pass an [access token]({{< ref "system-design/elements/operating-services" >}}#security) to services.
- Rate limiting at the edge leads to the [rate limiter]({{< ref "system-design/projects/rate-limiter" >}}) case.
- Stateless instances behind a load balancer move state elsewhere: [data at scale]({{< ref "system-design/elements/data-at-scale" >}}).

## Seen in cases


- [Ticketmaster]({{< ref "system-design/projects/ticketmaster" >}}): an API gateway routes to the event and booking services and can take on authentication, rate limiting, and logging.
- [URL shortener]({{< ref "system-design/projects/url-shortener/url-shortener-additional" >}}): edge and regional caches in front of a stateless redirect service behind a load balancer.
- [Rate limiter]({{< ref "system-design/projects/rate-limiter" >}}): enforcement placed on the request path.
- **AI and RAG:** the request-and-routing module in the [boundary map]({{< ref "engineering/eng-exp/design-pressure" >}}) and layers 0-2 of the RAG runtime. They normalize the request, apply tenant policy and feature flags, and choose an execution path with its budgets.

## Gaps


- L4 versus L7 load balancing, and health checking in detail.
- When composition belongs in the gateway, in a BFF, or in a dedicated service.
- DNS internals: the resolution chain from recursive resolver to authoritative server, and record types.

## Sources


- [API gateway and backends for frontends](https://microservices.io/patterns/apigateway.html), [client-side discovery](https://microservices.io/patterns/client-side-discovery.html), [server-side discovery](https://microservices.io/patterns/server-side-discovery.html), [service registry](https://microservices.io/patterns/service-registry.html), [self-registration](https://microservices.io/patterns/self-registration.html), [third-party registration](https://microservices.io/patterns/3rd-party-registration.html) -- microservices.io.
- Richardson 2019: chapter 3 (service discovery), chapter 8 (external API patterns).
- Newman 2021: chapter 5 (service discovery, gateways, service meshes), chapter 14 (backends for frontends).
- [Kubernetes notes]({{< ref "engineering/platform/kubernetes" >}}): service discovery on a deployment platform.
- [Route 53 routing policies -- AWS](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html): latency, geolocation, weighted, and failover records.

## Library sources


- [Richardson 2019](/sources/system-design/microservices/richardson-2019-microservices-patterns.pdf.enc), *Microservices Patterns: With Examples in Java* -- chapters 3 and 8
- [Newman 2021](/sources/system-design/microservices/newman-2021-building-microservices-2nd-edition.pdf.enc), *Building Microservices: Designing Fine-Grained Systems, Second Edition* -- chapters 5 and 14
- [Nygard 2018](/sources/system-design/reliability/nygard-2018-release-it-2nd-edition.pdf.enc), *Release It! Design and Deploy Production-Ready Software, Second Edition* -- chapter 9, on DNS and load balancing
- Educative 2023: DNS, *Grokking Modern System Design Interview*

Further reading:

- [Xu 2020](/sources/system-design/interviews/xu-2020-system-design-interview-an-insiders-guide.pdf.enc), *System Design Interview: An Insider's Guide* -- chapter 1
