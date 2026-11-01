---
draft: false
toc: true
title: "Focused checks for AI product behavior"
aliases:
  - "/ai-engineering/causal-stack/layer-2/evaluation-method-reference/"
  - "/ai-engineering/evaluation/causal-stack/layer-2/evaluation-method-reference/"
description: "Focused checks turn a product question into cases, a judgment rule, and an interpretable comparison. Recipes cover evidence use, variation, exact meaning, tool effects, fallback, and continued customer outcomes."
linkTitle: "Focused checks for AI product behavior"
---

Choose a check from a [case]({{< ref "ai-engineering/causal-stack/cases" >}}) or a [claim]({{< ref "ai-engineering/causal-stack/claims" >}}). State the decision it informs. A method name such as "grounding evaluation" is incomplete until the inputs, expected behavior, judgment rule, and recorded result are specified.

The examples below are proposed procedures, not reports of completed experiments.

## Common setup


Save enough of the input, source material, configuration, and state to interpret the result. Define acceptable behavior before looking at the candidate output. Record failures and cases that cannot be judged.

For comparisons, use the same tasks across variants when appropriate, hold other conditions fixed, and randomize execution order. Record provider or environment changes that cannot be controlled. Reset mutable state between independent runs. Compare fresh cases as well as development cases.

This adapts the principle of comparing treatments within controlled groups described in [NIST's randomized block designs](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm). The unit of analysis still matters: repeated outputs for one task are not independent customers.

## Establish a usable judgment rule


**Use when:** reviewers disagree about acceptable behavior, or an automated score is being introduced.

Have the responsible users or domain reviewers independently judge a small set of actual outputs, including failures and borderline cases. Discuss disagreements and write the decision rule with examples. "Cannot judge from the available evidence" is a valid outcome.

If automating, compare the evaluator with those judgments on separate examples. Inspect false acceptances and false rejections. Record evaluator versions and material disagreements. An evaluator that merely agrees with itself does not establish correctness.

**Decision:** whether the judgment is clear enough for the proposed comparison, and which parts still require human review.

## Information availability and use


**Use when:** an answer misses or contradicts required evidence.

First inspect the exact input to the relevant operation. Then replay the question with verified applicable evidence, no relevant evidence, and conflicting or obsolete evidence. Define the appropriate answer or fallback for each condition.

Record whether the information was delivered, which material claims are supported, and whether the result changes appropriately. Keep source truth, source applicability, and answer fidelity separate.

**Decision:** investigate source maintenance, retrieval, context assembly, or output behavior. Improved answers after inserting evidence support that intervention locally; they do not prove an internal mechanism.

## Wording, position, and irrelevant material


**Use when:** equivalent requests or different context layouts appear to change consequential behavior.

Have a reviewer verify that prompt variants preserve the intended task. Change one feature at a time: wording, evidence placement, or added irrelevant material. Keep the relevant facts and constraints fixed. For a position test, preserve the same document set; for a selection test, record exactly what was removed.

Score the required outcome, not identical wording. Record harmful changes, acceptable variation, and whether the variant unintentionally changed the task.

**Decision:** whether a particular formulation or packaging change deserves a broader comparison.

## Repeatability and coverage


**Use when:** a success is intermittent or performance differs across task types.

Repeat saved scenarios with fixed inputs and known configuration to inspect within-case variation. Separately sample different tasks and relevant conditions, such as source age, language, document format, or workflow length.

Report acceptable and unacceptable runs per case, plus results by task group. Keep selected challenge cases separate from ordinary traffic. More repetitions of a few cases do not establish coverage of new cases.

**Decision:** whether to investigate intermittent behavior, narrow supported scope, or collect more varied evidence.

## Meaning, format, and exact values


**Use when:** extraction, summarization, or structured output appears plausible but may be wrong.

Check syntax with a parser. Check identifiers, numbers, units, and required relations against their reference. For summaries, inspect whether exceptions, negation, uncertainty, and scope survived. Test citations for both existence and support of the associated claim.

For example, a valid record containing `"unit": "month"` still fails a task that requires an annual amount. A summary that removes an eligibility exception can change the decision despite preserving most of the wording.

**Decision:** add or repair the specific failed check, transformation, or source relation. Record false rejections as well as errors caught.

## Tools, state, and recovery


**Use when:** the workflow selects an action, changes state, or recovers after failure.

Use a test environment or simulated tool where effects can be inspected. Check the requested operation, target, arguments, permission decision, tool response, resulting state, and user-facing report.

Include a correction, cancellation, timeout, partial success, duplicate request, and invalid result when relevant. Verify that retries do not repeat a completed effect, and that the product distinguishes a proposed action from a confirmed effect.

**Decision:** repair the specific boundary or limit the supported workflow. A plausible plan or narrated success is insufficient evidence that an action succeeded.

## Uncertainty, refusal, and fallback


**Use when:** the product expresses confidence, declines tasks, asks questions, or escalates.

Define cases that can be answered, cannot be answered from available evidence, and fall outside supported scope. Judge both incorrect answers and unnecessary refusal, clarification, or escalation. Include their cost to the customer.

If a numeric confidence score drives decisions, compare score ranges with observed correctness on labeled cases and report sample counts. Keep probability calibration separate from whether phrases such as "certainly" overstate the evidence.

**Decision:** revise the response or fallback rule. Increasing abstention alone does not establish an improvement.

## Compare a proposed change


**Use when:** deciding whether to adopt a prompt, source rule, model, validator, tool, or workflow change.

Choose a primary outcome and tolerable tradeoffs first. Run the current and changed versions on comparable cases. Hide variant labels from reviewers where practical. Inspect paired gains and regressions, including ordinary cases and fresh cases.

Report effect size and uncertainty appropriate to the sample and design. At an exploratory stage, raw counts and case-level differences may be more useful than a precise-looking aggregate. Do not interpret an inconclusive result as proof of no effect.

**Decision:** retain, revise, reject, or collect specific missing evidence. An improvement on the original failing case is a repair check, not the entire adoption decision.

## Observe continued product use


**Use when:** checking whether an offline improvement reaches customers and continues to hold.

Sample actual attempts, including abandoned work and manual rescue. Follow task completion, correction effort, repeat use when the job recurs, downstream rework, delay, and operating cost. When behavior changes, inspect changes in users, task mix, sources, configuration, and environment.

Before/after observations can be confounded by learning or changing workload. Use an appropriate randomized comparison when a causal estimate is necessary and practical.

**Decision:** keep the release, adjust scope, investigate, or roll back. Add newly observed cases to future checks without treating customer behavior as an unquestionable correctness label.

## Record the result


Use a short product-log entry: question; cases and comparison; judgment rule; result and limitations; decision. Link it from the relevant claim. Preserve negative and inconclusive results.

For how these checks fit customer discovery and delivery, see [learning through real product use]({{< ref "ai-engineering/causal-stack/practical-checks" >}}).
