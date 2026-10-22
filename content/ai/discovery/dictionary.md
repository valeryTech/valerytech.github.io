---
draft: false
toc: true
description: "Design knowledge, inquiry artifacts, and the eventual product are different outcomes. A vocabulary and taxonomy clarify how sketches, frames, prototypes, observations, rationale, and decisions contribute to each."
title: "Dictionary"
linkTitle: "Dictionary"
---
# Discovery vocabulary


The primary thing is an **evolving model of the design situation**: what the situation is, possible ways to frame it, what you know, what remains unclear, possible directions, constraints, and provisional commitments.

The concrete things created along the way are **inquiry artifacts**. A useful taxonomy is:

|Artifact|Purpose|Examples in knowledge-system exploration|
|---|---|---|
|**Exploratory artifact**|Make something visible enough to think about|sketches, rough UI, manually assembled search results|
|**Prototype / probe**|Experience or test a possibility|evidence-discovery UI, fake retrieval flow|
|**Conceptual model**|Describe what you currently think exists|`InquiryState`, `DesignSituation`, evidence acquisition channels|
|**Design-space representation**|Keep alternatives and dimensions visible|lexical vs semantic, passage vs claim, automatic vs explicit expansion|
|**Frame**|Express a possible interpretation of the problem|"search system" -> "evidence exploration" -> "interactive inquiry system"|
|**Research artifact**|Add outside knowledge|literature notes, examples of existing systems, technical investigation|
|**Evidence / observation record**|Capture what happened during inquiry|"I wanted full-form matches after seeing literal matches"|
|**Question / uncertainty**|Record what should be investigated next|"Should retrieval provenance be visible?"|
|**Technical probe / spike**|Learn about feasibility|try BM25, embeddings, parsing real Markdown|
|**Comparison artifact**|Distinguish alternatives|same `DSL` case rendered using three interaction models|
|**Design rationale**|Preserve why the model changed|observation -> interpretation -> hypothesis -> commitment|
|**Commitment / decision**|Establish something as stable enough to build on|"passages are currently the base evidence unit"|
|**Working system**|Integrate commitments that have survived inquiry|eventually, the actual product|

The [operation model]({{< ref "ai/discovery/analysis-or-operation-model" >}}) uses this distinction: inquiry moves include research, reframing, sketches, conceptual models, prototypes, comparisons, technical spikes, and counter-evidence searches. There is explicitly no requirement for an iteration to contain a prototype.

The overall process can be represented as:

```text
                 inquiry
                    │
        ┌───────────┼─────────────┐
        │           │             │
      inspect     represent      make
        │           │             │
    research     models/maps    prototypes
    examples     frames         technical probes
    evidence     alternatives   partial systems
        │           │             │
        └───────────┼─────────────┘
                    ↓
             observations
                    ↓
          revised understanding
                    ↓
       evolving design situation
                    ↓
       provisional commitments
                    ↓
              built system
```


There are therefore two meanings of "building."

At the **epistemic level**, you are building **design knowledge**: progressively better frames, questions, distinctions, possibilities, and justified commitments. The documents explicitly treat progress this way; even discovering additional ambiguity or more possible directions can count as progress.

At the **artifact level**, you are building **inquiry artifacts** that help produce that knowledge. A prototype is one class of inquiry artifact, useful when making something concrete lets you experience, compare, or challenge an idea.

At the **product level**, a possible direction is an **interactive inquiry system**: something that supports an evolving inquiry through probes, evidence acquisition, evidence organization, interpretation, and synthesis. Its inquiry state changes as evidence is encountered.

A concise formulation is:

> **We build inquiry artifacts in order to build an evolving model of the design situation, from which justified product commitments and eventually the system itself emerge.**

That gives "prototype" a clear place without making it synonymous with the work.
