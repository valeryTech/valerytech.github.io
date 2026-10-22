---
draft: false
toc: true
title: "Language and interaction"
aliases:
  - "/ai-engineering/causal-stack/layer-0-natural-language-properties/"
  - "/ai-engineering/evaluation/causal-stack/layer-0-natural-language-properties/"
  - "/ai-engineering/causal-stack/layer-0-alt/"
  - "/ai-engineering/evaluation/causal-stack/layer-0-alt/"
description: "Ambiguity, missing information, contextual references, and corrections pose different engineering questions. Concrete examples connect target binding, clarification cost, state updates, and preservation of meaning."
linkTitle: "Language and interaction"
---

Use this reference when a failure concerns what the customer meant, which object they referred to, or how a later turn changed the task. The examples are illustrations.

## Distinctions that change the next question


| Situation | Example | What needs resolving |
|---|---|---|
| More than one plausible interpretation | "Move the meeting with Alex" when there are two meetings or two Alexes | Which interpretation leads to the intended action? |
| A vague boundary | "Show cheaper options" | Is ranking sufficient, or does the decision require a price limit? |
| Required information is unstated | "Schedule a meeting" | Which missing details can be recovered from context or agreed defaults? |
| A reference depends on context | "Edit this"; "send it tomorrow" | Which object, date, timezone, or earlier mention supplies the reference? |
| Material is omitted but recoverable | "Same as before, except Monday" | What is carried forward and what changes? |
| The request assumes something exists or is true | "Cancel my next meeting" | Does that meeting exist, and is the identified one actually next? |
| Literal wording differs from the likely request | "Could this be shorter?" | Is the user requesting an edit, asking about feasibility, or discussing a tradeoff? |
| Scope or force matters | "Do not include contractors"; "perhaps exclude contractors" | Is this a prohibition, a tentative suggestion, or an unresolved choice? |
| Later input changes earlier input | "Actually, leave it" | Which pending action or previous commitment is cancelled? |

Useful terms for these distinctions include ambiguity, vagueness, underspecification, deixis, coreference, ellipsis, presupposition, pragmatic intent, modality, and conversational repair. They are optional vocabulary; the concrete question is sufficient for debugging.

## Context must match what the customer can refer to


If a customer says "this column," conversation history may be insufficient. Inspect the active document, selection, visible object, or other interface state that was available at the time.

Record the actual binding used by the product. Do not assume that the customer's screen state and the model's input were the same. If two plausible targets remain and choosing incorrectly matters, resolve the target before acting.

## Corrections change state


Distinguish replacement, addition, narrowing, and cancellation:

- "Monday instead" replaces the earlier date.
- "Include Alex too" adds a participant.
- "Only the urgent ones" narrows the selected set.
- "Do not send it yet" changes whether an action may proceed.

A correct acknowledgement does not show that later tools received the updated state. Inspect the next relevant operation. Keep still-valid constraints when replacing one value.

This is a requirement of the particular workflow; it does not imply that every product needs a separate memory subsystem.

## Clarification has a cost


Ask for information when it changes the result and cannot be recovered reliably from available context. For easily revised drafts, an explicit assumption and a first attempt may be more useful. For an unresolved action target, a specific question may avoid costly rework.

Check the interaction with customers. Compare wrong interpretations, unnecessary questions, delay, abandonment, and effort to recover. Politeness, urgency, and confident wording do not by themselves establish permission, correctness, or priority.

## Meaning can be lost during transformation


When summarizing or extracting, preserve conditions that affect the decision: negation, exceptions, who a rule applies to, dates, units, and the strength of a claim.

"May approve after review" becoming "approved" is a substantive change. A shorter paraphrase that preserves the relevant conditions may be acceptable. Define that boundary for the task and use the [meaning and exact-value checks]({{< ref "ai-engineering/causal-stack/checks" >}}#meaning-format-and-exact-values).

## Basis and limits


Clark and Brennan describe communication as coordination toward sufficient shared understanding for the activity, with costs that depend on the medium. This supports treating clarification and repair as part of the interaction. It does not establish a particular AI interface design. [Grounding in Communication (1991)](https://web.stanford.edu/~clark/1990s/Clark%2C%20H.H.%20_%20Brennan%2C%20S.E.%20_Grounding%20in%20communication_%201991.pdf).

The product questions above are engineering applications of these distinctions. Evaluate them through [real use]({{< ref "ai-engineering/causal-stack/practical-checks" >}}); they are not a claim that natural language always needs a formal intermediate representation.
