---
draft: false
toc: true
description: "Critiques editable query interpretations and retrieval projections, distinguishing generated representations from evidence judgments, confirmed intent from permission, and screening records from completeness guarantees."
title: "05 Multirepresentation Retrieval And Projections Comments"
linkTitle: "05 Multirepresentation Retrieval And Projections Comments"
---
# Multi-representation retrieval and projections: comments


New commentary by Codex, added on 2026-10-01. The comments primarily concern the newly imported [interactive RAG and query-understanding examples]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#interactive-rag-and-query-understanding). The initial question and reply remain unchanged above that section. The comments are interpretation, not original dialogue or verified results.

## Why both worked examples belong here


The first example describes retrieval through several query and document representations. The second example exposes the user's information need as an editable object. Keeping them together preserves the relation between an interpretation, a retrieval plan, and the evidence that can revise the interpretation.

The [paper proposal]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}) retains the motivation, literature review, principles, and evaluation agenda. Its [comments]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper-comments" >}}) explain why the proposed user study differs from the existing investigation benchmark.

The earlier [interactive-systems comments]({{< ref "ai/design-research/interactive-systems/00-index-comments" >}}#keep-inspection-separate-from-evidence-guarantees) already distinguish recorded screening from evidence completeness. The new examples do not remove that distinction.

## Representation labels are not evidence judgments


A generated question, claim, or concept representation is an interpretation of source material. It can help retrieve a passage while still misrepresenting the passage. A later design needs links back to the original text and records of how each representation was produced.

Naming a relation "answerability" or "support" does not demonstrate that the candidate answers a question or supports a claim. The relation needs a defined check and a way to retain uncertainty or disagreement.

The worked plan is a proposed vocabulary, not a formal type system or an implemented retrieval algorithm. The source also uses QUD without defining it locally. A later specification should define the terms and valid combinations before treating the plan as executable semantics.

## Editable interpretations and accepted intent


An editable interpretation lets a person inspect what the system inferred. A proposed interpretation should remain distinct from an interpretation the person has confirmed, and confirmation of an information need does not authorize unrelated external actions.

A later implementation needs rules for revising the active information need. Earlier interpretations and retrieval results should remain available with their assumptions and derivations. The design also needs to identify which results become stale after a revision.

The [program and execution record note]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) distinguishes problem revisions, program revisions, and runs. Links can connect the proposals without assuming that an edited query model is automatically a new executable program.

## Views, state, and correction


Coordinated views require rules for how an edit changes shared state. Merely drawing a matrix, graph, or checkbox does not establish consistent updates across interpretations and evidence.

The [interactive-systems collection]({{< ref "ai/design-research/interactive-systems/00-index" >}}) provides related proposals for state and views. A later design should distinguish changing a view from changing an interpretation, retrieval plan, or accepted evidence judgment.

Some edits can be reversed locally, while already performed external effects may not be reversible. Correction and undo therefore need an explicit scope rather than a general promise that the process can always be undone.

## Costs and outcomes still to measure


The reply suggests that correcting an exposed interpretation may be faster than further conversation. It supplies no comparison or measured interaction time. A later evaluation should include the effort required to understand and edit the representation.

The [evaluation agenda]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}#evaluation-agenda-and-closing-argument) proposes checking retrieval success, error diagnosis, recovery cost, and understanding. Increased visibility alone does not establish improvement in any of those outcomes.

The [mapping log]({{< ref "ai/design-research/reassembly-map" >}}#related-notes-pass-3-interactive-investigation-position-paper) distinguishes the new import from the initial dialogue. Original text and literature attributions remain unchanged, and no implementation is selected by the arrangement.
