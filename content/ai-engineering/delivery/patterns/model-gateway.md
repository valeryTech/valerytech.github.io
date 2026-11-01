---
draft: false
toc: true
title: "Model Gateway: Overview and Financial Reference Designs"
description: "Collected model-gateway designs progress from a general control-and-data-plane pattern to hybrid financial architectures, culminating in a single-organization proposal with data-class routing, action mediation, and audit controls."
linkTitle: "Model Gateway"
---

<a id="introducing"></a>

A **model gateway** (for LLM-based workflows) is the **control plane + data plane layer** that sits between applications or agents and one or more model providers (internal models, OpenAI/Anthropic/GCP/Azure, fine-tunes, embeddings, rerankers, tool models). It standardizes how model calls are _invoked_, _secured_, _routed_, _observed_, and _governed_--similar in spirit to an API gateway / service mesh, but specialized for probabilistic inference and prompt-driven systems.

## What it means to design/build a model gateway


The gateway provides a **single, opinionated interface** for:

- **Invocation**: chat/completions, embeddings, image/audio if relevant
- **Policy**: guardrails, PII rules, compliance, tenant isolation
- **Routing**: pick model/provider/version per request
- **Reliability**: retries, timeouts, fallbacks, circuit breakers, rate limits
- **Cost/perf**: caching, batching, token budgeting, dynamic model selection
- **Observability**: traces, eval signals, prompt/version lineage, cost metrics
- **Lifecycle**: prompt/model config versions, canaries, rollbacks, A/B tests

A good gateway treats "an LLM call" as a **governed operation** with context, policies, and measurable outcomes--not a raw HTTP request.

## Main components

### 1. Unified API surface (SDK + HTTP)


- Normalizes request/response shapes across providers.
- Supports "chat", "tools/function calling", streaming, structured outputs.
- Adds first-class fields for: **tenant, use-case, sensitivity, SLA tier, budget, experiment id**.

**Outcome:** decouples app logic from provider quirks; enables portability.

### 2. Policy engine (governance + safety + compliance)


- **Pre-flight checks**: PII/PHI detection, secrets scanning, tenant rules.
- **Prompt filtering / redaction**: mask sensitive content, tokenize-only storage, allowlists.
- **Tool-use policies**: which tools are allowed per tenant/use-case.
- **Output constraints**: schema validation, jailbreak heuristics, refusal policies.

**Outcome:** centralized enforcement; consistent controls across all LLM usage.

### 3. Routing & orchestration layer


- Model selection by:
    - **capability** (vision, tool calling, long context)
    - **latency** (p95 targets)
    - **cost budgets** (max $/request, max tokens)
    - **quality tiers** (gold/silver/bronze)
    - **region/data residency**
- Supports:
    - **fallback chains** (primary -> secondary provider)
    - **multi-pass** (cheap draft -> expensive critique)
    - **canaries/A-B tests** for model upgrades
    - **specialist models** (summarizer, classifier, reranker)

**Outcome:** higher availability + better cost/quality tradeoffs without app changes.

### 4. Prompt and config management


- Versioned **prompt templates**, system instructions, tool schemas.
- Parameter sets (temperature, top_p) and **token budgets** per use-case.
- Change controls: approvals, diffs, rollbacks, "prompt releases".

**Outcome:** reproducibility and safer iteration (like infra-as-code for prompts).

### 5. Context management (RAG + memory + retrieval plumbing)


Not always inside the gateway, but commonly adjacent or integrated:

- Standard interfaces for:
    - embeddings
    - vector search
    - reranking
    - context packing (chunking, dedupe, citation policy)
- Enforces **context window budgets** and **source attribution**.

**Outcome:** consistent RAG quality and predictable token usage.

### 6. Reliability controls


- **timeouts** by tier, **retries** with jitter, **idempotency keys**
- **circuit breakers** per provider/model
- **rate limiting** per tenant/user/use-case
- **queueing/backpressure** for bursty workloads
- streaming proxy robustness (disconnect handling)

**Outcome:** predictable system behavior under stress.

### 7. Cost controls & performance optimizations


- Token accounting and per-request cost estimation.
- **Semantic cache** (prompt+context signature -> response) with TTL and safety rules.
- **Deterministic cache** for low-temperature structured tasks.
- **Batching** embeddings / rerank calls.
- Dynamic downgrade/upgrade: "if budget remaining < X, use smaller model."

**Outcome:** real cost reductions and fewer latency spikes.

### 8. Observability & auditability


- Structured logs: prompt version, model version, tools used, tokens, latency.
- Distributed tracing across: app -> gateway -> provider -> tools -> retrievers.
- Quality signals:
    - schema pass/fail
    - toxicity/safety flags
    - user feedback hooks
    - offline eval correlation ids
- Audit trails for regulated domains.

**Outcome:** supports debugging, measurement, and evidence of compliance.

## Core design patterns (LLM workflow-specific)

### Pattern A: "Policy-first call pipeline"


**Ingress -> classify sensitivity -> redact -> choose route -> execute -> validate -> post-process -> log/audit**

Key: every step is explicit and testable.

### Pattern B: Tiered model strategy (capability ladder)


- **Bronze**: small/cheap, fast, good for extraction/classification
- **Silver**: general-purpose chat + tools
- **Gold**: complex reasoning, long context, best quality
    Routing rules decide tier based on request type + risk + budget.

### Pattern C: Fallback chains with graceful degradation


- Provider outage: switch vendor/model automatically.
- Quality fallback: if JSON schema fails -> retry with "repair prompt" -> else escalate model tier.

### Pattern D: "Two-pass" for quality control


- Pass 1: generate candidate (cheap)
- Pass 2: verify/critique/validate (stronger model or deterministic checks)
    Used for factuality, policy compliance, or structured outputs.

### Pattern E: Tool-use mediation ("tool firewall")


- Gateway controls tool invocation contracts.
- Validates tool inputs/outputs, scopes access (tenant, environment), rate limits tools separately.

### Pattern F: Prompt as code + experiments


- Prompts/configs in repo, CI checks, golden tests, offline eval gates.
- Gateway enforces which prompt versions are allowed in prod.

## Gains (why teams build this instead of calling providers directly)

### Engineering velocity


- Swap models/providers without touching app code.
- Central prompt/config/version management.
- Reusable guardrails and tool contracts.

### Reliability & operational control


- Fallbacks, circuit breakers, rate limits.
- Better streaming stability and error normalization.

### Cost efficiency


- Caching + tiered routing + token budgets typically yields meaningful savings.
- Consolidated spend reporting by tenant/use-case.

### Quality improvements


- Standardized context packing and schema validation.
- A/B testing and eval-driven promotion.

### Governance & compliance


- Central audit log, PII redaction, residency constraints.
- Consistent enforcement across every workflow.

## Outcomes (what "good" looks like in practice)


- **One SDK** used by every service for LLM calls.
- **Per-use-case SLOs** (latency, schema success rate, safety pass rate).
- **Model upgrades** done via gateway routing changes + canaries, not app releases.
- **Cost per successful task** becomes a tracked KPI (not just tokens).
- **Incident response**: provider outage becomes a routing event, not a platform incident.
- **Reproducibility**: requests can be replayed with the exact prompt/model/tool versions.

## A concrete component checklist (minimal -> mature)


**Minimal (MVP)**

- Unified API + auth
- Provider adapters
- Basic routing + retries/timeouts
- Token/cost metrics + tracing hooks
- Prompt version IDs in requests

**Production**

- Policy engine (PII, allowlists), tenant quotas
- Fallback chains + circuit breakers
- Schema validation + repair loop
- Caching (with safety constraints)
- A/B testing + canary routing

**Mature**

- Eval integration (offline + online), automatic rollback on regressions
- Tool firewall + sandboxing and least privilege
- Data residency, audit exports
- Automated "capability registry" (which model supports which features)
- Continuous prompt/model governance (approvals, provenance)

Inputs for a concrete reference architecture and interface specification: multi-tenant or single-tenant scope, regulated domain, expected QPS and latency target, required providers, and tool-calling and RAG needs. These constraints inform the request schema and routing/policy configuration for the chosen stack.

<a id="reference-architecture"></a>

# Multi-tenant financial reference architecture


Proposed reference architecture for a **multi-tenant, financial-domain model gateway** that can route across **OpenAI, Gemini, private models on AWS, and on-prem**, while handling **10-200 QPS with spikes**.

## 1. Top-level architecture: control plane vs data plane

### Data plane (hot path, per request)


Stateless, horizontally scalable. Owns:

- authn/z, tenant isolation enforcement
- policy checks + redaction
- routing + retries/fallbacks
- tool mediation
- caching
- observability emission
- provider adapters (OpenAI/Gemini/AWS/on-prem)

### Control plane (cold path)


Versioned config + governance:

- tenant configs, quotas, budgets
- model registry + capability metadata
- routing rules + experiments (A/B, canary)
- prompt/template registry (versioned)
- policy bundles (OPA-style or equivalent)
- evaluation results + release gates

**Reason:** Request throughput should scale independently from governance workflows, while the hot path remains deterministic and low-latency.

## 2. Deployment topology (hybrid + multi-region)

### Recommended: "federated gateway"


- **Central control plane** (AWS is typical) replicating configs to:
- **Data-plane clusters** in:
    1. AWS (closest to AWS-hosted private models and egress to OpenAI/Gemini)
    2. On-prem (closest to on-prem inference, and for highest-sensitivity workloads)

Routing option:

- Client -> nearest data plane (via DNS/Anycast/LB)
- Data plane decides provider _but_ respects data residency and sensitivity (see policies below)

Connectivity:

- AWS <-> on-prem via **private link/VPN/Direct Connect**, mTLS
- Avoid hairpinning prompt payloads across domains unless required

## 3. Request flow (financial-grade "policy-first" pipeline)


**1) Edge/API Gateway**

- mTLS + OAuth2/JWT
- Require: `tenant_id`, `use_case`, `data_class` (or infer), `sla_tier`, `max_cost`, `max_latency`
- Per-tenant **token bucket** rate limits (hard protection)

**2) Tenant Context + Policy Decision**

- Fetch tenant policy bundle (cached locally) with rules like:
    - allowed providers by data class
    - allowed tools
    - max tokens, max cost, model tier constraints
    - logging/audit requirements
- Produce an "execution plan": {redaction required?, provider set, fallback chain, validators}

**3) Data classification + redaction**

- Detect PII/PCI/credentials (configurable detectors)
- Redact/transform before:
    - leaving the boundary (to OpenAI/Gemini)
    - being persisted in logs/traces
- For finance, default to: **log hashes + metadata**, not raw prompts

**4) Context/RAG (optional but common)**

- Per-tenant vector index + doc ACL enforcement
- Context packing with strict token budget
- Attach provenance metadata for audit ("which docs influenced answer")

**5) Model routing**

- Use case / tier-based routing (details in section 6)
- Consider:
    - latency SLO
    - budget
    - capability needs (tool calling, structured output, long context)
    - risk level (external vs internal)
- Apply "safe fallback" chains

**6) Execution via provider adapters**

- Normalize: streaming, tool calling schema, errors
- Implement per-provider:
    - circuit breaker
    - retries with jitter (only for safe/idempotent calls)
    - concurrency limits

**7) Output validation + post-processing**

- JSON/schema validation (for structured workflows)
- Policy checks on output (PII leak, disallowed content)
- If invalid: **repair loop** (same model or escalate tier) with bounded attempts

**8) Observability + audit emission**

- Emit trace + metrics + audit event
- Store audit logs in **WORM/immutable** store for compliance (partitioned per tenant)

<a id="4-core-components-what-you-actually-build"></a>

## 4. Core components to build

### A) Model Gateway Service (stateless)


- Unified API: `/chat`, `/embed`, `/rerank`, `/moderate`, `/tools/*`
- Pluggable middleware chain:
    - auth -> policy -> redact -> cache -> route -> execute -> validate -> log

### B) Policy Engine


- Prefer a real policy system (OPA-like) or equivalent rules engine
- Policies should reference:
    - tenant, environment (prod/nonprod)
    - data class (public/internal/confidential/restricted)
    - provider class (external/cloud/internal/onprem)
    - model capability requirements

### C) Model Registry + Capability Catalog


For each model/provider endpoint store:

- capabilities: tool calling, json mode, max context, vision, languages
- expected p50/p95 latency by region
- cost model (token pricing or internal cost unit)
- data handling constraints (where it can run, retention posture)
- allowed data classes (policy-enforced)

### D) Provider Adapters


- OpenAI + Gemini: enterprise endpoints, per-tenant tags, request id propagation
- AWS private models: SageMaker/Bedrock/custom endpoints
- On-prem: vLLM/TGI/other inference servers behind mTLS + allowlists

### E) Tool Firewall / Action Gateway (strongly recommended in finance)


Do **not** let the LLM directly "call payments / trades / transfers" without:

- strict schemas
- deterministic validation
- policy checks + approvals if needed
- full audit trail
- idempotency keys

### F) Audit & Telemetry Pipeline


- OpenTelemetry traces with redaction
- Metrics: QPS, p95 latency, success rate, token usage, cache hit rate, fallback rate
- Audit store: append-only, tenant-partitioned, queryable for incident response

## 5. Multi-tenant isolation model (financial domain expectations)


**Hard boundaries**

- Per-tenant auth, quotas, and budgets
- Per-tenant encryption keys (KMS/HSM; envelope encryption)
- Separate vector indexes per tenant (or strict namespace + ACL enforcement)
- Separate log partitions + access controls

**Soft boundaries**

- Per-tenant prompt templates and system policies
- Per-tenant allowed provider list (some tenants may be "on-prem only")

<a id="6-routing-patterns-that-work-well-with-your-provider-mix"></a>

## 6. Routing patterns for the proposed provider mix

### Pattern 1: Data-class gated provider sets (primary control)


Example policy:

- `restricted`: on-prem only (or AWS private only)
- `confidential`: AWS private models preferred; external only if redacted
- `internal/public`: external providers allowed

### Pattern 2: Tiered model ladder (cost/latency control)


- Tier 0: fast small model for classification/extraction
- Tier 1: general LLM for most chats
- Tier 2: strongest model for complex reasoning or long-context

### Pattern 3: Fallback chains by class


- External chain: OpenAI -> Gemini (or reverse), subject to policy
- Internal chain: AWS private -> on-prem (or reverse) depending on locality and load
- Always ensure fallback does not violate data-class constraints

### Pattern 4: "Repair then escalate"


- If schema fails: retry with constrained decoding / stronger instructions
- If still fails: escalate tier
- Bound attempts (e.g., max 2) to protect latency and cost

### Pattern 5: Burst protection via admission control + queues


For 10-200 QPS with spikes:

- Keep **interactive** calls synchronous with strict max concurrency
- Offload **non-interactive** (summaries, report generation, backfills) to async workers via SQS/Kafka
- When saturated: degrade gracefully:
    - return 429 with `retry-after`
    - or accept job + callback/webhook for async flows

## 7. Handling spikes (10-200 QPS) concretely


**Gateway scaling**

- Stateless pods/instances with HPA on:
    - in-flight requests
    - CPU (tokenization/redaction can be CPU heavy)
    - event loop lag (if async)
- Pre-warm connections to external providers
- Enforce global concurrency limits per provider to avoid cascading failures

**Backpressure**

- Token bucket per tenant + per use-case
- Circuit breakers per provider endpoint
- Optional hedged requests only for read-only, low-risk workflows (careful: doubles cost)

**Caching**

- Safe cache tiers:
    - embeddings cache (high ROI)
    - deterministic task cache (low temperature + strict inputs)
    - semantic cache only for low-risk, non-sensitive prompts, tenant-scoped

## 8. Security/compliance defaults for financial workloads


- **No raw prompt logging by default**; store:
    - hashes, token counts, routing decisions, policy version, model version, tool calls, doc ids (for RAG)
- **Redaction before egress** + separate "privacy budget" controls
- **Secrets management**: per-environment keys, rotate provider credentials
- **Data residency** enforced in policy + routing
- **Change control**: prompt/model/routing config promotions gated by evals + approvals

## 9. What "done" looks like (operational outcomes)


The gateway should provide the following information for each tenant and use case:

- p95 latency, success rate, schema-pass rate
- average cost per successful outcome
- fallback rate and provider health
- exact prompt/model/policy versions used for any decision
- audit trail of tool actions with idempotency guarantees

Possible implementation artifacts:

- an API schema for requests (tenant + data_class + sla/budget)
- a routing rule format (YAML/JSON) with examples
- an OPA-style policy sketch for provider allowlists + data-class gating
- an SLO/metrics spec tailored to 10-200 QPS interactive + async workloads

# Single-Tenant Model Gateway Architecture (Financial Domain, Hybrid Providers)


This document describes a **single-tenant** (single organization) architecture for a **model gateway** that supports **LLM-based workflows** in a **financial domain**, with **10-200 QPS and bursty spikes**, routing across **OpenAI, Gemini, private models on AWS, and on-prem inference**. It assumes strong compliance requirements and emphasizes governance, auditability, and operational reliability.

## 1. Objectives and scope

### Objectives


- Provide a **single, stable interface** for all LLM calls across the org.
- Enforce **financial-grade controls** (PII/PCI handling, tool/action governance, audit trails).
- Support **hybrid inference** (cloud + on-prem) with **routing, fallbacks, and SLO controls**.
- Enable **rapid iteration** on prompts, tools, and routing via versioned configuration.
- Improve **cost/latency predictability** through caching, token budgets, and tiering.
- Make behavior **observable and reproducible** (prompt/model/policy lineage).

### In scope


- Unified API (chat/completions, embeddings, rerank, moderate/guardrails hooks).
- Policy-first request pipeline (classification, redaction, routing, validation).
- Provider adapters for OpenAI, Gemini, AWS-hosted models, on-prem models.
- Tool mediation (a "tool firewall") and action governance.
- Observability, audit, and evaluation integration.

### Out of scope (typical)


- Building the underlying model training pipeline (fine-tuning, RLHF) -- can integrate later.
- Owning all downstream business systems; gateway mediates access.

## 2. Key assumptions (single-tenant refactor stance)


- **No tenant isolation problem** (no cross-customer data segregation), but **data-class isolation remains mandatory**(e.g., restricted vs confidential vs internal).
- Governance is **use-case / data-class / environment** driven (not tenant-driven).
- Default posture in finance:
    - Minimal retention of raw prompts/outputs.
    - Strict tool execution controls for anything that can affect funds, orders, accounts, or regulated records.
    - Separation of prod vs non-prod.

## 3. High-level system context

### Actors


- Internal apps (web, mobile, back-office tools)
- Internal services (risk, compliance, CRM, research, reporting pipelines)
- Analysts/operators (human-in-the-loop)
- Evaluation / monitoring systems

### Systems


- **Model Gateway** (this system)
- **Tool/Action Gateway** (strongly recommended separate service)
- Retrieval services (vector DB, document stores)
- Providers:
    - OpenAI (external)
    - Gemini (external)
    - Private model endpoints in AWS (internal cloud)
    - On-prem inference (internal)

## 4. Architecture overview

### 4.1 Split into Data Plane and Control Plane


**Data Plane (hot path, per request)**

- Stateless, horizontally scalable
- Implements the request pipeline: auth -> policy -> redact -> route -> execute -> validate -> log/audit
- Holds short-lived caches and local copies of configs for low latency

**Control Plane (cold path, release and governance)**

- Versioned config management
- Routing policies, model registry, prompt registry, tool schemas
- Experiment flags (canary/A-B)
- Evaluation results and release gates

**Why this split matters**

- Keeps the hot path fast and stable
- Allows safe iteration and governance without impacting request throughput

### 4.2 Deployment topology (hybrid)


A practical single-tenant hybrid topology:

- **AWS Region Cluster (Gateway Data Plane A)**
    - Lowest latency to AWS private models and egress to external providers
    - Good for most workloads that allow cloud processing
- **On-Prem Cluster (Gateway Data Plane B)**
    - For restricted data that must not leave on-prem
    - Also serves as resilience / fallback for internal workloads
- **Central Control Plane (often in AWS)**
    - Publishes signed config snapshots to both data planes
    - Keeps authoritative audit/eval metadata (not raw prompts)

Traffic routing:

- Client -> nearest gateway cluster (DNS/LB)
- Gateway decides execution target based on **data class + policy** and may forward to on-prem if needed (prefer: keep restricted workloads local by routing clients to on-prem gateway when possible).

## 5. Core design tenets (finance-grade)


1. **Policy-first:** every request is classified and governed before leaving the gateway.
2. **Data-class gating:** provider eligibility depends on classification (restricted/confidential/internal/public).
3. **Tool firewall:** LLMs never directly execute sensitive actions; tools are mediated and audited.
4. **Reproducibility:** log versions and hashes, not raw sensitive content.
5. **Fail safe:** bounded retries, circuit breakers, graceful degradation.
6. **Least privilege:** minimal access to data sources, tools, and logs.
7. **Separation of environments:** prod/non-prod isolation is hard, not "best effort".

## 6. API contract (single-tenant)


Even single-tenant, keep explicit control fields. Example required request metadata:

- `use_case`: e.g., `compliance_summarize`, `customer_support_reply`, `research_assistant`
- `data_class`: `restricted | confidential | internal | public` (or inferred with override rules)
- `risk_level`: `low | medium | high` (drives tool permissions and validation strictness)
- `sla_tier`: e.g., `interactive | batch`
- `max_latency_ms`, `max_cost_units`, `token_budget`
- `request_id` + `idempotency_key` (for tool/action flows)

**Response should include**

- `model_id`, `provider`, `policy_version`, `prompt_version`
- `tokens_in/out`, `latency_ms`, `cache_status`
- tool call summaries (not sensitive payloads unless allowed)

## 7. Data Plane: request pipeline (detailed)

### 7.1 Pipeline stages


1. **Ingress & Auth**
- mTLS inside the perimeter
- OAuth2/JWT for user/service identity
- Map identity to RBAC roles (e.g., analyst, support agent, batch service)
2. **Request normalization**
- Normalize provider-specific fields into internal format
- Attach defaults from `use_case` profile
3. **Classification**
- Determine `data_class` and `risk_level` using:
    - caller-provided value (validated)
    - content inspection heuristics/detectors (PII/PCI/secrets)
    - use_case defaults
4. **Policy evaluation**
- Decide:
    - allowed providers/models
    - required redaction
    - allowed tools
    - logging/audit requirements
    - token/cost ceilings
    - whether human approval is required for certain tool types
5. **Redaction / transformation**
- Before egress to external providers:
    - mask PCI/PII fields
    - remove secrets/tokens
    - optionally replace identifiers with consistent pseudonyms
- Also redact before any persistence (logs/traces)
6. **Context assembly (optional RAG)**
- Enforce doc ACLs and provenance capture
- Context packing with strict token budget
- Dedupe and relevance filtering; optionally rerank
7. **Routing & execution plan**
- Pick primary model + fallback chain
- Select decoding parameters and validators based on use_case
- Allocate concurrency budget and set timeouts
8. **Provider invocation**
- Provider adapter handles:
    - request mapping
    - streaming normalization
    - retries/backoff (bounded)
    - circuit breaker checks
9. **Output validation & post-processing**
- Structured output workflows:
    - JSON/schema validation
    - type checks and constraints
- Safety checks:
    - leakage detection (PII/PCI)
    - policy compliance checks
- Repair/escalation flow:
    - attempt repair prompt (bounded)
    - escalate model tier (bounded)
    - if still failing, return safe error and log failure mode
10. **Tool calls (when applicable)**
- Only through Tool/Action Gateway with:
    - strict schema
    - RBAC/policy enforcement
    - idempotency
    - full audit
11. **Observability + Audit emission**
- Trace spans for each stage
- Metrics increments (latency, errors, fallbacks, tokens)
- Audit event emitted (append-only)

## 8. Control Plane: configuration, governance, and release

### 8.1 Configuration domains


- **Model registry**
    - model IDs, capabilities (tool calling, max context, json mode)
    - cost model
    - performance hints (p50/p95, region)
    - data-class eligibility
- **Routing policy**
    - rules by `use_case`, `data_class`, and `sla_tier`
    - fallback chains
    - canary and experiments
- **Prompt registry**
    - versioned prompt templates (system + developer + tool schemas)
    - prompt release notes and diffs
- **Tool schema registry**
    - allowed tools by use_case and risk_level
    - input/output JSON schema
    - approval requirements
- **Policy bundles**
    - redaction requirements
    - logging retention rules
    - egress restrictions
    - blocked content categories

### 8.2 GitOps-style release (recommended)


- All configs are code-reviewed and versioned
- CI validates:
    - schema correctness
    - linting for prompt policies
    - offline eval benchmarks
- Control plane publishes signed snapshots to data plane
- Data plane caches configs locally and supports fast rollback

### 8.3 Canary and rollback mechanics


- Canary by percentage of traffic or by "shadow" duplication (no user impact)
- Automatic rollback triggers:
    - schema failure rate spikes
    - p95 latency regression
    - safety violation rate
    - tool error rate

## 9. Provider integration and routing strategy

### 9.1 Provider classes


- **External providers:** OpenAI, Gemini
    Use only for eligible data classes and only after redaction where required.
- **Internal cloud providers:** AWS-hosted private models
    Suitable for confidential/internal data; can be default for many workflows.
- **On-prem inference:** for restricted data and ultra-sensitive workflows

### 9.2 Data-class gating (baseline)


Example policy mapping (illustrative):

- `restricted`
    - Allowed: on-prem only (or explicitly approved internal endpoints)
    - Disallowed: OpenAI/Gemini
- `confidential`
    - Allowed: AWS private models preferred; on-prem acceptable
    - External providers allowed only if redacted and approved by policy profile
- `internal/public`
    - Allowed: all providers; route by SLO/cost/capability

### 9.3 Tiered model ladder (cost/latency)


- Tier 0: lightweight model for extraction/classification
- Tier 1: default general model for interactive tasks
- Tier 2: premium model for high complexity / long context / high accuracy

Routing chooses tier based on use_case and observed failure modes (repair/escalate).

### 9.4 Fallback chains


Maintain distinct fallback chains per class:

- External chain: OpenAI <-> Gemini (bounded retries)
- Internal chain: AWS private <-> on-prem (based on locality/load)
- Never violate data-class gating on fallback.

## 10. Tool/Action Gateway (financial domain critical)

### 10.1 Why separate it


In finance, "tool calls" often map to operations with regulatory and monetary impact. Treat this as a controlled subsystem:

- deterministic validation
- least privilege
- auditability
- approvals / dual control where needed

### 10.2 Core requirements


- Strong schemas for each tool
- RBAC and policy enforcement independent of the LLM
- Idempotency keys for all side-effecting operations
- Optional human approval workflow for high-risk actions
- Full audit trail: who/what/when/inputs/outputs/outcome

### 10.3 Patterns


- **Read-only tools:** account lookup, knowledge base query (lower risk)
- **Write/side-effect tools:** trade placement, transfers, customer changes (high risk)
    - enforce "prepare -> review -> execute" pattern when necessary

## 11. Retrieval (RAG) subsystem (optional but common)

### 11.1 Components


- Ingestion pipeline: parse, chunk, classify documents; attach ACLs
- Embeddings service: consistent embedding model/versioning
- Vector store: with metadata filters and ACL enforcement
- Reranker: optional for quality
- Context packer: token budget enforcement, dedupe, citation support

### 11.2 Finance-specific controls


- Strong document provenance and citation requirements
- "Restricted" documents must remain on-prem
- Logs store document IDs and chunk IDs, not raw text

## 12. Caching strategy (single-tenant)


Single-tenant allows simpler caching, but finance constraints still apply.

### 12.1 Cache types


- **Embeddings cache:** high ROI; safe with hashing/encryption
- **Deterministic task cache:** for structured extraction with low temperature and strict schemas
- **Semantic cache:** only for low-risk, non-sensitive content; always scoped and policy-checked

### 12.2 Safety requirements


- Cache keys include:
    - prompt version hash
    - model version
    - use_case
    - policy profile
- Encrypt cache at rest
- TTLs set by data class and policy

## 13. Reliability and burst handling (10-200 QPS + spikes)

### 13.1 Admission control


- Global concurrency caps per provider endpoint
- Per-use-case concurrency pools (interactive protected from batch)
- Load shedding rules:
    - return 429 for low priority when saturated
    - degrade to cheaper model tier when allowed
    - convert to async job for batch workflows

### 13.2 Retries and timeouts


- Use bounded retries with jitter for transient network/provider errors
- Avoid retrying non-idempotent tool actions
- Per-tier timeouts (interactive vs batch)

### 13.3 Circuit breakers


- Per provider + per model endpoint
- Open when error rate or latency exceeds threshold
- Fallback to alternate provider/model if policy allows

### 13.4 Async lane for heavy workflows


- Queue (SQS/Kafka/Rabbit) for:
    - long summarizations
    - report generation
    - backfills
- Worker pool uses same gateway pipeline but different SLO profile

## 14. Security, privacy, compliance

### 14.1 Data handling rules


- Default: **do not persist raw prompts/outputs**
- Persist:
    - hashes, token counts, versions, routing decisions
    - tool call metadata (and payloads only if policy permits)
    - document IDs for RAG provenance
- Separate prod vs non-prod storage.

### 14.2 Encryption and keys


- mTLS everywhere service-to-service
- Encryption at rest for caches and logs
- KMS/HSM for key management
- Rotate provider credentials regularly

### 14.3 Egress controls


- External provider calls only from controlled egress points
- DNS allowlists, egress proxies
- Redaction mandatory based on policy profile

### 14.4 Audit trails (WORM)


- Append-only audit log store
- Records:
    - identity, request_id, policy version, model/provider version
    - tool/action events with outcomes
- Retention per regulatory needs

## 15. Observability and operational analytics

### 15.1 Tracing


- OpenTelemetry spans for:
    - classification, redaction, retrieval, provider calls, validation, tool calls
- Correlate with request_id throughout

### 15.2 Metrics (minimum set)


- QPS by use_case
- p50/p95 latency end-to-end and per stage
- success/error rates by provider/model
- fallback rate
- schema validation pass rate
- tool call error rate
- token in/out and estimated cost
- cache hit rate

### 15.3 Alerts (examples)


- provider circuit breaker open
- sudden jump in schema failures for a use_case
- p95 latency regression
- abnormal increase in redaction triggers (possible upstream leak)
- spend anomaly vs baseline

## 16. Evaluation and quality gates

### 16.1 Offline evals


- Curated test sets per use_case
- Metrics:
    - extraction accuracy
    - refusal correctness
    - hallucination rate proxies (citation requirement, factual consistency checks)
    - schema pass rate
- Gate prompt/model changes in CI

### 16.2 Online signals


- user feedback capture (thumbs, corrections)
- tool success outcomes
- "defect" tagging (compliance review findings)
- shadow traffic comparisons (optional)

### 16.3 Safe rollout


- canary release for prompt/model/routing changes
- automatic rollback based on SLO and safety thresholds

## 17. Reference component list (what to build)

### Must-have services


- **Model Gateway (Data Plane)**
- **Control Plane config publisher** (GitOps + snapshot distribution)
- **Tool/Action Gateway** (financial safety boundary)
- **Audit log pipeline** (append-only store)
- **Telemetry stack** (metrics + traces)

### Common add-ons


- Retrieval services (RAG)
- Eval service and datasets store
- Cost analytics dashboarding

## 18. Failure modes and mitigations (selected)


- External provider outage -> circuit breaker opens -> fallback to Gemini/AWS/private/on-prem if allowed
- Spike overload -> admission control -> protect interactive, shed batch, enforce 429/async
- Prompt regression -> canary detects schema fail rate increase -> rollback snapshot
- Data leak attempt -> classifier triggers redaction + policy blocks external egress for restricted class
- Tool misuse -> tool firewall rejects schema or RBAC -> audit event emitted

## 19. Implementation phases (practical plan)

### Phase 1: MVP (production-safe core)


- Unified gateway API
- Model registry + basic routing
- Provider adapters (at least one external + one internal)
- Basic policy profiles by data_class/environment
- Observability (metrics + tracing) + minimal audit events

### Phase 2: Finance hardening


- Redaction and egress controls
- Tool/Action Gateway with schemas + idempotency + audit trails
- Schema validation + bounded repair/escalate
- Prod/non-prod separation

### Phase 3: Optimization + governance maturity


- Caching (embeddings + deterministic)
- Canary/shadow deployment controls
- Offline eval gates integrated into CI/CD
- Advanced routing based on SLO/cost and failure modes

## 20. Summary: what changes vs multi-tenant


A single-tenant design mostly removes:

- per-tenant partitioning, quotas, and policy bundles
- complex config permutations
- tenant-scoped caches and storage segmentation

It retains these controls, often with stronger requirements in finance:

- data-class gating and redaction
- tool/action governance
- auditability and reproducibility
- reliability controls (fallbacks, circuit breakers, admission control)
- evaluation gates and rollback discipline

To develop a concrete reference specification, identify the top 5 `use_case`s and which may use external providers after redaction. The specification would include an API schema, policy-profile examples, routing-table examples, and SLO targets.

## Library sources


- [Jeyaraman 2025](/sources/e5045625429c18e304fb2f37cffae339.bin), *Large Language Models Ops for Finance* ([doi:10.1007/979-8-8688-1700-7](https://doi.org/10.1007/979-8-8688-1700-7)) -- on *Multi-tenant financial reference architecture*
- AI agent platform book, *O'Reilly early release, chapters 1-7* -- on *What it means to design/build a model gateway*

Further reading:

- [Heiland et al. 2023](/sources/47873cd42a2a848d931e6798eef2815c.bin), *Design Patterns for AI-based Systems* ([arXiv:2303.13173](https://arxiv.org/abs/2303.13173))
- Lakshmanan and Hapke 2025, *Generative AI Design Patterns*
- [AWS 2024](/sources/7e7195dd160b0a64fe44c392ec32afaa.bin), *Reducing the Scope of Impact with Cell-Based Architecture*
