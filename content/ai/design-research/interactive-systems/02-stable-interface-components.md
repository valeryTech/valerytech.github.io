---
draft: false
toc: true
description: "A proposal limits dynamic workspaces to familiar composable controls, then considers task-specific projections and domain-supplied components, preserving a stable interaction grammar while alternating language with direct manipulation."
title: "02 Stable Interface Components"
linkTitle: "02 Stable Interface Components"
---
# Stable interface components


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Editorial navigation added on 2026-10-01. The retained passage begins below. -->

The passage continues the [shared-state reply]({{< ref "ai/design-research/interactive-systems/01-shared-investigation-state-and-views" >}}). The original user question about composing interface blocks is in the Matrix case note.

The proposal limits dynamic interface construction to familiar components. The next [composition dialogue]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}) challenges the risk that a fixed representation could restrict investigation.

The [comments]({{< ref "ai/design-research/interactive-systems/00-index-comments" >}}) separate operations, shared state, and views. The [reassembly map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}) records the passage's original range.

<a id="original-reply-continued"></a>

## Proposal, continued


There is one part of the "hybrid UI generated on the fly" proposal that needs caution.

Hebbia's Matrix has a huge advantage because **the interaction grammar is stable**.

After ten minutes the user understands:

```text
rows = things
columns = operations/properties
cells = results
```


If the system keeps inventing a new interface for every question, the user has to relearn the workspace repeatedly.

So the proposal is to constrain dynamic UI generation to a small set of composable primitives:

```text
Matrix
Table
Graph
Tree
Timeline
Document
Evidence card
Source viewer
Filter
Control
Chart
Task list
```


The agent can compose them:

```text
┌──────────────────────┬───────────────────┐
│ Investigation Graph  │ Current Claim     │
│                      │                   │
│                      │ Evidence: 8       │
│                      │ Contradictions: 2 │
├──────────────────────┴───────────────────┤
│                 Matrix                   │
│                                         │
├─────────────────────────────────────────┤
│ Source viewer                            │
└─────────────────────────────────────────┘
```


That keeps the UI flexible while maintaining stable concepts.

The working interpretation is that the broader conceptual proposal is therefore:

> Hebbia built an AI spreadsheet for research.

You could investigate building an **interactive investigation environment**.

And the central abstraction becomes:

```text
Investigation =
    evolving graph of
    questions,
    tasks,
    sources,
    evidence,
    claims,
    people,
    agents,
    and decisions
```


with multiple synchronized views over it.

Then the original retrieval ideas--coverage, authority, provenance, abstention, iterative reframing--become properties of that investigation model rather than features bolted onto a search box.

That direction feels materially broader than "better Hebbia Matrix" while still taking the strongest lesson from Matrix: **give experts a visible, manipulable representation of the AI's work.**

## Task-specific views and trusted controls


The following passage from the language-interface architecture reply (archived source 020) retains the revenue-and-churn example, the language and direct-manipulation sequence, and the distinction between generated interfaces and supplied controls. The original transfer-confirmation example remains complete. The proposal does not establish that a sandbox or vetted component authorizes its resulting operation.

The [architecture overview]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) supplies the surrounding domain-boundary proposal. Read the [architecture comments]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries-comments" >}}#generated-interfaces-and-authorized-effects) for the relation between interface checks and execution. The existing [application-state comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}) concern revisions, jobs, and results behind a view. The [stage 8 audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-8-language-interfaces-and-architecture) records the original range. Product and research descriptions remain unverified claims from the saved reply.

<!-- Task-projection and trusted-control passage begins below. -->

## The UI becomes a projection of the task


Now we get to perhaps the most visible change.

Suppose you ask:

> Compare revenue and churn for enterprise customers over the last eight quarters and show me where the relationship changed.

Language was an excellent way to specify that.

Language is a terrible way to explore the result.

You probably want:

```text
chart
+
customer filters
+
date range
+
segment controls
+
table
```


Then you notice Q3 and drag the range or click a customer segment.

The interaction can alternate:

```text
language
   ↓
generated visual environment
   ↓
direct manipulation
   ↓
language
   ↓
updated environment
```


Google's 2026 Generative UI work is a concrete demonstration. Their dynamically generated interactive interfaces were strongly preferred to normal LLM text output, although human-designed interfaces still performed best. ([Generative UI](https://generativeui.github.io/static/pdfs/paper.pdf?utm_source=chatgpt.com "Generative UI: LLMs are Effective UI Generators"))

There is an important distinction here, though.

There are at least two possible kinds of dynamic UI.

One is:

```text
LLM generates arbitrary UI
```


Google is experimenting with this.

The other is:

```text
domain exposes trusted UI component
LLM decides when and where to use it
```


MCP Apps now implements the second model: tools can expose interactive forms, dashboards, visualizations and workflows that render inside an AI host, with the UI sandboxed from the containing application. ([Model Context Protocol](https://modelcontextprotocol.io/extensions/apps/overview?utm_source=chatgpt.com "MCP Apps - Model Context Protocol"))

The LLM hypothesis is that a mature architecture combines them.

Low-risk exploration:

```text
generate freely
```


High-risk interaction:

```text
compose vetted components
```


So a bank may expose a trusted:

```text
<TransferConfirmation />
```


while the surrounding financial-analysis dashboard is synthesized specifically for the research question.
