---
draft: false
toc: true
title: "Syllabus"
linkTitle: "Syllabus"
---
## Course: Agent Engineering -- Specifications, Control, and Reliable Autonomy

### Course description


Agent engineering is the discipline of building AI systems that **take actions over time** (often via tools/APIs/actuators) while remaining **specifiable, evaluable, and controllable**. The course treats "agentic" behavior as a full-stack problem: formal decision processes and constraints; agent-loop architectures; tool and environment design; evaluation harnesses; safety/security; and deployment operations.

### Prerequisites


- Strong Python proficiency
- Basic ML + LLM familiarity
- Comfort with probability and software engineering fundamentals

### Learning outcomes


By the end, students can:

1. Write an agent **spec** with explicit goals, constraints, unacceptable behaviors, and authority boundaries.
2. Design **tool interfaces** with typed schemas, side-effect control, idempotence, and auditability.
3. Implement agent loops (planner-executor, ReAct-style, etc.) and diagnose failures. ([arXiv](https://arxiv.org/abs/2210.03629 "ReAct: Synergizing Reasoning and Acting in Language Models"))
4. Build **evaluation harnesses** (simulators, offline replay, adversarial tests) and interpret results on established benchmarks. ([arXiv](https://arxiv.org/abs/2307.13854 "WebArena: A Realistic Web Environment for Building Autonomous Agents"))
5. Apply safety methods (constraints/CMDPs, runtime enforcement/shielding) and security threat modeling for tool-using agents. ([arXiv](https://arxiv.org/html/2505.17342v1 "A Survey of Safe Reinforcement Learning and Constrained ..."))
6. Operate agents in production: monitoring, incident response, staged rollouts, and governance.

### Assessment (suggested)


- 20% Reading memos (weekly, 1-2 pages; "claim-evidence-failure modes-questions")
- 25% Labs (5 labs, 5% each)
- 15% Midterm (take-home design review + critique of an agent system)
- 40% Capstone project (code + evaluation report + safety/security dossier + demo)

## Weekly schedule (14 weeks)

### Week 1 -- What "agent engineering" is (and isn't)


- Topics: agent loop as an engineered system; authority and side effects; long-horizon failure modes; "glue code" vs cognitive competence.
- Lab 0 (setup): reproducible runs, logging, tracing, experiment tracking.

### Week 2 -- Formal foundations for acting systems


- Topics: MDPs/POMDPs (quick survey), partial observability, reward vs constraints, cost-aware decision making.
- Deliverable: **Problem statement + environment boundary** (what can the agent change? what must never change?).

### Week 3 -- Agent-loop architectures


- Topics: planner-executor, deliberation vs action, reflection/repair patterns, interleaving reasoning and actions.
- Required reading: ReAct. ([arXiv](https://arxiv.org/abs/2210.03629 "ReAct: Synergizing Reasoning and Acting in Language Models"))
- Lab 1: implement a minimal ReAct-style agent loop with tool calls and structured observations. ([arXiv](https://arxiv.org/abs/2210.03629 "ReAct: Synergizing Reasoning and Acting in Language Models"))

### Week 4 -- Tools and environments as first-class engineering objects


- Topics: typed schemas; contracts; idempotence; transactional boundaries; rate limits; least privilege; auditing.
- Lab 2: design a tool API surface for a "real" domain (e.g., ticketing, infra ops, research assistant) with a permission model and audit log.

### Week 5 -- State, memory, and provenance


- Topics: session state vs long-term memory; retrieval design; consistency; provenance/attribution; "memory as data product."
- Deliverable: memory spec (what is stored, retention, access control, redaction rules).

### Week 6 -- Planning and control beyond prompts


- Topics: hierarchical planning; task decomposition; plan validation; model-based rollouts; bounded autonomy (budgets, timeouts).
- Optional reading: tool-use training perspective (Toolformer). ([arXiv](https://arxiv.org/abs/2302.04761 "Toolformer: Language Models Can Teach Themselves to Use Tools"))

### Week 7 -- Uncertainty, abstention, and safe action selection


- Topics: calibrated confidence; abstain/ask/diagnose/hand-off policies; reversible vs irreversible actions; "safe probes" to reduce uncertainty.
- Lab 3: implement an abstention + escalation policy and measure how it changes success rate vs harmful actions.

### Week 8 -- Safety constraints as engineering: CMDPs and runtime enforcement


- Topics: constrained objectives; safe exploration; constraint satisfaction in sequential decisions; runtime enforcement and shields.
- Required reading: Safe RL/CMDP survey (pick key sections). ([arXiv](https://arxiv.org/html/2505.17342v1 "A Survey of Safe Reinforcement Learning and Constrained ..."))
- Required reading: shielding overview. ([TUGraz Elsevier Pure](https://tugraz.elsevierpure.com/ws/portalfiles/portal/93576031/Shields_for_Safe_Reinforcement_Learning.pdf "Shields for Safe Reinforcement Learning"))
- Deliverable: explicit constraint set + enforcement plan (design-time + runtime).

### Week 9 -- Benchmarks and what they really measure


- Topics: environment realism; leakage; evaluator brittleness; success metrics; cost metrics; reproducibility.
- Required readings (choose 2): WebArena, WebShop, ALFWorld, AgentBench, OSWorld. ([arXiv](https://arxiv.org/abs/2307.13854 "WebArena: A Realistic Web Environment for Building Autonomous Agents"))
- Lab 4: run a baseline agent on one benchmark (or a small internal task suite), produce a failure taxonomy.

### Week 10 -- Evaluation harnesses for agents (offline + online)


- Topics: offline replay; simulator fidelity; adversarial test generation; red-team protocols; measuring side effects; regression testing for agent behavior.
- Resource: curated benchmark list for survey/coverage mapping. ([GitHub](https://github.com/zhangxjohn/LLM-Agent-Benchmark-List "zhangxjohn/LLM-Agent-Benchmark-List"))

### Week 11 -- Security engineering for tool-using agents


- Topics: threat modeling; prompt injection; tool output poisoning; data exfiltration; sandboxing; secrets handling; supply-chain risks.
- Required reading: ST-WebAgentBench (safety/trustworthiness evaluation for web agents). ([arXiv](https://arxiv.org/html/2410.06703v5 "ST-WebAgentBench: A Benchmark for Evaluating Safety ..."))
- Deliverable: threat model + mitigations + test plan.

### Week 12 -- Human oversight, traceability, and accountability


- Topics: mixed-initiative control; approval workflows; accountability in multi-agent delegation; mechanistic traces vs post-hoc narratives; audit readiness.
- Studio: design review of capstone specs (peer + instructor).

### Week 13 -- Operating agents in production


- Topics: staged rollout/canaries; monitoring & SLOs; incident response; rollback; continuous evaluation; governance and change management.
- Deliverable: ops plan (dashboards, alerts, runbooks, postmortem template).

### Week 14 -- Capstone demos and "engineering case law"


- Activities: demos, red-team results, lessons learned; building a shared catalog of failure modes and mitigations.

## Labs (concrete expectations)


1. **Agent loop + tool calling**: structured actions/observations, deterministic replay.
2. **Tool contracts**: schema validation, permission checks, side-effect journaling.
3. **Abstention + escalation**: confidence gates, safe diagnostics, human handoff.
4. **Benchmark run + failure taxonomy**: reproduce, measure, categorize.
5. **Safety/security hardening**: constraints + runtime enforcement + prompt-injection defenses, with tests.

## Capstone project (what "good" looks like)


A production-minded agent for a bounded domain (examples: ops triage, procurement assistant, research analyst, customer-support resolver), shipped with:

- Written **spec** (goals, constraints, unacceptable behaviors, authority)
- **Tool layer** (typed schemas, least privilege, audit logs, rollback plan)
- **Evaluation suite** (task set, adversarial tests, cost/latency metrics)
- **Safety/security dossier** (threat model, mitigations, red-team results)
- **Ops plan** (monitoring, alerts, incident playbooks)

If you want, I can also format this into a university-style syllabus document (catalog description, weekly homework prompts, rubrics, and a reference reading packet).
