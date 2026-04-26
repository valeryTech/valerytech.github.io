---
draft: false
toc: true
title: "Llm Dialogues Adapt"
linkTitle: "Llm Dialogues Adapt"
---
[Llm Adapt]({{< ref "ai-engineering/agents/var/llm-adapt" >}}#perplexity)

# Critique Dialog One (gpt)


Let's imagine them sitting with this doc in front of them and going through it line by line.

### 1. First reaction: what _is_ being adapted?


**Norvig:** My first reaction: this text is mostly about _model adaptation_ -- instruction tuning, LoRA, RL from feedback -- but it keeps using the word "agent" as if adapting the LM is the same as engineering an agent.

You really want to separate at least three layers:

1. The **base model** (LM / SLM)
2. The **scaffolding / architecture** (tools, memory, planners, policies)
3. The **deployed agent** (in a particular environment with particular objectives)

This write-up mixes those. "Fine-Tuning LLM Agents" is actually "fine-tuning LLMs used _inside_ agents." They're different problems with different failure modes.

### 2. Russell: where are objectives, uncertainty, and safety?


**Russell:** The phrase "Instruction Tuning for Agentic Behavior" is already a bit misleading. Instruction tuning makes the model _more compliant_ with text instructions. That is not the same thing as making it a good agent.

Missing pieces I'd want explicitly:

- What **objective** is the adapted model supposed to optimize, beyond "look like the reference outputs"?
- How do you deal with **uncertainty** -- state uncertainty, model uncertainty, and uncertainty about human preferences?
- How do you prevent catastrophic behavior when the agent is off-distribution, or when the "instruction" conflicts with safety constraints?

This material treats "follows instructions + uses JSON + passes benchmarks" as equivalent to "good agentic behavior." From an agent perspective, that's just surface behavior; the hard problems live in mis-specified objectives, open environments, and rare failures.

The sections on "self-improving agents" and "compliance-aware agents" are particularly optimistic. Tuning on failure logs is fine, but:

- What's the guarantee that you're not just overfitting to yesterday's failures?
- How do you ensure new regulations don't invalidate old data?
- How do you bound the probability of a serious violation after adaptation?

Those are central questions if you're going to claim "compliance-aware agents."

### 3. LeCun: this is all LM-centric, where are world models and planners?


**LeCun:** Everything here assumes that the _language model_ is the main thing to adapt. That's understandable given the hype, but it's architecturally short-sighted.

If you really care about agents, you want:

- A **world model** that predicts consequences of actions
- A **planner** that searches in that model
- **Memory** that persists beyond a context window
- A **policy** that maps beliefs to actions

In that picture, the LM is a component -- mostly good for language, maybe high-level heuristics -- not the agent itself.

This document implicitly equates "agent competency" with "better instruction-following LM." That's not how you get robust planning, long-horizon reasoning, or grounded decision-making. You should be talking about model adaptation _and_architectural design: what gets embedded in the LM vs what lives in separate modules.

### 4. Taxonomy & terminology issues


**Norvig:** The taxonomy tries to carve out "Instruction Tuning," "Domain-Specific Adaptation," "Fine-Tuning LLM Agents," "Agentic LLM Architecture Tuning." For senior people, that will feel a bit muddled.

I'd probably restructure:

1. **Model-level adaptation**
	- Instruction tuning
	- Domain fine-tuning
	- Parameter-efficient methods (LoRA, prefix-tuning, adapters)
	- RLHF / DPO / other preference methods
2. **System-level adaptation**
	- Changing toolsets, prompts, memory, planners
	- Logging + offline improvements to policies and heuristics
	- Safety layers and filters
3. **Agent-level evaluation**
	- Task success, tool-use accuracy, robustness, calibration, etc.

Right now, "Agentic LLM Architecture Tuning" is underspecified. Is that:

- Training the LM to emit ReAct-style traces?
- Architecting the agent around a _fixed_ LM?
- Adjusting the agent's loop (planning vs acting, reflection, multi-agent setups)?

These are different things, and they matter.

### 5. Overclaims & vague phrases


**Russell:** A few phrases would make me uncomfortable in a serious research document:

- "Agents that learn from each interaction and improve over time"
    In almost all production systems, there is _offline_ retraining with strong human control, not on-the-fly self-modification. If you really do online learning, you must talk about stability, safety, and data quality.
- "LLMs tuned to adapt to regulatory changes in real-time"
    Regulations are not just patterns in text; they interact with edge cases, legal interpretation, liability. You need robust data pipelines, validation, and often human approval. Calling that "tuned to adapt in real-time" is overselling.
- "Compliance-aware agents"
    To be technically meaningful, you'd want to articulate:
	- which constraints are hard-coded vs learned;
	- how violations are detected;
	- how the system behaves under ambiguity.

As it stands, those lines read more like product copy than serious methodology.

### 6. Missing: evaluation, failure modes, and trade-offs


**Norvig:** The piece name-drops "task-specific evaluation," but it's very light on:

- **What metrics actually matter for agents?**
	- Success under partial information
	- Recovery from errors
	- Tool misuse rate
	- Safety / constraint violations
	- Calibration and abstention behavior
- **What baselines do you compare against?**
	- A non-adapted general LLM
	- A simple scripted system
	- Human operators
- **How do you know your adaptation actually helps?**
    Fine-tuning can easily _hurt_ generalization, robustness, or calibration while improving a narrow metric.

A real "LM adaptation for agents" story has to talk about _regressions_ and trade-offs, not just benefits: cost, latency, brittleness, loss of generality.

### 7. LeCun on SLMs and resource constraints


**LeCun:** The title mentions LLM & SLM, but the content doesn't really distinguish them.

For _small_ models, adaptation isn't just "LoRA vs full fine-tune"; it's:

- Distillation from larger models
- Architectural changes to fit on specific hardware
- Very different failure modes under capacity limits

SLMs are often used in edge or real-time settings, where latency, memory, and energy constraints dominate. That's a very different engineering problem from "fine-tune a 70B model with LoRA."

If you're going to mention SLMs at all, it should be clear how the adaptation techniques and trade-offs change with scale.

### 8. Data & feedback: where does it come from, and how safe is it?


**Russell:** The section on "Reinforcement Learning from Agent Feedback" glosses over two hard parts:

1. **Reward definition:**
    How do you turn logs into a training signal? Is it human-labeled success/failure, automatic metrics, implicit signals (clicks, dwell time)? Each has pathologies.
2. **Distribution shift & risk:**
    When you adapt based on production logs, you are training on the behavior induced by your _previous_ policy, in the _previous_ environment. That can easily amplify bias, reinforce unsafe shortcuts, or create feedback loops.

If we're talking to serious researchers, you want to acknowledge these points; otherwise it sounds like "just log some failures and magically the agent gets better."

**LeCun:** And continuous adaptation requires careful control: online learning algorithms, safeguards against catastrophic forgetting, mechanisms to roll back bad updates. None of that is mentioned.

### 9. Career-path framing


**Norvig:** The "Is this a Career Path?" part is understandable from a hiring perspective, but as a discipline we should be careful:

- We probably don't need a new job title for every combination of "LLM + X."
- What you describe as "Agent Evaluation Engineer" is actually just "applied ML engineer / research engineer with a focus on evaluation and agents," which is already an important role.

If you present this to senior people, I'd focus less on the title inflation and more on **skill clusters**:

- model adaptation & MLOps,
- agent architecture & tools,
- domain expertise & safety.

Those combinations will matter regardless of what HR decides to call them.

### 10. What they'd keep and what they'd change


**Norvig:** What I _do_ like is the attempt to put model adaptation for agents on a map: instruction tuning, parameter-efficient methods, log-based improvement, domain specialization. That's useful.

I'd tighten it by:

- separating model / system / agent layers,
- making claims more precise,
- and grounding the points in actual research papers rather than vendor blogs and YouTube.

**LeCun:** And I'd reframe it to say:
> We're currently in a phase where people over-use LMs as the core of agents. Adaptation techniques help in the short term, but the long-term path likely involves richer world models and planners alongside the LM.
Without that, you risk reinforcing the idea that "better fine-tuning = better agent," which is not true beyond a certain point.

**Russell:** I'd add an explicit section on **limits and open problems**:

- Where adaptation clearly helps (tool syntax, formats, domain terminology),
- Where it's insufficient (robust reasoning, safety guarantees, out-of-distribution behavior),
- And how it interacts with broader agent design: objectives, uncertainty, and control.

That would make this much more credible to an audience of researchers who already know that "more data and LoRA" is not the full story.

If you want, I can help you rewrite this piece _in their style_ -- keeping the same structure but adding those missing distinctions and caveats so it stands up better in front of a critical research audience.
