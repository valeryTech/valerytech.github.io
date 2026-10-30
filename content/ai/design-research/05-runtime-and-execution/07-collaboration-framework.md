---
draft: false
toc: true
description: "Proposes a Spring-like framework of collaboration primitives, composable interaction patterns, and runtime interceptors that turn responsibility, review, authority, observability, and recovery into application infrastructure."
title: "07 Collaboration Framework"
linkTitle: "07 Collaboration Framework"
---
# Collaboration framework


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The saved LLM reply proposes software abstractions for collaborative work. The archive does not include the initiating question. The original examples and proposed framework guarantees remain unchanged below.

The sibling [comments]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework-comments" >}}) explain the placement and limits. The [participant-neutral system model]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) provides related architectural context. The source redirect (archived source 013) links both parts of the reply.

## Primitives, patterns, and runtime


The working interpretation is that there is a framework idea here, and the Spring analogy is useful.

The core move would be:

**Make collaboration primitives first-class software abstractions, then compose them into human-AI collaboration patterns.**

Today, many AI frameworks start from things like: `model` `prompt` `tool` `agent` `memory` `workflow`

The proposed framework would start one level higher, from the structure of collaborative work itself.

The research model already gives a basis for this. It separates collaboration modes from the underlying mechanics: alignment, grounding, coordination, observability/directability, review/commitment, and repair/adaptation.

The proposal is to imagine three layers.

### 1. Collaboration primitives


These are the equivalent of Spring's core abstractions.

For example:

```text
Participant
Goal
Role
Responsibility
Authority
Context
SharedState
Contribution
Proposal
Decision
Commitment
Evidence
Feedback
Handoff
Intervention
Recovery
```


And operations such as:

```text
ask()
propose()
review()
challenge()
approve()
reject()
delegate()
interrupt()
handoff()
undo()
escalate()
```


The key is that these have semantics.

`approve()` means something different from sending the message `"looks good"`.

A `Proposal` is explicitly:

```text
proposed change
+ rationale
+ evidence
+ author
+ affected state
+ required authority
+ review status
```


That gives the framework something concrete to enforce.

### 2. Collaboration patterns


Then patterns become reusable compositions of primitives.

For example:

```text
ProposalReview
    AI creates Proposal
    Human reviews Proposal
    Human commits or rejects
```

```text
Elicitation
    detect missing Context
    AI asks Participant
    Participant contributes information
    update SharedState
```

```text
Delegation
    Human defines Goal
    assign Responsibility to AI
    AI executes
    monitor execution
    verify Result
    hand back Responsibility
```

```text
SharedReasoning
    maintain SharedState
    participants contribute hypotheses
    require evidence where appropriate
    allow challenge
    revise understanding
    commit conclusion
```


These correspond closely to the six collaboration modes from the research: elicitation, delegation, proposal/review, critique/coaching, shared reasoning, and joint construction.

Now a developer can say something like:

```java
@Collaboration
class ArchitectureReview {

    @SharedGoal
    Goal goal;

    @ProposalReview
    Decision architectureDecision;

    @HumanAuthority
    Commitment finalDecision;

    @AI
    Reviewer reviewer;
}
```


The precise syntax is secondary. The important point is that **the collaboration contract becomes declarative**.

### 3. Collaboration runtime


This is where the Spring analogy gets stronger.

The framework runtime could enforce cross-cutting collaboration mechanics automatically.

For example:

```text
GroundingInterceptor
    detect unresolved assumptions
    prevent action if required context is missing

AuthorityInterceptor
    prevent AI from committing actions outside its authority

ReviewInterceptor
    convert consequential AI output into a Proposal

EvidenceInterceptor
    attach provenance to claims

ObservabilityInterceptor
    expose current goal, state, actions and intent

RecoveryInterceptor
    snapshot state before consequential changes

HandoffManager
    preserve context when responsibility changes
```


So developers don't have to rediscover these mechanics for every feature.

This is analogous to what frameworks do elsewhere:

```text
Spring:
business logic
+ transactions
+ dependency injection
+ security
+ lifecycle
+ observability

Collaboration framework:
task logic
+ grounding
+ authority
+ review
+ handoff
+ recovery
+ observability
```


This is where the proposal may extend beyond an agent orchestration library.

<!-- Responsibility allocation continues in the joint-activity model. -->

The complete responsibility and handoff passage is retained in the [joint-activity model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}#responsibility-allocation-and-handoff). It belongs between the runtime discussion above and the framework guarantees below.

## Proposed guarantees and project framing

### And collaboration mechanics become framework guarantees


The framework could take a clear position here.

If someone declares:

```text
@HumanCommit
```


the framework guarantees:

- AI cannot silently commit the change;
- the proposal is inspectable;
- evidence can be attached;
- the human can modify/reject it;
- the commit event is explicit;
- the previous state is recoverable.

Those are the collaboration mechanics identified in the report around review and commitment.

That is much stronger than telling developers:

> "Remember to keep humans in the loop."

The framework turns that design principle into infrastructure.

<a id="id-probably-frame-the-project-like-this"></a>

### Proposed project framing


**A framework for building AI systems from collaboration primitives.**

Instead of starting with:

> What agent should I create?

the developer starts with:

> Who knows what?
> Who does what?
> Who judges what?
> Who has authority?
> How can responsibility move?

Then the framework supplies the interaction patterns and runtime mechanics required to make that allocation work safely.

Conceptually:

```text
Collaboration specification
        ↓
Responsibility model
        ↓
Collaboration patterns
        ↓
Runtime mechanics
        ↓
LLMs + tools + humans + UI
```


That last point is important: **the LLM becomes an implementation detail underneath the collaboration model.**

That is probably the strongest version of the idea. It's closer to a true application framework than to LangChain-style orchestration.
