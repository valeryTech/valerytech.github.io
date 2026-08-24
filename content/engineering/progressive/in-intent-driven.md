---
draft: false
toc: true
title: "In Intent Driven"
linkTitle: "In Intent Driven"
---

In the context of software engineering and architecture, let's explore approaches where user needs, Jobs-to-be-Done (JTBD), or other product-framing things serve as the foundational framework for reasoning about a system. I raise this because many traditional frameworks--like the C4 model--rely heavily on structural diagrams but often lack an underlying setting (forces, factors, context, etc.). They map out the architecture but fail to articulate _why_ a component exists in the first place. Beyond superficial interactions (e.g., 'the user sends an email, and the system responds'), we need models that clarify the actual problem we are solving.

## Language and DSL


One could say that we should reason and think in the domain terms.

And, DDD is the example methodology for **anchoring** software architecture to the actual business problem (the "Domain"). Rather than starting with databases or static classes, DDD starts with the language of the business.

## DDD practices


**Event Storming:** This is a collaborative workshop technique within the DDD ecosystem. You map out the system by starting strictly with **Domain Events** (things that happen that the user or business cares about). You then work backward to find the triggers (Commands/User Actions) and the data needed to make those decisions.

## Clean Architecture (Use-Case Driven Architecture)


Popularized by Robert C. Martin (Uncle Bob) and echoing Ivar Jacobson's earlier work, Clean Architecture dictates that a system's architecture should "scream" its intent, not its framework.

- **The Approach:** At the very center of the architecture are **Entities** (enterprise business rules) and **Use Cases**(application business rules). Frameworks, databases, and UI are pushed to the outer layers as implementation details.
- **Why it fits:** If you look at the top-level directory structure of a Use-Case Driven application, you do not see folders named `Controllers` or `Views`. You see folders named `SubmitLoanApplication` or `RouteDelivery`. The architecture is explicitly organized around the JTBD.

# Result: ADRs
