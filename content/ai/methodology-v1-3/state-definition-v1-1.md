---
draft: false
toc: true
title: "State Definition V1 1"
linkTitle: "State Definition V1 1"
---
# State Definition v1.1 (LLM / Agentic Systems)


This document defines **system state** for LLM and agentic applications in a way that is **auditable**, **comparable across time**, and **sufficient for decisions** (ship/rollback, debug, monitor, optimize).

It is designed to compose with:

- **Methodology Principles v1.1** (planes C/I/E/R/O; rulers as instruments; slice governance; CI+margins gates)
- **Experimental Design v1.1** (offline paired, online A/B, switchbacks; clustering/interference; decision doctrine)

## 0. Scope and non-goals

### In scope


- State definitions for **tool-using LLM apps**, **RAG**, and **agent loops**.
- Offline and online evaluation state; production monitoring state.
- Delta-based change detection and release gating.
- State representations at two resolutions:
	- **Snapshot state** (system-level; aggregated; used for gates/monitoring/optimization)
	- **Trajectory state** (episode-level; trace-based; used for debugging/attribution)

### Out of scope


- Model pretraining / fine-tuning state (interfaces only).
- Full causal inference theory; this specification defines operationally sufficient defaults.
- Organization-specific compliance rules (assumed external constraints).

## 1. What "state" means here

### 1.1 State is decision-relative


A "state" is not "everything that can be logged." It is the **minimal set of variables and estimates** that make a decision well-posed.

Typical decisions:

- **Release gating**: should variant B replace A?
- **Rollback**: is there a regression beyond margins in Tier-1 slices?
- **Incident triage**: is the issue C-plane, I-plane drift, E-plane incident, or R-plane drift?
- **Optimization planning**: what search space knobs are safe and where are the biggest failures?

**Principle:** if a decision depends on a factor, that factor must be represented explicitly in state (as a fingerprint, a regime label, or a metric).

### 1.2 State is probabilistic


LLM systems are stochastic and tool-dependent. Therefore, state is:

- a **distribution** over outcomes,
- summarized via **estimates + uncertainty**,
- often **slice-conditional** and **regime-conditional**.

**Rule:** a state without uncertainty is not a valid state for decision-making.

## 2. Canonical decomposition: C / I / E / R / O (the planes)


State is decomposed into five planes:

- **C-plane (Configuration)**: the settings deliberately selected and deployed.
	- model selection, prompts, router policy, decoding, retrieval params, tool schemas, retry policies, safety posture
- **I-plane (Input regime)**: what the system faces.
	- dataset version / traffic definition, intent mix, language mix, context-length distribution, adversarial prevalence
- **E-plane (Environment)**: exogenous conditions and dependencies.
	- tool endpoints and health, rate limits, external APIs, vector index health, queueing conditions
- **R-plane (Ruler)**: measurement system.
	- rubric definitions, judge model/prompt, validators, aggregation rules, calibration artifacts
- **O-plane (Observed behavior)**: measured outcomes and driver metrics with uncertainty.
	- success, groundedness, safety, latency, cost, tool errors, retrieval empty rate, loop rate, truncation rate, etc.

**Plane separation rule:** do not interpret O-plane changes as C-plane improvements unless I/E/R are controlled or explicitly conditioned.

## 3. Formal view: state as an estimated object


Let:

- \(x \sim \mathcal{D}\) represent inputs from distribution \(\mathcal{D}\) (I-plane).
- \(c\) configuration (C-plane).
- \(e\) environment regime (E-plane).
- \(r\) ruler (R-plane).

A trace/outcome is stochastic:

\[(\tau, y) \sim P(\cdot \mid x, c, e)\]

A ruler produces a (possibly noisy) measurement:

\[m = r(x, \tau, y)\]

A snapshot state is an **estimate** of one or more estimands such as:

- Global expectation: \(\mu(c) = \mathbb{E}[m]\)
- Slice-conditional: \(\mu_s(c) = \mathbb{E}[m \mid s=1]\)
- Regime-conditional: \(\mu_{s,e}(c) = \mathbb{E}[m \mid s=1, e]\)
- Tail risk: quantiles like p95 latency

**State is the tuple:** fingerprints \((C,I,E,R)\) + estimates of \(O\) with uncertainty.

## 4. State identity: keys, fingerprints, and what "same state" means


A common failure mode is conflating:

- "what is deployed" with
- "the observations from this week."

To avoid this, define **keys** explicitly.

### 4.1 Fingerprints by plane (normative)


Each plane has a stable, versioned fingerprint:

- `C_fingerprint`: model, prompt version(s), router version, retrieval params, tool schemas, retry policy, decoding params, safety config
- `I_fingerprint`: dataset version or traffic window definition + sampling protocol + eligibility rules
- `E_fingerprint_fixed`: tool endpoints/versions, cache TTL policy, retrieval index snapshot policy, platform-default timeouts and concurrency limits
- `R_fingerprint`: rubric version, judge model, judge prompt version, validator versions, aggregation rules, anchor set id

### 4.2 StateKey vs StateEstimate (normative distinction)

#### StateKey (identity)


A **StateKey** identifies *what is being evaluated and how*:

\[\text{StateKey} = (\text{C\_fingerprint}, \text{I\_fingerprint}, \text{E\_fingerprint\_fixed}, \text{R\_fingerprint})\]

Two evaluations share a StateKey if and only if all four fingerprints match.

#### StateEstimate (measurement)


A **StateEstimate** adds:

- time window,
- sample size,
- estimators used,
- O-plane metric estimates + uncertainty.

This prevents "state explosion" (new state for every minute) while preserving comparability.

### 4.3 Grouping keys for practical use


- **DeploymentKey** = hash(`C_fingerprint`, `E_fingerprint_fixed`)
	- "what is running"
- **EvaluationContextKey** = hash(`I_fingerprint`, `R_fingerprint`, slicing policy, regime conditioning, missingness policy)
	- "the measurements, target distribution, ruler, and conditioning rules"

A StateEstimate is then:

\[(\text{DeploymentKey}, \text{EvaluationContextKey}, \text{window}, \text{O estimates})\]

### 4.4 What changes create a new key?


**New DeploymentKey** (C/E-fixed changes):

- model change, prompt change, router change
- retrieval index snapshot policy change (frozen -> rolling)
- tool schema change or retry policy change
- cache TTL policy change (if it alters behavior materially)

**New EvaluationContextKey** (I/R changes, or conditioning):

- dataset version changes
- traffic eligibility or sampling changes
- ruler (judge/rubric/validators) changes
- slice definitions or tiering changes
- missingness policy changes (fail-closed vs exclude-with-counter)
- regime conditioning changes (e.g., tool_health stratification introduced)

**Same key, new estimate**:

- longer window / more samples under the same definitions
- re-running with additional data while keeping fingerprints fixed

## 5. Environment (E-plane): fixed environment vs observed regimes


E-plane must be split to avoid identity churn.

### 5.1 E_fixed (fingerprinted, identity)


`E_fingerprint_fixed` includes:

- tool endpoints/versions
- timeout and retry policies **only when they are platform defaults** (otherwise they belong in C)
- cache TTL policies and keying conventions **only when they are platform defaults**
- concurrency limits / rate limiter configuration **only when they are platform defaults**
- retrieval index snapshot policy (frozen/rolling)
- dependency versions for critical services

These are "system design" choices and must be stable for comparability.

**Boundary rule:** if the application explicitly configures a knob (retry policy, timeout, cache TTL/keying, concurrency),

it moves into C-plane and MUST change `C_fingerprint`. Platform defaults remain in `E_fingerprint_fixed`.

### 5.2 E_observed (measured, not identity)


E_observed includes health and incident data:

- tool error rates by code
- tool latency p50/p95
- rate-limit events
- queue depth / saturation proxies
- external incident flags

These belong in O-plane driver metrics and regime labels.

### 5.3 Regimes (categorical conditioning variables)


Define regimes as categorical partitions of E_observed:

- `tool_health ∈ {healthy, degraded}`
- `retrieval_health ∈ {healthy, degraded}`
- `rate_limited ∈ {true, false}`
- `index_version` if rolling updates occur

**Rule:** report regime-conditioned metrics whenever tools/retrieval exist.

## 6. Input regime (I-plane): make the target distribution explicit


State is meaningless without declaring \(\mathcal{D}\).

### 6.1 I_fingerprint must include


- dataset or traffic definition (window, eligibility, sampling)
- stratification / reweighting rules (if any)
- normalization rules for episode boundaries (if relevant)

### 6.2 Recommended input summaries (O-plane context fields)


Alongside the fingerprint, store summaries to detect drift:

- intent mix
- language mix
- context length distribution
- tool-required rate
- domain/category mix
- adversarial rate proxy (if applicable)

These summaries are not identity; they are diagnostics and drift signals.

## 7. Measurement system (R-plane): the ruler is part of state

### 7.1 Ruler definition


A ruler is a versioned measurement instrument:

- rubric spec
- judge model + judge prompt + decoding params
- deterministic validators (schema, citation parse, safety classifiers)
- aggregation rules
- calibration artifacts (human labels, anchor sets)

### 7.2 Ruler noise and Goodhart risk


Judge-based metrics are noisy and gameable. Therefore:

- treat judge outputs as **noisy labels**
- track **ruler health**
- keep orthogonal checks (validators, second judge, human audit)

### 7.3 Ruler health fields (mandatory)


Include in state:

- anchor set mean shift vs prior ruler version
- judge disagreement rate (judge-judge or judge-human)
- judge error rate
- validator failure rate
- within-thresholds boolean

**Rule:** if ruler health is out of bounds, state comparisons are **INCONCLUSIVE** by default.

## 8. Observability and missingness: state must include measurement coverage


Without observability coverage, estimates silently bias.

### 8.1 Observability fields (mandatory)


Track:

- trace completeness rate (required spans present)
- label availability rate (judge succeeded)
- validator coverage rate
- exclusion counters by reason
- sampling rate and retention policy identifiers (as metadata)

### 8.2 Missingness policy (must be versioned)


For each missingness type, predeclare treatment:

- tool timeout: fail-closed vs exclude-with-counter
- schema invalid: fail-closed vs exclude-with-counter
- judge error: exclude-with-counter vs fail-closed

Store the missingness policy in the EvaluationContextKey.

## 9. Multi-resolution state: snapshot vs trajectory

### 9.1 Snapshot state (system-level)


Used for:

- gating
- monitoring
- optimization planning
- change detection

It is an aggregated object:

- estimates + CI
- slice/regime-conditioned matrices
- driver metrics
- ruler health
- observability coverage

### 9.2 Trajectory state (episode-level)


Used for:

- debugging
- attribution
- safety triage
- failure mode discovery

It includes:

- the full trace (spans, tool calls, retrieved docs)
- derived per-episode labels (success, safety, groundedness)
- termination reason and loop flags
- truncation events

### 9.3 Trajectory-derived summaries (bridge between the two)


Snapshot state SHOULD include a standard set of trajectory-derived aggregates:

- steps distribution (mean/p50/p95)
- loop rate (episodes with repeated state/tool pattern)
- termination reasons distribution
- tool call count distribution
- retry depth distribution
- truncation rate (context overflow / output cutoff)
- retrieval-empty rate and top-k stats
- schema-invalid rate for model outputs and tool calls

These serve as driver metrics for attribution.

## 10. Slice governance (non-negotiable)


Slice-conditional state prevents global-metric blindness.

### 10.1 Slice tiers (aligned with Principles v1.1)


- **Tier 1 (gated):** small, predeclared set (5-20). Shipping claims depend on them.
- **Tier 2 (diagnostic):** broader; used for debugging; not a shipping gate by default.
- **Tier 3 (exploratory):** discovered post hoc; not used for claims until promoted and re-tested.

### 10.2 Minimum n policies


Every slice result MUST store `n` and a gating `min_n`.

If Tier-1 slices are low-n:

- oversample offline,
- extend online duration,
- or accept INCONCLUSIVE (do not assert improvement).

### 10.3 Multiple comparisons policy


- Tier-1 + primaries: predeclared CI+margins gates (preferred)
- Tier-2: BH-FDR if needed; otherwise diagnostic-only
- Tier-3: no formal inference claims

## 11. Practical state schema (normative)

### 11.1 StateKey (identity)

```json
{
  "state_key": {
    "C_fingerprint": {"hash": "...", "details": {...}},
    "I_fingerprint": {"hash": "...", "details": {...}},
    "E_fingerprint_fixed": {"hash": "...", "details": {...}},
    "R_fingerprint": {"hash": "...", "details": {...}}
  }
}
```

### 11.2 StateEstimate (snapshot; what to store)

```json
{
  "state_id": "2026-01-05.prod.release-17.window-2026-01-10_to_2026-01-17",
  "state_key": { "...": "..." },
  "window": {"start": "2026-01-10", "end": "2026-01-17"},
  "units": {
    "randomization_unit": "session",
    "analysis_unit": "episode",
    "n_clusters": 8200,
    "n_episodes": 40211
  },
  "input_summary": {
    "language_mix": {"en": 0.82, "es": 0.10, "other": 0.08},
    "intent_mix": {"qa": 0.40, "task": 0.35, "other": 0.25},
    "context_tokens_p95": 3800,
    "tool_required_rate": 0.21
  },
  "environment_summary": {
    "tool_health_rate": {"healthy": 0.96, "degraded": 0.04},
    "rate_limited_rate": 0.01
  },
  "observability": {
    "trace_complete_rate": 0.993,
    "judge_available_rate": 0.998,
    "validator_coverage_rate": 1.0,
    "excluded_counts": {"judge_error": 81, "trace_missing": 110}
  },
  "ruler_health": {
    "anchor_set": "anchor_v3",
    "anchor_mean_shift": 0.003,
    "disagreement_rate": 0.05,
    "judge_error_rate": 0.002,
    "within_thresholds": true
  },
  "metrics_global": {
    "task_success": {"estimate": 0.853, "ci95": [0.846, 0.860], "method": "cluster_bootstrap(session)"},
    "safety_violation_rate": {"estimate": 0.0009, "ci95": [0.0006, 0.0012], "method": "cluster_bootstrap(session)"},
    "latency_p95_ms": {"estimate": 1870, "ci95": [1800, 1950], "method": "bootstrap_quantile"}
  },
  "metrics_by_slice": {
    "tool_required": {
      "n": 8600,
      "task_success": {"estimate": 0.791, "ci95": [0.782, 0.800], "method": "cluster_bootstrap(session)"}
    }
  },
  "metrics_by_regime": {
    "tool_health=healthy": {
      "task_success": {"estimate": 0.860, "ci95": [0.852, 0.868]}
    },
    "tool_health=degraded": {
      "task_success": {"estimate": 0.780, "ci95": [0.740, 0.820]}
    }
  },
  "driver_metrics": {
    "tool_failure_rate": {"estimate": 0.012, "ci95": [0.010, 0.014]},
    "retrieval_empty_rate": {"estimate": 0.090, "ci95": [0.084, 0.096]},
    "loop_rate": {"estimate": 0.006, "ci95": [0.004, 0.008]},
    "schema_invalid_rate": {"estimate": 0.021, "ci95": [0.019, 0.023]},
    "steps_p95": 8
  }
}
```

**Normative requirements:**

- include `n` for every metric and slice
- include CI and method for every reported estimate
- include ruler health and observability coverage
- include regime-conditioned metrics when tools/retrieval exist

## 12. State deltas and comparison (StateDeltaReport)


A StateDeltaReport is the canonical object for change detection and release gating.

### 12.1 Preconditions for a valid delta


To compare A vs B as a C-plane change:

- R-plane must be fixed, or comparisons must be re-scored under a fixed ruler.
- I-plane must be controlled (offline paired) or randomized (online AB) or time-blocked (switchback).
- E-plane incidents must be reported and conditioned via regimes.

### 12.2 Delta schema (normative)

```json
{
  "compare": {"A": "release-16", "B": "release-17"},
  "state_keys": {
    "A": {"C_hash": "...", "I_hash": "...", "E_hash": "...", "R_hash": "..."},
    "B": {"C_hash": "...", "I_hash": "...", "E_hash": "...", "R_hash": "..."}
  },
  "assumptions": {
    "ruler_frozen": true,
    "retrieval_snapshot_frozen": true,
    "cache_keying_isolated": true
  },
  "traffic_summary": {
    "n_clusters": 8200,
    "n_episodes": 40211,
    "mix_checks": {
      "language_drift_flag": false,
      "tool_required_rate_drift_flag": false
    }
  },
  "ruler_health": {"within_thresholds": true},
  "observability": {"trace_complete_rate_A": 0.992, "trace_complete_rate_B": 0.993},
  "deltas_global": {
    "task_success": {"delta": 0.012, "ci95": [0.004, 0.020], "method": "cluster_bootstrap(session)"},
    "safety_violation_rate": {"delta": 0.0001, "ci95": [-0.0002, 0.0004]}
  },
  "deltas_by_slice": {
    "tool_required": {
      "task_success": {"delta": -0.006, "ci95": [-0.024, 0.011], "n": 8600}
    }
  },
  "deltas_by_regime": {
    "tool_health=degraded": {
      "task_success": {"delta": -0.010, "ci95": [-0.060, 0.030]}
    }
  },
  "driver_deltas": {
    "tool_failure_rate": {"delta": 0.002, "ci95": [0.001, 0.003]},
    "retrieval_empty_rate": {"delta": 0.010, "ci95": [0.006, 0.014]}
  },
  "gate_evaluation": {
    "verdict": "inconclusive",
    "reasons": [
      "Tier-1 slice tool_required inconclusive (CI wide vs margin).",
      "All guardrails and budgets passed."
    ]
  }
}
```

### 12.3 Delta computation methods (tie-in to Experimental Design v1.1)


- Offline paired: paired bootstrap over inputs (or clustered inputs if needed)
- Online AB: cluster bootstrap at randomization unit (session/user) or regression with cluster-robust SE
- Switchback: block-level aggregates; robust SE if autocorrelation

State must record which method was used.

## 13. Release gating doctrine (CI + margins; tiered slices)


State and gate specs must align. Default doctrine:

- Gate on **CI + non-inferiority margins**.
- Use PASS / FAIL / INCONCLUSIVE.

### 13.1 Gate inputs (from StateDeltaReport)


- primary endpoints (global + Tier-1 slice)
- guardrails (safety, tool failures)
- budgets (latency/cost)
- ruler health and observability coverage
- contamination checks

### 13.2 Default verdict logic


- **PASS** if all primary and guardrail rules pass, Tier-1 slices do not regress beyond margins, ruler health within thresholds, and no contamination flags.
- **FAIL** if any hard constraint fails (safety/budget) or clear regression beyond margins.
- **INCONCLUSIVE** otherwise.

**Rule:** ruler instability or observability failures default to INCONCLUSIVE unless mitigated (re-score / re-run / increase data).

## 14. Operational workflows (how state is used)

### 14.1 Offline iteration loop


1. run paired eval on dev set (diagnostic slices)
2. run paired eval on holdout (Tier-1)
3. produce StateEstimate and StateDeltaReport
4. ship only if gates pass; otherwise revise hypothesis

### 14.2 Online monitoring loop


1. maintain a rolling StateEstimate per window (daily/weekly)
2. run change detection on:
	- global primaries
	- Tier-1 slices
	- driver metrics
	- ruler health
	- input drift
3. when alert fires, generate a delta vs baseline window and apply attribution workflow:
	- check R drift, then I drift, then E incidents, then C diffs

### 14.3 Incident triage workflow (planes-first)


1. **R-plane**: did the ruler drift?
2. **I-plane**: did traffic mix shift?
3. **E-plane**: did tools degrade?
4. **C-plane**: what config changed?
5. Use trajectory samples to map to failure ontology and propose a controlled fix.

### 14.4 Optimization planning workflow


Use state to select what to tune:

- largest failure slices by impact × frequency
- driver metrics pointing to mechanism (retrieval empty, tool errors, loops)
- regime-conditioned weaknesses (degraded tool regime)

## 15. Common failure modes and guardrails

### 15.1 "State explosion"


Including observed tool health in E_fingerprint makes every hour a new state.

**Fix:** fingerprint E_fixed; treat health as observed regime.

### 15.2 "False improvements"


Typical causes:

- I-plane drift (easier traffic),
- R-plane drift (judge prompt change),
- selection effects (variant changes who stays),
- missingness changes.

**Fix:** fingerprints + regime conditioning + ruler health + observability coverage.

### 15.3 "Goodhart by judge"


Optimizing a single judge score yields style inflation.

**Fix:** orthogonal validators, anchor sets, double scoring, holdouts.

## Appendix A: Minimal artifacts to implement


To make this doctrine executable:

- `fingerprints/` (C/I/E_fixed/R)
- `slices/` (tiered slice definitions; `min_n`)
- `ruler/` (rubrics, judge prompts, validators, anchor sets)
- `state/` (StateEstimate and StateDeltaReport schemas + report generator)
- `gate/` (mechanical verdict evaluator against a gate policy)

## Appendix B: Minimal slice definitions (examples)

```yaml
slice_id: tool_required
tier: 1
description: Episodes labeled as requiring a tool.
predicate:
  any:
    - input.labels.tool_required == true
min_n: 2000
owner: eval-team
```

```yaml
slice_id: long_context
tier: 1
description: Inputs with long context (tokens_in > 4000).
predicate:
  any:
    - input.tokens_in > 4000
min_n: 1000
owner: eval-team
```

## Appendix C: Hashing and reproducibility notes


- Fingerprint hashes should be computed from normalized JSON (sorted keys).
- Include explicit versions for:
	- prompts,
	- tool schemas,
	- retrieval index snapshot ids,
	- judge prompt versions,
	- validator versions.
- Store raw fingerprint details alongside hashes for audit.

## Appendix D: Relationship to experimental design


- **StateEstimate** is the "what was observed?" object.
- **StateDeltaReport** is the "what changed?" object.
- **ExperimentSpec / ExperimentReport** define how deltas are computed and what inference is valid.

The minimum viable system is:

- generate StateEstimates for A and B under a valid design,
- generate StateDeltaReport with correct inference,
- compute mechanical verdict under CI+margins gates.
