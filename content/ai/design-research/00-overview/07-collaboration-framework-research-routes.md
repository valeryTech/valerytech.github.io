---
draft: false
toc: true
description: "Proposes comparing collaboration APIs, proposal-and-commit kernels, declarative specifications, typed contracts, and shared artifacts on the same application to discover durable framework primitives."
title: "07 Collaboration Framework Research Routes"
linkTitle: "07 Collaboration Framework Research Routes"
---
# Collaboration framework research routes


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The retained analysis and routes sections propose ways to investigate a collaboration framework. The examples, tradeoffs, and different recommendations are retained with editorial wording. The archive does not include the initiating questions.

The sibling [comments]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes-comments" >}}) explain the arrangement and limits. The [research-scope note]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) distinguishes application choices from the general theory. The [framework proposal]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework" >}}) supplies related software examples. The source redirect (archived source 002) links both parts.

<a id="retained-analysis-and-routes"></a>

## Analysis and proposed routes

## analysis


The working interpretation is that this is the right way to proceed: treat them as several independent attacks on the same underlying problem, then look for abstractions that survive across them.

The existing research notes already contain at least four distinct directions.

|Direction|Starts from|Central question|
|---|---|---|
|**Collaboration-first**|human/AI joint work|What primitives make effective collaboration composable?|
|**Declarative-first**|goals and valid behavior|Can we describe what is allowed/desired and let the engine determine how?|
|**Runtime/kernel-first**|shared state and effects|What must the trusted substrate enforce regardless of participant behavior?|
|**Contracts/type-first**|guarantees carried by artifacts|Which properties can become executable semantics and be mechanically enforced?|

The proposal is to add a fifth, more HCI-oriented direction:

| **Shared-artifact-first** | human and AI manipulating the same computational object | Can both participants inspect, propose, change, challenge, and understand the running computation? |

These directions are related, but the proposal is to initially resist collapsing them.

### 1. Collaboration-first


This is the new Spring-like direction.

Start with:

```text
Goal
Participant
Role
Responsibility
Contribution
Proposal
Decision
Commitment
Handoff
Feedback
Repair
```


and ask whether higher-level patterns naturally compose from them:

```text
Elicitation
Delegation
ProposalReview
Coaching
SharedReasoning
JointConstruction
```


The test here is mostly conceptual and ergonomic:

> Can a developer express a wide range of human-AI applications with a small collaboration vocabulary?

This direction begins from **what the work between participants means**.

### 2. Declarative-first


The declarative-programming notes begin somewhere else:

> Humans and LLMs collaboratively construct a specification of goals, constraints, invariants, capabilities and effects; the engine finds an acceptable execution.

The primitive isn't really a collaboration pattern. It's closer to:

> **a progressively refined set of valid behaviors.**

This asks:

> Can we avoid encoding workflows and describe the solution space instead?

That's a PL/planning problem.

### 3. Runtime/kernel-first


The problem-framing notes attack it from below.

Participants are allowed to be opaque and generative. The system constrains accepted transitions:

```text
participant proposes
↓
validate / authorize
↓
commit
↓
new authoritative state
```


The strongest primitive here is:

**proposal ≠ commitment**

The later research notes explicitly elevate that to the central semantic boundary.

This direction asks:

> What minimal substrate lets arbitrary participants coexist without giving them arbitrary authority over shared state and the world?

Very OS-like.

### 4. Contract/type-first


This is the epistemic-contract direction.

Instead of starting with participants or workflows, start with values:

```text
EvidenceSet<
    coverage = Complete,
    provenance = Exact,
    authority = Verified
>
```


Then operations transform guarantees, produce obligations, or fail to produce the stronger type.

The research notes generalize this beyond evidence:

`Approval`, `Deployment`, `Payment`, `Decision`, etc. can all carry information about how they may legitimately be constructed.

This asks:

> Which collaboration/system guarantees can become machine-enforced properties of computation?

This is particularly good for research because claims can be falsified and some guarantees can be proved.

### 5. Shared-artifact-first


There is another direction already latent in the declarative-programming notes.

The program itself becomes shared state:

```text
          shared program

human        LLM        verifier
  ↓           ↓            ↓
modify      propose       check
  └───────────┼────────────┘
              ↓
           execute
              ↓
           observe
              ↓
           revise
```


This asks:

> What should the computational object look like so humans and AI can jointly understand and change it?

That's an HCI/programming-environment problem.

What gets interesting is the likely intersection.

A plausible layered architecture is proposed:

```text
COLLABORATION FRAMEWORK
developer thinks in:
goal · responsibility · delegation · proposal · review · handoff
              ↓

DECLARATIVE COLLABORATION IR
goal · state · constraints · valid transitions
roles · authority · obligations · effects
              ↓

SEMANTIC / CONTRACT LAYER
types · guarantees · provenance · capabilities
preconditions · invariants · commitment rules
              ↓

COLLABORATION RUNTIME
propose → validate → authorize → commit
observe → recover → handoff
              ↓

PARTICIPANTS
human · LLM · deterministic code · service · planner
```


That combination feels coherent because each layer answers a different question.

The **collaboration framework** gives developers the vocabulary.

The **declarative representation** defines what those declarations mean without prematurely fixing the workflow.

The **contract layer** makes some of those meanings enforceable.

The **runtime** preserves the semantics even when participants are probabilistic or untrusted.

And the LLM sits above that substrate, free to generate possibilities.

The existing "thin waist" proposal fits this especially well: typed contributions carry semantics, provenance, authority, and obligations across participants.

One combination appears particularly promising:

<!-- The declarative pattern examples continue in the programming-model note. -->

The complete section on [collaboration patterns as declarative constraints]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}#collaboration-patterns-as-declarative-constraints) is retained in the programming-model note. It belongs between the proposed layered architecture above and the investigation proposal below.

<a id="how-i-would-investigate-it"></a>

### Proposed investigation method


The recommendation is not to design the unified framework yet.

The proposal is to choose the **same demanding use case** and build several small prototypes from different directions:

1. collaboration-first API;
2. declarative specification;
3. kernel/runtime with proposal/commit;
4. typed contracts;
5. shared interactive representation.

Then record which concepts keep reappearing independently.

If `Proposal`, `Authority`, `Responsibility`, `Artifact`, `Commitment`, `Evidence`, `Effect`, and `Handoff` appear in four different prototypes, those are much stronger candidates for the framework's real primitives than concepts we invented while designing a single architecture.

In other words:

**use the different approaches as independent probes for discovering the common algebra.**

That seems like a better route to the "Spring for human-AI collaboration" idea than starting by designing the framework API itself.

## routes


The proposal is to treat this as three viable build routes that can converge later. They test different hypotheses, so the recommendation is not to merge them immediately.

### Route 1 -- Framework-first: discover the collaboration API


This is the closest to the "Spring for AI collaboration" idea.

Start with application-level primitives:

```text
Participant
Goal
Role
Responsibility
Artifact
Contribution
Proposal
Decision
Commitment
Handoff
Evidence
```


Then expose patterns as reusable constructs:

```text
Elicit
Delegate
ProposeAndReview
Coach
ReasonTogether
ConstructTogether
```


A first API might look conceptually like:

```java
collaboration("incident-response")
    .goal(ResolveIncident.class)

    .participant(onCall)
    .participant(aiInvestigator)

    .delegate(
        Investigation.class,
        to(aiInvestigator)
    )

    .proposal(
        RemediationPlan.class,
        by(aiInvestigator),
        reviewedBy(onCall)
    )

    .commit(
        RestartService.class,
        authorizedBy(onCall)
    );
```


Initially, implement this over existing LLM/tool/workflow infrastructure. Don't build a planner or new language yet.

What you are testing:

> Are collaboration concepts a good programming model?

Build 2-3 different applications and see whether the same vocabulary survives.

This directly follows the compositional idea already in the research notes: small components, typed contributions, and strong common semantics.

The risk is that this becomes a nice API over ordinary agent workflows without acquiring deeper semantics.

### Route 2 -- Runtime-first: build the collaboration kernel


Here you start from the strongest systems idea in the research notes:

**proposal ≠ commitment.**

Participants can produce arbitrary proposals. The runtime owns authoritative state transitions.

The minimum runtime could contain only:

```text
Principal
Artifact
State
Proposal
Transition
Effect
```


with:

```text
propose()
validate()
authorize()
commit()
reject()
observe()
undo()
```


For example:

```text
AI proposes:
    RestartService(service=A)

Runtime checks:
    proposal type valid?
    proposer allowed to propose this?
    required evidence present?
    approval required?
    invariant preserved?

Human:
    approve

Runtime:
    commit transition
    execute effect
    record provenance
```


The kernel owns:

```text
authoritative state
identity
authority
capabilities
effects
provenance
history
invariants
recovery
```


That matches the "trusted execution environment" framing in the research notes.

And it gives you the semantic thin waist you already identified: participants exchange typed contributions, while the substrate gives those contributions meaning and controls committed effects.

What you are testing:

> Can heterogeneous participants collaborate freely over shared state while the runtime preserves hard guarantees?

This route has more technical differentiation, but it can take longer before the developer experience feels compelling.

### Route 3 -- Declarative-first: specify valid collaboration


This is probably the most ambitious route.

The builder describes:

```text
goal
participants
roles
available operations
constraints
invariants
authority
effects
success conditions
```


and does **not** prescribe the exact sequence.

For example:

```text
task ResolveIncident {

    goal:
        IncidentResolved

    participants:
        Human(OnCall)
        AI(Investigator)

    allow Investigator:
        inspect(logs)
        inspect(metrics)
        propose(Remediation)

    commit RestartService:
        requires Approval(OnCall)

    ensure:
        every Diagnosis has Evidence
        every ExternalEffect has Actor
}
```


Then the engine finds an execution that satisfies those constraints.

The research notes already formulate this as:

> "Describe the valid computation; let the engine construct an execution."

And importantly, it should describe a **space of valid executions**, rather than a declarative DAG disguised as a DSL.

Humans and AI could also modify this specification during execution. The declarative-programming notes explicitly make the program itself a persistent shared artifact.

The deep hypothesis becomes:

> Can collaboration itself be specified as a progressively refined set of valid behaviors?

That is exactly where the declarative notes end up.

This is likely the strongest long-term model, but the recommendation is not to start here because you could spend a long time designing a language before knowing the right primitives.

<a id="i-would-combine-them-in-this-order"></a>

## Proposed order for combining the routes


Rather than choosing one permanently:

```text
Route 1
Collaboration API
"What concepts do developers actually need?"
        ↓

Route 2
Semantic runtime
"Which of those concepts need hard runtime meaning?"
        ↓

Route 3
Declarative model
"Can those semantics describe a space of valid collaboration?"
```


Or architecturally:

```text
Developer API
────────────────────────────
delegate()
propose()
review()
handoff()
reasonTogether()

            ↓ compile

Collaboration IR
────────────────────────────
participants
responsibilities
goals
proposals
authority
commitment rules
constraints

            ↓ execute

Collaboration Kernel
────────────────────────────
shared state
capabilities
validation
provenance
effects
commit / reject
recovery
```


The working interpretation is that that is the most promising combined route.

The API helps you **discover the vocabulary**.

The runtime forces you to **give that vocabulary precise semantics**.

The declarative layer eventually lets you **compose those semantics without fixing the workflow**.

<a id="a-fourth-route-id-run-as-a-research-spike"></a>

### A fourth route proposed as a research spike


Keep the epistemic-contract work as a narrow vertical experiment.

For example:

```text
ResearchTask

FinalFinding requires:
    EvidenceCoverage = Complete
    Provenance = Exact
    Conflicts = Resolved
```


This tests whether the type/contract idea actually provides enforceable value before you generalize it to every collaboration primitive. The author's research notes already position epistemic contracts as the first narrow instance of the broader substrate.

So the proposal is to run:

```text
Product exploration:
    framework-first

Systems exploration:
    runtime-first

Research validation:
    contracts-first

Long-term synthesis:
    declarative collaboration language
```


The proposal is to start by building **one vertical application twice**: once using the framework-first API, and once around the proposal/commit runtime. Comparing those implementations should reveal which concepts belong in the public framework, which belong only in the kernel, and which are still missing.
