---
draft: false
toc: true
title: "Cycles in Engineering Work"
description: "Seven cycles described in the vault, from the problem-solving cycle inside one activity to the project phases, the improvement cycle on a running product, and the knowledge loop across projects, and how they fit together."
linkTitle: "Cycles"
---

The vault describes several cycles. They work at different levels: one problem or decision, one change, one project, a running product, and many cases across projects. This note lists them and shows how they fit together. It was extracted from step 9 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}). [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) defines the activities, and [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) gives the overview.

## The Seven Cycles


| Cycle | Steps | Level |
| :--- | :--- | :--- |
| Problem-solving framework | framing; express possible solutions, compare trade-offs, and choose; act on the best solution; look back and learn | One problem or decision |
| [Discovery and delivery pattern]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}) | frame the decision; act within justified limits; inspect the result; revise the next commitment | One commitment |
| [Problem and Response Cycle]({{< ref "ai-engineering/delivery/outer-cycle" >}}) | understand the problem; define the desired outcome; choose a response; define the project and review the results | Before and around a project |
| [Project Design and Delivery Cycle]({{< ref "ai-engineering/delivery/design-and-delivery" >}}) | product and artifact framing; design; baseline and prototyping; build, product evaluation, and release; operation and evolution | One project |
| [Engineering workflow]({{< ref "ai-engineering/agents/sdlc/activities" >}}) | framing; investigation; design decisions; implementation; verification and review; release, operation, and learning | One change |
| [Improvement cycle]({{< ref "ai-engineering/evaluation/framework/product-improvement-system-revised" >}}) | probe and observe; build understanding; decide what should change; implement and validate; deploy and verify the effect | A running product |
| Engineering Knowledge Loop | local loop: frame, retrieve knowledge, build the design space, select, implement or experiment, observe and evaluate, retain the case; cross-project loop: explain and compare cases, generalize and delimit, codify, reuse and validate, operationalize, institutionalize selectively | Many cases across projects |

## The Problem-Solving Cycle


The problem-solving framework describes four parts: framing, expressing possible solutions, acting on the best one, and looking back to learn. The recurring pattern in [discovery-and-delivery.md]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}) has the same shape: frame the decision, act within justified limits, inspect the result, and revise the next commitment.

1. **Frame:** State the problem or decision, what is known, what is assumed, and what evidence could change the choice.
2. **Choose:** Generate options or hypotheses, compare their trade-offs within the constraints, check the uncertainty that would change the choice, and decide. This is the decision point, and it has an owner.
3. **Act:** Carry out the chosen option within limits that fit its consequences and reversibility: run a check, build a prototype, write the change, or release a narrow scope.
4. **Look back and learn:** Inspect the result, check it independently of the author's explanation, and revise the next commitment. If the result disproves an assumption, go back to framing.

The cycle works at every scale. A question during investigation can go through it in minutes; a design decision or a release can take days. A small, reversible step needs only brief framing, while a consequential one needs stronger evidence. Looking back can also send work to an earlier activity: when implementation disproves a design assumption, the next cycle runs in design.

The [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}) are practices for these parts: two for framing, four for choosing, one for acting, and three for looking back and learning. One rule applies to all parts: scale the depth to the consequence, uncertainty, and reversibility of the work. A check run while choosing is a small cycle of its own, and its act is the check. [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}#the-cycle-inside-each-activity) shows the cycle in each of the six activities.

## How the Cycles Fit Together


- **The problem-solving cycle runs inside each activity.** It describes reasoning about one problem or decision, so it applies inside any activity and at any scale.
- **Phases group the activities.** The Project Design and Delivery Cycle defines a phase as a grouping of related activities aimed at an objective or decision. The six activities are the kinds of work inside the phases, and one activity can appear in several phases. [Activities in Each Phase]({{< ref "ai-engineering/agents/sdlc/activities" >}}#activities-in-each-phase) shows which activities each phase uses most.
- **Two cycles sit outside the project.** The Problem and Response Cycle comes before and around a project: it decides what should change and whether a project is the right response. The improvement cycle comes after release: it repeats on a running product and feeds evidence back into framing.
- **Environment upkeep is the look-back part applied to the environment.** Turning recurring mistakes into better docs, commands, checks, or `AGENTS.md` rules is the last part of the problem-solving cycle, applied to the agent environment. Step 7 of the Reasoning Log calls it the environment maintenance loop (outer loop).
- **The Engineering Knowledge Loop learns across cases.** Its local loop is the problem-solving cycle on one case, with the case recorded at the end. Its cross-project loop compares the recorded cases, generalizes within limits, and turns what holds into guidance, tools, and defaults. It's an earlier note; the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) describes the current version of the same idea for engineering workflows.
- **The "generate and accept" shortcut keeps only the act part.** It skips framing, choosing, and looking back in every activity.
