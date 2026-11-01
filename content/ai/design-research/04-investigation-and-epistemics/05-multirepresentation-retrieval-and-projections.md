---
draft: false
toc: true
description: "Proposes matching structured query and document representations while retaining retrieval signals and candidate histories, using pivotable views, editable information needs, and coverage ledgers for investigation."
title: "05 Multirepresentation Retrieval And Projections"
linkTitle: "05 Multirepresentation Retrieval And Projections"
---
# Multi-representation retrieval and projections


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Editorial navigation added on 2026-04-01. The retained passage begins below. -->

The complete question and reply follow the [composable-workspace dialogue]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}). The user asks how multiple document and query representations could support retrieval and inspection without making a dense cube the physical storage model.

The passage is kept in the investigation collection because it develops representations, retrieval passes, candidate histories, and coverage records. The [interactive systems index]({{< ref "ai/design-research/interactive-systems/00-index" >}}) includes it in the dialogue's reading order because the proposed inspection views also belong to interface design.

Related notes cover [investigation algebra]({{< ref "ai/design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra" >}}), [epistemic contracts]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}), and [provenance]({{< ref "ai/design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations" >}}). The [comments]({{< ref "ai/design-research/interactive-systems/00-index-comments" >}}) explain the difference between a recorded screening operation and evidence completeness.

The [reassembly map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}) records the original range and checksums. The original heading is retained below.

<a id="original-dialogue"></a>

## Initial questions and proposals

## pipelines


Initial question: Could a multidimensional matrix represent retrieval?

The author's existing approach uses tree-like structures with summaries and hypothetical questions for each paragraph or semantic unit, along with other representations, instead of one embedding per document.

The author also processes a query into several representations. Search could then return several results rather than one.

Open analogy: Would this resemble OLAP cubes or another structure?

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The LLM response supports the OLAP-cube analogy with a caveat: use it mainly as a logical model and inspection surface. It tentatively advises against physically storing retrieval as one giant dense cube because the cross-product explodes.

The proposed retrieval model has several independent dimensions.

For a document, you may have:

```text
Document
  ├── whole-document summary
  ├── section summaries
  ├── paragraph / semantic-unit text
  ├── hypothetical questions
  ├── extracted claims
  ├── entities
  ├── keywords / sparse representation
  └── embeddings
```


And these exist at several levels:

```text
document
  ↓
section
  ↓
subsection
  ↓
semantic unit
  ↓
sentence / claim
```


The query can have the same kind of expansion:

```text
Original question
  ├── normalized question
  ├── subquestions
  ├── hypothetical answer
  ├── concepts/entities
  ├── keyword form
  ├── semantic embedding
  └── alternative formulations
```


So retrieval is no longer:

```text
query_embedding × chunk_embedding
```


It becomes something closer to:

```text
query representation
×
document representation
×
document level
×
retrieval method
×
question facet
```


That is very naturally a multidimensional structure.

For example, logically:

```text
                         representation
                raw   summary   hypo-Q   claim
                  │       │       │       │
            ┌─────┼───────┼───────┼───────┐
paragraph   │     │       │       │       │
section     │     │       │       │       │
document    │     │       │       │       │
            └─────┴───────┴───────┴───────┘
                  document granularity
```


Then add another dimension for query representations:

```text
original query
subquestion A
subquestion B
hypothetical answer
keyword expansion
```


And another for retrieval method:

```text
dense
BM25
entity
exact phrase
metadata
LLM relevance
```


Conceptually, you could think of a score tensor:

```text
score[
    query_representation,
    document,
    document_unit,
    document_representation,
    retrieval_method
]
```


Most cells would never need to exist physically, which motivates the proposal to model it as a sparse cube or tensor.

The useful part of the OLAP analogy is that you can then "slice" the retrieval process.

For example:

> Show evidence found by hypothetical-question matching but missed by normal semantic search.

Or:

> Show documents retrieved by section summaries but not paragraph embeddings.

Or:

> For subquestion #4, which retrieval strategies produced the supporting evidence?

Or:

> Which documents were screened at document-summary level but never inspected at paragraph level?

That becomes very powerful for debugging and for the "prove you considered the corpus" problem.

The working interpretation is that the hierarchy adds another important property. This is not just a cube; documents have a tree structure.

You could perform coarse-to-fine retrieval:

```text
Corpus
  │
  ▼
document summaries
  │
  ├── likely irrelevant → stop
  │
  └── potentially relevant
          │
          ▼
      section summaries
          │
          ├── irrelevant → stop
          │
          └── relevant
                  │
                  ▼
             semantic units
                  │
                  ▼
               evidence
```


And perhaps the reverse in some cases:

```text
paragraph hit
   ↓
inspect parent section
   ↓
inspect document summary
   ↓
understand context
```


That gives you both efficiency and context.

The proposed hypothetical questions are particularly useful here. A paragraph such as:

> We prefer explicit composition of retrieval stages and avoid hiding retrieval policy inside a single opaque similarity score.

might generate:

```text
- How should retrieval stages be composed?
- Why avoid a single similarity score?
- Where should retrieval policy live?
- What is the recommended retrieval architecture?
```


Now a user's question may match one of those much more strongly than it matches the original paragraph lexically.

So each semantic unit has multiple projections:

```text
                 semantic unit
                      │
       ┌──────────────┼──────────────┐
       │              │              │
     text          summary      hypothetical Qs
       │              │              │
       ├──────────────┼──────────────┤
       │              │              │
    embedding      embedding      embeddings
```


The working interpretation is that this is a good idea.

The proposal extends beyond the OLAP analogy on the query side.

A complex question should probably become a tree or graph too:

```text
Question:
"What principles should govern our retry implementation,
and where do current practices violate them?"

             Q0
             │
      ┌──────┴──────┐
      │             │
     Q1            Q2
"What are the   "What are our
 principles?"    practices?"
      │             │
      └──────┬──────┘
             │
            Q3
      "Where do they
         conflict?"
```


Each node can have several representations.

So you have:

```text
query tree
     ↕
document trees
```


Retrieval is effectively matching two structured sets.

At that point, a graph is mathematically a better underlying representation than a literal cube because hierarchy and dependencies are first-class:

```text
QueryNode ─matches→ Representation
                    │
                    ▼
              SemanticUnit
                    │
              contained_in
                    ▼
                 Section
                    │
                    ▼
                 Document
```


But the **cube can be the UI projection**.

That would be quite elegant.

Imagine a Matrix like:

|Source|Raw text|Summary|Hypo-Q|Claims|Final evidence|
|---|--:|--:|--:|--:|--:|
|ADR-17|✓|✓|--|✓|Strong|
|Principles.md|--|✓|✓|✓|Strong|
|RFC-81|✓|--|✓|--|Weak|
|Incident-42|✓|✓|--|✓|Contradicts|

Then pivot it:

|Query facet|Dense|Sparse|Hypo-Q|Claims|LLM scan|
|---|--:|--:|--:|--:|--:|
|Retry principle|8|3|11|5|14|
|Idempotency|17|9|12|8|21|
|Current violations|4|14|3|12|17|

That's very OLAP-like: pivot, drill down, slice, aggregate.

And it gives the expert the ability to ask:

> Why did this result survive?

Clicking it could show:

```text
Evidence E81

Matched from:
  query representation:
    "What principles govern retry behavior?"

Against:
  hypothetical question:
    "How should failed external operations be retried?"

Semantic match: 0.82

Also found by:
  BM25: rank 17
  claim search: rank 3
  LLM screening: relevant

Parent section:
  Reliability / Failure Handling

Authority:
  Approved principle

Used in:
  Claim C12
```


That is much more inspectable than `cosine_similarity = 0.83`.

The critical proposed architectural choice is: **don't combine all those signals too early.**

A conventional retrieval system tends to do:

```text
many signals
   ↓
weighted score
   ↓
top 20
```


You lose information.

The proposal is to preserve multiple result sets longer:

```text
dense top-k ──────────┐
BM25 top-k ───────────┤
hypo-Q top-k ─────────┤
claim top-k ──────────┼→ candidate evidence pool
entity top-k ─────────┤
summary top-k ────────┤
LLM screening ────────┘
```


Then annotate each candidate with **why it entered the pool**.

After that you can deduplicate, rerank, expand parents/children, test authority, and perform evidence selection.

This also gives you a very useful concept for corpus coverage.

For every source you can store its path through the investigation:

```text
Document 182

document-summary screening     PASSED
section screening              3/11 potentially relevant
semantic-unit retrieval        7 candidates
deep evidence evaluation       7/7
final evidence                 2
rejected evidence              5

rejection reasons:
- 3 redundant
- 1 outdated
- 1 addressed another facet
```


Now "considered" has an actual operational meaning.

So the working interpretation is that the proposed architecture is starting to look like three layers:

```text
1. KNOWLEDGE REPRESENTATION

Documents
→ hierarchy
→ multiple representations
→ provenance
→ authority

2. INVESTIGATION COMPUTATION

Query decomposition
→ multiple query representations
→ many retrieval passes
→ candidate union
→ expansion
→ evidence evaluation
→ iterative reframing
→ synthesis / abstention

3. INTERACTIVE PROJECTIONS

Matrix
Graph
Evidence view
Coverage view
Authority view
Source view
```


And the earlier idea connects directly to this: the underlying investigation can be graph-shaped, while **Matrix becomes one pivotable projection of a genuinely multidimensional computation**.

The working interpretation is that that is a stronger model than simply copying Hebbia's "documents × prompts" Matrix. Hebbia's Matrix is effectively two-dimensional at the interaction level, with considerable complexity hidden behind each cell. The proposed system could make some of those hidden dimensions inspectable and manipulable.

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Interactive RAG and query understanding


The following retained passages are the complete worked examples from the [interactive-investigation paper proposal]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}). The earlier question and reply remain above. The sibling [comments]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections-comments" >}}) explain the new import and its limits.

### 4. Apply the principles to RAG


This becomes the concrete technical section.

Conventional RAG:

```text
Q
 ↓
query embedding
 ↓
top-k chunks
 ↓
LLM
 ↓
answer
```


Interactive investigation RAG:

```text
                    Raw query
                        │
                        ▼
              Information-need state
             /         |          \
     interpretations   QUDs    evidence needs
             \         |          /
                        ▼
                Retrieval planning
          ┌─────────────┼─────────────┐
          │             │             │
     raw-text       question       concept/
     retrieval       retrieval      graph
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                 candidate evidence
                        │
              human ↔ inspect/revise
                        │
                 evidence model
              /          |          \
          supports   contradicts   missing
              \          |          /
                        ▼
                     synthesis
```


And this is where our representation-relation work becomes useful.

Instead of only:

similarity⁡(E(q),E(d))

you have an inspectable retrieval plan:

(query projection,corpus projection,relation,evidence need)

For example:

```text
QUD
 × inferred-QUD representation
 × same-question relation

question
 × hypothetical-question representation
 × answerability relation

claim
 × proposition representation
 × support/contradiction relation

concepts
 × concept graph
 × associative-path relation
```


That gives the paper a concrete contribution beyond generic "make AI interactive."

### 5. Apply it specifically to query understanding


This may actually be the strongest worked example.

Current:

```text
user query
    ↓
hidden query rewriting/decomposition
    ↓
retrieval
```


Proposed:

```text
user query
    ↓
┌──────────────── Information Need ──────────────────┐
│                                                   │
│ Interpretation A            Interpretation B       │
│ confidence                  confidence             │
│ goal                        goal                   │
│ QUD                         QUD                    │
│ evidence needed             evidence needed        │
│ assumptions                 assumptions            │
│                                                   │
└───────────────────────────────────────────────────┘
                    ↕
                  user
                    │
                    ▼
              retrieval probes
                    │
                    ▼
                 evidence
                    │
          ┌─────────┴─────────┐
          │ evidence changes  │
          │ understanding     │
          └─────────┬─────────┘
                    ▼
          revised information need
```


Conversational-search research already establishes that underspecified queries can benefit from mixed-initiative clarification. ([aclanthology.org](https://aclanthology.org/2022.dialdoc-1.7/?utm_source=chatgpt.com "Conversational Search with Mixed-Initiative - Asking Good Clarification Questions backed-up by Passage Retrieval - ACL Anthology"))

Our extension is:

> clarification does not have to consist solely of the system asking another textual question.

The system can expose an **editable interpretation**:

```text
I think you're trying to:

[x] recover an earlier thought
[ ] investigate the topic generally

Important concepts:
[ embeddings ] [ similarity ] [ relevance ]

Evidence wanted:
[x] original occurrence
[x] later refinements
[ ] external literature
```


The user may correct that faster than having three more conversational turns.

That is where direct manipulation, mixed initiative, interactive IR, and LLM query understanding finally connect.

## Bounded-corpus retrieval pipeline


The following retained passage comes from the semantic-engineering dialogue. It retains the proposed document representations and the complete iterative retrieval pipeline.

The [requirements and evidence-contract note]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}) retains the author's request, coverage ledger, and authority discussion. Its [separate comments]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis-comments" >}}) distinguish a recorded screening pass from a completeness guarantee.

<!-- Bounded-corpus retrieval pipeline begins below. -->

### "Considered all documents" can actually be implemented


The recommendation is not to send every document to a 1M-token context.

Instead, give every document several searchable representations.

The idea here is sound:

```text
original
├── document metadata
├── hierarchy / headings
├── paragraph/chunk representation
├── paragraph summary
├── document summary
├── extracted claims
├── entities
├── hypothetical questions
├── sparse representation
└── embeddings
```


Then query processing becomes iterative.

The author's retrieval reframing is relevant here: it describes retrieval as context-to-task alignment, where representation, retrieval unit, matching strategy, authority rules and orchestration are separate design decisions. ([Tech Foundations](https://valery.tech/ai-engineering/retrieval/reframing/ "Reframing | Tech Foundations"))

The proposal is to extend that into something like:

```text
                         USER QUESTION
                              │
                              ▼
                      task interpretation
                              │
                              ▼
                    evidence requirements
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
              facet A      facet B      facet C
                 │            │            │
          query reframing / decomposition
                 │
                 ▼
       ┌───────────────────────────────┐
       │ corpus-wide screening pass    │
       │ every document gets evaluated │
       └───────────────────────────────┘
                 │
                 ▼
          candidate documents
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
    lexical    dense     generated-Q
    search     search      matching
       │         │         │
       └─────────┼─────────┘
                 ▼
          evidence extraction
                 │
                 ▼
            evidence ledger
       ┌─────────┼──────────┐
       ▼         ▼          ▼
    supports  contradicts  qualifies
       │
       ▼
            gap detection
                 │
              missing?
             ↙       ↘
           yes        no
            │          │
        reframe      authority
        question     resolution
            │          │
            └────┬─────┘
                 ▼
              synthesis
                 │
                 ▼
       answer / qualified answer /
              abstention
```


The recurring retrieval loop is useful because the first retrieval pass can reveal vocabulary and distinctions that weren't present in the user's query. That follows directly from the author's context-to-task alignment framing. ([Tech Foundations](https://valery.tech/ai-engineering/retrieval/reframing/ "Reframing | Tech Foundations"))

## Retrieval methods for context assembly


The source sketch names domain-specific extraction, query rewriting, and multiple document representations. The original sentence remains a proposal without supporting measurements in the sketch.

The [evidence-contract statement]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}#task-specific-context-assembly) is retained separately. Read the [comments]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis-comments" >}}#task-specific-context-assembly) for the grouping.

<!-- Context-assembly retrieval sketch begins below. -->

retrieval quality benefits from domain-specific extraction, query rewriting, and multiple document representations.
