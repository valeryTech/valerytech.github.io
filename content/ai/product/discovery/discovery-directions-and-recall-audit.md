---
draft: false
toc: true
title: "Discovery Directions Map and Recall Audit"
description: "A cross-topic map of bottom-up learning across AI projects, LLM workflow design, grounded failure analysis, and discovery with LLMs, with search coverage and limits as of 2026-05-01."
linkTitle: "Directions and Recall Audit"
---

Audit date: 2026-05-01. This report describes the local notes as they stand on that date. It does not independently verify research findings, and it leaves the source notes unchanged.

## Easy-to-miss directions


The most consequential note to keep in view is [AI Project Foundation]({{< ref "projects/ai-dev-foundation/starter-kit-and-foundation" >}}). It describes an approach inspired by grounded theory: start with concrete applications and observations, form tentative concepts, and compare experiences across projects. Whether common tools, architectures, or practices emerge remains open.

This is broader than sandbox-first discovery. It concerns **how to develop knowledge across applications**, while sandbox-first concerns **discovering an agent configuration's capabilities before prescribing its method**. A quick summary tends to compress these into one direction. They are two.

Supporting collections that are equally easy to overlook: design science, premature abstraction, interactive retrieval experiments, agent-assisted qualitative analysis, and the relationship between discovery and delivery.

## Conceptual map


These groupings of overlapping notes are interpretive. They are not existing, mutually exclusive sections.

| Direction | What is being discovered? | Best starting points |
| --- | --- | --- |
| Bottom-up learning across AI projects | Which concepts, tools, practices, and abstractions recur across concrete applications, and under which conditions? | [AI Project Foundation]({{< ref "projects/ai-dev-foundation/starter-kit-and-foundation" >}}), [Premature abstraction]({{< ref "engineering/premature-abstraction" >}}) |
| Empirical capability and workflow design | What can the agent do, how should the work be organized, and which structure or automation helps? | [Sandbox-first capability discovery]({{< ref "ai/design/workflow-design/sandbox-first-capability-discovery-llm-agents" >}}), [Workflow evolution]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/09-workflow-evolution-and-autonomy" >}}), [Exploratory pipeline design]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) |
| Grounded-theory-inspired failure understanding | Which failures recur, what distinguishes them, and how should those observations inform evaluation and product work? | Grounded Theory in AI Failure Analysis, [Failure understanding]({{< ref "ai-engineering/evaluation/framework/20-error-analysis" >}}) |
| Discovery and sensemaking with LLMs | What is the situation, which questions matter, and which possibilities become visible through inquiry? | [Operation model]({{< ref "ai/product/discovery/analysis-or-operation-model" >}}), [LLM roles]({{< ref "ai/product/discovery/discovery-llm-roles" >}}), [Discovery map]({{< ref "ai/product/discovery/map" >}}) |
| Product discovery, evidence, and commitments | What should be pursued, what evidence is needed, and what can people reasonably rely on? | [Discovery and delivery]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}), [Problem and response cycle]({{< ref "ai-engineering/delivery/outer-cycle" >}}) |

The first four match the topic most closely. The fifth is a substantial neighboring collection, useful for connecting inquiry to product work without making it a mandatory stage sequence.

## Additional relevant material

### Generalizing from concrete experience


- [AI Project Foundation]({{< ref "projects/ai-dev-foundation/starter-kit-and-foundation" >}}): the strongest match to the bottom-up, grounded-theory approach. It compares experience across applications rather than assuming a universal framework.
- [Premature abstraction]({{< ref "engineering/premature-abstraction" >}}): argues for concrete workflows first, followed by evidence-supported generalization. Includes design-science and scientific-reasoning analogies.
- [Critical empirical practice]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/in-critical-stance" >}}): connects testing, scrutiny of measurements, reflection, and revising interpretations. This supplies an orientation shared by several directions.
- Reflective practice: broader background on learning from experience and challenging assumptions; supporting material rather than an LLM-specific method.
- [Design science method]({{< ref "ai-engineering/delivery/design-science" >}}): source material on problems, requirements, constructing artifacts, demonstration, and evaluation. Its problem-explication framing differs from the open-ended inquiry note; the two are not the same procedure.

### Learning how a workflow should work


- [Workflow evolution and autonomy]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/09-workflow-evolution-and-autonomy" >}}): the direct comparison between deterministic-first and LLM-first development, invoking bottom-up emergence and grounded theory. Framed as an open design question.
- [Sandbox-first capability discovery]({{< ref "ai/design/workflow-design/sandbox-first-capability-discovery-llm-agents" >}}): a proposed engineering method for observing behavior under a broad tool environment, then adding structure where experiments justify it.
- [Exploratory pipeline design]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}): inspect uncertain stage decisions, intervene, compare, and progressively formalize policies. The source labels these as proposals.
- [Inspectable pipeline workbenches]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}): concrete proposed artifacts for scenarios, variants, stages, interventions, judgments, and traces.
- [Retrieval design]({{< ref "ai-engineering/context/retrieval/retrieval-design" >}}): an especially useful bridge. It distinguishes improving the **current investigation** from learning policies for **future workflows**. Repeated interventions suggest hypotheses; they do not automatically justify general rules.
- [Design observations prompted by Hebbia]({{< ref "ai/design-research/interactive-systems/04-design-observations-from-hebbia" >}}) and [comments]({{< ref "ai/design-research/interactive-systems/04-design-observations-from-hebbia-comments" >}}): relevant material that only the metadata review surfaces, with no hits under the initial keywords. The author's observations concern visible, adjustable processes and collaborative investigation; they are not validated claims about the external product.
- [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}): an adjacent architecture proposal for using provisional LLM solutions to inform independently checked executable procedures. Related to progressive formalization, but more specific than general discovery.
- [Development approaches and modes]({{< ref "ai-engineering/delivery/df-development-approach" >}}): distinguishes experiments, baselines, prototypes, and walking skeletons as optional modes chosen for the current uncertainty.

### Grounded theory: distinct uses


- Grounded Theory in AI Failure Analysis: methodological analysis of trace collection, coding, category formation, sampling, measurement, and their limits.
- [Failure understanding]({{< ref "ai-engineering/evaluation/framework/20-error-analysis" >}}): develops an evidence-linked failure model before operationalization and measurement. It distinguishes observed divergence from established root cause.
- Roles of error analysis: broader interpretations including specification discovery, oracle construction, ontology building, and causal hypotheses.
- Open-coding source chapter and error-analysis course chapter: supporting source material from the full-text search. The audit covers their outlines and matching passages, not the full chapters.
- Exploring Agent-Assisted Qualitative Analysis: a separate use of grounded theory, where agents assist with qualitative analysis itself. The audit covers the opening methodology and experiment setup. This connects discovery with LLMs to coding and interpretation, beyond failure analysis.
- Grounded theory links: a small reference stub, not a developed synthesis.

These uses stay distinct: an inspiration for learning across projects; a workflow-evolution analogy; a particular failure-analysis method; and agents assisting qualitative research.

### Discovery broader than prototypes


- [Operation model]({{< ref "ai/product/discovery/analysis-or-operation-model" >}}): the closest match to "prototyping, but not only." It includes research, reframing, observation, examples, comparison, sketches, and experiments as inquiry moves.
- [Exploratory design inquiry]({{< ref "ai/product/discovery/discovery-rewritten" >}}): the conceptual synthesis, including problem setting, reflection, and co-evolution of problem understanding and possible solutions.
- [LLM roles in discovery]({{< ref "ai/product/discovery/discovery-llm-roles" >}}): allows the LLM to introduce possibilities and choose useful representations without treating an illustrative construction choice as a settled direction.
- [Discovery vocabulary]({{< ref "ai/product/discovery/dictionary" >}}): distinguishes design knowledge, inquiry artifacts, and an eventual product.
- [Sensemaking and epistemic action]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}): supporting conceptual material, reached through the reading map and the document outline.
- [Interactive investigation principles]({{< ref "ai/design-research/collab-and-joint-work/joint-and-collap-principles" >}}): a navigation note with no hits under the initial keywords, pointing into the investigation research collection.
- [Twenty research problems]({{< ref "ai/design/ai-system-design/research-problems-and-prototypes" >}}): a proposed agenda using prototype comparisons to investigate representations, evidence, joint work, and change. The audit covers the outline and matching passages. It is an agenda, not a report of completed experiments.
- Literature discovery problem: adjacent application material with a particularly relevant distinction between an accurate result list and a complete search.

### Connecting discovery to product work


- [Discovery and delivery]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}): distinguishes work by purpose and obligations, and permits discovery and delivery to coexist.
- [Problem and response cycle]({{< ref "ai-engineering/delivery/outer-cycle" >}}): connects problem framing, response selection, project work, and revisiting assumptions.
- [AI uncertainty ladder]({{< ref "ai/product/discovery/uncertainty-ladder" >}}): distinguishes questions about possibility and feasibility and connects them to planning. The audit covers the opening sections. Its assertions about traditional software are claims in the note, not conclusions this audit verifies.
- [Experiments versus features]({{< ref "ai/product/product-model/experiments-vs-features" >}}): collected practitioner arguments about capability funnels, experiments, and roadmaps.
- [Product-model discovery/delivery collection]({{< ref "ai/product/product-model/discovery-delivery/mindset" >}}): additional draft material from the broader inventory. Read it alongside the operating-model notes rather than assuming all drafts agree.

## Library sources


- [Romme and Wegener 2026](/sources/research-methods/design-science/romme-2026-pragmatist-underpinnings-of-design-science-preprint.pdf.enc), *The Pragmatist Underpinnings of Design Science* -- on *Generalizing from concrete experience*
