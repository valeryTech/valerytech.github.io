---
draft: false
toc: true
description: "Critiques initiative, confidence, autonomy, and inspection practices, calling for explicit triggers, task scope, authority, consequence boundaries, and outcome evidence before implementing collaborative features."
title: "08 Collaborative System Design Practices Comments"
linkTitle: "08 Collaborative System Design Practices Comments"
---
# Collaborative-system design practices: comments


New commentary by Codex, added on 2026-10-01. The [practices note]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}) retains an original question and complete LLM reply. The comments explain the arrangement and questions for later design work.

## Why the practices stay together


The reply first explains collaboration, active participation, and augmentation. It then derives shared practices and a final feature-review test. Keeping the whole reply preserves the relation between each practice and the proposed shifts.

The guide concerns product discovery and work allocation. The [semantic-substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) concerns deriving constraints and enforcement from desired guarantees. The practices could inform its inputs without replacing that separate method.

The [participant-profile note]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) retains the initial assumptions and their later revision. The guide's comparative table remains as originally written, even where the revised profiles use more qualified language.

## Shared work does not imply one required architecture


The source proposes goals, tasks, decisions, evidence, and versions as explicit objects. A later design should identify the objects needed for its particular work, rather than adopt every proposed object as a requirement.

A shared database or workspace can preserve records without establishing that participants interpret them alike. The [joint-activity model comments]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}#common-ground-and-stored-context) explain the common-ground question.

The source's transitions are useful questions about progress. They are not a complete state machine with defined preconditions, permissions, or failure states.

## Initiative and authority need separate rules


The source distinguishes observing, proposing, preparing, and executing. A reason to notice a problem does not confer permission to act on it.

A later initiative rule should state the trigger, task scope, permitted contribution, and conditions for stopping or asking. The source's examples about reorganizing notes or sending messages are illustrations, not permission to perform those actions in a particular system.

The proposed autonomy progression need not be a one-way adoption sequence. Different actions can require different boundaries, and changed conditions can require less autonomy.

## Confidence and reversibility are insufficient by themselves


The source proposes using uncertainty to affect control flow. It does not define confidence, establish calibration, or supply thresholds for safe action.

High reported confidence should not bypass the authority or consequence boundary. A later design needs evidence for the relevant task and an explicit policy about unresolved uncertainty.

Undo of a draft or workspace change differs from reversing an external effect. The [verification and acceptance note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) distinguishes accepting a contribution from authorizing an external action.

## Inspection and evaluation


Inspectability can be supported by actual sources, assumptions, changes, planned actions, and results. A generated explanation is not automatically a faithful record of the computation that produced an output.

The final five-question test is a proposed review aid, not evidence that a design works. The [collaboration evaluation note]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}) suggests additional tests of interruption, review, handoff, and recovery.

The guide supplies no experiment or measured benefit. No interface, runtime, or study is selected by the split. The mapping log records preservation of the complete dialogue.
