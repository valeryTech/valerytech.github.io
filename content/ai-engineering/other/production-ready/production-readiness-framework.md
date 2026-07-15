---
draft: false
toc: true
title: "Production Readiness Framework"
linkTitle: "Production Readiness Framework"
---
## An organizational system for applying the production-readiness model

## 1. Purpose


The production-readiness framework turns the [production-readiness model]({{< ref "ai-engineering/other/production-ready/production-readiness-model" >}}) into repeatable engineering and decision practice.

The model answers:

```text
What does production readiness mean?
What must be true for this intended production use?
How are context, claims, requirements, controls, evidence, capability, and risk connected?
What justifies a readiness decision?
```


The framework answers:

```text
When is the model applied?
Who is responsible and who decides?
Which artifacts and evidence are required?
How is rigor tailored to risk?
How are exceptions and reassessments handled?
How does readiness work integrate with existing engineering workflows?
How do we know the practice is useful?
```


The framework does not redefine production readiness. It supplies the organizational mechanisms required to apply the model consistently and proportionately.

## 2. Relationship between model and framework


The model operationalizes the **concept** of production readiness. It resolves an abstract statement such as "the system must be reliable" into context-specific promises, risks, requirements, controls, evidence expectations, thresholds, and validity conditions.

The framework operationalizes the **use of the model**. It establishes lifecycle touchpoints, roles, review paths, templates, gates, tooling, exception handling, and feedback mechanisms.

```text
Production-readiness model
→ context-specific readiness profile and decision logic
→ production-readiness framework
→ repeatable design, assessment, authorization, and reassessment practice
```


A model without a framework can support an individual assessment but may be applied inconsistently. A framework without a model can create repeatable process but risks turning readiness into a ritualized checklist.

## 3. Framework capabilities

### 3.1 Initiate readiness work


The framework defines which events start or reopen readiness work. Examples include:

- a new system or production use;
- a material feature or architectural change;
- a release, migration, or traffic transition;
- a change in scale, users, data, dependencies, or operating environment;
- a significant incident or control failure;
- expired or invalidated evidence;
- a change in ownership, support, regulation, or risk tolerance.

### 3.2 Tailor rigor


The framework applies different levels of rigor according to production context and risk. Tailoring may consider:

- criticality and failure consequences;
- user and business exposure;
- data sensitivity and regulatory obligations;
- reversibility and blast radius;
- novelty and uncertainty;
- scale and dependency risk;
- expected lifetime and rate of change.

Tailoring changes the depth of review, strength of evidence, approval authority, and required controls. It does not change the meaning of readiness.

### 3.3 Integrate with the lifecycle


The framework places readiness reasoning at useful points in existing work:

| Lifecycle point | Use of the model | Typical output |
| --- | --- | --- |
| Product and system definition | Define intended use, production promises, exclusions, and risk context | Initial readiness profile |
| Architecture and planning | Derive properties, controls, capabilities, and evidence needs | Design and validation inputs |
| Implementation | Build controls and operational capabilities; collect evidence | Updated readiness record |
| Pre-production assessment | Evaluate claims, negative evidence, uncertainty, and residual risk | Scoped readiness decision |
| Launch or migration | Confirm transition-specific conditions and authority | Go/no-go record |
| Operation | Monitor validity conditions and production outcomes | Reassessment triggers |
| Material change or incident | Reapply affected parts of the model | Revised profile and decision |

The framework should reuse existing design, security, delivery, change, and incident-management workflows where possible instead of creating a parallel lifecycle.

### 3.4 Assign responsibility and authority


The framework makes the following responsibilities explicit:

- ownership of the system and its production outcomes;
- ownership of individual requirements, controls, and operational capabilities;
- responsibility for producing and reviewing evidence;
- authority to approve production use;
- authority to accept residual risk and exceptions;
- responsibility for monitoring validity conditions;
- responsibility for initiating reassessment.

The same person or group may hold several responsibilities for a low-risk system. Higher-risk contexts may require independent review or more senior decision authority.

### 3.5 Govern decisions and exceptions


The framework defines allowable decision states, for example:

- ready for the specified use;
- ready with explicit conditions;
- limited production exposure;
- not ready;
- decision deferred pending evidence.

Every decision should record its scope, supporting evidence, negative evidence, known gaps, residual risk, owner, decision authority, conditions, and reassessment triggers.

Exceptions should identify the unmet criterion, rationale, compensating controls, risk owner, expiry or review date, and closure plan. An exception changes the decision about accepted risk; it does not make the unmet criterion true.

### 3.6 Support learning and reassessment


Incidents, near misses, support cases, unexpected cost, control failures, user feedback, and dependency changes can expose incorrect context assumptions or inadequate criteria.

The framework routes those findings back into the model's reasoning:

```text
Production evidence
→ affected promise, risk, claim, or assumption
→ revised requirement, control, evidence expectation, or validity condition
→ reassessment
```

## 4. Minimum artifacts


A framework can be lightweight, but it should preserve the model's reasoning. Its minimum artifacts are:

1. **Readiness profile** -- scope, intended use, production context, promises, exclusions, and applicable dimensions.
2. **Claim and evidence record** -- requirements, controls, operational capabilities, validation, positive and negative evidence, and uncertainty.
3. **Decision record** -- conclusion, residual risk, conditions, authority, and validity period or triggers.
4. **Exception record** -- deviation, rationale, compensating controls, owner, expiry, and closure plan.
5. **Reassessment record** -- changed conditions, affected claims, new evidence, and revised decision.

Templates and tools may combine these artifacts. Their format is less important than preserving traceability from production context to decision.

## 5. Adoption and effectiveness


Adoption should be incremental. A practical sequence is:

1. establish shared vocabulary and the model/framework distinction;
2. define risk tiers and decision authority;
3. pilot the framework on a small number of systems or changes;
4. integrate the artifacts into existing planning, design, delivery, and incident workflows;
5. automate evidence collection where it improves credibility or reduces effort;
6. revise the framework using practitioner feedback and production outcomes.

Framework effectiveness should not be measured only by completion rates. Useful measures include:

- late discovery of readiness gaps;
- escaped failures associated with missing or weak readiness claims;
- repeated incidents and overdue corrective actions;
- time and effort required to produce credible evidence;
- exception volume, age, and recurrence;
- reassessment triggered by material change;
- practitioner understanding and perceived decision quality;
- production outcomes appropriate to the systems in scope.

These measures evaluate the framework's implementation. They do not become part of the production-readiness model itself.

## 6. Framework design principles


- Preserve traceability from context to decision.
- Tailor rigor, not semantics.
- Begin during definition and design, not only before launch.
- Treat negative evidence and uncertainty as first-class inputs.
- Keep risk acceptance explicit and authorized.
- Prefer evidence produced by normal engineering work.
- Reassess when validity conditions change.
- Improve the framework without casually changing the model's core meaning.
