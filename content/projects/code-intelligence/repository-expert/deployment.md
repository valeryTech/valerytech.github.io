---
draft: false
toc: true
title: "Repository Expert: Deployment"
description: "Distribution patterns for the repository expert, from a stateless local CLI to a shared retrieval service, with the scaling stages and the interfaces to fix early."
linkTitle: "Deployment"
---

How the repository expert is distributed follows from three choices:

1. **Where inference runs**: a local model, a self-hosted model in your network, or an external API.
2. **Where retrieval state lives**: nowhere (files are passed in), a local index, or a shared index service.
3. **How people invoke it**: CLI or IDE, chat bot, or HTTP API.

Once these are fixed, the pattern is mostly determined. Stages of the product itself are in [roadmap]({{< ref "projects/code-intelligence/repository-expert/roadmap" >}}).

## Patterns


| Pattern | What it is | Pros | Cons | Fits |
| --- | --- | --- | --- | --- |
| Local CLI, no index | A package or binary that reads files or stdin, assembles context, calls a model, prints the answer | Simplest; fast iteration; works offline with a local model | Does not scale to large repositories; window limits; no shared caching | Stage 0 and early Stage 1 |
| Local CLI with local index | Same CLI with an on-disk index per repository (embeddings, metadata, BM25) | Code stays on the machine; no infrastructure | Every developer repeats indexing; inconsistent index versions | Small teams, sensitive code |
| Shared retrieval service | A service in your network owns indexing and retrieval; clients send queries | One index per repository, shared caching, consistent behavior, easier governance | Needs infrastructure, tenancy, auth and careful data handling | Several users and repositories |
| CI or code-review assistant | Runs on pull requests over the diff and surrounding code and posts comments | Fits existing workflow; narrow scope lowers cost and invented answers | Not interactive; careful permissions for forks and secrets | Review automation, policy checks |
| IDE extension | Plugin sending cursor, selection and repository signals to a local daemon or remote API | Best experience; editor context ("explain selection", "find references") | More surface area: auth, updates, failure modes | Broad team adoption |
| Air-gapped, self-hosted | Everything inside a restricted network with a self-hosted model | Strongest data control | Operations burden, hosting cost, slower model updates | Regulated code, data residency |

A common variant of the shared service keeps model calls on the client and does retrieval on the server, returning "context packs", so indices are not copied to every machine.

## Service topology


- **Monolith.** One service handles auth, retrieval, prompt assembly, the model call and streaming, over one store stack (vector store plus metadata database). Good until scale or organizational boundaries force a split.
- **Split services.** An **indexer** (batch and incremental) writes to the stores; a **retriever** serves top-k chunks; an **answerer** assembles prompts and calls the model; an optional **model gateway** isolates provider credentials, rate limits and caching. A queue between indexer and stores helps with large repositories.

Distribution formats: a Python package for the CLI, a single binary for easy internal distribution, container images for the service and indexer jobs, Kubernetes for a multi-tenant service. Serverless suits webhook-driven CI actions but rarely long-running indexing.

## Scaling stages


| Stage | Users | Inference | Retrieval and data | Key measure |
| --- | --- | --- | --- | --- |
| Local validator (proof of value) | The developer | Local quantized model (Ollama, llama.cpp) or local retrieval with an API model | Simple chunking, dense retrieval, local store (SQLite, Chroma, FAISS) | Retrieval precision: does it find the right definition? |
| Workgroup service (shared state) | 3 to 5 | One GPU node (TGI, vLLM) or a single API gateway; monolith | Persistent shared vector store (pgvector, Weaviate); CI-triggered ingestion; hybrid BM25 and vector search for exact identifiers; thin clients | Queue depth: the first concurrent queries |
| Department hub (throughput) | 20 to 50 | High-throughput serving with continuous batching (vLLM, TensorRT-LLM) | Cross-encoder reranking; per-user sessions and history | Tokens per second per user under load |
| Enterprise platform (governance) | Company-wide | Split services; semantic caching for common questions; speculative decoding | Asynchronous ingestion workers on separate queues; sharded vector store; code graph from AST; access-control-aware retrieval that filters results before they reach the model | Cache hit rate, cost per query |

The stages move from validating value (retrieval quality) to validating architecture (concurrency, latency, governance). The bottleneck shifts from client-side indexing I/O to shared state, then to throughput, then to cost and access control.

## Progression for this project


1. Local stateless CLI (now, with model calls mocked or direct).
2. A local index behind an interface, with the same CLI experience.
3. Retrieval extracted into a service once several users need a shared index.
4. IDE and CI integrations as further clients of the same retrieval and inference API.

## Interfaces to fix now


To move between stages without rewrites:

1. **Context schema.** A strict serialization for retrieved chunks (ID, AST node type, line span, path, commit) instead of raw strings.
2. **Retriever protocol.** An interface that separates the intent ("retrieve context for query X") from the implementation (cosine similarity, hybrid search, graph expansion), so the backend can change behind a stable client.
3. **Baseline metrics.** Deterministic evaluation (for example recall@k for function definitions, see [evaluation]({{< ref "projects/code-intelligence/repository-expert/evaluation" >}})) established at the first stage. Scaling infrastructure without a baseline hides quality regressions.
