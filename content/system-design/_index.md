---
draft: false
toc: true
title: "System Design"
aliases:
  - "/system-design/about/"
description: "System design as a pattern flow for designing and prototyping systems: context, forces, design questions and their options, techniques that test a choice, decisions with triggers, and cases. Interview preparation is one route through it."
linkTitle: "System Design"
---

These notes treat system design as a pattern flow you can walk while prototyping, reviewing, or explaining a system. Each step asks a question, offers options, and records what the chosen option leads to. A trigger records when to revisit a decision.

Interview preparation is one route through the same flow, compressed into an hour.

## The flow

```mermaid
flowchart TD
  C[Context and goal] --> F[Forces]
  F --> P[Structure patterns: design question hubs]
  F --> T[Process techniques: spike, POC, walking skeleton]
  P <--> T
  P --> M[Mechanisms]
  T --> D[Decision and trigger]
  M --> X[Cases]
  D --> X
  D -. trigger fires .-> F
```


Structure patterns say *what to build*. Process techniques say *how to learn whether it is right*. A prototype is where the two meet: a walking skeleton carries the default choices, and a spike or proof of concept tests the risky one.

| Step | Question it answers | Notes |
| --- | --- | --- |
| Context and goal | What outcome, for whom, inside which boundary? | [Design principles]({{< ref "system-design/design-principles" >}}#start-with-the-context), [backward design]({{< ref "engineering/progressive/backward-design-der" >}}), [goal-oriented architecture]({{< ref "engineering/progressive/goal-oriented-architecture/grounded-in-user-goals" >}}) |
| Forces | Which qualities and constraints decide this design? | [Non-functional requirements]({{< ref "system-design/nfr" >}}), [catalog of architectural characteristics]({{< ref "engineering/architecture/characteristics" >}}) |
| Structure patterns | Which option answers this design question, and what does it lead to? | [Pattern map]({{< ref "system-design/elements/pattern-map" >}}), [hubs by question]({{< ref "system-design/elements" >}}) |
| Process techniques | Which technique resolves the riskiest open question? | [Lifecycle techniques]({{< ref "engineering/architecture/techniques" >}}), [delivery techniques guide]({{< ref "engineering/delivery-techniques/engineering-delivery-techniques-guide" >}}) |
| Decision and trigger | What did we choose, why, and what would make us revisit it? | [Compare choices]({{< ref "system-design/design-principles" >}}#compare-choices-in-their-setting), [trade-off analysis]({{< ref "engineering/topics/trade-offs" >}}), [problem-solving checklist]({{< ref "system-design/problem-solving-checklist" >}}), [defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}) |
| Mechanisms | How does this component actually work? | [Engineering topic notes]({{< ref "system-design/elements/pattern-map" >}}#where-detail-lives), [platform and delivery]({{< ref "engineering/platform" >}}) |
| Cases | Where has this been applied? | [Practice cases]({{< ref "system-design/projects" >}}), [AI and RAG designs]({{< ref "system-design/elements/pattern-map" >}}#same-patterns-in-other-domains) |

## Routes


| I want to... | Path through the flow |
| --- | --- |
| Prototype a system quickly | [Defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}) -> the hub for the riskiest question -> a [technique]({{< ref "engineering/architecture/techniques" >}}) to test it -> record the decision with the [case template]({{< ref "system-design/projects/case-template" >}}). |
| Review or improve a design | [Design principles]({{< ref "system-design/design-principles" >}}) -> [forces]({{< ref "system-design/nfr" >}}) for the operations that matter -> the costs and *Leads to* of the relevant [hubs]({{< ref "system-design/elements" >}}) -> [problem-solving checklist]({{< ref "system-design/problem-solving-checklist" >}}). |
| Design an AI or RAG system | [Same patterns in other domains]({{< ref "system-design/elements/pattern-map" >}}#same-patterns-in-other-domains) -> the RAG runtime layers and the [testable boundary map]({{< ref "engineering/eng-exp/design-pressure" >}}) -> the matching hubs. |
| Prepare for an interview | [Interview preparation]({{< ref "system-design/interview" >}}): study plan, frameworks, communication, and mock review. |
| Practice on a case | [Practice cases]({{< ref "system-design/projects" >}}) with the [case template]({{< ref "system-design/projects/case-template" >}}). |
| Find courses, books, and talks | [Resources]({{< ref "system-design/resources" >}}). |

## How the folders map to the flow


- [`elements/`]({{< ref "system-design/elements" >}}): structure patterns as design questions, the [pattern map]({{< ref "system-design/elements/pattern-map" >}}), and [defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}).
- [`nfr/`]({{< ref "system-design/nfr" >}}): forces.
- [`projects/`]({{< ref "system-design/projects" >}}): cases.
- [`interview/`]({{< ref "system-design/interview" >}}): the interview route.
- Top level: [design principles]({{< ref "system-design/design-principles" >}}), the [problem-solving checklist]({{< ref "system-design/problem-solving-checklist" >}}), and [resources]({{< ref "system-design/resources" >}}).
- Process techniques and mechanisms live in the [engineering notes]({{< ref "engineering" >}}); the flow links to them rather than copying them.

[Collected notes]({{< ref "system-design/to-sort" >}}) keep reading excerpts and design-review material. [The archive]({{< ref "system-design/archive" >}}) preserves earlier versions of rewritten notes.
