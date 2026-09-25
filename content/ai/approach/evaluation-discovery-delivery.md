---
draft: false
toc: true
title: "Evaluation Discovery Delivery"
linkTitle: "Evaluation Discovery Delivery"
---
# Evaluation in AI product discovery and delivery


I treat evaluation as a necessary part of AI product engineering. It provides evidence for choosing solutions, establishing what users can depend on, and deciding how to improve or extend the product. My work connects that evidence with architecture, implementation, and production responsibility.

Discovery investigates whether and how a candidate solution could address a problem. Delivery builds and operates the solution customers will depend on. These are continuous activities of the same team, with different purposes and obligations. Evaluation supports both, and learning continues through experiments, implementation, and production use.

## Evaluation in discovery


Discovery starts with a problem and a desired outcome. A candidate solution carries assumptions about value, usability, feasibility, and business viability: whether users will choose it, whether they can use it, whether we can build it, and whether it works for the business. Evaluation contributes evidence about the behavior the solution would need to provide. User research and investigation of business and operating constraints address other parts of the decision.

Before an experiment, I identify the uncertainty, the decision it affects, the evidence that could change that decision, and the limits of the test. This gives the work a purpose and makes the result interpretable. An experiment can be small and fast. When it affects real users or systems, it also needs safeguards, observation, and a way to stop it.

Evaluation helps compare approaches, investigate failures, and refine our understanding of the required behavior. Findings may justify another experiment, a different implementation, a narrower scope, or ending investment in the current solution. The depth of investigation follows the decision and the consequences of being wrong.

## Establishing a production commitment


The decision to invest in delivery starts from a candidate solution, the evidence supporting it, the uncertainty that remains, and known constraints. That evidence needs to justify the investment. Whether the live product achieves the intended outcome remains a question to examine through use.

A production commitment defines which users and situations we support, what behavior they can depend on, the limits of that support, and how failures will be detected and handled. Evaluation helps establish the behavior and examine its boundaries. Architecture, controls, release engineering, and operations provide the means to fulfill the commitment.

An initial production slice can support a small set of situations while meeting production requirements within that scope. Before release, the team needs evidence about the required behavior and its boundaries, satisfied operating constraints, a controllable rollout, and observable behavior. Remaining uncertainty needs a response: limits on exposure, detection, intervention, and recovery appropriate to the commitment.

The evidence needed to justify building a production solution and the evidence needed to release it answer different questions. Discovery informs the investment; delivery establishes and maintains what customers will depend on.

## Evaluation during delivery and production


During delivery, evaluation follows the product behavior we have committed to support. Models, prompts, retrieval, tools, application logic, and interactions can change while the intended behavior remains stable. We need to understand whether a proposed change improves that behavior and whether it damages an existing commitment.

Evaluation also guides development of the capability itself. A finding can lead to an implementation change, a different interaction, stronger controls, or a revised scope. It may expose uncertainty about the intended behavior or the solution as a whole, creating a question for further discovery. Evaluation can reveal a mismatch; explaining its cause may require additional investigation.

Production use brings evidence about situations and failures that earlier work did not represent. That evidence feeds into subsequent evaluations, engineering priorities, and product decisions. The team continues to examine both the behavior it provides and whether the complete solution helps users achieve the intended outcome.

## Example: a customer-support assistant


Consider a hypothetical assistant that drafts replies using company policies and order information. The desired outcome is to help support agents resolve requests with less effort while avoiding incorrect promises to customers. Drafting replies is a candidate solution.

During discovery, the team examines whether drafts apply relevant policies, including exceptions. It also observes how agents check and correct them. These address separate questions: whether the system produces the intended behavior and whether the workflow reduces the agents' effort.

Suppose the evidence supports routine requests but leaves uncertainty around exceptions. An initial production commitment could cover routine requests, require agent approval, and send unsupported cases for manual handling. Delivery needs to implement those boundaries and establish that they work well enough for the release.

If a change improves handling of exceptions, the team still needs to assess its effects on the situations already supported. The finding might justify extending the scope, retaining the existing limits, or doing more investigation. If review and correction continue to consume too much effort, the team may need to revise the interaction or reconsider drafting as the solution.

## A maintained evaluation subsystem


These questions recur as the product develops. I use *evaluation subsystem* to describe the maintained capability for answering them: the people, practices, data, and software used to preserve relevant cases, compare changes, investigate failures, and bring production findings into development.

A result needs enough context to be examined: the input, relevant information and actions, system version, observed behavior, and basis for the judgment. A reviewer should be able to move from a summary back to the evidence behind it.

Engineers and domain experts develop the practice together. They select relevant situations, inspect behavior, clarify expectations, and examine disagreements. Concrete cases help turn broad expectations into criteria the team can use and revise.

The subsystem also needs maintenance. Cases can become outdated, records can omit necessary context, and automated evaluators can make unreliable judgments. The team needs to examine these limits and distinguish a change in the evaluation method from a change in the product.

## What the evidence supports


The conclusion needs to match the claim examined and the limits of the evidence. Selected cases can support a decision about particular behavior without establishing that the same behavior holds across every production situation. Remaining uncertainty stays part of the decision about scope, controls, and release.

The solution utility ladder keeps several claims separate: basic system behavior, completion of the user's job, improvement over the current alternative, and the intended outcome. Evidence for one claim does not establish the next. A system may behave as specified while requiring too much user effort or failing to provide enough benefit. Those questions need their own investigation.

Evaluation also has a defined role in the surrounding engineering system. It provides evidence for decisions. Implementing controls, changing the workflow, recovering from failures, and maintaining supported behavior require engineering work and accountable product decisions.

## Scope and organizational support


I can establish and develop this practice as part of hands-on engineering work. The starting point is a decision the team needs to make. Initial work may involve a focused question, a small set of relevant cases, recorded results, people able to judge them, and an explicit account of the finding and its limits. Infrastructure and automation should follow the recurring decisions and the evidence they require.

That proportional approach still requires an agreed responsibility. Evaluation needs allocated time, access to relevant people and data, decision authority appropriate to the role, and leadership support. Findings must be able to affect product scope, architecture, priorities, and release decisions. Establishing missing practices can be part of the role; prolonged internal advocacy to make that work possible is a separate organizational responsibility.

Evaluation has a cost, and its usefulness needs to be assessed through the decisions and engineering work it enables. Claims that it makes delivery faster or cheaper need evidence from the particular project.

I treat evaluation as foundational because discovery and delivery depend on a continuing ability to examine assumptions, understand behavior, and revise commitments. Evaluation provides the evidence. The team needs the engineering capability and organizational support to act on it.

Related notes: [My approach to production AI engineering](https://valery.tech/ai/approach/my-perspective/) and [Language, mindset, and engineering discipline](https://valery.tech/ai/approach/minset-language-discipline/).
