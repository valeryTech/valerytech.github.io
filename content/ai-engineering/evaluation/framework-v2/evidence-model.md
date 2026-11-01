---
draft: false
toc: true
title: "Evidence Model Reference"
description: "Compact reference of every core object, status, failure-ladder level, acceptance record, and counterfactual support rule in the AI evaluation framework."
linkTitle: "Evidence Model"
---

Use this note as a compact schema and glossary reference when designing runners, storage tables, evaluators, or claim records. Operational guidance lives in [Commitments and claims]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}}), [Cases and coverage]({{< ref "ai-engineering/evaluation/framework-v2/cases-and-coverage" >}}), [Failure understanding]({{< ref "ai-engineering/evaluation/framework-v2/failure-understanding" >}}), [Evaluators and calibration]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}}), [Experiments and findings]({{< ref "ai-engineering/evaluation/framework-v2/experiments-and-findings" >}}), and [Subsystem and production]({{< ref "ai-engineering/evaluation/framework-v2/subsystem-and-production" >}}).

## Execution, trajectory, trace, and observation


> **An execution is one run of the system. Its trajectory is everything that actually happened. A trace is the partial record captured about that run—and becomes evidence only in relation to a named claim.**

- **Evaluation case:** a specification of an input/interaction, initial state **fixture**, `expected_condition`, participant rule (fixed or adaptive), and applicable claims—not an execution or evidence by itself.
- **Execution:** one mechanical run of a case or live request against pinned product, model, prompt, tool, environment, and data versions (`completed`, `interrupted`, `aborted`, `timed out`—mechanical status never implies acceptable behavior).
- **Trajectory:** the complete real-world sequence of model states, tool calls, and side effects during an execution; latent state and unlogged reasoning remain hidden. ([Liu et al. 2025](#liu-2025); [Rombaut et al. 2024](#rombaut-2024))
- **Trace:** the durable records captured about an execution and tied to its ID. ([Dong et al. 2024](#dong-2024); [Moshkovich et al. 2025](#moshkovich-2025)) Different actors hold different visibility views—an adaptive test participant must never read evaluator-only database records.
- **Observation:** a judgment-free statement citing specific trace records (*"step 3 called `submit_transfer` with no prior confirmation message"*).

### Production sample


A **production sample** is a selection rule (population, time window, inclusion/exclusion filters, version exposure, and sampling method—random, stratified, risk-weighted, or event-triggered) over live executions; its captured traces support population estimates only when the selection rule justifies them.

### Repeat and spread


A **repeat** executes the exact same case against the exact same configuration; **spread** is how much one case's results differ across repeats (a case with conflicting verdicts across repeats is **`mixed`**). Repeats precede comparisons, **the case is the unit** (`all pass`, `all fail`, `mixed`, `incomplete`), and a version difference counts for a case only beyond within-version spread. Deterministic code has zero spread, so one run gives the same support as several; live LLMs can vary even at `temperature = 0`.

### Capture contract


A **capture contract** declares the exact records an evaluation requires the subsystem to log; *capture complete* means only that contract fields were recorded, not that every future criterion is judgeable.

## Evidence and evaluation basis

### Evidence


**Evidence** is a record, observation, label, or finding **in relation to a named claim**; without a claim it is just a stored record. Under [the shared definitions]({{< ref "ai-engineering/shared-definitions" >}}), a result supports a claim **only as far as the procedure would have produced a different result had the claim been false**—which directly entails five framework rules: (1) `NOT JUDGEABLE` never counts as `PASS`, (2) finding rules are written before reading results, (3) development cases are held out of comparison tests, (4) reference labels must be independent of the evaluator with respect to checked errors (naming the shared error source removed), and (5) seeing "no difference" supports `"no worse"` only when the experiment had power to detect a drop of the stated margin. Records sharing a common error source count once for that error.

### Evaluation basis


The **evaluation basis** is the stated rule, expectation, claim, or [production commitment]({{< ref "ai/product/operating-model/production-commitment" >}}) under which behavior is judged acceptable or unacceptable. When results are meant to support or contradict a behavior claim or commitment, its **required level** is set beforehand by the relying party (`every time` for hard code properties; `at least a share` or `no worse by a margin` for measured claims).

## Judgment, judgeability, and labels


Keep four properties of one execution strictly separate: **execution status** (did it finish mechanically?), **capture status** (did logs meet the capture contract?), **judgeability** (do captured records suffice for *this* criterion?), and **behavioral judgment** (did behavior meet the criterion?).

| Artifact / Status | Definition |
| --- | --- |
| **Criterion** | Executable rule applying an evaluation basis to a unit (trace, turn, item, tool call) |
| **Evaluator** | Code check, reference check, LLM judge, or human reviewer applying a versioned criterion |
| **`PASS` / `FAIL`** *(or `ABSENT` / `PRESENT`)* | Behavioral verdict when the criterion applies and records suffice (unreadable SUT outputs count as `FAIL` on verdicts, `NOT JUDGEABLE` on descriptive scales) |
| **`NOT APPLICABLE` / `NOT JUDGEABLE`** | Criterion does not apply to this unit / applies, but missing capture records prevent judgment |
| **`disagreed` label** | Repeated calls of an evaluator on the *same* trace conflicted—held apart from `NOT JUDGEABLE` until human review adjudicates |
| **Adjudicated label** | Label accepted by a named reviewer under a stated rule for a stated purpose (`Acceptance: reviewer, rule, purpose, date`) |

## Failure knowledge and diagnosis


The framework preserves three distinct paths—analytical understanding, repeated operational measurement, and technical root-cause diagnosis:

| Object | Path | What it records and establishes |
| --- | --- | --- |
| **Failure incident** *(+ first observable failure)* | Analytical | One trace-linked violation of an evaluation basis (marking the earliest demonstrated failure in cascading traces) |
| **Initial & focused codes** | Analytical *(working)* | Revisable behavioral tags grouping concrete incidents during constant comparison |
| **Failure category** | Analytical | Reusable pattern of unacceptable behavior with tested in/out boundaries (need not be binary or mutually exclusive) |
| **Failure taxonomy → Failure model** | Analytical | Organized category hierarchy → enriched with observed conditions, variation, sequence links, consequences, and open questions |
| **Operational failure mode** | Operational | Precise behavior selected (from a category, requirement, or anticipated risk) for repeated `PRESENT` / `ABSENT` checking |
| **Root cause** | Diagnostic | Technical mechanism established by ablation, replay, or code inspection with enough support for the fix relying on it ([Ma et al. 2025](#ma-2025); [Zhang et al. 2025](#zhang-2025)) |

### Cause hypothesis


A **cause hypothesis** is a proposed mechanism explaining an incident or pattern, recorded alongside rival explanations and confounders until diagnostic interventions test it—never inferred from trace sequence or correlation alone.

## Experiment, finding, and decision

### Experiment


An **experiment** is written before execution, naming the question and target commitment, single-factor **arms** and **baseline**, **repeats** per arm, and the pre-committed **finding rule** (`Supported`, `Contradicted`, `Inconclusive`, `Undetermined`), ordered across four purposes: *Look → Trust the measure → Make a claim → Test how far it holds*.

### Finding and decision


- **Measurement & comparison:** case-level summaries over a dataset/sample and case-by-case differences beyond within-version spread.
- **Finding:** scoped answer to the question stating **claim scope**, **evidence scope**, **the explicit assumption bridging them**, evaluator limits, and remaining uncertainty.
- **Decision & decision rule:** the action chosen by responsible product owners (`continue`, `fix`, `narrow commitment`, `rollback`, `reopen discovery`), optionally automated via an approved warning, CI release gate, or synchronous runtime control.

## Core boundaries at a glance


| Question | Answered by | Never confuse with |
| --- | --- | --- |
| What situation was specified? | Case or sample definition | Execution (one run under specific versions) |
| What happened vs. what was logged? | Trajectory vs. Trace | Treating a trace as complete reality, or as evidence without a named claim |
| Missing log vs. malformed output vs. unstable judge? | `NOT JUDGEABLE` vs. `FAIL` vs. `disagreed` | Counting unjudged runs as `PASS`, or hiding judge noise inside `NOT JUDGEABLE` |
| Recurring pattern vs. CI check vs. why it broke? | Failure category/model vs. Operational mode vs. Root cause | Calling the first visible mistake or a cluster correlation the root cause |
| What does evidence support vs. what do we ship? | Finding (with finding rule) vs. Decision (with decision rule) | Letting an evaluator or aggregate score silently own product risk |

## References


- Dong, L., Lu, Q. and Zhu, L. (2024). [AgentOps: Enabling Observability of LLM Agents](https://arxiv.org/abs/2411.05285). arXiv:2411.05285. [PDF](/sources/2552a2fb5a7298b4623ed4e0cf224f1e.bin). ^dong-2024
- Liu, T. Y. et al. (2025). [Observability of Latent States in Generative AI Models](/sources/9707778c207ca0f2e56a57506db5d02e.bin). Proceedings of Machine Learning Research. ^liu-2025
- Ma, X. et al. (2025). [Diagnosing Failure Root Causes in Platform-Orchestrated Agentic Systems: Dataset, Taxonomy, and Benchmark](https://arxiv.org/abs/2509.23735). arXiv:2509.23735. [PDF](/sources/357f048f04984be0de2d677e589887ac.bin). ^ma-2025
- Moshkovich, D. et al. (2025). [Beyond Black-Box Benchmarking: Observability, Analytics, and Optimization of Agentic Systems](https://arxiv.org/abs/2503.06745). arXiv:2503.06745. [PDF](/sources/8c072306d90aa736730074efc3876e0a.bin). ^moshkovich-2025
- Rombaut, B. et al. (2024). [Watson: A Cognitive Observability Framework for the Reasoning of LLM-Powered Agents](https://arxiv.org/abs/2411.03455). arXiv:2411.03455. [PDF](/sources/3ad929bb7079a6a181a4f4162e338274.bin). ^rombaut-2024
- Zhang, G. et al. (2025). [AgenTracer: Who Is Inducing Failure in the LLM Agentic Systems?](https://arxiv.org/abs/2509.03312). arXiv:2509.03312. [PDF](/sources/18a3b659e726bb39af8f2afb1f45e22f.bin). ^zhang-2025
