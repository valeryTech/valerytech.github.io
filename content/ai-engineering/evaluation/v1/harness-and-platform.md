---
draft: false
toc: true
title: "Evaluation Harness and Workspace"
linkTitle: "Evaluation Harness and Workspace"
---

An evaluation harness provides controlled execution and evidence capture for an AI system. A wider evaluation workspace helps people organize, inspect, judge, compare, and use that evidence.

These are two different sets of work. They do not have to be built as two separate products.

## Evaluation harness


The harness answers:

> What happened when this identified system ran this case under these conditions?

It should be able to:

- load a case and its fixtures;
- identify the product, model, prompt, tools, policies, and configuration being run;
- execute fixed or interactive cases;
- isolate live effects when the evaluation is meant to be offline;
- capture evidence that can be tied to the execution;
- run selected evaluators;
- save the run, trace, outcomes, and metadata;
- repeat or replay the case when the required conditions allow it.

The harness does not own the release decision. It may apply an approved rule or gate, but the people responsible for the product define that rule and remain responsible for the decision.

## Wider evaluation workspace


The workspace answers:

> What does the evidence show, how does it differ across situations or versions, and what are its limits?

It may provide:

- case, dataset, and sample management;
- run history;
- system and evaluator version tracking;
- trace inspection;
- human review and resolution of disagreements;
- search and failure grouping;
- baseline and candidate comparison;
- regression analysis;
- reports linked to underlying evidence;
- release and production integrations;
- production sampling and monitoring.

A small team may begin with scripts, stored traces, and a simple review interface. A shared service becomes useful when several teams need consistent execution, clear records of where evidence came from, access controls, comparisons, or shared review.

## What the harness must preserve


For each run, preserve enough context to understand which execution produced the evidence:

- case and fixture versions;
- initial input and state;
- product and system versions;
- model, prompt, tool, and policy configuration;
- relevant intermediate actions and results;
- final output or action;
- downstream result, when available;
- evaluator versions and judgments;
- execution status and missing evidence.

A saved trace is evidence about the execution. It is not a complete copy of everything that happened. Capture requirements depend on the question being answered.

## Comparison and repeatability


The harness makes comparison more credible by holding relevant conditions steady and recording those that cannot be controlled.

Useful comparisons include:

- candidate against current production baseline;
- two solution approaches on shared cases;
- the same version across repeated runs;
- a new model or prompt against known regression cases;
- offline results against selected production behavior.

Exact reproduction may be impossible when external services, changing data, time, or nondeterministic components affect the run. The harness should record these differences instead of hiding them.

## Coding-agent evaluation


For a coding agent, the final message is only one part of the behavior. The evaluation may need to examine:

- whether the requested change was completed;
- correctness and regression risk;
- repository and task constraints;
- files inspected and changed;
- commands and tools used;
- test selection and results;
- handling of failed commands or incomplete context;
- unnecessary or repeated work;
- destructive actions, secrets, and production risk;
- latency and cost;
- the accuracy of the final explanation.

A case may include a repository state, task, available tools, environment, and acceptance checks. The trace should preserve the actions and state changes needed for the evaluation question.

## Relation to the evaluation subsystem


The harness and workspace are parts of the wider [evaluation subsystem]({{< ref "ai-engineering/evaluation/v1/evaluation-subsystem" >}}). They run systems and preserve evidence, but they do not define the evaluation basis or make the product decision.

Case design is covered in [Coverage and Case Design]({{< ref "ai-engineering/evaluation/v1/coverage-and-case-design" >}}). Evidence and judgment terms are defined in [Evidence Model]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}) and [Judgment and Findings]({{< ref "ai-engineering/evaluation/v1/30-judgment-and-findings" >}}).
