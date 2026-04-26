---
draft: false
toc: true
title: "Test Strategy Foundations Ref"
linkTitle: "Test Strategy Foundations Ref"
---
# Test Strategy Playbook (v3): Practical Pyramid, Clear Mental Models, and Operational Governance


This document is a combined **teaching guide + execution playbook** for designing, governing, and operating a software test portfolio in modern systems (including microservices, Kafka/Kafka Streams, and Postgres).

It intentionally balances:

- **Pedagogy** (why the strategy works; mental models; memorable heuristics), and
- **Operational detail** (templates, gates, budgets, ownership, triage).

## 0. Executive summary


A sustainable test strategy is a system for producing **fast, repeatable, diagnosable evidence** about software correctness and safety-to-change.

The classic test pyramid remains useful when treated as:

- a **trade-off model** (scope vs speed vs diagnosability), and
- a **governance constraint** (prevent accidental suite drift into slow, flaky, high-scope dependency).

This playbook defines:

1. the mental models and heuristics (how to think),
2. the test basis (what must exist before designing tests),
3. the evidence mapping method (how to turn basis into suites and gates),
4. pipeline budgets and operational processes (how to run it day-to-day).

## 1. Why tests exist (the "meta" model)

### 1.1 The fundamental problem: software changes faster than manual verification scales


Every change risks breaking:

- **Behavior** (regressions),
- **Assumptions** (edge cases, data shape, invariants),
- **Interfaces** (API/schema/event drift),
- **Non-functional properties** (latency, idempotency, concurrency, availability).

**Primary value of tests:** convert expectations into fast, repeatable, diagnosable signals.

### 1.2 What tests provide (value definitions)


Tests primarily provide:

- **Regression control**
  Preserve previously-correct behavior while code evolves.
- **Change amplification reduction**
  Without tests, a small refactor can require broad manual verification. With tests, verification cost stays bounded.
- **Fast feedback for engineers**
  Convert "did I break anything?" from hours/days to seconds/minutes.
- **Design pressure toward modularity**
  Code that is hard to test is often tightly coupled or unclear in responsibilities. Testing encourages explicit boundaries, smaller units, and better separation of concerns.
- **Executable specification**
  Tests document intent in a way that stays synchronized with the code (because failing tests force updates).
- **Delivery confidence**
  Stable test suites enable smaller batch sizes, safer refactors, and more reliable CI/CD.

Tests do **not**:

- Prove "no bugs,"
- Replace observability, canaries, feature flags, and incident response.

### 1.3 The Cost-Fidelity-Debuggability triangle (core mental model)


A reliable way to reason about test layers is a triangle:

- **Fidelity**: how close the test is to production behavior,
- **Cost**: runtime + maintenance + environment complexity,
- **Debuggability**: how quickly a failure tells you what broke.

As scope increases (more real dependencies, more network, more processes):

- Fidelity usually increases,
- Cost and flakiness risk increase,
- Debuggability decreases (failures become harder to localize).

This is why broad, high-fidelity tests must be curated: they are valuable, but expensive and hard to diagnose.

## 2. The Practical Test Pyramid (two rules + modern interpretation)

### 2.1 Two rules (memorable heuristic)


1. **Write tests with different granularity.**
2. **As you go higher, have fewer tests.**

This is not dogma about exact counts. It is a practical way to prevent the test portfolio from drifting into slow, brittle, high-scope dependency.

### 2.2 Classic layers (what each layer is for)

#### Layer A -- Unit tests (many)


Cheap, deterministic tests that cover most logic and edge cases.

#### Layer B -- Narrow integration / component tests (some)


Mid-scope tests that verify wiring and real infrastructure semantics at the seams (DB, Kafka, serialization, config).

#### Layer C -- End-to-end tests (few)


High-scope smoke alarms ensuring critical user journeys still work, kept minimal because they are expensive and harder to localize.

### 2.3 Non-zero-sum improvement (without "economics framing")


The pyramid is not a fixed allocation game. You can improve overall usefulness by:

- increasing determinism (hermetic infra, time control, no sleeps),
- improving diagnosability (better assertions and failure artifacts),
- strengthening contracts (reduce cross-service drift),
- narrowing scope (replace broad integration with seam tests),
- enforcing budgets (prevent suite bloat).

## 3. Acceptance is orthogonal to test level (critical mindset)


"Acceptance" describes **what is being proven**, not **how far up the stack the test runs**.

Acceptance criteria can be validated at:

- unit level (domain invariants),
- API-level component tests (boundary behavior),
- contract tests (compatibility and semantics),
- and only minimally at full E2E.

If a team treats "acceptance = E2E," E2E volume grows, suite stability drops, and iteration slows.

## 4. Definitions and non-negotiable invariants (governance rules)

### 4.1 Working definitions (local terminology)

#### Unit test


- Scope: single module/function/class; pure logic and invariants.
- Dependencies: replaced with test doubles.
- Value: fast regression control; precise fault localization.

#### Narrow integration test


- Scope: one seam between code and *one* real external dependency (e.g., Postgres or Kafka).
- Dependencies: exactly one external system is real; others are controlled/doubled.
- Value: validate "where unit tests lie" (serialization, transactions, migrations, offsets, config).

#### Component/service test (single-service black-box)


- Scope: one service as a black box; exercised through public interfaces (HTTP/gRPC and/or Kafka).
- Dependencies: may include service-owned infra if hermetic and diagnosable.
- Value: realistic wiring and configuration without cross-service orchestration.
> Note on "subsystem tests": permitted only if scope is explicit. In this playbook, "subsystem" means either **narrow integration** or **single-service component**. It must not mean "multi-service integration."

#### Contract test


- Scope: interface compatibility (provider/consumer).
- Forms: CDC for HTTP/gRPC; schema compatibility for events; semantic contract checks (headers, keying, invariants).
- Value: prevent drift and reduce reliance on broad cross-service testing.

#### End-to-end (E2E) test


- Scope: multi-service workflow with real network boundaries.
- Value: "system still works" coverage for a small set of critical journeys.

#### Resilience / HA / disaster tests


- Scope: failure mode validation (failover, broker restarts, replay/backfill).
- Cadence: nightly or pre-release.
- Value: validate operational correctness under disruption.

### 4.2 Non-negotiable invariants


1. **Fast feedback dominates**
   Most regressions must be caught before merge within strict time budgets.
2. **Localizability dominates**
   Most failures must localize to one team-owned component and one seam quickly.
3. **E2E is curated**
   E2E is a small set of money paths, not comprehensive coverage.
4. **Push-down rule**
   If a higher-scope test finds a defect that could be detected lower, add the lower-level test/contract and reduce reliance on the higher-scope check.
5. **Determinism and flake control are enforced**
   Flaky tests are treated as quality defects.
6. **Hermetic by default**
   PR gates must not depend on shared, drifting environments as the default.

## 5. Test basis (what must exist before defining tests)


The "test basis" is the set of artifacts that define what "correct" means and which risks matter.

### 5.1 Test basis template (fillable per service or feature)

#### A) Product intent and acceptance


- FRs: workflows, outcomes, business edge cases.
- NFRs: latency/throughput targets, availability/SLOs, correctness guarantees, security/privacy requirements.
- **Load shape:** define expectations for **steady-state and burst** behavior.
- Constraints: regulatory, operational, platform limits.
- Acceptance criteria: scenario-form (Given/When/Then), example payloads, rejection cases.

#### B) Domain model and invariants


- Entities and state machines.
- Must-always-hold invariants.
- Idempotency rules and dedup semantics.
- Error taxonomy: retryable vs non-retryable; compensations vs hard failures.
- Glossary / ubiquitous language.

#### C) Interface and contract inventory


- HTTP/gRPC: schemas, validation, status/error mapping, versioning/deprecation policy.
- Kafka: topics, ownership, keying strategy, ordering assumptions, schema evolution rules, required headers, retry/DLQ policies.
- Data ownership boundaries.
- **Read replicas:** inventory whether read replicas exist and whether the application reads from them (staleness/lag risk).

#### D) Critical-path low-level design (LLD)


- Sequence diagrams for key flows.
- Transaction boundaries: what must be atomic.
- Concurrency/race strategy: locks, unique constraints, optimistic concurrency, retries.
- Backpressure and timeout policy.

#### E) Quality attribute scenarios as testable "oracles"


Translate NFRs into measurable scenarios:

- "Under X load, p95 < Y" (steady and burst)
- "Consumer lag < Z"
- "Poison message -> DLQ within N attempts"
- "Retries converge and do not loop indefinitely"
- "Replay/backfill preserves invariants"
- "Failover does not violate invariants"

#### F) Risk register


- Failure mode, impact, likelihood.
- Mitigation: design choice + test + monitoring.
- Evidence required to ship.

#### G) Deployment/evolution/replay plan


- Rollout strategy (canary, feature flags, kill switches).
- Schema evolution sequencing (expand/contract; producer/consumer compatibility).
- Backfill/replay procedures and safety checks.
- Migration rollback/roll-forward plan.

#### H) Observability plan aligned to NFRs


- SLIs and dashboards mapped to NFRs.
- Trace/log correlation requirements.
- Alert thresholds and runbooks outline.

#### I) Testability design decisions


- Dependency seams; injectable clocks/IDs.
- Hermetic infra for CI (ephemeral Postgres/Kafka, isolated namespaces).
- Deterministic randomness and bounded retries.

## 6. Evidence mapping method (turn basis into a test plan)

### 6.1 Why evidence mapping exists


Most strategies fail because they do not connect:

- requirements and risks -> to suites -> to pipeline gates -> to ownership.

Evidence mapping makes the connection explicit.

### 6.2 Evidence map template


**Minimum fields:**

 Item | Requirement/Risk | Failure mode | Evidence type | Suite | Gate (Unit/PR/Main/Nightly) | Metric/Threshold | Owner | Notes

**Evidence type examples**

- Unit invariant tests
- Narrow DB integration
- Narrow Kafka integration
- Contract (CDC / schema compatibility)
- Component/service black-box tests
- Minimal E2E smoke
- Resilience/failover suite
- Observability gate (dashboards/alerts)

### 6.3 Push-down workflow (keep the pyramid healthy)


When a defect is found:

1. Classify where it was detected (E2E, component, integration, unit, prod).
2. Decide whether it could have been detected at lower scope.
3. If yes: add/strengthen lower-level tests/contracts and update the evidence map.
4. If no: keep at current scope but improve determinism and diagnostics.

## 7. Layer placement patterns (how to design suites)

### 7.1 Start from invariants and risks


Workflow:

1. Enumerate invariants, acceptance criteria, and quality scenarios.
2. For each, identify the smallest scope that can falsify it.
3. Implement evidence at the lowest feasible layer.
4. Add higher-layer checks only for:
	- seam semantics not provable lower down,
	- contract drift,
	- a minimal set of end-to-end journeys.

### 7.2 What each layer should focus on

#### Unit tests should cover


- Domain rules, invariants, state transitions.
- Validation and error mapping decisions.
- Idempotency logic at the logic level.
- Property-based tests for invariants where appropriate.

#### Narrow integration should cover


- Postgres: migrations, constraints, transaction boundaries, concurrency behavior.
- Kafka: serialization, headers, keying, offsets, retry/DLQ wiring.
- Framework config/wiring: DI, timeouts, backpressure, serialization libraries.

#### Component/service tests should cover


- Service boundary behavior via HTTP/gRPC or Kafka.
- Service-owned infra dependencies in a hermetic environment.
- Controlled stubs for external services.
- Controlled fault injection where practical (timeouts, partial failures).

#### Contract tests should cover


- Schema compatibility rules (events).
- Consumer-driven contracts (HTTP/gRPC).
- Semantic contracts: required headers, keying, ordering assumptions, idempotency keys.

#### E2E should cover


- A small number of critical cross-service journeys.
- Authentication/authorization across boundaries.
- "System still works" signals, not deep edge-case coverage.

#### Resilience/HA should cover


- Failover behavior, retries, backoff.
- Broker restarts/rebalances under load.
- Replay/backfill safety.
- Multi-node database failover and replica behavior (if applicable).

## 8. CI/CD gates and budgets (restore specific constraints)


Budgets are governance. Without them, suites drift upward in scope and runtime.

### 8.1 Suggested stages (separate, enforceable)

#### Stage 1 -- Unit Gate (seconds to a few minutes)


- Purpose: lightning-fast feedback on every change.
- Content: unit tests + static checks that are near-instant.
- **Target:** typically seconds to ≤ 2-5 minutes wall-clock (parallelized).

#### Stage 2 -- Seam Gate (narrow integration)


- Purpose: validate Postgres/Kafka semantics and wiring.
- Content: narrow integration tests.
- **Target:** typically ≤ 5-10 minutes wall-clock (parallelized).

#### Stage 3 -- Service-owned Gate (component/service)


- Purpose: validate service runtime wiring end-to-end within one service boundary.
- Content: component/service tests + key contract checks.
- **Target:** typically ≤ 10-20 minutes wall-clock (parallelized).

#### Stage 4 -- Main Gate (expanded suites)


- Purpose: broader regressions, contract compatibility across key boundaries.
- Content: expanded seam/component coverage + contract compatibility.
- **Target:** typically ≤ 30-60 minutes (organizational choice).

#### Stage 5 -- Nightly/Pre-release (resilience and heavy checks)


- Purpose: HA, failover, reprocessing, soak/performance as required.
- Content: resilience suites, extended E2E smoke if necessary, performance baselines.
- **Target:** not runtime constrained, but must be stable and actionable.

### 8.2 Flake budget and policy


- Goal: near-zero flakes in Unit/Seam/Service-owned gates.
- Policy: a flaky test is a defect.
- Quarantine:
	- allowed only as a time-boxed exception,
	- requires an owner and a remediation deadline,
	- repeated flakes trigger suite redesign (often scope narrowing).

### 8.3 Determinism rules (mandatory design constraints)


- Avoid sleep-based synchronization when explicit signals exist.
- Isolate resources per test run:
	- unique Kafka topics and consumer group IDs,
	- unique Kafka Streams `application.id`,
	- isolated Postgres schemas/databases.
- Deterministic clocks/IDs for logic; explicit timeouts for IO.
- Bounded retries with well-defined backoff.

### 8.4 Release gating and exceptions


If test basis or evidence is missing, choose an explicit policy:

- block release,
- allow behind feature flag to internal/staged users only,
- allow with increased monitoring + rollback plan,
- allow only after manual review by designated owners.

## 9. Operating model (how the test system is run)

### 9.1 Ownership model


- Unit, seam, component tests: owning service team.
- Contracts: shared ownership with a clear primary (provider or platform).
- E2E: release/platform team or shared ownership with strict change control.

### 9.2 Failure triage workflow


When a gate fails:

1. Classify: product regression vs flake vs CI infra vs contract drift.
2. Localize: identify service/seam; attach artifacts (logs, traces, message dumps).
3. Decide action: fix product, fix determinism, narrow scope, strengthen contracts, push down.

### 9.3 Test debt management


Maintain an explicit backlog:

- tests to push down (E2E -> component/integration),
- flaky tests to eliminate,
- missing contract coverage,
- missing diagnostics and harness improvements.

## 10. Change impact matrix (what changes require what evidence)

### 10.1 Database schema changes


Required evidence:

- migration tests (include non-empty data when relevant),
- backward compatible reads/writes (expand/contract),
- rollback/roll-forward plan,
- narrow integration tests for ORM/query correctness.

### 10.2 Kafka event schema changes


Required evidence:

- schema compatibility checks,
- semantic contract checks (headers/keying),
- consumer behavior with old/new versions (at least one direction).

### 10.3 Kafka Streams topology changes


Required evidence:

- deterministic topology-level tests,
- narrow integration for SerDe/state/changelog wiring,
- restart/restore behavior checks.

### 10.4 Configuration/framework upgrades


Required evidence:

- seam tests at affected boundaries,
- minimal E2E smoke only if cross-service wiring risk is material.

### 10.5 New service boundary


Required evidence:

- contract inventory entry,
- CDC (sync) or schema compatibility (async),
- component tests for boundary behavior,
- minimal E2E only for critical journeys.

## 11. Architecture appendix: microservices with Kafka/Kafka Streams and Postgres

### 11.1 Unit tests


- Domain invariants and state transitions.
- Idempotency logic (dedup keys, retry handling logic).
- DTO <-> domain mapping.
- Kafka Streams topology logic, including key selection.

### 11.2 Narrow integration tests


**Postgres**

- Migrations.
- Constraints under concurrency (unique/FK behavior).
- Transaction boundaries and isolation assumptions.
- Query correctness (including index-sensitive behavior as needed).

**Kafka producers/consumers**

- Serialization/deserialization and schema adherence.
- Required headers (correlation IDs, timestamps, trace context).
- Keying strategy (ordering assumptions).
- DLQ/retry policies for invalid messages.
- Offset handling where relevant.

**Kafka Streams**

- SerDe wiring.
- State store configuration and changelog topics.
- Restart/restore correctness.
- Design assumptions: treat delivery as at-least-once unless proven end-to-end.

### 11.3 Component/service tests


- One service boundary via HTTP/gRPC or Kafka.
- Real Postgres + Kafka in hermetic CI for owned dependencies.
- Controlled stubs for external services.

### 11.4 Minimal E2E


- A small number of critical cross-service journeys (smoke).

### 11.5 Multi-node Postgres (HA realism)


PR gates should usually use single-node ephemeral Postgres for determinism and speed. Multi-node belongs in nightly/pre-release focusing on:

- failover during writes,
- connection pool behavior during topology changes,
- retry logic and timeouts,
- replica lag correctness if reads use replicas.

## 12. Anti-pattern catalog (explicitly prohibited)


- **Ice-cream cone:** too many broad integration/E2E tests compensating for weak unit/contract coverage.
- **Acceptance = E2E:** acceptance criteria only validated at top scope.
- **Broad integration disguised as subsystem:** multi-service workflows labeled as "subsystem."
- **Shared staging as default:** reliance on shared, drifting environments for PR gates.
- **Sleep-based synchronization:** time-based waits as primary coordination mechanism.
- **In-memory substitutes for infra semantics:** e.g., validating SQL behavior on non-Postgres substitutes.

## Appendices

### Appendix A -- Evidence map example (skeleton)


| Item | Requirement/Risk | Failure mode | Evidence type | Suite | Gate | Metric/Threshold | Owner | Notes |
|---|---|---|---|---|---|---|---|---|
| A1 | Order transitions valid | shipped-before-paid | unit invariant tests | orders-unit | Unit | 100% pass | Orders | property-based tests |
| A2 | Event schema compatibility | consumer break | schema compatibility + contract | events-contract | Seam/Main | compatibility pass | Platform + Orders | evolution policy |
| A3 | DB write + event publish atomic | missing/double publish | seam DB+Kafka | orders-seam | Seam | 100% pass | Orders | outbox or equivalent |
| A4 | Checkout works end-to-end | cross-service break | E2E smoke | checkout-e2e | Main/Nightly | 100% pass | Release | keep small |

### Appendix B -- Quality attribute scenario template


- Scenario name:
- Steady-state load:
- Burst load:
- SLI(s):
- Threshold(s):
- Measurement method:
- Gate cadence (Unit/Seam/Service/Main/Nightly):
- Failure artifacts to capture:

### Appendix C -- Kafka contract inventory template


- Topic name:
- Owner:
- Keying strategy:
- Ordering assumptions:
- Schema format and compatibility policy:
- Required headers:
- DLQ/retry behavior:
- Backfill/replay policy:
- Consumers of record:

### Appendix D -- "Ready to define tests" checklist (project gate)


1. Acceptance criteria for critical flows exist and are testable.
2. Domain invariants and idempotency semantics documented.
3. API/event contracts inventoried with evolution rules.
4. Critical-path LLD includes transaction boundaries and concurrency strategy.
5. Data model + migration strategy + replay/backfill plan exists.
6. Deployment strategy includes evolution sequencing and rollback.
7. Observability SLIs mapped to NFRs; runbooks drafted.
8. Testability hooks and hermetic CI approach agreed.

## Decision rubric (fast placement guide)


For any proposed test:

1. What risk does it mitigate?
2. What is the smallest scope that can falsify that risk?
3. Will the failure localize quickly? What artifacts will we capture?
4. Is it deterministic? If not, should it move to nightly or be redesigned?
5. Does it duplicate lower-level coverage? If yes, why is it justified?
6. Does it fit the runtime and flake budgets for its intended gate?

If you cannot answer these, the test is likely to increase cost without increasing confidence.

# Application "Acceptance"


We talk about **acceptance** because a test strategy is not only about verifying code correctness; it is about verifying that what you built is the **right thing** from a stakeholder perspective, and doing so in a way that is **testable, repeatable, and dispute-resistant**.

### What "acceptance" means


"Acceptance" is the idea that a feature/change is _acceptable to ship_ because it meets **conditions of satisfaction** that were agreed in advance.

- It is not "did the code run."
- It is "does the system behavior satisfy the requirement as the user/business/regulator defines it."

That is why acceptance is discussed explicitly: it anchors engineering evidence to product intent.

## How and why the concept was introduced

### 1. Contractual roots: "acceptance" as a sign-off gate


Historically, especially in contract-driven software delivery, "acceptance" meant:

- the customer (or a proxy like QA/UAT) validates the delivered system against stated requirements, and
- only then it is "accepted" (often tied to payment, warranty, handoff, or release).

This originated because software outcomes were otherwise ambiguous and disputes were common:

- "You implemented what we said, but not what we meant."
- "Edge cases weren't included."
- "Performance/security expectations weren't met."

Acceptance criteria provided a concrete basis for agreement and verification.

### 2. QA/UAT roots: separating "developer checks" from "user needs"


As engineering practices matured, it became clear that:

- **unit tests** confirm internal logic,
- but they do not prove that the system behaves correctly as a whole from the user's perspective.

So "acceptance testing" emerged as an explicit category: tests aligned to **requirements**, not to modules.

In waterfall-era processes this often became **UAT (User Acceptance Testing)** near the end -- frequently manual and late. That created long feedback loops and expensive rework.

### 3. Agile evolution: acceptance as "definition of done," moved earlier


Agile/XP reframed acceptance to solve the "late UAT" problem:

- If you only discover misunderstandings at the end, cost is high.
- If you define acceptance criteria up front, you reduce ambiguity and rework.

This led to practices like:

- **Acceptance criteria** per story (conditions of satisfaction).
- **ATDD (Acceptance Test-Driven Development)**: define acceptance tests/criteria before implementation.
- **BDD (Behavior-Driven Development)**: express expected behavior in shared language (e.g., Given/When/Then).

The purpose stayed the same -- prove the requirement is met -- but the timing shifted earlier to shorten feedback loops.

## Why acceptance matters in a test framework (today)

### A) It prevents "we tested, but shipped the wrong thing"


Without acceptance criteria, teams can produce lots of passing tests that only confirm:

- internal behaviors,
- implementation details,
- narrow cases the developer assumed.

Acceptance anchors tests to externally meaningful outcomes.

### B) It provides a clean "done" boundary


Acceptance criteria create an objective "done" definition. That improves:

- planning and estimation,
- review quality ("does this meet the stated criteria?"),
- release decisions ("what evidence do we have?").

### C) It reduces E2E bloat (the point of your section)


If teams think "acceptance = E2E," they put all acceptance evidence at the highest scope:

- slow,
- brittle,
- hard to diagnose,
- hard to maintain.

Saying "acceptance is orthogonal to test level" is a corrective:

you can satisfy acceptance criteria with _the smallest scope that can prove them_.

## How to use acceptance correctly (operationally)


1. **Write acceptance criteria as observable behavior**
	- outcomes, state changes, emitted events, error handling, constraints
	- include negative cases and boundaries
2. **Decide the cheapest evidence that can validate it**
	- domain invariant -> unit test
	- DB transaction semantics -> narrow DB integration
	- event schema compatibility -> contract test
	- critical cross-service journey -> minimal E2E
3. **Treat acceptance as a traceability layer**
	- Every acceptance criterion should map to at least one piece of automated evidence (or a justified manual step).

## A concrete example


Acceptance criterion:

"When `CreateOrder` is called with valid items, an order is persisted as `CONFIRMED` and `OrderConfirmed` is published. Duplicate requests do not create duplicates."

Evidence can be:

- Unit: state transition + idempotency rules.
- Narrow integration: DB uniqueness + transaction boundary; Kafka publish shape/headers.
- Contract: event schema compatibility for `OrderConfirmed`.
- E2E: _optional_ smoke that the full checkout path still works.

All of those are "acceptance evidence." Only one of them needs to be E2E -- and often none, if the risk profile doesn't require it.

If you want, I can propose a small acceptance-criteria template that forces "testable behavior + evidence mapping" (and avoids vague statements like "works," "is reliable," "fast enough").

# Application "Acceptance & BDD"


Yes. "Acceptance" and BDD are tightly connected -- but they are not the same thing.

## The connection in one sentence


**BDD is a way to express and validate acceptance criteria as behavior**, using a shared language and examples that business/product/QA and engineers can all agree on.

## How they relate

### Acceptance criteria


- Define **conditions of satisfaction**: what must be true for a feature to be considered done.
- They are "what to prove."

Example:

- "Given an authenticated user with sufficient balance, when they place an order, then the order is confirmed and an `OrderConfirmed` event is published."

### BDD (Behavior-Driven Development)


- A development and collaboration practice to:
	1. clarify intent via behavior examples,
	2. reduce misunderstandings,
	3. make requirements testable early.
- It provides a structured language (commonly **Given/When/Then**) and a process ("three amigos": product/QA/engineering) to define behavior.

So: **BDD is often the method used to produce good acceptance criteria.**

## Are "BDD tests" the same as "acceptance tests"?


They overlap, but there are two important distinctions:

### 1. BDD is primarily a _communication format_; tests are an _execution artifact_


- BDD can exist without automation (as written scenarios).
- "BDD tests" usually means those scenarios are executed via tooling (e.g., Cucumber/Gherkin), but the value of BDD is upstream: shared understanding.

### 2. BDD scenarios can be executed at different test levels


This is where your "acceptance is orthogonal to test level" point becomes relevant.

A Given/When/Then scenario can be implemented as:

- a **unit test** (pure domain behavior),
- a **component/API test** (service boundary),
- a **contract test** (provider/consumer),
- an **E2E test** (full workflow).

BDD does _not_ imply E2E. Many teams mistakenly equate "BDD = UI E2E." That's an anti-pattern.

## Why teams historically associate BDD with E2E


Because BDD tooling (Cucumber/Selenium) became popular for UI-driven automation:

- scenarios mapped to browser steps,
- tests ran slowly and were brittle,
- and "acceptance = UI automation" became common.

That association is accidental and tooling-driven, not conceptual.

## Practical guidance: how to use BDD without falling into E2E bloat

### Use BDD to define behavior; choose the lowest feasible execution level


1. Write scenario (Given/When/Then) as acceptance criteria.
2. Map each scenario to evidence:
	- **Unit** for domain invariants (fast, stable).
	- **API/component** for boundary behavior (validation, auth, persistence).
	- **Contract** for cross-service interfaces (schemas, semantics).
	- **E2E** only for a small number of "money paths."

### Keep UI steps minimal


If you do UI E2E:

- keep it to a handful of critical journeys,
- avoid encoding detailed business rule coverage through the UI.

## Example: one BDD scenario, multiple implementations


Scenario (acceptance):
> Given an authenticated user and a valid cart
> When they place an order
> Then the order is confirmed and an OrderConfirmed event is published
> And placing the same request twice does not create a duplicate order
Possible evidence split:

- Unit: idempotency + state machine (no infra).
- Narrow integration: DB uniqueness + transaction boundary.
- Contract: event schema compatibility.
- E2E: one smoke test that "place order" works across services.

Same scenario, different layers.

## Bottom line


BDD is strongly related to acceptance because it is a disciplined way to _discover and express_ acceptance criteria. But "BDD tests" should not default to E2E. Treat BDD as the specification language; implement the checks at the lowest layer that provides sufficient evidence.
