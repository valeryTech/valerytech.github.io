---
draft: false
toc: true
title: "Interaction Forms and Hybrid UI"
description: "Matches interaction forms to task needs: language for intent, structured views for review, direct controls for precision, and explicit confirmation for consequential actions."
linkTitle: "Interaction Forms"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## Dialogue is only one interaction mechanism


Interaction form is a separate design concern.

The same task might involve natural-language conversation, structured forms, buttons, interactive tables, visualizations, or an existing application screen.

For example, an assistant might detect a recurring payment, show an editable expense form, and let the user confirm it with a button.

The human and AI are still collaborating on the task, even though the interaction doesn't require a textual dialogue.

## Dialogue, hybrid UI, and direct interaction


Practitioner guidance strongly supports treating interaction form as a design choice made **within a task**, sometimes changing from step to step.

The strongest current example is Microsoft's Copilot UI guidance. Microsoft recommends inline conversational widgets for previews, confirmations, simple actions and quick decisions. It explicitly says that when a task involves multi-step editing, iteration, comparison, persistent state, tables, canvases, dashboards or structured inputs, designers should move into a side-by-side workspace while preserving conversational context. It also warns designers never to rely on model-generated text alone to communicate application state. [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines)

A wallet assistant can use this architecture:

**"Change these subscriptions."**

-> language establishes the goal

-> assistant identifies the relevant records

-> table shows proposed changes

-> user directly edits two rows

-> validation runs

-> confirmation control authorises execution

-> backend changes state

-> assistant explains the outcome

Calling that entire interaction a *dialogue* obscures much of what is happening. Calling dialogue **one coordination mechanism inside a task-assistance interaction** handles it cleanly.

Amazon arrives at the same conclusion from a voice-first direction. Its Alexa design guide says that touch should be used where voice is poorly suited, giving long lists as an example, and says a display can make information easier to present and tasks easier to accomplish through touch. [Be Multimodal](https://developer.amazon.com/en-US/alexa/alexa-haus/design-principles/be-multimodal)

Apple's snippet guidance follows a similar pattern. Siri tasks can produce compact interactive views with buttons and other controls; Apple advises designers to communicate a snippet's purpose visually and not depend on dialogue text for the UI to make sense. Its WWDC material likewise describes interactive snippets as useful for quick, routine tasks while recognising dialogue as particularly important in voice-first contexts. [Snippets](https://developer.apple.com/design/human-interface-guidelines/snippets)

NN/g reaches the broader UX conclusion directly. It defines AI chat as a **conversational interface**, then argues that teams should start from user needs rather than defaulting to chat. Its alternatives include personalisation, predictive assistance and automation, and it states that AI need not be conversational or even visible in the interface to add value. [AI Chat Is Not (Always) the Answer](https://www.nngroup.com/articles/ai-chat-not-the-answer/)

Taken together, practitioner guidance supports these design choices:

| Task property | Interaction to prioritise | Why |
| --- | --- | --- |
| User has an ambiguous, high-level goal | **Dialogue / natural language** | Good for articulating intent without knowing the application's command structure; allows clarification and contextual follow-up. Google and Microsoft both place value on this flexibility. [Conversation Design](https://developers.google.com/assistant/conversation-design/what-is-conversation-design) |
| User needs a quick explanation or simple action | **Dialogue with compact controls** | A short answer plus Confirm/Edit/Apply preserves conversational continuity without forcing unnecessary navigation. [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines) |
| User must choose from many comparable objects | **Structured visual UI** | Lists, tables and visible alternatives reduce the cost of repeatedly articulating choices in language. Amazon explicitly recommends touch for cases such as long lists. [Be Multimodal](https://developer.amazon.com/en-US/alexa/alexa-haus/design-principles/be-multimodal) |
| User must make precise edits | **Direct manipulation / form / canvas** | Persistent visible state and precise input are more suitable than serial conversation. Microsoft recommends an expanded workspace for editing, configuration and structured input. [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines) |
| Action has significant consequences | **Proposal + explicit review/confirmation UI** | People need to see what is about to change and retain final control. Microsoft's current guidance explicitly requires visibility, confirmation for sensitive operations and transparent outcomes. [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines) |
| System notices a condition before the user asks | **Proactive notification or contextual suggestion** | There need not be a dialogue turn until the person decides to engage. Erica, Fin, Alexa and Gemini all provide examples. [Bank of America](https://secure.bankofamerica.com/login/enroll/displaysa.go) |
| Task takes time or can run in the background | **Agent/status surface + resumable interaction** | Continuous turn-taking would be artificial; progress/state should remain visible while the task proceeds. Google's Android Halo is explicitly designed to expose agent status without interrupting the user's current activity. [Android Halo helps you stay in sync with your AI agent](https://blog.google/products-and-platforms/platforms/android/android-halo/) |

A particularly useful practitioner pattern can therefore be expressed as:

> **Language for intent -> structured representation for review -> direct interaction for precision -> explicit authority for consequential action -> language or UI for explanation and recovery.**

This is not a rule that conversation should always appear first. Selection of an object, a detected event, a button or an application state can initiate exactly the same task. Rasa's separation between language and business logic is relevant here: an LLM can interpret language where needed while structured flows determine execution. [Rasa CALM](https://rasa.com/calm)

This also clarifies a terminology distinction: dialogue is **not** simply a "modality". Speech, text, touch and visual display are modalities. Dialogue is better understood as an **interaction structure** -- often turn-taking communication -- which can span several modalities. Google explicitly uses this broader interpretation when it calls conversation inherently multimodal. [Conversation Design](https://developers.google.com/assistant/conversation-design/what-is-conversation-design)

---

Related: [Three-layer model for task assistance]({{< ref "ai/design/dialogue-approach/01-framing/02-three-layer-model" >}}) · [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}) · [Practitioner product comparison]({{< ref "ai/design/dialogue-approach/03-research/01-practitioner-product-comparison" >}}).

Original text: [dialogue-systems-mislead.md](/ai/design/dialogue-approach/01-framing/05-interaction-forms-and-hybrid-ui.assets/dialogue-systems-mislead.txt) · [dialogue-systems-obsidian-references.md](/ai/design/dialogue-approach/01-framing/05-interaction-forms-and-hybrid-ui.assets/dialogue-systems-obsidian-references.txt).
