---
draft: false
toc: true
title: "LLMs and Agents as Dialogue-System Components"
description: "Where an LLM or an agent loop sits in a dialogue system: the classical pipeline as reference architecture, the stages an LLM can take over, three integration patterns, and what the evidence says about control, state and multi-turn reliability."
weight: "20"
linkTitle: "LLMs as Components"
---

Part of [Dialogue Systems]({{< ref "dialogue-systems" >}}).

This note treats the LLM as a **component of a dialogue system**, not as a replacement for the idea. The question for any design is which jobs of the classical architecture the LLM takes over, which stay explicit, and what is lost or gained in each case.

## Reference architecture


The classical task-oriented system is a pipeline. ([Jurafsky & Martin 2026](#jurafsky-2026), K.0-K.1; [McTear & Ashurkina 2024](#mctear-2024), ch. 2)

```text
speech ─► ASR ─► NLU ─────────► DST ──────────► policy ─────────► NLG ─► TTS ─► speech
                 domain,        dialogue state:  next dialogue     surface
                 intent,        slots filled so  act (ask, inform, text
                 slots          far, user goal   confirm, book)
                                └───────── dialogue manager ─────┘
```


- **NLU** maps an utterance to a semantic frame: domain, intent and slot values.
- **Dialogue state tracking (DST)** keeps the current state of the frame across turns: which slots are filled, and what the user has asked for and corrected.
- **Dialogue policy** chooses the next system act, given the state.
- **NLG** realizes the act as a sentence.
- The **dialogue manager** is DST plus policy. McTear stresses that in the traditional approach both are modeled explicitly, while "in basic end-to-end systems, there is no explicit dialogue management component". ([McTear & Ashurkina 2024](#mctear-2024), ch. 3, p. 59)

Two more roles exist around the pipeline and matter for LLMs: the **back end** the system acts on (a database or API), and the **user simulator** used for training and evaluation.

## Where an LLM can sit


Each stage can be an LLM call, and so can the roles around the pipeline. Wang et al. list prompting work for most of them. ([Wang et al. 2023](#wang-2023), §5.1, Table 8)

| Component | What the LLM does | Examples in the sources |
| --- | --- | --- |
| NLU | Turns the utterance into a semantic frame, zero-shot | Pan et al., cited in [Wang et al. 2023](#wang-2023), §5.1.1 |
| DST | Produces belief states from dialogue history, prompted with slot descriptions or with slot names and example values | IT-LLM (Hudeček & Dušek 2023) and SGP-TOD, [Wang et al. 2023](#wang-2023), §5.2 |
| Policy | Picks the next act, guided by a "policy skeleton" in the prompt, or plans proactive moves such as clarification | SGP-TOD's Policy Prompter; ProCoT, [Wang et al. 2023](#wang-2023), §5.1.2 |
| NLG | Generates the reply from context and a prompt instead of a template | Voiceflow's Response AI, [McTear & Ashurkina 2024](#mctear-2024), ch. 7, pp. 151-152; the thesis's stand-alone NLG module, [Elizabeth 2024](#elizabeth-2024), §5.1 |
| Back-end access | Writes SQL or calls APIs as tools | ChatDB; AppBench, [Wang et al. 2023](#wang-2023), §5.2 |
| Memory | Stores and recalls information across long conversations, a long-term extension of dialogue state | MemoryBank, MemoChat, [Wang et al. 2023](#wang-2023), §5.2 |
| User simulator | Plays the user from a goal | Tried and dropped in [Elizabeth 2024](#elizabeth-2024), §3.2.2 |
| Evaluator | Scores dialogue quality | Dialogue-evaluation entries in Table 8 of [Wang et al. 2023](#wang-2023) |

Wang et al. group these into **internal reasoning** (reading the context: frames, states, the user's emotion, persona and intent), **external acting** (databases, memory, the web, user profiles) and the combination of the two. ([Wang et al. 2023](#wang-2023), §5, Fig. 3) In pipeline terms, internal reasoning covers NLU and DST, and external acting covers the back-end calls the policy decides on.

## Three integration patterns

### 1. Keep the pipeline, prompt each stage


The pipeline stays and each module becomes a prompted LLM. State and policy stay explicit, so you can still inspect them and swap modules. IT-LLM and SGP-TOD work this way. ([Wang et al. 2023](#wang-2023), §5.2) The thesis compares its own result with Hudeček and Dušek's, where "the LLM was prompted at each step in the ToD pipeline", and finds their GPT-3.5 success rate much higher. Its reading is that "the more fine-grained control we have, the better the system performs". It also notes that the comparison is not fully fair, because the other work was evaluated on delexicalised, static dialogues. ([Elizabeth 2024](#elizabeth-2024), §5.1)

### 2. Hybrid platform: intents for routing, LLM for language


Commercial platforms keep the intent and entity model and add generative features. McTear describes Voiceflow, which "kept traditional NLU components such as intents and entities". Replies there can be static text or generated by an LLM with a chosen provider, model, prompt and settings. ([McTear & Ashurkina 2024](#mctear-2024), ch. 7, pp. 150-152) The LLM mostly takes over NLG, and some NLU. The dialogue flow stays designed by hand.

### 3. One LLM as the whole system: agent loop with tools


A single model reads the context, decides what to do, calls tools and writes the reply. Here the agent loop is the dialogue manager:

- the reasoning step does the job of DST and policy
- a tool call is the system action
- the observation is the back-end result
- the dialogue state lives only in the context window, unless memory or a state object is added

Elizabeth 2024 applies ReAct this way on MultiWOZ, with tools standing in for the pipeline stages. ([Elizabeth 2024](#elizabeth-2024), §3.2, Fig. 3.1) Wang et al. describe the same direction as "conversational agents" that combine multi-turn conversation and tool use in one model. CoALM is their example. ([Wang et al. 2023](#wang-2023), §5.3)

## What the evidence says


**LLMs are strong on single stages, especially understanding and generation.** In Wang's comparison, GPT-4o zero-shot reaches a joint goal accuracy of 62.59 for DST on MultiWOZ 2.1, against 56.79 for the best traditional method listed, DSGFNet. ([Wang et al. 2023](#wang-2023), Table 7) The survey also notes that fine-tuned small models can beat larger prompted ones on particular tasks, for example AutoToD over GPT-3.5 on dialogue policy. ([Wang et al. 2023](#wang-2023), §4.3) The thesis found the LLM's NLG impressive. It also notes that overlap metrics such as BLEU undersell generated text, because the same idea can be said in many ways. ([Elizabeth 2024](#elizabeth-2024), §5.1)

**Agent loops lose control over the dialogue.** The ReAct system "does not meet the current benchmarks for ToD" (abstract) and falls short of handcrafted rules and trained policies. ([Elizabeth 2024](#elizabeth-2024), §5.1) The thesis's diagnosis maps onto the missing explicit components:

- **No explicit state:** "the LLM has trouble updating the states", so it retrieves wrong database results.
- **No policy for asking:** the LLM "does not ask the user enough clarifying questions, leading to hasty bookings".
- **No control over reasoning:** the reasoning traces seem to imitate the few-shot examples. This works for small goals and breaks down as goals grow, and failed understanding leads to repeated turns.

**Tool-calling skill and dialogue skill don't transfer automatically.** Wang's Table 9, copied from CoALM, shows models tuned for tool use (Hammer 2.0, ToolAce) scoring well on API-Bank but reaching only 23.5 and 18.0 task success on MultiWOZ 2.4. ([Wang et al. 2023](#wang-2023), Table 9) Traditional systems reach 44.4 and 68.3 there. A model trained for both, CoALM 70B, reaches 69.4 success, close to GPT-4o-mini's 69.9.

**Per-stage prompting vs one LLM: no single winner.** clem:todd runs the same model as a monolithic system and inside two modular systems on 117 MultiWOZ 2.2 booking tasks. ([Kranti et al. 2025](#kranti-2025)) GPT-4o does best modular with an LLM dialogue manager (booking accuracy 0.84, against 0.81 monolithic), because the modules force schema-correct outputs. Open-weight models do best monolithic (Llama-3.3-70B: 0.69, against 0.52), because their modules lose the full dialogue history. ([Kranti et al. 2025](#kranti-2025), Table 3) The details are in [Modular dialogue architectures]({{< ref "dialogue-systems/modular-dialogue-architectures" >}}#modular-vs-monolithic-llm-systems-clemtodd).

**Multi-turn conversation is where LLMs are weakest.** Laban et al. compare fully specified single-turn instructions with the same tasks revealed over several turns. They find an average drop of 39% across six tasks, mostly from a sharp rise in unreliability rather than a loss of ability. ([Laban et al. 2026](#laban-2026)) The models "make assumptions in early turns and prematurely attempt to generate final solutions", and once off track, they do not recover. Agent-style remedies help only partly. A final recap turn that restates all requirements, or a "snowball" in which the user repeats earlier requirements every turn, both improve on plain multi-turn performance but stay below single-turn levels. The realistic one, snowball, recovers 15-20% of the drop. Lowering the temperature does not help in multi-turn settings. A system-prompt hint that the user may underspecify and that the model can ask for clarification gave about +1%. ([Laban et al. 2026](#laban-2026), §6, Appendix G.1)

**The LLM is a poor stand-in for the user.** As a user simulator, the LLM never recognised that its goals were met. It kept repeating requests and sometimes switched roles and played the system. The thesis moved to ConvLab's agenda-based simulator. ([Elizabeth 2024](#elizabeth-2024), §3.2.2) Its explanation: "since LLMs are mostly trained to assist humans... they have a hard time sticking to the role of a user". ([Elizabeth 2024](#elizabeth-2024), §5.1)

## Reading: what the classical architecture still contributes


My synthesis from the sources above:

- **Explicit state** gives the system something to check and correct. Two failures above come from state held only implicitly in the context: the thesis's wrong database results, and Laban's early assumptions that stick. ([Elizabeth 2024](#elizabeth-2024); [Laban et al. 2026](#laban-2026))
- **An explicit policy** decides when to ask, confirm or act. Hasty bookings and premature final answers are both policy failures, not language failures.
- **Separate modules** make failures attributable. McTear names the trade-off: in a pipeline it can be hard to tell which module caused a failure, but each one can be fixed on its own, while "end-to-end systems avoid these problems but come with the drawback of limited designer control over their output". ([McTear & Ashurkina 2024](#mctear-2024), ch. 3, pp. 58-59)
- **Grounding checks** catch fluent invented entities. The thesis does not delexicalise. It checks that entities the system mentions exist in the database before counting a success. ([Elizabeth 2024](#elizabeth-2024), §5.1)

On this reading, the strongest designs give the LLM the stages where language variety is the problem (NLU, NLG, often DST) and keep state and the act-or-ask decision explicit. The [closed-set task assistant]({{< ref "ai/system-types/project-examples/cases/closed-set-task-assistant" >}}) is the simplest system type built this way. It has a fixed task catalog, an LLM that interprets requests and collects inputs, and a state machine or constraint graph that holds the state and decides what can execute. [The draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}) is one worked design of that kind: the draft is the dialogue state, and the [action policy]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}) is the policy.

## Open questions


- Is the gap between pattern 1 and pattern 3 a gap in model ability that training closes, as CoALM suggests, or a structural cost of holding state only in the context? ([Wang et al. 2023](#wang-2023), §5.3)
- Which state is worth making explicit: the full frame, or only the slots that gate an irreversible action?
- How do Laban's findings change with an explicit clarification policy in front of the model? A prompt hint to ask barely helped, which suggests the decision has to sit outside the model's free generation. ([Laban et al. 2026](#laban-2026), Appendix G.1)
- What replaces the user simulator now that LLM users fail at goal tracking: agenda-based simulators, LLM users with explicit goal state, or logged real conversations?

## Related notes


- [Mapping the draft model to dialogue frameworks]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping" >}}): frames, DST, Rasa and Lex against a concrete design
- [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}})
- [Clarification as draft repair]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/06-clarification-as-draft-repair" >}})
- Tool use and [Agents]({{< ref "ai-engineering/agents" >}}): the agent loop as a component
- ReAct clipping
- Multi-turn chat evals

## Further reading


- [Deng et al. 2025](/sources/cb5fbaeded17f92d01336acca9940c36.bin), *Proactive Conversational AI: A Comprehensive Survey of Advancements and Opportunities* -- its section on LLMs and proactivity bears on the policy questions
- [Deriu et al. 2021](/sources/74dc040cbadfee815ee111f1fb0fd20f.bin), *Survey on evaluation methods for dialogue systems* ([doi:10.1007/s10462-020-09866-x](https://doi.org/10.1007/s10462-020-09866-x)) -- task success and simulation-based evaluation before LLMs

## References


- Elizabeth, M. (2024). [Conversational Agents for Task-Oriented Dialogue](/sources/5064e7d6e718cfcdfd939b00b16a5cff.bin). Master thesis, Charles University, Prague. ^elizabeth-2024
- Jurafsky, D., & Martin, J. H. (2026). [Frame-Based Dialogue Systems](https://web.stanford.edu/~jurafsky/slp3/K.pdf). Appendix K of *Speech and Language Processing*, 3rd edition draft. [PDF](/sources/15c773945807396b696ab2a8e25a9595.bin). ^jurafsky-2026
- Kranti, C., Hakimov, S., & Schlangen, D. (2025). [clem:todd: A Framework for the Systematic Benchmarking of LLM-Based Task-Oriented Dialogue System Realisations](https://aclanthology.org/2025.sigdial-1.5/). SIGDIAL 2025. [doi:10.18653/v1/2025.sigdial-1.5](https://doi.org/10.18653/v1/2025.sigdial-1.5). [PDF](/sources/4258c9b1fb221e80233179f653165c0b.bin). ^kranti-2025
- Laban, P., Hayashi, H., Zhou, Y., & Neville, J. (2026). [LLMs Get Lost In Multi-Turn Conversation](https://arxiv.org/abs/2505.06120). ICLR 2026. [arXiv:2505.06120](https://arxiv.org/abs/2505.06120). [PDF](/sources/9623d6706180470e65b31b95d656c423.bin). ^laban-2026
- McTear, M., & Ashurkina, M. (2024). [Transforming Conversational AI: Exploring the Power of Large Language Models in Interactive Conversational Agents](https://doi.org/10.1007/979-8-8688-0110-5). Apress. [doi:10.1007/979-8-8688-0110-5](https://doi.org/10.1007/979-8-8688-0110-5). [PDF](/sources/a617908d6c1a8f1e6b0ccde887023560.bin). ^mctear-2024
- Wang, H., Wang, L., Du, Y., et al. (2023). [A Survey of the Evolution of Language Model-Based Dialogue Systems](https://arxiv.org/abs/2311.16789). [arXiv:2311.16789](https://arxiv.org/abs/2311.16789). [PDF](/sources/61e7f0e896e3ea9d49bd2db275eb5b77.bin). ^wang-2023
