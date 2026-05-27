---
draft: false
toc: true
title: "Operating Model"
linkTitle: "Operating Model"
---
# Causal Stack Operating Model


This document is the top-level bridge for the causal stack. It explains how interface properties, model and system features, behavioral faults, evaluation methods, operational controls, and impacts fit together.

It does not replace the layer-specific documents. Its job is to make the causal flow legible from `Layer 0` through `Layer 4`.

```text
Layer 0
  -> the communication substrate and its irreducible properties

Layer 1
  -> the model and system features that shape behavior

Layer 2
  -> the recurring behavioral fault modes those features can produce

Evaluation view
  -> the methods used to reveal, measure, and compare those faults

Layer 3
  -> the controls used to prevent, detect, recover from, or govern those faults

Layer 4
  -> the real-world impact when faults escape into users, workflows, or external systems
```

## Layer 0 -- The Interface Layer


Layer 0 defines the immutable properties of the communication medium used to control and interact with the AI system. In LLM-based systems, that medium is natural language.

Natural language is not a degraded programming language or a loose API payload. It is a different communicative system whose meaning is distributed across:

- indeterminacy of meaning;
- context dependence;
- pragmatic meaning and speaker intent;
- discourse and conversational structure;
- social and communicative framing.

These are irreducible interface conditions, not product defects. A deployed AI system cannot assume that users will speak in fully explicit, context-free, schema-complete commands. Downstream layers therefore exist partly to accommodate ambiguity, underspecification, reference resolution, pragmatic intent, turn history, and social framing rather than trying to engineer them away.

For the detailed Layer 0 taxonomy, see [stack-0-protocol.md]({{< ref "ai-engineering/evaluation/causal-stack/stack-0-protocol" >}}).

## Layer 1 -- Causal features


Layer 1 describes stable properties of the model or deployed system that shape behavior.

It is not a failure layer. It answers:

> What about the model or deployed system makes this behavior possible?

### Layer 1A -- Base model / inference mechanisms


Layer 1A covers primitive mechanisms of the model and inference process.

Examples:

```text
tokenization
static parametric prior
finite ordered context interface
attention-based context integration
in-band control/data representation
stateless invocation
autoregressive generation
distributional token scoring
decoding path selection
compute limits
```


These mechanisms explain how the model processes token sequences at all. They are the lowest causal layer inside the stack.

### Layer 1B -- Learned or behavioral LLM features


Layer 1B covers stable learned behaviors that are not primitive architectural mechanisms.

Examples:

```text
learned natural-language task induction
in-context demonstration conditioning
natural-language interface sensitivity
plural valid-output space
assistant-style interaction priors
generated confidence language
uneven competence across domains or formats
```


Layer 0 leads directly into Layer 1B. Because natural-language inputs are ambiguous, context-sensitive, pragmatic, and discourse-dependent, the model must rely on learned priors to infer what task is being requested, which references are salient, what is implied, and how the next turn should behave.

### Layer 1C -- AI-system-level causal features


Layer 1C covers properties that appear when the model is embedded inside a real system.

Examples:

```text
behavioral outcome variability
soft correctness surfaces
external knowledge dependence
evidence-grounded generation requirements
compositional pipelines
agentic state-action loops
environment and version dependence
weak native observability
policy/trust-boundary mediation
quality-cost-latency tradeoffs
```


Layer 0 also drives Layer 1C. Because natural-language requests are often underspecified, context-sensitive, and interactional, deployed systems need retrieval, state, grounding, orchestration, validation, authorization, and recovery layers around the model.

Deployed AI systems also have an empirical operating character. Behavior is shaped by soft correctness, scenario-level variability, mutable context and environment conditions, and limited native observability. That means quality cannot be inferred from implementation structure alone; it has to be established by observing behavior under representative conditions.

Change effects are also not reliably local. A prompt, retrieval, schema, tool, policy, or model update may improve the touched case while degrading adjacent slices or seemingly unrelated workflows, so quality has to be proven across representative scenario coverage rather than only on the edited example.

Taken together, Layer 1 explains why recurring behavioral fault classes are possible.

## Layer 2 -- Behavioral fault modes


Layer 2 describes recurring behavioral failure patterns.

It does not describe root causes, missing controls, or impacts. It answers:

> What behavioral failure pattern occurred?

Examples:

```text
context omission
context underutilization
source authority confusion
task misinduction
control/data confusion
unsupported assertion
fabricated citation
weak confidence calibration
output-format drift
semantic error in structured output
tool-selection error
tool-argument error
recovery failure
```


Layer 2 is where Layer 1 features become operationally visible as faults. The same underlying features may produce different fault families depending on task, context, tooling, data conditions, and runtime state.

Example:

```text
Observed behavior:
  The system cites a nonexistent legal case.

Layer 2 faults:
  fabricated citation
  unsupported assertion
  weak confidence calibration
```

## Evaluation view


The evaluation view describes methods for detecting, measuring, reproducing, or comparing Layer 2 faults.

It is not itself a causal layer. It answers:

> What test, oracle, trace, or measurement would reveal the fault?

Because the system is empirical, evaluation is the mechanism by which behavior is revealed, compared, and validated. It is how teams determine whether intended behavior actually holds across repeated runs, prompt variants, context changes, product slices, and runtime conditions.

Examples:

```text
repeated-run testing
prompt perturbation testing
context ablation / insertion testing
grounding and citation evaluation
factuality evaluation
schema validation
reasoning / process evaluation
agent trace evaluation
calibration evaluation
safety and policy testing
stress / budget testing
slice testing
regression testing
human-review rubric evaluation
production monitoring
```


Evaluation sits between Layer 2 and Layer 3. It does not fix faults by itself, but it provides the evidence that operational controls must act on.

Example:

```text
Layer 2 fault:
  prompt-form sensitivity

Evaluation method:
  prompt perturbation testing

Evaluation question:
  Do semantically equivalent prompt variants preserve the same intended behavior?
```

## Layer 3 -- System controls and system faults


Layer 3 describes the controls placed around Layer 2 faults, or failures of those controls.

It answers:

> What did the surrounding system prevent, validate, monitor, recover from, or fail to control?

Because Layer 0 properties are irreducible and Layer 1 behavior is empirical, Layer 3 is where measured behavior becomes operational discipline. Release gates, regression suites, monitoring, tracing, confirmation flows, validators, and escalation paths are the mechanisms teams use to prove that behavior is acceptable and to detect when it is no longer acceptable.

Examples of controls:

```text
task contracts
prompt templates
retrieval filters
source authority metadata
context assembly rules
instruction/data isolation
schema validators
semantic validators
claim-source checks
citation validation
tool-argument validation
authorization gates
fallbacks
retry logic
human escalation
trace logging
runtime monitors
release gates
regression suites
```


Examples of system faults:

```text
no retrieval completeness check
no source-priority rule
untrusted text inserted without isolation
schema validation checks syntax only
no semantic validation
tool calls executed without argument validation
no fallback when evidence is missing
no regression gate for prompt/model changes
no trace capture for retrieval and tool calls
```


Example:

```text
Layer 2 fault:
  fabricated citation

Layer 3 fault:
  no citation validator
  no source-grounding requirement
```

## Layer 4 -- Impact


Layer 4 describes the consequence of a fault reaching the user, workflow, organization, or external system.

It answers:

> What consequence did the failure produce?

Layer 4 is what happens when Layer 2 faults are not prevented, detected, or recovered from by Layer 3 controls.

Examples:

```text
user receives false information
private data is exposed
wrong record is updated
unsafe action is taken
customer is not escalated
compliance obligation is missed
manual review burden increases
product reliability degrades
business workflow fails
```


Example:

```text
Layer 2 fault:
  wrong escalation decision

Layer 3 fault:
  no semantic validator for risk classification

Layer 4 impact:
  account-takeover case is not escalated
```

## Compact causal example

```text
User request:
  "Move it to tomorrow and let Sarah know."

Layer 0:
  "it" depends on discourse context
  "tomorrow" depends on temporal reference and timezone
  the request presupposes shared task state and social intent

Layer 1B:
  the model must infer the intended task, salient referents, and action structure

Layer 1C:
  the system may need calendar state, contact resolution, tool calls,
  authorization checks, and tool-argument validation

Layer 2 fault:
  referent confusion or tool-argument error

Evaluation view:
  conversation replay, prompt perturbation, and agent trace evaluation

Layer 3 control:
  entity-resolution confirmation, argument validation, trace logging

Layer 4 impact:
  the wrong meeting is rescheduled or the wrong person is notified
```

## Summary

```text
Layer 0:
  interface substrate
  why inputs are ambiguous, contextual, pragmatic, discourse-shaped, and socially framed

Layer 1:
  causal features
  why behavior is possible

Layer 2:
  behavioral fault modes
  what went wrong behaviorally

Evaluation view:
  detection and measurement methods
  how the fault is observed

Layer 3:
  system controls and control failures
  what the surrounding system did or failed to do

Layer 4:
  impact
  consequence in the user, business, safety, compliance, or operational context
```
