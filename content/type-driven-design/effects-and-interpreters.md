---
draft: false
toc: true
title: "Effects, Interpreters and Wiring"
description: "Supplying interpreters for domain algebras and deciding where effects happen: tagless final, Reader and Kleisli, free monads, ZIO and algebraic effects, compared by what their types reveal."
linkTitle: "Effects and Interpreters"
---

Once a domain is described as algebras ([Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#modules-as-algebras)), something has to supply an interpreter for each algebra and decide where effects happen. There are several ways to do it, and they differ in what the types say: whether a function's dependencies appear in its signature, whether its errors do, and whether the effects it may perform are tracked at all.

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

Granin ([PDF](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), section 13.2) compares five of these in Haskell (service handle, ReaderT, free monads, GADTs, final tagless/mtl) on simplicity, boilerplate, convenience and the language features they need (table 13.1). He finds the service handle and GADT approaches the simplest and most convenient, final tagless needs the most advanced features (type classes, phantom types, wrapped monads), and ReaderT has the most boilerplate. On testability (table 15.1) he ranks free monads best, because the program can be interpreted by a test interpreter that restricts and inspects every effect, and value- or type-based approaches over `IO` low, because a function can still bypass the interface and do I/O directly.

### The object-oriented counterpart


Most of these are functional versions of dependency injection:

- **Ports and adapters.** In Percival and Gregory ([PDF](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), chapter 2), a port is an abstract interface the domain needs (a repository) and an adapter is an implementation (a SQLAlchemy repository, a fake). That's an algebra and an interpreter. Their tests use fakes, simple in-memory implementations, rather than mocks.
- **Manual DI with closures.** Their chapter 13 ("Dependency Injection (and Bootstrapping)") wires handlers to their dependencies with closures and `functools.partial`, a service handle in Python.
- **The composition root.** Seemann ([PDF](/sources/software-engineering/craft/seemann-2019-dependency-injection-principles-practices-patterns.pdf.enc), section 4.1) defines it as the single place in an application where modules are composed together. Ghosh's figure 5.4 is the same structure: only the end-user application depends on the implementations, and every other module depends only on algebras.

## Reader and Kleisli


Ghosh ([PDF](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), section 3.3.6 and section 5.2.1, "Anatomy of a module") supplies a repository to account operations by making each operation a function *from* the repository:

```scala
type AccountOperation[A] = Kleisli[Valid, AccountRepository, A]
```


An `AccountOperation[A]` is roughly `AccountRepository => Valid[A]`, where `Valid` is the error-and-async effect. Operations compose with `andThen` or a for-comprehension without mentioning the repository, and the application supplies one at the end, by running the composed operation with a real repository or a test one. The dependency is in the type, so a function that needs the repository can't be called without one.

The cost is that the environment type grows with every dependency, and two operations with different environments don't compose without adapting one of them. ZIO's environment type (below) was an attempt to make this ergonomic.

## Tagless final


Tagless final is a typed encoding of the algebra-and-interpreter idea in [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#modules-as-algebras). Moved from [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}) on 2026-11-05.

### In brief


A starting point for the open task below, not the article itself.

The algebra becomes a trait parameterized by an effect type `F[_]`. Programs are written against the trait, and interpreters are instances for a concrete `F` (Scala 3, with cats for `Monad` and the `flatMap` syntax):

```scala
trait Accounts[F[_]]:
  def open(no: String, owner: String): F[Account]
  def debit(a: Account, amount: BigDecimal): F[Account]
  def credit(a: Account, amount: BigDecimal): F[Account]

def transfer[F[_]: Monad](accounts: Accounts[F])(from: Account, to: Account, amount: BigDecimal): F[(Account, Account)] =
  for
    f <- accounts.debit(from, amount)
    t <- accounts.credit(to, amount)
  yield (f, t)
```


One interpreter is an `Accounts[IO]` that talks to Postgres, another an in-memory one over `State` for tests, and a third might wrap either to add logging.

What it buys:

- `transfer` doesn't know whether it's running against a database, a test map or a logging wrapper
- the signature lists the capabilities a function uses (`Accounts[F]`, `Monad`), the way a constructor lists its dependencies
- testing means choosing a different interpreter, without a mocking library
- parametricity: because `transfer` knows nothing about `F` beyond `Monad`, it can't log, read the clock or start a thread unless it's given an algebra for that. Volpe ([PDF](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), chapter 2, "Parametricity") treats this, not swapping interpreters, as the main payoff, and as the answer to "why not use `IO` everywhere?": a function over concrete `IO` has all of `IO`'s power.

What it costs (the critique, as in the De Goes link below):

- `F[_]` and type-class constraints spread through the whole codebase
- the abstraction is often unused for swapping: most applications have exactly one production `F` (`IO`), so the polymorphism is paid for everywhere and exercised only in tests. (Its defenders reply with the parametricity point above, but Volpe concedes that the Scala compiler doesn't enforce it: nothing stops an interpreter's details from leaking into a program, so it depends on discipline.)
- the domain algebras have no laws. Capability classes such as `Monad` do, but an algebra like `Accounts[F]` is just an interface, and in Volpe's style that's intended. If the algebra's own rules matter (crediting then debiting leaves the balance unchanged), they have to be written as property tests, as Ghosh does ([Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#modules-as-algebras))
- type inference and compiler errors get worse, and newcomers struggle

The alternatives are plain traits over a concrete `IO` (programming to interfaces without `F`), ZIO's service pattern, free monads, and effect systems with algebraic effects (all below).

The origin is Carette, Kiselyov and Shan, *Finally Tagless, Partially Evaluated* (APLAS 2007, then JFP 2009; [PDF](/sources/programming/dsls/carette-2009-finally-tagless-partially-evaluated.pdf.enc)), which is about embedding typed languages in a host language. An *initial* encoding represents a program as a data structure (an AST) that an interpreter walks. A *final* encoding represents it as calls to an interface, so each interpreter is an implementation of that interface. *Tagless* refers to the type tags an initial interpreter needs: the interpreter's values must be wrapped in something like `IntVal | BoolVal` and checked at runtime, and the typed final encoding needs no such wrapper. See *Embedded DSLs* below for the wider picture.

### In practice


Volpe's chapter 2 ("Tagless final encoding") is the most complete practical guide in the library. Its main rules:

- **Algebras, programs, interpreters.** An algebra is an interface with a higher-kinded type (`Counter[F]`); a program combines algebras, with type-class constraints only where it needs them; an interpreter implements an algebra for a concrete `F`. Volpe notes that tagless final encodings have little to do with type classes, despite the original paper using Haskell type classes to present them.
- **No constraints on algebras.** The algebra declares operations; constraints such as `Monad` belong on the programs and interpreters that need them.
- **The least powerful constraint.** If a program only needs to sequence two effects, ask for `Apply`, not `Monad`.
- **Pass business algebras explicitly.** A signature like `def program[F[_]: Cache: Console: Users: Monad: Parallel: Items: EventsManager: HttpClient: KafkaClient: EventsPublisher]` is an anti-pattern. Implicits are for coherent type-class instances (and a few capabilities such as logging); business algebras should be ordinary parameters.
- **No monad transformers in interfaces** (chapter 1, "About monad transformers"): an interface that returns `EitherT[F, E, A]` forces every implementation into that stack.
- **Errors.** By default, let `F` carry errors through `MonadThrow`; return `F[Either[E, A]]` only when the calling logic branches on the error.

### Two critiques


- **De Goes** ([PDF](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), chapter 0) argued in the talk "The Death of Finally Tagless" that testability is tagless final's main benefit and that it can be had much more simply by passing interfaces, as object-oriented programmers have done for decades. ZIO's environment type was his alternative.
- **Granin** (section 13.2.6, "Final tagless/mtl") objects that in final tagless the business logic and the type-class instances live in the same environment, so they're tightly coupled; in a free-monad design the program and its interpreter are separate values.

### Open task


Open task: explain what the tagless final (TF) pattern does.

Cover examples, advantages and disadvantages, trade-offs, and the problems it solves. Use a project to develop an article. ^definition

### Sources


Follow-up reading (prerequisite not specified): <https://blog.softwaremill.com/final-tagless-seen-alive-79a8d884691d>

[awesome tagless final github](https://github.com/tofu-tf/awesome-tagless-final)

<https://www.reddit.com/r/scala/comments/s6ih9p/can_you_give_me_a_brief_understanding_on_tagless/>

<https://blog.rockthejvm.com/tagless-final/>

<https://www.baeldung.com/scala/tagless-final-pattern>

<https://scalac.io/blog/tagless-final-pattern-for-scala-code/>

<https://degoes.net/articles/tagless-horror>

<https://www.youtube.com/watch?v=m3Qh-MmWpbM>

### The expression problem


Expression Problem

Philip Wadler named it in 1998: can you add both new cases and new operations to a data type, without modifying or recompiling existing code, and keep static type safety? Each mainstream style makes one direction easy and the other hard:

```text
                  add a case            add an operation
class hierarchy   easy: a new subclass  hard: touch every class
sum type          hard: touch every     easy: a new function
                  match
tagless final     a new algebra trait   a new interpreter
```


Tagless final is one of the known solutions, which is why these links sit next to it. Leduc et al. in *Library sources* generalize the question from data types to extending whole languages.

<https://en.wikipedia.org/wiki/Expression_problem>

<https://eli.thegreenplace.net/2016/the-expression-problem-and-its-solutions/>

<https://eli.thegreenplace.net/2016/on-the-composite-and-interpreter-design-patterns>

### Daniel sentence


These look like the three goals Daniel Ciocîrlan sets out at the start of his Rock the JVM article (linked above):

- where TF comes from
  - from the typed-DSL work in *In brief* (Carette, Kiselyov and Shan), where the aim was to interpret embedded languages without runtime type tags. It became a Scala application-architecture style only later.
- that TF is just an extension of "programming to interfaces"
  - the algebra is the interface and the interpreter is the implementation. The one addition is that the interface is also abstract in the effect `F`, so the same program can run as `IO`, as `Either` or as a pure test.
- that TF is not the same concept as `F[_]` + type classes, but only similar in representation
  - in Scala, TF is usually *written* with `F[_]` and constraints like `F[_]: Monad`, so the two get conflated. But you can have `F[_]` and type classes without TF (generic code over any `Monad`), and TF without making the algebra a type class (pass it as an ordinary parameter, as `transfer` does with `Accounts` in *In brief*). `F[_]: Monad` is only how Scala says "the interpreter's result type supports sequencing". Volpe makes the same point (see *In practice*).

## Free monads


A free monad turns a program into data. The algebra becomes a data type of instructions (`OpenAccount`, `Debit`, `Credit`), a program is a value built from those instructions with `flatMap`, and an interpreter turns the value into effects later. Ghosh (section 5.5, "Another pattern for modularization--free monads") rewrites the account repository this way and concludes (section 5.5.5) that free monads subsume patterns such as dependency injection: the program needs no dependencies at all until it's interpreted. In chapter 8 (section 8.4.2) he models commands as free monads over events, with persistence in the interpreter.

Granin builds his whole approach to domain modeling on them (chapter 6, "Domain modeling with free monads"). His case for them is separation: the scenario describes what should happen, and the interpreter, chosen at the edge, decides how. That's also why they rank best for testability in his table 15.1: a test interpreter can observe or refuse every operation. Their costs, in his table 13.1, are some boilerplate (the instruction type and its interpreter) and awkwardness for some tasks.

The theory behind the interpreter is Plotkin and Pretnar's ([PDF](/sources/ai-engineering/harness/plotkin-2013-handling-algebraic-effects.pdf.enc)): the free model of an effect's operations is exactly this "program as data" structure, and a handler (an interpreter) is the homomorphism that the free model induces into another model. Algebraic effects, below, are the language-level form of the same idea.

## Errors and dependencies in ZIO's type


ZIO puts three things in one type, `ZIO[R, E, A]`: the environment the effect needs, the error it can fail with, and the value it produces. De Goes ([PDF](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), section 1.4) gives the mental model as a function `R => Either[E, A]`, which is Ghosh's Kleisli-over-`Either` with the repository built into one type, without stacking transformers.

Two parts matter for type-driven design:

- **Typed errors versus defects** (section 3.1, "Exceptions Versus Defects"). `E` holds the failures the domain expects, which the type forces callers to handle; defects (bugs, unexpected exceptions) are kept out of `E` and propagate separately. It's Wlaschin's split between domain errors and panics ([Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#errors-as-values)) built into the effect type.
- **How dependencies are wired.** ZIO's environment was first used for all dependencies, as an alternative to tagless final. ZIO 2's Service Pattern (sections 0.19 and 17.7-17.8) changed that: services are interfaces, implementations are classes that take their dependencies as constructor arguments, and `ZLayer` wires them together, which De Goes describes as borrowing from object-oriented design and aligning with onion architecture (section 17.4). Service interfaces don't use the environment at all. `R` remains for context that can be eliminated locally, such as a `Scope` for resources or a transaction (section 17.3, "Typical Uses for the Environment").

## Algebraic effects and effect typing


Algebraic effects make "operations plus interpreters" a language feature. A computation performs operations (`read`, `print`, `choose`, `raise`) without saying how they're implemented, and a handler installed around it gives them meaning, like an exception handler that can also resume the computation. Pretnar's introduction ([PDF](/sources/ai-engineering/harness/pretnar-2015-introduction-to-algebraic-effects-and-handlers.pdf.enc)) is the standard tutorial.

The type-driven part is the effect system. A computation's type records which operations it may perform, so a function that can print is visibly different from one that can't. Bauer and Pretnar ([PDF](/sources/ai-engineering/harness/bauer-2014-effect-system-algebraic-effects-handlers.pdf.enc)) state the motivation: effect information helps programmers understand code, find mistakes, and safely rearrange, optimize and parallelize it, and a handler that deals with all of a computation's operations turns it into a pure value.

Two caveats from Pretnar (section 6.4, "Algebraic theories"):

- The original theory gave each effect equations as well as operations (nondeterministic choice is commutative, associative and idempotent), and the equations are what justify optimizations.
- Many useful handlers (backtracking, for example) break those equations, so current work on handlers mostly drops them. It's the same gap as in tagless final: the operations are typed, but the laws are left to the programmer.

For agent systems, Tan et al.'s Etas ([PDF](/sources/ai-engineering/harness/tan-2026-etas-effect-typed-language-agent-systems.pdf.enc), [arXiv:2607.17780](https://arxiv.org/abs/2607.17780)) applies effect typing to model calls, tool calls, approvals and traces. The type of a computation separates deterministic code from model calls and from externally visible actions, and records the actions it may request. Their example is a LangGraph workflow whose graph shows the order of steps but not that one of them may send an email. This is the type-level answer to the critique of step-by-step agent specifications in [Declarative Design]({{< ref "type-driven-design/declarative-design" >}}#semantics).

## Embedded DSLs, initial and final


The two ways to embed a DSL mirror the initial and final encodings. In a **deep** embedding, the program is a data structure (an AST) that interpreters walk; in a **shallow** embedding, the program is directly its meaning, as functions. Gibbons and Wu ([PDF](/sources/programming/functional-programming/gibbons-2014-folding-dsls-deep-and-shallow-embeddings.pdf.enc)) show that a shallow embedding is a fold over the deep one, so the two are less different than they look. Moved from [Declarative Design]({{< ref "type-driven-design/declarative-design" >}}) on 2026-11-05.

Carette et al. (section 1.3) state the final encoding in the same terms: a term is represented by its denotation in a semantic algebra, and the encoding is "a way to write a typed fold function over a typed term". Each interpreter (evaluate, pretty-print, partially evaluate) is one algebra, and the same term works with all of them.

Two classic examples:

- **Hudak** ([PDF](/sources/programming/dsls/hudak-1996-building-domain-specific-embedded-languages.pdf.enc)) argues for embedding DSLs in a host language rather than building them from scratch, so the DSL inherits the host's types, modules and tools. His geometric-region example is shallow: `type Region = Point -> Bool`, so a region *is* the test for whether a point lies in it, and union and intersection are just `||` and `&&` on the results.
- **Peyton Jones, Eber and Seward** ([PDF](/sources/programming/dsls/peyton-jones-2000-composing-contracts.pdf.enc)) describe financial contracts with a small set of combinators and give them a compositional denotational semantics that says what a contract is worth. The semantics also decides when two differently written contracts are the same.

## Library sources


- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture* -- chapter 6, "Domain modeling with free monads"; section 13.2 comparing service handle, ReaderT, free monads, GADTs and final tagless/mtl (table 13.1), with 13.2.6 on final tagless; table 15.1 on testability; on *Ways to wire an algebra*, *Two critiques* and *Free monads*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- chapter 2, "Tagless final encoding": algebras, programs and interpreters, least power, implicit and explicit parameters, parametricity; chapter 1 on monad transformers in interfaces; on *Tagless final* and *In practice*
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling* -- sections 3.3.6 and 5.2.1 on repositories and Kleisli injection, figure 5.4, section 5.5 on free monads, section 8.4.2 on commands as free monads; on *Reader and Kleisli*, *The object-oriented counterpart* and *Free monads*
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon* -- chapter 0 on tagless final and the Service Pattern, section 1.4 on `ZIO[R, E, A]`, section 3.1 on exceptions and defects, chapter 17 on the environment, onion architecture and the Service Pattern; on *Two critiques* and *Errors and dependencies in ZIO's type*
- [Carette et al. 2009](/sources/programming/dsls/carette-2009-finally-tagless-partially-evaluated.pdf.enc), *Finally Tagless, Partially Evaluated: Tagless Staged Interpreters for Simpler Typed Languages* -- the paper that introduced the tagless final encoding of typed embedded languages; section 1.3 on final encodings as typed folds; on *In brief*, *Daniel sentence* and *Embedded DSLs, initial and final*
- [Percival et al. 2020](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), *Architecture Patterns with Python* -- chapter 2 on ports and adapters, chapter 3 on fakes, chapter 13 on manual DI with closures and partials; on *The object-oriented counterpart*
- [Seemann et al. 2019](/sources/software-engineering/craft/seemann-2019-dependency-injection-principles-practices-patterns.pdf.enc), *Dependency Injection: Principles, Practices, and Patterns* -- section 4.1, "Composition Root"; on *The object-oriented counterpart*
- [Pretnar 2015](/sources/ai-engineering/harness/pretnar-2015-introduction-to-algebraic-effects-and-handlers.pdf.enc), *An Introduction to Algebraic Effects and Handlers* -- operations, handlers and effect types, and section 6.4 on equational theories; on *Algebraic effects and effect typing*
- [Bauer et al. 2014](/sources/ai-engineering/harness/bauer-2014-effect-system-algebraic-effects-handlers.pdf.enc), *An Effect System for Algebraic Effects and Handlers* -- why effect types matter; on *Algebraic effects and effect typing*
- [Plotkin et al. 2013](/sources/ai-engineering/harness/plotkin-2013-handling-algebraic-effects.pdf.enc), *Handling Algebraic Effects* -- handlers as homomorphisms from free models; on *Free monads*
- [Tan et al. 2026](/sources/ai-engineering/harness/tan-2026-etas-effect-typed-language-agent-systems.pdf.enc), *Etas: An Effect-Typed Language for Agent Systems* ([arXiv:2607.17780](https://arxiv.org/abs/2607.17780)) -- effect typing for model calls, tools, approvals and traces; on *Algebraic effects and effect typing*
- [Hudak 1996](/sources/programming/dsls/hudak-1996-building-domain-specific-embedded-languages.pdf.enc), *Building Domain-Specific Embedded Languages* ([doi:10.1145/242224.242477](https://doi.org/10.1145/242224.242477)) -- the case for embedding DSLs in a host language; on *Embedded DSLs, initial and final*
- [Peyton Jones et al. 2000](/sources/programming/dsls/peyton-jones-2000-composing-contracts.pdf.enc), *Composing Contracts: An Adventure in Financial Engineering* ([doi:10.1145/351240.351267](https://doi.org/10.1145/351240.351267)) -- contracts built from combinators, with a compositional valuation semantics; on *Embedded DSLs, initial and final*
- [Gibbons et al. 2014](/sources/programming/functional-programming/gibbons-2014-folding-dsls-deep-and-shallow-embeddings.pdf.enc), *Folding Domain-Specific Languages: Deep and Shallow Embeddings* -- shows that a shallow embedding is a fold over the deep one; on *Embedded DSLs, initial and final*
- [Leduc et al. 2019](/sources/programming/dsls/leduc-2019-software-language-extension-problem.pdf.enc), *The Software Language Extension Problem* -- generalizes the expression problem to extending whole languages; on *The expression problem*
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads, 2nd Edition* -- chapters 13 and 14 on the final, initial and operational styles, free monads and extensible effects, and chapter 11 on monad transformers; on *Tagless final* and *Free monads*

Further reading:

- [Vargas 2023](/sources/programming/scala/vargas-2023-why-on-earth-a-zio-io-monad.pdf.enc), *Why on earth a ZIO IO monad for Scala?*
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*
- [Martin 2018](/sources/software-engineering/architecture/martin-2018-clean-architecture.pdf.enc), *Clean Architecture*
