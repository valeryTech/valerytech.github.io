---
draft: false
toc: true
title: "Stack 1a Base Mechanisms"
linkTitle: "Stack 1a Base Mechanisms"
---
# Layer 1A - Base LLM Architectural / Inference Mechanisms


This document moves the **base mechanisms** out of stack-10-casual-features.md into a dedicated Layer 1A file.

It keeps the original mechanism text as closely as possible, but renames the surviving mechanism set from:

```text
M1-M11
```


to:

```text
A1-A10
```


The omitted former **M10 Learned Natural-Language Task Induction** now belongs in Layer 1B rather than Layer 1A.

## Definition


An **LLM mechanism** is a stable causal feature of the model/inference process that shapes behavior across domains and prompts.

A mechanism should answer:

> What about the model or inference process makes this class of behavior possible or likely?

It should not be an observed fault, a product failure, or a missing control.

So:

- **Mechanism:** autoregressive factorization
- **Derived fault mode:** long-horizon drift
- **System fault:** no step-level verifier or state checkpoint

A useful abstraction for a decoder-only LLM inference pipeline is:

\[s_{in} \xrightarrow{\tau} x \xrightarrow{\theta} y \xrightarrow{\tau^{-1}} s_{out}\]

Raw input text or serialized input (\(s_{in}\)) is mapped by the tokenizer (\(\tau\)) into a finite ordered sequence of discrete token IDs:

\[x = \tau(s_{in})\]

The model does not operate directly on raw text. Token IDs are first mapped into continuous vector representations through token embeddings and positional information. A decoder-only transformer with parameters (\(\theta\)) then computes hidden states under a causal attention mask.

At each generation step, the model produces a hidden state for the current position. That hidden state is projected through the language-modeling head into vocabulary-sized logits, which are normalized into a probability distribution over possible next tokens:

\[P_{\theta}(y_i \mid x, y_{<i})\]

A decoding procedure then selects or samples the next token:

\[y_i \sim P_{\theta}(y_i \mid x, y_{<i})\]

Generation repeats autoregressively until a stopping condition is reached, yielding a discrete output token sequence:

\[y = (y_1, y_2, \ldots, y_n)\]

Finally, the generated token sequence is mapped back into text by the detokenizer:

\[s_{out} = \tau^{-1}(y)\]

So a single LLM response involves two computationally distinct phases.

## Phase 1: Prefill -- parallel context processing


During prefill, the system processes the full input sequence (\(x\)) in parallel.

```text
raw input
  -> tokenization
  -> discrete token IDs
  -> token embedding + positional encoding
  -> causal transformer forward pass over the full prompt
  -> KV-cache initialization
  -> hidden state for final prompt position
  -> logit projection / language-modeling head
  -> softmax over vocabulary
  -> first next-token distribution
```


This phase establishes the runtime context representation used for generation. It is strongly affected by sequence length and transformer compute cost, which makes it directly relevant to **A10 Transformer Compute Scaling**.

## Phase 2: Decode -- autoregressive generation


During decode, the system generates one token at a time. Each new token is embedded, processed against the accumulated KV cache, projected into logits, normalized into a next-token distribution, and passed to the decoder.

```text
previous token / partial output
  -> embedding + positional information
  -> transformer step using KV cache
  -> KV-cache append
  -> hidden state
  -> logit projection / language-modeling head
  -> softmax over vocabulary
  -> next-token distribution
  -> decoding path selection
  -> append selected token
  -> stopping check
  -> detokenization
  -> output text
```


This phase is the operational site of autoregressive factorization: each generated token changes the conditioning prefix for later tokens.

The mechanisms below correspond to distinct parts of this pipeline:

| Pipeline component | Mechanism grounded |
| --- | --- |
| Tokenization and detokenization | **A1 Tokenized Representation** |
| Learned transformer parameters | **A2 Static Parametric Learned Prior** |
| Finite input sequence | **A3 Finite Ordered Context Interface** |
| Attention, position, salience, and formatting effects | **A4 Attention/Position-Mediated Context Integration** |
| Serialized instructions, examples, evidence, and data in one token channel | **A5 In-Band Control/Data Representation** |
| No durable internal state across independent invocations | **A6 Stateless Invocation** |
| Sequential token-by-token generation | **A7 Autoregressive Factorization** |
| Logit projection and softmax over the vocabulary | **A8 Distributional Token Scoring** |
| Sampling, argmax, top-p, beam-like, constrained, or schema-guided selection | **A9 Decoding Path Selection** |
| Prefill/decode cost, KV-cache memory, latency, and token budgets | **A10 Transformer Compute Scaling** |

This base event is not itself a fault mode. It is the minimal architectural substrate from which the downstream mechanism-derived failure modes arise.

# A1. Tokenized Representation

## Core mechanism


The model consumes and emits finite sequences of discrete token IDs, not raw characters, concepts, propositions, database records, or facts.

Formally, raw input text or serialized input (\(s\)) is mapped by a tokenizer (\(\tau\)) into an ordered sequence of token IDs:

\[x = \tau(s), \quad x_i \in V\]

where \(V\) is a fixed tokenizer vocabulary.

Tokenization is a statistical discretization step. In common BPE, WordPiece, or SentencePiece-style systems, strings are segmented according to vocabulary construction and corpus-derived regularities, not according to semantic, morphological, logical, arithmetic, or character-level boundaries.

The resulting token sequence is the representation boundary passed downstream into embedding and transformer computation.

## Canonical statement


> The model operates over discrete token IDs produced by a fixed tokenizer; all text, numbers, formatting, identifiers, and instructions are mediated by a segmentation scheme whose boundaries may not align with human-relevant symbolic or semantic units.

## Why this is a primitive mechanism


This is the input/output bottleneck of the model. Before embeddings, attention, reasoning, decoding, or detokenization, raw text must be partitioned into token IDs.

Tokenization determines:

- which strings correspond to single tokens versus multi-token sequences,
- how rare names, numbers, whitespace, punctuation, code, tables, JSON, IDs, and multilingual text enter the model,
- how many context positions an input consumes,
- which vocabulary items the model can directly score during generation,
- how output token IDs are later mapped back into text.

Although tokenization is often reversible at the text level, it is computationally consequential: the model conditions on the token partition, not on an independent raw-character representation.

## What it explains downstream


A1 is the root mechanism behind faults involving:

- exact-string brittleness,
- corrupted IDs,
- weak character-level counting or manipulation,
- digit and number-format fragility,
- fragile whitespace, punctuation, and formatting behavior,
- unexpected behavior on rare names, unusual symbols, code, or non-Latin scripts,
- different behavior across languages depending on tokenization density,
- context-budget pressure caused by inefficient tokenization.

It also contributes to rare-token and byte-fallback pathologies, though those should be treated as interactions between tokenization, tokenizer vocabulary construction, training exposure, and learned embeddings rather than as pure A1 alone.

## What it is not


A1 is not the semantic representation of text. Semantic representation begins downstream, when token IDs are mapped into embeddings and processed by the transformer.

A1 is also not itself a fault. The fault is not:

> The model uses tokens.

The fault is:

> The system required exact symbolic, character-level, or format-preserving behavior from a token-mediated generative model without deterministic validation or symbolic tooling.

# A2. Static Parametric Learned Prior

## Core mechanism


The model's general knowledge, linguistic competence, style, associations, and behavioral tendencies are encoded in learned parameters (\(\theta\)).

These parameters define a compressed, distributed representation learned during training. They are not an explicit database of facts, records, sources, timestamps, or verified propositions. During ordinary inference, \(\theta\) is fixed: the model can condition on new runtime context, but its learned weights are not updated by the generation event itself.

At generation time, the model computes token distributions using both the runtime context and the learned parametric prior:

\[P_{\theta}(y_i \mid x, y_{<i})\]

The runtime context supplies immediate conditioning information. The parameters determine how that information is interpreted, generalized, weighted, and converted into likely continuations.

## Canonical statement


> The model relies on a fixed, compressed, distributed prior encoded in learned parameters, not on direct lookup from an authoritative or dynamically updated knowledge store.

## Why this is a primitive mechanism


This is the model's baseline source of learned knowledge and behavior.

It determines:

- which facts, associations, styles, and patterns are likely in the absence of strong context,
- how ambiguous or incomplete prompts are filled in,
- how runtime evidence is interpreted through learned associations,
- why familiar continuations can dominate when context is weak, conflicting, or poorly integrated,
- why new information must be supplied through context, retrieval, tools, memory systems, or parameter updates rather than learned automatically during inference.

This mechanism is distinct from context. Context is the runtime input. The parametric prior is the model's learned background distribution.

## What it explains downstream


A2 contributes to faults involving:

- plausible but unsupported background assumptions,
- common misconception reproduction,
- approximate or stale latent knowledge,
- memorized fragments,
- overgeneralization from familiar patterns,
- concept blending between similar entities,
- defaulting to generic answers when evidence is absent or weak,
- resistance to retrieved evidence when learned associations strongly favor another continuation.

## Important boundary


A2 is not the same as training-data quality.

Training-data coverage, bias, freshness, poisoning, duplication, and domain imbalance are **T-layer issues**.

A2 is the architectural mechanism that makes training data become a compressed learned prior in the first place.

So:

```text
A2 mechanism:
  Knowledge and behavior are encoded in fixed learned parameters.

T-layer issue:
  The data used to produce those parameters was stale, biased, incomplete, poisoned, duplicated, or domain-poor.
```


A2 is also distinct from **A8 Distributional Token Scoring**. A2 concerns where learned background tendencies come from. A8 concerns the fact that, at each generation step, the model outputs a distribution over next tokens rather than truth values, calibrated beliefs, or verified claims.

# A3. Finite Ordered Context Interface

## Core mechanism


The model conditions directly only on the finite token sequence supplied in the current context:

\[P_{\theta}(t_{\text{next}} \mid C)\]

where \(C\) is the runtime context.

The context is finite and ordered. Information outside \(C\) is unavailable unless the system reintroduces it.

## Canonical statement


> The model's direct input is a bounded, ordered context sequence; it cannot directly condition on information that is absent from that sequence.

## Why this is a primitive mechanism


This is the input boundary of the model.

It determines what the model can directly use during a given invocation.

The model does not directly access:

- the full conversation history,
- all user documents,
- external databases,
- previous sessions,
- hidden application state,
- prior tool outputs,

unless those are inserted into the current context.

## What it explains downstream


A3 is the root mechanism behind faults involving:

- missing context,
- forgotten earlier requirements,
- failure to use evidence that was not included,
- long-conversation drift,
- incomplete document QA,
- false assumptions when needed facts are absent,
- overreliance on generic prior knowledge.

## What it is not


A3 is not the same as weak attention or lost-in-the-middle behavior.

Those require a separate mechanism: information may be present in context but still underused. That is A4.

A3 answers:

> Is the information available at all?

A4 answers:

> If available, is it effectively used?

# A4. Attention/Position-Mediated Context Integration

## Core mechanism


Inside the context window, the model does not use all available tokens uniformly. Context utilization is mediated by transformer computation: causal self-attention, positional information, learned token representations, residual-stream integration, and feed-forward transformations.

At each layer, attention heads compute query-key compatibility between a token position and prior positions available under the causal mask. These scores are normalized into attention weights and used to combine value vectors. Positional encodings or position-dependent attention schemes make this computation sensitive to token order and distance.

The result is that information may be present in the context but still have unequal influence on the model's next-token distribution.

## Canonical statement


> Context is not accessed like a database; information inside the context has unequal influence because transformer computation integrates tokens through position-sensitive, learned attention and downstream transformations.

## Why this is a primitive mechanism


A finite context window is only the container. A4 describes how the model computationally integrates information within that container.

Two prompts may contain the same facts but yield different behavior if the facts are:

- ordered differently,
- placed near or far from the generation point,
- embedded in dense prose rather than clear structure,
- surrounded by semantically similar distractors,
- separated from the task by long intervening context,
- framed as evidence, examples, instructions, or quoted text,
- weakly connected to the current query through learned attention patterns.

Attention creates local competition among available token positions, but final utilization is not determined by a single attention score. It emerges across heads, layers, residual connections, and feed-forward transformations.

## What it explains downstream


A4 contributes to faults involving:

- lost-in-the-middle behavior,
- recency or primacy bias,
- underuse of buried constraints,
- overuse of nearby or repeated evidence,
- retrieval dilution from irrelevant or competing chunks,
- confusion caused by distractors,
- sensitivity to ordering, headings, delimiters, and formatting,
- source-priority confusion when evidence and instructions are poorly separated.

## Important distinction


A3 asks:

> Is the information present in the finite runtime context?

A4 asks:

> If present, is the information effectively integrated into the model's computation?

A4 is therefore not about whether evidence was included. It is about whether included evidence had sufficient computational influence on generation.

# A5. In-Band Control/Data Representation

## Core mechanism


Instructions, user requests, examples, evidence, retrieved documents, tool outputs, and untrusted text all enter the base model through the same model-consumable medium: tokens in context.

Modern orchestration layers may expose structured roles such as system, developer, user, assistant, and tool. However, before inference, those logical roles are serialized into a single ordered token sequence. Role boundaries are represented in-band through special tokens, templates, delimiters, formatting, position, and learned conventions rather than through a native execution boundary.

During the transformer forward pass, the model applies the same general sequence-processing machinery to trusted instructions, retrieved evidence, quoted text, tool outputs, and adversarial user-controlled content. The model may learn to treat role markers differently, but this is learned behavior, not hard privilege isolation.

## Canonical statement


> The model receives control and data through a shared serialized token channel; role boundaries are represented in-band rather than enforced by a native privilege or memory-isolation mechanism.

## Why this is a primitive mechanism


This mechanism defines the structural control/data boundary of the model.

A database, operating system, or interpreter can enforce hard distinctions between commands, arguments, quoted strings, schemas, permissions, and untrusted payloads. A base LLM instead receives a serialized token sequence and must rely on learned conventions and surrounding structure to distinguish:

- instruction from data,
- trusted control text from untrusted text,
- quoted text from active user intent,
- examples from rules,
- retrieved evidence from imperative instructions,
- tool output from user commands,
- prior conversation text from current task requirements.

This makes A5 distinct from A3 and A4. A3 concerns whether information is present in context. A4 concerns how strongly it is integrated. A5 concerns what semantic or control role a span of context is represented as having.

## What it explains downstream


A5 contributes to faults involving:

- prompt injection,
- instruction/data confusion,
- following instructions embedded in retrieved documents,
- treating examples as rules,
- treating generated summaries as source evidence,
- confusing quoted user text with current user intent,
- mishandling tool outputs as natural-language instructions,
- source-priority confusion when trusted and untrusted content share the same channel.

## Important boundary


A5 is not the same as post-training policy, instruction hierarchy, or tool authorization.

Those are policy-layer or system-layer controls.

The mechanism here is more basic:

> The base model sees role-labeled tokens, not a hard operating-system boundary between command and data.

A5 also does not by itself explain why the model follows an injected instruction. That usually requires interaction with:

```text
A2 - learned instruction-following prior
A4 - attention/position-mediated integration
B1 - learned task induction
S-layer - missing sandboxing, quoting, validation, or authorization
```

# A6. Stateless Invocation

## Core mechanism


A base model invocation does not create durable internal memory.

Across independent calls, the model's weights are unchanged, and any continuity depends on what the system supplies in the next context:

```text
y_i = M_theta(C_i)
```


If prior information is not present in `C_i`, it is unavailable for that call.

## Canonical statement


> The base model has no native persistent state across invocations; continuity exists only through reintroduced context or external state.

## Why this is a primitive mechanism


This is different from finite context.

A3 concerns what fits into one call.

A6 concerns what persists across calls.

Even if every single call has a large context window, the model still has no native durable memory unless the system maintains and reintroduces state.

## What it explains downstream


A6 contributes to faults involving:

- lost user preferences,
- repeated questions,
- inconsistent decisions across sessions,
- missing project continuity,
- failure to preserve approvals or denials,
- stale or missing task state,
- agent workflows that lose track of previous steps.

## What it is not


Memory tools, profile storage, session summaries, vector stores, and project state are **S-layer systems**.

A6 is the mechanism that makes those systems necessary.

# A7. Autoregressive Factorization

## Core mechanism


The model generates output as a left-to-right sequence of tokens. It factorizes the probability of an output sequence (\(y\)) conditioned on input (\(x\)) into a product of next-token conditionals:

\[P_\theta(y \mid x) = \prod_{i=1}^{n} P_\theta(y_i \mid x, y_{<i})\]

At each decode step, the model computes a distribution for the next token conditioned on the original input and the generated prefix so far:

\[P_\theta(y_i \mid x, y_{<i})\]

In a standard single-path decode, the selected token is appended to the generated prefix, and its cached key/value representations are reused by later decode steps.

The model therefore extends a prefix rather than emitting a complete, globally verified answer object.

## Canonical statement


> The model generates by extending a token prefix one step at a time; each generated token becomes part of the conditioning context for later tokens, making generation sequential and path-dependent.

## Why this is a primitive mechanism


This is the core generative structure of decoder-only language modeling.

Once generation begins, the model's own output becomes part of the context that shapes subsequent output. Early generated tokens can influence:

- assumptions,
- tone,
- reasoning path,
- selected interpretation,
- answer structure,
- later factual commitments,
- whether later tokens preserve or compound earlier mistakes.

Autoregressive factorization does not provide native global verification, explicit planning, or automatic backtracking. Those capabilities can be approximated or added through decoding strategies, search, self-critique, external tools, validators, or multi-pass orchestration, but they are not part of the base factorization itself.

## What it explains downstream


A7 contributes to faults involving:

- local coherence but global inconsistency,
- early mistake propagation,
- false-premise continuation,
- reasoning-chain contamination,
- hallucination snowballing,
- plan drift over long generations,
- escalating unsupported detail in long answers,
- difficulty satisfying constraints that require future-aware planning,
- difficulty revising earlier commitments mid-generation.

## Important distinction


A7 is not the same as probabilistic scoring or decoding selection.

```text
A7:
  Generation is sequential and prefix-conditioned.

A8:
  Each step produces a distribution over possible next tokens.

A9:
  A decoding procedure selects or samples one path through those distributions.
```


Together, A7, A8, and A9 explain why generation is locally conditioned, distributional, and path-dependent.

# A8. Distributional Token Scoring

## Core mechanism


At each generation step, the model converts its final hidden state into a probability distribution over the tokenizer vocabulary.

Given the current input (\(x\)) and generated prefix (\(y_{<i}\)), the transformer produces a hidden state (\(h_i\)). A language-modeling head projects this hidden state into vocabulary-sized logits:

\[z_i = W_U h_i + b\]

These logits are normalized into a next-token distribution:

\[P_\theta(y_i \mid x, y_{<i}) = \text{softmax}(z_i)\]

The model's native output at this stage is therefore not a fact, proof, plan, action, belief, or calibrated confidence value. It is a distribution over possible next-token IDs.

## Canonical statement


> The model scores possible next-token continuations over a fixed vocabulary; it does not natively score truth, evidence, proof validity, action correctness, or calibrated belief.

## Why this is a primitive mechanism


This is the model's output-scoring bottleneck.

The final hidden state must be expressed as scores over discrete vocabulary items. Those scores reflect conditional token likelihood under the model's learned parameters and runtime context. They do not inherently distinguish:

```text
likelihood of text
from
truth of proposition
from
support by evidence
from
validity of reasoning
from
calibrated confidence
from
appropriateness of action
```


A true statement and a false but familiar-sounding statement are scored through the same logit-projection and softmax mechanism. Truth may affect likelihood indirectly through training and context, but it is not a separate native variable in the output distribution.

## What it explains downstream


A8 contributes to faults involving:

- plausibility mistaken for truth,
- weak confidence calibration,
- high-confidence wrong answers,
- fluent unsupported claims,
- generated justifications that are not actual evidence,
- non-privileged self-evaluation,
- multiple plausible but incompatible answers,
- agreement or sycophantic continuations when those are locally likely.

## Important distinction

```text
A7:
  The output sequence is generated one token at a time.

A8:
  Each step scores possible next tokens through logits and a probability distribution.

A9:
  A decoding procedure selects or samples one realized token path from those scores.
```


Together, A7, A8, and A9 explain why generation is sequential, distributional, and path-realized rather than globally planned, truth-scored, or directly verified.

# A9. Decoding Path Selection

## Core mechanism


A decoding procedure converts the model's next-token scores into a realized output path.

At each generation step, **A8** provides logits or a probability distribution over the tokenizer vocabulary. **A9** is the inference-time procedure that transforms, filters, constrains, searches over, samples from, or selects from those scores to produce the next token:

\[D(P_\theta(y_i \mid x, y_{<i})) \rightarrow y_i\]

The selected token then becomes part of the generated prefix used by later decode steps.

Decoding may be greedy, sampling-based, temperature-scaled, top-k, top-p, min-p, beam-like, reranked, grammar-constrained, schema-guided, or tool-call constrained.

## Canonical statement


> A realized output is a decoded path through the model's token scores; the final text is not the distribution itself, but one path selected by an inference-time decoding procedure.

## Why this is a primitive mechanism


Without decoding, there is no final answer.

The model can assign scores to many possible continuations, but the system must realize one continuation path. Different decoding regimes can produce different behavior from the same model, parameters, and prompt.

Decoding determines:

- whether the highest-scoring token is always chosen,
- whether randomness can enter generation,
- whether low-probability tokens remain eligible,
- whether the candidate set is filtered or truncated,
- whether invalid tokens are masked,
- whether a grammar, schema, or tool-call protocol constrains the next token,
- whether the system explores multiple candidate paths before choosing one.

This is the main inference-time boundary where probability becomes output.

## Typical decoding substeps


A decoding procedure may include some or all of the following operations.

### 1. Logit or probability transformation


Before a token is selected, the inference engine may reshape the raw scores.

Examples include:

- **temperature scaling**, which sharpens or flattens the distribution,
- **presence or frequency penalties**, which reduce the score of already-used tokens,
- **repetition penalties**, which discourage repeated continuations,
- **logit bias**, which raises or lowers specific token IDs,
- **token bans**, which make selected tokens ineligible.

These operations do not change the model's learned parameters. They modify the inference-time scores used for path selection.

### 2. Candidate filtering or truncation


The decoder may restrict the eligible token set before selection.

Examples include:

- **top-k decoding**, which keeps only the \(k\) highest-scoring tokens,
- **top-p / nucleus decoding**, which keeps the smallest candidate set whose cumulative probability exceeds threshold \(p\),
- **min-p decoding**, which filters tokens below a probability threshold relative to the highest-scoring token,
- **tail-free or similar filters**, which remove low-quality distribution tails.

These methods alter which tokens can be selected from the A8 distribution. They are often used to reduce incoherent low-probability samples while preserving some variability.

### 3. Constraint masking


The decoder may apply external constraints before selection.

A grammar, finite-state machine, parser, schema, regular expression, tool-call protocol, or structured-output controller can determine which tokens are legal at the current step. Illegal tokens can then be masked, often by setting their logits to \(-\infty\) or otherwise excluding them from the candidate set.

This can enforce properties such as:

- valid JSON syntax,
- required field structure,
- legal enum values,
- tool-call formatting,
- balanced delimiters,
- restricted output vocabularies.

However, constraint masking guarantees only the constraints it encodes. It can enforce syntax or schema validity, but it does not by itself guarantee factual correctness, task appropriateness, safe action choice, or semantic adequacy.

### 4. Path search or reranking


Some decoding regimes evaluate more than one possible continuation before choosing a path.

Examples include:

- **beam search**, which tracks multiple high-scoring partial sequences,
- **best-of-\(n\) sampling**, which samples multiple candidates and chooses one using a score or heuristic,
- **reranking**, where a secondary model, verifier, reward model, or rule-based scorer selects among candidates,
- **speculative decoding**, where draft tokens are proposed and then accepted or rejected by a target model.

These methods can approximate limited search or correction, but they do not remove the underlying autoregressive factorization. They operate over possible paths through the same token-scoring process.

### 5. Final token selection


After transformations, filters, constraints, or search, the decoder realizes a token.

Common selection modes include:

- **greedy decoding**, selecting the highest-scoring eligible token,
- **random sampling**, drawing from the eligible probability distribution,
- **constrained selection**, selecting only from tokens allowed by a grammar, schema, or tool protocol.

In a standard single-path decode, the selected token becomes part of the generated prefix and conditions later steps, unless the system explicitly branches, restarts, edits, or regenerates.

## What it explains downstream


A9 contributes to faults involving:

- run-to-run variance,
- instability under temperature or sampling parameters,
- rare catastrophic samples,
- brittle exact-match behavior under greedy decoding,
- locally optimal but globally poor continuations,
- inconsistent phrasing across generations,
- malformed structured output under unconstrained free decoding,
- over-constrained outputs that satisfy syntax but lose semantic adequacy,
- tool-call formatting failures,
- differences between creative, deterministic, schema-constrained, and tool-constrained behavior.

## Important distinction

```text
A7:
  Generation is sequential and prefix-conditioned.

A8:
  Each step scores possible next tokens through logits and a probability distribution.

A9:
  A decoding procedure realizes one token path from those scores.
```


Non-determinism is not the primitive mechanism. It appears when A9 uses random sampling, when runtime or numerical execution varies, when different seeds are used, or when decoding parameters change.

Structured-output reliability is also not purely an A9 property. A9 can enforce syntactic or schema-level constraints, but factual correctness, task interpretation, source fidelity, tool safety, and action appropriateness require interaction with other mechanisms and system-layer controls.

# A10. Transformer Compute Scaling

## Core mechanism


Transformer inference has practical compute costs tied to model size, sequence length, generation length, and number of passes.

Even when a model can theoretically process a long context or generate multiple samples, the system operates under token, latency, memory, and cost budgets.

## Canonical statement


> The architecture and inference process impose token, latency, and compute budgets that limit how much context, generation, sampling, and verification can occur within a request.

## Why this is a primitive mechanism


This mechanism affects feasibility.

Many failures are not caused by the model being unable in principle, but by the system having insufficient budget to:

- include all evidence,
- run multiple samples,
- perform verification,
- keep full state,
- inspect long documents,
- execute multiple tool calls,
- produce long structured outputs.

## What it explains downstream


A10 contributes to faults involving:

- truncation,
- over-compression,
- incomplete answers,
- skipped verification,
- excessive summarization,
- degraded context quality,
- long latency causing shortcuts,
- inability to run multi-pass reasoning or validation.

## Important distinction


A10 is not a product performance bug by itself.

It is the architectural resource mechanism that creates pressure for product-level tradeoffs.

# Proposed Layer 1A mechanism set


| Code | Mechanism | Core question it answers |
| --- | --- | --- |
| **A1** | Tokenized Representation | What are the units the model operates on? |
| **A2** | Static Parametric Learned Prior | Where does background knowledge/behavior come from? |
| **A3** | Finite Ordered Context Interface | What information is directly available at runtime? |
| **A4** | Attention/Position-Mediated Context Integration | How is available context weighted and integrated? |
| **A5** | In-Band Control/Data Representation | How are instructions, data, examples, and evidence represented? |
| **A6** | Stateless Invocation | What persists across calls natively? |
| **A7** | Autoregressive Factorization | How is output structurally generated over time? |
| **A8** | Distributional Token Scoring | What does the model natively score at each step? |
| **A9** | Decoding Path Selection | How does a probability distribution become one output? |
| **A10** | Transformer Compute Scaling | What resource limits shape feasible behavior? |

This set is the Layer 1A extraction of the old mechanism draft, with old **M10 Learned Natural-Language Task Induction** moved out into Layer 1B.
