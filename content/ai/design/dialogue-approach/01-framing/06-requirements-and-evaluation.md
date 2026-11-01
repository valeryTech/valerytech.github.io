---
draft: false
toc: true
title: "Requirements and Evaluation for Task Assistants"
description: "Extends assistant requirements and evaluation beyond conversation quality to resource selection, proposed changes, authority, correction effort, recovery, and final application state."
weight: "60"
linkTitle: "Requirements and Evaluation"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## Requirements


These ambiguities have concrete implications for requirements. "Build a dialogue system" encourages requirements such as supported utterances, dialogue states, fallbacks and response generation. "Build a task assistant" forces additional questions: **what user outcomes are supported; what domain objects can be inspected or changed; what actions exist; when are they valid; how much process control belongs to the model; when may the system initiate work; what must the user review; and which interaction surface is appropriate at each point?** Practitioner platforms increasingly expose exactly these concerns through actions, skills, tools, workflows, permissions and structured UI. [Rasa CALM](https://rasa.com/calm)

## Evaluation


The same change affects evaluation. A dialogue-centred evaluation naturally focuses on understanding, response quality, turns, dialogue state and goal completion -- all established concerns in task-oriented dialogue research. [Task-Optimized Adapters for an End-to-End Task-Oriented Dialogue System](https://aclanthology.org/2023.findings-acl.464/) A broader task assistant also needs evaluation of **correct target/resource selection, correctness of proposed state changes, authorisation, unintended side effects, human correction effort, visibility of state, confirmation behaviour, recovery, task duration, proactive-intervention quality and final application state**. Microsoft's insistence on explicit state and reviewable actions, and Rasa's insistence on inspectable business logic, are practitioner signals pointing in this direction. [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines)

## Describing a concrete system


Proposed naming:

> **Human-AI task assistance** as the conceptual area; **AI task assistant** as the system/product category; **informational, advisory, action-preparing, supervised-execution, or delegated** to describe authority; **workflow-based or agentic** to describe execution control; and **dialogue, direct UI, hybrid, or proactive** to describe interaction.

Under that terminology, the wallet example could be described precisely as a **mixed-initiative, workflow-based AI task assistant with supervised state-changing actions and a hybrid interface**. A Fuse-style read-only product could be an **informational task assistant with read-only domain access and a conversational interface**. Neither has to change category merely because one screen happens to use chat and another uses a form.

This is the reason for avoiding **"dialogue system" as the top-level term for this broader class**. The phrase remains valid within NLP and for conversation-centred products, but it makes the interaction mechanism sound like the defining purpose. The broader systems emerging in practice are better understood as systems for **human-AI coordination around tasks and state**, with dialogue available when it is a useful way to coordinate that work.

---

Related: [Terminology and taxonomy]({{< ref "ai/design/dialogue-approach/01-framing/03-terminology-and-taxonomy" >}}) · [Three-layer model for task assistance]({{< ref "ai/design/dialogue-approach/01-framing/02-three-layer-model" >}}) · [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}).

Original text: [dialogue-systems-obsidian-references.md](/ai/design/dialogue-approach/01-framing/06-requirements-and-evaluation.assets/dialogue-systems-obsidian-references.txt).
