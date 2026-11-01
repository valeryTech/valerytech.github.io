---
draft: false
toc: true
title: "AI Systems Framework — Methodology Critique (v1)"
description: "The framework’s controls can also create fragile labels, fragmented baselines, expensive governance, and too many inconclusive results. This assessment connects those costs to mitigations and an order of adoption."
linkTitle: "Methodology Critique"
---

This review describes the methodology as a **toolkit**, explains the failures each tool addresses, and assesses its strengths and operational risks.

# 1. The main "tools" in the methodology (what to adopt)

## Tool A -- Plane decomposition: C / I / E / R / O


**What it is:** A disciplined way to talk about _what changed_ and _why outcomes changed_:

- **C (Configuration):** prompt/model/decoding/retrieval params, routing policy, safety policy
- **I (Input regime):** user mix, languages, context-length distribution, intents, adversarial prevalence
- **E (Environment):** dependency health, rate limits, corpus/index state, latency regimes
- **R (Ruler):** the measurement process (judge/rubric/validators/aggregation/calibration)
- **O (Observed):** metrics + driver metrics with uncertainty

**Benefits:**

- A correct default stance: "O moved" is not "C improved" unless I/E/R are controlled or explicitly conditioned.
- A shared attribution language for incidents and regressions that prevents "prompt wars" and random tweaking.

**Typical problems it solves:**

- Attributing worse quality to a prompt change when the tool endpoint actually degraded.
- "Model regression" (but judge/rubric changed).
- "Retrieval tuning helped" (but traffic shifted to simpler questions).

## Tool B -- Fingerprints (comparability contract)


**What it is:** Stable hashes for C/I/E_fixed/R that travel with every state snapshot and delta.

**Benefits:**

- Mechanical enforcement that comparisons are valid.
- A clean "baseline mismatch" detector.
- The ability to attribute changes to configuration vs environment vs measurement changes because those are explicitly identified and versioned.

**Typical problems it solves:**

- An unexplained, irreproducible difference between canary and production.
- "A/B results vary week to week for unknown reasons."
- "Provider changed 'default model' silently."

## Tool C -- SystemState / StateEstimate as the canonical decision object


**What it is:** A required artifact for each window/comparison:

- fingerprints
- global metrics **with n + uncertainty**
- Tier-1 slice matrix **with n + uncertainty**
- driver metrics (retrieval empty, truncation, tool failures, loops)
- ruler health

**Benefits:**

- A consistent, auditable object for release gates and monitoring.
- Forces the team to treat stochasticity and sampling variability as first-class.

**Typical problems it solves:**

- An improvement claim based only on anecdotal examples.
- Shipping on noise (small deltas in high-variance metrics).
- Debugging without volume context (n) and without confidence bounds.

## Tool D -- Slice catalog with tiering + slice typing (pre vs post treatment)


**What it is:**

- Slices are versioned predicates with metadata and required fields.
- **Tier-1:** small, gate-safe (pre-treatment/input-defined)
- **Tier-2:** diagnostic (often post-treatment/trace-defined regimes)
- **Tier-3:** exploratory/ad hoc

**Benefits:**

- Prevents Simpson's paradox and "global average hides failures."
- Prevents the most common causal mistake: gating on post-treatment slices like `retrieval_used` or `tool_used`.

**Typical problems it solves:**

- Shipping regressions because the variant changed routing, thereby changing who falls into a slice.
- Slice explosion that produces false alarms and "always red" gates.
- Claiming improvement for tool users when fewer requests were actually routed to tools.

## Tool E -- Ruler discipline (measurement as an instrument)


**What it is:**

- Explicitly treat judge/rubric/validators as a noisy measurement system.
- Require ruler health checks, anchors, drift protocols, and "ruler unhealthy ⇒ INCONCLUSIVE."

**Benefits:**

- Prevents evaluator outages and drift from triggering product-regression pages.
- Makes "metric gaming / Goodhart" an explicit operational risk, not a philosophical footnote.

**Typical problems it solves:**

- "Quality dropped" because the judge prompt changed.
- Model/provider updates changing judge behavior.
- Teams optimizing to a judge artifact instead of product value.

## Tool F -- Change detection pipeline with integrity gates + decision artifacts


**What it is:** A staged system:

- Stage 0: integrity (coverage/missingness, ruler health, bucket integrity)
- Stage 1: detect (sensitive triggers)
- Stage 2: confirm (delta + uncertainty + margins)
- Stage 3: attribute (planes-first)
- Stage 4: close (mitigate + convert into new defenses)

And the key output is a **ChangePacket**, not a dashboard screenshot.

**Benefits:**

- Monitoring that produces actionable decisions (PASS/FAIL/INCONCLUSIVE with reasons).
- Repeatable incident triage.

**Typical problems it solves:**

- Alert fatigue from noisy thresholds.
- A detected spike with no evidence supporting an explanation.
- Slow MTTR because attribution is ad hoc and transcript-driven.

## Tool G -- Regimes, driver metrics, missingness policy, exemplar sampling


**What it is:**

- Regime splits (e.g., retrieval empty vs non-empty, truncation yes/no, dependency degraded)
- Driver metrics to explain "why"
- Explicit missingness accounting
- Sampling strategy for raw payloads/exemplars (cost + privacy controlled)

**Benefits:**

- Explains silent failures without logging everything.
- Robustness to partial observability (some spans missing, some traces sampled).

**Typical problems it solves:**

- "Quality regressed" but only because retrieval-empty increased.
- "No data" debugging because failures weren't sampled.
- Biased exemplars (only easy or only failing cases logged).

# 2. End-to-end capabilities


Coherent adoption supports four production capabilities:

1. **Comparability:** explicit rules distinguish valid comparisons from invalid ones.
2. **Attribution:** structured evidence narrows causes (measurement vs environment vs input mix vs config).
3. **Governed optimization:** iteration is protected against metric gaming and excessive slice noise.
4. **Operational decision-making:** structured artifacts support canaries, gates, rollbacks, and incident response.

This directly addresses the standard failure mode of LLM products: "it returns 200 OK, but the product got worse."

# 3. Critique (what's strong, what's risky, what's missing)

## Strengths


1. **Correct default epistemology:** it treats stochasticity, drift, and measurement noise as normal conditions -- not exceptions.
2. **Prevents the common causal traps:** especially post-treatment slicing and ruler drift masquerading as model regression.
3. **Decision artifacts over dashboards:** ChangePacket/SystemState are the right operational abstractions.
4. **Aligns platform and product work:** provenance, slices, and gates unify infra telemetry with semantic outcomes.

## Risks and weaknesses requiring explicit management

### 1. Pre-treatment labels are a hard dependency


Tier-1 gating for chat+RAG often wants `retrieval_required`, `freshness_sensitive`, `safety_sensitive`, domain labels. If these labels are:

- expensive,
- poorly calibrated,
- or inadvertently coupled to the same model/router under test,

then Tier-1 becomes fragile or misleading.

**Mitigation:** treat labelers as a first-class subsystem:

- frozen versions,
- their own drift checks,
- and explicit coupling rules ("labeler must not be the treatment").

### 2. Fingerprint rigidity can fragment state histories


If fingerprints change too often (because of insignificant config differences), the result is:

- too many "baselines,"
- too many INCONCLUSIVE results,
- and diminished statistical power.

**Mitigation:** define a deliberate fingerprint schema:

- include only behaviorally meaningful knobs,
- normalize configs (sort sets, expand defaults),
- and maintain an allowlist/denylist process for fingerprint fields.

### 3) "INCONCLUSIVE by default" is correct but operationally painful


Scientifically, INCONCLUSIVE is the right answer when foundations are violated. Operationally, too much INCONCLUSIVE creates friction and slows shipping.

**Mitigation:** define playbooks for each INCONCLUSIVE cause:

- coverage broken -> fix instrumentation, re-run
- ruler drift -> re-score anchors, recalibrate
- low n -> extend window or run targeted eval
- baseline mismatch -> rebaseline/roll back to known-good

### 4. Evaluators remain a weak link


Even with ruler health, LLM-as-judge style scoring is:

- biased,
- gameable,
- and can drift with provider updates.

**Mitigation:** enforce a mixed measurement stack:

- proxy signals at scale (re-ask, abandonment, citation coverage)
- deeper eval on sampled runs
- anchor sets and periodic human review for calibration

### 5. Methodology doesn't fully specify experimental design for interference


The docs mention switchbacks and interference concerns, but production tool-using/RAG systems have real coupling (caches, shared indices, rate limits).

**Mitigation:** explicitly choose and standardize designs:

- A/B when independence holds
- switchbacks/time-slicing when there's interference
- clustered inference for shared tenants/threads

### 6. Governance overhead is real


Slices, rulers, fingerprints, labelers, baselines, and detectors all require change control. Without a lightweight governance model, teams will bypass it.

**Mitigation:** create a small "measurement platform contract":

- who owns slice catalog changes,
- how tier promotions happen,
- how ruler changes are rolled out,
- and what gets backfilled.

### 7. It under-emphasizes privacy/security as a design constraint


Sampling and exemplar capture are mentioned, but most organizations need a stronger spec for:

- redaction, retention tiers, access controls,
- audit trails,
- and tenant isolation.

**Mitigation:** add a privacy/security annex:

- default store-by-reference,
- explicit retention policy per field,
- and hard rules for raw prompt/context storage.

# 4. Practical recommendation: which parts to use first (high ROI order)


1. **SystemState + fingerprints** (credible gating and triage require comparability).
2. **Tier-1 slice set + slice executor** (small, governed segmentation).
3. **RAG evidence + regime labels (Tier-2)** (retrieval empty / truncation / evidence score drift).
4. **Change detection pipeline** (integrity gates + confirmed deltas + ChangePackets).
5. **Ruler discipline + anchors** (prevents "measurement drift incidents").

This sequence yields immediate operational value without requiring perfect evaluation from day one.
