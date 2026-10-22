---
draft: false
toc: true
title: "Representation Design for Task-Relevant Retrieval"
description: "Design searchable views around a demonstrated access problem, then recover the original material needed to read a match. Test whether added access outweighs information loss, source-mapping errors, and upkeep."
linkTitle: "Representation Design for Task-Relevant Retrieval"
---

Representation design determines what aspects of source material become searchable and how a match can be recovered as usable source material. It starts with the information needs of a class of tasks and the limitations of the available sources.

A **retrieval representation** is a searchable view: a passage, normalized field, embedding, summary, generated question, table object, or relationship linked to the material it represents. Its usefulness depends on the access it enables, the information it loses or adds, and the reliability of source recovery.

This is one contribution to [context-to-task alignment]({{< ref "ai-engineering/retrieval/model" >}}). A successful match still needs interpretation, selection, and assessment before it can support a downstream operation. The [contract note]({{< ref "ai-engineering/retrieval/conceptual-alignment" >}}) separates those responsibilities, and [retrieval design]({{< ref "ai-engineering/retrieval/retrieval-design" >}}) describes how to compare candidate methods.

## Start with a task family and an access problem


Corpus design usually supports recurring task families. Runtime retrieval chooses among available representations for the current requirement; it need not derive a new corpus model for every request.

Begin with concrete scenarios. What would count as useful material? Where does it occur? What prevents the existing access method from finding or interpreting it? Useful difficulties include unfamiliar vocabulary, exact identifiers, table structure, dispersed evidence, missing qualifiers, and conflicting versions.

The user request, context requirement, and retrieval query have different roles but can contain identical text. An identifier can already be a suitable lookup query. A vague inquiry may need clarification, alternative queries, or inspection before its useful distinctions are known.

A practical design sequence is:

1. Describe the task family and the evidence or observations it needs.
2. Identify the source units and relationships that contain that material.
3. State the access failure in the current baseline.
4. Propose the smallest view or access change that could address it.
5. Specify what the view preserves, transforms, omits, or generates.
6. Define matching, filtering, and source-recovery behavior.
7. Compare the candidate with the baseline using reviewed cases and whole-task outcomes.

Generating more representations is a hypothesis about a particular access problem. It introduces preparation, synchronization, routing, and review costs. Retain a new view when its contribution justifies those costs.

## Describe a representation along independent dimensions


A catalogue can mix units, transformations, matching methods, and quality metadata as if they were interchangeable choices. Separate those dimensions when specifying a design.

| Dimension | Design question | Examples |
| --- | --- | --- |
| Source unit | What original material is represented? | Paragraph, section, table row, code function, record, image region. |
| Exposed content or relationship | What should become accessible? | Identifier, definition, claim, exception, entity, dependency, event, change. |
| Transformation | How is the view derived? | Segmentation, extraction, normalization, summarization, generation, linking, annotation. |
| Search encoding and access | How will the interface match or restrict it? | Exact field lookup, lexical terms, vector matching, structured filters, graph traversal. |
| Applicability metadata | What determines whether it can be used here? | Source revision, effective date, owner, approval status, access conditions. |
| Source recovery | How does a match lead to material that can be inspected? | Stable resource key, revision and span, parent section, table headers, transformation record. |
| Intended use | What operation should this access support? | Discovery, verification, comparison, extraction, calculation, navigation. |

These dimensions can be combined. A section summary can be searched lexically or through embeddings. A normalized identifier can occur in both a record and a passage. Authority metadata can constrain several views without becoming a separate semantic matching method.

Confidence is an attributed judgment with a method and target, rather than an intrinsic property that makes a source trustworthy. Likewise, provenance establishes origin and transformations; governing authority needs its own task-specific basis.

## Separate matching units from interpretation units


Several units can participate in one retrieval route:

| Unit | Role |
| --- | --- |
| Source unit | The original material and its location. |
| Encoding context | The exact input used to compute a representation, including added headings or surrounding text. |
| Retrieval representation | The searchable view that participates in matching. |
| Retrieval hit | A result of one run, with its query, route, rank, and score. |
| Reading unit | Original material shown or supplied to interpret the match. |
| Working-context unit | Material selected for a particular downstream operation. |

A generated question can locate a paragraph. A sentence can locate a section. A row may need its table headers and units to be interpreted. A word-level match may use vectors computed with surrounding text. The displayed unit and the encoding input therefore need not be identical.

Preserve those relationships. Expanding a hit should retain its original locator and identify the added material. A structural paragraph or token-bounded chunk is a boundary choice; semantic matching does not establish that the boundary preserves all meaning required by the task.

## Candidate views by information need


The following are options to investigate, rather than a required set of indexes or an exhaustive taxonomy.

| Information need | Candidate view or access change | Important preservation question |
| --- | --- | --- |
| Exact term, identifier, or error code | Original terms, identifier field, aliases, acronym map | Does normalization preserve exactness and distinguish different identifiers? |
| Concept or paraphrased explanation | Passage or section encoding, lexical expansion, generated access questions | Can the match be recovered from original material, including its qualifications? |
| Broad discovery or navigation | Section summary, topic view, document outline | Does an abstraction conceal exceptions or disagreement? |
| Entity lookup and aggregation | Normalized entities, canonical identifiers, alias relationships | Are uncertain identities and conflicting aliases distinguishable? |
| Claim comparison and verification | Extracted assertions linked to source spans and qualifiers | Is the assertion presented as an extraction rather than an established fact? |
| Rules, exceptions, and eligibility | Condition, obligation, deadline, and exception fields | Are scope, modality, exceptions, and source revision retained? |
| Document scope and surrounding meaning | Heading paths, parent-child links, adjacency, footnotes | Can the relevant parent context and referenced material be recovered? |
| Table or numeric reasoning | Table, row, schema, cell, and unit views | Are headers, units, missing values, and provenance preserved? |
| Dependencies and relationships | Entity, citation, ownership, or dependency links | What supports each relationship and what direction does it have? |
| Time, versions, and change | Effective dates, revision lineage, events, diffs, supersession links | Is observation time distinguished from the time a statement applies? |
| Authority and conflicting material | Approval metadata, source hierarchy, disagreement links | What makes a source governing for this task, and what remains unresolved? |
| Procedures and workflow guidance | Steps, preconditions, decision points, fallback paths | Does the view preserve ordering and conditions without implying permission to execute? |

A single source can support several views, and one view can serve several needs. An extracted rule can carry temporal metadata, belong to a document hierarchy, and be found through both terms and vectors.

## Define the view's contract


Before indexing a derived view, specify enough information to understand its behavior and maintain it:

| Contract element | What to record |
| --- | --- |
| Source binding | Resource identity, observed revision or snapshot, and extent where applicable. |
| Transformation | Method, relevant configuration, and which material was copied, normalized, inferred, or generated. |
| Encoding input | Actual text or data used, including augmentation, truncation, and surrounding context. |
| Matching interface | Query form, searchable fields, filters, ranking method, and result limits. |
| Source recovery | How a hit resolves to its original occurrence and suitable reading context. |
| Applicability | Freshness, authority, and access metadata required for the intended use. |
| Synchronization | What source or method changes require rebuilding or invalidating derived state. |
| Known limitations | Lost structure, ambiguous mappings, unsupported inputs, or coverage gaps. |

These can be ordinary records or configuration fields. The contract does not require a separate service for each view.

Generated questions, summaries, claims, and links can help discovery while introducing errors. Keep their generated content separate from original wording. A question about a deadline does not establish the deadline; an extracted policy condition does not settle which revision governs. Correction of an access view should not alter the identity of the original source.

If exact source recovery is unavailable, expose the limitation and restrict the claims the view supports. Approximate document association is different from a verified span suitable for exact citation.

## Three illustrative designs

### Exact identifier lookup


The user asks for `SEC-17B`. The current need is to locate that policy, rather than infer a broader topic. A baseline can query an identifier field or the literal source text using the request unchanged.

Check identifier variants, collisions, missing records, permissions, and applicable revisions. Add alias normalization only if real cases justify it. A result with a similar title is not an exact identifier match, and semantic expansion is not inherently useful for this task.

### Concept discovery across notes


The user asks what their notes contain about DSLs. Literal search can find explicit mentions; useful passages may also discuss language design without that acronym. A candidate semantic route or generated access questions can be compared with the literal baseline.

Recover original paragraphs and surrounding sections so the user can inspect meaning. Preserve the route that found each occurrence. Compare unique useful material, missed passages, mistaken associations, and review effort. The discovery task may finish with a navigable collection and open questions, without synthesis.

### Comparison across policy revisions


The user wants to understand how a requirement changed. The access problem includes locating the correct revisions, recovering clauses and exceptions, and preserving applicability dates.

A candidate design can combine revision metadata, original sections, structural links, and a change view. A summary may help navigation but should not replace the clauses needed for comparison. Assess whether the chosen versions apply, whether apparent differences reflect changed wording or changed obligations, and whether qualifications survive assembly.

These examples motivate different combinations. They do not show that one representation family is generally superior.

## Route, combine, and recover


Independent acquisition through several views can expose material absent from another route. Rescoring an existing candidate pool can change its order or selection but cannot recover source items outside that pool unless the operation also performs new acquisition.

When combining routes, preserve query, representation version, score meaning, and source identity. Equal source occurrences can share a collection entry while retaining several routes. Contained and partially overlapping occurrences need explicit relationships; text equality alone does not identify an occurrence.

Raw scores from different methods should not be treated as comparable relevance probabilities without a justified combination method. Ranking, source-word attribution, filtering, review judgment, and visual emphasis are separate contracts. A convincing highlight is not evidence that the match is useful for the task.

## Evaluate representation choices


Evaluation assets support design; they are not another family of runtime source representations. Keep task scenarios, reviewed relevance judgments, expected evidence, hard negatives, and failure cases separate from the material they evaluate. Whether they are searchable for an engineering task is a separate use case.

A useful comparison asks:

- Does the view recover reviewed useful material that the baseline misses?
- What useful material does it omit or obscure?
- Can each match be traced to the intended source occurrence and interpreted correctly?
- Do required metadata, qualifiers, and access constraints survive the route?
- Does the resulting working context help the downstream task under comparable budgets?
- What preparation, synchronization, latency, and human review costs does the view add?

Hold source snapshots, scenarios, and relevant limits comparable when attributing differences to a representation. Separate cases used to invent the method from cases used to challenge it. Include changes and failures: stale indexes, repeated text, ambiguous aliases, missing table headers, generated errors, and sources that do not cover the need.

A representation is useful when its demonstrated access contribution justifies its losses and costs for the intended task family. Context assessment and outcome verification determine whether particular results are usable in the current task.
