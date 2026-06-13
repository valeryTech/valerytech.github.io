---
draft: false
toc: true
title: "Model"
linkTitle: "Model"
---
# Model of Context-Augmented Task Systems


This ontology and models defines a systems-level view of context-augmented task execution. Its purpose is to separate concepts that are often collapsed in retrieval-augmented systems: the user's observable request, the task the system infers from that request, the context required to complete the task, and the source-directed queries or actions used to obtain that context.

The central premise is that context should be constructed around task completion, not around surface similarity between a user request and stored content. A user request is an observable product-layer event: a message, API request, button click, or other interaction by which the user asks for assistance. It may contain useful signals, but it is not itself the task, or the context requirement.

The system must therefore infer a task from the request, derive the task's context requirement, and then decide how that context should be acquired. In some cases this means retrieval from a corpus. In others, it may require database queries, API calls, application-state inspection, clarification from the user, etc.

This gives the core lifecycle:

```text
User Request
  → Task Interpretation
  → Task Context Requirement
  → Context Access Planning
  → Context Acquisition
  → Acquired Context
  → Context Assembly
  → Working Context
  → Downstream Consumer
  → Outcome
```

# Core Domain Model

## Product Layer


The broader product should be organized around task completion, while retrieval is one internal context-acquisition mechanism. The retrieval layer can use lexical search, vector search, metadata filtering, graph traversal, SQL queries, API calls, access-control checks, freshness policies, reranking, and other mechanisms depending on the task and source.

## User


The **User** is the actor whose goal gives the system a reason to retrieve or construct context.

## User Request


The **User Request** is the observable interaction by which a user expresses a desired task. It is what the product can directly observe at the interaction layer.

It may be:

```text
typed message
search phrase
voice command
button click
selected file
highlighted text
API request
image upload
```

## Task


The **Task** is what the user is trying to accomplish.

Examples:

```text
answer a question
find a record
verify a claim
summarize a document
debug a system
compare alternatives
make a decision
extract structured data
update a record
classify a request
produce a recommendation
refuse unsafe action
escalate to a human
```


The task is inferred from the user request. It is more fundamental than request or query because retrieval should serve task completion, not text similarity. Retrieval should target sufficient, trustworthy, bounded evidence for a downstream task, not merely similar documents.

### Task Lifecycle

## Task Context Requirement


A **Task Context Requirement** is the system's task-facing specification of the information, evidence, state, constraints, and verification signals required to complete a user task.

It is derived from the interpreted Task, not directly from the User Request. The User Request is the observable expression of what the user asks or does. The Task Context Requirement defines what the system must know, inspect, retrieve, verify, or obtain in order to complete the task correctly.

## Retrieval Query


A **Retrieval Query** is the source-directed expression of a Task Context Requirement.

## Query Representation(s)


The **Query Representation** is the searchable form of a retrieval query.

It may include:

```text
dense vector
sparse terms
entities
filters
subqueries
metadata constraints
```

## Representation Alignment


Representation Alignment is the retrieval-specific problem of matching a task-shaped information need to the searchable forms of source content.

The user request is not itself the retrieval query. The system first interprets the request into a Task, derives a Task Context Requirement, and then translates that requirement into one or more Retrieval Queries.

Representation Alignment asks whether those retrieval queries are matched against the right searchable representations.

A retrieval system is not well-designed merely because it embeds chunks and returns semantically similar passages. It is well-designed when its representations expose the kinds of evidence, facts, entities, records, and structures required by the task.

Representation Alignment has three parts:

1. Identify the task-shaped information need.
2. Design searchable representations that expose the needed evidence.
3. Choose the matching strategy that connects the need to the right representation.

The retrieval layer should therefore be evaluated by task utility, not by semantic similarity alone.

## RAG-specific: Corpus and Representations


The **corpus** is the source content available to the system that may contain information useful for a task. It is not inherently useful just because it exists; it becomes useful only when the system can expose the right parts of it for the user's task.

A **representation** is a searchable form of corpus content. Retrieval engineering creates representations that make different aspects of the corpus accessible: meaning, exact terms, entities, metadata, structure, relationships, freshness, authority, or summaries.

**Design goal:** derive the corpus model from the task, not from retrieval infrastructure.

When designing the corpus, start with the question:

> What must the system have, know, access, or verify to complete the task?

This leads to a cleaner conceptual model than starting from documents, chunks, embeddings, indexes, or vector stores. The corpus should be modeled around the kinds of task-relevant evidence, records, state, constraints, structure, freshness, authority, and verification signals the system needs to expose.

The design objective is not merely to store source content. It is to make the corpus representable and searchable in forms that align with user tasks.

### Representation Design


Representation Design is the process of deriving searchable access surfaces from source content so that different task-shaped information needs can reach the right evidence.

We could structure Representation Design around **what latent structure we want to expose**. See more in [Model Representation Design]({{< ref "ai-engineering/retrieval/model-representation-design" >}})

## Broad Acquisition: Context Sources


In the broader context-acquisition model, the corpus is only one kind of context source. A context source is any system, collection, state, or capability from which task-relevant context can be obtained.

Different context sources expose different acquisition interfaces. A corpus is accessed through retrieval. A database is accessed through queries. An API is accessed through calls. Application state is accessed through inspection. A policy system is accessed through evaluation. A human is accessed through clarification.

The system's task is not simply to retrieve from a corpus, but to decide which context sources are needed, how they should be accessed, and how the acquired context should be structured into working context for the task.

### 1. Context Source


A **Context Source** is anything the system can use to obtain task-relevant knowledge, evidence, state, constraints, tools, or verification signals.

> A Context Source is any system, collection, state, or capability from which task-relevant context can be obtained.

Examples:

```text
corpus
database
API
application state
user profile
permission system
policy engine
log system
code repository
calculator
human clarification
```


This is the broad analogue to "corpus."

```text
Corpus = a context source optimized for retrieval
API = a context source accessed through calls
Database = a context source accessed through queries
Application state = a context source accessed through inspection
Tool = a context source or capability accessed through invocation
Human = a context source accessed through clarification
```

### 2. Acquisition Interface


An **Acquisition Interface** is how the system accesses a context source.

Examples:

```text
retrieval query
SQL query
API call
tool invocation
state inspection
policy check
graph traversal
calculation
clarification question
```


This avoids calling everything a "tool." A database is not a tool in the same sense as a calculator, and an API is not the same as a corpus. But all of them expose context through an interface.

### 3. Acquired Context


**Acquired Context** is the raw context returned from a context source before it is structured into working context.

Examples:

```text
retrieved passage
database row
API response
permission decision
policy rule
log event
calculated value
user clarification
tool output
```


This keeps the lifecycle clean:

```text
Task Requirement
→ Context Source
→ Acquisition Interface
→ Acquired Context
→ Working Context
→ Outcome
```

### How this relates to RAG


For RAG:

```text
Context Source:        Corpus
Acquisition Interface: Retrieval query / search
Acquired Context:      Retrieved candidates or evidence
Working Context:       Selected passages packaged for the model
```


For a database-backed assistant:

```text
Context Source:        Database
Acquisition Interface: SQL query
Acquired Context:      Rows / aggregates
Working Context:       Structured data relevant to the task
```


For an API-backed workflow:

```text
Context Source:        External service
Acquisition Interface: API call
Acquired Context:      API response
Working Context:       Normalized state or result
```


For a policy check:

```text
Context Source:        Policy system
Acquisition Interface: Policy evaluation
Acquired Context:      Allow / deny / constraints
Working Context:       Permission or compliance constraint
```

## Context

### Purpose


Context is what the system needs beyond the User Request in order to complete a Task correctly. The central design question is:

> What must the system have, know, access, or verify to complete the Task?

This prevents context from being reduced to "text appended to a prompt." Context may include evidence, state, constraints, permissions, policy rules, tool outputs, database records, API responses, user-provided information, or verification signals.

### Context Access Planning


**Context Access Planning** is the process of deciding which **Context Sources**, **Acquisition Interfaces**, **Representations**, and constraints should be used to satisfy a **Task Context Requirement** before context is actually obtained.

It answers:

> Which context sources, acquisition interfaces, source representations, and constraints should be used to obtain the context required for this task?

This stage is upstream of **Context Acquisition**. It does not retrieve, query, call, inspect, or evaluate sources directly. Instead, it determines how acquisition should proceed.

Context Access Planning may decide:

```text
which Context Sources are relevant
which Acquisition Interfaces should be used
which source representations should be searched, queried, or inspected
which filters, constraints, or policies should apply
which acquisition paths should be attempted first
which fallback paths should be available
```


This distinction matters because choosing a source is not enough. A single source may expose multiple representations or access surfaces.

For example, a corpus may expose:

```text
lexical index
dense vector representation
hybrid search
entity index
metadata filters
document hierarchy
table objects
graph representation
section summaries
freshness or authority metadata
```


A database may expose:

```text
tables
views
schemas
indexes
stored procedures
aggregates
row-level permissions
```


An API may expose:

```text
endpoints
query parameters
resource identifiers
pagination
authorization scopes
freshness guarantees
rate limits
```


Context Access Planning therefore resolves a task-facing context requirement into acquisition-facing decisions about access.

```text
Task Context Requirement
  → Context Access Planning
  → Context Acquisition
```


Context Access Planning may specify:

```text
selected Context Sources
selected Acquisition Interfaces
selected Source Representations
query or call strategy
required filters
permission constraints
freshness constraints
authority constraints
cost or latency constraints
fallback strategy
```


For RAG, Context Access Planning may decide that the system should search a particular corpus using hybrid retrieval over passage chunks, entity metadata, and freshness filters.

For a database-backed assistant, it may decide that the system should query a particular table or view using a schema-aware query.

For an API-backed workflow, it may decide that the system should call a specific endpoint with selected parameters and authorization scope.

For an application-state task, it may decide that the system should inspect current UI state, selected objects, session history, or user permissions.

Context Access Planning is broader than retrieval planning. Retrieval planning is one case where the selected context source is a corpus and the selected acquisition interface is retrieval. In broader context-augmented task systems, access planning may involve retrieval, database querying, API calling, application-state inspection, policy evaluation, calculation, or clarification.

The boundary is:

| Stage                        | Responsibility                                                                |
| ---------------------------- | ----------------------------------------------------------------------------- |
| **Task Context Requirement** | Defines what the system needs to know, verify, inspect, or obtain             |
| **Context Access Planning**  | Decides where and how that context should be sought                           |
| **Context Acquisition**      | Obtains raw context from the selected sources through the selected interfaces |
| **Context Assembly**     | Selects and structures acquired context into Working Context                  |

Context Access Planning can fail even when the Task Context Requirement is correct. Failure modes include:

```text
selecting the wrong source
selecting the wrong representation of the right source
using semantic retrieval when exact-match lookup is required
using stale representations when freshness is required
omitting metadata filters needed for authority or permissions
querying a broad corpus when a structured database is authoritative
calling an API when cached state is sufficient
asking the user for clarification when the answer is already available
```


A good Context Access Planning result is:

```text
task-aligned
source-aware
representation-aware
permission-safe
freshness-aware
authority-aware
cost-aware
latency-aware
fallback-capable
```


In this ontology, Context Access Planning is the canonical term for deciding how the task's context requirement should be operationalized across available sources, interfaces, representations, and constraints.

### Context Acquisition


**Context Acquisition** is the system functionality of obtaining context required by the **Task Context Requirement**.

It answers:

> What does the system need to obtain before it can construct Working Context for this Task?

In RAG, Context Acquisition usually takes the form of **retrieval** from a **Corpus**. The retrieval subsystem translates the Task Context Requirement into one or more **Retrieval Queries**, searches Corpus Representations, and returns retrieved candidates.

In broader context-augmented task systems, the same responsibility may involve querying a database, calling an API, inspecting application state, checking permissions, evaluating policy, reading logs, running a calculation, invoking a tool, or asking the user for clarification.

The input to Context Acquisition is the **Task Context Requirement**, as constrained by **Context Access Planning** decisions.

The output is **Acquired Context**.

Acquired Context may include:

```text
retrieved candidates
database rows
API responses
permission results
policy decisions
application state
log entries
calculated values
tool outputs
user clarifications
```


Acquired Context is not yet Working Context. It is the context the system has obtained, but it may still be incomplete, redundant, stale, conflicting, too detailed, or only partially relevant.

The next stages decide what to keep and how to make it usable:

```text
Acquired Context
  → Context Selection
  → Context Structuring
  → Working Context
```


The boundary is important:

| Stage                   | Responsibility                                                               |
| ----------------------- | ---------------------------------------------------------------------------- |
| **Context Acquisition** | Obtains possible context from Context Sources                                |
| **Context Selection**   | Decides which Acquired Context is useful for the Task                        |
| **Context Structuring** | Prepares selected context for downstream use                                 |
| **Working Context**     | The selected and structured context actually used by the downstream consumer |

The purpose of Context Acquisition is not to obtain as much context as possible. It is to obtain context likely to satisfy the Task Context Requirement under the relevant constraints: permission, authority, freshness, cost, latency, and expected usefulness.

### Related terminology


Different research and engineering traditions name parts of Context Acquisition differently:

| Term                             | Scope                                                    | Use in this ontology                                                    |
| -------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Retrieval**                    | Finding relevant items from a Corpus or index            | RAG-specific form of Context Acquisition                                |
| **Information Retrieval**        | Discipline of search, indexing, ranking, and evaluation  | Background discipline for retrieval systems                             |
| **External knowledge retrieval** | Retrieving knowledge outside model parameters            | RAG-specific acquisition from documents, memory, or knowledge bases     |
| **Context retrieval**            | Retrieving relevant context items                        | Useful when acquisition is retrieval-shaped                             |
| **Tool use**                     | Using external tools, APIs, calculators, or services     | One mechanism of Context Acquisition                                    |
| **Tool invocation**              | Calling a specific tool                                  | Low-level form of acquiring tool output                                 |
| **API calling**                  | Calling external or internal services                    | One mechanism of Context Acquisition                                    |
| **Action**                       | Agent interaction with an environment or external system | Broader than acquisition; may obtain context or change state            |
| **Information access**           | Accessing information resources                          | Broad but less precise than Context Acquisition                         |
| **Context Access Planning**     | Deciding which Context Sources, interfaces, and representations to use | Upstream of Context Acquisition                            |
| **Context Assembly**         | Selecting and structuring context into Working Context   | Broader lifecycle that includes acquisition, selection, and structuring |

In this ontology, **Context Acquisition** is the umbrella term. Specific mechanisms should be named directly when useful:

```text
Context Acquisition
  ├─ Retrieval
  ├─ Querying
  ├─ API calling
  ├─ Tool invocation
  ├─ State inspection
  ├─ Policy or permission evaluation
  ├─ Calculation
  └─ Clarification
```

### Acquired Context


**Acquired Context** is the raw result obtained from a Context Source.

Examples:

```text
retrieved passages
database rows
API responses
permission results
policy decisions
log events
calculated values
user clarifications
tool outputs
```


Acquired Context is not necessarily ready to use. It may be incomplete, redundant, untrusted, stale, too detailed, or mismatched to the Task Context Requirement.

### Context Assembly


**Context Assembly** is the post-acquisition process that transforms **Acquired Context** into **Working Context**. It is downstream of **Context Acquisition** and upstream of the **Downstream Consumer**.

Context Assembly has two main stages:

**Context Selection** decides which Acquired Context should be kept for the task. It determines which evidence, records, tool outputs, policy rules, state, or source results are relevant, trusted, permitted, and useful.

**Context Structuring** prepares the selected context for downstream use. It may involve normalization, summarization, compression, deduplication, ordering, citation, schema alignment, entity resolution, provenance preservation, and contradiction marking.

Useful Working Context is:

```text
sufficient
minimal
non-redundant
well-ordered
source-grounded
permission-safe
fresh enough
authority-aware
budget-compatible
consumer-ready
contradiction-aware
```


Context Assembly can fail even when Context Acquisition succeeds. The system may obtain the right context items but still produce poor Working Context by selecting the wrong subset, excluding decisive evidence, losing provenance, over-compressing, under-compressing, ordering evidence poorly, or formatting the context in a form the downstream consumer cannot use.

The goal is not only to reduce size. The goal is to make context usable for reasoning, action, verification, or presentation.

### Working Context


**Working Context** is the selected and structured context passed to a downstream consumer. Working Context is the endpoint of Context Assembly. It is the artifact the system gives to the component that will perform the next operation.

### Generator and Output Consumer


After **Working Context** is constructed, it is consumed by a downstream component. In many systems, the first downstream component is a **Generator**. A **Generator** is a component that uses Working Context to produce a **Generated Output**.

```text
Working Context
  → Generator
  → Generated Output
```


The Generated Output may be the final user-facing answer, but it may also be an intermediate artifact intended for another system.

Examples of Generated Output include:

```text
natural-language answer
summary
classification
structured object
SQL query
API request
tool call
code patch
execution plan
workflow instruction
refusal
clarification request
```


A second component may then consume the Generated Output. An **Output Consumer** is the component, system, or actor that receives and uses the Generated Output.

Examples:

```text
user
user interface
agent runner
tool executor
SQL engine
workflow engine
API gateway
database
validator
policy checker
another model
external system
```


This gives the downstream lifecycle:

```text
Working Context
  → Generator
  → Generated Output
  → Output Consumer
  → Outcome
```


The distinction is important because generation quality and outcome quality are not the same.

- A Generator may produce a valid SQL query, but the SQL engine may reject it.
- A Generator may produce a tool call, but the tool runner may fail.
- A Generator may produce a plausible plan, but the agent may execute it incorrectly.
- A Generator may produce a correct answer, but the user interface may omit citations or format it poorly.

So the broader system should distinguish:

```text
Working Context quality
Generated Output quality
Output Consumer behavior
Final Outcome utility
```


In simple RAG, the Output Consumer may be the user or user interface, and the Generated Output is the answer. In agentic or workflow systems, the Generated Output is often an intermediate instruction consumed by another component before a final Outcome exists.

### Outcome, Evaluation, and Feedback


The broader lifecycle does not end at Working Context.

After Working Context is consumed, the system produces an **Outcome**. The Outcome may be:

```text
answer
decision
classification
record update
API call
workflow step
structured object
refusal
escalation
clarification request
```


The Outcome is evaluated by task utility: whether it is correct, grounded, permitted, consistent, fresh enough, and useful.

Feedback from the Outcome can improve future source selection, retrieval, context acquisition, context selection, context structuring, representations, and evaluation.

# Process-Centered Modeling Scheme


Each system operation should be modeled as a process with typed inputs, used resources, direct outputs, and derived artifacts.

```text
Process:
  <process name>

Input:
  <artifact or state consumed by the process>

Uses:
  <component, source, interface, representation, policy, or constraint used by the process>
  <non-exhaustive, non-formal influences on the process>

Output:
  <artifact directly produced by the process>

Derived artifact:
  <artifact inferred, specified, or made available from the output>
```

### Task Interpretation

```text
Process:
  Task Interpretation

Input:
  User Request

Uses (optional, later):
  User Profile
  Session State
  Product State
  Domain Assumptions
  Safety Policy

Output:
  Interpreted Task

Derived artifact:
  Task Context Requirement
```

### Context Access Planning

```text
Process:
  Context Access Planning

Input:
  Task Context Requirement

Uses:
  available context sources  
  available acquisition interfaces  
  available representations  
  task constraints

Constrains:
  Context Acquisition
```


Context Access Planning preserves the conceptual distinction between deciding where and how context should be sought and actually obtaining context. A real system may implement planning and acquisition as separate components or collapse them into a single source-specific path.

### Context Acquisition

```text
Process:
  Context Acquisition

Input:
  Task Context Requirement
  Context Access Planning decisions

Uses:
  Context Source
  Acquisition Interface
  Representation(s)
  Acquisition Mechanism: Retrieval Query / SQL Query / API Call / Tool Invocation / etc.

Output:
  Acquired Context
```

### Context Assembly

```
Process:
  Context Assembly

Input:
  Acquired Context

Uses:
	Task Context Requirement  
	Acquired Context  
	available source metadata  
	downstream format requirements  
	task constraints

Output:
  Working Context

Derived artifact:
  Evidence Set
```

### Generation

```text
Process:
  Generation

Performed by:
  Generator

Input:
  Working Context

May use / consider:
  output requirements
  user-facing instructions
  downstream consumer expectations
  safety constraints
  formatting constraints

Output:
  Generated Output

Derived artifact:
  None required
```


Generated Output = an artifact produced by a Generator from Working Context.

```
It may be:
  natural-language answer
  summary
  classification
  structured object
  SQL query
  API request
  tool call
  code patch
  execution instruction
  refusal
  clarification request
```

### Execution

```text
Process:
  Execution

Input:
  Generated Output

Uses:
  Output Consumer
  Tool Executor
  API Gateway
  SQL Engine
  Workflow Engine
  Permission System

Output:
  Execution Result

Derived artifact:
  Outcome
```

### Evaluation

```text
Process:
  Evaluation

Input:
  Outcome

Uses:
  Success Criteria
  Task Utility Criteria
  Grounding Criteria
  Safety Criteria
  User Feedback
  System Metrics

Output:
  Evaluation Signal

Derived artifact:
  Feedback
```

# Views

## Typed Dependency Graph


At the entity level, I would model the core graph like this:

```text
User
  └─ has → User Goal
        └─ motivates → User Task
              └─ expressed_by → User Request

User Request
  └─ interpreted_as → Interpreted Task
        └─ requires → Task Context Requirement

Task Context Requirement
  ├─ constrains → Context Access Planning
  └─ satisfied_by → Working Context

Context Access Planning
  ├─ selects → Context Source
  ├─ selects → Acquisition Interface
  ├─ targets → Representation
  └─ constrains → Context Acquisition

Context Acquisition
  └─ produces → Acquired Context

Acquired Context
  └─ input_to → Context Assembly
        └─ produces → Working Context

Working Context
  └─ consumed_by → Generator
        └─ produces → Generated Output

Generated Output
  └─ consumed_by → Output Consumer
        └─ produces_or_contributes_to → Outcome

Outcome
  └─ evaluated_against → Success Criteria
        └─ yields → Evaluation Signal
              └─ may_yield → Feedback
```

## Where possible loops belong


The graph should allow at least five loops.

### Clarification loop

```text
Interpreted Task
  → ambiguity detected
  → Clarification Request
  → User Response
  → revised Interpreted Task
```


Use when the task is underspecified.

### Context gap loop

```text
Working Context
  → insufficiency detected
  → revised Task Context Requirement
  → revised Context Access Planning
  → more Acquired Context
```


Use when acquired context is incomplete or insufficient.

### Verification loop

```text
Generated Output
  → validation failure
  → Context Selection / Context Acquisition / Generation retry
```


Use when output is unsupported, stale, contradictory, unsafe, or malformed.

### Execution failure loop

```text
Generated Output
  → Output Consumer
  → execution failure
  → revised Generated Output or revised Context Access Planning
```


Example: generated SQL fails, API call is rejected, tool execution errors.

### User feedback loop

```text
Outcome
  → User Evaluation
  → Follow-up Request
  → Task Refinement
```


This is the normal multi-turn loop.
