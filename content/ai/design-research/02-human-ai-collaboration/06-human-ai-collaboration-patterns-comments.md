---
draft: false
toc: true
description: "Compares successive pattern taxonomies, questioning classification and selection rules while distinguishing shared reasoning from joint construction and handoff transitions from ongoing collaboration modes."
title: "06 Human Ai Collaboration Patterns Comments"
linkTitle: "06 Human Ai Collaboration Patterns Comments"
---
# Human-AI collaboration patterns: comments


Editorial context, 2026-04-20: Wording in this review and the linked research discussion has been edited for standalone reading. References to preserved or unchanged source wording describe the earlier reassembly; the review's judgments remain attributed commentary, not accepted decisions.

New commentary by Codex, added on 2026-04-01. The [pattern note]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) retains the original LLM arguments with editorial wording. The comments explain their placement and unresolved choices, rather than presenting the patterns as validated design rules.

## Why the pattern discussions stay together


The shared reasoning loop introduces the distinction between general collaboration mechanics and a particular interaction pattern. The Teresa-attributed discussion and later derivation then propose different pattern sets. Their relation is easier to inspect when the complete examples and comparison table remain together.

The earlier discussion names eight patterns, then selects five as a possible core set. The later derivation names seven patterns. The changes are part of the retained argument, so none of the lists replaces another during reassembly.

The [model note]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) contains the general mechanics and their coverage rationale. Its [comments]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}) distinguish the proposed taxonomy from claims of completeness.

## What changes between the lists


Critique and guided practice are separate in the Teresa-attributed discussion, while the later derivation groups critique and coaching. Handoff and escalation are also separate earlier, then grouped later. Joint construction appears explicitly in the later derivation.

A later classification needs rules for distinguishing the purpose of an activity from the movement of responsibility. Escalating a decision because authority is missing differs from handing over an ordinary work stage. The activities can use similar interfaces without having identical conditions.

The source identifies handoff and escalation as additions from broader collaboration theory. It does not attribute every listed pattern equally to Teresa's examples. The comments retain that distinction, and the original talk and examples have not been independently checked.

## Selecting patterns for a task


The questions about information, capability, judgment, and authority provide a useful starting description. They do not establish a deterministic selection algorithm or show that the patterns cover every task.

A task may combine several patterns. For example, elicitation can obtain missing context before a proposal is reviewed. A designer should describe the current responsibility and the reason for changing it, rather than assign one permanent pattern to the whole task.

Information and capability can also be uncertain. A claim that an AI can perform a task needs evidence under the relevant conditions, and generating a candidate does not confer authority to commit it. The [augmentation note]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}) discusses allocation in relation to capability, consequence, and verification.

## Shared reasoning and joint construction


The later distinction separates building understanding from building an artifact. The purposes can overlap because participants may write an artifact to test or revise their understanding.

The [sensemaking note]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}) explains understanding as an outcome. A future evaluation should distinguish the quality of the artifact from changes in the person's understanding or ability to judge it.

Claims that neither participant can solve the task alone are conditions proposed by the source, not measurements supplied by the examples. The patterns do not establish that collaboration always outperforms a person or model working alone.

## Review and control


A human review point does not guarantee adequate oversight. The reviewer needs enough context, time, and evidence to make the required decision. The interface also needs to distinguish reviewing a draft from authorizing an external action.

Revising shared work can be reversible even when an external effect is not. A future pattern specification should identify what can be undone and what requires separate authority.

The mapping log records the original ranges and checksums. The reassembly chooses no implementation and does not validate the proposed pattern-selection rules.

## Later report taxonomy


The appended [report catalog]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}#practitioner-and-research-synthesis) proposes six modes and places handoff and escalation among transitions. The earlier seven-item derivation remains intact, so the later distinction is visible as a revision rather than a silent replacement.

Handoff can describe an ordinary transfer of responsibility. Escalation can describe a transfer because capability, access, uncertainty, risk, or authority prevents progress. Grouping them as transitions does not erase their different triggers.

The report distinguishes a critic's aim of improving the work from a coach's additional aim of improving the person's future ability. A design can use the same feedback interface for both purposes, but the outcomes and tests need separate definitions.

## Catalog entries and selection guidance


Each complete entry keeps its definition, terminology, examples, mechanics, failure modes, and suggested tests. The [selection guidance]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}#choosing-the-right-pattern) stays with the catalog because its questions refer to those allocations of work.

The decision diagram should be treated as a proposed guide. Elicitation can occur during delegation, and shared reasoning can occur while constructing an artifact. The branches do not establish that only one mode can apply at a time.

Capability and risk also need evidence for the task at hand. A claimed ability to produce a candidate does not establish authority to commit it. The learning objective may require the person to perform work even when AI could produce a finished artifact.

## Product examples and citation support


The product descriptions and empirical numbers have not been independently checked during reassembly. Controls described in a product example do not show that reviewers detect errors or retain situation awareness.

The local footnote definitions are marked copies from the [complete bibliography]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}#references). They preserve citation access without changing the original labels or adding independent support.

The [evaluation note]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}) retains the overall testing framework. The new mapping records the imported ranges and preservation of the earlier pattern dialogue.
