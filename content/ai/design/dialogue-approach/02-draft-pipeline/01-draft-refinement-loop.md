---
draft: false
toc: true
description: "A Quick Add architecture centered on a persistent transaction draft, repeatedly enriched, grounded, repaired, and validated before user-confirmed typed execution."
title: "01 Draft Refinement Loop"
linkTitle: "01 Draft Refinement Loop"
---
# Draft refinement loop


[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

Instead of:

> "Should this utterance produce a saveable draft, ask a question, show a warning, or route elsewhere?"

Model it as:

> **The system maintains a structured action draft and iteratively enriches, validates, repairs, and confirms it until it becomes executable -- or determines that it cannot/should not be executed.**

This is a stronger model because it supports multi-step behavior: asking the user, using app APIs, applying defaults, checking duplicates, resolving categories, and validating before execution.

## New mental model

### Old model: one-shot parse

```text
User utterance
→ Parse
→ Decide outcome
```


Example:

```text
"Coffee yesterday"
→ missing amount
→ ask question
```


This works, but it is too limited.

### Better model: draft refinement loop

```text
User utterance
→ Create initial draft
→ Enrich draft
→ Validate draft
→ Identify gaps / risks
→ Ask user or use tools
→ Update draft
→ Repeat until ready
→ Confirm
→ Execute typed action
```


So the central object is no longer the raw utterance. The central object is the **draft action**.

## Suggested terminology


Proposed names:

```text
Draft-centric action pipeline
```


or more formally:

```text
Execution-gated typed action pipeline
```


In NLP / AI terms, it combines:

| Concept | Meaning in Quick Add |
| --- | --- |
| Task-oriented NLU | Understanding the user's command |
| Intent detection | Is this create expense, income, transfer, edit draft, query, etc.? |
| Slot filling | Filling amount, date, category, account, merchant, note |
| Dialogue state tracking | Keeping the current draft across turns |
| Grounding | Mapping "groceries" or "Chase" to real app objects |
| Tool use | Calling APIs to fetch accounts, categories, recent transactions, defaults |
| Actionability | Whether the draft has enough valid data to proceed |
| Execution gating | Blocking execution until criteria are satisfied |
| Human-in-the-loop confirmation | User confirms before save |
| Typed action execution | Backend performs `create_transaction` |

The most important terms for the product specification are probably:

```text
structured draft
draft state
draft refinement
readiness criteria
execution gate
action policy
```

## The refinement loop


The pipeline becomes:

```text
1. Interpret utterance
2. Initialize or update draft
3. Extract candidate fields
4. Normalize fields
5. Ground fields against user data
6. Enrich missing/low-confidence fields using tools
7. Validate draft
8. Score readiness
9. Choose next action
10. Repeat or execute after confirmation
```


In compact form:

```text
Utterance
→ Draft update
→ Draft enrichment
→ Draft validation
→ Readiness check
→ Next action
```


The system keeps cycling through this loop until one of these outcomes happens:

```text
ready_for_confirmation
needs_user_clarification
blocked
unsupported
cancelled
executed
```

## Better product framing


Proposed product/architecture description:

```text
Quick Add creates a structured transaction draft from natural language. The system incrementally fills and validates the draft using NLU, user defaults, account/category data, merchant memory, and duplicate checks. If the draft is incomplete or risky, the system asks for clarification or shows warnings. A transaction is executable only after the draft satisfies readiness criteria and the user confirms it.
```


This is more robust than:

```text
AI parses text into transaction.
```

## Recommended architecture diagram

```text
User utterance
   ↓
Input normalizer
   ↓
NLU parser
   ↓
Draft manager  ←→ Dialogue state
   ↓
Enrichment tools
   ├─ category resolver
   ├─ account resolver
   ├─ user defaults
   ├─ merchant memory
   ├─ recent transaction lookup
   └─ duplicate detector
   ↓
Validation service
   ↓
Readiness scorer / action policy
   ├─ ask clarification
   ├─ show warning
   ├─ show confirmation
   ├─ route elsewhere
   └─ block
   ↓
User confirmation
   ↓
Typed action executor
   ↓
create_transaction
```


The key architectural move is putting **Draft Manager** in the center.

## Draft manager responsibilities


The draft manager owns:

```text
current draft state
field provenance
missing fields
confidence scores
warnings
dialogue context
patch history
readiness status
next action
```


It receives inputs from:

```text
NLU parser
user corrections
tool results
backend validator
duplicate detector
manual edits
```


It produces:

```text
confirmation card data
clarification questions
validation errors
executable typed action
```


This forms the orchestration layer.

<a id="practical-terminology-i-would-use-in-the-spec"></a>

## Proposed terminology for the specification


Use this vocabulary:

```text
Transaction Draft
Draft Manager
Draft Patch
Field Provenance
Draft Readiness
Execution Gate
Action Policy
Clarification Loop
Grounding Service
Validation Service
Typed Action Executor
```


The main line:

```text
Quick Add is a draft-centric NLU system. It transforms user utterances into structured transaction drafts, incrementally enriches and validates them, and only executes a typed action after readiness criteria and user confirmation are satisfied.
```


---

Related: [Draft state and lifecycle]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/02-draft-state-and-lifecycle" >}}) · [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}) · [Transaction example: from utterance to execution]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/07-transaction-example" >}}).

Original text: [02-pipeline.md](/ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop.assets/02-pipeline.txt).

## Library sources


- [Jurafsky and Martin 2026](/sources/nlp/dialogue-systems/jurafsky-2026-slp3-appendix-k-frame-based-dialogue.pdf.enc), *SLP3 Appendix K: Frame-Based Dialogue Systems*
