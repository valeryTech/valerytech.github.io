---
draft: false
toc: true
title: "Dialogue Systems"
description: "Research hub for dialogue systems: task-oriented, open-domain and question-answering dialogue, the classical pipeline and its LLM-era replacements, initiative, clarification, spoken dialogue and evaluation."
linkTitle: "Dialogue Systems"
---

A **dialogue system** (conversational agent) is a system that talks with a user over several turns, by text, speech or a mix of modalities. This folder studies dialogue systems as a research subject in their own right. The applied design work, which treats dialogue as one way to coordinate task assistance, is in [Dialogue approach]({{< ref "ai/design/dialogue-approach/00-index" >}}).

"Dialogue system" is the umbrella term here, as it is in NLP. LLMs and agents are covered as components inside it, not as a separate frame: an LLM can fill one stage of the pipeline (NLU, state tracking, policy or generation) or several at once, and an agent loop with tools is one way to implement the policy and the execution side of a task-oriented system.

## Scope


The research literature usually separates three kinds of system ([Deriu et al. 2021](#deriu-2021)):

- **Task-oriented dialogue**: the user wants to get something done, such as booking, retrieving information, or calling an API. The classical design is frame-based, with frames, slots, intents, dialogue acts, a dialogue state and a policy.
- **Open-domain (chit-chat) dialogue**: conversation without a fixed task, judged by engagement, coherence and consistency.
- **Question-answering dialogue**: information seeking over several turns, close to conversational search.

The simplest task-oriented system, and the usual place to start, is the **closed-set task assistant**. It supports a fixed catalog of tasks, each with known inputs and an operation to run, so it only has to recognize the task and collect what the task needs. Frame-based dialogue is its classical form. In the LLM-era form, the model interprets requests and moves through a state machine or constraint graph, while application logic enforces valid inputs, transitions and permissions ([Closed-set task assistant]({{< ref "ai/system-types/project-examples/cases/closed-set-task-assistant" >}})). Typical examples are booking, account recovery and form completion.

Topics this section covers across those types:

- the classical pipeline (ASR -> NLU -> dialogue state tracking -> policy -> NLG -> TTS) and what end-to-end and LLM-based systems keep or replace from it
- **LLMs and agents as components**: which pipeline stages an LLM takes over, prompting and fine-tuning for dialogue, tool-using agent loops as policy and execution, and memory as dialogue state
- initiative: user, system and mixed initiative, proactivity, and switching between chit-chat and task modes
- grounding and clarification: repair, clarifying questions, and handling underspecified requests
- spoken dialogue: ASR errors and their propagation, turn-taking, voice assistants
- evaluation: task success, human judgement, automatic metrics, user simulation, and how models behave in multi-turn conversations
- the history of the field, from Eliza and GUS-style frames to LLM-based agents

## Open questions


Questions to work through as the notes grow:

- What does an LLM-based assistant still need from the classical architecture (explicit state, ontology, policy), and where is an explicit dialogue state worth its cost?
- How do task-oriented dialogue, tool-using agents and form-filling interfaces relate? Are they one problem described in three vocabularies?
- When should a system take the initiative, for example to ask, propose or redirect, and how is that decision evaluated?
- Which evaluation methods transfer from pre-LLM dialogue research to LLM assistants, and which no longer fit?

## Notes


- [Frame-based and closed-set task dialogue]({{< ref "dialogue-systems/frame-based-dialogue" >}}): frames, slots and a fixed task catalog; NLU, dialogue acts, state tracking, policy and generation; task-success and PARADISE evaluation; POMDPs; closed task sets as schemas, flows and skills.
- [Intent usage in the LLM-based workflow era]({{< ref "dialogue-systems/intent-usage" >}}): intent detection (the NLU stage) as routing in LLM products, covering taxonomy design, classification methods and evaluation.
- [LLMs and agents as components]({{< ref "dialogue-systems/llms-as-components" >}}): where an LLM or agent loop sits in the pipeline, three integration patterns, and what the evidence says about state, control and multi-turn reliability.
- [Modular Dialogue Architectures]({{< ref "dialogue-systems/modular-dialogue-architectures" >}}): specialist modules under a central manager, from Alexa Prize generator-and-ranker designs to LLM systems; early routing, late arbitration and fusion; clem:todd's modular vs monolithic comparison.
- [How LLMs change user-system interactions]({{< ref "dialogue-systems/llms-and-interactions" >}}): from intent, entity and slot pipelines to workflows, tool contracts and permissions, and four LLM-era architectures.

## Research conversation


Research continuation (ChatGPT, 2026-11-11) is the conversation this research started from. It traces which Alexa Prize teams carried their designs into the LLM era (Alquist 5.0, Chirpy Cardinal's Dialogue Distillery, Athena 3.0, HOKIEBOT), why those designs transfer to task-oriented and closed-set assistants (Chirpy Cardinal, Athena 2.0, Emora STDM), and the evidence on routing, arbitration and fusion of dialogue modules. Its claims are unchecked unless a note marks them as checked.

## Related notes in the vault


- [Dialogue approach: reading map]({{< ref "ai/design/dialogue-approach/00-index" >}}): task assistance with dialogue as one interaction form, and the Quick Add draft pipeline. The most relevant notes:
	- [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}): research categories against practitioner categories, and mixed initiative
	- [Terminology and taxonomy]({{< ref "ai/design/dialogue-approach/01-framing/03-terminology-and-taxonomy" >}}): assistant, copilot, agent, workflow and dialogue
	- [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}): frames, DST, Rasa and Lex
	- [Clarification as draft repair]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/06-clarification-as-draft-repair" >}})
	- [Requirements and evaluation for task assistants]({{< ref "ai/design/dialogue-approach/01-framing/06-requirements-and-evaluation" >}})
- Grounded NLU and Semantic processing stages: the NLU and ASR-correction side of the pipeline
- [Interactions]({{< ref "ai/design/interactions" >}}): intents, semantic routing and user-system interaction
- Classifying assistant types
- [Closed-set task assistant]({{< ref "ai/system-types/project-examples/cases/closed-set-task-assistant" >}}): the simplest task-oriented type as a system-type case, with an LLM working inside a state machine that the application enforces
- LLMs and Tool use: the LLM component and the agent side of task completion
- [Agents]({{< ref "ai-engineering/agents" >}}): agent design and harnesses, which serve as the policy and execution component
- Multi-turn chat evals: practitioner evaluation of multi-turn conversations

## Sources in the library


The main folder is `sources/nlp/dialogue-systems/`; see its `_map.md` for summaries.

### Books and chapters


- [Jurafsky & Martin 2026](/sources/15c773945807396b696ab2a8e25a9595.bin), *SLP3 Appendix K: Frame-Based Dialogue Systems* -- the classical frame-and-slot architecture and task-based evaluation
- [McTear & Ashurkina 2024](/sources/a617908d6c1a8f1e6b0ccde887023560.bin), *Transforming Conversational AI* ([doi:10.1007/979-8-8688-0110-5](https://doi.org/10.1007/979-8-8688-0110-5)) -- conversation design and platforms in the LLM era
- [Freed et al. 2025](/sources/88911fed4ab5167e4282b4d9fb6729ff.bin), *Effective Conversational AI* -- diagnosing and fixing production conversational AI (EPUB: EPUB)
- [Reiter 2025](/sources/75150fd51c9544e19f3ae64bd809970c.bin), *Natural Language Generation* ([doi:10.1007/978-3-031-68582-8](https://doi.org/10.1007/978-3-031-68582-8)) -- the NLG stage

### Surveys


- [Wang et al. 2023](/sources/61e7f0e896e3ea9d49bd2db275eb5b77.bin), *A Survey of the Evolution of Language Model-Based Dialogue Systems* ([arXiv:2311.16789](https://arxiv.org/abs/2311.16789)) -- four stages, from statistical systems to LLMs
- [Deriu et al. 2021](/sources/74dc040cbadfee815ee111f1fb0fd20f.bin), *Survey on evaluation methods for dialogue systems* ([doi:10.1007/s10462-020-09866-x](https://doi.org/10.1007/s10462-020-09866-x)) -- evaluation by system type, before LLM-as-judge
- [Deng et al. 2025](/sources/cb5fbaeded17f92d01336acca9940c36.bin), *Proactive Conversational AI* -- initiative, clarifying questions and target-guided dialogue

### Papers and theses


- [Liu et al. 2023](/sources/a3acfcbff5361c3fb093bc772a337cb3.bin), *Unified Conversational Models with System-Initiated Transitions* -- switching between chit-chat and task modes
- [Elizabeth 2024](/sources/5064e7d6e718cfcdfd939b00b16a5cff.bin), *Conversational Agents for Task-Oriented Dialogue* -- ReAct with tools on MultiWOZ, a negative result
- [Hu et al. 2021](/sources/076d3f32c5216a9069b6a40da242745f.bin), Alexa Prize socialbot advances -- open-domain dialogue (in `sources/nlp/dialogue-systems/alexa-prize/`, which also holds the 2017-2021 team papers; see that folder's `_map.md`)
- [Laban et al. 2026](/sources/9623d6706180470e65b31b95d656c423.bin), *LLMs Get Lost in Multi-Turn Conversation* -- LLM performance in underspecified multi-turn conversations
- [Peng et al. 2026](/sources/17e2e0d5edd1870e7c562a47ae314009.bin) -- detecting ASR errors and clarifying in spoken dialogue
- [Chen et al. 2026](/sources/0ce3dd53875e25345b2d821256e4905e.bin), *VoiceBench* ([doi:10.1162/TACL.a.628](https://doi.org/10.1162/TACL.a.628)) -- a benchmark for LLM voice assistants
- [Thonet et al. 2025](/sources/fb753342b3047ea7dc5718c70829fcdd.bin), *ELITR-Bench* -- a meeting assistant working over ASR transcripts

## References


- Deriu, J., Rodrigo, A., Otegi, A., et al. (2021). [Survey on evaluation methods for dialogue systems](https://doi.org/10.1007/s10462-020-09866-x). Artificial Intelligence Review, 54, 755-810. [doi:10.1007/s10462-020-09866-x](https://doi.org/10.1007/s10462-020-09866-x). [PDF](/sources/74dc040cbadfee815ee111f1fb0fd20f.bin). ^deriu-2021
