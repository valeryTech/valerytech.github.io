---
draft: false
toc: true
description: "A proposed transaction-draft record and state machine for carrying missing fields, confidence, warnings, and next steps across user turns and tool results."
title: "02 Draft State And Lifecycle"
linkTitle: "02 Draft State And Lifecycle"
---
# Draft state and lifecycle


[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## Central object: structured draft


The parser should not just output a final transaction. It should output and maintain a **draft**.

Example:

```json
{
  "draft_id": "draft_123",
  "action": "create_transaction",
  "status": "incomplete",
  "source_text": "Coffee yesterday",
  "transaction": {
    "type": "expense",
    "amount": null,
    "currency": "USD",
    "date": "2026-06-22",
    "category": {
      "id": "coffee",
      "label": "Coffee",
      "confidence": 0.86,
      "source": "inferred_from_text"
    },
    "account_id": {
      "value": "default_cash",
      "confidence": 0.62,
      "source": "default"
    },
    "merchant": null,
    "note": "coffee"
  },
  "missing_fields": ["amount"],
  "warnings": [],
  "next_step": {
    "type": "ask_user",
    "question": "How much was the coffee?"
  }
}
```


Then the user says:

```text
4.50
```


The system updates the same draft:

```json
{
  "draft_id": "draft_123",
  "status": "ready_for_confirmation",
  "transaction": {
    "type": "expense",
    "amount": 4.50,
    "currency": "USD",
    "date": "2026-06-22",
    "category": {
      "id": "coffee",
      "label": "Coffee",
      "confidence": 0.86
    },
    "account_id": {
      "value": "default_cash",
      "confidence": 0.62
    },
    "note": "coffee"
  },
  "missing_fields": [],
  "warnings": [],
  "next_step": {
    "type": "show_confirmation"
  }
}
```


This lets the system behave as a **stateful assistant**, not a stateless parser.

## Draft lifecycle


Define explicit draft states.

```text
empty
→ initialized
→ partially_filled
→ enriched
→ validated
→ ready_for_confirmation
→ confirmed
→ executed
```


Also include failure/escape states:

```text
needs_clarification
blocked
unsupported
cancelled
expired
```


A practical state model:

| State | Meaning |
| --- | --- |
| `initialized` | User utterance created a candidate action |
| `partially_filled` | Some slots are missing |
| `enriching` | System is using tools/defaults/history to fill fields |
| `needs_clarification` | User input is required |
| `validated` | Backend accepts the draft shape and values |
| `ready_for_confirmation` | User can save with one tap |
| `confirmed` | User explicitly approved |
| `executed` | Backend created the transaction |
| `blocked` | Cannot proceed safely |
| `unsupported` | Utterance is not a create-transaction command |

This is cleaner than treating every user message as a separate parse event.

---

Related: [Draft patches and field provenance]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/05-patches-and-field-provenance" >}}) · [Clarification as draft repair]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/06-clarification-as-draft-repair" >}}) · [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}).

Original text: [02-pipeline.md](/ai/design/dialogue-approach/02-draft-pipeline/02-draft-state-and-lifecycle.assets/02-pipeline.txt).
