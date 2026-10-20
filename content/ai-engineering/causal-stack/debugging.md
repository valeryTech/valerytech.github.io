---
draft: false
toc: true
title: "Debugging a failed customer task"
aliases:
  - "/ai-engineering/causal-stack/layer-2/product-fault-families/"
  - "/ai-engineering/evaluation/causal-stack/layer-2/product-fault-families/"
  - "/ai-engineering/causal-stack/layer-2/fault-family-index/"
  - "/ai-engineering/evaluation/causal-stack/layer-2/fault-family-index/"
  - "/ai-engineering/causal-stack/layer-2/semantic-fault-family-index/"
  - "/ai-engineering/evaluation/causal-stack/layer-2/semantic-fault-family-index/"
  - "/ai-engineering/causal-stack/layer-2/failure-operators/"
  - "/ai-engineering/evaluation/causal-stack/layer-2/failure-operators/"
description: "Questions for locating a visible mismatch, comparing explanations, and choosing a useful next check."
linkTitle: "Debugging a failed customer task"
---

Start from a [case]({{< ref "ai-engineering/causal-stack/cases" >}}). Establish what an acceptable result would have been and why the difference mattered to the customer.

## Locate the visible mismatch


Follow the actual workflow. Inspect only the boundaries relevant to this case:

| Question | Evidence to inspect | Useful distinction |
|---|---|---|
| Did we attempt the right task? | Request, selected object, scope, constraints, and expected outcome | Wrong goal versus a wrong result for the right goal |
| Did the needed information reach the operation? | Source records, retrieval results, assembled model input, and truncation logs where available | Unavailable or omitted information versus incorrect output despite supplied information |
| Was the information applicable? | Date, authority, version, customer context, exceptions, and conflicts | Current and relevant versus merely retrieved |
| Did the output preserve the needed meaning? | Source spans, claims, extracted values, units, qualifiers, and citations | Missing detail, changed meaning, unsupported assertion, or incorrect exact value |
| Did the workflow act correctly? | Selected tool, arguments, response, resulting state, and retries | Wrong request, failed execution, or wrong interpretation of a successful response |
| Did later steps preserve earlier decisions? | Corrections, stored state, summaries, and subsequent calls | Lost update, stale state, or new information legitimately changing the task |
| Did the result remain useful to the customer? | Review work, delay, fallback, final action, and downstream outcome | Technically acceptable output versus acceptable completion of the whole job |

The earliest visible mismatch is a place to investigate. It may itself have an upstream cause. If a necessary artifact is missing, record that uncertainty and capture it in the next relevant run.

## Compare explanations


For the leading explanation, ask what evidence would make it less likely. Include a plausible alternative.

For an outdated answer:

- Was an obsolete source selected?
- Was the current source selected but omitted from the actual model input?
- Was the current source present but inapplicable to this question?
- Did another source, cached output, or earlier state supply the old answer?
- Does the error recur when the question is supplied with only the verified applicable excerpt?

Use a [focused check]({{< ref "ai-engineering/causal-stack/checks" >}}) to narrow the possibilities. A changed output after an intervention is evidence about that intervention under those conditions. It does not automatically identify the model's internal cause.

## Use precise descriptions


| Avoid stopping at | More inspectable statement |
|---|---|
| "Hallucination" | "The reply asserts a refund condition absent from the supplied policy" |
| "Ignored context" | "The exact input contains the corrected address; the submitted action uses the previous address" |
| "Bad reasoning" | "The calculation multiplies by the monthly rate although the requested total is annual" |
| "Unstable" | "The escalation decision differs across repeated runs of the saved case" |
| "Missing guardrail" | "An invalid account identifier passed the existing check and was sent to the tool" |

Unsupported and false are different judgments. A true statement may lack required support; a cited statement may faithfully repeat an incorrect source. Check source fidelity and truth separately when both matter.

## Choose the next action


If the requirement is unclear, resolve it with the person responsible for the outcome. If the evidence is missing, capture or inspect it. If the defect is in ordinary application code or source data, fix that boundary and verify it directly.

For a behavioral change, choose the smallest plausible intervention and compare it with the current product. Consider the [intervention reference]({{< ref "ai-engineering/causal-stack/reference/interventions" >}}) only after identifying the problem.

Prioritize by customer consequence, recurrence, and the cost of learning enough to act. One serious failure can justify immediate containment without establishing its population frequency.

Finish with a decision: fix, narrow supported scope, keep investigating, accept a documented limitation, or stop the approach. Preserve the case for regression checks and revisit customer outcomes after release.
