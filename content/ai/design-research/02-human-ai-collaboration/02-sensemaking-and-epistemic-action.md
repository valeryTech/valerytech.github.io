---
draft: false
toc: true
description: "Connects investigation to epistemic action and sensemaking: people and AI revise representations, hypotheses, and beliefs, with stable interface projections making the underlying computation inspectable."
title: "02 Sensemaking And Epistemic Action"
linkTitle: "02 Sensemaking And Epistemic Action"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## Sensemaking


The initial distinction maps almost exactly onto a line of research that separates **acting on the world** from **acting to improve what we know about the world**.

A particularly useful starting point is Kirsh & Maglio's distinction between **pragmatic action** and **epistemic action**. Pragmatic actions move you toward an external goal; epistemic actions expose information, reduce uncertainty, or make reasoning easier. ([DOI](https://doi.org/10.1207/s15516709cog1804_1?utm_source=chatgpt.com "On Distinguishing Epistemic from Pragmatic Action - Kirsh - 1994 - Cognitive Science - Wiley Online Library"))

So a human-AI collaboration can have an explicitly epistemic objective:

> human + system -> better representation / mental model / hypotheses / calibrated beliefs

rather than:

> human + system -> completed external task

Several research traditions fit this.

|Tradition|What the collaboration is trying to produce|
|---|---|
|**Sensemaking**|A coherent representation of a messy information space|
|**Epistemic action / external cognition**|Better conditions for human reasoning|
|**Knowledge building / epistemic agency**|Better explanations, theories, and shared knowledge|
|**Distributed cognition**|Cognition spread across people, representations, and tools|
|**Visual analytics**|Insight through interaction with computational representations|
|**Human-AI collaborative sensemaking**|Human and AI iteratively construct and challenge interpretations|
|**Scientific discovery / hypothesis support**|Hypotheses, evidence relations, uncertainty, alternative explanations|

The working interpretation is that **sensemaking** is closest to the proposed approach.

Russell, Stefik, Pirolli & Card's classic definition is very relevant: sensemaking involves searching for a useful **representation** and encoding information into that representation so that questions become answerable. The representation itself is part of the work. ([Mark Stefik](https://www.markstefik.com/wp-content/uploads/2014/04/1993-Cost-Structure-of-Sensemaking1.pdf?utm_source=chatgpt.com "INTERCHI'93 -- 24-29 April 1993"))

That gives you a different interaction loop from the normal agent model:

```text
Agent/task model

intent
  ↓
plan
  ↓
execute
  ↓
external result
```


versus:

```text
Sensemaking model

observe
  ↓
organize evidence
  ↓
construct hypothesis/model
  ↓
notice contradictions/gaps
  ↓
seek more evidence
  ↓
revise model
  ↺
```


The "product" of the second loop may never be an action. It may simply be: _I now understand why this system behaves this way._

## 11. The visual UI can be generated from the program


This gets us back to Hebbia.

Program:

```text
documents
| map(extract_terms)
```


naturally renders as a Matrix.

Program:

```text
claims
| find_conflicts
```


might render as a graph.

Program:

```text
events
| sort(date)
```


renders as a timeline.

Program:

```text
evidence
| group(authority)
```


renders as a hierarchy/table.

So UI becomes:

```text
program
+
execution state
+
data types
    ↓
appropriate projection
```


The system doesn't generate arbitrary UI from scratch.

It chooses and composes stable components according to the structure of the computation.
