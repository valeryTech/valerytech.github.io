---
draft: false
toc: true
description: "Develops staged mediation from ambiguous intent to committed effects, placing each check at the earliest suitable layer while separating representation, authority, isolation, validation, and commitment."
title: "05 Layered Design Model"
linkTitle: "05 Layered Design Model"
---

Open research topic: a layered design model for the technical architecture of AI agents.

Question: Which general principles can be drawn from a sequence of abstraction layers?

- One interpretation is that each abstraction progressively restricts an agent.
- Introducing these abstractions could establish guarantees and isolate the agent or workflow from some faults or errors. Which object is isolated remains an open question.
- Feedback speed is another concern: layers or components could make the process faster by accounting for LLM characteristics.

Open question: Which other principles belong in this model?

<a id="answer"></a>

# Proposed analysis


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The proposed layered design model should identify what each abstraction restricts, which guarantees it adds, what uncertainty remains, and how it improves feedback and execution.

The proposal is to generalize this as **staged mediation**: the system gradually turns an ambiguous intent into a precise, checked, and executable artifact.

```text
Intent
  ↓
Candidate plan
  ↓
Typed DSL program
  ↓
Verified execution plan
  ↓
Prepared actions
  ↓
Committed effects
  ↓
Observed result
```


At each stage:

1. The representation becomes more precise.
2. More checks become possible.
3. The artifact may receive more authority.
4. Failures become more expensive.
5. Feedback should be returned at the earliest stage that can detect the problem.

The goal is not to make the LLM consistently correct. The goal is to make its mistakes cheap, local, observable, and recoverable.

## What is being isolated?


There are several different boundaries.

```text
LLM agent
    isolated from credentials and direct effects

Candidate program
    isolated from execution until accepted

Workflow
    protected from invalid composition and control flow

Runner
    isolated from open-ended model decisions

Infrastructure
    protected by sandboxing, quotas, and network controls

Business state
    protected by authorization, transactions, and domain invariants
```


So the answer is both the agent and the workflow, but in different ways.

The **agent's authority** is restricted. The **workflow's structure** is checked. The **runner's environment** is isolated. The **business system** continues to enforce its own invariants.

## The ladder is only one dimension


The sequence applies well to the representation:

```text
free text
→ structured tool calls
→ DSL
→ checked AST
→ execution IR
```


Other concerns are parallel axes:

```text
Representation:
free text → structured plan → verified program

Authority:
direct credentials → scoped adapters → runner-only credentials

Isolation:
host execution → process → container/VM → restricted network

Commitment:
immediate write → preview → preflight → staged commit

Validation:
post-run check → runtime check → preflight → static check
```


For example, a sandbox is not necessarily a later step than a DSL. A DSL runner may still need a sandbox, and a tool-calling agent may already run inside one.

## Additional principles

### 1. Separate proposal, acceptance, and execution


These should be distinct components:

```text
LLM:
    proposes candidate programs

Compiler/verifier:
    decides whether a candidate is acceptable

Runner:
    executes an accepted program
```


The model should not decide whether its own program is valid. The runner should not reinterpret intent or invent missing steps.

### 2. Separate expressiveness from authority


An agent can be allowed to express a broad plan without receiving authority to execute it.

```text
LLM can express:
    search
    loop
    branch
    evaluate
    update
    send
    transact

Runtime may authorize:
    search and evaluate only
```


The same DSL program can be checked against different execution policies.

An abstraction itself is not necessarily a restriction. A high-level operation such as:

```text
payInvoice(invoice)
```


may be more powerful than several low-level calls. The restriction comes from its contract, verifier, authorization, and implementation.

### 3. Move each check to the earliest suitable layer


Different properties belong at different stages.

|Property|Suitable layer|
|---|---|
|Valid syntax|Parser|
|Existing operator|Name resolution|
|Compatible values|Type checker|
|Bounded loop|Static control-flow checker|
|Declared external write|Effect checker|
|User currently authorized|Preflight/runtime|
|Record still exists|Preflight/runtime|
|Transaction succeeded|Runtime|
|Answer is well supported|Evaluator/postcondition|
|User is satisfied|User evaluation|

Trying to encode all of these in the type system would make the DSL difficult to use. Delaying all of them until execution would make feedback slow and failures expensive.

### 12. Keep the trusted part small


The DSL compiler, verifier, runner, and critical adapters form the trusted computing base: the components whose correctness the guarantees depend on.

A new layer is useful only when it does at least one of these:

```text
eliminates a class of faults
reduces execution authority
reduces the cost of failure
shortens feedback
improves observability
makes recovery more reliable
```


Extra layers can also add bugs, latency, and semantic mismatches. The runner and execution IR should therefore remain small.

## A useful general model


The proposal is to summarize the architecture using two loops.

The first is the **synthesis loop**:

```text
LLM proposes program
    ↓
compiler checks it
    ↓
structured diagnostics
    ↓
LLM repairs program
```


This loop should be fast and have no external side effects.

The second is the **execution loop**:

```text
runner executes accepted step
    ↓
observes external result
    ↓
checks runtime conditions
    ↓
continues, retries, compensates, or stops
```


This loop may have external effects, so it needs stricter authority, transactions, idempotency, budgets, and monitoring.

The accepted DSL program is the boundary between the two loops.

## Resulting principle


The overall approach is:

> Gradually convert uncertain model output into more precise artifacts, grant authority only after the relevant checks pass, and detect each fault at the cheapest layer with enough information to identify it.

That principle applies to RAG, query processing, coding agents, business workflows, data analysis, and eventually declarative planning.
