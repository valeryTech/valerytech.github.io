---
draft: false
toc: true
description: "Working synthesis of workflow decomposition and AI design choices, distinguishing task-level opportunity assessment, human-AI responsibility allocation, and coherent candidate workflows before selecting models or automation levels."
title: "Notes"
linkTitle: "Notes"
---

Proposed stage set:

1. **Model the Current Task and Workflow**
2. **Design the Human-AI Work Allocation**
3. **Specify AI Use Cases and System Behaviour**
4. **Map the Solution Space** - Data - Intelligence - AI usage pattern - UX and control - Governance
5. **Design the End-to-End AI Workflow**
6. **Design Evaluation and Acceptance**
7. **Prototype, Evaluate, and Iterate**

Open question: what kind of work does this sequence describe?

User journey -> task/substep decomposition -> automation(value/feasibility/desirability) assessment -> human-AI labour distribution -> automation level -> solution design

**Understand what problem we're solving**

find representation(s)

## system-wide flow

### Map the User Journey


Map the user journey, break it into tasks or substeps

(?) Model the current workflow and decompose it

starts with a relatively high-level user journey, breaks it into tasks

Recognize that the overall process contains many tasks and is too large to automate completely.

Views:

- The user journey is used as an automation-opportunity map later.

Product builders should:

1. decompose the task into components;
2. analyze which components are best performed by AI;
3. integrate the selected AI automations into the users' workflow.

That means the book primarily models the workflow to answer:

> **Where in the journey should AI be introduced?**

It does not yet answer in detail: **How exactly does information and responsibility move through every current task?**

The detailed modelling of actors, inputs, outputs, handoffs, decisions, and exception paths would be an extension

Design terminology: AI design option map; possible AI interventions

### Mapping AI design options


using 'The AI design toolbox'

Identify Automation and Augmentation Opportunities; Navigating the AI design landscape

identify which parts are suitable for AI automation or augmentation

evaluates where AI creates the greatest payoff

Select a small number of tasks or stages for the initial product.

The book's wording is particularly relevant:

- the opportunity must be "further specified" before design;
- the team must "frame and delimit the substeps" that AI could address;
- the full process is too complex to automate;
- not all steps are equally suitable for automation;
- some steps remain better performed by humans.

**Constructing solution space**

Assessing the workflow and its components

For each stage or task, the book asks whether AI use is attractive along three dimensions: Value, Feasibility and Desirability

The current journey is transformed into an **AI opportunity assessment matrix**. In the example, "report composition" becomes the selected opportunity because it scores well on value, feasibility, and desirability.

Working interpretation: this identifies the **candidate solution space**--the set of coherent future AI-enabled workflows or system configurations.

Possible next step: construct a set of future workflows or other representations.

### Decision Making


Decide which work should be automated and which should remain human work. How it should be automated?

So, we estimate each step - E(f_i). But perhaps we should introduce other factors and parameters here? Context parameters, function space parameters?, system-wide parameters?

Source excerpt from Lipenkova:

When integrating AI into a product, consider the appropriate interface type (graphical, conversational, or hybrid) and degree of automation (assisted, augmented, or autonomous intelligence). These decisions should be aligned with your business strategy, resources, and team expertise.

Furthermore, you should optimize human-AI collaboration by using both strengths, such as AI's data processing capabilities and humans' intuition and ethical judgment.

Assess those candidates using:

    - value;
    - feasibility;
    - desirability.

# var

## System-wide Org


The source organizes the overall journey into three macro-phases: **Discovery -> Development -> Adoption**.

Its operational timeline uses: **Discovery -> Data and model preparation -> Pilot and testing -> Full rollout -> Continuous improvement**.

## How to model a socio-technical system?


Open questions: how should a system with multiple actors, goals, and workflows be modeled? Should the model include system effectiveness?

So we could have different representations depending on our needs.

## Degree of automation


The degree of automation and augmentation is a **design decision**, not merely an opportunity-prioritization criterion.

The selected automation boundary determines:

- whether the system needs predictive, generative, or agentic intelligence;
- whether an LLM is directly exposed to users;
- whether tool use is necessary;
- whether planning and memory are required;
- whether the interface should support suggestions, editing, approval, or monitoring;
- what data and confidence signals are necessary;
- what evaluation metrics matter;
- what risks and controls apply.

Therefore, model selection and LLM workflow design should follow *workflow decomposition* and *human-AI allocation*, rather than precede them.

## Reflection: build a method


Method proposal: first list the activities, group them, then name and frame the stages. The grouping may differ by use case.

## Step Estimation


For each stage or task, the book asks whether AI use is attractive along three dimensions.

### Value


The book considers:

- time spent on the manual task;
- frequency of the task;
- AI's comparative advantage;
- higher-value work users could perform if the task were reduced or delegated.

For example, writing report sections is valuable to support because sustainability managers may be stronger at planning, implementation, and stakeholder engagement than at drafting report text.

### Feasibility


The book asks:

- whether the task suits pattern-based AI;
- whether it requires human-like judgment;
- whether an existing model or framework can support it;
- what level of accuracy AI could reach;
- how much human intervention would remain necessary.

It explicitly warns that extensive oversight can eliminate the efficiency benefit of automation.

### Desirability


The book examines:

- whether users actually want AI support;
- whether they would feel relieved by delegation;
- whether automation would remove control;
- whether users would feel excluded from professionally important decisions.

This dimension influences whether AI should assist, collaborate, or take fuller control.

## AI design option map


Proposed name for the checklist or toolbox: **AI design option map**.

It contains:

- design dimensions;
- available choices within each dimension;
- constraints and trade-offs;
- questions that help teams choose among the options.

For example:

|Design dimension|Options|
|---|---|
|Intelligence|Rules, predictive AI, generative AI, agentic AI|
|Interaction|Graphical, conversational, hybrid, generative|
|Human involvement|Assisted, augmented, autonomous|
|Data|Structured, unstructured, labeled, unlabeled|
|Governance|Human review, guardrails, access controls, monitoring|

The map does not yet define a solution. It supplies the **variables from which candidate solutions can be constructed**.

## Candidate solution space


Terminology proposal: reserve _solution space_ for complete, internally coherent future configurations:

\[\mathcal{S} = \{   W_{AI}^{1},   W_{AI}^{2},   \dots,   W_{AI}^{n}   \}\]

Each \(W_{AI}^{i}\) represents a possible future workflow or system in which specific AI choices have already been combined.

For example:

- **Configuration A:** predictive classifier, backend integration, graphical UI, human approval;
- **Configuration B:** RAG assistant, hybrid UI, augmented collaboration, citation requirements;
- **Configuration C:** agentic workflow, tool access, approval gates, audit logging.

## Possible layered structure for delivery


First, solve the system-wide problem and select a candidate solution.

Then design the workflow-level AI system, which may itself be complex. For example, one workflow step could require a system with a hybrid API, several LM components and workflows, RAG subsystems, and a tool set.

## Library sources


- Lipenkova 2025, *The Art of AI Product Development: Delivering Business Value*
