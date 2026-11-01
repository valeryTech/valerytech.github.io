---
draft: false
toc: true
title: "Evaluating AI Products"
description: "Practical AI evaluation for engineers and product managers: framing commitments and hard gates, designing cases, analyzing trace failures, calibrating evaluators, running repeated comparisons, and learning from production."
linkTitle: "Evaluation"
sidebar:
  weight: 10
---

Code tests verify that mechanisms and safeguards are wired correctly; evaluation shows how the complete AI product actually behaves across realistic situations so engineers and product managers can decide what to change, what to promise, and what is ready to ship.

## Collections


- [Evaluation framework]({{< ref "ai-engineering/evaluation/framework-v2" >}}) -- the main playbook for AI engineers and product managers, from framing commitments and hard runtime gates to case design, failure understanding, evaluator calibration, repeated-run experiments, and production learning.
- [Theoretical methodology]({{< ref "ai-engineering/evaluation/theoretical-methodology" >}}) -- an early, experimental specification for formal claim appraisal, state fingerprinting, and statistical gating.

## Fast entry points


| Situation | Start with |
| --- | --- |
| First time setting up evals or choosing what to do next | [Evaluation framework & question router]({{< ref "ai-engineering/evaluation/framework-v2" >}}) |
| See one complete evaluation with concrete schemas, traces, and a judge prompt | [Worked example]({{< ref "ai-engineering/evaluation/framework-v2/worked-example" >}}) |
| Decide what code must enforce vs. what evals must measure for a release | [Commitments, hard gates, and claims]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}}) |
| Build test cases, state fixtures, and synthetic coverage gaps | [Cases, fixtures, and coverage]({{< ref "ai-engineering/evaluation/framework-v2/cases-and-coverage" >}}) |
| Read traces and turn recurring failures into a failure model | [Failure understanding]({{< ref "ai-engineering/evaluation/framework-v2/failure-understanding" >}}) |
| Write criteria, build code checks or LLM judges, and measure TPR/TNR | [Criteria, evaluators, and calibration]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}}) |
| Compare two configurations across repeated runs and apply a finding rule | [Experiments, comparisons, and shipping decisions]({{< ref "ai-engineering/evaluation/framework-v2/experiments-and-findings" >}}) |
| Build the runner/workbench, CI gates, and live production sampling | [Evaluation subsystem and production learning]({{< ref "ai-engineering/evaluation/framework-v2/subsystem-and-production" >}}) |
| Look up exact definitions of evaluation objects, statuses, and support rules | [Evidence model reference]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}) |

## Companion collections


- [Evaluation concepts]({{< ref "ai-engineering/concepts/evaluation" >}}) -- practitioner and literature terminology (open/axial coding, Cohen's kappa, LLM judge biases, TPR/TNR bias correction, CI and online monitoring) in the words of the cited sources.
- [Shared definitions]({{< ref "ai-engineering/shared-definitions" >}}) -- the two forms of a requirement (hard properties vs. measured claims), acceptance records, the five-field claim form, counterfactual support, and assurance levers.
- [Product operating model]({{< ref "ai/product/operating-model" >}}) -- concurrent discovery and delivery, the [solution utility ladder]({{< ref "ai/product/operating-model/solution-utility-ladder" >}}), and [production commitments]({{< ref "ai/product/operating-model/production-commitment" >}}).
- [Phased]({{< ref "projects/phased" >}}) -- the working prototype (built on general-ledger audit planning) where immutable `name@version` registries, decoupled execution/judging/analysis, repeated-run spread, and narrow LLM judges were tested in code.
- Modeling experiment executions -- working notes on trials, repeated SUT and evaluator runs, variant comparisons, and analysis graphs.
- [Capabilities]({{< ref "ai/capabilities" >}}) -- why a benchmark average is not a capability claim, and how to evaluate dispositions along declared task demands.
