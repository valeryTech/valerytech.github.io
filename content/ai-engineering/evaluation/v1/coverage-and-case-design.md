---
draft: false
toc: true
title: "Coverage And Case Design"
linkTitle: "Coverage And Case Design"
---
# Coverage and Case Design for AI Evaluation

## Purpose


This document explains how to choose the situations used in an AI evaluation.

A case set or production sample is useful only in relation to a question. It does not represent product quality in general. It supports a limited conclusion about defined product behavior, users, situations, and operating conditions.

The broader reasoning is described in [Goals of AI Evaluation]({{< ref "ai-engineering/evaluation/v1/ai-evaluation-goals" >}}) and the [operating model]({{< ref "ai/operating-model/operating-model" >}}).

## Start with the question and decision


Do not begin by collecting a generic set of prompts.

First state:

- the question or uncertainty;
- the decision the evidence may affect;
- the assumption or obligation being examined and the consequence if it is false, when relevant;
- the behavior claim being examined, if one exists;
- the source and status of the behavior claim;
- the proposed or active production commitment, if one applies;
- the users, situations, and scope to which the claim applies;
- the important failures and operating conditions;
- what the evaluation will still leave unknown.

For example:

```text
Decision:
Should a limited rollout expand to all support agents?

Behavior claim:
For supported refund requests, the product preserves the customer's stated
constraints, uses only permitted account data, and does not issue a refund
without the required confirmation.

Evaluation question:
Does the current candidate provide that behavior across the situations needed
for the proposed rollout, and where does the evidence remain weak?
```


Exploratory work may begin before a stable claim exists. In that case, record the question, the provisional expectation, and the behavior being explored. Do not turn an early expectation into a release rule without further review.

A routine regression check may inherit its assumption, consequence, and evaluation basis from the linked commitment or case. The link should remain visible even when those details are not repeated.

## Define what the evidence must cover


A coverage requirement states a part of the claim or decision that the evidence must represent.

Coverage requirements may come from:

- the bounded behavior claim or production commitment;
- the main user jobs involved in that claim;
- supported and unsupported situations;
- important ways the behavior could fail;
- safety, privacy, security, reliability, cost, and operating conditions;
- user roles, permissions, tools, routes, and system states that may change behavior;
- known difficult cases and previous failures;
- important differences found in production use;
- a comparison that the decision requires.

Examples:

```text
The product must not perform a write action when the user has read-only access.

The product must preserve a changed date constraint across a multi-turn request.

The comparison must include requests for which no valid result exists.
```


Coverage is not a list of every possible input. It is a reasoned selection of situations that can provide useful evidence for the current question.

## Keep cases and production samples separate


Cases and production samples support different conclusions.

| Design object | What it defines | What the resulting executions and captured evidence can support |
| --- | --- | --- |
| **Evaluation case** | A situation and the conditions under which it should be executed | Exploration, controlled comparison, regression checks, and findings about selected parts of an evaluation basis |
| **Production sample** | A rule for selecting executions from a defined live population and time period | Findings about observed behavior in that population, subject to the sampling method and captured data |

A deliberately designed case set may include rare, difficult, or high-consequence situations. Its rates do not estimate normal production performance.

Evidence from a production sample may estimate typical behavior when its population and selection method are suitable. It may still miss rare but serious failures.

For a production sample, record:

- the population being sampled;
- what is selected as one item, such as a user, conversation, or execution;
- the time period;
- inclusion and exclusion rules;
- the selection method;
- important groups or situations;
- missing or filtered data;
- known sources of bias.

A production execution can later be used to create a controlled case. The captured production trace remains evidence of what occurred; the new case becomes a way to examine or protect related behavior under defined conditions.

## Define the parts of an evaluation case


A user input alone is not an evaluation case.

An executable case may include:

| Part | Meaning |
| --- | --- |
| **Input or participant action** | What a user, system, or test participant provides |
| **Fixture and initial state** | The data, permissions, records, conversation state, or external conditions required for the situation |
| **System configuration** | The product, model, prompt, tools, policies, and other versions needed to interpret the execution |
| **Execution conditions** | Tool availability, environment, timing, or other conditions that matter to the behavior |
| **Applicable expectation** | The claim, obligation, criterion, or important failure the case helps examine |
| **Purpose and source** | Why the case exists and whether it came from real use, manual design, generation, or a previous failure |

Setup conditions and expected product behavior are different. A fixture may state that the user has read-only access. The behavior expectation may state that the product must not perform a write action.

Check that the fixture actually creates the intended situation. Do not hide required state inside the wording of the user input.

For a multi-turn or adaptive case, also define the prior context and the rule for the next participant action. A fixed script is suitable only when later actions do not depend on behavior produced during the execution.

## Use dimensions only when they help


A dimension describes one way cases can differ that may lead to different behavior.

Keep two kinds of variation distinct:

- **Input dimensions** describe the visible input, such as request type, ambiguity, completeness, or dependence on earlier conversation.
- **Case-condition dimensions** describe fixtures or execution conditions, such as permission level, tool availability, or record state.

Do not classify hidden system state as a property of the user input.

A tuple or case profile is an optional way to describe a selected combination of dimension values before writing a concrete case. It is a design aid, not a source of coverage requirements.

Do not generate every possible combination of values. Include an interaction only when there is a reason to expect that the combination may expose different behavior. Keep a complicated combination only when the interaction itself matters.

## Choose case sources deliberately


Real, manually written, and synthetic inputs serve different purposes.

| Source | Useful for | Main limits |
| --- | --- | --- |
| **Real input or execution** | Actual language, goals, omissions, context, and production conditions | Available data may be biased, sparse, unsafe to reuse, or unrelated to the current claim |
| **Manually written case** | A precise obligation, boundary, failure hypothesis, or controlled comparison | Authors may miss how users speak and may encode their own assumptions |
| **Synthetic input or case** | Filling a defined gap and producing controlled variation | Generated examples may be repetitive, unrealistic, or shaped by the generating model |

Use real evidence when it fits the question, but do not treat available production data as the complete evaluation scope. Frequent, low-risk situations can crowd out rare and consequential ones.

Use manual cases when exact control matters. Have product or domain experts review cases that depend on specialized rules.

Use synthetic generation to fill a named gap, not to create volume. Give the generator the relevant product scope, case profile, and visible context. Ask it to generate user behavior, not ideal product responses. Review generated cases for realism, duplication, unsupported assumptions, and drift from the target situation.

The source of a case should remain recorded. A synthetic case does not show how often its situation occurs in real use.

## Build sets for a stated purpose


One set should not silently be used for every purpose.

| Set or sample | Main purpose |
| --- | --- |
| **Exploratory set** | Expose behavior, boundaries, and possible failure patterns |
| **Comparison set** | Compare candidates under shared conditions |
| **Regression set** | Check that a known failure does not return and that required behavior remains |
| **Commitment or release set** | Produce evidence about the behavior and conditions covered by a proposed or active production commitment when the cases are run |
| **Production sample** | Describe observed live behavior for a defined population and period |
| **Challenge set** | Examine difficult, rare, adversarial, or high-consequence situations |

These sets may share cases. Their results still have different meanings. A challenge set should not be used to estimate a production failure rate. A production-weighted sample should not be expected to cover every critical boundary.

## Decide where the set needs more coverage


A useful case set usually contains several forms of coverage:

- **Baseline cases** examine the main behavior under clear and feasible conditions.
- **Variation cases** change one or more conditions that may affect behavior.
- **Critical cases** examine high-consequence failures and required boundaries.
- **Regression cases** preserve previously observed failures or obligations.

Allocate cases according to:

- the importance of the behavior;
- the consequence of failure;
- uncertainty about current behavior;
- the amount of meaningful variation;
- the decision and commitment under consideration;
- the evidence already available;
- the cost of obtaining more evidence.

Production frequency is relevant when the question concerns typical use. It is not the only basis for allocation. Rare cases may need deliberate coverage when their consequences are serious.

Balance does not mean giving every job, dimension, or group the same number of cases. It means choosing the mix for a stated reason and making sure no important part of the question is hidden.

## Review the set before execution


For each case, ask:

- Which question, claim, or coverage requirement does it support?
- Is the situation realistic and within the intended scope?
- Are the input, fixtures, and execution conditions consistent?
- Can the relevant behavior be observed?
- Could executing the case provide evidence that a nearby case would not?
- Is its source and purpose recorded?
- Does it depend on an unsupported product assumption?

For the set as a whole, ask:

- Are the important baseline situations represented?
- Are meaningful variations and interactions represented?
- Are high-consequence failures and required conditions represented?
- Are known failures and regressions preserved?
- Does one common, low-risk path dominate without a reason?
- Are there duplicates that are unlikely to provide new evidence when executed?
- Are similar-looking cases retained when they exercise different state, permissions, tools, or risks?
- Are the remaining gaps explicit?

There is no universal target number of cases. A set is ready to run when it represents the areas required by the current question and makes its important gaps clear. Whether the resulting evidence is sufficient can be decided only after the cases are run and reviewed. A larger set is not automatically better.

## Execute, inspect, and revise


Run each case against an identified system and environment configuration. Capture the evidence needed for the evaluation question. If required evidence is missing, record the execution as not judgeable for that criterion rather than treating it as successful.

Review the results at both levels:

- the behavior observed in individual executions;
- the coverage and variation represented by the set or sample.

Revise coverage when evidence reveals:

- a new user situation;
- an important behavior not represented by the current cases;
- a failure pattern that needs targeted cases;
- an unsupported or unrealistic case;
- outdated fixtures or system assumptions;
- a changed behavior claim or production commitment;
- a change in the production population or operating conditions.

Version the case set, fixtures, criteria, and sampling definition. Keep results linked to the versions that produced them.

## Limits


Coverage design reduces uncertainty. It does not prove that the product will behave correctly in every situation.

In particular:

- a fixed case set covers only selected situations;
- repeated tuning can overfit the product to known cases;
- a production sample supports only conclusions justified by its sampling method;
- generated cases do not establish real-world frequency or value;
- passing behavior checks does not prove that users can complete the work, choose the product, change the target condition, or produce the wider result;
- missing evidence does not count as successful behavior;
- a coverage map is not a product-quality score.

State these limits with the evaluation finding.
