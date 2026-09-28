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

## Failure knowledge and diagnosis


The durable concepts form three related paths:

```text
trace + observation + evaluation basis
    → failure incident
    → comparison across incidents
    → failure category
    → organized failure taxonomy
    → failure model with properties, variation, and supported relationships

failure category, or an explicit requirement or risk
    → select behavior for repeated assessment
    → operational failure mode → criterion → evaluator → label

failure incident or pattern
    → cause hypothesis → diagnostic investigation → established root cause
```


These arrows describe possible uses of evidence, not mandatory stages for every evaluation. An anticipated risk may be operationalized before any incident has been observed. A category may remain useful without becoming an operational mode. An incident can be recorded before anyone knows what caused it.

### Failure incident


A **failure incident** is a concrete, evidence-linked instance of behavior judged unacceptable in one execution under a stated evaluation basis. Record the behavior and its location in the trace, the applicable expectation, and the evidence supporting the judgment. One execution may contain several incidents.

An observation that appears concerning but cannot yet be judged remains an observation and an open question. It should not acquire a failure label solely because it was unexpected.

For an initial whole-case review, it may be useful to record the **first observable failure**: the earliest point at which the trace contains enough evidence to establish a violation. This is a review aid, not a requirement to ignore later failures.

### Failure category


A **failure category** is a reusable analytical description of a pattern of unacceptable behavior. It is developed and tested by comparing incidents, including cases that challenge a proposed grouping. It describes what the failures have in common and the boundary that distinguishes them from nearby patterns.

A first-failure note is not yet a supported category. One incident may suggest a provisional category, but a claim that the pattern recurs needs comparative evidence. A category should link to supporting incidents, examples at its boundary, and unresolved or contradictory cases. Its definition may also record relevant variation and consequences without claiming to know their cause.

Categories should be distinguishable in meaning. They may overlap in an execution or form a hierarchy; a single incident can inform more than one category when the evidence supports it.

### Failure taxonomy


A **failure taxonomy** organizes failure categories for a particular product and scope. It records their names, definitions, distinctions, and grouping or hierarchy where useful. It answers which kinds of failure the team has identified and how they are classified.

The taxonomy need not be exhaustive or mutually exclusive. Its coverage and boundaries depend on the situations examined. New incidents can require a category to be added, split, merged, or redefined. Preserve those revisions and the affected evidence links.

### Failure model


A **failure model** is the broader, evidence-linked account of how a product fails. It includes the taxonomy and, where supported, the categories' properties and variation, observed conditions, relationships between failures, consequences, boundaries, and supporting or contradictory evidence.

The taxonomy classifies patterns; the model records what has been learned about them. A model may be useful while incomplete. It should distinguish observed sequences and associations from proposed causal explanations. A category, taxonomy, or model does not by itself establish a root cause or a production failure rate.

### Operational failure mode


An **operational failure mode** is a precisely specified failure behavior selected for repeated assessment. It may be derived from a supported failure category or directly from an explicit requirement or anticipated risk grounded in an evaluation basis. It is an operational evaluation object, whether or not a corresponding category has been developed. An anticipated mode does not imply that an incident has occurred or that the behavior has a measured frequency.

The mode identifies the behavior, unit of assessment, applicability, and evidence needed. A linked **criterion** supplies the decision rule for **PRESENT** or **ABSENT**. **NOT APPLICABLE** means the mode does not apply to the assessed unit; **NOT JUDGEABLE** means it applies but the available evidence cannot support the judgment. The criterion and evaluator should be versioned when judgments are repeated.

Selection for repeated assessment does not convert every analytical category into a binary label. State how the mode relates to its source category, especially if it covers only a narrower observable part. Modes need not be mutually exclusive: each poses a separate question, and one execution may have several **PRESENT** labels.

### Cause hypothesis


A **cause hypothesis** is a proposed mechanism or condition that might explain an incident or recurring pattern. It should name what evidence would support it, what alternatives remain, and, where possible, what observation or experiment would distinguish them.

A trace may suggest a hypothesis, including when one visible mistake precedes another. Sequence or association alone does not establish that the earlier event caused the later one. Hypotheses belong to diagnosis, not to the definition of a failure category or the result of an operational failure-mode check.

### Root cause


A **root cause** is a mechanism or condition established by sufficient diagnostic evidence as explaining why an incident or pattern occurred. The scope of that explanation should be stated; several contributing conditions may be involved, and evidence for one incident need not generalize to every member of a category.

Establishing a cause may require reproduction, implementation inspection, diagnostic data, intervention, or a separate experiment. Finding the first observable failure locates a point of demonstrated wrong behavior; it does not identify the underlying mechanism.

### Analytical working artifacts


The method in [Failure Understanding]({{< ref "ai-engineering/evaluation/v1/20-error-analysis" >}}) may use **initial codes** and **focused codes** to move from concrete incidents to categories. Reviewers may also code a relevant observation before they can judge it; only behavior established as failure under a basis supports a failure category. Codes are revisable working artifacts, not additional durable levels between incident and category in the general evidence model. Preserve their links to the source evidence when they support an important category decision.

### Properties and status


Record the workflow stage, affected expectation, consequence, severity, or first-observable position as properties of an incident or category when useful. They are not additional levels in the failure-concept chain. State whether a category is provisional or supported by comparison, whether an operational mode was derived from observed incidents or specified in anticipation, and whether a causal account remains a hypothesis or has diagnostic support. These statuses can change as evidence accumulates.

### Example of the boundaries


Suppose a transfer tool is called before the user confirms the transfer, and a product rule requires confirmation first:

| Concept | What it records in this example |
| --- | --- |
| Observation | The trace shows the tool call at step 3 and no preceding confirmation in the captured interaction. |
| Failure incident | The step 3 action violates the stated confirmation rule in this execution, assuming the capture supports that judgment. |
| Failure category | After comparison with other incidents, **action before required confirmation** describes a recurring pattern and its boundary. |
| Failure taxonomy | The category may be grouped with other authorization or confirmation failures. |
| Failure model | The category, observed variations and consequences, contrast cases, and supported relationships are retained together. |
| Operational failure mode and criterion | The selected mode targets a transfer initiated before confirmation; its criterion specifies the required evidence and rule for assigning `PRESENT` or `ABSENT` to a defined unit. |
| Cause hypothesis | A proposed explanation, such as a routing step that did not enforce confirmation, remains open until diagnostic evidence tests it. |

The observed tool call and the rule can establish an incident. Comparable evidence is needed to support a recurring category; independent diagnostic work is needed to establish the proposed cause.

## Reusable parts of evaluation


Failure incidents, categories, the taxonomy, and the failure model preserve analytical knowledge even when no measurement is planned. When a judgment will be repeated, preserve the appropriate operational parts:

| Artifact | Meaning |
| --- | --- |
| Operational failure mode | One precise failure behavior selected for repeated assessment |
| Criterion | A decision rule that applies an evaluation basis to evidence for the stated unit; for an operational mode, it defines how the mode is judged |
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

For analytical work, retain the path from source traces and incident judgments through category membership and revisions of the taxonomy or failure model. For operational assessment, retain the source and version of the mode and its criterion. For diagnosis, retain the hypotheses, tests, alternatives, and evidence behind any root-cause claim. These paths can be followed separately; they should not be collapsed into the single linear chain above.

## Core distinctions


| Question | Object that answers it | Boundary to preserve |
| --- | --- | --- |
| What situation was specified? | Case or sample definition | An execution is one occurrence under particular versions and conditions. |
| What actually happened? | Trajectory | A trace captures only the available part of that trajectory; an observation states something supported by that trace. |
| Was the required evidence recorded? | Capture status | Judgeability also depends on the particular criterion and basis. |
| Was the observed behavior acceptable? | Judgment under an evaluation basis | A failure incident is a concrete judged instance; a verdict on a case does not define a recurring category. |
| What recurring patterns have we found? | Failure categories, organized in a taxonomy and enriched in a failure model | This analytical knowledge can remain useful without an operational check or a proven cause. |
| Can a selected behavior be checked repeatedly? | Operational failure mode, criterion, and evaluator | The mode specifies the target behavior; the criterion states the rule; the evaluator applies it and produces a result. |
| Why did it happen? | Cause hypothesis followed by a supported root-cause account | An observed sequence or recurring category alone cannot establish the mechanism. |
| What does the evidence mean for the question? | Finding | Measurements and evaluator results are inputs; responsible people make the decision. |

These boundaries keep the strength and limits of evaluation evidence visible.
