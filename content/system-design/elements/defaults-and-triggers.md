---
draft: false
toc: true
title: "Defaults and Triggers for Design Choices"
description: "A prototyping path through the design question hubs: the default option to start with, the signal that it no longer fits, the option to move to, and the technique that tests the move."
document_status: "draft"
linkTitle: "Defaults and Triggers"
---

For each design question, this note records four things:

1. The option to start a prototype with.
2. The signal that the option no longer fits.
3. The option to move to.
4. The technique that tests the move before you commit to it.

These are proposed starting points, not rules. Revise them as cases show where they fail.

The idea comes from the [growth section of scalability]({{< ref "system-design/nfr/scalability" >}}#growth-and-autoscaling): begin with a design appropriate to the current requirements, and identify what would trigger the next change.

## How to use it


1. **Build with every default.** Start a [walking skeleton]({{< ref "engineering/architecture/techniques" >}}) with the default for every hub.
2. **Find the risky questions.** Write down which triggers you expect to fire soon.
3. **Test each move first.** For each risky question, choose a technique to test the move before building it fully. Techniques come from the [lifecycle techniques]({{< ref "engineering/architecture/techniques" >}}) and the [delivery techniques guide]({{< ref "engineering/delivery-techniques/engineering-delivery-techniques-guide" >}}).
4. **Record the outcome.** Note the decision and the trigger that would reopen it, using the [case template]({{< ref "system-design/projects/case-template" >}}) or an ADR.

A default is a part of the system simplified on purpose. The delivery guide's distinction between *what must be real* and *what can be simplified* applies here. So does its advice to state an expected lifespan.

## Boundaries


**Default:** one deployable unit with internal modules, a modular monolith. See [boundaries]({{< ref "system-design/elements/boundaries" >}}).

| Trigger | Move to | Test with |
| --- | --- | --- |
| A part needs its own release schedule, or another team owns it | A separate service along a capability or subdomain boundary | A walking skeleton with that one boundary split out and deployed separately |
| A part has a very different scaling or availability need | Deploy that function separately | A proof of concept that load-tests the part alone |
| An existing system must be replaced while it keeps running | Strangler application, with an anti-corruption layer | A tracer bullet that routes one path through the new service |

## Data across services


**Default:** one database, local transactions, and each module owning its tables. See [data across services]({{< ref "system-design/elements/data-across-services" >}}).

| Trigger | Move to | Test with |
| --- | --- | --- |
| A service is split out | Database per service | Part of the boundary's walking skeleton |
| An operation must change data in two services | A saga with compensations, after checking whether the boundary is wrong | A spike that writes out the steps, the pivot, and the compensations |
| A service must publish when its data changes | Transactional outbox and idempotent consumer | A tracer bullet from write to consumer, with a forced crash between commit and publish |
| A query needs data from several services | API composition first; a CQRS view when composition is too slow or too fragile | A proof of concept that measures latency and staleness |

## Communication


**Default:** synchronous request and response from clients; in-process calls between modules. See [communication]({{< ref "system-design/elements/communication" >}}).

| Trigger | Move to | Test with |
| --- | --- | --- |
| Work can finish after the response | A message queue | A spike that shows what the client observes before completion |
| Bursts exceed what the receiver can process | Queue-based load leveling | A load test with a burst profile, watching backlog and delay |
| Several consumers react to one change | Publish/subscribe with domain events | A tracer bullet with two consumers |
| Clients need updates without polling | Push over a long-lived connection | A prototype of the client experience |

## Request path


**Default:** one load balancer or reverse proxy in front of stateless instances, using the platform's routing. See [the request path]({{< ref "system-design/elements/request-path" >}}).

| Trigger | Move to | Test with |
| --- | --- | --- |
| Several services sit behind one external API | API gateway | A walking skeleton that includes the real entry point |
| Clients need different data shapes or release schedules | Backends for frontends | A prototype for the second client |
| Instances change often and no platform tracks them | Service registry and discovery | A spike on the platform's discovery |
| Content is read far from where it is stored | CDN or edge cache | A proof of concept that measures latency by region |

## Containing failure


**Default:** a timeout on every remote call, retries with backoff only for idempotent operations, and a health check per instance. See [containing failure]({{< ref "system-design/elements/containing-failure" >}}).

| Trigger | Move to | Test with |
| --- | --- | --- |
| A dependency can stay slow or unavailable for minutes | Circuit breaker with a fallback or a clear error | A fault-injection spike that slows or stops the dependency |
| One dependency or tenant can starve the others | Bulkhead | Fault injection with one slow dependency |
| Demand can exceed capacity | Load shedding or back pressure | A load test beyond capacity |

When these are not tested earlier, they usually land in a hardening phase.

## Data at scale


**Default:** a single primary database, identifiers generated by the database, and a [back-of-the-envelope estimate]({{< ref "engineering/topics/envelope-estimations" >}}) before any scaling choice. See [data at scale]({{< ref "system-design/elements/data-at-scale" >}}).

| Trigger | Move to | Test with |
| --- | --- | --- |
| Reads dominate and can tolerate some staleness | Cache-aside, then read replicas | A proof of concept that measures hit rate and staleness |
| Data or write load exceeds one node | Partitioning by a key that spreads the real workload | A spike on key choice against access patterns and hot keys |
| Many writers need identifiers without coordinating | Snowflake-style IDs or range allocation | A small implementation tested for collisions and ordering |
| A shared resource must be protected per client | Rate limiting | A load test with one aggressive client |

## Operating services


**Default:** configuration from the environment, structured logs with a request ID, a health check, and one deployment pipeline. A [golden-path template]({{< ref "engineering/delivery-techniques/skeletons" >}}) provides these from the first commit. See [operating services]({{< ref "system-design/elements/operating-services" >}}). For which contract to start from on a given platform, see the "How to apply today" table in the [Twelve-Factor synthesis]({{< ref "engineering/platform/twelve-factor" >}}#synthesis).

| Trigger | Move to | Test with |
| --- | --- | --- |
| More than a few services are being created | A service template that is copied, rather than a shared chassis library | Build the template from the second service |
| A request crosses several services or a queue | Distributed tracing | A tracer bullet with trace propagation |
| A release could affect many users at once | Canary releases and feature flags | A pilot or canary |
| Several teams depend on one service's API | Consumer-driven contract tests | Contract tests for the first external consumer |

The golden-path notes make the template-versus-chassis choice explicitly. They argue for copied scaffolding over a large internal library, because a shared library makes dependencies hard to manage.

## The same shape elsewhere


- **RAG:** the RAG runtime layers route by a hierarchy of needs. Try no AI first, then an LLM transformation, then an authoritative system of record, then retrieval, and finally ask or abstain. The simplest option comes first, and each step is taken only when the previous one cannot answer.
- **Interviews:** the [extended framework collection]({{< ref "system-design/interview/frameworks/sd-framework-old" >}}) advises designing a basic working system first and adding complexity only when it is justified. In an interview, the triggers become the deep dives.

## Library sources


- [Thomas and Hunt 2020](/sources/software-engineering/craft/thomas-2020-pragmatic-programmer-2nd-edition.pdf.enc), *The Pragmatic Programmer* -- tracer bullets
- [Newman 2020](/sources/system-design/microservices/newman-2020-monolith-to-microservices.pdf.enc), *Monolith to Microservices: Evolutionary Patterns to Transform Your Monolith* -- on *Boundaries*
- [Nygard 2018](/sources/software-engineering/systems-and-operations/nygard-2018-release-it-2nd-edition.pdf.enc), *Release It! Design and Deploy Production-Ready Software, Second Edition* -- on *Containing failure*
