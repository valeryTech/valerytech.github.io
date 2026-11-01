---
draft: false
toc: true
description: "A worked expense-entry example following a transaction from utterance through draft updates, account resolution, duplicate checks, confirmation, and saving."
title: "07 Transaction Example"
linkTitle: "07 Transaction Example"
---
# Transaction example: from utterance to execution


[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

This Quick Add example uses the original illustrative date, 2026-06-22.

## Example: full lifecycle


User says:

```text
Coffee yesterday
```


Initial draft:

```json
{
  "status": "needs_clarification",
  "transaction": {
    "type": "expense",
    "amount": null,
    "date": "2026-06-22",
    "category": "coffee",
    "note": "coffee"
  },
  "missing_fields": ["amount"],
  "next_action": {
    "type": "ask_user",
    "question": "How much was the coffee?"
  }
}
```


User says:

```text
4.50
```


Updated draft:

```json
{
  "status": "enriching",
  "transaction": {
    "type": "expense",
    "amount": 4.50,
    "date": "2026-06-22",
    "category": "coffee",
    "account_id": null
  }
}
```


Tool fills default account:

```json
{
  "account_id": "default_cash",
  "source": "user_default"
}
```


Duplicate checker finds similar transaction:

```json
{
  "warnings": [
    {
      "type": "possible_duplicate",
      "similar_transaction_id": "txn_789"
    }
  ]
}
```


Policy decides:

```json
{
  "status": "ready_for_confirmation",
  "next_action": "show_confirmation",
  "requires_confirmation": true
}
```


User taps Save.

Executor receives:

```json
{
  "action": "create_transaction",
  "transaction": {
    "type": "expense",
    "amount": 4.50,
    "currency": "USD",
    "date": "2026-06-22",
    "category_id": "coffee",
    "account_id": "default_cash",
    "note": "coffee"
  }
}
```


Backend writes.

---

Related: [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) · [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}).

Original text: [02-pipeline.md](/ai/design/dialogue-approach/02-draft-pipeline/07-transaction-example.assets/02-pipeline.txt).
