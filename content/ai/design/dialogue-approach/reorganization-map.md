---
draft: false
toc: true
title: "Dialogue Approach: Reorganization Map"
description: "An audit of the dialogue collection’s topic split, linking retained source snapshots to new notes and recording citation, table, heading, and export-format cleanup."
linkTitle: "Reorganization Map"
---

Reorganized on 2026-04-09. Source ranges refer to the exact text snapshots, before formatting cleanup.

## Source snapshots


| Original filename | Snapshot | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `02-pipeline.md` | [Original text](/ai/design/dialogue-approach/reorganization-map.assets/02-pipeline.txt) | 16218 | `757b2210359c2ffa1cd942565457d4f9556793875f0018f56c29510996a8d362` |
| `dialogue-systems-mislead.md` | [Original text](/ai/design/dialogue-approach/reorganization-map.assets/dialogue-systems-mislead.txt) | 4376 | `f562a5bb1158b46774bf74e1bf1437449d8d4d144cc226906c868a9bddf4a3ef` |
| `dialogue-systems-obsidian-references.md` | [Original text](/ai/design/dialogue-approach/reorganization-map.assets/dialogue-systems-obsidian-references.txt) | 76140 | `c8cafca9825de051ada3c533d19898bf873551316061a83788ce1c2632db7e77` |
| `ds.md` | [Original text](/ai/design/dialogue-approach/reorganization-map.assets/ds.txt) | 1729 | `7aebfafde8b8c3c8ae6ec3e2f505713d90672dafd7988baa0ec175480a277b73` |
| `example.md` | [Original text](/ai/design/dialogue-approach/reorganization-map.assets/example.txt) | 4988 | `4bf0a9efb33ddac9214e37a03f7c915363204169644f50031f013037fdea877d` |
| `mapping.md` | [Original text](/ai/design/dialogue-approach/reorganization-map.assets/mapping.txt) | 8609 | `d4f09cbfb06d4f92aa73c3fd2731cd247aabea56e44ee5b5f11f5970cef94d44` |

## Section destinations


| Original | Section / range | Destination |
| --- | --- | --- |
| `02-pipeline.md` | Opening mental-model comparison (lines 1-13) | [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) |
| `02-pipeline.md` | Section 1: New mental model (lines 14-49) | [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) |
| `02-pipeline.md` | Section 2: Suggested terminology (lines 50-89) | [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) |
| `02-pipeline.md` | Section 5: The refinement loop (lines 210-248) | [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) |
| `02-pipeline.md` | Section 12: Better product framing (lines 607-620) | [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) |
| `02-pipeline.md` | Section 13: Recommended architecture diagram (lines 621-657) | [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) |
| `02-pipeline.md` | Section 14: Draft manager responsibilities (lines 658-695) | [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) |
| `02-pipeline.md` | Section 17: Practical terminology I would use in the spec (lines 820-842) | [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) |
| `02-pipeline.md` | Section 3: Central object: structured draft (lines 90-167) | [Draft state and lifecycle]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/02-draft-state-and-lifecycle" >}}) |
| `02-pipeline.md` | Section 4: Draft lifecycle (lines 168-209) | [Draft state and lifecycle]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/02-draft-state-and-lifecycle" >}}) |
| `02-pipeline.md` | Section 6: Action policy (lines 249-305) | [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}) |
| `02-pipeline.md` | Section 7: Readiness criteria (lines 306-382) | [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}) |
| `02-pipeline.md` | Section 16: Important distinction: draft-ready vs execution-ready (lines 798-819) | [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}) |
| `02-pipeline.md` | Section 8: Tool use in the pipeline (lines 383-440) | [Grounding and enrichment]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/04-grounding-and-enrichment" >}}) |
| `02-pipeline.md` | Section 9: Draft as an accumulating object (lines 441-494) | [Draft patches and field provenance]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/05-patches-and-field-provenance" >}}) |
| `02-pipeline.md` | Section 10: Draft field provenance (lines 495-550) | [Draft patches and field provenance]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/05-patches-and-field-provenance" >}}) |
| `02-pipeline.md` | Section 11: Clarification as draft repair (lines 551-606) | [Clarification as draft repair]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/06-clarification-as-draft-repair" >}}) |
| `02-pipeline.md` | Section 15: Example: full lifecycle (lines 696-797) | [Transaction example: from utterance to execution]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/07-transaction-example" >}}) |
| `dialogue-systems-mislead.md` | Original framing question (lines 2-2) | [Task assistance beyond dialogue]({{< ref "ai/design/dialogue-approach/01-framing/01-task-assistance-beyond-dialogue" >}}) |
| `dialogue-systems-mislead.md` | Dialogue as a means of collaboration (lines 6-24) | [Task assistance beyond dialogue]({{< ref "ai/design/dialogue-approach/01-framing/01-task-assistance-beyond-dialogue" >}}) |
| `dialogue-systems-obsidian-references.md` | Executive summary (lines 3-22) | [Task assistance beyond dialogue]({{< ref "ai/design/dialogue-approach/01-framing/01-task-assistance-beyond-dialogue" >}}) |
| `dialogue-systems-obsidian-references.md` | Recommended terminology and three-layer model (lines 158-207) | [Three-layer model for task assistance]({{< ref "ai/design/dialogue-approach/01-framing/02-three-layer-model" >}}) |
| `dialogue-systems-mislead.md` | Earlier hierarchy and broader-system names (lines 58-94) | [Three-layer model for task assistance]({{< ref "ai/design/dialogue-approach/01-framing/02-three-layer-model" >}}) |
| `dialogue-systems-obsidian-references.md` | Practitioner terminology (lines 23-54) | [Terminology and taxonomy]({{< ref "ai/design/dialogue-approach/01-framing/03-terminology-and-taxonomy" >}}) |
| `dialogue-systems-obsidian-references.md` | Terminology ambiguities and conversation-first design debate (lines 208-219) | [Terminology and taxonomy]({{< ref "ai/design/dialogue-approach/01-framing/03-terminology-and-taxonomy" >}}) |
| `ds.md` | Classical speech-dialogue pipeline (lines 2-2) | [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}) |
| `dialogue-systems-mislead.md` | Why the academic term remains legitimate (lines 36-57) | [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}) |
| `dialogue-systems-obsidian-references.md` | Academic categories and practitioner boundaries (lines 55-87) | [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}) |
| `dialogue-systems-mislead.md` | Dialogue as one interaction mechanism (lines 26-35) | [Interaction forms and hybrid UI]({{< ref "ai/design/dialogue-approach/01-framing/05-interaction-forms-and-hybrid-ui" >}}) |
| `dialogue-systems-obsidian-references.md` | Dialogue, hybrid UI, and direct interaction (lines 111-157) | [Interaction forms and hybrid UI]({{< ref "ai/design/dialogue-approach/01-framing/05-interaction-forms-and-hybrid-ui" >}}) |
| `dialogue-systems-obsidian-references.md` | Requirements, evaluation, and system descriptions (lines 220-231) | [Requirements and evaluation for task assistants]({{< ref "ai/design/dialogue-approach/01-framing/06-requirements-and-evaluation" >}}) |
| `ds.md` | Risk-based autonomy, guardrails, and workflow evolution ideas (lines 4-8) | [Working ideas: workflow evolution and autonomy]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/09-workflow-evolution-and-autonomy" >}}) |
| `dialogue-systems-obsidian-references.md` | Product comparison and observations (lines 88-110) | [Practitioner product comparison]({{< ref "ai/design/dialogue-approach/03-research/01-practitioner-product-comparison" >}}) |
| `example.md` | Body and cited footnotes (lines 1-67) | [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}) |
| `example.md` | All source links, including uncited export references | [Sources and references]({{< ref "ai/design/dialogue-approach/03-research/02-sources-and-references" >}}) |
| `mapping.md` | Body and cited footnotes (lines 1-106) | [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}) |
| `mapping.md` | All source links, including uncited export references | [Sources and references]({{< ref "ai/design/dialogue-approach/03-research/02-sources-and-references" >}}) |
| `dialogue-systems-obsidian-references.md` | Research source context and limitations (lines 232-254) | [Sources and references]({{< ref "ai/design/dialogue-approach/03-research/02-sources-and-references" >}}) |
| `dialogue-systems-obsidian-references.md` | References 1-69, deduplicated by URL (lines 255-393) | [Sources and references]({{< ref "ai/design/dialogue-approach/03-research/02-sources-and-references" >}}) |
| `dialogue-systems-obsidian-references.md` | Original attachment footnote (lines 395-395) | [Sources and references]({{< ref "ai/design/dialogue-approach/03-research/02-sources-and-references" >}}) |

## Formatting changes


- Replaced numbered report citations with descriptive links while retaining their URLs. Deduplicated the report bibliography by URL.
- Kept citations beside their claims. Namespaced the analog and mapping footnotes so the combined framework note has no collisions, and resolved the local Quick Add specification link.
- Removed favicon cards, hidden citation spans, export ornaments, and conversational follow-up offers from the reading notes; the snapshots retain them.
- Removed the accidental prose code fence in the component mapping. Normalized heading levels and Markdown table separators.
- Changed the wide product table into one section per product, retaining every cell and the following observations.
- Kept the earlier and later three-layer formulations together, with an editorial sentence explaining their different ordering.
- Kept historical example dates and illustrative JSON shapes as supplied. External claims and URLs were not revalidated.
