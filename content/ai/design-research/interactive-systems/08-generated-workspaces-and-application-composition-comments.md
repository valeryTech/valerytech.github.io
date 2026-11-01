---
draft: false
toc: true
description: "A critique tests temporary-workspace cost claims against review, validation, maintenance, and recovery, distinguishing familiar controls, cross-application semantic agreement, and retained work from disposable interface views."
title: "08 Generated Workspaces And Application Composition Comments"
linkTitle: "08 Generated Workspaces And Application Composition Comments"
---
# Comments on generated workspaces and application composition


The comments are new analysis of the [retained consequences]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition" >}}). The passage's claims about costs and future software remain hypotheses rather than accepted design requirements or measured outcomes.

## Keep interface costs separate from duplicated business logic


The reply describes capabilities as encoded in both backend operations and interface controls. A user interface can also provide discovery, explanation, selection, preview, and feedback. Those functions are not necessarily a second implementation of business logic.

Generating a workflow or temporary interface does not remove the need to define its state and allowed operations. The economic argument needs to account for review, validation, maintenance, and recovery as well as generation. The original passage supplies no cost comparison establishing when a temporary tool becomes economical.

## Compare generated interfaces with stable controls


The existing [stable-component proposal]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}) favors familiar controls that people can learn and reuse. The new passage proposes interfaces adapted to individual tasks. The proposals need comparison rather than being treated as an already settled design.

Composing a layout from familiar controls differs from inventing a new interaction grammar or generating arbitrary application code. A later design should state which forms of generation are allowed and what checks apply to each. The source does not make that choice.

The CSV example includes a review interface for candidate matches. Providing a review screen can expose the proposed matches, but the screen alone does not establish that the matching rule is correct or that the user has enough information to evaluate every case.

## Define meaning across applications


The reply proposes a model that matches concepts across several application schemas. Access to several APIs does not establish that identifiers, versions, units, or domain concepts mean the same thing across them.

A later design needs to state how mappings are established and which assumptions require agreement. A request to connect work across systems also needs a defined scope and permissions for the resulting operations. The [candidate-plan passage]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#natural-language-requests-and-candidate-plans) and [instruction-boundary passage]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#instructions-and-untrusted-data-in-language-interfaces) concern related checks.

The existing [composition dialogue]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}) proposes typed operations with preserved provenance. The broader cross-application proposal does not establish that every available API already satisfies those composition rules.

## Keep temporary views connected to recorded state


A temporary interface can display work whose records need to persist after the interface is closed. The [application-state note]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}) and its [comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}) distinguish interaction state, document revisions, jobs, and derived results.

The generated-workspace proposal should therefore be read with the unresolved questions about state ownership, obsolete results, undo, and cancellation. Discarding a view should not be assumed to cancel computation or remove its history. The source does not define those behaviors.

## Audit and claim status


All three consequence sections remain together, including the complete temporary-tool example and cross-application formulas. The source overview (archived source 019) links the surrounding argument, and the [stage 7 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-7-natural-language-interface-dialogue) records the original passage.

Research, product descriptions, and economic claims were not independently checked during the split. The [language-intent comments]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction-comments" >}}) keep interpretation, examples, intent agreement, and authority distinct from the predictions retained here.

## Costs of temporary workflows


The later [cost passage]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition" >}}#economics-of-small-and-temporary-workflows) includes a staffing illustration and diagrams of a possible economic change. The source does not provide measurements establishing the proposed costs or the point at which a generated workflow becomes economical.

A comparison needs to account for domain modeling, interpretation review, validation, permissions, maintenance, and recovery. Generation time alone does not establish the full cost of a usable workflow.

The suggestion to discard a temporary application also leaves open which records need to persist. A view can be temporary while decisions, approvals, jobs, and external effects remain recorded. The [architecture comments]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries-comments" >}}#temporary-views-and-retained-work) identify the unanswered ownership and retention questions.

The [stage 8 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-8-language-interfaces-and-architecture) records the complete cost argument, including its Flash Fill reference. The earlier stage 7 consequence sections remain unchanged.
