---
draft: false
toc: true
title: "Engineering Workflows"
description: "What an engineering workflow is, the six parts a workflow specifies for a task type, how workflows live in a project's setup, and why teams fall into the generate-and-accept shortcut without them."
linkTitle: "Workflows"
---

This note defines what an engineering workflow is, what a concrete workflow has to specify, how it lives in a project's setup, and what goes wrong when teams add coding assistants without adapting their workflows. For how all notes in this folder fit together, see the [SDLC index]({{< ref "ai-engineering/agents/sdlc" >}}).

## What a Workflow Is


Software engineering draws on six general activities: framing, investigation, design decisions, implementation, verification and review, and release, operation, and learning ([Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}})). Almost no single task uses all six. Answering a question about the code uses investigation alone; fixing a bug uses investigation, design decisions, implementation, and verification ([Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}})).

A **workflow** is the concrete recipe a team uses to carry out one task type with people, agents, and automated checks ([Participants and Substrates]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}})). A task type defines the job (starting input, output, definition of done, and default delegation level); a workflow defines how participants execute that job.

Across tasks, good workflows produce two outputs at once ([Two Planes of Goals]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}})):

- **A system people can rely on** in production.
- **The team's understanding and ownership** of what the system does, why decisions were made, and how it can fail.

## What a Workflow Specifies


To be usable by people and agents, a workflow for a task type specifies six parts:

1. **Scope and starting input:** which task type the workflow covers, what must exist before work starts, and what is out of scope.
2. **Steps:** the sequence of steps, with who does each step (person, agent role, or automated check), which activity it belongs to, and what it produces.
3. **Decision points:** where work stops for a person to choose or approve, who owns each decision, and what evidence the person sees before deciding.
4. **Checks:** which fast checks run during the work (self-checks) and which checks are independent of whoever produced the result.
5. **Backtracks:** what sends work back to an earlier step when an assumption turns out to be wrong ([Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}})).
6. **Placement:** which parts live as written practice, as a skill or command, and as an enforced gate.

Start with a minimal workflow and adjust it from actual tasks, keeping only the steps and checks that prove useful ([Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}})). For complete examples written in this format, see [Workflow Example: Fix a Bug]({{< ref "ai-engineering/agents/sdlc/workflow-fix-a-bug" >}}) and [Workflow Example: Frame a Problem]({{< ref "ai-engineering/agents/sdlc/workflow-frame-a-problem" >}}).

## How a Workflow Lives in a Team's Setup


Depending on the risk of the task type and how often it repeats, a workflow takes one of three forms:

1. **A written working practice** in the [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}) (project docs, pull request templates, and commands) that people and agents follow during a session.
2. **A skill or agent role** in the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}) that guides or runs part of the task when invoked.
3. **An orchestrated pipeline** where code runs stages in separate agent contexts with deterministic gates, used when the cost of a mistake justifies strict isolation ([Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}})).

In all three forms, rules at commitment points (such as merging, deploying, or changing shared contracts) belong in the authority layer (branch protection, CI gates, permissions, and deploy controls) so they hold even if an agent skips written guidance ([What a Team Can Change]({{< ref "ai-engineering/agents/customization/what-can-change" >}})).

## The "Generate and Accept" Shortcut


When a team adds a coding assistant without adapting its workflows, people take the easiest path:

> **Rough request \(\rightarrow\) Agent writes code and tests \(\rightarrow\) Tests pass and the summary sounds right \(\rightarrow\) Person accepts.**

In terms of the [problem-solving cycle]({{< ref "ai-engineering/agents/sdlc/cycles" >}}), this shortcut keeps only the *act* step and skips *framing*, *choosing*, and *looking back*:

1. **Framing gets skipped:** Writing code is cheap, so people jump straight to it. When a request is unclear, the agent guesses what it means and writes that guess into the code ([Common Mistakes]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}})).
2. **Design happens by accident:** The agent commits to its first idea, adds extra layers, or patches around a wrong assumption (such as adding retries when a timeout does not mean the call failed).
3. **Tests check the agent's own mistake:** The agent writes both the code and the tests from the same wrong assumption, so passing tests hide the defect ([Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}})).
4. **Understanding and ownership fade:** People stop forming their own mental model before accepting output, and three kinds of debt build up together: **technical debt** in the code, **comprehension debt** in the team, and **intent debt** from unrecorded decisions ([Project Ownership]({{< ref "ai-engineering/agents/project-ownership" >}})).

See [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}#shortcut-vs-deliberate-assistant-use-in-each-activity) for how deliberate assistant use differs from this shortcut in each of the six activities.

## Examples


- [Workflow Example: Frame a Problem]({{< ref "ai-engineering/agents/sdlc/workflow-frame-a-problem" >}}): a workflow for turning a rough request, idea, or report into a short brief before design or implementation.
- [Workflow Example: Fix a Bug]({{< ref "ai-engineering/agents/sdlc/workflow-fix-a-bug" >}}): a lightweight workflow for a single pull request, written in the six-part format.
- [Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}}): orchestrated multi-stage pipelines for design and implementation with isolated agents and holdout tests.
