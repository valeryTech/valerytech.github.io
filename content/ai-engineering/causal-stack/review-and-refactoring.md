---
draft: false
toc: true
title: "Causal-stack refactoring record"
description: "The refactoring replaces overlapping layer taxonomies with cases, claims, debugging, and checks tied to customer tasks. A destination map records which material survived, how it changed, and which evidence claims remain open."
linkTitle: "Causal-stack refactoring record"
---

**Refactored:** 20 October 2026.

**Purpose:** make the notes usable during future work building products and learning from real customers.

The former 15-file stack contained about 31,000 lines and 136,000 words. Three review and planning notes were added before this refactor. The active collection now has ten files and about 7,600 words. It separates cases, debugging, claims, checks, and reference, with a customer-use guide and one entry point.

## What changed


| Problem in the former notes | Completed change |
|---|---|
| Several overlapping fault classifications | Replaced with one artifact-based debugging guide and ordinary descriptions |
| Symptoms assigned to named model mechanisms without supporting evidence | Separated observations, competing explanations, and local checks; retained internal mechanisms only as scoped background or hypotheses |
| Absence of a proposed component treated as a system fault | Replaced control requirements with candidate interventions tied to observed problems, comparisons, and costs |
| Evaluation names and unspecified metrics | Replaced with concrete inputs, expected behavior, judgment procedures, and decisions |
| Large incident schemas and mandatory codes | Replaced with a short case record and optional metadata needed for the investigation |
| Language theory dominating the reading path | Consolidated into practical distinctions about targets, missing information, scope, and correction |
| Repeated framing, naming histories, and mappings | Removed from active notes |
| Unsupported generalization about all AI systems | Scoped the model background and linked primary research for retained empirical findings |

## Where the former files went


These names are historical identifiers. The files have been removed; their useful material was rewritten in the linked destinations.

| Retired file | Destination |
|---|---|
| `causal-stack-operating-model.md` | [Entry point]({{< ref "ai-engineering/causal-stack" >}}) and [product-use cycle]({{< ref "ai-engineering/causal-stack/practical-checks" >}}) |
| `layer-0-natural-language-properties.md` | [Language and interaction]({{< ref "ai-engineering/causal-stack/reference/language" >}}) |
| `layer-0-alt.md` | [Language and interaction]({{< ref "ai-engineering/causal-stack/reference/language" >}}) |
| `layer-1a-base-llm-mechanisms.md` | [Model and system behavior]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}}) |
| `layer-1b-final-scheme.md` | [Claims]({{< ref "ai-engineering/causal-stack/claims" >}}) and scoped model background |
| `layer-1c-ai-system-causal-features.md` | [Model and system behavior]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}}) and [checks]({{< ref "ai-engineering/causal-stack/checks" >}}) |
| `layer-2/product-fault-families.md` | [Cases]({{< ref "ai-engineering/causal-stack/cases" >}}) and [debugging]({{< ref "ai-engineering/causal-stack/debugging" >}}) |
| `layer-2/failure-operators.md` | [Debugging]({{< ref "ai-engineering/causal-stack/debugging" >}}#use-precise-descriptions) |
| `layer-2/fault-family-index.md` | [Debugging]({{< ref "ai-engineering/causal-stack/debugging" >}}) |
| `layer-2/semantic-fault-family-index.md` | [Debugging]({{< ref "ai-engineering/causal-stack/debugging" >}}) and [checks]({{< ref "ai-engineering/causal-stack/checks" >}}) |
| `layer-2/evaluation-method-reference.md` | [Checks]({{< ref "ai-engineering/causal-stack/checks" >}}) |
| `layer-3-control-families.md` | [Possible interventions]({{< ref "ai-engineering/causal-stack/reference/interventions" >}}) |
| `layer-3-controls-and-faults.md` | [Possible interventions]({{< ref "ai-engineering/causal-stack/reference/interventions" >}}) |
| `layer-3-system-fault-families.md` | [Debugging]({{< ref "ai-engineering/causal-stack/debugging" >}}) and [possible interventions]({{< ref "ai-engineering/causal-stack/reference/interventions" >}}) |
| `layer-3-semantic-fault-view.md` | [Possible interventions]({{< ref "ai-engineering/causal-stack/reference/interventions" >}}) and checks for meaning, exact values, and actions |

Incoming links in the surrounding notes were updated. Historical commentary outside this directory is marked as referring to retired drafts. Frontmatter aliases record the former page paths, including the older `evaluation/causal-stack` prefix used by published links. Their handling depends on the publishing system; no site deployment or redirect verification was performed.

A local recovery snapshot of the pre-refactor working files was created before rewriting, including uncommitted edits. The old prose is outside the active reading path.

## What remains unvalidated


This is a documentation refactor, not a product evaluation. No customer trial, model comparison, or quantitative improvement result was produced.

Sources support specific background findings, with their scope stated beside them. The proposed diagnostic questions, intervention choices, and customer workflow still need checking in actual use. Their inclusion is an editorial judgment about likely usefulness, not evidence that they work.

The next evidence should come from a product's real tasks, consequences, and decisions. Keep detailed records with that product and revise these notes when experience supports, contradicts, or narrows a claim.
