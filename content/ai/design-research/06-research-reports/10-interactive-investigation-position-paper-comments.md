---
draft: false
toc: true
description: "A critique of the interactive-investigation paper proposal requiring source-to-principle support, scoped novelty claims, user studies of understanding and correction, and measurement of inspection costs alongside possible benefits."
title: "10 Interactive Investigation Position Paper Comments"
linkTitle: "10 Interactive Investigation Position Paper Comments"
---
# Interactive investigation position paper: comments


New commentary by Codex, added on 2026-10-01. The [paper note]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}) preserves original LLM text. The comments explain placement and design questions, rather than presenting the proposed paper as completed research.

## Why the paper material stays together


The motivation and literature review explain the seven proposed principles. The evaluation agenda describes how their application might be tested. Keeping the passages together preserves the source's argument about a synthesis paper without treating its publication recommendation as a decision.

The complete [worked examples]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#interactive-rag-and-query-understanding) belong with the existing retrieval discussion. The second example makes the evolving information need editable, so it stays with the first example's retrieval plan. The [retrieval comments]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections-comments" >}}) explain their technical limits.

## What the principles describe


The seven principles concern interactive information work. They are not a replacement for the six mechanics in the [joint-activity model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}), which describes collaboration more generally.

A designer could use the principles to ask which state and operations a person needs to inspect or change. The reply does not show that every application requires every principle, or that one fixed interface suits all information needs.

The literature table groups traditions by a design problem. It is a proposed synthesis, rather than a recorded systematic review or a complete account of each tradition. A later paper would need explicit links between each source, principle, and claimed design consequence.

## Motivation and claimed novelty


The reply proposes several explanations for a gap between established interaction ideas and current retrieval products. The explanations should not be treated as a measured account of product adoption. A later paper would need criteria for selecting systems and distinguishing their interfaces from their underlying computation.

The engineering-cost explanation is explicitly identified as an inference in the original. Preserving the inference label is important because the cited descriptions do not themselves establish a cost comparison.

The proposed novelty is synthesis and application to LLM-mediated retrieval. Adding the note does not verify the claim of novelty or the recommendation that the work is publishable. The Matrix observation and cited AI Chains example remain attributed context, not independent validation of the proposed architecture.

## Evaluation agenda and benchmark boundaries


H1 through H5 are hypotheses, not observed results. The source proposes metrics, but supplies no experiment, participant sample, or measured improvement.

The [existing investigation evaluation note]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) tests retrieval and contract behavior under controlled corpus conditions. The proposed agenda also concerns how people understand, diagnose, and correct the process. Questions about people's understanding require observations of users, rather than only successful execution traces.

A later study should define success and failure for each hypothesis. The comparison should account for the model, corpus, available operations, and computation budget. Interface learning and the time needed to inspect intermediate state should also be included in the cost.

The expert-benefit hypothesis needs definitions of expertise, ambiguity, and consequence. Improvement in confidence should be distinguished from improvement in accuracy or confidence calibration. Making more state visible may add work, so the study should allow for results that do not favor the proposed interface.

## Inspection, provenance, and guarantees


Inspectable state can help a person identify an error, but does not establish that all needed evidence was retrieved. A visible history also does not prove that a conclusion follows from its sources.

The [epistemic-contract note]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) and [provenance note]({{< ref "ai/design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations" >}}) discuss related obligations. The interaction proposal should not be presented as satisfying those obligations merely because it exposes representations and derivations.

The literature descriptions and product claims have not been independently checked during reassembly. The [mapping log]({{< ref "ai/design-research/reassembly-map" >}}#related-notes-pass-3-interactive-investigation-position-paper) records source fidelity, not research verification. No publication, experiment, or implementation is selected by the split.
