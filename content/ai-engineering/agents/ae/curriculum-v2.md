---
draft: false
toc: true
title: "Curriculum V2"
linkTitle: "Curriculum V2"
---
# AI Agent Engineering Curriculum v2


This curriculum treats **agent control**, **reasoning topology selection**, **tool contracts**, **evaluation**, **serving/performance**, and **security** as first-class engineering concerns.

Frameworks are implementation targets. The "spine" of the program is a set of portable artifacts: state models, tool contracts, eval suites, serving configs, and operational runbooks.

## Program outcomes


By the end, a practitioner can:

- design bounded-autonomy agent systems (explicit state, termination, approvals)
- choose and justify a reasoning topology (ReAct vs plan -> execute vs routing graphs; bounded verification)
- build reliable tool integrations (schemas, retries, idempotency, side-effects control)
- engineer context, memory, and retrieval with measurable quality (provenance + freshness)
- ship evaluation suites and regression gates for agent behavior (scenario + retrieval + red-team)
- operate agents in production (observability, incident response, cost controls)
- optimize **cost-to-serve** and **latency/throughput** (TTFT, tokens/sec, p95/p99, $/task) using caching, routing, batching, and load tests
- support multimodal and real-time constraints when needed (streaming I/O, cancellation, modality-aware evals)
- port the same design across multiple orchestration stacks

## Suggested learning sequence


| Phase                                | Duration  | Focus                                                                 | Outcome                                                   |
| :----------------------------------- | :-------- | :-------------------------------------------------------------------- | :-------------------------------------------------------- |
| 0. Foundations                       | 0-4 weeks | Python, APIs, basic ML + product framing                               | Production-capable base + problem spec                     |
| 1. Minimal Agent + Eval-First        | 4-6 weeks | loop + tools + structured I/O + baseline eval                          | Working single-agent repo with tests                       |
| 2. Control, Topologies, Tool Contracts| 6-8 weeks | state machines, topology selection, safe actuation                     | Bounded autonomy + robust tool layer                       |
| 3. Memory & Knowledge Systems        | 6-8 weeks | RAG, context shaping, provenance, retrieval eval (+ multimodal option) | Knowledge-enabled agent with measurable retrieval quality  |
| 4. Reliability, Security, Operations | 6-8 weeks | threat modeling, monitoring, recovery, serving SLOs                    | Production readiness package (safety gates + runbooks)     |
| 5. Orchestration, Multi-Agent, Serving| 6-8 weeks | coordination patterns, arbitration, load testing, inference economics  | Multi-agent system with measured cost/perf envelope        |
| 6. Framework Ports + Capstone        | 8+ weeks  | portability + deployment + acceptance criteria                          | Deployable agent system with release gates                 |
Total: ~40-50 weeks + continuous practice.

## Phase 0: Foundations (0-4 weeks)

### Core prerequisites


**Python programming**

- Async/await, concurrency basics, robust error handling
- Dependency management, packaging, type hints
- Testing (unit/integration), CI basics, linting/formatting

**API design and integration**

- REST/async APIs, pagination, rate limits, retries/backoff
- Authentication/authorization patterns
- Data contracts and versioning

**ML essentials (as-needed for agent work)**

- Evaluation concepts and splits
- Bias/overfitting/generalization (high-level)
- Basics of embeddings and similarity (preview)

**Product framing for agent work**

- Convert ambiguous needs into a measurable task spec
- Define success metrics (task success, time saved, cost envelope)
- Risk tiering: read-only vs write actions, approvals, audit requirements

### Deliverables (required)


1. **Agent starter template repo** with:
- typed config management
- unit test harness
- structured logging
- CI pipeline with pass/fail gates
1. **Problem spec** (`PROBLEM_SPEC.md`) containing:
- user goal and scope boundaries
- domain glossary (entities + actions)
- success metrics + acceptance tests outline
- autonomy tier (read/write) + approval policy
- cost/latency envelope (initial targets)

### Phase 0 checklist


-[] Repo template with CI (tests + lint)

-[] Structured logging in place (JSON or equivalent)

-[] A minimal HTTP client wrapper with retries/backoff

-[] `PROBLEM_SPEC.md` exists and is referenced by README

-[] A "definition of done" doc for later phases

### Assessment rubric (pass/fail gates)


- **Build reliability:** CI runs cleanly on a fresh machine
- **Code quality:** typed configs and tests exist for core utilities
- **Operational hygiene:** logs are structured and consistent
- **Problem framing:** a measurable spec exists (metrics + constraints)

## Phase 1: Minimal Agent + Eval-First (4-6 weeks)

### Core topics


**What an agent is**

- Agent loop: observe -> decide -> act -> verify
- Workflow vs agentic approaches: when not to be agentic
- Cost/latency budgets as constraints

**LLM component engineering**

- Model APIs, token accounting, latency and cost estimation
- Sampling controls (temperature/top-p) and determinism strategies
- Prompt-as-spec mindset: versioning and change control

**Structured I/O**

- JSON/schema outputs, validation, repair strategies
- Parsing failures as first-class failure modes

**Domain modeling (lightweight, but explicit)**

- Map domain entities -> tool schemas -> memory objects
- Define "what counts as success" per scenario

**Tool calling (read-only tools first)**

- Tool discovery and invocation patterns
- Tool descriptions as model-facing UX
- Error handling and safe fallbacks

### Labs (required)


1. **Single agent, two tools**
	- Tool A: read-only info retrieval (local dataset or read-only API)
	- Tool B: compute/transform (pure function)
2. **Baseline eval harness**
	- 20 scenario tests
	- pass/fail rubric per scenario
	- regression runner (CI gate)

### Deliverables (required)


- A single-agent system that completes a constrained multi-step task using tools.
- A repeatable eval harness that runs in CI.
- `DOMAIN_MODEL.md`: glossary + entity/action mapping to tool schemas.

### Phase 1 checklist


-[] Explicit agent loop with step limit and budget limit

-[] Structured outputs with schema validation

-[] Tool calls logged with inputs/outputs (redacting secrets)

-[] Eval suite with 20 scenarios and deterministic replay where possible

-[] `DOMAIN_MODEL.md` aligned with `PROBLEM_SPEC.md`

-[] "Known failure modes" doc

### Assessment rubric (0-4 each, target ≥ 12/16)


| Category | 0 | 2 | 4 |
|---|---|---|---|
| Correctness | frequent task failures | partial success on common cases | high pass rate on eval set |
| Robustness | brittle, crashes on minor errors | basic retries/fallbacks | graceful handling + clear error states |
| Test quality | no regression confidence | some scenarios, inconsistent | reproducible scenarios + CI gating |
| Documentation | unclear behavior | basic README | clear usage + limits + failure modes |

## Phase 2: Control, Topologies, and Tool Contracts (6-8 weeks)

### Core topics


**Reasoning topologies (selection is required)**

- ReAct vs plan-then-execute vs routing graphs
- When to use bounded verification (checks, critics) and when not to
- Failure modes per topology (loops, over-planning, tool thrashing)

**Control patterns**

- Termination conditions: step limits, goal checks, timeouts
- Budget enforcement: token, time, money
- Stop reasons as a contract (operator-readable)

**Explicit state**

- State machines and transitions
- Invariants (what must remain true)
- Event sourcing vs snapshots (intro)

**Tool contracts**

- Typed tool schemas, strict validation
- Error contracts and retry policy (timeouts, backoff, circuit breakers)
- Idempotency keys, deduplication
- Side-effect classification (read vs write)
- Pre/post conditions; rollback/undo strategies

**Bounded autonomy**

- Approval gates for write actions
- "Commit" vs "plan" separation
- Permission scopes and least privilege

### Labs (required)


1. Convert Phase 1 agent into an explicit state machine / graph.
2. Add a **write tool** with:
	- approval gate
	- idempotency
	- audit log record (who/what/when/why)
3. Add a **topology selection note**: pick one topology, justify it, and add at least 5 targeted evals for its known failure modes.

### Deliverables (required)


- A bounded-autonomy agent with explicit state, documented topology choice, and a robust tool layer.
- `CONTROL_POLICY.md` including:
	- topology choice + rationale
	- budgets + termination rules
	- stop reasons
	- verification/reflection constraints (when allowed, limits, triggers)

### Phase 2 checklist


-[] Explicit state model (documented) + transition map

-[] Termination conditions beyond "model said done"

-[] Tool layer with retry/circuit breaker patterns

-[] Idempotency and side-effect labeling for write actions

-[] Audit log for tool invocations (with correlation IDs)

-[] `CONTROL_POLICY.md` includes topology choice + verification constraints

### Assessment rubric (0-4 each, target ≥ 14/20)


| Category | 0 | 2 | 4 |
|---|---|---|---|
| Control & termination | loops frequently | basic limits | predictable termination + clear stop reasons |
| State correctness | implicit/fragile | partially explicit | explicit state + invariants enforced |
| Tool reliability | naive calls | basic retries | contracts + idempotency + side-effect controls |
| Safety gates | none | partial manual checks | approval/commit gate for writes |
| Debuggability | hard to trace | some logs | end-to-end traceability with IDs |

## Phase 3: Memory & Knowledge Systems (6-8 weeks)

### Core topics


**Memory tiers**

- Short-term context windows and token limits
- Long-term memory stores (vector DB / semantic search)
- Conversation summarization strategies and drift risks

**Retrieval and grounding**

- Chunking strategies, embeddings, indexing
- Reranking and relevance optimization
- Freshness and update policies

**Context engineering**

- Context shaping: prioritization, compression, structured context objects
- Source provenance and citations (internal)
- Conflict handling and "unknown" behaviors

**Retrieval evaluation**

- Query sets, expected sources, recall/precision proxies
- Faithfulness checks and hallucination controls (pragmatic)

**Multimodal / real-time option (recommended when relevant)**

- Audio: streaming partials, chunking, diarization assumptions
- Vision/video: frame sampling, metadata, temporal grounding
- Cancellation semantics and per-turn latency budgets
- Modality-aware provenance and evals

### Labs (required)


1. Add a knowledge base + retrieval tool to the agent.
2. Create a **retrieval eval set**:
	- at least 50 queries
	- expected sources for each query
	- regression tracking (CI gate)

### Deliverables (required)


- A knowledge-enabled agent with measurable retrieval quality and provenance.
- `CONTEXT_INGESTION.md` documenting:
	- ingestion/chunking conventions
	- provenance format
	- freshness/backfill policy
	- (optional) multimodal/streaming conventions

### Phase 3 checklist


-[] Documented ingestion pipeline and data lifecycle

-[] Retrieval tool with provenance returned

-[] Context shaping policy documented (what is included/excluded)

-[] Retrieval eval set (≥ 50 queries) + regression gate

-[] Handling for stale/conflicting sources

-[] `CONTEXT_INGESTION.md` exists and matches implementation

### Assessment rubric (0-4 each, target ≥ 14/20)


| Category | 0 | 2 | 4 |
|---|---|---|---|
| Retrieval quality | frequently irrelevant | mixed | consistently relevant on eval set |
| Grounding | unverified answers | partial citations | provenance-first with conflict handling |
| Context management | bloated/unstable | some pruning | clear policy + stable behavior |
| Data hygiene | ad hoc ingestion | basic pipeline | versioned pipeline + freshness plan |
| Eval rigor | none | small set | reproducible, regression-tracked suite |

## Phase 4: Reliability, Security, and Operations (6-8 weeks)

### Core topics


**Failure taxonomy**

- Tool failures, timeouts, partial results
- Model failures: format violations, non-compliance, drift
- Data failures: stale sources, conflicting truth, missing context
- Safety failures: unintended actions, policy violations

**Security and threat modeling (agent-specific)**

- Prompt injection and untrusted tool outputs
- Confused-deputy risks (model influenced to misuse permissions)
- Least privilege: scoped credentials, permission separation
- Secrets hygiene and safe logging
- Sandboxing strategies (filesystem/network), allowlists
- Audit logging and provenance for actions

**Observability and monitoring**

- Tracing across steps/tools, correlation IDs
- Correctness monitoring: task success, tool correctness proxies
- Cost and latency monitoring: TTFT, tokens/sec, p50/p95/p99, $/task
- Alerts on anomalous behavior patterns

**Serving SLOs and rollout gates (new, required)**

- Decompose latency: model vs retrieval vs tools
- Define SLOs and error budgets for: TTFT, p95, $/task, tool error rate
- Rollback rules: automatic gates based on eval + SLO regression
- Caching policies and data redaction as operational controls

**Recovery and safe fallback**

- Graceful degradation when tools fail
- Retry/circuit breakers with user-visible statuses
- Safe fallback modes and "human takeover" pathways

### Labs (required)


1. Build a **red-team suite** (≥ 10 attacks) including prompt injection attempts.
2. Add tracing and dashboards (or lightweight metrics endpoints).
3. Implement safe fallback behavior and a recovery playbook.
4. Add serving SLOs + rollback thresholds and demonstrate a canary rollback on a synthetic regression.

### Deliverables (required)


- A production readiness package: threat model + monitoring + safety gates + recovery plan.
- `SLO_AND_ROLLBACK.md` with:
	- target SLOs (TTFT/p95/$/task)
	- rollout policy (shadow/canary)
	- rollback triggers
	- incident triage checklist

### Phase 4 checklist


-[] Written threat model (assets, attackers, mitigations)

-[] Permission separation (read vs write tools) + least privilege

-[] Sandbox/allowlist strategy documented and enforced

-[] Tracing across agent steps and tools

-[] Alerts for cost/latency anomalies

-[] Runbook: common failures + recovery steps

-[] Red-team suite integrated into CI or pre-release checks

-[] `SLO_AND_ROLLBACK.md` implemented (not aspirational)

### Assessment rubric (0-4 each, target ≥ 16/24)


| Category | 0 | 2 | 4 |
|---|---|---|---|
| Threat modeling | none | partial | clear assets/attack paths/controls |
| Injection resistance | easily exploited | some mitigation | layered defenses + reduced blast radius |
| Observability | opaque | basic logs | traces/metrics + actionable alerts |
| Recovery | crashes/hangs | manual recovery | graceful fallback + runbook |
| Policy compliance | unclear | partial | explicit policy checks + audit trail |
| Operational readiness | not deployable | demo only | staging-ready with release gates |

## Phase 5: Orchestration, Multi-Agent, and Serving (6-8 weeks)

### Core topics


**Decomposition patterns**

- Coordinator/worker, planner/executor, specialist roles
- Shared state vs message passing

**Coordination and arbitration**

- Consensus patterns and conflict resolution
- Scorecards and judges/critics (with strict constraints)

**Scaling and performance**

- Concurrency, queuing, caching
- Rate limiting and backpressure
- Cost ceilings and budget allocation per agent

**Inference economics (new emphasis)**

- Measure: TTFT, tokens/sec, p95, $/successful task
- Prompt caching vs semantic caching vs response caching (trade-offs)
- Model routing (small/fast vs large/strong), budget-aware escalation
- Continuous batching concepts and when they matter
- Load testing methodology and regression tracking

**Evaluation for multi-agent**

- Per-agent metrics + end-to-end task success
- Attribution of failures to steps/tools/agents

### Labs (required)


1. Build a 3-agent system:
	- planner
	- researcher
	- executor (tool-using)
2. Add load tests and enforce cost ceilings.
3. Add caching + routing and show before/after metrics for TTFT/p95/$ per successful task.

### Deliverables (required)


- Multi-agent system with measured throughput, cost envelope, and reliability.
- `LOAD_TEST_PLAN.md` describing:
	- target load
	- metrics collection
	- pass/fail thresholds
	- regression tracking
- `SERVING_CONFIG.md` and `ROUTING_POLICY.md` capturing:
	- model choices
	- routing rules
	- caching strategy
	- budget-aware escalation

### Phase 5 checklist


-[] Clear division of responsibilities among agents

-[] Shared observability (cross-agent traces)

-[] Arbitration mechanism for conflicting outputs

-[] Load test suite + concurrency controls

-[] Cost ceilings and per-agent budget enforcement

-[] E2E success metric + regression tracking

-[] `SERVING_CONFIG.md` + `ROUTING_POLICY.md` exist and match code

### Assessment rubric (0-4 each, target ≥ 16/24)


| Category | 0 | 2 | 4 |
|---|---|---|---|
| Decomposition | chaotic roles | partial separation | clean roles + minimal overlap |
| Coordination | frequent deadlocks | works in simple cases | robust routing + conflict handling |
| Scaling | breaks under load | limited scaling | stable under defined load envelope |
| Cost control | unbounded | basic budgets | enforced budgets + alerts |
| Observability | hard to attribute | partial traces | clear attribution across agents |
| Eval coverage | none | some scenarios | scenario + load + regression suites |

## Phase 6: Framework Ports + Capstone (8+ weeks)


Frameworks are implementation targets. The curriculum requires **portability**.

### Core topics


- Portability patterns: keep logic in modules (state, tools, evals, serving configs), orchestration as a thin layer
- Deployment: containers/serverless, secrets management, state across requests
- Release engineering for agents: versioning prompts/tools, regression gates, canaries

### Required "two-stack" port


Implement the same agent design in two stacks:

1. **Minimal in-house orchestrator** (simple graph/state machine)
2. **External framework** of choice (selected by the learner/team)

### Capstone project (required)


Build a **production-ready agent system** that:

- solves a real problem (automation, analysis, support, research)
- uses 2+ agents or a non-trivial orchestration graph
- includes evaluation, monitoring, serving SLOs, and a threat model
- demonstrates safe, controlled autonomy (approval gates for write actions)
- runs in a staging environment with observability

### Capstone acceptance criteria (must meet all)


-[] Regression suite passes (scenario + tool + retrieval if applicable)

-[] Red-team suite passes or documented mitigations exist

-[] Threat model doc included and reviewed

-[] Monitoring: traces + cost/latency metrics + alert thresholds

-[] Serving envelope measured: TTFT/p95/tokens-sec/$ per successful task

-[] Rollout policy exists: shadow/canary + rollback triggers

-[] Runbook: top failure modes + recovery steps

-[] Demonstrated bounded autonomy: budgets + termination + approval gates

-[] Ported to two stacks with comparable behavior

### Capstone rubric (0-4 each, target ≥ 22/28)


| Category | 0 | 2 | 4 |
|---|---|---|---|
| User value | unclear | some utility | clear value + realistic workflow |
| Reliability | fragile | moderate | robust under expected conditions |
| Security | unsafe | partial controls | layered controls + auditability |
| Evaluation | minimal | decent | comprehensive + regression-tracked |
| Observability | opaque | basic | traces + actionable metrics/alerts |
| Serving/perf | unmeasured | partial metrics | measured envelope + regression gates |
| Portability | one-off | partial port | clean two-stack port |

## Specialization tracks (choose 1-2 after Phase 4)


These tracks modify Phase 5/6 labs and capstone focus.

### Track A: Agent Evaluation Engineer


- Scenario design for multi-step tasks
- Adversarial test generation, failure clustering
- Automated evaluation pipelines and regression gates
- Metrics for tool-use correctness and end-to-end success

**Track deliverable**

- Evaluation harness package reusable across projects (CLI + reporting)

### Track B: Multi-Agent Systems Engineer


- Choreography vs orchestration tradeoffs
- Arbitration strategies and conflict resolution
- Scaling from 2 agents to many
- Distributed execution patterns

**Track deliverable**

- Multi-agent orchestration library with observability hooks

### Track C: Knowledge & Context Engineer


- Advanced RAG: reranking, freshness policies, provenance
- Domain knowledge bases and ingestion pipelines
- Context compression and prioritization
- Retrieval evaluation methodology

**Track deliverable**

- Versioned knowledge pipeline + retrieval eval suite with dashboards

### Track D: Agentic Systems at Scale


- Cost optimization and token efficiency
- High concurrency design and throughput testing
- Resilience/failover strategies
- Observability at scale

**Track deliverable**

- Performance + cost envelope report with load-test artifacts

### Track E: Agent Security Engineer


- Threat modeling and security testing for tool-using agents
- Sandboxing, allowlists, permission separation
- Audit logging and action provenance
- Prompt injection resistance and blast-radius reduction

**Track deliverable**

- Security checklist + red-team suite + hardening guide for a reference agent

### Track F: Agent Platform Engineer


- Shared tool platform design, tool catalogs, permissioning
- Observability primitives and standard trace schemas
- CI gates for prompts/tools/evals
- Governance: reviews, approvals, versioning, rollout policies

**Track deliverable**

- Internal platform template: tool SDK + tracing + eval gate integration

### Track G: Inference & Serving Engineer


- Serving SLOs (TTFT/p95/tokens-sec/$ per task)
- Caching strategies (prompt/semantic/response) and invalidation
- Routing and budget-aware escalation
- Load testing + regression tracking for cost/latency

**Track deliverable**

- Serving playbook: load tests + routing policy + cost/perf regressions dashboard

### Track H: Multimodal / Real-Time Agent Engineer


- Streaming pipelines (ASR/TTS/vision) and cancellation semantics
- Modality-aware context shaping and provenance
- Real-time UX constraints and tail-latency mitigation

**Track deliverable**

- Real-time agent demo with modality-specific eval slice and latency gates

### Track I: Product Agent Engineer


- Domain modeling depth: entities, workflows, and user success metrics
- Personalization/memory semantics with explicit policies
- KPI-to-eval translation and iterative improvement loops

**Track deliverable**

- Product spec + eval suite + measured outcome report for a realistic workflow

## Cross-functional skills (ongoing)

### Product thinking


- Define success metrics that matter (task success, time saved, risk reduced)
- Balance autonomy with user control
- Iterate using user feedback and observed failures

### Systems design


- Scalability and external dependency reliability
- Reproducibility and debugging strategy
- Cost/performance trade-offs and budgets

### Communication and documentation


- Explain agent behavior and limits
- Document decision trees, failure modes, and mitigations
- Incident postmortems and continuous improvement

## Recommended artifacts (templates)


Include these in every agent repository by Phase 4:

- `README.md` (setup, usage, limits)
- `PROBLEM_SPEC.md` (goals, constraints, KPIs, autonomy tier)
- `DOMAIN_MODEL.md` (entities/actions -> tools -> memory)
- `DESIGN.md` (architecture, state model, tool contracts)
- `CONTROL_POLICY.md` (topology, budgets, termination, verification rules)
- `THREAT_MODEL.md` (assets, risks, mitigations)
- `EVALS.md` (datasets, rubrics, how to run, how to interpret)
- `CONTEXT_INGESTION.md` (ingestion, provenance, freshness, multimodal notes)
- `SLO_AND_ROLLBACK.md` (SLOs, rollout, rollback triggers)
- `SERVING_CONFIG.md` (batching/caching/routing knobs, budgets)
- `ROUTING_POLICY.md` (model selection + escalation rules)
- `LOAD_TEST_PLAN.md` (load, metrics, thresholds)
- `RUNBOOK.md` (alerts, common incidents, recovery steps)
- `CHANGELOG.md` (prompt/tool/serving changes + expected impact)
- `POLICY.md` (data handling and action policies)

## Continuous learning


Ongoing priorities:

- Read agent research and primary technical documentation from model/tool providers
- Maintain regression suites as models and tools evolve
- Regularly update threat models and red-team scenarios
- Track cost/performance envelope over time
