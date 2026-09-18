---
draft: false
toc: true
title: "30 Judgment And Findings"
linkTitle: "30 Judgment And Findings"
---
# Judgment and Findings

## Purpose


Evaluation uses captured evidence to state what it supports for a named question or decision, within stated limits.

That requires more than producing a score. The team must state the basis for judgment, check whether the evidence is sufficient, use a suitable judgment method, interpret results within their scope, and keep the finding separate from the product decision.

The main relationship is:

```text
Evaluation basis and decision context
        ↓
Criterion and required evidence
        ↓
Trace or other evidence tied to an execution
        ↓
Evaluator result and judgment
        ↓
Labels, measurements, and comparisons
        ↓
Scoped finding
        ↓
Decision or next action
```


This is not a set of sequential product phases. A discovery question may use a provisional criterion. Delivery and operation may use a stable criterion at the same time. A disagreement or new production case may cause any part of the evaluation to be revised.

The underlying evidence objects are defined in [Evidence Model for AI Evaluation]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}).

## Start with a basis for judgment


Exploratory review can begin before the team has a stable definition of acceptable behavior. It can record observations, unexpected behavior, possible failures, and open questions.

Before calling behavior acceptable or unacceptable, the evaluation needs an explicit basis. That basis may come from:

- a provisional behavior claim being examined in discovery;
- a proposed or active [production commitment]({{< ref "ai/operating-model/production-commitment" >}});
- a product rule or invariant;
- a safety, privacy, security, or policy requirement;
- a case-specific expectation;
- an approved baseline or comparison standard;
- domain judgment made explicit for the evaluation.

If the sources conflict or leave important behavior undefined, record the conflict. Evaluation should not hide it by inventing a rule.

## Criterion


A **criterion** states how one aspect of behavior will be judged.

A useful criterion states:

- the behavior it concerns;
- the situations in which it applies;
- what counts as acceptable or unacceptable;
- which evidence is required;
- how missing or ambiguous evidence is handled;
- any exceptions or boundaries.

For example:

```text
Criterion:
For a supported write action that requires confirmation,
the trace must show participant-visible confirmation
before the action is submitted to the write tool.
```


This is more useful than "safe tool use." It identifies the behavior, scope, required evidence, and point of judgment.

A criterion does not need to prescribe one exact output. Many AI tasks allow several acceptable responses or actions. Judge the behavior that matters rather than similar wording or formatting when exact wording is not part of the claim.

Keep separate criteria separate when they protect different things. Correctness, completeness, handling of uncertainty, safety, latency, cost, and recoverability should not be hidden inside one general quality score.

## Check whether a judgment is possible before judging correctness


Before applying a criterion, ask two questions:

1. Does the criterion apply to this judgment unit?
2. Does the available evidence support a judgment?

Only then ask whether the behavior met the criterion.

```text
Does the criterion apply to the unit?
    ├── no  → NOT APPLICABLE
    └── yes
          ↓
Is the evidence sufficient?
    ├── no  → NOT JUDGEABLE
    └── yes
          ↓
Did the behavior meet the criterion?
    ├── yes → PASS
    └── no  → FAIL
```


`NOT APPLICABLE` means the criterion does not concern this judgment unit.

`NOT JUDGEABLE` means the criterion applies but the available evidence cannot support the judgment. It must not be counted as a pass.

For an operational failure mode, the final judgment uses **PRESENT** or **ABSENT** instead of **FAIL** or **PASS**. When the same boundary is also written as a positive criterion, **FAIL** maps to failure **PRESENT** and **PASS** maps to failure **ABSENT**. Keep this mapping explicit.

Some systems use `UNKNOWN` instead of `NOT JUDGEABLE`. If both are used, define the difference. Do not let two labels silently mean the same thing.

Mechanical execution failure and evaluation failure are also separate. A timed-out execution may itself violate a reliability criterion, or it may simply fail to produce evidence for another criterion.

## Judgment methods


Use the simplest method that can support the criterion with enough reliability for the decision.

### Deterministic checks


Use code when the criterion can be expressed as a stable rule. Examples include:

- schema and field validation;
- permissions and allowed actions;
- tool arguments and state transitions;
- duplicate writes;
- required confirmations;
- latency or cost limits.

A deterministic check is only as strong as the rule and evidence behind it. Valid JSON does not show that an answer is useful. A successful tool call does not show that the user intended the action.

### Reference-based judgment


Use a trusted reference when meaningful acceptable results can be stated in advance. Examples include known calculations, expected structured values, or a verified set of relevant records.

Do not require exact agreement when the task permits several correct answers. The comparison rule should reflect the actual behavior claim.

### Model-based evaluation


A model evaluator can apply semantic or contextual criteria to more cases than human review can cover.

It may help judge grounding, instruction following, task completion, or other behavior that code cannot express. Its result remains a model judgment, not objective truth.

Model evaluators can be sensitive to wording, evidence order, irrelevant context, model changes, and their own knowledge gaps. They require validation within the scope in which they will be used.

### Human and domain judgment


Use human review when:

- the criterion is new or changing;
- behavior is ambiguous or not represented by current categories;
- domain knowledge is required;
- evaluators disagree;
- the consequence of an incorrect judgment is high;
- the team is building trusted examples for later automation.

Human judgment also needs a clear criterion, supporting evidence, and a way to handle disagreement. Human review is not automatically consistent because a person performed it.

### Combined judgment


One execution may use several methods. Code may check permissions and state changes, a model evaluator may judge whether an explanation is grounded, and a domain expert may review a disputed case.

The methods should remain visible. Do not collapse them into a score that hides which requirement failed or which method supplied the judgment.

## Evaluator


An **evaluator** is the person, procedure, or tool that applies a criterion to evidence.

The criterion describes what should be judged. The evaluator describes how the judgment is made.

Record at least:

- the criterion and its version;
- the evidence given to the evaluator;
- the evaluator type and version;
- the result and any explanation or cited evidence;
- execution settings that can change the result;
- the time of evaluation.

Do not treat an evaluator as valid for behavior, situations, or evidence outside the scope in which it was checked.

## Validate evaluators


Evaluator validation asks whether the evaluator applies its criterion reliably enough for its intended use.

Build a validation set with trusted judgments that represents:

- clear passes and failures;
- boundary and ambiguous cases;
- important situations and groups;
- known evaluator mistakes;
- cases where evidence is insufficient;
- high-consequence failures when relevant.

Trusted judgments may require more than one reviewer, domain expertise, and a process for resolving disagreements. Keep disagreements visible. They may expose an unclear criterion rather than reviewer error.

Check properties that matter for the intended use, such as:

- false passes and false failures;
- disagreement by situation or failure type;
- stability across repeated runs;
- sensitivity to irrelevant wording or ordering;
- behavior when required evidence is missing;
- changes after an evaluator, model, prompt, or rubric update.

Use separate examples for tuning and final validation when the consequence justifies it. Otherwise, repeated adjustment against the same cases can make the evaluator appear more reliable than it is.

There is no universal acceptable evaluator score. The required reliability depends on the consequence of an incorrect judgment. An evaluator used for exploration may tolerate more error than one used to block a release or live action.

Continue to compare automated judgments with trusted human review after deployment. New behavior and changing inputs can invalidate earlier validation.

## Raw results, labels, and disagreement


A raw evaluator result is the direct output of one evaluator run. A **label** is a recorded judgment or evaluator result for a stated unit and criterion, linked to the operational mode when applicable. It also records its evidence source, provenance, and review status.

A label is **adjudicated** when a review has resolved a disagreement and accepted the result.

Keep the distinction because:

- several evaluators may judge the same execution;
- repeated model evaluations may disagree;
- a human review may correct an automated result;
- adjudication may produce an accepted label;
- the criterion may later change and require relabeling.

A useful label record includes:

```text
Execution and trace:

Judgment unit type and identifier or trace location:

Operational mode and version, when applicable:

Criterion and version:

Evaluator and version:

Result:

Evidence cited:

Explanation or review note:

Label provenance: reference | evaluator-produced

Label status: raw | reviewed | adjudicated
```


Do not erase disagreement by retaining only the accepted label. The disagreement is evidence about the criterion, evaluator, or case.

When a criterion changes materially, old and new labels are not automatically comparable. Relabel affected evidence or state the break in comparability.

## Measurements


A **measurement** summarizes observations or labels over a defined set or sample.

Every measurement should state:

- the cases or production population represented;
- how cases or executions were selected;
- the system and evaluation versions;
- the unit being counted;
- the denominator;
- how repeated executions are handled;
- how `NOT APPLICABLE` and `NOT JUDGEABLE` are handled;
- any weighting;
- important uncertainty and missing evidence.

For example, "92% passed" is incomplete without saying what passed, across which cases, under which criterion and versions, and what happened to unjudged executions.

The meaning of a measurement depends on the set or sample:

| Evidence source | What it can support |
| --- | --- |
| Coverage or challenge set | Behavior in the deliberately represented situations |
| Regression set | Whether known behavior remained protected |
| Candidate comparison set | A comparison under the stated controlled conditions |
| Representative production sample | An estimate for the sampled production population and period |
| Sample of high-risk or unusual cases | Discovery of important or new behavior, not a traffic-wide rate |
| Evaluator validation set | Evidence about evaluator reliability in its stated scope |

Do not interpret a challenge-set rate as an estimate of normal production quality. Do not interpret a regression set as a balanced account of the whole product.

## Important differences within the results


An average can hide a serious failure in a small but important part of the supported scope.

Show results for relevant situations, such as:

- user job or workflow;
- input or interaction type;
- permission or system state;
- critical or high-consequence behavior;
- tool or route;
- product, model, or configuration version;
- user or affected group when the distinction is relevant and appropriate.

Choose the groups to compare from the behavior claim, production commitment, risk, and evaluation question. Do not create many groups only because the data allows it.

A small slice may not support a stable rate, but its concrete failures may still matter. State the evidence rather than hiding it in the overall average.

## Comparisons


A **comparison** asks how behavior differs between candidates, versions, groups, or periods.

For a useful comparison:

- name the question and baseline;
- keep cases, fixtures, criteria, and evaluation methods comparable;
- record every system and evaluation version that can affect the result;
- use repeated runs when behavior varies enough to matter;
- inspect important slices and concrete failures;
- report improvements, regressions, and tradeoffs;
- state where conditions were not comparable.

A candidate may improve one criterion while weakening another. Do not force the tradeoff into one number unless an approved decision rule gives the combination a clear meaning.

State only the conclusion the evidence supports. For example:

> No regression was observed for the committed confirmation behavior in this regression set under the tested configurations.

This does not mean that the candidate is universally safe or ready for every situation.

## Findings


A **finding** interprets evidence for the named evaluation question. It is more than a measurement and less than a product decision.

A useful finding states:

- the question and behavior claim;
- the cases or production sample examined;
- the product, system, and evaluation versions;
- the main results;
- important successes, failures, and variation;
- evaluator reliability and disagreement that affect interpretation;
- evidence and coverage limits;
- remaining uncertainty;
- what the evidence supports or weakens.

For example:

> In the 48 evaluated cases that require confirmation before a supported write, candidate B passed 47 and failed one. Candidate A passed 42. The failure in candidate B occurred when confirmation was given in an earlier turn. The set covers the known confirmation paths but does not represent live traffic frequency. This supports continuing with candidate B while fixing and rerunning the earlier-turn case. It does not yet support wider autonomous writes.

The finding preserves concrete detail and limits. It does not claim that candidate B is simply "better" in every respect.

## A finding does not establish a cause


An evaluation can show that behavior failed and where the evidence first showed the failure. It does not necessarily show why.

Do not turn sequence or correlation into a root-cause claim. Diagnosis may require additional traces, reproduction, component tests, implementation inspection, or a separate experiment.

## Decision rules


A **decision rule** is an approved rule stating how a result affects operation or delivery.

Common levels are:

```text
Informational result
    → available for interpretation

Warning or review rule
    → requires review or an explicit exception

Release gate
    → blocks or pauses a release under stated conditions

Runtime control
    → prevents, redirects, limits, or escalates a live action
```


Use stronger automation only when:

- the protected behavior and scope are explicit;
- the criterion is stable;
- the required evidence is available;
- evaluator errors are understood and acceptable for the consequence;
- the threshold and exceptions are approved;
- ownership, review, recovery, and the way overrides work are clear.

A runtime permission check or safety control is not necessarily an evaluation. It enforces a product rule. Evaluation may be used to verify that the control works or to support the decision to use it.

A decision rule applies a prior product decision. It does not transfer ownership of product intent, accepted risk, or release responsibility to the evaluator.

## Route findings by what must change


A failed judgment does not always mean that the model or implementation should be changed.

| What the finding challenges | Main response |
| --- | --- |
| Clearly committed behavior is not provided | Change delivery work, limit exposure, or narrow the production commitment |
| The product behaves as intended, but users cannot complete the work | Reopen discovery and reconsider the usability assumption or interaction design |
| Users can complete the work, but do not choose or continue using the product | Reopen discovery and reconsider the value assumption and alternatives |
| People use the product, but the target user or operating condition does not change | Reopen discovery and reconsider the solution or intended behavior |
| The target condition changes but the wider result does not | Reconsider the expected causal link or product strategy |
| The behavior does not fit the current criterion or category | Revise the evaluation definition and review affected labels |
| An evaluator disagrees with trusted judgment | Revise the criterion, evaluator, evidence, or review process |
| Required evidence was not captured | Improve evidence capture, storage, or access |
| The sample does not support the desired conclusion | Change the sample or narrow the finding |

Several responses may be needed at once. A trace can expose a product failure, an unclear criterion, and missing evidence.

## Keep findings and decisions separate


The evaluation finding states what the evidence supports and where it is limited.

The people responsible for the product decide whether to continue, change the solution or implementation, collect more evidence, narrow scope, release, roll back, or stop.

That decision may use evaluation findings together with customer research, usability evidence, engineering judgment, safety review, business analysis, and outcome evidence.

## Minimum judgment record


Use only the fields needed for the question and consequence.

```text
Decision or uncertainty:

Assumption or obligation being examined, and consequence if false:

Evaluation basis and version:

Criterion and scope:

Evidence required:

Cases or production sample:

System and evaluation versions:

Judgment method and evaluator:

Judgeability and missing evidence:

Labels and measurements:

Important variation and concrete failures:

Comparison, if any:

Evaluator limits and disagreement:

Finding:

Remaining uncertainty:

Decision rule, if any:

Decision taken and owner:
```

## Boundaries


Judgment and findings do not provide:

- proof of correct behavior in every possible situation;
- one universal score for product quality;
- proof that product behavior caused a user or business outcome;
- a substitute for safety, security, privacy, usability, or operational work;
- a root-cause diagnosis from behavioral evidence alone;
- authority for the evaluation subsystem to choose product goals or accept product risk.

The result is a claim limited to the stated evidence. It should say what the evidence supports and what it does not support.
