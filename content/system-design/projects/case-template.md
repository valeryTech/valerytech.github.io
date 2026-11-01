---
draft: false
toc: true
title: "System Design Case Template"
description: "A template for recording a design exercise’s context, requirements, entities, interfaces, flows, decisions, failure behavior, and practice reflections."
linkTitle: "Case Template"
---

Copy the sections useful for the exercise. Use any [framework]({{< ref "system-design/frameworks" >}}) to conduct the design; this template records its outcome.

## Context and scope


Users, core outcome, supported operations, exclusions, given constraints, and proposed assumptions.

## Quality requirements


For each important operation: target, measurement, workload, rationale, and what may be relaxed. See [NFR reasoning]({{< ref "system-design/nfr/non-functional-requirements" >}}).

## Entities and interfaces


Core objects, relationships, mutability, access patterns, API or message contracts, and important error behavior.

## Design and flows


Components, state ownership, and a concrete end-to-end trace for each core operation. Record the design diagram beside the explanation.

## Decisions and deep dives


For each difficult choice: requirement, alternatives, selected approach, trade-off, and reason to revisit. Include only the estimates that inform these decisions.

## Failure and recovery


The critical failure or concurrency scenario, what the client observes, and how the design responds.

## Review and next attempt


What worked, what remains uncertain, source comparisons, and one or two specific practice questions. Keep source material distinguishable from your own conclusions.
