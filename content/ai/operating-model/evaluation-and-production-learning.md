---
draft: false
toc: true
title: "Evaluation And Production Learning"
linkTitle: "Evaluation And Production Learning"
---
> **Status:** Deferred note. Evaluation is kept separate from the current operating model and is not developed here yet.

## 7. Evals stop being "AI tests"


In a classical architecture, evals are often conceived as:

```text
feature implementation
        ↓
eval suite
        ↓
quality gate
```


A better frame treats them as part of a **behavior management system**:

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


The critical implication is:

> **The eval system is not attached to the feature. It is attached to the product behavior covered by the production commitment.**

That matters because the implementation can change:

- model;
- prompt;
- orchestration;
- architecture;
- deterministic logic;
- user interaction.

The intended behavior can remain stable while all of those change.

Sometimes production evidence shows that the intended behavior itself was wrong. The finding then goes back into Discovery.
