---
draft: false
toc: true
title: "Ai Evaluation Goals"
linkTitle: "Ai Evaluation Goals"
---
# Goals of AI Evaluation

## Purpose


> **Evaluation shows us how the product actually behaves in defined situations, so we can make better product decisions.**

We cannot know how an AI product will behave from its specification or implementation alone. Behavior can change with the input, product state, model, prompt, tools, data, and operating conditions. Live use also reveals situations that pre-release work does not cover.

Seeing what happened once is not enough on its own. It becomes part of an evaluation when the team uses it to answer a named question. The team can explore before it has a stable behavior claim or criterion, but it needs a clear rule or expectation before calling behavior acceptable. A number or score also needs an explanation before it can help with a decision.

When an evaluation looks at expected behavior, that expectation may still change during discovery. After a production commitment, it should come from the behavior, scope, and conditions for which the team has accepted responsibility.

The claim is about product behavior. The team may observe a prototype, a candidate system, or a live system. The implementation may change while the claim stays the same.

Every finding only applies to the cases or sample, environment, system version, recorded information, criteria, and evaluation method behind it. Evaluation helps the team learn, but it does not prove that a product will behave correctly in every situation.

The wider decision logic is described in the [operating model]({{< ref "ai/operating-model/operating-model" >}}).

## Evaluation framework and evaluation subsystem


The evaluation framework and the evaluation subsystem have different roles.

| Part | Role | Main question |
| --- | --- | --- |
| **Evaluation framework** | Connects the question, behavior claim, recorded information, judgment, finding, and what is still unknown | What should be examined, what should be recorded, and how will the result help with the decision? |
| **Evaluation subsystem** | Uses people, cases, data, tools, and recurring practices to produce and maintain that evidence | What behavior was captured, how does it compare with the evaluation basis, and how does it vary across situations and versions? |

The framework without the subsystem remains a set of principles. The subsystem without the framework can produce scores and reports that have no clear meaning for a product decision.

The product team remains responsible for product intent. Domain experts may help make that intent explicit and judge the observed behavior. Evaluation may expose missing or conflicting intent, but it should not silently invent the behavior the product ought to provide.

## Goals of the evaluation framework


The main goal of the evaluation framework is:

> **Connect the question, the behavior to examine, what the team needs to record, how it will judge the result, and the decision the result will support.**

### Start with a named question and decision


State what the team needs to learn and the decision it may influence. Examples include:

- whether to continue investigating a candidate solution;
- whether the evidence supports a production commitment with clear limits;
- whether a candidate change is suitable for release;
- whether rollout should expand, pause, narrow, or stop;
- whether a production finding should reopen discovery.

Evidence is useful when it can change what the team understands or what happens next. Running an evaluation only because a test suite exists is not a good enough reason.

When the question concerns an uncertain assumption or a production obligation, state what must be true and what would happen if it were false. For a routine regression check, link to the commitment or case that already records this information.

### State a clear, limited behavior claim when judgment requires one


Exploratory evaluation may begin with a question and develop a behavior claim or criterion from what the team sees. Before using the result to call behavior acceptable or support a commitment, the team must state the relevant claim clearly.

Describe:

- the users or systems concerned;
- the situations in which the claim applies;
- the behavior expected in those situations;
- the supported and unsupported scope;
- important failure behavior;
- safety, privacy, security, quality, reliability, cost, and operating conditions that matter.

Avoid a general claim that the AI should show "good behavior." State what the product should do, for whom, and under which conditions.

Record where the claim came from and whether it is still open to change. Also record what the team will use as the basis for judgment:

| Evaluation basis | Meaning |
| --- | --- |
| Provisional claim | Proposed behavior being examined and still open to revision |
| Proposed production commitment | A draft decision about the behavior, limits, conditions, operation, and unknowns for which the team may accept responsibility |
| Active production commitment | A decision that states what users may rely on and what the team has accepted responsibility for |

A production commitment is not a state of a behavior claim. It includes the behavior promise, but also the limits, required conditions, operating duties, important remaining assumptions, and known gaps the team accepts.

### Choose evidence that fits the question and evaluation basis


The framework should identify:

- the cases or production sample needed;
- the relevant variation and important situations or groups;
- the baseline or alternative, when comparison is needed;
- the observations that must be captured;
- the criteria used to judge the behavior;
- the suitable judgment method;
- the evidence that will still be missing.

The method must fit the question. Results from a fixed regression set or a difficult challenge set show what happened in selected test conditions. Results from a production sample show what happened only for the live runs, users, and time period included in it.

### Decide how results will be used


Before seeing the result, state what evidence would support:

- continuing;
- changing the solution or implementation;
- narrowing the supported scope;
- delaying or stopping a commitment;
- collecting more evidence.

Require stronger evidence when failure could cause more harm, the decision is costly or difficult to reverse, exposure is wider, or failure is difficult to detect.

### Keep different claims separate


The framework must distinguish five questions:

1. Does the product behave as currently claimed or intended?
2. Can the intended users understand it and complete the relevant work?
3. Do people choose, adopt, and continue using it instead of the available alternatives?
4. Does its use change the user or operating condition it was meant to change?
5. Does that change produce the wider result that was expected?

Evidence for one question does not answer the others. A strong behavior score does not prove that people can use the product, choose it, gain the intended benefit, or produce a wider result. A positive outcome does not prove that every part of the product behaved as intended.

The evaluation subsystem mainly provides evidence for the first question. It may preserve links to usability, adoption, changes in user or operating conditions, and wider-result evidence, but it should not combine all five questions into one score.

The framework must also keep utility, coverage, required safety conditions, and production readiness separate. Wide coverage does not compensate for weak behavior. Useful behavior does not establish that a system is safe or ready to operate.

### State limits and what remains unknown


A finding should state:

- which situations were and were not represented;
- whether the sample supports the conclusion being made;
- whether the required behavior was observable;
- what evidence was missing;
- the limits and reliability of the evaluator;
- what remains unknown after the evaluation.

Missing evidence must not be treated as successful behavior.

### Keep findings and decisions separate


An evaluation finding explains what the evidence supports and where it is limited. The people responsible for the product decision use that finding with other evidence and judgment to make the decision.

An approved decision rule may make a check informational, produce a warning, block a release, or control a live action. Automation is appropriate only when the claim, evidence, evaluator, and rule are stable enough for the consequence.

## Goals of the evaluation subsystem


The main goal of the evaluation subsystem is:

> **Show how the product actually behaves in defined situations in time to help with the current decision, and save what the team learns for later evaluations.**

The subsystem is not only software. It includes evaluation cases, production samples, traces, criteria, evaluators, data, review work, versioning, and operating routines.

### Obtain relevant observations


A production sample is a selected group of live runs from a stated group over a stated time period.

The subsystem should:

- run selected cases before release;
- sample selected executions from live use;
- include normal, boundary, difficult, critical, and known regression situations where relevant;
- compare candidates or versions under suitable conditions;
- capture new production behavior that existing cases do not represent.

The aim is not to cover every possible input. It is to include the situations needed for the current question, basis for judgment, and decision.

### Preserve the context needed to inspect the evidence


Preserve enough context to understand the evidence and identify the execution that produced it. This may include:

- input and initial state;
- product, system, model, prompt, tool, and configuration versions;
- retrieved context and external results;
- intermediate actions and state changes;
- final output or action;
- downstream result, when available;
- source, time, and sampling method.

An execution is one time the product runs. A trace is the information recorded about that run. It may not include everything that happened. The subsystem should show what is missing rather than fill the gap with an assumption.

### Judge behavior consistently


A criterion is a rule used to judge one part of the behavior. Use the simplest method that can apply that rule well enough for the current decision:

- code checks for rules, schemas, permissions, conditions that must always hold, and state changes;
- trusted references when a comparison is meaningful;
- model-based evaluators for suitable judgments about meaning or context;
- human or domain review for unclear, new, disputed, or high-impact cases.

The subsystem should preserve the criterion and evidence behind each judgment. It should also check evaluator reliability, record disagreement, and record no judgment when there is not enough evidence.

### Produce findings, not only scores


The subsystem should show:

- concrete successes and failures;
- failure categories and recurring patterns;
- variation across important situations and groups;
- coverage gaps;
- comparison with a baseline or alternative;
- regressions between versions;
- evaluator and sample limits;
- what remains unknown.

An average score can hide a serious failure in a small but important part of the supported scope. Findings should retain the detail needed for the decision.

### Reuse what has been learned


The subsystem should maintain reusable:

- cases and production samples;
- examples and trusted labels;
- behavior and failure categories;
- criteria and evaluators;
- baselines and comparisons;
- regression checks;
- findings and approved decision rules.

When a production failure matters and similar judgments will be needed later, preserve it as a case, criterion, or example. Revise or remove this material when the product, users, or operating conditions change.

### Keep the evidence path reliable


The subsystem should detect and correct:

- missing or incomplete traces;
- broken evidence capture;
- outdated samples or samples that no longer match the users and situations being studied;
- unclear or overlapping criteria;
- unstable or drifting evaluators;
- missing version and source information;
- failures in evaluation execution, storage, or review;
- evaluation work that is too slow or costly for the decision it supports.

The subsystem must maintain both the knowledge used to judge behavior and the means used to produce evidence. Neither is fixed. Claims, cases, categories, criteria, evaluators, samples, evidence-capture methods, and review practices may all need to change when new evidence appears.

## Decisions supported across discovery and delivery


Discovery and delivery describe the main purpose of work, not consecutive phases. Evaluation can support both at the same time.

| Decision context | Main question | How evaluation contributes |
| --- | --- | --- |
| Discovery | Can the proposed behavior work in relevant situations, and where does it fail? | Makes provisional claims concrete, compares candidate solutions, tests assumptions, and exposes boundaries and failure modes |
| Production commitment | Is the evidence strong enough for the behavior and responsibility being accepted? | Shows observed behavior, known limits, important failures, and what will remain unknown |
| Delivery | Does the candidate provide or improve the committed behavior without breaking other commitments? | Compares with a baseline, checks required conditions, detects regressions, and provides release evidence |
| Operation | Does live behavior remain within the commitment, and what new evidence changes the next decision? | Finds new situations and failures, detects change over time, and supplies evidence for rollout, rollback, delivery work, or renewed discovery |

Evaluation is only one source of discovery evidence. It cannot by itself establish that users have the problem, prefer the solution, can use it, or obtain enough value from it. Those claims need customer research, usability testing, product analytics, and evidence about outcomes.

Considering a production commitment requires evidence appropriate to the responsibility being accepted. Making the commitment creates new obligations. It does not end discovery or begin delivery as a separate phase.

## Where findings go


A mismatch does not always mean that the model or implementation should be changed.

| Finding | Main destination |
| --- | --- |
| The product does not provide clearly committed behavior | Delivery or a narrower production commitment |
| The product behaves as intended, but intended users cannot complete the work | Discovery revisits the usability assumption and interaction design |
| Users can complete the work, but do not choose or continue using the product | Discovery revisits the value assumption and alternatives |
| People use the product, but the user or operating condition does not change | Discovery revisits the solution hypothesis or intended behavior |
| The target condition changes, but the wider result does not | Product strategy or the assumed causal link is reconsidered |
| The behavior does not fit the current categories or criteria | The categories or criteria are revised |
| An evaluator disagrees with trusted human judgment | The criterion, evaluator, labels, or review process is revised |
| Evidence needed for judgment was not captured | Evidence capture is improved |

An evaluation finding states what the evidence supports. A finding about a mismatch does not establish the root cause by itself.

## Boundaries


AI evaluation is not:

- proof of universal product quality or safety;
- one score for the whole product;
- only a pre-release test suite or release gate;
- attached only to a feature, model, prompt, or implementation;
- authority to choose product goals, define product intent, or make product decisions;
- a replacement for customer research, usability work, business analysis, engineering, safety, security, or operations;
- proof that product behavior caused a user or business outcome;
- exhaustive coverage of every possible situation;
- evidence collection without a named question or decision.

Evaluation examines product behavior in stated situations and conditions. The implementation may change while the behavior covered by a [production commitment]({{< ref "ai/operating-model/production-commitment" >}}) stays the same. Evidence from live use may also show that the intended behavior was wrong. In that case, the finding returns to discovery.

## Minimal evaluation record


Use only the fields needed for the decision.

```text
Decision or question:

Assumption or obligation being examined, and consequence if false:

Source and status of the behavior claim:

Proposed or active production commitment and version, if relevant:

Users, situations, and supported scope:

Expected behavior and important failures:

Evidence source, cases, or sample:

System and evaluation versions:

Criteria and judgment method:

Results and important variation:

Evidence limits and what remains unknown:

Finding:

Decision taken:

Follow-up destination:
```
