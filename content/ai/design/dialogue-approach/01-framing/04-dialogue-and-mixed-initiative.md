---
draft: false
toc: true
title: "Dialogue Systems and Mixed-Initiative Interaction"
description: "Connects the classical dialogue pipeline and task-oriented dialogue research to mixed-initiative HCI, explaining when conversation is the research object and when a broader task model helps."
weight: "40"
linkTitle: "Mixed-Initiative Interaction"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}}) · Research hub: [Dialogue systems]({{< ref "dialogue-systems" >}})

## Classical dialogue pipeline


A classical dialogue system runs speech recognition, language understanding into a semantic frame, dialogue management (state tracking and the choice of the next act, including database or API access), language generation and speech synthesis. ([Jurafsky & Martin 2000](#jurafsky-2000); [McTear 2020](#mctear-2020)) The components, their evaluation and their history are covered in [Frame-based and closed-set task dialogue]({{< ref "dialogue-systems/frame-based-dialogue" >}}).

## Why researchers still use the term


There is an important qualification: in academic literature, dialogue doesn't necessarily mean text. Dialogue systems can use speech and multimodal interaction.

Also, task-oriented dialogue systems explicitly aim to complete tasks, including retrieving information and executing operations through APIs. So the term is legitimate within that research tradition.

The limitation is its scope. It makes conversational exchange central to how the system is defined.

An alternative research tradition is mixed-initiative interaction, which studies how humans and computers collaborate through automation, direct manipulation, and shared control. Horvitz's work established this framing well before modern LLM assistants. ([Horvitz 1999](#horvitz-1999))

## Academic categories and where practitioners diverge


Academic dialogue-system research and current practitioner architecture still overlap considerably, but they put their conceptual boundaries in different places.

**Task-oriented dialogue is fundamentally goal-centred, but dialogue remains the research object.** Recent ACL work characterises task-oriented dialogue systems as helping users achieve defined goals by tracking conversational state and producing suitable responses. ([Bang et al. 2023](#bang-2023)) Classical frame-based systems fill their slots and then query a database, and schema-guided work describes assistants as a conversational interface to many services and APIs. ([Jurafsky & Martin 2026](#jurafsky-2026), K.1.3; [Rastogi et al. 2020](#rastogi-2020)) So the academic category has never meant "mere conversation": back-end operations and structured domain state have long been part of it.

That explains why a wallet assistant that identifies `change_transaction_category`, obtains parameters and invokes an API can legitimately be studied as a task-oriented dialogue system **when the interaction is organised as dialogue**. Modern TOD research still studies dialogue state, structured ontologies, intent detection and slot labelling, even as end-to-end models replace some classical modules. ([Chen et al. 2023](#chen-2023))

The limitation appears when the product stops being organised primarily as dialogue. Consider:

> User selects three transactions -> AI recognises a pattern -> application proposes "make recurring" -> a structured editor opens -> user modifies dates directly -> application validates -> user presses Confirm -> assistant later sends a notification.

There may be a sentence of natural language at the beginning and another at the end. Classifying the **whole system** as a dialogue system privileges a small part of the interaction over its resource model, action semantics, workflow, state transition, approval mechanism and direct-manipulation UI.

Academic **mixed-initiative interaction** provides a broader foundation. The classic HCI account treats mixed initiative as combining automation with direct user control and allowing human and machine to contribute at suitable points. ([Horvitz 1999](#horvitz-1999)) Microsoft's continuing research describes situated interaction as collaboration over both verbal and non-verbal channels, and its SIGMA task-assistance project combines step-based procedures, LLM answers, vision and spatial interaction. ([Microsoft Research](#microsoft-research-sigma)) This maps closely to the task-assistance system described in these notes.

There is therefore a useful division:

| Research/practice tradition | Primary unit of analysis | Where a broader task assistant fits |
| --- | --- | --- |
| **Task-oriented dialogue** | Goal-directed sequence of conversational turns and dialogue state | Covers the natural-language coordination part well; too narrow when interaction moves substantially into direct UI or proactive execution. ([Qin et al. 2023](#qin-2023)) |
| **Conversational UX** | How people communicate with systems using conversational conventions | Useful for language, turn-taking, repair and persona. Google explicitly broadens it to multimodal conversation. ([Google](#google-conversation-design)) |
| **Mixed-initiative HCI** | Allocation of initiative and control between user and automation | Strong match for systems that suggest, prepare, ask, wait, execute and allow direct correction. ([Horvitz 1999](#horvitz-1999)) |
| **Assistant platforms** | Product that mediates information, applications and actions | Increasingly closest to the broad product architecture: Siri, Gemini, Alexa+, Copilot, ChatGPT apps, Slack agents. ([Apple 2026](#apple-2026-siri-ai-launch)) |
| **Workflow / process architectures** | Controlled execution of a business task | Captures bounded, auditable execution particularly well; Rasa explicitly separates language interpretation from deterministic flows. ([Rasa](#rasa-calm)) |
| **Agent architectures** | Goal pursuit and action selection, often through tools | Captures increasing machine initiative, but current practitioner terminology has no stable autonomy threshold. ([Google 2026](#google-2026-gemini-agentic)) |

This produces an important apparent contradiction. **Academics are correct to call many assistants dialogue systems**, because the research question may genuinely concern dialogue state or language-based task completion. **Practitioners are also correct to stop using dialogue as the main product category**, because the deployed product increasingly coordinates work through several interaction mechanisms.

The level of abstraction differs.

A useful analogy is a web application. "HTTP application" could be technically meaningful when studying its communication protocol, while being a poor top-level classification of an accounting product. In the same way, "dialogue system" may accurately describe a core interaction mechanism without adequately describing **what the overall system is for**.

---

Related: [Task assistance beyond dialogue]({{< ref "ai/design/dialogue-approach/01-framing/01-task-assistance-beyond-dialogue" >}}) · [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}) · [Terminology and taxonomy]({{< ref "ai/design/dialogue-approach/01-framing/03-terminology-and-taxonomy" >}}).

Original text: [ds.md](/ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative.assets/ds.txt) · [dialogue-systems-mislead.md](/ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative.assets/dialogue-systems-mislead.txt) · [dialogue-systems-obsidian-references.md](/ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative.assets/dialogue-systems-obsidian-references.txt).

## Further reading


- [Reiter 2025](/sources/75150fd51c9544e19f3ae64bd809970c.bin), *Natural Language Generation* ([doi:10.1007/978-3-031-68582-8](https://doi.org/10.1007/978-3-031-68582-8)) -- the generation stage of the pipeline

## References


- Apple (2026). [Siri AI, a profoundly more capable and personal assistant, is here](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/). Apple Newsroom. ^apple-2026-siri-ai-launch
- Bang, N., Lee, J., & Koo, M.-W. (2023). [Task-Optimized Adapters for an End-to-End Task-Oriented Dialogue System](https://aclanthology.org/2023.findings-acl.464/). Findings of ACL 2023. [doi:10.18653/v1/2023.findings-acl.464](https://doi.org/10.18653/v1/2023.findings-acl.464). ^bang-2023
- Chen, Z., et al. (2023). [OPAL: Ontology-Aware Pretrained Language Model for End-to-End Task-Oriented Dialogue](https://aclanthology.org/2023.tacl-1.5/). TACL. [doi:10.1162/tacl_a_00534](https://doi.org/10.1162/tacl_a_00534). ^chen-2023
- Google (2026). [The Gemini app becomes more agentic, delivering proactive, 24/7 help](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/). The Keyword. ^google-2026-gemini-agentic
- Google. [Conversation Design](https://developers.google.com/assistant/conversation-design/what-is-conversation-design). Google for Developers. ^google-conversation-design
- Horvitz, E. (1999). [Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/). CHI 1999. [doi:10.1145/302979.303030](https://doi.org/10.1145/302979.303030). ^horvitz-1999
- Jurafsky, D., & Martin, J. H. (2000). *Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition*. 1st edition. Prentice Hall. ^jurafsky-2000
- Jurafsky, D., & Martin, J. H. (2026). [Frame-Based Dialogue Systems](https://web.stanford.edu/~jurafsky/slp3/K.pdf). Appendix K of *Speech and Language Processing*, 3rd edition draft. [PDF](/sources/15c773945807396b696ab2a8e25a9595.bin). ^jurafsky-2026
- McTear, M. (2020). [Conversational AI: Dialogue Systems, Conversational Agents, and Chatbots](https://doi.org/10.1007/978-3-031-02176-3). Morgan & Claypool. [doi:10.1007/978-3-031-02176-3](https://doi.org/10.1007/978-3-031-02176-3). ^mctear-2020
- Microsoft Research. [SIGMA: An open-source mixed-reality system for research on physical task assistance](https://www.microsoft.com/en-us/research/blog/sigma-an-open-source-mixed-reality-system-for-research-on-physical-task-assistance/). Microsoft Research Blog. ^microsoft-research-sigma
- Qin, L., et al. (2023). [End-to-end Task-oriented Dialogue: A Survey of Tasks, Methods, and Future Directions](https://aclanthology.org/2023.emnlp-main.363/). EMNLP 2023. [doi:10.18653/v1/2023.emnlp-main.363](https://doi.org/10.18653/v1/2023.emnlp-main.363). ^qin-2023
- Rasa. [Rasa CALM | High-Trust Conversational AI Without Hallucinations](https://rasa.com/calm). ^rasa-calm
- Rastogi, A., Zang, X., Sunkara, S., Gupta, R., & Khaitan, P. (2020). [Towards Scalable Multi-Domain Conversational Agents: The Schema-Guided Dialogue Dataset](https://research.google/pubs/towards-scalable-multi-domain-conversational-agents-the-schema-guided-dialogue-dataset/). AAAI 2020. [doi:10.1609/aaai.v34i05.6394](https://doi.org/10.1609/aaai.v34i05.6394). ^rastogi-2020
