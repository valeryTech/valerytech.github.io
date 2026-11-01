---
draft: false
toc: true
title: "Design and Delivery Framework: Development Notes"
description: "Development notes for configuring the delivery framework around starting state, transformation intent, uncertainty, and risk, with particular attention to brownfield migration and legacy AI."
linkTitle: "Design and Delivery Framework: Development Notes"
---
# Build

## Reflection and Improvement

## Project Configurations Adaptation


Brownfield systems, legacy AI, modernization, and refactoring should be represented as **first-class project configurations**. Trying to enumerate every possible case would produce an unmanageable catalogue. A small number of orthogonal dimensions would handle the spectrum more effectively.

# Why This Framework Exists


AI products can be developed through different approaches. A team may use discovery-led development, experimentation, rapid prototyping, incremental delivery, platform development, or a combination of these approaches.

The recurring challenge is the absence of a shared structure for identifying uncertainty, choosing the appropriate work, making decisions, and determining whether there is sufficient evidence to proceed.

## Common Problems in AI Product Development

### Unclear opportunity


Teams may begin with a general intention to "use AI" without defining the user problem, business outcome, or product behavior that should improve.

As a result, they may pursue technically interesting capabilities that do not produce meaningful value.

### Uncertain capability and feasibility


AI behavior cannot always be specified or predicted in advance. Its usefulness may depend on the model, data, context, prompts, tools, system architecture, and quality requirements. Teams may not know:

- whether AI can perform the required task;
- which level of quality is achievable;
- where the system will fail;
- whether the result will be reliable enough for the intended use case.

### Undefined product and workflow change


Identifying a possible AI capability does not define the product solution. Teams may still need to determine:

- which part of the workflow should change;
- what the AI should do;
- what users or operators should continue to do;
- how outputs should be reviewed, corrected, or rejected;
- how the system should behave when the AI is uncertain or incorrect.

### Weak baselines and evaluation


Teams may experiment without a stable reference point, representative examples, explicit quality criteria, or repeatable evaluation.

This makes it difficult to determine whether a change improves the system, whether progress is meaningful, or whether the solution is ready for broader use.

### Planning that assumes predictable delivery


Traditional feature plans often assume that the required behavior is feasible and that implementation is primarily an execution problem.

In AI projects, feasibility and quality may remain uncertain until the team performs experiments, evaluates alternatives, and observes the system under realistic conditions.

Premature feature commitments can lead to unsupported promises, low-quality releases, missed dates, or extended exploration without clear decision points.

### Fragmented methods and artifacts


Teams may know many useful practices--product discovery, prototyping, evaluation, red teaming, system design, experimentation, and monitoring--but remain unsure:

- which method to use;
- when to use it;
- which question it should answer;
- what evidence it should produce;
- when enough work has been done.

Artifacts may consequently be created as documentation outputs rather than as instruments for making decisions.

### The pilot-to-production gap


A successful prototype does not establish that an AI product can be operated successfully.

Teams may validate basic capability without resolving:

- reliability;
- safety and governance;
- latency and cost;
- observability;
- failure handling;
- user adoption;
- operational ownership;
- continuous evaluation.

## What the Framework Must Provide


The framework should provide a minimum sufficient structure for resolving these problems, regardless of the development approach selected by the team.

At minimum, it should define:

- the important uncertainties and decisions in AI product development;
- the questions that need to be answered;
- the evidence required to support important decisions;
- the minimum artifacts needed to preserve and communicate that evidence;
- criteria for selecting appropriate methods and activities;
- criteria for proceeding, iterating, pivoting, pausing, or stopping;
- the relationships between product value, AI capability, system behavior, evaluation, risk, and operation.

The framework should make the reasoning behind the product traceable--from the original user or business problem through design decisions, capability assumptions, evaluations, implementation, and production controls.

## Supporting Guidance the Framework May Provide


The framework may also provide:

- a reference path through common areas of work;
- alternative paths for different project types;
- method descriptions and selection guides;
- examples and case studies;
- templates and checklists;
- suggested decision gates;
- risk-based guidance for determining the required depth of work;
- guidance for adapting the framework to different teams, technologies, and delivery models.

These supporting materials help teams apply the framework but are not themselves the framework's primary purpose.

## Main Goal


The main goal of this framework is to define the **minimum sufficient and adaptable set of decisions, evidence, artifacts, methods, and guidance required to identify, validate, design, deliver, and evolve an AI product**.

A successful application of the framework should allow a team to explain:

1. Which user or business problem is being addressed.
2. Why AI is an appropriate mechanism for addressing it.
3. Which product, workflow, or outcome is expected to improve.
4. What the AI system must be capable of doing.
5. Which limitations and failure modes must be accommodated.
6. How usefulness, quality, reliability, risk, and business value will be evaluated.
7. What evidence supports the decision to proceed.
8. How the system will be operated, monitored, and improved.

## Scope and Boundaries


The framework defines what should be understood, decided, validated, and communicated. It does not prescribe a single development lifecycle.

Teams may change the order, depth, methods, and artifacts according to:

- the type and maturity of the AI technology;
- the uncertainty of the opportunity and proposed solution;
- the reversibility and impact of incorrect outputs;
- product, business, legal, and safety risks;
- available evidence and existing systems;
- project size and organizational context.

Specific modes of work--such as experimentation, prototyping, baseline implementation, and incremental delivery--are described separately as **Approach Moments**. They can be introduced wherever their conditions apply.

## Typical Problems When Working with AI


AI initiatives often begin with an underspecified opportunity and limited understanding of the available capabilities. This creates three recurring problems:

- **Unclear improvement opportunities:** Teams may not know which parts of the product, workflow, or user experience would benefit most from AI.
- **Limited capability understanding:** Teams may not know what the AI can do reliably, where its limitations are, or which guarantees it can support.
- **Undefined workflow impact:** Teams may not know how AI should change a specific step, decision, interaction, or outcome within the current system.

These uncertainties should be resolved by connecting concrete user or business problems to specific AI capabilities, expected workflow changes, and measurable outcomes.

### Alternative formulation


AI product development introduces several recurring uncertainties:

- **Opportunity uncertainty:** Which parts of the product, workflow, or user experience would meaningfully benefit from AI?
- **Capability uncertainty:** What can the selected AI technology do reliably, where does it fail, and which guarantees can the product realistically provide?
- **Solution uncertainty:** How should AI change a specific workflow, interaction, decision, or outcome?
- **Validation uncertainty:** How will the team determine whether the proposed solution is useful, reliable, safe, and economically viable?

Without a structured way to resolve these uncertainties, teams may start with a technology rather than a problem, invest in low-value use cases, rely on unsupported assumptions about AI capabilities, or build solutions that cannot be evaluated or operated reliably.

# Reference map


The references below provide concrete examples and deeper treatments for the lifecycle and workstreams.

### Product framing


- [User-system interactions]({{< ref "ai/design/interactions/user-system-interactions" >}}) connects JTBD and UX research to journey maps, service blueprints, requirements engineering, system capabilities, and success criteria.
- [Context-to-task alignment]({{< ref "ai-engineering/context/retrieval/reframing" >}}) describes a task-first AI architecture built around the user's job, required context, tools, evidence, constraints, and verification signals.

### Evaluation, observability, and operation


- [Evaluation harness and platform]({{< ref "ai-engineering/evaluation/framework/harness-and-platform" >}}) separates controlled execution and evidence capture from comparison, analysis, and release decisions.
- [Production instrumentation]({{< ref "ai-engineering/evaluation/theoretical-methodology/framework/instrumentation-v1-2" >}}) defines the trace contract, sampling, retention, integrity checks, and phased adoption needed for comparable operational evidence.

# Core assessment


The framework already states the correct principles: teams may enter at different points, phases may be combined or revisited, migration is part of delivery, and activities should be configurable and composable. The difficulty is that these principles remain mostly declarative. The reference lifecycle still reads primarily as a greenfield path from problem framing to a newly built AI product.

Brownfield systems, legacy AI, modernization, and refactoring should be represented as **first-class project configurations**. Trying to enumerate every possible case would produce an unmanageable catalogue. A small number of orthogonal dimensions would handle the spectrum more effectively.

## 1. The missing concept: project entry configuration


The lifecycle needs an explicit mechanism for answering two questions before configuring the phases.

### Starting state


A project may begin with:

- no relevant system;
- an existing conventional software system;
- an existing AI-enabled system;
- a hybrid ecosystem containing APIs, services, rules, models, manual operations, and third-party products;
- several overlapping systems that must be consolidated.

### Transformation intent


The intended change may be:

- create;
- augment;
- integrate;
- refactor;
- replatform;
- replace;
- consolidate;
- retire.

These dimensions can be combined:

|Situation|Starting state|Transformation intent|
|---|---|---|
|Add AI capabilities to existing APIs|Existing software|Augment and integrate|
|Modernize a legacy AI application|Existing AI system|Refactor, replatform, or replace|
|Improve internal structure without changing behavior|Existing system|Refactor|
|Replace an old model while preserving the product|Existing AI system|Replace a component|
|Gradually move from rules to AI|Hybrid system|Augment and migrate|
|Remove an ineffective AI component|Existing AI system|Retire or replace|
|Consolidate multiple assistants|Multiple AI systems|Consolidate and replatform|

This approach fits the document's proposed modular or "Unix-way" structure: activities are selected and composed according to the project configuration rather than assigned to a single fixed lifecycle.

## 2. Where the current framework is too greenfield-oriented

### Product framing


The current framing focuses on the MVP, product promises, JTBDs, and business use cases. In an existing system, the team must also understand:

- what the current product already promises;
- which external contracts must remain stable;
- which behaviours users depend on, including undocumented ones;
- which operational guarantees already exist;
- which parts can change and which are invariants;
- whether the objective is a capability improvement, cost reduction, modernization, risk reduction, or architectural simplification.

A brownfield project often has two sets of requirements:

1. **Capability requirements:** what should improve.
2. **Preservation requirements:** what must not regress.

The second category is currently underdeveloped.

### Design


The design phase mentions classical system design and AI system design, but a brownfield project also requires three architectural views:

- **Current-state architecture:** what exists now.
- **Target architecture:** the desired stable state.
- **Transition architecture:** how the system operates while moving between the two.

The transition architecture is critical. It covers adapters, coexistence, duplicated components, temporary data flows, API versioning, synchronization, fallback routing, shadow execution, and cutover boundaries.

Without it, migration gets treated as delivery planning rather than as an architectural concern.

### Baseline and prototyping


The document correctly emphasizes a reproducible baseline and a narrow vertical slice. For existing systems, one baseline is insufficient.

The framework should distinguish:

- **Current-production baseline:** how the existing system behaves today.
- **Simple reference baseline:** a deterministic, manual, rules-based, or non-AI comparator.
- **Candidate-system baseline:** the first implementation of the proposed approach.

For legacy AI modernization, the current-production baseline may be difficult to reconstruct. There may be no evaluation dataset, model lineage, prompt versioning, trace history, or reproducible environment. Baseline reconstruction then becomes an explicit activity rather than an assumed input.

### Build and release


Migration currently appears primarily in "Plan delivery and migration," relatively late in the lifecycle. The table includes compatibility requirements, migration, rollout, rollback, and decommissioning, but these decisions influence framing, architecture, evaluation, and instrumentation much earlier.

Brownfield release patterns may include:

- strangler migration;
- component-by-component replacement;
- shadow execution;
- dual running;
- traffic splitting;
- canary rollout;
- read-only AI assistance before automated action;
- human-confirmed execution;
- adapter-based compatibility;
- tenant-by-tenant migration;
- reversible data migration;
- gradual decommissioning.

These are delivery patterns with corresponding evaluation and observability requirements, rather than implementation details selected near release.

### Operation and evolution


For an existing system, operations must cover the migration period as well as the final target state. During that period, teams may need to monitor:

- behavioural divergence between old and new systems;
- inconsistent decisions;
- reconciliation failures;
- duplicated cost;
- routing correctness;
- fallback frequency;
- user movement between implementations;
- remaining dependencies on the legacy system;
- readiness to decommission old components.

"Operation and Evolution" should therefore include **coexistence management** and **decommission evidence**.

## 3. Legacy AI requires a distinct modifier


An old-generation AI system introduces concerns beyond ordinary software modernization:

- model or vendor obsolescence;
- missing model, prompt, or data lineage;
- undocumented preprocessing and post-processing;
- behaviour encoded across prompts, rules, fine-tuning data, retrieval, and application code;
- stale embedding models or incompatible vector representations;
- hidden human review processes;
- evaluation based on anecdotes rather than reproducible cases;
- safety controls embedded in infrastructure that may be removed accidentally;
- production behaviour that cannot be reproduced offline;
- accumulated governance or compliance debt.

The lifecycle does not need a separate "legacy AI phase." It needs a **legacy-AI applicability modifier** that adds required activities to the normal phases.

For example:

|Phase|Legacy-AI additions|
|---|---|
|Framing|Identify retained capabilities, unacceptable legacy behaviour, and modernization objectives|
|Design|Inventory model, prompt, retrieval, tool, rule, data, and human-operation dependencies|
|Baseline|Reconstruct representative behaviour and production failure slices|
|Build|Introduce versioning, tracing, adapters, and reproducibility|
|Evaluation|Run comparative and non-regression evaluation|
|Release|Use shadow or dual-run migration where appropriate|
|Operation|Monitor divergence and remove legacy dependencies|
|Retirement|Preserve required records and verify that old components are no longer invoked|

## 4. Refactoring must remain independent from "adding AI"


The outer cycle correctly allows the selected response to be a process, policy, data, or existing-software change rather than an AI product.

The Project Loop should preserve this principle. A project may discover that:

- existing APIs must be stabilized before AI integration;
- data contracts require refactoring;
- observability must be established first;
- a deterministic workflow solves most of the problem;
- an existing AI component should be removed;
- the primary deliverable is architectural modernization, with AI as a later option.

Therefore, AI-specific activities should be conditional. System design, evaluation, migration, production readiness, and operations remain relevant, while model-behaviour design may be omitted when AI is not part of the selected increment.

## 5. Add a cross-cutting transformation workstream


A useful addition would be:

### Transformation, Migration, and Compatibility


This workstream would cover:

- current-system discovery;
- existing interface and behaviour contracts;
- transition architecture;
- backward and forward compatibility;
- data and state migration;
- coexistence;
- sequencing;
- rollout and rollback;
- dependency removal;
- decommissioning;
- technical-debt management.

Its progression through the lifecycle could be:

|Framing|Design|Implementation|Evaluation and release|Operation|
|---|---|---|---|---|
|Identify the starting state, transformation intent, invariants, and migration constraints|Define current, target, and transition architectures|Build seams, adapters, migration tooling, and compatibility controls|Verify parity, migration correctness, rollback, and cutover readiness|Monitor coexistence, remove dependencies, and verify decommissioning|

This belongs beside Evaluation and Evidence, Observability and Feedback, and Safety/Reliability/Governance. Migration affects all phases in the same way those concerns do.

## 6. Minimal artefacts for all configurations


Because the stated goal is a minimal set of artefacts, the framework should avoid creating a separate document for every concern.

A compact set could be:

### 1. Project and Change Brief


Contains:

- problem and intended outcome;
- starting state;
- transformation intent;
- role of AI;
- current and intended users;
- scope;
- existing constraints;
- capability improvements;
- behaviour and contracts that must be preserved;
- major uncertainties.

### 2. Architecture and Invariants Pack


Contains:

- current-state view;
- target-state view;
- transition-state view;
- important interfaces and data flows;
- product, system, safety, and operational invariants;
- compatibility strategy;
- principal architectural decisions.

These can be views in one maintained artefact rather than separate documents.

### 3. Baseline and Evaluation Pack


Contains:

- current production baseline, when applicable;
- reference baseline;
- representative and risk-relevant cases;
- comparison criteria;
- non-regression criteria;
- release thresholds;
- known evidence gaps.

### 4. Delivery, Migration, and Operations Plan


Contains:

- increments;
- ownership;
- dependency sequencing;
- rollout pattern;
- rollback mechanism;
- coexistence model;
- operational controls;
- decommissioning conditions.

This is smaller and more coherent than treating every listed output in the release table as an independent mandatory artefact.

## 7. Make activities configuration-aware


The "configurable and composable framework" section is directionally correct but needs an executable rule. Each activity should declare:

- **Purpose**
- **Applicability conditions**
- **Required inputs**
- **Expected outputs**
- **Completion evidence**
- **Dependencies**
- **Possible execution modes**
- **Project modifiers**

Example:

> **Reconstruct current-system baseline**
> Applies when an existing implementation influences the required behaviour, migration decision, or release comparison.
> Required for refactor, replacement, replatforming, and legacy-AI modernization.
> Optional for pure greenfield development.

This allows teams to assemble a lifecycle based on state and intent rather than merely being told that they may omit or combine phases.

## 8. Structural issues in the current draft


Several document-level issues should be resolved as the framework is revised:

- The reference phases list Phase 2, "Baseline and Prototyping," but the detailed structure does not consistently present it as a full phase.
- The build-and-release table starts with steps 8-11, while steps 1-7 are absent from this document.
- "Cross-Cutting Workstreams" appears more than once.
- "Data and Knowledge," "Data Foundation," and the unfinished "Data (plain) component" overlap.
- "Production Readiness," "Safety, reliability, and governance," "Security and Privacy," and "Operational Readiness" need clearer boundaries.
- Product and **Artefact** Framing and Product and **Artifact** Framing use inconsistent spelling.
- "Project Loop," "Project Design and Delivery Cycle," and "Reference Phases" appear to refer to overlapping structures; one canonical name would reduce ambiguity.
- Migration is described in detail during delivery but is underrepresented in framing and design.
- Placeholders such as `xxx`, `#todo`, question marks, and incomplete statements obscure which sections are normative and which are exploratory.
- The very long list of resulting artefacts conflicts with the explicit goal of defining a minimal artefact set.

## Recommended formulation


The central model should become:

> The framework is configured using the project's starting state, transformation intent, uncertainty, risk, and scale. These factors determine which activities are required, which may be omitted, the evidence expected, and the appropriate delivery and migration patterns.

That would make greenfield AI development one configuration among several, alongside brownfield augmentation, legacy-AI modernization, structural refactoring, replacement, consolidation, and retirement. The framework already contains most of the necessary components; it needs an explicit configuration mechanism and a lifecycle-wide treatment of transformation and migration.
