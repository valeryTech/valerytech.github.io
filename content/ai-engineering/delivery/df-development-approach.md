---
draft: false
toc: true
title: "Development Approaches and Modes"
description: "Distinguishes experiments, baselines, prototypes, and walking skeletons as optional development modes, choosing each according to uncertainty and the evidence needed for decisions."
linkTitle: "Development Approaches and Modes"
---

Development approaches are modes of work that teams can introduce when particular conditions arise.

They are not mandatory phases and do not define a universal development lifecycle. An approach may be used once, repeated, combined with other approaches, or omitted when the required evidence already exists.

The appropriate approach depends on the uncertainty being resolved, the evidence required, and the cost and risk of making an incorrect decision.

## Experimentation Approach


Experimentation is a mode of work used when a material uncertainty requires empirical resolution.

It is appropriate when analysis, specification, or prior evidence cannot establish whether an assumption is valid.

Experimentation may be used to investigate:

- user value or behavior;
- data suitability;
- AI capability;
- model or system quality;
- workflow effectiveness;
- reliability and failure modes;
- latency and cost;
- safety controls;
- adoption and operational behavior.

Experimentation is especially prominent during baseline and feasibility work, but it may also occur during:

- product framing;
- interaction and workflow design;
- system design;
- build and integration;
- production operation;
- product evolution.

Each experiment should connect:

1. an uncertainty or hypothesis;
2. a controlled change or intervention;
3. representative inputs or operating conditions;
4. an evaluation method;
5. expected evidence;
6. a decision that the evidence will inform.

The output of an experiment is evidence and a decision, rather than implementation alone.

See [Experimentation]({{< ref "ai-engineering/approach/experimentation" >}}).

## Baseline Implementation and Experimentation


A baseline is a reproducible reference against which proposed changes can be evaluated.

Depending on the project, the baseline may be:

- the current human workflow;
- the existing non-AI product;
- a rule-based system;
- a vendor or foundation-model implementation;
- the simplest viable AI implementation;
- a thin end-to-end walking skeleton.

A baseline is useful when the team needs a stable reference for measuring progress. It should not automatically become a mandatory first step when an adequate reference already exists.

### Purpose


Specifications cannot resolve every uncertainty in an AI system. Ad hoc implementation creates a different set of problems:

- architecture based on untested assumptions;
- anecdotal tuning;
- isolated component demonstrations;
- changes without a stable comparison point;
- results that cannot be reproduced.

A thin, instrumented baseline makes important assumptions executable. It establishes a system that later experiments, evaluations, and design alternatives can compare against.

### Characteristics of a useful baseline


A useful baseline should:

- exercise the relevant workflow end to end;
- use sufficiently representative inputs;
- produce observable and repeatable outputs;
- support the initial evaluation criteria;
- expose important integration and operational constraints;
- remain simple enough to modify or replace;
- provide a stable reference for subsequent experiments.

The baseline should optimize for learning and comparability before local component performance.

## Prototyping and Walking Skeletons


Prototypes are appropriate when the main uncertainty concerns product behavior, interaction, workflow integration, or user response.

A walking skeleton is appropriate when the team needs to validate the end-to-end system path before investing in the quality of individual components.

Prototypes and walking skeletons may overlap with a baseline, but they serve different primary purposes:

- a **prototype** explores a proposed experience or solution;
- a **walking skeleton** proves that the system can operate end to end;
- a **baseline** establishes a stable comparison point;
- an **experiment** produces evidence about an uncertainty.

One implementation may serve several of these purposes, but the intended purpose should be explicit.

## Roadmap Management


The roadmap should use planning units that match the current level of uncertainty.

When feasibility is unknown, the roadmap may contain:

- hypotheses;
- experiments;
- timeboxes;
- evaluation milestones;
- decision points.

When capability is emerging, it may contain progressive capability or quality thresholds.

When the solution is sufficiently understood, it may contain conventional product increments, features, integration work, and delivery milestones.

When approaching production, it should also contain reliability, governance, observability, adoption, and operational-readiness work.

An AI roadmap may therefore combine:

- **experiments** for unresolved questions;
- **capability milestones** for progressive usefulness;
- **features and increments** for validated product work;
- **reliability and governance milestones** for production readiness.

This avoids treating either experiment-based planning or feature-based planning as universally sufficient.

See [Experiments Vs Features]({{< ref "ai/product/product-model/experiments-vs-features" >}}) and [[roadmap-management]].

## Combined Approaches


AI product development commonly requires several approaches at the same time.

For example, a team may:

- use product discovery to refine the opportunity;
- build a walking skeleton to expose integration constraints;
- create a baseline for comparison;
- run experiments on uncertain AI components;
- deliver validated product changes incrementally;
- add reliability and governance controls before broader deployment.

The framework should help teams identify which approach is appropriate for each uncertainty rather than prescribing one approach for the entire project.

See [Combined Approach]({{< ref "ai-engineering/approach/combined-approach" >}}) and [Cross Domain Mindset]({{< ref "ai-engineering/approach/cross-domain-mindset" >}}).

## Library sources


- [Wilson 2022](/sources/ml-engineering/books/wilson-2022-machine-learning-engineering-in-action.pdf.enc), *Machine Learning Engineering in Action*
