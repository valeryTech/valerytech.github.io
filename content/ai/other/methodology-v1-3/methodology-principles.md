---
draft: false
toc: true
title: "Methodology Principles v1.1"
description: "AI improvement requires separating what was changed from shifts in inputs, dependencies, and evaluation. The principles join that distinction to uncertainty, controlled experiments, constrained optimization, and incident learning."
linkTitle: "Methodology Principles"
---

A design-and-operations discipline for **LLM / agentic systems** where behavior is stochastic, tool-dependent, and measured with imperfect instruments.

This document is the normative "front door" to the framework. It specifies:

- The **formal objects** being measured and improved (estimands, deltas, units).
- The **invariants** required for comparability (fingerprints and versioning).
- The **measurement doctrine** (rulers, uncertainty, calibration, drift).
- The **experimental doctrine** (offline paired, online A/B, switchbacks, decision rules).
- The **slice doctrine** (governed slice space, low-n handling, multiple comparisons).
- The **attribution doctrine** (diagnostic vs causal, regimes, ablations/replay).
- The **optimization doctrine** (constrained search, promotion gates, safety envelopes).
- The **operational loop** (instrument -> estimate -> detect -> decide -> optimize -> deploy -> monitor).

Intended audience: engineers and researchers building LLM applications, agents, and RAG systems in production.

## 0. Scope and non-goals

### In scope


- LLM apps with prompting, retrieval, tool use, routing, agent loops.
- Offline evaluation and online monitoring of **quality, reliability, safety, latency, cost**.
- Iterative improvement via prompt/model/retrieval/tooling changes, with controlled releases.

### Out of scope (but interfaces exist)


- Model pretraining and base-model training pipelines.
- Full causal inference theory; only operationally sufficient defaults are defined here.
- Legal/compliance policies (assumed provided externally as constraints).

## 1. Definitions (canonical vocabulary)

### 1.1 Episode, trace, outcome


- **Episode**: the unit of work being evaluated and optimized. It has a clear **start** and **end** and produces a final **outcome** plus intermediate steps.
  Examples: "answer one user query", "complete a tool-using task", "resolve a multi-turn intent".
- **Trace**: the structured record of what happened: spans, tool calls, retrieved docs, prompts, model outputs, validators, retries, timeouts.
- **Outcome**: the terminal result summarized by one or more metrics (success, groundedness), plus operational signals (latency, cost, safety).

### 1.2 The five planes (C / I / E / R / O)


Every system state decomposes across five planes:

- **C-plane (Configuration)**: what can be changed intentionally.
  Prompts, model choice, decoding params, router policy, retrieval `top_k`, tool schemas, safety posture, fallback policy.
- **I-plane (Input regime)**: what the system will face.
  Traffic distribution, offline eval set, language/domain mix, long-context prevalence, adversarial prompts.
- **E-plane (Environment)**: exogenous conditions and dependencies.
  Tool availability, tool latency, rate limits, external APIs, vector index health.
- **R-plane (Ruler)**: how outcomes are measured.
  Rubrics, judge model and prompts, deterministic validators, aggregation rules.
- **O-plane (Observed behavior)**: measured outcomes and uncertainty.
  Success rate with CI, p95 latency with CI, slice failure matrix, drift statistics.

**Rule (Plane separation):** do not attribute an O-plane change to C-plane "improvement" unless I/E/R are controlled or explicitly accounted for.

### 1.3 System state vs agent internal state


- **System state (snapshot)** here is *not* MDP/POMDP latent state. It is an **auditable snapshot**: fingerprints of C/I/E/R plus measured O.
- **Agent internal state** (memory/scratchpad/beliefs) is part of the trace and is a C-plane design choice.

## 2. Formal model (the measurement target)


This section makes "did it improve?" well-posed.

### 2.1 Generative view


Let:

- \(x \sim \mathcal{D}\) be an input drawn from distribution \(\mathcal{D}\) (I-plane).
- \(c\) be configuration (C-plane).
- \(e\) be environment condition/regime (E-plane).
- \(r\) be the measurement instrument / ruler (R-plane).

The system produces a stochastic trace/outcome:

- \((\tau, y) \sim P(\cdot \mid x, c, e)\)

The ruler produces a measurement \(m\) (possibly noisy):

- \(m = r(x, \tau, y)\)

### 2.2 Estimands (targets)


An **estimand** is the formal optimization target.

Common estimands:

- **Global expectation**
  \[
  \mu(c) = \mathbb{E}_{x\sim\mathcal{D},\,e\sim\mathcal{E}}[m(x,c,e)]
  
\]
- **Slice-conditional expectation** for slice predicate \(s(x,\tau)\in\{0,1\}\)
  \[
  \mu_s(c) = \mathbb{E}[m \mid s=1]
  
\]
- **Quantiles/tails** (e.g., latency p95) under \(\mathcal{D}\) and \(\mathcal{E}\)
- **Composite metrics** (e.g., `success@budget`)

### 2.3 Deltas (comparisons)


For a change \(c_A \rightarrow c_B\):

- **Offline paired delta (preferred)**
  \[
  \Delta = \mathbb{E}[m_B - m_A]
  
\]
  (same inputs run through A and B)
- **Online unpaired delta**
  \[
  \Delta = \mathbb{E}[m \mid B] - \mathbb{E}[m \mid A]
  
\]

### 2.4 Comparability invariants


A delta claim is credible only under one of these conditions:

- hold fixed I-plane (same eval set), E-plane (same regime), R-plane (same ruler), **or**
- model/condition on changes (reweighting, stratification, regime conditioning).

**Principle (Comparability):** a valid interpretation is unavailable for \(\Delta\) if C, I, E, and R all move at once.

## 3. Core principles (expanded and operational)

### 3.1 Separate the system planes (C/I/E/R/O)


**Principle:** represent changes explicitly by plane; never mix implicitly.

**Operational requirements**

- Every run and release MUST fingerprint:
	- C: model/prompt/router/retrieval/tool schemas/decoding params
	- I: dataset version or traffic window + sampling definition
	- E: tool versions/endpoints, health signals, rate limit config
	- R: judge model + rubric prompt + validator code versions
- Every "improvement" claim MUST state which planes were controlled and which were conditioned.

**Failure mode prevented:** attributing an observed lift to prompts when judge drift or easier traffic caused it.

### 3.2 Treat the system as a stochastic process, not a function


**Principle:** behavior is a distribution; reliability is a probability.

Sources:

- LLM sampling / decoding nondeterminism
- tool latency and retries
- retrieval nondeterminism (index updates, approximate search)
- concurrency / queueing
- traffic and environment drift

**Operational requirements**

- Offline gating MUST either:
	- use deterministic decoding (temperature 0 / fixed seeds), or
	- use K replicates per input and treat the input as the unit (bootstrap over inputs).
- Online evaluation MUST assume stochasticity is part of the product and rely on randomization + sufficient N.

### 3.3 Define "system state" as a measurable object


**Principle:** system state is not "code version"; it is fingerprints + metric distributions + uncertainty + slice matrix.

**Minimum SystemState**

- `fingerprints`: `{C, I, E, R}`
- `metrics_global`: estimates + CI + n
- `metrics_by_slice`: slice × metric matrix with estimates + CI + n
- `driver_metrics`: tool failures, empty retrieval, truncation, loop signals
- `ruler_health`: drift stats, validator error rates

**Rule:** improvement claims require an explicit state object.

### 3.4 Constrain optimization by contracts and guardrails


**Principle:** define explicit contracts; optimize within them.

Typical contracts:

- Output/schema contract (JSON schema, formatting)
- Tool contract (allowed tools, call schemas, retry/timeouts, idempotency)
- Evidence/grounding contract (RAG citations/evidence)
- Safety/refusal contract (prohibited content, refusal boundaries)
- Budget contract (latency/cost budgets)

**Guardrail rule:** guardrails are feasibility constraints for shipping, not "just another metric."

### 3.5 Prefer controlled experiments over intuition


**Principle:** every change proposal must have a hypothesis, a target slice/regime, and a decision rule.

Required fields for any change:

- Hypothesis: which failure mode(s) change and why?
- Target: which slice(s) and regimes should improve?
- Primary endpoints: what "success" means for the change
- Guardrails: what must not regress
- Decision rule: CI + margin (or p-value policy), plus sample size / stopping

### 3.6 Design for attribution, not just performance


**Principle:** when behavior shifts, distinguish between:

- C-plane changes,
- I-plane drift,
- E-plane incidents,
- R-plane measurement drift,
- and noise.

Attribution requires:

- structured traces + stable identifiers
- failure mode ontology (anecdotes -> counts)
- driver metrics (tool failures, empty retrieval, truncation, loops)
- regime conditioning (tool healthy vs degraded, retrieval rich vs empty)

### 3.7 Ship with feedback loops, not features


**Principle:** the product is the loop.

A robust loop:

1. instrument
2. estimate
3. detect change
4. decide
5. optimize
6. deploy
7. monitor + refresh data/ruler

If any link is missing, iteration becomes superstition.

### 3.8 Prevent / Detect / Recover / Prove


This framework can also be read through a simpler operator-facing lens:

- **Prevent:** put design-time controls in place before failures occur.
- **Detect:** make failures, drift, and regressions visible quickly.
- **Recover:** degrade safely when reality violates assumptions.
- **Prove:** produce decision-grade evidence that a change is safe enough to ship.

| Function | Meaning | Core mechanisms |
|---|---|---|
| Prevent | design-time controls | contracts, typed search space, validators, policy boundaries, Tier-1 gates |
| Detect | eval and runtime visibility | traces, monitors, `StateEstimate`, regime labels, ruler health |
| Recover | graceful degradation | fallbacks, circuit breakers, escalation, rollback, degraded modes |
| Prove | release confidence | `ExperimentSpec`, `StateDeltaReport`, holdouts, CI+margins gates |

This frame is complementary to the internal loop above:

- the loop `instrument -> estimate -> detect -> decide -> optimize -> deploy -> monitor` describes the methodological workflow
- `Prevent / Detect / Recover / Prove` describes what operators need the system to do in practice

## 4. Measurement doctrine (R-plane)


R-plane is a frequent hidden failure mode: measurement is noisy, drifting, and gameable.

### 4.1 What a ruler is


A **ruler** is a versioned instrument consisting of:

- rubric spec (criteria, weights, thresholds)
- judge implementation (model + prompt + decoding params)
- deterministic validators (schema, citations, safety filters)
- aggregation rules
- calibration artifacts (human labels, gold sets, anchor items)

### 4.2 Validity and reliability (minimum requirements)


- **Construct validity:** measures the intended construct (groundedness vs style).
- **Reliability:** repeated scoring is consistent (or noise is quantified).
- **Stability:** ruler changes are deliberate and versioned; drift is monitored.

Minimum ruler health:

- fixed **anchor set** scored on every ruler version
- periodic **double scoring** (judge+judge or judge+human)
- tracked **disagreement rate** and drift time series
- a formal ruler change protocol

### 4.3 Judge noise is first-class


If judge labels \(\tilde{y}\) are noisy proxies for \(y\), then:

- apparent improvements can be false positives,
- optimization will exploit judge quirks (Goodhart).

Operational countermeasures:

- freeze judge for controlled comparisons
- track disagreement; widen decision margins when noise rises
- use deterministic validators for hard constraints
- periodic human review on critical slices (especially safety/grounding)

### 4.4 Ruler drift and versioning protocol


Ruler changes are product changes.

Required steps for a ruler upgrade:

1. Create `RulerVersion` artifact with full fingerprint.
2. Score the anchor set with old and new ruler; quantify deltas/disagreements.
3. If deltas are material, re-score recent "known good" releases to preserve comparability.
4. Document what changed (rubric/judge/prompt/validators/aggregation).
5. Update gates if needed, with explicit non-inferiority rationale.

### 4.5 Anti-Goodhart rules


- Do not optimize against one judge score without orthogonal checks.
- Maintain at least one orthogonal channel: human review, deterministic validators, or a second independent judge.
- Keep a true holdout set never used for optimization.
- Audit for "style-only" improvements that inflate judge scores without real value.

## 5. Input regime doctrine (I-plane)

### 5.1 Fix the target distribution explicitly


Every evaluation MUST declare its target regime:

- offline eval set (versioned)
- stratified offline set (with target weights)
- production window (time-bounded) with sampling definition

Without a stated \(\mathcal{D}\), the metric is not interpretable.

### 5.2 Dataset governance: train/dev/holdout for prompts too


Prompting and routing overfit like models.

- **Dev set:** iteration and debugging.
- **Holdout set:** release gating; never used to tune prompts/judges.
- **Red team set:** grows from incidents and adversarial discovery; used for safety/robustness.

Refresh policy:

- refresh deliberately; version changes; preserve anchor continuity.

### 5.3 Reweighting and stratification


If offline data is not representative:

- use post-stratification by key strata (intent, language, tool-required, domain)
- combine stratum estimates using production weights
- avoid high-variance importance weighting unless necessary

### 5.4 Input drift detection


Monitor:

- intent mix
- language mix
- long-context rate
- tool-required rate
- embedding distribution shift (if feasible)

## 6. Environment and regimes doctrine (E-plane)

### 6.1 Regimes are part of the product


A tool-using agent has multiple conditional performance curves:

- tool healthy vs degraded
- rate-limited vs normal
- retrieval empty vs rich
- high latency network vs normal

**Rule:** report metrics conditioned on critical regimes whenever tools/retrieval exist.

### 6.2 Tool health as driver metrics


Minimum signals:

- tool error rate (by tool / error code)
- tool latency p50/p95
- retry rate and retry exhaustion
- schema invalid rate for tool calls

### 6.3 Fault injection (recommended)


Controlled degraded regimes:

- tool timeouts
- rate limits
- empty retrieval
- degraded vector search latency

## 7. Slice doctrine (slice space governance)

### 7.1 Slice definition


A slice predicate may reference:

- input features (language, domain, length, intent)
- trace features (tool_used, retrieval_used, steps, truncation, retries)
- environment (tool_health=degraded)
- rubric outcomes (judge_disagreement_high) -- diagnostic only

### 7.2 Slice tiers


To avoid slice explosion:

- **Tier 1 (gated):** small set (5-20). Releases must not regress.
- **Tier 2 (diagnostic):** larger set for debugging and discovery.
- **Tier 3 (exploratory/discovered):** post hoc or clustering-based; not used for shipping claims until promoted.

### 7.3 Low-n handling


Rules:

- always report n per slice
- define `n_min` for gating decisions
- if Tier-1 slices are low-n offline, oversample or gate online

### 7.4 Multiple comparisons policy


- gate using CI + non-inferiority margins on a small predeclared set
- treat Tier-2/3 as diagnostic unless confirmed
- if p-values are used:
	- Holm for primary gates
	- BH-FDR for diagnostics

### 7.5 Slice lifecycle


Add/promote slices when:

- recurring incidents or costly failures
- strategic product surface (key customers)
- measurable frequency or can be oversampled

Retire slices when:

- redundant
- too rare to measure
- no longer maps to risk

## 8. Estimation doctrine (O-plane as distributions + uncertainty)

### 8.1 Always report uncertainty


Every metric report MUST include:

- point estimate
- interval (e.g., 95% CI)
- sample size and unit (episode/session)
- estimator method
- slice/regime definition

### 8.2 Recommended defaults


- Rates: Wilson CI; paired bootstrap for paired deltas.
- Means: bootstrap CI (paired offline; cluster bootstrap online).
- Quantiles: bootstrap CI on quantiles.
- Ratios/composites: bootstrap composite directly.
- Clustered outcomes: cluster bootstrap or cluster-robust regression.

### 8.3 Stochasticity handling


- offline: deterministic decode or K replicates; bootstrap over inputs
- online: randomization; keep decoding params stable per variant

### 8.4 Missingness and censoring


Define and keep stable:

- tool timeout / invalid schema: count as failure unless explicitly "inconclusive"
- track timeout rate separately
- treat latency cutoffs explicitly (censoring policy)

## 9. Experimental doctrine (how to prove improvement)

### 9.1 Default experiment types


- **Offline paired** (default for dev/gating): high power, controlled; risk of overfitting.
- **Online A/B**: realistic; needs guardrails and rollback.
- **Switchbacks**: for shared resources / nonstationary environment.

### 9.2 Precommit requirements


Every release MUST predeclare:

- primary endpoints (1-3)
- guardrails (hard constraints)
- Tier-1 slices
- margins δ per endpoint
- stopping policy (fixed horizon / sequential)

### 9.3 Decision rules (recommended default)


Prefer CI + margins:

- Success (higher better): pass if `CI_lower(Δ) > −δ`
- Safety violations (lower better): pass if `CI_upper(Δ) < +δ` (often δ=0)
- Tool failure (lower better): pass if `CI_upper(Δ) < +δ`
- Latency p95 (upper bound): pass if `CI_upper(metric_B) < budget` (or delta-margin form)

If CI is wide: classify as **inconclusive** and gather more data (do not assert improvement).

### 9.4 Contamination control


Typical contamination:

- cache leakage across variants
- retrieval index drift mid-experiment
- ruler change mid-experiment
- cross-session memory contaminating variants

Minimum controls:

- variant-specific cache keys
- retrieval snapshot fingerprinting
- fixed ruler per experiment
- session-level randomization for agents

### 9.5 Sequential monitoring policies


Acceptable:

- fixed horizon
- group sequential with alpha spending
- Bayesian monitoring with predeclared thresholds

## 10. Change detection doctrine (controlled diffs + monitoring)

### 10.1 Controlled diffs (release change detection)


Produces a `StateDeltaReport`:

- deltas (global + Tier-1 slices) with CI and n
- driver deltas (tool errors, empty retrieval, loops, truncation)
- regime checks (I drift, E drift, R drift)
- gate verdict (pass/fail/inconclusive) with rationale

### 10.2 Continuous monitoring (production)


Monitor outcomes + drivers + regimes + ruler health:

- success, safety, groundedness
- tool errors, empty retrieval, steps/loops
- tool health, traffic mix drift
- judge/validator drift

Start simple:

- EWMA/CUSUM on rates
- thresholds + hysteresis on tool failures
- separate monitoring of p95/p99 latency and timeout rate

## 11. Attribution doctrine (diagnostic vs causal)

### 11.1 Two kinds of attribution


- **Diagnostic attribution:** "likely driver" based on correlations and regime checks.
- **Causal attribution:** supported by controlled diffs, ablations, replay under fixed conditions.

**Rule:** require causal attribution for decisions that create long-term debt (major refactors, expensive model upgrades). Allow diagnostic attribution for urgent mitigation (rollback, circuit breaker).

### 11.2 Operational attribution workflow


When a regression is detected:

1. Ruler drift check (R)
2. Input drift check (I)
3. Environment/tool health check (E)
4. Config diff check (C)
5. Replay / ablation (causal isolation)
6. Trace sampling and mapping into failure ontology

### 11.3 Regime conditioning for debugging


Always compare conditional metrics when tools/retrieval exist:

- tool_used vs not
- tool_health healthy vs degraded
- retrieval_empty vs nonempty
- long_context vs short_context

## 12. Optimization doctrine (safe, systematic improvement)

### 12.1 Declare the search space explicitly


Use a structured artifact (e.g., `search_space.yaml`) defining:

- tunable parameters and allowed ranges
- constraints (schemas, safety, budgets)
- conditional parameters

### 12.2 Split objectives and constraints


- objectives: success, groundedness, user value proxies
- constraints: safety violations, tool failures, budgets

### 12.3 Multi-fidelity strategy


- cheap offline proxies -> larger offline holdout -> canary/online after gates pass

### 12.4 Promotion gates


A promotion gate maps a delta report to a decision:

- **PASS:** guardrails non-inferior; primaries non-inferior; no Tier-1 regressions beyond margins.
- **FAIL:** any hard constraint violated or clear regression.
- **INCONCLUSIVE:** insufficient certainty; requires more data or revised test.

### 12.5 Online optimization with circuit breakers


If adaptive routing/bandits are used:

- only gated arms are eligible
- circuit breakers for safety/tool failures/latency budgets
- log assignment and context; preserve evaluability

## 13. Instrumentation doctrine (what must be logged)

### 13.1 Trace schema (minimum)


Per episode:

- ids: `episode_id`, `session_id`, `user_id_hash` (privacy-safe)
- timestamps and durations
- C fingerprints
- E indicators (tool health, timeouts, rate limits)
- inputs (redacted as needed) + normalized features (length, language)
- tool calls (name, schema version, success/failure, latency, retries)
- retrieval (index snapshot, `top_k`, doc ids, scores, empty flag)
- outputs + validator results (schema validity, citation parse)
- derived labels (success, groundedness, safety, judge outputs + confidence)
- slice flags

### 13.2 Privacy and sampling


- explicit logging policy: sampling rate, retention, PII handling, encryption
- redaction/tokenization where required
- secure "full fidelity" path for safety-critical debugging (stricter access)

## 14. Governance and cadence

### 14.1 Weekly "state review"


- top deltas (global + Tier-1 slices)
- top failure modes by prevalence and impact
- ruler health (drift, disagreement)
- input drift and environment incidents
- slice additions and dataset refresh plan

### 14.2 Incident-to-slice and incident-to-regime


Every incident should produce:

- a new/refined slice (if applicable)
- a test case added to a versioned red team set
- a detection rule or driver threshold (if missing)
- a postmortem mapping to planes (C/I/E/R)

### 14.3 Ruler governance


- named ruler owner
- enforced change protocol (review + anchor scoring)
- archived anchor results for auditability

## 15. Minimal checklists (for design and reviews)

### 15.1 Design review checklist


- Episode definition: start/end, outcome, success definition
- Plane fingerprints: C/I/E/R identifiable on every run
- System contract: schemas, tool boundaries, safety posture, budgets
- Failure ontology exists and maps to counts
- Slice space: Tier-1 defined with expected n
- Ruler: versioned, calibration plan, drift checks
- Estimation: estimator + uncertainty policy
- Experiment plan: offline paired gating + online plan if needed
- Change detection: delta report + monitoring plan
- Rollback/circuit breakers defined

### 15.2 Release gating checklist


- R fixed during comparison
- I fixed (offline) or randomized (online)
- E recorded; major incidents absent or conditioned
- gates passed (guardrails + primaries + Tier-1)
- no unexplained driver regressions
- delta report saved and linked to release

### 15.3 Incident response checklist


- ruler drift check
- tool health check
- retrieval empty rate check
- traffic mix drift check
- loop/step explosion check
- rollback/circuit breaker if needed
- capture traces and classify failures

## Appendix A: Artifact templates (examples)

### A.1 SystemState (minimal JSON shape)

```json
{
  "state_id": "2026-01-05.release-17",
  "fingerprints": {
    "C": {"hash": "...", "model": "...", "prompt_version": "...", "router_version": "..."},
    "I": {"hash": "...", "dataset": "holdout_v3", "sampling": "paired", "window": null},
    "E_fingerprint_fixed": {"hash": "...", "tools": {"search_api": "v2"}},
    "R": {"hash": "...", "judge_model": "...", "rubric_version": "...", "validators_version": "..."}
  },
  "regimes": {
    "tool_health": "healthy"
  },
  "metrics_global": {
    "task_success": {"estimate": 0.84, "ci95": [0.81, 0.87], "n": 1200, "method": "wilson"},
    "latency_p95_ms": {"estimate": 1850, "ci95": [1720, 2010], "n": 1200, "method": "bootstrap_quantile"}
  },
  "metrics_by_slice": {
    "tool_required": {
      "task_success": {"estimate": 0.78, "ci95": [0.72, 0.83], "n": 260, "method": "wilson"}
    }
  },
  "driver_metrics": {
    "tool_failure_rate": {"estimate": 0.012, "ci95": [0.008, 0.017], "n": 1200},
    "retrieval_empty_rate": {"estimate": 0.09, "ci95": [0.07, 0.11], "n": 1200}
  },
  "ruler_health": {
    "judge_disagreement_rate": 0.06,
    "anchor_set_delta_vs_prev": {"mean": 0.002, "ci95": [-0.004, 0.008]}
  }
}
```

### A.2 StateDeltaReport (minimal)

```json
{
  "compare": {"A": "release-16", "B": "release-17"},
  "deltas": {
    "task_success": {"delta": 0.012, "ci95": [0.004, 0.020], "n": 1200, "method": "paired_bootstrap"},
    "task_success@tool_required": {"delta": -0.018, "ci95": [-0.040, 0.004], "n": 260, "method": "paired_bootstrap"}
  },
  "gates": {
    "primary_non_inferiority": {"pass": true, "margin": 0.005},
    "tool_required_slice": {"pass": "inconclusive", "margin": 0.01},
    "safety": {"pass": true, "margin": 0.0},
    "latency_budget": {"pass": true, "budget_p95_ms": 2000}
  },
  "attribution_checks": {
    "ruler_changed": false,
    "input_drift": {"flag": false},
    "tool_health_drift": {"flag": false}
  }
}
```

### A.3 Slice definition (YAML)

```yaml
slice_id: tool_required
tier: 1
description: Episodes where at least one external tool call is required for success.
predicate:
  any:
    - input.labels.tool_required == true
min_n_for_gating: 200
owner: eval-team
created_from: incident-2025-11-12
```

### A.4 Promotion gate policy (pseudo-spec)

```yaml
policy_id: prod_release_gate_v1
primary_endpoints:
  - metric: task_success
    type: higher_better
    margin: 0.005
    rule: CI_lower(delta) > -margin
guardrails:
  - metric: safety_violation_rate
    type: lower_better
    margin: 0.0
    rule: CI_upper(delta) < +margin
  - metric: tool_failure_rate
    type: lower_better
    margin: 0.002
    rule: CI_upper(delta) < +margin
budgets:
  - metric: latency_p95_ms
    type: upper_bound
    budget: 2000
    rule: CI_upper(estimate_B) < budget
tier1_slices:
  - tool_required
  - retrieval_required
  - long_context
verdicts:
  pass: all rules pass
  fail: any guardrail fails or any tier1 slice clear regression beyond margin
  inconclusive: otherwise
```
