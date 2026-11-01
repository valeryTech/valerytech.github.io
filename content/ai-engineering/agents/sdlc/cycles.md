---
draft: false
toc: true
title: "Cycles in Engineering Work"
description: "How problem solving and learning repeat at different scales—from one decision inside an activity, through task workflows and project phases, to improving a project's environment and revising the working model across projects."
linkTitle: "Cycles"
---

The vault describes several cycles that repeat at different scales: one problem or decision, one change, one project, a running product, and learning across tasks and projects. This note shows how they fit together so they don't read as competing models. It started as step 9 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}). [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) defines the six activities, [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}) gives the reasoning practices inside one cycle, and [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) shows how activities combine into concrete workflows.

## Cycles Across the Vault


| Cycle | Steps | Scale |
| :--- | :--- | :--- |
| Problem-solving framework | frame; express options, compare trade-offs, and choose; act on the chosen option; look back and learn | One problem or decision |
| [Discovery and delivery pattern]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}) | frame the decision; act within justified limits; inspect the result; revise the next commitment | One commitment |
| [Six engineering activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) | framing; investigation; design decisions; implementation; verification and review; release, operation, and learning | Across a full change (a [task workflow]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) runs the subset a [task type]({{< ref "ai-engineering/agents/sdlc/task-types" >}}) needs) |
| [Project Design and Delivery Cycle]({{< ref "ai-engineering/delivery/design-and-delivery" >}}) | product and artifact framing; design; baseline and prototyping; build, product evaluation, and release; operation and evolution | One project |
| [Problem and Response Cycle]({{< ref "ai-engineering/delivery/outer-cycle" >}}) | understand the problem; define the desired outcome; choose a response; define the project and review the results | Before and around a project |
| [Improvement cycle]({{< ref "ai-engineering/evaluation/framework/product-improvement-system-revised" >}}) | probe and observe; build understanding; decide what should change; implement and validate; deploy and verify the effect | A running product |
| Engineering Knowledge Loop | local loop on one case; cross-project loop that compares cases, generalizes within limits, and codifies what holds | Across cases and projects |

## The Problem-Solving Cycle


The problem-solving framework and the recurring commitment pattern in [Discovery and Delivery]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}) share the same four-step shape:

1. **Frame:** State the problem or decision, what is known, what is assumed, and what evidence could change the choice.
2. **Choose:** Generate options or hypotheses, compare their trade-offs within constraints, check the uncertainty that would flip the choice, and decide. This is the decision point, and it has an owner.
3. **Act:** Carry out the chosen option within limits that match its consequences and reversibility: run a check, build a prototype, write the change, or release to a narrow audience.
4. **Look back and learn:** Inspect the result, check it independently of the author's explanation, and revise the next commitment. If the result disproves an assumption, go back to framing.

This cycle runs at every scale. Answering a question during investigation can go through it in minutes; a design decision or a rollout can take days. [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}) gives ten practices for these four steps and one rule across all of them: scale the depth to the consequence, uncertainty, and reversibility of the work. [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}#the-cycle-inside-each-activity) shows what the four steps look like in each activity.

The ["generate and accept" shortcut]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) keeps only the *act* step and skips *framing*, *choosing*, and *looking back*.

## How the Cycles Fit Together


- **Inside one step or activity:** The problem-solving cycle governs reasoning about one question or decision. A quick check run while choosing between options is a small problem-solving cycle of its own.
- **Across one task:** A [task type]({{< ref "ai-engineering/agents/sdlc/task-types" >}}) combines the activities it needs into a [workflow]({{< ref "ai-engineering/agents/sdlc/workflows" >}}). Looking back at the end of implementation or review can route work back to an earlier activity when an assumption fails.
- **Across one project and product:** Project phases group the activities they use most toward a milestone decision ([Activities in Each Phase]({{< ref "ai-engineering/agents/sdlc/activities" >}}#activities-in-each-phase)). The Problem and Response Cycle sits before and around the project to decide whether the project is the right response, and the improvement cycle repeats after release on the running product.
- **Learning at three levels with assistants:** As [Testing and Revising the Working Model]({{< ref "ai-engineering/agents/sdlc/model-revision-loop" >}}) summarizes, learning from tasks runs at three nested speeds:
  1. *Inside one task* (the problem-solving cycle adjusts what we do next in the session).
  2. *Across tasks in one project* (learning across tasks and checking whether a change helped--processes 9 and 10 in [Processes]({{< ref "ai-engineering/agents/sdlc/processes" >}})--update the project's docs, checks, commands, skills, and `AGENTS.md`).
  3. *Across cases and projects* (the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) and the [model revision loop]({{< ref "ai-engineering/agents/sdlc/model-revision-loop" >}})--the current form of the Engineering Knowledge Loop--compare cases and revise shared workflows and concepts).
