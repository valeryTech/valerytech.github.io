---
draft: false
toc: true
title: "Inference Cost Distributed Syllabus"
linkTitle: "Inference Cost Distributed Syllabus"
---
# Track Syllabus: Inference & Cost Engineering (Distributed Coordination Focus) -- 8 weeks


Goal: build an inference stack that is **fast, cheap, and stable under load**, with explicit distributed coordination: routing, batching, caching, backpressure, and safe degradation. This track targets roles where "AI" work is really **systems performance + unit economics + operability**.

## Target outcomes (end state)


A production-style inference layer that supports:

- Request routing across models/providers (cheap-first -> escalate) with **eval-gated policies**
- Distributed coordination primitives:
	- concurrency limits + token buckets (per-tenant, per-model)
	- request coalescing / dedupe (in-flight + cache)
	- batching (where applicable) and queue-based execution
	- backpressure and load shedding
- Caching strategy:
	- semantic cache (safe constraints)
	- retrieval/result cache (when safe)
- Latency control:
	- TTFT/P95/P99 budgets per stage
	- staged timeouts and degradation tiers
- Cost control:
	- cost-per-outcome model (includes retries/reranks/tool calls)
	- budget enforcement and variance analysis
- Observability:
	- traces that explain latency and cost composition end-to-end
	- per-route quality and cost accounting
- Release discipline:
	- canary + rollback for routing/degradation policy changes

Durable artifacts:

- `LATENCY_BUDGET.md` (TTFT/P95/P99 targets per stage and per tier)
- `COST_MODEL.md` (cost-per-outcome, variance, budgets)
- `ROUTING_POLICY.md` (routes, thresholds, escalation rules, rollback)
- `DEGRADATION_TIERS.md` (what to drop/skip; triggers; quality protection)
- `CAPACITY_PLAN.md` (throughput assumptions, bottlenecks, scaling model)
- `LOAD_TESTS.md` (traffic model, results, tail behavior)
- `CACHE_POLICY.md` (semantic cache rules, invalidation, safety constraints)
- `TRACE_SEMANTICS.md` (what is traced/logged; privacy boundaries)

## Weekly operating loop (always)


Each week produces:

1. **One capability**
2. **One measurement output** (load test / benchmark / cost study / policy ablation)
3. **One leverage artifact** (policy doc, ADR, runbook)

## Reference stack (adapt as needed)


- Service: FastAPI (or any HTTP service)
- Queue: Redis/RQ/Celery/Kafka (pick one)
- Cache: Redis
- Storage: Postgres for accounting + policy state
- Tracing: OpenTelemetry
- Load testing: k6/locust
- Optional compute: local model server (vLLM/TGI) *or* mock "provider" for reproducible tests
> You can do the track without self-hosting by simulating "providers" with different latency/cost profiles, but include the same coordination mechanics.

## Schedule overview


| Week | Theme | Capability | Measurement output | Leverage artifact |
|---|---|---|---|---|
| 1 | Baselines + accounting | Inference gateway skeleton + cost/latency accounting | Baseline latency/cost report | `LATENCY_BUDGET.md` v1 |
| 2 | Distributed limits | Global + per-tenant rate limits; token buckets; backpressure | Saturation test (throughput vs P95) | `CAPACITY_PLAN.md` v1 |
| 3 | Caching + coalescing | In-flight dedupe + cache policy | Cache hit rate vs quality risk | `CACHE_POLICY.md` v1 |
| 4 | Routing policies | Multi-route execution (cheap-first, escalate) | Per-route cost/latency + success deltas | `ROUTING_POLICY.md` v1 |
| 5 | Queues + batching | Queue-based execution; batching where possible | Queueing delay vs throughput study | `LOAD_TESTS.md` v1 |
| 6 | Degradation tiers | Staged timeouts + load shedding | Degradation experiment under load | `DEGRADATION_TIERS.md` v1 |
| 7 | Policy safety | Canary/rollback for routing + budgets | Synthetic regression + rollback demo | `COST_MODEL.md` v2 + rollback criteria |
| 8 | Principal packaging | Hardening + narrative | Final benchmark pack + known limits | `CASE_STUDY.md` + resume bullets |

## Week-by-week detail

### Week 1: Baselines + accounting (make costs and latency visible)


**Capability**

- Build an **inference gateway** that calls one "provider" (real or simulated).
- Add accounting per request:
	- latency breakdown (TTFT, total time)
	- estimated cost (per-token or per-request model)
	- retries and failure reasons
	- tenant id / route id tagging

**Measurement output**

- Baseline report:
	- TTFT/P95/P99 at low load
	- cost-per-request and cost variance
	- failure rate

**Leverage artifact**

- `docs/LATENCY_BUDGET.md` v1:
	- define target budgets per tier (interactive vs batch)
	- define what counts as "success" and "acceptable degradation"

### Week 2: Distributed limits (coordination under contention)


**Capability**

Implement coordination primitives:

- **Token bucket** limits:
	- per-tenant (fairness)
	- per-provider/model (protect upstream)
- **Concurrency caps**:
	- per-worker and per-route
- **Backpressure**:
	- reject or queue when saturated
	- return explicit stop reasons

**Measurement output**

- Saturation test:
	- ramp load until P95 collapses
	- identify throughput knee and bottlenecks
	- measure tail-latency stability with/without caps

**Leverage artifact**

- `docs/CAPACITY_PLAN.md` v1:
	- traffic model assumptions (QPS, concurrency)
	- what limits exist and why
	- bottleneck analysis and scaling approach

### Week 3: Caching + request coalescing (stop paying twice)


**Capability**

- **In-flight request coalescing**:
	- dedupe identical requests within a short window
	- share the same in-progress result (fan-out)
- **Cache policy**:
	- define safe cache keys (inputs, tool results, route id)
	- TTL and invalidation rules
	- guardrails against unsafe reuse

**Measurement output**

- Cache/coalescing study:
	- hit rate under synthetic "bursty" traffic
	- cost saved vs latency improved
	- measure "risk surface" (what you refuse to cache)

**Leverage artifact**

- `docs/CACHE_POLICY.md` v1:
	- what is cacheable and what is not
	- TTL rules, invalidation, and safety constraints
	- how coalescing interacts with tenant isolation

### Week 4: Routing policies (multi-route economics)


**Capability**

- Add at least 3 routes (examples):
	1. cheap/fast (small model or lower-cost provider)
	2. standard (default)
	3. escalate (strong model) when uncertainty is high
- Implement routing inputs:
	- confidence signals (heuristic ok), retries, user tier
	- budget checks before escalation
- Add route-level observability and accounting.

**Measurement output**

- Per-route report:
	- cost-per-success by route
	- latency distributions by route
	- escalation rate and "why escalated" tags
- Policy ablation:
	- compare two routing thresholds and show tradeoffs

**Leverage artifact**

- `docs/ROUTING_POLICY.md` v1:
	- route definitions and decision rules
	- budget constraints and escalation limits
	- rollback plan for routing changes

### Week 5: Queues + batching (distributed work scheduling)


**Capability**

- Introduce a queue-based execution path:
	- synchronous request submits job -> async worker performs inference
	- support "interactive" (sync) vs "batch" (async) tiers
- Add batching (where possible):
	- micro-batching for local model servers
	- or "batching" as queue grouping even if provider doesn't support true batching

**Measurement output**

- Queueing study:
	- throughput vs queue delay
	- effect of micro-batching on token/sec and P95
	- fairness across tenants

**Leverage artifact**

- `docs/LOAD_TESTS.md` v1:
	- traffic patterns (steady, bursty, mixed tenants)
	- results and bottlenecks
	- recommended worker counts and limits

### Week 6: Degradation tiers (stay up under pressure)


**Capability**

- Implement staged timeouts and degradation tiers, for example:
	- Tier 0: serve from cache only (if safe)
	- Tier 1: cheap route only (no escalation)
	- Tier 2: standard route with tight timeout
	- Tier 3: full route with escalation (normal)
- Add load shedding:
	- reject with explicit reason when budgets are exceeded
	- preserve critical tenants/requests

**Measurement output**

- Degradation experiment:
	- run high-load tests and show:
		- availability (requests served)
		- P95 stability
		- cost and quality proxy under tiers

**Leverage artifact**

- `docs/DEGRADATION_TIERS.md` v1:
	- tier definitions, triggers, and safety checks
	- what you drop first and why
	- how you prevent silent quality collapse

### Week 7: Policy safety (canary, rollback, and cost governance)


**Capability**

- Add CI checks for policy changes:
	- routing thresholds
	- cache settings
	- budgets and tier triggers
- Add canary mode:
	- small % of traffic uses new policy
	- automatic rollback triggers on regressions
- Expand cost accounting to **cost-per-outcome** (include retries and fallbacks).

**Measurement output**

- Synthetic regression demo:
	- introduce a bad routing change (cost spike or latency spike)
	- show detection + rollback decision rule

**Leverage artifact**

- `docs/COST_MODEL.md` v2:
	- cost-per-outcome definition and variance
	- per-route economics
	- budget enforcement rules + rollback criteria

### Week 8: Principal packaging (tell the coordination story)


**Capability**

- Hardening:
	- consistent stop reasons
	- stable tracing fields
	- operator-friendly dashboards (even if simple)
- Ensure the repo tells a coherent story:
	- coordination mechanisms
	- policy safety
	- economics

**Measurement output**

- Final benchmark pack:
	- baseline vs final P95/P99 under load
	- cost-per-success improvements
	- impact of caching/coalescing/routing/degradation (summary table)
	- known limits

**Leverage artifact**

- `docs/CASE_STUDY.md`:
	- Decision rule -> Mechanism -> Proof for 2-3 big decisions:
		- rate limiting/backpressure
		- routing policy + escalation controls
		- caching/coalescing safety
- `docs/RESUME_BULLETS.md`:
	- bullets grouped by Coordination, Economics, Reliability

## Deliverable checklist


- Per-tenant and per-route rate limiting with backpressure
- In-flight request coalescing + cache policy with safety constraints
- Multi-route routing policy with budgets and rollback plan
- Queue-based execution (interactive vs batch) and load tests
- Degradation tiers + load shedding with explicit stop reasons
- End-to-end accounting: latency breakdown + cost-per-outcome
- Canary + rollback triggers for policy changes
- Core artifacts in `docs/`
