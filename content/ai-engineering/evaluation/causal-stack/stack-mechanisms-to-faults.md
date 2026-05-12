---
draft: false
toc: true
title: "Stack Mechanisms To Faults"
linkTitle: "Stack Mechanisms To Faults"
---

If the goal is a **mutually exclusive set of LLM mechanisms**, then "Epistemic Constraints" should not be a peer category next to "Generation Constraints." Epistemic issues are mostly **derived fault modes**: they describe how generated text relates, or fails to relate, to truth, evidence, confidence, and verification.

The attached document already points in this direction by separating **M** model-mechanism constraints from **S** system-stack controls and failures. The next refinement is to make the **M layer causal and mutually exclusive**, then put hallucination, weak grounding, bad calibration, and similar issues one layer below as derived faults.

## Corrected structure


Instead of:

```text
Context Constraints
Generation Constraints
Epistemic Constraints
Reasoning Constraints
...
```


Use:

```text
Layer 1: Model mechanisms
Layer 2: Mechanism-derived fault modes
Layer 3: System faults / system-control failures
```


This prevents duplication.

For example:

```text
Autoregressive generation
    ↓
Plausible continuation pressure
    ↓
Unsupported claim / hallucination fault
    ↓
System fault: missing grounding, missing verifier, bad retrieval, bad abstention policy
```


So the epistemic issue is not a root mechanism. It is a **fault surface** caused by generation mechanisms interacting with missing or inadequate system controls.

# Layer 1 -- Mutually Exclusive LLM Mechanisms


A mechanism should name a **primitive source of behavior**, not an observed failure.

A good mechanism label should not say:

- hallucination,
- truth,
- confidence,
- grounding,
- refusal,
- tool failure,
- bad memory,
- bad retrieval.

Those belong downstream.

I would use this as the core mechanism set.

## M1. Tokenized Representation


The model consumes and emits discrete tokens rather than raw concepts, propositions, database records, or characters.

Canonical statement:

> The model operates over tokenized representations, so all input, output, copying, formatting, counting, and string manipulation are mediated by token boundaries and learned token representations.

This is the root mechanism behind exact-string brittleness, ID corruption, number fragility, and character-level weakness.

## M2. Parametric Learned Prior


The model's general knowledge and behavioral tendencies are encoded in learned parameters, not in an explicit symbolic database.

Canonical statement:

> The model uses a compressed parametric representation learned from data, so its outputs reflect distributed statistical structure rather than direct lookup from an authoritative source.

This is the mechanism behind approximate knowledge, uneven knowledge, memorization, and the fact that "knowing" something is retrieval-from-weights rather than database access.

Training-data coverage, staleness, and bias are **T-layer** issues, but the mechanism is parametric representation.

## M3. Finite Ordered Context Conditioning


The model conditions on a bounded, ordered runtime context.

Canonical statement:

> The model can directly use only information present in the current finite context, and that information is presented as an ordered token sequence.

This covers **availability**: whether the information is present at all.

It should not include lost-in-the-middle or recency bias yet. Those come from the next mechanism.

## M4. Attention/Position-Mediated Context Use


The model does not use all context uniformly. Its use of context is mediated by attention patterns, position, ordering, formatting, and learned salience.

Canonical statement:

> Information inside the context window is not accessed like records in a database; its effect depends on position, structure, attention, and salience.

This is the mechanism behind uneven context utilization, lost-in-the-middle behavior, recency effects, and overuse of nearby or more salient text.

## M5. Stateless Invocation


A base model call does not mutate durable internal state.

Canonical statement:

> Across independent invocations, the model has no native persistent memory; continuity exists only through context or external state supplied to the next call.

This is the mechanism behind non-native continuity.

Memory systems are **S-layer**. The mechanism is statelessness of the base invocation.

## M6. Autoregressive Factorization


The model generates output sequentially, with each token conditioned on the prompt and prior generated tokens.

[

P(y \mid x) = \prod_i P(y_i \mid x, y_{<i})

]

Canonical statement:

> The model generates by extending a prefix one token at a time, so output is path-dependent and locally continuation-driven.

This is the root mechanism behind continuation pressure, early-token commitment, plan drift, and accumulated reasoning errors.

## M7. Distributional Token Scoring


At each generation step, the model produces a distribution over possible next tokens, not a single necessary answer.

Canonical statement:

> The model defines likelihoods over next-token continuations; it does not natively output truth values, proofs, calibrated beliefs, or globally verified conclusions.

This is distinct from autoregression.

- **M6** says generation is sequential.
- **M7** says each step is distributional.

This is the root mechanism behind uncertainty, alternative continuations, plausibility-vs-truth gaps, and confidence mismatch.

## M8. Decoding Path Selection


A decoding procedure converts token distributions into a concrete output sequence.

Canonical statement:

> The realized output depends on the decoding regime that selects a path through the model's probability distribution.

This includes greedy decoding, sampling, temperature, top-p, beam search, constrained decoding, and structured-output decoding.

This is the root mechanism behind output variance and run-to-run instability under sampling.

Strictly speaking, this is an **inference mechanism**, not just a model-weight mechanism. But it belongs in the LLM mechanism layer because no generated output exists without decoding.

## M9. Transformer Compute Scaling


Transformer inference cost scales with model size and token sequence length, creating practical token, latency, and verification-budget limits.

Canonical statement:

> The architecture imposes compute and latency costs that constrain how much context, generation, sampling, and verification can be performed within a request.

This is the mechanism behind truncation pressure, limited multi-sample checking, latency tradeoffs, and context-budget competition.

# Final Layer 1 Mechanism Set


|Code|Mechanism|Canonical statement|
|---|---|---|
|**M1**|Tokenized Representation|The model operates over discrete tokens.|
|**M2**|Parametric Learned Prior|Knowledge and behavior are encoded in compressed learned weights.|
|**M3**|Finite Ordered Context Conditioning|The model directly conditions only on bounded ordered runtime context.|
|**M4**|Attention/Position-Mediated Context Use|Context use is shaped by position, structure, attention, and salience.|
|**M5**|Stateless Invocation|The base model has no native durable state across calls.|
|**M6**|Autoregressive Factorization|Output is generated sequentially, token by token.|
|**M7**|Distributional Token Scoring|Each step produces likelihoods over possible next tokens.|
|**M8**|Decoding Path Selection|A decoding regime realizes one path from the distribution.|
|**M9**|Transformer Compute Scaling|Token length, model size, and verification budgets constrain feasible behavior.|

This is much closer to mutually exclusive.

# Layer 2 -- Mechanism-Derived Fault Modes


Now epistemic issues become fault modes, not root mechanisms.

|Fault mode|Derived mainly from|
|---|---|
|Missing context|M3|
|Context ignored or underused|M4|
|Lost continuity|M5|
|Prompt sensitivity|M3 + M4 + M6|
|Path dependence|M6|
|Hallucination / unsupported claim|M6 + M7 + M2|
|Plausibility mistaken for truth|M7 + M6|
|Fabricated citation|M6 + M7|
|Weak confidence calibration|M7|
|Non-privileged self-checking|M6 + M7|
|Output variance|M7 + M8|
|Invalid structured output|M6 + M8|
|Exact-string corruption|M1|
|Number/counting brittleness|M1 + M6|
|Long-horizon reasoning drift|M6 + M7|
|Latency/truncation pressure|M9|

This layer does not need to be mutually exclusive. Most real faults are multi-causal.

# Layer 3 -- System Faults


System faults happen when the application fails to compensate for known mechanism-derived fault modes.

Examples:

| System fault                         | Underlying mechanism-derived issue                   |
| ------------------------------------ | ---------------------------------------------------- |
| Missing retrieval                    | Model lacks needed context                           |
| Bad retrieval ranking                | Relevant evidence is unavailable or low-salience     |
| No evidence requirement              | Unsupported claims pass through                      |
| No abstention rule                   | Model answers despite missing evidence               |
| No state store                       | Continuity is expected but not implemented           |
| Stale memory injection               | Old state is reintroduced as current                 |
| No schema validator                  | Invalid structured output reaches downstream systems |
| No tool-call permission gate         | Plausible but unsafe action executes                 |
| No deterministic calculator/verifier | Reasoning or arithmetic errors pass through          |
| Excessive context stuffing           | Salience degrades despite more context               |
| No latency budget                    | Verification is skipped under pressure               |

So the system layer should be framed as:

> **A system fault occurs when the product design assumes away a mechanism-derived limitation instead of bounding it with context management, grounding, verification, state, validation, or permission controls.**

# Where "Epistemic Constraints" goes now


The old Epistemic group should be demoted from root mechanism layer to derived fault layer.

Revised:

## Epistemic Fault Modes


|Code|Fault mode|Derived from|
|---|---|---|
|**EF1**|Plausibility-truth gap|M6 + M7|
|**EF2**|Unsupported claim|M2 + M6 + M7|
|**EF3**|Non-grounded justification|M6 + M7|
|**EF4**|Weak confidence calibration|M7|
|**EF5**|Non-privileged self-evaluation|M6 + M7|

That resolves the duplication.

The mechanism layer says:

> The model generates sequential, distributional text from a parametric prior.

The epistemic fault layer says:

> Therefore, generated claims, justifications, and confidence expressions are not automatically true, grounded, or calibrated.

# Clean causal stack


Use this structure:

```text
Layer 1 — Mechanism
What about the LLM/inference mechanism causes behavior?

Layer 2 — Derived fault mode
What recurring failure pattern can emerge from that mechanism?

Layer 3 — System fault
What did the application fail to provide or enforce?
```


Example:

```text
M7 Distributional Token Scoring
    ↓
EF4 Weak Confidence Calibration
    ↓
System fault: product exposes confidence scores without empirical calibration
```


Another:

```text
M3 Finite Ordered Context Conditioning
    ↓
Missing evidence fault
    ↓
System fault: retriever failed to include the governing policy document
```


Another:

```text
M6 Autoregressive Factorization
    ↓
Long-horizon reasoning drift
    ↓
System fault: agent loop has no step-level verifier or invariant checks
```

# Final correction


So yes: **Epistemic Constraints should not be a first-layer category** if the target is a mutually exclusive mechanism taxonomy.

The revised ontology should be:

```text
LLM Mechanisms
    M1 Tokenized Representation
    M2 Parametric Learned Prior
    M3 Finite Ordered Context Conditioning
    M4 Attention/Position-Mediated Context Use
    M5 Stateless Invocation
    M6 Autoregressive Factorization
    M7 Distributional Token Scoring
    M8 Decoding Path Selection
    M9 Transformer Compute Scaling

Derived Fault Modes
    Context faults
    Generation faults
    Epistemic faults
    Reasoning faults
    Format faults
    Representation faults
    Resource faults

System Faults
    Missing retrieval
    Bad context assembly
    Missing state
    Missing grounding
    Missing validator
    Missing verifier
    Missing permission gate
    Missing monitoring
```


That gives you a cleaner MECE foundation: **mechanisms are mutually exclusive; faults are allowed to be multi-causal.**
