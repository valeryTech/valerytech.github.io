---
draft: false
toc: true
title: "Possible interventions"
aliases:
  - "/ai-engineering/causal-stack/layer-3-control-families/"
  - "/ai-engineering/evaluation/causal-stack/layer-3-control-families/"
  - "/ai-engineering/causal-stack/layer-3-controls-and-faults/"
  - "/ai-engineering/evaluation/causal-stack/layer-3-controls-and-faults/"
  - "/ai-engineering/causal-stack/layer-3-system-fault-families/"
  - "/ai-engineering/evaluation/causal-stack/layer-3-system-fault-families/"
  - "/ai-engineering/causal-stack/layer-3-semantic-fault-view/"
  - "/ai-engineering/evaluation/causal-stack/layer-3-semantic-fault-view/"
description: "A short menu of changes to consider after diagnosing a product problem, including validation and tradeoffs."
linkTitle: "Possible interventions"
---

Choose an intervention after identifying a concrete problem with the [debugging guide]({{< ref "ai-engineering/causal-stack/debugging" >}}). These are options to evaluate, not required components of every AI product.

The absence of a normalization stage, validator, memory system, or router is not itself a defect. Establish the behavior that must change and compare the simplest suitable change with the current product.

## Start at the affected boundary


| Observed problem | Candidate change | Check before adopting | Cost or limitation |
|---|---|---|---|
| The task or target remains unresolved | Bind the selected object; expose a missing field; ask one specific question | Correct and ambiguous cases, unnecessary questions, completion effort | More interaction can obstruct simple tasks |
| Required information never reaches the model | Repair the source, retrieval, filter, or context assembly step | Presence of required facts and downstream completion on fresh cases | More context can add delay or conflicting material |
| Competing sources have different applicability | Supply version, date, authority, and scope; select by the rule appropriate to the question | Current, historical, conflicting, and missing-source cases | Newest is not always governing; metadata needs maintenance |
| Claims exceed what the evidence supports | Narrow the answer scope; check material claims against source spans; provide a useful fallback | Unsupported assertions, missed answers, reviewer burden | Citation existence does not establish support or truth |
| Format is valid but values are wrong | Check exact values, units, required relations, and permitted identifiers in application code where possible | Known errors and valid alternatives, including false rejection | Each check needs a reliable reference and maintenance |
| Corrections are lost between steps | Update the relevant task state and pass it to later operations | Replacement, addition, cancellation, and resumed sessions | A summary or overwrite can lose other valid constraints |
| A tool request or its interpretation is wrong | Clarify the tool contract; validate arguments; inspect resulting state | Wrong targets, invalid arguments, unexpected responses, partial success | Successful API transport does not prove the intended effect |
| A retry repeats an effect or conceals a failure | Bound retries; detect completed effects; use supported idempotency; expose unresolved state | Timeout after success, duplicate requests, retry exhaustion | Retrying can cost more or duplicate an external effect |
| The product attempts an action outside permitted scope | Enforce the actual permission and precondition at the application boundary; require approval when the product contract requires it | Allowed, denied, changed, and bypassed paths | Prompt instructions and model judgment are insufficient evidence of enforcement |
| A budget limit silently changes the result | Make truncation or fallback explicit; narrow the job or allocate a different budget | Long inputs, slow tools, output limits, and total completion cost | More budget may not help; partial results need clear meaning |
| An upgrade changes previously acceptable behavior | Version the relevant configuration; compare representative workflows; retain a workable rollback | Targeted and adjacent cases, then observed use | Regression sets miss new situations; rollback may not reverse data changes |
| Failures cannot be reconstructed | Capture the missing boundary input, output, version, or state | Reconstruct a new case using the added evidence | Logging has storage, handling, and review costs |

## Recovery and fallback are part of the product


A fallback should leave the customer with an understandable next step and preserve useful work. Depending on the job, that may be a partial draft, an explicit unanswered question, a manual path, or a handoff to someone who can resolve it.

Check whether the fallback actually works, how much effort it transfers, and whether it is invoked unnecessarily. A higher escalation rate is not automatically better.

Undo is useful only where the effect can be reversed. A compensation may repair a record without undoing a message already read or an action already taken. Verify the recovery behavior the product promises.

## Source labeling and instruction boundaries


Labeling retrieved text as data can be part of a prompt design, but it is not a permission boundary. When untrusted content could influence actions, test conflicting instructions and enforce the application's allowed operations independently.

The research on [instruction hierarchy]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}}#research-findings-with-limited-scope) concerns learned model behavior. Treat the product's action permissions as a separate implementation and verification question.

## Judge the complete intervention


Measure the target failure and the work introduced by the remedy: false rejection, added questions, delay, cost, reviewer load, and maintenance.

Use the [focused checks]({{< ref "ai-engineering/causal-stack/checks" >}}) for the affected behavior and the [product-use cycle]({{< ref "ai-engineering/causal-stack/practical-checks" >}}) for the customer outcome. Keep the current approach if the proposed addition has no demonstrated benefit for the decision at hand.
