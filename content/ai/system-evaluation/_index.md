---
draft: false
toc: true
title: "Building and Reviewing Software with AI"
description: "A reading guide to building and reviewing AI-assisted software changes, connecting product intent, system design, implementation, meaningful checks, and the merge decision."
lastmod: "2026-10-19"
linkTitle: "Building and Reviewing with AI"
---

When I work with a coding agent, the goal is a useful software change that fits the existing system and stays understandable to the people who will maintain it.

These notes cover the work needed to get there: understanding the problem, defining what should change, choosing an approach, implementing it, and checking the result. Important decisions should be clear enough to review, and assumptions should be checked against the actual system. When implementation or testing reveals a problem with the plan, the plan needs to change too.

Review brings that work together. It connects the requirements, design, code, and test results to a decision about whether the change is ready to merge and what needs to happen before deployment.

The amount of work should fit the change. A small bug fix may need a focused review and a regression test. A database migration or retry change needs more attention to existing data, compatibility, and failure handling.

## Reviewing a change


- [Reviewing Software Changes]({{< ref "ai/system-evaluation/code-review" >}}): what to look at beyond the diff.
- [A Practical Review Process]({{< ref "ai/system-evaluation/review-flow-specification" >}}): the questions to answer before recommending a merge.
- [Testing a Change During Review]({{< ref "ai/system-evaluation/review-flow" >}}): how to check important behavior, including a retry example.
- [Common Mistakes in AI-Assisted Development]({{< ref "ai/system-evaluation/delivery-flow" >}}): mistakes to look for and ways to find them.

## Preparing and building a change


- [Defining the Product Before Building]({{< ref "ai/system-evaluation/skill-product-framing-build" >}}): users, the job, the workflow, scope, and open questions.
- [Making System Design Decisions]({{< ref "ai/system-evaluation/skills-hld-build" >}}): which decisions need attention and what to record.
- [Working with a Coding Agent]({{< ref "ai/system-evaluation/harness" >}}): how planning, implementation, testing, and review fit together.

These notes cover both ordinary application code and changes to AI features. For the latter, see [Evaluation in AI Product Development]({{< ref "ai/approach/evaluations" >}}).
