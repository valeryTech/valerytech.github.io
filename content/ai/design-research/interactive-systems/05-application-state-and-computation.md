---
draft: false
toc: true
description: "A proposed application architecture routes interaction through explicit state, events, and command/effect boundaries, using a TypeScript sketch to frame editing and out-of-order asynchronous computation as transition problems."
title: "05 Application State And Computation"
linkTitle: "05 Application State And Computation"
---
# Application state and computation


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The retained passage comes from the first LLM reply in the complex-interface dialogue (archived source 018). Its [opening question and resource list]({{< ref "ai/design-research/interactive-systems/06-complex-interface-reading-path" >}}#research-complex-ui-design) and the later request for practitioners remain in the reading-path note.

The passage keeps the complete architecture diagram, TypeScript state and event example, and explanation of results arriving out of order. It is a proposed architecture sketch rather than an accepted implementation specification.

The existing [shared-state note]({{< ref "ai/design-research/interactive-systems/01-shared-investigation-state-and-views" >}}) describes investigation objects and views. The [composition note]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}) describes operations people and agents can combine. The passage below concerns application behavior rather than replacing either model.

Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}) for state ownership, result validity, cancellation, undo, and asynchronous boundaries. The [audit map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-6-complex-ui-design-dialogue) records the original order.

<a id="retained-architecture-passage"></a>

## Architecture proposal


<!-- Complex-application architecture passage begins below. -->

For the proposed kind of system, the proposal is to architect it roughly like this:

```text
                   ┌──────────────┐
                   │     View     │
                   │ React/etc.   │
                   └──────▲───────┘
                          │
                    projection(state)
                          │
┌────────────┐      ┌─────┴──────┐
│ User input │─────►│ App state  │
└────────────┘      └─────▲──────┘
                          │
                    events/results
                          │
                   ┌──────┴───────┐
                   │ State machine│
                   │ / reducer    │
                   └──────┬───────┘
                          │ commands
              ┌───────────┴────────────┐
              │                        │
       ┌──────▼──────┐          ┌─────▼──────┐
       │ Domain logic│          │ Effects /  │
       │ pure funcs  │          │ async work │
       └─────────────┘          └─────┬──────┘
                                     │
                          ┌──────────┴──────────┐
                          │ worker / WASM / API │
                          │ DB / server / GPU   │
                          └─────────────────────┘
```


The key idea is that **complex processing shouldn't turn the UI itself into a giant collection of callbacks**. Model the interaction as explicit state and events. Put the difficult computation behind a small command/effect boundary.

For example:

```ts
type State =
  | { type: "editing"; document: Document }
  | { type: "computing"; document: Document; jobId: string }
  | { type: "result"; document: Document; result: Result }
  | { type: "failed"; document: Document; error: Error };

type Event =
  | { type: "EDIT"; change: Change }
  | { type: "RUN" }
  | { type: "CANCEL" }
  | { type: "COMPLETED"; jobId: string; result: Result }
  | { type: "FAILED"; jobId: string; error: Error };
```


That representation makes things like "user edits while calculation #17 is still running and its result arrives after calculation #18" a tractable state-transition problem instead of callback spaghetti. Harel's statecharts are especially useful once those states become hierarchical or concurrent. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/0167642387900359))
