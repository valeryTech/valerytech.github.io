---
draft: false
toc: true
title: "Stack 1b Learned Behavioral Llm Features"
linkTitle: "Stack 1b Learned Behavioral Llm Features"
---
# Layer 1B -- Learned or Behavioral LLM Features

## Definition


A **learned or behavioral LLM feature** is a stable property of LLM behavior that is produced by the model's learned parameters, post-training, prompt conditioning, and inference dynamics, but is not reducible to a single low-level architectural operation.

Layer 1B features are not faults. They are first-layer causal properties that make certain downstream fault modes possible or likely under specific system conditions.

They sit between:

```text
Layer 1A — Primitive model / inference mechanisms
    Tokenization, parametric prior, context window, attention, in-band control/data,
    stateless invocation, autoregression, token scoring, decoding, compute limits

Layer 1B — Learned or behavioral LLM features
    Task induction, in-context learning, interface sensitivity, plural valid-output space,
    interaction-style priors, confidence-language generation, uneven competence

Layer 2 — Feature-derived fault modes
    Ambiguous task interpretation, prompt fragility, output-format drift,
    weak calibration, over-compliance, inconsistent user experience, etc.
```


A Layer 1B feature should answer:

> What stable learned or behavioral property of LLMs shapes output across domains and prompts, without itself being an observed failure?

It should not be an observed fault, product failure, missing guardrail, evaluation metric, or user impact.

For example:

```text
Layer 1B feature:
  Learned Natural-Language Task Induction

Derived fault mode:
  Ambiguous task interpretation or task blending

System fault:
  Product relies on an underspecified prompt instead of a typed task contract

Impact:
  User receives an answer that appears responsive but fails the intended operation
```

## Inclusion criteria


A candidate belongs in Layer 1B when it satisfies all of the following:

1. It is **stable across many tasks**, not a one-off behavior.
2. It is **causal**, meaning it helps explain why downstream failure classes occur.
3. It is **not itself a failure**.
4. It is **not a narrow implementation detail** already captured by Layer 1A.
5. It is **not purely system-layer architecture** such as RAG retrieval, tracing, or tool execution.
6. It is shaped by **learned behavior, natural-language conditioning, examples, post-training, or interaction conventions**.

Layer 1B is therefore the right home for features that are real and causal but not as primitive as tokenization, attention, autoregression, or decoding.

## Feature matrix


| Code | Feature | Core question it answers | Not itself |
|---|---|---|---|
| **B1** | Learned Natural-Language Task Induction | How does the model infer what task to perform from natural-language context? | Ambiguous task interpretation |
| **B2** | In-Context Demonstration Conditioning | How do examples in the prompt define runtime behavior without weight updates? | Overfitting to examples |
| **B3** | Natural-Language Interface Sensitivity | Why can wording, framing, ordering, or genre shift behavior? | Behavioral fragility |
| **B4** | Plural Valid-Output Space | Why can multiple outputs be acceptable for the same task? | Inconsistent output |
| **B5** | Learned Interaction-Style and Persona Priors | Why does the model exhibit assistant-like tone, refusals, hedging, or agreement patterns? | Inconsistent user experience |
| **B6** | Generated Self-Assessment and Confidence Language | Why can the model produce confidence or uncertainty language without native calibration? | Weak calibration |
| **B7** | Distribution-Conditional Competence | Why does capability vary across domains, formats, languages, and task framings? | Domain failure |

# B1. Learned Natural-Language Task Induction

## Core feature


The model does not receive a formal executable task specification by default. It receives natural-language context and generates continuations conditioned on that context.

Although the base computation remains next-token prediction, instruction-tuned and chat-tuned models have learned patterns that make natural-language cues correspond to task-like behaviors such as summarization, translation, classification, extraction, critique, formatting, tool-call preparation, question answering, or role-based response.

Formally, the model still computes:

\[

P_\theta(y_i \mid x, y_{<i})

\]

But the prompt \(x\) can shift the distribution toward a task-specific output pattern. The model does not invoke a separate hard-coded `summarize()`, `translate()`, `classify()`, or `extract()` function. It induces the expected operation from the context and realizes that operation through conditional generation.

The model induces the task from:

- explicit instructions;
- conversational context;
- role markers and message structure;
- examples and demonstrations;
- formatting and delimiters;
- genre conventions;
- learned instruction-following behavior;
- pragmatic cues about what the user likely wants;
- prior examples of similar tasks seen during pretraining and post-training.

## Canonical statement


> The model infers task intent and output expectations from natural-language, pragmatic, and in-context cues rather than from a hard executable contract or task-specific function signature.

## Why this belongs in Layer 1B


This is not a primitive tensor operation. It is a learned behavioral feature produced by the interaction of several Layer 1A mechanisms:

```text
A2 Static Parametric Learned Prior
+ A3 Finite Ordered Context Interface
+ A4 Attention/Position-Mediated Context Integration
+ A5 In-Band Control/Data Representation
+ A7 Autoregressive Factorization
+ A8 Distributional Token Scoring
+ post-training / instruction tuning
→ Learned Natural-Language Task Induction
```


It belongs in Layer 1B because it is not itself a fault. It is the feature that allows a general-purpose language model to behave as if it were performing many different tasks through one text interface.

## Soft contracts


Traditional software can expose hard contracts:

```text
summarize(
  text=contract,
  max_words=150,
  preserve_all_exceptions=true,
  output_format="numbered_list",
  quote_defined_terms=true
)
```


A natural-language prompt usually exposes a soft contract:

```text
Summarize this contract in a short numbered list, preserving all exceptions and defined terms.
```


The second form requires task induction. The model must infer:

- what "summarize" means;
- what "short" means;
- what counts as an "exception";
- whether exceptions should be quoted, paraphrased, or listed;
- whether defined terms should be preserved verbatim;
- how much compression is acceptable;
- whether legal fidelity or readability has priority;
- what output structure is expected;
- which constraints are hard and which are preferences.

A soft contract can guide behavior strongly, but it is not equivalent to a typed API contract, parser, schema, validator, or deterministic program.

## NLP-specific framing


M10 can be understood as replacing explicit task-specific NLP pipelines with conditional task induction.

Classical NLP often treated tasks as separate supervised problems:

```text
Named Entity Recognition:
  token sequence → entity labels

Sentiment Analysis:
  text → sentiment class

Machine Translation:
  source-language text → target-language text

Summarization:
  document → compressed document representation

Information Extraction:
  document → structured fields
```


In an instruction-tuned LLM, these are not separate native execution modes. They are different continuation regimes under the same autoregressive objective.

The prompt provides the task frame:

```text
"Extract all named entities..."
"Classify this review..."
"Translate into French..."
"Summarize in three bullets..."
"Return valid JSON with these fields..."
```


The model maps those cues into learned output patterns. This mapping relies on:

- pretraining exposure to many genres and task formats;
- supervised instruction tuning;
- preference training or alignment methods;
- learned discourse pragmatics;
- in-context demonstrations;
- formatting conventions;
- examples of how users usually express requests.

## What it explains downstream


B1 contributes to fault modes involving:

- ambiguous task interpretation;
- paraphrase sensitivity;
- misread user intent;
- inconsistent tool routing;
- output-format drift;
- task blending when multiple instructions are combined;
- over-compliance with underspecified requests;
- treating soft preferences as hard constraints;
- treating hard constraints as optional preferences;
- producing an output that matches the apparent genre of the task but misses the operational requirement.

## Important boundary


B1 is not the same as A5 In-Band Control/Data Representation.

```text
A5:
  Instructions, data, examples, and evidence share an in-band token channel.

B1:
  The model infers what operation is being requested from that channel.
```


B1 is also not the same as A9 Decoding Path Selection.

```text
A9:
  A decoding procedure selects or samples one token path from the model's scores.

B1:
  The model's scores are shaped by its induced interpretation of the requested task.
```

# B2. In-Context Demonstration Conditioning

## Core feature


The model can use examples inside the prompt to infer a runtime task pattern without updating its parameters.

A prompt can demonstrate a mapping:

```text
Input A → Output A
Input B → Output B
Input C → ?
```


The model conditions on the demonstrated pattern and generates a continuation that follows it. This is commonly called **in-context learning** or **few-shot prompting**.

This is not parameter learning. The model's weights \(\theta\) remain fixed during inference. The examples change the conditioning context and the model's activations, not the learned parameters.

## Canonical statement


> Examples in context can act as a runtime task specification: they demonstrate the input-output mapping the model should continue, without changing the model's weights.

## Why this belongs in Layer 1B


In-context demonstration conditioning is a learned behavioral feature, not a separate training update and not a deterministic program.

It is produced by interaction among:

```text
A2 Static Parametric Learned Prior
+ A3 Finite Ordered Context Interface
+ A4 Attention/Position-Mediated Context Integration
+ A5 In-Band Control/Data Representation
+ B1 Learned Natural-Language Task Induction
→ In-Context Demonstration Conditioning
```


It deserves separate treatment from B1 because examples can specify a task more operationally than verbal instructions alone.

For example, the instruction:

```text
Classify each sentence by sentiment.
```


is weaker than:

```text
Text: "The battery lasts two hours."
Label: negative

Text: "The screen is bright and sharp."
Label: positive

Text: "The keyboard feels cheap."
Label:
```


The examples define the label space, output format, and classification standard.

## What examples can specify


In-context demonstrations can specify:

- label spaces;
- output formats;
- extraction schemas;
- transformation rules;
- edge-case handling;
- tone and style;
- level of detail;
- domain-specific conventions;
- tool-call patterns;
- refusal or escalation patterns;
- what counts as a valid answer.

## Why this is useful


Few-shot examples can be more precise than prose when the task is:

- unusual;
- hard to describe declaratively;
- dependent on edge cases;
- sensitive to output format;
- domain-specific;
- defined by examples rather than rules;
- new to the model's ordinary instruction-following distribution.

## Why this is fragile


Because examples are themselves tokens in context, they can be overused, underused, misread, or generalized incorrectly.

Example-induced behavior depends on:

- example order;
- example diversity;
- example consistency;
- similarity between examples and the new case;
- whether examples conflict with the written instruction;
- whether examples are clearly separated from data;
- how much context separates examples from the generation point;
- whether examples are treated as rules, evidence, or mere illustrations.

## What it explains downstream


B2 contributes to fault modes involving:

- overfitting to prompt examples;
- copying examples too literally;
- ignoring abstract instructions in favor of examples;
- treating examples as exhaustive rules;
- failing on cases outside the example pattern;
- label-space drift;
- inconsistent edge-case handling;
- example-order effects;
- few-shot prompt regressions after small edits.

## Important boundary


B2 is not the same as B1.

B1 is about inferring the task from natural-language cues in general.

B2 is about the specific role of in-context examples in shaping the effective task mapping without weight updates.

B2 is not itself behavioral fragility. It is the feature that allows examples to shape behavior. Fragility occurs when the system depends too heavily on narrow, accidental, inconsistent, or unrepresentative demonstrations.

B2 is also not a replacement for formal specification. If the output must satisfy strict requirements, examples should usually be paired with schemas, validators, tests, or constrained decoding.

# B3. Natural-Language Interface Sensitivity

## Core feature


LLM behavior is sensitive to wording, framing, ordering, genre, conversational context, and surface form because natural language is the primary control interface.

Two prompts can be semantically close to a human but induce different model behavior:

```text
"Summarize this."
"Condense this."
"Extract the key obligations."
"Give me the practical implications."
```


Each cue points toward a different learned task pattern.

The feature is not that the model is "fragile." The neutral feature is that the control interface is learned, semantic, pragmatic, and distributional rather than formal, typed, and deterministic.

## Canonical statement


> Because natural language is a soft learned interface, small changes in wording, framing, ordering, or examples can shift the model's induced task, output style, evidence use, or decision boundary.

## Why this belongs in Layer 1B


Prompt sensitivity was previously treated as downstream of several mechanisms. That remains true if the taxonomy is restricted to primitive mechanisms. Under the broader Layer 1B category, however, natural-language interface sensitivity is useful as a stable behavioral feature.

It emerges from:

```text
A2 Static Parametric Learned Prior
+ A3 Finite Ordered Context Interface
+ A4 Attention/Position-Mediated Context Integration
+ A5 In-Band Control/Data Representation
+ B1 Learned Natural-Language Task Induction
+ B2 In-Context Demonstration Conditioning
→ Natural-Language Interface Sensitivity
```


Small wording or ordering changes matter because they can change which tokens become most salient in context. A4 is the main mechanism that turns minor prompt edits into shifts in effective task interpretation, evidence use, or response behavior.

It is not a fault by itself. It becomes a fault when reasonable or irrelevant variation causes unacceptable changes in intended behavior.

## Sources of sensitivity


Behavior can shift due to changes in:

- wording;
- synonym choice;
- instruction order;
- example order;
- framing as question vs. command;
- role assignment;
- tone;
- delimiters;
- headings;
- list structure;
- prompt length;
- placement of constraints;
- retrieved-context ordering;
- conversation history;
- whether the task is framed as advice, classification, critique, or extraction.

## Examples


A customer-support classifier might respond differently to:

```text
"This is urgent."
"This is time-sensitive."
"This needs attention today."
```


A legal assistant might respond differently to:

```text
"Summarize this clause."
"Explain this clause."
"Extract the obligations in this clause."
"Tell me what we must do under this clause."
```


The surface forms overlap semantically, but they induce different task frames.

## What it explains downstream


B3 contributes to fault modes involving:

- behavioral fragility;
- paraphrase sensitivity;
- prompt regressions;
- framing effects;
- inconsistent refusal or escalation behavior;
- inconsistent tool use;
- brittle policy application;
- over-dependence on prompt wording;
- overfitting to narrow evaluation phrasing.

## Important boundary


B3 should not be named "prompt fragility" in Layer 1. Fragility is a failure condition.

The neutral Layer 1B feature is:

> The model's control surface is natural language, so behavior is sensitive to linguistic and contextual variation.

## Testing implication


The main testing trap is evaluating only the exact phrasing used during development.

A system can pass narrow test cases while failing semantically equivalent versions of the same task in production.

Downstream evaluation should distinguish acceptable variation from unacceptable variation. Exact textual equality is rarely the right standard; intended outcome is usually the relevant unit.

# B4. Plural Valid-Output Space

## Core feature


Many LLM tasks do not have a single uniquely correct output. Multiple outputs may be acceptable if they preserve the intended facts, decision, constraints, evidence, tone, and downstream utility.

For example, all of the following may be valid summaries of the same issue if they preserve the material facts:

```text
The customer reports repeated login failures after enabling MFA.
```

```text
The user cannot access their account after turning on multi-factor authentication.
```

```text
Access is blocked after MFA setup; the issue appears to be authentication-related.
```


The outputs differ, but they may be behaviorally equivalent for the product's purpose.

## Canonical statement


> Many LLM tasks have a space of acceptable outputs rather than one exact target string; correctness is often behavioral, semantic, and task-specific rather than exact-match.

## Why this belongs in Layer 1B


Plural valid-output space is a behavioral feature of generative language systems. It arises from:

```text
A7 Autoregressive Factorization
+ A8 Distributional Token Scoring
+ A9 Decoding Path Selection
+ B1 Learned Natural-Language Task Induction
+ B3 Natural-Language Interface Sensitivity
→ Plural Valid-Output Space
```


It is not a fault. It becomes a problem when the system lacks criteria for distinguishing acceptable variation from material errors.

## Correctness as an equivalence class


For many tasks, correctness should be evaluated at the level of behavioral equivalence, not exact text.

Potentially acceptable differences:

- wording;
- sentence order;
- equivalent terminology;
- formatting;
- level of detail within allowed bounds;
- explanation style;
- harmless paraphrase.

Potentially material differences:

- different classification;
- different escalation decision;
- different risk level;
- different external action;
- different tool call;
- different citation or evidence source;
- omitted exception;
- changed obligation;
- unsupported factual claim;
- unsafe recommendation.

## Task-specific quality criteria


Because there may be many valid outputs, systems often need explicit quality criteria, such as:

- factuality;
- completeness;
- relevance;
- grounding;
- source fidelity;
- policy compliance;
- decision accuracy;
- action safety;
- format validity;
- tone and product fit;
- usefulness to the downstream user.

These criteria are not identical across products. A creative-writing assistant can tolerate wide variation. A medical triage, financial, legal, or customer-escalation system should tolerate less variation in decisions, claims, citations, and actions.

## What it explains downstream


B4 contributes to fault modes involving:

- brittle exact-match evaluation;
- false positives in testing due to harmless paraphrase;
- false negatives in testing due to superficial similarity;
- inconsistent human review standards;
- unclear acceptance criteria;
- evaluation disagreement;
- product confusion about what counts as correct;
- failure to detect materially different decisions hidden behind similar wording.

## Important boundary


B4 is not the same as non-determinism.

```text
Non-determinism:
  The system may produce different outputs across runs.

Plural valid-output space:
  More than one output may be acceptable for the task.
```


A deterministic system can still have a plural valid-output space. A non-deterministic system can still produce unacceptable outputs.

# B5. Learned Interaction-Style and Persona Priors

## Core feature


Instruction-tuned and chat-tuned LLMs learn interaction patterns: helpfulness, politeness, refusal style, clarification behavior, conversational pacing, explanation style, confidence tone, and role-appropriate response conventions.

These behaviors are not usually specified by the user's task alone. They are shaped by pretraining, supervised fine-tuning, preference training, safety training, system prompts, product policies, and conversational context.

## Canonical statement


> The model's response is shaped not only by task content, but also by learned interaction-style priors about how an assistant should sound, when it should ask questions, when it should refuse, and how it should present uncertainty.

## Why this belongs in Layer 1B


This is a learned behavioral feature, not a primitive architecture mechanism.

It emerges from:

```text
A2 Static Parametric Learned Prior
+ A5 In-Band Control/Data Representation
+ A8 Distributional Token Scoring
+ B1 Learned Natural-Language Task Induction
+ post-training / preference optimization / policy conditioning
→ Learned Interaction-Style and Persona Priors
```


It is not itself a failure. In many products, interaction-style priors are necessary: users expect the system to be cooperative, clear, safe, and appropriately scoped.

## What it shapes


B5 can shape:

- tone;
- verbosity;
- refusal style;
- willingness to ask clarifying questions;
- willingness to infer unstated intent;
- degree of hedging;
- apparent confidence;
- tendency to agree or challenge;
- explanatory detail;
- whether the model foregrounds limitations;
- whether the response sounds like an assistant, expert, tutor, analyst, or agent.

## What it explains downstream


B5 contributes to fault modes involving:

- inconsistent user experience;
- excessive verbosity;
- excessive terseness;
- unnecessary clarification questions;
- failure to ask needed clarification questions;
- over-refusal;
- under-refusal;
- sycophantic agreement;
- overconfident tone;
- unwanted implementation disclosure;
- product-tone inconsistency.

## Important boundary


B5 is not the same as policy compliance. Policy compliance is usually a product, safety, or system-layer objective.

B5 is the learned behavioral prior that makes the model likely to express itself in certain assistant-like ways. Whether those ways are correct for a given product requires additional policy, prompt, evaluation, and system controls.

# B6. Generated Self-Assessment and Confidence Language

## Core feature


When the model expresses confidence, uncertainty, justification, or self-evaluation, it is generating language about its own answer through the same token-generation process used for any other text.

A phrase such as:

```text
"I am certain..."
"This is likely..."
"I may be wrong, but..."
"The evidence shows..."
```


is not a native calibrated confidence variable. It is a generated continuation shaped by context, learned discourse patterns, system instructions, and token likelihood.

## Canonical statement


> The model's confidence language is generated text, not a native calibrated measure of correctness, evidence support, or epistemic certainty.

## Why this belongs in Layer 1B


A8 Distributional Token Scoring already states that the model scores token likelihood rather than truth or calibrated belief. B6 is the learned behavioral feature that explains why the model can nevertheless produce confidence-sounding or uncertainty-sounding language.

It emerges from:

```text
A2 Static Parametric Learned Prior
+ A8 Distributional Token Scoring
+ B5 Learned Interaction-Style and Persona Priors
+ post-training / instruction-following conventions
→ Generated Self-Assessment and Confidence Language
```


This is not a fault by itself. It is often useful for the model to signal uncertainty, scope, limitations, or evidence quality. The risk is that these signals are not automatically calibrated.

## What it explains downstream


B6 contributes to fault modes involving:

- weak confidence calibration;
- high-confidence wrong answers;
- fluent unsupported justifications;
- non-privileged self-evaluation;
- apologetic but still incorrect answers;
- uncertainty language that does not track actual error probability;
- user over-trust in confident language;
- user under-trust when correct answers are over-hedged.

## Important boundary


B6 is not the same as A8.

```text
A8:
  The model scores next-token continuations rather than truth values.

B6:
  The model can generate language that appears to report confidence, uncertainty,
  evidence, or self-evaluation, even though that language is not natively calibrated.
```


B6 also does not imply that all confidence language is useless. Confidence expressions can correlate with correctness in some settings, especially when systems are calibrated externally, but native generated confidence should not be treated as proof.

# B7. Distribution-Conditional Competence

## Core feature


The model's competence is uneven across tasks, domains, languages, formats, and interaction patterns. Performance depends on how well the current request matches learned distributions, post-training behavior, available context, and induced task structure.

The model may perform strongly on a task that resembles common training or instruction-tuning patterns and weakly on a superficially similar task that requires rare knowledge, unusual formatting, exact symbolic manipulation, unfamiliar domain conventions, or strict operational constraints.

## Canonical statement


> LLM capability is distribution-conditioned: performance varies with domain, format, language, task framing, evidence availability, and similarity to learned patterns.

## Why this belongs in Layer 1B


This is a learned behavioral feature. It is not the same as the static parametric prior itself. A2 explains where learned background behavior comes from. B7 explains a stable behavioral consequence: competence is not uniform.

It emerges from:

```text
A1 Tokenized Representation
+ A2 Static Parametric Learned Prior
+ A3 Finite Ordered Context Interface
+ A4 Attention/Position-Mediated Context Integration
+ B1 Learned Natural-Language Task Induction
+ training / post-training distribution
→ Distribution-Conditional Competence
```

## What affects competence


Performance can vary with:

- domain familiarity;
- task rarity;
- language and script;
- tokenization density;
- prompt clarity;
- example quality;
- context completeness;
- source grounding;
- format constraints;
- need for exact symbolic operations;
- reasoning horizon;
- tool availability;
- similarity to post-training examples;
- whether the task requires tacit domain conventions.

## What it explains downstream


B7 contributes to fault modes involving:

- uneven domain performance;
- brittle behavior on rare formats;
- weak multilingual performance in some languages or scripts;
- failures on exact symbolic tasks;
- overgeneralization from familiar patterns;
- confident answers outside the model's competence region;
- benchmark/product mismatch;
- regression when changing model, prompt, or data distribution.

## Important boundary


B7 is not the same as a training-data defect.

```text
Training-layer issue:
  The data was stale, biased, incomplete, duplicated, poisoned, or domain-poor.

B7 feature:
  The model's behavior varies according to how the runtime task aligns with the learned distribution.
```


B7 is also not itself a failure. Uneven competence becomes a failure when the system does not detect, bound, evaluate, or compensate for it.

# Relationship to Layer 1A


Layer 1A captures low-level mechanisms of the base LLM and inference loop.

Layer 1B captures learned behavioral features that arise from those mechanisms plus training, post-training, and natural-language conditioning.

The boundary is:

```text
Layer 1A:
  What is the architecture/inference process doing mechanically?

Layer 1B:
  What stable learned behavioral properties emerge from that architecture and training?
```


Examples:

```text
A8 Distributional Token Scoring
  → B6 Generated Self-Assessment and Confidence Language
  → Layer 2 fault mode: confidence tone not calibrated to correctness

A5 In-Band Control/Data Representation
+ B1 Learned Natural-Language Task Induction
  → Layer 2 fault mode: instruction/data confusion or prompt injection compliance

A7 Autoregressive Factorization
+ B1 Learned Natural-Language Task Induction
+ B3 Natural-Language Interface Sensitivity
  → Layer 2 fault mode: output-format drift or task drift
```

# What should not be placed in Layer 1B


The following are better treated as Layer 2 fault modes, Layer 3 system faults, or evaluation concepts:

| Candidate | Better classification | Reason |
|---|---|---|
| Hallucination | Layer 2 fault mode | Downstream of A2, A3, A4, A8, B6, and system grounding failures. |
| Prompt injection | Layer 2 security fault mode | Downstream of A5, B1, B3, and missing system isolation. |
| Behavioral instability | Layer 2 fault mode | Excessive or unacceptable variability, not the neutral feature. |
| Prompt fragility | Layer 2 fault mode | Failure case of natural-language interface sensitivity. |
| Weak calibration | Layer 2 fault mode | Downstream of A8 and B6. |
| Sycophancy | Layer 2 behavioral fault mode | Downstream of B5, B6, A8, and post-training incentives. |
| Format drift | Layer 2 fault mode | Downstream of A7, A9, B1, B2, and B3. |
| Inconsistent user experience | Product/system fault | Downstream of B5 plus product policy and evaluation gaps. |
| Poor exact-match test performance | Evaluation issue | Often caused by B4, not itself a causal feature. |
| No validator or schema | Layer 3 system fault | Missing control, not a model feature. |

# Recommended Layer 1B formulation


A concise definition:

> **Layer 1B features are stable learned or behavioral properties of LLMs that arise from the base architecture, training, post-training, and natural-language conditioning. They are not faults, but they shape how task intent, examples, wording, output space, interaction style, confidence language, and competence distribution affect system behavior.**

Condensed:

> **Layer 1B covers the learned behavioral interface of LLMs: how they infer tasks, learn from examples in context, respond to wording and framing, permit multiple valid outputs, express assistant-like style and confidence, and vary in competence across distributions.**
