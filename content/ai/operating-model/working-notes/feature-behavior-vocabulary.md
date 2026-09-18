---
draft: false
toc: true
title: "Feature Behavior Vocabulary"
linkTitle: "Feature Behavior Vocabulary"
---
## 3. Feature is still useful, but it is not the delivery unit


The word "feature" remains useful.

A feature is useful for talking about what the user sees:

> One-shot transaction capture.

Underneath the feature, engineering is delivering a set of behaviors:

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


Each behavior has a quality envelope:

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


The terms are distinct:

**Feature** = product surface.

**Functional scope** = situations the product supports.

**Behavior** = what the product should do in those situations.

**Production commitment** = the obligation to make that behavior dependable.

This distinction is especially useful for AI because "the feature exists" reveals little about whether it works well enough.
