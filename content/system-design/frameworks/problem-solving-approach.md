---
draft: false
toc: true
title: "Problem-Solving Checklist"
description: "A reusable checklist for framing a design problem, tracing behavior, comparing alternatives, checking failures, and evaluating the complete system."
linkTitle: "Problem-Solving Checklist"
---

Use these questions inside whichever [framework]({{< ref "system-design/frameworks" >}}) you choose. The aim is to make the reasoning explicit without turning the checklist into a mandatory sequence.

## Frame the problem


- Who uses the system? Include service clients as well as end users.
- What are they trying to accomplish, and what is the core moment of value?
- Which use cases are in scope? Which edge cases can be deferred?
- What constraints and assumptions could change the design?
- Which quality requirements matter most, and why?

Confirm the scope before committing to a detailed solution. Keep the client's experience in view as the design develops.

## Trace concrete behavior


- What inputs and outputs define each core operation?
- Which entities and relationships are involved? What can change?
- What are the access patterns?
- Where does a request go, and what state changes before it succeeds?
- What does the client observe on success, failure, or retry?

## Compare and choose


- What problem would this component or pattern solve?
- What simpler alternative is available?
- What does each option gain, cost, or make harder?
- Which requirement supports the choice?
- Which estimate or experiment would distinguish the alternatives?

Make a decision when the evidence supports it. State uncertainty where it remains and identify what would change the decision.

## Check the whole design


- Does every core requirement have a complete flow?
- Is the critical concurrency, consistency, or scaling problem addressed?
- What happens when a dependency is slow or unavailable?
- Does the user experience still make sense under the chosen trade-offs?
- What remains unresolved, and what should be investigated next?

The [interview-review notes]({{< ref "system-design/interview/mock-interviews" >}}) turn these questions into a practice loop.
