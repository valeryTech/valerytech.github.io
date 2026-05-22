---
draft: false
toc: true
title: "Stack 23 Fault Family Index"
linkTitle: "Stack 23 Fault Family Index"
---
# Layer 2 -- Fault Family Index


Canonical atomic fault definitions live in `stack-21-fault-inventory.md`.

## Purpose


This document defines broad, non-exclusive **fault families** for Layer 2.

Layer 2 contains **feature-derived fault modes**: recurring behavioral failure patterns that arise downstream of Layer 1A base mechanisms, Layer 1B learned or behavioral LLM features, and Layer 1C AI-system-level causal features.

This file does **not** define the canonical atomic fault inventory. Instead, it groups atomic faults into broader families for:

- evaluation planning;
- risk analysis;
- debugging;
- incident review;
- stakeholder communication;
- mapping to Layer 3 controls.

A single observed failure may belong to several families.

This document assumes a compositional AI system rather than an isolated model call. In scope are systems that may include retrieval, memory, tool use, state stores, policy layers, output validators, and orchestration logic.

Example:

```text
A generated legal answer cites a non-existent case with high confidence.

Relevant families:
- FF3 Hallucination and Unsupported Claims
- FF4 Weak Grounding / Source Infidelity
- FF5 Weak Calibration and Misleading Confidence
- FF10 Retrieval-Conditioned Answer Failure, if retrieval was involved
```

## Layer 2 boundary


Layer 2 answers:

> What recurring behavioral failure pattern appeared?

Layer 2 does **not** answer:

> Which Layer 1 feature was the root cause?
> Which system component failed?
> Which user was harmed?
> Which business metric moved?
> Which guardrail should have prevented it?

Those belong downstream.

```text
Layer 1A / 1B / 1C
  causal features and system properties

Layer 2
  behavioral fault modes

Layer 3
  system faults, missing controls, orchestration failures, validation failures

Layer 4
  user, business, legal, safety, trust, compliance, and operational impacts
```


Example:

```text
Layer 1A:
  A5 In-Band Control/Data Representation

Layer 1B:
  B1 Learned Natural-Language Task Induction

Layer 2:
  control/data confusion

Layer 3:
  retrieved document text was not isolated, quoted, filtered, or sandboxed

Layer 4:
  user receives an answer or action shaped by prompt-injection content
```

## Important rule: families are not atomic faults


Fault families are broad views over the fault inventory. They are not intended to be mutually exclusive.

They are also not root causes and not controls.

```text
root causes:
  Layer 1A, Layer 1B, Layer 1C

observed behavioral failure patterns:
  Layer 2 fault families and atomic faults

missing controls, orchestration faults, validator gaps:
  Layer 3
```


The canonical unit should be the **atomic fault mode**, such as:

```text
F02 Context Underutilization
F09 Task Misinduction
F30 Unsupported Assertion
F36 Weak Confidence Calibration
F52 Tool-Argument Error
```


Family codes use `FF` to avoid collision with atomic `F` codes.

```text
F01, F02, F03... = atomic fault modes
FF1, FF2, FF3... = broad fault families
```


A family should answer:

> Which larger class of failure does this incident belong to?

An atomic fault should answer:

> What specific behavioral failure pattern occurred?

## Epistemic boundary: no native world-state or judgment


Layer 2 families should not assume that the model has intrinsic access to:

- world state;
- truth;
- evidence;
- proof validity;
- source authority;
- action correctness;
- policy correctness;
- user intent;
- calibrated confidence;
- safety or compliance judgment.

A model can generate text that appears to express knowledge, judgment, verification, or confidence. But those are generated behaviors unless grounded by external evidence, tools, validators, authorization systems, policies, or other system controls.

Canonical statement:

> The model does not have native access to world state, truth, evidence, proof validity, action correctness, or calibrated judgment. It generates token sequences conditioned on learned parameters and runtime context; reliable grounding, verification, authorization, or judgment must be supplied by context, tools, external checks, or system controls.

Systems consequence:

> If a production system requires certainty, formatting, memory continuity, grounded evidence use, or policy-correct action, those guarantees must come from surrounding architecture. Layer 2 fault families are the behavioral signatures that appear when those guarantees are not supplied or do not hold.

This boundary is especially relevant to:

- FF3 Hallucination and Unsupported Claims
- FF4 Weak Grounding / Source Infidelity
- FF5 Weak Calibration and Misleading Confidence
- FF9 Agentic Process Failure
- FF12 Reasoning / Planning Integrity Failure
- FF14 Safety / Policy Boundary Failure

This boundary is not itself a fault family. It is a causal and epistemic boundary that explains why several Layer 2 fault families exist.

## Family record schema


Each family record should use this structure:

```text
## FFx. Family Name

### Definition
What class of behavioral failures this family covers.

### Core question
The diagnostic question this family helps answer.

### Includes
Common manifestations or subcases.

### Typical atomic faults
Representative atomic faults from `stack-21-fault-inventory.md`.

### Primary Layer 1A contributors
Base architectural or inference mechanisms that often contribute.

### Primary Layer 1B contributors
Learned or behavioral features that often contribute.

### Typical evaluation methods
How this family is usually detected or measured.

### Typical Layer 3 controls
System controls that often mitigate this family.

### Common engineering trap
What teams often misdiagnose about this family.

### Evaluation emphasis
What to instrument or measure directly.

### Systems note
The architectural lesson this family reinforces.

### Architectural boundary note
How this family maps to one or more architectural boundaries.

### Boundary notes
What not to confuse this family with.

### Common overlaps
Other families commonly co-tagged with this family.
```

## Master family table


| Code | Family | Core question |
|---|---|---|
| FF1 | Behavioral Instability | Does behavior vary unacceptably across repeated or equivalent scenarios? |
| FF2 | Task / Instruction Misinduction | Did the model infer or follow the wrong task contract? |
| FF3 | Hallucination and Unsupported Claims | Did the model produce false, invented, or unsupported claims? |
| FF4 | Weak Grounding / Source Infidelity | Did the model fail to faithfully use available evidence or approved sources? |
| FF5 | Weak Calibration and Misleading Confidence | Did confidence or self-assessment misrepresent reliability? |
| FF6 | Output Contract / Schema Drift | Did the output violate required format, schema, boundary, or structure? |
| FF7 | Interaction / Experience Inconsistency | Did assistant behavior vary in tone, refusal, clarification, or UX-relevant style? |
| FF8 | Distributional Competence Failure | Did performance collapse on a domain, language, format, edge case, or slice? |
| FF9 | Agentic Process Failure | Did planning, tool use, action selection, or recovery fail? |
| FF10 | Retrieval-Conditioned Answer Failure | Did the answer fail under retrieved or supplied evidence conditions? |
| FF11 | Context Availability / Continuity Failure | Did required state, prior context, memory, or continuity fail to carry through? |
| FF12 | Reasoning / Planning Integrity Failure | Did multi-step reasoning lose constraints, accumulate errors, or close prematurely? |
| FF13 | Representation / Symbolic Integrity Failure | Did the model corrupt exact strings, numbers, identifiers, code, tables, or structured values? |
| FF14 | Safety / Policy Boundary Failure | Did the model over-comply, under-refuse, leak sensitive information, or misapply policy? |
| FF15 | Resource / Budget-Induced Degradation | Did token, latency, context, cost, or compute pressure degrade behavior? |

## Architectural boundary mapping


This is a secondary, many-to-many view over `FF1-FF15`. It does not replace the canonical index order. Its purpose is to show where failures become diagnosable in the system architecture and which Layer 3 control surface usually has to absorb them.

### Boundary summary table


| Boundary | What crosses this boundary | Typical Layer 2 families | Main Layer 3 control surface |
|---|---|---|---|
| Interface and contract | natural-language intent into hard task, schema, UX, and symbolic contracts | FF2, FF6, FF7, FF13, FF14 | typed specs, constrained decoding, parsers, validators, explicit behavior rules |
| Knowledge and grounding | model prior into evidence-backed claims, retrieval, citations, and confidence claims | FF3, FF4, FF5, FF10, FF11, FF12, FF14 | retrieval instrumentation, citation support, claim checking, abstention, source-priority controls |
| State, process, and action | planning, memory, tool use, workflow state, and external action execution | FF1, FF9, FF10, FF11, FF12, FF13, FF15 | state stores, checkpoints, tool validators, loop detection, action gates |
| Policy, reliability, and operating envelope | deployability constraints such as stability, competence limits, safety, and budget | FF1, FF5, FF7, FF8, FF10, FF11, FF14, FF15 | routing, policy engines, approval gates, slice monitoring, budget-aware orchestration |

### Family x boundary matrix


`Primary` means the family most naturally manifests at that architectural boundary. `Secondary` means the family commonly crosses into that boundary in real systems.

| Family | Interface / contract | Knowledge / grounding | State / process / action | Policy / reliability / envelope |
|---|---|---|---|---|
| FF1 Behavioral Instability |  |  | Secondary | Primary |
| FF2 Task / Instruction Misinduction | Primary |  | Secondary |  |
| FF3 Hallucination and Unsupported Claims |  | Primary |  | Secondary |
| FF4 Weak Grounding / Source Infidelity |  | Primary | Secondary |  |
| FF5 Weak Calibration and Misleading Confidence |  | Primary |  | Secondary |
| FF6 Output Contract / Schema Drift | Primary |  |  | Secondary |
| FF7 Interaction / Experience Inconsistency | Primary |  |  | Secondary |
| FF8 Distributional Competence Failure |  | Secondary |  | Primary |
| FF9 Agentic Process Failure | Secondary |  | Primary | Secondary |
| FF10 Retrieval-Conditioned Answer Failure |  | Primary | Secondary | Secondary |
| FF11 Context Availability / Continuity Failure |  | Secondary | Primary | Secondary |
| FF12 Reasoning / Planning Integrity Failure |  | Secondary | Primary |  |
| FF13 Representation / Symbolic Integrity Failure | Primary |  | Secondary | Secondary |
| FF14 Safety / Policy Boundary Failure | Secondary | Secondary | Secondary | Primary |
| FF15 Resource / Budget-Induced Degradation |  |  | Secondary | Primary |

### 1. Interface and Contract Boundary


This boundary covers places where probabilistic generation must satisfy deterministic expectations: task interpretation, output format, UX behavior, and exact symbolic fidelity.

Common families:

- FF2 Task / Instruction Misinduction
- FF6 Output Contract / Schema Drift
- FF7 Interaction / Experience Inconsistency
- FF13 Representation / Symbolic Integrity Failure
- FF14 Safety / Policy Boundary Failure
- FF9 Agentic Process Failure, when tool arguments or action contracts are malformed

Common engineering trap:

- treating natural-language compliance as if it were already a typed contract.

Evaluation focus:

- task-contract tests;
- parser and schema validation;
- UX and refusal consistency review;
- exact-field and symbolic checks.

Typical Layer 3 mitigation style:

- typed task specs;
- explicit instruction hierarchy;
- constrained decoding;
- deterministic parsers;
- schema validators;
- exact-value handling outside free text.

### 2. Knowledge and Grounding Boundary


This boundary covers places where the system must inject, preserve, prioritize, and verify evidence against the model's parametric prior.

Common families:

- FF3 Hallucination and Unsupported Claims
- FF4 Weak Grounding / Source Infidelity
- FF5 Weak Calibration and Misleading Confidence
- FF10 Retrieval-Conditioned Answer Failure
- FF11 Context Availability / Continuity Failure, when missing or stale state behaves like missing evidence
- FF12 Reasoning / Planning Integrity Failure, when unsupported intermediate beliefs drive the answer
- FF14 Safety / Policy Boundary Failure, when authority or source confusion affects policy application

Common engineering trap:

- collapsing retrieval quality, grounding fidelity, truth, and confidence into one undifferentiated "accuracy" metric.

Evaluation focus:

- factuality;
- source-faithfulness;
- citation support;
- retrieval coverage;
- stale or noisy context sensitivity;
- calibration quality.

Typical Layer 3 mitigation style:

- retrieval traces;
- citation validation;
- source-priority rules;
- claim-level verification;
- abstention;
- answer generation constrained by approved evidence.

### 3. State, Process, and Action Boundary


This boundary covers long-horizon execution: memory continuity, multi-step planning, tool use, recovery, and actions that depend on process correctness rather than only final text quality.

Common families:

- FF9 Agentic Process Failure
- FF11 Context Availability / Continuity Failure
- FF12 Reasoning / Planning Integrity Failure
- FF15 Resource / Budget-Induced Degradation
- FF1 Behavioral Instability, when repeated runs change process behavior
- FF10 Retrieval-Conditioned Answer Failure, when retrieval is a runtime workflow stage
- FF13 Representation / Symbolic Integrity Failure, when exact tool arguments or IDs matter

Common engineering trap:

- judging multi-step systems only by the final answer and ignoring tool traces, state carryover, or recovery behavior.

Evaluation focus:

- trace review;
- state carryover tests;
- tool-call correctness;
- step efficiency;
- stopping behavior;
- recovery quality.

Typical Layer 3 mitigation style:

- external state stores;
- memory rehydration;
- checkpoints;
- tool schemas and validators;
- loop detection;
- action authorization;
- transaction boundaries.

### 4. Policy, Reliability, and Operating-Envelope Boundary


This boundary covers whether the system is stable and governable enough to operate under real deployment constraints such as safety requirements, competence cliffs, and budget pressure.

Common families:

- FF1 Behavioral Instability
- FF8 Distributional Competence Failure
- FF14 Safety / Policy Boundary Failure
- FF15 Resource / Budget-Induced Degradation
- FF5 Weak Calibration and Misleading Confidence
- FF7 Interaction / Experience Inconsistency
- FF10 Retrieval-Conditioned Answer Failure, when freshness, coverage, or noise is environment-sensitive
- FF11 Context Availability / Continuity Failure, when continuity collapses under scale, truncation, or deployment conditions

Common engineering trap:

- treating deployment instability as a model-only issue when routing, policy, freshness, latency, and budget decisions are often the real operating boundary.

Evaluation focus:

- repeated-run evaluation;
- slice-based testing;
- policy and red-team evals;
- latency and budget ablations;
- regression monitoring across versions and environments.

Typical Layer 3 mitigation style:

- budget-aware routing;
- specialist routing;
- policy engines;
- approval gates;
- environment and version tracking;
- slice monitoring;
- fallback policies.

# FF1. Behavioral Instability

## Definition


Failures where behavior changes materially across repeated runs or reasonable variations that should preserve the same intended outcome.

This family covers both:

```text
same scenario -> materially different behavior
```


and:

```text
semantically equivalent scenario -> materially different behavior
```


Surface wording variation is not itself a failure. The failure is variation in material behavior.

## Core question


> Does the system preserve acceptable behavior across repeated runs and realistic variation?

## Includes


- true non-determinism;
- repeatability variance;
- behavioral fragility;
- prompt perturbation failures;
- refusal or escalation instability;
- unstable tool use;
- unstable citations or evidence selection;
- tail-risk generation;
- rare but severe outputs.

## Typical atomic faults


- Output variance
- Tail-risk generation
- Prompt-form sensitivity
- Behavioral fragility
- Tool-selection instability
- Refusal / escalation instability

## Primary Layer 1A contributors


- A7 Autoregressive Factorization
- A8 Distributional Token Scoring
- A9 Decoding Path Selection
- A4 Attention/Position-Mediated Context Integration
- A10 Transformer Compute Scaling

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B2 In-Context Demonstration Conditioning
- B3 Natural-Language Interface Sensitivity
- B4 Plural Valid-Output Space
- B5 Learned Interaction-Style and Persona Priors

## Typical evaluation methods


- repeated-run testing;
- paraphrase / perturbation testing;
- scenario invariance checks;
- behavioral-equivalence scoring;
- tail-risk sampling;
- refusal / escalation consistency tests;
- tool-call consistency tests.

## Typical Layer 3 controls


- deterministic decoding where appropriate;
- constrained output contracts;
- robust task contracts;
- scenario-level regression tests;
- repeated-run acceptance thresholds;
- routing stabilization;
- tool-call policies;
- fallback and escalation rules.

## Common engineering trap


The main trap is assuming that one successful run proves reliability. A single successful demo only shows that the system worked once. Reliability requires repeated-run evaluation and semantically equivalent scenario variation at the intended-outcome level.

## Evaluation emphasis


Measure behavioral preservation across repeats and realistic variations, not just exact text matching. Outcome-level repeatability, refusal stability, tool-call consistency, and tail-risk rates matter more than a single golden output.

## Architectural boundary note


FF1 belongs primarily to the policy, reliability, and operating-envelope boundary because it is a deployability question. It also crosses into the state, process, and action boundary when repeated runs change tool choices, recovery behavior, or external actions.

## Boundary notes


Do not classify normal wording variation as FF1 unless it changes the intended outcome.

Acceptable variation may include:

- different wording;
- different sentence order;
- equivalent explanations;
- harmless formatting variation.

Material variation may include:

- different classification;
- different risk level;
- different refusal or escalation decision;
- different tool call;
- different citation or evidence base;
- different external action.

## Common overlaps


- FF2 Task / Instruction Misinduction
- FF7 Interaction / Experience Inconsistency
- FF8 Distributional Competence Failure
- FF9 Agentic Process Failure
- FF15 Resource / Budget-Induced Degradation

# FF2. Task / Instruction Misinduction

## Definition


Failures where the model infers, blends, narrows, expands, or applies the wrong task contract.

The model may appear responsive while performing a different operation than the one intended.

## Core question


> Did the model infer and follow the intended task, scope, constraints, and success criteria?

## Includes


- task misinduction;
- task blending;
- scope misinterpretation;
- answering a nearby question;
- treating examples as the required output;
- treating soft preferences as hard constraints;
- treating hard constraints as optional;
- confusing background notes with requirements;
- overfitting to examples;
- underusing examples;
- following apparent genre instead of operational requirement;
- control/data confusion when instructions and data are mixed.

## Typical atomic faults


- Task misinduction
- Task blending
- Scope misinterpretation
- Constraint misclassification
- Example overgeneralization
- Example underuse
- Control/data confusion
- Prompt-form sensitivity

## Primary Layer 1A contributors


- A3 Finite Ordered Context Interface
- A4 Attention/Position-Mediated Context Integration
- A5 In-Band Control/Data Representation
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B2 In-Context Demonstration Conditioning
- B3 Natural-Language Interface Sensitivity
- B4 Plural Valid-Output Space

## Typical evaluation methods


- task-contract tests;
- paraphrase tests;
- instruction hierarchy tests;
- constraint preservation tests;
- example generalization tests;
- adversarial prompt-role tests;
- typed expected-operation checks.

## Typical Layer 3 controls


- typed task contracts;
- explicit instruction hierarchy;
- prompt assembly rules;
- schema-backed task specs;
- validators for mandatory constraints;
- example set design;
- source and role isolation;
- routing separate from free-form task induction.

## Systems note


FF2 is the natural-language contract boundary. It appears when a soft, learned interface is asked to satisfy a hard operational contract without enough structure, hierarchy, or role isolation.

## Boundary notes


FF2 is not merely a bad answer. It is a bad answer caused by wrong task interpretation or wrong instruction application.

If the model understood the task but generated a false claim, use FF3 or FF4.

If the model understood the task but failed output format, use FF6.

## Common overlaps


- FF1 Behavioral Instability
- FF6 Output Contract / Schema Drift
- FF10 Retrieval-Conditioned Answer Failure
- FF14 Safety / Policy Boundary Failure

# FF3. Hallucination and Unsupported Claims

## Definition


Failures where generated claims are false, invented, unsupported, or merely plausible.

This family covers both truth failures and support failures.

## Core question


> Did the model generate a claim that is false, invented, unsupported, or not justified by the available evidence?

## Includes


- fluent false answer;
- unsupported factual assertion;
- invented names, dates, entities, rules, or numbers;
- fabricated citation;
- fabricated source;
- common misconception repeated;
- generic but incorrect explanation;
- parametric prior overriding evidence;
- plausible but unverified background assumption.

## Typical atomic faults


- Plausibility-truth gap
- Unsupported assertion
- Fabricated citation or source
- Parametric-prior override
- Evidence-claim mismatch
- Non-grounded justification

## Primary Layer 1A contributors


- A2 Static Parametric Learned Prior
- A3 Finite Ordered Context Interface
- A4 Attention/Position-Mediated Context Integration
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring
- A9 Decoding Path Selection

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B4 Plural Valid-Output Space
- B6 Generated Self-Assessment and Confidence Language
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- factuality checks;
- grounding checks;
- source verification;
- citation validation;
- evidence entailment checks;
- claim extraction and verification;
- human expert review for high-stakes domains.

## Typical Layer 3 controls


- retrieval grounding;
- mandatory citations;
- citation validation;
- source allowlists;
- abstention rules;
- claim-level verification;
- tool-based fact checking;
- answer generation only from approved evidence;
- human review gates.

## Systems note


FF3 is not a special exception to otherwise truth-tracking generation. It is the expected failure surface when plausible continuation is mistaken for truth, support, or verified knowledge.

## Boundary notes


Falsehood and lack of support are different.

```text
False but supported by bad source:
  likely FF3 + FF4 + Layer 3 source-quality issue

True but unsupported in supplied context:
  FF3 or FF4 depending on task requirement

Source exists but does not support claim:
  FF4 and evidence-claim mismatch

High confidence in false claim:
  FF3 + FF5
```


This family is downstream of the no-native-world-state boundary. Plausible generated text is not inherently true.

## Common overlaps


- FF4 Weak Grounding / Source Infidelity
- FF5 Weak Calibration and Misleading Confidence
- FF8 Distributional Competence Failure
- FF10 Retrieval-Conditioned Answer Failure
- FF12 Reasoning / Planning Integrity Failure

# FF4. Weak Grounding / Source Infidelity

## Definition


Failures where the model does not faithfully use, preserve, cite, or reason from supplied evidence or approved sources.

The evidence may be present, but the answer is not properly grounded in it.

## Core question


> Did the answer faithfully use and preserve the relevant evidence?

## Includes


- evidence ignored;
- evidence underused;
- source misread;
- source priority confusion;
- evidence-claim mismatch;
- citation does not support claim;
- retrieved fact mixed with learned prior assumption;
- quoted text paraphrased incorrectly;
- source caveat omitted;
- context span cited but key detail missed.

## Typical atomic faults


- Context underutilization
- Context priority confusion
- Unsupported assertion
- Non-grounded justification
- Evidence-claim mismatch
- Parametric-prior override
- Source / authority confusion

## Primary Layer 1A contributors


- A2 Static Parametric Learned Prior
- A3 Finite Ordered Context Interface
- A4 Attention/Position-Mediated Context Integration
- A5 In-Band Control/Data Representation
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B3 Natural-Language Interface Sensitivity
- B6 Generated Self-Assessment and Confidence Language
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- evidence entailment checks;
- citation-support checks;
- source-faithfulness evaluation;
- retrieval-context ablation;
- distractor-context tests;
- source priority tests;
- answer-vs-source span comparison.

## Typical Layer 3 controls


- source ranking;
- source priority rules;
- quote-and-answer patterns;
- citation validators;
- retrieval evidence packaging;
- context chunk labeling;
- source metadata;
- answer abstention when evidence is weak;
- post-generation source support check.

## Evaluation emphasis


Measure source-faithfulness separately from retrieval quality. Teams should explicitly test whether the model uses present evidence correctly, whether it preserves source caveats, and how behavior changes when evidence is missing, stale, noisy, or reordered.

## Boundary notes


Bad retrieval itself is usually Layer 3.

Layer 2 concerns the model's answer behavior under the evidence condition:

```text
Layer 3:
  retriever failed to include the right document

Layer 2:
  model ignored or overruled the right document that was present
```


If evidence is absent, consider FF10 or FF11. If evidence is present but unused or distorted, use FF4.

## Common overlaps


- FF3 Hallucination and Unsupported Claims
- FF5 Weak Calibration and Misleading Confidence
- FF10 Retrieval-Conditioned Answer Failure
- FF11 Context Availability / Continuity Failure

# FF5. Weak Calibration and Misleading Confidence

## Definition


Failures where the model's expressed confidence, uncertainty, self-assessment, or verification language does not track actual reliability.

## Core question


> Did the system communicate confidence, uncertainty, verification, or self-assessment in a misleading way?

## Includes


- high-confidence wrong answer;
- over-hedged correct answer;
- unjustified certainty;
- false claim of checking;
- unreliable self-critique;
- numeric confidence score not predictive of accuracy;
- self-correction without independent basis;
- answer framed as verified when it is not;
- fluent tone mistaken for reliability.

## Typical atomic faults


- Weak confidence calibration
- Non-privileged self-evaluation
- Unsupported assertion
- Non-grounded justification
- Plausibility-truth gap

## Primary Layer 1A contributors


- A2 Static Parametric Learned Prior
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring
- A9 Decoding Path Selection

## Primary Layer 1B contributors


- B5 Learned Interaction-Style and Persona Priors
- B6 Generated Self-Assessment and Confidence Language
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- calibration curves;
- confidence-vs-accuracy measurement;
- self-check reliability tests;
- uncertainty expression evaluation;
- high-stakes claim review;
- false-verification detection;
- abstention quality tests.

## Typical Layer 3 controls


- external verification;
- calibrated confidence models;
- uncertainty policies;
- abstention thresholds;
- source-support gates;
- expert review;
- tool-based checking;
- UI separation between generated answer and verified status.

## Systems note


Confidence language is interface behavior generated from token likelihoods and learned style, not native calibrated certainty. Systems should treat confidence as a claim to validate, not as privileged evidence.

## Architectural boundary note


FF5 belongs primarily to the knowledge and grounding boundary because confidence language is often mistaken for evidence or verification. It also crosses into the policy, reliability, and operating-envelope boundary because misleading confidence changes trust, escalation, and action thresholds.

## Boundary notes


Confidence language is generated behavior. It is not native calibrated judgment.

This family is not the same as factual incorrectness. A factual error belongs to FF3. Misleading certainty about that error belongs here.

## Common overlaps


- FF3 Hallucination and Unsupported Claims
- FF4 Weak Grounding / Source Infidelity
- FF7 Interaction / Experience Inconsistency
- FF8 Distributional Competence Failure
- FF14 Safety / Policy Boundary Failure

# FF6. Output Contract / Schema Drift

## Definition


Failures where output violates the required form, structure, schema, boundary, parser expectation, or output contract.

## Core question


> Did the model preserve the required output contract?

## Includes


- invalid JSON;
- malformed XML/YAML/CSV;
- wrong schema;
- missing required fields;
- extra fields;
- extra commentary;
- markdown when plain text was required;
- plain text when structured output was required;
- table malformed;
- output stops too early;
- output continues too long;
- answer mixed with internal or explanatory text;
- wrong mode: explanation instead of extraction, summary instead of classification.

## Typical atomic faults


- Output-format drift
- Structured output drift
- Boundary / stopping error
- Structured-data semantic error
- Exact-string corruption
- Numeric / symbolic fragility
- Task misinduction
- Constraint misclassification

## Primary Layer 1A contributors


- A1 Tokenized Representation
- A5 In-Band Control/Data Representation
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring
- A9 Decoding Path Selection
- A10 Transformer Compute Scaling

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B2 In-Context Demonstration Conditioning
- B3 Natural-Language Interface Sensitivity
- B4 Plural Valid-Output Space

## Typical evaluation methods


- parser validation;
- schema validation;
- exact-match checks where appropriate;
- field-level semantic validation;
- constrained-output tests;
- malformed-output rate tracking;
- round-trip serialization tests.

## Typical Layer 3 controls


- typed schemas;
- constrained decoding;
- structured output APIs;
- validators;
- repair loops;
- retry-on-parse-failure;
- field-level post-processing;
- contract tests;
- deterministic symbolic tools for exact transformations.

## Systems note


Deterministic output contracts should not be delegated to unconstrained free-form generation without schema enforcement, parser validation, and repair or retry logic.

## Boundary notes


FF6 concerns output contracts. If the output is syntactically valid but factually false, use FF3 or FF4. If it violates safety policy, use FF14.

Output format drift can be caused by task misinduction, but the family focuses on the output object itself.

## Common overlaps


- FF2 Task / Instruction Misinduction
- FF13 Representation / Symbolic Integrity Failure
- FF15 Resource / Budget-Induced Degradation

# FF7. Interaction / Experience Inconsistency

## Definition


Failures where assistant behavior violates expected product interaction patterns, even when the answer may be technically correct.

## Core question


> Did the assistant behave consistently with the intended user experience, role, tone, escalation policy, and interaction contract?

## Includes


- tone inconsistency;
- verbosity mismatch;
- excessive hedging;
- insufficient caution;
- unnecessary clarification questions;
- failure to ask necessary clarification questions;
- inconsistent refusal behavior;
- inconsistent escalation behavior;
- sycophantic agreement;
- over-answering simple questions;
- exposing implementation details;
- excessive apologies;
- unexpected persona shift;
- style inconsistent with the product or domain.

## Typical atomic faults


- Clarification failure
- Tone / persona inconsistency
- Verbosity mismatch
- Sycophantic agreement
- Over-refusal
- Under-refusal
- Inconsistent escalation
- Implementation-disclosure behavior

## Primary Layer 1A contributors


- A2 Static Parametric Learned Prior
- A4 Attention/Position-Mediated Context Integration
- A5 In-Band Control/Data Representation
- A8 Distributional Token Scoring
- A9 Decoding Path Selection

## Primary Layer 1B contributors


- B3 Natural-Language Interface Sensitivity
- B4 Plural Valid-Output Space
- B5 Learned Interaction-Style and Persona Priors
- B6 Generated Self-Assessment and Confidence Language
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- product-behavior rubric scoring;
- conversation-level review;
- refusal / escalation consistency tests;
- tone and style evaluation;
- clarification policy tests;
- user-experience regression tests;
- side-by-side preference review.

## Typical Layer 3 controls


- product behavior spec;
- tone and style guide;
- refusal and escalation policy;
- clarification policy;
- response templates;
- conversation-state rules;
- post-generation classifiers;
- human review for sensitive interactions.

## Boundary notes


A poor user experience is not always a factual fault. It may involve correct content delivered with wrong tone, length, timing, or interaction behavior.

If the issue is unsafe policy compliance, use FF14 as well.

## Common overlaps


- FF1 Behavioral Instability
- FF5 Weak Calibration and Misleading Confidence
- FF14 Safety / Policy Boundary Failure
- FF15 Resource / Budget-Induced Degradation

# FF8. Distributional Competence Failure

## Definition


Failures where model performance degrades sharply on particular domains, languages, formats, populations, edge cases, rare entities, or task framings.

## Core question


> Did the system fail because the task instance fell outside the model's reliable competence distribution?

## Includes


- domain competence cliff;
- rare-format brittleness;
- multilingual degradation;
- dialect or register failure;
- long-tail entity failure;
- rare symbol or identifier failure;
- weak performance on specialized domains;
- failure on adversarial or edge cases;
- benchmark/product mismatch;
- familiar pattern applied outside its valid domain;
- overgeneralization from common cases.

## Typical atomic faults


- Competence cliff
- Distributional overgeneralization
- Rare-format brittleness
- Symbolic task weakness
- Parametric-prior override
- Weak confidence calibration
- Plausibility-truth gap

## Primary Layer 1A contributors


- A1 Tokenized Representation
- A2 Static Parametric Learned Prior
- A4 Attention/Position-Mediated Context Integration
- A8 Distributional Token Scoring
- A10 Transformer Compute Scaling

## Primary Layer 1B contributors


- B3 Natural-Language Interface Sensitivity
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- slice-based evaluation;
- domain-specific evals;
- multilingual evals;
- rare-format tests;
- edge-case suites;
- adversarial tests;
- long-tail entity tests;
- stratified benchmark analysis.

## Typical Layer 3 controls


- routing to specialist models or tools;
- domain-specific retrieval;
- expert review;
- abstention policies;
- narrower product scope;
- slice-specific monitoring;
- targeted test coverage;
- symbolic tools for symbolic tasks.

## Boundary notes


Do not use FF8 for every error. Use it when the error pattern is tied to a domain, format, language, distributional slice, rare pattern, or edge case.

## Common overlaps


- FF1 Behavioral Instability
- FF3 Hallucination and Unsupported Claims
- FF5 Weak Calibration and Misleading Confidence
- FF13 Representation / Symbolic Integrity Failure
- FF15 Resource / Budget-Induced Degradation

# FF9. Agentic Process Failure

## Definition


Failures in multi-step task execution, tool use, action selection, action justification, or recovery.

This family covers model behavior in agentic systems, where success depends on process, not just final output text.

## Core question


> Did planning, tool use, action selection, or recovery fail?

## Includes


- wrong tool choice;
- missing needed tool call;
- unnecessary tool call;
- wrong tool arguments;
- malformed tool arguments;
- tool-output misinterpretation;
- skipped step;
- unnecessary step;
- loop;
- premature stopping;
- failure to recover;
- unsafe action;
- action without adequate basis;
- action despite missing authorization;
- plan not updated after new evidence.

## Typical atomic faults


- Tool-selection error
- Tool-argument error
- Tool-output misinterpretation
- Action-readiness error
- Recovery failure
- Plan drift
- Premature closure
- Looping / repetition
- Invariant loss

## Primary Layer 1A contributors


- A3 Finite Ordered Context Interface
- A4 Attention/Position-Mediated Context Integration
- A5 In-Band Control/Data Representation
- A6 Stateless Invocation
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring
- A9 Decoding Path Selection
- A10 Transformer Compute Scaling

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B2 In-Context Demonstration Conditioning
- B3 Natural-Language Interface Sensitivity
- B5 Learned Interaction-Style and Persona Priors
- B6 Generated Self-Assessment and Confidence Language
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- agent trace evaluation;
- tool-call correctness tests;
- process-quality scoring;
- task-completion evaluation;
- recovery tests;
- action safety tests;
- step efficiency metrics;
- multi-turn scenario evaluation.

## Typical Layer 3 controls


- typed tool schemas;
- tool routing policies;
- argument validators;
- action authorization;
- human approval gates;
- tool-output schemas;
- planning checkpoints;
- recovery policies;
- loop detection;
- transaction boundaries;
- audit logs.

## Evaluation emphasis


Evaluate process quality directly, not only end-task success. Measure tool choice, argument correctness, step efficiency, stopping behavior, recovery quality, and whether the plan updates after new evidence or failure.

## Boundary notes


A bad final answer in an agentic workflow may be FF9, but only if the process failed.

If the tool retrieved bad data, that may be Layer 3. If the model misread tool output, that is Layer 2 and belongs here.

## Common overlaps


- FF12 Reasoning / Planning Integrity Failure
- FF13 Representation / Symbolic Integrity Failure
- FF14 Safety / Policy Boundary Failure
- FF15 Resource / Budget-Induced Degradation

# FF10. Retrieval-Conditioned Answer Failure

## Definition


Failures where the final answer is degraded by the retrieved or supplied evidence condition.

This includes failures caused by missing, stale, noisy, incomplete, ignored, misused, or overruled retrieval context.

## Core question


> Did the answer fail because of how retrieved or supplied evidence affected generation?

## Includes


- missing evidence;
- stale evidence;
- irrelevant distractor evidence;
- incomplete context;
- retrieval dilution;
- evidence ignored;
- evidence overruled by parametric prior;
- retrieved evidence misquoted;
- weak citation support;
- wrong source prioritized;
- answer mixes source facts with unsupported assumptions.

## Typical atomic faults


- Context omission
- Context underutilization
- Context priority confusion
- Distractor assimilation
- Source / authority confusion
- Evidence-claim mismatch
- Parametric-prior override
- Unsupported assertion
- Non-grounded justification

## Primary Layer 1A contributors


- A2 Static Parametric Learned Prior
- A3 Finite Ordered Context Interface
- A4 Attention/Position-Mediated Context Integration
- A5 In-Band Control/Data Representation
- A8 Distributional Token Scoring
- A10 Transformer Compute Scaling

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B3 Natural-Language Interface Sensitivity
- B6 Generated Self-Assessment and Confidence Language
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- retrieval-quality evaluation;
- answer-faithfulness evaluation;
- citation-support checks;
- context ablation tests;
- distractor insertion tests;
- stale-context tests;
- source priority tests;
- end-to-end RAG evaluation.

## Typical Layer 3 controls


- retriever evaluation;
- reranking;
- source freshness checks;
- chunking strategy;
- source metadata;
- context packing;
- evidence quoting;
- citation validators;
- abstention when evidence missing;
- retrieval trace capture.

## Evaluation emphasis


End-to-end RAG quality should explicitly measure retrieval coverage, answer faithfulness, citation support, and sensitivity to missing, stale, noisy, or distractor context. Passing a retrieval benchmark alone does not establish answer correctness.

## Architectural boundary note


FF10 belongs primarily to the knowledge and grounding boundary because it concerns how evidence conditions the answer. It also crosses into the state, process, and action boundary because retrieval is a runtime pipeline stage, and into the policy, reliability, and operating-envelope boundary when freshness, noise, or environment drift drives the failure.

## Boundary notes


Bad retrieval itself is usually Layer 3. This family covers the Layer 2 answer behavior under retrieval conditions.

Examples:

```text
Layer 3:
  retriever selected stale document

Layer 2:
  model treated stale document as current and produced wrong answer
```

```text
Layer 3:
  reranker put irrelevant chunks first

Layer 2:
  model overused irrelevant distractor evidence
```

## Common overlaps


- FF3 Hallucination and Unsupported Claims
- FF4 Weak Grounding / Source Infidelity
- FF11 Context Availability / Continuity Failure
- FF15 Resource / Budget-Induced Degradation

# FF11. Context Availability / Continuity Failure

## Definition


Failures where required runtime context, prior state, memory, conversation history, tool history, workflow state, or continuity information is absent, stale, truncated, or inconsistently represented.

## Core question


> Did the model lack or lose the context needed to behave consistently across the task, conversation, workflow, or session?

## Includes


- context omission;
- continuity loss;
- stale-state reliance;
- forgotten prior decision;
- lost user preference;
- lost tool result;
- lost workflow state;
- missing conversation history;
- prior approval or denial forgotten;
- stale memory treated as current;
- summary omitted critical detail;
- state not reintroduced into current context.

## Typical atomic faults


- Context omission
- Continuity loss
- Stale-state reliance
- Truncation-induced loss
- Compression-induced distortion
- Context priority confusion

## Primary Layer 1A contributors


- A3 Finite Ordered Context Interface
- A4 Attention/Position-Mediated Context Integration
- A6 Stateless Invocation
- A10 Transformer Compute Scaling

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B3 Natural-Language Interface Sensitivity
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- long-conversation tests;
- state carryover tests;
- memory consistency tests;
- multi-call workflow tests;
- summarization-loss tests;
- tool-history rehydration tests;
- stale-state adversarial tests.

## Typical Layer 3 controls


- state persistence;
- memory rehydration;
- conversation summarization checks;
- explicit state stores;
- tool-result persistence;
- context assembly audits;
- recency markers;
- state freshness policies;
- long-task checkpoints.

## Architectural boundary note


FF11 belongs primarily to the state, process, and action boundary because it is about continuity across turns, calls, sessions, or workflow steps. It also crosses into the knowledge and grounding boundary when missing or stale state behaves like missing evidence, and into the policy, reliability, and operating-envelope boundary when truncation or scale makes continuity collapse operationally.

## Boundary notes


FF11 is broader than retrieval. Retrieval concerns external or document evidence. Continuity concerns preserving the state needed for a task or relationship across time.

If the issue is specifically external evidence retrieval, use FF10 as well.

## Common overlaps


- FF10 Retrieval-Conditioned Answer Failure
- FF12 Reasoning / Planning Integrity Failure
- FF15 Resource / Budget-Induced Degradation

# FF12. Reasoning / Planning Integrity Failure

## Definition


Failures where multi-step reasoning, decomposition, planning, or analysis loses correctness, constraints, or coherence over time.

This family applies even when no tools or external actions are involved.

## Core question


> Did the reasoning or plan preserve correctness, constraints, and state across steps?

## Includes


- local plausibility drift;
- path dependence;
- error accumulation;
- invariant loss;
- plan drift;
- spurious decomposition;
- premature closure;
- invalid inference;
- circular reasoning;
- incorrect intermediate assumption;
- failure to revise after contradiction;
- answer finalization before enough evidence;
- superficially coherent but invalid chain.

## Typical atomic faults


- Local plausibility drift
- Path dependence
- Error accumulation
- Invariant loss
- Plan drift
- Spurious decomposition
- Premature closure
- Numeric / symbolic fragility
- Non-privileged self-evaluation

## Primary Layer 1A contributors


- A2 Static Parametric Learned Prior
- A4 Attention/Position-Mediated Context Integration
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring
- A9 Decoding Path Selection
- A10 Transformer Compute Scaling

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B4 Plural Valid-Output Space
- B6 Generated Self-Assessment and Confidence Language
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- step-level reasoning evaluation;
- invariant checks;
- mathematical / symbolic tests;
- process trace review;
- contradiction tests;
- decomposition quality tests;
- final-answer plus intermediate-state evaluation;
- adversarial multi-step tasks.

## Typical Layer 3 controls


- step-level validators;
- external solvers;
- calculators;
- theorem provers or symbolic tools where appropriate;
- plan checkpoints;
- state tracking;
- human review;
- answer verification;
- decomposition templates;
- stop-and-check policies.

## Systems note


Generated reasoning is not proof. Where correctness matters, the reasoning trace is another artifact to validate with external checks, symbolic tools, or independent verification.

## Boundary notes


Do not treat generated reasoning as proof. Reasoning text may be fluent, but it still requires independent validation where correctness matters.

If tools or actions are involved, also consider FF9.

## Common overlaps


- FF3 Hallucination and Unsupported Claims
- FF5 Weak Calibration and Misleading Confidence
- FF9 Agentic Process Failure
- FF13 Representation / Symbolic Integrity Failure
- FF15 Resource / Budget-Induced Degradation

# FF13. Representation / Symbolic Integrity Failure

## Definition


Failures where exact symbolic, structural, numeric, identifier, or token-level fidelity is required but not preserved.

## Core question


> Did the model preserve the exact representation required by the task?

## Includes


- exact-string corruption;
- identifier corruption;
- name spelling changes;
- numeric fragility;
- arithmetic error;
- count error;
- code syntax corruption;
- table field shift;
- JSON field value shift;
- wrong unit;
- wrong date format;
- whitespace or punctuation sensitivity;
- multilingual tokenization issue;
- rare-symbol failure;
- copying failure;
- malformed transformation;
- corrupted IDs, URLs, filenames, keys, hashes, or record identifiers.

## Typical atomic faults


- Exact-string corruption
- Numeric / symbolic fragility
- Structured-data semantic error
- Output-format drift
- Tokenization-induced corruption
- Table / field alignment error
- Identifier corruption

## Primary Layer 1A contributors


- A1 Tokenized Representation
- A3 Finite Ordered Context Interface
- A4 Attention/Position-Mediated Context Integration
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring
- A9 Decoding Path Selection
- A10 Transformer Compute Scaling

## Primary Layer 1B contributors


- B2 In-Context Demonstration Conditioning
- B3 Natural-Language Interface Sensitivity
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- exact-match checks;
- parser validation;
- field-level comparison;
- numeric tests;
- unit tests;
- round-trip transformation tests;
- copy fidelity tests;
- code execution tests;
- symbolic task benchmarks.

## Typical Layer 3 controls


- deterministic parsers;
- symbolic tools;
- calculators;
- code execution;
- validators;
- constrained decoding;
- copy mechanisms;
- record IDs passed outside free text;
- field-level post-processing;
- schema-aware tool calls.

## Systems note


Token-sequence generation is not reliable symbolic execution or exact representation preservation. When fidelity is hard-requirement behavior, exact values should be passed, checked, or transformed outside unconstrained prose.

## Boundary notes


This family is for representation fidelity. A perfectly formatted but false answer belongs to FF3 or FF4. A valid schema with wrong field semantics may belong to both FF6 and FF13.

## Common overlaps


- FF6 Output Contract / Schema Drift
- FF8 Distributional Competence Failure
- FF9 Agentic Process Failure
- FF12 Reasoning / Planning Integrity Failure
- FF15 Resource / Budget-Induced Degradation

# FF14. Safety / Policy Boundary Failure

## Definition


Failures where the model misapplies safety, authorization, privacy, compliance, or policy boundaries.

This includes both excessive compliance and excessive refusal.

## Core question


> Did the model apply the correct safety, policy, authorization, privacy, or escalation boundary?

## Includes


- under-refusal;
- over-refusal;
- unsafe compliance;
- sensitive-data leakage;
- confidential-context exposure;
- unauthorized recommendation;
- action without adequate basis;
- action without authorization;
- policy inconsistency;
- over-compliance with malicious instruction;
- failure to escalate;
- unnecessary escalation;
- biased or inappropriate content;
- user manipulation or over-persuasion;
- hidden system/process disclosure when inappropriate.

## Typical atomic faults


- Under-refusal
- Over-refusal
- Control/data confusion
- Prompt-injection compliance
- Sycophantic agreement
- Action-readiness error
- Weak confidence calibration
- Source / authority confusion
- Unsafe action

## Primary Layer 1A contributors


- A2 Static Parametric Learned Prior
- A4 Attention/Position-Mediated Context Integration
- A5 In-Band Control/Data Representation
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring
- A9 Decoding Path Selection

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B3 Natural-Language Interface Sensitivity
- B5 Learned Interaction-Style and Persona Priors
- B6 Generated Self-Assessment and Confidence Language
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- policy evals;
- red-team tests;
- jailbreak / prompt-injection tests;
- privacy leakage tests;
- refusal precision / recall tests;
- escalation tests;
- authorization tests;
- harmful-action tests;
- fairness and bias tests where relevant.

## Typical Layer 3 controls


- policy engine;
- authorization gates;
- sensitive-data filters;
- retrieval access controls;
- action confirmation;
- human escalation;
- sandboxing;
- source isolation;
- audit logging;
- safety classifiers;
- irreversible-action controls.

## Systems note


Policy compliance is a mediated system property, not a native model privilege. Authorization, escalation, privacy, and irreversible-action controls must be enforced outside the model, even when the model appears to reason about them fluently.

## Architectural boundary note


FF14 belongs primarily to the policy, reliability, and operating-envelope boundary. It also crosses into the interface and contract boundary when policy is misapplied through instruction confusion, into the knowledge and grounding boundary when authority or source status is misread, and into the state, process, and action boundary when unsafe actions or escalations are taken.

## Boundary notes


The model does not have intrinsic authority to decide whether an action is allowed, safe, compliant, or appropriately authorized. Those judgments require policy, authorization, verification, and escalation controls outside the model.

If the issue is tone or UX without safety implications, use FF7. If the issue is tool/action process, use FF9 as well.

## Common overlaps


- FF2 Task / Instruction Misinduction
- FF5 Weak Calibration and Misleading Confidence
- FF7 Interaction / Experience Inconsistency
- FF9 Agentic Process Failure

# FF15. Resource / Budget-Induced Degradation

## Definition


Failures where context, token, latency, compute, cost, or resource pressure degrades output quality, process completeness, evidence use, or verification.

## Core question


> Did resource constraints degrade behavior?

## Includes


- truncation-induced loss;
- compression-induced distortion;
- shallow answer due to budget;
- skipped verification;
- skipped tool use;
- incomplete reasoning;
- incomplete retrieval context;
- degraded long-context performance;
- premature summarization;
- over-compressed memory;
- latency-driven short-circuiting;
- cost-driven model downgrade;
- context packing removes critical constraints.

## Typical atomic faults


- Truncation-induced loss
- Compression-induced distortion
- Budget-induced incompleteness
- Context omission
- Context underutilization
- Premature closure
- Output-format drift
- Recovery failure

## Primary Layer 1A contributors


- A3 Finite Ordered Context Interface
- A4 Attention/Position-Mediated Context Integration
- A7 Autoregressive Factorization
- A8 Distributional Token Scoring
- A9 Decoding Path Selection
- A10 Transformer Compute Scaling

## Primary Layer 1B contributors


- B1 Learned Natural-Language Task Induction
- B3 Natural-Language Interface Sensitivity
- B7 Distribution-Conditional Competence

## Typical evaluation methods


- long-context tests;
- latency-stress tests;
- cost-tier comparison;
- context-window boundary tests;
- compression-loss tests;
- budget ablation;
- model-tier regression tests;
- verification-skipping tests.

## Typical Layer 3 controls


- budget-aware routing;
- context prioritization;
- task splitting;
- summarization validators;
- long-context retrieval strategy;
- progressive disclosure;
- escalation to larger model;
- verification budgets;
- latency SLO design;
- retry or fallback policies.

## Systems note


Budget pressure often causes silent degradation rather than visible crashes. Systems can look polished while omitting retrieval depth, verification, caveats, or recovery work because those steps were implicitly too expensive.

## Architectural boundary note


FF15 belongs primarily to the policy, reliability, and operating-envelope boundary because it reflects the system's operating limits under cost, latency, and compute constraints. It also crosses into the state, process, and action boundary when budget pressure truncates reasoning, retrieval, memory, or recovery steps.

## Boundary notes


Resource pressure is not always visible in the final answer. A response may look polished while omitting verification, sources, caveats, or edge cases due to hidden budget constraints.

## Common overlaps


- FF1 Behavioral Instability
- FF6 Output Contract / Schema Drift
- FF10 Retrieval-Conditioned Answer Failure
- FF11 Context Availability / Continuity Failure
- FF12 Reasoning / Planning Integrity Failure
- FF13 Representation / Symbolic Integrity Failure

# Cross-family mapping examples


| Atomic fault | Common family tags |
|---|---|
| Context omission | FF10, FF11, FF15 |
| Context underutilization | FF4, FF10 |
| Context priority confusion | FF4, FF10, FF14 |
| Continuity loss | FF11, FF15 |
| Prompt-form sensitivity | FF1, FF2 |
| Task misinduction | FF2, FF6 |
| Constraint misclassification | FF2, FF6, FF14 |
| Control/data confusion | FF2, FF14 |
| Prompt-injection compliance | FF2, FF14 |
| Local plausibility drift | FF12, FF3 |
| Path dependence | FF1, FF12 |
| Output variance | FF1 |
| Tail-risk generation | FF1, FF14 |
| Unsupported assertion | FF3, FF4, FF5 |
| Fabricated citation/source | FF3, FF4 |
| Evidence-claim mismatch | FF4, FF3 |
| Weak confidence calibration | FF5, FF7 |
| Non-privileged self-evaluation | FF5, FF12 |
| Output-format drift | FF6, FF13 |
| Structured-data semantic error | FF6, FF13 |
| Exact-string corruption | FF13 |
| Numeric/symbolic fragility | FF12, FF13 |
| Clarification failure | FF7, FF2 |
| Sycophantic agreement | FF7, FF14 |
| Over-refusal | FF7, FF14 |
| Under-refusal | FF14 |
| Competence cliff | FF8 |
| Distributional overgeneralization | FF8, FF3 |
| Tool-selection error | FF9, FF2 |
| Tool-argument error | FF9, FF13, FF14 |
| Tool-output misinterpretation | FF9, FF4 |
| Action-readiness error | FF9, FF14, FF5 |
| Recovery failure | FF9, FF15 |
| Truncation-induced loss | FF11, FF15 |
| Compression-induced distortion | FF11, FF15 |
| Budget-induced incompleteness | FF15, FF12 |

# Family-to-evaluation mapping


| Family | Typical evaluation methods |
|---|---|
| FF1 Behavioral Instability | repeated-run tests, paraphrase tests, invariance tests, tail-risk sampling |
| FF2 Task / Instruction Misinduction | task-contract tests, constraint tests, paraphrase tests, example generalization tests |
| FF3 Hallucination and Unsupported Claims | factuality checks, source verification, claim extraction, human expert review |
| FF4 Weak Grounding / Source Infidelity | citation support, evidence entailment, context ablation, distractor tests |
| FF5 Weak Calibration and Misleading Confidence | calibration curves, self-check reliability, abstention quality tests |
| FF6 Output Contract / Schema Drift | parser validation, schema validation, constrained-output tests |
| FF7 Interaction / Experience Inconsistency | UX rubric scoring, tone evaluation, clarification/refusal consistency tests |
| FF8 Distributional Competence Failure | slice-based evals, domain tests, rare-format tests, multilingual tests |
| FF9 Agentic Process Failure | agent trace eval, tool-call tests, task-completion eval, recovery tests |
| FF10 Retrieval-Conditioned Answer Failure | RAG eval, retrieval quality, answer faithfulness, stale/noisy context tests |
| FF11 Context Availability / Continuity Failure | long-conversation tests, memory/state carryover tests, workflow-state tests |
| FF12 Reasoning / Planning Integrity Failure | step-level evals, invariant checks, solver-backed verification, trace review |
| FF13 Representation / Symbolic Integrity Failure | exact-match tests, numeric tests, code execution, field-level comparison |
| FF14 Safety / Policy Boundary Failure | red-team tests, policy evals, refusal precision/recall, privacy tests |
| FF15 Resource / Budget-Induced Degradation | long-context tests, compression-loss tests, latency/cost stress tests |

# Family-to-control mapping


This table is intentionally high level. Detailed controls belong in `stack-26-layer-3-control-mapping.md`.

| Family                                           | Typical Layer 3 controls                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| FF1 Behavioral Instability                       | repeated-run gates, deterministic settings, scenario invariance tests, fallback policies   |
| FF2 Task / Instruction Misinduction              | typed task contracts, instruction hierarchy, explicit constraints, task routers            |
| FF3 Hallucination and Unsupported Claims         | source grounding, claim verification, abstention, human review                             |
| FF4 Weak Grounding / Source Infidelity           | citation validators, evidence packaging, source priority rules, answer-faithfulness checks |
| FF5 Weak Calibration and Misleading Confidence   | external verification, calibrated confidence, uncertainty policy, UI separation            |
| FF6 Output Contract / Schema Drift               | schemas, constrained decoding, validators, repair loops                                    |
| FF7 Interaction / Experience Inconsistency       | product behavior specs, tone guides, clarification policy, refusal policy                  |
| FF8 Distributional Competence Failure            | domain routing, specialist tools, slice monitoring, scope restriction                      |
| FF9 Agentic Process Failure                      | tool schemas, action authorization, checkpoints, loop detection, recovery policies         |
| FF10 Retrieval-Conditioned Answer Failure        | retrieval eval, reranking, freshness checks, context packing, citation support             |
| FF11 Context Availability / Continuity Failure   | state persistence, memory rehydration, workflow state, context assembly audits             |
| FF12 Reasoning / Planning Integrity Failure      | step validators, external solvers, plan checkpoints, invariant tracking                    |
| FF13 Representation / Symbolic Integrity Failure | parsers, calculators, code execution, exact comparison, symbolic tools                     |
| FF14 Safety / Policy Boundary Failure            | policy engines, access controls, privacy filters, human escalation, audit logs             |
| FF15 Resource / Budget-Induced Degradation       | budget-aware routing, task splitting, verification budgets, compression validation         |

# Boundary notes

## Families are not root causes


Root causes may be found in:

- Layer 1A mechanisms;
- Layer 1B learned features;
- Layer 3 system faults;
- training/data layers;
- deployment or operational environment.

A family is a navigational grouping of observed behavioral fault modes.

## Families are not controls


Validators, retrievers, policy engines, monitoring, sandboxes, access controls, and authorization gates belong to Layer 3.

Layer 2 may say:

```text
The model generated an unsupported assertion.
```


Layer 3 says:

```text
The system had no grounding check, no citation validator, and no abstention path.
```

## Families are not impacts


User harm, compliance exposure, lost revenue, unsafe action, reputational damage, or production outage belong to Layer 4.

Layer 2 may say:

```text
The model gave a high-confidence unsupported medical claim.
```


Layer 4 says:

```text
The user may rely on unsafe medical advice.
```

## Families are not evaluation metrics


Exact match, pass rate, F1, human preference score, citation precision, latency, and cost are evaluation metrics or measurement outputs.

They may help detect families, but they are not themselves fault families.

# Relationship to other Layer 2 documents

```text
stack-20-layer-2-overview.md
  Defines Layer 2 scope, inclusion criteria, and relationship to other layers.

stack-21-fault-inventory.md
  Defines atomic fault modes.

stack-22-fault-record-template.md
  Defines the schema for each atomic fault record.

stack-23-fault-family-index.md
  This file. Defines broad non-exclusive families over the atomic inventory.

stack-24-classification-views.md
  Defines alternative views: causal origin, affected artifact, evaluation method,
  product risk, and control strategy.

stack-25-evaluation-mapping.md
  Maps faults and families to evaluation methods.

stack-26-layer-3-control-mapping.md
  Maps Layer 2 faults to Layer 3 controls.

stack-27-layer-2-worked-examples.md
  Shows end-to-end examples.

stack-28-boundaries-and-non-goals.md
  Prevents category drift.
```

# Short rule of thumb


Use this file when you need to ask:

```text
What kind of failure is this?
```


Use `stack-21-fault-inventory.md` when you need to ask:

```text
What exact behavioral fault occurred?
```


Use `stack-26-layer-3-control-mapping.md` when you need to ask:

```text
What system control should have prevented, detected, or recovered from it?
```
