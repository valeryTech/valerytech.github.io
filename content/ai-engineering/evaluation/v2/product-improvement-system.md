---
draft: false
toc: true
title: "Product Improvement System"
linkTitle: "Product Improvement System"
---
# AI Product Improvement System

## 1. Purpose


The **AI Product Improvement System** is the operating model through which an organisation discovers product opportunities, decides which solutions deserve a production commitment, delivers those solutions, operates them, and improves them using evidence from deliberate evaluation and real use.

The model connects:

- product outcomes, opportunities, and solution decisions;
- product discovery and production delivery;
- productization commitments and bounded production slices;
- AI-system design and implementation;
- software testing, AI evaluation, and quality assurance;
- release, rollout, observability, and operations;
- reusable understanding of product behaviour and quality; and
- the capability required to produce and apply trustworthy evidence.

The central idea is:

> **The unit of production commitment is a bounded product behaviour under declared operating constraints. A feature is one way that behaviour may be exposed to users.**

This changes the common sequence from:

```text
idea or requirement
        ↓
implement a feature or MVP
        ↓
test
        ↓
ship
```


into:

```text
outcome and opportunity
        ↓
solution hypotheses and evidence
        ↓
productization commitment
        ↓
bounded production slice
        ↓
committed behaviour and production constraints
        ↓
implement, evaluate, release, observe, and improve
```


The system uses four connected feedback loops:

1. the **Product Discovery Loop**;
2. the **Product Delivery Loop**;
3. the **Quality Understanding Loop**; and
4. the **Evidence Capability Loop**.

The last two loops form the **evaluation subsystem**. All four loops use evidence produced in offline and online execution planes. A **Data and Evidence Flywheel** converts product use and deliberate probes into reusable cases, criteria, evaluators, findings, and product changes.

A compact description is:

> **Discovery decides what deserves a production commitment. Delivery makes the committed behaviour dependable. Evaluation develops the understanding and evidence required by both.**

## 2. Why AI product improvement requires this model


AI-product behaviour cannot be specified or predicted completely before deployment.

An AI product may have explicit outcomes, supported workflows, guarantees, invariants, constraints, and unacceptable failures. Its implemented behaviour can still vary because:

- users express the same intent in many ways;
- execution depends on context, state, and history;
- learned components are probabilistic;
- models, prompts, retrieval sources, tools, and external systems change;
- several components interact during one execution;
- product expectations are only partly explicit at the start;
- a change can improve one behaviour while degrading another; and
- production use exposes conditions that curated development cases do not represent.

The difficult work is therefore broader than implementing a product surface. The team must continuously answer questions such as:

- Which customer problem should the product address?
- Which solution is valuable enough to justify a production investment?
- What behaviour is the product committing to provide?
- Under which conditions must that behaviour hold?
- What does the current system actually do?
- Where does it differ from product intent?
- Is a gap caused by the implementation, unclear product intent, weak evaluation criteria, or missing evidence?
- Is a candidate safe and dependable enough for controlled release?
- Did the released change improve behaviour and outcomes in practice?

The corresponding improvement cycle is:

```text
Frame a decision or uncertainty
        ↓
Define or revise intended behaviour
        ↓
Probe or observe actual behaviour
        ↓
Build and apply quality understanding
        ↓
Decide what should change
        ↓
Change the product, quality understanding,
or evidence capability
        ↓
Observe the effect
        ↺
```


Evaluation is one part of this system. It produces scoped evidence about behaviour. Product discovery and delivery use that evidence together with strategy, user research, operational constraints, incidents, support cases, and business context to make decisions.

## 3. Discovery and Delivery

### 3.1 Discovery: build to learn


Discovery reduces uncertainty about whether and how to address an opportunity.

A typical discovery path is:

```text
desired outcome
        ↓
target opportunity
        ↓
multiple solution candidates
        ↓
product-risk and hypothesis framing
        ↓
research, prototypes, technical investigations, and evals
        ↓
findings
        ↓
commit, revise, or stop
```


Discovery may investigate:

- whether the target users experience the proposed problem;
- whether a solution would provide enough value;
- whether users can understand and use the interaction;
- whether a difficult AI behaviour is technically plausible;
- whether safety and business constraints can be addressed; and
- which solution should be selected from credible alternatives.

Discovery artefacts are built to answer questions. A prototype may be low fidelity, high fidelity, connected to real systems, or implemented inside a production codebase. Its location and technical polish do not make it production software.

### 3.2 Productization commitment


The boundary between Discovery and Delivery is a **productization commitment**.

A productization commitment is the decision to invest in creating and operating a bounded product behaviour that customers may depend on. It records:

- the outcome and target opportunity;
- the selected solution;
- the evidence that justifies the commitment;
- the important product risks and their current status;
- the initial production scope;
- the behaviour and boundaries the team intends to provide;
- accepted residual uncertainty; and
- ownership of the resulting production system.

The commitment is not a handoff between separate departments. The same product team may continue discovery while delivery begins. The commitment changes the nature of the obligation:

```text
Before commitment
    artefact exists to reduce uncertainty

After commitment
    product behaviour must be engineered,
    operated, maintained, and supported
```


Prototype code does not automatically become production code. Each reusable component should be classified as:

- discard;
- behavioural reference only; or
- candidate for reuse after engineering review.

### 3.3 Delivery: build and operate an enduring system


Delivery turns a productization commitment into an enduring system.

Its goals are to:

- protect customers, revenue, brand, and colleagues;
- respond quickly to market needs and problems; and
- earn customer trust.

These are goals for the delivery system. Teams may use different engineering methods, but delivery must support small, frequent, reliable changes and take quality assurance seriously.

Delivery owns the work required to make the committed behaviour dependable, including:

- production architecture and implementation;
- deterministic controls and invariants;
- performance, reliability, privacy, and security;
- cost and capacity constraints;
- observability and traceability;
- controlled rollout, fallback, and rollback;
- support and incident ownership; and
- continuous verification against production evidence.

Discovery and Delivery remain concurrent. Delivery evidence can expose a new product question that returns to Discovery. Discovery can investigate later production slices while Delivery operates the current ones.

## 4. Features, MVPs, behaviours, and production slices

### 4.1 Feature


A **feature** is a user-facing product surface or interaction. It remains useful language for communication and design.

For example:

> One-shot natural-language transaction capture.

The feature name does not define the full production obligation. Underneath it are behaviours such as interpreting supported input, exposing uncertainty, producing an editable draft, validating domain rules, requiring confirmation, persisting safely, and recovering from failure.

### 4.2 MVP


The term **MVP** is ambiguous. It may mean a discovery experiment, a prototype, or the first production release.

This model uses more explicit terms:

- **discovery prototype** for an artefact built to learn;
- **productization commitment** for the decision to create an enduring system; and
- **initial production slice** for the first bounded production scope.

### 4.3 Production slice


A **production slice** is the smallest bounded unit of product behaviour that the team commits to operate in production.

It combines three dimensions:

```text
Production slice
    = functional scope
    + committed product behaviour
    + production constraints
```


- **Functional scope** defines the user situations, workflows, and conditions that are supported.
- **Committed product behaviour** defines what should happen in those situations.
- **Production constraints** define the required safety, reliability, latency, privacy, security, cost, observability, and operating characteristics.

The preferred way to reduce an initial release is to narrow its functional scope while preserving the production obligations required for that scope.

For example:

```text
Broad, weak release
    expenses + income + transfers + adjustments
    with inconsistent behaviour and incomplete controls

Narrow production slice
    common expense capture
    with explicit boundaries, safe completion,
    observability, fallback, and rollback
```

### 4.4 Functional coverage and behaviour maturity


Roadmaps for AI products should distinguish:

- **functional coverage**: which situations the product supports; and
- **behaviour maturity**: how useful and dependable the behaviour is within that scope.

A product-specific behaviour maturity ladder may include:

1. safely unsupported behaviour outside the declared scope;
2. structurally valid system output;
3. semantically correct behaviour for supported determinate cases;
4. appropriate handling of ambiguity and uncertainty;
5. safe end-to-end task completion;
6. production dependability; and
7. demonstrated effect on the intended product outcome.

The exact levels and release threshold must be defined for each product. Intermediate model progress is useful engineering evidence, but structural validity or partial semantic accuracy alone is not a customer release milestone.

## 5. Conceptual foundation

### 5.1 AI Product


An **AI Product** is a set of intended product behaviours offered to defined actors to produce intended outcomes.

The AI Product is the normative model of what value should be produced. It may define:

- purpose and intended outcomes;
- target users and affected actors;
- jobs and important user situations;
- current functional scope;
- committed product behaviours;
- promises and behavioural guarantees;
- invariants and human-control boundaries;
- unsupported situations and non-guarantees; and
- unacceptable or critical failures.

Product intent defines expected behaviour:

```text
Product purpose and outcomes
        ↓
Users, actors, and jobs
        ↓
Functional scope
        ↓
Committed product behaviours
        ↓
Guarantees, invariants, and boundaries
        ↓
Expected product behaviour
```


The AI Product states what should happen. It does not prescribe the implementation.

### 5.2 Product Bet State


**Product Bet State** is the versioned state of a discovery investigation. It records:

- the desired outcome and target opportunity;
- the target users and relevant context;
- candidate solutions;
- risk assumptions and hypotheses;
- required and collected evidence;
- findings and limitations;
- the current decision status; and
- any productization commitment that results.

Product Bet State distinguishes an open hypothesis from a product commitment. It is the persistent object changed by the Product Discovery Loop.

### 5.3 Production Slice Contract


A **Production Slice Contract** is the normative definition of one committed production slice.

It states:

- the user situation and intended outcome;
- functional scope;
- expected end-to-end behaviour;
- guarantees and invariants;
- unsupported situations;
- unacceptable failures;
- production constraints;
- rollout or operating limits; and
- accepted residual uncertainty.

The contract is the primary source of expected product behaviour for delivery and evaluation. It should remain separate from the implementation and from whatever the current system happens to do.

### 5.4 AI System


An **AI System** is the configured technical and operational implementation through which an AI Product produces behaviour and outcomes.

It may contain:

- user interfaces, APIs, and backend services;
- workflows, orchestrators, routers, agents, and state machines;
- language, embedding, classification, speech, vision, or multimodal models;
- retrieval, context, knowledge, and memory components;
- tools and external integrations;
- data-processing and indexing pipelines;
- deterministic business logic and domain services;
- safety, security, policy, and governance controls;
- observability and evaluation components; and
- runtime, storage, queues, caches, and deployment infrastructure.

The AI System operates under an input, environment, initial state, configuration, external dependencies, and applicable controls. Together they produce an execution, observed behaviour, and downstream outcomes.

### 5.5 Delivered AI Product State


The **Delivered AI Product State** is the versioned combination of:

1. the active Production Slice Contracts;
2. the configured AI System that implements them; and
3. the operating and rollout policy through which users experience them.

These three parts should remain independently versioned even when they are referenced as one delivered state:

```text
Product behaviour contract
    What should happen?

AI System configuration
    How is it currently implemented?

Operating and rollout policy
    Who experiences which configuration,
    under which conditions?
```


This separation allows the team to distinguish a product-intent change from an implementation change or a rollout change.

### 5.6 Participant and decision need


Evaluation begins with a participant who has a goal, decision, or knowledge need.

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


Examples include:

- a product team deciding whether a solution deserves a production commitment;
- an engineer deciding whether a candidate fixes a declared behaviour gap;
- a release owner deciding whether a candidate is suitable for controlled rollout;
- an operator deciding whether production behaviour requires intervention; and
- an evaluation owner deciding whether a criterion or evaluator is reliable enough to use.

The participant's goal does not directly determine an evaluator. It first produces a decision or knowledge need, which determines the evaluation question and required evidence.

### 5.7 Evaluation


Evaluation connects:

- expected behaviour from product intent;
- observed behaviour from AI System executions; and
- a defined decision or knowledge need.

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
Participant decision            │
    ↓                           │
Uncertainty and question ───────┘
```


In this system:

> **AI evaluation is an iterative engineering practice for producing trustworthy, scoped, and decision-relevant evidence about observed AI System behaviour in relation to product expectations.**

Its recurring product habit is:

```text
define good behaviour
        ↓
observe actual behaviour
        ↓
evaluate gaps
        ↓
improve the product, Quality Understanding,
or Evidence Capability
        ↓
evaluate again
```


Evaluation supports product decisions. It does not own product priorities, risk acceptance, product changes, or release decisions.

## 6. Canonical system structure


The system contains four connected feedback loops. Each loop owns one persistent object.

|Feedback loop|Persistent object|Central question|
|---|---|---|
|**Product Discovery Loop**|Product Bet State|Is this a solution worth committing to, and within what scope?|
|**Product Delivery Loop**|Delivered AI Product State|How should the committed and delivered product change?|
|**Quality Understanding Loop**|Quality Understanding|What behaviour matters, what occurred, and how should it be judged?|
|**Evidence Capability Loop**|Evidence Capability|Can the required evidence be produced and used reliably?|

The last two loops form the evaluation subsystem.

```text
AI Product Improvement System
│
├── Product Discovery Loop
│     Owns Product Bet State
│
├── Product Delivery Loop
│     Owns Delivered AI Product State
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
      Connects probes, product use, evidence,
      reusable judgement, and product decisions
```


Discovery and Delivery are modes of work, not sequential departments. Evaluation operates in both modes and continues after release.

## 7. Product Discovery Loop

### 7.1 Purpose


The **Product Discovery Loop** reduces uncertainty about which solution, if any, deserves a production commitment.

Its central question is:

> **Is this solution worth committing to, and within what scope?**

### 7.2 Persistent object


The loop owns Product Bet State, including:

- outcome and opportunity framing;
- candidate solutions;
- assumptions and risk hypotheses;
- investigation plans;
- prototypes and other learning artefacts;
- collected evidence and findings;
- decision status; and
- productization commitment records.

### 7.3 Activities

```text
Outcome, opportunity, and context
        ↓
Generate multiple solution candidates
        ↓
Identify important product risks and hypotheses
        ↓
Determine the evidence required
        ↓
Use research, prototypes, technical investigations,
or evaluation
        ↓
Produce scoped findings
        ↓
Commit, revise, continue, or stop
        ↺
```


Different claims require different methods. User and product-value hypotheses require evidence from intended users and realistic use. Interaction hypotheses require usability evidence. SUT-behaviour hypotheses can use evaluation cases. Safety claims require deterministic boundaries and adversarial evidence. Architecture claims require bounded technical investigations.

A passing AI evaluation can support behavioural feasibility. It cannot by itself show that users have the problem, value the solution, or prefer the interaction.

### 7.4 Outputs


The loop may produce:

- a rejected or deferred solution;
- a revised opportunity or solution hypothesis;
- validated or weakened risk hypotheses;
- reusable discovery findings;
- a reference prototype;
- technical feasibility evidence;
- initial evaluation cases and quality understanding; or
- a productization commitment for a bounded production slice.

### 7.5 How the loop closes


The loop closes when evidence changes Product Bet State and informs a decision. A prototype or evaluation run alone does not close the loop. The evidence must affect whether the team commits, revises, continues, or stops.

Production evidence may reopen Discovery when it challenges the selected solution, product intent, or expected causal relationship with the outcome.

## 8. Product Delivery Loop

### 8.1 Purpose


The **Product Delivery Loop** changes the Delivered AI Product State so that committed behaviour becomes and remains safe, dependable, and outcome-effective.

Its central question is:

> **How should the committed and delivered product change?**

### 8.2 Persistent object


The loop owns changes to:

- active Production Slice Contracts;
- AI System architecture and implementation;
- models, prompts, retrieval, tools, memory, and orchestration;
- deterministic controls and domain logic;
- safety, security, and privacy mechanisms;
- system configuration;
- release, rollout, fallback, and rollback policy; and
- delivered production scope.

A change to the meaning of good product behaviour should be explicit as a contract change. A system change should not silently redefine product intent.

### 8.3 Activities

```text
Productization commitment
        ↓
Select a bounded production slice
        ↓
Define committed behaviour and production constraints
        ↓
Define a delivery change hypothesis
        ↓
Design and implement the smallest end-to-end increment
        ↓
Run software tests, AI evaluations,
and product-flow checks
        ↓
Make a release and rollout decision
        ↓
Expose progressively and observe
        ↓
Evaluate behaviour, operations, and outcomes
        ↓
Improve, narrow, roll back, or reopen Discovery
        ↺
```

### 8.4 Quality assurance


Delivery quality assurance combines several kinds of evidence:

- **deterministic software tests** for schemas, permissions, domain invariants, state transitions, idempotency, and exact rules;
- **AI evaluations** for probabilistic and contextual behaviour across declared conditions;
- **integration and end-to-end tests** for complete system paths and user-visible effects;
- **security, privacy, performance, and reliability verification** for production constraints; and
- **production observation** for live inputs, failures, outcomes, incidents, latency, cost, and drift.

Evals complement the conventional test system. They do not replace it.

### 8.5 Release and operation


Small, frequent, reliable releases require:

- versioned product contracts and system configurations;
- reproducible release evidence;
- explicit gates for stable critical criteria;
- feature flags or equivalent exposure controls;
- a limited initial cohort where appropriate;
- safe unsupported and fallback paths;
- rollback that has been exercised;
- traceability from user-visible outcome to system versions;
- privacy-aware evidence collection; and
- named operational and incident ownership.

A release is not the end of delivery. The loop closes only when the change is exercised, its behaviour and outcomes are observed, and that evidence informs the next decision.

## 9. Quality Understanding Loop

### 9.1 Purpose


The **Quality Understanding Loop** develops and revises the team's explicit, versioned, and evidence-linked understanding of product behaviour and quality.

Its central question is:

> **What behaviour matters, what occurred, how should it be judged, and what remains uncertain?**

### 9.2 Persistent object


**Quality Understanding** includes:

- evaluation scope and coverage requirements;
- representative cases and examples;
- quality models and failure models;
- behavioural criteria and rubrics;
- reference outcomes and trusted labels;
- evaluator definitions and versions;
- regression suites;
- thresholds and decision rules; and
- known ambiguities, blind spots, and limitations.

### 9.3 Activities

```text
Product intent, decision needs, and observed use
        ↓
Define and revise coverage
        ↓
Design probes, cases, fixtures, and samples
        ↓
Execute and capture traces and outcomes
        ↓
Review success, failure, and ambiguity
        ↓
Develop quality and failure models
        ↓
Define criteria and evaluators
        ↓
Produce labels, measurements, and findings
        ↓
Apply to new behaviour
        ↓
Encounter disagreement, a blind spot,
or a poorly fitting case
        ↺
```


The loop separates concrete observations from stable judgement. An incident may first become a trace-linked observation, then a recurring failure pattern, then a criterion, and only then an evaluator or regression case.

### 9.4 Outputs


The loop produces:

- evaluation questions and coverage models;
- executable cases and production samples;
- quality and failure models;
- criteria, rubrics, and examples;
- accepted labels and validated evaluators;
- measurements and scoped findings;
- regression suites and decision rules; and
- explicit uncertainty and limitations.

### 9.5 How the loop closes


The loop closes when current Quality Understanding is applied to new behaviour and the result informs a revision or confirms that the current understanding remains usable.

Signals that reopen it include:

- a case that does not fit existing categories;
- disagreement about a criterion;
- an evaluator that disagrees with trusted human judgement;
- a new product behaviour that changes required coverage;
- a production failure that exposes a blind spot; or
- a criterion that no longer reflects the active Production Slice Contract.

## 10. Evidence Capability Loop

### 10.1 Purpose


The **Evidence Capability Loop** develops and revises the team's ability to produce, capture, preserve, reconstruct, inspect, evaluate, and use the evidence required for product decisions.

Its central question is:

> **Can the required evidence be produced and used reliably?**

### 10.2 Persistent object


**Evidence Capability** includes:

- instrumentation and trace schemas;
- execution, replay, and evaluation runtimes;
- trace, outcome, and metadata storage;
- dataset and label-management tooling;
- evaluator registries and execution services;
- human-review and adjudication interfaces;
- versioning and provenance mechanisms;
- CI/CD and release integration;
- production sampling and monitoring;
- runtime-control integration; and
- review procedures, responsibilities, and escalation paths.

Evidence Capability owns the means of working with evidence. The evaluative content of cases, criteria, labels, quality models, and findings belongs to Quality Understanding.

### 10.3 Activities

```text
Required evidence or evaluation task
        ↓
Probe, capture, reconstruct, inspect, or evaluate
        ↓
Detect missing evidence, unreliable execution,
or an inefficient workflow
        ↓
Improve instrumentation, tooling, or operating practice
        ↓
Verify that the required evidence can now be used
        ↺
```


Examples include:

- capturing missing conversation or state history;
- recording tool requests, responses, and side effects;
- preserving prompt, model, system, and policy versions;
- linking actions to downstream outcomes;
- improving production sampling;
- adding review and adjudication workflows;
- supporting replay and candidate comparison; and
- improving the reliability or cost of evaluator execution.

Missing evidence is a finding. It must not be interpreted as successful product behaviour.

## 11. Offline and online execution planes


The four loops can use evidence produced in different execution planes.

### 11.1 Offline plane


The **offline plane** contains executions that cannot directly affect live users or the live environment.

It may use:

- fixed or generated evaluation cases;
- sampled and replayed production traces;
- mocked or isolated dependencies;
- prototype executions;
- baseline and candidate comparisons;
- shadow execution without live effects; and
- controlled technical experiments.

Typical purposes include discovery, behavioural probing, candidate comparison, regression evaluation, evaluator calibration, release evidence, and failure analysis.

Offline evidence is limited by its coverage, fixtures, environment, criteria, and evaluators.

### 11.2 Online synchronous plane


**Online synchronous** checks run inside the live request or action path.

Typical uses include:

- schema and input validation;
- permission and policy enforcement;
- deterministic domain rules;
- safety invariants;
- blocking, redirecting, escalation, or fallback; and
- controls required before an external effect.

Synchronous controls must satisfy the latency, reliability, and failure-handling requirements of the serving path.

### 11.3 Online asynchronous plane


**Online asynchronous** evaluation runs alongside or after live execution.

Typical uses include:

- production sampling;
- behaviour and failure monitoring;
- drift detection;
- evaluator application;
- human review and adjudication;
- outcome linking;
- incident analysis; and
- discovery of new cases, criteria, and product opportunities.

Slow, expensive, or probabilistic judgement normally belongs here unless the consequence of delayed judgement justifies placing it in the live path.

### 11.4 Loop-by-plane view


|Feedback loop|Offline|Online|
|---|---|---|
|**Product Discovery**|Research prototypes, controlled trials, technical investigations, behavioural evals|Limited live-data prototypes or experiments when real behaviour is required|
|**Product Delivery**|Candidate implementation, regression evaluation, release verification|Progressive rollout, production operation, outcome observation, rollback|
|**Quality Understanding**|Coverage design, trace review, failure modelling, evaluator calibration|New-behaviour discovery, production sampling, adjudication, drift analysis|
|**Evidence Capability**|Replay, evaluation runtimes, datasets, provenance, review tooling|Instrumentation, outcome links, sampling, runtime controls, monitoring|

The execution plane describes where evidence is produced or applied. It does not define ownership.

## 12. Data and Evidence Flywheel


The **Data and Evidence Flywheel** converts repeated product use and deliberate probes into reusable evidence, Quality Understanding, evaluation assets, and product changes.

```text
Product use and deliberate probes
        ↓
Executions, outcomes, feedback, and incidents
        ↓
Capture and link evidence
        ↓
Select representative, high-risk, novel,
or uncertain cases
        ↓
Interpret and label
        ↓
Build reusable cases, criteria,
evaluators, datasets, and findings
        ↓
Change Product Bet State, Delivered AI Product State,
Quality Understanding, or Evidence Capability
        ↓
New behaviour and evidence
        ↺
```


The flywheel is not another feedback loop because it owns no independent persistent object. It connects and accelerates the four loops.

Production data does not become trustworthy evaluation data automatically. It must be captured with sufficient context, selected for a declared purpose, interpreted under explicit criteria, and linked to product and system versions.

## 13. Routing findings


A finding should be routed according to the persistent object that must change.

|Finding|Primary destination|
|---|---|
|The system violates clear committed behaviour|Product Delivery Loop|
|The solution behaves as intended, but users still do not receive the expected value|Product Discovery Loop|
|Product intent is missing, disputed, or no longer appropriate|Product Discovery Loop|
|A new behaviour does not fit the current quality or failure model|Quality Understanding Loop|
|A criterion is unclear or an evaluator is unreliable|Quality Understanding Loop|
|Required trace, state, version, or outcome evidence is missing|Evidence Capability Loop|
|Evaluation execution or review is unreliable or too costly|Evidence Capability Loop|
|A production incident exposes both a product defect and an evaluation blind spot|Product Delivery and Quality Understanding Loops|

More than one route may be valid.

A failed evaluation does not automatically prove an implementation defect. The failure may expose unclear product intent, an invalid criterion, evaluator error, or insufficient evidence.

## 14. End-to-end lifecycle


The complete lifecycle is:

```text
Desired outcome and opportunity
        ↓
Candidate solutions
        ↓
Risk hypotheses and investigations
        ↓
Discovery findings
        ↓
Productization commitment
        ↓
Production Slice Contract
        ↓
Delivery change hypothesis
        ↓
Candidate AI System change
        ↓
Offline software tests and evaluation
        ↓
Release decision
        ↓
Progressive online exposure
        ↓
Production behaviour and outcome evidence
        ↓
Route findings to the four loops
        ↓
Next discovery or delivery decision
```


The lifecycle contains two main product paths.

### 14.1 Discovery path

```text
Opportunity
    ↓
Solution hypothesis
    ↓
Evidence
    ↓
Commit, revise, or stop
    ↺
```

### 14.2 Delivery path

```text
Committed production slice
    ↓
Candidate change
    ↓
Offline verification
    ↓
Progressive release
    ↓
Online observation
    ↓
Improve, roll back, or reopen Discovery
    ↺
```


Evaluation operates throughout both paths. Its question and evidence design depend on the decision being made.

## 15. Durable records and traceability


The system should keep the framing layer small.

### 15.1 Product records


The minimum durable product records are:

1. **Productization Commitment Record**
    Records why a solution was selected, the evidence supporting the decision, initial scope, residual uncertainty, and ownership.
2. **Production Slice Contract**
    Defines committed behaviour, functional scope, guarantees, boundaries, unacceptable failures, production constraints, and operating limits.
3. **Release Evidence Record**
    Records the exact product contract, system, model, prompt, policy, test and evaluation versions; results and limitations; release decision; rollout scope; and rollback reference.

Supporting artefacts may include discovery hypotheses, prototypes, research findings, evaluation plans and cases, traces, failure models, criteria, evaluator definitions, architecture decisions, incident records, and operational runbooks.

### 15.2 Required traceability


A decision-relevant finding should preserve links among:

```text
Outcome and product opportunity
        ↓
Productization commitment
        ↓
Production Slice Contract
        ↓
Decision or knowledge need
        ↓
Evaluation question
        ↓
Coverage requirement
        ↓
Case or production sample
        ↓
System, model, prompt, policy, and environment versions
        ↓
Trace and downstream outcome
        ↓
Criterion and evaluator versions
        ↓
Judgement, measurement, and finding
        ↓
Product, release, or operating decision
```


This traceability makes later revision possible and keeps claims scoped to the evidence that supports them.

## 16. Ownership


The product team owns:

- desired outcomes and target opportunities;
- solution selection and productization commitments;
- Production Slice Contracts;
- acceptable product risk and residual uncertainty;
- product priorities and trade-offs;
- release and rollout decisions; and
- decisions to continue Delivery or reopen Discovery.

Engineering owns the integrity of the production system, including architecture, correctness, maintainability, security, reliability, operations, and the implementation of required controls. These responsibilities are exercised collaboratively with product and design because the production behaviour must address value, usability, feasibility, and viability together.

The evaluation subsystem owns:

- Quality Understanding;
- Evidence Capability;
- scoped findings about product behaviour;
- reliability and limitations of evaluation methods; and
- the traceability required to support decisions.

The evaluation subsystem does not decide what outcome matters, which solution to choose, which risk to accept, what change to implement, or whether to release. It supplies evidence for those decisions.

There is no one-way handoff. Discovery, Delivery, evaluation, and operations share evidence and continue to interact throughout the life of the product.

## 17. Design principles

### 17.1 Commit to behaviour, not an implementation


A productization commitment defines the behaviour and scope the organisation is willing to operate. Models, prompts, orchestration, interfaces, and architecture may change while the commitment remains stable.

### 17.2 Narrow functional scope before weakening production obligations


The first production slice should be small enough to make dependable. Safety, privacy, observability, recovery, and ownership still apply within that slice.

### 17.3 Keep Discovery and Delivery concurrent


Delivery does not end Discovery. Production use may expose new opportunities or invalidate product assumptions. Discovery may prepare future slices while Delivery operates current ones.

### 17.4 Treat prototypes as decision tools


Prototype fidelity, repository, or code quality does not determine whether an artefact is production software. Production begins with an explicit commitment and engineering ownership.

### 17.5 Start evaluation from product intent and a decision


Cases, datasets, metrics, and evaluators should be selected only after the relevant behaviour, uncertainty, and decision are clear.

### 17.6 Separate product intent, implementation, and rollout


A behaviour-contract change, a system change, and an exposure-policy change are different changes and should remain independently versioned.

### 17.7 Route findings to the object that must change


A product defect, unclear product intent, weak quality definition, and missing evidence require different interventions.

### 17.8 Use deterministic controls for exact rules and high-consequence boundaries


Probabilistic evaluators should not replace deterministic validation, permissions, invariants, or guarded state changes when those requirements can be enforced directly.

### 17.9 Preserve scoped claims


Evaluation findings apply only to their declared cases or samples, system versions, environments, evidence, criteria, evaluators, and operating conditions.

### 17.10 Make changes small, frequent, and reliable


Small production slices, controlled rollout, reproducible evidence, and fast rollback reduce blast radius and support learning without weakening responsibility.

### 17.11 Treat Quality Understanding and Evidence Capability as maintained assets


Cases, criteria, evaluators, traces, review workflows, and instrumentation require ownership, versioning, and revision as the product changes.

### 17.12 Observe effects after release


Implementation and deployment do not close the loop. The team must observe behaviour and outcomes and use that evidence in the next product decision.

## 18. Summary


The AI Product Improvement System replaces a feature-completion view with a behaviour-and-evidence view.

Discovery asks whether a solution deserves a production commitment. The commitment defines a bounded production slice. Delivery makes that behaviour safe, dependable, operable, and observable. The evaluation subsystem develops the Quality Understanding and Evidence Capability required to judge behaviour and change. Product usage then produces new evidence that may improve the delivered system, revise the team's understanding, strengthen the evidence path, or reopen Discovery.

The model can be summarised as:

> **Discover the solution, commit to a bounded behaviour, deliver it as an enduring system, evaluate what actually happens, and route the evidence to the part of the system that must change.**
