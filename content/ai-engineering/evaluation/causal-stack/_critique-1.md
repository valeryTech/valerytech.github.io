---
draft: false
toc: true
title: "Critique 1"
linkTitle: "Critique 1"
---
From an **AI Systems Engineering** perspective, the framework is strong. It is not merely a taxonomy of "LLM problems"; it is becoming a full **causal-to-operational engineering framework**:

```text
causal features
→ behavioral fault modes
→ evaluation methods
→ system controls / system faults
→ operational or user impact
```


That is the right direction.

## My overall verdict


The framework is **architecturally valuable** because it separates five things that teams often confuse:

|Question|Correct layer / view|
|---|---|
|Why is this behavior possible?|Layer 1A / 1B / 1C|
|What behavioral fault appeared?|Layer 2|
|How do we detect or measure it?|Evaluation-method view|
|What should the system do to prevent, bound, recover, or govern it?|Layer 3|
|Why does it matter?|Layer 4 / impact layer|

This is the core strength. Layer 1C explicitly covers deployed AI-system causal surfaces such as retrieval, tools, state, policy controls, observability, versioning, and resource tradeoffs, rather than treating the model call as the whole system. Layer 2 then names recurring behavioral failure patterns rather than root causes or controls. Layer 3 translates those behavioral tendencies into architecture responsibility: what the surrounding system provided, validated, constrained, monitored, recovered from, or failed to control.

So the framework is conceptually sound.

The main critique: it now needs **stricter governance of layer boundaries, naming, and artifacts**, otherwise it may become too complex for engineers to apply consistently.

# 1. What is strongest

## 1. The causal chain is correct


The most useful chain is:

```text
Layer 1: causal feature
Layer 2: behavioral fault mode
Evaluation view: how to reveal it
Layer 3: system control or system fault
Layer 4: impact
```


That is exactly how production AI incident analysis should work.

Example:

```text
A5 in-band control/data
+ B1 task induction
→ control/data confusion
→ retrieved text was not isolated
→ prompt injection reaches user or tool
```


This prevents teams from saying only "the model got tricked." It forces the engineering question: **what system boundary failed?**

## 2. Layer 2 is well-positioned


Layer 2 correctly answers:

> What recurring behavioral failure pattern appeared?

It explicitly does **not** answer which component failed, who was harmed, which business metric moved, or which guardrail was missing. That is important because a single observed incident can map to multiple atomic faults and multiple families.

This is good engineering taxonomy design. For example, "hallucination" becomes too coarse. The actual incident might include:

```text
unsupported assertion
plausibility-truth gap
fabricated citation
weak confidence calibration
evidence-claim mismatch
```


That gives evaluators and architects something concrete to test and control.

## 3. The evaluation view is highly practical


The evaluation mapping is one of the best parts. It says evaluations should judge behavior, not surface text alone; should use task-specific quality criteria; should prefer repeatable scenarios over one-off demos; should separate retrieval quality from generation quality; and should evaluate intermediate process for agents, RAG, tools, and high-stakes decisions.

That directly addresses common AI evaluation failures:

```text
one demo = reliability
exact match = correctness
truth = grounding
valid JSON = semantically correct
final answer = process success
aggregate score = safe deployment
```


The framework rejects all of those.

## 4. Layer 3 turns the taxonomy into engineering work


Layer 3 is where the framework becomes actionable. It defines system controls as mechanisms that prevent, detect, constrain, recover from, monitor, or provide evidence about Layer 2 faults. It also defines system faults as missing, weak, stale, bypassed, or inadequate controls.

That is the correct engineering framing:

```text
Layer 2:
  unsupported assertion

Layer 3 fault:
  no claim-source support check

Layer 3 control:
  citation validator, grounding gate, abstention rule, source whitelist
```


The control-family document is also useful because it groups controls around real architectural boundaries: interface/contract, knowledge/grounding, state/process/action, policy/reliability/envelope, and cross-cutting observability/governance.

## 5. The worked examples make the framework usable


The examples are important because they demonstrate multi-label diagnosis. For example, a tool returning `403 Forbidden`while the assistant reports success is not just "tool failure"; it involves context underutilization, premature closure, tool-output misinterpretation, and recovery failure, plus Layer 3 gaps such as no transaction-state model or retry/escalation procedure.

That is exactly how incident reviews should be written.

# 2. Main critique

## Issue 1: Layer 4 / Layer 5 are inconsistent


There is a boundary inconsistency.

In the Layer 3 overview, Layer 4 is defined as:

```text
User, business, safety, compliance, and operational impact
```


But in `stack-40-system-faults.md`, the recommended wording introduces:

```text
Layer 4: engineering problem
Layer 5: user symptom
```


For example:

```text
Layer 4 engineering problem:
  hidden regression / hard-to-debug regression

Layer 5 user symptom:
  “It worked yesterday but not today.”
```


This is useful, but it conflicts with the earlier Layer 4 definition.

### Recommendation


Pick one of these two models:

**Option A -- simpler:**

```text
Layer 4 = impact
```


Impact includes engineering, user, business, legal, safety, trust, and operational impact.

**Option B -- more precise:**

```text
Layer 4 = organizational / operational consequence
Layer 5 = user-visible symptom / external harm
```


I prefer **Option B** if the framework is meant for incident analysis and governance. It gives you a cleaner distinction:

```text
Layer 3:
  no regression gate

Layer 4:
  hidden deployment regression, review burden, rollback cost

Layer 5:
  user receives inconsistent or unsafe behavior
```


But then every document should use that consistently.

## Issue 2: Layer 1C and Layer 3 can overlap


Layer 1C is "AI-system-level causal features." Layer 3 is "system controls and system faults." Both are system-level, so the distinction must stay sharp.

Current intended distinction seems to be:

```text
Layer 1C:
  stable causal surfaces of deployed AI systems

Layer 3:
  concrete controls or missing controls around behavioral faults
```


That is good. But the framework should keep repeating that distinction.

Example:

```text
C5 Compositional Pipeline Structure
```


is a Layer 1C feature because it explains why behavior emerges from multiple components.

But:

```text
no retrieval trace
no prompt assembly logging
no component-level eval
```


are Layer 3 faults.

### Recommendation


Use this rule:

> **Layer 1C names a system property that creates risk. Layer 3 names what the system did or failed to do about that risk.**

That will prevent category drift.

## Issue 3: Evaluation methods and Layer 3 controls need strict separation


The documents already state this, but it is important enough to enforce everywhere:

> An evaluation is not a control unless it changes system behavior, blocks release, triggers retry, alerts an operator, routes to review, or updates governance.

The evaluation mapping says it detects or measures faults; Layer 3 defines controls. The Layer 3 control-family document also says evaluation becomes a control only when it has operational effect.

### Recommendation


Use two terms consistently:

```text
Evaluation method:
  detects or measures behavior

Evaluation gate:
  operationalized control that blocks, alerts, retries, routes, or approves
```


This avoids statements like:

```text
We have hallucination evals, so hallucination is controlled.
```


That is false unless the eval is connected to a control.

## Issue 4: The framework may become too large without canonical artifacts


You now have:

```text
Layer 1A mechanisms
Layer 1B behavioral features
Layer 1C system causal features
Layer 2 atomic fault inventory
Layer 2 fault families
Layer 2 classification views
Layer 2 evaluation mapping
Evaluation-method views
Layer 3 overview
Layer 3 control families
Layer 3 semantic system faults
Layer 3 system-level faults
Worked examples
```


This is useful, but engineers will need a clear "source of truth" hierarchy.

### Recommendation


Define artifact roles explicitly:

|Artifact|Role|
|---|---|
|**Canonical inventory**|The official list of atomic items.|
|**Family index**|Non-exclusive grouping for communication and planning.|
|**View**|Secondary projection over the inventory.|
|**Mapping**|Many-to-many relation between layers.|
|**Worked examples**|Training and validation examples.|
|**Control catalog**|Official engineering controls.|

Then mark each file as one of these types.

For example:

```text
stack-21-fault-inventory.md
  canonical inventory

stack-23-fault-family-index.md
  family view

stack-25-evaluation-mapping.md
  mapping

stack-31-layer-3-control-families.md
  control catalog

stack-working-examples.md
  applied examples
```


Without this, contributors may start editing views as if they were canonical definitions.

## Issue 5: The coding scheme needs normalization


There is potential code collision or confusion:

```text
C1-C10 = Layer 1C features
C1-C15 = Layer 3 controls in one file
A1-A10 = Layer 1A mechanisms
A1-A6 = Layer 3 interface controls in another file
S1-S10 = system fault families
F01-F55 = atomic Layer 2 faults
FF1-FF15 = Layer 2 fault families
EM1-EM15 = evaluation methods
```


This is manageable internally, but it may confuse readers.

### Recommendation


Use layer-prefixed codes everywhere:

```text
L1A-A1
L1B-B1
L1C-C1

L2-F01
L2-FF1
EM1

L3-C-A1  interface contract control
L3-C-B5  claim grounding control
L3-S1    system fault family

L4-I1    impact family
```


Or simpler:

```text
A1, B1, C1 only for Layer 1
F01 for Layer 2 atomic faults
FF1 for Layer 2 families
EM1 for evaluation methods
L3C1 for Layer 3 controls
L3S1 for Layer 3 system faults
I1 for impacts
```


The current codes are readable in isolation but risky across the whole framework.

## Issue 6: Layer 3 has two competing structures


There are currently two Layer 3 taxonomic styles:

### Style A: control families

```text
Context Construction Controls
Retrieval and Source Controls
State and Memory Controls
Prompt and Task-Contract Controls
Control/Data Isolation Controls
Output Contract Controls
Grounding and Verification Controls
...
```

### Style B: system-fault families

```text
Context Assembly Faults
Retrieval and Grounding Faults
Instruction and Policy Control Faults
State and Memory Faults
Tool Orchestration Faults
Output Contract Faults
...
```


Both are useful. But they should not compete.

### Recommendation


Make them mirror each other:

```text
Layer 3 control family:
  Retrieval and Grounding Controls

Layer 3 system fault family:
  Retrieval and Grounding Control Failure
```


Then every Layer 3 fault is simply a failed, missing, weak, stale, misconfigured, bypassed, unobserved, untested, or ungated version of a control.

That would align well with the semantic Layer 3 tags:

```text
MISSING
WEAK
MISCONFIGURED
STALE
BYPASSED
UNOBSERVED
UNTESTED
UNMONITORED
```


This is a strong pattern. I would generalize it.

# 3. What I would change structurally


I would define the framework like this:

```text
Layer 1 — Causal features
  1A: base model / inference mechanisms
  1B: learned behavioral model features
  1C: deployed AI-system causal surfaces

Layer 2 — Behavioral fault modes
  Atomic faults: F01...
  Families: FF1...
  Classification views: secondary projections

Evaluation view — Fault observability
  EM1...
  Not a layer unless operationalized

Layer 3 — Engineering controls and control failures
  Control families
  System-fault families
  Semantic control view
  Runtime monitors, gates, recovery paths

Layer 4 — Operational / organizational impact
  engineering burden, reliability degradation, compliance exposure,
  manual review cost, rollback cost, audit burden

Layer 5 — User / external-world impact
  bad answer, unsafe action, privacy leak, wrong record updated,
  user overtrust, customer harm
```


The key change is separating **operational impact** from **user-facing symptom or external harm**.

That would make the stack more useful for both engineering and governance.

# 4. What the framework is best suited for


This framework is especially strong for:

```text
AI system design reviews
RAG architecture reviews
agentic workflow safety reviews
incident postmortems
evaluation planning
release gating
model/prompt/tool regression analysis
control coverage matrices
AI reliability audits
```


It is less suited as-is for:

```text
quick onboarding
executive summaries
simple model benchmarking
academic mechanistic interpretability
generic software delivery management
```


That is not a weakness. It just means the framework should have a lightweight "operating manual" for practitioners.

# 5. Recommended operating manual


For each AI feature or workflow, engineers should fill out:

```text
1. Intended behavior
   What must the system do?

2. Relevant Layer 1 features
   Which mechanisms or system causal surfaces matter?

3. Likely Layer 2 faults
   Which behavioral failures are plausible?

4. Evaluation methods
   How will we reveal those faults?

5. Layer 3 controls
   What prevents, detects, recovers, monitors, or proves behavior?

6. Control failure modes
   How can the controls be missing, weak, stale, bypassed, or unobserved?

7. Layer 4 / 5 impacts
   What happens operationally and what does the user experience?

8. Release gate
   What evidence is required before deployment?

9. Runtime monitoring
   What signals show degradation?

10. Incident loop
   How do failures become new tests and controls?
```


That would turn the framework from taxonomy into engineering process.

# 6. Final critique


The framework is strong because it is:

```text
causal
layered
operational
evaluation-aware
control-oriented
agent/RAG/tool aware
explicit about observability
explicit about recovery
explicit about governance
```


The main risks are:

```text
too many overlapping documents
inconsistent Layer 4 / Layer 5 semantics
code collisions
Layer 1C / Layer 3 boundary drift
evaluation/control confusion
duplicate Layer 3 fault vs control taxonomies
```


My recommendation:

> Keep the framework, but freeze the layer definitions and normalize the artifacts. The content is good; the next engineering task is taxonomy governance.

A concise final formulation:

> **This framework is valuable because it converts LLM behavior from vague risk into engineering responsibility: mechanisms explain possibility, fault modes describe recurring bad behavior, evaluation methods reveal it, controls contain it, and impact layers explain why it matters.**
