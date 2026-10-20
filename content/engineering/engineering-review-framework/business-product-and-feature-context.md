---
draft: false
toc: true
description: "Frame a software change through its business problem, intended users, expected outcome, scope, constraints, and success measures."
title: "Business Product And Feature Context"
linkTitle: "Business Product And Feature Context"
---
# Business, Product, and Feature Context

## Purpose


Keep the reason for a software change available during design and review. This note covers the problem, intended users, expected outcome, and scope. It supports the business-context component of the Engineering Review Framework.

## Business context


Business context explains why the work is being considered and what outcome would justify it. The outcome may concern customer value, operational efficiency, cost, risk, or an internal engineering need.

Topics to retain:

- Problem or opportunity
- Expected value and priority
- Existing behavior and its limitations
- Constraints on time, resources, and delivery
- Dependencies on other work or decisions

Describe the problem independently of a proposed implementation. Keep assumptions about value visible when they have not yet been established.

## Product context


Product context identifies who is affected and how the change fits into their use of the product. For internal systems, the users may be engineers, operators, or other teams.

Topics to retain:

- Intended users and their needs
- Relevant use cases and workflows
- Current experience and intended improvement
- Fit with existing product behavior
- Effects on other users or parts of the product

Keep enough surrounding context to explain the change without requiring the reviewer to reconstruct earlier discussions.

## Feature framing


Feature framing establishes the boundary of the proposed change.

Topics to retain:

- Intended capability or behavior
- Included scope and explicit non-goals
- Smallest useful version
- Existing capabilities that could satisfy the need
- Dependencies and affected areas
- Adoption or rollout considerations, where relevant

Keep future possibilities separate from the current scope. A possible extension does not by itself justify additional implementation now.

## Expected outcome


Describe what improvement the change is intended to produce. Include success measures when they help evaluate that outcome.

A product outcome and an implementation requirement serve different purposes. The outcome describes the intended benefit; the requirements describe the behavior and quality the solution must provide. Both should remain connected to the same problem.

## Uncertainty


Keep confirmed needs, assumptions, and unresolved decisions distinguishable. Missing context should remain visible so that implementation choices do not silently become product decisions.

The amount of framing should fit the change. A small correction may need only a brief explanation; a new capability may need more context. Existing tickets or product notes can supply that context without being duplicated.

## Related documents


[Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}) · [Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}) · [Requirements and Quality Targets]({{< ref "engineering/engineering-review-framework/requirements-and-quality-targets" >}}) · [Framework Rationale and Use]({{< ref "engineering/engineering-review-framework/framework-rationale-and-use" >}})
