---
draft: false
toc: true
title: "AI Platform Capability Map"
description: "A reference model and capability map for an enterprise AI platform, with build-or-buy positions, identity and evaluation as platform concerns, a KPI scorecard, a five-level maturity model, a build sequence, and landscapes for surveying the ecosystem."
document_status: "draft"
linkTitle: "Platform Capability Map"
---

**Question:** which capabilities should an internal AI platform provide, which should it build rather than buy, and in what order?

This map synthesizes public platform designs from 2026; it is not a vendor architecture. It starts from components. The [team delivery loop]({{< ref "ai-engineering/delivery/ai-platform-team-loop" >}}) starts from what teams do instead, and the two views should be checked against each other. [Platform primitives]({{< ref "ai-engineering/delivery/reuse" >}}) has a more detailed build order for the first components.

> **Evidence caveat:** the vendor descriptions and survey figures below were collected with an AI assistant and have not been checked against the cited reports.

## Reference model

```text
┌─────────────────────────────────────────────────────────────────────┐
│                  BUSINESS WORKFLOWS & AI PRODUCTS                   │
│ Assistants │ Search │ Automation │ Agents │ Decision support        │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                    DEVELOPER EXPERIENCE                             │
│ SDKs │ Templates │ Golden paths │ Sandbox │ CI/CD │ Catalog         │
└───────────────┬──────────────────────────────┬──────────────────────┘
                │                              │
┌───────────────▼────────────────┐  ┌──────────▼─────────────────────┐
│       AGENT / APP RUNTIME      │  │      CONTEXT & KNOWLEDGE       │
│ Orchestration                  │  │ Enterprise search              │
│ State & memory                 │  │ RAG / retrieval                │
│ Human approval                 │  │ Data access                    │
│ Agent-to-agent                 │  │ Permission-aware context       │
│ Tool execution                 │  │ Metadata / lineage             │
└───────────────┬────────────────┘  └──────────┬─────────────────────┘
                │                              │
┌───────────────▼──────────────────────────────▼─────────────────────┐
│                    MODEL & TOOL ACCESS                             │
│ Model gateway │ Model catalog │ Routing │ Tool/MCP registry        │
│ Quotas │ Rate limits │ Fallbacks │ Provider abstraction            │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
┌──────────────────────────────▼─────────────────────────────────────┐
│              MODELS / INFRASTRUCTURE / DATA PLATFORMS              │
│ Commercial models │ Open models │ ML models │ APIs │ Databases     │
└────────────────────────────────────────────────────────────────────┘

              CROSS-CUTTING AI CONTROL PLANE

 Identity & authorization │ Policy & guardrails │ Agent registry
 Evaluation & testing     │ Observability       │ Cost / FinOps
 Audit & provenance       │ Governance          │ Lifecycle management
```


**Platform designs with the same shape:**

- **Google:** exposes agent identity, registry, gateway, runtime, evaluation, and observability as distinct platform capabilities.
- **AWS:** names four pillars of AgentOps: governance and security, build and operations, evaluation, and observability.
- **BCG:** proposes an enterprise control plane that spans identity, runtime policy, a registry, and governed deployment paths.

The cross-cutting layer is a control plane in the sense of [control plane and data plane]({{< ref "system-design/elements/control-plane" >}}). The [model gateway designs]({{< ref "ai-engineering/delivery/patterns/model-gateway" >}}) apply the same split to model access.

## Capability map


| Capability | The platform provides | Build or buy |
| --- | --- | --- |
| Model access | A common API, an approved model catalog, routing, fallback, quotas, rate limits | Buy models and inference. Build a thin enterprise abstraction and its policies. |
| Context and RAG | Secure retrieval, enterprise search, connectors, citations, permission propagation | Reuse data and search platforms. Build domain-specific retrieval and its evaluation. |
| Tools and MCP | Approved tools, tool contracts, a registry, authentication, lifecycle and versioning | Build governance and contracts around existing APIs. |
| Agent runtime | State, orchestration, memory, long-running jobs, human approval, retries | Prefer managed or framework capabilities; keep business orchestration portable. |
| Identity | Identity for users, workloads, and agents; delegation; least privilege | Reuse enterprise IAM and extend it to agent identity. |
| Policy | Runtime authorization, data boundaries, tool restrictions, safety controls | Reuse policy and security systems where possible. Build AI-specific policies. |
| Evaluation | Offline test sets, regression evaluation, tool tests, agent trajectory tests, production sampling | **Build domain evaluations.** They are among the most valuable proprietary assets. |
| Observability | Traces across model, retrieval, and tool calls; latency, failures, quality, provenance | Extend OpenTelemetry and existing APM rather than adding an isolated monitoring stack. |
| Cost management | Token, model, and tool cost; cost by application, team, and outcome; budgets | Reuse FinOps and add AI dimensions. |
| Registry and catalog | Models, agents, tools, prompts, and evaluation sets, with owners and versions | Usually a shared platform capability. |
| Governance | Use-case registration, risk classification, approvals, evidence, audit | Connect enterprise governance, risk, and compliance (GRC) processes to automated platform controls. |
| Developer platform | SDKs, starter repositories, environments, CI/CD, self-service, paved paths | The platform team owns this layer. |
| Business measurement | Outcome baselines, experiments, adoption, links to business KPIs | Product and domain teams own the outcomes; the platform supplies the telemetry. |

### Identity across the delegation chain


Identity and authorization have to hold along the whole chain:

```text
Human
  ↓ delegation
AI application
  ↓
Agent
  ↓
Sub-agent
  ↓
Tool / MCP server
  ↓
Enterprise API
  ↓
Enterprise data
```


An agent should not inherit broad application credentials.

- **WEF:** its 2026 agent playbook focuses on delegated authority that stays enforceable and auditable.
- **OWASP:** its agent security guidance treats four problems separately: identity and privilege abuse, goal hijacking, tool misuse, and agent supply-chain risks.

### Evaluation as a platform primitive


Evaluation sits alongside CI/CD as a platform primitive:

```text
Code / prompt / model / tool change
              ↓
       Offline evaluation
              ↓
       Security evaluation
              ↓
       Integration tests
              ↓
        Release decision
              ↓
            Prod
              ↓
       Online evaluation
              ↓
 quality regression → alert / rollback / human review
```


- **AWS:** recommends evaluating tools, conversation turns, sessions, and whole systems, and using evaluations as promotion gates.
- **Google:** its agent platform combines pre-deployment simulation, evaluation, and production observability.

## A layer view


A second cut is by layer. It includes the compute, training, and serving layers that the reference model leaves to infrastructure:

1. **Compute and runtime:** GPUs, Kubernetes or Slurm, storage, networking.
2. **Model supply:** hosted model APIs, a model registry or catalog, open-weight models.
3. **Training and customization:** training, fine-tuning, jobs, experiment tracking.
4. **Inference and serving:** serving engines such as vLLM or Triton, autoscaling, batching, caching.
5. **Model gateway:** routing, provider abstraction, quotas, rate limits, fallback, token and cost accounting.
6. **AI application runtime:** agents, tool execution, workflow and state management, sandboxes.
7. **Knowledge and retrieval:** ingestion, embeddings, vector and keyword search, reranking, RAG.
8. **Evaluation and observability:** traces, evaluation datasets, regression tests, and quality, latency, and cost monitoring.
9. **Safety, security, and governance:** IAM, secrets, guardrails, data policy, audit, and model and prompt provenance.
10. **Developer platform:** SDKs, playgrounds, prompt and configuration management, CI/CD, environments, templates.
11. **FinOps and capacity:** GPU utilization, token spend, budgets, chargeback and showback.

## Scorecard


Measure the platform at several levels:

| Area | Measures |
| --- | --- |
| Platform adoption | Share of AI workloads that go through the platform, active teams, self-service adoption |
| Developer experience | Time from repository creation to first production deployment |
| Reuse | Share of applications that reuse registered models, agents, tools, and retrieval services |
| Quality | Task success rate, regression pass rate, grounded answer accuracy |
| Agents | Tool-selection accuracy, task completion, human escalation rate |
| Reliability | Success rate, p95 latency, timeout rate, rollback frequency |
| Security | Unauthorized tool calls, policy violations, stale identities, security-evaluation pass rate |
| Cost | Cost per successful task, cost per workflow, model mix, tokens per output |
| Operations | Mean time to diagnose AI failures, evaluation coverage, trace coverage |
| Business | Cycle time, error and rework rate, revenue, cost, or customer KPIs tied to the use case |

**Primary metric: cost per successful business outcome.** Token consumption, request counts, and the number of agents are useful operational measures but weak measures of value. The general platform measures are in [developer experience]({{< ref "engineering/platform/developer-experience" >}}#measuring-it).

**Evidence for measuring outcomes (unverified):**

- **Adoption is wide but shallow:**
  - Stanford's AI Index reports AI adoption at 88% of surveyed organizations and generative AI use in at least one business function at 70%. Agent deployment stays in single digits in almost every function.
  - McKinsey finds that nearly two-thirds of organizations have not scaled AI across the enterprise, and names workflow redesign as a trait of higher performers.
- **Usage is not productivity:**
  - Stack Overflow's 2025 survey: 84% of developers use or plan to use AI development tools, 46% distrust the accuracy of the output, and 66% name "almost right" results as a major frustration.
  - METR's controlled study found a 19% slowdown for experienced developers on the repositories and tasks it studied. That result does not generalize to all software work, but it shows why perceived productivity and tool usage need independent outcome measures.

## Maturity model


| Level | Characteristics |
| --- | --- |
| 1. Experimental | Direct model APIs, individual copilots, proofs of concept, few standards |
| 2. Controlled | Approved models, a basic gateway, IAM, logging, an initial AI policy |
| 3. Platform | A self-service platform, shared RAG, model routing, evaluation, observability, a catalog |
| 4. Governed agents | Agent identity, a tool registry, runtime policy, delegated permissions, continuous evaluation |
| 5. Outcome optimized | Automated model routing, continuous quality and cost optimization, reusable agents and tools, feedback loops from business outcomes |

Most enterprises are moving between levels 2 and 3. The evidence (unverified):

- McKinsey reports that only about a third have begun scaling AI programs.
- Deloitte finds that only one in five surveyed companies has a mature governance model for autonomous agents.
- DORA's 2025 research found a direct relationship between the quality of an internal platform and an organization's ability to turn AI adoption into organizational performance. That is an argument for reaching level 3.

## Build sequence


1. **Foundation:** model gateway, enterprise IAM, telemetry and tracing, an approved model catalog, cost attribution, a basic SDK.
2. **Production AI:** an evaluation framework, secure RAG and context, a use-case registry, reusable CI/CD, policy controls, developer golden paths.
3. **Agent platform:** an agent registry, a tool and MCP registry, agent identity, delegation, runtime policy enforcement, agent observability, agent evaluations.
4. **Optimization:** quality-aware and cost-aware model routing, reusable agent capabilities, continuous evaluations, feedback from business KPIs.

**Don't start with a large internal AI framework.**

- DORA's findings favor good internal platforms and shared capabilities.
- The AWS and Google designs show much of the runtime becoming commodity platform functionality.

Engineering investment belongs where an organization is different:

- its data and context;
- domain evaluations;
- business workflows;
- its permission model;
- reusable enterprise tools.

**The platform team's mandate in one line:**

> Make the secure, observable, evaluated, and cost-controlled way of building AI the easiest way for product teams to ship.

It matches BCG's golden-path model and the NIST AI Risk Management Framework's lifecycle functions: govern, map, measure, and manage. It is also the AI version of the [golden paths]({{< ref "engineering/platform/developer-experience" >}}#golden-paths) idea.

## Surveying the ecosystem


There is no canonical taxonomy. These landscapes serve different purposes:

| Source | Best for | Notes |
| --- | --- | --- |
| [LF AI & Data Landscape](https://landscape.lfai.foundation/) | The open-source ecosystem | The closest thing to a maintained catalog: ML platforms, data, workflows, training, inference, governance, security, generative AI |
| [FirstMark MAD Landscape](https://mad.firstmark.com/) | The whole commercial ecosystem | The 2025 edition maps about 1,150 companies and products across data, AI development, agents, MLOps, inference, hardware, and enterprise platforms |
| [CNCF](https://www.cncf.io/blog/2026/08/13/llmops-and-platform-engineering-who-should-own-the-ai-pipeline/) | How an AI platform fits into platform engineering | LLMOps, Kubernetes, inference routing, GPU scheduling, platform ownership, production architecture |
| MLOps.toys ([MLOps Community](https://mlops.community/)) | Finding tools | Traditional ML and MLOps: training orchestration, experiment tracking, serving, monitoring, feature stores. The catalog's address, `tools.mlops.community`, returned 404 in April 2026, and `mlops.toys` now points to an unrelated site. |

The 2025 MAD map separates several platform types:

- AI developer platforms;
- agent platforms;
- MLOps;
- enterprise AI platforms;
- GPU and deployment infrastructure;
- local runtimes;
- data and search APIs.

That split is close to how teams actually divide their platforms.

## Open questions


- An architecture decision matrix that compares OpenAI and Azure OpenAI, AWS Bedrock, Google Vertex and Gemini, Databricks, and an open-source stack across these capabilities. It should show where vendor lock-in appears and which layers should stay provider-neutral.
- A reference architecture that separates platform-owned components, product-team components, and external providers.

## Related notes


- [Platform primitives]({{< ref "ai-engineering/delivery/reuse" >}}): reusable components, a build order, and what to defer.
- [Model gateway designs]({{< ref "ai-engineering/delivery/patterns/model-gateway" >}}): the model access layer in detail.
- [Team delivery loop]({{< ref "ai-engineering/delivery/ai-platform-team-loop" >}}): capabilities derived from what teams do.
- [AI discovery platform]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}}): the platform for the uncertain early stage.
- [Evaluation harness and platform]({{< ref "ai-engineering/evaluation/framework/harness-and-platform" >}}).
- [Platform product framing]({{< ref "engineering/platform/product-framing" >}}): deciding what the platform is for before choosing capabilities.
- [Control plane and data plane]({{< ref "system-design/elements/control-plane" >}}).

## Sources


- Google Cloud: [What's new in Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/whats-new-in-gemini-enterprise-agent-platform) and [Introducing DORA's inaugural AI Capabilities Model](https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model).
- AWS: [AgentOps: Operationalize agentic AI at scale with Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/machine-learning/agentops-operationalize-agentic-ai-at-scale-with-amazon-bedrock-agentcore/).
- World Economic Forum: [AI Agents in Action: A Playbook for Trusted Adoption, Authorization and Scaling 2026](https://www.weforum.org/reports/ai-agents-in-action-a-playbook-for-trusted-adoption-authorization-and-scaling).
- Stanford HAI: [The 2026 AI Index Report, Economy](https://hai.stanford.edu/ai-index/2026-ai-index-report/economy).
- McKinsey: [The state of AI in 2025: Agents, innovation, and transformation](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai).
- Stack Overflow: [2025 Developer Survey, AI](https://survey.stackoverflow.co/2025/ai).
- BCG: [How CIOs Can Govern AI Agents at Scale in 2026](https://www.bcg.com/publications/2026/how-cios-govern-ai-agents-at-scale).
- Cited without a link: OWASP agent security guidance, METR's study of experienced developers, Deloitte's survey on agent governance, and the NIST AI Risk Management Framework.

## Library sources


- AI agent platform book, *O'Reilly early release, chapter 3* -- minimum viable platform, operationalization, and advanced building blocks
- [Berberi et al. 2025](/sources/f56b8454c88db743347ed2fec4565baa.bin), *Machine learning operations landscape: platforms and tools* ([doi:10.1007/s10462-025-11164-3](https://doi.org/10.1007/s10462-025-11164-3)) -- MLOps platforms compared by feature
- [Faubel and Schmid 2024](/sources/55b106ef70f4f319564b76561a087eff.bin), *A Systematic Analysis of MLOps Features and Platforms* ([doi:10.64552/wipiec.v10i2.73](https://doi.org/10.64552/wipiec.v10i2.73)) -- platform features as a design space
