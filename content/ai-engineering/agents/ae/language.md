---
draft: false
toc: true
title: "Language"
linkTitle: "Language"
---
# Agent Systems Language & Signals (ML/IR + Platform)


Purpose: provide high-signal terminology and framing for non-deterministic systems work.

Use cases: resume bullets, interview answers, design docs, PRDs, postmortems.

## How to use this document


- Pick the **domain** (RAG/IR, eval, runtime, safety, cost).
- Use the **signal phrases** and **metrics**.
- Avoid vague labels ("hallucination", "agent magic") -- use the taxonomy.

## 1. Translation table: vague -> domain language


| Vague phrasing | Better phrasing | What it signals |
|---|---|---|
| "reduced hallucinations" | "reduced ungrounded generation via provenance policy + citation checks" | grounding + enforcement |
| "improved RAG quality" | "+X Recall@K, +Y NDCG@K on slice Z; reduced retrieval false negatives in top-K" | IR measurement discipline |
| "made it reliable" | "added stop reasons, budgets, replay, rollback gates; reduced SFR" | ops + bounded variance |

## 2. Domain kits (phrases + metrics + failure modes)

### 2.1 Retrieval / IR / Context engineering


**Use when:** RAG, search, memory, doc pipelines

**Signal phrases:** lexical vs semantic mismatch, top-K false negatives, rerank-on-ambiguity, slice evals, provenance, freshness

**Metrics:** Recall@K, NDCG@K, MRR, coverage, source-pass rate, staleness rate

**Failure modes:** stale index, query drift, duplicate clusters, authority mismatch, injection via docs

### 2.2 Evaluation & measurement


**Use when:** "prove it works", regressions

**Signal phrases:** baseline vs candidate, ablations, sensitivity analysis, CI gates, offline -> online ladder

**Metrics:** task success, tool correctness, CSR/SFR, p95 quality, confidence intervals

**Failure modes:** judge drift, rubric ambiguity, eval-prod mismatch, silent regressions

### 2.3 Calibration & decision-making under uncertainty


**Use when:** routing/escalation/autonomy

**Signal phrases:** selective prediction, abstention thresholds, calibrated uncertainty, coverage vs risk trade-off

**Metrics:** calibration error (ECE), acceptance rate, escalation rate, regret/cost curves

**Failure modes:** miscalibration under shift, escalation storms, over-abstention

### 2.4 Runtime control & state


**Use when:** agents, orchestration, HITL

**Signal phrases:** explicit state machine, checkpoints, replayability, stop reasons, bounded loops

**Metrics:** loop rate, stop-reason distribution, replay success rate, time-to-diagnose

**Failure modes:** hidden state, non-terminating loops, partial state, irreproducible runs

### 2.5 Tool safety & side effects


**Use when:** tool calling, writes, workflows

**Signal phrases:** idempotency, exactly-once-ish, plan-commit split, compensation/sagas, least privilege

**Metrics:** duplicate side-effect rate, tool schema-valid rate, rollback/undo rate

**Failure modes:** retry amplification, non-idempotent writes, poisoned tool outputs, privilege creep

### 2.6 Inference economics & coordination


**Use when:** cost/latency/scale

**Signal phrases:** cost-per-outcome, budget enforcement, backpressure, load shedding, coalescing, caching as a route

**Metrics:** p95/p99 latency, $/success, escalation cost, saturation knee, queue depth SLAs

**Failure modes:** tail collapse, cost blowups, unfairness across tenants, silent degradation

### 2.7 Security & adversarial risk


**Use when:** public systems, sensitive data, compliance

**Signal phrases:** threat model, prompt injection, tool-output poisoning, exfiltration paths, auditability/retention

**Metrics:** attack success rate (red-team suite), policy violation rate, PII leak rate

**Failure modes:** jailbreaks, scope escalation, data leakage, audit gaps

## 3. Taxonomy: replace "hallucination" with precise labels


- Ungrounded generation (no supporting evidence)
- Citation mismatch (evidence present but not supporting the claim)
- Retrieval miss (relevant doc exists but not in top-K)
- Tool argument invalidity (schema/constraint violation)
- Policy violation (unsafe action, permission breach)
- Staleness (answer grounded but outdated)
- Distribution shift (routing/calibration mismatch)

## 4. Resume bullet scaffolds (domain-specific)


Provide 6-10 templates, e.g.:

- "Improved retrieval by ... measured by Recall@K/NDCG@K on ... slices; added ... gating."
- "Reduced cost-per-success by ... via routing/coalescing/caching; enforced budgets with ...; maintained quality via ..."

## 5. Interview probes: what they ask -> what you answer with


Map common questions to the domain kit + artifacts.

## 6. Artifact index


Link to the "show me" files:

- `RETRIEVAL_EVALS.md`, `CONTEXT_POLICY.md`, `STATE_MODEL.md`, `TOOL_CATALOG.md`,
  `CONTRACTS.md`, `EVAL_GATES.md`, `ROLLBACK.md`, `COST_MODEL.md`

## 7. Short "default vocabulary" list


A compact list of the 30-50 terms you actually want to use regularly.
