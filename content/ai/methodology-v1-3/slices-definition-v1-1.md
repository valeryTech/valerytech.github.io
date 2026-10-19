---
draft: false
toc: true
title: "Slices Definition V1 1"
linkTitle: "Slices Definition V1 1"
---
# Slices v1.1

> Status: Draft (v1.1)
>
> This specification defines slice *types*, their correct use in offline gating and online monitoring, and the operational and causal pitfalls of trace-defined slices.

## 1. Definition


A **slice** is a **versioned predicate** that selects a subset of episodes (or eval examples) for estimating metrics **conditionally** ("how does the system behave on this subpopulation?").

For an episode `e` with input `x` and execution trace `τ`:

- A slice is a function `s(x, τ) ∈ {0,1}`.
- For a metric `m(e)`, the slice-conditional estimate is:

`μ_s := E[m | s=1]` (reported with sample size `n_s` and uncertainty).

### Why slices exist


Global averages hide failures (Simpson's paradox) and make regressions invisible. Slices make the framework sensitive to regressions that only appear in specific regimes: tool paths, retrieval paths, long-context pressure, adversarial inputs,

and degraded dependencies.

## 2. The critical correction: slice *type* determines whether it is valid for gating comparisons


Slices can be computed from inputs, traces, and environment signals.

However, distinguish **pre-treatment** vs **post-treatment** slices:

### 2.1 Input-defined (pre-treatment) slices -- safe for paired A/B gating


**Definition:** `s_pre(x)` depends only on `x` (and optionally labels attached to `x` that were computed outside the

treatment being compared).

**Use:** Offline eval gating; fair comparisons where both variants are evaluated on the same subset.

**Examples:**

- `non_english`
- `long_context_input` (based on `len(x)` or static context budget estimate)
- `adversarial_input` (pattern/red-team membership)
- `domain_support`, `domain_sql` (taxonomy label)
- `tool_required` / `retrieval_required` **only if** defined as a ground-truth requirement label (see §2.4)

### 2.2 Trace-defined (post-treatment) slices -- excellent for monitoring/attribution; dangerous for causal claims


**Definition:** `s_post(τ)` depends on what happened during execution.

**Use:** Online monitoring, debugging, and attribution ("what happened?"). Also valid for *descriptive* offline analysis.

**Causal pitfall:** If the slice membership itself changes with the variant (e.g., one variant calls tools more),

conditioning on `s_post` creates **selection bias**. Monitoring `task_success` on `tool_used` remains useful, but the analysis should

not treat that comparison as "B improved tool-path success" without controlling for the induced selection effect.

**Rule of thumb for gating:**

- Gating is valid for **metrics whose numerator/denominator are intrinsic to the slice itself** (e.g., `tool_failed_rate` on
  `tool_used`, or `timeout_rate` on `route_tool`), because these metrics measure reliability within that regime.
- Do **not** gate core quality metrics (e.g., `task_success`) on post-treatment slices without a principled
  counterfactual or a pre-defined "intended route" label independent of the variant being tested.

### 2.3 Environment-regime slices -- valid but must be treated as confounders first


Environment slices (tool rate limiting active, dependency degraded) are critical for attribution.

For offline comparisons, these should typically be used as:

- **Stratification variables** (report results separately for "healthy" vs "degraded")
- Or **controls** (exclude degraded windows for gating, but keep them for robustness analysis)

### 2.4 "Required" vs "Used" vs "Should-have" -- separate facts from labels


Three distinct concepts are required:

1. **Trace fact:** `tool_used`, `retrieval_used` (observed)
2. **Ground-truth requirement (input label):** `tool_required`, `retrieval_required` (defined outside the run)
3. **Ruler-derived counterfactual label:** `tool_should_have_been_used` (judge/heuristic label)

This separation prevents mixing execution regimes with correctness requirements.

## 3. Slice quality criteria (expanded)


A "good" slice is:

1. **Stable and versioned**
	- Predicate changes require a new version; historical comparability depends on it.
2. **Observable and deterministic**
	- Slice membership must be computed from logged fields and deterministic code/DSL.
	- Avoid "implicitly judged" slice membership unless it is explicitly ruler-derived.
3. **Actionable**
	- A regression implies a concrete investigation path (tool failures, retrieval misses, truncation, etc.).
4. **Adequately powered**
	- For gating, enforce minimum `n_s` and power (or downgrade slice to stratify_only).
	- For rare but important slices, use oversampling in offline eval sets and separate reporting.
5. **Non-redundant, but composable**
	- Prefer a small **gated set** (3-6) and a larger monitor/stratify_only set.
	- Use slice families with consistent prefixes rather than exploding cross-products.
6. **Privacy-safe**
	- User segmentation is permitted only if aggregated and privacy-reviewed (avoid sensitive attributes).

## 4. Operational representation


At episode ingestion time, compute and store:

- `slice_membership: [slice_id@version, ...]`

SystemState should store:

- slice frequencies: `p(s)` (input mix / regime mix)
- per-slice metric estimates: `{mean, interval, n}`
- per-slice deltas for comparisons (when valid)

## 5. Slice metadata schema (recommended)


Every slice definition should include:

- `slice_id` (stable name)
- `slice_version` (semantic version or monotonic integer)
- `type`: `input_defined | trace_defined | env_defined | outcome_defined | ruler_defined`
- `treatment_time`: `pre | post`
- `predicate`: a deterministic expression over an episode record
- `required_fields`: list of trace fields required to compute it
- `parameters`: thresholds and their provenance (fixed vs baseline-derived; baseline window reference)
- `owner`: team/role accountable for changes
- `gating_role`: `gate | monitor | stratify_only`
- `tier`: `1 | 2 | 3`
- `notes`: intended meaning, known pitfalls, and "why this exists"

## 6. Gate eligibility rules (enforceable defaults)


- Tier-1 gate slices must be **pre-treatment** and **input-defined** by default.
- Trace-defined post-treatment slices are **monitor/stratify-only** unless there is a documented causal justification.
- If a post-treatment slice is used for Tier-1 gating, an explicit waiver and counterfactual strategy is required.
- Any new Tier-1 slice requires re-running baselines and updating the EvaluationContextKey.

## 7. v1 catalog (restructured)

### 7.1 Minimal *gating-safe* slice set (input-defined)


Recommended baseline:

- `all`
- `adversarial_input`
- `non_english`
- `long_context_input`
- `tool_required` (only if it is a requirement label, not "tool happened")
- `retrieval_required` (same constraint)

Optionally add top domains/intents that represent product-critical segments.

### 7.2 Monitoring / attribution slice families (trace-defined)


Use these for dashboards, incident packets, and exploratory offline drill-down.

#### A) Route/path slices (execution path)


- `route_direct`
- `route_retrieval`
- `route_tool`
- `route_clarify`
> Implementation note: consider splitting into `route_intended` (router decision at t=0) vs `route_executed` (actual spans),
> because early failures can prevent spans from occurring.

#### B) Tool regimes


- `tool_used`
- `tool_failed`
- `tool_timeout`
- `tool_rate_limited`
- `tool_schema_invalid`
- `tool_slow`

#### C) Retrieval regimes


- `retrieval_used`
- `retrieval_empty`
- `retrieval_low_evidence`
- `retrieval_truncated`
- (optional) `retrieval_overloaded` (distractor regime)

#### D) Agent dynamics


- `high_steps`
- `loop_detected`
- `retry_exhausted`
- `max_steps_exceeded`
- `validation_failed`

#### E) Cost/latency stress


- `latency_tail`
- `timeout_episode`
- `high_cost`

#### F) Guardrail / safety regimes


- `safety_blocked` (stop reason)
- `over_refusal` (requires classifier/judge)

## 8. Required trace fields (minimum viable)


Episode-level:

- `policy.route`
- `policy.stop_reason`
- `agent.steps`
- `agent.loop_detected`
- `latency.total_ms`
- `cost.total_usd`

Span lists:

- `tool_calls[]`: `{name, status, status_code, latency_ms, retries, schema_valid, error_type}`
- `retrieval_events[]`: `{hit_count, score_mean, score_min, truncated, top_k, rerank_enabled}`
- `llm_calls[]`: `{model_id, latency_ms, input_tokens, output_tokens, finish_reason}`

## 9. Governance: add/rename/deprecate without breaking comparability


1. **Adding slices**
	- Start as `stratify_only`.
	- Promote to `monitor` after observing stability and utility.
	- Promote to `gate` only after meeting sample size and reliability requirements.
2. **Renaming slices**
	- Treat as "new slice ID"; keep the old one for historical comparability.
3. **Changing predicates**
	- Increment `slice_version`.
	- Record changes in a changelog (what changed, why, expected impact on membership rates).
4. **Backfilling**
	- Optional but recommended when predicates use fields that already existed historically.

## 10. Anti-patterns (what breaks slice usefulness)


- **Mixing "required" with "used"**
	- Calling something `tool_required` when it is actually `tool_used`.
- **Gating everything**
	- Too many slices × metrics creates spurious regressions and alert fatigue.
- **Non-reproducible predicates**
	- Predicates that depend on non-versioned baselines or implicit judgment.
- **Leaky slices**
	- Defining slice membership using the same judge output used to compute the metric under test (unless explicitly a
    ruler-derived slice).
- **Post-treatment gating of core quality**
	- Using `task_success` on `tool_used` as a release gate without a counterfactual strategy.

## 11. Practical implementation suggestion: `slices.yaml`


Represent slices as data so they can be executed deterministically:

```yaml
slices:
  - id: tool_used
    version: 1
    type: trace_defined
    treatment_time: post
    gating_role: monitor
    tier: 2
    predicate: "len(tool_calls) > 0"
    required_fields: ["tool_calls"]
  - id: retrieval_empty
    version: 1
    type: trace_defined
    treatment_time: post
    gating_role: gate   # optional gate for regime reliability rather than global quality
    tier: 2
    predicate: "any(re.hit_count == 0 for re in retrieval_events)"
    required_fields: ["retrieval_events[].hit_count"]
```

The estimator computes membership per episode, then aggregates metrics per slice.

## 12. How to add a slice (checklist)


- Define `slice_id`, `slice_version`, `type`, `treatment_time`, `gating_role`, and `tier`.
- Document the predicate and required fields; ensure determinism and coverage.
- Backfill membership on recent baselines; report membership stability and min-n feasibility.
- If Tier-1: update the EvaluationContextKey and re-run baseline gates.

## 13. What changed vs the original `04-slices.md`


- Added **slice typing** and the **pre/post-treatment** distinction to prevent invalid causal gating.
- Clarified **required vs used vs should-have** as separate concepts.
- Introduced a **metadata schema** for governance and reproducibility.
- Restructured the catalog into **gating-safe** vs **monitoring** slice sets.
- Added explicit **anti-patterns** and a recommended `slices.yaml` operational form.
