---
draft: false
toc: true
title: "Introduction to AI Evaluation"
description: "AI evaluation starts with a question and examines whole-product behavior in defined situations, preserving the evidence and limits needed to inform discovery, delivery, and production decisions."
linkTitle: "Introduction"
---
## Framework and subsystem


The **evaluation framework** explains:

- which question is being answered;
- which behavior matters and in which situations;
- what the team needs to record;
- how it will judge what happened;
- what the result can and cannot establish;
- how the result will help with a decision.

The **evaluation subsystem** is the people, practices, data, and software used to produce, inspect, judge, compare, and preserve evidence. It includes cases, samples, execution tools, traces, storage, criteria, evaluators, human review, versioning, comparison, and production observation.

The subsystem supports decisions. It does not own product intent, accepted risk, production commitments, or release decisions.

The detailed goals and boundaries are in [Goals of AI Evaluation]({{< ref "ai-engineering/evaluation/framework-v1/conceptualization" >}}#evaluation-goals).

## Evaluation in discovery and delivery


Discovery and delivery can happen at the same time.

- **Discovery** mainly helps the team learn what it does not yet know. Evaluation can probe a candidate solution, compare alternatives, expose behavior boundaries, and find failures or missing assumptions.
- **Delivery** mainly builds and operates a dependable production solution. Evaluation can check committed behavior, compare a change with a baseline, detect regressions, and support rollout or rollback decisions.
- **Production use** shows things that pre-release tests cannot. It can reveal new inputs, failures, costs, dependencies, user responses, and mistaken intent.

A production commitment changes the obligations attached to a solution. It does not end discovery. Evaluation continues because both the implementation and the understanding of the intended behavior can change.

## A finding is not a decision


A finding states what the available evidence supports within its limits. It should identify:

- the question;
- the evaluation basis and its version;
- the cases or sample examined;
- the system and evaluation versions;
- the observed behavior;
- the judgment or comparison;
- important variation and failures;
- missing evidence and what remains unknown.

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

Make the work more repeatable when the same judgment will be needed again, the commitment carries more risk, or production behavior must be watched over time.

## Document set


- [Conceptual Model for AI Evaluation]({{< ref "ai-engineering/evaluation/framework-v1/conceptualization" >}}) explains how product intent, system behavior, decision needs, evaluation goals, and responsibilities connect.
- [Goals of AI Evaluation]({{< ref "ai-engineering/evaluation/framework-v1/conceptualization" >}}#evaluation-goals) defines the goals and boundaries of the framework and subsystem.
- [Evidence Model]({{< ref "ai-engineering/evaluation/framework-v1/evidence-model" >}}) separates a case, execution, trace, observation, judgment, measurement, and finding.
- [Coverage And Case Design]({{< ref "ai-engineering/evaluation/framework-v1/coverage-and-case-design" >}}) explains how to choose situations, cases, samples, and datasets for a question.
- [Building a Starting Set of User Inputs]({{< ref "ai-engineering/evaluation/framework-v1/10-user-inputs" >}}) gives the working process for building test data from real, manual, and generated inputs.
- [Judgment and Findings]({{< ref "ai-engineering/evaluation/framework-v1/30-judgment-and-findings" >}}) explains criteria, evaluation methods, evaluator validation, measurements, and decision rules.
- [Failure Analysis]({{< ref "ai-engineering/evaluation/framework-v1/20-error-analysis" >}}) gives an optional method for discovering recurring failure patterns from observed cases.
- [Evaluation Subsystem]({{< ref "ai-engineering/evaluation/framework-v1/evaluation-subsystem" >}}) describes the people, tools, data, and operating practices used to produce evidence.
- [Production Learning]({{< ref "ai-engineering/evaluation/framework-v1/production-learning" >}}) explains how evidence from real use returns to discovery and delivery.

The [Operating Model]({{< ref "ai/product/operating-model/operating-model" >}}) supplies the wider decision logic. The [Production Commitment]({{< ref "ai/product/operating-model/production-commitment" >}}) defines the behavior and conditions for which the team accepts responsibility.

## Library sources


- [Huyen 2025](/sources/faff32abd78cc0963d6a4a913c8c129e.bin), *AI Engineering: Building Applications with Foundation Models*
