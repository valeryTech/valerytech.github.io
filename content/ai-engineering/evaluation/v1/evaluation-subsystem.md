---
draft: false
toc: true
title: "Evaluation Subsystem"
linkTitle: "Evaluation Subsystem"
---
## Purpose


The evaluation subsystem is the people, practices, data, and software used to produce, inspect, judge, compare, and preserve evidence about AI product behavior.

It includes people and operating practices as well as software. A script that runs prompts is not a complete subsystem. Neither is a dashboard that shows scores without the cases, evidence, criteria, and limits behind them.

Its main goal is:

> Produce credible evidence in time for the current question or decision, and preserve useful cases, criteria, and findings for later evaluations.

The [evaluation framework]({{< ref "ai-engineering/evaluation/v1/ai-evaluation-goals" >}}) defines what the evidence means. The subsystem makes the required evidence available.

## Responsibilities and limits


The subsystem should be able to:

- manage designed cases and production samples;
- run candidates under known conditions;
- observe selected production behavior;
- capture evidence that can be tied to each execution;
- support code-based, reference-based, model-based, and human judgment;
- compare situations, groups, candidates, and versions;
- preserve criteria, labels, measurements, findings, and their sources;
- detect regressions and newly observed failures;
- expose missing evidence and unreliable evaluation methods;
- provide results to discovery, delivery, release, and production decisions.

The subsystem does not choose product goals, decide what risk is acceptable, diagnose every root cause, or make a production commitment. Those decisions remain with the people responsible for the product.

## Evidence path


A minimal evidence path is:

```text
Question and decision context
        ↓
Evaluation basis and criterion, when needed
        ↓
Evidence need
        ↓
Case or production sample
        ↓
Identified system execution
        ↓
Captured trace and related outcome evidence
        ↓
Review or evaluator
        ↓
Judgment
        ↓
Measurement, comparison, and finding
        ↓
Product decision
```


Each step must remain linked to the others. A score without the evaluated sample and evaluator version is difficult to interpret. A trace without the system version cannot support a reliable comparison. A finding without the original question may be correct but irrelevant.

## Main capabilities

### Case and sample management


The subsystem should preserve:

- designed evaluation cases;
- fixtures and starting state;
- expected conditions or criteria, when known;
- challenge and regression cases;
- production-sample definitions;
- inclusion and exclusion rules;
- case, dataset, and sample versions;
- links from cases to the claims or risks they examine.

Designed cases and production samples answer different questions. Designed cases provide controlled coverage and comparison. Production samples show what happened within a stated population and period. Neither should be treated as universally representative.

### Execution and replay


The subsystem may need to:

- execute a case against an identified candidate;
- repeat a case to examine variable behavior;
- compare candidates under the same conditions;
- replay captured inputs against a new version;
- run a candidate without exposing it to users;
- limit or progressively increase live exposure.

Reproduction is useful, but exact repetition is not always possible. External services, changing data, model updates, time, and nondeterminism may change the execution. The subsystem should record these limits rather than promise perfect replay.

### Evidence capture


Capture the evidence required for the current question. Depending on the product, this may include:

- input and initial state;
- conversation or workflow history;
- retrieved data and context;
- model, prompt, policy, and configuration versions;
- tool calls and tool results;
- intermediate actions and state changes;
- final output or action;
- latency, cost, and operational signals;
- user feedback or correction;
- downstream product outcomes.

A trace is captured evidence about an execution. It is not the execution itself and may omit relevant events. Capture requirements should be explicit. Missing evidence must remain visible and must not be counted as successful behavior.

### Storage, links, and source history


The subsystem should preserve stable identifiers and links among:

```text
question
→ evaluation basis and version
→ case or production sample
→ execution and system version
→ trace and related outcomes
→ criterion and evaluator version
→ judgment or label
→ measurement
→ finding
→ decision
```


The storage design may be simple at first. The important requirement is that a reviewer can find the evidence behind a judgment and understand which versions produced it.

Access, retention, privacy, and security rules apply to evaluation data. Production traces may contain customer data, sensitive context, or records of consequential actions.

### Review and judgment


The subsystem should support the methods required by the evaluation basis and criterion:

- deterministic checks for rules, schemas, permissions, and invariants;
- comparisons with trusted references;
- model-based evaluators for suitable semantic judgments;
- human or domain review for unclear, disputed, new, or consequential behavior.

Review tools should show the evidence needed for the judgment rather than only the final response. They should allow a reviewer to record uncertainty, disagreement, and missing evidence.

Automated evaluators require their own evidence. Their agreement with trusted judgments, known failure modes, sensitivity to irrelevant changes, and stability across time should be checked before their output controls a release or live action.

See [Judgment and Findings]({{< ref "ai-engineering/evaluation/v1/30-judgment-and-findings" >}}) for the decision and measurement model.

### Analysis and comparison


The subsystem should help examine:

- individual successes and failures;
- recurring behavior and failure patterns;
- important differences between situations or groups;
- coverage gaps;
- candidate and baseline differences;
- regressions between versions;
- changes in production inputs or behavior;
- disagreement among reviewers or evaluators;
- missing or unreliable evidence.

Aggregate results should retain links to the underlying cases and traces. Averages can hide severe failures in a small but important part of the supported scope.

### How results affect decisions


Evaluation results may be used at different levels:

| Use | Effect |
| --- | --- |
| Informational | The result is available for inspection but does not block an action |
| Review required | A result requires a person to inspect the evidence or approve an exception |
| Release rule | A validated result can block or limit a release |
| Runtime control | A stable rule can prevent, redirect, or escalate a live action |

Automation should increase only when the evaluation basis, evidence, criterion, evaluator, and response are stable enough for the consequence.

A runtime control is not automatically an evaluation. A permission check, for example, enforces a rule. Evaluation may establish whether that rule and its implementation work as intended.

## Harness and wider workspace


An **evaluation harness** is the controlled execution and evidence-capture core. It usually manages cases, fixtures, candidate configuration, execution, trace capture, and evaluator calls.

A wider evaluation workspace may also provide:

- dataset and evaluator registries;
- run history and version comparison;
- trace inspection;
- human review and resolution of disagreements;
- failure grouping and search;
- dashboards and reports;
- links to delivery and incident systems;
- production sampling and monitoring.

These functions do not have to be split between two products called a harness and a platform. The useful distinction is between running systems under controlled conditions and the wider work needed to understand and use the evidence.

## Where evaluation runs


Evaluation can be placed in three operating contexts:

| Context | Typical use |
| --- | --- |
| Offline | Exploratory probes, fixed cases, replay, candidate comparison, regression checks, and evaluator validation without direct live effects |
| Online, in the request path | Fast and reliable checks or controls that may affect a live action |
| Online, outside the request path | Sampling, review, monitoring, drift detection, outcome linking, and failure discovery after or alongside live use |

These are places where evaluation runs, not product phases. Discovery and delivery can use evidence from any of them.

## Reliability of the subsystem


The subsystem itself can fail. It should detect:

- cases that no longer represent the supported scope;
- production samples that do not support the conclusion being considered;
- missing events or configuration versions;
- failed or partial evaluation runs;
- evaluator drift or disagreement;
- labels based on outdated criteria;
- comparisons across incompatible versions;
- review work that is too slow for the decision;
- cost that makes the evaluation impractical to repeat.

When a definition changes, affected labels and measurements may need to be reviewed or recomputed. When evidence capture changes, old and new results may no longer be directly comparable.

## Minimum useful subsystem


The smallest useful version may contain only:

1. a named question;
2. an evaluation basis or provisional expectation, when needed;
3. a small set of cases;
4. a way to run an identified system;
5. saved evidence with enough context for review;
6. a human review process;
7. a short finding with stated limits;
8. a place to preserve useful cases and failures for later work.

Add automation, larger datasets, release integration, and production monitoring when the decisions require them. The subsystem should grow in response to repeated evidence needs, not from a fixed maturity sequence.
