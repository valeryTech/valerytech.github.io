---
draft: false
toc: true
title: "Engineering Workflows"
description: "What good engineering workflows do and the reasoning they rely on, how people short-circuit them when they add software assistants, and how an assistant can help at each step of the lifecycle."
linkTitle: "Workflows"
---

This note describes Plane 1 of the [goals]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}): the product, engineering, and workflow side of the work. The workflow and its reasoning apply with or without AI; the later sections cover what changes when people add software assistants. [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) defines the activities, [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}) describes the cycles they belong to, [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}) describes how to reason and decide in any of them, and the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) describes how we build and test workflows from real tasks. For related notes on review, decisions, investigation, evidence, and reflection, see the [Reading Map]({{< ref "ai-engineering/agents/sdlc/reading-map" >}}).

## The Baseline: What Good Engineering Workflows Actually Do


Even before AI, building software is not just "writing code." Across [discovery-and-delivery.md]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}), [production-commitment.md]({{< ref "ai/product/operating-model/production-commitment" >}}), and [design-and-delivery.md]({{< ref "ai-engineering/delivery/design-and-delivery" >}}), engineering is a connected cycle of activities. Each activity can serve **Discovery** (reducing uncertainty that matters to a decision), **Delivery** (building, verifying, releasing, and operating behavior people can rely on), or both. There are six activities: framing, investigation, design decisions, implementation, verification and review, and release, operation, and learning. [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) defines each one, what it produces and needs, and which phases use it most.

Throughout this cycle, the workflow does **two things at once**:

- It produces a **working, dependable system in production**.
- It builds and maintains the **team's understanding and ownership** of *what* the system does, *why* decisions were made, and *how* it can fail.

## Activities, Phases, and Cycles


Three ideas describe how the work is organized:

- **Activities** are kinds of work, each with its own output, context, and definition of done. [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) defines them in general terms and describes what a project's own version of an activity states.
- **Phases** are periods in a project's life, such as design or operation. Each phase groups the activities it uses most and ends with an objective or decision. The same activity can appear in several phases.
- **Cycles** repeat at different levels. The problem-solving cycle (frame, choose, act, and look back and learn) runs inside each activity. The project phases form a cycle of their own. The Problem and Response Cycle comes before a project, the improvement cycle runs on a product in production, and the Engineering Knowledge Loop learns across cases and projects. [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}) describes all of them.

The "generate and accept" shortcut described below keeps only the act part of the problem-solving cycle: it skips framing, choosing, and looking back.

## What Goes Wrong When People Introduce Software Assistants


When teams bring coding/software assistants into this lifecycle without structuring their workflow, people gravitate toward the path of least resistance:

> **Vague request \(\rightarrow\) Agent generates code & tests \(\rightarrow\) Tests pass / summary sounds convincing \(\rightarrow\) Human accepts.**

Instead of assisting across the lifecycle, the assistant is used to **short-circuit** it:

1. **Framing and trade-offs get skipped ("Ready-fire-aim"):** Because generating code is cheap, people jump straight to implementation. When requirements are unclear, the agent silently guesses one interpretation and bakes it into the code ([common-mistakes.md]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}})).
2. **Design decisions become accidental:** Instead of comparing alternatives and checking assumptions against the system, the agent sticks with its first idea, adds unnecessary abstractions, or patches around a wrong assumption (e.g., adding more retries when a timeout does not mean the operation failed).
3. **Verification becomes circular:** The agent writes both the code and the tests from the same mistaken assumption (e.g., a mock that never exercises the failure mode that matters). Everything is green, giving false confidence. [Independent Verification Workflows for Coding Agents]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}}) describes workflows that separate who writes the tests from who writes the code.
4. **People shift from *cognitive offloading* to *cognitive surrender*:** As described in [project-ownership.md]({{< ref "ai-engineering/agents/project-ownership" >}}) (citing Alakmeh et al. and Osmani), developers who let the AI lead without first forming their own understanding and checking assumptions lose comprehension of the system.
5. **Three debts accumulate simultaneously:**
   - **Technical debt** in the code (duplicated patterns, broken boundaries, unnecessary machinery).
   - **Comprehension (cognitive) debt** in the team (nobody can explain why the system works or what a change affects).
   - **Intent debt** in the project (goals, constraints, and reasons for decisions were never recorded).

## Shortcuts vs. Deliberate Workflow Across the Lifecycle


When we treat the AI as a **software assistant** across the whole workflow rather than a raw code generator, its role at each step changes:

| Activity                           | Suboptimal Use ("Generate & Accept" Shortcut)       | Deliberate Workflow with a Software Assistant                                                                                                                                  |
| :--------------------------------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Problem & Product Framing**   | Skip framing; paste a rough ticket and ask for code | Assistant reads existing docs/code/issues, separates current behavior from intended behavior, drafts a short brief, and flags open product questions for the owner             |
| **2. Investigation & Feasibility** | Assume how the system/API works without checking    | Engineer asks a specific question; assistant inspects code/logs/contracts or runs a focused check/prototype and reports what was observed vs. what remains unknown             |
| **3. System Design & Trade-offs**  | Let the agent invent abstractions while coding      | Assistant helps map affected components/callers, compares useful alternatives against constraints, and records what implementation must preserve                               |
| **4. Implementation**              | Generate a huge diff across the repo in one go      | Assistant implements within agreed design rules, local conventions, and architecture boundaries, running fast baseline checks as it goes                                       |
| **5. Verification & Review**       | Trust green unit tests written by the same agent    | Assistant helps trace callers and failure paths, build tests that exercise real failure modes (e.g., lost response after commit), and produce an evidence-backed review record |
| **6. Release, Operation & Upkeep** | Merge and forget until an incident happens          | Check rollout/rollback/migration safety; investigate production traces; turn repeated mistakes or new decisions into updated contracts, checks, commands, or `AGENTS.md` rules |
