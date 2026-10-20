---
draft: false
toc: true
title: "Estimation v1.2 — Production Discipline for LLM / Agentic Systems"
description: "A production estimation design converting episode measurements into state estimates and deltas, with metric-specific uncertainty, cluster-aware inference, missingness controls, and explicit window finalization."
linkTitle: "Estimation v1.2"
---
# Estimation v1.2 -- Production Discipline for LLM / Agentic Systems


**AI Systems Framework**

This document refactors and extends the existing estimation guidance into a **production-ready estimation discipline**: how to turn instrumented episode traces into **state snapshots** and **delta reports** that are decision-grade, comparable, and robust to LLM stochasticity, dependency interference, and measurement drift.

It is derived from the current `estimation.md` (concepts, estimator choices, and MVP cookbook).

This v1.2 adds:

- production failure modes and "estimation incidents,"
- phased rollout (small, verifiable increments),
- decision factors for what to estimate and when,
- cost controls (sampling, stratification, and multi-fidelity),
- and an explicit mapping to the schema contracts (`state_estimate_v1.3.json`, `state_delta_v1.3.json`).

## 0. Scope and operational definition


**Estimation** is the process that converts per-episode measurements into:

- `StateEstimate`: metric estimates + uncertainty (global, Tier-1 slices, key regimes) with coverage/missingness and ruler health.
- `StateDeltaReport`: controlled deltas between two states (offline paired or online unpaired) with uncertainty and comparability status.

Estimation is "good" when:

1. Gate decisions are stable (PASS/FAIL/INCONCLUSIVE) under repeated runs on the same data window.
2. Monitoring confirmation matches incident reality more often than not.
3. Attribution is supported by driver deltas and regime conditioning.

## 1. Estimands (the estimation targets)


Estimands are expectations or quantiles under a target distribution, and deltas between configurations.

### 1.1 Core estimands (single variant)


- **Rate / expectation**: success, groundedness, violation, tool success
  \[
  \mu = \mathbb{E}[m]
  
\]
- **Slice-conditional expectation**
  \[
  \mu_s = \mathbb{E}[m \mid s=1]
  
\]
- **Quantiles** (latency/cost tails): \(q_{0.5}, q_{0.95}, q_{0.99}\)

### 1.2 Delta estimands (comparisons)


- **Offline paired delta** (same inputs through A and B):
  \[
  \Delta = \mathbb{E}[m_B - m_A]
  
\]
- **Online unpaired delta** (A/B split traffic):
  \[
  \Delta = \mathbb{E}[m \mid B] - \mathbb{E}[m \mid A]
  
\]

### 1.3 Derived estimands (ratios and composites)


- ratios (e.g., cost/success) and composites (e.g., success@budget) should be treated as first-class estimands and bootstrapped directly.

## 2. Estimation pipeline (end-to-end)


The estimation pipeline enforces an explicit production contract at each stage.

1. **Extract** per-episode features:
	- outcomes (judge/validators), latency/cost, termination, tool/retrieval summaries, slice flags, regimes.
2. **Validate integrity**:
	- schema validity, join completeness, exclusion counters, ruler health.
3. **Define target regime**:
	- offline dataset version OR online time window with eligibility criteria and assignment unit.
4. **Choose estimators** per metric type and comparison mode.
5. **Compute uncertainty** + record `n`, method, assumptions.
6. **Assemble artifacts**:
	- `StateEstimate` and/or `StateDeltaReport` with comparability metadata and references.
7. **Finalize window**:
	- apply late-arrival policies and backfill rules (see §6.3).

## 3. Production problems to expect (and controls)


This is the main addition: estimation commonly fails due to non-obvious integrity issues.

### 3.1 Late arrivals and backfills (metrics change after "final")


**Symptoms**

- yesterday's success rate changes today
- gate verdict flips after backfill
- monitoring "recovers" without any system change

**Controls**

- define *finalization windows* (e.g., compute "provisional" in near-real-time; "final" after 24h)
- include `window_finalized_at` and `provisional_flag` in state metadata (extension field)
- treat non-final windows as lower-confidence for gates and incidents

### 3.2 Join failures (outcomes not matched to traces)


**Symptoms**

- judge availability drops
- slice metrics show sudden missingness spikes
- deltas become INCONCLUSIVE due to missing labels

**Controls**

- explicit counters: `judge_availability_rate`, exclusion counts by reason
- refuse to compute decision-grade gates if join completeness is below threshold
- "missingness policy id" recorded and governed

### 3.3 Simpson's paradox / input mix shifts


**Symptoms**

- global metrics improve while Tier-1 slices regress
- online experiment differs from offline replay

**Controls**

- always report Tier-1 slices and key regimes in `StateEstimate`
- for online: post-stratify by stable strata (intent/language/tool-required) before forming global rollups when needed

### 3.4 Dependence / clustering (invalid confidence)


**Symptoms**

- extremely narrow CIs that don't replicate
- p-values look "too good"
- small changes appear significant

**Controls**

- declare the analysis unit explicitly (user/session/request)
- use cluster bootstrap or cluster-robust SEs for online
- for switchbacks, bootstrap over blocks

### 3.5 Heavy tails and censoring (latency/cost)


**Symptoms**

- quantiles unstable
- "mean latency" dominated by rare long runs
- timeouts break the latency distribution

**Controls**

- treat timeouts as a separate **rate constraint**
- gate tails with persistence and sufficient n
- use bootstrap quantile CIs; consider log transforms only with explicit documentation of estimand changes

### 3.6 Ruler drift / judge instability (measurement incident)


**Symptoms**

- broad shifts across variants without deploys
- anchor scoring shifts; disagreement spikes
- label distributions change abruptly

**Controls**

- include ruler health in every state snapshot
- if ruler unhealthy: mark deltas INCONCLUSIVE and/or re-score under a frozen ruler
- audit a subset and monitor judge error/disagreement rates

### 3.7 Multiple comparisons (false alarms)


**Symptoms**

- dozens of "significant" slice regressions per day
- alert fatigue; people ignore gates

**Controls**

- Tiered slices: gate only Tier-1; use Tier-2 for diagnostics
- confirmation step for monitoring before action (delta + uncertainty vs baseline)

## 4. Estimator choices (pragmatic defaults)


These defaults tie the estimator choices to explicit output contracts.

### 4.1 Rates (binary outcomes)


- Point estimate: \(\hat{p} = k/n\)
- CI default: **Wilson** for single rates
- For deltas:
	- offline paired: paired bootstrap over per-input differences (preferred)
	- online unpaired: cluster bootstrap by assignment unit (user/session)

### 4.2 Paired deltas (offline)


- Default: **paired bootstrap** for:
	- mean differences
	- rate differences
	- quantile differences
	- ratios/composites (bootstrap the derived metric)

### 4.3 Means (continuous)


- Default: arithmetic mean + bootstrap CI
- If heavy-tailed: report mean but gate on:
	- timeout rate, and
	- p95/p99 with sufficient n and persistence

### 4.4 Quantiles (p95 latency, p99 cost)


- Default: empirical quantile + bootstrap quantile CI
- Gate policy should set conservative minimum n thresholds

### 4.5 Ratios and composites


- Default: bootstrap the ratio/composite directly (paired where applicable)
- Never compute "CI numerator" and "CI denominator" separately and combine informally

## 5. Stochasticity and replication (what to do about randomness)


Both deterministic gating (temperature 0) and replicated estimation are supported, with explicit tradeoffs.

### 5.1 Deterministic gating (MVP)


- For offline gates: fixed decoding (often temperature 0) for stable signals.
- Document that this is an *engineering proxy* that may under-represent production randomness.

### 5.2 Replicated estimation (more faithful)


- Run K replicates per input (e.g., K=3-10).
- Treat **inputs as the bootstrap unit**, not replicate calls:
	- compute per-input mean \(\bar{m}_i\)
	- bootstrap over inputs

### 5.3 When to adopt replication (decision factors)


Use replication when:

- the evaluated change is sensitive to stochasticity (prompt routing, tool selection),
- the ruler is noisy and decisions are frequently INCONCLUSIVE,
- the tuning goal is "consistency" rather than average quality.

Avoid replication when:

- cost constraints dominate,
- many candidates require screening (use cheaper multi-fidelity screening first).

## 6. Missingness, censoring, and integrity as first-class inputs

### 6.1 Missingness policy (governed)


Estimation MUST take a **missingness policy** as an input and report the counters.

Recommended baseline:

- timeouts/tool failures/schema invalid -> count as task failures for success-type metrics
- also report separate constraint rates (timeout rate, schema invalid rate, tool failure rate)

Document all estimation conventions.

### 6.2 Censoring for latency


- treat timeouts as censored; do not silently impute
- report timeout rate and gate on it separately

### 6.3 Finalization windows


- state snapshots should include (or be able to derive) whether the window is provisional or finalized
- decisions should prefer finalized windows for "truth reporting"; monitoring may use provisional but confirm against finalized baselines

## 7. Reweighting to target distributions (when offline differs from production)


Post-stratification and importance weighting are supported; use post-stratification by default.

### 7.1 Post-stratification (recommended default)


Define strata (intent/language/tool-required/etc.), estimate per stratum, and combine using target weights.

### 7.2 Decision factors


Add reweighting when:

- offline evaluation set is intentionally skewed (e.g., harder tasks),
- production input mix shifts frequently,
- the goal is "production-lift" estimates rather than "benchmark-lift."

Do not add reweighting when:

- strata weights are unstable or noisy,
- improving evaluation-set sampling is a feasible alternative.

## 8. Output contract mapping (to state objects)


Estimator outputs must align with the following schema fields.

### 8.1 For every metric × slice/regime


Emit:

- `estimate` (point)
- `ci` (level/low/high) or an explicit `ci_missing_reason`
- `n`
- `method` (e.g., `paired_bootstrap`, `wilson`, `cluster_bootstrap_sessions`)
- `assumptions` (paired/unpaired, analysis unit, missingness policy id, replication K)
- references: fingerprints and artifact version ids

### 8.2 StateEstimate (minimum)


- global metrics array
- Tier-1 slice metrics array
- regimes metrics array (when tools/RAG exist)
- drivers metrics array
- coverage + exclusions
- ruler_health status

### 8.3 StateDeltaReport (minimum)


- comparability status (`strict`/`conditional`/`invalid`)
- deltas for:
	- global primaries
	- Tier-1 slices
	- key regimes
	- drivers
- CI + margin + classification

## 9. Phased implementation plan (start small, verifiable increments)

### Phase 0 -- Correct deltas for offline paired gating


**Implement**

- paired bootstrap for: success rate delta, groundedness delta, safety delta, tool failure delta
- record n and method
- export StateEstimate/StateDeltaReport JSONs

**Verify**

- rerunning the estimator on the same dataset yields identical outputs (modulo bootstrap RNG with fixed seed)
- basic slice matrix populated (at least Tier-1 candidate slices)

### Phase 1 -- Online A/B correctness (clustering + windows)


**Implement**

- assignment-unit aware estimation (session/user bootstrap)
- window finalization and late arrivals policy
- regime-conditioned estimates for tool health and retrieval empty

**Verify**

- cluster bootstrap inflates CIs relative to naive iid (expected)
- Stage 0 integrity counters appear in states

### Phase 2 -- Ratios/composites + tail metrics


**Implement**

- bootstrap ratios and composites
- bootstrap quantile CIs for latency/cost p95
- explicit handling of timeouts as constraint + censored outcomes

**Verify**

- tails stabilize only after sufficient n; policy marks low n as INCONCLUSIVE

### Phase 3 -- Ruler noise and audits (when ruler is gating-critical)


**Implement**

- disagreement/error tracking
- optional dual-scoring on calibration subset
- conservative widening rules or INCONCLUSIVE triggers when ruler degraded

**Verify**

- ruler health changes can force decision-grade outputs to INCONCLUSIVE (as designed)

## 10. Cost controls (estimation is not free)


Estimation cost is often dominated by:

- judge calls (labeling),
- replicated runs,
- high-cardinality slice matrices.

Recommended cost controls:

1. **Multi-fidelity evaluation**
	- cheap ruler for screening; strict ruler for promotion/holdout
2. **Tiered slice reporting**
	- compute Tier-1 always; Tier-2 on demand; Tier-3 offline only
3. **Adaptive labeling**
	- label 100% failures + sample successes
	- stratify by Tier-1 slices/regimes to prevent blind spots
4. **Replication only where needed**
	- use K>1 on uncertain gates or stochastic-sensitive changes

## 11. Minimal acceptance criteria (an operational estimation layer)


A team can claim estimation discipline exists when:

1. `StateEstimate` and `StateDeltaReport` are produced with schema compliance.
2. Every metric includes `n` and `method`; uncertainty is present or explicitly absent with a reason.
3. Tier-1 slices and key regimes are reported (when relevant).
4. Missingness and ruler health are reported and can gate decisions.
5. Online estimation is cluster-aware (or explicitly justified otherwise).

## Appendix A -- MVP cookbook (carry-over, normalized)


A minimal offline-gating implementation includes:

- paired delta + paired bootstrap CI per metric and slice
- CI+margins gating and export of A/B state + delta + gate results.
