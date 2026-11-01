---
draft: false
toc: true
title: "6.5 Agent-Runtime Evaluation and Benchmarks"
description: "An agent-runtime evaluation proposal comparing durability, policy, temporal, and compiled-plan baselines through repeated traces, injected faults, and specification mutations, measuring useful completion separately from safety and overhead."
weight: "50"
linkTitle: "6.5 Agent-Runtime Evaluation"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The following runtime passage comes from [Programmable probabilistic agent computation]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}). Its numbered citations point to the shared bibliography through the local links below. The complete cross-application metric framework remains intact.

## Scope and related evaluation notes


- [Investigation evaluation and benchmarks]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) retains the bounded-corpus plan.
- [Behavioral compilation evaluation and failure modes]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) retains the synthesis analyses and synthetic experiment.
- [Evaluation comments]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) explain what the three plans can and cannot establish.

## Benchmarks, baselines and experimental design


Current benchmarks are fragmented by the property they measure. That is useful for this programme because the core thesis should be tested against several failure classes, not a single aggregate "agent score".

**AgentDojo** was introduced at NeurIPS 2024 as a dynamic environment for tool-using agents that combines realistic user tasks with security test cases; its benchmark contains 97 tasks and 629 security cases. ([Debenedetti et al. 2024](#debenedetti-2024)) **Agent Security Bench** broadens adversarial evaluation across ten scenarios, more than 400 tools and multiple attack/defence methods. ([Zhang et al. 2024](#zhang-2024)) **MCP-SafetyBench**, accepted at ICLR 2026, specifically targets multi-step safety problems involving real MCP servers and cross-server attacks. ([Zong et al. 2026](#zong-2026)) These are good tests for capabilities, taint tracking, preconditions and policy enforcement.

**τ-bench** is particularly valuable for stateful business agents because correctness is judged through interaction with simulated users and tools and can be checked against final database state. Its pass^k framing is also useful because one successful run says little about a stochastic agent's repeated reliability. ([Yao et al. 2024](#yao-2024)) SEVerA already uses the newer τ² setting as one evaluation domain. ([Banerjee et al. 2026](#banerjee-2026))

**WebArena** supplies realistic long-horizon web tasks with executable functional evaluation; its original ICLR 2024 paper showed a very large gap between its GPT-4-based baseline and human performance. ([Zhou et al. 2024](#zhou-2024)) **OSWorld** gives a real computer-use setting, while **SWE-bench** provides repository-level software-engineering tasks whose outcomes can be checked by executable tests. ([Xie et al. 2024](#xie-2024); [Jimenez et al. 2023](#jimenez-2023)) These are good settings for studying long-running state, retries, irreversible effects and recovery.

For research/investigation workloads, **ScienceAgentBench** and the proposed bounded-corpus benchmark can add the epistemic dimension: source completeness, provenance, contradiction preservation and correct abstention. ([Chen et al. 2024](#chen-2024)) The author's startup notes already propose a benchmark with required evidence, distractors, contradictions, superseded sources and unanswerable questions. ([Project note: startup](#note-startup)) The proposal is to keep that: general agent benchmarks rarely measure whether all critical evidence was considered.

A serious first evaluation could use the following baseline ladder:

| Baseline | What it tests |
|---|---|
| **Free-form ReAct/tool agent** | Cost of having no symbolic runtime |
| **LangGraph + persistence** | Whether explicit state/durability alone explains gains |
| **Temporal or DBOS workflow, no semantic contracts** | Whether durable execution alone explains gains |
| **AgentSpec / Progent-style policy enforcement** | Contribution of local policy/capability restrictions |
| **ToolGate-style pre/post contracts** | Contribution of checked state transitions |
| **Agent-C-style temporal enforcement** | Contribution of trace constraints |
| **PlanCompiler/COVENANT-style compiled plan** | Contribution of structured/compiled control |
| **Integrated proposed runtime** | Whether composition gives additional reliability |
| **Integrated system ablations** | Which semantics actually produce the effect |

The experimental unit should be a **complete execution trace**, not merely the final answer. For each task, the proposal is to run multiple stochastic trials, inject crashes and retries, vary the model version/model family where practical, inject hostile tool output, and mutate policies. This directly tests the properties that a durable verified runtime claims to provide.

The primary metric vector should be:

| Dimension | Suggested metric |
|---|---|
| Utility | Task success / final environment-state correctness |
| Stochastic reliability | pass^k, failure probability over repeated runs, worst-tail performance |
| Contract safety | Violations per run; especially **false-negative rate for critical violations** |
| Temporal safety | Forbidden trace rate and liveness/timeout outcomes |
| Authority | Unauthorised action rate; overblocking rate |
| Provenance | % committed values with complete valid lineage; lineage precision |
| Epistemic quality | Critical-evidence omission, unsupported-claim rate, contradiction recall, correct abstention |
| Durability | Crash-recovery success; duplicated side effects; replay divergence; lost committed work |
| Verification quality | Fraction of requirements formalised; mutant/specification-fuzz kill rate |
| Human oversight | Escalation precision/recall, approval workload, approval latency |
| Efficiency | Tokens, model calls, money, latency, storage and verifier overhead |
| Adaptation | Invalid self-modification rejection; valid modification success; invariant preservation after update |

The **mutation-testing idea** deserves emphasis. A verifier that passes its hand-written benchmark may simply be checking easy specifications. Deliberately mutate a valid program:

```text
remove approval edge
swap authority level
drop provenance propagation
turn exhaustive scan into top-k
move financial write before verification
make side effect non-idempotent
remove postcondition
change tool capability
```


and measure whether compilation/runtime verification catches the mutation. This makes "verification coverage" empirically testable.

The same applies to durability. Kill the worker after each possible step, before and after external side effects, during a human pause, and around model calls. Then measure whether the recovered execution is observationally equivalent to an uninterrupted execution. Temporal's replay discipline and DBOS's durable-step model provide strong baseline implementations for these experiments. ([Temporal Technologies: AI agent reference architecture](#temporal-ai-reference-architecture); [DBOS: AI quickstart](#dbos-ai-quickstart))

One limitation in the current formal-agent literature is benchmark scale. AgentVerify, for example, reports experiments over only 15 synthetic scenarios and itself finds significant remaining miss rates in difficult cases; the proposal is to treat it as evidence that temporal verification is promising, not as proof that current verification is deployment-ready. ([Fang 2026](#fang-2026)) PlanCompiler's 300 structured tasks and COVENANT's 120 workflow cases are more substantial, but they still do not jointly exercise months-long state, process crashes, concurrent actors, policy evolution, model upgrades and adversarial inputs. ([Wang et al. 2026](#wang-2026); [Harikumar 2026](#harikumar-2026))

That motivates a benchmark that does not currently seem well represented:

> **Verified Agent Runtime Bench:** programs with known contracts, durable mutable state, irreversible side effects, injected faults, adversarial observations, human approval points, probabilistic operators and explicit expected trace properties.

A few hundred carefully specified scenarios would be more scientifically useful than thousands of ordinary question-answering examples.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## References


These entries are copied from the [shared bibliography]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#references).

- Banerjee, Debangshu, Changming Xu, and Gagandeep Singh (2026). [SEVerA: Verified Synthesis of Self-Evolving Agents](https://arxiv.org/abs/2603.25111). arXiv:2603.25111. ^banerjee-2026
- Chen, Ziru, et al. (2024). [ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery](https://arxiv.org/abs/2410.05080). arXiv:2410.05080. ^chen-2024
- DBOS. [AI Quickstart](https://docs.dbos.dev/ai/ai-quickstart). DBOS documentation. ^dbos-ai-quickstart
- Debenedetti, Edoardo, et al. (2024). [AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents](https://arxiv.org/abs/2406.13352). NeurIPS 2024. arXiv:2406.13352. ^debenedetti-2024
- Fang, Eric (2026). [AgentVerify: Compositional Formal Verification of AI Agent Safety Properties via LTL Model Checking](https://www.preprints.org/manuscript/202604.1029). Preprints.org 202604.1029. ^fang-2026
- Harikumar, Pranav (2026). [PlanCompiler: A Deterministic Compilation Architecture for Structured Multi-Step LLM Pipelines](https://arxiv.org/abs/2604.13092). arXiv:2604.13092. ^harikumar-2026
- Jimenez, Carlos E., et al. (2023). [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770). arXiv:2310.06770. ^jimenez-2023
- Project note (user-provided). *startup.md*. ^note-startup
- Temporal Technologies. [AI Agent Reference Architecture](https://go.temporal.io/platform-hub/ai-engineering/ai-reference-architecture). Temporal Platform Hub. ^temporal-ai-reference-architecture
- Wang, Jincheng, Min Zheng, and Tao Wei (2026). [COVENANT: Natural-Language Workflow Compilation for Aligned Agent Execution](https://arxiv.org/abs/2607.25400). arXiv:2607.25400. ^wang-2026
- Xie, Tianbao, et al. (2024). [OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments](https://proceedings.nips.cc/paper_files/paper/2024/hash/5d413e48f84dc61244b6be550f1cd8f5-Abstract-Datasets_and_Benchmarks_Track.html). NeurIPS 2024 Datasets and Benchmarks Track. ^xie-2024
- Yao, Shunyu, Noah Shinn, Pedram Razavi, and Karthik Narasimhan (2024). [\(\tau\)-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045). arXiv:2406.12045. ^yao-2024
- Zhang, Hanrong, et al. (2024). [Agent Security Bench (ASB): Formalizing and Benchmarking Attacks and Defenses in LLM-based Agents](https://arxiv.org/abs/2410.02644). arXiv:2410.02644. ^zhang-2024
- Zhou, Shuyan, et al. (2024). [WebArena: A Realistic Web Environment for Building Autonomous Agents](https://proceedings.iclr.cc/paper_files/paper/2024/hash/4410c0711e9154a7a2d26f9b3816d1ef-Abstract-Conference.html). ICLR 2024. ^zhou-2024
- Zong, Xuanjun, Zhiqi Shen, Lei Wang, Yunshi Lan, and Chao Yang (2026). [MCP-SafetyBench: A Benchmark for Safety Evaluation of Large Language Models with Real-World MCP Servers](https://proceedings.iclr.cc/paper_files/paper/2026/hash/d46f127a80dc58cbc0732a717285c43a-Abstract-Conference.html). ICLR 2026. ^zong-2026

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Interview context for BEAVER and DAB


In the Data Renegades interview (Episode 11), Michael Stonebraker connects BEAVER with RUBICON and distinguishes retrieval tasks from action tasks. Those reported results are his and have not been independently verified or updated here.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Shared verification framework


[Verification and acceptance]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) distinguishes compiler checks, result verification, acceptance for a purpose, and authorization for external effects. The [investigation plan]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) and [behavioral compilation analyses and experiment]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) now have separate notes. The [evaluation comments]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) explain the boundaries among the three plans.
