---
draft: false
toc: true
title: "Empirical Nature Add"
linkTitle: "Empirical Nature Add"
---
# [WIP] AI Design Principles

## Principles to formulate


Compact set of principles.

### 1. Behavioral claims require evidence


Also, a system-level quality claim is justified by implementation reasoning **and** observed behavior under relevant conditions.

### 2. Every quality claim is scoped


Reliability, safety, correctness, and usefulness apply to a defined task, population, version, context, and operating envelope.

### 3. The effective scenario is the unit of comparison


Comparing prompts alone is insufficient when retrieval, state, tools, policies, data, or versions differ.

### 4. Material outcomes are the unit of behavior


Surface-text variation matters only when it changes a relevant claim, decision, action, obligation, or risk.

### 5. Evidence must match the causal feature


Variability requires repetition; soft correctness requires rubrics; compositionality requires traces; drift requires versioning; non-locality requires broad regressions.

### 6. One successful execution establishes possibility, not reliability


Reliability requires coverage across repeated runs, representative scenarios, meaningful slices, and relevant perturbations.

### 7. Comparability must be engineered


Runtime context, system versions, datasets, rubrics, and operating conditions must be captured well enough to interpret differences.

### 8. Changes are behavioral hypotheses


A model, prompt, retrieval, tool, policy, schema, or orchestration change proposes an expected behavioral effect. The effect must be measured, including outside the targeted case.

### 9. Evaluation must reflect the operating envelope


Evidence gathered under unrealistic cost, latency, tool availability, human review, or infrastructure conditions does not establish production quality.

### 10. Production observation extends pre-release evidence


Production monitoring reveals distribution shift, rare failures, feedback effects, and missing slices. It complements rather than replaces pre-release evaluation.

### 11. Observability determines learnability


A failure that cannot be attributed, replayed, or compared provides weak evidence for system improvement.

### 12. Controls should be evidence-linked


Validators, release gates, escalation rules, retries, and human-review requirements should correspond to demonstrated failure modes and risk thresholds.

# Principles

## Principle 1 -- Behavioral claims require behavioral evidence


A system-level quality claim requires observed behavior under conditions relevant to that claim.

Implementation evidence and behavioral evidence should be combined.

## Principle 2 -- Every claim has a scope


Reliability, correctness, safety, and usefulness apply to a defined:

```text
task
population
slice
version
runtime context
operating envelope
time period
```


Evidence outside that scope may provide supporting information. It does not automatically establish the scoped claim.

## Principle 3 -- Material outcomes are the primary evaluation unit


Evaluate the claim, decision, action, state change, or obligation that matters to the product.

Use exact text only when exact text is itself a requirement.

## Principle 4 -- The effective scenario is the comparison unit


Visible input alone is insufficient when runtime context can influence behavior.

Capture or control the context required to interpret differences.

## Principle 5 -- Evidence must match the causal feature


Different causal properties require different forms of evidence.

Examples:

```text
variability requires repetition;
soft correctness requires acceptance criteria;
compositionality requires traces;
drift requires version capture;
feedback requires longitudinal observation;
non-locality requires broad regression coverage;
trust mediation requires full-path testing;
operating constraints require realistic budgets.
```

## Principle 6 -- One successful execution establishes possibility


Reliability requires evidence across repeated runs, representative cases, relevant slices, and meaningful perturbations.

## Principle 7 -- Comparability must be engineered


Evaluation results are comparable only when system versions, datasets, rubrics, scenario definitions, and runtime conditions are sufficiently controlled or recorded.

## Principle 8 -- Every change is a behavioral hypothesis


A model, prompt, retrieval, tool, policy, schema, validator, memory, or orchestration change implies an expected behavioral effect.

The hypothesis should specify:

```text
what should improve;
what should remain stable;
which slices may be affected;
which risks may increase;
which evidence will confirm the result.
```

## Principle 9 -- Behavioral blast radius exceeds edit scope


Regression coverage should follow semantic and operational dependencies, including shared prompts, policies, retrieval sources, tools, schemas, and downstream consumers.

## Principle 10 -- Evaluation must reflect the operating envelope


Quality measured under unrealistic latency, cost, evidence, tool availability, retry, or human-review conditions does not establish production quality.

## Principle 11 -- Observability determines diagnostic value


A failed case has greater engineering value when its effective scenario, intermediate artifacts, and causal path can be inspected.

# not really correct set

## Principle 1 — Behavioral claims require observed evidence


Claims about system correctness, reliability, or safety must be supported by tests of the integrated system. Code review and configuration checks alone are insufficient when behavior depends on a model, retrieval, tools, or runtime state.

**Example:**  
A support assistant has a correctly implemented escalation rule, but the generated summary sometimes omits the risk signal needed to trigger it. End-to-end evaluation is required to establish whether high-risk cases are actually escalated.

## Principle 2 — Every behavioral claim has a defined scope


State the tasks, users, scenarios, system version, runtime conditions, and acceptance criteria covered by the claim.

**Example:**  
Instead of saying, “The assistant is accurate,” say:

> Version 12 correctly classifies English-language account-security tickets from supported regions under the current policy and retrieval configuration.

The result does not establish performance for billing tickets, other languages, or later system versions.

## Principle 3 — Evaluate materially intended outcomes


Judge the behavior that matters to the task: the claim, decision, action, state change, or obligation. Ignore wording differences unless wording or format is itself part of the requirement.

**Example:**  
These two outputs are equivalent:

```text
Escalation is required because the customer reported an unauthorized login.

This case should be escalated due to evidence of account compromise.
```


These are materially different:

```text
Escalate the case.

No escalation is required.
```

## Principle 4 — Compare effective scenarios, not prompts alone


A meaningful comparison includes the visible input and the runtime context that influenced the result.

**Example:**  
The same question produces different answers before and after a retrieval-index update. This is not evidence of model instability until the retrieved documents, prompt version, model version, and policy configuration are compared.

## Principle 5 — Engineer comparability


Record or control the variables needed to interpret evaluation results. At minimum, version the system, evaluation dataset, acceptance criteria, runtime configuration, and evaluator.

**Example:**  
A regression report says accuracy fell from 91% to 84%. The comparison is not actionable if the team also changed the test set, grading rubric, model, and retrieval corpus without recording those changes separately.

## Principle 6 — Choose evidence that matches the risk


Use evaluation methods that expose the relevant failure mechanism.

**Examples:**

```text
Run-to-run variability
  → execute the same scenarios repeatedly.

Prompt sensitivity
  → test semantically equivalent phrasing.

Soft correctness
  → use task-specific criteria or human review.

Pipeline failures
  → capture retrieval, prompt, tool, and validator traces.

Agent behavior
  → inspect tool choice, arguments, recovery, and stopping.

Runtime drift
  → capture versions and replay the original context.

Feedback loops
  → inspect stored outputs and their later reuse.

Policy enforcement
  → test authorization, refusal, and confirmation paths.

Operational constraints
  → test with production latency, cost, and timeout limits.
```

## Principle 7 — One successful run does not establish reliability


A passing example shows that acceptable behavior is possible. Reliability requires repeated runs and coverage across representative and high-risk scenarios.

**Example:**  
A calendar agent successfully reschedules one meeting during a demo. Reliability also requires testing ambiguous meeting references, duplicate contact names, timezone differences, unavailable calendars, tool failures, and unauthorized changes.

## Principle 8 — Treat every material change as a behavioral hypothesis


For each change, state what should improve, what should remain stable, and how the effect will be measured.

**Example:**  
A prompt change is introduced to reduce unsupported legal claims.

The hypothesis is:

```text
Expected improvement:
  fewer unsupported claims in legal-answer scenarios.

Expected stability:
  no increase in refusals for supported questions.

Required evidence:
  grounding evaluation, refusal-rate comparison, and regression testing
  across adjacent compliance workflows.
```

## Principle 9 — Do not infer impact from edit size


A small implementation change can affect behavior across multiple tasks or workflows. Test shared dependencies and adjacent slices.

**Example:**  
Changing a shared system prompt to make responses more concise may also:

```text
remove important risk explanations;
reduce citation coverage;
truncate tool results;
change escalation summaries;
break downstream parsers expecting specific fields.
```


The regression scope should include every workflow using that prompt.

## Principle 10 — Evaluate under production constraints


Test the system with the latency, cost, tool availability, retries, context limits, and human-review capacity expected in operation.

**Example:**  
An agent achieves high task completion when allowed ten tool calls and three model retries. Production permits four tool calls and one retry. The production configuration must be evaluated separately.

## Principle 11 — Preserve enough context to diagnose failures


Capture the inputs, versions, intermediate results, decisions, and state changes required to reconstruct important failures.

**Example:**  
A support agent closes the wrong ticket. Diagnosis requires more than the final response. The trace should show:

```text
the user request;
resolved ticket identifier;
conversation state;
retrieved account records;
tool arguments;
authorization result;
ticket state before and after the action;
system and prompt versions.
```


Without this information, the team cannot determine whether the failure came from reference resolution, stale state, tool arguments, or authorization logic.

## Principle 12 — Use production observation to extend test evidence


Production monitoring should detect scenarios and operating conditions not adequately represented before release. Production does not replace pre-release evaluation.

**Example:**  
Offline evaluation covers typical customer-support tickets. Production monitoring later reveals that retrieval frequently fails for recently migrated accounts. Those cases should be investigated, added to the evaluation set, and covered by a fallback or release control.

## Principle 13 — Link controls to identified risks


Validators, approval gates, fallbacks, retries, human review, and monitoring should address a specific failure mode or impact risk.

**Example:**  
For an agent that sends customer refunds:

```text
Risk:
  incorrect refund amount or recipient.

Controls:
  deterministic amount validation;
  account-ownership check;
  confirmation above a defined threshold;
  idempotency protection;
  audit logging;
  human review for exceptional cases.
```


Each control should have a clear purpose and a test demonstrating that it works.
