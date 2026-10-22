---
draft: false
toc: true
title: "Claims to check in product work"
aliases:
  - "/ai-engineering/causal-stack/layer-1b-final-scheme/"
  - "/ai-engineering/evaluation/causal-stack/layer-1b-final-scheme/"
description: "A definition, incident explanation, and product recommendation need different support. Scoped expectations, counterexamples, and revision rules let product evidence strengthen, narrow, or overturn engineering claims."
linkTitle: "Claims to check in product work"
---

A claim states something we expect to hold within a specified setting. It becomes useful when evidence for or against it can change a decision.

## Different statements need different evidence


| Statement | What to check |
|---|---|
| Definition | Is it accurate, clear, and useful for this purpose? |
| General claim about models | What do primary sources establish, for which models and tasks? |
| Explanation of a local incident | Do the available artifacts and comparisons distinguish it from alternatives? |
| Recommendation to change a product | Does the change improve the relevant outcome at an acceptable cost? |
| Recommendation to use this guide | Does it lead to useful checks and decisions without excessive overhead? |

An architectural description can suggest a hypothesis. It cannot by itself explain a particular failed run. A local improvement does not establish a universal recommendation.

## Small claim record


- **Decision and scope:** what could change, for which product, users, and tasks?
- **Expectation:** what observable difference is predicted?
- **Evidence:** relevant source or case links, including counterexamples.
- **Check:** comparison or observation, outcome, and important tradeoffs.
- **Revision rule:** what would justify retaining, qualifying, rejecting, or investigating further?

Describe the current support in plain language: proposed; observed in these cases; supported by this comparison; contradicted; or unresolved. Preserve earlier findings when a later result changes the conclusion.

## Candidate claims from the former stack


These are starting hypotheses, not findings from local product use. Choose one only when a real decision requires it.

### Clarification when the target is unresolved


**Expectation:** for actions with multiple plausible targets, asking one specific question reduces wrong-target actions enough to justify the extra interaction.

Compare with the current workflow on ambiguous cases and cases whose target is already recoverable. Record wrong actions, unnecessary questions, abandoned tasks, and completion effort. Revise the recommendation if clarification mostly repeats available information or prevents useful completion.

### Selecting applicable evidence


**Expectation:** when obsolete and current sources compete, selecting by explicit applicability rules reduces corrections for outdated information.

Check that the selected source actually reaches the model. Compare on current, historical, conflicting, and missing-source cases. A "newest source wins" rule may fail historical questions or ignore authority. Keep the recommendation only within the conditions supported.

### Preserving corrections across steps


**Expectation:** explicitly updating the relevant task state reduces later use of superseded values.

Replay corrections, cancellations, and genuine additions. Inspect the subsequent action, not only the acknowledgement. Compare failure and recovery effort. An overbroad replacement rule that removes still-valid constraints is a counterexample.

### Checking exact values separately


**Expectation:** checking identifiers, units, totals, or required fields against their reference catches consequential errors missed by a format check.

Compare detections and false rejections on real output examples. Record delay and maintenance work. Keep each check tied to a defined relation; an unimplemented "semantic validator" is not a remedy.

### Reducing or reorganizing supplied context


**Expectation:** for a task with relevant evidence obscured by irrelevant material, a specified selection or layout change improves acceptable completion.

Use the same cases and evidence where possible; vary selection and placement separately. Include cases requiring several sources. Removing necessary exceptions or cross-document evidence would count against the change. Research on position effects motivates checking this locally; see [model and system behavior]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}}#research-findings-with-limited-scope).

### Using the guide during investigation


**Expectation:** the guide helps choose useful next checks and reduces unsupported attribution at a reasonable reading cost.

Record which question changed an actual investigation, including bad suggestions. If a team comparison becomes worthwhile, use fresh incidents and independent review of the proposed checks. Reclassifying the same known case twice confounds the comparison with learning.

## Explanations that remain hypotheses


Terms from the former stack such as "cooperative completion prior," "knowledge-signal blending," and "task induction" may suggest questions about answering, source use, or task interpretation. They do not need to be assigned to incidents.

Prefer a checkable statement such as "the output follows the obsolete excerpt when both versions are supplied." Internal explanations require additional evidence. If knowing the internal mechanism would not change the product decision, leave that question open.

For the broader method, see the [critical empirical stance]({{< ref "ai/other/methodology/in-critical-stance" >}}) and [Evidence-Based Software Engineering](https://ebse.webspace.durham.ac.uk/), which combines appraisal of research with expertise and the circumstances of use.
