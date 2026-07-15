---
draft: false
toc: true
title: "Production Readiness Model"
linkTitle: "Production Readiness Model"
---
## A context-bound reasoning structure for defining and assessing production readiness

## 1. Introduction


Production readiness is frequently represented as a list of desirable system properties or engineering practices. Common definitions refer to reliability, testing, observability, security, scalability, documentation, rollback, and operational ownership.

Each of these concerns may be relevant. Their relevance, required level, implementation, and validation depend on the intended production use.

A public payment platform, an internal reporting tool, a scheduled data pipeline, and an experimental AI-assisted workflow require different levels of availability, recovery, security, human oversight, performance, auditability, and operational support. Applying an identical checklist to each system produces either insufficient assurance or unnecessary process.

The principal weakness in common production-readiness definitions is therefore the absence of an operational derivation and decision method. They identify properties that may matter, while leaving several questions unresolved:

- What does the system need to achieve in production?
- Which properties are required for this use?
- How should those properties be operationally defined?
- Which technical and organizational capabilities are necessary?
- What evidence is sufficient?
- How should known gaps and uncertainty be treated?
- Who has authority to make the readiness decision?
- When does a previous decision cease to be valid?

This document defines a production-readiness model intended to answer those questions.

The model provides:

1. a stable conceptual definition of production readiness;
2. a method for deriving readiness requirements from production context;
3. a structure for connecting claims, controls, evidence, organizational capabilities, and decisions;
4. a basis for determining whether a scoped readiness claim is sufficiently justified.

The model includes the **operationalization of production readiness as a concept**: it translates abstract terms such as _fit_, _safe_, _reliable_, and _sufficient_ into context-specific claims, requirements, thresholds, evidence expectations, and decision conditions.

It does not define how an organization must introduce or administer readiness work. Lifecycle integration, roles, review forums, mandatory gates, templates, tooling, exception workflows, adoption, and effectiveness measures belong to the [production-readiness framework]({{< ref "ai-engineering/other/production-ready/production-readiness-framework" >}}).

The model is designed to support both system construction and readiness assessment. A framework can apply it during product definition, architecture, implementation, validation, release, operation, and subsequent change.

## 2. Purpose of the model


The production-readiness model has three primary functions.

### 2.1 Build for readiness


The model helps teams determine what must be designed, implemented, validated, and operationalized before a system enters production.

It answers:

```text
What must the system provide in production?
Which properties must the architecture support?
Which technical and operational controls are required?
What evidence must be produced?
Who will own, operate, and support each capability?
```


Teams work backwards from the intended production use and its consequences of failure. Readiness work therefore begins during product and system definition rather than at the release boundary.

### 2.2 Assess readiness


The model provides a structured method for determining whether a system, feature, release, migration, model, or significant change is ready for a specified production use.

It answers:

```text
What was required?
What has been implemented?
What evidence supports the relevant claims?
What negative or contradictory evidence exists?
Which defects, uncertainties, risks, or gaps remain?
Who has authority to accept the residual risk?
```


The assessment compares the implemented system and available organizational capabilities with the requirements derived for its production context.

The result is a scoped and justified decision rather than a general declaration that a system is "production-ready."

### 2.3 Reassess readiness


A readiness conclusion must be revisited when its context, evidence, assumptions, or validity conditions materially change.

Incidents, near misses, support cases, unexpected costs, control failures, user feedback, dependency changes, and changes in production use can reveal incorrect assumptions or incomplete requirements.

Applying the model again may update:

- the production context;
- readiness claims;
- risk scenarios;
- requirements;
- controls;
- validation methods;
- acceptance criteria;
- operating procedures;
- reassessment conditions.

The model therefore supports a reasoning loop:

```text
Define context → derive → build → validate → decide → observe change → reassess
```


The framework determines where this loop occurs in the engineering lifecycle, who performs it, and which events require reassessment.

## 3. Model and framework boundary


The production-readiness model and production-readiness framework are related but distinct.

| Concern | Production-readiness model | Production-readiness framework |
| --- | --- | --- |
| Primary purpose | Explain and structure readiness reasoning | Make readiness work repeatable in an organization |
| Primary question | What must be true, and what justifies the readiness claim? | Who applies the model, when, through which workflow and controls? |
| Stable contents | Definition, concepts, relationships, derivation logic, dimensions, decision logic | Roles, lifecycle touchpoints, tiers, gates, artifacts, review paths, tooling, metrics |
| Context-specific outputs | Readiness claims, requirements, controls, evidence expectations, residual-risk statement | Completed profiles, review records, approvals, exceptions, reassessment tasks, adoption data |
| Type of operationalization | Operationalizes abstract readiness properties into assessable criteria | Operationalizes use of the model in day-to-day engineering work |

The boundary is not between theory and practice. The model is practical because it produces assessable criteria and a justified decision structure. The framework is organizational because it makes the use of that model consistent, proportionate, governed, and sustainable.

The model can exist independently of a particular workflow. Multiple organizations can use the same model through different frameworks, and one organization can adapt its framework without changing the model's core semantics.

# Part I -- Conceptual Model

## 4. Definition of production readiness


**Production readiness is the justified, context-bound claim that a defined system or change is fit for a specified production use, and that the responsible organization can introduce, operate, support, recover, maintain, and evolve it while keeping outcomes, costs, and residual risks within accepted bounds.**

This definition establishes the stable meaning of production readiness across different systems and organizations.

It deliberately leaves the required architectural characteristics, controls, evidence, operating procedures, and acceptance thresholds to be derived from the production context.

## 5. Properties of readiness

### 5.1 Readiness is contextual


Terms such as _fit_, _acceptable_, _sufficient_, and _safe_ can only be resolved within a defined production context.

The required level of readiness depends on factors including:

- intended users;
- supported workflows;
- business and user outcomes;
- production environment;
- exposure;
- scale;
- system criticality;
- data sensitivity;
- regulatory obligations;
- failure consequences;
- reversibility;
- system lifetime;
- rate of change;
- operating model.

The model therefore derives requirements from context rather than imposing identical requirements on every system.

Context includes supported conditions and explicit exclusions. A system may be ready for one user cohort, workload, operating region, or workflow while remaining unready for another.

### 5.2 Readiness is socio-technical


The unit of assessment includes the system and the organization responsible for it.

Depending on scope, it may include:

- application code;
- infrastructure;
- configuration;
- data;
- machine-learning models;
- external services;
- deployment mechanisms;
- operational procedures;
- monitoring and control systems;
- support processes;
- responsible teams;
- access rights;
- decision authority.

A technically sound application may remain unready when the responsible organization lacks the capability to diagnose, control, recover, support, or maintain it.

Likewise, an operational process cannot compensate indefinitely for missing system capabilities when the process depends on unavailable information, unsafe manual intervention, or specialist knowledge held by a small number of individuals.

### 5.3 Readiness is claim-based


Production readiness consists of explicit claims concerning the system and its operating environment.

Examples include:

- required user workflows function correctly;
- the system can sustain the expected workload;
- unauthorized access is sufficiently constrained;
- a release can be introduced without unacceptable disruption;
- material failures will be detected within the required time;
- operators can contain identified failure modes;
- required service can be restored within defined recovery objectives;
- the responsible team can support the system during the authorized operating period;
- system costs remain within the accepted operating envelope.

Explicit claims make it possible to examine:

- what must be true;
- why it matters;
- under which conditions it must hold;
- how it is produced or preserved;
- how it is validated;
- what evidence is available;
- what would invalidate the claim;
- who decides whether the evidence is sufficient.

### 5.4 Readiness is evidence-supported


Readiness requires justified confidence.

For each material claim, the model distinguishes among:

```text
What must be true
Why it must be true
How the condition is produced or preserved
How the condition is validated
What evidence is available
What uncertainty remains
Who decides whether the evidence is sufficient
```


The existence of a mechanism does not independently establish the corresponding property.

```text
Tests exist
≠ required behavior has been established

Metrics exist
≠ operators can understand system state

Backups exist
≠ the system can be recovered

Rollback functionality exists
≠ a release can be reversed safely

Documentation exists
≠ the responsible team can execute the documented procedure

Access controls exist
≠ unauthorized access is sufficiently constrained
```


Evidence should therefore be evaluated for relevance, coverage, credibility, recency, and applicability to the intended operating conditions.

### 5.5 Readiness includes negative evidence and uncertainty


A readiness assessment must capture more than positive checks.

Relevant negative or incomplete evidence includes:

- known defects;
- failed tests;
- contradictory evaluation results;
- unresolved incidents;
- unavailable evidence;
- untested assumptions;
- unvalidated dependencies;
- conditions outside the evaluation envelope;
- incomplete operational procedures;
- unknown saturation points;
- uncertain recovery behavior;
- missing ownership;
- evidence derived from unrealistic conditions.

A system does not become ready through the accumulation of positive evidence alone. The decision must account for unresolved gaps, uncertainty, and evidence that weakens relevant claims.

### 5.6 Readiness accepts bounded residual risk


Production systems retain defects, uncertainty, dependency risk, operational risk, and unknown failure modes.

A readiness decision requires that:

- material risks and failure consequences have been considered;
- known gaps, assumptions, and uncertainty are visible;
- implemented and compensating controls are understood;
- applicable operating conditions are explicit;
- residual risk falls within the authorized tolerance;
- an authorized owner accepts that residual risk.

Risk acceptance is part of the decision record. It does not replace engineering work, validation, or evidence.

### 5.7 Readiness has validity conditions


A readiness decision is valid only while its material assumptions and operating conditions continue to hold.

The decision may require reassessment when there is a material change in:

- intended users or workflows;
- production scale;
- architecture;
- dependencies;
- data characteristics;
- model behavior;
- threat model;
- regulatory obligations;
- operating environment;
- system ownership;
- support arrangements;
- failure consequences;
- available evidence.

Readiness should therefore be treated as a condition-bound decision rather than a permanent system attribute.

## 6. Relationship to adjacent concepts


Production readiness overlaps with several engineering and delivery concepts. Each concept answers a different question.

| Concept                   | Primary question                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Well-designed**         | Does the design address the requirements, constraints, architectural characteristics, and material risks selected for its purpose? |
| **Architecture-ready**    | Does the design and implementation adequately address the selected technical requirements and risks?                               |
| **Deployable**            | Can the artifact be installed or activated in the target environment?                                                              |
| **Releasable**            | Have the defined release gates been satisfied?                                                                                     |
| **Released**              | Has production exposure been authorized?                                                                                           |
| **In production**         | Is the system currently receiving production use?                                                                                  |
| **Production-ready**      | Is the scoped production-fitness claim sufficiently justified?                                                                     |
| **Operationally healthy** | Is the system currently meeting its production promises?                                                                           |

Architecture readiness is a necessary component of production readiness.

**Architecture readiness is the justified claim that the system's design and implementation adequately address the functional requirements, architectural characteristics, constraints, and material technical risks selected for its intended use.**

Production readiness has a broader scope. It also requires:

- sufficient validation;
- credible evidence;
- deployment safety;
- operational capability;
- support arrangements;
- recovery capability;
- explicit ownership;
- accepted residual risk.

A system can have an appropriate architecture and remain unready because operators cannot diagnose failures, recovery procedures are untested, evidence is weak, rollout controls are absent, or ownership is unclear.

# [WIP] Part II -- Proposed Model Architecture

## 7. Two-layer structure


The readiness model contains two connected layers.

| Layer                 | Purpose                                                     | Primary question                           | Main outputs                                                                |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| **Conceptual layer**  | Establish stable semantics                                  | What does readiness mean?                  | Definition, properties, boundaries, principles                              |
| **Derivation layer**  | Translate context into requirements                         | What must be true for this production use? | Claims, requirements, risks, controls, capability and evidence expectations |

Application is intentionally excluded from the model architecture. It is the subject of the production-readiness framework.

### 7.1 Conceptual layer


The conceptual layer defines the stable meaning of readiness.

It establishes that readiness is:

- scoped to a defined production use;
- expressed through claims;
- supported by evidence;
- inclusive of organizational capability;
- subject to residual-risk acceptance;
- valid under specified conditions.

This layer should remain stable across technologies and system types.

### 7.2 Derivation layer


The derivation layer converts the abstract definition into requirements for a specific production use.

It connects:

- intended use;
- production promises;
- risks and failure consequences;
- readiness claims;
- requirements;
- controls;
- organizational capabilities;
- validation methods;
- evidence;
- residual risk;
- decisions.

This layer is the core of the model.

### 7.3 Framework interface


The [production-readiness framework]({{< ref "ai-engineering/other/production-ready/production-readiness-framework" >}}) specifies how the model integrates into normal engineering work.

It defines:

- when readiness reasoning begins;
- which artifacts are produced;
- how rigor is tailored;
- how assessments are conducted;
- how decisions are recorded;
- when reassessment is required;
- how operational learning triggers reassessment or refinement.

These choices can vary by organization without changing the model's definition, semantic categories, or derivation logic.

# Readiness Dimensions


**Readiness dimensions** describe whether the system and responsible organization have sufficiently implemented, validated, operationalized, and governed the required properties for a specific production use. The readiness model already establishes architecture readiness as one necessary component of the broader production-readiness decision.

Several commonly listed production-readiness properties can be grouped into broader readiness dimensions.

## 1. Validation readiness


Abstracts properties such as:

- testing completeness;
- performance testing;
- security testing;
- integration testing;
- acceptance testing;
- production-like environment validation.

**Definition:** Evidence is sufficient to support confidence that the system will behave as intended under expected and relevant adverse conditions.

This keeps the model focused on the adequacy of evidence rather than prescribing a universal test catalog.

## 2. Delivery readiness


Abstracts properties such as:

- build reproducibility;
- release automation;
- deployment safety;
- rollback support;
- configuration management;
- database migration safety;
- artifact integrity.

**Definition:** The system can be released, configured, deployed, changed, and reverted with controlled operational risk.

## 3. Operational readiness


Abstracts properties such as:

- observability implementation;
- alerting;
- runbooks;
- support procedures;
- operational tooling;
- capacity management;
- routine maintenance.

**Definition:** The system can be operated effectively in its intended production environment.

Observability may appear here rather than under architecture readiness when the concern is operational usability rather than system design.

## 4. Resilience and recovery readiness


Abstracts properties such as:

- backup and restore;
- disaster recovery;
- failover;
- incident recovery;
- data reconciliation;
- recovery time and recovery point objectives;
- degraded-mode operation.

**Definition:** The system can tolerate, contain, and recover from relevant failures within accepted limits.

This could also be part of operational readiness, but it may deserve separate treatment where continuity is material.

## 5. Governance readiness


Abstracts properties such as:

- ownership;
- approval;
- accountability;
- documentation;
- change control;
- policy compliance;
- risk acceptance;
- exception management.

**Definition:** Responsibility, authority, decision rights, and required approvals are established for production operation.

This dimension concerns the governance conditions required for the assessed system or change. Governance of the readiness practice itself--for example, standard review forums, escalation paths, and exception workflows--belongs to the framework.

## 6. Support readiness


Abstracts properties such as:

- service ownership;
- on-call coverage;
- escalation paths;
- support hours;
- incident roles;
- dependency contacts;
- knowledge transfer.

**Definition:** Appropriate people and processes are available to support the system throughout its intended operating period.

This may be merged into governance or operational readiness in a smaller model.

## 7. Dependency readiness


Abstracts properties such as:

- upstream and downstream compatibility;
- third-party service readiness;
- contract stability;
- dependency capacity;
- vendor support;
- fallback arrangements;
- external approval dependencies.

**Definition:** Material dependencies are sufficiently understood, available, compatible, and supported for the intended production use.

## 8. Data readiness


Abstracts properties such as:

- data quality;
- migration completeness;
- retention;
- classification;
- lineage;
- privacy handling;
- reconciliation;
- reference-data availability.

**Definition:** Required production data is available, valid, governed, and handled according to applicable requirements.

Data readiness is especially useful when data concerns would otherwise be scattered across architecture, security, compliance, and deployment.

## 9. Security and compliance readiness


Abstracts properties such as:

- access control;
- vulnerability management;
- secrets management;
- privacy;
- auditability;
- regulatory controls;
- threat mitigation.

**Definition:** Applicable security, privacy, and compliance obligations have been identified, implemented, and sufficiently verified.

Security could remain an architectural characteristic, but a separate readiness dimension is justified when it includes organizational controls, approvals, evidence, and ongoing obligations beyond design.

## 10. Launch readiness


Abstracts properties such as:

- rollout planning;
- feature flags;
- traffic migration;
- customer communication;
- support coordination;
- launch monitoring;
- go/no-go criteria.

**Definition:** The transition into production use can be executed and supervised within accepted risk.

This is particularly useful when "production readiness" includes readiness for a specific release rather than only readiness of the underlying system.

A compact model could therefore use these top-level properties:

1. **Architecture readiness**
2. **Validation readiness**
3. **Delivery readiness**
4. **Operational readiness**
5. **Recovery readiness**
6. **Governance readiness**
7. **Contextual risk acceptance**

The final item is important because readiness is ultimately a decision about whether the remaining risk is acceptable for a specific production use. It prevents the model from becoming a checklist in which satisfying every category automatically implies approval.
