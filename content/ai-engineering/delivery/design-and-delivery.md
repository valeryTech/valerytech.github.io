---
draft: false
toc: true
title: "AI Product Design and Delivery Framework"
description: "A configurable AI project lifecycle linking problem framing, system design, build, release, and operation with continuous data, evidence, readiness, observability, and adoption workstreams."
linkTitle: "AI Product Design and Delivery Framework"
---

Building an AI product involves much more than training a model. It starts with understanding the problem and deciding whether AI is the right approach. It then includes defining the product, designing the system, preparing data, building and testing the solution, releasing it, operating it, improving it, and eventually retiring it.

This framework divides that work into two connected cycles. The Problem and Response Cycle helps teams understand what needs to change and choose the right response. The Project Loop covers how a chosen product, service, or system is designed, built, released, and operated. What teams learn during the project may lead them to revisit the original problem or change the planned solution.

# Navigation

## Where to Start


For a new project, start by understanding the problem. Identify who is affected, what is happening today, what needs to change, and why that change matters. At this point, do not assume that AI is the right solution. See more in the [Outer Cycle]({{< ref "ai-engineering/delivery/outer-cycle" >}}).

Next, consider what kind of response is needed. The answer may be a change to a process, role, policy, data, or existing software. It may also be a new AI product or a combination of several changes. Some problems may not require a technical project at all.

Once there is a clear reason to create or change a product, move into the Project Loop. Begin by defining the intended outcome, users, scope, and role of AI in the product.

The phases provide a useful path, but they are not a one-way sequence. What the team learns during design, development, evaluation, or operation may require it to return to an earlier phase and revise its decisions.

## In Short


Four ideas:

1. **Default starting point:** begin by understanding the problem and the change needed.
2. **Do not assume AI is the answer:** first decide what kind of intervention makes sense.
3. **Teams may enter at different points:** an existing project does not always need to restart from phase zero.
4. **Earlier decisions can be revisited:** the phases are connected and iterative.

# Relationship to the Problem


The team begins the Project Design and Delivery Cycle after using the [Problem and Response Cycle]({{< ref "ai-engineering/delivery/outer-cycle" >}}) to identify a clear reason for a product or engineering project.

The outer cycle defines:

- the problem;
- the desired outcome;
- the selected response;
- the contribution expected from the project;
- important constraints, assumptions, and dependencies.

These decisions are captured in a small project brief.

The Project Design and Delivery Cycle uses this brief to define, design, build, evaluate, release, and operate the product, service, or system.

# Reference Phases


A **phase** is a configurable grouping of related activities oriented toward a delivery objective or decision.

1. Product and Artefact Framing
2. Design
3. Baseline and Prototyping
4. Build, Product Evaluation and Release
5. Operation and Evolution

## Product and Artifact Framing


Defines the MVP, product promises, guarantees and invariants, JTBDs, and primary and supporting business use cases.

Serves as the foundation for the design. See [[df-product-framing]].

## Design


Design covers several areas that can be coordinated:

- Classical System Design: backend and agent foundation
- AI System Design: Model behavior, context, planning, tool selection, uncertainty, and recovery
- Evaluation Harness

Some of this work can run in parallel.

## Build, Product Evaluation and Release


Also:

- Coordination and Delivery Planning or Delivery and Coordination (sub)-Phase. Goal: coordinate delivery with evaluation subsystem and AI subsystem;
- experimentation approach and roadmap management

The first implementation should be a narrow vertical slice rather than a generic agent platform.

| Step                            | Main activities                                                                                                                                                                                                                                             | Resulting artifacts                                                                                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plan delivery and migration** | Break the target architecture into deliverable increments. Define sequencing, dependencies, ownership, compatibility requirements, data migration, rollout controls, rollback procedures, and decommissioning activities.                                   | Delivery roadmap, work breakdown, milestone plan, dependency map, migration plan, rollout plan, rollback plan, ownership matrix.                          |
| **Validate the implementation** | Verify functional behavior and quality attributes through automated tests, integration tests, performance tests, resilience exercises, security reviews, and production-readiness assessments. Confirm that the implementation matches the approved design. | Test strategy, performance results, resilience test results, security assessment, compliance evidence, production-readiness checklist, acceptance report. |
| **Release and operate**         | Deploy through controlled environments, monitor service health, manage incidents, validate assumptions with production data, and establish routine operational processes.                                                                                   | Deployment procedures, dashboards, alerts, runbooks, incident procedures, service catalogue entry, operational ownership, support model.                  |

## Operation and Evolution


 **Review and evolve**

 Compare actual behavior with forecasts and requirements. Record architectural drift, operational findings, capacity trends, incidents, and new constraints. Update the system incrementally as conditions change.

Post-release review, architecture review record, capacity review, technical-debt register, improvement backlog, updated diagrams and decision records.

This phase covers feedback loops and how they lead to improvements, data flywheels and their use, continued product readiness, and observability.

# Cross-Cutting Workstreams


Some areas of work continue across many phases. These should be represented as workstreams rather than separate lifecycle phases.

A cross-cutting workstream is a coherent set of activities, responsibilities, artefacts, and controls that addresses a persistent delivery concern across multiple phases. Their contracts begin during framing and system design, become executable during implementation, support the release decision, and continue in production.

## Recommended Workstreams

### Evaluation and Evidence


Build an evaluation harness, use an evaluation platform, and assess whether the system works through offline and online evaluation.

[Design Science Evaluation]({{< ref "ai-engineering/delivery/design-science-evaluation" >}})

### Data Foundation


Includes synthetic data generation and data strategy. Further areas remain to be defined. See [Df Data]({{< ref "ai-engineering/delivery/df-data" >}}).

Treat data strategy as a first-class workstream. Data Foundation ensures that an AI product is designed from evidence, evaluated against representative and risk-relevant data, operated with effective telemetry, and continuously adapted as users, data, knowledge, and model behavior change.

Open question: should there also be a separate component for data itself?

### Observability and Feedback


...

### Production Readiness


Covers possible harm, system failure, human oversight, fallback behaviour, and recovery. See [Production Readiness Framework]({{< ref "ai-engineering/delivery/production-ready/production-readiness-framework" >}}).

**Security and Privacy**

Covers access, data protection, trust boundaries, threats, and security testing.

**Operational Readiness (delivery, configuration)**

Covers environments, deployment, CI/CD, versions, releases, and change control.

### Change and Adoption


Build the technical and organizational mechanisms for using production data to improve and evolve the system.

Use the outputs of the established feedback loops.

## Workstream Integration Model


The workstream integration model defines how cross-cutting workstreams are embedded into the phased delivery approach.

A workstream does not sit alongside the lifecycle as an independent sequence of work. It contributes activities, responsibilities, artefacts, evidence, and controls to multiple phases. The nature of that contribution changes as the project progresses.


The same pattern applies to observability, data, production readiness, security, operational readiness, and change and adoption. Their requirements should be established early, implemented as part of the product, used to support delivery and release decisions, and maintained during operation.

This creates a kind of interaction matrix between **delivery phases** and **cross-cutting workstreams**. The phases provide the primary progression of the project, while the workstreams preserve continuity for concerns that cannot be completed within a single phase.

The model does not require every workstream to have the same level of activity in every phase. The depth of integration should depend on the project's uncertainty, risk, scale, maturity, and delivery context. A workstream may be prominent in one phase and lighter in another, but its relevant obligations should remain visible and explicitly owned.

Workstream integration should be treated as part of project configuration and planning. At the beginning of the project, the team should determine:

1. which cross-cutting workstreams apply;
2. what each workstream must contribute in each phase;
3. which activities can run concurrently;
4. where dependencies exist between workstreams;
5. what evidence is required at decision and release points;
6. how findings will feed back into framing, design, implementation, and operation.

The resulting phase-by-workstream view provides a practical basis for planning, ownership, coordination, assurance, and review. It also prevents persistent concerns from being deferred until the end of delivery or treated as isolated checklists.

| Workstream                              | Product framing                                                              | Design                                                                                             | Implementation                                                                             | Evaluation and release                                                                                | Operation                                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Evaluation and evidence**             |                                                                              |                                                                                                    |                                                                                            |                                                                                                       |                                                                                                        |
| **Observability and feedback**          | Identify decisions and outcomes that must be observable.                     | Define trace identity, events, spans, version metadata, privacy limits, and outcome joins.         | Instrument the vertical slice and verify trace completeness and replayability.             | Use traces for diagnosis, comparison, and rollout/rollback readiness.                                 | Monitor behavior and health, investigate incidents, and feed findings back into design and evaluation. |
| **Safety, reliability, and governance** | Define harms, constraints, human boundaries, ownership, and acceptable risk. | Design trust boundaries, permissions, validation, degradation, escalation, recovery, and controls. | Implement and test safeguards, failure handling, audit evidence, and operational controls. | Exercise failure modes, verify controls, record residual risk, and require explicit release approval. | Detect violations, respond and recover, audit decisions, and update controls as conditions change.     |

# Development Modes

## Experimentation Approach


Experimentation is a mode of work used whenever an uncertainty requires empirical resolution.

It is especially prominent during Baseline and Feasibility, but may also appear during:

- product framing;
- system design;
- build and integration;
- operation and evolution.


- add link and justification to the [Experimentation]({{< ref "ai-engineering/approach/experimentation" >}}) and mention with roadmap management
- walking skeletons; prototyping method
- baseline
- add links and short references about [Combined Approach]({{< ref "ai-engineering/approach/combined-approach" >}}), [Cross Domain Mindset]({{< ref "ai-engineering/approach/cross-domain-mindset" >}})

### Baseline implementation and experimentation


The strongest AI products start with disciplined discovery and a baseline that may not use ML at all, then move through controlled experimentation.

Create a working, reproducible baseline that exercises the real workflow before optimizing individual AI components.

**Purpose**

Specifications cannot resolve every uncertainty in an AI system, but ad hoc implementation creates a different problem: architecture-by-speculation, anecdotal tuning, and changes with no stable reference. A thin, instrumented baseline makes uncertain assumptions executable and creates something that later experiments and evaluations can actually compare.

## A Configurable and Composable Framework


The framework should be adapted to each project. One proposed mechanism follows the Unix approach: use abstraction and modularity to combine reusable blocks into pipelines or graphs. The specific composition mechanisms still need to be worked out.

### Alternative formulation


The framework is intended to be adapted to each project rather than followed as a fixed sequence. It is built from reusable activities, cross-cutting workstreams, artefacts, and decision points that teams can select and combine according to the needs of the project.

Each activity should have a clear purpose, inputs, outputs, and completion conditions. This allows activities to be connected into different delivery flows while keeping their responsibilities and relationships clear.

The reference phases provide a useful default structure, but they are only one possible arrangement. Depending on the project, activities may run sequentially, in parallel, or repeatedly as new evidence becomes available.

The structure and depth of the work should depend on the problem, uncertainty, risk, scale, and delivery needs. Some concerns, such as evaluation, observability, safety, security, and operational readiness, should remain part of every configuration, although the amount of work they require may vary.


A project may:

- omit phases;
- combine phases;
- split one phase into several;
- execute phases concurrently;
- revisit previous phases;
- apply different levels of rigor;
- introduce domain-specific phases.

## Library sources


- Thompson 2023, *Delivering Machine Learning Projects: From Design to Deployment* -- on *Reference Phases*
- [Haakman et al. 2021](/sources/ml-engineering/se-for-ml/haakman-2021-ai-lifecycle-models-need-revision.pdf.enc), *AI Lifecycle Models Need To Be Revised* ([arXiv:2010.02716](https://arxiv.org/abs/2010.02716))

Further reading:

- [Babushkin and Kravchenko 2025](/sources/ml-engineering/books/babushkin-2025-machine-learning-system-design.pdf.enc), *Machine Learning System Design*
- Burkov 2020, *Machine Learning Engineering*
- [Sens et al. 2025](/sources/ml-engineering/se-for-ml/sens-2025-model-integration-ml-enabled-systems.pdf.enc), *A Large-Scale Study of Model Integration in ML-Enabled Software Systems* ([arXiv:2408.06226](https://arxiv.org/abs/2408.06226))
- [Serban and Visser 2022](/sources/ml-engineering/se-for-ml/serban-2022-adapting-software-architectures-ml-challenges.pdf.enc), *Adapting Software Architectures to Machine Learning Challenges* ([arXiv:2105.12422](https://arxiv.org/abs/2105.12422))
- [AWS 2024](/sources/software-engineering/systems-and-operations/aws-2024-well-architected-migration-lens.pdf.enc), *Migration Lens*
