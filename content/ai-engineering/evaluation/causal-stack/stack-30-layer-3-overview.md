---
draft: false
toc: true
title: "Stack 30 Layer 3 Overview"
linkTitle: "Stack 30 Layer 3 Overview"
---
# Layer 3 -- System Controls and System Faults

## Purpose


Layer 3 describes the system-level controls, design choices, runtime safeguards, monitoring mechanisms, and operational processes that shape whether Layer 2 behavioral fault modes are prevented, detected, bounded, recovered from, or allowed to reach users.

Layer 3 is the operational layer of the stack.

It answers:

> What did the surrounding AI system provide, validate, constrain, persist, verify, monitor, recover from, or fail to control?

Layer 3 does not replace Layer 2. Layer 2 names the recurring behavioral fault pattern. Layer 3 names the missing, weak, or successful system control around that behavior.

## Position in the causal stack

```text
Layer 1A — Base LLM architectural / inference mechanisms
  Tokenization, parametric prior, finite context, attention integration,
  in-band control/data representation, stateless invocation,
  autoregression, token scoring, decoding, compute scaling.

Layer 1B — Learned or behavioral LLM features
  Task induction, in-context demonstration conditioning,
  natural-language interface sensitivity, plural valid-output space,
  interaction-style priors, generated confidence language,
  distribution-conditional competence.

Layer 2 — Feature-derived fault modes
  Recurring behavioral failure patterns made possible by Layer 1A/1B.

Layer 3 — System controls and system faults
  Controls, architecture, orchestration, validation, observability,
  monitoring, recovery, and governance around Layer 2 faults.

Layer 4 — User, business, safety, compliance, and operational impact
  Consequences when faults reach users, workflows, institutions, or external systems.
```


Layer 3 sits between behavioral failure and realized impact.

```text
Layer 1A / 1B cause
  -> Layer 2 behavioral fault mode
  -> Layer 3 missing or inadequate control
  -> Layer 4 impact
```


Example:

```text
Layer 1A:
  A5 In-Band Control/Data Representation

Layer 1B:
  B1 Learned Natural-Language Task Induction

Layer 2:
  Control/data confusion

Layer 3 system fault:
  Retrieved untrusted text was inserted without isolation, quoting, sanitization,
  source authority labeling, or tool/action authorization checks.

Layer 4 impact:
  The system follows malicious instructions from a retrieved document.
```

## Definition


A **Layer 3 system control** is a system-level mechanism that prevents, detects, constrains, recovers from, monitors, or provides evidence about Layer 2 behavioral fault modes.

A **Layer 3 system fault** is a missing, weak, misconfigured, stale, untested, bypassed, or inadequate system control that allows a Layer 2 fault mode to manifest in a product, workflow, or operational setting.

A Layer 3 item should answer one or more of these questions:

- What context did the system supply?
- What retrieval or source-selection process was used?
- What state was persisted or rehydrated?
- What task contract or prompt structure was provided?
- How were instructions, examples, evidence, user input, tool outputs, and untrusted text separated?
- What output schema, validator, parser, or constrained decoder was used?
- How were claims grounded, cited, or verified?
- How were confidence, uncertainty, or abstention handled?
- How were plans, tool calls, and external actions controlled?
- What policy, safety, privacy, or authorization boundaries applied?
- What token, latency, cost, or compute budgets constrained behavior?
- What traces were captured?
- What monitoring, regression testing, or release gating existed?
- What fallback, retry, escalation, or human-review path existed?

## Core distinction

### Layer 2 fault mode


A Layer 2 fault mode is the recurring behavioral failure pattern.

Examples:

- context omission;
- context underutilization;
- task misinduction;
- control/data confusion;
- unsupported assertion;
- non-grounded justification;
- output-format drift;
- weak confidence calibration;
- tool-selection error;
- premature closure;
- recovery failure.

### Layer 3 system fault


A Layer 3 system fault is the missing or inadequate control that allowed the Layer 2 fault to matter.

Examples:

- no retrieval completeness check;
- no source authority ranking;
- no state rehydration;
- underspecified prompt contract;
- untrusted text inserted without isolation;
- no schema validator;
- no claim-source entailment check;
- no tool-argument validation;
- no action authorization gate;
- no trace capture;
- no regression suite;
- no fallback or escalation path.

### Layer 3 control


A Layer 3 control is the corresponding design or operational mechanism.

Examples:

- context assembly rules;
- retrieval filters and rerankers;
- source authority metadata;
- state persistence;
- task contracts;
- prompt templates;
- untrusted-text isolation;
- parsers and validators;
- constrained decoding;
- grounding checks;
- tool schemas;
- authorization gates;
- runtime monitors;
- eval suites;
- regression gates;
- human review workflows.

### Layer 4 impact


A Layer 4 impact is the consequence of the fault in the world.

Examples:

- user receives a false answer;
- customer is incorrectly escalated or not escalated;
- private data is exposed;
- unsafe action is taken;
- compliance obligation is missed;
- product reliability degrades;
- user over-trusts unsupported output;
- business workflow fails.

## Inclusion criteria


A candidate belongs in Layer 3 if it satisfies at least one of the following:

1. It is a system design element that shapes model inputs, outputs, actions, or monitoring.
2. It prevents, detects, constrains, recovers from, or provides evidence about Layer 2 faults.
3. It concerns retrieval, context construction, prompt assembly, state, tools, validation, authorization, observability, evaluation, monitoring, release gating, or human escalation.
4. It describes a missing or inadequate operational safeguard.
5. It can be changed without modifying the base model architecture or learned model parameters.
6. It can be implemented, tested, traced, configured, versioned, monitored, or audited at the system level.

## Exclusion criteria


A candidate does **not** belong in Layer 3 if it is primarily:

### A Layer 1 mechanism


Examples:

- tokenization;
- autoregressive factorization;
- distributional token scoring;
- decoding path selection;
- finite context window;
- in-band control/data representation;
- stateless invocation.

These are Layer 1A mechanisms.

### A Layer 1B learned feature


Examples:

- natural-language task induction;
- in-context demonstration conditioning;
- interaction-style priors;
- generated confidence language;
- distribution-conditional competence.

These are Layer 1B causal features.

### A Layer 2 behavioral fault


Examples:

- hallucination;
- task misinduction;
- weak calibration;
- output-format drift;
- prompt fragility;
- context underutilization;
- tool-selection error.

These are Layer 2 fault modes.

### A Layer 4 impact


Examples:

- financial loss;
- compliance violation;
- bad medical, legal, or financial advice reaching a user;
- user trust loss;
- brand damage;
- customer churn;
- operational outage.

These are downstream impacts.

### A pure evaluation metric with no control role


An offline score alone is not a Layer 3 control unless it is connected to a release gate, monitor, alert, retry, fallback, escalation, debugging workflow, or governance process.

## Layer 3 design principle: prevent, detect, recover, prove


Layer 3 controls can play four different roles.

### 1. Prevent


Preventive controls reduce the chance that a Layer 2 fault appears.

Examples:

- better task contract;
- retrieved-source filtering;
- prompt-injection isolation;
- schema-guided generation;
- tool-call type constraints;
- action authorization;
- context-window budgeting;
- state rehydration.

### 2. Detect


Detection controls identify likely faults before or after output.

Examples:

- parser validation;
- claim-source support checks;
- citation validation;
- tool-argument validation;
- policy classifiers;
- anomaly monitors;
- repeated-run variance tests;
- trace inspection.

### 3. Recover


Recovery controls define what the system does when a fault is detected or likely.

Examples:

- retry with corrected context;
- ask for clarification;
- retrieve additional evidence;
- abstain;
- route to a safer answer mode;
- escalate to a human;
- roll back an action;
- block tool execution;
- degrade gracefully.

### 4. Prove


Proof or governance controls provide evidence that the system behaves acceptably under defined conditions.

Examples:

- evaluation suites;
- regression gates;
- trace logs;
- audit records;
- scenario coverage reports;
- red-team results;
- model/prompt/retrieval version comparison;
- production monitoring dashboards.

A mature AI system usually needs all four roles.

```text
Prevention alone is insufficient.
Detection without recovery is incomplete.
Recovery without observability is hard to trust.
Proof without operational gates may not change behavior.
```

## Layer 3 object types


Layer 3 contains several related but distinct object types.

### System control


A concrete mechanism intended to prevent, detect, constrain, recover from, monitor, or prove behavior.

Example:

```text
Grounding gate:
  Block final answer unless each material claim is supported by approved evidence.
```

### System fault


A missing, weak, misconfigured, stale, or bypassed control.

Example:

```text
No grounding gate:
  The system allowed unsupported claims to reach the user.
```

### System condition


A runtime or environmental condition that changes risk.

Examples:

- long context;
- stale index;
- unavailable tool;
- changed API schema;
- high latency pressure;
- partial retrieval outage;
- degraded model endpoint;
- high-risk user request;
- ambiguous evidence.

### Control surface


The part of the system where a control applies.

Examples:

- input handling;
- retrieval;
- ranking;
- prompt assembly;
- model call;
- decoding;
- validation;
- post-processing;
- memory/state;
- tool execution;
- action authorization;
- observability;
- deployment pipeline;
- human review.

### Control outcome


The decision or state produced by a control.

Examples:

- pass;
- block;
- retry;
- ask clarification;
- retrieve more evidence;
- route to human;
- produce safer fallback;
- mark as uncertain;
- log for review;
- fail release gate.

## Core control families


Layer 3 controls can be organized into the following families.

| Code | Control family | Core question |
|---|---|---|
| **C1** | Context Construction Controls | Did the system supply the right runtime information? |
| **C2** | Retrieval and Source Controls | Did the system retrieve, rank, filter, attribute, and authorize evidence correctly? |
| **C3** | State and Memory Controls | Did the system preserve and rehydrate required continuity state? |
| **C4** | Prompt and Task-Contract Controls | Did the system specify the task, role, constraints, and success criteria clearly enough? |
| **C5** | Control/Data Isolation Controls | Did the system separate instructions, data, examples, evidence, tool outputs, and untrusted text? |
| **C6** | Output Contract Controls | Did the system enforce required format, schema, types, boundaries, and exact fields? |
| **C7** | Grounding and Verification Controls | Did the system verify claims, citations, calculations, and decisions against evidence or trusted tools? |
| **C8** | Calibration and Confidence Controls | Did the system prevent misleading confidence, unsupported certainty, or false self-verification? |
| **C9** | Reasoning and Process Controls | Did the system monitor plans, intermediate steps, invariants, and stopping behavior? |
| **C10** | Tool and Action Controls | Did the system constrain tool choice, tool arguments, recovery, and external actions? |
| **C11** | Safety and Policy Controls | Did the system enforce refusal, escalation, privacy, compliance, and authorization boundaries? |
| **C12** | Budget and Resource Controls | Did the system manage context, token, latency, cost, memory, and compute pressure? |
| **C13** | Observability and Trace Controls | Did the system capture enough evidence to debug, audit, and monitor behavior? |
| **C14** | Evaluation and Regression Controls | Did the system detect degradation across models, prompts, retrieval, tools, policies, and data? |
| **C15** | Human Review and Escalation Controls | Did the system route uncertain, risky, ambiguous, or high-impact cases to a safer path? |

These families are not mutually exclusive. A single production issue often requires controls from several families.

# C1 -- Context Construction Controls

## Purpose


Ensure that the model receives the runtime information required for correct behavior.

## Addresses


- context omission;
- context underutilization;
- stale-state reliance;
- missing task-specific facts;
- incomplete document QA;
- retrieval-conditioned answer failure;
- budget-induced context loss.

## Example controls


- context assembly rules;
- required-context checklists;
- source inclusion policies;
- context-window budget planning;
- query rewriting;
- chunk selection rules;
- prompt assembly tests;
- missing-evidence abstention rules;
- context completeness checks;
- explicit statement of evidence scope.

## Limitations


C1 can ensure that information is supplied. It cannot guarantee that the model will use the information correctly. That may require C2, C4, C7, C13, or C14.

# C2 -- Retrieval and Source Controls

## Purpose


Ensure that evidence is retrieved, ranked, filtered, attributed, and authorized appropriately.

## Addresses


- retrieval misses;
- irrelevant context;
- stale context;
- source-priority confusion;
- weak grounding;
- source infidelity;
- parametric-prior override;
- retrieval-conditioned answer failure.

## Example controls


- retrieval evaluation;
- chunking strategy;
- reranking;
- source freshness filters;
- source authority metadata;
- deduplication;
- query expansion;
- retrieval fallback;
- source-type allowlists;
- source provenance tracking;
- evidence coverage checks.

## Limitations


Retrieval quality is not the same as answer quality. A system can retrieve the right evidence and still generate an unsupported or misleading answer.

# C3 -- State and Memory Controls

## Purpose


Preserve required state across turns, sessions, tools, and workflow steps.

## Addresses


- continuity loss;
- stale-state reliance;
- repeated questions;
- lost approvals;
- inconsistent multi-turn decisions;
- agent workflow state loss;
- missing user preferences;
- missing project context.

## Example controls


- session state store;
- durable workflow state;
- memory rehydration;
- state freshness markers;
- versioned user preferences;
- task ledger;
- tool-output persistence;
- decision logs;
- approval/denial records;
- state conflict resolution.

## Limitations


Memory controls can also introduce risk if stale, private, irrelevant, or unauthorized state is reintroduced.

# C4 -- Prompt and Task-Contract Controls

## Purpose


Make the intended task, constraints, output requirements, role, and success criteria explicit enough for reliable execution.

## Addresses


- task misinduction;
- ambiguous task behavior;
- task blending;
- scope misinterpretation;
- constraint misclassification;
- example overgeneralization;
- prompt-form sensitivity;
- inconsistent tool routing;
- output-format drift.

## Example controls


- typed task contracts;
- structured task specifications;
- prompt templates;
- explicit success criteria;
- hard/soft constraint separation;
- examples with labels and boundaries;
- negative examples;
- explicit abstention conditions;
- system/developer instruction audits;
- prompt perturbation tests.

## Limitations


A better prompt is not the same as a hard contract. High-reliability systems usually need validators, schemas, tools, retrieval checks, or authorization controls in addition to prompts.

# C5 -- Control/Data Isolation Controls

## Purpose


Separate trusted instructions from untrusted data, examples, retrieved content, tool outputs, quoted text, and user-provided payloads.

## Addresses


- control/data confusion;
- prompt-injection compliance;
- source-authority confusion;
- treating examples as rules;
- treating tool output as instruction;
- following instructions embedded in retrieved documents.

## Example controls


- untrusted-text quoting;
- instruction stripping;
- source sandboxing;
- role separation;
- delimiter conventions;
- tool-output schemas;
- source authority labels;
- prompt-injection scanners;
- action restrictions for untrusted content;
- allowlists for executable instructions;
- separate planning from evidence ingestion.

## Limitations


Isolation reduces risk but does not create a native privilege boundary inside the model. High-risk actions still need external authorization and validation controls.

# C6 -- Output Contract Controls

## Purpose


Ensure that outputs satisfy required syntax, schema, type, boundary, and structural constraints.

## Addresses


- output-format drift;
- structured output drift;
- boundary/stopping error;
- exact-string corruption;
- numeric/symbolic fragility;
- malformed tool arguments;
- missing fields;
- extra commentary.

## Example controls


- JSON schema validation;
- XML validation;
- regex checks;
- enum constraints;
- type checking;
- exact-string validators;
- parser gates;
- constrained decoding;
- structured generation modes;
- retry-on-parse-failure;
- semantic field validation;
- post-processing with deterministic checks.

## Limitations


A syntactically valid output can still be semantically wrong. C6 should often be paired with C7 verification or C10 tool/action controls.

# C7 -- Grounding and Verification Controls

## Purpose


Verify claims, citations, calculations, extracted fields, decisions, and recommendations against trusted evidence or external tools.

## Addresses


- unsupported assertion;
- plausibility-truth gap;
- non-grounded justification;
- fabricated citation;
- evidence-claim mismatch;
- source infidelity;
- parametric-prior override;
- weak grounding.

## Example controls


- claim extraction;
- claim-source entailment checks;
- citation validators;
- quote-to-claim matching;
- source-required answer modes;
- tool-backed factual verification;
- calculator or symbolic checker;
- database lookup;
- abstention when evidence is absent;
- answer regeneration with evidence constraints;
- human verification for high-risk claims.

## Limitations


Grounding is not identical to truth. A claim can be supported by supplied evidence while the evidence itself is outdated or wrong. For external truth, trusted sources or tools are required.

# C8 -- Calibration and Confidence Controls

## Purpose


Prevent misleading confidence, unsupported certainty, false self-verification, or inappropriate uncertainty.

## Addresses


- weak confidence calibration;
- misleading confidence language;
- non-privileged self-evaluation;
- high-confidence wrong answers;
- over-hedging;
- inconsistent uncertainty;
- unsupported "I checked" claims.

## Example controls


- evidence-conditioned confidence language;
- confidence suppression unless measured;
- uncertainty templates;
- abstention rules;
- external verification before confidence claims;
- calibration evaluation;
- risk-based wording rules;
- self-check labeling as non-authoritative;
- confidence-to-escalation thresholds.

## Limitations


Generated confidence language is not a calibrated probability by default. Confidence controls should avoid presenting model self-assessment as independent verification.

# C9 -- Reasoning and Process Controls

## Purpose


Monitor or constrain multi-step reasoning, planning, invariant preservation, decomposition, and stopping behavior.

## Addresses


- local plausibility drift;
- path dependence;
- error accumulation;
- invariant loss;
- plan drift;
- spurious decomposition;
- premature closure;
- looping;
- skipped verification.

## Example controls


- explicit plan representation;
- step-level checklists;
- invariant checks;
- intermediate result validation;
- plan-review gates;
- state transition constraints;
- stopping criteria;
- loop detectors;
- decomposition templates;
- verifier model or deterministic checker;
- task-progress monitors.

## Limitations


Generated reasoning text is not guaranteed to reveal actual internal computation. Process controls should focus on externally inspectable artifacts, traces, decisions, and state transitions.

# C10 -- Tool and Action Controls

## Purpose


Control tool selection, tool arguments, tool-output interpretation, retry behavior, and external actions.

## Addresses


- wrong tool choice;
- wrong tool arguments;
- missing tool call;
- unnecessary tool call;
- tool-output misinterpretation;
- recovery failure;
- loop;
- premature stopping;
- unsafe or unjustified action.

## Example controls


- typed tool schemas;
- argument validators;
- tool routing policies;
- precondition checks;
- postcondition checks;
- tool-output parsers;
- retry policies;
- error handling;
- action dry-runs;
- idempotency checks;
- irreversible-action gates;
- confirmation prompts;
- allowlists and denylists;
- tool-call trace logging.

## Limitations


Tool access changes risk. A conversational error may become an operational failure when connected to tools or external actions.

# C11 -- Safety and Policy Controls

## Purpose


Enforce refusal, escalation, privacy, compliance, authorization, content, and domain-specific safety boundaries.

## Addresses


- under-refusal;
- over-refusal;
- prompt-injection compliance;
- unsafe action readiness;
- policy inconsistency;
- sensitive-data leakage;
- unauthorized recommendation;
- harmful or biased output;
- inappropriate high-stakes advice.

## Example controls


- policy classifiers;
- risk classifiers;
- domain gates;
- sensitive-data detection;
- privacy filters;
- refusal templates;
- escalation rules;
- authorization checks;
- high-stakes domain restrictions;
- audit logging;
- policy regression testing;
- adversarial safety tests;
- human review for high-risk cases.

## Limitations


Safety controls must distinguish model behavior from product policy. A model may be capable of producing something that the product should still block or escalate.

# C12 -- Budget and Resource Controls

## Purpose


Manage context, token, latency, cost, memory, and compute constraints so required behavior is not silently degraded.

## Addresses


- truncation-induced loss;
- compression-induced distortion;
- budget-induced incompleteness;
- long-context degradation;
- skipped verification;
- partial tool use;
- shallow reasoning;
- incomplete output.

## Example controls


- context-window budgeting;
- token budget reservation;
- long-document chunking strategy;
- hierarchical summarization with checks;
- latency-aware fallback modes;
- cost-aware routing;
- escalation when budget is insufficient;
- progressive retrieval;
- output length constraints;
- verification budget allocation;
- warning when evidence was omitted.

## Limitations


Budget controls often involve product tradeoffs. If cost or latency prevents verification, the system should represent the resulting uncertainty or escalate.

# C13 -- Observability and Trace Controls

## Purpose


Capture enough information to debug, audit, monitor, reproduce, and explain system behavior.

## Addresses


- poor observability;
- hidden regressions;
- unclear failure attribution;
- irreproducible failures;
- agent trace ambiguity;
- missing evidence package;
- weak monitoring;
- inability to distinguish retrieval failure from generation failure.

## Example controls


- prompt/version logging;
- model/version logging;
- retrieval trace capture;
- source IDs and chunk IDs;
- tool-call logs;
- tool-output logs;
- validation results;
- policy decisions;
- latency and cost metrics;
- user-visible answer metadata;
- failure labels;
- reviewer notes;
- reproducibility snapshots.

## Limitations


Observability does not itself fix behavior. It makes failures diagnosable and supports evaluation, monitoring, and governance.

# C14 -- Evaluation and Regression Controls

## Purpose


Detect behavioral degradation across changes in models, prompts, retrieval, tools, schemas, policies, data, or deployment configuration.

## Addresses


- hidden regressions;
- prompt regressions;
- model-version regressions;
- retrieval regressions;
- schema regressions;
- policy regressions;
- tool-use regressions;
- behavioral instability;
- distributional competence failures.

## Example controls


- scenario suites;
- repeated-run testing;
- prompt perturbation testing;
- grounding evaluation;
- schema validation tests;
- agent trace evaluation;
- calibration evaluation;
- safety adversarial tests;
- distributional slice tests;
- canary deployments;
- release gates;
- production monitors;
- regression dashboards.

## Limitations


Evaluation becomes a control only when connected to a decision: block release, trigger retry, alert an operator, route to review, or change system behavior.

# C15 -- Human Review and Escalation Controls

## Purpose


Route uncertain, ambiguous, risky, high-impact, or low-confidence cases to a human or safer process.

## Addresses


- high-risk unsupported claims;
- uncertain decisions;
- ambiguous policy cases;
- unsafe action readiness;
- low-confidence extraction;
- failed validation;
- failed retrieval;
- irreversible actions;
- user appeals;
- compliance-sensitive cases.

## Example controls


- escalation criteria;
- human review queue;
- expert approval;
- evidence package for reviewers;
- reviewer rubric;
- override logging;
- dual control for irreversible actions;
- user confirmation;
- abstention and handoff templates;
- case triage;
- review SLAs.

## Limitations


Human review is not a universal fallback. It requires clear routing criteria, sufficient evidence, trained reviewers, latency expectations, and auditability.

## System fault families


Layer 3 system faults can be classified by the type of missing or inadequate control.

| Code | System fault family | Description |
|---|---|---|
| **S1** | Missing control | No relevant control exists. |
| **S2** | Weak control | A control exists but is too weak, narrow, or informal. |
| **S3** | Misconfigured control | A control is configured incorrectly. |
| **S4** | Stale control | A control no longer matches current model, prompt, data, policy, or tool behavior. |
| **S5** | Bypassed control | A control exists but is skipped in some path. |
| **S6** | Unobserved control | A control runs but does not emit enough trace or decision evidence. |
| **S7** | Ungated evaluation | Evaluation exists but does not block release or trigger action. |
| **S8** | Incomplete recovery | Detection exists, but fallback, retry, escalation, or blocking behavior is missing. |
| **S9** | Boundary confusion | Responsibility between model behavior, system control, policy, and user impact is unclear. |
| **S10** | Environment drift | External data, APIs, schemas, policies, or usage patterns changed without control updates. |

Examples:

```text
Layer 2 fault:
  Unsupported assertion

Layer 3 system fault:
  S1 Missing control — no claim-source support check exists.
```

```text
Layer 2 fault:
  Invalid tool argument

Layer 3 system fault:
  S5 Bypassed control — argument validator runs in manual mode but not in agentic auto-run mode.
```

```text
Layer 2 fault:
  Prompt-form sensitivity

Layer 3 system fault:
  S7 Ungated evaluation — perturbation tests reveal instability, but release is not blocked.
```

## Control record template


Each Layer 3 control should be documented using a consistent record.

```text
Control code:
Control name:
Control family:
Control purpose:
Layer 2 faults addressed:
Control role:
  - prevention
  - detection
  - recovery
  - monitoring
  - proof / governance
System location:
  - input handling
  - retrieval
  - ranking
  - prompt assembly
  - model call
  - decoding
  - validation
  - post-processing
  - memory/state
  - tool execution
  - action authorization
  - observability
  - deployment pipeline
  - human review
Required inputs:
Expected output / decision:
Failure behavior:
Evaluation method:
Observability requirements:
Known limitations:
Not this:
```


Example:

```text
Control code:
  C7.2

Control name:
  Claim-source support check

Control family:
  C7 Grounding and Verification Controls

Control purpose:
  Prevent or detect generated factual claims that are not supported by approved evidence.

Layer 2 faults addressed:
  unsupported assertion;
  non-grounded justification;
  evidence-claim mismatch;
  fabricated citation;
  weak grounding.

Control role:
  detection; prevention if used as a gate; recovery if paired with retry/abstention.

System location:
  post-processing; validation; release gate; runtime monitor.

Required inputs:
  generated answer;
  extracted material claims;
  cited source spans;
  approved evidence set.

Expected output / decision:
  pass;
  fail;
  unsupported claim list;
  request retry;
  abstain;
  route to review.

Failure behavior:
  fail closed for high-risk domains;
  retry or ask for evidence in lower-risk domains.

Evaluation method:
  grounding and citation evaluation.

Observability requirements:
  claim list;
  source IDs;
  source spans;
  support decision;
  validator version;
  final disposition.

Known limitations:
  source support is not equivalent to real-world truth if the source is stale or wrong.

Not this:
  This is not a general factuality oracle unless connected to authoritative truth sources.
```

## System fault record template


Each Layer 3 system fault should also have a consistent record.

```text
System fault code:
System fault name:
Related control family:
Description:
Layer 2 faults allowed:
Observed symptom:
Control gap:
Expected control:
Detection method:
Recovery path:
Layer 4 impact risk:
Boundary notes:
```


Example:

```text
System fault code:
  S-C7-001

System fault name:
  Missing claim-source support gate

Related control family:
  C7 Grounding and Verification Controls

Description:
  The system allowed factual claims to be generated without checking whether they were supported by the retrieved or approved evidence.

Layer 2 faults allowed:
  unsupported assertion;
  non-grounded justification;
  fabricated citation;
  evidence-claim mismatch.

Observed symptom:
  The answer cites a source, but the cited span does not support the claim.

Control gap:
  No claim extraction or source-entailment check before final answer.

Expected control:
  Claim-source support gate with abstention or regeneration when support is missing.

Detection method:
  grounding and citation evaluation.

Recovery path:
  retrieve more evidence;
  regenerate answer constrained to cited spans;
  abstain;
  route to human review.

Layer 4 impact risk:
  user relies on unsupported claim.

Boundary notes:
  The Layer 2 fault is the unsupported claim. The Layer 3 fault is the missing verification gate.
```

## Layer 2 fault-family to Layer 3 control mapping


| Layer 2 fault family | Primary Layer 3 controls | Secondary controls |
|---|---|---|
| Context faults | C1 Context Construction, C2 Retrieval and Source, C3 State and Memory | C12 Budget, C13 Observability, C14 Evaluation |
| Generation faults | C6 Output Contract, C9 Reasoning and Process, C14 Evaluation and Regression | C11 Safety, C12 Budget, C15 Human Review |
| Epistemic faults | C7 Grounding and Verification, C2 Retrieval and Source, C8 Calibration | C13 Observability, C15 Human Review |
| Instruction/task faults | C4 Prompt and Task Contract, C5 Control/Data Isolation | C10 Tool and Action, C11 Safety, C14 Regression |
| Reasoning/planning faults | C9 Reasoning and Process, C10 Tool and Action | C13 Observability, C15 Human Review |
| Structure/representation faults | C6 Output Contract | C10 Tool and Action, C14 Regression |
| Budget/resource faults | C12 Budget and Resource | C1 Context Construction, C15 Escalation |
| Interaction/experience faults | C4 Prompt and Task Contract, C8 Calibration, C11 Safety and Policy | C14 Regression, C15 Human Review |
| Agent/action faults | C10 Tool and Action, C11 Safety and Policy | C9 Process, C13 Observability, C15 Human Review |
| Distributional competence faults | C14 Evaluation and Regression, C15 Human Review | C4 Task Contract, C7 Verification |

## Evaluation-method to Layer 3 control mapping


| Evaluation method | Controls it validates |
|---|---|
| Repeated-run testing | C14 Evaluation and Regression, C6 Output Contracts, C11 Safety and Policy |
| Prompt perturbation / paraphrase testing | C4 Prompt and Task Contract, C14 Evaluation and Regression |
| Context ablation / insertion testing | C1 Context Construction, C2 Retrieval and Source, C7 Grounding and Verification |
| Grounding and citation evaluation | C2 Retrieval and Source, C7 Grounding and Verification |
| Truth / factuality evaluation | C7 Grounding and Verification, C15 Human Review |
| Schema and parser validation | C6 Output Contract Controls |
| Reasoning / process evaluation | C9 Reasoning and Process, C10 Tool and Action |
| Agent trace evaluation | C10 Tool and Action, C13 Observability and Trace |
| Calibration evaluation | C8 Calibration and Confidence |
| Safety and policy adversarial testing | C11 Safety and Policy, C5 Control/Data Isolation, C10 Tool and Action |
| Stress / budget testing | C12 Budget and Resource, C1 Context Construction |
| Distributional slice testing | C14 Evaluation and Regression, C15 Human Review |
| Regression / diff testing | C14 Evaluation and Regression |
| Human-review / rubric evaluation | C15 Human Review and Escalation, C14 Evaluation and Regression |

Evaluation is part of Layer 3 only when it participates in design, debugging, monitoring, release gating, runtime decisions, escalation, or governance. A disconnected score is not sufficient.

## Worked examples

### Example 1 -- Unsupported answer in RAG

```text
Observed behavior:
  The assistant answers with a specific factual claim and cites a document,
  but the cited passage does not support the claim.

Layer 2 fault modes:
  unsupported assertion;
  non-grounded justification;
  evidence-claim mismatch;
  weak grounding.

Layer 3 system faults:
  no claim-source support check;
  no citation-span validation;
  retrieved evidence was not compared against generated claims;
  answer generation was allowed without support gating.

Layer 3 controls:
  C2 Retrieval and Source Controls;
  C7 Grounding and Verification Controls;
  C13 Observability and Trace Controls;
  C15 Human Review for high-risk claims.

Layer 4 impact:
  user relies on an unsupported answer.
```

### Example 2 -- Prompt injection from retrieved document

```text
Observed behavior:
  The model follows an instruction embedded inside a retrieved document.

Layer 2 fault modes:
  control/data confusion;
  prompt-injection compliance;
  source-authority confusion.

Layer 3 system faults:
  retrieved text was not isolated;
  no instruction stripping;
  no untrusted-source labeling;
  tool/action layer accepted model instruction from retrieved content.

Layer 3 controls:
  C5 Control/Data Isolation Controls;
  C10 Tool and Action Controls;
  C11 Safety and Policy Controls;
  C13 Observability and Trace Controls.

Layer 4 impact:
  system may leak data, take unauthorized action, or produce manipulated output.
```

### Example 3 -- Invalid structured output

```text
Observed behavior:
  The model returns malformed JSON with extra commentary.

Layer 2 fault modes:
  output-format drift;
  structured output drift;
  boundary/stopping error.

Layer 3 system faults:
  no parser gate;
  no schema validator;
  no retry-on-parse-failure;
  prompt relied on natural-language instruction alone.

Layer 3 controls:
  C6 Output Contract Controls;
  C4 Prompt and Task-Contract Controls;
  C14 Evaluation and Regression Controls.

Layer 4 impact:
  downstream parser fails or silently consumes wrong data.
```

### Example 4 -- Agent calls wrong tool

```text
Observed behavior:
  The agent uses a write/action tool when a read-only lookup was required.

Layer 2 fault modes:
  tool-selection error;
  action-readiness error;
  premature closure.

Layer 3 system faults:
  no tool routing policy;
  no precondition check;
  no action authorization gate;
  tool names or schemas were ambiguous;
  no dry-run mode.

Layer 3 controls:
  C10 Tool and Action Controls;
  C11 Safety and Policy Controls;
  C13 Observability and Trace Controls;
  C15 Human Review and Escalation Controls.

Layer 4 impact:
  unintended external action is taken.
```

### Example 5 -- Long-document summary drops a critical exception

```text
Observed behavior:
  The model summarizes a contract but omits an exception that changes the obligation.

Layer 2 fault modes:
  context underutilization;
  compression-induced distortion;
  local plausibility drift;
  incomplete answer.

Layer 3 system faults:
  no coverage check;
  no exception-preservation rule;
  no source-span checklist;
  context was too long for reliable processing;
  no human review for legal-risk output.

Layer 3 controls:
  C1 Context Construction Controls;
  C4 Prompt and Task-Contract Controls;
  C7 Grounding and Verification Controls;
  C12 Budget and Resource Controls;
  C15 Human Review and Escalation Controls.

Layer 4 impact:
  user misunderstands legal or business obligation.
```

### Example 6 -- High-confidence wrong answer

```text
Observed behavior:
  The model states a false answer with strong confidence.

Layer 2 fault modes:
  weak confidence calibration;
  plausibility-truth gap;
  unsupported assertion;
  non-privileged self-evaluation.

Layer 3 system faults:
  confidence language not conditioned on evidence;
  no external verification;
  no uncertainty template;
  no abstention rule;
  no calibration evaluation.

Layer 3 controls:
  C7 Grounding and Verification Controls;
  C8 Calibration and Confidence Controls;
  C14 Evaluation and Regression Controls;
  C15 Human Review for high-risk domains.

Layer 4 impact:
  user over-trusts a wrong answer.
```

### Example 7 -- Prompt edit causes escalation regression

```text
Observed behavior:
  After a prompt change, similar customer complaints are escalated inconsistently.

Layer 2 fault modes:
  prompt-form sensitivity;
  behavioral fragility;
  task misinduction;
  inconsistent interaction behavior.

Layer 3 system faults:
  no prompt perturbation regression suite;
  no escalation decision oracle;
  prompt change was not version-gated;
  no behavioral equivalence criteria.

Layer 3 controls:
  C4 Prompt and Task-Contract Controls;
  C14 Evaluation and Regression Controls;
  C13 Observability and Trace Controls.

Layer 4 impact:
  customers receive inconsistent support handling.
```

## Anti-patterns

### Treating controls as if they eliminate model fault modes


Bad:

```text
We added a schema, so output-format drift cannot happen.
```


Better:

```text
The schema detects or blocks some invalid outputs. The underlying fault mode can still appear and must be handled.
```

### Treating Layer 3 faults as Layer 2 faults


Bad:

```text
No validator is a model fault mode.
```


Better:

```text
Structured output drift is Layer 2.
No validator is Layer 3.
```

### Treating evaluation as control without a gate


Bad:

```text
We evaluate grounding, so unsupported claims are handled.
```


Better:

```text
Grounding evaluation becomes a control only if it blocks release, triggers retry, blocks output, alerts an operator, or routes to review.
```

### Treating retrieval failure and generation failure as the same thing


Bad:

```text
The RAG system hallucinated.
```


Better:

```text
Separate the questions:
- Did retrieval fetch the right evidence?
- Did prompt assembly include it?
- Did the model use it?
- Did verification check claim-source support?
```

### Treating human review as a universal fallback


Bad:

```text
Send risky cases to humans.
```


Better:

```text
Define routing criteria, evidence package, review rubric, reviewer authority, latency expectations, and audit requirements.
```

### Treating prompts as hard contracts


Bad:

```text
The prompt says to return JSON, so downstream code can trust it.
```


Better:

```text
Use a schema, parser, retry path, and fail-closed behavior for downstream integration.
```

### Treating observability as optional


Bad:

```text
The system failed, but we do not know which prompt, model, sources, tools, or validators were involved.
```


Better:

```text
Capture enough trace data to attribute failures across retrieval, prompt assembly, model output, validation, tools, and policy decisions.
```

## Relationship to later Layer 3 documents


This overview defines the Layer 3 boundary and control families. Later documents can specialize the material:

```text
stack-30-layer-3-overview.md
  Defines Layer 3, its boundary, object types, control families, and examples.

stack-31-layer-3-control-families.md
  Expands each C1-C15 family into detailed control records.

stack-32-layer-3-system-faults.md
  Catalogs missing, weak, stale, bypassed, or misconfigured controls.

stack-33-layer-3-observability-and-traces.md
  Defines trace requirements and debugging evidence.

stack-34-layer-3-evaluation-and-regression.md
  Defines release gates, regression suites, scenario coverage, and monitoring.

stack-35-layer-3-worked-examples.md
  Applies the Layer 1 -> Layer 2 -> Layer 3 -> Layer 4 stack to concrete cases.
```


The separate control-mapping document can then focus only on mappings:

```text
stack-26-layer-3-control-mapping.md
  Maps Layer 2 fault modes and evaluation methods to Layer 3 controls.
```

## Open questions


- Should Layer 3 controls use `C` codes, while system faults use `S` codes?
- Should system faults and controls live in separate documents?
- Should evaluation and regression controls remain inside Layer 3 or form a separate evaluation/control layer?
- Should human review be treated as a control, escalation path, governance mechanism, or all three?
- Should runtime monitors be separated from design-time controls?
- Should data drift, API drift, and policy drift be Layer 3 conditions or a separate environmental layer?
- Should controls be ranked by criticality, maturity, or implementation cost?
- Should each control require an explicit evaluation method and observability requirement?
- Should high-risk controls be required to fail closed by default?

## Summary


Layer 3 is the system-control layer.

It does not ask:

> Why can the model behave this way?

That is Layer 1.

It does not ask:

> What behavioral fault appeared?

That is Layer 2.

It does not ask:

> What harm or business consequence occurred?

That is Layer 4.

Layer 3 asks:

> What did the system do, or fail to do, to prevent, detect, constrain, recover from, monitor, or prove acceptable behavior around the fault?

A useful Layer 3 analysis should identify:

```text
Layer 2 fault mode
  -> missing or weak Layer 3 control
  -> expected Layer 3 control
  -> evaluation method
  -> observability requirement
  -> recovery or escalation path
  -> possible Layer 4 impact
```
