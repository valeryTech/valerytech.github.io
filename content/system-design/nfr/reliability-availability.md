---
draft: false
toc: true
title: "Reliability and Availability"
description: "Reliability and availability questions covering single points of failure, redundancy configurations, replication, failover, degraded operation, recovery, and service targets."
linkTitle: "Reliability and Availability"
---

Connect redundancy and recovery decisions to the operations that must remain usable. Start by finding single points of failure and asking what happens when each dependency becomes unavailable.

## Redundancy configurations


- **Active/passive:** a redundant instance takes over when its primary fails.
- **Active/active:** multiple instances serve traffic.

The original notes also identify primary-replica and multi-primary replication as topics to study. Keep the replication arrangement explicit when discussing failover.

## Questions to answer


- Which component or dependency can make the whole flow unavailable?
- How is failure detected, and how is traffic moved to a healthy instance?
- What state must be available after failover?
- What can the system continue to do while a dependency is unavailable?
- What does the client observe during recovery?
- What evidence supports the availability target?

A failover plan needs explanation as well as redundant boxes in the diagram. Review it against the [NFR measurement questions]({{< ref "system-design/nfr/non-functional-requirements" >}}).

## Patterns that address this


- **Behavior at the call site** (timeouts, retries, circuit breakers, bulkheads, load shedding, degraded operation): [containing failure]({{< ref "system-design/elements/containing-failure" >}}).
- **Removing unhealthy instances from traffic** (health checks, service discovery): [the request path]({{< ref "system-design/elements/request-path" >}}#service-discovery).
- **Replication arrangements and failover data loss:** [data at scale]({{< ref "system-design/elements/data-at-scale" >}}).
- **Keeping a request path available while other services are down** (self-contained services, asynchronous messaging): [boundaries]({{< ref "system-design/elements/boundaries" >}}#where-to-draw-boundaries) and [communication]({{< ref "system-design/elements/communication" >}}).

## Further study


The original source reminder is the *Designing Fine-Grained Microservices* book. For SLOs, service availability, and reliability reading, use the [NFR source list]({{< ref "system-design/nfr/non-functional-requirements" >}}#sources-and-further-study).

## Library sources


- [Atchison 2020](/sources/eaa5b8561b5aae270f729456b6b7c211.bin), *Architecting for Scale*
- [AWS 2024](/sources/7e7195dd160b0a64fe44c392ec32afaa.bin), *Reducing the Scope of Impact with Cell-Based Architecture*
- [AWS 2024](/sources/2266f3d3d6f2467e22254d1f717ff39a.bin), *AWS Well-Architected Framework*
