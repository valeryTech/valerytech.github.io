---
draft: false
toc: true
title: "Patterns"
linkTitle: "Patterns"
---
# Agent Engineering Pattern Catalog


This document is a practical catalog of implementation patterns for building **reliable systems around stochastic models**. Each pattern is written to be directly usable for design docs, code reviews, and interview narratives.

Template used for each pattern:

- **When to use**
- **Decision rule**
- **Mechanism**
- **Failure modes**
- **Metrics**
- **Artifacts**
- **Implementation notes**

## Pattern 1: Sandwich Pattern (Deterministic -> Model -> Deterministic)


**Summary:** Wrap a probabilistic model call with deterministic pre/post layers so the system behavior remains testable and bounded.

**When to use**

- Any time model output feeds software (tools, DB writes, routing, user-visible decisions).
- Any system where failure must be explainable (supportability, SLAs, audit).

**Decision rule**

- The model is never the system boundary. Contracts live at the boundary.

**Mechanism**

- Pre:
	- Normalize inputs (canonicalize IDs, strip boilerplate, locale/units)
	- Route (deterministic rules/cheap classifier)
	- Enforce budgets (latency/cost/tool)
	- Gate risk (read vs write; approval policy)
	- Build explicit state object (no hidden prompt-only state)
- Model:
	- Constrained generation (schema/typed)
	- Stable prompt/versioning
	- Temperature/retry policies by route
- Post:
	- Parse + validate
	- Bounded repair (or fail-closed)
	- Tool preflight validation
	- Tracing/logging boundaries (IDs/hashes vs raw sensitive text)

**Failure modes**

- Post layer accepts invalid output (silent failure).
- Repair loops hide regressions.
- Pre layer routes incorrectly and starves quality path.

**Metrics**

- Parse success rate
- Schema-valid rate
- Silent failure rate (invalid but accepted)
- Time-to-diagnosis (TtD)

**Artifacts**

- Schemas + validators
- Stop reason taxonomy
- Prompt/version registry
- Replay fixtures

**Implementation notes**

- Treat validation failures as first-class outcomes; do not "best effort" into production state.

## Pattern 2: Probabilistic Contracts (Postconditions with probability bounds)


**Summary:** Design-by-contract for stochastic components. Contracts define preconditions and probabilistic postconditions, and enforcement is achieved through runtime checks + offline measurement + gated release.

### 2.1 Contract model


A contract for a model step or sub-system can be written as:

- **Pre**: deterministic constraints required before invocation
- **Post (probabilistic)**: properties expected to hold with high probability under an operational profile
- **State**: allowed transitions and invariants across turns/steps
- **Profile**: model/version, temperature, retry budget, thresholds

Practical contract statement examples:

- Format: `Pr[parse(schema_X(output))] >= 0.98`
- Safety: `Pr[tool_args_valid] >= 0.99` AND `Pr[write_without_approval] = 0`
- Grounding: `Pr[citations_present] >= 0.95`
- Termination: `Pr[run_terminates_within_budget] >= 0.99`

### 2.2 Enforcement (how you make it real)


You cannot enforce probabilities per single call. You enforce the contract by combining:

1. **Runtime barriers** (every request)
- Validate outputs; fail-closed
- Stop reasons on termination
- Budget enforcement (time/cost/tool)
- Deterministic fallbacks
1. **Bounded retries/repairs** (per request)
- Explicit retry budget (attempt count, time budget)
- Repair only for format errors; do not repair semantics without verification
1. **Fallback routing** (per request)
- Route to stronger model only on uncertainty or contract failure
- Escalate to HITL where risk demands it
1. **Offline measurement + release gating** (per change)
- Evaluate on a scenario suite / golden set
- Gate merges/deployments on contract satisfaction metrics

### 2.3 What to measure


Use three contract metrics (minimal but sufficient):

- **CSR (Contract Satisfaction Rate):** % of runs satisfying Pre + Post barriers
- **SFR (Silent Failure Rate):** % of runs violating contract without triggering a stop reason
- **COB (Contract Overhead Budget):** latency/cost overhead added by enforcement

### 2.4 Composition (multi-step systems)


For a pipeline of steps, end-to-end reliability is constrained by the weakest contract unless you add barriers. Practically:

- enforce contracts at every boundary (retrieve -> assemble -> generate -> tool)
- isolate failures with stop reasons
- avoid "best effort" propagation of invalid intermediate states

**Failure modes**

- Contract thresholds are aspirational but not measured.
- The contract is satisfied by repair loops that hide regressions.
- "Success" ignores cost/latency -> contract passes but system fails in production.

**Artifacts**

- `CONTRACTS.md` (thresholds per route)
- `EVAL_GATES.md` (what blocks merge/deploy)
- `STOP_REASONS.md`
- `REPLAY.md` (how to reproduce)

**Implementation notes**

- Treat contract thresholds as part of the API. Changing them requires an ADR.

## Pattern 3: Proposer-Verifier (System 1 / System 2 split)


**Summary:** One component proposes candidates cheaply; a separate verifier validates correctness/safety before committing to side effects.

**When to use**

- Tool calling, especially write-capable actions.
- Any task with cheap generation but expensive/unsafe execution.

**Decision rule**

- Writes are never executed on a single-pass model output. Execution is gated by verification.

**Mechanism**

- Proposer (fast): generate plan/tool call candidates in a strict schema.
- Verifier (slow/strong):
	- deterministic checks: schema, permissions, invariants, idempotency key
	- tool-based checks: dry-run, sandbox execution, diff preview
	- optional model-based critique with rubric
- Arbiter: decide approve/reject/revise/escalate based on verifier signals.

**Failure modes**

- Verifier only checks form (schema) but not semantics.
- Proposer/verifier "collude" (same model grading itself).
- Retry loops (proposer repeatedly fails) without bounded attempts.

**Metrics**

- Tool correctness rate
- Rejection rate by verifier reason
- Duplicate-side-effect rate (must be ~0 for writes)
- Cost-per-success and escalation rate

**Artifacts**

- `TOOL_CATALOG.md` (contracts + permissions)
- `APPROVAL_POLICY.md` (risk tiers)
- `SCENARIO_EVALS.md` (tool tasks)

**Implementation notes**

- Start with deterministic verifiers; only add model verifiers where constraints are not formalizable.

## Pattern 4: Plan-Commit Split (preview before side effects)


**Summary:** For write-capable actions, produce an explicit plan/preview and only execute after approval (human or policy).

**When to use**

- Irreversible writes or actions with high blast radius.

**Decision rule**

- If the action is not easily reversible, it requires an approval boundary.

**Mechanism**

- Phase 1: plan
	- emit tool call(s) + predicted diff/impact
	- compute risk tier
- Phase 2: commit
	- re-validate preconditions
	- execute with idempotency key
	- persist audit event

**Failure modes**

- Plan becomes stale (preconditions changed before commit).
- Preview does not match actual effect.

**Metrics**

- Approval latency
- Plan-to-commit mismatch rate
- Reversal/undo rate

**Artifacts**

- `APPROVAL_POLICY.md`
- `AUDIT_LOG_SCHEMA.md`
- `COMPENSATION_TABLE.md`

## Pattern 5: Tool Gateway (Contract-first tool access)


**Summary:** Centralize all tool access behind a gateway that enforces schemas, permissions, logging boundaries, retries, and idempotency.

**When to use**

- More than 1-2 tools, or any tool with write side effects.

**Decision rule**

- Tools are part of platform surface area; they must have contracts and governance.

**Mechanism**

- Strict schemas for args/results
- Preflight validation (types, ranges, allowlists)
- RBAC/allowlists per tool/action
- Standard retry/timeout/circuit-breaker behavior
- Idempotency and dedupe storage
- Audit logging and correlation IDs

**Failure modes**

- Bypasses (direct tool calls outside gateway).
- Inconsistent retry behavior across tools.

**Metrics**

- Schema-valid rate
- Tool error distribution
- Retry rate and timeout rate

**Artifacts**

- `TOOL_CATALOG.md`
- `TRACE_SEMANTICS.md`
- `RECOVERY_PLAYBOOK.md`

## Pattern 6: Router-first + Escalation (Deterministic first, loop only when justified)


**Summary:** Prefer deterministic routing/DAG paths and only allow probabilistic loops for high-variance cases.

**When to use**

- High QPS, cost sensitivity, or tight latency budgets.

**Decision rule**

- Default path must be deterministic and budget-bounded. Loops are opt-in.

**Mechanism**

- Router classifies request type and picks path:
	- deterministic handler
	- retrieval-only
	- propose-verify tool path
	- bounded reasoning loop
- Escalate to stronger model only on uncertainty.

**Failure modes**

- Router misclassification.
- Escalation storms under distribution shift.

**Metrics**

- Route distribution
- Escalation rate and reasons
- Loop rate

**Artifacts**

- `ROUTING_POLICY.md`
- Per-route eval reports

## Pattern 7: Bounded Loop Executor (Stop reasons as a contract)


**Summary:** If you use loops (ReAct-like), bound them with explicit stop reasons and budgets.

**When to use**

- Tasks that require iterative tool use.

**Decision rule**

- Any loop must have explicit termination conditions and a safe fallback.

**Mechanism**

- Budgets:
	- max iterations
	- max tool calls
	- max wall-clock
	- cost cap
- Stop reasons:
	- SUCCESS
	- BUDGET_EXCEEDED
	- LOOP_DETECTED
	- TOOL_ERROR
	- APPROVAL_REQUIRED
	- UNSAFE
- Loop detection:
	- signature of (state, last tool call, last observation)
	- detect repeats above threshold

**Failure modes**

- Infinite loops due to missing stop reasons.
- "Repair loops" that hide upstream quality issues.

**Metrics**

- Stop-reason distribution
- Avg iterations and tail iterations
- Loop-detected rate

**Artifacts**

- `STATE_MODEL.md`
- `STOP_REASONS.md`

## Pattern 8: Checkpoint + Replay (Debuggable runs)


**Summary:** Persist run state and tool results so you can replay deterministically for debugging and evaluation.

**When to use**

- Any multi-step system, HITL, or tool execution.

**Decision rule**

- If a system can't be replayed, it can't be reliably operated.

**Mechanism**

- Persist:
	- input snapshot
	- step history
	- tool call records (hashed/redacted)
	- checkpoints at safe boundaries
- Replay modes:
	- "replay with recorded tool results"
	- "replay with mocked tools"

**Failure modes**

- Missing data (cannot reconstruct run).
- Logging sensitive payloads.

**Metrics**

- Replay success rate
- Time-to-diagnosis before/after replay

**Artifacts**

- `REPLAY.md`
- `AUDIT_LOG_SCHEMA.md`

## Pattern 9: Degradation Tiers (Stay up under pressure)


**Summary:** Define explicit modes that trade quality for latency/cost under load, with measurable triggers.

**When to use**

- Any system with tail-latency risk or variable cost.

**Decision rule**

- Degradation is a product feature: explicit, tested, and reversible.

**Mechanism**

- Tier examples:
	- Tier 0: cached answer only
	- Tier 1: cheap route only (no rerank/escalation)
	- Tier 2: hybrid retrieval, tight timeouts
	- Tier 3: full path
- Triggers:
	- queue depth, P95 latency, error rate, cost spike

**Failure modes**

- Silent degradation (users see worse results with no signal).
- Tier flapping (rapid switching).

**Metrics**

- Tier distribution
- Availability under load
- Quality proxies by tier

**Artifacts**

- `DEGRADATION_TIERS.md`
- `LATENCY_BUDGET.md`

## Pattern 10: Eval Gates + Canary + Rollback (Lifecycle control)


**Summary:** Treat prompts/policies/routes as deployable artifacts with CI gates and safe rollout.

**When to use**

- Any production change to prompts, routing, retrieval settings, tool policies.

**Decision rule**

- No change ships without baseline vs candidate evidence.

**Mechanism**

- Offline:
	- scenario suite + golden set
	- tiered CI gates (smoke -> deep)
- Online:
	- shadow/canary
	- rollback triggers

**Failure modes**

- Offline eval mismatch to prod distribution.
- Canary too small / too short to detect regressions.

**Metrics**

- Regression catch rate
- Canary alert precision
- Rollback frequency

**Artifacts**

- `RETRIEVAL_EVALS.md` / `SCENARIO_EVALS.md`
- `ROLLBACK.md`
- `FAILURE_MODES.md`

## Pattern 11: Context Policy (Selection, pruning, compression)


**Summary:** Make context window management explicit and measurable.

**When to use**

- Any RAG system with non-trivial corpus or long documents.

**Decision rule**

- Context is a budgeted resource; inclusion order must be intentional.

**Mechanism**

- Selection: top-K + diversity constraints
- Pruning: token cap with explicit drop order
- Compression: summarize low-value segments; keep high-value verbatim
- Freshness: TTL / reindexing cadence and staleness detection

**Failure modes**

- Overstuffed context reduces answer quality.
- Stale summaries drift.

**Metrics**

- Recall@K / NDCG@K by slice
- Context token utilization
- Source diversity

**Artifacts**

- `CONTEXT_POLICY.md`
- `FRESHNESS_SLA.md`

## Pattern 12: HITL Approval Queue (Reviewable autonomy)


**Summary:** Introduce human approvals as first-class states with durable queueing and audit.

**When to use**

- Writes, compliance, high-risk actions, public-facing systems.

**Decision rule**

- The system must be interruptible and auditable.

**Mechanism**

- Durable run state with revisions
- Approval queue with roles
- Preview/dry-run diffs
- Audit log of approvals
- Resume with re-validation of preconditions

**Failure modes**

- Runs stuck in review with no SLA.
- Double execution after refresh/retry.

**Metrics**

- Approval latency and backlog
- Interrupt/resume success rate
- Post-approval rollback rate

**Artifacts**

- `HITL_STATE_MODEL.md`
- `APPROVAL_POLICY.md`
- `AUDIT_LOG_SCHEMA.md`

## Minimal pattern set (high ROI)


If you want the smallest set that still reads as "agent systems engineer":

- Sandwich Pattern
- Probabilistic Contracts
- Proposer-Verifier
- Tool Gateway
- Bounded Loops + Stop Reasons
- Checkpoint + Replay
- Degradation tiers + rollout gates
