---
draft: false
toc: true
title: "The Mindset Shift for AI Products"
description: "A working delivery model replaces feature completion with responsibility for bounded production behavior, using transaction capture to connect narrow scope, required quality, evaluation, and ongoing learning."
linkTitle: "Mindset"
---

The main change is the **unit of thought**.

In the classical view, we often think:

```text
idea / requirement
    ↓
feature or MVP
    ↓
implement
    ↓
test
    ↓
ship
    ↓
done
```


Working hypothesis: this model is too weak for AI products. The hard part is often not implementing the surface. It is establishing that the system behaves well enough, within a declared scope, that we are willing to operate it.

The [Discovery/Delivery draft]({{< ref "ai/product/product-model/discovery-delivery/discovery-deliery-separation" >}}) points in this direction: Discovery asks whether and how to solve something; Delivery creates an enduring system that has to satisfy production constraints and customer dependence. The boundary is the commitment to that enduring system.

Proposed delivery model:

## 1. We don't commit to "implement a feature"


We commit to **provide a bounded product behavior in production**.

For Solution B, the classical statement is:

> Implement natural-language transaction capture.

The stronger delivery statement is closer to:

> We commit to letting users record supported expense transactions from one natural-language description, with an editable draft, explicit confirmation, deterministic validation, and safe failure for unsupported or ambiguous cases.

That is a much richer object.

It contains:

- the user situation;
- intended behavior;
- supported scope;
- safety boundaries;
- interaction contract;
- production responsibility.

The UI feature may be "Natural-language capture," but that feature is only one manifestation of the commitment.

## 2. Think "narrow behavior, production quality"


This is probably the most useful mental shift.

With an MVP mindset, there is a temptation to say:

> Let's implement a smaller, lower-quality version first.

Proposed delivery principle:

> Make the supported scope very small, but make that scope fit for production.

For example:

```text
Bad narrowing:

Support expense, income, transfer, adjustment,
but each at mediocre AI quality.

Better narrowing:

Support only common expenses,
but make that behavior safe, understandable,
observable, recoverable, and dependable.
```


This fits the distinction in the [Discovery/Delivery draft]({{< ref "ai/product/product-model/discovery-delivery/discovery-deliery-separation" >}}): a discovery prototype may take shortcuts because its purpose is learning; production code is an enduring commitment with a different standard.

So the "minimum" in our initial production release is mainly about **coverage**, not about dropping production obligations.

## 3. Feature is still useful, but it is not the delivery unit


We don't need to ban the word "feature."

A feature is useful for talking about what the user sees:

> One-shot transaction capture.

But underneath the feature, engineering is delivering a set of behaviors:

```text
Feature: One-shot transaction capture

Behavior:
- understand a supported request
- preserve explicit user information
- expose ambiguity
- produce editable draft
- validate domain rules
- require confirmation
- persist once
- recover safely from failures
```


And each of those has a quality envelope:

```text
correctness
latency
safety
privacy
reliability
observability
cost
recoverability
```


Proposed distinctions:

**Feature** = product surface.

**Functional scope** = situations we support.

**Behavior** = what the product should do in those situations.

**Production commitment** = our obligation to make that behavior dependable.

This is especially useful for AI because "the feature exists" tells us almost nothing about whether it works well enough.

## 4. "MVP" becomes ambiguous


Terminology proposal: avoid `MVP` in this framework unless it is explicitly qualified.

Marty Cagan has historically used MVP in the discovery sense as a test/prototype, while many engineering organizations use MVP to mean "first production version." Those are very different things.

We already have clearer terms:

```text
Discovery prototype
        ↓
productization commitment
        ↓
initial production slice
        ↓
subsequent production slices
```


For Wallet:

```text
Discovery prototype:
Can one-shot natural language reduce capture effort?

Initial production slice:
Common, determinate expense capture.

Later slices:
Ambiguous expenses
Income
Transfers
Wider reference/language coverage
```


That vocabulary removes a lot of ambiguity.

## 5. Delivery begins with accepted uncertainty


Another change in mindset:

The commitment does **not** mean:

> We proved the solution works.

It means:

> We have enough evidence to justify taking responsibility for this bounded solution in production.

There will still be uncertainty.

For an AI product in particular:

```text
Known enough to commit:
- users appear to value the interaction
- basic model behavior is feasible
- safety architecture is plausible
- no known fatal viability issue

Still uncertain:
- production language distribution
- tail failures
- real correction rate
- latency under real conditions
- model/version regressions
- whether some product behavior needs refinement
```


Delivery is partly the system for dealing responsibly with that remaining uncertainty.

That's why rollout, observability, evals, rollback, and production traces are not ancillary engineering concerns. They are part of how the product is delivered.

## 6. "Done" changes


The classical feature view tends to produce something like:

```text
implemented
+ tests pass
+ deployed
= done
```


Proposed release criteria:

```text
intended behavior defined
+ implementation exists
+ required behavior demonstrated
+ safety boundaries demonstrated
+ production constraints satisfied
+ rollout is controllable
+ behavior is observable
= releasable
```


Then:

```text
released
+ production evidence
+ outcome evidence
= informed next decision
```


There is no permanent "done" for probabilistic behavior.

The evaluation framework becomes central here.

## 7. Evals stop being "AI tests"


This may be the largest proposed change to the existing evaluation framework.

In a classical architecture, evals are often conceived as:

```text
feature implementation
        ↓
eval suite
        ↓
quality gate
```


Proposal: frame evals as part of a **behavior management system**:

```text
Product intent
"What does good behavior mean?"
        ↓
Expected behavior
        ↓
Implementation
        ↓
Observe behavior
        ↓
Evaluate it
        ↓
Gap
   ↙          ↘
fix system   reconsider intent
   ↓             ↓
Delivery      Discovery
        ↘     ↙
       evaluate again
```


This is close to the Torres formulation recorded in the [evaluation evidence note]({{< ref "ai/product/operating-model/working-notes/discovery-delivery-evaluation-evidence-deferred" >}}):

> define good behavior -> observe actual behavior -> evaluate gaps -> improve the product -> evaluate again

The critical implication is:

> **The eval system is not attached to the feature. It is attached to the product behavior we have committed to.**

That matters because the implementation can change:

- model;
- prompt;
- orchestration;
- architecture;
- deterministic logic;
- user interaction.

The intended behavior can remain stable while all of those change.

And sometimes production evidence tells us the intended behavior itself was wrong. Then the finding goes back into Discovery.

<a id="8-the-delivery-object-i-would-use"></a>

## 8. Proposed delivery object


Proposed mental model:

```text
                  PRODUCT BET
                       │
                 Discovery evidence
                       │
                       ▼
              PRODUCTION COMMITMENT
       "We will provide this behavior for
        these situations to these users."
                       │
                       ▼
              PRODUCTION SLICE
        Functional scope × required quality
                       │
                       ▼
               DELIVERY SYSTEM
    Implement → evaluate → release → observe
          ↑                         │
          └──────── improve ────────┘
                       │
              unresolved product question
                       ▼
                   Discovery
```


So instead of saying:

> "We're implementing Feature B."

Proposed wording:

> "We've committed to the first production slice of Solution B."

And instead of:

> "The feature is 70% complete."

we can say something meaningful such as:

> "Common expense capture has sufficient structural and semantic behavior, but uncertainty handling and production latency aren't yet at the release threshold."

That is much closer to what is actually happening in an AI system.

## The mindset in one sentence


Proposed definition:

> **Delivery is not the process of implementing a feature; it is the process of making a selected product behavior safe and dependable enough to operate, then continuously maintaining that behavior as the system and reality change.**

Features still exist. Roadmaps still exist. Engineering tasks still exist. But they sit underneath that model.

Open review question for the existing evaluation framework: what is its **top-level object**--features/tests, models, or **committed product behavior and the decisions requiring evidence**? The answer will indicate how much of the classical framing needs to change.
