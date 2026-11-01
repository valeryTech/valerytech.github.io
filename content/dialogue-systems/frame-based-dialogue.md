---
draft: false
toc: true
title: "Frame-Based and Closed-Set Task Dialogue"
description: "The classical task-oriented dialogue system: frames, slots and a fixed task catalog; the NLU, dialogue-act, state-tracking, policy and generation components; task-success and PARADISE evaluation; POMDP dialogue management; and how closed task sets reappear as schemas, flows and skills."
weight: "10"
linkTitle: "Frame-Based Dialogue"
---

Part of [Dialogue systems]({{< ref "dialogue-systems" >}}).

A **task-based** (task-oriented) dialogue system helps a user complete a specific task, such as booking travel or setting an alarm. Most such systems have been **frame-based**: a frame is a knowledge structure that represents the user's task, made of **slots** that each take values of a given type. A set of frames is the system's **domain ontology**. The design comes from the GUS travel-planning system (Bobrow et al. 1977). ([Jurafsky & Martin 2026](#jurafsky-2026), Historical Notes) Jurafsky and Martin call it "the dominant industrial paradigm for dialogue systems for over 30 years". ([Jurafsky & Martin 2026](#jurafsky-2026), Appendix K, intro and Historical Notes)

**Closed-set** names the property that makes this work. The tasks, the frames and their slots are fixed in advance, so the system's job is to work out which task the user wants and fill its slots, not to decide what a task is. Deriu et al. characterize task-oriented systems by "a clearly defined and measurable goal, a structured dialogue behaviour, a closed domain to work on and a focus on efficiency". ([Deriu et al. 2021](#deriu-2021), §3.1) Each of the four makes the next easier. A closed domain allows a fixed ontology, a fixed ontology makes the dialogue structured, and a structured dialogue has a goal that can be measured. The same constraints make the closed-set task system the simplest kind of dialogue system to build and evaluate, which is why task-oriented work usually starts with it.

## Anatomy


The standard frame-based design is the **dialogue-state architecture** with six components: ASR, NLU, dialogue state tracking, dialogue policy, NLG and TTS. ([Jurafsky & Martin 2026](#jurafsky-2026), Fig. K.1, after Williams et al. 2016) [LLMs as components]({{< ref "dialogue-systems/llms-as-components" >}}#reference-architecture) shows the same pipeline and asks which parts an LLM can take over.

### NLU: domain, intent and slots


Each user utterance yields three things. ([Jurafsky & Martin 2026](#jurafsky-2026), K.0.1)

- **Domain classification**: air travel, alarm clock or calendar?
- **Intent determination**: which task, such as `SHOW-FLIGHTS` or `SET-ALARM`? Domain plus intent picks the frame to fill.
- **Slot filling**: which slot values does the utterance supply?

```text
"Show me morning flights from Boston to San Francisco on Tuesday"

DOMAIN: AIR-TRAVEL      INTENT: SHOW-FLIGHTS
ORIGIN-CITY: Boston     DEST-CITY: San Francisco
ORIGIN-DATE: Tuesday    ORIGIN-TIME: morning
```


The simplest systems use hand-written rules, for example a regular expression for `SET-ALARM`. Most use a supervised sequence labeler: an encoder tags each token with a BIO label for the slots, and the final token carries domain plus intent. The extracted strings are then **normalized** to the ontology, so that "San Francisco", "SF" and "SFO" all map to one value. In industry, rules and machine learning are usually combined at each step.

A minimal system is a small amount of code wrapped around this extractor: ask questions until every slot is filled, query the database, and report back using templates.

Intent detection in present-day LLM products is covered in [Intent usage in the LLM-based workflow era]({{< ref "dialogue-systems/intent-usage" >}}).

### Dialogue acts


To confirm, ask again or correct, the system needs **dialogue acts**: speech acts generalized to also represent grounding. ([Jurafsky & Martin 2026](#jurafsky-2026), K.1.1) The HIS restaurant system (Young et al. 2010) uses acts such as `INFORM(a=x)`, `REQUEST(a)`, `CONFIRM(a=x)`, `CONFREQ` (implicitly confirm and request), `AFFIRM`, `NEGATE` and `DENY`, each carrying the slot values it communicates. ([Jurafsky & Martin 2026](#jurafsky-2026), K.1.1) Some acts are valid only from the system, others only from the user.

### Dialogue state tracking


The tracker keeps the **current state of the whole frame**: all of the user's constraints so far, plus their most recent dialogue act. That is more than the slots in the current sentence. ([Jurafsky & Martin 2026](#jurafsky-2026), K.1.2)

```text
User:   I'm looking for a cheaper restaurant     inform(price=cheap)
User:   Thai food, somewhere downtown            inform(price=cheap, food=Thai, area=centre)
User:   Where is it?                             inform(price=cheap, food=Thai, area=centre); request(address)
```


A special case is **detecting user corrections**. Corrections are harder to recognize than ordinary utterances, because frustrated users hyperarticulate, which makes things harder for the recognizer ("I said BAL-TI-MORE, not Boston"). Detectors use semantic and phonetic similarity to the previous utterance, prosody and ASR confidence.

### Dialogue policy


The policy chooses the next dialogue act and its arguments, which is also called content planning. ([Jurafsky & Martin 2026](#jurafsky-2026), K.1.3) In early commercial systems it was the fill-slots-then-query loop. A richer policy decides when to answer, when to ask a clarifying question, and how to ground:

- **Explicit confirmation** ("...on September twenty-first. Is that correct?") makes errors easy to fix with a "no", but it is slow and awkward.
- **Implicit confirmation** ("When do you want to travel to Shanghai?") grounds the value in passing.
- **Rejection** ("I'm sorry, I didn't understand that.")

A common scheme picks among these by ASR confidence, with three thresholds:

| Confidence | Action |
| --- | --- |
| < α | reject |
| ≥ α | confirm explicitly |
| ≥ β | confirm implicitly |
| ≥ γ | don't confirm |

### NLG: sentence realization


Once the policy has chosen an act such as `recommend(name=Au Midi, neighborhood=midtown, cuisine=french)`, **sentence realization** produces the text. Systems trained on labeled dialogues such as MultiWOZ generalize by **delexicalizing**: slot values are replaced with placeholders ("*name* is in *neighborhood* and serves *cuisine* food") and filled back in afterwards. ([Jurafsky & Martin 2026](#jurafsky-2026), K.1.4)

## Evaluation


The closed task gives an extrinsic metric. ([Jurafsky & Martin 2026](#jurafsky-2026), K.0.2)

- **Task success rate** (or task error rate): how often the system booked the right flight or put the right event on the calendar.
- **Slot error rate**: inserted, deleted and substituted slots divided by reference slots. If one of three slots is wrong, the rate is 1/3. Slot precision, recall and F-score are alternatives.
- **Efficiency costs**: dialogue length in turns or seconds.

**PARADISE** (Walker, Litman, Kamm & Abella 1997) combines these. It describes the task independently of the dialogue strategy, as an attribute-value matrix of the information that has to be exchanged and in which direction. It then fits a linear regression that predicts user satisfaction from task success and dialogue costs. This makes two systems comparable even if one confirms often and the other acts directly. ([Deriu et al. 2021](#deriu-2021), §3, Fig. 5; [Walker et al. 1997](#walker-1997)) The train-service example must get origin, destination and departure range from the user and give back a departure time. Success is the degree to which the final dialogue state agrees with those requirements.

## Statistical dialogue management


From around 2000, dialogue policy became a learning problem: first **MDP** models (AT&T and Bell Labs), then **POMDP** models applied to small slot-filling tasks. ([Jurafsky & Martin 2026](#jurafsky-2026), Historical Notes) A POMDP system keeps a probability distribution over possible dialogue states, a **belief state**, because spoken input and inferred goals are uncertain. It chooses actions that maximize expected reward (Williams & Young 2007; Young et al. 2010). ([Jurafsky & Martin 2026](#jurafsky-2026), Historical Notes)

```text
uncertain evidence → belief state → choose question or task action → new evidence
```


Seen this way, a clarification question is an **information-acquisition action**: it has a cost, and it is worth asking when the expected improvement in the task outcome exceeds that cost. When a wrong action is dangerous or irreversible, the expected downside of acting under uncertainty should dominate. This reading is developed in Task-grounded information acquisition.

## History in brief


The SLP3 historical notes trace these lines. ([Jurafsky & Martin 2026](#jurafsky-2026), Historical Notes)

- **Pattern-action chatbots**: ELIZA (Weizenbaum 1966).
- **Frames**: GUS (Bobrow et al. 1977).
- **Dialogue structure follows task structure**: Grosz (1977), "task-oriented dialogues have a structure that closely parallels the structure of the task being performed".
- **Plan-based (BDI) models**: Allen, Cohen and Perrault. Speech acts are planned like other actions, and understanding runs the planner in reverse.
- **1990s machine learning** for slot filling and dialogue-act detection. This led to the dialogue-state model (Larsson & Traum 2000) and to state tracking as a benchmark problem with an annual challenge (Williams et al. 2016).
- **Reinforcement learning**: MDP, then POMDP policies.
- **Commercial adoption**: by around 2010 the GUS architecture was widely used commercially, for example in Siri.

## Closed task sets after the classical pipeline


The closed task set outlived the pipeline. It reappears under several names. The survey below comes from Classifying assistant types, where it was gathered for a wallet assistant:

| Term | Where it is used | What it emphasizes |
| --- | --- | --- |
| Task-oriented dialogue system | NLP research ([Qin et al. 2023](#qin-2023)) | The research umbrella, which also covers informational tasks |
| Schema-guided dialogue | Google Research ([Rastogi et al. 2020](#rastogi-2020)) | Services described by intents and required parameters, with transactional calls kept apart from search |
| Transactional task-oriented agent | Stanford ThingTalk ([Lam et al. 2022](#lam-2022)) | An executable representation for dialogues that call APIs |
| Intent-based assistant / transactional bot | Amazon Lex ([AWS](#aws-lex-bots)) | Matching the request to a supported intent |
| Flow-based assistant | Rasa CALM ([Rasa](#rasa-calm)), Dialogflow CX ([Google Cloud](#google-dialogflow-cx)) | The LLM interprets the conversation, and predefined flows control the logic, data collection and API calls |
| Skill-based assistant | SAP Joule | Skills with fixed inputs and outputs, kept apart from agents that plan |
| Process-aware conversational agent | BPM research ([Lins et al. 2022](#lins-2022)) | Executing formally modeled business processes |

The common shape, in the schema-guided form, is:

```text
supported task = intent + required parameters + executable operation
```


That is the frame again, with the database query generalized to an operation.

The [closed-set task assistant]({{< ref "ai/system-types/project-examples/cases/closed-set-task-assistant" >}}) case describes the LLM-era version of this design. The LLM interprets the request, collects missing information and chooses among the permitted tasks. A state machine, or a graph of constraints and dependencies, defines the permitted states, transitions, required inputs and operations. Application logic validates each step and runs an operation only when its conditions hold. The case calls the principle "flexibility within enforced boundaries": the LLM shapes how a task progresses, and the architecture decides what can execute. In pipeline terms, the LLM does NLU and often NLG, while the state machine holds the dialogue state and the policy. It is the flow-based row of the table.

Two distinctions from the same discussion matter for design:

- **Closed task space vs closed toolset.** Two assistants with the same permitted APIs can differ in task model. "Change this transaction's category" is a defined task with a known flow. "Help me reduce unnecessary spending" asks the system to decide how to combine operations. The first is a workflow and the second an agent, in Anthropic's terms. ([Anthropic 2024](#anthropic-2024-agents))
- **A fixed task catalog doesn't mean a fixed sequence of steps.** A system can support five tasks and still allow several paths through each.

Modern task-oriented research keeps the frame concepts while replacing modules with end-to-end models. It still studies dialogue state, structured ontologies, intent detection and slot labelling ([Chen et al. 2023](#chen-2023)), and back-end APIs and databases have always been part of the category ([Jurafsky & Martin 2026](#jurafsky-2026), K.1.3; [Rastogi et al. 2020](#rastogi-2020)). Where LLMs and agent loops fit into this structure is the subject of [LLMs as components]({{< ref "dialogue-systems/llms-as-components" >}}). Systems that split the work across several specialist modules under one manager are covered in [Modular dialogue architectures]({{< ref "dialogue-systems/modular-dialogue-architectures" >}}). How the pre-LLM intent -> entities -> slots -> policy decomposition moved into workflows and tool contracts is covered in [How LLMs change user-system interactions]({{< ref "dialogue-systems/llms-and-interactions" >}}).

## Related notes


- [Closed-set task assistant]({{< ref "ai/system-types/project-examples/cases/closed-set-task-assistant" >}}): the system-type case for the LLM-era form, summarized above
- [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}): frames, DST, Rasa and Lex against a concrete draft-based design
- [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}): why "dialogue system" can be accurate for the mechanism and still too narrow as a product category
- NLP task classification: slot filling next to entity linking and grounding for private entities

## Further reading


- [Elizabeth 2024](/sources/5064e7d6e718cfcdfd939b00b16a5cff.bin), *Conversational Agents for Task-Oriented Dialogue* -- a compact review of NLU, DST, dialogue management, NLG, benchmarks and metrics (ch. 1)
- [McTear & Ashurkina 2024](/sources/a617908d6c1a8f1e6b0ccde887023560.bin), *Transforming Conversational AI* ([doi:10.1007/979-8-8688-0110-5](https://doi.org/10.1007/979-8-8688-0110-5)) -- the traditional pipeline (ch. 2) and intent-based to hybrid platforms (ch. 7)
- [Freed et al. 2025](/sources/88911fed4ab5167e4282b4d9fb6729ff.bin), *Effective Conversational AI* -- improving intent understanding in production assistants
- [Wang et al. 2023](/sources/61e7f0e896e3ea9d49bd2db275eb5b77.bin), *A Survey of the Evolution of Language Model-Based Dialogue Systems* ([arXiv:2311.16789](https://arxiv.org/abs/2311.16789)) -- the development of task-oriented systems before and after pre-trained models (§3-4)

The classic works named in the prose (GUS, ELIZA, Grosz 1977, Larsson & Traum 2000, Williams & Young 2007, Young et al. 2010, Williams et al. 2016) are cited through Jurafsky & Martin's historical notes and aren't in the library.

## References


- Amazon Web Services. [Working with Amazon Lex V2 bots](https://docs.aws.amazon.com/lexv2/latest/dg/building-bots.html). Amazon Lex V2 Developer Guide. ^aws-lex-bots
- Anthropic (2024). [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents). ^anthropic-2024-agents
- Chen, Z., et al. (2023). [OPAL: Ontology-Aware Pretrained Language Model for End-to-End Task-Oriented Dialogue](https://aclanthology.org/2023.tacl-1.5/). TACL. [doi:10.1162/tacl_a_00534](https://doi.org/10.1162/tacl_a_00534). ^chen-2023
- Deriu, J., Rodrigo, A., Otegi, A., et al. (2021). [Survey on evaluation methods for dialogue systems](https://doi.org/10.1007/s10462-020-09866-x). Artificial Intelligence Review, 54, 755-810. [doi:10.1007/s10462-020-09866-x](https://doi.org/10.1007/s10462-020-09866-x). [PDF](/sources/74dc040cbadfee815ee111f1fb0fd20f.bin). ^deriu-2021
- Google Cloud. [Flow-based agent basics](https://docs.cloud.google.com/dialogflow/cx/docs/basics). Dialogflow CX documentation. ^google-dialogflow-cx
- Jurafsky, D., & Martin, J. H. (2026). [Frame-Based Dialogue Systems](https://web.stanford.edu/~jurafsky/slp3/K.pdf). Appendix K of *Speech and Language Processing*, 3rd edition draft. [PDF](/sources/15c773945807396b696ab2a8e25a9595.bin). ^jurafsky-2026
- Lam, M. S., Campagna, G., Moradshahi, M., Semnani, S. J., & Xu, S. (2022). [ThingTalk: An Extensible, Executable Representation Language for Task-Oriented Dialogues](https://arxiv.org/abs/2203.12751). [arXiv:2203.12751](https://arxiv.org/abs/2203.12751). ^lam-2022
- Lins, L., Melo, G., Oliveira, T., Alencar, P., & Cowan, D. (2022). [PACAs: Process-Aware Conversational Agents](https://doi.org/10.1007/978-3-030-94343-1_24). Business Process Management Workshops (BPM 2021). [doi:10.1007/978-3-030-94343-1_24](https://doi.org/10.1007/978-3-030-94343-1_24). ^lins-2022
- Qin, L., et al. (2023). [End-to-end Task-oriented Dialogue: A Survey of Tasks, Methods, and Future Directions](https://aclanthology.org/2023.emnlp-main.363/). EMNLP 2023. [doi:10.18653/v1/2023.emnlp-main.363](https://doi.org/10.18653/v1/2023.emnlp-main.363). ^qin-2023
- Rasa. [Rasa CALM | High-Trust Conversational AI Without Hallucinations](https://rasa.com/calm). ^rasa-calm
- Rastogi, A., Zang, X., Sunkara, S., Gupta, R., & Khaitan, P. (2020). [Towards Scalable Multi-Domain Conversational Agents: The Schema-Guided Dialogue Dataset](https://research.google/pubs/towards-scalable-multi-domain-conversational-agents-the-schema-guided-dialogue-dataset/). AAAI 2020. [doi:10.1609/aaai.v34i05.6394](https://doi.org/10.1609/aaai.v34i05.6394). ^rastogi-2020
- Walker, M. A., Litman, D. J., Kamm, C. A., & Abella, A. (1997). [PARADISE: A Framework for Evaluating Spoken Dialogue Agents](https://arxiv.org/abs/cmp-lg/9704004). ACL 1997. [arXiv:cmp-lg/9704004](https://arxiv.org/abs/cmp-lg/9704004). ^walker-1997
