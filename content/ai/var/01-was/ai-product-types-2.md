---
draft: false
toc: true
description: "A concrete AI product description names the people, outcome, sources, responsibilities, permitted operations, checks, and recovery rules, using overlapping work archetypes to organize discovery."
title: "Ai Product Types 2"
linkTitle: "Ai Product Types 2"
---
# AI product types


Revised 2026-10-20.

Describe an AI product in two parts:

1. **Product archetype:** the work it primarily helps people do.
2. **Deployment profile:** the context, responsibilities, permitted actions, evidence, continuity, and integrations that particular implementation requires.

The seven archetypes below are a vocabulary for discovery and comparison. They overlap.

One product can contain several workflows and combine several archetypes. A bounded booking assistant can make consequential transactions; an investigation workspace can require extensive evidence handling while having no authority to change an external system.

## Seven product archetypes


| #   | Archetype                                        | Primary work and examples                                                                                                                                                                            | Defining design question                                                                                                |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | **Bounded workflow assistant**                   | Moves a request through known states toward a defined outcome. Examples: booking, account recovery, form submission, order-status routing.                                                           | Can permitted requests reach the correct state, including exceptions and handoffs?                                      |
| 2   | **General work assistant**                       | Helps people ask, draft, explain, compare, code, and explore across many tasks. The work may be a document, an analysis, or improved understanding.                                                  | Which intended tasks produce useful results, and can people evaluate and revise them?                                   |
| 3   | **Contextual support assistant**                 | Resolves an issue using product knowledge, the customer's actual state, and case history. Examples: billing explanations, configuration diagnosis, account support.                                  | Does the assistance fit this case, and can unresolved work transfer with enough context and a clear next owner?         |
| 4   | **Investigation and evidence-synthesis system**  | Develops questions, source material, claims, and contradictions into findings or a better understanding. Examples: audit preparation, due diligence, policy research, incident investigation.        | What supports each finding, what was examined, and what remains unresolved?                                             |
| 5   | **Domain work copilot**                          | Helps a professional develop or check an artifact under specialized requirements. Examples: clinical notes, translated transcripts, contract assessments, classified receipts.                       | Which domain properties must hold, and what can the responsible professional meaningfully inspect and change?           |
| 6   | **Delegated operations and coordination system** | Pursues a scoped goal by selecting steps, using tools, coordinating participants, and handling waits and exceptions. Examples: scheduling, onboarding coordination, customer follow-up, CRM updates. | Who chooses the next step, who may commit each effect, and how does work recover?                                       |
| 7   | **Analytical and decision system**               | Uses rules, calculations, forecasts, simulations, or optimization to support a defined decision. Examples: demand forecasting, resource allocation, scenario planning.                               | Does the analysis improve the decision against a meaningful baseline, under stated assumptions and changing conditions? |

For Type 7, specify which work benefits from AI. Calculations, constraints, and validation can use conventional software; an LLM, a pipeline for training models, or a reusable platform is a separate implementation choice.

### Where the archetypes overlap


These distinctions identify the main work to support:

- **Bounded workflow and delegated operations:** Type 1 defines the important states and transitions; Type 6 delegates selection of subsequent steps within a scope. Both can call APIs and perform consequential writes. A delegated process can invoke a bounded workflow.
- **General work and domain work:** Type 2 supports several kinds of work. Type 5 centers on an artifact with specialized requirements, error criteria, and professional judgment. A specialized prompt alone does not describe those requirements.
- **Contextual support and other assistance:** Type 3 centers on an issue, its history, and a resolution or handoff. It can use general explanation, a fixed refund workflow, and delegated follow-up.
- **Investigation and domain work:** Type 4 develops questions, evidence, and findings. Type 5 develops or checks a professional artifact. Contract review can involve both.
- **Investigation and analytical decisions:** Type 4 asks what the evidence supports and what remains unexamined. Type 7 asks what calculations, predictions, or scenarios imply for a decision. Numerical analysis can contribute to an investigation.

Choose a primary archetype by the workflow's intended outcome, then name the additional capabilities. Use several primary work descriptions when a product supports distinct workflows.

## Describe every deployment along the same dimensions


| Dimension | Decisions to record |
|---|---|
| **Work and outcome** | The people served, unit of work, intended benefit, and evidence of progress or completion. Work may be a transaction, artifact, investigation, continuing case, monitoring activity, or decision. |
| **Context and meaning** | Required sources and live systems; owners of definitions; permissions; freshness; source applicability and precedence; handling of missing or conflicting information. |
| **Collaboration** | Who supplies information, performs work, judges contributions, and holds authority. How participants inspect, correct, disagree, steer, interrupt, and hand off. |
| **Effects and autonomy** | For each operation, whether the system may read, propose, prepare, or execute; who selects the next step; the actor, resources, arguments, limits, and any required approval. |
| **Evidence and acceptance** | Required factual, behavioral, numerical, and domain properties; checks and their limits; evidence gaps; who can accept which result revision for which purpose and conditions. |
| **Continuity and recovery** | State that must survive sessions, waits, revisions, and failures; relationships between inputs, attempts, results, and effects; handling of stale results; cancellation, retries, and recovery ownership. |
| **Integration and reuse** | Systems, identities, interfaces, and operational owners involved; application-specific capabilities; shared code or services; support for other products where required. |

This profile is descriptive. Record unknowns as discovery work. Sensitivity follows the information and use; autonomy follows particular operations; integration effort follows the actual systems, state, and exceptions involved.

An ongoing monitoring activity needs useful progress and response criteria even when it has no final completion event. Learning or improved understanding can also be the intended outcome.

## Keep the important design distinctions explicit

### Interaction and responsibility


Conversation is one interaction channel. Show the work people need to inspect and change: document passages, evidence tables, assumptions, plans, calendars, or action previews.

Choose the collaboration pattern for the task: eliciting information, delegation, proposal and review, joint construction, shared reasoning, critique, coaching, or handoff. The pattern can change as work progresses.

Information, execution, judgment, and authority can belong to different participants. For example, a customer supplies facts, software performs an account check, a specialist judges an exception, and an authorized employee commits the change. Stored context alone does not establish that participants understand the case in the same way.

### Checks, acceptance, and authority


Keep six questions separate:

| Question | What to establish |
|---|---|
| **Intent** | The intended task, important terms, scope, and assumptions are understood. |
| **Validity** | Inputs, proposed operations, and state transitions satisfy the applicable rules. |
| **Execution** | What actually completed, failed, or has an uncertain outcome. |
| **Result quality** | Which required properties are supported by checks and evidence, with their limitations. |
| **Acceptance** | Whether this exact result revision is suitable for this purpose and these conditions. |
| **Authority** | Whether this actor may perform this concrete action on these resources with these arguments. |

A valid request can express the wrong intent. A completed operation can produce a poor result. Expert review can contain mistakes. Accepting a report for internal review does not authorize sending it elsewhere.

These distinctions guide design and records; they do not require six screens or approval for every operation. Review should have a defined purpose and give the reviewer enough information to judge. Existing delegation can authorize actions within its stated scope.

### Evidence


For work that depends on sources, distinguish:

- **Claim support:** the source revision and passage supporting a material claim.
- **Examination coverage:** the sources and questions examined, including ingestion failures, retrieval limits, and missing evidence.
- **Source conflict:** disagreement between sources, their applicability, and the policy used to resolve or preserve that disagreement.

A citation alone does not show that a claim follows from the source. A supported claim can coexist with incomplete coverage. Examining every document does not establish that every relevant fact was found. Define when to qualify a finding, return a partial result, or abstain.

### Continuity and recovery


Preserve the relationships between task revisions, source versions, execution attempts, result revisions, judgments, and external effects when they affect continued use.

Define what happens when a source changes, an older run finishes late, a person edits an accepted result, or a write times out. A new revision or purpose may require another check or acceptance decision.

Inspecting history, rerunning computation, and repeating an external action are different operations. For uncertain writes, establish what happened before retrying; define duplicate handling where supported. Cancellation stops further work within its scope and must account for effects already performed or still uncertain. Recovery may require reconciliation or compensation.

## Treat reuse as a separate design choice


**Assistant**, **agent**, and **platform** describe compatible aspects of a product:

| Description | What it tells us |
|---|---|
| **Assistant** | The system helps a person perform work or develop understanding. |
| **Agentic behavior** | The system selects subsequent actions within a delegated scope. Tool use can also occur inside a fixed workflow. |
| **Platform** | Capabilities are provided and supported for use by several applications or teams. |

Any archetype can use or provide reusable capabilities. Describe the form of reuse explicitly:

| Form | What is shared |
|---|---|
| **Library or SDK** | Code, types, validation, and integration conventions used inside applications. |
| **Shared service** | A capability operated centrally and called by several applications. |
| **Platform** | A supported collection of capabilities, interfaces, policies, and tools for building and operating several products. |

These forms can coexist. Candidate shared capabilities include identity, model access, source access, retrieval, tool execution, evaluation, tracing, and cost attribution.

Start with a concrete workflow and extract demonstrated common requirements. A logical capability does not need its own service. Retrieval is useful when the work needs external knowledge; a general agent runtime is useful when delegated action selection is required.

Keep ownership of business definitions, workflow rules, acceptance criteria, and action authority explicit. Domain rules can be shared when their meaning and ownership are shared. A model gateway alone cannot enforce every permission to access a source or perform an action; checks belong where the relevant access or effect occurs.

Include representative evaluation cases and necessary review in the first deployment. Shared evaluation infrastructure and a dedicated review console can follow when their reuse or operating needs justify them. The component sequence in the [reuse note]({{< ref "ai/var/reuse" >}}) is a candidate plan to adapt to the deployment.

## Use the taxonomy to make a product description concrete


1. **Name the work and outcome.** Identify the people served, the work they share with the system, and what useful progress looks like.
2. **Choose the primary archetype and additions.** Explain the combination through actual workflow responsibilities.
3. **Fill in the deployment profile.** Identify unresolved requirements and their owners.
4. **Turn requirements into observable checks.** For an important property, name a failure, the relevant check or constraint, its owner, and evidence that it works.
5. **Compare with a baseline.** Evaluate useful outcomes, review and correction effort, exception handling, and operating cost against the current process or a simpler alternative.

Estimate a defined deployment from this description. Include integration, data preparation, evaluation, review, recovery, and ongoing maintenance. Archetype numbers do not determine delivery effort or payback.

A reusable description:

> For **[people]**, the product supports **[work and outcome]**. Its primary archetype is **[archetype]**, with **[additional capabilities]**. It draws on **[sources and live state]**. **[Participants]** own information, execution, judgment, and authority. The system may **[specific operations and limits]**. Results require **[checks and acceptance conditions]**. Work persists and recovers through **[state and recovery rules]**, using **[integrations and reuse scope]**.

### Example: contract investigation


The primary work is investigation and evidence synthesis. A domain copilot helps the analyst inspect clauses and develop a review artifact.

- **Scope and context:** a defined contract collection, policy revision P1, owned definitions, and explicit evidence requirements.
- **Collaboration:** the analyst inspects source passages, challenges findings, changes assumptions, and resolves interpretations. The product preserves findings, contradictions, and examination gaps.
- **Effects:** the initial deployment reads sources and prepares findings. Any later publication or sending operation needs its applicable authority.
- **Acceptance:** finding F2 is accepted for a stated internal review under P1. The record identifies the exact result revision, supporting checks, purpose, and conditions.
- **Continuity:** a changed threshold or policy P2 triggers reconsideration of affected findings. An older run remains associated with its original inputs.
- **Reuse:** this can be one application using shared identity and retrieval services. That architecture choice does not change its primary work.

A useful evaluation checks both the findings and the collaboration: can the analyst detect plausible unsupported claims, understand evidence gaps, and revise the work without rebuilding the investigation?

## Earlier terminology


The following mapping preserves the original numbering. The previous four architectural levels are superseded by the deployment profile.

| # | Earlier label | Current label |
|---|---|---|
| 1 | Task-based assistant | Bounded workflow assistant |
| 2 | General chatbot | General work assistant |
| 3 | Context-aware support assistant | Contextual support assistant |
| 4 | Reporting and audit assistant | Investigation and evidence-synthesis system |
| 5 | Domain-specific copilot | Domain work copilot |
| 6 | Agentic operations assistant | Delegated operations and coordination system |
| 7 | Intelligent analytical engine / AI platform | Analytical and decision system; platform scope is described separately |

## Basis and related material


This note consolidates the [improvement proposal]({{< ref "ai/var/01-was/ai-product-types-improvement-proposal" >}}), the [practitioner guide]({{< ref "ai/var/practitioner-guide-seven-ai-product-types" >}}), and the [reuse note]({{< ref "ai/var/reuse" >}}). The proposal and guide retain references to the underlying design-research collection and its qualifications.

The taxonomy is a design aid with overlapping coverage. It is not an exhaustive or empirically validated classification. The practitioner guide develops the architecture, evaluation, launch, and estimation method.
