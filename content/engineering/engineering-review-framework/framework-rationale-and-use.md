---
draft: false
toc: true
description: "Use the Engineering Review Framework to retain context, choose review depth, and connect checklists, supporting notes, and project guidance."
title: "Framework Rationale And Use"
linkTitle: "Framework Rationale And Use"
---
## Purpose


Explain the reasoning behind the Engineering Review Framework and how to use its documents during development and review. The framework is intended to improve recall: keep relevant concerns available so that they are less likely to be forgotten.

The main checklist covers business context, requirements, engineering principles, technical review, testing and PR review, LLM-specific risks, and review tools. Supporting notes explain those areas without requiring a separate response for every topic.

## Why the framework is organized this way

### Keep the problem and requirements visible


Business context explains the intended benefit. Requirements describe the behavior and quality the solution must provide. Keeping both visible gives the reviewer a basis for evaluating the implementation.

Requirement definition deserves attention of its own. An implementation can be internally consistent while depending on an unconfirmed assumption. A performance measurement can be accurate while the acceptable performance target remains undefined. The framework therefore includes whether relevant requirements exist, as well as whether the solution satisfies them.

### Make principles available at the point of review


The principles list provides reminders about simplicity, scope, abstraction, responsibilities, and maintainability. One entry in the main checklist points to that entire list.

Principles guide judgment. Applying them mechanically can create conflicting demands: extracting more functions may obscure a small operation, and removing similar code may introduce a weak shared abstraction. The supporting note explains how to consider those trade-offs.

### Separate the review areas from the ways of checking them


The review areas describe what needs consideration. Tests, CI jobs, human reviewers, and agents provide different ways to examine those areas. Keeping them separate allows the team to change tools while preserving its expectations.

A tool's output also has a scope. A test result concerns the behavior exercised by that test; an inspection concerns the code and context examined. Keep conclusions within those limits.

## How the documents fit together


**The main framework** provides the seven-entry checklist and a description of each component.

**The reference lists** collect topics and principles for recall. They are the compact reference to consult during review.

**The component notes** explain purpose, motivation, boundaries, and broad guidance. Read them when adopting the framework or when a review area needs clarification.

**Project documentation** supplies concrete requirements, conventions, commands, CI configuration, and approval policies. Link to existing material wherever it already answers the need.

## Using the framework during development

### Before implementation


Establish enough context and requirements to choose a solution. Consider simplicity and existing capabilities early. Keep assumptions and unresolved requirements visible; the amount of detail should fit the change.

### During implementation


Use the principles and technical references while the design is still easy to adjust. Keep the change focused and include the tests needed to demonstrate its behavior. Google's engineering guidance recommends small, self-contained changes that remain coherent and reviewable.[1]

### During PR review


Use the main checklist to recall the review areas. Consult the relevant lists and notes, consider the actual results of checks, and discuss unresolved issues in the existing PR conversation. A dedicated report for every category is optional.

## Choosing the depth of review


Consider the consequences of failure, the affected users and systems, uncertainty, and how easily a change can be reversed. The number of changed lines is only one consideration.

A small authorization change may need careful security review. A database migration may need attention to compatibility, data preservation, and recovery. A documentation correction can use a much smaller set of supporting topics.

The framework aims to support sound engineering decisions without demanding perfection. Google's review standard similarly prioritizes improving code health while recognizing that reasonable trade-offs remain.[2] Existing project requirements and approval policies still apply.

## Keeping the framework useful


Keep the main checklist stable and short. Add a reference topic when experience reveals a missing concern. Extend a guide when a recurring misunderstanding needs explanation. Keep tool installation details and rapidly changing configuration in project documentation.

Judge the framework by whether it helps surface missed requirements, defects, and avoidable complexity. Do not use checkbox counts, review-comment counts, or the number of agents invoked as a quality score.

## References


External references checked on 2026-10-20. The organization and usage guidance above are recommendations for this framework.

[1] Google Engineering Practices, [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html).

[2] Google Engineering Practices, [The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html).

## Related documents


[Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}) · [Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}) · [Software Engineering Principles]({{< ref "engineering/engineering-review-framework/software-engineering-principles" >}}) · [Testing, CI, and PR Review Guide]({{< ref "engineering/engineering-review-framework/testing-ci-and-pr-review-guide" >}})
