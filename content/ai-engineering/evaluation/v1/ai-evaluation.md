---
draft: false
toc: true
title: "AI Evaluation as an Engineering Learning System"
linkTitle: "AI Evaluation"
---

AI evaluation connects product intent with observed system behaviour. It turns human and automated judgment into reusable knowledge and uses that knowledge to produce evidence for product decisions.

## What Is AI Evaluation?


AI evaluation is the engineering practice of producing and applying trustworthy, scoped, and decision-relevant claims about how an AI system behaves.

It connects five forms of work:

1. **Define intended behaviour.**
    Make explicit the user jobs, product guarantees, invariants, supported capabilities, prohibited actions, and operating conditions that matter.
2. **Observe actual behaviour.**
    Execute the system and capture enough evidence to reconstruct what happened, including user context, model outputs, retrieval, tool calls, state changes, final responses, and downstream outcomes.
3. **Judge observed behaviour.**
    Determine whether an execution is acceptable using product rules, code-based checks, reference comparisons, model-based evaluators, or human review.
4. **Compile judgment into reusable evaluation knowledge.**
    Convert observations into criteria, failure models, representative examples, labelled datasets, evaluator definitions, thresholds, and decision rules.
5. **Apply the resulting evidence.**
    Use evaluation findings to investigate failures, compare system versions, prevent regressions, support release decisions, monitor production behaviour, and govern product risk.

Evaluation is therefore broader than running a test suite or calculating a quality score. It is an iterative subsystem within AI engineering that improves both the product and the ability to understand the product.

A compact definition is:

> **AI evaluation is an iterative, evidence-driven engineering practice that makes intended behaviour explicit, captures representative evidence of actual behaviour, applies validated judgment, compiles that judgment into reusable evaluation knowledge, and uses the resulting findings to improve and govern the product.**

## Why AI Evaluation Is a Learning System


AI applications are probabilistic, context-sensitive, and distributed across models, prompts, retrieval, tools, state, policies, business logic, and user experience.

Their desired behaviour is usually only partially specified before deployment. New user behaviour, system conditions, and failure modes emerge through execution. A change intended to improve one behaviour may also create regressions elsewhere.

The central engineering problem is therefore:

> **How can a team intentionally improve and safely operate a context-sensitive, probabilistic product when intended behaviour is only partially specified, actual behaviour emerges during execution, and changes can have uncertain effects?**

Evaluation addresses the knowledge and control uncertainty within this problem.

Its corresponding question is:

> **Given product intent, an evolving AI system, and a changing operating environment, how can a team produce trustworthy evidence about what the product does, whether that behaviour is acceptable, where failures occur, and whether a proposed change improves the product?**

## The Three Learning Loops


The evaluation operating model contains three loops, distinguished by the object each loop changes.

**Product Improvement Loop**

The Product Improvement Loop changes system behaviour. Details are in [Product Improvement]({{< ref "ai-engineering/evaluation/v1/product-improvement" >}}).

**Evaluation Knowledge Loop**

The Evaluation Knowledge Loop owns the team's definition and understanding of quality. This loop is the conceptual centre of evaluation. It explains how observations become reusable evaluation knowledge and how that knowledge remains responsive to new evidence.

**Evaluation Infrastructure Loop**

The Evaluation Infrastructure Loop changes how evidence is captured, stored, inspected, and evaluated.

```text
Missing or inaccessible evidence
    ↓
Instrumentation or tooling change
    ↓
Improved trace capture and evaluation
    ↓
New execution or evaluation gap
    ↺
```


Examples include adding missing conversation history, recording tool responses, preserving system and prompt versions, connecting actions with their outcomes, or improving review interfaces.

The loops are distinct but connected. A single trace review may reveal:

- a product failure requiring a system change;
- an unclear criterion requiring evaluation-knowledge refinement;
- missing evidence requiring an instrumentation change.

## The Evaluation Knowledge Loop


The Evaluation Knowledge Loop develops and revises the team's explicit, evidence-linked understanding of which product behaviours matter and how they should be judged. It connects evaluation coverage, trace analysis, criteria and failure models, evaluators, labels, measurements, and findings. The sequence below describes the failure-oriented path through the loop; other quality lenses use the same relationship between observed behaviour, reusable judgment, and application.

```text
Product intent and observed user behaviour
    ↓
[[10-user-inputs|Build and maintain representative user inputs]]
    ↓
Evaluation cases + fixtures + system configuration
    ↓ execute
Complete traces and outcomes
    ↓
[[20-error-analysis|Discover and structure recurring failures]]
    ↓
Trace-linked observations, categories, and failure model
    ↓
[[30-failure-model-use|Operationalise, measure, and use the failure model]]
    ↓
Criteria and evaluators
    ↓
Labels, measurements, and findings
    ↓
New executions, disagreements, and poorly fitting cases
    ↺ revise coverage, failure definitions, criteria, evaluators, and labels
```

### Inputs Establish and Revise Coverage


[10 User Inputs]({{< ref "ai-engineering/evaluation/v1/10-user-inputs" >}}) describes how product intent becomes coverage requirements and a representative set of real, manually written, and synthetic user inputs. Inputs are combined with fixtures and expected conditions to form executable evaluation cases; execution produces the traces analysed downstream. The coverage model remains provisional: observed user behaviour and later failures may require changes to the evaluation boundary, dimensions, tuples, fixtures, and case allocation.

### Error Analysis Develops the Failure Model


[20 Error Analysis]({{< ref "ai-engineering/evaluation/v1/20-error-analysis" >}}) uses complete traces to identify concrete failure incidents, compare them across executions, and develop an application-specific failure model. It preserves the dependency from each failure mode back to representative incidents and supporting trace evidence. Discovery remains distinct from measurement so that categories are developed from observed behaviour before they are narrowed into operational checks.

### Operationalisation Applies and Tests the Knowledge


[[30-failure-model-use]] converts selected failure modes into explicit criteria and validated evaluators, applies them to complete traces, and produces accepted labels, measurements, comparisons, and findings. These findings support the Product Improvement Loop, while evaluator application also tests the evaluation knowledge itself: unclear cases, evaluator disagreements, and new failure patterns may require the failure model, criteria, examples, evaluators, or existing labels to be revised.

The dependencies are bidirectional. Product intent and observed usage shape coverage; coverage determines which behaviours can be observed; traces support the failure model; the failure model governs evaluators; and evaluator application produces new evidence about both the product and the adequacy of the evaluation knowledge. Findings that concern another persistent object are routed to the appropriate loop below.

### Route Findings to the Appropriate Loop


Evaluation findings do not all imply a product change.

```text
Observed product failure
    → Product Improvement Loop

New or poorly fitting behaviour
    → Evaluation Knowledge Loop

Unclear or overlapping criterion
    → Evaluation Knowledge Loop

Incorrect evaluator decision
    → Evaluation Knowledge Loop

Missing trace evidence
    → Evaluation Infrastructure Loop

Inaccessible or inefficient review process
    → Evaluation Infrastructure Loop
```


When a failure definition or evaluator changes, affected traces may need to be relabelled.

When required evidence is unavailable, instrumentation should be improved and the relevant executions captured again.

## About Step-by-Step Instructions


AI evaluation can be presented as a step-by-step process. This is useful, especially for teams that are just getting started, because it helps them establish the first version of an evaluation system.

However, this view can make the work seem more linear than it really is. AI development is iterative. In practice, the product, evaluation knowledge, and evaluation infrastructure evolve through several connected loops that run continuously.

We can still define a startup sequence to put these loops into operation. That sequence explains how to begin, while the loops explain how the work continues over time. The startup sequence should therefore be understood as a set of initial actions within a broader operating system.

#todo add picture with gears and starting the machine

## Startup (Kick-off) Sequence: Putting the Loops into Operation


**Starting the Evaluation System**

The three learning loops describe continuous operation, but they assume that the product, evidence path, and initial evaluation knowledge already exist. Starting the evaluation system therefore requires a temporary dependency order that establishes the first repeatable path from product intent to product evidence and a decision.

A useful metaphor is a mechanism made of interlocking gears:

- the **product-improvement gear** changes system behaviour;
- the **evaluation-knowledge gear** changes the team's understanding of quality;
- the **evaluation-infrastructure gear** changes how evidence is captured and applied.

The startup sequence places these gears, connects them, and supplies the initial product behaviour and evidence required to make them turn. After startup, they operate continuously and can move together: one trace review may drive a product fix, a criterion refinement, and an instrumentation change.

A practical startup sequence is under design in [01 Starting Sequence]({{< ref "ai-engineering/evaluation/v1/01-starting-sequence" >}}).

## Operational Evaluation Architecture


The learning loops describe how evaluation knowledge changes. The operational architecture describes how evaluators are selected, where they run, and how their evidence influences engineering and release decisions.

### Evaluation Pyramid and Integration with the Test Pyramid


Evaluation methods should be layered by determinism, cost, speed, and judgment complexity:

```text
                    Human evaluation
             ambiguous, novel, high-stakes cases
                           ▲
                  Model-based evaluation
             semantic and behavioural judgment
                           ▲
                 Reference-based evaluation
              comparison with trusted outcomes
                           ▲
                    Code-based evaluation
         schemas, fields, tool calls, invariants, rules
```


The broad base should use deterministic checks wherever the required behaviour can be expressed reliably. Examples include validating output structure, checking required fields, confirming that the correct tool was called, verifying permissions, and testing state transitions. These checks are faster, cheaper, and easier to debug than model-based judges.

Higher layers are used when lower layers cannot express the relevant judgment. Model-based evaluators are appropriate for semantic or contextual criteria; human review remains necessary for unstable definitions, novel behaviour, adjudication, and consequential decisions.

This evaluation pyramid complements the conventional software test pyramid rather than replacing it:

- unit and component tests validate deterministic implementation behaviour;
- integration and end-to-end tests validate system paths and dependencies;
- evaluation cases examine probabilistic behaviour across representative conditions;
- production evaluation checks how the system behaves under the live input distribution.

A single execution may therefore be checked by ordinary assertions, code-based evaluators, model-based evaluators, and selective human review.

### Execution Topology


Evaluations can run in three main locations:

| Plane               | When it runs                                                 | Typical purpose                                                                    |
| ------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Offline             | Before deployment against fixed, sampled, or generated cases | Discovery, regression testing, candidate comparison, and release evidence          |
| Online synchronous  | Inside the live request path                                 | Deterministic safety checks, policy enforcement, validation, and blocking controls |
| Online asynchronous | After or alongside the live request                          | Monitoring, sampling, failure discovery, drift detection, and dataset growth       |

Placement depends on latency, cost, reliability, and consequence. A slow or probabilistic judge should not become a synchronous gate unless its benefit justifies the operational risk. Online findings should feed new cases and failure models into the offline plane; offline evaluators should move online only when their behaviour and operational cost are sufficiently understood.

### Integration into CI/CD and Release Gates


Evaluation evidence can support several levels of automation:

```text
Informational result
    → visible to the team but does not block

Warning threshold
    → requires review or an explicit exception

Release gate
    → blocks when a validated critical criterion fails

Runtime control
    → prevents or redirects a live action
```


Gates should be scoped to stable criteria, representative cases, validated evaluators, and explicit decision rules. A noisy aggregate score is a poor release gate. Critical invariants and known regression cases are stronger candidates because the expected behaviour and consequence of failure are clear.

Every gate should record the system version, dataset version, evaluator version, threshold, exceptions, and supporting traces. This preserves the ability to explain why a release passed or failed and whether results remain comparable after the evaluation definition changes.

### Architectural View

```text
AI Evaluation Subsystem
├── Product definition and coverage
├── Execution and evidence layer
│   ├── Offline evaluation
│   ├── Online synchronous controls
│   └── Online asynchronous monitoring
├── Evaluation knowledge
│   ├── Observations and taxonomy
│   ├── Criteria and failure models
│   └── Cases, datasets, and labels
├── Evaluation methods
│   ├── Code-based checks
│   ├── Reference comparisons
│   ├── Model-based judges
│   └── Human review
└── Decision integration
    ├── Investigation and product changes
    ├── CI/CD and release gates
    ├── Production monitoring
    └── Risk controls
```


The architecture is connected by traceability: product intent determines coverage; executions produce evidence; evaluation knowledge turns evidence into reusable judgment; and decision rules apply the resulting findings to product operation.

## Running Example: AI-Assisted Property Management


An AI-assisted property-management application is a useful running example because it contains the messiness of a real AI product rather than a simplified question-answering task.

The system may help property managers coordinate maintenance, communicate with tenants, search property information, schedule vendors, and update records. Users may interact through voice, text messaging, or a chatbot. A single workflow can involve retrieval, tool calls, multi-turn conversation, permissions, state changes, and downstream real-world actions.

Suppose the team has an initial product that appears to work during informal testing but needs to answer two questions:

1. What is going wrong across realistic executions?
2. How can the product be improved systematically beyond ad hoc "vibe checks"?

The evaluation system begins by defining important jobs and guarantees, collecting full traces, and reviewing concrete failures. It may discover behaviours such as losing a tenant's stated availability, inventing a property feature, scheduling without authorisation, or claiming success after a tool failure. Those observations become a property-management-specific taxonomy, regression cases, evaluators, and release evidence.

This example can be used throughout the loops:

- a scheduling error enters the Product Improvement Loop;
- a newly observed constraint-handling pattern enters the Evaluation Knowledge Loop;
- a missing vendor-tool response enters the Evaluation Infrastructure Loop.

## Taxonomy


The evaluation taxonomy organises the recurring, application-specific behaviours discovered through trace review. It should remain connected to concrete observations, examples, product requirements, and operational criteria rather than becoming a static list of generic AI failure labels.

See [Taxonomy]({{< ref "ai-engineering/evaluation/v1/taxonomy" >}}).

## Evaluation Artefacts


The Evaluation Knowledge Loop produces several related but distinct artefacts:

|Artefact|Purpose|
|---|---|
|Product definition|States the jobs, guarantees, constraints, and failures that matter|
|Coverage requirement|States what behaviours and conditions the evaluation must represent|
|Evaluation case|Defines an executable input, fixture, and relevant expected condition|
|Trace|Records what the system actually did|
|Observation|Describes a concrete behaviour found in a trace|
|Evaluation model|Organises recurring quality or failure patterns|
|Criterion|Defines how a particular behaviour should be judged|
|Evaluator|Implements or applies a criterion|
|Label|Records the judgment for one execution|
|Measurement|Aggregates labels across a defined sample|
|Finding|Interprets measurements and evidence for a product decision|
|Decision rule|Specifies how evidence influences release, monitoring, or intervention|

Preserving these distinctions prevents several common errors:

- treating an input as a complete evaluation case;
- treating a final response as the complete execution;
- treating an observation as a stable failure category;
- treating a failure category as an operational evaluator;
- treating an evaluator output as a product finding;
- treating a measured rate as universally representative;
- treating missing evidence as successful behaviour.

## Evaluation as Continuous Knowledge Development


Evaluation knowledge is never final.

Product requirements change. Users introduce new goals and language. Models, tools, data, and workflows evolve. New traces reveal behaviours that were not represented in the previous coverage model or failure taxonomy. Existing evaluators become incomplete or unreliable.
