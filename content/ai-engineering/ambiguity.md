---
draft: false
toc: true
title: "Ambiguity"
linkTitle: "Ambiguity"
---
# Ambiguity in AI Systems

## Purpose


This note defines **ambiguity** as a system-level property of AI applications.

The goal is to make ambiguity usable as an engineering concept: something that can be identified, represented, bounded, evaluated, traced, and managed in production systems.

The central claim:

> **AI-system ambiguity is the gap between the behavior specified by requirements, prompts, policies, code, configuration, and context, and the broader behavioral envelope the system can plausibly exhibit across real inputs and runtime conditions.**

This does not mean AI systems are arbitrary. It means that the system's behavior is often not fully determined, inspectable, or uniquely specified by source code, prompt text, model choice, configuration, retrieved context, tools, state, and runtime environment alone.

For AI engineering, ambiguity matters because product quality depends not only on whether components are implemented, but also on whether the composed system behaves acceptably across the real distribution of inputs, users, data states, versions, and operating constraints.

## Practical definition


Use the following definition in design reviews:

> **Ambiguity in AI systems is the under-specified space between what the system is asked or configured to do and the range of behaviors it may reasonably produce.**

This includes ambiguity in:

- user intent;
- language meaning;
- referenced objects;
- task scope;
- constraints;
- acceptable output shape;
- grounding requirements;
- tool usage;
- action semantics;
- evaluation criteria;
- risk boundaries.

A system is not ambiguous merely because it uses an LLM. A system is ambiguous when there are multiple plausible interpretations, outputs, actions, or quality judgments that are not resolved by its specification.

## Ambiguity is not the same as adjacent concepts


Ambiguity is often confused with randomness, uncertainty, nondeterminism, hallucination, complexity, or the empirical nature of AI systems. These concepts overlap, but they are not equivalent.

| Concept              | What it means                                                        | Difference from ambiguity                                                                                                |
| -------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Randomness**       | Variation due to sampling, stochastic execution, or random seeds.    | A system can be ambiguous even with deterministic decoding.                                                              |
| **Nondeterminism**   | The same apparent input may produce different outputs across runs.   | Nondeterminism is execution variability; ambiguity is underdetermined meaning, behavior, or evaluation.                  |
| **Uncertainty**      | Lack of confidence about facts, outcomes, or predictions.            | Ambiguity is about multiple plausible interpretations or behaviors, not only confidence.                                 |
| **Hallucination**    | Unsupported or false model output.                                   | Ambiguity may contribute to hallucination, but hallucination is a specific failure mode.                                 |
| **Complexity**       | Many interacting parts or states.                                    | Complexity can amplify ambiguity, but ambiguity is specifically about incomplete or non-unique behavioral specification. |
| **Empirical nature** | The need to observe and measure behavior under realistic conditions. | Ambiguity is one reason AI systems require empirical validation, but it is not the whole reason.                         |
| **Drift**            | Behavior, data, environment, or model performance changes over time. | Drift changes the behavioral envelope; ambiguity describes underdetermination within or across that envelope.            |

A useful distinction:

> **Ambiguity is about under-specification of behavior. Empirical engineering is about evidence-based validation of behavior.**

## Why ambiguity exists in AI systems


Ambiguity has multiple sources. Some come from natural language. Some come from model behavior. Some come from system composition. Some come from evaluation.

### 1. Natural-language interface


Natural language is not a strict API. It supports incomplete, ambiguous, contextual, socially aware communication. See [Layer 0 Natural Language Properties]({{< ref "ai-engineering/evaluation/causal-stack/layer-0-natural-language-properties" >}})

The design lesson:

> Natural language should not be treated as a messy version of an API. It is a probabilistic, contextual, socially grounded intent protocol.

AI systems need to translate that intent protocol into structured internal representations.

### 2. Natural language vs formal execution


Programming languages, APIs, and DSLs are designed to specify executable or interpretable behavior under strict constraints. Natural languages are social, adaptive, context-sensitive systems.

The difference can be compressed as:

| System type              | Primary function                      | Success condition                                                    |
| ------------------------ | ------------------------------------- | -------------------------------------------------------------------- |
| **Natural language**     | Coordinate meaning under uncertainty. | Understood well enough.                                              |
| **Programming language** | Specify computation.                  | Parsed, type-checked, executed correctly.                            |
| **API / DSL**            | Access bounded service capabilities.  | Request conforms to contract and produces expected service behavior. |

AI applications often sit between these worlds.

The ambiguity lies in the translation:

```text
underspecified natural-language intent
→ structured interpretation
→ typed action or query
→ execution
```

### 3. Model behavior


Even after user intent is interpreted, model behavior can remain ambiguous.

A prompt rarely specifies a single correct output. It usually defines a region of acceptable behavior.

Example:

> "Write a concise explanation for a technical audience."

There are many valid completions. They may differ in:

- structure;
- terminology;
- examples;
- level of detail;
- caveats;
- assumptions;
- ordering;
- confidence;
- citation behavior;
- tone;
- refusal or escalation boundary.

This is not necessarily a defect. For many tasks, a single canonical output does not exist.

But it creates engineering concerns:

- What output variation is acceptable?
- Which variation changes the task outcome?
- Which differences are harmless wording changes?
- Which differences change factual claims, policy behavior, tool calls, or user actions?
- Which outputs are plausible but outside the product contract?

Model behavior can also shift with:

- prompt wording;
- system instructions;
- conversation history;
- retrieved context;
- examples;
- model version;
- inference parameters;
- safety layers;
- backend changes;
- tool outputs;
- context-window pressure.

Ambiguity therefore exists not only in the input. It also exists in the model's mapping from interpreted task to final behavior.

### 4. Retrieval and grounding


In retrieval-augmented systems, ambiguity includes evidence selection and evidence interpretation.

A RAG system may need to decide:

- which query to generate;
- which documents are relevant;
- which chunks to include;
- which source is authoritative;
- whether evidence is stale;
- whether sources conflict;
- whether retrieved context is sufficient;
- whether to abstain;
- how strongly to cite a source;
- whether an answer is grounded or merely plausible.

Potential ambiguity sources:

| Retrieval layer | Ambiguity source |
|---|---|
| Query generation | Multiple possible search formulations. |
| Chunking | Relevant evidence may be split, hidden, or duplicated. |
| Embeddings | Semantic similarity may not match task relevance. |
| Reranking | Different ranking criteria may select different evidence. |
| Metadata filters | Scope may be too broad or too narrow. |
| Source hierarchy | Conflicting sources require priority rules. |
| Freshness | Recent files may contain old content; old files may remain authoritative. |
| Context assembly | Evidence order and selection affect generation. |
| Citation | A claim may be partially supported, indirectly supported, or unsupported. |

A plausible answer is insufficient when the product requires grounded behavior.

The system should distinguish:

```text
retrieval failure
generation failure
citation failure
source-priority failure
abstention failure
```


Without this distinction, failures remain hard to debug.

### 5. Tool and agent behavior


Agentic systems introduce ambiguity around action selection and execution.

The model or orchestrator may need to decide:

- answer directly or call a tool;
- which tool to call;
- what arguments to pass;
- whether to ask a clarifying question;
- whether to retry after failure;
- whether to use cached state;
- whether to trust tool output over model prior knowledge;
- whether to execute, confirm, or refuse;
- when to stop.

Example:

> "Clean up the old files."

Ambiguous dimensions:

- Which files?
- How old is "old"?
- Delete, archive, compress, or move?
- Which directory?
- Is the action reversible?
- Does the user have permission?
- Should the system ask first?
- Should it produce a plan instead of acting?

For agentic systems, ambiguity becomes an action-safety issue.

A robust system should not execute irreversible external actions directly from raw language. It should construct a typed plan, validate it, and apply confirmation policy.

```text
Natural language
→ candidate intent
→ typed plan
→ validation
→ risk/reversibility assessment
→ confirmation or execution
```

### 6. Evaluation ambiguity


Many AI tasks do not have one exact correct output.

Examples:

- "good summary";
- "professional tone";
- "high-risk clause";
- "important email";
- "helpful answer";
- "safe recommendation";
- "faithful explanation";
- "executive-ready brief."

For these tasks, correctness is often:

- graded, not binary;
- multidimensional, not single-metric;
- dependent on audience and use case;
- partly subjective;
- constrained by product risk.

Evaluation ambiguity appears when there is no explicit answer to:

- What does "correct" mean?
- What variation is acceptable?
- Which criteria dominate?
- What failures are tolerable?
- Which failures are release-blocking?
- Who decides?
- How are evaluator disagreements resolved?

For soft tasks, exact-match evaluation is usually inadequate. The system needs task-specific acceptance criteria and rubrics.

### 7. System-composition ambiguity


Production AI systems are rarely a single model call. They are pipelines or graphs.

A typical system may include:

```text
input handling
→ routing
→ retrieval
→ ranking
→ prompt assembly
→ model generation
→ tool use
→ validation
→ policy checks
→ parsing
→ final response or action
```


Ambiguity emerges from the interaction between components:

- routing changes which subsystem handles the request;
- retrieval changes the evidence;
- prompt assembly changes the effective instruction;
- tool outputs change state;
- policy layers change response boundaries;
- validators may reject, repair, or transform outputs;
- UI state changes what "this" refers to;
- memory changes assumed preferences;
- runtime fallbacks change behavior under latency or failure.

The same visible user request can produce different effective scenarios depending on hidden state and component versions.

System-level ambiguity is often where production bugs live.

## Ambiguity as a behavioral envelope


The most useful engineering abstraction here is the **behavioral envelope**.

> The behavioral envelope is the set of behaviors a system can plausibly exhibit for a class of inputs under expected runtime conditions.

A system specification defines the desired envelope. The implemented system exhibits an actual envelope. Ambiguity is the gap between them.

The goal is not to eliminate all ambiguity. That would often destroy the usefulness of natural-language systems.

The goal is to make the behavioral envelope:

- explicit enough to reason about;
- observable enough to debug;
- narrow enough for the product risk level;
- flexible enough for useful interaction;
- stable enough across expected variation;
- bounded enough to prevent unsafe or unacceptable behavior.

### Behavioral envelope dimensions


The envelope can vary along several dimensions:

| Dimension | Examples |
|---|---|
| Input variation | paraphrases, typos, dialects, terse requests, long requests |
| Context variation | prior turns, memory, UI state, retrieved docs, user profile |
| Runtime variation | model version, prompt version, tool schema, timeout, fallback |
| Output variation | structure, wording, completeness, citations, confidence |
| Action variation | answer, ask, retrieve, call tool, escalate, refuse |
| Risk variation | reversible vs irreversible, low-impact vs high-impact |
| Evaluation variation | rater disagreement, rubric weights, domain-specific criteria |

Engineering controls should narrow the envelope where risk is high and permit flexibility where variation is harmless.

## Risk model: when ambiguity matters


Ambiguity is not inherently bad. It is often what makes natural-language interfaces useful.

Low-risk ambiguity:

> "Write a friendly onboarding email."

Many outputs are acceptable.

High-risk ambiguity:

> "Cancel my next appointment."

The system must resolve:

- which appointment;
- whether the user has authority;
- whether cancellation is reversible;
- whether attendees should be notified;
- whether this requires confirmation.

The central engineering question is:

> Where does ambiguity exceed the product's acceptable risk tolerance?

A practical decision model:

| Confidence | Risk                        | Reversibility | Recommended behavior                                              |
| ---------- | --------------------------- | ------------- | ----------------------------------------------------------------- |
| High       | Low                         | Reversible    | Act directly or proceed with stated assumption.                   |
| Medium     | Low                         | Reversible    | Proceed with exposed assumption or ask lightweight clarification. |
| Low        | Low                         | Reversible    | Ask clarification or present options.                             |
| High       | High                        | Reversible    | Confirm before action if user impact is material.                 |
| High       | High                        | Irreversible  | Require explicit confirmation and typed plan.                     |
| Low        | High                        | Any           | Ask clarification; do not execute.                                |
| Any        | Regulated / safety-critical | Any           | Apply policy, escalation, audit, and human-review requirements.   |

The system should use ambiguity differently depending on task risk. For low-risk tasks, ambiguity can be resolved by defaults. For high-risk tasks, ambiguity must be surfaced, constrained, or escalated.
