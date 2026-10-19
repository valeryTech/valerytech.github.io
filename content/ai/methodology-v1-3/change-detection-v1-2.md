---
draft: false
toc: true
title: "Change Detection V1 2"
linkTitle: "Change Detection V1 2"
---
# Change Detection v1.2 -- Production Discipline for LLM / Agentic Systems


**AI Systems Framework**

This document refactors and extends the existing change detection guidance into a **production-ready discipline**:

- explicit production failure modes,
- a phased adoption plan (start small, verifiable increments),
- decision factors for when to add detectors/slices/regimes,
- and cost controls (sampling for exemplars; tiered detection).

It is derived from the current `change-detection.md` (core concepts: controlled diffs vs monitoring; CI+margins; regimes/drivers; actionable matrix output).

This v1.2 aligns with:

- **Schema Pack v1.3**: `change_packet_v1.3.json`, `state_estimate_v1.3.json`, `state_delta_v1.3.json`
- **Fingerprinting Spec v1.3**: comparability rules across C/I/E/R
- **Governance Pack v1.0**: ruler/slices/gates governance, policy versioning and backtesting

## 0. What change detection is (operational definition)


Change detection is the discipline of producing an **actionable, decision-grade** answer to:

1. **What changed?** (metrics, slices, regimes)
2. **How strong is the evidence?** (uncertainty, volume, persistence, integrity)
3. **Why did it change?** (attribution across planes R/I/E/C/OBS, supported by drivers)
4. **What action follows?** (rollback/pause/investigate/re-score/re-run/increase-n)

A graph crossing a threshold is *not* change detection; it is only a **trigger**. The deliverable is a **ChangePacket** (canonical incident artifact).

## 1. Two modes (same object model)


Change detection runs in two modes:

### 1.1 Controlled diffs (offline or canary)


- Compare A vs B under invariants (paired inputs, frozen ruler, controlled environment).
- Output: `StateDeltaReport` + optional `GateReport`.

### 1.2 Continuous monitoring (online time series)


- Compare current windows to baseline windows over time.
- Output: `AnomalyEvent` (trigger) -> `ChangePacket` (confirmed/attributed).

**Unifying principle:** Monitoring is repeated "A vs baseline" diffs with integrity checks and standardized outputs.

## 2. Canonical pipeline (Stage 0/1/2/3/4)


This is the production refactor: separate "detect" from "decide," and gate everything on integrity.

### Stage 0 -- Integrity gates (measurement before behavior)


**Goal:** prevent false incidents caused by broken measurement.

**Checks (minimum)**

- **Ruler health:** anchor drift, disagreement/error rates, version stability
- **Observability coverage:** trace completeness, judge availability, validator coverage, exclusion counters
- **Bucket integrity:** lateness, dedupe, bucket sealing/finalization status

**Output**

- `integrity_status ∈ {healthy, degraded, unhealthy}`
- If unhealthy -> verdict becomes **INCONCLUSIVE** until fixed.

### Stage 1 -- Detection (fast, sensitive triggers)


**Goal:** detect candidate events quickly with acceptable false positives.

- Detectors run on Tier-1 outcomes and constraints (and optionally Tier-1 slices).
- Prefer simple, stable detectors (EWMA/CUSUM/threshold+persistence).

**Output**

- `AnomalyEvent` with metric/slice/regime, time window, severity candidate, and integrity snapshot.

### Stage 2 -- Confirmation (decision-grade delta)


**Goal:** confirm whether the detected shift is real and beyond margins.

- Compare current window to a **known-good baseline** (or seasonal baseline).
- Compute delta + uncertainty (bootstrap / cluster bootstrap / robust approximations).
- Apply **CI+margins doctrine** (non-inferiority for shipping; degradation margins for incidents).

**Output**

- verdict: `PASS | FAIL | INCONCLUSIVE`
- direction: `improvement | degradation` (optional metadata)

**Interpretation:** FAIL = confirmed degradation beyond margins; PASS = no degradation beyond margins (may include confirmed improvement).

### Stage 3 -- Attribution (planes-first)


**Goal:** separate C-state vs E-state vs I-state vs R-state vs OBS.

**Order (default)**

1. R-plane (ruler drift)
2. OBS-plane (missingness/coverage)
3. I-plane (input mix drift)
4. E-plane (tool/retrieval/provider)
5. C-plane (deployment/config)

**Output**

- ranked plane hypotheses + supporting evidence (driver deltas, fingerprint diffs, regime splits)

### Stage 4 -- Action + closure (make it non-recurring)


**Goal:** convert incidents into durable defenses.

- rollback/pause canary
- tool mitigation / circuit breaker
- re-score under frozen ruler
- update slice catalog (promote incident slice)
- add regression tests / fault injections
- adjust detectors and thresholds based on backtests

## 3. Required artifacts (normative)

### 3.1 `TimeBucketStateEstimate` (monitoring snapshot)


The monitoring system MUST be able to produce a state snapshot per window that includes:

- global Tier-1 outcomes + constraints
- Tier-1 slice matrix (minimum)
- key regimes (tool health, retrieval empty, rate limiting)
- driver metrics (tool errors, truncation, loops, schema invalid)
- integrity counters (coverage + ruler health)

### 3.2 `AnomalyEvent` (trigger record)


A lightweight record:

- window id, metric(s), slice/regime, candidate severity
- integrity status
- volume stats (`n`, missingness counters)
- pointer to the state snapshot and traces/exemplars (if collected)

### 3.3 `ChangePacket` (canonical output)


A **ChangePacket** is required for every actionable incident. It contains:

- integrity section (ruler + coverage + bucket integrity)
- what changed (global outcomes/constraints)
- where changed (Tier-1 slices and regimes)
- why (drivers + plane hypotheses + fingerprint diffs)
- recommendation + exemplars

This matches the intent of the original "matrix output" but makes it a strict artifact.

## 4. Baselines (what "normal" means)


Most production failures in monitoring are baseline failures.

### 4.1 Fixed known-good baseline (for regressions)


- Use a window (or set of windows) labeled "known good" (e.g., last stable week).
- Best for: confirming regressions and supporting rollback decisions.

### 4.2 Rolling baseline (for sensitivity)


- Use last N windows/hours.
- Best for: quick detection; not sufficient for decision-grade confirmation.

### 4.3 Seasonal baseline (for diurnal/weekly cycles)


- Use same time-of-day/day-of-week history (7-14 days).
- Best for: reducing false positives from traffic cycles.

**Operational default:** Stage 1 uses rolling + seasonal; Stage 2 confirms vs fixed known-good.

## 5. Metric-type specific detection and confirmation


The following methods provide operational defaults for change detection.

### 5.1 Moderate base-rate rates (success, tool failure, empty retrieval)


**Detection (Stage 1)**

- EWMA on rates (fast, stable) or threshold+persistence.
- Volume gating: require `n ≥ n_min`.

**Confirmation (Stage 2)**

- delta vs baseline window with uncertainty:
	- cluster bootstrap for online (by assignment unit)
	- paired bootstrap for offline

### 5.2 Very low base-rate (safety violations)


**Detection**

- count-based triggers (avoid EWMA on tiny rates):
	- absolute count thresholds + persistence
	- optionally Poisson/Binomial exceedance checks

**Confirmation**

- confirm via exact/approximate count model and/or aggregation to larger windows.
- Always attach exemplars (100% of violations) under strict privacy controls.

### 5.3 Heavy-tailed (latency/cost)


**Detection**

- treat timeouts as a separate rate constraint (fast alerts)
- detect p95/p99 jumps with persistence (2-3 consecutive windows)

**Confirmation**

- quantile bootstrap (or robust quantile CI)
- ensure adequate volume; otherwise mark INCONCLUSIVE and aggregate windows.

### 5.4 Distribution shift (input regime drift)


**Detection**

- PSI on categorical features (intent/language/tool_required)
- (Optional) MMD/energy distance on embeddings if retained

**Use**

- drift signals are usually SEV-3/notify unless tied to outcome degradation.
- drift must appear in ChangePacket "why" section when relevant.

### 5.5 Agent dynamics (loops / step explosions)


These are early warning indicators:

- steps p95, loop rate, retries exhausted, tool calls p95
- often precede success degradation

Treat as:

- Stage 1 detectors (high sensitivity) feeding attribution, but
- require confirmation and linkage to outcomes before paging, unless they breach safety/cost constraints.

## 6. Alert policy (severity, gating, and governance)

### 6.1 Tiering (what can page)


- **SEV-1/page:** safety spikes, tool outage, timeout spikes, widespread success collapse
- **SEV-2/urgent:** Tier-1 outcome degradation confirmed; major latency p95 sustained; Tier-1 slice collapse
- **SEV-3/notify:** drift signals, Tier-2 slice anomalies, cost creep without constraint breach

### 6.2 Volume gating


Slice-level alerts require:

- `n_slice ≥ min_n_slice` per window, or aggregate to larger windows.

### 6.3 Persistence and hysteresis


- require consecutive windows for SEV-2 unless hard constraint breached
- apply cooldown windows to prevent flapping

### 6.4 Policy versioning


Detector thresholds and severity mapping MUST be versioned (`change_policy_id`) and backtested (see §9).

## 7. Sampling and cost control (exemplars, not everything)


Change detection must preserve "debug evidence" without storing full payloads for every episode.

### 7.1 Evidence sampling policy (recommended)


- **100%** detailed logging for:
	- failures (non-success termination),
	- safety violations,
	- Tier-1 slices,
	- degraded regimes (tool health degraded, retrieval empty, rate limiting),
	- tail events (p99 latency bucket, high-cost episodes).
- **Sample successes** (1-20%) stratified by variant × Tier-1 slices × regimes.

### 7.2 Change-triggered sampling (adaptive)


When Stage 1 triggers:

- temporarily increase sampling for the affected metric/slice/regime windows
- capture additional exemplars for the next K windows

This localizes cost and increases triage speed.

### 7.3 Secure exemplars (privacy and access)


Store a tiny subset of full prompt/output/tool payload under:

- strict TTL,
- audited access,
- redaction-by-default,
- and a "need-to-know" process.

## 8. Production failure modes (common ways change detection breaks)

### 8.1 Alert fatigue from multiple comparisons


- too many slices/metrics alerting directly

**Control:** only Tier-1 outcomes + constraints can page; Tier-2/3 are diagnostic.

### 8.2 Baseline mismatch


- comparing against a baseline with different I/E/R conditions

**Control:** baseline windows must have matching fingerprints where required, or explicit exceptions with mitigation.

### 8.3 Measurement incidents misclassified as behavior regressions


- judge drift or missingness spikes produce false "quality drops"

**Control:** Stage 0 integrity gating; ruler health and coverage are mandatory fields.

### 8.4 Sampling bias hides regressions


- detailed traces missing disproportionately in one variant or slice

**Control:** balanced stratified sampling, include sampling weights, monitor sampling coverage.

### 8.5 Late-arrival / backfill flips verdicts


- near-real-time buckets reclassify later

**Control:** provisional vs finalized windows; confirm against finalized baselines for high-severity actions.

### 8.6 Dependency interference breaks AB assumptions


- shared tools/caches cause correlated failures

**Control:** switchbacks for confirmation, regime conditioning, and explicit E_observed metrics.

## 9. Backtesting and calibration (make detection trusted)


Change detection policies must be tuned on historical data and incidents.

### 9.1 Backtest procedure (minimum)


- select historical windows with known incidents + known-good periods
- replay Stage 1 detectors and Stage 2 confirmation
- measure:
	- detection delay
	- false positives per week
	- confirmation rate
	- time-to-triage (proxy: ChangePacket completeness)

### 9.2 Calibration outputs


- thresholds per metric type
- min_n per Tier-1 slice
- persistence rules per severity
- seasonal baseline configuration

### 9.3 Meta-metrics (health of the detection system)


- % of alerts that become confirmed degradations
- alert volume by severity
- mean time to produce ChangePacket
- incident recurrence rate (should decrease as slices/tests are added)

## 10. Phased adoption plan (start small, verifiable increments)

### Phase 0 -- Controlled diffs only (offline gates)


**Deliver**

- StateDeltaReport with CI+margins for primaries and Tier-1 slices
- driver deltas (tool errors, retrieval empty, schema invalid, loops)

**Verify**

- consistent PASS/FAIL/INCONCLUSIVE on reruns
- comparability enforcement via fingerprints

### Phase 1 -- Basic monitoring (bucket + detectors)


**Deliver**

- TimeBucketStateEstimate (15m windows) for Tier-1 outcomes/constraints
- simple detectors + persistence + volume gating
- alert -> auto-generated ChangePacket skeleton

**Verify**

- low false-positive rate on known-good weeks
- at least one historical incident is detected in replay

### Phase 2 -- Integrity gating + regime conditioning


**Deliver**

- Stage 0 integrity gates (ruler health, coverage, bucket integrity)
- regime splits (tool health, retrieval empty, rate limiting) in every ChangePacket

**Verify**

- measurement incidents stop producing behavior regressions
- attribution quality improves (dominant plane hypothesis matches postmortems)

### Phase 3 -- Seasonal baselines + backtesting loop


**Deliver**

- seasonal baseline computation
- policy versioning + scheduled backtests

**Verify**

- reduced alert fatigue and better stability across diurnal cycles

### Phase 4 -- Adaptive evidence sampling + exemplars pipeline (optional)


**Deliver**

- change-triggered sampling
- secure exemplar store + clustering of failures

**Verify**

- time-to-triage drops materially; exemplar coverage is high for confirmed incidents

## 11. Decision factors: what to add next (and when)


Add new detectors/slices/regimes only if they:

1. **Change an action** (rollback/pause/investigate) or reduce time-to-triage materially
2. **Have stable semantics** (low cardinality; deterministic definition; governed versions)
3. **Have feasible volume** (can meet minimum-n in monitoring windows or via aggregation)
4. **Are robust to measurement drift** (Stage 0 integrity coverage exists)
5. **Are cost-safe** (do not require pervasive full-payload logging)

**Practical heuristic:** after each incident with an unresolved cause, add exactly one driver, regime, or slice that would have shortened triage.

## Appendix A -- Minimal ChangePacket template (operational)


- Header: system, window, baseline, severity, verdict
- Integrity: ruler health, coverage, data integrity flags
- What changed: top outcome/constraint deltas with CI/margins classification
- Where: top Tier-1 slice deltas; regime deltas
- Why: driver deltas + plane hypotheses + fingerprint diffs
- Recommendation: rollback/pause/investigate/re-score/re-run/increase-n
- Exemplars: representative episodes for dominant slice/regime

## Appendix B -- Relationship to the original change-detection doc


The original `change-detection.md` provides:

- controlled diffs vs monitoring framing,
- CI+margins rule,
- tiered metrics for multiple comparisons,
- drivers/regimes for attribution,
- and an actionable "matrix" output.

This v1.2 refactor adds:

- Stage 0/1/2/3/4 pipeline separation,
- baselines doctrine (fixed/rolling/seasonal),
- explicit alert policy and governance,
- sampling strategies for exemplars and cost,
- production failure modes and controls,
- phased adoption plan with verification criteria.
