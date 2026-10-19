---
draft: false
toc: true
title: "Reframing Proposed"
linkTitle: "Reframing Proposed"
---
# Beyond RAG: Task-to-Context Alignment and Evidence Workflows


Retrieval-Augmented Generation describes a useful mechanism: retrieved information conditions generated output. A product architecture also has to explain what the user is trying to accomplish, how relevant information becomes usable evidence, which decisions remain open, and how the result will be checked.

The broader design problem is **task-to-context alignment**: determining and constructing the knowledge, state, constraints, and verification signals required for the user's current job. Retrieval is one means of acquiring them. Generation is one operation that may use them.

For knowledge-intensive work, this principle leads to an evidence workflow: an explicit process for finding, inspecting, collecting, interpreting, and using source material. Its state must remain inspectable and revisable as the inquiry develops.

## Begin with the user's job, including exploration


Some tasks are well specified: extract a field, compare two policies, or answer a bounded question. Others begin as an inquiry: “What do my notes contain about DSLs?” The user may need to see relevant passages before knowing which distinctions matter or what question to ask next.

Discovery can be the desired outcome. A useful result might be a navigable set of source passages, a map of disagreements, or a better formulation of the problem. Synthesis can follow later.

Task-first design therefore does not require a complete task specification at the beginning. It requires an explicit account of the current purpose, constraints, and uncertainties, with a way to revise them. Inspection can change the question; the changed question can require another acquisition route or a different representation.

The architecture should support that feedback loop:

```text
Inquiry and current requirements
            ↓
Acquire candidates → inspect source context → collect and judge
       ↑                                          ↓
       └──── revise question or address a gap ────┤
                                                  ↓
                                  explicit stopping decision
                                                  ↓
                                  bounded working context
                                                  ↓
                                  downstream task and checks
```


The downstream task may produce an answer, structured extraction, comparison, decision, or action. It can also return unresolved questions that reopen the inquiry.

## Distinguish sources, investigation state, and working context


These objects have different responsibilities and lifetimes:

| Layer | What it contains | Why it exists |
| --- | --- | --- |
| Sources and external state | Original documents, records, application state, and their revisions | Provide the authoritative material for the task. |
| Derived acquisition representations | Chunks, vectors, lexical indexes, extracted fields, generated retrieval aliases | Make aspects of that material searchable. |
| Investigation state | Acquisition runs, candidates, selections, judgments, questions, claims, and dependencies | Preserve what was considered and how the inquiry developed. |
| Working context | The selected inputs, requirements, provenance, and constraints for one operation | Give that operation a bounded, usable view of the investigation. |

An embedding index is a derived view of the sources. A selected set is a state of the investigation. A prompt is an input to an operation. Treating these as one object makes changes difficult to interpret and failures difficult to locate.

Working context should be constructed from the relevant state rather than becoming its only record. A synthesis call may need selected passages and unresolved conflicts; it does not need every discarded candidate or every previous conversation turn. Those earlier decisions can remain available for inspection without occupying the model's context window.

Outside document investigation, the same separation applies to live records and application state. Context preparation must preserve the authority and freshness required by the operation; successful execution still needs its own outcome checks.

## Retrieval units and reading units serve different purposes


“Chunk” often collapses several design choices:

| Unit | Responsibility |
| --- | --- |
| Encoding context | The input that influences a computed representation. |
| Retrieval representation | The searchable object used for matching. |
| Retrieval hit | One result of an acquisition run, with its route, rank, and score. |
| Source span | An addressable occurrence in an original source revision. |
| Reading unit | Enough original material to interpret the hit. |
| Evidence selection | A recorded choice to retain source material for an inquiry. |
| Working-context unit | Material included in a particular downstream operation. |

A generated question can locate a paragraph. A sentence can locate a section. A token-level match can highlight a word whose vector was contextualized by an entire chunk. The displayed passage need not be the text used for retrieval, and the text used for retrieval need not be sufficient for interpretation.

This gives a useful design pattern: **match at the granularity that exposes the signal, then read at the granularity needed to preserve its meaning.** Expansion should retain the original locator and record the added context. A paragraph, section, table, or code block is an interpretation choice, not automatically a complete semantic unit.

Semantic retrieval also does not imply semantic chunking. A model can rank structurally defined, token-bounded chunks semantically while having no role in choosing their boundaries.

## Retrieval engineering is representation alignment with source recovery


The user's expression and the corpus rarely expose information in the same form. A request can use a concept name while the source explains its consequences, gives an example, or answers a question without using that name.

Retrieval engineering aligns:

1. The task-shaped information need.
2. Searchable representations that expose relevant aspects of the sources.
3. Matching and routing strategies suited to those representations.
4. Reliable mapping from a match back to interpretable source material.

Possible representations include paragraphs, sentences, propositions, generated questions, contextual phrases, entities, tables, metadata, and relationships. They are alternative views, not interchangeable facts.

A generated question or extracted proposition can help locate a source without replacing it as evidence. Transformations should record what was generated, what was copied, and which exact source occurrence they refer to. A mistaken alias should be correctable without changing the source's identity.

Alternative representations can participate in different architectures. Independently indexed views can acquire candidates that another route missed. A second-stage scorer operating only on an existing candidate pool can refine that pool, but cannot recover sources absent from it. Representation experiments should make this boundary explicit.

## Design retrieval through small, interactive experiments


Task-to-context alignment also changes how the system is developed. Begin with a small real inquiry and the simplest inspectable baseline that can test its uncertainties. Treat the pipeline, including where an LLM belongs, as a design hypothesis.

Decompose the flow into elementary decisions with observable inputs and outputs: source preparation, query interpretation, acquisition, source recovery, ranking, context expansion, judgment, collection, gap assessment, and context assembly. Each boundary should make it possible to inspect a failure, compare an alternative, or change one decision while preserving the surrounding work. This decomposition does not require a separate service or user control for every operation.

People, deterministic software, and models can work on the same intermediate artifacts. A person can inspect candidates directly, a model can suggest aliases or judgments, and software can preserve source identity and record changes. Assign those responsibilities according to the operation and evidence of competence. Keep raw candidates available when testing optional model review or synthesis.

Interaction serves two loops: advancing the current investigation and learning how the pipeline should behave. An intervention with a recorded reason can suggest a policy; testing it on further cases determines whether it should become automation. Some useful decisions can remain interactive. The goal is a productive division of work that can evolve through evidence.

The companion [retrieval-design note]({{< ref "ai-engineering/retrieval/retrieval-design" >}}) develops the elementary steps, collaborative workflow, experiment records, and an iterative DSL example.

## Acquisition produces candidates; review gives them a role


A hit is a candidate. Similarity establishes neither factual truth nor support for a particular claim. Reading, collecting, judging usefulness, resolving authority, and citing support are distinct operations.

An interface can combine actions for convenience. Clicking a passage may immediately collect it. The underlying state should still distinguish that collection event from a later judgment that the passage supports a conclusion.

Acquisition channels should expose their contracts. Literal search, dense retrieval, a database query, and graph traversal have different matching rules, limits, and failure modes. Combining their outputs should preserve how each candidate was obtained. A unified view does not require erasing retrieval routes.

Review should preserve rejected and unresolved material where the task requires auditability. A rejected candidate, an uninspected candidate, an unavailable operation, an empty result, and a claim with missing support mean different things.

## Accumulate evidence and stop for a stated reason


Large investigations need a control policy as well as a retriever. One policy acquires a bounded pool and reads it in batches. Another issues new searches as gaps emerge. A workflow can combine them.

The review loop needs state: remaining candidates, material already inspected, collected source passages, judgments, task requirements, conflicts, and outstanding gaps. Each review step can update that state without repeatedly rewriting a final answer.

Stopping reasons should remain distinguishable:

- The declared requirements have adequate support under the chosen review policy.
- The current candidate pool has been exhausted.
- A time, token, cost, or evidence-count budget has been reached.
- A blocking gap requires clarification, another source, or human judgment.
- The user chooses to stop or deliver the current discovery result.

A count is a useful limit, but it is not a sufficiency proof. An LLM may propose that the evidence is adequate; its reasons and the requirements it considers satisfied should remain inspectable. For an exhaustive inquiry, unreviewed material and acquisition limitations still matter after a plausible answer becomes possible.

Before downstream synthesis, materialize the selected input snapshot. A fresh execution context can then use the selected original passages, relevant judgments, and unresolved conflicts rather than relying only on accumulated summaries. This snapshot fixes the inputs for that run; it does not prevent later revision of the investigation.

## Source identity and retrieval provenance are separate


Different routes can return equal, contained, or partially overlapping pieces of the same source. Text equality alone cannot resolve these relationships: the same words can occur twice in one document or in different documents.

Where exact mapping is available, use document identity, source revision, and source extent. Equal extents can share one collected entry with several retrieval routes. Contained and partial overlaps can remain separate objects with explicit relationships. Unknown or stale coordinates should remain unknown.

Selection coverage is a separate calculation. A set of selected ranges may fully cover another passage without replacing the original selections with a merged object. Gaps must remain gaps. A document checkbox that selects loaded results should not imply that every paragraph in the document has been reviewed.

Source provenance also does not settle authority. Two passages can be precisely located and still disagree. Contradictions, qualifications, draft status, and governing-source decisions should remain available to the task rather than disappearing during deduplication or summarization.

## Separate ranking, attribution, filtering, and appearance


Several quantities may appear in the same interface:

- A retrieval score ranks candidates within an acquisition route.
- An attribution score maps a representation match onto source words or spans.
- A filter decides which returned objects remain eligible or visible.
- A review judgment assesses usefulness or support for the task.
- A display curve converts a score into visual emphasis.

These quantities need separate contracts. A ranking method can work reasonably while its word-level attribution is misleading. A stronger highlight can make a mistaken match more persuasive. Changing appearance should not silently change eligibility, ranking, or collected evidence.

Model positions also need not correspond to whole visible words. Subwords, special tokens, augmentation, and truncated input complicate alignment. Missing attribution coverage should be explicit rather than repaired with invented offsets or scores.

Raw scores and percentiles are not calibrated relevance probabilities. A percentile describes a returned distribution; it does not establish that its strongest items are useful. Scores from different representation families or models should not be assumed comparable without a justified combination policy.

## Make composition and invalidation explicit


Modularity becomes useful when operations exchange named objects with clear contracts:

```text
Acquire:       inquiry + source scope + parameters → candidate set
Expand:        candidate + source revision         → reading unit
Review:        reading units + requirements        → judgments and selections
Assess gaps:   selections + requirements           → coverage and open issues
Execute:       declared input snapshot             → task result
Verify:        result + inputs + checks            → status and findings
```


An operation run should retain its inputs, parameters, output, actor, and relevant versions. Dependencies then emerge from normal composition. Reordering a view should not change those dependencies.

When a source, selection, requirement, or parameter changes, dependent results may become stale. Keeping their prior output inspectable is useful; presenting it as current is misleading. The system should distinguish a rerun from a revision of an earlier judgment.

People, fixed workflows, and agents can use the same operations. An agent changes how operations are chosen, not the need for source identity, declared inputs, and validation. RAG can be one operation inside such a workflow; agentic control and retrieval-conditioned generation are compatible dimensions.

## Evaluate the claim each boundary makes


Task success depends on multiple boundaries. Evaluation should preserve their differences:

| Boundary | Relevant checks |
| --- | --- |
| Index construction | Source synchronization, representation coverage, version compatibility, truncation. |
| Acquisition | Judged recall, ranking quality, route contribution, latency and cost. |
| Source mapping | Exact source recovery, revision checks, repeated occurrences, overlap integrity. |
| Attribution | Reviewed word/span matches, missing coverage, misleading highlights. |
| Evidence review | Selection usefulness, counterevidence, exclusions, requirement support. |
| Downstream execution | Faithfulness, task correctness, unresolved conflicts, permitted and verified actions. |

“Coverage” needs an explicit scope. Index coverage measures represented source material. Screening coverage measures reviewed material in a declared pool. Source-range coverage measures selected intervals. Requirement coverage measures support for the inquiry. Retrieval recall measures recovery of judged relevant items. These quantities can inform one another, but none substitutes for the others.

Versioning is part of this evaluation boundary. Source changes can invalidate evidence coordinates or relevance judgments. Representation changes can invalidate indexes. A compatible vector dimension alone does not establish compatible embeddings; model identity, transformations, templates, and measured runtime behavior matter.

Prototype checks can establish that a pipeline runs, preserves sources, and supports an interaction. They do not establish that one representation retrieves better than another. Readiness belongs to a stated task, corpus, profile, and evaluation, rather than to a tool choice or a convincing demonstration.

The architectural objective is reliable progress on the user's task through appropriate context and explicit evidence decisions. RAG remains a useful mechanism within that architecture. Evidence workflows explain how the surrounding knowledge work can remain inspectable, revisable, and testable.
