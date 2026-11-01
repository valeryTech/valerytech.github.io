---
draft: false
toc: true
title: "Two Planes of Goals for Engineering Work with Assistants"
description: "The goals of engineering work with software assistants on two planes: product and engineering goals that hold with or without assistants, two conditions from working with agents, and goals for the agent setup and environment."
linkTitle: "Goal Planes"
---

This note describes the goals of engineering work with software assistants. It was extracted from step 4 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}) and reorganized in step 19. Plane 1 holds the goals of the project and its people. Plane 2 holds the goals of the agent setup and the environment, which exist to serve Plane 1. The earlier version is kept in the appendix for comparison.

## The Question


Seen from the engineering workflow, the problem isn't how to make the agent more autonomous at generating code. The problem is:

> **How do we structure our workflows and environment so that software assistants help people carry out the whole engineering workflow (framing problems, investigating reality, analyzing trade-offs, making explicit decisions, implementing, and verifying failure modes) without giving up understanding and ownership?**

## Plane 1: Product and Engineering Goals


These goals belong to the project and the people in it. They hold with or without assistants, and they come from users and owners, so agents can't own them.

### Product Goals


The product goals say what the result has to do for the people who use it.

- **Solve the right problem.** The work addresses a real problem of users or the business, and the chosen change is a good response to it. The [Problem and Response Cycle]({{< ref "ai-engineering/delivery/outer-cycle" >}}) and discovery work serve this goal. [Goals of AI Product Delivery]({{< ref "ai-engineering/approach/goals" >}}) puts it first.
- **Behavior people can rely on.** The product behaves as stated for the users and situations it supports, states what it doesn't support, and handles failures. Its behavior can be observed, limited, stopped, and recovered in real use ([Production Commitment]({{< ref "ai/product/operating-model/production-commitment" >}})).

### Engineering Goals


The engineering goals say what the engineering work has to produce and keep so that the product goals are met now and after later changes. They're the two outputs of the [engineering workflow]({{< ref "ai-engineering/agents/sdlc/workflows" >}}).

- **Results that hold.** The system, and the findings and decisions behind it, are right and keep holding in real use, and the system stays easy to change. A result holds when it meets the product goals. Technical debt is a failure of this goal.
- **Understanding and ownership.** People can explain what the system does, why decisions were made, and how it can fail, and they own the decisions about product scope, architecture, risk limits, and production commitments. Comprehension debt and intent debt are failures of this goal ([Project Ownership]({{< ref "ai-engineering/agents/project-ownership" >}})).

Two goals of the earlier version are parts of these. Decisions that are explicit and owned by people are part of ownership. Links from intent through design, code, and verification to operation let people check that a result holds and explain why ([Working With An Agent]({{< ref "ai-engineering/agents/ai-assisted-development/working-with-an-agent" >}})).

## Conditions for Reaching Them with Assistants


Two more goals come from features of agents. They're conditions for reaching the Plane 1 goals when assistants do part of the work, and they wouldn't arise without assistants. They describe the workflow with assistants, and Plane 2 is how the environment meets them.

- **Cheap deliberate work.** Agents make generating code cheap, so people fall back on "generate and accept" unless framing, checking, and comparing options cost less ([Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}})).
- **A better next task.** Agents don't learn between sessions, so what one task teaches has to go into the environment and the project's lasting knowledge. Each task then leaves the next one cheaper and more dependable.

## Plane 2: Goals for the Agent Setup and the Environment


The agent setup and the environment (the agent roles and the [substrates]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}) they work in) serve the Plane 1 goals and the two conditions. The participants are people, agents, and automated checks, and the [Processes]({{< ref "ai-engineering/agents/sdlc/processes" >}}) come from the places where the goals meet their features. So the Plane 2 goals describe what the agent roles and the substrates have to give the participants for the processes to run:

1. **The agent works from the project's reality.** The sources of truth, conventions, contracts, and the task's intent are where participants look for them, and the agent's understanding of a task can be checked before other work depends on it. This serves grounding.
2. **Work can be checked as it's done and by someone else.** Fast checks let whoever does the work catch mistakes before anyone else judges it. Independent checks have failures that don't share a cause with the author's. Results carry their evidence and say what wasn't checked. This serves producing with self-checks and independent judging.
3. **People can see and steer the work.** People can see what an agent is doing, what changed, and why, and they can redirect it, stop it, or take over. A breakdown becomes visible when it happens. This serves keeping understanding and repairing breakdowns.
4. **Commitments go through the people who own them.** Decisions and effects that belong to people can't happen without them. The authority layer enforces who may commit what at each commitment point, and an agent stops and asks when a decision isn't its own. The environment is open about method and strict about consequences. This serves deciding and committing.
5. **Task state lives outside any participant's memory.** The substrates keep task state and lasting knowledge, so a new session or another participant can continue the work from where it stopped. This serves keeping continuity.
6. **The environment and autonomy change with evidence.** What tasks teach goes into lasting knowledge, checks, and commands. Each agent role's autonomy for each type of action rises or falls with evidence. Added structure stays only when it proves its value ([Bottom Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}})). This serves allocating work and autonomy, learning across tasks, and checking whether a change helped.

Together these goals let assistants do as much of the work as the evidence supports while the Plane 1 goals hold. This is the combined outcome of Plane 2, and it replaces reliable autonomy. Autonomy is set for each type of action and changes with evidence ([Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#autonomy-and-triggers-for-agent-roles)), so more autonomy isn't a goal in itself.

### Changes from the Earlier Plane 2


The earlier Plane 2 had four goals, and all of them described the agent:

- Alignment with local reality became the first goal, which also covers the task's intent and checking the agent's understanding.
- Fast self-correction and evidence-backed outputs became the second goal, which adds independent checks.
- Clear escalation became part of the fourth goal, where the authority layer enforces it at commitment points.
- Reliable autonomy, the earlier combined outcome, became autonomy matched to evidence.

The third, fifth, and sixth goals are new. They come from the people and the substrates in the model: people need to see and steer the work, the substrates hold the state agents can't remember, and the environment has to learn because agents don't.

## How the Planes Relate


- The Plane 1 goals come from users and owners and hold without assistants. That's why decisions about them go to people (the fourth Plane 2 goal).
- The two conditions come from features of agents: generating is cheap, and agents remember nothing between sessions.
- The processes come from the Plane 1 goals and the conditions, together with the features of the participants. The Plane 2 goals describe what the environment gives the processes, which is the third view that [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}) mentions.
- A Plane 2 goal pursued apart from Plane 1 leads to the failure that step 2 of the log describes: an agent that works on its own and produces passing code that solves the wrong problem.
- `AGENTS.md` is one part of the environment. Its three jobs (where to look, what differs here, and what done means) serve the first, second, and fourth Plane 2 goals (step 8 of the log).

## Related Notes


- [Goals of AI Product Delivery]({{< ref "ai-engineering/approach/goals" >}}): a goal hierarchy for AI product delivery, from solving the right problem to learning from production.
- [Production Commitment]({{< ref "ai/product/operating-model/production-commitment" >}}): what users can rely on, the limits, and the basis for the commitment.
- [Discovery And Delivery]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}): classifying work by its purpose and using evidence to choose the next commitment.
- [Project Ownership]({{< ref "ai-engineering/agents/project-ownership" >}}): understanding and ownership of a project built with agents, and the three debts.
- [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}): the processes that serve these goals.
- [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}): the participants and the substrates that Plane 2 describes.

## Appendix: Earlier Version from Step 4


This is step 4 of the Reasoning Log as it was before step 19 reorganized it.

Seen from the engineering workflow angle, the problem is **not** "how do we make the agent more autonomous at generating code?"

The problem is:
> **How do we structure our workflows and environment so that software assistants help people execute the full engineering workflow -- framing problems, investigating reality, analyzing trade-offs, making explicit decisions, implementing, and verifying failure modes -- without surrendering understanding and ownership?**

### Plane 1: Product, Engineering & Workflow Goals (Primary)


1. **Make deliberate engineering cheaper than "generate-and-accept"**
	- Structure the workflow so using the assistant to clarify requirements, check an assumption in the codebase, or compare design trade-offs is fast and natural -- preventing the rush into premature code generation.
2. **Keep decision-making and trade-offs explicit and human-owned**
	- Assistants surface open questions, gather evidence from the system, and lay out options and trade-offs; people remain accountable for choosing product scope, architecture, risk boundaries, and production commitments.
3. **Connect every change from intent \(\rightarrow\) design \(\rightarrow\) code \(\rightarrow\) verification \(\rightarrow\) operation**
	- Ensure that requirements, assumptions, design rules ("what implementation must preserve"), code, and failure-mode tests stay linked, so neither the author nor the reviewer is judging a diff in a vacuum ([Working With An Agent]({{< ref "ai-engineering/agents/ai-assisted-development/working-with-an-agent" >}})).
4. **Preserve and compound team understanding (Prevent comprehension, technical, and intent debt)**
	- Keep changes small and explainable, record the decisions and contracts that matter in the repository, and ensure someone on the team can always explain *why* a change works and *how* they know ([Project Ownership]({{< ref "ai-engineering/agents/project-ownership" >}})).
5. **Deliver dependable production behavior (Meet production commitments)**
	- Ship software that not only passes local checks, but has defined scope limits, failure handling, observability, and recovery in real use ([Production Commitment]({{< ref "ai/product/operating-model/production-commitment" >}})).

### Plane 2: Agent-System & Environment Goals (Instrumental)


To make those Plane 1 workflows work in practice inside a repository, the Agent Development Environment and `AGENTS.md` aim for four instrumental properties:

1. **Alignment with local reality (Feedforward guidance):** Steer the agent's generic priors toward local sources of truth, conventions, and contracts on the first attempt.
2. **Fast self-correction (Inner-loop feedback):** Let the agent catch and fix its own mistakes via commands, tests, and actionable error messages before human review.
3. **Evidence-backed outputs & clear escalation:** Require outputs to carry verification evidence and force escalation when a decision belongs to a human owner.
4. **Reliable autonomy:** The composite Plane 2 outcome -- the agent completes meaningful units of work within its assigned step *while Plane 1 goals hold*.
