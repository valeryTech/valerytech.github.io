---
draft: false
toc: true
title: "Hitl Copilot Syllabus"
linkTitle: "Hitl Copilot Syllabus"
---
# Track Syllabus: HITL Copilot Engineering (Human-in-the-Loop) -- 8 weeks


Goal: build a portfolio-grade **copilot** system where humans can **review, interrupt, edit, and approve** actions safely. This track emphasizes long-lived state, UX/latency masking, auditability, and risk-tiered autonomy.

## Target outcomes (end state)


A copilot system that supports:

- **Long-running runs** with durable state (pause/resume across minutes-hours-days)
- **Interruptibility** (cancel, pause, edit, resume) with clear semantics
- **Approval gates** (risk-tiered) for write-capable or high-stakes actions
- **Streaming + optimistic UI** for low perceived latency
- **Review UX** that shows evidence/citations and tool-call previews
- **Auditable trails** (who approved what, with what inputs/outputs)
- **Scenario evaluation** for HITL (success, review burden, interruptions, recovery)
- Optional: integrate with your Agent Runtime track (FSM/DAG + tools)

Durable artifacts:

- `HITL_STATE_MODEL.md` (states, transitions, review queue, terminal states)
- `INTERRUPT_SEMANTICS.md` (cancel/pause/edit rules; invalidation; idempotency)
- `APPROVAL_POLICY.md` (risk tiers, who approves, what requires review)
- `AUDIT_LOG_SCHEMA.md` (event log model; privacy boundaries; retention)
- `UX_FAILURE_CASES.md` (edge cases: refresh, double-submit, partial updates)
- `REVIEW_METRICS.md` (time-to-approve, abandon rate, revision loops)
- `SCENARIO_EVALS_HITL.md` (task suite + gates)
- `RUNBOOKS_HITL.md` (stuck runs, inconsistent state, approval backlog)

## Weekly operating loop (always)


Each week produces:

1. One capability
2. One measurement output (scenario eval / UX metrics / failure injection)
3. One leverage artifact (policy doc, state model, runbook)

## Reference stack (adapt as needed)


- API: FastAPI
- UI: minimal web UI (React) or CLI + web hooks (either is fine)
- State store: Postgres (authoritative run state) + Redis (ephemeral locks/queues)
- Queue: Redis/RQ/Celery (approval jobs + background execution)
- Observability: OpenTelemetry traces + structured logs
- Auth (light): user roles for approvals (even if local-dev only)

## Schedule overview


| Week | Theme | Capability | Measurement output | Leverage artifact |
|---|---|---|---|---|
| 1 | HITL core loop | Reviewable run model + minimal UI | Baseline review metrics skeleton | `HITL_STATE_MODEL.md` v1 |
| 2 | Interruptibility | Cancel/pause/resume + edit flow | Interrupt success rate + invariants tests | `INTERRUPT_SEMANTICS.md` v1 |
| 3 | Approval gates | Risk-tiered approvals + role model | Approval latency + backlog simulation | `APPROVAL_POLICY.md` v1 |
| 4 | Auditability | Event-sourced audit log + redaction | Audit completeness report | `AUDIT_LOG_SCHEMA.md` v1 |
| 5 | Latency masking | Streaming + optimistic UI patterns | TTFT perceived vs actual; abandon rate | `UX_FAILURE_CASES.md` v1 |
| 6 | Safe tool previews | Tool-call "dry run" + diff preview | Reviewer error rate / reversal rate | `RUNBOOKS_HITL.md` v1 |
| 7 | Evaluation gates | HITL scenario suite in CI | Gates: success + review burden + errors | `SCENARIO_EVALS_HITL.md` v1 |
| 8 | Packaging | Case study + bullets | Final benchmark pack + known limits | `CASE_STUDY.md` + `REVIEW_METRICS.md` |

## Week-by-week detail

### Week 1: HITL core loop (make review a first-class state)


**Capability**

- Define a run object with:
	- `run_id`, `user_id`, `status`, `current_step`, `artifacts`, `created_at`
	- statuses like: `RUNNING`, `WAITING_REVIEW`, `APPROVED`, `REJECTED`, `CANCELLED`, `FAILED`, `COMPLETED`
- Build a minimal UI:
	- list runs
	- view run details (steps, citations/evidence)
	- approve/reject a pending run

**Measurement output**

- Metrics skeleton:
	- time-to-first-response
	- time-to-approve
	- abandon rate (pending too long)

**Leverage artifact**

- `docs/HITL_STATE_MODEL.md` v1:
	- state diagram
	- what causes transitions
	- what is persisted vs ephemeral

### Week 2: Interruptibility (cancel/pause/edit/resume semantics)


**Capability**

- Add interrupt controls:
	- cancel: stop execution, mark terminal
	- pause: stop execution, preserve resumable state
	- edit: user modifies inputs or constraints (what invalidates prior steps?)
	- resume: continue from valid checkpoint
- Add invariants:
	- no double execution of side effects
	- resumed run uses a new `run_revision` (or version) when edited

**Measurement output**

- Interrupt tests:
	- interrupt success rate under load
	- "exactly-once" invariants on write-like steps (use dry-run if needed)

**Leverage artifact**

- `docs/INTERRUPT_SEMANTICS.md` v1:
	- cancel vs pause vs edit rules
	- which steps are replayable
	- idempotency approach when resuming

### Week 3: Approval gates (risk-tiered autonomy)


**Capability**

- Define risk tiers:
	- Tier 0: read-only, auto-run
	- Tier 1: reversible writes, optional review
	- Tier 2: irreversible writes, mandatory approval
- Implement role model:
	- requester vs approver
	- who can approve what
- Add review queue:
	- prioritization and SLA hints

**Measurement output**

- Backlog simulation:
	- inject pending reviews
	- measure approval latency and abandonment
	- identify where automation can reduce review burden

**Leverage artifact**

- `docs/APPROVAL_POLICY.md` v1:
	- tier definitions
	- decision rule for requiring review
	- fallback behavior when reviewers are unavailable

### Week 4: Auditability (event log and privacy boundaries)


**Capability**

- Implement an append-only audit log:
	- events: created, step_started, step_finished, waiting_review, approved, rejected, resumed, cancelled
	- store hashes/IDs for sensitive payloads
- Add retention and redaction boundaries:
	- what is safe to store
	- what is referenced by ID only

**Measurement output**

- Audit completeness report:
	- % runs with complete event timeline
	- missing-event detection

**Leverage artifact**

- `docs/AUDIT_LOG_SCHEMA.md` v1:
	- event schema
	- privacy boundaries
	- how to reconstruct a run's history

### Week 5: Latency masking (streaming + optimistic UI)


**Capability**

- Streaming:
	- stream partial results (tokens or step progress)
	- show intermediate "evidence selected" states
- Optimistic UI:
	- update UI immediately on user actions (approve/cancel) while backend confirms
- Consistency strategy:
	- server as source of truth; client reconciles with event stream
	- handle refresh without double-submit

**Measurement output**

- "Perceived latency" report:
	- TTFT vs "time-to-meaningful-update"
	- abandonment rate changes with streaming

**Leverage artifact**

- `docs/UX_FAILURE_CASES.md` v1:
	- refresh/retry/double-click hazards
	- optimistic update rollback patterns
	- streaming edge cases and mitigations

### Week 6: Safe tool previews (reviewable actions)


**Capability**

- Add "dry-run / preview" for write-capable steps:
	- show intended changes ("diff" or summary)
	- require explicit approval to execute
- Add reversal plan where possible:
	- if reversible, provide "undo" (or compensation) path

**Measurement output**

- Reviewer error metrics:
	- reject rate by tier
	- "reversal/undo" rate (proxy for bad approvals)
	- time spent per review

**Leverage artifact**

- `docs/RUNBOOKS_HITL.md` v1:
	- stuck in review
	- inconsistent state after edit
	- approval backlog incident handling

### Week 7: Evaluation gates (HITL scenario suite in CI)


**Capability**

- Define a HITL scenario suite:
	- tasks that require approvals
	- tasks that are interrupted mid-run
	- tasks with user edits that invalidate prior steps
- Add CI gates:
	- minimum task success rate
	- maximum review burden (time/steps) for baseline scenarios
	- invariants: no duplicate side effects, audit completeness

**Measurement output**

- Scenario report:
	- success by scenario type
	- review burden metrics
	- failure slices (where humans intervene most)

**Leverage artifact**

- `docs/SCENARIO_EVALS_HITL.md` v1:
	- scenario definitions
	- gates and thresholds
	- known weak spots and next improvements

### Week 8: Packaging (make it interview-ready)


**Capability**

- Harden:
	- stable state transitions
	- operator-friendly tracing ("why stuck?")
	- clear separation between preview and execute
- Ensure reproducibility:
	- seeded demo data
	- scripted scenarios

**Measurement output**

- Final benchmark pack:
	- success + review burden
	- interruption/edit success rates
	- approval latency under backlog
	- known limits

**Leverage artifact**

- `docs/CASE_STUDY.md`:
	- Decision rule -> Mechanism -> Proof for:
		- approval policy
		- interrupt semantics
		- audit boundaries
- `docs/REVIEW_METRICS.md`:
	- what you measure and why
- `docs/RESUME_BULLETS.md`:
	- bullets grouped by HITL, Reliability, Safety, UX/Latency

## Deliverable checklist


- Durable run state with review queue and revisions
- Cancel/pause/edit/resume with invariants
- Risk-tiered approvals and role model
- Append-only audit log with privacy boundaries
- Streaming + optimistic UI with reconciliation
- Preview-before-execute for write steps
- HITL scenario evals gated in CI
- Core artifacts in `docs/`
