---
draft: false
toc: true
title: "AI System Components and Architectural Patterns"
description: "The parts an AI system is built from, how an architecture grows from a single model call, and the common architectural patterns, from RAG and workflows to agents."
linkTitle: "Components and Patterns"
---

An AI system is more than its model. This note lists the kinds of components a system is built from, how an architecture usually grows, and the common architectural patterns.

## Component


A **component** is an identifiable part of the AI system that has a responsibility and interacts with other parts through an interface.

Where the system's boundary lies depends on the question. A product evaluation may treat a model, a tool, and a backend as one configured system, and a technical investigation may examine each one separately.

## Kinds of components


|Group|What it does|Examples|
|---|---|---|
|Application and interaction|Exposes AI-supported behavior to users or other systems|User interfaces, APIs, backend services, client applications, messaging interfaces, event consumers|
|Orchestration and control|Manages execution flow, state transitions, routing, planning, retries, human approvals, and task coordination|Workflow engines, agent runtimes, routers, planners, state machines, schedulers, conversation managers|
|Model and inference|Performs learned inference|Language models, embedding models, classifiers, rerankers, multimodal, speech, vision, and moderation models, model gateways, inference services|
|Context, knowledge, and memory|Stores, retrieves, assembles, and manages the information given to AI operations|Search and retrieval services, vector stores, document stores, knowledge graphs, context builders, conversation stores, session and long-term memory|
|Tools and integrations|Lets the system observe or change external environments|Read tools, write tools, code-execution environments, external APIs, browser automation, database tools, communication tools, tools for asking a person|
|Data and processing|Prepares data for retrieval, inference, evaluation, or training|Ingestion pipelines, parsers, chunkers, transformation services, labeling systems, feature and indexing pipelines|
|Safety, security, and governance|Enforces system constraints and organizational controls|Identity and access management, permission enforcement, policy engines, content filters, guardrails, secrets management, audit systems, approval gates, privacy controls|
|Observability and embedded measurement|Records or measures how the system operates|Logs, traces, metrics, instrumentation, monitoring, cost controls, runtime quality checks|
|Infrastructure and runtime|Provides the execution environment|Compute platforms, model serving, queues, caches, storage, container runtimes, deployment systems, configuration services|

Some evaluation code runs within or beside the AI system, such as a runtime quality check. Evaluation as a whole also includes cases, samples, datasets, evaluators, reviewers, analysis, and decision records outside the system, so it can't be reduced to the observability components.

## How an architecture grows


Huyen describes an architecture that teams build up step by step. It starts from the simplest form: the application sends a query to a model, through a third-party API or a self-hosted model, and returns the response. Components are then added as needs arise ([Huyen 2025](#huyen-2025)):

1. **Enhance context.** Retrieval over text, images, or tables, and tools such as web search, give the model the information it needs for each query. Huyen compares building context to feature engineering for foundation models.
2. **Put in guardrails.** Input guardrails protect against leaking private information to external APIs and against prompts that compromise the system. Output guardrails check what the model returns before it reaches the user.
3. **Add a model router and a gateway.** A router, often an intent classifier, sends each query to the model or path that suits it, such as a specialized model, a cheaper model, or a human operator. A gateway gives one secure interface to all the models, so a change in one provider's API is fixed in one place.
4. **Reduce latency with caches.** An exact cache reuses a result only for the same request. A semantic cache reuses a result for a similar request.
5. **Add agent patterns.** The flow gains loops, parallel steps, and conditional branches, such as feeding a response back for another retrieval. Write actions, such as sending an email or placing an order, let the system change its environment, and add much more risk.

Monitoring and observability belong in the design from the start, and an orchestrator defines the components and chains them into one pipeline. Each added component adds ways to fail and makes the system harder to debug. ([Huyen 2025](#huyen-2025))

## Architectural patterns


An AI system may use several of these patterns at once:

- **Model-based pipeline:** fixed steps, each calling a model, such as extracting text from a document and then extracting a field from the text.
- **Retrieval-augmented generation (RAG):** the system retrieves documents or data and gives them to the model with the query.
- **Workflow-based system:** LLMs and tools follow code paths defined in advance. ([Anthropic 2024](#anthropic-2024-agents))
- **Tool-calling system:** the model chooses and calls tools, such as search, databases, or APIs, and reads their results.
- **Agentic system:** the LLM directs its own process and tool use, and decides the next action from the current state and what it has gathered so far. ([Anthropic 2024](#anthropic-2024-agents); [Shankar and Husain 2026](#shankar-2026))
- **Multimodal system:** the system takes or produces images, audio, or video as well as text.
- **Hybrid system:** a combination of the patterns above.

These are architectural patterns, not exclusive project types. A real system is often hybrid, combining backend services, workflows, agents, models, retrieval, tools, state, and controls.

## Components and evaluation


A failure in a multi-step system can start in any component. Huyen evaluates both the final output and each component's intermediate output: if an application extracts text from a PDF and then extracts the current employer from the text, a wrong employer can come from either step. ([Huyen 2025](#huyen-2025)) Error analysis reads the whole trace for the same reason, to find the step where a problem starts. ([Shankar and Husain 2026](#shankar-2026)) See [Traces and executions]({{< ref "ai-engineering/concepts/evaluation/traces-and-executions" >}}).

## References


- Anthropic (2024). [Building effective agents](https://www.anthropic.com/research/building-effective-agents). ^anthropic-2024-agents
- Huyen, C. (2025). [AI Engineering: Building Applications with Foundation Models](/sources/faff32abd78cc0963d6a4a913c8c129e.bin), chapters 4 and 10. O'Reilly. ^huyen-2025
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapter 3. O'Reilly. ^shankar-2026
