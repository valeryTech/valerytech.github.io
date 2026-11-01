---
draft: false
toc: true
title: "Code Intelligence"
description: "A worked concept for an engineering assistant that combines structural code analysis, hybrid retrieval, and human verification."
linkTitle: "Code Intelligence"
---

This is a worked concept for a codebase-aware engineering assistant that reasons about a codebase as a connected software system. It is a design exploration, not a description of a completed or shipped product.

## Problem


Many code assistants began by retrieving text that looks relevant to a question. Current coding agents mostly search with grep and read files in a loop, and some add structural tools such as repository maps and language-server queries. Both approaches find text well, and persistent agents find a lot. Neither, by default, shows how a system is put together. A change may depend on a type hierarchy, an interface contract, a service boundary, a runtime dependency, or an architectural convention that is not visible in the nearest text fragments, or on history and configuration that no code search reaches.

The assistant should help an engineer find and understand those relationships before proposing a change.

## Positioning


None of the building blocks is new. Code graphs, AST chunking, language-server tools for agents, graph-guided code localization and links between code and its history all exist, and several systems already combine a code graph with an LLM agent ([related work § Positioning]({{< ref "projects/code-intelligence/related-work" >}}#positioning)). A literature search on 2026-11-05 found both parts of the original bet partly covered: commit history, co-change and runtime traces are already used as LLM context, and structural indexes have already been compared with grep agents. What remains is narrower:

- configuration and infrastructure evidence linked to code, and history, configuration and runtime evidence combined for open developer questions rather than benchmark repair;
- a cumulative per-level ladder (syntax, symbols, call and data flow, history) against both a tuned lexical baseline and a grep agent, split by evidence spread and by lexical overlap between question and code.

Both are hypotheses with refutation criteria in the [thesis and evaluation plan]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}). Where prior work already covers the rest, the project is a replication and a practical build, and should be described that way.

## Design goals


- Preserve meaningful code structures instead of splitting files into arbitrary chunks.
- Combine textual retrieval with symbols, references, dependencies, and repository structure.
- Show the evidence used to form an answer and let the engineer correct the search path.
- Prefer current code and documentation when older material no longer represents the system.
- Support design and refactoring work without pretending that structural evidence proves runtime behavior.

## System outline

### Structural index


Language parsers build an index around modules, classes, functions, interfaces, and imports. Abstract syntax trees provide the basic boundaries. Language Server Protocol data adds symbol definitions, references, and type relationships where the language tooling supports them.

This structure gives the assistant better retrieval units and a graph of relationships that can be followed across files and packages.

### Hybrid retrieval


A request is resolved through several complementary signals:

1. Text and semantic search identify likely concepts and documentation.
2. Symbol search identifies concrete implementation candidates.
3. Dependency traversal expands from those candidates to callers, implementations, tests, configuration, and related services.
4. Repository metadata supplies ownership, recency, and change history where available.

No single signal is treated as authoritative. The result is a set of candidate paths with an explanation of why each path may matter.

### Temporal relevance


Software knowledge becomes stale. Search ranking should prefer the current implementation and recent documentation, while keeping older decisions available when they explain why the current structure exists. Recency is a ranking signal rather than an automatic reason to discard material.

### Human verification


For broad or ambiguous questions, the assistant asks the engineer to confirm the likely subsystem, service, or symbol before it expands the search. This makes uncertainty visible and reduces the chance that a plausible but unrelated code path becomes the basis for a design recommendation.

## Evaluation approach


The full plan, with hypotheses, baselines and decision rules, is in the [thesis and evaluation plan]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}).

The assistant should be evaluated on engineering tasks with observable evidence, not only on whether an answer sounds useful. Example checks include:

- whether it identifies the files and symbols required for a change;
- whether it follows important callers, implementations, and tests;
- whether its explanation cites evidence that actually supports the conclusion;
- whether it detects uncertainty or conflicting candidates;
- whether a proposed change preserves relevant contracts and passes the project checks;
- whether engineers can correct a mistaken search direction without restarting the task.

The evaluation set should include changes that cross module or service boundaries, because those are where text-only retrieval is most likely to miss important context.

## Limitations


Static structure cannot fully describe runtime behavior, generated code, reflection, dynamic configuration, or undocumented operational dependencies. Language tooling also varies in quality across repositories. The assistant therefore needs explicit confidence limits and access to tests, traces, and runtime evidence when the task depends on behavior rather than code structure alone.

## Next steps


The smallest useful prototype would support one language and one repository. It would combine AST-aware chunks, language-server references, configuration links, text search, and a review step where an engineer selects the relevant subsystem.

The first evaluation targets what published work leaves open. A pilot of about 60 items tests how much each approach loses when the question shares no words with the code, by rewriting the same issues without identifiers. A small symbol-level arm keeps the results comparable with published numbers. Details are in [thesis and evaluation plan § Pilot]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}#pilot).

Whether linking code to configuration values helps, especially where names change between layers, is planned as a separate study in the [backlog]({{< ref "projects/code-intelligence/backlog" >}}). It starts once repositories are chosen.

## Notes


Thesis:

- [Thesis and evaluation plan]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}): the claim to prove, hypotheses that would refute it, baselines (including an agent with grep), ground truth from Git history, decision rules.
- [Backlog]({{< ref "projects/code-intelligence/backlog" >}}): planned work not yet scheduled, written as plans; first item: the configuration-links study.

Design:

- [Code representation]({{< ref "projects/code-intelligence/code-representation" >}}): AST units, repository graphs, compiler-grade analysis (symbol tables, slicing, def-use, types), static vs. dynamic languages, the code property graph.
- [Language servers and code indexes]({{< ref "projects/code-intelligence/language-servers-and-code-indexes" >}}): where structure comes from in practice: tree-sitter, LSP requests and running servers headless, SCIP and stack graphs, CodeQL and Joern; costs, limits, agent tools.
- [Retrieval and context assembly]({{< ref "projects/code-intelligence/retrieval" >}}): query understanding, task-aware retrieval findings, the graph-vector-lexical triad, context expansion, packing, index freshness.
- [Software knowledge graph]({{< ref "projects/code-intelligence/software-knowledge-graph" >}}): history, intent, runtime and ecosystem layers on top of the code graph; schema, traversals, trace-augmented retrieval.
- [Implicit knowledge]({{< ref "projects/code-intelligence/implicit-knowledge" >}}): operational, environmental, evolutionary and social context; repository-mining signals; cheap association indices.
- [Hybrid architecture]({{< ref "projects/code-intelligence/hybrid-architecture" >}}): deterministic core with LLM orchestration, primitive operations, workflow composition, target scenarios, method.

Research:

- [Related work]({{< ref "projects/code-intelligence/related-work" >}}): code property graphs, LLM-assisted slicing, property-graph RAG, and what this design adds.
- [Graph learning and world model]({{< ref "projects/code-intelligence/graph-learning-and-world-model" >}}): graph embeddings, link prediction, root-cause scoring; a simulatable world model for what-if questions.

Repository expert (the read-only first product):

- [Roadmap]({{< ref "projects/code-intelligence/repository-expert/roadmap" >}}): staged build from a manual-context CLI to a continuously indexed, code-aware system; workstreams and first artifacts.
- [Requirements]({{< ref "projects/code-intelligence/repository-expert/requirements" >}}): users, functional and non-functional requirements, guardrails, failure modes.
- [Evaluation]({{< ref "projects/code-intelligence/repository-expert/evaluation" >}}): stratified golden dataset, retrieval and generation metrics, release gates, pipeline.
- [Deployment]({{< ref "projects/code-intelligence/repository-expert/deployment" >}}): distribution patterns, service topology, scaling stages, interfaces to fix early.

## Open questions


- How should the different kinds of information (code slices, history, intent, runtime evidence) be represented in the context window: as text, or as another graph?
- Which use case comes first: code review, incident resolution, or change-impact analysis?
- Should the analysis components be exposed to the model as tools?
- Could a causal inference engine and a library of typical incident evolution schemes support root-cause analysis (see [graph learning and world model]({{< ref "projects/code-intelligence/graph-learning-and-world-model" >}}))?
