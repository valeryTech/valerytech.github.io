---
draft: false
toc: true
description: "Traces corrections from a broad registry to expert-editable text, then identifies unresolved reference-rendering, source-map, version-retention, publication, and production-authority rules."
title: "08 Prompt Text Composition And Registry Comments"
linkTitle: "08 Prompt Text Composition And Registry Comments"
---
# Comments on prompt text, composition, and registry


New commentary by Codex, added on 2026-04-01. The [dialogue note]({{< ref "ai/design-research/05-runtime-and-execution/08-prompt-text-composition-and-registry" >}}) preserves the original exchanges without rewriting them. The comments explain the changes in scope and identify questions for a later design.

## Keep the corrections with the proposals


The initial assistant response proposes structured definitions, typed variables, semantic diffs, approval flows, and a broad registry. The author then clarifies that experts work with prompt text. Later questions explore modular assembly and TOML, followed by a correction toward ordinary text and ordinary diffs.

The final author request defines a smaller starting point. Prompts have names and versions, experts edit their specifications online, and an editor can show rendered text. References can be checked, history remains traceable, and variables are excluded for the initial version. The assistant's `@prompt` spelling, versioned-file layout, and draft-publication workflow are proposed ways to implement the request, not independently accepted requirements.

The opening user message includes earlier manifest and production-workbench formulations. Their presence supplies context without establishing who originally wrote every embedded formulation. The outer role label and complete embedded text remain intact.

## Separate text, composition, and execution


A source specification contains editable text and references. A resolved prompt contains expanded text or an ordered message sequence. A model invocation also has particular runtime inputs and settings. The rendered prompt alone does not describe the complete invocation.

The source distinguishes a diff of edited files from a diff of rendered text. A referenced component can change the rendered text while the containing file remains unchanged. The later correction keeps both comparisons as ordinary text diffs rather than requiring a new semantic comparison system.

The reference graph explains composition, while the version history explains changes over time. A tree view of composition does not replace the history of edits and publication.

## Define rendering before claiming exactness


A later rendering contract needs rules for reference recognition, escaping literal references, whitespace, separators, and line endings. It must also identify whether references inside quoted examples or code blocks expand. The small proposed grammar does not settle those cases.

Deterministic rendering also requires a defined renderer version and reference-resolution rules. A source map needs a stated unit for its offsets and a way to identify the exact source revision. Cycle rejection and existence checks can validate assembly without proving that the resulting instructions are correct or obeyed by a model.

## Publication and authority remain separate


The dialogue proposes unchanged published versions and editable drafts, but it does not define publication enforcement, competing edits, review, or retention of referenced content. Permission to edit or publish a prompt is separate from permission to promote it into production or run tools with external effects. The [trusted-effect discussion]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) retains the related authority distinctions.

The [workbench note]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}) concerns inspection and intervention. The [configuration note]({{< ref "ai/design-research/05-runtime-and-execution/09-declarative-system-configuration-and-instantiation" >}}) concerns starting a selected system revision. Links connect the proposals without adopting one shared schema.

## Source accounting and limits


The prompt-registry archive (archived source 014) remains unchanged. Its body is an exact prefix of the longer configuration dialogue's body. The audit maps both histories to the shared retained text, which was imported once.

Saved product descriptions and template-library claims were not independently verified. Plain-writing guided only the new commentary and navigation, not the retained source text.
