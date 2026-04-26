---
draft: false
toc: true
title: "Llm Agents Know To"
linkTitle: "Llm Agents Know To"
---
# What to know


Here's how I'd think about it as "what do I need to _really_ know + read to do serious research on LLM-based agents?"

## 1. Mental model of an LLM agent


Before the reading list, have a clear decomposition:

- **Core LLM** - text in/out, plus function-calling / tool-calling.
- **Profile / goals** - what the agent is optimizing (task spec, constraints, persona).
- **Planning** - decomposition, multi-step reasoning, deciding next action.
- **Tools / environment** - APIs, file systems, browsers, code executors, etc.
- **Memory**
	- short-term (scratchpad per episode)
	- long-term episodic (logs)
	- semantic (vector store / RAG).
- **Learning / adaptation** - reflection, feedback, RL, fine-tuning, or prompt updates.
- **Evaluation / safety** - success metrics, guardrails, monitoring.

Most modern papers are variations on this template.

The best single resource that explicitly lays out this structure is:

- **"A Survey on Large Language Model based Autonomous Agents" (Wang et al.)** - unified framework of profile, memory, planning, and action modules, plus capability acquisition (fine-tuning vs prompting). ([arXiv](https://arxiv.org/abs/2308.11432 "A Survey on Large Language Model based Autonomous ..."))

And for multi-agent setups:

- **"Large Language Model Based Multi-Agents: A Survey of Progress and Challenges" (Guo et al., IJCAI 2024)** - how multi-agent systems are structured, settings, communication, and challenges. ([IJCAI](https://www.ijcai.org/proceedings/2024/890 "Large Language Model Based Multi-agents: A Survey of ..."))

Those two give a high-level map of the area.

## 2. Knowledge stack: what you should actually know


Given you're already a senior engineer, I'd prioritize these:

### 2.1 LLM & deep learning foundations


You don't need to be a theoretical ML person, but you should be comfortable with:

- **Transformers**: self-attention, positional encodings, decoder-only vs encoder-decoder.
- **Training regimes**: pretraining, instruction tuning, RLHF / preference optimization, tool-augmented training.
- **Context / prompting mechanics**: tokenization, context length, logprobs, temperature, nucleus sampling.

Good starting points:

- _Attention is All You Need_ (Vaswani et al.) - base transformer architecture.
- Any solid "LLM internals" tutorial / lecture series.

### 2.2 Sequential decision-making


LLM agents are basically "policies over actions that happen to be natural language". So:

- **Classical RL concepts**: MDPs, policies, value functions, exploration; not because you'll always do gradient-based RL, but to think clearly about agents, rewards, and environments.
- **Model-based planning / search** (MCTS, heuristic search) - useful analogies for planning with language.

Canonical book:

- _Reinforcement Learning: An Introduction_ - Sutton & Barto.

### 2.3 Classical agents & planning


Even though everyone says "LLMs changed everything", the old AI agent literature is still useful:

- Agent architectures (reactive vs deliberative, BDI).
- Goal / plan / action loops.
- Symbolic planning (STRIPS, HTN planning) - as conceptual tools, even if you don't implement them directly.

Reference:

- Selected chapters from _Artificial Intelligence: A Modern Approach_ (Russell & Norvig): the agent chapters and planning chapters.

### 2.4 Tool use, APIs, and software architecture


For LLM agents, "tools" = your environment / APIs. You should be comfortable with:

- Designing **tool interfaces** for LLMs: argument schemas, idempotent operations, clear pre/post-conditions.
- Observability: logging each thought/action/observation step, replaying trajectories, computing metrics.
- Isolation / sandboxing: especially for code-executing agents.

This is largely standard backend engineering, applied to the "LLM as policy" setting.

## 3. Core papers & ideas specific to LLM agents


If you read only a small number of agent papers, I'd pick these:

### 3.1 ReAct - reasoning + acting


- **ReAct: Synergizing Reasoning and Acting in Language Models** (Yao et al., ICLR 2023). ([arXiv](https://arxiv.org/abs/2210.03629 "ReAct: Synergizing Reasoning and Acting in Language Models"))

Key ideas:

- Interleave **chain-of-thought reasoning** with **tool / environment actions**.
- Allows the model to "think, act, observe, think again...".
- Demonstrated on QA (HotpotQA), fact verification (FEVER), and interactive benchmarks like ALFWorld and WebShop. ([arXiv](https://arxiv.org/abs/2210.03629 "ReAct: Synergizing Reasoning and Acting in Language Models"))

Code:

- Official ReAct GitHub repo: prompt templates, example environments. ([GitHub](https://github.com/ysymyth/ReAct "ysymyth/ReAct: [ICLR 2023] ReAct: Synergizing Reasoning ..."))

Methodologically, ReAct gives you a clean mental template for what an agent loop looks like.

### 3.2 Toolformer - learning when/how to call tools


- **Toolformer: Language Models Can Teach Themselves to Use Tools** (Schick et al.). ([arXiv](https://arxiv.org/abs/2302.04761 "Toolformer: Language Models Can Teach Themselves to Use Tools"))

Key ideas:

- Synthetic labeling: the model generates candidate tool calls in text, APIs are executed, and the model is fine-tuned to retain calls that improve next-token prediction.
- Shows that a model can learn tool-selection and argument-filling from weak supervision across calculators, search engines, and other APIs. ([arXiv](https://arxiv.org/abs/2302.04761 "Toolformer: Language Models Can Teach Themselves to Use Tools"))

You don't have to reproduce Toolformer, but it's the canonical "how to make tool-use a first-class training signal" paper.

### 3.3 Reflexion - agents that learn via self-critique


- **Reflexion: Language Agents with Verbal Reinforcement Learning** (Shinn et al., NeurIPS 2023). ([arXiv](https://arxiv.org/abs/2303.11366 "Reflexion: Language Agents with Verbal Reinforcement Learning"))

Key ideas:

- After a trajectory, the agent generates **verbal feedback** about what went wrong/right.
- That feedback is stored in memory and conditioned on in subsequent attempts, improving performance without changing model weights. ([arXiv](https://arxiv.org/abs/2303.11366 "Reflexion: Language Agents with Verbal Reinforcement Learning"))
- Strong gains on coding and decision-making benchmarks (e.g., HumanEval). ([OpenReview](https://openreview.net/pdf?id=vAElhFcKW6 "Language Agents with Verbal Reinforcement Learning"))

Code:

- Official Reflexion repo with examples and logs. ([GitHub](https://github.com/noahshinn/reflexion "[NeurIPS 2023] Reflexion: Language Agents with Verbal ..."))

Reflexion is essentially "few-shot RL for LLMs via language feedback".

### 3.4 Surveys + repos


- **LLM Agent Survey GitHub** - curated list of papers, classifications, and implementations; useful to discover more specific work. ([GitHub](https://github.com/Paitesanshi/LLM-Agent-Survey "Paitesanshi/LLM-Agent-Survey"))

Between ReAct, Toolformer, Reflexion, and the surveys, you have the main conceptual levers: stepwise acting, tool learning, and self-improvement.

## 4. How to _work_ on LLM agents (methodology)


Here's a practical cycle you can follow as a researcher/engineer.

### 4.1 Define a concrete environment and metrics


Avoid "general assistant" as a first research target. Instead:

- Pick a narrow domain with clear APIs and ground truth:
    examples: file-management CLI, internal docs Q&A + ticketing, a browser-only environment, a coding sandbox.
- Define **task distribution** (what inputs look like).
- Define **metrics**: success rate, time-to-success, number of actions, tool-error rate, hallucination rate.

Use ideas from the surveys for how others define and evaluate agent tasks. ([arXiv](https://arxiv.org/pdf/2308.11432 "A Survey on Large Language Model based Autonomous ..."))

### 4.2 Implement the minimal viable agent


Start with a simple agent loop:

1. Take current state (goal + history).
2. Ask LLM: "Given the tools you have, what's your next action or final answer?"
3. Execute action (if any), append observation.
4. Repeat until done / budget exceeded.

Do this with:

- **No long-term memory** initially.
- A small, explicit tool set (2-5 tools).
- Strict action budget per episode.

This is basically a simplified ReAct-style agent.

### 4.3 Add structure incrementally


Once the baseline is stable, layer in:

1. **Better planning**
	- Explicit "plan then act" prompts, or a planner step that sketches a plan which the agent then follows.
2. **Memory**
	- Episodic logs per task.
	- Vector store for cross-episode recall (e.g. "what worked previously for similar tickets?").
3. **Reflection / self-correction**
	- After each failure or near-miss, have the agent produce a short diagnosis and store it; condition on those reflections in later attempts (Reflexion-style).
4. **Tool-selection learning**
	- Start with static tools and hand-crafted descriptions.
	- If you want to push on research: explore synthetic training like Toolformer or preference-based tuning for tool use.

At each step, re-run your evaluation suite to see which change actually helps.

### 4.4 Evaluation & ablations


Serious research isn't just "we built a cool agent"; it's:

- **Comparisons to baselines**:
	- Non-agentic single LLM call.
	- ReAct-like reasoning+acting.
	- Variants without memory, without reflection, etc.
- **Ablations**:
	- Remove tools, memory, reflection individually.
	- Change context length, number of tool calls allowed, etc.
- **Robustness checks**:
	- Noisy inputs, adversarial instructions, ambiguous tasks.
- **Cost/latency analysis**:
	- Tokens per episode, wall-clock latency, API failures.

Surveys emphasize that systematic evaluation of agents is still an open problem; framing your work as contributing a better evaluation protocol is itself publishable. ([arXiv](https://arxiv.org/pdf/2308.11432 "A Survey on Large Language Model based Autonomous ..."))

## 5. Concrete reading list (ordered)


If you want a focused path:

### Stage 1 - Overview


1. **A Survey on LLM-based Autonomous Agents** (Wang et al.). ([arXiv](https://arxiv.org/abs/2308.11432 "A Survey on Large Language Model based Autonomous ..."))
2. **Large Language Model Based Multi-Agents: A Survey of Progress and Challenges** (Guo et al.). ([IJCAI](https://www.ijcai.org/proceedings/2024/890 "Large Language Model Based Multi-agents: A Survey of ..."))

Goal: get the taxonomy of architectures, capabilities, and evaluation.

### Stage 2 - Core mechanisms


1. **ReAct** paper + GitHub. ([arXiv](https://arxiv.org/abs/2210.03629 "ReAct: Synergizing Reasoning and Acting in Language Models"))
2. **Toolformer** paper. ([arXiv](https://arxiv.org/abs/2302.04761 "Toolformer: Language Models Can Teach Themselves to Use Tools"))
3. **Reflexion** paper + repo. ([arXiv](https://arxiv.org/abs/2303.11366 "Reflexion: Language Agents with Verbal Reinforcement Learning"))

Goal: understand reasoning+acting loops, tool-use learning, and verbal reinforcement.

### Stage 3 - Background theory (skim as needed)


1. Relevant chapters from **Sutton & Barto** (RL).
2. Agent & planning chapters from **Russell & Norvig**.
3. Original **Transformer** paper ("Attention is All You Need").

### Stage 4 - Implementation references


1. LLM-agent survey and curated repos (Paitesanshi/LLM-Agent-Survey). ([GitHub](https://github.com/Paitesanshi/LLM-Agent-Survey "Paitesanshi/LLM-Agent-Survey"))
2. A couple of open-source frameworks (LangChain, LlamaIndex, AutoGen, CrewAI, etc.) just to see how people structure real systems.

## 6. If you want a concrete "first project"


One simple, researchable starter project:
> **"How does reflection + memory affect reliability of a tool-using agent in a constrained environment?"**
Sketch:

- Environment: a small file system + shell-like tools (list, read, write, move).
- Tasks: scripted file organization and report-generation tasks with ground truth.
- Agents:
	1. Single-call LLM baseline.
	2. ReAct-style agent.
	3. ReAct + episodic memory.
	4. ReAct + memory + Reflexion-style self-critique.

Measure success rate, steps, token cost, and how often the agent gets into loops or destructive actions.

That is small enough to build, but touches almost all the conceptual pieces above.

If you tell me which parts of this stack you already feel solid on (LLMs vs RL vs planning vs infra), I can turn this into a more tailored "study + build" plan.

# Changes

### 2.2. In-context learning as the default programming modality


In classic ML:

- Changing behavior meant retraining or at least fine-tuning.
- Inference time was just "feed x, get y".

With LLMs, a lot of "learning" happens at inference time via:

- prompts,
- instructions,
- examples,
- tool descriptions,
- previous turns in a conversation.

This is weird from the classical perspective: the same frozen weights can simulate learning algorithms inside the forward pass. You don't retrain; you just change the text you feed it.

That's not a new algorithmic foundation, but it _is_ a new _interface to the model_ that makes some things cheap that used to be expensive (and vice versa).

# Changes from GPT


You're right on one important point: the _core_ mathematical/algorithmic foundation hasn't radically changed. It's still gradient descent on big neural nets. Transformers, cross-entropy, RL variants, etc.

Where things _did_ change is more like "what is now practical and standard" rather than "new clean theory." I'd separate this into:

1. What people _claim_ ("LLMs changed everything").
2. What LLMs actually do today (including why they feel like they can't really reason).
3. What genuinely new foundations they give us at the _systems_ / _engineering_ level.

## 1. About "LLMs cannot even reason"


If by "reason" you mean:

- reliably apply algorithms (like a human doing long division),
- generalize compositionally to new structures,
- stay consistent over long chains of inference,
- reflect and debug their own mistakes,

then yes: current LLMs are brittle. They:

- break on slightly rephrased problems;
- get stuck in loops;
- hallucinate intermediate steps;
- fail at small but adversarial arithmetic / logic.

So at the _agent level_ we're still missing:

- robust symbolic manipulation,
- explicit state representations,
- principled long-horizon planning.

You can think of current models as:
> very strong "next-token world simulators" whose internal representations sometimes support what looks like reasoning, but only in a fragile, non-guaranteed way.
That's a huge capability jump versus earlier models, but it's not a solved-reasoning machine.

So your skepticism is fair: we haven't suddenly invented a fundamentally new reasoning algorithm.

## 2. What actually changed at the model level


Even without new math tricks, a few things are qualitatively different compared to pre-LLM deep learning.

### 2.1. A single model that approximates "general text competence"


Before LLMs, we had:

- task-specific models (MT, summarization, QA, classification),
- each trained on its own dataset,
- with its own bespoke architecture.

Now we have:

- one large, pre-trained model,
- trained on broad, heterogeneous data,
- which can be steered to do many tasks _in-context_ with little or no gradient updates.

That shift from "many small models" to "one foundation model + lightweight adaptation" is new in practice, even if it's not new in principle.

### 2.2. In-context learning as the default programming modality


In classic ML:

- Changing behavior meant retraining or at least fine-tuning.
- Inference time was just "feed x, get y".

With LLMs, a lot of "learning" happens at inference time via:

- prompts,
- instructions,
- examples,
- tool descriptions,
- previous turns in a conversation.

This is weird from the classical perspective: the same frozen weights can simulate learning algorithms inside the forward pass. You don't retrain; you just change the text you feed it.

That's not a new algorithmic foundation, but it _is_ a new _interface to the model_ that makes some things cheap that used to be expensive (and vice versa).

## 3. What changed for _systems_ and _agents_


This is where, in my view, the "changed everything" claim is closer to reality -- not because LLMs are fundamentally new kinds of minds, but because they are a new kind of **component**.

### 3.1. Language as a universal interface layer


We now have a component that can:

- parse messy natural language -> structured intent,
- generate code / queries / tool calls,
- summarize and transform arbitrary text,
- fill in missing glue between APIs.

This means you can build systems where:

- humans talk in natural language,
- LLM translates that into actions over tools, data stores, and other agents,
- everything else is classical software.

We always wanted that layer; now we actually have a fairly good approximation. That's "foundational" at the _software architecture_ level.

### 3.2. The LLM as a generic "controller" or "policy"


When you build an LLM-based agent, you are effectively saying:
> I'll outsource action-selection to a big pretrained model, and I'll focus my engineering on tools, constraints, memory, and evaluation.
Instead of designing a symbolic planner or learning a policy via RL from scratch, you:

- describe tools in natural language,
- define a loop (observe -> think -> act),
- have the LLM decide next actions.

That's not a new theory of control or RL, but it changes the **default** way we build intelligent-ish behavior. Traditional planning/RL is becoming a special case; the LLM-as-controller is becoming the default.

### 3.3. Cheap "cognitive scaffolding"


Because LLMs are good enough at a lot of subskills (parsing, paraphrasing, drafting plans, writing code snippets), you can cheaply stack:

- reflection prompts,
- verification passes,
- multi-agent debate,
- external tools (solvers, search, code execution),

and get systems that collectively reason better than the raw model.

Crucially: you can iterate on these system designs without retraining the model. That's a _methodological_ foundation: research shifts from "design loss functions and architectures" to "design scaffolds around a capable but flawed black box".

## 4. Where we _didn't_ move the foundations much


I think this part matches your intuition.

We still don't have satisfying answers to foundational questions:

- **What is the model actually representing?**
    We have probing, circuits-style analysis, etc., but not a clean, widely accepted theory.
- **How do we guarantee reasoning properties?**
    No robust way to ensure logical consistency, absence of hallucinations, or safe action sequences, beyond empirical testing, heuristics, and external verifiers.
- **How do we get systematic generalization and long-horizon planning?**
    Still an open research area. Agents frequently fail on long, compositional tasks without heavy scaffolding.

So at the level of "theory of intelligence / reasoning", we're still using:

- gradient descent,
- approximate Bayesian intuitions,
- information theory,
- RL,
- classical planning ideas,

with some new empirical observations (scaling laws, emergent behaviors), but no clean new framework that replaces them.

## 5. So what foundational changes _did_ we get?


If we phrase "foundational" less as "new math" and more as "new base layer for building systems", I'd summarize it like this:

1. **Foundation-model paradigm**
	- Single large pre-trained model reused for many tasks.
	- Task-specific training becomes adaptation / prompting instead of training from scratch.
2. **Language-as-API**
	- Text becomes a uniform interface between humans, models, and tools.
	- "Prompt engineering" is essentially a new (if messy) programming layer.
3. **In-context learning / program synthesis**
	- You can specify behavior examples at inference time and get approximate task-solvers without weight updates.
	- This makes "ad hoc tasks" and "long tail use cases" economically reachable.
4. **LLM-as-controller architectures**
	- We treat the model as a generic policy that calls tools, does planning, and coordinates other components.
	- Agent research is largely about the _wrapper_ (tools, memory, verification, evaluation) rather than the policy-learning procedure.
5. **Scaling as a default assumption**
	- The field now treats "just scale it and see what emerges" as a serious baseline.
	- That changes how we evaluate new algorithmic ideas (they must compete with scaled baselines).

You could say:

- The _epistemic_ foundations (what is reasoning, how to represent knowledge) have not been fully rebuilt.
- The _engineering_ foundations (how we build intelligent systems in practice) have shifted a lot toward "one big prior + scaffolding."

## 6. What this means for someone thinking about agents


Given your skepticism, a reasonable stance is:

- Treat the LLM as a **powerful but dumb prior** over text/world states.
- Assume it cannot be trusted to reason reliably on its own.
- Use tools, explicit state, external verifiers, and environment design to "force" it into more reliable behavior.

And as a researcher, interesting questions are precisely in the gap you're pointing at:

- How to turn this statistical sequence model into something that _can_ support dependable reasoning and planning?
- What additional structure (state representations, tools, training signals) is actually necessary?

If you want, we can sketch a few concrete research questions framed exactly in that "we haven't moved the reasoning foundations yet; let's use LLMs as the substrate and push there" mindset.
