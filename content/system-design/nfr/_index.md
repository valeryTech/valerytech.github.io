---
draft: false
toc: true
title: "Non-Functional Requirements"
description: "An index of quality-requirement notes linking operation-specific reasoning, scalability, reliability, availability, consistency, and worked URL-shortener examples."
linkTitle: "NFR"
---

Quality requirements connect user needs and workload assumptions to architectural decisions. Define them for particular operations, then use them to evaluate the design.

- [Reasoning about NFRs]({{< ref "system-design/nfr/non-functional-requirements" >}}): prioritization, measurement, assumptions, and design implications.
- [Scalability]({{< ref "system-design/nfr/scalability" >}}): workload, bottlenecks, scaling strategies, and patterns.
- [Reliability and availability]({{< ref "system-design/nfr/reliability-availability" >}}): redundancy, failover, and recovery questions.
- [Consistency]({{< ref "system-design/nfr/consistency" >}}): clarify the behavior each operation needs and what can be relaxed.

For a worked exploration, see the [URL-shortener case]({{< ref "system-design/projects/url-shortener" >}}). Its NFR drafts contain alternative assumptions; use them as reasoning examples rather than universal targets.
