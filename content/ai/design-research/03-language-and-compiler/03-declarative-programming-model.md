---
draft: false
toc: true
description: "Proposes jointly edited declarative programs that define spaces of valid behavior, expressing delegation, review, and shared reasoning as constraints while retaining DSL programs as enduring artifacts."
title: "03 Declarative Programming Model"
linkTitle: "03 Declarative Programming Model"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## declarative approach


The working interpretation is that this may fit the research direction better than making Haskell/Scala themselves the builder language.

The key shift is:

> Humans and LLMs collaboratively construct a declarative program that describes the desired system, constraints, and allowed effects. A trusted engine interprets, validates, plans, and executes that program.

That gives you a clean separation:

```text
human + LLM
    │
    │ create / modify
    ▼
declarative program
    │
    ├─ goals
    ├─ facts / state
    ├─ constraints
    ├─ invariants
    ├─ capabilities
    ├─ effects
    ├─ policies
    └─ composition rules
    │
    ▼
compiler / planner / verifier
    │
    ▼
execution engine
    │
    ▼
world
```


This is particularly compatible with the constraint/generativity proposal because the program can describe a **space of valid executions**, rather than one exact execution.

For example, instead of:

```text
1. call model A
2. call tool B
3. if result...
4. ask human...
```


the program could say something like:

```text
goal:
    resolve(case)

requires:
    customer_identity_verified(case)

invariant:
    refund_amount <= authorized_amount

effect refund(amount):
    requires capability(financial_write)
    requires human_approval if amount > 500

result:
    resolved(case)
    evidence attached
```


The engine is free to determine how to satisfy this.

That freedom could include:

```text
LLM generates hypotheses
another model evaluates them
human supplies missing information
database query provides evidence
planner chooses another route
runtime retries a failed operation
human approves an effect
```


As long as the resulting computation stays inside the declared constraints.

This gives you a useful duality:

```text
program author:
    constrains the solution space

engine:
    explores the remaining solution space
```


That seems very close to what you've been looking for.

A SQL query is a simple precedent:

```sql
SELECT ...
FROM ...
WHERE ...
```


The author specifies the result and constraints. The database chooses joins, indexes, ordering of operations, parallelization, etc.

The proposed system would extend that idea from data processing to heterogeneous computation:

> **Describe the valid computation; let the engine construct an execution.**

### The program should probably be a shared artifact


This is where LLMs become more interesting than ordinary code generators.

The recommendation is not to treat the LLM as:

```text
prompt → generate program → execute
```


once.

Instead:

```text
                 shared program
                       │
       ┌───────────────┼───────────────┐
       │               │               │
     human            LLM          verifier
       │               │               │
   amend goal      propose rule      reject
   add constraint  fill hole         prove
   approve effect  generate plan     explain
       │               │               │
       └───────────────┼───────────────┘
                       │
                    execute
                       │
                    observe
                       │
                 revise program
```


So the program is persistent state in its own right.

A human could say:

> Don't contact customers without approval.

The LLM translates that into a proposed program modification.

The system can show:

```text
added constraint:

ContactCustomer(x)
    requires Approval(CustomerCommunication)
```


The human accepts it.

From then on it isn't merely an instruction sitting somewhere in context. It is part of the executable semantics.

That distinction could be very important.

### The third idea: don't require a fixed workflow


This also deserves more emphasis than it currently gets.

`research-direction.md` already has verified self-extension:

```text
agent proposes graph change
        ↓
compiler checks
        ↓
accepted
        ↓
runtime executes
```


and asks whether an agent can safely modify its running program.

The proposal is to generalize that substantially.

There doesn't even have to be an agent that owns the program.

Any authorized participant can propose:

```text
new task
new participant
new branch
new hypothesis
new dependency
new operation
new invariant
new plan fragment
```


The program itself is shared mutable state.

So the research question becomes:

> **Can coordination structure remain open-ended and dynamically constructed while every accepted change continues to satisfy global contracts?**

That separates this from conventional workflow engines and is probably one of the hardest questions in the program.

### Partial programs are probably necessary


Traditional programming assumes the program tells the computer how to compute something.

For human/LLM collaboration, the working interpretation is that you want **incomplete declarative programs**.

For example:

```text
goal:
    produce InvestmentMemo

requirements:
    cite evidence
    analyze downside
    compare alternatives

unknown:
    appropriate sources
    analysis procedure
    relevant alternatives
```


The unresolved parts are legitimate holes.

Then different participants can progressively refine the program:

```text
Goal
 ↓
Goal + constraints
 ↓
Goal + decomposition
 ↓
Goal + candidate methods
 ↓
verified executable plan
 ↓
result
```


This connects naturally to program synthesis.

The LLM isn't necessarily generating the final program. It can participate in **refinement**:

\[P_0 \supset P_1 \supset P_2 \supset \dots\]

where each step reduces the set of acceptable behaviors until execution becomes possible.

That also gives you a formal way to think about collaborative programming.

<a id="id-distinguish-three-declarative-layers"></a>

### Three proposed declarative layers


The recommendation is not to make one giant DSL.

One surface language could contain three semantically distinct kinds of declarations.

First, **what should become true**:

```text
goal
facts
queries
relationships
derived properties
```


This is SQL/Datalog/logic territory.

Second, **what executions are acceptable**:

```text
invariants
temporal constraints
protocols
preconditions
postconditions
obligations
```


This is specification / state-machine / temporal-logic territory.

Third, **what may affect the world**:

```text
effects
capabilities
authority
approval
resource limits
```


This is effect-system / capability / policy territory.

Then normal computation remains opaque:

```text
generate_report(...)
classify(...)
optimize(...)
run_python(...)
ask_human(...)
```


The declarative language constrains how those opaque computations participate.

### The most important design choice


The proposal is to avoid making the DSL primarily a declarative **workflow** language.

For example:

```text
A -> B -> C -> D
```


still commits the author to orchestration.

The proposed more general language would describe:

```text
initial conditions
desired conditions
available operations
constraints
invariants
authority
cost/preferences
```


and let the engine determine:

\[
\text{current state}

\xrightarrow{\text{valid execution}}

\text{desired state}
\]

Then a fixed workflow is simply one extreme:

```text
only one valid execution
```


while an open-ended LLM-assisted task might admit thousands.

That gives you one language capable of covering both.

The working interpretation is that this leads to a stronger framing of the project:

> **A declarative programming model for collaborative computation, where humans and generative models jointly construct and refine specifications of valid computation, while a trusted engine plans and executes within those specifications.**

And the deepest primitive may therefore be neither `agent` nor `workflow` nor `function`.

It may be:

\[\boxed{\text{a progressively refined set of valid behaviors}}\]

The DSL is how builders describe that set; humans and models refine it; the engine chooses and executes members of it.

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Collaboration patterns as declarative constraints


The following retained passage comes from the [framework research routes]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes" >}}). It retains the proposal/review, delegation, and shared-reasoning examples together. The sibling [comments]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model-comments" >}}) explain their relation to the earlier model and their limits.

### Collaboration patterns as declarative constraints, not workflow templates


Suppose the developer writes:

```text
ProposalReview<ArchitectureDecision> {
    proposer = AI
    reviewer = Architect
    committer = Architect
}
```


A naïve framework might compile this into:

```text
AI → human → AI → human
```


a fixed workflow.

The working interpretation is that the related research work suggests a better interpretation.

It means:

```text
AI may propose ArchitectureDecision

ArchitectureDecision cannot become committed
until:

    Architect can inspect it
    Architect has review authority
    Architect explicitly commits it
```


How the participants arrive there remains open.

Now **collaboration patterns become semantic constraints on valid collaboration**.

That brings the two strands together:

```text
collaboration pattern
        ↓
constraints on responsibilities,
authority and transitions
        ↓
many possible valid executions
```


This could be quite powerful.

Likewise, `Delegation` could mean:

```text
execution responsibility = AI
scope = X
success condition = Y
commit authority = Human
interruptible = true
```


without prescribing how the AI executes.

And `SharedReasoning` might define:

```text
Human may contribute Evidence / Judgment
AI may contribute Evidence / Hypothesis
either may Challenge
Conclusion requires Commitment(...)
```


again without specifying the turns.

That begins to look like a genuine framework built from collaboration semantics.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Source of truth in the captured DSL article


The following closing section comes from the captured article ["DSLs Enable Reliable Use of LLMs"]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}). The preceding discussion of [LLM roles during design and use]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#two-phases-working-with-llms) is in the builder method note. The article's final paragraph remains unchanged, including its missing final newline.

## The DSL as the Source of Truth


There is a growing trend of treating prompts as the primary source of truth. A well-designed DSL fundamentally changes this dynamic. One of the key advantages I observe of working with DSLs is that the generated program itself often becomes the artifact that humans maintain. Because a DSL is dense, expressive, and largely free of incidental boilerplate, it captures the essential intent of the solution in a form that remains readable long after generation. If an LLM generates a Tickloom failure scenario from a natural language request, the resulting scenario is already expressed in the vocabulary of the domain. If the scenario needs to change next month, there is no need to recover the original prompt and regenerate everything. The DSL has enough context for LLM to know the intent and work with it. The enduring asset is not the prompt, but the DSL and the semantic model.
