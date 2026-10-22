---
draft: false
toc: true
description: "Define an architectural walking skeleton, its acceptance criteria and lifespan, with document-QA examples and alternative formulations of the first delivery slice."
title: "Delivery Skeleton 1 In"
linkTitle: "Walking Skeleton: Definition and Examples"
---
# Delivery Technique: Architectural Walking Skeleton

## Overview


An **architectural walking skeleton** is the smallest runnable version of a system that connects its main architectural parts from input to output.

It supports only a small part of the product, but uses the real architecture.

The goal is to build and test the system's main structure early, before delivering a full set of features. This includes component boundaries, integration points, data contracts, assumptions about how the system will operate, and the main execution path.

A walking skeleton should normally be extended, not thrown away.

## Core Idea


When using this technique, the team should not ask:

> What is the smallest shippable feature?

Instead, the team should ask:

> What is the smallest real workflow that requires the system's major architectural parts to work together?

The answer becomes the walking skeleton.

The result should be a thin vertical slice through the system. It should pass through every important architectural layer, with just enough behavior to run the full path.

## Principle


The guiding principle is:

> Narrow in capability, real in architecture.

This means the implementation may support only one workflow, one input type, one user path, or one constrained use case, but the shape of the system should resemble the intended future architecture.

The system should not be a disconnected demo, mock, or throwaway experiment. It should use real component boundaries, real interfaces, real data flow, and real integration points wherever practical.

## When to Use This Technique


Use an architectural walking skeleton when:

- The system has multiple components that must work together.
- Integration risk is higher than individual feature risk.
- The team needs early proof that the full path can work.
- Future work depends on stable contracts between components.
- The product scope is still narrow, but the technical foundation matters.
- The team wants to avoid building isolated horizontal layers that do not integrate until late.

This technique is especially useful for systems involving service boundaries, pipelines, data processing, retrieval, orchestration, external dependencies, deployment concerns, or complex end-to-end behavior.

## What This Technique Produces


An architectural walking skeleton produces a runnable system slice that proves:

1. The main components can communicate.
2. The core data flow is viable.
3. The system can execute at least one meaningful workflow end-to-end.
4. The team understands the required contracts between components.
5. Architectural risks are exposed early.
6. Future work can extend the slice without replacing its core structure.

The output does not need every feature. Its structure must be realistic enough to test the intended architecture.

## What This Is Not


An architectural walking skeleton is not:

- A throwaway prototype
- A design spike
- A UI-only demo
- A mock service
- A horizontal infrastructure layer
- A partial backend with no executable user flow
- A collection of disconnected modules
- A complete implementation of any one layer

A spike is used to learn something and may be discarded.

A prototype is used to explore feasibility, interaction, or experience and may be discarded.

A walking skeleton is used to establish the system spine and should normally become the foundation for future implementation.

## Delivery Rule


For each major architectural concern, build the simplest real implementation that lets the full path run.

Prefer:

- Simple but real contracts
- Minimal but executable integrations
- Basic but inspectable data models
- Narrow but testable workflows
- Replaceable implementations behind stable interfaces
- End-to-end behavior over isolated completeness

Avoid:

- Fake integrations that hide real system risk
- Overbuilding any one layer
- Premature generalization
- Demo-only shortcuts
- Building infrastructure with no end-to-end behavior
- Treating the slice as disposable unless explicitly intended

## Implementation Guidance


A walking skeleton should include enough implementation to validate the architecture, but no more than necessary.

The team should identify the future system's main architectural parts and connect them through the smallest meaningful workflow.

For example, instead of fully building one subsystem before starting another, the team should create a minimal path across all critical subsystems.

Later work should be able to replace simple internal implementations without changing the overall system structure.

A simple component may be acceptable.

A fake boundary usually is not.

## Good Signs


A walking skeleton is working well when:

- A developer can run the system end-to-end.
- The system exercises the real architectural path.
- Each major component has a clear role.
- Interfaces between components are visible and testable.
- The team learns about integration risks early.
- Future features have an obvious place to attach.
- The implementation is small, but represents the intended structure.

## Bad Signs


The technique is being misapplied when:

- One layer is highly developed while others do not exist.
- Components are implemented but not connected.
- The system only works through mocks.
- The demo path bypasses the intended architecture.
- The team cannot explain how future work extends the slice.
- The implementation must be discarded before the next milestone.
- The slice proves that individual parts work, but not that the full path can work.

## Acceptance Criteria


An architectural walking skeleton is complete when:

1. One meaningful workflow can be executed from start to finish.
2. The workflow passes through the main architectural components.
3. The interfaces between components are explicit.
4. The data passed between components is inspectable.
5. The implementation can be run by the team.
6. The slice can be tested end-to-end.
7. The team has identified the next layers of functionality to add.
8. The architecture can be extended without replacing the skeleton.

## Relationship to Other Techniques

### Spike


A spike is primarily for learning. It may be rough, isolated, or disposable.

A walking skeleton is also a learning tool, but it is intended to establish the real system structure.

### Prototype


A prototype explores feasibility, user experience, or product direction.

A walking skeleton validates executable architecture.

### Thin Vertical Slice


A thin vertical slice is a narrow implementation across the stack.

A walking skeleton is a thin vertical slice used specifically to test the main architecture.

### Foundation Layer


A foundation layer is horizontal. It may provide infrastructure, utilities, or shared capabilities.

A walking skeleton is vertical. It connects the layers through a working path.

## Summary


An architectural walking skeleton builds the smallest runnable version of a system that follows the real architecture from input to output.

It is narrow in functionality but real in structure.

Its purpose is to validate integration points, component boundaries, data contracts, and operational assumptions before the team spends time building a broader set of features.

The slice should be suitable for further work, rather than something to throw away.

## Terminology and document-QA example


The name of a thin runnable slice can reflect its purpose.

Engineers would usually name this one of these, depending on emphasis:

|Name engineers use|Meaning|Fit for an architectural baseline|
|---|---|---|
|**Walking Skeleton**|Smallest executable end-to-end system that connects the main architectural parts|**Best fit**|
|**Thin Vertical Slice**|A narrow slice through the full stack/product flow|Also very good|
|**End-to-End Slice**|More plain/common wording for the same idea|Good for README language|
|**Architecture Skeleton**|Emphasizes structure more than product behavior|Acceptable, but less common|
|**Foundation Slice**|Says "basis for future work"|Understandable, but less standard|
|**Tracer Bullet**|Small implementation used to validate direction/assumptions|Good if the main goal is discovery, not foundation|

Possible titles for a Markdown-only document-QA baseline include:

```md
# MVP-0: Markdown-Only Walking Skeleton
```


or:

```md
# MVP-0: Thin Vertical Slice for Document QA
```


The most engineer-native formulation is probably:

> `mvp-0` is the **walking skeleton** of DocForge: a Markdown-only, end-to-end slice that exercises the future QA service flow before adding PDFs, richer provenance, and broader answer behavior.

Why **walking skeleton**: Fowler's site uses it for "a very coarse integration" that defines the problem boundaries and uses as much real infrastructure as possible. ([martinfowler.com](https://martinfowler.com/articles/dependency-composition.html "Dependency Composition")) Another common definition is "the thinnest possible slice of real functionality" that can be built, deployed, and tested end-to-end. ([Def My Func](https://www.defmyfunc.com/2019_10_18_walking_skeleton/ "Integration, integration, integration. An introduction to walking skeletons in the enterprise | @defmyfunc blog"))

**Base level** and **base layer** suggest horizontal infrastructure. A document-QA slice cuts through the system vertically: input -> processing -> retrieval -> answer -> citations/abstention. So **walking skeleton** or **thin vertical slice** is much more precise.

An architectural baseline has **two distinct engineering goals**:

1. **Walking goal**
    Let a user/developer "walk through" the system end-to-end and experience the intended flow.
2. **Probing / architecture goal**
    Establish and validate the core architectural building blocks: boundaries, contracts, data model, retrieval path, answer-generation path, provenance, abstention behavior, etc.

For these two goals, **"walking skeleton" alone is slightly too narrow**. It describes running the flow end-to-end, but does not fully express the goal of testing the architecture. Adding **architectural** makes that second purpose clear.

More precise engineering names for this combined purpose are:

```md
# MVP-0: Architectural Walking Skeleton
```


or:

```md
# MVP-0: Foundation Architecture Slice
```


The preferred title for this example is:

```md
# MVP-0: Architectural Walking Skeleton
```


Why: it is still recognizable to engineers as a **walking skeleton**, but the word **architectural** makes clear that its purpose is not only user-visible end-to-end behavior. It also establishes the system's structural spine.

The definition can state both goals clearly:

```md
MVP-0 is an architectural walking skeleton: a minimal, executable slice of the system that lets users and developers walk the core QA flow end-to-end while also validating the foundational architecture, component boundaries, and evidence/answering contracts.
```


Alternative names by nuance:

|Name|Primary emphasis|
|---|---|
|**Architectural Walking Skeleton**|Both end-to-end execution and architecture validation|
|**Foundation Architecture Slice**|Foundational building blocks more than user flow|
|**Thin Architecture Slice**|Small implementation across architectural layers|
|**Executable Architecture Baseline**|A first runnable baseline for future work|
|**Reference Implementation Slice**|A concrete implementation that demonstrates intended contracts|
|**Tracer Bullet Architecture Slice**|Learning/probing unknowns is the main purpose|

A document-QA baseline can use this structure:

```md
# MVP-0: Architectural Walking Skeleton

MVP-0 establishes the first executable architecture for DocForge. It has two goals:

1. Provide a minimal end-to-end path that users and developers can walk.
2. Validate the foundational components, boundaries, and contracts needed for the full document QA service.

It is intentionally narrower than the full MVP, but it is not throwaway. Future capabilities build on this slice.
```


The key distinction:

**Spike** sounds exploratory and possibly disposable.

**Walking skeleton** sounds executable but may understate architecture work.

**Architectural walking skeleton** says both: runnable slice + architectural foundation.
