---
draft: false
toc: true
description: "Review software changes across business context, requirements, engineering principles, technical quality, testing, AI risks, and tools."
title: "Engineering Review Framework"
linkTitle: "Engineering Review Framework"
---
## Purpose


A reusable framework for reviewing software changes. It keeps the main review areas visible and uses supporting reference lists to reduce omissions.

The framework covers the problem being solved, the requirements, the implementation, and the review process. It applies to both human-written and AI-assisted changes.

## Documents


- **Engineering Review Framework** -- this document: purpose, main components, and the top-level checklist.
- **[Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}})** -- supporting lists of engineering principles and review topics for each component.
- **[Framework Rationale and Use]({{< ref "engineering/engineering-review-framework/framework-rationale-and-use" >}})** -- why the framework is organized this way and how to use it during development and review.
- **[Backward Design and Independent Verification]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}})** -- two supporting approaches: derive needed behavior from product outcomes, and design checks independently around important failures.

The seven component notes are linked from the main checklist below. Each explains its area without requiring the reader to reconstruct earlier discussions.

## Main review checklist


- [ ] [Business, product, and feature context]({{< ref "engineering/engineering-review-framework/business-product-and-feature-context" >}})
- [ ] [Functional and non-functional requirements]({{< ref "engineering/engineering-review-framework/requirements-and-quality-targets" >}})
- [ ] [Software engineering principles]({{< ref "engineering/engineering-review-framework/software-engineering-principles" >}})
- [ ] [Technical review checklists]({{< ref "engineering/engineering-review-framework/technical-review-guide" >}})
- [ ] [Testing, CI, and PR review]({{< ref "engineering/engineering-review-framework/testing-ci-and-pr-review-guide" >}})
- [ ] [LLM-specific risks]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}})
- [ ] [Review agents, skills, and tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}})

## Main components

### 1. Business, product, and feature context


The reason for the change: the problem, intended users, expected outcome, scope, and non-goals.

### 2. Functional and non-functional requirements


The behavior and quality expected of the solution, including measurable targets where appropriate. This includes considering whether the relevant requirements have been defined at all.

### 3. Software engineering principles


Shared goals for assessing design and implementation, such as simplicity, cohesive responsibilities, information hiding, and explicit state and effects. Supporting guidance distinguishes these goals from techniques selected for the language and programming paradigm.

### 4. Technical review checklists


Review topics covering the implementation: logic, functions, modules, APIs, data, security, and system behavior. Existing team or project checklists can supply the detail.

### 5. Testing, CI, and PR review


The development and review process: testing, continuous integration (CI), author self-review, pull request (PR) preparation, and reviewer guidance.

### 6. LLM-specific risks


Additional concerns for work assisted by large language models (LLMs), including invented APIs, unsupported assumptions, unnecessary complexity, and unverified claims.

### 7. Review agents, skills, and tools


Ways to support any review area: introduce focused agents, capture reusable guidance in skills, combine activities into agentic workflows, and use tools to gather evidence. Choose or adapt them to the review question; specific implementations are examples that can change over time.

## Using the framework


Keep the main checklist short. Use the supporting lists as reminders when considering each area, and select topics according to the change's scope and risk.

The lists collect what to consider. The component notes explain purpose, motivation, and broad guidance. Detailed review questions, execution instructions, and tool configurations can remain in existing project guides.

Use existing tickets, requirements, and PR discussions to retain context and findings. The framework does not require a separate form, score, or written response for every supporting topic.

Apply engineering principles together and in context. The framework should help identify omissions without encouraging unnecessary changes or abstractions.
