---
draft: false
toc: true
title: "AI Systems Framework for Software Developers (v1)"
description: "A draft developer guide translating the framework into episode records, comparison artifacts, and everyday prompt-change and incident workflows, with an incremental ladder from tracing to controlled rollout."
linkTitle: "Developer Guide"
---

**Status:** Draft

**Last updated:** 2026-01-10

**Audience:** Software engineers building or operating LLM-based products (chat, chat+RAG, agentic workflows)

## 1. Why this exists (the practical problem)


Traditional observability answers:

- Is the service up?
- Where is it slow?
- Where did it error?

LLM products additionally need to answer:

- Did the user get a correct/helpful answer (even when HTTP was 200)?
- Was the answer supported by evidence (RAG)?
- Did the system violate policy or leak sensitive data?
- Did a change (prompt/model/retriever) regress a cohort?

These failures are often **silent**, **stochastic**, and **distribution-dependent**. This framework provides a practical operating model:

- how to instrument,
- how to compare,
- how to detect change,
- how to attribute cause,
- and how to decide (ship/rollback/mitigate) under uncertainty.

## 2. Core mental model: Episodes, Planes, and Artifacts

### 2.1 Episode = the unit of behavior


An **Episode** is one user interaction that can be evaluated and managed operationally.

- Default: one user turn (request -> response).
- Sometimes: a multi-turn episode if success is only meaningful at the task level.

Think: "one row of data that describes what happened."

### 2.2 Planes = what can change


Separating variation into planes supports reasoning about causality and comparability:

- **C (Configuration):** the controlled, deployed settings
  (prompt templates, model selection, decoding params, retrieval settings, routing, safety policies)
- **I (Input regime):** what users asked and what context they had
  (languages, lengths, intents, tenant mix, adversarial prevalence)
- **E (Environment):** the external dependencies of the system
  (dependency health, rate limits, corpus/index snapshots, network conditions)
- **R (Ruler):** the quality-measurement process
  (judge/rubric, validators, thresholds, aggregation, calibration sets)
- **O (Observations):** the observed metrics
  (quality signals, safety rates, cost/latency, driver metrics)

**Interpretation rule:** "O changed" is not the same as "C improved" unless I/E/R are controlled or explicitly conditioned.

### 2.3 Artifacts = what makes decisions reproducible


The framework standardizes the objects used for decisions:

- **EpisodeRecord:** one structured record per episode (instrumentation output)
- **StateEstimate:** aggregated metrics for a window/dataset (with sample sizes and uncertainty)
- **StateDeltaReport:** comparison of two StateEstimates (candidate vs baseline)
- **GateReport:** release decision summary (PASS/FAIL/INCONCLUSIVE)
- **ChangePacket:** monitoring decision artifact (what changed + why + what to do)

A complete EpisodeRecord supports consistent downstream analysis.

## 3. The "capturing ladder" (how teams adopt this without boiling the ocean)


This framework is deliberately staged. Each rung adds state because it changes decisions.

### L0 -- Standard distributed observability


- traces across services
- latency/errors/saturation metrics
- logs for failures

Works for infra incidents, not for silent quality regressions.

### L1 -- Episode provenance + budgets (minimum LLM base)


Add to each episode:

- run/session/turn IDs and trace correlation
- versions of prompt/model/retrieval/policy
- decoding params
- token usage and cost estimate
- stage statuses and retries
- feedback hooks

This supports answering: "what version did this?" and "where did it fail?"

### L2 -- RAG evidence + regime flags (chat+RAG is here)


Add:

- retrieval candidate IDs and score summaries
- selected context IDs and truncation indicators
- index snapshot IDs (immutable)
- regimes: retrieval_empty, low_evidence, context_truncated, dependency_degraded

This supports answering: "did retrieval fail?" vs "did the model ignore evidence?"

### L3 -- Slice catalog (segmentation with governance)


Define versioned, deterministic slices:

- **Tier-1 (gated):** small, pre-treatment, input-defined
- **Tier-2 (diagnostic):** regimes and execution-path slices (often post-treatment)
- **Tier-3 (exploratory):** ad hoc investigation slices

This exposes regressions hidden in global averages.

### L4 -- Change detection and decision pipeline


Monitoring becomes:

- integrity gate (measurement is healthy)
- detect candidates
- confirm with uncertainty + margins
- attribute (planes-first)
- close (mitigation + convert to defenses)

This supports reliable alerts and canaries.

### L5 -- Controlled rollout + replay


- canary with automated rollback rules
- replay harness for known episodes
- regression suites aligned to slices
- continual improvement loop

## 4. Fingerprints: the comparability contract engineers should respect

### 4.1 What is a fingerprint?


A **fingerprint** is a stable hash representing an identity:

- C_fingerprint: prompt/model/retrieval/safety config identity
- I_fingerprint: dataset/window/sampling + slice catalog identity
- E_fixed_fingerprint: fixed environment identifiers (e.g., index snapshot)
- R_fingerprint: measurement regime identity (judge/rubric/validators)

### 4.2 Why it matters in practice


Engineers frequently compare metrics that are not comparable:

- prompt changed *and* judge changed
- model provider updated "latest"
- index rolled forward silently
- traffic mix shifted (more non-English, longer contexts)

Fingerprints make this explicit. If fingerprints differ, comparisons are **suspect** without an intentional, documented remapping.

### 4.3 Developer rule of thumb


Any change affecting semantics (prompt, model, retrieval, validators) should change the fingerprint and trigger the following steps:

- baseline/compare appropriately,
- avoid mixing results across incompatible identities,
- and not "explain away" mismatches.

## 5. Slices: segmenting behavior without misleading comparisons

### 5.1 Slice types


- **Pre-treatment, input-defined:** safe for gating (Tier-1)
- **Post-treatment, trace-defined:** diagnostic, not safe for causal gating without a counterfactual design

### 5.2 The most common mistake


Gating on `retrieval_used` or `tool_used` as if it were a cohort label.

Why this fails:

- variants change routing behavior,
- so the slice membership changes,
- causing selection bias.

Correct pattern:

- gate on `retrieval_required` if it is an input label computed outside the treatment,
- monitor `retrieval_used`, `retrieval_empty`, `low_evidence` as Tier-2 diagnostics.

### 5.3 What slices are "worth it"


A slice is worth productionizing if it:

- maps to a known failure mode or risk surface,
- is stable over time (predicate doesn't drift),
- is actionable (a regression has a defined response),
- has enough volume (n) or has an explicit oversampling strategy.

## 6. Measurement and evaluation: treat it as an instrument (R-plane)

### 6.1 What engineers should internalize


Evaluation signals (judges, heuristics, validators) are:

- noisy,
- bias-prone,
- drift-capable,
- and gameable under optimization pressure.

This means:

- a change in score may reflect ruler drift, not product change,
- and "ruler health" checks are required (anchors, stability tests, calibration).

### 6.2 Practical guidance


- Prefer mixing signals:
	- scalable proxies (re-ask rate, abandonment, escalation, citation coverage)
	- sampled deep eval (judge or human review)
- Track evaluator versions and thresholds as part of R_fingerprint.
- When evaluator changes, expect to rebaseline or rescore.

## 7. How to use this day-to-day (developer workflows)

### 7.1 Changing a prompt template


Do:

- bump template version and ensure it is recorded in EpisodeRecord
- run offline paired eval to produce a StateDeltaReport
- check Tier-1 slices (especially non-English, long context, safety-sensitive, retrieval_required)
- confirm no cost/latency blowups

Don't:

- compare the new prompt run to an old baseline with a different judge/rubric
- ship based on a handful of hand-picked examples

### 7.2 Changing retrieval parameters or the index


Do:

- record index snapshot ID (immutable) and retrieval config version
- ensure retrieval evidence fields are populated (candidate IDs, score stats, selected chunk IDs)
- monitor retrieval regimes: retrieval_empty, low_evidence, truncation rates
- gate on retrieval_required slice (if available)

Don't:

- roll index forward silently without versioning (attribution will be lost)

### 7.3 Responding to an "answers are worse" incident


Use the ChangePacket / StateEstimate approach:

1. Check integrity: missingness/coverage and ruler health.
2. Check which Tier-1 slices regressed.
3. Check regimes:
	- did retrieval_empty increase?
	- did context_truncated increase?
	- did dependency_degraded increase?
4. Only then pull exemplars (sampled transcripts) for the failing slices/regimes.

### 7.4 Adding a new feature (new routing mode, new summarizer, new reranker)


Do:

- add the feature's "decision points" to provenance (C-plane)
- add regime flags and driver metrics to support failure attribution
- start as Tier-2 diagnostics; promote to Tier-1 only when pre-treatment labels exist and the slice is stable

## 8. Implementation approach (what to build in code)

### 8.1 EpisodeRecord builder


Use a builder pattern that:

- starts at request intake (create run_id)
- is enriched at each stage (retrieval, selection, generation, postprocess)
- emits once at end, even on error/timeout

Key requirement: do not drop records on failure -- emit partial records with missingness reasons.

### 8.2 Span taxonomy


Instrument the logical spans even if they occur inside one service:

- retrieval_query_build -> retrieval_fetch -> retrieval_rerank -> context_selection -> prompt_assembly -> llm_generate -> postprocess

### 8.3 Evidence by reference


Store:

- doc/chunk IDs, ranks, scores
- context selection IDs

Avoid storing:

- full retrieved text and full prompts by default

Use sampled exemplars with short retention and controlled access.

### 8.4 Missingness counters


Engineers often treat missing logs as "annoying." Here missingness is a signal:

- emit missing field lists and reason codes
- aggregate missingness rates by slice and by regime

This is essential for deciding PASS/FAIL/INCONCLUSIVE.

## 9. Common anti-patterns (what breaks the framework)


1. **Using post-treatment slices for gating**
   Example: gate on "tool_used" quality.
2. **Unversioned defaults**
   Example: model "latest", index "current", or prompt "main".
3. **Metric-by-dashboard culture**
   Decisions based on graphs without sample sizes, uncertainty, or comparability checks.
4. **Over-logging raw content**
   Creates privacy risk and operational friction. Prefer structured evidence and sampling.
5. **Ignoring missingness**
   If failing episodes drop out, the metrics will look "better."
6. **Changing the ruler without rebaselining**
   A judge prompt change will look like a product regression or improvement.

## 10. Quick reference: requirements for a compliant system

### Runtime (EpisodeRecord)


- IDs: run/session/turn + trace correlation
- Provenance: prompt/model/retrieval/safety versions
- RAG evidence: candidate IDs/scores + selected context IDs + truncation flags
- Regimes: retrieval_empty, low_evidence, dependency_degraded, context_truncated
- Budgets: latency breakdown + tokens + cost estimate
- Missingness + exclusions

### Offline/Online aggregation


- Tier‑1 slice matrix (small and gate-safe)
- Tier‑2 diagnostic regimes and driver metrics
- Uncertainty and sample sizes

### Decision artifacts


- StateDeltaReport for changes
- GateReport for releases
- ChangePacket for monitoring

## 11. Glossary (short)


- **Episode:** one measured unit of user interaction.
- **Provenance:** versioned identity of prompt/model/retrieval/safety config.
- **Fingerprint:** stable hash of C/I/E_fixed/R identities for comparability.
- **Slice:** versioned predicate defining a subset of episodes.
- **Regime:** an execution condition (often trace-defined), used for diagnostics.
- **Ruler:** the measurement instrument (judge/validators/rubric).
- **INCONCLUSIVE:** correct verdict when measurement or comparability is compromised.

## 12. Next documents to read


- RFC: AI Systems Framework -- Overview and Adoption
- Instrumentation Guide for Chat + RAG
- Tier‑1 slice catalog for chat+RAG
- Fingerprinting spec
- Change detection spec
- Gates policy spec
- Telemetry governance spec

**End of document.**
