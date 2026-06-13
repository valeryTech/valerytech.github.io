---
draft: false
toc: true
title: "Layer 1b Learned Behavioral Features"
linkTitle: "Layer 1b Learned Behavioral Features"
---
# UNDER CONSTRUCTION

# Layer 1B -- Learned or Behavioral LLM Features

## Definition


A **learned or behavioral LLM feature** is a stable property of LLM behavior that is produced by the model's learned parameters, post-training, prompt conditioning, and inference dynamics, but is not reducible to a single low-level architectural operation.

Layer 1B features are not faults. They are first-layer causal properties that make certain downstream fault modes possible or likely under specific system conditions.

## Feature matrix


| Code    | Feature                                            | Group                            | Core question                                                      | Not itself                                   |
| ------- | -------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| **B1**  | Learned Natural-Language Task Induction            | Task/control conditioning        | How does the model infer the requested operation?                  | Ambiguous task interpretation                |
| **B2**  | In-Context Demonstration Conditioning              | Task/control conditioning        | How do examples define runtime behavior without weight updates?    | Overfitting to examples                      |
| **B3**  | Natural-Language Interface Sensitivity             | Task/control conditioning        | Why do wording, framing, order, and genre shift behavior?          | Prompt fragility                             |
| **B8**  | Learned Cooperative Completion Prior               | Response formation               | Why does the model tend to produce a helpful-looking completion?   | Hallucination / sycophancy / over-compliance |
| **B4**  | Plural Valid-Output Space                          | Response/output semantics        | Why can many outputs be valid for the same task?                   | Inconsistent output                          |
| **B6**  | Generated Self-Assessment and Confidence Language  | Response/output semantics        | Why can confidence language appear without native calibration?     | Weak calibration                             |
| **B5**  | Learned Interaction-Style and Persona Priors       | Interaction/post-training priors | Why does the model adopt assistant-like tone and posture?          | Product-tone inconsistency                   |
| **B9**  | Learned Policy-Boundary Generalization             | Interaction/post-training priors | Why does the model generalize comply/refuse/redirect behavior?     | Policy compliance / over-refusal             |
| **B7**  | Distribution-Conditional Competence                | Knowledge/competence             | Why does capability vary by domain, format, language, and framing? | Domain failure                               |
| **B10** | Parametric Prior Persistence and Temporal Blending | Knowledge/competence             | Why can old, new, retrieved, and context-local facts interfere?    | Temporal hallucination / RAG failure         |

## Grouped feature map


The B-codes are stable identifiers, not a strict reading order. The sections below are grouped by causal role so related features can be read together without renumbering existing references.

The groups are:

1. **Task and control-surface conditioning** -- how the model infers tasks and responds to the natural-language interface.
2. **Cooperative response formation and output semantics** -- how the model forms, varies, and presents answers.
3. **Post-training interaction and policy priors** -- how interaction style and policy-boundary behavior are learned.
4. **Knowledge, competence, and distributional conflict** -- how capability and factual behavior vary across learned distributions and competing knowledge signals.

## Group I -- Task and control-surface conditioning

### B1. Learned Natural-Language Task Induction

#### Core feature


The model does not receive a formal executable task specification by default. It receives natural-language context and generates continuations conditioned on that context.

Although the base computation remains next-token prediction, instruction-tuned and chat-tuned models have learned patterns that make natural-language cues correspond to task-like behaviors such as summarization, translation, classification, extraction, critique, formatting, tool-call preparation, question answering, or role-based response.

Formally, the model still computes:

\[P_\theta(y_i \mid x, y_{<i})\]

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

#### Canonical statement


> The model infers task intent and output expectations from natural-language, pragmatic, and in-context cues rather than from a hard executable contract or task-specific function signature.

#### Why this belongs in Layer 1B


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

#### Soft contracts


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

#### NLP-specific framing


This feature can be understood as replacing explicit task-specific NLP pipelines with conditional task induction.

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

#### What it explains downstream


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

#### Important boundary


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

### B2. In-Context Learning

#### Core feature


The model can adapt its runtime behavior based on information provided inside the current context, without updating its parameters.

In-context learning is the learned behavioral ability to use prompt-local instructions, examples, demonstrations, labels, formats, schemas, corrections, or patterns to infer how the current task should be performed.

A simple few-shot prompt can demonstrate a mapping:

```text
Input A → Output A
Input B → Output B
Input C → ?
```


The model conditions on the demonstrated pattern and generates a continuation that follows it. No training step occurs during this process. The model's weights (\theta) remain fixed during inference; the context changes the model's activations and token probabilities, not its learned parameters.

In-context learning can therefore make the model behave as though it has learned a task locally, but the adaptation is prompt-conditioned and inference-time. It can disappear, weaken, or change when the relevant context is removed, reordered, contradicted, or pushed out of the context window.

#### Canonical statement


> The model can adapt its runtime behavior from prompt-local information such as examples, demonstrations, labels, instructions, schemas, and corrections, without changing its weights.

#### Why this belongs in Layer 1B


In-context learning is not a primitive tensor operation, a training update, or a deterministic program. It is a learned behavioral feature produced by the interaction of model architecture, learned priors, context integration, and task induction.

It emerges from:

```text
A2 Static Parametric Learned Prior
+ A3 Finite Ordered Context Interface
+ A4 Attention/Position-Mediated Context Integration
+ A5 In-Band Control/Data Representation
+ A7 Autoregressive Factorization
+ A8 Distributional Token Scoring
+ B1 Learned Natural-Language Task Induction
→ In-Context Learning
```


It belongs in Layer 1B because it is stable, causal, shaped by learned behavior and prompt conditioning, and not itself a fault. It helps explain how a fixed-parameter model can adapt to a local task pattern at inference time.

It deserves separate treatment from B1 because B1 concerns inferring the requested operation from natural-language and pragmatic cues in general. B2 concerns runtime adaptation from information inside the current context, especially examples, demonstrations, labels, schemas, and prompt-local patterns.

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


The examples define the label space, output format, and classification standard. The model has not been retrained, but its runtime behavior is conditioned by the demonstrated task pattern.

#### Demonstration-conditioned and non-demonstration cases


In-context learning includes, but is not limited to, few-shot demonstration conditioning.

The clearest case is demonstration-conditioned behavior:

```text
Input A → Output A
Input B → Output B
Input C → Output C
Input D → ?
```


Here, examples define the input-output mapping the model should continue.

But in-context learning can also occur without explicit input-output demonstrations. The context may provide:

- a schema;
- a label set;
- a glossary;
- a correction;
- a local definition;
- a temporary convention;
- a formatting contract;
- a domain-specific rubric;
- an instruction hierarchy;
- a conversation-local fact;
- a source document that defines the task standard.

For example:

```text
For this review, treat "P0" as requiring immediate executive escalation.
Classify the following incident using only this rubric.
```


No few-shot examples are given, but the model can still adapt its runtime behavior from the local context. This is why the broader name **In-Context Learning** is appropriate if the section is meant to cover context-driven adaptation beyond demonstrations.

#### Recognition vs. synthesis


In-context learning can operate in at least two ways.

In many cases, context helps the model recognize and activate a familiar latent task pattern:

```text
Review text → sentiment label
Document text → extracted fields
Question → short answer
Input sentence → translated sentence
```


In other cases, context defines a local or unusual mapping that is not captured by a standard task name:

```text
Customer message → internal escalation code
Bug report → custom severity rubric
Clause text → organization-specific risk category
Raw note → product-specific CRM format
```


B2 covers both cases. The key property is not whether the task was already familiar or newly specified. The key property is that information in the current context shapes the effective runtime mapping without changing the model's weights.

This should not be interpreted as a claim that the model has learned a new durable skill. The behavior is conditioned on the current context and can disappear, weaken, or shift when the relevant context is removed, reordered, contradicted, or separated from the generation point.

#### What context can specify


In-context learning can specify or modify:

- label spaces;
- output formats;
- extraction schemas;
- transformation rules;
- edge-case handling;
- tone and style;
- level of detail;
- local definitions;
- temporary terminology;
- domain-specific conventions;
- task-specific rubrics;
- tool-call patterns;
- refusal or escalation patterns;
- source-specific standards;
- what counts as a valid answer.

#### Why this is useful


In-context learning can be more precise than generic instructions when the task is:

- unusual;
- local to a specific product or organization;
- hard to describe declaratively;
- dependent on edge cases;
- sensitive to output format;
- domain-specific;
- defined by examples or rubrics rather than general rules;
- new to the model's ordinary instruction-following distribution.

It allows a fixed-parameter model to behave flexibly across tasks without task-specific retraining. For systems engineering, this is useful but also means the prompt and retrieved context can act as part of the runtime behavioral specification.

#### Sources of in-context sensitivity


Because in-context learning depends on tokens inside the current context, its influence depends on how that context is selected, ordered, separated, and related to the target case.

In-context behavior can depend on:

- example order;
- example diversity;
- example consistency;
- similarity between examples and the new case;
- clarity of the label space;
- whether examples conflict with written instructions;
- whether instructions conflict with source context;
- whether schemas are explicit or implied;
- whether examples are clearly separated from data;
- how much context separates relevant information from the generation point;
- whether local definitions override common meanings;
- whether context is treated as rule, evidence, illustration, or user data.

These sensitivities are not faults by themselves. They become faults when systems depend on narrow, accidental, inconsistent, stale, or untrusted context in ways that produce unacceptable behavior.

#### What it explains downstream


B2 contributes to fault modes involving:

- overfitting to prompt examples;
- copying examples too literally;
- ignoring abstract instructions in favor of examples;
- treating examples as exhaustive rules;
- failing on cases outside the demonstrated pattern;
- label-space drift;
- schema drift;
- inconsistent edge-case handling;
- example-order effects;
- prompt-local definition leakage;
- conflict between retrieved context and written instructions;
- few-shot prompt regressions after small edits;
- treating untrusted prompt content as task specification.

#### Important boundary


B2 is not the same as B1 Learned Natural-Language Task Induction.

```text
B1:
  The model infers what task or operation is being requested from natural-language,
  pragmatic, and contextual cues.

B2:
  The model adapts its runtime behavior from prompt-local information such as
  examples, schemas, labels, rubrics, definitions, corrections, or source context.
```


B2 is also not the same as B3 Natural-Language Interface Sensitivity.

```text
B3:
  The model's behavior can shift when wording, framing, ordering, genre, or
  surface form changes.

B2:
  Information inside the context acts as a local behavioral specification that
  conditions the task mapping, decision rule, format, label space, or standard.
```


Example order can affect both B2 and B3. The distinction is that B2 concerns context-driven adaptation to a local mapping or standard, while B3 concerns broader natural-language and contextual sensitivity.

B2 is not parameter learning.

```text
Parameter learning:
  The model's weights are updated through training or fine-tuning.

B2:
  The model's weights remain fixed. Runtime behavior changes because the current
  context changes the conditioning information available during inference.
```


B2 is not itself behavioral fragility. It is the feature that allows prompt-local information to shape behavior. Fragility occurs when the system depends too heavily on narrow, accidental, inconsistent, stale, or untrusted context.

B2 is also not a replacement for formal specification. If the output must satisfy strict requirements, in-context examples and rubrics should usually be paired with schemas, validators, tests, constrained decoding, or other system-layer controls.

#### Testing implication


Do not test only the exact prompt context used during development.

Useful test slices include:

- reordered examples;
- removed examples;
- contradictory examples;
- narrow vs diverse examples;
- examples with edge cases;
- target cases outside the demonstrated pattern;
- conflicts between written instructions and examples;
- conflicts between retrieved context and prompt instructions;
- local definitions that override common meanings;
- cases where examples imply a label space or schema;
- cases where examples are similar in surface form but require different decisions;
- cases where untrusted content attempts to redefine the task.

The target property is not that context always dominates prior behavior or written instruction. The target property is that in-context information influences behavior in the intended way, under the intended authority rules, and that unacceptable overgeneralization, copying, label drift, schema drift, or instruction/context conflict is detected.

### B3. Natural-Language Interface Sensitivity

#### Core feature


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

#### Canonical statement


> Because natural language is a soft learned interface, small changes in wording, framing, ordering, or examples can shift the model's induced task, output style, evidence use, or decision boundary.

#### Sources of sensitivity


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

#### Examples


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

#### What it explains downstream


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

#### Important boundary


B3 should not be named "prompt fragility" in Layer 1. Fragility is a failure condition.

The neutral Layer 1B feature is:

> The model's control surface is natural language, so behavior is sensitive to linguistic and contextual variation.

#### Testing implication


The main testing trap is evaluating only the exact phrasing used during development.

A system can pass narrow test cases while failing semantically equivalent versions of the same task in production.

Downstream evaluation should distinguish acceptable variation from unacceptable variation. Exact textual equality is rarely the right standard; intended outcome is usually the relevant unit.

## Group II -- Cooperative response formation and output semantics

### B8. Learned Cooperative Completion Prior

#### Core feature


Instruction-tuned and preference-optimized LLMs often learn a cooperative answer-producing prior: when the context resembles a user request, the model tends to continue with a fluent, relevant, helpful-looking response.

This feature is not the same as correctness, truthfulness, or reliable task completion. It is the learned tendency to treat apparent requests as invitations to produce a useful continuation, unless other learned or system-level constraints shift behavior toward clarification, refusal, abstention, tool use, or escalation.

The model may therefore infer not only:

```text
"What task is being requested?"
```


but also:

```text
"What would a helpful assistant normally provide next?"
```


This can be useful. It makes the model responsive, cooperative, conversationally efficient, and capable of handling underspecified natural-language tasks. But it also creates a predictable pressure toward answering, completing, elaborating, or smoothing over gaps.

#### Canonical statement


> The model has a learned cooperative completion prior: when context resembles a request, it tends to generate a fluent, useful-looking answer rather than stop, challenge the premise, ask for missing information, or abstain.

#### Why this belongs in Layer 1B


This is not a primitive tensor operation and not itself a fault. It is a stable learned behavioral feature shaped by pretraining, instruction-rich corpora, supervised instruction tuning, preference optimization, and interaction conventions.

It emerges from:

```text
A2 Static Parametric Learned Prior
+ A7 Autoregressive Factorization
+ A8 Distributional Token Scoring
+ B1 Learned Natural-Language Task Induction
+ B5 Learned Interaction-Style and Persona Priors
+ T5 Instruction-rich corpora
+ P1 Supervised instruction following
+ P2 Preference optimization / helpfulness
→ Learned Cooperative Completion Prior
```


T5 is relevant because instruction-rich corpora improve emergent instruction-following and structured response tendencies, but can also amplify "helpfulness over correctness" when data rewards confident completion. P2 is relevant because preference optimization encourages friendlier, more cooperative responses, while creating side effects such as helpfulness inflation, over-verbosity, polite certainty, and answering when clarification would be better.

Layer 1B is the right home because the existing methodology defines this layer as stable learned behavior that is causal but not itself a downstream fault.

#### What the prior favors


The cooperative completion prior can favor:

- answering over abstaining;
- inferring missing intent over asking;
- accepting the user's framing over challenging it;
- producing a complete-looking response under uncertainty;
- supplying rationale or explanation even when evidence is thin;
- smoothing contradictions rather than surfacing them;
- continuing the conversational flow rather than interrupting it;
- elaborating because detail often appears helpful;
- presenting a usable next step rather than a narrow literal response.

These tendencies are not always wrong. Many user interactions depend on reasonable inference, pragmatic completion, and cooperative repair. The feature becomes risky when the system requires strict evidence, explicit parameters, calibrated uncertainty, or refusal to proceed without missing information.

#### What it explains downstream


B8 contributes to fault modes involving:

- answering when the correct behavior is to ask a clarifying question;
- accepting false premises;
- sycophantic agreement;
- helpfulness inflation;
- over-compliance with underspecified requests;
- unsupported but plausible answers;
- overconfident completion under uncertainty;
- hallucinated rationales or steps;
- excessive verbosity;
- increased error surface from unnecessary elaboration;
- failure to surface missing evidence or missing parameters;
- weak distinction between "can answer" and "should answer."

#### Important boundary


B8 is not the same as B1 Learned Natural-Language Task Induction.

```text
B1:
  The model infers what task or operation is being requested.

B8:
  After a task-like request is inferred, the model tends to satisfy it with a cooperative,
  useful-looking completion unless another constraint shifts behavior.
```


B8 is also not the same as B5 Learned Interaction-Style and Persona Priors.

```text
B5:
  The model learns assistant-like style, tone, hedging, refusal style, and conversational posture.

B8:
  The model learns a stronger answer-producing tendency: continue, complete, help, infer,
  and provide a usable response.
```


B8 is not hallucination, sycophancy, over-compliance, or over-verbosity. Those are downstream fault modes. B8 is the neutral causal feature that makes those failures more likely under underspecification, weak evidence controls, or preference objectives that over-reward direct helpfulness.

#### Interaction with clarification and abstention


The cooperative completion prior competes with clarification and abstention behavior.

In many prompts, the model must implicitly choose among:

```text
answer directly
ask a clarifying question
state assumptions and answer conditionally
abstain
refuse
use a tool
escalate
```


B8 shifts this decision toward direct completion. Post-training can reduce or amplify this pressure depending on whether clarification, abstention, and evidence-seeking are rewarded as helpful behaviors.

This is why "ask vs answer" should be evaluated directly in underspecified settings. The T/P stack already identifies this as an evaluation requirement: under-specification suites should measure clarification rate versus wrong-answer rate, and P2 evaluation should treat correctly asking clarifying questions as a positive outcome.

#### Testing implication


Do not evaluate only whether the model can answer. Evaluate whether it chooses the correct response posture.

Useful test slices include:

- underspecified requests;
- false-premise prompts;
- missing-parameter tasks;
- evidence-required factual questions;
- ambiguous user intent;
- high-stakes domains where unsupported completion is unacceptable;
- prompts where the best answer is clarification, abstention, or tool use;
- prompts where direct completion is acceptable and clarification would be unnecessary.

The key property is not "always ask" or "always answer." The desired behavior is conditional:

```text
Answer when the request is sufficiently specified and evidence requirements are met.
Ask when required parameters are missing.
Abstain or ground when truth depends on unavailable evidence.
Challenge or correct when the prompt contains a material false premise.
Refuse or redirect when the request crosses a policy boundary.
```

#### Recommended concise formulation


> **B8 covers the learned answer-producing pressure of instruction-tuned and preference-optimized LLMs: when a prompt resembles a request, the model tends to produce a cooperative, useful-looking completion rather than interrupting the flow to clarify, abstain, challenge, or ground the answer.**

### B4. Plural Valid-Output Space

#### Core feature


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

#### Canonical statement


> Many LLM tasks have a space of acceptable outputs rather than one exact target string; correctness is often behavioral, semantic, and task-specific rather than exact-match.

#### Why this belongs in Layer 1B


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

#### Correctness as an equivalence class


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

#### Task-specific quality criteria


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

#### What it explains downstream


B4 contributes to fault modes involving:

- brittle exact-match evaluation;
- false positives in testing due to harmless paraphrase;
- false negatives in testing due to superficial similarity;
- inconsistent human review standards;
- unclear acceptance criteria;
- evaluation disagreement;
- product confusion about what counts as correct;
- failure to detect materially different decisions hidden behind similar wording.

#### Important boundary


B4 is not the same as non-determinism.

```text
Non-determinism:
  The system may produce different outputs across runs.

Plural valid-output space:
  More than one output may be acceptable for the task.
```


A deterministic system can still have a plural valid-output space. A non-deterministic system can still produce unacceptable outputs.

### B6. Generated Self-Assessment and Confidence Language

#### Core feature


When the model expresses confidence, uncertainty, justification, or self-evaluation, it is generating language about its own answer through the same token-generation process used for any other text.

A phrase such as:

```text
"I am certain..."
"This is likely..."
"I may be wrong, but..."
"The evidence shows..."
```


is not a native calibrated confidence variable. It is a generated continuation shaped by context, learned discourse patterns, system instructions, and token likelihood.

#### Canonical statement


> The model's confidence language is generated text, not a native calibrated measure of correctness, evidence support, or epistemic certainty.

#### Why this belongs in Layer 1B


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

#### What it explains downstream


B6 contributes to fault modes involving:

- weak confidence calibration;
- high-confidence wrong answers;
- fluent unsupported justifications;
- non-privileged self-evaluation;
- apologetic but still incorrect answers;
- uncertainty language that does not track actual error probability;
- user over-trust in confident language;
- user under-trust when correct answers are over-hedged.

#### Important boundary


B6 is not the same as A8.

```text
A8:
  The model scores next-token continuations rather than truth values.

B6:
  The model can generate language that appears to report confidence, uncertainty,
  evidence, or self-evaluation, even though that language is not natively calibrated.
```


B6 also does not imply that all confidence language is useless. Confidence expressions can correlate with correctness in some settings, especially when systems are calibrated externally, but native generated confidence should not be treated as proof.

## Group III -- Post-training interaction and policy priors

### B5. Learned Interaction-Style and Persona Priors

#### Core feature


Instruction-tuned and chat-tuned LLMs learn interaction patterns: helpfulness, politeness, refusal style, clarification behavior, conversational pacing, explanation style, confidence tone, and role-appropriate response conventions.

These behaviors are not usually specified by the user's task alone. They are shaped by pretraining, supervised fine-tuning, preference training, safety training, system prompts, product policies, and conversational context.

#### Canonical statement


> The model's response is shaped not only by task content, but also by learned interaction-style priors about how an assistant should sound, when it should ask questions, when it should refuse, and how it should present uncertainty.

#### Why this belongs in Layer 1B


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

#### What it shapes


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

#### What it explains downstream


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

#### Important boundary


B5 is not the same as policy compliance. Policy compliance is usually a product, safety, or system-layer objective.

B5 is the learned behavioral prior that makes the model likely to express itself in certain assistant-like ways. Whether those ways are correct for a given product requires additional policy, prompt, evaluation, and system controls.

B5 is also not the same as B8 Learned Cooperative Completion Prior.

```text
B5:
  The model learns assistant-like tone, persona, conversational posture,
  hedging, politeness, and response style.

B8:
  The model learns an answer-producing pressure: continue, complete, infer,
  and provide a useful-looking response when context resembles a request.
```


B5 is also not the same as B9 Learned Policy-Boundary Generalization.

```text
B5:
  The model learns how refusals, hedges, and clarifications may be expressed.

B9:
  The model learns generalized boundary behavior that affects whether it complies,
  refuses, redirects, narrows scope, or offers a safe alternative.
```

### B9. Learned Policy-Boundary Generalization

#### Core feature


Instruction-tuned, safety-tuned, and policy-conditioned LLMs learn behavioral boundaries around classes of requests. These boundaries shape whether the model proceeds, refuses, redirects, hedges, asks for clarification, provides a safer alternative, or narrows the scope of its answer.

This feature is not a deterministic access-control system. The model does not usually evaluate a request against a complete executable rule table. Instead, it generalizes from policy examples, safety training, data filtering, refusal demonstrations, and interaction conventions.

As a result, the model may treat semantically related prompts as belonging to a learned policy region even when the exact request was not present in training.

The model may implicitly infer:

```text
Is this request answerable?
Is this request disallowed?
Is this request adjacent to a disallowed class?
Should I comply, refuse, redirect, hedge, or offer a safer alternative?
```


This feature is useful because it allows broad policy behavior to generalize beyond memorized examples. It becomes risky when the learned boundary is too broad, too narrow, inconsistent across paraphrases, or misaligned with the product's actual policy.

#### Canonical statement


> The model learns generalized policy-boundary behavior: it maps natural-language requests into comply, refuse, redirect, hedge, or constrained-completion regions through learned semantic generalization rather than deterministic rule enforcement.

#### Why this belongs in Layer 1B


This is not a primitive model mechanism, product policy, moderation system, or system-layer guardrail. It is a learned behavioral feature shaped by post-training and policy conditioning.

It emerges from:

```text
A2 Static Parametric Learned Prior
+ A5 In-Band Control/Data Representation
+ A8 Distributional Token Scoring
+ B1 Learned Natural-Language Task Induction
+ B3 Natural-Language Interface Sensitivity
+ B5 Learned Interaction-Style and Persona Priors
+ T4 Data hygiene objectives
+ P3 Safety policy / refusal posture
+ P4 Style and brand behavior
→ Learned Policy-Boundary Generalization
```


T4 matters because data hygiene can reduce harmful content propagation and memorization, but can also produce adjacent gaps or increased refusal in borderline safe contexts. P3 matters because safety policy tuning explicitly teaches refusal patterns and harm-avoidance behavior, while creating predictable side effects such as over-refusal, refusal inconsistency under paraphrase, and vague refusals without useful safe alternatives.

Layer 1B is the right home because the methodology defines this layer as stable learned behavior that is causal but not itself a downstream failure.

#### What the boundary can encode


Learned policy-boundary generalization can encode patterns involving:

- safety refusals;
- privacy and PII handling;
- regulated-domain caution;
- self-harm or violence boundaries;
- cybersecurity dual-use boundaries;
- medical, legal, or financial caution;
- age-sensitive or sexual-content boundaries;
- protected-class and bias-sensitive handling;
- brand or product-specific refusal posture;
- tool-action boundaries;
- escalation or human-handoff triggers;
- allowed safe alternatives;
- professional-context exceptions;
- educational or analytical carve-outs.

These are learned behavioral regions, not guaranteed policy decisions. Whether the model's behavior matches the intended product policy depends on prompts, system controls, evaluation coverage, and enforcement outside the model.

#### What it explains downstream


B9 contributes to fault modes involving:

- over-refusal in benign adjacent cases;
- under-refusal for harmful or disallowed requests;
- refusal inconsistency under paraphrase;
- refusal inconsistency across languages;
- policy behavior changing with framing, role, or genre;
- vague refusals that do not provide a useful safe alternative;
- compliance under obfuscated or indirect phrasing;
- inconsistent treatment of professional, educational, or research contexts;
- failure to distinguish allowed analysis from disallowed operational help;
- excessive hedging in safe contexts;
- refusal style varying more than the policy requires;
- product-policy mismatch when learned boundaries differ from deployed rules.

#### Important boundary


B9 is not the same as B5 Learned Interaction-Style and Persona Priors.

```text
B5:
  The model learns assistant-like tone, refusal style, hedging, politeness,
  clarification behavior, and conversational posture.

B9:
  The model learns generalized policy-boundary behavior that affects whether it
  complies, refuses, redirects, hedges, narrows scope, or offers a safe alternative.
```


B9 is also not policy compliance.

```text
Policy compliance:
  The product satisfies a defined safety, legal, brand, or operational policy.

B9:
  The model exhibits learned behavior that approximates policy boundaries through
  semantic and contextual generalization.
```


B9 is not a system-layer guardrail.

```text
System-layer guardrail:
  A validator, classifier, permission check, allowlist, denylist, policy engine,
  tool gate, or human approval workflow.

B9:
  A learned model-side tendency to map requests into policy-like behavioral regions.
```

#### Relationship to natural-language sensitivity


B9 interacts strongly with B3 Natural-Language Interface Sensitivity.

Because the boundary is learned through natural language, behavior can shift when the same request is reframed:

```text
"Help me analyze this malware sample."
"Teach me how to write malware."
"Explain what this suspicious binary does."
"Generate code that evades antivirus."
```


A robust product policy may treat these cases differently. A learned boundary may partially track the distinction, overgeneralize across them, or miss the operational difference.

This is why B9 should not be treated as a complete policy mechanism. It is a model-side behavioral prior that requires evaluation and, in high-stakes cases, system-layer enforcement.

#### Relationship to data hygiene


B9 also interacts with T4 data hygiene.

Filtering toxic, private, illegal, or otherwise harmful data can reduce harmful reproduction. But it may also create sparse or distorted coverage around adjacent legitimate topics. This can produce learned avoidance, evasive behavior, or knowledge gaps around safe professional requests that resemble filtered material.

For example:

```text
Legitimate security analysis
  may sit near disallowed cyber-abuse examples.

Medical education
  may sit near unsafe diagnosis or treatment advice.

Historical analysis of extremist content
  may sit near prohibited praise, recruitment, or propaganda.

Privacy-preserving data handling
  may sit near requests to expose personal information.
```


The neutral Layer 1B feature is not the failure. The feature is that the model generalizes from filtered data and policy examples into broader behavioral regions.

#### Examples


A model may refuse or narrow scope when a request resembles a prohibited class:

```text
"Give me working exploit code for this target."
```


It may provide a safe alternative when the request is adjacent but legitimate:

```text
"I can explain the vulnerability class and defensive mitigations, but I cannot help exploit a live target."
```


It may overgeneralize and refuse safe professional work:

```text
"Review this internal security report and identify remediation priorities."
```


It may undergeneralize when the prompt is obfuscated:

```text
"Write a script for stress-testing someone else's login page until it stops responding."
```


These are not separate Layer 1B features. They are different downstream manifestations of the same learned policy-boundary behavior.

#### What it does not solve


B9 does not guarantee:

- correct policy interpretation;
- stable refusal across paraphrases;
- multilingual policy invariance;
- correct treatment of dual-use contexts;
- accurate distinction between safe and unsafe intent;
- correct tool permissioning;
- legally sufficient compliance;
- complete prevention of harmful actions.

Those require product policy, system controls, evaluation, monitoring, and clear operating envelopes.

#### Testing implication


Do not test only obvious prohibited prompts. Test the learned boundary as a behavioral surface.

Useful test slices include:

- clearly allowed requests;
- clearly disallowed requests;
- benign adjacent cases;
- dual-use professional contexts;
- educational or analytical contexts;
- obfuscated disallowed requests;
- multilingual variants;
- paraphrases with equivalent intent;
- role-framed prompts;
- emotionally framed prompts;
- requests with safe alternatives available;
- requests requiring refusal plus a constrained safe completion;
- tool-action prompts where natural-language refusal is insufficient.

The target property is not "refuse more" or "comply more." The target property is boundary accuracy:

```text
Comply when the request is allowed.
Refuse when the request is disallowed.
Redirect when a safe alternative is appropriate.
Ask for clarification when intent or authorization is ambiguous.
Escalate or require approval when policy depends on external authorization.
Avoid using style or hedging as a substitute for policy enforcement.
```

## Group IV -- Knowledge, competence, and distributional conflict

### B7. Distribution-Conditional Competence

#### Core feature


The model's competence is uneven across tasks, domains, languages, formats, and interaction patterns. Performance depends on how well the current request matches learned distributions, post-training behavior, available context, and induced task structure.

The model may perform strongly on a task that resembles common training or instruction-tuning patterns and weakly on a superficially similar task that requires rare knowledge, unusual formatting, exact symbolic manipulation, unfamiliar domain conventions, or strict operational constraints.

#### Canonical statement


> LLM capability is distribution-conditioned: performance varies with domain, format, language, task framing, evidence availability, and similarity to learned patterns.

#### Why this belongs in Layer 1B


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

#### What affects competence


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

#### What it explains downstream


B7 contributes to fault modes involving:

- uneven domain performance;
- brittle behavior on rare formats;
- weak multilingual performance in some languages or scripts;
- failures on exact symbolic tasks;
- overgeneralization from familiar patterns;
- confident answers outside the model's competence region;
- benchmark/product mismatch;
- regression when changing model, prompt, or data distribution.

#### Important boundary


B7 is not the same as a training-data defect.

```text
Training-layer issue:
  The data was stale, biased, incomplete, duplicated, poisoned, or domain-poor.

B7 feature:
  The model's behavior varies according to how the runtime task aligns with the learned distribution.
```


B7 is also not itself a failure. Uneven competence becomes a failure when the system does not detect, bound, evaluate, or compensate for it.

### B10. Parametric Prior Persistence and Temporal Blending

#### Core feature


LLMs encode much of their learned knowledge in a parametric prior rather than in explicit, addressable records. During generation, this prior can continue to influence outputs even when newer, conflicting, or context-provided information is present.

This feature is especially visible for temporally layered facts: policies, product names, public roles, APIs, laws, prices, schedules, standards, organizational facts, or other information that changes over time.

The model may have seen multiple versions of a fact across pretraining, fine-tuning, refresh data, instruction data, retrieved context, and conversation history. At inference time, it does not perform a guaranteed database-style replacement such as:

```text
old_fact.version = deprecated
new_fact.version = authoritative
```


Instead, generation is shaped by competing signals:

```text
older parametric associations
newer parametric associations
prompt-local context
retrieved evidence
conversation history
task framing
source salience
instruction hierarchy
decoding path
```


The result is a learned behavioral tendency for old, new, retrieved, and context-local information to interact during generation.

#### Canonical statement


> The model's parametric prior can persist alongside newer, conflicting, retrieved, or context-provided information, causing generation to blend or privilege competing knowledge signals unless grounding and temporal authority are made explicit.

#### Why this belongs in Layer 1B


This is not a primitive mechanism and not itself a failure. It is a stable learned behavioral feature produced by the interaction of parametric learning, freshness objectives, context conditioning, and autoregressive generation.

It emerges from:

```text
A2 Static Parametric Learned Prior
+ A3 Finite Ordered Context Interface
+ A4 Attention/Position-Mediated Context Integration
+ A5 In-Band Control/Data Representation
+ A7 Autoregressive Factorization
+ A8 Distributional Token Scoring
+ B1 Learned Natural-Language Task Induction
+ B3 Natural-Language Interface Sensitivity
+ B7 Distribution-Conditional Competence
+ T1 Broad pretraining
+ T2 Domain mixture / coverage objectives
+ T3 Knowledge freshness objectives
→ Parametric Prior Persistence and Temporal Blending
```


T1 matters because pretraining gives the model broad linguistic and world knowledge, but that knowledge is distributional rather than guaranteed true. T3 matters because recency improvements do not remove all staleness; old and new facts can mix, and retrieved sources can conflict with internal priors.

Layer 1B is the right home because the existing methodology defines Layer 1B as stable learned behavior that is causal, not itself a downstream fault, and not reducible to a single low-level architectural operation.

#### What can be blended or interfered with


Parametric prior persistence and temporal blending can affect:

- old and new policy versions;
- renamed products, APIs, models, companies, or teams;
- current office holders or organizational roles;
- stale legal, medical, financial, or regulatory information;
- deprecated software methods or package APIs;
- old pricing, plan limits, or product capabilities;
- outdated schedules, event dates, or availability;
- changed security guidance;
- outdated scientific consensus;
- retrieved evidence that conflicts with the model's prior;
- conversation-local facts that conflict with common learned patterns.

This is not limited to chronological facts. Temporal blending is the clearest case, but the broader feature is **conflict among knowledge signals**.

#### What it explains downstream


B10 contributes to fault modes involving:

- stale factual answers;
- old/new policy blending;
- temporal hallucinations;
- invented recent updates;
- deprecated API usage;
- current-role mistakes;
- mixing a new product name with old product behavior;
- citing current-sounding but unsupported facts;
- privileging parametric memory over retrieved evidence;
- over-trusting stale conversation context;
- inconsistent answers when retrieved context conflicts with prior knowledge;
- false precision in freshness-sensitive domains;
- difficulty honoring "use only this source" when the source conflicts with learned prior.

#### Important boundary


B10 is not the same as A2 Static Parametric Learned Prior.

```text
A2:
  The model has learned parameters that encode statistical associations from training.

B10:
  Those learned associations can persist and interact with newer, conflicting,
  retrieved, or context-local information during generation.
```


B10 is also not the same as B7 Distribution-Conditional Competence.

```text
B7:
  Capability varies across domains, languages, formats, task framings, and
  distributional familiarity.

B10:
  Competing knowledge signals can interfere, especially when facts are stale,
  updated, contradicted, or temporally layered.
```


B10 is not the same as hallucination.

```text
Hallucination:
  A downstream fault mode where the model produces unsupported or false content.

B10:
  A neutral behavioral feature that helps explain why stale, blended, or
  conflict-contaminated factual outputs can occur.
```


B10 is not the same as a RAG or retrieval failure.

```text
RAG / retrieval failure:
  The system retrieves the wrong source, fails to retrieve, ranks evidence poorly,
  or does not enforce source use.

B10:
  The model-side prior may still influence generation even when relevant evidence
  is present in context.
```

#### Relationship to retrieval and grounding


B10 is one reason freshness-dependent systems should not rely on parametric knowledge alone.

When the task depends on current or source-specific facts, the system usually needs explicit authority rules such as:

```text
Use retrieved source X as authoritative.
Prefer source dates after YYYY-MM-DD.
If retrieved evidence conflicts with parametric memory, follow retrieved evidence.
If no current evidence is available, abstain or ask for confirmation.
Cite the evidence used.
Do not infer updates from prior patterns.
```


Without such rules, the model may produce a fluent compromise between its prior and the provided evidence. The T/P stack makes the same remediation point: for freshness-dependent domains, retrieval/tools should be preferred as the truth mechanism, and systems should monitor disagreements between tool truth and generated claims.

#### Examples


A model may blend old and new product information:

```text
The user asks about the current API.
The context contains the new endpoint.
The model answers using the new endpoint name but old parameter names.
```


A model may preserve an outdated role association:

```text
The user asks who currently holds a position.
The model generates the historically common office holder rather than checking
current evidence.
```


A model may mix retrieved evidence with prior assumptions:

```text
Retrieved context says a policy changed in 2026.
The model summarizes the change but includes an exception from the older policy.
```


A model may invent a plausible recent update:

```text
The model knows that a product changes frequently.
It generates a current-sounding plan limit or release note that is not supported
by retrieved evidence.
```


These are downstream manifestations. The Layer 1B feature is the persistence and interaction of competing knowledge signals.

#### What it does not solve


B10 does not guarantee:

- factual freshness;
- correct source selection;
- correct temporal reasoning;
- successful conflict resolution;
- reliable source-grounded answers;
- proper citation behavior;
- automatic deference to retrieved evidence;
- correct abstention when evidence is stale or missing.

Those require system-layer controls: retrieval, source ranking, citation enforcement, validators, freshness policies, abstention rules, monitoring, and operating-envelope constraints.

#### Testing implication


Do not test factuality only on static knowledge. Test conflict and freshness behavior directly.

Useful test slices include:

- old vs new policy versions;
- deprecated vs current APIs;
- renamed products or organizations;
- current office holders or roles;
- source-grounded answers where retrieved context contradicts common prior knowledge;
- stale cached context;
- time-sensitive legal, medical, financial, or regulatory claims;
- prompts that ask for "latest," "current," "today," or "as of now";
- prompts where the correct behavior is to abstain without current evidence;
- prompts where the model must cite or use only a provided source;
- prompts where conversation history contains a stale assumption later corrected.

The target property is not "always trust retrieval" in the abstract. The desired behavior is authority-aware:

```text
Use parametric knowledge for stable, low-risk background facts.
Use authoritative retrieval for freshness-sensitive or source-specific claims.
Prefer newer authoritative evidence when sources conflict.
Surface conflicts rather than silently blend them.
Abstain or ask when recency is required but evidence is unavailable.
Do not invent recent changes from pattern familiarity.
```

#### Recommended concise formulation


> **B10 covers the persistence and interaction of the model's parametric prior with newer, conflicting, retrieved, or context-local information. It explains why generation can blend old and new facts, privilege stale associations, or produce temporally confused answers unless source authority and freshness requirements are made explicit.**
