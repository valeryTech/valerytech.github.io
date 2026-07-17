---
draft: false
toc: true
title: "Building"
linkTitle: "Building"
---
To build a useful framework for AI production readiness, I first needed a conceptual model of "production-ready" grounded in software engineering.

I had assumed the term referred to a broadly shared standard. Definitions might differ across teams, but I expected a common core: reliability, observability, maintainability, security, and operational ownership. Or, more precisely, despite differences in its definition, the 'core' remains operational. It's not.

So, that assumption did not hold.

I asked several engineers how they define production readiness and collected additional responses from the broader engineering community. The definitions were not incorrect. Most identified relevant properties and practices: reliability, testing, security, observability, rollback, documentation, and ownership. The problem was structural. Some mixed different semantic categories (like desired outcomes, implementation mechanisms, evidence, delivery practices, and organizational responsibilities) into generic checklists as well as mixing different abstraction levels.

Detailed information is in [[background-and-definition-review|background-and-definition-review]]

# Model and Framework


- The **model determines what must be reasoned about** to establish production readiness.
- The **framework turns that reasoning into implementation work, validation work, ownership, and a release decision.**

This gives the work two related outputs:

- [Production Readiness Model]({{< ref "ai-engineering/other/production-ready/production-readiness-model" >}}) -- what readiness means;
- [Production Readiness Framework]({{< ref "ai-engineering/other/production-ready/production-readiness-framework" >}}) -- how readiness criteria are derived, assessed, governed, and integrated into organizational practice.

# Goals


The readiness framework has three primary goals.

### 1. Build for readiness


The framework brings required design and build work before production.

It answers:

```text
What must the system provide in production?
Which properties must the architecture support?
Which technical and operational controls are required?
What evidence must be produced?
Who will own, operate, and support each capability?
```


This moves readiness work earlier in the development process. Testing, observability, deployment safety, rollback, recovery, capacity, security, support, and ownership are planned alongside the system.

### 2. Assess readiness


The framework provides a structured way to determine whether a system, feature, release, migration, or significant change is ready for a specific production use.

### 3. Reassess readiness


The framework can be reapplied when production evidence or changed conditions invalidate earlier assumptions.

Incidents, near misses, support cases, operational burden, unexpected costs, control failures, and user feedback can reveal incorrect assumptions or missing requirements.

# Model And Framework Derivation

## Operational capability


A production system must be operable. This depends on both the organization responsible for it and the system itself.

### Organizational capability


The responsible organization must be able to own the system and make effective decisions during normal operation and incidents. This requires clear ownership, decision authority, access, staffing, support responsibilities, escalation paths, incident procedures, and shared operational knowledge. Naming an owner is not enough. The owner must have the knowledge, permissions, authority, capacity, and support needed to act.

### System operability


The system must enable operators to observe its state, understand its behavior, control its operation, limit failures, and restore acceptable service.

Operators should be able to:

```text
Detect problems
Assess impact
Diagnose causes
Intervene safely
Contain failures
Mitigate effects
Restore service
Communicate and escalate
```


Monitoring and logging support these capabilities, but do not establish them by themselves. An alert may show an increased error rate without helping operators identify the affected scope, isolate the failure, disable the responsible function, repair damaged state, or restore service.

## Design the system and its operation together


Plan how the system will be operated while it is being designed, rather than after it is built. Review operational readiness during design, development, testing, launch, and later changes.

The system and the team responsible for it must be able to work together. Each operational responsibility should be supported by the right system features, permissions, procedures, and knowledge.

For example, a team responsible for recovery needs working recovery tools, the right access, tested steps, and enough information to understand the failure and restore service.

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

## Readiness depends on the use case


Before assessing a system, first define what production-ready means for the way it will be used.

Readiness requirements are not the same for every system. They depend on the operating environment, the impact of failure, and the acceptable level of risk.

For example, reliability requirements may differ:

- An internal reporting tool may tolerate a short outage and manual recovery.
- A payment system may need automatic recovery and strong data protection because failures can cause large financial losses.
- A medical system may need fail-safe behavior because a failure could harm people.

## [wip] The checklist is derived from operational evidence


The ORR content is not presented as a static generic checklist. Questions are generated from:

- actual incidents;
- near misses;
- anticipated failure modes;
- Correction of Errors post-incident analyses;
- business-specific governance, security, compliance, culture, and tooling.

The intent is to turn lessons from one workload into controls that reduce similar risks across other workloads.

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
**Readiness is contextual.** Checklists differ by workload, launch type, and risk profile.
{{< /callout >}}

## Architecture readiness


Production-readiness definitions often list characteristics such as reliability, security, scalability, maintainability, performance, and observability. Rather than treating each as a universal readiness property, the framework can group them under **architecture readiness**. So making architecture readiness part of production readiness.

The specific characteristics and required levels should be defined for the intended production context.

As the model establishes, architecture readiness is necessary but insufficient. A well-designed system may still be unready due to gaps in validation, deployment safety, recovery, operational support, ownership, or risk acceptance.

**Architecture readiness is the condition in which the design and implementation adequately address the functional requirements, selected architectural characteristics, constraints, and material technical risks for the intended use.**

## Outcomes and capabilities are distinct from mechanisms


A required outcome or capability is not the same as the mechanism intended to support it. And production readiness must be supported by evidence.

```text
Tests exist
≠ required behavior has been established

Metrics exist
≠ operators can understand system state

Backups exist
≠ recovery is possible within the required limits

Retries exist
≠ failures are handled safely

Rollback tooling exists
≠ a release can be reversed safely

Documentation exists
≠ the responsible team can perform the procedure

Access controls exist
≠ unauthorized access is sufficiently constrained
```


Mechanisms must be evaluated against the outcomes, properties, or capabilities they are intended to provide.
