---
draft: false
toc: true
title: "Perspective Topics"
linkTitle: "Perspective Topics"
---
# Gemini Sim


Based on their respective research focuses -- **Russell** (Control, Uncertainty, Probabilistic Logic), **Norvig** (Software Engineering, Data Science, Education), and **LeCun** (Energy-Based Models, Self-Supervised Learning, Physical Grounding) -- here are the high-priority research topics they would propose to this audience.

### 1. The "Epistemic Confidence" Crisis (Russell & Norvig)


**The Problem:** Current LLMs are rarely calibrated. They state hallucinations with the same perplexity (confidence) as facts. For an agent to be deployed in critical infrastructure, it must know _what it does not know_.

- **Russell's Angle:** We need to move away from likelihood maximization toward **uncertainty quantification**. An agent must maintain a probability distribution over the utility of its actions. If the variance is high (i.e., "I don't know what will happen"), the optimal policy is information gathering (asking a human), not acting.
- **Norvig's Angle:** How do we architect this? Do we use ensemble methods (expensive)? Do we train specific "refusal" heads? The current method of RLHF (Reinforcement Learning from Human Feedback) often teaches the model to _mimic_ confidence rather than be honest about uncertainty.

### 2. Learning from Observation vs. Learning from Language (LeCun)


**The Problem:** Language is a low-bandwidth compression of human experience. A child learns "gravity" by dropping a spoon, not by reading the word "gravity" 10,000 times. LLMs have likely hit the point of diminishing returns on text data.

- **LeCun's Angle:** The next frontier is **Self-Supervised Learning (SSL) from Video**. We need systems that watch the world to learn the "physics" of reality (cause and effect, object permanence) without labels. This creates the "World Model" discussed previously.
- **Discussion:** Can a text-only model ever truly "reason," or is it simply manipulating symbols without grounding? LeCun argues that without sensory input, the system has no referent for its symbols.

### 3. Neuro-Symbolic Integration for "System 2" (All)


**The Problem:** Neural networks are continuous and differentiable; logic and planning are discrete and brittle. Pure neural approaches struggle with hard constraints (e.g., "never route traffic into a wall").

- **Norvig's Angle:** The rise of **Tool-Use (Function Calling)** is the primitive version of this. We are offloading the "hard logic" (math, calendar, database) to external symbolic engines (Python, SQL).
- **Russell's Angle:** We need a formal interface where the neural net proposes _strategies_, but a symbolic solver verifies _validity_. The research challenge is making these two fundamentally different substrates talk to each other without losing gradients.

### 4. The "Catastrophic Forgetting" and Lifelong Learning Issue (Norvig)


**The Problem:** Currently, models are static artifacts. You train them, freeze them, and query them. If you update them on new data, they tend to overwrite old data (catastrophic forgetting).

- **Norvig's Angle:** Real-world agents need **lifelong learning**. They must update their knowledge base daily without a full retraining run (which costs $10M+).
- **Research Question:** Is RAG (Retrieval-Augmented Generation) just a band-aid? We need architectures where memory is mutable and writes are durable, arguably moving toward Hebbian learning principles or distinct "hippocampal" modules (fast learning) vs. "neocortical" modules (slow consolidation).

### 5. Intrinsic Motivation and Objective Specification (LeCun & Russell)


**The Problem:** "Helpful assistant" is a vague objective. Autonomous agents need specific drives to function without constant prompting.

- **LeCun's Angle:** **Energy-Based Models (EBMs)**. Instead of predicting the next token, the model minimizes an "energy" function that represents incompatibility between its state and the goal. This allows for non-probabilistic, manifold-based reasoning.
- **Russell's Angle:** How do we specify these objectives without creating "King Midas" problems? If we give an agent the intrinsic motivation to "cure cancer," how do we mathematically encode the constraint "without bankrupting the hospital"? The research focus must be on **Inverse Reinforcement Learning** -- inferring the objective from human behavior rather than hard-coding it.

### Next Step


Would you like me to detail the **"World Model" architecture (JEPA)** LeCun frequently advocates for, or explore the **system design pattern** for integrating symbolic solvers with LLMs as Norvig might describe it?

# GPT Sim


If you put those three in a room with senior AI people and let the conversation run, I'd expect a bunch of follow-on topics to pop up. Roughly:

## 1. World models and representations


**Core question:**

What kind of internal representation do we actually need for robust reasoning and control?

- **LeCun:** Push hard on learned world models, latent spaces, and predictive/objective-based self-supervision as the "real" foundation, with LLMs as a special case and probably not the right one.
- **Russell:** Tie world models to _decision-making under uncertainty_: state estimation, belief distributions, model misspecification.
- **Norvig:** Bridge from classic AI representations (logical, probabilistic, graphical models) to whatever "implicit" structures LLMs have, and how to exploit them.

## 2. Evaluation of reasoning, planning, and agents


**Core question:**

How do we measure progress beyond leaderboard hacking and prompt cherry-picking?

- Agent benchmarks that actually stress **long-horizon planning**, **tool selection**, **credit assignment**, **error recovery**.
- Distinguishing "pattern-matching that looks like reasoning" from **systematic generalization**.
- Evaluating **calibration** and **risk-sensitive behavior**, not just top-1 accuracy.

Russell would especially push: evaluations that tie into safety -- catastrophic error rates, worst-case guarantees, conservative behavior under uncertainty.

## 3. Uncertainty, calibration, and "knowing what you don't know"


**Core question:**

How do we get systems that behave sensibly under uncertainty?

- Structured uncertainty in LLM-based systems: ensembles, Bayesian-ish methods, conformal prediction, or external verifiers.
- What does "confidence" even mean for an LLM? Logprobs vs real-world reliability.
- Designs where agents **defer**, **ask for clarification**, or **abstain** instead of hallucinating.

Russell would push this as central to any safe agent; LeCun would want architectures where uncertainty is part of the world model, not a post-hoc hack.

## 4. Alignment, objectives, and control with powerful priors


**Core question:**

Given a hugely capable prior (LLM), how do we make sure the _agent_ built on top behaves acceptably?

- Limits of RLHF / preference optimization; what they shape vs what they don't.
- Agents with **uncertain objectives**, learning about human preferences over time.
- **Corrigibility**, interruptibility, "off switches" in the presence of strong capabilities.
- How tool-using agents amplify both competence and risk.

Russell would keep dragging the discussion back to "unknown objectives in open environments," and how little LLMs change that fundamental problem.

## 5. Architectures for hybrid systems


**Core question:**

What's the right way to combine LLMs with other modules?

- LLMs + classical planners / solvers / symbolic systems.
- LLMs as interface vs LLMs as central controller.
- Separation of concerns: perception, world modeling, planning, memory, language interface.

LeCun would argue for LLMs as peripheral components (front-ends, code generators, oracles) around a core world-model + planner.

Norvig would be interested in practical patterns that actually work in products, not just clean diagrams.

## 6. Data, scaling, and limits of the current paradigm


**Core question:**

How far can we push "scale + data" before we hit hard walls?

- Diminishing returns of pure scaling; what new _signals_ we need (interaction, feedback, rich environments).
- Synthetic data and self-play vs real-world grounded data.
- Multi-modal pretraining (video, interaction, 3D) to go beyond text.

LeCun would lean into "we need learning from interaction with the world, not just passive text."

Russell would ask: how does this change the _risk profile_ and alignment story?

## 7. Methodology and scientific practice in the LLM era


**Core question:**

How should we do _science_ in a world where baselines are giant proprietary models?

- Reproducibility when key models and data are closed.
- How to separate genuine algorithmic contributions from "we used more compute and better prompts."
- What a "good" paper looks like now: strong baselines, ablations, theory, open artifacts.

Norvig would be vocal here: this is close to his "how to do AI research well" interests.

## 8. Governance, deployment, and societal impact (but at a technical level)


**Core question:**

What technical facts actually matter for policy?

- What deployment patterns are relatively safe vs obviously dangerous (e.g., open-ended tool-using agents with minimal oversight).
- How to design APIs, sandboxing, and monitoring for LLM-based agents.
- What we can realistically promise regulators and what we can't.

Russell would connect agent design to policy (assurance, verification, kill switches);

LeCun would push against overreaction, arguing for nuanced understanding of actual failure modes;

Norvig would try to map technical constraints to actionable guidelines.

If you want, we can pick one of these (say, "world models vs pattern matching" or "evaluating LLM-based agents") and sketch a follow-up mini-dialog or outline of a workshop they'd co-organize on that topic.
