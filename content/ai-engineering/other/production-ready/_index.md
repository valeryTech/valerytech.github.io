---
draft: false
toc: true
title: "AI Production Readiness (Restored Copy)"
description: "A restored copy of the production-readiness notes as they were in the first commit, with a map of the notes in this folder and related notes in the vault and notes-acc."
linkTitle: "Production Readiness"
---
This folder is a copy of the production-readiness notes from the first commit of the vault (`1eba604`, 2026-11-01), when they lived at `ai-engineering/other/production-ready/`. The current version is in [AI Production Readiness]({{< ref "ai-engineering/delivery/production-ready" >}}), where `ai-spec.md` was later renamed to `ai-specific-definition.md` and `input/in-production-ready.md` was deleted.

## Versions checked


On 2026-11-16 the folder was compared across earlier snapshots of the notes and the git history. There are three versions:

- 2026-08-30 zip, 2026-09-28 folder, and 2026-09-28 zip: identical. The notes have no front matter and use first-person wording ("My previous definition was", "I would use your definition").
- 2026-11-01 zip and commit `1eba604`: identical, and the version in this folder. Compared with the September version, the text is reworded to neutral voice and front matter is added; no paragraphs were removed.
- 2026-11-14 zip and the current `ai-engineering/delivery/production-ready/`: identical. Commit `d5df3bd` shortened `background-and-definitions.md` from 13 KB to 10 KB, so the longer text is kept only in this folder.

`input/in-production-ready.md` is empty in every version. No other production-readiness note was found in the snapshots or in deleted files in git; other notes mention production readiness only in passing.

## Notes in this folder


Read [Building a Production Readiness Model and Framework]({{< ref "ai-engineering/other/production-ready/building" >}}) first. It explains why the model was needed and how the other notes fit together.

- [Building a Production Readiness Model and Framework]({{< ref "ai-engineering/other/production-ready/building" >}}) -- why common definitions of "production-ready" did not give operational criteria, and the plan to derive a model and a framework; includes sections on readiness that depends on the use case, architecture readiness, and observability designed for operation and intervention.
- Background and Review of Production-Readiness Definitions -- reviews definitions collected from engineers and the engineering community, separating outcomes, system properties, mechanisms, evidence, and organizational conditions.
- [Production Readiness Model]({{< ref "ai-engineering/other/production-ready/production-readiness-model" >}}) -- defines readiness as a defined system, its production environment, and the responsible organization being sufficient for a specified production use, based on evidence and within accepted residual risk.
- [Production Readiness Framework]({{< ref "ai-engineering/other/production-ready/production-readiness-framework" >}}) -- a draft that turns the model into practice: readiness profiles, requirements, evidence, lifecycle checkpoints, decisions, exceptions, and reassessment.
- [Use-Case-Specific AI Production Readiness]({{< ref "ai-engineering/other/production-ready/ai-spec" >}}) -- open questions on how AI changes the framework (LLM behavior, MLOps, data, dialogue, agents, and tools), with more weight on evidence, evaluation, and input distributions.

### Research inputs


- Production Readiness Research Inputs -- explains that the files in `input/` are source material and points to the model and the framework.
- Building a Production Readiness Model -- early notes on separating the model's purpose, capabilities, usage points, and expected outcomes; argues that common definitions lack operational criteria.
- Operationalising Production Readiness -- readiness as controls plus evidence: risk tiers, Google's production readiness review areas, lifecycle reviews, automated checks, launch authorization, post-launch validation, and exceptions.
- Adopting a Hybrid Production Readiness Framework -- a hybrid program with service context profiles, release gates, a maturity score, ownership roles, and metrics that show whether the readiness process works.
- in-production-ready -- an empty placeholder.

## Related notes in the vault

### AI delivery and product commitments


- [AI Product Delivery]({{< ref "ai-engineering/delivery" >}}) -- the delivery section that holds the current production-readiness folder.
- [AI Product Design and Delivery Framework]({{< ref "ai-engineering/delivery/design-and-delivery" >}}) -- a project lifecycle with readiness, observability, and adoption as continuous workstreams.
- [Design and Delivery Framework: Development Notes]({{< ref "ai-engineering/delivery/design-and-delivery-build" >}}) -- development notes on configuring that framework by starting state, uncertainty, and risk.
- [Production Build, Evaluation, and Release]({{< ref "ai-engineering/delivery/df-production-build" >}}) -- hardening activities, outputs, and the readiness evidence needed before release.
- [System Design in the Delivery Framework]({{< ref "ai-engineering/delivery/df-system-design" >}}) -- system-design artifacts, including operational ownership.
- [Platform Components and Reuse]({{< ref "ai-engineering/delivery/reuse" >}}) -- shared AI platform components, including an AI observability stack and audit and cost tracking.
- [Model Gateway: Overview and Financial Reference Designs]({{< ref "ai-engineering/delivery/patterns/model-gateway" >}}) -- gateway designs with sections on observability, auditability, and operational analytics.
- [Production Commitment: What Users Can Rely On]({{< ref "ai/product/operating-model/production-commitment" >}}) -- what a production promise includes, with limits, failure behavior, and ongoing responsibilities.
- [Solution Utility Ladder]({{< ref "ai/product/operating-model/solution-utility-ladder" >}}) -- separates the utility of a solution from its production readiness.

### Evaluation and evidence from production


- [AI Products Need Evals, Not Just Tests]({{< ref "ai-engineering/approach/evals-not-just-tests" >}}) -- safeguards, realistic cases, trace inspection, regression checks, and scoped release decisions.
- [Production Learning]({{< ref "ai-engineering/evaluation/framework/production-learning" >}}) -- sampling live behavior to test production commitments and find new situations.
- [Evaluating Product Behavior: Deferred Note]({{< ref "ai/product/operating-model/evaluation-and-production-learning" >}}) -- evaluating promised behavior as models, prompts, and architecture change.
- [RFC: AI Systems Framework Overview and Adoption (v1)]({{< ref "ai-engineering/evaluation/theoretical-methodology/framework/usage/rfc-v1-4" >}}) -- why standard observability misses silent LLM failures, and how shared evidence connects to release gates and incident response.
- [Change Detection v1.2: Production Discipline for LLM Systems]({{< ref "ai-engineering/evaluation/theoretical-methodology/framework/change-detection-v1-2" >}}) -- checking, comparing, and attributing a metric change before acting on it.
- [State Definition v1.1 for LLM and Agentic Systems]({{< ref "ai-engineering/evaluation/theoretical-methodology/framework/state-definition-v1-1" >}}) -- includes observability and missingness fields such as trace completeness rate.
- Lifecycle and Evidence Flow (doc_forge) -- readiness gates and a minimum diagnostic trace surface for a document-QA system.
- First-Tier Failures (doc_forge) -- trust defects and qualitative beta-release gates, with a section on launch-gate interpretation.

### Observability


- Observability and AI Evals: Terminology -- defines AI observability as the evidence and inspection layer of the evaluation system, separate from annotation and scoring.
- [Causal Stack Layer Notes (Restored Copy)]({{< ref "ai-engineering/other/causal-stack" >}}) -- four layer notes from the earlier causal stack, restored from the 2026-09-28 snapshot, with sections on observability as a feature of AI systems, as a system fault, and as a family of controls.
- [Evaluation v1 Notes on Observability (Restored Copy)]({{< ref "ai-engineering/other/evaluation" >}}) -- two early evaluation notes, restored from the 2026-08-30 snapshot, that define semantic observability and relate AI observability to evaluation through traces.

### General engineering


- [Operating Services]({{< ref "system-design/elements/operating-services" >}}) -- what each service needs in production: deployment, observability, security, and testing.
- [Containing Failure in Distributed Systems]({{< ref "system-design/elements/containing-failure" >}}) -- timeouts, retries, circuit breakers, load shedding, and degraded operation.
- [Engineering Delivery Techniques Guide]({{< ref "engineering/delivery-techniques/engineering-delivery-techniques-guide" >}}) -- delivery techniques by uncertainty and lifecycle stage, including dark launch.
- [Earlier Test Strategy Notes]({{< ref "engineering/topics/tests/tests" >}}) -- test strategy, with a section on operational readiness prerequisites.
- Production AI Engineering: Questions and Perspectives -- archived drafts, including the question of what production readiness means to a company.

## Related notes in notes-acc


- Shipping to Production -- a guidebook chapter on shipping processes, verification layers, monitoring and incident management, and choosing how much risk to take.
- Engineering Standards Setup -- a chat on setting up engineering standards and governance, with production readiness as one part.
- Live-Data Prototypes vs. Production -- the difference between a live-data prototype and a production product.
- Partnership Evals -- consulting notes that list production readiness among the questions AI teams struggle to standardize.
- Observability, Metrics, and Performance -- a paper list on distributed tracing, time-series monitoring, and latency.

### Hamel Husain on observability and production evals


- Observability in LLM Applications -- office-hours notes on observability in complex LLM systems.
- Case Study: Putting Evals Into Production
- How are evaluations used differently in CI/CD vs. monitoring production?
- How often should I re-run error analysis on my production system?
- What is a trace?
- How can I efficiently sample production traces for review?
