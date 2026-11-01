---
draft: false
toc: true
description: "A speculative argument proposes language-driven capability composition and temporary review interfaces, lowering the economic threshold for one-off software while retaining domain operations, semantics, and business constraints."
title: "08 Generated Workspaces And Application Composition"
linkTitle: "08 Generated Workspaces And Application Composition"
---
# Generated workspaces and application composition


The retained passage proposes consequences of interpreting language requests through existing operations. It discusses interface design costs, temporary tools and review interfaces, and composition across applications. The economic and architectural claims remain hypotheses rather than measured results or accepted product requirements.

The [opening request and central argument]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}#retained-dialogue) remain in the language-intent note. The [candidate-plan passage]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#natural-language-requests-and-candidate-plans) and [instruction-boundary passage]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#instructions-and-untrusted-data-in-language-interfaces) remain in existing design-research notes.

Related notes propose [stable interface components]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}), [composable investigation workspaces]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}), and [application state and computation]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}). The retained passage does not settle how generated interfaces should relate to those proposals.

Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition-comments" >}}) for interface costs, stable controls, and cross-application meaning. The source overview (archived source 019) links the complete split, and the [audit map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-7-natural-language-interface-dialogue) records the original positions. Product and research claims were not independently checked during the split.

## Retained consequences


<!-- Generated-workspace consequences begin below. -->

## The first large consequence: UI surface area can shrink


Today's applications encode capabilities twice.

Once in the backend:

```text
APIs / domain model / business logic
```


and again in the interface:

```text
pages / menus / forms / buttons / flows
```


The second representation is expensive.

Someone has to predict which tasks people will perform and create an interface for each one.

Natural-language interpretation changes this economics.

The application could expose a relatively stable set of underlying capabilities:

```text
Customer
Invoice
Payment
Email
Calendar
Search
Report
...
```


while the model dynamically finds a path through them.

So a substantial amount of software could move from:

```text
prebuild every workflow
```


toward:

```text
expose capabilities
+
interpret user intent
+
construct workflow
```


This doesn't eliminate application design.

It changes what developers design.

Schemas, permissions, semantics, operations and invariants become more important.

The exact screen becomes somewhat less important.

## The second consequence: one-off computation becomes cheap


There's a class of software we currently don't write because the task isn't valuable enough to justify writing software.

For example:

> "Take these 300 CSV files, identify which ones correspond to the same customer even when the names differ, merge their transaction histories, generate a page for each suspicious match so I can approve it, then produce the consolidated dataset."

Traditionally you choose between:

```text
manual work
```


and:

```text
write a program + build some temporary UI
```


There is a large economic gap between them.

LLMs can reduce that gap.

The system can generate:

```text
parser
+
matching logic
+
temporary review UI
+
workflow
```


for a task that may only happen once.

Google's generative-UI research is directly heading here: the system constructs task-specific interactive experiences at runtime, and Google says these ideas are now appearing in Search and Gemini. ([Google Research](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/?authuser=6&hl=sr&utm_source=chatgpt.com "Generative UI: A rich, custom, visual interactive user experience for any prompt"))

That could be one of the largest long-term effects.

Software stops being economical only when thousands of people need the same interface.

Software can increasingly be created for:

```text
one company
one team
one person
one task
```


and possibly discarded afterward.

## The third consequence: applications can become more composable


Currently I have to learn:

```text
Jira's conceptual model
Salesforce's conceptual model
Excel's conceptual model
GitHub's conceptual model
AWS's conceptual model
...
```


Each system exposes its own UI vocabulary.

Language models potentially create a semantic layer across them.

I can express:

> Find all production incidents related to the payment service since the last release, check whether corresponding GitHub issues exist, and summarize the recurring causes.

The model translates concepts:

```text
production incidents
last release
payment service
corresponding issue
recurring cause
```


into the different schemas of several systems.

That is substantially different from today's integration model.

Today integration is mainly:

\[API_A \leftrightarrow custom\ code \leftrightarrow API_B\]

A future version becomes:

\[
\text{semantic intent}

\rightarrow

\begin{cases}

API_A \\

API_B \\

API_C

\end{cases}
\]

with a model performing some of the schema matching dynamically.

This is one reason tool-using models are more important to me than autonomous "agents."

Toolformer and ReAct are early demonstrations of the underlying mechanism. ([arXiv](https://arxiv.org/abs/2302.04761?utm_source=chatgpt.com "Toolformer: Language Models Can Teach Themselves to Use Tools"))

## Economics of small and temporary workflows


The following passage from the language-interface architecture reply (archived source 020) extends the earlier cost argument. The complete staffing example, cost diagrams, proposed uses, and Flash Fill reference remain unchanged. The source supplies an illustration rather than a measured cost comparison.

The [architecture overview]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) retains the domain-boundary and engineering discussion. Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition-comments" >}}#costs-of-temporary-workflows) for review costs and the difference between a disposable interface and retained work. The [stage 8 audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-8-language-interfaces-and-architecture) records the original range.

<!-- Small-workflow economics passage begins below. -->

# The economic consequence: the long tail of software gets much larger


Software is currently economical when a workflow is repeated enough.

Suppose building a decent internal application costs:

```text
2 engineers × 3 months
```


Then a workflow performed by twelve employees three times a year probably never gets software.

It stays:

```text
spreadsheet
+
copy/paste
+
email
+
tribal knowledge
```


Now imagine the cost of creating a task-specific interface and workflow approaches minutes.

The threshold changes.

```text
Today

value of repeated task
        │
        │        build software
        │       /
        │      /
        │_____/
              cost

Future

value of task
        │
        │   synthesize
        │  /
        │_/
```


Suddenly it's economical to create software for:

```text
one department
one project
one investigation
one dataset
one meeting
one decision
```


and then throw it away.

This, to me, is a much bigger idea than "AI coding makes engineers faster."

It means the **minimum economic size of a software problem falls dramatically**.

Flash Fill was already a tiny example: a user demonstrates a transformation that would not justify hiring a programmer, and a program is synthesized for that specific need. ([Microsoft](https://www.microsoft.com/en-us/research/publication/automating-string-processing-spreadsheets-using-input-output-examples/?lang=ko-kr&utm_source=chatgpt.com "Automating String Processing in Spreadsheets using Input-Output Examples - Microsoft Research"))

LLMs potentially extend that from string manipulation to heterogeneous software systems.
