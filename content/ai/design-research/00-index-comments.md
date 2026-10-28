---
draft: false
toc: true
description: "An internal consistency review of the research collection, identifying unresolved operator trust, language design, correctness, coverage, acceptance, replay, and evaluation distinctions before selecting a falsifiable study."
title: "00 Index Comments"
linkTitle: "00 Index Comments"
---
# Comments on the design-research collection


These comments were added by Codex on 2026-09-30 at the user's request. This is an internal consistency review of the reorganized notes, not new source dialogue, an agreed architecture, or an external literature review. The [index]({{< ref "ai/design-research/00-index" >}}) remains the reading guide, and the [reassembly map]({{< ref "ai/design-research/reassembly-map" >}}) records the text moves.

## Keep proposals separate from decisions


The collection now distinguishes the general theory, a builder method, and several applications. That distinction should remain explicit when a proposal moves from one note to another.

The [research-direction dialogue]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) recommends an investigation paper. The [behavioral evaluation dialogue]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}#best-first-experiment) recommends a synthetic UC-1 case within that application. These are different proposals in different contexts, not two accepted instructions for the same first experiment. The [scope note]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) does not select either.

A runtime, database, graph, or DSL is a possible implementation choice. It should not silently become the definition of the general research question.

## Design choices that still need an explicit answer

### A constrained core and an extensible operator set


The earlier [compiler concentration proposal]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}#concentration) favors a small language. The later [operator-extension discussion]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}#7-keep-the-operator-set-extensible-and-its-contracts-controlled) permits controlled extensions.

These positions may be compatible if language constructs remain fixed while registered operators carry explicit contracts. That is a possible interpretation, not a settled design. The remaining questions concern who registers an operator, what evidence supports its contract, and which guarantees rely on trusting its implementation.

### Generated procedures and maintained declarations


[Behavioral compilation]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) focuses on generating executable behavior. The [declarative model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) emphasizes a maintained shared program, partial specifications, and refinement.

An imperative authoring interface could produce a declarative internal representation, but the notes have not selected that arrangement. State whether these are alternative authoring modes, different layers, or different applications before treating their examples as one language specification.

### Compiler validity and semantic truth


The early compiler dialogue says that hallucinated programs do not compile. Read that claim against the later [verification distinctions]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) and [conditional investigation argument]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}#the-formal-core).

A program can pass structural checks while its model operator makes an incorrect judgment. A source reference can exist without supporting the attached claim. Any soundness claim must state the operator assumptions, the checked property, and the point at which it holds. The broad early wording should not become an unconditional correctness claim.

## Terms that should not be merged


| Term | Distinction to retain |
|---|---|
| Coverage | Processing all declared inputs, satisfying required facets, supporting output claims, and finding all relevant evidence are different properties. |
| Provenance | A valid derivation or source link does not establish that the source supports a claim. |
| Accepted | Acceptance concerns a particular revision, purpose, and policy. It is not automatically authority to publish or act. |
| Graph dependency | Task dependence, executable control, evidence support, and artifact history are different relationships. |
| Replay | Reusing recorded observations is different from calling a model or external system again. |

The [typed investigation report]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}), [program-history comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}), and [verification note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) contain the relevant distinctions. Keep the relationship and status names explicit rather than choosing one word for several meanings.

## Claims that still need evidence


The [three evaluation plans and their comments]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) separate evidence quality, runtime enforcement, and program generalization. Success in one does not establish the others.

A program synthesized for one case is not yet a reusable procedure for a task family. The synthesis target and independent evaluation cases need to be named. Likewise, a correct execution trace does not establish that a person gained a better understanding of a problem.

The [sensemaking note]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}) treats better understanding as an outcome. The three grouped evaluation plans do not yet provide a separate concrete study of that outcome.

The [proposed generativity measure]({{< ref "ai/design-research/01-foundations/07-constraint-guarantee-and-composition-models" >}}#generativity-itself-needs-a-better-formal-measure) is a research formulation. Its extension sets still need a usable definition and measurement procedure before it can serve as an established experimental metric.

Novelty arguments, benchmark descriptions, and claims about named systems remain attributed to the retained reports. This pass did not verify them against current external sources. The investigation results table is explicitly illustrative, not measured.

## Source and navigation findings


The local separation note (archived source 001) contains UC-1 properties and distinguishes a draft from publication. It is relevant source context, but it does not identify or replace the originally attached domain-model document. The [evaluation comments]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) record the limits of that check.

The old [sensemaking redirect]({{< ref "ai/architecture-dsl-like/sensemaking" >}}) names `02-sensemaking-and-epistemic-partnership`. The current destination is [Sensemaking and epistemic action]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}). This review records the stale redirect without changing the legacy note.

## Suggested next decision


Choose one research question and write down the claim, the property being checked, the assumptions, and the evidence that could refute it. That choice should precede another architecture or implementation pass. No first experiment has been chosen by this review.
