---
draft: false
toc: true
title: "Ae Framework"
linkTitle: "Ae Framework"
---
# AI Agent Engineering Framework (Product Logic + Cognitive Architecture + Serving + Infra + Adaptation + RAG)


This framework is for roles where the primary value is **shipping reliable, cost-efficient agentic systems**: tool-using, stateful workflows in production, with explicit choices around **cognitive architecture**, **model serving/inference**, and **adaptation strategy** (prompting/RAG/PEFT/fine-tuning) using a systems-first approach.

## Scope of the role


You own the agentic system as a production service:

- Runtime architecture: orchestration, state, tool layer, retrieval, model gateway.
- Reliability: correctness, safety constraints, deterministic interfaces.
- Lifecycle: evaluation, CI/CD, monitoring, incident response, continuous improvement.
- Adaptation: choosing and operationalizing the right mechanism (scaffolding vs retrieval vs weight updates).

## Pillar 0 -- Product logic & domain modeling (problem framing -> evals)


Agent engineering starts with the product and domain, not the orchestration.

### What you define


- The user journey and success criteria (KPIs + acceptance criteria).
- A domain model: business entities -> tool schemas -> memory representations.
- The risk tier and autonomy envelope (what can be auto-executed vs must be approved).
- The evaluation plan that operationalizes "does it do what the user wants?"

### What good looks like


- Requirements are encoded as scenario specs and measurable evals (offline + online).
- Tool definitions reflect domain concepts (not generic "do_task" tools).
- Memory is intentionally designed (what is remembered, for how long, and why).

### Artifacts


- `PRD_TO_EVAL.md` (requirements -> scenarios -> metrics -> gates).
- `DOMAIN_MODEL.md` (entities, invariants, workflows, error taxonomy).
- `MEMORY_MODEL.md` (what is stored, lifecycle, privacy constraints).

## Core principle: layered design


Treat "agentic behavior" as the combined effect of three layers. Keep them separate in reviews and change management.

### Layer 1: Model-level adaptation


Change model behavior via instruction tuning / domain tuning / PEFT / tool-use tuning / distillation.

### Layer 2: System-level scaffolding


Orchestration loop/graph, state & memory, tool contracts, retrieval, verification, guardrails.

### Layer 3: Agent-level learning


Trajectory-level improvement from logs/feedback: dataset construction, reward modeling, reranking/RL-style updates, but always with strict offline validation and rollback.

Deliverable per capability: a short **Layered Decision Record**:

- What is solved by scaffolding?
- What is solved by retrieval?
- What requires adaptation?
- What are the risks and eval gates?

## Pillar A -- Orchestration and control (state, termination, budgets)

### What you design


- An explicit control loop or graph (DAG/state machine), not implicit "chat."
- Termination conditions and budgets (steps, time, tokens, tool calls, cost).
- Clear separation of: intent -> plan -> execute -> verify -> commit.
- An explicit *cognitive architecture* (reasoning topology), not just control flow:
	- Single-step tool use (router + call)
	- ReAct-style think/act loops (bounded)
	- Plan-then-execute (planner + executor)
	- Graph / multi-agent decomposition (parallel sub-tasks)
	- Reflection / verification loops (only when justified by evals)
- A selection rationale: which topology fits the task shape and risk tier.

### What good looks like


- Explicit state model with transitions and invariants.
- Resumable execution (persisted state, replayable traces).
- Bounded autonomy: write actions require gates/approval and auditability.

### Artifacts


- `STATE_MODEL.md` (state schema, transitions, invariants, stop reasons).
- `CONTROL_POLICY.md` (budgets, termination rules, escalation paths).
- `COGNITIVE_ARCHITECTURE.md` (topology choice, routing rules, when reflection is allowed, failure modes).

### Failure modes


- Infinite loops, implicit state, non-replayable behavior.
- "Helpful" actions without explicit commit boundaries.

## Pillar B -- Tooling layer (contracts, idempotency, safe actuation)

### What you design


- A tool registry with schema, permissions, versions, and reliability policy.
- A strict interface: typed inputs/outputs, validation, parsing/repair strategy.
- Read/write separation for tools with side effects.

### What good looks like


- Idempotency keys for write tools; dedupe and replay safety.
- Retries/backoff/circuit breakers per tool; timeouts by default.
- Audit log for every tool call, correlated to run/trace IDs.

### Artifacts


- `TOOLS.md` (catalog, schemas, versions, retry/timeout policy, permissions).
- `AUDIT_LOG_SCHEMA.md` (what is stored; PII policy; retention).
- Tool contract tests (schema compliance + error-handling behavior).

### Failure modes


- Best-effort HTTP calls with no contracts.
- Side effects without idempotency or approvals.

## Pillar C -- Knowledge and retrieval (RAG + context engineering)


Treat RAG as infrastructure: ingestion + freshness + provenance + evaluation.

### What you design


- Ingestion pipeline: chunking, metadata, access control, backfills, freshness.
- Multimodal context (when applicable): audio/video segmentation, frame extraction, ASR transcripts, and alignment between modalities.
- Retrieval policy: dense/hybrid, reranking, query rewriting, filters.
- Context shaping: inclusion/exclusion rules, compression, citations/provenance.
- Context lifecycle (ACE): pruning/expiry, distillation into reusable heuristics, and procedural "playbooks" that reduce future token spend.

### What good looks like


- Provenance returned as structured data (doc IDs, spans, timestamps).
- Retrieval is evaluated and regression-tested (expected sources).
- Clear freshness SLA and invalidation/backfill strategy.

### Artifacts


- `INGESTION.md` and `FRESHNESS.md` (SLA, rebuild, backfill).
- `MULTIMODAL_CONTEXT.md` (modalities supported, chunking/segmentation strategy, streaming constraints, evaluation hooks).
- `RETRIEVAL_EVALS.md` (query set, expected sources, metrics, gates).
- `CONTEXT_POLICY.md` (what context is allowed, max sizes, compression rules).
- `CONTEXT_LIFECYCLE.md` (pruning rules, summarization cadence, playbooks/procedural memory, drift checks).

### Failure modes


- No provenance (can't debug).
- No freshness policy (silent drift).

## Pillar D -- Model serving & adaptation (inference physics + strategy + operations)

### Serving & inference strategy (non-optional at senior/staff level)


Treat generation as a resource-managed system with explicit performance and cost targets.

- Key metrics: time-to-first-token (TTFT), end-to-end latency p50/p95, tokens/sec, GPU/CPU utilization, $/task, cache hit rate.
- Throughput/latency levers: continuous batching, streaming, concurrency limits, and backpressure.
- KV/prompt reuse: prefix caching / KV cache reuse where supported; semantic caching for repeated intents.
- Decoding strategies: speculative decoding (when available), max token caps, stop sequences, and early-exit policies.
- Model selection & routing: small/fast model first -> escalate to larger model; tool-call capable model for actuation steps.
- Prompt compression: structured summaries, lossy compression policies, and context budgets tied to evals.
- Token economics: optimize for cost-to-outcome (not just $/token); route "cheap models" for cheap steps, reserve frontier models for high-leverage decisions.
- Deployment keywords to be fluent in (examples): vLLM / TGI / Triton / SGLang, GPU autoscaling, model sharding, quantization.

Artifacts:

- `SERVING_CONFIG.md` (batching, concurrency, cache policy, routing rules, GPU memory budgets).
- `COST_MODEL.md` (cost-to-serve assumptions, token economics, per-path cost envelope).
- `LOAD_TEST_PLAN.md` (latency/throughput targets, realistic traffic, regressions).

### Decision framework: Prompt vs RAG vs Adaptation


Use this order unless there is a strong reason not to:

1. **System scaffolding** (schemas, tool contracts, verification, control loop)
- Best for reliability, safety boundaries, determinism.
1. **RAG / context engineering**
- Best when errors are missing/incorrect knowledge or need grounding.
1. **Weight updates / adapters**
- Best when you need persistent behavioral shifts that scaffolding/RAG can't deliver.

### Adaptation modes and what they are for

#### 1. Instruction/alignment tuning


Use when:

- You need consistent instruction-following and output format compliance.

Watch-outs:

- Can create over-obedience; does not guarantee planning or safety.

Deliverables:

- Schema compliance test suite; policy adherence eval; rollback path.

#### 2. Domain adaptation


Use when:

- Domain language/ontology/workflow patterns are core and stable.

Watch-outs:

- Over-specialization can harm general robustness.

Deliverables:

- Domain eval set + general robustness set; leakage checks.

#### 3. PEFT/LoRA (adapter strategy)


Use when:

- You need multiple role/capability variants on one base model, fast iteration and rollback.

Watch-outs:

- Adapter/tool schema drift; overfitting to trace patterns.

Deliverables:

- Adapter registry + compatibility matrix: adapter version vs tool schema versions.

#### 4. Tool-use-aware training


Use when:

- You need better tool selection/calling behavior beyond what prompting achieves.

Watch-outs:

- Optimizes imitation of traces; can cause tool overuse; brittle to API evolution.

Deliverables:

- Separate eval: tool correctness vs end-to-end task success vs safety.

#### 5. Distillation / quantization


Use when:

- Latency/cost constraints require smaller/faster models.

Watch-outs:

- Capability collapse on long-horizon tasks.

Deliverables:

- `SERVING_CONFIG.md` + routing policy; latency/cost envelope tests; load tests; regression gates.

### Operationalizing adaptation (non-negotiables)


- Dataset versioning and lineage; filtering rules; contamination/leakage checks.
- Training configs as code; reproducible runs.
- Promotion gates: offline eval thresholds + canary rollout + rollback.
- Change log/model card and compatibility notes.

## Pillar E -- Evaluation-first development (offline + online)

### What you measure


Agent systems need closed-loop metrics; LM metrics alone are insufficient.

Minimum dimensions:

- Task success rate (in realistic scenarios/environments).
- Tool-use correctness (schema validity, argument validity, error recovery).
- Retrieval quality (expected sources/provenance).
- Interaction efficiency (steps-to-success, loop rate, time-to-resolution).
- Safety/compliance (policy violations, risky tool sequences).
- Calibration (abstain/escalate when uncertain).

### What good looks like


- Regression suites in CI for prompts/tools/retrieval/adapters.
- LLM-as-judge + human-calibrated rubrics for qualitative outputs when exact assertions are not possible.
- Step-level unit tests: tool selection, schema validity, policy gates, retrieval expectations (independent of final prose).
- Golden traces or tool simulators where possible.
- Clear baselines: prompt-only, RAG-only, and adapted variants.

### Evaluation mindset (how you work)


- Treat evals as unit tests: every prompt/tool/routing/retrieval change must pass regression gates.
- Maintain judge prompts + rubrics as versioned artifacts; periodically re-calibrate against human labels.
- Use golden traces and tool simulators for determinism where possible; use shadow/canary for online verification.

### Artifacts


- `EVALS.md` (metrics, datasets, thresholds, gating rules).
- `JUDGE_RUBRICS.md` (rubrics, calibration set, judge model/version policy).
- `GOLDEN_TRACES/` (recorded tool sequences + expected decisions, when applicable).
- `TEST_SCENARIOS/` (scenario specs, expected outcomes).

## Pillar F -- Observability and operations (agent fleet SRE)

### What you operate


- Traces across agent steps + tool calls + retrieval + model calls.
- Dashboards/alerts for correctness proxies and degradation.

### What good looks like


- Correlated telemetry: run ID, user/session, tool call IDs, retrieval IDs.
- Alerting on: tool error rate, loop rate, stop reasons, schema failures, retrieval misses, latency/cost spikes.
- Serving observability: TTFT, tokens/sec, cache hit rate, batch utilization, GPU memory pressure, and queueing/backpressure indicators.
- Runbooks: diagnose, mitigate, rollback, communicate.

### Artifacts


- `RUNBOOK.md` (alerts -> diagnosis -> mitigation -> rollback).
- `SLOS.md` (latency, success, safety constraints).
- `PERF_DASHBOARDS.md` (serving metrics, cost metrics, regression alerts).

## Pillar G -- Security, governance, and safe autonomy

### What you design


- Least privilege tool permissions; allowlists; sandboxing where possible.
- An agency scope matrix: suggest -> execute-with-approval -> execute (by tool and risk tier).
- Prompt-injection model: direct vs indirect injection (e.g., untrusted web/content as hostile input).
- Sandboxed execution for code tools (ephemeral sessions; strong isolation for untrusted code paths).
- Prompt-injection and confused-deputy defenses.
- Auditability and PII-aware logging.

### What good looks like


- Threat model includes: prompt injection, data exfiltration, unsafe tool chaining, privilege escalation.
- Red-team suite plus mitigations and regression tests.
- Explicit rules for write actions: approvals, budgets, and human-in-the-loop when required.

### Artifacts


- `THREAT_MODEL.md`, `REDTEAM.md`, `POLICY.md` (logging/PII, retention).

## Pillar H -- Platform enablement (reusability and portability)

### What you build


- Shared SDKs/templates: tool contracts, logging, eval harnesses, rollout patterns.
- Orchestration as replaceable layer; business logic modular.

### What good looks like


- A team can build a new agent by composing standard modules.
- Portability: the same agent design can run across orchestration stacks with minimal changes.

### Artifacts


- Reference implementation repo layout; internal docs; "golden path" templates.

## Review checklist (use in design + code reviews)


- Control + cognition: Are state, budgets, termination, and the chosen reasoning topology explicit (and justified)?
- Tools: Are contracts strict, versioned, and safe for side effects?
- Retrieval: Is provenance available and is freshness defined?
- Adaptation: Is there a justified decision for scaffolding vs RAG vs weights?
- Serving: Are latency/throughput/cost targets explicit, and do we have caching/routing/batching configs and load tests?
- Evals: Are changes gated by offline regression tests?
- Ops: Can we debug a single run end-to-end? Do we have rollback?
- Security: Is least privilege enforced? Is there a red-team suite?

## Common anti-patterns


- Treating "agent = prompt" (no state model, no tool contracts, no eval gates).
- Fine-tuning before system scaffolding and retrieval are under control.
- Shipping without provenance, without stop reasons, without replayability.
- Updating from logs without strict offline validation and rollback.

## Hiring signals for fundamentals/infra roles


Strong signals (evidence-based):

- Built production services with CI/CD, observability, and incident ownership.
- Built a tool layer with schema validation, idempotency, and audit logs.
- Built evaluation harnesses that gate releases (not manual testing).
- Can articulate adaptation choices and run controlled model lifecycle (datasets, gates, rollback).
- Can design a RAG system with provenance + freshness + retrieval evaluation.
- Can optimize cost-to-serve via caching, model routing, batching/streaming, and prompt compression with measurable perf targets.

## Appendices (terminology + background)


These sections provide shared language and design intuitions. The pillars above remain the operational checklist.

### Appendix A -- What "agent engineering" means (vs prompt/MLE)


Agent Engineering is the discipline of building systems where an LLM controls a loop/graph to take actions in an environment (tools, APIs, data stores), not just generating text. The primary artifact is the **cognitive architecture** (control + memory + tool I/O), and the primary metric is **cost-to-outcome** (success rate under constraints).

| Feature | Prompt engineering | ML engineering | Agent engineering |
|---|---|---|---|
| Core objective | High-quality generation | Model quality + serving | Goal completion + reliable action |
| Control flow | Human-driven | Pipeline-driven | AI-driven within constraints |
| Primary artifact | Prompt | Weights + training code | Cognitive architecture |
| Key metrics | Preference scores | Accuracy/latency/throughput | Success, step count, cost-to-outcome |

### Appendix B -- Memory taxonomy (map to Pillar 0/C)


The context window is working memory: fast, limited, volatile. Production agents usually need explicit long-term memory:

- **Working memory (short-term):** current task state, last tool results, active plan.
- **Episodic memory (long-term):** prior runs/episodes (what happened last time); useful for retry/avoid repeating mistakes.
- **Semantic memory (knowledge base):** domain facts and docs; typically implemented via RAG.
- **Procedural memory (playbooks):** "how-to" procedures distilled from successful runs; retrieved like docs but action-oriented.

### Appendix C -- Reasoning patterns and when to use them (map to Pillar A)


- **Router + single-step tool use:** high-volume, low-risk actions (classification, lookups).
- **ReAct loop:** interactive tool use when the agent must adapt to observations; keep bounded.
- **Plan-then-execute:** complex tasks where a stable plan improves reliability; enforce commit gates.
- **Tree/branching search (ToT):** only for high-stakes decisions where extra compute is justified by evals.
- **Reflection/verification:** use as a targeted verifier, not an unbounded "think harder" loop.

### Appendix D -- Agentic Context Engineering (ACE) and context rot (map to Pillar C)


Static "append everything" context strategies fail due to cost/latency and *context rot* (noise overwhelms signal). Treat context as a living artifact:

- **Generator:** runs the task using current context.
- **Reflector:** extracts why it failed/succeeded (missing heuristics, irrelevant noise, wrong retrieval).
- **Curator:** updates the playbook: prune, distill, add a rule, update procedural memory.

### Appendix E -- Interoperability: MCP-style tool/resource layers (map to Pillar B)


When you have many tools and data sources, avoid building bespoke connectors for every agent×system pair. Use a standardized interface layer where servers expose:

- **Resources:** readable data (files, logs, records)
- **Prompts:** reusable templates
- **Tools:** executable functions

Where possible, prefer remote code execution/sampling on the server side for large data operations to avoid shipping raw data into the context window.

### Appendix F -- Human-agent interaction patterns (map to Pillar 0/A/B)


- **Trust & transparency:** show what the agent is doing (steps, tool calls) so waiting feels intentional.
- **Confidence calibration:** the UI should expose uncertainty via "ask/confirm" behaviors.
- **Latency masking:** streaming partial results; optimistic UI for reversible actions.
- **HITL:** for high-stakes actions, the agent proposes; the user/policy confirms; commit executes.

### Appendix G -- Economics: token ROI and outcome alignment (map to Pillar D)


Agents can burn large token budgets through planning/search. Optimize *token ROI* by:

- Routing: cheap models for cheap steps; frontier models only where they change outcomes.
- Compute budgets tied to evals: don't pay for extra reasoning unless it improves success.
- Pricing/measurement mindset: track cost-to-outcome (what it costs to achieve a successful run), not just $/token.
