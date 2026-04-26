---
draft: false
toc: true
title: "Curriculum V3"
linkTitle: "Curriculum V3"
---
# AI Systems (RAG + Agents) Curriculum v3 -- Platform/Backend Track


This version is optimized for **platform/backend roles with LLM keywords**: you lead with **retrieval + evaluation + constraints**, and you add **bounded autonomy** (agent runtime) as a controlled layer.

It keeps the v2 philosophy -- agent control, tool contracts, evaluation, serving/performance, and security as first‑class concerns.

## 1. Target outcome (what you should be able to do)


By the end, you can:

- ship a **retrieval platform** (ingestion -> hybrid retrieval -> rerank -> provenance) with **offline eval gates**
- run it under explicit constraints: **latency / cost / privacy / reliability**
- add a **bounded-autonomy orchestration layer** (workflow-first; agent steps only when justified)
- operate it like a service: telemetry, SLOs, rollback rules, incident playbooks
- support **on‑prem inference** mode (air‑gap / egress-block) and benchmark the serving envelope

## 2. The spine: artifacts (single-file now, split later)


Maintain one "all-in-one artifacts" doc, then split into files later.

Minimum sections to keep current:

- ADR log (decisions + trade-offs + rollback)
- RETRIEVAL_EVALS (golden set, metrics, slicing, thresholds)
- ABLATIONS (parameter sweeps + attribution)
- FAILURE_MODES (taxonomy + detection + mitigation)
- COST_MODEL (unit economics + budgets + degradation tiers)
- SLO_AND_ROLLBACK (SLOs + canary + rollback triggers)
- On‑prem proof (egress test + saturation knee + quantization study)

## 3. Program structure: 6 sprints (12 weeks)


Each sprint produces:

1. one capability in code
2. one measurable report (eval/bench/ablation)
3. one artifact update (ADR/failure mode/cost/SLO)

If you have less time, do Sprints 0-3 first (that already matches many platform JDs).

### Sprint 0 (Week 1-2): Foundation + repo discipline


**Build**

- FastAPI service skeleton + worker (async jobs) + Postgres + Redis (or equivalent)
- structured logging + request correlation IDs
- CI: unit tests + lint + one integration test

**Write**

- PROBLEM_SPEC: task, constraints, acceptance tests, target SLOs
- DESIGN (one page): baseline architecture + data flow

**Done when**

- fresh machine: `make test` + `make up` works
- one end-to-end "hello" request traces through API -> worker -> storage

### Sprint 1 (Week 3-4): Retrieval baseline + offline eval gate


**Build**

- ingestion pipeline v1 (pdf/html -> text -> chunks -> embeddings -> pgvector)
- retrieval API v1 (dense-only is fine)
- provenance in outputs (doc_id + span metadata)

**Measure**

- golden set v1: 30-50 queries with expected sources
- metrics: Recall@5, NDCG@10, expected-source pass rate
- CI gate: baseline vs candidate comparison (even if thresholds are loose at first)

**Write**

- RETRIEVAL_EVALS section + FAILURE_MODES (ingestion/retrieval)

**Done when**

- you can run: ingest -> eval -> see a baseline report

### Sprint 2 (Week 5-6): Hybrid retrieval + reranking + ablations


**Build**

- sparse index (BM25) + dense index + fusion
- reranker (cross-encoder) behind a latency budget (rerank-on-ambiguity policy)

**Measure**

- ablation runner: sweep chunk_size/overlap, alpha, candidate_k, rerank_k
- slice reports by query tags (procedural vs definitional; pdf vs html)

**Write**

- ABLATIONS section with at least 2 completed experiments + attribution notes
- ADRs for: hybrid choice, reranker choice, rerank policy (always vs conditional)

**Done when**

- you can explain exactly why quality improved (not just "added reranker")

### Sprint 3 (Week 7-8): On‑prem mode + privacy + capacity envelope


**Build**

- local inference serving option for embeddings and/or reranking (vLLM/TGI)
- egress-block/air-gap simulation for inference container
- routing: local first; fallback path documented

**Measure**

- saturation knee study: concurrency sweep, p95/p99, tokens/sec
- quantization sensitivity: FP16 vs 4-bit variant; measure throughput + task metric deltas
- cost model: $/1k queries, $/success; budgets + degradation tiers

**Write**

- on-prem proof section + COST_MODEL updates + SLO draft

**Done when**

- you can show a benchmark table + the operating point you chose (and why)

### Sprint 4 (Week 9-10): Bounded autonomy (workflow-first agents)


**Build**

- explicit workflow graph / state machine (steps, invariants, stop reasons)
- tool gateway with schema-first contracts (Pydantic), idempotency keys, audit log
- structured outputs end-to-end (JSON schema compliance)

**Measure**

- scenario eval suite (20-30 cases): tool correctness, loop rate, budget compliance
- regression gate for control policy (stop reasons, termination, tool validity)

**Write**

- CONTROL_POLICY (budgets, termination, topology selection, verification limits)
- FAILURE_MODES (agent-specific: loops, thrash, invalid args)

**Done when**

- the "agent" cannot loop forever and cannot execute invalid tool calls

### Sprint 5 (Week 11-12): Ops readiness (SLOs, security, rollouts)


**Build**

- tracing across retrieval + model + tools (stage timings)
- dashboards/metrics endpoint (p50/p95/p99, tool error rate, retrieval misses, cost/task)
- canary + rollback hooks (synthetic regression triggers rollback)

**Security**

- threat model + prompt injection suite (10+ attacks)
- least privilege tool scopes; secrets hygiene; safe logging boundaries

**Write**

- SLO_AND_ROLLBACK (SLOs + triggers + triage checklist)
- RUNBOOK (top incidents + recovery steps)
- CHANGELOG (what changed + expected metric impact)

**Done when**

- you can demo a canary rollback on a controlled regression, with evidence

## 4. How to study each sprint (cadence)


Weekly cadence (repeat):

- 2 days build (feature)
- 1 day measure (eval/bench)
- 1 day write (artifact + ADR)
- 1 day interview drill (one system design + one incident narrative)

Keep a "story bank" of 8-10 stories:

- retrieval improvement attributed by ablation
- parsing/ingestion failure prevented
- hybrid fusion tuning (score distribution skew)
- rerank latency vs quality trade-off
- drift/freshness incident
- on‑prem saturation incident (knee + mitigation)
- security boundary / egress proof
- rollback story (eval gate or canary)

## 5. Optional extensions (only after Sprint 3)


Pick at most one:

- Multi-agent: coordinator/worker + arbitration + load tests
- Framework port: minimal orchestrator + one external framework
- Adaptation: reranker/embedding fine-tune with evaluation + rollout/rollback

If you do extensions, keep the rule: built -> controlled -> measured.

## 6) "Done" checklist for platform/backend hiring


You are interview-ready when you can hand a reviewer:

- an eval report (baseline vs candidate) with Recall/NDCG deltas
- an ablation table that attributes gains to specific parameters
- a benchmark table for on‑prem serving (tokens/sec, p95/p99, saturation knee)
- a failure modes doc with detection + mitigation paths
- a cost model with budgets and degradation tiers
- an SLO + rollback policy with a demo rollback
