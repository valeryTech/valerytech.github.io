---
draft: false
toc: true
title: "Software Knowledge Graph"
description: "Extending the code property graph with history, intent, runtime and ecosystem layers into one queryable graph of the software lifecycle."
linkTitle: "Software Knowledge Graph"
---

Code answers *what*. Engineers answering questions about a system also draw on *why* (intent), *how it got here* (process and history) and *so what* (runtime impact), because those answers are not in the code. An assistant needs the same sources for the same questions. This note describes the graph that joins the deterministic code graph from [code representation]({{< ref "projects/code-intelligence/code-representation" >}}) with the rest of the software development lifecycle (SDLC).

## Layers beyond the code


**Tribal knowledge (human context).**

- *Pull request discussions* hold the discarded alternatives: the code shows library A, the PR explains that B had a security flaw. Index them as decision records linked to the lines they shaped, so "Why do we use a custom parser here?" retrieves the comment where the standard parser failed on an edge case.
- *Commit messages* group scattered file changes into one logical unit. Index a commit's diff as a "solution unit" rather than files one by one, so "How did we implement feature flags?" shows the DB, backend and frontend changes together.

**Operational reality (production feedback).**

- *Errors and stack traces* (Sentry, Datadog) identify fragile code. Map exception classes back to source files, so that a review of `payment.py` can carry the note "associated with 40% of last month's 500 errors".
- *Infrastructure as code* (Terraform, Kubernetes, Docker, Helm) defines constraints. The upload code may be correct while the ingress config sets `client_max_body_size` to 1 MB.

**Intent (business context).**

- *Issue trackers* define correctness through acceptance criteria. Link ticket -> PR -> commit, so "Does this function cover all edge cases?" can be checked against the ticket's criteria.
- *Design docs and RFCs* hold the architecture and the system invariants ("we never store PII in plain text") that code must obey.

**External ecosystem.**

- *Software composition analysis* resolves `package.json` or `requirements.txt` against vulnerability databases, so a request to import a library version with a known CVE can be flagged.

## Naming the approach


"Graph-RAG" usually means something narrower. In Microsoft Research's GraphRAG, an LLM extracts relationships from unstructured text. Many edges here are instead taken from tools that already know them: the compiler or language server knows that function A calls function B, and Git knows which commit modified which file. That puts the code layer closer to the graphs used for code navigation and static analysis than to text-extracted knowledge graphs: system-to-graph rather than text-to-graph.

Not every edge is that reliable, though. Commit-to-ticket links are parsed from conventions such as "Fixes #123", error-to-function links come from stack traces, and chat mentions are matched by pattern. So the difference from text-extracted graphs is one of degree, and each edge should record where it came from (see [Edge provenance](#edge-provenance)).

Working names, none of which describes a new kind of graph:

- **Code property graph (CPG)**, the established term for the static part: AST plus control flow plus data dependence.
- **Holistic SDLC graph**, for the scope: code, history (Git), plan (tickets) and reality (logs).
- **Augmented code property graph**, when talking to engineers, and **software knowledge graph** for the project as a whole.

"Deterministic Graph-RAG" was used in earlier drafts and overstates the case: it holds for the code layer, not for the SDLC layer.

## Edge provenance


Every edge stores how it was obtained and how far it can be trusted. Traversal plans can then restrict themselves to reliable edges, and answers can say which kind of link they rely on.

| Provenance | Examples | Reliability |
| --- | --- | --- |
| Verified by analysis | CALLS, DEFINES, IMPORTS, references and types from a compiler, language server or SCIP index | High within what static analysis sees; misses dynamic dispatch and reflection |
| Recorded | Commit MODIFIES file, author, timestamps, PR CONTAINS commit | High; it is what Git and the code host store |
| Parsed from conventions | Commit REFERENCES ticket ("Fixes #123"), error ORIGINATES_FROM function (stack frames), config key -> file | Medium; depends on team habits and parser quality |
| Inferred statistically | Co-change partners, predicted links ([graph learning]({{< ref "projects/code-intelligence/graph-learning-and-world-model" >}})) | Probabilistic; carries a score |
| Extracted by an LLM | Decisions summarized from PR discussions, mentions resolved from chat | Lowest; must be checkable against its source text |

This is also the main difference from the text-extracted graphs above: the share of high-reliability edges is much larger, but it is not all of them.

## Dual-graph architecture


Rather than one undifferentiated graph, build two layers that share node IDs:

- **Deterministic code graph (CPG)**, built from the compiler, language servers and Tree-sitter. It holds facts the tools can verify, within the limits of static analysis, and provides execution context (control flow, data flow).
- **SDLC knowledge graph**, built from tickets, Git, docs, chat and logs. It holds intent and history (`Function A` implements `Ticket-123`; `Commit X` fixes `Bug Y`).

The integration point is the node ID. `PaymentService.process()` is a node in both graphs: in the CPG it has an edge to `validate()`, in the knowledge graph an edge to `JIRA-400`. Cross-layer edges are created at ingestion, for example `Commit` MODIFIES `File`.

Retrieval follows a neighborhood pattern from a seed node: **horizontal** traversal along CPG edges finds technically related code; **vertical** traversal along SDLC edges finds historically related context ("show me the PR that introduced this function").

## Schema


**Code layer (static structure).**

- Nodes: `File` (path, extension), `Function` (name, arguments, return type, AST body), `Class` (name, inheritance), `Variable` (name, inferred type).
- Edges: `File` DEFINES `Function`; `Function` CALLS `Function` (call graph); `Function` READS/WRITES `Variable` (data flow); `File` IMPORTS `File` (dependency graph).

**Evolution layer (version control).**

- Nodes: `Commit` (hash, message, timestamp), `Author`, `PullRequest` (title, description, comments).
- Edges: `Commit` MODIFIES `File` (with the diff on the edge); `Author` COMMITTED `Commit`; `PullRequest` CONTAINS `Commit`.

**Intent layer (project management).**

- Nodes: `Ticket` (ID, status, priority, acceptance criteria), `Document` (RFC, Markdown, wiki page).
- Edges: `Commit` REFERENCES `Ticket` (parsed from "Fixes #123"); `Ticket` DESCRIBED_BY `Document`; `PullRequest` CLOSES `Ticket`.

**Verification layer (runtime and operations).**

- Nodes: `Test` (name, status), `Error` (exception type, stack trace, occurrence count), `Log` (message, level).
- Edges: `Test` COVERS `Function` (coverage); `Function` THROWS `Error` (observed in logs); `Test` TRIGGERS `Error` (flaky tests).

Further edge types used in workflows: `Function` IMPLEMENTS `Ticket`, `Test` VERIFIES `Function`, `Error` ORIGINATES_FROM `Function`, `PR comment` DISCUSSES `Code line`, `Config` CONSTRAINS `Service`.

**Properties and embeddings.**

- Embed the function body and the docstring separately on the `Function` node, and the description on the `Ticket` node.
- Do not embed the commit itself; embed the diff on the MODIFIES edge.
- Scalar metadata for filtering: `Function.cyclomatic_complexity` ("show simple examples first"), `File.churn_rate` ("show stable code"), `Ticket.priority` ("focus on P0 bugs").

A fixed schema with strict edge types is itself the "prepared data": it allows deterministic traversal plans ("to explain a bug, fetch the last three commits and their linked tickets") instead of asking the model to guess relationships.

## Traversals


**Root cause.** "Why are we getting NullPointerExceptions in billing?"

1. Find `Error` nodes of that type.
2. Follow THROWS backwards to the culprit function (`calculate_tax`).
3. Follow MODIFIES to the commits that touched its file, newest first.
4. Follow REFERENCES to the ticket explaining why it changed.
5. Answer: `calculate_tax` was modified two days ago in commit `abc1234` for "Add international support", which likely introduced a missing null check.

**Impact.** "If I change the `User` schema, what breaks?"

1. Find the `User` class node.
2. Follow READS/WRITES from functions to variables of type `User`.
3. Follow IMPORTS recursively.
4. Follow COVERS from tests to the affected functions.
5. Answer with the affected files and the test suites to re-run.

**Holistic incident.** "Why did payment processing fail last Tuesday?" Logs show a `TimeoutError` in `PaymentService` -> the code node `PaymentService.process()` -> a Monday commit modifying it -> the ticket "Add third-party fraud check". The synthesis: the new fraud check calls an external API slower than the timeout allows.

## Trace-augmented retrieval


Beyond indexing code, index **execution traces**:

1. Instrument the code and run the test suite or a "golden path" scenario.
2. Record call sequences with arguments and return values: `A(args) -> B(args) -> result`.
3. For "Why is login failing?", retrieve the trace where `login()` returned `False`, not just text that mentions login: "`login()` called `verify_hash()`, which returned `Mismatch`; `salt` was undefined."

In the full design, traces are DAGs of spans with correlated logs, metrics, config, feature flags and build metadata, linked to CPG nodes by build ID, commit hash and symbol. [hybrid architecture]({{< ref "projects/code-intelligence/hybrid-architecture" >}}) uses them to seed program slices.

## Implementation stack


- Graph store: Neo4j, or FalkorDB for low latency. Vectors can live on the graph nodes (Neo4j has vector indexes), avoiding a second database.
- Code ingestion: Tree-sitter for AST nodes and edges.
- Git: GitPython for commits and authors.
- Intent: Jira or Linear API plus the GitHub API.
- Runtime: OpenTelemetry traces sent to a collector and aggregated into the graph.

## Library sources


- [Edge et al. 2024](/sources/retrieval-and-knowledge/knowledge-graphs/edge-2024-graphrag-local-to-global-summarization.pdf.enc), *From Local to Global* ([arXiv:2404.16130](https://arxiv.org/abs/2404.16130)) -- on *Naming the approach*

Further reading:

- [Mo et al. 2025](/sources/retrieval-and-knowledge/knowledge-graphs/mo-2025-kggen-extracting-knowledge-graphs.pdf.enc), *KGGen*
