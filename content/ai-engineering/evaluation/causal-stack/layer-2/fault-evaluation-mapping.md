---
draft: false
toc: true
title: "Fault Evaluation Mapping"
linkTitle: "Fault Evaluation Mapping"
---
# Layer 2 Evaluation Mapping

## Purpose


This document maps **Layer 2 feature-derived fault modes** to evaluation methods.

Layer 2 fault modes describe recurring behavioral failure patterns that arise downstream of Layer 1A mechanisms, Layer 1B learned or behavioral LLM features, and Layer 1C AI-system-level causal features. This document answers a different question:

> Given a Layer 2 fault mode, how do we detect it, measure it, reproduce it, or decide whether the behavior is acceptable?

This document does **not** define:

- the Layer 2 fault inventory itself;
- Layer 3 system controls;
- product or business impacts;
- benchmark suites;
- model-specific scorecards.

Those belong in adjacent documents.

```text
Layer 0
  -> interface conditions that shape how meaning must be inferred

Layer 1A / 1B / 1C
  -> why the fault is possible

Layer 2 fault inventory
  -> what behavioral fault occurred

Layer 2 evaluation mapping
  -> how to detect, measure, or reproduce the fault

Layer 3 control families
  -> what system controls reduce or recover from the fault

Layer 4 impact mapping
  -> why the fault matters to users, business, safety, or operations
```


AI systems must be evaluated empirically because end-to-end behavior cannot be trusted from implementation structure alone. The practical consequence is that evaluation has to observe behavior under repeated runs, perturbations, slice variation, context changes, and realistic process conditions rather than relying only on exact-match or one-run checks.

## Evaluation principles

### 1. Evaluate behavior, not surface text alone


Many LLM outputs can differ in wording while preserving the same intended behavior. Conversely, two outputs can look similar while differing in decision, escalation, citation, tool use, refusal behavior, or external action.

Evaluations should judge the behavior that matters for the task.

```text
Weak evaluation:
  Did the output text exactly match the reference?

Stronger evaluation:
  Did the output preserve the intended facts, decision, evidence use,
  policy behavior, tool calls, and user-facing commitments?
```

### 2. Use task-specific quality criteria


There is often no single exact answer. Evaluation criteria should be defined per task.

Examples:

- factuality;
- completeness;
- relevance;
- grounding;
- decision accuracy;
- policy compliance;
- schema validity;
- tool-call correctness;
- tone or product fit;
- action safety.

### 3. Prefer repeatable scenarios over one-off demos


A single successful run only proves that the system worked once. Repeated-run, perturbation, regression, and slice evaluations are needed to expose instability and rare failures.

### 4. Separate retrieval quality from generation quality


In retrieval-augmented systems, a bad answer may result from:

```text
retrieval failed
  -> the right evidence was not available

generation failed
  -> the right evidence was available but ignored, distorted, or overruled
```


These should be evaluated separately where traces allow.

### 5. Evaluate final outputs and intermediate process where relevant


For simple answer generation, final-output evaluation may be sufficient.

For agents, tool use, RAG, multi-step workflows, and high-stakes decisions, evaluation should also inspect:

- retrieved documents;
- prompt assembly;
- tool calls;
- tool arguments;
- tool outputs;
- intermediate state;
- action decisions;
- recovery behavior.

### 6. Distinguish fault detection from fault mitigation


This document defines evaluation mappings.

Layer 3 defines controls.

```text
Layer 2 fault:
  unsupported assertion

Evaluation mapping:
  grounding check, claim-source entailment, citation-support test

Layer 3 control:
  citation validator, retrieval grounding policy, abstention rule,
  source whitelist, human review
```

### 7. Evaluate material differences


For many tasks, harmless variation is acceptable.

Material differences include changes in:

- final answer;
- classification;
- risk level;
- escalation decision;
- refusal or compliance behavior;
- evidence used;
- tool calls;
- tool arguments;
- external action;
- user-facing commitment.

### 8. Keep exact-match tests where exactness matters


Exact-match tests are still appropriate for:

- IDs;
- quoted strings;
- numerical values;
- code tokens;
- schema keys;
- citations;
- API parameters;
- regulated wording;
- contractual or legal text that must be preserved.

The point is not to reject exact tests. The point is to use them only where the task requires exactness.

## Evaluation object model


An evaluation may inspect one or more of the following objects.

| Object | Examples |
|---|---|
| **Input** | user request, task case, document, question |
| **Prompt / task contract** | system prompt, developer prompt, tool instructions, schema |
| **Retrieved context** | chunks, documents, source metadata, ranking |
| **Conversation state** | prior turns, memory, project state, session state |
| **Generated answer** | final assistant response |
| **Claims** | factual assertions extracted from the answer |
| **Citations / evidence links** | source IDs, quotes, document references |
| **Output structure** | JSON, XML, table, bullets, schema fields |
| **Reasoning or plan trace** | visible plan, hidden trace substitute, task steps, scratchpad proxy |
| **Tool calls** | selected tool, call order, call timing |
| **Tool arguments** | parameters, filters, IDs, dates, amounts |
| **Tool outputs** | API response, search results, database rows, errors |
| **Actions taken** | email sent, record modified, ticket escalated, purchase initiated |
| **Refusal / escalation behavior** | comply, refuse, warn, ask clarification, escalate |
| **Confidence language** | certainty, uncertainty, probability, caveats |
| **Runtime budget** | latency, token count, context length, cost, retry count |
| **Repeated-run distribution** | variation across repeated executions |

## Evaluation method families

### EM1. Repeated-Run Evaluation


Runs the same scenario multiple times under nominally identical conditions.

**Catches:**

- repeatability variance;
- rare bad samples;
- unstable decisions;
- unstable tool use;
- unstable refusal or escalation behavior;
- tail-risk generation.

**Typical outputs:**

- pass rate;
- variance rate;
- severe-failure rate;
- behavioral equivalence rate;
- distribution of decisions or tool calls.

### EM2. Perturbation / Paraphrase Evaluation


Runs semantically similar or operationally equivalent variants of a scenario.

**Catches:**

- prompt-form sensitivity;
- behavioral fragility;
- task misinduction;
- unstable policy application;
- overfitting to wording;
- brittle tool routing.

**Perturbations may vary:**

- wording;
- order;
- formatting;
- examples;
- document order;
- synonym choice;
- verbosity;
- irrelevant details;
- conversation history.

### EM3. Context Ablation / Insertion Evaluation


Adds, removes, reorders, or distracts context to test whether the system uses the right information.

**Catches:**

- context omission;
- context underutilization;
- context priority confusion;
- distractor assimilation;
- source-priority confusion;
- parametric-prior override.

**Common variants:**

- evidence present vs absent;
- critical span near top, middle, or bottom;
- relevant plus irrelevant chunks;
- conflicting sources with known authority order;
- context with explicit exceptions.

### EM4. Grounding / Evidence Evaluation


Checks whether generated claims are supported by approved evidence.

**Catches:**

- unsupported assertions;
- hallucinated facts;
- non-grounded justification;
- fabricated citations;
- evidence-claim mismatch;
- source infidelity.

**Typical steps:**

1. Extract claims from the output.
2. Identify cited or available evidence.
3. Check whether evidence supports each claim.
4. Score unsupported, contradicted, or overextended claims.

### EM5. Truth / Factuality Evaluation


Evaluates whether generated claims are actually true, regardless of whether support was supplied in the current context.

**Catches:**

- plausible but false claims;
- outdated claims;
- wrong labels or extracted facts;
- false calculations or transformations;
- domain-specific correctness failures.

**Common oracles:**

- gold labels;
- trusted references;
- expert review;
- tool-backed verification.

### EM6. Schema / Parser Validation


Checks whether the output satisfies a required structure.

**Catches:**

- output-format drift;
- invalid JSON/XML/YAML;
- missing fields;
- extra fields;
- wrong field types;
- boundary/stopping errors;
- malformed tool arguments.

**Important distinction:**

```text
Parser validation:
  Is the object syntactically valid?

Semantic validation:
  Are the field values correct for the task?
```


Both may be required.

### EM7. Reasoning / Process Evaluation


Evaluates whether reasoning, decomposition, intermediate checks, and visible process preserve the task constraints and goal.

**Catches:**

- wrong decisions despite fluent wording;
- scope loss;
- constraint loss;
- premature closure;
- spurious decomposition;
- path dependence;
- error accumulation.

**Evaluation objects:**

- visible plans;
- intermediate artifacts;
- checklists;
- structured reasoning traces;
- externally reconstructed process steps.

### EM8. Agent Trace Evaluation


Evaluates tool-using or action-taking behavior through traces.

**Catches:**

- wrong tool choice;
- missing tool call;
- unnecessary tool call;
- wrong tool arguments;
- tool-output misinterpretation;
- loops;
- premature stopping;
- unsafe action;
- recovery failure.

**Trace objects:**

- tool selected;
- call order;
- arguments;
- response;
- retries;
- state updates;
- final action;
- error handling.

### EM9. Calibration Evaluation


Checks whether confidence or uncertainty language tracks correctness.

**Catches:**

- high-confidence wrong answers;
- over-hedged correct answers;
- inconsistent confidence;
- unsupported certainty;
- self-evaluation treated as verification.

**Possible measures:**

- accuracy by confidence bucket;
- expected calibration error;
- abstention quality;
- uncertainty appropriateness;
- confidence stability across repeated runs.

### EM10. Safety / Policy Evaluation


Tests whether the system follows safety, policy, compliance, and escalation requirements.

**Catches:**

- over-refusal;
- under-refusal;
- unsafe compliance;
- policy inconsistency;
- failure to escalate;
- sensitive data leakage;
- unauthorized action.

**Evaluation forms:**

- policy scenario tests;
- adversarial prompt tests;
- red-team cases;
- boundary cases;
- refusal quality rubrics;
- escalation-decision tests.

### EM11. Stress / Budget Evaluation


Tests behavior under context, latency, token, compute, retrieval, or cost constraints.

**Catches:**

- truncation-induced loss;
- compression-induced distortion;
- shallow reasoning under budget;
- skipped verification;
- incomplete output;
- degraded retrieval from budget limits;
- latency-driven fallback errors.

**Stressors:**

- long input;
- many documents;
- dense distractors;
- low latency budget;
- low max-output tokens;
- forced summarization;
- limited retrieval depth;
- cost cap.

### EM12. Distributional Slice Evaluation


Evaluates performance across domains, formats, languages, populations, task types, and edge cases.

**Catches:**

- uneven competence;
- domain failure;
- rare-format brittleness;
- multilingual degradation;
- benchmark-product mismatch;
- edge-case collapse.

**Slices may include:**

- domain;
- user segment;
- language;
- document type;
- input length;
- difficulty;
- ambiguity level;
- source quality;
- task framing;
- tool/API type.

### EM13. Regression Evaluation


Compares behavior across versions.

Assume the blast radius may be wider than the directly edited case: a local prompt, model, retrieval, schema, tool, or policy change can produce regressions in adjacent slices or seemingly unrelated workflows.

**Catches:**

- prompt regressions;
- model regressions;
- retriever/index regressions;
- tool schema regressions;
- policy regressions;
- output-format regressions;
- changes in refusal/escalation behavior.

**Version dimensions:**

- model;
- prompt;
- tools;
- retrieval index;
- embedding model;
- reranker;
- chunking strategy;
- policy text;
- schema;
- post-processing;
- data source.

### EM14. Human-Review / Rubric Evaluation


Uses structured human or expert review when quality is semantic, contextual, subjective, policy-sensitive, or product-specific.

**Catches:**

- tone or persona mismatch;
- usefulness failures;
- clarification failures;
- ambiguous task success;
- nuanced policy application;
- acceptable-variation disputes.

**Requirements:**

- explicit criteria;
- scale anchors;
- reviewer instructions;
- adjudication path;
- inter-rater expectations.

### EM15. Production Monitoring / Drift Evaluation


Detects whether deployed behavior remains acceptable as users, data, tools, policies, prompts, models, and environments change.

It is the runtime backstop for residual non-local regressions that were not fully exposed by offline regression suites.

**Catches:**

- production behavior drift;
- data and knowledge drift;
- retrieval-index drift;
- tool/API drift;
- latent regressions not covered offline;
- long-tail failures;
- incident patterns;
- silent degradation.

**Typical signals:**

- sampled output review;
- user feedback;
- incident reports;
- refusal and escalation-rate drift;
- tool-call failure rates;
- retrieval miss rates;
- citation support rates;
- schema failure rates;
- latency and cost drift.

## Oracle types


An **oracle** is the mechanism by which an evaluation decides whether behavior is acceptable.

| Code | Oracle type | Best for |
|---|---|---|
| **OR1** | Exact-match oracle | IDs, fixed labels, required strings, deterministic answers |
| **OR2** | Parser/schema oracle | JSON, XML, YAML, API arguments, tool payloads |
| **OR3** | Deterministic calculation oracle | arithmetic, date math, sorting, counting, formal transformations |
| **OR4** | Reference-answer oracle | QA, extraction, classification with known answers |
| **OR5** | Rubric-based human judgment | summaries, tone, usefulness, policy nuance |
| **OR6** | Calibrated LLM-as-judge | scalable semantic judgment with validation |
| **OR7** | Evidence-entailment oracle | grounding, citation support, source fidelity |
| **OR8** | Retrieval expected-document oracle | RAG recall, source coverage, ranking |
| **OR9** | Behavioral-equivalence oracle | stability under wording/run variation |
| **OR10** | Policy-rule oracle | refusal, escalation, compliance, allowed/disallowed actions |
| **OR11** | Trace/process oracle | tool use, agent steps, intermediate decisions |
| **OR12** | Statistical repeated-run oracle | variance, tail risk, pass-rate confidence |
| **OR13** | Distributional slice oracle | performance by domain, language, format, segment |
| **OR14** | Budget/SLO oracle | latency, cost, context usage, retry count |

### Oracle selection rule


Use the weakest oracle that is sufficient for the task, and the strongest oracle required by the risk.

```text
Exact string required:
  use exact-match or parser/schema oracle

Truth required:
  use reference-answer, expert, or tool-backed oracle

Evidence required:
  use evidence-entailment or retrieval oracle

Process required:
  use trace/process oracle

Reliability required:
  use repeated-run, regression, or monitoring oracle
```

## Fault-to-evaluation matrix


The following matrix assumes a separate Layer 2 fault inventory with atomic `Fxx` entries. If the inventory uses different codes, preserve the fault names and method mappings.

| Fault | What to evaluate | Primary methods | Main oracle types | Observable signal |
|---|---|---|---|---|
| **F01 Context Omission** | Whether required information was available to the model | EM3, EM11, EM15 | OR8, OR11 | required evidence absent from retrieved/prompt context |
| **F02 Context Underutilization** | Whether present evidence influenced the answer | EM3, EM4, EM7 | OR7, OR5 | answer ignores relevant supplied evidence |
| **F03 Context Priority Confusion** | Whether the model prioritized the right source/instruction | EM3, EM4, EM10 | OR7, OR10, OR11 | lower-authority or less relevant context overrides stronger context |
| **F04 Continuity Loss** | Whether required prior state was preserved | EM3, EM8, EM13 | OR11, OR4 | prior decision/preference/state missing or contradicted |
| **F05 Stale-State Reliance** | Whether outdated state is treated as current | EM3, EM5, EM15 | OR4, OR8, OR11 | answer relies on stale document, memory, or tool output |
| **F06 Distractor Assimilation** | Whether irrelevant context contaminates the answer | EM3, EM4 | OR7, OR9 | irrelevant span appears in answer or decision |
| **F07 Source/Authority Confusion** | Whether source authority is respected | EM3, EM4, EM11 | OR7, OR10 | untrusted or low-authority source treated as governing |
| **F08 Prompt-Form Sensitivity** | Whether semantically equivalent prompts preserve behavior | EM2, EM14 | OR9, OR12 | paraphrase changes answer, decision, tool, refusal, or escalation |
| **F09 Task Misinduction** | Whether the inferred task matches the intended task | EM2, EM7 | OR4, OR5, OR9 | model summarizes instead of extracts, explains instead of decides, etc. |
| **F10 Task Blending** | Whether multiple tasks are separated and executed correctly | EM2, EM7, EM8 | OR5, OR11 | model merges incompatible instructions or partially performs each |
| **F11 Scope Misinterpretation** | Whether response scope matches task scope | EM2, EM7 | OR4, OR5 | answer is too broad, too narrow, or answers a nearby question |
| **F12 Constraint Misclassification** | Whether hard/soft constraints are interpreted correctly | EM2, EM7, EM10 | OR5, OR10 | hard requirement treated as optional or preference treated as mandatory |
| **F13 Example Overgeneralization** | Whether examples are copied or treated as exhaustive rules | EM2, EM3, EM12 | OR5, OR9 | output follows accidental example features |
| **F14 Example Underuse** | Whether examples are used where they define the task | EM2, EM3, EM7 | OR5, OR9 | model ignores demonstrated label space, format, or edge case |
| **F15 Control/Data Confusion** | Whether data is treated as instruction or vice versa | EM3, EM10 | OR10, OR11 | quoted/retrieved/tool text changes model behavior as instruction |
| **F16 Prompt-Injection Compliance** | Whether untrusted embedded instructions are followed | EM3, EM10 | OR10, OR11 | model follows malicious or irrelevant instruction in untrusted content |
| **F17 Output-Format Drift** | Whether output obeys required structure | EM6, EM14 | OR2 | invalid format, missing fields, extra commentary |
| **F18 Boundary/Stopping Error** | Whether output begins, ends, and separates content correctly | EM6, EM7 | OR2, OR5 | premature stop, overgeneration, mixed payload/commentary |
| **F19 Exact-String Corruption** | Whether required strings are preserved exactly | EM6, EM7 | OR1 | IDs, names, quotes, paths, or keys altered |
| **F20 Numeric/Symbolic Fragility** | Whether formal operations are correct | EM6, EM7 | OR3 | incorrect arithmetic, sorting, counting, comparison, or symbolic edit |
| **F21 Structured-Data Semantic Error** | Whether schema-valid fields are semantically correct | EM6, EM7 | OR2, OR4, OR5 | valid JSON with wrong field values |
| **F22 Local Plausibility Drift** | Whether output stays globally aligned with task/evidence | EM7, EM8 | OR5, OR7 | answer starts correctly but drifts into unsupported or irrelevant continuation |
| **F23 Path Dependence** | Whether early assumptions contaminate later output | EM7, EM8 | OR5, OR11 | initial false frame persists despite later correction/evidence |
| **F24 Error Accumulation** | Whether small errors compound across steps | EM7, EM8 | OR3, OR11 | later result depends on earlier unchecked mistake |
| **F25 Invariant Loss** | Whether required constraints persist across steps | EM7, EM8, EM10 | OR5, OR10, OR11 | plan or answer violates earlier constraint |
| **F26 Plan Drift** | Whether plan execution stays aligned with goal | EM7, EM8 | OR11 | agent/reasoning steps depart from objective |
| **F27 Spurious Decomposition** | Whether task decomposition is valid | EM7, EM8 | OR5, OR11 | plausible subtasks are irrelevant, invalid, or incomplete |
| **F28 Premature Closure** | Whether answer/action occurs before enough evidence | EM7, EM8, EM10 | OR7, OR10, OR11 | model finalizes without required verification or tool result |
| **F29 Looping/Repetition** | Whether repeated steps make progress | EM8, EM11, EM15 | OR11, OR14 | repeated calls/text without new information |
| **F30 Unsupported Assertion** | Whether claims have sufficient support | EM4, EM7 | OR7 | factual claim lacks evidence in available/approved context |
| **F31 Plausibility-Truth Gap** | Whether plausible claims are true | EM5, EM7, EM12 | OR4, OR7 | fluent answer is false |
| **F32 Non-Grounded Justification** | Whether explanation actually supports conclusion | EM4, EM7 | OR7, OR5 | rationale or citation-like text does not entail claim |
| **F33 Fabricated Citation/Source** | Whether cited source exists and supports the claim | EM4, EM5 | OR7, OR8 | nonexistent, malformed, or invented source reference |
| **F34 Evidence-Claim Mismatch** | Whether cited evidence supports cited claim | EM4 | OR7 | real source cited for unsupported or contradicted claim |
| **F35 Parametric-Prior Override** | Whether learned prior overrides supplied evidence | EM3, EM4, EM12 | OR7, OR9 | answer follows common/default belief despite contrary context |
| **F36 Weak Confidence Calibration** | Whether confidence tracks correctness | EM9, EM1 | OR12 | confidence level not predictive of accuracy |
| **F37 Non-Privileged Self-Evaluation** | Whether self-checking is treated as independent verification | EM9, EM8 | OR11, OR7 | model says it checked without independent evidence/tooling |
| **F38 Sycophantic Agreement** | Whether model agrees when correction is required | EM10, EM2 | OR10, OR5 | model validates false premise or unsafe user framing |
| **F39 Over-Refusal** | Whether allowed tasks are incorrectly refused | EM10, EM12, EM14 | OR10 | refusal when policy allows compliance |
| **F40 Under-Refusal** | Whether disallowed/risky tasks are incorrectly fulfilled | EM10, EM12 | OR10 | compliance when refusal, warning, or escalation required |
| **F41 Clarification Failure** | Whether model asks needed questions and avoids unnecessary ones | EM7, EM10, EM14 | OR5, OR10 | asks needless question or proceeds despite ambiguity |
| **F42 Tone/Persona Inconsistency** | Whether style matches product contract | EM12, EM14, EM15 | OR5, OR9 | tone, role, or persona shifts inappropriately |
| **F43 Verbosity Mismatch** | Whether response length/detail fits task | EM7, EM14 | OR5 | answer too terse, too long, or overexplained |
| **F44 Competence Cliff** | Whether performance collapses on a slice | EM12, EM14, EM15 | OR13 | sharp drop by domain, language, format, edge case |
| **F45 Distributional Overgeneralization** | Whether familiar patterns are misapplied outside scope | EM12, EM7 | OR13, OR5 | uses common template where exception/domain-specific behavior needed |
| **F46 Output Variance** | Whether repeated runs preserve intended behavior | EM1 | OR9, OR12 | materially different outcomes across same scenario |
| **F47 Tail-Risk Generation** | Whether rare severe failures appear under repetition/stress | EM1, EM10, EM11 | OR12, OR10 | low-frequency severe bad output |
| **F48 Truncation-Induced Loss** | Whether token/context limits remove needed information | EM11, EM3 | OR8, OR14 | omitted evidence or incomplete answer due to length limit |
| **F49 Compression-Induced Distortion** | Whether summaries/state compression preserve critical details | EM11, EM7 | OR4, OR5 | compressed state loses exception, constraint, date, entity, or decision |
| **F50 Budget-Induced Incompleteness** | Whether latency/cost/token budget causes shallow behavior | EM11, EM15 | OR14, OR5 | skipped verification, partial answer, shallow reasoning |
| **F51 Tool-Selection Error** | Whether correct tool is chosen | EM8, EM14 | OR11 | wrong tool, missing needed tool, unnecessary tool |
| **F52 Tool-Argument Error** | Whether tool arguments are correct and safe | EM8, EM6 | OR2, OR11 | malformed, incomplete, unsafe, or wrong parameters |
| **F53 Tool-Output Misinterpretation** | Whether tool result is read and applied correctly | EM8, EM4, EM7 | OR11, OR7 | answer contradicts or overgeneralizes tool output |
| **F54 Action-Readiness Error** | Whether action is justified before execution/recommendation | EM8, EM10 | OR10, OR11 | action taken or recommended without sufficient basis |
| **F55 Recovery Failure** | Whether system/model recovers from error or missing data | EM8, EM11, EM15 | OR11, OR14 | failed tool call, missing evidence, or exception leads to bad final state |

## Family-level evaluation bundles


Family bundles are broader views over the atomic fault inventory. They are useful for product, risk, and evaluation planning.

Use `FF` for family-level fault bundles to avoid confusing them with atomic `Fxx` codes.

| Family bundle | Primary methods | Notes |
|---|---|---|
| **FF1 Behavioral Instability** | EM1, EM2, EM13 | Evaluate repeated runs and semantically equivalent variants at the level of intended behavior. |
| **FF2 Ambiguous or Misinduced Task Behavior** | EM2, EM7, EM8 | Evaluate whether the model inferred the right operation, scope, and success criteria. |
| **FF3 Hallucination and Unsupported Claims** | EM4, EM5, EM14 | Separate falsehood, lack of support, fabricated sources, and evidence mismatch. |
| **FF4 Weak Grounding / Source Infidelity** | EM3, EM4, EM15 | Separate retrieval failure from generation failure. |
| **FF5 Weak Calibration and Misleading Confidence** | EM9, EM1 | Confidence language is generated behavior, not independent verification. |
| **FF6 Output Format / Schema Drift** | EM6, EM14 | Combine parser validation with semantic field validation. |
| **FF7 Inconsistent Interaction Behavior** | EM10, EM12, EM14, EM15 | Covers tone, refusal, clarification, verbosity, escalation, and product behavior. |
| **FF8 Uneven Competence / Distributional Failure** | EM12, EM14, EM15 | Requires slice definitions; average score is insufficient. |
| **FF9 Agentic Process Failure** | EM7, EM8, EM10, EM15 | Requires trace-level evaluation, not only final answer grading. |
| **FF10 Retrieval-Conditioned Answer Failure** | EM3, EM4, EM15 | Evaluate retrieval availability, context use, and claim grounding separately. |

## Evaluation record schema


Use this schema for any detailed fault-evaluation mapping.

```text
## Evaluation record

### Fault
Code and name of the Layer 2 fault mode.

### Evaluation question
The diagnostic question this evaluation answers.

### Applicable method families
One or more EM codes.

### Required scenario data
What the test case must contain.

### Required traces
What must be captured from the system.

### Observable signals
Concrete signals that the fault occurred.

### Oracle type
How the evaluation decides pass/fail or score.

### Severity criteria
How to distinguish harmless variation from material failure.

### False positives
Cases that look like this fault but are acceptable or belong elsewhere.

### False negatives
Cases where the fault may be hidden by weak instrumentation or weak oracle design.

### Related faults
Neighboring Layer 2 faults.

### Layer 3 handoff
What kind of system control may be needed if this fault is detected.
```

## Cross-fault evaluation patterns

### Pattern 1: Stability evaluation


Best for:

- F08 Prompt-Form Sensitivity
- F38 Sycophantic Agreement
- F39 Over-Refusal
- F40 Under-Refusal
- F46 Output Variance
- F47 Tail-Risk Generation
- F51 Tool-Selection Error
- F52 Tool-Argument Error

Core method:

```text
same or equivalent scenario
  -> repeated runs and variants
  -> compare intended behavior
  -> score material differences
```

### Pattern 2: Grounding evaluation


Best for:

- F02 Context Underutilization
- F03 Context Priority Confusion
- F30 Unsupported Assertion
- F31 Plausibility-Truth Gap
- F32 Non-Grounded Justification
- F33 Fabricated Citation/Source
- F34 Evidence-Claim Mismatch
- F35 Parametric-Prior Override
- F53 Tool-Output Misinterpretation

Core method:

```text
extract claim
  -> identify evidence
  -> check support
  -> classify unsupported / contradicted / overextended / supported
```

### Pattern 3: Structured-output evaluation


Best for:

- F17 Output-Format Drift
- F18 Boundary/Stopping Error
- F19 Exact-String Corruption
- F20 Numeric/Symbolic Fragility
- F21 Structured-Data Semantic Error
- F52 Tool-Argument Error

Core method:

```text
parse output
  -> validate schema
  -> validate field semantics
  -> compare exact fields where required
```

### Pattern 4: Agent-process evaluation


Best for:

- F24 Error Accumulation
- F25 Invariant Loss
- F26 Plan Drift
- F27 Spurious Decomposition
- F28 Premature Closure
- F29 Looping/Repetition
- F51 Tool-Selection Error
- F52 Tool-Argument Error
- F53 Tool-Output Misinterpretation
- F54 Action-Readiness Error
- F55 Recovery Failure

Core method:

```text
capture trace
  -> evaluate tool choice
  -> evaluate arguments
  -> evaluate state updates
  -> evaluate stopping/recovery
  -> evaluate final action or answer
```

### Pattern 5: Distributional slice evaluation


Best for:

- F13 Example Overgeneralization
- F14 Example Underuse
- F39 Over-Refusal
- F40 Under-Refusal
- F42 Tone/Persona Inconsistency
- F44 Competence Cliff
- F45 Distributional Overgeneralization
- F47 Tail-Risk Generation

Core method:

```text
define slices
  -> run same task family across slices
  -> compare pass/fail, severity, and failure type
  -> identify cliffs and unstable boundaries
```

### Pattern 6: Budget stress evaluation


Best for:

- F01 Context Omission
- F02 Context Underutilization
- F22 Local Plausibility Drift
- F28 Premature Closure
- F48 Truncation-Induced Loss
- F49 Compression-Induced Distortion
- F50 Budget-Induced Incompleteness
- F55 Recovery Failure

Core method:

```text
increase task/context pressure
  -> constrain latency/tokens/retrieval
  -> inspect missing evidence, skipped verification, and degraded behavior
```

## Boundary with Layer 3 controls


This document should not prescribe system fixes in detail.

It may identify the kind of Layer 3 handoff needed, but the actual controls belong in layer-3-control-families.md.

Examples:

| Layer 2 fault | Evaluation mapping | Layer 3 control mapping |
|---|---|---|
| Context Omission | expected-document recall, context inspection | retrieval design, memory rehydration, context assembly checks |
| Context Underutilization | evidence-answer comparison | prompt structure, source salience, citation forcing, reranking |
| Control/Data Confusion | adversarial context tests | source isolation, quoting, sandboxing, instruction stripping |
| Output-Format Drift | parser/schema validation | constrained decoding, validator, retry repair |
| Unsupported Assertion | grounding evaluation | citation validator, abstention policy, source whitelist |
| Weak Calibration | calibration curve, confidence bucket scoring | uncertainty policy, external verification, confidence display rules |
| Tool-Argument Error | trace and schema evaluation | typed tool schemas, guardrails, pre-execution validators |
| Action-Readiness Error | action-safety trace evaluation | authorization, confirmation, human review, reversible actions |

## Worked examples

### Example 1: Escalation classifier instability


**Scenario**

A customer-support assistant must summarize a customer issue and decide whether it should be escalated.

**Faults**

- F08 Prompt-Form Sensitivity
- F09 Task Misinduction
- F12 Constraint Misclassification
- F46 Output Variance

**Evaluation methods**

- EM1 Repeated-Run Evaluation
- EM2 Perturbation / Paraphrase Evaluation
- EM14 Human-Review / Rubric Evaluation

**Oracle**

- OR9 Behavioral-Equivalence Oracle
- OR4 Reference-Answer Oracle
- OR5 Rubric-Based Human Judgment

**Observable failure**

Semantically equivalent inputs produce different escalation decisions.

**Severity rule**

Different wording is harmless. A changed escalation decision is material.

### Example 2: RAG answer with unsupported legal claim


**Scenario**

A legal assistant answers a contract question using retrieved documents.

**Faults**

- F02 Context Underutilization
- F30 Unsupported Assertion
- F32 Non-Grounded Justification
- F34 Evidence-Claim Mismatch
- F35 Parametric-Prior Override

**Evaluation methods**

- EM4 Grounding / Evidence Evaluation
- EM5 Truth / Factuality Evaluation
- EM14 Human-Review / Rubric Evaluation

**Oracle**

- OR7 Evidence-Entailment Oracle
- OR8 Retrieval Expected-Document Oracle
- OR5 Rubric-Based Human Judgment

**Observable failure**

The answer cites a real clause, but the clause does not support the stated conclusion.

**Severity rule**

Unsupported legal conclusion is severe even if the prose is fluent and plausible.

### Example 3: Structured extraction returns valid JSON with wrong values


**Scenario**

The model extracts invoice fields into JSON.

**Faults**

- F17 Output-Format Drift
- F19 Exact-String Corruption
- F20 Numeric/Symbolic Fragility
- F21 Structured-Data Semantic Error

**Evaluation methods**

- EM6 Schema / Parser Validation
- EM5 Truth / Factuality Evaluation

**Oracle**

- OR2 Parser/Schema Oracle
- OR1 Exact-Match Oracle
- OR3 Deterministic Calculation Oracle
- OR4 Reference-Answer Oracle

**Observable failure**

The JSON parses, but the invoice number is altered and the total is wrong.

**Severity rule**

Schema validity alone is insufficient. Field values must also be semantically correct.

### Example 4: Agent chooses the wrong tool and recovers poorly


**Scenario**

An agent must look up account status before drafting a response.

**Faults**

- F28 Premature Closure
- F51 Tool-Selection Error
- F52 Tool-Argument Error
- F53 Tool-Output Misinterpretation
- F55 Recovery Failure

**Evaluation methods**

- EM8 Agent Trace Evaluation
- EM7 Reasoning / Process Evaluation
- EM10 Safety / Policy Evaluation

**Oracle**

- OR11 Trace/Process Oracle
- OR10 Policy-Rule Oracle
- OR5 Rubric-Based Human Judgment

**Observable failure**

The agent drafts a definitive answer without using the account-status tool, then fails to recover after the tool returns an error.

**Severity rule**

A final answer that appears helpful is still a failure if required verification was skipped.

### Example 5: Confidence language is misleading


**Scenario**

A QA assistant answers domain-specific technical questions and expresses confidence.

**Faults**

- F31 Plausibility-Truth Gap
- F36 Weak Confidence Calibration
- F37 Non-Privileged Self-Evaluation
- F44 Competence Cliff

**Evaluation methods**

- EM9 Calibration Evaluation
- EM12 Distributional Slice Evaluation
- EM5 Truth / Factuality Evaluation

**Oracle**

- OR12 Statistical Repeated-Run Oracle
- OR13 Distributional Slice Oracle
- OR4 Reference-Answer Oracle

**Observable failure**

The assistant is most confident on questions from the slice where it is least accurate.

**Severity rule**

Confidence language is harmful when users are likely to rely on it as evidence of correctness.

## Minimal implementation checklist


A practical evaluation harness for Layer 2 should capture:

```text
Scenario metadata:
  task type, domain, risk level, expected behavior

Input variants:
  original, paraphrases, adversarial variants, edge cases

Runtime traces:
  prompt, retrieved context, tool calls, tool outputs, state, errors

Output artifacts:
  final answer, citations, structured output, actions, confidence language

Scores:
  correctness, grounding, format validity, policy behavior, tool correctness,
  stability, calibration, latency/cost

Version metadata:
  model, prompt, retrieval index, tools, schemas, policies, data timestamp
```

## Final formulation


Layer 2 evaluation maps behavioral fault modes to the methods and oracles needed to observe them.

It should support four practical goals:

1. **Detect** whether a fault occurred.
2. **Measure** how often and how severely it occurs.
3. **Compare** behavior across versions, prompts, models, tools, and data.
4. **Hand off** the detected fault to Layer 3 controls without confusing detection with mitigation.

```text
Layer 2 fault:
  what went wrong behaviorally

Evaluation mapping:
  how we know it went wrong

Layer 3 control:
  what system design prevents, bounds, or recovers from it
```
