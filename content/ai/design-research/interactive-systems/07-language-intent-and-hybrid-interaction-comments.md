---
draft: false
toc: true
description: "A critique separates inferred thresholds and editable interpretations from agreed intent, valid plans, domain feasibility, and action authority, showing why examples and controls leave important choices unresolved."
title: "07 Language Intent And Hybrid Interaction Comments"
linkTitle: "07 Language Intent And Hybrid Interaction Comments"
---
# Comments on language intent and hybrid interaction


The comments are new editorial analysis of the [retained dialogue]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}). They also concern its passages on [candidate plans]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#natural-language-requests-and-candidate-plans) and [instruction boundaries]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#instructions-and-untrusted-data-in-language-interfaces). They are not part of the original response or an accepted implementation specification.

## Preserve the author's request and the LLM's revision


The author asks to investigate an earlier sentence about input spaces that are too messy to model explicitly. The LLM changes the formulation to request spaces that are too large and compositional to enumerate. The revision is part of the response, not a new instruction from the author.

The revised argument distinguishes descriptions of desired work from the operations available to perform it. The distinction can be examined without accepting the reply's historical claims, model-capability claims, or predictions. The original reading map remains with the opening request so the related passages can refer back to it.

## Make interpretation choices visible


The CRM example assigns a threshold of one million to "large" and a particular year to "March". The source does not show a local policy or clarification that establishes either choice. The generated arguments remain illustrative candidates rather than confirmed interpretations.

The calendar example also requires resolving a person, event, date, and time range. The YAML preserves an unresolved event identifier. A later implementation needs to expose which values came from the request, context, defaults, or an interpretation that still needs agreement.

Direct controls can make some choices explicit after an initial request. A map, slider, calendar, or constraint control still needs a defined relationship to the formal task state. The existing [application-state comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}) identify related questions about changes, input revisions, and results.

## Separate intent agreement from structural checks


The [candidate-plan passage]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#natural-language-requests-and-candidate-plans) keeps the comparison with declarative programming, the diagram, and the calendar example together. The passage makes the transition from an ambiguous request to a formal candidate visible, but it does not implement the checks.

A grammatical or typed candidate can still express an unintended task. Agreement about meaning, structural validity, domain feasibility, and permission to act concern different questions. The existing [mediation model]({{< ref "ai/design-research/03-language-and-compiler/04-dsl-as-mediation-layer" >}}) and [trusted-boundary note]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) provide the related distinctions.

The reply presents SayCan and PICARD as related examples, while its descriptions refer to different constraints. Their placement together does not make feasibility checks and grammar constraints equivalent. The underlying papers were not independently reviewed during the split.

## Examples constrain a candidate without completing the specification


The duplicate-name example gives both matches and a distinction to preserve. A proposed implementation should account for those supplied cases, but the examples do not define every possible name or domain exception.

The phrase "specification + tests" remains the LLM's framing. A finite set of examples can help communicate intent without establishing that all behavior outside the examples is correct. The intended domain rules and consequences of an incorrect match remain open questions.

## Interpretation and authority are separate


The [instruction-boundary passage]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#instructions-and-untrusted-data-in-language-interfaces) retains the example of hostile instructions embedded in an email. The email's contents are source data in the example, not a new request from the user.

The existing trusted-boundary note distinguishes authenticated authority from statements in content. An interpreted request and a list of safeguards do not, by themselves, define who may perform an operation or how the runtime enforces that decision. The source's security statements remain unverified claims, and the reassembly does not add a new security guarantee.

The closing diagram also uses the term "deterministic execution". The [program and run history comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}#inspection-and-replay) distinguish recorded execution from rerunning operations. The diagram alone does not guarantee identical outputs from changing external systems or model calls.

## Audit and limits


The source overview (archived source 019) links all four destinations. The [stage 7 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-7-natural-language-interface-dialogue) records every original line and preserves the original order across them.

The opening request, separators, examples, formulas, and closing question remain unchanged. The cited research and long-term claims were not independently verified. The [generated-workspace comments]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition-comments" >}}) examine the separate predictions about interfaces and application composition.

## Editable interpretation in the architecture reply


The later [editable-interpretation passage]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}#editable-interpretation-of-ambiguous-requests) turns a customer request into explicit selection controls. The proposed revenue and outage thresholds are interpretation choices, and the source does not show the organization supplying them.

The original request concerns customers who might be concerned. The example uses affected requests as part of its selection rule, which is a proposed way to identify customers rather than evidence of their concern. The source also leaves contact method, message content, and permission to contact them unresolved.

Editing the controls can make selection choices visible without resolving every consequence of the request. The [domain-contract comments]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts-comments" >}}) distinguish definitions from enforceable rules. The [architecture comments]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries-comments" >}}#interpretation-and-checking-answer-different-questions) connect interpretation to preview, checking, and permission.

The [stage 8 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-8-language-interfaces-and-architecture) records the appended passage. The original stage 7 source ranges remain unchanged.
