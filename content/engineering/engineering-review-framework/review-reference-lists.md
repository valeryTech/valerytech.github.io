---
draft: false
toc: true
description: "Reference lists for business context, requirements, engineering principles, technical review, testing, AI-specific risks, and review tools."
title: "Review Reference Lists"
linkTitle: "Review Reference Lists"
---
# Engineering Review Reference Lists

## Purpose


These lists collect the topics to remember when reviewing a software change. They support seven areas: business context, requirements, engineering principles, technical review, testing and PR review, LLM-specific risks, and review tools.

Use the topics relevant to the change. The lists are reminders; detailed procedures and tool instructions can remain in project-specific guides.

The companion [Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}) contains the main checklist and explains the role of each area.

## 1. Business, product, and feature context


Supporting note: [Business, Product, and Feature Context]({{< ref "engineering/engineering-review-framework/business-product-and-feature-context" >}}).

- Business problem and intended outcome
- Target users and use cases
- Product and feature framing
- Scope and non-goals
- Expected user behavior
- Success measures
- Product constraints and dependencies

## 2. Functional and non-functional requirements


Supporting note: [Requirements and Quality Targets]({{< ref "engineering/engineering-review-framework/requirements-and-quality-targets" >}}).

- Whether the relevant requirements have been defined
- Functional behavior and acceptance criteria
- Intended outcomes, necessary conditions, and system responsibilities
- Boundary cases and failure behavior
- Numerical targets and workload assumptions, where applicable
- Performance and scalability
- Reliability, availability, and recovery
- Security and privacy
- Accessibility and usability
- Compatibility requirements
- Resource and cost limits
- Observability and operational needs
- Verification of the requirements

Numerical targets belong to the project's requirements. This reference list does not prescribe universal thresholds.

## 3. Software engineering principles


Supporting note: [Software Engineering Principles]({{< ref "engineering/engineering-review-framework/software-engineering-principles" >}}).

### Simplicity and scope


- **KISS -- keep it simple:** Prefer the simplest solution that meets the requirements.
- **YAGNI -- you aren't gonna need it:** Avoid functionality added for hypothetical future needs.
- **Start small and develop incrementally:** Add complexity as concrete needs emerge.
- **Avoid premature abstraction:** Introduce abstractions for demonstrated needs.
- **Avoid premature optimization:** Justify optimization complexity with requirements or measurements.
- **Reuse existing solutions:** Consider suitable project code, standard libraries, and existing capabilities.
- **Minimal change:** Keep unrelated changes out of the implementation.

### Responsibilities and abstraction


- **Single level of abstraction:** Keep a function at a consistent conceptual level; extract lower-level details when they obscure its purpose.
- **Single responsibility:** Give functions, classes, and modules a cohesive responsibility.
- **Separation of concerns:** Keep distinct concerns within appropriate boundaries.
- **High cohesion, low coupling:** Group related behavior and limit unnecessary dependencies.
- **Encapsulation:** Hide implementation details behind clear interfaces.
- **Dependency inversion:** Keep high-level policies independent of low-level implementation details where appropriate.
- **Composition over inheritance:** Prefer composition when it produces a simpler design.
- **Law of Demeter:** Limit a component's knowledge of its collaborators' internal structure.

### Clarity and maintainability


- **DRY -- don't repeat yourself:** Avoid duplicating knowledge and business rules.
- **Least astonishment:** Keep behavior consistent with names, contracts, and established expectations.
- **Clarity over cleverness:** Make intent straightforward to understand.
- **Consistency:** Follow established project conventions.
- **Explicit failure handling:** Make invalid states and failures visible and handle them deliberately.
- **Testability:** Keep important behavior straightforward to verify.

Apply these principles together. Extracting functions, introducing interfaces, or removing duplication should improve the solution without adding unnecessary complexity.

## 4. Technical review checklists


Supporting note: [Technical Review Guide]({{< ref "engineering/engineering-review-framework/technical-review-guide" >}}).

- Logic, calculations, and business rules
- Functions, methods, classes, and modules
- APIs, schemas, contracts, and compatibility
- Input validation and boundary cases
- State, persistence, data integrity, and migrations
- Concurrency, transactions, retries, and idempotency
- Security boundaries and authorization
- Errors and failure paths
- Performance and resource use
- Dependencies and configuration
- Logging, metrics, and tracing
- Deployment, recovery, and rollback

## 5. Testing, CI, and PR review


Supporting note: [Testing, CI, and PR Review Guide]({{< ref "engineering/engineering-review-framework/testing-ci-and-pr-review-guide" >}}).

CI means continuous integration; PR means pull request.

- Author self-review
- Unit, integration, contract, and end-to-end testing
- Test relevance, failure cases, and regression coverage
- Independent derivation of expected behavior and reliability checks
- Consequential failure scenarios and observable expected results
- Build, formatting, linting, and type checking
- Relevant security, dependency, and performance checks
- PR purpose, scope, testing information, and risks
- Reviewer context and review guidance
- Review discussion, findings, and required approvals

## 6. LLM-specific risks


Supporting note: [LLM-Specific Review Guide]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}}).

LLM means large language model. These topics apply to AI-assisted implementation and review.

- Invented APIs, packages, methods, or configuration options
- Unsupported assumptions about requirements or repository behavior
- Overengineering and premature abstraction
- Speculative features and unrelated scope expansion
- Duplication of existing project functionality
- Tests that miss important behavior or repeat implementation mistakes
- Unverified claims about execution, correctness, compatibility, or performance
- Inconsistent use of project conventions
- Regressions in validation, authorization, or error handling
- Untrusted content influencing agent instructions

## 7. Review agents, skills, and tools


Supporting note: [Review Agents, Skills, and Tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}}).

- Reusable review skills and prompts
- General code review agents
- Agentic workflows combining analysis, critique, and verification
- Wrappers and harnesses for context, execution, and result collection
- Independent review contexts and isolated experiments where useful
- Focused reviews for simplicity and abstraction consistency
- Focused reviews for security, performance, and compatibility
- Linters, type checkers, scanners, and test runners
- Repository context and review scope
- Access permissions, secrets, and external data sharing
- Validation of automated findings
- Human judgment and responsibility for the final decision

Introduce or adapt support for a concrete review need. The [tool and skill catalog]({{< ref "engineering/engineering-review-framework/review-tools-and-skills-catalog" >}}) provides current examples; the review areas remain applicable when implementations change.

## Related guidance


[Framework Rationale and Use]({{< ref "engineering/engineering-review-framework/framework-rationale-and-use" >}}) explains how to use these lists and choose the depth of review.

[Backward Design and Independent Verification]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}}) explains outcome-based derivation, independent test design, and their limitations.
