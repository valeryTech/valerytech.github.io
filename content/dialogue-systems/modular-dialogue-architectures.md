---
draft: false
toc: true
title: "Modular Dialogue Architectures: Routing, Arbitration and Fusion"
description: "Dialogue systems built from specialist modules under a central manager: the Alexa Prize response-generator-and-ranker design, its LLM-era continuations, three ways to combine modules, and the evidence comparing modular and monolithic LLM systems."
weight: "30"
linkTitle: "Modular Architectures"
---

Part of [Dialogue systems]({{< ref "dialogue-systems" >}}).

A **modular dialogue system** has a central dialogue manager that coordinates several specialist modules: response generators, sub-dialogue systems or agents. The alternative is a **monolithic** system in which one model handles everything. This note follows the modular design from the Alexa Prize socialbots to LLM systems, and collects the evidence on when it pays off. The frame-based pipeline it builds on is in [Frame-based dialogue]({{< ref "dialogue-systems/frame-based-dialogue" >}}). The question of where an LLM goes inside it is in [LLMs as components]({{< ref "dialogue-systems/llms-as-components" >}}).

**Provenance.** The starting point was a ChatGPT research conversation, Research continuation (2026-11-11). Claims marked *checked* were verified against the papers. The rest come from that conversation and are marked *unchecked*.

## The Alexa Prize design: many generators, one selector


In the fourth Alexa Prize SocialBot Grand Challenge (2020-21), "most teams have continued to use the overall socialbot framework of NLU, dialog manager, response generators, and ranking multiple candidate responses in order to select the bot's response". ([Hu et al. 2021](#hu-2021), §3.1; *checked*)

```text
user utterance → NLU → dialogue manager → response generators (several, in parallel)
                                         → candidate responses → ranker / selector → reply
```


- **Response generators** mix templates, rules, retrieval and neural models. Teams added neural generators (DialoGPT, GPT-2 or BlenderBot variants) mainly for the long tail: out-of-domain utterances that their other generators didn't cover. ([Hu et al. 2021](#hu-2021), §3.1.4)
- **Response selection** was each team's own job, because Amazon's CoBot toolkit didn't provide one. ([Hu et al. 2021](#hu-2021), §3.1.5)
  - Athena: a BERT-based ranker trained on Alexa Prize data
  - DREAM: rule-based selection
  - Chirpy Cardinal, Genuine, Alquist and Proto: DialogRPT
  - Viola and Proto: a poly-encoder. Viola's fine-tuned poly-encoder beat CoBot's evaluator.
- **Symbolic understanding** was tried as well. Emora parsed utterances into predicate-argument logical forms and grew a knowledge graph of the conversation turn by turn. Being hand-crafted, it was precise where it had coverage but "lacks robustness". ([Hu et al. 2021](#hu-2021), §3.1.1)

This is open-domain chat, but the structure carries over to closed task sets. A booking assistant can have generators for the booking flow, clarification, knowledge questions, corrections and recovery, with a policy choosing among their proposals.

## LLM-era continuations


All *unchecked*, from the conversation:

- **Alquist 5.0** (Czech Technical University, 2023) keeps its dialogue trees and topic selector and adds a neural generator (Barista). It describes four ways to mix authored and generated dialogue, including LLM turns inserted into the trees. ([Kobza et al. 2023](#kobza-2023))
- **Chirpy Cardinal, Dialogue Distillery** (Stanford, 2023) uses an LLM to *generate* structured conversation graphs. CAMEL is the graph language, Goldfinch generates nodes, and Kingfisher precomputes replies to likely next user turns. ([Chi et al. 2023](#chi-2023))
- **Athena 3.0** (UC Santa Cruz, 2023) and **HOKIEBOT** (Virginia Tech, 2023) combine LLM generators with existing strategies, rankers and long-term user state. ([Fan et al. 2023](#fan-2023); [Shen et al. 2023](#shen-2023))
- **Information State Update + Harel statecharts + LLMs** is classical dialogue management with the LLM inside, kept for control. ([Maraev et al. 2025](#maraev-2025))
- **Rasa CALM**: the LLM turns messages into commands, and predefined flows execute the business logic (see [Frame-based dialogue]({{< ref "dialogue-systems/frame-based-dialogue" >}}#closed-task-sets-after-the-classical-pipeline)). ([Rasa](#rasa-calm))

## Three ways to combine modules


| Approach | How it works | Main research problem |
| --- | --- | --- |
| **Early routing** (module selection) | Pick one module before anything is generated | Selection accuracy, given the dialogue context |
| **Late arbitration** | Several modules propose responses or actions, and an arbiter picks one | Ranking candidates, keeping them consistent |
| **Fusion** | Combine responses, actions or dialogue flows | Keeping state coherent and transitions valid |

The Alexa Prize ranker designs are late arbitration. The conversation notes that most recent module-selection research studies early routing, so it doesn't test the Chirpy-style design (*unchecked*). The taxonomy itself is the conversation's framing, not a standard one.

A design rule that follows for task systems: **generators propose, the policy disposes**. Any module may propose an action, but only a validated policy decides what executes. This is the same split as in the [action policy and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}) of the draft pipeline.

## Evidence

### Modular vs monolithic LLM systems: clem:todd


clem:todd runs three architectures in one evaluation framework, with the same model inside each. ([Kranti et al. 2025](#kranti-2025); *checked*)

- **Monolithic**: one LLM does everything.
- **Modular-Prog**: a programmed dialogue manager calls LLM-powered modules for intent detection, slot extraction, the dialogue manager's sub-steps and generation.
- **Modular-LLM**: the same modules under an LLM dialogue manager.

The tasks are 117 booking tasks from MultiWOZ 2.2. The paper also re-evaluates two earlier systems, Xu et al. 2024 and Hudeček & Dušek 2023. ([Kranti et al. 2025](#kranti-2025)) Booking accuracy ([Kranti et al. 2025](#kranti-2025), Table 3):

| Model | Monolithic | Modular-Prog | Modular-LLM |
| --- | --- | --- | --- |
| GPT-4o | 0.81 | 0.65 | 0.84 |
| Qwen2.5-32B | 0.71 | 0.41 | 0.68 |
| Llama-3.3-70B | 0.69 | 0.43 | 0.52 |
| Llama-3.2-3B | 0.05 | 0.00 | 0.02 |

There is no single winner, and the authors' explanations point in two directions:

- **Modular helps GPT-4o.** Most of its monolithic failures are wrong output formats on train-domain constraints ("leave after", "arrive by"), which then cause database failures. The modular decomposition "helps the model reliably follow schema-specific outputs".
- **Monolithic helps open-weight models.** Their modules "operate without access to the full dialogue history", which hurts their ability to satisfy goal constraints. As monolithic systems they reach up to 0.95 booking accuracy on single-domain dialogues (Qwen2.5-32B) and drop on multi-domain ones.
- **Small models fail at the format.** Most conversations are aborted early because the model doesn't follow the expected response format.

The paper also reports token and FLOP cost per dialogue (Table 4) and latency (Table 5). The Modular-Prog configuration with GPT-4o is by far the most expensive in tokens. ([Kranti et al. 2025](#kranti-2025))

For [LLMs as components]({{< ref "dialogue-systems/llms-as-components" >}}#three-integration-patterns) this means the per-stage pattern can help, but mainly when it constrains output formats. It can also hurt, when splitting the work cuts modules off from the dialogue history.

### Routing between modules


- **Context matters for module selection** (*checked*). Nehring, Berk and Hillmann build a modular system from MultiWOZ 2.2, with one module per domain. ([Nehring et al. 2023b](#nehring-2023b)) Selecting the module from the current utterance alone gives 92.6% micro-F1. Adding the last four turns gives 99.1%. ([Nehring et al. 2023b](#nehring-2023b), Table 1) The paper motivates this by noting that distributing a system across several dialogue systems "often results in a decreased performance", citing the IWSDS paper below. ([Nehring et al. 2023b](#nehring-2023b); [Nehring et al. 2023a](#nehring-2023a))
- **Modularization costs accuracy** (*checked*). *Module Selection: A New Task for Dialog Systems* combines Rasa, Dialogflow and IBM Watson Assistant agents under a central selector. ([Nehring et al. 2023a](#nehring-2023a)) Intent-detection F1 falls by 2.98% to 17.34% against a non-modular system, depending on the models used. The authors trace the large drops to IBM Watson Assistant, which fails on a few subsets. With the two strong modules alone, the drop is 2.98% to 6.79%. ([Nehring et al. 2023a](#nehring-2023a), §6.3, Table 3)
- **Accurate routing isn't enough** (*unchecked*). A 2026 *Scientific Reports* study of a swarm-style orchestrator over specialist agents with shared state reports that a system can route accurately and still fail to update slots or maintain state. ([Khan et al. 2026](#khan-2026))

### Evaluating dialogue flows


These matter when flows are generated by an LLM, as in Dialogue Distillery, or merged from several sources (*unchecked*):

- FuDGE (2024 preprint) scores a dialogue graph by how well it covers observed conversations and how complex it is. ([Mirtaheri et al. 2024](#mirtaheri-2024))
- TD-EVAL (SIGDIAL 2025) adds turn-level checks of state consistency and policy compliance. ([Acikgoz et al. 2025](#acikgoz-2025))

## Open questions


- No study in hand compares early routing, late arbitration and fusion with the same LLMs, tasks and conditions. The conversation proposes comparing:
  1. a single LLM with tools
  2. an LLM with an explicit state machine
  3. several generators with shared state and a late arbiter
  4. the same with an LLM arbiter

  The comparison would measure task success, recovery from interruptions, slot preservation, policy violations, latency and cost. clem:todd's framework is a ready harness for it. ([Kranti et al. 2025](#kranti-2025))
- Does late arbitration beat early routing when users change goals mid-conversation? Example: "Book a flight to London. Actually, make it Paris, and what's the baggage policy?"
- clem:todd's open-weight results suggest the cost of modularity is lost context. Would modules that share the full dialogue state close that gap? ([Kranti et al. 2025](#kranti-2025))

## Further reading


- [Elizabeth 2024](/sources/5064e7d6e718cfcdfd939b00b16a5cff.bin), *Conversational Agents for Task-Oriented Dialogue* -- discusses the per-stage prompting of Hudeček & Dušek 2023, which clem:todd re-evaluates
- [Wang et al. 2023](/sources/61e7f0e896e3ea9d49bd2db275eb5b77.bin), *A Survey of the Evolution of Language Model-Based Dialogue Systems* ([arXiv:2311.16789](https://arxiv.org/abs/2311.16789)) -- the fusion of task-oriented and open-domain systems (§4.2), background to the LLM-era continuations

## References


- Acikgoz, E. C., et al. (2025). [TD-EVAL: Revisiting Task-Oriented Dialogue Evaluation by Combining Turn-Level Precision with Dialogue-Level Comparisons](https://aclanthology.org/2025.sigdial-1.7/). SIGDIAL 2025. [doi:10.18653/v1/2025.sigdial-1.7](https://doi.org/10.18653/v1/2025.sigdial-1.7). [PDF](/sources/36deb3a3d75bd5f1275c420ae1658b5f.bin). ^acikgoz-2025
- Chi, R. A., et al. (2023). [Dialogue Distillery: Crafting Interpolable, Interpretable, and Introspectable Dialogue from LLMs](https://www.amazon.science/alexa-prize/proceedings/chirpy-cardinal-dialogue-distillery-crafting-interpolable-interpretable-and-introspectable-dialogue-from-llms). Alexa Prize SocialBot Grand Challenge 5 proceedings. [PDF](/sources/93681365167e7dfca5c849fe10747554.bin). ^chi-2023
- Fan, Y., et al. (2023). [Athena 3.0: Personalized Multimodal ChatBot with Neuro-Symbolic Dialogue Generators](https://www.amazon.science/alexa-prize/proceedings/athena-3-0-personalized-multimodal-chatbot-with-neuro-symbolic-dialogue-generators). Alexa Prize SocialBot Grand Challenge 5 proceedings. [PDF](/sources/976f5d5cc07a5663484101198270a061.bin). ^fan-2023
- Hu, S., Liu, Y., Gottardi, A., et al. (2021). [Further Advances in Open Domain Dialog Systems in the Fourth Alexa Prize Socialbot Grand Challenge](https://www.amazon.science/publications/further-advances-in-open-domain-dialog-systems-in-the-fourth-alexa-prize-socialbot-grand-challenge). Alexa Prize SocialBot Grand Challenge 4 proceedings. [PDF](/sources/076d3f32c5216a9069b6a40da242745f.bin). ^hu-2021
- Khan, A., et al. (2026). [Evaluating routing stability and coordination in swarm-based multi-agent task-oriented dialogue systems](https://www.nature.com/articles/s41598-026-42158-y). Scientific Reports. [doi:10.1038/s41598-026-42158-y](https://doi.org/10.1038/s41598-026-42158-y). [PDF](/sources/43e30a11daaf5beadc7354ba46df5706.bin). ^khan-2026
- Kobza, O., et al. (2023). [Alquist 5.0: Dialogue Trees Meet Generative Models. A Novel Approach for Enhancing SocialBot Conversations](https://arxiv.org/abs/2310.16119). Alexa Prize SocialBot Grand Challenge 5. [arXiv:2310.16119](https://arxiv.org/abs/2310.16119). [PDF](/sources/1ad50f42fda42f9ff3439bf38fe7d2e5.bin). ^kobza-2023
- Kranti, C., Hakimov, S., & Schlangen, D. (2025). [clem:todd: A Framework for the Systematic Benchmarking of LLM-Based Task-Oriented Dialogue System Realisations](https://aclanthology.org/2025.sigdial-1.5/). SIGDIAL 2025. [doi:10.18653/v1/2025.sigdial-1.5](https://doi.org/10.18653/v1/2025.sigdial-1.5). [PDF](/sources/4258c9b1fb221e80233179f653165c0b.bin). ^kranti-2025
- Maraev, V., Berman, A., & Larsson, S. (2025). [Combining Information State Update, Harel Statecharts and LLMs for controllable and flexible Conversational AI](https://aclanthology.org/2025.clasp-main.3/). CLASP 2025. [PDF](/sources/1cdfa0e5cda35c1356227dbdb423a548.bin). ^maraev-2025
- Mirtaheri, M., Varghese, N., Khatri, C., & Kelkar, A. (2024). [Towards Automatic Evaluation of Task-Oriented Dialogue Flows](https://arxiv.org/abs/2411.10416). Preprint. [arXiv:2411.10416](https://arxiv.org/abs/2411.10416). [PDF](/sources/97cb918fc0bb1191da59e5ffdf0c1f67.bin). ^mirtaheri-2024
- Nehring, J., Ahmed, A., & Jäger, L. A. (2023a). [Module Selection: A New Task for Dialog Systems](https://www.dfki.de/en/web/research/projects-and-publications/publication/13137). IWSDS 2023. [PDF](/sources/b3ad308a014e291499f5cc893072f6b0.bin). ^nehring-2023a
- Nehring, J., Berk, R. M., & Hillmann, S. (2023b). [Context Aware Module Selection in Modular Dialog Systems](https://aclanthology.org/2023.ranlp-1.85/). RANLP 2023. [PDF](/sources/749ff6eb4278d1ed57a990907c4ef08f.bin). ^nehring-2023b
- Rasa. [Rasa CALM | High-Trust Conversational AI Without Hallucinations](https://rasa.com/calm). ^rasa-calm
- Shen, Y., et al. (2023). [HOKIEBOT: Towards Personalized Open-domain Chatbot with Long-term Dialogue Management and Customizable Automatic Evaluation](https://www.amazon.science/alexa-prize/proceedings/hokiebot-towards-personalized-open-domain-chatbot-with-long-term-dialogue-management-and-customizable-automatic-evaluation). Alexa Prize SocialBot Grand Challenge 5 proceedings. [PDF](/sources/62c4b0aeed660146f415d3a980701dbe.bin). ^shen-2023
