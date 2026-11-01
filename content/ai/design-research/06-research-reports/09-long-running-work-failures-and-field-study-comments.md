---
draft: false
toc: true
description: "A critique of the long-running-work study proposal highlighting overlapping failure categories, uncertain causal attribution, undefined sampling/classification rules, and differences between field observation and controlled runtime tests."
title: "09 Long Running Work Failures And Field Study Comments"
linkTitle: "09 Long Running Work Failures And Field Study Comments"
---
# Long-running work failures and field study: comments


New commentary by Codex, added on 2026-04-01. The [research note]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}) preserves the complete failure taxonomy, proposed study, consolidated model, and closing definition. The comments are interpretation and review questions, not original dialogue or research results.

## Why the taxonomy and study stay together


The taxonomy proposes categories for examining tasks, and the study proposal explains how the categories might be developed from practice. Keeping the passages together preserves the relation between the proposed observations and the resulting model.

The source's closing definition of persistent collaborative work also remains here. The earlier work description, roles, goal revisions, and runtime support are linked in original order. No initiating user question was saved in the source, and none was invented.

## Failure categories and observations


The eight failure categories are proposed descriptions. They can overlap, since a missed goal change can also produce stale state and an obsolete plan. The reply supplies neither classification rules nor evidence that the categories are complete.

A later study should distinguish the observed failure from its proposed cause. For example, duplicated work does not by itself establish whether the cause was an incorrect plan, a missed handoff, or a recovery error.

The [coordination analysis]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) raises a related question about attributing behavior to a configured system or an internal component. The two discussions remain separate source arguments, rather than one validated failure model.

## Field study and controlled evaluation


The suggestion to examine 30 to 50 tasks is a proposed study size, not a completed dataset or a justified sample size. Task selection, the unit of analysis, observation records, and classification rules would need to be defined.

The existing [runtime evaluation plan]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) proposes controlled tests involving traces, faults, policies, and repeated runs. The field study instead seeks recurring work structures. A classification developed from practice could inform controlled tests, but the reply does not establish that either study has been done.

## Different versions of the model


The opening five layers, the closing consolidated model, and the earlier [complexity hierarchy]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}#this-could-give-us-a-stronger-field-structure) organize the subject differently. The closing role summary omits explicit state-keeper and recovery roles from the complete [role list]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}#roles-in-long-running-work). Both versions remain unchanged.

The closing collaborative-work definition is a proposed object of study. It does not establish a theory of complex adaptive systems or an implemented architecture.

## Literature status and scope


Claims attributed to LangChain, Anthropic, HORIZON, and the oversight study were retained with their original links. They were not independently checked during the reassembly. Preserving attribution does not verify the claims or adopt a research or implementation choice.

The source comments (archived source 016) preserve the broader review and updated placement. The mapping log records all original ranges and preservation checks. Plain-writing guided only the new prose, and no original reply was edited.
