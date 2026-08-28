---
draft: false
toc: true
title: "Conceptualization 2"
linkTitle: "Conceptualization 2"
---
# Evaluation Conceptualization

## 1. Purpose


An evaluation system exists because the behavior of an AI product cannot be inferred reliably from its specification or implementation alone.

Product intent defines what should happen. Concrete executions produce actual behavior. Evaluation establishes evidence about that behavior, determines whether it is acceptable, and turns repeated judgment into reusable knowledge.

The central conceptual chain is:

```text
Product intent
    ↓
Evaluation case
    ↓
Case execution
    ↓
Case trajectory
    ↓ capture
Case trace
    ↓ judgment
Verdict
    ↓
Failure understanding
    ↓
Reusable evaluation knowledge
    ↓
Measurements, findings, and product decisions
```


Each stage represents a different kind of object and a different epistemic claim.

## 2. Product intent is normative


The AI Product defines intended value and behavior: jobs, workflows, outcomes, guarantees, invariants, boundaries, and unacceptable behavior.

This is the normative side of evaluation:

```text
product intent
    ↓
expected behavior
```


Evaluation does not create product meaning independently. It makes relevant product intent explicit enough to compare against concrete system behavior.

## 3. A case defines a situation to exercise


An **evaluation case** defines a bounded situation in which relevant product behavior can be exercised.

It may specify:

- initial conditions and fixtures;
- participant role and allowed behavior;
- interaction form;
- relevant product expectations;
- case dimensions and identity.

A case is a specification of an execution situation. It is not itself evidence that the system behaved in any particular way.

## 4. A case execution is one concrete enactment


A **case execution** is one actual enactment of a case against identified system, model, environment, and run configuration.

For interactive systems, execution is a closed loop:

```text
Participant ── action ──► SUT
     ▲                     │
     │                     │
     └──── response ───────┘
                            │
                         Environment
```


In a fixed case, future participant actions may already be declared.

In an adaptive case, a later participant action depends on participant-visible behavior produced earlier in the execution.

The participant therefore acts as a bounded controller or policy over the interaction, while the SUT and environment evolve in response.

## 5. The case trajectory is what actually happens


A **case trajectory** is the actual ordered evolution of one case execution.

Conceptually, let the relevant execution state at time \(t\) be:

\[
z_t = \left(

s_t^{\text{SUT}},

s_t^{\text{environment}},

s_t^{\text{interaction}}

\right)
\]

The execution induces a trajectory:

\[
\tau = z_0

\xrightarrow{a_1} z_1

\xrightarrow{a_2} \dots

\xrightarrow{a_n} z_n
\]

where participant actions and system behavior cause the execution to evolve.

The trajectory is an execution-reality concept. It exists regardless of whether the evaluation apparatus observes every relevant transition.

The evaluation system is not assumed to possess the complete trajectory.

It may not know:

- all internal SUT state;
- all intermediate model or orchestration state;
- every external effect;
- every causal dependency;
- an adaptive participant's private reasoning.

The trajectory therefore should not be treated as a serialized artifact.

It answers:

> **What actually happened during this case execution?**

## 6. The case trace is captured evidence about the trajectory


A **case trace** is the attributable evidence captured about a case trajectory.

Conceptually:

\[T = C_{\kappa}(\tau)\]

where \(C_{\kappa}\) is the capture process under some instrumentation and observation policy \(\kappa\).

The trace may contain:

- case and execution identity;
- exact participant actions;
- complete SUT responses exposed through supported interaction boundaries;
- adaptive choices and the participant-visible evidence on which they were based;
- explicit state observations captured through identified read boundaries;
- execution and capture completion facts;
- optional runtime, model, log, and span diagnostics.

The trace is an evidence artifact.

It answers:

> **What can the evaluation system establish about what happened?**

This distinction is fundamental:

```text
trajectory                           trace
──────────                           ─────
execution reality                    captured evidence
what happened                        what was observed
may contain hidden state             contains attributable records
exists independently of capture      produced by capture
cannot generally be reconstructed    can be stored and inspected
```


A trace may be incomplete without changing the trajectory that occurred.

## 7. Observations are projections, not state


A state observation is evidence obtained through an identified observable boundary at an identified point in the execution.

Conceptually:

\[o_t = H_b(z_t)\]

where \(H_b\) is an observation through boundary \(b\).

An observation establishes:

```text
subject
+ capture point
+ observation boundary
+ returned value
+ provenance
```


It does not establish that the returned value is the complete state of the SUT.

This is why concepts such as `final_public_state` are misleading. They collapse multiple observations into an object that appears complete, timeless, and authoritative.

State belongs to the execution model.

Observations belong to the trace.

## 8. Different observers may see different projections


The participant and the judge may have different access to the trajectory.

Conceptually:

\[O_P(\tau)\]

is participant-visible evidence, while:

\[O_J(\tau)\]

is evidence available to the judge.

For example, the participant may see a Wallet response containing offered actions, while the evaluation harness additionally records a transaction-state observation through a supported read contract.

An adaptive participant must make its decision from participant-visible evidence. Judge-only observations must not silently influence participant behavior.

This makes evidence origin part of the evaluation semantics.

## 9. Judgment operates on the trace and targets the execution behavior


A judge does not directly observe the trajectory. It applies an evaluation basis to the available trace.

Conceptually:

\[J(T, B) \rightarrow V\]

where:

- \(T\) is the case trace;
- \(B\) is the applicable evaluation basis;
- \(V\) is the verdict.

The evaluation basis may draw from case expectations, product guarantees, explicit evaluation policy, or domain expertise.

The primary whole-case verdict is:

```text
PASS
FAIL
NOT JUDGEABLE
```


The distinction between judgment target and evidence source should remain explicit:

> The **behavioral target** is the case execution and its trajectory.
>
> The **evidence unit** is the captured case trace.

The verdict may be stored against the trace identity for provenance, while semantically making a claim about the behavior exhibited by that execution.

## 10. Judgeability and correctness are independent


A trace may contain insufficient evidence to support a behavioral verdict.

Therefore:

```text
trace
  ↓
enough attributable evidence?
  ├── no  → NOT JUDGEABLE
  └── yes
          ↓
      behavior acceptable?
          ├── yes → PASS
          └── no  → FAIL
```


`NOT JUDGEABLE` is not a third kind of product behavior. It describes the evaluation system's inability to support a correctness judgment from the available evidence.

This separates two questions:

```text
Did the system behave correctly?

Can the available trace establish whether it behaved correctly?
```

## 11. A failed verdict identifies the first observable failure


For a failed execution, the initial judgment records a short description of the **first observable failure** and links it to supporting trace evidence.

The first observable failure is:

> **The earliest point in the case trajectory at which the available trace provides sufficient attributable evidence to establish a violation of the applicable product expectation.**

Conceptually:

\[
p^* = \min \left\{

p : T \text{ contains sufficient evidence to establish a violation at } p

\right\}
\]

The point at which the reviewer discovers the problem and the point at which the behavior first became demonstrably wrong may differ.

Later evidence may establish that an earlier step was already incorrect.

The first observable failure should stay close to evidence:

```text
At step 3, Wallet executed the transfer before the required confirmation.
```


It should not require an unsupported causal claim:

```text
The transaction state machine lost the confirmation flag.
```


The latter belongs to diagnosis unless the trace directly establishes it.

## 12. First observable failure is not root cause


Three objects should remain distinct:

```text
Failure verdict
    ↓
This execution was behaviorally unacceptable.

First observable failure
    ↓
This is the earliest evidence-grounded point at which it became demonstrably unacceptable.

Root cause
    ↓
This mechanism or condition explains why the failure occurred.
```


The first two can be established through behavioral evaluation.

Root-cause analysis may require diagnostic evidence, implementation inspection, reproduction, experiments, or other engineering investigation.

A behavioral evaluator should not convert temporal sequence or correlation into causal explanation.

## 13. Failure understanding begins after individual judgment


Individual verdicts establish whether particular executions succeeded or failed.

Failure understanding asks a different question:

> **What recurring ways of failing are present across executions?**

Failed traces and their first-observable-failure notes provide grounded starting points for this analysis.

The progression is:

```text
failed executions
    ↓
first observable failure incidents
    ↓
initial coding
    ↓
comparison across traces
    ↓
focused codes and categories
    ↓
failure model
```


Successful traces remain useful as contrast cases for testing whether a proposed failure pattern actually distinguishes failing behavior.

A first-failure note is therefore not yet a failure mode.

A failure mode is an analytical abstraction developed by comparing incidents across executions.

## 14. Operational evaluation applies reusable knowledge


Once a failure or quality model is sufficiently developed, selected behaviors can be operationalized.

```text
failure / quality model
    ↓
criterion
    ↓
evaluator
    ↓
application to traces
    ↓
labels
    ↓
measurements
    ↓
findings
```


These are separate artifacts.

A whole-case `FAIL` verdict should not be conflated with a failure-mode label such as:

```text
unauthorized_action = true
```


The first is a judgment of an execution as a whole.

The second applies a particular reusable behavioral concept.

## 15. Four independent execution-evaluation properties


Several statuses that are easy to collapse should remain independent.

### Execution status


What happened mechanically to the case execution?

```text
completed
interrupted
aborted
...
```

### Capture status


What evidence did the evaluation apparatus successfully capture?

A trace may end before the execution ended or omit an expected record.

### Judgeability


Does the captured trace contain enough attributable evidence to reach the required judgment?

```text
judgeable
not judgeable
```

### Behavioral correctness


When judgeable, was the execution acceptable?

```text
pass
fail
```


These properties should not imply one another.

For example:

```text
execution completed
capture completed according to capture contract
trace judgeable
behavior failed
```


is entirely valid.

Likewise:

```text
execution completed
capture incomplete
trace not judgeable
behavior unknown
```


is also valid.

## 16. "Complete trace" is relative to a capture contract


Because a trace is only a projection of an execution trajectory, it should not be called complete in the sense of containing everything that happened.

If the term is retained, **complete trace** should mean:

> all evidence required by the declared capture contract was successfully recorded.

This is different from:

> sufficient evidence for judgment.

Capture completeness and judgeability are separate properties.

A capture contract may have been satisfied while still omitting evidence that a particular expert later discovers is necessary for judgment. That discovery is an evaluation-infrastructure learning signal.

## 17. Evaluation operates across epistemic layers


The conceptual system can be summarized as six layers:

```text
1. NORMATIVE
   What should happen?
   Product intent and evaluation basis.

2. ACTUAL
   What happened?
   Case execution and trajectory.

3. EVIDENTIAL
   What can we establish happened?
   Case trace and captured observations.

4. JUDGMENT
   Was the behavior acceptable?
   Verdict and first observable failure.

5. ANALYTICAL
   What recurring patterns explain observed successes and failures?
   Failure / quality models and evaluation knowledge.

6. DECISIONAL
   What should we do with that knowledge?
   Product changes, investigations, release decisions, monitoring, or further evaluation.
```


Moving between layers changes the kind of claim being made.

The evaluation system should preserve those transitions rather than silently promoting evidence into reality, judgment into causality, or one observed failure into a general failure mode.

## 18. Relationship to the current evaluation products


Within the current project:

```text
Evaluation Runner
    case + configuration
        ↓
    executes the case
        ↓
    trajectory occurs
        ↓
    captures a trace
        ↓
    saves attributable run evidence

Evaluation Trace Viewer / Judge
    opens saved trace
        ↓
    inspects evidence
        ↓
    applies evaluation basis
        ↓
    records PASS / FAIL / NOT JUDGEABLE
        ↓
    for FAIL, records first observable failure

Failure Understanding
    consumes judged traces and incidents
        ↓
    compares failures across executions
        ↓
    develops reusable failure knowledge
```


The runner should therefore be described as a **trace producer**, rather than as a producer of trajectories.

The viewer's existing name becomes precise: it presents captured traces of case trajectories.

## 19. Core conceptual invariants


The project should preserve the following distinctions throughout its product language, data contracts, and architecture:

```text
case ≠ execution

execution ≠ trajectory

trajectory ≠ trace

state ≠ observation

participant-visible evidence ≠ judge-visible evidence

execution completion ≠ capture completeness

capture completeness ≠ judgeability

judgeability ≠ correctness

verdict ≠ failure incident

failure incident ≠ failure mode

failure mode ≠ root cause

failure mode ≠ evaluator

evaluator output ≠ product finding
```


The central invariant is:

> **A case trajectory is what actually happens during execution. A case trace is the attributable evidence captured about that trajectory. Evaluation judges execution behavior from the trace without assuming that the trace is a complete reconstruction of execution reality.**

Everything downstream follows from preserving that boundary.
