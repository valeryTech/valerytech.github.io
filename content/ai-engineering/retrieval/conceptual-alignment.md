---
draft: false
toc: true
title: "Conceptual Alignment and Contract Discipline in RAG Systems"
description: "A request can serve unchanged as a query while the roles remain distinct. Explicit input and output contracts expose who interprets the task, selects evidence, judges context, and checks the outcome."
linkTitle: "RAG Concepts and Contracts"
---

Retrieval systems become difficult to reason about when the same term names different artifacts or when a component's interface hides the responsibilities it performs. A request, task interpretation, context requirement, retrieval query, and query representation can be closely related without having the same role.

Conceptual alignment means that these roles and their contracts have consistent meanings across the system. **Context-to-task alignment** concerns a different question: whether working context fits the requirements of the current task and consuming operation. Explicit contracts make that fit easier to assess and failures easier to locate.

The [domain model]({{< ref "ai-engineering/retrieval/model" >}}) defines the shared vocabulary. The [evidence-workflow proposal]({{< ref "ai-engineering/retrieval/reframing-proposed" >}}) applies it to evolving investigations, and [retrieval design]({{< ref "ai-engineering/retrieval/retrieval-design" >}}) describes how to inspect and compare implementations.

## Distinguish roles before choosing boundaries


| Artifact or contract | Role |
| --- | --- |
| User request | Observable expression of a need, including any supplied material and constraints. |
| Interpreted task | Current, revisable account of what the user wants to accomplish. |
| Consuming-operation contract | Purpose, required inputs, usable form, limits, and expected result of the next operation. |
| Task context requirement | What information, evidence, state, or constraints must be available or checked for that task and operation. |
| Retrieval query | Source-directed expression used to seek information. |
| Query representation | Terms, vector, identifiers, filters, or another form accepted by a matching interface. |
| Acquired context | Material returned by acquisition, before deciding what the operation should consume. |
| Working context | Selected and structured inputs for the named consuming operation. |
| Context assessment | Findings about those inputs against stated requirements, including gaps and uncertainty. |
| Operation result | Direct output to be checked for its contribution to the user's task. |

These distinctions do not require separate services, model calls, or persistent objects. A small implementation can carry several roles in one record. What matters is being able to identify the relevant assumptions, decisions, outputs, and checks.

## Identical text can serve different roles


Suppose the user requests policy `SEC-17B`. If the task is exact lookup and the source supports it, `SEC-17B` can be both the request text and retrieval query. The system can apply a fixed identifier rule without rewriting the text or invoking a model to restate the task.

The roles are still different. The request expresses the user's need; the query instructs a selected source interface. The route needs to distinguish an exact identifier match from a similar title and expose applicable revision or scope information where the task requires it.

For "What do my notes contain about DSLs?", the request may also be a useful initial query. Inspection can then reveal aliases, related concepts, or disagreements that justify further searches. An expansion adds an interpretation; it should remain inspectable and revisable.

Reusing request text is therefore not inherently a failure, and transforming it does not inherently improve retrieval. The failure is allowing the choice of query, source, scope, or matching rule to escape scrutiny when it materially affects task success.

## Place responsibilities deliberately


A narrow retrieval component can accept source-directed queries and return candidates. Task interpretation, requirement derivation, and access planning then belong to callers or other components. A broader search component can accept a request and perform some or all of those responsibilities internally.

Both boundaries can be useful. Naming a component "RAG" or "retrieval" does not determine its contract. State what it accepts, what it decides, and what it returns.

| Accepted input | Responsibility implied by the boundary |
| --- | --- |
| User request | Interpret or apply a declared task assumption; resolve relevant ambiguity when needed. |
| Interpreted task | Derive or receive the context needs of the intended operation. |
| Context requirement | Decide or receive how the need will be addressed across available sources. |
| Retrieval query | Apply the declared source scope, matching, filtering, and result limits. |
| Query representation | Operate the lower-level matching interface and preserve result meaning. |
| Acquired material | Select and structure it if the component promises to return working context. |

One component can accept several input forms if the resulting responsibilities are explicit. A component returning candidates should not imply that it has established evidential support. A component returning assembled context should identify the inputs and transformations it selected, along with any promised assessment.

## Separate acquisition, assembly, assessment, and execution


**Context Acquisition** obtains material. **Context Assembly** selects and structures available material into working context. **Context Assessment** evaluates that working context against requirements and the consumer's contract. **Outcome Verification** checks what happened when an operation used it.

These responsibilities can be interleaved or implemented together. Their claims remain distinct. Finding the intended document does not establish that the selected excerpt includes its exceptions. Preserving the excerpt does not establish that a generated comparison uses it correctly. Producing a valid instruction does not establish that an executor performed it successfully.

The consumer can be a person, deterministic software, or a model. Generation is a specific operation whose output can be prose, a structured object, a query, a plan, or a proposed action. The broader contract should not require every useful operation to follow generation.

An interface that also changes external state must expose that execution responsibility. Tool descriptions and permission information can enter working context, while authorization and effect checks remain responsibilities of the executing system.

## Make feedback and provenance part of the contract


When an inquiry evolves, retain enough information to associate a result with its task interpretation, requirements, source observations, and actual inputs. A selection, generated summary, support judgment, and source occurrence have different identities and can become stale for different reasons.

Source provenance records origin and transformations. Authority concerns whether material should govern the task. A generated access question can locate a source without becoming evidence for its contents. Collection can precede assessment and can include counterevidence.

A context assessment should make clear which requirements it considered, what material supports its findings, what remains unresolved, and what scope or resource limits constrain the claim. The decision may be to acquire more, clarify, revise, proceed, or stop with a bounded result.

Keep checks proportional to the contract. Exact lookup can use direct checks; a sustained investigation can need explicit state and reviewed judgments. The engineering boundary is useful when it permits inspection, replacement, or diagnosis of a meaningful decision without confusing that decision with the whole task outcome.
