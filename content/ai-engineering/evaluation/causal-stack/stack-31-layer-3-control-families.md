---
draft: false
toc: true
title: "Stack 31 Layer 3 Control Families"
linkTitle: "Stack 31 Layer 3 Control Families"
---
# Layer 3 -- System Control Families

## Purpose


This document defines the canonical **Layer 3 system control families** for AI systems.

Layer 3 answers:

> What system controls prevent, detect, constrain, recover from, monitor, or prove acceptable behavior around Layer 2 fault modes?

Layer 3 does not define the model mechanisms, learned model features, behavioral fault modes, evaluation methods, or user/business impacts.

```text
Layer 1A / 1B / 1C
  causal features and system properties

Layer 2
  behavioral fault modes

Layer 3
  system controls, missing controls, orchestration failures, validation failures,
  monitoring gaps, recovery gaps, and governance gaps

Layer 4
  user, business, safety, legal, trust, compliance, and operational impacts
```


This file defines the **control vocabulary**. It should be used by later mapping and fault-family documents, especially:

```text
stack-30-layer-3-overview.md
stack-33-layer-3-system-fault-families.md
```


The detailed control IDs in this file use the `L3A*`, `L3B*`, `L3C*`, `L3D*`, and `L3X*` namespaces so they cannot be confused with Layer 1 `A*`, `B*`, or `C*` identifiers. They replace the older local `A*`, `B*`, `C*`, `D*`, and `X*` control labels used in earlier drafts.

## Scope


Layer 3 includes system controls around:

- task specification;
- instruction hierarchy;
- prompt assembly;
- context assembly;
- retrieval;
- source authority and freshness;
- evidence packaging;
- grounding and citation support;
- claim verification;
- output schemas and parsers;
- exact symbolic handling;
- interaction behavior rules;
- memory and state persistence;
- planning checkpoints;
- tool routing;
- tool argument validation;
- tool-output interpretation;
- recovery and retry logic;
- external action authorization;
- transaction and rollback boundaries;
- safety and policy enforcement;
- refusal and escalation behavior;
- competence-boundary detection;
- routing and fallback;
- stability monitoring;
- operating-budget management;
- deployment and version control;
- traces, audits, evaluation gates, runtime monitors, incident review, and human escalation.

Layer 3 does **not** include:

- primitive model/inference mechanisms;
- learned or behavioral LLM features;
- the Layer 2 fault mode itself;
- user, business, legal, or safety impact;
- raw evaluation methods unless they are operationalized as gates, monitors, or controls.

## Relationship to the stack

### Relationship to Layer 1


Layer 1 explains why a behavioral fault is possible.

Example:

```text
A5 In-Band Control/Data Representation
  makes instruction/data confusion possible.
```


Layer 3 asks what the system did to contain that possibility.

Example:

```text
Instruction/Data Boundary Controls
  isolate untrusted retrieved text from active instructions.
```

### Relationship to Layer 2


Layer 2 names the recurring behavioral failure pattern.

Example:

```text
Layer 2:
  control/data confusion
```


Layer 3 names the missing, weak, or successful system control.

Example:

```text
Layer 3 system fault:
  retrieved text was inserted without source isolation or instruction stripping.

Layer 3 controls:
  evidence packaging, source labeling, instruction stripping, action gates.
```

### Relationship to Layer 4


Layer 4 describes why the failure mattered.

Example:

```text
Layer 4:
  user receives an answer or action shaped by prompt-injection content.
```


Layer 3 sits between model behavior and impact. It is the layer where system design either absorbs model fault modes or allows them to reach users, tools, records, or external actions.

### Relationship to evaluation artifacts


Evaluation mappings answer:

> How do we detect or measure this behavior?

Layer 3 control families answer:

> What system mechanism prevents, detects, gates, recovers from, monitors, or governs this behavior?

An evaluation becomes a Layer 3 control only when it has operational effect, such as:

- blocking release;
- triggering retry or repair;
- blocking output;
- routing to review;
- alerting an operator;
- updating a regression suite;
- changing routing, policy, prompt, retrieval, or validation logic.

## Core definitions

### System control


A **system control** is an architectural, runtime, operational, or governance mechanism that reduces the chance, severity, detectability gap, or recurrence of a Layer 2 fault mode.

Examples:

- schema validator;
- citation-support checker;
- source-priority rule;
- tool-argument validator;
- human approval gate;
- context assembly audit;
- retry-on-parse-failure loop;
- model-version regression gate.

### System fault


A **system fault** is a missing, weak, misconfigured, bypassed, unmonitored, or ineffective system control.

Examples:

```text
Layer 2 fault:
  unsupported assertion

Layer 3 system fault:
  no claim-source support check before answer release
```

```text
Layer 2 fault:
  tool-argument error

Layer 3 system fault:
  tool call was executed without argument validation
```

### Control family


A **control family** is a broad class of related controls operating at the same architectural boundary.

Example:

```text
L3B5 Claim Grounding and Citation Controls
```


may include:

- mandatory citation requirements;
- claim extraction;
- claim-source entailment checks;
- source-span support validation;
- answer abstention when support is missing;
- citation repair or regeneration.

### Control instance


A **control instance** is a concrete implementation of a control family in a system.

Example:

```text
Control family:
  L3A4 Output Contract and Parser Controls

Control instance:
  validate assistant output against JSON Schema v7 before passing it to the API consumer
```

### Runtime monitor


A **runtime monitor** observes production behavior and detects drift, failures, policy violations, or system degradation after deployment.

Runtime monitors can inspect:

- outputs;
- traces;
- tool calls;
- retrieval results;
- parser failures;
- policy decisions;
- latency and cost;
- human review outcomes;
- user feedback;
- incident reports.

### Release gate


A **release gate** blocks or approves a change based on defined checks.

Changes may include:

- model version;
- system prompt;
- developer prompt;
- retrieval index;
- embedding model;
- reranker;
- tool schema;
- parser;
- policy text;
- output schema;
- routing logic;
- budget settings.

### Recovery path


A **recovery path** is the system behavior after a detected failure or uncertainty condition.

Examples:

- retry with stricter schema;
- ask clarification;
- retrieve more evidence;
- escalate to human;
- refuse;
- abstain;
- route to specialist tool;
- roll back action;
- preserve partial work and request confirmation.

### Human escalation path


A **human escalation path** routes a case to a human reviewer or operator when automated controls are insufficient.

A useful escalation path defines:

- routing criteria;
- evidence package;
- reviewer instructions;
- authority to approve, reject, repair, or override;
- audit record;
- expected response time;
- fallback behavior when no reviewer is available.

## Design principles

### 1. Controls operate at architectural boundaries


Layer 3 controls should be grouped by the system boundary where they operate.

This document uses five boundaries:

```text
L3-A Interface and Contract Boundary
L3-B Knowledge and Grounding Boundary
L3-C State, Process, and Action Boundary
L3-D Policy, Reliability, and Operating-Envelope Boundary
L3-X Cross-Cutting Observability, Evaluation, and Governance Boundary
```

### 2. Controls are many-to-many


One control may mitigate many Layer 2 faults.

One fault may require many controls.

Example:

```text
Unsupported assertion
  may require retrieval controls,
  evidence packaging,
  claim grounding,
  claim verification,
  abstention rules,
  trace capture,
  and human escalation.
```

### 3. Controls reduce, bound, detect, or recover from faults


Controls do not eliminate model mechanisms or learned model features.

Example:

```text
A schema validator does not remove output-format drift.
It detects, blocks, repairs, or retries invalid output.
```

### 4. Controls should be observable


A control that cannot be inspected is hard to debug and hard to trust.

Important controls should leave traces of:

- input;
- decision;
- evidence;
- validation result;
- failure condition;
- retry;
- escalation;
- final accepted output or action.

### 5. Controls should be testable


Every important control should have corresponding evaluation coverage.

Examples:

```text
Control:
  source authority ranking

Evaluation:
  conflicting-source tests with known authority order
```

```text
Control:
  tool-argument validator

Evaluation:
  malformed, unsafe, missing, stale, and adversarial argument tests
```

### 6. Controls should preserve traceability


A production system should preserve enough evidence to answer:

- What did the user ask?
- What instructions were active?
- What context was retrieved?
- What sources were used?
- What prompt was assembled?
- What model/version/configuration was used?
- What output was generated?
- What validators ran?
- What tool calls were made?
- What actions were taken?
- What was blocked, retried, escalated, or approved?

### 7. Controls should fail closed for high-risk operations


For high-risk cases, missing evidence, parser failure, tool uncertainty, policy ambiguity, or failed authorization should block, abstain, or escalate rather than silently proceed.

### 8. Controls should distinguish prevention, detection, recovery, monitoring, and proof


A control can serve different roles:

```text
Prevent:
  stop the fault from reaching the model or user

Detect:
  identify that the fault occurred or is likely

Recover:
  repair, retry, abstain, or escalate

Monitor:
  observe behavior over time

Prove:
  provide evidence that behavior meets requirements
```


A mature system usually needs several roles for high-risk fault families.

## Control lifecycle

### Prevent


Prevention controls reduce the probability that a Layer 2 fault appears.

Examples:

- task contracts;
- source authority rules;
- instruction/data isolation;
- constrained decoding;
- typed tool schemas;
- action authorization requirements.

### Detect


Detection controls identify that a fault has occurred or is likely.

Examples:

- parser validation;
- citation-support checks;
- claim verification;
- policy classifiers;
- loop detection;
- confidence-risk checks.

### Recover


Recovery controls determine what happens after detection.

Examples:

- retry;
- ask clarification;
- retrieve more evidence;
- downgrade confidence;
- abstain;
- escalate to human;
- roll back or block action.

### Monitor


Monitoring controls measure behavior in production or near-production conditions.

Examples:

- malformed-output rate;
- retrieval miss rate;
- unsupported-claim rate;
- refusal/escalation distribution;
- latency/cost drift;
- slice-level failure rate;
- incident recurrence.

### Prove


Proof controls produce evidence for release, audit, governance, or compliance.

Examples:

- regression reports;
- evaluation scorecards;
- audit logs;
- reviewer decisions;
- safety-case evidence;
- incident postmortems;
- control-coverage matrices.

## Control record template


Each detailed control-family record should use this structure.

```text
## Code. Control Family Name

### Purpose
What the control family is meant to ensure.

### Core question
The diagnostic question this family answers.

### Boundary
The architectural boundary where the control primarily operates.

### Addresses
Layer 2 fault families or atomic faults commonly mitigated.

### Typical controls
Concrete controls in this family.

### System locations
Where the control can be implemented.

### Evaluation methods
How to test whether the control works.

### Observability requirements
What traces or logs are needed.

### Common system faults
Missing, weak, misconfigured, or bypassed versions of the control.

### Common limitations
What this control does not guarantee.

### Not this
Boundary notes to avoid category drift.

### Example
Short example showing Layer 2 fault, Layer 3 system fault, and control.
```

## Architectural control boundaries

## L3-A. Interface and Contract Boundary


This boundary covers places where soft natural-language interaction must satisfy explicit task, schema, symbolic, interaction, or policy-facing contracts.

Core system question:

> Did the system convert ambiguous generative behavior into explicit operational contracts where needed?

Typical Layer 2 families:

- FF2 Task / Instruction Misinduction
- FF6 Output Contract / Schema Drift
- FF7 Interaction / Experience Inconsistency
- FF13 Representation / Symbolic Integrity Failure
- FF14 Safety / Policy Boundary Failure

Common engineering trap:

> Treating natural-language compliance as if it were already a typed contract.

## L3-B. Knowledge and Grounding Boundary


This boundary covers how the system injects, preserves, prioritizes, cites, verifies, and communicates evidence.

Core system question:

> Did the system supply and verify the evidence required for grounded claims?

Typical Layer 2 families:

- FF3 Hallucination and Unsupported Claims
- FF4 Weak Grounding / Source Infidelity
- FF5 Weak Calibration and Misleading Confidence
- FF10 Retrieval-Conditioned Answer Failure
- FF11 Context Availability / Continuity Failure
- FF12 Reasoning / Planning Integrity Failure

Common engineering trap:

> Collapsing retrieval quality, grounding fidelity, truth, source authority, and confidence into one undifferentiated accuracy metric.

## L3-C. State, Process, and Action Boundary


This boundary covers multi-step execution, memory continuity, planning, tool use, recovery, and external action.

Core system question:

> Did the system preserve state and process integrity before taking or recommending action?

Typical Layer 2 families:

- FF1 Behavioral Instability
- FF9 Agentic Process Failure
- FF10 Retrieval-Conditioned Answer Failure
- FF11 Context Availability / Continuity Failure
- FF12 Reasoning / Planning Integrity Failure
- FF13 Representation / Symbolic Integrity Failure
- FF15 Resource / Budget-Induced Degradation

Common engineering trap:

> Judging multi-step systems only by final answer quality while ignoring trace quality, state carryover, tool use, and recovery behavior.

## L3-D. Policy, Reliability, and Operating-Envelope Boundary


This boundary covers whether the system is stable, safe, governable, and deployable under real operating conditions.

Core system question:

> Did the system stay inside its intended policy, competence, reliability, and resource envelope?

Typical Layer 2 families:

- FF1 Behavioral Instability
- FF5 Weak Calibration and Misleading Confidence
- FF7 Interaction / Experience Inconsistency
- FF8 Distributional Competence Failure
- FF10 Retrieval-Conditioned Answer Failure
- FF11 Context Availability / Continuity Failure
- FF14 Safety / Policy Boundary Failure
- FF15 Resource / Budget-Induced Degradation

Common engineering trap:

> Treating deployment instability as a model-only issue when routing, policy, freshness, budget, versioning, and fallback decisions are often the real operating boundary.

## L3-X. Cross-Cutting Observability, Evaluation, and Governance Boundary


This boundary covers controls that support all other boundaries: traces, evaluation gates, monitoring, incident review, human escalation, and auditability.

Core system question:

> Did the system produce enough evidence to evaluate, debug, govern, and improve behavior?

Typical Layer 2 families:

- all Layer 2 families, depending on system scope.

Common engineering trap:

> Treating evaluation, logging, or human review as sufficient even when they do not gate, monitor, recover, or change system behavior.

## Control family index


| Boundary | Code | Control family | Core question |
|---|---:|---|---|
| Interface / Contract | L3A1 | Task Contract Controls | Did the system convert soft intent into an explicit task contract? |
| Interface / Contract | L3A2 | Instruction Hierarchy Controls | Did the system define which instructions dominate when conflicts occur? |
| Interface / Contract | L3A3 | Prompt Assembly Controls | Did the system assemble instructions, examples, context, and output requirements safely? |
| Interface / Contract | L3A4 | Output Contract and Parser Controls | Did the system enforce required output format, schema, type, and boundary rules? |
| Interface / Contract | L3A5 | Symbolic / Exactness Controls | Did the system protect strings, IDs, numbers, code, tables, and other exact values? |
| Interface / Contract | L3A6 | Interaction Contract Controls | Did the system enforce tone, verbosity, clarification, refusal, escalation, and UX behavior rules? |
| Knowledge / Grounding | L3B1 | Context Assembly Controls | Did the system supply the right runtime information in usable form? |
| Knowledge / Grounding | L3B2 | Retrieval Controls | Did the system retrieve and rank the right evidence? |
| Knowledge / Grounding | L3B3 | Source Authority and Freshness Controls | Did the system preserve source priority, authority, and currency? |
| Knowledge / Grounding | L3B4 | Evidence Packaging Controls | Did the system label, quote, delimit, and expose evidence clearly? |
| Knowledge / Grounding | L3B5 | Claim Grounding and Citation Controls | Did the system require claims to be supported by evidence? |
| Knowledge / Grounding | L3B6 | Claim Verification Controls | Did the system check important claims against trusted references or tools? |
| Knowledge / Grounding | L3B7 | Confidence Communication Controls | Did the system prevent misleading certainty, false verification, or unsupported confidence? |
| State / Process / Action | L3C1 | State Persistence Controls | Did the system preserve required state across turns, calls, sessions, and workflows? |
| State / Process / Action | L3C2 | Memory Rehydration Controls | Did the system reintroduce relevant state into the current context? |
| State / Process / Action | L3C3 | Planning and Process Integrity Controls | Did the system preserve goals, constraints, and checkpoints across steps? |
| State / Process / Action | L3C4 | Tool Selection Controls | Did the system route to the right tool when needed? |
| State / Process / Action | L3C5 | Tool Argument Controls | Did the system validate tool arguments before execution? |
| State / Process / Action | L3C6 | Tool Output Interpretation Controls | Did the system ensure tool results were read and applied correctly? |
| State / Process / Action | L3C7 | Recovery and Retry Controls | Did the system recover from missing data, tool errors, invalid output, or uncertainty? |
| State / Process / Action | L3C8 | Action Authorization Controls | Did the system block external actions until authorization and evidence requirements were met? |
| State / Process / Action | L3C9 | Transaction and Rollback Controls | Did the system make risky actions reversible, auditable, confirmed, or compensable? |
| Policy / Reliability / Envelope | L3D1 | Policy Boundary Controls | Did the system enforce safety, compliance, privacy, and allowed-use boundaries? |
| Policy / Reliability / Envelope | L3D2 | Refusal and Escalation Controls | Did the system refuse, warn, clarify, or escalate at the right time? |
| Policy / Reliability / Envelope | L3D3 | Competence Boundary Controls | Did the system recognize domains, slices, or cases outside reliable competence? |
| Policy / Reliability / Envelope | L3D4 | Routing and Fallback Controls | Did the system route hard or risky cases to safer models, tools, workflows, or humans? |
| Policy / Reliability / Envelope | L3D5 | Stability Controls | Did the system detect and bound repeated-run, perturbation, and tail-risk instability? |
| Policy / Reliability / Envelope | L3D6 | Operating-Budget Controls | Did the system manage context, latency, cost, token, and compute pressure? |
| Policy / Reliability / Envelope | L3D7 | Deployment and Version Controls | Did the system track model, prompt, index, policy, schema, and tool changes? |
| Cross-Cutting | L3X1 | Traceability Controls | Did the system capture enough evidence to debug, audit, and reproduce behavior? |
| Cross-Cutting | L3X2 | Evaluation Gate Controls | Did evaluations block unsafe, regressive, or unproven releases? |
| Cross-Cutting | L3X3 | Runtime Monitoring Controls | Did the system detect degradation after deployment? |
| Cross-Cutting | L3X4 | Incident Review Controls | Did the system convert failures into taxonomy updates, tests, and controls? |
| Cross-Cutting | L3X5 | Human Escalation Controls | Did the system package uncertain or risky cases for human decision? |

# L3-A -- Interface and Contract Controls

## L3A1. Task Contract Controls

### Purpose


Convert ambiguous user intent or natural-language requests into explicit task expectations.

### Core question


> Did the system specify what operation should be performed, what success means, and which constraints are mandatory?

### Boundary


Interface and Contract Boundary.

### Addresses


- task misinduction;
- task blending;
- scope misinterpretation;
- constraint misclassification;
- prompt-form sensitivity;
- output contract drift;
- interaction inconsistency.

### Typical controls


- typed task definitions;
- explicit task schemas;
- intent classifiers;
- allowed operation lists;
- task-specific prompt templates;
- required input fields;
- success criteria;
- hard vs soft constraint markers;
- mandatory abstention or clarification conditions;
- task-specific acceptance tests.

### System locations


- input handling;
- routing;
- prompt assembly;
- task orchestration;
- evaluation harness;
- release gates.

### Evaluation methods


- perturbation / paraphrase evaluation;
- semantic output evaluation;
- task-contract tests;
- regression evaluation;
- human rubric review for ambiguous tasks.

### Observability requirements


- detected task type;
- selected task template;
- extracted constraints;
- missing required fields;
- clarification decision;
- final task contract supplied to the model.

### Common system faults


- user intent passed directly to model without task normalization;
- ambiguous requests not clarified;
- hard constraints buried in prose;
- examples treated as complete contract;
- task changes after prompt edits are not regression-tested.

### Common limitations


A task contract reduces ambiguity, but it does not guarantee factual correctness, source grounding, or policy compliance.

### Not this


Do not classify the model's wrong task inference as Layer 3. The behavioral fault is Layer 2. The Layer 3 issue is the missing or weak task contract.

### Example

```text
Layer 2:
  task misinduction: model summarizes instead of extracting required fields

Layer 3 system fault:
  no typed extraction contract or required field list

Control:
  task-specific extraction schema and field-level validator
```

## L3A2. Instruction Hierarchy Controls

### Purpose


Define how the system resolves conflicts among system, developer, user, tool, retrieved, memory, and example instructions.

### Core question


> Did the system define which instruction source dominates when instructions conflict?

### Boundary


Interface and Contract Boundary.

### Addresses


- control/data confusion;
- task misinduction;
- source/authority confusion;
- prompt-injection compliance;
- policy-boundary failure;
- inconsistent refusal or escalation.

### Typical controls


- explicit instruction hierarchy;
- conflict-resolution rules;
- source-priority rules;
- role-specific prompt sections;
- untrusted-content markers;
- instruction stripping from retrieved text;
- override rules for policy and safety constraints;
- refusal/escalation precedence rules.

### System locations


- prompt assembly;
- retrieval packaging;
- memory injection;
- tool-output handling;
- policy layer;
- agent orchestration.

### Evaluation methods


- instruction hierarchy tests;
- adversarial prompt-role tests;
- context insertion tests;
- safety/policy evaluation;
- regression evaluation.

### Observability requirements


- active instruction set;
- source/role of each instruction;
- detected conflict;
- selected priority rule;
- final instruction package.

### Common system faults


- all instructions are concatenated without hierarchy;
- retrieved content is allowed to override system policy;
- tool output prose is interpreted as instruction;
- examples silently override explicit rules;
- policy hierarchy is not tested under conflict.

### Common limitations


Instruction hierarchy controls still rely on correct serialization and model compliance unless paired with validators, policy gates, and action controls.

### Not this


This is not the same as policy content. It is the control structure that determines which instructions dominate.

### Example

```text
Layer 2:
  prompt-injection compliance

Layer 3 system fault:
  untrusted document text was inserted without instruction hierarchy or neutralization

Control:
  retrieved text is labeled as evidence only and cannot define active behavior rules
```

## L3A3. Prompt Assembly Controls

### Purpose


Ensure that the system assembles instructions, examples, retrieved context, memory, tool outputs, and output requirements in a safe, stable, and testable way.

### Core question


> Did prompt construction preserve roles, boundaries, priorities, and required information?

### Boundary


Interface and Contract Boundary, with strong links to Knowledge and Grounding.

### Addresses


- prompt-form sensitivity;
- task misinduction;
- context underutilization;
- context priority confusion;
- control/data confusion;
- source/authority confusion;
- output-format drift;
- behavioral instability.

### Typical controls


- stable prompt templates;
- explicit sections for task, constraints, evidence, examples, and output format;
- delimiter conventions;
- source labels;
- authority labels;
- example ordering rules;
- prompt linting;
- prompt diff tests;
- prompt versioning;
- prompt assembly unit tests;
- injection-safe rendering of retrieved and tool text.

### System locations


- orchestration layer;
- prompt builder;
- retrieval integration;
- memory injection;
- tool-output serialization;
- evaluation harness.

### Evaluation methods


- perturbation evaluation;
- context ablation / insertion evaluation;
- grounding evaluation;
- regression evaluation;
- safety adversarial evaluation.

### Observability requirements


- final assembled prompt;
- source of each prompt segment;
- prompt template version;
- context length;
- dropped or truncated segments;
- order of evidence and instructions.

### Common system faults


- prompt segments are concatenated ad hoc;
- evidence and instructions are not separated;
- prompt template changes bypass regression testing;
- truncation silently removes constraints;
- examples are inserted too close to or too far from the task;
- source labels are missing.

### Common limitations


A well-assembled prompt improves behavior but does not enforce correctness. It should be paired with validation, grounding, and monitoring controls.

### Not this


Prompt assembly is a system control. Prompt-form sensitivity is a Layer 2 behavioral fault.

### Example

```text
Layer 2:
  context priority confusion

Layer 3 system fault:
  low-authority and high-authority evidence were inserted without labels or ordering rules

Control:
  prompt assembly labels sources by authority and places governing evidence in a dedicated section
```

## L3A4. Output Contract and Parser Controls

### Purpose


Ensure that generated outputs satisfy required format, schema, type, boundary, and downstream interface contracts.

### Core question


> Did the system enforce the output object required by downstream consumers?

### Boundary


Interface and Contract Boundary.

### Addresses


- output-format drift;
- schema drift;
- boundary/stopping error;
- structured-data semantic error;
- malformed tool arguments;
- extra commentary;
- incomplete outputs;
- parser failures.

### Typical controls


- JSON schema validation;
- typed output contracts;
- constrained decoding;
- structured-output APIs;
- parser validation;
- enum validation;
- field completeness checks;
- boundary markers;
- retry-on-parse-failure;
- repair loops;
- downstream type checks;
- contract tests.

### System locations


- model call;
- decoding configuration;
- post-processing;
- API boundary;
- tool-call construction;
- downstream integration.

### Evaluation methods


- schema / parser validation;
- semantic output evaluation;
- regression evaluation;
- agent trace evaluation for tool payloads.

### Observability requirements


- raw model output;
- parsed output;
- validation result;
- validation error;
- retry count;
- final accepted payload;
- rejected payloads.

### Common system faults


- schema exists but is not enforced;
- parser errors are hidden;
- invalid output is passed downstream;
- retry loop changes semantics;
- parser checks syntax but not field semantics;
- parser repair creates unsupported content.

### Common limitations


Schema validity does not guarantee semantic correctness, factuality, grounding, policy compliance, or action safety.

### Not this


Do not classify the model's tendency to drift from format as Layer 3. That is Layer 2. Layer 3 is whether the system enforces the output contract.

### Example

```text
Layer 2:
  structured output drift

Layer 3 system fault:
  invalid JSON was accepted by the downstream service

Control:
  schema validator blocks invalid output and triggers constrained retry
```

## L3A5. Symbolic / Exactness Controls

### Purpose


Protect strings, identifiers, numbers, code, paths, citations, tables, quotes, and other exact values from generative corruption.

### Core question


> Did the system avoid relying on free-form generation for exact symbolic operations?

### Boundary


Interface and Contract Boundary.

### Addresses


- exact-string corruption;
- numeric/symbolic fragility;
- malformed IDs;
- broken code or paths;
- quote distortion;
- table corruption;
- citation corruption;
- field-value corruption.

### Typical controls


- copy-from-source mechanisms;
- deterministic string handling;
- exact-match validators;
- checksums;
- ID allowlists;
- code parsers;
- calculators;
- symbolic tools;
- table validators;
- quote extraction tools;
- numeric comparison tools;
- programmatic transformations outside the model.

### System locations


- preprocessing;
- retrieval;
- prompt assembly;
- tool use;
- post-processing;
- output validation;
- downstream integration.

### Evaluation methods


- exact-match tests;
- parser validation;
- deterministic calculation oracles;
- semantic output evaluation;
- regression evaluation.

### Observability requirements


- source value;
- generated value;
- transformation path;
- validator result;
- correction or rejection decision.

### Common system faults


- exact values are paraphrased by the model;
- IDs are regenerated instead of copied;
- numeric operations are performed in natural language;
- quotes are summarized but presented as verbatim;
- code is generated without parsing or tests.

### Common limitations


Symbolic controls can preserve exactness but do not decide whether the value is appropriate for the task.

### Not this


Do not treat all factual errors as symbolic errors. Use this family when exact representation or formal transformation is the relevant control surface.

### Example

```text
Layer 2:
  exact-string corruption

Layer 3 system fault:
  generated customer ID was passed to API without allowlist validation

Control:
  customer ID must be selected from retrieved database results, not regenerated
```

## L3A6. Interaction Contract Controls

### Purpose


Ensure that assistant behavior follows the intended product interaction contract: tone, verbosity, clarification, refusal, escalation, explanation level, and implementation disclosure.

### Core question


> Did the system enforce the desired user-facing interaction behavior?

### Boundary


Interface and Contract Boundary, with links to Policy and Reliability.

### Addresses


- tone/persona inconsistency;
- verbosity mismatch;
- unnecessary clarification;
- failure to clarify;
- inconsistent refusal;
- inconsistent escalation;
- sycophantic agreement;
- over-answering;
- implementation disclosure;
- product-experience inconsistency.

### Typical controls


- product behavior spec;
- tone and style guide;
- response templates;
- clarification policy;
- refusal and escalation policy;
- UI-level disclosure rules;
- post-generation classifiers;
- interaction regression tests;
- human review for sensitive interactions.

### System locations


- system/developer prompts;
- response planning;
- post-processing;
- policy layer;
- UI layer;
- evaluation harness;
- monitoring.

### Evaluation methods


- semantic output evaluation;
- safety / policy evaluation;
- perturbation evaluation;
- distributional slice evaluation;
- regression evaluation;
- human rubric review.

### Observability requirements


- user request;
- conversation state;
- selected interaction mode;
- clarification decision;
- refusal/escalation decision;
- final response;
- reviewer labels where available.

### Common system faults


- product behavior is specified only informally;
- tone rules conflict with safety rules;
- clarification policy is absent;
- refusal and escalation behavior are not tested across slices;
- style regressions are not monitored.

### Common limitations


Interaction controls cannot substitute for grounding, verification, policy, or action authorization.

### Not this


Correct content delivered with poor tone is an interaction-control issue. False content is an epistemic or grounding issue.

### Example

```text
Layer 2:
  clarification failure

Layer 3 system fault:
  no rule defines when the assistant should ask a clarifying question before action

Control:
  clarification policy requires missing destination, recipient, or date before booking or sending
```

# L3-B -- Knowledge and Grounding Controls

## L3B1. Context Assembly Controls

### Purpose


Ensure the model receives the runtime information required for correct behavior in a usable form.

### Core question


> Did the system supply the right context, in the right order, at the right level of detail, with the right labels?

### Boundary


Knowledge and Grounding Boundary.

### Addresses


- context omission;
- context underutilization;
- context priority confusion;
- continuity loss;
- stale-state reliance;
- retrieval-conditioned answer failure;
- truncation-induced loss.

### Typical controls


- context completeness checks;
- context packing rules;
- source inclusion rules;
- chunk ordering rules;
- required-evidence checklists;
- context budget planning;
- recency markers;
- context assembly tests;
- dropped-context logging;
- missing-evidence abstention rules.

### System locations


- retrieval integration;
- memory rehydration;
- prompt assembly;
- long-context management;
- summarization layer;
- evaluation harness.

### Evaluation methods


- context ablation / insertion evaluation;
- retrieval evaluation;
- grounding evaluation;
- stress / budget evaluation;
- regression evaluation.

### Observability requirements


- retrieved documents;
- included context;
- excluded context;
- context order;
- source metadata;
- token budget;
- truncation decisions;
- prompt assembly trace.

### Common system faults


- required evidence not inserted;
- relevant state omitted;
- context included without metadata;
- important spans buried or truncated;
- stale context indistinguishable from fresh context;
- context budget is exceeded silently.

### Common limitations


Supplying context does not guarantee the model will use it faithfully. Pair with grounding and citation controls.

### Not this


If context was present but ignored, the Layer 2 fault is context underutilization. The Layer 3 issue may be weak evidence packaging or missing grounding checks.

### Example

```text
Layer 2:
  context omission

Layer 3 system fault:
  governing policy was not included in the prompt

Control:
  required-source checklist before answer generation
```

## L3B2. Retrieval Controls

### Purpose


Ensure the system retrieves and ranks relevant evidence before generation.

### Core question


> Did retrieval find the right evidence for the task?

### Boundary


Knowledge and Grounding Boundary.

### Addresses


- missing evidence;
- stale evidence;
- irrelevant context;
- incomplete context;
- retrieval-conditioned answer failure;
- source coverage gaps;
- context omission.

### Typical controls


- retriever evaluation;
- query rewriting;
- hybrid retrieval;
- reranking;
- metadata filters;
- source allowlists;
- freshness filters;
- recall-at-k checks;
- expected-document tests;
- chunk completeness tests;
- retrieval fallback strategies.

### System locations


- search/retrieval layer;
- vector database;
- keyword index;
- reranker;
- metadata filtering;
- query planner;
- evaluation harness.

### Evaluation methods


- retrieval evaluation;
- context ablation / insertion evaluation;
- regression evaluation;
- distributional slice evaluation.

### Observability requirements


- query;
- rewritten query;
- retrieval candidates;
- rankings;
- scores;
- filters;
- selected chunks;
- missing expected documents;
- source freshness metadata.

### Common system faults


- retriever misses governing document;
- reranker demotes relevant evidence;
- filters exclude required source;
- chunks split key information;
- stale documents rank above current documents;
- retrieval index is out of date.

### Common limitations


Good retrieval does not guarantee good answer generation. The model may still ignore, distort, or overrule retrieved evidence.

### Not this


Bad retrieval is a Layer 3 system fault. The Layer 2 manifestation is the answer behavior under missing, stale, noisy, or misprioritized evidence.

### Example

```text
Layer 2:
  retrieval-conditioned answer failure

Layer 3 system fault:
  retriever failed to return the governing policy document

Control:
  expected-document retrieval tests and source freshness filters
```

## L3B3. Source Authority and Freshness Controls

### Purpose


Preserve source priority, authority, validity, and currency.

### Core question


> Did the system distinguish current, authoritative, approved, and relevant sources from weaker sources?

### Boundary


Knowledge and Grounding Boundary.

### Addresses


- source/authority confusion;
- stale-state reliance;
- context priority confusion;
- weak grounding;
- unsupported claims;
- policy-boundary failure;
- retrieval-conditioned answer failure.

### Typical controls


- source authority metadata;
- freshness timestamps;
- source allowlists/denylists;
- jurisdiction or domain filters;
- version markers;
- effective-date checks;
- deprecation handling;
- conflict-resolution rules;
- source-priority ranking;
- stale-source warnings;
- approved-source requirements.

### System locations


- document ingestion;
- retrieval index;
- metadata store;
- prompt assembly;
- grounding checks;
- policy layer;
- UI/source display.

### Evaluation methods


- context ablation / insertion evaluation;
- retrieval evaluation;
- grounding evaluation;
- safety/policy evaluation;
- regression evaluation.

### Observability requirements


- source ID;
- source authority level;
- source date;
- version;
- freshness status;
- source priority;
- conflicting sources;
- selected source rationale.

### Common system faults


- stale documents not marked stale;
- low-authority sources treated as governing;
- source versions are mixed;
- source metadata is lost during chunking;
- conflict-resolution rules absent;
- model asked to infer authority from prose alone.

### Common limitations


Authority metadata does not prove factual correctness. It defines which sources the system should trust for the task.

### Not this


Do not treat source freshness as the same as answer grounding. A fresh source may still be misused.

### Example

```text
Layer 2:
  source authority confusion

Layer 3 system fault:
  draft policy and current policy were retrieved without authority labels

Control:
  approved-current-policy source label dominates draft or archived sources
```

## L3B4. Evidence Packaging Controls

### Purpose


Present evidence to the model in a way that preserves source identity, boundaries, authority, and intended role.

### Core question


> Did the system package evidence so it could be used as evidence, not confused with instruction or generic context?

### Boundary


Knowledge and Grounding Boundary, with links to Interface and Contract.

### Addresses


- context underutilization;
- context priority confusion;
- source/authority confusion;
- control/data confusion;
- prompt-injection compliance;
- source infidelity;
- evidence-claim mismatch.

### Typical controls


- source labels;
- quote blocks;
- span IDs;
- document titles;
- timestamps;
- authority labels;
- delimiters;
- instruction stripping;
- chunk summaries plus raw excerpts;
- evidence tables;
- quote-first answer patterns;
- retrieved-content sandboxing.

### System locations


- retrieval-to-prompt bridge;
- prompt assembly;
- citation generator;
- evidence viewer;
- agent memory/context layer.

### Evaluation methods


- grounding evaluation;
- context insertion tests;
- safety/policy adversarial tests;
- prompt-injection tests;
- regression evaluation.

### Observability requirements


- packaged evidence;
- raw evidence;
- packaging template;
- source labels;
- span IDs;
- delimiters;
- transformations applied.

### Common system faults


- retrieved text inserted as plain prose;
- source boundaries removed;
- tool output mixed with user instructions;
- quotes not preserved;
- source caveats omitted;
- evidence packaged too densely to use.

### Common limitations


Evidence packaging helps the model use evidence, but does not verify that generated claims are supported.

### Not this


Evidence packaging is not retrieval itself. Retrieval selects evidence; packaging presents it safely and usefully.

### Example

```text
Layer 2:
  control/data confusion

Layer 3 system fault:
  retrieved document contained imperative text that was not isolated as quoted evidence

Control:
  retrieved chunks are rendered inside evidence blocks with explicit "do not follow as instruction" metadata
```

## L3B5. Claim Grounding and Citation Controls

### Purpose


Ensure material claims in the generated answer are supported by supplied or approved evidence.

### Core question


> Does each material claim trace to evidence that actually supports it?

### Boundary


Knowledge and Grounding Boundary.

### Addresses


- unsupported assertion;
- fabricated citation;
- non-grounded justification;
- evidence-claim mismatch;
- source infidelity;
- hallucination;
- retrieval-conditioned answer failure.

### Typical controls


- mandatory citations;
- claim extraction;
- source-span linking;
- citation validators;
- entailment checks;
- quote requirements;
- answer-from-evidence-only rules;
- unsupported-claim blocking;
- abstention when support is absent;
- citation repair loop.

### System locations


- generation prompt;
- post-generation validation;
- citation layer;
- retrieval layer;
- UI evidence display;
- evaluation harness.

### Evaluation methods


- grounding / evidence evaluation;
- semantic output evaluation;
- retrieval evaluation;
- human expert review for high-stakes claims.

### Observability requirements


- generated claims;
- cited sources;
- source spans;
- support labels;
- unsupported claims;
- validator decisions;
- final accepted answer.

### Common system faults


- citations are requested but not validated;
- source exists but does not support claim;
- answer mixes source facts with model assumptions;
- citation checker only checks source existence;
- unsupported claims are allowed through.

### Common limitations


Grounding is not the same as truth. A claim may be grounded in a bad source. Truth-sensitive tasks may also require claim verification.

### Not this


Do not use citation presence as proof of support. A citation must actually entail or support the claim.

### Example

```text
Layer 2:
  evidence-claim mismatch

Layer 3 system fault:
  source URL was required, but source-support validation was absent

Control:
  claim-source entailment check blocks unsupported cited claims
```

## L3B6. Claim Verification Controls

### Purpose


Check important claims against trusted references, tools, databases, formal checks, or expert review.

### Core question


> Did the system verify high-value or high-risk claims beyond generated plausibility?

### Boundary


Knowledge and Grounding Boundary.

### Addresses


- plausibility-truth gap;
- unsupported assertion;
- stale knowledge;
- common misconception reproduction;
- parametric-prior override;
- high-confidence wrong answer;
- numeric/symbolic errors;
- policy or legal misstatements.

### Typical controls


- tool-based fact checking;
- database lookup;
- reference answer comparison;
- external calculators;
- source-of-truth APIs;
- domain-specific validators;
- expert review;
- formal checkers;
- verification-required policies;
- abstention when verification is unavailable.

### System locations


- pre-answer retrieval;
- tool orchestration;
- post-generation validation;
- high-risk gate;
- human review workflow;
- monitoring.

### Evaluation methods


- truth / factuality evaluation;
- semantic output evaluation;
- grounding evaluation;
- calibration evaluation;
- distributional slice evaluation.

### Observability requirements


- claim;
- verification source;
- verification query;
- tool result;
- verification status;
- unresolved claims;
- final decision.

### Common system faults


- model self-check treated as verification;
- high-risk claims are not checked;
- verification tool result is ignored;
- outdated reference source used;
- unsupported claims are rewritten rather than blocked.

### Common limitations


Verification is only as good as the trusted source, tool, or human process used.

### Not this


Claim verification is not the same as generated self-evaluation. Generated self-evaluation is another model output, not independent verification.

### Example

```text
Layer 2:
  high-confidence wrong answer

Layer 3 system fault:
  numerical result was generated without calculator verification

Control:
  arithmetic claims are checked with deterministic calculation before final answer
```

## L3B7. Confidence Communication Controls

### Purpose


Prevent misleading confidence, false verification language, unsupported certainty, or inappropriate uncertainty communication.

### Core question


> Did the system communicate reliability in a way that reflects actual evidence and verification status?

### Boundary


Knowledge and Grounding Boundary, with links to Policy and Reliability.

### Addresses


- weak confidence calibration;
- misleading confidence;
- false claim of checking;
- non-privileged self-evaluation;
- over-hedging;
- under-warning;
- action-readiness error.

### Typical controls


- confidence-language policy;
- evidence-based confidence labels;
- verified/unverified UI distinction;
- abstention thresholds;
- uncertainty templates;
- tool-backed verification badges;
- confidence suppression for unsupported claims;
- high-risk warning rules;
- calibration models where available.

### System locations


- response generation;
- post-processing;
- UI layer;
- policy layer;
- verification layer;
- human review workflow.

### Evaluation methods


- calibration evaluation;
- grounding evaluation;
- safety/policy evaluation;
- repeated-run evaluation;
- human rubric review.

### Observability requirements


- confidence language;
- evidence status;
- verification status;
- uncertainty trigger;
- abstention or escalation decision;
- user-facing reliability label.

### Common system faults


- confidence language is unconstrained;
- model says "I checked" without tool or source verification;
- UI implies verification where none occurred;
- high-risk answers lack uncertainty or escalation;
- confidence scores are not calibrated.

### Common limitations


Confidence communication controls manage user-facing reliability signals. They do not make the underlying answer correct.

### Not this


Do not treat model confidence as evidence. Confidence language is generated behavior unless grounded in external verification or calibrated measurement.

### Example

```text
Layer 2:
  non-privileged self-evaluation

Layer 3 system fault:
  assistant allowed to say "I verified this" without a verification trace

Control:
  verification language is permitted only when a verification tool or approved source check passed
```

# L3-C -- State, Process, and Action Controls

## L3C1. State Persistence Controls

### Purpose


Preserve required state across turns, calls, sessions, workflows, and external operations.

### Core question


> Did the system store the state needed for future behavior?

### Boundary


State, Process, and Action Boundary.

### Addresses


- continuity loss;
- stale-state reliance;
- forgotten preference;
- lost workflow state;
- inconsistent multi-step behavior;
- missing tool results;
- recovery failure.

### Typical controls


- explicit state stores;
- session state;
- workflow state records;
- durable memory;
- task checkpoints;
- tool-result persistence;
- approval records;
- state schemas;
- state freshness timestamps;
- state transition logs.

### System locations


- application backend;
- workflow orchestrator;
- memory layer;
- tool integration layer;
- conversation manager;
- database.

### Evaluation methods


- state carryover tests;
- multi-turn workflow tests;
- agent trace evaluation;
- regression evaluation;
- stress / budget evaluation.

### Observability requirements


- state before call;
- state after call;
- state transition;
- persisted tool results;
- approvals or denials;
- freshness markers;
- state retrieval events.

### Common system faults


- state exists only in model context;
- prior tool output not persisted;
- approvals or refusals are not stored;
- state schema is ambiguous;
- stale state not marked stale;
- state changes are not audited.

### Common limitations


Persistent state must still be reintroduced or used correctly. Persistence alone does not guarantee model awareness.

### Not this


State persistence stores information. Memory rehydration determines what state is inserted into the current context.

### Example

```text
Layer 2:
  continuity loss

Layer 3 system fault:
  prior user approval was not stored outside the prompt

Control:
  approval state is persisted with timestamp, scope, and workflow ID
```

## L3C2. Memory Rehydration Controls

### Purpose


Reintroduce relevant stored state into the current runtime context in a controlled way.

### Core question


> Did the system supply the relevant stored state back to the model when needed?

### Boundary


State, Process, and Action Boundary, with links to Knowledge and Grounding.

### Addresses


- continuity loss;
- stale-state reliance;
- context omission;
- context priority confusion;
- compression-induced distortion;
- long-conversation drift.

### Typical controls


- memory retrieval rules;
- state relevance filters;
- state freshness checks;
- context rehydration templates;
- session summaries;
- summary validation;
- memory scopes;
- stale memory warnings;
- explicit state confirmation;
- memory conflict resolution.

### System locations


- memory layer;
- prompt assembly;
- state manager;
- retrieval layer;
- conversation orchestrator.

### Evaluation methods


- memory consistency tests;
- long-conversation tests;
- state carryover tests;
- context ablation / insertion evaluation;
- regression evaluation.

### Observability requirements


- candidate memories;
- selected memories;
- excluded memories;
- memory freshness;
- rehydrated context;
- summary provenance;
- conflict decisions.

### Common system faults


- relevant memory not reintroduced;
- stale memory inserted as current;
- summaries omit critical constraints;
- memory conflicts not resolved;
- sensitive memory inserted inappropriately;
- memory retrieval is not audited.

### Common limitations


Rehydrated memory can still be ignored or misused by the model. Pair with context assembly and grounding controls when state is evidence-like.

### Not this


Do not treat all retrieval as memory. Memory concerns continuity state; retrieval usually concerns external evidence.

### Example

```text
Layer 2:
  stale-state reliance

Layer 3 system fault:
  old project decision was inserted without freshness marker or conflict check

Control:
  memory rehydration includes timestamp, scope, and supersession status
```

## L3C3. Planning and Process Integrity Controls

### Purpose


Ensure multi-step reasoning, planning, decomposition, and workflow execution preserve goals, constraints, and checkpoints.

### Core question


> Did the system keep the process aligned with the goal and required invariants?

### Boundary


State, Process, and Action Boundary.

### Addresses


- plan drift;
- invariant loss;
- spurious decomposition;
- premature closure;
- error accumulation;
- local plausibility drift;
- loop/repetition;
- action-readiness error;
- reasoning/planning integrity failure.

### Typical controls


- explicit plan representation;
- step checklists;
- invariant tracking;
- plan checkpoints;
- stop-and-check policies;
- decomposition templates;
- intermediate validation;
- loop detection;
- maximum-step policies;
- state-machine workflows;
- human checkpoints for high-risk steps.

### System locations


- agent orchestrator;
- workflow engine;
- planning module;
- prompt templates;
- tool-call controller;
- evaluation harness.

### Evaluation methods


- reasoning/process evaluation;
- agent trace evaluation;
- semantic output evaluation;
- safety/policy evaluation;
- regression evaluation.

### Observability requirements


- plan;
- step list;
- current step;
- invariants;
- checkpoint outcomes;
- skipped steps;
- stop decision;
- final state.

### Common system faults


- plan exists only as unvalidated text;
- constraints are not tracked across steps;
- agent can finalize before required checks;
- loops are not detected;
- failures do not update the plan;
- intermediate claims are not verified.

### Common limitations


A visible plan is not proof of correct reasoning. Process controls need validation, not just generated explanations.

### Not this


Do not treat chain-of-thought-like text as a control by itself. A control must inspect, enforce, or gate behavior.

### Example

```text
Layer 2:
  premature closure

Layer 3 system fault:
  workflow allowed final answer before required evidence check

Control:
  process checkpoint blocks final response until evidence status is complete
```

## L3C4. Tool Selection Controls

### Purpose


Ensure the system chooses the correct tool, or no tool, for the task state.

### Core question


> Did the system route to the right tool at the right time?

### Boundary


State, Process, and Action Boundary.

### Addresses


- wrong tool choice;
- missing needed tool call;
- unnecessary tool call;
- task misinduction;
- premature closure;
- unsafe action-readiness;
- agentic process failure.

### Typical controls


- tool routing policies;
- tool eligibility rules;
- tool affordance descriptions;
- tool choice validators;
- required-tool triggers;
- no-tool conditions;
- specialist routers;
- tool-call regression tests;
- human approval for high-risk tools.

### System locations


- agent orchestrator;
- tool router;
- prompt/tool descriptions;
- policy layer;
- runtime monitor;
- evaluation harness.

### Evaluation methods


- agent trace evaluation;
- perturbation evaluation;
- safety/policy evaluation;
- regression evaluation;
- distributional slice evaluation.

### Observability requirements


- available tools;
- selected tool;
- tool eligibility decision;
- rationale or rule triggered;
- skipped tools;
- no-tool decision;
- tool-call outcome.

### Common system faults


- model freely chooses tools without routing policy;
- tool descriptions are ambiguous;
- required lookup is skipped;
- dangerous tool available for low-confidence cases;
- no logging of tool selection decisions.

### Common limitations


Correct tool selection does not guarantee correct arguments or correct interpretation of output.

### Not this


Tool selection is separate from tool argument validation and action authorization.

### Example

```text
Layer 2:
  tool-selection error

Layer 3 system fault:
  model could answer from memory when a fresh lookup was required

Control:
  policy requires retrieval tool before answering freshness-sensitive questions
```

## L3C5. Tool Argument Controls

### Purpose


Validate tool arguments before execution.

### Core question


> Were tool arguments complete, valid, safe, authorized, and consistent with task state?

### Boundary


State, Process, and Action Boundary.

### Addresses


- tool-argument error;
- exact-string corruption;
- numeric/symbolic fragility;
- action-readiness error;
- output contract drift;
- unsafe or malformed external operations.

### Typical controls


- typed tool schemas;
- required field validation;
- enum validation;
- ID allowlists;
- date and amount validation;
- authorization checks;
- argument normalization;
- confirmation for risky arguments;
- dry-run mode;
- argument diff display;
- reject-and-repair loop.

### System locations


- tool-call builder;
- schema validator;
- API gateway;
- action layer;
- orchestration layer;
- UI confirmation layer.

### Evaluation methods


- schema/parser validation;
- agent trace evaluation;
- safety/policy evaluation;
- exact-match tests;
- regression evaluation.

### Observability requirements


- proposed arguments;
- validation result;
- rejected arguments;
- repaired arguments;
- execution arguments;
- source of argument values;
- authorization status.

### Common system faults


- tool arguments generated as free text;
- IDs are hallucinated or corrupted;
- optional fields treated as required or vice versa;
- validation errors ignored;
- user confirmation omitted for high-impact calls.

### Common limitations


Argument validation does not guarantee the tool should have been called. Pair with tool selection and action authorization controls.

### Not this


This family validates tool inputs. Tool-output interpretation is separate.

### Example

```text
Layer 2:
  tool-argument error

Layer 3 system fault:
  generated account ID was sent to API without checking against retrieved account list

Control:
  account ID must match allowlisted IDs from source-of-truth lookup
```

## L3C6. Tool Output Interpretation Controls

### Purpose


Ensure tool results are correctly read, applied, and incorporated into the next step or final answer.

### Core question


> Did the system correctly interpret and use tool outputs?

### Boundary


State, Process, and Action Boundary, with links to Knowledge and Grounding.

### Addresses


- tool-output misinterpretation;
- context underutilization;
- evidence-claim mismatch;
- source infidelity;
- premature closure;
- recovery failure;
- action-readiness error.

### Typical controls


- typed tool-output schemas;
- result summarizers with validation;
- tool-output grounding checks;
- source-of-truth status labels;
- error-state handling;
- empty-result handling;
- contradiction checks;
- result-to-answer citation rules;
- tool-output diffing;
- post-tool checkpoints.

### System locations


- tool integration layer;
- prompt assembly;
- agent orchestrator;
- grounding layer;
- post-processing;
- trace viewer.

### Evaluation methods


- agent trace evaluation;
- grounding evaluation;
- semantic output evaluation;
- context ablation/insertion evaluation;
- regression evaluation.

### Observability requirements


- raw tool output;
- parsed tool output;
- error status;
- selected result;
- ignored results;
- generated interpretation;
- final answer use.

### Common system faults


- tool errors treated as successful results;
- empty results ignored;
- model overgeneralizes from one row;
- tool output not reintroduced into context;
- tool output converted to lossy prose;
- no check that final answer matches tool result.

### Common limitations


Correct interpretation of tool output does not verify that the tool itself returned correct data.

### Not this


If the tool returned stale or wrong data, that may be a data/source control issue. If the model misread correct output, use this family.

### Example

```text
Layer 2:
  tool-output misinterpretation

Layer 3 system fault:
  API returned "no matching record" but model proceeded as if record existed

Control:
  empty-result state triggers clarification or abstention rather than answer generation
```

## L3C7. Recovery and Retry Controls

### Purpose


Define how the system responds when a failure, uncertainty, missing data, invalid output, or tool error occurs.

### Core question


> Did the system recover safely and productively after a detected problem?

### Boundary


State, Process, and Action Boundary.

### Addresses


- recovery failure;
- parser failure;
- unsupported assertion;
- missing evidence;
- tool failure;
- premature closure;
- looping/repetition;
- budget-induced incompleteness;
- action-readiness error.

### Typical controls


- retry policies;
- repair prompts;
- retrieve-more-evidence path;
- ask-clarification path;
- fallback model/tool;
- abstention;
- escalation;
- loop limits;
- error-state-specific handling;
- partial-completion handling;
- safe degradation.

### System locations


- orchestrator;
- validators;
- retrieval layer;
- tool layer;
- policy layer;
- UI flow;
- monitoring.

### Evaluation methods


- agent trace evaluation;
- regression evaluation;
- stress/budget evaluation;
- safety/policy evaluation;
- scenario tests with injected failures.

### Observability requirements


- detected failure;
- retry trigger;
- retry count;
- repair prompt;
- fallback path;
- escalation decision;
- final recovered state;
- unrecovered state.

### Common system faults


- same failed request retried without change;
- parser repair introduces semantic changes;
- tool failure hidden from user;
- loop limit absent;
- missing evidence leads to hallucinated answer;
- fallback path bypasses policy.

### Common limitations


Retries can amplify instability or cost if not bounded and evaluated.

### Not this


A retry is not automatically a recovery control. It must change the conditions or have a defined stopping and fallback rule.

### Example

```text
Layer 2:
  recovery failure

Layer 3 system fault:
  failed retrieval led to unsupported answer instead of abstention or retry

Control:
  missing-evidence state triggers retrieval retry, then abstention if still unresolved
```

## L3C8. Action Authorization Controls

### Purpose


Block recommendations or external actions until evidence, policy, user permission, and authority requirements are satisfied.

### Core question


> Was the system authorized and justified before taking or recommending action?

### Boundary


State, Process, and Action Boundary.

### Addresses


- unsafe action;
- action-readiness error;
- under-refusal;
- policy-boundary failure;
- tool-argument error;
- premature closure;
- sycophantic agreement;
- unauthorized recommendations.

### Typical controls


- explicit user confirmation;
- permission checks;
- role-based access control;
- action-risk classification;
- evidence requirements;
- policy checks;
- approval gates;
- irreversible-action blocking;
- dry-run previews;
- confirmation summaries;
- dual-control for high-risk actions.

### System locations


- tool execution layer;
- API gateway;
- workflow engine;
- UI confirmation layer;
- policy engine;
- audit log.

### Evaluation methods


- agent trace evaluation;
- safety/policy evaluation;
- semantic output evaluation;
- regression evaluation;
- adversarial tests.

### Observability requirements


- proposed action;
- user authorization;
- policy status;
- evidence status;
- approval record;
- action preview;
- executed action;
- cancellation or rollback state.

### Common system faults


- model can trigger external action directly;
- user intent is inferred without confirmation;
- risky actions lack evidence checks;
- authorization state is not stored;
- policy checks occur after execution;
- no audit trail.

### Common limitations


Authorization controls do not guarantee the action is wise or optimal. They verify permission and minimum requirements.

### Not this


Action authorization is distinct from tool argument validation. Correct arguments can still be unauthorized.

### Example

```text
Layer 2:
  action-readiness error

Layer 3 system fault:
  assistant sent an email based on inferred intent without confirmation

Control:
  external-send action requires explicit user confirmation of recipient, subject, and body
```

## L3C9. Transaction and Rollback Controls

### Purpose


Make risky state-changing actions confirmable, reversible, auditable, or compensable.

### Core question


> If an action is wrong, can the system prevent, reverse, audit, or compensate for it?

### Boundary


State, Process, and Action Boundary.

### Addresses


- unsafe action;
- wrong tool arguments;
- premature closure;
- recovery failure;
- external action errors;
- high-impact workflow failures.

### Typical controls


- dry-run mode;
- pending state;
- two-phase commit;
- undo/rollback;
- cancellation windows;
- compensating transactions;
- idempotency keys;
- action receipts;
- audit logs;
- explicit confirmation;
- high-risk transaction review.

### System locations


- action execution layer;
- database layer;
- external API gateway;
- workflow engine;
- UI confirmation flow;
- audit system.

### Evaluation methods


- agent trace evaluation;
- safety/policy evaluation;
- regression evaluation;
- incident simulation;
- action safety tests.

### Observability requirements


- requested action;
- confirmed action;
- transaction ID;
- before/after state;
- rollback path;
- idempotency token;
- human approval where needed.

### Common system faults


- irreversible action executes immediately;
- no idempotency control;
- duplicate tool calls create duplicate effects;
- rollback unavailable;
- cancellation state not surfaced;
- audit record incomplete.

### Common limitations


Rollback controls cannot undo every external consequence. Some systems require prevention rather than recovery.

### Not this


Do not rely on rollback for actions that must not occur. Use action authorization and policy controls first.

### Example

```text
Layer 2:
  duplicate tool call from looping behavior

Layer 3 system fault:
  payment API accepted repeated calls without idempotency key

Control:
  transaction layer requires idempotency and pending confirmation before execution
```

# L3-D -- Policy, Reliability, and Operating-Envelope Controls

## L3D1. Policy Boundary Controls

### Purpose


Enforce safety, privacy, compliance, allowed-use, and organizational policy boundaries.

### Core question


> Did the system preserve required policy boundaries under normal, ambiguous, and adversarial conditions?

### Boundary


Policy, Reliability, and Operating-Envelope Boundary.

### Addresses


- under-refusal;
- over-refusal;
- unsafe compliance;
- sensitive-data leakage;
- unauthorized recommendations;
- prompt-injection compliance;
- policy inconsistency;
- unsafe action-readiness.

### Typical controls


- policy engine;
- policy classifiers;
- allowed/disallowed task taxonomy;
- sensitive-data filters;
- high-stakes domain rules;
- jurisdiction/domain policies;
- policy-grounded refusal templates;
- policy escalation rules;
- adversarial input handling;
- policy regression suite.

### System locations


- input filtering;
- prompt assembly;
- model response validation;
- tool/action layer;
- UI layer;
- monitoring;
- human review.

### Evaluation methods


- safety/policy evaluation;
- adversarial tests;
- perturbation evaluation;
- distributional slice evaluation;
- regression evaluation;
- human expert review.

### Observability requirements


- policy category;
- policy rule triggered;
- input/output risk label;
- refusal/escalation decision;
- sensitive data detection;
- policy version;
- reviewer override.

### Common system faults


- policy expressed only in prompt text;
- policy conflicts with task contract;
- policy not applied to tool actions;
- policy version not tracked;
- edge cases not regression-tested;
- policy classifier output ignored.

### Common limitations


Policy controls can block or route behavior, but they do not themselves make the answer grounded or useful.

### Not this


Do not confuse policy boundary controls with interaction style. A refusal can be stylistically poor but policy-correct, or stylistically good but policy-wrong.

### Example

```text
Layer 2:
  under-refusal

Layer 3 system fault:
  policy gate only checked user input, not generated output or tool action

Control:
  policy check runs before final answer and before external action execution
```

## L3D2. Refusal and Escalation Controls

### Purpose


Ensure the system refuses, warns, clarifies, escalates, or proceeds according to risk, ambiguity, policy, and confidence conditions.

### Core question


> Did the system choose the right non-answer or escalation behavior when direct completion was inappropriate?

### Boundary


Policy, Reliability, and Operating-Envelope Boundary.

### Addresses


- over-refusal;
- under-refusal;
- clarification failure;
- escalation failure;
- unsafe action-readiness;
- misleading confidence;
- policy-boundary failure;
- user-experience inconsistency.

### Typical controls


- refusal policy;
- escalation criteria;
- clarification triggers;
- uncertainty thresholds;
- high-risk routing;
- human handoff;
- refusal templates;
- warning templates;
- blocked-action states;
- proceed/clarify/escalate decision rules.

### System locations


- response planner;
- policy layer;
- tool/action layer;
- UI flow;
- human review system;
- monitoring.

### Evaluation methods


- safety/policy evaluation;
- semantic output evaluation;
- perturbation evaluation;
- repeated-run evaluation;
- regression evaluation;
- human rubric review.

### Observability requirements


- risk level;
- ambiguity level;
- policy category;
- confidence/verification status;
- refusal/escalation decision;
- human handoff package;
- final user-facing response.

### Common system faults


- model decides refusal without policy gate;
- allowed tasks over-refused;
- risky tasks fulfilled without escalation;
- clarification rule absent;
- human escalation lacks evidence package;
- escalation criteria differ across similar scenarios.

### Common limitations


Escalation controls do not solve the original task; they route it to a safer path.

### Not this


Human escalation is a specific kind of escalation. This family also includes automated refusal, warning, clarification, and safe fallback.

### Example

```text
Layer 2:
  clarification failure

Layer 3 system fault:
  system proceeded with ambiguous user intent in a high-impact workflow

Control:
  escalation policy requires clarification before irreversible action
```

## L3D3. Competence Boundary Controls

### Purpose


Detect when a task falls outside the system's reliable competence envelope.

### Core question


> Did the system recognize domains, formats, languages, slices, or edge cases where performance is unreliable?

### Boundary


Policy, Reliability, and Operating-Envelope Boundary.

### Addresses


- competence cliffs;
- distributional overgeneralization;
- rare-format brittleness;
- domain failures;
- multilingual degradation;
- benchmark/product mismatch;
- high-confidence wrong answers;
- unsafe recommendations outside scope.

### Typical controls


- domain classifiers;
- slice-level evals;
- task scope restrictions;
- specialist routing;
- abstention rules;
- expert review gates;
- unsupported-domain warnings;
- product capability declarations;
- competence monitoring;
- edge-case registries.

### System locations


- input triage;
- routing;
- policy layer;
- UI disclosure;
- evaluation harness;
- monitoring;
- human review.

### Evaluation methods


- distributional slice evaluation;
- safety/policy evaluation;
- truth/factuality evaluation;
- human expert review;
- regression evaluation.

### Observability requirements


- detected domain/slice;
- competence label;
- routing decision;
- abstention/escalation decision;
- failure rates by slice;
- reviewer feedback.

### Common system faults


- aggregate performance hides slice failures;
- high-risk domains not classified;
- unsupported languages accepted silently;
- edge cases not monitored;
- fallback unavailable for out-of-scope tasks.

### Common limitations


Competence boundaries are empirical and may change with model, data, prompt, retrieval, and product scope.

### Not this


Do not use competence-boundary controls as a substitute for verification on high-stakes tasks.

### Example

```text
Layer 2:
  distributional competence failure

Layer 3 system fault:
  system handled rare legal-document format with same workflow as common documents

Control:
  document-type classifier routes unsupported formats to expert review
```

## L3D4. Routing and Fallback Controls

### Purpose


Route tasks to safer, more capable, cheaper, faster, or more appropriate paths based on task, risk, evidence, budget, and competence conditions.

### Core question


> Did the system choose the right processing path for this case?

### Boundary


Policy, Reliability, and Operating-Envelope Boundary.

### Addresses


- competence cliffs;
- budget-induced incompleteness;
- unsupported claims;
- retrieval-conditioned failure;
- unsafe action-readiness;
- recovery failure;
- high-risk domain failures.

### Typical controls


- model routing;
- specialist model/tool routing;
- retrieval-required routing;
- human fallback;
- low-confidence fallback;
- high-risk workflow routing;
- budget-aware routing;
- abstention path;
- fallback answer templates;
- route-specific eval gates.

### System locations


- request router;
- orchestrator;
- policy layer;
- model gateway;
- retrieval layer;
- human review queue;
- monitoring.

### Evaluation methods


- semantic output evaluation;
- agent trace evaluation;
- distributional slice evaluation;
- stress/budget evaluation;
- regression evaluation.

### Observability requirements


- route candidates;
- selected route;
- routing rules triggered;
- confidence/risk/budget inputs;
- fallback reason;
- route outcome;
- route-level metrics.

### Common system faults


- all tasks sent to same model/workflow;
- fallback bypasses validators;
- risky tasks not escalated;
- budget routing degrades quality silently;
- routing changes not regression-tested.

### Common limitations


Routing improves system behavior only if routes have distinct capabilities and are evaluated separately.

### Not this


Routing is not the same as retrieval. Retrieval supplies evidence; routing selects processing path.

### Example

```text
Layer 2:
  competence cliff

Layer 3 system fault:
  specialized tax question was routed to generic assistant path

Control:
  domain classifier routes tax questions to approved tax workflow or human review
```

## L3D5. Stability Controls

### Purpose


Detect and bound unacceptable behavior variation across repeated runs, paraphrases, configurations, and deployment conditions.

### Core question


> Did the system preserve materially equivalent behavior across repeats and reasonable variations?

### Boundary


Policy, Reliability, and Operating-Envelope Boundary.

### Addresses


- behavioral instability;
- repeatability variance;
- tail-risk generation;
- prompt-form sensitivity;
- unstable refusal/escalation;
- unstable tool use;
- unstable citations;
- regression drift.

### Typical controls


- deterministic decoding where appropriate;
- repeated-run acceptance thresholds;
- paraphrase robustness tests;
- scenario invariance tests;
- tool-call consistency checks;
- refusal/escalation consistency checks;
- tail-risk sampling;
- route stabilization;
- regression gates;
- rollback policies.

### System locations


- decoding configuration;
- prompt/task contract;
- tool router;
- policy layer;
- evaluation harness;
- deployment pipeline;
- monitoring.

### Evaluation methods


- repeated-run evaluation;
- perturbation / paraphrase evaluation;
- regression evaluation;
- safety/policy evaluation;
- distributional slice evaluation.

### Observability requirements


- run ID;
- model/config version;
- prompt version;
- tool calls;
- decisions;
- citations;
- refusal/escalation outcomes;
- repeated-run distribution.

### Common system faults


- one demo treated as proof;
- exact text differences overemphasized while decision changes ignored;
- tail-risk not sampled;
- configuration drift untracked;
- repeatability thresholds not defined.

### Common limitations


Some variation is acceptable in generative systems. Stability controls must define material behavior, not exact wording alone.

### Not this


Do not classify harmless wording variation as failure unless it changes task-relevant behavior.

### Example

```text
Layer 2:
  output variance

Layer 3 system fault:
  no repeated-run acceptance threshold for escalation classifier

Control:
  escalation decision must be stable across repeated runs and paraphrase variants
```

## L3D6. Operating-Budget Controls

### Purpose


Manage context, token, latency, cost, compute, retrieval-depth, and retry budgets so required behavior is not silently degraded.

### Core question


> Did budget pressure change the system's ability to retrieve, reason, verify, or respond completely?

### Boundary


Policy, Reliability, and Operating-Envelope Boundary.

### Addresses


- truncation-induced loss;
- compression-induced distortion;
- budget-induced incompleteness;
- shallow reasoning;
- skipped verification;
- incomplete output;
- long-context degradation;
- latency-driven fallback errors.

### Typical controls


- context budget planner;
- token-budget accounting;
- latency budgets;
- cost caps with quality rules;
- retrieval-depth policies;
- summarization quality checks;
- budget escalation;
- task splitting;
- partial-result handling;
- verification-not-skipped rules;
- budget-aware routing.

### System locations


- prompt assembly;
- retrieval;
- orchestration;
- model gateway;
- validators;
- monitoring;
- product configuration.

### Evaluation methods


- stress / budget evaluation;
- context ablation / insertion evaluation;
- semantic output evaluation;
- regression evaluation;
- distributional slice evaluation.

### Observability requirements


- context length;
- tokens in/out;
- latency;
- cost;
- retrieval depth;
- dropped context;
- skipped checks;
- retries;
- budget-triggered fallback.

### Common system faults


- truncation not logged;
- summarization loses critical details;
- verification skipped under latency pressure;
- cost cap silently reduces retrieval quality;
- output budget too small for task;
- fallback path not quality-tested.

### Common limitations


Budget controls require explicit tradeoffs. Lower cost or latency may reduce quality unless system design compensates.

### Not this


Budget pressure is not only an infrastructure issue. It changes model-visible context and process completeness.

### Example

```text
Layer 2:
  truncation-induced loss

Layer 3 system fault:
  prompt builder silently dropped contractual exceptions to fit context window

Control:
  context budget planner marks dropped required sections and blocks answer generation
```

## L3D7. Deployment and Version Controls

### Purpose


Track and govern changes to models, prompts, tools, schemas, retrieval indexes, policies, data sources, and runtime configurations.

### Core question


> Did the system know what changed and whether that change degraded behavior?

### Boundary


Policy, Reliability, and Operating-Envelope Boundary, with links to Cross-Cutting Governance.

### Addresses


- hidden regressions;
- behavioral instability;
- prompt regressions;
- retrieval regressions;
- tool schema regressions;
- policy regressions;
- output-format regressions;
- environment drift.

### Typical controls


- version pinning;
- model/prompt/index/schema version records;
- change logs;
- deployment gates;
- canary releases;
- rollback plans;
- migration tests;
- configuration snapshots;
- policy versioning;
- data freshness tracking;
- environment parity checks.

### System locations


- deployment pipeline;
- model gateway;
- prompt registry;
- retrieval index;
- tool registry;
- policy registry;
- monitoring;
- incident review.

### Evaluation methods


- regression evaluation;
- repeated-run evaluation;
- distributional slice evaluation;
- safety/policy evaluation;
- stress/budget evaluation.

### Observability requirements


- model version;
- prompt version;
- retrieval index version;
- embedding/reranker version;
- schema version;
- policy version;
- tool/API version;
- release ID;
- rollback state.

### Common system faults


- prompt changed without regression tests;
- model update alters refusal behavior;
- index rebuilt with stale or missing documents;
- schema changed without tool tests;
- deployment cannot be reproduced;
- policy version unavailable in traces.

### Common limitations


Version tracking does not prevent regressions by itself. It must be paired with evaluation gates and runtime monitoring.

### Not this


Deployment control is not an evaluation method. It is the governance layer that decides whether a change can ship and how it can be rolled back.

### Example

```text
Layer 2:
  prompt-form sensitivity / regression

Layer 3 system fault:
  prompt edit shipped without scenario regression suite

Control:
  prompt registry requires regression gate before promotion
```

# L3-X -- Cross-Cutting Controls

## L3X1. Traceability Controls

### Purpose


Capture enough information to debug, audit, reproduce, evaluate, and improve system behavior.

### Core question


> Can we reconstruct what happened and why the system behaved as it did?

### Boundary


Cross-Cutting Observability, Evaluation, and Governance Boundary.

### Addresses


- poor observability;
- hidden regressions;
- hard-to-localize failures;
- unsupported claims;
- retrieval failures;
- tool errors;
- policy failures;
- incident recurrence.

### Typical controls


- trace IDs;
- prompt logging;
- retrieval trace capture;
- source metadata logs;
- tool-call logs;
- validator logs;
- policy decision logs;
- model/config version logs;
- user-visible action logs;
- reviewer decision logs;
- redaction and privacy controls for logs.

### System locations


- all major pipeline components;
- observability layer;
- audit system;
- evaluation harness;
- incident review.

### Evaluation methods


- agent trace evaluation;
- retrieval evaluation;
- grounding evaluation;
- regression evaluation;
- incident simulation.

### Observability requirements


This family is itself about observability. Minimum useful traces usually include:

- request;
- task contract;
- assembled prompt;
- retrieved context;
- model/version/config;
- output;
- validators;
- tool calls;
- tool outputs;
- actions;
- policies triggered;
- final decision.

### Common system faults


- final answer logged but not context;
- retrieval results not stored;
- prompt unavailable after incident;
- tool calls lack arguments;
- policy decisions not recorded;
- logs contain sensitive data without controls;
- traces cannot be joined across services.

### Common limitations


Traceability helps diagnose failures. It does not prevent them unless connected to gates, monitors, or recovery paths.

### Not this


Do not treat logging as sufficient control for high-risk actions. Logs may support audit after harm, but they do not block harm.

### Example

```text
Layer 2:
  unsupported assertion

Layer 3 system fault:
  incident review could not determine which documents were retrieved

Control:
  retrieval trace records query, ranked chunks, selected chunks, and source metadata
```

## L3X2. Evaluation Gate Controls

### Purpose


Use evaluations as operational gates for release, routing, monitoring, or remediation.

### Core question


> Did evaluations have operational consequences?

### Boundary


Cross-Cutting Observability, Evaluation, and Governance Boundary.

### Addresses


- hidden regressions;
- behavioral instability;
- policy regressions;
- output-format regressions;
- grounding degradation;
- retrieval regressions;
- competence cliffs;
- tail-risk failures.

### Typical controls


- release gates;
- scenario benchmark thresholds;
- repeated-run thresholds;
- grounding pass-rate thresholds;
- parser-failure thresholds;
- policy safety gates;
- slice-level minimums;
- regression diff approval;
- canary evaluation;
- automated rollback triggers.

### System locations


- CI/CD;
- prompt registry;
- model gateway;
- retrieval pipeline;
- policy registry;
- monitoring;
- release review process.

### Evaluation methods


- all evaluation methods depending on system type.

### Observability requirements


- evaluation version;
- scenario set;
- model/prompt/system version;
- pass/fail metrics;
- severity labels;
- approval decision;
- release artifact;
- waiver or exception record.

### Common system faults


- evals run but do not block release;
- aggregate pass rate hides critical slice failure;
- safety tests not required for policy changes;
- prompt changes bypass evaluation;
- failures waived without record;
- scenario set stale.

### Common limitations


Evaluation gates only cover the scenarios and oracles they include. They must evolve after incidents and product changes.

### Not this


An evaluation report is not a control unless it gates, routes, blocks, monitors, or triggers remediation.

### Example

```text
Layer 2:
  output-format drift

Layer 3 system fault:
  schema failures were measured but did not block deployment

Control:
  release gate blocks if parser-valid rate falls below threshold
```

## L3X3. Runtime Monitoring Controls

### Purpose


Detect degradation, drift, failures, and policy violations after deployment.

### Core question


> Did the system detect production behavior moving outside acceptable bounds?

### Boundary


Cross-Cutting Observability, Evaluation, and Governance Boundary.

### Addresses


- deployment drift;
- hidden regressions;
- retrieval degradation;
- increased unsupported claims;
- parser failure spikes;
- latency/cost drift;
- policy failure spikes;
- slice-specific degradation;
- incident recurrence.

### Typical controls


- production metrics;
- trace sampling;
- online evals;
- shadow evaluations;
- alert thresholds;
- anomaly detection;
- slice-level dashboards;
- user feedback monitoring;
- human review sampling;
- incident alerting.

### System locations


- production telemetry;
- logging pipeline;
- monitoring system;
- human review queue;
- analytics;
- incident management.

### Evaluation methods


- runtime variants of regression, grounding, parser, safety, retrieval, and slice evaluations.

### Observability requirements


- timestamps;
- model/config version;
- traffic segment;
- failure labels;
- severity;
- latency/cost;
- parser/validator outcomes;
- retrieval metrics;
- review decisions;
- alert history.

### Common system faults


- only aggregate metrics monitored;
- high-risk slices not tracked;
- no alert on parser failure spike;
- monitoring ignores tool/action outcomes;
- user complaints not linked to traces;
- no owner for alerts.

### Common limitations


Monitoring detects problems after deployment. High-risk systems also require prevention, gates, and recovery paths.

### Not this


Monitoring is not the same as evaluation gate. A gate blocks release; monitoring observes deployed behavior.

### Example

```text
Layer 2:
  weak grounding / source infidelity

Layer 3 system fault:
  unsupported-claim rate increased after index rebuild but no alert fired

Control:
  runtime grounding monitor tracks claim-support rate by source and release version
```

## L3X4. Incident Review Controls

### Purpose


Convert failures into taxonomy updates, evaluations, system controls, and product decisions.

### Core question


> Did the organization learn from the incident in a way that reduces recurrence?

### Boundary


Cross-Cutting Observability, Evaluation, and Governance Boundary.

### Addresses


- repeated incidents;
- taxonomy gaps;
- missing tests;
- missing controls;
- unclear ownership;
- unprioritized safety/product risk;
- regression recurrence.

### Typical controls


- incident template;
- root-cause review;
- Layer 2 fault tagging;
- Layer 3 system-fault tagging;
- severity classification;
- action items;
- regression-test creation;
- control remediation;
- taxonomy update;
- owner assignment;
- postmortem review.

### System locations


- incident management;
- evaluation repository;
- taxonomy docs;
- release process;
- product risk review;
- governance process.

### Evaluation methods


- incident replay;
- regression evaluation;
- targeted scenario creation;
- human review;
- adversarial tests.

### Observability requirements


- incident trace;
- user impact;
- model/system versions;
- fault tags;
- missing controls;
- remediation decision;
- new tests;
- follow-up owner;
- closure evidence.

### Common system faults


- incidents classified only as "model hallucination";
- no link from incident to regression test;
- no owner for remediation;
- same failure recurs;
- taxonomy not updated;
- logs insufficient for review.

### Common limitations


Incident review is retrospective. It must feed gates, controls, monitoring, and design changes to become preventive.

### Not this


Incident review is not a substitute for runtime controls. It improves the system after a failure.

### Example

```text
Layer 2:
  fabricated citation

Layer 3 system fault:
  no citation validator and no regression test for citation existence

Control:
  incident review adds citation-existence test and source-support gate before next release
```

## L3X5. Human Escalation Controls

### Purpose


Route uncertain, high-risk, unsupported, ambiguous, or policy-sensitive cases to a human decision-maker with the necessary evidence package.

### Core question


> Did the system know when and how to involve a human safely?

### Boundary


Cross-Cutting Observability, Evaluation, and Governance Boundary, with links to Policy and Action.

### Addresses


- unsafe action-readiness;
- high-confidence wrong answers;
- unsupported high-risk claims;
- policy ambiguity;
- competence-boundary failures;
- recovery failure;
- escalation failure;
- sensitive user interactions.

### Typical controls


- human review thresholds;
- expert review queues;
- approval gates;
- reviewer rubrics;
- evidence packages;
- decision records;
- override rules;
- escalation SLAs;
- fallback when reviewer unavailable;
- reviewer feedback loops.

### System locations


- policy layer;
- action authorization layer;
- UI flow;
- workflow engine;
- review platform;
- audit logs;
- monitoring.

### Evaluation methods


- human rubric evaluation;
- safety/policy evaluation;
- agent trace evaluation;
- semantic output evaluation;
- incident review.

### Observability requirements


- escalation trigger;
- case summary;
- evidence package;
- model output;
- policy status;
- tool/action trace;
- reviewer decision;
- override record;
- final user outcome.

### Common system faults


- human review invoked without evidence package;
- escalation criteria undefined;
- reviewers lack authority or instructions;
- no audit trail;
- human queue unavailable but system proceeds;
- human decisions not fed back into evals or controls.

### Common limitations


Human review does not scale indefinitely and can itself be inconsistent. It needs rubrics, training, audit, and monitoring.

### Not this


Human escalation is not a universal fix. Use it for cases where automated controls are insufficient, risk is high, or policy requires human judgment.

### Example

```text
Layer 2:
  action-readiness error

Layer 3 system fault:
  system allowed irreversible action without expert approval

Control:
  high-impact action routes to human reviewer with evidence, proposed action, and authorization status
```

## Mapping from old C1-C15 names


If older documents use the flat `C1-C15` control-family list, map them as follows.

| Old control | New home |
|---|---|
| C1 Context Construction Controls | L3B1 Context Assembly Controls |
| C2 Retrieval and Source Controls | L3B2 Retrieval Controls + L3B3 Source Authority and Freshness Controls |
| C3 State and Memory Controls | L3C1 State Persistence Controls + L3C2 Memory Rehydration Controls |
| C4 Prompt and Task-Contract Controls | L3A1 Task Contract Controls + L3A2 Instruction Hierarchy Controls + L3A3 Prompt Assembly Controls |
| C5 Control/Data Isolation Controls | L3A2 Instruction Hierarchy Controls + L3A3 Prompt Assembly Controls + L3B4 Evidence Packaging Controls + L3D1 Policy Boundary Controls |
| C6 Output Contract Controls | L3A4 Output Contract and Parser Controls + L3A5 Symbolic / Exactness Controls |
| C7 Grounding and Verification Controls | L3B5 Claim Grounding and Citation Controls + L3B6 Claim Verification Controls |
| C8 Calibration and Confidence Controls | L3B7 Confidence Communication Controls |
| C9 Reasoning and Process Controls | L3C3 Planning and Process Integrity Controls |
| C10 Tool and Action Controls | L3C4 Tool Selection Controls + L3C5 Tool Argument Controls + L3C6 Tool Output Interpretation Controls + L3C8 Action Authorization Controls |
| C11 Safety and Policy Controls | L3D1 Policy Boundary Controls + L3D2 Refusal and Escalation Controls |
| C12 Budget and Resource Controls | L3D6 Operating-Budget Controls |
| C13 Observability and Trace Controls | L3X1 Traceability Controls |
| C14 Evaluation and Regression Controls | L3X2 Evaluation Gate Controls + L3X3 Runtime Monitoring Controls + L3D7 Deployment and Version Controls |
| C15 Human Review and Escalation Controls | L3X5 Human Escalation Controls + L3D2 Refusal and Escalation Controls |

## Cross-boundary dependencies


Layer 3 controls rarely operate in isolation.

| Dependency | Reason |
|---|---|
| L3A1 Task Contract -> L3A4 Output Contract | The system must know the task before enforcing the right output shape. |
| L3A2 Instruction Hierarchy -> L3B4 Evidence Packaging | Evidence must be labeled so it is not treated as instruction. |
| L3B2 Retrieval -> L3B5 Claim Grounding | The system cannot ground claims in evidence it did not retrieve. |
| L3B3 Source Authority -> L3B5 Claim Grounding | Citation support is weaker if source authority is unknown. |
| L3B5 Claim Grounding -> L3B7 Confidence Communication | Confidence should reflect support and verification status. |
| L3C1 State Persistence -> L3C2 Memory Rehydration | Stored state must be reintroduced to affect current behavior. |
| L3C4 Tool Selection -> L3C5 Tool Argument | Choosing the right tool is separate from calling it correctly. |
| L3C5 Tool Argument -> L3C8 Action Authorization | Valid arguments may still be unauthorized or unsafe. |
| L3C6 Tool Output Interpretation -> L3B5 Claim Grounding | Tool results often become evidence for generated claims. |
| L3C7 Recovery and Retry -> L3X1 Traceability | Recovery decisions need trace evidence. |
| L3D1 Policy Boundary -> L3D2 Refusal/Escalation | Policy classification must lead to user-facing behavior. |
| L3D3 Competence Boundary -> L3D4 Routing/Fallback | Detected unreliability should route to a safer path. |
| L3D6 Operating Budget -> L3B1 Context Assembly | Budget decisions determine what evidence and state fit into context. |
| L3D7 Deployment/Version -> L3X2 Evaluation Gate | Changes need version-aware evaluation. |
| L3X1 Traceability -> L3X4 Incident Review | Incidents cannot be diagnosed without traces. |
| L3X5 Human Escalation -> L3X1 Traceability | Reviewers need evidence packages and audit trails. |

## Minimal control sets by system type


These are starting points, not exhaustive requirements.

### Basic chat assistant


Usually needs:

- L3A1 Task Contract Controls;
- L3A6 Interaction Contract Controls;
- L3B7 Confidence Communication Controls;
- L3D1 Policy Boundary Controls;
- L3D2 Refusal and Escalation Controls;
- L3D5 Stability Controls;
- L3X1 Traceability Controls;
- L3X2 Evaluation Gate Controls;
- L3X3 Runtime Monitoring Controls.

### RAG question-answering system


Usually needs:

- L3A1 Task Contract Controls;
- L3A2 Instruction Hierarchy Controls;
- L3A3 Prompt Assembly Controls;
- L3B1 Context Assembly Controls;
- L3B2 Retrieval Controls;
- L3B3 Source Authority and Freshness Controls;
- L3B4 Evidence Packaging Controls;
- L3B5 Claim Grounding and Citation Controls;
- L3B7 Confidence Communication Controls;
- L3D6 Operating-Budget Controls;
- L3X1 Traceability Controls;
- L3X2 Evaluation Gate Controls;
- L3X3 Runtime Monitoring Controls.

### Structured extraction system


Usually needs:

- L3A1 Task Contract Controls;
- L3A3 Prompt Assembly Controls;
- L3A4 Output Contract and Parser Controls;
- L3A5 Symbolic / Exactness Controls;
- L3B1 Context Assembly Controls;
- L3B5 Claim Grounding and Citation Controls, if extracted values must be sourced;
- L3D6 Operating-Budget Controls;
- L3X2 Evaluation Gate Controls;
- L3X3 Runtime Monitoring Controls.

### Customer-support classifier or escalation system


Usually needs:

- L3A1 Task Contract Controls;
- L3A6 Interaction Contract Controls;
- L3B1 Context Assembly Controls;
- L3B7 Confidence Communication Controls;
- L3D1 Policy Boundary Controls;
- L3D2 Refusal and Escalation Controls;
- L3D3 Competence Boundary Controls;
- L3D5 Stability Controls;
- L3X1 Traceability Controls;
- L3X2 Evaluation Gate Controls;
- L3X5 Human Escalation Controls.

### Agentic tool-using workflow


Usually needs:

- L3A1 Task Contract Controls;
- L3A2 Instruction Hierarchy Controls;
- L3A4 Output Contract and Parser Controls;
- L3C1 State Persistence Controls;
- L3C2 Memory Rehydration Controls;
- L3C3 Planning and Process Integrity Controls;
- L3C4 Tool Selection Controls;
- L3C5 Tool Argument Controls;
- L3C6 Tool Output Interpretation Controls;
- L3C7 Recovery and Retry Controls;
- L3C8 Action Authorization Controls;
- L3C9 Transaction and Rollback Controls;
- L3D1 Policy Boundary Controls;
- L3X1 Traceability Controls;
- L3X2 Evaluation Gate Controls;
- L3X5 Human Escalation Controls.

### High-risk decision-support system


Usually needs:

- L3A1 Task Contract Controls;
- L3A6 Interaction Contract Controls;
- L3B2 Retrieval Controls;
- L3B3 Source Authority and Freshness Controls;
- L3B5 Claim Grounding and Citation Controls;
- L3B6 Claim Verification Controls;
- L3B7 Confidence Communication Controls;
- L3D1 Policy Boundary Controls;
- L3D2 Refusal and Escalation Controls;
- L3D3 Competence Boundary Controls;
- L3D4 Routing and Fallback Controls;
- L3X1 Traceability Controls;
- L3X2 Evaluation Gate Controls;
- L3X3 Runtime Monitoring Controls;
- L3X5 Human Escalation Controls.

### External-action system


Usually needs:

- L3A1 Task Contract Controls;
- L3A2 Instruction Hierarchy Controls;
- L3A4 Output Contract and Parser Controls;
- L3C1 State Persistence Controls;
- L3C3 Planning and Process Integrity Controls;
- L3C4 Tool Selection Controls;
- L3C5 Tool Argument Controls;
- L3C6 Tool Output Interpretation Controls;
- L3C7 Recovery and Retry Controls;
- L3C8 Action Authorization Controls;
- L3C9 Transaction and Rollback Controls;
- L3D1 Policy Boundary Controls;
- L3D2 Refusal and Escalation Controls;
- L3X1 Traceability Controls;
- L3X5 Human Escalation Controls.

## Anti-patterns

### Treating a control as a guarantee


Bad:

```text
We added a schema, so format drift cannot happen.
```


Better:

```text
The schema detects or blocks some format drift.
The model can still produce invalid output; the system should reject, repair, retry, or escalate.
```

### Treating evaluation as control without operational effect


Bad:

```text
We evaluate grounding, so unsupported claims are handled.
```


Better:

```text
Grounding evaluation becomes a control only if it gates release, triggers retry, blocks output, routes to review, or creates remediation work.
```

### Treating missing controls as Layer 2 faults


Bad:

```text
No validator is a Layer 2 fault.
```


Better:

```text
Output-format drift is Layer 2.
No validator is Layer 3.
```

### Collapsing retrieval and grounding


Bad:

```text
The RAG system hallucinated.
```


Better:

```text
Separate the questions:
- Did retrieval fetch the right evidence?
- Did the model use the evidence faithfully?
- Did the system verify claim-source support?
```

### Treating human review as a generic fix


Bad:

```text
Send risky cases to humans.
```


Better:

```text
Define routing criteria, evidence package, reviewer rubric, authority, audit trail, and fallback behavior.
```

### Letting prompt text carry all controls


Bad:

```text
The prompt says not to hallucinate, not to reveal secrets, and to return JSON.
```


Better:

```text
Use prompt instructions plus retrieval controls, grounding checks, schema validation, policy gates, and traceable recovery paths.
```

### Treating logs as prevention


Bad:

```text
We logged the action, so it is controlled.
```


Better:

```text
Logs support audit and incident review. High-risk actions also need authorization, confirmation, transaction, and rollback controls.
```

### Ignoring operating-envelope failures


Bad:

```text
The model failed on long documents.
```


Better:

```text
Check context budget, truncation, chunking, retrieval depth, summarization loss, verification skipping, and latency/cost routing.
```

## Open questions


- Should `stack-31` contain detailed control-family records, or should each boundary later get its own file?
- Should runtime monitors be separated from release gates in a later document?
- Should human escalation be treated as a cross-cutting control, a policy control, or both?
- Should evaluation gates live in Layer 3 or in a separate evaluation/governance layer?
- Should source authority and freshness controls be split into two families if the taxonomy grows?
- Should tool-use controls be split by read-only tools, state-changing tools, and external-world actions?
- Should policy boundary controls be split by privacy, safety, compliance, and brand/product policy?
- Should operating-budget controls include explicit cost-quality policy thresholds?

## Summary


Layer 3 is the system-control layer.

Its canonical structure should be boundary-based:

```text
L3-A Interface and Contract Controls
L3-B Knowledge and Grounding Controls
L3-C State, Process, and Action Controls
L3-D Policy, Reliability, and Operating-Envelope Controls
L3-X Cross-Cutting Observability, Evaluation, and Governance Controls
```


This structure keeps Layer 3 architectural. It avoids a flat mitigation list and makes it easier to map:

```text
Layer 2 fault mode
  -> evaluation method
  -> Layer 3 control family
  -> architectural boundary
  -> Layer 4 impact
```
