---
draft: false
toc: true
description: "A slot-filling example showing clarification as a repair to an incomplete draft, followed by another readiness check."
title: "06 Clarification As Draft Repair"
linkTitle: "06 Clarification As Draft Repair"
---
# Clarification as draft repair


[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## Clarification as draft repair


In this model, asking a question is not a separate fallback. It is a **draft repair operation**.

Example:

```text
User: "Lunch yesterday"
```


Draft:

```json
{
  "type": "expense",
  "amount": null,
  "date": "2026-06-22",
  "category": "dining",
  "missing_fields": ["amount"]
}
```


Policy:

```json
{
  "next_action": "ask_user",
  "question": "How much was lunch?"
}
```


User:

```text
18
```


Patch:

```json
{
  "amount": 18
}
```


Then readiness check runs again.

This is exactly the **slot-filling dialogue** pattern:

```text
System fills known slots.
System asks for missing required slots.
User answers.
System updates the frame.
```


---

Related: [Transaction example: from utterance to execution]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/07-transaction-example" >}}) · [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}).

Original text: [02-pipeline.md](/ai/design/dialogue-approach/02-draft-pipeline/06-clarification-as-draft-repair.assets/02-pipeline.txt).
