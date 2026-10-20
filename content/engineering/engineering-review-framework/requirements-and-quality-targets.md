---
draft: false
toc: true
title: "Requirements And Quality Targets"
linkTitle: "Requirements And Quality Targets"
---
## Purpose


Keep the expected behavior, quality, and constraints of a software change explicit. This note supports the requirements component of the Engineering Review Framework, including whether the relevant requirements have been defined at all.

## Whether requirements exist


Consider requirement definition separately from implementation quality. A working implementation does not establish that all relevant expectations were identified.

Requirements may come from the feature, existing product behavior, shared platform standards, or operating constraints. Keep those sources distinguishable from assumptions made during implementation.

An applicable requirement that has not been defined remains an open issue. The current implementation, a test result, or an agent's suggestion should not silently become the accepted target.

## Functional requirements


Functional requirements describe what the solution must do.

Topics to retain:

- Intended behavior and supported use cases
- Business rules and acceptance criteria
- Inputs, outputs, and externally visible behavior
- Boundary cases and failure behavior
- State changes and data effects
- Existing behavior that must be preserved

Keep these requirements connected to the problem and scope. Implementation choices belong here only when they are actual constraints.

## Non-functional requirements


Non-functional requirements describe expected qualities and operating conditions.

Topics to retain:

- Performance and responsiveness
- Throughput, capacity, and scalability
- Reliability, availability, and recovery
- Security, privacy, and access restrictions
- Accessibility and usability
- Compatibility and interoperability
- Resource consumption and cost
- Observability, support, and operability
- Maintainability and deployment constraints

These categories are reminders. Their importance and required specificity depend on the change and the system.

## Numerical targets


Define numerical targets where measurement is useful. Common topics include response time, workload, error rate, resource use, cost, and recovery expectations.

Keep targets connected to the conditions under which they apply. A performance target without an expected workload can leave the requirement ambiguous. Use project needs and existing commitments to set targets; this framework supplies no universal thresholds.

Numerical targets can describe functional behavior as well as system quality. Some requirements are better expressed as explicit rules or constraints, such as supported environments or restrictions on stored data.

Keep required thresholds, desired improvements, and observed measurements distinguishable.

## Constraints and dependencies


Relevant constraints may include existing contracts, supported versions, deployment environments, data handling, dependencies, or available resources.

Make these constraints visible when they limit the solution. Preserve the distinction between a requirement and a design preference.

## Verification expectations


Keep a broad connection between each important requirement and how it can be established: tests, measurement, inspection, or operational observation.

Detailed procedures belong in the relevant testing or review guides. At this level, retain the requirement and its intended basis for evaluation. Record uncertainty when a requirement cannot yet be verified.

## Related documents


[Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}) · [Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}) · [Business, Product, and Feature Context]({{< ref "engineering/engineering-review-framework/business-product-and-feature-context" >}}) · [Technical Review Guide]({{< ref "engineering/engineering-review-framework/technical-review-guide" >}}) · [Testing, CI, and PR Review Guide]({{< ref "engineering/engineering-review-framework/testing-ci-and-pr-review-guide" >}})
