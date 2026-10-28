---
draft: false
toc: true
description: "A critique separates document, interaction, job, and derived state, identifying missing change-ownership and result-freshness rules and distinguishing undo, cancellation, and replay before selecting asynchronous boundaries."
title: "05 Application State And Computation Comments"
linkTitle: "05 Application State And Computation Comments"
---
# Comments on application state and computation


The comments are new editorial analysis of the [retained architecture sketch]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}). They identify open design questions rather than changing the original example or declaring an accepted specification.

## Relation to the investigation model


The [shared-state note]({{< ref "ai/design-research/interactive-systems/01-shared-investigation-state-and-views" >}}) asks which investigation objects people and agents work with. The [composition note]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}) asks which operations they can combine. The application sketch concerns how interaction requests changes and how computation returns results.

An investigation view can display shared domain objects without storing every interaction detail in those objects. A later design needs to state which information is shared, local to a participant, or specific to a run.

## Separate the kinds of state


The TypeScript example gives one state value the alternatives "editing", "computing", "result", and "failed". The example names several conditions but does not define their transitions. It does not explain how editing continues while one or more jobs run.

A later model should consider the different kinds of state separately:

- Document state records domain content and its revision.
- Interaction state records selection, focus, gestures, and the active tool or mode.
- Job state records requested computation, its inputs, progress, cancellation, and completion.
- Derived state records computed values or views and the inputs on which they depend.

Separating the meanings does not require a separate service or process for each kind of state. The choice of data structures and execution boundaries remains open.

## Define who can change state


The diagram draws user input directly into application state, while the accompanying text emphasizes explicit state and events. The drawing does not define which component applies a change or checks whether the change is allowed.

A later implementation needs a defined route from an interaction request to a domain change. Direct editing, a computed result, and a remote update should each have stated rules for applying changes. The retained diagram is unchanged rather than corrected through an undocumented edit.

## Decide when a result is still usable


The example includes a job identifier, but it does not implement a rule for accepting a completion event. A result can arrive after the document changes or after another job finishes. The identifier distinguishes jobs without establishing that a result applies to the current document.

One possible policy records the input revision with each job and labels a result when its inputs differ from the current document. Older results could remain available for inspection without replacing a result for the current revision. The dialogue has not selected that policy.

The [program, run, and result history]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) provides a related distinction. An application needs to connect a displayed result to the relevant inputs and run without treating a historical result as current by default.

## Separate undo, cancellation, and replay


Undo changes domain history according to an application's rules. Cancellation requests that an operation stop, and replay concerns recorded execution or another execution of earlier work. A single "back" operation does not define all of those behaviors.

The "CANCEL" event in the example names a request without specifying whether the worker stops or how a later completion is handled. A cancellation policy also needs to state what happens to work that has already produced a result or changed an external system.

Undo should have a defined relationship to recorded runs and contributions. A possible design creates a new document revision when an edit is undone, while retaining the record of the earlier edit and its computations. The dialogue has not settled the history model.

## Assess asynchronous boundaries separately


The [practitioner reply]({{< ref "ai/design-research/interactive-systems/06-complex-interface-reading-path" >}}#research-complex-ui-design) includes the xi retrospective as a caution about synchronization and caching complexity. Its inclusion prevents the reading path from being interpreted as an instruction to move every operation into another process.

A later design should identify which computation blocks interaction and which state must cross a proposed boundary. The required responsiveness, consistency, and recovery behavior should guide the choice rather than separation alone.

## Audit


The [stage 6 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-6-complex-ui-design-dialogue) records the complete architecture passage and the related reading dialogue. Both source diagrams in the practitioner reply and both code blocks in the architecture passage remain whole. The source text and cited claims were not rewritten or independently verified.
