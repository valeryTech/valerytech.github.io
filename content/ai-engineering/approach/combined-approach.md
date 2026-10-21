---
draft: false
toc: true
title: "Structured AI Development Approach"
description: "Connects the causal stack, evaluation harness, observability, test pyramid, and operating model into one delivery system for diagnosing failures and directing engineering work."
linkTitle: "Structured AI Development Approach"
---

Structured AI development approach:

- Product behavior investigations: the [practical guide]({{< ref "ai-engineering/causal-stack" >}}) connects customer cases, debugging questions, claims, and focused checks. Use it to choose the next useful investigation and assess a product change.
- Evaluation harness and platform
- Methodology and operating model
- Observability and test pyramid
- Experimentation and scientific foundation as well as [Experimentation]({{< ref "ai-engineering/approach/experimentation" >}}) approach to delivery
- Architecture and engineering principles
- Cross-functional alignment with shared taxonomies and tools (frameworks, patterns, delivery)

Design approach: [Exploratory Design]({{< ref "engineering/eng-exp/exploratory-design" >}}).

The central idea is integrative: the eval harness/test pyramid, observability, and the [product behavior guide]({{< ref "ai-engineering/causal-stack" >}}) are complementary parts of one AI delivery system, together giving a fuller picture of failure modes, evaluation, and operational control.

The **test pyramid**, the **canonical eval flow set**, and the **observability scheme** can be combined and refactored into one quality system for LLM products. They provide **orthogonal views of the same control system** and together support reliable AI delivery.

> The test pyramid, eval harness, observability, and operating model are not separate initiatives. They are connected parts of the same delivery system.

# Workflow Design Approach


[Workflow Design]({{< ref "ai/design/workflow-design/workflow-design" >}})

# System Definition


What is a system?

A structured problem-solving approach guides reasoning and action when building an AI product:

1. A framework for evaluating different technologies and tools
2. A decision-making process for prioritizing development efforts
3. A methodology for diagnosing and improving application performance
4. A set of standardized metrics and benchmarks to measure success

The framework also helps teams decide:

- what to build first;
- which risks matter;
- what to evaluate;
- what blocks release;
- whether a failure is retrieval, model, tool, data, product, or control-related.
