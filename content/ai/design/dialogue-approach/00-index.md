---
draft: false
toc: true
description: "A reading map from task-assistance framing and authority to hybrid interaction and Quick Add’s concrete transaction-draft architecture, with research comparisons and sources."
title: "00 Index"
linkTitle: "00 Index"
---
# Dialogue approach: reading map


The organizing idea is **human-AI task assistance**: domain state and task completion provide the frame, and dialogue is one way to coordinate the work. The transaction-draft pipeline is a concrete Quick Add example within that broader frame.

Start with [Task assistance beyond dialogue]({{< ref "ai/design/dialogue-approach/01-framing/01-task-assistance-beyond-dialogue" >}}), then [Three-layer model for task assistance]({{< ref "ai/design/dialogue-approach/01-framing/02-three-layer-model" >}}). For the implementation example, continue with [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) and [Transaction example: from utterance to execution]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/07-transaction-example" >}}).

## Framing the system


| Note | Question |
| --- | --- |
| [Task assistance beyond dialogue]({{< ref "ai/design/dialogue-approach/01-framing/01-task-assistance-beyond-dialogue" >}}) | Why use task assistance as the broader frame? |
| [Three-layer model for task assistance]({{< ref "ai/design/dialogue-approach/01-framing/02-three-layer-model" >}}) | How do purpose, execution, and interaction fit together? |
| [Terminology and taxonomy]({{< ref "ai/design/dialogue-approach/01-framing/03-terminology-and-taxonomy" >}}) | What do assistant, copilot, agent, workflow, and dialogue describe? |
| [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}) | Where do task-oriented dialogue and mixed initiative fit? |
| [Interaction forms and hybrid UI]({{< ref "ai/design/dialogue-approach/01-framing/05-interaction-forms-and-hybrid-ui" >}}) | When should a task use dialogue, forms, tables, or direct controls? |
| [Requirements and evaluation for task assistants]({{< ref "ai/design/dialogue-approach/01-framing/06-requirements-and-evaluation" >}}) | What requirements and outcomes should be evaluated? |

## Draft pipeline


| Note | Question |
| --- | --- |
| [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) | How does an utterance become an incrementally refined action draft? |
| [Draft state and lifecycle]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/02-draft-state-and-lifecycle" >}}) | What does the draft contain, and how does its state change? |
| [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}) | What determines the next step and permits execution? |
| [Grounding and enrichment]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/04-grounding-and-enrichment" >}}) | How are proposed fields resolved against real application data? |
| [Draft patches and field provenance]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/05-patches-and-field-provenance" >}}) | How are updates, confidence, and field sources recorded? |
| [Clarification as draft repair]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/06-clarification-as-draft-repair" >}}) | How does a follow-up answer repair the existing draft? |
| [Transaction example: from utterance to execution]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/07-transaction-example" >}}) | How does the coffee example progress through the whole loop? |
| [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}) | How does this model map to frames, DST, Rasa, and Lex? |
| [Working ideas: workflow evolution and autonomy]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/09-workflow-evolution-and-autonomy" >}}) | How might risk and experience change workflow autonomy? |

## Research and references


| Note | Question |
| --- | --- |
| [Practitioner product comparison]({{< ref "ai/design/dialogue-approach/03-research/01-practitioner-product-comparison" >}}) | How does the source report compare practitioner products? |
| [Sources and references]({{< ref "ai/design/dialogue-approach/03-research/02-sources-and-references" >}}) | Which references support the original material? |

## Original material


The six original filenames now point to their new locations. Exact originals are preserved as text snapshots in `_originals/`, so they do not duplicate the topic notes in the Markdown graph. The [reorganization map]({{< ref "ai/design/dialogue-approach/reorganization-map" >}}) records the source sections and their destinations.

This pass rearranges the material and cleans export formatting. It keeps the original design proposals and research claims; it does not revalidate the external sources.
