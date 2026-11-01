---
draft: false
toc: true
description: "Proposes an audit-oriented semantic kernel that models domain artifacts and compiles validated programs, separating relational truth, behavioral rules, authority, execution, and professional judgment."
title: "07 Semantic Kernel"
linkTitle: "07 Semantic Kernel"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The working interpretation is that this can be a strong architecture if the separate component is the **semantic kernel** of the system, not just another workflow service. It should define what a valid audit program is, type-check it, apply policies, and compile it into an executable plan.

## audit-related


The working interpretation is that this could be the right long-term architecture.

The strongest version is:

```text
                 Semantic kernel
              Haskell / Scala / etc.
                       │
          ┌────────────┼─────────────┐
          │            │             │
      type model      DSL         policies
          │            │             │
          └────────────┼─────────────┘
                       ↓
                 validated AST
                       ↓
                    planner
                       ↓
               executable IR
                       ↓
              workflow runtime
```


The kernel becomes the authority on what a valid audit-analysis program means.

### What belongs in the kernel


The recommendation is not to center it around `Step`.

The proposal is to start with concepts such as:

```text
Procedure
Objective
Artifact<T>
Evidence<T>
Dataset<T>
Transformation<I, O>
Analysis<I, O>
ClaimSet<T>
Reconciliation<A, B>
Property<T>
Policy
Review<T>
Deliverable<T>
```


Then something like:

```text
Evidence<RevenueTransactions>
        ↓
Transformation
        ↓
Dataset<MonthlyRevenue>
        ↓
Comparison
        ↓
ClaimSet<RevenueFinding>
        ↓
Review
        ↓
ReportSection<Revenue>
```


The language describes relationships between typed things.

The compiler can derive the operational steps later.

### Where a language such as Haskell becomes useful


Haskell would let you define a fairly strong algebra.

Conceptually:

```haskell
data Artifact a

data Method i o where
  Transform ::
    Transformation i o ->
    Method (Artifact i) (Artifact o)

  Analyze ::
    AnalysisSpec i o ->
    Method (Artifact i) (Artifact o)

  Review ::
    ReviewPolicy a ->
    Method (Artifact a) (Reviewed a)
```


Then invalid compositions become impossible or produce compile-time/domain-validation errors:

```text
JournalEntries
   ↓ RevenueAnalysis       ← invalid input

RevenueDataset
   ↓ RevenueAnalysis       ← valid
```


You can also encode states:

```text
ClaimSet Unreviewed
ClaimSet Reviewed

Evidence Unvalidated
Evidence Validated
```


So:

```text
assembleFinalReport :
    ClaimSet Reviewed -> Report
```


cannot accidentally receive an unreviewed claim set.

That is much stronger than:

```json
{
  "step": "assemble",
  "input": "whatever-string-id"
}
```

### But don't put every audit property into the type system


This is an important boundary.

Types are good for:

```text
This analysis requires RevenueDataset.

This transformation produces VarianceDataset.

This report requires ReviewedFindings.

Money cannot accidentally be supplied where Percentage is expected.
```


Types cannot generally prove:

```text
This evidence is relevant.

This management explanation is adequately supported.

The supplied population is actually complete.

This conclusion is appropriate.
```


Those depend on runtime data or auditor judgment.

So the proposal is to have:

```text
Types
    structural correctness

Constraints / validators
    runtime properties

Policies
    organizational requirements

Evaluators
    semantic quality

Review
    professional judgment
```


Trying to encode all of PCAOB methodology into type-level Haskell would produce an elaborate system that is difficult to evolve.

<a id="so-i-would-design-three-levels"></a>

### Three proposed design levels


Something approximately like this:

```text
                    BUILDER LANGUAGES

       relational        behavioral        authority
       Datalog-like      TLA-like          Cedar-like
             \              |                 /
              \             |                /
               ─────────────────────────────
                    SEMANTIC CORE / IR

                  types / artifacts
                  assumptions
                  guarantees
                  effects
                  capabilities
                  transitions
                  composition
                  invariants

               ─────────────────────────────
                        EXECUTION

                   Rust runtime/kernel
                          +
                    Wasm components
                          +
                 external participants
```


The builder might never know which underlying formalism handles which construct.

For example:

```text
component Researcher {
    input  Question
    output Candidate<Claim>

    requires {
        read(dataset)
    }

    effects {
        generate
    }

    guarantees {
        every Claim has provenance
    }
}
```


while:

```text
component Publisher {
    input Verified<Claim>
    output Publication

    requires {
        capability(publish)
    }

    effects {
        external(publish)
    }
}
```


Then:

```text
Researcher |> Verify |> Publisher
```


The compiler/runtime can ask several separate questions:

```text
type compatible?
effect compatible?
authority sufficient?
protocol valid?
invariants preserved?
required guarantee produced?
```


Different theories/languages answer different questions.

<a id="one-distinction-i-think-may-become-fundamental"></a>

### A potentially fundamental distinction


The proposal is to divide builder problems into roughly three semantic classes:

**Relational problems**

> What is true?

Use relational logic / Datalog / SQL-like languages.

```text
depends_on(A, B)
authorized(A, X)
derived_from(X, Y)
```


**Behavioral problems**

> What may happen over time?

Use state machines / temporal logic / process models.

```text
propose → approve → commit
```


including concurrency, retries, cancellation, failures, obligations.

**Computational problems**

> How do I produce a value?

Use ordinary programming languages and generative models.

```text
Question → Candidate<Answer>
```


Then authority/effects sit across these:

```text
what may be computed
what may be observed
what may change the world
```


This is cleaner than asking one programming language to express all three equally well.

<a id="i-would-keep-the-kernel-separate-from-execution"></a>

### Proposal to keep the kernel separate from execution


Something like:

```text
                   SEMANTIC KERNEL

DSL parser
Domain types
Type checker
Constraint checker
Policy engine
Planner
Compiler

                       ↓

                   Execution IR
                 JSON / protobuf

                       ↓

                      RUNTIME

AnalitycalReprEngine adapters
Data processing
LLM calls
Tools
Retries
Storage
Tracing
```


That means the proposed Haskell/Scala component doesn't need to own AnalitycalReprEngine connections, model APIs, queues, report rendering, etc.

It can remain relatively pure:

```text
Program + Catalog + Policies
            ↓
       ValidationResult

Program + Catalog
            ↓
       ExecutionPlan
```


A pure core is particularly valuable because it becomes easy to test exhaustively.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Tickloom case study


The complete [semantic-model and scenario-DSL example]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) is now in one case-study note. The following implementation roadmap resumes the original kernel design dialogue.

<a id="one-further-design-choice-id-make"></a>

### A further proposed design choice


Don't make the first external DSL textual.

First build:

```text
Domain algebra
        ↓
typed AST
        ↓
validators
        ↓
compiler
```


Then expose an embedded DSL from Haskell/Scala itself.

Express the four current workflows.

You'll discover where the abstraction is wrong very quickly.

Only once that model stabilizes would the following be designed:

```text
text DSL
JSON representation
visual editor
agent API
```


All four should ultimately construct the **same typed program**.

So the central architecture becomes:

```text
              Humans + LLM
                   │
              textual DSL
                   │
                   ▼
UI ───────────→ Typed semantic model ←──────── Agent
                   │
                   ▼
             validate / compile
                   │
                   ▼
              execution plan
                   │
                   ▼
                 runtime
```


That is the proposed direction to pursue. The separate component becomes a **small domain-specific programming language platform for audit analytics**, with the LLM as one possible programmer of that language.
