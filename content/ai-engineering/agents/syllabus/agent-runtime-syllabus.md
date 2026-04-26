---
draft: false
toc: true
title: "Agent Runtime Syllabus"
linkTitle: "Agent Runtime Syllabus"
---
# Track Syllabus: Agent Runtime Engineering (8 weeks)


Goal: build a portfolio-grade **bounded autonomy runtime**: contract-first tools, explicit state, replayability, budgets, and recovery. This track is for roles where "agent" work is really **distributed systems + safety + operability**.

## Target outcomes (end state)


A runtime that supports:

- Graph/FSM execution (router-first with bounded loops)
- Contract-first tools (schemas, preflight validation, allowlists/RBAC)
- Side-effect safety (idempotency, compensations, DLQ, replay)
- Interaction model support (background + optional HITL approval gates)
- Observability for "why did it do that?" (traceable plans/steps)
- Scenario evaluation gated in CI (task success + cost + latency + tool correctness)
- Budgets (time/cost/tool calls) and stop reasons

Durable artifacts:

- `STATE_MODEL.md` (states, transitions, stop reasons, replay strategy)
- `TOOL_CATALOG.md` (tools, schemas, permissions, idempotency rules)
- `AUTONOMY_ENVELOPE.md` (what can run without approval; risk tiers)
- `SCENARIO_EVALS.md` (task suite, metrics, gates)
- `RECOVERY_PLAYBOOK.md` (DLQ, replay, partial failures, compensations)
- `TRACE_SEMANTICS.md` (what gets traced/logged and privacy boundaries)
- `BUDGETS_AND_DEGRADATION.md` (timeouts, limits, fallback modes)
- ADRs for major decisions (FSM vs DAG, retry model, tool gateway boundary)

## Weekly operating loop (always)


Each week produces:

1. **One capability**
2. **One measurement output** (scenario eval/benchmark/failure injection)
3. **One leverage artifact** (policy doc, ADR, runbook)

## Schedule overview


| Week | Theme | Capability | Measurement output | Leverage artifact |
|---|---|---|---|---|
| 1 | Runtime skeleton | Minimal step runner + tool interface | Scenario harness skeleton | ADR-000: autonomy scope |
| 2 | Tool gateway | Schema validation + allowlists/RBAC | Tool correctness + schema-valid rate | `TOOL_CATALOG.md` v1 |
| 3 | State + replay | Persisted FSM + checkpoint/replay | Replayability test + determinism report | `STATE_MODEL.md` v1 |
| 4 | Budgets + stop reasons | Time/cost/tool budgets + stop taxonomy | Budget sensitivity (success vs cost) | `BUDGETS_AND_DEGRADATION.md` v1 |
| 5 | Side-effect safety | Idempotency + compensations + DLQ | Failure injection (timeouts/partials) | `RECOVERY_PLAYBOOK.md` v1 |
| 6 | Router-first autonomy | Router/DAG + bounded loop executor | Loop-rate + fallback-rate report | `AUTONOMY_ENVELOPE.md` v1 |
| 7 | Observability | Trace semantics + step-level diagnostics | "Why did it do that?" trace pack | `TRACE_SEMANTICS.md` v1 |
| 8 | Hardening + packaging | CI gates + canary/rollback hooks | Final benchmark pack + known limits | `CASE_STUDY.md` + bullets |

## Week-by-week detail

### Week 1: Runtime skeleton


**Capability**

- Define core primitives:
	- `Step` (name, inputs, outputs, stop reason)
	- `ToolCall` (tool id, args, result, errors)
	- `RunState` (run_id, step history, current state, budgets)
- Build a minimal executor:
	- sequential steps (no branching yet)
	- in-memory state (persist later)
- Implement a tiny tool set (2-3 tools):
	- `retrieve/search` (read-only)
	- `classify` (read-only)
	- `create-record-dry-run` (write-like but non-destructive)

**Measurement output**

- Scenario eval skeleton:
	- define scenario format (input, expected tool sequence, success criteria)
	- metrics: task success, tool correctness, cost, latency

**Leverage artifact**

- `ADR/ADR-000-autonomy-scope.md`:
	- what tasks your runtime will support
	- what "success" means and what you won't attempt

### Week 2: Tool gateway (contracts + permissions)


**Capability**

- Tool contracts:
	- Pydantic/JSON Schema for args and results
	- preflight validation (types, ranges, required fields)
- Permissions:
	- allowlists by tool
	- simple RBAC model (role -> allowed tools/actions)
- Auditing:
	- log tool id + args hash + result class (avoid raw sensitive text)

**Measurement output**

- Tool correctness suite:
	- schema-valid rate
	- preflight rejection rate (bad calls blocked)
	- tool success/failure distribution

**Leverage artifact**

- `docs/TOOL_CATALOG.md` v1:
	- tool list + schemas
	- permissions matrix
	- logging boundaries
	- idempotency expectations per tool

### Week 3: State + replayability


**Capability**

- Persist run state (Postgres or durable store):
	- run_id, step history, checkpoints
	- tool call records (with safe redaction)
- Implement replay:
	- re-run from checkpoint using recorded tool outputs (or mocked)
	- deterministic re-execution for debugging

**Measurement output**

- Determinism report:
	- replay success rate
	- divergence detection (where does replay differ?)
- Add a unit test: "same inputs + recorded tool results -> same final state"

**Leverage artifact**

- `docs/STATE_MODEL.md` v1:
	- states and transitions
	- checkpoint model
	- replay strategy and limitations

### Week 4: Budgets + stop reasons


**Capability**

- Implement budgets:
	- max steps, max tool calls
	- max wall-clock time
	- cost budget (tokens or estimated cost) if you call a model
- Implement stop reasons:
	- `BUDGET_EXCEEDED`, `TOOL_ERROR`, `LOOP_DETECTED`, `APPROVAL_REQUIRED`, etc.
- Add graceful degradation modes:
	- switch to router-only path
	- skip non-critical steps
	- require human approval instead of continuing

**Measurement output**

- Budget sensitivity analysis:
	- vary budgets and measure success vs cost/latency
	- identify "minimum viable budgets" per scenario class

**Leverage artifact**

- `docs/BUDGETS_AND_DEGRADATION.md` v1:
	- budgets by tier
	- stop reason taxonomy
	- degradation tiers and triggers

### Week 5: Side-effect safety (idempotency, compensations, DLQ)


**Capability**

- Idempotency keys:
	- per tool call and per "business action"
	- dedupe window and storage
- Compensations/saga patterns:
	- define compensation for each write-capable action (even if your tools are mostly dry-run)
- DLQ:
	- failed runs go to DLQ with reason and replay instructions
	- manual replay tool (CLI) that can resume from checkpoint

**Measurement output**

- Failure injection suite:
	- tool timeouts, partial success, transient errors
	- measure recovery rate, duplicate-write rate, DLQ volume
- Demonstrate replay from DLQ after fixing an issue (synthetic is fine)

**Leverage artifact**

- `docs/RECOVERY_PLAYBOOK.md` v1:
	- failure classes and recovery steps
	- replay procedure
	- compensation strategy table

### Week 6: Router-first autonomy (DAG/FSM + bounded loops)


**Capability**

- Add routing:
	- deterministic router chooses a path based on input class and confidence
	- bounded loop executor for high-variance steps only
- Add loop controls:
	- max iterations
	- loop detection via state signatures
	- "escalate to human" when stuck

Optional (if you want HITL):

- approval gate states + resume

**Measurement output**

- Autonomy report:
	- loop rate by scenario
	- fallback-to-deterministic rate
	- approval-required rate (if HITL)
	- cost per success by path

**Leverage artifact**

- `docs/AUTONOMY_ENVELOPE.md` v1:
	- what runs automatically vs requires approval
	- risk tiers and allowed tool scopes
	- why router-first and where loops are allowed

### Week 7: Observability ("why did it do that?")


**Capability**

- Step-level tracing:
	- span per step and tool call
	- attach stop reason, route taken, budgets remaining
- Diagnostics:
	- export a "run trace bundle" (JSON) safe to share internally
	- minimal UI/CLI to inspect runs (optional)

**Measurement output**

- "Explainability pack":
	- for 10 sample runs, capture route, steps, tool calls, stop reasons
	- measure time-to-diagnose (self-timed) before/after trace bundle

**Leverage artifact**

- `docs/TRACE_SEMANTICS.md` v1:
	- what is traced/logged
	- sampling rules and privacy boundaries
	- how to use traces to debug common failures

### Week 8: Hardening + interview packaging


**Capability**

- CI gates:
	- scenario eval suite runs on PRs
	- minimum thresholds for success/cost/latency/tool correctness
- Rollback hooks:
	- feature flags for routing and tool availability
	- canary run mode for new policies

**Measurement output**

- Final benchmark pack:
	- scenario success by class
	- cost/latency distributions
	- known limits + top failure modes
- Demonstrate a rollback on a synthetic regression (policy change that worsens success)

**Leverage artifact**

- `docs/CASE_STUDY.md`:
	- Decision rule -> Mechanism -> Proof for your top 2 runtime decisions
- `docs/RESUME_BULLETS.md`:
	- bullets grouped by Autonomy, Safety/Recovery, Economics, Observability

## Deliverable checklist


- Tool gateway with schemas + allowlists/RBAC + audit logging boundaries
- Persisted run state with checkpoint/replay
- Budgets and stop reasons with degradation tiers
- Idempotency + DLQ + compensation strategy
- Router-first executor with bounded loops
- Step-level observability and trace bundle export
- Scenario evaluation suite gated in CI
- Core artifacts in `docs/`
