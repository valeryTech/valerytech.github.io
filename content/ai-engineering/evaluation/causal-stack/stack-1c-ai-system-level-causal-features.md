---
draft: false
toc: true
title: "Stack 1c Ai System Level Causal Features"
linkTitle: "Stack 1c Ai System Level Causal Features"
---
# Layer 1C -- AI-System-Level Causal Features

## Definition


An **AI-system-level causal feature** is a stable property of a deployed or deployable AI system that shapes behavior across tasks, users, data states, model versions, tools, and runtime conditions.

Layer 1C features are broader than base-model mechanisms. They are not confined to transformer internals. They describe the causal surfaces created when LLMs are embedded inside real systems: retrieval pipelines, prompts, memory, tools, schemas, post-processing, monitoring, policy controls, user interfaces, and production infrastructure.

Layer 1C features are not faults. They are first-layer properties that make certain downstream fault modes possible or likely under specific system conditions.

They sit beside, not below, the model-level layers:

```text
Layer 1A — Primitive model / inference mechanisms
    Tokenization, parametric prior, context window, attention, in-band control/data,
    stateless invocation, autoregression, token scoring, decoding, compute limits

Layer 1B — Learned or behavioral LLM features
    Task induction, in-context learning, interface sensitivity, plural valid-output space,
    interaction-style priors, confidence-language generation, uneven competence

Layer 1C — AI-system-level causal features
    Behavioral variability, soft correctness, external knowledge dependence,
    evidence grounding, compositional pipelines, agentic state-action loops,
    environment drift, resource tradeoffs, weak observability, policy mediation

Layer 2 — Feature-derived fault modes
    Hallucination, unsupported claims, retrieval misses, prompt fragility,
    tool-call errors, hidden regressions, unsafe actions, poor recoverability, etc.
```


A Layer 1C feature should answer:

> What stable system-level property shapes behavior once an LLM is placed inside a real application or workflow?

It should not be an observed failure, product incident, missing guardrail, evaluation metric, or user impact.

For example:

```text
Layer 1C feature:
  Compositional Pipeline Structure

Derived fault mode:
  Retrieval succeeded but answer generation ignored the evidence

System fault:
  Evaluation only checked final answer quality and did not capture retrieval traces

Impact:
  Team cannot localize whether the failure was caused by retrieval, prompt assembly, or generation
```

## Inclusion criteria


A candidate belongs in Layer 1C when it satisfies all of the following:

1. It is **system-level**, meaning it arises from model orchestration, retrieval, tools, state, runtime, policy controls, or production infrastructure.
2. It is **stable across many systems or workflows**, not a one-off implementation defect.
3. It is **causal**, meaning it helps explain recurring downstream failure classes.
4. It is **not itself a failure**.
5. It is **not purely a base-model mechanism** already captured by Layer 1A.
6. It is **not purely a learned model behavior** already captured by Layer 1B.
7. It helps explain why AI systems require evaluation, monitoring, traces, regression testing, and governance beyond ordinary deterministic unit tests.

Layer 1C is therefore the right home for features that appear when LLMs become products, agents, RAG systems, workflow automations, copilots, or decision-support systems.

## Feature matrix


| Code    | Feature                                   | Core question it answers                                                                     |
| ------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| **C1**  | Behavioral Outcome Variability            | Does the system preserve materially equivalent behavior across repeated or varied scenarios? |
| **C2**  | Soft Correctness Surface                  | What counts as acceptable output when there is no single exact answer?                       |
| **C3**  | External Knowledge Dependence             | Which knowledge sources shape behavior, and what happens when they change or are missing?    |
| **C4**  | Evidence-Grounded Generation Surface      | Are claims expected to be traceable to approved evidence?                                    |
| **C5**  | Compositional Pipeline Structure          | How does behavior emerge from multiple interacting components?                               |
| **C6**  | Agentic State-Action Interface            | How does the system move from generation to tools, state, decisions, or external action?     |
| **C7**  | Environment and Version Dependence        | How do model, prompt, data, tool, policy, or configuration changes affect behavior?          |
| **C8**  | Weak Native Observability and Attribution | Can failures be traced to the responsible component or condition?                            |
| **C9**  | Policy and Trust Boundary Mediation       | How are safety, compliance, authorization, and trust boundaries enforced?                    |
| **C10** | Quality-Cost-Latency Tradeoff             | What quality is feasible under operational budgets?                                          |

# C1. Behavioral Outcome Variability

## Core feature


AI systems can produce different acceptable or unacceptable behaviors across repeated runs, semantically similar inputs, changed contexts, or changed runtime conditions.

The important unit is not exact text. The important unit is the **intended outcome**:

- final answer;
- classification;
- escalation decision;
- refusal or compliance behavior;
- tool call;
- citation choice;
- external action;
- state transition;
- user-facing commitment.

Two outputs may be worded differently while preserving the same intended outcome. Conversely, two outputs may look similar while differing in a materially important decision.

## Canonical statement


> AI-system behavior should be evaluated at the level of materially intended outcomes, not exact surface text; the same or similar scenarios may yield different outcomes because generation, context, tools, retrieval, runtime, or environment conditions vary.

## Why this belongs in Layer 1C


Behavioral variability is not a fault by itself. Some variation is normal and acceptable, especially in open-ended generation. It becomes a fault only when materially relevant behavior changes under conditions where it should remain stable.

This feature captures two related cases.

### True non-determinism


The full visible scenario appears identical, and the system configuration is intended to be identical, but repeated runs produce different behavior.

Possible sources include:

- sampling;
- temperature or random seeds;
- nondeterministic model serving;
- parallelism or numerical nondeterminism;
- retrieval race conditions;
- tool timing;
- backend execution differences;
- uncontrolled orchestration state.

The evaluation question is:

> Does the same scenario preserve materially equivalent behavior across repeated runs?

### Behavioral sensitivity under variation


The input is not identical, but it is semantically similar, operationally equivalent, or different only in ways that should not affect the intended behavior.

Example:

```text
Input A:
  Summarize this issue and say if it should be escalated.

Input B:
  Briefly summarize the customer problem and decide whether escalation is needed.
```


A stable system should preserve the escalation-relevant behavior unless the wording difference changes the task in a meaningful way.

The evaluation question is:

> Does the system preserve intended behavior under reasonable variation?

## What it explains downstream


C1 contributes to fault modes involving:

- unreproducible failures;
- one-run demos that mask instability;
- inconsistent classification or escalation;
- unstable refusal or policy behavior;
- unstable tool use;
- brittle behavior under paraphrase;
- benchmark pass/fail variance across runs;
- difficult debugging because the same scenario does not always fail.

## Common engineering trap


The main trap for people coming from traditional software engineering is assuming that one successful run proves reliability.

A single successful demo only shows that the system worked once. Reliable evaluation requires repeating the same scenario and measuring whether materially correct behavior is preserved across runs.

## Important boundary


C1 is not the same as A9 Decoding Path Selection.

```text
A9:
  The decoding procedure realizes one token path from model scores.

C1:
  The end-to-end system may or may not preserve materially equivalent outcomes across repeated or varied scenarios.
```


C1 is also not itself "instability." Instability is the downstream failure mode that occurs when variability exceeds the acceptable range for the task.

# C2. Soft Correctness Surface

## Core feature


Many AI-system tasks do not have a single exact correct output. Correctness is often multidimensional, graded, task-specific, and dependent on the intended use.

A response may need to be judged by several criteria at once:

- factuality;
- completeness;
- relevance;
- grounding;
- source fidelity;
- decision accuracy;
- policy compliance;
- tone;
- usefulness;
- action safety;
- formatting correctness;
- downstream usability.

This differs from traditional deterministic unit tests, where expected outputs are often exact, binary, and localized.

## Canonical statement


> Many AI tasks have a soft correctness surface: multiple outputs may be acceptable, but acceptance depends on task-specific quality criteria rather than exact text matching.

## Why this belongs in Layer 1C


Soft correctness is a system-level feature because correctness is defined by the product task, user need, risk level, and downstream workflow, not only by model internals.

For example:

```text
Task:
  Summarize this customer issue and decide whether it should be escalated.
```


There may be many acceptable summaries, but only some preserve the necessary facts, risk signals, policy requirements, and escalation logic.

A good evaluation must define equivalence criteria:

```text
Acceptable variation:
  different wording;
  different sentence order;
  different but equivalent summary phrasing;
  different formatting that preserves all required fields.

Material variation:
  different escalation decision;
  omitted risk signal;
  unsupported claim;
  wrong citation;
  unsafe recommendation;
  different external action.
```

## What it explains downstream


C2 contributes to fault modes involving:

- overuse of exact-match evaluation;
- under-specified acceptance criteria;
- false confidence from superficial similarity;
- rejecting good outputs because wording differs;
- accepting bad outputs because wording looks plausible;
- inconsistent human review;
- unclear release gates;
- poor comparison between model, prompt, or retrieval variants.

## Important boundary


C2 is related to B4 Plural Valid-Output Space, but broader.

```text
B4:
  The model can generate multiple plausible or valid continuations.

C2:
  The system must define which outputs are acceptable for the task and risk context.
```


C2 is not a fault. The fault occurs when a system with soft correctness is evaluated as if it had a single exact answer.

# C3. External Knowledge Dependence

## Core feature


AI-system behavior often depends on multiple knowledge sources, not only the model's parametric prior.

Relevant knowledge may come from:

- pretraining and post-training;
- prompt context;
- retrieved documents;
- vector stores;
- databases;
- user memory;
- project state;
- tool outputs;
- APIs;
- current environment state;
- conversation history;
- policy documents;
- business rules.

The system's answer depends on which knowledge is available, selected, ranked, inserted, interpreted, and used.

## Canonical statement


> AI-system knowledge is distributed across the model, context, retrieval, tools, memory, and external data sources; behavior changes when any of those knowledge sources changes or is missing.

## Why this belongs in Layer 1C


The base model has a parametric prior, but real systems often need current, private, authoritative, or task-specific information. That information must be supplied by the system.

External knowledge dependence creates a causal chain:

```text
source data
  → indexing / chunking / metadata
  → retrieval
  → ranking / filtering
  → prompt assembly
  → model generation
  → citation / grounding / action
```


The model may mix retrieved evidence with learned priors. The system must therefore decide which sources are authoritative and how evidence should constrain generation.

## What it explains downstream


C3 contributes to fault modes involving:

- retrieval misses;
- stale or outdated answers;
- unsupported claims;
- irrelevant evidence use;
- source-priority confusion;
- mixing retrieved facts with model assumptions;
- failure to use available authoritative context;
- overreliance on weak retrieved context;
- answers changing when the index, documents, metadata, or tools change.

## Evaluation implications


Evaluation must explicitly measure:

- retrieval coverage;
- sensitivity to missing context;
- sensitivity to noisy or misleading context;
- whether available authoritative context was actually used.

## Important boundary


C3 is broader than A2 and A3.

```text
A2:
  The model has a static parametric learned prior.

A3:
  The model directly conditions only on finite runtime context.

C3:
  The system must manage which external knowledge sources are available, authoritative, retrievable, and inserted into the model’s context.
```


C3 is not itself a retrieval failure. Retrieval failure is a downstream fault mode when the system fails to supply or prioritize necessary knowledge.

# C4. Evidence-Grounded Generation Surface

## Core feature


Some AI systems are expected to answer from approved evidence rather than from unconstrained model prior. In those systems, claims should be traceable to provided or retrievable sources.

This is common in:

- RAG systems;
- legal assistants;
- policy assistants;
- medical or financial decision support;
- enterprise knowledge systems;
- customer support agents;
- compliance workflows;
- research assistants;
- document QA systems.

Evidence-grounded generation requires both:

```text
retrieval quality:
  Did the system fetch the necessary evidence?

source-faithful generation:
  Did the model use the evidence accurately and avoid unsupported claims?
```

## Canonical statement


> In source-grounded AI systems, answer quality depends not only on fluent generation but on whether claims are supported by approved evidence and traceable to the right sources.

## Why this belongs in Layer 1C


Grounding is not a primitive property of the base model. It is a system-level requirement imposed by product design, risk context, and source architecture.

A grounded system must manage:

- source authority;
- retrieval coverage;
- evidence ranking;
- chunk completeness;
- document freshness;
- citation generation;
- claim-source alignment;
- conflict handling;
- abstention when evidence is insufficient.

This feature is conditional. It applies when the system is supposed to answer from evidence, not when the system is doing unconstrained creative writing.

## What it explains downstream


C4 contributes to fault modes involving:

- answers not supported by retrieved documents;
- invented citations;
- correct-sounding but ungrounded explanations;
- retrieved context ignored by the model;
- source mismatch;
- citation to irrelevant evidence;
- mixing evidence with parametric assumptions;
- inability to tell whether a claim came from a source or the model prior.

## Evaluation implications


Evaluation must explicitly measure:

- source-faithful generation;
- claim-source traceability;
- unsupported-claim behavior when evidence is weak or absent;
- whether the system abstains or qualifies claims when grounding is insufficient.

## Important boundary


C4 is not the same as C3 External Knowledge Dependence.

```text
C3:
  The system depends on external knowledge sources.

C4:
  The system is expected to make claims that are traceable to authoritative evidence.
```


C4 is also not itself hallucination. Hallucination or unsupported-claim generation is a downstream fault mode when the grounding surface fails.

# C5. Compositional Pipeline Structure

## Core feature


Most real AI systems are not a single model call. They are pipelines or graphs of interacting components.

A typical system may include:

- user input handling;
- normalization;
- classification or routing;
- retrieval;
- metadata filtering;
- ranking or reranking;
- prompt assembly;
- model generation;
- tool selection;
- tool execution;
- tool-result interpretation;
- post-processing;
- validation;
- policy checks;
- output parsing;
- state updates;
- action execution;
- logging and monitoring.

End-to-end behavior depends on how these components interact.

## Canonical statement


> AI-system behavior is often compositional: final outputs and actions emerge from multiple interacting components rather than from one isolated model invocation.

## Why this belongs in Layer 1C


Pipeline composition creates causal surfaces that do not exist in a single base-model call.

A system can fail because:

```text
input was misclassified;
retrieval missed the key document;
reranker demoted the correct chunk;
prompt assembly buried the evidence;
model ignored the evidence;
parser rejected the output;
tool schema was ambiguous;
post-processor stripped required fields;
policy layer blocked the answer;
state update wrote the wrong value.
```


The final answer alone often does not reveal which component caused the outcome.

## What it explains downstream


C5 contributes to fault modes involving:

- hard-to-localize root cause;
- silent degradation in one component;
- retrieval-good-generation-bad cases;
- retrieval-bad-generation-good cases;
- parser and formatting failures;
- prompt assembly regressions;
- tool-schema mismatch;
- brittle handoff between components;
- component-level improvements that do not improve end-to-end behavior.

## Evaluation implications


Evaluation requires traceability across stages so teams can distinguish:

- retrieval failures from generation failures;
- prompt-assembly failures from evidence-use failures;
- parser or schema failures from model failures;
- policy-layer failures from upstream content failures.

## Important boundary


C5 is not the same as weak observability.

```text
C5:
  The system is composed of interacting stages.

C8:
  The system does not naturally expose enough trace information to diagnose which stage caused failure.
```


C5 is not a fault. A pipeline may be well designed. The downstream fault occurs when interaction effects are not controlled, tested, or instrumented.

# C6. Agentic State-Action Interface

## Core feature


Agentic AI systems do more than produce answer text. They can plan, call tools, inspect outputs, update state, make decisions, and sometimes act in the external world.

An agentic system may involve:

- task decomposition;
- planning;
- tool selection;
- tool argument construction;
- API calls;
- browser or database operations;
- code execution;
- memory reads and writes;
- state transitions;
- retries;
- recovery after errors;
- final action execution;
- user confirmation or escalation.

Final success depends on the whole behavior chain, not only the final message.

## Canonical statement


> Agentic systems expose a state-action loop: the system interprets context, chooses steps, calls tools or takes actions, observes results, updates state, and continues until stopping.

## Why this belongs in Layer 1C


A base LLM emits text or structured tokens. An agentic system interprets some of those outputs as actions or tool calls.

This creates additional causal surfaces:

- whether the model chooses the right tool;
- whether arguments are correct;
- whether tool outputs are interpreted accurately;
- whether the system preserves state;
- whether it recovers from errors;
- whether it stops at the right time;
- whether an action is safe and justified.

Agentic workflows often have several valid plans. Evaluation must therefore assess process quality, not only final answer quality.

## What it explains downstream


C6 contributes to fault modes involving:

- wrong tool choice;
- correct tool with wrong arguments;
- missing required steps;
- unnecessary steps;
- premature stopping;
- loops;
- failure to recover from tool errors;
- misinterpreted tool output;
- unsafe or unjustified external actions;
- state corruption;
- action taken without enough evidence.

## Evaluation implications


Evaluation must assess intermediate process quality, not just final output quality. That includes:

- plan quality;
- tool-call correctness;
- step efficiency;
- recovery behavior;
- stopping behavior;
- task completion success under realistic tool and state conditions.

## Important boundary


C6 is not the same as A9 Decoding Path Selection.

```text
A9:
  A token path is selected from model scores.

C6:
  Some selected outputs are interpreted by the system as tool calls, decisions, state transitions, or real-world actions.
```


C6 is not itself an unsafe action. Unsafe action is a downstream fault mode when action selection, authorization, validation, or recovery fails.

# C7. Environment and Version Dependence

## Core feature


AI-system behavior depends on mutable system conditions. A user-facing input may appear the same while the underlying environment has changed.

This is one of the main reasons LLM-based systems are prone to hidden regressions: behavior can change after updates even when the user-facing task appears unchanged.

Relevant changing conditions include:

- model version;
- model provider;
- decoding parameters;
- system prompt;
- developer prompt;
- prompt template;
- embedding model;
- retrieval index;
- chunking strategy;
- ranking logic;
- retrieved documents;
- document ordering;
- source data;
- database state;
- API response format;
- tool schemas;
- available tools;
- policy version;
- guardrails;
- output parser;
- conversation history;
- user profile or memory;
- backend configuration.

## Canonical statement


> AI-system behavior is version- and environment-dependent; apparent model variability may be caused by uncontrolled changes in the surrounding system state.

## Why this belongs in Layer 1C


This feature explains why "same prompt, different result" is often not true model randomness. The full scenario may not actually be the same.

Example:

```text
User request:
  Summarize this support ticket and decide whether it should be escalated.

Run 1:
  model version A;
  original CRM notes;
  policy version 3;
  old escalation rubric.

Run 2:
  model version B;
  updated CRM note mentions possible account compromise;
  policy version 4;
  revised escalation rubric.
```


A different escalation decision may be correct, but the evaluation should treat this as a changed scenario, not unexplained nondeterminism.

## What it explains downstream


C7 contributes to fault modes involving:

- hidden regressions;
- prompt edits that fix one case and break another;
- model upgrades that change refusal, escalation, or tool behavior;
- retrieval-index changes that surface different evidence;
- data refreshes that change classifications;
- tool API changes that break parsers;
- policy updates that change allowed behavior;
- evaluation results that are not comparable across runs.

## Why this commonly appears as hidden regression


AI systems are especially prone to hidden regressions because behavior depends on mutable model, prompt, retrieval, policy, tool, schema, and state conditions that are easy to change without obvious surface cues.

When one of those conditions shifts, the visible task may still look "the same" to the team or the user, while the effective runtime scenario is no longer the same. That makes behavioral degradation easy to misread as randomness, flakiness, or isolated incident noise instead of a change-induced failure.

This is why hidden regression is better treated as a common manifestation of C7 than as a separate primitive feature.

## Common engineering trap


The main trap is treating environmental drift as if it were random model behavior.

If an input yields a different result today than yesterday, the cause is rarely model nondeterminism. It is usually an uncontrolled change in the surrounding system state, such as the retrieval index, tool API, prompt template, policy version, or available context.

## Important boundary


C7 is not the same as C1 Behavioral Outcome Variability.

```text
C1:
  Behavior may vary across repeated or varied scenarios.

C7:
  Behavior may change because the underlying system version or environment changed.
```


C7 is not itself a regression. Regression is the downstream fault mode when a change degrades behavior relative to an acceptance standard.

# C8. Weak Native Observability and Attribution

## Core feature


AI systems often do not naturally expose a clean causal explanation for their behavior. When a system fails, the observed final output may not reveal whether the cause was the user input, prompt, model, retrieval, ranking, tool output, parser, policy layer, state, or runtime condition.

Useful diagnosis often requires explicit traces.

A trace may include:

- user input;
- normalized input;
- system and developer prompts;
- retrieved documents;
- retrieval scores;
- reranking scores;
- prompt assembly;
- model inputs and outputs;
- decoding configuration;
- tool calls;
- tool arguments;
- tool outputs;
- intermediate decisions;
- validator outputs;
- policy checks;
- parser results;
- state reads and writes;
- latency and cost metrics;
- human labels or judgments.

## Canonical statement


> AI-system behavior is weakly observable by default; reliable debugging and governance require explicit instrumentation, traces, evidence capture, and failure attribution.

## Why this belongs in Layer 1C


Traditional software failures often have localized stack traces, deterministic reproducers, and crisp expected outputs. AI systems frequently combine probabilistic generation, soft correctness, retrieval, tools, policies, and mutable state.

The final answer alone may not reveal:

```text
Was the right document retrieved?
Was it ranked high enough?
Was it included in the prompt?
Did the model ignore it?
Did the parser alter the output?
Did the policy layer block part of the answer?
Did a tool return stale data?
Did a timeout force fallback behavior?
```

## What it explains downstream


C8 contributes to fault modes involving:

- hard-to-debug failures;
- low auditability;
- inability to reproduce failures;
- inability to compare alternatives;
- unclear release decisions;
- weak stakeholder trust;
- failure analysis based on anecdotes;
- inability to locate the failing component;
- monitoring that detects bad outcomes but not causes.

## Important boundary


C8 is not the same as poor observability as a system defect.

```text
C8 feature:
  AI systems are not naturally self-explaining or fully traceable.

Layer 3 system fault:
  Product failed to capture traces, evidence, tool calls, and intermediate decisions.
```


C8 is also distinct from model interpretability. Even if model internals remain opaque, system-level observability can still capture enough traces to diagnose many production failures.

# C9. Policy and Trust Boundary Mediation

## Core feature


AI systems often operate under safety, compliance, privacy, brand, legal, or operational boundaries. These boundaries are mediated by a combination of learned model behavior, prompts, policy layers, retrieval controls, tool permissions, validators, user experience design, and human oversight.

The system may need to regulate:

- sensitive data exposure;
- legal, medical, financial, or safety advice;
- protected-class or fairness-sensitive content;
- confidential internal context;
- user authentication and authorization;
- tool access;
- external actions;
- irreversible actions;
- brand and tone constraints;
- escalation or refusal behavior;
- audit logging;
- human approval thresholds.

## Canonical statement


> AI-system safety and trust boundaries are not enforced by the base model alone; they are mediated across model behavior, prompts, policy controls, tool authorization, validation, and product design.

## Why this belongs in Layer 1C


The base model does not inherently know the full business, legal, security, or user-trust boundary of a product. The system must encode and enforce those boundaries through multiple layers.

For example, an agent that can send emails, update records, execute code, or trigger business processes requires stronger controls than a passive question-answering assistant.

Policy mediation may include:

- system instructions;
- retrieval filters;
- content classifiers;
- tool permissioning;
- action confirmation;
- schema constraints;
- post-generation validation;
- sensitive-data redaction;
- audit logging;
- human-in-the-loop escalation;
- refusal and safe-completion behavior.

## What it explains downstream


C9 contributes to fault modes involving:

- leaking sensitive data;
- unauthorized recommendations;
- unsafe advice;
- over-refusal;
- under-refusal;
- unsafe tool use;
- irreversible actions taken too easily;
- policy inconsistency;
- exposing internal prompts or confidential context;
- weak escalation behavior;
- brand or compliance violations.

## Important boundary


C9 is not itself a safety failure. It is the causal feature that safety behavior is mediated across multiple model and system layers.

It interacts strongly with:

```text
A5 In-Band Control/Data Representation
B1 Learned Natural-Language Task Induction
C5 Compositional Pipeline Structure
C6 Agentic State-Action Interface
C8 Weak Native Observability and Attribution
```


A safety incident belongs downstream, usually as a Layer 2 fault mode, Layer 3 system fault, or Layer 4 user/business impact.

# C10. Quality-Cost-Latency Tradeoff

## Core feature


AI systems operate under practical resource constraints. Higher-quality behavior may require more computation, retrieval, tool use, validation, or human review, but those improvements increase latency, cost, complexity, and operational risk.

Quality-improving interventions may include:

- larger models;
- longer context;
- more retrieval;
- better reranking;
- more tool calls;
- multiple samples;
- self-checking;
- verifier passes;
- constrained decoding;
- retries;
- human review;
- more detailed traces;
- stronger policy checks.

These can improve reliability, but they also affect:

- latency;
- token usage;
- cost per task;
- throughput;
- timeout rate;
- tool-call count;
- error surface area;
- system complexity;
- user experience.

## Canonical statement


> AI-system quality is constrained by operational budgets; the goal is not maximum possible quality, but acceptable quality at acceptable cost, latency, reliability, and risk.

## Why this belongs in Layer 1C


This is the system-level counterpart to transformer compute scaling.

A base model may perform better with more context, more passes, or more samples. A deployed system must decide whether those extra resources are feasible for the product context.

Examples:

```text
A legal assistant may justify slower responses for stronger citation checking.

A customer support triage system may need lower latency and simpler verification.

A high-risk agentic action may require tool authorization, dry runs, or human approval.
```

## What it explains downstream


C10 contributes to fault modes involving:

- skipped verification;
- insufficient retrieval;
- over-compressed context;
- premature stopping;
- timeout-driven shortcuts;
- failure to run multi-pass validation;
- excessive cost from over-engineered flows;
- poor user experience from high latency;
- unsafe simplification of high-risk workflows;
- release decisions based on quality without operational metrics.

## Important boundary


C10 is broader than A10 Transformer Compute Scaling.

```text
A10:
  Transformer inference imposes token, latency, memory, and compute budgets.

C10:
  The full AI system must trade quality against cost, latency, reliability, tool use, monitoring, and operational complexity.
```


C10 is not a product performance bug. It is the resource tradeoff surface that shapes system design.

# Condensed formulation


A polished definition:

> **Layer 1C features are the system-level causal properties of AI applications: behavior varies across runs and contexts, correctness is soft and task-specific, knowledge is distributed across external sources, outputs may need grounding, behavior emerges from pipelines and agents, runtime environments drift, quality is resource-constrained, failures are weakly observable by default, and safety boundaries require multi-layer mediation.**

Condensed:

> **An AI system is a model-centered, context-dependent, pipeline-mediated, environment-sensitive, resource-constrained system whose behavior must be evaluated at the level of intended outcomes, evidence grounding, process quality, safety boundaries, and operational reliability.**
