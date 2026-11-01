---
draft: false
toc: true
title: "AI Production Readiness: Revised Definition (Draft)"
aliases:
  - "/ai-engineering/delivery/production-ready/ai-spec/"
description: "Adapts production readiness to AI systems, grounding contextual sufficiency in behavioral evidence, operational capability, lifecycle support, explicit uncertainty, and accepted residual risk."
linkTitle: "AI-Specific Definition"
---

Open questions:

- How should a production-readiness framework be adapted to a specific use case?
- Which concerns does AI add: LLM-specific behaviour, MLOps, data, NLP and dialogue, agents, and tools?
- How do these concerns affect the components of the readiness framework?

Areas to emphasize: evidence, evaluation, and distributions (methodology 1.3).

# [wip] input (to filter)

## Revised definition


> **AI production readiness is the state in which a defined AI-enabled system or change, its production environment, and the organization responsible for it are together sufficient for a specified production use, based on the available evidence and within explicitly defined limits of uncertainty and residual risk.**

The "defined AI-enabled system or change" may include:

- The model and exact model version
- Prompts, policies, and guardrails
- Training, evaluation, and runtime data
- Retrieval indexes and knowledge sources
- Agents, tools, and integrations
- Preprocessing and postprocessing components
- Deterministic business logic surrounding the model

These are part of defining the subject of the readiness claim. They do not need to become universal readiness dimensions.

## Changes from the earlier definition


The earlier definition was:

> An AI system is production-ready when its behavior is measurable, its failure modes are understood, its operating limits are explicit, and the organization can deploy, monitor, govern, and recover it safely.

Proposed revision: treat that as an **operational heuristic**, rather than the primary definition.

It had four structural limitations.

### 1. It centered the AI system too narrowly


The [production-readiness model]({{< ref "ai-engineering/delivery/production-ready/production-readiness-model" >}}) makes the readiness subject the combination of:

1. The system or change
2. Its production environment
3. The responsible organization

A model may perform well while its serving environment is unreliable, its data permissions are incorrect, or the operating team lacks the authority and tools to intervene. In that situation, the combined production setup is unready even though the model artifact may be technically adequate.

### 2. It presented contingent requirements as universal


"Failure modes are understood," "behavior is measurable," and "recover it safely" are generally useful, but their required strength depends on the use.

For example:

- A low-impact internal summarization feature may tolerate manual disabling and incomplete behavioral coverage.
- An automated credit-decision system may require extensive segmented evaluation, traceability, human appeal mechanisms, and strict deployment controls.
- A medical recommendation system may require fail-safe behavior and much stronger evidence.

The stable definition should therefore establish **contextual sufficiency**, while the framework determines what sufficiency requires in each case.

### 3. It did not explicitly include evidence


The statement that a system has monitoring, tests, backups, or rollback mechanisms does not establish the relevant capability.

The readiness notes distinguish:

- Tests are mechanisms; established behavior is an outcome.
- Metrics are mechanisms; operational understanding is a capability.
- Backups are mechanisms; recoverability within required limits is the intended result.
- Documentation is an artifact; the responsible team's ability to execute a procedure is the relevant capability.

The readiness claim therefore needs evidence that the required outcomes and capabilities have actually been established.

### 4. It underrepresented uncertainty and residual risk


AI systems introduce irreducible behavioral uncertainty. A readiness decision rarely proves that the system will behave correctly for every possible input.

The claim is closer to:

> Based on representative evaluations, operational testing, risk analysis, and available production evidence, the combined system is sufficiently capable for this use, subject to these known limitations and accepted residual risks.

That is more defensible than a binary claim that the AI is simply "safe," "reliable," or "ready."

## Where the original dimensions now belong


The earlier dimensions remain useful, but they belong below the definition:

|Layer|Purpose|Examples|
|---|---|---|
|Definition|Establishes the meaning and scope of readiness|Subject, production use, sufficiency, evidence, uncertainty, residual risk|
|Model|Determines what must be reasoned about|System, environment, organization, capabilities, outcomes, mechanisms, evidence|
|Framework|Derives and assesses requirements|Quality, reliability, safety, security, operability, cost, governance|
|Criteria|Defines context-specific acceptance conditions|Accuracy threshold, recovery time, latency SLO, escalation policy|
|Evidence|Supports the readiness decision|Evaluations, load tests, recovery exercises, threat models, incident simulations|
|Decision|Accepts, rejects, or conditionally approves production use|Go, no-go, limited rollout, accepted exceptions|

This prevents "observability," "testing," or "security" from being treated as self-validating checklist items.

## AI-specific interpretation of sufficiency


For an AI-enabled system, sufficiency usually requires reasoning about several categories.

### Intended behavior


Can the system perform the required task to the level needed for the specified use?

This can include:

- Task success
- Factual accuracy
- Groundedness
- Calibration and abstention
- Output-format correctness
- Performance across material user and data segments

### Bounded behavior


Are the system's operating limits known and appropriately controlled?

This includes:

- Unsupported inputs and use cases
- Model uncertainty
- Distribution shifts
- Adversarial inputs
- Unsafe actions
- Tool and permission boundaries

### Operational capability


Can the organization and system together detect, understand, control, mitigate, and recover from production problems?

For AI, this may require the ability to:

- Identify the affected model, prompt, index, tool, and configuration versions
- Disable an AI capability independently
- Switch model versions or providers
- Restrict tools or actions
- Roll back prompts, models, and retrieval indexes
- Correct harmful or corrupted state
- Route cases to human review

### Lifecycle capability


Can readiness be maintained as the system changes?

AI systems may change because of:

- Model replacement
- Fine-tuning
- Prompt changes
- Retrieval-content updates
- Data drift
- Provider-side model updates
- New tools or permissions
- Changes in user behavior

Each material change may alter the original readiness claim and require reassessment.

## Resulting formulation


Proposed normative definition:

> **AI production readiness is the state in which a defined AI-enabled system or change, its production environment, and the organization responsible for it are together sufficient for a specified production use, based on the available evidence and within explicitly defined limits of uncertainty and residual risk.**

Proposed interpretive statement:

> **Sufficiency is established by deriving context-specific required outcomes and capabilities, implementing mechanisms intended to provide them, producing credible evidence that those mechanisms are effective, and assigning responsibility for operating the system and accepting the remaining risk.**

For a custom-trained or self-hosted machine-learning model, this definition still holds. The derived criteria expand to cover training-data provenance, reproducibility, model artifact integrity, evaluation coverage, serving infrastructure, drift detection, retraining controls, model rollback, and ownership of the full model lifecycle.

## Library sources


- [Vinay 2025](/sources/ai-engineering/failures/vinay-2025-failure-modes-in-llm-systems.pdf.enc), *Failure Modes in LLM Systems* -- on *Lifecycle capability*
- [Chen et al. 2022](/sources/ml-engineering/books/chen-2022-reliable-machine-learning.pdf.enc), *Reliable Machine Learning*

Further reading:

- [Aryan 2025](/sources/ai-engineering/llmops/aryan-2025-llmops-managing-llms-in-production.pdf.enc), *LLMOps: Managing Large Language Models in Production*
- [Desale 2025](/sources/ai-engineering/llmops/desale-2025-concept-drift-in-llms.pdf.enc), *Concept Drift in Large Language Models: Adapting the Conversation* ([doi:10.1201/9781003595533](https://doi.org/10.1201/9781003595533))
- [Jeyaraman 2025](/sources/ai-engineering/llmops/jeyaraman-2025-llm-ops-for-finance.pdf.enc), *Large Language Models Ops for Finance* ([doi:10.1007/979-8-8688-1700-7](https://doi.org/10.1007/979-8-8688-1700-7))
