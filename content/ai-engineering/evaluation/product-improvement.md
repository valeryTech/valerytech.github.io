---
draft: false
toc: true
title: "Product Improvement"
linkTitle: "Product Improvement"
---
Here we're watching at the evaluation from the broader perspective of product improvement.

# AI Product Improvement System

## Purpose


The **AI Product Improvement System** is the overall system through which an organization understands how an AI product behaves and turns that understanding into product changes.

It connects product development, evaluation, observability, data work, domain judgment, release decisions, and production monitoring.

The system exists because AI-product behavior is difficult to define and control completely in advance. Behavior emerges from the ... .

The system must therefore support continuous learning:

```text
Observe product behavior
          ↓
Understand what happened
          ↓
Decide what should change
          ↓
Implement and validate the change
          ↓
Deploy and observe the result
          ↺
```


The AI Product Improvement System is broader than evaluation. Evaluation is one of its main capabilities, but product improvement may also begin from strategy, user research, support cases, incidents, business requirements, engineering constraints, operational problems, or new technical capabilities.

## System Structure


The system has an operating model built around three connected learning loops:

- the **Product Improvement Loop**;
- the **Evaluation Knowledge Loop**;
- the **Evaluation Infrastructure Loop**.

Each loop owns changes to one persistent object.

|Loop|Object it owns|Central question|
|---|---|---|
|Product Improvement Loop|AI product|How should the product change?|
|Evaluation Knowledge Loop|Evaluation knowledge|What behavior matters, and how should it be judged?|
|Evaluation Infrastructure Loop|Evaluation infrastructure|Can the required evidence be captured and evaluated reliably?|

The **Data Flywheel** connects the loops. It turns product usage into data, evidence, findings, and reusable learning assets.

The Evaluation Knowledge Loop and Evaluation Infrastructure Loop together form the **evaluation subsystem**.

```text
AI Product Improvement System
│
├── Product Improvement Loop
│     Owns changes to the AI product
│
├── Evaluation Subsystem
│   │
│   ├── Evaluation Knowledge Loop
│   │     Owns evaluation knowledge
│   │
│   └── Evaluation Infrastructure Loop
│         Owns evaluation infrastructure
│
└── Data Flywheel
      Connects product usage, data,
      learning assets, and the loops
```

## Product Improvement Loop


The **Product Improvement Loop** owns changes to the AI product.

Its central question is:

> How should the product change to behave better and produce better outcomes?

The loop receives inputs from many sources:

- **evidence:** evaluations, flywheel outputs, metrics;
- **user signals:** feedback, research, support cases;
- **risk and operational signals:** incidents, safety, compliance;
- **constraints and demands:** engineering constraints, requirements;
- **opportunities:** new models, tools, and platform capabilities.

The loop turns those inputs into product decisions and implemented changes.

```text
Evidence, goals, opportunities, and constraints
                         ↓
              Identify and prioritize
                         ↓
                 Diagnose the issue
                         ↓
              Define a change hypothesis
                         ↓
             Design and implement the change
                         ↓
                Evaluate and validate
                         ↓
                 Deploy and monitor
                         ↺
```


The Product Improvement Loop owns the end-to-end process for improving the AI product:

- identifying and framing improvement opportunities;
- prioritizing which changes to pursue;
- diagnosing product and technical causes;
- defining success criteria and selecting interventions;
- implementing, validating, and releasing changes;
- monitoring production behavior and outcomes;
- using the results to guide the next iteration.

## Evaluation Knowledge Loop (draft)


The **Evaluation Knowledge Loop** owns the explicit understanding of product quality and failure.

Its central question is:

> What behavior matters, and how should it be judged?

AI-product quality is often only partly defined before the product is used. Teams discover important requirements, failures, edge cases, and ambiguities by reviewing real and simulated executions.

The Evaluation Knowledge Loop turns those observations into reusable knowledge.

```text
Review executions and outcomes
              ↓
Observe success, failure, and ambiguity
              ↓
Define and refine quality criteria
              ↓
Create labels and representative examples
              ↓
Build datasets, rubrics, and evaluators
              ↓
Apply them to new behavior
              ↓
Refine the knowledge
              ↺
```

## Evaluation Infrastructure Loop


The **Evaluation Infrastructure Loop** owns the machinery used to capture evidence and apply evaluation knowledge.

Its central question is:

> Can the required evidence be captured and evaluated reliably?

```text
Capture and evaluate executions
              ↓
Identify evidence, coverage, or tooling gaps
              ↓
Improve instrumentation, storage, or pipelines
              ↓
Validate completeness and reliability
              ↓
Use the improved infrastructure
              ↺
```

## Data Flywheel


The **Data Flywheel** is a separate usage-derived learning mechanism within the AI Product Improvement System.

It turns AI-product usage into trusted data and reusable learning assets that support product improvement.

```text
Product usage and operations
              ↓
Executions, outcomes, feedback, and incidents
              ↓
Capture and link data
              ↓
Qualify, select, and curate
              ↓
Interpret and label
              ↓
Build reusable learning assets
              ↓
Feed the learning loops
```


The Data Flywheel is not a fourth learning loop. It does not own a separate persistent object. It connects product usage with the three objects already owned by the learning loops.

The Evaluation Infrastructure Loop makes product data available and usable.

The Evaluation Knowledge Loop interprets the data and turns judgment into reusable knowledge.

The Product Improvement Loop uses the resulting findings and assets, together with other inputs, to decide how the product should change.

```text
Evaluation Infrastructure Loop
Captures and processes product data
              ↓
Evaluation Knowledge Loop
Interprets behavior and creates reusable knowledge
              ↓
Product Improvement Loop
Uses the knowledge to change the product
              ↓
Changed product produces new usage and data
              ↺
```

### Closing the flywheel


The flywheel closes through the Product Improvement Loop: the Data Flywheel produces learning and the Product Improvement Loop converts learning and other inputs into deployed product changes.

## Evaluation Subsystem


The **Evaluation Knowledge Loop** and **Evaluation Infrastructure Loop** together form the evaluation subsystem.

### Evaluation inside the Data Flywheel


Within the Data Flywheel, evaluation turns raw behavior into meaningful evidence.

```text
Execution and outcome data
              ↓
Evaluation judgment
              ↓
Labels, findings, and quality definitions
              ↓
Reusable datasets and evaluators
```


Evaluation helps determine:

- what happened;
- what should have happened;
- why the difference matters;
- which evidence supports the judgment;
- whether the evidence is sufficient;
- whether the case should become a reusable asset.

### Evaluation inside the Product Improvement Loop


Within the Product Improvement Loop, evaluation validates candidate and deployed changes.

```text
Candidate product change
              ↓
Offline evaluation
              ↓
Release decision
              ↓
Deployment
              ↓
Online evaluation
              ↓
Observed production effects
```


Evaluation produces scoped claims.

Examples include:

- a candidate reduces a known failure on the regression dataset;
- task completion improves for a defined workflow;
- one cohort improves while another regresses;
- latency or cost increases beyond an acceptable limit;
- the available evidence is insufficient to support release;
- no regression was found within the current evaluation coverage.

Evaluation does not prove that a product is universally good. Its conclusions are limited by the available cases, evidence, evaluators, environments, and production coverage.

## Offline and Online Planes


The operating model works across two execution planes.

### Offline plane


The offline plane supports controlled development and comparison.

```text
Candidate product change
          ↓
Offline evaluation
          ↓
Comparison with baseline and release criteria
          ↓
Accept, reject, or revise
```


Its main limitation is coverage. It can evaluate only the behavior represented in its datasets, environments, criteria, and evaluators.

### Online plane (Online loops)


The online plane examines deployed behavior.

## Evaluation Pyramid


The evaluation subsystem uses several methods with different cost, volume, and judgment depth.

```text
                    Human and domain review
                  Low volume, high authority
                              ▲
                              │
                    Model-based evaluators
                 Semantic and probabilistic
                              ▲
                              │
                  Deterministic code checks
              Fast, stable, cheap, repeatable
                              ▲
                              │
                   Hard constraints and gates
              Permissions, validation, invariants
```

## Alternative: Data and Evidence Flywheel


Common flywheel structure:

```text
1. Observe
Product usage produces executions, outcomes, feedback, and incidents.

2. Capture
Infrastructure records enough context to reconstruct behavior and outcomes.

3. Select
Sampling identifies representative, high-risk, uncertain, novel, or decision-relevant cases.

4. Interpret
Humans and automated checks identify successes, failures, ambiguity, and evidence gaps.

5. Systematize
Recurring findings become labels, failure categories, behavioral requirements, and rubrics.

6. Compile
Evaluation knowledge becomes versioned datasets, deterministic checks, scenario tests,
model-based evaluators, thresholds, and review procedures.

7. Evaluate
Evaluation assets are applied to baselines, candidate changes, and deployed behavior.

8. Decide and improve
Evidence is used to prioritize and implement product, knowledge, or infrastructure changes.

9. Deploy and validate
Changes are released, monitored, and assessed against real behavior and downstream outcomes.

10. Repeat
New behavior creates new evidence, requirements, failure modes, and evaluation gaps.
```


Under the broader formulation, the **Data Flywheel is one mechanism that supplies and accelerates product improvement**. Evaluation should be modeled as a **cross-cutting knowledge and control subsystem** that participates in the flywheel but is not contained entirely within it.
