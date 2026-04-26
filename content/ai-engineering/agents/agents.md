---
draft: false
toc: true
title: "Agents"
linkTitle: "Agents"
---
<https://en.wikipedia.org/wiki/Intelligent_agent>

<https://en.wikipedia.org/wiki/Agentic_AI>

<https://www.quantamagazine.org/why-artificial-intelligence-like-alphazero-has-trouble-with-the-real-world-20180221/>

poole, <https://artint.info/3e/html/ArtInt3e.html>

focus more on **LLM-driven workflows that operate like services**: plan, call tools, read/write data, and coordinate with other agents and humans.

<https://a16z.com/podcast/what-is-an-ai-agent-2/>

https://www.anthropic.com/engineering/building-effective-agents read this

has several useful principles

# Principles

## The Simplicity-First Principle


The most successful LLM-based systems in production -- across coding agents, customer support automation, and domain-specific workflows -- share a counterintuitive constraint: they start with the simplest effective solution and add complexity only when data proves necessity. A single, well-optimized LLM call with retrieval often outperforms complex multi-step systems in latency, cost, and maintainability.

# Key Concepts


Key concepts to understand well:

- **Tool / function calling** (OpenAI "tools", others' "functions"):
	- Encoding tools in JSON schema.
	- Letting the model choose which tool to call and with what args.
	- Executing tools, feeding results back, loop until done. [developers.openai.com+1](https://developers.openai.com/tracks/building-agents/
- **Agentic workflows**:
	- Plan -> act -> observe -> revise plan.
	- ReAct, Plan-and-Execute, Decompose-and-Solve patterns.
- **Multi-Agent Framework. Multi-Agent Systems**

# Interesting Topics


**The Actual Now (2025):** State Machines. You build a graph where nodes are actions (LLM calls, tools) and edges are conditional logic.

- _Concept to master:_ **Cycles.** If an agent generates code, the next node runs a unit test. If the test fails, the graph _loops back_ to the generation node with the error message as context. This "self-correction loop" is the definition of agentic behavior in 2025.

**long-term memory**

We are building **deterministic state machines** where the transitions _are probabilistic_. The focus has shifted to **'Flow Engineering'** (controlling the graph) and 'Context Engineering'"

**Agent Marketplaces**. Platforms like Microsoft Copilot Studio, Hugging Face Agents, and Salesforce Agentforce allow enterprises _to buy and deploy pre-built_, _domain-specific_ agents (e.g., "Supply Chain Optimizer," "HR Onboarding Assistant") rather than building them from scratch. This commoditization of agency is accelerating adoption among Small and Medium-sized Businesses (SMBs) who lack the resources to train custom models.

# Ecosystem


agentic frameworks

<https://github.com/microsoft/agent-framework>

# Resources


courses

<https://coursehunter.net/course/sozdanie-ai-agenta-s-nulya-v2>

# Production Engineering


**State Management:** Learn how to persist the "Memory" (conversation history + current variables) in a database (Postgres/Redis), not just in-memory.

**Observability.**

**Evals (Evaluation):** How do you know your agent is working?

**What to learn / do**

For Python and a limited attention budget I'd go:

1. **LangGraph**: treat it as your primary "agentic runtime".
2. **One multi-agent framework**: AutoGen or CrewAI / Swarm.
3. **One data-first stack**: LlamaIndex for more complex retrieval/agent-over-data flows.

# Topics to Sort

## 3. Tooling & routing: how agents pick and call tools


This is one of the most "active" areas right now.

Important ideas:

- **Tool routing**: selecting which tool (or sub-agent) to invoke given the user's goal.
- **Argument construction**: turning unstructured prompts into valid, typed parameters.
- **Multi-step tool workflows**: agents chaining API calls, DB queries, file operations, etc.

There's a lot of fresh material around tool strategies:

- 2025 "How tools are called in AI agents" guide breaks down patterns: direct tool calling, planners, routers, and orchestration loops. ([Medium](https://medium.com/%40sayalisureshkumbhar/how-tools-are-called-in-ai-agents-complete-2025-guide-with-examples-42dcdfe6ba38 "How Tools Are Called in AI Agents: Complete 2025 Guide ..."))

What to practice:

- Define a realistic tool set around a domain (e.g., ticketing, billing, internal APIs).
- Implement:
	- A **router agent** deciding which tool to use.
	- A **planner agent** that writes a plan as a sequence of tool calls.
	- An **executor** that actually calls tools and handles failures.

## 4. Memory, retrieval, and knowledge integration


Almost all serious agents are **grounded** in org-specific data:

- Vector/semantic search + RAG (classic pattern).
- Structured knowledge (SQL, knowledge graphs, document stores).
- Long-lived memory (per-user or per-process).

What's current:

- Agentic workflows are often **RAG-first**: plan -> retrieve -> reason -> act. ([weaviate.io](https://weaviate.io/blog/what-are-agentic-workflows "What Are Agentic Workflows Patterns, Use Cases, ..."))
- Frameworks like LlamaIndex and LangChain offer composable retrieval "nodes" and agent-over-documents patterns. ([TechAhead](https://www.techaheadcorp.com/blog/top-agent-frameworks/ "LangChain vs LlamaIndex vs AutoGen vs CrewAI"))

What to learn:

- At least one vector DB or embedding store (pgvector, Weaviate, Qdrant, Chroma).
- Designing retrieval pipelines:
	- Chunking strategies, hybrid search, metadata filtering.
	- Query rewriting / sub-question decomposition via the LLM.
- How to **instrument retrieval quality** (hit rate, groundedness, citations).

## 5. Multi-agent systems & orchestration


Where research hype and real deployments are meeting:

- Multi-role setups: planner, solver, critic, data-retriever, tool-router.
- Agent "teams" that parallelize work or specialize per domain. ([getstream.io](https://getstream.io/blog/multiagent-ai-frameworks/ "Best 5 Frameworks To Build Multi-Agent AI Applications"))
- Enterprises are building **end-to-end process agents** for things like onboarding, legal review, supply-chain steps. ([Business Insider](https://www.businessinsider.com/bny-ai-boost-google-gemini-3-agentic-ai-system-eliza-2025-12 "BNY and Google are teaming up to supercharge the bank's AI ambitions with Gemini 3"))

What to learn:

- Coordination patterns:
	- Round-robin conversations.
	- Blackboard / shared state store.
	- Directed graph execution (LangGraph-style).
- Failure modes:
	- Loops, deadlocks, agents fighting each other.
	- Cost explosions and redundancy.
- When a **single, well-tooled agent** is enough vs when multi-agent is justified.

## 6. Reliability, security & governance (very "hot" right now)


As soon as agents operate on real systems, this becomes central:

- **Hallucinations & unsafe actions**:
	- OS-level agents (e.g., Windows 11 agent) have already shown security risks like prompt injection from documents causing unwanted system actions. ([PC Gamer](https://www.pcgamer.com/software/windows/microsoft-confirms-that-its-new-ai-agent-in-windows-11-hallucinates-like-every-other-chatbot-and-poses-security-risks-to-users/ "Microsoft confirms that its new AI agent in Windows 11 hallucinates like every other chatbot and poses security risks to users"))
- **Prompt injection & data exfiltration**:
	- Documents, web pages, or tools can contain adversarial instructions.
- **Guardrails for tools**:
	- Human-in-the-loop checkpoints for high-impact actions.
	- Policy engines (what tools are allowed under what conditions).

What to learn:

- Design patterns from OpenAI's agent guides (safe tool design, confirmation prompts, sandboxing). ([OpenAI CDN](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf "A practical guide to building agents"))
- Industry guidance on "agentic AI in the enterprise" (McKinsey, Snowflake/Anthropic, Box, etc.) for how companies actually shape governance and data boundaries. ([McKinsey  Company](https://www.mckinsey.com/capabilities/quantumblack/our-insights/seizing-the-agentic-ai-advantage "Seizing the agentic AI advantage"))

## 7. Evaluation, observability, and cost/performance


Agents are long-running, stochastic workflows. People are standardizing around:

- **Traces + spans** (OpenTelemetry-style thinking).
- **Offline eval**:
	- Task success rate.
	- Over-/under-tooling.
	- Latency and cost breakdown per step.
- **Online eval / guardrails**:
	- A "judge" model grading actions, outputs, or policy compliance.

Also very current: **Small Language Models (SLMs)** for agents:

- Recent work argues SLMs can often replace big LLMs inside agents for many steps, with large cost and latency benefits, and suggests heterogeneous systems where a larger model mostly orchestrates. ([arXiv](https://arxiv.org/pdf/2506.02153 "Small Language Models are the Future of Agentic AI"))

What to learn:

- How to log and replay traces (your framework may already support this).
- How to set up judge-model evaluations and simple success metrics.
- Patterns for mixing:
	- A large "brain" model (planning, decomposition).
	- Smaller SLMs for routine tools, classification, routing. ([arXiv](https://arxiv.org/pdf/2506.02153 "Small Language Models are the Future of Agentic AI"))

## 8. A concrete learning path (summary)


If you want an ordered plan:

1. **Mechanics**
	- Tool/function calling, streaming, structured outputs using OpenAI docs + cookbook. ([developers.openai.com](https://developers.openai.com/tracks/building-agents/ "Building agents"))
2. **Agent patterns**
	- Read 1-2 good overviews (OpenAI's agents PDF, Weaviate's agentic workflows, an "agentic AI landscape" paper). ([OpenAI CDN](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf "A practical guide to building agents"))
3. **Framework depth**
	- Pick LangGraph + one multi-agent framework (AutoGen / CrewAI / Swarm). Build:
		- A planner/executor agent over your own APIs.
		- An agent-over-documents with RAG + tools.
4. **Production pillars**
	- Add tracing, eval, simple guardrails.
	- Experiment with one SLM + one larger model in the same system. ([arXiv](https://arxiv.org/pdf/2506.02153 "Small Language Models are the Future of Agentic AI"))
5. **Security & governance**
	- Study a couple of concrete incident/concern write-ups (Windows agent risks, enterprise governance pieces) and bake mitigations into your designs from day one. ([PC Gamer](https://www.pcgamer.com/software/windows/microsoft-confirms-that-its-new-ai-agent-in-windows-11-hallucinates-like-every-other-chatbot-and-poses-security-risks-to-users/ "Microsoft confirms that its new AI agent in Windows 11 hallucinates like every other chatbot and poses security risks to users"))

## 9. Project ideas to make this "stick"


All scoped so you can implement fairly quickly in Python:

- **Agentic ticket triage**
    Agent that:
	- Reads tickets from an issue tracker.
	- Classifies & routes them.
	- Proposes responses and code pointers.
	- Escalates uncertain cases to a human.
- **Data-ops agent**
    Agent that:
	- Plans multi-step SQL queries over your warehouse.
	- Calls tools to run queries, generate charts, and summarize findings.
	- Uses a judge model to check for obvious data mistakes.
- **Document-workflow agent**
    For contracts / specs:
	- Retrieve relevant docs.
	- Extract key fields, check for policy violations.
	- Suggest redlines and generate a summary for humans.

Each of these will force you to touch: tools, RAG, planning, evaluation, and at least some minimal security thinking.

If you tell me your current stack (cloud, vector store, which LLM APIs you already use), I can turn this into a very specific tech stack + repo structure to start with.

# Problems


"The skill most candidates miss is "diagnostic intuition" - the knack for quickly figuring out why an AI agent just did something weird" #todo so we can design and implement beforehand some mechanismp make easier our job and prevent this behaviour
