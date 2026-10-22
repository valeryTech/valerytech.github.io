---
draft: false
toc: true
title: "RAG Reframing: Editorial Review of the Companion Documents"
description: "An editorial map of the retrieval companions explains why assembly is bounded to operation inputs, discovery can be an outcome, and evidence judgments require a stated basis, while main-framing choices remain open."
linkTitle: "RAG Reframing: Editorial Review"
---

Review date: 2026-10-19.

This note records the rationale for revising the retrieval companion documents. It is an editorial assessment of their concepts and contracts, rather than a new architectural specification or a report of measured retrieval quality. The [main framing]({{< ref "ai-engineering/retrieval/reframing" >}}) remains a separate draft whose rewrite and final structure are undecided.

Use the [domain model]({{< ref "ai-engineering/retrieval/model" >}}) for shared definitions, the [contract note]({{< ref "ai-engineering/retrieval/conceptual-alignment" >}}) for interface responsibilities, [representation design]({{< ref "ai-engineering/retrieval/model-representation-design" >}}) for access-view choices, the [evidence-workflow proposal]({{< ref "ai-engineering/retrieval/reframing-proposed" >}}) for knowledge-intensive work, and [retrieval design]({{< ref "ai-engineering/retrieval/retrieval-design" >}}) for experiments and work allocation.

## What the rename clarified


The previous name described a defensible design direction: interpret a task, derive what it needs, and construct context. Context-to-task alignment emphasizes the desired fit of that context to the task. The derivation process still starts from the current purpose and requirements.

The substantive editorial change is to distinguish the fit being sought from the operations used to achieve it. Acquisition, representation design, selection, and assembly need explicit contracts. Assessment needs an inspectable basis. A successful outcome still requires appropriate use of the inputs and, where relevant, correct execution.

A terminology substitution alone could not reconcile the different accounts of those responsibilities across the collection.

## Decisions reflected in the companion revisions

### Assembly has a bounded meaning


The earlier model used Context Assembly both for selection and structuring after acquisition and for a broader lifecycle that included acquisition. The main framing also uses Task-first Context Assembly as an umbrella for work extending through execution and verification.

The companions now reserve assembly for selecting and structuring available material into working context for a named operation. Task-first design describes the broader approach in ordinary language. The main framing's terminology remains an editorial decision; its different usage should not be treated as the companions' definition.

### Context fitness needs a stated basis


Lists of desirable properties such as sufficient, fresh, or trustworthy do not explain how a particular input set meets a particular need. The domain model now makes context assessment a responsibility with requirements, source scope, findings, unresolved issues, and a basis for choosing the next action.

Assessment is scoped to the current operation and accepted uncertainty. It can use direct checks, human judgment, or model suggestions. It is not a required additional model call or a universal adequacy score. An input set can be useful for showing a disagreement while inadequate for resolving it.

Runtime assessment and design-time evaluation answer different questions. The first concerns particular inputs; the second concerns how reliably a method behaves across stated cases. Neither substitutes for outcome verification.

### Discovery and task revision belong in the core account


An inquiry can begin before the user knows which distinction matters. Finding passages, seeing disagreement, and forming a better question can be useful outcomes without synthesis.

The earlier model already described feedback loops. The revisions connect feedback to the state it changes: task interpretations, requirements, acquisition runs, selections, judgments, gaps, and operation inputs. This supplies a basis for revision and invalidation rather than merely adding arrows to a linear diagram.

The evidence workflow is a specialization for work that needs those records. A direct lookup should remain small. The number of conceptual distinctions does not prescribe the number of screens, services, model calls, or stored objects.

### Working context is a view of available state


An investigation may retain candidates, claims, discarded interpretations, source references, and prior runs. A consuming operation needs only the relevant part in a usable form. A prompt or input snapshot should not become the sole record of sustained work.

An evidence set can persist across operations. Working context can include a selected view of that material, task requirements, judgments, instructions, and unresolved issues. Sources, derived indexes, investigation state, and operation inputs have different lifetimes and invalidation conditions.

### Generation is one kind of operation


The companions now allow a person, deterministic software, or a model to consume working context. Generation can produce analysis, queries, plans, code, structured objects, or proposed actions as well as presentation text.

An executor can consume a generated instruction, but the general model does not require generation first. The distinction among proposed instruction, authorized execution, observed result, and verified outcome remains visible. Tool availability and descriptions can inform context without turning the actual capability or authorization mechanism into a text artifact.

### Representation design is a method with independent dimensions


The earlier representation catalogue mixed source units, transformations, matching methods, metadata, and evaluation assets. The revised note separates these dimensions and derives candidate views from a task family and a demonstrated access problem.

The catalogue remains as options grouped by information need. Exact lookup, concept discovery, and revision comparison provide different illustrative designs. Multiple representations are a hypothesis to test, rather than a universal requirement. Evaluation cases and judgments are kept distinct from the runtime source views they assess.

The contract note also clarifies that distinct roles can contain identical text. A request can already be a good retrieval query. The engineering obligation is to make the source-directed decision appropriate and inspectable, rather than always introducing a rewrite.

## Evidence-workflow distinctions worth preserving


Several detailed lessons remain useful within the narrower evidence-workflow scope:

| Distinction | Why it matters |
| --- | --- |
| Encoding input, match, source occurrence, and reading unit | A searchable view can locate material that needs additional context for interpretation. Semantic ranking does not establish semantic boundaries. |
| Source identity and acquisition route | Several routes can recover one occurrence; identical words can occur at different locations. Keep overlap relationships and mapping uncertainty explicit. |
| Collection and evidential acceptance | Retaining a passage does not establish its truth, authority, or support for a particular claim. Counterevidence can be worth collecting. |
| Ranking, attribution, filtering, judgment, and appearance | A rank or convincing highlight does not establish relevance, support, or completeness. |
| Provenance and authority | Recovering an exact source occurrence does not settle which source governs or whether it is correct. |
| Pool exhaustion, budget exhaustion, and adequate support | They justify different stopping decisions and different limitations on a result. |
| Index, screening, source-range, and requirement coverage | Their denominators differ; none substitutes for measured retrieval recall or a completeness argument. |
| Input revision and result applicability | Source changes, new requirements, or changed selections can make an earlier judgment or output stale. |

These distinctions are design proposals and analysis tools. An implementation needs checks appropriate to the claims it makes; a prototype's appearance or a passing structure check does not establish semantic quality.

## How the documents now divide responsibility


| Document | Editorial role |
| --- | --- |
| Domain model | Definitions, relationships, operation contracts, assessment, and feedback. |
| Conceptual alignment | How component boundaries preserve those roles, including lightweight implementations. |
| Representation design | Deriving and evaluating searchable access views for recurring task needs. |
| Evidence-workflow proposal | Applying the model to inspection, evidence decisions, accumulation, and downstream use. |
| Retrieval design | Small baselines, comparative experiments, shared work, and evidence for automation. |
| This review | Reasons for the revisions and unresolved choices for the main framing. |

## Decisions reserved for the main framing


The main framing still needs a later editorial decision about its central narrative and how much detail belongs there. The companions do not resolve that choice by treating the evidence-workflow proposal as an adopted replacement.

A future rewrite can choose how much of the original critique of RAG to retain, how prominently to introduce context-to-task alignment, and whether detailed evidence-workflow mechanics should remain in a dedicated companion. It should also decide whether the umbrella category is useful enough to carry throughout the text.

Whichever structure is chosen, the positive architectural argument should remain assessable: begin with the user's current purpose, construct appropriate inputs for the next operation, expose the basis and limitations of that context, and check the resulting outcome. RAG and agentic control can participate in that account without being treated as mutually exclusive system categories.
