---
draft: false
toc: true
title: "Test Strategy Foundations Adoption V2"
linkTitle: "Test Strategy Foundations Adoption V2"
---
# RFC: Adoption of the Test Strategy Playbook (v3) Framework


- **Status**: Draft
- **Authors**: (fill)
- **Reviewers**: Tech Leads (all teams), QA/Quality Engineering, Platform/DevEx, SRE/Operations
- **Target org**: 5-6 product/service teams
- **Last updated**: 2026-01-10

## Decision summary


Adopt the "Test Strategy Playbook v3: Practical Pyramid, Clear Mental Models, and Operational Governance" as the organization-wide framework for building and operating our automated test portfolio, CI/CD gates, and quality governance.

This RFC defines the operating model, required artifacts, CI gate structure, ownership rules, metrics, and a phased rollout plan to implement the framework across 5-6 teams while keeping feedback fast, tests deterministic, and failures diagnosable.

## Context and problem


As our system and teams scale, the default failure mode is "suite drift": tests move upward in scope (more real dependencies, more network boundaries), become slower and flakier, and failures become harder to localize.

The playbook frames this with the Cost-Fidelity-Debuggability trade-off: as scope increases, fidelity tends to increase, but cost and flakiness risk rise and debug locality worsens -- so broad, high-fidelity suites must be explicitly curated.

The framework also emphasizes that acceptance criteria describe *what* we prove, not *where* the test runs; acceptance evidence can (and often should) be provided at lower layers rather than defaulting to end-to-end automation.

### Goals


- Achieve "fast, repeatable, diagnosable evidence" for correctness and safety-to-change as a **system**, not as an ad-hoc set of tests.
- Use testing to create **design pressure toward explicit boundaries and modularity** (hard-to-test code is treated as a design signal: hidden coupling, unclear responsibilities, missing seams).
- Enforce a practical test pyramid via governance (budgets, definitions, placement rules), not aspirational guidelines.
- Reduce multi-team friction by making interface/contract evidence explicit and owned.
- Keep PR feedback within hard time budgets by pushing evidence to the lowest feasible scope and keeping E2E curated.
- Treat flakiness as a quality defect with explicit quarantine rules and remediation deadlines.

### Non-goals


- Replace observability, canaries, feature flags, or incident response with tests (tests complement these controls).
- Define a single universal "percentage split" across unit/integration/E2E; the playbook treats the pyramid as a trade-off model rather than fixed allocation.
- Mandate a single testing tool/stack for all teams (this RFC defines capabilities and interfaces; tooling choices can vary if they meet the requirements).

## Proposed framework

### Guiding principles (non-negotiables)


The adoption will enforce the playbook's non-negotiable invariants:

- **Fast feedback dominates**: most regressions should be caught before merge within strict time budgets.
- **Localizability dominates**: failures should localize quickly to one team-owned component and one seam, with actionable artifacts.
- **E2E is curated**: E2E is a small set of "money paths" and critical workflows, not comprehensive coverage.
- **Push-down rule**: if a higher-scope test finds a defect that could be detected lower, add the lower-level test/contract evidence and reduce reliance on the higher-scope check.
- **Determinism and flake control are enforced**: flaky tests are defects; quarantine is time-boxed with an owner and remediation deadline.
- **Hermetic by default**: PR gates should not depend on shared, drifting environments by default.

### Explicitly prohibited patterns (enforced)


To prevent suite bloat and flakiness, we will explicitly prohibit the following patterns in PR gates:

- **Sleep-based synchronization** as the primary coordination mechanism (use explicit signals or bounded polling with clear conditions).
- **Shared staging environments as the default** for PR validation (PR gates must be hermetic by default).
- **"Subsystem" tests that cross service/network boundaries** (multi-service workflows are E2E by definition and must remain curated).
- **Encoding acceptance primarily via E2E/UI automation** (acceptance evidence should be pushed to the lowest feasible scope).
- **In-memory substitutes where real infrastructure semantics matter** (e.g., relying on non-Postgres DBs to validate Postgres transaction/isolation behavior).

Each prohibited pattern should be replaced with a lower-scope alternative (unit, seam, contract, or single-service component tests) that is deterministic and diagnosable.

### Common test taxonomy and definitions


We will standardize the vocabulary to prevent teams from labeling multi-service tests as "subsystem" or "integration" in inconsistent ways.

- **Unit test**: single module/function/class; dependencies replaced with test doubles; fast and highly diagnosable.
- **Seam test (narrow infra integration)**: exactly one real external dependency, exercised via the **real client library** and **production-equivalent client configuration** (serialization, timeouts, retries/backoff, auth/TLS where applicable). A seam test must validate the seam that unit tests cannot falsify: wiring, configuration, and dependency semantics.
	- Mocking the network is not sufficient; the test must validate the **actual client configuration** against the real dependency image.
- **Narrow integration / single-service black-box**: one service exercised via public interfaces (HTTP/gRPC and/or Kafka) with hermetic service-owned infra and controlled stubs for external services.
- **Component/service tests**: single-service black-box checks focused on boundary behavior and compatibility evidence (CDC for HTTP/gRPC, schema compatibility for events, semantic contracts like headers/keying/ordering/idempotency keys).
- **Contract tests**: provider-consumer compatibility checks that prevent drift; may include CDC and schema evolution checks and semantic contract checks.
- **End-to-end (E2E)**: curated multi-service workflows with real network boundaries, kept minimal; primarily a smoke alarm for critical journeys.
- **Resilience/HA tests**: failure-mode validation (failover, broker restarts, replay/backfill safety), typically nightly or pre-release.

### Required "test basis" artifacts


The playbook's central assertion is that test strategies fail when they don't connect requirements/risks to suites to pipeline gates to ownership; the test basis and evidence mapping provide that connection.

Each service (or major feature) must maintain a lightweight **Test Basis** document containing:

- Product intent + acceptance criteria (Given/When/Then with payload examples and rejection cases).
- Domain invariants, idempotency and deduplication semantics, and error taxonomy (retryable vs non-retryable, compensations, hard failures).
- Interface and contract inventory (HTTP/gRPC schemas, Kafka topics/ownership, keying/ordering assumptions, schema evolution rules, required headers, retry/DLQ policies), plus explicit data access constraints (ownership, and whether **read replicas** exist and are used for reads).
- Critical-path design details: transaction boundaries, concurrency strategy, backpressure and timeout policy.
- Quality attribute scenarios (NFRs -> measurable scenarios and thresholds), explicitly covering **steady-state and burst** load shapes (e.g., latency p95 under load, consumer lag bounds, DLQ behavior).
- Deployment/evolution plan (expand/contract sequencing, rollback/roll-forward plan, replay/backfill procedures).
- Observability plan aligned to NFRs (SLIs, dashboards, alerts, runbooks outline).
- Testability design decisions (injectable clocks/IDs, hermetic CI approach, deterministic randomness, bounded retries).

### Evidence mapping (traceability)


We will use the playbook's evidence map template as the canonical traceability artifact connecting risks/requirements to evidence, suites, CI gates, thresholds, and owners.

Minimum fields (per the playbook): **Item, Requirement/Risk, Failure mode, Evidence type, Suite, Gate, Metric/Threshold, Owner, Notes**.

**Policy**: No feature/service may declare "done" without mapping each acceptance criterion and major risk to at least one evidence item, or documenting an explicit exception (see Release gating & exceptions).

### CI/CD gates, budgets, and enforcement


We will implement a staged CI structure consistent with the playbook's suggested approach (separate, enforceable stages with explicit runtime targets).

**Stages** (names can be adjusted; intent is fixed):

1. **Unit Gate (PR)**: unit tests + static checks; target seconds to a few minutes.
2. **Seam Gate (PR)**: narrow infra integration focusing on Postgres/Kafka semantics and wiring; target ~5-10 minutes wall-clock, parallelized.
3. **Service-owned Gate (PR or mainline)**: component/service black-box tests + key contract checks; target ~10-20 minutes wall-clock, parallelized.
4. **Main Gate (mainline)**: broader regressions and cross-boundary compatibility where justified; target ~30-60 minutes (org choice).
5. **Nightly/Pre-release**: resilience/HA, heavy E2E smoke if required, performance baselines; stable and actionable rather than strictly time-bounded.

**Enforcement mechanism**

- Budgets are governance: suites that exceed their gate's runtime or flake budget must be reduced in scope, moved to a later gate, or redesigned.
- PR gates must be hermetic by default (ephemeral infra, isolated resources), not dependent on shared staging.

### Change Impact Matrix (standard review checklist)


To reduce debate and ensure consistent enforcement, we will adopt a **Change Impact Matrix** as a reviewer-facing checklist.

**How it is used**

- For any PR that materially changes one of the "change types" below, the PR description must explicitly state which evidence items are provided (or why an exception is requested).
- Code reviewers use this matrix to confirm sufficient evidence for the change type *before* approving.

| Change type | Minimum required evidence (examples) | Gate (typical) |
|---|---|---|
| **DB schema migration / constraint change** | Migration test (including representative/non-empty data when relevant); backward-compatible sequencing (expand/contract if needed); rollback/roll-forward plan; narrow DB seam tests covering new constraints/index assumptions | Seam + Main |
| **DB transaction / isolation / concurrency logic change** | Narrow DB seam tests that exercise contention/race cases; explicit timeout/retry behavior; deadlock handling strategy (if applicable) | Seam |
| **Kafka event schema evolution** | Schema compatibility check (backward/forward as policy); consumer behavior validated for old/new versions as applicable; semantic contract checks (required headers, keying) | Seam + Service/Main |
| **Kafka producer/consumer configuration change** (timeouts, acks, retries, compression, batching) | Seam tests using the **real client config** validating behavior against a real broker; verify serialization and header conventions | Seam |
| **Retry/DLQ policy change** | Poison message scenario tests: retries converge; DLQ routing occurs within N attempts; metrics/alerts updated as needed | Seam + Main |
| **Kafka Streams topology/state change** | Deterministic topology-level tests; seam tests for SerDe/state store/changelog wiring; restart/restore behavior validation (nightly if heavy) | Unit + Seam (+ Nightly) |
| **Read replica routing / consistency change** | Explicit documentation of staleness expectations; tests or monitors validating lag/staleness bounds; failover behavior clarified if applicable | Main + Nightly |
| **Security/authZ logic change** | Unit tests for policy rules + component tests at boundary; negative tests for forbidden access; logging/audit expectations validated | Unit + Service/Main |
| **New external dependency** | Seam tests against the dependency image; explicit client config and timeout/retry policy validated; failure mode and fallback behavior covered | Seam |
This matrix is intentionally minimal; teams may add service-specific entries, but the baseline is organization-wide.

### Determinism rules (CI quality bar)


We will adopt the playbook's determinism constraints:

- Avoid sleep-based synchronization when explicit signals exist.
- Isolate resources per run (unique Kafka topics, consumer group IDs, Kafka Streams application.id; isolated Postgres schemas/databases).
- Use deterministic clocks/IDs and explicit timeouts for IO.
- Use bounded retries with well-defined backoff.

### Flake policy


We will enforce the playbook's flake policy:

- Goal: near-zero flakes in Unit/Seam/Service-owned gates.
- A flaky test is a defect.
- Quarantine is allowed only as a time-boxed exception with an owner and a remediation deadline; repeated flakes trigger suite redesign (often scope narrowing).

### Ownership model


We will adopt the playbook's ownership guidance:

- Unit, seam, and component/service tests are owned by the service team.
- Contracts are shared ownership with a clear primary provider or platform owner.
- E2E is owned by a release/platform team or shared ownership with strict change control.

## Implementation plan

### Phase 0: Alignment (1-2 weeks)


Deliverables:

- Ratify the shared taxonomy and "non-negotiable invariants" as engineering policy.
- Define CI gate names, budgets, and success criteria for our org.
- Decide the minimal "golden path" harness for ephemeral Postgres + Kafka in CI (libraries, containers, secrets, resource isolation, artifact capture).

### Phase 1: Foundations (2-4 weeks)


Deliverables per team:

- Create Test Basis doc for top 1-2 critical services and top 1-2 critical user journeys (money paths).
- Create first Evidence Map for those services/journeys using the required fields.
- Implement Unit + Seam gates in PR for those services with hermetic infra and determinism rules.

### Phase 2: Contracts and boundaries (4-8 weeks)


Deliverables:

- Build/standardize contract inventory (HTTP/gRPC + Kafka topic inventory) as a maintained artifact.
- Add contract checks (schema compatibility and semantic contract checks) to Service-owned/Main gates as appropriate.
- Establish cross-team contract-change workflow (versioning rules, evolution sequencing, ownership escalation).

### Phase 3: Curated E2E and resilience (8-12+ weeks)


Deliverables:

- Define and implement a minimal E2E smoke suite for a small set of critical cross-service journeys; keep it minimal by policy.
- Add nightly/pre-release resilience suites for failover/restarts/replay/backfill scenarios where risk justifies it.
- Implement "push-down" backlog: every E2E-discovered defect is assessed for lower-scope detection feasibility and actioned.

## Tooling, infrastructure, and engineering standards

### Ephemeral environment requirements


Because we can spin up needed infrastructure components, PR gates should use hermetic ephemeral Postgres and Kafka rather than shared staging.

Minimum requirements:

- One-command local + CI parity (same containers/images where possible).
- Per-run isolation (schemas/databases, Kafka topics/groups/Streams app IDs).
- Artifact capture on failure: logs, traces (if available), message dumps, DB snapshots/queries, and clear test IDs to support fast localization.

### Contract tooling requirements


- Kafka: schema compatibility checks (and policy) plus semantic checks (headers, keying, ordering assumptions, retry/DLQ).
- HTTP/gRPC: CDC or equivalent provider/consumer compatibility evidence, plus semantic contracts for error mapping and validation.

## Metrics and reporting


We will track metrics that correspond to the framework's goals (speed, determinism, diagnosability, and portfolio health).

Core metrics:

- PR gate wall-clock time p50/p95 by service and by gate.
- Flake rate by suite/gate; quarantine count; mean time to remediate quarantined tests.
- Failure localizability: % failures automatically attributed to a single service/seam with sufficient artifacts for triage.
- Push-down effectiveness: count of defects discovered at higher scope that get new lower-scope evidence items.
- Evidence coverage: % of acceptance criteria and major risks mapped to evidence items with owners and gates.

## Release gating and exceptions


When test basis or evidence is missing, the playbook recommends choosing an explicit policy such as: block release; allow behind a feature flag to staged users; allow with increased monitoring and rollback plan; or allow only after manual review by designated owners.

We will standardize an exception template:

- What evidence is missing and why.
- Risk assessment (impact/likelihood) and mitigation (flag/canary/monitoring/rollback).
- Expiration date (must be time-boxed).
- Owner(s) and follow-up evidence plan.

## Risks and mitigations


- **Risk: E2E suite bloat** (teams encode business rules at the top scope).
	- Mitigation: enforce "acceptance is orthogonal to test level" and the push-down rule; keep E2E minimal by policy.
- **Risk: Disguised multi-service integration** (labeled as "subsystem").
	- Mitigation: enforce definitions and ban the anti-pattern; require explicit scope declarations per suite.
- **Risk: Flaky PR gates**.
	- Mitigation: determinism rules, isolation, flake-as-defect policy, time-boxed quarantine with owner.
- **Risk: Interface drift across teams**.
	- Mitigation: contract inventory + compatibility checks + clear ownership model for contracts.

## Open questions


- What is the initial PR budget target (p95) we will enforce for Unit + Seam + Service-owned gates combined?
- Which team owns the shared harness (ephemeral Kafka/Postgres, artifact capture, contract tooling): Platform/DevEx or a rotating guild?
- What are the first 2-3 "money paths" to enshrine as curated E2E smoke checks?

## Appendix A: Evidence map template


| Item | Requirement/Risk | Failure mode | Evidence type | Suite | Gate | Metric/Threshold | Owner | Notes |
|---|---|---|---|---|---|---|---|---|
| A1 |  |  | Unit invariant tests |  | Unit | 100% pass | Team X |  |
(Fields and examples follow the playbook's evidence mapping approach.)

## Appendix B: Test Basis checklist


Use this as a definition-of-ready for "ready to define tests".

- Acceptance criteria for critical flows exist and are testable.
- Domain invariants and idempotency semantics documented.
- API/event contracts inventoried with evolution rules.
- Critical-path design includes transaction boundaries and concurrency strategy.
- Migration strategy and replay/backfill plan exist.
- Deployment strategy includes evolution sequencing and rollback.
- Observability SLIs mapped to NFRs and runbooks drafted.
- Testability hooks and hermetic CI approach agreed.

## Appendix C: Kafka contract inventory (minimal fields)


The playbook provides a Kafka contract inventory template; we will require at least: topic name, owner, keying strategy, ordering assumptions, schema/compatibility policy, required headers, retry/DLQ behavior, backfill/replay policy, consumers of record.
