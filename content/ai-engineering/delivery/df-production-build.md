---
draft: false
toc: true
title: "Production Build, Evaluation, and Release"
description: "Specifies production build objectives, hardening activities, experiment questions, outputs, and readiness evidence, including conditions that require returning to implementation."
linkTitle: "Production Build, Evaluation, and Release"
---
## 5. Production Build (and Experimentation)

### Objective


Realize, integrate, and harden the system so that it can satisfy its requirements under production conditions.

### Purpose


The baseline establishes feasibility and evidence contracts. Production Build turns that baseline into a maintainable operating system with the reliability, security, performance, deployment, administration, and change mechanisms required for sustained use.

Experimentation remains a mode of work within this phase. It is used when reasoning and existing evidence cannot resolve a consequential design or product uncertainty at acceptable confidence.

### Inputs


- the validated vertical slice and baseline evidence;
- formal requirements, contracts, architecture, and design decisions;
- known limitations, unresolved risks, and experiment backlog;
- production environments, integration constraints, operating policies, and organizational responsibilities.

### Key decisions and activities


- implement production application, service, model, retrieval, tool, and orchestration components;
- build data and knowledge ingestion, transformation, indexing, validation, lineage, and refresh pipelines;
- implement security, privacy, authorization, policy, and audit controls;
- implement reliability mechanisms, validation, retries, degradation, fallbacks, recovery, and human escalation;
- optimize performance, capacity, cost, and model-routing behaviour within defined envelopes;
- establish configuration and secret management;
- build deployment infrastructure, CI/CD, environment promotion, release controls, and rollback mechanisms;
- create operational, administrative, and control-plane capabilities;
- establish versioning and change control for code, models, prompts, schemas, tools, policies, and data assets;
- maintain evaluation harnesses and regression suites as part of delivery;
- conduct experiments that resolve material product, architecture, model, data, interaction, or control uncertainties;
- update requirements and design records when evidence changes the system understanding.

### Typical experiment questions


- Does the capability improve the intended user outcome?
- Does retrieval, fine-tuning, prompting, or a deterministic method best satisfy the requirement?
- Which model meets the required quality-cost-latency envelope?
- Does the architecture support the expected workload and failure profile?
- Does a guardrail prevent the target failure without unacceptable side effects?
- Does the interaction design improve successful task completion and appropriate human control?

A decision should move from assumption to experiment when reasoning alone cannot resolve it at acceptable confidence and the decision materially affects value, risk, cost, or architecture.

### Outputs


- a production-capable, integrated system;
- production data and knowledge pipelines;
- implemented security, privacy, reliability, and governance controls;
- deployment, CI/CD, release, rollback, and administrative capabilities;
- validated performance, capacity, cost, and recovery behaviour;
- maintained evaluation and regression suites;
- experiment evidence and updated decision records;
- operating documentation, runbooks, ownership, and support procedures.

### Exit evidence


Proceed when the production candidate satisfies its build-time requirements; critical controls and failure paths are implemented; deployment and rollback are repeatable; observability and evaluation evidence are complete enough for release assessment; operational ownership is assigned; and unresolved risks are bounded and documented.

### Re-entry conditions


Revisit Production Build when evaluation finds implementation defects, model or retrieval regressions, unsafe failure behaviour, unacceptable cost or latency, incomplete operational controls, or changes that require a new production candidate.

## 6. Evaluation and Release

### Objective


Determine whether the product addresses the intended problem, conforms to its requirements, and can be released and operated within acceptable risk.

### Purpose


Evaluation supports a release decision rather than producing a single quality score. It assembles evidence across product effectiveness, behavioural performance, system properties, safety, security, operations, and organizational readiness. It must distinguish a system that satisfies its specification from a product that improves the intended practice.

See [Design Science Evaluation]({{< ref "ai-engineering/delivery/design-science-evaluation" >}}) for detailed evaluation guidance.

## Library sources


- [Johannesson and Perjons 2021](/sources/research-methods/design-science/johannesson-2021-introduction-to-design-science.pdf.enc), *An Introduction to Design Science* ([doi:10.1007/978-3-030-78132-3](https://doi.org/10.1007/978-3-030-78132-3))
