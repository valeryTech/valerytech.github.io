---
draft: false
toc: true
title: "Reframing Session Review"
linkTitle: "Reframing Session Review"
---
# RAG reframing: design lessons for evidence workflows


Review date: 2026-10-19.

The existing [reframing note]({{< ref "ai-engineering/retrieval/reframing" >}}) makes a useful architectural argument: begin with the user's task, and treat retrieval and generation as components within it. A more concrete design principle follows: **knowledge work needs explicit, revisable evidence state, of which an LLM's working context is only one temporary projection.**

I would preserve task-to-context alignment as the broad design principle and develop evidence workflows as its application to knowledge-intensive tasks. The strongest rewrite would explain the objects, decisions, and feedback loops that this principle requires. A [proposed replacement]({{< ref "ai-engineering/retrieval/reframing-proposed" >}}) accompanies this review.

## Scope


This note develops architectural distinctions and editorial recommendations for evidence-oriented retrieval systems. Its examples illustrate design choices; they do not establish retrieval quality or production readiness. Those claims require evaluations appropriate to the boundary being assessed.

## Design lessons

### Discovery is a product outcome


A user may want to discover passages spread across documents before selecting evidence or asking for synthesis. An answer-oriented interface can move too quickly past that discovery task.

The important lesson is not merely that final output can be something other than prose. Discovering material, understanding a corpus, and forming a better question can themselves complete the current user job. The existing note mostly describes context construction as preparation for another operation. It should give discovery equal standing.

Task-first also needs an exploratory interpretation. A person may begin with “DSL” and discover the distinction they actually need while inspecting passages. The task does not have to be fully specified before context acquisition begins.

### Retrieval, reading, and highlighting use different units


A dense result may be a heading-aware, token-bounded chunk. Its embedded input can include a title and heading path that are not visible in the result body. Semantic ranking does not imply semantic boundary detection.

Several distinct objects therefore need explicit meanings:

| Object | Question it answers |
| --- | --- |
| Encoding context | What surrounding input influenced this representation? |
| Retrieval representation | What searchable view matched the query? |
| Retrieval hit | What did this particular acquisition run return? |
| Source span | Where does the authoritative text occur? |
| Reading unit | What paragraph or section is needed to interpret it? |
| Highlight span | Which visible words can the match be mapped onto? |
| Downstream context | What selected material should this operation consume? |

One representation can locate a larger reading unit. Several representations can point to the same source. A displayed paragraph can use token vectors contextualized by a larger stored chunk. None of these relationships is captured by calling everything a “chunk.”

This should become a central section of the note, replacing part of the generic catalog of retrieval techniques.

### Evidence acquisition is a controlled process


An evidence-acquisition loop can evaluate candidates with surrounding context, accumulate useful material, and stop according to a criterion over the collected evidence and corpus. A separate phase can then consume the assembled set.

Two distinct control policies should be explicit:

- Scan more of an already acquired candidate pool.
- Form a new acquisition request when the current pool cannot address a gap.

The existing note's linear diagram should become a loop with explicit state and stopping reasons. A fixed pool provides an inspectable acquisition boundary; it does not provide completeness. Dynamic retrieval can address gaps; it also creates new runs and dependencies that need to be recorded.

Stopping after a count or budget is a resource decision. Stopping because declared task requirements are supported is an evidential judgment. Exhausting a candidate pool establishes neither corpus completeness nor task sufficiency. An LLM's “enough” judgment needs an inspectable basis.

### Source identity survives changes in retrieval method


Source identity should use verified source coordinates: document identity, revision, and exact extent. Paths, line numbers, and displayed text alone can be insufficient when sources change or passages overlap.

This makes several distinctions possible:

- Equal source extents can share one collected entry while retaining every acquisition route.
- Contained or partially overlapping passages remain separately inspectable and removable.
- The same text at different locations remains distinct.
- Several selected intervals can cover another passage without creating a new merged source object.
- Missing, changed, or ambiguous coordinates do not justify an overlap claim.

This is more than deduplication. It separates the identity of evidence from the method that found it. A representation or query can change without becoming the identity of the source material.

An implementation should document this identity contract and verify it with both real-corpus and synthetic checks.

### Scores, decisions, and appearance need separate meanings


Subword matching can produce misleading common-word highlights. Whole-word attribution, paragraph ranking, filtering, and score-to-opacity mapping need separate definitions and checks. Improving aggregation alone does not establish that related concepts will be found reliably.

The lesson is stronger than “tune the threshold.” Retrieval similarity, source-word attribution, relevance judgment, source authority, evidence sufficiency, and visual intensity are different quantities. A polished highlight is not an explanation of semantic correctness. A percentile is a position within the returned score distribution, not a relevance probability.

The note should also state that a reranker or finer representation operating only on dense candidates cannot recover material missing from that candidate pool. Independent acquisition through another representation is a different architecture from rescoring the same pool.

### Investigation state is larger than working context


Typed operations, branches, materialized outputs, evidence decisions, claims, and stale dependencies can make an investigation inspectable and revisable.

The architecture therefore needs to distinguish:

1. Authoritative sources and derived indexes.
2. An investigation's runs, candidates, selections, judgments, questions, and dependencies.
3. The bounded working context assembled for one model invocation or operation.

A prompt cannot be the sole record of an investigation that must survive changing questions, evidence decisions, or source revisions. A future persisted investigation would retain more information than any individual call should consume.

Interaction prototypes can demonstrate these contracts. Persistence and model-backed operations require separate implementation and validation.

## What to retain, change, and shorten


| Existing material | Editorial change |
| --- | --- |
| Task-to-context alignment | Retain as the main broad principle; include evolving inquiries. |
| Intent → representation → matching | Retain, then add mapping back to sources and assembling interpretable reading units. |
| Critique of vector-store-centered design | Compress into one opening section. The rest should demonstrate the alternative. |
| Repeated explanations that retrieval is only one context source | Consolidate. One paragraph and a compact example are sufficient. |
| Long catalog of possible LLM roles | Shorten. Model placement follows operation contracts; it is not the main contribution. |
| Linear architecture | Replace with an acquisition/review loop and a separate downstream execution phase. |
| Modularity section | Give concrete types, identities, state transitions, and failure states. |
| Terminology taxonomy | Reduce to a few necessary terms; present new umbrella labels as proposed vocabulary. |
| Context lifecycle | Distinguish reusable investigation state from per-operation working context. |

I would soften “the G is misleading.” RAG remains useful for describing retrieval-conditioned generation, and richer retrieval/generation systems can have loops and state. The issue is using that mechanism as a complete product specification. The note does not need to narrow all RAG to a naive linear chain to justify a larger architectural boundary.

Likewise, agents are not a disjoint alternative to RAG. Agency describes who chooses operations; RAG describes a relationship between retrieval and generation. An agent can use RAG, and an evidence workflow can use fixed orchestration.

## Add these distinctions explicitly

### Collection is not evidential acceptance


A passage can be retrieved, displayed, inspected, collected, judged useful, or cited in support of a particular claim. Those are separate states even when one gesture updates several of them. An interface may offer a quick collection action while keeping collection conceptually separate from verification or acceptance as support.

### Coverage needs a denominator


Use explicit names for at least four scopes:

- **Index coverage:** how much of the intended source snapshot has a searchable representation.
- **Screening coverage:** how much of a declared candidate pool has been inspected or processed.
- **Source-range coverage:** whether selected intervals cover another exact source span.
- **Requirement coverage:** which parts of the inquiry have adequate support, qualification, or unresolved conflict.

Measured retrieval recall is another quantity: recovery of judged relevant items under a stated evaluation. None of the four coverage scopes substitutes for it.

### Authority and disagreement survive selection


Selecting a passage does not establish that it is true, current, or governing. Conflicting drafts, qualifications, and counterexamples can all be relevant. Source authority and conflict handling should be explicit decisions. “No retrieved support” is different from “the corpus establishes absence.”

### Evaluation follows the boundary being claimed


Use acquisition recall for acquisition, mapping integrity for provenance, reviewed word matches for attribution, and support/coverage checks for downstream work. A passing schema test does not validate semantic relevance; an attractive mock does not validate synthesis.

Experimental access and production readiness are different decisions. Acceptance should be scoped to a profile, corpus snapshot, and reviewed judgment set. Numerical thresholds are product policies, not general RAG principles.

## Proposed structure


1. RAG describes a mechanism; the product needs an outcome and evidence contract.
2. Tasks can begin as evolving inquiries.
3. Sources, investigation state, and working context have different lifetimes.
4. Retrieval units, reading units, and evidence identity must be separated.
5. Representation alignment includes reliable mapping back to sources.
6. Acquire, inspect, accumulate, assess gaps, and stop for an explicit reason.
7. Reconcile overlapping source material without erasing retrieval routes or disagreement.
8. Keep ranking, attribution, filtering, judgment, and appearance separate.
9. Use typed operations and invalidate results when inputs change.
10. Evaluate each boundary and deliver a result or an explicit unresolved state.

The [proposed replacement]({{< ref "ai-engineering/retrieval/reframing-proposed" >}}) follows this structure. It develops the architectural lessons without treating prototype behavior as validated production architecture.
