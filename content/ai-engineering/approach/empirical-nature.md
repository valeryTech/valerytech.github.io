---
draft: false
toc: true
title: "Empirical Nature"
linkTitle: "Empirical Nature"
---
# AI Systems Require Behavioral Evidence


This note defines a working principle for designing, evaluating, and operating AI systems.

## Short


An AI system’s behavior is implemented by its complete runtime composition, including model weights, prompts, code, data, tools, policies, and state.

Much of the behavior contributed by learned components is encoded implicitly rather than expressed as a human-legible behavioral specification. Engineers can execute the system and observe particular outputs, but they generally cannot derive its product-level behavior across an operational distribution through implementation inspection or local component reasoning alone.

Consequently, AI-system quality must be supported by behavioral evidence.

Here, **quality** is used in the broad product sense: whether the system satisfies user needs, jobs to be done, product requirements, safety constraints, and operational expectations.

## Core claim


There are two common errors:

1. Treating AI behavior as arbitrary or inexplicable.
2. Treating architectural and implementation correctness as sufficient evidence of product-level quality.

AI-system quality is an empirical property. This does not mean that AI behavior is arbitrary, that implementation reasoning is unimportant, or that quality can only be tested in production. An AI system is empirical because its relevant behavior must be discovered, measured, and validated through observation under realistic conditions.

There are risks conflating three different claims:

1. Actual system behavior is a property of the implemented system (including weights).
2. Engineers often need empirical methods to learn that behavior.
3. Confidence that requirements are satisfied **must be supported** by empirical evidence.

The behavior cannot be fully inferred from code, prompts, model choice, architecture diagrams, or component specifications alone. And the behavior is implemented by the system, but it is not fully specified in a human-legible or compositionally predictable form.

Conceptually:
> AI engineering requires implementation reasoning **plus** behavioral evidence.

So, calling an AI system empirical means the system's behavior must be observed and measured under the conditions in which it is expected to operate. But it does **not** mean the system is arbitrary or only testable in production. It means static reasoning is incomplete without behavioral validation.

## Why behavioral evidence is necessary

### Implementation does not amount to behavioral specification


In conventional software, important behavior is often expressed relatively directly through human-written control flow, constraints, types, and specifications.

Complex conventional systems also require integration testing, load testing, fault injection, and production observation. AI systems intensify this systems-engineering problem because learned components have implicit semantics, inputs are open-ended, correctness is often task-specific, and behavior depends heavily on context and external state.

Relevant behavior may be influenced by:

- learned parameters and training data;
- prompts and conversation context;
- retrieved documents and ranking;
- tool outputs and external APIs;
- sampling and decoding choices;
- policies, validators, and fallback paths;
- memory and runtime state;
- interactions between components;
- user behavior and environmental drift.

The system still implements the behavior in a causal sense. However, that behavior is usually not represented in a form from which engineers can compositionally derive answers to questions such as:

- How often will the system answer correctly?
- Which classes of input will cause hallucinations?
- How robust is it to ambiguous or adversarial input?
- Will improvements on one task degrade another?
- How will model behavior interact with retrieval, tools, memory, and user behavior?

This makes behavioral observation necessary.

This follows from the system-level causal properties of AI applications: behavior can vary across runs and contexts, correctness is often soft and task-specific, knowledge is distributed across external sources, outputs may need evidence grounding, behavior emerges from pipelines and agents, environments drift, failures are weakly observable by default, and quality is constrained by cost and latency tradeoffs. I treat these as a AI-system-level causal features layer in the stack (see [Layer 1c Ai System Causal Features]({{< ref "ai-engineering/causal-stack/layer-1c-ai-system-causal-features" >}})).

### Compositional reasoning is limited


In conventional software, components often expose explicit semantics:

```
validated input
+ known algorithm
+ explicit branch conditions
→ predictable result
```


With a learned model, the component semantics are largely implicit:

```text
input
+ learned parameters
+ context
+ runtime configuration
→ behavior observed through execution
```


Even if every surrounding component is understood, the model's contribution cannot usually be summarized as a stable, complete contract such as:

```
For every supported input satisfying P, the model will produce an output satisfying Q.
```


That contract has to be investigated empirically.

The same problem occurs at the composed-system level. Knowing the isolated properties of retrieval, prompting, generation, and validation does not fully determine how they interact across the operational distribution.

## Engineering consequences


The engineering challenge extends beyond implementation correctness. It also requires asking:

> Does the implemented system behave acceptably across the scenarios, users, inputs, data states, versions, and operational constraints that matter?

The delivery loop is therefore closer to:

```text
define requirements
→ design
→ implement
→ instrument
→ evaluate
→ compare variants
→ inspect failures
→ revise
→ regression test
→ release or restrict
→ monitor
→ repeat
```

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
A system design is incomplete unless it specifies how behavior will be observed, measured, assessed, and improved.
{{< /callout >}}


This includes:

- which user needs and jobs to be done the system must support;
- what behavior should be preserved;
- what variation is acceptable;
- what outcomes are materially wrong;
- what evidence should constrain answers and actions;
- what traces are required for debugging;
- what scenarios and slices matter;
- what regressions must block release;
- what cost, latency, and reliability envelope is acceptable;
- which failures require restriction, human review, or rollback.

Detailed evaluation methodology--including statistical treatment, dataset governance, evaluator calibration, and monitoring design--belongs in the evaluation framework. This note establishes why behavioral evidence is necessary and how it relates to implementation assurance and operational decisions.

Engineering rule:

> Do not treat an AI system as reliable until its intended behavior has been measured under the conditions in which it is expected to operate.

## References and Connections


This supports the idea that **experimentation is not outside AI engineering**. It is the base layer because the only reliable way to improve an AI system is to run controlled experiments and measure what changes. See [Experimentation]({{< ref "ai-engineering/approach/experimentation" >}}).

## Assurance chain


A useful engineering model connects five concepts:

| Concept | Meaning |
|---|---|
| **Product or behavioral requirement** | A scoped statement of the user need, job to be done, intended outcome, relevant conditions, acceptance criteria, and operating constraints. |
| **Implementation assurance** | Evidence that explicit mechanisms, controls, interfaces, and deterministic invariants are correctly designed and implemented. |
| **Behavioral evidence** | Observations of integrated-system behavior under relevant scenarios, including evaluations, experiments, traces, replays, and production observations. |
| **Assurance assessment** | An interpretation of implementation assurance and behavioral evidence against the requirement, including coverage, uncertainty, limitations, failure severity, and residual risk. |
| **Operational decision** | A decision to release, restrict, mitigate, monitor, escalate, roll back, or gather more evidence based on the assessment and the organization's risk tolerance. |

The resulting chain is:

> The requirement defines what must be true. Implementation assurance establishes explicit mechanisms and safeguards. Behavioral evidence measures integrated-system performance. The assessment determines what the combined evidence supports. The operational decision defines what the organization is prepared to release and under which controls.

Behavioral evidence is necessarily scoped. It supports claims about the evaluated system, population, scenarios, configuration, and time period. Its strength depends on representative coverage, data and label quality, sample size, and uncertainty. Those concerns should be handled explicitly in the evaluation methodology rather than hidden behind a single score.

## Example: account-compromise escalation


Consider an AI support assistant that identifies possible account compromise and decides whether to escalate a ticket.

### Product and behavioral requirement


For English-language account-security tickets from supported regions:

- compromise recall must be at least 97% overall;
- compromise recall must be at least 97% for each designated critical slice, including explicit and indirect reports;
- the false-positive escalation rate must remain below 5% of confirmed non-compromise cases;
- a ticket classified as compromised must never be passed to the automatic close-ticket operation;
- processing must complete within 8 seconds at p95 under the production configuration.

The rates are defined as:

```text
compromise recall =
  escalated confirmed-compromise cases / all confirmed-compromise cases

false-positive escalation rate =
  escalated confirmed non-compromise cases / all confirmed non-compromise cases
```

### Implementation assurance


Code review and deterministic tests establish that:

```text
A ticket classified as compromised cannot invoke the close-ticket function.
Escalation calls require a valid account identifier.
The escalation API enforces authorization and idempotency.
Tool arguments must satisfy the API schema.
Model, prompt, policy, routing, and tool versions are recorded.
```


This supports mechanism-level claims. It does not establish how often the model recognizes an indirect account-compromise report.

### Behavioral evidence


On 1,200 representative evaluation cases, the integrated system produced:

```text
overall compromise recall:          98.1%
false-positive escalation rate:      4.3%
explicit-report recall:             99.2%
indirect-report recall:             92.4%
p95 latency:                         7.4 s
genuine compromise cases
automatically closed:             0 observed
```


The aggregate results satisfy the overall recall, false-positive, and latency thresholds. The indirect-report slice fails its designated 97% threshold.

No genuine compromise case was automatically closed in the evaluated sample. This is behavioral evidence, not proof of a zero end-to-end failure rate. The stronger but narrower claim comes from implementation assurance: cases already classified as compromised cannot reach the closing function.

Evaluation reports should include the applicable uncertainty and sample composition. Those details are omitted here for brevity.

### Assurance assessment


The system satisfies the aggregate recall, false-positive, latency, and deterministic post-classification closure requirements. It does not satisfy the recall requirement for indirect compromise reports.

The evidence applies to the assessed configuration and evaluated population. It does not establish equivalent performance for other languages, unsupported regions, future component versions, different traffic distributions, or materially different tool and data states.

Residual risk is concentrated in ambiguous and indirect reports. A genuine compromise case may also reach an unsafe downstream path if the model fails to identify it, despite the deterministic post-classification safeguard.

### Operational decision

```text
release:
  explicit account-compromise scenarios

restrict:
  indirect, ambiguous, and low-confidence scenarios

control:
  route restricted scenarios to human review
  prohibit automatic closure for account-security tickets

monitor:
  escalation outcomes by designated scenario slice
  closure outcomes for confirmed compromise cases

improve:
  add indirect-language failures to the regression dataset

revalidate:
  reassess before expanding autonomous handling
```


The decision follows from the evidence: release the supported scope, restrict the failed slice, preserve hard controls, and gather stronger evidence before expansion.

## Practical design questions


Use these questions during product definition, design reviews, evaluation planning, release decisions, and incident analysis.

### User need and intended behavior


- What user need or job to be done must the system satisfy?
- What is the materially successful outcome?
- Which users, scenarios, and data states are inside the supported scope?
- Which variations are harmless, and which change the decision, claim, action, or risk profile?

The relevant unit may be a final answer, completed task, classification, escalation, refusal, tool call, citation, state transition, or external action.

### Correctness and acceptance


- What does "correct" mean for this task?
- Is correctness binary, graded, or multidimensional?
- Which criteria matter: factuality, completeness, relevance, grounding, policy compliance, usefulness, formatting, or action safety?
- Which failures are tolerable, and which are release-blocking?
- Which requirements can be enforced deterministically, and which require behavioral evidence?

### Knowledge and grounding


- Which sources are authoritative?
- What happens if retrieval misses the key source?
- What happens if evidence is stale, incomplete, or conflicting?
- Must claims be traceable to evidence?
- Should the system abstain when evidence is insufficient?
- Can retrieval failures be distinguished from generation failures?

A plausible answer is insufficient when the product requires grounded behavior.

### Pipeline behavior and observability


A typical AI system may include:

```text
input handling
→ routing
→ retrieval
→ ranking
→ prompt assembly
→ generation
→ tool use
→ validation
→ policy checks
→ parsing
→ final response or action
```


Ask:

- Which components influence the final behavior?
- Which invariants can be guaranteed by code or policy?
- Can retrieved documents, prompts, tool calls, parser outputs, and policy decisions be inspected?
- Can failures be attributed to a component?
- Are traces handled with appropriate privacy, security, and retention controls?

Final-output evaluation alone is usually insufficient for diagnosis.

### Versioning and regressions


Capture the versions of:

- models and prompts;
- retrieval indexes, embeddings, and rankers;
- policies and validators;
- tool schemas and source documents;
- runtime configuration.

A change to any of these can improve one slice and degrade another. Without version capture, behavioral claims and regression analysis are weak.

### Action safety and operations


- Which actions are irreversible or high impact?
- Which actions require explicit confirmation or human review?
- Are permissions least-privilege and operations allowlisted?
- Are retries bounded and idempotent?
- Are cost, latency, availability, and reliability constraints represented in evaluation?
- Which production signals trigger investigation, restriction, or rollback?

Behavioral reliability should not be the only barrier protecting an irreversible action.
