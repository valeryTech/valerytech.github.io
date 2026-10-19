---
draft: false
toc: true
title: "Experimental Design V1 1"
linkTitle: "Experimental Design V1 1"
---
# Experimental Design v1.1 (LLM / Agentic Systems)


This document operationalizes **Methodology Principles v1.1** for experimentation and release gating. It defines a normative doctrine for proving improvement under stochastic behavior, drifting inputs/environments, and noisy measurement (LLM-as-judge).

Primary goals:

- Make "did it improve?" **well-posed** (estimands, units, regimes, rulers).
- Make "is the release ready?" **decidable** (CI + margins, PASS/FAIL/INCONCLUSIVE).
- Make "why did it change?" **diagnosable** (planes, regimes, driver metrics).
- Make experiments **repeatable and auditable** (versioned `ExperimentSpec`, analysis plan, report).

## 0. Scope and non-goals

### In scope


- Offline paired evaluations (default for iteration and pre-merge gates).
- Online randomized experiments (A/B, cluster-randomized).
- Switchback experiments (for shared-resource interference and nonstationarity).
- Decision rules for shipping, monitoring, and rollback.

### Out of scope


- End-to-end causal inference theory beyond what is required operationally.
- Model pretraining/fine-tuning pipelines (interfaces only).
- Organization-specific policy and compliance rules (assumed as external constraints).

## 1. Foundations (what must be defined)

### 1.1 Episode, trace, and outcome (unit of analysis)


- **Episode**: the scored unit (e.g., "answer one user query," "complete one tool task").
- **Trace**: the recorded evidence: prompts, retrieved docs, tool calls, spans, retries, validators.
- **Outcome**: the metrics computed from the trace and output.

Every experiment MUST declare:

- **Unit of randomization** (e.g., user, session, time-block).
- **Unit of analysis** (e.g., episode, session).
- **Episode boundaries** (start/end definition) if unit of analysis is episode.

### 1.2 The planes (C / I / E / R / O)


Every experiment is a controlled comparison between two (or more) **C-plane** variants, under:

- **I-plane**: the input regime (dataset version or traffic definition),
- **E-plane**: environment regime (tools, caches, external services),
- **R-plane**: the ruler (rubrics, judges, validators),

producing **O-plane** observations (metrics with uncertainty).

**Rule:** an "improvement" claim is invalid if C, I, E, and R all move without control or explicit conditioning.

### 1.3 Plane boundary rules (C vs E_fixed vs E_observed)


- **C-plane:** agent-exposed policy knobs (router rules, prompts, tool-selection rules, per-call retry strategy if configured by the app).
- **E_fixed:** platform defaults/constraints (gateway timeouts, global concurrency limits, default retry middleware, dependency versions, cache infra defaults).
- **E_observed:** measured regimes (rate-limit events, provider degradation, retrieval freshness drift).

**Override rule:** if the application explicitly configures a knob, it moves from E_fixed into C-plane and MUST change `C_fingerprint`.

### 1.3 Estimands (the estimation targets)


An experiment MUST state the estimand explicitly:

- Global expectation:
  \[
  \mu(c) = \mathbb{E}_{x\sim\mathcal{D}, e\sim\mathcal{E}}[m(x,c,e)]
  
\]
- Slice-conditional expectation:
  \[
  \mu_s(c) = \mathbb{E}[m \mid s=1]
  
\]
- Tail risk / quantiles (latency p95/p99).
- Composite (e.g., `success@budget`).

It must also state whether the estimand is **conditioned on regimes**, e.g. `tool_health=healthy`.

## 2. Experiment types and when to use them

### 2.1 Offline paired (default)


**Use when:** the same inputs can be run through both variants to compare within-input differences.

- Pros: high power, excellent attribution, fast iteration.
- Cons: representativeness risk (I-plane mismatch), overfitting risk, limited realism for tool/environment effects.

**Default:** offline paired is the standard gate before online exposure.

### 2.2 Online randomized A/B


**Use when:** realism and the actual traffic distribution are required.

- Pros: measures actual user experience, captures real E-plane variation.
- Cons: slower, more expensive, complex inference due to clustering and interference.

**Default:** online A/B is required for material product changes, new models, or safety-critical shifts.

### 2.3 Switchback (time-based randomization)


**Use when:** SUTVA is plausibly violated due to shared resources:

- shared tool rate limits,
- shared caches,
- global retrieval index health,
- queueing/throughput coupling,
- provider incidents.

Switchbacks randomize by **time blocks** (or region blocks), enabling causal inference under interference if designed carefully.

## 3. The minimum required artifacts


Every experiment MUST have:

1. `ExperimentSpec` (pre-commit)
2. `AnalysisPlan` (methods and decisions; may be embedded in spec)
3. `ExperimentReport` (results, uncertainty, verdict, regime checks, contamination checks)

These artifacts MUST be versioned and stored alongside code releases.

## 4. ExperimentSpec (normative schema)


Below is a recommended YAML schema. It is intentionally explicit; omissions lead to non-auditable experiments.

```yaml
experiment_id: exp_2026_01_05_router_v2
owner: eval-team
created_at: 2026-01-05
status: proposed  # proposed|running|paused|completed|abandoned
# Plane fingerprints
planes:
  C:
    variants:
      A:
        description: "Baseline router + prompt v16"
        fingerprint:
          model: gpt-*
          prompt_version: v16
          router_version: r1
          retrieval: {index: idx_v9, top_k: 8}
          decoding: {temperature: 0.2, top_p: 1.0}
          tools: {schemas_version: t3, retry_policy: rp2}
      B:
        description: "Router v2 with tool-first branch"
        fingerprint:
          model: gpt-*
          prompt_version: v17
          router_version: r2
          retrieval: {index: idx_v9, top_k: 8}
          decoding: {temperature: 0.2, top_p: 1.0}
          tools: {schemas_version: t3, retry_policy: rp2}
  I:
    target_distribution:
      type: online_traffic  # offline_dataset|online_traffic
      definition:
        window: {start: 2026-01-10, end: 2026-01-17}
        sampling: "all eligible traffic"
        eligibility: "logged-in users; exclude employees; locale=en"
  E:
    fixed_defaults:
      caches:
        variant_keying: "variant + prompt_version + model + retrieval_index"
        ttl_seconds: 900
      tools:
        endpoints_fingerprint: {search_api: v2, payments_api: v1}
      retrieval:
        index_snapshot: idx_v9
        update_policy: frozen  # frozen|rolling
    regime_reporting:
      - tool_health  # healthy|degraded
      - retrieval_empty  # true|false
  R:
    ruler:
      rubric_version: rubric_v4
      judge:
        model: gpt-*
        prompt_version: judge_v7
        decoding: {temperature: 0.0}
      validators_version: val_v5
      anchor_set: anchor_v3
      drift_policy:
        max_anchor_mean_shift: 0.01
        max_disagreement_rate: 0.08
# Experiment design
design:
  type: online_ab  # offline_paired|online_ab|switchback
  randomization_unit: session  # episode|session|user|time_block
  analysis_unit: episode  # episode|session|time_block
  assignment:
    ratio: {A: 0.5, B: 0.5}
    method: "hash(session_id) mod 2"
  duration_policy:
    fixed_horizon: true
    target_n: 20000
# Endpoints and slices
endpoints:
  primary:
    - metric: task_success
      direction: higher_better
      estimand: global
      margin:
        type: absolute
        delta: 0.005
      decision_rule: "CI_lower(delta) > -delta"
  guardrails:
    - metric: safety_violation_rate
      direction: lower_better
      margin: {type: absolute, delta: 0.0}
      decision_rule: "CI_upper(delta) < +delta"
    - metric: tool_failure_rate
      direction: lower_better
      margin: {type: absolute, delta: 0.002}
      decision_rule: "CI_upper(delta) < +delta"
  budgets:
    - metric: latency_p95_ms
      type: upper_bound
      budget: 2000
      decision_rule: "CI_upper(metric_B) < budget"
slices:
  tier1_gated:
    - slice_id: tool_required
      type: input_defined
      treatment_time: pre
      gating_role: gate
      tier: 1
      predicate: "input.labels.tool_required == true"
      min_n: 2000
    - slice_id: long_context
      type: input_defined
      treatment_time: pre
      gating_role: gate
      tier: 1
      predicate: "input.tokens_in > 4000"
      min_n: 1000
  diagnostic:
    - slice_id: retrieval_empty
      type: trace_defined
      treatment_time: post
      gating_role: monitor
      tier: 2
      predicate: "trace.retrieval.empty == true"
# Inference and multiple comparisons
inference:
  ci_level: 0.95
  method_defaults:
    binary_rate: "cluster_bootstrap"  # wilson|bootstrap|cluster_bootstrap|regression_cluster_robust
    quantile: "bootstrap"
  clustering:
    cluster_unit: session
  multiple_comparisons:
    policy: tiered
    tier1: "predeclared_ci_margins"  # or holm if using p-values
    diagnostic: "bh_fdr"  # optional; else diagnostic-only
# Contamination controls
contamination_controls:
  - "variant_specific_cache_keys_enabled"
  - "retrieval_index_frozen"
  - "ruler_frozen_for_duration"
  - "no_cross_variant_memory"
# Missingness policy
missingness:
  tool_timeout: failure
  schema_invalid: failure
  judge_error: exclude_with_counter  # exclude_with_counter|fail_closed
```

## 5. Decision doctrine (PASS / FAIL / INCONCLUSIVE)


Shipping decisions MUST be based on a precommitted gate policy.

### 5.1 Default gate logic


- **PASS** if:
	- All guardrails satisfy their decision rules, and
	- All primary endpoints satisfy their decision rules, and
	- No Tier-1 slice shows regression beyond its margin (or is INCONCLUSIVE due to low n), and
	- Ruler health is within thresholds, and
	- No contamination control is violated.
- **FAIL** if:
	- Any guardrail violates its decision rule, or
	- Any hard budget constraint fails, or
	- Clear regression on primary endpoint beyond margin.
- **INCONCLUSIVE** otherwise:
	- CI too wide / insufficient n,
	- ruler instability,
	- regime incidents not controlled,
	- contamination suspected.

### 5.2 Margins (δ) must be justified


Each margin δ MUST include:

- delta type: absolute vs relative,
- business tolerance rationale,
- direction (higher/lower better),
- whether it is a hard constraint (δ=0 often for safety).

## 6. Inference doctrine (how to compute uncertainty)

### 6.1 Choose correct clustering


If randomization is at **session** but analysis is at **episode**, episodes are correlated.

Default: **cluster bootstrap** at the randomization unit.

- Randomization unit = **user/session** -> cluster bootstrap / cluster-robust SE.
- Randomization unit = **time block** (switchback) -> analyze at block level; treat blocks as units.

### 6.2 Recommended defaults by metric type

#### Binary rates (success, safety violations, tool failures)


- Offline paired: paired bootstrap on per-input differences; McNemar as a sanity check.
- Online AB (clustered): cluster bootstrap or logistic regression with cluster-robust SE.
- Switchback: block-level success rates; difference-in-means across blocks.

#### Continuous means (cost, latency mean)


- Online AB: regression with cluster-robust SE; optional winsorization policy must be predeclared.

#### Quantiles (latency p95/p99)


- Bootstrap quantiles; if clustered, bootstrap by cluster unit.

#### Composite metrics (`success@budget`)


- Bootstrap the composite directly (do not separately bootstrap components unless required).

### 6.3 Sequential monitoring


Early inspection of results requires predeclaring:

- fixed horizon (preferred), or
- group sequential alpha-spending, or
- Bayesian thresholds with predeclared priors and decision boundaries.

If not predeclared: **do not claim statistical certainty** from midstream reads.

## 7. Contamination and comparability controls (must be enforceable)

### 7.1 Common contamination sources


- **Cache leakage**: shared cache keys across variants.
- **Index drift**: retrieval index updated mid-experiment.
- **Ruler drift**: judge model/prompt changes mid-experiment.
- **Cross-variant memory**: persistent memory or session artifacts used across variants.
- **Exposure bias**: variant affects who stays/returns, changing I-plane.

### 7.2 Minimum required controls


- Variant-specific cache keys.
- Frozen retrieval snapshot for the experiment window (or explicit conditioning on index version).
- Frozen ruler for the duration (or explicit two-phase design with re-scoring).
- Clear eligibility and sampling definition; log assignment.

### 7.3 Post-run contamination checks (required in report)


- Validate cache keying.
- Verify retrieval index version distribution by variant.
- Verify judge/rubric versions unchanged.
- Compare traffic mix across variants (language, intent, tool-required rate).
- Check tool health incidents; report regime-conditioned metrics.

## 8. Switchback doctrine (shared resources / interference)

### 8.1 When switchbacks are mandatory


Use switchbacks when:

- tool rate limiting couples outcomes across variants,
- caches are global and hard to isolate,
- throughput/queueing is shared,
- external incidents are expected and correlated.

### 8.2 Design rules (recommended defaults)


- **Block length** must exceed:
	- p95 end-to-end latency,
	- cache TTL impacts,
	- tool rate limit recovery cycles.
- Include **washout** (or disregard first X minutes of each block) when carryover is likely.
- Minimum **number of blocks**: aim for ≥ 20 blocks to estimate variance credibly (more is better).
- Randomize block order; balance day-of-week and time-of-day if diurnal patterns exist.

### 8.3 Analysis rules


- Compute block-level aggregates (e.g., success rate, p95 latency).
- Compare variants using block-level differences; use robust SE if autocorrelation suspected.
- Always report time series plots internally (not required in this doc), and report whether autocorrelation tests were applied.

## 9. Power and sample size (operational workflow)


Analytic formulas are fragile for complex metrics. Default to **simulation-based power** where feasible.

### 9.1 Offline paired power


Workflow:

1. Use prior paired runs or a pilot to estimate variance of paired differences.
2. Simulate \(N\) inputs with paired outcomes under assumed delta.
3. Apply planned estimator and decision rule; estimate pass probability.

### 9.2 Online AB power with clustering


Workflow:

1. Run a pilot to estimate baseline rate and ICC at the randomization unit.
2. Compute effective sample size:
   \[
   n_{\text{eff}} \approx \frac{n}{1 + (m-1)\rho}
   
\]
   where \(m\) is mean episodes per cluster, \(\rho\) is ICC.
3. Use simulation (preferred) or conservative approximations for binary endpoints.

### 9.3 Minimal practical guidance


- If the decision is safety-critical: plan for **n** large enough that safety violation CIs are tight (often dominates).
- If slice gating is required: ensure each Tier-1 slice meets `min_n`; otherwise the experiment will end INCONCLUSIVE.

## 10. Ruler doctrine integration (judge noise and drift)

### 10.1 Freeze the ruler for comparisons


For a single experiment:

- hold judge model + judge prompt + rubric + validators constant.

### 10.2 Anchor set health gates


Every experiment report MUST include ruler health:

- anchor set mean shift vs previous ruler version,
- disagreement rate (judge-judge or judge-human if available),
- judge error rate and missingness counters.

If ruler health thresholds are exceeded: **default verdict = INCONCLUSIVE** unless mitigated (re-score with stable ruler).

### 10.3 Double scoring policy (recommended)


For critical endpoints (groundedness/safety):

- double-score a fixed fraction (e.g., 5-10%) with an independent judge or human review.
- use as a drift and Goodhart defense; treat as an audit channel.

## 11. Missingness and censoring policy (must be explicit)


Common missingness types:

- tool timeouts,
- invalid JSON / schema failures,
- judge errors,
- truncation due to context limits,
- upstream outages.

Each must have a predeclared treatment:

- Fail-closed (count as failure) vs exclude-with-counter.
- Latency censoring policy (if timeouts are censored, report both censored and uncensored metrics).

**Default:** timeouts and schema invalid are **fail-closed** for success-type endpoints, plus tracked as driver metrics.

## 12. Multiple comparisons (aligned with slice tiers)

### 12.1 Tiered policy (default)


- Tier-1 slices + primary endpoints: **predeclared set only**. Use CI+margins gating.
- Tier-2 diagnostics: BH-FDR if needed, otherwise diagnostic-only.
- Tier-3 exploration: never used for shipping claims; promotion requires precommitment in a future experiment.

### 12.2 Avoid adaptive slicing for gating


Treat a slice discovered post hoc as:

- a **hypothesis generator**, not a shipping gate, until it is predeclared and re-tested.

## 13. ExperimentReport (normative schema)


Reports must be structured; narrative is optional.

```yaml
experiment_id: exp_2026_01_05_router_v2
status: completed
window: {start: 2026-01-10, end: 2026-01-17}
planes_fingerprints:
  C: {A: "...", B: "..."}
  I: "online window + eligibility hash"
  E_fingerprint_fixed: "tools endpoints + cache policy + retrieval snapshot"
  R: "rubric_v4 + judge_v7 + validators_v5"
traffic_summary:
  n_clusters: 8200
  n_episodes: 40211
  variant_split: {A: 0.50, B: 0.50}
  mix_checks:
    language: {A: "...", B: "..."}
    tool_required_rate: {A: 0.21, B: 0.21}
ruler_health:
  anchor_mean_shift: 0.003
  disagreement_rate: 0.05
  judge_error_rate: 0.002
  within_thresholds: true
results:
  global:
    - metric: task_success
      A: 0.841
      B: 0.853
      delta: 0.012
      ci95: [0.004, 0.020]
      method: cluster_bootstrap(session)
      decision: pass
    - metric: safety_violation_rate
      A: 0.0008
      B: 0.0009
      delta: 0.0001
      ci95: [-0.0002, 0.0004]
      decision: pass
  budgets:
    - metric: latency_p95_ms
      A: 1910
      B: 1870
      ci95_B: [1800, 1950]
      budget: 2000
      decision: pass
  tier1_slices:
    - slice_id: tool_required
      metric: task_success
      delta: -0.006
      ci95: [-0.024, 0.011]
      n: 8600
      decision: inconclusive
regime_conditioning:
  tool_health:
    healthy:
      task_success_delta: 0.013
      ci95: [0.005, 0.021]
    degraded:
      task_success_delta: -0.010
      ci95: [-0.060, 0.030]
contamination_checks:
  cache_keying_ok: true
  retrieval_snapshot_ok: true
  ruler_frozen_ok: true
  anomalies: []
verdict:
  overall: inconclusive
  rationale:
    - "Tool-required Tier-1 slice inconclusive; follow-up required."
    - "All guardrails and budgets passed."
next_actions:
  - "Run offline paired focused on tool-required slice with oversampling."
  - "Investigate degraded tool regime; add fault-injection eval."
## 13. Gate eligibility rules (enforceable defaults)
- Tier-1 gate slices must be **pre-treatment** and **input-defined** by default.
- Post-treatment trace-defined slices are **monitor/stratify-only** unless an explicit causal waiver exists.
- New Tier-1 slices require re-running baselines and updating the EvaluationContextKey.
## 14. How to add a slice (checklist)
- Define `slice_id`, `type`, `treatment_time`, `gating_role`, and `tier`.
- Validate determinism + required fields coverage; record missingness policy.
- Backfill membership on baselines and confirm min-n feasibility.
- If Tier-1: update EvaluationContextKey and re-run gates.
```

## 15. Checklists (minimum operational compliance)

### 14.1 Pre-run checklist


-[] Episode boundaries defined (if relevant).

-[] Estimand declared; regime conditioning declared.

-[] Randomization unit and analysis unit declared.

-[] Ruler fingerprint frozen; anchor set health thresholds defined.

-[] Variant cache keying isolated.

-[] Retrieval index snapshot frozen or versioned.

-[] Missingness policy set.

-[] Primary endpoints, guardrails, budgets, Tier-1 slices predeclared.

-[] Margins δ justified.

-[] Stopping rule predeclared (fixed horizon or sequential plan).

-[] Logging and assignment recorded.

### 14.2 Post-run checklist


-[] Traffic mix checks across variants.

-[] Tool health incidents logged and regime-conditioned metrics reported.

-[] Ruler health reported; thresholds satisfied or verdict INCONCLUSIVE.

-[] Contamination checks executed and documented.

-[] Report includes estimates, CIs, n, method, and decisions.

-[] Verdict computed mechanically from gate policy.

## 15. Worked examples (end-to-end)

### 15.1 Offline paired gating example (prompt change)


**Goal:** increase groundedness without regressing success.

**Design:** offline paired on `holdout_v3` with frozen retrieval snapshot and frozen ruler.

**Spec excerpt:**

```yaml
design: {type: offline_paired, analysis_unit: episode}
planes:
  I: {target_distribution: {type: offline_dataset, definition: {dataset: holdout_v3}}}
  E: {assumptions: {retrieval: {index_snapshot: idx_v9, update_policy: frozen}}}
  R: {ruler: {rubric_version: rubric_v4, judge: {model: gpt-*, prompt_version: judge_v7, decoding: {temperature: 0.0}}}}
endpoints:
  primary:
    - metric: groundedness_score
      direction: higher_better
      margin: {type: absolute, delta: 0.01}
      decision_rule: "CI_lower(delta) > -delta"
  guardrails:
    - metric: task_success
      direction: higher_better
      margin: {type: absolute, delta: 0.005}
      decision_rule: "CI_lower(delta) > -delta"
inference:
  method_defaults: {continuous_mean: paired_bootstrap}
```

**Analysis:**

- Run A and B on the same inputs.
- Compute per-input difference in groundedness.
- Paired bootstrap over inputs -> CI for delta.
- PASS if both rules pass; otherwise FAIL/INCONCLUSIVE.

**Common pitfalls:**

- tuning prompt on holdout; must keep a separate dev set.
- changing the judge prompt mid-run.

### 15.2 Online A/B (session-randomized) example (router change)


**Goal:** improve task success while keeping latency budget and safety guardrails.

**Design:** session-level randomization; episode-level outcomes; cluster bootstrap by session.

**Key compliance points:**

- variant-specific cache keys (router changes often change prompt shape).
- frozen ruler for the window.
- tool health incidents tracked and regime-conditioned.

**Decision:**

- PASS only if global + Tier-1 slices meet CI+margins and budgets.

### 15.3 Switchback example (shared tool rate limiting)


**Problem:** tool rate limits cause interference; standard A/B violates independence.

**Design:**

- 30-minute blocks, randomized order over 10 days (≈ 480 blocks).
- Washout: ignore first 5 minutes of each block (cache warm/carryover).
- Analysis at block level.

**Spec excerpt:**

```yaml
design:
  type: switchback
  randomization_unit: time_block
  analysis_unit: time_block
  blocks:
    block_minutes: 30
    washout_minutes: 5
    schedule: "randomized; balanced by hour-of-day"
inference:
  method_defaults:
    binary_rate: "block_difference_means"
  autocorrelation:
    check: true
    method: "HAC_if_needed"
```

**Analysis:**

- Compute block-level success rate and tool failure rate.
- Compare across blocks assigned to A vs B.
- If autocorrelation exists, use HAC/robust SE and report.

**Pitfalls:**

- blocks too short -> carryover dominates.
- too few blocks -> variance poorly estimated.

## 16. Minimal implementation guidance (what to build in code)


To make this doctrine executable, build:

- `experiment_spec.yaml` parser and validator.
- Assignment module (hashing, session/user randomization, time-block scheduler).
- A metric engine that supports:
	- global metrics,
	- slice-conditioned metrics,
	- regime-conditioned metrics,
	- missingness policy.
- Inference library:
	- paired bootstrap,
	- cluster bootstrap,
	- quantile bootstrap,
	- block-level analysis for switchbacks.
- A report generator that produces `ExperimentReport` and a mechanical verdict.

## 17. Summary (non-negotiables)


An experiment is valid only if:

- estimand, unit(s), and regimes are explicit,
- planes are fingerprinted and controlled/conditioned,
- ruler is frozen and its health is reported,
- contamination controls are enforced,
- inference respects clustering/interference,
- decisions follow precommitted CI+margins gates.
