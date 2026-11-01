---
draft: false
toc: true
title: "Non-Functional Requirements"
description: "The forces in the system design flow: operation-specific reasoning about quality requirements, scalability, reliability, availability, and consistency, with worked URL-shortener examples."
linkTitle: "NFR"
---

Quality requirements connect user needs and workload assumptions to architectural decisions. Define them for particular operations, then use them to evaluate the design.

In the [system design flow]({{< ref "system-design" >}}), these are the forces. Each [hub]({{< ref "system-design/elements" >}}) lists the qualities that push its options one way or another. This section is their canonical home:

- The [catalog of architectural characteristics]({{< ref "engineering/architecture/characteristics" >}}) lists further qualities by category.
- The review framework's [requirements and quality targets]({{< ref "engineering/engineering-review-framework/requirements-and-quality-targets" >}}) applies the same reasoning to a single change.
- [Reasoning about NFRs]({{< ref "system-design/nfr/non-functional-requirements" >}}): prioritization, measurement, assumptions, and design implications.
- [Scalability]({{< ref "system-design/nfr/scalability" >}}): workload, bottlenecks, scaling strategies, and patterns.
- [Reliability and availability]({{< ref "system-design/nfr/reliability-availability" >}}): redundancy, failover, and recovery questions.
- [Consistency]({{< ref "system-design/nfr/consistency" >}}): clarify the behavior each operation needs and what can be relaxed.

For a worked exploration, see the [URL-shortener case]({{< ref "system-design/projects/url-shortener" >}}). Its NFR drafts contain alternative assumptions; use them as reasoning examples rather than universal targets.
