---
draft: false
toc: true
title: "Test Strategy Foundations"
linkTitle: "Test Strategy Foundations"
---
# Test Strategy Foundations and the Practical Test Pyramid (Refactored)


This document refactors the earlier "meta-way" and "preparation" notes into a single, operational playbook. It incorporates the core intent of *The Practical Test Pyramid* (fast feedback; narrow over broad integration; contracts to reduce end-to-end dependency; avoid duplication).

## 1. Why tests exist (the "meta" model)

### 1.1 The fundamental problem


Software changes faster than human memory and faster than manual verification can scale.

Every change risks breaking:

- **Behavior** (regressions).
- **Assumptions** (edge cases, data shape, invariants).
- **Interfaces** (API/schema/event contract drift).
- **Non-functional properties** (latency, idempotency, concurrency, availability).

**Primary value of tests:** convert expectations into *fast, repeatable, diagnosable signals* that reduce risk and the cost of change.

### 1.2 What tests are for (and what they are not for)


Tests primarily provide:

- **Regression control** (preserve behavior while evolving code).
- **Fast engineer feedback** (tighten the loop between change and evidence).
- **Change amplification reduction** (small change does not require broad manual verification).
- **Design pressure** toward explicit boundaries and modularity.
- **Executable specification** (intent that stays synchronized with code).
- **Deployment confidence** (enables continuous delivery when paired with pipeline discipline).

Tests do **not**:

- Prove "no bugs."
- Replace observability, incident response, canaries, feature flags, and rollback tooling.
- Guarantee product correctness if the specification is wrong.

### 1.3 The cost-fidelity-debuggability triangle


A practical mental model is a triangle:

- **Fidelity**: closeness to production behavior.
- **Cost**: runtime + maintenance + environment complexity.
- **Debuggability**: how quickly a failure tells you what broke.

As scope increases (more real dependencies, more network, more processes):

- Fidelity increases,
- Cost and flakiness increase,
- Debuggability decreases.

A healthy test strategy deliberately **earns most confidence at low scope**, and uses high scope as a small, carefully managed layer.

## 2. The Practical Test Pyramid (interpreted for modern systems)

### 2.1 The two rules that matter


The test pyramid is not a taxonomy game. Its durable intent is:

1. **Write tests with different granularity.**
2. **As you go "higher," you should have fewer tests.**

Keep the pyramid shape to preserve speed and maintainability.

### 2.2 Stop arguing about names; optimize for feedback


Layer names vary ("unit/service/component/contract/E2E"). What matters operationally is:

- **scope** (what is included),
- **speed** (time-to-signal),
- **determinism** (flake rate),
- **diagnosability** (how localized the failure is).

If your suite is "correctly named" but slow, flaky, and untrusted, it is functionally broken.

### 2.3 Narrow vs broad integration (core refinement)


A critical refinement from the paper is the distinction between:

- **narrow integration tests**: integrate with *one* real external dependency at a time, preferably run locally/ephemerally.
- **broad integration tests**: integrate with many things over the network; slow and hard to maintain.

A common failure mode is producing an "ice-cream cone" (too many broad, high-level tests), which causes slow pipelines and low trust.

## 3. "Subsystem tests" refactored: define them precisely


"Subsystem tests" is useful vocabulary only if it has clear boundaries. Refactor it into two concepts:

### 3.1 Component/service tests (inside one service boundary)


**Definition:** run one service as a black box and validate behavior through its public interfaces (HTTP/gRPC endpoints and/or Kafka topics), while controlling dependencies.

**Rule:** keep this *single-service-owned* and *diagnosable*. When it fails, you should know which service broke.

### 3.2 Narrow integration tests (one dependency at a time)


Within a service, use narrow integration tests to validate:

- Postgres integration (migrations, constraints, transaction boundaries).
- Kafka producer/consumer serialization and config.
- Kafka Streams wiring and state handling.
- Filesystem, caches, etc., if applicable.

**Rule:** each test targets the seam between your code and a single external system.

### 3.3 What not to do


Avoid a "subsystem suite" that becomes:

- "start multiple services and exercise a full workflow,"
- "hit shared staging,"
- "depend on timeouts and sleeps."

Those are broad integration/E2E behaviors wearing a different name.

## 4. Acceptance is orthogonal to test level


"Acceptance" describes *what is being proven*, not *how far up the stack the test runs*.

Acceptance criteria can often be validated at:

- unit level (domain invariants and calculations),
- API-level component tests (validation rules, error handling),
- contract tests (producer/consumer compatibility),
- and only minimally at full E2E.

If you treat acceptance as synonymous with E2E, E2E volume tends to explode.

## 5. What must exist before defining tests (the test basis)


You already identified:

- Product specification (FRs, NFRs, constraints)
- High-level design blueprint

Below is the refactored "ready to define tests" basis, designed to prevent vague tests and pyramid inversion.

### 5.1 Product intent with testable acceptance


**FRs**

- workflows, success/failure outcomes, business edge cases

**NFRs**

- latency/throughput targets (p50/p95/p99; steady vs burst)
- availability/SLOs and error budgets
- correctness guarantees (consistency/staleness expectations)
- security/privacy/compliance obligations

**Operational constraints**

- multi-region/DR/failover expectations
- maintenance windows and migration constraints
- platform limits (rate limits, max payload sizes, retention)

**Acceptance criteria**

- scenario-based criteria written in a testable form (Given/When/Then or scenario tables)
- concrete examples (payloads, state transitions, rejection cases)

### 5.2 Domain model and invariants (your "unit-test contract")


- domain entities and state machines
- invariants (must-always-hold statements)
- idempotency and dedup semantics
- error taxonomy: retryable vs non-retryable; compensations vs hard failures
- glossary/ubiquitous language

This is the anchor for low-level tests and prevents the common pattern of encoding domain rules only in E2E checks.

### 5.3 Interface and contract inventory (your "integration/contract-test contract")


For each service, explicitly inventory:

**Synchronous APIs**

- schemas, validation, status codes, pagination, idempotency keys
- versioning/deprecation policy

**Kafka contracts**

- topic names and ownership
- partitioning and key strategy (ordering assumptions must be explicit)
- schema format and evolution rules
- required headers (correlation IDs, timestamps, trace context, etc.)
- retry/DLQ policies and poison-message handling

**Data ownership**

- which service owns which tables/aggregates
- whether read replicas exist and whether they are used for reads

This inventory is what makes contract tests possible and reduces reliance on cross-service E2E.

### 5.4 Critical-path low-level design (the missing layer between HLD and tests)


For critical workflows, document:

- sequence diagrams for key flows
- explicit transaction boundaries ("what must be atomic?")
- concurrency model and race handling (locks, unique constraints, optimistic concurrency, retries)
- backpressure strategy and timeouts

### 5.5 Quality attribute scenarios as "test oracles"


Convert abstract NFRs into measurable scenarios (oracles):

- "Under X load, p95 latency must be < Y"
- "Consumer lag must not exceed Z for more than N minutes"
- "Retry policy must converge; poison messages must go to DLQ within N attempts"
- "Event processing is safe under duplicates and restarts"

This prevents vague tests like "should be reliable" and drives targeted suites (performance, resilience, soak).

### 5.6 Risk register mapped to evidence


For each key risk:

- failure mode
- impact and likelihood
- mitigation (design + test type + monitoring)
- evidence you will accept (unit/contract/component/E2E/resilience)

This is how you justify where you spend test budget.

### 5.7 Deployment, evolution, and reprocessing strategy


Because microservices evolve continuously, you must define:

- rollout strategy (canary/progressive, feature flags, kill switches)
- schema evolution sequencing (producer/consumer compatibility)
- backfill and replay procedures (Kafka reprocessing safety)
- migration roll-forward/rollback plan (expand/contract)

These decisions imply specific tests: replay safety, idempotency, migration compatibility, and rollback checks.

### 5.8 Observability plan aligned to NFRs


Tests are not the only evidence. Define:

- SLIs that correspond to NFRs (latency, error rate, lag, saturation)
- tracing/correlation requirements
- alerting thresholds and runbooks

This reduces the pressure to encode operational correctness into slow, brittle tests.

### 5.9 Testability design decisions


Make testability a design deliverable:

- dependency seams (ports/adapters), injectable clocks/IDs
- hermetic runtime configuration for tests
- deterministic time and randomness policies
- ability to run local/ephemeral Kafka and Postgres
- controlled side effects (e.g., outbox pattern boundaries)

## 6. Designing the test portfolio (how to operationalize the pyramid)

### 6.1 Start from risks and invariants, not from test types


A reliable workflow:

1. List critical scenarios and invariants (domain + NFR oracles).
2. Identify the smallest scope that can falsify each claim.
3. Allocate evidence to the lowest level possible.
4. Add higher-level tests only for:
	- wiring/infra semantics not provable lower down,
	- contract compatibility,
	- a minimal set of E2E journeys.
5. Define runtime budgets and flake budgets per pipeline stage.

### 6.2 The "push down" rule (anti-duplication discipline)


When a high-level test fails:

- if you cannot reproduce the failure with a lower-level test, add the missing lower-level test and reduce reliance on the high-level one.

This keeps the pyramid from slowly inverting over time.

## 7. CI/CD pipeline targets (budgets and quality bars)

### 7.1 Time budgets


Define explicit budgets such as:

- Unit stage: seconds to a few minutes
- Component + narrow integration stage: minutes (parallelized)
- E2E smoke: small and bounded (ideally minutes)
- Nightly: resilience/failover/soak and deeper performance checks

Budgets are governance: without them, scope creeps upward and the pyramid collapses.

### 7.2 Flake budget


Adopt a clear policy:

- flaky test = failing build quality, treat like production incident for developer productivity
- quarantine only as an emergency measure, with explicit follow-up ownership

### 7.3 Determinism rules (common sources of flakes)


- no sleeps where synchronization is possible
- no shared topics/consumer groups; isolate per test run
- deterministic clocks and seeded randomness
- explicit timeouts and bounded retries

## 8. Microservices with Kafka/Streams and Postgres: practical placement


This section summarizes how the above translates in your ecosystem.

### 8.1 Unit tests


- domain invariants, state transitions, calculations
- idempotency logic (dedup keys, command/event handling)
- mapping between domain objects and API/event DTOs

Kafka Streams:

- topology-level deterministic tests (e.g., with a topology test driver)
- keying and partition strategy logic (must be explicitly tested)

### 8.2 Narrow integration tests


Postgres:

- migrations and repository wiring
- constraint behavior (unique, foreign keys)
- transaction boundary correctness
- concurrency cases where unit tests are misleading

Kafka (producer/consumer):

- serialization/deserialization behavior
- required headers and message metadata
- DLQ behavior for invalid messages
- consumer restart and offset handling (as far as practical in a narrow setup)

Kafka Streams:

- SerDe wiring, state store configuration, changelog topics, restore behavior
- restart behavior and safe processing assumptions

### 8.3 Contract tests


- schema compatibility checks for events
- consumer-driven contracts for synchronous APIs
- semantic contracts documented and lightly verified (headers, keying, meanings)

### 8.4 Minimal E2E


- a very small set of end-to-end journeys that validate the "system still works"
- focus on:
	- authentication + authorization + a core business flow
	- one or two "money paths"
- keep them stable; treat ownership and environment carefully

### 8.5 Nightly / pre-release resilience


- multi-node Postgres failover and retry behavior
- Kafka broker restarts/rebalances under load
- replay/backfill procedures and invariants under reprocessing

## 9. Decision rubric for adding or changing a test


For any proposed test, answer:

1. What risk does it mitigate?
2. What is the smallest scope that can detect the failure?
3. How quickly will it fail and how easily can we localize the fault?
4. Is it deterministic? What will cause flakiness?
5. Where does it run (local, PR CI, nightly) and what is its runtime budget?
6. Does it duplicate lower-level coverage? If yes, why is the duplication justified?

## 10. Recommended "ready to define tests" gate


A practical gate before committing to the portfolio:

1. FRs/NFRs/constraints with explicit acceptance criteria for critical flows.
2. Domain invariants and idempotency semantics written down.
3. API + event contracts (including topic ownership, keying, headers, schema evolution rules).
4. Critical-path LLD: transaction boundaries, consistency and concurrency handling.
5. Data model + migration strategy + replay/backfill strategy.
6. Deployment/versioning plan (feature flags, rollouts, evolution sequencing).
7. Observability SLIs mapped to NFRs and incident runbooks outline.
8. Testability hooks agreed (clocks/IDs, seams, hermetic infra).

If you meet this gate, test definition is primarily *mapping evidence to risks*, not debating test types.
