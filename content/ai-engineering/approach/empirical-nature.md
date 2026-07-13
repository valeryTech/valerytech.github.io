---
draft: false
toc: true
title: "Empirical Nature"
linkTitle: "Empirical Nature"
---
# AI Systems Require Behavioral Evidence


This note defines a working principle for designing, evaluating, and operating AI systems.

## Short


An AI system’s behavior is implemented by its complete runtime composition, including model weights, prompts, code, data, tools, policies, and state. However, much of the model’s behavior is encoded implicitly in learned parameters rather than expressed as an inspectable specification. Consequently, engineers can execute the system to observe particular outputs, but they cannot generally derive its product-level behavior across an operational distribution through implementation inspection or local component reasoning alone. Those properties must be established empirically.

## Core claim


There are two common errors:
1. Treating AI behavior as arbitrary or inexplicable.
2. Treating architectural and implementation correctness as sufficient evidence of product-level quality.

AI-system quality is an empirical property. This does not mean that AI behavior is arbitrary, that implementation reasoning is unimportant, or that quality can only be tested in production.

The behavior cannot be fully inferred from code, prompts, model choice, architecture diagrams, or component specifications alone. And the behavior is implemented by the system, but it is not fully specified in a human-legible or compositionally predictable form.

An AI system is empirical because its relevant behavior must be discovered, measured, and validated through observation under realistic conditions.

Conceptually:
> AI engineering requires implementation reasoning **plus** behavioral evidence.

So, calling an AI system empirical means the system's behavior must be observed and measured under the conditions in which it is expected to operate. But it does **not** mean the system is arbitrary or only testable in production. It means static reasoning is incomplete without behavioral validation.

## Why this is true

### Implementation does not amount to behavioral specification


In conventional software, important behavior is often expressed relatively directly through human-written control flow, constraints, types, and specifications. In AI systems, much of the relevant behavior is induced by learned parameters, training data, prompts, context, retrieval results, tool outputs, sampling choices, and interactions between components.

The system still implements the behavior in a causal sense. However, that behavior is usually not represented in a form from which engineers can compositionally derive answers to questions such as:

- How often will the system answer correctly?
- Which classes of input will cause hallucinations?
- How robust is it to ambiguous or adversarial input?
- Will improvements on one task degrade another?
- How will model behavior interact with retrieval, tools, memory, and user behavior?

This makes behavioral observation necessary.

This follows from the system-level causal properties of AI applications: behavior can vary across runs and contexts, correctness is often soft and task-specific, knowledge is distributed across external sources, outputs may need evidence grounding, behavior emerges from pipelines and agents, environments drift, failures are weakly observable by default, and quality is constrained by cost and latency tradeoffs. I treat these as a AI-system-level causal features layer in the stack (see [Layer 1c Ai System Causal Features]({{< ref "ai-engineering/causal-stack/layer-1c-ai-system-causal-features" >}})).

### Why compositional reasoning breaks down


In conventional software, components often expose explicit semantics:

```
validated input
+ known algorithm
+ explicit branch conditions
→ predictable result
```


With a learned model, the component semantics are largely implicit:

```
input
+ billions of learned parameters
+ context
→ behavior discovered through execution
```


Even if every surrounding component is understood, the model’s contribution cannot usually be summarized as a stable, complete contract such as:

```
For every supported input satisfying P, the model will produce an output satisfying Q.
```


That contract has to be investigated empirically.

The same problem occurs at the composed-system level. Knowing the isolated properties of retrieval, prompting, generation, and validation does not fully determine how they interact across the operational distribution.

## Engineering consequences


The core engineering challenge extends beyond strict implementation. We must also ask:

> Does the implemented system behave acceptably across the scenarios, inputs, users, data states, versions, and operational constraints that matter?

The evaluation has to be a part of an engineering loop. It's not simply `design -> implement -> ship `

The reframed engineering loop should be closer to:

```text
design
→ implement
→ instrument
→ evaluate
→ compare variants
→ inspect failures
→ revise
→ regression test
→ monitor
→ repeat
```

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
A system design is incomplete unless it specifies how behavior will be observed, measured, and improved.
{{< /callout >}}


This includes:

- what behavior should be preserved;
- what variation is acceptable;
- what outputs are materially wrong;
- what evidence should constrain answers;
- what traces are needed for debugging;
- what slices must be evaluated;
- what regressions must be blocked;
- what cost and latency envelope is acceptable.

This behavioral specification is a part of evaluation harness subsystem delivery. Several practices will be described in evaluation delivery framework.

Engineering rule:

> Do not treat an AI system as reliable until its intended behavior has been measured under the conditions in which it is expected to operate.

## Execution is not the same as inspection


For a particular input, an exact output can be obtained by executing a deterministic model configuration. That does not mean the output—or broader properties of the system—can be feasibly derived by inspecting the code and weights.

This gives three different levels:

1. **Encoded:** Behavior is implemented in the complete system state, including model weights.
2. **Executable:** Particular behavior can be observed by running the system on a particular input.
3. **Predictable:** General behavioral properties can be inferred without sampling representative executions.

AI systems generally satisfy the first two. The third is limited.

## Common anti-patterns

### One successful demo as proof


A demo shows that the system worked once. It does not establish reliability.

Better:

> Test repeated runs, paraphrases, edge cases, and task slices.

### Exact-match evaluation for soft tasks


Many valid AI outputs will not match a reference string exactly.

Better:

> Evaluate against task-specific acceptance criteria.

### Treating model upgrades as automatically beneficial


A better model on general benchmarks may perform worse in a specific product workflow.

Better:

> Run product-specific regression tests before model, prompt, retrieval, policy, or tool changes.

### Treating hallucination as only a model problem


Unsupported claims may result from retrieval gaps, stale sources, bad chunking, weak grounding instructions, missing abstention behavior, or source-priority confusion.

Better:

> Evaluate the full evidence path: source data -> retrieval -> prompt assembly -> generation -> citation.

### Ignoring operational constraints


A system that is accurate only when it is too slow, too expensive, or too dependent on human review may not satisfy the product requirement.

Better:

> Evaluate quality under the actual operational envelope.

## References and Connections


This supports the idea that **experimentation is not outside AI engineering**. It is the base layer because the only reliable way to improve an AI system is to run controlled experiments and measure what changes. See [Experimentation]({{< ref "ai-engineering/approach/experimentation" >}}).

## Application (WIP): practical design questions


Use these questions during design reviews, eval planning, release decisions, and incident analysis.

### Behavior


What is the materially intended outcome?

The important unit is the behavior that matters for the task:

- final answer;
- classification;
- escalation decision;
- refusal or compliance;
- tool call;
- citation choice;
- state transition;
- external action.

Ask:

- Does the system preserve the intended outcome across repeated runs?
- Does it preserve the intended outcome under reasonable paraphrases?
- Which differences are harmless wording changes?
- Which differences change the decision, claim, action, or risk profile?

### Correctness


Many AI tasks do not have a single exact correct output.

Ask:

- What does "correct" mean for this task?
- Is correctness binary, graded, or multidimensional?
- Which criteria matter: factuality, completeness, relevance, grounding, policy compliance, tone, formatting, action safety?
- Which failures are tolerable?
- Which failures are release-blocking?

Do not rely only on exact-match testing for tasks with soft correctness.

### Knowledge and grounding


AI systems often depend on knowledge outside the base model.

Ask:

- Which sources are authoritative?
- What happens if retrieval misses the key source?
- What happens if retrieved evidence is stale, incomplete, or conflicting?
- Are claims required to be traceable to evidence?
- Should the system abstain when evidence is insufficient?
- Can we distinguish a retrieval failure from a generation failure?

A plausible answer is not enough when the product requires grounded behavior.

### Pipeline behavior


Most AI systems are not a single model call. They are pipelines or graphs.

A typical system may include:

```text
input handling
→ routing
→ retrieval
→ ranking
→ prompt assembly
→ model generation
→ tool use
→ validation
→ policy checks
→ parsing
→ final response or action
```


Ask:

- Which components influence the final behavior?
- Are intermediate stages observable?
- Can we inspect retrieved documents, prompts, tool calls, parser outputs, and policy decisions?
- Are we evaluating only the final answer, or also the process that produced it?

Final-output evaluation alone is usually insufficient for debugging.

### Versioning and regressions


The visible user request may stay the same while the effective runtime scenario changes.

Ask:

- Which model version was used?
- Which prompt version?
- Which retrieval index?
- Which embedding model?
- Which policy version?
- Which tool schema?
- Which source documents?
- Which runtime configuration?

Without version capture, regression analysis is weak.

A model upgrade, prompt edit, policy change, retrieval-index refresh, or tool-schema update can improve one slice and degrade another.

### Observability


AI systems are weakly observable by default.

A bad final answer may be caused by:

- missing context;
- bad retrieval;
- poor ranking;
- prompt assembly error;
- model misuse of evidence;
- parser failure;
- tool error;
- policy-layer intervention;
- timeout fallback;
- state contamination.

Ask:

- What trace is needed to debug a failure?
- Are retrieved documents and scores stored?
- Are tool calls and outputs stored?
- Are prompts and runtime parameters captured?
- Are policy checks and validator decisions visible?
- Can failures be attributed to a component?

If the system cannot be inspected, it cannot be reliably improved.

### Operations


Quality is constrained by cost, latency, reliability, and risk.

Ask:

- What latency is acceptable?
- What cost per task is acceptable?
- Which verification steps are worth the extra cost?
- Which cases require retries?
- Which cases require human review?
- Which actions require explicit confirmation?
- Does the eval environment reflect production constraints?

A design that works only with unlimited latency, unlimited cost, or constant human review is not yet a deployable design.
