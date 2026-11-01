---
draft: false
toc: true
description: "Critiques competing prototype sequences and specifies what comparable tasks, authority-change failures, and human inspection studies would need to show before selecting collaboration primitives."
title: "07 Collaboration Framework Research Routes Comments"
linkTitle: "07 Collaboration Framework Research Routes Comments"
---
# Collaboration framework research routes: comments


Editorial context, 2026-04-20: Wording in this review and the linked research discussion has been edited for standalone reading. References to preserved or unchanged source wording describe the earlier reassembly; the review's judgments remain attributed commentary, not accepted decisions.

New commentary by Codex, added on 2026-04-01. The [routes note]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes" >}}) retains the original analysis and routes arguments with editorial wording. The comments explain the arrangement and open design questions, rather than recording completed experiments or an accepted implementation plan.

## Why the route comparison stays together


The source compares starting points by their questions, examples, and tradeoffs. Keeping the comparison together preserves why a developer might test one approach against another. Moving every route into a separate technical note would separate the recommendations from the comparison.

The complete [declarative pattern examples]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}#collaboration-patterns-as-declarative-constraints) develop the existing programming model. A link occupies their original position in the analysis. The incident-response examples stay with their respective routes, because they illustrate differences between the proposed implementations.

The research scope remains the collaboration-framework application. The [scope and hierarchy note]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) distinguishes an application architecture from requirements of the general theory.

## Different groupings and recommendations


The analysis identifies five starting perspectives. The routes section describes three build routes and a separate narrow contract experiment. The groupings serve different purposes, so they should not be combined into one fixed or complete taxonomy.

The first section proposes independent prototypes of the same demanding use case. The later section proposes an API, then a runtime, then a declarative model. The closing recommendation compares two implementations of one application. All recommendations remain in the source, including their different order and scope.

A later plan should state whether the prototypes explore alternatives in parallel or develop one implementation in stages. Reassembly does not resolve the choice or adopt the suggested order.

## What a prototype comparison would need to show


Repeated names across prototypes would suggest concepts to examine. The same word could still refer to different states or operations, so repetition alone would not establish a common set of rules.

A useful comparison would use the same task requirements and failure cases. The proposal is to record how each implementation represents a proposal and handles an authority change. Another proposal is to record what happens when review is missing or an effect fails. Developer effort and enforceable behavior would need separate checks.

The shared-artifact perspective needs its own evaluation of inspection and revision. Testing an API and a runtime alone would not establish whether people can understand and change the computational representation.

## The narrow contract experiment


The source proposes complete coverage, exact provenance, and resolved conflicts for a final finding. The existing [contract discussion]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}#the-formal-core) qualifies static guarantee labels and develops runtime certificates. The qualification is linked rather than substituted into the saved proposal.

A later experiment should define the corpus and what coverage means. It should also distinguish recorded provenance from sufficient evidence. Conflict handling may produce an unresolved outcome instead of a finding, so compulsory resolution should not be assumed from the example.

The [investigation evaluation proposal]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) provides related test ideas, but no experiment was run or selected during reassembly.

## Status of the proposed architecture


The layered architecture, code examples, and comparative judgments remain proposals. The reply does not establish that the named layers compose correctly or that a planner can find a permitted execution. The [declarative comments]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model-comments" >}}) describe the related distinction between permitted behavior and successful completion.

The mapping log records the moved ranges and preservation checks. No language, runtime, public API, or first application is selected by the arrangement.
