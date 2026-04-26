---
draft: false
toc: true
title: "Ae Map And Interview Prep"
linkTitle: "Ae Map And Interview Prep"
---
# Agent Engineering Discipline Map (Interview Prep)


This document is a **map of the agent engineering discipline** with an interview-prep focus: the top-level domains, the questions interviewers care about, the concepts that recur in real systems, and the artifacts you should be ready to describe or sketch.

It is aligned to common expectations in senior/staff "LLM agent engineer" roles: **stateful graph orchestration, structured I/O, evaluation gates, production observability, retrieval, and cost/latency engineering**.

## Table of contents


1. [What "agent engineering" means in practice](#what-agent-engineering-means-in-practice)
2. [What hiring teams are signaling](#what-hiring-teams-are-signaling)
3. [Principal Engineer lens: decision domains](#principal-engineer-lens-decision-domains)
4. [The agent engineering map (decision domains)](#the-agent-engineering-map-decision-domains)
5. [Axes v2 cross-walk](#axes-v2-cross-walk)
6. [Cross-cutting axes](#cross-cutting-axes)
7. [System design narrative (10 minutes)](#system-design-narrative-10-minutes)
8. [Deep dives by domain](#deep-dives-by-domain)
9. [Interview question bank + answer frames](#interview-question-bank -- answer-frames)
10. [Practice drills (high ROI)](#practice-drills-high-roi)
11. [Artifacts checklist (what to have in your repo)](#artifacts-checklist-what-to-have-in-your-repo)
12. [Glossary](#glossary)

## What "agent engineering" means in practice


**Agent engineering** is building software systems where an LLM (or multiple models) is embedded in a **control loop** that can:

- interpret intent
- plan or route work
- call tools (often with side effects)
- track state across steps and time
- verify outcomes
- operate safely and reliably in production

An "agent" is not the model. It's the **system**: control, tools, memory/knowledge, policies, evaluation harness, and operations.

## What hiring teams are signaling


Across modern JDs for "AI Engineer (LLM agents)" the consistent signals are:

### Engineering posture (non-negotiables)


- **Evaluation-driven development**: every prompt/tool/routing/retrieval change must pass automated eval gates.
- **Structured outputs by default**: schema validation, strict tool contracts, idempotent handlers.
- **Production readiness**: tracing, logging, metrics, rate limiting, circuit breakers, SLOs.
- **Cost/latency engineering**: routing, caching, KV reuse, batching, inference efficiency.

### System scope


- **Stateful orchestration graphs** (not just a chat prompt)
- **Tool integration** as a backend problem (APIs, retries, auth, contracts)
- **Retrieval / memory** as a measurable subsystem
- Often: **Kubernetes + GPU serving + CI/CD**

### Typical stack vocabulary


Orchestration: graph/state-machine style and "code as orchestration" (Python + typed models)

Serving: high-throughput inference (batching, streaming, cache strategies)

Observability: traces + metrics + logs with correlation IDs

Data: Postgres/Redis + vector search (pgvector or dedicated vector DB)

## Principal Engineer lens: decision domains


Principal work and Principal interviews are about **decision-making under constraints**. Organize agent engineering around three questions you are expected to answer -- and enforce with artifacts and gates.

1. **Where is autonomy allowed to exist?**
	- What can run without a human check?
	- Where do we force determinism (router/DAG) to cap risk/cost?
2. **How do we know it's correct and safe?**
	- What is gated in CI, what is canaried, and what causes rollback?
	- How do we defend against misuse (prompt injection, tool abuse, data exfiltration)?
3. **How does it run at scale under budgets?**
	- How do we coordinate work under contention (limits, queues, backpressure)?
	- How do we manage unit economics (cost-per-outcome) while protecting quality?

Reusable narrative:

- **Decision rule -> Mechanism -> Proof**

## The agent engineering map (decision domains)


Each domain below includes:

- **Core question** (what it answers)
- **Key concepts** (what you should know)
- **Common pitfalls** (what breaks in production)
- **Artifacts** (what you should be ready to show)
- **Staff/Principal move** (the decision rule + enforcement)

### Domain A -- Autonomy & Runtime

#### A1) Problem framing and autonomy level


**Core question:** What is the agent doing, what counts as success, and how much autonomy is allowed?

**Key concepts**

- Task decomposition and acceptance criteria
- Risk tiers (low vs high stakes)
- Autonomy ladder: suggest -> draft -> execute-with-approval -> execute
- Definition of "done", "abort", and "handoff to human"

**Common pitfalls**

- Building an agent when a deterministic workflow would do
- No measurable success metric -> cannot evaluate regressions
- Over-autonomy (tool writes without approvals) early in product lifecycle

**Artifacts**

- PRD/task spec
- Success metrics (task success, time saved, cost envelope)
- Risk classification + autonomy policy

**Staff/Principal move:** define the **autonomy envelope** (what can run automatically, what requires approval, what is forbidden) and enforce it with policy + audits.

#### A2) Control layer (orchestration, state, termination)


**Core question:** What is the control flow, what state exists, and how does it terminate safely?

**Key concepts**

- Chains vs routers vs state machines vs graphs
- DAG vs cyclic graphs; when cycles are justified
- Termination conditions (budgets, timeouts, goal checks, step limits)
- Checkpointing state to resume long-running flows

**Common pitfalls**

- "While not done" loops without robust termination logic
- Hidden state in prompt text rather than explicit state objects
- No checkpointing -> impossible to resume workflows after user latency or failures

**Artifacts**

- State model (types), transition diagram
- Termination policy ("stop reasons")
- Persisted run state schema (Postgres/Redis)

**Staff/Principal move:** make termination and recovery **explicit** (stop reasons, checkpoints, replay) so behavior is bounded and debuggable.

#### A3) Deterministic interface layer (make LLM outputs usable)


**Core question:** How do you constrain a stochastic model into reliable components?

**Key concepts**

- Structured generation: JSON Schema / typed models
- Validation + repair; "parse errors are a failure mode"
- Prompt-as-spec and version control
- Determinism strategies (temperature, retry budget, guardrails)

**Common pitfalls**

- Free-form outputs feeding into backend systems
- Silent format drift after model/provider change
- Over-repair loops that mask quality regressions

**Artifacts**

- Schemas and validators
- Prompt/version registry + changelog
- Replay fixtures for regression tests

**Staff/Principal move:** treat schemas as **contracts** (versioned, validated, tested) and make format drift a gated regression.

#### A4) Tooling and actuation (tool contracts and side effects)


**Core question:** How do you integrate tools safely and reliably, especially write actions?

**Key concepts**

- Tool schemas, typed I/O, strict validation
- Error contracts: retries, backoff, circuit breakers, timeouts
- Idempotency keys and deduplication
- Side-effect classification: read vs write vs irreversible write
- Approval/commit gates; "plan" vs "commit" separation
- Compensation/saga patterns for partial failures

**Common pitfalls**

- Tool handlers that are not idempotent
- Retrying non-idempotent writes -> duplicate side effects
- Unbounded tool invocation (cost blowups, rate-limit storms)
- Tool outputs treated as trusted inputs (injection surface)

**Artifacts**

- Tool catalog + permission model
- Idempotency strategy
- Audit log (who/what/when/why) and correlation IDs
- Runbook for tool failures

**Staff/Principal move:** separate **decision vs execution** for writes (plan/approve/commit), enforce least privilege, and make write paths recoverable (idempotency + compensation).

#### A5) Planning, decomposition, and skills


**Core question:** How do you turn goals into steps with low variance and high reliability?

**Key concepts**

- Plan-then-execute vs interleaved acting
- Skill/procedure libraries (versioned playbooks)
- Constraints-first planning ("what must not happen")
- Verification steps and checkpoints in the plan

**Common pitfalls**

- Over-planning (wasted tokens/latency)
- Under-planning (thrashing between tools)
- No skill reuse -> unpredictable behavior and repeated failures

**Artifacts**

- Skill specs (inputs/outputs/preconditions)
- Skill tests and versioning
- Plan templates for common workflows

**Staff/Principal move:** push variance out of the loop by standardizing reusable "skills" and making verification steps explicit.

#### A6) Multi-agent orchestration (only when warranted)


**Core question:** When does decomposition into multiple agents help, and how do they coordinate safely?

**Key concepts**

- Coordinator/worker; planner/executor; specialist agents
- Shared state vs message passing
- Arbitration: voting, scoring, judge policies
- Deadlock avoidance and bounded collaboration

**Common pitfalls**

- Using multi-agent as a default
- Roles overlap and conflicts multiply
- No arbitration -> inconsistent output and wasted compute

**Artifacts**

- Role specifications
- Arbitration policy and conflict resolution rules
- Shared observability schema

**Staff/Principal move:** treat multi-agent as a **coordination cost**; require bounded collaboration and clear arbitration before adding more agents.

### Domain B -- Verification & Risk Controls

#### B1) Knowledge & memory (RAG and context shaping)


**Core question:** How does the system know things reliably under a tight context window?

**Key concepts**

- Retrieval pipeline: chunking, embeddings, indexing
- Hybrid retrieval (sparse + dense), reranking
- Query decomposition / multi-hop retrieval
- Context shaping: inclusion policy, compression/summarization, eviction strategies
- Provenance: citations, conflict handling, "unknown" behavior

**Common pitfalls**

- Stuffing too much context -> higher cost, worse accuracy
- No measurement of retrieval quality
- Stale or conflicting sources with no resolution strategy
- Injection via untrusted documents

**Artifacts**

- Ingestion pipeline + data lifecycle plan
- Retrieval eval set (queries + expected sources)
- Provenance format and grounding policy

**Staff/Principal move:** define a **context policy** (selection, pruning, freshness, provenance) and measure retrieval quality by slice.

#### B2) Evaluation (development is measurement)


**Core question:** How do you prove it works and prevent regressions?

**Key concepts**

- Scenario tests for multi-step tasks
- Simulated tools / sandboxed environments
- Golden sets + golden traces for replay
- Rubrics and LLM-as-judge (carefully constrained)
- Offline -> online ladder: CI gates, shadow/canary, A/B tests

**Common pitfalls**

- Measuring only "answer quality" and ignoring tool correctness
- Judge model drift / rubric ambiguity
- No regression gate -> quality degrades with each change

**Artifacts**

- Eval datasets + rubrics
- CI gating rules + reports
- Failure taxonomy (labels, clustering)

**Staff/Principal move:** gate the lifecycle with **tiered evaluation** (smoke -> deep) and require baseline vs candidate reports for every change.

#### B3) Observability & operations (SRE for agents)


**Core question:** When it fails, can you tell what happened and recover safely?

**Key concepts**

- Tracing across steps/tools (spans), correlation IDs
- Metrics: cost, latency, tool failure rate, quality proxies
- Alerting thresholds; anomaly detection
- Rate limiting, circuit breakers, fast rollback

**Common pitfalls**

- Logging only raw text without structured event logs
- No link between a user outcome and the internal trace
- No cost guardrails; runaway token/tool usage

**Artifacts**

- Dashboards + alerts
- Runbooks + postmortem templates
- Release gates and rollback plan

**Staff/Principal move:** make failures cheap by shortening **time-to-diagnosis** (traces + stop reasons) and closing the loop (postmortem -> new eval/test).

#### B4) Security & safety (agent-specific)


**Core question:** How do you reduce blast radius when the model is manipulated or wrong?

**Key concepts**

- Threat modeling: prompt injection, tool output poisoning, data exfiltration
- Least privilege + scoped credentials
- Allowlists, sandboxing, timeouts, policy-as-code checks
- PII handling: redaction, retention, auditability
- Separate read and write capabilities; approvals for writes

**Common pitfalls**

- Treating retrieved docs/tool outputs as trusted
- Giving broad credentials to the runtime
- No audit trail of actions

**Artifacts**

- Threat model document
- Red-team suite (attacks + expected outcomes)
- Policy checks + audit logs

**Staff/Principal move:** adopt defense-in-depth: least privilege, scanners/validators, auditing, and a kill switch for risky capabilities.

### Domain C -- Inference Economics & Deployment

#### C1) Coordination & multi-tenant execution (distributed systems thread)


**Core question:** How do you coordinate work under contention while preserving fairness, reliability, and budgets?

**Key concepts**

- Concurrency limits and token buckets (per-tenant / per-route)
- Queues, micro-batching, request coalescing
- Backpressure and load shedding
- Budget enforcement (time/cost/tool) with explicit stop reasons
- Idempotent retries at the system boundary

**Common pitfalls**

- Queue collapse under load (no backpressure)
- Unfairness (one tenant starves others)
- Retrying across boundaries without idempotency
- Silent degradation (quality drops without detection)

**Artifacts**

- Capacity plan + load-test report
- Rate-limit/backpressure policy
- Degradation tiers + triggers
- Cost-per-outcome accounting

**Staff/Principal move:** define coordination policies (limits, queues, fairness) and enforce them with measurable budgets + degradation tiers.

#### C2) Serving & performance (latency/cost/throughput)


**Core question:** How do you serve models and agents within product latency/cost constraints?

**Key concepts**

- Prefill vs decode costs; streaming trade-offs
- Batching and queueing; concurrency control
- KV cache reuse and prompt caching
- Model routing: small model first, escalate on uncertainty
- Distillation/quantization strategies (when you own the model stack)

**Common pitfalls**

- Optimizing cost while silently destroying quality
- Over-batching increases tail latency
- Routing heuristics that create inconsistent UX

**Artifacts**

- Perf test harness + load tests
- Cost envelope (target $/task) and budgets
- Routing policy and quality gates

**Staff/Principal move:** optimize with guardrails: any cost/latency change must be **eval-gated** and roll back cleanly.

#### C3) Platform and lifecycle management


**Core question:** How do you ship and evolve agent systems like real software?

**Key concepts**

- Versioning prompts/tools/evals; compatibility matrices
- CI/CD for agent lifecycle; staging and canaries
- Data and model lifecycle (if self-hosting)
- Internal developer platform: tool SDKs, templates, trace standards

**Common pitfalls**

- Ad hoc prompt changes without changelog or eval gate
- No migration strategy for state schemas
- No centralized tool governance -> inconsistent contracts

**Artifacts**

- Release playbook
- Standard repo template (design, threat model, evals, runbook)
- Governance checklist

**Staff/Principal move:** standardize the "happy path" (templates, SDKs, gates) so teams ship safely without reinventing runtime and controls.

## Axes v2 cross-walk


Translate a job's constraints into (a) which domains matter most, and (b) which artifacts to lead with.

| Constraint (Axes v2) | Dominant domains | Artifacts to foreground |
|---|---|---|
| Cognitive topology (router/DAG vs loop) | A2, A5 | `STATE_MODEL`, stop reasons, replay notes |
| Interaction model (HITL) | A2, B3 | HITL state transitions, interrupt semantics, audit trail |
| Tooling surface & side effects | A4, B4 | tool catalog + permissions, idempotency, compensation table |
| Data & context engineering | B1 | provenance + freshness SLA, context policy, retrieval evals |
| Reliability maturity | B2, B3 | eval suite + CI gates, failure modes + runbooks, rollback criteria |
| Inference physics & economics | C1, C2 | latency budgets, degradation tiers, cost-per-outcome model |
| Cloud environment | C3 | release playbook, deployment topology, platform standards |
| Model utilization & optimization | C2 | routing policy + per-route eval, rollback plan |

## Cross-cutting axes


Use these axes to reason about *any* agent system:

1. **Autonomy:** suggest -> draft -> execute-with-approval -> execute
2. **Side effects:** read -> compute -> write -> irreversible write
3. **Interaction model:** background -> HITL copilot (pause/approve/edit/resume)
4. **Time horizon:** single request -> minutes -> days (async/HITL)
5. **Risk exposure:** internal/trusted -> public/adversarial
6. **Determinism:** deterministic code -> constrained generation -> open-ended generation
7. **Deployment environment:** managed cloud -> hybrid/on-prem/edge
8. **Model strategy:** single model -> routing + caching + (optional) distill/quantize
9. **Lifecycle:** design -> build -> eval -> deploy -> operate -> improve

## System design narrative (10 minutes)


A reusable structure for "Design an agent for X":

1. **Frame success & constraints**
	- user goal, task success metric
	- latency/cost envelope
	- risk tier + autonomy policy
2. **Choose orchestration**
	- router -> state machine/graph
	- explicit state objects
	- termination conditions and budgets
3. **Design tools**
	- schemas, retries, idempotency
	- read/write separation; approval for write actions
	- audit logs
4. **Design knowledge**
	- retrieval pipeline + provenance
	- context shaping policy
	- retrieval eval plan
5. **Eval-first plan**
	- scenario set + rubrics
	- CI regression gates
	- online shadow/canary and rollback
6. **Ops plan**
	- traces/metrics/logs + dashboards
	- SLOs + alerts
	- runbook + incident workflow
7. **Performance plan**
	- caching, batching/streaming
	- routing strategy + quality protection
8. **Security plan**
	- threat model + least privilege
	- sandboxing/allowlists/timeouts
	- auditability

## Deep dives by domain

### Deep dive: state persistence for long-running agent workflows


**The problem:** the agent pauses (HITL), tools are slow, or workflow spans days.

**The requirement:** resume deterministically with minimal loss.

**Key design points**

- Serialize state as versioned schema (include state version + migrations)
- Store event log (tool calls, observations) + current snapshot
- Ensure idempotent replays: dedupe tool calls using idempotency keys
- Separate "decision" from "execution" for write actions (commit gate)
- Include correlation IDs for tracing across services

**Interview-ready explanation**

- "I model the agent as a state machine. Each transition writes an event and snapshot. Tool calls are idempotent. If the workflow resumes, we replay the event log, rebuild state, and continue from the last committed checkpoint."

### Deep dive: tool contracts for write actions (safe actuation)


**Pattern: plan -> approve -> commit**

- **Plan step:** model proposes intended write action + parameters (structured output)
- **Approval step:** either user approval or policy engine approval
- **Commit step:** tool executes with idempotency key, audit log, and (if possible) compensation action

**Failure handling**

- Tool succeeds but next step fails -> mark commit as done, proceed with recovery steps (saga/compensation when possible)
- Retrying commit uses same idempotency key

### Deep dive: evaluation harness for agentic systems


**Minimum viable eval**

- 20-50 scenario tests: inputs, expected outcomes, rubric
- Run in CI on every prompt/tool/routing/retrieval change

**Scale-up**

- Simulated tools (fake external APIs) for deterministic testing
- Golden traces: record tool sequences and expected decisions
- Online: shadow traffic, canary, A/B

**Metrics that matter**

- task success
- tool-call correctness
- policy violations
- cost per task
- latency (p50/p95) and tail behavior

### Deep dive: observability schema (what to log/trace)


**A strong baseline**

- One trace per user request (or workflow run)
- Spans for: model call, tool call, retrieval, guardrails, post-processing
- Events: state transitions + stop reasons
- Metrics: cost tokens, tool error rate, rerank latency, eval proxy scores

**Important:** redact secrets/PII; log structured metadata not raw sensitive content.

### Deep dive: RAG systems that don't collapse


**Baseline pipeline**

1. query rewrite (optional)
2. hybrid retrieval (sparse + dense)
3. rerank (top-k -> top-n)
4. context shaping (structured context object)
5. answer with provenance

**Where quality is won**

- relevance (reranking)
- freshness policies
- "unknown" behavior when sources conflict
- retrieval eval sets tied to production queries

### Deep dive: performance engineering


**Common tactics**

- semantic cache for retrieval and for final answers (careful with correctness)
- model routing: cheap classifier -> expensive model for hard cases
- batching and streaming trade-offs
- prompt caching / KV reuse where applicable
- quantization/distillation if hosting models

**Rule of thumb**

- never optimize cost without an eval gate proving quality is not harmed

## Interview question bank + answer frames

### System design prompts


1. Design a stateful agent workflow for a multi-step task (graph, state, termination).
2. Add a write tool: approval gate, idempotency, audit log, rollback story.
3. Build a RAG agent: retrieval pipeline, provenance, retrieval eval.
4. Productionize: observability, SLOs, incident response, rollback.
5. Cut cost/latency by 50%: routing/caching/batching plan with quality protection.

**Answer frame**

- constraints -> architecture -> control/state -> tools -> eval -> ops -> perf -> security

### Debugging prompts


1. The agent loops indefinitely: how to reproduce, diagnose, and fix?
2. Tool calls are wrong but text looks right: where's the contract break?
3. Retrieval is "relevant" but answers are wrong: what to measure and change?
4. p95 latency doubled after an update: which metrics do you inspect first?

**Answer frame**

- define symptom -> check traces -> isolate layer -> reproduce with eval -> implement fix -> add regression test

### Coding prompts (typical)


1. Implement a typed tool interface with retries/timeouts/idempotency.
2. Implement a small state machine runner (with checkpointing) in Python.
3. Write an eval runner that replays scenarios and outputs a report.

### Behavioral prompts (senior/staff)


1. How do you drive alignment between product, infra, and research?
2. How do you introduce eval gates without blocking iteration?
3. How do you decide between building vs adopting a framework?

## Practice drills (high ROI)


1. **Build a mini agent framework in Python**
- state machine runner
- tool catalog with schemas
- trace IDs and structured logs
- eval runner with 30 scenarios
1. **RAG deep dive**
- build retrieval eval set from real docs
- add reranker
- track recall@k proxy and task success
1. **Safety hardening**
- implement read/write separation
- add approval gate + policy checks
- write 10 prompt-injection tests
1. **Latency/cost squeeze**
- add caching
- add routing (cheap model first)
- prove no quality loss using eval gates

## Artifacts checklist (what to have in your repo)


By interview time, it's useful to have a repo (or take-home-style project) with:

- `README.md` (setup, usage, limits)
- `DESIGN.md` (architecture, state model, tool contracts)
- `THREAT_MODEL.md` (assets, attacks, mitigations)
- `EVALS/` (scenarios, rubrics, runner)
- `RUNBOOK.md` (alerts, failures, recovery)
- `OBSERVABILITY.md` (trace schema, metrics)
- `CHANGELOG.md` (prompt/tool/routing changes)

## Glossary


- **Agent loop:** observe -> decide -> act -> verify
- **Tool contract:** schema, error policy, side effects, idempotency, permissions
- **Idempotency key:** identifier used to ensure a write action is applied once
- **Golden set:** fixed eval dataset used for regression gating
- **Golden trace:** recorded execution trace used for replay comparisons
- **Reranker:** model/component that reorders retrieved results by relevance
- **Checkpointing:** persisting state so workflows can resume reliably
- **SLO:** service-level objective (latency, availability, quality proxy)
