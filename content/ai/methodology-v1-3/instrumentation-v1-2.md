---
draft: false
toc: true
title: "Instrumentation V1 2"
linkTitle: "Instrumentation V1 2"
---
# Instrumentation v1.2 -- Production Discipline for LLM / Agentic Systems


**AI Systems Framework**

This document defines a **production instrumentation discipline** with:

- explicit production failure modes,
- a phased adoption plan (small, verifiable increments),
- decision factors for when to add fields,
- and **sampling/retention** strategies to control cost while preserving debuggability and comparability.

The goal is to make **state definition computable** and support **regression attribution**.

This document assumes:

- a trace schema exists (see `trace_v1.3.json` in the schema pack),
- fingerprints follow `fingerprinting-spec-v1.3.md`,
- monitoring consumes `TimeBucketStateEstimate` and produces `ChangePacket`.

## 0. What "good instrumentation" means (operational definition)


Instrumentation is "good" when, for any incident or regression, the team can answer in <30 minutes:

1. **What changed:** which outcome/constraint metric moved (global + Tier-1 slices + key regimes)
2. **Where:** which slice/regime concentrates the change
3. **Why (attribution):** which plane (R/I/E/C/OBS) is most likely, supported by driver deltas
4. **What to do:** a recommended action (rollback, investigate tools, re-score, etc.)

Unreliable answers to #3 indicate insufficient instrumentation or data quality.

## 1. Refactoring principles (how to structure the doc and the implementation)

### 1.1 Separate three concerns


1. **Trace contract (what must be emitted):** required IDs, fingerprints, minimal spans, termination
2. **Analytics contract (what must be computable):** metrics, slices/regimes, driver metrics, coverage/missingness
3. **Ops contract (how to keep it affordable and safe):** sampling, retention tiers, privacy controls, access

Separating these contracts supports phased adoption.

### 1.2 The "envelope + details" pattern


Emit, at 100%:

- a **minimal envelope** per episode (IDs, fingerprints, routing, termination, high-level costs/latency, essential driver counters)

Emit, at sampled rates:

- detailed span arrays,
- tool/retrieval summaries,
- redacted input text,
- exemplars (full prompt/response under strict controls).

This is the main mechanism to control cost.

## 2. The trace contract (what must exist to be comparable)

### 2.1 Minimal envelope (MUST log for 100% of episodes)


**Identity and join**

- `trace_id`, `episode_id`, `variant_id` (or deployment key)
- `session_id` (online), `assignment_unit` and `experiment_id` (if applicable)

**Fingerprints (comparability)**

- `C_fingerprint`, `I_fingerprint`, `E_fingerprint_fixed`, `R_fingerprint`
- `code_fingerprint` (git SHA / image digest) recommended

**Routing and termination**

- `policy.route`, `policy_version`
- terminal `stop_reason` (success / timeout / max_steps / tool_failure / safety_block / schema_invalid / abandoned)
- budget hits (max steps / max time / max cost)

**Minimal performance counters**

- `latency_total_ms`
- `cost_total_usd` (if available)
- `tool_call_count`, `llm_call_count`, `retrieval_count`
- `tool_error_count`, `timeout_count`, `schema_invalid_count`
- `retrieval_empty_flag` (any empty retrieval occurred)

**Coverage/missingness counters**

- `trace_completeness_flag` (or completeness rate at aggregation)
- `payload_redaction_level` (none/redacted/hash-only)
- `exclusion_reason` if this episode will be excluded from scoring/metrics

This envelope is intentionally small and supports:

- outcome trends,
- constraint monitoring,
- coarse attribution,
- basic gating for "logging is broken."

### 2.2 Detailed spans (SHOULD log, but can be sampled)


A standard span model is still recommended (OTel style), but detailed span payloads should be subject to sampling.

Minimum span types:

- `llm.call`
- `tool.call`
- `retrieval.query`
- `policy.route`
- `postprocess.validate`

For each span, prefer summary fields:

- status, latency, token/cost, error taxonomy
- schema versions (for tools)
- retrieval top-k + empty + score stats

Avoid full payloads by default (see privacy and cost section).

## 3. Production problems to expect (and how to design around them)


This section is the key addition: these are the problems that routinely make instrumentation "look correct" but fail in production.

### 3.1 Partial traces (dropped spans / missing joins)


**Symptoms**

- success rate looks stable but "unknown" stop_reason grows
- driver metrics stop matching outcomes
- trace completeness drops, but nobody pages on it

**Causes**

- async pipeline drops (backpressure)
- trace context propagation breaks across services
- sampling applied inconsistently across spans

**Controls**

- trace completeness metric + stop-ship threshold
- "envelope always on" + sampled details
- context propagation tests in CI (golden trace)

### 3.2 Clock skew and distributed timing nonsense


**Symptoms**

- negative span durations
- latency breakdown sums exceed total latency by large factors
- p95 spikes with no corresponding driver

**Controls**

- prefer monotonic timers for duration; treat wall-clock only as ordering
- normalize durations at collection
- validate span timing invariants during ingestion

### 3.3 Cardinality explosions (cost + unusable dashboards)


**Symptoms**

- metrics backend costs spike
- dashboards become slow and unreadable
- alerting becomes noisy

**Causes**

- logging raw strings as labels (tool args, prompt snippets)
- per-user ids, per-request ids in metric labels

**Controls**

- enforce "low cardinality only" in metric tags
- store high-cardinality only in trace payload (sampled) not in metrics
- use hashing/bucketing for categories (e.g., context length buckets)

### 3.4 Variant imbalance due to sampling


**Symptoms**

- A/B results inconsistent between offline analysis and dashboards
- one variant appears to have more failures only because it was sampled more heavily

**Controls**

- sampling must be **balanced across variants**
- include `sampling_policy_id` in traces
- use stratified sampling by `variant_id × critical_slice × regime`

### 3.5 Over-logging PII / secrets (privacy incident)


**Symptoms**

- tool payloads contain credentials
- prompts contain customer data
- retrieval snippets contain sensitive documents

**Controls**

- strict field allowlists ("schema-validated extracts only")
- redaction pre-persist
- secret scanners in CI for structured logs
- separate secure store for "full text exemplars" with audited access

### 3.6 Outcome join drift (evaluation outputs don't match traces)


**Symptoms**

- outcomes missing for a large subset of traces
- gate decisions change after backfill
- "late arriving outcomes" reclassify incidents days later

**Controls**

- make evaluation join a first-class pipeline with SLAs
- include `outcome_version` and `scoring_time`
- treat missing outcomes as missingness (A6) with explicit counters
- implement backfill and "finalization windows" (e.g., only finalize yesterday)

### 3.7 Provider drift (looks like a regression, is actually upstream)


**Symptoms**

- shifts across all variants
- judge errors spike
- tool call latency changes without deploys

**Controls**

- sentinel suite + anchor scoring (R-plane)
- provider/region identifiers in E_observed
- incident classification: "provider drift" separate from "model regression"

## 4. Phased adoption plan (start small, verifiable increments)


The goal is to reach "decision-grade" instrumentation without boiling the ocean.

### Phase 0 -- Minimal envelope + termination taxonomy (1-2 days)


**Deliver**

- 100% envelope per episode
- stable stop_reason enum
- fingerprints attached
- trace completeness metric (even if crude)

**Verify**

- can compute: success proxy, timeout rate, tool error rate, p95 latency
- can attribute "latency spike" to LLM vs tool at least via counters

### Phase 1 -- Core spans (sampled) + driver metrics (1-2 weeks)


**Deliver**

- sampled span arrays: llm/tool/retrieval
- standardized error taxonomy and retry counters
- tool and retrieval "summary" fields (no payloads)

**Verify**

- top 5 failure modes dashboard
- regime splits: tool_health, retrieval_empty
- ChangePacket can include "why" for common incidents

### Phase 2 -- Slice predicates + Tier-1 coverage (1-3 weeks)


**Deliver**

- input-defined slice flags computed at ingestion (or runtime)
- Tier-1 slice coverage and min-n monitoring
- sampling stratified to protect Tier-1 visibility

**Verify**

- Tier-1 slice metrics are stable and populated
- Simpson's paradox caught: global vs Tier-1 deltas diverge

### Phase 3 -- Ruler and observability integrity (2-4 weeks)


**Deliver**

- ruler version references (`R_fingerprint`, `ruler_version_id`)
- anchor drift monitoring for the ruler
- explicit missingness policy and counters wired into state snapshots

**Verify**

- Stage 0 integrity gating works:
	- ruler unhealthy -> INCONCLUSIVE
	- trace completeness regression -> alert/stop-ship for decision-grade claims

### Phase 4 -- Secure exemplars and replayability (optional, when needed)


**Deliver**

- exemplars pipeline: store small number of full prompts/outputs for failure clusters under strict access
- capture tool side-effect flags and idempotency markers
- replay harness for offline debug (without side effects)

**Verify**

- for a confirmed incident, the team can retrieve 20 representative traces across the dominant slice/regime and reproduce the failure class

## 5. Decision factors: what to instrument next (and when)


Add a field/span only if it passes most of these tests:

### 5.1 Does it change a decision?


- Enables a release gate, constraint, or monitoring trigger
- Improves Stage 3 attribution (planes-first triage)
- Enables a Tier-1 slice or critical regime split

### 5.2 Is it stable and interpretable?


- low cardinality or aggregatable
- semantics won't change weekly
- clearly defined default/missing behavior

### 5.3 Is it safe and affordable?


- privacy-safe (or can be redacted)
- computed cheaply at runtime
- not large in payload size

### 5.4 Does it reduce time-to-triage?


- answers a common "why did this regress?" question:
	- tool health?
	- retrieval empty?
	- schema invalid?
	- loop rate?
	- truncation?

**Practical heuristic:** instrument the top 3 unresolved incident classes first.

## 6. Sampling strategy (cost control without losing truth)


The objective is: keep evidence for **failures, gate-critical slices, and tails**, while sampling routine successes.

### 6.1 Three-tier logging model (recommended default)


**Tier A -- Always-on envelope (100%)**

- minimal fields in §2.1

**Tier B -- Always-on for "important episodes" (100% of a subset)**

Always collect detailed spans for episodes that are:

- failures (non-success stop_reason)
- in Tier-1 slices
- in degraded regimes (tool health degraded, retrieval empty)
- tail events (latency p99 bucket, cost spike)
- security/safety triggers

**Tier C -- Sampled detailed spans + exemplars**

- successes sampled at 1-20% depending on volume/cost
- stratify by variant and key slices/regimes to keep balanced evidence
- store full text/tool payloads only for a tiny exemplar fraction under strict control

### 6.2 Balanced sampling for experiments


- sampling must be **balanced by variant**
- emit `sampling_policy_id` and `sampling_weight` (if used) to allow unbiased estimators

### 6.3 Dynamic sampling (optional, high leverage)


Use an adaptive policy:

- increase sampling rate automatically when:
	- a Tier-1 metric crosses an anomaly threshold,
	- a new deploy occurs,
	- tool error spikes.

This limits routine cost but captures detail during incidents.

## 7. Retention and storage strategy (avoid "everything forever")

### 7.1 Retention tiers


- **Aggregates / State** (long): months+
- **Envelope traces** (medium): weeks-months
- **Detailed spans** (short): days-weeks (depending on volume)
- **Full text exemplars** (very short + restricted): days (or secure vault with strict TTL)

### 7.2 Storage separation


- metrics warehouse (low cardinality, aggregated)
- trace store (semi-structured; queryable)
- secure exemplar store (restricted access, audited, TTL)

## 8. Verification and integrity checks (instrumentation as a testable subsystem)


Implement automated checks:

- schema validation on ingestion (reject invalid)
- completeness checks (expected span types present when counters indicate they should be)
- invariants:
	- end_time ≥ start_time
	- episode has exactly one termination reason
	- fingerprint fields present
- sampling invariants:
	- balanced across variants
	- 100% failures captured at required detail tier
- privacy scans (no secrets in payload fields)

## 9) "Minimal but sufficient" field sets (recommended defaults)

### 9.1 Always-on envelope (copy-paste checklist)


- ids: trace_id, episode_id, variant_id, session_id?
- fingerprints: C, I, E_fixed, R, code
- routing: route_name, policy_id/version
- termination: reason + budgets hit flags
- totals: latency_total_ms, cost_total_usd
- counters: llm_call_count, tool_call_count, retrieval_count
- errors: tool_error_count, timeout_count, schema_invalid_count, retrieval_empty_flag
- observability: redaction_level, completeness_flag, exclusion_reason

### 9.2 "Important episode" span details


- per-llm: model_id, params, tokens, latency, finish_reason, status
- per-tool: name, schema versions, latency, status, error class, retry_count, side_effect flag
- per-retrieval: empty, top_k, score stats, index_snapshot_id (or policy id), latency
- agent: steps, loop_detected, stop_reason

## 10. Interface to state snapshots and change detection


Instrumentation must enable:

- `StateEstimate` construction: metrics + uncertainty + Tier-1 slices + regimes + drivers
- Stage 0 integrity: ruler health + coverage metrics
- Attribution: driver deltas and regime-conditioned metrics
- ChangePacket exemplars: representative episodes for dominant slice/regime clusters

If a requested change detection field cannot be computed from traces, it should be treated as an instrumentation gap.

## Appendix A -- Common "first incidents" and the minimum fields required


1. **Tool outage / rate limiting**
- tool.status, error_code, rate_limit flags, tool latency
- regime label `tool_health`
2. **Retrieval empty / low evidence**
- retrieval.empty, score stats, index snapshot policy/id
3. **Schema invalid outputs**
- validator result flags, schema version ids, repair/retry counters
4. **Agent loops / max steps**
- steps, loop_detected, termination reason
5. **Provider drift**
- provider/model ids, judge errors, anchor drift (R-plane), tool latency shifts (E-plane)

## Appendix B -- Core contract and production controls


The core instrumentation contract includes:

- episode as atomic unit,
- fingerprints,
- core spans,
- sampling/retention basics,
- failure taxonomy, and MVP plan.

The production controls include:

- production failure modes and controls,
- phased adoption with verification criteria,
- decision factors for adding fields,
- explicit envelope+details sampling model,
- integrity checks as a first-class requirement.
