---
draft: false
toc: true
title: "AI Assistant Product Comparison"
description: "Compares eight assistant products by authority, execution, proactive behavior, and UI, showing why action capability, agentic control, and conversational presentation must be described separately."
weight: "10"
linkTitle: "Product Comparison"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

This preserves the product descriptions from the source report. Each product has its own section instead of a seven-column table.

The current products make the shift particularly visible. The comparison focuses on what vendors themselves emphasise rather than trying to impose one academic definition.

## Google Assistant -> Gemini


**Primary purpose in vendor framing:** Personal AI assistance across information, productivity and everyday tasks. Google says an assistant should interact with the apps and services a person already uses. ([Google 2025](#google-2025-assistant-gemini))

**Modalities and surfaces:** Text, voice, camera/screen sharing, visual answers and interactive UI across phones and other devices. ([Google 2026c](#google-2026-gemini-1b))

**Task execution:** Gemini can perform app actions; Google reported automation across 40+ popular apps in 2026 and introduced Spark for longer-running work. ([Google 2026c](#google-2026-gemini-1b))

**Proactive behaviour:** Strong: proactive daily briefs and agent/background activity are explicit parts of the 2026 direction. ([Google 2026a](#google-2026-gemini-agentic))

**UI / API integration:** Connected Google apps/services; Android system integration; agent status can appear through Android Halo. ([Google 2026b](#google-2026-android-halo))

**Practitioner language:** **assistant, personal AI assistant, agentic, agent**. The classic mobile Google Assistant was upgraded into Gemini. ([Google 2025](#google-2025-assistant-gemini))

## Apple Siri AI


**Primary purpose in vendor framing:** Help users find information and "get things done throughout the day". ([Apple 2026a](#apple-2026-siri-ai-intro))

**Modalities and surfaces:** Voice, Siri app, system UI, Spotlight/context menus, on-screen awareness, visual intelligence and interactive snippets. ([Apple 2026b](#apple-2026-siri-ai-launch))

**Task execution:** System-wide and cross-app actions: Apple gives examples such as finding information in messages/email, editing and sharing photos, or adding information to other apps. ([Apple 2026b](#apple-2026-siri-ai-launch))

**Proactive behaviour:** Contextual suggestions exist across Apple's assistant architecture; Siri AI is deeply integrated into system context, though its current public framing centres more on contextual action than autonomous background work. ([Apple, Siri HIG](#apple-hig-siri))

**UI / API integration:** App Intents expose app entities and actions to Siri and other system experiences; snippets provide compact interactive UI. ([Apple, AppIntent](#apple-appintent))

**Practitioner language:** **personal assistant, conversational assistant, app actions, App Intents, snippets**. ([Apple 2026a](#apple-2026-siri-ai-intro))

## Amazon Alexa+


**Primary purpose in vendor framing:** A "personal AI assistant that gets things done". ([Amazon 2025](#amazon-2025-alexa-canada))

**Modalities and surfaces:** Voice, Alexa app, web, smart displays and touch. Amazon now supports experiences where browsing and purchasing can be done by voice, touch, or both. ([Amazon 2026b](#amazon-2026-alexa-prime))

**Task execution:** Smart-home control, shopping and services; classic Alexa skills expose intents/actions while Alexa+ expands multi-service task completion. ([Amazon 2026a](#amazon-2026-alexa-integrations))

**Proactive behaviour:** Proactive Events are an explicit Alexa Skills API capability; routines and notifications extend interaction outside a request-response turn. ([Amazon, Proactive Events](#amazon-proactive-events))

**UI / API integration:** Skills/APIs plus visual Presentation Language and device integrations. Amazon's design rule is "voice-first, but not voice-only". ([Amazon, Be Multimodal](#amazon-be-multimodal))

**Practitioner language:** **assistant, skill, intent, action, multimodal, voice-first**. ([Amazon, Be Multimodal](#amazon-be-multimodal))

## Microsoft 365 Copilot


**Primary purpose in vendor framing:** Collaborator for getting work done inside work applications. ([Microsoft 2026](#microsoft-2026-copilot-agentic))

**Modalities and surfaces:** Chat, inline widgets, side-by-side workspace and the application's own document/canvas UI. ([Microsoft, MCP app UX guidelines](#microsoft-mcp-ui-guidelines))

**Task execution:** Multi-step, app-native actions directly in Word, Excel and PowerPoint; agents and workflows extend this to business processes. ([Microsoft 2026](#microsoft-2026-copilot-agentic))

**Proactive behaviour:** Copilot Actions can automate repetitive work; Microsoft also frames agents as operating within business processes. ([Microsoft 2024](#microsoft-2024-copilot-actions))

**UI / API integration:** Deep integration with Office canvases, MCP apps, tools and enterprise APIs. Complex editing is deliberately moved into a structured workspace. ([Microsoft, MCP app UX guidelines](#microsoft-mcp-ui-guidelines))

**Practitioner language:** **Copilot, collaborator, agent, action, workflow, tool, app**. ([Microsoft 2026](#microsoft-2026-copilot-agentic))

## ChatGPT Apps


**Primary purpose in vendor framing:** Bring external capabilities, data and applications into ChatGPT so users can accomplish work in context. ([OpenAI, Apps SDK](#openai-apps-sdk-help))

**Modalities and surfaces:** Natural language plus interactive interfaces embedded in chat. ([OpenAI 2025](#openai-2025-apps-in-chatgpt))

**Task execution:** Apps connect to external tools/data and back ends via MCP; developers define app logic as well as UI. ([OpenAI, Apps SDK](#openai-apps-sdk-help))

**Proactive behaviour:** ChatGPT can surface an app contextually; the Apps model itself is chiefly interaction-driven rather than an assertion that every app runs proactively. ([OpenAI 2025](#openai-2025-apps-in-chatgpt))

**UI / API integration:** Apps SDK explicitly separates and supports **chat behaviour, UI, and backend connectivity**. ([OpenAI, Apps SDK](#openai-apps-sdk-help))

**Practitioner language:** **app, chat, interface, tool, MCP, action**. This is a clear example of chat becoming a host for richer application interaction. ([OpenAI, Apps SDK](#openai-apps-sdk-help))

## Slack AI agents


**Primary purpose in vendor framing:** "Team up with agents so you can get work done faster", embedding AI in collaborative work. ([Slack, Work with AI agents](#slack-work-with-ai-agents))

**Modalities and surfaces:** Channels, DMs, agent sessions and Slack work surfaces. ([Slack, Work with AI agents](#slack-work-with-ai-agents))

**Task execution:** Capabilities vary by agent; Slack's agent model supports agents that suggest or take actions inside the flow of work. ([Slack, AI agents](#slack-ai-agents))

**Proactive behaviour:** Depends on the agent and associated workflows; Slack Workflow Builder also supports AI-generated workflows and agent-related steps. ([Slack, AI workflows](#slack-ai-workflows))

**UI / API integration:** Slack objects, app scopes, workflows and third-party/Salesforce agents. ([Slack, Work with AI agents](#slack-work-with-ai-agents))

**Practitioner language:** **agent, assistant, teammate, workflow**. ([Slack, Work with AI agents](#slack-work-with-ai-agents))

## Intercom Fin


**Primary purpose in vendor framing:** Resolve customer-support work across channels and hand off when appropriate. ([Intercom](#intercom-fin-explained))

**Modalities and surfaces:** Messenger/chat, phone/voice, Slack and Discord; workflows may use structured interaction as well as messages. ([Intercom](#intercom-fin-explained))

**Task execution:** Fin can participate in Workflows for triage and other automated support processes, with human handoff. ([Intercom](#intercom-fin-explained))

**Proactive behaviour:** Strong: Intercom supports proactive Fin conversations triggered by behavioural signals such as failed actions or abandoned checkout. ([Intercom](#intercom-fin-explained))

**UI / API integration:** Workflows, support systems, analytics integrations and human support queues. ([Intercom](#intercom-fin-explained))

**Practitioner language:** **AI Agent, conversation, Workflow, automation, handoff**. ([Intercom](#intercom-fin-explained))

## Bank of America Erica


**Primary purpose in vendor framing:** Financial self-service and account management within digital banking.

**Modalities and surfaces:** Voice, text and screen interaction inside the banking application. ([Bank of America](#bank-of-america-online-banking-agreement))

**Task execution:** Can expose account balances, initiate transfers and pay bills; capabilities depend on account/customer eligibility. ([Bank of America](#bank-of-america-online-banking-agreement))

**Proactive behaviour:** Explicitly proactive: Erica may initiate an interaction or surface suggestions and financial insights, such as an upcoming card payment. ([Bank of America](#bank-of-america-online-banking-agreement))

**UI / API integration:** Embedded in Bank of America's digital banking state and transaction functions; screen information is part of the confirmation process. ([Bank of America](#bank-of-america-online-banking-agreement))

**Practitioner language:** **Virtual Financial Assistant, bot, AI, intent**. Notably, its current terms say it uses predefined responses rather than a generative LLM. ([Bank of America](#bank-of-america-online-banking-agreement))

## Observations


Several observations follow from this comparison.

First, **action capability does not imply agentic architecture**. Erica can initiate transfers and payments while Bank of America explicitly describes an intent-analysis and predefined-response system. ([Bank of America](#bank-of-america-online-banking-agreement)) Conversely, a research or investigative agent might autonomously choose many steps while having no permission to change authoritative business data.

Second, **a hybrid UI does not make a system less conversational** in vendor terminology. Amazon explicitly includes touch in a voice-first experience; Google calls conversation inherently multimodal; Microsoft keeps conversation as the source of intent while opening a parallel workspace; Apple says its visual snippets should make sense visually alongside voice interaction. ([Amazon, Be Multimodal](#amazon-be-multimodal))

Third, the newest products increasingly cross a boundary that traditional dialogue-system terminology does not naturally express: **they continue doing work outside the immediate turn**. Google's proactive briefs and Spark, Intercom's behavioural triggers, Alexa's proactive events and Erica's unsolicited account insights are all examples. ([Google 2026a](#google-2026-gemini-agentic)) A turn-taking model of dialogue alone cannot adequately describe that behaviour.

---

Related: [Terminology and taxonomy]({{< ref "ai/design/dialogue-approach/01-framing/03-terminology-and-taxonomy" >}}) · [Interaction forms and hybrid UI]({{< ref "ai/design/dialogue-approach/01-framing/05-interaction-forms-and-hybrid-ui" >}}) · [Sources and references]({{< ref "ai/design/dialogue-approach/03-research/02-sources-and-references" >}}).

Original text: [dialogue-systems-obsidian-references.md](/ai/design/dialogue-approach/03-research/01-practitioner-product-comparison.assets/dialogue-systems-obsidian-references.txt).

## References


- Amazon (2025). [Alexa+ now fully available across Canada, free for Prime members](https://www.aboutamazon.com/news/devices/alexa-plus-canada-launch). ^amazon-2025-alexa-canada
- Amazon (2026a). [Amazon's Alexa+ expands to Samsung TVs, BMWs, Oura rings and more](https://www.aboutamazon.com/news/devices/alexa-plus-samsung-bmw-bosch-oura-integrations). ^amazon-2026-alexa-integrations
- Amazon (2026b). [How to get Alexa Plus free with Prime membership](https://www.aboutamazon.com/news/devices/alexa-plus-available-free-prime-members-us). ^amazon-2026-alexa-prime
- Amazon. [About Proactive Events](https://developer.amazon.com/en-US/docs/alexa/smapi/proactive-events-api.html). Alexa Skills Kit documentation. ^amazon-proactive-events
- Amazon. [Be Multimodal](https://developer.amazon.com/en-US/alexa/alexa-haus/design-principles/be-multimodal). Alexa design principles. ^amazon-be-multimodal
- Apple (2026a). [Apple introduces Siri AI, a profoundly more capable and personal assistant](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/). Apple Newsroom. ^apple-2026-siri-ai-intro
- Apple (2026b). [Siri AI, a profoundly more capable and personal assistant, is here](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/). Apple Newsroom. ^apple-2026-siri-ai-launch
- Apple. [AppIntent](https://developer.apple.com/documentation/AppIntents/AppIntent). Apple Developer Documentation. ^apple-appintent
- Apple. [Siri](https://developer.apple.com/design/human-interface-guidelines/siri/). Human Interface Guidelines. ^apple-hig-siri
- Bank of America. [Online Banking Service Agreement](https://secure.bankofamerica.com/login/enroll/displaysa.go). Section on Erica, the Virtual Financial Assistant. ^bank-of-america-online-banking-agreement
- Google (2025). [The Assistant experience on mobile is upgrading to Gemini](https://blog.google/products-and-platforms/products/gemini/google-assistant-gemini-mobile/). The Keyword. ^google-2025-assistant-gemini
- Google (2026a). [The Gemini app becomes more agentic, delivering proactive, 24/7 help](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/). The Keyword. ^google-2026-gemini-agentic
- Google (2026b). [Android Halo helps you stay in sync with your AI agent](https://blog.google/products-and-platforms/platforms/android/android-halo/). The Keyword. ^google-2026-android-halo
- Google (2026c). [Google's Gemini app hits 1 billion monthly active users](https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/). The Keyword. ^google-2026-gemini-1b
- Intercom. [Fin AI Agent explained](https://www.intercom.com/help/en/articles/7120684-fin-ai-agent-explained). Intercom Help Center. ^intercom-fin-explained
- Microsoft (2024). [Introducing Microsoft Copilot actions, new agents, and tools to empower IT](https://www.microsoft.com/en-us/copilot/blog/2024/11/19/introducing-copilot-actions-new-agents-and-tools-to-empower-it-teams/). Microsoft Copilot Blog. ^microsoft-2024-copilot-actions
- Microsoft (2026). [Copilot's agentic capabilities in Word, Excel, and PowerPoint are generally available](https://www.microsoft.com/en-us/copilot/blog/2026/04/22/copilots-agentic-capabilities-in-word-excel-and-powerpoint-are-generally-available/). Microsoft Copilot Blog. ^microsoft-2026-copilot-agentic
- Microsoft. [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines). Microsoft Learn. ^microsoft-mcp-ui-guidelines
- OpenAI (2025). [Introducing apps in ChatGPT and the new Apps SDK](https://openai.com/index/introducing-apps-in-chatgpt/). ^openai-2025-apps-in-chatgpt
- OpenAI. [Build with the Apps SDK](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk). OpenAI Help Center. ^openai-apps-sdk-help
- Slack. [Slack AI Agents with Agentforce & Agentic AI](https://slack.com/ai-agents). ^slack-ai-agents
- Slack. [Use AI to build Slack workflows](https://slack.com/help/articles/32843655109395-Use-AI-to-build-Slack-workflows). Slack Help Center. ^slack-ai-workflows
- Slack. [Work with AI agents in Slack](https://slack.com/help/articles/33076000248851-Work-with-AI-agents-in-Slack). Slack Help Center. ^slack-work-with-ai-agents
