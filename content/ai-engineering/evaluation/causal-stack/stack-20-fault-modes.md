---
draft: false
toc: true
title: "Stack 20 Fault Modes"
linkTitle: "Stack 20 Fault Modes"
---
Yes. Layer 2 should be the **mechanism-derived fault modes** layer.

Layer 1 gave us the causal substrate:

> tokenized, parametric, finite-context, attention-mediated, stateless, autoregressive, distributional sequence generation under decoding and compute constraints.

Layer 2 now asks:

> What recurring fault patterns naturally arise from those mechanisms?

The attached mechanism map already lists many observable failures under its M1-M11 sections. Here we are reorganizing those into a clean Layer 2 taxonomy, while keeping **system faults** separate for Layer 3.

# Layer 2 -- Mechanism-Derived Fault Modes

## Definition


A **mechanism-derived fault mode** is a recurring behavioral failure pattern that follows from one or more Layer 1 LLM mechanisms.

It is not yet a system fault.

For example:

```text
M3 Finite Ordered Context Interface
    ↓
Layer 2 fault mode: relevant evidence absent from context
    ↓
Layer 3 system fault: retriever failed to include the governing document
```


Layer 2 describes what can go wrong because of the model mechanism.

Layer 3 will describe what the system failed to provide, validate, constrain, or recover from.

# Important design rule


Layer 1 mechanisms should be mostly mutually exclusive.

Layer 2 fault modes do **not** need to be fully mutually exclusive.

Most real LLM failures are multi-causal. A hallucinated citation, for example, may involve:

- M2 Parametric Learned Prior
- M7 Autoregressive Factorization
- M8 Distributional Token Scoring
- M10 Learned Natural-Language Task Induction

So Layer 2 should be organized, but not forced into perfect exclusivity.

# Proposed Layer 2 fault-mode families


I would organize Layer 2 into seven families:

|Family|Name|Core question|
|---|---|---|
|**CF**|Context Fault Modes|Did the model have and use the right runtime information?|
|**GF**|Generation Fault Modes|Did the generated trajectory remain stable, complete, and globally coherent?|
|**EF**|Epistemic Fault Modes|Did the generated claim properly relate to truth, evidence, and confidence?|
|**IF**|Instruction/Task Fault Modes|Did the model infer and follow the intended task contract?|
|**RF**|Reasoning/Planning Fault Modes|Did multi-step reasoning preserve correctness and constraints?|
|**SF**|Structure/Representation Fault Modes|Did the output preserve exact form, schema, symbols, and identifiers?|
|**BF**|Budget/Resource Fault Modes|Did token, latency, or compute pressure degrade behavior?|

Use **F** here for "fault mode," not "system fault."

# CF -- Context Fault Modes


These derive mainly from:

- **M3 Finite Ordered Context Interface**
- **M4 Attention/Position-Mediated Context Integration**
- **M5 In-Band Control/Data Representation**
- **M6 Stateless Invocation**

## CF1. Context Omission

## Definition


Required information is absent from the runtime context, so the model cannot directly use it.

## Derived from


- M3 Finite Ordered Context Interface
- M6 Stateless Invocation

## Canonical statement


> The model cannot use information that was not supplied or reintroduced into the current context.

## Typical expression


- Missing facts
- Forgotten requirements
- Generic answers
- Contradiction of prior turns
- Use of parametric defaults instead of task-specific facts

## Not a system fault yet


The Layer 2 fault mode is:

> required context absent.

The Layer 3 system fault might be:

> retrieval failed, state was not persisted, memory was not rehydrated, or truncation removed the relevant constraint.

## CF2. Context Underutilization

## Definition


Relevant information is present in context but receives insufficient influence during generation.

## Derived from


- M4 Attention/Position-Mediated Context Integration

## Canonical statement


> The model may fail to use relevant context even when that context is technically present.

## Typical expression


- Lost-in-the-middle behavior
- Recency bias
- Ignoring buried constraints
- Overusing nearby but weaker evidence
- Citing a chunk while missing the key span

## Difference from CF1


CF1 means:

> the evidence was not there.

CF2 means:

> the evidence was there but was not effectively used.

## CF3. Context Priority Confusion

## Definition


The model fails to correctly prioritize among conflicting or heterogeneous context elements.

## Derived from


- M4 Attention/Position-Mediated Context Integration
- M5 In-Band Control/Data Representation
- M10 Learned Natural-Language Task Induction

## Canonical statement


> When multiple context elements compete, the model may overweight the wrong one.

## Typical expression


- Treating a low-authority source as authoritative
- Following the latest instruction despite an earlier stronger constraint
- Overweighting an example over the actual task
- Resolving conflict based on salience rather than authority

This is distinct from CF2. CF2 is underuse. CF3 is wrong prioritization.

## CF4. Continuity Loss

## Definition


Information needed for continuity across turns, calls, or sessions is unavailable or inconsistently represented.

## Derived from


- M6 Stateless Invocation
- M3 Finite Ordered Context Interface

## Canonical statement


> The model has no native durable state, so continuity can fail unless state is supplied in the current context.

## Typical expression


- Re-asking for known information
- Losing user preferences
- Forgetting project decisions
- Inconsistent follow-through across tool calls
- Treating stale state as current

## Difference from CF1


CF1 is general context omission.

CF4 is specifically omission or degradation of **continuity state**.

# GF -- Generation Fault Modes


These derive mainly from:

- **M7 Autoregressive Factorization**
- **M8 Distributional Token Scoring**
- **M9 Decoding Path Selection**

## GF1. Local Plausibility Drift

## Definition


The model produces locally plausible text that drifts away from the global task objective, factual constraints, or intended answer.

## Derived from


- M7 Autoregressive Factorization
- M8 Distributional Token Scoring

## Canonical statement


> A sequence can remain locally coherent while becoming globally wrong.

## Typical expression


- Answer starts correctly but drifts
- Explanation becomes overextended
- Later claims exceed earlier evidence
- Fluent continuation substitutes for task completion
- The model continues the pattern rather than satisfying the objective

This is the Layer 2 expression of autoregressive continuation pressure.

## GF2. Path Dependence

## Definition


Early generated tokens shape later generation, making the final output dependent on initial wording, framing, or early assumptions.

## Derived from


- M7 Autoregressive Factorization

## Canonical statement


> Once generation begins down a path, later output is conditioned by that path.

## Typical expression


- Early false assumption contaminates the answer
- Initial framing locks in a wrong interpretation
- The model continues a mistaken plan
- Early wording makes later correction less likely
- The answer becomes self-reinforcing

This should be separate from prompt sensitivity.

Prompt sensitivity concerns the input. Path dependence concerns the generated trajectory.

## GF3. Output Variance

## Definition


The same or similar input can produce materially different outputs because generation is distributional and decoding-mediated.

## Derived from


- M8 Distributional Token Scoring
- M9 Decoding Path Selection

## Canonical statement


> A realized answer is one path through a probability distribution, not a unique necessary output.

## Typical expression


- Different answers across runs
- Different levels of caution across runs
- Different tool arguments
- Different structure or emphasis
- Rare bad samples in repeated trials

This replaces "non-determinism" as a more precise fault-mode label.

## GF4. Tail-Risk Generation

## Definition


Low-probability but severe outputs can occur, especially under sampling or weak constraints.

## Derived from


- M8 Distributional Token Scoring
- M9 Decoding Path Selection

## Canonical statement


> Distributional generation can produce rare outputs that are absent from small test samples but still possible in deployment.

## Typical expression


- Rare unsafe completion
- Rare invalid tool parameter
- Rare fabricated citation
- Rare policy-violating phrasing
- Rare catastrophic answer despite usually acceptable behavior

This is related to output variance but worth separating because it matters for risk modeling.

# EF -- Epistemic Fault Modes


These derive mainly from:

- **M2 Parametric Learned Prior**
- **M7 Autoregressive Factorization**
- **M8 Distributional Token Scoring**

Epistemic faults are not first-layer mechanisms. They are downstream consequences of distributional, autoregressive text generation.

## EF1. Plausibility-Truth Gap

## Definition


The model generates text that is plausible in context but not necessarily true.

## Derived from


- M7 Autoregressive Factorization
- M8 Distributional Token Scoring
- M2 Parametric Learned Prior

## Canonical statement


> Plausible generated text is not inherently true.

## Typical expression


- Fluent false answer
- Common misconception repeated
- False premise continued
- Generic but incorrect explanation
- Likely-sounding detail invented

This is the core epistemic fault mode.

## EF2. Unsupported Assertion

## Definition


The model produces a factual claim without sufficient grounding in the supplied context, tools, or verified source.

## Derived from


- M2 Parametric Learned Prior
- M7 Autoregressive Factorization
- M8 Distributional Token Scoring

## Canonical statement


> A generated claim may lack evidential support even when it sounds confident or specific.

## Typical expression


- Hallucinated fact
- Unverified claim
- Unsupported policy interpretation
- Unsupported legal/medical/financial assertion
- Specific names, dates, or figures invented from pattern

Difference from EF1:

- EF1 is about truth.
- EF2 is about support.

A claim may be true but unsupported by the current context.

## EF3. Non-Grounded Justification

## Definition


The model generates an explanation, rationale, or citation-like object that does not actually support the claim.

## Derived from


- M5 In-Band Control/Data Representation
- M7 Autoregressive Factorization
- M8 Distributional Token Scoring

## Canonical statement


> Justification text is not the same as justification.

## Typical expression


- Fabricated citation
- Irrelevant source cited
- Explanation does not entail conclusion
- Post-hoc rationalization
- Claim and evidence mismatch
- Confident "because..." that is not logically or evidentially valid

Difference from EF2:

- EF2: no support.
- EF3: generated support appears, but does not actually support the claim.

## EF4. Weak Confidence Calibration

## Definition


The model's expressed confidence does not reliably correspond to correctness.

## Derived from


- M8 Distributional Token Scoring
- M2 Parametric Learned Prior
- M9 Decoding Path Selection

## Canonical statement


> Confidence language is generated behavior, not a calibrated reliability measure.

## Typical expression


- High-confidence wrong answer
- Over-hedged correct answer
- Inconsistent confidence across runs
- Numeric confidence score not predictive of accuracy
- Fluent style mistaken for reliability

This should stay in Layer 2, not Layer 1.

The mechanism is distributional token scoring. The fault mode is weak calibration.

## EF5. Non-Privileged Self-Evaluation

## Definition


The model's self-checking, self-critique, or confidence assessment is itself generated output, not independent verification.

## Derived from


- M7 Autoregressive Factorization
- M8 Distributional Token Scoring

## Canonical statement


> Self-checking is not verification.

## Typical expression


- The model fails to catch its own error
- The model rationalizes an earlier wrong answer
- "I checked" without actual independent check
- Self-critique improves style but not correctness
- Second answer changes without principled reason

This is epistemic because it concerns the model's relationship to its own correctness.

# IF -- Instruction and Task Fault Modes


These derive mainly from:

- **M5 In-Band Control/Data Representation**
- **M10 Learned Natural-Language Task Induction**
- **M4 Attention/Position-Mediated Context Integration**
- **M7 Autoregressive Factorization**

## IF1. Prompt-Form Sensitivity

## Definition


Semantically similar prompts produce materially different behavior because the model is sensitive to phrasing, ordering, formatting, and examples.

## Derived from


- M3 Finite Ordered Context Interface
- M4 Attention/Position-Mediated Context Integration
- M10 Learned Natural-Language Task Induction
- M7 Autoregressive Factorization

## Canonical statement


> The model responds to a tokenized conditioning surface, not directly to abstract user intent.

## Typical expression


- Different answers to paraphrases
- Different refusal/compliance behavior
- Different output style from minor formatting changes
- Tool use triggered by superficial cues
- Different interpretation of the same underlying request

Prompt sensitivity belongs here as a fault mode, not as a primitive mechanism.

## IF2. Task Misinduction

## Definition


The model infers the wrong task, objective, or success criterion from the prompt.

## Derived from


- M10 Learned Natural-Language Task Induction
- M5 In-Band Control/Data Representation
- M4 Attention/Position-Mediated Context Integration

## Canonical statement


> The model may infer a different task than the user or system intended.

## Typical expression


- Summarizes instead of extracts
- Explains instead of decides
- Drafts instead of executes
- Treats examples as the required output
- Optimizes for helpfulness when exact compliance was needed
- Answers a nearby question rather than the actual one

Difference from IF1:

- IF1 is sensitivity to form.
- IF2 is incorrect inferred task.

## IF3. Control/Data Confusion

## Definition


The model treats data as instruction, instruction as data, or otherwise misclassifies the role of context spans.

## Derived from


- M5 In-Band Control/Data Representation
- M4 Attention/Position-Mediated Context Integration
- M10 Learned Natural-Language Task Induction

## Canonical statement


> Because control and data share the token channel, their roles can be confused.

## Typical expression


- Follows instructions inside retrieved documents
- Treats quoted text as user intent
- Treats example content as a rule
- Treats tool output prose as a directive
- Obeys malicious or accidental prompt-injection content

This is the Layer 2 fault mode behind many injection-like failures.

Layer 3 will ask why the system failed to isolate or neutralize untrusted text.

## IF4. Constraint Misclassification

## Definition


The model misclassifies a requirement's force: hard constraint, soft preference, example, background note, exception, or optional guidance.

## Derived from


- M10 Learned Natural-Language Task Induction
- M4 Attention/Position-Mediated Context Integration
- M7 Autoregressive Factorization

## Canonical statement


> The model may infer the wrong normative weight for a contextual requirement.

## Typical expression


- Treats a preference as mandatory
- Treats a mandatory rule as optional
- Drops exceptions
- Ignores "unless" clauses
- Applies an example too broadly
- Violates a constraint while preserving surface style

This is important for policy, contract, workflow, and instruction-heavy tasks.

# RF -- Reasoning and Planning Fault Modes


These derive mainly from:

- **M7 Autoregressive Factorization**
- **M8 Distributional Token Scoring**
- **M10 Learned Natural-Language Task Induction**
- **M11 Transformer Compute Scaling**

## RF1. Error Accumulation

## Definition


Small local errors compound across multi-step reasoning or long generation.

## Derived from


- M7 Autoregressive Factorization
- M8 Distributional Token Scoring

## Canonical statement


> Multi-step generation can compound local mistakes into globally wrong outputs.

## Typical expression


- Early arithmetic error corrupts final answer
- Small assumption becomes major conclusion
- One invalid step propagates
- Multi-step explanation appears coherent but is wrong
- Long reasoning trace contains hidden contradiction

This is the mechanism-derived version of long-horizon reasoning brittleness.

## RF2. Plan Drift

## Definition


The model's generated plan or execution path gradually departs from the original goal, constraints, or state.

## Derived from


- M7 Autoregressive Factorization
- M10 Learned Natural-Language Task Induction
- M11 Transformer Compute Scaling

## Canonical statement


> A generated plan can remain locally reasonable while drifting from the intended objective.

## Typical expression


- Skips prerequisites
- Violates earlier constraints
- Repeats steps
- Changes objective midstream
- Takes action sequence inconsistent with current state
- Optimizes for completion rather than correctness

Difference from GF1:

- GF1 concerns textual generation drift broadly.
- RF2 concerns task/plan trajectory drift.

## RF3. Invariant Loss

## Definition


The model fails to preserve required constraints, assumptions, or invariants across a reasoning chain.

## Derived from


- M3 Finite Ordered Context Interface
- M4 Attention/Position-Mediated Context Integration
- M7 Autoregressive Factorization
- M10 Learned Natural-Language Task Induction

## Canonical statement


> The model may fail to maintain global constraints across a multi-step derivation or plan.

## Typical expression


- Violates budget
- Ignores "do not contact X"
- Drops a safety condition
- Forgets an exception
- Uses inconsistent definitions
- Solves a simplified version of the task

Difference from CF4:

- CF4 is continuity loss across turns/calls.
- RF3 is constraint loss inside reasoning or planning.

## RF4. Spurious Decomposition

## Definition


The model decomposes a task into steps that are plausible but not valid for the actual problem.

## Derived from


- M10 Learned Natural-Language Task Induction
- M7 Autoregressive Factorization
- M8 Distributional Token Scoring

## Canonical statement


> The model may generate a plausible procedure that does not preserve the semantics of the original task.

## Typical expression


- Breaks a problem into irrelevant subtasks
- Uses a familiar template incorrectly
- Applies a standard algorithm where assumptions do not hold
- Produces a plan that cannot achieve the goal
- Confuses explanation structure with solution structure

This is distinct from plan drift. Spurious decomposition is wrong from the start.

# SF -- Structure and Representation Fault Modes


These derive mainly from:

- **M1 Tokenized Representation**
- **M7 Autoregressive Factorization**
- **M8 Distributional Token Scoring**
- **M9 Decoding Path Selection**
- **M10 Learned Natural-Language Task Induction**

## SF1. Exact-String Corruption

## Definition


The model alters strings that should be copied exactly.

## Derived from


- M1 Tokenized Representation
- M7 Autoregressive Factorization
- M8 Distributional Token Scoring

## Canonical statement


> The model is not a deterministic string-copying machine.

## Typical expression


- Corrupted IDs
- Changed account numbers
- Altered legal clauses
- Modified URLs
- Digit transposition
- Missing punctuation
- Wrong casing or escaping

This is one of the clearest Layer 2 faults from tokenized representation.

## SF2. Numeric and Symbolic Fragility

## Definition


The model mishandles numbers, counts, symbolic transformations, or formal operations.

## Derived from


- M1 Tokenized Representation
- M7 Autoregressive Factorization
- M8 Distributional Token Scoring

## Canonical statement


> Token-based sequence generation is not inherently reliable symbolic computation.

## Typical expression


- Wrong arithmetic
- Incorrect counting
- Broken algebraic manipulation
- Character-count errors
- Incorrect sorting
- Weak exact comparison
- Numeric inconsistency across answer sections

This overlaps with reasoning faults, but should be separated when the failure is primarily exact-symbolic.

## SF3. Structured Output Drift

## Definition


The model fails to maintain a required schema, format, or machine-readable contract.

## Derived from


- M7 Autoregressive Factorization
- M8 Distributional Token Scoring
- M9 Decoding Path Selection
- M10 Learned Natural-Language Task Induction

## Canonical statement


> Free-form generation does not inherently obey strict output contracts.

## Typical expression


- Invalid JSON
- Wrong field names
- Extra commentary
- Missing required fields
- Wrong data types
- Broken escaping
- Partial object generation

This maps to the original draft's "structured output fragility," but in this revised ontology it belongs to Layer 2, not Layer 1.

## SF4. Boundary and Stopping Error

## Definition


The model fails to stop, segment, or delimit output exactly as intended.

## Derived from


- M7 Autoregressive Factorization
- M9 Decoding Path Selection
- M10 Learned Natural-Language Task Induction

## Canonical statement


> Generated output boundaries are inferred and decoded, not inherently contract-bound.

## Typical expression


- Adds extra text after required payload
- Stops too early
- Produces incomplete answer
- Continues beyond requested scope
- Mixes explanation with final answer
- Fails to separate sections cleanly

This is a useful separate fault mode because many integrations fail not from wrong content, but from wrong boundaries.

# BF -- Budget and Resource Fault Modes


These derive mainly from:

- **M3 Finite Ordered Context Interface**
- **M11 Transformer Compute Scaling**
- **M7 Autoregressive Factorization**
- **M9 Decoding Path Selection**

## BF1. Truncation-Induced Loss

## Definition


Relevant input, state, evidence, or generated output is lost because of token limits or truncation.

## Derived from


- M3 Finite Ordered Context Interface
- M11 Transformer Compute Scaling

## Canonical statement


> Token limits can remove information needed for correct behavior.

## Typical expression


- Missing earlier instructions
- Incomplete document processing
- Output cut off
- Lost final steps
- Summary omits critical exception
- System silently drops context

This is related to CF1, but BF1 specifically identifies resource pressure as the mechanism-derived mode.

## BF2. Compression-Induced Distortion

## Definition


Information is compressed or summarized in a way that changes, weakens, or omits critical meaning.

## Derived from


- M11 Transformer Compute Scaling
- M3 Finite Ordered Context Interface
- M10 Learned Natural-Language Task Induction

## Canonical statement


> Compression can preserve gist while losing operationally critical detail.

## Typical expression


- Exceptions dropped
- Qualifications removed
- Hard constraints softened
- Source distinctions collapsed
- Uncertainty erased
- "Summary memory" becomes less accurate than original context

This will be important when mapping to memory and summarization system faults later.

## BF3. Budget-Induced Incompleteness

## Definition


The model produces an incomplete or shallow result because the task exceeds practical generation, context, latency, or reasoning budget.

## Derived from


- M11 Transformer Compute Scaling
- M7 Autoregressive Factorization
- M9 Decoding Path Selection

## Canonical statement


> Resource limits constrain how much context can be used, how long generation can continue, and how much checking can be done.

## Typical expression


- Incomplete analysis
- Missed edge cases
- Shortcuts in long tasks
- Partial plan
- Premature answer
- Underexplored alternatives
- Shallow verification language

This remains Layer 2. The Layer 3 system fault might be failing to detect that the task exceeded budget.

# Consolidated Layer 2 taxonomy


|Code|Fault mode|Primary mechanisms|
|---|---|---|
|**CF1**|Context Omission|M3, M6|
|**CF2**|Context Underutilization|M4|
|**CF3**|Context Priority Confusion|M4, M5, M10|
|**CF4**|Continuity Loss|M6, M3|
|**GF1**|Local Plausibility Drift|M7, M8|
|**GF2**|Path Dependence|M7|
|**GF3**|Output Variance|M8, M9|
|**GF4**|Tail-Risk Generation|M8, M9|
|**EF1**|Plausibility-Truth Gap|M7, M8, M2|
|**EF2**|Unsupported Assertion|M2, M7, M8|
|**EF3**|Non-Grounded Justification|M5, M7, M8|
|**EF4**|Weak Confidence Calibration|M8, M9|
|**EF5**|Non-Privileged Self-Evaluation|M7, M8|
|**IF1**|Prompt-Form Sensitivity|M3, M4, M10, M7|
|**IF2**|Task Misinduction|M10, M5, M4|
|**IF3**|Control/Data Confusion|M5, M4, M10|
|**IF4**|Constraint Misclassification|M10, M4, M7|
|**RF1**|Error Accumulation|M7, M8|
|**RF2**|Plan Drift|M7, M10, M11|
|**RF3**|Invariant Loss|M3, M4, M7, M10|
|**RF4**|Spurious Decomposition|M10, M7, M8|
|**SF1**|Exact-String Corruption|M1, M7, M8|
|**SF2**|Numeric and Symbolic Fragility|M1, M7, M8|
|**SF3**|Structured Output Drift|M7, M8, M9, M10|
|**SF4**|Boundary and Stopping Error|M7, M9, M10|
|**BF1**|Truncation-Induced Loss|M3, M11|
|**BF2**|Compression-Induced Distortion|M11, M3, M10|
|**BF3**|Budget-Induced Incompleteness|M11, M7, M9|

# Recommended canonical wording


Layer 2 can be defined as:

> **Mechanism-derived fault modes are recurring behavioral failure patterns that arise from the interaction of LLM mechanisms, before considering whether the surrounding system failed to retrieve, validate, constrain, persist, verify, or monitor appropriately.**

Shorter:

> **Layer 2 describes how LLM mechanisms fail behaviorally; Layer 3 describes how systems fail to bound those behaviors.**

# The clean stack


Use this structure going forward:

```text
Layer 1 — LLM mechanisms
The causal machinery.

Layer 2 — mechanism-derived fault modes
The recurring behavioral failure patterns produced by that machinery.

Layer 3 — system faults
The missing or inadequate controls that allow those fault modes to affect users or downstream systems.
```


Example:

```text
M8 Distributional Token Scoring
    ↓
EF4 Weak Confidence Calibration
    ↓
System fault: product exposes confidence without empirical calibration
```


Example:

```text
M5 In-Band Control/Data Representation
    ↓
IF3 Control/Data Confusion
    ↓
System fault: retrieved documents are injected without isolation or instruction stripping
```


Example:

```text
M7 Autoregressive Factorization
    ↓
RF1 Error Accumulation
    ↓
System fault: multi-step agent has no invariant checks or external verifier
```


So the Layer 2 ontology should be **multi-causal, behavior-focused, and system-neutral**.
