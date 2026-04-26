---
draft: false
toc: true
title: "Tests"
linkTitle: "Tests"
---
# meta-way


Below is a "meta" way to think about tests as a technical lead: tests are not primarily about catching bugs; they are about controlling _risk_ and _change cost_ by turning expectations into fast, repeatable, diagnosable signals.

## Why we introduce tests at all

### The core problem: software changes faster than human memory


Every code change potentially breaks:

- an existing behavior (regression),
- an implicit assumption (edge cases, data shape, invariants),
- an integration point (API, schema, message contract),
- a non-functional constraint (latency, idempotency, concurrency safety).

Without tests, your feedback loop is mostly:

- "someone notices in production," or
- "manual QA remembers to try that," or
- "engineers manually re-check a bunch of flows."

That feedback loop is slow, expensive, and unreliable.

### What tests _solve_ (conceptually)


Think of tests as mechanisms for:

1. **Regression control**
    Preserve previously-correct behavior while code evolves.
2. **Change amplification reduction**
    Without tests, a small refactor requires large manual verification. With tests, the verification cost stays bounded.
3. **Fast feedback for engineers**
    Convert "did I break anything?" from hours/days to seconds/minutes.
4. **Design pressure (in a good way)**
    Code that's hard to test is often tightly coupled, unclear in responsibilities, or dependency-heavy. Tests create incentives for modularity and explicit boundaries.
5. **Executable specification**
    They document intent in a way that stays synchronized with the code (because failing tests force updates).
6. **Release confidence and throughput**
    A stable test suite enables CI/CD and smaller batch sizes, which reduces risk.

### What tests do _not_ solve


- They don't guarantee "no bugs." They reduce the probability and blast radius of defects.
- They don't replace observability, canaries, feature flags, or incident response.
- They don't automatically validate product correctness (you can write the wrong spec).

## Conceptual model: cost vs fidelity vs debuggability


A useful mental model is a triangle:

- **Fidelity** (how close to real production behavior),
- **Cost** (runtime + maintenance + environment complexity),
- **Debuggability** (how quickly a failure tells you what broke).

As scope increases (more real dependencies, more network, more processes):

- Fidelity tends to go up,
- Cost and flakiness tend to go up,
- Debuggability tends to go down.

The test pyramid is essentially an optimization of this tradeoff.

## The test pyramid (what it is _really_ saying)


Classic pyramid layers:

1. **Unit tests** (many)
2. **Integration / component / subsystem tests** (some)
3. **End-to-end (E2E) tests** (few)

Not dogma about counts; it's a statement about **where you want most of your confidence to come from**: #todo refactor because it's not a zero-sum game (sou you could improve the whole "usefullness")

- **Cheap, deterministic tests** should cover most logic and edge cases.
- **Mid-scope tests** verify wiring and real infrastructure semantics.
- **Large-scope tests** are smoke alarms: they ensure critical user journeys still work, but you keep them minimal because they're expensive and brittle.

### Why "more E2E" usually fails operationally


Teams often try to compensate for weak lower layers by adding E2E. That tends to produce:

- slow pipelines,
- flaky failures (timeouts, environment drift),
- hard-to-debug failures ("something in the system is broken"),
- reluctance to refactor (fear of breaking unknown flows).

## What "subsystem tests" are (and why they matter)


"Subsystem tests" is a term people use inconsistently, but in practice it usually means:
> Tests that exercise a coherent slice of the system (a service, bounded context, or module cluster) **with real internal components** and **real infrastructure dependencies** (DB, queues, filesystem), while **faking or controlling external systems** (third-party APIs, other services).
They sit between unit tests and full E2E:

- Wider scope than unit tests: you validate wiring, configuration, serialization, ORM behavior, migrations, concurrency, etc.
- Narrower and more controlled than E2E: fewer moving parts, clearer ownership, better determinism.

### What problems subsystem tests solve


1. **Reality checks for infrastructure semantics**
    ORMs, transaction boundaries, isolation levels, migrations, query correctness, message ack/retry behavior -- these are where unit tests lie to you.
2. **Boundary correctness within a bounded context**
    You can verify "if an Order is placed, we persist it, publish an event, and enforce idempotency" without needing the whole company's microservices running.
3. **Better diagnosis**
    When a subsystem test fails, you typically know which service/module is broken, not "somewhere in the distributed system."

### A concrete example


If you own an "Orders" service:

- **Unit tests:** pricing rules, validation, state transitions.
- **Subsystem tests:** run the service with a real DB (and maybe a real message broker), call the HTTP/gRPC endpoint, assert:
	- data is persisted correctly,
	- event is published with correct schema,
	- retries are idempotent,
	- authorization checks behave as expected.
- **External dependencies:** payment provider is stubbed; other services are replaced by contract-driven fakes.

This yields high confidence at moderate cost.

## Conceptualization -> Operationalization (how to turn philosophy into a working strategy)

### 1. Conceptualize: define what "correct" means as invariants


For each domain area, identify invariants like:

- "State transitions are valid (no shipped-before-paid)."
- "Operations are idempotent under retry."
- "Events conform to schema and are backwards compatible."
- "Authorization cannot be bypassed."
- "Writes are atomic with respect to invariants."

### 2. Operationalize: map invariants to the cheapest test level that can falsify them


Rule of thumb:

- If it's pure logic -> unit tests.
- If it depends on DB/queue semantics or framework wiring -> subsystem tests.
- If it's about cross-service choreography or critical happy-path flows -> a small number of E2E tests + contract tests.

### 3. Make it sustainable: enforce test _quality attributes_


A test suite only pays off if it is:

- **Deterministic** (no flakes tolerated),
- **Fast enough** for CI gating,
- **Diagnosable** (failures point to a cause),
- **Maintainable** (clear intent, minimal incidental setup).

This is why pyramids emphasize smaller scopes: they naturally support those attributes.

## Practical guidance: building a modern pyramid (with subsystem tests)


A common, effective distribution (conceptual, not numeric):

- **Unit:** majority of cases and edge conditions.
- **Subsystem/component:** enough to cover "real infra + real adapters" paths.
- **Contract tests:** for service-to-service and service-to-third-party boundaries.
- **E2E:** a thin layer of smoke tests for top business journeys.

Two high-leverage practices:

1. **Contract tests prevent E2E explosion**
    If each service verifies its producer/consumer contracts, you don't need massive E2E coverage to detect API drift.
2. **Hermetic subsystem tests reduce flakes**
    Use controlled dependencies (e.g., ephemeral DB/queue instances, deterministic clocks/IDs) so tests don't rely on shared environments.

## Common failure modes (and how to avoid them)


- **"Unit tests everywhere" but constant prod surprises**
    Likely missing subsystem tests around DB, serialization, concurrency, configuration.
- **"Lots of integration tests" but pipeline is slow and flaky**
    Likely too many tests at too-wide scope, shared environments, weak determinism discipline.
- **"E2E as primary safety net"**
    Usually indicates weak boundaries and poor contract discipline; refactor toward subsystem + contract coverage.
- **Testing implementation details**
    Increases brittleness. Prefer testing observable behavior at the right boundary.

## A simple decision rubric (useful for tech leads)


When adding a test, ask:

1. What risk am I controlling (regression, infra semantics, contract drift, journey breakage)?
2. What is the smallest scope that can detect this risk?
3. Will failure be diagnosable in <10 minutes?
4. Can this test be deterministic on every run?
5. Where will it run (local, PR CI, nightly), and what is the runtime budget?

If you want, describe your system shape (monolith vs microservices, main persistence and messaging tech, CI constraints). I can propose a concrete, layered test strategy (including where subsystem tests start/stop, what to stub, and what to keep real) tailored to that architecture.

# preparation


Before defining tests, you want to define the _test basis_: the set of artifacts and decisions that collectively state "what correctness means," "what risks matter," and "what evidence is acceptable." Product spec and HLD are necessary, but they are not sufficient in distributed systems.

Below is a structured set of prerequisites I would expect (or deliberately create) before committing to a test strategy.

## 1. Product intent and acceptance basis

### Functional requirements (FRs)


- Primary user/business workflows.
- Explicit success/failure outcomes.
- Edge cases that matter to the business (e.g., cancellations, refunds, partial fulfillment).

### Non-functional requirements (NFRs)


- Latency/throughput targets per operation (p50/p95/p99, steady-state vs burst).
- Availability/SLOs and error budgets.
- Correctness guarantees (consistency expectations, acceptable staleness).
- Security/privacy/compliance constraints.

### Constraints


- Regulatory (PII retention, audit).
- Operational (multi-region, disaster recovery, maintenance windows).
- Platform constraints (language/runtime, managed services, limits).

### Acceptance criteria


- A concise, testable "definition of done" for each FR/NFR.
- Concrete examples (input/output pairs; scenario tables).

If FRs/NFRs exist but are not operationalized into acceptance criteria, test definition tends to devolve into personal opinion.

## 2. Domain model and semantic contracts (usually missing, but essential)

### Domain invariants and state machines


- Entities, lifecycle states, valid transitions.
- Invariants that must always hold (e.g., "cannot ship before paid").
- Idempotency rules and dedup semantics.

### Ubiquitous language and glossary


- Prevents "same word, different meaning" across services.
- Especially important when events are contracts.

### Error and exception taxonomy


- What errors are user-visible vs internal.
- Retryable vs non-retryable.
- Compensation patterns (sagas) vs hard failures.

These become the basis for unit tests and for subsystem tests around messaging and persistence semantics.

## 3. System boundaries and interface specifications


In microservices, you must define boundaries explicitly or you will not know what to mock vs what to keep real.

### API contracts


- HTTP/gRPC: schemas, validation rules, status codes, pagination, concurrency tokens, idempotency keys.
- Versioning and deprecation policy.

### Event contracts (Kafka)


- Topics, partitions, keying strategy, ordering guarantees (what is assumed vs not).
- Message schema (Avro/Protobuf/JSON), evolution rules, required headers.
- Delivery semantics expectations (assume at-least-once unless proven otherwise end-to-end).
- DLQ/retry strategy.

### Data ownership and access rules


- Which service owns which tables/aggregates.
- Whether other services may read that data (ideally no, but if yes: how).

Interface specs are the foundation for contract tests; without them, you end up relying on brittle E2E.

## 4. Architecture blueprint beyond HLD


An HLD is typically not enough because it often omits "how it fails" and "how it operates."

### Low-level design of critical paths


- Sequence diagrams for key workflows.
- Transaction boundaries and consistency model ("what is atomic?").
- Concurrency model and race handling.
- Backpressure strategy (queues, rate limiting).

### Data design


- Postgres schema (logical + key indexes + constraints).
- Migration strategy (expand/contract, backward compatible).
- Read/write patterns and performance assumptions.
- Multi-node specifics: failover behavior, read replicas, staleness and routing.

### Kafka Streams topology design (if applicable)


- Exactly which topics are inputs/outputs.
- State stores, changelog topics, repartition topics.
- Windowing strategy, event-time vs processing-time decisions.
- Reprocessing strategy and determinism requirements.

These become the basis for subsystem tests and resilience/performance tests.

## 5. Risk analysis and test strategy inputs


This is the part that turns "design documents" into a _testing plan_.

### Risk register (lightweight is fine)


For each key risk, define:

- Failure mode (what breaks).
- Impact (user/business).
- Likelihood (based on past incidents / complexity).
- Mitigation (design choice + test type + monitoring).

### Quality attributes by component


Examples:

- payment/billing: correctness > latency
- feeds/recommendations: latency/availability > strict consistency
- auth: security correctness dominates

This tells you where to spend test budget.

## 6. Operational readiness prerequisites (often overlooked)


Tests should align with how you will detect and manage failure in production.

### Observability plan


- What to log, metrics, traces, and cardinality control.
- Correlation IDs (request IDs, event IDs).
- SLIs mapped to NFRs (e.g., "time to process event," "consumer lag," "DB commit latency").
- Alerting thresholds and runbooks.

### Deployment and rollback strategy


- Blue/green, canary, progressive delivery.
- Feature flags and kill switches (especially for consumers/streams).
- Schema evolution sequencing (producer/consumer compatibility).
- Backfill/replay procedures and safety checks.

### Data correction and reprocessing strategy


- How to reprocess Kafka safely.
- Idempotency and dedup mechanisms.
- How to repair projections/materialized views.

This directly influences what you test (e.g., replay safety, idempotency, migration rollbacks).

## 7. Security and privacy model


At minimum:

- Threat model for key flows (authZ bypass, event spoofing, data exfiltration).
- PII classification and retention rules.
- Encryption, secrets management, audit logging requirements.

This yields specific tests (authZ invariants, redaction checks, retention enforcement).

## 8. Testability design (do this explicitly)


Before writing tests, design for testability:

- Clear boundaries (ports/adapters), dependency injection points.
- Deterministic time/IDs in core logic.
- Ability to run one service with ephemeral Kafka/Postgres.
- "Hermetic" configuration: unique topic names, consumer groups, Streams application.id per test.
- Controlled external side effects (outbox pattern, stubs).

If you skip this, tests become expensive and flaky, and people stop trusting them.

## Minimal "ready to define tests" checklist


If you want a crisp gate, I use something like:

1. FRs/NFRs + explicit acceptance criteria for critical flows.
2. Domain invariants + idempotency rules written down.
3. API + event contracts (schema, keying, headers, ordering assumptions).
4. Transaction boundaries and consistency model documented for critical paths.
5. Data model + migration strategy + replay/backfill strategy.
6. Observability SLIs aligned to NFRs.
7. Deployment/versioning plan (especially schema evolution).
8. Testability hooks agreed (time, IDs, boundary seams).

If you share one concrete feature (one workflow) and its NFRs, I can show how each of the prerequisites above maps to specific test types (unit/subsystem/contract/E2E/resilience) and what evidence you should require before shipping.

# microservices shape

## thinking


Thinking

Designing a microservices test strategy

I need to outline a comprehensive test strategy for microservices with Kafka/Kafka Streams and multi-node Postgres clusters. This includes a structured approach across different layers: unit, subsystem, contract, integration, and E2E. I'll also mention tools like Testcontainers, embedded Kafka, and TopologyTestDriver for Kafka Streams. I'll cover Kafka-specific topics like schemas, consumer group behavior, idempotency, DLQ, and Postgres failover testing. The strategy should integrate patterns like schema evolution testing and database-specific approaches.

Designing effective test environments for microservices

I'll mention using ephemeral containers for hermetic test environments and the outbox pattern for exactly-once guarantees between DB and Kafka. For Kafka Streams, I'll test topologies deterministically with TopologyTestDriver and test serialization, state stores, and integration with real Kafka. Subsystem tests should use real Postgres and Kafka brokers with stubs for external services like Wiremock. Also, I'll address multi-node Postgres and HA tests, focusing on replication lag and failover. Finally, I'll categorize tests into correctness, performance, and resilience while keeping it focused on risk management.

Given your stack (microservices + Kafka/Kafka Streams + multi-node Postgres), the "test pyramid + subsystem tests" conversation becomes very concrete: you need to control (a) _domain correctness_, (b) _distributed messaging semantics_, and (c) _database semantics under concurrency and partial failure_ -- without turning CI into a slow, flaky distributed-systems simulation.

Below is a pragmatic model that I would use as a tech lead.

## 1. What tests are buying you in a Kafka + Postgres microservices world

### The real risks you must control


1. **Regression of domain invariants**
    Most production issues are "a rule changed unintentionally" or "edge case not handled" (state transitions, idempotency rules, validation, pricing, entitlements, etc.).
2. **Mismatch between what you think messaging does and what Kafka actually does**
    Examples:
	- duplicate delivery and reprocessing,
	- reordering across partitions,
	- consumer group rebalances,
	- offset commit behavior,
	- DLQ/retry loops,
	- schema evolution breaking consumers.
3. **Mismatch between what you think Postgres does and what it actually does**
    Examples:
	- transaction boundaries and isolation behavior,
	- lock contention and deadlocks,
	- uniqueness guarantees under race,
	- migrations that work on empty DB but fail on real data,
	- read-your-writes vs replica lag (if read replicas are involved).
4. **Change cost**
    Without automated checks, every change forces large manual verification and discourages refactoring. With good tests, you can keep batch sizes small and ship reliably.

The key is _placing_ tests so that most confidence comes from fast, deterministic checks, while still validating the "physics" of Kafka and Postgres where it matters.

## 2. A modern pyramid for your architecture


Think in layers by **scope vs realism**:

### A) Unit tests (many; fastest; highest diagnostic value)


Goal: validate _pure logic and deterministic transformations_.

**Microservice domain code**

- invariants, state transitions, validations
- idempotency logic (given same command/event twice, outcome is stable)
- authorization decisions
- mapping between DTOs and domain objects

**Kafka Streams-specific unit layer**

- topology correctness with deterministic drivers
- key selection/partitioning decisions (very important; wrong keys create subtle ordering bugs)
- windowing/aggregation logic, suppression, punctuators, state store behaviors (as far as deterministically testable)

Rule: if it doesn't require a real broker or DB to falsify, keep it here.

### B) Subsystem / component tests (some; very high value in your stack)


Definition (operational): **run one service as a black box with real infrastructure dependencies it owns**:

- real Postgres (usually single-node ephemeral in CI)
- real Kafka broker (ephemeral)
- real serialization stack (Avro/Protobuf/JSON), schema registry if you use it
    ...and **stub external services** (HTTP/gRPC to other services, third-party APIs).

What these tests catch that unit tests will miss:

- ORM mapping issues, migrations, transaction scope mistakes
- Kafka serialization/header conventions, consumer config mistakes
- "outbox pattern" correctness (if used), transactional boundaries, double-publish scenarios
- retry policies and DLQ wiring
- Kafka Streams runtime wiring issues (SerDes, state directory config, changelog topics, exactly-once settings)

These are the "money tests" for Kafka + Postgres systems.

### C) Contract tests (strongly recommended; reduces need for broad E2E)


In microservices with Kafka, you need contracts for **asynchronous interfaces**.

Two contract directions:

1. **Schema / compatibility contracts** (producer <-> consumer)
	- enforce backward/forward compatibility rules in CI
	- verify required fields, defaulting rules, enums evolution rules, etc.
2. **Behavioral contracts** (semantic expectations)
	- "this event means X, and consumers can rely on Y invariants"
	- "these headers exist", "idempotency key semantics", "timestamps are event-time", etc.

Contract tests prevent "integration surprises" without requiring the whole fleet to run together.

### D) End-to-end tests (few; smoke coverage only)


Goal: validate a small number of critical business journeys across multiple services.

Keep these minimal because:

- failures are hard to localize,
- they're the most expensive to maintain,
- they tend to become flaky as the system grows.

Use them as "canary checks," not as your primary safety net.

### E) Resilience / HA tests (targeted; usually nightly or pre-release)


Because you have **multi-node Postgres**, you should explicitly test failure modes -- but not on every PR.

Examples:

- primary failover during write load
- replica lag and read routing correctness (if applicable)
- transaction retries at the application layer
- Kafka broker restart / partition leader change while consumers process
- consumer rebalance during processing (does it cause duplicates? is processing idempotent?)

These are valuable, but too slow and environment-heavy for PR gating.

## 3. Subsystem tests: how to "shape" them for Kafka + Postgres

### Recommended subsystem test boundary


Per service:

- Start the service (or its core module) with real Postgres + Kafka.
- Interact only via the service's public boundary:
	- HTTP/gRPC endpoints, or
	- input Kafka topics (produce events and observe outputs + DB state).
- Stub:
	- downstream HTTP/gRPC,
	- third-party integrations,
	- other services' Kafka outputs (unless you are explicitly testing a contract).

This gives you high fidelity for what the service owns, and stable determinism.

### The 8 failure classes subsystem tests should intentionally cover


1. **Idempotency**: same message twice -> no double side effects.
2. **Ordering assumptions**: messages out of order -> still safe (or explicitly rejected).
3. **At-least-once reality**: duplicates and retries happen; verify behavior.
4. **Transactional integrity**: DB update + event publish semantics (outbox or equivalent).
5. **Schema evolution**: old message version still works; new optional fields don't break consumers.
6. **Backpressure / retry / DLQ**: poison messages go to DLQ; retry policy doesn't loop forever.
7. **Consumer restart**: stop/start service -> resumes correctly from offsets.
8. **Kafka Streams state**: restoration from changelog topics; state store correctness under restart.

If your subsystem suite covers these, E2E can stay small.

## 4. Kafka and Kafka Streams: what to test where

### Kafka producers/consumers (non-Streams)


**Unit tests**

- mapping domain -> event schema
- key selection logic (partitioning)
- idempotency key generation / correlation IDs

**Subsystem tests**

- produce to Kafka and verify:
	- expected topic,
	- correct key,
	- correct headers,
	- correct serialization,
	- consumer can read it,
	- DLQ behavior under parse/validation failure.

### Kafka Streams


Kafka Streams is its own "subsystem inside the service." I typically split into:

1. **Topology-level deterministic tests (unit-like)**
	- verify transformations and aggregation results given input records
	- verify windowing logic with controlled timestamps
	- verify output topics and keys
2. **Integration/subsystem tests with a real broker**
	- catch misconfig (SerDes, state store/changelog, topic config, exactly-once settings, ACLs)
	- validate restart behavior and state restoration
	- validate processing guarantees as configured (and ensure your application logic remains safe under duplicates anyway)

Important principle: even if you enable "exactly-once" processing in Streams, design semantics as if duplicates can happen, because operational realities and boundary effects (DB writes, external calls) often reintroduce at-least-once behavior unless you implement end-to-end transactional patterns.

## 5. Postgres: single-node in CI, multi-node in targeted suites

### What most teams should do


- **PR/CI**: use ephemeral **single-node Postgres** for almost all subsystem tests.
    It gives you accurate SQL semantics, transactions, constraints, and migrations with far less flakiness.
- **Nightly / pre-release**: run a smaller suite against **multi-node Postgres** to validate:
	- failover handling,
	- retry logic and timeouts,
	- read replica behavior (only if the app reads from replicas),
	- connection pool behavior during topology changes.

### What to specifically test for Postgres in subsystem tests


- migrations on non-empty data (seed a representative dataset)
- transaction boundaries (what must be atomic)
- unique constraints under concurrency (two requests racing)
- locking/deadlocks (at least one designed deadlock case to ensure you fail fast and retry appropriately)
- serialization anomalies if you rely on particular isolation levels

## 6. Operationalizing this into a workable CI strategy


A pattern that scales:

### PR gating (fast, deterministic)


- unit tests (including Streams topology-level tests)
- subsystem tests for each service:
	- Postgres container
	- Kafka container
	- stubs for external dependencies
- schema compatibility checks (contract)

### Merge/main (still controlled)


- the same as PR
- plus a few cross-service contract checks (if you version topics/contracts centrally)

### Nightly / pre-release (environment-heavy)


- multi-node Postgres failover scenarios
- broker restarts / consumer rebalances under load
- a small E2E suite (critical flows only)
- performance regression checks on the most expensive Streams topologies (optional but useful)

## 7. Practical guardrails (to keep tests from becoming a tax)


1. **Zero tolerance for flaky tests**
    Flakes destroy trust and lead to ignoring failures.
2. **Make failures diagnosable**
	- structured assertions,
	- capture produced records on failure,
	- include correlation IDs in test logs,
	- keep each subsystem test focused on one invariant.
3. **Use hermetic test patterns**
	- unique topic names per test run (or per test class)
	- unique consumer group IDs and Streams `application.id`
	- fixed clocks and deterministic IDs where possible
4. **Prefer contract tests over "full integration environments"**
    Contracts scale; shared environments become bottlenecks.

## A concrete "default" scheme I would propose per microservice


- **Unit**
	- domain invariants and edge cases
	- Streams topology deterministic tests
- **Subsystem**
	- service + Postgres + Kafka
	- verify DB writes + produced events + retry/DLQ
	- restart/resume behavior at least once
- **Contracts**
	- schema compatibility on every change
	- semantic contract docs + lightweight behavioral checks
- **E2E**
	- 5-15 critical journeys total across the platform, not per service
- **Nightly resilience**
	- multi-node Postgres failover
	- broker restart/rebalance under processing

If you tell me one representative flow (e.g., "OrderPlaced event triggers Streams aggregation and writes projection to Postgres, then publishes BillingRequested"), I can map that single flow into a crisp set of unit/subsystem/contract/E2E tests and show exactly what should be asserted at each layer. That tends to make the pyramid and the subsystem boundary "click" for teams.

# pyramid rewritten prop


You are correct to challenge the "not dogma about counts" phrasing. The pyramid is often presented as if test effort is a fixed budget that you merely allocate across layers. In practice, it is not a zero-sum game: you can increase _total_ confidence and _total_ usefulness by improving test design, observability, determinism, diagnosability, and by introducing the right intermediate artifacts (contracts, narrow integration, etc.). The pyramid is best understood as a _constraint system_ on where marginal investment produces the highest return -- not a fixed pie chart.

Below is a refactoring of the original paragraph and the underlying model so it reflects the non-zero-sum reality without losing the core guidance.

## Refactored principle: the pyramid is a leverage curve, not an allocation rule

### What the pyramid should mean


The test pyramid is a practical expression of two empirical curves:

1. **Marginal confidence per dollar/time** is typically highest at small scope and declines with scope.
2. **Marginal coverage of system-coupling risks** is typically low at small scope and increases with scope.

The optimal strategy is to:

- Earn most confidence cheaply at low scope,
- Use mid/high scope to cover the risks that low scope cannot falsify,
- Actively reduce the cost and brittleness of higher-scope tests (so they become more useful per unit cost).

This is explicitly non-zero-sum: you can improve the whole curve.

### The "dogma" that should be removed


What becomes dogma is treating "many/some/few" as:

- a fixed ratio,
- a universal template,
- a substitute for thinking about risk and evidence.

Instead, treat "many/some/few" as a default expectation **given typical cost and flake profiles**. If you change those profiles, the shape can legitimately change.

## Refactored wording you can use in your framework document


Here is a more precise replacement for the original text (drop-in quality):
> The "pyramid" is not a rule about proportions; it is guidance about **marginal return on assurance**.
> Low-scope tests are usually cheapest and most diagnosable, so they should carry most of your regression and edge-case coverage. Mid-scope tests validate boundary semantics and integration points that unit tests cannot falsify. High-scope E2E tests provide limited but essential end-to-end confidence for critical journeys.
> This is not zero-sum: you can increase overall assurance by improving determinism, diagnosability, and contract clarity, and by using narrow integration and contract tests to make higher-level assurance cheaper and less brittle.

## How to express "non-zero-sum" operationally


If you want this to be actionable (not philosophical), define levers that increase total usefulness:

### 1. Reduce the cost of higher-scope tests


Higher scope is expensive mostly because of environment and flakiness. You can make them cheaper by:

- hermetic environments (ephemeral Kafka/Postgres, isolated topic/group IDs),
- deterministic clocks/IDs,
- aggressive observability + trace capture on failures,
- narrowing scope (component tests rather than multi-service),
- contract testing to eliminate broad cross-service coupling.

Result: you don't just "move coverage down"; you make the entire suite more effective.

### 2. Improve diagnosability to reduce the "hidden cost"


A slow test that pinpoints the fault is often cheaper than a fast test that yields ambiguous failures and sends engineers on multi-hour hunts.

Operational statement:

- A test is "cheap" only if it fails with actionable diagnosis.

### 3. Introduce "bridge layers" that dominate ROI


This is where the zero-sum framing breaks hardest. Adding contract tests and narrow integration tests can:

- reduce reliance on E2E,
- reduce mean time to fix,
- improve release velocity,
- increase confidence without ballooning runtime.

This is a net gain, not a redistribution.

### 4. Allow pyramid shape to vary by risk profile


For example:

- A system with intense DB semantics risk might legitimately have _more_ narrow DB integration tests than a typical web app.
- A stable monolith with few external dependencies might require fewer integration tests.

Pyramid guidance should be parameterized by:

- failure impact,
- dependency complexity,
- change frequency,
- cost of running environments,
- flake rate tolerance.

## A better "invariant" than counts


Instead of "many/some/few," define invariants you actually care about:

1. **Most failures should be caught before merge** (fast pipeline gates).
2. **Most failures should be localized** (single team/service ownership).
3. **High-scope tests should be rare enough to remain stable and fast enough to be trusted.**
4. **If a high-scope test finds a defect not caught lower, you add a lower-scope test (push down), or a contract, to prevent recurrence.**

This preserves the pyramid's intent while acknowledging non-zero-sum improvement.

## How this refactoring translates to AI/agentic evals (briefly)


The same refactor applies:

- It is not "unit evals vs scenario evals vs E2E agent runs" as a fixed budget.
- You can increase total assurance by improving graders, trace capture, determinism, and by adding component evals (tool-call correctness, retrieval grounding) that reduce reliance on costly end-to-end agent trajectories.

If you want, I can rewrite the original "classic pyramid layers" section into a polished, framework-ready markdown subsection (with definitions, invariants, and anti-dogma language) in the same style as your earlier "Practical Test Pyramid" doc.

# pyramid rewritten-2

## Test Pyramid as an Assurance Leverage Model (Framework-Ready)


This section reframes the classic test pyramid to remove "counts dogma" and make it explicitly **non-zero-sum**: you can improve the total usefulness of the test system, not only rebalance effort across layers.

### 1. Core idea: not a ratio, a leverage curve


The "pyramid" is not guidance about exact proportions of test types. It is guidance about **marginal return on assurance**.

As test scope increases (more real dependencies, more processes, more network):

- **Fidelity** tends to increase (closer to production behavior),
- **Cost and flakiness risk** tend to increase,
- **Diagnosability** tends to decrease (harder to localize root cause).

A healthy strategy earns most regression confidence at low scope, and uses higher scope only for risks low scope cannot falsify -- while continuously improving the cost and determinism of every layer.

### 2. Layer definitions (what each layer is for)


The classic layers remain useful if each layer has a clear job:

#### Layer A -- Unit tests (many)


**Purpose:** prove domain logic, invariants, and edge cases with maximum speed and diagnostic precision.

**Scope:** pure functions and small modules; dependencies replaced with doubles.

**Signals you want:**

- correctness of business rules and state transitions,
- idempotency logic (at the logic level),
- validation and error mapping,
- corner cases and invariants.

**Quality bar:** deterministic and fast enough to run continually during development and on every PR.

#### Layer B -- Narrow integration / component tests (some)


**Purpose:** validate seams where "unit tests lie": infrastructure semantics, wiring, configuration, serialization, transactions.

**Scope:** one service or component with **one real external dependency at a time** (e.g., Postgres, Kafka, filesystem) and controlled inputs/outputs.

**Signals you want:**

- DB behavior: migrations, constraints, transaction boundaries, concurrency cases,
- messaging behavior: serialization, headers, keying/partitioning, retries/DLQ, offset semantics,
- framework wiring: DI/configuration, error handling at the boundary,
- schema and contract adherence.

**Quality bar:** still deterministic enough for CI gating; failures should localize to a specific service/component and seam.
> Note: This is where many teams use the term "subsystem tests." In this framework, subsystem tests are acceptable _only if they remain narrow and diagnosable_ -- a single owned boundary, not a multi-service workflow.

#### Layer C -- End-to-end tests (few)


**Purpose:** provide "system still works" coverage for a small set of critical user journeys.

**Scope:** multiple services and real network boundaries; real or production-like environments.

**Signals you want:**

- a limited set of "money paths" survives real orchestration,
- top-level integration wiring didn't break,
- authentication/authorization and core flows still function end-to-end.

**Quality bar:** minimal, stable, and treated as smoke alarms -- not the primary safety net.

### 3. The anti-dogma statement (the refactor)


Use this wording to avoid the "zero-sum counts" trap:
> The pyramid is not a rule about fixed proportions; it is a rule about where **marginal investment buys the most assurance**. Low-scope tests typically yield the highest confidence per unit cost and are most diagnosable, so they should carry most regression and edge-case coverage. Mid-scope tests validate boundary semantics and integration points that unit tests cannot falsify. E2E tests are intentionally few, focused on critical journeys, because they are costly and harder to diagnose.
> This is not zero-sum: you can increase overall assurance by improving determinism, diagnosability, contract clarity, and by introducing narrow integration and contract testing that reduces the need for broad E2E.

### 4. Framework invariants (what must be true, regardless of counts)


Instead of ratios, enforce these invariants:

1. **Fast feedback dominates:** most regressions should be caught in PR gates with short runtime budgets.
2. **Localizability dominates:** most failures should identify _a specific service/component and seam_ quickly.
3. **E2E is curated:** E2E exists to detect "whole system broke" conditions for a small set of journeys -- not to cover every rule.
4. **Push-down rule:** if a high-scope test finds a defect that could have been caught lower, add or strengthen the lower-scope test or contract so the same class of defect is caught earlier next time.
5. **Determinism is enforced:** flaky tests are treated as a quality defect (not "CI noise").

### 5. What "improving the whole usefulness" looks like (non-zero-sum levers)


You can raise total confidence without simply moving tests between layers by investing in:

- **Diagnosability:** richer assertions, structured failure artifacts, traces/log capture on failure.
- **Determinism:** hermetic environments, isolated resources (topics, consumer groups), controlled clocks/IDs, no sleeps.
- **Contracts:** explicit API/event schemas and compatibility checks to eliminate broad integration dependency.
- **Narrowing scope:** replace "broad integration" with seam-focused integration tests (DB seam, Kafka seam, etc.).
- **Runtime budgets:** hard caps per pipeline stage prevent accidental pyramid inversion.

### 6. Common anti-patterns (explicitly prohibited)


- **Ice-cream cone:** too many broad integration/E2E tests used to compensate for weak unit and contract coverage.
- **Acceptance = E2E:** acceptance criteria implemented only at top scope; leads to slow, brittle suites.
- **Duplicate coverage at high scope:** asserting business rules mainly through E2E instead of unit/invariant tests.
- **Shared staging dependency:** tests that depend on shared, drifting environments as the default.

### 7. Decision rubric for placing a new test


For any new test, answer:

1. What risk is being mitigated (regression, seam semantics, contract drift, journey breakage)?
2. What is the **smallest scope** that can falsify that risk?
3. Will the failure localize quickly? If not, how will we capture artifacts to localize?
4. Can it be deterministic? If not, should it move to a different layer or cadence (nightly vs PR)?
5. Does it duplicate lower-level coverage? If yes, why is the duplication justified?

If you want, paste your original "Classic pyramid layers..." paragraph and I'll rewrite it into a shorter version that still preserves this framework language (drop-in replacement with consistent tone).
