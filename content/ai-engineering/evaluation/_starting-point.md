---
draft: false
toc: true
description: "A practical starting sequence for AI evaluation: frame one workflow, choose a product decision, define expected behavior, run representative cases, and use the findings to guide changes."
title: "Starting Point"
linkTitle: "Starting Point"
---

My conclusion: start with product framing, then define a concrete product behavior to evaluate. You don't need a complete product vision, a formal evaluation framework, or an evaluation platform before beginning.

The most useful idea in your notes is that evaluation exists to answer a question that affects a product decision. That question determines what behavior to examine, what evidence to collect, and how to judge the result. Your [AI Evaluation](https://valery.tech/ai-engineering/evaluation/v1/ai-evaluation/?utm_source=chatgpt.com)and [Conceptual Model](https://valery.tech/ai-engineering/evaluation/v1/conceptualization/?utm_source=chatgpt.com) already establish this quite clearly.

I'd distinguish two starting points:

- If you're starting a new AI product: begin with the user's problem, intended outcome, target users, and the work the product should support.
- If you're evaluating an existing AI product: begin with a specific product decision or uncertainty, then identify the relevant workflow and expected behavior. You can reconstruct the necessary product framing from what is already known.

The important transition is from a general product intention to a specific, testable behavioral claim. That's where practical evaluation design begins.

## 1. The sequence I would actually use


PRACTICAL WORKFLOW

1. Product framing

Define the user, job, intended outcome, and scope

2. Evaluation question

Identify the decision and uncertainty

3. Behavioral expectations

Specify what must happen and what must never happen

4. Case design

Choose situations that could confirm or challenge those expectations

5. Execution and judgment

Run the system, inspect evidence, record failures

6. Findings and iteration

Decide what to change, then evaluate again

The sequence is a useful default, and you can enter it at different points depending on whether you're exploring a solution, building a product, or investigating an existing failure.

### Product framing: the first artifact


I'd produce a short document that answers these questions:

|Question|Example: expense assistant|
|---|---|
|Who is the user?|Someone tracking personal expenses|
|What job needs doing?|Record an expense with little manual work|
|What outcome is desired?|Faster capture with fewer corrections|
|What is the supported scope?|Common, clearly specified expenses|
|What behavior is expected?|Convert a description into an accurate editable draft|
|What must never happen?|Save an incorrect or unconfirmed transaction|
|What remains unsupported?|Ambiguous descriptions that can't be resolved safely|

This is sufficient product framing for an initial evaluation.

Next, turn the supported scope into behavioral expectations. For example: the assistant must preserve an explicitly stated amount; when the amount is ambiguous, it must request clarification; and it must not persist a transaction before confirmation.

Then define your immediate decision: Can we safely offer this expense-capture workflow to a small group of users?

That's an evaluation question with a specific purpose.

## 2. What happens after the behavioral expectations?


Choose cases that exercise those expectations. Start with perhaps 10-20 carefully selected cases for an exploratory pass: normal requests, ambiguous amounts, contradictory instructions, missing information, and permission or confirmation boundaries.

Run them against an identified implementation, recording the input, relevant state, tool activity, output, and changes made by the system.

Review the traces manually first. Judge each case against concrete rules. Use deterministic checks for things like forbidden writes and confirmations, and human review when correctness depends on meaning or context. A model-based evaluator becomes useful once you've validated that it can apply the criteria consistently.

Your first result should resemble:

> We reviewed 15 cases. The candidate handled basic expense descriptions, but failed to preserve the intended amount in several multi-amount requests. We also found one case where missing information was silently assumed. We need to resolve those behaviors before extending the supported scope.

That is a finding which can guide engineering work. It is much more actionable than an overall 84% quality score.

## 3. What I would remove or demote from the notes


I agree with your suspicion about the amount of generated material. There is a sound core idea, but several parts appear overdeveloped relative to the practical work they support.

|Material|Assessment|
|---|---|
|Conceptual Model|Keep the relationship among product intent, decisions, system behavior, and evidence. Shorten the surrounding taxonomy.|
|Coverage and Case Design|Keep. It directly explains how to select useful cases.|
|Judgment and Findings|Keep. The distinction among criteria, judgments, measurements, and findings is operationally useful.|
|Starting Evaluation Inputs|Simplify. The 20-tuple and approximately 100-case recommendations are heuristics, not justified starting requirements.|
|Evidence Model|Keep as a reference glossary, not prerequisite reading.|
|Evaluation Harness / Subsystem|Defer the larger architecture until repeated execution and comparison demand it.|
|AI Product Improvement System|Heavily condense. The three-loop model and extensive formal definitions add little to the first evaluation.|

There is also an actual inconsistency: [Starting Evaluation Inputs](https://valery.tech/ai-engineering/evaluation/v1/10-user-inputs/?utm_source=chatgpt.com) says a dimension must be identifiable from the user input, but its examples include hidden system state. [Coverage and Case Design](https://valery.tech/ai-engineering/evaluation/v1/coverage-and-case-design/?utm_source=chatgpt.com) correctly distinguishes input dimensions from case conditions. I'd make the latter the authoritative definition.

![](https://www.google.com/s2/favicons?domain=https://valery.tech&sz=32)

Systems & Engineering

+1

The biggest editorial gap is the absence of one concise, complete worked example connecting a product problem through a decision, a behavioral claim, actual traces, and a resulting change. A single example of that kind would teach more than many pages of abstract definitions.

## 4. Which notes should guide the work?


For a practical reader, I'd use [AI Evaluation](https://valery.tech/ai-engineering/evaluation/v1/ai-evaluation/?utm_source=chatgpt.com) as the short introduction, followed by [Coverage and Case Design](https://valery.tech/ai-engineering/evaluation/v1/coverage-and-case-design/?utm_source=chatgpt.com) and [Judgment and Findings](https://valery.tech/ai-engineering/evaluation/v1/30-judgment-and-findings/?utm_source=chatgpt.com). Once there are actual failures, use [Failure Understanding](https://valery.tech/ai-engineering/evaluation/v1/20-error-analysis/?utm_source=chatgpt.com). Introduce the harness documents when automation or reliable comparisons are needed.

Your [V2 refactoring notes](https://valery.tech/ai-engineering/evaluation/v2/00-refactor/?utm_source=chatgpt.com) also contain a useful distinction: when evidence reveals that intended behavior is unclear, return to product discovery; when intended behavior is clear but the implementation fails to deliver it, proceed with engineering improvements; when evidence is insufficient, improve the evaluation setup.

![](https://www.google.com/s2/favicons?domain=https://valery.tech&sz=32)

Systems & Engineering

## 5. What I would do first


Take one real workflow from a product you're working on. Write a one-page product framing document, select one decision, and specify three to five behavioral expectations. Then run a small set of cases and inspect what actually happens.

That exercise will establish whether the framework is operationally useful and which concepts or tools are missing.

I would stop expanding the framework until one complete evaluation has been performed using it. The next revision should be driven by the difficulties encountered in that evaluation.
