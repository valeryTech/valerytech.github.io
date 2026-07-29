---
draft: false
toc: true
title: "01 Starting Sequence"
linkTitle: "01 Starting Sequence"
---
Based on the attached files, we have **different levels of startup definition for the three loops**. The material describes methods and interfaces; it does not establish that the corresponding product, tooling, datasets, or processes have already been implemented.

The key structural point is that the loops do not start symmetrically:

```text
Product Improvement Loop
supplies product intent and an executable product

Evaluation Infrastructure Loop
makes executions inspectable

Evaluation Knowledge Loop
uses those executions to build reusable judgment

Product Improvement Loop
uses the resulting findings to change the product
```


The Evaluation Knowledge Loop is currently the most fully specified. The Evaluation Infrastructure Loop has a defined minimum capability but little implementation detail. The Product Improvement Loop has a clear operating model and evaluation interface, but its internal method is only outlined.

## 1. Product Improvement Loop

### What is already defined


The loop owns changes to the AI product and follows this path:

```text
Evidence, goals, opportunities, and constraints
    → identify and prioritise
    → diagnose
    → define a change hypothesis
    → design and implement
    → evaluate and validate
    → deploy and monitor
```


It can receive evaluation findings alongside user research, support cases, incidents, requirements, engineering constraints, safety considerations, and technical opportunities.

The evaluation material also defines the product information needed to begin evaluation:

- main jobs to be done;
- product guarantees;
- critical failures;
- architecture and operating constraints;
- supported workflows;
- tools and data sources;
- permission boundaries;
- unsupported or prohibited actions;
- relevant environmental conditions.

These form the product definition and evaluation boundary from which coverage requirements are derived.

The failure-model guide defines the hand-off back into this loop:

```text
failure findings and other product inputs
    → choose what to investigate
    → diagnose the problem
    → propose a system change
    → implement and test
    → compare results
    → deploy and monitor
```


It also assigns prioritisation, causal diagnosis, intervention selection, test requirements, and release decisions to the Product Improvement Loop.

### What must exist for startup


The evaluation system needs this loop to provide:

1. **An executable product slice** that exposes a realistic end-to-end workflow.
2. **A product definition** containing jobs, guarantees, critical failures, and operating constraints.
3. **A defined system configuration** against which evaluation cases can run.
4. **A mechanism for making product changes** after findings are produced.

The Product Improvement Loop does not need an evaluation finding to exist before evaluation starts. Its initial contribution is the product behaviour, intent, and constraints that the evaluation subsystem will examine.

### What is not yet specified


The files do not provide a detailed method for:

- prioritising findings against other product inputs;
- conducting product or technical diagnosis;
- documenting change hypotheses;
- selecting interventions;
- assigning ownership;
- defining release criteria;
- resolving trade-offs between improvements and regressions.

These are named responsibilities, but there is no equivalent of the detailed `10 -> 20 -> 30` methodology for carrying them out.

### First closure of this loop


The first complete Product Improvement Loop would be:

```text
failure finding
    → selected investigation
    → product or technical diagnosis
    → change hypothesis
    → implemented candidate
    → rerun relevant cases
    → compare accepted labels and findings
    → release, revise, or reject
```

## 2. Evaluation Knowledge Loop

### What is already defined


This loop has a fairly complete failure-oriented startup path.

#### Evaluation design and coverage


The user-input guide provides:

```text
Product definition
    → evaluation boundary
    → coverage requirements
    → dimensions
    → tuples
    → user inputs
    → evaluation cases
    → coverage-reviewed starting set
```


The inputs can come from real usage, manual construction, or systematic synthetic generation. Real inputs are preferred when suitable, while synthetic inputs fill product-derived coverage gaps. Cases include fixtures and relevant expected conditions, and the combined set is reviewed against jobs, guarantees, critical failures, routes, permissions, tools, and operating conditions.

The intended initial sample is explicitly a **discovery and baseline set**, rather than a sample from which one definitive product-wide quality score should be calculated. Approximately 100 executed cases is given as a heuristic, while the required coverage governs the final number and allocation.

#### Failure understanding


The error-analysis guide provides the discovery method:

```text
discovery sample
    → complete traces
    → initial coding
    → focused coding
    → category development through constant comparison
    → theoretical sampling and refinement
    → integrated failure model
```


It defines concrete initial observations, focused codes, category boundaries, representative and contradictory cases, traceability to incidents, iteration, re-annotation, and saturation reasoning. It also clearly separates discovery from operationalisation and measurement.

#### Operationalisation and measurement


The failure-model-use guide provides:

```text
failure mode
    → Pass and Fail rules
    → evaluator
    → evaluator validation
    → Pass / Fail / Not applicable / Unknown labels
    → measurements and comparisons
    → findings
```


It defines code-based, reference-based, model-based, and human evaluation methods; validation against trusted labels; trace-level evidence requirements; measurement denominators; system-version comparison; evaluator quality; uncertainty; and the limits implied by different samples.

#### Internal feedback paths


The loop already contains several feedback mechanisms:

- real inputs and traces revise the evaluation boundary and coverage model;
- new behaviour reopens failure discovery;
- poorly fitting incidents cause failure modes to be added, split, merged, or clarified;
- evaluator disagreement may require criterion or evaluator revision;
- changed definitions trigger relabelling of affected traces;
- new cases support theoretical sampling and taxonomy refinement.

### What must exist for startup


The minimum starting capability is:

1. Product and domain owners who can define and review jobs, guarantees, boundaries, fixtures, and observed failures.
2. A starting pool of real, manual, or synthetic inputs.
3. A way to assemble executable cases with fixtures and expected conditions.
4. A reviewable set of complete traces.
5. A human-led coding and comparison process.
6. A place to preserve observations, categories, examples, criteria, labels, and their links to traces.

Automated evaluators are not a prerequisite. The material explicitly allows human evaluation while definitions are changing or automated evaluators remain unvalidated.

### What is not yet specified


Several elements remain incomplete or external to the attachments:

- `[11 Building Balanced Set]({{< ref "ai-engineering/evaluation/11-building-balanced-set" >}})` is referenced as the fuller coverage-balancing method but was not provided.
- `[Taxonomy]({{< ref "ai-engineering/evaluation/taxonomy" >}})` is referenced separately, although much of its development method appears in the error-analysis guide.
- The detailed path is predominantly **failure-oriented**. Successful task completion, user outcomes, usability, cost, latency, and other quality lenses are acknowledged but not developed to the same depth.
- The artefact model names decision rules, thresholds, versioned datasets, and evaluator versions, but no concrete storage or governance method is defined.
- There is no explicit procedure for selecting which discovered failure modes should be operationalised first.

### First closure of this loop

```text
starting set
    → complete traces
    → initial observations
    → focused codes and categories
    → provisional failure model
    → selected operational criteria
    → accepted labels
    → new or poorly fitting traces
    → revise coverage, failure model, evaluator, or labels
```


This is the loop for which the current files provide the clearest startup method.

## 3. Evaluation Infrastructure Loop

### What is already defined


The infrastructure loop owns instrumentation, storage, pipelines, and evaluation tooling. Its loop is:

```text
capture and evaluate executions
    → identify evidence, coverage, or tooling gaps
    → improve instrumentation, storage, or pipelines
    → validate completeness and reliability
    → use the improved infrastructure
```


The files specify the content required in a complete trace:

- initial user input;
- conversation and environment state;
- intermediate model outputs;
- tool invocations and results;
- state changes;
- final response or action;
- relevant outcomes;
- system version;
- prompt version;
- model configuration;
- fixture version;
- tool configuration.

The analyst must be able to follow the execution sequence and connect each analytical claim to supporting trace evidence. Long traces may require an observability interface.

The current startup description also defines a minimum evidence path:

```text
Execution
    → trace and outcome capture
    → storage
    → human review
```


The stated objective is a usable evidence path rather than a complete evaluation platform.

The failure-model guide provides an important infrastructure control:

```text
required evidence unavailable
    → Unknown
    → improve trace capture
    → capture or execute again
    → rerun evaluator
```


`Unknown` therefore becomes an explicit signal of an infrastructure limitation rather than being silently counted as Pass or Fail.

The files also name concrete infrastructure failure signals:

- missing conversation history;
- missing tool results;
- unknown system version;
- missing state changes;
- inability to connect an action with its result;
- inaccessible or inefficient review processes.

### What must exist for startup


The initial infrastructure only needs to support the controlled offline path:

1. Execute a case against a defined system and environment configuration.
2. Capture the complete execution trace and relevant outcome.
3. Preserve configuration and fixture identity.
4. Store the trace so it remains addressable.
5. Present the trace for human review.
6. Link observations and labels back to the relevant trace events.
7. Re-execute or recapture after instrumentation changes.

This is enough to support discovery and the first labelled dataset. Online monitoring, synchronous controls, CI gates, and large-scale automated pipelines can follow later.

### What is not yet specified


The infrastructure loop is the least operationally developed part of the material. The files do not define:

- a trace schema;
- identifiers linking cases, executions, traces, evaluator runs, and labels;
- storage architecture;
- an evaluation runner;
- reproducibility controls;
- fixture provisioning;
- sampling pipelines;
- annotation or adjudication interfaces;
- trace completeness validation;
- evaluator execution infrastructure;
- dataset and evaluator registries;
- online capture and monitoring architecture;
- CI/CD integration mechanics;
- access control or retention policies.

The operational architecture names offline, online synchronous, and online asynchronous planes, plus release gates and runtime controls, but these are architectural placements rather than a startup implementation method.

### First closure of this loop

```text
execute starting case
    → capture trace
    → reviewer or evaluator cannot decide
    → mark Unknown or record review friction
    → identify missing evidence or tooling
    → improve instrumentation or review interface
    → rerun case
    → obtain sufficient evidence
```

## 4. Role of the Data Flywheel at startup


The Data Flywheel does not require a separate bootstrap sequence because it is not a fourth loop. It connects usage data to the three loop-owned objects.

At startup, production data may be sparse. The files already provide a substitute:

```text
real inputs where available
    + manual cases
    + systematic synthetic cases
    → controlled starting set
```


This lets the evaluation subsystem begin before a mature production flywheel exists. As real usage accumulates:

- Infrastructure captures and links executions, outcomes, feedback, and incidents.
- Knowledge qualifies, selects, interprets, and labels them.
- Product Improvement uses the resulting findings and assets.
- Changed product behaviour produces further usage and data.

## What the startup section should therefore express


The startup sequence should describe the **connection of existing loop capabilities**, rather than imply that the three complete loops are constructed linearly.

The most accurate sequence from the attached material is:

```text
1. Product Improvement Loop supplies
   - an executable product slice;
   - product definition;
   - architecture and operating constraints.

2. Evaluation Infrastructure Loop establishes
   - controlled case execution;
   - complete trace and outcome capture;
   - storage and human review.

3. Evaluation Knowledge Loop constructs
   - product-derived coverage requirements;
   - evaluation cases;
   - a balanced discovery starting set.

4. Evaluation Knowledge Loop develops
   - trace-linked observations;
   - focused codes and categories;
   - an initial failure model.

5. Evaluation Knowledge and Infrastructure operationalise
   - selected criteria;
   - human or automated evaluators;
   - accepted labels and measurements.

6. Product Improvement Loop consumes
   - scoped findings;
   - supporting traces;
   - regression cases and success criteria.

7. A product change is implemented and re-executed.

8. The result is routed by ownership:
   - product failure or regression → Product Improvement;
   - poorly fitting behaviour or judgment → Evaluation Knowledge;
   - missing evidence or review capability → Evaluation Infrastructure.
```


The substantive gap is therefore not the startup order. It is that the three bodies of material have unequal operational depth:

|Loop|Current state in the files|
|---|---|
|Product Improvement|Clear ownership and lifecycle; detailed improvement method absent|
|Evaluation Knowledge|Detailed failure-oriented bootstrap from coverage through findings|
|Evaluation Infrastructure|Minimum evidence requirements defined; implementation method largely absent|

That asymmetry should drive the next work on `Starting the Evaluation System`.
