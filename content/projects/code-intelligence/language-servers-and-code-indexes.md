---
draft: false
toc: true
title: "Language Servers and Code Indexes"
description: "Where code structure comes from in practice, from tree-sitter and live language servers to precomputed indexes (LSIF, SCIP, stack graphs, Kythe, Glean) and analysis databases (CodeQL, Joern), with costs, limits and use as agent tools."
linkTitle: "Language Servers and Indexes"
---

The other design notes assume that symbols, references, types and call relations are available. This note is about where they actually come from, what each source can and cannot answer, and what it costs to run. It is the practical side of [code representation]({{< ref "projects/code-intelligence/code-representation" >}}), and it decides how the ablation ladder in the [thesis and evaluation plan]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}) gets built (conditions B1 to B3, and the structural tools in A1).

There are three families of sources:

- **Parsers** read one file at a time and give syntax: tree-sitter, ctags.
- **Live language servers** answer questions about a running workspace: the Language Server Protocol (LSP).
- **Precomputed indexes and analysis databases** are built once per snapshot and queried offline: LSIF, SCIP, stack graphs, Kythe, Glean for navigation; CodeQL, Joern for data flow.

## Levels of structural fidelity


| Level | Sources | What it answers | What it needs | Typical failure |
| --- | --- | --- | --- | --- |
| 0 Text | ripgrep, BM25, embeddings | Where does this string or concept appear? | Nothing | Misses links with no shared words; floods on common names |
| 1 Syntax | tree-sitter, ctags | Where are things defined, by name? What is the enclosing class? | A grammar per language; no build | Name-based only: cannot tell which of five `connect` methods a call reaches |
| 2 Symbols and references | LSP servers, SCIP or LSIF indexes, stack graphs, Kythe, Glean | Which definition does this call resolve to? Who references it? What type is this? | Usually a working environment (dependencies installed, build configured); stack graphs are the exception | Partial results when the project does not build; dynamic dispatch and reflection |
| 3 Flow | CodeQL, Joern, language-specific call-graph and points-to tools | Where does this value come from or go? Which statements affect it? | Extraction into a database, often during a build; heavy compute | Few languages fully supported; slow; approximate for dynamic languages |
| 4 Runtime | Traces, coverage, profiles from test runs | What actually ran, with which types and values? | Running tests or instrumented services | Covers only the paths that were executed |

History and configuration ([implicit knowledge]({{< ref "projects/code-intelligence/implicit-knowledge" >}})) are a separate axis: they need Git and config parsing, not a deeper analysis of code.

Each level up is more precise and more expensive, and less likely to work out of the box on an arbitrary repository. Hypothesis H7 asks where the gain stops being worth the cost.

## Level 1: tree-sitter


Tree-sitter is an incremental parsing library with grammars for most languages. It produces a concrete syntax tree for one file, tolerates syntax errors (useful for code being edited), and re-parses quickly after small edits. It needs no build and no dependencies.

Two features matter here:

- **Queries.** S-expression patterns match tree nodes, for example "every function definition with its name and parameters". This is how AST chunks, envelopes (the class around a method) and signatures are cut out.
- **Tags.** Many grammars ship a `tags.scm` query that captures definitions and references *by name*. GitHub's search-based code navigation works this way, and so does Aider's repository map: it extracts definitions and references with tree-sitter tags, builds a graph of files that reference each other's names, ranks files with PageRank biased towards the files in the conversation, and fits the top entries into a token budget.

The limit is resolution. Tree-sitter knows that a call to `connect` exists, not which `connect` it is. Imports can be read syntactically, but following them to the right definition across packages, overloads and inheritance needs level 2. Universal Ctags is an older alternative with the same name-based character.

## Level 2: the Language Server Protocol


The Language Server Protocol, introduced by Microsoft in 2016, is a JSON-RPC protocol between an editor and a language-specific server. The server holds a semantic model of the workspace and answers position-based requests. Because every major editor uses it, nearly every language has a mature server.

### Requests useful to an assistant


| Request | Returns | Use in this design |
| --- | --- | --- |
| `workspace/symbol` | Symbols matching a (usually fuzzy) name query, with kind and location | Linking a question to seed symbols: the "seed miss" failure in the evaluation plan |
| `textDocument/documentSymbol` | The symbol outline of a file, nested | Repository map, chunk boundaries, envelopes |
| `textDocument/definition`, `declaration`, `typeDefinition`, `implementation` | Locations of the resolved target | Exact definition retrieval; interface -> implementations |
| `textDocument/references` | All reference locations of a symbol | Impact analysis, usage recall |
| `textDocument/prepareCallHierarchy`, `callHierarchy/incomingCalls`, `outgoingCalls` | Callers and callees of a function | Call-graph expansion one hop at a time |
| `textDocument/prepareTypeHierarchy`, `typeHierarchy/supertypes`, `subtypes` | Base and derived types | Polymorphism resolution |
| `textDocument/hover` | Type signature and documentation at a position | Type injection, short summaries |
| `textDocument/inlayHint` | Inferred types and parameter names the source omits | Annotating context with types the code does not state |
| Diagnostics (pushed, or pulled since 3.17) | Errors and warnings | Fragile zones; validation of proposed changes |
| `textDocument/rename`, `codeAction` | Workspace edits | Only for workflows that change code; outside the read-only product |

Call and type hierarchy arrived in protocol versions 3.16 and 3.17, so older servers may lack them. Support varies by server: check each capability in the server's `initialize` response rather than assuming it.

### Running servers headless


Language servers are built for one person editing one workspace, so using them as a back end takes some care.

- **Lifecycle.** `initialize` with the workspace root and client capabilities, `initialized`, then `textDocument/didOpen` for files before querying them (some servers answer only for open files), and `shutdown` and `exit` at the end.
- **Readiness.** There is no standard "indexing finished" signal. Servers report work through `$/progress` notifications; a back end should wait for them, and should report "not ready" rather than return an empty result that looks like "no references".
- **Positions.** Lines and characters are zero-based, and characters count UTF-16 code units by default; protocol 3.17 lets client and server negotiate another encoding. Off-by-one and encoding mismatches are a common source of wrong citations.
- **Environment.** Results are only as good as the project setup: the Python interpreter and installed packages for Pyright, `node_modules` for the TypeScript server, a `compile_commands.json` for clangd, an imported Maven or Gradle project for the Java server. A server on a misconfigured project returns partial results without failing.
- **Cost.** Startup and initial indexing take from seconds to minutes and can use gigabytes of memory on a large repository. Keep servers warm and reuse them across queries.
- **Robustness.** Servers crash and hang; supervise them, time out requests, and restart.

Libraries do most of this work. Microsoft's **multilspy**, written for the monitor-guided decoding research (a language server constrains what the model generates), starts servers for several languages and exposes the requests as Python calls. **Serena** exposes symbol search, references, declarations, implementations and symbol-level editing over the Model Context Protocol (MCP), with language servers as its default back end. Coding agents themselves increasingly ship a language-server tool: Claude Code has a read-only one, active once a code-intelligence plugin and the language server are installed.

### What language servers do not give


- **A snapshot.** A server answers about the files on disk now. It has no notion of commit, so reproducible evaluation at a pinned commit means setting up the workspace at that commit (see the evaluation section below).
- **Data flow.** References say where a symbol is used, not how values move through it.
- **Links across languages and services.** A server for the client code does not know which server handler an HTTP route or gRPC method reaches.
- **History.** Nothing about who changed what, or what changes together.
- **Completeness in dynamic code.** Python and JavaScript references miss calls through `getattr`, decorators that rewrite functions, dependency injection and string-built names.

## Level 2, offline: precomputed indexes


An index is built once per snapshot, usually in CI, and queried without a running server. This trades freshness for reproducibility, speed at query time and scale.

- **LSIF** (Language Server Index Format, Microsoft, 2019) is a dump of the answers a language server would give, as a graph of vertices and edges in JSON lines, so navigation works without running the server.
- **SCIP** (Sourcegraph's successor to LSIF in its own products) is Protobuf-based and organized by document. Its main contribution is **symbol identity**: each symbol has a readable, globally unique string built from the package manager, package name and version, and a descriptor path (namespace, type, method). The same string identifies the symbol in every file and, through package versions, across repositories. That is the answer to the open question of how a node keeps its identity in the [software knowledge graph]({{< ref "projects/code-intelligence/software-knowledge-graph" >}}). Indexers exist for TypeScript, Java and other JVM languages, Python (built on Pyright), Go, C and C++, and rust-analyzer can emit SCIP.
- **Stack graphs** (GitHub) resolve names without a build. Each file's graph is built independently from its tree-sitter tree, using rules written in a small DSL, and the graphs are joined at query time to resolve a reference to its definition. Because files are processed independently, updates are incremental. The approach comes from scope graphs, a theory of name resolution from programming-language research. It was the main way to get precise navigation without a build environment, but GitHub archived the stack-graphs repository in September 2025 and no longer supports it, so it is now a design to learn from rather than a dependency to adopt.
- **Kythe** (Google) defines a language-neutral graph of nodes and edges for cross-references. Extractors capture each compilation from the build and indexers emit facts, so it is tied to build integration; it is what Google's code search uses.
- **Glean** (Meta, open-sourced in 2021) stores facts about code in a database with a declarative query language (Angle), supports incremental updates, and derives new facts from stored ones. It powers code navigation and other tooling at Meta's scale.

The cost moves to CI: indexing time and storage per commit. Answers are as fresh as the last indexed commit, so uncommitted edits still need a live server or a re-index of the changed files.

## Level 3: data flow and code property graphs


- **CodeQL** (GitHub) extracts code into a relational database, often by watching the build for compiled languages, and queries it in QL, a declarative, object-oriented logic language. Its standard libraries include data-flow and taint tracking, so "where does this request parameter end up?" is a library query. It is the most mature option for the `DataflowFromSource` primitive in [hybrid architecture]({{< ref "projects/code-intelligence/hybrid-architecture" >}}). Check licensing before using it on closed-source code.
- **Joern** builds a code property graph (AST, control flow and program dependence in one graph) from frontends for several languages and queries it with a Scala-based language. It is the reference implementation of the CPG idea in [code representation]({{< ref "projects/code-intelligence/code-representation" >}}#the-code-property-graph).
- **Language-specific tools** give call graphs and points-to information: for example PyCG for Python call graphs, and Soot, WALA or Doop for Java. Static call graphs for dynamic languages are approximations: some report calls that never happen, others miss calls that do. Which way a tool errs matters for impact questions, where a missed caller is worse than an extra one.

Level 3 tools are heavy: building a database for a large repository can take as long as a full build, and the queries are expressive but slow compared with level 2 lookups. They fit precomputed, high-value questions (security, data movement) better than every query.

## Choosing a source


| Need | Use |
| --- | --- |
| Link a question to candidate symbols | `workspace/symbol` plus BM25 over identifiers and paths |
| Chunks, outlines, repository map | tree-sitter queries and tags |
| Exact definitions and references, current files | A live language server |
| Reproducible answers at a pinned commit, or many commits | A SCIP index per commit |
| Precise navigation without a working build | Stack graphs as a design reference (archived); in practice, tree-sitter names |
| Data flow and taint | CodeQL or Joern, precomputed for the questions that need it |
| Calls through reflection, decorators or injection | Runtime traces from tests |
| What changes together, what a config value is | Git history and config parsing, not code analysis |

## For the evaluation plan


The pilot in the [thesis and evaluation plan]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}) pins each item at the parent of a fix commit, and SWE-bench items are spread over many commits of many repositories. That has practical consequences:

- **B1 (syntax)** is cheap: tree-sitter runs on any checkout.
- **B2 (symbols)** needs a working environment per item. SWE-bench provides a container image per task with the environment installed, which is the easiest way to get a language server that actually resolves. Starting a server per item costs time; budget for it, and record coverage (the share of files where references resolved) so that a weak B2 result can be told apart from a broken setup.
- **A SCIP index per pinned commit** is the more reproducible option for B2 and makes repeated runs cheap, at the cost of an indexing step per commit.
- **B3 (flow)** is the expensive step. Run it on a subset first, and only if B2 shows a gain worth extending.

## As tools for an agent


The structural primitives in [hybrid architecture]({{< ref "projects/code-intelligence/hybrid-architecture" >}}#primitive-operations) map onto these sources directly:

| Tool | Backed by |
| --- | --- |
| `find_symbol(name, kind?)` | `workspace/symbol`, SCIP symbol search, tree-sitter tags as a fallback |
| `get_definition(symbol or location)` | `definition`, SCIP |
| `find_references(symbol)` | `references`, SCIP |
| `call_hierarchy(symbol, direction, depth)` | Call hierarchy requests, or a precomputed call graph |
| `type_hierarchy(symbol)` | Type hierarchy requests |
| `outline(file)` | `documentSymbol`, tree-sitter |
| `type_at(location)` | `hover`, inlay hints |
| `dataflow(source, sink?)` | CodeQL or Joern, precomputed |

Design points that matter for agents:

- **Compact results.** Return symbol, kind, `path:line`, signature and one line of context, not whole files. The agent can read the file if it needs more.
- **Paging and limits.** References to a common symbol can number in the thousands; return a count and the first page.
- **Honest failure.** Distinguish "no references" from "server not ready" or "unresolved because the environment is broken", so the agent can fall back to grep instead of concluding there are no callers.
- **Stable identifiers.** Return SCIP-style symbol IDs that the agent can pass back to other tools.

This is condition A1 in the evaluation plan; hypothesis H6 asks whether it beats grep and file reads on cost. Early evidence is mixed: one small study found that agents rarely call language-server tools when they are optional and gain mainly on finding references, where grep returns many false positives; another reports one to two points more on SWE-bench Verified with fewer turns ([related work § Comparisons of structure, text and grep]({{< ref "projects/code-intelligence/related-work" >}}#comparisons-of-structure-text-and-grep)).

## Open questions


- How should a client call in one service be linked to its handler in another: route strings, OpenAPI or proto definitions, message topics?
- How should generated code be treated: indexed, linked to its generator, or excluded?
- Can one language server cope with a large monorepo, or does the index need to be split by package?
- How should uncommitted edits be combined with an index built for the last commit?

## References


- Language Server Protocol specification: <https://microsoft.github.io/language-server-protocol/>
- LSIF: <https://microsoft.github.io/language-server-protocol/overviews/lsif/overview/>
- SCIP: <https://github.com/sourcegraph/scip>
- Stack graphs: <https://github.com/github/stack-graphs>
- Kythe: <https://kythe.io>
- Glean: <https://glean.software>
- CodeQL: <https://codeql.github.com>
- Joern: <https://joern.io>
- Tree-sitter: <https://tree-sitter.github.io/tree-sitter/>
- Aider repository map: <https://aider.chat/docs/repomap.html>
- multilspy: <https://github.com/microsoft/multilspy>; Agrawal et al., *Guiding Language Models of Code with Global Context using Monitors* (NeurIPS 2023)
- Serena: <https://github.com/oraios/serena>
- Néron et al., *A Theory of Name Resolution* (ESOP 2015), the scope-graph work behind stack graphs

## Library sources


Further reading:

- [Winters et al. 2020](/sources/cdc8156a74161ef8b6f12b1e2896c4d7.bin), *Software Engineering at Google*: the chapters on code search and static analysis describe how cross-reference indexes and analyzers run at scale
