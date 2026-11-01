---
draft: false
toc: true
title: "Repository Expert: Roadmap"
description: "The read-only repository expert as a staged build, from a manual-context CLI to an indexed, code-aware and continuously updated system, with the artifacts each stage produces."
linkTitle: "Repository Expert: Roadmap"
---

The repository expert is the narrow, buildable entry point into [Code Intelligence]({{< ref "projects/code-intelligence" >}}): a tool that answers questions about one codebase. Instead of grepping for hours to understand how `UserAuth` interacts with `BillingService`, you ask it.

It is **repository-grounded**, **citation-first** and **read-only**: it explains and points to code but does not write new code (see [requirements]({{< ref "projects/code-intelligence/repository-expert/requirements" >}})). The stages move context selection, and later action, from the user to the software, one step at a time.

Related notes: [requirements]({{< ref "projects/code-intelligence/repository-expert/requirements" >}}), [evaluation]({{< ref "projects/code-intelligence/repository-expert/evaluation" >}}), [deployment]({{< ref "projects/code-intelligence/repository-expert/deployment" >}}).

## Stage 0: the pipe (manual context)


Most complications in AI engineering (RAG, vector stores, agents) come from managing context automatically. The first version strips that away: *you* are the retriever, and the LLM is a pure reasoning engine. This verifies prompt structure and answer quality before retrieval adds its own failure modes.

```bash
cat network_handler.py | ask "Is the connect function thread-safe?"
```


**Architecture.** Unix philosophy: input is a text stream (code context plus instruction), processing is one stateless LLM call, output is Markdown on stdout. Usage patterns: explicit files (`-f file.py`), piped stdin, or both.

**Internal structure.** Keep context assembly separate from inference, because retrieval will later fill the same slot.

1. *Ingestion*: read stdin and each `-f` argument; warn on missing files and continue.
2. *Formatting*: wrap each file as `<file path="...">...</file>` so the model can tell instructions from target code. Retrieved chunks will be injected here later.
3. *Inference*: build the payload and call the API, with temperature 0 for analysis.
4. *Output*: stream to stdout for perceived speed.

**System prompt.** Rigid, to prevent chatting: analyze code given in tags; answer strictly from the provided context; if the context is insufficient, say exactly what is missing; dense technical prose; Markdown output.

**Why this prepares for RAG.** It defines the RAG contract. Today the `<context>` block is filled by hand; later a retriever fills the same block. Contexts that produced good answers can be saved as the first golden dataset for testing the retriever (see [evaluation]({{< ref "projects/code-intelligence/repository-expert/evaluation" >}})).

## Stage 1: the index


Replace the manual `cat` with a software component.

- **Indexing loop (offline).** Walk the repository; chunk by function and class rather than arbitrary text; embed chunks (a hosted embedding model or a local one); store them, at first in a local file, later in a vector database.
- **Retrieval loop (run time).** `ask "How does the billing service handle retries?"` embeds the question, finds the top chunks related to billing and retries, and injects them into the same context block.

Retrieval quality is easy to see at this stage: bad retrieval returns login code for a billing question and the answer is invented; good retrieval returns the exact `process_payment` function. The hard problems appear quickly: keeping chunks current when code changes, and feeding the dependency graph into the context rather than only keyword matches.

## Stage 2: code-native context


Character-count chunking produces orphaned code, so the index becomes structure-aware ([Code representation]({{< ref "projects/code-intelligence/code-representation" >}})):

- **Representation decisions.** Current state only (HEAD) or also history (Git log and blame); start with HEAD. Vector search alone, or augmented with a graph of precise relationships ("inherits from", "calls").
- **AST chunking** into classes, functions and methods, keeping the envelope (the class signature of a retrieved method).
- **Metadata** on every chunk: language, path, line range, parent scope.
- **Dependency links** between chunks for multi-hop retrieval.
- **Hybrid index**: dense for concepts, BM25 for exact symbols, plus a summary index of file and module summaries for architectural questions.
- **Repository map**: a compressed file tree with key signatures, and a **symbol table** mapping classes, functions and exports to paths and lines.
- **Privacy rules**: exclude secrets and sensitive files from indexing, aligned with `.gitignore`.

## Stage 3: orchestration and context expansion


Top-k is rarely enough for code ([Context expansion]({{< ref "projects/code-intelligence/retrieval" >}}#context-expansion)):

- **Read-only agent.** Instead of being given files, the assistant decides what to read: query decomposition, a repository-walking fallback that lists and reads files when search fails, and a reference graph built while answering to pull in interfaces and base classes.
- **Code-aware reranking**: definitions above usages.
- **Snippet formatting** with line numbers, so the model can say "look at line 42", ordered dependencies first.

## Stage 4: continuous indexing


An expert that is two hours out of date is often useless during active development.

- Event-driven re-indexing from CI: on a push to `main`, re-parse only changed files.
- Branch-aware index, partitioned or tagged by Git reference.
- Pruning of vectors for deleted files.
- A latency monitor for time to index after a commit.

## Beyond read-only


A later "active agent" gains tools and write access (running tests, proposing patches). That crosses the read-only boundary in [requirements]({{< ref "projects/code-intelligence/repository-expert/requirements" >}}) and belongs to the wider design in [Hybrid architecture]({{< ref "projects/code-intelligence/hybrid-architecture" >}}), with risk tiers and validation gates.

## What changes compared with generic RAG


| Phase | Generic LLM artifact | Repository-expert artifact |
| --- | --- | --- |
| Data | PDF or text chunking | Tree-sitter AST parsing |
| Index | Vector store | Hybrid store (vector, keyword, graph) |
| Context | Top-k retrieval | Context expansion (definition plus usage) |
| Evaluation | Text similarity | Symbol existence checks |
| Operations | Periodic sync | CI-triggered incremental indexing |

## Project workstreams and artifacts


| Workstream | Goal | Key artifacts |
| --- | --- | --- |
| Scope and requirements | Fix what the system is and is not | Problem statement with personas, top questions and non-goals; requirements spec; risk tiers (security, credentials, auth, money, production config); success metrics |
| Access and data boundaries | Define what the system may see, store and log | Source inventory (repos, branches, monorepo boundaries, docs, optional history); access-control model; retention and logging policy; secret-handling policy |
| Architecture and contracts | Components with strict behavior | Interface spec (ingestion, retrieval, answer composer, citation formatter, guardrails, telemetry); behavior contract; output format (answer, evidence, how to verify, uncertainties) |
| Ingestion and indexing | Searchable, versioned knowledge | Snapshot strategy (commit pinning, update frequency); chunking spec with line numbers; index schema (repo + commit + path + chunk); file-type policy for generated and vendored code; coverage report |
| Retrieval and grounding | Find the right evidence, prevent guessing | Retrieval strategy (lexical and semantic blend, scope filters, reranking); evidence selection policy; grounding rules (when to ask, when to abstain); citation format |
| Safety and misuse | Handle adversarial content and requests | Threat model (injection in docs and comments, exfiltration, permission bypass); guardrail rules; adversarial test pack; incident playbook |
| Evaluation | Requirements as measurable gates | Task taxonomy, golden dataset, scoring spec, harness, release gates ([evaluation]({{< ref "projects/code-intelligence/repository-expert/evaluation" >}})) |
| Iteration | Improve without breaking trust | Versioning of prompts, policies and indices; canary process; regression packs; failure taxonomy; every production failure becomes a test |
| Operations | Run it as a production system | Telemetry schema; dashboards; runbooks (index rebuild, rollback); latency and availability SLOs plus quality gates |
| Launch | Phased rollout with feedback | Beta plan by repo and risk tier; feedback labels ("wrong evidence", "missing file"); quarterly review |

Three artifacts constrain everything else and come first:

1. the **behavior contract**, especially no code generation and the grounding and abstention rules;
2. the **chunking and citation spec**, because line-number integrity is the core of trust;
3. the **golden dataset schema and scoring spec**, so that architecture choices serve evaluation rather than the reverse.
