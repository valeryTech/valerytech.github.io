---
draft: false
toc: true
title: "Ai Evaluation"
linkTitle: "AI Evaluation"
---
# AI Evaluation as an Iterative Engineering Practice

## 1. Purpose and scope


AI evaluation is the engineering practice through which a team develops trustworthy, scoped, and decision-relevant understanding of AI-product behaviour.

It connects:

- product intent and product decisions;
- deliberate probes and normal product operation;
- complete executions, traces, and downstream outcomes;
- deterministic checks, reference comparisons, model-based judgement, and human review;
- reusable understanding of quality and failure;
- candidate comparison, release, monitoring, and runtime control; and
- the evidence capability required to make all of this reliable.

AI evaluation operates inside the [AI Product Improvement System]({{< ref "ai-engineering/evaluation/v2/product-improvement-system" >}}).

The broader system contains four feedback loops:

1. the **Product Discovery Loop**;
2. the **Product Delivery Loop**;
3. the **Quality Understanding Loop**; and
4. the **Evidence Capability Loop**.

The Quality Understanding Loop and Evidence Capability Loop form the **evaluation subsystem**. Product Discovery and Product Delivery use evaluation findings while retaining responsibility for product priorities, interventions, risk acceptance, productization commitments, and release decisions.

The central idea is:

> **Evaluation is attached to a decision and an intended product behaviour, not merely to a feature, model, prompt, or dataset.**

In Discovery, evaluation may help determine whether a proposed AI behaviour is feasible enough to support a solution hypothesis.

In Delivery, evaluation helps determine whether a candidate system implements a committed production behaviour, preserves existing guarantees, and is suitable for controlled release.

In production, evaluation helps determine how the delivered behaviour performs under real conditions, where the current quality model is incomplete, and which product or evaluation change should happen next.

A compact loop is:

```text
define good behaviour
        ↓
probe or observe actual behaviour
        ↓
judge and interpret the evidence
        ↓
identify the relevant gap
        ↓
improve the product, Quality Understanding,
or Evidence Capability
        ↓
evaluate again
```


This document defines the evaluation practice and subsystem. It does not replace the product definition, Product Bet State, Production Slice Contract, software-test strategy, release process, or product decision process.

## 2. What AI evaluation is


AI evaluation is the practice of producing and applying trustworthy, scoped, and decision-relevant claims about how an identified AI System behaves under declared conditions.

It connects six forms of work.

### 2.1 Frame the decision and uncertainty


Identify:

- the participant who needs evidence;
- the decision or knowledge need;
- the uncertainty preventing that decision;
- the claim or question to investigate; and
- the consequences of a wrong conclusion.

Evaluation should begin with a decision or knowledge need. A convenient dataset, metric, judge, or benchmark is not a sufficient starting point.

### 2.2 Establish intended behaviour


Make explicit:

- the relevant user job or product outcome;
- the supported functional scope;
- the committed or provisional product behaviour;
- guarantees and invariants;
- unsupported situations and non-guarantees;
- unacceptable or critical failures; and
- applicable operating conditions and constraints.

During Delivery, the primary normative source is the active **Production Slice Contract**.

During Discovery, intended behaviour may come from a provisional solution definition or solution hypothesis. It remains provisional and does not establish that the solution is valuable or desirable.

Evaluation must expose missing, contradictory, or disputed product intent. It must not silently derive expected behaviour from the current implementation, a model output, or dataset frequency.

### 2.3 Design the required evidence


Determine:

- which behaviours and conditions must be represented;
- whether the investigation needs selected cases, a controlled comparison, a representative sample, or production observation;
- what execution evidence must be captured;
- which observations would distinguish credible answers;
- which criteria and judgement methods are appropriate; and
- what result would support, weaken, or leave the question unresolved.

### 2.4 Probe and observe actual behaviour


Deliberately execute the system under selected conditions or observe normal operation.

Capture enough evidence to reconstruct what happened, including as applicable:

- user input and conversation history;
- relevant environment and initial state;
- system, model, prompt, policy, tool, and data versions;
- retrieved context;
- intermediate model outputs;
- tool calls and results;
- decisions and state transitions;
- user-visible responses;
- external or ledger effects;
- user corrections and feedback; and
- downstream outcomes.

### 2.5 Judge and interpret behaviour


Determine whether the observed execution is acceptable under explicit criteria.

Suitable methods include:

- ordinary software assertions;
- code-based evaluators;
- comparison with trusted references;
- model-based evaluators;
- domain-expert review;
- user or customer evidence when the claim concerns interaction or value; and
- combinations of these methods.

Execution produces evidence. It does not produce a correctness verdict by itself.

### 2.6 Build and apply reusable understanding


Convert observations and judgements into reusable assets such as:

- coverage requirements;
- representative cases and examples;
- quality and failure models;
- criteria and rubrics;
- accepted labels;
- evaluator definitions;
- regression suites;
- measurements;
- scoped findings;
- thresholds and decision rules; and
- explicit limitations and unresolved uncertainty.

Apply the resulting findings to Discovery, implementation, release, production operation, or the evaluation subsystem itself.

A compact definition is:

> **AI evaluation is an iterative, evidence-driven engineering practice that frames a decision or knowledge need, makes intended behaviour explicit, probes and observes actual behaviour, applies validated judgement, develops reusable Quality Understanding, and uses scoped findings to support product and operating decisions.**

## 3. What AI evaluation is not


AI evaluation is broader than running a test set or calculating a quality score. It is also narrower than the entire product-improvement process.

Evaluation does not by itself:

- establish that a customer problem exists;
- establish that users value a proposed solution;
- establish that one interaction is easier than another;
- decide which opportunity or solution should be pursued;
- diagnose the root cause of every observed failure;
- decide which product or technical change should be made;
- decide how much product risk should be accepted;
- decide whether a release should proceed;
- prove universal product quality; or
- replace deterministic testing, security work, reliability engineering, or customer research.

Evaluation can provide evidence relevant to these decisions. The validity of the conclusion depends on whether the method can support the claim.

For example:

```text
Passing interpreter eval
    supports:
        the current interpreter behaved acceptably
        on the evaluated cases and configurations

Passing interpreter eval
    does not establish:
        users experience the target problem
        users prefer the interaction
        the product will improve retention
        production quality is universally acceptable
```

## 4. Evaluation context in Discovery and Delivery


Evaluation uses the same core concepts in Discovery and Delivery, but the decision, normative source, evidence threshold, and consequences differ.

|Context|Decision|Normative source|Typical evidence|Consequence of error|
|---|---|---|---|---|
|**Discovery**|Is a proposed AI behaviour feasible enough to continue investigating or support a solution commitment?|Provisional solution definition, risk hypothesis, product intent|Controlled probes, prototype traces, technical experiments, user evidence|Wasted discovery effort or rejection of a useful idea|
|**Productization commitment**|Is there enough evidence to take responsibility for a bounded solution in production?|Product Bet State, discovery findings, proposed production scope|User, value, interaction, feasibility, safety, and viability evidence|Premature production investment or missed opportunity|
|**Delivery development**|Did a candidate change improve the intended behaviour while preserving other commitments?|Production Slice Contract and current baseline|Offline cases, regression suites, comparisons, integration tests|Defect, regression, delay, or unnecessary change|
|**Release**|Is the candidate suitable for controlled exposure within declared limits?|Production Slice Contract, production constraints, release rules|Software tests, AI evals, operational verification, rollback evidence|Customer harm, incident, or delayed value|
|**Production operation**|Is delivered behaviour acceptable under live conditions, and what should happen next?|Active contracts, rollout policy, operating limits|Production samples, traces, outcomes, incidents, monitoring|Undetected degradation, false alarm, or wrong intervention|
|**Evaluation improvement**|Can the current criteria, evaluators, traces, and workflows support the required decision?|Evaluation question and evidence requirements|Calibration, agreement studies, evidence ablation, reliability checks|Misleading findings or inability to judge|

### 4.1 Evaluation in Discovery


Discovery may use evals for claims about observable prototype or system under test (SUT) behaviour, including:

- whether an interpreter can produce the proposed structured output;
- whether a workflow can preserve context across turns;
- whether an architecture can satisfy a bounded technical constraint;
- whether a safety boundary can be enforced;
- whether a model or prompt comparison is promising; and
- where the proposed behaviour fails.

These findings can reduce feasibility or safety uncertainty.

They do not establish product value by themselves. A user or problem hypothesis requires evidence from intended users or credible behavioural data. A value hypothesis requires realistic product use or adoption evidence. An interaction hypothesis requires task-based usability evidence.

### 4.2 Evaluation in Delivery


Delivery begins after a productization commitment. The Production Slice Contract defines the bounded behaviour the team has chosen to operate.

Evaluation then supports decisions such as:

- whether a candidate implements the contract;
- whether a known failure has been addressed;
- whether the candidate preserves existing guarantees;
- whether critical invariants still hold;
- whether the release evidence is sufficient;
- whether a rollout should expand, pause, narrow, or roll back; and
- whether production behaviour remains within accepted boundaries.

The implementation may change while the committed behaviour remains stable. Model, prompt, orchestration, deterministic logic, interface, and infrastructure versions must therefore remain distinguishable from the product contract they implement.

### 4.3 Production evidence can reopen Discovery


A production finding belongs in Discovery when it challenges what the product should do or whether the selected solution still addresses the opportunity.

Examples include:

- users struggle even though the system behaves according to the contract;
- the supported behaviour does not improve the intended product outcome;
- users consistently need a workflow outside the current solution boundary;
- a product guarantee is missing or disputed; or
- the cost or operational model changes the viability of the solution.

A clear implementation defect remains Delivery work. A gap in the product commitment returns to Discovery.

## 5. Why evaluation must be iterative


AI applications are probabilistic, context-sensitive, and distributed across models, prompts, retrieval, tools, state, policies, deterministic business logic, external dependencies, and user interaction.

Important behaviour cannot be specified completely at the start. New inputs, contexts, states, success patterns, and failure modes emerge through use. A change intended to improve one behaviour can create regressions elsewhere. Evaluation definitions and evaluators can also become stale or incorrect.

The central evaluation problem is:

> **Given evolving product intent, an evolving AI System, and a changing operating environment, how can a team produce trustworthy evidence about what the product does, whether that behaviour is acceptable, where gaps occur, and whether a proposed change improves the product?**

Evaluation addresses this through a recurring process:

```text
Decision or knowledge need
        +
Relevant product expectations
        ↓
Design a probe or select operational observations
        ↓
Capture and reconstruct behaviour
        ↓
Apply criteria and judgement
        ↓
Produce a scoped finding
        ↓
Route the finding to the object that must change
        ↓
Observe the effect of the change
        ↺
```


The process is iterative because three things can change independently:

1. the delivered or proposed product behaviour;
2. the team's Quality Understanding; and
3. the Evidence Capability used to produce and apply evidence.

In this model:

- **Probing** is the deliberate execution or exposure of an AI System under selected conditions to reveal behaviour and produce evidence.
- **Observation** is the capture of behaviour, context, and outcomes from either a deliberate probe or normal operation.
- **Quality Understanding** is the team's explicit, versioned, and evidence-linked account of which behaviours matter, what has been observed, how that behaviour should be judged, which evidence supports the judgement, and what remains uncertain.
- **Evidence Capability** is the combined ability to produce, capture, preserve, reconstruct, inspect, evaluate, and use the evidence required for product decisions.

Understanding belongs to the team and evaluation subsystem. The deployed model may remain unchanged, and a causal explanation for an observed behaviour may remain unknown.

## 6. Evaluation within the AI Product Improvement System


The four feedback loops are distinguished by the persistent object each loop changes.

|Feedback loop|Persistent object|Relationship to evaluation|
|---|---|---|
|**Product Discovery Loop**|Product Bet State|Uses findings to decide whether to commit, revise, continue, or stop|
|**Product Delivery Loop**|Delivered AI Product State|Uses findings to implement, compare, release, operate, improve, narrow, or roll back|
|**Quality Understanding Loop**|Quality Understanding|Defines what behaviour matters and revises how observations become judgement|
|**Evidence Capability Loop**|Evidence Capability|Develops the means to produce, capture, reconstruct, evaluate, and use evidence reliably|

The **Quality Understanding Loop** and **Evidence Capability Loop** form the evaluation subsystem.

Product Discovery and Product Delivery sit outside the evaluation subsystem. They own product decisions. Evaluation provides evidence and explicit uncertainty for those decisions.

### 6.1 Quality Understanding Loop


The Quality Understanding Loop owns the team's explicit account of behaviour and quality.

It explains how:

- product intent becomes coverage requirements;
- executions become trace-linked observations;
- recurring observations become quality or failure models;
- selected behaviours become criteria;
- criteria become checks, judges, or review procedures;
- judgements become labels and measurements;
- measurements and evidence become scoped findings; and
- new behaviour revises the current understanding.

### 6.2 Evidence Capability Loop


The Evidence Capability Loop develops the means to work with evidence reliably.

It owns capabilities such as:

- instrumentation and trace schemas;
- execution and replay runtimes;
- trace and outcome storage;
- system and evaluator provenance;
- sampling and dataset tooling;
- human-review and adjudication interfaces;
- evaluator execution services;
- CI/CD and release integration;
- production monitoring and online evaluation; and
- operating practices for evidence review and escalation.

### 6.3 Data and Evidence Flywheel


The **Data and Evidence Flywheel** converts product use and deliberate probes into reusable evidence and evaluation assets.

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
Interpret, compare, and label
        ↓
Build cases, criteria, evaluators,
datasets, and findings
        ↓
Change Product Bet State, Delivered AI Product State,
Quality Understanding, or Evidence Capability
        ↓
New behaviour and evidence
        ↺
```


The flywheel owns no additional persistent object. It connects the four loops.

Production data is not automatically evaluation data. It must be captured with sufficient context, selected for a declared purpose, interpreted under explicit criteria, and linked to product, system, and evaluator versions.

## 7. The decision-driven evaluation workflow


An evaluation investigation is a bounded workflow used to answer one governing question. It is not another feedback loop.

Use this sequence:

```text
Participant and decision or knowledge need
        ↓
Uncertainty
        ↓
Hypothesis, claim, or credible alternative answers
        ↓
Governing evaluation question
        ↓
Normative source and expected behaviour
        ↓
Required evidence and claim semantics
        ↓
Coverage, cases, fixtures, or production sample
        ↓
Identified SUT and configuration
        ↓
Probe or observe
        ↓
Trace and outcome evidence
        ↓
Criteria, checks, judges, and review
        ↓
Judgements and measurements
        ↓
Scoped finding and limitations
        ↓
Decision and routed follow-up
```

### 7.1 Start with a decision or knowledge need


A useful evaluation changes a decision, priority, design, release action, or next investigation.

Examples:

- Should the team continue investigating one-shot natural-language capture?
- Is the current interpreter reliable enough to integrate into the interaction prototype?
- Did candidate `v17` reduce account-resolution failures without regressing date handling?
- Is release `2026.08.27` suitable for a five-percent rollout?
- Is the current production correction rate outside the accepted operating boundary?
- Is the model-based evaluator reliable enough to become a warning gate?

If the answer cannot change any action or understanding, the evaluation question is probably too weak.

### 7.2 State one governing evaluation question


The governing question defines the investigation boundary.

For example:

> For common determinate expense descriptions under the declared Wallet fixture, does interpreter candidate `v17` produce the product-defined draft while preserving existing date, amount, currency, and account behaviour?

A materially different question should normally become another investigation.

For example, these are separate questions:

- Does the interpreter produce the correct draft?
- Can users notice and correct an incorrect draft?
- Does one-shot capture reduce capture effort?
- Does reduced effort improve capture consistency?
- Can the runtime meet the production latency target?

They require different evidence.

### 7.3 Establish the normative source


Expected behaviour must be derived from an authoritative source.

During Delivery, this is normally:

- a Production Slice Contract;
- an explicit product guarantee or invariant;
- a domain rule;
- an approved behaviour change; or
- a declared release or operating constraint.

During Discovery, it may be:

- a provisional solution behaviour;
- a feasibility hypothesis;
- a safety hypothesis; or
- a declared technical constraint.

The evaluation should record conflicts or gaps. It should not use the current implementation as its own oracle.

### 7.4 Declare what the evidence can mean


The selected case set or sample determines which claims are supportable.

|Evidence design|Purpose|Valid interpretation|
|---|---|---|
|**Diagnostic cohort**|Examine known or suspected failure modes|Supports findings about the selected diagnostic conditions|
|**Challenge cohort**|Stress difficult, boundary, or adversarial conditions|Shows behaviour under the selected stress conditions|
|**Regression suite**|Detect change in previously established behaviour|Supports a claim that declared behaviours did or did not regress|
|**Comparison cohort**|Compare identified systems or configurations under controlled conditions|Supports a scoped relative comparison|
|**Representative sample**|Estimate behaviour over a defined population|Supports population estimates only when the sampling method justifies them|
|**Production sample**|Describe live behaviour over a defined population and time window|Supports claims within that population, selection process, and period|
|**Incident cohort**|Investigate consequential observed failures|Supports incident and recurrence analysis, not population quality estimates by itself|

A pass rate over a hand-selected challenge set is not an estimate of production quality.

### 7.5 Predeclare the result rule


Before execution, specify what observations would:

- support the claim within the declared scope;
- expose a behaviour gap or weaken the claim;
- leave the question unanswered because evidence is insufficient;
- indicate an evaluation-apparatus failure; and
- require escalation because of consequence or uncertainty.

Safety and invariant claims normally require stricter rules than quality comparisons.

Do not choose the threshold after seeing the result.

### 7.6 Freeze, execute, and preserve provenance


Version or otherwise identify:

- the evaluation question and plan;
- normative product sources;
- case set or production-sample definition;
- fixtures and relevant initial state;
- SUT version and configuration;
- model, prompt, policy, retrieval, and tool versions;
- environment and dependencies;
- criteria and evaluators;
- thresholds and decision rules; and
- exceptions.

New cases discovered during execution should enter a new plan version or linked follow-up investigation. They should not be silently added while preserving the appearance of a predeclared test.

### 7.7 Preserve stochastic scope


A single model-mediated execution supports a claim about that execution.

A claim about behavioural stability requires:

- repeated executions;
- a declared repetition count;
- an aggregation rule;
- treatment of variance and intermittent failures; and
- preserved configuration and randomisation metadata where available.

## 8. Match the method to the claim


The type of uncertainty determines the required evidence.

|Claim type|Typical question|Suitable method|
|---|---|---|
|**User or problem**|Do intended users experience the situation or difficulty?|Interviews, observation, diary studies, field research, trustworthy usage evidence|
|**Product value**|Does the solution produce enough value to change behaviour or justify its cost?|Realistic prototype or product trials, longitudinal use, adoption and retention evidence|
|**Interaction or usability**|Can users understand and complete the task, and is the interaction suitable?|Task-based usability research, comparative studies, observation, participant feedback|
|**SUT behaviour**|Does the identified system behave as expected under declared conditions?|Evaluation cases, executions, traces, explicit criteria, attributable judgement|
|**Safety or invariant**|Does the system preserve a required boundary within the tested space?|Deterministic controls, property-based tests, adversarial cases, expert review|
|**Architecture or feasibility**|Can a technical mechanism satisfy declared constraints?|Bounded prototype, benchmark, technical experiment, proof|
|**Measurement or evaluator**|Does a metric, trace, criterion, or evaluator produce sufficiently reliable judgement?|Calibration, agreement studies, evidence ablation, comparison with trusted labels|

One product idea often has linked hypotheses of several types.

Evidence for one does not automatically support the others.

For example:

```text
SUT behaviour passes
    +
safety invariant passes
    ≠
users prefer the interaction
    ≠
the product changes capture behaviour
```

## 9. The Quality Understanding Loop


The Quality Understanding Loop develops and revises the team's explicit, versioned, and evidence-linked understanding of product behaviour and quality.

It connects:

- product intent;
- evaluation questions;
- coverage design;
- cases and production samples;
- complete traces and outcomes;
- concrete observations;
- success, quality, and failure models;
- criteria and examples;
- evaluators and review procedures;
- labels and measurements;
- findings and limitations.

A failure-oriented path through the loop is:

```text
Product intent, decision needs,
and observed user behaviour
        ↓
Build and revise coverage requirements
        ↓
Cases + fixtures + SUT configuration
        ↓
Probe, execute, and observe
        ↓
Complete traces and outcomes
        ↓
[[20-error-analysis|Failure understanding]]
        ↓
Trace-linked observations, categories,
and failure model
        ↓
Operational criteria and validated evaluators
        ↓
Labels, measurements, and findings
        ↓
New behaviour, disagreement,
and poorly fitting cases
        ↺ revise coverage, models, criteria,
          evaluators, labels, and limitations
```


This path is not limited to failure. Teams may also model successful behaviour, acceptable variation, recovery behaviour, and trade-offs.

### 9.1 Coverage is a provisional quality model


Coverage translates the governing question into the behaviours and conditions that must be represented.

It may include dimensions such as:

- user intent or job;
- workflow stage;
- input completeness;
- ambiguity;
- language form;
- relevant history;
- environment and initial state;
- permissions;
- tool or dependency condition;
- model or system configuration;
- severity or consequence;
- expected recovery; and
- downstream effect.

Coverage should distinguish user-input properties from hidden fixture, environment, or system state.

Production observations can expose conditions not represented in offline coverage. Offline cases can deliberately emphasise difficult or consequential conditions that are infrequent in production.

### 9.2 Complete traces support behaviour understanding


The final response is often insufficient evidence.

A plausible final response may conceal:

- incorrect retrieval;
- an unsupported assumption;
- a wrong tool call;
- a permission violation;
- loss of an earlier constraint;
- a failed external action;
- an invalid state transition; or
- a duplicate or partial side effect.

The trace should allow a reviewer to follow the execution sequence and connect each judgement to supporting evidence.

### 9.3 Failure understanding precedes stable measurement


Failure understanding develops an application-specific account of recurring failure.

The progression is:

```text
concrete trace-linked observations
        ↓
focused codes and comparison
        ↓
candidate categories
        ↓
integrated failure model
        ↓
operational criteria
        ↓
labels and measurements
```


This boundary matters. A concrete observation should not immediately become a permanent metric or evaluator.

Failure categories should remain connected to representative incidents, counterexamples, product requirements, and revision history.

### 9.4 Operationalisation tests Quality Understanding


Selected behaviours become explicit criteria and evaluators.

Applying them can expose:

- unclear category boundaries;
- criterion disagreement;
- evaluator error;
- missing evidence;
- new success or failure patterns;
- unrepresented conditions; and
- changed product intent.

Evaluator application therefore evaluates both the product and the current Quality Understanding.

### 9.5 Quality Understanding remains scoped


Quality Understanding records:

- what the team currently has reason to believe;
- which evidence supports that belief;
- which product, system, and evaluator versions apply;
- which cases or populations are represented;
- which uncertainty remains; and
- which conclusions are unsupported.

When a criterion, model, or evaluator changes, affected traces may require relabelling and prior measurements may require recomputation.

## 10. The Evidence Capability Loop


The Evidence Capability Loop develops and revises the ability to produce, capture, preserve, reconstruct, inspect, evaluate, and use evidence reliably.

Its recurring process is:

```text
Required evidence or evaluation task
        ↓
Probe, capture, reconstruct, inspect, or evaluate
        ↓
Detect missing evidence, unreliable execution,
or an inefficient review process
        ↓
Improve instrumentation, tooling,
or operating practice
        ↓
Verify that the required evidence can now be used
        ↺
```

### 10.1 Evidence Capability includes


- trace schemas and instrumentation;
- execution, replay, comparison, and evaluation runtimes;
- fixture and isolated-state management;
- trace, outcome, and metadata storage;
- links between actions and downstream effects;
- dataset and label-management tooling;
- evaluator registries and execution services;
- human-review and adjudication interfaces;
- system, product, and evaluator provenance;
- CI/CD integration;
- production sampling and asynchronous review;
- release-gate and runtime-control integration; and
- operating procedures, ownership, and escalation.

### 10.2 Evidence requirements drive instrumentation


Instrumentation should be derived from the decisions and criteria the team must support.

For example, a requirement to judge whether Wallet persisted a transaction before explicit confirmation requires evidence of:

- user-visible confirmation state;
- confirmation event;
- validation result;
- persistence request;
- resulting ledger state; and
- relevant system and policy versions.

A final assistant message cannot answer that question.

### 10.3 Missing evidence is a finding


Missing or inaccessible evidence should produce an explicit `Unknown`, `Unable to judge`, or apparatus-failure result.

It must not be converted into a pass.

The team should distinguish:

- product-behaviour failure;
- evaluator failure;
- execution-runtime failure;
- fixture or environment failure;
- trace incompleteness; and
- review-process failure.

### 10.4 Evidence Capability must be evaluated


Evidence infrastructure and workflows can themselves be wrong.

Useful checks include:

- trace completeness tests;
- replay fidelity checks;
- fixture-isolation verification;
- provenance consistency checks;
- evaluator-runtime reliability;
- reviewer agreement;
- time and cost to obtain a decision;
- outcome-link integrity; and
- recovery from partial pipeline failure.

## 11. Operational evaluation architecture


The operational architecture describes how behaviour is probed and observed, how judgement is applied, where evaluation runs, and how findings influence development, release, and operation.

### 11.1 Evaluation methods and the test system


Evaluation methods should be layered by determinism, cost, speed, and judgement complexity:

```text
                    Human and domain review
             ambiguous, novel, consequential cases
                           ▲
                  Model-based evaluation
             semantic and contextual judgement
                           ▲
                 Reference-based evaluation
              comparison with trusted outcomes
                           ▲
                    Code-based evaluation
         schemas, fields, tool calls, invariants, rules
```


Use the lowest layer that can faithfully express the criterion.

Code-based checks are preferred for:

- output schemas;
- exact fields and references;
- permissions;
- tool selection when product-defined;
- state transitions;
- deterministic domain rules;
- confirmation boundaries;
- prohibited actions;
- idempotency; and
- external or ledger effects.

Model-based evaluators are appropriate when a semantic or contextual criterion cannot be represented faithfully as a deterministic rule.

Human or domain review remains necessary for:

- unstable or disputed definitions;
- novel behaviour;
- adjudication;
- evaluator calibration;
- high-consequence cases; and
- product-intent questions.

This evaluation pyramid complements the conventional software test system:

- unit and component tests validate deterministic implementation behaviour;
- integration and end-to-end tests validate system paths and dependencies;
- evaluation cases probe probabilistic behaviour under declared conditions;
- production evaluation observes behaviour under the live distribution.

One execution may be assessed by ordinary assertions, code-based evaluators, reference comparisons, model-based evaluators, and selective human review.

### 11.2 Offline plane


The **offline plane** contains executions that cannot directly affect live users or the live environment.

It may use:

- fixed evaluation cases;
- manually written or generated cases;
- sampled production inputs;
- replayed traces;
- mocked or isolated dependencies;
- prototype executions;
- baseline and candidate comparisons; and
- shadow executions without live effects.

Typical purposes include:

- Discovery feasibility;
- controlled probing;
- behaviour and failure discovery;
- regression evaluation;
- candidate comparison;
- evaluator calibration;
- release evidence; and
- incident reproduction.

Offline evidence is limited by its coverage, fixtures, environment, criteria, evaluators, and execution fidelity.

### 11.3 Online synchronous plane


**Online synchronous** evaluation or control runs inside the live request or action path.

Typical uses include:

- schema and input validation;
- permission checks;
- deterministic policy enforcement;
- domain invariants;
- guarded confirmation;
- blocking or redirecting an action;
- fallback selection; and
- controls required before an external effect.

Synchronous controls must satisfy serving-path latency, reliability, and failure-handling requirements.

A slow or probabilistic judge should be placed in this path only when the consequence and validated benefit justify the operational risk.

### 11.4 Online asynchronous plane


**Online asynchronous** evaluation runs alongside or after live execution.

Typical uses include:

- production sampling;
- quality monitoring;
- failure discovery;
- drift detection;
- evaluator application;
- human review;
- outcome linking;
- incident analysis;
- dataset growth; and
- creation of new regression cases.

Online observations should feed new cases, examples, criteria, and failure patterns into the offline plane.

### 11.5 Progressive decision integration


Evaluation evidence may influence operation at several levels:

```text
Informational result
    → visible to the team; non-blocking

Warning threshold
    → requires review or an explicit exception

Release gate
    → blocks when a validated critical rule fails

Runtime control
    → prevents, redirects, or escalates a live action
```


Automation should increase only when:

- the criterion is stable;
- the evidence is sufficient;
- the evaluator is validated;
- the result rule is explicit;
- failure handling is defined; and
- the operational consequence is understood.

A noisy aggregate score is a weak release gate. Critical invariants and known regression cases are stronger candidates because their expected behaviour and consequence are clear.

### 11.6 CI/CD and release evidence


A release evaluation should identify:

- the Production Slice Contract version;
- baseline and candidate system versions;
- model, prompt, policy, retrieval, and tool versions;
- case or sample version;
- evaluator and criterion versions;
- thresholds and decision rules;
- deterministic and integration-test results;
- evaluation findings and limitations;
- exceptions and accepted residual risk;
- rollout scope; and
- rollback reference.

Evaluation supplies release evidence. The product and delivery owners make the release decision.

### 11.7 Architectural view

```text
AI Evaluation Subsystem
├── Decision and expectation framing
│   ├── Discovery or Delivery decision need
│   ├── Product intent and normative source
│   └── Governing question and evidence requirements
├── Probing, execution, and observation
│   ├── Offline cases, replay, and comparison
│   ├── Online synchronous checks and controls
│   └── Online asynchronous sampling and review
├── Quality Understanding
│   ├── Coverage and representative examples
│   ├── Observations and quality or failure models
│   ├── Criteria, labels, datasets, and regression suites
│   └── Evaluators, measurements, findings, and limitations
├── Evidence Capability
│   ├── Instrumentation, traces, and outcome linking
│   ├── Runtimes, storage, sampling, and review interfaces
│   └── Versioning, provenance, reliability, and cost controls
├── Evaluation methods
│   ├── Software assertions and code-based checks
│   ├── Reference comparisons
│   ├── Model-based judges
│   └── Human and domain review
└── Decision integration
    ├── Discovery investigations and commitments
    ├── Delivery changes and candidate comparison
    ├── CI/CD, release, and rollout
    └── Production monitoring and runtime controls
```


The architecture is connected by traceability:

```text
Decision and product intent
        ↓
Evaluation question
        ↓
Coverage and evidence requirements
        ↓
Probe or production observation
        ↓
Trace and outcome evidence
        ↓
Criterion and evaluator
        ↓
Judgement and measurement
        ↓
Scoped finding
        ↓
Product or evaluation decision
```

## 12. Evaluation artefacts


The evaluation subsystem works with related but distinct artefacts. They may be stored as separate records or represented in one structured investigation, but their meanings should remain separate.

|Artefact|Purpose|
|---|---|
|**Normative product source**|States the provisional or committed behaviour, guarantees, boundaries, and constraints that should apply|
|**Decision or knowledge need**|States who needs evidence and which action or understanding it may change|
|**Hypothesis or candidate answers**|States provisional answers that the evidence should distinguish|
|**Governing evaluation question**|Defines the bounded question the investigation must answer|
|**Evidence requirement**|States what must be observable to answer the question|
|**Coverage requirement**|States which behaviours, conditions, and boundaries must be represented|
|**Evaluation plan**|Identifies scope, SUT, cases or sample, criteria, evaluators, repetition, result rules, and provenance requirements|
|**Evaluation case**|Defines an input, fixture, configuration, and relevant expected conditions|
|**Production sample**|Defines the live population, selection method, time window, and cohorts|
|**SUT definition**|Identifies the system or candidate and relevant configuration under examination|
|**Trace**|Records what the system actually did|
|**Outcome evidence**|Records the relevant downstream or user outcome|
|**Observation**|Describes a concrete behaviour found in evidence|
|**Quality or failure model**|Organises recurring behaviours and their relationships|
|**Criterion**|Defines how a selected behaviour should be judged|
|**Evaluator or check**|Implements or applies a criterion|
|**Judgement or label**|Records the assessment for one execution under one criterion|
|**Measurement**|Aggregates judgements across a declared case set or sample|
|**Finding**|Interprets measurements and evidence for the governing question|
|**Decision rule**|States how evidence influences review, release, monitoring, or control|
|**Decision record**|Records the external action informed by the finding|

Preserving these distinctions prevents common errors:

- treating an input as a complete case;
- treating a final response as the complete execution;
- treating an observation as a stable failure category;
- treating a failure category as an evaluator;
- treating an evaluator output as a product finding;
- treating a measured rate as universally representative;
- treating one execution as stable model behaviour;
- treating missing evidence as successful behaviour;
- treating a failed judgement as proof of root cause; and
- treating a finding as the product decision itself.

### 12.1 Required traceability


A trustworthy finding should preserve links among:

```text
Product Bet State or Production Slice Contract
        ↓
Decision or knowledge need
        ↓
Governing evaluation question
        ↓
Coverage and evidence requirements
        ↓
Plan, cases, fixtures, or production sample
        ↓
SUT, model, prompt, policy, tool,
data, and environment versions
        ↓
Trace and downstream outcome
        ↓
Criterion and evaluator versions
        ↓
Judgements and measurements
        ↓
Finding and limitations
        ↓
Decision and follow-up work
```


This makes it possible to determine:

- what was evaluated;
- why it was evaluated;
- which system produced the behaviour;
- which definition of quality was applied;
- whether later results remain comparable;
- what remains unknown; and
- why a decision was made.

## 13. Starting the evaluation subsystem


The feedback loops describe recurring operation, but a new product or team may not yet have product expectations, traces, criteria, or evaluation infrastructure.

A practical startup sequence is:

### 13.1 Choose one decision


Start with one concrete Discovery, delivery, release, or production decision.

Example:

> Is the current Wallet interpreter reliable enough to integrate into the one-shot capture prototype?

### 13.2 Establish the intended behaviour


Identify the provisional solution definition or Production Slice Contract. Record missing or disputed behaviour.

### 13.3 Write one governing question


Keep the first investigation narrow enough to answer.

### 13.4 Define the evidence path


State which inputs, state, configuration, intermediate actions, outputs, and outcomes must be captured.

### 13.5 Build a small diagnostic cohort


Use representative straightforward cases together with important ambiguity, boundary, and failure conditions. Do not present the cohort as a production-quality estimate.

### 13.6 Execute and inspect complete traces manually


Manual review builds the first product-specific Quality Understanding and exposes missing evidence.

### 13.7 Record concrete observations


Stay close to the trace evidence. Avoid forcing every incident into a generic taxonomy.

### 13.8 Define initial criteria and checks


Use deterministic checks where possible. Introduce model-based evaluators only where needed, and compare them with trusted human judgement.

### 13.9 Produce one scoped finding


Answer the governing question, state the limitations, and route the result to the relevant loop.

### 13.10 Put the first feedback path into operation


Depending on the decision, integrate the result as:

- a next Discovery investigation;
- a candidate implementation change;
- an informational development report;
- a warning or release gate;
- a production sampling rule; or
- an Evidence Capability improvement.

After startup, the work becomes iterative. New executions revise the product, Quality Understanding, and Evidence Capability.

## 14. Running example: Wallet one-shot transaction capture


Consider Wallet Solution B:

> A user describes one transaction in natural language. Wallet produces an editable draft. The user reviews or edits it and explicitly confirms it before deterministic validation and persistence.

### 14.1 Discovery feasibility question


Before productization commitment, the team may ask:

> Under a declared Wallet fixture, can the current interpreter convert common determinate expense descriptions into the proposed structured draft and expose material missing or ambiguous information?

This is an SUT-behaviour and feasibility question.

It can be evaluated using:

- a headless interpreter prototype;
- declared Wallet fixtures;
- determinate and ambiguous input cohorts;
- deterministic field checks; and
- complete interpretation traces.

A passing result supports technical plausibility within the evaluated scope. It does not establish that users prefer the interaction or record transactions more consistently.

### 14.2 Delivery release question


After commitment to a common-expense production slice, the question becomes:

> Does candidate `B1-v3` implement the committed common-expense behaviour, preserve confirmation and ledger invariants, and meet the declared release constraints relative to the current baseline?

The normative source is now the Production Slice Contract.

Evidence may include:

- software tests for ledger rules and idempotency;
- offline AI evals for semantic draft behaviour;
- ambiguity and unsupported-request cohorts;
- end-to-end review, edit, confirm, and persist tests;
- latency and reliability verification;
- rollback evidence; and
- a controlled production plan.

### 14.3 Example case

```text
Case:
    "Paid $24 for lunch with Visa yesterday"

Fixture:
    current date = 2026-08-27
    account "Visa" exists and is unambiguous
    product-approved currency rule applies

Expected draft:
    transaction type = expense
    amount = 24
    source account = Visa
    date = 2026-08-26
    currency = expected product-defined value
    category = expected value or unresolved,
               according to the active contract

Required safety evidence:
    no ledger effect before explicit confirmation
    deterministic validation runs before persistence
    duplicate confirmation does not duplicate the effect
```


The input alone is not the evaluation case. The fixture, product contract, SUT configuration, expected conditions, and required evidence are part of the case.

### 14.4 Example trace evidence


A useful trace may contain:

```text
user input
    ↓
Wallet context and fixture
    ↓
model request and response
    ↓
draft construction
    ↓
deterministic reference checks
    ↓
user-visible editable draft
    ↓
user edit or confirmation
    ↓
domain validation
    ↓
persistence request
    ↓
ledger result
    ↓
final user-visible outcome
```

### 14.5 Example criteria


- The amount equals `24`.
- The source account resolves to the declared Visa account.
- The relative date resolves under the active product rule.
- Material ambiguity is left unresolved.
- Model output cannot bypass deterministic validation.
- No financial effect occurs before explicit confirmation.
- A retry cannot create a duplicate effect.

Most of these criteria should use code-based checks. Human or model-based judgement is needed only for criteria that cannot be expressed faithfully as exact checks.

### 14.6 Example finding routing


|Observation|Route|
|---|---|
|Candidate resolves Visa to the wrong existing account despite a clear contract|Product Delivery Loop|
|Users misunderstand an unresolved category even though implementation matches the contract|Product Discovery Loop|
|It is unclear whether merchant text should imply category|Product Discovery Loop and Quality Understanding Loop|
|Existing `account ambiguity` criterion cannot distinguish two observed cases|Quality Understanding Loop|
|Trace omits the final ledger state|Evidence Capability Loop|
|Model-based judge disagrees with trusted labels|Quality Understanding Loop|
|Replay cannot establish isolated Wallet state|Evidence Capability Loop|

## 15. Route findings to the object that must change


Evaluation findings can require different changes.

```text
Clear committed behaviour is violated
    → Product Delivery Loop

Provisional solution behaviour is not technically plausible
    → Product Discovery Loop

System behaves as intended but users do not receive expected value
    → Product Discovery Loop

Product intent is missing, disputed, or no longer suitable
    → Product Discovery Loop

New or poorly fitting behaviour
    → Quality Understanding Loop

Unclear or overlapping criterion
    → Quality Understanding Loop

Incorrect or unstable evaluator judgement
    → Quality Understanding Loop

Missing trace, state, version, or outcome evidence
    → Evidence Capability Loop

Unreliable or inefficient evaluation workflow
    → Evidence Capability Loop
```


More than one route may be valid.

A production incident may require:

- an immediate Delivery fix or rollback;
- a new regression case;
- a revised failure model; and
- improved instrumentation.

Evaluation should preserve these as distinct findings and follow-up actions.

## 16. Ownership and decision boundaries

### 16.1 Product Discovery owns


- opportunity and solution decisions;
- product-risk hypotheses;
- productization commitments;
- product-intent changes;
- decisions to revise or stop a solution; and
- decisions to reopen Discovery from production evidence.

### 16.2 Product Delivery owns


- production architecture and implementation;
- candidate changes;
- production quality assurance;
- release and rollout proposals;
- operation, fallback, rollback, and incidents; and
- changes required to meet clear committed behaviour.

### 16.3 Product and release owners decide


- which outcomes matter;
- which problem or opportunity should be prioritised;
- which trade-offs and residual risks are acceptable;
- which product or technical change should be made;
- whether a productization commitment should be made;
- whether and how a release should proceed; and
- whether production exposure should expand, pause, narrow, or roll back.

### 16.4 The evaluation subsystem owns


- Quality Understanding;
- Evidence Capability;
- evaluation questions and evidence designs;
- evaluator reliability and limitations;
- scoped findings about observed behaviour; and
- traceability from product intent to evidence and decision.

The evaluation subsystem answers questions such as:

- What behaviour occurred?
- Under which conditions?
- Was it acceptable under the declared criterion?
- How frequently did it occur in this sample?
- How did identified systems compare?
- Which evidence supports the judgement?
- How reliable is the evaluation?
- What remains unknown?

It does not own the product decision.

## 17. Design principles

### 17.1 Start from a decision and product intent


Do not begin with a dataset, benchmark, metric, or evaluator.

### 17.2 Evaluate bounded product behaviour


A feature name or model name is not a sufficient evaluation scope. State the behaviour, conditions, guarantees, and boundaries.

### 17.3 Use the right method for the claim


SUT evals do not establish user problems, product value, or usability. Match evidence to uncertainty.

### 17.4 Do not derive the norm from the implementation


Expected behaviour comes from product and domain intent. Missing intent is a finding.

### 17.5 Inspect complete executions


The final output may conceal upstream or downstream failures.

### 17.6 Prefer deterministic checks for exact behaviour


Use probabilistic judgement only where exact rules cannot express the criterion faithfully.

### 17.7 Treat evaluators as systems that require evidence


Calibrate model-based and human-review processes against trusted labels, disagreements, and intended use.

### 17.8 Declare sample semantics


Diagnostic, challenge, regression, comparison, representative, and production samples support different claims.

### 17.9 Predeclare result rules


Specify support, failure, inconclusive, and apparatus-failure conditions before execution.

### 17.10 Preserve provenance and comparability


Version product intent, SUT configuration, evidence, criteria, evaluators, and decision rules.

### 17.11 Treat missing evidence as unknown


Do not convert an inability to judge into successful behaviour.

### 17.12 Separate evidence, judgement, finding, and decision


Each has a different owner and epistemic meaning.

### 17.13 Route findings according to the required change


Product defects, product-intent gaps, weak quality definitions, and missing evidence require different responses.

### 17.14 Use offline and online evidence together


Offline evaluation provides control and repeatability. Online evidence provides real inputs, states, dependencies, and outcomes.

### 17.15 Increase automation only after judgement is stable


A warning, gate, or runtime control requires stronger evaluator and evidence reliability than an exploratory report.

### 17.16 Preserve scoped claims


An evaluation result applies only to its declared cases or sample, system versions, environment, evidence, criteria, evaluators, and operating conditions.

### 17.17 Revise Quality Understanding through use


Cases, criteria, models, labels, and evaluators are maintained product assets, not one-time setup.

### 17.18 Close the loop through a decision and observed effect


An execution or report alone does not close an evaluation-supported feedback loop. The finding must affect a decision, and the effect of the resulting change must later be observed.

## 18. Summary


AI evaluation is an iterative engineering practice for understanding and governing product behaviour.

It begins with a decision or knowledge need and an explicit source of intended behaviour. It designs evidence that can support the required claim, probes or observes an identified AI System, captures complete execution and outcome evidence, applies attributable judgement, produces a scoped finding, and routes that finding to the object that must change.

Within the AI Product Improvement System:

- Product Discovery uses evaluation to reduce selected feasibility, safety, and behavioural uncertainty before and after productization commitments;
- Product Delivery uses evaluation to compare candidates, protect committed behaviour, support controlled release, and understand production operation;
- the Quality Understanding Loop develops reusable accounts of what matters and how behaviour should be judged; and
- the Evidence Capability Loop develops the means to produce and apply that evidence reliably.

The model can be summarised as:

> **Define the intended behaviour and decision, observe what the system actually does, judge it with evidence appropriate to the claim, improve the relevant product or evaluation object, and evaluate again.**
