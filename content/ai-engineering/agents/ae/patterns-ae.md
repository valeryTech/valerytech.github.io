---
draft: false
toc: true
title: "Patterns Ae"
linkTitle: "Patterns Ae"
---
# Agent Systems Patterns (AI Platform Engineering)


This is a practical set of reusable patterns for building **non-deterministic systems** (LLMs/agents) as reliable product infrastructure. These patterns focus on the real failure modes: variance, partial state, unsafe side effects, and cost/latency drift.

For each pattern, the goal is to make behavior:

- **Bounded** (budgets, stop reasons, termination)
- **Auditable** (who/what/when/why)
- **Measurable** (offline eval + online monitors)
- **Recoverable** (replay, idempotency, rollback)

## 1. Runtime control patterns


These patterns make "agent behavior" into an explicit runtime with states, termination, and safe fallbacks.

| Pattern | Problem it solves | Core mechanisms | Signals / artifacts |
|---|---|---|---|
| **Policy Router (intent + risk + budget routing)** | Wrong path/model/tool choice causes cost spikes or unsafe actions | intent classification; risk tiers; cheap-first + escalation-on-uncertainty; per-route budgets | `ROUTING_POLICY.md`, per-route eval report, escalation reasons |
| **Agent Runtime (FSM/DAG execution)** | Hidden state + ad hoc loops -> un-debuggable behavior | explicit state model; DAG/FSM; checkpoints; stop reasons; resumability | `STATE_MODEL.md`, stop-reason taxonomy, replay fixtures |
| **Bounded Loop Executor** | Infinite retries / tool thrash | max iterations; max tool calls; loop detection via state signatures; degrade/escalate | loop-rate dashboard; `STOP_REASONS.md`; failure-mode runbook |
| **Router-first + Escalation** | Always-loop architectures are brittle/expensive | deterministic path by default; loop only for high-variance tasks; explicit "escalate" trigger | path distribution; cost-per-success by path; ADR on loop scope |

## 2. Context & memory patterns


These patterns manage what the system knows, how it's grounded, and how it stays fresh.

| Pattern | Problem it solves | Core mechanisms | Signals / artifacts |
|---|---|---|---|
| **Provenance-first ingestion** | Untraceable context -> weak debugging and governance | doc -> chunk -> version IDs; stable chunk ids; source metadata; safe logging boundaries | `PROVENANCE.md`, lineage schema, redaction/ACL notes |
| **Hybrid Retrieval + Rerank-on-ambiguity** | Dense-only misses exact matches; reranking everywhere blows latency | sparse+dense merge; rerank only when uncertainty high; stage timeouts | `RETRIEVAL_EVALS.md`, slice report (IDs vs NL), tail-latency impact |
| **Context Policy (select -> prune -> compress)** | Overstuffed context increases cost and reduces accuracy | inclusion rules; token cap; drop order; diversity constraints; summarization allowedlist | `CONTEXT_POLICY.md`, context budget curve, redundancy metrics |
| **Freshness SLA + drift monitors** | Stale answers / degraded retrieval over time | indexing cadence; TTL rules; staleness definition; drift thresholds; alerting | `FRESHNESS_SLA.md`, staleness incident runbook, drift dashboard |

## 3. Tool safety & side-effect patterns


These patterns make tool use safe, replayable, and resistant to retries/timeouts.

| Pattern | Problem it solves | Core mechanisms | Signals / artifacts |
|---|---|---|---|
| **Tool Gateway (contract-first)** | Tool calls are the main production blast radius | schemas (Pydantic/JSON); preflight validation; allowlists/RBAC; timeouts/retries; audit logs | `TOOL_CATALOG.md`, permission matrix, tool error taxonomy |
| **Action Idempotency** | Retries create duplicated side effects | idempotency keys; dedupe store; exactly-once-ish semantics; idempotent read-modify-write | duplicate-side-effect rate (target ~0), idempotency ADR |
| **Plan-Commit split** | Executing writes from one-pass output is unsafe | preview/dry-run; diff/impact summary; approval boundary; revalidate preconditions on commit | `APPROVAL_POLICY.md`, `AUDIT_LOG_SCHEMA.md`, plan -> commit mismatch metric |
| **Compensation / saga table** | Partial failures leave inconsistent real-world state | compensation handlers; retry boundaries; DLQ + manual replay tooling | `RECOVERY_PLAYBOOK.md`, compensation matrix, DLQ workflow |

## 4. Verification & release patterns


These patterns turn stochastic behavior into something you can ship repeatedly without regressions.

| Pattern                               | Problem it solves                           | Core mechanisms                                                                                                | Signals / artifacts                                         |
| ------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Probabilistic Contracts**           | "Works in demo" but fails in tail cases     | preconditions + probabilistic postconditions; runtime barriers; offline CSR/SFR; gated thresholds              | `CONTRACTS.md`, CSR/SFR trend, `EVAL_GATES.md`              |
| **Proposer-Verifier**                 | Cheap proposals; expensive/unsafe execution | proposer emits structured candidate; verifier runs deterministic checks + tool checks; escalate on uncertainty | tool correctness rate, rejection reasons, verifier coverage |
| **Scenario eval suite (gated in CI)** | Prompts/policies/tools drift silently       | golden scenarios; replayable traces; slice evals; tiered gates (smoke -> deep)                                    | `SCENARIO_EVALS.md`, `ABLATIONS.md`, regression gate policy |
| **Canary + rollback criteria**        | Offline eval never matches prod perfectly   | feature flags; small traffic canary; rollback triggers on quality/latency/cost                                 | `ROLLBACK.md`, canary dashboard template, rollback drills   |

## 5. Inference economics & coordination patterns


These patterns keep unit economics stable and prevent "cost surprises" under load.

| Pattern | Problem it solves | Core mechanisms | Signals / artifacts |
|---|---|---|---|
| **Budget enforcement (time/cost/tool)** | Unbounded compute and runaway tool calls | staged timeouts; max steps/calls; per-tenant budgets; explicit stop reasons | `COST_MODEL.md`, `LATENCY_BUDGET.md`, stop-reason distribution |
| **Backpressure + load shedding** | Tail latency collapse at scale | queue depth triggers; reject/deflect policies; tiered degradation | `DEGRADATION_TIERS.md`, saturation test report |
| **In-flight coalescing** | Paying multiple times for identical in-progress work | dedupe identical requests; fan-out result; short windows | cost saved %, coalescing hit rate |
| **Caching as a route (policy-controlled)** | Unsafe reuse or inconsistent behavior | cache eligibility rules; tenant/policy scoping; TTL; invalidation events | `CACHE_POLICY.md`, cache safety tests |
| **Model routing (cheap-first + escalate)** | Spending too much on easy requests | route by uncertainty + risk; reserve expensive models for hard cases | per-route cost-per-success, escalation rate + reasons |

## Production "agentic" stack (minimal and real)


This is the smallest platform surface that still reads as production-grade:

1. **Ingress policy**: scanners + policy router (intent/risk/budget)
2. **Runtime**: FSM/DAG executor with checkpoints and stop reasons
3. **Context**: ingestion + provenance; retrieval + context policy; freshness SLA
4. **Tools**: tool gateway + idempotency + plan-commit for writes
5. **Verification**: scenario evals gated in CI + canary/rollback
6. **Ops**: traces with run IDs + runbooks; cost-per-outcome accounting

## Notes on language and signals


- Avoid "hallucination" as the catch-all label. Prefer: **contract violation**, **retrieval miss**, **unsafe tool call**, **budget breach**, **distribution shift**, **staleness**.
- "Deterministic" is not the goal. The goal is **bounded variance with explicit failure modes**.
