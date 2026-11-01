---
draft: false
toc: true
description: "Reviews recovery support for long-running work, distinguishing checkpoints from valid resumption and retries from safe handling of prior effects, with separate controlled and field-study evaluations."
title: "01 Generalized Agent Runtime Comments"
linkTitle: "01 Generalized Agent Runtime Comments"
---
# Generalized agent runtime: comments


New commentary by Codex, added on 2026-04-01. The [runtime note]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) preserves its earlier passages and the complete added mechanism list and coding-harness example. The comments focus on the added passage and do not independently verify the earlier report or product claims.

## Why the runtime passage belongs here


The complete [imported passage]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#runtime-support-for-long-running-work) describes infrastructure for preserving ongoing work. The earlier runtime note already discusses durability, controlled adaptation, recovery, and recorded results, so the passage extends the same subject.

The [work types]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}#work-types-and-task-dimensions), [roles]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}#roles-in-long-running-work), and [goal revisions]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#goal-revisions-and-dependent-work) remain separate descriptions of the work. The runtime mechanisms are not a replacement for those descriptions.

## Conditional requirements and correct recovery


The source's opening calls runtime machinery necessary, while the later list describes mechanisms that support particular work. Necessity should be stated for a defined task and its risks. The reply does not establish that every task requires every mechanism.

Checkpointing can preserve state without establishing that resuming an old plan is appropriate. A changed goal or environment may require another decision before execution resumes.

Retries also need rules for effects already performed. The earlier [failure distinctions]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#10-localize-failures) and [recorded-history discussion]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) provide related context, without making a checkpoint or retry alone sufficient for correct recovery.

## Coding example and proposed evaluation


The complete coding-harness example remains beside the mechanism list. Its claims about Anthropic's work were not independently verified during the reassembly.

The original reply continues with the [failure taxonomy and field-study proposal]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}). The proposal studies work from practice and remains distinct from the [controlled runtime evaluation]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}).

The mapping log records the imported range and exact preservation of the earlier runtime note. No runtime implementation or experiment was selected by the arrangement.
