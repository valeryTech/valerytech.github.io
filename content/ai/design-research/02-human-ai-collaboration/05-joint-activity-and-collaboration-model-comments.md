---
draft: false
toc: true
description: "Critiques a six-mechanic collaboration model, distinguishing common ground from stored context, contribution acceptance from effect authority, and recorded responsibility transfers from successful handoffs."
title: "05 Joint Activity And Collaboration Model Comments"
linkTitle: "05 Joint Activity And Collaboration Model Comments"
---
# Joint activity and collaboration model: comments


Editorial context, 2026-04-20: Wording in this review and the linked research discussion has been edited for standalone reading. References to preserved or unchanged source wording describe the earlier reassembly; the review's judgments remain attributed commentary, not accepted decisions.

New commentary by Codex, added on 2026-04-01. The [model note]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) retains original LLM arguments with editorial wording. The comments are interpretation and design questions, not original dialogue or verified findings.

## Why the model stays together


The opening joint-activity framing explains why the source considers shared goals and distributed responsibility. The initial principles and contribution properties then develop into a six-part model. Keeping the coverage reasoning with the compact model preserves the reasons for the proposed organization.

The [pattern note]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) begins where the source turns from general mechanics to particular distributions of work and judgment. The [pattern comments]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}) explain the later changes to the pattern list.

The [existing augmentation note]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}) already discusses joint activity and human decision points. Links connect the discussions without repeating the full taxonomy in that note. The source placeholder `XXX` and the earlier versions remain unchanged.

## Common ground and stored context


Common ground concerns participants' shared understanding, including what they believe the other participant understands. Access to the same document or database can support common ground, but does not establish that the participants interpret it alike.

A later design needs ways to expose assumptions and detect misunderstandings. It also needs records of acknowledgment or clarification when a disagreement affects the work. A shared-state implementation alone does not demonstrate that the understanding has been repaired.

## Mechanics and supporting properties


The six mechanics describe recurring activities. Alignment, grounding, and repair may occur throughout a task, so the compact sequence should not be treated as a mandatory one-pass workflow.

The source distinguishes mechanics from supporting conditions and properties, but the classification changes during the dialogue. Predictability appears as a joint-activity requirement and later as a supporting property. Reversibility appears in the initial contribution properties and the later supporting list. The proposal is to preserve the differences until the terms and classification rules are defined.

The phrase "AI participant" describes an allocation of work. It does not establish human-like intentions, social obligations, or legal responsibility for a model. Human commitments and software records of accepted tasks may require different definitions.

## Review, acceptance, and authority


A reviewable contribution can still be incorrect, and an explanation can still be unsupported. Inspectability provides access for checking a contribution, rather than proving its quality.

Accepting a contribution into a shared artifact also differs from authorizing an external effect. The [constrained common substrate]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}) and [verification and acceptance]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) discuss the separate boundaries. A later collaboration design should state the participant's authority and the exact contribution or effect covered by a decision.

## Coverage is not proof of completeness


The proposed literature comparison can help find missing categories. The reply does not show a recorded search strategy, a source-to-category mapping, or evidence that independent frameworks stopped adding categories.

Conceptual saturation would therefore remain a claim to investigate. A category broad enough to contain every new observation could also hide useful distinctions, so coverage needs examples that test the category boundaries.

The reply's literature descriptions and attributions remain unverified during reassembly. The comments do not adopt the source's statement that the literature was checked as independent verification by this editing session.

## Relation to the wider design research


The model provides questions about collaboration that could inform later contracts and runtime requirements. It does not select a shared-state architecture, prove a system guarantee, or supply a theory of complex adaptive systems.

The mapping log records the complete split. No experiment or implementation is selected by arranging the material.

## Added report synthesis


The appended [research synthesis]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}#research-synthesis-of-collaboration-mechanics) retains the report's general mechanics, compact model, complete workflow, and closing argument. They extend the earlier dialogue without replacing it.

The source separates collaboration modes from transitions and recurring mechanics. A handoff changes responsibility, while coordination describes the broader work of managing dependencies. The classification can help describe a task without making the categories mutually exclusive.

## Interpreting the report's model and workflow


The compact model is a proposed organization of design questions. Its workflow illustrates one possible sequence, rather than a protocol that all tasks must follow. Alignment, review, and repair can recur as conditions change.

The source places justification and verifiability within evaluation of contributions. A persuasive reason is not necessarily reliable evidence, and a control that permits acceptance does not establish that the contribution was checked.

The workflow should also distinguish accepting a shared contribution from authorizing an external action. The report's compact diagrams do not define the states, authority checks, or revision rules needed to enforce that distinction.

The [pattern comments]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}#later-report-taxonomy) explain the revised six-mode classification. The [evaluation comments]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation-comments" >}}) describe what later tests would need to establish.

The report's literature agreement and product claims remain unverified. The new mapping records the imported ranges and the preservation of all earlier model text.

## Framework responsibility allocation


The added [responsibility passage]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}#responsibility-allocation-and-handoff) comes from the [collaboration framework proposal]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework" >}}). The four fields make the existing allocation model more concrete, while the delegation, proposal/review, and shared-reasoning examples remain together.

The proposed `Responsibility` object records an assignment of work. It does not define personal or organizational accountability for consequences. Assigning execution to AI also does not grant authority to commit an effect.

The owner fields leave some questions open. A later design would need to state whether a field permits several participants, which task or decision it covers, and how an assignment changes. Information ownership should distinguish supplying information from judging whether the information is reliable.

The shared-reasoning example leaves commit authority as "perhaps Human." The phrase records an unresolved choice in the source. It should not be replaced with a fixed authority rule during reassembly.

The `transfer()` example records the participants, responsibility, and reason for a handoff. A later protocol would also need to define acceptance by the receiving participant and the status of work already in progress. The reply does not establish how simultaneous work, cancellation, or failed handoffs are handled.

The [framework comments]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework-comments" >}}) discuss enforcement and recovery limits. The new mapping records the complete split and preservation of the earlier model and comments.
