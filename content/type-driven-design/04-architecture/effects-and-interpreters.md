---
draft: false
toc: true
title: "Effects, Interpreters and Wiring"
description: "Supplying interpreters for domain algebras and deciding where effects happen: Reader and Kleisli, free monads, ZIO and algebraic effects, compared by what their types reveal, plus initial and final embedded DSLs."
linkTitle: "Effects and Interpreters"
---

Once a domain is described as algebras ([Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#modules-as-algebras)), something has to supply an interpreter for each algebra and decide where effects happen. There are several ways to do it, and they differ in what the types say: whether a function's dependencies appear in its signature, whether its errors do, and whether the effects it may perform are tracked at all. Tagless final, the most discussed of them, has a note of its own: [Tagless Final]({{< ref "type-driven-design/04-architecture/tagless-final" >}}).

## Ways to wire an algebra


| Approach | How a program gets its dependencies | What the type says about effects |
|---|---|---|
| Plain interfaces over `IO` | constructor or function parameters | only that some effect happens (`IO[A]`) |
| Reader / Kleisli | an environment the computation reads (`Kleisli[F, Env, A]`) | the dependencies, in `Env` |
| Service handle | a record of functions passed as a value | the dependencies, as a parameter |
| Tagless final | an algebra `Accounts[F]` plus constraints on `F` | the capabilities used, via `F[_]: Monad` and the algebras |
| Free monads | none until interpretation: the program is data | the operations available, in the instruction set |
| ZIO | constructor injection wired by `ZLayer`; `R` for local context | environment `R`, typed error `E`, result `A` |
| Algebraic effects | handlers installed around the computation | the operations a computation may perform, in its effect type |

Granin ([PDF](/sources/1c38a03f85e649d3dcd0ebb0dbcbe9ea.bin), section 13.2) compares five of these in Haskell (service handle, ReaderT, free monads, GADTs, final tagless/mtl) on simplicity, boilerplate, convenience and the language features they need (table 13.1). He finds the service handle and GADT approaches the simplest and most convenient, final tagless needs the most advanced features (type classes, phantom types, wrapped monads), and ReaderT has the most boilerplate. On testability (table 15.1) he ranks free monads best, because the program can be interpreted by a test interpreter that restricts and inspects every effect, and value- or type-based approaches over `IO` low, because a function can still bypass the interface and do I/O directly.

### The object-oriented counterpart


Most of these are functional versions of dependency injection:

- **Ports and adapters.** In Percival and Gregory ([PDF](/sources/1b11fd9a1f1b2a8156524d833d153d29.bin), chapter 2), a port is an abstract interface the domain needs (a repository) and an adapter is an implementation (a SQLAlchemy repository, a fake). That's an algebra and an interpreter. Their tests use fakes, simple in-memory implementations, rather than mocks.
- **Manual DI with closures.** Their chapter 13 ("Dependency Injection (and Bootstrapping)") wires handlers to their dependencies with closures and `functools.partial`, a service handle in Python.
- **The composition root.** Seemann ([PDF](/sources/4cd9e0a613fdb578e4d3843433b25795.bin), section 4.1) defines it as the single place in an application where modules are composed together. Ghosh's figure 5.4 is the same structure: only the end-user application depends on the implementations, and every other module depends only on algebras.

## Reader and Kleisli


Ghosh ([PDF](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), section 3.3.6 and section 5.2.1, "Anatomy of a module") supplies a repository to account operations by making each operation a function *from* the repository:

```scala
type AccountOperation[A] = Kleisli[Valid, AccountRepository, A]
```


An `AccountOperation[A]` is roughly `AccountRepository => Valid[A]`, where `Valid` is the error-and-async effect. Operations compose with `andThen` or a for-comprehension without mentioning the repository, and the application supplies one at the end, by running the composed operation with a real repository or a test one. The dependency is in the type, so a function that needs the repository can't be called without one.

The cost is that the environment type grows with every dependency, and two operations with different environments don't compose without adapting one of them. ZIO's environment type (below) was an attempt to make this ergonomic.

## Free monads


A free monad turns a program into data. The algebra becomes a data type of instructions (`OpenAccount`, `Debit`, `Credit`), a program is a value built from those instructions with `flatMap`, and an interpreter turns the value into effects later. Ghosh (section 5.5, "Another pattern for modularization--free monads") rewrites the account repository this way and concludes (section 5.5.5) that free monads subsume patterns such as dependency injection: the program needs no dependencies at all until it's interpreted. In chapter 8 (section 8.4.2) he models commands as free monads over events, with persistence in the interpreter.

Granin builds his whole approach to domain modeling on them (chapter 6, "Domain modeling with free monads"). His case for them is separation: the scenario describes what should happen, and the interpreter, chosen at the edge, decides how. That's also why they rank best for testability in his table 15.1: a test interpreter can observe or refuse every operation. Their costs, in his table 13.1, are some boilerplate (the instruction type and its interpreter) and awkwardness for some tasks.

The theory behind the interpreter is Plotkin and Pretnar's ([PDF](/sources/b9f3722ea20feb80f7f1a466a348fb96.bin)): the free model of an effect's operations is exactly this "program as data" structure, and a handler (an interpreter) is the homomorphism that the free model induces into another model. Algebraic effects, below, are the language-level form of the same idea.

## Errors and dependencies in ZIO's type


ZIO puts three things in one type, `ZIO[R, E, A]`: the environment the effect needs, the error it can fail with, and the value it produces. De Goes ([PDF](/sources/4115845a430bc3f50ff12c191a45fd53.bin), section 1.4) gives the mental model as a function `R => Either[E, A]`, which is Ghosh's Kleisli-over-`Either` with the repository built into one type, without stacking transformers.

Two parts matter for type-driven design:

- **Typed errors versus defects** (section 3.1, "Exceptions Versus Defects"). `E` holds the failures the domain expects, which the type forces callers to handle; defects (bugs, unexpected exceptions) are kept out of `E` and propagate separately. It's Wlaschin's split between domain errors and panics ([Domain Modeling With Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}#errors-as-values)) built into the effect type.
- **How dependencies are wired.** ZIO's environment was first used for all dependencies, as an alternative to tagless final. ZIO 2's Service Pattern (sections 0.19 and 17.7-17.8) changed that: services are interfaces, implementations are classes that take their dependencies as constructor arguments, and `ZLayer` wires them together, which De Goes describes as borrowing from object-oriented design and aligning with onion architecture (section 17.4). Service interfaces don't use the environment at all. `R` remains for context that can be eliminated locally, such as a `Scope` for resources or a transaction (section 17.3, "Typical Uses for the Environment").

## Algebraic effects and effect typing


Algebraic effects make "operations plus interpreters" a language feature. A computation performs operations (`read`, `print`, `choose`, `raise`) without saying how they're implemented, and a handler installed around it gives them meaning, like an exception handler that can also resume the computation. Pretnar's introduction ([PDF](/sources/04ce5a56aaa9b4bf9a2da019657fe02e.bin)) is the standard tutorial.

The type-driven part is the effect system. A computation's type records which operations it may perform, so a function that can print is visibly different from one that can't. Bauer and Pretnar ([PDF](/sources/49566a54818cd0aa2c57c411fd26357f.bin)) state the motivation: effect information helps programmers understand code, find mistakes, and safely rearrange, optimize and parallelize it, and a handler that deals with all of a computation's operations turns it into a pure value.

Two caveats from Pretnar (section 6.4, "Algebraic theories"):

- The original theory gave each effect equations as well as operations (nondeterministic choice is commutative, associative and idempotent), and the equations are what justify optimizations.
- Many useful handlers (backtracking, for example) break those equations, so current work on handlers mostly drops them. It's the same gap as in tagless final: the operations are typed, but the laws are left to the programmer.

For agent systems, Tan et al.'s Etas ([PDF](/sources/3a1329f99a61c00c71bbcfc4c9d7e7f6.bin), [arXiv:2607.17780](https://arxiv.org/abs/2607.17780)) applies effect typing to model calls, tool calls, approvals and traces. The type of a computation separates deterministic code from model calls and from externally visible actions, and records the actions it may request. Their example is a LangGraph workflow whose graph shows the order of steps but not that one of them may send an email. This is the type-level answer to the critique of step-by-step agent specifications in [Declarative Design]({{< ref "type-driven-design/04-architecture/declarative-design" >}}#semantics).

## Embedded DSLs, initial and final


The two ways to embed a DSL mirror the initial and final encodings. In a **deep** embedding, the program is a data structure (an AST) that interpreters walk; in a **shallow** embedding, the program is directly its meaning, as functions. Gibbons and Wu ([PDF](/sources/55e41880192e3803ac43c73f98018799.bin)) show that a shallow embedding is a fold over the deep one, so the two are less different than they look. They also qualify the "initial and final" names (section 2): the two embeddings are equivalent and both correspond to initial algebras. Carette et al. call their approach "final" because a term is represented by its denotation in a semantic algebra, not because it is a final coalgebra. Moved from [Declarative Design]({{< ref "type-driven-design/04-architecture/declarative-design" >}}) on 2026-04-05.

Carette et al. (section 1.3) state the final encoding in the same terms: a term is represented by its denotation in a semantic algebra, and the encoding is "a way to write a typed fold function over a typed term". Each interpreter (evaluate, pretty-print, partially evaluate) is one algebra, and the same term works with all of them.

Two classic examples:

- **Hudak** ([PDF](/sources/8fad5eba3eb55d02bad4615c3915ef79.bin)) argues for embedding DSLs in a host language rather than building them from scratch, so the DSL inherits the host's types, modules and tools. His geometric-region example is shallow: `type Region = Point -> Bool`, so a region *is* the test for whether a point lies in it, and union and intersection are just `||` and `&&` on the results.
- **Peyton Jones, Eber and Seward** ([PDF](/sources/45766fa6e9245cae1a5b0a09767640ac.bin)) describe financial contracts with a small set of combinators and give them a compositional denotational semantics that says what a contract is worth. The semantics also decides when two differently written contracts are the same.

## Library sources


- [Granin 2025](/sources/1c38a03f85e649d3dcd0ebb0dbcbe9ea.bin), *Functional Design and Architecture* -- chapter 6, "Domain modeling with free monads"; section 13.2 comparing service handle, ReaderT, free monads, GADTs and final tagless/mtl (table 13.1); table 15.1 on testability; on *Ways to wire an algebra* and *Free monads*
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling* -- sections 3.3.6 and 5.2.1 on repositories and Kleisli injection, figure 5.4, section 5.5 on free monads, section 8.4.2 on commands as free monads; on *Reader and Kleisli*, *The object-oriented counterpart* and *Free monads*
- [De Goes et al. 2025](/sources/4115845a430bc3f50ff12c191a45fd53.bin), *Zionomicon* -- chapter 0 on the environment as an alternative to tagless final, section 1.4 on `ZIO[R, E, A]`, section 3.1 on exceptions and defects, chapter 17 on the environment, onion architecture and the Service Pattern; on *Errors and dependencies in ZIO's type*
- [Carette et al. 2009](/sources/8438a472517b14d83c46797890285d8c.bin), *Finally Tagless, Partially Evaluated: Tagless Staged Interpreters for Simpler Typed Languages* -- the paper that introduced the tagless final encoding of typed embedded languages; section 1.3 on final encodings as typed folds; on *Embedded DSLs, initial and final*
- [Percival et al. 2020](/sources/1b11fd9a1f1b2a8156524d833d153d29.bin), *Architecture Patterns with Python* -- chapter 2 on ports and adapters, chapter 3 on fakes, chapter 13 on manual DI with closures and partials; on *The object-oriented counterpart*
- [Seemann et al. 2019](/sources/4cd9e0a613fdb578e4d3843433b25795.bin), *Dependency Injection: Principles, Practices, and Patterns* -- section 4.1, "Composition Root"; on *The object-oriented counterpart*
- [Pretnar 2015](/sources/04ce5a56aaa9b4bf9a2da019657fe02e.bin), *An Introduction to Algebraic Effects and Handlers* -- operations, handlers and effect types, and section 6.4 on equational theories; on *Algebraic effects and effect typing*
- [Bauer et al. 2014](/sources/49566a54818cd0aa2c57c411fd26357f.bin), *An Effect System for Algebraic Effects and Handlers* -- why effect types matter; on *Algebraic effects and effect typing*
- [Plotkin et al. 2013](/sources/b9f3722ea20feb80f7f1a466a348fb96.bin), *Handling Algebraic Effects* -- handlers as homomorphisms from free models; on *Free monads*
- [Tan et al. 2026](/sources/3a1329f99a61c00c71bbcfc4c9d7e7f6.bin), *Etas: An Effect-Typed Language for Agent Systems* ([arXiv:2607.17780](https://arxiv.org/abs/2607.17780)) -- effect typing for model calls, tools, approvals and traces; on *Algebraic effects and effect typing*
- [Hudak 1996](/sources/8fad5eba3eb55d02bad4615c3915ef79.bin), *Building Domain-Specific Embedded Languages* ([doi:10.1145/242224.242477](https://doi.org/10.1145/242224.242477)) -- the case for embedding DSLs in a host language; on *Embedded DSLs, initial and final*
- [Peyton Jones et al. 2000](/sources/45766fa6e9245cae1a5b0a09767640ac.bin), *Composing Contracts: An Adventure in Financial Engineering* ([doi:10.1145/351240.351267](https://doi.org/10.1145/351240.351267)) -- contracts built from combinators, with a compositional valuation semantics; on *Embedded DSLs, initial and final*
- [Gibbons et al. 2014](/sources/55e41880192e3803ac43c73f98018799.bin), *Folding Domain-Specific Languages: Deep and Shallow Embeddings* -- section 2, "Embedding DSLs", contrasts deep and shallow embeddings (only a compositional semantics fits a shallow one); section 4, "Folds", shows that each compositional observer is a fold over the deep embedding, 4.1, "Multiple interpretations", gets several interpretations by tupling (the banana-split law), 4.4, "Parametrized interpretations", gives the shallow embedding as the Church encoding of the AST, so deep and shallow are each other's inverses, and 4.7, "Modular interpretations", assembles DSLs à la carte, the technique behind effect handlers; on *Embedded DSLs, initial and final*
- [Serrano Mena 2021](/sources/4f6f84b5680da34841126999b31e2ed3.bin), *Book of Monads, 2nd Edition* -- section 13.1.1, "Syntax and Interpretation", on separating a monad's algebra from its interpreters, on *Ways to wire an algebra*; section 13.3, "Initial Style", and 13.3.1, "Free Monads", on `Free` over a pattern functor with interpreters as natural transformations, section 13.4, "Operational Style and Freer Monads" (Cats' and Scalaz's `Free` are freer monads), and section 13.5, "Transforming and Inspecting Computations", on rewriting a program before running it (a `push` followed by a `pop`), on *Free monads*; chapter 11, "A Solution: Monad Transformers", and sections 14.2, "Initial and Operational Style", and 14.3, "Extensible Effects", on combining instruction sets with coproducts and on extensible effects as an alternative to transformers, a single `Eff` monad indexed by a type-level list of effects with handlers, on *Algebraic effects and effect typing*

Further reading:

- [Vargas 2023](/sources/1f40f87f29d5d7e59178edbc1c0104fa.bin), *Why on earth a ZIO IO monad for Scala?*
- [Rosien 2021](/sources/26d28e80e57cc7f4abab6120e2fa075d.bin), *Essential Effects*
- [Martin 2018](/sources/0f46f5de730b51708bc07368aedb47d5.bin), *Clean Architecture*
- Gibbons and de Moor 2003, *The Fun of Programming* -- chapter 7, Elliott, "Functional images", on Pan, a shallow DSEL in which `Image a = Point -> a` and `Region = Image Bool`, with a region algebra (7.7), implemented by a compiler that fuses and optimises the image code (7.1); on *Embedded DSLs, initial and final*
