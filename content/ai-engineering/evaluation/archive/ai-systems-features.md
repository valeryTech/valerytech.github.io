---
draft: false
toc: true
title: "Ai Systems Features"
linkTitle: "Ai Systems Features"
---
Understanding LLM mechanisms and AI-system failure modes gives us a practical engineering advantage. Instead of discovering weaknesses only through production incidents, we can anticipate them during system design. The mechanism stack lets us identify which causal surfaces are relevant for a given application, derive likely failure modes, and then select appropriate controls, traces, recovery paths, and evaluations before deployment.

In practice, this supports four core engineering functions:

1. **Prevent** classes of failures through design-time controls such as schemas, validators, retrieval design, source grounding, prompt contracts, policy gates, and tool authorization.
2. **Detect** failures quickly through instrumentation, traces, monitoring, and component-level observability.
3. **Recover** gracefully through fallbacks, retries, abstention, clarification, human escalation, rollback, and safe degraded modes.
4. **Prove** the system works through evaluations, scenario tests, adversarial tests, regression gates, and release criteria.

This moves AI engineering from trial-and-error prompt iteration toward mechanism-informed architecture. The engineer can ask, before launch: Which mechanisms are active? Which failure modes are likely? Which controls are needed? What must be logged? How will the system recover? What evidence proves the behavior is acceptable?

## Behavior Instability


AI systems can be behaviorally unstable.

In some configurations, the same input can produce different outputs across repeated runs. This differs from the behavior expected from many conventional software systems.

However, the issue is not simply whether the system gives the exact same answer twice. The more important question is whether it preserves **acceptable behavior** across repeated runs and realistic variation.

A system is behaviorally stable when irrelevant or minor changes do not materially change the intended outcome. This includes preserving the relevant:

- final answer;
- decision or classification;
- risk level;
- refusal or escalation behavior;
- tool calls;
- citations or evidence used;
- external action taken.

Two outputs can be worded differently while still being behaviorally equivalent. Conversely, two outputs can look similar while differing in a critical decision, escalation, tool call, etc.

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
Behavioral stability should be evaluated at the level of **intended outcome**, not exact text.
{{< /callout >}}


Behavior instability can be divided into two related but distinct cases: **true non-determinism** and **behavioral fragility**.

### True Non-Determinism


**True non-determinism** means that the same visible input, same system instructions, same tools, same retrieved context, and same runtime configuration produce different outputs across repeated runs.

This can happen because of sampling, temperature, nondeterministic model serving, parallelism, tool timing, retrieval race conditions, or other uncontrolled execution details.

The key question is not:

> Does the system produce identical text every time?

The better question is:

> Does the system produce acceptably similar behavior across repeated runs of the same scenario?

True non-determinism creates practical reliability problems:

- a workflow works once but fails later;
- failures are hard to reproduce;
- debugging is difficult because the same test does not always fail;
- a demo looks reliable even though repeated runs reveal instability;
- automated evaluations may pass or fail depending on the run.

The main trap for people coming from software engineering is assuming that one successful run proves reliability. It does not. A single successful demo only shows that the system worked once.

A more reliable evaluation repeats the same scenario multiple times and measures whether the system preserves the same materially correct behavior.

### Behavioral Fragility


**Behavioral fragility** means that small or reasonable changes in input, context, prompt wording, retrieved documents, tool output, or conversation history cause disproportionately large changes in behavior.

Here the input is not identical. It is semantically similar, operationally equivalent, or different only in ways that should not affect the intended behavior.

Example:

Input A:

> "Summarize this issue and say if it should be escalated."

Input B:

> "Briefly summarize the customer problem and decide whether escalation is needed."

A robust system should behave similarly. A fragile system might escalate in one case but not the other.

The evaluation question is:

> Does the system preserve intended behavior under reasonable variation?

Behavioral fragility often appears when:

- small wording changes cause large output changes;
- behavior depends heavily on framing;
- prompt design acts like soft programming;
- examples in the prompt are followed too literally;
- borderline cases flip unpredictably;
- tool use varies for reasons unrelated to the task;
- policy application changes across similar cases.

Typical causes include:

- brittle prompts;
- regressions from prompt edits;
- overfitting to examples or narrow evaluation sets;
- inconsistent behavior in edge cases;
- unstable tool use;
- unstable refusal, escalation, or routing decisions.

For example, a prompt may work well when the user says "urgent," but fail when the same situation is described as "time-sensitive." That suggests the system has overfit to specific wording rather than preserving the intended behavior.

The main trap is testing only the exact phrasing used during development. A system can pass narrow test cases while failing semantically equivalent versions of the same task.

### Behavioral Equivalence


(do we really need it?)

> We should make sharper distinction between **acceptable variation** and **unacceptable variation**.

Behavioral stability requires predefined equivalence criteria. These criteria should specify which differences are acceptable, which are material, and which are critical failures.

For example, the following differences may be acceptable in many tasks:

- different wording; - different sentence order; - different formatting; - different but equivalent explanations;

Other differences may be material:

- different classification; - different escalation decision; - different tool calls; - different external action;

The relevant standard depends on the system. A creative writing assistant may tolerate large surface variation. A medical triage system, financial workflow, legal assistant, or customer escalation system should tolerate far less behavioral variation.

### Evaluation Principle


Behavioral stability should be evaluated at the level of **intended outcome**, not exact text.

The two forms of instability require different evaluation questions:

- **True non-determinism** asks whether the system is repeatable:  does the same scenario produce acceptably similar behavior across repeated runs?
- **Behavioral fragility** asks whether the system is robust under variation: do semantically similar or operationally equivalent scenarios produce acceptably similar behavior?

For free-form generation, some wording variation is normal and often acceptable. What matters is whether the system preserves the facts, decision, policy behavior, citations, tool use, and user-facing commitments that define correct behavior for the task.

## 1. Probabilistic / generative nature


These systems are **not deterministic rule engines**. They generate outputs based on probabilities, context, and learned patterns.

### Characteristic features


- non-deterministic outputs;
- sensitivity to wording and context;
- multiple plausible answers;

??

- variable quality across similar cases;
- fluent output even when wrong.

### Typical problems


- inconsistent behavior;
- hard-to-reproduce failures;
- difficult debugging.
- hallucinations;
- weak calibration of confidence;

### Why evaluation is needed


We need to measure:

- consistency;
- accuracy / factuality;
- robustness to prompt variation;
- failure patterns across repeated runs.

## Lack of clear correctness


For many AI tasks, there is no single exact answer.

Example:

> "Summarize this customer issue and decide whether it should be escalated."

There may be several acceptable summaries, but some are incomplete, misleading, or unsafe.

The evaluation goal is to define **task-specific quality criteria**, such as:

- factuality;
- completeness;
- relevance;
- grounding;
- tone;
- policy compliance;
- decision accuracy;
- usefulness to the downstream user.

This is different from traditional unit tests, where the expected output is often exact.

## Hallucination and unsupported claims


LLMs may generate fluent but false information.

In RAG systems, this often appears as:

- answers not supported by retrieved documents;
- invented citations;
- correct-sounding but ungrounded explanations;
- mixing retrieved facts with model assumptions.

The evaluation goal is to measure whether the system is **grounded in approved sources** and whether claims are traceable to evidence.

For RAG, this usually means evaluating both:

1. **retrieval quality** -- did we fetch the right context?
2. **generation quality** -- did the model use that context faithfully?

## Inconsistent user experience


An AI system can be technically correct but still poor from a product perspective.

Problems include:

- answers are too verbose;
- answers are too terse;
- confidence is not calibrated;
- the system asks unnecessary clarification questions;
- the system refuses too often;
- the system over-answers simple questions;
- tone varies unpredictably;
- the system exposes implementation details to users.

The evaluation goal is to measure whether the system behaves consistently with the intended product experience.

This is particularly important for customer-facing agents.

# A map of AI-system characteristics

## Knowledge dependence


AI systems do not "contain" all knowledge reliably. Their behavior depends on:

- pretraining knowledge;
- retrieved context;
- memory/state;
- external tools and data sources.

### Characteristic features


- answers depend on what context is available;
- knowledge may be stale or incomplete;
- relevance of retrieved information matters a lot;
- system may mix retrieved facts with model priors.

### Typical problems


- hallucinated facts;
- unsupported answers;
- retrieval misses;
- outdated or irrelevant context;
- weak source grounding.

### Why evaluation is needed


We need to measure:

- retrieval quality;
- grounding / citation support;
- faithfulness to evidence;
- sensitivity to missing or noisy context.

## Compositional / pipeline structure


Most real AI systems are **not just one model call**. They are pipelines:

- user input handling;
- retrieval;
- ranking;
- prompt assembly;
- model generation;
- post-processing;
- tool use;
- action execution.

### Characteristic features


- end-to-end behavior depends on many components;
- failures can happen at multiple stages;
- quality is often bottlenecked by one weak stage;
- interaction effects are common.

### Typical problems


- hard to localize root cause;
- retrieval might be good but answer bad;
- answer might be good despite weak retrieval;
- formatting/parser failures;
- silent degradation in one component.

### Why evaluation is needed


We need:

- component-level evaluation;
- end-to-end evaluation;
- traceability across stages;
- clear attribution of failure source.

## Agentic / action-taking behavior


Agentic systems do not just answer -- they:

- plan;
- call tools;
- inspect outputs;
- make decisions;
- maintain state;
- sometimes act in the world.

### Characteristic features


- multi-step reasoning and execution;
- dependence on tool schemas and APIs;
- intermediate state matters;
- there may be several valid plans;
- final success depends on process, not just output text.

### Typical problems


- wrong tool choice;
- wrong tool arguments;
- unnecessary or missing steps;
- failure recovery issues;
- loops or premature stopping;
- unsafe or unjustified actions.

### Why evaluation is needed


We need to measure:

- plan quality;
- tool-call correctness;
- step efficiency;
- recovery behavior;
- task completion success;
- action safety.

## Data and knowledge drift


AI systems depend on changing external context.

RAG systems are especially exposed to:

- new documents;
- deleted documents;
- outdated policies;
- changed business rules;
- updated APIs;
- renamed entities;
- changed user behavior.

The evaluation goal is to monitor whether the system remains accurate as the underlying knowledge base and environment change.

This is not just pre-release testing. It also requires ongoing evaluation in production or near-production conditions.

## Safety, compliance, and trust failures


AI systems may produce outputs that are not merely wrong, but risky.

Examples:

- leaking sensitive data;
- making unauthorized recommendations;
- giving legal, medical, or financial claims beyond scope;
- violating brand or policy rules;
- taking irreversible actions too easily;
- exposing internal reasoning or confidential context;
- generating biased or inappropriate content.

The evaluation goal is to enforce behavioral boundaries and measure risk, not only task success.

For agentic workflows, this is especially important when the system can send emails, update records, execute code, or trigger business processes.

# AI Systems-level

## Hidden regressions


AI systems are highly sensitive to changes.

A seemingly minor change can cause regression:

- prompt wording;
- model version;
- embedding model;
- retrieval parameters;
- chunking strategy;
- tool schema;
- system instructions;
- ranking logic;
- source data;
- guardrails;
- output parser.

The evaluation goal is to detect regressions before deployment.

The harness should answer:

> "Did this change improve the system overall, or did it just improve the cases we happened to inspect manually?"

## Poor observability


When an AI system fails, the reason is often unclear.

Was the problem caused by:

- the user query?
- the prompt?
- the model?
- retrieval?
- ranking?
- missing source data?
- a tool failure?
- a bad intermediate decision?
- output formatting?
- policy constraints?
- latency or timeout behavior?

The evaluation goal is to make failures diagnosable.

A useful evaluation platform should capture traces, inputs, outputs, retrieved context, tool calls, scores, labels, and human judgments so that teams can locate the failure point.

## 7. Weak inherent interpretability


AI systems often give outputs without exposing a clean causal explanation.

### Characteristic features


- internal decision-making is opaque;
- outputs can look confident without being well-founded;
- root causes are rarely obvious.

### Typical problems


- difficult debugging;
- low trust;
- hard stakeholder buy-in;
- hard error analysis;
- poor auditability.

### Why evaluation is needed


We need:

- observability;
- traces;
- evidence capture;
- structured failure analysis;
- human review workflows.

## Difficulty comparing alternatives


Teams often need to compare:

- model A vs. model B;
- prompt v1 vs. prompt v2;
- retrieval strategy A vs. B;
- agent architecture A vs. B;
- different chunking approaches;
- different rerankers;
- different guardrail settings.

Without a harness, these comparisons are anecdotal.

The evaluation goal is to support controlled experiments with comparable metrics, datasets, and failure analysis.

## Operational Instability / Environment Drift


**Operational instability** means that the input may appear to be the same from the user's perspective, but the underlying system conditions have changed.

This is not true non-determinism, because the full system state is not actually identical. The behavior changes because some part of the operating environment changed.

Examples of changed conditions include:

- model version;
- system prompt;
- developer prompt;
- retrieval index;
- retrieved documents;
- document ordering;
- tool output;
- database state;
- API response format;
- backend configuration;
- policy version;
- available tools;
- conversation history.

Example:

> User: "Summarize this support ticket and decide whether it should be escalated."

Run 1 uses model version A and retrieves the original ticket notes.

Run 2 uses model version B and retrieves an updated CRM record mentioning possible account compromise.

The system may now escalate the case. That may be correct, but it is not the same scenario anymore. The evaluation should treat this as a versioning, data, or environment-change problem.

The evaluation question is:

> Does the system preserve acceptable behavior across controlled changes in model, prompt, tools, retrieval, and data?

Useful tests include:

- regression tests after model changes;
- regression tests after prompt edits;
- comparisons across model versions;
- retrieval-index version tests;
- tool-response format tests;
- data-state tests;
- policy-version tests;
- conversation-history tests.

Typical problems include:

- a prompt edit improves one case but breaks another;
- a model upgrade changes escalation behavior;
- a retrieval change surfaces different evidence;
- a tool API changes format and causes parsing failures;
- a policy update changes refusal behavior;
- a data refresh changes classifications or recommendations.

The main trap is treating environmental drift as if it were random model behavior.

The cause may not be randomness. It may be an uncontrolled change in the system around the model.

## Cost, latency, and reliability tradeoffs


AI systems have operational constraints.

A better answer may require:

- more retrieval;
- more tool calls;
- a larger model;
- longer context;
- reranking;
- multiple reasoning passes;
- self-checking.

But these increase cost and latency.

The evaluation goal is to measure quality together with operational metrics:

- accuracy; - success rate; - latency; - token usage; - tool-call count; - cost per task; - retry rate; - timeout rate; - failure recovery rate.

The goal is not just "best quality." It is **acceptable quality at acceptable cost and latency**.
