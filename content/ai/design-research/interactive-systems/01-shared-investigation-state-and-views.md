---
draft: false
toc: true
description: "An initial proposal makes matrices, graphs, and reports projections of common investigation objects, with people and agents coordinating through a shared blackboard and an inspectable contribution history."
title: "01 Shared Investigation State And Views"
linkTitle: "01 Shared Investigation State And Views"
---
# Shared investigation state and views


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Editorial navigation added on 2026-04-01. The retained passage begins below. -->

The passage continues the opening reply in the Matrix case note. It proposes shared investigation objects, several views over the same state, and collaboration through recorded contributions.

The reply continues in [stable interface components]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}). The later [composition dialogue]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}) revises the initial preference for a fixed graph model and should be read with the proposal below.

The [comments]({{< ref "ai/design-research/interactive-systems/00-index-comments" >}}) distinguish the candidate object model from an accepted ontology. The [reassembly map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}) records the passage's original range.

<a id="original-reply-continued"></a>

## Proposal, continued


The proposed extension of the idea concerns the UI.

The recommendation is not to replace Matrix with a generated UI. The proposal is to make Matrix **one view onto a common investigation model**.

The underlying system might contain typed objects such as:

```text
Source
Question
Task
Claim
Evidence
Contradiction
Entity
Decision
Parameter
Transformation
Agent
Human
Artifact
```


connected by typed edges:

```text
question
  └── decomposes_into → question

task
  └── produces → evidence

evidence
  └── supports → claim

evidence
  └── contradicts → claim

claim
  └── depends_on → claim

source
  └── supersedes → source

agent
  └── executed → task

human
  └── approved → claim
```


Then you can project the same state into whatever representation makes sense.

For repetitive comparison:

```text
Matrix
```


For investigation structure:

```text
Graph
```


For evidence:

```text
Evidence table
```


For chronology:

```text
Timeline
```


For source precedence:

```text
Authority tree
```


For unresolved work:

```text
Task board
```


For the final product:

```text
Report
```


For one complex claim:

```text
Claim card
────────────────────
Conclusion

Supporting evidence
Contradicting evidence
Qualifications
Authority
Coverage
Open questions
```


That feels more promising to me than trying to invent arbitrary interfaces from scratch.

The user could even ask:

> Show me why we believe that retries must use exponential backoff.

and the UI dynamically chooses a claim/evidence view.

Then:

> Compare all retry recommendations across our ADRs.

and the same underlying objects become a Matrix.

Then:

> How did we arrive at this rule?

and it becomes a graph.

So the architecture is:

```text
                 Investigation state
                  /      |       \
                 /       |        \
             Matrix    Graph     Report
               |         |          |
               └─────────┼──────────┘
                         │
                    same objects
                    same provenance
```


This is much stronger than having separate "Matrix mode", "Graph mode", etc. that each maintain their own state.

The multi-agent proposal also fits this model very well, with one warning.

The recommendation is not to build:

```text
Agent A talks to Agent B
Agent B talks to Agent C
Agent C talks to Agent A
...
```


Free-form multi-agent conversation becomes hard to inspect and hard to reproduce.

The proposal is to have agents collaborate through the shared investigation state.

For example:

```text
                    Investigation Graph
                           ▲
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
 Retrieval Agent    Evidence Agent      Critic Agent
       │                   │                   │
       ▼                   ▼                   ▼
  adds candidates      adds evidence     adds objections
```


Perhaps:

```text
Planner
   ↓
creates tasks

Retriever
   ↓
attaches sources

Extractor
   ↓
creates evidence

Synthesizer
   ↓
creates claims

Critic
   ↓
finds contradictions / missing support

Coverage Agent
   ↓
checks corpus completeness

Authority Agent
   ↓
resolves source precedence

Human Expert
   ↓
changes constraints / approves / adds questions
```


They are effectively multiple workers operating on a shared blackboard.

That gives you something Hebbia's Matrix begins to approximate, but a graph model could make considerably more general.

And you could keep a complete event stream:

```text
14:31 Planner created Q12
14:31 Retriever screened 738 documents
14:32 Retriever attached D17, D51, D93
14:32 EvidenceAgent extracted E82
14:33 CriticAgent disputed C14 using E91
14:34 Human changed authority of D51
14:34 Synthesizer recomputed C14
```


Now "agent collaboration" becomes inspectable.
