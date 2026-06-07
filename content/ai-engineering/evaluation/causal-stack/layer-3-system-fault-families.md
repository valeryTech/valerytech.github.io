---
draft: false
toc: true
title: "Layer 3 System Fault Families"
linkTitle: "Layer 3 System Fault Families"
---
# Layer 3 -- System Fault Families

## Definition


A **system-level fault** is a failure in the surrounding LLM application that allows model-derived fault modes to produce incorrect, unsafe, inconsistent, or untrustworthy behavior.

A system fault is not:

> "The model hallucinated."

A system fault is:

> "The system allowed unsupported claims to reach the user without grounding, abstention, citation validation, or verification."

So Layer 3 translates model behavior into architecture responsibility.

# Core distinction

## Layer 2: mechanism-derived fault mode


What the model is prone to do.

Examples:

- context omission,
- prompt-form sensitivity,
- unsupported assertion,
- weak confidence calibration,
- structured output drift,
- path dependence,
- control/data confusion.

## Layer 3: system-level fault


What the system failed to do around that tendency.

Examples:

- failed to retrieve the right source,
- failed to preserve state,
- failed to validate schema,
- failed to enforce evidence requirements,
- failed to isolate untrusted instructions,
- failed to regression-test prompt/model changes.

# Proposed Layer 3 taxonomy


Use the `L3S1-L3S10` identifiers for canonical Layer 3 fault-family references. They replace the older `S1-S10` labels used in earlier drafts.

I would use ten system-fault families:

| Code    | System fault family                   | Core failure                                                                             |
| ------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| **L3S1**  | Context Assembly Faults               | The system builds the wrong runtime context.                                             |
| **L3S2**  | Retrieval and Grounding Faults        | The system fails to supply or enforce source-grounded evidence.                          |
| **L3S3**  | Instruction and Policy Control Faults | The system fails to preserve instruction priority or policy boundaries.                  |
| **L3S4**  | State and Memory Faults               | The system fails to preserve, update, or invalidate durable state.                       |
| **L3S5**  | Tool Orchestration Faults             | The system calls tools incorrectly or fails to constrain tool use.                       |
| **L3S6**  | Output Contract Faults                | The system accepts outputs that violate required structure or semantics.                 |
| **L3S7**  | Fallback and Escalation Faults        | The system lacks good behavior when confidence, evidence, or capability is insufficient. |
| **L3S8**  | Evaluation and Regression Faults      | The system does not detect known failure modes before release.                           |
| **L3S9**  | Observability and Diagnosis Faults    | The system cannot explain, reproduce, or localize failures.                              |
| **L3S10** | Change Management Faults              | Model, prompt, retrieval, or policy changes alter behavior without adequate control.     |

This gives us a system-focused Layer 3 without drifting into cost, latency, or generic delivery management.

# L3S1. Context Assembly Faults

## Definition


The system constructs a runtime context that is missing, noisy, stale, conflicting, overbroad, poorly ordered, or insufficiently structured.

## Canonical statement


> The system fails to provide the model with the right information in the right form at the right time.

## Typical system faults


- Relevant prior turns are not reintroduced.
- Required constraints are omitted from the prompt.
- Too many irrelevant chunks are injected.
- Context is ordered poorly.
- Instructions, evidence, memory, and tool outputs are mixed without structure.
- Critical source hierarchy is not represented.
- Summaries replace original evidence but drop important details.
- The system assumes that "included somewhere" means "usable by the model."

## Layer 2 faults it enables


- CF1 Context Omission
- CF2 Context Underutilization
- CF3 Context Priority Confusion
- CF4 Continuity Loss
- IF3 Control/Data Confusion
- RF3 Invariant Loss

## Example

```text
Layer 2: The model ignores a buried constraint.
Layer 3: The system injected 20 retrieved chunks with no ranking, no source priority, and no constraint extraction.
```

# L3S2. Retrieval and Grounding Faults

## Definition


The system fails to retrieve, rank, inject, require, or verify evidence needed for grounded claims.

## Canonical statement


> The system allows factual output without adequate evidence control.

## Typical system faults


- Retriever misses the relevant document.
- Retriever finds the document but not the relevant passage.
- Retrieved chunks are stale or low-authority.
- The model is allowed to answer without retrieved evidence.
- The system does not distinguish grounded claims from generated assumptions.
- Citations are generated but not checked.
- The answer uses a source that does not support the claim.
- The system fails to abstain when evidence is missing.

## Layer 2 faults it enables


- EF1 Plausibility-Truth Gap
- EF2 Unsupported Assertion
- EF3 Non-Grounded Justification
- CF1 Context Omission
- CF3 Context Priority Confusion
- IF4 Constraint Misclassification

## Example

```text
Layer 2: The model makes an unsupported policy claim.
Layer 3: The system did not require the answer to be grounded in the current policy source.
```


This is the proper system-level version of "hallucination risk."

# L3S3. Instruction and Policy Control Faults

## Definition


The system fails to maintain stable instruction priority, policy boundaries, role separation, or safety classification across varied inputs.

## Canonical statement


> The system relies on prompt compliance instead of enforceable instruction and policy control.

## Typical system faults


- Untrusted user or retrieved text can override system intent.
- Safety policy classification varies across paraphrases.
- The system depends on a fragile prompt instead of a policy layer.
- Policy rules are embedded as prose but not enforced structurally.
- Instruction hierarchy is unclear.
- The model follows instructions inside retrieved documents.
- Allowed and disallowed actions are not represented as executable boundaries.
- The product has no stable behavior for ambiguous or borderline requests.

## Layer 2 faults it enables


- IF1 Prompt-Form Sensitivity
- IF2 Task Misinduction
- IF3 Control/Data Confusion
- IF4 Constraint Misclassification
- GF3 Output Variance
- GF4 Tail-Risk Generation

## Example

```text
Layer 2: Similar prompts produce different refusal/compliance behavior.
Layer 3: The system has no policy classifier or permission gate independent of prompt wording.
```


This covers "safety / policy misclassification" from your list.

# L3S4. State and Memory Faults

## Definition


The system fails to preserve, retrieve, update, invalidate, or distinguish durable state.

## Canonical statement


> The system treats continuity as if it were native to the model instead of managing it explicitly.

## Typical system faults


- No persistent state exists for a workflow that requires continuity.
- Important user preferences are not stored.
- Old preferences remain active after the user changes them.
- State is stored as loose prose instead of structured fields.
- The system cannot distinguish user-provided facts from model-inferred facts.
- Prior approvals, denials, or constraints are not persisted.
- Memory is reintroduced without provenance or freshness.
- State across tools and model calls becomes inconsistent.

## Layer 2 faults it enables


- CF4 Continuity Loss
- CF1 Context Omission
- RF3 Invariant Loss
- EF2 Unsupported Assertion
- IF4 Constraint Misclassification

## Example

```text
Layer 2: The assistant acts as if an old preference is still valid.
Layer 3: The memory system has no staleness, update, or provenance policy.
```

# L3S5. Tool Orchestration Faults

## Definition


The system fails to decide when tools should be used, how tool inputs should be constructed, how tool results should be interpreted, or when tool actions should be blocked.

## Canonical statement


> The system lets probabilistic generation control external actions without sufficient routing, validation, or permission boundaries.

## Typical system faults


- Wrong tool selected.
- Tool called when no tool should be used.
- Tool not called when authoritative computation or lookup is required.
- Tool arguments are hallucinated or malformed.
- Tool output is misread by the model.
- The system allows irreversible tool actions without approval.
- Tool results are not checked before being used.
- Agent loops repeat tool calls without progress.
- The system treats tool output prose as an instruction.

## Layer 2 faults it enables


- IF2 Task Misinduction
- IF3 Control/Data Confusion
- SF3 Structured Output Drift
- SF1 Exact-String Corruption
- RF2 Plan Drift
- RF3 Invariant Loss
- GF2 Path Dependence

## Example

```text
Layer 2: The model generates the wrong account ID.
Layer 3: The system allowed generated text to become a tool argument without source matching or validation.
```


This captures "incorrect tool use" from your list.

# L3S6. Output Contract Faults

## Definition


The system fails to enforce required output structure, schema, format, field semantics, or exactness.

## Canonical statement


> The system accepts generated output as if it were a contract-compliant payload.

## Typical system faults


- No schema validator.
- Validator exists but checks syntax only, not semantics.
- Invalid JSON or wrong fields are passed downstream.
- Tool arguments are not canonicalized.
- Required fields can be omitted.
- Generated identifiers are accepted instead of copied from source.
- Free-form answer is used where a structured decision is needed.
- The system does not separate draft text from final executable payload.

## Layer 2 faults it enables


- SF1 Exact-String Corruption
- SF2 Numeric and Symbolic Fragility
- SF3 Structured Output Drift
- SF4 Boundary and Stopping Error
- GF3 Output Variance

## Example

```text
Layer 2: The model emits malformed JSON.
Layer 3: The system has no strict schema validation and retry/rejection path.
```

# L3S7. Fallback and Escalation Faults

## Definition


The system fails to define appropriate behavior when the model lacks evidence, confidence, permissions, capability, or context.

## Canonical statement


> The system lacks safe alternatives to answering or acting.

## Typical system faults


- No abstention behavior when evidence is missing.
- No clarification behavior for under-specified requests.
- No human review path for high-impact decisions.
- No safe fallback when tools fail.
- No distinction between "cannot answer," "should not answer," and "needs more information."
- The product forces the model to produce an answer.
- The system uses confident phrasing even when uncertainty is high.
- The system retries blindly instead of changing strategy.

## Layer 2 faults it enables


- EF2 Unsupported Assertion
- EF4 Weak Confidence Calibration
- EF5 Non-Privileged Self-Evaluation
- IF2 Task Misinduction
- GF1 Local Plausibility Drift
- RF2 Plan Drift

## Example

```text
Layer 2: The model answers an under-specified question confidently.
Layer 3: The system has no “missing required inputs → clarify” rule.
```


This covers "poor fallback behavior."

# L3S8. Evaluation and Regression Faults

## Definition


The system's test strategy fails to detect known LLM fault modes before release or after changes.

## Canonical statement


> The system is shipped without evaluation coverage for the failure modes its architecture is exposed to.

## Typical system faults


- Tests cover happy paths only.
- No paraphrase robustness tests.
- No long-context tests.
- No retrieval-grounding tests.
- No multi-run variance tests.
- No tool-argument validation tests.
- No regression suite for prompt changes.
- No eval slices for ambiguity, evidence absence, policy edge cases, or adversarial content.
- Acceptance criteria are subjective or demo-based.

## Layer 2 faults it enables


- GF3 Output Variance
- GF4 Tail-Risk Generation
- IF1 Prompt-Form Sensitivity
- CF2 Context Underutilization
- EF2 Unsupported Assertion
- SF3 Structured Output Drift
- RF1 Error Accumulation

## Example

```text
Layer 2: Rare bad outputs appear in production.
Layer 3: The release process tested one sample per prompt and did not measure tail risk.
```


This covers "evaluation blind spots" and "weak regression testing."

# L3S9. Observability and Diagnosis Faults

## Definition


The system lacks the traces, metadata, logs, or attribution needed to reproduce, explain, or localize failures.

## Canonical statement


> The system cannot tell whether a failure came from the model, prompt, retrieval, memory, tools, policy, or product logic.

## Typical system faults


- Runtime context is not logged.
- Retrieved chunks are not recorded.
- Tool calls and tool outputs are not linked to final claims.
- Prompt, model version, decoding parameters, and policy version are not captured.
- No provenance for memory injection.
- No distinction between generated claims and source-grounded claims.
- No reason codes for fallback, refusal, or escalation.
- Failures cannot be replayed.

## Layer 2 faults it enables or obscures


- EF3 Non-Grounded Justification
- CF1 Context Omission
- CF2 Context Underutilization
- IF3 Control/Data Confusion
- GF3 Output Variance
- GF4 Tail-Risk Generation

## Example

```text
Layer 2: The answer used the wrong source.
Layer 3: The system did not log which retrieved chunks were available to the model.
```


This is the system-fault root of hard-to-debug and hard-to-reproduce failures.

# L3S10. Change Management Faults

## Definition


The system allows changes to model, prompt, retrieval, memory, tools, policy, or decoding behavior without adequate compatibility checks or rollout controls.

## Canonical statement


> The system treats LLM behavior as stable across changes when it is not.

## Typical system faults


- Model version changes without regression testing.
- Prompt edits are shipped without evals.
- Retrieval ranking changes alter answer behavior silently.
- Tool schemas change without prompt and validator updates.
- Policy updates are not tested against prior workflows.
- Memory format changes break continuity.
- Decoding settings change behavior unexpectedly.
- No canary, rollback, or behavioral diff process.

## Layer 2 faults it enables


- GF3 Output Variance
- IF1 Prompt-Form Sensitivity
- IF2 Task Misinduction
- SF3 Structured Output Drift
- CF3 Context Priority Confusion
- EF2 Unsupported Assertion

## Example

```text
Layer 2: It worked yesterday but fails today.
Layer 3: The prompt template changed without regression testing against known slices.
```


This covers "regression from model or prompt changes."

# Consolidated Layer 3 taxonomy


|Code|System-level fault|Canonical statement|
|---|---|---|
|**L3S1**|Context Assembly Faults|The system builds the wrong runtime context.|
|**L3S2**|Retrieval and Grounding Faults|The system fails to supply or enforce adequate evidence.|
|**L3S3**|Instruction and Policy Control Faults|The system fails to maintain stable instruction or policy boundaries.|
|**L3S4**|State and Memory Faults|The system fails to preserve, update, or invalidate durable state.|
|**L3S5**|Tool Orchestration Faults|The system fails to route, constrain, validate, or interpret tool use.|
|**L3S6**|Output Contract Faults|The system accepts outputs that violate required structure, semantics, or exactness.|
|**L3S7**|Fallback and Escalation Faults|The system lacks appropriate behavior when evidence, context, confidence, or permission is insufficient.|
|**L3S8**|Evaluation and Regression Faults|The system lacks tests for the fault modes its architecture exposes.|
|**L3S9**|Observability and Diagnosis Faults|The system cannot reproduce, attribute, or localize failures.|
|**L3S10**|Change Management Faults|The system allows behavioral changes without adequate compatibility checks or rollout controls.|

# Mapping your examples into this taxonomy


|Your example|Proposed Layer 3 placement|
|---|---|
|Output instability|L3S8 Evaluation/Regression, L3S10 Change Management; derived from GF3|
|Inconsistent behavior across similar inputs|L3S3 Instruction/Policy Control, L3S8 Evaluation; derived from IF1|
|Instruction-following drift|L3S1 Context Assembly, L3S3 Instruction Control, L3S4 State|
|Incorrect tool use|L3S5 Tool Orchestration|
|Retrieval-grounding failures|L3S2 Retrieval and Grounding|
|Context-window failures|L3S1 Context Assembly, L3S4 State|
|Poor fallback behavior|L3S7 Fallback and Escalation|
|Brittle prompt chains|L3S1 Context Assembly, L3S3 Instruction Control, L3S10 Change Management|
|Hidden regression|L3S10 Change Management, L3S8 Evaluation and Regression, often L3S9 Observability and Diagnosis|
|Evaluation blind spots|L3S8 Evaluation and Regression|
|Regression from model or prompt changes|L3S10 Change Management|
|Safety / policy misclassification|L3S3 Instruction and Policy Control, L3S8 Evaluation|

# How to classify "Instruction-following drift"


Use "instruction-following drift" as an informal umbrella term, not as a new atomic Layer 2 fault.

| Common meaning | Classify as | Reason |
|---|---|---|
| Workflow or prerequisite drift | F25 Invariant Loss + F26 Plan Drift | Earlier constraints or required step order stop governing later behavior. |
| Prompt or example priority confusion | F03 Context Priority Confusion + F12 Constraint Misclassification + F13 Example Overgeneralization | The system is still "following instructions," but the wrong instruction signal dominates. |
| Untrusted embedded instruction uptake | F15 Control/Data Confusion + F16 Prompt-Injection Compliance | Non-operative content is treated as operative instruction. |

On the Layer 3 side, the likely system homes are still L3S1 Context Assembly, L3S3 Instruction and Policy Control, and L3S4 State and Memory, depending on whether the failure is in context construction, instruction control, or state persistence.

# How to classify "Hidden regression"


Use "hidden regression" as an informal lens, not as a new atomic Layer 2 fault or a new Layer 3 family.

| Common meaning | Classify as | Reason |
|---|---|---|
| Behavior changed after a prompt, model, retrieval, tool, schema, policy, or memory update | L3S10 Change Management | The system allowed a behavior-changing update without adequate compatibility checks or rollout controls. |
| The regression was not caught before release | L3S8 Evaluation and Regression | The system lacked the regression coverage, scenario slices, or release gates needed to detect the degradation. |
| The regression is hard to localize, replay, or attribute | L3S9 Observability and Diagnosis | The system did not preserve enough trace, version, or provenance data to explain what changed. |

Classify the regressed behavior itself under the affected domain fault as well, such as L3S2 Retrieval and Grounding, L3S3 Instruction and Policy Control, L3S5 Tool Orchestration, or L3S6 Output Contract. "Hidden regression" is the change, evaluation, and diagnosis lens over that behavior.

The effect is often non-local even when the triggering edit was local. A narrow prompt, retrieval, schema, or policy change may degrade adjacent slices or seemingly unrelated workflows because the changed control surface is shared more broadly than the team first assumed.

Some of your "Layer 3 -- Delivery and engineering problems" are not system faults themselves. They are downstream engineering consequences of system faults:

|Delivery/engineering problem|Usually caused by|
|---|---|
|Hard-to-reproduce bugs|L3S9 Observability + GF3 Output Variance|
|Hard-to-debug failures|L3S9 Observability|
|Unclear ownership|Missing ownership model across L3S1-L3S10|
|Slow QA cycles|L3S8 Evaluation gaps + unclear acceptance criteria|
|Weak regression testing|L3S8 Evaluation and Regression|
|Hidden regression|L3S10 Change Management + L3S8 Evaluation + often L3S9 Observability|
|Difficult acceptance criteria|L3S8 Evaluation + L3S7 fallback ambiguity|
|Unstable demos|L3S8 Evaluation + L3S10 Change Management|
|High manual review burden|L3S2/L3S6/L3S7 controls insufficient or immature|
|Deployment risk|L3S8 + L3S9 + L3S10|
|Monitoring gaps|L3S9 Observability|
|Difficulty defining "done"|L3S8 Evaluation + unclear operating envelope|

So I would keep those in **Layer 4: Delivery and Engineering Problems**, not in Layer 3.

# Clean causal examples

## Example 1 -- Hallucinated answer

```text
Layer 1 mechanism:
M8 Distributional Token Scoring

Layer 2 fault mode:
EF2 Unsupported Assertion

Layer 3 system fault:
L3S2 Retrieval and Grounding Fault — answer allowed without evidence requirement

Layer 4 engineering problem:
Manual review burden

Layer 5 user symptom:
“It made something up.”
```

## Example 2 -- Prompt instability

```text
Layer 1 mechanism:
M10 Learned Natural-Language Task Induction

Layer 2 fault mode:
IF1 Prompt-Form Sensitivity

Layer 3 system fault:
L3S8 Evaluation and Regression Fault — no paraphrase robustness suite

Layer 4 engineering problem:
Unstable demos

Layer 5 user symptom:
“It gives different answers depending on how I ask.”
```

## Example 3 -- Wrong tool action

```text
Layer 1 mechanism:
M7 Autoregressive Factorization + M8 Distributional Token Scoring

Layer 2 fault mode:
SF1 Exact-String Corruption

Layer 3 system fault:
L3S5 Tool Orchestration Fault — generated ID accepted as tool parameter without validation

Layer 4 engineering problem:
Deployment risk

Layer 5 user symptom:
“It updated the wrong record.”
```

## Example 4 -- Worked yesterday, broken today

```text
Layer 1 mechanism:
M9 Decoding Path Selection + M10 Learned Task Induction

Layer 2 fault mode:
GF3 Output Variance / IF2 Task Misinduction

Layer 3 system fault:
L3S10 Change Management Fault — prompt or model changed without behavioral regression tests

Layer 4 engineering problem:
Hidden regression / hard-to-debug regression

Layer 5 user symptom:
“It worked yesterday but not today.”
```

# Recommended final wording


> **System-level faults are failures in the LLM application architecture that allow known model-derived fault modes to escape into product behavior. They occur when context, retrieval, grounding, policy, memory, tools, validation, fallback, evaluation, observability, or change management are missing, weak, inconsistent, or poorly integrated.**

Shorter:

> **Layer 3 is where model tendencies become engineering responsibility.**

This keeps the taxonomy clean:

```text
Layer 1: What the model/inference mechanism is.
Layer 2: How that mechanism tends to fail behaviorally.
Layer 3: What the system failed to bound, verify, preserve, or recover from.
Layer 4: What the engineering team experiences.
Layer 5: What the user sees.
```
