---
draft: false
toc: true
title: "Design Pressure"
linkTitle: "Design Pressure"
---
# Design Pressure Toward Modularity in LLM Systems

## How a Contract-Driven Test System Shapes Architecture (RAG + Function Calling)


This document is a technical reference on **why** and **how** an evaluation/test system should create **design pressure toward modularity** for LLM products -- specifically **RAG + function calling** systems. It is designed as a "research memory" artifact: comprehensive, detailed, and intended to be revisited.

## 1. The core idea: tests as an architectural force


In classical software engineering, tests are not only a verification mechanism. They are also a **design constraint**:

- Code that is hard to test is often:
	- tightly coupled,
	- unclear in responsibilities,
	- entangled with external dependencies,
	- difficult to reason about and evolve.
- A strong test strategy creates **pressure** to introduce:
	- explicit boundaries,
	- smaller units,
	- stable interfaces,
	- better separation of concerns.

### Why this matters more for LLM systems


LLM systems amplify coupling and uncertainty because behavior is a composition of:

- model behavior (weights + decoding + provider updates),
- prompt templates ("text code"),
- retrieval corpora and indexing configurations,
- tool schemas and runtime semantics,
- routing policies and guardrails,
- post-processing and formatting logic.

Many of these are:

- **not typed**,
- **not compiled**,
- **not deterministic**,
- **not stable over time**.

Therefore, your evaluation/test system must intentionally do some of what compilers and type systems do in classical stacks: **force explicitness**.

## 2. First principles: why a test set exists in LLM systems

### The fundamental scaling problem


Systems change faster than manual verification scales. Every change risks breaking:

- **Behavior** (regressions),
- **Assumptions** (edge cases, data shape, invariants),
- **Interfaces** (API/schema/event drift),
- **Non-functional properties** (latency, cost, availability, privacy/safety).

### LLM-specific additions


LLM systems add two structural realities:

1. **Distributional behavior**
    Many outcomes are not binary; there are multiple acceptable responses and correctness is often empirical.
2. **Moving dependencies**
    Even if your code doesn't change, behavior can shift due to:
- model/provider updates,
- index refreshes,
- corpus drift,
- tool schema changes,
- policy/routing updates.

**Engineering objective:** convert change into **controlled learning** rather than uncontrolled risk.

## 3) "Foreseeing qualities" (the architectural properties you want)


These are the properties your system should have _after_ you build a strong evaluation/test regime. The test system's job is to make these qualities the path of least resistance.

### Q1. Modularity and explicit boundaries


Each subsystem has a clear responsibility and interface:

- request normalization/routing,
- retrieval/query/context assembly,
- prompt assembly,
- tool selection/argument formation,
- tool execution,
- response synthesis,
- post-processing + policy enforcement.

### Q2. Replayability (reproducible debugging)


Given a failure, you can replay the run with pinned versions and reproduce the issue.

### Q3. Contractual interfaces (schema + semantics)


Tools and retrieval behave like APIs with:

- versioning,
- compatibility rules,
- error semantics,
- normalization rules (units, dates, locale).

### Q4. Observability-by-design


The system produces the artifacts needed to diagnose and evaluate:

- traces, lineage metadata, retrieved doc IDs, tool calls/outputs, decisions, budgets.

### Q5. Safety/privacy/compliance by construction


Hard constraints are enforced by validators and runtime guardrails, not "the prompt told the model."

### Q6. Controlled stochasticity


Randomness is intentional and bounded; CI gates are stable and deterministic/near-deterministic.

### Q7. Blast-radius control


Changes can be rolled out gradually and attributed:

- prompt versions, model versions, index versions, tool schema versions, feature flags.

### Q8. Failure-driven evolution (data flywheel)


Production failures become regression cases with labeled failure modes and get promoted into suites.

### Q9. Operational efficiency as correctness


Latency/cost budgets are treated as correctness constraints, gated and monitored.

### Q10. Extensibility


Adding a tool/route is standardized: schema + contract tests + sandbox scenario + monitoring slice.

## 4. Mechanism: how tests create design pressure


Design pressure is created when shipping requires artifacts that **cannot exist** unless the architecture has clean boundaries.

The operating pattern is:

1. **Write the contract** (what must be true).
2. **Require artifacts** (what must be produced to prove it).
3. **Gate on those artifacts** (what blocks shipping / triggers alerts).

If a property is not gated or measured, it will not reliably shape architecture.

## 5. The quality contract model (what you enforce)


A robust LLM test system should be organized around a **quality contract** with three components:

1. **Non-negotiable invariants** (hard constraints; deterministic/near-deterministic)
2. **Interface contracts** (tool + retrieval seams; fixtures/record-replay/sandbox)
3. **Semantic objectives** (statistical quality; gate on regression thresholds)

And it must include:

- severities: **blocker / major / minor**,
- standardized **reason codes**,
- a **run manifest** (lineage metadata).

This contract becomes the "spec" that drives the pyramid and the architecture.

## 6. A reference boundary map (testable modular architecture)


A single-turn assistant with RAG + tools can be decomposed into modules that are independently testable.

### A) Request & routing


- normalize input; detect locale/language
- apply tenant config / feature flags
- select tool allowlist
- select RAG policy (required/optional/disabled)
- policy pre-checks (if needed)

**Interface:** `route(request, tenant_ctx) -> RouteDecision`

### B) Retrieval subsystem (RAG)


- query generation (heuristic or LLM-generated)
- retrieval (vector/BM25/hybrid)
- reranking / selection
- context assembly (chunks + formatting)
- provenance metadata for citations

**Interface:** `retrieve(query, retrieval_config) -> RetrievedContext`

### C) Prompt assembly


- render templates
- inject retrieved context + tool schemas
- token budgeting + truncation policy

**Interface:** `render_prompt(request, route, retrieved_context) -> PromptBundle`

### D) Model invocation


- execute model with prompt + tool schemas
- capture raw outputs + tool calls

**Interface:** `invoke_model(prompt_bundle, model_config) -> ModelOutput`

### E) Tool runtime


- validate tool call schema
- execute tool + normalize errors
- parse/normalize tool results
- bounded retries

**Interface:** `execute_tool_call(call, schemas, runtime_policy) -> ToolOutcome`

### F) Response synthesis


- produce final response based on tool outcomes and/or retrieved context
- insert citations (if required)

**Interface:** `synthesize(request, context, tool_outcomes) -> DraftResponse`

### G) Post-processing & enforcement


- formatting contracts
- redaction/sanitization
- invariant validation + fallback/repair

**Interface:** `finalize(draft, enforcement_policy) -> Response`

**Design goal:** each module can be tested with fixtures; dependencies are injected; cross-cutting concerns (safety, budgets, formatting) are expressed as validators, not prompt-only rules.

## 7. How the test pyramid should force modularity


The pyramid is not just about test types; it is an architecture enforcement plan.

### L0 -- Static checks (compile-time pressure)


**Enforces:** explicit configuration and contracts

- prompt templates compile (no missing variables)
- tool schemas validate (JSON schema, versioned)
- routing rules parse and are reviewable
- retrieval config validates

**Pressure outcome:** prompts/schemas/configs become "compile-time artifacts" with explicit structure.

### L1 -- Deterministic unit tests (pure code pressure)


**Enforces:** separation of responsibilities

- prompt rendering deterministic tests
- parsing/normalization tests
- token budgeting and truncation correctness
- redaction correctness
- retry budget logic correctness

**Pressure outcome:** you cannot hide logic in a monolith; you must implement clean interfaces.

### L2 -- Invariant validator plane (contract enforcement pressure)


**Enforces:** non-negotiables without relying on model compliance

Validators should run in CI and (subset) at runtime.

Typical blockers:

- secrets/internal IDs/PII leaks
- prompt/tool schema leakage
- structured output parseability (if required)
- tool call schema validity + allowlist + budget enforcement

Typical majors:

- citation presence when required
- correct empty-retrieval behavior
- truncation signaling
- cost/latency budget violations (often release-gated)

**Pressure outcome:** safety/compliance and format correctness become _system behavior_, not "prompt hope."

### L3 -- Interface contract tests (seam pressure)


**Enforces:** stability at seams that drift (tools, retrieval)

Run with fixtures/record-replay to control dependencies.

Tool contracts:

- tool selection per intent
- args schema validity
- argument semantics (units, date normalization, tenant scoping)
- error handling contract (timeout/auth/validation -> expected behavior)

RAG contracts:

- pinned docs -> required citation mapping
- no unsupported claims (for routes requiring strict grounding)
- retrieval query constraints (if generated): tenant/language filters

**Pressure outcome:** you must implement dependency injection, schema versioning, and replay artifacts.

### L4 -- Hermetic scenario integration (wiring pressure)


**Enforces:** end-to-end correctness under real plumbing with controlled state

Requires seeded sandbox tenants, pinned index versions, sandbox tools.

**Pressure outcome:** forces operational readiness: controlled environments, deterministic datasets, end-to-end replayability.

### L5 -- Statistical semantic evaluation (quality measurement pressure)


**Enforces:** measurable semantic objectives

- correctness, groundedness, instruction following, calibration
- gate on regression thresholds, not perfect pass

**Pressure outcome:** forces dataset/slice management, baselines, and versioned scoring rubrics.

### L6 -- Production monitoring + failure intake (drift pressure)


**Enforces:** continuous verification + learning loop closure

- runtime blockers enforced
- majors monitored (trend and step-change alerts)
- canaries/flags mandatory
- incident -> replay packet -> regression case -> suite updates

**Pressure outcome:** forces observability, lineage metadata, and a disciplined incident-to-regression process.

## 8. The required artifacts that tests force you to build

### 8.1 Run manifest (lineage metadata)


Every run should record:

- git SHA
- prompt template ID/version
- model ID/version + decoding params
- tool schema versions
- retrieval index/config/reranker versions
- validator versions
- slice definition
- budgets (latency/cost/retries)

**Pressure effect:** you can't "ship without knowing what you shipped."

### 8.2 Replay packet (minimum reproducible record)


A replay packet should include:

- request payload + tenant/routing decision
- rendered prompt bundle (or pointers + template versions)
- retrieved doc IDs/snippets/scores + index versions
- tool calls + schema versions + tool outputs/errors
- post-processing outputs
- validator outcomes + reason codes

**Pressure effect:** "cannot reproduce" becomes unacceptable.

### 8.3 Reason code taxonomy


Validators must emit consistent reason codes (examples):

- `SEC.SECRET_LEAK`
- `PRIV.PII_LEAK`
- `PROMPT.PROMPT_LEAK`
- `FMT.JSON_SCHEMA_FAIL`
- `TOOL.DISALLOWED_TOOL`
- `TOOL.ARGS_SCHEMA_FAIL`
- `TOOL.BUDGET_EXCEEDED`
- `RAG.CITATION_MISSING`
- `RAG.CITATION_MAPPING_FAIL`
- `RAG.EMPTY_RETRIEVAL_POLICY_VIOLATION`
- `OPS.LATENCY_BUDGET_FAIL`
- `OPS.COST_BUDGET_FAIL`

**Pressure effect:** teams optimize the architecture to reduce recurring reason codes.

### 8.4 Case format and slicing


Cases must be:

- versioned
- tagged (feature, tool, risk, language, failure_mode)
- runnable across suites

**Pressure effect:** prevents "one-off debugging"; every failure becomes reusable evidence.

## 9. Design patterns that increase testability (and therefore modularity)

### Pattern P1: "Prompts as code" with compilation discipline


- explicit variables and ordering
- deterministic rendering tests
- versioning and review gates

### Pattern P2: Validator plane (design-by-contract for generated artifacts)


- deterministic checks reused in CI, offline eval, and runtime

### Pattern P3: Dependency inversion for retrieval/tools


- retrieval provider interface
- tool execution interface
- standardized tool error model

### Pattern P4: Route-based policies and allowlists


- tool availability and citation requirements per route
- budgets per route
- distinct slice definitions per route

### Pattern P5: Budget enforcement as code


- budgets are explicit thresholds, not "monitoring-only"
- gating rules in release criteria

### Pattern P6: Record/replay as the primary debugging workflow


- every incident must be replayable
- replay packets become regression cases

## 10. Anti-patterns and how a good test system exposes them

### Anti-pattern A: "Prompt soup"


**Symptom:** adding one rule breaks unrelated behaviors

**Test signal:** failures scattered across many L3 slices

**Refactor:** move constraints to validators; isolate formatting; separate retrieval/tool policies.

### Anti-pattern B: Non-hermetic suites ("flake factory")


**Symptom:** CI fails randomly; failures aren't reproducible

**Test signal:** L4 failures vary run-to-run

**Refactor:** pinned index versions, seeded sandboxes, fixtures/record-replay.

### Anti-pattern C: Using LLM-as-judge as a PR gate


**Symptom:** flaky CI and inconsistent decisions

**Test signal:** PR gate instability

**Refactor:** keep PR gates deterministic; reserve statistical evaluation for L5.

### Anti-pattern D: No version pinning


**Symptom:** "worked yesterday" but cannot reproduce today

**Test signal:** missing run manifest fields

**Refactor:** "no manifest, no ship" policy; trace completeness validators.

### Anti-pattern E: Tool schema drift without contracts


**Symptom:** tool calls start failing after tool update

**Test signal:** L3 tool contract failures

**Refactor:** schema versioning, compatibility windows, dual-read/dual-write patterns where appropriate.

## 11. A step-by-step build plan (if you were to implement this)

### Phase 1: Define the contract + evidence schema


- invariants list (IDs, severities, reason codes)
- tool contracts (schema + semantics + error model)
- retrieval contracts (index/versioning + provenance + citation rules)
- semantic objectives + slice taxonomy
- run manifest schema

### Phase 2: Implement L0/L1/L2 foundations


- template/schema compilation checks
- pure unit tests for render/parse/redact/truncate/budgets
- validator library and runtime enforcement for blockers

### Phase 3: Implement L3 contract harness


- fixtures/record-replay for tools and retrieval
- tool selection + arg normalization cases
- citation mapping and grounding cases
- replay packet runner

### Phase 4: Add L4 sandbox


- seeded data and pinned index snapshots
- money-path scenarios
- regression promotion workflow

### Phase 5: Add L5 semantic evaluation governance


- baselines and regression thresholds
- calibrated judge or human review process
- slice dashboards

### Phase 6: Close the loop with L6


- canary rollout playbook
- drift dashboards
- incident -> replay -> regression SLA

## 12. A compact "Quality -> Artifact -> Gate" matrix


|Desired quality|Required artifact|Enforced by|Gate/Signal|
|---|---|---|---|
|Modularity|explicit layer interfaces|L1 + L3|PR gate stability + localized failures|
|Replayability|replay packets + version pinning|L3 + L4|reproducible incidents|
|Tool contracts|schema versions + semantics + error model|L0 + L3|contract suite pass|
|RAG contracts|index/config versions + provenance|L3 + L4|citation/grounding pass|
|Safety/privacy|deterministic invariants|L2 + runtime|blocker = hard stop|
|Controlled stochasticity|hard vs soft suite separation|governance|low CI flake|
|Blast radius|canaries + lineage metadata|L6|bounded rollout impact|
|Efficiency|route budgets|L4/L5/L6|cost/latency gates|
|Learning loop|incident -> regression intake|L6 -> L3/L5|recurrence declines|

## 13. Research directions / search terms

### Evaluation architecture


- design-by-contract for LLM outputs
- consumer-driven contracts for tool calling
- record/replay testing for RAG systems
- slice-based evaluation and regression thresholds

### Retrieval


- chunking/index drift and evaluation
- grounding/attribution verification
- prompt injection via retrieved content

### Tool calling


- schema drift and compatibility strategies
- argument normalization and semantic validation
- bounded retries, fallback policies

### Statistical evaluation


- calibration of LLM-as-judge
- rubric design and inter-rater agreement
- confidence intervals for regressions

### Observability


- trace completeness contracts
- privacy-preserving logging/redaction
- online drift detection

## 14. Takeaway


A well-designed LLM evaluation/test system is an architectural tool:

- It forces explicit boundaries.
- It enforces contracts where drift happens.
- It makes failures replayable.
- It replaces "prompt hope" with deterministic guardrails and measurable objectives.

A reliable heuristic: **if something is painful to test stably, it is almost always poorly modularized or incorrectly coupled to volatile dependencies.**
