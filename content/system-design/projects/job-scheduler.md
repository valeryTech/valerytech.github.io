---
draft: false
toc: true
title: "Job Scheduler: Requirements Draft"
description: "An early job-scheduler requirements draft covering jobs, schedules, manual execution, status questions, security, availability, and unresolved workload assumptions."
linkTitle: "Job Scheduler"
---
# Job Scheduler


Early requirements and open questions; a complete design has not yet been recorded.

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

## Source


[Collected job-scheduler video](https://www.youtube.com/watch?v=Bt6mVg5ivyQ).

Continue with the [case template]({{< ref "system-design/projects/case-template" >}}).
