---
draft: false
toc: true
title: "Operationalising Product Behaviour with Automated Evaluators"
linkTitle: "Automated Evaluators"
---
## 1. Purpose


Automated evaluators turn explicit product-behaviour criteria into repeatable judgements that can be applied across many executions.

They provide the bridge from:

```text
Product expectations
and Failure Understanding
        ↓
Operational criteria
        ↓
Repeatable judgement
        ↓
Labels and measurements
        ↓
Scoped findings
        ↓
Product and evaluation decisions
```


Automated evaluators operate inside the evaluation subsystem described in [AI Evaluation as an Iterative Engineering Practice]({{< ref "ai-engineering/evaluation/v2/ai-evaluation" >}}) and the broader [AI Product Improvement System]({{< ref "ai-engineering/evaluation/v2/product-improvement-system" >}}).

They use:

- evaluation cases and samples designed through [Designing Evaluation Coverage and Cases]({{< ref "ai-engineering/evaluation/v2/10-evaluation-coverage" >}});
- product expectations from provisional solution definitions or Production Slice Contracts;
- failure modes and boundaries developed through [Failure Understanding]({{< ref "ai-engineering/evaluation/v2/failure-understanding" >}});
- execution evidence captured by the Evidence Capability Loop; and
- trusted human or domain judgement used to validate the evaluator.

The central question is:

> **How can a product-behaviour criterion be applied repeatably and reliably enough to support the intended Discovery, Delivery, release, or production decision?**

Automation is valuable because manual review does not scale to every candidate change or production execution. A validated evaluator can help a team:

- compare system versions;
- detect known regressions;
- measure selected behaviours over a declared sample;
- monitor production;
- select traces for human review;
- support release evidence; and
- enforce narrow runtime boundaries when deterministic checks are available.

Automation does not remove judgement. It moves a reviewed judgement rule into a repeatable mechanism whose reliability, scope, and limitations must be established and maintained.

The recurring process is:

```text
Select a product expectation or failure mode
        ↓
Define an operational criterion
        ↓
Identify the evidence required
        ↓
Choose and implement an evaluator
        ↓
Validate it against trusted judgement
        ↓
Place it offline or online
        ↓
Apply it to executions
        ↓
Produce labels, measurements, and findings
        ↓
Change the product, Quality Understanding,
or Evidence Capability
        ↓
Revalidate and apply again
```

## 2. Position in the evaluation system


Automated evaluator construction follows coverage design and the initial development of Quality Understanding.

A typical failure-oriented path is:

```text
Evaluation question
        ↓
Coverage requirements and cases
        ↓
Executions and complete traces
        ↓
Failure Understanding
        ↓
Recurring failure modes
        ↓
Operational criteria
        ↓
Automated evaluators
        ↓
Labels and measurements
        ↓
Scoped findings
        ↓
Decision
```


Failure Understanding discovers and clarifies recurring failures. Automated evaluator work makes a selected behaviour recognisable at scale.

The boundary is important:

```text
Failure mode
    describes a recurring product-behaviour failure

Criterion
    states how one execution should be judged

Evaluator
    applies the criterion to evidence

Label
    records the evaluator's judgement

Measurement
    aggregates labels over a declared set or sample

Finding
    interprets the measurement for a decision
```


A failure mode is not automatically an evaluator. An evaluator output is not automatically a product finding. A measurement does not make the product decision.

Automated evaluators also apply to expected successful behaviour, guarantees, invariants, and operating limits. They do not have to originate from a failure mode.

For example:

```text
Product guarantee:
No financial effect occurs before explicit confirmation.
        ↓
Criterion:
Fail when a persistence effect precedes a valid confirmation.
        ↓
Code-based evaluator:
Compare confirmation and persistence events in the trace.
```

## 3. Three independent views


Automated evaluation is easier to reason about when three dimensions remain separate.

### 3.1 Product activity


This states why evaluation is being used:

```text
Product Discovery
Productization commitment
Delivery development
Release and rollout
Production operation
Evaluation-subsystem improvement
```

### 3.2 Execution plane


This states where the system behaviour is produced or the evaluator is applied:

```text
Offline
Online synchronous
Online asynchronous
```

### 3.3 Judgement method


This states how evidence is assessed:

```text
Code-based check
Reference comparison
Model-based evaluator
Human or domain review
```


These dimensions can be combined in different ways.

For example, the same code-based evaluator may run:

- offline against a Discovery prototype;
- offline against a Delivery candidate;
- offline as a release regression check;
- online asynchronously over sampled production traces; and
- online synchronously as a runtime control.

The placement changes the operational requirements and consequence. It does not change the underlying criterion.

## 4. Core concepts

### 4.1 Behavioural criterion


A **behavioural criterion** defines how an observed execution should be judged with respect to one product expectation.

A useful criterion states:

- when it applies;
- which evidence is required;
- what constitutes `Pass`;
- what constitutes `Fail`;
- when the result is `Not applicable`;
- when the result is `Unknown` or `Unable to judge`; and
- any material exclusions or limitations.

Example:

> **Criterion:** When more than one active Wallet account matches the user's account reference, the transaction draft must not contain a resolved account identifier.

### 4.2 Evaluator


An **evaluator** is an attributable mechanism that applies one criterion to execution evidence.

An evaluator may be:

- code;
- a reference comparison;
- a model-based judge;
- a human-review procedure; or
- a controlled combination of these.

Each judgement should identify the criterion and evaluator version that produced it.

### 4.3 Automated evaluator


An **automated evaluator** is an evaluator that can apply a criterion without a human making each individual judgement.

The main forms in this document are:

- code-based evaluators;
- reference-based evaluators;
- reference-free evaluators; and
- model-based evaluators, including LLM-as-Judge.

An evaluator can belong to more than one of these categories. For example, a code-based evaluator may compare an observed field with a reference value.

### 4.4 Reference-based evaluator


A **reference-based evaluator** compares observed behaviour with a trusted expected value, output, state, or trace property.

Examples:

- compare a generated account identifier with the expected account identifier;
- compare a parsed transaction draft with a trusted expected draft;
- compare a generated SQL abstract syntax tree with a reference structure;
- compare a tool-call sequence with a trusted sequence when order is product-defined.

Reference-based evaluators are well suited to controlled offline cases and regression suites.

### 4.5 Reference-free evaluator


A **reference-free evaluator** applies a rule or criterion without requiring one complete golden output.

Examples:

- check that every invoked tool exists in the tool registry;
- check that an ambiguous account reference remains unresolved;
- check that no persistence event precedes confirmation;
- judge whether a response makes an unsupported completion claim;
- verify that required output fields are present.

Reference-free evaluators are useful for new and production traces because they can apply wherever the required evidence is available.

### 4.6 Code-based evaluator


A **code-based evaluator** applies deterministic program logic to evidence.

Code-based evaluators are preferred when the criterion can be represented faithfully through:

- exact values;
- schemas;
- state transitions;
- tool calls;
- permissions;
- required or forbidden actions;
- deterministic business rules;
- executable outputs; or
- trace order.

They are fast, cheap, reproducible, and usually easier to inspect than model-based judgement.

### 4.7 Model-based evaluator


A **model-based evaluator** uses a model to apply a criterion that requires semantic or contextual interpretation.

Examples include judging whether:

- a summary preserves the main point;
- a claim is supported by provided evidence;
- an explanation clearly communicates an ambiguity;
- a response follows a declared persona or tone;
- a tool call is justified by the preceding interaction.

An **LLM-as-Judge** is one form of model-based evaluator.

### 4.8 Trusted label


A **trusted label** is a reviewed judgement used as a reference for evaluator development or validation.

Trusted labels normally come from product, domain, or evaluation reviewers who have:

- the relevant product context;
- sufficient trace evidence;
- an explicit criterion; and
- an adjudication process for disagreements.

A label is trusted within a declared scope. It is not permanent ground truth when product expectations or criteria can change.

### 4.9 Evaluator validation


**Evaluator validation** establishes how reliably an evaluator applies its criterion relative to trusted judgement.

Validation should identify:

- the evaluator version;
- the criterion version;
- the labelled set and its construction;
- agreement and disagreement patterns;
- false-pass and false-fail behaviour;
- conditions outside the evaluator's scope; and
- the intended operational use.

### 4.10 Placement


**Placement** states where an evaluator runs:

- offline;
- online synchronously; or
- online asynchronously.

Placement determines latency, cost, reliability, failure handling, exposure to live effects, and the strength of validation required.

### 4.11 Decision rule


A **decision rule** states how evaluator evidence influences an action.

Examples:

```text
informational only
warning requiring review
release gate
rollout pause
rollback trigger
runtime block or fallback
```


The evaluator produces evidence. The decision rule determines how that evidence is used.

## 5. Role across Product Discovery and Product Delivery


Automated evaluators support different decisions across the product lifecycle.

| Context | Typical evaluator role | Main limitation |
| --- | --- | --- |
| **Product Discovery** | Test provisional SUT behaviour, compare technical candidates, expose feasibility and safety boundaries | Does not establish user value, problem importance, or usability |
| **Productization commitment** | Summarise known behavioural feasibility, failure boundaries, and residual uncertainty | One input among value, usability, feasibility, viability, and safety evidence |
| **Delivery development** | Compare baseline and candidate behaviour, detect targeted failures and regressions | Applies only to represented cases, criteria, and configurations |
| **Release and rollout** | Supply repeatable evidence for critical criteria and known regressions | Product and release owners still accept risk and decide |
| **Production operation** | Monitor known behaviours, estimate prevalence, detect change, and select cases for review | Depends on sampling, trace completeness, evaluator validity, and distribution fit |
| **Evaluation improvement** | Test criteria, judges, checks, and evidence paths | May expose evaluation failure rather than product failure |

### 5.1 Discovery use


A Discovery evaluator may answer:

- Can the proposed interpreter produce the intended draft?
- Does a prototype expose material uncertainty?
- Does a technical candidate preserve a safety boundary?
- Which candidate behaves better under the same controlled cases?
- Which failure modes appear often enough in the selected evidence to affect the solution hypothesis?

Evaluator findings may:

- support or weaken an SUT-behaviour hypothesis;
- localise a broad feasibility risk;
- expose a new safety hypothesis;
- narrow proposed production scope;
- distinguish candidate solutions; or
- show that behavioural uncertainty remains too high for commitment.

They do not establish that users prefer the interaction or that the solution improves the target outcome.

### 5.2 Delivery use


A Delivery evaluator may answer:

- Did a change fix the targeted committed behaviour?
- Did it regress another production behaviour?
- Does the candidate preserve critical invariants?
- Does the release candidate meet its declared behavioural gate?
- Is production behaviour changing relative to the accepted baseline?

A failure against a clear Production Slice Contract can become:

```text
confirmed behaviour gap
        ↓
Delivery change hypothesis
        ↓
candidate implementation
        ↓
offline comparison
        ↓
controlled release
        ↓
online observation
```

### 5.3 Production evidence can reopen Discovery


An automated evaluator may show that the system follows the committed behaviour while users still struggle or the product outcome does not improve.

That is not necessarily an evaluator or implementation failure.

Examples:

- unresolved fields are handled according to the contract, but users abandon the workflow;
- generated drafts satisfy field criteria, but users do not notice important mistakes;
- model quality meets the release threshold, but the interaction does not reduce capture effort;
- the quality level needed for user value is operationally too expensive.

These findings should reopen Product Discovery because the solution, scope, or product expectation may need to change.

## 6. Select behaviours worth operationalising


Not every observed failure or product expectation requires an automated evaluator.

Automation has a creation and maintenance cost. It is most useful when repeated judgement will inform repeated decisions.

A behaviour is a stronger automation candidate when:

- it is connected to a recurring decision;
- it represents a product guarantee or important failure mode;
- it is likely to recur across cases or production;
- system changes may improve or regress it;
- manual review would be slow or inconsistent at the required scale;
- the required evidence can be captured;
- the criterion is sufficiently clear;
- evaluator error can be measured; and
- the expected decision value justifies the cost.

### 6.1 Clarify product intent before automating


Do not automate judgement for an expectation that is vague, missing, or disputed.

For example:

> "The response should be concise."

This is not operational enough. The team must first decide what concise means in the relevant situation and why it matters.

Likewise, if a model fails because an instruction, tool description, or product boundary was never specified, the first action may be to clarify the product or system definition.

The correct routing is:

```text
Observed problem
        ↓
Is the intended behaviour clear?
        ├── no → Product Discovery or
        │        Quality Understanding
        └── yes
              ↓
Is repeated measurement useful?
        ├── no → fix or investigate directly
        └── yes → operationalise and automate
```


Automating a poorly specified expectation measures whether the system can infer an intent the team has not expressed clearly.

### 6.2 Distinguish implementation tests from behavioural evaluators


Some failures should be addressed with ordinary software tests.

Examples:

- a parser crashes on valid JSON;
- a database transaction is not idempotent;
- a tool name is misspelled in a registry;
- a deterministic date function returns the wrong value.

Use standard unit, integration, or property-based tests when the issue is an exact implementation rule.

Use evaluation cases and automated evaluators when behaviour depends on probabilistic, semantic, contextual, or end-to-end system interaction.

The two systems complement each other.

## 7. Turn product behaviour into an operational criterion


Evaluator construction begins with the criterion.

A narrow criterion is easier to apply, validate, diagnose, and maintain than a broad request to judge whether an execution is "good."

A criterion should answer:

```text
Applicability
When does this rule apply?

Required evidence
What must be visible?

Pass
What acceptable behaviour looks like?

Fail
What unacceptable behaviour looks like?

Not applicable
When this criterion does not apply?

Unknown
When available evidence cannot support a judgement?
```

### 7.1 Example: Wallet account ambiguity

```text
Criterion:
Ambiguous account reference remains unresolved.

Applies when:
More than one active account matches the user's account reference.

Pass:
The draft does not contain a resolved account identifier and the
user-visible state does not claim that one account was selected.

Fail:
The draft contains a resolved account identifier or the response
claims a unique selection without supporting evidence.

Not applicable:
Zero or one active account matches the reference.

Unknown:
The trace does not include the matching-account set or final draft.
```

### 7.2 One criterion per evaluator judgement


A single evaluator should normally apply one narrow criterion.

Avoid prompts such as:

> Judge whether the response is correct, relevant, safe, concise, helpful, and well written.

A single failure can be hidden by a broad overall rating, and disagreements become difficult to diagnose.

Separate criteria may still be aggregated later for a declared decision.

### 7.3 Binary judgement where suitable


Binary `Pass`/`Fail` decisions are often easier to automate and validate than open-ended ratings, especially for model-based evaluators.

However, the full result space should usually include:

```text
Pass
Fail
Not applicable
Unknown or Unable to judge
Evaluator error
```


Do not force missing evidence or evaluator failure into `Pass` or `Fail`.

## 8. Define the evidence required by the criterion


An evaluator can judge only what the evidence makes visible.

For each criterion, identify the minimum evidence required.

Examples:

| Criterion | Required evidence |
| --- | --- |
| Ambiguous account remains unresolved | user reference, matching accounts, final draft |
| No persistence before confirmation | confirmation event, persistence event, resulting state |
| Completion is not claimed after failure | operation result, final user-facing response |
| User constraint is preserved | original constraint, relevant intermediate state or action, final outcome |
| Summary preserves main point | source content, generated summary, criterion definition |

The evaluator should return `Unknown` when required evidence is missing.

This creates a direct feedback path:

```text
Criterion requires evidence
        ↓
Evidence is absent
        ↓
Unable to judge
        ↓
Evidence Capability finding
        ↓
Instrumentation or trace change
```


The final response alone is often insufficient for end-to-end product behaviour.

## 9. Reference-based and reference-free evaluation


Both forms can apply to one product behaviour.

### 9.1 Reference-based evaluation


Reference-based evaluation compares the execution with a trusted expected value or outcome.

For Wallet:

```text
Input:
"Paid $24 with Visa yesterday"

Fixture:
one active Visa account

Trusted expected draft:
type = expense
amount = 24
account_id = visa-personal
date = 2026-08-26
```


A reference-based evaluator can compare the observed draft fields with the trusted draft.

This is useful for:

- stable offline cases;
- regression sets;
- controlled candidate comparisons;
- CI checks;
- known incidents; and
- deterministic expected outputs.

Reference data should be reviewed against product intent. It should not be generated from the current SUT and then treated as its own norm.

### 9.2 Reference-free evaluation


Reference-free evaluation checks an intrinsic property or product rule.

For the ambiguous Wallet case:

```text
if number_of_matching_accounts > 1:
    draft.account_id must be unresolved
```


No complete golden draft is required.

This is useful for:

- broad challenge sets;
- newly collected traces;
- production monitoring;
- variable outputs with stable properties; and
- behaviours where several responses are acceptable.

### 9.3 Use both where useful


One case may receive both kinds of judgement.

Example:

```text
Reference-based:
The amount, date, and account match the expected draft.

Reference-free:
No ledger effect occurs before explicit confirmation.
```


The criteria remain separate even when they run over the same trace.

### 9.4 Executability and effect checks


Some outputs should be evaluated through their functional effect.

Examples:

- execute generated SQL against a controlled database;
- simulate or validate a tool call;
- verify that a transaction draft passes domain validation;
- check the resulting ledger state;
- confirm that a generated action is idempotent.

Functional checks are stronger than surface-text similarity when the product expectation concerns execution.

## 10. Choose the evaluator method


Use the lowest-cost and most deterministic method that can faithfully apply the criterion.

```text
Can the criterion be expressed as an exact rule?
        ├── yes → code-based evaluator
        └── no
              ↓
Is there a trusted reference that represents the behaviour?
        ├── yes → reference comparison,
        │        possibly with code or model judgement
        └── no
              ↓
Does the criterion require semantic or contextual judgement?
        ├── yes → model-based evaluator
        │        validated against trusted labels
        └── no → human or domain review
```


This is a method-selection guide, not a requirement to automate every criterion.

### 10.1 Prefer code for objective behaviour


Use code-based checks for:

- schemas and parseability;
- exact fields and identifiers;
- required or forbidden tool names;
- state transitions;
- confirmation and permission boundaries;
- date and arithmetic rules;
- idempotency;
- trace ordering;
- persistence and external effects;
- executable outputs; and
- presence of required evidence.

### 10.2 Use model-based judgement for semantic behaviour


Use a model-based evaluator when code cannot represent the criterion faithfully.

Examples:

- the answer is supported by the supplied evidence;
- the response communicates uncertainty without misleading the user;
- a summary captures the main point;
- a clarification clearly explains what information is missing;
- a tone matches an explicit persona definition.

### 10.3 Keep human review for unstable judgement


Use human or domain review when:

- the product expectation is still changing;
- reviewers disagree about the criterion;
- the behaviour is novel;
- the consequence is high;
- the evaluator is being calibrated;
- the trace falls outside the evaluator's validated scope; or
- adjudication is required.

## 11. Build a code-based evaluator


A code-based evaluator should be small, attributable, and testable.

### 11.1 Implementation sequence


1. State the criterion.
2. Identify required evidence paths.
3. Define `Pass`, `Fail`, `Not applicable`, `Unknown`, and evaluator-error behaviour.
4. Implement the smallest exact check.
5. Test straightforward, boundary, missing-evidence, and malformed-evidence cases.
6. Compare its outputs with trusted reviewed examples.
7. Version the criterion and implementation.
8. Record its accepted scope and limitations.

### 11.2 Wallet example

```python
def evaluate_ambiguous_account_resolution(trace):
    matches = trace.get("matching_active_accounts")
    draft = trace.get("final_draft")

    if matches is None or draft is None:
        return {"label": "UNKNOWN", "reason": "Required evidence is missing."}

    if len(matches) <= 1:
        return {"label": "NOT_APPLICABLE"}

    if draft.get("account_id") is not None:
        return {
            "label": "FAIL",
            "reason": "A non-unique account reference was resolved."
        }

    return {"label": "PASS"}
```


The evaluator is reference-free. It checks a product rule against trace evidence.

A reference-based version could instead compare `draft.account_id` with an expected value for determinate cases.

### 11.3 Validate code-based evaluators


Deterministic code can still be wrong.

Validate:

- evidence-path selection;
- null and missing-data handling;
- boundary conditions;
- fixture assumptions;
- criterion interpretation;
- version compatibility; and
- whether the check accidentally judges implementation detail that the product does not require.

Unit tests protect evaluator logic. Trusted reviewed traces establish that the code represents the intended criterion.

## 12. Build an LLM-as-Judge evaluator


An LLM-as-Judge applies a narrow semantic criterion to supplied evidence.

It should be treated like a classifier developed through prompt design and validation.

### 12.1 Use one narrow task


A judge prompt should focus on one criterion.

For example:

> Determine whether the Wallet response clearly states that multiple accounts matched the user's reference and avoids implying that one account has already been selected.

Do not combine this with amount correctness, tone, transaction type, and confirmation safety.

### 12.2 Prompt components


A useful judge prompt contains:

1. **Task and criterion**
   State exactly what is being judged.
2. **Applicability**
   State when the criterion applies.
3. **Pass and Fail definitions**
   Define both sides explicitly.
4. **Unknown rule**
   Require `Unknown` when evidence is insufficient.
5. **Evidence supplied**
   Include only the trace portions needed for the criterion.
6. **Examples**
   Use reviewed Pass, Fail, and where useful Unknown examples.
7. **Structured output**
   Require a machine-readable result.

Example output:

```json
{
  "label": "PASS",
  "explanation": "The response states that two Visa accounts matched and asks the user to choose one.",
  "evidence": ["assistant_message"]
}
```

### 12.3 Example prompt

```text
You are evaluating one behaviour of a Wallet transaction-capture product.

Criterion:
When multiple accounts match the user's account reference, the user-facing
response must make the ambiguity clear and must not imply that one account
has already been selected.

Pass:
The response explicitly communicates that multiple accounts matched and
asks the user to choose or provide a unique account.

Fail:
The response claims or implies that one account was selected, or it hides
the material ambiguity.

Unknown:
The supplied evidence is insufficient to determine what the user was told.

Return JSON:
{
  "label": "PASS" | "FAIL" | "UNKNOWN",
  "explanation": "One or two sentences grounded in the supplied evidence."
}

User input:
{{USER_INPUT}}

Matching accounts:
{{MATCHING_ACCOUNTS}}

User-facing response:
{{ASSISTANT_RESPONSE}}
```

### 12.4 Keep the judge separate from product intent


The judge applies a criterion. It does not define the criterion.

If judge disagreements expose that Pass and Fail are unclear, return to Quality Understanding and clarify the product expectation or criterion.

### 12.5 Treat judge explanations as evidence aids


A short explanation helps reviewers inspect decisions and diagnose disagreement.

It is not proof that the judgement is correct. Validation against trusted labels remains required.

## 13. Build trusted labels and data splits


Model-based evaluators require labelled examples that are separate from the product traces on which final performance is reported.

### 13.1 Create trusted labels


Label examples using:

- the current criterion;
- complete required evidence;
- product or domain reviewers;
- explicit treatment of `Unknown`;
- disagreement review; and
- preserved provenance.

When reviewers disagree, resolve whether the problem is:

- an unclear product expectation;
- an unclear criterion;
- insufficient evidence;
- an edge case that needs a separate rule; or
- ordinary reviewer error.

### 13.2 Use disjoint sets


Separate labelled examples into:

- **Prompt-example set**
  Examples eligible for use as few-shot demonstrations.
- **Development set**
  Examples used to refine the prompt and inspect disagreement.
- **Test set**
  Held-out examples used only after the evaluator design is frozen.

The sets must remain disjoint.

Do not use development or test examples as prompt demonstrations. Doing so leaks the answer and inflates reported agreement.

### 13.3 Balance evaluator-validation data deliberately


A validation set often needs enough Pass and Fail examples to estimate both kinds of evaluator error.

This balance does not have to match production prevalence.

The purposes differ:

```text
Validation set
    estimates evaluator behaviour across labels

Production sample
    estimates product behaviour in a live population
```


Keep these interpretations separate.

### 13.4 Version labels with the criterion


When a criterion changes, existing labels may no longer be comparable.

Review and relabel affected examples before using them to validate a revised evaluator.

## 14. Validate evaluator reliability


An automated evaluator is another system under test.

### 14.1 Evaluate on the development set


For an LLM judge:

1. write a baseline prompt;
2. run it on the development set;
3. compare with trusted labels;
4. inspect false passes, false fails, and Unknown disagreements;
5. clarify the criterion or prompt;
6. change examples only from the prompt-example set; and
7. repeat until the design is stable enough for held-out testing.

Disagreement analysis may reveal that the failure mode or criterion itself needs refinement.

### 14.2 Freeze and test


After development:

- freeze the criterion;
- freeze the judge prompt and model configuration;
- run the held-out test set;
- report the confusion matrix and per-label performance;
- record limitations and unsupported conditions; and
- decide whether reliability is sufficient for the intended placement.

Do not report development-set performance as held-out reliability.

### 14.3 Define the positive label explicitly


Terms such as TPR and TNR depend on which label is considered positive.

For a Pass/Fail evaluator, report plain-language measures where possible:

- **Pass recall:** proportion of human-labelled Pass cases judged Pass;
- **Fail recall:** proportion of human-labelled Fail cases judged Fail;
- **Pass precision:** proportion of judged Pass cases that humans labelled Pass;
- **Fail precision:** proportion of judged Fail cases that humans labelled Fail;
- **Unknown agreement:** how often the evaluator correctly identifies insufficient evidence.

Also preserve the full confusion matrix.

A release gate concerned with missed failures may prioritise Fail recall. A monitoring system with limited review capacity may also care strongly about Fail precision.

### 14.4 Set thresholds from the decision


There is no universal evaluator-accuracy threshold.

The required reliability depends on:

- consequence of a missed failure;
- cost of a false alert;
- whether a human reviews the result;
- whether the evaluator is informational, a gate, or a runtime control;
- the expected input volume;
- and whether a deterministic control exists.

An evaluator that is useful for exploratory analysis may be unsuitable for a release gate.

### 14.5 Validate stochastic stability


For a model-based evaluator, one run may not establish stable judgement.

When relevant:

- repeat evaluations;
- preserve judge model and settings;
- measure disagreement across repetitions;
- define an aggregation rule; and
- include instability in the accepted limitations.

## 15. Apply evaluators and produce measurements


Applying an evaluator produces labels. Labels become measurements only when aggregated over a declared case set or sample.

```text
Evaluator
        ↓
Judgements for individual executions
        ↓
Labels
        ↓
Aggregation over declared set or sample
        ↓
Measurement
        ↓
Interpretation with evaluator and sample limits
        ↓
Scoped finding
```

### 15.1 Measurement requires sample semantics


Examples:

```text
Regression set:
3 of 120 cases failed the account-ambiguity criterion.

Challenge cohort:
12 of 30 deliberately difficult reference cases failed.

Production sample:
2.1% of sampled eligible traces were judged to contain
unsupported account resolution during the declared week.
```


These numbers answer different questions.

Do not treat a challenge-set rate as a production estimate.

### 15.2 Automatic output is not ground truth


A raw evaluator rate is an estimate mediated by evaluator error.

A trustworthy finding should state:

- the set or population;
- selection method;
- time window where applicable;
- evaluator and criterion versions;
- known evaluator reliability;
- missing and Unknown cases;
- confidence or uncertainty where applicable; and
- the decision the measurement informs.

### 15.3 Preserve product and apparatus failures separately


Do not count these as ordinary product failures:

- evaluator runtime failure;
- malformed trace;
- missing required evidence;
- fixture setup failure;
- SUT execution failure unrelated to the criterion;
- judge output that cannot be parsed.

They should be reported separately.

## 16. Estimate prevalence with an imperfect binary judge


A validated model-based evaluator may be used to estimate the prevalence of a behaviour over a larger unlabelled sample.

The raw judged rate may be biased because the evaluator makes mistakes.

Suppose:

- `Pass` is the positive label;
- `TPR` is the proportion of human Pass cases judged Pass;
- `TNR` is the proportion of human Fail cases judged Fail;
- `p_obs` is the proportion of new traces judged Pass.

A bias-corrected estimate of the human-equivalent Pass rate is:

\[

\hat{\theta}

=

\frac{p_{\text{obs}} + \mathrm{TNR} - 1}

     {\mathrm{TPR} + \mathrm{TNR} - 1}

\]

clipped to the interval \([0,1]\).

This correction is not usable when:

\[

\mathrm{TPR} + \mathrm{TNR} - 1

\]

is near zero, because the judge provides little information beyond chance.

### 16.1 Conditions for using the correction


The estimate assumes that:

- the held-out labels are trusted;
- TPR and TNR are estimated for the current criterion and judge version;
- evaluator behaviour transfers to the new sample;
- the new traces fall within the evaluator's validated scope;
- the production sample has a declared selection method; and
- missing evidence and evaluator errors are handled separately.

If production language or behaviour differs materially from the validation set, the correction may be misleading.

### 16.2 Quantify uncertainty


TPR and TNR are estimates. The corrected rate should therefore include uncertainty.

A bootstrap can resample held-out human-label and judge-prediction pairs, recompute TPR and TNR, and produce a distribution of corrected rates.

The resulting interval should be interpreted together with:

- held-out sample size;
- class balance;
- production-sample size;
- evaluator drift;
- and evidence missingness.

For consequential decisions, supplement automated estimates with ongoing human review of sampled traces.

### 16.3 Prefer direct human estimation when automation is weak


When evaluator reliability is low or unstable:

- do not hide that weakness behind a corrected point estimate;
- increase trusted labels;
- narrow or decompose the criterion;
- use a stronger judge where justified;
- improve the evidence supplied; or
- estimate prevalence through direct human sampling.

## 17. Place evaluators across offline and online planes


Evaluator type and execution plane are separate decisions.

### 17.1 Offline plane


Offline evaluators run on executions that cannot affect live users or live state.

Typical uses include:

- Discovery feasibility probes;
- prototype and candidate comparison;
- prompt, model, retrieval, or policy experiments;
- regression evaluation;
- replay of production traces;
- incident reproduction;
- evaluator calibration;
- CI checks; and
- release evidence.

Offline evaluation provides control and reproducibility. Its main limit is coverage.

### 17.2 Online asynchronous plane


Online asynchronous evaluators run alongside or after production execution.

Typical uses include:

- quality monitoring;
- failure prevalence estimation;
- drift detection;
- rollout comparison;
- incident discovery;
- selection of traces for human review;
- outcome linking;
- growth of labelled datasets; and
- discovery of new regression cases.

A common feedback path is:

```text
Production execution
        ↓
Asynchronous evaluator
        ↓
Flag or label
        ↓
Human review and Failure Understanding
        ↓
Confirmed or revised failure mode
        ↓
New criterion, case, or product change
        ↓
Offline regression protection
```


Online asynchronous evaluation is usually the preferred production placement for model-based judges because it does not add serving-path latency or create a new blocking dependency.

### 17.3 Online synchronous plane


Online synchronous checks run inside the live request or action path.

Typical uses include:

- schema validation;
- permission enforcement;
- deterministic policy checks;
- domain validation;
- confirmation boundaries;
- prohibited-action prevention;
- fallback selection; and
- controls required before an external effect.

These are often better described operationally as **runtime controls**.

For Wallet:

```text
Before persistence:
    account exists
    currency is valid
    draft is complete
    confirmation is current
    idempotency key is unused
```


When these checks fail, the system rejects, redirects, or requests correction.

A probabilistic judge should enter the synchronous path only when:

- the criterion cannot be enforced deterministically;
- the consequence justifies the added latency and dependency;
- judge reliability has been validated for that use;
- fail-open or fail-closed behaviour is explicit;
- fallback and escalation are defined; and
- production monitoring covers the judge itself.

### 17.4 Move evaluators through planes deliberately


A typical progression is:

```text
Human review
        ↓
Offline exploratory evaluator
        ↓
Offline validated evaluator
        ↓
Offline regression or release use
        ↓
Online asynchronous monitoring
        ↓
Possible warning or control use
```


Movement is not automatic. Each placement requires a decision based on risk, reliability, cost, and failure handling.

## 18. Integrate automated evidence with decisions


Evaluator evidence may influence operation at several levels.

```text
Informational result
    visible to the team; no automatic action

Warning
    requires review or explicit acceptance

Release gate
    blocks or holds a candidate under a declared rule

Rollout control
    pauses, narrows, or rolls back exposure

Runtime control
    prevents, redirects, or escalates a live action
```

### 18.1 Informational use


Suitable when:

- the criterion or evaluator is still developing;
- the result is exploratory;
- evaluator reliability is not strong enough for automation;
- or the product decision requires broader evidence.

### 18.2 Warning use


Suitable when:

- the signal is useful;
- false alerts are acceptable if reviewed;
- the criterion is stable;
- and an owner is responsible for review.

### 18.3 Release-gate use


A release gate should require:

- a clear committed product expectation;
- stable criterion;
- sufficient evidence;
- validated evaluator;
- explicit threshold or zero-tolerance rule;
- reproducible results;
- versioned provenance;
- exception handling;
- and a named decision owner.

Critical invariants and known regression cases are stronger gates than a noisy overall score.

### 18.4 Runtime-control use


Runtime controls require the strongest operational discipline.

Define:

- what is blocked or redirected;
- whether the control fails open or closed;
- latency and availability requirements;
- fallback behaviour;
- customer-visible handling;
- audit evidence;
- and incident ownership.

Use deterministic controls for exact and high-consequence boundaries whenever possible.

## 19. Feed findings into Discovery, Delivery, and evaluation


Automated evaluators create a scalable product-feedback mechanism.

Their outputs can change several persistent objects.

### 19.1 Product Discovery feedback


Automated findings may:

- support or weaken a behavioural hypothesis;
- confirm or localise a feasibility risk;
- expose a new safety hypothesis;
- narrow proposed production scope;
- compare solution candidates;
- challenge the assumed product behaviour; or
- show that residual uncertainty is too high for commitment.

Example:

> Unique account references pass consistently, while ambiguous references fail.

Discovery may narrow the first production slice to determinate references or revise the solution to include unresolved structured selection.

### 19.2 Product Delivery feedback


Automated findings may:

- identify a clear contract violation;
- define or verify a Delivery change hypothesis;
- detect a regression;
- hold a release;
- trigger rollout review or rollback;
- identify production drift; or
- add regression protection after an incident.

### 19.3 Quality Understanding feedback


Evaluator application may show that:

- the criterion is ambiguous;
- one failure mode contains materially different behaviours;
- the evaluator does not represent the intended boundary;
- new production behaviour does not fit the current model;
- a successful contrast is missing; or
- the labelled set no longer represents the active product.

These findings revise Quality Understanding.

### 19.4 Evidence Capability feedback


Evaluator application may show that:

- required trace fields are absent;
- evidence cannot be linked to outcomes;
- provenance is incomplete;
- online execution is unreliable;
- review is too slow;
- or evaluator cost prevents useful coverage.

These findings revise Evidence Capability.

### 19.5 One result may create several follow-ups


Example:

```text
Finding:
An ambiguous Visa reference was resolved to one account.
```


Possible effects:

```text
Discovery:
Reconsider the solution boundary for ambiguous references.

Delivery:
Prevent non-unique matches from populating account_id.

Quality Understanding:
Refine the ambiguous-reference criterion and add contrasts.

Coverage:
Add determinate, ambiguous, and unknown reference cases.

Evidence Capability:
Capture all candidate matches in the trace.
```


The automated label is one piece of evidence. The routed findings state what should be investigated or changed.

## 20. Maintain automated evaluators


Automated evaluators are maintained Quality Understanding and Evidence Capability assets.

They can degrade because:

- product expectations change;
- system behaviour changes;
- production inputs drift;
- a judge model changes;
- the labelled set becomes stale;
- trace structure changes;
- a criterion is refined;
- or new failure modes appear.

### 20.1 Version material dependencies


Record:

- product expectation or Production Slice Contract version;
- criterion version;
- evaluator implementation or prompt version;
- judge model and settings;
- reference and example-set versions;
- validation-set version;
- required trace schema; and
- accepted placement and decision use.

### 20.2 Revalidate after material change


Revalidation may be required after:

- criterion change;
- judge prompt or model change;
- trace-schema change;
- new production slice;
- material shift in production behaviour;
- unexplained evaluator drift;
- or change from informational use to a gate or control.

### 20.3 Continue human sampling


Even a validated online evaluator should be checked against fresh human-reviewed traces.

The cadence should reflect:

- product and model change rate;
- consequence of evaluator error;
- production volume;
- observed drift;
- and decision use.

A fast-changing system may require weekly review. A stable, low-volume system may use a slower or event-driven cadence.

### 20.4 Retire evaluators deliberately


Retire or replace an evaluator when:

- the product behaviour no longer applies;
- the criterion has been superseded;
- reliable evidence is no longer available;
- the evaluator cannot reach required reliability;
- a deterministic control replaces the need;
- or the measurement no longer informs a decision.

Preserve historical versions so previous release and production findings remain interpretable.

## 21. Running example: Wallet ambiguous account resolution

### 21.1 Product expectation


> When more than one active account matches the user's reference, Wallet must leave the account unresolved and must not claim that one account was selected.

### 21.2 Failure mode

```text
ambiguous account reference resolved without evidence
```

### 21.3 Operational criteria


Criterion A:

> When multiple active accounts match, `draft.account_id` remains unresolved.

Criterion B:

> The user-facing response communicates the ambiguity and does not imply a unique selection.

Criterion C:

> No transaction can be persisted while the material account field remains unresolved.

These are separate criteria.

### 21.4 Evaluators


**Criterion A -- code-based, reference-free**

```text
matching account count > 1
and draft.account_id is populated
→ Fail
```


**Criterion B -- model-based or carefully defined code/reference check**

```text
Judge whether the response clearly communicates multiple matches
and avoids implying that one account was selected.
```


**Criterion C -- deterministic runtime control**

```text
draft has unresolved material account
→ persistence rejected
```

### 21.5 Offline use


Run Criteria A and B against:

- determinate-reference baseline cases;
- ambiguous-reference challenge cases;
- unknown-reference cases;
- production replays;
- baseline and candidate interpreter versions.

Possible Delivery finding:

> Candidate `v18` eliminates unsupported account resolution in the declared ambiguous-reference cohort while preserving determinate resolution.

### 21.6 Online asynchronous use


Apply Criterion A to sampled production traces where the matching-account set is captured.

Use results to:

- estimate the prevalence of the known failure;
- compare rollout cohorts;
- detect regression;
- select traces for review;
- discover language forms missing from offline coverage.

Criterion B may also run asynchronously after it has been validated against trusted labels.

### 21.7 Online synchronous use


Criterion C belongs in the live path as a deterministic control.

Even if the interpreter or user-facing message fails, the unresolved material field cannot produce a ledger effect.

This contains the consequence while Delivery improves Criteria A and B.

### 21.8 Feedback to Product Discovery


Suppose production shows:

- ambiguity is handled according to the contract;
- users still abandon the workflow when asked to choose an account; and
- the one-shot interaction no longer reduces effort for these cases.

The automatic evaluators may pass while the product solution fails to create value.

That evidence should reopen Product Discovery.

## 22. Optional group-level evaluators


Some AI systems produce several outputs for one input.

Examples include:

- several code candidates;
- ranked retrieved documents;
- multiple tool plans;
- alternative recommendations.

In these cases, evaluation may apply to the group.

Useful measures include:

- **Success@k or Pass@k:** whether at least one of the top `k` outputs meets the criterion;
- **Precision@k:** the proportion of the top `k` outputs that are acceptable;
- **Recall@k:** the proportion of all relevant outputs represented in the top `k`;
- **semantic similarity:** how closely outputs match a reference meaning; and
- **diversity:** whether the outputs are materially different where variation is a product expectation.

Use a group-level metric only when it corresponds to a product decision.

For example, Pass@5 is useful when the user or system can choose among five candidates. It is misleading when only the first candidate is ever shown or executed.

## 23. Workflow summary

```text
Phase 1 — Select and define

Product expectation or failure mode
        ↓
Decision and intended use
        ↓
Operational criterion
        ↓
Required evidence
```

```text
Phase 2 — Implement

Choose code, reference,
model, human, or hybrid method
        ↓
Build evaluator
        ↓
Define Pass, Fail,
Not applicable, Unknown,
and evaluator error
```

```text
Phase 3 — Validate

Trusted labels
        ↓
Prompt-example / development / test split
        ↓
Development and disagreement analysis
        ↓
Held-out validation
        ↓
Accepted scope and reliability
```

```text
Phase 4 — Place and apply

Offline
or online asynchronous
or online synchronous
        ↓
Individual labels
        ↓
Measurements over declared sets or samples
        ↓
Scoped findings
```

```text
Phase 5 — Improve

Discovery implication
Delivery implication
Quality Understanding change
Evidence Capability change
        ↓
Revalidate and apply again
```

## 24. Design principles

### 24.1 Start from a decision and product expectation


Do not begin with a metric, judge prompt, or dashboard.

### 24.2 Operationalise before automating


A failure-mode name is not a criterion. Define applicability, evidence, Pass, Fail, and Unknown first.

### 24.3 Clarify ambiguous intent before measuring


Do not build an evaluator for a product expectation the team has not defined.

### 24.4 Prefer deterministic checks


Use code for exact fields, rules, state transitions, permissions, and external effects.

### 24.5 Use one narrow criterion per evaluator judgement


Narrow criteria are easier to validate, diagnose, and maintain.

### 24.6 Treat missing evidence as Unknown


An evaluator must not infer success from absent trace data.

### 24.7 Validate every evaluator


Code-based and model-based evaluators can both misrepresent the criterion.

### 24.8 Keep labelled data splits disjoint


Prompt examples, development data, and held-out test data serve different purposes.

### 24.9 Report both evaluator and product uncertainty


A product measurement inherits uncertainty from sample selection and evaluator error.

### 24.10 Separate method from placement


Code and model evaluators can run offline or online. Placement is an operational decision.

### 24.11 Use online synchronous judgement sparingly


Prefer deterministic runtime controls for blocking high-consequence actions.

### 24.12 Promote automation gradually


Move from informational use to warnings, gates, or controls only as criterion and evaluator reliability become sufficient.

### 24.13 Preserve traceability


Link product expectation, criterion, evaluator, evidence, label, measurement, finding, and decision.

### 24.14 Route findings to what must change


Product behaviour, product intent, Quality Understanding, and Evidence Capability require different actions.

### 24.15 Revalidate through use


Production drift, product changes, and judge changes can invalidate an evaluator.

### 24.16 Keep human judgement in the loop


Human review remains necessary for criterion formation, trusted labels, adjudication, novelty, and consequential decisions.

## 25. Summary


Automated evaluators make selected product-behaviour criteria repeatable at development and production scale.

They begin with a clear product expectation or evidence-linked failure mode. The team defines an operational criterion, identifies the required evidence, chooses the most deterministic suitable method, validates the evaluator against trusted judgement, and places it in an offline or online execution plane according to risk and operational needs.

Offline evaluators support Discovery probes, candidate comparison, regression evaluation, and release evidence. Online asynchronous evaluators support production monitoring, prevalence estimation, drift detection, and case discovery. Online synchronous checks should usually be deterministic runtime controls that protect critical boundaries.

Evaluator outputs become labels. Labels become measurements only over a declared case set or sample. Measurements become findings only when interpreted with the evaluator's reliability, evidence limits, and sample semantics. Findings then update Product Discovery, Product Delivery, Quality Understanding, or Evidence Capability.

The model can be summarised as:

> **Make the product criterion explicit, automate the narrowest reliable judgement, validate it against trusted evidence, place it according to consequence, and use its scoped findings to improve both the product and the evaluation system.**
