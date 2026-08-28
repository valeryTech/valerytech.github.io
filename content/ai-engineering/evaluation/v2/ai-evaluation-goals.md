---
draft: false
toc: true
title: "Ai Evaluation Goals"
linkTitle: "Ai Evaluation Goals"
---
Yes. A single flat goal list mixes three different questions:

1. **Why do we evaluate?**
2. **What must the evaluation subsystem do?**
3. **Where do findings go?**

I'd keep one top-level purpose and describe it through three views.

## 1. First-principles definition


Evaluation exists because the team cannot directly predict or fully observe how a context-sensitive AI System will behave, while product decisions depend on that behaviour.

The core relationship is:

```text
Product expectations
        +
Observed system behaviour
        +
Decision or uncertainty
        ↓
Evaluation
        ↓
Scoped evidence and findings
        ↓
Product or evaluation decision
```


This is already the strongest part of the conceptual model you developed: evaluation connects product expectations, observed executions, and a defined decision need.

I'd define its top-level purpose as:

> **AI evaluation makes uncertainty about AI-product behaviour manageable by producing trustworthy, scoped, and decision-relevant evidence.**

A more operational version is:

> **Evaluation helps a team understand what an AI System does under relevant conditions, how that compares with product expectations, what remains uncertain, and what that evidence means for a decision.**

"Manageable" is important. Evaluation does not remove all uncertainty and does not prove universal quality.

## 2. Replace "good behaviour"


I agree with your objection.

"Good behaviour" is vague because it:

- sounds like one universal ideal;
- does not state who defines it;
- hides scope and operating conditions;
- hides trade-offs;
- conflates provisional Discovery assumptions with committed Delivery behaviour;
- can encourage the evaluation team to invent product requirements.

Use **product expectations** as the general term.

Product expectations may include:

- intended workflow behaviour;
- guarantees;
- invariants;
- supported and unsupported situations;
- critical failures;
- production constraints;
- acceptable variation;
- expected recovery.

Then distinguish the source by context:

|Context|More precise term|
|---|---|
|Discovery|Provisional solution behaviour or behaviour hypothesis|
|Productization decision|Proposed production behaviour|
|Delivery|Committed product behaviour|
|Production operation|Active product expectations and operating limits|

So the Teresa-inspired statement becomes:

> An AI product contains assumptions and commitments about how it should behave in specific user situations. Evals make those product expectations explicit and evaluable, observe how the system behaves under relevant conditions, and produce evidence about gaps, variation, and remaining uncertainty.

I'd rewrite the loop as:

```text
state the relevant product expectations
        ↓
observe system behaviour under relevant conditions
        ↓
assess the evidence against those expectations
        ↓
identify gaps and remaining uncertainty
        ↓
change the product, Quality Understanding,
or Evidence Capability
        ↓
observe and assess again
```


For a simpler public version:

```text
state what the product should do
        ↓
observe what the system does
        ↓
assess the difference
        ↓
improve and verify
```


The longer version is more accurate for your framework because sometimes the product implementation is correct and the expectation, evaluator, or evidence path must change.

## 3. View 1: evaluation's role across Discovery and Delivery


This view answers:

> **Why are we evaluating at this point in the product lifecycle?**

### Discovery


The Discovery decision is:

> Is this solution worth committing to, and within what scope?

Evaluation contributes where the uncertainty concerns observable system behaviour.

```text
Solution hypothesis
        ↓
Provisional behaviour assumptions
        ↓
Probe a prototype or SUT
        ↓
Observe feasibility, boundaries, and failures
        ↓
Finding
        ↓
Continue / revise / stop / support commitment
```


Evaluation goals in Discovery are:

- make proposed AI behaviour concrete enough to examine;
- test behavioural feasibility;
- test selected safety and invariant hypotheses;
- reveal unexpected behaviour and failure boundaries;
- compare technical or behavioural alternatives;
- identify where the proposed solution depends on unsupported assumptions;
- contribute evidence to the productization decision.

Evaluation does **not** establish by itself:

- that users experience the problem;
- that the solution provides enough value;
- that users prefer the interaction;
- that the solution changes real user behaviour.

Those require user, product-value, and usability evidence. Your current `ai-evaluation.md` already preserves this method boundary.

### Productization commitment


The decision is:

> Do we have enough evidence to take responsibility for this bounded behaviour in production?

Evaluation contributes:

- feasibility findings;
- observed failure boundaries;
- safety evidence;
- known behavioural limitations;
- initial coverage and regression assets;
- explicit uncertainty that will remain after commitment.

Evaluation is one input. The commitment also needs value, usability, viability, and product evidence.

### Delivery development


The decision is:

> Does this candidate implement or improve the committed behaviour while preserving the other commitments?

```text
Production Slice Contract
        ↓
Candidate system change
        ↓
Offline probes and tests
        ↓
Baseline comparison
        ↓
Behaviour gaps and regressions
        ↓
Revise candidate or prepare release evidence
```


Evaluation goals in Delivery are:

- translate committed behaviour into evaluable expectations;
- compare candidates with the current baseline;
- verify that a targeted behaviour improves;
- detect regressions;
- protect guarantees and known failure boundaries;
- support diagnosis without claiming an unproven root cause;
- provide reproducible release evidence.

### Release and rollout


The decision is:

> Is this candidate suitable for controlled exposure?

Evaluation contributes:

- results for critical criteria;
- regression evidence;
- known limitations;
- evaluator and sample limitations;
- unresolved behavioural uncertainty;
- evidence for warning or release gates;
- evidence required for rollout and rollback decisions.

The product and release owners still decide whether to release. The evaluation subsystem produces the evidence and its limits.

### Production operation


The decisions include:

- Is live behaviour within accepted boundaries?
- Should rollout expand, pause, narrow, or roll back?
- Has a new failure appeared?
- Does current product intent still make sense?
- Should a production case become a regression case?

Evaluation goals in operation are:

- observe the live input and state distribution;
- detect failures, drift, and changed behaviour;
- connect execution behaviour to downstream outcomes;
- discover gaps in offline coverage;
- detect evaluator or instrumentation problems;
- turn selected production evidence into reusable cases and criteria;
- provide evidence that may reopen Discovery.

This is consistent with the current Product Improvement System: production evidence may improve Delivery, revise Quality Understanding, strengthen Evidence Capability, or reopen Discovery.

## 4. View 2: evaluation subsystem goal tree


This view answers:

> **What must the evaluation subsystem be able to do?**

I would revise the old `E1-E6` goal tree rather than discard it. The old tree has the right coverage, but "Define what behaviour matters" gives evaluation too much ownership over product intent.

Use this version:

```text
E0. Make behaviour-related uncertainty manageable
    for product decisions
│
├── E1. Establish the evaluation basis
│   ├── identify the participant and decision
│   ├── state the uncertainty and governing question
│   ├── identify the normative product source
│   ├── make relevant product expectations explicit
│   ├── expose missing or conflicting intent
│   └── declare scope, conditions, and claim semantics
│
├── E2. Produce reconstructable behaviour evidence
│   ├── design probes, cases, cohorts, or samples
│   ├── execute or observe the identified system
│   ├── capture inputs, state, configuration, and actions
│   ├── capture outputs and downstream outcomes
│   ├── preserve provenance
│   └── distinguish missing evidence from successful behaviour
│
├── E3. Assess behaviour consistently
│   ├── define explicit criteria
│   ├── select suitable judgement methods
│   ├── apply deterministic checks where possible
│   ├── use references, model judges, and humans where needed
│   ├── support adjudication and uncertainty
│   └── validate evaluator reliability
│
├── E4. Produce decision-relevant findings
│   ├── aggregate judgements over a declared sample
│   ├── compare candidates and baselines
│   ├── identify failures, regressions, and variation
│   ├── state limitations and remaining uncertainty
│   ├── answer the governing question
│   └── preserve the distinction between finding and decision
│
├── E5. Develop reusable Quality Understanding
│   ├── maintain coverage requirements
│   ├── preserve representative success and failure cases
│   ├── develop quality and failure models
│   ├── maintain criteria, labels, and evaluators
│   ├── build regression suites and decision rules
│   └── revise these assets when new evidence appears
│
└── E6. Maintain trustworthy Evidence Capability
    ├── maintain instrumentation and trace completeness
    ├── support reproducible execution and replay
    ├── preserve versions and provenance
    ├── maintain review and adjudication workflows
    ├── integrate evaluation with CI/CD and production
    ├── monitor evaluator and pipeline reliability
    └── make evidence usable at acceptable cost and speed
```


This tree has a useful dependency structure:

```text
E1 Evaluation basis
        ↓
E2 Behaviour evidence
        ↓
E3 Judgement
        ↓
E4 Finding
```


And two persistent supporting branches:

```text
E5 Quality Understanding
E6 Evidence Capability
```


E5 and E6 improve through repeated use. They are the two evaluation-subsystem loops already defined in the Product Improvement System.

## 5. View 3: what evaluation findings can change


This view answers:

> **What should happen after evaluation finds a gap?**

```text
Evaluation finding
        │
        ├── solution or product expectation must change
        │       → Product Discovery Loop
        │
        ├── implementation or rollout must change
        │       → Product Delivery Loop
        │
        ├── quality definition or evaluator must change
        │       → Quality Understanding Loop
        │
        └── evidence path or tooling must change
                → Evidence Capability Loop
```


Examples:

|Finding|Destination|
|---|---|
|Model violates a clear committed account-resolution rule|Delivery|
|Users struggle although the implementation matches the contract|Discovery|
|The team cannot agree whether category inference is acceptable|Discovery plus Quality Understanding|
|Existing failure categories do not fit a new pattern|Quality Understanding|
|Model judge disagrees with trusted expert labels|Quality Understanding|
|Trace omits the ledger mutation result|Evidence Capability|
|Release evaluator is too unstable to act as a gate|Quality Understanding and Evidence Capability|

This routing view is essential because "evaluate gaps -> improve the product" is too narrow. Some gaps are in the product; others are in our expectations, understanding, evaluator, or instrumentation.

## 6. View 4: the recurring evaluation workflow


This view answers:

> **How does one evaluation investigation run?**

It is a workflow, not another goal tree or feedback loop:

```text
Decision or knowledge need
        ↓
Uncertainty
        ↓
Governing evaluation question
        ↓
Relevant product expectations
        ↓
Evidence and coverage requirements
        ↓
Probe or production sample
        ↓
Execution traces and outcomes
        ↓
Criteria and evaluators
        ↓
Judgements and measurements
        ↓
Scoped finding and limitations
        ↓
Decision
        ↓
Route follow-up work
```


This should remain separate from the goal tree:

- the **goal tree** describes what the subsystem must achieve;
- the **lifecycle view** describes why it is used;
- the **routing view** describes what can change;
- the **workflow** describes how one investigation proceeds.

## 7. A concise formulation for the documents


I'd replace the current "good behaviour" passage in both documents with this:

> **Use evaluation as a product-improvement habit**
>
> An AI product contains assumptions and commitments about how it should behave in specific user situations. Evaluation makes those product expectations explicit and evaluable, observes how the system behaves under relevant conditions, and produces scoped evidence about gaps, variation, and remaining uncertainty.
>
> The recurring habit is:
>
> `state product expectations -> observe system behaviour -> assess the evidence -> identify gaps and uncertainty -> change the relevant product or evaluation object -> assess again`
>
> In Discovery, this helps the team test provisional solution behaviour and reduce feasibility or safety uncertainty. In Delivery, it helps the team implement and preserve committed product behaviour, compare candidates, support release decisions, and learn from production. Findings may change the product, Quality Understanding, or Evidence Capability.

My preferred top-level structure for the evaluation material is therefore:

```text
1. Purpose
   Make behaviour-related uncertainty manageable
   for product decisions

2. Lifecycle role
   Discovery → commitment → Delivery → operation

3. Evaluation subsystem goal tree
   E1–E6

4. Finding-routing view
   Discovery / Delivery / Quality Understanding /
   Evidence Capability

5. Investigation workflow
   decision → evidence → finding → decision
```


That gives you several views without creating several competing definitions of evaluation.
