---
draft: false
toc: true
title: "Making System Design Decisions"
description: "System design turns intended behavior into components, data ownership, interactions, and failure rules. Consequential assumptions get focused checks, and decisions record what implementation must preserve or reconsider."
lastmod: "2026-04-19"
linkTitle: "System Design Decisions"
---

A useful system design explains how the change will work, why the important choices fit the requirements, and what implementation must preserve.

A coding agent can inspect the system, suggest options, run small tests, and help write the design. Engineers still need to check the assumptions and understand the choices that affect correctness, cost, and operation.

## Establish what matters


Start with the expected behavior, scope, important requirements, existing system, and known restrictions. Use the [product brief]({{< ref "ai/system-evaluation/skill-product-framing-build" >}}) where one exists.

Keep requirements, current behavior, assumptions, and open questions clear. Investigate missing information when different answers would change an important choice.

If the question changes what the product should offer, bring it back to the person responsible for that decision. If it concerns how to build the agreed behavior, handle it as part of system design.

## Include the details that affect the design


A high-level design should leave room for implementation choices, but some apparently small details determine whether the system works.

| Detail | When to include it |
| --- | --- |
| Data ownership and consistency | When they determine who can change data and how concurrent updates work. |
| Schema or index | When correctness, uniqueness, query performance, or capacity depends on it. |
| Algorithm or library | When its behavior, cost, compatibility, or failure handling affects the approach. |
| Timeout or retry rule | When it affects deadlines, duplicate operations, or recovery. |
| Queue or database choice | When the design depends on a particular ordering, transaction, durability, or operating feature. |
| Local names and code organization | Usually leave these to implementation unless an interface or shared convention requires otherwise. |

Sometimes it is enough to state the required behavior and choose the technology later. If the design depends on a specific feature, check that the actual product and configuration provide it.

## Start with a small design that can do the job


Identify the main components, responsibilities, data ownership, dependencies, and interactions. Walk through the main user or system operation and the failures that could break it.

Ask why each component is needed. A requirement such as "accepted jobs must survive worker restarts" may justify durable job storage. It does not automatically require a new service or queue if the existing system can do the job.

Use specific requirements instead of broad phrases such as "needs scalability." Expected load, response-time limits, storage needs, and recovery behavior are more useful for choosing an approach.

Do not try to settle every detail before writing code. Implementation and small prototypes can reveal constraints that change the design.

## Write down the important choices


Record a choice when the alternatives would make a meaningful difference to behavior, cost, complexity, compatibility, or operation.

A short note can cover:

```text
Question:
Requirements that matter:
Useful alternatives:
What we know and what we are assuming:
What we checked and what happened:
Chosen approach and trade-offs:
What implementation must preserve:
When to reconsider:
```


Write decisions down as they become clear. Some will be planned upfront; others will emerge during implementation. An explanation added later can help, provided its reasons fit the code and actual requirements.

Avoid inventing alternatives for routine choices just to fill a template.

## Test a choice when the answer could change it


Use existing information when it is enough. Run a small test when the result could change an important decision.

For example, if deciding between synchronous and background processing, measure how long representative jobs take. Include the input sizes and failures that matter to the requirement. Record the setup and what the measurements leave unanswered.

A prototype's incidental choices do not automatically become production decisions. Using one library to run a test does not establish that the system must use that library.

The engineer responsible for the design decides what the result means for the approach. A test should not silently take over product or architecture decisions.

## Check the parts the design depends on


For each important requirement, explain how the design intends to meet it, what has been checked, and what still needs testing in the implementation.

A diagram shows the planned structure. It cannot show that an API behaves as assumed or that a model will produce good answers. Read the relevant contract, run a focused check, or evaluate the model behavior where needed.

For retries, distinguish the user's request from each attempt to execute it. A timeout may leave the result unknown. Check how the system prevents duplicate work and how the caller finds out what happened. See [the retry example]({{< ref "ai/system-evaluation/review-flow" >}}#worked-example-a-response-is-lost-after-commit).

## Update the design when an assumption fails


When a check or implementation detail disproves an assumption, identify which choices depend on it. Update those choices and review the code and tests affected.

A small fix is enough if it addresses the problem. Revisit the wider design when the fix changes the approach or adds machinery to compensate for an assumption that no longer holds.

Keep a short explanation of why the plan changed so later work does not repeat the same mistake.

## Give implementation clear guidance


The handoff should explain:

- what the change needs to do;
- the relevant existing code and dependencies;
- the chosen approach and important trade-offs;
- rules the implementation must preserve;
- choices left open;
- testing, deployment, and recovery work still needed.

Leave a choice open only when different implementations can meet the requirement. If a uniqueness constraint or request identifier is essential to preventing duplicates, include it even if it seems like a low-level detail.

Use diagrams, examples, and decision notes where they help someone build and review the change. A small change may need only a short note. Review the result using [A Practical Review Process]({{< ref "ai/system-evaluation/review-flow-specification" >}}).
