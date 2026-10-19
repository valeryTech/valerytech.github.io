---
draft: false
toc: true
title: "Rfc V1 4"
linkTitle: "Rfc V1 4"
---
# RFC: AI Systems Framework -- Overview and Adoption (v1)


**Status:** Draft

**Last updated:** 2026-01-10

**Owner:** AI Systems Platform

**Audience:** Product engineers, ML/LLM engineers, SRE/oncall, analytics, security/privacy, program managers

**Scope:** LLM-based applications (chatbots, chat+RAG, tool-using agents) in production

## 1. Summary


This RFC defines an organization-wide framework for **operating, changing, and improving LLM-based systems** with production-grade rigor. It does **not** attempt to solve "evaluation" as a single metric. Instead, it establishes:

1. a shared **conceptual model** for causality and comparability,
2. a small set of **canonical artifacts** that every team can produce and consume, and
3. a staged **adoption plan** with verifiable exit criteria.

The framework's central idea is that LLM systems cannot be operated safely using infrastructure health alone: many failures are *silent* (HTTP 200 but incorrect/unsafe/unhelpful), outputs are non-deterministic, and measurement systems (judges, rubrics, heuristics, user feedback) drift. Therefore, production operations must treat **semantic outcome signals** and **measurement integrity** as first-class, versioned inputs to decision-making.

## 2. Motivation and problem statement

### 2.1 Why "standard observability" is insufficient


Distributed tracing and service metrics answer: "Is the system up?" and "Where is it slow or failing?" They do not answer:

- "Did the user receive the correct/helpful answer?"
- "Was the answer supported by evidence (for RAG)?"
- "Did the system violate policy or leak sensitive content?"
- "Did a model/prompt/retrieval change regress a critical cohort?"

In LLM systems, these failures can occur while latency, errors, and CPU metrics look normal.

### 2.2 Why ad hoc evaluation is insufficient


Teams commonly respond with ad hoc transcript review, prompt iteration, or periodic benchmark runs. This fails in production because:

- user input distribution shifts continuously (intent, language, context length, adversarial behavior),
- tools and retrieval depend on external systems and corpora that change over time,
- "judges" (LLMs or heuristics) are imperfect instruments and can drift,
- release velocity makes it difficult to attribute regressions to a single change.

### 2.3 Required operating capabilities


The proposed framework should provide a **decision-grade operating system** for AI behaviors: a way to propose changes, measure impact, detect regressions, attribute causes, and take action under uncertainty -- while respecting privacy and cost constraints.

## 3. Goals and non-goals

### 3.1 Goals


This framework aims to enable:

- **Comparability:** determine when two measurements can be compared, and refuse to decide when they cannot.
- **Attribution:** identify likely causes of observed deltas (measurement vs environment vs input mix vs configuration).
- **Release safety:** enforce quality/safety/cost constraints via automated and human-in-the-loop gates.
- **Operational monitoring:** detect production drift and regressions with low false-positive rates and clear action paths.
- **Repeatability:** convert incidents into permanent detectors/slices/tests.

### 3.2 Non-goals


- Defining a single "quality score" for all products.
- Mandating a specific LLM provider or evaluation model.
- Replacing product-specific success criteria.
- Capturing or storing raw prompts/responses universally (this is explicitly discouraged).

## 4. Core concepts

### 4.1 Episode (the unit of analysis)


An **Episode** is the smallest unit of user interaction evaluated and managed operationally. For chat+RAG, an episode is typically one user turn (request -> response), though multi-turn episodes are allowed when success is only meaningful over a window of turns.

An episode has:

- **inputs** (user text, conversation context, user/tenant metadata, UI mode),
- **trajectory** (retrieval steps, prompt assembly, model calls, post-processing),
- **outputs** (assistant response, citations, actions),
- **outcome signals** (feedback, proxies, validators),
- **budgets** (latency, tokens, cost).

### 4.2 Planes: the causal and comparability model (C / I / E / R / O)


Interpreting changes requires decomposing variation into planes:

- **C -- Configuration:** the controlled and deployed settings (prompt templates, model selection and decoding parameters, retrieval settings, reranker, routing policies, safety/guardrail config, feature flags).
- **I -- Input regime:** the distribution of user requests and context (language, length, intent mix, tenant mix, adversarial prevalence).
- **E -- Environment:** external conditions (dependency health, rate limits, network, index/corpus snapshot, tool backends).
	- **E_fixed:** environment identifiers that define comparability (e.g., corpus snapshot ID, tool contract version).
	- **E_observed:** realized environment conditions during execution (timeouts, degraded dependency states).
- **R -- Ruler (measurement regime):** the outcome measurement process (judge model + prompt, rubric, validators, aggregation, thresholds, calibration sets).
- **O -- Observations:** measured outcomes and driver metrics, including uncertainty and coverage.

**Interpretation rule:** A change in **O** is not evidence of improvement in **C** unless **I**, **E_fixed**, and **R** are controlled or explicitly conditioned. When foundations are violated, the result is **INCONCLUSIVE**.

### 4.3 Comparability contract


Two state snapshots are comparable only if their **StateKey** matches (or has approved, explicit exceptions):

- same (or explicitly mapped) configuration identity,
- same measurement regime identity,
- compatible input regime definition and sampling,
- compatible fixed environment identifiers.

This contract is enforced through **fingerprints**.

## 5. Canonical artifacts (the framework "API surface")


The framework is artifact-centric. These artifacts are the interfaces between runtime instrumentation, offline evaluation, monitoring, and decision-making.

### 5.1 EpisodeRecord (runtime event)


**Produced by:** application runtime pipeline

**Consumed by:** offline evaluation, slice executor, monitoring aggregators, incident tooling

EpisodeRecord is a structured record of an episode including:

- IDs (trace/run/session/turn, tenant/user pseudonyms),
- C/I/E/R references (fingerprints or pointers),
- trajectory spans (retrieval, rerank, prompt assembly, model calls),
- budgets (latency per stage, tokens, cost),
- minimal evidence references (doc IDs, chunk IDs, citations),
- validator outputs and user feedback hooks.

**Note:** EpisodeRecord does not require full raw payload by default; it supports pointer-based storage for sampled exemplars under governance.

### 5.2 StateKey (identity of a measurement)


**Produced by:** aggregation pipeline

**Consumed by:** comparability checks, baselines, gating logic

StateKey defines *what is being measured*:

- C_fingerprint
- I_fingerprint
- E_fixed_fingerprint
- R_fingerprint
- evaluation window definition (time bounds or dataset ID)

### 5.3 StateEstimate (a measurement)


**Produced by:** evaluation/monitoring aggregators

**Consumed by:** gates, change detection, dashboards

StateEstimate contains:

- StateKey
- sample sizes (global and by slice)
- metric estimates and uncertainty (e.g., CIs)
- Tier-1 slice matrix (core slices with estimates + uncertainty)
- selected Tier-2 diagnostic regimes and driver metrics
- integrity signals (coverage/missingness, ruler health)

### 5.4 StateDeltaReport (comparison)


**Produced by:** offline eval, canary analysis, or monitoring confirmation step

**Consumed by:** release gates, root-cause workflows

StateDeltaReport compares two StateEstimates (candidate vs baseline):

- confirmed deltas with uncertainty and decision thresholds
- pass/fail/inconclusive verdict per endpoint and Tier-1 slice
- attribution hints and drill-down links (not raw transcripts)

### 5.5 GateReport (release decision)


**Produced by:** release automation / CI pipeline

**Consumed by:** release owners, approvals, audit

GateReport summarizes:

- release identity and scope (C changes)
- required checks (quality, safety, cost, latency)
- verdicts (PASS/FAIL/INCONCLUSIVE)
- required follow-ups and mitigations

### 5.6 ChangePacket (monitoring decision artifact)


**Produced by:** monitoring change detection pipeline

**Consumed by:** oncall, incident management, postmortems

ChangePacket is the canonical output of monitoring:

- what changed (which metrics/slices)
- confidence / uncertainty and sample sizes
- integrity status (is measurement trustworthy?)
- likely plane(s) implicated (R vs E vs I vs C)
- recommended action and next diagnostic steps
- exemplar pointers (only when permitted and necessary)

## 6. Document system (what lives where)


This RFC is an **overview + adoption contract**. It references two additional document classes:

### 6.1 Normative specifications (MUST/SHOULD, schemas, conformance)


Examples of required specs (to be authored/maintained separately):

- Episode Trace Schema Spec (EpisodeRecord schema + span taxonomy + enums)
- Fingerprinting Spec (canonicalization + field lists)
- Slice Catalog Spec (slice metadata schema + tiering + gate eligibility rules)
- State Objects Spec (StateKey/StateEstimate/StateDeltaReport/ChangePacket schemas)
- Ruler Contract Spec (judge/validators versioning, health checks, anchors)
- Missingness Policy Spec (coverage counters, exclusion semantics)
- Change Detection Spec (Stage 0-4 pipeline and required artifacts)
- Gates Policy Spec (CI+margins, verdict rules, escalation)
- Telemetry Governance Spec (privacy, retention, access control)

Each normative spec MUST have:

- versioning rules,
- machine-checkable schemas,
- conformance tests or validators,
- and backward/forward compatibility policy.

### 6.2 Implementation guides (how-to, opinionated, product-specific)


Examples:

- Instrumentation guide for chat+RAG
- Slice executor integration guide
- Offline paired evaluation guide
- Monitoring and oncall playbooks (triage from ChangePacket)
- How to add a new slice/metric/ruler safely

## 7. Framework compliance: what "using the framework" means


A team is considered compliant at different maturity levels. Compliance is verified via automated checks (schema validation, required fields present, baseline comparability, etc.).

### 7.1 Compliance levels

#### Level 1 -- Provenance + budgets


- EpisodeRecord emitted for all production episodes with required IDs and C/I/E_fixed/R identifiers.
- Budgets captured (latency breakdown, tokens/cost).
- Basic outcome hooks present (feedback events, key validator outputs).

#### Level 2 -- RAG evidence and regimes


- Retrieval evidence by reference (doc/chunk IDs, scores summaries, context selection).
- Regime flags (retrieval empty, truncation, dependency degraded).

#### Level 3 -- Slices and state snapshots


- Governed slice catalog with Tier-1 set.
- StateEstimate produced for every evaluation window with Tier-1 slice matrix and integrity signals.

#### Level 4 -- Release gates


- No C-plane change ships without GateReport based on StateDeltaReport.
- PASS/FAIL/INCONCLUSIVE is enforced with documented actions.

#### Level 5 -- Monitoring decisions


- Change detection pipeline produces ChangePackets.
- Oncall uses ChangePackets as first-line triage artifact.

## 8. Adoption plan (phased rollout with exit criteria)


This plan is designed to minimize upfront cost while producing immediate operational value.

### Phase 1 -- Establish EpisodeRecord and fingerprints (L1)


**Deliverables**

- EpisodeRecord schema v1 published
- instrumentation in runtime pipeline
- C/I/E_fixed/R fingerprint library integrated
- dashboards for latency and cost by model/prompt version

**Exit criteria**

- ≥ 99% episodes have required IDs and fingerprints
- model versions are immutable IDs (no "latest" pointers)
- token/cost metrics reconcile with billing within acceptable error bounds

### Phase 2 -- Add RAG evidence capture and regime flags (L2)


**Deliverables**

- retrieval evidence references (doc/chunk IDs, corpus snapshot ID)
- evidence quality summaries (score distributions, top-k stats)
- regime flags: retrieval_empty, truncation, dependency_degraded
- secure exemplar pipeline (tail sampling + controlled access)

**Exit criteria**

- retrieval_empty and truncation rates measurable and stable
- exemplar sampling is demonstrably unbiased across core cohorts (or explicitly stratified)
- privacy reviews completed for stored fields and retention

### Phase 3 -- Slice catalog + Tier-1 set + StateEstimate (L3)


**Deliverables**

- slice executor library + slice catalog repo
- Tier-1 slice set for chat+RAG (gate-safe, pre-treatment)
- StateEstimate generator for offline and online windows

**Exit criteria**

- Tier-1 slice matrix produced for each evaluation run/window
- slice membership predicates are versioned and deterministic
- minimum-n policy enforced (low-n results marked informational, not gated)

### Phase 4 -- Release gates and regression workflow (L4)


**Deliverables**

- GateReport + StateDeltaReport pipeline in CI/canary
- CI+margins gate policy (PASS/FAIL/INCONCLUSIVE)
- incident/playbook alignment: who approves overrides and why

**Exit criteria**

- releases consistently include gate artifacts
- overrides are auditable and rare
- common failure modes have documented mitigation paths (especially INCONCLUSIVE causes)

### Phase 5 -- Monitoring change detection and oncall (L5)


**Deliverables**

- Stage 0 integrity gates (coverage + ruler health)
- confirmed change detection (uncertainty-aware)
- ChangePacket generation and oncall routing

**Exit criteria**

- alerts are low-noise (measurably reduced false positives vs naive thresholds)
- oncall can attribute >80% of incidents to a plane within first triage step
- postmortems include updates to slices/tests/detectors

## 9. Operating model (how it is used day-to-day)

### 9.1 Release workflow (offline -> canary -> ship)


1. **Offline paired evaluation** generates a StateDeltaReport against a known-good baseline.
2. **Canary** runs in production with slice-aware gates.
3. **GateReport** summarizes verdicts; PASS ships, FAIL rolls back, INCONCLUSIVE triggers a mitigation path.

### 9.2 Monitoring workflow


- Monitoring periodically produces StateEstimates for rolling windows.
- Change detection pipeline emits ChangePackets upon confirmed, integrity-gated deltas.
- Oncall uses ChangePacket to decide: mitigate/rollback, investigate environment, or escalate measurement issues.

### 9.3 Improvement workflow


- Every incident produces: (a) at least one new detector/slice, (b) at least one new regression test or curated example set, and (c) updates to mitigations/runbooks.

## 10. INCONCLUSIVE doctrine (and what to do next)


**Principle:** When measurement integrity or comparability is violated, the system must return **INCONCLUSIVE** rather than make a misleading PASS/FAIL decision.

Common INCONCLUSIVE causes and actions:

- **Ruler unhealthy (judge drift/outage):** freeze changes, repair ruler, re-score anchors, re-run deltas.
- **Coverage/missingness shifted:** fix instrumentation, ensure exclusion counters, re-run; never "ignore missingness."
- **Baseline mismatch (fingerprints differ):** rebaseline or remap explicitly; do not compare across incompatible keys.
- **Low sample size:** extend window, oversample targeted slices offline, or run a dedicated canary.

## 11. Governance and ownership

### 11.1 Ownership


- **AI Systems Platform:** EpisodeRecord schema, fingerprint library, state artifacts, change detection pipeline.
- **Product teams:** product-specific endpoints, success criteria, mitigation playbooks.
- **Security/Privacy:** telemetry governance policy and audits.
- **SRE/oncall:** alert routing, runbooks, incident response integration.

### 11.2 Change control


The following require review and version bumps:

- slice predicate changes (new slice_version)
- ruler/judge changes (new R_fingerprint; re-scoring plan)
- fingerprint field list changes (schema migration plan)
- telemetry retention/access policy changes

## 12. Risks and mitigations (high-level)

### 12.1 Labeler coupling risk


Tier-1 gate slices often rely on pre-treatment labels (e.g., retrieval_required, safety_sensitive). If these labels are produced by the same model/router under test, they become post-treatment and can bias gates.

**Mitigation:** labelers are treated as dependencies: frozen, versioned, and monitored.

### 12.2 Fingerprint explosion


Overly sensitive fingerprints create excessive baselines and reduce statistical power.

**Mitigation:** fingerprint schemas include only behaviorally meaningful knobs; canonicalization is strict; allowlisted exceptions are documented.

### 12.3 Privacy leakage through telemetry


Raw prompts, retrieved documents, or tool payloads can contain sensitive data.

**Mitigation:** store-by-reference, redaction at ingestion, tiered retention, RBAC, and audit logging.

### 12.4 Metric gaming and ruler drift


Optimization pressure can lead to overfitting to the measurement regime.

**Mitigation:** ruler health checks, anchor sets, mixed measurement stack (proxies + sampled deep eval + periodic human calibration), and holdouts.

## 13. Open questions (to resolve during spec drafting)


- What is the default episode boundary for multi-turn chat products (one turn vs window)?
- What is the minimum required "evidence record" for RAG across products?
- What is the standard taxonomy of termination reasons (timeouts, refusals, truncation, abstention)?
- Which endpoints are mandatory for all products vs product-specific?
- What are the required privacy tiers and retention durations for raw exemplar storage?
- How should counterfactual slice requirements be represented and enforced (e.g., tool_should_have_been_used)?

## Appendix A: Artifact relationship diagram (informal)


- Runtime emits **EpisodeRecord** (per episode).
- Aggregators produce **StateEstimate** (per window/dataset).
- Evaluators compare two StateEstimates to produce **StateDeltaReport**.
- Release pipeline consumes StateDeltaReport to produce **GateReport**.
- Monitoring consumes StateEstimates to produce **ChangePackets** when deltas confirm.

## Appendix B: What to read next


- Normative spec: Episode Trace Schema v1
- Normative spec: Fingerprinting v1
- Normative spec: Slice Catalog v1
- Normative spec: State Objects v1
- Normative spec: Change Detection v1
- Implementation guide: Chat+RAG instrumentation
- Implementation guide: Oncall triage from ChangePacket
