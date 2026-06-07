---
draft: false
toc: true
title: "Reframing"
linkTitle: "Reframing"
---
# Beyond RAG: Task-to-Context Alignment


Goal: We should stop treating RAG as the architecture and instead treat it as one pattern within task-to-context systems.

Retrieval-Augmented Generation is a useful research framing, but it is increasingly the wrong product framing. In production AI systems, the hard problem often sits upstream of generation:  determining what the user is trying to accomplish, what external knowledge or state is needed, how that context should be constructed, and what operation should be performed.

{{< callout context="note" title="Info" icon="outline/info-circle" >}}
RAG is not sufficient as a product architecture. It is one implementation pattern inside a broader class of context-augmented task systems.
{{< /callout >}}


The original 2020 RAG paper was useful, but narrow: it framed RAG as combining a pretrained seq2seq generator with non-parametric memory retrieved from a dense index, mainly to improve knowledge-intensive language generation and factuality. That is a model-centric NLP framing, not a full AI product framing.

## Task-To-Context Alignment


The broader problem behind RAG is **task-to-context alignment**. A user does not simply provide a query that needs documents; they express, often incompletely, a task they are trying to accomplish. The system must translate that task into a working context: the evidence, state, constraints, tools, representations, and verification signals required to produce a correct outcome. Retrieval is one way to acquire that context. Generation is one way to present the result. Neither is the full architecture.

In this framing, retrieval engineering becomes a subproblem of task-to-context alignment. Its role is representation alignment: matching the user's task-shaped information need to the corpus representations most likely to expose the right evidence.

## Problems

### The "G" is misleading


> "Generation" makes people over-focus on the final LLM answer.

This is the wrong architectural accent. It makes RAG sound like a system whose main purpose is to retrieve information and then produce text. That framing was reasonable in early RAG systems, where the visible output was usually an answer, summary, or passage grounded in retrieved documents. But in the modern AI product stack, generated text is often only the intermediate presentation layer. It is not necessarily the main product outcome.

Generation is also not always the desired output. Sometimes the system should classify a request, route a ticket, update a record, run a database query, call an API,  extract structured fields, compare evidence, trigger a workflow, ask a clarifying question, refuse an unsafe request, or escalate to a human. In these cases, generated prose may be incidental. The actual product outcome is an action, decision, transformation, or verified state change.

The "G" also misrepresents the role of the LLM. The LLM is not just the component that writes the final response. It can operate throughout the system as an interpreter, router, extractor, planner, compressor, verifier, and presenter. Treating it as "the generator" hides these roles and encourages a shallow pipeline model.

So the problem with "G" is not merely semantic. It changes how people think about system boundaries and contract. It makes RAG look like a language-generation pipeline, when the more general product problem is task completion using externally acquired context.

A better framing is:

> In production systems, retrieval is often not in service of generation alone. It is acquiring and structuring context in order to complete a task.

The "G" causes teams to confuse the surface form of the output with the purpose of the system. The goal is to understand the task, obtain the right knowledge, construct the right working context, choose the right operation, and verify that the outcome is correct, safe, and useful.

### Retrieval Has Been Flattened into Vector Search


A second problem with the RAG framing is that it often makes retrieval look like a new LLM-era implementation detail. In practice, retrieval belongs to the broader discipline of Information Retrieval: indexing, ranking, query understanding, relevance, recall, precision, metadata, filtering, freshness, corpus design, and evaluation.

That distinction matters. Mature retrieval systems are not just mechanisms for finding text that is semantically similar to a query. They are evaluated, observable, task-specific systems for selecting the right evidence under real constraints. A retrieval layer must understand what information is needed, where it should come from, how it should be ranked, which sources are allowed, how fresh the evidence must be, and how success will be measured.

### Vector Search Is Not a Retrieval Architecture


Many early RAG systems reduced retrieval to a simplified pipeline: split documents into chunks, embed the chunks, store them in a vector database, retrieve the top-k results, append them to the prompt, and generate an answer.

That pattern is useful, but it is not a complete retrieval architecture. It becomes fragile when it is treated as the whole retrieval layer rather than one component inside a broader system.

A production retrieval layer may require lexical search, semantic search, metadata filtering, graph traversal, SQL queries, API calls, access-control checks, freshness policies, reranking, source authority rules, and explicit evaluation. Better embeddings and vector databases can improve part of the system, but they do not remove the need to design retrieval as a constrained, observable, evaluated workflow.

### Many RAG Failures Are Context-Selection Failures


In production, many apparent "RAG failures" are not generation failures. They are context-selection failures.

The system retrieves the wrong chunk. It misses the relevant document. It ranks generic content above specific content. It ignores metadata, permissions, recency, source authority, or document structure. It retrieves duplicated, stale, or contradictory evidence. It has no retrieval test set, no recall measurement, and no observability into why a particular context was selected.

Because the LLM produces the visible answer, the model often receives the blame. But in many cases, the failure occurred earlier: the system constructed a weak evidence set, selected the wrong sources, or failed to determine what kind of information the task required. The model may be answering from context that was already broken.

### Context Acquisition Is Broader Than Retrieval


Even when retrieval is designed well, "retrieval" is still too narrow a product framing.

The system does not always need to retrieve documents. It may need to query a database, call an API, inspect user state, read application state, check permissions, evaluate policy, use logs, traverse a graph, perform a calculation, inspect tool output, or ask a human for clarification.

In other words, the general problem is not retrieval. The general problem is context acquisition: determining what external knowledge, state, constraints, and evidence are needed for the task, then constructing that context in a form the system can use.

Retrieval is one context-acquisition method. It is not the architecture.

### The LLM Is a Multi-Role System Component


The Large Language Model (LLM) is not strictly a generator; it could be a general-purpose reasoning, translation, orchestration, compression, and synthesis component. The LLM can appear in many places, not just the final answer step.

A more accurate system view:

```text
User problem
  ↓
Intent / task interpretation
  ↓
Knowledge need analysis
  ↓
Source selection
  ↓
Retrieval / tool use / database query / API call
  ↓
Context structuring
  ↓
Reasoning / planning / execution graph
  ↓
Verification / grounding / policy checks
  ↓
User-facing result or action
```


The LLM may be used in any of these nodes:

|System stage|Possible LLM role|
|---|---|
|Query understanding|intent detection, ambiguity detection, slot extraction, query decomposition|
|Source routing|decide whether to use search, SQL, vector index, graph, CRM, logs, codebase, API|
|Retrieval improvement|query rewriting, hypothetical document generation, semantic expansion, reranking support|
|Document processing|chunking, entity extraction, metadata generation, taxonomy mapping|
|Knowledge enrichment|graph construction, relationship extraction, event extraction, schema alignment|
|Context construction|summarization, compression, contradiction detection, evidence packing|
|Planning|dynamic workflow construction, tool selection, subtask sequencing|
|Execution|API call planning, code generation, structured transformations|
|Verification|citation checking, answer-grounding checks, consistency checks|
|Presentation|final answer, report, UI text, table, explanation, next-best action|

## Toward a Better Mental Model


Because (at least naive) "RAG" implies a linear `Fetch -> Append -> Create` workflow, it fails to capture the broader system architectural boundaries and the shift from answer generation to task completion.

### From Retrieval-First to Task-First Context Construction


RAG should be understood not as "retrieval added to generation," but as one implementation of a broader product pattern: constructing task-relevant context from external knowledge so an AI system can complete user JTBD.

> The product goal is not generation quality in isolation, but task success.

The common mistake: starting with a retriever, vector store, chunks, or prompt assembly pipeline. The system should begin with the user job: what the user is trying to accomplish, what knowledge or state is required, and what workflow is needed.

So the architectural view direction should be:

> The architecture should not be built around the prompt, the retriever, the vector store, or the LLM. It should be built around the user task and the knowledge workflow required to complete it.

## **Modularity as the Engineering Boundary**


Once RAG is reframed as task-relevant context construction, the system should not be designed as a single opaque chain. It should be decomposed into cohesive modules or components with explicit contracts.

This is not unique to AI systems. It is the standard software-engineering principle of modularity: separate responsibilities, minimize unnecessary coupling, and define interfaces that allow components to be changed, tested, evaluated, and operated independently.

Each module should have a clear contract. For example:

|Module|Contract|
|---|---|
|Task interpretation|Convert the user request into an explicit task, intent, constraints, and ambiguity set.|
|Source routing|Decide which sources are allowed and useful for the task.|
|Context acquisition|Retrieve, query, call tools, inspect state, or request clarification.|
|Evidence selection|Rank, filter, deduplicate, and choose the evidence that should enter working context.|
|Context structuring|Compress, normalize, cite, organize, and prepare context for downstream use.|
|Execution or reasoning|Perform the task using the constructed context.|
|Verification|Check grounding, permissions, policy, consistency, and outcome correctness.|
|Presentation|Return the result in the form the user or product workflow needs.|

## RAG retrieval engineering


> Within task-first context construction, retrieval engineering is representation alignment.

A retrieval system succeeds when it aligns three things: the user's intent (task-shaped information need), the representations of the source data, and the matching strategy between them.

Thus, the core responsibilities of an IR engineer are:

1. **Infer user intent (or task-shaped information need).** Determine what the user is trying to accomplish and what kind of evidence, facts, entities, records, or context would satisfy that need.
2. **Generate retrieval-ready representations.** Create searchable views of the corpus that expose the forms of information users need: chunks, summaries, entities, metadata, tables, synthetic questions, relationships, or structured fields.
3. **Match intent to the right representation.** Route the query to the representation and retrieval strategy most likely to produce useful evidence for the task.

This gives us a simple lens for analyzing retrieval systems: every system can be understood by how it predicts intent, how it represents data, and how it aligns the two at query time.

This three-part lens -- intent, representation, and matching -- provides a practical way to analyze retrieval systems within the broader task-to-context architecture. It shifts retrieval engineering away from tool choice and toward the design of representations and routing strategies that expose the evidence required for task success.

## (Possible) Factors in Retrieval System Design

### Retrieval Unit Design and User Expression


The raw corpus is rarely searchable in the representation users need. Source material is stored in one form, but users search through another: their own vocabulary, task context, domain knowledge, and implicit intent. Retrieval engineering therefore creates alternate searchable representations of the same corpus and matches each query to the representation most likely to expose the right evidence.

### User Task


Users are not just searching for text; they are trying to complete a task. They may want to find, verify, compare, summarize, decide, audit, troubleshoot, cite, or extract something. The same query can imply different tasks depending on context, and each task may require a different retrieval strategy. Retrieval design therefore has to ask not only what the user said, but what job the user is trying to accomplish.

### Latent Structure


Documents contain relevant information in many latent forms: entities, facts, tables, workflows, code names, business concepts, images, document types, relationships, metadata, dates, and versions. These forms may be present in the corpus but not directly searchable. Retrieval engineering has to identify which latent structures matter and expose them as explicit, searchable objects.

### Searchable Representation


Retrieval engineering is the work of creating intermediate representations that bridge the user's need and the raw corpus. Instead of treating the corpus as one flat text index, we can generate multiple views of the same source material: chunks, summaries, synthetic questions, extracted entities, normalized fields, table objects, metadata records, document categories, visual embeddings, or graph structures. Each representation makes a different aspect of the corpus searchable.

### Matching Strategy


Once intermediate representations exist, the system still has to match the user's intent to the right representation. Some needs are best served by keyword search, others by vector search, hybrid search, entity lookup, metadata filtering, table search, graph traversal, multimodal retrieval, or reranking. The matching strategy should follow the representation and the task, rather than assuming that one search method is enough for every query.

### Retrieval Orchestration


When a corpus has multiple representations and multiple indexes, retrieval becomes an orchestration problem. The system has to decide whether to search one index or many, whether to route or fan out the query, whether to retrieve in stages, and how to combine, filter, and rank the results. This orchestration layer is what connects user intent, evidence shape, searchable representations, and downstream task execution or result presentation.

## Terminology: From RAG to Context-Augmented Task Systems


The vocabulary around RAG is overloaded. Terms such as "retrieval," "generation," "context," "grounding," and "agents" are often used to describe different layers of the same system. This makes AI product architecture harder to reason about, because implementation patterns, system categories, runtime artifacts, and engineering responsibilities get collapsed into one vocabulary.

A clearer taxonomy should separate five things: the product objective, the broad system category, the design principle, the implementation pattern, and the internal system responsibilities.

| Level                   | Term                                                                     | Role                                                                                     |
| ----------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Product objective       | **Task completion**                                                      | The outcome the system is trying to achieve for the user                                 |
| Broad system category   | **Context-augmented task systems**                                       | AI systems that complete tasks by acquiring, structuring, and using external context     |
| Design principle        | **Task-first context construction**                                      | The method for designing these systems around the user task and its context requirements |
| Implementation pattern  | **RAG**                                                                  | A narrower retrieve-then-generate pattern within the broader category                    |
| Runtime artifact        | **Working context**                                                      | The structured information the system uses to reason, act, verify, or present a result   |
| System responsibilities | **Context acquisition, context structuring, verification, presentation** | The engineering functions required to construct and use working context                  |

### Context-Augmented Task Systems


A **context-augmented task system** is an AI system that completes a user task by acquiring, structuring, and using external context.

This is the broader architectural category that includes RAG. RAG describes one common implementation pattern: retrieve relevant information and use it to generate an answer. Context-augmented task systems describe the larger class of systems where task completion depends on the right knowledge, state, constraints, tools, and verification signals.

The defining requirement is constructed working context. The system needs information outside the model's parameters in order to perform the task correctly. That context may include retrieved documents, database rows, API responses, application state, user preferences, permissions, logs, policy rules, calculations, extracted entities, structured records, or human clarification.

The output depends on the task. In some cases, the result is a natural-language answer. In others, it may be a decision, classification, workflow step, structured object, updated record, refusal, escalation, or tool action.

RAG is one implementation shape within this category. Agentic systems are another. Workflow automation, decision-support systems, research assistants, customer-support copilots, code assistants, analytics agents, and enterprise knowledge systems may also fit when they rely on externally acquired context to complete tasks.

The central engineering question is:

> How does the system determine, acquire, structure, use, and verify the context required to complete the user's task?

This shifts the architectural boundary from individual components to the full context workflow. The model, prompt, retriever, vector database, tools, and verification layer become components inside a task-centered system. The design focus becomes reliable task completion through appropriate working context.

### Task-First Context Construction


**Task-first context construction** is the design principle for context-augmented task systems.

Instead of beginning with a retriever, vector store, prompt template, or model output, the system (or developer) begins with the user task. The first question is not "what should we retrieve?" but "what does the system need to know, inspect, verify, or do in order to complete this task correctly?"

This shifts the design center from retrieval mechanics to task requirements. A task may require documents, database rows, API responses, application state, user constraints, permissions, policy rules, calculations, or human clarification. These are not interchangeable pieces of text to append to a prompt. They are different forms of context with different authority, freshness, structure, and verification requirements.

Task-first context construction therefore has (should have) five core steps:

1. Interpret the user task, including intent, constraints, ambiguity, and desired outcome.
2. Determine what knowledge, state, evidence, tools, and verification signals are required.
3. Acquire the necessary context from the appropriate sources.
4. Structure that context into a working form the system can reason over or act on.
5. Execute the task and verify that the result is grounded, permitted, consistent, and useful.

In this framing, retrieval is not the starting point of the architecture. It is one context-acquisition method selected when the task requires information from searchable representations. The broader objective is to construct the right working context for the job the user is trying to accomplish.

The practical test is simple: if the constructed context is insufficient, stale, unauthorized, poorly structured, or mismatched to the task, the system will fail even if the model and prompt are strong. Task-first context construction makes context quality a function of task success, not just retrieval relevance.

### The Context Lifecycle


In context-augmented task systems, context is not just retrieved and appended to a prompt. It moves through a lifecycle: the system obtains candidate context, structures it into a working form, uses it to perform and verify the task, and presents the result in the appropriate format.

|Stage|Role|Examples|
|---|---|---|
|**Context acquisition**|Obtain the external knowledge, state, evidence, or constraints required by the task|Document retrieval, database queries, API calls, application-state inspection, permission checks, policy evaluation, log analysis, graph traversal, calculations, human clarification|
|**Context structuring**|Transform acquired material into usable working context|Summarization, compression, normalization, grouping, citation, field extraction, entity resolution, schema alignment, provenance preservation|
|**Working context**|Provide the structured information the system uses to reason, act, verify, or present a result|Selected passages, database rows, tool outputs, metadata, user constraints, policy rules, calculated values, extracted entities, compressed summaries|
|**Presentation**|Deliver the completed result to the user or downstream workflow|Natural-language answer, table, JSON object, chart, decision, citation set, API response, updated record, workflow step, refusal, escalation, next-best action|

This lifecycle separates the raw material the system obtains from the working context it actually uses. A retrieved passage, database row, API response, policy rule, and calculated value may all become part of the same working context, but they have different provenance, authority, freshness, and failure modes.

The objective is to construct context that is fit for the task. Acquisition determines what external material is available. Structuring makes that material usable. Working context supports reasoning, execution, and verification. Presentation determines how the completed result is delivered.

### Context Acquisition


**Context Acquisition** is the process of obtaining the external knowledge, state, evidence, or constraints required for the task.

Retrieval is a major form of context acquisition, especially when the system is selecting relevant information from indexed documents, records, or other searchable representations. But context acquisition is broader than retrieval. The system may also query a database, call an API, inspect application state, evaluate permissions or policy, read logs, traverse a graph, perform a calculation, or ask a human for clarification.

The context-acquisition component (ideally in the future) decides what sources are relevant, allowed, fresh enough, authoritative enough, and useful for the task.
