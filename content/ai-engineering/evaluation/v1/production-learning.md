---
draft: false
toc: true
title: "Production Learning"
linkTitle: "Production Learning"
---
## Purpose


Production use provides evidence that cannot be fully obtained from prototypes, designed cases, or pre-release tests. It exposes real inputs, product state, dependencies, costs, user responses, rare situations, and failures under operating conditions.

Production evidence supports both discovery and delivery:

- delivery uses it to keep committed behavior dependable;
- discovery uses it to reconsider the solution, intended behavior, and assumptions about outcomes.

Release is not the end of evaluation. Real use adds evidence that can change what the team understands. The production commitment changes the obligations attached to the solution.

## Start from the production commitment


The [production commitment]({{< ref "ai/operating-model/production-commitment" >}}) states:

- the users and situations supported;
- the behavior users can rely on;
- the unsupported scope;
- important failure behavior;
- required safety, privacy, security, quality, reliability, and operating conditions;
- how failures will be detected and exposure controlled;
- what uncertainty remains.

Production evaluation should compare observed behavior with this bounded promise. It should also look for situations that show the promise is incomplete, unclear, or wrong.

## Keep five questions separate


Production evidence may address five different questions:

1. **Behavior:** Does the product behave as claimed within the supported scope?
2. **Ability to complete the work:** Can the intended users understand the product and complete the relevant work?
3. **Choice and continued use:** Do people choose, adopt, and continue using it instead of the available alternatives?
4. **Target condition:** Does its use change the user or operating condition the solution was meant to change?
5. **Wider result:** Does that change produce the broader result that was expected?

These questions require different evidence and point to different follow-up work.

```text
Behavior does not match the commitment
    → investigate the implementation, operation,
      or scope of the commitment

Behavior matches the commitment,
but intended users cannot complete the work
    → revisit the usability assumption or interaction design

Users can complete the work,
but do not choose or continue using the product
    → revisit the value assumption and alternatives

People use the product,
but the target condition does not change
    → revisit the solution or its link to the target condition

The target condition changes,
but the wider result does not
    → revisit the assumed causal link or strategy
```


Do not combine the five into one success score. Strong behavior evaluation does not prove usability, adoption, user benefit, or business impact. A positive outcome also does not show that every behavior and operating obligation was met.

## Decide what production evidence is for


Production data is not automatically useful evidence. State the question and how the sample will be used.

Common purposes include:

- checking a production commitment;
- watching a limited rollout;
- finding previously unrepresented behavior;
- estimating how often a known failure occurs in a stated population;
- detecting changes in inputs, context, cost, latency, or behavior;
- investigating an incident or user complaint;
- comparing a candidate with the current version;
- examining whether product behavior is related to a target outcome;
- finding cases that should enter offline evaluation.

Each purpose may need a different sample, time window, evidence, and judgment method.

## Sample production use deliberately


A production sample should state:

- the population from which it was drawn;
- the time period;
- inclusion and exclusion rules;
- the sampling method;
- relevant user, task, workflow, or risk groups;
- the product and system versions involved;
- whether exposure differed across users;
- known missing or low-quality data.

Several sampling approaches may be useful:

- random samples for estimates about a stated production population;
- stratified samples for important groups or situations;
- risk-weighted samples for severe or consequential behavior;
- event-triggered samples for incidents, fallbacks, corrections, or unusual actions;
- targeted samples for a new capability or rollout;
- samples of inputs unlike those in the current evaluation set.

A risk-weighted or incident sample should not be reported as the general production failure rate. A random sample can estimate frequency but may contain too few rare critical cases to examine them well.

## Preserve the evidence behind production behavior


Production review may require more than the final response. Depending on the question, preserve:

- input and relevant product state;
- system, model, prompt, tool, and policy versions;
- retrieved context and external results;
- intermediate actions and state changes;
- final output or action;
- user correction, rejection, confirmation, or abandonment;
- operational signals such as latency, cost, retries, and fallbacks;
- downstream product outcomes;
- rollout group and exposure conditions.

The evidence path should make it possible to connect a finding to its supporting trace and the execution that produced that trace. Missing evidence should remain visible.

## Detect change without calling every change drift


Production behavior may change because:

- user inputs or usage patterns changed;
- the product reached a new group or situation;
- product state or external data changed;
- a model, prompt, tool, policy, or dependency changed;
- the same system produced variable behavior;
- the evidence-capture process or an evaluator changed;
- the production commitment changed.

First describe what changed in the evidence. Then investigate the reason. A change in a metric does not by itself establish model drift or a root cause.

## Reuse production evidence in later evaluations


Selected production evidence should improve later evaluation.

```text
Production execution or incident
        ↓
Review the captured evidence
        ↓
Describe the observed behavior
        ↓
Decide whether it is useful to retain
        ↓
Add or revise a case, example, category,
criterion, evaluator, or production sample
        ↓
Use it in later comparison or monitoring
```


Not every production trace belongs in a regression set. Retain a case when repeating it will help protect a commitment, examine an important risk, represent an important situation, or test a likely recurrence.

Production evidence may also show that an existing case or criterion no longer represents what matters. Reuse should therefore include removing or revising outdated cases, criteria, evaluators, or samples.

## Route findings by what must change


| Finding | Likely follow-up |
| --- | --- |
| Clear committed behavior is not provided | Delivery investigation, rollback, or narrower exposure |
| Failure reveals that the supported scope is unsafe or unclear | Reconsider the production commitment |
| Behavior works as intended, but users cannot complete the work | Discovery revisits the usability assumption and interaction design |
| Users can complete the work, but do not choose or continue using the product | Discovery revisits the value assumption and alternatives |
| People use the product, but the target condition does not change | Discovery revisits the solution or its link to the target condition |
| The intended behavior causes an unwanted effect | Discovery revisits the intent and solution |
| A new pattern is not covered by existing cases or criteria | Update evaluation cases, categories, or criteria |
| The evaluator disagrees with trusted review | Revise or replace the evaluator |
| Evidence needed for judgment was not captured | Improve evidence capture or sampling |
| The target condition changes but the wider result does not | Reconsider the causal or strategic assumption |

A finding may affect more than one area. For example, a severe failure may require an immediate delivery response and a later discovery decision about whether the solution remains acceptable.

## Change the commitment when evidence changes


An active production commitment may be expanded, narrowed, or withdrawn.

Expansion needs evidence for the additional users, situations, behavior, and operating conditions. Narrowing should state what is no longer supported. Withdrawal should include the steps required to stop exposure and support affected users or systems.

Changing an implementation does not always change the commitment. Changing what users can rely on does.

## Production evaluation is not enough by itself


Production evidence can still mislead when:

- evidence capture is incomplete;
- the observed population is unrepresentative;
- the evaluation criterion is weak;
- users avoid situations where the product fails;
- feedback is available only from a small group;
- a downstream result has several possible causes;
- failures are difficult to detect;
- important harm appears outside the direct user interaction.

Production evaluation should therefore remain connected to customer research, product analytics, incident review, engineering investigation, safety and security work, and business evidence. It is one source of evidence for later product decisions.
