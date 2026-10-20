---
draft: false
toc: true
title: "System Design Frameworks"
description: "A comparison of competing system design frameworks, their stages and emphases, and shared reasoning tools for trying them in practice."
linkTitle: "Frameworks"
---

These are distinct approaches to organizing a design discussion. Keep their different emphases visible, try them in practice, and choose one according to the problem and the conversation.

| Framework | Structure and emphasis | Useful when… |
| --- | --- | --- |
| [Hello Interview delivery framework]({{< ref "system-design/frameworks/framework-hi" >}}) | Requirements → entities → interface → optional data flow → high-level design → deep dives. Gives approximate timings and emphasizes completing a working design before refinement. | You want a paced, end-to-end interview structure. |
| [interviewing.io framework]({{< ref "system-design/frameworks/framework-iv" >}}) | Requirements → data types, API, and scale → design. Uses objects, relations, mutability, and access patterns to derive the design; includes worked examples. | You want more help reasoning from the problem to storage and service choices. |
| [Concise interviewing.io outline]({{< ref "system-design/to-sort/sd-algo-interviewing-io" >}}) | A shorter set of notes on the same three-stage approach, with prompts for access patterns and architectural characteristics. | You want a quick reminder while practicing the longer framework. |
| [Four-step outline]({{< ref "system-design/to-sort/sd-algorithm" >}}) | Scope → high-level design → deep dives → wrap-up. Lists intermediate artifacts and agreement checkpoints. | You want a compact scaffold with an explicit conclusion. |
| [Personal requirements-first draft]({{< ref "system-design/frameworks/sd-framework-v0" >}}) | Prioritizes core value, enablers, and enhancements; explores how to phrase NFRs and introduce follow-up constraints. | You want to experiment with product framing and practice prompts. Numerical examples remain provisional. |
| [Extended framework collection]({{< ref "system-design/to-sort/sd-framework-old" >}}) | A broad collection of design steps, principles, staff-level considerations, and examples. | You want a larger checklist to consult outside the timed interview. |

The personal draft and extended collection retain their original scope and competing ideas. They are available alongside the source frameworks.

## Shared reasoning tools


- [Problem-solving checklist]({{< ref "system-design/frameworks/problem-solving-approach" >}}): questions to use within any framework.
- [NFR reasoning]({{< ref "system-design/nfr/non-functional-requirements" >}}): connect a quality requirement to an operation and design consequence.
- [Communication phrases]({{< ref "system-design/interview/phrases" >}}): state assumptions, compare options, and navigate feedback.
- [Practice cases]({{< ref "system-design/projects" >}}): test a framework on a concrete problem.

## How to compare them in practice


Try the same case with two frameworks. Record whether each helped you clarify the problem, complete the core flows, find the difficult decisions, and leave time for review. Compare the reasoning and the resulting design as well as the pacing.
