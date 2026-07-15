---
draft: false
toc: true
title: "Building"
linkTitle: "Building"
---
To build a useful framework for AI production readiness, I first needed an operational model of "production-ready" grounded in software engineering.

I had assumed the term referred to a broadly shared standard. Definitions might differ across teams, but I expected a common core: reliability, observability, maintainability, security, and operational ownership. Or, more precisely, despite differences in its definition, the 'core' remains operational. It's not.

So, that assumption did not hold.

I asked several engineers how they define production readiness and collected additional responses from the broader engineering community. The definitions were not incorrect. Most identified relevant properties and practices: reliability, testing, security, observability, rollback, documentation, and ownership. The problem was structural. Some mixed different semantic categories (like desired outcomes, implementation mechanisms, evidence, delivery practices, and organizational responsibilities) into generic checklists as well as mixing different abstraction levels.

Detailed information is in [background-and-definition-review]({{< ref "ai-engineering/other/production-ready/background-and-definition-review" >}})

# Model and framework


The **production-readiness model** defines the meaning and reasoning structure of readiness. It connects production context, promises, risks, requirements, system properties, controls, evidence, organizational capability, residual risk, and a scoped decision.

The model includes conceptual operationalization: it turns abstract properties such as reliability, safety, and operability into context-specific claims, criteria, thresholds, and evidence expectations.

The **production-readiness framework** defines how an organization applies the model. It supplies lifecycle touchpoints, roles, risk tiers, review and approval paths, artifacts, tooling, exception handling, reassessment triggers, adoption practices, and effectiveness measures.

This gives the work two related outputs:

- [Production Readiness Model]({{< ref "ai-engineering/other/production-ready/production-readiness-model" >}}) -- what readiness means and how a claim is derived and justified;
- [Production Readiness Framework]({{< ref "ai-engineering/other/production-ready/production-readiness-framework" >}}) -- how that model becomes repeatable organizational practice.

# Functions


The readiness model has two primary functions and supports reassessment. The framework determines where and by whom these functions are performed.

### 1. Assess readiness


The model provides a structured way to determine whether a system, feature, release, migration, or significant change is ready for a specific production use.

It answers:

```text
What was required?
What has been implemented?
What evidence shows that the requirements are met?
What defects, uncertainties, risks, or gaps remain?
```


The assessment compares the implemented system and available evidence with the requirements defined for its production context.

### 2. Build for readiness


The model also helps teams determine what must be designed and built before production use.

It answers:

```text
What must the system provide in production?
Which properties must the architecture support?
Which technical and operational controls are required?
What evidence must be produced?
Who will own, operate, and support each capability?
```


This moves readiness work earlier in the development process. Testing, observability, deployment safety, rollback, recovery, capacity, security, support, and ownership are planned alongside the system.

Teams work backwards from production expectations to define the required architecture, controls, delivery process, evidence, and operating model. Readiness is therefore built into the system instead of being evaluated only at the release boundary.

### 3. Reassess


The model can be reapplied when production evidence or changed conditions invalidate earlier assumptions.

Incidents, near misses, support cases, operational burden, unexpected costs, control failures, and user feedback can reveal incorrect assumptions or missing requirements. These findings should update the system requirements, controls, validation methods, acceptance criteria, and operating procedures.

The framework embeds this reasoning in a lifecycle such as:

```text
Derive → design → build → validate → decide → operate → learn → revise
```

# Build Principles and Model Properties

## Possible structure of the model

### General definition


The general definition establishes the stable meaning of production readiness across systems.

It identifies readiness as:

- a claim about production fitness;
- scoped to a particular use;
- supported by evidence;
- inclusive of organizational capability;
- subject to residual-risk acceptance.

It does not prescribe a universal set of [[topics/engineering/architecture/characteristics|architectural characteristics]], target levels, design mechanisms, deployment practices, testing methods, or support arrangements. Architectural characteristics must be selected and operationally defined for the intended production use and its context.

## Negative evidence and unknowns


The common definition focuses mainly on positive evidence: tests, reviews, monitoring, and exercises. A readiness assessment also needs to capture:

- known defects;
- untested assumptions;
- unavailable evidence;
- contradictory evidence;
- unresolved incidents;
- unvalidated dependencies;
- conditions outside the evaluation envelope.

"No known critical defects" appears in one collected definition, but the review does not develop the broader role of negative evidence and uncertainty.

The future model should avoid treating readiness as the accumulation of positive checks.

## Architecture readiness


Production-readiness models often list characteristics such as reliability, security, scalability, maintainability, performance, and observability. Rather than treating each as a universal readiness property, they can be grouped under **architecture readiness**.

Architecture readiness assesses whether the system's design and implementation adequately address:

- functional requirements;
- relevant architectural characteristics;
- applicable constraints;
- material technical risks.

The specific characteristics and required levels should be defined for the intended production context.

Architecture readiness is necessary but insufficient. A well-designed system may still be unready due to gaps in validation, deployment safety, recovery, operational support, ownership, or risk acceptance.

## Context-dependent properties


Some properties like maintainability are context-dependent in degree, though some minimum level is usually required for any production system.

For example, the required level of maintainability depends on the system's expected lifetime, complexity, rate of change, criticality, and ownership model. For complex or long-lived systems, production readiness includes the ability for teams beyond the original authors to operate, modify, and evolve the system at a sustainable cost and risk.

# Guiding principle

### Design the system and operating model together


The software and the organization responsible for it should be designed as one operating system.

The technical design should account for:

- who owns the system;
- who monitors and supports it;
- who can perform operational actions;
- how access is controlled;
- how incidents are escalated;
- who can accept residual risk;
- who maintains controls, procedures, and documentation.

Operational responsibilities should be supported by concrete system capabilities. For example, assigning recovery responsibility requires usable recovery tooling, appropriate permissions, tested procedures, and sufficient diagnostic information.

## Observability: Design for operation and intervention


A production system should be designed to be managed, rather than merely executed.

The system should provide the information and controls required to:

```text
Detect
Understand
Diagnose
Control
Mitigate
Recover
Support
Escalate
```


This may require business and technical telemetry, administrative interfaces, feature flags, traffic controls, rate limits, rollback mechanisms, data-correction capabilities, and recovery tooling.

Observability should be connected to action. Detecting a problem is insufficient unless operators have a defined way to investigate, contain, mitigate, or escalate it.

The required operational capabilities should be usable by the teams responsible for operating and supporting the system, rather than depending exclusively on its original developers.
