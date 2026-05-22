---
draft: false
toc: true
title: "Stack Old Layer 1"
linkTitle: "Stack Old Layer 1"
---
# Model-Mechanism Constraints

## Definition


Architecture-implied operating constraints or model-mechanism constraints are predictable behavioral limits induced by the model's generation mechanism, before considering domain data, product policy, or system integration. That are constraints that follow from transformer-style sequence modeling and autoregressive/probabilistic decoding.

Canonical model-mechanism constraints, or M-constraints, are architecture-derived limits of LLM behavior that predict recurring failure patterns and define required system controls.

Canonical model-mechanism constraints are recurrent, architecture-derived limits of LLM behavior that arise from finite-context, token-based, probabilistic sequence generation. They are not themselves product bugs, but they create predictable failure modes unless bounded by system controls.

### Mechanism vs. Implication in Autoregressive Architectures


There is a crucial epistemological distinction here. There is a fundamental difference between the _mechanical operation_ of the architecture (autoregressive next-token prediction via self-attention) and the _system-level properties_ or behaviors that predictably emerge from that mechanism.

By isolating **architecture-implied operating constraints**, we can separate intrinsic model limitations from extrinsic, system-level wrappers like Reinforcement Learning from Human Feedback (RLHF), safety classifiers, or Retrieval-Augmented Generation (RAG) pipelines.

## Canonical Model-Mechanism Constraints Taxonomy

### Context constraints


1. **Finite-context availability.** The model cannot use information that is not present in the current runtime context
2. **Uneven context utilization.** The model does not use all supplied context equally; position, structure, salience, and source ordering affect behavior.
3. **Non-native continuity.** The model has no durable state across calls unless the system persists and reintroduces it.

|Code|Constraint|Canonical statement|
|---|---|---|
|**C1**|**Finite-context availability**|The model cannot use information that is not present in the current runtime context.|
|**C2**|**Uneven context utilization**|The model does not use all supplied context equally; position, structure, salience, and source ordering affect behavior.|
|**C3**|**Non-native continuity**|The model has no durable state across calls unless the system persists and reintroduces it.|

Core principle:

> **Context is not background information. Context is part of the control surface.**

### Generation constraints


4. **Probabilistic next-token generation**
    Outputs are distributions, not fixed symbolic conclusions.
5. **Sampling variance and output instability**
    Decoding can produce different acceptable or unacceptable outputs across runs.
6. **Prompt-form sensitivity**
    Semantically similar prompts can produce different behavior.

### Epistemic constraints


7. **Plausibility over grounded truth**
    The base generation objective favors likely continuations, not verified truth.
8. **Weak native calibration**
    Confidence in language is not reliable confidence in correctness.

### Reasoning/control constraints


9. **Long-horizon error accumulation**
    Multi-step tasks compound small errors and can drift from constraints.
10. **Free-form-to-structured fragility**
    Exact schemas, formats, and tool arguments are not guaranteed without constraints.

### Representation/resource constraints


11. **Tokenization and exact-string brittleness**
    IDs, numbers, rare strings, and character-level operations are fragile.
12. **Token/attention/latency budget limits**
    Practical inference budgets shape what can be done reliably.

# Context Model-Mechanism Constraints

## Overview


**Context constraints** are model-mechanism constraints arising from finite, ordered, non-persistent conditioning.

An LLM does not operate over "everything relevant." It operates over the runtime context supplied to it:

`y = M_theta(C)`

where `C` is the current context supplied to the model: system instructions, user input, prior turns, retrieved evidence, memory, tool outputs, summaries, and any other injected material.

Therefore, model behavior is bounded by:

1. **What information is available in context**
2. **How salient that information is within context**
3. **Whether required information persists across calls, turns, or sessions**

These constraints are not product bugs by themselves, but architectural limits that become product risk when workflows require continuity, groundedness, constraint preservation, or long-document reasoning.

# C1. Finite-Context Availability

## Mechanism constraint


The model can only condition directly on information present in the current context window.

Formally: \(P(t_{next} | C)\)

The model predicts the next token from `C`, not from the full conversation history, all available documents, external state, or prior sessions unless those are included in `C`.

## Observable failure patterns


#todo analyse

- The model ignores or contradicts earlier user requirements.
- Long-running conversations lose constraints introduced many turns earlier.
- The model misses facts from documents because the relevant passage was not included.
- The model answers generically when task-specific context is absent.
- The model fabricates missing details instead of recognizing that required context is unavailable.
- A system appears to "forget," when the relevant information was actually truncated, omitted, or never retrieved.
- The model fails to honor prior decisions because they were not reintroduced into the current context.
- Earlier requirements disappear.
- Long documents are summarized incorrectly.
- The model misses facts that were never inserted.
- The model behaves generically because critical context is absent.
- The system says "based on the above" even though the relevant evidence was truncated or omitted.

also: Availability failures are often misdiagnosed as reasoning failures.

## What does not fix it


- Telling the model to "remember" without supplying the information.
- Adding generic instructions such as "use all prior context."
- Increasing prompt emphasis without restoring missing facts.
- Assuming the model has access to previous sessions by default.
- Treating a larger context window as equivalent to reliable recall.

## Best-first mitigations

#todo analyse

- **Structured state store:** persist constraints, decisions, approvals, and user preferences outside the prompt.
- **Context rehydration:** deterministically reintroduce relevant state before each important step.
- **Retrieval of prior evidence:** retrieve relevant prior turns, document passages, or tool outputs.
- **Constraint registry:** maintain explicit constraints and validate outputs against them.
- **Evidence packs:** construct compact context bundles containing only task-relevant facts.
- **Truncation policy:** define what may be dropped, what must be preserved, and when to ask the user to narrow scope.
- **Provenance tracking:** distinguish user-provided facts, retrieved facts, inferred facts, and system-generated summaries.

# C2. Uneven Context Utilization

## Mechanism constraint


Even when relevant information is present in the context window, the model may not use it reliably or proportionally.

The context window is an ordered token sequence, not a neutral database. Position, recency, formatting, chunk order, source labeling, instruction hierarchy, and distractor content affect what the model uses.

## Observable failure patterns

#todo analyse

- The model overlooks evidence buried in the middle of a long context.
- Recent content is overweighted relative to earlier higher-priority constraints.
- The model uses a nearby or readable snippet instead of the most relevant evidence.
- Retrieved chunks are treated as equally authoritative when source priority is unclear.
- The model follows instructions embedded in evidence rather than system or developer instructions.
- The answer cites a source but the cited span does not support the claim.
- The model resolves ambiguity using the most salient text rather than the most authoritative text.
- Long tool outputs cause the model to miss key values, warnings, or exceptions.
- The model cites the wrong chunk.
- It uses the last instruction even when an earlier instruction has higher authority.
- It ignores a key fact buried in the middle of a long prompt.
- It answers from the most recent or most readable snippet rather than the most relevant one.
- It treats retrieved documents as equally reliable because the context does not encode source priority.

## What does not fix it


- Increasing the context window without improving context structure.
- Dumping more retrieved chunks into the prompt.
- Assuming top-k retrieval alone guarantees evidence use.
- Relying on "read carefully" instructions.
- Appending long raw tool outputs without summarization or field extraction.
- Mixing instructions, evidence, and examples without clear boundaries.

## Best-first mitigations


- **Evidence ranking:** order evidence by relevance and authority before injection.
- **Evidence budget:** include fewer, higher-quality spans instead of large raw context dumps.
- **Structured context layout:** separate instructions, user request, evidence, memory, tool output, and task.
- **Source priority labels:** mark authoritative, stale, user-provided, inferred, and low-trust sources.
- **Quote-backed claims:** require factual claims to cite or quote supporting spans.
- **Chunk selection:** extract relevant passages instead of injecting full documents.
- **Conflict handling policy:** require explicit resolution when sources disagree.
- **Instruction/evidence isolation:** prevent retrieved or user-supplied content from being treated as controlling instructions.

# C3. Non-Native Continuity

## Mechanism constraint


A base LLM has no durable state across independent calls.

Continuity exists only when the system supplies it through context, external memory, retrieved prior turns, state stores, summaries, or tool outputs.

## Observable failure patterns


- The model asks again for information the user already provided.
- User preferences disappear across sessions.
- The model contradicts prior decisions or commitments.
- Multi-step workflows lose track of completed steps.
- The model assumes stale preferences are still valid.
- The model treats generated summaries as ground truth without provenance.
- A project plan drifts because prior constraints were not persisted.
- Tool calls use incomplete or outdated state.
- The assistant asks for information already provided.
- Preferences disappear across sessions.
- A long-running task loses previous decisions.
- A plan contradicts a prior commitment.
- The system treats derived assumptions as facts because provenance was not preserved.

## What does not fix it


- Asking the model to "remember this" without an external memory mechanism.
- Relying on conversational continuity after context truncation.
- Assuming generated summaries are complete or authoritative.
- Storing unstructured memory without provenance, freshness, or update rules.
- Reusing stale state without confirmation.
- Treating model output as durable state unless explicitly written to a state store.

## Best-first mitigations


- **Structured memory store:** persist durable facts, preferences, decisions, and constraints outside the model.
- **State schema:** represent task state in explicit fields rather than free-form prose.
- **Memory provenance:** track source, timestamp, confidence, and whether the fact was user-provided or inferred.
- **Memory update policy:** define when memory can be created, modified, expired, or deleted.
- **Decision log:** record important approvals, denials, assumptions, and commitments.
- **Session summary with schema:** summarize prior work into deterministic fields, not loose narrative.
- **State refresh before action:** reintroduce relevant state before tool use or irreversible steps.
- **Staleness checks:** require confirmation when stored state may be outdated or high-impact.

Generation Constraints should cover the limits that arise **while the model is producing the answer**, rather than from what context is available.

The attached map already identifies the relevant family: **M4 autoregressive plausibility pressure**, **M5 stochastic decoding variance**, and **M6 prompt sensitivity**. It defines these as mechanism constraints arising from autoregressive/probabilistic decoding, distinct from training/data, policy, or system-stack causes.

I would formulate the **Generation Constraints** as **G1-G3**.

# G. Generation Model-Mechanism Constraints

## Overview


**Generation constraints** are model-mechanism constraints arising from the way an LLM produces output: sequentially, probabilistically, and conditionally.

A model does not generate a response as a complete object in one step. It generates token by token:

`P(y | x) = product_{i=1}^n P(y_i | x, y_<i>)`

where:

- `x` is the supplied context,
- `y_i` is the next generated token,
- `y_<i` is the partial answer already generated.

This has three important consequences:

1. The model is under **continuation pressure**.
2. The output is **decoding-mediated**.
3. The generation path is **prompt- and trajectory-sensitive**.

So Generation Constraints should be framed as:

> The model generates by extending a context-conditioned probability trajectory, not by executing a globally verified answer plan.

# G1. Autoregressive Continuation Pressure

## Mechanism constraint


The model generates by repeatedly selecting likely next tokens conditioned on the current context and its own previously generated tokens.

At step `i`: `P(y_i | x, y_<i>)`

The model is therefore optimized toward locally plausible continuation, not inherently toward truth, groundedness, completeness, safety, consistency, or task success.

## Proper formulation


> **The model is a continuation engine before it is an answer engine.**

This does not mean the model cannot answer correctly. It means correctness is not the primitive mechanism. Correct answers emerge when the likely continuation also corresponds to a true, grounded, or useful answer.

The key distinction:

| Concept      | Mechanism status                                                     |
| ------------ | -------------------------------------------------------------------- |
| Plausibility | Directly favored by generation                                       |
| Fluency      | Directly favored by generation                                       |
| Truth        | Indirectly favored when correlated with training patterns or context |
| Grounding    | Not native unless supplied and enforced                              |
| Completeness | Not guaranteed by token-level continuation                           |
| Consistency  | Emergent, not globally enforced                                      |

**Probabilistic Next-Token Generation (Distribution vs. Symbolism)**

- **The Mechanism:** The final layer of a transformer projects continuous latent vectors into a logits vector across the entire vocabulary space. This vector is then normalized via a softmax function to represent probabilities.
- **The System Implication:** The output is strictly a probability mass function over discrete tokens, P(wt​∣w1...t−1​). The model fundamentally lacks a symbolic reasoning engine or a formalized logical truth-state. It does not "arrive at a conclusion" or "know a fact"; it simply collapses a wave of probabilistic inferences into a sequence. Therefore, relying on it for hard logical deduction without a symbolic grounding layer is structurally flawed.

## Derived implications


Because generation proceeds by plausible continuation:

- unsupported claims can be generated when they fit the local continuation pattern;
- missing facts may be filled in with likely-seeming content;
- the model may continue a false premise instead of challenging it;
- fluent form can mask weak evidential support;
- longer answers create more opportunities for unsupported continuation;
- local coherence can appear even when the global answer is wrong.

The clean conceptual phrase is:

> **Plausibility is native; truth is mediated.**

## What this is not


This is not the same as "hallucination."

Hallucination is an observed failure pattern. The underlying mechanism constraint is **autoregressive continuation pressure**.

Better:

> Hallucination risk arises when plausibility pressure operates without sufficient grounding or verification.

# G2. Decoding-Mediated Output Variance

## Mechanism constraint


The model outputs a probability distribution, not a single necessary continuation.

The actual response depends on a decoding procedure: `D(P(y_i | x, y_<i>))`

where `D` may involve greedy selection, sampling, temperature, top-p, beam search, constrained decoding, or other decoding rules.

## Proper formulation


> **The model defines a distribution; decoding selects a path through it.**

This is more precise than simply saying "LLMs are non-deterministic."

A model can be run deterministically. But even deterministic decoding is still selecting from a probability distribution. So the inherent property is not always non-determinism. The inherent property is **distributional generation**.

Better:

> **Generation is distributional; realized outputs are decoding-mediated.**

## Derived implications


Because outputs are decoding-mediated:

- two runs can produce different answers under sampling;
- small probability differences can lead to different continuations;
- rare bad outputs may appear only in repeated samples;
- deterministic decoding can still produce brittle outputs if the top token leads down a poor path;
- output quality depends on decoding choices, not only model quality;
- "same model" does not mean "same behavior" unless decoding is controlled.

## Important distinction


|Statement|Verdict|
|---|---|
|"LLMs are inherently probabilistic."|Correct.|
|"LLM outputs are always non-deterministic."|Too strong.|
|"Sampling introduces output variance."|Correct.|
|"Greedy decoding removes all generation risk."|Incorrect.|

# G3. Prompt-Conditioned Trajectory Sensitivity

## Mechanism constraint


The generated sequence is highly sensitive to the initial context and to the partial sequence already generated.

Generation is conditioned not only on the user's semantic intent, but on the exact tokenized prompt:

\[P(y_i | x, y_i)\]

Small changes to `x` can alter the probability distribution. Small changes to early generated tokens \(y_{j<i}\) can alter the remainder of the trajectory.

## Proper formulation


> **The model does not respond to abstract intent directly; it responds to a tokenized conditioning surface.**

This is the deeper version of "prompt sensitivity."

Prompt sensitivity is not merely a UX problem. It follows from the fact that the prompt is the conditioning object. There is no native canonicalization step that guarantees two semantically equivalent prompts produce equivalent behavior.

## Derived implications


Because generation is prompt-conditioned:

- reordering the same information can change the answer;
- formatting can affect interpretation;
- examples can prime the output style or decision rule;
- nearby wording can change tool-use or refusal behavior;
- semantically equivalent requests can produce different answers;
- early generated wording can commit the answer to a path that later tokens reinforce.

This gives two related forms of sensitivity:

|Type|Description|
|---|---|
|**Input sensitivity**|Small changes in the prompt alter the output distribution.|
|**Trajectory sensitivity**|Small changes in early generated tokens alter later generation.|

The combined constraint is:

> **Prompt-conditioned trajectory sensitivity.**

## Why this is broader than prompt sensitivity


"Prompt sensitivity" usually points only to the input.

But generation also has **self-conditioning**:

`y_1 -> y_2 -> y_3 -> ...`

Once the model starts down one path, the partial answer becomes part of the context for the rest of the answer.

This creates path dependence:

> Early phrasing can constrain later reasoning, tone, assumptions, and conclusions.

So G3 should include both prompt sensitivity and generation trajectory sensitivity.

# Recommended G1-G3 Set

## G1. Autoregressive Continuation Pressure


Canonical statement:

> The model generates locally plausible next-token continuations, so fluency and plausibility are native while truth, grounding, completeness, and global consistency are not guaranteed by the generation mechanism alone.

Maps to the document's M4.

## G2. Decoding-Mediated Output Variance


Canonical statement:

> The model produces token probability distributions; realized outputs depend on the decoding regime and may vary across runs, especially under sampling.

Maps to the document's M5.

## G3. Prompt-Conditioned Trajectory Sensitivity


Canonical statement:

> The model's output trajectory is sensitive to the tokenized prompt and to its own earlier generated tokens, so minor changes in phrasing, ordering, formatting, or early continuation can shift later behavior.

Maps to the document's M6, but extends it slightly to include self-conditioning and path dependence.

# Compact derivation


Starting point:
\[P(y \mid x) = \prod_{i=1}^{n} P(y_i \mid x, y_{<i})\]

From this:

## 1. Autoregression


Because each token is generated as a continuation of previous tokens:

`P(y_i | x, y_<i>)`

we get:

> **G1: Autoregressive continuation pressure**

The model continues plausibly; it does not natively verify globally.

## 2. Probability distribution


Because each step yields a distribution rather than a single answer:

`P(y_i | ...)`

we get:

> **G2: Decoding-mediated output variance**

The final output depends on how the distribution is decoded.

## 3. Conditioning on prompt and prior output


Because every next token is conditioned on `x` and `y_<i`:

`x, y_<i`

we get:

> **G3: Prompt-conditioned trajectory sensitivity**

Small changes in input or early output can alter the entire trajectory.

# Important exclusions


These should not be placed directly inside Generation Constraints:

|Candidate|Better placement|
|---|---|
|Hallucination|Failure pattern derived from G1|
|Fabricated citations|Failure pattern derived from G1 plus weak grounding|
|Inconsistent answers|Failure pattern derived from G2/G3|
|Refusal inconsistency|Often P-layer plus G3|
|Tool-call mistakes|Usually S-layer/control issue plus G2/G3|
|Stale knowledge|T-layer issue, not generation mechanism|
|Bad retrieval|S-layer issue, not generation mechanism|
|Weak confidence calibration|Epistemic constraint; related to G1 but worth separate family|

This matters because the canonical constraint should name the **cause**, not the symptom.

# Final proposed formulation

## Generation Constraints


> **Generation constraints** are model-mechanism constraints arising from sequential, probabilistic, prompt-conditioned token generation. Because an LLM generates one token at a time from a context-conditioned distribution, its outputs are shaped by local continuation pressure, decoding choices, and trajectory sensitivity. These constraints explain why fluent outputs may be unsupported, why outputs may vary across runs, and why small changes in prompt or early wording can produce materially different responses.

|Code|Constraint|Canonical statement|
|---|---|---|
|**G1**|**Autoregressive continuation pressure**|The model generates locally plausible continuations, not globally verified answers.|
|**G2**|**Decoding-mediated output variance**|The model defines probability distributions; decoding selects the realized output path.|
|**G3**|**Prompt-conditioned trajectory sensitivity**|The output trajectory is sensitive to prompt form and to earlier generated tokens.|

# E. Epistemic Model-Mechanism Constraints

## Overview


**Epistemic constraints** are model-mechanism constraints governing the relationship between generated text and truth, evidence, justification, and confidence.

A base LLM does not directly output: `truth` It outputs: `P(y | C)`. That is, a probability distribution over possible text continuations given a context `C`.

This means the model's native object is not a fact, proof, belief, source, or calibrated confidence estimate. Its native object is a **textual continuation distribution**.

So the core epistemic issue is:

> The model can generate claims, explanations, citations, and confidence language, but those are themselves generated text, not inherently verified epistemic states.

# E1. Likelihood-Truth Separation

## Mechanism constraint


The probability of a textual continuation is not the same as the probability that the proposition expressed by that continuation is true.

The model estimates something like:

`P(y | C)`

not directly:

`P(true(p) | C)`

where `p` is the proposition expressed by `y`.

A continuation may be likely because it is common, fluent, stylistically appropriate, or contextually expected. That does not make it true.

## Proper formulation


> **The model scores textual plausibility, not truth directly.**

This is the central epistemic constraint.

It does not mean the model cannot produce true claims. It often can, because truthful claims are strongly represented in language. But truth is mediated through language patterns, training data, context, retrieval, or verification. It is not the native output type of the model.

## Derived implications


Because likelihood and truth are distinct:

- a fluent answer may be false;
- a common misconception may be more likely than a rare correction;
- a plausible detail may be supplied when evidence is missing;
- a false premise may be continued rather than challenged;
- the model may generate an answer in the expected form even when the correct epistemic move is abstention;
- truthfulness depends on whether truth is sufficiently represented, salient, and favored in the current context.

The compact phrase:

> **Plausibility is not evidence.**

## What this is not


This is not identical to hallucination.

Hallucination is a failure pattern. The deeper constraint is the separation between language likelihood and truth.

Better:

> Hallucination risk arises because likely continuations can express unsupported or false propositions.

# E2. Non-Native Grounding

## Mechanism constraint


The model does not inherently bind generated claims to specific evidence, sources, or provenance.

It can produce a claim: `p` and it can produce an explanation or citation-like text: `e` but the generation mechanism alone does not guarantee: `e -> p` or: `source(e) actually supports p`

Grounding is therefore not native to the generated claim. It must be supplied or enforced through context structure, retrieval, tools, verification, or source-aware system design.

## Proper formulation


> **Generated claims are not inherently evidence-bound.**

This is different from E1.

- E1 says textual likelihood is not truth.
- E2 says generated claims are not automatically tied to supporting evidence.

An LLM may give a correct answer without knowing why, or give a plausible explanation that does not actually support the answer.

## Derived implications


Because grounding is non-native:

- explanations may be post-hoc rationalizations;
- citations may be malformed, irrelevant, or fabricated;
- a claim may be true but unsupported by the supplied context;
- a claim may be supported by some latent training pattern but not by available evidence;
- the model may conflate user-provided facts, retrieved facts, inferred facts, and generated assumptions;
- the model may fail to distinguish "I have evidence for this" from "this sounds right."

The compact phrase:

> **Justification text is not the same as justification.**

## Important distinction


Grounding is not impossible for LLM systems. It is just not guaranteed by the base generation mechanism.

A system can impose grounding by requiring retrieved evidence, source spans, tool outputs, or formal verification. But that belongs to the system layer.

The epistemic constraint is:

> Without additional structure, claim generation and evidence validation are separable.

# E3. Weak Native Calibration

## Mechanism constraint


The model's expressed confidence is not inherently a calibrated estimate of correctness.

A phrase like:

> "I'm certain"

or:

> "probably"

is itself generated as part of the textual continuation.

So the model is producing:

`P(confidence_phrase | C)`

not necessarily:

`P(answer_is_correct | C)`

This creates a gap between confidence tone and epistemic reliability.

## Proper formulation


> **Confidence language is generated behavior, not a native reliability measurement.**

This is why "ambiguous confidence calibration" is a good intuition but an imprecise name. The cleaner name is:

> **Weak native calibration.**

## Derived implications


Because confidence is generated text:

- wrong answers can sound confident;
- correct answers can be over-hedged;
- confidence can vary across paraphrases;
- confidence can vary across decoding runs;
- explicit numerical confidence scores may not be calibrated;
- fluent explanation can create an illusion of certainty;
- uncertainty may be underexpressed when the answer format implies authority.

The compact phrase:

> **Tone is not calibration.**

## Important distinction


Token probability is also not the same as epistemic confidence.

A high-probability token sequence may be high-probability because it is conventional, not because the underlying claim is true.

So neither of these is automatically reliable:

`confident wording`

nor:

`high token likelihood`

as a direct measure of correctness.

# E4. Non-Privileged Self-Evaluation

## Mechanism constraint


When a model evaluates its own answer, that evaluation is also generated by the same mechanism.

The model does not have guaranteed privileged access to a separate truth oracle, proof checker, source validator, or calibrated introspective state.

Self-evaluation is another continuation:

`P(y_eval | C, y_answer)`

not an independent guarantee that the answer is correct.

## Proper formulation


> **The model's self-assessment is generated output, not privileged introspection.**

This matters because users and systems often ask the model:

- "Are you sure?"
- "Check your work."
- "Rate your confidence."
- "Does this citation support the claim?"
- "Is this answer correct?"

The model may improve its answer through reflection-like generation, but the mechanism is still probabilistic text generation unless another verifier or source of truth is introduced.

## Derived implications


Because self-evaluation is non-privileged:

- the model may fail to notice its own error;
- it may rationalize an earlier answer;
- it may change a correct answer to an incorrect one;
- it may produce inconsistent confidence estimates;
- "double-checking" can improve performance but does not create a guarantee;
- self-critique is useful as a heuristic, not as a proof of correctness.

The compact phrase:

> **Self-checking is not verification.**

## Relation to E3


E3 concerns confidence expression.

E4 concerns self-evaluation.

They are related but distinct.

|Constraint|Object|
|---|---|
|**E3: Weak native calibration**|"How confident is the model?"|
|**E4: Non-privileged self-evaluation**|"Can the model reliably judge its own answer?"|

# Recommended E1-E4 Set

## E1. Likelihood-Truth Separation


Canonical statement:

> The model assigns likelihood to text continuations, not truth values to propositions; therefore plausible generated claims are not inherently true.

## E2. Non-Native Grounding


Canonical statement:

> Generated claims are not inherently bound to supporting evidence, sources, or provenance; justification text is itself generated unless grounding is externally supplied or enforced.

## E3. Weak Native Calibration


Canonical statement:

> The model's confidence tone, hedging, or explicit confidence scores are not inherently calibrated to correctness.

## E4. Non-Privileged Self-Evaluation


Canonical statement:

> The model's self-checks and self-assessments are generated by the same mechanism and do not constitute independent verification.

# Compact derivation


Start from the base object:

`P(y | C)`

The model produces likely text given context.

## 1. Text likelihood is not proposition truth


`P(y | C) != P(true(p_y) | C)`

Therefore:

> **E1: Likelihood-Truth Separation**

## 2. Generated explanation is not evidence binding


`P(e | C, p) != supports(e, p)`

Therefore:

> **E2: Non-Native Grounding**

## 3. Confidence language is not calibrated correctness


`P(c | C, y) != P(correct(y) | C)`

Therefore:

> **E3: Weak Native Calibration**

## 4. Self-evaluation is another generated continuation


`P(y_eval | C, y_answer)`

Therefore:

> **E4: Non-Privileged Self-Evaluation**

# Final proposed formulation

## Epistemic Constraints


> **Epistemic constraints** are model-mechanism constraints arising from the fact that an LLM generates text rather than directly representing truth, evidence, justification, or calibrated belief. Because the model's native output is a context-conditioned textual distribution, plausible claims are not inherently true, generated justifications are not inherently grounded, confidence language is not inherently calibrated, and self-evaluation is not independent verification.

|Code|Constraint|Canonical statement|
|---|---|---|
|**E1**|**Likelihood-Truth Separation**|Plausible generated text is not inherently true.|
|**E2**|**Non-Native Grounding**|Generated claims are not inherently bound to evidence or provenance.|
|**E3**|**Weak Native Calibration**|Confidence expression is not inherently calibrated to correctness.|
|**E4**|**Non-Privileged Self-Evaluation**|Self-checking is generated behavior, not independent verification.|

The shortest version:

> **LLMs generate claims, not knowledge guarantees.**
