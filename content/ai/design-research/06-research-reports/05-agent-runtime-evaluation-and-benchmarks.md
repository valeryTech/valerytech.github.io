---
draft: false
toc: true
description: "An agent-runtime evaluation proposal comparing durability, policy, temporal, and compiled-plan baselines through repeated traces, injected faults, and specification mutations, measuring useful completion separately from safety and overhead."
title: "05 Agent Runtime Evaluation And Benchmarks"
linkTitle: "05 Agent Runtime Evaluation And Benchmarks"
---
# Agent-runtime evaluation and benchmarks


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The following runtime passage comes from [Programmable probabilistic agent computation]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}). Its numbered citations point to the shared bibliography through the local links below. The complete cross-application metric framework remains intact.

## Scope and related evaluation notes


- [Investigation evaluation and benchmarks]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) retains the bounded-corpus plan.
- [Behavioral compilation evaluation and failure modes]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) retains the synthesis analyses and synthetic experiment.
- [Evaluation comments]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) explain what the three plans can and cannot establish.

## Benchmarks, baselines and experimental design


Current benchmarks are fragmented by the property they measure. That is useful for this programme because the core thesis should be tested against several failure classes, not a single aggregate "agent score".

**AgentDojo** was introduced at NeurIPS 2024 as a dynamic environment for tool-using agents that combines realistic user tasks with security test cases; its benchmark contains 97 tasks and 629 security cases. [33](#ref-33) **Agent Security Bench** broadens adversarial evaluation across ten scenarios, more than 400 tools and multiple attack/defence methods. [34](#ref-34) **MCP-SafetyBench**, accepted at ICLR 2026, specifically targets multi-step safety problems involving real MCP servers and cross-server attacks. [35](#ref-35) These are good tests for capabilities, taint tracking, preconditions and policy enforcement.

**τ-bench** is particularly valuable for stateful business agents because correctness is judged through interaction with simulated users and tools and can be checked against final database state. Its pass^k framing is also useful because one successful run says little about a stochastic agent's repeated reliability. [36](#ref-36) SEVerA already uses the newer τ² setting as one evaluation domain. [5](#ref-5)

**WebArena** supplies realistic long-horizon web tasks with executable functional evaluation; its original ICLR 2024 paper showed a very large gap between its GPT-4-based baseline and human performance. [37](#ref-37) **OSWorld** gives a real computer-use setting, while **SWE-bench** provides repository-level software-engineering tasks whose outcomes can be checked by executable tests. [38](#ref-38), [39](#ref-39) These are good settings for studying long-running state, retries, irreversible effects and recovery.

For research/investigation workloads, **ScienceAgentBench** and the proposed bounded-corpus benchmark can add the epistemic dimension: source completeness, provenance, contradiction preservation and correct abstention. [40](#ref-40) The author's startup notes already propose a benchmark with required evidence, distractors, contradictions, superseded sources and unanswerable questions. [41](#ref-41) The proposal is to keep that: general agent benchmarks rarely measure whether all critical evidence was considered.

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

The same applies to durability. Kill the worker after each possible step, before and after external side effects, during a human pause, and around model calls. Then measure whether the recovered execution is observationally equivalent to an uninterrupted execution. Temporal's replay discipline and DBOS's durable-step model provide strong baseline implementations for these experiments. [17](#ref-17), [18](#ref-18)

One limitation in the current formal-agent literature is benchmark scale. AgentVerify, for example, reports experiments over only 15 synthetic scenarios and itself finds significant remaining miss rates in difficult cases; the proposal is to treat it as evidence that temporal verification is promising, not as proof that current verification is deployment-ready. [42](#ref-42) PlanCompiler's 300 structured tasks and COVENANT's 120 workflow cases are more substantial, but they still do not jointly exercise months-long state, process crashes, concurrent actors, policy evolution, model upgrades and adversarial inputs. [7](#ref-7), [9](#ref-9)

That motivates a benchmark that does not currently seem well represented:

> **Verified Agent Runtime Bench:** programs with known contracts, durable mutable state, irreversible side effects, injected faults, adversarial observations, human approval points, probabilistic operators and explicit expected trace properties.

A few hundred carefully specified scenarios would be more scientifically useful than thousands of ordinary question-answering examples.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Citation links added during reassembly


The original numbered citations link to the entries below, which point to the [shared bibliography]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#references).

- <a id="ref-5"></a>[Reference 5]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-5)
- <a id="ref-7"></a>[Reference 7]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-7)
- <a id="ref-9"></a>[Reference 9]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-9)
- <a id="ref-17"></a>[Reference 17]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-17)
- <a id="ref-18"></a>[Reference 18]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-18)
- <a id="ref-33"></a>[Reference 33]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-33)
- <a id="ref-34"></a>[Reference 34]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-34)
- <a id="ref-35"></a>[Reference 35]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-35)
- <a id="ref-36"></a>[Reference 36]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-36)
- <a id="ref-37"></a>[Reference 37]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-37)
- <a id="ref-38"></a>[Reference 38]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-38)
- <a id="ref-39"></a>[Reference 39]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-39)
- <a id="ref-40"></a>[Reference 40]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-40)
- <a id="ref-41"></a>[Reference 41]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-41)
- <a id="ref-42"></a>[Reference 42]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-42)

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Interview context for BEAVER and DAB


The [complete text-to-SQL and benchmark exchange]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}#text-to-sql-rubicon-and-benchmarks-from-the-interview) is preserved in the database runtime note. The interview connects BEAVER with RUBICON and distinguishes retrieval from action tasks. The reported results and qualifications remain attributed to the captured interview, without independent verification or updates. No benchmark passages were duplicated here.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Shared verification framework


[Verification and acceptance]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) distinguishes compiler checks, result verification, acceptance for a purpose, and authorization for external effects. The [investigation plan]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) and [behavioral compilation analyses and experiment]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) now have separate notes. The [evaluation comments]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) explain the boundaries among the three plans.
