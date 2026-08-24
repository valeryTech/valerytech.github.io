---
draft: false
toc: true
title: "AI Evaluation as an Iterative Engineering Practice"
linkTitle: "AI Evaluation Revised"
---

AI evaluation connects product intent, observed system behaviour, and a defined decision or knowledge need. It uses deliberate probes and operational observations to produce evidence, develops explicit Quality Understanding, and applies that understanding to product decisions.

## What Is AI Evaluation?


AI evaluation is the engineering practice of producing and applying trustworthy, scoped, and decision-relevant claims about how an AI System behaves.

It connects five forms of work:

1. **Frame the decision and intended behaviour.**
   Make explicit the participant, decision or uncertainty, user jobs, product guarantees, invariants, supported capabilities, prohibited actions, and operating conditions that matter.
2. **Probe and observe actual behaviour.**
   Deliberately execute the system under selected conditions or observe normal operation, then capture enough evidence to reconstruct what happened, including user context, model outputs, retrieval, tool calls, state changes, final responses, and downstream outcomes.
3. **Judge observed behaviour.**
   Determine whether an execution is acceptable using product rules, code-based checks, reference comparisons, model-based evaluators, or human review.
4. **Build reusable Quality Understanding.**
   Convert observations and judgements into coverage requirements, criteria, quality and failure models, representative examples, labelled datasets, evaluator definitions, thresholds, decision rules, and explicit limitations.
5. **Apply the resulting evidence.**
   Use evaluation findings to investigate failures, compare system versions, prevent regressions, support release decisions, monitor production behaviour, and govern product risk.

Evaluation is broader than running a test suite or calculating a quality score. It is an iterative subsystem within the AI Product Improvement System that helps a team understand product behaviour, produce decision-relevant evidence, and verify the effects of change.

A compact definition is:

> **AI evaluation is an iterative, evidence-driven engineering practice that frames a decision or knowledge need, makes intended behaviour explicit, probes and observes actual behaviour, applies validated judgement, builds reusable Quality Understanding, and uses the resulting findings to support product improvement and governance decisions.**

Evaluation produces scoped claims. Its conclusions are limited by the cases, samples, environments, evidence, criteria, evaluators, and operating conditions included in the evaluation.

## Why Evaluation Must Be Iterative


AI applications are probabilistic, context-sensitive, and distributed across models, prompts, retrieval, tools, state, policies, business logic, and user experience.

Their desired behaviour is usually only partially specified before deployment. New user behaviour, system conditions, success patterns, and failure modes emerge through execution. A change intended to improve one behaviour may also create regressions elsewhere.

The central engineering problem is therefore:

> **How can a team intentionally improve and safely operate a context-sensitive, probabilistic product when intended behaviour is only partially specified, actual behaviour emerges during execution, and changes can have uncertain effects?**

Evaluation addresses the uncertainty about behaviour, quality, and the effects of change.

Its corresponding question is:

> **Given product intent, an evolving AI System, and a changing operating environment, how can a team produce trustworthy evidence about what the product does, whether that behaviour is acceptable, where failures occur, and whether a proposed change improves the product?**

Evaluation addresses this question through a recurring process:

```text
Decision or knowledge need and product expectations
              ↓
Design a probe or select operational observations
              ↓
Capture and reconstruct behaviour
              ↓
Judge and interpret the evidence
              ↓
Produce findings and apply them to a decision
              ↓
Revise the product, Quality Understanding,
or Evidence Capability when required
              ↺
```


This recurring process spans the three feedback loops described below and owns no additional persistent object.

In this model:

- **Probing** is the deliberate execution or exposure of an AI System under selected conditions to reveal behaviour and produce evidence. Offline evaluation cases, replay, shadow execution, canaries, and controlled experiments are forms of probing.
- **Observation** is the capture of behaviour, context, and outcomes from either a deliberate probe or normal product operation. Traces, outputs, outcomes, feedback, incidents, and operational signals are forms of observation.
- **Quality Understanding** is the team's explicit, versioned, and evidence-linked account of which behaviours matter, what behaviour has been observed, how it should be judged, which evidence supports the judgement, and what remains uncertain.
- **Evidence Capability** is the combined ability to produce, capture, preserve, reconstruct, inspect, evaluate, and use the evidence required for product decisions.

Understanding in this document belongs to the team and the evaluation subsystem. The deployed model may remain unchanged, and causal explanations for observed behaviour may remain unknown.

## Evaluation Within the Three Feedback Loops


The broader [AI Product Improvement System]({{< ref "ai-engineering/evaluation/product-improvement" >}}) contains three feedback loops, distinguished by the persistent object each loop changes. A feedback loop changes an owned persistent object, observes the effect, and uses that evidence in a later revision.

| Feedback loop | Persistent object | Relationship to evaluation |
| --- | --- | --- |
| Product Improvement Loop | Delivered AI Product State | Uses evaluation findings and other inputs to decide and verify product changes |
| Quality Understanding Loop | Quality Understanding | Defines what behaviour matters, interprets observations, and revises how behaviour is judged |
| Evidence Capability Loop | Evidence Capability | Develops the means to produce, capture, reconstruct, evaluate, and use evidence reliably |

The **Quality Understanding Loop** and **Evidence Capability Loop** form the evaluation subsystem. The **Product Improvement Loop** sits outside that subsystem. It uses evaluation findings while retaining responsibility for product priorities, interventions, trade-offs, and release decisions.

### Product Improvement Loop


The Product Improvement Loop changes the Delivered AI Product State so that the product behaves better and produces better outcomes.

Evaluation supports this loop by producing scoped evidence about current behaviour, candidate changes, regressions, operational effects, and remaining uncertainty.

### Quality Understanding Loop


The Quality Understanding Loop owns the team's explicit account of product behaviour and quality. It explains how observations become reusable cases, quality and failure models, criteria, labels, evaluators, findings, and decision rules, and how those artefacts remain responsive to new evidence.

### Evidence Capability Loop


The Evidence Capability Loop develops and revises the team's ability to produce, capture, preserve, reconstruct, inspect, evaluate, and use evidence.

```text
Required evidence or evaluation task
              ↓
Probe, capture, inspect, or evaluate
              ↓
Detect missing evidence, unreliable execution,
or an inefficient review process
              ↓
Improve instrumentation, tooling, or operating practice
              ↓
Verify that the required evidence can now be used
              ↺
```


Examples include adding missing conversation history, recording tool responses, preserving system and prompt versions, linking actions with downstream outcomes, improving sampling, or improving review interfaces.

The loops are distinct but connected. A single trace review may reveal:

- a product failure requiring a change to the Delivered AI Product State;
- an unclear criterion requiring a revision to Quality Understanding;
- missing evidence requiring a change to Evidence Capability.

### Data and Evidence Flywheel


The **Data and Evidence Flywheel** connects product usage with the three feedback loops. It captures and selects executions, outcomes, feedback, and incidents; supports their interpretation; and turns selected evidence into reusable cases, labels, criteria, evaluators, datasets, and findings.

```text
Product usage and operations
              ↓
Executions, outcomes, feedback, and incidents
              ↓
Capture, select, and interpret evidence
              ↓
Reusable cases, labels, criteria, evaluators, and findings
              ↓
Change to Delivered AI Product State, Quality Understanding,
or Evidence Capability
              ↓
New product behaviour and evidence
              ↺
```


The flywheel owns no additional persistent object. The Evidence Capability Loop makes evidence available and usable, the Quality Understanding Loop interprets behaviour and develops reusable judgement, and the Product Improvement Loop uses findings together with other inputs to change the product.

## The Quality Understanding Loop


The Quality Understanding Loop develops and revises the team's explicit, versioned, and evidence-linked understanding of which product behaviours matter, what occurred, how that behaviour should be judged, which evidence supports the judgement, and what remains uncertain.

It connects evaluation coverage, probe design, trace analysis, quality and failure models, criteria, evaluators, labels, measurements, and findings. The sequence below describes the failure-oriented path through the loop; other quality lenses use the same relationship between observed behaviour, reusable judgement, and application.

```text
Product intent, evaluation questions, and observed user behaviour
    ↓
[[10-user-inputs|Build and maintain representative user inputs]]
    ↓
Evaluation cases + fixtures + system configuration
    ↓ probe, execute, and observe
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
    ↺ revise coverage, failure definitions, criteria,
      evaluators, labels, and recorded limitations
```

### Inputs Establish and Revise Coverage


[10 User Inputs]({{< ref "ai-engineering/evaluation/10-user-inputs" >}}) describes how product intent becomes coverage requirements and a representative set of real, manually written, and synthetic user inputs. Inputs are combined with fixtures, system configuration, and relevant expected conditions to form executable evaluation cases.

The cases are deliberate probes of selected product behaviour. Production samples and other operational observations complement them by revealing behaviour that the current offline coverage does not represent.

The coverage model remains provisional. Observed user behaviour and later findings may require changes to the evaluation boundary, dimensions, tuples, fixtures, probe design, and case allocation.

### Error Analysis Develops the Failure Model


[20 Error Analysis]({{< ref "ai-engineering/evaluation/20-error-analysis" >}}) uses complete traces to identify concrete failure incidents, compare them across executions, and develop an application-specific failure model. It preserves the dependency from each failure mode back to representative incidents and supporting trace evidence.

Discovery remains distinct from measurement so that categories are developed from observed behaviour before they are narrowed into operational checks.

### Operationalisation Applies and Tests Quality Understanding


[30 Failure Model Use]({{< ref "ai-engineering/evaluation/30-failure-model-use" >}}) converts selected failure modes into explicit criteria and validated evaluators, applies them to complete traces, and produces accepted labels, measurements, comparisons, and findings.

These findings support the Product Improvement Loop. Evaluator application also tests the current Quality Understanding: unclear cases, evaluator disagreements, new success or failure patterns, and poorly fitting cases may require the coverage model, failure model, criteria, examples, evaluators, labels, or recorded limitations to be revised.

The dependencies are bidirectional. Product intent and observed usage shape coverage; coverage determines which behaviours can be probed and observed; traces support quality and failure models; those models govern criteria and evaluators; and evaluator application produces new evidence about both the product and the adequacy of the current Quality Understanding.

Findings that concern another persistent object are routed to the appropriate loop.

### Route Findings to the Appropriate Loop


Evaluation findings can require changes to different persistent objects.

```text
Observed product failure
    → Product Improvement Loop

New or poorly fitting behaviour
    → Quality Understanding Loop

Unclear or overlapping criterion
    → Quality Understanding Loop

Incorrect evaluator decision
    → Quality Understanding Loop

Missing trace evidence
    → Evidence Capability Loop

Inaccessible or inefficient review process
    → Evidence Capability Loop
```


When a failure definition or evaluator changes, affected traces may need to be relabelled and previous measurements may need to be recomputed.

When required evidence is unavailable, the Evidence Capability Loop should improve the relevant instrumentation, tooling, or operating process and capture the executions again where possible.

## About Step-by-Step Instructions


AI evaluation can be presented as a step-by-step process. This is useful, especially for teams that are just getting started, because it helps them establish the first repeatable path from product intent to evidence and a decision.

This view can make the work seem more linear than it is. In practice, the Delivered AI Product State, Quality Understanding, and Evidence Capability evolve through connected feedback loops.

A startup sequence can still put these loops into operation. The sequence explains how to begin; the feedback loops explain how the work recurs after the initial path exists. The startup sequence is therefore an initial workflow within the broader operating model.

## Startup (Kick-off) Sequence: Putting the Feedback Loops into Operation


**Starting the Evaluation Subsystem**

The three feedback loops describe recurring operation, but they assume that product intent, an evidence path, and an initial Quality Understanding already exist. Starting the evaluation subsystem therefore requires a temporary dependency order that establishes the first repeatable path from product intent to observed behaviour, judgement, evidence, and a decision.

A useful metaphor is a mechanism made of interlocking gears:

- the **product-improvement gear** changes the Delivered AI Product State;
- the **quality-understanding gear** changes the team's explicit understanding of behaviour and quality;
- the **evidence-capability gear** changes the ability to produce and use evidence.

The startup sequence places these gears, connects them, and supplies the initial product behaviour and evidence required to make them turn. After startup, they can move together: one trace review may drive a product fix, a criterion refinement, and an instrumentation or workflow change.

A practical startup sequence is under design in [01 Starting Sequence]({{< ref "ai-engineering/evaluation/01-starting-sequence" >}}).

## Operational Evaluation Architecture


The feedback loops describe which persistent objects change. The operational architecture describes how behaviour is probed and observed, how evaluators are selected, where evaluation runs, how evidence is preserved, and how findings influence engineering and release decisions.

### Evaluation Pyramid and Integration with the Test Pyramid


Evaluation methods should be layered by determinism, cost, speed, and judgement complexity:

```text
                    Human and domain review
             ambiguous, novel, consequential cases
                           ▲
                  Model-based evaluation
             semantic and behavioural judgement
                           ▲
                 Reference-based evaluation
              comparison with trusted outcomes
                           ▲
                    Code-based evaluation
         schemas, fields, tool calls, invariants, rules
```


The broad base should use deterministic checks wherever the required behaviour can be expressed reliably. Examples include validating output structure, checking required fields, confirming that the correct tool was called, verifying permissions, and testing state transitions. These checks are faster, cheaper, and easier to debug than model-based judges.

Higher layers are used when lower layers cannot express the relevant judgement. Model-based evaluators are appropriate for semantic or contextual criteria; human review remains necessary for unstable definitions, novel behaviour, adjudication, and consequential decisions.

This evaluation pyramid complements the conventional software test pyramid:

- unit and component tests validate deterministic implementation behaviour;
- integration and end-to-end tests validate system paths and dependencies;
- evaluation cases probe probabilistic behaviour across representative conditions;
- production evaluation observes behaviour under the live input distribution.

A single execution may therefore be checked by ordinary assertions, code-based evaluators, reference comparisons, model-based evaluators, and selective human review.

### Execution Planes and Placement


Evaluations can run in three main locations:

| Plane | Relationship to live operation | Typical purpose |
| --- | --- | --- |
| Offline | Runs without direct live-user or real-world effects, using fixed, sampled, generated, or replayed cases | Discovery, controlled probing, regression evaluation, candidate comparison, evaluator calibration, and release evidence |
| Online synchronous | Runs inside the live request or action path | Deterministic safety checks, policy enforcement, validation, blocking controls, and fallback selection |
| Online asynchronous | Runs alongside or after live execution | Monitoring, sampling, failure discovery, drift detection, human review, outcome linking, and dataset growth |

Offline is defined by the absence of direct live effects, regardless of deployment status. Replaying a production trace against a candidate or deployed version remains offline when the execution cannot affect the live user or environment.

Placement depends on latency, cost, reliability, and consequence. A slow or probabilistic judge belongs in the synchronous path only when its benefit justifies the operational risk. Online findings should feed new cases, examples, and quality or failure models into the offline plane. Offline evaluators should move online only when their behaviour, reliability, and operational cost are sufficiently understood.

### Integration into CI/CD and Release Gates


Evaluation evidence can support several levels of automation:

```text
Informational result
    → visible to the team; non-blocking

Warning threshold
    → requires review or an explicit exception

Release gate
    → blocks when a validated critical criterion fails

Runtime control
    → prevents, redirects, or escalates a live action
```


Gates should be scoped to stable criteria, representative cases, validated evaluators, and explicit decision rules. A noisy aggregate score is a poor release gate. Critical invariants and known regression cases are stronger candidates because the expected behaviour and consequence of failure are clear.

Every gate should record the product and system version, dataset version, evaluator version, criterion version, threshold, exceptions, and supporting traces. This preserves the ability to explain why a release passed or failed and whether results remain comparable after the evaluation definition changes.

### Architectural View

```text
AI Evaluation Subsystem
├── Decision and expectation framing
│   ├── Product intent and participant decision or knowledge need
│   └── Evaluation questions and coverage requirements
├── Probing, execution, and evidence
│   ├── Offline probes, replay, and candidate comparison
│   ├── Online synchronous controls
│   └── Online asynchronous observation and review
├── Quality Understanding
│   ├── Observations and quality or failure models
│   ├── Cases, criteria, examples, datasets, and labels
│   └── Evaluators, measurements, findings, and limitations
├── Evidence Capability
│   ├── Instrumentation, traces, and outcome linking
│   ├── Runtimes, storage, sampling, and review interfaces
│   └── Versioning, provenance, and reliability controls
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


The architecture is connected by traceability: product intent and a decision or knowledge need determine the evaluation question; the question determines coverage and evidence requirements; probes and operational executions produce evidence; Quality Understanding turns evidence into reusable judgement; Evidence Capability makes the evidence and judgement available reliably; and decision rules apply findings to product operation.

## Running Example: AI-Assisted Property Management


An AI-assisted property-management application is a useful running example because it contains retrieval, tools, state, permissions, multi-turn interaction, and real-world actions.

The system may help property managers coordinate maintenance, communicate with tenants, search property information, schedule vendors, and update records. Users may interact through voice, text messaging, or a chatbot. A single workflow can involve retrieval, tool calls, multi-turn conversation, permissions, state changes, and downstream real-world actions.

Suppose the team has an initial product that appears to work during informal testing but needs to answer two questions:

1. What is going wrong across realistic executions?
2. How can the product be improved systematically beyond ad hoc "vibe checks"?

The evaluation subsystem begins by defining important jobs and guarantees, designing representative probes, collecting complete traces, and reviewing concrete behaviour. It may discover failures such as losing a tenant's stated availability, inventing a property feature, scheduling without authorisation, or claiming success after a tool failure.

Those observations can become a property-management-specific taxonomy, regression cases, criteria, evaluators, and release evidence.

This example can produce findings for all three feedback loops:

- a scheduling error enters the Product Improvement Loop;
- a newly observed constraint-handling pattern enters the Quality Understanding Loop;
- a missing vendor-tool response enters the Evidence Capability Loop.

## Taxonomy


The evaluation taxonomy organises recurring, application-specific behaviours discovered through trace review. It should remain connected to concrete observations, examples, product requirements, criteria, and supporting evidence. Its categories should remain specific to the product and open to revision as new behaviour appears.

See [Taxonomy]({{< ref "ai-engineering/evaluation/taxonomy" >}}).

## Evaluation Artefacts


The evaluation subsystem works with several related but distinct artefacts. Product and domain owners retain ownership of product intent. The Quality Understanding Loop owns the evaluative meaning of coverage requirements, models, criteria, examples, labels, findings, and decision rules. The Evidence Capability Loop owns the means by which cases, production samples, traces, evaluator outputs, and supporting metadata are produced, captured, stored, versioned, inspected, and applied reliably.

| Artefact | Purpose |
| --- | --- |
| Product definition | States the jobs, guarantees, constraints, and failures that matter |
| Evaluation question | States the decision-relevant uncertainty or claim the evaluation will examine |
| Coverage requirement | States which behaviours and conditions the evaluation must represent |
| Evaluation case | Defines an executable input, fixture, configuration, and relevant expected condition |
| Production sample | Defines the live population, selection method, time window, and relevant cohorts |
| Trace | Records what the system actually did |
| Observation | Describes a concrete behaviour found in a trace |
| Evaluation model | Organises recurring quality or failure patterns |
| Criterion | Defines how a particular behaviour should be judged |
| Evaluator | Implements or applies a criterion |
| Label | Records the judgement for one execution |
| Measurement | Aggregates labels across a defined sample |
| Finding | Interprets measurements and evidence for a product decision |
| Decision rule | Specifies how evidence influences release, monitoring, or intervention |

Preserving these distinctions prevents several common errors:

- treating an input as a complete evaluation case;
- treating a final response as the complete execution;
- treating an observation as a stable failure category;
- treating a failure category as an operational evaluator;
- treating an evaluator output as a product finding;
- treating a measured rate as universally representative;
- treating missing evidence as successful behaviour.

A trustworthy finding should preserve traceability among product intent, the evaluation question, coverage, cases or production samples, system versions, traces and outcomes, criteria and evaluator versions, labels, measurements, findings, and the resulting decision.

## Quality Understanding Is Revised Through Use


Quality Understanding is never final.

Product requirements change. Users introduce new goals and language. Models, tools, data, and workflows evolve. New traces reveal behaviours that were not represented in the previous coverage model or failure taxonomy. Existing criteria and evaluators become incomplete or unreliable.

```text
Apply current cases, criteria, and evaluators
              ↓
Encounter disagreement, a blind spot,
or previously unrepresented behaviour
              ↓
Review the supporting evidence
              ↓
Revise coverage, models, criteria,
evaluators, labels, or limitations
              ↓
Reapply and compare
              ↺
```


The revision must be explicit and versioned. When a definition changes, previous labels or measurements may no longer be comparable without relabelling or recomputation.

Quality Understanding remains scoped to the available evidence. It records what the team currently has reason to believe, how that conclusion was reached, and what remains unknown. The purpose is to support defensible product decisions and make later revision possible when new evidence appears.
