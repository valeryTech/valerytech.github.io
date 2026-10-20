---
draft: false
toc: true
title: "Model of Context-Augmented Task Systems"
description: "Defines a shared domain model for context-augmented tasks, from interpreted needs and source representations through investigation state, context assessment, operations, and verified outcomes."
linkTitle: "Model of Context-Augmented Task Systems"
---
## Task, requirements, and operation

### User and user request


The **User** is the person or actor whose goal motivates the work. A **User Request** is an observable interaction through which that goal is expressed: a message, search phrase, API request, selected document, image, or application action.

A request can contain evidence, constraints, and useful state as well as instructions.

### Interpreted task


The **Interpreted Task** is the system's current account of what the user wants to accomplish. It includes the intended outcome, scope, constraints, and unresolved ambiguities. Interpretation can use the request, relevant prior work, application state, and clarification.

The task can be bounded, such as locating a record, or exploratory, such as discovering disagreements across notes. It is a revisable interpretation rather than a claim that the user's purpose is fully known. New evidence can reveal a mistaken assumption or help the user formulate a more useful question.

### Consuming operation


A **Consuming Operation** is the next operation for which working context is prepared. Its contract specifies its purpose, required inputs, acceptable form, relevant limits, and expected result.

Examples include reading source passages, comparing policies, extracting fields, calculating a value, generating a query, or preparing a proposed action. A person, deterministic software, or a model can perform the operation. A generator is one kind of consumer.

A whole task can contain several operations with different context needs. A comparison may need both governing policies and their effective dates; formatting its result may need only the verified comparison and presentation requirements.

### Task context requirement


A **Task Context Requirement** specifies what information, evidence, state, or constraints must be available or checked for the current task and operation. It records the reason for the need and, where possible, how adequacy will be judged.

Requirements may concern factual support, source scope, authority, freshness, provenance, permissions, contradictory material, or the consumer's input format. Resource limits constrain how the system can satisfy them. Requirements can begin incomplete and be refined during investigation.

For a policy comparison, requirements might include:

| Requirement | Basis for assessment |
| --- | --- |
| Identify the two applicable policy revisions | Document identity, revision, scope, and effective dates. |
| Compare the relevant obligations and exceptions | Original clauses with enough surrounding context to interpret them. |
| Explain unresolved differences | Conflicting provisions and the basis, if any, for deciding which governs. |
| Produce a cited comparison | Source locators preserved in the consumer's actual inputs. |

A requirement is not itself evidence that it has been satisfied. A statement such as “use current policy” needs a source and a check appropriate to the task.

## Sources, access, and representations

### Context and context sources


**Context** is information made available to support interpretation, reasoning, action, verification, or presentation. It can include source material, observations, task instructions, user constraints, and earlier results.

A **Context Source** is a resource from which information can be obtained: a corpus, database, external service, application state, log, policy system, or person. A source is not automatically accurate or governing because it is the original location of a statement.

An **Acquisition Interface** is the means of accessing a source: search, a database query, an API request, state inspection, calculation, or clarification. Different interfaces can expose the same source; one interface can expose several kinds of information.

Tools and services are capabilities, not information artifacts. Their descriptions, availability, constraints, and returned observations can enter context. Permission to perform an action must still be enforced by the executing system. Merely including a permission statement in context does not authorize execution.

### Corpus and representation


A **Corpus** is a collection of source material available for search. A **Retrieval Representation** is a searchable view of that material, such as a passage, embedding, normalized identifier field, table object, summary, or generated question linked to its source.

A representation can expose an aspect of a source while omitting or changing other aspects. Generated or extracted views are derived artifacts; their contents do not become verified facts merely by being indexed.

Representation design usually addresses a class of tasks at design time. At runtime, the system selects among available sources, representations, and routes. A new request does not necessarily require rebuilding the corpus or creating another representation.

### Retrieval query and query representation


A **Retrieval Query** is a source-directed expression used to seek information. A **Query Representation** is the form used by a matching interface, such as terms, a vector, entity identifiers, or filters.

The request, interpreted task, context requirement, query, and query representation have distinct roles. They can nevertheless contain identical text. An exact identifier request can pass directly to an appropriate lookup interface. Rewriting is justified when it improves the source-directed expression, rather than being a mandatory stage.

**Representation Alignment** is the retrieval-specific fit among the information need, searchable views, and matching strategy, including recovery of the source material needed for interpretation. It contributes to context-to-task alignment but does not establish source authority, context sufficiency, or task success by itself.

## Acquisition and investigation state

### Context access planning


**Context Access Planning** decides where and how information should be sought. It selects sources, interfaces, representations, query strategies, filters, limits, and fallbacks using the current requirements and available state.

Its output is a plan or a set of acquisition decisions. Planning may be a fixed rule, a person's choice, or a model-backed operation. It can be combined with acquisition in one implementation while keeping the decision and its result distinguishable.

### Context acquisition


**Context Acquisition** obtains information through the selected interfaces. Its output is **Acquired Context**: retrieved hits, database rows, API responses, observations, calculated values, or user clarifications.

Acquired context may be incomplete, stale, conflicting, irrelevant, or in a form the next operation cannot use. An empty search result records what that acquisition returned; it does not establish that the information does not exist.

A read operation can acquire context. An operation that updates a record or sends a request with an external effect also belongs to execution. Its response can provide new context, but describing the operation as acquisition must not hide its effects or authorization requirements.

### Investigation state


For work that develops over multiple operations, **Investigation State** retains the current inquiry and enough of its history to inspect, revise, or resume the work. It can contain:

| Object | Meaning |
| --- | --- |
| Requirement revision | A dated or versioned account of what the current operation needs. |
| Acquisition run | The actual query or request, source scope, parameters, versions, and returned candidates. |
| Candidate | An item made available for inspection, with its acquisition route and source reference. |
| Selection | A recorded choice to retain an item for a purpose. |
| Judgment | An assessment of relevance, support, authority, or exclusion, with its target and basis. |
| Claim | A proposition under examination, with links to supporting, qualifying, or conflicting material. |
| Gap or conflict | A requirement without adequate support, an unresolved disagreement, or an acquisition limitation. |
| Operation run | The inputs, actor or method, configuration, result, and relevant dependencies of an operation. |

Collection is distinct from accepting material as evidence for a claim. A candidate can be collected before its authority is known; counterevidence can be retained because it challenges a conclusion.

These are optional modeling elements according to the task. A direct lookup can use ordinary request and result records. A sustained investigation may require explicit selections, judgments, claims, and dependencies. The model does not prescribe a workflow engine or a universal storage schema.

### Source identity and provenance


A source reference identifies the material actually observed. For text, this can be a document identity, revision, and exact span. For a record, it can be a resource key and version. For live state, it may require a captured value and observation time when no stable revision is available.

Retain the acquisition route separately from source identity. Several queries can recover the same occurrence; identical text can occur in different locations. Equal, contained, and partially overlapping spans need distinct relationships. Unknown or stale coordinates remain unresolved.

Provenance records where material came from and how it was transformed. Authority concerns whether it should govern this task. Precise provenance does not settle authority or factual truth.

## Context assembly and working context


**Context Assembly** is the selection and structuring of available material into **Working Context** for a named consuming operation. Acquisition obtains material; assembly determines what the operation actually receives. Available material can come from the request, investigation state, earlier results, or new acquisition.

**Context Selection** chooses material according to the task and operation. **Context Structuring** makes the selected material usable through ordering, grouping, normalization, citation, compression, or explicit marking of contradictions and uncertainty.

Working context is a bounded input view. It can include source passages, records, requirements, relevant judgments, unresolved issues, and instructions. It need not contain every candidate or every earlier conversation turn.

For an inspectable run, retain an input snapshot or manifest sufficient to identify the actual content, ordering, versions, and transformations consumed. A reference to a mutable document without its observed revision may be insufficient. A summary should remain distinguishable from original source text.

Assembly is not the whole task lifecycle. It does not include task execution or outcome verification. Nor is minimal size an unconditional goal: useful detail, qualifications, or deliberate redundancy may be necessary. The aim is adequate, usable context within the operation's limits.

## Context assessment


**Context Assessment** evaluates a working-context snapshot against a stated requirement revision and consuming-operation contract. It produces findings, unresolved issues, and a basis for deciding whether to proceed, revise, acquire more information, or clarify the task.

| Dimension | Assessment question |
| --- | --- |
| Support | Which requirements have relevant supporting material, and what is the basis for accepting it? |
| Scope | Which sources and candidate pools were considered, and what material remains unavailable or unreviewed? |
| Authority and freshness | Are the observations applicable, current enough, and drawn from appropriate sources? |
| Integrity | Can material be traced to its source, with qualifications and transformations preserved? |
| Conflict and uncertainty | What contradicts, limits, or weakens the proposed interpretation? |
| Permitted use | Is the information eligible for this use under the applicable access and use constraints? |
| Consumer fit | Does the operation receive the necessary structure, detail, ordering, and instructions within its limits? |

An assessment should refer to the requirement, relevant material, method or reviewer, findings, and remaining uncertainty. Requirement status can distinguish supported, partly supported, unresolved, and contradicted; unavailable material is a limitation on the assessment rather than evidence for a conclusion.

Assessment can occur during acquisition and review as well as after assembly. The distinction is a responsibility, not a mandatory additional model call. A deterministic version check can establish one condition; evaluating conflicting provisions may require expert judgment. No single score establishes all dimensions of alignment.

A decision to proceed is scoped to the current operation and accepted uncertainty. Budget exhaustion, pool exhaustion, adequate support, required clarification, and a user's decision to stop are different stopping reasons. A discovery result can be useful while substantive questions remain open.

Coverage also needs a declared denominator. Index coverage, screening coverage, selected-source-range coverage, requirement support, and judged retrieval recall answer different questions. None is a general proof of completeness.

## Operations, results, and outcomes


The **Result** is the direct output of an operation. The **Outcome** is its contribution to the user's task, including any verified state change or useful discovery. Producing an artifact and achieving the intended outcome can require different checks.

| Consumer | Working context | Result and outcome checks |
| --- | --- | --- |
| Person inspecting sources | Located passages, reading context, scope, and unresolved questions | Can the person find and inspect useful material for the inquiry? |
| Deterministic calculation | Observed values, units, and calculation parameters | Was the calculation performed correctly on the intended values? |
| Generative model | Selected material, requirements, and instructions | Is the output supported and appropriate for its intended use? |
| Action executor | Validated instruction, identifiers, current state, and applicable constraints | Was the operation authorized, executed, and its resulting state verified? |

Generation can produce prose, structured fields, queries, plans, code, or proposed tool calls. Generated instructions may then need validation and execution. The generic model does not require generation before another operation can consume working context.

**Outcome Verification** checks the result or observed state against the task's success criteria. It can reveal missing context, misuse of adequate context, an execution failure, or a mistaken task interpretation. Context assessment and outcome verification therefore remain separate responsibilities.

## Operation contracts and feedback


The following contracts are an analysis vocabulary. A small implementation can combine several rows; an investigation can repeat or branch them.

| Operation | Main inputs | Direct outputs |
| --- | --- | --- |
| Interpret task | Request and relevant existing context | Interpreted task, ambiguities, and current purpose. |
| Derive requirements | Task and consuming-operation contract | Context requirements and assessment criteria. |
| Plan access | Requirements, available sources, representations, and current gaps | Acquisition decisions. |
| Acquire | Source-directed requests and access decisions | Acquired context and acquisition-run information. |
| Inspect and review | Candidates, source context, and requirements | Judgments, selections, claims, or questions. |
| Assemble | Requirements, available material, and consumer contract | Working-context snapshot or manifest. |
| Assess context | Requirements, working context, scope, and checks | Findings, gaps, conflicts, and a scoped adequacy judgment. |
| Choose next action | Assessment, current state, and resource limits | Continue, clarify, revise, execute, or stop with a reason. |
| Perform operation | Declared working-context inputs and applicable controls | Result and, where relevant, observed external effects. |
| Verify outcome | Result, observed state, task, and success criteria | Verification findings and further work. |

Feedback can revise the task, requirements, acquisition route, selections, assembly, or the consuming operation. For example:

- An ambiguous identifier can require clarification before lookup.
- A candidate can reveal terminology that justifies another search.
- A missing exception can require expansion to the parent section.
- Conflicting policies can require another source or an explicit unresolved result.
- A failed calculation can require corrected units rather than more retrieval.
- A useful discovery can complete the current task without synthesis.

Record dependencies at the level needed to understand invalidation. A source revision can invalidate a locator or freshness judgment. A requirement change can invalidate a support assessment. Changing an operation's input snapshot makes its old result a result of different inputs. Preserve earlier results when useful while marking their applicability accurately.

## Design-time evaluation


Runtime assessment asks whether particular inputs are adequate for the current operation. Design-time evaluation asks how reliably a method behaves across stated tasks, sources, versions, and conditions.

Evaluate acquisition with reviewed relevance judgments and route comparisons; evaluate mapping with source-recovery checks; evaluate assessment with reviewed support and conflict cases; evaluate execution against outcomes. Include relevant latency, cost, and human correction effort. A valid contract or successful run alone does not establish semantic quality.

Use this model in proportion to the task: a direct lookup needs a small set of checks, while an evolving investigation needs enough explicit state to preserve its evidence decisions and unresolved questions.
