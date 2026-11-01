---
draft: false
toc: true
title: "Foundations v1.3 — Assumptions, Invariants, Validity Threats, and Factor Mappings"
description: "Comparisons of AI behavior depend on assumptions about data, randomness, measurement, dependencies, optimization, and observability. The validity contract connects these assumptions to safeguards and remedies when they fail."
linkTitle: "Foundations v1.3"
---
# Foundations v1.3 -- Assumptions, Invariants, Validity Threats, and Factor Mappings


This document is the **normative comparability contract** for the framework: what must hold for measurements, deltas, monitoring, and release decisions to be interpretable in LLM / agentic systems.

It is intentionally **self-contained**: the assumptions, invariants, threats, enforcement "laws," and the mapping to underlying factors are defined here in full.

## 0. Dependency and layering model (what depends on what)

### 0.1 Layering (from reality -> decisions)


1. **Underlying factors (reality / threat model)**

Why LLM/agent systems fail when treated as deterministic: distribution shift, stochasticity, ruler noise and drift, tool/retrieval regimes, Goodhart, missingness, and governance dynamics.

2. **Foundations (this document: invariants and validity threats)**

The minimum assumptions and invariants required for a delta to mean anything, plus common validity threats that invalidate comparisons.

3. **Doctrine (mechanisms that enforce the invariants)**
	- State representation and comparability (`StateKey`, `StateEstimate`, `StateDeltaReport`)
	- Experimentation and inference (paired evals, online AB, switchbacks; clustering)
	- Slice governance (Tier-1 gated vs Tier-2 diagnostic vs Tier-3 exploratory)
	- Monitoring and attribution (regime-conditioned change detection)
	- Optimization discipline (typed search space; constraints and gates)
4. **Implementation (code + ops)**
	- instrumentation (trace schemas, drivers)
	- gates and reports (mechanical gate evaluator)
	- operational cadence, ownership, and change protocols

**Rule:** if any foundation is violated, the correct default outcome is **INCONCLUSIVE** unless a mitigation is applied (re-score, re-run, re-randomize, reweight, fix instrumentation, etc.).

### 0.2 What this document is for (and what it is not)


- This document defines the **validity contract** and **minimum enforcement** needed for credible evaluation and release decisions.
- It is not a how-to manual for implementing instrumentation or analytics pipelines; it defines what must be true and what must be produced.

## 1. Minimal definitions (normative)

### 1.1 Regime


A **regime** is a condition under which behavior differs materially, typically due to:

- **Input regime**: intent mix, language mix, context length distribution, adversarial prevalence.
- **Environment regime**: tool health, rate limiting, retrieval empty vs non-empty, provider incidents.
- **Measurement regime**: judge/rubric versions and calibration state.

### 1.2 Claim of improvement (accepted form)


A claim of improvement must have the form:
> "Variant B is better than A on endpoint E **in regime(s) R**, **within constraints**, with **uncertainty**."
Any claim missing regime, constraints, or uncertainty is not accepted operationally.

### 1.3 Planes (C / I / E / R / O)


- **C** configuration (the deployed settings)
- **I** input regime (the inputs the system faces)
- **E** environment (dependencies; infra conditions; tool/retrieval regimes)
- **R** ruler (measurement system)
- **O** observed behavior (metrics, uncertainty, drivers)

## 2. Assumptions (A1-A6) and what they cover


Each assumption below contains:

- **Invariant** (what must be true for comparability),
- **Required safeguards** (what must exist operationally),
- **Failure signatures** (how violations manifest),
- **Underlying factor mapping** (why this assumption is necessary),
- **Primary mechanism mapping** (which artifacts enforce it).
> Note: "Underlying factors" are grouped into classes:
> **S** statistical foundations, **M** measurement foundations, **Y** systems foundations, **O** optimization foundations, **G** governance foundations.

### A1. The system operates under an input distribution (I-plane)


User tasks are drawn from a distribution \(\mathcal{D}\) that is only partially observed and can drift.

**Invariant (comparability):** every claim specifies the target input regime:

- offline eval distribution (dataset id + version + sampling), or
- online traffic window (time range + eligibility + sampling).

**Required safeguards**

- global metrics **and** slice-conditional metrics (Tier-1 gated slices)
- input mix tracking (intent/language/length/tool_required rates)
- stratification and post-stratification/reweighting when appropriate

**Failure signatures**

- global improves while Tier-1 slices regress (Simpson's paradox)
- offline -> online gap grows
- observed changes correlate with mix shifts more than with C changes

**Underlying factor mapping**

- S1 (inputs are distributed; offline≠prod)
- S2 (offline is a proxy; proxy mismatch interacts with I definition)
- Y3 (context-length regimes amplify input shift)

**Primary mechanism mapping**

- `I_fingerprint` in `StateKey` and `ExperimentSpec`
- drift summaries in `StateEstimate`
- tiered slice governance (Tier-1 includes representative high-impact regimes)
- optional reweighting support in evaluation layer

### A2. Outcomes are stochastic (O-plane is a distribution, not a point)


Behavior is nondeterministic due to sampling, tool timing, retrieval variability, concurrency, and provider-side dynamics.

**Invariant (decision validity):** comparisons must include uncertainty and adequate n; single-run evidence is not actionable.

**Required safeguards**

- paired offline evaluation where possible
- cluster-aware inference online (randomization unit ≠ analysis unit)
- CIs for deltas; minimum-n policies for gated slices
- replication doctrine for noisy paths and stochastic decoding

**Failure signatures**

- "wins" do not replicate
- frequent flip-flops in gate verdicts across re-runs
- apparent improvements disappear under seed/time variation

**Underlying factor mapping**

- Y1 (intrinsic stochasticity)
- S4 (high variance; small deltas are noise)
- S5 (multiple comparisons becomes worse under high variance)
- Y6 (long-horizon compounding amplifies stochasticity)

**Primary mechanism mapping**

- `StateEstimate` requires estimate + CI + n + method
- inference doctrine (paired bootstrap, cluster bootstrap, quantile bootstrap)
- PASS/FAIL/INCONCLUSIVE gates and replication policy

### A3. Measurement is an instrument, not ground truth (R-plane)


The ruler (judge/rubric/validators) produces noisy proxy labels for latent properties (success, groundedness, safety).

**Invariant (measurement validity):** runs are comparable only when the ruler is versioned and stable (or explicitly changed with recalibration).

**Required safeguards**

- R-plane fingerprinting (judge model/prompt + rubric + validators)
- calibration and anchor sets; disagreement tracking
- ruler drift checks and a change protocol
- orthogonal checks (validators, second judge/human audits where needed)

**Goodhart clause (explicit):** any metric used for optimization becomes a target.

Therefore: independent audit channels and true holdouts are mandatory for any metric that drives decisions.

**Failure signatures**

- simultaneous metric shifts across all variants
- anchor-set shifts without any C-plane change
- "style-only" improvements that do not transfer to validators/audits

**Underlying factor mapping**

- M1 (latent/noisy labels)
- M2 (ruler drift)
- M5 (calibration/reliability)
- M3 (Goodhart / measurement gaming)

**Primary mechanism mapping**

- `R_fingerprint` as part of `StateKey`
- `RulerVersion` + anchor scoring protocol
- ruler health in `StateEstimate`; "ruler unhealthy -> INCONCLUSIVE"
- holdout + red-team governance and audits (ties to A5)

### A4. The environment is part of system behavior (E-plane)


Tools, retrieval corpora, caches, rate limits, queues, and upstream providers are nonstationary and can dominate outcomes.

**Invariant (attribution):** changes must be attributable across planes; otherwise C-changes are confounded with E-changes.

**Required safeguards**

- trace instrumentation and trace completeness checks
- per-tool error rates and latency (p50/p95) and rate-limit counters
- retrieval snapshot identifiers / corpus identifiers (or explicit rolling-index policy)
- regime-conditioned reporting (tool healthy vs degraded; retrieval empty vs non-empty)

**Provider non-stationarity clause (explicit):** upstream model/provider behavior can change without C-plane changes. Treat this as an E-plane incident risk and monitor with sentinels/anchors.

**Failure signatures**

- success drops correlate with tool error spikes or rate limiting
- latency tails move independently of C changes
- global shifts across all variants coincident with provider changes

**Underlying factor mapping**

- Y5 (tool regimes)
- Y4 (retrieval coupling; empty/noisy regimes)
- Y7 (latency/cost tails and budgets)
- Y8 (provider / upstream drift)
- S3 (environmental confounding dominates online)

**Primary mechanism mapping**

- E_fixed vs E_observed split in state (identity vs health)
- regime labels + regime-conditioned metrics
- switchbacks when interference exists
- fault injection evaluation for degraded tool/retrieval regimes (recommended)

### A5. Optimization is black-box, constrained, multi-objective


Optimization targets a vector of objectives (quality, safety, reliability) under constraints (budgets, policy), under noise and confounding risk.

**Invariant (safe optimization):** search must be restricted to a typed search space; candidates must pass hard gates before ranking.

**Required safeguards**

- typed search space (knobs, ranges, conditional activation)
- objective/constraint definitions with mechanical gates
- dev/holdout/red-team discipline (prompts/routers overfit)
- arms-only online optimization with circuit breakers (if adaptive)

**Evaluability clause (explicit):** adaptive routers/bandits can destroy comparability unless assignment and policy versions are logged and adaptation is gated.

**Failure signatures**

- metric gaming / Goodhart effects
- safety or budget regressions after "optimization wins"
- selection effects where the system avoids hard cases

**Underlying factor mapping**

- O1 (constrained multi-objective)
- O2 (typed search space)
- O3 (overfitting to dev/judge)
- O4 (worst-slice/regime regressions)
- O5 (adaptation destroys evaluability)
- cross-cutting: M3 (Goodhart), S2 (proxy mismatch)

**Primary mechanism mapping**

- mechanical gate evaluator (CI+margins -> PASS/FAIL/INCONCLUSIVE)
- holdout and audit channel integration with gates
- explicit assignment logging in experiments and state

### A6. Observability is incomplete and can bias conclusions (missingness / logging regime)


Instrumentation, traces, and labels are never perfectly complete; missingness is often **not random** and correlates with failures.

**Invariant (measurement completeness):** state and deltas must report coverage and apply a versioned missingness policy.

**Required safeguards**

- observability fields in `StateEstimate`:
	- trace completeness rate, judge availability rate, validator coverage rate
	- exclusion counters by reason
- versioned missingness policy:
	- fail-closed vs exclude-with-counter (by failure type)
- gating: observability regressions are guardrail failures or force INCONCLUSIVE

**Failure signatures**

- "improvement" coincides with higher exclusion rates
- timeout rate rises while reported latency looks better
- judge errors spike after provider updates but are silently excluded

**Underlying factor mapping**

- M4 (missingness/censoring bias)
- Y5/Y7 (timeouts and tails create censoring)
- Y8 (provider drift can change judge availability/behavior)

**Primary mechanism mapping**

- missingness policy and observability section in state representation
- explicit missingness handling in experiment reporting
- monitoring rules that alert on coverage regressions

## 3. Assumption-to-factor mapping (compressed)


| Assumption | Primary factor drivers |
|---|---|
| A1 Input distribution | S1, S2, Y3 |
| A2 Stochastic outcomes | Y1, S4, S5, Y6 |
| A3 Ruler as instrument + Goodhart | M1, M2, M5, M3 |
| A4 Environment regimes + provider drift | Y4, Y5, Y7, Y8, S3 |
| A5 Constrained optimization + evaluability | O1, O2, O3, O4, O5 (+ M3, S2) |
| A6 Observability / missingness | M4 (+ Y5, Y7, Y8) |

## 4. Plane invariants (comparability contract)


These invariants define what must be fingerprinted, logged, and reported so that "A vs B" comparisons are meaningful.

### C-plane (Configuration)


**Invariant:** all tunable behavior affecting outputs must be captured by canonical config and hashed.

**Minimum required fields**

- model/provider endpoints + decoding params
- prompt versions + router policy versions
- tool schemas and wrapper versions (if configured in C)
- retrieval parameters and index snapshot policy

### I-plane (Input regime)


**Invariant:** every snapshot includes dataset id/version or traffic window id plus slice frequencies; slice definitions are versioned.

**Minimum required fields**

- dataset ids (dev/holdout/red-team) or online window ids + eligibility
- slice catalog version and Tier-1 set
- input summaries (mix and context-length distribution)

### E-plane (Environment)


**Invariant:** dependencies and policies are fingerprinted; observed health is measured and used for conditioning.

**Rule:** separate **E_fixed** (fingerprinted identity) from **E_observed** (health/regimes).

### R-plane (Ruler)


**Invariant:** judge model/prompt/rubric/validators are fingerprinted; ruler changes require calibration and version bump.

### O-plane (Observed behavior)


**Invariant:** metrics are reported with uncertainty and n; tail metrics (p95/p99) are handled explicitly.

**Minimum required fields**

- estimate, CI (or equivalent), n, method
- global + Tier-1 slices + key regimes
- driver metrics (tool failures, retrieval empty, truncation, loop rate)
- observability coverage and missingness counters (A6)

## 5. Validity threats and required safeguards (T1-T6)

### T1: Input mix shift (Simpson's paradox)


Global improves while a critical slice regresses.

**Safeguards**

- Tier-1 gated slices; report n per slice
- drift monitors for slice frequencies and input mix
- optional reweighting / stratification alignment checks

### T2: Ruler drift / label noise exploitation (Goodhart)


Changes "improve" judge scores without improving real quality or transferability.

**Safeguards**

- holdout never used for tuning
- anchor sets + ruler health checks
- orthogonal validators / audits
- "ruler unhealthy -> INCONCLUSIVE"

### T3: Environmental confounding (tools/retrieval/provider)


Tool degradation or provider incidents cause shifts misattributed to C-plane.

**Safeguards**

- per-tool health metrics; regime-conditioned reporting
- switchbacks when interference exists
- incident flags and sentinel suites for upstream drift

### T4: Variance misread as improvement


Small sample + noise yields false positives.

**Safeguards**

- CIs for deltas; minimum-n thresholds
- paired offline designs; replication doctrine
- cluster-aware inference online

### T5: Multiple comparisons and alert fatigue


Many metrics × slices produce spurious findings and noisy paging.

**Safeguards**

- small Tier-1 gated set; tiered slice governance
- explicit policy (CI+margins discipline; optional Holm/FDR for diagnostics)
- tiered alerting and hysteresis/cooldowns

### T6: Missingness / observability bias


Hard cases are excluded or censored; coverage differs between variants/windows.

**Safeguards**

- report trace completeness and label availability
- versioned missingness policy
- treat observability regressions as guardrails or INCONCLUSIVE
- track timeout/schema-invalid as first-class driver metrics

## 6. Non-negotiable controls ("framework laws")


1. No C-plane change ships without a **StateDeltaReport** and **passing gates**.
2. No conclusions without **fingerprints** for C/I/E/R and **observability coverage** (A6).
3. Monitoring alerts must include **attribution context** (drivers + regimes + ruler health), not just metric spikes.
4. Ruler changes require **version bump + anchor scoring**; unhealthy ruler -> **INCONCLUSIVE**.
5. Online optimization is **arms-only** (pre-approved configs) with **circuit breakers**, logged assignment, and evaluability guarantees.

## 7. What to do when foundations are violated (mitigation playbook)


When any foundation is violated, default to **INCONCLUSIVE**, then apply mitigation:

- **Ruler changed or unhealthy (A3/T2):** re-score both variants under the same ruler, or rerun under frozen ruler; do not mix rulers in a single comparison.
- **Input mix drifted (A1/T1):** compare conditional metrics; reweight; rerun on updated eval set or re-randomize online.
- **Tool degraded / provider incident (A4/T3):** condition on regimes; run degraded-mode evaluation; separate C vs E effects; consider switchback design if interference exists.
- **Variance too high (A2/T4):** increase n; use paired designs; replicate; avoid premature conclusions.
- **Multiple comparisons flagged (T5):** treat findings as diagnostic; promote slices only after precommitment and re-test.
- **Observability regressed (A6/T6):** fix instrumentation/missingness policy; re-run; treat as guardrail regression until resolved.

This prevents the framework from producing false confidence.
