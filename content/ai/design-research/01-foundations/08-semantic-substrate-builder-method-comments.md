---
draft: false
toc: true
description: "Challenges direct derivation of runtime mechanisms from work complexity, calling for explicit failure conditions, composition assumptions, recovery semantics, and evidence before claiming automatic design."
title: "08 Semantic Substrate Builder Method Comments"
linkTitle: "08 Semantic Substrate Builder Method Comments"
---
# Semantic substrate builder method: comments


Editorial context, 2026-10-20: Wording in this review and the linked research discussion has been edited for standalone reading. References to preserved or unchanged source wording describe the earlier reassembly; the review's judgments remain attributed commentary, not accepted decisions.

New commentary by Codex, added on 2026-10-01. The comments concern the newly imported [work-complexity passage]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#deriving-requirements-from-work-complexity), not an independent review of every source in the builder-method note. The original proposal is retained with editorial wording.

## Why the requirements example belongs here


The passage moves from properties of the work to candidate requirements and mechanisms. The existing note develops the subsequent design question of which constraints can preserve chosen guarantees. Keeping the complete mapping and checkpointing example here connects the two questions without scattering their rows across runtime and collaboration notes.

The profile, all three task examples, and the broader work-model hierarchy remain in [Complexity and work structure]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}). Its sibling [comments]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}) review the profile and continuity definition.

## Candidate requirements are not proven consequences


The arrows in the imported passage should be read as proposed design reasoning. Structural complexity can motivate dependency tracking, but it does not establish that parallel execution is appropriate. A designer still needs to examine the actual dependencies and required outcomes.

First, describe the work and its failure conditions. Second, state the required property. Third, choose constraints and enforcement that can provide the property under explicit assumptions. The imported mapping does not replace the existing method's checks for composition, substitution, or paths that bypass enforcement.

## The mapping is incomplete


The profile lists ten dimensions, while the mechanism mapping covers seven. State, consequence, and resource complexity have no separate mappings. Their omission does not show that they need no design response.

Possible follow-up questions concern which state must remain consistent, which effects are reversible, and which budgets must be enforced. The questions are new review suggestions, not missing text to insert into the original reply.

## Durability and recovery need explicit conditions


The checkpointing example explains a possible requirement to retain accumulated work after failure. Persistence alone does not guarantee correct recovery. The designer must also consider partial effects and which operations can safely be retried.

The [runtime discussion]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#durable-runtimes-open-source-systems-and-industry-practice) distinguishes replaying recorded observations from making new model calls. Checkpoints, replay, and idempotence address related but different problems; they should not be treated as interchangeable labels for reliability.

## Automatic derivation remains a proposal


The closing suggestion to derive behavior from a work profile remains in the foundation note. No compiler, planning procedure, or theorem is supplied by the imported passage. The split chooses neither a framework API nor a first experiment.

The [mapping log]({{< ref "ai/design-research/reassembly-map" >}}#related-notes-pass-1-complexity-and-work-structure) distinguishes all retained source bytes from new navigation and commentary. Plain-writing (archived source 003) guided the new prose only.
