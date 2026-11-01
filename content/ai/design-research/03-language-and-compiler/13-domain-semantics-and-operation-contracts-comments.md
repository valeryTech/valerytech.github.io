---
draft: false
toc: true
description: "Questions ownership and versioning of business definitions and refund contracts, distinguishing advertised operation descriptions from enforced authorization, current preconditions, idempotency, and confirmed external outcomes."
title: "13 Domain Semantics And Operation Contracts Comments"
linkTitle: "13 Domain Semantics And Operation Contracts Comments"
---
# Comments on domain semantics and operation contracts


The comments are new analysis of the [retained domain and operation passage]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts" >}}). The original examples and research descriptions remain unchanged, and the comments do not specify an accepted implementation.

## Domain definitions need an owner and version


The account example distinguishes input types from business meanings. A string field does not establish which definition of an active account applies, and a number does not establish the currency or accounting rule used for revenue.

A later design needs to identify who maintains a definition and which version an interpretation uses. The source also leaves open how conflicting definitions across domains are resolved. Local descriptions can support interpretation without establishing that every participant uses the same meaning.

The [semantic-kernel note]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) distinguishes structural checks from runtime properties and professional judgment. The general business-semantics discussion belongs beside the kernel without replacing its existing audit-analytics example or making every business definition a static type.

## Described operations are not security authority


The reply uses capability for a described operation. The refund YAML includes inputs, preconditions, effects, authority, risk, and an idempotency requirement. The fields describe the proposed operation but do not establish who may invoke it.

The permission name in the authority field needs a separate enforcement rule. The [trusted-boundary note]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) already distinguishes task capabilities from security authority. Its [imported refund-denial example]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#authorization-of-concrete-operations) concerns the concrete amount, not only the availability of a refund tool.

A later design also needs to establish who supplied the operation description and whether the description matches the implemented behavior. Discoverability and a valid schema do not prove the truth of declared effects.

## The refund example leaves execution rules open


The complete YAML remains illustrative. It does not specify a positive-amount rule, currency compatibility, the authorized payment owner, or the output used to distinguish a completed refund from a pending request.

The balance precondition also needs a rule for concurrent changes. A later design must state whether the payment system checks the current balance when applying the refund, and how its result is reflected in local records.

The idempotency field states a requirement without defining a key, scope, duplicate-request behavior, or retry outcome. The irreversible-risk field does not establish recovery behavior after an uncertain external result. The existing [mediation note]({{< ref "ai/design-research/03-language-and-compiler/04-dsl-as-mediation-layer" >}}) provides related discussion of external effects, retries, and compensation.

The imported contract remains unchanged so a later design can test the missing rules rather than silently adding them to the original example.

## Descriptions and formal checks have different roles


The reply proposes using language descriptions for some meaning and formal fields for properties that need checking. The proposal leaves open which meanings require explicit agreement and which properties have enforceable definitions.

The [intent-compilation passage]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#intent-compilation-and-bounded-program-synthesis) uses the operation descriptions to construct a candidate plan. A candidate's structural validity does not establish that a business term was interpreted correctly or that all declared preconditions are true when execution begins.

The claim that improved models make schemas more valuable remains the LLM's interpretation. The cited dialogue and analytics research, including the descriptions of recent preprints, were not independently reviewed during the split.

## Audit and source claims


The [architecture overview]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) retains the historical precedent, complete layer list, application-boundary proposal, and closing bibliography. Its [comments]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries-comments" >}}) connect meaning, authority, interaction, and execution.

The source overview (archived source 012) links the full split, and the [stage 8 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-8-language-interfaces-and-architecture) records the original lines. No research or protocol claim was verified merely by placing the passage in the design-research collection.
