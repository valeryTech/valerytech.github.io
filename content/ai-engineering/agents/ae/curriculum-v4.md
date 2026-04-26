---
draft: false
toc: true
title: "Curriculum V4"
linkTitle: "Curriculum V4"
---
# AI Systems (RAG + Agents) Curriculum v4 -- Platform/Backend Track


*(Retrieval-first + On‑prem spike + bounded-autonomy agents; measurement always)*

This curriculum is optimized for **platform/backend roles with LLM keywords**. It treats LLM systems as **probabilistic distributed systems**: you ship capabilities, but you're hired for **controls + constraints + evidence**.

Configuration:

- Primary lane: **Retrieval / RAG / Ranking**
- Secondary spike: **On‑prem / Model Ops** (privacy + capacity + unit economics)
- Controlled layer: **Workflow-first orchestration**, agent steps only where justified
- Differentiator: **offline evaluation + ablations + sensitivity analysis**

Single-artifact approach (for now):

- Maintain all artifacts in one file: `artifacts-all-in-one.md` (later split into separate docs).

## 1. Target outcome (what you should be able to do)


By the end, you can hand a reviewer:

- a working retrieval service (ingestion -> hybrid retrieval -> rerank -> provenance)
- **comparative offline eval** (Baseline vs Candidate) with **Recall@5** and **NDCG@10**
- **ablation reports** that attribute improvements to specific parameters
- an on‑prem benchmark report (tokens/sec, p95/p99, saturation knee) + chosen operating point
- a constraints story: latency/cost/privacy enforced with graceful degradation
- a bounded-autonomy workflow layer with tool contracts + deterministic replay tests
- an ops pack: SLOs, rollback triggers, failure modes, runbooks

## 2. Operating rule (use it every week)


Every week you must produce **all three**:

1. **Build** one capability in code
2. **Measure** one report (eval / ablation / benchmark)
3. **Write** one artifact update (ADR / failure modes / cost / SLO)

If any one is missing, the sprint isn't done.

## 3. Program structure: 6 sprints (12 weeks)

### Sprint 0 (Week 1-2): Foundation + repo discipline


**Build**

- Service skeleton (API + worker + storage) with a clean module layout
- Postgres + pgvector (or equivalent) + migrations
- Basic telemetry primitives (structured logs + request IDs)

**Measure**

- Define initial latency/cost/privacy constraints (even as placeholders)
- Minimal "smoke eval": 5 queries + expected sources

**Write**

- `artifacts-all-in-one.md`: initialize sections (ADRs, evals, failure modes, cost model, on‑prem proof)
- ADR-0001: baseline retrieval architecture + constraints

**Done when**

- you can run the system locally end-to-end with a single command and get a traceable response with provenance

### Sprint 1 (Week 3-4): Retrieval baseline + offline eval gate **(+ Dirty Data challenge)**


**Build**

- Ingestion v1: pdf/html -> parse -> clean -> chunk -> embed -> index
- Retrieval API v1 (dense-only is fine) + provenance (doc_id + span metadata)

**Constraint challenge: "Hard parsing / dirty data"**

- Ingest at least one **messy PDF** (multi-column, tables, repeated headers)
- Implement **layout-aware cleanup** (header/footer stripping, section preservation, table policy)

**Measure**

- Golden set v1: 30-50 queries with expected sources + tags (pdf/html, procedural/definitional)
- Metrics: **Recall@5**, **NDCG@10**, expected-source pass rate
- CI gate: baseline vs candidate comparison (thresholds can be loose initially)

**Write**

- Update artifacts: RETRIEVAL_EVALS + FAILURE_MODES (parsing failures vs retrieval failures)
- ADR-0002: parsing/chunking approach and why (including failure cases)

**Done when**

- you can run: ingest -> eval -> produce a baseline report
- you have at least one documented parsing failure mode and a mitigation

### Sprint 2 (Week 5-6): Hybrid retrieval + reranking + ablations **(+ Score distribution analysis)**


**Build**

- Sparse retrieval (BM25/FTS) + dense retrieval + hybrid fusion
- Cross-encoder reranker behind a latency budget (rerank-on-ambiguity policy)

**Constraint challenge: "Score distribution analysis (no vibes tuning)"**

- Before tuning hybrid alpha:
	- collect BM25 score samples and dense similarity samples for the golden set
	- analyze magnitude/skew differences
	- implement a **normalization strategy** for fusion (e.g., z-score, min-max, percentile clipping)
- Keep a "before vs after normalization" visualization (simple histograms are enough)

**Measure**

- Ablation runner: sweep chunk_size/overlap, alpha, candidate_k, rerank_k
- Slice results by tags (pdf vs html; procedural vs definitional; domain categories)

**Write**

- Update artifacts: ABLATIONS (≥2 completed experiments with attribution)
- ADRs:
	- hybrid fusion decision + normalization approach
	- reranker selection + rerank policy (always vs conditional)

**Done when**

- you can explain exactly why quality improved (not "we added reranker")
- you can show a normalization plot and a chosen alpha operating point

### Sprint 3 (Week 7-8): On‑prem mode + privacy + capacity envelope


**Build**

- Local inference option for embeddings and/or reranking (vLLM/TGI)
- Egress-block / air-gap simulation for inference container (network boundary)
- Routing policy documented (local-first; safe fallback path)

**Measure**

- Saturation knee study: concurrency sweep -> tokens/sec, p95/p99, queue time vs GPU time
- Quantization sensitivity: FP16 vs 4-bit variant; measure throughput **and retrieval task metrics** (Recall/NDCG deltas)
- Update cost model: $/1k queries, $/success; budgets + degradation tiers

**Write**

- Update artifacts: on‑prem proof section + COST_MODEL + rollback notes
- ADR-0005: on‑prem serving choice + measured envelope + operating point

**Done when**

- you can show a benchmark table + explain the operating point you chose (and why)
- you can prove egress-block with a verification test

### Sprint 4 (Week 9-10): Bounded autonomy (workflow-first agents) **(+ Deterministic replay)**


**Build**

- Workflow graph / state machine: steps, invariants, stop reasons, budgets
- Tool gateway: schema-first contracts (Pydantic), preflight validation, idempotency keys, audit log
- Structured outputs end-to-end (fail-closed JSON schema compliance)

**Constraint challenge: "Deterministic replayability"**

- Implement run recording:
	- inputs, retrieved evidence IDs, tool calls + tool outputs, selected routes, config versions
- Implement a replay mechanism:
	- rerun the same scenario in a unit test and assert identical decisions/results (within defined tolerances)
- Store a small set of replay fixtures in-repo (redacted)

**Measure**

- Scenario eval suite (20-30 cases): tool correctness, loop rate, budget compliance
- Regression gates for control policy (stop reasons, termination, tool validity)
- Measure "invalid tool args rejected pre-flight" rate

**Write**

- Update artifacts: CONTROL_POLICY + agent-specific FAILURE_MODES + replay design notes
- ADR: workflow vs agent boundary + why you chose agent steps only for specific tasks

**Done when**

- the agent cannot loop forever, cannot execute invalid tool calls, and can be replayed deterministically in CI

### Sprint 5 (Week 11-12): Ops readiness (SLOs, security, rollouts)


**Build**

- Tracing across retrieval + model + tools (stage timings)
- Dashboards/metrics: p50/p95/p99, loop rate, tool error rate, retrieval misses, cost/task
- Canary + rollback hooks (synthetic checks trigger rollback)

**Security**

- Threat model + prompt injection suite (≥10 attacks)
- Least privilege tool scopes; secrets hygiene; safe logging boundaries

**Measure**

- SLO burn alerts + rollback drills (force a regression -> observe rollback)
- "Black box" incident drill: pick a failure mode and run through detect -> mitigate -> prevent

**Write**

- Update artifacts: SLO_AND_ROLLBACK + runbooks + final failure-modes coverage table

**Done when**

- you can demo a safe deployment and a rollback triggered by measurable regression

## 4. Default deliverables list (minimum evidence)


You should end with:

- a baseline vs candidate eval report (Recall@5, NDCG@10)
- ≥2 ablation experiments with attribution
- a hybrid normalization analysis (before/after plot + chosen alpha)
- a saturation knee benchmark + chosen operating point
- a quantization sensitivity report tied to retrieval metrics
- deterministic replay tests for bounded-autonomy workflows
- threat model + rollback drill notes

## 5. If time is short (the 80/20 path)


If you only have 6-8 weeks:

- do Sprints 0-3 fully (retrieval + eval + ablations + on‑prem proof)
- only add the *minimal* tool-contract layer from Sprint 4 (schema-first + preflight + budgets)

## 6) "Done" checklist for platform/backend hiring


You are interview-ready when you can hand a reviewer:

- an eval report (baseline vs candidate) with Recall/NDCG deltas
- an ablation table that attributes gains to specific parameters
- a normalization plot for hybrid fusion + your chosen operating point
- a benchmark table for on‑prem serving (tokens/sec, p95/p99, saturation knee)
- a failure modes doc with detection + mitigation paths
- a cost model with budgets and degradation tiers
- deterministic replay tests for at least one bounded-autonomy workflow
- an SLO + rollback policy with a demo rollback
