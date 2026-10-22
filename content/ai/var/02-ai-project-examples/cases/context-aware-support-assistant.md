---
draft: false
toc: true
title: "Context Aware Support Assistant"
linkTitle: "Context Aware Support Assistant"
---
# Context-aware support assistant


Source: [Shared ChatGPT conversation](https://chatgpt.com/share/6ad964c5-f9b8-83e9-b0e3-8ef364bad546).

Design question: Should context-aware support be considered a separate case?

Initial case description:

| Case | Primary work | Examples |
| --- | --- | --- |
| Contextual support assistant | Resolves an issue using product knowledge, the customer's actual state, and case history. | Billing explanations, configuration diagnosis, account support, escalation. |

The proposal retains **Context-aware support assistant** as a separate case for analysis, without assuming it must become a separate product category.

It brings together several concerns: product knowledge, live user-specific information, diagnosis, and controlled transitions to other workflows.

The initial phrase **“resolves an issue”** needs qualification because the assistant may explain or diagnose an issue without being authorized to perform the correction.

## 3. Context-aware support assistant


A context-aware support assistant helps users understand and diagnose issues involving a particular product, service, or account. It combines product knowledge with information about the user's actual situation to provide relevant explanations, troubleshooting guidance, and possible next steps.

Unlike a general-purpose assistant answering questions from general knowledge, this system may need access to product documentation, configuration, account information, operational state, and previous support interactions.

For example, a user may ask why their subscription was charged unexpectedly. The assistant can examine the relevant billing rules and authorized account information, compare expected and observed behavior, and explain the possible cause.

**The central challenge is interpreting a user's issue in the context of the actual system and their current state.** This may involve identifying relevant information, performing read-only diagnostic checks, relating observations to product rules, and distinguishing established causes from possible explanations.

The interaction can combine natural language, guided troubleshooting, buttons, structured forms, diagnostic results, and links to relevant product interfaces.

### Execution boundaries and workflow transitions


In the proposed architecture, the support assistant operates with read-only access to business systems. It can retrieve information, diagnose issues, and recommend supported resolutions without directly modifying accounts, issuing refunds, or changing system configuration.

When a resolution requires an operation, the assistant may direct the user to a separate bounded workflow. That workflow independently enforces permitted actions, authorization, validation, and execution conditions.

The user may return to the support assistant afterward to receive an explanation of the verified outcome or continue troubleshooting.

### Context and reliability


The assistant may depend on information from several sources with different access requirements, freshness, and reliability. It should use information authorized for the particular user and account, distinguish observed system state from possible explanations, and recognize when available information is insufficient to establish a cause.

When an issue cannot be resolved through the available information or supported workflows, the assistant may help prepare an escalation to human support, preserving relevant diagnostic context.

**Examples:** SaaS billing support, account troubleshooting, product configuration assistance, technical support, and customer-service diagnosis.

## Why keep this as a separate case?


The support example highlights a combination that the other cases do not emphasize as directly:

- A user begins with a problem that may be ambiguous.
- The system must understand both product rules and the user's actual state.
- Diagnosis can be flexible and exploratory.
- The support assistant has restricted authority over external systems.
- Resolution may require handing off to a separate workflow or human.

It therefore overlaps with the general-purpose assistant, analytical investigation, and closed-set workflows. The useful question is how those approaches work together **in the context of customer support**, especially when account information is dynamic and some resolutions have consequential effects.

This remains case 3 in the collection. Whether it represents a distinct product type or a recurring configuration of capabilities and architectural constraints remains an open question.
