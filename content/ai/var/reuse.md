---
draft: false
toc: true
description: "A proposed enterprise AI platform decomposition and dependency-based build order, starting with gateway, SDK, tracing, prompt versions, and policy before retrieval and agent runtimes."
title: "Reuse"
linkTitle: "Reuse"
---

Platform components include libraries, SDKs, frameworks, and services.

Connect this with AI design through modularity and APIs. #todo Identify the remaining design connections.

<a id="platform-primitives-set"></a>

# Platform primitives


A pragmatic reusable AI platform should be built as **shared platform primitives**, not as one monolithic "AI service." The following structure separates the shared capabilities.

Cloud guidance from AWS, Google, Microsoft, and OpenAI currently points in the same direction: production AI systems benefit from modular services, an AI gateway, RAG infrastructure, tool/function calling, evaluation, observability, and security controls. AWS explicitly recommends decomposing generative AI applications into reusable microservices and centralizing control through AI gateways; OpenAI documents retrieval via vector stores and function calling for external system access; Google publishes reference architectures for RAG, multi-agent systems, and GenAI security; Microsoft documents RAG-specific evaluators for groundedness, relevance, and completeness. ([AWS Documentation](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/preprod-architecting.html?utm_source=chatgpt.com "Architecting generative AI applications for production"))

## Proposed reusable components


|Layer|Component|Purpose|
|---|---|---|
|Access|**AI Gateway**|Single entry point for all LLM calls: auth, routing, rate limits, budget controls, retries, streaming, logging, tenant isolation, provider abstraction.|
|Access|**Model Router**|Chooses model/provider based on latency, cost, quality, safety tier, context length, modality, region, and fallback policy.|
|Access|**Model Catalog**|Registry of approved models with metadata: capabilities, context window, tool support, cost, data policy, benchmark scores, deployment status.|
|Prompting|**Prompt Registry**|Versioned prompt templates, system instructions, schema contracts, changelogs, owners, approval workflow, environment promotion.|
|Prompting|**Structured Output Service**|JSON schema enforcement, validation, repair, canonical error handling, and typed SDK bindings.|
|Retrieval|**Knowledge Ingestion Pipeline**|Connectors, document parsing, chunking, metadata extraction, ACL mapping, embeddings, indexing, reindexing, lineage.|
|Retrieval|**Retrieval Service**|Hybrid search, vector search, reranking, query rewriting, citation assembly, context packing, access-control filtering.|
|Retrieval|**Knowledge Registry**|Catalog of approved knowledge sources, freshness SLAs, owners, sensitivity classification, index versions.|
|Agents|**Tool Registry**|Standard catalog of callable tools/APIs with schemas, auth scopes, rate limits, side-effect classification, and audit policy.|
|Agents|**Agent Runtime**|Planning, tool execution, state handling, memory policy, human escalation, max-step controls, timeouts, compensation logic.|
|Agents|**Workflow Orchestrator**|Deterministic orchestration around AI calls: queues, retries, durable state, approvals, eventing, idempotency.|
|Safety|**Guardrail Service**|Input/output moderation, prompt-injection detection, PII redaction, jailbreak checks, policy enforcement, unsafe-action blocking.|
|Safety|**Policy Engine**|Centralized rules for what models, tools, data, and actions are allowed by tenant, user role, region, and use case.|
|Evaluation|**Evaluation Harness**|Offline evals, regression suites, golden datasets, RAG evals, agent trajectory evals, prompt/model comparison.|
|Evaluation|**Human Review Console**|Sampling, annotation, adjudication, feedback capture, escalation review, quality labeling.|
|Observability|**AI Observability Stack**|Traces, prompts, completions, tool calls, retrieved chunks, token usage, latency, cost, safety events, feedback.|
|Operations|**Cost & Quota Manager**|Budgets, chargeback/showback, token accounting, provider spend, per-app quotas, anomaly detection.|
|Operations|**Experimentation Service**|A/B tests, model rollouts, prompt canaries, traffic splitting, rollback, metric comparison.|
|Operations|**Audit & Compliance Ledger**|Immutable record of model calls, prompts, retrieved data, tools invoked, user identity, policy decisions, approvals.|
|Developer Experience|**AI SDKs**|Internal SDKs for common flows: generate, stream, embed, retrieve, call tools, evaluate, log traces.|
|Developer Experience|**Application Blueprints**|Reusable reference apps: chatbot, RAG assistant, document extractor, support copilot, code assistant, agent workflow.|
|Developer Experience|**Playground & Debugger**|Prompt testing, context inspection, retrieval debugging, trace replay, schema validation, cost estimate.|

## Reference architecture

```text
Applications
  └── Internal AI SDK / REST API
        └── AI Gateway
              ├── AuthN/AuthZ, quotas, policy checks
              ├── Model Router
              │     ├── OpenAI / Azure OpenAI / Anthropic / Gemini / local models
              │     └── fallback + cost/latency routing
              ├── Prompt Registry
              ├── Retrieval Service
              │     ├── Knowledge Registry
              │     ├── Vector / hybrid indexes
              │     └── source ACLs + citations
              ├── Tool Registry
              │     └── enterprise APIs, SaaS connectors, DB actions
              ├── Guardrail Service
              ├── Evaluation Harness
              └── Observability + Audit + Cost Ledger
```

## Most important reusable primitives


Start with these first:

1. **AI Gateway**
    This becomes the control plane for model access. Every application should go through it. It should support provider abstraction, model routing, retries, streaming, quota enforcement, policy hooks, request logging, and cost attribution.
2. **Retrieval Service**
    Most enterprise AI use cases depend on internal knowledge. A reusable RAG layer should handle ingestion, chunking, embeddings, hybrid retrieval, reranking, context packing, citation generation, freshness checks, and document-level ACLs.
3. **Prompt Registry**
    Prompts should be treated like deployable artifacts. Version them, attach owners, test them, promote them across environments, and link each production response to the exact prompt version used.
4. **Tool Registry**
    For agents, every tool should have a schema, auth scope, side-effect classification, timeout, idempotency policy, audit behavior, and human-approval requirement when needed.
5. **Evaluation Harness**
    Build regression testing into the platform. Track quality across prompt changes, model upgrades, retrieval changes, and tool changes. Include task success, groundedness, hallucination rate, latency, cost, refusal quality, and safety violations.
6. **Observability Stack**
    Standard application telemetry is insufficient for AI systems. Traces need to include prompt versions, model versions, tool calls, retrieved context, token counts, latency, cost, safety decisions, user feedback, and evaluator outputs.
7. **Guardrail and Policy Layer**
    Centralize moderation, PII handling, prompt-injection checks, data-boundary rules, unsafe tool-use prevention, and escalation logic.

## Suggested build sequence


For an MVP platform, build in this order:

1. **AI Gateway + Model Catalog**
2. **Prompt Registry**
3. **Observability + Cost Tracking**
4. **RAG Ingestion + Retrieval Service**
5. **Guardrails + Policy Engine**
6. **Evaluation Harness**
7. **Tool Registry + Agent Runtime**
8. **Developer Playground + SDKs**
9. **Human Review + Audit Console**
10. **Blueprints for common app patterns**

The first four components give teams immediate reuse. The safety, evaluation, and agent layers should follow before broad production rollout.

## Clean component boundary


Avoid putting business logic directly into the AI platform. The platform should provide reusable capabilities:

```text
Good platform responsibility:
- model access
- retrieval
- prompt management
- tool execution framework
- evaluation
- logging
- governance
- cost control

Application responsibility:
- domain workflow
- business rules
- UX
- user-specific state
- product-specific success metrics
```

## Minimal MVP interface


A useful initial API surface could be:

```http
POST /ai/generate
POST /ai/stream
POST /ai/embed
POST /ai/retrieve
POST /ai/rag
POST /ai/tools/execute
POST /ai/evaluate
GET  /ai/traces/{trace_id}
GET  /ai/models
GET  /ai/prompts/{name}/versions
```


And the internal SDK should expose something closer to:

```ts
ai.generate(...)
ai.stream(...)
ai.retrieve(...)
ai.rag(...)
ai.runTool(...)
ai.evaluate(...)
ai.trace(...)
```

## Recommendation


A proposed reusable enterprise AI platform has **seven core products**:

1. **AI Gateway**
2. **Knowledge/RAG Platform**
3. **Prompt & Model Registry**
4. **Tool/Agent Runtime**
5. **Guardrails & Policy Engine**
6. **Evaluation & Observability Platform**
7. **Developer SDKs and Blueprints**

That gives application teams a standard path to build AI features while preserving centralized control over cost, quality, security, and compliance.

<a id="build-additional"></a>

# Additional build-sequence proposal


A proposed build sequence is:

```text
1. AI Gateway + thin internal SDK
2. Observability, audit, and cost tracking
3. Prompt registry + structured output support
4. Guardrails and basic policy enforcement
5. Retrieval/RAG platform
6. Evaluation harness
7. Tool registry
8. Workflow/agent runtime
9. Human review console
10. Experimentation, advanced routing, and optimization
```


The reasoning is dependency-driven.

## 1. AI Gateway + thin internal SDK


Build this first.

This is the choke point through which all AI usage flows. Without it, teams will call model APIs directly, and later consolidation must unwind duplicated auth, logging, retry, cost, safety, and provider-selection logic.

Minimum useful version:

```text
- Unified API for chat/generate/stream/embed
- Provider abstraction
- AuthN/AuthZ hooks
- Request/response logging hooks
- Rate limiting
- Basic fallback support
- Token and cost accounting
- App/team/user attribution
- Thin TypeScript/Python SDK
```


Avoid making the first gateway overly clever. The initial goal is **standardization**, not advanced routing.

## 2. Observability, audit, and cost tracking


Build this alongside the gateway, not later.

AI incidents are hard to debug without prompt, model, retrieval, tool, and output traces. Cost also becomes hard to attribute retroactively.

Minimum useful version:

```text
- Trace ID per AI request
- Prompt version used
- Model/provider used
- Latency
- Token usage
- Estimated cost
- Caller app/team/user
- Errors and retries
- Safety decisions
- Optional sampled request/response storage
```


This should exist before multiple teams start building on the platform.

## 3. Prompt registry + structured output support


Build this early because prompts become production artifacts.

Minimum useful version:

```text
- Versioned prompt templates
- Environment promotion: dev → staging → prod
- Prompt ownership
- Template variables
- JSON schema support
- Output validation and repair
- Changelog
```


This enables repeatability. Without it, production behavior depends on prompts embedded inside application code.

Structured output support is especially important for extraction, classification, routing, and workflow use cases.

## 4. Guardrails and basic policy enforcement


Build a basic version early.

An initial policy engine needs enough centralized enforcement to prevent every app team from inventing its own safety layer.

Minimum useful version:

```text
- PII detection/redaction policy
- Input/output moderation hooks
- Prompt-injection detection for RAG inputs
- Data classification checks
- Tenant/user/app-level allowlists
- Block/warn/escalate decision model
- Audit log of policy decisions
```


This should be integrated into the gateway so enforcement is central.

## 5. Retrieval/RAG platform


Build this after the gateway, tracing, and policy hooks are available.

RAG usually becomes the first high-value platform capability because many enterprise use cases require internal knowledge access.

Minimum useful version:

```text
- Document ingestion
- Parsing
- Chunking
- Embeddings
- Metadata extraction
- Vector + keyword search
- Reranking
- ACL-aware retrieval
- Citation assembly
- Index freshness metadata
```


Important: do not start with a generic "upload anything" knowledge platform. Start with two or three known source types, for example:

```text
- Google Drive / SharePoint / Confluence
- PDFs and docs
- Internal help-center or policy content
```


The hard part is usually permissions, freshness, and source quality, not vector search itself.

## 6. Evaluation harness


Build this before broad rollout.

Evaluation becomes more important as prompt versions, retrieval versions, and model choices change over time.

Minimum useful version:

```text
- Golden datasets
- Prompt regression tests
- Model comparison
- RAG groundedness checks
- Citation correctness checks
- Structured output validity
- Latency/cost metrics
- Human review labels
```


The key is to make every production change testable:

```text
prompt change
model change
retrieval change
chunking change
reranker change
tool schema change
```


All of those should be evaluable before deployment.

## 7. Tool registry


Build this before building agents.

A tool registry provides controlled access to enterprise systems. Each tool should have a schema, owner, auth model, side-effect classification, and audit policy.

Minimum useful version:

```text
- Tool name and description
- JSON schema
- Auth scopes
- Timeout
- Rate limit
- Read/write classification
- Idempotency metadata
- Human-approval requirement
- Audit behavior
```


Example classifications:

```text
safe/read-only:
- search tickets
- fetch customer profile
- retrieve policy document

sensitive/read:
- read email
- read CRM notes
- read payroll record

write/side-effecting:
- send email
- update ticket
- issue refund
- create calendar event
```


Do not expose arbitrary internal APIs directly to LLMs.

## 8. Workflow/agent runtime


Build this after the tool registry.

The agent runtime should depend on the gateway, tool registry, policy engine, observability, and evaluation harness.

Minimum useful version:

```text
- Tool-calling loop
- Max-step limits
- Timeouts
- State management
- Human approval gates
- Durable execution for long-running workflows
- Replayable traces
- Failure handling
- Compensation hooks
```


Build agents for specific workflows first, not as a general autonomous agent platform.

Good first use cases:

```text
- Support ticket triage
- Sales research summary
- Internal policy assistant
- Document intake and extraction
- Draft generation with human approval
```


Avoid starting with open-ended agents that can call many tools across many systems.

## 9. Human review console


Build this when review volume justifies it.

Initially, feedback can be captured through logs, thumbs up/down, annotations in spreadsheets, or lightweight internal tooling. A full review console is valuable once there is enough traffic and enough risk.

Useful capabilities:

```text
- Sampling queue
- Reviewer assignment
- Labeling
- Escalation review
- Side-by-side model comparison
- Safety incident review
- Feedback export into eval datasets
```


This becomes more important for regulated, customer-facing, or high-risk workflows.

## 10. Experimentation, advanced routing, and optimization


Build this later.

These capabilities are useful, but they depend on earlier layers being mature.

Examples:

```text
- A/B prompt tests
- Multi-model routing
- Latency/cost-aware routing
- Canary deployments
- Automated fallback
- Cache optimization
- Semantic response caching
- Fine-tuning workflows
```


Advanced routing is premature without solid observability and evaluation. Otherwise, optimization lacks reliable measurement.

# Recommended MVP


For the first serious platform increment, the proposed MVP includes:

```text
1. AI Gateway
2. Internal SDK
3. Observability + cost tracking
4. Prompt registry
5. Structured output validation
6. Basic guardrails
7. One RAG pipeline for one or two approved knowledge sources
```


That MVP supports real use cases while creating the foundation for everything else.

A reasonable first target architecture:

```text
Application
  ↓
Internal SDK
  ↓
AI Gateway
  ├── Auth / quota / policy
  ├── Prompt registry
  ├── Model provider
  ├── Structured output validator
  ├── Retrieval service
  └── Observability + audit + cost logs
```

# Build-order ranking


|Priority|Component|Build timing|Why|
|--:|---|---|---|
|1|AI Gateway|First|Establishes control plane|
|2|Internal SDK|First|Drives adoption and standard usage|
|3|Observability|First|Hard to retrofit|
|4|Cost tracking|First|Prevents uncontrolled spend|
|5|Prompt registry|Early|Makes behavior versioned and reproducible|
|6|Structured output|Early|Enables production workflows|
|7|Basic guardrails|Early|Centralizes safety and data policy|
|8|RAG ingestion/retrieval|Early-mid|High-value enterprise capability|
|9|Evaluation harness|Mid|Needed before scaling changes|
|10|Tool registry|Mid|Prerequisite for safe agents|
|11|Agent runtime|Later|Depends on tools, evals, policy, traces|
|12|Human review console|Later|Needed once volume/risk increases|
|13|Experimentation|Later|Requires stable metrics first|
|14|Advanced model routing|Later|Useful after enough traffic and eval data|

# Capabilities to defer


Defer these until the platform has real adoption:

```text
- Fully autonomous agent framework
- Complex multi-provider optimization
- Fine-tuning platform
- Full human review UI
- Large-scale prompt marketplace
- Generic connector marketplace
- Sophisticated semantic caching
- Automated prompt optimization
```


They are valuable later, but they are poor first investments without existing high-volume production AI workloads.

# Final recommendation


The first build should be a **platform spine**:

```text
AI Gateway
+ SDK
+ observability
+ cost attribution
+ prompt registry
+ structured output
+ basic guardrails
```


Then add the first major reusable capability:

```text
RAG ingestion and retrieval
```


Then add scale controls:

```text
evaluation
tool registry
agent runtime
```


This sequence establishes control, adoption, debuggability, and reuse before introducing complex agent behavior.
