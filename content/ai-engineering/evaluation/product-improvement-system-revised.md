---
draft: false
toc: true
title: "Product Improvement System Revised"
linkTitle: "Product Improvement System Revised"
---
# AI Product Improvement System

## A Model for Continuous AI Design, Evaluation, and Delivery

## 1. Purpose


The **AI Product Improvement System** is the operating model through which an organisation designs, evaluates, delivers, operates, and continuously improves an AI product.

The system connects:

- product intent and product decisions;
- AI-system design and implementation;
- experimentation and evaluation;
- observability and production evidence;
- domain and human judgement;
- release and runtime controls;
- explicit, reusable understanding of product quality;
- the capability required to capture and apply evidence.

The model is needed because AI-product development rarely follows a predictable, linear path. AI behaviour is probabilistic, context-sensitive, and influenced by interactions among models, prompts, retrieval, tools, state, policies, external systems, and users. Teams must therefore probe and observe behaviour, interpret evidence, make changes, and verify their effects throughout the product lifecycle.

The system has three connected feedback loops:

1. the **Product Improvement Loop**;
2. the **Quality Understanding Loop**;
3. the **Evidence Capability Loop**.

These loops operate across two execution planes:

1. the **offline plane**;
2. the **online plane**, which includes synchronous and asynchronous execution.

A **Data and Evidence Flywheel** connects product usage to reusable cases, labels, criteria, evaluators, datasets, and findings. It supplies evidence to all three loops.

The resulting model can be stated compactly as:

> **Three feedback loops operating across offline and online execution planes, connected by a Data and Evidence Flywheel.**

## 2. Why AI product improvement requires continuous feedback


AI-product behaviour cannot be specified or predicted completely before deployment.

The product definition may describe intended outcomes, supported workflows, guarantees, invariants, constraints, and unacceptable failures. The implemented AI System may still produce unexpected behaviour because:

- user inputs are open-ended;
- execution depends on context and state;
- model outputs are non-deterministic;
- external data and tools change;
- several components interact during one execution;
- requirements and quality expectations are only partly explicit;
- changes can improve one behaviour while causing regressions elsewhere.

Evaluation therefore addresses a continuing problem of understanding behaviour and judging change:

> Given product intent, an evolving AI System, and a changing operating environment, how can a team produce trustworthy evidence about what the product does, whether its behaviour is acceptable, where failures occur, and whether a proposed change improves the product?

Evaluation connects product intent with observed behaviour. It turns human and automated judgement into an explicit, evidence-linked understanding that can support investigation, comparison, release, monitoring, risk management, and control decisions.

The broader product-improvement system must act on that evidence. It must decide what to prioritise, diagnose causes, select interventions, implement changes, release them, and verify the resulting behaviour and outcomes.

The basic improvement cycle is:

```text
Probe and observe product behaviour
        ↓
Build and revise understanding
        ↓
Decide what should change
        ↓
Implement and validate the change
        ↓
Deploy and verify the effect
        ↺
```


**Probing** deliberately exposes the AI System to selected conditions so that its behaviour can be examined. Offline evaluation cases, replay, shadow execution, canaries, and controlled experiments are forms of probing.

**Observation** captures behaviour that occurs during either deliberate probes or normal product operation. Traces, outputs, outcomes, feedback, incidents, and operational signals are forms of observation.

**Understanding** interprets the available evidence in relation to product intent and a decision need. In this model, understanding is explicit, versioned, linked to evidence, and limited by known coverage and uncertainty.

Evaluation is one of the system's main capabilities. Product improvement may also begin from strategy, user research, support cases, incidents, business requirements, engineering constraints, operational problems, or new technical capabilities.

## 3. How to read the model


The model separates four dimensions that are often combined under the word _loop_.

### 3.1 Feedback loops describe what changes


Each feedback loop owns a persistent object:

- the Delivered AI Product State;
- Quality Understanding;
- Evidence Capability.

A feedback loop exists because its object is revised repeatedly in response to evidence and the effects of each revision are observed.

### 3.2 Execution planes describe where evidence is produced or applied


Evaluation can run:

- offline, outside direct live effects;
- online synchronously, inside a live request or action path;
- online asynchronously, alongside or after live execution.

The plane determines operational conditions such as latency, risk, cost, reproducibility, and access to live behaviour.

### 3.3 Delivery feedback paths describe how evidence moves through the lifecycle


The familiar offline inner loop and online outer loop describe two paths through product delivery:

- controlled experimentation and validation before release;
- observation and evaluation of deployed behaviour.

These are delivery views of the system.

### 3.4 The flywheel describes how usage becomes reusable evidence and evaluation assets


The Data and Evidence Flywheel captures, selects, interprets, and compiles product evidence into reusable cases, labels, criteria, evaluators, datasets, and findings.

These dimensions answer different questions:

|Dimension|Question|
|---|---|
|Feedback loop|What persistent object changes?|
|Execution plane|Where is evidence generated or applied?|
|Delivery feedback path|How does evidence move through delivery?|
|Data and Evidence Flywheel|How does product usage become reusable evidence and evaluation assets?|

## 4. Conceptual foundation

### 4.1 AI Product


An **AI Product** is an intended value-producing capability offered to a defined set of actors.

The AI Product is the normative model of what value should be produced. It may define:

- purpose and intended outcomes; - target users and affected actors; - jobs to be done; - supported capabilities and workflows; - minimum viable scope; - promises and behavioural guarantees; - invariants; - unsupported behaviour and non-guarantees; - unacceptable or critical failures.

Product intent defines expected behaviour:

```text
Product purpose
        ↓
Users and affected actors
        ↓
Jobs and intended outcomes
        ↓
Supported capabilities and workflows
        ↓
Guarantees, invariants, and boundaries
        ↓
Expected product behaviour
```


The AI Product describes what should happen. It does not by itself describe how that behaviour is implemented.

### 4.2 AI System


An **AI System** is the configured technical and operational implementation through which an AI Product produces behaviour and outcomes.

It may include:

- application interfaces and backend services;
- orchestration, workflows, agents, and state machines;
- language, embedding, classification, or multimodal models;
- retrieval, knowledge, context, and memory components;
- tools and external integrations;
- data-processing and indexing pipelines;
- safety, security, and governance controls;
- observability and evaluation components;
- runtime, storage, queues, caches, and deployment infrastructure.

The AI System operates in a context consisting of inputs, environment, configuration, initial state, external dependencies, and applicable controls. That combination produces an execution, observed behaviour, and downstream outcomes.

### 4.3 Delivered AI Product State


For the purpose of loop ownership, this model uses the term **Delivered AI Product State**.

The Delivered AI Product State is the versioned combination of:

1. the product intent currently in force;
2. the configured AI System that implements it;
3. the operating and rollout policy through which users experience it.

This distinction allows the product definition and technical implementation to remain separate while recognising that both may need to change to improve user-facing behaviour.

### 4.4 Participant and decision need


Evaluation begins with a participant who has a goal, task, decision, or uncertainty.

```text
Participant
        ↓
Goal
        ↓
Task or decision
        ↓
Uncertainty
        ↓
Question that must be answered
```


For example:

```text
Product owner
        ↓
Deliver a new feature
        ↓
Decide whether it is ready to release
        ↓
Uncertainty about task success and regressions
        ↓
Does the candidate perform the new workflow
while preserving existing guarantees?
```


A participant's goal does not directly determine an evaluator. It first produces a decision or knowledge need. That need is translated into an evaluation question, evidence requirements, and an appropriate evaluation design.

### 4.5 Evaluation


Evaluation connects:

- expected behaviour from product intent;
- observed behaviour from system executions;
- the participant's decision or knowledge need.

```text
Product intent
    ↓
Expected behaviour ─────────────┐
                                │
AI System + operating context   │
    ↓                           ├──→ Evaluation
Execution                       │
    ↓                           │
Observed behaviour ─────────────┤
                                │
Participant goal                │
    ↓                           │
Decision and uncertainty ───────┘
```


In this model:

> **AI evaluation is a structured engineering process for producing trustworthy, scoped, and decision-relevant evidence about observed AI System behaviour in relation to product expectations and a defined decision or knowledge need.**

Evaluation produces scoped claims. Its conclusions are limited by the cases, samples, environments, evidence, criteria, evaluators, and operating conditions included in the evaluation.

## 5. Structural definitions

### 5.1 Persistent object


A **persistent object** is a versioned body of state that remains across iterations and can be intentionally revised.

The three persistent objects in this model are:

- Delivered AI Product State;
- Quality Understanding;
- Evidence Capability.

### 5.2 Feedback loop


A **feedback loop** is a recurring process that:

1. owns a persistent object;
2. receives evidence about the current state of that object;
3. identifies a relevant gap or opportunity;
4. has authority to change the object;
5. observes the effect of the change;
6. uses the result in a subsequent iteration.

A sequence of activities is not sufficient to define a feedback loop. The sequence must close through evidence, a change to an owned object, and observation of the effect.

### 5.3 Probing


**Probing** is the deliberate execution or exposure of an AI System under selected conditions to reveal behaviour and produce evidence.

Examples include:

- running an offline evaluation case;
- generating boundary or adversarial inputs;
- replaying a production trace against a candidate;
- comparing two system configurations;
- running a candidate in shadow mode;
- exposing a candidate through a canary or A/B test.

Probing is active. It creates or selects conditions for examination.

### 5.4 Observation


**Observation** is the capture of behaviour, context, and outcomes from either a deliberate probe or normal operation.

Observation may include:

- inputs and initial state;
- system and model configuration;
- retrieval and context;
- tool calls and results;
- intermediate actions and state transitions;
- final outputs;
- downstream outcomes;
- user feedback, incidents, and operational signals.

Probing and observation both produce evidence. Probing determines how selected behaviour is elicited; observation records what happened.

### 5.5 Quality Understanding


**Quality Understanding** is the team's explicit, versioned, and evidence-linked account of:

- which product behaviours matter;
- what behaviour has been observed;
- how that behaviour should be judged;
- which evidence supports the judgement;
- where definitions, coverage, or evidence remain uncertain.

It is represented through coverage requirements, cases, quality and failure models, criteria, examples, labels, evaluator definitions, findings, decision rules, and recorded limitations.

Quality Understanding is scoped. It does not imply complete knowledge of the product or a causal explanation for every observed behaviour.

### 5.6 Evidence Capability


**Evidence Capability** is the combined ability to produce, capture, preserve, reconstruct, inspect, evaluate, and use the evidence required for product decisions.

It includes technical infrastructure, interfaces, operating practices, and review processes. Evaluation infrastructure is therefore one part of Evidence Capability.

### 5.7 Execution plane


An **execution plane** is the operational context in which evidence is generated or evaluation is applied.

The plane determines the execution's relationship to live users, live state, and real-world effects.

### 5.8 Workflow


A **workflow** is an ordered set of activities used to accomplish a task. A workflow may occur inside one loop, connect several loops, or run once without forming a loop.

### 5.9 Delivery lifecycle


The **delivery lifecycle** is the end-to-end path through which an opportunity becomes a product change, is evaluated, released, and observed.

### 5.10 Flywheel


A **flywheel** is a reinforcing mechanism that converts repeated product usage into increasingly reusable data, evidence, understanding, and evaluation assets.

A flywheel can support several feedback loops without owning another persistent object.

## 6. Canonical system structure


The AI Product Improvement System contains three connected feedback loops. Each loop owns one persistent object.

|Feedback loop|Persistent object|Central question|
|---|---|---|
|Product Improvement Loop|Delivered AI Product State|How should the product change?|
|Quality Understanding Loop|Quality Understanding|What behaviour matters, what occurred, and how should it be judged?|
|Evidence Capability Loop|Evidence Capability|Can the required evidence be produced and used reliably?|

The Quality Understanding Loop and Evidence Capability Loop together form the **evaluation subsystem**.

The Data and Evidence Flywheel connects product usage, evidence, reusable understanding, evaluation assets, and the three loops.

```text
AI Product Improvement System
│
├── Product Improvement Loop
│     Owns the Delivered AI Product State
│
├── Evaluation Subsystem
│   │
│   ├── Quality Understanding Loop
│   │     Owns Quality Understanding
│   │
│   └── Evidence Capability Loop
│         Owns Evidence Capability
│
└── Data and Evidence Flywheel
      Connects product usage, evidence,
      reusable understanding, evaluation assets,
      and the three loops
```


The three loops are separated by the persistent object each loop changes. The two evaluation loops form the evaluation subsystem.

All three loops can operate across both execution planes.

## 7. Product Improvement Loop

### 7.1 Purpose


The **Product Improvement Loop** changes the Delivered AI Product State so that the product behaves better and produces better outcomes.

Its central question is:

> **How should the product change to behave better and produce better outcomes?**

### 7.2 Persistent object


The loop owns changes to:

- product scope and supported workflows;
- product guarantees, boundaries, and decision rules;
- system architecture and component design;
- prompts, models, tools, retrieval, memory, and orchestration;
- safety and control mechanisms;
- configuration and operating policy;
- release and rollout state.

The loop may revise product intent, system implementation, or both.

### 7.3 Inputs


The Product Improvement Loop receives:

- evaluation findings and measurements;
- product and business goals;
- user research and direct feedback;
- support cases;
- production incidents;
- operational and reliability signals;
- safety, legal, and compliance requirements;
- engineering constraints;
- new models, tools, data, and platform capabilities.

Evaluation is therefore an important input, though it is not the only source of product-improvement work.

### 7.4 Activities

```text
Evidence, goals, opportunities, and constraints
                         ↓
              Identify and prioritise
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


The loop owns:

- identifying and framing opportunities;
- deciding which problems to pursue;
- diagnosing product and technical causes;
- defining a change hypothesis;
- selecting an intervention;
- implementing the change;
- evaluating candidate behaviour;
- deciding whether and how to release;
- monitoring deployed behaviour and outcomes;
- deciding what to do next.

These responsibilities are consistent with the Product Improvement Loop described in the product-improvement draft.

### 7.5 Outputs


The loop produces:

- product decisions;
- product-definition changes;
- implemented system changes;
- release candidates;
- rollout and rollback decisions;
- deployed product versions;
- new behaviour and outcomes;
- new evidence for all three loops.

### 7.6 How the loop closes


The loop closes when a product or system change is deployed or otherwise exercised, its behaviour is observed, and the result informs the next product decision.

A successful implementation does not close the loop by itself. The team must observe whether the intended behaviour or outcome changed and whether unexpected effects appeared.

## 8. Quality Understanding Loop

### 8.1 Purpose


The **Quality Understanding Loop** develops and revises the team's explicit, versioned, and evidence-linked understanding of product behaviour and quality.

Its central question is:

> **What behaviour matters, what occurred, how should it be judged, and what remains uncertain?**

AI-product quality is often only partly defined before use. Teams discover important requirements, edge cases, success patterns, failure patterns, and ambiguities by probing the system and reviewing real and simulated executions.

Quality Understanding is more than an informal impression. It is recorded in artefacts, connected to evidence, and revised when new behaviour or disagreement exposes a limitation.

### 8.2 Persistent object


Quality Understanding includes:

- evaluation scope and coverage requirements;
- representative cases and examples;
- quality models and failure models;
- behavioural criteria and rubrics;
- trusted labels;
- reference outcomes;
- evaluator definitions and versions;
- regression suites;
- thresholds and decision rules;
- known ambiguities and evidence limitations.

### 8.3 Activities

```text
Product intent and observed user behaviour
                         ↓
           Define and revise coverage
                         ↓
       Design probes and build cases, fixtures, and samples
                         ↓
             Execute and capture traces
                         ↓
       Review success, failure, and ambiguity
                         ↓
       Develop quality and failure models
                         ↓
        Define criteria and build evaluators
                         ↓
       Produce labels, measurements, and findings
                         ↓
New behaviour, disagreement, and poorly fitting cases
                         ↺
```


The loop turns individual observations into reusable understanding.

A concrete failure may first be recorded as a trace-linked observation. Similar observations may later support a failure category. A selected category may then be operationalised as a criterion, implemented through an evaluator, and applied across a defined sample.

This separation prevents a provisional observation from being treated as a stable or universal quality rule.

### 8.4 Inputs


The loop receives:

- product intent and product changes;
- expected workflows and guarantees;
- deliberate probes and controlled experiments;
- real and synthetic executions;
- complete traces and outcomes;
- domain judgement;
- evaluator disagreements;
- newly observed user behaviour;
- failures that do not fit existing criteria;
- changes in risk or operating context.

### 8.5 Outputs


The loop produces:

- coverage models;
- executable evaluation cases;
- trace-linked observations;
- quality and failure models;
- criteria and rubrics;
- accepted labels;
- validated evaluators;
- datasets and regression suites;
- measurements and scoped findings;
- explicit uncertainty and evidence limitations.

### 8.6 How the loop closes


The loop closes when the current Quality Understanding is applied to new behaviour and the result reveals whether that understanding remains adequate.

The following signals may reopen the loop:

- a case does not fit an existing category;
- two reviewers interpret a criterion differently;
- an evaluator disagrees with trusted human judgement;
- a new product capability changes the required coverage;
- a new production failure exposes a blind spot;
- a criterion no longer represents current product intent.

The Quality Understanding Loop is the conceptual centre of evaluation because it explains how observed behaviour becomes reusable judgement and how that judgement changes in response to evidence.

## 9. Evidence Capability Loop

### 9.1 Purpose


The **Evidence Capability Loop** develops and revises the team's ability to produce, capture, preserve, reconstruct, inspect, evaluate, and use the evidence required for product decisions.

Its central question is:

> **Can the required evidence be produced and used reliably?**

### 9.2 Persistent object


Evidence Capability includes:

- instrumentation and trace schemas;
- execution and evaluation runtimes;
- trace, outcome, and metadata storage;
- dataset and label-management tooling;
- evaluation pipelines;
- human-review and adjudication interfaces;
- evaluator registries and execution services;
- versioning and provenance mechanisms;
- CI/CD integration;
- production sampling and monitoring;
- release-gate and runtime-control integration;
- experiment analysis and comparison tooling;
- review procedures, responsibilities, and escalation paths.

Evidence Capability owns the means of working with evaluation artefacts and evidence. The content of cases, criteria, labels, datasets, quality models, and failure models belongs to Quality Understanding.

### 9.3 Activities

```text
Produce, capture, and evaluate evidence
              ↓
Identify evidence, reliability, or capability gaps
              ↓
Improve instrumentation, tooling, or operating practice
              ↓
Validate completeness and reliability
              ↓
Use the improved capability
              ↓
Encounter the next evidence or evaluation gap
              ↺
```

### 9.4 Inputs


The loop receives:

- evidence requirements from evaluation design;
- missing or incomplete trace data;
- inaccessible system state;
- broken links between actions and outcomes;
- evaluator runtime failures;
- slow or expensive evaluation workflows;
- inconsistent metadata;
- missing version or provenance information;
- operational problems in online evaluation;
- review and adjudication bottlenecks.

### 9.5 Outputs


The loop produces:

- richer and more complete traces;
- reliable links between executions and outcomes;
- improved evaluation runtimes;
- better review and adjudication tools;
- clearer review procedures and responsibilities;
- more reliable evaluator execution;
- stronger versioning and provenance;
- safer and more efficient offline and online evaluation;
- clearer integration with delivery and runtime controls.

### 9.6 Examples


Findings for the Evidence Capability Loop may lead to:

- capturing missing conversation history;
- recording tool requests and responses;
- preserving prompt, model, and system versions;
- recording feature-flag assignments;
- connecting external actions with downstream outcomes;
- adding missing permission or state-transition evidence;
- improving sampling;
- adding review queues and adjudication paths;
- supporting relabelling after a criterion changes.

### 9.7 How the loop closes


The loop closes when a capability change is used in later executions or evaluations and the team verifies that the required evidence can now be produced, captured, reconstructed, and applied reliably.

This loop is distinct from the Quality Understanding Loop because it changes the means by which evidence is produced and used. The Quality Understanding Loop changes the content of the judgement applied to that evidence.

## 10. Interaction between the loops


The loops are distinct, but they are not independent.

A single execution or trace review may produce findings for all three loops.

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


This routing rule prevents every evaluation finding from being treated as a product defect.

For example, suppose an evaluator cannot determine whether an agent followed a user's instruction:

- the agent may have ignored the instruction, creating a product finding;
- the criterion may be ambiguous, creating a finding for the Quality Understanding Loop;
- the trace may omit part of the conversation, creating a finding for the Evidence Capability Loop.

More than one finding can be valid at the same time.

### 10.1 Change propagation


A change in one loop may create work in another.

Examples:

- A new product capability creates new coverage requirements.
- A revised product guarantee requires new criteria and regression cases.
- A new criterion requires additional trace evidence.
- Improved instrumentation reveals a previously hidden product failure.
- A changed evaluator requires existing traces to be relabelled.
- A production incident becomes a regression case.
- A new model changes both product behaviour and evaluator reliability.

The loop boundary identifies ownership. It does not prevent coordinated work across loops.

## 11. Offline and online execution planes


The three feedback loops operate across two conceptual execution planes.

### 11.1 Offline plane


The **offline plane** contains executions that do not directly affect live users or the live environment.

Offline evaluation may use:

- fixed evaluation datasets;
- manually written cases;
- synthetic cases;
- sampled production cases;
- replayed production traces;
- mocked dependencies;
- controlled system configurations;
- baseline and candidate comparisons.

Its main purposes include:

- discovery;
- rapid experimentation;
- regression evaluation;
- component and end-to-end evaluation;
- candidate comparison;
- release evidence;
- evaluator calibration;
- controlled failure analysis.

```text
Candidate product change
        ↓
Offline evaluation
        ↓
Comparison with baseline and release criteria
        ↓
Accept, reject, or revise
```


Offline does not necessarily mean _before deployment_. A replay of a production trace against a candidate or deployed version remains offline when it cannot affect the live user or environment.

The main limitation of the offline plane is coverage. It can assess only the behaviours represented by its cases, environments, evidence, criteria, and evaluators.

### 11.2 Online plane


The **online plane** contains evaluation coupled to live traffic, live system state, or real-world operation.

It provides access to user behaviour, system conditions, and failure patterns that cannot be represented completely in a curated offline dataset.

The online plane has two main placements.

#### Online synchronous


Online synchronous evaluation runs inside the live request or action path.

Typical uses include:

- schema and input validation;
- permission checks;
- deterministic policy enforcement;
- safety controls;
- invariant checks;
- blocking or redirecting an action;
- selecting a fallback path.

Synchronous controls must meet the latency, reliability, and failure-handling requirements of the serving path.

#### Online asynchronous


Online asynchronous evaluation runs alongside or after the live request.

Typical uses include:

- production sampling;
- quality monitoring;
- failure discovery;
- drift detection;
- evaluator application;
- human review;
- outcome linking;
- dataset growth;
- identification of new regression cases.

A slow, expensive, or probabilistic evaluator is usually better suited to asynchronous execution unless the consequence of delayed judgement justifies its inclusion in the live path.

The three placements are described in the evaluation draft as offline, online synchronous, and online asynchronous.

### 11.3 Loop-by-plane matrix


|Feedback loop|Offline plane|Online plane|
|---|---|---|
|Product Improvement Loop|Design candidates, compare alternatives, validate hypotheses, assess release readiness|Progressive rollout, canary or A/B exposure, outcome observation, rollback, production opportunity discovery|
|Quality Understanding Loop|Define coverage, create cases and probes, analyse traces, build criteria, calibrate evaluators, maintain regression suites|Discover new behaviour, review uncertain cases, detect blind spots, revise quality definitions, assess evaluator fit|
|Evidence Capability Loop|Build evaluation runtimes, replay tools, dataset tooling, provenance, CI/CD integration, and review workflows|Capture traces, sample production, link outcomes, run controls, support asynchronous evaluation, monitoring, and review|

The planes apply to every loop. They do not define separate ownership structures.

## 12. Data and Evidence Flywheel


The **Data and Evidence Flywheel** converts product usage into trusted evidence, reusable understanding of quality, and reusable evaluation assets.

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
Build reusable cases, criteria, evaluators, and findings
              ↓
Apply them to product and evaluation decisions
              ↓
Deploy changes and observe new behaviour
              ↺
```


A fuller sequence is:

1. **Observe**
   Product usage produces executions, outcomes, feedback, incidents, and operational signals.
2. **Capture**
   The Evidence Capability Loop ensures that enough context is recorded to reconstruct relevant behaviour and outcomes.
3. **Select**
   Sampling and review identify representative, high-risk, uncertain, novel, or decision-relevant cases.
4. **Interpret**
   Humans and automated methods identify successes, failures, ambiguities, and evidence gaps.
5. **Systematise**
   Recurring observations become quality definitions, failure categories, criteria, and rubrics.
6. **Compile**
   Quality Understanding is expressed in versioned datasets, labels, checks, evaluators, thresholds, and review procedures.
7. **Evaluate**
   These assets are applied to baselines, candidate changes, and deployed behaviour.
8. **Decide and improve**
   Findings inform changes to the product, Quality Understanding, or Evidence Capability.
9. **Deploy and verify**
   Changes are released or put into use and assessed against subsequent behaviour.
10. **Repeat**
    New behaviour creates new evidence, requirements, failures, and evaluation gaps.

### 12.1 Why the flywheel is not a fourth feedback loop


The flywheel does not own another independent persistent object.

Instead:

- the Evidence Capability Loop makes product evidence available and usable;
- the Quality Understanding Loop interprets behaviour and develops reusable understanding;
- the Product Improvement Loop uses findings and other inputs to change the product;
- the changed product produces new usage and evidence.

```text
Evidence Capability Loop
Makes product evidence available and usable
              ↓
Quality Understanding Loop
Interprets behaviour and develops reusable understanding
              ↓
Product Improvement Loop
Uses evidence and understanding to change the product
              ↓
Changed product produces new behaviour and evidence
              ↺
```


The flywheel connects and accelerates the three loops.

## 13. Delivery lifecycle


The end-to-end delivery lifecycle is:

```text
Product goal, problem, or opportunity
              ↓
Frame the intended change
              ↓
Define a change hypothesis
              ↓
Design and implement a candidate
              ↓
Probe and generate offline evidence
              ↓
Compare with the baseline and decision rules
              ↓
Release decision
              ↓
Progressive online exposure
              ↓
Observe behaviour and outcomes
              ↓
Route findings to the three feedback loops
              ↓
Next iteration
```


The lifecycle contains two primary feedback paths.

### 13.1 Offline inner feedback path


The offline path supports rapid experimentation before a change affects live users.

```text
Hypothesis
    ↓
Candidate
    ↓
Offline probe or execution
    ↓
Evaluation
    ↓
Revise or promote
    ↺
```


It provides a controlled and relatively reproducible baseline for comparison.

### 13.2 Online outer feedback path


The online path observes real product behaviour after deployment or controlled exposure.

```text
Deployed product
    ↓
Production interaction
    ↓
Online evidence
    ↓
Failure, outcome, or opportunity
    ↓
New hypothesis, case, criterion, or capability change
    ↺
```


It reveals the live distribution of users, inputs, state, dependencies, and outcomes.

The CD4AI source describes offline evaluation as an inner loop and online evaluation as an outer loop. The offline loop supports experimentation and validation before production, while the online loop continuously observes production behaviour and feeds new signals back into later evaluation and improvement.

### 13.3 Relationship between the two-loop and three-loop views


The two views describe different dimensions:

```text
Three feedback loops:
    What changes as a result of evidence?

Offline and online planes:
    Where is evidence generated or applied?

Inner and outer feedback paths:
    How does evidence move through delivery?
```


The offline inner loop and online outer loop remain useful as a delivery-lifecycle view.

The three-loop model provides the ownership and change view required to determine whether a finding should change:

- the product;
- the team's Quality Understanding;
- the capability used to produce and apply evidence.

## 14. Evaluation subsystem and product ownership


The Quality Understanding Loop and Evidence Capability Loop form the **evaluation subsystem**.

Its top-level goal is:

> **Provide trustworthy, scoped, and decision-relevant understanding and evidence about AI Product and AI System behaviour.**

The evaluation subsystem supports product decisions. It does not own those decisions.

### 14.1 Evaluation-subsystem responsibilities


The evaluation subsystem answers questions such as:

- What behaviour occurred?
- Under which conditions did it occur?
- Was it acceptable according to a defined criterion?
- How frequently did it occur in the evaluated sample?
- How did two system versions compare?
- Which evidence supports the judgement?
- How reliable is the evaluator?
- What evidence is missing?
- What remains unknown?

### 14.2 Product-owner responsibilities


Product owners decide:

- which outcomes matter most;
- which problems should be prioritised;
- what product or technical causes should be investigated;
- which change should be made;
- which trade-offs are acceptable;
- how much risk can be accepted;
- whether and how a feature should be released;
- whether product intent itself should change.

This ownership boundary is explicit in the conceptualization draft: evaluation produces evidence and scoped understanding about behaviour, while product owners retain decisions about priorities, causes, changes, trade-offs, and release.

### 14.3 Decision integration


Evaluation evidence may influence operation at several levels:

```text
Informational result
    → visible to the team

Warning threshold
    → requires review or explicit exception

Release gate
    → blocks a release when a validated rule fails

Runtime control
    → prevents, redirects, or escalates a live action
```


Automation should increase only when the criterion, evidence, evaluator, and decision rule are sufficiently stable.

## 15. Evaluation artefacts and traceability


The model distinguishes related evaluation artefacts because each represents a different stage of knowledge.

|Artefact|Purpose|
|---|---|
|Product definition|States the jobs, guarantees, constraints, and failures that matter|
|Coverage requirement|States which behaviours and conditions the evaluation must represent|
|Evaluation case|Defines an executable input, fixture, configuration, and relevant expected condition|
|Trace|Records what the system actually did|
|Observation|Describes a concrete behaviour found in a trace|
|Evaluation model|Organises recurring quality or failure patterns|
|Criterion|Defines how a particular behaviour should be judged|
|Evaluator|Implements or applies a criterion|
|Label|Records the judgement for one execution|
|Measurement|Aggregates labels across a defined sample|
|Finding|Interprets measurements and evidence for a decision|
|Decision rule|Specifies how evidence influences release, monitoring, or intervention|

These distinctions prevent common category errors, including:

- treating an input as a complete evaluation case;
- treating a final response as the complete execution;
- treating an observation as a stable failure category;
- treating a failure category as an operational evaluator;
- treating an evaluator output as a product finding;
- treating a measured rate as universally representative;
- treating missing evidence as successful behaviour.

These artefacts are created, revised, and applied primarily through the Quality Understanding Loop.

### 15.1 Required traceability


A trustworthy finding should preserve links among:

```text
Product intent
    ↓
Evaluation question
    ↓
Coverage requirement
    ↓
Evaluation case or production sample
    ↓
System and configuration version
    ↓
Trace and outcome
    ↓
Criterion and evaluator version
    ↓
Label
    ↓
Measurement
    ↓
Finding
    ↓
Decision
```


This traceability allows the team to understand:

- what was evaluated;
- why it was evaluated;
- which system produced the behaviour;
- which definition of quality was applied;
- whether later results remain comparable;
- why a decision was made.

## 16. Evaluation methods as a separate dimension


Evaluation method is separate from feedback-loop ownership and execution plane.

The main methods are:

```text
Human and domain review
    ambiguous, novel, or consequential judgement
                       ▲
Model-based evaluation
    semantic and contextual judgement
                       ▲
Reference-based evaluation
    comparison with trusted examples or outcomes
                       ▲
Code-based evaluation
    schemas, rules, invariants, permissions, and state
```


A single execution may be evaluated using several methods.

Method selection depends on:

- whether the behaviour can be expressed deterministically;
- judgement complexity;
- consequence of error;
- required authority;
- evaluator reliability;
- latency and cost;
- execution volume.

Code-based checks should be used when a requirement can be expressed reliably as a rule. Model-based evaluators are appropriate for semantic or contextual judgement. Human review remains necessary for unclear definitions, novel behaviour, adjudication, and high-consequence decisions.

These methods may run offline, online synchronously, or online asynchronously. Their placement is an operational decision, not a separate feedback loop.

## 17. Applying the model


For each product change or investigation, a team should answer the following questions.

### Product


- What user job, outcome, guarantee, or problem is involved?
- What change to the Delivered AI Product State is proposed?
- Which behaviour should improve?
- Which behaviours must remain stable?

### Decision


- Who needs to make a decision?
- What uncertainty prevents that decision?
- What claim would reduce the uncertainty?
- What evidence would support that claim?

### Feedback-loop ownership


- Does the issue require a product change?
- Does it require a change to Quality Understanding?
- Does it require a change to Evidence Capability?
- Does it affect more than one persistent object?

### Execution plane


- Which evidence can be produced offline?
- Which evidence requires live traffic or live state?
- Does any evaluation need to run synchronously?
- Which evaluation can run asynchronously?

### Traceability


- Which product, system, dataset, case, evaluator, and criterion versions apply?
- Can the execution and its outcome be reconstructed?
- Are evidence gaps represented explicitly?

### Delivery


- What baseline will be used?
- What release criteria apply?
- How will the change be exposed progressively?
- Which conditions require rollback or escalation?
- How will production evidence enter the next iteration?

## 18. Design principles


The model is governed by the following principles.

### 18.1 Start from product intent and decisions


Evaluation exists to answer a defined decision or knowledge need in relation to expected and observed behaviour.

### 18.2 Define feedback loops by the object they change


The Delivered AI Product State, Quality Understanding, and Evidence Capability evolve independently enough to require separate ownership and feedback.

### 18.3 Treat offline and online as execution planes


Offline and online describe operating context. All three feedback loops can use evidence from both planes.

### 18.4 Preserve the relation between offline and online evidence


Offline evaluation provides controlled comparison and reusable coverage. Online evaluation provides evidence from actual production behaviour. Each compensates for limitations in the other.

### 18.5 Route findings according to the required change


A failed evaluation does not automatically imply a product defect. The issue may be in the product, the current Quality Understanding, the evaluator, or the evidence path.

### 18.6 Keep product decisions with product owners


The evaluation subsystem produces evidence, understanding, uncertainty, and limitations. Product owners decide priorities, interventions, trade-offs, and releases.

### 18.7 Treat Quality Understanding as versioned and evidence-linked


Cases, criteria, labels, evaluators, quality models, and failure models change as the product and operating environment change. Their versions and supporting evidence must remain visible.

### 18.8 Treat missing evidence as a finding


An absent tool response, state transition, configuration version, or downstream outcome must not be interpreted as successful behaviour.

### 18.9 Preserve scoped claims


An evaluation result applies to its cases, sample, environment, criteria, and evaluator versions. It does not prove universal product quality.

### 18.10 Use the flywheel to make evidence and judgement reusable


Production evidence should be converted deliberately into cases, labels, criteria, datasets, evaluators, findings, and regression protection.

## 19. Summary


The AI Product Improvement System is an operating model for continuously probing, observing, understanding, evaluating, delivering, and improving AI products.

Its canonical structure consists of:

- the **Product Improvement Loop**, which changes the Delivered AI Product State;
- the **Quality Understanding Loop**, which changes the team's explicit, versioned, and evidence-linked understanding of product behaviour and quality;
- the **Evidence Capability Loop**, which changes the ability to produce, capture, reconstruct, evaluate, and use evidence;
- the **offline and online execution planes**, across which all three loops operate;
- the **Data and Evidence Flywheel**, which converts product usage into reusable evidence, understanding, and evaluation assets.

The offline inner loop and online outer loop remain valid as a delivery view. They describe how controlled and production feedback move through the lifecycle. The three feedback loops describe what changes as a result of that feedback and who owns the change.

The model can therefore be summarised as:

> **AI product delivery is an iterative improvement system. Three feedback loops operate across offline and online planes, using evaluation and a shared Data and Evidence Flywheel to turn observed behaviour into explicit understanding, decisions, and verified change.**
