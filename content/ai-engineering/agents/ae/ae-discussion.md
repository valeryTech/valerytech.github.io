---
draft: false
toc: true
title: "Ae Discussion"
linkTitle: "Ae Discussion"
---
dialogue between Russell, Norvig, and LeCun on "agent engineering" as a discipline

# Dialog - One


Here is the continuation of the breakout session, shifting focus to the emerging discipline of **"Agent Engineering."**

**Peter Norvig:** We are witnessing the birth of a new engineering discipline, similar to the transition from electrical engineering to computer science in the 50s.

I'm seeing job titles change. It's no longer "Prompt Engineering" -- which was akin to whispering at the machine -- it is "Agent Engineering." This is a systems discipline. It's about managing state, defining tool interfaces (function schemas), and designing the control flow that wraps the model.

But the paradigm shift is jarring. In traditional software engineering, `function(x)` always returns `y`. In Agent Engineering, `function(x)` returns `y`... _most of the time_, provided the context window isn't full and the temperature is tuned. We are building deterministic logic on top of a stochastic substrate.

**Yann LeCun:** I would hesitate to call it "engineering" just yet. It feels more like **bricolage** -- tinkering.

When you build a bridge, you have the physics of materials.1 You know the shear stress of steel. In "Agent Engineering," your building block is a prompt that says, "Please don't fail." This is not robust.

Current agent frameworks -- LangChain, AutoGen, etc. -- are essentially trying to use natural language as the bus for passing messages between modules. This is horribly inefficient and fragile. If you upgrade the model version, your entire "engineering" stack might break because the new model interprets a comma differently.

**Stuart Russell:** That fragility points to the missing core of this discipline: **Composability Guarantees**.

In classical engineering, if I connect a verified resistor to a verified capacitor, I can predict the behavior of the circuit. In Agent Engineering, if I connect a "Planner Agent" to a "Coder Agent," I have no mathematical way to predict the emergent behavior.

We are currently building agents by "vibes." You run the loop, it looks okay, you ship it. "Engineering" implies a standard of care and predictable failure modes. We don't have that. We need a way to define **probabilistic contracts**. If Agent A passes a task to Agent B, what is the variance in the expected output?

**Peter Norvig:** That's a fair critique, Stuart, but the industry is adapting by inventing **"Probabilistic Unit Tests"** -- or what we now call **Evals**.

We can't prove correctness, so we prove statistical reliability. You run the agent against 1,000 scenarios and measure the pass rate. It's closer to biology or clinical trials than computer science.

The "Engineering" part is now moving into the **Scaffolding**:

1. **State Management:** Keeping track of the conversation history and pruning it intelligently (memory management).2
2. **Tool Definitions:** Writing Pydantic models or JSON schemas so strictly that the LLM cannot hallucinate invalid arguments.
3. **Observability:** Tracing the chain of thought to debug _why_ the agent decided to call the wrong API.3

**Yann LeCun:** But Peter, notice what you are doing. You are building massive, complex scaffolding to compensate for the fact that the core model cannot reason or plan reliably.

True Agent Engineering should focus on the interface design, not the prompt.

Instead of an agent reading a text description of a tool, the agent should be trained to manipulate an embedding space that represents the tool. The "API" shouldn't be text; it should be a differentiable manifold. That way, the agent can learn the gradient of the tool use -- "if I tweak this parameter, the result gets closer to my goal."

**Stuart Russell:** I agree with Yann on the interface. The reliance on Natural Language as the "operating system" for agents is a bottleneck.4

However, since we are stuck with it for now, the most critical part of this new discipline is Constraint Engineering.

If you look at the successful deployments (like coding assistants), they don't just let the LLM generate text. They parse the output into an Abstract Syntax Tree (AST). If the AST is invalid, the "compiler" rejects it and feeds the error back to the model.

The "Engineer" of the future isn't writing the generative logic; they are writing the **Validators** and **Verifiers**. They are building the walls that constrain the probabilistic water.

**Peter Norvig:** Exactly. This is the **"Sandwich Pattern"**.

- **Top Bun:** Deterministic code prepares the context (RAG, database lookups).
- **Meat:** The LLM performs the fuzzy reasoning or transformation.
- **Bottom Bun:** Deterministic code validates the output (regex, type checking, unit tests).

The "Agent Engineer" spends 80% of their time on the buns, not the meat.

**Yann LeCun:** This "Sandwich" is useful, but it is an admission of defeat regarding the model's capabilities.

If we want to scale this discipline, we need to move away from "Instruction Following" (where the engineer micromanages the steps via prompts) to **Objective Optimization**.

The engineer should specify the cost function: `J(x) = (Time Taken) + 100(Error Rate)*`.

The agent should then self-adjust its behavior to minimize J. Right now, "Agent Engineering" is just manual tuning of hyperparameters disguised as English sentences.

Stuart Russell: And that brings us to the ethical dimension of this engineering discipline.

If we move to Objective Optimization as Yann suggests, the "Engineer" must become a moral philosopher. Defining the cost function is defining the ethics of the system.

If you build a "Sales Agent" and the objective is strictly `maximize_revenue`, you have engineered a sociopath. The discipline of Agent Engineering must include **Safety Engineering** as a default import, not an optional package. We need "building codes" for objective functions.

**Peter Norvig:** So, the consensus? Agent Engineering is currently the art of **wrapping stochastic cores in deterministic envelopes**.5 It is messy, empirical, and requires a shift from "correctness" to "reliability."

**Yann LeCun:** And hopefully, a temporary discipline until we build architectures that actually work.

# Dialog - Two (gpt)


**Norvig:** I've been hearing people talk about "agent engineering" as if it's a new discipline -- job titles, tracks at conferences, even "agent engineers" in org charts. I'm curious how you two see that. Is it just rebranding of "applied AI," or is there something genuinely distinct?

**Russell:** I'd start by asking: what is being engineered, exactly? If the "agent" is just an LLM with a few API calls, that's not much of a discipline. But if we mean systems that perceive, decide, and act in complex environments with some notion of objectives and uncertainty, then yes, that's close to what AI was supposed to be from the beginning.

**LeCun:** Right now, "agent engineering" mostly means wrapping a large language model in a loop: give it tools, some memory, a prompt template, and call it an agent. It's a kind of systems integration exercise around a black box. That's useful, but it's not yet a principled field. There are no real design rules, just recipes.

**Norvig:** Practically, though, it _has_ changed what many people do day to day. They're not training models; they're wiring LLMs to tools, logs, databases, and GUIs, then iterating on prompts, constraints, and evaluation harnesses. That's fairly different from "build a classifier and ship it."

**Russell:** If we want "agent engineering" to be more than ad-hoc glue, it needs core concepts:

- how to specify and learn the agent's objectives,
- how to model uncertainty about the world and about those objectives,
- how to reason about the consequences of actions,
- how to provide guarantees -- or at least bounds -- on behavior.

Otherwise it's just stochastic scripting.

**Norvig:** So you'd want it grounded in the rational agent model: states, actions, utilities, belief distributions, and so on?

**Russell:** Exactly. An "agent engineer" should be able to answer: what's the environment, what's the objective, what's the decision rule, and how does uncertainty enter? If they can't say that, they're not engineering an agent; they're poking a black box until it does something interesting.

**LeCun:** I'd add: they must think in terms of architecture. Where is the world model? How is memory implemented? Where does planning happen? If the answer is "inside this gigantic transformer somewhere," that's not a design; that's wishful thinking. Agent engineering should push us toward modular systems: separate perception, world modeling, planning, and language.

**Norvig:** Let me play the historian for a moment. In the textbook we had "agent architectures" for decades: reflex agents, model-based agents, goal-based agents, utility-based agents. But almost nobody outside academia built them. They built point solutions: MT systems, ad systems, recommenders.

Now, because of LLMs, it's suddenly natural for companies to say "we're building an agent that does X." That shift in framing is what I think people are trying to capture with "agent engineering."

**LeCun:** Yes, the framing changed. When you have a flexible model that can parse and produce language, it's tempting to put it in a loop and call it an agent. But the loop is often underspecified. There's no explicit objective, no explicit model of the world, no explicit notion of cost. People rely on the LLM's training distribution to avoid disasters, but that's not a principled safety mechanism.

**Russell:** And you get brittle behavior. The agent follows spurious instructions, misuses tools, breaks invariants. Then people patch it with more prompts and heuristics. It's reminiscent of early expert systems: fix one rule, break three others.

**Norvig:** So suppose you were asked to design a curriculum for "agent engineering." What would you put in?

**Russell:** First, decision theory and sequential decision making. Not at the level of "here is the Bellman equation" and then forget it, but as a live tool: how do you design an agent that trades off reward, risk, and uncertainty over time?

Second, model-based thinking: state space, transition dynamics, partial observability. Even if the implementation is a neural network, the conceptual apparatus has to be there.

Third, safety: off switches, corrigibility, reward uncertainty. I'd want graduates who are uncomfortable deploying an agent unless they can explain how it behaves off distribution.

**LeCun:** I'd insist on representation learning and world models. Agents need internal state that summarizes the world, not just a context window of tokens. That includes:

- learning latent state from high-dimensional observations,
- predicting future states and rewards,
- and planning in that latent space.

If "agent engineers" don't understand that, they'll keep overusing LLMs in places where we really need structured predictive models.

**Norvig:** I'd add a very practical layer:

- building and sandboxing tool-using agents,
- designing evaluation suites and test harnesses,
- logging and analyzing trajectories,
- running ablations and baselines.

There's a lot of engineering craft in setting up environments, metrics, and debug tools so that your agent doesn't just look good on cherry-picked demos.

**LeCun:** One danger I see is that people treat "agent engineering" as "prompt engineering plus API integration." That's fragile. A proper discipline should have invariants: if I change the tool API, or the environment, or the objective, how do I reason about the effect on the agent?

**Russell:** Right now, if you refactor a tool description, the LLM agent can completely change its behavior in unpredictable ways. With a classical planner or policy, you'd at least know where to look: transition model, reward function, policy parameters. With LLM-based agents, the behavior is a complex function of prompts, examples, and pretraining data.

**Norvig:** Which suggests that a core part of agent engineering is _observability_. You need tooling to inspect what the agent is "thinking" -- its intermediate plans, its internal state, tool calls, failures -- and you need ways to intervene. We used to talk about "explainable AI" mostly for models; now we need explainability for agents' _interaction traces_.

**LeCun:** Yes, but I'd much rather have architectures whose internal operation is interpretable by construction: explicit world-model modules, differentiable memories, planners you can inspect. That's another reason not to put everything inside an autoregressive model.

**Russell:** There's also a governance angle. If we recognize agent engineering as a discipline, we implicitly acknowledge that some systems will have significant autonomy. Then we need standards: what tests must an agent pass before it is allowed to act in certain domains? What constitutes due diligence?

**Norvig:** Similar to how we certify control systems in aviation or medicine, but adapted to learning-based agents with complex models.

**LeCun:** And that, in turn, should influence the technical agenda. If you know that an agent must be certifiable in some way, you design architectures that expose the right hooks for verification and monitoring. That's another reason to care about modularity and world models.

**Russell:** So in a sense, agent engineering sits between three things:

- the **theory of rational agency**;
- the **architectures and learning algorithms** that implement it;
- and the **engineering practices and governance** that constrain deployment.

If we only focus on the middle piece -- "wrap an LLM, run some tests" -- we are missing the discipline.

**Norvig:** Let me push a bit: do you think "agent engineering" is actually new, or is it just the natural evolution of AI system building?

**LeCun:** Conceptually, it's not new. Robotics, autonomous driving, game agents -- all of that was agent engineering. What's new is that people are doing it at scale _without_ being forced to confront representation, control, and planning in a rigorous way, because the LLM smooths over a lot of problems until it suddenly doesn't.

**Russell:** I'd say the _need_ for a well-defined discipline is new. When agents are niche systems in labs or specific verticals, informal practices are tolerable. When agents are generic software components anyone can wire up to critical infrastructure, informal practices are dangerous.

**Norvig:** So the opportunity, if we're optimistic, is to turn this loose bundle of tricks -- prompting, tool-calling, RAG, reflection -- into something with principles:

- clear definitions of agent types and capabilities,
- standard evaluation regimes,
- best practices for safety and observability,
- and a better integration with the underlying theory.

**LeCun:** And to make sure the field doesn't get stuck in the local optimum of "LLM plus glue." Agent engineering should push toward architectures that actually support long-term planning, grounded perception, and robust control, with LLMs as one component, not the whole story.

**Russell:** If we manage that, then "agent engineering" might become what AI was always supposed to be: the systematic design of systems that reliably do what we _actually_ want, in the real world, under uncertainty. Right now we have the "systems" and the "real world" and the "uncertainty." The "reliably" and the "what we actually want" parts are still to be engineered.

# Dialogue - Two-One (gpt)


_Fictional roundtable. Not real quotes or a record of an actual conversation._

**Russell:** "Agent engineering" is an interesting label. The first question is: what's the object we're engineering? If we mean an entity that perceives, decides, and acts to achieve objectives, then we're back to the classic agent framing. The engineering discipline would be about specifying objectives, ensuring correct behavior, and proving properties where possible.

**Norvig:** I'd start with a more pragmatic definition: an "agent" is software that takes actions in an environment over time -- especially when actions include tool use, delegation, API calls, and changes to external state. "Agent engineering" would then be: building those systems so they're reliable, testable, debuggable, and economical.

**LeCun:** I'd push back on centering it around "objectives" as if the world is a reward function. Many useful systems won't be cleanly described as maximizing a scalar reward. What matters is competence: learning internal models, predicting consequences, planning with them, and acting under uncertainty. Engineering should focus on architectures that can learn and generalize, not only on glue code around a language model.

**Russell:** Competence is necessary but not sufficient. Engineering disciplines typically include a theory of correctness, or at least a notion of specification. If we build agents that can act in the world, we need guarantees about what they won't do, not only what they can do.

**Norvig:** In software engineering, we rarely get full guarantees. We lean on layered defenses: tests, monitoring, staged rollouts, postmortems. Agent engineering could standardize those practices for systems that have long-horizon loops and external actions.

**LeCun:** Sure, but if the underlying learner is brittle, no amount of scaffolding will fix it. There's a trend of calling "agentic" any system that loops: prompt, tool call, prompt, tool call. That can be useful, but it doesn't solve the core problem of robust understanding.

**Russell:** Let's separate two layers. One is the _cognitive layer_ -- learning, representation, planning. The other is the _systems layer_ -- interfaces, safeguards, evaluation, human oversight. A discipline can exist even if the cognitive layer is still evolving.

**Norvig:** That's a good split. If I had to draft a syllabus for "Agent Engineering 101," it would look like:

1. agent loop design,
2. tool and environment interfaces,
3. memory and state management,
4. evaluation and reliability,
5. safety and misuse prevention,
6. deployment and monitoring.

**LeCun:** Add "world models" near the top. If an agent is to act competently, it needs predictive models, not just pattern completion. Also: learn from observation, not only from labeled data or reinforcement signals.

**Russell:** "World model" is fine, but I'd require formalism: what is the environment, what is the agent allowed to change, what constraints must always hold? Otherwise you get systems that behave impressively until they don't, and then the failures are surprising.

**Norvig:** In practice, a lot of surprises come from underspecified boundaries. The agent has too much authority or ambiguous instructions. The engineering move is to narrow permissions: least privilege, typed tool schemas, explicit transactional boundaries, and audit logs.

**LeCun:** Permissions are necessary, but they assume you can enumerate tools and actions. As systems become more autonomous, they'll have richer action spaces. The discipline needs to address learning and adaptation under constraints, not just sandboxing.

**Russell:** Sandboxing is just one tactic. The deeper problem is alignment between the agent's internal objectives and the designer's intent. If the system is optimizing something you didn't mean -- implicitly or explicitly -- you get side effects, goal misgeneralization, and strategic behavior.

**Norvig:** I'm sympathetic, but "alignment" often becomes abstract. Agent engineering could define concrete artifacts:

- a spec document that includes unacceptable behaviors,
- a risk register,
- a suite of adversarial tests,
- measurable acceptance criteria,
- and a deployment checklist.

**LeCun:** Those artifacts are good, but they're not a substitute for better learning principles. For example, many current systems don't have stable, persistent memory in a coherent internal state. They have logs. An engineer can bolt on retrieval, but without a unified internal representation, you get inconsistencies.

**Russell:** Which brings us to what the discipline should standardize. I propose three pillars:

1. **Specification**: what the agent is for, what it must not do.
2. **Verification/validation**: evidence that it meets the specification.
3. **Control**: mechanisms to keep it within bounds during operation.

**Norvig:** And I'd add a fourth: **operational excellence**. Because even if you validate in the lab, the world shifts. Users find weird prompts, environments change, tools fail, data drifts. You need monitoring, incident response, and continuous evaluation.

**LeCun:** The spec part is tricky when the agent is learning. You can specify constraints and objectives, but you can't specify every situation. So the discipline should invest in generalization: better self-supervised learning, hierarchical planning, and architectures that can reason about physical and social consequences with fewer brittle hacks.

**Russell:** Yet, even a learning system can be constrained. Aviation has autopilots that learn nothing, but are constrained by envelope protection. A learning agent can also have envelope protection: hard constraints on actions, resource usage, and access to external systems.

**Norvig:** In industry terms: guardrails. But we should be careful -- guardrails that are too rigid make the product useless. So agent engineering needs a vocabulary for _graduated autonomy_: the agent can propose, the human approves; or it can act within a budget; or it can act freely only in a sandbox.

**LeCun:** That's reasonable. But don't conflate "human in the loop" with safety. People rubber-stamp when under time pressure. Real safety comes from competence plus constraints.

**Russell:** Agreed. And competence can create new risks: a competent system can find strategies we didn't anticipate. So, agent engineering should include _incentive design_ and _containment of optimization_. The more the system can optimize, the more careful we must be about what it's optimizing.

**Norvig:** Let's make it concrete. Suppose we're building an agent that manages cloud infrastructure. What are the engineering steps?

- define actions: deploy, scale, restart, roll back,
- require approvals for high-impact actions,
- use typed, constrained APIs,
- require change plans and dry runs,
- simulate failures,
- keep immutable logs and diffs,
- add canary rollouts,
- and measure outcomes like latency, error rates, cost.

That's agent engineering, even if the "brain" is an LLM plus tools.

**LeCun:** Fine. But if the "brain" hallucinates a nonexistent command or misreads a dashboard, the system fails. So you need robust perception of state: reliable telemetry ingestion, calibrated uncertainty, and the ability to say "I don't know."

**Russell:** The ability to abstain is underrated. A rational agent should treat uncertainty as first-class and avoid irreversible actions when confidence is low.

**Norvig:** Abstention also needs product design. Users hate "I don't know" unless it's paired with a next step: ask a clarifying question, request a permission, run a safe diagnostic, or escalate to a human.

**LeCun:** This is where representation matters. If the system can model cause and effect, it can propose safe diagnostics that reduce uncertainty. Without that, it just asks for more prompts.

**Russell:** Then perhaps the discipline has two tracks:

- **Agent Systems Engineering**: building reliable tool-using loops with current models.
- **Agent Foundations**: learning and reasoning mechanisms for robust autonomy.

**Norvig:** Works for me. And both tracks need standardized evaluation. Today we have a mess: benchmarks for static Q&A, and some task suites for tools, but little that captures long-horizon behavior, partial observability, and real costs.

**LeCun:** Evaluations should measure: sample efficiency, generalization to new tasks, robustness to distribution shift, and compositionality. Also measure whether the agent builds reusable internal abstractions, not just solves a single scripted workflow.

**Russell:** And we must measure _negative_ capabilities: what it refuses to do, how it handles forbidden requests, how it behaves under adversarial inputs, whether it resists manipulation.

**Norvig:** You're both describing what software testers call "non-functional requirements" plus "security testing." Agent engineering should borrow heavily from security: threat models, red teaming, least privilege, defense in depth.

**LeCun:** Security is necessary, but beware of building a discipline that's mostly policy wrappers. If we want agents that operate in the open world, we need advances in learning. Otherwise "agent engineering" becomes "prompt orchestration engineering."

**Russell:** There's an analogy to early aviation. Before aerodynamics matured, people still developed disciplined practices: checklists, maintenance schedules, flight rules. That didn't replace better wings, but it prevented avoidable disasters.

**Norvig:** Good analogy. Let's talk about what a mature "agent engineering" stack might look like:

- a standard tool interface (capabilities, schemas, costs, side effects),
- a state store with provenance,
- a planner/controller with explicit policies,
- a model layer with uncertainty estimates,
- a safety layer (constraints, approvals),
- an evaluation harness (offline replays, simulations),
- monitoring and incident response.

**LeCun:** And a learning layer that builds predictive models from interaction and observation. Also, an internal memory that isn't just retrieval, but structured and consistent.

**Russell:** One more: a theory of _delegation_. If agents call other agents, you get organizational dynamics: diffusion of responsibility, compounding errors. Engineering has to define accountability and traceability across agent-to-agent workflows.

**Norvig:** In practice, that means: every action has an owner, every decision has an explanation artifact, every tool call is logged, and you can replay the chain. Observability, but for agent cognition.

**LeCun:** "Explanation artifacts" can become theater if the system is generating plausible stories after the fact. Better to log actual intermediate states and computations, where possible.

**Russell:** Yes -- distinguish between _post hoc narratives_ and _mechanistic traces_. Agent engineering should define what counts as evidence.

**Norvig:** So maybe the discipline is: "how to build action-taking AI systems with the rigor of safety-critical and security-critical software." Not a new science, but a new professional practice.

**LeCun:** If it stays only practice, it won't scale. The discipline should influence research: architectures that are easier to verify, controllers that are stable, learners that can form compact world models.

**Russell:** Then we agree: agent engineering is a bridge discipline. It connects learning and reasoning with the realities of deployment, and it forces precision about objectives, constraints, and evidence.

**Norvig:** And it gives teams a shared language: capabilities, authority, budgets, evaluations, failure modes.

**LeCun:** And it keeps everyone honest about what's missing: genuine understanding, predictive modeling, and robust generalization.

**Russell:** Then the final question: should "agent engineering" be treated as a distinct discipline?

**Norvig:** If it produces shared standards, reusable components, and a body of best practices, yes. Otherwise it's just a relabeling.

**LeCun:** I'll accept it as a discipline if it doesn't collapse into "wrangling prompts." It needs to drive progress toward agents that learn models of the world and act reliably within constraints.

**Russell:** A reasonable criterion. Let's say: agent engineering is the discipline of building agents whose behavior can be specified, evaluated, and controlled -- while progressively improving the learning and reasoning core.

**Norvig:** Good. Now someone has to write the textbook.

**LeCun:** And someone has to build the benchmarks that aren't toy problems.

**Russell:** And someone has to insist on constraints, even when the demos look good.

**Norvig:** That sounds like a discipline already.

---
