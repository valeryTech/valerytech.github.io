---
draft: false
toc: true
title: "AI Evaluation"
aliases:
  - "/ai-engineering/evaluation/v1/ai-evaluation-revised/"
linkTitle: "AI Evaluation"
---

AI evaluation is a way to gather and interpret evidence about how an AI product behaves. It supports questions and decisions during discovery, delivery, and production use.

It is needed because product behavior cannot be inferred from the implementation alone. The same system may behave differently across inputs, product state, model or prompt versions, tools, data, and operating conditions.

Evaluation does not remove this uncertainty. It makes a limited part of the behavior visible and gives the team a stated basis for deciding what to do next.

## Start with the question


Evaluation begins with a question or uncertainty, not with a dataset or metric.

Examples include:

- Can this candidate solution provide the proposed behavior?
- Where does it fail, and which failures matter?
- Is the evidence sufficient for the production commitment being considered?
- Does a candidate change improve the target behavior without causing an important regression?
- Does live behavior remain within the active production commitment?
- Has production use revealed a new situation, failure, or mistaken assumption?

The question determines which situations to examine, what evidence to capture, how to judge it, and what finding would be useful.

## The reasoning chain

```text
Question or uncertainty
        ↓
Evaluation basis: provisional behavior claim,
product rule, or proposed or active production commitment
        ↓
Evidence and coverage needed
        ↓
Designed cases or production sample
        ↓
Execution and captured evidence
        ↓
Judgment and comparison
        ↓
Finding and remaining uncertainty
        ↓
Decision
```


This is a reasoning dependency, not a sequence of product phases. Exploratory work may begin before a stable behavior claim or criterion exists. A finding may also send the work back to revise the question, claim, cases, criteria, or evidence path.

## Framework and subsystem


The **evaluation framework** defines the reasoning:

- which question is being answered;
- which behavior is being claimed and in which situations;
- which evidence would be useful;
- how the evidence will be judged;
- what the result can and cannot support;
- how the result will be interpreted for a decision.

The **evaluation subsystem** is the people, practices, data, and software used to produce, inspect, judge, compare, and preserve evidence. It includes cases, samples, execution tools, traces, storage, criteria, evaluators, human review, versioning, comparison, and production observation.

The subsystem supports decisions. It does not own product intent, accepted risk, production commitments, or release decisions.

The detailed goals and boundaries are in [Goals of AI Evaluation]({{< ref "ai-engineering/evaluation/v1/ai-evaluation-goals" >}}).

## Evaluation in discovery and delivery


Discovery and delivery are concurrent kinds of work.

- **Discovery** mainly reduces uncertainty. Evaluation can probe a candidate solution, compare alternatives, expose behavior boundaries, and find failures or missing assumptions.
- **Delivery** mainly builds and operates a dependable production solution. Evaluation can check committed behavior, compare a change with a baseline, detect regressions, and support rollout or rollback decisions.
- **Production use** supplies evidence that cannot be obtained elsewhere. It can reveal new inputs, failures, costs, dependencies, user responses, and mistaken intent.

A production commitment changes the obligations attached to a solution. It does not end discovery. Evaluation continues because both the implementation and the understanding of the intended behavior can change.

## Keep five questions separate


Evaluation must not combine these questions into one measure:

1. Does the product behave as currently claimed or promised?
2. Can the intended users understand it and complete the relevant work?
3. Do people choose, adopt, and continue using it instead of the available alternatives?
4. Does its use change the user or operating condition it was meant to change?
5. Does that change produce the wider result that was expected?

The evaluation subsystem mainly examines the first question. It may preserve and compare evidence related to the other four, but usability work, customer research, product analytics, controlled experiments, and business evidence may also be required.

## A finding is not a decision


A finding states what the available evidence supports within its limits. It should identify:

- the question;
- the evaluation basis and its version;
- the cases or sample examined;
- the system and evaluation versions;
- the observed behavior;
- the judgment or comparison;
- important variation and failures;
- missing evidence and remaining uncertainty.

The people responsible for the product decision use the finding with other evidence and judgment. A failed evaluation does not automatically mean "fix the model." The issue may be the solution, implementation, production commitment, criterion, evaluator, sample, or evidence capture.

## Start with the smallest useful evaluation


The first evaluation does not need a platform, a large dataset, or automated judges.

For an exploratory question:

1. State the question and the decision it may influence.
2. Select a small set of relevant situations.
3. Run or observe the candidate system.
4. Preserve enough evidence for review.
5. Inspect the behavior with product or domain experts.
6. Record the finding, limits, and next question.

Make the work more repeatable when the same judgment will be needed again, the commitment becomes more consequential, or production behavior must be monitored over time.

## Document set


- [Conceptual Model for AI Evaluation]({{< ref "ai-engineering/evaluation/v1/conceptualization" >}}) explains how product intent, system behavior, decision needs, evaluation goals, and responsibilities connect.
- [Goals of AI Evaluation]({{< ref "ai-engineering/evaluation/v1/ai-evaluation-goals" >}}) defines the goals and boundaries of the framework and subsystem.
- [Evidence Model]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}) separates a case, execution, trace, observation, judgment, measurement, and finding.
- [Coverage and Case Design]({{< ref "ai-engineering/evaluation/v1/coverage-and-case-design" >}}) explains how to choose situations, cases, samples, and datasets for a question.
- [Building a Starting Set of User Inputs]({{< ref "ai-engineering/evaluation/v1/10-user-inputs" >}}) gives the working process for building test data from real, manual, and generated inputs.
- [Judgment and Findings]({{< ref "ai-engineering/evaluation/v1/30-judgment-and-findings" >}}) explains criteria, evaluation methods, evaluator validation, measurements, and decision rules.
- [Failure Analysis]({{< ref "ai-engineering/evaluation/v1/20-error-analysis" >}}) gives an optional method for discovering recurring failure patterns from observed cases.
- [Evaluation Subsystem]({{< ref "ai-engineering/evaluation/v1/evaluation-subsystem" >}}) describes the people, tools, data, and operating practices used to produce evidence.
- [Production Learning]({{< ref "ai-engineering/evaluation/v1/production-learning" >}}) explains how evidence from real use returns to discovery and delivery.

The [operating model]({{< ref "ai/operating-model/operating-model" >}}) supplies the wider decision logic. The [production commitment]({{< ref "ai/operating-model/production-commitment" >}}) defines the behavior and conditions for which the team accepts responsibility.
