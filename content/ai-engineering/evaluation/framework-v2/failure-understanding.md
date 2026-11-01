---
draft: false
toc: true
title: "Failure Understanding and Error Analysis"
description: "Turn raw traces into engineering and product knowledge through the full failure ladder—observations, failure incidents, initial and focused codes, categories, taxonomies, and failure models—while keeping operational checks and causal diagnosis on distinct paths."
linkTitle: "Failure Understanding"
---

AI products rarely fail only in the final sentence—they misread user intent, retrieve the wrong records, call a tool with bad arguments, mutate state before confirmation, or give up on a recoverable workflow. **Failure understanding** turns raw execution traces into a product-specific account of how the system fails, drawing pragmatically on grounded-theory coding and constant comparison. ([Charmaz 2014](#charmaz-2014); [Shankar and Husain 2026](#shankar-2026); [Wille and Torres 2025](#wille-torres-2025))

## The failure ladder and when to stop


The [evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#failure-knowledge-and-diagnosis) separates three paths that teams often conflate—building analytical understanding, automating repeated checks, and diagnosing technical mechanisms:

```text
ANALYTICAL PATH (what goes wrong across situations)
trace + observation + evaluation basis
  → failure incident (and first observable failure)
  → initial codes → focused codes
  → failure category → failure taxonomy → failure model

OPERATIONAL PATH (what gets checked repeatedly)
failure category, explicit requirement, or anticipated risk
  → operational failure mode → criterion → evaluator → label & measurement

DIAGNOSTIC PATH (why it happened in the implementation)
failure incident or recurring pattern
  → cause hypothesis → diagnostic investigation → established root cause
```


Not every bug should climb every rung. Match how far you go to your current [discovery or delivery]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}) purpose:

| Situation | How far to climb | What not to waste time on |
| --- | --- | --- |
| **Obvious prompt omission or missing tool** (*specification failure*) | Stop at **observation → failure incident**; edit the prompt or add the tool immediately ([Shankar and Husain 2026](#shankar-2026)) | Building an automated evaluator for behavior you never asked the model to perform |
| **Exploring an unfamiliar workflow or live launch** | Climb the **analytical path** (`initial codes → focused codes → categories → failure model`) across varied traces | Writing a rigid 1-to-5 rubric before reading real failures—at Nova Escola, pre-written rubric items had almost zero real hits ([Husain 2025b](#husain-2025b)) |
| **Protecting a commitment, comparing versions, or monitoring** | Promote selected categories, hard commitments, or severe anticipated risks to **operational failure modes** (`PRESENT` / `ABSENT`) with validated evaluators | Forcing every exploratory category to become a binary CI metric |
| **Debugging a multi-step pipeline or agent** | Follow the **diagnostic path** (`cause hypothesis → ablation / inspection → root cause`) | Treating the earliest visible trace mistake or a cluster correlation as a proven mechanism |

## Why response-level metrics miss workflow failures


A reply can be **locally correct, operationally wrong**: polite, fluent, and relevant in isolation while violating a product goal, channel constraint, or state rule. Generic "helpfulness" or "hallucination" scores routinely miss real production failures:

- **Goal and policy blind spots:** Automated trace analyzers tested on 100 apartment-leasing conversations caught 87% of human-flagged issues but missed every case where the agent politely gave up at the first sales objection, sent raw Markdown over SMS, talked over voice callers, or skipped a policy-mandated human handoff—because those rules lived outside the transcript. ([Saha and Husain 2025](#saha-2025))
- **Executable but semantically wrong actions:** Honeycomb's query assistant generated valid, runnable queries that computed `MAX(duration_ms)` without `GROUP BY trace_id`, answering a different analytical question than asked; manual trace review at NurtureBoss likewise uncovered a 66% failure rate on relative dates like *"two weeks from Tuesday"*, which targeted tests lifted from 33% to 95%. ([Husain 2024](#husain-2024); [Husain 2025a](#husain-2025a))
- **Tool success without state success:** A contact-creation tool returning HTTP `200` can still write zero rows, a duplicate row, or the wrong account unless the trace records authoritative state after the call. ([Husain and Shankar 2026](#husain-shankar-2026))

## Part I. Capture traces, observations, and failure incidents


1. **Name the question, scope, and evaluation basis.** State which workflow, user segment, and system version you are inspecting. Calling behavior a failure requires an **evaluation basis**—a provisional claim, [production commitment]({{< ref "ai/product/operating-model/production-commitment" >}}), product rule, or domain requirement ([Evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#evaluation-basis)). During early discovery, a domain expert can apply domain judgment directly and record a one-line note as the basis; if intended behavior is genuinely unsettled, record an **observation** plus an open product question rather than inventing rules silently.
2. **Assemble a varied discovery sample and capture whole traces.** Pull 10–25 purposeful cases for a quick probe, or ~100 diverse production/synthetic traces when mapping a workflow from scratch ([Cases and coverage]({{< ref "ai-engineering/evaluation/framework-v2/cases-and-coverage" >}})). Capture the full [capture contract]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#capture-contract)—inputs, initial fixtures, permissions, retrieved chunks, tool calls and payloads, user-visible replies, state changes, and component versions. When missing logs block a judgment, mark the unit `NOT JUDGEABLE` and fix instrumentation first.
3. **Separate observations, failure incidents, and first observable failure.**
   - **Observation** (pure record reading): *"At step 3, the agent called `submit_transfer` with no prior confirmation turn in the trace."*
   - **Failure incident** (judged under a basis): *"Step 3 violated the confirmation rule on `exec@1.2`."*
   - **First observable failure:** when a trace cascades through several mistakes, mark the earliest point where trace records establish wrong behavior so downstream fallout isn't double-counted as independent problems. ([Zhu et al. 2025](#zhu-2025)) Keep later severe violations visible too, and remember that the first visible mistake is a symptom location, not yet the technical root cause.

## Part II. Build the failure model through constant comparison


Do not delegate initial trace reading to an LLM or start from generic buckets (`hallucination`, `tone`, `instruction following`)—models default to vague surface categories and miss application-specific failures. Read traces alongside domain/product owners in a constant-comparison loop: **note concrete incidents → group patterns → test boundaries against successes and near misses → split or merge → sample targeted traces until categories stabilize**. ([Glaser and Strauss 1967](#glaser-1967); [Charmaz 2014](#charmaz-2014))

### Initial codes, focused codes, and failure categories


- **Initial codes** stay close to the product action in plain verbs: `omitted pet-friendly SQL filter`, `promised carrier-unavailable delivery date`, `used Markdown bullets in SMS`, `asked leading audit question assuming a cause`. Link every code to its trace ID and span, keeping unresolved observations tagged separately until a product basis settles them.
- **Focused codes** group initial codes that share the same behavioral pattern (e.g., `dropped buyer budget`, `dropped bedroom count`, and `dropped replacement preference` → `losing user-stated constraints`). Once you have dozens of human-written initial codes, an LLM can propose candidate groupings, provided humans verify every merge against the underlying traces. ([Shankar and Husain 2026](#shankar-2026))
- **Failure categories** define reusable patterns with explicit **in/out boundaries** tested against passing traces and near misses. Split broad groupings whenever two behaviors violate different expectations or require different interventions—for example, splitting *fabricated information* into **unsupported external-state claim** (inventing a listing feature) vs. **unsupported user-intent attribution** (claiming the user authorized an action). Categories may overlap in one trace and form a hierarchy; they do **not** need to be mutually exclusive or binary. Keep Working codes revisable—only judged failure incidents establish a failure category.

### Failure taxonomy, failure model, and theoretical sampling


- **Failure taxonomy:** the organized catalog of category names, definitions, boundary examples, and hierarchy for a stated product scope. ([Cemri et al. 2025](#cemri-2025))
- **Failure model:** the richer engineering knowledge built on top of the taxonomy—recording **observed conditions, variation across slices, sequence relationships, user/system consequences, supporting and contrary traces, and open questions**.

Once tentative categories emerge, switch to **theoretical sampling**: pull new traces specifically to stress-test fuzzy category boundaries or missing conditions. Speed up trace hunting with exploratory data analysis—inspect outlier distributions (turn count, tool retries, latency spikes), cluster final outputs or LLM-extracted behavioral features rather than raw topic embeddings (confirming any cluster by reading ~20 traces to check that 70–80% match one clear rule), run semantic search from known failure descriptions, and always keep a random baseline slice so novel failures still surface. ([Shankar and Husain 2026](#shankar-2026)) Stop expanding the discovery pass at **theoretical saturation**, when deliberately chosen new traces stop changing category boundaries for the current scope—typically after two or three focused coding rounds. ([Shankar et al. 2024](#shankar-2024))

## Part III. Separate root-cause diagnosis from operational checks

### Cause hypotheses, confounders, and established root causes


Temporal order in a trace is not causation, and high failure rates in traces with 6+ tool calls often reflect a **confounder**—harder user requests require more tool calls and fail more often. ([Shankar and Husain 2026](#shankar-2026)) Record any proposed technical explanation (including hypotheses suggested by a coding agent) as a **cause hypothesis** alongside competing explanations. Establish a **root cause**—with enough support for the fix or redesign that relies on it ([the shared definitions]({{< ref "ai-engineering/shared-definitions" >}}))—only through diagnostic evidence:

- **Single-variable intervention or ablation:** fix one prompt clause, swap one retriever top-\(k\), or replay a pinned turn in isolation (e.g., testing turn 4 standalone to tell retrieval misses from memory loss) and verify the failure disappears on held-out cases.
- **Implementation and state inspection:** verify tool schemas, context truncation boundaries, or orchestration state transitions directly in code. ([Ma et al. 2025](#ma-2025); [Zhang et al. 2025](#zhang-2025))

Teams can still act on behavioral evidence before proving a root cause—for instance, narrowing supported scope or adding a hard confirmation gate while diagnosis continues.

### Operational failure modes, labeling, and re-evaluation


Select a behavior as an **operational failure mode** when repeated measurement will drive a concrete decision—guarding a commitment, comparing candidate versions, or monitoring live traffic. First apply the **specification gate**: if an unclear prompt or missing tool caused the failure, fix that specification directly and skip building an evaluator. ([Shankar and Husain 2026](#shankar-2026))

An operational failure mode may come from a supported failure category (covering all of it or a narrower observable slice), an explicit product rule, or an anticipated risk. Pair each mode with a versioned **criterion** specifying its unit (trace, turn, item, or tool call), required trace records, and exact boundary for `PRESENT`, `ABSENT`, `NOT APPLICABLE`, and `NOT JUDGEABLE` ([Criteria, evaluators, and calibration]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}})). Choose your labeling strategy to match the question:

- **First-failure labeling:** label only the first observable failure per trace to rank upstream bottlenecks quickly (knowing this undercounts late-stage failures).
- **Every-failure labeling:** label all operational modes across every trace when building a complete baseline.
- **Targeted (exhaustive) labeling:** label every occurrence of the specific operational mode you just fixed across comparable cases to verify whether prevalence actually dropped. ([Shankar and Husain 2026](#shankar-2026))

Report counts with explicit denominators (`"PRESENT in 4 of 38 applicable cases; 2 NOT JUDGEABLE"`), never bare percentages on small sets, and keep occurrence separate from severity—one unauthorized write incident warrants an immediate hard code gate. Preserve lineage across `trace → incident → codes → category → failure model` and `operational mode → criterion → label → finding` so category splits or rubric edits can relabel affected traces cleanly.

## Who owns what


| Role | Owns in failure understanding |
| --- | --- |
| **PM / Domain expert** | Supplying the evaluation basis in discovery, reading traces alongside engineering, deciding whether unexpected behavior is a product bug or a mistaken product assumption, and ranking failure severity |
| **AI engineer** | Capturing complete multi-step traces, running clustering/outlier/search slicing, controlling for confounders, testing cause hypotheses via pinned-prefix replay and ablation, and fixing specification bugs before automating evaluators |

## References


- Cemri, M. et al. (2025). [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657). arXiv:2503.13657. [PDF](/sources/1e5df35ceba8b37f7f7f69d992345c69.bin). ^cemri-2025
- Charmaz, K. (2014). [Constructing Grounded Theory](/sources/13da3beb3d611915751782b45ab1faf8.bin) (2nd ed.). SAGE. ^charmaz-2014
- Glaser, B. G. and Strauss, A. L. (1967). [The Discovery of Grounded Theory: Strategies for Qualitative Research](/sources/9770487259f3f344ce2a0749d1c5599c.bin). Aldine. ^glaser-1967
- Husain, H. (2024). [Using LLM-as-a-Judge For Evaluation: A Complete Guide](https://hamel.dev/blog/posts/llm-judge/index.html). Local copy. ^husain-2024
- Husain, H. (2025a). [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/index.html). Local copy. ^husain-2025a
- Husain, H. (2025b). [Case Study: Putting Evals Into Production](https://hamel.dev/notes/llm/ai-product-engineering/evals-production.html). Local copy. ^husain-2025b
- Husain, H. and Shankar, S. (2026). [Q: What model or LLM should I use to build automated evals?](https://hamel.dev/blog/posts/evals-faq/what-model-or-llm-should-i-use-to-build-automated-evals.html). Local copy. ^husain-shankar-2026
- Ma, X. et al. (2025). [Diagnosing Failure Root Causes in Platform-Orchestrated Agentic Systems: Dataset, Taxonomy, and Benchmark](https://arxiv.org/abs/2509.23735). arXiv:2509.23735. [PDF](/sources/357f048f04984be0de2d677e589887ac.bin). ^ma-2025
- Saha, A. and Husain, H. (2025). [Do Automated Evals Work?](https://parlance-labs.com/blog/posts/auto-evals/index.html). Local copy. ^saha-2025
- Shankar, S. et al. (2024). [Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences](https://arxiv.org/abs/2404.12272). arXiv:2404.12272. ^shankar-2024
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 3, 5, and 11. O'Reilly. ^shankar-2026
- Wille, P. and Torres, T. (2025). All Things Product: AI Evals (podcast transcript). ^wille-torres-2025
- Zhang, G. et al. (2025). [AgenTracer: Who Is Inducing Failure in the LLM Agentic Systems?](https://arxiv.org/abs/2509.03312). arXiv:2509.03312. [PDF](/sources/18a3b659e726bb39af8f2afb1f45e22f.bin). ^zhang-2025
- Zhu, K. et al. (2025). [Where LLM Agents Fail and How They Can Learn From Failures](https://arxiv.org/abs/2509.25370). arXiv:2509.25370. [PDF](/sources/0dbf97dfec54cf734dbaafd41e119a5c.bin). ^zhu-2025
