---
draft: false
toc: true
title: "Retrieval and Context Assembly for Code"
description: "Query understanding, task-aware retrieval for code, the hybrid graph-vector-lexical triad, context expansion, packing and index freshness."
linkTitle: "Retrieval and Context Assembly"
---

Code-oriented RAG is retrieval-augmented generation over codebases and their surrounding artifacts (tests, docs, issues, designs). A retriever indexes code and related assets; a generator conditions on the user request plus the retrieved context to produce grounded explanations, navigation, or edits consistent with the repository. This note covers the retrieval side end to end: understanding the query, choosing retrievers per task, expanding the context along the code graph, and packing it into the window.

The representations being searched are described in [code representation]({{< ref "projects/code-intelligence/code-representation" >}}).

## Query understanding


The raw query is a noisy signal. Before retrieval, it is turned into a structured request: \(f(q_{raw}) \rightarrow Q_{structured}\).

**Intent routing.** Classify the query to pick a strategy:

- *Direct lookup* ("Where is `MAX_RETRIES` defined?"): high-precision keyword search or a direct index lookup.
- *Multi-hop reasoning* ("How does the error rate of A relate to the deployment of B?"): query decomposition into sub-queries.
- *Meta or chit-chat*: skip retrieval.
- *Ambiguous or underspecified*: ask a clarifying question instead of retrieving.

A small classifier or fast LLM call (a "semantic router") does this. Classifying *complexity* as well as intent helps: simple lookups go straight to the index, complex ones go to a decomposition step, ambiguous ones go to a clarification loop.

**Constraint and entity extraction.** Separate hard constraints from the semantic core. "Summarize the Q3 2024 outage reports for the Payment Gateway" becomes a date filter, an entity filter (`service = "Payment Gateway"`) and a semantic core ("outage reports summary"). Filter on metadata first, then search the vector space; embedding "Q3 2024" is wasted effort.

**Query transformation.**

- *Expansion*: add synonyms and domain terms to raise recall.
- *Decontextualization*: rewrite "it broke yesterday" into "the login API broke yesterday" using conversation history.
- *HyDE*: embed a hypothetical answer instead of the question, which often aligns better with document chunks.
- *Step-back prompting*: first retrieve for an abstraction of the question ("general failure modes of the payment gateway").
- *Multi-query fusion*: generate several variants, retrieve for each, and merge with reciprocal rank fusion.

**Output.** A structured query object: rewritten query, embedding, filters, strategy (standard, decomposition, HyDE) and a top-k chosen by intent. The pipeline is: guardrails (PII stripping, injection detection) -> router -> extractor -> rewriter -> structured query.

### Three schools for the pre-retrieval phase


| School | Representative work | Core idea | Typical patterns |
| --- | --- | --- | --- |
| Chain (deterministic pipelines) | LangChain, Haystack | Every query passes through a fixed sequence of transformations | Step-back, multi-query fusion, HyDE |
| Agentic | LlamaIndex agents, AutoGen, assistants APIs | Retrieval is one tool; the model reasons first and may not retrieve | Router agents choosing a tool, ReAct, sub-question decomposition |
| Adaptive (self-correcting) | Self-RAG, CRAG | Retrieval is noisy, so a critic validates it before answering | Active retrieval only at knowledge gaps, relevance grading with fallbacks |

A practical synthesis combines them: a **triage** step classifies complexity, a **plan** step produces an explicit query plan (for "How did the Q3 migration affect API latency?": a time filter, a search over migration events, a metric lookup), and a **critic** step checks the plan before execution (does the time range exist in the metadata, do entity names map to canonical IDs?).

## Task-aware retrieval


The best configuration depends on whether the query is code-to-code (completion, in-repo edits) or natural-language-to-code (questions, issues, bug localization). The findings below come mainly from *Practical Code RAG at Scale* and CodeRAG-Bench.

- **Code-to-code.** Sparse lexical retrieval (BM25 with word-level splitting) is the primary retriever: it beat dense models on Long Code Arena completion with much lower latency. The query is the surrounding code (for example the last chunk of the file excluding the target line), and retrieval runs over the same repository. Word-level splitting builds the index up to about 9× faster than BPE-level splitting with no accuracy loss. For very tight latency budgets, IoU with line-level splitting is about 10× faster again, at lower accuracy.
- **Natural language to code.** Dense encoders (E5-large, Voyage code models) align descriptions with code semantics better than BM25 and raise NDCG for file ranking. Put issue titles, issue text and stack traces into the query.
- **Chunking.** For windows up to about 4k tokens, simple line chunks of 32 to 64 lines gave the best exact match for completion and matched or beat syntax-aware splitters. Very small chunks hurt coherence and packing. As the window grows (4k to 16k), chunks of 64 to 128 lines work better, and at 16k whole-file retrieval becomes competitive. Embedding models truncate long inputs (often at 512 tokens), so chunking still matters for dense retrieval.
- **Structure signals.** File paths, imports and module names as explicit tokens improve bug localization significantly. Directory proximity alone ("path distance") underperforms chunk-based retrieval for completion.
- **Reranking.** For completion, BM25 alone is often enough; dense reranking rarely pays for itself under tight budgets. For natural-language queries, merge dense and sparse candidate lists, or put structure-aware candidates first and backfill with BM25.
- **Graph- and requirement-aware retrieval.** For repository-level generation, a code graph with edges for imports, containment, inheritance, calls and semantic similarity is traversed from code anchors related to the requirement. CodeRAG builds a second graph over requirements (docstrings, tickets, design docs) and maps it onto the code graph; this bigraph beats BM25- and embedding-only RAG on DevEval. (The paper was retitled *GraphCodeAgent* in its second arXiv version.)
- **When retrieval helps.** Gains are large when retrieval surfaces canonical, high-quality documents (library docs, canonical solutions), but current retrievers often fail when lexical overlap is low or the window is tight. Weaker models gain the most; noisy context can make results worse.

Per-task weighting also differs: completion emphasizes a small radius around the edit point; bug localization weights stack traces, blame and historically buggy files; repository-level feature work needs requirement-to-code mapping.

## The hybrid triad


For code, a single vector store misses exact identifiers and structural links: embeddings blur names like `process_payment_v2`, and similarity cannot follow a call. The design therefore uses three complementary indices over one ID space (symbol, file, ticket). For completion, BM25 alone is often enough (see above), so the triad is aimed at natural-language questions:

| Index | What it holds | What it is for |
| --- | --- | --- |
| Vector (semantic) | Docstrings, symbol summaries, signatures, test and ticket descriptions | Concept queries ("How does auth work?") |
| Lexical (BM25 or inverted index) | Identifiers, error codes, stack-trace lines, file paths | Exact symbols ("Where is `process_payment_v2` defined?") |
| Graph | CALLS, IMPORTS, DEFINES, TESTS, IMPLEMENTS edges | Structural expansion from seed nodes |

A **summary index** of AI-generated file and module summaries supports high-level architectural questions. A **repository map** (a compressed file tree with key signatures) gives the model navigation ability before it reads anything in depth.

Retrieval runs in two stages. First, seed retrieval (vector plus lexical, merged and deduplicated) finds a small set of anchor nodes. Then graph traversal and slicing build a coherent subgraph around them, and local ranking within that subgraph picks the snippets most relevant to the question. This is a known GraphRAG pattern applied to a compiler-built graph.

## Context expansion


Top-k chunks are rarely enough for code. The context needs the "surrounding tissue":

- **Dependency linking.** If chunk A imports module B, a lightweight link lets the system fetch the definition of the imported function (multi-hop retrieval).
- **Definitions over usages.** For a question about `UserSession`, the class definition should outrank the hundreds of files that import it.
- **Envelopes and callees.** Inject the enclosing class signature and the signatures of called functions.
- **Query decomposition.** "Refactor the user service to use async" becomes: find the user service, identify the synchronous methods, then reason about the change.
- **Repository-walking fallback.** If the initial search fails, an agent can list and read files iteratively.
- **Reference graph at query time.** Pull related interfaces and base classes automatically while answering.
- **Augmentation indices.** Co-change partners, configuration values and design discussions are added by cheap precomputed indices (see [implicit knowledge]({{< ref "projects/code-intelligence/implicit-knowledge" >}})).

## Packing the context


- Rank chunks or files and pack them greedily in rank order until the token budget is used. Small budgets favor medium chunks; large budgets tolerate whole files. For ranking-only tasks (bug localization), retrieval quality (NDCG@k) matters more than packing.
- Order snippets logically: dependencies first, then the main logic.
- Wrap each snippet in tags with its path and line numbers (`<file path="..." lines="...">`), so the model does not invent file boundaries and can cite "line 42".
- Prefer high-density code (logic) over low-density content such as generated mocks, lock files and large JSON blobs.
- Serve the original code with comments, even when search ran over canonicalized code.

## Index freshness


A codebase changes constantly, and an index that is a few hours old can mislead during active development.

- **Incremental indexing.** Hook into CI so that a push to `main` re-parses and re-embeds only changed files.
- **Branch awareness.** Partition the index by Git reference (SHA or branch), or tag chunks with it, so the system can answer "what changed in `feature-x` compared to `main`?".
- **Stale pruning.** Remove vectors of deleted files so the model never cites "zombie code".
- **Staleness detection.** If a file changed since it was indexed, either re-index it or warn that the answer may be based on outdated code.
- **Recency as a ranking signal.** Prefer current code and documentation, but keep older decisions available when they explain the present structure.

## References


- *Practical Code RAG at Scale: Task-Aware Retrieval Design Choices under Compute Budgets*: [arXiv:2510.20609](https://arxiv.org/abs/2510.20609)
- CodeRAG-Bench: [arXiv:2406.14497](https://arxiv.org/abs/2406.14497), <https://code-rag-bench.github.io>
- CodeRAG, bigraph retrieval for real-world code generation: [arXiv:2504.10046](https://arxiv.org/abs/2504.10046)
- Long Code Arena: <https://openreview.net/forum?id=twV78Ytnve>

## Library sources


- [Anonymous 2025](/sources/30cb49de449fbee8fd7c2c4e3a1311da.bin), *Practical Code RAG at Scale* -- on *Task-aware retrieval*
- [Su et al. 2025](/sources/07ba0f45bfdd2995be6ffcc64777dea2.bin), *Dynamic and Parametric Retrieval-Augmented Generation* ([doi:10.1145/3726302.3731692](https://doi.org/10.1145/3726302.3731692)) -- on *Three schools: adaptive*

Further reading:

- [Gao et al. 2023](/sources/57b41d523d1c2e1414eb331b7c150eb6.bin), *Retrieval-Augmented Generation for Large Language Models: A Survey* ([arXiv:2312.10997](https://arxiv.org/abs/2312.10997))
- [Gao et al. 2025](/sources/d3f64fccb6acf62b35b4e70d7e0e588b.bin), *Synergizing RAG and Reasoning: A Systematic Review* ([arXiv:2504.15909](https://arxiv.org/abs/2504.15909))
