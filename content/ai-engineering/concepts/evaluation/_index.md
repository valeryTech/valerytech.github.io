---
draft: false
toc: true
title: "Evaluation Concepts"
description: "Terms and processes of AI evaluation: failure modes, error analysis, deterministic evaluators, LLM judges, and alignment with domain experts."
linkTitle: "Evaluation"
---

These notes describe the terms and processes of AI evaluation as practitioners and the cited sources use them. How I apply them is in [Evaluating AI Products]({{< ref "ai-engineering/evaluation" >}}).

| Topic | Read |
| --- | --- |
| Observing, measuring, judging, testing, estimating, comparing, diagnosing, validating, and auditing: what each establishes about behavior | [Evaluation actions]({{< ref "ai-engineering/concepts/evaluation/evaluation-actions" >}}) |
| Queries, traces, spans, and sessions, and why one query is run several times | [Traces and executions]({{< ref "ai-engineering/concepts/evaluation/traces-and-executions" >}}) |
| Production sampling, synthetic queries from dimensions and tuples, and golden datasets | [Test data]({{< ref "ai-engineering/concepts/evaluation/test-data" >}}) |
| Reading traces, open and axial coding, and building a failure taxonomy | [Error analysis]({{< ref "ai-engineering/concepts/evaluation/error-analysis" >}}) |
| One trusted expert or several annotators, rubrics, Cohen's kappa, alignment sessions, and criteria drift | [Rubrics and annotator agreement]({{< ref "ai-engineering/concepts/evaluation/rubrics-and-annotator-agreement" >}}) |
| Clustering, distributions, confirming a pattern, semantic search, and confounders | [Trace data analysis]({{< ref "ai-engineering/concepts/evaluation/trace-data-analysis" >}}) |
| Deterministic evaluators, LLM judges, human review, and reference-free and reference-based evaluation | [Evaluators]({{< ref "ai-engineering/concepts/evaluation/evaluators" >}}) |
| TPR and TNR, the three sets of labeled traces, and estimating a pass rate with an imperfect evaluator | [Evaluator alignment]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}}) |
| CI on a golden dataset, model upgrades, online monitoring, guardrails, and judge drift | [CI and online monitoring]({{< ref "ai-engineering/concepts/evaluation/ci-and-online-monitoring" >}}) |
| Failure modes that response-level checks miss, and an evaluator for each | [Evaluation failure modes]({{< ref "ai-engineering/concepts/evaluation/evaluation-failure-modes" >}}) |
