---
draft: false
toc: true
description: "Editorial guidance preserves the move from fixed graphs to composable operations and separates displayed views, shared state, interpreted intent, evidence guarantees, and runtime review from design learning."
title: "00 Index Comments"
linkTitle: "00 Index Comments"
---
# Comments on the interactive systems collection


The comments below were added on 2026-10-01. They are separate from the retained user and LLM text.

## Separate the example from the design proposal


The [author's design observations]({{< ref "ai/design-research/interactive-systems/04-design-observations-from-hebbia" >}}) now have a separate note. The Matrix case note retains the first LLM critique and links back to the author's words. The critique includes an initial distinction between an execution graph and an evidence graph, because the distinction is part of the opening argument.

The subsequent [shared-state proposal]({{< ref "ai/design-research/interactive-systems/01-shared-investigation-state-and-views" >}}) and [interface proposal]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}) have their own notes. Hebbia references remain in the original text, but the notes can be read as general design proposals through the added context links. Product behavior described in the dialogue has not been independently checked.

## Preserve the correction to fixed representations


The initial reply treats investigation as graph-shaped. The later user question challenges the risk that matrices, cubes, and graphs could restrict the ways people think and work.

The [composition dialogue]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}) keeps the correction and its reply together. The proposed operations can be combined first, and a graph can describe the resulting dependencies. A displayed graph does not have to define every permitted workflow.

The typed object list in the shared-state note is therefore a candidate model, not an agreed universal ontology. The next design question is which objects and operations need stable meaning for the intended tasks.

## Distinguish operations, state, and views


The dialogue sometimes uses "Matrix" for an operation, an interface, and a product. Those uses need separate definitions in a later design.

A computation produces or changes state, while a view presents selected state. Editing a view needs an explicit connection to the operation or state change it requests. The retained dialogue proposes the connection but does not yet define transaction boundaries, asynchronous results, undo, or concurrent changes.

The complex UI source overview (archived source 018) now links an [application-state sketch]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}) and a separate [reading dialogue]({{< ref "ai/design-research/interactive-systems/06-complex-interface-reading-path" >}}). The [architecture comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}) identify open rules for state changes, asynchronous results, undo, and cancellation. The original sketch names some of the mechanisms without defining their complete behavior.

## Keep inspection separate from evidence guarantees


The [retrieval dialogue]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}) belongs beside the investigation model because it develops query representations, document representations, retrieval passes, and candidate histories. It remains linked to the interface collection because it also proposes ways to inspect those histories.

A record that a document was screened can show what an operation did. The record alone does not establish that screening found every relevant passage or that a conclusion is correct. The proposed coverage and authority controls need defined evidence requirements and checks, as discussed in the [epistemic-contract note]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}).

## Separate interpreted intent from committed state


The [language-intent dialogue]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}) proposes a role for language in describing and composing operations. Its [candidate-plan passage]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#natural-language-requests-and-candidate-plans) and [instruction-boundary passage]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#instructions-and-untrusted-data-in-language-interfaces) now follow existing design-research notes.

The [language-intent comments]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction-comments" >}}) distinguish agreement about meaning from structural checks and permission to act. The separate [generated-workspace proposal]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition" >}}) concerns possible interface and composition consequences. Its [comments]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition-comments" >}}) compare generated interfaces with stable controls and identify unresolved costs, mappings, and state rules.

## Separate domain records from the interaction environment


The [architecture reply]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) proposes separating a domain's data, rules, and authority from its task interface. The [domain-contract note]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts" >}}) retains the complete operation example. The existing planning, authority, interface, cost, and ambiguity notes now include the related passages.

The source contains the LLM's architecture and predictions without a preceding user prompt. The [architecture comments]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries-comments" >}}) and [domain-contract comments]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts-comments" >}}) keep descriptions, authority, interpretation, and enforcement separate. The arrangement does not select the architecture or turn its closing experiment into a new task.

## Distinguish design discovery from runtime review


The [exploratory-design method]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) concerns discovering pipeline behavior through inspectable artifacts, interventions, traces, and comparisons. The [workbench model]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}) provides the complete record vocabulary and RAG example. The [third formulation]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles" >}}) keeps its original label marking it for analysis.

The new sibling comments distinguish observations from validated policies, inspection from replay, and useful behavior from permission to act. Runtime review can have a purpose independently of later engineering learning. The related design-research notes remain linked rather than being rewritten to adopt the new proposal.

The selected pending list is now complete. A later collection-wide review can compare topics, reading paths, and source coverage without assuming that the latest formulation in each dialogue is an accepted design.

## Scope of this pass


The split moves complete passages without rewriting them. The final retrieval question and reply stay together, and the middle composition discussion keeps its examples and proposed contracts together. New navigation is outside each recorded source range.

Later passes regrouped the product analysis and extracted the author's opening observation from the case note. Captured sources remain separate. The [reassembly map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}) records the initial split and the current locations needed to reconstruct the original document.
