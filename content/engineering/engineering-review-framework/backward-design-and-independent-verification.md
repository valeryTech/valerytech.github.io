---
draft: false
toc: true
description: "Work backward from product outcomes to required behavior, then independently design verification around consequential failures and observable results."
title: "Backward Design And Independent Verification"
linkTitle: "Backward Design and Independent Verification"
---

Two complementary approaches can support the Engineering Review Framework. **Backward design** establishes why behavior and responsibilities are needed. **Independent verification** challenges whether the solution provides that behavior, including under relevant failure conditions. Either can be used by a human reviewer or supported by agents and skills.

## 1. Work backward from product framing


Start with the intended user, situation, outcome, scope, and constraints. From the successful outcome and important workflow transitions, ask: **What must be true for this to happen correctly?** Then identify which behavior the system must provide, what belongs outside its boundary, and how the proposed design supplies that behavior.

The reasoning is:

**Product framing -> intended outcome and workflow -> necessary conditions -> system responsibilities -> design.**

Keep conditions in domain language before choosing components or technologies. Several conditions may need one responsibility, and one condition may support several workflow steps. A condition is justified by its necessity, rather than by a desire to give every step a matching artifact.

During review, follow this reasoning backward to question unnecessary elements and forward to find missing behavior: can the proposed system actually carry the user from the trigger to the intended outcome? Include existing contracts and operating constraints in that judgment.

## 2. Design verification independently


Derive expected behavior and important reliability properties from the product requirements and supported contracts before allowing the proposed implementation to define the answers. A separate person or agent can do this with scoped context.

The reasoning is:

**Required properties -> consequential failure scenarios -> test intents and expected observations -> executable checks.**

A test intent describes the situation, action, expected result, and plausible wrong behavior it would expose. Examine relevant angles such as boundary inputs, prior state, repeated requests, concurrency, dependency failure, interruption, recovery, and compatibility. Select scenarios by consequence and relevance; exhaustive combinations are unnecessary.

First decide what must be observed. Then use repository knowledge to make the checks executable at suitable interfaces. Test authors may need public contracts, test infrastructure, and real dependency behavior while remaining independent of the implementer's proposed solution and reasoning.

Reliability belongs here as behavior to establish: what must survive, what may be retried, what happens after partial failure, and how recovery becomes observable. Tests can reveal weaknesses; the implementation still needs the mechanisms that provide those guarantees.

Run the checks and inspect their assertions and results. Independently authored tests should not be weakened merely to make implementation pass; a mistaken expectation should be corrected against the requirement. Additional challenge cases can exercise known requirements after initial implementation.

## What these approaches address


- A coherent implementation can still solve the wrong problem or omit a required responsibility.
- Tests written from implementation details can repeat the same mistaken assumption.
- Happy-path tests can miss the failures with the greatest consequences.
- Passing visible examples can hide incorrect behavior in another state, ordering, or recovery path.

## Limitations to retain


- **A mistaken frame propagates.** Both design and tests can agree with an incomplete or incorrect requirement. Confirm consequential assumptions with the appropriate sources.
- **A plausible derivation can be wrong.** Check that prerequisites are necessary and that the workflow can actually execute. A linked diagram alone establishes neither.
- **Fresh context is only one kind of separation.** Different agents can share the same assumptions; separate processes do not automatically produce independent evidence.
- **Isolation can remove needed facts.** Unrealistic mocks, missing consumers, or misunderstood transaction and network behavior can invalidate a test. Bring in the system facts needed by each check.
- **Passing checks have a scope.** Tested scenarios support specific conclusions. Production reliability may also need realistic load, recovery exercises, and operational observations.

Use these approaches where they help resolve a review question. They do not require a full design pipeline, a separate agent for every angle, or a written artifact at every step.

## Investigation and sources


The local `agent-harness` investigation combines both approaches. Its product concepts describe backward behavioral derivation and the split between implementation and correctness. The original verification-engineering investigation develops failure dimensions and test intents; the dual-track follow-up describes independent verification design and test authorship.

The current architecture documents fresh worker processes, behavioral inputs for test authors, blind challenge design, and protection of independent tests. These are implemented mechanisms within an unfinished investigation; they do not establish how effective the overall approach is across projects. Sources inspected on 2026-10-21.

For broader background, see [Backward Design Derivation]({{< ref "engineering/progressive/backward-design-der" >}}). For framework application, see [Requirements and Quality Targets]({{< ref "engineering/engineering-review-framework/requirements-and-quality-targets" >}}), [Testing, CI, and PR Review]({{< ref "engineering/engineering-review-framework/testing-ci-and-pr-review-guide" >}}), and [Review Agents, Skills, and Tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}}).
