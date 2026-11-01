---
draft: false
toc: true
title: "RFC: AI Systems Framework v1.3"
description: "A product team can implement the framework as runtime, measurement, state, monitoring, and optimization layers. The RFC defines their interfaces, rollout milestones, owners, and resolutions of conflicting conventions."
linkTitle: "Framework RFC v1.3"
---

**Status:** Draft

**Owner:** `<framework owner>`

**Reviewers:** `<measurement>`, `<runtime/observability>`, `<security/privacy>`, `<product>`

**Target:** Single product team (infra-first); scalable to multi-team later

**Last updated:** 2026-01-05

## 1. Summary


This RFC proposes an internal **AI Systems Framework** for building and operating LLM / agentic applications as **measurable, testable, monitorable, and optimizable** software systems.

The framework standardizes:

- **State representation** (what the system is, and the observed behavior, with uncertainty)
- **Instrumentation** (episode traces and spans; coverage and missingness)
- **Evaluation** (offline paired eval; slice/regime matrices; ruler governance)
- **Release gates** (CI+margins doctrine; hard constraints; PASS/FAIL/INCONCLUSIVE)
- **Change detection** (Stage 0 integrity gates; anomaly -> confirmation -> attribution; ChangePacket)
- **Optimization** (safe search over typed search space; constraints-first; holdout discipline)
- **Governance** (ownership, versioning, and change protocols across C/I/E/R/O)

The result is a repeatable discipline for: "make a change -> measure delta -> decide -> monitor -> learn," while preventing common invalid comparisons caused by drift, noise, ruler changes, and coupled dependencies.

## 2. Problem statement


LLM/agentic systems differ from deterministic services and many classical ML deployments:

- Behavior is **stochastic** and strongly **regime-dependent** (tools, retrieval, context length).
- Measurement uses **noisy instruments** (judges/rubrics/validators) that drift and can be gamed.
- Production behavior is shaped by **input distribution drift**, **environment incidents**, and **provider non-stationarity**.
- Observability is incomplete; missingness is often **not random**.

Without a standard discipline:

- improvements fail to replicate,
- rollouts regress critical slices,
- monitoring produces noisy/unactionable alerts,
- and optimization optimizes the ruler instead of the system.

An infrastructure framework should make evaluations and operations **auditable**, **comparable**, and **actionable**.

## 3. Goals and non-goals

### 3.1 Goals


1. **Comparability contract:** define what constitutes a valid comparison (across C/I/E/R/O) and encode it in artifacts.
2. **Eval-first iteration:** make offline paired evaluation and delta reports first-class outputs of development.
3. **Decision-grade gates:** apply CI+margins gates with PASS/FAIL/INCONCLUSIVE outcomes.
4. **Operational change detection:** detect, confirm, and attribute changes using standard packets and plane-first triage.
5. **Safe optimization:** enable constrained search over a typed search space with holdouts and circuit breakers.
6. **Governance:** version and own the ruler, slices, and gate policy to reduce ambiguity and Goodhart.

### 3.2 Non-goals (v1.3)


- Full model training/fine-tuning lifecycle; the scope covers integration interfaces and evaluation discipline.
- Exhaustive fairness/safety auditing programs; v1.3 includes core safety constraints and incident-driven red-team growth.
- A fully managed data platform; the scope specifies schemas and required fields while leaving storage technology open.
- Cross-team SLA negotiation; v1.3 assumes a single team and a small set of tool dependencies.

## 4. Foundations (normative reference)


The framework's validity contract is specified in **Foundations v1.3** and is treated as normative:

- Assumptions A1-A6 (input distribution, stochastic outcomes, ruler as instrument + Goodhart, environment regimes + provider drift, constrained optimization, observability/missingness)
- Validity threats T1-T6 and required safeguards
- Non-negotiable enforcement "laws"

**Implementation rule:** if a foundation is violated, comparisons and incident verdicts default to **INCONCLUSIVE** until mitigated (re-score, re-run, reweight, fix observability, etc.).

## 5. Core terminology (operational)

### 5.1 Episode


An **episode** is the atomic unit of analysis: one user task execution of the system.

- **Start:** user task request (or system-triggered task) enters the workflow.
- **End:** terminal success, terminal failure (timeout/max steps/safety block), or abandonment window expires.

Episode is the unit for:

- traces/logging,
- offline paired evaluation,
- randomization assignment (online AB),
- monitoring buckets.

### 5.2 Planes (C / I / E / R / O)


- **C-plane (Configuration):** prompts, models, decoding, routing, tool policies, retrieval settings.
- **I-plane (Input regime):** traffic distribution and slice membership (intent/language/long-context/tool-required).
- **E-plane (Environment):** tool/retrieval/provider health; rate limits; dependency behavior.
- **R-plane (Ruler):** evaluators, rubrics, judge versions, validators, aggregation logic.
- **O-plane (Observed behavior):** metric estimates + uncertainty (global + slice/regime matrices) and driver metrics.

## 6. Proposed system: architecture overview


The framework is a set of **libraries, schemas, CLI tools, and governance rules** organized into five layers:

1. **Runtime layer (instrumented execution)**
	- episode tracing (spans; tool calls; retrieval; routing decisions)
	- schema validation and structured outputs (where applicable)
	- standardized termination reasons and budgets (max steps/time/cost)
2. **Ruler layer (measurement instruments)**
	- versioned rubrics, judge prompts/models, deterministic validators
	- calibration and anchor sets
	- ruler health monitoring and change protocol
3. **State layer (the observed behavior)**
	- `StateKey` (fingerprints across C/I/E_fixed/R)
	- `StateEstimate` (metrics + CI + n; slices/regimes; drivers; observability; ruler health)
	- `StateDeltaReport` (A vs B deltas with inference method; gate-ready)
4. **Monitoring + change detection layer**
	- time-bucket state estimates
	- Stage 0 integrity checks
	- anomaly detection -> confirmation -> attribution
	- `ChangePacket` artifact for every actionable incident
5. **Optimization layer**
	- typed search space definition
	- objective/constraint policy and gate integration
	- offline screening + limited online trials (arms-only) with circuit breakers
	- leaderboard and provenance of candidate selection

## 7. Data model and contracts (normative)

### 7.1 Trace schema (episode + spans)


The trace schema must be sufficient to:

- reconstruct execution at a coarse level,
- compute slice predicates and regimes,
- compute driver metrics and observability coverage.

**Minimum required fields**

- episode id, timestamps, assignment/variant id, DeploymentKey
- inputs: token counts, language, intent (if available), context length
- routing decisions and policy versions
- tool calls: tool name, request/response schema version, latency, error code
- retrieval: query, index snapshot id/policy, top-k stats, empty flag
- termination reason and budgets (max steps/time/cost hit)
- spans for major phases (router, retrieval, tool, judge, post-processing)

### 7.2 Fingerprints (identity)


All comparisons require stable fingerprints:

- `C_fingerprint` (model/prompt/router/tool schema versions; retrieval params; decoding)
- `I_fingerprint` (dataset/traffic definition; sampling)
- `E_fingerprint_fixed` (dependency versions and policies that are identity-level)
- `R_fingerprint` (ruler version)

### 7.3 State objects


- **StateKey:** `(C_fingerprint, I_fingerprint, E_fingerprint_fixed, R_fingerprint)`
- **StateEstimate:** windowed snapshot including:
	- global + Tier-1 slice metrics with CI and n
	- regime-conditioned metrics when tools/retrieval exist
	- driver metrics (tool failures, retrieval empty, truncation, loops, schema invalid)
	- ruler health and observability coverage
- **StateDeltaReport:** controlled comparison:
	- deltas + CI + method
	- slice/regime deltas
	- driver deltas
	- mechanical verdict inputs

### 7.4 Slices and regimes


- Slices are versioned predicates over inputs/traces with tiers:
	- **Tier-1 (gated + monitored)**: small, stable, high-impact
	- **Tier-2 (diagnostic)**: broader; triage-only unless severe
	- **Tier-3 (exploratory)**: no claims until promoted and re-tested

**Rule:** for release gating, Tier-1 slices should be primarily **pre-treatment** (input-defined) where possible; post-treatment trace-defined slices are primarily for monitoring/attribution unless causal validity is addressed.

Regimes are categorical conditions (e.g., tool_health, retrieval_empty) used for conditioning and attribution.

### 7.5 Ruler contract


A ruler is a versioned measurement instrument:

- rubric spec + examples
- judge model/prompt + decoding
- validators and parsing logic
- calibration and anchor sets
- ruler health thresholds

**Rule:** ruler changes require version bump + anchor scoring; unhealthy ruler forces INCONCLUSIVE.

### 7.6 Missingness and observability


State must include:

- trace completeness rate
- label/judge availability rate
- validator coverage rate
- exclusion counters by reason
- versioned missingness policy (fail-closed vs exclude-with-counter)

## 8. Evaluation discipline (offline and online)

### 8.1 Offline evaluation (default)


- Paired evaluation on fixed inputs (higher power)
- Dev/holdout/red-team datasets with governance
- Output: `StateEstimate` + `StateDeltaReport`

### 8.2 Online evaluation (when needed)


- Randomized AB by session/user where feasible
- Switchbacks when interference exists (shared tools/caches)
- Cluster-aware inference (randomization unit vs analysis unit)

### 8.3 Decision doctrine (CI + margins)


- PASS / FAIL / INCONCLUSIVE
- Constraints and guardrails are enforced mechanically:
	- safety and policy constraints
	- tool failure and timeout constraints
	- latency/cost budgets (including tails where relevant)

## 9. Release gates (mechanical)

### 9.1 Gate policy inputs


- primary endpoints (global + Tier-1 slices)
- guardrails (safety, tool failures, schema invalid, timeouts)
- budgets (latency p95/p99, cost per task)
- ruler health and observability coverage
- contamination flags (mix shifts, regime shifts, selection effects)

### 9.2 Gate outputs


- PASS: safe to ship
- FAIL: regression or constraint violation
- INCONCLUSIVE: insufficient evidence, measurement instability, or low power

**Rule:** no C-plane change ships without a `StateDeltaReport` and passing gates.

## 10. Monitoring and change detection (discipline)


The monitoring discipline produces decision-grade ChangePackets, not just alerts.

### 10.1 Stage 0 integrity checks (mandatory)


- ruler health, observability coverage, bucket integrity

If Stage 0 fails -> Measurement/Observability incident -> INCONCLUSIVE behavioral verdict.

### 10.2 Anomaly -> confirmation -> attribution


- Stage 1: sensitive anomaly detection (EWMA/CUSUM/threshold+persistence)
- Stage 2: confirmation vs baseline window (delta + uncertainty)
- Stage 3: attribution planes-first (R -> I -> E -> C) using drivers, regimes, fingerprints

### 10.3 ChangePacket


Every actionable incident must generate a standardized ChangePacket containing:

- what changed (Tier-1 outcomes, slices, regimes)
- integrity state (ruler + observability)
- why (drivers + regime shifts + fingerprint diffs)
- recommendation (rollback/pause/investigate/re-score/re-run)
- trace exemplars for dominant slice/regime

## 11. Optimization (safe-by-construction)


Optimization is treated as constrained search, not single-metric tuning.

### 11.1 Search space typing


Define all tunable knobs, ranges, and conditional activation in a typed search space. Changes outside the declared search space are treated as "untyped" and require stricter review.

### 11.2 Constraints-first ranking


- Hard gates on constraints and Tier-1 non-inferiority
- Only then rank candidates by objective improvements

### 11.3 Multi-fidelity


- offline screening on smaller sets
- holdout confirmation
- limited online trials (arms-only) if needed

### 11.4 Circuit breakers


Any online optimization must have:

- bounded exposure,
- stop-loss rules,
- and immediate rollback paths.

## 12. Repository layout (proposed)


A workable decomposition that matches the object model:

- `docs/`
	- `foundations.md`
	- `framework-factors.md`
	- `state-definition.md`
	- `slices-definition.md`
	- `experimental-design.md`
	- `change-detection.md`
- `framework/`
	- `schemas/` (trace, state, delta, change packet, gate report)
	- `fingerprints/` (hashing utilities; canonicalization)
	- `ruler/` (rubrics, judges, validators, anchor tooling)
	- `slices/` (slice catalog; tier definitions)
	- `gates/` (policy parser; mechanical verdict evaluator)
	- `estimators/` (bootstrap, cluster inference, quantile tools)
- `runtime/`
	- `tracing/` (span wrappers and propagation)
	- `tools/` (schema-validated wrappers; standardized errors)
	- `retrieval/` (wrapper; index snapshot policy)
	- `routing/` (policy hooks; assignment logging)
- `eval/`
	- `datasets/` (dev/holdout/red-team manifests; governance)
	- `runner/` (offline runner; delta report generator)
- `monitoring/`
	- `aggregation/` (bucket jobs to produce TimeBucketStateEstimate)
	- `detectors/` (anomaly detection)
	- `packets/` (ChangePacket generator)
- `optimization/`
	- `search_space.yaml`
	- `objectives.yaml`
	- `trial_runner/`
	- `leaderboard/`

## 13. Governance and ownership

### 13.1 Owners (minimum)


- **Framework owner:** schemas, gates, state objects, adoption enforcement
- **Ruler owner:** R-plane versioning, anchor sets, calibration, judge policy
- **Slices owner:** slice catalog, Tier-1 set, promotion policy
- **Runtime/observability owner:** tracing, coverage, budgets, incident response runbooks

### 13.2 Change protocols (minimum)


- Ruler changes require:
	- version bump,
	- anchor scoring report,
	- and explicit approval
- Slice Tier-1 changes require:
	- justification (incident or coverage gap),
	- minimum-n plan,
	- and promotion via re-test
- Gate policy changes require:
	- explicit rationale,
	- retro backtest where possible,
	- and versioning

## 14. Rollout plan (milestones)

### Milestone 1 -- Instrumentation and state skeleton


- trace schema v1.3
- fingerprinting utilities (C/I/E_fixed/R)
- TimeBucketStateEstimate generator
- basic StateEstimate generation

### Milestone 2 -- Offline evaluation and delta reports


- offline paired runner
- ruler v1 (rubric + judge + validators + anchors)
- StateDeltaReport generator
- initial Tier-1 slice set and minimum-n targets

### Milestone 3 -- Gates and monitoring discipline


- mechanical gate evaluator (CI+margins)
- Stage 0 integrity gates (ruler + observability)
- anomaly detectors + ChangePacket generator
- rollback/circuit-breaker runbooks + rehearsal

### Milestone 4 -- Optimization loop


- typed search space + objectives/constraints
- multi-fidelity trial runner
- limited online trials (arms-only) with circuit breakers
- candidate leaderboard with provenance

## 15. Risks and mitigations


- **Risk: optimizing the ruler instead of the system**
  Mitigation: ruler versioning, anchors, holdouts, orthogonal validators, audits; Goodhart clause enforced.
- **Risk: too many metrics/slices causing false alarms**
  Mitigation: Tier-1 small gated set; Stage 2 confirmation; tiered alerting and cooldown; promotion policy.
- **Risk: trace volume / privacy constraints**
  Mitigation: retention tiers; redaction; "100% failures + sampled successes"; strict schema for PII fields.
- **Risk: slow iteration due to expensive evaluation**
  Mitigation: multi-fidelity eval; caching; subset runs; cheaper rulers for screening with holdout confirmation.
- **Risk: interference from shared tools/caches breaks AB validity**
  Mitigation: switchbacks; regime conditioning; explicit E_fixed/E_observed split; canary isolation where possible.

## 16. Migration / Compatibility Notes


- `tool_required` now means an **input-defined requirement label**; trace-defined execution is `tool_used`.
- `E_fixed_fingerprint` was renamed to `E_fingerprint_fixed`.
- Change detection and monitoring now use `verdict: PASS | FAIL | INCONCLUSIVE`; optional `direction: improvement | degradation` metadata replaces `confirmed_*` verdicts.

## 17. Conflict Summary (internal)


- Slice semantics conflicted (`tool_required` used as "tool happened"); resolved by separating `tool_required` (input label) vs `tool_used` (trace fact).
- Fingerprint naming conflicted (`E_fixed_fingerprint` vs `E_fingerprint_fixed`); resolved to `E_fingerprint_fixed` everywhere.
- Plane boundaries for retries/timeouts/cache/concurrency were ambiguous; resolved with explicit C vs E_fixed vs E_observed rule and override policy.
- Verdict taxonomy diverged between gates and monitoring; resolved to PASS/FAIL/INCONCLUSIVE with optional direction metadata.
- Instrumentation had two sources of truth; resolved by making `instrumentation-v1.2.md` canonical and marking legacy notes as deprecated.
- Gate safety rules were underspecified; resolved with explicit Tier-1 pre-treatment eligibility and backfill requirements.

## 18. Definition of done (for changes)


A change to prompts/models/retrieval/tool policy is "done" when:

- required trace fields are emitted and coverage is acceptable
- `StateDeltaReport` is generated under a valid design
- gates return PASS (or the decision is explicitly INCONCLUSIVE with mitigation plan)
- ruler/slice/gate versions referenced in the change log
- monitoring rules and ChangePacket formatting remain valid

## 19. Open questions


1. Exact Tier-1 slice set and minimum-n targets for the initial product domain.
2. Ruler strategy: one judge vs multi-judge; how frequently to run human audits.
3. Storage and retention specifics: which warehouse, how to enforce governance, cost constraints.
4. Provider drift sentinels: what suites, cadence, and automation level.
5. How to handle adaptive routing while preserving evaluability in the first product.

## Appendix A -- Minimal schema list (v1.3)


- Trace schema (`trace_v1.3.json`)
- StateKey schema (`state_key_v1.3.json`)
- StateEstimate schema (`state_estimate_v1.3.json`)
- StateDeltaReport schema (`state_delta_v1.3.json`)
- ChangePacket schema (`change_packet_v1.3.json`)
- GateReport schema (`gate_report_v1.3.json`)
