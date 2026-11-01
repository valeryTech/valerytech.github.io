---
draft: false
toc: true
title: "Commitments, Hard Gates, and Claims"
description: "Connect product discovery, production commitments, and the solution utility ladder to engineering architecture: enforce hard properties in code, write measured claims with required levels, design evaluable UX, and run the three feedback loops."
linkTitle: "Commitments and Claims"
---

Evaluation connects three things: **an explicit expectation or commitment**, **records captured when the configured AI system runs**, and **a concrete product or engineering question**. Starting from prompts or off-the-shelf metrics inverts the order—first decide what behavior users or downstream systems must rely on, split what code can guarantee from what must be measured, and size the evaluation to the next commitment.

## Product intent and expected behavior


An AI product is built to change a user or operating condition, not merely to generate plausible text. In the [product operating model]({{< ref "ai/product/operating-model/operating-model" >}}), expectations take three different statuses across [discovery and delivery]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}):

- **Provisional claim (Discovery):** a candidate behavior being probed to learn whether an approach is feasible or useful; failing cases revise the claim or kill the option cheaply.
- **Proposed production commitment (Commitment gate):** bounded behavior, scope, and operating conditions that the team is considering accepting responsibility for before opening or expanding real use.
- **Active production commitment (Delivery):** the explicit promise of what users can rely on in supported situations, what stays unsupported, how failures behave, and how exposure is monitored and reversed ([production commitment]({{< ref "ai/product/operating-model/production-commitment" >}})).

Strong trace scores never prove user adoption or business impact on their own. The [solution utility ladder]({{< ref "ai/product/operating-model/solution-utility-ladder" >}}) (`U1–U7`) separates what offline evaluations can establish from what requires usability testing or live production evidence:

| Layer | Question | Primary evidence | Role in a commitment |
| --- | --- | --- | --- |
| **Required conditions & operation** | Are permissions, confirmation gates, privacy rules, idempotency, latency, and cost limits respected? | Code review, unit/integration tests, runtime controls, operational telemetry | Non-negotiable obligations wherever real users or systems can be affected |
| **Enabling behavior (`U1–U4`)** | across declared **Coverage**, is output valid (`U1`), accurate on clear cases (`U2`), honest when info is missing/ambiguous (`U3`), and robust across phrasing/state variation (`U4`)? | Designed evaluation cases, fixtures, trace review, repeated harness runs | Core behavioral promise tested at the commitment gate and protected in CI |
| **Completes the job (`U5`)** | Can intended users understand, inspect, correct, and finish the whole workflow? | Task walkthroughs, pilot traces, edit/rejection/completion logs | Included in the commitment once interaction and recovery paths work |
| **Beats the alternative (`U6`)** | Do users choose and keep using it over their current workflow under real latency and error rates? | Controlled rollouts, retention, repeat-use vs. fallback rates | Discovery claim investigated in bounded production use, not promised by offline evals |
| **Changes target condition (`U7`)** | Does repeated use actually shift the user or business condition that motivated the product? | Longitudinal product, operational, or business measurements | Strategic hypothesis; reconsider the solution if `U1–U6` hold and `U7` stays flat |

**Trap in the wild.** Averaging `U1–U7` into one "product success score" hides where work is failing: a model upgrade won't fix a broken confirmation UI (`U5`), and a 96% offline pass rate won't save a workflow users abandon because manual entry is faster (`U6`).

## Split hard properties in code from measured claims


An **AI system** is the whole configured technical implementation—application code, prompts, models, retrieval, tools, state, and runtime controls ([components and architectural patterns]({{< ref "ai-engineering/concepts/ai-systems/components-and-patterns" >}})). Before building any evaluator, split every product requirement into its two forms from [the shared definitions]({{< ref "ai-engineering/shared-definitions" >}}) and [Evals, not just tests]({{< ref "ai-engineering/approach/evals-not-just-tests" >}}):

- **Hard property (`every time`):** holds for every action accepted at a named boundary in code (a tool wrapper, database write gate, schema validator, or auth check), with no second code path bypassing that gate. You establish a hard property by **reading and testing the gate code**, never by sampling prompts and hoping the LLM obeys instructions. Reserve the word *invariant* strictly for hard properties.
- **Measured claim (`at least a share`, or `no worse than baseline by a margin`):** holds at a stated rate across a defined population of situations for one system version. Use measured claims for semantic or contextual behavior that code cannot decide from records alone—such as whether a summary is faithful to retrieved passages, whether all stated constraints were preserved, or whether an assistant asked a sensible clarifying question.

Most real safety and quality requirements combine both forms plus a bridging assumption. Split them explicitly:

```text
Product requirement: "Never auto-close a compromised-account support ticket."
├── Hard property (code):     Tickets flagged `compromised` in classification state cannot call `close_ticket()`
│                             → verified by unit tests + checking no other code path closes tickets.
├── Measured claim (eval):    For `triage@2.1` on compromise-related support cases, at least 98% are classified
│                             `compromised` (by the lower interval bound) → verified by evaluation.
└── Bridging assumption:      Designed and sampled compromise cases match live attack descriptions
                              → monitored via reopened-ticket audits in production.
```


The AI system under test and the **evaluation subsystem** remain separate even when they share logging libraries: runtime permission checks enforce product rules inside the AI system, while the evaluation subsystem supplies external cases, reference labels, evaluators, comparisons, and findings.

## Write claims with a required level and size assurance to the commitment


A statement like *"the assistant preserves user constraints"* cannot be supported or contradicted by data until someone sets its **required level** before reading results. Write every behavioral claim that an evaluation tests in five fields ([the shared definitions]({{< ref "ai-engineering/shared-definitions" >}})):

```text
System version:         prompt, model snapshot, retrieval index, tools, and gate code commit
Situations:             the target population, how cases are selected, and that shares count cases across repeats
Behavior and criterion: observable behavior and the rule deciding one execution (and who/what applies it)
Required level:         every time (hard property only) | at least X% | at most Y points below baseline
Set by, and when:       the commitment owner or relying party, recorded before running the evaluation
```


Without a pre-set level, *"47 of 48 cases passed"* is only a description: under `every time` that single failure contradicts the claim (and signals a missing code gate), whereas under `at least 95% by measured share` it meets the bar on those cases.

**How much evaluation is enough?** Match assurance to the **next commitment** using two inputs and two levers ([the shared definitions]({{< ref "ai-engineering/shared-definitions" >}})):

- **Two risk inputs:** (1) **Loss if wrong and not undone** (financial, safety, trust, or engineering rework cost) and (2) **Chance of not noticing in time** (silent background writes vs. drafts reviewed by an expert).
- **Two assurance levers:** (1) **Stronger support**—more diverse cases, held-out test sets, independent domain labels, repeated runs to measure spread; or (2) **A smaller commitment**—fewer supported situations, draft-then-confirm instead of autonomous execution, a 25-user internal pilot, or a feature flag with one-click rollback.

Never say evidence is *"sufficient"* in the abstract; state which commitment it is sufficient *for* (e.g., *"enough support to commit two weeks to retrieval tuning"*, or *"enough support to expand rollout from 5% to 50% of support agents"*).

## Co-design product UX for evaluability


When a team struggles to judge from a trace whether an AI output was acceptable, users usually struggle to trust or verify that output in the product too. Treating evaluability as a joint PM + Engineer design constraint improves user safety and evaluation quality at the same time:

- **Draft-review-confirm before irreversible effects.** Showing an editable transaction, email, or query draft turns a catastrophic silent write into a recoverable `U5` check—and user edits before confirmation become high-signal production labels for free.
- **Structured intermediate commitments and citations.** Requiring the system to emit cited record IDs, structured line items, or explicit SQL/tool arguments before prose lets fast deterministic checks verify grounding and arithmetic directly.
- **Explicit abstention and clarification states.** Giving the product a first-class *"needs clarification"* or *"outside supported scope"* path lets you measure honest uncertainty (`U3`) instead of forcing the model to bluff.
- **Scoped workflow entry points.** Constraining input UI or routing unsupported intents early shrinks the query space your case set must cover.

## Evaluation goals


Across both discovery and delivery, the evaluation framework and subsystem serve six connected goals—treated as ongoing responsibilities rather than sequential project stages:

| Goal | What it establishes in practice |
| --- | --- |
| **Make behavior & basis explicit** | Turns product intent, commitments, and failure risks into concrete questions, required levels, and coverage needs—exposing undefined or conflicting product rules early instead of inventing them inside judge prompts. |
| **Capture execution records** | Runs designed cases or samples live traffic against versioned configurations under an explicit **capture contract**, keeping missing records visible rather than assuming unlogged steps succeeded. |
| **Judge under a stated basis** | Applies criteria (`PASS` / `FAIL`, or `PRESENT` / `ABSENT` for failure modes) only after checking applicability (`NOT APPLICABLE`) and evidence sufficiency (`NOT JUDGEABLE`), while keeping evaluator repeat conflicts separate as `disagreed`. |
| **Produce scoped findings** | Summarizes repeats per case, compares candidates beyond run-to-run spread, and states claim scope, evidence scope, bridging assumptions, and remaining unknowns. |
| **Preserve reusable knowledge** | Retains curated cases, fixtures, failure taxonomies and models, operational failure modes, calibrated evaluators, reference labels, and baselines so each iteration compounds prior work. |
| **Keep evaluation reliable** | Detects stale datasets, missing instrumentation, rubric ambiguity, and evaluator drift or bias before bad metrics steer engineering or block valid releases. |

## Three feedback routes


An evaluation finding rarely means *"just tweak the prompt."* Findings route work into three distinct loops depending on **what object must change**:

| Feedback loop | What changes | Reopens when | Closes when |
| --- | --- | --- | --- |
| **Product improvement** | Problem framing, workflow UX, prompts, models, retrieval, tools, hard code gates, or the [production commitment]({{< ref "ai/product/operating-model/production-commitment" >}}) | Behavior misses committed expectations, or live evidence challenges the product intent itself | A change ships (or scope narrows) and post-change evidence shows the target behavior shifted without unexpected regressions |
| **Evaluation knowledge** | Coverage requirements, cases, fixtures, failure categories, operational failure modes, criteria/rubrics, reference labels, evaluators, or decision rules | Traces show a failure no category fits, annotators read a rubric differently, or a judge disagrees with expert labels | Updated cases, criteria, or calibrated evaluators run cleanly on fresh behavior |
| **Evaluation infrastructure** | SUT runner, trace instrumentation, storage, version lineage, replay harnesses, review UI, CI hooks, or production monitors | Required records are `NOT JUDGEABLE`, runs lack version manifests, or review/comparison is too slow or costly | New runs capture and surface the needed records reliably for decisions |

One finding often triggers more than one loop. In [Phased]({{< ref "projects/phased" >}}) ([`evaluator-history.md`](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluators/evaluator-history.md)), testing three new LLM judges exposed a leading question that the product's own system prompt instructed the model to ask—simultaneously producing a **Product improvement** fix (rewrite the leading prompt) and an **Evaluation knowledge** fix (correct the reference example that repeated the same flaw).

### The improvement cycle


All three loops run on one shared empirical cycle: **probe and observe behavior → build or revise understanding → decide what must change → implement and validate → deploy and verify effect**. ([Xia et al. 2024](#xia-2024)) Probes expose the system to chosen conditions (offline cases, trace replay, shadow runs, canaries, or controlled A/B tests); observation captures both probed runs and natural traffic. Evaluation is one input alongside user research, support incidents, economics, and new model capabilities.

### How each loop closes


Implementation alone never closes a loop: merging a prompt PR does not close **Product improvement** until repeated runs or live telemetry verify the behavioral change; writing a rubric does not close **Evaluation knowledge** until independent reviewers or TPR/TNR checks confirm alignment; adding a tracing span does not close **Evaluation infrastructure** until evaluators and reviewers actually judge cases with it. Changing one loop routinely creates work in the others—a new product tool demands new fixtures, a sharper criterion demands deeper state logging, and a revised rubric invalidates old labels until affected traces are relabeled.

### The delivery view


In day-to-day shipping, evidence flows along two paths—an **offline inner loop** (run candidates on cases, inspect failures, compare against baseline before release) and an **online outer loop** (enforce synchronous guardrails, sample live traffic, link user outcomes, and turn surprises into new cases and criteria). ([Huyen 2022](#huyen-2022); [Murphy and Underwood 2025](#murphy-2025)) Both paths feed all three feedback loops across [offline and online execution planes]({{< ref "ai-engineering/evaluation/framework-v2/subsystem-and-production" >}}#where-evaluation-runs):

| Feedback loop | Offline inner loop (pre-release & replay) | Online outer loop (live request path & monitoring) |
| --- | --- | --- |
| **Product improvement** | Prototype alternatives, debug traces, run repeated candidate comparisons, check release gates | Enforce hard sync gates, run staged rollouts/canaries, observe `U5–U7` outcomes, trigger rollback, spot unmet user intents |
| **Evaluation knowledge** | Design coverage and fixtures, code trace failures, author rubrics, calibrate LLM judges, curate regression sets | Sample novel live traffic, adjudicate `disagreed` or borderline traces, detect rubric/judge drift, retire stale cases |
| **Evaluation infrastructure** | Maintain versioned SUT runners, fixture loaders, replay harnesses, dataset lineage, CI integration, workbench UI | Capture production traces and user edits, run sampling pipelines, link downstream outcomes, monitor evaluator latency/cost |

## Responsibilities and limits


Evaluation states what recorded evidence supports and where uncertainty remains; it never owns product goals, accepted risk, or release authority. Keeping roles explicit prevents engineers from quietly inventing product policy inside judge prompts and prevents PMs from treating an aggregate pass rate as a blanket guarantee:

| Role | Owns in evaluation and shipping |
| --- | --- |
| **Product manager / Commitment owner** | Problem framing, supported vs. unsupported scope, [production commitments]({{< ref "ai/product/operating-model/production-commitment" >}}), required levels on behavioral claims, latency/cost/harm trade-offs, and go/no-go or scope-narrowing decisions |
| **AI engineer** | Enforcing hard properties in code (`every time`), instrumenting trace capture contracts, building repeatable runners and fixtures, measuring run-to-run spread, calibrating automated evaluators, and diagnosing technical root causes |
| **Domain expert / Reviewer** | Defining what counts as acceptable domain behavior in discovery, labeling reference and validation traces independently, and adjudicating borderline or `disagreed` cases |

Keep three epistemic boundaries sharp across every review:

- **Evaluation establishes *what* happened** under tested or sampled conditions, how it scored against a stated basis, and how two versions compared beyond run-to-run spread.
- **Diagnosis investigates *why* it happened**—which prompt clause, retrieval miss, tool schema, model limitation, or state bug produced the behavior, verified by targeted reproduction or ablation ([Failure understanding]({{< ref "ai-engineering/evaluation/framework-v2/failure-understanding" >}})).
- **Responsible owners decide *what to commit to next***—weighing evaluation findings alongside usability, economics, reversibility, and strategy.

## References


- Huyen, C. (2022). [Designing Machine Learning Systems: An Iterative Process for Production-Ready Applications](/sources/5bbe42519087c94b06ff1a96c39c6566.bin). O'Reilly. ^huyen-2022
- Murphy, N. and Underwood, T. (2025). [Unsolved Problems in MLOps](/sources/ef367e86799f257cbc6954868ca0c06f.bin). ACM Queue 23, 47-65. ^murphy-2025
- Xia, B. et al. (2024). [Evaluation-Driven Development and Operations of LLM Agents: A Process Model and Reference Architecture](https://arxiv.org/abs/2411.13768). arXiv:2411.13768. [PDF](/sources/b06b0ce219cd90ae62a1cfdfefcd159b.bin). ^xia-2024
