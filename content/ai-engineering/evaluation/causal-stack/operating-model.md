---
draft: false
toc: true
title: "Operating Model"
linkTitle: "Operating Model"
---
Here is a more neutral version.

# Layer 1 -- Causal features


Layer 1 describes properties of the model or deployed system that shape behavior.

It is not a failure layer.

## Layer 1A -- Base model / inference mechanisms


Mechanisms of the model and inference process.

Examples:

```text
tokenization
finite context
attention-based context integration
in-band control/data representation
stateless invocation
autoregressive generation
token scoring
decoding
compute limits
```


Question:

> What about the model or inference process makes this behavior possible?

## Layer 1B -- Learned behavioral features


Stable learned behaviors that are not primitive architecture mechanisms.

Examples:

```text
task induction
in-context demonstration conditioning
prompt/interface sensitivity
plural valid-output space
assistant-style priors
generated confidence language
uneven competence across domains or formats
```


Question:

> What learned behavioral property shapes the output?

## Layer 1C -- System-level causal features


Properties that appear when the model is embedded in a deployed system.

Examples:

```text
external knowledge dependence
evidence-grounded generation requirements
compositional pipelines
agentic state-action loops
version/environment dependence
weak observability
policy/trust-boundary mediation
quality-cost-latency tradeoffs
```


Question:

> What system-level property shapes behavior?

# Layer 2 -- Behavioral fault modes


Layer 2 describes recurring behavioral failure patterns.

It does not describe root causes, missing controls, or impacts.

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


Question:

> What behavioral failure pattern occurred?

Example:

```text
Observed behavior:
  The system cites a nonexistent legal case.

Layer 2 faults:
  fabricated citation
  unsupported assertion
  weak confidence calibration
```

# Evaluation view


The evaluation view describes methods for detecting or measuring Layer 2 faults.

It is not itself a causal layer.

Examples:

```text
repeated-run testing
prompt perturbation testing
context ablation / insertion testing
grounding and citation evaluation
factuality evaluation
schema validation
semantic evaluation
agent trace evaluation
calibration evaluation
safety and policy testing
stress / budget testing
slice testing
regression testing
human-review rubric evaluation
production monitoring
```


Question:

> What test, oracle, trace, or measurement would reveal the fault?

Example:

```text
Layer 2 fault:
  prompt-form sensitivity

Evaluation method:
  prompt perturbation testing

Evaluation question:
  Do equivalent prompt variants preserve the same intended behavior?
```

# Layer 3 -- System controls and system faults


Layer 3 describes controls around Layer 2 faults, or failures of those controls.

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


Question:

> What did the system control, validate, monitor, recover from, or fail to control?

Example:

```text
Layer 2 fault:
  fabricated citation

Layer 3 fault:
  no citation validator
  no source-grounding requirement
```

# Layer 4 -- Impact


Layer 4 describes the consequence of a fault reaching the user, workflow, organization, or external system.

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


Question:

> What consequence did the failure produce?

Example:

```text
Layer 2 fault:
  wrong escalation decision

Layer 3 fault:
  no semantic validator for risk classification

Layer 4 impact:
  account-takeover case is not escalated
```

# Summary

```text
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
