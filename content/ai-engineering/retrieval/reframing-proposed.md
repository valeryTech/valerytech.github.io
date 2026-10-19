---
draft: false
toc: true
title: "Reframing Proposed"
linkTitle: "Reframing Proposed"
---
# Context-to-Task Alignment and Evidence Workflows


This proposal develops an evidence workflow for knowledge-intensive tasks: finding, inspecting, collecting, comparing, and using source material. It specializes the [domain model]({{< ref "ai-engineering/retrieval/model" >}}), while the [main framing]({{< ref "ai-engineering/retrieval/reframing" >}}) remains a separate draft. The [editorial review]({{< ref "ai-engineering/retrieval/reframing-session-review" >}}) records the reasons for these distinctions.

**Context-to-task alignment** is the fit between working context and the requirements of the current task and consuming operation, under the applicable constraints. Acquisition and assembly help achieve that fit. Assessment makes the basis for proceeding, continuing investigation, or returning an unresolved result inspectable.

RAG describes retrieval-conditioned generation. An evidence workflow also has to explain the user's purpose, source scope, evidence decisions, changing requirements, and outcome checks. It can use generation, deterministic operations, and direct human inspection. It need not culminate in a generated answer.

## Begin with the current purpose


Some tasks are bounded: extract a field, compare two revisions, or verify a stated claim. Others begin as an inquiry: “What do my notes contain about DSLs?” Inspection can reveal distinctions the user could not specify before seeing the material.

Task-first design means beginning with the current purpose, constraints, and uncertainties. It does not require a complete specification before acquisition. The task interpretation and its context requirements remain revisable.

Discovery can complete the current job. A useful outcome might be a navigable set of source passages, a map of disagreement, or a better question. If the next operation is synthesis, it needs a different input view from the one used to browse candidates. If it is a calculation, original values and units may matter more than prose excerpts.

The inquiry develops through related decisions:

```text
Current task interpretation and next operation
                    ↓
Requirements and available investigation state
                    ↓
Acquire, inspect, and review material as needed
                    ↓
Assemble working context ↔ assess support and gaps
                    ↓
Choose: continue, clarify, revise, proceed, or stop
                    ↓ when proceeding
Person, deterministic operation, or model
                    ↓
Result and outcome checks → feedback to the inquiry
```


This is a vocabulary for feedback and dependencies, rather than a mandatory sequence of services or model calls. An exact lookup may need only a query, a source check, and presentation of the result.

## Keep sources, investigation state, and working context distinct


| Layer | What it contains | Responsibility |
| --- | --- | --- |
| Sources and observed external state | Documents, records, application observations, and their revisions or observation times | Preserve the material from which information was obtained. |
| Derived acquisition representations | Searchable passages, vectors, normalized fields, summaries, generated access questions | Expose aspects of source material for access. |
| Investigation state | Requirements, runs, candidates, selections, judgments, claims, gaps, and dependencies | Preserve enough of the inquiry to inspect, revise, or resume it. |
| Working context | Selected material, requirements, provenance, constraints, and instructions for one operation | Give that operation a bounded and usable input view. |

Sources can be mistaken, stale, or disputed. Original location establishes provenance, not factual truth or governing authority. Derived representations can introduce further errors and must remain distinguishable from source content.

Working context should be constructed from relevant available material rather than becoming the only record of the investigation. A comparison operation may need selected passages and unresolved conflicts; it does not need every discarded candidate or previous conversation turn. Earlier decisions can remain inspectable outside that input view.

The amount of retained state should follow the task. A sustained review can need claims, judgments, and dependencies. A direct record lookup need not become a persisted investigation.

## Design access around the information need


Retrieval engineering connects the task-shaped information need, searchable source views, matching and routing methods, and reliable source recovery. The [representation-design note]({{< ref "ai-engineering/retrieval/model-representation-design" >}}) develops this as a design method.

The request and retrieval query have distinct roles but can contain identical text. An exact identifier may be ready for lookup. A conceptual inquiry may benefit from alternative terms or representations, provided additions remain inspectable and can be challenged.

Generated questions, summaries, extracted claims, and normalized fields can help locate source material. They are access views rather than interchangeable evidence. Record what was copied, transformed, or generated and how each view maps to its source.

Independent routes can acquire material missing from another route. A reranker operating only on an existing pool can refine that pool but cannot recover sources outside it without additional acquisition. Preserve this distinction when interpreting an experiment.

## Match, read, and use at appropriate granularities


“Chunk” can hide several different units:

| Unit | Question it answers |
| --- | --- |
| Encoding context | What input influenced the computed representation, including added headings or surroundings? |
| Retrieval representation | What searchable object matched the query? |
| Retrieval hit | What did this run return, by which route, rank, and score? |
| Source occurrence | Where does the original material occur, in which observed revision? |
| Reading unit | What surrounding material is needed to interpret the match? |
| Selection | What did someone retain for a stated purpose? |
| Working-context unit | What will the named operation actually consume? |

A generated question can locate a paragraph; a sentence can locate a section; a row can require table headers and units. A token match can refer to a word whose vector was computed with surrounding text. Semantic ranking does not establish that a token-bounded chunk preserves the meaning needed for interpretation.

A useful design hypothesis is to match at the granularity that exposes the signal and recover the context needed to read it. Expansion retains the original locator and identifies the added material. Parent sections, adjacent paragraphs, and referenced exceptions are candidates for expansion, not automatically required additions.

## Review candidates without conflating their states


A hit is a candidate. Retrieval does not establish that it is true, applicable, or sufficient support for a claim. Display, inspection, collection, relevance judgment, authority assessment, and citation have different meanings.

An interface can combine actions for convenience. A click can collect a passage immediately, while the underlying record still distinguishes collection from a later judgment about support. Counterevidence may be worth collecting precisely because it challenges a conclusion.

Acquisition channels should expose their scope, matching rules, limits, and failure modes. Preserve the query and route for each candidate when combining channels. Review should distinguish rejected, uninspected, unavailable, and unresolved material where those distinctions matter to the inquiry.

An evidence set is a selected body of material for an inquiry or purpose. It can persist across operations. A particular working-context snapshot is a view selected from that material and other relevant state; neither collection nor inclusion proves support.

## Assess context for the next operation


The operative question is whether the selected inputs are adequate for the named operation under the current requirements and accepted uncertainty. The basis should be available for inspection.

For an illustrative policy comparison:

| Requirement | Observed basis | Remaining issue or decision |
| --- | --- | --- |
| Compare the intended revisions | Two documents with verified identifiers and revision metadata | Confirm whether both revisions apply to the requested scope. |
| Preserve obligations and exceptions | Selected clauses and parent sections | An exception refers to an annex that has not been inspected. |
| Produce a cited comparison | Source occurrences included in the planned inputs | Recover the annex before claiming a complete comparison, or explicitly limit the result. |

Assessment considers support, search scope, authority, freshness, source integrity, conflicting material, permitted use, and the consumer's required form and limits. Findings should refer to a requirement revision, the material considered, the method or reviewer, and unresolved issues. A single similarity score or “enough evidence” response does not establish all these conditions.

Assessment can be interleaved with inspection and assembly. A simple task can use direct checks. A complex inquiry may need explicit judgments that can be challenged or revised. No universal numeric adequacy threshold follows from the architectural principle.

Adequacy is relative to the next operation. Material can be adequate for presenting an unresolved disagreement while inadequate for choosing a governing policy. Checking the resulting comparison or action remains a separate responsibility.

## Accumulate material and stop for a stated reason


Two acquisition policies can coexist: inspect more of an already acquired candidate pool, or issue another acquisition request to address a gap. Keep their runs and dependencies distinct.

State can include remaining candidates, inspected material, selected source occurrences, judgments, requirement status, conflicts, and open questions. Review updates that state without requiring repeated synthesis of a final answer.

Distinguish stopping because:

- The requirements of the current operation have adequate support under the review policy.
- The current pool has been exhausted, with acquisition limitations still recorded.
- A time, token, cost, or evidence-count budget has been reached.
- A gap requires another source, clarification, or a different kind of judgment.
- The user chooses to stop or accept the current discovery result.

An evidence count is a limit rather than a sufficiency proof. Pool exhaustion establishes neither corpus completeness nor the absence of relevant information. For an exhaustive inquiry, unsearched or unreviewed material continues to limit the conclusion even when a plausible answer is available.

Before a consequential downstream operation, retain enough of its input snapshot or manifest to identify what it actually consumed: source revisions, selected material, ordering, transformations, and relevant constraints. The snapshot fixes the inputs for that run while allowing later revision of the inquiry.

## Preserve source identity and disagreement


For exact text mapping, use document identity, observed revision, and source extent. For records or live state, use the available resource identity, version, or captured observation. Paths, current line numbers, and text equality alone can be insufficient.

Equal extents can share one collection entry while retaining multiple acquisition routes. Contained and partially overlapping passages can remain separately inspectable and removable. The same words in different locations remain distinct occurrences. Unknown or stale mappings should remain unresolved.

Source-range coverage is a separate calculation. Several selected intervals can cover another span without replacing them with a new merged source object. Gaps remain gaps. Selecting loaded results for a document should not imply that the whole document has been reviewed.

Authority decisions and conflicting interpretations also survive collection. Deduplication or compression must not silently erase qualifications, draft status, counterevidence, or the reason one source was chosen to govern.

## Separate scores, judgments, and appearance


Retrieval ranking, source-word attribution, filtering, review judgments, and visual emphasis can appear together but make different claims.

| Quantity | Meaning |
| --- | --- |
| Retrieval score | Supports ordering within the stated matching method and route. |
| Attribution score | Relates a representation match to source words or spans under a stated method. |
| Filter | Determines which objects remain eligible or visible. |
| Review judgment | Assesses usefulness, support, authority, or another declared criterion. |
| Display curve | Converts a value into visual emphasis. |

A stronger highlight can make a mistaken match more persuasive. Appearance changes should not silently alter collection or evidence eligibility. A percentile describes a position in a distribution, rather than a calibrated probability of relevance. Scores across methods need a justified combination policy.

Subwords, special tokens, augmented inputs, and truncation can complicate source-word mapping. Missing attribution coverage should be explicit rather than repaired with invented scores or offsets.

## Compose operations and track changing inputs


Modularity becomes useful when operations exchange objects with explicit contracts:

```text
Acquire:   requirements + access decisions → candidates and run information
Review:    candidates + reading context + requirements → judgments and selections
Assemble:  available material + requirements + consumer contract → working context
Assess:    working context + requirements + scope and checks → findings and gaps
Perform:   declared working context + applicable controls → result
Verify:    result + observed state + success criteria → findings and further work
```


An operation can be performed by a person, deterministic software, or a model. Generation can produce prose, fields, queries, code, plans, or proposed calls. Producing an instruction is separate from validating and executing it; an executor must enforce applicable authorization and verify effects.

Where revision and auditability matter, retain the actual inputs, method or actor, parameters, outputs, and dependencies. Source changes can invalidate locators and freshness judgments; requirement changes can invalidate support assessments; new selections can make an earlier synthesis inapplicable. Preserve prior outputs when useful while representing which inputs they describe.

RAG and agentic control can coexist: retrieval-conditioned generation describes an operation, while an agent can choose which operations to perform. Fixed orchestration can use the same evidence contracts.

## Evaluate the boundary being claimed


| Boundary | Relevant checks |
| --- | --- |
| Source preparation and indexing | Synchronization, represented source scope, transformations, truncation, and version compatibility. |
| Acquisition | Reviewed recall and ranking, unique route contribution, latency, cost, and review effort. |
| Source recovery | Correct occurrence, revision, extent, reading context, and overlap relationships. |
| Attribution | Reviewed word or span mapping, missing coverage, and misleading emphasis. |
| Evidence review and context assessment | Support judgments, counterevidence, authority, gaps, exclusions, and consumer usability. |
| Consuming operation and outcome | Faithful use of declared inputs, task correctness, permitted execution, and verified effects. |

Index coverage, screening coverage, source-range coverage, requirement support, and judged retrieval recall have different denominators. Record the scope of each claim rather than treating them as interchangeable measures of completeness.

Runtime context assessment concerns a particular operation. Design-time evaluation concerns how reliably a method behaves across cases. An inspectable prototype can demonstrate an interaction or contract without establishing semantic quality or readiness for other tasks and corpora.

The [retrieval-design note]({{< ref "ai-engineering/retrieval/retrieval-design" >}}) develops small baselines, interactive comparisons, experiment records, and progressive automation. The architectural proposal supplies distinctions to test; it does not establish their implementation cost or benefit in advance.
