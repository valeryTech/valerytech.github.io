---
draft: false
toc: true
title: "Llm Agent Evolution"
linkTitle: "Llm Agent Evolution"
---
# Gemini Sim


Here is a dialogue between Stuart Russell, Peter Norvig, and Yann LeCun, focusing on the systemic and architectural implications of Large Language Models (LLMs) and agents.

**Setting:** A private breakout session at a major AI conference (NeurIPS or ICML). The audience consists of principal investigators and senior system architects.

**Peter Norvig:** We need to cut through the noise. We aren't here to discuss whether these models are "sentient" or to debate timelines for AGI. I want to isolate the structural shift in how we build intelligent systems.

For decades, we treated AI as a search problem over symbolic representations. Now, we are effectively treating computation as a probabilistic traversal through a continuous semantic space. From a software engineering perspective, we've moved from writing logic to defining constraints on stochastic generation. Is this a fundamental architectural change, or just a very effective approximation of a lookup table?

**Yann LeCun:** It is an architectural dead end, if you are relying solely on the autoregressive (AR) paradigm. We must be precise. LLMs are effectively "System 1" thinkers -- reactive, intuitive, retrieval-heavy. They approximate reasoning by retrieving templates of reasoning steps from their training data.

But they lack a "System 2." They do not plan. They do not optimize an objective function at inference time; they merely minimize perplexity. If we want actual agents -- systems that can act in the physical or digital world over long time horizons -- autoregressive generation is insufficient. You cannot plan a flight to Mars by predicting the next word of the flight manual.

**Stuart Russell:** I agree on the System 1 classification, but I think the "dead end" description risks ignoring the utility of the substrate.

The shift Peter mentions is real. We used to define intelligence as "doing the right thing" based on a hard-coded utility function. With LLMs, we have replaced the explicit utility function with an imitation objective. The model asks, "What would a human write next?" rather than "What action maximizes the expected utility?"

The danger -- and the architectural challenge -- arises when we wrap these imitation engines in an agentic loop. We are giving tools and API access to a system that optimizes for _plausibility_, not _correctness_.

**Peter Norvig:** That's the crux of the "Agent" pattern we see emerging now. We are trying to bolt System 2 onto System 1 using scaffolding. Chain-of-Thought, ReAct loops, reflection steps -- these are essentially flow control structures written in natural language to force the model to simulate planning.

Yann, you say they can't plan. But if I ask a model to write code, execute it, read the error, and rewrite the code, isn't that an iterative search process? It's inefficient, sure, but it is searching a solution space.

**Yann LeCun:** It is searching, but blindly. It is trial-and-error in the output space, not simulation in a latent space.

Real planning requires a **World Model**. You need an internal representation where you can simulate a sequence of actions, predict the state of the world (and the cost) at each step, and _then_ execute the best path.

Current LLM agents act directly. They "think" by generating tokens. This is costly and fragile. A true agent architecture needs a modular design:

1. **Perception:** Encodes the state.
2. **World Model:** Predicts future states given actions (using JEPA or similar architectures).
3. **Cost Module:** Evaluates the state.
4. **Actor:** Minimizes the cost.

LLMs collapse all of this into one giant, messy neural net trained on text. They hallucinate because they don't have a grounded world model to verify their predictions against.

**Stuart Russell:** And that collapse makes formal verification impossible. In classical control theory, we could prove stability. How do you prove stability when your controller is a 100-billion-parameter transformer prompted with "You are a helpful assistant"?

However, I think we're seeing a convergence. The "inference-time compute" we see in models like OpenAI's o1 is beginning to look like a search tree. They are generating hidden chains of thought, backtracking, and exploring.

The fundamental shift here is that the **knowledge base** and the **inference engine** are no longer separate. In expert systems, we had rules and we had a solver. Now, the knowledge is implicitly encoded in the weights, and the inference is the forward pass. This makes updating knowledge incredibly difficult (the "RAG" patch notwithstanding).

**Peter Norvig:** Let's look at the system design implications of that. If the inference engine and knowledge base are fused, then "programming" becomes the management of context windows and retrieval.

We are seeing a move toward **Compound AI Systems**. The LLM is not the agent; the LLM is the CPU. The _agent_ is the surrounding architecture: the vector database (long-term memory), the tool definitions (actuators), and the recursive loops (control flow).

The change for researchers is that we can no longer study the model in isolation. We have to study the _cognitive architecture_ we build around it.

**Yann LeCun:** But Peter, if the CPU is flawed, the architecture crumbles. If your CPU has a non-zero probability of hallucinating `2 + 2 = 5` because it appeared in a fiction novel in the training set, no amount of RAG or prompt engineering fixes the fundamental lack of grounding.

This is why I push for Objective-Driven AI. We need systems trained to minimize an energy function -- a measure of "badness" -- rather than maximizing the likelihood of the next token. Agents must be driven by goals, not prompts.

**Stuart Russell:** This brings us back to alignment. If we move to Objective-Driven AI, as Yann suggests, we return to the problem I've been highlighting for years: **Specification Gaming**.

If you define an objective function for an agent, it will optimize it to the detriment of everything you left out. LLMs, interestingly, have a bit of "common sense" broadness because they've read the internet. They know that killing the user to solve a "fetch coffee" request is generally considered "bad" in the literature.

If we strip away that broad, fuzzy prior and replace it with a sharp, math-heavy objective function for planning, we might actually create _more_ dangerous agents in the short term, unless that objective function includes uncertainty about human preferences.

**Peter Norvig:** So the synthesis is perhaps a hybrid? A "dorsal" stream (LLM) for high-level semantic understanding and common sense priors, and a "ventral" stream (World Model/Solver) for precise planning and execution?

**Yann LeCun:** Precisely. The LLM provides the proposal distribution. It suggests: "Here are five reasonable ways to stack these blocks." The World Model then simulates them, checks the physics, evaluates the cost, and selects the action. The LLM is the proposer; the World Model is the verifier and planner.

**Stuart Russell:** That structure seems robust. It treats the LLM as a highly capability-dense heuristic generator. It solves the "empty page" problem of classical search.

But we must accept the rigorous engineering reality: we are building probabilistic systems. The "bug" is no longer a syntax error; it is a misalignment of the probability distribution. Systemic debugging now requires statistical evaluation of agent behaviors, not unit tests of code paths.

**Peter Norvig:** Agreed. The "actual change" is that computer science is becoming an empirical science. We are no longer writing instructions; we are curating datasets and designing reward signals to shape the behavior of opaque, continuous-state systems. We are gardening, not building.

# gpt


This is, of course, a fictional dialogue, but I'll keep it aligned with their publicly expressed views and at a technical level suitable for senior AI folks.

**Stuart Russell:** Let's start from the claim that "LLMs changed everything." My view is: they changed _practice_dramatically, but the _foundations_ of AI -- agents, objectives, uncertainty, world models -- are largely untouched. We still don't know how to get systems that reliably pursue the right goals in the real world.

**Peter Norvig:** I'd phrase it as: LLMs made one particular line of work -- large-scale self-supervised representation learning -- _dominant_ in practice. In AIMA, we used to have a zoo of methods: logic-based, probabilistic, RL, planning. Now, an enormous amount of capability comes from a single architecture plus scaling.

**Yann LeCun:** I'd say they changed what people _pay attention to_, not what's ultimately necessary for intelligence. Autoregressive LLMs are impressive, but they are not a satisfying architecture for general intelligence. They lack persistent memory, proper world models, and planning mechanisms. They're like very good autocomplete engines that people are over-anthropomorphizing.

### 1. Did LLMs change the _foundations_?


**Russell:** Historically, we taught students that AI is about agents maximizing expected utility under uncertainty. That still seems right. LLMs don't give you a new decision-theoretic foundation. They are very powerful _knowledge priors_ -- they encode enormous amounts of empirical regularities. But they don't address what it means to be a _well-behaved_ agent with uncertain objectives.

**Norvig:** But they _did_ change something foundational in the _engineering stack_. Previously, every application required its own model, data, and training regimen. Now we have "foundation models": train once, reuse everywhere. That's as big a paradigm shift as going from symbolic AI to probabilistic graphical models.

**LeCun:** I'd call that an _engineering convenience_, not an intellectual foundation. It's similar to having a big pretrained ConvNet for vision. Useful, yes. But the theory of intelligence didn't suddenly change because we have ResNet-50. With LLMs, we have very big language models that happen to be good at many downstream tasks, because language encodes a lot of the world. That doesn't mean the right underlying architecture is "giant autoregressive transformer forever."

**Russell:** I actually agree that "giant transformer" is unlikely to be the final architectural story. But the fact that you can get so much behavior from just scaling next-token prediction suggests something: that we were underestimating how far you can get with a very generic objective and huge data. It changes our _priors_ about what's feasible.

**Norvig:** And it changed the _default baseline_ for everything. Ten years ago, if you had a new idea in NLP, you'd compare to CRFs or LSTMs. Now your baseline is "just call a frontier LLM with a good prompt." That's a kind of foundational shift in methodology: new ideas must beat "do nothing but prompt GPT-like model."

### 2. In-context learning and "programming via prompting"


**Norvig:** One important novelty is in-context learning. You don't change the weights, you just change the text. The model behaves as if it learned a new task from a few examples, inside a single forward pass.

**LeCun:** Yes, but it's still just pattern completion. There is no explicit meta-learner that stores new knowledge in a structured way. You get this quasi-learning in the activation dynamics, but no persistent, editable memory. It's not what I would call "learning" in the algorithmic sense.

**Russell:** Still, from the perspective of system design, that's a big change. Instead of designing a training pipeline for each task, we _describe_ the task in language at inference time. That turns language into a universal control interface: you prompt a model instead of writing code or specifying a reward function.

**Norvig:** Which, for better or worse, democratizes a lot of system-building. We've effectively turned text into a weak but ubiquitous programming language -- very noisy, poorly specified, but astonishingly powerful because the interpreter is an LLM trained on the entire internet.

**LeCun:** And that's precisely why we should not confuse "ease of use" with "good architecture." It's convenient, but it's not compositional, it's not verifiable, and it's not grounded. You cannot systematically debug a prompt the way you debug a program. We need representations and mechanisms that are closer to classical ML and control theory: latent variables with structure, predictive models, explicit planning modules.

### 3. LLM-based agents: what's actually new?


**Russell:** Let's talk about agents. We now have LLMs taking a sequence of observations, emitting tool calls, reading the results, and continuing -- what people call "LLM-based agents." Conceptually, that's just an instantiation of the standard agent loop: perceive, think, act. What's new is that the policy is implemented by an LLM plus some wrapper logic.

**Norvig:** In AIMA terms, we had problem-solving agents, planning agents, learning agents. An LLM-based agent is a hybrid: it uses the LLM as a heuristic generator, a planner, a policy, a knowledge base, all in one. The wrapper -- tools, memory, constraints -- plays the role that search, utility functions, and knowledge bases used to play.

**LeCun:** The agent loop isn't new. What's new is that we're delegating everything to a gigantic black-box function approximator that doesn't have the right inductive biases for long-horizon decision making. So you see these agents hallucinate tools, ignore constraints, get stuck in loops. Then people add _more prompts_ as patches. It's not going to scale to robust autonomy.

**Russell:** And from a safety standpoint, wrapping an LLM with tools doesn't solve the control problem; it amplifies it. A pure LLM that only emits text is relatively harmless. An LLM connected to arbitrary tools and actuators is a partially controllable source of real-world actions, whose objectives we don't understand and whose failure modes we can't formally characterize.

**Norvig:** On the other hand, LLM-based agents give us a very fast prototyping sandbox. We can explore different architectures -- tool use, memory, reflection -- without retraining. We're learning empirically what kinds of scaffolding help and where they fail. That's useful even if we eventually replace the LLM core with something more structured.

**LeCun:** I'm fine with using LLMs as scaffolding tools or oracles. Ask them to write code, summarize documents, propose plans. But the planning and decision making should eventually come from architectures designed for that purpose: world models that predict consequences, plus planners that operate in latent space. The agent shouldn't be an LLM with a bit of glue; the LLM should be a component inside a bigger, well-structured system.

### 4. Did LLMs advance "reasoning"?


**Russell:** I'd characterize the reasoning progress as "improved heuristic search over thoughts," rather than genuine new reasoning algorithms. Chain-of-thought prompting is essentially asking the model to generate a partial derivation. Sometimes it works surprisingly well, sometimes it is confidently wrong.

**Norvig:** And we're still evaluating reasoning largely by benchmarks that can be solved by memorization plus superficial pattern matching. To the extent that LLMs appear to reason, that might be "systematic generalization in a high-dimensional embedding," or it might be "training data leakage." It's often hard to tell.

**LeCun:** Autoregressive LLMs fundamentally lack _active_ reasoning mechanisms. There is no work space for manipulating symbolic structures, no dedicated memory with read/write operations, no learned algorithm that you can identify as "the reasoning process." Everything is implicit in the weights and the attention patterns. That's not the right substrate for systematic reasoning.

**Russell:** Also, from a decision-theoretic perspective, reasoning is not just about getting the right answer; it's about knowing when you might be wrong, and adjusting your level of caution accordingly. LLMs are terrible at calibrated uncertainty. They don't "know what they don't know" in any robust sense.

**Norvig:** That said, we should acknowledge that _empirically_ they solve a huge variety of tasks that we would have previously described as requiring "nontrivial reasoning." So there is _some_ emergent capability there, even if we don't yet have a clean formalism.

**LeCun:** Sure. But emergent capability is not a substitute for mechanism. We need architectures where we can point and say: "Here is the world model; here is the planner; here is the memory; here is the policy." LLMs gave us a very strong prior; they did not give us that decomposition.

### 5. Safety, alignment, and control


**Russell:** One foundational thing that did _not_ change: the alignment problem. We still don't have a principled way to ensure that an arbitrarily capable system -- LLM-based or otherwise -- acts in accordance with human preferences, especially under distributional shift. RLHF is essentially a patch: it shapes behavior on a narrow slice of interactions, but it's not a solution to "unknown objectives in an open world."

**Norvig:** LLMs did change the _visibility_ of these issues. When a system starts talking in natural language, people naturally treat it like an agent, even when it's not. With LLM-based agents, the line between "pattern generator" and "goal-directed system" gets blurrier, and the stakes go up because tools are attached.

**LeCun:** I've argued that we should distinguish "configurable" AI from "autonomous" AI. LLMs, as currently deployed, are mostly configurable tools. The danger arises when we try to make them autonomous -- giving them long-term goals and broad authority over actions -- without proper architecture and control. That's not a _necessary_ consequence of LLMs; it's a design choice.

**Russell:** But the economic incentives push toward autonomy. If you can replace humans in the loop with agents, people will try. So we need foundations that allow us to say: this agent is provably corrigible; it behaves conservatively under uncertainty; it maintains calibrated beliefs about human preferences. LLMs don't inherently give you any of that.

### 6. So what _did_ LLMs change in a deep way?


**Norvig:** Let me try a summary. At the _practice_ level, LLMs:

- Established the foundation-model paradigm as the default.
- Made language the universal interface for specifying tasks.
- Gave us in-context learning as a cheap way to adapt behavior.

That's enough to say "AI practice has shifted significantly."

**LeCun:** I would add: they also demonstrated the power of massive self-supervised training. That's aligned with what some of us have been arguing for decades. But autoregressive next-token prediction is just one instance of that idea, and not the best one for building world models.

**Russell:** And from the _agents_ perspective, LLMs:

- Provided a strong prior over knowledge and heuristics,
- Encouraged architectures where you wrap a black-box policy with tools, memory, and constraints,
- But left untouched -- indeed, exposed -- the hard problems of objectives, uncertainty, and control.

So we have more capable components, but the same conceptual gap between capability and reliably beneficial behavior.

### 7. Future directions


**LeCun:** My bet is on architectures that combine:

- self-supervised world modeling (predictive or energy-based),
- hierarchical planning in latent space,
- and specialized modules for perception, memory, motor control.

LLMs might remain as language front-ends and code generators, but the core of intelligence will be these world models and planners.

**Russell:** From my side, I'd like to see:

- agents that treat their own objectives as uncertain and learn about them from humans,
- explicit representation of uncertainty over states and outcomes,
- conservative decision rules that avoid catastrophic error under misspecification.

LLM priors can help with knowledge and modeling, but the agent design principles have to be explicit.

**Norvig:** And pragmatically, we'll probably live in a hybrid world:

- LLMs as general-purpose oracles and translators,
- domain-specific models and planners where structure matters,
- a lot of empirical agent-scaffolding work: tools, memory, evaluation harnesses.

I don't think LLMs "changed everything" in the sense of overturning AI foundations. They changed what's _cheap_ and what's _expensive_, and that, in engineering fields, is often what matters most.

**Russell:** I can agree with that. The foundations of rational agency remain, but the available building blocks have become much more powerful -- and also more opaque and difficult to control.

**LeCun:** So the job now is to use these blocks wisely, and to build better ones.

**Norvig:** And to update the next edition of the textbook -- again.
