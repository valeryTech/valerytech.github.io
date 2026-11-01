---
draft: false
toc: true
title: "Building and Reviewing Software with AI"
description: "AI-assisted development connects a user’s problem to a design, implementation, and evidence that the result works. These notes carry that thread through product framing, coding-agent work, testing, and merge review."
lastmod: "2026-04-19"
linkTitle: "Building with AI"
---

When I work with a coding agent, the goal is a useful software change that fits the existing system and stays understandable to the people who will maintain it.

These notes cover the work needed to get there: understanding the problem, defining what should change, choosing an approach, implementing it, and checking the result. Important decisions should be clear enough to review, and assumptions should be checked against the actual system. When implementation or testing reveals a problem with the plan, the plan needs to change too.

Review brings that work together. It connects the requirements, design, code, and test results to a decision about whether the change is ready to merge and what needs to happen before deployment.

The amount of work should fit the change. A small bug fix may need a focused review and a regression test. A database migration or retry change needs more attention to existing data, compatibility, and failure handling.

## Reviewing a change


- [Reviewing Software Changes]({{< ref "ai-engineering/agents/ai-assisted-development/code-review" >}}): what to look at beyond the diff.
- [A Practical Review Process]({{< ref "ai-engineering/agents/ai-assisted-development/review-process" >}}): the questions to answer before recommending a merge.
- [Testing a Change During Review]({{< ref "ai-engineering/agents/ai-assisted-development/testing-during-review" >}}): how to check important behavior, including a retry example.
- [Common Mistakes in AI-Assisted Development]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}}): mistakes to look for and ways to find them.

## Preparing and building a change


- [Defining the Product Before Building]({{< ref "ai-engineering/agents/ai-assisted-development/product-framing" >}}): users, the job, the workflow, scope, and open questions.
- [Making System Design Decisions]({{< ref "ai-engineering/agents/ai-assisted-development/system-design-decisions" >}}): which decisions need attention and what to record.
- [Working with a Coding Agent]({{< ref "ai-engineering/agents/ai-assisted-development/working-with-an-agent" >}}): how planning, implementation, testing, and review fit together.

These notes cover both ordinary application code and changes to AI features. For the latter, see [Evaluation in AI Product Development]({{< ref "ai-engineering/approach/evaluations" >}}).
