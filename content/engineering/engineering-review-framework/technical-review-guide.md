---
draft: false
toc: true
description: "Review implementation logic, APIs, state, data, dependencies, security, and operability using project context and relevant technical checklists."
title: "Technical Review Guide"
linkTitle: "Technical Review Guide"
---
## Main technical areas


| Area                                 | Topics to retain                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Logic and local behavior             | Business rules, calculations, conditions, boundaries, units, time handling, and failure paths.                              |
| Functions and modules                | Responsibilities, abstraction consistency, naming, side effects, internal state, and dependency boundaries.                 |
| APIs and contracts                   | Inputs and outputs, validation, schemas, error behavior, supported consumers, and compatibility.                            |
| Data and persistence                 | Data integrity, transactions, schema changes, migrations, retention, and recovery.                                          |
| Concurrency and distributed behavior | Shared state, ordering, races, timeouts, cancellation, retries, idempotency, and partial failure.                           |
| Security and privacy                 | Trust boundaries, authentication, authorization, secrets, sensitive data, and unintended disclosure.                        |
| Performance and resources            | Required latency and throughput, workload assumptions, memory, storage, connections, and other resource limits.             |
| Dependencies and configuration       | Supported versions, available APIs, dependency changes, feature flags, configuration defaults, and environment differences. |
| User-facing behavior                 | Supported workflows, accessibility, usability, localization, and consistency with existing behavior.                        |
| Operations and delivery              | Logging, metrics, tracing, deployment, compatibility during rollout, recovery, and rollback where feasible.                 |

These are reference areas. Select the relevant topics according to the change and the system.

## Abstraction consistency


Keep the meaning of abstraction levels clear: a function should describe its work at a consistent level of detail. Detailed parsing, storage mechanics, or calculations belong behind meaningful operations when their presence obscures the surrounding purpose.

This concern does not prescribe a fixed architectural hierarchy. A useful function groups a clear concept and makes the code easier to follow. The [Software Engineering Principles]({{< ref "engineering/engineering-review-framework/software-engineering-principles" >}}) note contains the shared guidance; there is no need for a second, competing principle list here.

## Review scope


Follow the changed behavior far enough to understand its effects. Relevant context may include callers, consumers, shared types, configuration, existing tests, and data written by earlier versions.

The diff provides a starting point. Google's guidance explicitly recommends considering the surrounding code and the system as a whole.[1] Keep broader inspection tied to the change so that a routine review does not become an unrelated repository audit.

## Using existing technical checklists


Use established language, framework, API, database, and security checklists where they already exist. This guide identifies their place in the review; project guides supply the detailed checks and conventions.

When a topic is absent from those guides, add detail at the narrowest useful location. A database migration convention belongs with database guidance. A general reminder about preserving data belongs in the shared reference list.

## Interpreting findings


Connect a finding to expected behavior, an affected contract, a failure scenario, or a concrete maintenance concern. Distinguish personal preferences from defects and agreed project standards.

Use tests, measurements, or specialist review when a conclusion requires them. Code inspection alone should not be reported as a measured performance result or a completed recovery test. Keep unverified concerns clearly marked while gathering more evidence.

## Related Engineering Topics


- [Transactions]({{< ref "engineering/topics/transactions" >}}) -- atomicity, isolation, and the guarantees needed when reads and writes interact.
- [Consistency]({{< ref "system-design/nfr/consistency" >}}#questions-for-a-design) -- questions about visibility after writes, acceptable staleness, and concurrent updates.
- [Caching]({{< ref "engineering/topics/caching" >}}) -- invalidation, write strategies, and the trade-off between freshness and performance.
- [Deployment]({{< ref "engineering/topics/deployment" >}}#progressive-delivery) -- blue-green deployments, feature flags, canaries, and parallel runs.
