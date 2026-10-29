---
draft: false
toc: true
description: "A critique distinguishing task completion, learning, decision quality, and complementarity in collaboration studies, with matched baselines, realistic error/control cases, behavioral interruption checks, and explicit recovery limits."
title: "11 Human Ai Collaboration Evaluation Comments"
linkTitle: "11 Human Ai Collaboration Evaluation Comments"
---
# Human-AI collaboration evaluation: comments


Editorial context, 2026-10-20: Wording in this review and the linked research discussion has been edited for standalone reading. References to preserved or unchanged source wording describe the earlier reassembly; the review's judgments remain attributed commentary, not accepted decisions.

New commentary by Codex, added on 2026-10-01. The [evaluation note]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}) retains the report's proposed tests with editorial wording. The comments distinguish the proposal from a completed study.

## Why the evaluation has its own note


The source turns from describing collaboration to testing whether the intended collaboration occurs. The complete pattern-test table, broader audit, and final rubric stay together so the relationship between individual patterns and general mechanics remains visible.

The [pattern catalog]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}#practitioner-and-research-synthesis) retains the suggested tests within each entry. The dedicated note retains the overall framework rather than extracting those entry-level passages.

The [interactive-investigation paper]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}) has a more specific set of hypotheses about investigation interfaces. The present framework could inform a study of that application, but it does not select the hypotheses, participants, tasks, or experiment.

## Choose an outcome before a test


Completion, understanding, skill development, and decision quality are different outcomes. Faster completion could be undesirable if the intended outcome is learning or retaining independent judgment.

Critique can be tested against known defects in an artifact. A coaching claim also needs evidence about performance on a later task without assistance. The report proposes the distinction but supplies no measurements.

A complementarity claim requires comparison with a person or AI working alone under relevant conditions. A design intended primarily to reduce time or review cost can have a different goal, so outperforming every baseline on every measure should not be assumed.

## Study conditions and baselines


A later study should state the participants' expertise, the task, the information available to each participant, and the AI configuration. The study should also record time and resource limits.

Where possible, comparisons should hold the model, tools, corpus, and task conditions constant while changing the interaction design. Extra information or a larger resource budget could otherwise explain a performance difference.

Seeded errors should resemble errors that participants may encounter. A study also needs cases without seeded errors to measure unnecessary rejection and disruption. Error detection alone does not measure appropriate reliance.

The source provides a checklist and suggested measures. It does not specify a sample size, allocation procedure, scoring rules, or analysis plan, so the checklist is not yet a complete experimental protocol.

## Awareness, directability, and recovery


An available status display does not establish that a person understands the task state. A study should test whether the person can identify completed actions, unresolved questions, and the authority they have after a handoff.

A changed instruction should be checked against subsequent behavior. Receiving an interruption or displaying a revised plan does not by itself show that the changed constraint was respected.

Undo needs a stated scope. Restoring a draft differs from reversing an external action, and a recovery test should record what cannot be reversed. The [verification and acceptance note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) discusses the separate acceptance and effect boundaries.

## Relation to runtime and evidence evaluation


The [runtime evaluation plan]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) tests enforcement, failures, and recovery. The [investigation evaluation plan]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) tests evidence handling under a bounded corpus. The collaboration framework concerns the person and AI working together.

A runtime test cannot establish that a reviewer understood a proposal. A user study cannot establish a universal enforcement guarantee, and confidence or satisfaction alone cannot establish result correctness.

The [source synthesis]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}) retains the bibliography. Literature and product claims remain unverified, and no experiment is selected by the split. The mapping log records preservation checks.
