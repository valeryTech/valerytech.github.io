---
draft: false
toc: true
title: "Optimization v1.2 — Production Discipline for LLM / Agentic Systems"
description: "A production optimization design that screens AI configurations offline, confirms candidates on holdouts, and admits only approved options to online routing with constraints and circuit breakers."
linkTitle: "Optimization v1.2"
---
# Optimization v1.2 -- Production Discipline for LLM / Agentic Systems


**AI Systems Framework**

This document refactors and extends the existing "Optimization in LLM agentic applications" review into a **production-ready optimization discipline**:

- explicit production failure modes and controls,
- a phased approach with verifiable increments,
- decision factors (what to optimize, when to introduce more powerful methods),
- and cost/safety wrappers (sampling, multi-fidelity, gates, and change detection).

Optimization is treated as constrained, noisy, multi-objective black-box search. The methods include offline BO/DoE, multi-fidelity evaluation, DSPy/program optimization, and online bandit routing, with explicit protection against optimizing the ruler.

This v1.2 aligns with:

- Instrumentation v1.2 (envelope+details; balanced sampling; exemplars)
- Estimation v1.2 (paired/cluster-aware inference; replication; missingness and ruler health)
- Change Detection v1.2 (Stage 0-4 integrity -> detect -> confirm -> attribute -> act)
- Schema Pack v1.3 (StateEstimate/StateDelta/ChangePacket/GateReport objects)
- Governance Pack v1.0 (ruler/slice/gate policy governance)

## 0. Operational definition


Optimization is the controlled process of proposing candidate configurations \(c \in \mathcal{C}\) and selecting improvements under a target input regime \(\mathcal{D}\) while respecting hard constraints.

Optimization is "good" when:

1. Selection decisions are **repeatable** (candidates that "win" keep winning under re-runs / holdouts / canary).
2. Exploration never causes a safety/reliability incident because the system has **stop-loss** and **circuit breakers**.
3. Improvements generalize beyond the tuning set (holdout + canary confirmation).
4. The evidence explains "why this candidate is better" in terms of driver deltas and slice/regime changes (not only a scalar score).

## 1. What optimization sits on top of (dependencies)


Optimization is downstream of -- and must not bypass -- these foundations:

1. **Trace contract**: enough instrumentation to compute metrics, regimes, drivers, and slice membership.
2. **Ruler stability**: gating and selection requires a stable measurement instrument \(R_{\text{fingerprint}}\).
3. **Estimands and estimators**: uncertainty and comparability (paired deltas, cluster-aware inference).
4. **Change detection & gates**: a safety wrapper that prevents shipping "wins" that regress Tier-1 slices or constraints.

If any of the above is unstable, optimization is likely to produce **illusory improvements**.

## 2. Core objects and artifacts (repo-level interface)

### 2.1 Required artifacts (minimum viable optimization layer)


1. `search_space.yaml`
	- Parameter definitions: type, bounds, categorical values, conditional dependencies.
2. `objectives.yaml`
	- Primary endpoint(s), hard constraints, margins, confidence level, Tier-1 slices.
3. `trial_runner`
	- Executes a config on a specified input regime and produces `StateEstimate`.
4. `delta_builder`
	- Compares candidate vs baseline -> `StateDeltaReport`.
5. `gate_evaluator`
	- Produces `GateReport` (PASS/FAIL/INCONCLUSIVE).
6. `trial_registry`
	- Records trial metadata (fingerprints, dataset/window, code version), links artifacts.
7. `approved_arms_registry` (if online routing)
	- The only configs eligible for online exploration.

### 2.2 Canonical outputs (contract)


- Offline trial: `StateEstimate`, `StateDeltaReport`, `GateReport`, plus limited trace samples (bounded).
- Monitoring of optimization (online): `ChangePacket` for any confirmed degradation attributed to an optimization action.

## 3. Production failure modes (and controls)


This section is the critical addition: optimization fails in production primarily via *process* failures, not algorithm choice.

### 3.1 "Optimizing the ruler" (Goodhart on the measurement)


**Symptoms**

- strong offline gains that vanish in canary
- label distribution shifts; improvements are brittle
- candidates exploit judge quirks (formatting, verbosity, etc.)

**Controls**

- holdout set not used for proposal
- periodic audits (human or alternative ruler) on a sample
- multi-ruler confirmation for top candidates (optional but high value)
- freeze R_fingerprint during an optimization batch; re-score both candidate and baseline under a single ruler

### 3.2 Input regime mismatch (optimize for the wrong \(\mathcal{D}\))


**Symptoms**

- offline set improvements but online regressions in key user groups
- Tier-1 slices degrade while global improves

**Controls**

- Tier-1 slices and regimes are gated, not optional
- post-stratification or weighted reporting when evaluation sets are skewed
- ensure I_fingerprint and tier1 slice set id are explicit in trials

### 3.3 Hidden E-plane interference (tools/RAG drift)


**Symptoms**

- candidate "wins" only because tools were healthier during its run
- regression appears after deployment due to different tool latency/error rates

**Controls**

- record E_observed summary per trial; compare regimes/tool health
- use paired offline evaluation where possible (same environment)
- canary confirmation with change detection and automatic rollback

### 3.4 Sampling bias (evidence missing where it matters)


**Symptoms**

- the only missing traces are the failures
- one candidate has less detail due to sampling differences, leading to unbalanced diagnostics

**Controls**

- envelope always-on
- "important episodes" always captured in detail (failures, Tier-1 slices, degraded regimes)
- balanced stratified sampling by `variant × Tier-1 slice × regime`

### 3.5 Multiple comparisons and cherry-picking


**Symptoms**

- selection based on the single best run
- frequent "winners" that never replicate

**Controls**

- require replication: re-run top candidates; promote only if stable
- use sequential testing discipline (pre-declare selection criteria)
- keep a "leaderboard" with uncertainty and a "wins required" rule (e.g., win 2/3 independent runs)

### 3.6 Unsafe online exploration (regressions caused by the optimizer)


**Symptoms**

- online routing shifts traffic to a degraded arm, violating safety/reliability constraints

**Controls**

- online exploration limited to **approved arms** that passed offline + holdout
- circuit breakers and stop-loss rules:
	- immediate disablement on safety spikes
	- disablement on sustained Tier-1 regressions or constraint breaches
- change detection must attribute and close the loop

### 3.7 "Local optimum" traps in structured spaces


**Symptoms**

- BO/TPE gets stuck; prompt/policy interactions dominate

**Controls**

- add structured families and program-level optimization only after knob tuning is stable
- constrain prompt changes to vetted templates in early phases
- consider evolutionary/program compilation approaches for high-dimensional discrete spaces (DSPy-like), but only with strong measurement discipline

## 4. Optimization patterns (how to frame objectives)


Objectives are vectors with constraints.

Production practice benefits from choosing one of three "decision frames" per program:

### 4.1 Constrained optimization (recommended for releases)


- Maximize primary quality subject to hard constraints (safety, reliability, budgets) and Tier-1 non-inferiority.

### 4.2 Pareto frontier (recommended for design space exploration)


- Keep non-dominated candidates across (quality, cost, latency) among constraint-satisfying options.
- Decide later with product policy (not inside the optimizer).

### 4.3 Scalarization (use sparingly)


- Weighted sum scores are fragile because weights become hidden product policy.
- If used, weights must be governed and versioned.

## 5. Offline optimization (primary loop)

### 5.1 Why offline first


Offline optimization provides:

- paired comparisons (strongest variance reduction),
- reproducibility,
- faster iteration at bounded risk.

### 5.2 Default offline workflow (trial lifecycle)


1. Choose a baseline (current best shipped config; fixed C_fingerprint).
2. Propose candidate \(c\).
3. Run trial on `eval_core` (paired inputs if possible).
4. Build delta vs baseline; apply CI+margins gating.
5. If candidate passes constraints:
	- add to Pareto/leaderboard,
	- optionally re-run for replication,
	- promote to holdout confirmation.
6. If holdout confirms: candidate becomes "promotable" (eligible for canary or arm registry).

### 5.3 Algorithm choices by search-space type


- **Knobs (low-dim continuous/mixed):** random + DoE -> TPE/BO (default)
- **Conditional mixed spaces:** TPE often simplest and robust
- **High-dimensional discrete templates:** constrain the family; use evolutionary search or program optimization (DSPy-like) only when measurement is stable
- **Expensive evaluation:** multi-fidelity scheduling (Hyperband/ASHA) to screen cheaply then promote

The key production rule for choosing among these methods is: **start with the simplest method that gives useful signal**.

## 6. Multi-fidelity and cost controls (make search affordable)


Cost is dominated by:

- judge calls,
- replicated runs,
- large slice matrices.

### 6.1 Safe multi-fidelity axes


1. **Dataset size:** 20-30% stratified screen -> full eval
2. **Ruler cost:** cheap judge for screen -> strict judge for promotion
3. **Replication:** K=1 screen -> K>1 confirm (for stochastic-sensitive candidates)
4. **Timeout budgets:** tighter budgets for early screening (only if it doesn't change the target estimand)

### 6.2 Promotion rules (minimum)


A candidate can be promoted to higher fidelity only if:

- it does not violate any hard constraints at the current fidelity, and
- it shows promising improvement with uncertainty that is not obviously noise.

### 6.3 "Never do" list


- Never use the holdout set to propose candidates.
- Never change the ruler mid-batch without re-scoring.
- Never select on a single run if the metric is noisy.

## 7. Replication and stochasticity (when K>1 is warranted)


Replication is expensive; use it selectively.

### 7.1 Use replication when


- selection is unstable (winner flips across runs),
- changes affect stochastic decisions (routing, tool selection, retrieval thresholds),
- consistency is a product goal (not only mean quality),
- judge noise is a dominant uncertainty source.

### 7.2 Replication protocol (recommended)


- Run K replicates per input for a **subset** stratified across Tier-1 slices.
- Aggregate within-input, bootstrap over inputs (avoid treating replicates as independent units).

## 8. Online optimization (routing as constrained contextual bandits)


The most production-safe online optimization v1 is **routing among approved arms** rather than mutating prompts/policies on the fly.

### 8.1 Arm admission policy


An arm is eligible for exploration only if:

- passes offline constraints on core eval
- confirms on holdout
- has an explicit C_fingerprint and code fingerprint
- has monitoring and rollback hooks enabled

### 8.2 Context features (keep cheap and stable)


- intent/domain bucket
- language bucket
- input length bucket
- tool_required / retrieval_expected flags
- E_observed health regime (optional)

### 8.3 Reward and constraint handling


- Keep reward simple and measurable quickly (proxy success + cost/latency penalties).
- Enforce hard constraints outside the reward with circuit breakers.

### 8.4 Safety wrapper (mandatory)


- monitoring detects anomalies (Stage 1), confirms (Stage 2), attributes (Stage 3)
- on confirmed Tier-1 regression or constraint breach:
	- reduce arm allocation to near-zero immediately
	- generate ChangePacket and open an optimization incident

## 9. Decision factors: what to add next (and when)

### 9.1 When to move beyond random/DoE


- estimands are stable and the ruler is trustworthy,
- trial cost is high enough that sample efficiency matters,
- variance is understood (signal can be distinguished from noise).

### 9.2 When to introduce multi-fidelity


- full-fidelity trials are too expensive to run many,
- early screening correlates with final outcomes sufficiently,
- fidelity levels can be versioned and kept consistent within a comparison.

### 9.3 When to introduce structure optimization (prompt/policy graphs)


- knob tuning has plateaued,
- failure modes are dominated by module interaction effects,
- the search space can be constrained (template family) while preserving interpretability.

### 9.4 When to introduce online bandits


- at least 2-5 approved arms are available,
- strong monitoring and rollback are available,
- limited exploration traffic is tolerable.

### 9.5 When to consider training/alignment loops


- optimization of prompts/configs saturates,
- error modes are representational (model lacks capability),
- a separate governed training loop can be built with its own evaluation, holdout, and safety gates.

## 10. Governance and safety for optimization


Optimization is a change process; it must be governed like any other.

### 10.1 Required version references (always)


Every trial and arm must record:

- C/I/E_fixed/R fingerprints
- code fingerprint
- objective policy id/version
- slice catalog id/version
- ruler version id/version

### 10.2 Optimization incident classification (recommended)


- **Measurement incident:** ruler drift or missingness invalidates conclusions
- **Selection incident:** candidate chosen but fails replication/holdout
- **Production incident:** online exploration caused Tier-1 regression or constraint breach
- **Interference incident:** E-plane drift confounded results

Each incident should yield:

- a ChangePacket,
- a prevention action (new driver metric, new slice, improved integrity gate, or tightened admission rules).

## 11. Phased adoption plan (start small, verifiable increments)

### Phase 0 -- Make optimization measurable (prerequisites)


**Deliver**

- stable trial runner that produces StateEstimate and StateDeltaReport
- baseline run reproducibility

**Verify**

- reruns are consistent within expected uncertainty

### Phase 1 -- Knob tuning (offline)


**Deliver**

- random/DoE search for continuous knobs
- CI+margins gating + Pareto/leaderboard

**Verify**

- top candidates replicate; holdout confirms at least occasionally

### Phase 2 -- Multi-fidelity


**Deliver**

- stratified small-set screening + promotion
- cheap ruler or reduced replication for screen

**Verify**

- screen correlates with full eval enough to save cost without losing winners

### Phase 3 -- Structured search (templates / program optimization)


**Deliver**

- constrained template families (prompt ids as discrete)
- optional DSPy-like program optimization for LM pipelines

**Verify**

- improvements persist; no large regressions in Tier-1 slices

### Phase 4 -- Online routing optimization (bandits)


**Deliver**

- approved arms registry
- constrained bandit router + monitoring + circuit breakers

**Verify**

- exploration does not increase incident rate; arms can be disabled safely

### Phase 5 -- Expand objectives and policies (optional)


**Deliver**

- richer multi-objective policy or new constraints
- governance updates + backtests

**Verify**

- alert volume and decision stability remain acceptable

## Appendix A -- Minimal templates

### A.1 Trial proposal (template)


- candidate id
- change summary (what knobs/structures change)
- expected impact (metrics/slices/regimes)
- cost estimate (trial budget)
- fidelity plan (screen -> full -> holdout)
- rollback / rejection conditions

### A.2 Arm admission (template)


- offline pass evidence (core + holdout)
- C_fingerprint and code digest
- monitoring hooks enabled and verified
- canary plan and stop-loss thresholds

### A.3 Optimization postmortem (template)


- incident class (measurement/selection/production/interference)
- what happened (ChangePacket link)
- why it happened (plane attribution)
- prevention changes (new gate, slice, integrity check, policy)

## Appendix B -- Method scope and production controls


The systems view comprises:

- objective vector + constraints framing,
- offline methods (random/DoE, BO, multi-fidelity, evolutionary, program optimization),
- online methods (contextual bandits),
- and the Goodhart warning ("optimize the ruler").

The production controls include:

- production failure modes and controls,
- explicit artifact contracts and governance requirements,
- phased adoption with verification criteria,
- decision factors for introducing higher-cost methods,
- and a mandatory safety wrapper (gates + change detection + circuit breakers).
