---
draft: false
toc: true
title: "Empirical Nature"
linkTitle: "Empirical Nature"
---
# AI Systems Are Empirical Systems

## Purpose


This note defines a working principle for designing, evaluating, and reasoning about AI systems:

> AI systems are empirical systems.

So, AI-system quality cannot be fully inferred from code, prompts, model choice, architecture diagrams, or component specifications alone.

## Core claim


An AI system is empirical because its relevant behavior must be discovered, measured, and validated through observation under realistic conditions.

For deterministic software, we can often reason locally: "Given this input, this code path, and this state, the output should be exactly X". That form of reasoning still matters in AI systems. But it is insufficient by itself.

Once an LLM is embedded in a real product -- with prompts, retrieval, tools, policies, state, schemas, memory, runtime configuration, and production infrastructure -- the system's actual behavior has to be established through representative tests, repeated runs, perturbations, traces, regression checks, and production monitoring.

Conceptually:
> AI engineering requires implementation reasoning plus behavioral evidence.

So, calling an AI system empirical means the system's behavior must be observed and measured under the conditions in which it is expected to operate. But it does **not** mean the system is arbitrary or only testable in production. It means static reasoning is incomplete without behavioral validation.

## Why this is true


This follows from the system-level causal properties of AI applications: behavior can vary across runs and contexts, correctness is often soft and task-specific, knowledge is distributed across external sources, outputs may need evidence grounding, behavior emerges from pipelines and agents, environments drift, failures are weakly observable by default, and quality is constrained by cost and latency tradeoffs. I treat these as a AI-system-level causal features layer in the stack (see [Stack 1c Ai System Level Causal Features]({{< ref "ai-engineering/evaluation/causal-stack/stack-1c-ai-system-level-causal-features" >}})).

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


This supports the idea that **experimentation is not outside AI engineering**. It is the base layer because the only reliable way to improve an AI system is to run controlled experiments and measure what changes. See [Experimentation]({{< ref "ai-engineering/experimentation" >}}).

## Application: practical design questions


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
