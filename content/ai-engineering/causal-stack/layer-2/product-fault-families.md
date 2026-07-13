---
draft: false
toc: true
title: "Product Fault Families"
linkTitle: "Product Fault Families"
---

Status: draft

Layer: Layer 2 product-facing classification view

Intended users: product engineers, AI engineers, evaluators, incident reviewers, and reliability owners

## Purpose


This document defines **product-facing fault families** for AI systems.

It is meant for:

- AI product design;
- debugging and incident review;
- evaluation planning;
- trace and observability design;
- control mapping;
- release-gate and monitoring design;
- communication across engineering, product, policy, and operations teams.

This document does **not** treat fault families as atomic natural kinds. A real AI product failure usually combines several dimensions: product boundary, affected artifact, behavioral symptom, evidence gap, process gap, missing control, and user impact.

The classification unit should therefore be:

```text
product boundary
+ affected artifact
+ failure operator
+ evaluation method
+ Layer 3 control gap
```


Legacy `Fxx` atomic fault codes and `FFx` fault-family codes can still be useful as tags, aliases, or search handles, but they should not be treated as the primary product-debugging object.

## Relationship to the causal stack


This document preserves the causal-stack boundary:

```text
Layer 0
  natural-language interface conditions

Layer 1
  model and system features that make behavior possible

Layer 2
  recurring behavioral failure patterns

Evaluation view
  methods that reveal, measure, reproduce, or compare those failures

Layer 3
  controls that prevent, detect, recover from, monitor, or prove acceptable behavior

Layer 4
  user, workflow, safety, legal, business, or operational impact
```


This file sits in Layer 2, but it is intentionally organized around product-debugging needs. Each family therefore includes links to evaluation methods and likely Layer 3 controls.

## Core reframe


Do not ask only:

```text
Which fault code is this?
```


Ask:

```text
1. Which product boundary failed?
2. Which artifact was wrong, absent, misused, or unsafe?
3. What kind of failure happened to that artifact?
4. What evaluation method would reveal or reproduce it?
5. What control should have prevented, detected, recovered from, monitored, or proved it?
```

## What counts as a product fault family


A product fault family is a broad, non-exclusive class of Layer 2 behavioral failure organized by where the failure becomes useful to debug in a product architecture.

Families are:

- **non-atomic**: one incident may have several families;
- **non-exclusive**: families can overlap;
- **not root causes**: root causes belong to Layer 1 or to system implementation analysis;
- **not controls**: controls belong to Layer 3;
- **not impacts**: user and business consequences belong to Layer 4;
- **not metrics**: metrics and tests belong to the evaluation view.

## Classification syntax


Use this compact syntax in incidents, test failures, and issue trackers:

```text
P3 Claim / Grounding / Epistemic Failure
artifact: citation
operator: invented
revealed_by: EM4 Grounding and citation evaluation
control_gap: L3B5 Claim Grounding and Citation Controls
legacy_tags: F33, F30, F36, FF3, FF4, FF5
```


For short issue labels:

```text
P3 + citation + invented + EM4 + L3B5 gap
P5 + tool_arguments + corrupted + EM8/EM6 + L3C5 gap
P2 + state + stale + EM3/EM11 + L3C1/L3C2 gap
P7 + scenario_outcome + unstable + EM1 + L3D5 gap
```

## Product family table


| Code | Product fault family | Core diagnostic question | Primary product boundary |
|---|---|---|---|
| **P1** | Task Contract Failure | Did the system infer and preserve the intended task, scope, constraints, and success criteria? | Interface and contract |
| **P2** | Context, State, and Evidence Availability Failure | Did the system assemble, preserve, prioritize, and expose the right runtime information? | Knowledge, grounding, state |
| **P3** | Claim, Grounding, and Epistemic Failure | Did claims, citations, justifications, and confidence match evidence and truth requirements? | Knowledge and grounding |
| **P4** | Output and Representation Contract Failure | Did the emitted object satisfy structure, schema, exactness, and downstream-use requirements? | Interface, parser, symbolic boundary |
| **P5** | Process, Tool, and Action Failure | Did planning, tool use, state transition, action readiness, or recovery fail? | State, process, and action |
| **P6** | Policy, Trust, and Interaction Failure | Did the system handle safety, refusal, authorization, privacy, clarification, tone, and trust boundaries correctly? | Policy and interaction |
| **P7** | Reliability and Operating-Envelope Failure | Does behavior hold across runs, variants, slices, versions, environments, and budgets? | Reliability and operating envelope |

## Failure operators


Failure operators describe what happened to the affected artifact. They are reusable across product families.

| Operator | Meaning | Example |
|---|---|---|
| **missing** | Required artifact was absent. | Required source, instruction, state, field, or approval was not present. |
| **ignored** | Artifact was present but not used. | Relevant policy span was supplied but not applied. |
| **misweighted** | Artifact was used with the wrong priority or authority. | Stale retrieved doc outweighed current policy. |
| **stale** | Artifact was obsolete but treated as current. | Old workflow state was used after user changed the request. |
| **contaminated** | Irrelevant, misleading, or untrusted content shaped behavior. | Prompt-injection text inside a document affected the answer. |
| **misclassified** | Artifact role, type, authority, risk level, or constraint force was classified incorrectly. | Soft preference treated as hard constraint. |
| **misinterpreted** | Artifact was read or semantically integrated incorrectly. | Tool result was understood as proof when it was partial. |
| **malformed** | Artifact violated syntax, format, schema, or boundary requirements. | Invalid JSON or extra commentary after a payload. |
| **corrupted** | Exact representation changed. | ID, URL, account number, citation, field value, or date was altered. |
| **invented** | Artifact was fabricated. | Non-existent citation, source, tool result, or fact. |
| **unsupported** | Artifact lacked required evidence or justification. | Material claim had no source-span support. |
| **overstated** | Artifact expressed more certainty, completeness, authority, or safety than warranted. | High-confidence answer despite weak evidence. |
| **overgeneralized** | Familiar pattern was applied outside its valid domain. | Common workflow applied to a rare regulatory edge case. |
| **unstable** | Material behavior varied when it should have remained invariant. | Different escalation decisions for paraphrases. |
| **premature** | System finalized before sufficient evidence, validation, or action readiness. | Sent message before confirmation. |
| **unauthorized** | System acted, recommended, or disclosed without required permission, policy basis, or safety check. | Tool call prepared for a write action without approval. |
| **unrecovered** | System failed after detecting or encountering error, uncertainty, contradiction, or missing input. | Tool error was ignored and the workflow continued. |
| **budget-constrained** | Resource limits caused shallow, incomplete, or under-verified behavior. | Long document was summarized without preserving critical exceptions. |

## Affected artifact types


Use affected artifacts to make incidents debuggable.

| Artifact type | Examples |
|---|---|
| **task_contract** | inferred task, scope, success criteria, output mode, user goal |
| **instruction_set** | system/developer/user instructions, hierarchy, examples, exceptions |
| **context_packet** | assembled prompt context, retrieved chunks, source order, metadata |
| **state_or_memory** | conversation state, workflow state, preferences, approvals, tool history |
| **evidence** | source text, source span, retrieved document, database row, policy snippet |
| **claim** | factual assertion, recommendation, classification, explanation premise |
| **citation_or_source_reference** | citation, URL, case name, source ID, document reference |
| **confidence_or_uncertainty** | hedging, certainty language, confidence score, self-assessment |
| **output_payload** | JSON, XML, YAML, CSV, markdown, table, final answer object |
| **exact_value** | ID, date, URL, number, hash, name spelling, code token, enum value |
| **reasoning_or_plan** | decomposition, intermediate step, invariant, plan state, stopping decision |
| **tool_call** | selected tool, omitted tool, unnecessary tool, tool call sequence |
| **tool_arguments** | query, ID, recipient, date, location, filter, action parameter |
| **tool_result_interpretation** | model interpretation of API result, search result, database row, tool error |
| **external_action** | email, record update, purchase, calendar action, ticket escalation, API write |
| **policy_decision** | allow/refuse/escalate, privacy decision, safety decision, authorization decision |
| **interaction_behavior** | clarification behavior, tone, verbosity, role behavior, user-facing commitment |
| **operating_condition** | model version, prompt version, runtime environment, budget, latency, context length, product slice |

## Family record schema


Each product-family record uses this schema:

```text
## Px. Family Name

### Definition
What class of product-facing failures this family covers.

### Core question
The diagnostic question this family answers.

### Product boundary
Where the failure becomes visible or useful to debug in the product architecture.

### Includes
Common manifestations and subcases.

### Common affected artifacts
Artifacts commonly involved.

### Useful failure operators
Operators that usually describe what happened to the artifacts.

### Typical legacy tags
Relevant Fxx and FFx tags from the older inventory and family index.

### Typical evaluation methods
Evaluation methods likely to reveal or reproduce the family.

### Typical Layer 3 controls
System controls that usually prevent, detect, recover from, monitor, or prove behavior.

### Required traces
Observability needed to debug the family.

### Common engineering trap
Typical misdiagnosis.

### Boundary notes
What not to confuse with this family.

### Common overlaps
Other product families commonly co-tagged.
```

# P1. Task Contract Failure

## Definition


Failures where the system infers, composes, preserves, or follows the wrong task contract.

A task contract includes the intended operation, object, scope, constraints, success criteria, output mode, risk posture, examples, and clarification policy.

## Core question


> Did the system infer and preserve the intended task, scope, constraints, and success criteria?

## Product boundary


Interface and contract boundary.

This family appears where natural-language user intent, product instructions, examples, policy requirements, and downstream schemas need to become an executable or evaluable task contract.

## Includes


- wrong task inference;
- wrong objective or success criterion;
- task blending;
- scope too broad, too narrow, or on the wrong object;
- hard constraint treated as preference;
- preference treated as hard constraint;
- exception ignored;
- example treated as exhaustive rule;
- example ignored when it was the runtime specification;
- background note treated as instruction;
- instruction treated as data;
- task router selects wrong task type;
- clarification decision depends on a bad task interpretation.

## Common affected artifacts


- `task_contract`;
- `instruction_set`;
- examples and demonstrations;
- router labels;
- constraint list;
- output mode;
- clarification decision;
- product behavior spec.

## Useful failure operators


- `misinterpreted`;
- `misclassified`;
- `ignored`;
- `misweighted`;
- `contaminated`;
- `overgeneralized`;
- `unstable`.

## Typical legacy tags


- F08 Prompt-Surface Fragility;
- F09 Task Misinduction;
- F10 Task Blending;
- F11 Scope Misinterpretation;
- F12 Constraint Misclassification;
- F13 Example Overgeneralization;
- F14 Example Underuse;
- F15 Control/Data Confusion;
- F41 Clarification Failure, when the clarification error follows from wrong task interpretation;
- FF2 Task / Instruction Misinduction;
- FF6 Output Contract / Schema Drift, when wrong task contract causes wrong output mode;
- FF7 Interaction / Experience Inconsistency, when contract failure is user-facing.

## Typical evaluation methods


- EM2 Prompt perturbation / paraphrase testing;
- EM14 Human-review / rubric evaluation;
- EM7 Reasoning / process evaluation, when the task contract should be preserved across steps;
- EM13 Regression / diff testing;
- EM10 Safety and policy adversarial testing, when the task contract includes trust-boundary or policy behavior.

## Typical Layer 3 controls


- L3A1 Task Contract Controls;
- L3A2 Instruction Hierarchy Controls;
- L3A3 Prompt Assembly Controls;
- L3A6 Interaction Contract Controls;
- L3D4 Routing and Fallback Controls;
- L3X1 Traceability Controls;
- L3X2 Evaluation Gate Controls.

## Required traces


- original user request;
- resolved task contract;
- active instruction hierarchy;
- examples included in context;
- prompt template and prompt version;
- task-router output;
- clarification decision and reason;
- final output contract selected by the system.

## Common engineering trap


Treating the failure as a one-off prompt wording issue. The product question is whether the system has a durable task contract that can be inspected, tested, and validated across paraphrases, examples, and product states.

## Boundary notes


If the task was correct but the answer made unsupported claims, use P3. If the task was correct but the emitted payload violated a schema, use P4. If the task was correct but the system picked the wrong tool or action, use P5.

## Common overlaps


- P2 Context, State, and Evidence Availability Failure;
- P4 Output and Representation Contract Failure;
- P5 Process, Tool, and Action Failure;
- P6 Policy, Trust, and Interaction Failure;
- P7 Reliability and Operating-Envelope Failure.

## Minimal example

```yaml
primary_family: P1 Task Contract Failure
affected_artifact: task_contract
failure_operator: misinterpreted
observed_behavior: system summarized the document when the user requested extraction of exceptions
revealed_by:
  - EM2 Prompt perturbation / paraphrase testing
  - EM14 Human-review / rubric evaluation
control_gap:
  - L3A1 Task Contract Controls
legacy_tags:
  - F09 Task Misinduction
  - FF2 Task / Instruction Misinduction
```

# P2. Context, State, and Evidence Availability Failure

## Definition


Failures where required runtime information is absent, stale, truncated, distorted, ignored, misprioritized, contaminated, or unavailable at the point where the model or system needs it.

This family covers both input-side context assembly and workflow continuity. It is about whether the right information was available and usable.

## Core question


> Did the system assemble, preserve, prioritize, and expose the right runtime information?

## Product boundary


Knowledge, grounding, state, and context boundary.

This family appears where retrieval, memory, state stores, prompt assembly, source metadata, context packing, conversation history, and workflow state condition behavior.

## Includes


- missing required context;
- present context ignored;
- relevant evidence buried or diluted;
- low-authority source overweighted;
- stale state treated as current;
- prior user preference lost;
- old approval treated as still valid;
- missing tool history;
- wrong retrieved chunk used;
- distractor evidence integrated;
- retrieved source lacks freshness metadata;
- compressed memory loses operational details;
- context truncated before critical exception;
- source authority, provenance, or role misclassified.

## Common affected artifacts


- `context_packet`;
- `state_or_memory`;
- `evidence`;
- source metadata;
- retrieved chunks;
- conversation history;
- workflow state;
- tool history;
- compressed summary;
- freshness marker.

## Useful failure operators


- `missing`;
- `ignored`;
- `misweighted`;
- `stale`;
- `contaminated`;
- `misclassified`;
- `misinterpreted`;
- `corrupted`;
- `budget-constrained`.

## Typical legacy tags


- F01 Context Omission;
- F02 Context Underutilization;
- F03 Context Priority Misweighting;
- F04 Continuity Loss;
- F05 Stale-State Reliance;
- F06 Distractor Assimilation;
- F07 Source Authority Misclassification;
- F34 Evidence-Claim Mismatch, when caused by context/evidence use;
- F35 Parametric-Prior Override, when supplied context loses to learned prior;
- F48 Context Truncation Loss;
- F49 Compression-Induced Distortion;
- FF4 Weak Grounding / Source Infidelity;
- FF10 Retrieval-Conditioned Answer Failure;
- FF11 Context Availability / Continuity Failure;
- FF15 Resource / Budget-Induced Degradation, when budget affects context availability.

## Typical evaluation methods


- EM3 Context ablation / insertion testing;
- EM4 Grounding and citation evaluation;
- EM11 Stress / budget testing;
- EM13 Regression / diff testing;
- EM15 Production monitoring / drift evaluation;
- EM14 Human-review / rubric evaluation, when source relevance or state continuity requires judgment.

## Typical Layer 3 controls


- L3B1 Context Assembly Controls;
- L3B2 Retrieval Controls;
- L3B3 Source Authority and Freshness Controls;
- L3B4 Evidence Packaging Controls;
- L3C1 State Persistence Controls;
- L3C2 Memory Rehydration Controls;
- L3D6 Operating-Budget Controls;
- L3X1 Traceability Controls;
- L3X3 Runtime Monitoring Controls.

## Required traces


- prompt context snapshot;
- retrieved document IDs and chunk IDs;
- retrieval scores and ranking;
- source authority and freshness metadata;
- context packing order;
- context truncation/compression logs;
- memory read/write trace;
- workflow state before and after the run;
- tool outputs reintroduced into context.

## Common engineering trap


Collapsing several different problems into "RAG failed." Retrieval quality, context packing, source authority, freshness, prompt assembly, evidence use, memory rehydration, and answer grounding are different failure surfaces.

## Boundary notes


Use P2 when the main issue is availability, priority, provenance, freshness, or preservation of information. Use P3 when the main issue is whether generated claims, citations, or confidence are supported. Use P5 when the main issue is tool choice, tool arguments, action, or recovery.

## Common overlaps


- P1 Task Contract Failure;
- P3 Claim, Grounding, and Epistemic Failure;
- P5 Process, Tool, and Action Failure;
- P7 Reliability and Operating-Envelope Failure.

## Minimal example

```yaml
primary_family: P2 Context, State, and Evidence Availability Failure
affected_artifact: state_or_memory
failure_operator: stale
observed_behavior: system used an old user preference after the user changed it
revealed_by:
  - EM3 Context ablation / insertion testing
  - EM11 Stress / budget testing
control_gap:
  - L3C1 State Persistence Controls
  - L3C2 Memory Rehydration Controls
legacy_tags:
  - F05 Stale-State Reliance
  - FF11 Context Availability / Continuity Failure
```

# P3. Claim, Grounding, and Epistemic Failure

## Definition


Failures where generated claims, citations, justifications, explanations, confidence expressions, or self-assessments do not match evidence, truth requirements, source authority, or uncertainty requirements.

This family replaces broad use of "hallucination" with more debuggable artifact-level distinctions.

## Core question


> Did claims, citations, justifications, and confidence match evidence and truth requirements?

## Product boundary


Knowledge and grounding boundary.

This family appears wherever the product needs answers to be true, evidence-backed, source-faithful, citation-valid, uncertainty-aware, or independently verified.

## Includes


- unsupported material assertion;
- plausible but false claim;
- generated explanation that does not actually support the answer;
- fabricated citation;
- real citation that does not support the claim;
- source reference invented from style or memory;
- parametric prior overriding supplied evidence;
- high-confidence wrong answer;
- misleading certainty despite weak evidence;
- self-checking treated as independent verification;
- claim made outside product's allowed evidence base;
- answer that is true in general but not grounded in approved sources.

## Common affected artifacts


- `claim`;
- `citation_or_source_reference`;
- `evidence`;
- evidence span;
- justification;
- explanation;
- `confidence_or_uncertainty`;
- verification status;
- source-support label.

## Useful failure operators


- `invented`;
- `unsupported`;
- `overstated`;
- `misinterpreted`;
- `misweighted`;
- `stale`;
- `misclassified`;
- `ignored`;
- `overgeneralized`.

## Typical legacy tags


- F30 Unsupported Assertion;
- F31 Plausibility-Truth Gap;
- F32 Non-Grounded Justification;
- F33 Fabricated Citation/Source;
- F34 Evidence-Claim Mismatch;
- F35 Parametric-Prior Override;
- F36 Misleading Confidence Communication;
- F37 Self-Verification Misuse;
- FF3 Hallucination and Unsupported Claims;
- FF4 Weak Grounding / Source Infidelity;
- FF5 Weak Calibration and Misleading Confidence;
- FF10 Retrieval-Conditioned Answer Failure, when retrieval conditions shape the answer.

## Typical evaluation methods


- EM4 Grounding and citation evaluation;
- EM5 Truth / factuality evaluation;
- EM9 Calibration evaluation;
- EM3 Context ablation / insertion testing;
- EM13 Regression / diff testing;
- EM14 Human-review / rubric evaluation;
- EM15 Production monitoring / drift evaluation, when claim quality is monitored in production.

## Typical Layer 3 controls


- L3B3 Source Authority and Freshness Controls;
- L3B4 Evidence Packaging Controls;
- L3B5 Claim Grounding and Citation Controls;
- L3B6 Claim Verification Controls;
- L3B7 Confidence Communication Controls;
- L3D3 Competence Boundary Controls;
- L3X1 Traceability Controls;
- L3X2 Evaluation Gate Controls;
- L3X5 Human Escalation Controls.

## Required traces


- generated answer;
- extracted claim list;
- citation list;
- cited source IDs and spans;
- claim-source support labels;
- truth/reference labels where available;
- confidence expressions or confidence scores;
- verification tool results;
- abstention or uncertainty policy decision.

## Common engineering trap


Using "hallucination" as one bucket. Product debugging should separate at least five questions: did the source exist, did it support the claim, was the claim true, was the evidence allowed, and did the system communicate uncertainty correctly?

## Boundary notes


Use P3 for generated epistemic artifacts: claims, citations, explanations, and confidence. Use P2 when the primary issue is missing or stale evidence availability. Use P6 when confidence, refusal, or trust language is mainly a user-interaction or policy-boundary problem.

## Common overlaps


- P2 Context, State, and Evidence Availability Failure;
- P5 Process, Tool, and Action Failure;
- P6 Policy, Trust, and Interaction Failure;
- P7 Reliability and Operating-Envelope Failure.

## Minimal example

```yaml
primary_family: P3 Claim, Grounding, and Epistemic Failure
affected_artifact: citation_or_source_reference
failure_operator:
  - invented
  - unsupported
observed_behavior: answer cited a non-existent legal case with high certainty
revealed_by:
  - EM4 Grounding and citation evaluation
  - EM5 Truth / factuality evaluation
  - EM9 Calibration evaluation
control_gap:
  - L3B5 Claim Grounding and Citation Controls
  - L3B6 Claim Verification Controls
  - L3B7 Confidence Communication Controls
legacy_tags:
  - F33 Fabricated Citation/Source
  - F30 Unsupported Assertion
  - F36 Misleading Confidence Communication
  - FF3 Hallucination and Unsupported Claims
```

# P4. Output and Representation Contract Failure

## Definition


Failures where the emitted object violates required structure, schema, boundary, type, exactness, symbolic correctness, or downstream-use semantics.

This family covers the output as a product artifact, not merely the natural-language answer.

## Core question


> Did the emitted object satisfy structure, schema, exactness, and downstream-use requirements?

## Product boundary


Interface, parser, schema, and symbolic boundary.

This family appears where free-form generation must become a machine-readable, exact, stable, parseable, or symbolically correct artifact.

## Includes


- invalid JSON, XML, YAML, CSV, or markdown contract;
- missing required field;
- extra field;
- extra commentary around a payload;
- wrong field type;
- syntactically valid structure with wrong semantic value;
- output stops too early or continues too long;
- exact ID or URL changed;
- account number, date, key, filename, hash, enum, or legal clause corrupted;
- arithmetic, count, comparison, unit, or symbolic transform wrong;
- table columns shifted;
- code or formula altered;
- verbosity violates a required output contract.

## Common affected artifacts


- `output_payload`;
- `exact_value`;
- structured fields;
- parser output;
- schema validation result;
- enum label;
- numeric value;
- table cell;
- code block;
- tool argument payload, when the argument is judged as a structured object.

## Useful failure operators


- `malformed`;
- `corrupted`;
- `missing`;
- `invented`;
- `misclassified`;
- `misinterpreted`;
- `premature`;
- `budget-constrained`.

## Typical legacy tags


- F17 Output Contract Drift;
- F18 Output Boundary / Stopping Error;
- F19 Exact-String Corruption;
- F20 Numeric/Symbolic Fragility;
- F21 Structured-Data Semantic Error;
- F43 Verbosity Mismatch, when verbosity is part of the output contract;
- FF6 Output Contract / Schema Drift;
- FF13 Representation / Symbolic Integrity Failure;
- FF15 Resource / Budget-Induced Degradation, when resource limits degrade output shape or completeness.

## Typical evaluation methods


- EM6 Schema and parser validation;
- EM5 Truth / factuality evaluation, for numeric or symbolic correctness;
- EM11 Stress / budget testing;
- EM13 Regression / diff testing;
- EM14 Human-review / rubric evaluation, when field semantics require judgment.

## Typical Layer 3 controls


- L3A4 Output Contract and Parser Controls;
- L3A5 Symbolic / Exactness Controls;
- L3C5 Tool Argument Controls, when the structured object is a tool argument;
- L3D6 Operating-Budget Controls;
- L3X1 Traceability Controls;
- L3X2 Evaluation Gate Controls.

## Required traces


- raw model output;
- schema version;
- parser result;
- validation errors;
- field-level comparison;
- exact-value source of truth;
- deterministic checker result;
- retry or repair attempts;
- accepted final payload.

## Common engineering trap


Treating "valid JSON" as sufficient. A payload can parse and still encode the wrong object, wrong label, wrong date, wrong ID, or wrong action argument.

## Boundary notes


Use P4 when the main artifact is the emitted representation. Use P3 when the issue is unsupported factual content inside the answer. Use P5 when the same structured error occurs specifically inside a tool/action sequence and process correctness is the primary concern.

## Common overlaps


- P1 Task Contract Failure;
- P3 Claim, Grounding, and Epistemic Failure;
- P5 Process, Tool, and Action Failure;
- P7 Reliability and Operating-Envelope Failure.

## Minimal example

```yaml
primary_family: P4 Output and Representation Contract Failure
affected_artifact: exact_value
failure_operator: corrupted
observed_behavior: generated JSON used the correct schema but changed the customer ID
revealed_by:
  - EM6 Schema and parser validation
control_gap:
  - L3A5 Symbolic / Exactness Controls
legacy_tags:
  - F19 Exact-String Corruption
  - F21 Structured-Data Semantic Error
  - FF13 Representation / Symbolic Integrity Failure
```

# P5. Process, Tool, and Action Failure

## Definition


Failures where multi-step reasoning, planning, tool selection, tool arguments, tool-result interpretation, state transition, external action, or recovery behavior is wrong.

This family covers systems where correctness depends on process, not just final text.

## Core question


> Did planning, tool use, state transition, action readiness, or recovery fail?

## Product boundary


State, process, and action boundary.

This family appears when the AI system participates in a workflow: it plans, decomposes, calls tools, reads tool outputs, updates state, triggers external effects, retries, escalates, or recovers.

## Includes


- plan drifts from goal;
- invalid task decomposition;
- invariant lost across steps;
- premature stopping;
- repeated loop;
- wrong tool selected;
- needed tool omitted;
- unnecessary tool called;
- correct tool with wrong arguments;
- tool output misread;
- tool error ignored;
- action prepared without evidence;
- action executed without authorization;
- transaction performed without rollback boundary;
- no fallback after missing data;
- no recovery after validation failure.

## Common affected artifacts


- `reasoning_or_plan`;
- `tool_call`;
- `tool_arguments`;
- `tool_result_interpretation`;
- `state_or_memory`;
- `external_action`;
- checkpoint decision;
- recovery path;
- transaction boundary;
- authorization state.

## Useful failure operators


- `misinterpreted`;
- `misclassified`;
- `malformed`;
- `corrupted`;
- `premature`;
- `unauthorized`;
- `unrecovered`;
- `ignored`;
- `missing`;
- `overgeneralized`;
- `budget-constrained`.

## Typical legacy tags


- F22 Local Plausibility Drift;
- F23 Generated Path Lock-In;
- F24 Error Accumulation;
- F25 Invariant Loss;
- F26 Plan Drift;
- F27 Spurious Decomposition;
- F28 Premature Finalization;
- F29 Looping/Repetition;
- F37 Self-Verification Misuse, when self-checking is used as a process step;
- F51 Tool-Selection Error;
- F52 Tool-Argument Error;
- F53 Tool-Output Misinterpretation;
- F54 Action-Readiness Error;
- F55 Recovery Failure;
- FF9 Agentic Process Failure;
- FF12 Reasoning / Planning Integrity Failure;
- FF13 Representation / Symbolic Integrity Failure, when exact arguments or identifiers matter.

## Typical evaluation methods


- EM7 Reasoning / process evaluation;
- EM8 Agent trace evaluation;
- EM6 Schema and parser validation, for tool arguments and action payloads;
- EM10 Safety and policy adversarial testing, for high-risk actions;
- EM11 Stress / budget testing;
- EM13 Regression / diff testing;
- EM15 Production monitoring / drift evaluation.

## Typical Layer 3 controls


- L3C3 Planning and Process Integrity Controls;
- L3C4 Tool Selection Controls;
- L3C5 Tool Argument Controls;
- L3C6 Tool Output Interpretation Controls;
- L3C7 Recovery and Retry Controls;
- L3C8 Action Authorization Controls;
- L3C9 Transaction and Rollback Controls;
- L3D4 Routing and Fallback Controls;
- L3X1 Traceability Controls;
- L3X5 Human Escalation Controls.

## Required traces


- plan or decomposition;
- step trace;
- tool availability at each step;
- selected tool and omitted alternatives where available;
- tool arguments;
- tool result;
- tool error status;
- state before and after tool calls;
- authorization and confirmation checks;
- retries, fallbacks, or escalations;
- final external action or blocked action.

## Common engineering trap


Judging an agentic workflow by final answer quality alone. A correct final answer does not prove that the process was safe, authorized, efficient, recoverable, or repeatable.

## Boundary notes


Use P5 when process correctness matters. Use P4 when the main failure is the representation of a payload independent of process. Use P6 when the main failure is policy, refusal, privacy, or trust-boundary behavior. Use P7 when the process works in one run but fails across runs, budgets, slices, or versions.

## Common overlaps


- P1 Task Contract Failure;
- P2 Context, State, and Evidence Availability Failure;
- P4 Output and Representation Contract Failure;
- P6 Policy, Trust, and Interaction Failure;
- P7 Reliability and Operating-Envelope Failure.

## Minimal example

```yaml
primary_family: P5 Process, Tool, and Action Failure
affected_artifact: tool_arguments
failure_operator:
  - corrupted
  - premature
observed_behavior: system selected the right calendar tool but sent the wrong date without confirming an ambiguous "tomorrow"
revealed_by:
  - EM8 Agent trace evaluation
  - EM6 Schema and parser validation
  - EM10 Safety and policy adversarial testing
control_gap:
  - L3C5 Tool Argument Controls
  - L3C8 Action Authorization Controls
legacy_tags:
  - F52 Tool-Argument Error
  - F54 Action-Readiness Error
  - FF9 Agentic Process Failure
```

# P6. Policy, Trust, and Interaction Failure

## Definition


Failures where the system mishandles safety, refusal, authorization, privacy, sensitive data, prompt-injection resistance, clarification, escalation, tone, verbosity, persona, or user-facing trust behavior.

This family covers product behavior at the boundary between assistant behavior and user trust.

## Core question


> Did the system handle safety, refusal, authorization, privacy, clarification, tone, and trust boundaries correctly?

## Product boundary


Policy, trust, and interaction boundary.

This family appears where behavior is governed by product policy, safety requirements, authorization, compliance, privacy expectations, escalation rules, or user-experience contracts.

## Includes


- prompt-injection compliance;
- untrusted text treated as operative instruction;
- unsafe compliance;
- refusal when the request should be allowed;
- failure to refuse, warn, narrow, or escalate;
- privacy leak;
- missing authorization check;
- overconfident user-facing statement in a high-risk context;
- sycophantic agreement with false or unsafe premise;
- unnecessary clarification blocks progress;
- failure to clarify before risky assumption;
- tone/persona inconsistent with product expectations;
- verbosity too high or too low for risk level;
- inconsistent escalation behavior.

## Common affected artifacts


- `policy_decision`;
- refusal/allow/escalate decision;
- authorization state;
- privacy boundary;
- sensitive data field;
- `interaction_behavior`;
- clarification decision;
- warning/caveat;
- trust-boundary label;
- user-facing confidence language.

## Useful failure operators


- `misclassified`;
- `misweighted`;
- `contaminated`;
- `unauthorized`;
- `overstated`;
- `ignored`;
- `premature`;
- `unstable`;
- `unrecovered`.

## Typical legacy tags


- F15 Control/Data Confusion, when it crosses a trust boundary;
- F16 Prompt-Injection Compliance;
- F36 Misleading Confidence Communication, when user-facing trust is the main failure;
- F38 Sycophantic Agreement;
- F39 Over-Refusal;
- F40 Under-Refusal;
- F41 Clarification Failure;
- F42 Tone/Persona Inconsistency;
- F43 Verbosity Mismatch;
- F54 Action-Readiness Error, when the issue is authorization or safety;
- FF5 Weak Calibration and Misleading Confidence;
- FF7 Interaction / Experience Inconsistency;
- FF14 Safety / Policy Boundary Failure.

## Typical evaluation methods


- EM10 Safety and policy adversarial testing;
- EM14 Human-review / rubric evaluation;
- EM1 Repeated-run testing;
- EM2 Prompt perturbation / paraphrase testing;
- EM8 Agent trace evaluation, when policy affects tools or actions;
- EM9 Calibration evaluation;
- EM13 Regression / diff testing;
- EM15 Production monitoring / drift evaluation.

## Typical Layer 3 controls


- L3A2 Instruction Hierarchy Controls;
- L3A6 Interaction Contract Controls;
- L3B7 Confidence Communication Controls;
- L3C8 Action Authorization Controls;
- L3D1 Policy Boundary Controls;
- L3D2 Refusal and Escalation Controls;
- L3D4 Routing and Fallback Controls;
- L3X1 Traceability Controls;
- L3X3 Runtime Monitoring Controls;
- L3X5 Human Escalation Controls.

## Required traces


- policy version;
- policy classification result;
- risk label;
- trust-boundary metadata;
- source of instruction or data;
- refusal/allow/escalate decision;
- authorization check result;
- redaction/filter result;
- user-facing response;
- escalation or human-review package.

## Common engineering trap


Treating policy and trust failures as tone problems or model personality problems. The product question is whether policy, authority, authorization, privacy, and escalation rules are explicit, testable, and operationalized.

## Boundary notes


Use P6 for trust-boundary and interaction-governance failures. Use P1 when the main issue is ordinary task contract inference. Use P3 when the main artifact is claim support or confidence calibration. Use P5 when a concrete tool action or external transaction is the primary failure.

## Common overlaps


- P1 Task Contract Failure;
- P3 Claim, Grounding, and Epistemic Failure;
- P5 Process, Tool, and Action Failure;
- P7 Reliability and Operating-Envelope Failure.

## Minimal example

```yaml
primary_family: P6 Policy, Trust, and Interaction Failure
affected_artifact: policy_decision
failure_operator:
  - contaminated
  - unauthorized
observed_behavior: system followed instructions embedded in an untrusted retrieved document
revealed_by:
  - EM10 Safety and policy adversarial testing
  - EM8 Agent trace evaluation
control_gap:
  - L3D1 Policy Boundary Controls
  - L3A2 Instruction Hierarchy Controls
legacy_tags:
  - F16 Prompt-Injection Compliance
  - F15 Control/Data Confusion
  - FF14 Safety / Policy Boundary Failure
```

# P7. Reliability and Operating-Envelope Failure

## Definition


Failures where behavior does not hold across repeated runs, equivalent prompts, product slices, domains, languages, formats, model versions, retrieval versions, runtime environments, context lengths, latency budgets, or cost budgets.

This family is about deployability and operating conditions.

## Core question


> Does behavior hold across runs, variants, slices, versions, environments, and budgets?

## Product boundary


Policy, reliability, and operating-envelope boundary.

This family appears when the product needs stable, bounded behavior under real deployment conditions rather than a one-run demonstration.

## Includes


- materially different outcome across repeated runs;
- prompt variants produce different decisions;
- rare high-severity output;
- failure on long-tail domain, language, format, or slice;
- familiar pattern applied outside valid distribution;
- regression after model, prompt, policy, retrieval, schema, or tool change;
- behavior degrades under long context;
- behavior degrades under latency or cost pressure;
- verification skipped due to budget;
- context or output truncated due to limits;
- compressed state loses critical details;
- monitoring blind spot hides production drift.

## Common affected artifacts


- `operating_condition`;
- scenario outcome;
- slice label;
- model version;
- prompt version;
- retrieval index version;
- policy version;
- budget configuration;
- latency/cost envelope;
- context length;
- regression result;
- monitoring signal;
- production trace.

## Useful failure operators


- `unstable`;
- `overgeneralized`;
- `budget-constrained`;
- `missing`;
- `ignored`;
- `stale`;
- `corrupted`;
- `unrecovered`;
- `premature`.

## Typical legacy tags


- F08 Prompt-Surface Fragility, when viewed as reliability under prompt variation;
- F44 Competence Cliff;
- F45 Distributional Overgeneralization;
- F46 Behavioral Outcome Variance;
- F47 Tail-Risk Generation;
- F48 Context Truncation Loss;
- F49 Compression-Induced Distortion;
- F50 Budget-Induced Degradation;
- F55 Recovery Failure, when recovery collapses under operating conditions;
- FF1 Behavioral Instability;
- FF8 Distributional Competence Failure;
- FF15 Resource / Budget-Induced Degradation.

## Typical evaluation methods


- EM1 Repeated-run testing;
- EM2 Prompt perturbation / paraphrase testing;
- EM11 Stress / budget testing;
- EM12 Distributional slice testing;
- EM13 Regression / diff testing;
- EM15 Production monitoring / drift evaluation;
- EM10 Safety and policy adversarial testing, when rare failures are high-risk;
- EM14 Human-review / rubric evaluation, when slice-specific quality is semantic.

## Typical Layer 3 controls


- L3D3 Competence Boundary Controls;
- L3D4 Routing and Fallback Controls;
- L3D5 Stability Controls;
- L3D6 Operating-Budget Controls;
- L3D7 Deployment and Version Controls;
- L3X1 Traceability Controls;
- L3X2 Evaluation Gate Controls;
- L3X3 Runtime Monitoring Controls;
- L3X4 Incident Review Controls;
- L3X5 Human Escalation Controls.

## Required traces


- scenario ID;
- run ID;
- seed/configuration where available;
- model version;
- prompt version;
- retrieval/index version;
- tool version;
- policy version;
- runtime environment;
- latency/cost/context budget;
- slice labels;
- baseline and candidate outputs;
- behavioral-equivalence labels;
- production-monitoring metrics.

## Common engineering trap


Treating one successful demo as reliability evidence. A product needs outcome stability across realistic variation, representative slices, budget pressure, and release changes.

## Boundary notes


Use P7 when the same underlying failure becomes visible as a deployability or operating-envelope problem. Use the more specific family as primary when a single incident has an obvious artifact, such as claim, output payload, or tool argument.

## Common overlaps


- P1 Task Contract Failure;
- P2 Context, State, and Evidence Availability Failure;
- P3 Claim, Grounding, and Epistemic Failure;
- P4 Output and Representation Contract Failure;
- P5 Process, Tool, and Action Failure;
- P6 Policy, Trust, and Interaction Failure.

## Minimal example

```yaml
primary_family: P7 Reliability and Operating-Envelope Failure
affected_artifact: scenario_outcome
failure_operator: unstable
observed_behavior: same escalation scenario produced different escalation decisions across repeated runs
revealed_by:
  - EM1 Repeated-run testing
  - EM13 Regression / diff testing
control_gap:
  - L3D5 Stability Controls
  - L3X2 Evaluation Gate Controls
legacy_tags:
  - F46 Behavioral Outcome Variance
  - FF1 Behavioral Instability
```

# Legacy FF-family mapping


The existing `FFx` families can be retained as secondary tags. This table maps them into the product-facing families.

| Legacy family | Product-family mapping |
|---|---|
| FF1 Behavioral Instability | P7 primary; may overlap with P1, P3, P5, or P6 depending on the unstable artifact. |
| FF2 Task / Instruction Misinduction | P1 primary. |
| FF3 Hallucination and Unsupported Claims | P3 primary. |
| FF4 Weak Grounding / Source Infidelity | P3 primary when claim/source support is wrong; P2 primary when evidence availability or prioritization is wrong. |
| FF5 Weak Calibration and Misleading Confidence | P3 primary for epistemic calibration; P6 primary for user-facing trust behavior. |
| FF6 Output Contract / Schema Drift | P4 primary. |
| FF7 Interaction / Experience Inconsistency | P6 primary; P1 secondary when interaction failure comes from wrong task contract. |
| FF8 Distributional Competence Failure | P7 primary. |
| FF9 Agentic Process Failure | P5 primary. |
| FF10 Retrieval-Conditioned Answer Failure | P2 primary for retrieval/context conditions; P3 primary for answer grounding; P7 secondary for environment-sensitive retrieval behavior. |
| FF11 Context Availability / Continuity Failure | P2 primary; P7 secondary when caused by scale, truncation, or operating limits. |
| FF12 Reasoning / Planning Integrity Failure | P5 primary. |
| FF13 Representation / Symbolic Integrity Failure | P4 primary; P5 secondary when it occurs inside tool/action workflows. |
| FF14 Safety / Policy Boundary Failure | P6 primary. |
| FF15 Resource / Budget-Induced Degradation | P7 primary; may overlap with P2, P4, or P5 depending on the degraded artifact. |

# Legacy F-code mapping


Use this table to keep backward compatibility with `fault-inventory.md`. The `P` family should be the primary product-debugging category; `Fxx` should be used as a legacy tag or subtype.

| Legacy code | Legacy name | Primary product family | Common secondary families | Common operators |
|---|---|---|---|---|
| F01 | Context Omission | P2 | P7 | missing |
| F02 | Context Underutilization | P2 | P3 | ignored |
| F03 | Context Priority Misweighting | P2 | P3, P6 | misweighted |
| F04 | Continuity Loss | P2 | P5, P7 | missing, stale |
| F05 | Stale-State Reliance | P2 | P7 | stale |
| F06 | Distractor Assimilation | P2 | P3 | contaminated |
| F07 | Source Authority Misclassification | P2 | P3, P6 | misclassified, misweighted |
| F08 | Prompt-Surface Fragility | P1 | P7 | unstable, misinterpreted |
| F09 | Task Misinduction | P1 | P5 | misinterpreted |
| F10 | Task Blending | P1 | P4, P5 | misinterpreted, contaminated |
| F11 | Scope Misinterpretation | P1 | P3, P5 | misinterpreted |
| F12 | Constraint Misclassification | P1 | P4, P6 | misclassified |
| F13 | Example Overgeneralization | P1 | P7 | overgeneralized |
| F14 | Example Underuse | P1 | P4 | ignored |
| F15 | Control/Data Confusion | P1 | P2, P6 | misclassified, contaminated |
| F16 | Prompt-Injection Compliance | P6 | P1, P2, P5 | contaminated, unauthorized |
| F17 | Output Contract Drift | P4 | P1 | malformed |
| F18 | Output Boundary / Stopping Error | P4 | P5, P7 | malformed, premature |
| F19 | Exact-String Corruption | P4 | P5 | corrupted |
| F20 | Numeric/Symbolic Fragility | P4 | P5, P7 | corrupted |
| F21 | Structured-Data Semantic Error | P4 | P5 | misclassified, corrupted |
| F22 | Local Plausibility Drift | P5 | P3 | overgeneralized, unsupported |
| F23 | Generated Path Lock-In | P5 | P3 | premature, misinterpreted |
| F24 | Error Accumulation | P5 | P3, P4 | corrupted, unsupported |
| F25 | Invariant Loss | P5 | P1, P4 | ignored, misweighted |
| F26 | Plan Drift | P5 | P1, P7 | misinterpreted, overgeneralized |
| F27 | Spurious Decomposition | P5 | P1 | overgeneralized, premature |
| F28 | Premature Finalization | P5 | P3, P4 | premature |
| F29 | Looping/Repetition | P5 | P7 | unrecovered, unstable |
| F30 | Unsupported Assertion | P3 | P2 | unsupported |
| F31 | Plausibility-Truth Gap | P3 | P7 | unsupported, overgeneralized |
| F32 | Non-Grounded Justification | P3 | P5 | unsupported, overstated |
| F33 | Fabricated Citation/Source | P3 | P7 | invented |
| F34 | Evidence-Claim Mismatch | P3 | P2 | unsupported, misinterpreted |
| F35 | Parametric-Prior Override | P3 | P2, P7 | misweighted, stale |
| F36 | Misleading Confidence Communication | P3 | P6 | overstated |
| F37 | Self-Verification Misuse | P3 | P5 | unsupported, overstated |
| F38 | Sycophantic Agreement | P6 | P3 | misweighted, overstated |
| F39 | Over-Refusal | P6 | P7 | misclassified |
| F40 | Under-Refusal | P6 | P5 | misclassified, unauthorized |
| F41 | Clarification Failure | P6 | P1, P2 | premature, misclassified |
| F42 | Tone/Persona Inconsistency | P6 | P7 | unstable, misclassified |
| F43 | Verbosity Mismatch | P6 | P4, P7 | misclassified, budget-constrained |
| F44 | Competence Cliff | P7 | P3, P4, P5 | overgeneralized |
| F45 | Distributional Overgeneralization | P7 | P1, P3 | overgeneralized |
| F46 | Behavioral Outcome Variance | P7 | P1, P5, P6 | unstable |
| F47 | Tail-Risk Generation | P7 | P3, P6 | unstable |
| F48 | Context Truncation Loss | P2 | P7 | missing, budget-constrained |
| F49 | Compression-Induced Distortion | P2 | P7 | corrupted, budget-constrained |
| F50 | Budget-Induced Degradation | P7 | P2, P3, P5 | budget-constrained |
| F51 | Tool-Selection Error | P5 | P1 | misclassified |
| F52 | Tool-Argument Error | P5 | P4, P6 | malformed, corrupted |
| F53 | Tool-Output Misinterpretation | P5 | P2, P3 | misinterpreted |
| F54 | Action-Readiness Error | P5 | P6 | premature, unauthorized |
| F55 | Recovery Failure | P5 | P7 | unrecovered |

# Product incident record template


Use this schema for bugs, eval failures, production incidents, and postmortems.

```yaml
incident_id: string
product_surface: chat | search | copilot | agent | workflow | API | other
user_goal: string

observed_behavior: string
expected_behavior: string

classification:
  primary_family: P1 | P2 | P3 | P4 | P5 | P6 | P7
  secondary_families: []
  affected_artifact:
    type: task_contract | instruction_set | context_packet | state_or_memory | evidence | claim | citation_or_source_reference | confidence_or_uncertainty | output_payload | exact_value | reasoning_or_plan | tool_call | tool_arguments | tool_result_interpretation | external_action | policy_decision | interaction_behavior | operating_condition
    identifier: string
    location: user_input | prompt_assembly | retrieval | memory | generation | validator | tool | state_store | policy_layer | UI | monitor
  failure_operators:
    - missing
    - ignored
    - misweighted
    - stale
    - contaminated
    - misclassified
    - misinterpreted
    - malformed
    - corrupted
    - invented
    - unsupported
    - overstated
    - overgeneralized
    - unstable
    - premature
    - unauthorized
    - unrecovered
    - budget-constrained
  legacy_tags:
    - Fxx
    - FFx

trace_evidence:
  prompt_version: string
  model_version: string
  retrieval_index_version: string
  policy_version: string
  tool_versions: []
  runtime_config: string
  context_snapshot: string
  source_spans: []
  tool_trace: string
  validator_trace: string
  state_before: string
  state_after: string
  run_ids: []
  production_links: []

evaluation:
  methods:
    - EM1 repeated_run
    - EM2 prompt_perturbation
    - EM3 context_ablation_insertion
    - EM4 grounding_and_citation
    - EM5 truth_factuality
    - EM6 schema_parser
    - EM7 reasoning_process
    - EM8 agent_trace
    - EM9 calibration
    - EM10 safety_policy
    - EM11 stress_budget
    - EM12 distributional_slice
    - EM13 regression_diff
    - EM14 human_rubric
    - EM15 production_monitoring
  oracle: string
  expected_invariants: []
  result: pass | fail | inconclusive

control_gap:
  missing_or_weak_controls: []
  proposed_controls: []
  control_roles:
    - prevent
    - detect
    - recover
    - monitor
    - prove

severity:
  user_impact: none | minor | material | safety | compliance | irreversible_action
  recurrence_risk: low | medium | high
  confidence: low | medium | high

owner: string
status: open | investigating | mitigated | fixed | accepted_risk
```

# Classification workflow


Use this workflow during product debugging.

## 1. Start from the observed behavior


Write the observed behavior and expected behavior before assigning labels.

```text
Observed:
  The system cited a source that does not exist.

Expected:
  The system should cite only supplied or verifiable sources, or abstain.
```

## 2. Pick the affected artifact


Choose the artifact that was materially wrong.

```text
citation_or_source_reference
```

## 3. Pick the primary product family


Choose the family by the artifact and product boundary.

```text
P3 Claim, Grounding, and Epistemic Failure
```

## 4. Add failure operators


Describe what happened to the artifact.

```text
invented
unsupported
overstated
```

## 5. Add evaluation methods


Choose how the failure should be revealed or reproduced.

```text
EM4 Grounding and citation evaluation
EM5 Truth / factuality evaluation
EM9 Calibration evaluation
```

## 6. Add Layer 3 control gaps


Map the family to missing or weak controls.

```text
L3B5 Claim Grounding and Citation Controls
L3B6 Claim Verification Controls
L3B7 Confidence Communication Controls
```

## 7. Add legacy tags last


Use Fxx and FFx tags for searchability and backward compatibility.

```text
F33 Fabricated Citation/Source
F30 Unsupported Assertion
F36 Misleading Confidence Communication
FF3 Hallucination and Unsupported Claims
```

# Debug examples

## Example 1: Fabricated citation

```yaml
observed_behavior: answer cites a non-existent case
expected_behavior: answer cites only verified cases or says no source is available
primary_family: P3 Claim, Grounding, and Epistemic Failure
secondary_families:
  - P7 Reliability and Operating-Envelope Failure
artifact:
  type: citation_or_source_reference
  identifier: generated_case_citation
failure_operators:
  - invented
  - unsupported
evaluation_methods:
  - EM4 Grounding and citation evaluation
  - EM5 Truth / factuality evaluation
control_gaps:
  - L3B5 Claim Grounding and Citation Controls
  - L3B6 Claim Verification Controls
legacy_tags:
  - F33 Fabricated Citation/Source
  - F30 Unsupported Assertion
  - FF3 Hallucination and Unsupported Claims
```

## Example 2: Wrong tool argument

```yaml
observed_behavior: system selected the right CRM update tool but used the wrong account ID
expected_behavior: system should preserve the account ID from the selected record and validate it before write
primary_family: P5 Process, Tool, and Action Failure
secondary_families:
  - P4 Output and Representation Contract Failure
artifact:
  type: tool_arguments
  identifier: account_id
failure_operators:
  - corrupted
  - unauthorized
evaluation_methods:
  - EM8 Agent trace evaluation
  - EM6 Schema and parser validation
  - EM10 Safety and policy adversarial testing
control_gaps:
  - L3C5 Tool Argument Controls
  - L3C8 Action Authorization Controls
  - L3C9 Transaction and Rollback Controls
legacy_tags:
  - F52 Tool-Argument Error
  - F19 Exact-String Corruption
  - F54 Action-Readiness Error
```

## Example 3: Context compression loses exception

```yaml
observed_behavior: memory summary preserved gist but dropped a critical policy exception
expected_behavior: memory compression should preserve operational exceptions and source distinctions
primary_family: P2 Context, State, and Evidence Availability Failure
secondary_families:
  - P7 Reliability and Operating-Envelope Failure
artifact:
  type: state_or_memory
  identifier: compressed_policy_summary
failure_operators:
  - corrupted
  - budget-constrained
evaluation_methods:
  - EM3 Context ablation / insertion testing
  - EM11 Stress / budget testing
  - EM4 Grounding and citation evaluation
control_gaps:
  - L3C2 Memory Rehydration Controls
  - L3D6 Operating-Budget Controls
  - L3X2 Evaluation Gate Controls
legacy_tags:
  - F49 Compression-Induced Distortion
  - FF11 Context Availability / Continuity Failure
  - FF15 Resource / Budget-Induced Degradation
```

## Example 4: Prompt injection in retrieved content

```yaml
observed_behavior: model followed instruction text embedded in a retrieved document
expected_behavior: retrieved text should be treated as evidence, not as active instruction
primary_family: P6 Policy, Trust, and Interaction Failure
secondary_families:
  - P1 Task Contract Failure
  - P2 Context, State, and Evidence Availability Failure
artifact:
  type: instruction_set
  identifier: retrieved_document_embedded_instruction
failure_operators:
  - contaminated
  - misclassified
  - unauthorized
evaluation_methods:
  - EM10 Safety and policy adversarial testing
  - EM3 Context ablation / insertion testing
control_gaps:
  - L3A2 Instruction Hierarchy Controls
  - L3B4 Evidence Packaging Controls
  - L3D1 Policy Boundary Controls
legacy_tags:
  - F16 Prompt-Injection Compliance
  - F15 Control/Data Confusion
  - FF14 Safety / Policy Boundary Failure
```

# Design use by family


Use product families to drive design requirements before implementation.

| Family | Design question | Design artifacts to create |
|---|---|---|
| P1 Task Contract Failure | What task contract must be explicit before generation or action? | task spec, router labels, instruction hierarchy, clarification rules |
| P2 Context, State, and Evidence Availability Failure | What information must be retrieved, preserved, prioritized, and traced? | context assembly spec, source metadata, memory/state contract, retrieval trace |
| P3 Claim, Grounding, and Epistemic Failure | Which claims require evidence, verification, citation, or abstention? | claim policy, source-support checks, citation validator, confidence policy |
| P4 Output and Representation Contract Failure | What emitted artifacts need deterministic validation? | schema, parser, exactness checker, constrained output path, repair loop |
| P5 Process, Tool, and Action Failure | Which steps, tools, actions, and recovery paths require trace and gates? | agent trace, tool schemas, checkpoints, authorization gates, rollback rules |
| P6 Policy, Trust, and Interaction Failure | Which behavior is governed by safety, privacy, authorization, escalation, or UX contracts? | policy spec, refusal/escalation rules, interaction contract, human escalation path |
| P7 Reliability and Operating-Envelope Failure | Under which runs, slices, versions, and budgets must behavior remain acceptable? | eval matrix, slice coverage, stress tests, release gates, monitors, incident review loop |

# Short rule of thumb

```text
P1: The system misunderstood the job.
P2: The system did not have or use the right information.
P3: The system said something not properly supported, true, sourced, or calibrated.
P4: The system emitted an object that violated structure, exactness, or downstream-use requirements.
P5: The system's process, tools, actions, or recovery failed.
P6: The system mishandled trust, policy, safety, authorization, or interaction behavior.
P7: The behavior did not hold under real operating variation.
```
