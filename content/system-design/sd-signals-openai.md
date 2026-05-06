---
draft: false
toc: true
title: "Sd Signals Openai"
linkTitle: "Sd Signals Openai"
---
---

title: "SD Signals OpenAI"

linkTitle: "SD Signals OpenAI"

# Senior System Design Interview Rubric (Refactored)

> Purpose-built for a 60-minute system design round. Converts vague "signals" into behaviorally anchored constructs with explicit weights, timeboxes, and a decision policy. No statistics, calibration, or interviewer-training content is included.

## 0. Scope & Principles


Scope (this document): Evaluate a candidate's ability to design a scalable, reliable, evolvable system under realistic constraints: users, workload, data, SLOs, failure modes, and operations.

Measurement principles

- One signal -> one construct (no overlapping categories).
- Behaviorally Anchored Rating Scales (BARS) with 1-5 anchors per construct; "3" = solid senior pass.
- Weighted composite + gates; optional bonus is non-compensatory.
- Interview realism: generic tech stack; no company-specific trivia.
- Technical precision: clear APIs, data models, and SLOs; concrete capacity estimates (order-of-magnitude OK).

## 1. Constructs & Weights


|Construct|What it captures|Weight|
|---|---|---|
|A. Problem Framing & Requirements (incl. NFR/SLOs)|Users, use cases, constraints, success metrics|15%|
|B. API Contracts & Data Model|External contracts, schemas, data lifecycle|15%|
|C. High-Level Architecture & Data Flow|Components, interactions, boundaries, back-pressure|20%|
|D. Scale & Capacity Reasoning|Traffic, storage, throughput/latency math|10%|
|E. State, Storage & Consistency Model|Partitioning, indexing, transactions, consistency|15%|
|F. Reliability & Failure Strategy|Redundancy, degradation, retries, idempotency|10%|
|G. Operability (Observability, Deploy/Release, Cost Awareness, Security/Privacy)|Metrics/alerts, rollbacks, cost drivers, authn/z, data protection|10%|
|H. Evolution & Trade-offs|MVP -> vNext, de-risking sequence, buy-vs-build, conscious compromises|5%|
|Bonus (non-compensatory): Product/User Impact Awareness|Concise tie-back to UX/business constraints|0-5%|

## 2. Timeboxed Interview Flow (60 min)


1. Framing & Requirements (7-8 min) - clarify users, top use cases, data freshness, constraints, SLOs.
2. API & Data Model (7-8 min) - list key endpoints/contracts; define core entities & relationships.
3. High-Level Architecture (12-15 min) - draw components & flows; identify hot paths & queues.
4. Scale & Capacity (8-10 min) - do quick math; highlight bottlenecks & headroom.
5. State & Consistency (7-8 min) - detail writes/reads, partitions, indexes, consistency, idempotency.
6. Reliability & Operability (7-8 min) - failure plan, degradation, metrics/alerts, deploy/rollback, cost.
7. Evolution & Trade-offs (3-5 min) - MVP scope, next steps, key risks, explicit trade decisions.
8. (Optional) Bonus (≤2-3 min) - product/user lens, if time remains.

## 3. Behaviorally Anchored Rating Scales (BARS)

> Use anchors verbatim. "3" = solid senior; "4-5" = strong/exceptional.

### A. Problem Framing & Requirements (15%)


- 1: Jumps to solution without users/SLOs; unclear success criteria.
- 2: Names users and one use case; misses key NFRs (latency, availability, cost).
- 3: States primary/secondary use cases; proposes concrete SLOs (e.g., _p95 read 200 ms, 99.9% monthly_); calls out constraints & assumptions.
- 4: Prioritizes use cases; distinguishes online vs. offline paths; notes data freshness and legal/PII concerns.
- 5: Frames measurable success metrics and explicit anti-goals; identifies hidden constraints (e.g., write-skew risk).

### B. API Contracts & Data Model (15%)


- 1: Vague endpoints; no schema or IO contracts.
- 2: Lists endpoints but omits edge semantics (idempotency, pagination, filtering).
- 3: Specifies main APIs with request/response shapes, status codes; defines 2-3 core entities with keys and relationships.
- 4: Covers versioning, idempotency keys, error taxonomy; models lifecycle (create/update/archive/TTL).
- 5: Addresses multi-tenant boundaries, quotas/rate limits, privacy fields, and data retention.

### C. High-Level Architecture & Data Flow (20%)


- 1: Big box diagram only; no flows.
- 2: Names components but unclear interactions or state boundaries.
- 3: Clear read/write paths; separation of concerns (API, compute, storage, async workers, cache).
- 4: Shows back-pressure controls (queues, circuit breakers), batching, and hot path vs. control path.
- 5: Identifies contention points; justifies boundaries (sync vs. async, CQRS, fan-out/fan-in) with constraints.

### D. Scale & Capacity Reasoning (10%)


- 1: No numbers.
- 2: Hand-wavy estimates without units or rates.
- 3: Back-of-envelope: QPS/RPS, request/response sizes, peak/average, storage growth; recognizes bottlenecks.
- 4: Computes partition counts, cache sizing, queue lag tolerance, replica counts for SLO.
- 5: Sensitivity checks (burst x10, region loss); cost-ish reasoning (dominant cost drivers).

### E. State, Storage & Consistency Model (15%)


- 1: "Put it in a DB"; no indexing/consistency plan.
- 2: Names a DB but ignores keys, partitions, or consistency trade-offs.
- 3: Chooses store type per access pattern; defines primary keys, secondary indexes, and typical queries.
- 4: Explains partitioning/sharding, replication, idempotency, deduplication; states consistency (e.g., read-your-writes for owner, eventual for others).
- 5: Handles cross-partition ops (sagas/outbox), conflict resolution, schema evolution strategy.

### F. Reliability & Failure Strategy (10%)


- 1: Assumes success; no plan for retries/timeouts.
- 2: Mentions retries but not idempotency or jitter/backoff.
- 3: Specifies timeouts, retry policy, idempotent endpoints, dead-letter handling; defines degradation strategy.
- 4: Identifies single points of failure; uses quorum/replication; region or AZ failure story.
- 5: Clear recovery/RTO/RPO targets; safe-write patterns (write-ahead, two-phase publish, outbox).

### G. Operability (Obs/Deploy/Cost/Security-Privacy) (10%)


- 1: "We'll monitor it" with no details.
- 2: Names metrics but no signals/alerts or deployment story.
- 3: Defines key SLI/SLO pairs (availability, latency, error rate), basic dashboards/alerts; blue/green or canary with rollback. Mentions top cost driver.
- 4: Traces across services; structured logs; feature flags; cost controls (TTL, cache win-rates). Basic authn/z and PII handling.
- 5: Blast-radius limits, progressive delivery, traffic shadowing; encryption in transit/at rest, key rotation; per-tenant isolation.

### H. Evolution & Trade-offs (5%)


- 1: One-shot design; no path forward.
- 2: Vague "scale later".
- 3: Clear MVP scope and next step; lists 2 explicit trade-offs accepted for time.
- 4: Sequenced de-risking plan (simulate load, dark launch, backfill); flags irreversible choices.
- 5: Articulates exit criteria to graduate components (e.g., move from single shard -> N shards when QPS>...).

### Bonus: Product/User Impact Awareness (0-5%, non-compensatory)


- 0-1: Not addressed or irrelevant digressions.
- 2-3: Briefly ties a design choice to a UX/business constraint (e.g., TTL vs. freshness).
- 4-5: Sharp, time-bounded insight about a user or revenue/latency trade that influenced a key decision.

## 4. Decision Policy


- Weighted composite = Σ(weightᵢ × scoreᵢ).
- Gates (all must hold):
	- C (Architecture) and E (Consistency/Storage) ≥ 3.0 each.
	- A (Framing/Reqs) ≥ 3.0 (design must match stated constraints/SLOs).
- Bands:
	- Strong Hire: composite ≥ 4.2, no construct < 3.5.
	- Hire: composite ≥ 3.6, all gates satisfied.
	- Leaning No: composite 3.2-3.59 or any gated construct at 3.0-3.4.
	- No Hire: composite < 3.2 or any gated construct < 3.0.
- Non-compensatory: Bonus points cannot lift a candidate over a failed gate.

## 5. Red Flags -> Observable Behaviors (score separately from constructs)


- Deal-breakers (stop): refuses to discuss constraints; advocates unsafe data handling; ignores clear SLO breaches after prompt; adversarial behavior.
- Major concerns (document + probe once): insists on tech choices without linking to constraints; denies bottlenecks despite numeric evidence; hand-waves error handling on hot path.
- Moderate concerns (coach once): overly generic ("Kubernetes solves it") without mechanism; omits idempotency for retried writes; over-optimizes premature microservices.

_(Phrase as behaviors -- countable events -- not personality labels.)_

## 6. Standardized Prompts & Hints Ladder


Starter prompt (read verbatim)

- "Design for . Users ...; inputs/outputs .... Please clarify requirements and propose SLOs. We'll then cover APIs, data model, architecture, scale, storage/consistency, and reliability/operations."

If stuck at framing (after ~3 min)

- "Who are the users and top 1-2 journeys? What SLOs (latency/availability) should we target?"

If stuck at APIs/models

- "Pick two pivotal endpoints and sketch request/response. What are the core entities and keys?"

If stuck at scale

- "Assume X RPS peak, Y KB payload, Z% writes. Where's the first bottleneck?"

If stuck at consistency

- "What must be strongly consistent? Where is eventual consistency acceptable? How will clients cope?"

If stuck at reliability/ops

- "A dependency is flaky: what times out, what retries, and what degrades gracefully?"

## 7. Task Bank Specification (for consistency across candidates)


Maintain for each task:

- ID, problem statement, constraints, target SLOs
- Representative workload (avg/peak QPS, read:write ratio, payload size)
- Canonical APIs & entities (with common edge semantics)
- Expected hot path & known bottlenecks (cache miss path, fan-out, write amplification)
- Consistency hotspots (e.g., counters, secondary indexes, cross-shard ops)
- Failure scenarios (dep outage, partition, hot key, backlog growth)
- Operability focus (key SLIs, alerts, rollback story)
- MVP vs. vNext (what's in/out, likely first refactors)

## 8. Interviewer Checklist (run-of-show)


-  Read the starter prompt verbatim; confirm we'll timebox phases.
-  Capture SLOs and constraints before diving into architecture.
-  Get 2-3 core APIs and a minimal entity model on the board.
-  Ask for the hot read/write paths and back-pressure handling.
-  Require quick capacity math; identify the first bottleneck.
-  Ask for the consistency and idempotency story on writes.
-  Cover failure modes and degradation strategy.
-  Touch on observability, deploy/rollback, and top cost driver.
-  Close with MVP -> vNext and 2 explicit trade-offs accepted.
-  Score each construct using BARS; apply gates; record one concrete example per construct.

## 9. Candidate Primer (send with invite)


- We'll design a system together. Expect to discuss requirements & SLOs, APIs/models, architecture, scale math, storage/consistency, reliability, and operability.
- Order-of-magnitude estimates are fine; state assumptions aloud.
- Focus on mechanisms (how a queue/circuit breaker/backoff actually helps), not brand names.
- Whiteboard or doc is fine; keep diagrams legible; label arrows and data flows.
- It's OK to change approach when numbers reveal a bottleneck -- explain the trade-off.

## 10. Scoring Sheet (template)

```
Candidate: ___________   Date: _______   Role: Senior SWE
Task ID: ______________   Interviewer: _______________
A. Framing & Reqs (15%):     1 2 3 4 5  | Notes: ___________________________
B. APIs & Data Model (15%):  1 2 3 4 5  | Notes: ___________________________
C. Architecture (20%):       1 2 3 4 5  | Notes: ___________________________
D. Scale/Capacity (10%):     1 2 3 4 5  | Notes: ___________________________
E. Storage/Consistency (15%):1 2 3 4 5  | Notes: ___________________________
F. Reliability (10%):        1 2 3 4 5  | Notes: ___________________________
G. Operability (10%):        1 2 3 4 5  | Notes: ___________________________
H. Evolution/Trade-offs (5%):1 2 3 4 5  | Notes: ___________________________
Bonus (0-5%, non-comp.):     0 1 2 3 4 5 | Notes: __________________________
Gates satisfied?  A≥3.0   C≥3.0   E≥3.0      Composite: ________
Decision:  Strong Hire / Hire / Lean No / No Hire
```

### Appendix A: Quick Capacity Math Patterns


- RPS -> bandwidth: `RPS × payload (KB) ≈ MB/s` (×8 for Mb/s).
- Daily storage: `events/day × event size` -> compress × retention (days).
- Cache sizing: `hotset keys × avg value size`; check hit-rate needed to meet p95 latency.
- Queue depth: `arrival rate - service rate` over burst window -> required backlog and latency budget.
- Shard count: `(peak writes per shard) ≤ write limit per node` with headroom (e.g., 50-60%).

_If useful, I can also generate a one-page candidate handout with a blank worksheet for SLOs, capacity, and a consistency checklist, aligned to this rubric._
