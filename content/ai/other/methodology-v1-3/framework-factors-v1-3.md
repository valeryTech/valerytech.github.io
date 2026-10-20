---
draft: false
toc: true
title: "Framework Factors v1.3 (Operating Model for Failure Drivers and Required Controls)"
description: "The revised failure-driver operating model adds behavioral equivalence, hidden-state instability, and product experience to risk-tiered reliability controls, with explicit tracing, recovery, ownership, and release requirements."
linkTitle: "Framework Factors v1.3"
---
## 1. Why AI systems need a different reliability framework


Traditional software tests usually assume deterministic behavior, clear expected outputs, and localized failure modes. LLM-based systems often have none of those properties at the same time.

### 1.1 Probabilistic behavior and behavioral instability


AI systems can vary across repeated runs and across semantically minor variations of the same task.

Two distinct problems matter:

- **True non-determinism:** the same visible scenario produces materially different behavior across repeated runs.
- **Behavioral fragility:** semantically similar scenarios produce materially different behavior when they should not.

The practical question is not "did the system emit identical text?" It is "did the system preserve acceptable behavior?"

### 1.2 Non-exact correctness


Many AI tasks do not have one exact right string. Multiple outputs may be acceptable, but only within task-specific limits.

Examples:

- different wording may be acceptable
- different escalation decision is usually not
- different tool path may be acceptable only if outcome and safety are preserved
- different external action is often a critical difference

### 1.3 Context and knowledge dependence


Behavior depends on:

- pretraining knowledge
- retrieved context
- tool outputs
- data freshness
- conversation history
- policy state

This means factuality and usefulness depend on what evidence was available, not only on prompt quality.

### 1.4 Pipeline and agentic composition


Most production AI systems are not one model call. They are pipelines with retrieval, ranking, prompt assembly, generation, parsing, tools, action execution, and policy logic.

This creates two evaluation needs:

- component-level evaluation to localize failure
- episode-level evaluation to judge end-to-end success

### 1.5 Hidden regressions and operational drift


Small changes can cause large regressions:

- prompt edits
- model swaps
- retrieval changes
- tool schema changes
- policy updates
- source-data refreshes

Sometimes the user-visible input looks the same while the underlying system state changed. That is not pure randomness; it is an environment or configuration change problem.

## 2. Operating model

### 2.1 Operating frame


This document supports prevention, detection, recovery, and release proof, but it is not the canonical home for that frame.

For the primary operator-facing definition of `Prevent / Detect / Recover / Prove`, see `methodology-principles.md`. Here, the focus is the failure drivers and the controls they imply.

### 2.2 C / I / E / R / O planes


- **C** configuration: what the team changes intentionally
- **I** input regime: what the system faces
- **E** environment: dependencies, tools, providers, and infrastructure conditions
- **R** ruler: how the system is measured
- **O** observed behavior: metrics, uncertainty, and driver signals

Rule: do not attribute an O-plane change to C-plane improvement unless I, E, and R are controlled or explicitly conditioned.

### 2.3 Episode definition


An **episode** is the unit of evaluation and observability: one user goal attempt from start condition to terminal state.

At minimum, an episode should include:

- initial user intent
- input context
- prompt and config versions
- model calls
- retrieval calls
- tool calls
- intermediate failures
- retries and repairs
- human review transitions
- final output
- termination reason
- latency
- cost
- user-visible outcome

Common terminal states:

| Terminal state | Meaning |
|---|---|
| `success` | user goal completed |
| `model_failure` | wrong, unsafe, ungrounded, or incomplete output |
| `tool_failure` | required dependency failed |
| `timeout` | exceeded latency or step budget |
| `escalated` | handed to human review |
| `abandoned` | user dropped before resolution |
| `blocked_by_policy` | intentionally refused or stopped |

### 2.4 Behavioral equivalence


Evaluation should target intended outcome, not exact text.

Behavioral equivalence criteria should classify differences as:

- **Acceptable variation:** wording, formatting, or explanation differences that preserve the intended outcome.
- **Material variation:** differences that change classification, escalation, grounding quality, tool use, or user commitment.
- **Critical variation:** differences that change external action, policy posture, authorization boundary, or high-stakes decision.

These criteria must be task-specific and should be defined in rulers, rubrics, and deterministic validators where possible.

### 2.5 Minimum trace requirements


Every evaluated episode should capture, at minimum:

- input
- prompt and config versions
- model version
- retrieved documents or chunks
- tool calls and responses
- routing or policy decisions
- retry and repair events
- final output
- scores and labels
- human judgments where applicable
- latency
- cost
- terminal state

### 2.6 Component-level and episode-level attribution


A failed episode should be diagnosable across:

- ambiguous or adversarial input
- retrieval miss or ranking error
- prompt assembly or context omission
- model ignoring available evidence
- parser or schema failure
- tool failure or tool misuse
- policy override
- timeout or budget termination

Rule: end-to-end success metrics are necessary, but they are insufficient without traceable component attribution.

### 2.7 Fast diagnostics


| Symptom | Likely plane | First diagnostic |
|---|---|---|
| All variants move together | `R` or `E` | Check ruler drift and provider or tool incidents |
| Only long-context tasks regress | `I` or `Y3` | Check context-bucket metrics and truncation |
| Offline improves, online stays flat | `S2` or `S3` | Check proxy validity and experiment design |
| Success rises but timeout rises too | `M4` or `Y7` | Check missingness and budget metrics |
| One workflow fails after tool change | `E` or `G4` | Check tool contracts and response format drift |

### 2.8 Core artifacts


The framework assumes the following named artifacts:

- `ExperimentSpec` and `ExperimentReport`
- `StateEstimate`
- `StateDeltaReport`
- `RulerVersion`
- slice catalog with Tier-1, Tier-2, and Tier-3 slices
- regime labels such as `tool_health` and `retrieval_empty`
- a mechanical gate evaluator that returns PASS, FAIL, or INCONCLUSIVE

This document explains why those objects are required. Their schemas and governance live in the adjacent docs.

## 3. Framework maturity levels


Adopt the framework proportionally. Higher risk and scale require higher maturity.

| Level | Name | Required capabilities |
|---|---|---|
| 0 | Ad hoc | Manual checks, anecdotal evals, weak tracing |
| 1 | Observable | Trace IDs, config fingerprints, success or failure counters, latency and cost metrics |
| 2 | Evaluated | Versioned evals, slice definitions, holdouts, deterministic validators |
| 3 | Gated | `ExperimentSpec`, `StateEstimate`, `StateDeltaReport`, CI plus margins gates |
| 4 | Governed | `RulerVersion`, owner protocols, incident-to-test loop, builder/grader separation |
| 5 | Adaptive but controlled | Evaluation windows, policy versioning, off-policy logging, adaptive-system governance |

Practical interpretation:

- Level 1 stops the team from flying blind.
- Level 2 stops the team from shipping on anecdotes.
- Level 3 makes release decisions mechanical.
- Level 4 makes quality durable across teams.
- Level 5 allows adaptive behavior without destroying evaluability.

## 4. Release-risk tiers


Not every prompt change needs the full apparatus. Required controls should scale with release risk.

| Tier | Change type | Examples | Required controls |
|---|---|---|---|
| Low | Cosmetic or non-behavioral | wording, formatting, UI copy | smoke tests, schema checks, trace sampling |
| Medium | Local behavior change | prompt changes, retrieval prompt, tool instruction update | offline eval, Tier-1 slices, `StateDeltaReport`, rollback note |
| High | Core behavior change | model swap, router change, new tool, policy change | full `ExperimentSpec`, holdout, CI gates, canary, rollback path, fallback route, monitoring window |
| Critical | High-stakes or autonomous action | financial, legal, medical, external side effects | independent audit, HITL policy, red-team, formal approval, kill switch, degraded mode, owner on call |

Minimum interpretation:

- Low-risk releases still require observability.
- Medium-risk releases require comparison artifacts, not screenshots and anecdotes.
- High-risk releases require explicit recovery planning, not just offline wins.
- Critical releases require human accountability and policy control.

## 5. The five risks to address first


For most production LLM systems, these are the first reliability risks to control:

1. Offline metrics do not equal user value.
2. Judge or ruler drift makes deltas uninterpretable.
3. Retrieval and tools dominate production failures.
4. Tail latency and tail cost can invalidate quality gains.
5. Global wins can hide critical slice regressions.

| Priority risk | Related factors |
|---|---|
| Proxy mismatch | `S2`, `M0`, `M3`, `O1` |
| Ruler drift | `M1`, `M2`, `M5` |
| Coupled dependencies | `Y4`, `Y5`, `Y8`, `G4` |
| Budget failure | `Y6`, `Y7`, `O1` |
| Worst-slice harm | `S5`, `O4`, `G3`, `UX1` |

If a team only has bandwidth for a first pass, start there.

## 6. Failure drivers and required controls


Each factor is written in an operational format:

1. Why this matters
2. Failure pattern
3. Observable signals
4. Required controls
5. Validation method
6. Primary owner

## A) Statistical foundations

### S1 -- Inputs are distributed; production differs from offline


**Why this matters**

Offline datasets never match production traffic exactly. Input mix drifts over time and differs by slice.

**Failure pattern**

An offline win fails to transfer because intent mix, language, context length, or adversarial prevalence changed.

**Observable signals**

Online success diverges from offline expectations. Performance regresses in slices that grew in frequency.

**Required controls**

`I_fingerprint`, input-mix summaries, stratified evaluation, reweighting policy, and representative Tier-1 slices.

**Validation method**

Compare offline weighted estimates to online results and periodically re-check production mix assumptions.

**Primary owner**

Eval lead

### S2 -- Offline metrics are proxies; proxy mismatch is default


**Why this matters**

Offline metrics approximate user value; they do not define it.

**Failure pattern**

The system improves on paper while user satisfaction, resolution rate, or downstream task completion stays flat or degrades.

**Observable signals**

Judge scores rise but user outcomes do not. Outputs get nicer without becoming more correct.

**Required controls**

Explicit estimands in `ExperimentSpec`, multi-channel measurement, product-linked endpoints, holdouts, red-team coverage, and guardrails tied to downstream cost.

**Validation method**

Correlate offline endpoints with online outcomes across releases and run proxy stress tests.

**Primary owner**

Tech lead

### S3 -- Confounding is the default online


**Why this matters**

Time, traffic mix, environment incidents, and selection effects routinely create false stories about causality.

**Failure pattern**

Teams ship or roll back based on spurious correlations.

**Observable signals**

Metric shifts align with external incidents or disappear under randomized A/B or switchback designs.

**Required controls**

Randomized experiments where possible, regime conditioning, and explicit plane checks before attributing changes to configuration.

**Validation method**

Reproduce key claims under randomized designs and use retrospective causal diagnostics only as support, not proof.

**Primary owner**

Experiment owner

### S4 -- Variance is high; small deltas are often noise


**Why this matters**

LLM outputs, traffic composition, and dependency behavior are noisy.

**Failure pattern**

Teams chase non-replicable wins and build unstable systems.

**Observable signals**

Frequent flip-flops, wide confidence intervals, and unstable judge scores.

**Required controls**

Uncertainty in every `StateEstimate`, paired offline designs, cluster-aware online inference, and PASS or FAIL or INCONCLUSIVE doctrine.

**Validation method**

Require replication on a stable holdout and track replication rate of past wins.

**Primary owner**

Eval lead

### S5 -- Multiple comparisons inflate false discovery


**Why this matters**

Many metrics across many slices create false positives, especially with repeated peeking.

**Failure pattern**

Teams react to statistical artifacts and erode gate credibility.

**Observable signals**

Contradictory slice findings, frequent non-replicating alerts, and diagnostic slices driving shipping decisions.

**Required controls**

Tiered slice governance, predeclared endpoints, small Tier-1 gate set, and optional multiple-testing control for diagnostics.

**Validation method**

Track false alert rates and measure whether promoted Tier-2 or Tier-3 findings replicate as Tier-1 gates.

**Primary owner**

Slice owner

## B) Measurement foundations

### M0 -- Correctness is task-specific and often non-exact


**Why this matters**

Many AI tasks have multiple acceptable outputs, so correctness cannot be reduced to exact-match strings.

**Failure pattern**

Teams either over-constrain evaluation with brittle exact matching or under-constrain it with vague judge scores.

**Observable signals**

Good outputs fail exact checks, noisy judge scores dominate decisions, or teams disagree on whether semantically equivalent behavior counts as correct.

**Required controls**

Task-specific rubrics, behavioral equivalence criteria, deterministic validators for hard constraints, and human calibration for subjective dimensions.

**Validation method**

Audit whether equivalent outputs receive consistent scores and whether material differences are reliably separated from acceptable variation.

**Primary owner**

Measurement owner

### M1 -- Labels are latent or noisy; judge scores are not ground truth


**Why this matters**

Many important properties such as helpfulness, groundedness, safety, and usefulness are measured through imperfect instruments.

**Failure pattern**

Judge movement is treated as truth and the team ships regressions or illusory gains.

**Observable signals**

Judge disagreement, divergence from validators or human review, and gains that reverse under a slightly different judge prompt.

**Required controls**

`R_fingerprint`, ruler-health fields, double scoring for critical endpoints, deterministic validators for hard rules, and explicit equivalence criteria for acceptable variation.

**Validation method**

Maintain anchor sets and run periodic human calibration on critical slices.

**Primary owner**

Measurement owner

### M2 -- Ruler drift exists


**Why this matters**

Judge models, prompts, validators, and guidance change over time.

**Failure pattern**

Deltas become uninterpretable because the ruler moved.

**Observable signals**

Global shifts across variants, anchor-set movement without deployment change, and judge error spikes after provider updates.

**Required controls**

`RulerVersion`, frozen ruler per experiment, re-score policy, drift thresholds, and unhealthy-ruler defaults to INCONCLUSIVE.

**Validation method**

Run A/A checks across time and report ruler drift events explicitly.

**Primary owner**

Measurement owner

### M3 -- Goodhart pressure makes measurement gameable


**Why this matters**

Any metric used for optimization becomes a target.

**Failure pattern**

Outputs learn judge cues rather than user value, grounding, or correctness.

**Observable signals**

Style inflation, rubric keywording, brittle refusal patterns, or judge-only improvements without validator or audit support.

**Required controls**

Validators plus second-judge or human audits, true holdouts, growing red-team sets, and anti-style-inflation checks against task-specific quality criteria.

**Validation method**

Track dev versus holdout gap and audit a fixed sample on every release tier that uses judge-based selection.

**Primary owner**

Measurement owner

### M4 -- Missingness or censoring biases results unless policy is explicit


**Why this matters**

Timeouts, schema-invalid outputs, tool failures, and judge errors are not random omissions.

**Failure pattern**

Apparent improvements come from excluding hard cases or hiding operational failures.

**Observable signals**

Higher exclusion rates in the winning variant, better latency with rising timeouts, or higher success with worsening tool failures.

**Required controls**

Versioned missingness policy, fail-closed defaults for hard failures, observability coverage fields, and explicit timeout or invalid counters.

**Validation method**

Report both fail-closed and exclude-with-counter views for diagnostics and gate observability regressions.

**Primary owner**

Eval lead

### M5 -- Inter-rater reliability and calibration are required


**Why this matters**

Without calibration, the same score means different things to different evaluators over time.

**Failure pattern**

Launch and rollback decisions become political rather than empirical.

**Observable signals**

High evaluator variance, incompatible rubrics across teams, and repeated arguments about what counts as success.

**Required controls**

Calibration sets, anchors, ruler governance, written rubrics with examples, explicit hard-constraint validators, and regular ruler-health review cadence.

**Validation method**

Track inter-rater agreement and confirm rubric updates reduce disagreement on ambiguous cases.

**Primary owner**

Measurement owner

## C) Systems foundations

### Y1 -- Stochasticity is intrinsic


**Why this matters**

Sampling, retrieval variability, tool timing, and concurrency make execution nondeterministic.

**Failure pattern**

Single-run evaluation and anecdotal debugging dominate decisions.

**Observable signals**

Flaky tests, non-reproducible bugs, and run-to-run variance for the same input.

**Required controls**

Deterministic decode where possible or replicated offline runs, repeated-run evaluation for critical paths, trace instrumentation, replay harnesses, and distribution-oriented state objects.

**Validation method**

Run A/A experiments with replicated evaluations and confirm gate decisions are stable under re-runs.

**Primary owner**

Runtime owner

### Y2 -- Prompt sensitivity and schema brittleness create discontinuities


**Why this matters**

Small prompt or policy changes can create large behavior shifts, especially in structured outputs and tool calls.

**Failure pattern**

Minor edits trigger schema-invalid spikes, tool-call failures, or materially different behavior on semantically similar inputs.

**Observable signals**

Sharp jumps in schema-invalid rate, missing required tool fields, latency increases from retries or repairs, or escalation flips on equivalent cases.

**Required controls**

Output and tool contracts, validators, driver metrics for invalids and retries, Tier-1 schema-sensitive slices, semantic-variation test sets, and canary releases.

**Validation method**

Run schema and tool-call regression suites, semantic-variation suites, and fault-inject malformed tool responses.

**Primary owner**

AI system owner

### Y3 -- Context-length regimes change behavior qualitatively


**Why this matters**

Short and long contexts behave differently, and truncation can create non-linear degradation.

**Failure pattern**

Systems pass short-prompt evals and fail on realistic long conversations or large documents.

**Observable signals**

Success drops beyond token thresholds, truncation rises, and hallucination increases in long-context episodes.

**Required controls**

Long-context Tier-1 slices, truncation metrics, context-budget reporting, and regime buckets by context length.

**Validation method**

Run stress suites across context buckets and monitor production context-length drift.

**Primary owner**

AI system owner

### Y4 -- Retrieval is a coupled subsystem; empty or noisy retrieval is common


**Why this matters**

RAG quality depends on index health, query formulation, corpus quality, and freshness.

**Failure pattern**

The system looks grounded in the lab and fails in production where retrieval is stale, empty, or noisy.

**Observable signals**

`retrieval_empty_rate` rises, citation correctness varies, or latency rises from retrieval retries.

**Required controls**

Retrieval snapshot policy, retrieval regime labels, driver metrics, evidence validators, and empty or noisy retrieval fault injection.

**Validation method**

Evaluate separately for retrieval-empty and retrieval-nonempty cases and run periodic corpus coverage audits.

**Primary owner**

Retrieval owner

**Grounding failure modes to track**

- unsupported answer
- invented citation
- stale evidence
- retrieved evidence ignored
- model prior overriding approved context
- mixed supported and unsupported claims
- citation present but not supportive

### Y5 -- Tools are a coupled subsystem; tool health regimes dominate performance


**Why this matters**

Tool availability, latency, rate limits, and response quality often explain more production variance than model choice.

**Failure pattern**

A seemingly better agent fails more under tool degradation, misuses tools, or creates cascading retries and cost explosions.

**Observable signals**

Performance collapses when `tool_health=degraded`, retry rate rises, latency tails spike with queueing, or tool selection changes for non-task reasons.

**Required controls**

`E_fixed` versus observed-environment split, tool driver metrics, switchbacks for shared-tool interference, circuit breakers, fallback policy, least-privilege contracts, and recovery paths for degraded tools.

**Validation method**

Fault-inject timeouts and rate limits and require graceful degradation in offline and online reports.

**Primary owner**

Platform owner

### Y6 -- Long-horizon agents compound errors; loops and drift arise


**Why this matters**

Small per-step errors compound across multi-step agent loops.

**Failure pattern**

Rare loop failures create severe latency, cost, and safety risk.

**Observable signals**

Higher `steps_p95`, rising loop rate, timeout termination, repeated tool-call patterns, or premature-stop incidents.

**Required controls**

Trajectory state, loop detectors, max-step budgets, termination-reason tracking, long-horizon slices, escalation paths, and explicit recovery handling after tool failure.

**Validation method**

Run synthetic long-horizon tasks with known termination and add loop tests from incidents.

**Primary owner**

AI system owner

**Common agent process metrics**

- tool selection accuracy
- tool argument validity
- step count
- retry depth
- loop rate
- premature stop rate
- recovery success rate
- termination reason
- action safety violations
- cost per successful episode

### Y7 -- Latency and cost tails matter as much as means; budgets are constraints


**Why this matters**

User experience and operating viability are driven by p95 or p99 outcomes, not just averages.

**Failure pattern**

Quality improves while latency, timeouts, or cost per successful episode make the system unusable.

**Observable signals**

Tail latency rises, timeout rate increases, `success@budget` regresses, or retries correlate with cost spikes.

**Required controls**

Budget constraints in gate policy, quantile inference, regime-conditioned reporting, driver metrics for retries, loops, tool latency, and fallback behavior when budgets are exceeded.

**Validation method**

Track tail distributions per release, measure cost per successful episode, and run load or degraded-tool tests against budget limits.

**Primary owner**

Runtime owner

### Y8 -- Upstream provider non-stationarity changes behavior without code changes


**Why this matters**

Providers can silently change behavior, latency, pricing, and safety layers.

**Failure pattern**

Sudden regressions are misattributed to local configuration changes.

**Observable signals**

Global metric shifts across all variants, ruler-health movement, or tool-call pattern changes without C-plane changes.

**Required controls**

Provider incident flags, anchor-based monitoring, sentinel A/A suites, explicit fallback or alternate-route options, and post-release monitoring windows for provider-sensitive changes.

**Validation method**

Run fixed sentinel suites on a regular cadence and correlate shifts with provider events where possible.

**Primary owner**

Runtime owner

### Y9 -- Operational instability is distinct from stochasticity


**Why this matters**

The same user-visible input can produce different behavior because hidden system state changed, not because the model is inherently random.

**Failure pattern**

Teams treat environment or data drift as randomness and miss the actual cause of regressions.

**Observable signals**

Behavior changes after model upgrades, retrieval-index refreshes, tool-response changes, policy updates, or data-state changes even when prompts look identical.

**Required controls**

Explicit versioning of model, prompt, tools, retrieval, policy, and data state; comparability checks across full system state; and regression suites tied to controlled environment changes.

**Validation method**

Run targeted regression suites after model, retrieval, tool, data, or policy changes and verify that hidden-state changes are represented in fingerprints or observed regimes.

**Primary owner**

Runtime owner

## D) Optimization foundations

### O1 -- Optimization is constrained multi-objective


**Why this matters**

Teams optimize for quality, safety, groundedness, latency, cost, and experience at the same time, under hard constraints.

**Failure pattern**

Single-metric tuning produces unacceptable regressions elsewhere.

**Observable signals**

Success rises while safety, cost, latency, or tool-failure constraints worsen.

**Required controls**

Explicit objectives versus constraints, slice-aware and regime-aware gates, composite metrics when useful, and mechanical promotion logic.

**Validation method**

Require every release report to include constraint metrics and stop-ship violations.

**Primary owner**

Tech lead

### O2 -- Search-space typing is necessary


**Why this matters**

Attribution fails when too many knobs across too many planes change at once.

**Failure pattern**

Teams cannot explain regressions or reproduce wins.

**Observable signals**

Many knobs change per release, root cause is unclear, and offline results do not transfer cleanly online.

**Required controls**

Typed search space, plane fingerprints in experiment artifacts, and controlled diffs through `StateDeltaReport`.

**Validation method**

Audit releases for change breadth and enforce narrow experiments on critical paths.

**Primary owner**

Experiment owner

### O3 -- Overfitting applies to prompts, routers, and judges; holdouts are mandatory


**Why this matters**

Prompt and routing optimization overfit just like model training.

**Failure pattern**

Wins on dev sets disappear on holdouts or in production.

**Observable signals**

Large dev-versus-holdout gaps, regressions in unseen domains, or judge-only gains with no validator support.

**Required controls**

Dev or holdout or red-team dataset governance, holdout gates, ruler governance, replication before promotion, and semantic-variation coverage for high-risk flows.

**Validation method**

Track generalization gap and require stable holdout performance across repeated runs.

**Primary owner**

Eval lead

### O4 -- Local improvements can harm worst-slice or rare but critical regimes


**Why this matters**

Mean optimization hides harm to high-value, high-risk, or rare cases.

**Failure pattern**

A global win ships and still causes an incident.

**Observable signals**

Global metrics improve while Tier-1 slices regress, degraded regimes collapse, or experience quality degrades on sensitive paths.

**Required controls**

Tier-1 slices for high-impact regimes, non-inferiority margins on slices, regime-conditioned gates, and incident-to-slice promotion.

**Validation method**

Compare incident rates by slice over time and confirm Tier-1 coverage matches incident root causes.

**Primary owner**

Tech lead

### O5 -- Adaptive systems can destroy evaluability without discipline


**Why this matters**

Routers and bandits change policy over time and can create nonstationary traffic and selection bias.

**Failure pattern**

The team loses comparability and cannot tell whether performance changed or the system simply avoided hard cases.

**Observable signals**

Variant traffic mix drifts, assignment logging is incomplete, and hard-case slices become underrepresented.

**Required controls**

Assignment and policy-version logging, gated arms, fixed-policy evaluation windows, and adaptation discipline with proper off-policy data.

**Validation method**

Run periodic fixed-policy windows and verify that hard-case slices are not silently filtered out.

**Primary owner**

Runtime owner

## E) Organizational foundations

### G1 -- Builder/grader separation is required


**Why this matters**

The team shipping the feature has incentives to believe its own eval story.

**Failure pattern**

Evaluation overfits to desired outcomes and true quality stagnates.

**Observable signals**

Rubrics change alongside desired wins, independent audits are missing, and gains do not replicate.

**Required controls**

Separate ownership between builders and measurement, ruler change protocol, and mechanical gates independent of narrative interpretation.

**Validation method**

Audit ruler changes for independent review and compare internal metrics with audit outcomes.

**Primary owner**

Framework owner

### G2 -- State, ruler, and slice governance require owners and protocols


**Why this matters**

Without ownership, artifacts drift and comparability breaks across teams.

**Failure pattern**

Multiple conflicting definitions of success, slices, and state objects appear.

**Observable signals**

Competing rubrics, ambiguous source-of-truth artifacts, and repeated disputes about definitions.

**Required controls**

Named owners, versioned artifacts, explicit change protocols, and recurring state or ruler or slice review cadence.

**Validation method**

Track unversioned changes and time-to-resolution for evaluation disputes.

**Primary owner**

Framework owner

### G3 -- Incident-to-slice or test feedback loops are required for reliability growth


**Why this matters**

Reliability improves when incidents become governed tests, slices, and monitors.

**Failure pattern**

The same incident classes recur because learning stays local to the postmortem.

**Observable signals**

Repeated root causes, stagnant red-team coverage, and postmortems that do not change evaluation coverage.

**Required controls**

Incident-to-slice promotion policy, red-team dataset growth, and monitors that reflect incident signatures.

**Validation method**

Track recurrence of incident classes and growth of red-team and Tier-1 coverage over time.

**Primary owner**

Tech lead

### G4 -- Cross-team dependencies require explicit contracts


**Why this matters**

LLM systems depend on tools, infra, policy, and data teams; quality is bounded by the weakest dependency.

**Failure pattern**

Schema changes, rate-limit shifts, or policy updates break the system without a coordinated release.

**Observable signals**

Tool schema mismatches, timeout spikes from dependency changes, or sudden refusal shifts after policy updates.

**Required controls**

Tool contracts, versioned endpoints, dependency fingerprints, staged rollout or switchbacks when interference exists, joint incident review, and explicit fallback ownership.

**Validation method**

Run contract tests for tool schemas and integrate dependency SLOs into regime reporting.

**Primary owner**

Platform owner

### G5 -- Human-in-the-loop and policy workflows shape episode definitions and measurement


**Why this matters**

Many production deployments include moderation queues, policy overrides, and human review paths that define what success means.

**Failure pattern**

Episodes end inconsistently, pending work is ignored, and review latency or escalation cost disappears from metrics.

**Observable signals**

High pending volumes counted as success, user-visible delays not tracked, or inconsistent safety decisions across flows.

**Required controls**

Explicit episode boundaries that include HITL transitions, review and escalation metrics, pending-state accounting, and slices or regimes for HITL-invoked paths.

**Validation method**

Run end-to-end audits that include human-review paths and require stability for HITL slices.

**Primary owner**

Policy owner

## F) Security and data governance foundations

### P1 -- Untrusted context can contain adversarial instructions


**Why this matters**

User input, retrieved documents, webpages, and tool outputs can contain prompt injection or other adversarial content.

**Failure pattern**

The system follows malicious instructions, leaks data, or overrides intended policy hierarchy.

**Observable signals**

Unexpected tool invocations, prompt-injection success on evals, or policy violations sourced to retrieved or tool-provided content.

**Required controls**

Instruction hierarchy, provenance-aware context handling, prompt-injection evals, sandboxing where relevant, and audit logging for sensitive actions.

**Validation method**

Maintain adversarial suites for direct and indirect prompt injection and require regression checks on high-risk releases.

**Primary owner**

Security owner

### P2 -- Tool access creates authorization and side-effect risk


**Why this matters**

Agents that can take external actions can exceed privilege boundaries or perform unsafe side effects.

**Failure pattern**

The system invokes tools with excessive authority, executes unsafe actions, or performs irreversible operations without proper review or recovery.

**Observable signals**

Unauthorized tool attempts, side-effect incidents, or safety overrides concentrated in action-taking flows.

**Required controls**

Least-privilege tool design, allowlisted actions, approval steps for high-risk operations, idempotency contracts, audit logs, rollback or reversal paths where possible, and kill switches for unsafe workflows.

**Validation method**

Run permission-boundary tests, destructive-action drills, and approval-path audits.

**Primary owner**

Platform owner

### P3 -- Evaluation and production data require lineage and access controls


**Why this matters**

PII, retention, contamination, freshness, and customer-data isolation affect both evaluation validity and operational safety.

**Failure pattern**

Datasets become contaminated, sensitive data leaks into eval workflows, or production and evaluation data are used without proper lineage.

**Observable signals**

Unknown data provenance, unclear holdout integrity, access-control incidents, or disputes about corpus freshness and source-of-truth.

**Required controls**

Dataset lineage, retention policy, access control, holdout isolation, contamination checks, and provenance fields for synthetic or derived data.

**Validation method**

Audit lineage and access rights regularly and verify holdout or production data separation remains intact.

**Primary owner**

Data governance owner

### P4 -- Generated outputs can create policy, compliance, or reputational risk


**Why this matters**

Even high-performing outputs can violate policy, enter regulated territory, or create reputational damage.

**Failure pattern**

The system gives unsafe advice, defamatory claims, copyrighted leakage, or domain-inappropriate output while still passing generic quality metrics.

**Observable signals**

Policy-violation incidents, expert-review escalations, or mismatch between generic helpfulness scores and domain-specific risk findings.

**Required controls**

Safety classification, domain-specific policy gates, expert review where required, and explicit stop-ship constraints for sensitive domains.

**Validation method**

Use targeted policy or compliance suites, sampled expert audits, and incident-driven expansion of sensitive-domain coverage.

**Primary owner**

Safety owner

## G) Product experience foundations

### UX1 -- Product behavior is part of system quality


**Why this matters**

A system can be factually correct and still fail the intended product experience.

**Failure pattern**

Users distrust or abandon the system because it is verbose, terse, overconfident, evasive, inconsistent in tone, or misaligned with the interaction model.

**Observable signals**

High clarification rate, abandonment rate, refusal complaints, verbosity spikes, low satisfaction despite correctness, or inconsistent tone across similar tasks.

**Required controls**

Product-specific quality rubric, UX slices, tone or style constraints, confidence-calibration checks, and human review of user-facing outputs on sensitive paths.

**Validation method**

Audit similar tasks for consistency, correlate quality signals with user outcomes, and review critical slices for over-answering, under-answering, and poor refusal behavior.

**Primary owner**

Product owner

## 7. Factor-to-control mapping


Use this section during reviews when speed matters more than detail.

- `S1/S2`: `I_fingerprint`, drift summaries, reweighting policy, Tier-1 slices, product-linked endpoints
- `S3`: randomization, switchbacks, regime conditioning, plane checks
- `S4`: paired offline gates, uncertainty everywhere, replication requirement
- `S5`: tiered slices, precommitment, small gate set, controlled diagnostic exploration
- `M0`: behavioral equivalence criteria, task-specific rubrics, hard-constraint validators
- `M1/M5`: calibration, anchors, double scoring, validators, ruler governance
- `M2`: `RulerVersion`, frozen ruler, drift thresholds, unhealthy-ruler handling
- `M3`: holdouts, independent audit channels, anti-style-inflation checks
- `M4`: missingness policy, observability coverage, fail-closed defaults
- `Y1`: deterministic decode or replicates, replay, repeated-run checks
- `Y2`: schema contracts, semantic-variation tests, retry and repair metrics, canaries
- `Y3`: long-context slices, truncation metrics, context buckets
- `Y4`: retrieval regimes, retrieval driver metrics, evidence validators, grounding audits, fault injection
- `Y5`: tool regimes, tool-health metrics, switchbacks, circuit breakers, fallback
- `Y6`: loop detection, step budgets, termination reasons, recovery metrics, escalation
- `Y7`: budgets as constraints, tail inference, load and degraded-mode tests
- `Y8`: sentinels, anchors, provider incident handling, alternate routes
- `Y9`: full-state versioning, regression suites for hidden-state changes
- `O1`: explicit objectives versus constraints, gate policy as feasibility enforcement
- `O2`: typed search space, controlled diffs, plane fingerprinting
- `O3`: dev or holdout or red-team governance, replication, frozen ruler
- `O4`: Tier-1 slices and regimes in gates, incident-to-slice workflow
- `O5`: assignment logging, evaluation windows, policy-version discipline
- `G1`: builder/grader separation, mechanical gates, independent audits
- `G2`: named artifact owners, versioning, change protocols
- `G3`: incident to slice or test loop, red-team growth, recurrence tracking
- `G4`: dependency contracts, fingerprinted interfaces, joint SLO or regime monitoring
- `G5`: explicit HITL episode boundaries, review metrics, HITL slices
- `P1`: instruction hierarchy, provenance-aware context handling, prompt-injection testing
- `P2`: least privilege, action allowlists, approval flows, audit logs, kill switches
- `P3`: lineage, retention, access control, holdout isolation, contamination checks
- `P4`: policy gates, expert review, stop-ship constraints for sensitive domains
- `UX1`: UX rubrics, experience slices, calibration checks, human review of user-facing outputs

## 8. Release decision flow


Use this flow for any release above ad hoc process:

1. Classify the release risk tier.
2. Identify active failure drivers.
3. Confirm required artifacts exist for that tier.
4. Confirm required recovery controls exist for that tier.
5. Freeze relevant C, I, E, and R fingerprints where required.
6. Run offline evaluation and produce `StateEstimate`.
7. Produce `StateDeltaReport` for any comparative claim.
8. Check Tier-1 global and slice gates.
9. Check ruler health, observability coverage, and missingness counters.
10. If PASS, proceed to canary or online experiment where required.
11. During canary, monitor regime-conditioned metrics, fallback activation, and recovery counters.
12. If INCONCLUSIVE, gather more data, re-score, re-run, or reduce scope.
13. If FAIL, block the release, roll back, activate fallback, or enter degraded mode.
14. After release, monitor the defined window and convert incidents into slices, tests, monitors, contracts, or red-team cases.

Default doctrine:

- PASS means the release met the predeclared decision rule.
- FAIL means one or more hard constraints or required gates were violated.
- INCONCLUSIVE means the comparison is not decision-grade yet.

## 9. Artifact ownership


This table makes the framework enforceable. Detailed RACI rules live in `other/governance-overview-v1.0.md`.

| Artifact | Owner | Approver | Review cadence |
|---|---|---|---|
| `ExperimentSpec` | Experiment owner | Tech lead | Per experiment |
| `ExperimentReport` | Experiment owner | Eval lead | Per experiment |
| `StateEstimate` | Eval or platform owner | Tech lead | Per release |
| `StateDeltaReport` | Eval owner | Tech lead | Per release |
| `RulerVersion` | Measurement owner | Safety or product lead | Per ruler change |
| Tier-1 slices | Slice owner | Tech lead and product | Monthly |
| Gate policy | Gate owner | Engineering leadership | Quarterly |
| Red-team suite | Safety or eval owner | Tech lead | Per incident or monthly |
| Tool contracts | Platform owner | AI system owner | Per API change |
| Missingness policy | Framework or eval owner | Tech lead | Per framework change |

Minimum ownership rule:

- If an artifact affects scoring, gating, or slice membership, it must have a named owner and a version.

## 10. Minimum acceptance criteria by maturity level

### Level 1 -- Observable


- Trace IDs exist.
- Prompt, model, tool, retrieval, and policy versions are logged where relevant.
- Success, failure, timeout, latency, and cost are tracked.
- Basic schema or tool validators exist.

### Level 2 -- Evaluated


- Versioned eval sets exist.
- Tier-1 slices are defined.
- Missingness policy is explicit.
- Holdout data is separated from development data.
- Deterministic validators cover hard constraints.
- Behavioral equivalence criteria exist for non-exact tasks.

### Level 3 -- Gated


- Every medium-risk or higher release has an `ExperimentSpec`.
- Every evaluation produces a `StateEstimate`.
- Every comparison produces a `StateDeltaReport`.
- Gates use confidence intervals plus margins.
- PASS or FAIL or INCONCLUSIVE decisions are mechanical.
- High-risk releases define rollback or fallback behavior.

### Level 4 -- Governed


- `RulerVersion` exists with anchor sets and drift handling.
- Builder/grader separation exists.
- State, ruler, slice, and gate owners are named.
- Incident-to-slice or test workflow is operating.
- Dependency contracts are versioned.

### Level 5 -- Adaptive but controlled


- Adaptive policies log assignment and policy version per episode.
- Fixed-policy evaluation windows exist.
- Off-policy or adaptive evaluation uses appropriate logging discipline.
- Policy changes do not erase comparability or accountability.

## 11. Migration from v1.2


`v1.3` is a structural tightening of `v1.2`, not a conceptual reset.

Main additions:

- the document now opens with a stronger "why this framework exists" section
- `Prevent / Detect / Recover / Prove` is now defined canonically in `methodology-principles.md`, with this document pointing to it
- behavioral equivalence and minimum trace requirements are explicit
- `M0`, `Y9`, and `UX1` are new additive factors

Stable elements:

- existing factor IDs from `S1` through `P4` remain valid
- existing artifact names and governance objects remain unchanged
- release gates, maturity levels, and ownership logic stay aligned with the broader methodology pack

## 12. Bottom line


The purpose of this framework is not to enumerate every way AI systems fail. It is to make AI reliability work operational:

> failure driver -> prevent -> detect -> recover -> prove -> learn

If a team can make release, rollback, observability, and incident-learning decisions through that loop, the framework is working.
