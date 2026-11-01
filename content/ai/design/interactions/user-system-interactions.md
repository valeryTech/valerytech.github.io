---
draft: false
toc: true
title: "User-System Interactions and Models"
description: "Maps the disciplines and artifacts needed to model interactions beyond intent labels, from journeys and service blueprints to workflow contracts, human control, policy, and evaluation."
linkTitle: "User-System Interactions and Models"
---
# interactions and models


Intents are a practical abstraction for describing and managing user-system interaction. They are especially useful as a routing and control layer in LLM products, where they help decide which workflow, tool, policy, or subsystem should handle a request. However, they should not be mistaken for the full representation of user meaning, because real interactions are often ambiguous, multi-intent, contextual, and evolving.

Treat interaction as the primary object, not just "prompts" or "queries." That is useful because AI products are not only about parsing user text. They are about managing a relationship between user goals, system capabilities, constraints, uncertainty, and outcomes.

Risk: "intent" can become too narrow if it is treated as the main explanatory layer. Intent usually answers:

> What is the user trying to do?

But product delivery often needs more than that. It also needs to know:

> What does the user already know?
> What does the system need to know?
> What tools or data are required?
> What level of risk is involved?
> How much autonomy should the system take?
> What would count as success?
> Is this a one-shot request or part of a larger workflow?

There are several **tools, lenses, and disciplines** for modeling and managing user-system interactions. Intent recognition is only one of them.

A useful way to organize the space is by asking:

> What part of the interaction are we trying to understand or control?

## 1. Human-centered design / HCI


This is the broadest discipline. It studies how people interact with systems, and how systems should be designed around human needs, limits, contexts, and goals.

Useful for:

> usability, mental models, affordances, error handling, accessibility, trust, satisfaction, task success.

Typical tools:

|Tool|What it helps model|
|---|---|
|User research|What users actually do, need, misunderstand, avoid, or value|
|Usability testing|Where interaction breaks|
|Personas|Important user segments and behavior patterns|
|Scenarios|Situations in which users interact with the system|
|Task analysis|Steps users take to complete a goal|
|Mental models|How users think the system works|

This is close to the ISO framing of human-centered design: designing interactive systems to be usable and useful by focusing on users, their needs, and human factors throughout the lifecycle. ([iso.org](https://www.iso.org/standard/77520.html "ISO 9241-210:2019 - Ergonomics of human-system interaction -- Part 210: Human-centred design for interactive systems"))

## 2. UX research and interaction design


UX looks more directly at the experience of using the product.

Useful for:

> user goals, friction, comprehension, flow, confidence, delight, abandonment, and perceived value.

Typical tools:

|Tool|What it captures|
|---|---|
|User journey maps|The user's process over time|
|Experience maps|A broader end-to-end human experience, not necessarily tied to one product|
|Empathy maps|What users think, feel, say, and do|
|Wireframes / prototypes|How interaction should happen|
|Heuristic evaluation|Common usability problems|
|Information architecture|How information and choices are organized|

Journey maps are especially useful because they show the process a person goes through to accomplish a goal, including actions, thoughts, and emotions. NN/g describes service blueprints as related but more organization-facing, showing the people, processes, and systems behind touchpoints. ([Nielsen Norman Group](https://www.nngroup.com/articles/ux-mapping-methods-study-guide/ "UX Mapping Methods: Study Guide - NN/G"))

## 3. Service design


Service design is useful when the "system" is not just software. Many AI products involve humans, APIs, support teams, documents, policies, databases, and operational handoffs.

Useful for:

> cross-functional workflows, frontstage/backstage actions, human handoff, support escalation, operational failure modes.

Typical tools:

|Tool|What it captures|
|---|---|
|Service blueprint|Frontstage user interaction plus backstage operations|
|Touchpoint map|Where the user interacts with the service|
|Ecosystem map|Actors, systems, tools, and data sources|
|Stakeholder map|Who participates in the service|
|Failure-mode map|Where service delivery can break|

For AI products, service blueprints are often more useful than intent taxonomies because they show what must happen behind the model: retrieval, authentication, tool calls, approvals, escalation, logging, and recovery. NN/g describes service blueprints as useful for complex experiences with multiple touchpoints or cross-functional effort. ([Nielsen Norman Group](https://www.nngroup.com/articles/ux-mapping-cheat-sheet/ "UX Mapping Methods Compared: A Cheat Sheet - NN/G"))

## 4. Conversation design


This discipline is directly relevant to chatbots, voice assistants, copilots, and LLM products.

Useful for:

> turn-taking, clarification, repair, tone, confirmations, fallback behavior, escalation, conversational state.

Typical tools:

|Tool|What it captures|
|---|---|
|Intent taxonomy|What the user appears to want|
|Entities / slots|Key variables needed to complete the task|
|Dialogue flows|Expected paths through a conversation|
|Repair patterns|What happens when the system misunderstands|
|Confirmation patterns|When the system should ask before acting|
|Conversation transcripts|Real interaction data for improvement|
|Prompt patterns|How the system should frame behavior|

In traditional NLU systems, intents and entities are often paired with flows or slots. Rasa's documentation, for example, describes commands that resemble intents and entities: starting a flow and setting slots such as origin and destination in a flight-booking case. ([Rasa](https://rasa.com/docs/learn/concepts/dialogue-understanding/ "Helping Your Assistant Understand Users | Rasa Documentation"))

## 5. Product management


Product management models interactions in terms of value, outcomes, prioritization, and business viability.

Useful for:

> what should be built, for whom, why now, what success means, what tradeoffs matter.

Typical tools:

|Tool|What it captures|
|---|---|
|Jobs to be Done|The underlying progress the user wants to make|
|User stories|Who wants what and why|
|Use cases|Functional interaction between actor and system|
|Product requirements documents|Expected behavior and constraints|
|Opportunity solution trees|Link between user needs and product bets|
|North-star metric|The product outcome that matters most|
|Funnel analysis|Where users drop off|

This discipline prevents a common AI-product mistake: over-modeling language while under-modeling value.

For example, the user intent may be:

> "summarize this document"

But the product job may be:

> "help me decide whether this contract is risky enough to send to legal."

Those are not the same.

## 6. Requirements engineering and systems analysis


This is the engineering-oriented discipline for specifying what the system must do.

Useful for:

> functional requirements, edge cases, dependencies, data needs, permissions, constraints, failure behavior.

Typical tools:

|Tool|What it captures|
|---|---|
|Use-case diagrams|Actors and system functions|
|Sequence diagrams|Interaction order between user, UI, model, tools, APIs|
|State machines|Valid states and transitions|
|BPMN diagrams|Business processes and workflows|
|Decision tables|Rules and branching logic|
|Domain models|Core objects and relationships|
|Acceptance criteria|What must be true for the feature to be done|

For AI systems, this layer matters because natural language can hide precise system obligations. A user may say:

> "Cancel my booking."

The system has to know:

> Which booking? Is the user authorized? Is cancellation allowed? Are there fees? Does this need confirmation? Should an email be sent? Should the action be reversible?

Intent alone does not model that.

## 7. Human factors and cognitive psychology


These disciplines are useful when user-system interaction depends on attention, memory, workload, trust, decision-making, error, and risk.

Useful for:

> high-stakes workflows, expert tools, automation, dashboards, healthcare, finance, aviation, industrial systems, security.

Typical tools:

|Tool|What it captures|
|---|---|
|Cognitive task analysis|How people reason through complex tasks|
|Workload analysis|Mental effort required|
|Error analysis|How users make mistakes|
|Trust calibration|Whether users overtrust or undertrust the system|
|Situation awareness models|What the user needs to know to act safely|
|Human-in-the-loop design|Where human judgment is required|

This is especially important for AI because the system may be probabilistic, persuasive, or wrong in subtle ways.

## 8. Human-AI interaction


This is the AI-specific branch of HCI. It studies how people interact with intelligent, adaptive, uncertain, or autonomous systems.

Useful for:

> uncertainty, explainability, correction, controllability, feedback, trust, automation boundaries, model error.

Typical tools:

|Tool|What it captures|
|---|---|
|Human-AI interaction guidelines|Expected AI behavior across the interaction lifecycle|
|Confidence / uncertainty design|How uncertainty should be exposed|
|Explanation patterns|Why the system gave an answer or took an action|
|Feedback loops|How users correct or improve the system|
|AI failure taxonomies|Ways the model can fail|
|Autonomy levels|How much the system can do without approval|
|Guardrails|Boundaries on model behavior|

Microsoft's Human-AI Interaction Guidelines group AI behavior across phases: initial interaction, regular interaction, when the AI is wrong, and over time. That is a useful structure because AI interaction is not just "input -> output"; it includes expectation-setting, adaptation, error recovery, and long-term use. ([Microsoft](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/ "Guidelines for Human-AI Interaction - Microsoft Research"))

## 9. AI product architecture and orchestration


This is the layer that manages how user input becomes system action.

Useful for:

> routing, tool use, retrieval, workflows, memory, policy checks, latency, cost, reliability.

Typical tools:

|Tool|What it manages|
|---|---|
|Intent detection|Route to the right workflow|
|Query classification|Decide whether to search, retrieve, answer, ask, or act|
|Tool routing|Choose API, database, search, calendar, email, code executor, etc.|
|RAG pipelines|Retrieve relevant knowledge before generation|
|Agent workflows|Multi-step execution|
|State management|Track what has happened so far|
|Policy engine|Apply safety, compliance, or business rules|
|Permission model|Decide what the system may access or change|

This is where intent recognition usually belongs: not as a theory of the whole user interaction, but as a routing and control mechanism.

## 10. Evaluation, analytics, and observability


This is how teams manage interactions after launch.

Useful for:

> quality, safety, latency, cost, failure detection, user satisfaction, regression testing.

Typical tools:

|Tool|What it measures|
|---|---|
|Interaction logs|What users actually ask and do|
|Conversation review|Where the system fails or confuses users|
|Evals|Whether the AI behaves as expected on test cases|
|Golden datasets|Representative examples for regression testing|
|A/B tests|Which design performs better|
|Funnel metrics|Where users fail or abandon|
|Task success metrics|Whether the user achieved the goal|
|Traces|What happened inside the system|
|Cost and latency metrics|Operational performance|

OpenAI's evals guidance frames evaluations as tests for whether LLM application outputs meet specified style and content criteria, especially when upgrading or changing models. ([OpenAI Developers](https://developers.openai.com/api/docs/guides/evals "Working with evals | OpenAI API")) Observability is also important because production AI systems need traces, metrics, and logs to understand behavior and failures; OpenTelemetry describes observability as understanding a system's internal state through outputs such as traces, metrics, and logs. ([OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/ "What is OpenTelemetry?"))

## 11. Policy, governance, and risk management


This layer defines what the system should not do, what requires confirmation, and what requires escalation.

Useful for:

> safety, legal compliance, privacy, abuse prevention, regulated domains, brand risk, accountability.

Typical tools:

|Tool|What it controls|
|---|---|
|Risk taxonomy|Types of harm or failure|
|Policy matrix|Which requests are allowed, restricted, or blocked|
|Escalation rules|When a human must intervene|
|Audit logs|What happened and who/what acted|
|Consent flows|When the user must approve an action|
|Data access rules|What information the system may use|
|Red-teaming|Finding adversarial or unsafe behavior|
|Incident review|Learning from failures|

For AI products, this should not be an afterthought. It affects interaction design directly. The system may need to say, "I can draft this, but I need confirmation before sending," or "I can explain this document, but not provide legal advice."

## A compact map


The full stack can be mapped as follows:

|Layer|Main question|Typical discipline|
|---|---|---|
|User goal|What is the user trying to accomplish?|UX research, product management|
|Intent|What action does the request imply?|NLU, conversation design|
|Context|What background matters?|HCI, service design, AI architecture|
|Task|What work must be done?|Requirements engineering, systems design|
|State|Where are we in the interaction?|Conversation design, workflow design|
|Constraints|What limits apply?|Product, policy, legal, operations|
|Risk|How careful must the system be?|AI safety, governance, human factors|
|System action|What should the system do next?|Architecture, orchestration|
|Evaluation|Did it work?|Analytics, evals, observability|

## The key point


The interaction model can be stated as follows:

> User-system interactions can be modeled through multiple lenses. Intent is one useful lens, especially for routing and workflow control. But successful AI product delivery also requires modeling goals, tasks, context, state, constraints, risk, system capabilities, service operations, and success criteria.

So the "other" tools beside intent are not just more labels. They include:

> journey maps, service blueprints, task models, state machines, dialogue flows, use cases, jobs-to-be-done, policy matrices, tool-routing schemas, eval datasets, traces, and operational metrics.

Intent answers:

> "What does the user seem to want?"

The broader interaction model answers:

> "What needs to happen, under what constraints, with what risks, through which system capabilities, and how will we know it worked?"

## Library sources


- [Vonderhaar et al. 2025](/sources/ml-engineering/se-for-ml/vonderhaar-2025-requirements-engineering-ml-product-case-study.pdf.enc), *Exploring Requirements Engineering for Machine Learning via a Product Case Study*
