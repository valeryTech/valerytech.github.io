---
draft: false
toc: true
title: "Techniques"
linkTitle: "Techniques"
---
Yes. These techniques map well to different **engineering lifecycle goals**. The important point is that they are not interchangeable: each answers a different kind of question.

## Engineering lifecycle techniques by goal


|Phase / Goal|Technique|Main question it answers|Typical output|
|---|---|---|---|
|Understand uncertainty|**Spike**|What do we need to learn before deciding?|Notes, experiment, rough code, recommendation|
|Prove feasibility|**POC**|Can this idea or technology work at all?|Small proof, often disposable|
|Explore user/product behavior|**Prototype**|Does this interaction or product concept make sense?|Mock, clickable flow, demo, partial implementation|
|Validate system structure|**Walking Skeleton**|Can the intended architecture run end-to-end?|Small executable system slice|
|Probe implementation direction|**Tracer Bullet**|Are we aiming in the right technical direction?|Narrow implementation that tests assumptions|
|Deliver first usable value|**MVP**|What is the smallest product version that creates value or validates demand?|Shippable product increment|
|Build incrementally|**Thin Vertical Slice**|Can we deliver one small behavior through the full stack?|Working feature slice|
|Stabilize contracts|**Reference Implementation**|What should correct usage of this interface or architecture look like?|Canonical implementation/example|
|Align decisions|**RFC / Design Doc**|What are we proposing, and why?|Written proposal for review|
|Record decisions|**ADR**|What decision did we make, and what tradeoffs did we accept?|Short decision record|
|Reduce future delivery friction|**Architecture Runway**|What technical foundation is needed for upcoming features?|Minimal enabling infrastructure|
|Validate in real conditions|**Pilot / Beta**|Does this work for real users or real workloads?|Limited rollout with feedback|
|Reduce release risk|**Feature Flag / Canary / Dark Launch**|Can we expose this safely and gradually?|Controlled production rollout|
|Improve production readiness|**Hardening Phase**|What must be fixed before broad release?|Reliability, security, performance, observability improvements|
|Manage accumulated cost|**Refactoring / Tech Debt Paydown**|What structure is slowing us down or increasing risk?|Simplified or improved implementation|

## The rough lifecycle


A common sequence looks like this:

```text
Uncertainty
  -> Spike / POC / Prototype

Architecture validation
  -> Walking Skeleton / Tracer Bullet / Reference Implementation

Incremental delivery
  -> Thin Vertical Slices / MVP / Feature Increments

Production validation
  -> Pilot / Beta / Canary / Feature Flags

Scale and maturity
  -> Hardening / Refactoring / Architecture Runway / Tech Debt Paydown
```

## Key distinctions

### Spike vs POC


A **spike** is for learning.

A **POC** is for proving feasibility.

A spike might answer:

> Which approach should we use?

A POC might answer:

> Can this approach work at all?

Spikes are often broader and more exploratory. POCs are usually more pointed.

### POC vs Prototype


A **POC** tests technical feasibility.

A **prototype** tests product, interaction, or experience feasibility.

Example:

```text
POC:
Can we retrieve relevant passages from these documents with acceptable quality?

Prototype:
Does the document QA user flow make sense to users?
```

### Prototype vs Walking Skeleton


A **prototype** may fake the backend to test experience.

A **walking skeleton** should not fake the main architecture. It exists to prove the real system path.

Example:

```text
Prototype:
Clickable UI where answers are manually mocked.

Walking skeleton:
Real input -> processing -> retrieval -> answer -> output, even if each part is simple.
```

### Walking Skeleton vs Thin Vertical Slice


A **thin vertical slice** is any small feature delivered through the stack.

A **walking skeleton** is usually the first or earliest vertical slice, chosen specifically to validate architecture.

So:

```text
All walking skeletons are thin vertical slices.
Not all thin vertical slices are walking skeletons.
```

### Walking Skeleton vs MVP


A **walking skeleton** validates system structure.

An **MVP** validates product value.

They can overlap, but they are not the same.

Example:

```text
Walking skeleton:
Can the document QA architecture run end-to-end?

MVP:
Can users get enough value from the first version of document QA to justify further investment?
```


The walking skeleton may be `MVP-0`, but the first real MVP usually needs more user-facing completeness.

### Tracer Bullet vs Walking Skeleton


A **tracer bullet** is a narrow implementation used to test whether the team is heading in the right direction.

A **walking skeleton** is a narrow implementation used to establish the executable architecture.

They are close. The difference is emphasis:

```text
Tracer bullet:
Are we aiming correctly?

Walking skeleton:
Can the architecture execute end-to-end?
```


A tracer bullet can be more exploratory. A walking skeleton is usually expected to become the foundation.

## Practical mapping by engineering phase

### 1. Discovery / ambiguity phase


Use:

- Spike
- POC
- Prototype
- RFC

Goal:

> Reduce uncertainty before committing to a direction.

Best when the team does not yet know whether the idea, technology, product flow, or architecture is viable.

### 2. Architecture formation phase


Use:

- Walking Skeleton
- Tracer Bullet
- Reference Implementation
- ADR

Goal:

> Establish the first working system shape.

Best when the team knows roughly what to build, but needs to validate the structure, interfaces, and integration path.

### 3. Product increment phase


Use:

- Thin Vertical Slice
- MVP
- Feature Flag
- Iterative Delivery

Goal:

> Deliver usable capability in small increments.

Best when the team is moving from structure validation into user-facing value.

### 4. Production validation phase


Use:

- Pilot
- Beta
- Canary Release
- Dark Launch
- Dogfooding

Goal:

> Validate behavior under real-world conditions while controlling risk.

Best when the system works internally but needs exposure to real users, data, traffic, or operational conditions.

### 5. Maturity / scaling phase


Use:

- Hardening
- Refactoring
- Architecture Runway
- Tech Debt Paydown
- Migration Plan

Goal:

> Improve reliability, maintainability, scale, and delivery speed.

Best when the system is valuable but accumulating operational or structural limits.

## A useful decision rule


Choose the technique based on the risk you are trying to reduce:

|Risk|Use|
|---|---|
|"We do not know enough yet"|Spike|
|"We do not know if this is technically possible"|POC|
|"We do not know if users understand or want this"|Prototype|
|"We do not know if the architecture works end-to-end"|Walking Skeleton|
|"We do not know if this technical direction is right"|Tracer Bullet|
|"We need to deliver the smallest useful product"|MVP|
|"We need to deliver safely"|Feature Flag / Canary|
|"We need to make the system safer to operate"|Hardening|
|"We need to make future work easier"|Refactoring / Architecture Runway|
