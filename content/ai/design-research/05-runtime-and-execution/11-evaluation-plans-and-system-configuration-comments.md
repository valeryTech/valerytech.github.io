---
draft: false
toc: true
description: "Reviews evaluation-plan boundaries, requiring exact system and suite references, recorded behavior-changing runtime conditions, and valid scoring evidence beyond merely capturing traces or versioning evaluators."
title: "11 Evaluation Plans And System Configuration Comments"
linkTitle: "11 Evaluation Plans And System Configuration Comments"
---
# Comments on evaluation plans and system configuration


New commentary by Codex, added on 2026-04-01. The [dialogue note]({{< ref "ai/design-research/05-runtime-and-execution/11-evaluation-plans-and-system-configuration" >}}) retains the complete final exchange and every example. The proposed EvaluationPlan or RunConfig is an execution configuration, not a completed experiment.

## Reference the system instead of redefining it


The proposal separates the system under test from the test suite and runtime conditions. The system reference selects a particular combination of prompts, models, routing, tools, retrieval, policies, interfaces, and relevant runtime code. The suite references cases, evaluators, and criteria.

The proposed prompt-set artifact records a combination of prompts. It does not replace the individual prompt versions or their composition graphs. The earlier [prompt note]({{< ref "ai/design-research/05-runtime-and-execution/08-prompt-text-composition-and-registry" >}}) and [publishing note]({{< ref "ai/design-research/05-runtime-and-execution/10-configuration-publishing-and-version-identity" >}}) retain those separate identities.

## Record testing conditions separately and explicitly


An evaluation plan can remain unchanged across several runs, while each run has particular inputs, outputs, errors, and observed dependency behavior. A later record should connect the run to the exact resolved plan and system revisions.

The closing source qualification allows execution settings to affect system behavior. A later boundary rule needs to state how concurrency, timeouts, retries, budgets, and environment bindings enter comparisons. Keeping a setting outside system identity does not make the setting irrelevant to the result.

Captured prompts, retrieval data, and tool responses can help explain a result. Capture settings need retention, access, and redaction rules for sensitive data. New live calls and use of recorded responses must remain distinguishable, as the [workbench comments]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches-comments" >}}) explain.

## Configuration does not establish evaluation validity


The example's repetitions, concurrency, timeout, and compliance threshold are illustrative values. The reply reports no executed runs, measured compliance, or evidence supporting the chosen threshold.

A comparison needs stated tasks, scoring rules, conditions, and treatment of failed or missing runs. The existing [runtime evaluation]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}), [investigation evaluation]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}), and [research-method comments]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation-comments" >}}) concern different evidence requirements. Referencing an evaluator version does not establish that its judgments measure the intended property.

## Audit and limits


The [configuration and instantiation note]({{< ref "ai/design-research/05-runtime-and-execution/09-declarative-system-configuration-and-instantiation" >}}) retains the proposed shared runtime interface. The audit records the final exchange's original range and checksum.

The split adopts no evaluation schema, sample size, scoring method, reliability target, or runtime implementation. The new comments remain separate from the preserved proposal.
