---
draft: false
toc: true
title: "Task Assistance Beyond Dialogue"
description: "Argues that user tasks, domain state, and authorized action should organize AI assistance, with dialogue and visual controls serving as ways to coordinate that work."
weight: "10"
linkTitle: "Beyond Dialogue"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

<a id="original-question"></a>

## Framing question


Does "dialogue system" give a misleading description of systems that help users complete tasks or collaborate with them? Dialogue is one form of collaboration, often through extended text exchange. Direct and hybrid interfaces can also support the work.

"Dialogue system" is a potentially misleading term for the broader class of task-assistance systems. It emphasizes the form of interaction, while the defining purpose of these systems is to help users accomplish tasks.

Two distinctions matter here: the purpose of the assistance and the form of interaction.

## Dialogue is a means of collaboration, not its purpose


In the wallet example, the user wants to understand a transaction, manage expenses, or change something in the application.

The system might:

- Interpret the user's goal and current context.
- Retrieve information and reason about it.
- Propose a change to the application's state.
- Collaborate with the user to review and revise the proposal.
- Execute an authorized operation and verify its outcome.

Dialogue may help coordinate these activities, but task completion and collaboration are the organizing concepts.

This distinction becomes even clearer when an assistant can proactively identify a problem or suggest an action without waiting for a conversational request.

## Research summary


**The term "dialogue system" can be misleading as the top-level category for task-assistance systems.** The term is still useful for a system, subsystem, or research problem in which turn-taking natural-language interaction is central. It becomes too narrow for modern assistants whose main purpose is to help a person accomplish work across application state, APIs, workflows, direct manipulation, generated interfaces, notifications, and background activity.

The clearest pattern in practitioner sources from roughly 2016-2026 is a move **up one level of abstraction**. Older platforms were commonly described through *dialogue*, *intents*, *slots*, and *conversation flows*. Current product families increasingly use **assistant, copilot, agent, action, skill, workflow, tool, and app**. Conversation remains important, but it is increasingly treated as one way of expressing intent and coordinating work. Google's own older conversation-design guidance already said that conversation is "inherently multimodal"; Amazon says Alexa should be "voice-first, but not voice-only"; Apple combines Siri with system-wide actions, snippets, Spotlight and on-screen context; Microsoft explicitly moves complex work from chat into a side-by-side workspace; OpenAI's Apps SDK separately exposes an app's **chat behaviour and UI**; IBM separates conversational interaction from skills and automations. [Conversation Design](https://developers.google.com/assistant/conversation-design/what-is-conversation-design)

The shift is even clearer in 2025-2026 product language. Google describes Gemini as a personal AI assistant that interacts with apps and services and, by 2026, as increasingly **agentic and proactive**. Microsoft describes Copilot taking "multi-step, app-native actions" directly on documents and calls it a collaborator that helps get work done. Apple describes Siri AI as helping users find information **and take action across apps**. Slack says people "team up with agents" to get work done. Amazon describes Alexa+ as a personal AI assistant "that gets things done". These are descriptions of **purpose and agency**, rather than of dialogue architecture. [The Assistant experience on mobile is upgrading to Gemini](https://blog.google/products-and-platforms/products/gemini/google-assistant-gemini-mobile/)

This does **not** mean dialogue has become irrelevant. The more precise distinction is:

> **Dialogue is an interaction form, not necessarily a single modality.** A dialogue can itself use speech, text, visual cards, buttons and other modalities. What should usually sit above it in the taxonomy is the **assistance relationship and task model**: what the system helps the user accomplish, what it is authorised to do, and how task execution is controlled.

The assistant's capabilities and process control should be distinguished from its particular interface. [^original-file]

The proposed broad practitioner category is **AI task assistant**, or **human-AI task assistance system** where collaboration is important. Define a particular system along three layers:

**assistance purpose and authority -> domain/task execution -> interaction and surfaces.**

"Dialogue system", "conversational UI", "workflow-based", "mixed-initiative", "copilot", and "agent" then describe different properties within those layers rather than competing names for the whole thing.

[^original-file]: The report cites an earlier attachment without a public URL. See [original attachment context]({{< ref "ai/design/dialogue-approach/03-research/02-sources-and-references" >}}#original-attachment).

---

Related: [Three-layer model for task assistance]({{< ref "ai/design/dialogue-approach/01-framing/02-three-layer-model" >}}) · [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}) · [Interaction forms and hybrid UI]({{< ref "ai/design/dialogue-approach/01-framing/05-interaction-forms-and-hybrid-ui" >}}).

Original text: [dialogue-systems-mislead.md](/ai/design/dialogue-approach/01-framing/01-task-assistance-beyond-dialogue.assets/dialogue-systems-mislead.txt) · [dialogue-systems-obsidian-references.md](/ai/design/dialogue-approach/01-framing/01-task-assistance-beyond-dialogue.assets/dialogue-systems-obsidian-references.txt).
