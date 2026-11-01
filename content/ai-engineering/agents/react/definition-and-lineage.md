---
draft: false
toc: true
title: "What a ReAct Agent Is"
aliases:
  - "/ai-engineering/agents/react/analysis/"
description: "Separates what the ReAct paper proposed from the generic model-tool loop and the frameworks sold under its name, traces each element to earlier agent research, and proposes splitting the transcript into explicit state."
linkTitle: "Definition and Lineage"
---

"ReAct Agent" is not one indivisible invention. The term now refers to several different things:

1. The specific method proposed by Yao et al.
2. The textual `Thought -> Action -> Observation` protocol.
3. A generic model-tool loop.
4. A production agent framework containing memory, orchestration, retries, security, monitoring, and multi-agent delegation.

Only the first two come directly from the paper. The third is a broad abstraction derived from it. The fourth contains substantial later engineering that is often marketed under the ReAct name.

## 1. Elements of the original ReAct proposal


The paper's central formal move comes in its Section 2. It starts with a standard agent policy,

\[\pi(a_t \mid c_t)\]

where the context \(c_t\) is the history of observations and actions. It then changes the action space from external actions \(A\) to:

\[\hat{A} = A \cup L\]

where \(L\) is natural language. Outputs from \(L\) are called "thoughts." A thought does not modify the environment; it is appended to the context and may affect later thoughts and actions.

That gives us the following decomposition.

|Element|What the original paper implements|What remains implicit or absent|
|---|---|---|
|Environment interface|The agent receives observations and emits task-specific actions|No general environment model|
|Policy|A frozen LLM generates the next thought or action from the transcript|No explicit policy learning in the main experiments|
|Internal deliberation|Free-form natural-language "thoughts" are added to the trajectory|No guarantee that the thought is correct, causal, or faithful to the model's computation|
|External action|Search, lookup, navigation, object manipulation, product selection, and similar commands|No formal action schemas, preconditions, effects, costs, or permissions|
|Observation|Tool or environment output is appended to the context|No state-estimation process, provenance model, uncertainty representation, or contradiction handling|
|Planning|The LLM may decompose goals, identify subgoals, track progress, and revise its approach in text|No planner, search algorithm, plan data structure, or formal plan validation|
|Working state|The complete prompt and generated trajectory function as temporary memory|No separate belief state, world state, episodic memory, or persistent memory|
|Control schedule|Dense thought-action alternation for QA; sparse thoughts for long decision tasks|No policy for deciding when additional reasoning is valuable|
|Termination|A `Finish` action or a fixed maximum number of steps|No formal success test, confidence calibration, or value-of-information calculation|
|Learning|Few-shot examples; a limited fine-tuning experiment using generated trajectories|No runtime learning, credit assignment, durable adaptation, or systematic failure learning|
|Human control|A human can edit a generated thought and resume execution|No general approval system, invariant enforcement, rollback, or access control|

The paper therefore does **not** present a complete agent architecture. It presents an LLM control pattern in which one autoregressive model performs several roles at once:

- planner;
- working-memory writer;
- state tracker;
- tool selector;
- action selector;
- execution monitor;
- explanation generator.

This collapse into one token stream is the main source of ReAct's simplicity. It is also the source of much of its brittleness.

## 2. What is genuinely specific to ReAct


The strongest formulation of its contribution is:

> Use the same pretrained language model to generate free-form internal language and externally executed actions in one interleaved trajectory, while returning environmental observations to that same trajectory.

The following parts are reasonably classified as LLM-era contributions:

- Treating unrestricted natural language as an internal action channel in the policy output.
- Eliciting the full loop through a small number of human-written examples, without building a domain-specific planner.
- Using the same model and surface protocol across question answering, fact checking, text games, and web interaction.
- Demonstrating that natural-language intermediate state can improve tool selection and recovery compared with action-only prompting.
- Making the intermediate textual state directly editable by a person.

The broader principles--agents receiving observations, taking actions, tracking goals, gathering information, monitoring execution, and revising plans--have long foundations.

A precise verdict is therefore:

- **New general theory of agency:** no.
- **New theory of planning and execution:** no.
- **New LLM prompting and control pattern:** yes.
- **New cross-domain empirical demonstration using very large pretrained language models:** yes.
- **Recombination of established agent ideas in a new computational medium:** strongly yes.

## 3. Foundational lines behind each element


The original ReAct paper should be compared with several separate research traditions.

### Agent-environment loop


Russell and Norvig organize classical AI around agents that receive percepts and choose actions, including reflex, model-based, goal-based, utility-based, and learning agents. Their textbook also treats search, planning, uncertainty, decision processes, robotics, and language as components within that agent framework. ([AIMA](https://aima.cs.berkeley.edu/3rd-ed/contents.html "Table of Contents for AI: A Modern Approach"))

ReAct's \(\pi(a_t \mid c_t)\) formalization is therefore conventional. Its context history is close to a percept history. What ReAct lacks is the explicit internal state expected in a model-based agent.

For partially observable environments, the more formal foundation is the belief state in a POMDP: a probability distribution over possible environment states, updated as actions are taken and observations arrive. ReAct stores a natural-language transcript but does not define a belief update or uncertainty model. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S000437029800023X "Planning and acting in partially observable stochastic domains - ScienceDirect"))

### Goal decomposition and operator selection


The thoughts shown in ReAct frequently perform means-ends reasoning:

- identify the difference between the current and target state;
- choose a subgoal;
- choose an operation expected to reduce the difference;
- inspect the result;
- continue.

This is the lineage of the General Problem Solver and later planning systems. STRIPS represented world states and operators and used means-ends analysis to search for a sequence that transformed an initial state into a goal state. ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/0004370271900105 "Strips: A new approach to the application of theorem proving to problem solving - ScienceDirect"))

Sacerdoti's hierarchical planning work explicitly introduced progressively finer abstraction levels, addressing the same need that ReAct handles informally when it writes a high-level plan and then generates individual actions. ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/0004370274900265 "Planning in a hierarchy of abstraction spaces - ScienceDirect"))

The distinction is substantial:

- STRIPS and hierarchical planners use explicit symbolic states, operators, preconditions, and effects.
- ReAct asks an LLM to improvise all of those relations in language.

### Interleaving planning and execution


The idea of planning, acting, observing unexpected results, and repairing the plan predates ReAct by decades.

The 1972 extensions to STRIPS used monitored real-world execution and explicitly addressed reacting to unexpected action consequences. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/0004370272900513 "Learning and executing generalized robot plans - ScienceDirect"))

The Procedural Reasoning System and the BDI tradition went further. Georgeff and Lansky described agents that formed partially elaborated plans, acted before every detail was settled, remained continuously reactive, and changed goals or intentions when the situation changed. That is close to the control behavior now described as "reason, act, observe, and adapt." ([SRI](https://www.sri.com/publication/robotics-sensors-devices-pubs/reasoning-and-planning-in-dynamic-domains-an-experiment-with-a-mobile-robot/ "Reasoning and Planning In Dynamic Domains: An Experiment With A Mobile Robot - SRI"))

Hybrid robot architectures subsequently separated:

- deliberative planning;
- reactive execution;
- low-level functional control;
- execution supervision.

For example, the LAAS architecture integrated a planner, a procedural execution and supervision system, and reactive functional modules. ([DOI](https://doi.org/10.1177/027836499801700402 "An Architecture for Autonomy - R. Alami, R. Chatila, S. Fleury, M. Ghallab, F. Ingrand, 1998"))

ReAct does not invent this interleaving. It implements it through natural-language generation by a pretrained model.

### Reactive control


Nilsson's teleo-reactive programs supported goal-directed behavior under continuous feedback in dynamic environments, with conditions reevaluated as the world changed. ([arXiv](https://arxiv.org/abs/cs/9401101 "Teleo-Reactive Programs for Agent Control"))

Brooks's subsumption architecture also challenged rigid sense-plan-act pipelines by tightly coupling perception and action through concurrently operating layers. ([DOI](https://doi.org/10.1109%2FJRA.1986.1087032 "A robust layered control system for a mobile robot"))

ReAct lies between the deliberative and reactive traditions. It generates explicit deliberative text, but its next action is selected reactively from the latest transcript. A useful historical description is:

> ReAct is a weakly specified hybrid deliberative-reactive controller whose deliberative state is written in natural language.

### Working memory and shared problem state


The ReAct transcript acts as a combined scratchpad and control state. Earlier blackboard architectures provided a shared evolving problem representation on which multiple knowledge sources and control processes could operate. Hayes-Roth's blackboard control architecture explicitly addressed selecting the next cognitive or external operation and adapting to unanticipated problem-solving situations. ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/0004370285900633 "A blackboard architecture for control - ScienceDirect"))

Soar similarly combined problem spaces, operators, working memory, production rules, search, and learning in a general problem-solving architecture. ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/0004370287900506 "SOAR: An architecture for general intelligence - ScienceDirect"))

The difference is representational:

- blackboard and cognitive architectures define structured state and update mechanisms;
- ReAct stores everything as tokens in a context window.

The ReAct paper does cite cognitive work on inner speech and working memory. Its weakness is that it connects this psychological literature to recent chain-of-thought prompting while largely omitting the corresponding computer-science literature on working-memory systems and cognitive architectures.

### Information gathering


Search actions in ReAct are information-gathering actions. The agent acts partly to change the world and partly to reduce its uncertainty.

This has foundations in active perception, contingent planning, POMDPs, and value-of-information methods. In these traditions, information gathering is chosen because the expected value of better information exceeds its cost. ReAct makes this decision informally through generated text.

### Deciding when to think


ReAct allows dense or sparse thoughts, but the schedule is largely encoded in demonstrations or left to the model. Classical metareasoning asks a more formal question: which computation should the agent perform, given that computation consumes limited time and resources? Russell and Wefald framed internal computations as actions whose value derives from their effect on later external decisions. ([DOI](https://doi.org/10.1016%2F0004-3702%2891%2990015-C "Principles of metareasoning - ScienceDirect"))

This is directly relevant to modern concerns about ReAct token cost, latency, excess tool calls, and endless loops.

## 4. What IBM calls a "ReAct agent"


IBM's page accurately captures the current popular meaning:

- verbal reasoning;
- external tools;
- observation feedback;
- repeated execution until an answer or stopping condition;
- possible use of context or external memory.

It then expands ReAct into an umbrella covering RAG, external memory, multi-agent delegation, stopping strategies, and production workflows. Those are reasonable extensions, but they are not all part of the original method. ([IBM](https://www.ibm.com/think/topics/react-agent "What is a ReAct Agent? | IBM"))

One IBM claim is historically misleading:

> "Unlike traditional artificial intelligence systems, ReAct agents don't separate decision-making from task execution."

Traditional AI contains extensive work that interleaves decision-making and execution: monitored STRIPS, PRS, BDI agents, teleo-reactive programs, reactive robotics, and hybrid robot architectures. The statement is defensible only with a much narrower meaning:

> Unlike a simple LLM pipeline that first writes a complete answer or plan and then executes it, ReAct repeatedly returns tool results to the model before the next decision.

That narrower claim describes the LLM engineering change without erasing earlier AI research.

IBM also treats verbal traces as a source of explainability. The original paper shows that traces are useful for inspection and debugging, but neither the paper nor the IBM page establishes that a generated trace is a faithful explanation of the model's actual internal computation. "Inspectable control record" is a safer term than "explanation."

The page also illustrates how quickly the ecosystem changes. It lists BeeAI and LangGraph as frameworks with preconfigured ReAct modules. Current BeeAI documentation says its ReAct agent is no longer actively supported and recommends its rule-oriented Requirement Agent. LangGraph's `create_react_agent` is now deprecated in favor of the generic `create_agent` factory. ([BeeAI Framework](https://framework.beeai.dev/modules/agents "Agents - BeeAI Framework"))

## 5. What frameworks actually retain from ReAct

### LangChain and LangGraph


Classic LangChain implemented the paper's visible protocol directly:

```text
Thought
Action
Action Input
Observation
...
Final Answer
```


It used a scratchpad and a text parser, closely matching the paper. LangChain now labels that implementation as older and unsuitable for production. ([LangChain Reference Docs](https://reference.langchain.com/python/langchain-classic/agents/react/agent/create_react_agent "create_react_agent | langchain_classic | LangChain Reference"))

The later LangGraph `create_react_agent` means something broader and thinner: call the model, execute any structured tool calls, append the tool responses, and repeat until the model emits no more tool calls. Explicit natural-language "Thought" output is not required. The implementation therefore preserves the iterative model-tool loop while potentially dropping the original paper's defining verbal reasoning channel. It is now being replaced by the generic `create_agent` abstraction. ([LangChain Reference Docs](https://reference.langchain.com/python/langgraph.prebuilt/chat_agent_executor/create_react_agent "create_react_agent | langgraph.prebuilt | LangChain Reference"))

This is a major semantic shift:

> In current LangChain terminology, "ReAct" increasingly means "tool calling in a loop," even when no explicit ReAct thought trace exists.

### LlamaIndex


The classic LlamaIndex `ReActAgent` stays close to the surface protocol. Its system prompt explicitly requires `Thought`, `Action`, JSON `Action Input`, `Observation`, repetition, and a final answer. ([Developer Documentation](https://docs.llamaindex.ai/en/v0.10.17/examples/agent/react_agent.html "ReAct Agent - A Simple Intro with Calculator Tools - LlamaIndex 🦙 v0.10.17"))

LlamaIndex adds engineering layers outside the original proposal:

- an agent runner;
- task and step objects;
- conversational memory;
- controllable step execution;
- structured final outputs;
- multi-agent workflows.

Those are framework architecture decisions, not consequences of the ReAct algorithm itself. ([Developer Documentation](https://docs.llamaindex.ai/en/v0.10.20/examples/agent/agent_runner/agent_runner.html "Step-wise, Controllable Agents - LlamaIndex 🦙 v0.10.20.post1"))

### DSPy


DSPy retains the iterative reasoning and tool-selection loop but turns ReAct into a typed module that can operate over an arbitrary input/output signature. It also places ReAct inside a system for optimizing instructions, demonstrations, and model parameters against a metric. ([DSPy](https://dspy.ai/ "DSPy"))

DSPy therefore takes:

- iterative tool choice;
- trajectory accumulation;
- a finish decision.

It adds:

- typed contracts;
- compositional modules;
- automatic prompt and demonstration optimization.

This begins to address one weakness of the original work: the paper manually constructs demonstrations and provides limited methods for systematically improving them.

### Hugging Face smolagents


Smolagents describes its common `MultiStepAgent` as an abstraction of ReAct. It stores previous steps in agent memory, invokes a model, parses an action, executes it, records the result, and repeats. ([Hugging Face](https://huggingface.co/docs/smolagents/main/conceptual_guides/react "How do multi-step agents work? · Hugging Face"))

It extends the action representation:

- `ToolCallingAgent` emits JSON tool calls.
- `CodeAgent` emits executable code.
- An optional planning step can periodically revise a plan.
- Callbacks and explicit step records provide operational hooks.

Here ReAct has become a generic multistep execution skeleton. The original distinction between language thoughts and environment actions is retained conceptually, but the action language may now be Python code.

### AutoGen


AutoGen 0.2 treated ReAct as one prompting and reasoning strategy among several. ([Microsoft GitHub](https://microsoft.github.io/autogen/0.2/docs/topics/prompting-and-reasoning/react "ReAct | AutoGen 0.2"))

The current AutoGen architecture centers on event-driven, asynchronous single-agent and multi-agent systems, conversations, tools, runtimes, and orchestration. ReAct is no longer the primary architectural abstraction. ([Microsoft GitHub](https://microsoft.github.io/autogen/ "AutoGen -- AutoGen"))

### BeeAI


BeeAI wrapped ReAct in production-oriented machinery such as memory management, validation, retries, timeouts, event emission, and error handling. Its current documentation says the ReAct and tool-calling agents will not be actively supported; its Requirement Agent is recommended for production reliability through declarative rules and constraints. ([BeeAI Framework](https://framework.beeai.dev/modules/agents "Agents - BeeAI Framework"))

That transition is informative. It suggests that a free-form ReAct loop alone is insufficient when an application needs predictable behavior and enforceable constraints.

## 6. The main research direction


Raw ReAct uses one transcript as:

- observation history;
- belief state;
- plan;
- working memory;
- execution log;
- error record;
- explanation.

Separating these roles is the highest-value direction.

|ReAct component to strengthen|Foundation to reintroduce|Expected effect|
|---|---|---|
|Transcript-only state|Explicit belief or world state with provenance and confidence|Fewer contradictions and false assumptions|
|Improvised text planning|Hierarchical plans, plan libraries, or options|Better long-horizon behavior and plan reuse|
|Tool descriptions|Typed operators with preconditions, effects, cost, risk, and permissions|Better tool selection and safer execution|
|Informal progress tracking|Execution monitor with invariants and success conditions|Earlier detection of loops and failed actions|
|Free-form recovery|Plan repair and predefined recovery policies|More reliable handling of tool and environment failures|
|Fixed or model-chosen reasoning|Metacontroller estimating the value and cost of further reasoning|Lower latency and token use|
|Context-window memory|Separate working, episodic, and semantic memory|Better persistence without uncontrolled context growth|
|No runtime learning|Learning from successful and failed trajectories|Improvement across runs|
|Verbal trace as explanation|Independent evidence, state transitions, and decision records|More defensible auditability|
|Unrestricted action execution|Policy constraints, validation, approval, sandboxing, and rollback|Production safety|

A useful experimental comparison would contain at least four systems:

1. Raw ReAct with transcript state.
2. ReAct with an explicit structured belief state.
3. A planner-executor-monitor architecture using the same LLM.
4. A hierarchical or BDI-inspired architecture with reusable plans and explicit recovery conditions.

Evaluation should include more than final success rate:

- repeated-action and loop frequency;
- recovery after tool errors;
- number and cost of tool calls;
- state consistency;
- plan completion accuracy;
- performance under partial observability;
- adaptation when the environment changes;
- calibration of stopping and escalation;
- transfer to new tools and domains;
- safety-policy violations.

The working conclusion is that **ReAct's enduring contribution is an accessible LLM interface pattern, not a new foundation for agency**. The research opportunity is to retain the LLM's flexible language and generalization while restoring explicit state, planning, execution monitoring, metareasoning, learning, and constraints from earlier agent research.

## Library sources


- [Kotseruba and Tsotsos 2020](/sources/dbc8fc8d10a0d4d51a43964e61c1482f.bin), *40 years of cognitive architectures* ([doi:10.1007/s10462-018-9646-y](https://doi.org/10.1007/s10462-018-9646-y))
- [Sumers et al. 2024](/sources/979eab1fc41b7066edf51770802bf09d.bin), *Cognitive Architectures for Language Agents*
- [Russell and Norvig 2021](/sources/c85f4853f67516e521a455cdea6aeedc.bin), *Artificial Intelligence: A Modern Approach*

Further reading:

- [Wang et al. 2025](/sources/cb48f7baea27f4113b0eee960eea5e7d.bin), *An Empirical Study of Agent Developer Practices in AI Agent Frameworks* ([arXiv:2512.01939](https://arxiv.org/abs/2512.01939))
- [Nolte et al. 2026](/sources/2af58406e13e42072bca886ec3caf534.bin), *How metacognitive architectures remember their own thoughts* ([doi:10.1007/s10462-026-11669-5](https://doi.org/10.1007/s10462-026-11669-5))
- [Ziemke 2022](/sources/bf0e49a2d28a89a0aa37ddf742e607eb.bin), *Embodiment in Cognitive Science and Robotics*
- [Gridin 2025](/sources/d3c6541360ebf22d3d114faaa20960fe.bin), *The Practical Guide to Large Language Models* ([doi:10.1007/979-8-8688-2216-2](https://doi.org/10.1007/979-8-8688-2216-2))
- *An Illustrated Guide to AI Agents*, *O'Reilly early release, chapter 6* -- ReAct by prompting, supervised fine-tuning and reinforcement learning, and reflection methods such as Self-Refine and Reflexion
