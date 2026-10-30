---
draft: false
toc: true
description: "Compares Haskell and Scala for discovering DSL algebras, then proposes a shared semantic core with complementary Lean proofs, TLA+ behavior models, Datalog rules, and Cedar authorization."
title: "06 Language And Formalism Choices"
linkTitle: "06 Language And Formalism Choices"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## Scala and Haskell


Between those two, the proposal is to start with **Haskell**, especially if the immediate goal is to discover the right language and algebra for the substrate.

The reason is not simply "Haskell is functional." The research problem maps closely to the things Haskell is particularly good at representing:

```text
small semantic vocabulary
        ↓
algebra of operations
        ↓
combinators
        ↓
restricted programs
        ↓
multiple interpretations
        ↓
execution / validation / analysis / compilation
```


That is almost exactly the territory of typed embedded DSLs and **final-tagless** encodings. The final-tagless approach was developed specifically to represent typed object languages in a typed host language while supporting multiple interpreters. ([Cambridge University Press](https://www.cambridge.org/core/journals/journal-of-functional-programming/article/finally-tagless-partially-evaluated-tagless-staged-interpreters-for-simpler-typed-languages/7B2DC44A2127EBBA71ADE63809D9425F?utm_source=chatgpt.com "Finally tagless, partially evaluated: Tagless staged interpreters for simpler typed languages | Journal of Functional Programming | Cambridge Core"))

For example, the proposed system might begin with an algebra:

```haskell
class Monad m => System m where
  observe  :: Resource a -> m a
  propose  :: Proposal a -> m (Candidate a)
  commit   :: Capability e -> Effect e a -> m a
  emit     :: Artifact a -> m ()
```


Then a builder writes:

```haskell
investigate :: System m => Question -> m Report
investigate q = do
  evidence <- observe (sources q)
  candidate <- propose (analyse evidence)
  ...
```


The key is that `investigate` doesn't know what `m` is.

You can provide interpreters for:

```text
System Runtime
System Simulator
System StaticAnalyzer
System AuditLog
System TLAExporter
System DryRun
```


This is directly aligned with the proposal that the **same composition can be given different meanings while its admissible structure stays fixed**.

Haskell's GADTs, type families and type-level data also let you encode richer state and capability constraints in the type system. GHC explicitly supports GADTs for type refinement, type families for type-indexed computation, and `DataKinds`for promoting domain concepts to the type level. ([GHC GitLab](https://ghc.gitlab.haskell.org/ghc/doc/users_guide/exts/gadt.html?utm_source=chatgpt.com "6.4.9. Generalised Algebraic Data Types (GADTs) -- Glasgow Haskell Compiler 9.15.20260306 User's Guide"))

For instance:

```haskell
data Authority
  = Read
  | Write
  | Financial
  | Publish

data Program (caps :: [Authority]) a
```


You can start expressing:

```haskell
publish
  :: Member 'Publish caps
  => Document
  -> Program caps Publication
```


That is very close to:

> constrain the set of expressible programs so valid programs inherit guarantees.

And Haskell gives you another property considered important for the author's project: **purity is the default**.

A Haskell value:

```haskell
f :: Evidence -> Candidate
```


cannot silently send mail, modify a database, read a global variable, or issue an HTTP request through ordinary pure code.

That makes the line between:

```text
computation
effects
```


structural.

For what you're designing, that's valuable because you want builders to explicitly say which semantic freedoms they are introducing.

Scala 3, though, is arguably better for the eventual **developer-facing language**.

Scala has an exceptionally strong toolkit for making embedded DSLs feel like native syntax:

- extension methods,
- contextual abstractions / `given` / `using`,
- context functions,
- opaque types,
- union and intersection types,
- match types,
- dependent function types,
- `inline`,
- quoted macros and compiler metaprogramming.

Scala's own documentation specifically identifies context functions as a tool for concise domain-specific languages, and Scala 3's metaprogramming facilities allow libraries to inspect and generate typed programs at compile time. ([Scala Documentation](https://docs.scala-lang.org/scala3/new-in-scala3.html?utm_source=chatgpt.com "New in Scala 3 | Scala Documentation"))

So Scala could give you something much closer to:

```scala
system:
  component Researcher:
    reads Evidence
    produces Candidate[Claim]

  component Reviewer:
    requires Role.Reviewer
    consumes Candidate[Claim]
    produces Verified[Claim]

  Researcher >>> Reviewer
```


without necessarily building a separate parser/compiler.

Opaque types are also useful for making semantic distinctions impossible to bypass accidentally:

```scala
opaque type Verified[A] = A
opaque type Authorized[A] = A
opaque type Committed[A] = A
```


The representation can remain hidden while the runtime representation is cheap. ([Scala Documentation](https://docs.scala-lang.org/scala3/book/types-opaque-types.html?utm_source=chatgpt.com "Opaque Types | Scala 3 -- Book | Scala Documentation"))

### The deeper difference


The proposal is to summarize Haskell vs Scala for the author's project this way:

||Haskell|Scala 3|
|---|---|---|
|Discovering the algebra|**Excellent**|Very good|
|Encoding constraints in types|**Excellent**|Excellent|
|Algebraic composition|**Excellent**|Excellent|
|Purity/effect boundary|**Native**|Library discipline|
|Tagless-final DSLs|**Natural**|Natural|
|Type-level programming|Powerful|Powerful|
|DSL surface syntax|Good|**Excellent**|
|Compile-time macros|More awkward|**Excellent**|
|JVM/enterprise integration|Limited|**Excellent**|
|Mixing OO + FP components|Limited|**Excellent**|
|Keeping semantics conceptually small|**Better**|Harder|
|Escape hatches|Fewer|Many|

That second-last row matters.

Scala gives you a huge language in which to construct a smaller language. That is useful, but you have to constantly police the boundary.

Haskell starts from something closer to the philosophy under investigation:

```text
pure functions
+ explicit effects
+ algebraic data
+ parametricity
+ composition
```


and then you selectively add power.

That makes it a better **research medium** for the idea.

### There is also a powerful architecture involving both


The recommendation is not to actually expose Haskell itself as the long-term language.

The proposal is to do:

```text
             HASKELL
      semantic experimentation
              │
              │
    algebra / laws / combinators
              │
              ▼
       ┌───────────────┐
       │  semantic IR  │
       └───────────────┘
          ▲         ▲
          │         │
      Scala DSL   other DSL
          │
          │
    production builders
```


In other words:

**Haskell discovers the language. Scala can host the language.**

Once the semantics stabilize, both should compile to the same representation.

That also protects you against one dangerous failure mode: accidentally defining the proposed theory in terms of what the host language happens to make convenient.

### One Haskell technique deserves particular attention


The proposal is to investigate **finally tagless + capability/effect algebras** before inventing much syntax.

Suppose you define independent capabilities:

```haskell
class Monad m => Generate m where
  generate :: Prompt a -> m (Candidate a)

class Monad m => ReadState m where
  readState :: Key a -> m a

class Monad m => Commit m where
  commit :: Effect a -> m a

class Monad m => Approve m where
  approve :: Proposal a -> m (Approved a)
```


A component declares exactly what world it requires:

```haskell
research
  :: (Generate m, ReadState m)
  => Question
  -> m (Candidate Report)
```


while:

```haskell
publish
  :: (Commit m, Approve m)
  => Candidate Report
  -> m Publication
```


The signatures themselves become **requirements/contracts**.

Then composition can calculate requirements:

```text
research
requires {Generate, ReadState}

publish
requires {Commit, Approve}

research >>> publish
requires
{Generate, ReadState, Commit, Approve}
```


Now we're getting very close to the proposed broader theory:

\[
requirements(A \circ B) =

requirements(A) \cup requirements(B)
\]

while guarantees may compose according to their own algebra.

That could eventually extend beyond effects:

```text
Requires
Guarantees
Consumes
Produces
Authority
Effects
Obligations
Protocol
```


So a component starts looking mathematically like:

\[C : (I, R, P) \rightarrow (O, G, E)\]

where `R` is requirements, `G` guarantees, etc.

At that point the programming language is almost emerging directly from the theory.

### Haskell versus Scala


Both can work, but they lead to somewhat different tradeoffs.

||Haskell|Scala 3|
|---|---|---|
|Algebraic modeling|Excellent|Very good|
|GADTs / phantom types|Excellent|Good|
|Pure AST + interpreters|Very natural|Natural|
|Effect control|Excellent|Good with libraries/design|
|Embedded DSL design|Excellent|Very good|
|JVM integration|Poorer|Excellent|
|Enterprise library ecosystem|Smaller|Large|
|Hiring / maintainability|Harder|Easier|
|Interop with Java systems|Friction|Native|
|Building a standalone "compiler kernel"|Very attractive|Also good|

If this were a relatively isolated **workflow-language compiler / semantic service**, and the team is comfortable with Haskell, Haskell is a compelling fit.

If it needs to live naturally inside a larger JVM enterprise environment, one tentative proposal is to choose Scala 3.

The architecture matters much more than the language.

<a id="my-choice"></a>

### Proposed language choice


For the next experimental implementation, the proposal is to choose:

```text
Haskell
  ↓
typed embedded DSL
  ↓
finally tagless / algebraic interfaces
  ↓
explicit capability + effect sets
  ↓
multiple interpreters
  ↓
discover the composition laws
```


The proposal is to choose **Scala 3** if the goal shifted to:

> "We understand the semantics; now make this a language that ordinary production engineers can embed into existing applications."

The potentially important result is that the Haskell DSL may itself become the **executable version of the theory**: instead of first writing an abstract formalism and then implementing it, we can explore what `Component`, `Constraint`, `Guarantee`, and `Compose` must mean by seeing which algebraic structures actually make composition work.

### This changes the role of Haskell or Scala


Under this architecture, the recommendation is not to ask:

> Should the system language be Haskell or Scala?

The proposal is to ask:

> Which language should we use to implement the compiler and semantic engine?

Haskell becomes especially appealing there because you can represent the DSL algebraically, write multiple interpreters, and experiment with the semantics.

Scala becomes appealing if the declarative language should also embed naturally inside JVM applications.

But builders might see neither:

```text
task AnalyzeIncident {
    goal IncidentResolved

    require EvidenceAttached

    allow {
        read(logs)
        query(metrics)
        generate(hypothesis)
    }

    effect RestartService {
        requires capability(operations.write)
        requires approval(OnCall)
    }

    ensure {
        every Claim has Evidence
        every ExternalEffect has Actor
    }
}
```


That could compile into an internal algebra implemented in Haskell, Scala, Rust, or something else.

## other?


The working interpretation is that the right architecture is a **small family of languages with one common semantic IR**. The theory itself argues against forcing every problem through one maximally expressive language.

My current preferred stack would be:

|Problem|Language/style I'd use|Why|
|---|---|---|
|Core semantics and proofs|**Lean**|Define exactly what composition, refinement, effects, authority, invariants, etc. mean|
|Concurrent/system behavior|**TLA+** initially|State-transition systems, nondeterminism, safety/liveness, composition|
|Relations, derived facts, constraints|**Datalog**|Very good match for facts + rules + recursive derivation + provenance|
|Authorization|**Cedar-like DSL**|Purpose-built, restricted, analyzable authority semantics|
|Effects / component requirements|**Koka/Unison-inspired type layer**|Effects become explicit at boundaries|
|Component ABI|**WIT + WebAssembly Component Model**|Language-neutral components and typed imports/exports|
|Production substrate/runtime|**Rust**|Strong enforcement boundary, memory/resource safety, good systems ecosystem|
|Application/component code|Any language|Python, Rust, TS, Go, models, humans, etc. shouldn't determine substrate semantics|

The crucial part would be a dedicated **semantic IR** between those layers.

<a id="i-would-not-make-rust-the-language-of-the-theory"></a>

### Proposal to keep Rust separate from the language of the theory


Rust is attractive because it is itself an example of the proposed principle: ownership restricts programs and lets the compiler guarantee memory properties. ([Rust Documentation](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html?highlight=garbage%2Ccollector&utm_source=chatgpt.com "What is Ownership? - The Rust Programming Language"))

And one tentative proposal is to implement the runtime in Rust.

But something like:

```rust
fn execute(action: Action) -> Result<ResultValue>
```


doesn't naturally tell us enough about:

- what authority it requires,
- what state it may change,
- whether it is deterministic,
- which external effects it may perform,
- which invariants it preserves,
- what assumptions it makes about another participant.

You can encode all of this in Rust, but then you're effectively designing another language inside its type system and libraries.

The proposed role for Rust is the **machine enforcing the semantics**, rather than the semantics themselves.

### Lean is particularly attractive for the semantic core


There is an appealing correspondence with what you're trying to do.

Lean has a deliberately tiny trusted kernel: complex automation produces proof terms, while the small kernel checks whether those terms obey the core theory. ([Lean Language](https://lean-lang.org/doc/reference/latest?utm_source=chatgpt.com "The Lean Language Reference"))

That's almost the architectural principle you're investigating:

```text
large space of things builders may construct
                    ↓
            small semantic core
                    ↓
            validity checking
                    ↓
        trustworthy compositions
```


And dependent types let types express fairly strong invariants about values and programs. ([Lean Prover](https://leanprover.github.io/functional_programming_in_lean/dependent-types.html?utm_source=chatgpt.com "Programming with Dependent Types - Functional Programming in Lean"))

The recommendation is not to necessarily expose Lean to ordinary builders. The proposal is to use it to define and test the **meaning of the substrate**.

For example, perhaps the fundamental semantic objects are roughly:

```text
Component
Requirement
Guarantee
Effect
Capability
Artifact
Transition
Invariant
Composition
```


and you prove facts such as:

```text
compatible A B
∧ preserves A I
∧ preserves B I
────────────────
preserves (compose A B) I
```


Then other languages compile into this representation.

### For system behavior, TLA+ is hard to avoid


The proposed theory deals directly with **sets of possible behaviors**. That's exactly TLA+'s native viewpoint: a specification denotes acceptable behaviors of a system. ([Leslie Lamport's Home Page](https://lamport.azurewebsites.net/pubs/spec-book-chap.pdf?utm_source=chatgpt.com "Chapter 7

TLA+

Leslie Lamport

7.1  Overview of"))

It is especially good for:

```text
state
transition
concurrency
nondeterminism
failure
fairness
liveness
refinement
```


and it explicitly supports composing specifications. ([Leslie Lamport's Home Page](https://lamport.azurewebsites.net/tla/book-02-02-27.pdf?utm_source=chatgpt.com "Specifying Systems"))

So for questions like:

> Can arbitrary participants propose concurrently while every accepted transition preserves invariant I?

TLA+ is more natural than Rust, Haskell, or Python.

The tentative recommendation is not to make TLA+ the builder language either. The proposal is to borrow its semantic model.

### Datalog looks very important for another class of problems


Much of the proposed substrate isn't really computation in the ordinary imperative sense.

Consider:

```text
Alice is member of TeamA
TeamA owns ProjectX
Review42 concerns ProjectX
Review42 was produced_by Agent7
Agent7 delegated_by Alice
```


Then rules:

```text
may_review(P, X) :-
    member(P, Team),
    owns(Team, X).

requires_human_approval(Action) :-
    financial(Action),
    amount(Action, N),
    N > 1000.
```


That's relational reasoning.

Datalog is deliberately restricted, declarative, recursive, and well suited to program analysis, security and graph problems. ([Soufflé](https://souffle-lang.github.io/tutorial?utm_source=chatgpt.com "Tutorial | Soufflé • A Datalog Synthesis Tool for Static Analysis")) Soufflé also has explicit provenance support that can explain why a tuple was derived, which maps directly onto the research interest in causal/provenance reasoning. ([Soufflé](https://souffle-lang.github.io/provenance?utm_source=chatgpt.com "Provenance | Soufflé • A Datalog Synthesis Tool for Static Analysis"))

A possible substrate would let builders use a Datalog-like fragment for:

- constraints,
- derived capabilities,
- dependency relationships,
- provenance,
- eligibility,
- policy,
- consistency checks.

This is probably a better fit than making all of those functions.

### 6. Logic programming belongs in the knowledge layer


Then there is a different type of computation:

```text
ADR-42 supersedes ADR-19
ADR-42 is accepted
accepted ADR > draft RFC
E12 supports C7
E14 contradicts C7
```


That's closer to Datalog / rule systems:

```text
governs(X, Topic) :-
    applies_to(X, Topic),
    status(X, accepted),
    not superseded(X).
```


And recursively:

```text
depends_on(A, C) :-
    depends_on(A, B),
    depends_on(B, C).
```


This is where fixed-point semantics become useful.

So the recommendation is not to force this into the Petri net itself.

Petri net:

> what computations can happen?

Logic layer:

> what follows from the current symbolic knowledge?

### Cedar shows why separate small languages can work


Cedar deliberately handles one narrow question:

```text
Can principal P
perform action A
on resource R
in context C?
```


It separates authorization from business logic, and its restricted semantics make it analyzable. ([Cedar Policy Language Reference Guide](https://docs.cedarpolicy.com/?utm_source=chatgpt.com "What is Cedar? | Cedar Policy Language Reference Guide"))

That is precisely the broader design principle applied to a language.

The recommendation is not to necessarily embed Cedar itself as the universal policy layer. But the proposal is to copy the strategy:

> Give each important guarantee a constrained language whose semantics are small enough to analyze.

So you might eventually have:

```text
schema language       — what things can exist
rule language         — what follows from known facts
policy language       — who may do what
effect language       — what computation may cause
protocol language     — which temporal interactions are valid
composition language  — how components connect
```


They don't necessarily need visibly different syntaxes. They can be facets of one system.

### WIT is almost exactly the right lower boundary, but too weak semantically


The WebAssembly Component Model is quite relevant. WIT defines typed imports, exports, interfaces and "worlds" across implementation languages. ([GitHub](https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md?utm_source=chatgpt.com "component-model/design/mvp/WIT.md at main · WebAssembly/component-model · GitHub"))

Importantly, its own documentation explicitly says that WIT defines **contracts between components but does not define behavior**. ([Component Model](https://component-model.bytecodealliance.org/design/wit.html?utm_source=chatgpt.com "WIT Reference - The WebAssembly Component Model"))

That's a useful dividing line.

You could think of:

```text
WIT
──────────────
structural contract

your semantic layer
──────────────
behavior
effects
authority
guarantees
provenance
protocol
```


And compile the resulting component boundary down to Wasm.

That would let someone write a component in Python, Rust, JavaScript, Go, etc., while the substrate still controls the meaningful boundary.

<a id="if-we-had-to-start-implementing-tomorrow"></a>

### Proposed initial implementation


The recommendation is not to design a new complete programming language yet.

The proposal is to build:

```text
Semantic definitions / proofs     Lean
System models                      TLA+
Rules / provenance                Datalog
Authorization                     Cedar or Cedar-inspired
Runtime                           Rust
Plugin ABI                        Wasm Component Model / WIT
Builder syntax                    small custom DSL
```


Koka and Unison would be **language-design references**, especially for effects, rather than production dependencies. Koka itself currently describes v3 as a research language and says it isn't ready for production use. ([Koka](https://koka-lang.github.io/?utm_source=chatgpt.com "The Koka Programming Language"))

The long-term thing you may actually be designing is therefore not "a better programming language."

It is closer to a **multi-paradigm constraint language that compiles to a small semantic calculus**, with ordinary languages used for unconstrained computation behind its boundaries.

That seems much more aligned with the theory: **use the weakest language that can express each class of decision, and compose those languages through a shared semantics.**
