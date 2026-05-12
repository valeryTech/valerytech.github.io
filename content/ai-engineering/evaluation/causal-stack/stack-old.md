---
draft: false
toc: true
title: "Stack Old"
linkTitle: "Stack Old"
---
## Recommended umbrella model


Use this chain:

Mechanism -> Constraint -> Failure Pattern -> Boundary -> Control -> Test/Monitor

Example:

Autoregressive decoding -> plausibility pressure -> unsupported claims -> unacceptable in legal/medical/finance -> retrieval + evidence policy + verifier -> citation integrity monitor

# causal stack


I would organize it as a **causal stack**, not just a list of issues.

The cleanest structure is:

```text
1. Inherent model properties
   ↓
2. System-level failure modes
   ↓
3. Delivery / product problems
   ↓
4. User-visible symptoms
   ↓
5. Business / operational impact
```


More concretely:

```text
Layer 1 — Inherent LLM properties
These are not “bugs” in the normal software sense. They are properties of LLM-based systems.

Examples:
- Non-determinism
- Probabilistic outputs
- Context sensitivity
- Prompt sensitivity
- Hallucination risk
- Latent reasoning errors
- Incomplete controllability
- Sensitivity to model/version changes
- Ambiguous confidence calibration
- Dependence on retrieval, tools, memory, or external context
```


Retrieval, tools, memory, and external context are not inherent LLM properties. They are compensating system components used because of inherent LLM limitations.

```text
Layer 2 — AI system failure modes
These are the technical problems that arise when those model properties interact with the surrounding system.

Examples:
- Output instability
- Inconsistent behavior across similar inputs
- Instruction-following drift
- Incorrect tool use
- Retrieval-grounding failures
- Context-window failures
- Poor fallback behavior
- Brittle prompt chains
- Evaluation blind spots
- Regression from model or prompt changes
- Safety / policy misclassification
```

```text
Layer 3 — Delivery and engineering problems
These are the problems the team experiences while trying to ship and operate the feature.

Examples:
- Hard-to-reproduce bugs
- Hard-to-debug failures
- Unclear ownership between model, prompt, retrieval, tools, and product logic
- Slow QA cycles
- Weak regression testing
- Difficult acceptance criteria
- Unstable demos
- High manual review burden
- Deployment risk
- Monitoring gaps
- Difficulty defining “done”
```

```text
Layer 4 — Product/user-visible symptoms
These are what users, customers, PMs, or support teams actually observe.

Examples:
- “It gives different answers every time”
- “Sometimes it ignores instructions”
- “It made something up”
- “It used the wrong source”
- “It failed on an obvious case”
- “It worked yesterday but not today”
- “It cannot explain why it did that”
- “It is good in demos but unreliable in production”
- “Users do not trust it”
```

```text
Layer 5 — Impact
This is why the symptoms matter.

Examples:
- Lower user trust
- Increased support tickets
- Increased manual review cost
- Compliance or legal risk
- Lower adoption
- Poor retention
- Slower delivery velocity
- Failed enterprise readiness
- Reduced confidence in AI roadmap
```


A useful diagram would look like this:

```text
LLM Properties
  Non-determinism
  Hallucination risk
  Context sensitivity
  Prompt sensitivity
        ↓
AI System Failure Modes
  Instability
  Grounding failures
  Tool-use errors
  Regression risk
        ↓
Delivery Problems
  Hard to test
  Hard to debug
  Hard to reproduce
  Hard to define acceptance criteria
        ↓
Symptoms
  Inconsistent answers
  Wrong citations
  Ignored instructions
  Works in demo, fails in production
        ↓
Impact
  Low trust
  High support cost
  Slower release cycle
  Business / compliance risk
```


I would also separate the analysis into **dimensions**, because not every issue fits one vertical chain.

A stronger framework:

|Dimension|Question it answers|Example|
|---|---|---|
|**Model behavior**|What does the LLM inherently do unpredictably?|Hallucination, variance, instruction drift|
|**System architecture**|Where does the surrounding system amplify the risk?|RAG, tools, routing, memory, prompt chains|
|**Evaluation**|Can we detect failures before release?|Weak test sets, no regression harness|
|**Observability**|Can we understand failures after release?|Missing traces, no prompt/tool logs|
|**Operations**|Can we safely run it in production?|Fallbacks, human review, rollback|
|**User experience**|How does failure appear to users?|Confusing answers, low trust|
|**Business risk**|What happens if this continues?|Churn, compliance exposure, cost|

The structure I would use in a document or presentation is:

```text
1. Core Thesis
LLM-based systems introduce probabilistic instability into product delivery. 
This instability propagates through architecture, testing, operations, and UX.

2. Root Properties of LLMs
Non-determinism, context sensitivity, hallucination, weak confidence calibration, etc.

3. System Failure Modes
How those properties appear inside AI systems: output variance, grounding errors, tool failures, regressions.

4. Delivery Failure Modes
How engineering/product teams experience the problem: unreproducible bugs, weak QA, unclear acceptance criteria.

5. User Symptoms
What customers see: inconsistency, wrong answers, lost trust.

6. Impact
Cost, adoption, compliance, release velocity.

7. Control Points
Where to intervene: architecture, evals, observability, guardrails, fallback design, human review.
```


The key distinction is this:

```text
LLM properties are causes.
AI system failure modes are mechanisms.
Delivery problems are team-level consequences.
Symptoms are user-visible manifestations.
Impact is business consequence.
```


For your wording, I would avoid saying only:

```text
LLMs are unstable and non-deterministic.
```


A sharper version:

```text
LLM-based features introduce probabilistic behavior, context sensitivity, and partial controllability into software systems. These properties create system-level failure modes such as output instability, grounding errors, tool-use mistakes, and regression risk. Those failure modes then surface as delivery problems: difficult testing, debugging, monitoring, and release governance. Users experience the downstream symptoms as inconsistent answers, hallucinations, ignored instructions, and reduced trust.
```


A compact taxonomy:

```text
Root causes:
- Non-determinism
- Context sensitivity
- Knowledge uncertainty
- Prompt brittleness
- Tool/RAG dependency

System failures:
- Instability
- Hallucination
- Misgrounding
- Tool misuse
- Regression

Delivery failures:
- Hard to reproduce
- Hard to test
- Hard to monitor
- Hard to certify
- Hard to safely release

Symptoms:
- Inconsistent outputs
- Wrong answers
- Missing citations
- Broken workflows
- Low user trust

Impacts:
- Slower delivery
- Higher cost
- Lower adoption
- Higher risk
```


My recommended top-level model:

```text
Properties → Failure Modes → Delivery Friction → User Symptoms → Business Impact
```


That gives you a clear causal story and avoids mixing root causes, engineering issues, and symptoms into the same bucket.
