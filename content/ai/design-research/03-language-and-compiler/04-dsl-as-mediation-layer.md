---
draft: false
toc: true
description: "Proposes whole-program DSL mediation through a deterministic runner and registered adapters, treating sandboxing separately and assigning transactions, retries, and staged commitment to execution infrastructure."
title: "04 Dsl As Mediation Layer"
linkTitle: "04 Dsl As Mediation Layer"
---
## dsl as layer in some ladder


Initial risk scenario: An AI agent has no isolation and creates business-domain objects, writes to databases, and performs transactions.

A further layer gives the agent tools and service APIs. Open question: Where do transactions and related responsibilities belong? Investigate how LangChain handles them. One option is to construct an environment and isolate it in a sandbox.

Next proposed layer: Introduce a DSL with adapters to tools, APIs, and other services as needed. The AI agent writes programs in the DSL, while a separate runner agent handles execution.

<a id="answer"></a>

# Proposed analysis


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The LLM analysis accepts the proposed ladder, with one structural change: **semantic mediation** and **execution isolation** should be separate dimensions.

A sandbox limits the machine resources available to code. A DSL limits which programs can be expressed and accepted. A sandboxed agent can still make a damaging API call when it has network access and credentials.

## Revised ladder

### Level 0: Direct business-system access

```text
User request
    ↓
LLM agent
    ↓
ORM / database / payment API / domain objects
```


The important boundary is the state-changing operation. Constructing a domain object in memory is generally harmless; calling `save`, `commit`, `send`, `publish`, or `transfer` creates the risk.

At this level, the model effectively controls:

- which operations run;
- their arguments and ordering;
- transaction boundaries;
- retries;
- error recovery;
- when a result is final.

Application validation may catch malformed data, but the application has little opportunity to inspect the entire intended operation before execution.

### Level 1: Tool-mediated execution

```text
User request
    ↓
LLM agent
    ↓
structured tool calls
    ↓
tool implementations
    ↓
services / databases
```


Each tool acts as an adapter:

```scala
def createInvoice(input: CreateInvoice): InvoiceId
def approveInvoice(id: InvoiceId): ApprovedInvoice
def payInvoice(id: ApprovedInvoice): Receipt
```


The tool implementation can own authorization, validation and a local database transaction.

Current LangChain agents follow this general structure: the model repeatedly requests tool calls, the runtime executes them, and the results return to the model. LangGraph uses `ToolNode` for execution, while middleware can wrap and validate individual model and tool calls. ([Docs by LangChain](https://docs.langchain.com/oss/python/langchain/agents "Agents - Docs by LangChain"))

This is better than direct database access because each tool can protect its own operation. However, the model still controls the sequence:

```text
call tool A
inspect result
call tool B
retry tool A
call tool C
```


Each call may be valid independently while the complete sequence is invalid:

```text
charge customer
cancel order
charge customer again
```


The application can add state and middleware rules, but those checks tend to become distributed across tool implementations, prompts, middleware and runtime state.

### Execution isolation: a separate axis


A sandbox can surround Level 0, Level 1, or Level 2.

```text
                    semantic access

             direct     tools      DSL
              access    only       only
           ┌─────────┬─────────┬─────────┐
sandboxed  │    A    │    B    │    C    │
           ├─────────┼─────────┼─────────┤
host       │    D    │    E    │    F    │
           └─────────┴─────────┴─────────┘
```


For example, a tool-mediated agent can run on the host while tool implementations execute in sandboxes. Alternatively, the entire agent can run inside a container or VM.

LangChain explicitly supports both "agent inside sandbox" and "sandbox as a tool" patterns. Its documentation also states the limit of this isolation: sandboxes protect the host filesystem and processes, while network exfiltration and actions available through permitted interfaces remain possible. ([Docs by LangChain](https://docs.langchain.com/oss/python/deepagents/sandboxes "Sandboxes - Docs by LangChain"))

Therefore:

```text
sandbox      → limits infrastructure access
tool adapter → limits individual operation access
DSL          → limits and analyzes complete programs
```


They should be combined.

## Level 2: Program-mediated execution through a DSL

```text
User request
    ↓
LLM program synthesizer
    ↓
DSL source or AST
    ↓
compiler and verifier
    ↓
accepted execution plan
    ↓
deterministic runner
    ↓
adapters
    ↓
services / databases / search systems
```


Here, the model produces an inert artifact. Producing the program causes no business effects.

The proposal is to avoid calling the executor a "runner agent." The runner should be a normal interpreter, workflow engine, or state machine. Adding another LLM-controlled agent at that boundary would reintroduce uncertain decisions after verification.

The runner may invoke an LLM through specific operators such as `classify`, `summarize`, or `assessCoverage`. Those operators return typed values. They do not control the execution engine or gain arbitrary access to other adapters.

The full flow would be:

```text
generate candidate
       ↓
parse
       ↓
resolve operator definitions
       ↓
type-check
       ↓
check control flow and effects
       ↓
check budgets and invariants
       ↓
produce diagnostics or executable IR
       ↓
preflight dynamic conditions
       ↓
execute through adapters
```


The DSL adds capabilities that tool calling alone does not naturally provide:

- whole-program inspection;
- checking sequences before execution;
- bounded loops and explicit exit criteria;
- optimization and rewriting;
- dry runs;
- reproducible execution;
- program diffs;
- compiler feedback;
- consistent transaction handling;
- audit records that represent intended behavior, rather than only completed calls.

## The operator set can remain extensible


The core language can be small while the available operations remain open to extension.

```text
Core language:
  let
  if
  match
  repeat
  parallel
  return
  assert

Registered operators:
  search
  rerank
  queryDatabase
  callService
  synthesize
  evaluateCoverage
  ...
```


An adapter registration should provide more than an executable function:

```scala
OperatorDefinition(
  name = "search",
  version = "2",
  inputType = SearchQuery,
  outputType = List[SearchResult],
  effects = Set(NetworkRead),
  validate = validateSearch,
  estimate = estimateSearch,
  execute = executeSearch
)
```


For operations that change state, it may eventually include:

```scala
idempotency
preflight
authorization
transactionMode
compensation
auditFields
```


This gives you an **open operator catalog with explicit semantics**. New operators can be installed without extending the language grammar. The compiler obtains their signatures and properties from manifests.

There still needs to be a controlled registration process. Loading an arbitrary operator with unknown semantics would become equivalent to an arbitrary-code escape hatch.

### 4. Use staged commitment


Operations should move from reversible to irreversible states.

```text
proposal
→ validation
→ preview
→ approval
→ prepared operation
→ commit
```


For example:

```text
PaymentDraft
→ ValidatedPayment
→ ApprovedPayment
→ PreparedPayment
→ PaymentReceipt
```


This reduces the cost of mistakes. The model can revise a draft many times without changing external state.

Irreversible operations should have visible commit points:

```text
preview(...)
prepare(...)
commit(...)
```

## Where transactions belong


Transactions should primarily belong to adapters and the runner.

For a simple tool-mediated system:

```text
tool invocation
    ↓
begin transaction
validate current state
perform operation
commit
```


For a DSL system, the language may express higher-level atomic intent:

```text
atomic billing {
    createPayment(invoice)
    markInvoiceAsPaid(invoice)
}
```


The compiler and runner then decide how that maps to the underlying system.

For operations involving several services, a conventional database transaction may be unavailable. The runner would need workflow semantics such as idempotency, retries and compensating actions:

```text
workflow PayInvoice {
    reserveFunds(invoice)
      compensate releaseFunds(invoice)

    markInvoicePaid(invoice)
      compensate restoreInvoice(invoice)

    publishPaymentEvent(invoice)
}
```


The proposal is to keep raw primitives such as `beginTransaction`, `commit`, and `rollback` away from the model initially. Higher-level domain operations are easier to verify:

```text
payApprovedInvoice(invoice)
```


The adapter can implement the required transaction correctly.

For a first RAG project, transactional business operations can remain outside the language. We only need execution-state consistency, such as ensuring that a failed iteration does not partially update the accumulated evidence.

## Relation to current LangChain work


LangChain now has an "Interpreters" feature where a model writes QuickJS code that composes tools using loops, branches, retries and parallel calls. The runtime executes that code and keeps intermediate results outside the model context. The feature is currently documented as beta. ([Docs by LangChain](https://docs.langchain.com/oss/python/deepagents/interpreters "Interpreters - Docs by LangChain"))

That is close to the proposed architectural direction:

```text
LLM writes program
    ↓
runtime executes program
    ↓
program invokes tools
```


The proposed DSL would add the parts that a general-purpose JavaScript interpreter does not inherently provide:

```text
domain types
explicit operator semantics
structured effects
bounded constructs
whole-program validation
compiler diagnostics
controlled lowering
domain-specific optimization
```


So the refined thesis is:

> The LLM synthesizes a program in an extensible, typed operational DSL. A compiler checks and lowers that program. A deterministic runtime executes it through registered adapters. Sandboxes, restricted credentials, network controls and service-side validation contain execution at the infrastructure boundary.

Later, a declarative layer can sit above this:

```text
goal and constraints
        ↓
planner or synthesizer
        ↓
operational DSL
        ↓
compiler
        ↓
runner
```


The operational DSL should come first because the future declarative planner will need a precise target language with established execution semantics.
