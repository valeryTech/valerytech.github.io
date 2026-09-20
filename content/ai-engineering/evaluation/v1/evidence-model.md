---
draft: false
toc: true
title: "Evidence Model"
linkTitle: "Evidence Model"
---
# Evidence Model for AI Evaluation

## Purpose


This document defines the main objects used in AI evaluation and the claims that can be made from them.

> **Evaluation shows us how the product actually behaves in defined situations, so teams can make better product decisions.**

It is not a delivery process. The same objects can be used while exploring a possible solution, building and operating a production solution, or reviewing live behavior.

The central distinction is simple:

> **An execution is one time the product runs. Its trajectory is everything that happens during that run. A trace is the information recorded about it, and may not include everything. Evaluation uses that record to understand the behavior and, when a clear rule exists, judge it.**

A useful high-level relationship is:

```text
Decision or uncertainty
        ↓
Evaluation basis
        ↓
Case or production sample
        ↓
Execution and actual trajectory
        ↓ capture
Trace and observations
        ↓ judgment
Judgments and labels
        ↓ interpretation
Measurements, comparisons, and findings
        ↓
Decision or next action
```


This shows dependencies between the objects. It does not require the work to happen once or in this order. New evidence may change the claim, case, capture, criterion, evaluator, or decision.

## Decision or uncertainty


Evaluation begins with a question that matters to a decision. Examples include:

- whether a proposed behavior appears possible;
- whether one candidate behaves better than another;
- whether the evidence supports a production commitment;
- whether a change preserves committed behavior;
- whether a rollout should continue;
- whether live behavior requires delivery work or renewed discovery.

The question determines which evidence is useful. Evidence gathered for one question may not support another conclusion.

## Bounded behavior claim


A **behavior claim** states what the product is expected to do, for whom, and in which situations.

It should identify:

- the users or systems concerned;
- the situations in which the claim applies;
- the expected behavior;
- important limits and failure behavior;
- the conditions under which the behavior is expected.

During discovery, a claim may be provisional and open to change. When a team is considering or has made a [production commitment]({{< ref "ai/operating-model/production-commitment" >}}), the claim should reflect the behavior and scope for which the team may accept or has accepted responsibility.

A production commitment is not a state of the claim. It is a decision that combines a behavior promise with limits, required conditions, operating obligations, remaining assumptions, and accepted uncertainty.

A claim is not evidence that the behavior occurs. It provides a basis for deciding what to examine and, when appropriate, how to judge the result.

## Evaluation case


An **evaluation case** defines a bounded situation in which product behavior can be exercised.

A case may specify:

- an input or interaction;
- initial conditions and fixtures;
- participant behavior;
- relevant system and environment conditions;
- the product expectations that apply;
- identifiers and coverage information.

A case is a specification. It is not an execution, a trace, or evidence that the product behaved in a particular way.

Some cases contain a fixed sequence of actions. Others contain an adaptive participant whose next action depends on what the participant can observe. In either form, the case should make clear which behavior is fixed and which behavior may vary.

## Production sample


A **production sample** is a selected group of live executions that a team examines.

It should state which users or other group and time period the runs come from, how the runs were selected, and any conditions that matter. A sample meant to reflect typical live use, a sample of unusual behavior, and a sample of high-risk actions support different conclusions.

Designed cases and production samples answer different questions. Running a case shows behavior under the test conditions chosen for that case. Reviewing the runs in a production sample shows behavior only for the users, time period, and selection method it covers.

The sample definition is not the evidence itself. The captured traces for the selected executions provide the evidence.

## Execution


An **execution** is one run of a case or one occurrence in live use.

It happens against identified product, system, model, configuration, environment, and data versions. Repeating the same case may produce different executions.

Execution status describes what happened mechanically. Examples include:

- completed;
- interrupted;
- aborted;
- timed out.

Execution status does not show whether the behavior was acceptable or whether enough evidence was captured to judge it.

## Trajectory


The **trajectory** is the actual sequence of behavior and state changes during an execution.

It includes what happened in the product, its environment, and the interaction. Some parts may be hidden or unavailable to the evaluation subsystem.

The trajectory is a concept about reality. It is not assumed to be a stored object, and it cannot usually be reconstructed in full.

## Trace


A **trace** is evidence captured about an execution and tied to that execution.

Depending on the question, it may include:

- the case or sample source;
- inputs and initial observations;
- participant-visible responses;
- model, retrieval, and tool activity;
- recorded state observations;
- final outputs or actions;
- linked downstream results;
- system and evaluation versions;
- time, source, and capture details.

A trace is limited by what the system records and what reviewers can access. It may omit behavior that occurred. It may also contain evidence visible to a reviewer but not to the user or participant.

Do not describe a trace as a complete account of the execution. If the term **capture complete** is used, it should mean only that all records required by a stated capture contract were obtained.

## Capture contract


A **capture contract** states which evidence the evaluation requires the subsystem to record.

It may require, for example:

- the input and initial state observations;
- all participant-visible responses;
- particular tool calls and results;
- specified state observations before and after an action;
- system, model, prompt, tool, and fixture versions;
- links to a later downstream result.

Meeting the capture contract does not guarantee that the trace is sufficient for every judgment. A later review may reveal that the contract omitted evidence needed for a particular criterion.

## Observation


An **observation** is a concrete statement supported by evidence in a trace.

For example:

> At step 3, the product called the transfer tool before showing a confirmation request.

An observation should identify its subject, point in the execution, source, and supporting trace evidence.

An observation is not a complete account of product state. It is a view obtained through a particular boundary at a particular time.

Unexpected behavior may be recorded as an observation before the team knows whether it is acceptable. Calling it a failure requires a basis for that judgment.

## Different views of the same execution


The participant, product, and evaluator may have access to different evidence.

For example, a user may see a confirmation message while the evaluator can also inspect a recorded database observation. An adaptive participant must act only on evidence available to that participant. Evidence available only to the evaluator must not silently change participant behavior.

The origin and visibility of evidence are therefore part of the trace.

## Evaluation basis


The **evaluation basis** is the stated reason for judging behavior in a particular way.

It may draw from:

- a provisional behavior claim;
- an active or proposed production commitment;
- case-specific expectations;
- product rules or invariants;
- safety, policy, or domain requirements;
- an approved comparison standard.

Evaluation should not silently invent product intent. If the basis is missing, ambiguous, or inconsistent, the result may be an open question rather than a pass or fail.

## Judgment


A **judgment** applies an evaluation basis to the available evidence and makes a claim about the behavior shown by an execution.

The behavior is the target of the judgment. The trace is the evidence used to make it.

A whole-case verdict may be:

```text
PASS
FAIL
NOT JUDGEABLE
```


Individual criteria may also allow `NOT APPLICABLE` when the criterion does not apply to the case.

`NOT JUDGEABLE` does not describe product behavior. It means that the available evidence cannot support the required judgment.

## Keep execution, capture, and judgment separate


Keep these properties separate:

| Property | Question |
| --- | --- |
| Execution status | Did the execution complete, stop, or fail mechanically? |
| Capture status | Did the subsystem record the evidence required by the capture contract? |
| Judgeability | Is the available evidence sufficient for this judgment? |
| Behavioral judgment | When judgeable, was the behavior acceptable under the stated basis? |

For example, an execution may complete and satisfy its capture contract but still be not judgeable because the criterion requires evidence that the capture contract did not request.

## Failure incident, failure category, operational failure mode, and root cause


These concepts answer different questions.

### Failure incident


A **failure incident** is a concrete, evidence-linked instance of unacceptable behavior in one execution.

For an initial whole-case review, it may be useful to record the **first observable failure**: the earliest point at which the trace contains enough evidence to establish a violation. This is a review aid, not a requirement to ignore later failures.

### Failure category


A **failure category** is a reusable analytical description of a pattern of failure. It is usually developed and tested by comparing incidents across executions.

A first-failure note is not yet a well-supported category. One incident or a known risk may suggest a provisional category, but comparison with other cases is needed before treating it as a general pattern. The category should have a clear boundary and examples that show where it applies and does not apply.

Failure categories may overlap or form a hierarchy.

### Operational failure mode


An **operational failure mode** is one precise failure behavior selected for repeated assessment. It may come from a supported failure category, a known criterion, or an anticipated risk grounded in an explicit evaluation basis. A risk can suggest a mode, but it does not by itself establish that the behavior is unacceptable.

Its specification defines the unit, applicability, required evidence, and the criteria for deciding whether the failure is **PRESENT** or **ABSENT**. **NOT APPLICABLE** and **NOT JUDGEABLE** remain separate control states.

Operational modes do not have to be mutually exclusive. Each mode is applied as a separate question, so one execution may have several **PRESENT** labels.

### Root cause


A **root cause** is a mechanism or condition that explains why the failure occurred.

A trace may show where behavior first became demonstrably wrong without showing its cause. Root-cause analysis may require reproduction, implementation inspection, diagnostic data, or a separate experiment.

## Reusable parts of evaluation


When a judgment will be repeated, preserve these parts:

| Artifact | Meaning |
| --- | --- |
| Operational failure mode | One precise failure behavior selected for repeated assessment |
| Criterion | A rule used to judge one part of behavior |
| Evaluator | A person, method, or tool that uses a criterion to judge evidence |
| Raw evaluator result | The direct output produced by one evaluator run |
| Label | A recorded judgment or evaluator result for a stated unit and criterion, linked to the operational mode when applicable, with its evidence source, provenance, and review status |
| Measurement | A summary of labels or observations over a defined set or sample |
| Comparison | A stated difference between systems, versions, groups, or periods under defined conditions |
| Finding | An interpretation of evidence for a named question, including its scope and limits |
| Decision rule | An approved rule that connects a result to a warning, review, gate, or control |

These artifacts are explained in [Judgment and Findings]({{< ref "ai-engineering/evaluation/v1/30-judgment-and-findings" >}}).

## Finding and decision


A **finding** states what the available evidence supports. It should include the scope, important variation, evidence limits, evaluator limits, and remaining uncertainty.

A **decision** states what people responsible for the product choose to do with that finding and any other relevant evidence.

A finding does not make the decision. It also does not establish a root cause merely because it shows a mismatch.

## Traceability


An important finding should preserve enough links to answer:

- What question was being answered?
- Which evaluation basis and version applied, including any behavior claim, production commitment, or product rule?
- Which situations were represented?
- Which product and system versions produced the behavior?
- Which evidence was captured, and under which capture contract?
- Which operational mode, criterion, and evaluator versions were used?
- How were labels, measurements, and comparisons produced?
- What limits and uncertainty remained?
- Which decision followed?

A useful traceability chain is:

```text
Decision or uncertainty
        ↓
Assumption or obligation being examined,
and consequence if false, when relevant
        ↓
Evaluation basis and version
        ↓
Coverage reason
        ↓
Case or production sample
        ↓
System configuration and execution
        ↓
Capture contract, trace, and observations
        ↓
Operational failure mode when applicable,
criterion, and required evidence
        ↓
Evaluator and evaluator result
        ↓
Label with provenance and review status
        ↓
Measurement or comparison
        ↓
Finding
        ↓
Decision
```


Not every evaluation needs every artifact. Preserve the links required to understand and reconsider the finding.

## Core distinctions

```text
case is not execution

execution is not trajectory

trajectory is not trace

trace is not a complete record of the execution

state is not observation

capture completion is not judgeability

judgeability is not correctness

observation is not judgment

verdict is not failure category

failure category is not operational failure mode

operational failure mode is not root cause

operational failure mode is not criterion

operational failure mode is not evaluator

criterion is not evaluator

evaluator result is not finding

measurement is not decision
```


Preserving these distinctions keeps the strength and limits of evaluation evidence visible.
