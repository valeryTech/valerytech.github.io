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

The original notes also identify primary–replica and multi-primary replication as topics to study. Keep the replication arrangement explicit when discussing failover.

## Questions to answer


- Which component or dependency can make the whole flow unavailable?
- How is failure detected, and how is traffic moved to a healthy instance?
- What state must be available after failover?
- What can the system continue to do while a dependency is unavailable?
- What does the client observe during recovery?
- What evidence supports the availability target?

A failover plan needs explanation as well as redundant boxes in the diagram. Review it against the [NFR measurement questions]({{< ref "system-design/nfr/non-functional-requirements" >}}).

## Further study


The original source reminder is the *Designing Fine-Grained Microservices* book. For SLOs, service availability, and reliability reading, use the [NFR source list]({{< ref "system-design/nfr/non-functional-requirements" >}}#sources-and-further-study).
