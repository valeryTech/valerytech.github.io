---
draft: false
toc: true
title: "Terminology and Taxonomy for Task Assistants"
description: "Maps assistant, copilot, agent, workflow, dialogue, and mixed initiative onto different descriptive axes, using practitioner examples to explain why they are overlapping terms."
weight: "30"
linkTitle: "Terminology and Taxonomy"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## What practitioners actually call these systems


Over the last decade, industry terminology has gradually separated **the product role**, **what it can do**, and **how the user interacts with it**.

Google's historical Assistant material is a useful starting point. Its conversation-design guide explicitly defines conversation design as a design language and says that its core concerns are "the flow of the conversation and its underlying logic". At the same time, it warns against equating conversation with speech: conversation is "inherently multimodal", incorporating interaction design, visual design, motion, audio and writing. ([Google](#google-conversation-design)) This is broader than "a text chatbot", but it still places **conversation at the organising centre of the UX**.

The terminology around the current Gemini product has moved considerably. In March 2025 Google described an assistant as something that should be personal, aware of the surrounding world and able to interact with existing apps and services. Google then framed the replacement of the classic mobile Google Assistant by Gemini as a change in what assistance itself can mean. ([Google 2025](#google-2025-assistant-gemini)) By May 2026 it was explicitly talking about an increasingly **agentic**, proactive assistant, including daily briefs and an agent working on tasks over time. ([Google 2026](#google-2026-gemini-agentic))

Microsoft shows a similar evolution. Current Copilot documentation still describes chat as an important interface, but its product vocabulary centres on **Copilot, agents, actions, tools, apps and workflows**. In Office, Copilot now performs multi-step edits directly in application canvases. Microsoft's own description says the early product was comparatively passive because it could answer questions without reliably commanding applications; the newer system can act on documents, worksheets and presentations while keeping the user able to review changes. ([Microsoft 2026](#microsoft-2026-copilot-agentic))

IBM makes the separation almost explicit. watsonx Orchestrate describes assistants in terms of knowledge, toolsets and behaviour. Its assistant builder can answer questions, guide people through existing digital journeys, or complete tasks on their behalf. IBM calls this **"Show, Tell, Do"** and separately describes skills and automations that invoke back-end systems. ([IBM](#ibm-watsonx-agent-builder)) Rasa goes further architecturally: CALM explicitly "separates language from logic"; the model understands the request while structured, versioned flows determine what happens. ([Rasa](#rasa-calm))

The vocabulary therefore maps better as follows:

| Term | What it primarily names | Typical overlap | Recommended interpretation |
| --- | --- | --- | --- |
| **Dialogue system** | A system organised around sequences of linguistic interaction | Task-oriented dialogue, spoken dialogue, chat | Use where turn-taking dialogue is structurally central, or for the dialogue component of a larger assistant. Academic use remains strong. ([Bang et al. 2023](#bang-2023)) |
| **Task-oriented dialogue system** | Dialogue intended to accomplish defined user goals | Intents, slots, dialogue state, APIs/databases | Established academic category. It can execute tasks, but it still assumes dialogue as the organising interaction. ([Bang et al. 2023](#bang-2023)) |
| **Conversational UI / conversational interface** | An interface in which natural-language interaction is prominent | Chatbots, voice UI, assistants | Best treated as an **interaction pattern**, not as a capability class. NN/g explicitly defines an AI chatbot as a conversational interface. ([NN/g 2024](#nngroup-2024-ai-chat)) |
| **Assistant / virtual assistant** | A product role: helping a person | Siri, Gemini, Alexa, Erica, enterprise assistants | Broad and increasingly multimodal/action-capable. It says little about autonomy or implementation. ([Apple 2026](#apple-2026-siri-ai-launch); [Google 2025](#google-2025-assistant-gemini); [Amazon 2025](#amazon-2025-alexa-canada); [Bank of America](#bank-of-america-online-banking-agreement)) |
| **Copilot** | Embedded assistance alongside a person doing work | Chat, canvas manipulation, suggestions, agents | Practitioner/product term implying human involvement. It has no stable technical boundary. Microsoft's implementation now spans chat and direct app actions. ([Microsoft 2026](#microsoft-2026-copilot-agentic)) |
| **Agent** | A system given some capacity to choose actions or pursue a goal | Tools, planning, autonomy, background execution | Current practitioner term, but highly overloaded: implementations range from controlled flows with tools to substantially autonomous processes. Google, Slack, IBM and Rasa all use it somewhat differently. ([Google 2026](#google-2026-gemini-agentic); [Slack](#slack-work-with-ai-agents); [IBM](#ibm-watsonx-agent-builder); [Rasa](#rasa-calm)) |
| **Action / skill / tool** | A capability available to a system | API operation, domain command, function | Usually below the assistant level. IBM calls executable automations "skills"; Alexa traditionally maps intents to actions; Apple exposes app actions through App Intents. ([IBM](#ibm-watsonx-agent-builder); [Amazon, Intents](#amazon-alexa-intents); [Apple, AppIntent](#apple-appintent)) |
| **Workflow / flow-based assistant** | How task execution is controlled | Deterministic business process, structured task | An architectural property. Rasa Flows and Dialogflow CX are examples; it does not imply any particular UI. ([Rasa](#rasa-calm); [Google Cloud](#google-dialogflow-cx)) |
| **Mixed-initiative** | How initiative is distributed between human and system | Suggestions, automation, intervention, direct manipulation | An interaction/control relationship, not a product type. Its HCI meaning is substantially broader than chat. ([Horvitz 1999](#horvitz-1999)) |
| **Hybrid / multimodal interface** | Combination of interaction forms or modalities | Dialogue + form/table/canvas/touch | UI description. Amazon, Google, Apple and Microsoft all explicitly combine conversational interaction with visual/direct controls. ([Amazon, Be Multimodal](#amazon-be-multimodal); [Google](#google-conversation-design); [Apple, Snippets](#apple-snippets); [Microsoft](#microsoft-mcp-ui-guidelines)) |
| **Task assistant** | Assistance organised around user work or goals | Workflow assistant, copilot, action-capable assistant | Useful practitioner umbrella, although it is less standardised as an academic label. Microsoft Research also uses "task assistance" for systems that combine AI, perception and procedural guidance. ([Microsoft Research](#microsoft-research-sigma)) |

The important finding is that **these terms are not clean synonyms**. They mostly describe different axes. Calling something a *conversational agent* tells us very little about whether it can change application state. Calling it *workflow-based* tells us very little about whether the user interacts by speech, forms or direct manipulation. Calling it *mixed-initiative* tells us how control is shared, while leaving both its task domain and interface open.

That is why trying to select one term from this list as the universal "class" creates confusion.

## Open terminology debates


There is still no stable practitioner vocabulary for these systems. Several ambiguities are likely to persist.

**"Agent" has become broader than a technical definition.** IBM uses agent language alongside explicit toolsets and guardrails; Rasa markets agents whose consequential logic may still be defined by deterministic flows; Slack uses "agent" for AI participants that behave like workplace teammates; Google uses "agentic" for increasing action-taking and background behaviour. ([IBM](#ibm-watsonx-agent-builder)) Consequently, "agent" alone does not tell a designer how freely a model chooses steps, what state it may change, or when human approval is required.

**"Copilot" is semantically useful but technically weak.** It communicates a collaborative relationship and usually implies a person remains involved. Microsoft's own Copilot now ranges from answering questions to applying multi-step edits directly in an application's canvas, so the term no longer corresponds to a single automation level. ([Microsoft 2026](#microsoft-2026-copilot-agentic))

**"Conversational" can mean either language-first interaction or a much broader interaction philosophy.** Google says conversation itself is multimodal; Microsoft calls its rich widgets extensions of conversation; Amazon describes multimodal experiences as complementing voice. That means one practitioner's "conversational system" may already include buttons, cards and direct interaction that another practitioner would call a hybrid interface. ([Google](#google-conversation-design))

**There is also a real design disagreement about whether conversation should remain the organising surface.** Microsoft's current Copilot UI guidance is explicitly "conversation-first", even while adding richer workspaces. ([Microsoft](#microsoft-mcp-ui-guidelines)) NN/g takes the stronger position that teams should question whether chat belongs in the product at all and consider non-conversational AI interventions. ([NN/g 2024](#nngroup-2024-ai-chat)) Both positions are internally coherent: one concerns designing applications *inside a conversational host*; the other asks whether the product should use a conversational host in the first place.

---

Related: [Three-layer model for task assistance]({{< ref "ai/design/dialogue-approach/01-framing/02-three-layer-model" >}}) · [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}) · [Requirements and evaluation for task assistants]({{< ref "ai/design/dialogue-approach/01-framing/06-requirements-and-evaluation" >}}).

Original text: [dialogue-systems-obsidian-references.md](/ai/design/dialogue-approach/01-framing/03-terminology-and-taxonomy.assets/dialogue-systems-obsidian-references.txt).

## Further reading


- [Jurafsky and Martin 2026](/sources/15c773945807396b696ab2a8e25a9595.bin), *SLP3 Appendix K: Frame-Based Dialogue Systems*

## References


- Amazon (2025). [Alexa+ now fully available across Canada, free for Prime members](https://www.aboutamazon.com/news/devices/alexa-plus-canada-launch). ^amazon-2025-alexa-canada
- Amazon. [Be Multimodal](https://developer.amazon.com/en-US/alexa/alexa-haus/design-principles/be-multimodal). Alexa design principles. ^amazon-be-multimodal
- Amazon. [Create Intents, Utterances, and Slots](https://developer.amazon.com/en-US/docs/alexa/custom-skills/create-intents-utterances-and-slots.html). Alexa Skills Kit documentation. ^amazon-alexa-intents
- Apple (2026). [Siri AI, a profoundly more capable and personal assistant, is here](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/). Apple Newsroom. ^apple-2026-siri-ai-launch
- Apple. [AppIntent](https://developer.apple.com/documentation/AppIntents/AppIntent). Apple Developer Documentation. ^apple-appintent
- Apple. [Snippets](https://developer.apple.com/design/human-interface-guidelines/snippets). Human Interface Guidelines. ^apple-snippets
- Bang, N., Lee, J., & Koo, M.-W. (2023). [Task-Optimized Adapters for an End-to-End Task-Oriented Dialogue System](https://aclanthology.org/2023.findings-acl.464/). Findings of ACL 2023. [doi:10.18653/v1/2023.findings-acl.464](https://doi.org/10.18653/v1/2023.findings-acl.464). ^bang-2023
- Bank of America. [Online Banking Service Agreement](https://secure.bankofamerica.com/login/enroll/displaysa.go). Section on Erica, the Virtual Financial Assistant. ^bank-of-america-online-banking-agreement
- Google (2025). [The Assistant experience on mobile is upgrading to Gemini](https://blog.google/products-and-platforms/products/gemini/google-assistant-gemini-mobile/). The Keyword. ^google-2025-assistant-gemini
- Google (2026). [The Gemini app becomes more agentic, delivering proactive, 24/7 help](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/). The Keyword. ^google-2026-gemini-agentic
- Google Cloud. [Flow-based agent basics](https://docs.cloud.google.com/dialogflow/cx/docs/basics). Dialogflow CX documentation. ^google-dialogflow-cx
- Google. [Conversation Design](https://developers.google.com/assistant/conversation-design/what-is-conversation-design). Google for Developers. ^google-conversation-design
- Horvitz, E. (1999). [Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/). CHI 1999. [doi:10.1145/302979.303030](https://doi.org/10.1145/302979.303030). ^horvitz-1999
- IBM. [AI Agent Builder | IBM watsonx Orchestrate](https://www.ibm.com/products/watsonx-orchestrate/ai-assistant-builder). ^ibm-watsonx-agent-builder
- Microsoft (2026). [Copilot's agentic capabilities in Word, Excel, and PowerPoint are generally available](https://www.microsoft.com/en-us/copilot/blog/2026/04/22/copilots-agentic-capabilities-in-word-excel-and-powerpoint-are-generally-available/). Microsoft Copilot Blog. ^microsoft-2026-copilot-agentic
- Microsoft Research. [SIGMA: An open-source mixed-reality system for research on physical task assistance](https://www.microsoft.com/en-us/research/blog/sigma-an-open-source-mixed-reality-system-for-research-on-physical-task-assistance/). Microsoft Research Blog. ^microsoft-research-sigma
- Microsoft. [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines). Microsoft Learn. ^microsoft-mcp-ui-guidelines
- Nielsen Norman Group (2024). [AI Chat Is Not (Always) the Answer](https://www.nngroup.com/articles/ai-chat-not-the-answer/). ^nngroup-2024-ai-chat
- Rasa. [Rasa CALM | High-Trust Conversational AI Without Hallucinations](https://rasa.com/calm). ^rasa-calm
- Slack. [Work with AI agents in Slack](https://slack.com/help/articles/33076000248851-Work-with-AI-agents-in-Slack). Slack Help Center. ^slack-work-with-ai-agents
