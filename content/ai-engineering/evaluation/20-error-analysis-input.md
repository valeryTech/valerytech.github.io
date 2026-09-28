---
draft: false
toc: true
title: "20 Error Analysis Input"
linkTitle: "20 Error Analysis Input"
---
# Failure Understanding: Discovering and Structuring How AI Products Fail

## Purpose


AI products can fail at many points: understanding the request, using context, choosing or calling a tool, changing state, or producing the final response. Looking only at the final answer can hide the first failure and its later effects.

**Failure understanding** is a method for learning from these failures. It turns concrete incidents into a product-specific account of recurring failure patterns.

The main result is a **failure model**. It describes:

- the kinds of failure the team has found;
- how those failures differ;
- where and how they vary;
- their observed conditions and consequences;
- the evidence that supports the model;
- the questions that remain open.

The method draws on initial coding, focused coding, constant comparison, theoretical sampling, and saturation reasoning. These ideas are used as practical tools for product and engineering work.

The [Evidence Model]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}) defines the concepts used here. The main path is:

```text
trace + observation + evaluation basis
    → failure incident
    → initial and focused codes
    → failure category
    → failure taxonomy
    → failure model
```


Some failures are later prepared for repeated evaluation:

```text
failure category, requirement, or risk
    → operational failure mode
    → criterion
    → evaluator
    → label and measurement
```


Questions about cause follow a separate path:

```text
failure incident or pattern
    → cause hypothesis
    → diagnostic investigation
    → established root cause
```


These paths are connected, but they do not have to happen together. A useful category may never become a metric. A critical requirement may become an operational failure mode before the failure is observed. A failure can be understood well enough to act on before its cause is established.

## Part I. Collect the Evidence

### 1. Define the question and scope


Start with the question the analysis should help answer. For example:

- Which failures stop users from completing this job?
- What could make this workflow unsafe to release?
- What changed after a model, prompt, or tool update?
- Which production incidents belong to the same pattern?

State which product behavior, users, workflows, and system versions are in scope.

Failure judgments also need an **evaluation basis**: a product rule, behavior claim, case expectation, domain requirement, policy, or production commitment. It explains why the behavior is unacceptable.

If that basis is missing or unclear, record the behavior as an observation and an open question. Do not silently invent the intended product behavior.

### 2. Build a discovery sample


Choose cases that expose a useful range of behavior. They may come from:

- designed test cases;
- production traces;
- reported incidents or support cases;
- earlier evaluations;
- successful cases that can be compared with failures.

Include relevant variation such as user context, workflow stage, tool, permission, language, environment, ambiguity, and boundary conditions.

The first sample is for discovery. It may deliberately contain many difficult or high-risk cases. Its failure rate therefore does not represent production unless the sampling method was designed for that purpose.

There is no fixed number of cases. Start with enough variation to compare incidents, then choose further cases based on what the analysis needs to clarify.

### 3. Run the product and capture useful traces


Run the cases against a known product and environment configuration, or retrieve the selected production executions.

For agentic products, a useful trace may include:

- the input, conversation, and relevant initial state;
- user permissions, preferences, and constraints;
- available tools and information;
- model, retrieval, and tool requests and results;
- messages shown to the user;
- actions and state changes;
- confirmation and recovery steps;
- final outputs and downstream results;
- system, model, prompt, tool, and data versions.

A trace is always a limited record of an execution. Define what the evaluation needs to capture, and record when evidence is missing.

A completed execution can still be impossible to judge. If important evidence is absent, improve the capture and rerun suitable cases where possible.

### 4. Record observations and failure incidents


An **observation** states what the trace shows:

> At step 3, the product called the transfer tool. The recorded interaction contains no confirmation request before the call.

A **failure incident** adds a judgment under an evaluation basis:

> The transfer violated the product rule requiring confirmation before execution.

Link each incident to the trace evidence and the expectation it violated. Keep any uncertainty visible.

One execution may contain several incidents. During an initial review, it can help to record the **first observable failure**: the earliest point where the trace contains enough evidence to show that the behavior became wrong. This can separate an early problem from its downstream effects.

The first observable failure is not necessarily the root cause. It only identifies the first failure the available evidence can establish.

## Part II. Develop the Failure Model

### The analytical loop


The core method is constant comparison:

```text
describe an incident
    → propose a pattern
    → compare it with other failures and successes
    → look for evidence that challenges it
    → revise the pattern
    → choose cases that test it
    → compare again
```


The analyst repeatedly does a few things:

- stays close to the observed behavior;
- looks for common patterns;
- splits patterns that hide important differences;
- merges distinctions that the evidence does not support;
- uses successful and near-miss cases to test boundaries;
- records why important analytical decisions were made.

The work moves from concrete incidents toward more general concepts, then returns to the incidents to test those concepts.

### 5. Create initial codes


Give each incident a short, concrete description:

```text
omitting the replacement preference
promising a carrier-unavailable date
asserting an unsupported property feature
executing an action without user authorization
```


Broad terms such as `hallucination`, `irrelevance`, or `poor reasoning` can help reviewers notice a possible problem. The code itself should describe what happened in this product.

Keep every code linked to its incident and trace evidence. An unresolved observation can also be coded, but it should remain clearly marked as unresolved until there is a basis for judging it as a failure.

At this stage, do not force every incident into the existing taxonomy. The review may reveal behavior that earlier evaluation did not anticipate.

### 6. Develop focused codes


Compare the initial codes and combine those that appear to describe the same broader pattern.

For example:

```text
omitting the buyer's budget
omitting the pet requirement
omitting the replacement preference
```


may support:

```text
losing user-stated constraints
```


Test each focused code against its incidents. Ask whether it fits all of them, hides an important difference, or excludes cases that appear to belong.

Recurrence is one reason to select a focused code. Severity, product impact, and violation of an important guarantee also matter. Keep low-frequency and unresolved codes because later evidence may make them important.

An LLM can suggest groups or possible splits, especially when there are many codes. Treat those suggestions as working ideas and check them against the traces, product rules, domain knowledge, and alternative interpretations.

### 7. Develop failure categories


A **failure category** describes a recurring pattern of unacceptable behavior and the boundary that separates it from nearby patterns.

Compare incidents, codes, proposed categories, successful cases, near misses, and ambiguous cases. For each proposed category, ask:

- What behavior do these incidents share?
- Why is each incident a failure?
- Does the definition fit every included incident?
- Which differences should remain as properties or become separate categories?
- Which similar cases should fall outside the category?
- What evidence would challenge this grouping?

For example:

```text
losing user-stated constraints
contradicting tool-returned constraints
```


may support the category:

```text
constraint-handling failure
```


A broad code may also need to be split. For example:

```text
fabricating information
```


may hide a useful distinction between:

```text
unsupported external-state claim
unsupported user-intent attribution
```


The first concerns the world or application state. The second attributes a request, preference, decision, or authorization to the user without enough evidence.

Categories should have clear meanings. They may overlap in one execution or form a hierarchy. They do not need to be mutually exclusive or binary.

One serious incident can justify action or a direct operational check. It suggests a provisional category, while a claim about a recurring pattern needs comparison with other cases.

For each category, keep a concise record of:

- its name and meaning;
- the incidents that support it;
- examples that show its boundary;
- important variation and consequences;
- contradictory or ambiguous evidence;
- remaining questions.

### 8. Build the taxonomy and failure model


A **failure taxonomy** organizes the categories. It records their names, distinctions, and hierarchy where a hierarchy is useful.

A **failure model** is richer than the taxonomy. It also keeps what the evidence shows about variation, conditions, relationships, consequences, and uncertainty.

```text
failure taxonomy
    + variation
    + observed conditions
    + relationships
    + consequences
    + supporting and contrary evidence
    + open questions
    = failure model
```


Do not force the taxonomy to be exhaustive, flat, or non-overlapping. State which product scope and evidence it covers.

Observed sequence and association may be included in the model. They do not by themselves show that one failure caused another.

When a category is added, split, merged, or renamed, record why and revisit the affected incidents. Keep the model open to revision as the product and evidence change.

### 9. Select more cases and decide when to stop


Once categories emerge, choose new cases that answer specific questions. This is **theoretical sampling**.

Useful cases may:

- test a category boundary;
- distinguish two possible categories;
- provide a successful comparison under similar conditions;
- expose variation within a category;
- challenge a proposed relationship;
- cover an important situation missing from the current sample.

Continue until deliberately chosen additional cases stop materially changing the important categories, boundaries, or relationships for the current scope.

There is no reliable fixed trace count or number of coding rounds. State what the model covers and which important gaps remain. A model can be useful for a decision while still being incomplete.

### 10. Keep cause hypotheses separate


The analysis may suggest why a failure occurred. Record this as a **cause hypothesis**, along with alternative explanations and the evidence that could distinguish them.

An earlier event in a trace can precede a later failure without causing it. Repeated association also does not establish the mechanism.

A **root cause** needs additional diagnostic evidence. This may require reproduction, implementation inspection, better instrumentation, or a separate experiment.

The team can still act on clear behavior evidence when the decision does not require an established cause. Keep the uncertainty about cause explicit.

## Part III. Operationalize and Measure Selected Failures

### 11. Select operational failure modes


Choose failures for repeated assessment when they support a concrete product or engineering decision. Common reasons include protecting an important product rule, measuring a recurring problem, checking a regression, comparing versions, or monitoring a serious risk.

An **operational failure mode** is a precise failure behavior selected for repeated assessment. It can come from:

- a supported failure category;
- an explicit requirement;
- an anticipated risk grounded in an evaluation basis.

Link the mode to its source. If it covers only part of a broader category, say so. An anticipated mode does not imply that the failure has occurred or that its frequency is known.

### 12. Define the criterion and evaluator


For each operational mode, define:

- the behavior being checked;
- the unit, such as a trace, turn, message, tool call, or action;
- when the mode applies;
- the evidence needed;
- the rule for assigning `PRESENT` or `ABSENT`;
- examples near the boundary.

Use `NOT APPLICABLE` when the mode does not apply to the unit. Use `NOT JUDGEABLE` when it applies but the available evidence cannot support a judgment.

The **criterion** is the decision rule. The **evaluator** is the person, method, or tool that applies it. Pilot the criterion, review disagreements, and validate automated evaluators to the level required by the decision they support.

Operationalization may reveal that a category is too broad for one repeatable check. A narrower operational mode is acceptable when its link to the category and its reduced scope are clear.

### 13. Label and interpret the results


Apply the criteria and link each label to its supporting evidence. One trace may contain several operational failure modes.

Choose the labeling approach for the question:

- first-failure labeling for common upstream problems;
- exhaustive labeling when every occurrence matters;
- targeted labeling for selected modes and relevant units.

Report counts with the relevant denominator and describe the analyzed cases or production sample. Keep occurrence separate from consequence: a low-frequency failure may still be severe.

A discovery or challenge set can reveal a failure without estimating its production rate. Production estimates require a sample that supports that conclusion.

The result should answer the original question and state its scope and limits. A measured failure mode does not establish its root cause.

### 14. Improve and re-evaluate


Use the findings and traces to guide product changes. After a change, rerun comparable cases and apply the same criteria when a direct comparison is intended.

New or poorly fitting incidents reopen the analytical work. Return to coding, revise the categories and failure model, and update related operational modes when their meaning changes.

Keep links between:

```text
trace → incident → codes → category → failure model
```


and, where repeated evaluation is used:

```text
category or requirement → operational mode → criterion → label → finding
```


These links make it possible to understand and revise the analysis when the evidence or product changes.

## Short action sequence


1. Define the question, scope, and evaluation basis.
2. Select varied cases and capture the evidence needed to review them.
3. Record evidence-linked observations and failure incidents.
4. Create initial codes and develop focused codes through comparison.
5. Develop categories and test their boundaries with failures, successes, and near misses.
6. Organize the categories into a taxonomy and add supported context to form the failure model.
7. Select more cases until they stop materially changing the important analysis for the stated scope.
8. Keep causal explanations as hypotheses until diagnostic evidence supports them.
9. Turn selected categories, requirements, or risks into operational failure modes.
10. Label, measure, interpret, improve, and reopen the model when new evidence appears.

## Related documents


- [Evidence Model]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}) defines the evidence, failure, operational, and diagnostic concepts.
- [Conceptual Model]({{< ref "ai-engineering/evaluation/v1/conceptualization" >}}) explains how failure knowledge supports evaluation and product work.
- [Evaluation Cases]({{< ref "ai-engineering/evaluation/v1/10-user-inputs" >}}) covers case and coverage design.
- [Judgment and Findings]({{< ref "ai-engineering/evaluation/v1/30-judgment-and-findings" >}}) covers criteria, evaluators, labels, measurements, and findings.
- [Production Learning]({{< ref "ai-engineering/evaluation/v1/production-learning" >}}) explains how evidence from real use returns to product and evaluation work.
