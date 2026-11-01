---
draft: false
toc: true
description: "Systems differ in where their variability lives: in the request, in the flow of work, or in the data processed; locating it shows where the difficulty, failure modes, and test effort concentrate."
title: "Sources Of Variability"
linkTitle: "Sources Of Variability"
---

Design question: Where does the variability a system must handle actually come from?

A common picture of an AI system starts with an open-ended user query that must be interpreted, then an agent deciding what to do. Many useful systems look nothing like that. An auditor clicks a button to run a predefined report, the analysis steps are fixed, and yet the system is hard to build, because the journal-entry population it receives differs a great deal from one engagement to the next.

**Sources of variability** is a proposed working term for this. It separates three axes that are easy to merge under "complexity":

| Axis | Question | Low | High |
| --- | --- | --- | --- |
| **Request variability** | How much must the system work out what is being asked? | A button or form selects a predefined operation; parameters are typed and validated. | A free-form goal that is ambiguous, underspecified, or changes during the interaction. |
| **Flow variability** | How much of the sequence of steps is decided at runtime? | A fixed pipeline: the same phases in the same order every run. | The system selects, orders, repeats, and abandons steps based on intermediate results. |
| **Data variability** | How much do the content and condition of the material differ between runs? | One record of a known schema, complete and consistent. | Populations that differ in size, structure, completeness, quality, available comparators, and internal contradictions. |

The axes are independent. A system can sit low on one and high on another, and the combination says more than any single "complexity" label.

### How the axes relate to existing dimensions


The axes are a view over dimensions the notes already have, not a new dimension. Each one is a case of something already recorded: request variability of the interface and placement, flow variability of the operating regime, data variability of the inputs. What the view adds is one question asked of all three: what differs between runs? The answer says where tests and safeguards should go.

**Data variability is a case of the inputs dimension.** The [classification note]({{< ref "ai/system-types/classification/ais-classification" >}}) records *Inputs and data*, and its input-complexity values describe the kind of input: structured records, free text, documents, images, streams. The note already asks for more than the kind: temporal behavior, sensitivity, provenance, trust boundary. How much the inputs differ between runs belongs in the same place, and nothing records it there yet. It is the property that matters for the audit report. A structured table of journal entries is simple as a modality and can still vary enormously: 3 sources or 300, prior periods present or missing, totals that reconcile or don't.

**Request variability is not data variability, although both arrive as input.** The request is what the user asks for. The data is what the system works on. A one-click request can carry a very variable dataset, and a highly variable natural-language question can be answered from a small, stable knowledge base.

**Flow variability is related to [operating regimes]({{< ref "ai/system-types/project-examples/operating-regimes" >}}), but not the same.** A regime describes how work progresses and is controlled. A bounded workflow implies low flow variability; delegated execution implies high flow variability. But a regime says little about the other two axes. A booking workflow and a fixed audit report are both bounded, yet they differ sharply in data variability, and so in where their difficulty lies.

**A simple request still carries scope.** A button click typically fixes entity, period, filters, and population. Request variability is low, but those parameters must still be preserved through every step. Low variability does not mean nothing to get right.

**In a hybrid interface, request variability belongs to each entry point.** Picture a side panel of predefined buttons next to a chat box. A button fixes the analysis and its parameters. The chat box takes whatever the buttons do not cover. One product then has two request profiles. Request variability is set by design, per entry point, not by the domain. This is the hybrid in What LLMs are good at: chat takes the open requests, buttons take the fixed actions.

### Placing the cases


A first placement of the [eight cases]({{< ref "ai/system-types/project-examples/ai-project-examples-and-design-model" >}}). It is tentative, and a case with several modes gets one row per mode, since the modes sit in different places.

| Case | Request | Flow | Data |
| --- | --- | --- | --- |
| [Closed-set task assistant]({{< ref "ai/system-types/project-examples/cases/closed-set-task-assistant" >}}) | Medium: natural language mapped onto a closed set of tasks | Low to medium: application-enforced state machine | Low |
| [General-purpose AI assistant]({{< ref "ai/system-types/project-examples/cases/general-purpose-ai-assistant" >}}) | High | Medium | Varies with what the user supplies |
| [Context-aware support assistant]({{< ref "ai/system-types/project-examples/cases/context-aware-support-assistant" >}}) | Medium to high | Low to medium | Medium: account state, history, configuration |
| [Analysis: predefined report]({{< ref "ai/system-types/project-examples/cases/ai-assisted-analysis-and-investigation-systems" >}}) | Low: a button | Low: fixed phases | **High** |
| [Analysis: investigation]({{< ref "ai/system-types/project-examples/cases/ai-assisted-analysis-and-investigation-systems" >}}) | Medium: the question is known but refined | Medium to high: next step depends on evidence | High |
| [Clinical and domain copilots]({{< ref "ai/system-types/project-examples/cases/clinical-and-domain-specific-copilots" >}}) | Low to medium: defined checks and tasks | Low to medium | High: transcripts, records, receipts |
| [Agentic operations and coordination]({{< ref "ai/system-types/project-examples/cases/agentic-operations-and-coordination" >}}) | Medium | **High** | Medium: responses from people and services |
| [Analytical engine: predefined pipeline]({{< ref "ai/system-types/project-examples/cases/analytical-engines-and-programmable-environments" >}}) | Low | Low | High |
| [Programmable environment]({{< ref "ai/system-types/project-examples/cases/analytical-engines-and-programmable-environments" >}}) | High | High | High |
| [Coding agents]({{< ref "ai/system-types/project-examples/cases/coding-agents-and-harnesses" >}}) | High | High | High: repositories and execution feedback |

The predefined audit report is the clearest case of variability concentrated on one axis: low request, low flow, high data.

### Why the location matters


**Difficulty and failure modes follow the high-variability axis.**

- High request variability puts the risk in interpretation: misread intent, unhandled [Ambiguity]({{< ref "ai/design/ambiguity" >}}), wrong routing, clarification that comes too late or too often.
- High flow variability puts the risk in control: wrong step selection, lost state, loops, unrecoverable partial actions, permissions crossed mid-trajectory.
- High data variability puts the risk in evidence handling: unnoticed gaps, invented comparators, overstated conclusions from thin or contradictory data, scope that silently widens, and plausible narratives filling what the data does not show.

**Test data should sample the high-variability axis.** For a fixed report, varying the prompt or request wording tests almost nothing. The test set is organized by *data scenario*: stable, new item, missing prior period, sparse population, truncated input, conflicting views. For a general assistant, the test set is organized by request. For an agent, by trajectory and environment behavior.

**Design can move variability between axes, not always remove it.**

- Buttons and forms remove request variability by replacing interpretation with selection.
- A fixed pipeline removes flow variability by deciding the steps in advance.
- A deterministic pre-step that turns raw data into a bounded evidence model (counts, deltas, shares) removes *computational* variability from the LLM's work. It does not remove *evidential* variability: a missing prior period is still missing, and the LLM must still notice and report it.

What cannot be designed away has to be handled explicitly and tested. In the audit report, that is almost entirely the data.

### Parallels with the builder's model


What LLMs are good at classifies systems from the builder's side: where the model sits, which interface it has, and what it may change. Those system-level choices act on the request and the flow. Data variability is not among them, but the ideas notes do handle it, one level down, in the primitives.

| Builder's model | Axis it acts on | How |
| --- | --- | --- |
| **Placement**: user talks to it -> writes something software runs -> fixed backend task -> batch | Request | The risk it ranks is exposure: what the user can put in, and what reaches them unchecked. Going down the table, the user decides less of what is asked. The content of the data is not narrowed. |
| **Interface**: chat, screens, or hybrid | Request | Chat is for request spaces too large for screens ([language as an interface]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}})). A hybrid sets request variability per entry point. |
| **Assistant types**: who controls the steps (assistant types) | Flow | A predefined workflow fixes the steps. An agent chooses them. |
| **What the model may change**: inform -> act within limits | None of the three | Authority is separate: a fixed pipeline can be read-only or may write; an open agent can be held to drafts. |
| **Primitives**: Judge (P5), Decide sufficiency (P6); guarantees G4 Sufficiency, G5 No implied completeness | Data, and request | Judge keeps, excludes, or marks a conflict. Decide sufficiency acts, asks, or abstains and names the gap. Sufficiency can concern the request (is it clear what is asked?) or the evidence (is there enough to say this?). |

So the audit report is not a new kind of system. It is a case of the evidence-and-decision layer, with capture reduced to a button. In the primitives' product table, Capture and Act differ per product, while Ground, Judge, and Sufficiency are the reusable layer. A button leaves Capture nothing to interpret, so the load falls on Judge and Sufficiency. The report helper's principles (foundations) match the layer's guarantees:

- explicit insufficiency is G4;
- coverage honesty is G5;
- provenance is G2;
- a conflict kept unresolved is Judge's *conflict* outcome.

What the variability axes add is the reason a system leans on that layer. The more the data varies between runs, the more of the work is Judge and Sufficiency, and the more of the test set is data scenarios.

### Open questions


- Is a fourth axis needed for **context variability**, such as audit context, expected patterns, and known events, or is that part of data?
- Should **environment variability** (tools and external services behaving differently between runs) be separate from flow variability? An agent's flow varies partly because its environment does.
- Can the axes be scored more precisely than low, medium, and high, for example by the number of distinct scenarios a test set needs to cover?
