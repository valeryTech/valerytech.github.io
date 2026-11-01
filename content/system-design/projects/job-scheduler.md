---
draft: false
toc: true
title: "Job Scheduler: Requirements Draft"
description: "An early job-scheduler requirements draft covering jobs, schedules, manual execution, status questions, security, availability, and unresolved workload assumptions, with a first design sketch."
linkTitle: "Job Scheduler"
---

Early requirements, open questions, and a first design sketch.

## Core objects and operations


Objects: user, job, and schedule.

A user can upload a job, start it manually, or establish a schedule. The setup flow is upload -> manual execution or schedule creation.

## Questions to clarify


- Can users view execution status and receive notifications or alerts?
- Which access patterns does the interface need?
- What is the job content or execution format?
- Are job definitions and schedules mutable?
- What does the user experience during a long execution?
- Which security and availability requirements matter most?

## Provisional scale notes


The original draft records execution times of hours, `10e5` jobs per customer, and 100 billion jobs per day. Clarify the units and whether these assumptions describe one coherent workload before deriving capacity or architecture from them.

## A design sketch


A first design, to be checked against the answers to the questions above. The mechanisms are explained in [task queues and scheduling]({{< ref "system-design/elements/messaging" >}}#task-queues-and-scheduling).

**Components:**

- **Job store:** jobs and schedules in a relational database, with a `next_run_at` column and an index on it. Executions go in their own table: job, attempt, status, worker, lease expiry, start and end times.
- **Scheduler:** a loop that selects jobs whose `next_run_at` has passed, claims each one, writes an execution row, enqueues it, and computes the next run time.
- **Queue:** carries execution requests to workers and buffers bursts at popular times, such as midnight.
- **Workers:** take an execution, run it, renew its lease while running, and record the result.
- **API and notifications:** upload, schedule, run now, status, and alerts on failure.

**Flow for one scheduled run:**

1. The scheduler finds a due job and claims it with a conditional update, setting an owner and a lease expiry, or with `SELECT ... FOR UPDATE SKIP LOCKED` so several schedulers do not block each other.
2. It writes an execution row and enqueues the execution.
3. A worker takes the execution, marks it running, and renews its lease periodically; executions of hours need renewal.
4. On success, the worker records completion. If the lease expires without completion, a sweeper marks the attempt failed and the execution is retried with backoff, up to a limit.

**Decisions:**

| Decision | Options | Choose by |
| --- | --- | --- |
| Scheduler availability | One active scheduler chosen by [leader election]({{< ref "system-design/elements/data-at-scale" >}}#coordination), or the job table partitioned among several schedulers | Load: one scheduler can claim thousands of jobs per second; partition when the due-job rate exceeds that |
| Duplicate runs | Exactly-once is not available. A run whose completion was not recorded runs again. | Give each execution an idempotency key; use fencing tokens so a worker with an expired lease cannot write its result |
| Missed runs after an outage | Run all missed runs, run only the latest, or skip | The job's meaning: a billing run must not be skipped, a cache refresh needs only the latest |
| Long executions | Lease renewal, checkpoints, and a maximum run time | Execution length and the cost of restarting from the beginning |
| Multi-step jobs | Chained tasks, or a workflow engine such as Temporal | Whether steps need durable state, waits, or compensation |

The provisional scale notes, 100 billion jobs per day, would be about 1.2 million job starts per second on average. That would need a partitioned job store and many schedulers, which is why the units need confirming first.

## Source


[Collected job-scheduler video](https://www.youtube.com/watch?v=Bt6mVg5ivyQ).

## Library sources


- Educative 2023: distributed task scheduler, *Grokking Modern System Design Interview*

Continue with the [case template]({{< ref "system-design/projects/case-template" >}}).
