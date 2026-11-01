---
draft: false
toc: true
title: "Evaluation Subsystem and Production Learning"
description: "Build a right-sized evaluation harness and domain workbench, decouple run, judging, and analysis records, place checks across offline, synchronous, and asynchronous planes, and turn live production evidence into updated commitments."
linkTitle: "Subsystem and Production"
---

An **evaluation subsystem** is the people, operating practices, datasets, and software that produce, inspect, judge, compare, and preserve evidence about AI product behavior. A prompt-runner script is not a complete subsystem, and neither is a score dashboard detached from the cases, traces, criteria, and limits behind its numbers. ([Moshkovich et al. 2025](#moshkovich-2025); [Yehudai et al. 2025](#yehudai-2025))

## Start with the minimum viable subsystem


Grow infrastructure only when repeated evidence needs demand it, not from an abstract platform maturity checklist. A Day-1 subsystem needs eight things: (1) a named question and commitment context, (2) an explicit basis or provisional expectation, (3) 10–25 purposeful cases + fixtures in version control, (4) a runner that executes a pinned configuration, (5) saved JSONL/SQLite traces satisfying a [capture contract]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#capture-contract), (6) a human trace-review ritual (spreadsheet or lightweight viewer), (7) a short written finding with stated limits, and (8) a folder or table that retains confirmed regression cases.

Every step must preserve lineage IDs from `question → basis@ver → dataset@ver / sample_rule → execution + sut_manifest → trace → criterion@ver + evaluator@ver → label → measurement / finding → decision`, while enforcing access, PII redaction, and retention controls on captured customer data. ([Chen et al. 2025](#chen-2025); [Dong et al. 2024](#dong-2024))

## Harness and wider workspace


Keep two layers conceptually distinct even when one repository or tool hosts both: the **evaluation harness** (controlled case/fixture loading, candidate execution, trace capture, and evaluator invocation) and the **wider workspace** (dataset/evaluator registries, side-by-side trace diffs, human annotation and adjudication queues, cluster search, and production monitors).

### Decouple run, judging, and analysis records


Architect the harness as **three separate stages** linked by immutable IDs—a pattern implemented in [Phased]({{< ref "projects/phased" >}}) ([`docs/evaluation/run-model.md`](https://github.com/valery-judah/phased/blob/main/docs/evaluation/run-model.md)):

1. **Run stage:** executes a pinned SUT manifest across a dataset (with \(k\) repeats) and writes raw trace records only—no pass/fail logic baked in.
2. **Judging stage:** runs a versioned set of code checks and LLM judges over saved trace files, emitting raw evaluator results and `disagreed` flags.
3. **Analysis stage:** summarizes repeats per case (`all pass`, `mixed`, `all fail`, `incomplete`), pairs sub-trace items by input record, compares arms against the pre-committed `experiment` spec, and evaluates the `finding rule`.

Decoupling these three stages pays off immediately: when you discover a rubric flaw or add a new deterministic check, you **re-run Judging and Analysis on existing traces in seconds** without burning time or tokens re-executing the SUT—and you can test sensitivity to a finding rule without re-running judges.

### Versioned system under test and replay limits


Run the product as a versioned **system under test (SUT)** driven by a declarative manifest pinning model snapshot, prompts, temperature/decoding settings, workflow code commit, tool schemas, retrieval index snapshot, and policy rules so every trace identifies what produced it. ([O'Reilly AI Agent Platforms](#oreilly-ai-agent-platform)) Treat exact replay honestly: live external APIs, shifting databases, wall-clock timestamps, model-provider updates, and GPU batching limit byte-for-byte reproducibility—record what was pinned vs. live rather than promising perfect determinism.

### Workbench for domain experts


An **AI workbench** puts the SUT runner, trace viewer, annotation panel, and arm-comparison table in front of domain experts and PMs alongside engineers, collapsing feedback loops from days to minutes:

1. Edit a declarative configuration (e.g., prompt `v2`, chunking rule, or tool schema).
2. Execute the configured SUT across the target dataset for \(k\) repeats and capture full component/tool traces.
3. Run the evaluator suite over each trace (whole-trace and step-level checks).
4. Inspect case-by-case diffs (`all pass` / `mixed` / `all fail`), drill directly from any metric cell into the underlying trace spans, and turn newly spotted failures into narrow evaluators ([Failure understanding]({{< ref "ai-engineering/evaluation/framework-v2/failure-understanding" >}}); [Experiments and findings]({{< ref "ai-engineering/evaluation/framework-v2/experiments-and-findings" >}})).

## Where evaluation runs


Place checks across **three execution planes** defined by their relationship to live users, live state, and real-world side effects—not by project phase (replaying last night's production traces against a candidate branch is still offline). ([Huyen 2022](#huyen-2022); [Murphy and Underwood 2025](#murphy-2025))

| Execution plane | Relationship to live request | What belongs here | Main constraint |
| --- | --- | --- | --- |
| **Offline** | Zero live user or state impact (CI, local workbench, trace replay, shadow runs) | Exploratory probes, multi-repeat candidate comparisons, regression suites, and evaluator \(\text{TPR}\)/\(\text{TNR}\) calibration | Coverage ceiling—can only test situations represented in your cases and fixtures |
| **Online synchronous** *(in the request path)* | Runs before an output is shown or a tool mutates state | Hard code gates (permissions, confirmation tokens, schema/SQL parsers, PII/safety filters) and fast classifiers triggering fallback | Strict p99 latency, availability, and false-block (`TPR`) budgets; hard code gates enforce invariants directly rather than measuring them |
| **Online asynchronous** *(outside the request path)* | Runs alongside or after live interactions on sampled traces | Narrow LLM judges, Rogan–Gladen prevalence estimates, drift alerts, human review queues, and linking downstream user outcomes | Delayed intervention—cannot block an irreversible write that already executed |

### Continuous integration and model upgrades


Split automated offline runs into two tiers so CI stays fast and trustworthy ([Shankar and Husain 2026](#shankar-2026)):

- **On every PR / commit (2–5 min):** run unit tests on all hard code gates, prompt-leakage checks, and fast deterministic/reference checks on a 20–50 case smoke/regression set (pinning any LLM judge to a fixed model snapshot).
- **Before release, on prompt/retrieval PRs, or nightly:** run the full held-out comparison and commitment sets with \(3\text{–}5\) repeats per case, calibrated LLM judges, and latency/cost non-regression budgets ([Experiments and findings]({{< ref "ai-engineering/evaluation/framework-v2/experiments-and-findings" >}})).

**Model-upgrade & cost-down playbook.** When a provider ships a newer, faster, or cheaper model—or deprecates a snapshot—run a pre-committed comparison arm swapping *only* the SUT model ID first (keeping the judge model pinned!), inspect case-by-case regressions and latency/cost deltas, fix prompt assumptions coupled to the old model's quirks, and **re-validate your LLM judges against the held-out human validation set** before upgrading the judge's own model ID.

## Production learning and live sampling


Shipping is not the end of evaluation—it opens the only source of evidence about real phrasing, real state messiness, dependency failures, and user behavior under operating conditions. ([Xia et al. 2024](#xia-2024); [Vinay 2025](#vinay-2025)) Production evidence serves **Delivery** (verifying that active commitments and harm limits hold) and **Discovery** (revealing unmet intents and testing whether the solution actually helps).

### Keep five post-release questions separate


Never collapse live telemetry into one health score—each question maps to a different rung of the [solution utility ladder]({{< ref "ai/product/operating-model/solution-utility-ladder" >}}) and triggers a different response:

1. **Committed behavior (`U1–U4` + required conditions):** Did the product behave as promised within supported scope? *(Mismatch → Delivery fix, rollback, or narrower commitment.)*
2. **Job completion (`U5`):** Could intended users understand, verify, and finish the workflow? *(Mismatch → UX/interaction redesign.)*
3. **Choice and retention (`U6`):** Do users choose and keep using it over manual or competing alternatives? *(Mismatch → revisit value assumption and friction.)*
4. **Target condition (`U7`):** Did repeated use change the user or operational condition sought? *(Mismatch → rethink the solution.)*
5. **Wider business result:** Did changing that condition move the broader business metric? *(Mismatch → revisit product strategy.)*

### Sample production traffic deliberately and capture UX signals


State the population, time window, version mix, rollout exposure, and selection rule for every production sample—never report a risk-weighted incident sample as your overall live failure rate ([Test data]({{< ref "ai-engineering/concepts/evaluation/test-data" >}})):

- **Random & stratified samples:** estimate true population or per-segment pass rates (adjusted with Rogan–Gladen intervals when scored by an LLM judge; [Validate evaluators]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}}#validate-evaluators)). Always keep a random baseline slice so unknown failures can surface.
- **Signal- & risk-triggered samples:** pull traces with high-consequence tool calls, retries/fallbacks, extreme latency or turn counts, or classifier flags to hunt severe bugs cheaply.
- **Implicit UX signals:** log **user edits to AI drafts before confirmation**, rephrased follow-ups, copy/export events, thumbs-down notes, and mid-flow abandonment alongside the trace—a user editing `$42` to `$50` before saving is a concrete live label at zero annotation cost.

### Diagnose live changes and update the commitment


When a live metric shifts, describe *what* changed in the traces before calling it "model drift." Live metrics move for seven distinct reasons: (1) user traffic mix or seasonal tasks shifted, (2) rollout expanded to a new user role or region, (3) external data or retrieval corpora changed, (4) a prompt, tool, or dependency deployed, (5) silent provider model-weight updates (GPT-4 dropped from 84% to 51% on identical tasks across three months; [Chen et al. 2024](#chen-2024)), (6) trace logging broke, or (7) **judge drift**—the LLM judge's own behavior shifted or encountered out-of-distribution inputs. ([Desale 2025](#desale-2025); [Murphy and Underwood 2025](#murphy-2025))

Promote live incidents into offline regression or comparison cases selectively—keep traces that guard a commitment boundary or recurring failure pattern, and prune outdated cases whose product rules changed. When live evidence changes what users can safely rely on, **update the [production commitment]({{< ref "ai/product/operating-model/production-commitment" >}}) explicitly**: expanding scope requires fresh behavioral and operational evidence for the new situations; narrowing or withdrawing scope requires updating user-facing guardrails, fallback paths, and affected workflows immediately.

## Who owns what


| Role | Owns in subsystem and production learning |
| --- | --- |
| **PM / Commitment owner** | Defining rollout stages and exposure caps, tracking `U5–U7` adoption and outcome signals separately from trace scores, reviewing live failure discoveries, and expanding, narrowing, or withdrawing the production commitment |
| **AI engineer** | Maintaining versioned SUT manifests, decoupled run/judging/analysis storage, PII/access rules, CI smoke vs. multi-repeat comparison pipelines, model-upgrade checks, and stratified + event-triggered production sampling |

## References


- [Building AI Agent Platforms](https://learning.oreilly.com/library/view/building-ai-agent/0642572243906/) (early release, chapters 1-7). O'Reilly. Local copy. ^oreilly-ai-agent-platform
- Chen, L., Zaharia, M. and Zou, J. (2024). [How Is ChatGPT's Behavior Changing over Time?](https://arxiv.org/abs/2307.09009). Harvard Data Science Review 6. arXiv:2307.09009. ^chen-2024
- Chen, X., Li, Y. and Wang, X. (2025). [Design Principles and Guidelines for LLM Observability: Insights from Developers](https://doi.org/10.1145/3706599.3719914). doi:10.1145/3706599.3719914. [PDF](/sources/8ad3e7f30bf91ca5f6dd6608262e24df.bin). ^chen-2025
- Desale, K. S. (2025). [Concept Drift in Large Language Models: Adapting the Conversation](https://doi.org/10.1201/9781003595533). CRC Press. doi:10.1201/9781003595533. [PDF](/sources/d1942ec8339ba7be1a0c4c267c156da3.bin). ^desale-2025
- Dong, L., Lu, Q. and Zhu, L. (2024). [AgentOps: Enabling Observability of LLM Agents](https://arxiv.org/abs/2411.05285). arXiv:2411.05285. [PDF](/sources/2552a2fb5a7298b4623ed4e0cf224f1e.bin). ^dong-2024
- Huyen, C. (2022). [Designing Machine Learning Systems: An Iterative Process for Production-Ready Applications](/sources/5bbe42519087c94b06ff1a96c39c6566.bin). O'Reilly. ^huyen-2022
- Moshkovich, D. et al. (2025). [Beyond Black-Box Benchmarking: Observability, Analytics, and Optimization of Agentic Systems](https://arxiv.org/abs/2503.06745). arXiv:2503.06745. [PDF](/sources/8c072306d90aa736730074efc3876e0a.bin). ^moshkovich-2025
- Murphy, N. and Underwood, T. (2025). [Unsolved Problems in MLOps](/sources/ef367e86799f257cbc6954868ca0c06f.bin). ACM Queue 23, 47-65. ^murphy-2025
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 1 and 9. O'Reilly. ^shankar-2026
- Vinay, V. (2025). [Failure Modes in LLM Systems: A System-Level Taxonomy for Reliable AI Applications](/sources/24c523668b468dc4bcb703579792c1a4.bin). ^vinay-2025
- Xia, B. et al. (2024). [Evaluation-Driven Development and Operations of LLM Agents: A Process Model and Reference Architecture](https://arxiv.org/abs/2411.13768). arXiv:2411.13768. [PDF](/sources/b06b0ce219cd90ae62a1cfdfefcd159b.bin). ^xia-2024
- Yehudai, A. et al. (2025). [Survey on Evaluation of LLM-based Agents](https://arxiv.org/abs/2503.16416). arXiv:2503.16416. [PDF](/sources/c2f29c376a7d18e6da7473c763e892e3.bin). ^yehudai-2025
