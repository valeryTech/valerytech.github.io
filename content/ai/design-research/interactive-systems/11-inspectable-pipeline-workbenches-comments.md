---
draft: false
toc: true
description: "A critique requires revision-specific records and scoped intervention judgments, distinguishing evidence visibility from support guarantees and inspection from replay, with explicit comparison conditions still needed."
title: "11 Inspectable Pipeline Workbenches Comments"
linkTitle: "11 Inspectable Pipeline Workbenches Comments"
---
# Comments on inspectable pipeline workbenches


The comments are new analysis of the [retained workbench model]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}). The artifact vocabulary, RAG example, interaction lists, and architecture remain unchanged. They are proposals rather than an implemented record schema or execution protocol.

## Connect artifacts to their scenarios and revisions


The source proposes scenarios, variants, stages, artifacts, interventions, traces, judgments, policies, and evaluations. A later design needs rules connecting each record to the scenario, inputs, configuration, and artifact revision it concerns.

The existing [program and run history]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) distinguishes a program version from a run and its results. The workbench needs a related distinction between editing a variant, running a variant again, and changing an artifact during inspection. The names in the source do not establish that those actions are interchangeable.

## Record an intervention separately from its meaning


Promoting a chunk records an action, while the reason for promotion records a judgment. The action alone does not establish that the chunk is relevant or that the same change should apply to another scenario.

A later record could identify the participant, the affected revision, the change, the reason, and the resulting output. The choice remains open, and the source does not define how contradictory judgments or uncertain reasons are represented.

The intervention vocabulary also needs scope. Approval of evidence relevance, acceptance of an answer, and authorization of an external action concern different decisions. The existing [verification and acceptance note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) and [effect-boundary discussion]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}#effect-boundary) provide the related distinctions.

## Keep evidence inspection separate from evidence guarantees


The complete RAG example shows selection, ordering, neighboring context, support mapping, and citations. Visibility can help diagnose an omission without establishing that every required passage was found or that the final answer is supported.

The existing [retrieval comments]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections-comments" >}}) distinguish candidate representations from evidence judgments. The [investigation evaluation note]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) supplies a separate proposal for checking omissions and other failures against known cases.

The source's descriptions of context metrics remain unverified. Naming a metric does not specify the reference data or establish that the metric captures every intended evidence requirement.

## Distinguish inspection from replay


The second formulation states that every run is replayable. The third formulation allows an important run to be replayable or at least inspectable. The difference remains in the original text rather than being reconciled through an undocumented edit.

Stored versions and observations can support inspection. Performing a new model call or invoking a changed external service can produce a different result. The [run-history comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}#inspection-and-replay) identify the related distinction.

A later workbench must state whether a comparison reuses recorded outputs, replays recorded operations, or performs new operations. Its treatment of side effects and permission for new operations also remains open.

## Architecture and comparison rules remain open


The diagram names stores and an orchestrator without requiring a separate service for every store. It also does not define scheduling, retries, cancellation, stale results, or how an intervention changes a running computation. The existing [application-state comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}) concern those questions.

Comparing variants requires a stated scenario set and recorded evaluation conditions. Differences in evidence, model settings, intervention effort, or budget can affect the comparison. The source proposes comparison without specifying a complete experiment or reporting measured results.

The full RAG example remains beside the workbench vocabulary because it explains what the records and interventions could concern. The [method note]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) supplies the broader framing, and the [third proposal]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles" >}}) retains the later goals and principles.

## Audit and limits


The [source overview]({{< ref "engineering/eng-exp/exploratory-design" >}}) links the complete split. The [stage 9 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-9-exploratory-pipeline-design) records the original range of the model, example, lists, and architecture.

The reassembly preserves the original terminology without making the proposed records into an accepted schema. No product description, metric claim, or referenced attachment was independently verified during the split.
