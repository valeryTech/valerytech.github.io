---
draft: false
toc: true
title: "Guide"
linkTitle: "Guide"
---
# AI Evaluation Guide


Start with [AI Evaluation]({{< ref "ai-engineering/evaluation/v1/ai-evaluation" >}}) for the overall model.

Then use the document that matches the current question:

| Need | Document |
| --- | --- |
| Understand how product intent, system behavior, decision needs, and evaluation connect | [Conceptual Model for AI Evaluation]({{< ref "ai-engineering/evaluation/v1/conceptualization" >}}) |
| Understand the purpose and limits of evaluation | [Goals of AI Evaluation]({{< ref "ai-engineering/evaluation/v1/ai-evaluation-goals" >}}) |
| Distinguish cases, executions, traces, judgments, and findings | [Evidence Model]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}) |
| Choose situations, inputs, cases, samples, and datasets | [Coverage and Case Design]({{< ref "ai-engineering/evaluation/v1/coverage-and-case-design" >}}) |
| Build a starting set of test data | [Building a Starting Set of User Inputs]({{< ref "ai-engineering/evaluation/v1/10-user-inputs" >}}) |
| Define criteria, choose evaluators, and produce findings | [Judgment and Findings]({{< ref "ai-engineering/evaluation/v1/30-judgment-and-findings" >}}) |
| Find recurring failures in reviewed traces | [Failure Analysis]({{< ref "ai-engineering/evaluation/v1/20-error-analysis" >}}) |
| Design the tools and practices that produce evaluation evidence | [Evaluation Subsystem]({{< ref "ai-engineering/evaluation/v1/evaluation-subsystem" >}}) |
| Decide whether repeated controlled execution is needed | [Why Use an Evaluation Harness?]({{< ref "ai-engineering/evaluation/v1/why-use-evaluation-harness" >}}) |
| Understand controlled execution and comparison | [Evaluation Harness and Workspace]({{< ref "ai-engineering/evaluation/v1/harness-and-platform" >}}) |
| Use real product behavior as evidence | [Production Learning]({{< ref "ai-engineering/evaluation/v1/production-learning" >}}) |

The documents follow one reasoning chain:

```text
question or uncertainty
        ↓
evaluation basis: behavior claim, product rule,
or proposed or active production commitment
        ↓
evidence and coverage needed
        ↓
cases or production sample
        ↓
execution and captured evidence
        ↓
judgment and comparison
        ↓
finding and remaining uncertainty
        ↓
decision
```


This is not a required project sequence. Discovery and delivery may use any part of the evaluation practice when it serves the current decision.
