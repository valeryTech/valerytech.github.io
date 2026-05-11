---
draft: false
toc: true
title: "Delivery Skeleton 2 In"
linkTitle: "Delivery Skeleton 2 In"
---
# Delivery Technique: Architectural Walking Skeleton

## Definition


An architectural walking skeleton is a delivery technique where the team builds a small executable version of the system that runs through the main architectural components.

It implements one narrow workflow from input to output.

The purpose is to verify that the main parts of the system can work together before investing in broader functionality.

The implementation should be small, but it should follow the intended system structure. Later work should extend it rather than replace it.

## Goal


The goal is to answer these questions early:

- Can the main components be connected?
- Are the boundaries between components clear?
- Is the data passed between components in the right shape?
- Can the workflow be run and tested end-to-end?
- Are the main integration risks visible?
- Can the next increment build on this implementation?

The goal is not to complete any one subsystem.

## How to Choose the Workflow


Choose one workflow that is narrow but representative.

The workflow should:

- start from a real input
- pass through the main components
- produce a real output
- use the intended interfaces between components
- expose the main data contracts
- include at least one meaningful integration point
- be runnable by a developer
- be testable end-to-end

Avoid choosing a workflow that is easy only because it bypasses the intended architecture.

## Implementation Rule


For each major component, build the simplest implementation needed to make the workflow run.

Do not build a complete version of one layer while leaving the rest of the system disconnected.

Prefer a simple implementation behind the intended interface.

Avoid shortcuts that change the shape of the system.

For example:

- A basic storage implementation is acceptable if it sits behind the intended storage interface.
- A simple retrieval implementation is acceptable if retrieval remains a separate component.
- A minimal API is acceptable if it uses the intended request and response shape.
- Basic logging is acceptable if it makes the workflow inspectable.

## What Should Be Included


The walking skeleton should include:

- one named workflow
- the main components needed by that workflow
- explicit interfaces between those components
- the data structures passed between components
- a way to run the workflow locally
- basic logging or debug output
- at least one end-to-end test
- basic handling for one or more expected failure cases

## What Can Be Simplified


The following can be simple or incomplete:

- algorithms
- user interface
- performance
- scale
- configuration
- edge-case handling
- security controls
- advanced error recovery
- production infrastructure
- full test coverage

These areas can be improved later if the initial implementation preserves the right component boundaries.

## Minimal vs. Fake


A minimal implementation is acceptable.

A fake implementation is a problem.

A minimal implementation keeps the intended system structure but reduces the amount of behavior.

A fake implementation bypasses the intended structure and gives the team false confidence.

Examples:

| Minimal | Fake |
|---|---|
| Simple implementation behind the intended interface | Hard-coded behavior with no interface |
| One workflow through the intended components | Demo path that skips major components |
| Local persistence behind a storage boundary | Ad hoc in-memory state that avoids the storage boundary |
| Basic logs at component boundaries | No way to inspect what happened |
| One API endpoint with the intended contract | One-off script that cannot evolve into the service |

Use this test:

> Can the next increment build on this, or does it need to replace it?

If the next increment needs to replace it, the implementation is probably not a walking skeleton.

## Observability


The workflow should be inspectable during development.

At minimum, engineers should be able to see:

- the input received
- which components were called
- the data passed between major components
- the output produced
- where failures occurred

This does not require a full observability platform. Logs, structured debug output, or simple traces are enough for the first version.

## Failure Handling


The walking skeleton should not only handle the happy path.

It should include basic handling for representative failures, such as:

- invalid input
- missing data
- failed dependency
- invalid response from a component
- unsupported operation

The handling can be simple, but it should be explicit.

Failures should not be silently ignored.

## Expected to Remain


The following should normally remain after the walking skeleton:

- main component boundaries
- core interfaces
- core data structures
- local run path
- end-to-end test approach
- basic logging approach
- error propagation approach

The implementation details may change, but the basic structure should continue into later work.

## Expected to Change


The following may change later:

- internal algorithms
- storage implementation
- ranking or scoring logic
- user interface
- performance optimizations
- deployment setup
- configuration system
- access control
- advanced error handling
- evaluation framework

The walking skeleton is not the final implementation. It is the first implementation that proves the system can run through the intended path.

## Completion Criteria


The walking skeleton is complete when:

1. One named workflow runs from input to output.
2. The workflow uses the main intended components.
3. Interfaces between components are explicit.
4. The main data structures are defined.
5. A developer can run the workflow locally.
6. The workflow has at least one end-to-end test.
7. The workflow produces inspectable logs or debug output.
8. At least one representative failure case is handled.
9. The next increment can build on the implementation without replacing its structure.
10. The team can list which risks were tested and which remain open.

## Comparison with Related Techniques

### Spike


A spike is used to learn something quickly. It may be discarded.

A walking skeleton may also teach the team something, but it is intended to become part of the implementation.

### Prototype


A prototype is used to explore feasibility, product behavior, or user experience.

A walking skeleton is used to verify that the system structure can support a workflow.

### Thin Vertical Slice


A thin vertical slice is a narrow implementation across the stack.

A walking skeleton is a thin vertical slice focused specifically on the main architecture and integration path.

### Foundation Layer


A foundation layer is horizontal. It builds shared infrastructure or common capabilities.

A walking skeleton is vertical. It connects the main parts of the system through one working path.

## Summary


Use an architectural walking skeleton when the main risk is whether the parts of the system can work together.

Build one small workflow that uses the intended components, interfaces, and data structures.

Keep the implementation simple, but do not bypass the architecture.

The result should be something the team can run, inspect, test, and extend.
