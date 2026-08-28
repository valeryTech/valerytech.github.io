---
draft: false
toc: true
title: "Failures Putting Into Use"
linkTitle: "Failures Putting Into Use"
---
# part one


Yes. The key distinction is:

> **A trace, incident, correction, or user complaint is raw product feedback. Failure understanding is the method that turns part of that feedback into structured, decision-relevant evidence about product behaviour.**

It should therefore sit between observed behaviour and product decisions:

```text
Prototype, candidate, or production product
        ↓
Executions, outcomes, incidents,
user corrections, and support cases
        ↓
Failure understanding
        ↓
Evidence-linked findings
        ↓
Update hypotheses, risk profile,
product scope, delivery work,
Quality Understanding, or Evidence Capability
```


This fits the Data and Evidence Flywheel in the Product Improvement System: product use produces evidence, the evidence is interpreted and made reusable, and the result changes the product or evaluation system.

## Failure understanding is one product-feedback lens


Product feedback is broader than failures. It includes:

- user research;
- task and usability observations;
- adoption and retention;
- outcome measures;
- support feedback;
- incidents;
- corrections;
- successful executions;
- operating signals.

Failure understanding focuses on one part:

> **Where observed product behaviour departs from a provisional or committed product expectation, under which situations, and with which consequences.**

So I would describe it as **structured product-behaviour feedback**.

It should not replace customer research or outcome analysis. A system may behave according to specification while users still find the solution unhelpful. Conversely, a system may contain known failures while still showing that the interaction idea has value.

## How it enters Product Discovery


Discovery has a Product Bet State containing:

- solution hypothesis;
- risk profile;
- linked hypotheses;
- evidence;
- current decision.

Failure understanding supplies evidence that changes that state.

```text
Solution candidate
        ↓
Risk profile and hypotheses
        ↓
Prototype or technical probe
        ↓
Observed behaviour
        ↓
Failure understanding
        ↓
Discovery implications
        ├── support a hypothesis
        ├── weaken or reject a hypothesis
        ├── expose a new hypothesis
        ├── increase or reduce a risk
        ├── narrow the solution scope
        ├── revise the interaction
        └── stop the solution
```

### Example for Solution B


Suppose we begin with:

> **H-B2 -- Feasibility:** For supported transaction descriptions, Wallet produces the intended draft or exposes material uncertainty.

Failure understanding discovers:

> When two active accounts match "Visa," Wallet chooses one without exposing the ambiguity.

This finding does several things.

**Hypothesis effect**

H-B2 is weakened for ambiguous account references. It may remain supported for unique references.

So we should split or narrow the claim:

```text
Supported so far:
Unique account references are resolved correctly.

Not supported:
Ambiguous account references remain unresolved.
```


**Risk-profile effect**

The feasibility risk becomes more specific:

```text
Before:
Can AI reliably interpret account references?

After:
Unique references appear feasible.
Ambiguous references are a confirmed failure boundary.
```


The safety risk may also change:

```text
If the wrong draft can be persisted automatically:
critical safety exposure

If explicit review and deterministic validation remain:
feasibility/usability problem with a contained safety consequence
```


**Solution effect**

Discovery can now consider alternatives:

- leave ambiguous fields unresolved;
- use a structured account selector;
- add conversational clarification;
- restrict the first production slice to determinate references;
- reject natural-language account resolution as part of the solution.

The failure does not automatically mean "fix the implementation." It may change the solution boundary.

## How it enters Product Delivery


Delivery begins from committed behaviour and a Production Slice Contract.

```text
Committed production behaviour
        ↓
Candidate implementation or deployed product
        ↓
Observed behaviour
        ↓
Failure understanding
        ↓
Delivery implications
```


When the contract is clear and the system violates it, failure understanding produces Delivery work:

- define a change hypothesis;
- prioritise the behaviour gap;
- modify the system;
- add or revise coverage;
- propose a regression case;
- compare the candidate with the baseline;
- block, narrow, or roll back a release;
- observe whether the change resolved the failure.

```text
Confirmed contract violation
        ↓
Delivery change hypothesis
        ↓
Candidate change
        ↓
Evaluation
        ↓
Controlled release
        ↓
Observe again
```


For the Wallet example:

> **Delivery change hypothesis:** Requiring unique deterministic account resolution before populating `account_id`will eliminate unsupported account selection while preserving correct resolution for unique references.

That hypothesis is different from the earlier Discovery hypothesis:

> One-shot natural-language capture can reduce transaction-entry effort.

Discovery tests the solution. Delivery tests a change to the committed implementation.

## When a Delivery finding returns to Discovery


A production finding should reopen Discovery when it challenges the solution or the intended behaviour.

Examples:

- Users repeatedly fail to notice incorrect drafts even though the review UI follows the contract.
- Leaving ambiguous fields unresolved creates so much correction work that one-shot capture no longer reduces effort.
- Users expect a conversation when information is missing, but the committed solution intentionally has no follow-up.
- The feature works technically but does not improve capture timeliness.
- A required quality level is technically possible only at an unacceptable cost or latency.

In these cases, implementation may be correct. The product decision may be wrong or incomplete.

```text
System matches committed behaviour
        +
users still struggle or outcome does not improve
        ↓
Reopen Product Discovery
```


That is why failure understanding should not feed only an engineering backlog.

## Relationship to hypothesis validation


Failure understanding does not validate every hypothesis type in the same way.

|Hypothesis type|How failure understanding contributes|
|---|---|
|**SUT behaviour**|Direct evidence that a declared behaviour holds or fails in the examined traces|
|**Safety or invariant**|Direct evidence within the tested space; one counterexample may be enough to reject a universal safety claim|
|**Architecture or feasibility**|Exposes failure boundaries and generates technical hypotheses; separate diagnosis may still be required|
|**Interaction or usability**|Identifies possible user-facing problems, but user observation is needed to establish usability|
|**Product value**|Produces signals such as abandonment or correction burden, but realistic use and outcome evidence are required|
|**User/problem**|May suggest situations to investigate, but traces do not establish that the customer problem is important|
|**Measurement/evaluator**|Directly exposes unclear criteria, evaluator disagreement, and missing evidence|

This follows the hypothesis framework's central rule: evidence for one claim type does not automatically establish another. A passing or failing SUT evaluation does not by itself establish product value or usability.

A failure-understanding finding should therefore say:

```text
Which hypothesis does this evidence affect?
Does it support, weaken, split, or leave it inconclusive?
What additional evidence is still required?
```

## Relationship to the solution risk profile


The risk profile should be treated as a changing view, not a document written once before prototyping.

Failure understanding can change a risk profile in several ways:

|Change|Example|
|---|---|
|**Expose a new risk**|Users may confirm an incorrect account because generated fields appear authoritative|
|**Confirm a suspected risk**|Ambiguous references are resolved without sufficient evidence|
|**Localise a broad risk**|Date parsing works; account-reference ambiguity is the actual failure boundary|
|**Change consequence**|A draft error becomes critical if persistence is automatic|
|**Reduce uncertainty**|Repeated successful contrast cases show unique references are handled reliably|
|**Change residual risk**|Deterministic validation contains the effect but does not remove correction effort|
|**Change solution scope**|The first slice supports only determinate account references|

There is an important nuance:

> Discovering a failure can reduce uncertainty while increasing the assessed risk.

Before observing the failure, the team may be uncertain whether the risk exists. After observing it, uncertainty is lower, but the risk is confirmed.

So the risk profile should distinguish:

- how uncertain the risk is;
- how likely or widespread it appears within the available evidence;
- how severe its consequence is;
- how well the current design contains it; and
- what evidence is still missing.

Failure understanding supplies evidence for these judgements. It does not make the final risk-acceptance decision.

## Three outputs from one failure finding


A useful failure finding can have three different consequences at once.

### Product consequence


Does the solution, scope, interaction, or product expectation need reconsideration?

This goes to Discovery.

### Implementation consequence


Does the current system violate clear committed behaviour?

This goes to Delivery.

### Evaluation consequence


Did the failure expose missing coverage, an unclear criterion, an unreliable evaluator, or incomplete trace evidence?

This goes to Quality Understanding or Evidence Capability.

For example:

```text
Finding:
Ambiguous Visa reference was resolved to one account.
```


can produce:

```text
Discovery:
Decide whether one-shot capture should leave the field unresolved
or introduce clarification.

Delivery:
Prevent non-unique references from populating account_id.

Quality Understanding:
Add/refine "ambiguous reference resolved without evidence."

Coverage:
Add unique, ambiguous, and unknown reference contrast cases.

Evidence Capability:
Capture all reference candidates considered by the resolver.
```


One observed failure can validly create work in several loops.

## Integrated feedback model


I would place failure understanding in the overall system like this:

```text
                    DISCOVERY

Opportunity
    ↓
Solution and risk profile
    ↓
Hypotheses
    ↓
Prototype / probe / user study
    ↓
Behaviour and outcome evidence
    ↓
FAILURE UNDERSTANDING
    ↓
Findings
    ├── update hypotheses
    ├── revise risk profile
    ├── change solution or scope
    └── support / reject commitment

                     DELIVERY

Production Slice Contract
    ↓
Candidate / release / production use
    ↓
Behaviour and outcome evidence
    ↓
FAILURE UNDERSTANDING
    ↓
Findings
    ├── define Delivery change
    ├── add regression protection
    ├── change release or rollout
    ├── reopen Discovery
    ├── revise Quality Understanding
    └── improve Evidence Capability
```


The failure model remains a reusable Quality Understanding asset. The **findings derived from it** are what enter Discovery and Delivery decisions.

That distinction matters:

```text
Failure model
    = reusable understanding of recurring failures

Failure finding
    = scoped conclusion from selected evidence

Product decision
    = what Discovery or Delivery chooses to do
```


The source failure-understanding method already separates trace observations, recurring categories, operational criteria, measurement, and subsequent improvement. The revised framing makes the routing explicit.

## Minimal addition to the framework


I would add one step after failure-model development:

```text
Failure model
        ↓
Decision integration
        ├── affected hypothesis
        ├── affected solution risk
        ├── affected product expectation
        ├── affected delivery behaviour
        ├── coverage / evaluator implication
        └── next decision or investigation
```


This does not belong inside every failure mode. It belongs in the **scoped finding produced by the investigation**.

A compact decision-integration table is enough:

|Finding|Hypothesis/risk effect|Route|Next decision|
|---|---|---|---|
|Ambiguous account selected without evidence|Weakens H-B2; confirms feasibility and control risk for ambiguous references|Discovery + Delivery + Quality Understanding|Narrow initial scope or add unresolved-state behaviour; implement deterministic uniqueness check|

So yes: failure understanding is part of feedback about the product, but more precisely it is the method that converts raw product-behaviour feedback into reusable understanding and decision-relevant findings.

The full loop becomes:

```text
Product behaviour and feedback
        ↓
Failure understanding
        ↓
Findings
        ↓
Update hypotheses and risks
        ↓
Change Discovery, Delivery,
Quality Understanding, or Evidence Capability
        ↓
Observe again
```

# additional


Yes--**we considered the planes and automated evaluators in `ai-evaluation.md`, but we haven't yet connected them tightly enough to Failure Understanding and the Discovery/Delivery activities.**

The current architecture already distinguishes:

- **offline** evaluation for controlled probes, replay, candidate comparison, regression, evaluator calibration, and release evidence;
- **online synchronous** evaluation or controls inside the live path;
- **online asynchronous** evaluation over production traces for monitoring, failure discovery, drift detection, and dataset growth.

It also already defines increasing levels of operational use:

```text
informational result
→ warning
→ release gate
→ runtime control
```


and says that automation should increase only after the criterion, evidence, evaluator, and result rule are sufficiently stable.

What is missing is an explicit end-to-end relationship:

```text
Failure Understanding
        ↓
Operational criterion
        ↓
Automated evaluator
        ↓
Offline and/or online application
        ↓
Measurement and finding
        ↓
Discovery / Delivery feedback
```

## Three independent dimensions


We should avoid treating "offline", "online", and "automatic evaluator" as one classification. They answer different questions.

### 1. Product activity


Where is the product work happening?

```text
Discovery
Delivery development
Release
Production operation
```

### 2. Execution plane


Where is the system behaviour produced or evaluated?

```text
Offline
Online synchronous
Online asynchronous
```

### 3. Judgement method


How is the evidence assessed?

```text
Code-based check
Reference comparison
Model-based evaluator
Human or domain review
```


An automatic evaluator is a **judgement method**. Offline or online is its **placement**.

The same evaluator may run in more than one plane.

For example:

```text
Criterion:
An ambiguous account reference must remain unresolved.

Code-based evaluator:
Inspect the draft and fixture.
Fail when multiple active accounts match
and account_id is populated.
```


That evaluator could run:

- offline against a diagnostic or regression set;
- offline against a candidate before release;
- online asynchronously over sampled production traces;
- possibly online synchronously as a blocking product control.

Those uses have different requirements and consequences.

## Relationship with Failure Understanding


Our current `failure-understanding.md` already establishes the right boundary:

```text
failure observations
→ failure modes
→ failure model
────────────────────
→ operational criteria
→ evaluators
→ labels
→ measurements
```


It explicitly says that failure-model development and failure measurement are separate activities.

That separation is correct.

Failure Understanding discovers and clarifies:

- what the recurring failure is;
- which product expectation it violates;
- what evidence is needed to recognise it;
- where its boundary lies;
- which successful cases contrast with it;
- what remains ambiguous.

The next activity takes a selected failure mode and makes it operational:

```text
Failure mode
        ↓
Criterion
        ↓
Evaluator
        ↓
Evaluator validation
        ↓
Placement
        ↓
Decision rule
```


The attached automated-evaluator material describes this as the move from analysing failures to measuring their prevalence and changes. It recommends failure-specific evaluators, using code for objective checks and an LLM judge for semantic or contextual judgement.

I would call the next method:

> **Operationalising Product Behaviour and Building Automated Evaluators**

This is broader and more accurate than simply `automatic-evaluators.md`, because automation cannot begin until the criterion and evidence requirements are clear.

## The complete Quality Understanding path


The revised path would be:

```text
1. Evaluation coverage

Product expectations
+ evaluation question
        ↓
Cases or production-sample definition
```

```text
2. Failure understanding

Executions and traces
        ↓
Concrete observations
        ↓
Recurring failure modes
        ↓
Failure model
```

```text
3. Operationalisation

Selected failure or success behaviour
        ↓
Explicit criterion
        ↓
Required evidence
        ↓
Reference examples and labels
```

```text
4. Evaluator construction

Code-based check
or reference comparison
or model-based judge
or human review procedure
        ↓
Validation against trusted judgement
```

```text
5. Evaluator application

Offline and/or online
        ↓
Labels
        ↓
Measurements
        ↓
Scoped findings
```

```text
6. Product feedback

Discovery
Delivery
Quality Understanding
Evidence Capability
```

## Offline use


Offline evaluation is the main controlled environment for both Discovery and Delivery.

### Discovery


Offline automatic evaluators can help answer:

- Does the prototype exhibit the proposed behaviour?
- Which failure modes appear?
- How broad is the apparent feasibility boundary?
- Did one candidate solution or model perform better?
- Does a safety hypothesis hold in the selected test space?

Example:

```text
Discovery hypothesis:
The interpreter exposes ambiguous account references.

Offline cases:
unique, ambiguous, and unknown account references

Automatic evaluator:
check whether account_id is populated appropriately

Finding:
supports / weakens / leaves hypothesis inconclusive
```


This updates:

- the solution hypothesis;
- feasibility and safety risks;
- proposed production scope;
- remaining uncertainty;
- the productization decision.

### Delivery development


Offline evaluators support:

- baseline versus candidate comparison;
- prompt or model changes;
- regression detection;
- release-candidate evidence;
- incident reproduction;
- replay of production cases.

Reference-based evaluators are particularly useful for stable cases with product-defined expected values. Reference-free evaluators can check intrinsic rules and are easier to apply to new, unlabeled traces. The attached material describes both approaches and notes that reference-free checks are particularly useful for broader monitoring, including potential online use.

For Wallet:

```text
Candidate:
interpreter-v18

Baseline:
interpreter-v17

Offline evaluation:
- existing regression set
- ambiguous-reference challenge cohort
- production replays

Finding:
v18 eliminates selected ambiguous-reference failures
without regressing determinate account resolution
```


That becomes Delivery evidence for a candidate change.

## Online asynchronous use


This is where automated evaluators become a scalable **product-feedback mechanism**.

```text
Production executions
        ↓
Sample and capture traces
        ↓
Apply automated evaluators
        ↓
Failure signals and measurements
        ↓
Select cases for review
        ↓
Failure understanding
        ↓
Revise product and evaluation assets
```


Typical uses include:

- estimating failure prevalence in a declared production sample;
- monitoring change over time;
- comparing cohorts or rollout versions;
- detecting a known regression;
- identifying uncertain or novel traces for human review;
- discovering that offline coverage does not match production;
- creating new diagnostic and regression cases.

The automated-evaluator source explicitly frames automation as a way to estimate the prevalence of failure modes and measure whether a prompt, retrieval, or model change helped or harmed specific behaviours.

But the evaluator output is not automatically a product finding.

We still need:

```text
Evaluator outputs
        ↓
Measurement over a declared sample
        ↓
Interpretation with evaluator reliability
and sample limitations
        ↓
Scoped finding
        ↓
Product decision
```


For example:

> The account-ambiguity evaluator flagged 4.8% of sampled B1 expense traces during the declared week.

That is still incomplete.

We need to know:

- how the sample was selected;
- whether the evaluator has been validated;
- its false-pass and false-fail behaviour;
- whether the production evidence contains everything required;
- whether the rate changed relative to a baseline;
- what uncertainty surrounds the estimate.

## Online synchronous use


Online synchronous placement should be narrower.

This plane sits inside the live request or action path, so failures in the evaluator can directly affect users.

The preferred uses are deterministic:

- schema validation;
- account and currency validation;
- permission checks;
- confirmation boundaries;
- invariant enforcement;
- prohibited-action prevention;
- fallback selection.

For Wallet:

```text
Before persistence:

account exists
currency is valid
draft is complete
confirmation is current
idempotency key is unused
        ↓
allow or reject persistence
```


These are automatic evaluations in a broad sense, but operationally I would call them:

> **runtime controls**

They enforce a product boundary rather than merely measure behaviour.

An LLM judge in the synchronous path should be the exception because it adds latency, cost, nondeterminism, and another failure dependency. The existing evaluation architecture already states that slow or probabilistic judges belong in the synchronous path only when their validated benefit justifies the operational risk.

## Automatic evaluators need their own evidence


An automated evaluator is another system under test.

For code-based evaluators, validate:

- whether the relevant evidence paths exist;
- whether the logic matches the criterion;
- boundary cases;
- missing-value behaviour;
- fixture and version compatibility.

For LLM judges, the uploaded source recommends:

- one narrow criterion per evaluator;
- explicit pass/fail definitions;
- examples grounded in human-labelled traces;
- structured output;
- separate development and held-out test data;
- measurement of agreement such as true-positive and true-negative rates;
- continued reassessment as production behaviour changes.

So the evaluator lifecycle is:

```text
Human-defined criterion
        ↓
Trusted labelled examples
        ↓
Evaluator implementation
        ↓
Calibration and held-out validation
        ↓
Accepted operating scope
        ↓
Offline use
        ↓
Optional online asynchronous use
        ↓
Continued sampling and human comparison
        ↓
Recalibration or retirement
```


It should not move directly from a prompt draft to a production gate.

## Product-feedback loop with automation


The complete loop is:

```text
Product expectations
        ↓
Initial coverage
        ↓
Offline executions
        ↓
Failure Understanding
        ↓
Failure model
        ↓
Operational criteria
        ↓
Validated automatic evaluators
        ├───────────────────────────────┐
        ↓                               ↓
Offline application             Online asynchronous application
candidate comparison            production monitoring
regression evaluation           prevalence and drift
release evidence                case discovery
        ↓                               ↓
        └──────── findings and traces ──┘
                        ↓
              Product feedback
                        ↓
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
    Discovery        Delivery       Evaluation subsystem
hypotheses, risks   system change   coverage, criteria,
solution, scope     release/rollback evaluator, evidence
```


Online evidence then feeds back into offline coverage:

```text
online failure signal
        ↓
human review / failure understanding
        ↓
confirmed or revised failure mode
        ↓
new case and criterion
        ↓
offline regression protection
```

## How findings affect Discovery and Delivery

### Discovery feedback


Automated findings may:

- support or weaken an SUT-behaviour hypothesis;
- confirm or localise a feasibility risk;
- expose a new safety hypothesis;
- narrow proposed production scope;
- compare solution candidates;
- show that residual uncertainty is still too high for commitment.

They cannot independently establish user value or usability.

### Delivery feedback


Automated findings may:

- identify a clear contract violation;
- define a change hypothesis;
- compare baseline and candidate;
- block or warn on a release;
- control rollout;
- trigger rollback or investigation;
- create regression protection;
- identify production drift.

### Evaluation feedback


Automatic evaluator application may also reveal:

- the criterion is ambiguous;
- the evaluator is unreliable;
- the trace lacks required evidence;
- production inputs are outside the evaluator's validated scope;
- the offline case set misses an important situation.

Those findings update Quality Understanding or Evidence Capability.

## Recommended document sequence


The methodology now naturally becomes:

```text
10-evaluation-coverage.md
    Designing Evaluation Coverage and Cases

20-failure-understanding.md
    Discovering and Structuring Recurring Failures

30-automatic-evaluators.md
    Operationalising Behaviour and Building
    Automated Evaluators
```


Then `30-automatic-evaluators.md` should cover four things:

1. turning failure modes and other product expectations into criteria;
2. implementing code-based, reference-based, and model-based evaluators;
3. validating evaluator reliability;
4. placing evaluators offline, online asynchronously, or--under stricter conditions--online synchronously.

So the answer is: **yes, the planes and automatic evaluators are present in the overall architecture, but the next document must make them the explicit bridge from Failure Understanding to scalable Discovery, Delivery, release, and production feedback.**
