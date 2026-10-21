---
draft: false
toc: true
title: "Four-Step System Design Outline"
description: "A four-step interview outline covering scope, high-level design, deep dives, and wrap-up, with expected artifacts and agreement checkpoints."
linkTitle: "Four-Step System Design Outline"
---

Alternative interview outline. Its four stages and artifact checkpoints are retained; see the [framework comparison]({{< ref "system-design/frameworks" >}}) for the other approaches.

# SD algorithm


This outline describes four steps for answering a system design question.

## 1. Understand the problem and establish Design Scope


Collect and define:

- Functional requirements, expressed as user stories or use cases.
- Edge cases and scenarios outside the agreed scope.
- Constraints.
- Architectural characteristics for the whole system or its parts.
- Boundaries of the system being designed.

Checkpoint: agree on the design with the interviewer.

Output: FR (user stories and corner cases), AR, and quantitative characteristics.

## 2. Create a High-Level Design


Sketch the main components, parts, or subsystems and their connections. Explain the choices, revise the design, and repeat.

Walk through a few concrete use cases where possible.

Open question: whether and where to include estimates in this step.

Open question: whether and where to define the data model, including logical and physical ERDs.

Possible addition: identify APIs for read/write scenarios in critical components, then define the APIs and component boundaries.

Checkpoint: agree on the design with the interviewer.

Output: a blueprint showing the main components of the system being designed.

## 3. Design Deep Dive


Identify and prioritize the architectural components.

Examine 2-3 components in more detail and select database types.

Compare different approaches, describe their pros and cons, and explain the choice.

Checkpoint: does the design meet all functional and non-functional requirements?

Open question: define the output of this step.

## 4. Wrapping up


Possible wrap-up topics:

- Identify system bottlenecks and discuss potential improvements.
- Recap the design for the interviewer.
- Discuss error cases, such as network faults and server failure.
- Discuss operational issues; properties of production-ready systems may be a useful framing.
- Explain how the design could handle the next increase in scale.
