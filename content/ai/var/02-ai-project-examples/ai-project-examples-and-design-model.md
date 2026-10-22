---
draft: false
toc: true
description: "Eight concrete AI product cases, their relationships, and initial design-model notes."
title: "Ai Project Examples And Design Model"
linkTitle: "Ai Project Examples And Design Model"
---
# Reasoning about AI projects through worked examples

## Specific cases


The eight case notes are grouped in `cases/`. These are concrete examples for analysis, and their descriptions can overlap within one product.

| # | Case | Primary work | Examples |
| --- | --- | --- | --- |
| 1 | **[Closed-set task assistant]({{< ref "ai/var/02-ai-project-examples/cases/closed-set-task-assistant" >}})** | Supports predefined tasks with architectural guardrails; the application enforces valid transitions, permissions, and operations. | Booking, account recovery, form completion, predefined customer-service tasks. |
| 2 | **[General-purpose AI assistant]({{< ref "ai/var/02-ai-project-examples/cases/general-purpose-ai-assistant" >}})** | Supports open-ended questions, reasoning, explanations, exploration, and content creation, with the option to enter bounded workflows. | Questions, writing, brainstorming, explanation, document analysis. |
| 3 | **[Context-aware support assistant]({{< ref "ai/var/02-ai-project-examples/cases/context-aware-support-assistant" >}})** | Helps users understand and diagnose issues using product knowledge, authorized account information, operational state, and support history. | Billing explanations, configuration diagnosis, account troubleshooting, escalation. |
| 4 | **[AI-assisted analysis and investigation systems]({{< ref "ai/var/02-ai-project-examples/cases/ai-assisted-analysis-and-investigation-systems" >}})** | Develops questions, evidence, claims, and contradictions into findings or a better understanding. | Audit preparation, due diligence, policy research, incident investigation. |
| 5 | **[Clinical and domain-specific work copilots]({{< ref "ai/var/02-ai-project-examples/cases/clinical-and-domain-specific-copilots" >}})** | Helps professionals develop or check work products under domain requirements. | Clinical notes, transcript translation, contract review, receipt classification. |
| 6 | **[Agentic operations and coordination systems]({{< ref "ai/var/02-ai-project-examples/cases/agentic-operations-and-coordination" >}})** | Pursues delegated objectives by selecting steps, using permitted tools, coordinating participants, and handling exceptions. | Scheduling, customer follow-up, recruiting, onboarding coordination. |
| 7 | **[Analytical engines and programmable environments]({{< ref "ai/var/02-ai-project-examples/cases/analytical-engines-and-programmable-environments" >}})** | Provides computational engines for predefined pipelines and environments where people or agents construct new analyses. | Forecasting, optimization, scenario planning, SQL or DSL analysis. |
| 8 | **[Coding agents and software engineering workspaces]({{< ref "ai/var/02-ai-project-examples/cases/coding-agents-and-harnesses" >}})** | Develops and revises software in repositories and executable environments, using execution feedback and verification to guide subsequent steps. | Repository-level coding agents, code review and test loops, delegated software changes. |

## Case summaries


These examples can overlap and coexist within one product.

### 1. [Closed-set task assistant]({{< ref "ai/var/02-ai-project-examples/cases/closed-set-task-assistant" >}})


Helps users complete a predefined set of tasks while application logic enforces permitted operations, valid inputs, permissions, and execution conditions. The LLM can interpret requests, collect missing information, and guide users through a state machine or constraint graph, providing conversational or hybrid interaction within enforced boundaries.

### 2. [General-purpose AI assistant]({{< ref "ai/var/02-ai-project-examples/cases/general-purpose-ai-assistant" >}})


Supports open-ended questions, explanations, reasoning, exploration, content creation, and problem-solving as users refine or change their goals. It can operate in a restricted exploratory mode and transition into bounded workflows when the user wants to perform a supported operation. The application preserves relevant context while separately controlling workflow state, available operations, and authorization.

### 3. [Context-aware support assistant]({{< ref "ai/var/02-ai-project-examples/cases/context-aware-support-assistant" >}})


Helps users understand and diagnose issues using product knowledge, authorized account information, current system state, and support history. In the proposed architecture, the assistant has read-only access to business systems; corrections are handed off to separate bounded workflows that enforce their own permissions and execution conditions. It remains a separate case for analysis.

### 4. [AI-assisted analysis and investigation systems]({{< ref "ai/var/02-ai-project-examples/cases/ai-assisted-analysis-and-investigation-systems" >}})


Helps people develop a supported understanding of complex information through predefined analyses, evolving investigations, and synthesis into findings or workpapers. Findings remain connected to evidence, calculations, assumptions, and unresolved questions, while experts review interpretations and decide which conclusions are justified.

### 5. [Clinical and domain-specific work copilots]({{< ref "ai/var/02-ai-project-examples/cases/clinical-and-domain-specific-copilots" >}})


Assists specialized professional work that depends on domain knowledge, rules, and judgment. The clinical example explores information interpretation, documentation, and defined checks, emphasizing preservation of domain meaning, professional review, acceptance for a specific purpose, and separately authorized changes to external records.

### 6. [Agentic operations and coordination systems]({{< ref "ai/var/02-ai-project-examples/cases/agentic-operations-and-coordination" >}})


Supports delegated objectives by selecting and adapting steps, using permitted tools, and managing dependencies across people, services, and time. Depending on scope, ongoing work may require durable state, human intervention, recovery, and verification of external outcomes; action selection and coordination are related capabilities that can coexist.

### 7. [Analytical engines and programmable environments]({{< ref "ai/var/02-ai-project-examples/cases/analytical-engines-and-programmable-environments" >}})


Provides computational capabilities for data processing, domain rules, forecasting, simulation, and optimization. Predefined pipelines can coexist with environments where people or agents construct analyses using SQL, DSLs, or code, with controlled execution and attention to correctness, provenance, reproducibility, assumptions, and uncertainty.

### 8. [Coding agents and software engineering workspaces]({{< ref "ai/var/02-ai-project-examples/cases/coding-agents-and-harnesses" >}})


Assists with or performs software engineering work by inspecting and modifying repositories, executing commands, and using tests and application behavior to guide revisions. A harness connects the model to tools, context, execution controls, and session state. The case also examines how specification, experimentation, feedback, review, and integration contribute to a delivered feature and maintainable system.

## Coexistence of the first two cases


A general-purpose assistant can provide restricted exploratory interaction and let users enter, suspend, resume, and exit bounded workflows. Relevant context and work in progress are preserved, while the application maintains workflow state and enforces execution boundaries. Moving between modes does not itself grant permission to perform an operation.

The closed-set task assistant emphasizes architectural guardrails for a predefined set of tasks. The general-purpose assistant emphasizes open-ended interaction and goals that can evolve. These approaches can coexist within one product.

## Related design concepts


[Operating regimes]({{< ref "ai/var/02-ai-project-examples/operating-regimes" >}}) examines how work progresses and is controlled through open-ended interaction, bounded workflows, investigation, collaborative artifact work, and delegated execution. These candidate regimes can coexist within a product, with relevant state preserved and permissions enforced when moving between them.

<a id="other"></a>

## Initial design model

### 1. The starting unit: an activity and its result


An activity is a meaningful piece of work with an intended result. Examples include explaining a charge, producing a reviewed translation, comparing scenarios, and completing a booking. A result can be an explanation, an artifact, a decision, or a confirmed change in a business system.

One customer goal can involve several activities. Understanding an unexpected charge and correcting that charge contribute to the same goal, but have different results and permissions.

An activity does not imply a separate service, model, agent, or screen. Those are implementation choices made after the work and its constraints are understood.

The main terms in this model are:

| Term           | Meaning                                                                                                                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Activity       | Work directed toward a meaningful result.                                                                                                                                                      |
| Capability     | An operation used to perform work, such as retrieval, calculation, explanation, validation, or a defined transaction. A capability may be provided by ordinary software, a model, or a person. |
| Workflow       | The relationships and progression between activities, including branches, repetition, waiting, and exceptions.                                                                                 |
| Product        | The application through which people perform or delegate the work. It may support several connected activities.                                                                                |
| Implementation | The components, tools, data stores, and services used to provide the capabilities and enforce the workflow.                                                                                    |

Open question: how should the product surface fit into this model?

<a id="initial-thought"></a>

### Initial product sketch


The initial sketch includes several possible AI products:

- A closed-set task assistant and a chatbot.
- A support assistant that provides information about the system and the user's account.
- Reporting and analytical support for auditors, producing preliminary reports with appropriate invariants, as in [[analysis-1]].
- A medical copilot that translates clients' transcripts and checks receipts.
- An agentic system that schedules meetings, uses tools, emails clients, or helps coordinate work.
- An analytical engine with complex rules, forecasting, and multiple pipelines that can support applications built on top of it. It may also provide SQL or DSL environments where agents can produce insights.
