---
draft: false
toc: true
description: "Separates original corpus-synthesis requirements from proposed guarantees, emphasizing that screening is not completeness and source precedence needs an inspectable task-specific policy rather than a universal score."
title: "06 Bounded Corpus Evidence Synthesis Comments"
linkTitle: "06 Bounded Corpus Evidence Synthesis Comments"
---
# Comments on evidence synthesis over a bounded corpus


Editorial context, 2026-04-20: Wording in this review and the linked research discussion has been edited for standalone reading. References to preserved or unchanged source wording describe the earlier reassembly; the review's judgments remain attributed commentary, not accepted decisions.

The comments below are new editorial analysis. Original arguments are retained with editorial wording in the [evidence-contract note]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}), [retrieval pipeline]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#bounded-corpus-retrieval-pipeline), and separate case material.

## Keep the author's requirements distinct


The opening requirements ask for complex-question search and synthesis over a closed corpus, links back to original sources, multiple representations, query processing, abstention, authority justification, corpus consideration, and repeated retrieval.

The original "analysis" heading begins the LLM response. The response's evidence contract, status list, authority rankings, and market recommendations are proposals. Their placement does not make them requirements accepted by the author.

The source-quality concern is generalized in this public edition. Source authority should be evaluated through provenance, applicability, versions, and support for the particular claim.

## Separate corpus consideration from completeness


The coverage ledger records supplied documents, parsing results, screening, deeper examination, and unresolved evidence requirements. A screening count shows that an operation ran across the listed corpus; it does not establish that the operation found every relevant fact.

The [iterative retrieval pipeline]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#bounded-corpus-retrieval-pipeline) proposes several representations and renewed searches when gaps remain. A loop and a representation inventory do not supply a completeness proof. A later implementation needs defined operations, failure records, stopping conditions, and evaluations against known evidence.

Claim support, source conflicts, and corpus coverage describe different conditions. A claim may have support while coverage remains incomplete. The proposed outcome list should therefore be examined before it becomes a single status field.

The existing [epistemic-contract note]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) concerns compiler obligations and runtime checks. The new note preserves the earlier evidence requirements and proposed user-facing records rather than duplicating that compiler discussion.

## Treat authority rankings as policies


The original document proposes engineering-document rankings and precedence rules for versions and approval. Their application depends on the investigation's scope and the status of the documents. An accepted document does not automatically govern every question.

The useful requirement is an inspectable policy with an explanation of its application to a conflict. The proposed hierarchy remains a candidate policy, not a universal authority ordering.

## Keep the selected Hebbia material identifiable


The passage marked "hebbia - interesting" now follows the Matrix execution case note. Its wording overlaps with descriptions already retained from the separate product analysis. Both original passages remain because they record different source documents.

Selection indicates interest, but the selected descriptions are not the author's own spoken reaction. The [original reaction]({{< ref "ai/design-research/interactive-systems/04-design-observations-from-hebbia" >}}) stays separate. The selected passage ends with a colon in the original document; no following diagram was removed during the split.

## Keep commercial hypotheses outside the general contract


The product-hypothesis note retains the LLM's market ranking, competitor claims, proposed engineering niche, full governance example, and initial product scope. Commercial demand and the recommended niche have not been established by this reassembly.

Document IDs, dates, and counts in the governance example are illustrative. No corpus was executed to produce the example's coverage figures.

The early Hebbia comparison bundles claims under a citation that the separate product analysis later corrects. Both passages remain linked so that the correction is not lost. Neither passage was independently verified here.

## Task-specific context assembly


The short sketch has no speaker labels. Its sentences remain saved statements rather than being assigned to the author or the LLM.

The [opening statement and related links]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}#task-specific-context-assembly) concern the evidence needed for a task. The [retrieval sentence]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#retrieval-methods-for-context-assembly) names methods for finding the evidence. A method can improve retrieval without establishing that the evidence is sufficient or that every relevant passage was found. The sketch provides no measurements for its retrieval claim.

The regulated-quality-systems sentence proposes an application domain, and its original "(?)" remains. The regulatory claim was not checked during the split. The domain proposal does not replace the engineering-governance candidate in the existing product hypotheses, and neither candidate is an accepted product choice.

The domain sentence has no final newline, and the existing product-hypothesis note also ends without a newline. A separate linked case note preserves both original endings without changing either passage. The abbreviated links and the original wiki link in the opening sketch are also unchanged.

## Audit


The [stage 4 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-4-semantic-engineering-dialogue) records all 439 original lines. Existing content in the Matrix and retrieval destinations was preserved before new sections were appended. The source path now provides navigation to the split rather than a second copy of the original passages.

The [stage 5 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-5-task-specific-context-assembly) records all eight lines of the short context-assembly sketch. Its general passages follow the existing evidence and retrieval notes, and its domain hypothesis remains in a separate case note. The earlier arguments remain present with editorial wording; the mapping records their historical source ranges.
