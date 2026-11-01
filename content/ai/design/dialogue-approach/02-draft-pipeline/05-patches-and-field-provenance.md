---
draft: false
toc: true
title: "Draft Patches and Field Provenance"
description: "Builds transaction drafts through subsystem patches and field-level provenance, explaining how explicit, inferred, defaulted, and uncertain values should appear during review."
linkTitle: "Patches and Provenance"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## Draft as an accumulating object


A useful way to design this is with a patch model.

Each step emits a patch to the draft.

Initial utterance:

```json
{
  "patch_source": "nlu",
  "updates": {
    "amount": 42,
    "merchant": "Whole Foods",
    "date": "2026-06-22"
  }
}
```


Merchant memory:

```json
{
  "patch_source": "merchant_mapping",
  "updates": {
    "category_id": "groceries"
  }
}
```


Account resolver:

```json
{
  "patch_source": "account_grounding",
  "updates": {
    "account_id": "acc_chase_sapphire"
  }
}
```


Duplicate checker:

```json
{
  "patch_source": "duplicate_detection",
  "warnings": []
}
```


This makes field updates observable: each value can be traced to the subsystem that supplied it.

That matters for debugging and for learning from corrections.

## Draft field provenance


Each field should carry provenance.

Example:

```json
{
  "amount": {
    "value": 42,
    "confidence": 0.99,
    "source": "explicit_user_text",
    "raw_span": "42"
  },
  "category": {
    "id": "groceries",
    "confidence": 0.91,
    "source": "merchant_memory",
    "raw_span": "Whole Foods"
  },
  "account_id": {
    "value": "acc_chase",
    "confidence": 0.78,
    "source": "account_grounding",
    "raw_span": "Chase"
  },
  "date": {
    "value": "2026-06-22",
    "confidence": 0.99,
    "source": "relative_date_parser",
    "raw_span": "yesterday"
  }
}
```


This supports better UX:

```text
Explicit fields can be shown normally.
Inferred fields can be shown as suggestions.
Low-confidence fields can be highlighted.
Defaulted fields can be visually subtle but editable.
```


Example confirmation card:

```text
Expense · $42 · Groceries · Yesterday · Chase
```


With maybe:

```text
Category suggested from Whole Foods
```


---

Related: [Draft state and lifecycle]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/02-draft-state-and-lifecycle" >}}) · [Grounding and enrichment]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/04-grounding-and-enrichment" >}}).

Original text: [02-pipeline.md](/ai/design/dialogue-approach/02-draft-pipeline/05-patches-and-field-provenance.assets/02-pipeline.txt).
