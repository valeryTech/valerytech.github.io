---
draft: false
toc: true
title: "Engineering Work with Software Assistants"
description: "A working model of engineering work with software assistants: goals, activities and task types, reasoning and cycles, participants and processes, concrete workflows, and how to build and revise them from real tasks."
linkTitle: "SDLC"
---

These notes describe a working model of engineering work when people, coding agents, and automated checks work together.

## How the Work Is Organized


Five ideas describe how the work fits together:

- **Activities** are the six general kinds of work (framing, investigation, design decisions, implementation, verification and review, and release, operation, and learning), each with its own output, needed context, and definition of done.
- **Task types** are recurring jobs, such as fixing a bug, framing a problem, or refactoring a module. Each combines the activities it needs toward a defined output.
- **Workflows** are the concrete steps, participants, decision points, checks, and backtracks a team uses to carry out a task type.
- **Phases** are periods in a project's life, such as design or operation. Each phase groups the activities it uses most and ends with a goal or a decision.
- **Cycles** repeat at several scales: inside one step (frame, choose, act, and look back), across project phases, on a running product, and across tasks and projects.

## Notes in This Folder


Each note answers one question:

- **Why:** [Two Planes of Goals]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}) states the product and engineering goals (Plane 1), two conditions that come from working with agents, and the goals for the agent setup and environment (Plane 2).
- **What work is done:** [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) defines the six kinds of work and how project phases group them; [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}) catalogs the recurring tasks that combine them, with delegation profiles and measures.
- **How to reason in any step:** [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}) lists ten problem-solving practices that hold even for one person working alone; [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}) shows how problem solving and learning repeat at different scales.
- **How to coordinate across people, agents, and checks:** [Participants and Substrates]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}) describes who holds capability, authority, and accountability, and the five substrate layers they work in; [Processes]({{< ref "ai-engineering/agents/sdlc/processes" >}}) derives the ten coordination processes that multi-participant work adds on top of individual reasoning.
- **How it comes together in a workflow:** [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) gives the six-part workflow format, the three forms a workflow takes in a setup, and the "generate and accept" shortcut workflows counter.
- **How to build and test from actual tasks:** [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) builds task workflows from cases, and [Testing and Revising the Working Model]({{< ref "ai-engineering/agents/sdlc/model-revision-loop" >}}) revises these concepts when cases show a gap.
- **Examples and references:** [Workflow Example: Fix a Bug]({{< ref "ai-engineering/agents/sdlc/workflow-fix-a-bug" >}}) and [Workflow Example: Frame a Problem]({{< ref "ai-engineering/agents/sdlc/workflow-frame-a-problem" >}}) apply the workflow format to fixing a bug and framing a problem; [Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}}) describes two orchestrated pipelines that separate defining correctness from writing code; and the [Reading Map]({{< ref "ai-engineering/agents/sdlc/reading-map" >}}) indexes related notes across the vault.
