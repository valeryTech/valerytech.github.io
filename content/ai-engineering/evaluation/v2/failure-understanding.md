---
draft: false
toc: true
title: "Failure Understanding: Developing an Evidence-Linked Model of Recurring AI Product Failures"
linkTitle: "Failure Understanding"
---
## 1. Purpose


AI products can fail at several points in one execution. A poor final response may follow an earlier misunderstanding, loss of relevant information, incorrect intermediate action, invalid state change, or false report of success. Reviewing only the final response can therefore hide both the first observable problem and the way it affects the rest of the execution.

**Failure understanding** is an iterative method for discovering, comparing, and structuring recurring observed departures from relevant product expectations.

Its purpose is to develop an application-specific, evidence-linked account of:

- which failure behaviours recur;
- under which situations they appear;
- how their boundaries differ;
- how an early divergence propagates through an execution;
- which user, system, or external consequences follow; and
- what remains uncertain.

The primary result is a **failure model**: an evolving, evidence-linked set of recurring failure modes, their boundaries, representative traces, and unresolved questions.

Failure understanding operates inside the Quality Understanding Loop described in the [AI Product Improvement System]({{< ref "ai-engineering/evaluation/v2/product-improvement-system" >}}). It uses evaluation cases and production samples designed through [Designing Evaluation Coverage and Cases]({{< ref "ai-engineering/evaluation/v2/10-evaluation-coverage" >}}), and it contributes to the evaluation practice described in [AI Evaluation as an Iterative Engineering Practice]({{< ref "ai-engineering/evaluation/v2/ai-evaluation" >}}).

The method supports Product Discovery, Product Delivery, evaluation design, regression protection, and production learning.

It does not by itself:

- establish the root cause of an observed failure;
- select the product or technical intervention;
- measure failure frequency in a population;
- establish product value or usability;
- define a release decision; or
- turn every observation into a permanent criterion or evaluator.

The core relationship is:

```text
Relevant product expectations
        +
Executed cases or production observations
        ↓
Complete traces and outcomes
        ↓
Concrete behaviour observations
        ↓
Comparison and focused analysis
        ↓
Recurring failure modes
        ↓
Evidence-linked failure model
        ↓
Coverage changes, operational criteria,
or product and evaluation investigations
```

## 2. Position in the evaluation system


Failure understanding is one method within the Quality Understanding Loop.

It develops reusable understanding from observed executions:

```text
Evaluation coverage
        ↓
Cases or production samples
        ↓
Execution and trace capture
        ↓
Failure understanding
        ↓
Failure model
        ↓
Operational criteria and evaluators
        ↓
Labels, measurements, and findings
```


The method ends with an integrated failure model and explicit downstream needs.

Operationalisation, evaluator development, annotation, measurement, and release use are later activities. Keeping this boundary prevents the analysis from being reduced prematurely to whichever behaviours are easiest to count.

Failure understanding and coverage design form a feedback relationship:

```text
Product expectations and decision
        ↓
Initial coverage requirements
        ↓
Evaluation cases or production sample
        ↓
Executions and traces
        ↓
Failure understanding
        ↓
New failure situations, boundaries,
contrast cases, and evidence gaps
        ↓
Revised coverage
        ↺
```


The starting coverage model is therefore provisional. Observed behaviour may expose situations that the original evaluation design did not represent.

## 3. Core concepts

### 3.1 Behaviour observation


A **behaviour observation** is a trace-linked description of what occurred.

It should stay close to the evidence and avoid assuming a root cause.

Example:

> The interpreter selected one account even though two active accounts matched the user's reference to "Visa."

A behaviour observation may describe:

- an apparent problem;
- unexpected but potentially acceptable behaviour;
- a successful contrast;
- an ambiguous case;
- or missing evidence.

### 3.2 Failure candidate


A **failure candidate** is an observed behaviour that may violate a relevant product expectation or produce an unacceptable outcome, but whose judgement is still provisional.

A candidate remains provisional when:

- the applicable product expectation is unclear;
- required trace evidence is missing;
- reviewers disagree;
- a similar successful case challenges the interpretation; or
- the behaviour has not yet been compared with enough relevant evidence.

### 3.3 Product-behaviour failure


A **product-behaviour failure** is an observed execution or outcome that violates an applicable product expectation within the declared scope.

The expectation may come from:

- a provisional solution definition during Product Discovery;
- a Production Slice Contract during Product Delivery;
- a product guarantee or invariant;
- an approved domain rule;
- a supported or unsupported boundary; or
- an unacceptable-failure definition.

When the applicable expectation is missing or disputed, the analysis has found a **product-intent gap**. It should not silently invent the expected behaviour.

When the trace cannot establish what occurred, the analysis has found an **evidence gap**. It should not label the behaviour as successful or failed.

The basic decision is:

```text
Observed behaviour
        ↓
Can the relevant execution be reconstructed?
        ├── no → Evidence Capability gap
        └── yes
              ↓
Is the applicable product expectation clear?
        ├── no → Product-intent or
        │        Quality Understanding gap
        └── yes
              ↓
Does the behaviour violate the expectation?
        ├── no → acceptable behaviour or variation
        └── yes → product-behaviour failure
```

### 3.4 Failure mode


A **failure mode** is a recurring pattern of product-behaviour failure that is analytically useful for understanding, evaluation, or product improvement.

Examples might include:

```text
losing a user-stated constraint
resolving an ambiguous reference without evidence
claiming completion after an action failed
performing an external effect without required confirmation
```


A failure mode should remain linked to the traces that support it and to the product expectation it violates.

### 3.5 Failure model


A **failure model** is the current evidence-linked account of recurring product-behaviour failures.

It should make clear:

- which modes are currently supported by evidence;
- which situations and boundaries have been observed;
- which representative and contrasting traces support the analysis;
- which interpretations remain unresolved; and
- which coverage, product, or evaluation questions follow.

The method does not prescribe one fixed structural form for the failure model. Its form should remain useful for the current product decisions and later operationalisation.

## 4. Role across Product Discovery and Product Delivery


The same method serves different decisions across the product lifecycle.

| Context | Role of failure understanding |
| --- | --- |
| **Product Discovery** | Reveal behavioural feasibility limits, unexpected prototype behaviour, safety weaknesses, and situations in which a proposed solution fails |
| **Productization commitment** | Make known failure boundaries and remaining behavioural uncertainty explicit |
| **Delivery development** | Understand recurring violations of committed behaviour and identify where candidate changes or regression protection are needed |
| **Release** | Explain material candidate failures and determine whether the current coverage and criteria represent them |
| **Production operation** | Develop understanding from real traces, incidents, user corrections, support cases, and previously unrepresented behaviour |
| **Evaluation improvement** | Expose gaps in coverage, criteria, evaluators, traces, and review practices |

During Product Discovery, the normative basis may be provisional. Failure understanding can show that the proposed behaviour is technically implausible, unsafe, or substantially different from what the solution assumes.

During Product Delivery, the active Production Slice Contract normally provides the product expectation. A clear contract violation is Delivery evidence.

Production observations can also challenge the solution or product expectation itself. In that case, the finding returns to Product Discovery.

## 5. Frame the investigation


Failure understanding should begin with a bounded decision or knowledge need.

State:

- why the failure model is needed;
- the governing failure-understanding question;
- the product behaviour or production slice in scope;
- the applicable product expectations;
- the system or product versions represented by the evidence;
- the evidence sources to be reviewed; and
- the claims the selected evidence can and cannot support.

Example:

> **Decision need:** Determine which recurring interpreter failures should influence the next Wallet delivery change and regression set.

> **Question:** Which recurring departures from the common-expense Production Slice Contract appear in the selected interpreter traces, and where are the current failure definitions or evidence incomplete?

> **Evidence:** A diagnostic case set and sampled production traces from the declared Wallet version.

> **Claim boundary:** The analysis develops patterns from the selected evidence. It does not estimate the production frequency of those patterns.

A materially different question should become another investigation.

For example, these questions are related but distinct:

- Which failures recur in the current traces?
- How frequently does each failure occur in production?
- What technical mechanism causes ambiguous-account resolution?
- Which product change would best address the problem?
- Did a candidate change reduce the failure without causing regressions?

Failure understanding directly addresses the first question. The others require measurement, technical diagnosis, product judgement, or candidate evaluation.

## 6. Select evidence for failure understanding


Failure understanding begins from deliberately selected evidence.

Possible sources include:

- coverage-directed evaluation cases;
- challenge and diagnostic cohorts;
- production samples;
- incidents;
- user corrections;
- support cases;
- release failures;
- evaluator disagreements;
- replayed traces; and
- targeted follow-up cases.

The selected evidence should match the investigation purpose.

A failure-discovery sample may deliberately over-represent difficult, ambiguous, boundary, invalid, or consequential situations. That is appropriate for discovering failure modes, but it does not support an estimate of production quality.

Useful evidence includes four kinds of cases.

### 6.1 Failure candidates


Executions believed to contain a relevant problem.

These help identify concrete divergences and recurring patterns.

### 6.2 Successful contrasts


Similar executions in which the product behaved acceptably.

Successful contrasts help establish where a candidate failure mode does not apply and which distinction matters.

### 6.3 Ambiguous or disputed cases


Executions for which reviewers or product sources support more than one interpretation.

These expose unclear product expectations, weak category boundaries, and criteria that are not yet stable.

### 6.4 Evidence-gap cases


Executions that cannot be judged because required evidence is missing or inaccessible.

These should be routed to the Evidence Capability Loop rather than treated as product failures.

There is no universal sample size. Begin with enough evidence to expose variation relevant to the governing question, then add targeted evidence when comparison reveals an unresolved boundary or missing situation.

## 7. Collect and verify complete traces


Failure understanding depends on reconstructable execution evidence.

A trace should preserve enough information to follow the relevant sequence from input through outcome. Depending on the product, this may include:

- the user input and relevant prior interaction;
- the relevant initial state;
- intermediate decisions or actions;
- external or internal results used by the system;
- state changes;
- the final user-visible output or action;
- downstream effects or outcomes; and
- the product and system versions required to interpret the execution.

The requirement is methodological:

> An analyst must be able to follow the relevant execution sequence and connect every analytical claim to supporting evidence.

Reviewing only the final response can hide:

- an earlier misunderstanding;
- unsupported intermediate information;
- a wrong action later hidden by a plausible response;
- loss of a user constraint;
- a failed operation reported as successful; or
- a side effect that occurred despite an apparently safe final message.

Before coding a trace, verify whether the evidence is adequate for the intended judgement.

If essential evidence is missing:

1. record the evidence gap;
2. avoid a product verdict that the trace cannot support;
3. route the gap to the Evidence Capability Loop; and
4. recapture or replay the execution where possible.

Long traces may require an inspection interface. The method does not require one specific tool, but it does require evidence navigation that is accurate enough for trace-linked analysis.

## 8. Initial coding: record concrete behaviour observations


Initial coding stays close to individual traces.

Reviewers assign short, descriptive labels to behaviours that appear:

- incorrect;
- unsupported;
- undesirable under the applicable product expectation;
- unexpectedly successful;
- ambiguous;
- or otherwise important to the investigation.

Useful observations describe what happened:

```text
omitting the user's replacement preference
selecting one account despite two valid matches
claiming that the transaction was recorded after persistence failed
changing the date supplied by the user
requesting confirmation after the ledger was already mutated
```


Broad labels such as these are usually too weak at this stage:

```text
hallucination
poor reasoning
irrelevance
bad tool use
```


General AI-failure concepts may be used as **sensitising concepts**. They can direct attention toward fabrication, lost constraints, malformed outputs, unsupported actions, or misleading claims. They should not replace a concrete description of the observed behaviour.

Unexpected behaviour is not automatically failure. Record it first, then determine whether an applicable product expectation supports a judgement.

The output of initial coding is intentionally provisional:

```text
trace-linked behaviour observations
+ supporting evidence locations
+ provisional interpretation
+ unresolved questions
```


Do not force every observation into an existing failure taxonomy.

## 9. Locate the earliest observable divergence


An execution may contain several downstream symptoms of one earlier problem.

A practical analytical strategy is to identify the **earliest observable divergence from the applicable product expectation**.

For example:

```text
ambiguous account reference
        ↓
system selects one account
        ↓
selected account appears in draft
        ↓
user may confirm wrong account
        ↓
incorrect ledger posting may follow
```


The earliest observable divergence is:

> The system selected one account even though the reference was ambiguous.

The later draft and potential ledger effect are propagation and consequence.

Distinguish four things:

```text
Observed conditions
    What relevant situation was present?

Earliest observable divergence
    Where did behaviour first differ from the expectation?

Propagation
    How did the divergence affect later behaviour?

Consequence
    What user, product, or external effect followed?
```


A fifth item may be recorded separately:

```text
Cause hypothesis
    What mechanism might explain the divergence?
```


A cause hypothesis is not a finding unless separate evidence supports it.

The earliest observable divergence is also not necessarily the internal root cause. It is the first point the available evidence can demonstrate.

This distinction prevents a trace review from making unsupported claims such as:

> The model ignored the account ambiguity because the prompt is weak.

The trace may demonstrate the wrong resolution. It may not establish why it happened.

## 10. Focused coding and constant comparison


Initial coding produces a detailed but fragmented set of observations.

Focused coding selects and synthesises observations with the greatest analytical usefulness. Selection may reflect:

- recurrence;
- severity;
- reach across several situations;
- importance to a product guarantee;
- consequence;
- or ability to explain several concrete incidents.

Frequency alone is insufficient. One severe violation of a confirmation boundary may deserve focused analysis even when it appears once.

For example:

```text
omitting the stated budget
omitting the required date
omitting the replacement preference
```


may support the focused pattern:

```text
losing user-stated constraints
```


Grouping should be based on similarity in the observed behaviour and normative reason for failure. Similar wording alone is not enough.

### 10.1 Constant comparison


Compare:

- incident with incident;
- observation with observation;
- focused pattern with supporting incidents;
- candidate pattern with successful contrasts;
- candidate pattern with ambiguous or contradictory cases; and
- neighbouring candidate patterns with each other.

Ask:

- What behaviour do the incidents share?
- Are they unacceptable for the same product reason?
- Does the candidate pattern fit every included incident?
- Does it hide a distinction that would change judgement or intervention?
- Which similar cases should be excluded?
- Which successful cases test the boundary?
- What evidence would distinguish competing interpretations?

When a focused pattern fits only part of a group, narrow it, divide it, retain several provisional patterns, or collect more targeted evidence.

Preserve the links from focused patterns back to the original observations and traces. Observations that are not selected should remain available. A low-frequency or unresolved observation may become important later.

### 10.2 Human and domain judgement


Product and domain judgement is required when interpretation depends on:

- an active product guarantee;
- domain rules;
- user authority;
- financial or external effects;
- acceptable variation;
- or the consequence of failure.

An LLM may assist with organising observations or suggesting candidate groupings. Its proposals are analytical aids. Reviewers must compare them with complete traces, product expectations, successful contrasts, and credible alternatives.

## 11. Develop and refine failure modes


Focused patterns become candidate failure modes when they represent a recurring or otherwise decision-relevant product-behaviour failure.

A candidate failure mode should be clear enough to answer:

- What recurring behaviour does it describe?
- Which product expectation does that behaviour violate?
- Which traces support it?
- Which similar successful or non-applicable traces define its boundary?
- Which cases remain ambiguous?
- What consequence makes the mode relevant?

Examples:

```text
ambiguous reference resolved without evidence
user-stated constraint lost before action selection
external action attempted without required confirmation
completion claimed after the action failed
```


Failure modes remain provisional while their boundaries are unclear.

Refinement may require:

- comparing additional traces;
- revisiting earlier observations;
- finding successful contrast cases;
- adding a targeted case through the coverage process;
- clarifying the applicable product expectation;
- or separating product failure from evidence failure.

Do not stabilise a mode merely because it is easy to label. It should remain grounded in observed behaviour and useful for a declared product or evaluation decision.

The failure model need not represent every possible failure. It should represent the recurring or consequential modes supported by the evidence and relevant to the current scope.

## 12. Use targeted follow-up evidence


Initial evidence often exposes missing boundaries.

Use targeted follow-up evidence to examine:

- a candidate mode with too few supporting incidents;
- two modes that may describe the same behaviour;
- one broad mode that may hide a material distinction;
- a severe failure with uncertain conditions;
- a successful case that contradicts the current interpretation;
- an ambiguous case on which reviewers disagree;
- a product expectation that is difficult to apply; or
- a situation not represented in the original coverage.

Targeted follow-up may use:

- additional production traces;
- replay of selected executions;
- new coverage-directed cases;
- a changed fixture that isolates the relevant situation;
- a successful contrast;
- or domain-expert review.

New cases should enter a new evaluation-set version or linked investigation. Do not silently add them to a completed, predeclared evaluation and then present the enlarged result as one unchanged run.

## 13. Decide when the model is adequate for its purpose


Failure understanding is iterative, but it does not require a claim that all possible failure modes have been discovered.

The current model is adequate for its declared purpose when:

- the material failure behaviours needed for the current decision have been examined;
- candidate modes are supported by trace-linked evidence;
- important modes have useful successful contrasts or clear non-applicable cases;
- the boundaries are clear enough for the intended next use;
- new targeted evidence mostly fits or refines the current model;
- material disagreements and evidence gaps are explicit;
- known exclusions and unsupported claims are recorded; and
- further analysis is unlikely to change the current decision enough to justify its cost.

Adequacy depends on the decision and consequence.

A Discovery feasibility investigation may need only enough understanding to reject or narrow a solution. A release-critical safety investigation requires stronger evidence and may use a separate invariant-testing method. A production quality model may require continued revision over the life of the product.

Do not use trace count alone as evidence that the model is complete.

## 14. Integrate the failure model


At the end of the investigation, consolidate the supported analysis into the current failure model.

The model should preserve:

- the recurring failure modes currently supported by evidence;
- their relationship to applicable product expectations;
- representative failure traces;
- successful contrasts;
- material boundaries and conditions;
- unresolved or disputed cases;
- evidence and coverage gaps; and
- limitations of the selected evidence.

The failure model is a Quality Understanding asset. It is versioned and revisable.

It can support:

- revision of evaluation coverage;
- selection of operational criteria;
- evaluator design;
- regression-case proposals;
- candidate comparison;
- product or technical investigations;
- product-intent clarification;
- and production monitoring design.

It does not itself provide a population measurement or release verdict.

## 15. Transition to operationalisation and measurement


Failure-model development and failure measurement are separate activities.

The transition is:

```text
Behaviour observations
        ↓
Focused patterns
        ↓
Failure modes
        ↓
Failure model
────────────────────────────
        ↓
Operational criteria
        ↓
Checks, judges, or review procedures
        ↓
Labels
        ↓
Measurements
        ↓
Scoped findings
        ↓
Decision
```


Operationalisation selects a failure mode and defines how it can be recognised consistently in future evidence.

That later work must determine:

- the exact criterion;
- the evidence required to apply it;
- suitable deterministic, model-based, or human judgement;
- treatment of ambiguity and missing evidence;
- evaluator reliability;
- sample semantics;
- and how the resulting measurement supports a decision.

A failure mode should not be treated as an evaluator merely because it has a name.

Likewise:

- one observed incident is not a measured rate;
- a failure-discovery sample does not estimate production frequency;
- a category count does not establish impact;
- and a failed judgement does not establish root cause.

## 16. Route findings to the object that must change


Failure understanding can produce findings for several feedback loops.

| Finding | Primary destination |
| --- | --- |
| A clear committed product behaviour is violated | Product Delivery Loop |
| A provisional solution behaviour appears technically implausible or unsafe | Product Discovery Loop |
| The system behaves as intended but users still struggle or fail to receive the expected value | Product Discovery Loop |
| The applicable product expectation is missing, disputed, or no longer suitable | Product Discovery Loop and Quality Understanding Loop |
| A new behaviour does not fit the current failure model | Quality Understanding Loop |
| A failure-mode boundary remains unclear | Quality Understanding Loop |
| A criterion or evaluator does not represent the observed distinction | Quality Understanding Loop |
| Required trace, state, version, or outcome evidence is absent | Evidence Capability Loop |
| Trace inspection or review cannot be performed reliably | Evidence Capability Loop |

More than one route may be valid.

For example, a production incident may require:

- an immediate Delivery rollback or fix;
- a new failure mode or refinement;
- a regression-case proposal;
- and improved trace capture.

Keep these as separate findings and follow-up actions.

## 17. Maintain the failure model through use


A failure model remains provisional.

It should be reviewed when:

- new traces do not fit existing modes;
- a new production slice changes the relevant product expectations;
- a criterion cannot be applied consistently;
- an evaluator disagrees with trusted review;
- a production incident reveals a blind spot;
- a previously ambiguous expectation is clarified;
- or a mode no longer applies to the active product scope.

Revisions may include:

- adding a newly supported mode;
- clarifying a boundary;
- separating behaviours previously treated as one;
- combining patterns that later evidence shows to be equivalent;
- retiring a mode that no longer applies;
- revisiting earlier observations;
- and identifying cases that should be relabelled after operational criteria change.

Changes should preserve links to supporting traces and the reason for the revision.

A production failure may become a regression case, but this should happen through review. The case must have a clear product expectation, reproducible setup, and suitable criterion.

## 18. Running example: Wallet ambiguous account reference


Consider this Wallet input:

```text
"Paid $24 with Visa yesterday"
```


The fixture contains two active accounts:

```text
Visa Personal
Visa Shared
```


The active Production Slice Contract states that a material ambiguous reference must remain unresolved.

### 18.1 Behaviour observation


> The interpreter selected `Visa Personal` without exposing that two active accounts matched the user's reference.

### 18.2 Normative basis


> A material ambiguous account reference must remain unresolved until the user selects or supplies a unique account.

### 18.3 Earliest observable divergence


> Account-reference resolution selected one account despite a non-unique match.

### 18.4 Propagation

```text
non-unique match
        ↓
one account selected
        ↓
selected account appears in editable draft
        ↓
user may confirm the wrong account
```

### 18.5 Consequence


The user can create a transaction against an account they did not identify.

### 18.6 Candidate failure mode

```text
ambiguous account reference resolved without evidence
```

### 18.7 Successful contrast


With one active account named `Visa`, resolving the account is acceptable.

With two active accounts named `Visa`, leaving the field unresolved is acceptable.

These contrasts help define the mode's boundary.

### 18.8 Cause hypothesis


> The resolver may select the first returned match.

The trace does not establish that cause. A separate technical investigation is needed.

### 18.9 Routing


- clear Production Slice Contract violation -> Product Delivery Loop;
- recurring pattern and possible regression case -> Quality Understanding Loop;
- missing list of resolver candidates in the trace -> Evidence Capability Loop.

## 19. Workflow summary

```text
Phase 1 — Frame the investigation

Decision or knowledge need
        ↓
Failure-understanding question
        ↓
Product expectations and scope
        ↓
Evidence sources and claim limits
```

```text
Phase 2 — Prepare and inspect evidence

Coverage-directed cases,
production traces, incidents,
contrasts, and ambiguous cases
        ↓
Verify trace adequacy
        ↓
Inspect complete executions
```

```text
Phase 3 — Record and compare

Concrete behaviour observations
        ↓
Earliest observable divergence
        ↓
Propagation and consequence
        ↓
Focused coding
        ↓
Constant comparison
```

```text
Phase 4 — Develop the model

Candidate failure modes
        ↓
Targeted follow-up evidence
        ↓
Boundary refinement
        ↓
Integrated failure model
```

```text
Phase 5 — Apply the result

Coverage changes
Operationalisation candidates
Product or technical investigations
Quality Understanding changes
Evidence Capability changes
```

## 20. Design principles

### 20.1 Ground failure in product expectations


Unexpected behaviour is not automatically failure. Use a clear normative source or record the product-intent gap.

### 20.2 Inspect complete executions


The final response may hide the earliest divergence, intermediate failure, or downstream effect.

### 20.3 Stay close to evidence during initial coding


Describe what happened before assigning a broad category or causal explanation.

### 20.4 Separate observation from root cause


The earliest observable divergence is evidence. The internal mechanism that caused it is usually a hypothesis.

### 20.5 Compare failures with successful contrasts


A failure mode is clearer when similar acceptable cases define where it does not apply.

### 20.6 Use frequency and consequence


Recurring failures deserve attention, and one severe violation may also be decision-relevant.

### 20.7 Preserve traceability


Failure modes should remain connected to observations, traces, product expectations, and revisions.

### 20.8 Keep development separate from measurement


Develop the failure model before narrowing selected modes into criteria and evaluators.

### 20.9 Do not infer population quality from a discovery sample


The sample purpose determines which claims the evidence supports.

### 20.10 Treat ambiguity and missing evidence explicitly


Reviewer disagreement, unclear product intent, and incomplete traces are findings. They are not passes.

### 20.11 Use targeted evidence to test boundaries


Collect follow-up cases when the current evidence cannot distinguish credible interpretations.

### 20.12 Stop according to the decision need


No fixed trace count proves completeness. Continue while additional evidence can materially change the current decision.

### 20.13 Route findings according to what must change


Product behaviour, product intent, Quality Understanding, and Evidence Capability have different owners and interventions.

### 20.14 Revise the model through use


New product scope, production behaviour, evaluator disagreement, and incidents should update the failure model.

## 21. Summary


Failure understanding is an iterative method for developing an evidence-linked account of recurring AI-product failures.

It begins with a bounded question, relevant product expectations, and selected execution evidence. Reviewers inspect complete traces, record concrete behaviour observations, locate the earliest observable divergence, distinguish propagation and consequence from root-cause hypotheses, and compare incidents with successful and ambiguous cases.

Focused analysis develops recurring failure modes. Targeted follow-up evidence tests their boundaries. The resulting failure model records the current understanding and its limitations.

The model then supports revised coverage, operational criteria, regression protection, product investigations, and evidence improvements.

The method can be summarised as:

> **Observe complete executions, describe concrete departures from product expectations, compare them across traces, develop recurring failure modes, and preserve the evidence and uncertainty needed for the next decision.**
