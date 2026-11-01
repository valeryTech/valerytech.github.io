---
draft: false
toc: true
description: "An annotated source guide and bibliography for the task-assistance framing, explaining what practitioner platforms, mixed-initiative research, and dialogue frameworks contribute and where source access was limited."
title: "02 Sources And References"
linkTitle: "02 Sources And References"
---
# Sources and references


[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

This is the reference collection from the original documents. Repeated bibliography URLs are listed once; citations stay with the notes that use them.

## Research source context


The research prioritised official platform documentation, product announcements and design guidance from Google, Microsoft, Apple, Amazon, IBM, OpenAI, Slack/ Salesforce and Bank of America; it then used Rasa, Intercom and Nielsen Norman Group as practitioner perspectives, with ACL and Microsoft Research for the academic comparison. Most practitioner evidence is from 2016-2026, with Horvitz's 1999 mixed-initiative work retained as a foundational exception because the term's original HCI meaning is directly relevant. [Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/)

| Source | Why it is useful |
| --- | --- |
| **Google -- Conversation Design** | A strong historical practitioner statement of the conversation-centred view, while explicitly arguing that conversation can be multimodal. It exposes both the strength and the limitation of "dialogue" as the organising concept. [Conversation Design](https://developers.google.com/assistant/conversation-design/what-is-conversation-design) |
| **Google -- Google Assistant to Gemini / 2026 Gemini direction** | Documents the vocabulary shift from natural-language assistant towards a personal, app-integrated, proactive and agentic assistant. [The Assistant experience on mobile is upgrading to Gemini](https://blog.google/products-and-platforms/products/gemini/google-assistant-gemini-mobile/) |
| **Microsoft -- Copilot MCP UI guidelines** | The clearest current practitioner treatment of dialogue and structured UI as complementary: inline chat for simple work; dedicated workspace for editing, comparison and persistent state. [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines) |
| **Microsoft -- agentic Copilot in Office** | Explicitly frames the evolution from answering/suggesting towards changing the application canvas and completing multi-step work. [Copilot's agentic capabilities in Word, Excel, and PowerPoint are generally available](https://www.microsoft.com/en-us/copilot/blog/2026/04/22/copilots-agentic-capabilities-in-word-excel-and-powerpoint-are-generally-available/) |
| **Apple -- Siri AI and App Intents/snippets guidance** | Shows an assistant built around personal context and task completion while integrating language with application actions, system context and compact direct UI. [Siri AI, a profoundly more capable and personal assistant, is here](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/) |
| **Amazon -- Alexa multimodal design / Alexa+** | Provides one of the most concise practitioner formulations: "voice-first, but not voice-only"; current Alexa+ framing has moved towards a personal AI assistant that gets things done. [Be Multimodal](https://developer.amazon.com/en-US/alexa/alexa-haus/design-principles/be-multimodal) |
| **IBM watsonx Orchestrate** | Separates information, guidance and doing work, and distinguishes conversational interaction from executable skills and automation. [AI Assistant Builder -- watsonx Orchestrate](https://www.ibm.com/products/watsonx-orchestrate/ai-assistant-builder) |
| **OpenAI -- Apps SDK** | Explicitly gives developers control over both chat behaviour and interface while connecting to external back ends, demonstrating conversation plus interactive application UI as separate concerns. [Build with the Apps SDK](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk) |
| **Rasa CALM** | Architecturally explicit separation of language interpretation from structured business logic and flows. Particularly relevant to the closed-task/workflow approach. [Rasa CALM](https://rasa.com/calm) |
| **Nielsen Norman Group -- AI Chat Is Not (Always) the Answer** | Practitioner UX argument for treating chat as one possible interface and starting from the user problem; explicitly discusses non-conversational AI alternatives. [AI Chat Is Not (Always) the Answer](https://www.nngroup.com/articles/ai-chat-not-the-answer/) |
| **ACL task-oriented dialogue research** | Establishes why "task-oriented dialogue" remains academically legitimate: dialogue systems can be goal-directed, API-backed and structured around domain state. [End-to-end Task-oriented Dialogue: A Survey of Tasks, Methods, and Future Directions](https://aclanthology.org/2023.emnlp-main.363/) |
| **Microsoft mixed-initiative and situated-interaction research** | Supplies the broader HCI category in which automated assistance, direct manipulation, verbal/non-verbal channels and shared initiative coexist. [Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/) |

A few source-access limitations are worth recording. Apple's Human Interface Guidelines are heavily JavaScript-rendered in the web crawler; indexed official HIG material, WWDC material and Apple Newsroom pages were therefore used together. Some Google Assistant conversation-design documentation remains online even though the corresponding Conversational Actions platform has been sunset; it is used here as **historical practitioner evidence**, not as a description of Google's current platform. [Conversation Design](https://developers.google.com/assistant/conversation-design/what-is-conversation-design) OpenAI's current Apps SDK documentation was available through the official Help Centre and official OpenAI pages. [Build with the Apps SDK](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk)

Overall, the evidence supports a fairly strong conclusion: **"dialogue system" is a good name for a dialogue-centred interaction system or subsystem; it is an increasingly poor umbrella for human-AI systems whose defining job is to help people understand, decide, manipulate and change domain state across multiple interfaces.** The practitioner vocabulary is converging, imperfectly, on separating the **assistant/agent role**, the **actions/workflows/tools that do the work**, and the **conversation/UI surfaces through which humans collaborate with it**.

## Report bibliography


- [Conversation Design | Google for Developers](https://developers.google.com/assistant/conversation-design/what-is-conversation-design)
- [The Assistant experience on mobile is upgrading to Gemini | Google](https://blog.google/products-and-platforms/products/gemini/google-assistant-gemini-mobile/)
- [Copilot's agentic capabilities in Word, Excel, and PowerPoint are generally available | Microsoft](https://www.microsoft.com/en-us/copilot/blog/2026/04/22/copilots-agentic-capabilities-in-word-excel-and-powerpoint-are-generally-available/)
- [AI Assistant Builder -- watsonx Orchestrate | IBM](https://www.ibm.com/products/watsonx-orchestrate/ai-assistant-builder)
- [Rasa CALM | Rasa](https://rasa.com/calm)
- [Task-Optimized Adapters for an End-to-End Task-Oriented Dialogue System | ACL Anthology](https://aclanthology.org/2023.findings-acl.464/)
- [AI Chat Is Not (Always) the Answer | Nielsen Norman Group](https://www.nngroup.com/articles/ai-chat-not-the-answer/)
- [Siri AI, a profoundly more capable and personal assistant, is here | Apple](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/)
- [The Gemini app becomes more agentic, delivering proactive, 24/7 help | Google](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)
- [Principles of Mixed-Initiative User Interfaces | Microsoft Research](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/)
- [Be Multimodal | Amazon Alexa Design](https://developer.amazon.com/en-US/alexa/alexa-haus/design-principles/be-multimodal)
- [SIGMA: An open-source mixed-reality system for research on physical task assistance | Microsoft Research](https://www.microsoft.com/en-us/research/blog/sigma-an-open-source-mixed-reality-system-for-research-on-physical-task-assistance/?lang=ja)
- [OPAL: Ontology-Aware Pretrained Language Model for End-to-End Task-Oriented Dialogue | ACL Anthology](https://aclanthology.org/2023.tacl-1.5/)
- [End-to-end Task-oriented Dialogue: A Survey of Tasks, Methods, and Future Directions | ACL Anthology](https://aclanthology.org/2023.emnlp-main.363/)
- [Google's Gemini app hits 1 billion monthly active users | Google](https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/)
- [Android Halo helps you stay in sync with your AI agent | Google](https://blog.google/products-and-platforms/platforms/android/android-halo/)
- [Apple introduces Siri AI, a profoundly more capable and personal assistant | Apple](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/)
- [Siri | Apple Developer Documentation](https://developer.apple.com/design/human-interface-guidelines/siri/)
- [AppIntent | Apple Developer Documentation](https://developer.apple.com/documentation/AppIntents/AppIntent)
- [Alexa+ now fully available across Canada, free for Prime members | Amazon](https://www.aboutamazon.com/news/devices/alexa-plus-canada-launch)
- [How to get Alexa Plus free with Prime membership | Amazon](https://www.aboutamazon.com/news/devices/alexa-plus-available-free-prime-members-us)
- [Amazon's Alexa+ expands to Samsung TVs, BMWs, Oura rings and more | Amazon](https://www.aboutamazon.com/news/devices/alexa-plus-samsung-bmw-bosch-oura-integrations)
- [About Proactive Events | Alexa Skills Kit](https://developer.amazon.com/en-US/docs/alexa/smapi/proactive-events-api.html)
- [User experience guidelines for MCP apps in declarative agents for Microsoft 365 Copilot | Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines)
- [Introducing Microsoft Copilot actions, new agents, and tools to empower IT | Microsoft](https://www.microsoft.com/en-us/copilot/blog/2024/11/19/introducing-copilot-actions-new-agents-and-tools-to-empower-it-teams/)
- [Build with the Apps SDK | OpenAI Help Center](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk)
- [Introducing apps in ChatGPT and the new Apps SDK | OpenAI](https://openai.com/fil-PH/index/introducing-apps-in-chatgpt/)
- [Work with AI agents in Slack | Slack](https://slack.com/help/articles/33076000248851-Work-with-AI-agents-in-Slack)
- [Slack AI Agents with Agentforce & Agentic AI | Slack](https://slack.com/ai-agents)
- [Use AI to build Slack workflows | Slack](https://slack.com/help/articles/32843655109395-Use-AI-to-build-Slack-workflows)
- [Fin AI Agent explained | Intercom Help](https://www.intercom.com/help/en/articles/7120684-fin-ai-agent-explained)
- [Bank of America | Online Banking | Service Agreement](https://secure.bankofamerica.com/login/enroll/displaysa.go)
- [Snippets | Apple Developer Documentation](https://developer.apple.com/design/human-interface-guidelines/snippets)

## Dialogue-framework bibliography


- [Speech and Language Processing: dialogue systems](https://web.stanford.edu/~jurafsky/slp3/K.pdf)
- [ACL 2017: frame tracking reference](https://aclanthology.org/W17-2626/)
- [IJCAI 2022: dialogue state tracking reference](https://www.ijcai.org/proceedings/2022/0607.pdf)
- [Rasa Forms](https://rasa.com/docs/rasa/forms/)
- [Amazon Lex: intent slots](https://docs.aws.amazon.com/lexv2/latest/dg/intent-slots.html)
- [Amazon Lex: intent confirmation](https://docs.aws.amazon.com/lexv2/latest/dg/intent-confirm.html)
- [Amazon Lex: built-in slot confirmation](https://docs.aws.amazon.com/lexv2/latest/dg/built-in-slot-confirmation.html)
- [Frame-Based Dialogue Systems (Scribd)](https://www.scribd.com/document/984655140/Frame-Based-Dialogue-Systems)
- [Rasa forum: forms and slot validation](https://forum.rasa.com/t/forms-and-slot-validations-in-rasa-pro/66897)
- [Dialogue reference video CKn4ZBh9PpY](https://www.youtube.com/watch?v=CKn4ZBh9PpY)
- [Rasa learning archive: form validation](https://learning.rasa.com/archive/rasa-forms-2/validation/)
- [Amazon Lex: confirmation slot type announcement](https://aws.amazon.com/about-aws/whats-new/2023/08/amazon-lex-confirmation-slot-type/)
- [Frame-based dialogue systems (Velog)](https://velog.io/@brightalot/자연어처리-Frame-based-Dialogue-System)
- [Rasa custom forms (DEV Community)](https://dev.to/petr7555/rasa-custom-forms-3d20)
- [Stack Overflow: message after confirmation](https://stackoverflow.com/questions/55706446/play-a-message-to-the-user-after-confirmation-prompt-like-please-wait-while-w)
- [Amazon Lex: conversation next steps](https://docs.aws.amazon.com/lexv2/latest/dg/paths-nextstep.html)
- [Amazon Lex V1: PostText](https://docs.aws.amazon.com/lex/latest/dg/API_runtime_PostText.html)
- [Jacqmin: dialogue state tracking seminar](https://talep.lis-lab.fr/seminars/2022-01-13-jacqmin.pdf)
- [Rasa requested slot (DEV Community)](https://dev.to/petr7555/rasa-requestedslot-4ai7)
- [Rasa learning archive: extracting slots from text](https://learning.rasa.com/archive/rasa-forms-3/from-text/)
- [arXiv paper 2011.09553](https://www.arxiv.org/pdf/2011.09553v1.pdf)
- [Dialogue reference video U3an88fjFRc](https://www.youtube.com/watch?v=U3an88fjFRc)
- [Amazon Lex and AWS Lambda beyond Hello World](https://medium.com/velotio-perspectives/amazon-lex-aws-lambda-beyond-hello-world-1403c1825e72)
- [Emergent Mind: dialogue state tracking](https://www.emergentmind.com/topics/dialogue-state-tracking-dst)
- [Rasa learning archive: basic forms](https://learning.rasa.com/archive/conversational-ai-2/basic-forms/)
- [AWS SDK for Ruby: Lex IntentSummary](https://docs.aws.amazon.com/pt_br/sdk-for-ruby/v3/api/Aws/Lex/Types/IntentSummary.html)
- [Rasa forum: intent matching in an active loop](https://forum.rasa.com/t/rasa-is-matching-intent-in-active-loop/60818)
- [AWS Lex Bot Developer Deep Technical Round (Scribd)](https://www.scribd.com/document/967763483/AWS-Lex-Bot-Developer-Deep-Technical-Round)

## Original attachment


The source report mentions `Dialogue systems versus broader human-AI task assistants.pdf` through a ChatGPT-internal file citation with no public URL. That PDF was not found in the available notes folders. The exact original footnote is retained in the report snapshot.

The local `02-add-feature.md` references in the framework notes resolve to the Quick Add feature specification.

---

Related: [Practitioner product comparison]({{< ref "ai/design/dialogue-approach/03-research/01-practitioner-product-comparison" >}}) · [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}) · [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}).

Original text: [dialogue-systems-obsidian-references.md](/ai/design/dialogue-approach/03-research/02-sources-and-references.assets/dialogue-systems-obsidian-references.txt) · [example.md](/ai/design/dialogue-approach/03-research/02-sources-and-references.assets/example.txt) · [mapping.md](/ai/design/dialogue-approach/03-research/02-sources-and-references.assets/mapping.txt).

## Library sources


- [Jurafsky and Martin 2026](/sources/nlp/dialogue-systems/jurafsky-2026-slp3-appendix-k-frame-based-dialogue.pdf.enc), *SLP3 Appendix K: Frame-Based Dialogue Systems* -- on *Dialogue-framework bibliography*
