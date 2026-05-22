---
draft: false
toc: true
title: "Stack 24 Classification Views"
linkTitle: "Stack 24 Classification Views"
---
# Layer 2 -- Classification Views

## View 4 -- Evaluation-Method View

### Purpose


The **Evaluation-Method View** classifies Layer 2 fault modes by the kind of evaluation needed to detect, measure, reproduce, or compare them.

This view answers:

> What test, oracle, trace, comparison, or measurement would reveal this fault?

It is useful when designing:

- evaluation harnesses;
- regression suites;
- release gates;
- monitoring checks;
- red-team suites;
- product-quality reviews;
- incident-analysis workflows;
- Layer 2 to Layer 3 control mappings.

This view does **not** replace the fault inventory. It is a secondary view over the fault inventory.

A single Layer 2 fault can require several evaluation methods. A single evaluation method can detect several fault modes.

### Core distinction


Layer 2 fault mode:

> The recurring behavioral failure pattern.

Evaluation method:

> The procedure used to detect, measure, reproduce, or compare that behavioral failure pattern.

Example:

```text
Layer 2 fault:
  Prompt-form sensitivity

Evaluation method:
  Prompt perturbation / paraphrase testing

Evaluation question:
  Do semantically equivalent prompts preserve the intended behavior?
```


The same fault may need several methods:

```text
Fault:
  Weak grounding / source infidelity

Possible evaluation methods:
  - grounding and citation evaluation
  - context ablation / insertion testing
  - human-review rubric
  - regression / diff testing
```


The same method may detect several faults:

```text
Method:
  Repeated-run testing

Can detect:
  - output variance
  - tail-risk generation
  - unstable refusal behavior
  - unstable tool calls
  - unstable citation behavior
  - rare unsafe outputs
```

## Evaluation methods


| Code | Evaluation method | Core question |
|---|---|---|
| **EM1** | Repeated-run testing | Does the same scenario produce acceptably similar behavior across repeated runs? |
| **EM2** | Prompt perturbation / paraphrase testing | Does behavior remain stable under semantically equivalent prompt variation? |
| **EM3** | Context ablation / insertion testing | Does behavior change appropriately when relevant context is removed, added, reordered, buried, or diluted? |
| **EM4** | Grounding and citation evaluation | Are generated claims supported by the supplied or approved evidence? |
| **EM5** | Truth / factuality evaluation | Are generated claims true, regardless of whether support was supplied in the current context? |
| **EM6** | Schema and parser validation | Does the output satisfy required syntax, schema, boundary, type, and formatting constraints? |
| **EM7** | Reasoning / process evaluation | Does the generated reasoning or plan preserve constraints, intermediate correctness, and goal alignment? |
| **EM8** | Agent trace evaluation | Are tool choices, tool arguments, intermediate steps, recovery behavior, and actions correct? |
| **EM9** | Calibration evaluation | Does expressed confidence or uncertainty track correctness? |
| **EM10** | Safety and policy adversarial testing | Does the system preserve required safety, compliance, refusal, escalation, and authorization behavior? |
| **EM11** | Stress / budget testing | Does behavior degrade under long context, limited budget, latency pressure, truncation, or task complexity? |
| **EM12** | Distributional slice testing | Does performance hold across domains, languages, formats, edge cases, and rare task patterns? |
| **EM13** | Regression / diff testing | Did a model, prompt, retrieval, policy, schema, data, or tool change introduce new failures? |
| **EM14** | Human-review / rubric evaluation | Does the output satisfy task-specific quality criteria that cannot be fully captured by deterministic checks? |

# EM1. Repeated-run testing

## Purpose


Detect unacceptable behavioral variance across repeated executions of the same scenario.

This method is for evaluating whether behavior is stable enough under repeated runs, not whether text is identical.

## Evaluation question


> Does the same scenario produce acceptably similar behavior across repeated runs?

## Best suited for


- behavioral instability;
- true non-determinism / repeatability variance;
- output variance;
- tail-risk generation;
- unstable refusal or escalation behavior;
- unstable tool calls;
- unstable citations or evidence use;
- inconsistent confidence expression;
- rare catastrophic outputs.

## Typical setup


Run the same scenario multiple times while holding the following constant as much as possible:

- user-visible input;
- system instructions;
- developer instructions;
- model version;
- model parameters;
- retrieval corpus;
- retrieved context;
- tool availability;
- tool outputs, if replayable;
- runtime configuration;
- conversation state.

Then compare outputs at the level of **behavioral equivalence**, not exact text.

## Observable signals


- materially different final answers;
- different classifications;
- different escalation decisions;
- different risk levels;
- different tool calls;
- different tool arguments;
- different citations;
- different evidence used;
- different external actions;
- rare unsafe or invalid outputs;
- rare schema failure;
- rare hallucinated claim.

## Oracle type


**Behavioral-equivalence oracle.**

The oracle should define which differences are acceptable, material, and critical.

Examples:

```text
Acceptable:
  Different wording with same facts, decision, citations, and action.

Material:
  Different escalation decision.

Critical:
  Different irreversible external action.
```

## Important boundary


Repeated-run testing is not asking whether every token is identical.

It asks whether materially relevant behavior is preserved.

Exact-text equality is usually too strict for natural-language generation and too weak for behavioral safety.

Two outputs can be worded differently while preserving the same behavior. Two outputs can look similar while differing in a critical decision, citation, tool call, or action.

# EM2. Prompt perturbation / paraphrase testing

## Purpose


Detect behavioral fragility under reasonable input variation.

This method tests whether the model overreacts to semantically irrelevant changes in wording, ordering, formatting, framing, examples, or tone.

## Evaluation question


> Do semantically equivalent or operationally equivalent prompts preserve intended behavior?

## Best suited for


- prompt-form sensitivity;
- behavioral fragility;
- task misinduction;
- task blending;
- scope misinterpretation;
- constraint misclassification;
- example overgeneralization;
- example underuse;
- inconsistent refusal behavior;
- inconsistent escalation behavior;
- inconsistent tool use;
- brittle policy application.

## Typical setup


Create prompt variants that preserve the intended task but vary one or more of the following:

- wording;
- synonym choice;
- instruction order;
- formatting;
- headings;
- delimiters;
- directness;
- tone;
- examples;
- role framing;
- context placement;
- degree of verbosity;
- conversation preamble.

Example:

```text
Variant A:
  Summarize this issue and say if it should be escalated.

Variant B:
  Briefly summarize the customer problem and decide whether escalation is needed.
```


A robust system should preserve the materially relevant behavior if the operational task is the same.

## Observable signals


- changed decision;
- changed classification;
- changed risk level;
- changed task interpretation;
- changed output format;
- changed refusal behavior;
- changed escalation behavior;
- changed tool use;
- changed source use;
- changed action recommendation;
- changed level of caution without justification.

## Oracle type


**Behavioral-equivalence oracle.**

The oracle should define what must remain invariant across prompt variants.

For example:

```text
Must remain invariant:
  - escalation decision
  - severity classification
  - cited policy
  - required tool call

May vary:
  - wording
  - sentence order
  - minor formatting
```

## Important boundary


Prompt perturbation should vary irrelevant or reasonable surface form.

It should not silently change the actual task, policy, evidence, risk level, user intent, or required action.

If the prompt variant changes the underlying task, then changed behavior is not necessarily a fault.

# EM3. Context ablation / insertion testing

## Purpose


Detect whether the model uses runtime context appropriately.

This method evaluates whether behavior changes for the right reasons when evidence is removed, added, reordered, buried, diluted, contradicted, or made stale.

## Evaluation questions


> Does the model fail when required context is removed?

> Does the model improve when relevant context is added?

> Does irrelevant or misleading context distort the answer?

> Does the model prioritize the right source when context conflicts?

## Best suited for


- context omission;
- context underutilization;
- context priority confusion;
- continuity loss;
- stale-state reliance;
- distractor assimilation;
- source / authority confusion;
- parametric-prior override;
- retrieval-conditioned answer failure;
- weak grounding / source infidelity.

## Typical setup


Evaluate variants of the same scenario with controlled context changes:

- required evidence absent;
- required evidence present;
- evidence buried in the middle;
- evidence placed near the answer point;
- evidence split across chunks;
- conflicting evidence;
- irrelevant distractor chunks;
- stale context;
- low-authority source versus high-authority source;
- summarized context versus verbatim context;
- noisy retrieval set versus clean retrieval set.

## Observable signals


- ignores present evidence;
- answers from prior knowledge despite supplied evidence;
- follows irrelevant context;
- cites weak source over strong source;
- cites a document while missing the key span;
- changes answer for the wrong reason;
- fails to abstain when evidence is absent;
- fails to update when governing evidence is inserted;
- overweights stale context;
- mixes retrieved facts with unsupported assumptions.

## Oracle type


**Evidence-sensitivity oracle.**

The oracle should specify how the answer should change as evidence changes.

Examples:

```text
If governing policy is absent:
  The system should abstain or say evidence is insufficient.

If governing policy is present:
  The system should answer according to that policy.

If irrelevant distractor evidence is added:
  The material answer should not change.
```

## Important boundary


This method detects Layer 2 context-use behavior.

Whether the retriever failed to fetch the required context is a Layer 3 question.

Layer 2 asks:

```text
Did the model use, ignore, overuse, or misprioritize the context it received?
```


Layer 3 asks:

```text
Why did the system supply, omit, order, chunk, retrieve, or validate that context in that way?
```

# EM4. Grounding and citation evaluation

## Purpose


Detect whether generated claims are supported by supplied or approved evidence.

This method evaluates source fidelity, not general truth.

## Evaluation question


> Does each material claim trace to evidence that actually supports it?

## Best suited for


- unsupported assertion;
- non-grounded justification;
- fabricated citation or source;
- evidence-claim mismatch;
- source infidelity;
- weak grounding;
- retrieval-conditioned answer failure;
- parametric-prior override;
- answer unsupported by approved sources.

## Typical setup


Extract material claims from the output and compare them against:

- supplied documents;
- retrieved chunks;
- tool outputs;
- approved sources;
- cited passages;
- structured records;
- governing policy text;
- source metadata.

The evaluation should distinguish at least four cases:

```text
Supported:
  The cited or supplied evidence entails the claim.

Unsupported:
  The claim may be true, but the allowed evidence does not support it.

Contradicted:
  The allowed evidence conflicts with the claim.

Unverifiable:
  The allowed evidence is insufficient to determine support.
```

## Observable signals


- claim has no source;
- cited source does not contain the claim;
- cited source contradicts the claim;
- cited source supports a weaker claim;
- citation is invented;
- citation is malformed;
- explanation does not entail conclusion;
- retrieved fact is mixed with model assumption;
- answer uses background knowledge when task requires supplied-source grounding.

## Oracle type


**Evidence-entailment oracle.**

Possible implementations:

- human evidence review;
- expert review;
- claim extraction plus source matching;
- natural-language inference model;
- citation validator;
- deterministic lookup when source is structured;
- hybrid automated and human review.

## Important boundary


Grounding is not the same as truth.

A claim can be true but unsupported by the supplied evidence.

A claim can also be supported by a bad or outdated source but false in the world.

Grounding evaluation asks:

```text
Is the claim supported by the evidence the system was allowed to use?
```


Truth evaluation asks:

```text
Is the claim actually correct?
```

# EM5. Truth / factuality evaluation

## Purpose


Detect whether generated factual claims are true.

This method evaluates correspondence with reality or a trusted reference, regardless of whether support was supplied in the current context.

## Evaluation question


> Is the generated claim factually correct?

## Best suited for


- plausibility-truth gap;
- fluent false answer;
- common misconception reproduction;
- stale latent knowledge;
- approximate or outdated knowledge;
- entity confusion;
- false premise continuation;
- overgeneralization from familiar patterns;
- invented details;
- domain-specific factual failure.

## Typical setup


Compare claims against trusted references, such as:

- gold labels;
- authoritative databases;
- official sources;
- deterministic calculators;
- verified tools;
- expert review;
- current records;
- controlled answer keys;
- formal tests;
- task-specific adjudication.

## Observable signals


- false factual statement;
- outdated statement;
- incorrect date;
- incorrect number;
- incorrect name;
- incorrect entity relationship;
- invented detail;
- false premise accepted;
- plausible but wrong explanation;
- unsupported generalization presented as fact.

## Oracle type


**Truth oracle.**

Possible forms:

- reference answer;
- expert oracle;
- tool-backed oracle;
- database lookup;
- unit test;
- formal verifier;
- adjudicated label.

## Important boundary


Truth evaluation and grounding evaluation are separate.

Truth asks:

```text
Is this claim correct?
```


Grounding asks:

```text
Is this claim supported by the evidence the system was allowed to use?
```


Some tasks need both.

Example:

```text
The answer may be factually true,
but invalid for a RAG assistant if it is not supported by the retrieved documents.
```

# EM6. Schema and parser validation

## Purpose


Detect whether output satisfies required structural contracts.

This method is appropriate when the target property is formal, syntactic, typed, or exactly checkable.

## Evaluation question


> Does the output conform to the required syntax, schema, boundary, and type constraints?

## Best suited for


- output-format drift;
- structured output drift;
- boundary and stopping error;
- exact-string corruption;
- numeric or symbolic fragility;
- malformed tool arguments;
- field omission;
- enum mismatch;
- extra commentary;
- escaping errors;
- invalid serialization.

## Typical setup


Run deterministic validators over the output:

- JSON parser;
- XML parser;
- YAML parser;
- regex;
- schema validator;
- type checker;
- SQL parser;
- enum checker;
- exact-string checker;
- checksum;
- unit test;
- field-completeness check;
- tool-call payload validator;
- API contract validator.

## Observable signals


- invalid JSON;
- invalid XML;
- missing fields;
- wrong field names;
- wrong data types;
- invalid enum value;
- extra commentary;
- broken escaping;
- malformed identifiers;
- corrupted IDs;
- truncated output;
- duplicate fields;
- wrong nesting;
- invalid tool-call payload.

## Oracle type


**Deterministic parser or validator.**

This is often cheaper and more reliable than model-based or human review when the target property is formal.

## Important boundary


Schema validity is not semantic correctness.

An output can parse successfully while containing wrong values.

Example:

```json
{
  "escalate": false,
  "reason": "No urgency detected"
}
```


This may be valid JSON and still be wrong if the source ticket clearly requires escalation.

Use EM6 for structural validity. Use EM4, EM5, EM7, EM8, or EM14 for semantic correctness, process correctness, or product quality.

# EM7. Reasoning / process evaluation

## Purpose


Detect multi-step reasoning, planning, decomposition, or constraint-preservation failures.

This method evaluates the produced reasoning artifact, plan, intermediate steps, or process representation. It does not assume the model's visible reasoning is a faithful transcript of hidden cognition.

## Evaluation question


> Does the reasoning or plan preserve correctness, constraints, and goal alignment across steps?

## Best suited for


- local plausibility drift;
- path dependence;
- error accumulation;
- invariant loss;
- plan drift;
- spurious decomposition;
- premature closure;
- looping or repetition;
- false intermediate assumption;
- conclusion not supported by prior steps.

## Typical setup


Evaluate:

- intermediate claims;
- derived assumptions;
- plan checkpoints;
- constraint preservation;
- step ordering;
- dependencies between steps;
- whether the final answer follows from prior steps;
- whether the plan remains aligned with the original objective.

Possible evaluators:

- expert review;
- checklist-based rubric;
- invariant checker;
- formal verifier;
- test-case execution;
- theorem prover;
- code runner;
- arithmetic checker;
- simulation;
- state-transition checker.

## Observable signals


- early mistake propagates;
- hidden contradiction;
- invalid intermediate step;
- goal drift;
- dropped constraint;
- invented subtask;
- conclusion does not follow;
- plan no longer matches original objective;
- repeated step without progress;
- premature final answer;
- unsupported leap from evidence to conclusion.

## Oracle type


**Step-level oracle**, **invariant checker**, **expert rubric**, **formal checker**, or **task-specific process rubric**.

## Important boundary


Reasoning traces are not automatically reliable evidence of actual internal reasoning.

This method evaluates the produced process artifact or observable action trace, not hidden cognition.

For high-risk workflows, process evaluation should be paired with final-answer evaluation and, where relevant, agent trace evaluation.

# EM8. Agent trace evaluation

## Purpose


Detect failures in tool use, action selection, process control, state handling, and recovery.

This method is required when the system is not merely producing text, but also planning, calling tools, reading tool outputs, maintaining state, or taking actions.

## Evaluation question


> Did the agent choose the right steps, tools, arguments, checks, and actions?

## Best suited for


- wrong tool choice;
- missing tool call;
- unnecessary tool call;
- wrong tool arguments;
- malformed tool arguments;
- tool-output misinterpretation;
- skipped step;
- unnecessary step;
- loop;
- premature stopping;
- recovery failure;
- unsafe or unjustified action;
- action without sufficient evidence;
- state update error.

## Typical setup


Record and evaluate the full trace:

- user request;
- task state;
- plan;
- tool availability;
- selected tool;
- tool arguments;
- tool outputs;
- intermediate decisions;
- retries;
- error handling;
- state updates;
- final response;
- external actions;
- authorization events.

## Observable signals


- selected wrong tool;
- skipped required lookup;
- passed wrong argument;
- ignored tool error;
- retried without changing the failure condition;
- looped;
- stopped before completion;
- acted without sufficient evidence;
- executed irreversible action without authorization;
- misread tool output;
- overwrote correct state with incorrect state;
- produced correct final text after an unsafe or invalid process.

## Oracle type


**Trace oracle**, **process rubric**, **tool-call validator**, **state-transition checker**, or **action-safety oracle**.

## Important boundary


Agent trace evaluation is not only final-answer evaluation.

An agent can produce a good final message after a bad process.

An agent can also produce a bad final outcome after individually plausible steps.

For agentic systems, final answer, process trace, tool correctness, and action safety should be evaluated separately.

# EM9. Calibration evaluation

## Purpose


Detect whether expressed confidence, uncertainty, self-assessment, or abstention behavior tracks correctness.

This method treats confidence language as generated behavior, not as a native calibrated probability.

## Evaluation question


> Does the model's confidence, uncertainty, or self-assessment correspond to actual reliability?

## Best suited for


- weak confidence calibration;
- misleading confidence;
- non-privileged self-evaluation;
- high-confidence wrong answers;
- over-hedged correct answers;
- inconsistent uncertainty across runs;
- unsupported self-certainty;
- unreliable self-critique;
- false assurance after shallow checking.

## Typical setup


Collect outputs with one or more of the following:

- confidence language;
- uncertainty markers;
- abstention decisions;
- self-assessment statements;
- self-critique results;
- numeric confidence estimates;
- risk labels;
- escalation decisions.

Then compare them with correctness, grounding, policy, or task-success labels.

## Observable signals


- confident wrong answer;
- over-hedged correct answer;
- "I checked" without independent verification;
- self-critique fails to catch error;
- numeric confidence is not predictive;
- uncertainty varies across equivalent cases;
- confidence increases after unsupported reasoning;
- refusal or abstention does not correlate with actual uncertainty.

## Oracle type


**Empirical calibration curve**, **labeled correctness set**, **expert review**, or **confidence-vs-accuracy analysis**.

Possible metrics:

- expected calibration error;
- Brier score;
- accuracy by confidence bucket;
- abstention precision/recall;
- selective prediction curves;
- confidence/risk-label confusion matrix.

## Important boundary


Generated confidence language is behavior, not a calibrated reliability measure.

Self-evaluation is not independent verification.

If a task requires verification, use external checks, tools, evidence, labels, or human review rather than relying only on generated self-assessment.

# EM10. Safety and policy adversarial testing

## Purpose


Detect failures to preserve safety, compliance, refusal, escalation, authorization, privacy, and other behavioral boundaries under adversarial, ambiguous, or high-risk conditions.

## Evaluation question


> Does the system maintain required behavioral boundaries under adversarial, ambiguous, or high-risk conditions?

## Best suited for


- under-refusal;
- over-refusal;
- prompt-injection compliance;
- control/data confusion;
- unsafe action readiness;
- sycophantic agreement;
- policy inconsistency;
- unauthorized recommendation;
- sensitive-data leakage;
- harmful or biased output;
- failure to escalate;
- action without authorization;
- high-stakes advice beyond scope.

## Typical setup


Run scenarios that test boundaries:

- malicious instructions;
- ambiguous user intent;
- conflicting instructions;
- policy edge cases;
- sensitive data;
- high-stakes domains;
- irreversible actions;
- user pressure;
- role-play attempts;
- retrieved prompt injection;
- jailbreak-like phrasing;
- misleading context;
- social-engineering attempts;
- low-authority instructions embedded in data.

## Observable signals


- follows malicious embedded instruction;
- refuses allowed task;
- complies with disallowed task;
- gives high-stakes advice beyond scope;
- leaks private information;
- skips escalation;
- takes action without authorization;
- applies policy inconsistently;
- treats untrusted text as instruction;
- agrees with a harmful or false user premise;
- reveals implementation details or confidential context.

## Oracle type


**Policy oracle**, **safety rubric**, **authorization oracle**, **privacy oracle**, **expert review**, or **red-team scenario set**.

## Important boundary


Safety evaluation should distinguish model behavior from system controls.

Example:

```text
Layer 2 behavioral fault:
  The model follows an injected instruction in retrieved text.

Layer 3 system fault:
  The system failed to isolate, quote, neutralize, or sandbox untrusted retrieved text.
```


The same incident can involve both, but they should be recorded separately.

# EM11. Stress / budget testing

## Purpose


Detect behavior degradation under token, latency, compute, memory, context, or task-complexity pressure.

This method evaluates whether the system preserves required behavior as resource conditions become difficult.

## Evaluation question


> Does the system preserve required behavior when the task approaches practical resource limits?

## Best suited for


- truncation-induced loss;
- compression-induced distortion;
- budget-induced incompleteness;
- long-context degradation;
- shallow verification;
- skipped reasoning;
- partial plans;
- incomplete outputs;
- missing exceptions;
- over-compressed summaries;
- late-answer cutoff;
- context-window pressure.

## Typical setup


Evaluate scenarios with:

- long documents;
- long conversations;
- many retrieved chunks;
- dense retrieved context;
- large schemas;
- multi-step tasks;
- constrained latency;
- limited output budget;
- multiple tool calls;
- required verification passes;
- high branching factor;
- large state objects;
- repeated summarization or compression.

## Observable signals


- omitted exception;
- dropped constraint;
- incomplete answer;
- truncated output;
- shallow analysis;
- skipped verification;
- over-compressed summary;
- lost source distinction;
- premature final answer;
- missing tool call;
- missing final step;
- hallucination after context pressure;
- degradation only at long length.

## Oracle type


**Completeness rubric**, **coverage checker**, **source-comparison oracle**, **stress benchmark**, or **resource-sweep analysis**.

## Important boundary


Budget testing detects behavioral degradation.

The product decision to set a low token, latency, or cost budget belongs to Layer 3, product design, or operational policy.

Layer 2 asks:

```text
What behavioral fault appears under resource pressure?
```


Layer 3 asks:

```text
What resource, architecture, routing, compression, or fallback decision allowed it?
```

# EM12. Distributional slice testing

## Purpose


Detect uneven competence across domains, languages, formats, edge cases, user groups, source types, and task framings.

This method prevents aggregate scores from hiding sharp local failures.

## Evaluation question


> Does performance hold across the relevant slices of the product distribution?

## Best suited for


- uneven competence;
- distributional failure;
- distributional overgeneralization;
- rare-format brittleness;
- multilingual weakness;
- benchmark/product mismatch;
- domain-specific failures;
- symbolic-task failures;
- edge-case failure;
- low-resource-language failure;
- specialized-document failure.

## Typical setup


Define slices by variables relevant to the product:

- domain;
- language;
- script;
- document type;
- user type;
- task type;
- format;
- region;
- edge case;
- policy category;
- difficulty;
- source quality;
- evidence availability;
- tool availability;
- customer segment;
- rare entity type;
- temporal freshness;
- ambiguity level.

Measure performance per slice, not only in aggregate.

## Observable signals


- strong average performance but weak slice performance;
- failure on rare formats;
- failure in specific language or script;
- degradation on edge cases;
- overgeneralization from familiar pattern;
- confident answer outside competence region;
- policy inconsistency across similar groups;
- weak performance on real production distribution despite benchmark strength.

## Oracle type


**Slice-level benchmark**, **stratified labeled set**, **expert review**, or **production-slice audit**.

## Important boundary


Distributional slice testing should not only report aggregate scores.

The point is to reveal hidden capability cliffs.

A system can be acceptable on average and unacceptable on a critical slice.

# EM13. Regression / diff testing

## Purpose


Detect whether a change introduced new behavioral failures.

This method compares behavior across versions, configurations, prompts, retrieval setups, tools, schemas, policies, or datasets.

## Evaluation question


> Did this change improve, preserve, or degrade behavior across the relevant scenario set?

## Best suited for


- prompt regressions;
- model-version regressions;
- retrieval regressions;
- schema regressions;
- policy regressions;
- tool-use regressions;
- hidden behavioral drift;
- format drift after prompt edits;
- safety drift;
- grounding drift;
- latency/cost quality tradeoff regressions.

## Typical setup


Run the same scenario suite before and after a change.

Compare:

- final answers;
- decisions;
- classifications;
- citations;
- evidence used;
- tool calls;
- tool arguments;
- refusal behavior;
- escalation behavior;
- output-format validity;
- latency;
- cost;
- trace quality;
- safety outcomes;
- human rubric scores.

## Observable signals


- formerly passing scenario fails;
- improved narrow case but worsened adjacent cases;
- changed tool route;
- changed citation source;
- changed refusal decision;
- changed escalation decision;
- changed output schema;
- changed latency or cost profile;
- changed grounding behavior;
- new tail-risk failure;
- new slice-specific failure.

## Oracle type


**Behavioral diff**, **regression gate**, **scenario benchmark**, **human review**, or **pairwise comparison**.

## Important boundary


A diff is not automatically a regression.

The evaluator must classify whether the difference is:

```text
Acceptable:
  Surface variation without material behavior change.

Improvement:
  Better factuality, grounding, safety, usefulness, or efficiency.

Material regression:
  Worse decision, evidence use, schema validity, safety, or task success.

Critical regression:
  New unsafe, non-compliant, irreversible, or high-impact failure.
```


Regression testing should use task-specific behavioral equivalence criteria, not only text similarity.

# EM14. Human-review / rubric evaluation

## Purpose


Evaluate outputs where correctness is semantic, contextual, subjective, policy-sensitive, or task-specific rather than fully deterministic.

This method is needed when parser checks, truth labels, or simple matching are insufficient.

## Evaluation question


> Does the output satisfy the product's quality criteria for this task?

## Best suited for


- summarization quality;
- tone and product fit;
- usefulness;
- completeness;
- relevance;
- nuanced policy application;
- ambiguous task success;
- acceptable variation judgment;
- user-experience consistency;
- escalation judgment;
- explanation quality;
- answer helpfulness;
- product-specific quality.

## Typical setup


Use a structured rubric with explicit criteria.

Possible criteria:

- factuality;
- completeness;
- relevance;
- source fidelity;
- decision accuracy;
- tone;
- concision;
- policy compliance;
- action safety;
- downstream usefulness;
- clarity;
- user burden;
- appropriate uncertainty;
- appropriate refusal or escalation;
- consistency with product voice.

Rubric scales should be defined clearly.

Example:

```text
Completeness
1 — misses critical required information
2 — includes some relevant information but omits important details
3 — covers main points but misses minor details
4 — complete for practical use
5 — complete and well prioritized
```

## Observable signals


- missing key information;
- misleading emphasis;
- wrong tone;
- overlong answer;
- under-informative answer;
- technically correct but unhelpful answer;
- inconsistent review judgments;
- policy nuance missed;
- answer does not satisfy downstream user need;
- unclear or overcomplicated explanation.

## Oracle type


**Human rubric**, **expert rubric**, **pairwise preference**, **task-specific quality score**, or **reviewer adjudication**.

## Important boundary


Human review should not remain informal.

If reviewers disagree, the rubric may be underspecified.

A good human-review setup should define:

- criteria;
- scale anchors;
- examples;
- reviewer instructions;
- adjudication process;
- inter-rater agreement expectations;
- escalation path for ambiguous cases.

# Fault-family to evaluation-method mapping


This table maps broad Layer 2 fault families to likely evaluation methods.

| Fault family | Primary methods | Secondary methods |
|---|---|---|
| **FF1. Behavioral Instability** | EM1 Repeated-run testing; EM2 Prompt perturbation | EM13 Regression / diff testing; EM14 Human-review rubric |
| **FF2. Ambiguous or Misinduced Task Behavior** | EM2 Prompt perturbation; EM14 Human-review rubric | EM7 Reasoning / process evaluation; EM13 Regression / diff testing |
| **FF3. Hallucination and Unsupported Claims** | EM4 Grounding and citation evaluation; EM5 Truth / factuality evaluation | EM9 Calibration evaluation; EM14 Human-review rubric |
| **FF4. Weak Grounding / Source Infidelity** | EM4 Grounding and citation evaluation; EM3 Context ablation / insertion testing | EM13 Regression / diff testing; EM14 Human-review rubric |
| **FF5. Weak Calibration and Misleading Confidence** | EM9 Calibration evaluation | EM1 Repeated-run testing; EM5 Truth / factuality evaluation; EM14 Human-review rubric |
| **FF6. Output Format / Schema Drift** | EM6 Schema and parser validation | EM13 Regression / diff testing; EM11 Stress / budget testing |
| **FF7. Inconsistent Interaction Behavior** | EM14 Human-review rubric; EM1 Repeated-run testing | EM2 Prompt perturbation; EM13 Regression / diff testing |
| **FF8. Uneven Competence / Distributional Failure** | EM12 Distributional slice testing | EM5 Truth / factuality evaluation; EM14 Human-review rubric |
| **FF9. Agentic Process Failure** | EM8 Agent trace evaluation | EM10 Safety and policy adversarial testing; EM13 Regression / diff testing |
| **FF10. Retrieval-Conditioned Answer Failure** | EM3 Context ablation / insertion testing; EM4 Grounding and citation evaluation | EM11 Stress / budget testing; EM13 Regression / diff testing |

# Atomic fault to evaluation-method mapping


This table gives example mappings for common atomic faults. It is not exhaustive.

| Atomic fault | Primary methods | Notes |
|---|---|---|
| Context omission | EM3 Context ablation / insertion | Test absent versus present evidence. |
| Context underutilization | EM3 Context ablation / insertion | Insert evidence and check whether it affects behavior. |
| Context priority confusion | EM3 Context ablation / insertion | Use conflicting high- and low-authority sources. |
| Continuity loss | EM3 Context ablation / insertion; EM11 Stress / budget testing | Test multi-turn and cross-step state retention. |
| Prompt-form sensitivity | EM2 Prompt perturbation | Compare semantically equivalent prompts. |
| Task misinduction | EM2 Prompt perturbation; EM14 Human-review rubric | Check whether inferred task matches intended operation. |
| Constraint misclassification | EM2 Prompt perturbation; EM7 Reasoning / process evaluation | Check hard versus soft constraints, exceptions, and examples. |
| Control/data confusion | EM10 Safety and policy adversarial testing | Test untrusted text, quoted instructions, retrieved injection. |
| Output-format drift | EM6 Schema and parser validation | Use deterministic validators. |
| Boundary and stopping error | EM6 Schema and parser validation; EM11 Stress / budget testing | Detect extra commentary, truncation, premature stop. |
| Exact-string corruption | EM6 Schema and parser validation | Use exact-match, checksum, or identifier validation. |
| Numeric or symbolic fragility | EM6 Schema and parser validation; EM5 Truth / factuality evaluation | Use calculators, formal checks, unit tests. |
| Local plausibility drift | EM7 Reasoning / process evaluation | Check global task alignment over generated sequence. |
| Path dependence | EM7 Reasoning / process evaluation; EM2 Prompt perturbation | Test early assumption variation. |
| Error accumulation | EM7 Reasoning / process evaluation | Evaluate intermediate steps. |
| Unsupported assertion | EM4 Grounding and citation evaluation | Claim must be supported by approved evidence. |
| Plausibility-truth gap | EM5 Truth / factuality evaluation | Claim may sound plausible but be false. |
| Non-grounded justification | EM4 Grounding and citation evaluation | Explanation must actually support conclusion. |
| Fabricated citation or source | EM4 Grounding and citation evaluation | Validate source existence and support. |
| Evidence-claim mismatch | EM4 Grounding and citation evaluation | Source exists but does not support claim. |
| Weak confidence calibration | EM9 Calibration evaluation | Compare confidence to correctness. |
| Non-privileged self-evaluation | EM9 Calibration evaluation; EM5 Truth / factuality evaluation | Self-check is not independent verification. |
| Over-refusal | EM10 Safety and policy adversarial testing; EM14 Human-review rubric | Test allowed requests near policy boundary. |
| Under-refusal | EM10 Safety and policy adversarial testing | Test disallowed or high-risk requests. |
| Clarification failure | EM14 Human-review rubric; EM2 Prompt perturbation | Check when clarification is necessary versus unnecessary. |
| Tone/persona inconsistency | EM14 Human-review rubric; EM1 Repeated-run testing | Product voice is usually rubric-based. |
| Competence cliff | EM12 Distributional slice testing | Test by domain, format, language, edge case. |
| Output variance | EM1 Repeated-run testing | Compare behavioral equivalence across runs. |
| Tail-risk generation | EM1 Repeated-run testing; EM10 Safety testing | Requires repeated trials and adversarial scenarios. |
| Truncation-induced loss | EM11 Stress / budget testing | Increase context or output length pressure. |
| Compression-induced distortion | EM11 Stress / budget testing; EM4 Grounding evaluation | Compare compressed state to source. |
| Tool-selection error | EM8 Agent trace evaluation | Check tool choice against task state. |
| Tool-argument error | EM8 Agent trace evaluation; EM6 Schema validation | Validate argument syntax and semantics. |
| Tool-output misinterpretation | EM8 Agent trace evaluation; EM4 Grounding evaluation | Compare model interpretation to tool output. |
| Action-readiness error | EM8 Agent trace evaluation; EM10 Safety testing | Check evidence, authorization, and reversibility. |
| Recovery failure | EM8 Agent trace evaluation | Test tool errors, missing data, and retry behavior. |

# Evaluation-method selection guide


Use this guide when choosing which method to apply first.

## If the failure varies across runs


Start with:

```text
EM1 Repeated-run testing
```


Then add:

```text
EM13 Regression / diff testing
EM10 Safety and policy adversarial testing, if high-risk
```

## If the failure appears after small wording changes


Start with:

```text
EM2 Prompt perturbation / paraphrase testing
```


Then add:

```text
EM14 Human-review / rubric evaluation
EM13 Regression / diff testing
```

## If the failure concerns evidence use


Start with:

```text
EM3 Context ablation / insertion testing
EM4 Grounding and citation evaluation
```


Then add:

```text
EM5 Truth / factuality evaluation
EM13 Regression / diff testing
```

## If the failure concerns factual correctness


Start with:

```text
EM5 Truth / factuality evaluation
```


Then add:

```text
EM4 Grounding and citation evaluation, if evidence-based answer is required
EM9 Calibration evaluation, if confidence is relevant
```

## If the failure concerns output structure


Start with:

```text
EM6 Schema and parser validation
```


Then add:

```text
EM14 Human-review / rubric evaluation, if semantic field correctness matters
EM13 Regression / diff testing
```

## If the failure concerns a multi-step plan


Start with:

```text
EM7 Reasoning / process evaluation
```


Then add:

```text
EM8 Agent trace evaluation, if tools or actions are involved
EM11 Stress / budget testing, if complexity is high
```

## If the failure concerns tool use or external action


Start with:

```text
EM8 Agent trace evaluation
```


Then add:

```text
EM10 Safety and policy adversarial testing
EM6 Schema and parser validation
```

## If the failure concerns unsafe, non-compliant, or unauthorized behavior


Start with:

```text
EM10 Safety and policy adversarial testing
```


Then add:

```text
EM8 Agent trace evaluation, if tools/actions are involved
EM1 Repeated-run testing, if rare failures matter
EM13 Regression / diff testing, if release gating is needed
```

## If the failure appears only on certain domains, languages, or formats


Start with:

```text
EM12 Distributional slice testing
```


Then add:

```text
EM5 Truth / factuality evaluation
EM14 Human-review / rubric evaluation
```

## If the failure appears after a model, prompt, data, policy, or tool change


Start with:

```text
EM13 Regression / diff testing
```


Then add whichever method corresponds to the observed regression:

```text
EM4 for grounding regressions
EM6 for schema regressions
EM8 for tool-use regressions
EM10 for safety regressions
EM12 for slice regressions
```

# Design rules for the Evaluation-Method View

## 1. Evaluate behavior, not surface text by default


For generative tasks, exact text equality is usually too strict.

The default unit should be intended behavior:

- facts;
- decision;
- risk level;
- evidence;
- citations;
- tool use;
- external action;
- refusal or escalation behavior;
- format validity;
- user-facing commitment.

## 2. Separate truth from grounding


Truth evaluation asks:

```text
Is the claim correct?
```


Grounding evaluation asks:

```text
Is the claim supported by the evidence the system was allowed to use?
```


Both may be necessary, but they are not the same.

## 3. Separate final-answer evaluation from process evaluation


Some tasks can be judged from final output alone.

Agentic and high-risk workflows usually require trace-level evaluation.

Final-answer success does not prove process correctness.

## 4. Use deterministic validators where possible


Schemas, parsers, type checks, enum checks, exact-string validators, and formal tests are cheaper and more reliable than rubric evaluation when the target property is formal.

Use human review where semantic judgment is required, not where deterministic validation would suffice.

## 5. Use human or expert rubrics where necessary


Some properties require semantic judgment, especially:

- usefulness;
- policy nuance;
- tone;
- completeness;
- acceptable variation;
- downstream value;
- explanation quality;
- appropriate refusal or escalation.

Rubrics should be explicit enough that reviewers can apply them consistently.

## 6. Evaluate rare failures explicitly


Small test samples can miss tail-risk behavior.

Repeated-run testing, adversarial testing, and stress testing should be used when rare failures are severe enough to matter.

## 7. Do not confuse evaluation methods with system controls


An evaluation can reveal a fault.

It does not itself prevent the fault unless it is connected to a gate, monitor, retry, validator, fallback, authorization check, or other Layer 3 control.

Example:

```text
EM6 Schema validation as evaluation:
  Detects invalid JSON in test outputs.

Layer 3 validator as control:
  Rejects invalid JSON at runtime and triggers retry or fallback.
```

## 8. Prefer task-specific behavioral equivalence criteria


Many LLM outputs have multiple acceptable forms.

Define what must be preserved for the task:

- classification;
- decision;
- evidence;
- action;
- risk level;
- policy behavior;
- structured fields;
- required omissions;
- required uncertainty.

Do not rely only on text similarity.

## 9. Classify evaluation failures at the right layer


An observed bad result may involve multiple layers:

```text
Layer 1A / 1B:
  Mechanisms and learned features that make the behavior possible.

Layer 2:
  Behavioral fault mode detected by the evaluation.

Layer 3:
  Missing or inadequate system control.

Layer 4:
  User, business, safety, compliance, or operational impact.
```


The evaluation method detects evidence of the fault; it is not the fault itself.

# Anti-patterns

## Anti-pattern 1: Treating exact-match failure as behavioral failure


Bad classification:

```text
The wording changed, so the model failed.
```


Better classification:

```text
The wording changed, but the answer preserved the same facts, decision,
evidence, and action. This is acceptable variation.
```


Exact match is appropriate for strict strings, IDs, schemas, code, or serialized data. It is usually not appropriate for open-ended natural-language answers.

## Anti-pattern 2: Treating a passing demo as reliability evidence


Bad classification:

```text
The scenario passed once, so the system is reliable.
```


Better classification:

```text
Run repeated trials and measure behavioral equivalence across runs.
```


One successful run only proves that the system worked once.

## Anti-pattern 3: Collapsing grounding into truth


Bad classification:

```text
The answer is true, so grounding passed.
```


Better classification:

```text
The answer may be true, but grounding passes only if the allowed evidence supports it.
```

## Anti-pattern 4: Collapsing process evaluation into final-answer evaluation


Bad classification:

```text
The final answer was acceptable, so the agent succeeded.
```


Better classification:

```text
For agentic workflows, evaluate tool choice, arguments, intermediate steps,
state handling, recovery behavior, and action safety.
```

## Anti-pattern 5: Using human review where deterministic validation is available


Bad classification:

```text
Ask a reviewer whether the JSON is valid.
```


Better classification:

```text
Use a parser and schema validator.
Ask humans to review semantic quality if needed.
```

## Anti-pattern 6: Treating evaluation as mitigation


Bad classification:

```text
We have an evaluation for hallucination, so hallucination is controlled.
```


Better classification:

```text
The evaluation detects hallucination.
Runtime mitigation requires Layer 3 controls such as grounding requirements,
citation validation, abstention rules, retrieval repair, or human review.
```

## Anti-pattern 7: Using only aggregate scores


Bad classification:

```text
The system has 90% accuracy, so it is good enough.
```


Better classification:

```text
Check distributional slices. A critical slice may fail even when aggregate performance is high.
```

# Recommended metadata fields


Each evaluation method record should support the following metadata when used in an evaluation harness:

```yaml
evaluation_method_code: EM4
evaluation_method_name: Grounding and citation evaluation
layer_2_faults_detected:
  - unsupported_assertion
  - fabricated_citation
  - evidence_claim_mismatch
scenario_id: string
input_variant_id: string
model_version: string
prompt_version: string
retrieval_version: string
tool_versions: []
source_corpus_version: string
runtime_config: {}
expected_behavior: string
oracle_type: evidence_entailment
pass_fail: pass | fail | inconclusive
severity: cosmetic | minor | material | safety_relevant | compliance_relevant | irreversible_action
observed_signal: string
evidence: []
trace_link: string
reviewer: string
review_notes: string
linked_layer_3_controls: []
```


This metadata keeps evaluation findings connected to the Layer 2 fault inventory and the Layer 3 control mapping.

# Minimal harness fields by method


| Method | Required minimum fields |
|---|---|
| EM1 Repeated-run testing | scenario ID, run ID, seed/config if available, behavioral equivalence criteria, outcome comparison |
| EM2 Prompt perturbation | base prompt, prompt variant, invariant behavior criteria, outcome comparison |
| EM3 Context ablation / insertion | context variant, expected evidence sensitivity, answer comparison |
| EM4 Grounding and citation | claim, cited/source evidence, support label, evidence span |
| EM5 Truth / factuality | claim, trusted reference, truth label |
| EM6 Schema/parser | output, schema/parser version, validation result, error message |
| EM7 Reasoning/process | step trace, expected invariant, process label |
| EM8 Agent trace | tool calls, arguments, outputs, state transitions, action labels |
| EM9 Calibration | confidence expression/value, correctness label, calibration bucket |
| EM10 Safety/policy | policy scenario, allowed/disallowed behavior, observed behavior, severity |
| EM11 Stress/budget | resource condition, limit tested, expected preservation behavior, degradation label |
| EM12 Distributional slice | slice label, scenario set, per-slice metric, comparison to aggregate |
| EM13 Regression/diff | baseline version, candidate version, diff type, regression label |
| EM14 Human rubric | rubric version, reviewer ID, criterion scores, adjudication if needed |

# Relationship to other Layer 2 documents


This document should be used with:

```text
stack-21-fault-inventory.md
  Defines atomic Layer 2 fault modes.

stack-23-fault-family-index.md
  Defines broad FF1-FF10 family groupings.

stack-25-evaluation-mapping.md
  Can expand this view into a full harness design.

stack-26-layer-3-control-mapping.md
  Maps detected Layer 2 faults to system controls.
```


`stack-24-classification-views.md` should not duplicate full fault definitions. It should define classification views and show how to use them.

# Short formulation


The Evaluation-Method View classifies Layer 2 faults by detection strategy.

```text
Layer 2 fault:
  What behavioral failure pattern occurred?

Evaluation method:
  How do we detect, measure, reproduce, or compare it?

Layer 3 control:
  What system design prevents, constrains, recovers from, or monitors it?
```


The central rule is:

> Evaluation methods are views over fault modes, not fault modes themselves.
