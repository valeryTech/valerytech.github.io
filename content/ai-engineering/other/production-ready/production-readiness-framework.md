---
draft: false
toc: true
title: "Production Readiness Framework"
linkTitle: "Production Readiness Framework"
---
# [WIP] Production Readiness Framework

## An organizational system for applying the production-readiness model

## 1. Purpose


The production-readiness framework turns the [production-readiness model]({{< ref "ai-engineering/other/production-ready/production-readiness-model" >}}) into repeatable engineering and decision practice.

The model answers:

```text
What does production readiness mean?
What kind of claim is it?
What are its essential properties and conceptual relationships?
How does it differ from adjacent concepts?
```


The framework answers:

```text
What must be true for this intended production use?
How are abstract concepts translated into requirements and thresholds?
How are context, claims, controls, evidence, capability, and risk connected in practice?
What justifies a readiness decision?
When is the model applied?
Who is responsible and who decides?
Which artifacts and evidence are required?
How is rigor tailored to risk?
How are exceptions and reassessments handled?
How does readiness work integrate with existing engineering workflows?
How do we know the practice is useful?
```


The framework does not redefine production readiness. It supplies the organizational mechanisms required to apply the model consistently and proportionately.

It has three primary functions:

- **Build for readiness:** derive requirements early enough to shape architecture, controls, validation, and the operating model.
- **Assess readiness:** compare implementation, capabilities, and evidence with the context-specific readiness profile and make a scoped decision.
- **Reassess readiness:** revisit the profile and decision when production evidence or material changes invalidate earlier assumptions.

## 2. Relationship between model and framework


The model defines the **concept** of production readiness: its meaning, properties, relationships, and boundaries.

The framework operationalizes that concept. It resolves an abstract statement such as "the system must be reliable" into context-specific promises, risks, requirements, controls, evidence expectations, thresholds, and validity conditions. It also establishes lifecycle touchpoints, roles, review paths, templates, gates, tooling, exception handling, and feedback mechanisms.

```text
Production-readiness model
→ production-readiness framework
→ context-specific readiness profile and decision logic
→ repeatable design, assessment, authorization, and reassessment practice
```


The model can remain stable while frameworks vary by organization, system type, and risk context. A framework without a clear conceptual model risks turning readiness into a ritualized checklist.

### 2.1 Traceability from model to framework


Each property of the conceptual model has an explicit operational realization.

| Model property | Framework realization |
| --- | --- |
| **Contextual** | Readiness profile, explicit scope and exclusions, risk-based tailoring |
| **Socio-technical** | System-and-organization assessment scope, operational capabilities, responsibility and authority |
| **Claim-based** | Derived claims and requirements linked to production promises and risks |
| **Evidence-supported** | Validation plan, evidence expectations, claim-and-evidence record |
| **Includes negative evidence and uncertainty** | Mandatory capture of gaps, contradictory evidence, unknowns, and conditions |
| **Accepts bounded residual risk** | Decision states, exception handling, explicit risk owner and decision authority |
| **Has validity conditions** | Recorded assumptions, reassessment triggers, and change- or incident-driven review |

The framework may add context-specific concerns, but it must not change the meaning of these properties.

## 3. Framework capabilities

### 3.1 Derive a readiness profile


The framework converts the conceptual model into context-specific assessment criteria. It connects:

- intended production use and explicit exclusions;
- user and organizational promises;
- risks and failure consequences;
- readiness claims and requirements;
- required system properties;
- technical and organizational controls;
- operational capabilities and responsibilities;
- accepted cost and organizational-capacity envelope;
- validation methods and evidence expectations;
- negative evidence and uncertainty;
- residual risk and decision authority;
- validity conditions and reassessment triggers.

This derivation is the bridge between the conceptual model and a readiness decision. The resulting readiness profile is an output of the framework, not part of the model.

### 3.2 Initiate readiness work


The framework defines which events start or reopen readiness work. Examples include:

- a new system or production use;
- a material feature or architectural change;
- a release, migration, or traffic transition;
- a change in scale, users, data, dependencies, or operating environment;
- a significant incident or control failure;
- expired or invalidated evidence;
- a change in ownership, support, regulation, or risk tolerance.

### 3.3 Tailor rigor


The framework applies different levels of rigor according to production context and risk. Tailoring may consider:

- criticality and failure consequences;
- user and business exposure;
- data sensitivity and regulatory obligations;
- reversibility and blast radius;
- novelty and uncertainty;
- scale and dependency risk;
- expected lifetime and rate of change;
- operating cost and support burden.

Tailoring changes the depth of review, strength of evidence, approval authority, and required controls. It does not change the meaning of readiness.

### 3.4 Integrate with the lifecycle


The framework places readiness reasoning at useful points in existing work:

| Lifecycle point | Use of the model | Typical output |
| --- | --- | --- |
| Product and system definition | Define intended use, production promises, exclusions, and risk context | Initial readiness profile |
| Architecture and planning | Derive properties, controls, capabilities, and evidence needs | Design and validation inputs |
| Implementation | Build controls and operational capabilities; collect evidence | Updated readiness record |
| Pre-production assessment | Evaluate claims, negative evidence, uncertainty, and residual risk | Scoped readiness decision |
| Launch or migration | Confirm transition-specific conditions and authority | Go/no-go record |
| Operation | Monitor validity conditions and production outcomes | Reassessment triggers |
| Material change or incident | Re-derive the affected parts of the readiness profile | Revised profile and decision |

The framework should reuse existing design, security, delivery, change, and incident-management workflows where possible instead of creating a parallel lifecycle.

### 3.5 Assign responsibility and authority


The framework makes the following responsibilities explicit:

- ownership of the system and its production outcomes;
- ownership of individual requirements, controls, and operational capabilities;
- responsibility for producing and reviewing evidence;
- authority to approve production use;
- authority to accept residual risk and exceptions;
- responsibility for monitoring validity conditions;
- responsibility for initiating reassessment.

The same person or group may hold several responsibilities for a low-risk system. Higher-risk contexts may require independent review or more senior decision authority.

### 3.6 Govern decisions and exceptions


The framework defines allowable decision states, for example:

- ready for the specified use;
- ready with explicit conditions;
- limited production exposure;
- not ready;
- decision deferred pending evidence.

Every decision should record its scope, supporting evidence, negative evidence, known gaps, residual risk, owner, decision authority, conditions, and reassessment triggers.

Exceptions should identify the unmet criterion, rationale, compensating controls, risk owner, expiry or review date, and closure plan. An exception changes the decision about accepted risk; it does not make the unmet criterion true.

### 3.7 Support learning and reassessment


Incidents, near misses, support cases, unexpected cost, control failures, user feedback, and dependency changes can expose incorrect context assumptions or inadequate criteria.

The framework routes those findings back through its derivation and assessment process:

```text
Production evidence
→ affected promise, risk, claim, or assumption
→ revised requirement, control, evidence expectation, or validity condition
→ reassessment
```
