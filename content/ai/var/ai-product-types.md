---
draft: false
toc: true
title: "Ai Product Types"
linkTitle: "Ai Product Types"
---
# Seven AI product archetypes


Revised 2026-10-18. This note defines a practical vocabulary for product discovery and comparison. The [practitioner guide]({{< ref "ai/var/practitioner-guide-seven-ai-product-types" >}}) develops the design, evaluation, and estimation method.

AI products combine different kinds of work, context, collaboration, and authority. The seven archetypes below describe common product purposes. Their numbering preserves the original classification; it does not rank sophistication, cost, autonomy, or risk.

Describe a product in two parts: **the work it primarily supports** and **the requirements of its particular deployment**. A bounded booking assistant can execute consequential transactions. An investigation workspace can require complex evidence handling while having no authority to change an external system.

## Seven product archetypes


| # | Archetype | Primary work | Examples |
|---|---|---|---|
| 1 | **Bounded workflow assistant** | Moves a request through a known set of states toward a defined outcome. | Booking, account recovery, form completion, order-status routing. |
| 2 | **General work assistant** | Helps people ask, draft, explain, compare, and explore across many tasks. | Writing, summarization, coding assistance, brainstorming, document analysis. |
| 3 | **Contextual support assistant** | Resolves an issue using product knowledge, the customer's actual state, and case history. | Billing explanations, configuration diagnosis, account support, escalation. |
| 4 | **Investigation and evidence-synthesis system** | Develops questions, evidence, claims, and contradictions into findings or a better understanding. | Audit preparation, due diligence, policy research, incident investigation. |
| 5 | **Domain work copilot** | Helps a professional develop or check an artifact under domain requirements. | Clinical notes, transcript translation, contract review, receipt classification. |
| 6 | **Delegated operations and coordination system** | Pursues a bounded goal by selecting steps, using tools, coordinating participants, and handling exceptions. | Scheduling, customer follow-up, CRM updates, onboarding coordination. |
| 7 | **Analytical and decision system** | Uses rules, calculations, forecasts, simulations, or optimization to support a defined decision. | Demand forecasting, risk analysis, resource allocation, scenario planning. |

These archetypes overlap. A support product might combine issue diagnosis, a fixed refund workflow, and delegated follow-up. An audit product might combine evidence synthesis, a domain copilot, and numerical analysis.

Use the archetype to communicate the primary purpose, then name the additional capabilities. Classify the deployed workflow rather than assigning one permanent label to a vendor's entire product.

## Describe the deployment along the same dimensions


| Dimension | Questions to answer |
|---|---|
| **Work and outcome** | What is the unit of work: transaction, document, investigation, case, ongoing monitoring activity, or decision? What counts as progress and completion? |
| **Context and meaning** | Which sources and live systems matter? Who owns business definitions, permissions, freshness, and source precedence? |
| **Collaboration** | Who supplies information, performs work, judges contributions, and holds authority? How can participants inspect, disagree, steer, and hand off? |
| **Effects and autonomy** | Which actions are read-only, proposed, prepared, or executed? Under whose authority, with what limits and consequences? |
| **Evidence and acceptance** | Which factual, behavioral, and domain properties must hold? What checks support acceptance of a particular result for a particular purpose? |
| **Continuity and recovery** | What must survive sessions, waits, source changes, interruptions, and failures? What becomes stale, and how can work resume? |
| **Integration and reuse** | Which systems must coordinate? Is this one application, a shared service, or a platform supporting several products? |

This is a descriptive profile, not a score. Data sensitivity follows the information and use. Autonomy follows particular actions. Integration effort follows the actual systems, state, and exceptions involved.

For example, a contract-review workspace could be described as:

> Investigation and evidence synthesis with a domain copilot; a versioned contract corpus and policy definitions; analyst steering and review; no external writes; passage-level support and explicit evidence gaps; results reconsidered after policy changes; one application using shared retrieval and identity services.

That description is more useful for design and estimation than calling the product an advanced chatbot.

## Distinctions that matter in design


**Conversation is an interaction channel.** A product may combine language with document editing, evidence tables, charts, calendars, filters, and action previews. The useful interface follows the work people need to inspect and change.

**Collaboration describes how responsibility is allocated.** A person can delegate a task, review a proposal, construct an artifact jointly, develop a hypothesis, or receive critique. These patterns can occur in any archetype. Better understanding or learning can be the intended outcome, even when no external task is completed.

**Tool use and delegated execution need separate descriptions.** A fixed workflow can call APIs. A system behaves more agentically when it selects subsequent actions within a delegated scope. Either can have narrow or consequential permissions.

**Checks, acceptance, and authority answer different questions.** A valid request can express the wrong intent. Successful execution can produce an unsupported result. A person can accept a result for internal use without authorizing its publication. Record the relevant result revision, purpose, and concrete action separately.

**A platform is a reuse scope.** Retrieval, workflow execution, evaluation, identity, or analytical capabilities can serve several applications. Type 7 can also be one small decision application. Reuse should follow demonstrated common requirements.

## Research basis


This synthesis draws on the design-research collection's work-complexity profile, responsibility allocation, sensemaking discussion, and verification and acceptance distinctions. The collection contains design proposals and exploratory discussions; this taxonomy is a design aid, not an empirically validated classification.

## Earlier terminology


The earlier classification used the following labels. The revised archetypes above separate product purpose from deployment requirements more clearly.

## Seven types of AI products


|Type|Description|Example|
|---|---|---|
|1. Task-based assistant|Handles a closed set of predefined tasks with limited inputs and outputs.|Booking assistant, FAQ flows, form completion|
|2. General chatbot|Supports open-ended conversations, questions, and explanations.|ChatGPT-style conversational interface|
|3. Context-aware support assistant|Understands a specific system, its documentation, and the user's account or current state.|SaaS support assistant that explains billing, settings, or errors|
|4. Reporting and audit assistant|Retrieves structured data, generates reports, analyzes records, and provides supporting evidence.|Compliance reporting, financial reconciliation, audit preparation|
|5. Domain-specific copilot|Performs specialized professional tasks using domain knowledge, documents, and validation rules.|Medical transcript translation, receipt verification, clinical documentation|
|6. Agentic operations assistant|Uses external tools and executes multi-step workflows, often across applications.|Scheduling meetings, emailing clients, coordinating tasks, updating CRM|
|7. Intelligent analytical engine / AI platform|Combines complex rules, analytical models, forecasting, data pipelines, and orchestration. Can power multiple applications.|Forecasting systems, decision engines, risk platforms, operational optimization|

## One important distinction


These aren't necessarily seven sequential levels of sophistication.

The earlier classification combines several dimensions:

- Interaction: Closed workflows versus open-ended conversations.
- Context: Generic knowledge versus knowledge of a system, account, or specialized domain.
- Capabilities: Answering, extracting, reporting, predicting, or performing actions.
- Autonomy: Providing information, recommending actions, or executing them.
- Architecture: Standalone assistants versus reusable engines that power multiple applications.

For example, a medical copilot could also be an agentic assistant. An audit reporting product could use a complex analytical engine. And a forecasting platform might expose a chatbot while most of its value comes from the underlying pipelines.

## A simpler architecture-level classification


Level 1 -- Conversational AI

Chatbots and predefined task assistants

Level 2 -- Contextual AI

Support, reporting, and specialized domain copilots

Level 3 -- Action-oriented AI

Tool use, workflow execution, and coordination

Level 4 -- AI-powered systems and platforms

Complex reasoning, forecasting, orchestration, reusable pipelines, and application APIs

These four levels describe increasing system integration and architectural scope, although individual products can combine features from multiple levels.

The most significant distinction is between an AI assistant, an AI agent, and an AI-powered software platform.

An assistant primarily helps a person complete work. An agent can execute work through tools. A platform exposes reusable capabilities, models, rules, and pipelines that other applications can build on.

For architecture, development effort, and pricing comparisons, all seven types can be evaluated along common dimensions: integration depth, data complexity, reasoning requirements, autonomy, reliability, and infrastructure.
