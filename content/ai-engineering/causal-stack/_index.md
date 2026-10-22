---
draft: false
toc: true
title: "Investigating AI product behavior"
aliases:
  - "/ai-engineering/evaluation/causal-stack/"
  - "/ai-engineering/causal-stack/causal-stack-operating-model/"
  - "/ai-engineering/evaluation/causal-stack/causal-stack-operating-model/"
description: "A customer task connects the investigation: record what happened, compare explanations, test a change, and follow its effect on the work. Cases, claims, and checks keep observations and decisions traceable."
linkTitle: "Investigating AI product behavior"
---

Start with a customer trying to accomplish something. Use these notes to investigate a difficulty, choose a product change, and check whether it helps.

**Evidence status:** this is a working guide. The research references support specific background statements. The proposed practices still need evaluation in the products where we use them. Illustrations are not customer findings.

## Start here


| Situation | Read | Produce |
|---|---|---|
| Starting or improving a product | [Learning through real product use]({{< ref "ai-engineering/causal-stack/practical-checks" >}}) | A customer job, current alternative, and useful first scope |
| Something happened that deserves investigation | [Cases]({{< ref "ai-engineering/causal-stack/cases" >}}) | A short account linked to actual evidence |
| A task failed or required unexpected work | [Debugging]({{< ref "ai-engineering/causal-stack/debugging" >}}) | The next useful inspection or comparison |
| Someone proposes an explanation or practice | [Claims]({{< ref "ai-engineering/causal-stack/claims" >}}) | A scoped expectation and what would change our judgment |
| We need to judge behavior or compare a change | [Checks]({{< ref "ai-engineering/causal-stack/checks" >}}) | A result, its limits, and a decision |

Keep detailed cases and results with the product. Link them to relevant claims here when they can inform other work. No classification code or separate tracking system is required.

## Reference when needed


- [Language and interaction]({{< ref "ai-engineering/causal-stack/reference/language" >}}): targets, missing information, intent, corrections, and clarification.
- [Model and system behavior]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}}): scoped background facts, research findings, and limits of causal attribution.
- [Possible interventions]({{< ref "ai-engineering/causal-stack/reference/interventions" >}}): changes to consider after identifying a concrete problem, with checks and costs.

The product methodology remains in [Evaluation in AI Product Development]({{< ref "ai/approach/evaluations" >}}) and [Disciplined AI Experimentation]({{< ref "ai-engineering/approach/experimentation" >}}). This guide supplies practical investigation steps within that approach.

## Keep four things separate


| Item | Example |
|---|---|
| Observation | The reply used an obsolete rule |
| Possible explanation | Retrieval supplied an older document |
| Proposed change | Select sources by the applicable policy version |
| Customer outcome | Less correction work while replies remain acceptable |

The observation does not establish the explanation. A successful technical change does not establish customer value. Check each relationship that matters to the decision.

Retain a distinction when it changes what we inspect, judge, or do. Retain a recommendation with its conditions, evidence, and counterexamples. Background material can also earn its place by explaining a concept clearly and accurately.

[Refactoring record]({{< ref "ai-engineering/causal-stack/review-and-refactoring" >}}) maps the former layer documents to this structure.
