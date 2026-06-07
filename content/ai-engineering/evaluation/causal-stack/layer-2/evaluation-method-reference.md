---
draft: false
toc: true
title: "Evaluation Method Reference"
linkTitle: "Evaluation Method Reference"
---
## Purpose


The Evaluation-Method View classifies Layer 2 fault modes by the evaluation methods needed to detect, measure, compare, or gate them.

It answers:

> What test, oracle, trace, comparison, or measurement would reveal this fault?

This document is a standalone companion to the Layer 2 fault-mode inventory. It does not define the fault modes themselves. It defines ways to evaluate them.

Layer 2 fault modes are recurring behavioral failure patterns. Evaluation methods are procedures for making those failures observable.

```text
Layer 0:
  interface substrate and irreducible communication conditions

Layer 1A / 1B / 1C:
  causal mechanisms, learned behavioral features, and AI-system-level properties

Layer 2:
  recurring behavioral fault modes

Evaluation-method view:
  ways to detect or measure Layer 2 fault modes

Layer 3:
  system controls, instrumentation, validators, retrieval, monitoring, gates, and recovery paths
```

## Core distinction


A fault mode is the behavior that goes wrong.

An evaluation method is the procedure used to reveal that behavior.

Example:

```text
Layer 2 fault mode:
  Prompt-form sensitivity

Evaluation method:
  Prompt perturbation / paraphrase testing

Evaluation question:
  Do semantically equivalent prompts preserve the intended behavior?
```


Another example:

```text
Layer 2 fault mode:
  Unsupported assertion

Evaluation method:
  Grounding and citation evaluation

Evaluation question:
  Does each material claim trace to evidence that actually supports it?
```


Evaluation methods are not mutually exclusive. A single fault mode may need several evaluation methods. A single evaluation method may detect several fault modes.

## How to use this document


Use this view when:

- designing an evaluation harness;
- deciding which tests should cover a fault family;
- building a release gate;
- deciding which signals to capture in traces;
- comparing prompts, models, retrieval strategies, tools, policies, or schemas;
- translating observed incidents into reusable test scenarios;
- deciding whether a change caused a regression;
- deciding whether a failure should be measured by deterministic checks, statistical tests, human rubrics, or expert review.

Do not use this view to replace the fault inventory. The inventory names the behavioral failure. This document names ways to observe it.

## Evaluation objects


Evaluation methods operate over different objects. Naming the object helps avoid confusion.

| Object | Definition | Examples |
|---|---|---|
| **Scenario** | A test case representing a task situation. | Customer escalation request, legal clause summary, RAG question. |
| **Run** | One execution of a scenario. | One model response, one agent trace. |
| **Variant** | A controlled change to a scenario. | Paraphrased prompt, reordered context, changed evidence. |
| **Output** | The final response or returned object. | Answer text, JSON payload, classification, tool-call result. |
| **Trace** | Intermediate process record. | Prompt, retrieved chunks, tool calls, arguments, observations, retries. |
| **Claim** | A material factual assertion in an output. | Date, policy statement, medical/legal claim, entity relation. |
| **Decision** | A discrete outcome that matters. | Escalate/not escalate, approve/reject, refuse/comply. |
| **Action** | A tool call or external-world operation. | Send email, issue refund, update ticket, delete record. |
| **Evidence set** | Documents, chunks, tool results, or records the system is allowed to use. | Retrieved passages, database rows, API output. |
| **Oracle** | The reference used to judge correctness. | Parser, gold label, expert reviewer, policy, evidence entailment check. |

## Behavioral equivalence


For generative systems, exact text equality is usually not the right default.

Two outputs can be worded differently while preserving the same intended behavior. Conversely, two outputs can look similar while differing in a material decision, citation, risk label, tool call, or external action.

Behavioral equivalence should be defined per task.

Examples of usually acceptable variation:

- different wording;
- different sentence order;
- equivalent formatting;
- equivalent paraphrase;
- equivalent explanation;
- equivalent citation set, when the same claim is supported.

Examples of material variation:

- different classification;
- different final answer;
- different escalation decision;
- different risk level;
- different refusal or compliance behavior;
- different tool call;
- different tool arguments;
- different citation supporting a different claim;
- different external action;
- changed legal, medical, financial, or policy meaning.

The evaluation method should state whether it compares exact output, semantic equivalence, task outcome, evidence support, trace behavior, or external action.

# Evaluation method reference


| Code | Evaluation method | Primary question | Typical oracle |
|---|---|---|---|
| **EM1** | Repeated-run testing | Does the same scenario preserve acceptable behavior across repeated runs? | Behavioral-equivalence oracle |
| **EM2** | Prompt perturbation / paraphrase testing | Does behavior remain stable under semantically equivalent prompt variation? | Behavioral-equivalence oracle |
| **EM3** | Context ablation / insertion testing | Does behavior change appropriately when context is removed, added, reordered, or diluted? | Evidence-sensitivity oracle |
| **EM4** | Grounding and citation evaluation | Are generated claims supported by supplied or approved evidence? | Evidence-entailment oracle |
| **EM5** | Truth / factuality evaluation | Are generated factual claims true? | Reference, expert, or tool-backed oracle |
| **EM6** | Schema and parser validation | Does the output satisfy syntax, schema, boundary, and type constraints? | Deterministic validator |
| **EM7** | Reasoning / process evaluation | Does the reasoning or plan preserve constraints, intermediate correctness, and goal alignment? | Step-level oracle or rubric |
| **EM8** | Agent trace evaluation | Are tool choices, tool arguments, intermediate steps, recovery behavior, and actions correct? | Trace oracle or action-safety oracle |
| **EM9** | Calibration evaluation | Does expressed confidence or uncertainty track correctness? | Labeled correctness set and calibration metrics |
| **EM10** | Safety and policy adversarial testing | Does behavior preserve required safety, compliance, refusal, escalation, and authorization boundaries? | Policy, safety, or authorization oracle |
| **EM11** | Stress / budget testing | Does behavior degrade under long context, task complexity, latency, cost, or output-budget pressure? | Coverage, completeness, and stress oracle |
| **EM12** | Distributional slice testing | Does performance hold across relevant domains, languages, formats, user groups, and edge cases? | Stratified benchmark or expert review |
| **EM13** | Regression / diff testing | Did a change introduce new behavioral failures? | Behavioral diff and regression gate |
| **EM14** | Human-review / rubric evaluation | Does the output satisfy task-specific quality criteria not captured by deterministic checks? | Human or expert rubric |
| **EM15** | Production monitoring / drift evaluation | Does deployed behavior remain within acceptable bounds over time? | Live telemetry, sampled review, trend monitors |

# EM1. Repeated-run testing

## Purpose


Repeated-run testing detects unacceptable variance across repeated executions of the same scenario.

It is the primary method for evaluating repeatability, output variance, rare bad samples, unstable tool use, unstable refusals, and tail-risk behavior.

## Evaluation question


> Does the same scenario produce acceptably similar behavior across repeated runs?

## Best suited for


- output variance;
- tail-risk generation;
- unstable final answers;
- unstable classifications;
- unstable refusal or escalation behavior;
- unstable tool calls;
- unstable tool arguments;
- unstable citations or evidence selection;
- rare unsafe or invalid outputs;
- hard-to-reproduce incidents.

## Typical setup


Run the same scenario multiple times while holding the visible task input constant.

Control as many of the following as possible:

- user prompt;
- system and developer instructions;
- retrieved context;
- tool availability;
- tool outputs;
- model version;
- decoding configuration;
- runtime configuration;
- user/session state;
- policy configuration.

Then compare outputs at the level of behavioral equivalence.

## Observable signals


- materially different final answers;
- different classifications;
- different escalation decisions;
- different risk labels;
- different refusal or compliance behavior;
- different tool calls;
- different tool arguments;
- different citations;
- different evidence use;
- different external actions;
- rare unsafe outputs;
- rare invalid schemas;
- pass/fail instability across repeated test executions.

## Metrics


Possible metrics include:

- pass rate across repeated runs;
- variance in task outcome;
- disagreement rate between runs;
- rate of critical failures;
- rate of rare severe failures;
- probability that at least one run fails over `n` attempts;
- tool-call stability rate;
- refusal/escalation stability rate;
- citation-set stability rate;
- outcome-level consistency.

## Oracle type


Behavioral-equivalence oracle.

The oracle should specify which differences are acceptable and which are material.

## Example


A customer-support escalation classifier is run 20 times on the same scenario.

Acceptable variation:

- different wording in the explanation;
- equivalent summary phrasing.

Material failure:

- escalation decision changes;
- risk level changes;
- tool route changes;
- one run sends the case to the wrong queue.

## Important boundary


Repeated-run testing is not asking whether every token is identical.

It asks whether materially relevant behavior is preserved.

If the scenario uses live retrieval, dynamic tools, or changing external state, repeated-run differences may be caused by Layer 3 or environment differences rather than Layer 2 output variance. In that case, freeze the external state or record it in the trace.

# EM2. Prompt perturbation / paraphrase testing

## Purpose


Prompt perturbation testing detects behavioral fragility under reasonable input variation.

It is the primary method for testing whether a system overfits to narrow wording, formatting, examples, or prompt structure.

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
- brittle policy application;
- prompt regressions.

## Typical setup


Create variants of the same scenario that preserve the intended task but vary irrelevant or reasonable surface features.

Perturbations may include:

- paraphrase;
- synonym substitution;
- changed sentence order;
- changed formatting;
- changed headings;
- changed delimiters;
- changed role framing;
- question versus command;
- terse versus verbose prompt;
- examples reordered;
- constraints placed earlier or later;
- equivalent user phrasing;
- equivalent retrieved document wording.

## Example variants

```text
Variant A:
  Summarize this issue and say if it should be escalated.

Variant B:
  Briefly summarize the customer problem and decide whether escalation is needed.

Variant C:
  Give a short summary and mark whether this requires escalation.
```


The correct answer may use different wording, but the escalation decision and relevant rationale should be stable.

## Observable signals


- changed task interpretation;
- changed classification;
- changed decision;
- changed escalation behavior;
- changed risk level;
- changed output format;
- changed citation behavior;
- changed tool route;
- changed refusal/compliance behavior;
- changed level of caution;
- changed handling of constraints.

## Metrics


Possible metrics include:

- behavioral invariance rate;
- pairwise disagreement rate;
- decision-flip rate;
- policy-flip rate;
- tool-route-flip rate;
- schema-validity stability;
- performance drop under perturbation;
- variance across paraphrase clusters.

## Oracle type


Behavioral-equivalence oracle.

The oracle must define which prompt differences are intended to be irrelevant.

## Important boundary


Prompt perturbation should not silently change the actual task, policy, evidence, or user intent.

If a paraphrase changes the meaning, it is not a robustness test; it is a different scenario.

# EM3. Context ablation / insertion testing

## Purpose


Context ablation and insertion testing detects whether the model uses context appropriately.

It checks whether behavior is sensitive to evidence in the right way.

## Evaluation questions


> Does the model fail when required context is removed?

> Does the model improve when relevant context is added?

> Does irrelevant or misleading context distort the answer?

> Does the model prioritize authoritative evidence over weaker or irrelevant context?

## Best suited for


- context omission;
- context underutilization;
- context priority confusion;
- continuity loss;
- stale-state reliance;
- distractor assimilation;
- source/authority confusion;
- parametric-prior override;
- retrieval-conditioned answer failure;
- evidence ignored or overruled;
- weak source grounding.

## Typical setup


Evaluate controlled variants of the same scenario with different evidence conditions.

Possible conditions:

- required evidence absent;
- required evidence present;
- evidence buried in the middle;
- evidence placed near the end;
- evidence split across chunks;
- conflicting evidence;
- irrelevant distractor chunks;
- stale context;
- low-authority versus high-authority sources;
- paraphrased evidence;
- noisy retrieval result;
- large context with many near-duplicates;
- prior conversation state present versus absent.

## Observable signals


- ignores present evidence;
- fails to abstain when evidence is absent;
- answers from parametric prior despite supplied evidence;
- overuses irrelevant context;
- cites a weak source over a strong source;
- changes answer for the wrong reason;
- treats stale context as current;
- misses buried constraint;
- fails to combine evidence spread across context;
- follows low-authority or untrusted text.

## Metrics


Possible metrics include:

- evidence-sensitivity score;
- answer change under evidence insertion;
- abstention rate when evidence is absent;
- distractor robustness;
- source-priority accuracy;
- context-position robustness;
- lost-in-the-middle rate;
- stale-context error rate;
- contradiction-handling accuracy.

## Oracle type


Evidence-sensitivity oracle.

The oracle defines how the answer should change when evidence changes.

## Important boundary


This method detects Layer 2 context-use behavior.

Whether the retriever failed to fetch the context is a Layer 3 question.

Example:

```text
Layer 2 fault:
  Relevant evidence was present but ignored.

Layer 3 fault:
  Retriever failed to include the governing document.
```


Both can produce a wrong answer, but they require different controls.

# EM4. Grounding and citation evaluation

## Purpose


Grounding and citation evaluation detects whether generated claims are supported by supplied or approved evidence.

It is especially important for RAG, document QA, legal, medical, financial, compliance, policy, research, and enterprise knowledge systems.

## Evaluation question


> Does each material claim trace to evidence that actually supports it?

## Best suited for


- unsupported assertion;
- non-grounded justification;
- fabricated citation or source;
- evidence-claim mismatch;
- weak grounding;
- source infidelity;
- retrieval-conditioned answer failure;
- mixing retrieved facts with model assumptions;
- citation hallucination;
- overclaiming beyond evidence.

## Typical setup


Break the output into material claims and compare each claim against the allowed evidence set.

Evidence may include:

- retrieved chunks;
- source documents;
- database rows;
- tool outputs;
- records from authoritative systems;
- approved policy text;
- cited sources;
- user-provided documents.

For each claim, decide whether the evidence:

- supports it directly;
- supports it indirectly;
- supports only a weaker version;
- is irrelevant;
- contradicts it;
- is absent;
- is fabricated or malformed.

## Observable signals


- claim has no source;
- cited source does not contain the claim;
- cited source contradicts the claim;
- citation exists but supports a weaker claim;
- source exists but is not the source cited;
- citation is invented or malformed;
- explanation does not entail conclusion;
- retrieved fact is mixed with model assumption;
- answer overstates what the document says;
- source quote is altered or misread.

## Metrics


Possible metrics include:

- claim support rate;
- unsupported claim rate;
- citation precision;
- citation recall;
- evidence entailment accuracy;
- contradiction rate;
- fabricated-source rate;
- overclaim rate;
- source-faithfulness score;
- answerability/abstention accuracy.

## Oracle type


Evidence-entailment oracle.

The oracle may be automated, human, expert, or hybrid.

## Important boundary


Grounding is not the same as truth.

A claim can be true but unsupported by the supplied evidence.

A claim can also be supported by a bad source but false in the world.

Grounding asks:

> Is the claim supported by the evidence the system was allowed to use?

Truth asks:

> Is the claim correct?

# EM5. Truth / factuality evaluation

## Purpose


Truth and factuality evaluation detects whether generated factual claims are correct.

This is broader than grounding. A system may need to know whether a claim is true even when no citation is required.

## Evaluation question


> Is the generated claim factually correct?

## Best suited for


- plausibility-truth gap;
- fluent false answer;
- common misconception reproduction;
- stale latent knowledge;
- false premise continuation;
- invented details;
- incorrect numbers, dates, names, or entities;
- overgeneralization from familiar patterns;
- domain-specific factual errors;
- benchmark/product mismatch.

## Typical setup


Compare generated claims against a trusted truth source.

Possible truth sources:

- gold labels;
- expert annotations;
- authoritative databases;
- verified tools;
- canonical documents;
- unit tests;
- factual QA benchmarks;
- domain-specific references;
- manually curated answer keys.

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
- wrong domain-specific rule;
- unsupported generalization treated as fact.

## Metrics


Possible metrics include:

- factual accuracy;
- exact-match accuracy, when appropriate;
- semantic accuracy;
- error rate by claim type;
- outdated-claim rate;
- false-premise acceptance rate;
- hallucination rate;
- abstention accuracy;
- confidence-conditioned accuracy.

## Oracle type


Truth oracle, reference oracle, expert oracle, or tool-backed oracle.

## Important boundary


Truth evaluation and grounding evaluation are separate.

Truth evaluation can say an answer is correct even if no source was cited.

Grounding evaluation can say an answer is unsupported even if the answer happens to be true.

For high-stakes systems, both may be required.

# EM6. Schema and parser validation

## Purpose


Schema and parser validation detects whether output satisfies required structural contracts.

It is the primary method for formal output constraints.

## Evaluation question


> Does the output conform to the required syntax, schema, boundary, and type constraints?

## Best suited for


- output-format drift;
- structured output drift;
- boundary and stopping error;
- exact-string corruption;
- numeric or symbolic fragility;
- missing fields;
- invalid tool arguments;
- malformed identifiers;
- invalid enums;
- parser failures;
- extra commentary in machine-readable output.

## Typical setup


Run deterministic validators over the output.

Possible validators:

- JSON parser;
- XML parser;
- YAML parser;
- regex;
- schema validator;
- type checker;
- SQL parser;
- code compiler;
- unit test;
- exact-string checker;
- enum checker;
- field completeness check;
- length and boundary checker;
- date/number parser;
- identifier validator;
- markdown/table checker.

## Observable signals


- invalid JSON;
- malformed XML/YAML;
- missing fields;
- wrong field names;
- wrong data types;
- wrong enum value;
- extra commentary;
- broken escaping;
- malformed identifiers;
- changed exact string;
- invalid numeric format;
- invalid date format;
- truncated output;
- partial object;
- invalid tool-call payload.

## Metrics


Possible metrics include:

- parse success rate;
- schema validity rate;
- required-field completeness;
- type correctness;
- enum correctness;
- exact-copy accuracy;
- valid-tool-payload rate;
- retry success rate;
- invalid-output rate under stress;
- syntax versus semantic error split.

## Oracle type


Deterministic parser or validator.

## Important boundary


Schema validity is not semantic correctness.

An output can parse successfully while containing wrong values.

Example:

```json
{
  "escalate": false,
  "reason": "No urgent issue found"
}
```


The object may be valid JSON while the classification is wrong.

Use EM6 for form. Use other methods for meaning.

# EM7. Reasoning / process evaluation

## Purpose


Reasoning and process evaluation detects multi-step reasoning, planning, decomposition, or constraint-preservation failures.

It is used when the correctness of the final answer depends on intermediate steps.

## Evaluation question


> Does the reasoning or plan preserve correctness, constraints, and goal alignment across steps?

## Best suited for


- error accumulation;
- plan drift;
- invariant loss;
- spurious decomposition;
- premature closure;
- local plausibility drift;
- path dependence;
- invalid intermediate step;
- dropped assumptions;
- contradiction across steps;
- incomplete multi-step solution.

## Typical setup


Evaluate intermediate artifacts, not just final outputs.

Possible artifacts:

- generated plan;
- reasoning trace;
- decomposition;
- intermediate calculations;
- extracted assumptions;
- state checkpoints;
- decision tree;
- constraints carried forward;
- final answer dependence on earlier steps.

Checks may include:

- step-level correctness;
- invariant preservation;
- goal alignment;
- contradiction detection;
- arithmetic verification;
- symbolic verification;
- dependency checking;
- expert rubric.

## Observable signals


- early mistake propagates;
- hidden contradiction;
- invalid intermediate step;
- goal drift;
- dropped constraint;
- invented subtask;
- conclusion does not follow;
- plan no longer matches original objective;
- reasoning supports a different answer;
- correct answer with invalid reasoning;
- plausible but unnecessary decomposition;
- premature finalization.

## Metrics


Possible metrics include:

- step correctness rate;
- invariant-preservation rate;
- plan-validity score;
- contradiction rate;
- decomposition validity;
- final-answer dependency correctness;
- premature-closure rate;
- recovery after detected error;
- expert process score.

## Oracle type


Step-level oracle, invariant checker, expert review, formal checker, or task-specific rubric.

## Important boundary


Reasoning traces are not automatically reliable evidence of hidden internal cognition.

This method evaluates produced process artifacts, plans, calculations, or traces. It does not assume that the written rationale is a faithful record of internal computation.

# EM8. Agent trace evaluation

## Purpose


Agent trace evaluation detects failures in tool use, action selection, process control, state handling, and recovery.

It is necessary when systems do more than produce a final text answer.

## Evaluation question


> Did the agent choose the right steps, tools, arguments, checks, and actions?

## Best suited for


- wrong tool choice;
- missing tool call;
- unnecessary tool call;
- wrong tool arguments;
- malformed tool arguments;
- tool-output misinterpretation;
- state update error;
- skipped step;
- loop;
- premature stopping;
- failure recovery issues;
- unsafe or unjustified action;
- action without authorization;
- inefficient or brittle workflow.

## Typical setup


Record and evaluate the full trace.

A trace may include:

- user request;
- system and developer instructions;
- task state;
- retrieved context;
- plan;
- tool choices;
- tool arguments;
- tool outputs;
- intermediate observations;
- retries;
- error handling;
- state updates;
- final response;
- external actions.

The evaluator checks whether the process was valid, not only whether the final response looked acceptable.

## Observable signals


- selected wrong tool;
- failed to use required tool;
- passed wrong argument;
- omitted required argument;
- used stale state;
- ignored tool error;
- retried without changing strategy;
- looped;
- stopped before completion;
- acted without sufficient evidence;
- executed irreversible action without authorization;
- failed to recover from missing data;
- misread tool output;
- final answer contradicts tool result.

## Metrics


Possible metrics include:

- tool-selection accuracy;
- tool-argument validity;
- required-step completion;
- unnecessary-step rate;
- recovery success rate;
- loop rate;
- premature-stop rate;
- action-authorization compliance;
- trace-level success rate;
- final-outcome success conditioned on trace quality.

## Oracle type


Trace oracle, process rubric, tool-call validator, action-safety oracle.

## Important boundary


Agent trace evaluation is not only final-answer evaluation.

An agent can produce a good final message after a bad process, or a bad final outcome after individually plausible steps.

For external actions, trace-level evaluation is usually mandatory.

# EM9. Calibration evaluation

## Purpose


Calibration evaluation detects whether expressed confidence, uncertainty, abstention, or self-assessment corresponds to actual reliability.

It is the primary method for weak calibration and misleading confidence.

## Evaluation question


> Does the model's confidence, uncertainty, or self-assessment correspond to actual correctness or risk?

## Best suited for


- weak confidence calibration;
- misleading confidence;
- non-privileged self-evaluation;
- high-confidence wrong answers;
- over-hedged correct answers;
- inconsistent uncertainty across runs;
- inappropriate certainty in high-risk domains;
- failure to abstain when evidence is insufficient;
- false claims of verification.

## Typical setup


Collect outputs with confidence language, uncertainty markers, abstention decisions, or numeric confidence estimates, then compare them with correctness labels.

Possible signals:

- explicit confidence score;
- verbal confidence markers;
- hedging language;
- uncertainty language;
- abstention;
- escalation;
- self-check result;
- claim of having verified;
- citation strength.

## Observable signals


- confident wrong answer;
- over-hedged correct answer;
- no uncertainty when evidence is absent;
- uncertainty varies across equivalent cases;
- self-critique fails to catch an error;
- numeric confidence is not predictive;
- refusal/escalation does not correlate with risk;
- generated verification claim is unsupported.

## Metrics


Possible metrics include:

- calibration curve;
- expected calibration error;
- Brier score;
- confidence-conditioned accuracy;
- abstention precision;
- abstention recall;
- selective prediction accuracy;
- uncertainty consistency across variants;
- self-check accuracy.

## Oracle type


Empirical calibration curve, labeled correctness set, expert review, or risk label set.

## Important boundary


Generated confidence language is behavior, not a calibrated probability.

A model saying "I am confident" is not evidence that the answer is reliable.

Self-evaluation is also generated output unless connected to independent verification.

# EM10. Safety and policy adversarial testing

## Purpose


Safety and policy adversarial testing detects failures to preserve safety, compliance, refusal, escalation, authorization, privacy, and trust boundaries.

It evaluates behavior under adversarial, ambiguous, high-risk, or policy-sensitive conditions.

## Evaluation question


> Does the system maintain required behavioral boundaries under adversarial, ambiguous, or high-risk conditions?

## Best suited for


- under-refusal;
- over-refusal;
- prompt-injection compliance;
- unsafe action readiness;
- sycophantic agreement;
- policy inconsistency;
- unauthorized recommendation;
- sensitive-data leakage;
- harmful or biased output;
- failure to escalate;
- high-stakes advice beyond scope;
- unsafe tool use;
- privacy boundary failure.

## Typical setup


Run scenarios that test behavioral boundaries.

Scenario types may include:

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
- tool-output injection;
- jailbreak-like framing;
- requests near allowed/disallowed boundary;
- attempts to reveal confidential information.

## Observable signals


- follows malicious embedded instruction;
- refuses allowed task;
- complies with disallowed task;
- gives high-stakes advice beyond scope;
- leaks private information;
- skips escalation;
- takes action without authorization;
- applies policy inconsistently;
- over-trusts user assertion;
- agrees with false or unsafe premise;
- reveals implementation details unnecessarily;
- mishandles untrusted retrieved text.

## Metrics


Possible metrics include:

- under-refusal rate;
- over-refusal rate;
- policy-compliance rate;
- injection-success rate;
- sensitive-data leakage rate;
- unsafe-action rate;
- escalation accuracy;
- authorization-compliance rate;
- edge-case consistency;
- severity-weighted failure rate.

## Oracle type


Policy oracle, safety rubric, authorization oracle, privacy oracle, expert review.

## Important boundary


Safety evaluation should distinguish model behavior from system controls.

Example:

```text
Layer 2 behavioral fault:
  The model follows an injected instruction in retrieved text.

Layer 3 system fault:
  The system failed to isolate or neutralize untrusted retrieved text.
```


The evaluation may reveal both, but the classification should separate them.

# EM11. Stress / budget testing

## Purpose


Stress and budget testing detects behavior degradation under token, latency, compute, memory, context, tool-call, or task-complexity pressure.

It tests whether behavior remains acceptable near practical resource limits.

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
- lost source distinction;
- missing exceptions;
- degraded retrieval use under large context;
- latency-driven shortcut behavior.

## Typical setup


Evaluate scenarios with resource pressure.

Stress dimensions may include:

- long documents;
- long conversations;
- many retrieved chunks;
- dense evidence;
- large schemas;
- multi-step tasks;
- constrained latency;
- limited output budget;
- limited number of tool calls;
- required verification passes;
- many edge cases;
- high branching factor;
- large table or structured data;
- context near maximum token limit.

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
- missed buried evidence;
- generic fallback answer;
- tool call omitted to save effort;
- invalid output under length pressure.

## Metrics


Possible metrics include:

- completeness score;
- required-item recall;
- exception-preservation rate;
- truncation rate;
- long-context accuracy;
- latency-conditioned accuracy;
- cost-conditioned accuracy;
- verification-skip rate;
- schema-validity under stress;
- performance versus context length;
- performance versus number of retrieved chunks.

## Oracle type


Completeness rubric, coverage checker, source-comparison oracle, stress benchmark.

## Important boundary


Budget testing detects behavioral degradation.

The product decision to set a low token, latency, or cost budget belongs to Layer 3 or product design.

# EM12. Distributional slice testing

## Purpose


Distributional slice testing detects uneven competence across domains, languages, formats, edge cases, user groups, environments, and task framings.

It prevents aggregate scores from hiding serious weak spots.

## Evaluation question


> Does performance hold across the relevant slices of the product distribution?

## Best suited for


- uneven competence;
- distributional overgeneralization;
- rare-format brittleness;
- multilingual weakness;
- benchmark/product mismatch;
- domain-specific failures;
- symbolic-task failures;
- low-resource language failures;
- edge-case policy errors;
- unfamiliar document-type errors.

## Typical setup


Define slices that matter for the product and evaluate each slice separately.

Possible slices:

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
- source authority;
- tool availability;
- data freshness;
- customer segment;
- high-risk versus low-risk domain.

## Observable signals


- strong average performance but weak slice performance;
- failure on rare formats;
- failure in a specific language or script;
- degradation on edge cases;
- overgeneralization from familiar patterns;
- confident answer outside competence region;
- uneven policy application;
- poor performance on product-specific cases despite benchmark success.

## Metrics


Possible metrics include:

- per-slice accuracy;
- worst-slice performance;
- performance gap between slices;
- false-positive/false-negative rates by slice;
- calibration by slice;
- refusal rate by slice;
- grounding rate by slice;
- tool success by slice;
- severity-weighted slice failures.

## Oracle type


Slice-level benchmark, stratified labeled set, expert review.

## Important boundary


Distributional slice testing should not only report aggregate scores.

The point is to reveal hidden capability cliffs.

A high overall score may still be unacceptable if a critical slice fails.

# EM13. Regression / diff testing

## Purpose


Regression and diff testing detects whether a change introduced new behavioral failures.

It is the primary method for comparing versions.

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
- safety regressions;
- format regressions;
- cost/latency regressions;
- unintended side effects from a targeted fix.

## Typical setup


Run the same scenario suite before and after a change.

Changes may include:

- model version;
- system prompt;
- developer prompt;
- retrieval configuration;
- embedding model;
- reranker;
- chunking strategy;
- tool schema;
- tool implementation;
- data source;
- policy text;
- validator;
- output schema;
- decoding configuration;
- memory strategy;
- orchestration logic.

Compare behavior at the right level:

- final answer;
- decision;
- citations;
- tool calls;
- tool arguments;
- refusal behavior;
- escalation behavior;
- format validity;
- latency;
- cost;
- trace quality;
- safety outcomes.

## Observable signals


- formerly passing scenario fails;
- improved narrow case but worsened adjacent cases;
- changed tool route;
- changed citation source;
- changed refusal decision;
- changed output schema;
- changed latency or cost profile;
- changed escalation behavior;
- new unsafe completion;
- new unsupported claim;
- degraded worst-slice performance.

## Metrics


Possible metrics include:

- pass/fail delta;
- severity-weighted regression count;
- newly failing scenarios;
- fixed scenarios;
- net quality delta;
- per-slice delta;
- latency/cost delta;
- behavioral-diff classification;
- manual-review disagreement rate;
- release-gate pass/fail.

## Oracle type


Behavioral diff, regression gate, scenario benchmark, human review.

## Important boundary


A diff is not automatically a regression.

The evaluator must classify whether the difference is acceptable, material, or critical.

Some changes are intended improvements even if the exact output differs.

Regression coverage should assume that change effects may be non-local. The edited prompt, model, retriever, schema, tool, or policy can degrade behavior outside the motivating case, so comparison should include adjacent slices and representative workflows rather than only the touched scenario.

# EM14. Human-review / rubric evaluation

## Purpose


Human-review and rubric evaluation judge outputs where correctness is semantic, contextual, subjective, or task-specific rather than deterministic.

It is necessary when automated oracles cannot capture the target property reliably.

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
- style requirements;
- prioritization quality;
- explanation quality;
- complex domain review.

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
- empathy, when relevant;
- severity recognition;
- correct uncertainty;
- correct escalation.

Rubrics should define:

- pass/fail thresholds;
- score scale;
- examples of each score level;
- critical failure conditions;
- reviewer instructions;
- adjudication process;
- disagreement handling;
- whether reviewers judge exact output or intended behavior.

## Observable signals


- missing key information;
- misleading emphasis;
- wrong tone;
- overlong answer;
- under-informative answer;
- technically correct but unhelpful answer;
- inconsistent review judgments;
- incomplete summary;
- poor prioritization;
- wrong degree of caution;
- policy nuance missed.

## Metrics


Possible metrics include:

- average rubric score;
- pass rate;
- critical-failure rate;
- reviewer agreement;
- adjudicated score;
- pairwise preference win rate;
- quality dimension scores;
- severity-weighted score;
- calibration of human labels against automated labels.

## Oracle type


Human rubric, expert rubric, pairwise preference, task-specific quality score.

## Important boundary


Human review should not remain informal.

If reviewers disagree, the rubric may be underspecified.

When deterministic validators can reliably judge the property, prefer deterministic validation. Use human review for semantic, contextual, or quality judgments that require interpretation.

# EM15. Production monitoring / drift evaluation

## Purpose


Production monitoring and drift evaluation detects whether deployed behavior remains within acceptable bounds over time.

It extends evaluation from pre-release testing to ongoing operation.

## Evaluation question


> Does deployed behavior remain stable, safe, useful, and correct as users, data, tools, models, prompts, and environments change?

## Best suited for


- production behavior drift;
- data and knowledge drift;
- retrieval-index drift;
- tool/API drift;
- policy drift;
- model-serving changes;
- latent regressions not covered by test suites;
- new user behavior;
- emerging edge cases;
- long-tail failures;
- incident detection;
- silent degradation.

## Typical setup


Monitor production or near-production behavior using a mix of telemetry, sampling, automated checks, and human review.

This is the runtime backstop for regressions whose blast radius was broader or less predictable than offline regression suites revealed.

Possible signals:

- sampled output review;
- user feedback;
- incident reports;
- refusal rates;
- escalation rates;
- tool-call failure rates;
- retrieval miss rates;
- citation support rates;
- schema failure rates;
- latency and cost metrics;
- safety-policy hits;
- drift in input distribution;
- drift in output distribution;
- change in failure mix;
- anomaly detection on trace features.

## Observable signals


- rising unsupported-claim rate;
- rising parse failures;
- changed refusal rate;
- changed escalation rate;
- tool errors increase;
- retrieval quality declines;
- new documents not handled correctly;
- stale documents still used;
- user complaints cluster around a slice;
- cost/latency increases cause skipped verification;
- previously rare failure becomes common.

## Metrics


Possible metrics include:

- trend in pass/fail rates;
- incident rate;
- alert rate;
- unsupported-claim trend;
- parse-failure trend;
- tool-error trend;
- policy-violation trend;
- slice-specific drift;
- data freshness metrics;
- latency/cost trend;
- quality trend by product area;
- regression replay success after incidents.

## Oracle type


Live telemetry, sampled human review, automated monitors, trend detectors, replay suites.

## Important boundary


Monitoring is not a replacement for pre-release evaluation.

It detects failures that occur after deployment, especially when external conditions change. It should feed new scenarios back into repeated-run tests, regression suites, adversarial tests, and slice benchmarks.

# Fault-family to evaluation-method mapping


| Fault family | Primary evaluation methods | Secondary evaluation methods |
|---|---|---|
| **Context faults** | EM3 Context ablation / insertion | EM4 Grounding, EM11 Stress, EM15 Monitoring |
| **Generation faults** | EM1 Repeated-run, EM7 Reasoning/process | EM13 Regression, EM11 Stress |
| **Epistemic faults** | EM4 Grounding, EM5 Truth/factuality | EM9 Calibration, EM14 Human rubric |
| **Instruction/task faults** | EM2 Prompt perturbation | EM10 Safety/policy, EM13 Regression |
| **Reasoning/planning faults** | EM7 Reasoning/process | EM8 Agent trace, EM11 Stress |
| **Structure/representation faults** | EM6 Schema/parser validation | EM8 Agent trace, EM13 Regression |
| **Budget/resource faults** | EM11 Stress/budget testing | EM3 Context ablation, EM13 Regression |
| **Interaction/experience faults** | EM14 Human rubric | EM1 Repeated-run, EM2 Perturbation |
| **Agent/action faults** | EM8 Agent trace | EM10 Safety/policy, EM13 Regression |
| **Distributional competence faults** | EM12 Distributional slice testing | EM5 Truth/factuality, EM14 Human rubric |
| **Retrieval-conditioned answer faults** | EM3 Context testing, EM4 Grounding | EM13 Regression, EM15 Monitoring |
| **Safety/compliance faults** | EM10 Safety/policy adversarial testing | EM8 Agent trace, EM14 Expert review, EM15 Monitoring |

# Atomic fault examples to evaluation methods


| Fault example | Primary method | Secondary methods |
|---|---|---|
| Context omission | EM3 | EM11, EM15 |
| Context underutilization | EM3 | EM4, EM11 |
| Context priority confusion | EM3 | EM4, EM10 |
| Continuity loss | EM3 | EM8, EM15 |
| Prompt-form sensitivity | EM2 | EM13 |
| Task misinduction | EM2 | EM14 |
| Constraint misclassification | EM2 | EM7, EM14 |
| Control/data confusion | EM10 | EM3, EM8 |
| Prompt-injection compliance | EM10 | EM3, EM8 |
| Output-format drift | EM6 | EM13 |
| Boundary/stopping error | EM6 | EM11 |
| Exact-string corruption | EM6 | EM12 |
| Numeric/symbolic fragility | EM6 | EM7, EM12 |
| Local plausibility drift | EM7 | EM5, EM14 |
| Path dependence | EM7 | EM1 |
| Output variance | EM1 | EM13 |
| Tail-risk generation | EM1 | EM10, EM15 |
| Unsupported assertion | EM4 | EM5 |
| Plausibility-truth gap | EM5 | EM4 |
| Non-grounded justification | EM4 | EM7 |
| Fabricated citation/source | EM4 | EM10 |
| Evidence-claim mismatch | EM4 | EM14 |
| Weak confidence calibration | EM9 | EM5 |
| Non-privileged self-evaluation | EM9 | EM7 |
| Sycophantic agreement | EM10 | EM14 |
| Over-refusal | EM10 | EM14, EM12 |
| Under-refusal | EM10 | EM14 |
| Clarification failure | EM14 | EM2 |
| Tone/persona inconsistency | EM14 | EM1, EM2 |
| Verbosity mismatch | EM14 | EM2 |
| Competence cliff | EM12 | EM5, EM14 |
| Distributional overgeneralization | EM12 | EM5 |
| Truncation-induced loss | EM11 | EM3, EM6 |
| Compression-induced distortion | EM11 | EM4, EM14 |
| Budget-induced incompleteness | EM11 | EM14 |
| Tool-selection error | EM8 | EM13 |
| Tool-argument error | EM8 | EM6 |
| Tool-output misinterpretation | EM8 | EM4, EM7 |
| Action-readiness error | EM8 | EM10 |
| Recovery failure | EM8 | EM13, EM15 |

# Evaluation-method selection guide


Use this guide when deciding which method to apply.

## If the concern is instability


Use:

- EM1 Repeated-run testing;
- EM2 Prompt perturbation testing;
- EM13 Regression/diff testing;
- EM15 Production monitoring.

Ask:

- Does the same case behave consistently?
- Do equivalent cases behave consistently?
- Did behavior change after a system change?
- Is behavior drifting in production?

## If the concern is evidence use


Use:

- EM3 Context ablation/insertion testing;
- EM4 Grounding and citation evaluation;
- EM5 Truth/factuality evaluation.

Ask:

- Was the right evidence present?
- Was it used?
- Does it support the claim?
- Is the claim true?

## If the concern is strict output shape


Use:

- EM6 Schema and parser validation.

Add:

- EM8 Agent trace evaluation for tool payloads;
- EM13 Regression testing for schema changes;
- EM11 Stress testing for long outputs.

Ask:

- Does it parse?
- Does it match the schema?
- Are all required fields present?
- Are field values semantically correct?

## If the concern is multi-step behavior


Use:

- EM7 Reasoning/process evaluation;
- EM8 Agent trace evaluation;
- EM11 Stress/budget testing.

Ask:

- Were the right steps taken?
- Were constraints preserved?
- Were intermediate outputs correct?
- Did the process recover from errors?

## If the concern is risk, safety, or compliance


Use:

- EM10 Safety/policy adversarial testing;
- EM8 Agent trace evaluation;
- EM14 Expert rubric evaluation;
- EM15 Production monitoring.

Ask:

- Did the system refuse, comply, or escalate correctly?
- Did it preserve authorization boundaries?
- Did it leak or misuse sensitive information?
- Did it take or recommend unsafe action?

## If the concern is user experience


Use:

- EM14 Human-review/rubric evaluation;
- EM1 Repeated-run testing;
- EM2 Prompt perturbation testing;
- EM12 Distributional slice testing.

Ask:

- Is the behavior consistent with the intended product experience?
- Does tone vary inappropriately?
- Is the answer too verbose or too terse?
- Does the system ask for clarification appropriately?

## If the concern is release safety


Use:

- EM13 Regression/diff testing;
- EM1 Repeated-run testing;
- EM10 Safety/policy adversarial testing;
- EM12 Distributional slice testing;
- EM15 Production monitoring after release.

Ask:

- Did the change introduce new failures?
- Did it fix the intended cases without breaking neighboring cases?
- Are high-risk slices still protected?
- Are production monitors ready?

# Oracle types


An evaluation method is only as good as its oracle.

| Oracle type | Best for | Limits |
|---|---|---|
| **Exact-match oracle** | Deterministic labels, identifiers, fixed strings | Too strict for most generative tasks |
| **Parser / validator** | JSON, schemas, types, enums, syntax | Does not prove semantic correctness |
| **Gold label** | Classification, extraction, known-answer tasks | Expensive to maintain; may miss acceptable alternatives |
| **Behavioral-equivalence oracle** | Repeated-run and perturbation tests | Requires task-specific equivalence rules |
| **Evidence-entailment oracle** | Grounding, citation, source fidelity | May be hard for long or complex evidence |
| **Truth oracle** | Factuality | Requires trusted references; may change over time |
| **Policy oracle** | Safety, compliance, refusal, escalation | Policy may be ambiguous or change |
| **Trace oracle** | Agentic workflows, tool use, recovery | Requires instrumentation and process labels |
| **Expert rubric** | High-stakes or nuanced domains | Expensive; reviewer disagreement possible |
| **Human preference/rubric** | UX, helpfulness, tone, usefulness | Subjective unless rubric is precise |
| **Statistical oracle** | Stability, calibration, slice performance | Requires enough samples |
| **Monitoring signal** | Production drift and incidents | Detects after deployment; can be noisy |

# Metrics by evaluation goal

## Reliability


Possible metrics:

- repeated-run pass rate;
- scenario-level variance;
- tail-failure rate;
- decision-flip rate;
- tool-call stability;
- refusal/escalation stability;
- production incident rate.

## Robustness


Possible metrics:

- paraphrase invariance;
- context-order robustness;
- distractor robustness;
- prompt-format robustness;
- perturbation pass rate;
- worst-variant performance.

## Grounding


Possible metrics:

- claim support rate;
- citation precision;
- citation recall;
- unsupported-claim rate;
- evidence-claim mismatch rate;
- fabricated-citation rate;
- abstention accuracy.

## Correctness


Possible metrics:

- factual accuracy;
- label accuracy;
- exact-match accuracy, when appropriate;
- semantic accuracy;
- error rate by claim type;
- expert correctness score.

## Structure and integration


Possible metrics:

- parse success;
- schema validity;
- required-field completeness;
- enum correctness;
- valid tool-payload rate;
- retry success rate.

## Agentic success


Possible metrics:

- tool-selection accuracy;
- tool-argument validity;
- step-completion rate;
- recovery success;
- action-authorization compliance;
- end-to-end task success;
- unnecessary-step rate;
- loop rate.

## Safety and compliance


Possible metrics:

- under-refusal rate;
- over-refusal rate;
- policy-compliance rate;
- injection-success rate;
- sensitive-data leakage rate;
- unsafe-action rate;
- escalation accuracy;
- severity-weighted failure rate.

## User experience


Possible metrics:

- rubric score;
- tone consistency;
- verbosity fit;
- clarification appropriateness;
- user satisfaction proxy;
- reviewer preference;
- complaint rate.

## Cost, latency, and resources


Possible metrics:

- latency;
- cost per successful task;
- token usage;
- tool-call count;
- quality versus latency;
- quality versus cost;
- skipped-verification rate;
- degradation under long context.

# Evaluation result schema


Each evaluation result should be recordable in a structured way.

Suggested fields:

```yaml
scenario_id:
scenario_name:
scenario_type:
run_id:
variant_id:
model_version:
prompt_version:
retrieval_version:
tool_version:
policy_version:
input_hash:
context_hash:
output_hash:
trace_id:
layer_2_faults:
  - fault_code:
    confidence:
    evidence:
evaluation_methods:
  - method_code:
    oracle_type:
    result:
    score:
    threshold:
    severity:
    reviewer_id:
    notes:
behavioral_equivalence_class:
final_decision:
escalation_required:
release_gate_result:
created_at:
```


This schema allows the same run to be tagged with multiple faults and multiple evaluation methods.

# Design rules

## 1. Evaluate behavior, not surface text by default


For generative tasks, exact text equality is usually too strict.

The default unit should be intended behavior:

- facts;
- decision;
- risk level;
- evidence;
- citation support;
- tool use;
- external action;
- format validity;
- user-facing commitment.

Use exact matching only when exact form is the requirement.

## 2. Separate truth from grounding


Truth evaluation asks whether a claim is correct.

Grounding evaluation asks whether a claim is supported by the evidence the system was allowed to use.

Both may matter, but they answer different questions.

## 3. Separate final-answer evaluation from process evaluation


Some tasks can be judged from the final output alone.

Agentic, high-risk, and tool-using workflows usually require trace-level evaluation.

## 4. Use deterministic validators where possible


Schemas, parsers, type checks, enum checks, and exact-string validators are cheaper and more reliable than rubric evaluation when the target property is formal.

## 5. Use human or expert rubrics where necessary


Some properties require semantic judgment, especially usefulness, policy nuance, tone, completeness, and acceptable variation.

Human review should be structured, not informal.

## 6. Test both identical and equivalent scenarios


Repeated-run testing asks whether the same scenario is stable.

Prompt perturbation testing asks whether equivalent scenarios are stable.

Both are necessary for robust generative systems.

## 7. Evaluate slices, not only averages


Aggregate scores can hide critical failures.

Report performance by relevant domain, language, format, customer segment, document type, policy category, difficulty, and risk level.

## 8. Treat rare severe failures differently


A low average failure rate may be unacceptable if the tail failures are severe.

Tail-risk tests should use severity-weighted analysis.

## 9. Connect evaluation to gates and controls


An evaluation only reveals a fault. It does not prevent the fault unless connected to a release gate, monitor, validator, retry, escalation path, authorization rule, or other Layer 3 control.

## 10. Preserve traces


A final output is often insufficient for debugging.

Store enough trace data to distinguish:

- retrieval failure;
- context-use failure;
- tool-selection failure;
- tool-output misinterpretation;
- schema failure;
- safety-policy failure;
- model behavior variance;
- data drift.

# Anti-patterns

## Anti-pattern 1: Treating exact text match as the universal standard


Exact text comparison is appropriate for exact-string requirements, but inappropriate for many summarization, advice, explanation, and classification tasks.

Use behavioral equivalence unless exact wording is required.

## Anti-pattern 2: Treating a single successful run as reliability evidence


One passing run only proves the system passed once.

Use repeated-run testing, perturbation testing, regression testing, and production monitoring.

## Anti-pattern 3: Collapsing grounding and truth


A grounded answer may still be false if the source is wrong.

A true answer may be ungrounded if it is not supported by the supplied evidence.

Evaluate both when the distinction matters.

## Anti-pattern 4: Evaluating only the final answer for agentic systems


Tool-using systems can fail in the trace even when the final message looks acceptable.

Evaluate tool choice, arguments, observations, retries, state updates, and external actions.

## Anti-pattern 5: Using human review without a rubric


Unstructured review is hard to reproduce and hard to compare.

Use criteria, examples, score levels, adjudication, and reviewer agreement checks.

## Anti-pattern 6: Reporting only aggregate performance


Average performance can hide failures in high-risk slices.

Report slice performance and worst-slice performance.

## Anti-pattern 7: Treating evaluation methods as Layer 2 faults


Evaluation methods detect faults. They are not faults themselves.

Example:

```text
Not a Layer 2 fault:
  Needs repeated-run testing.

Layer 2 fault:
  Output variance.
```

## Anti-pattern 8: Treating evaluation as a system control by itself


An evaluation can detect a failure, but it does not prevent recurrence unless connected to a control.

Example:

```text
Evaluation:
  Grounding check detects unsupported claims.

Layer 3 control:
  Gate the response, force abstention, retrieve more evidence, or require human review.
```

# Relationship to Layer 3 controls


Evaluation methods often motivate Layer 3 controls, but they should not be collapsed into them.

| Evaluation finding | Possible Layer 3 control |
|---|---|
| Context omission detected | Improve retrieval, state persistence, memory rehydration, context assembly checks |
| Context underutilization detected | Improve prompt layout, salience, chunk ordering, citation forcing, answer constraints |
| Unsupported claims detected | Add grounding checks, citation validators, abstention rules, source-required answer modes |
| Format drift detected | Add schema validation, constrained decoding, retry-on-parse-failure, typed tool schemas |
| Tool-argument errors detected | Add argument validators, typed wrappers, dry-run checks, tool-call tests |
| Unsafe action readiness detected | Add authorization gates, human approval, reversible-action design, risk-based escalation |
| Weak calibration detected | Add abstention rules, external verification, confidence display restrictions |
| Prompt fragility detected | Harden task contract, add examples, use typed input, add perturbation regression suite |
| Distributional slice failure detected | Add slice-specific tests, prompt changes, retrieval improvements, model routing, human fallback |
| Regression detected | Block release, inspect diff, update test suite, rollback, add new guard |
| Production drift detected | Alert, sample reviews, replay incidents, refresh data, update eval suite, adjust controls |

# Minimal evaluation bundle by system type

## RAG question-answering system


Minimum methods:

- EM3 Context ablation / insertion testing;
- EM4 Grounding and citation evaluation;
- EM5 Truth/factuality evaluation;
- EM13 Regression/diff testing;
- EM15 Production monitoring.

Add when high-stakes:

- EM10 Safety/policy adversarial testing;
- EM14 Expert rubric evaluation.

## Structured extraction system


Minimum methods:

- EM6 Schema and parser validation;
- EM5 Truth/factuality or gold-label evaluation;
- EM3 Context ablation / insertion testing;
- EM13 Regression/diff testing.

Add when documents are long:

- EM11 Stress/budget testing.

## Customer-support classifier or triage system


Minimum methods:

- EM1 Repeated-run testing;
- EM2 Prompt perturbation testing;
- EM12 Distributional slice testing;
- EM14 Human-review/rubric evaluation;
- EM13 Regression/diff testing.

Add when actions occur:

- EM8 Agent trace evaluation;
- EM10 Safety/policy adversarial testing.

## Agentic tool-using workflow


Minimum methods:

- EM8 Agent trace evaluation;
- EM6 Schema/parser validation for tool payloads;
- EM7 Reasoning/process evaluation;
- EM10 Safety/policy adversarial testing;
- EM13 Regression/diff testing;
- EM15 Production monitoring.

Add when retrieval is used:

- EM3 Context testing;
- EM4 Grounding evaluation.

## Content-generation assistant


Minimum methods:

- EM14 Human-review/rubric evaluation;
- EM2 Prompt perturbation testing;
- EM10 Safety/policy adversarial testing;
- EM12 Distributional slice testing.

Add when factual claims are allowed:

- EM4 Grounding evaluation;
- EM5 Truth/factuality evaluation.

## High-stakes advisory system


Minimum methods:

- EM4 Grounding and citation evaluation;
- EM5 Truth/factuality evaluation;
- EM9 Calibration evaluation;
- EM10 Safety/policy adversarial testing;
- EM12 Distributional slice testing;
- EM14 Expert rubric evaluation;
- EM13 Regression/diff testing;
- EM15 Production monitoring.

Add if tool/action capable:

- EM8 Agent trace evaluation.

# Recommended placement in the stack


This document should sit alongside the Layer 2 classification views document.

Suggested file name:

```text
evaluation-method-reference.md
```


Recommended references:

```text
fault-inventory.md
fault-family-index.md
classification-views.md
fault-evaluation-mapping.md
worked-examples.md
layer-3-control-families.md
```


This document owns the evaluation-method definitions. Other documents should reference it rather than duplicating the method descriptions.
