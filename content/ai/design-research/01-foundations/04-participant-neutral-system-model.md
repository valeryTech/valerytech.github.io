---
draft: false
toc: true
description: "Proposes a shared typed-state architecture where opaque participants contribute proposals and artifacts, while a runtime validates authority, contracts, and invariants before committing transitions and effects."
title: "04 Participant Neutral System Model"
linkTitle: "04 Participant Neutral System Model"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The working interpretation is that the strongest framing is broader than "neuro-symbolic AI."

The proposal is to call the object we are building a **constrained collaborative computation system**: humans, LLMs, deterministic programs, databases, tools, and other agents cooperate over shared state to accomplish tasks. Some participants are intelligent, some are generators, some are verifiers, some have authority to act. The architecture shouldn't require them to be the same kind of thing.

This also fits the dictionary. "Intelligence" is just task-solving capability; it doesn't imply agency. A standalone LLM can therefore be a highly capable component without being the persistent agent that owns goals, history, or action. A human clearly can be such a persistent agent.

The first proposed distinction is between **component behavior** and **system behavior**.

A component can be treated approximately as:

```text
component {
    identity / role
    capabilities
    local state, if any

    accepts: ...
    produces: ...

    may_effect: ...
    obligations: ...
}
```


Its internal behavior can remain opaque:

```text
observations + state
        ↓
    component
        ↓
candidate contributions / actions / artifacts
```


A deterministic function produces one answer. An LLM can produce several candidate plans, hypotheses, explanations, scenarios, or actions. A human may do something much more complex. We don't need one theory of their internal cognition.

The **system's behavior**, though, can be much more tightly defined:

```text
shared state S0
   ↓
participant proposes something
   ↓
constraints / permissions / checks
   ↓
accepted state transition
   ↓
shared state S1
   ↓
...
```


The LLM proposal treats that distinction as central to the architecture.

### Keep state outside both humans and models


The proposal is to make a shared task state a first-class component:

```text
Task
 ├─ goal
 ├─ constraints
 ├─ current world/task state
 ├─ evidence + provenance
 ├─ assumptions
 ├─ artifacts
 ├─ open questions
 ├─ decisions already made
 ├─ actions + observed consequences
 └─ permissions / risk limits
```


This is important conceptually. The LLM doesn't need to _be_ the persistent agent. Persistence can exist at the system level.

You can then define:

> **LLM agent = model + shared state access + tools + permissions + action loop.**

Agency belongs to the whole configured system to some degree, rather than magically appearing because the LLM was placed inside a loop.

### That changes the abstract machine


`research-direction.md` currently asks for a machine representing state, typed values, probabilistic and deterministic operations, effects, concurrency, humans, verification, provenance, time, etc.

The proposal is to simplify the conceptual machine to perhaps five things:

```text
Principal
Artifact
State
Transition
Effect
```


with metadata/relations:

```text
Principal
    identity
    capabilities
    roles

Artifact
    type
    provenance
    claims/certificates

Transition
    inputs
    proposed outputs
    preconditions
    obligations
    authority required

Effect
    target
    capability required
    reversibility
    external consequence
```


Then the core execution judgment might look conceptually like:

```text
S, principal, proposal
        ↓
validate types
validate capabilities
validate contracts
validate invariants
derive obligations
        ↓
commit / reject
        ↓
S'
+
effect log
+
provenance
```


This is sufficiently general that an investigation conclusion, a code deployment, an accounting transaction and a human approval are all state transitions with different contracts.

That is a much stronger foundation for the larger research program.

## 12. Multi-agent systems then become fairly clean


Instead of agents talking endlessly to one another, assign them capabilities over the same runtime.

For example:

```text
Planner Agent
  can create/modify programs

Retrieval Agent
  can inspect and optimize search branches

Critic Agent
  can add counterevidence / contradiction branches

Coverage Agent
  can inspect corpus participation

Authority Agent
  can apply/source authority policies

Synthesis Agent
  can construct claims from verified evidence

Human
  can modify anything permitted by policy
```


They communicate through the shared investigation state.

So:

```text
agents don't exchange "thoughts"

agents exchange typed artifacts
through a shared computational environment
```


That is much easier to inspect and control.

### 5. Multi-agent collaboration suggests blackboard systems


For MAS, the LLM proposal favors the established **blackboard architecture**.

Instead of:

```text
Planner → Retriever → Critic → Planner
```


with endless message passing, you have:

```text
                 Shared typed state

        Questions
        Evidence
        Claims
        Tasks
        Conflicts
        Plans
        Resources

      ▲         ▲         ▲
      │         │         │
 Retriever   Critic    Planner
      │         │         │
      └─────────┴─────────┘
```


Agents observe state, claim work they can perform, and publish typed outputs.

That fits Petri nets remarkably well:

```text
place = shared work/state pool
transition = eligible agent computation
token = typed artifact
```


Recent LLM blackboard systems have independently rediscovered this pattern. One 2025 study reports agents operating over a shared blackboard with dynamic selection; another applies the pattern to data-lake information discovery and reports better results than master/slave MAS baselines. ([arXiv](https://arxiv.org/abs/2507.01701?utm_source=chatgpt.com "Exploring Advanced LLM Multi-Agent Systems Based on Blackboard Architecture"))

So these aren't unrelated theories. They may compose neatly.

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Roles in long-running work


The complete role passage below continues the [work-types discussion]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}#work-types-and-task-dimensions). It separates persistent functions from the participants that perform them. The dedicated [comments]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model-comments" >}}) explain the placement and authority limits.

### 3. Roles -- what functions must persist throughout the work?


Another proposal is to stop assuming one agent owns the whole task.

Long-running work naturally introduces roles:

```text
Goal steward
    maintains current intent and success criteria

Coordinator / planner
    decomposes work, sequences it, replans

Worker
    executes bounded work

Observer / investigator
    obtains new information about the world

Verifier
    determines whether work/results satisfy requirements

State keeper
    maintains authoritative progress, decisions and history

Authority / approver
    commits consequential decisions

Recovery / escalation
    notices inability/failure and changes ownership or strategy
```


These are **roles, not necessarily agents**.

One model can occupy several. A deterministic test suite can be the verifier. Git can provide part of state-keeper functionality. A human can be goal steward and authority. A model can plan and execute.

That connects directly to the broader participant-neutral framing: people, models and services have different roles and authority while contributing to shared state.

This may be one of the most useful ways the proposed collaboration framework intersects the long-running problem.

<!-- The long-running-work dialogue continues with goal revisions. -->

The original reply continues with [goal revisions and dependent work]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#goal-revisions-and-dependent-work). The complete [failure taxonomy and field-study proposal]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}) retains the closing model.
