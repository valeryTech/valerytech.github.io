---
draft: false
toc: true
description: "Separates parser, validator, action policy, and executor, distinguishing a draft ready for review from a confirmed action authorized to change backend state."
title: "03 Action Policy And Execution Gates"
linkTitle: "03 Action Policy And Execution Gates"
---
# Action policy, readiness, and execution gates


[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## Action policy


The proposed design needs a separate **action policy** component.

The parser should not decide everything. It should produce draft state. The action policy decides the next step.

Example policy:

```text
If required fields are missing → ask clarification
If required fields are present but low confidence → show confirmation with warning
If duplicate risk is high → show duplicate warning
If unsupported intent → route away from Quick Add
If valid and complete → show confirmation
If user confirms → execute typed backend action
```


Example:

```json
{
  "draft_status": "needs_clarification",
  "reason": "missing_required_field",
  "missing_fields": ["amount"],
  "next_action": {
    "type": "ask_user",
    "question": "How much was it?"
  }
}
```


Another:

```json
{
  "draft_status": "ready_for_confirmation",
  "warnings": [
    {
      "type": "possible_duplicate",
      "message": "Similar coffee expense from today already exists."
    }
  ],
  "next_action": {
    "type": "show_confirmation"
  }
}
```


This separation is important:

```text
NLU/parser = what does the user seem to mean?
Validator = is the draft structurally and legally valid?
Action policy = what should the app do next?
Executor = perform the backend action after confirmation
```

## Readiness criteria


Define what it means for a draft to be "ready."

For a simple expense, readiness might require:

```text
intent is create_transaction
type is known
amount is present and valid
currency is present and supported
date is present and valid
account is present and belongs to user
category is present or explicit uncategorized fallback is allowed
duplicate risk is below threshold or warning is shown
user has not rejected the draft
backend validation passed
```


Separate readiness into levels.

### Level 1: Structurally complete


The transaction has all required fields.

```text
amount
type
date
currency
account
```

### Level 2: Grounded


Fields map to real app objects.

```text
category label → category_id
account phrase → account_id
currency → supported currency
```

### Level 3: Validated


Backend accepts it.

```text
amount > 0
date is allowed
account belongs to user
category belongs to user
transaction type is allowed
```

### Level 4: Safe to present


Warnings are either absent or displayable.

```text
possible duplicate
low category confidence
unusual amount
future date
ambiguous merchant
```

### Level 5: Executable


User has confirmed.

```text
requires_confirmation = false only for explicitly enabled auto-save cases
```


For MVP, execution should require confirmation.

## Important distinction: draft-ready vs execution-ready


Do not collapse these.

A draft can be **ready for confirmation** without being silently executable.

```text
ready_for_confirmation = enough to show user
execution_ready = user confirmed + backend validation passed
```


For MVP:

```text
LLM never executes
draft manager never executes
frontend never directly writes
backend executor only writes after explicit confirmation
```


This is the safety boundary for execution.

---

Related: [Draft state and lifecycle]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/02-draft-state-and-lifecycle" >}}) · [Grounding and enrichment]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/04-grounding-and-enrichment" >}}) · [Interaction forms and hybrid UI]({{< ref "ai/design/dialogue-approach/01-framing/05-interaction-forms-and-hybrid-ui" >}}).

Original text: [02-pipeline.md](/ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates.assets/02-pipeline.txt).
