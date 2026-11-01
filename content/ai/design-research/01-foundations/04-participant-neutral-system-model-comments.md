---
draft: false
toc: true
description: "Clarifies that goal stewardship, verification, state keeping, and recovery are work roles rather than separate agents; each still requires explicit evidence, authority, and failure rules."
title: "04 Participant Neutral System Model Comments"
linkTitle: "04 Participant Neutral System Model Comments"
---
# Participant-neutral system model: comments


New commentary by Codex, added on 2026-04-01. The [model note]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) preserves its earlier architecture discussion and the complete added passage on roles in long-running work. The comments focus on the added passage and do not independently verify the earlier architectural or literature claims.

## Why the role list belongs here


The complete [role passage]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}#roles-in-long-running-work) describes functions performed by people, models, and services. The participant-neutral architecture already separates a participant's contributions and authority from its internal behavior, so the role list provides a concrete application.

The [participant-profile note]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) describes capabilities and failure modes. A role describes a function in the work, rather than a kind of participant. The two descriptions can inform allocation without being the same classification.

## Roles, verification, and authority


The source explicitly allows one participant to hold several roles. The list therefore does not require a separate agent for every role or establish that every task needs all eight roles.

A verifier role does not establish that checks are adequate or independent. An authority role also needs explicit permissions and limits. A later design should define what evidence a verifier needs and which decisions an approver may commit.

A state keeper can maintain records without proving that the records are complete or correct. A recovery role needs rules for recognizing failure, changing ownership, and dealing with effects already performed.

## Complete list and closing summary


The closing [work model]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}) abbreviates the earlier list and omits explicit state-keeper and recovery roles. The complete list remains here, and neither version was silently substituted for the other.

The original reply continues with [goal revisions]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#goal-revisions-and-dependent-work). The mapping log records the imported range and exact preservation of the earlier model note.
