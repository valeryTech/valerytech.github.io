---
draft: false
toc: true
title: "Reasoning About Non-Functional Requirements"
description: "A method for translating user needs into prioritized quality requirements, measurable targets, explicit assumptions, and concrete architectural consequences."
linkTitle: "NFR Reasoning"
---

Functional requirements describe what a client can do. Non-functional requirements describe the qualities and constraints under which those operations must work. Start with the user's situation and prioritize the few qualities that change this design.

## Turn a quality into a decision


For each important requirement, record:

1. **Operation and user outcome:** which flow matters, and what goes wrong for the user if it fails?
2. **Target and measurement:** what is being measured, where, over what period, and under what workload?
3. **Assumption or constraint:** is this given by the problem, agreed with the interviewer, or proposed for the exercise?
4. **Design consequence:** what choice does it influence?
5. **Trade-off:** what can be relaxed, and what must still hold?

For example, "fast redirects" needs a scope and measurement: the URL-shortener drafts propose a p95 latency target for resolve requests. Before using it, clarify whether it covers cached requests, uncached requests, or all eligible requests. A number without that context is not yet a useful design constraint.

## Questions by quality


| Quality | Questions to clarify | Related notes |
| --- | --- | --- |
| Latency and throughput | Which operation? Which percentile? Average or peak load? What does the user wait for? | [Capacity estimates]({{< ref "engineering/topics/envelope-estimations" >}}) |
| Scalability | What grows: requests, data, users, concurrency, or job size? What is the current constraint? | [Scalability]({{< ref "system-design/nfr/scalability" >}}) |
| Availability and reliability | Which requests must succeed? What downtime or partial failure can users tolerate? Where is success measured? | [Reliability and availability]({{< ref "system-design/nfr/reliability-availability" >}}) |
| Consistency | What must a client see after a write? Which state changes require coordination? What delay or staleness is acceptable? | [Consistency]({{< ref "system-design/nfr/consistency" >}}) |
| Durability and integrity | Which acknowledged data must survive? How would loss or corruption be detected and recovered? | [Dropbox case]({{< ref "system-design/projects/dropbox/dropbox" >}}) |
| Security | Who can perform each operation? What data or execution needs protection? | [Building-block study gaps]({{< ref "system-design/elements/elements" >}}#topics-to-develop) |
| Environment and cost | What device, bandwidth, infrastructure, budget, or delivery constraints apply? | [Design principles]({{< ref "system-design/02-system-design" >}}) |

## Use NFRs throughout the design


Establish the important requirements early. While tracing the initial design, note where each one creates a concern. Use deep dives to resolve the important concerns and update the design.

Quantify a requirement when the number helps distinguish choices. If the value is unknown, state a provisional assumption, explain why it matters, and check how a different value would change the decision. Keep estimates tied to an architectural question.

Targets belong to individual paths. A read path, creation path, background job, and analytics pipeline may need different latency, availability, and consistency behavior. Prioritizing one path does not eliminate correctness requirements on another.

An availability percentage alone does not determine the architecture. The dependency chain, failure assumptions, recovery behavior, measurement, and operating practices also need examination. Treat the architecture tables in older drafts as proposals to assess in context.

## Sources and further study


Original reading list:

- *Implementing SLOs*.
- [Service-level objectives -- Google SRE book](https://sre.google/sre-book/service-level-objectives/).
- [How to design good SLOs](https://cloud.google.com/blog/products/devops-sre/how-to-design-good-slos-according-to-google-sres).
- [Implementing SLOs -- SRE workbook](https://sre.google/workbook/implementing-slos/).
- [Google Cloud reliability framework](https://cloud.google.com/architecture/framework/reliability/printable).
- [Google SRE books](https://sre.google/books/) and [book updates](https://sre.google/resources/book-update/).
- [The Calculus of Service Availability -- ACM](https://cacm.acm.org/practice/the-calculus-of-service-availability/) and [paper](https://dl.acm.org/doi/pdf/10.1145/3080202).
- "Thinking about Availability in Large Service Infrastructures."
- [PACELC overview](https://en.wikipedia.org/wiki/PACELC_design_principle).
