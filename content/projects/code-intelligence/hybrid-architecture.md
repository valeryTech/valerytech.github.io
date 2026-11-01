---
draft: false
toc: true
title: "Hybrid Architecture"
description: "A deterministic analysis core wrapped by LLM orchestration, built from primitive operations that compose into debugging, refactoring and impact-analysis workflows."
linkTitle: "Hybrid Architecture"
---

This note combines three lines of work: CPG-style program analysis and slicing, graph and trace RAG, and hybrid systems that combine deterministic analysis with LLM reasoning. Each exists, and some systems already combine two of them: LLMxCPG pairs slicing with an LLM, and LocAgent and CodexGraph pair code graphs with agents ([related work]({{< ref "projects/code-intelligence/related-work" >}})). The proposal here is to put all three behind one small set of primitive operations: one **analysis substrate** (graphs and indices) and one **orchestration layer** that runs predefined and LLM-adapted workflows over those primitives. It is a design to be tested, not a result.

It builds on [code representation]({{< ref "projects/code-intelligence/code-representation" >}}) (the CPG), [retrieval]({{< ref "projects/code-intelligence/retrieval" >}}) (the hybrid triad) and [software knowledge graph]({{< ref "projects/code-intelligence/software-knowledge-graph" >}}) (history, intent and traces).

## Ground truth: the code property graph


The augmented CPG (AST, control flow, data dependence, def-use, types, plus path, ownership, complexity and churn) is the canonical representation of the codebase. RAG indices, traces and tickets are *views* over it. In this design, retrieval works over symbols and slices rather than text chunks; the [thesis and evaluation plan]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}) tests whether that pays off against text and grep baselines.

CPG-based slicing is the default context builder: `(query, seed nodes) -> slice`, where the slice is the minimal induced subgraph satisfying a constraint such as "all statements influencing `x` at call site `y`". LLMxCPG reports slices 68-91% smaller than the original code while keeping the vulnerability-relevant context; there, a fine-tuned model writes the CPG queries that produce the slice.

## Layers


1. **Ingestion and modeling.** CPG builder (Tree-sitter or existing CPG tooling); trace collector (OpenTelemetry-style traces and logs); SDLC graph constructor (Git, PRs, tickets, docs). An offline job extracts docstrings, signatures, test names and PR descriptions and generates a short summary per symbol (purpose, intent, risks), stored as node properties.
2. **Graph and index.** The software knowledge graph in a property-graph database (Neo4j, JanusGraph, Neptune), plus vector and lexical indices keyed by the same node IDs.
3. **Analysis services.** Stateless services that operate on the graph and return graph slices with metadata:
   - *Program slicing*: backward slices of data dependencies or forward slices of effects from a seed node.
   - *Data-flow and taint tracking*: from a source (user input, deserialization) to optional sinks (database writes, network calls), for security and privacy questions.
   - *Type and invariant annotation*: type checkers (Pyright, mypy, TypeScript) plus lightweight rule engines for security rules and coding standards, as in static-analysis-plus-LLM hybrids.
4. **Orchestration and reasoning.** The hybrid control loop below.
5. **Experience.** Task-specific flows: investigate an incident, propose a refactor, plan a change.

The layers are stable: a better slicer or taint engine slots into the analysis layer without changes to orchestration or UI.

## Trace-anchored slices


A trace layer anchors static slices in runtime evidence. Traces are DAGs of spans with correlated logs, metrics, config, feature flags and build metadata, linked to CPG nodes by build ID, commit hash and symbol. For "Why is login failing?", the system first retrieves the relevant trace bundle, uses it to decide where in the CPG to seed slicing (call paths, error sites), and then computes the minimal static slice that intersects those dynamic paths. The model never reasons from a stack trace alone.

## The hybrid control loop


Across LLM-plus-software-engineering work (test generation, program repair, refactoring), a common method is an iterative loop: analysis -> LLM proposal -> validation -> refined analysis. This design uses it as the default pattern for every workflow; whether one loop really fits all of them is an assumption to check:

1. **Goal understanding.** The LLM turns the query (plus an optional anchor: file, selection, trace ID) into a structured task and plan, for example "backward slice around `UserSession.validate`".
2. **Seed retrieval.** Vector search over summaries and docstrings, lexical search for identifiers and error codes, merged into a few seed nodes.
3. **Deterministic analysis.** Graph traversal around seeds (CALLS, IMPORTS, TESTS, IMPLEMENTS, bounded in depth and fan-out), slicing and data-flow services; optionally dynamic passes such as targeted tests or coverage.
4. **Context assembly.** Code slices (canonicalized for search, original for reading), graph annotations (call chains, def-use explanations, types, taint warnings), trace bundles, and linked tests, tickets and PRs.
5. **LLM reasoning.** A code model for explanations and edits, a general model for summarizing SDLC context. The prompt treats the slices as authoritative and forbids guessing beyond them.
6. **Validation and feedback.** For workflows that change code: lint, type checks, static security analysis, and tests selected from the impact graph. Failures feed back into the planner for another round.

## Primitive operations


A small set of tool-like primitives with strict input and output schemas gives reliability without losing flexibility:

| Primitive | Input -> output |
| --- | --- |
| `LocateSymbol` | Query or code span -> symbols, files and tests (vector, lexical and graph seeds) |
| `SliceAroundSymbol` | Symbol and slice spec -> backward or forward slice |
| `TraceToCode` | Trace, log or stack -> CPG nodes |
| `DataflowFromSource` | Source (input, config) -> taint and data-flow subgraph |
| `FetchSDLCContext` | Nodes -> linked PRs, tickets, design docs, infrastructure constraints |
| `SummarizeSubgraph` | Slice or subgraph -> explanation or pseudocode |
| `ProposePatch` + `Validate` | Slice and goal -> patch checked by tests and static analysis |
| `Disambiguate` | Several candidates -> a question to the user or a ranked choice |

## Composing workflows


Higher-level tasks are predefined task graphs over the primitives:

- **Explain how X works:** `LocateSymbol` -> `SliceAroundSymbol` (both directions) -> `FetchSDLCContext` -> `SummarizeSubgraph` (behavior and rationale).
- **Why did this error occur?:** `TraceToCode` -> `SliceAroundSymbol` (backward from the error site) -> `FetchSDLCContext` (recent changes touching the slice) -> `SummarizeSubgraph`, optionally `ProposePatch`.
- **Is this change safe?:** `LocateSymbol` (changed code) -> `SliceAroundSymbol` (forward to affected sites) -> `DataflowFromSource` (for critical data such as PII) -> `FetchSDLCContext` (tests, tickets) -> `SummarizeSubgraph` (impact, missing tests, risks).
- **Guided onboarding to a subsystem:** repeated locate -> slice -> summarize along package boundaries.
- **Security review of an input:** `DataflowFromSource` -> slice at sinks -> summarize with a security-focused prompt.

Workflows run two ways. **Predefined** task graphs cover the high-value scenarios. For the long tail, an **LLM planner** sees the primitives as tools with JSON schemas and the canonical workflows as examples, decomposes the goal, maps steps to primitives, and revises the plan from intermediate results (for example inserting `Disambiguate` when `LocateSymbol` finds several candidates). New cases then mostly need new compositions and prompts, not new infrastructure.

The workflows can be exposed as narrow APIs over the same loop, each with its own seeds, slice specs and validation policy: `/explain-code`, `/debug-error`, `/refactor`, `/security-audit`.

## Target scenarios


- **Evidence-first debugging.** Input: a trace ID, an error, or a question ("Why did payments time out yesterday?"). Pipeline: trace retrieval -> seeded CPG slice -> SDLC neighborhood -> explanation and candidate fix -> validation. The aim is that each explanation cites a trace, a code slice and, where one exists, the ticket or PR behind the code.
- **Safe repair and refactoring.** Program-repair patterns (LLM plus rule engine or static analysis) with CPG slicing to propose minimal patches, validated by tests and static checks, and checked against design invariants from the SDLC graph ("never store PII in logs").
- **Change impact and design questions.** "If I change this validation rule, what breaks?": CPG, call graph and SDLC graph enumerate affected paths, tests, services and tickets; the LLM summarizes and proposes a safe plan.

Delivering one of these end to end would test the combination better than building components separately, because it shows whether the parts actually help each other or only add cost. Open question: which should be the first vertical slice, incident debugging from traces and logs, or change-impact analysis from a diff?

## Method


1. **Scenario first.** Pick two or three workflows and define, goal-question-metric style, the goal ("reduce time to resolve class X incidents by 30%"), the questions the system must answer ("what failed?", "why is it built this way?", "what is the minimal safe fix?") and the metrics (task success, time to answer, correctness, regression rate). Map techniques to scenarios, not the other way round.
2. **Layered blueprint.** Ingestion -> graph and index -> analysis -> orchestration -> experience, with stable interfaces.
3. **Hybrid loop.** One generic deterministic-and-LLM iteration, specialized per scenario by its queries, filters and validation rules.
4. **Graph-RAG fusion.** One property-graph schema and two-stage retrieval (graph first, then vector ranking within the subgraph) for all context assembly.
5. **Socio-technical and risk framing.** Decide where the tool may act on its own and where a human approves. Tier use cases (read-only analysis, suggested patches, auto-applied patches behind a feature flag) and gate the higher tiers with stricter validation, governance and observability.

## References


- LLMxCPG, CPG-based slicing for LLM vulnerability detection: [arXiv:2507.16585](https://arxiv.org/abs/2507.16585)
- Panta, hybrid static and dynamic analysis for LLM test generation: [arXiv:2503.13580](https://arxiv.org/abs/2503.13580)
- Hybrid automated program repair with LLMs (TOSEM): [doi:10.1145/3715004](https://doi.org/10.1145/3715004)
- Trace-RAG for debugging: <https://debugg.ai/resources/trace-rag-for-code-debugging-ai-grounding-fixes-in-production-evidence>
- Rule engine and LLM hybrids for safer code generation: <https://hackernoon.com/rule-engine-llm-hybrid-architectures-for-safer-code-generation>
