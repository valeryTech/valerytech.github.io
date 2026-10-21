---
draft: false
toc: true
description: "Frame architecture through user needs and jobs to be done, using domain language, DSLs, DDD practices, use cases, and decision records to preserve intent."
title: "In Intent Driven"
linkTitle: "In Intent Driven"
---
# Intent-driven architecture


User needs, Jobs-to-be-Done (JTBD), and other product concerns can provide the starting point for reasoning about a software system. Structural diagrams, including C4 views, show how a system is organized. They can leave the forces, factors, and context behind that design unexplained. They do not by themselves explain why a component exists. An interaction such as "the user sends an email and the system responds" still needs to explain which problem the interaction solves.

## Language and DSL


Reasoning starts in domain terms.

DDD is an example of a method for **anchoring** software architecture to the business problem, or "Domain." Rather than starting with databases or static classes, DDD starts with the language of the business.

## DDD practices


**Event Storming:** This is a collaborative workshop technique within the DDD ecosystem. The workshop starts with **Domain Events**: occurrences that matter to users or the business. The workshop then works backward from those events to identify triggers (commands/user actions) and the data needed to make the decisions.

## Clean Architecture (Use-Case Driven Architecture)


Popularized by Robert C. Martin (Uncle Bob) and echoing Ivar Jacobson's earlier work, Clean Architecture dictates that a system's architecture should "scream" its intent, not its framework.

- **The Approach:** At the very center of the architecture are **Entities** (enterprise business rules) and **Use Cases**(application business rules). Frameworks, databases, and UI are pushed to the outer layers as implementation details.
- **Why it fits:** A use-case-driven application can organize its top-level directories around capabilities such as `SubmitLoanApplication` or `RouteDelivery`. The architecture is explicitly organized around the JTBD rather than technical layers such as `Controllers` or `Views`.

## Decision records


Architecture Decision Records (ADRs) record a decision, why it was made, its context, and its consequences. They keep those choices connected to product and domain concerns.
