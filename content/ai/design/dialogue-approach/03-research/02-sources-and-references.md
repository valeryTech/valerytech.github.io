---
draft: false
toc: true
title: "Dialogue Approach: Sources and References"
description: "An annotated source guide and bibliography for the task-assistance framing, explaining what practitioner platforms, mixed-initiative research, and dialogue frameworks contribute and where source access was limited."
weight: "20"
linkTitle: "Sources and References"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

This is the reference collection from the original documents. Repeated bibliography URLs are listed once; citations stay with the notes that use them.

## Research source context


The research prioritised official platform documentation, product announcements and design guidance from Google, Microsoft, Apple, Amazon, IBM, OpenAI, Slack/ Salesforce and Bank of America; it then used Rasa, Intercom and Nielsen Norman Group as practitioner perspectives, with ACL and Microsoft Research for the academic comparison. Most practitioner evidence is from 2016-2026, with Horvitz's 1999 mixed-initiative work retained as a foundational exception because the term's original HCI meaning is directly relevant. ([Horvitz 1999](#horvitz-1999))

| Source | Why it is useful |
| --- | --- |
| **Google -- Conversation Design** | A strong historical practitioner statement of the conversation-centred view, while explicitly arguing that conversation can be multimodal. It exposes both the strength and the limitation of "dialogue" as the organising concept. ([Google](#google-conversation-design)) |
| **Google -- Google Assistant to Gemini / 2026 Gemini direction** | Documents the vocabulary shift from natural-language assistant towards a personal, app-integrated, proactive and agentic assistant. ([Google 2025](#google-2025-assistant-gemini)) |
| **Microsoft -- Copilot MCP UI guidelines** | The clearest current practitioner treatment of dialogue and structured UI as complementary: inline chat for simple work; dedicated workspace for editing, comparison and persistent state. ([Microsoft](#microsoft-mcp-ui-guidelines)) |
| **Microsoft -- agentic Copilot in Office** | Explicitly frames the evolution from answering/suggesting towards changing the application canvas and completing multi-step work. ([Microsoft 2026](#microsoft-2026-copilot-agentic)) |
| **Apple -- Siri AI and App Intents/snippets guidance** | Shows an assistant built around personal context and task completion while integrating language with application actions, system context and compact direct UI. ([Apple 2026](#apple-2026-siri-ai-launch)) |
| **Amazon -- Alexa multimodal design / Alexa+** | Provides one of the most concise practitioner formulations: "voice-first, but not voice-only"; current Alexa+ framing has moved towards a personal AI assistant that gets things done. ([Amazon](#amazon-be-multimodal)) |
| **IBM watsonx Orchestrate** | Separates information, guidance and doing work, and distinguishes conversational interaction from executable skills and automation. ([IBM](#ibm-watsonx-agent-builder)) |
| **OpenAI -- Apps SDK** | Explicitly gives developers control over both chat behaviour and interface while connecting to external back ends, demonstrating conversation plus interactive application UI as separate concerns. ([OpenAI](#openai-apps-sdk-help)) |
| **Rasa CALM** | Architecturally explicit separation of language interpretation from structured business logic and flows. Particularly relevant to the closed-task/workflow approach. ([Rasa](#rasa-calm)) |
| **Nielsen Norman Group -- AI Chat Is Not (Always) the Answer** | Practitioner UX argument for treating chat as one possible interface and starting from the user problem; explicitly discusses non-conversational AI alternatives. ([Nielsen Norman Group 2024](#nngroup-2024-ai-chat)) |
| **ACL task-oriented dialogue research** | Establishes why "task-oriented dialogue" remains academically legitimate: dialogue systems can be goal-directed, API-backed and structured around domain state. ([Qin et al. 2023](#qin-2023)) |
| **Microsoft mixed-initiative and situated-interaction research** | Supplies the broader HCI category in which automated assistance, direct manipulation, verbal/non-verbal channels and shared initiative coexist. ([Horvitz 1999](#horvitz-1999)) |

A few source-access limitations are worth recording. Apple's Human Interface Guidelines are heavily JavaScript-rendered in the web crawler; indexed official HIG material, WWDC material and Apple Newsroom pages were therefore used together. Some Google Assistant conversation-design documentation remains online even though the corresponding Conversational Actions platform has been sunset; it is used here as **historical practitioner evidence**, not as a description of Google's current platform. ([Google](#google-conversation-design)) OpenAI's current Apps SDK documentation was available through the official Help Centre and official OpenAI pages. ([OpenAI](#openai-apps-sdk-help))

Overall, the evidence supports a fairly strong conclusion: **"dialogue system" is a good name for a dialogue-centred interaction system or subsystem; it is an increasingly poor umbrella for human-AI systems whose defining job is to help people understand, decide, manipulate and change domain state across multiple interfaces.** The practitioner vocabulary is converging, imperfectly, on separating the **assistant/agent role**, the **actions/workflows/tools that do the work**, and the **conversation/UI surfaces through which humans collaborate with it**.

## Original attachment


The source report mentions `Dialogue systems versus broader human-AI task assistants.pdf` through a ChatGPT-internal file citation with no public URL. That PDF was not found in the available notes folders. The exact original footnote is retained in the report snapshot.

The local `02-add-feature.md` references in the framework notes resolve to the Quick Add feature specification.

---

Related: [Practitioner product comparison]({{< ref "ai/design/dialogue-approach/03-research/01-practitioner-product-comparison" >}}) · [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}) · [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}).

Original text: [dialogue-systems-obsidian-references.md](/ai/design/dialogue-approach/03-research/02-sources-and-references.assets/dialogue-systems-obsidian-references.txt) · [example.md](/ai/design/dialogue-approach/03-research/02-sources-and-references.assets/example.txt) · [mapping.md](/ai/design/dialogue-approach/03-research/02-sources-and-references.assets/mapping.txt).

## Further reading


The rest of the original report and framework bibliographies. The notes that use these sources cite them where they use them.

Practitioner and product sources:

- Amazon. [About Proactive Events](https://developer.amazon.com/en-US/docs/alexa/smapi/proactive-events-api.html). Alexa Skills Kit documentation.
- Amazon (2025). [Alexa+ now fully available across Canada, free for Prime members](https://www.aboutamazon.com/news/devices/alexa-plus-canada-launch).
- Amazon (2026). [Amazon's Alexa+ expands to Samsung TVs, BMWs, Oura rings and more](https://www.aboutamazon.com/news/devices/alexa-plus-samsung-bmw-bosch-oura-integrations).
- Amazon (2026). [How to get Alexa Plus free with Prime membership](https://www.aboutamazon.com/news/devices/alexa-plus-available-free-prime-members-us).
- Apple. [AppIntent](https://developer.apple.com/documentation/AppIntents/AppIntent). Apple Developer Documentation.
- Apple. [Siri](https://developer.apple.com/design/human-interface-guidelines/siri/). Human Interface Guidelines.
- Apple. [Snippets](https://developer.apple.com/design/human-interface-guidelines/snippets). Human Interface Guidelines.
- Apple (2026). [Apple introduces Siri AI, a profoundly more capable and personal assistant](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/). Apple Newsroom.
- Bank of America. [Online Banking Service Agreement](https://secure.bankofamerica.com/login/enroll/displaysa.go). Section on Erica, the Virtual Financial Assistant.
- Google (2026). [Android Halo helps you stay in sync with your AI agent](https://blog.google/products-and-platforms/platforms/android/android-halo/). The Keyword.
- Google (2026). [Google's Gemini app hits 1 billion monthly active users](https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/). The Keyword.
- Google (2026). [The Gemini app becomes more agentic, delivering proactive, 24/7 help](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/). The Keyword.
- Intercom. [Fin AI Agent explained](https://www.intercom.com/help/en/articles/7120684-fin-ai-agent-explained). Intercom Help Center.
- Microsoft (2024). [Introducing Microsoft Copilot actions, new agents, and tools to empower IT](https://www.microsoft.com/en-us/copilot/blog/2024/11/19/introducing-copilot-actions-new-agents-and-tools-to-empower-it-teams/). Microsoft Copilot Blog.
- Microsoft Research. [SIGMA: An open-source mixed-reality system for research on physical task assistance](https://www.microsoft.com/en-us/research/blog/sigma-an-open-source-mixed-reality-system-for-research-on-physical-task-assistance/). Microsoft Research Blog.
- OpenAI (2025). [Introducing apps in ChatGPT and the new Apps SDK](https://openai.com/index/introducing-apps-in-chatgpt/).
- Slack. [Slack AI Agents with Agentforce & Agentic AI](https://slack.com/ai-agents).
- Slack. [Use AI to build Slack workflows](https://slack.com/help/articles/32843655109395-Use-AI-to-build-Slack-workflows). Slack Help Center.
- Slack. [Work with AI agents in Slack](https://slack.com/help/articles/33076000248851-Work-with-AI-agents-in-Slack). Slack Help Center.

Dialogue frameworks and state tracking:

- Amazon Web Services. [AMAZON.Confirmation](https://docs.aws.amazon.com/lexv2/latest/dg/built-in-slot-confirmation.html). Amazon Lex V2 Developer Guide.
- Amazon Web Services. [Confirmation](https://docs.aws.amazon.com/lexv2/latest/dg/intent-confirm.html). Amazon Lex V2 Developer Guide.
- Amazon Web Services. [Configure next steps in the conversation](https://docs.aws.amazon.com/lexv2/latest/dg/paths-nextstep.html). Amazon Lex V2 Developer Guide.
- Amazon Web Services. [IntentSummary](https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/Lex/Types/IntentSummary.html). AWS SDK for Ruby V3.
- Amazon Web Services. [PostText](https://docs.aws.amazon.com/lex/latest/dg/API_runtime_PostText.html). Amazon Lex V1 API Reference.
- Amazon Web Services. [Slots](https://docs.aws.amazon.com/lexv2/latest/dg/intent-slots.html). Amazon Lex V2 Developer Guide.
- Amazon Web Services (2023). [Amazon Lex now supports Confirmation slot type](https://aws.amazon.com/about-aws/whats-new/2023/08/amazon-lex-confirmation-slot-type/).
- Bang, N., Lee, J., & Koo, M.-W. (2023). [Task-Optimized Adapters for an End-to-End Task-Oriented Dialogue System](https://aclanthology.org/2023.findings-acl.464/). Findings of ACL 2023. [doi:10.18653/v1/2023.findings-acl.464](https://doi.org/10.18653/v1/2023.findings-acl.464).
- Chen, Z., et al. (2023). [OPAL: Ontology-Aware Pretrained Language Model for End-to-End Task-Oriented Dialogue](https://aclanthology.org/2023.tacl-1.5/). TACL. [doi:10.1162/tacl_a_00534](https://doi.org/10.1162/tacl_a_00534).
- Emergent Mind. [Dialogue state tracking (DST)](https://www.emergentmind.com/topics/dialogue-state-tracking-dst).
- Feng, Y., Wang, Y., & Li, H. (2020). [A Sequence-to-Sequence Approach to Dialogue State Tracking](https://arxiv.org/abs/2011.09553). [arXiv:2011.09553](https://arxiv.org/abs/2011.09553).
- Jacqmin, L. (2022). [Dialogue State Tracking: past, present, and future](https://talep.lis-lab.fr/seminars/2022-01-13-jacqmin.pdf). TALEP seminar slides, Aix-Marseille University, 13 January 2022.
- Jurafsky, D., & Martin, J. H. (2026). [Frame-Based Dialogue Systems](https://web.stanford.edu/~jurafsky/slp3/K.pdf). Appendix K of *Speech and Language Processing*, 3rd edition draft. [PDF](/sources/15c773945807396b696ab2a8e25a9595.bin).
- Rasa. [Forms](https://rasa.com/docs/rasa/forms/). Rasa documentation.
- Rasa Learning Center archive: [basic forms](https://learning.rasa.com/archive/conversational-ai-2/basic-forms/), [extracting slots from text](https://learning.rasa.com/archive/rasa-forms-3/from-text/), [form validation](https://learning.rasa.com/archive/rasa-forms-2/validation/).
- Rasa forum threads: [forms and slot validations in Rasa Pro](https://forum.rasa.com/t/forms-and-slot-validations-in-rasa-pro/66897), [Rasa is matching intent in active loop](https://forum.rasa.com/t/rasa-is-matching-intent-in-active-loop/60818).
- Schulz, H., Zumer, J., El Asri, L., & Sharma, S. (2017). [A Frame Tracking Model for Memory-Enhanced Dialogue Systems](https://aclanthology.org/W17-2626/). 2nd Workshop on Representation Learning for NLP. [doi:10.18653/v1/W17-2626](https://doi.org/10.18653/v1/W17-2626).
- Sun, Z., Huang, Z., et al. (2022). [On Tracking Dialogue State by Inheriting Slot Values in Mentioned Slot Pools](https://www.ijcai.org/proceedings/2022/0607.pdf). IJCAI 2022.
- Community posts: [Rasa custom forms](https://dev.to/petr7555/rasa-custom-forms-3d20) and [Rasa requested slot](https://dev.to/petr7555/rasa-requestedslot-4ai7) (DEV Community); [Amazon Lex and AWS Lambda beyond Hello World](https://medium.com/velotio-perspectives/amazon-lex-aws-lambda-beyond-hello-world-1403c1825e72) (Medium); [Play a message to the user after confirmation prompt](https://stackoverflow.com/questions/55706446/play-a-message-to-the-user-after-confirmation-prompt-like-please-wait-while-w) (Stack Overflow); [Frame-based Dialogue System](https://velog.io/@brightalot/자연어처리-Frame-based-Dialogue-System) (Velog, in Korean).
- Scribd uploads: [Frame-Based Dialogue Systems](https://www.scribd.com/document/984655140/Frame-Based-Dialogue-Systems) and [AWS Lex Bot Developer Deep Technical Round](https://www.scribd.com/document/967763483/AWS-Lex-Bot-Developer-Deep-Technical-Round).
- Rasa (2021) on YouTube: [Introduction to Rasa Forms | Rasa Tutorial](https://www.youtube.com/watch?v=U3an88fjFRc) and [How to Validate Form Input in Rasa | Rasa Tutorials](https://www.youtube.com/watch?v=CKn4ZBh9PpY).

## References


- Amazon. [Be Multimodal](https://developer.amazon.com/en-US/alexa/alexa-haus/design-principles/be-multimodal). Alexa design principles. ^amazon-be-multimodal
- Apple (2026). [Siri AI, a profoundly more capable and personal assistant, is here](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/). Apple Newsroom. ^apple-2026-siri-ai-launch
- Google (2025). [The Assistant experience on mobile is upgrading to Gemini](https://blog.google/products-and-platforms/products/gemini/google-assistant-gemini-mobile/). The Keyword. ^google-2025-assistant-gemini
- Google. [Conversation Design](https://developers.google.com/assistant/conversation-design/what-is-conversation-design). Google for Developers. ^google-conversation-design
- Horvitz, E. (1999). [Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/). CHI 1999. [doi:10.1145/302979.303030](https://doi.org/10.1145/302979.303030). ^horvitz-1999
- IBM. [AI Agent Builder | IBM watsonx Orchestrate](https://www.ibm.com/products/watsonx-orchestrate/ai-assistant-builder). ^ibm-watsonx-agent-builder
- Microsoft (2026). [Copilot's agentic capabilities in Word, Excel, and PowerPoint are generally available](https://www.microsoft.com/en-us/copilot/blog/2026/04/22/copilots-agentic-capabilities-in-word-excel-and-powerpoint-are-generally-available/). Microsoft Copilot Blog. ^microsoft-2026-copilot-agentic
- Microsoft. [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines). Microsoft Learn. ^microsoft-mcp-ui-guidelines
- Nielsen Norman Group (2024). [AI Chat Is Not (Always) the Answer](https://www.nngroup.com/articles/ai-chat-not-the-answer/). ^nngroup-2024-ai-chat
- OpenAI. [Build with the Apps SDK](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk). OpenAI Help Center. ^openai-apps-sdk-help
- Qin, L., et al. (2023). [End-to-end Task-oriented Dialogue: A Survey of Tasks, Methods, and Future Directions](https://aclanthology.org/2023.emnlp-main.363/). EMNLP 2023. [doi:10.18653/v1/2023.emnlp-main.363](https://doi.org/10.18653/v1/2023.emnlp-main.363). ^qin-2023
- Rasa. [Rasa CALM | High-Trust Conversational AI Without Hallucinations](https://rasa.com/calm). ^rasa-calm
