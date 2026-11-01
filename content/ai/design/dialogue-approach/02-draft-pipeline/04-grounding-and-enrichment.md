---
draft: false
toc: true
title: "Tool Grounding and Enrichment of Transaction Drafts"
description: "A tool-grounding example resolving merchant, account, category, date, and duplicates, with a clear division between model proposals, backend validation, user confirmation, and writes."
weight: "40"
linkTitle: "Grounding and Enrichment"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## Tool use in the pipeline


This model makes tool/API usage natural.

The draft can call tools to resolve uncertainty.

| Need | Tool/API |
| --- | --- |
| User categories | `list_categories` |
| User accounts | `list_accounts` |
| Merchant memory | `lookup_merchant_mapping` |
| Recent transactions | `find_similar_transactions` |
| Defaults | `get_user_defaults` |
| Currency | `get_default_currency` |
| Date normalization | deterministic date parser |
| Duplicate detection | transaction similarity service |
| Category learning | correction history |

Example:

```text
User: "Whole Foods 42 yesterday on Chase"
```


Pipeline:

```text
Extract:
- merchant candidate: Whole Foods
- amount: 42
- date: yesterday
- account phrase: Chase

Use tools:
- account lookup: Chase → acc_chase_sapphire
- merchant memory: Whole Foods → groceries
- duplicate check: no duplicate

Validate:
- amount valid
- date valid
- account belongs to user
- category exists

Result:
- ready_for_confirmation
```


The model is:

```text
The LLM proposes.
Tools ground.
Backend validates.
User confirms.
Executor writes.
```


---

Related: [Draft patches and field provenance]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/05-patches-and-field-provenance" >}}) · [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}).

Original text: [02-pipeline.md](/ai/design/dialogue-approach/02-draft-pipeline/04-grounding-and-enrichment.assets/02-pipeline.txt).
