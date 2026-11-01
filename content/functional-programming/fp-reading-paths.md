---
draft: false
toc: true
title: "Fp Reading Paths"
linkTitle: "Fp Reading Paths"
---
# Reading paths


Study material for functional programming, grouped by goal: four reading paths through the books in the local library, followed by the general links collected earlier. Language-specific resources are in [Haskell]({{< ref "functional-programming/haskell" >}}#resources), [Scala]({{< ref "functional-programming/scala" >}}#sources) and [Effect Systems]({{< ref "functional-programming/effect-systems" >}}).

The reading paths were written on 2026-11-05 from the tables of contents of the library books. The links under "Other resources" are the original note text, with commentary in callouts titled **Explanation** and **Critique**.

## Choosing a path

```text
Scala, first steps to production
    Plachta → Pilquist (FPiS 2e) → Welsh (Scala with Cats)
            → Rosien (Essential Effects) → Volpe (Practical FP in Scala)
            → Volpe (Functional Event-Driven Architecture)
    ZIO branch: Zionomicon, in place of or after Rosien

Haskell
    Allen and Moronuki, or Skinner → Bragilevsky → Maguire
    branches: Marlow (parallelism and concurrency),
              Serrano Mena (Book of Monads; Almost Standard Libraries)

Designing applications functionally
    Wlaschin → Ghosh (Scala) or Granin (Haskell)

Theory
    lambda calculus: Rojas → Sestoft → Pierce, ch. 5
    folds:           Hutton → Gibbons (Origami)
    categories:      Milewski
```


The Scala and Haskell paths teach the same concepts and can be read side by side. For example, the Monoid, Monad and Applicative chapters of *Functional Programming in Scala* (ch. 10-12) cover the same ground as chapters 15-21 of *Haskell Programming from First Principles*. Exercises for all paths are collected in [Exercises And Projects]({{< ref "functional-programming/exercises-and-projects" >}}).

## Scala: from first steps to production


This path goes from pure functions to a deployed service on the Typelevel stack (Cats, Cats Effect, fs2), with ZIO as an alternative at the effect-system step. The books differ in Scala version: Plachta, Pilquist and *Functional Event-Driven Architecture* use Scala 3, while Welsh and *Practical FP in Scala* use Scala 2.13, so their `implicit` code needs translating to `given` and `using`. See [Scala]({{< ref "functional-programming/scala" >}}) for the language itself.

1. **Michał Płachta, _Grokking Functional Programming_** (Płachta 2022). The gentlest start. It teaches FP from scratch in Scala 3 with small problems and gets as far as Cats Effect `IO`, fs2 streams and ScalaCheck. Part 1 (ch. 1-4) covers pure functions, immutable values and functions as values (`map`, `filter`, `foldLeft`); Part 2 covers `flatMap` and for comprehensions (ch. 5), `Option` and `Either` (ch. 6), newtypes and ADTs (ch. 7), `IO` (ch. 8), streams (ch. 9), and `Ref` and fibers (ch. 10); Part 3 covers program design with `Resource` (ch. 11) and testing, including property-based tests (ch. 12).
    Supports [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}), [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}), [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}), [Map Flatmap]({{< ref "functional-programming/map-flatmap" >}}), [Error Handling]({{< ref "functional-programming/error-handling" >}}), [Streams]({{< ref "functional-programming/streams" >}}), [Concurrency]({{< ref "functional-programming/concurrency" >}}) and [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}).
    Readers who already write Scala can skim Part 1, including the Java comparisons in ch. 4, and start at ch. 5. The book never uses the words "monad" or "functor"; the next two books name the patterns it teaches.
2. **Michael Pilquist, Rúnar Bjarnason and Paul Chiusano, _Functional Programming in Scala_, 2nd edition** ([Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc)). The core book of the path, updated for Scala 3. You build everything yourself through exercises: functional data structures, `Option` and `Either`, laziness and state (Part 1, ch. 1-6); three combinator libraries designed from their algebra, for parallelism, property-based testing and parsing (Part 2, ch. 7-9); monoids, monads, applicative and traversable functors (Part 3, ch. 10-12); and an `IO` type, local mutation and stream processing (Part 4, ch. 13-15).
    Supports [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}) (ch. 5), [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}) (ch. 3), [Error Handling]({{< ref "functional-programming/error-handling" >}}) (ch. 4), [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}) (ch. 8), [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}) (ch. 10), [Functor]({{< ref "functional-programming/functor" >}}) and [Monads]({{< ref "functional-programming/monads" >}}) (ch. 11), [Applicative]({{< ref "functional-programming/applicative" >}}) and [Traversable]({{< ref "functional-programming/traversable" >}}) (ch. 12), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}) (ch. 13) and [Streams]({{< ref "functional-programming/streams" >}}) (ch. 15).
    Do the exercises; reading without them loses most of the value. Part 2 is the hardest stretch and can be read after Part 3. Ch. 13-15 explain how an `IO` type and a pull-based stream work inside; read them for understanding, then use Cats Effect and fs2 in practice. The companion booklet ([Bjarnason 2015](/sources/programming/scala/bjarnason-2015-fpis-companion-booklet.pdf.enc)) has chapter notes and exercise hints written for the first edition; its chapter titles match the second edition. The 2013 early-access draft of the first edition ([Chiusano and Bjarnason 2013](/sources/programming/scala/chiusano-2013-functional-programming-in-scala-meap-v10.pdf.enc)) is superseded and can be skipped.
3. **Noel Welsh and Dave Gurnell, _Scala with Cats_** ([Welsh 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc)). The same abstractions as Part 3 of the previous book, this time as the Cats library provides them. Written for Scala 2.13 and Cats 2.1. Part I covers type classes (ch. 1), monoids and semigroups (ch. 2), functors, including contravariant and invariant ones (ch. 3), monads, including `Id`, `Either` with `MonadError`, `Eval`, `Writer`, `Reader` and `State` (ch. 4), monad transformers (ch. 5), `Semigroupal` and `Applicative` (ch. 6), and `Foldable` and `Traverse` (ch. 7). Part II has four case studies.
    Supports [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}), [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}), [Functor]({{< ref "functional-programming/functor" >}}), [Monads]({{< ref "functional-programming/monads" >}}), [Applicative]({{< ref "functional-programming/applicative" >}}), [Traversable]({{< ref "functional-programming/traversable" >}}) and [Error Handling]({{< ref "functional-programming/error-handling" >}}).
    Read ch. 1-7 in order; sections 3.6-3.7 (contravariant and invariant functors) can wait. Of the case studies, data validation (ch. 10) matters most for [Error Handling]({{< ref "functional-programming/error-handling" >}}); map-reduce (ch. 9) is a short exercise in monoids and `foldMap`; CRDTs (ch. 11) are optional.
4. **Adam Rosien, _Essential Effects_** ([Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc)). A short, focused book on Cats Effect. It starts from the substitution model and the "effect pattern" (ch. 1), then covers `IO` (ch. 2), parallel execution with `parMapN` and `parTraverse` (ch. 3), fibers, cancellation and racing (ch. 4), execution contexts for blocking work (ch. 5), callbacks and `Future` (ch. 6), `Resource` (ch. 7), testing (ch. 8), `Ref` and `Deferred` (ch. 9), and ends with a job-scheduler case study (ch. 10).
    Supports [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}), [Concurrency]({{< ref "functional-programming/concurrency" >}}) and [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}).
    The library copy is a 2021 draft that covers Cats Effect 2 and 3 and marks where they differ. Follow the Cats Effect 3 version wherever the two differ; appendix C lists the changes.
5. **Gabriel Volpe, _Practical FP in Scala_, 2nd edition** ([Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc)). How to build a real service: a shopping-cart backend with Cats Effect 3, http4s, Skunk and Redis. Ch. 1 collects best practices (newtypes and refinement types, state in `Ref`, anti-patterns such as Boolean blindness, error handling with `MonadError`); ch. 2 explains tagless final; ch. 3-10 build and ship the application (business logic, HTTP, type-class derivation, persistence, testing, assembly, deployment); a bonus chapter covers MTL and optics.
    Supports [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}), [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}), [Error Handling]({{< ref "functional-programming/error-handling" >}}), [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}) (ch. 8, with ScalaCheck generators and the Weaver test framework) and [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) (ch. 1).
    Ch. 1, 2, 4 and 8 carry the ideas; ch. 5-7 and 9 are mostly about specific libraries; ch. 10 (Docker, CI, Nix) can be skipped unless you deploy. Schwarz's short deck on `traverse_` in the shopping-cart code ([Schwarz 2023](/sources/programming/scala/schwarz-2023-sighting-of-cats-traverse-in-practical-fp.pdf.enc)) is a companion for [Traversable]({{< ref "functional-programming/traversable" >}}).
6. **Gabriel Volpe, _Functional Event-Driven Architecture_** ([Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc)). The follow-up, in Scala 3 and built around fs2 and Apache Pulsar. Part I explains event-driven architecture, CQRS and event sourcing, idempotence and atomicity in distributed systems, and schema evolution (ch. 1-3); Part II is a Scala 3 refresher (domain modeling, type classes, dependent types; ch. 4) and a chapter on effectful streams (state machines, resources, pipelines, producer-consumer; ch. 5); Part III builds a trading system with tracing and monitoring (ch. 6-8).
    Supports [Streams]({{< ref "functional-programming/streams" >}}), [Concurrency]({{< ref "functional-programming/concurrency" >}}) and [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}).
    Ch. 5 is the core for this section. Part I is useful background on its own. The bonus web-app chapter (ch. 9, Elm and Scala.js) is optional.

**ZIO branch: John De Goes, Adam Fraser and Milad Khajavi, _Zionomicon_** ([De Goes 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc)). The ZIO counterpart to Rosien and Volpe together, updated for ZIO 2.1. It covers the ZIO error model (ch. 3), fibers, interruption and supervision (ch. 5-8), concurrent structures (`Ref`, `Promise`, `Queue`, `Hub`, `Semaphore`; ch. 9-13), resources and scopes (ch. 14-16), dependency injection with layers (ch. 17-19), software transactional memory (ch. 21-23), retries and error-management practice (ch. 24-26), ZStream (ch. 27-33), the runtime and observability (ch. 37-39) and testing, including property-based testing (ch. 40-47). Appendix 3 is on functional design.

Supports [Effect Systems]({{< ref "functional-programming/effect-systems" >}}), [Concurrency]({{< ref "functional-programming/concurrency" >}}), [Streams]({{< ref "functional-programming/streams" >}}), [Error Handling]({{< ref "functional-programming/error-handling" >}}), [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) and [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}).

It is long and reads best as a reference: ch. 1-9 in order, then the parts you need. Ch. 34-36 (schemas, ZIO HTTP, gRPC) are library-specific. Cats Effect and ZIO solve the same problems, so take this branch in place of, or after, Rosien rather than alongside it.

## Haskell: from first principles to type-level programming


This path learns the language with one long introductory book, consolidates it with an intermediate book on real applications, and ends with type-level programming. Haskell names the abstractions directly, so it pairs well with the Scala path. See [Haskell]({{< ref "functional-programming/haskell" >}}) for the language notes and ecosystem.

1. Start with one of two introductions.
    - **Christopher Allen and Julie Moronuki, _Haskell Programming from First Principles_** ([Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc)). The thorough route, at over 1,100 pages and with exercises in every chapter. It begins with the lambda calculus (ch. 1), then types, type classes, recursion, lists and folds (ch. 2-10), algebraic datatypes and `Maybe`/`Either` (ch. 11-12), testing with QuickCheck (ch. 14), the type-class tower from `Semigroup` and `Monoid` through `Functor`, `Applicative`, `Monad`, `Foldable` and `Traversable` (ch. 15-21), `Reader` and `State` (ch. 22-23), parser combinators, composing types and monad transformers (ch. 24-26), non-strictness (ch. 27), and IO and exceptions (ch. 29-30).
      Supports nearly every concept note: [Lambda Calculus]({{< ref "functional-programming/lambda-calculus" >}}) (ch. 1), [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}) (ch. 8, 10, 20), [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}) (ch. 15), [Functor]({{< ref "functional-programming/functor" >}}) (ch. 16), [Applicative]({{< ref "functional-programming/applicative" >}}) (ch. 17), [Monads]({{< ref "functional-programming/monads" >}}) (ch. 18, 22-23), [Traversable]({{< ref "functional-programming/traversable" >}}) (ch. 21), [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) (ch. 25-26), [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}) (ch. 27) and [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}) (ch. 14).
      Readers who know FP from Scala can move quickly through ch. 2-5. Ch. 13 (building projects) is tooling and may be dated; check the tool versions against current practice.
    - **Rebecca Skinner, _Effective Haskell_** ([Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc)). The practical route, targeting GHC 9.4. It reaches IO early (ch. 7) and puts `Functor`, `Applicative`, `Monad` and their laws in a single chapter (ch. 9); later chapters cover mutable references and laziness in IO (ch. 10), serialization (ch. 11-12), monad transformer stacks (ch. 13), performance with memoization, `ST` and vectors (ch. 14), and type-level programming with kinds, type families and GADTs (ch. 15).
      Supports [Haskell]({{< ref "functional-programming/haskell" >}}), [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}), [Functor]({{< ref "functional-programming/functor" >}}), [Applicative]({{< ref "functional-programming/applicative" >}}), [Monads]({{< ref "functional-programming/monads" >}}), [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) and [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}) (ch. 10).
      It has no chapter on property-based testing; take that from Allen and Moronuki (ch. 14) or Bragilevsky (ch. 8).
    Choose Allen and Moronuki for the full drill, Skinner if FP is already familiar and the goal is working Haskell.
2. **Vitaly Bragilevsky, _Haskell in Depth_** ([Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc)). The intermediate step: how Haskell applications are built and maintained. Part 2 covers projects and packages (ch. 4), `Reader`, `Writer` and `State` in practice (ch. 5) and monad transformer stacks (ch. 6); Part 3 covers error handling and logging (ch. 7), tests with Hspec and property tests with Hedgehog (ch. 8), memory and evaluation at run time (ch. 9), and benchmarking and profiling (ch. 10); Part 4 covers data kinds, type families, GADTs and rank-N types (ch. 11), generics and Template Haskell (ch. 12), and types for web APIs and singletons (ch. 13); Part 5 covers streaming pipelines (ch. 14), databases (ch. 15) and concurrency, including `async` and STM (ch. 16).
    Supports [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}), [Error Handling]({{< ref "functional-programming/error-handling" >}}), [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}), [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}), [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}), [Streams]({{< ref "functional-programming/streams" >}}) and [Concurrency]({{< ref "functional-programming/concurrency" >}}).
    Part 1 overlaps the first book and can be skimmed; ch. 4 and ch. 15 are tooling and library walkthroughs; Part 4 overlaps Maguire, so read one of the two first.
3. **Sandy Maguire, _Thinking with Types_** ([Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc)). Type-level programming in GHC. Part I is the algebra behind types, kinds and variance (ch. 1-3); Part II covers GADTs, rank-N and existential types, and roles (ch. 4-8); Part III covers type families, extensible data, custom type errors, generics, indexed monads and dependent types (ch. 9-15).
    Supports [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}) and, in the type-driven-design section, [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}) and [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}).
    Part I is worth reading for anyone, including Scala programmers. Part III is aimed at library authors; ch. 14-15 are optional.

Branches, to read when the topic comes up:

- **Simon Marlow, _Parallel and Concurrent Programming in Haskell_** ([Marlow 2013](/sources/programming/functional-programming/marlow-2013-parallel-and-concurrent-programming-in-haskell.pdf.enc)). Part I is parallelism: the `Eval` monad and evaluation strategies, which depend on weak head normal form (ch. 2-3), the `Par` monad (ch. 4), Repa and Accelerate (ch. 5-6). Part II is concurrency: threads and `MVar`s, overlapping I/O, cancellation and timeouts, STM, higher-level abstractions and network servers (ch. 7-12).
  Supports [Concurrency]({{< ref "functional-programming/concurrency" >}}) and [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}). Ch. 2-4 and 7-12 are the core. Ch. 5-6 and 14 (distributed programming) rely on specific libraries; check their current status before working through them. Part II is good background for the fiber and STM chapters of Rosien and the Zionomicon.
- **Alejandro Serrano Mena, _Book of Monads_, 2nd edition** ([Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc)). Everything about monads in one place: discovering them, notation, applicatives and traversables, and the laws (Part I); `Reader`, `Writer`, `State`, failure, mutability and continuations (Part II); why monads do not compose, transformers and MTL style (Part III); custom monads in final, initial and operational style, free monads and extensible effects (Part IV); and the theory, monoids and adjunctions (Part V).
  Supports [Monads]({{< ref "functional-programming/monads" >}}), [Applicative]({{< ref "functional-programming/applicative" >}}), [Traversable]({{< ref "functional-programming/traversable" >}}), [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}) and [Category Theory]({{< ref "functional-programming/category-theory" >}}). Part I repeats what the introductions cover; Parts III and IV are the reason to read it. Part V is a bridge to the theory path.
- **Alejandro Serrano Mena, _Haskell: Almost Standard Libraries_** ([Serrano Mena 2022](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc)). A survey of the libraries most Haskell code uses beyond `base`: containers, text and bytes, serialization, validation and parsing, optics, exceptions and resources, streaming (ch. 15), `async` (ch. 18), web applications, effect architectures such as `RIO` and effect systems (ch. 22), and testing, including property-based testing (ch. 23).
  Supports [Haskell]({{< ref "functional-programming/haskell" >}}), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}), [Streams]({{< ref "functional-programming/streams" >}}), [Concurrency]({{< ref "functional-programming/concurrency" >}}) and [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}). A reference: read the chapter you need when a project needs it.

## Designing applications functionally


These books are about the shape of whole programs: domain types, workflows, where effects go and how modules depend on each other. The type-driven-design section covers the domain-modeling side in more depth; see [its reading paths]({{< ref "type-driven-design/reading-paths" >}}), [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}) and [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}).

1. **Scott Wlaschin, _Domain Modeling Made Functional_** ([Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc)). The starting point, in F#. Domain-driven design and a functional architecture (ch. 1-3), domain modeling with types and invariants (ch. 4-6), workflows as pipelines of functions (ch. 7-9), errors as values (ch. 10), serialization and persistence at the edges (ch. 11-12), and evolving the design (ch. 13).
    Supports [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}), [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}), [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}), [Error Handling]({{< ref "functional-programming/error-handling" >}}) and [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#functional-core-imperative-shell).
    Readers who know DDD can skim ch. 1-2. Ch. 4-6 and 9-10 are the core. Schwarz's slides ([Schwarz 2020](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc)) translate the early modeling chapters into Scala 3.
2. Then one of two books, depending on the language.
    - **Debasish Ghosh, _Functional and Reactive Domain Modeling_** ([Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc)). The Scala version, written with Scalaz and Akka. It designs domain services as algebras (ch. 3), uses functional patterns such as functors, applicatives and monads in domain code (ch. 4), modularizes with type classes and free monads (ch. 5), makes the model reactive with futures, actors and Akka Streams (ch. 6-7), and covers event sourcing (ch. 8) and property-based testing with ScalaCheck (ch. 9).
      Supports [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}), [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}), [Streams]({{< ref "functional-programming/streams" >}}) and [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}).
      The ideas in ch. 3-5 and 8 have aged better than the library code; current Scala FP code mostly uses Cats Effect or ZIO instead of Scalaz and Akka. Volpe's books (Scala path, steps 5-6) show the same ideas on today's stack.
    - **Alexander Granin, _Functional Design and Architecture_** ([Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc)). The Haskell version, and the broadest on architecture. It covers functional declarative design (ch. 1-2), building an MVP end to end, with services behind the Service Handle pattern (ch. 3-4), embedded DSLs and domain modeling with free monads (ch. 5-6), stateful and reactive applications (ch. 7-8), and, for real-world software, a concurrent application framework, persistence, error handling and dependency inversion, business logic and testing (ch. 9-15).
      Supports [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}) and [Error Handling]({{< ref "functional-programming/error-handling" >}}).
      The free-monad approach of Part 3 is the book's distinctive idea; compare it with tagless final in Volpe (*Practical FP in Scala*, ch. 2) and with the `ReaderT` pattern in [Haskell]({{< ref "functional-programming/haskell" >}}). This is the book mentioned under Books below, now in the library.

## Theory: lambda calculus, folds and category theory


None of this is needed to write functional programs, but it explains why the patterns work and makes the papers readable. Read it alongside the practical paths rather than first.

Lambda calculus and evaluation:

1. **Raúl Rojas, _A Tutorial Introduction to the Lambda Calculus_** ([Rojas 1997](/sources/programming/functional-programming/rojas-1997-tutorial-introduction-to-lambda-calculus.pdf.enc)). Nine pages: reduction, Church numerals and booleans, and recursion through the fixed-point combinator. Supports [Lambda Calculus]({{< ref "functional-programming/lambda-calculus" >}}).
2. **Peter Sestoft, _Demonstrating Lambda Calculus Reduction_** ([Sestoft 2002](/sources/programming/functional-programming/sestoft-2002-demonstrating-lambda-calculus-reduction.pdf.enc)). The reduction strategies (call-by-value, call-by-name, normal and applicative order) side by side. Supports [Lambda Calculus]({{< ref "functional-programming/lambda-calculus" >}}) and [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}).
3. **Benjamin Pierce, _Types and Programming Languages_** ([Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc)), ch. 5 (the untyped lambda calculus) and ch. 9 (the simply typed lambda calculus). Precise definitions of substitution and evaluation. The rest of the book belongs to the type-driven-design path.
4. For lazy evaluation in GHC specifically, Takenobu's illustrated slides ([Takenobu 2016](/sources/programming/functional-programming/takenobu-2016-lazy-evaluation-illustrated-for-haskell.pdf.enc)) cover weak head normal form, thunks and graph reduction; they are a draft. Hughes's *Why Functional Programming Matters* (in Library sources) makes the case for laziness and higher-order functions as tools for modularity. Both support [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}).

Folds and recursion schemes:

1. **Graham Hutton, _A Tutorial on the Universality and Expressiveness of Fold_** ([Hutton 1999](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc)). The universal property of `fold` as a proof and definition principle. Supports [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}).
2. **Jeremy Gibbons, _Origami Programming_** ([Gibbons 2003](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc)). Folds and unfolds over lists and trees as a structured alternative to direct recursion. Supports [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}).
3. For proofs about list functions, Zhang's short structural-induction tutorial ([Zhang 2021](/sources/programming/functional-programming/zhang-2021-structural-induction-tutorial.pdf.enc)). For equational reasoning applied to algorithm design, Bird and Gibbons ([Bird and Gibbons 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc)), with nearly 300 exercises. The Meijer, Fokkinga and Paterson "bananas" paper ([Meijer et al. 1991](/sources/programming/functional-programming/meijer-1991-functional-programming-with-bananas-lenses.pdf.enc)) is the classic on recursion schemes, but the library copy has only its first 5 pages.
4. Gibbons and Oliveira's *The Essence of the Iterator Pattern* ([Gibbons and Oliveira 2009](/sources/programming/functional-programming/gibbons-2009-essence-of-the-iterator-pattern.pdf.enc)) shows `traverse` capturing both mapping and accumulation. Supports [Traversable]({{< ref "functional-programming/traversable" >}}) and [Applicative]({{< ref "functional-programming/applicative" >}}).

Category theory:

1. **Bartosz Milewski, _Category Theory for Programmers_, Scala edition** ([Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc)). The programmer's route, with Haskell and Scala examples. Part One (ch. 1-10) covers composition, types and functions, Kleisli categories, products and coproducts, algebraic data types, functors and natural transformations; Part Two (ch. 11-16) covers limits, free monoids, representable functors and the Yoneda lemma; Part Three (ch. 17-31) covers adjunctions, monads, comonads, F-algebras and more advanced material.
    Supports [Category Theory]({{< ref "functional-programming/category-theory" >}}), [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}), [Functor]({{< ref "functional-programming/functor" >}}), [Monads]({{< ref "functional-programming/monads" >}}) and [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}), and [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}) through F-algebras (ch. 24).
    Part One is the core. In Part Three, read ch. 18 (adjunctions), ch. 20-22 (monads) and ch. 24 (F-algebras); ch. 26-30 (ends, Kan extensions, enriched categories, topoi, Lawvere theories) are for readers going on to the mathematics. Ch. 4 pairs with Schwarz's Kleisli deck ([Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc)), which derives `flatMap`, `join` and Kleisli composition from each other.
2. For a gentler, mathematics-first account, Cheng's *The Joy of Abstraction* ([Cheng 2023](/sources/programming/category-theory/cheng-2023-joy-of-abstraction.pdf.enc)). Simmons ([Simmons 2011](/sources/programming/category-theory/simmons-2011-introduction-to-category-theory.pdf.enc)) and Adámek, Herrlich and Strecker ([Adámek et al. 2004](/sources/programming/category-theory/adamek-2004-abstract-and-concrete-categories-joy-of-cats.pdf.enc)) are mathematicians' texts, useful only as references. Part V of the *Book of Monads* (Haskell path) bridges monads and the theory. See [Category Theory]({{< ref "functional-programming/category-theory" >}}#resources) for the online material.

## Other resources


The general links collected before the reading paths were written, organised by kind.

### Articles

#### Functors, applicatives and monads


<https://sidburn.github.io/blog/2016/03/27/understanding-map>

<https://sidburn.github.io/blog/2016/03/31/applicative-functors>

<https://sidburn.github.io/blog/2016/04/03/understanding-bind>

<https://www.adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html>

<https://github.com/dbrattli/OSlash/wiki/Functors,-Applicatives,-And-Monads-In-Pictures>

<https://freecontent.manning.com/lists-as-context-a-deeper-look-at-the-applicative-type-class/>

#### Other articles


lazy lists: <https://twitter.com/justinhj/status/1594482044834545664?t=6Kghx8FmQKitTQAepWfJRw&s=35>

<https://freecontent.manning.com/articles/>

interesting article <https://medium.com/pragmatic-programmers/thinking-functionally-with-haskell-types-tests-we-need-a-new-word-cdbaf54ddef7>

<https://softwaremill.com/principles-of-developing-applications-in-scala/>

also: Hutton # Programming language semantics: It's easy as 1,2,3

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A paper by Graham Hutton in the *Journal of Functional Programming* (2023). It takes the smallest interesting language, integers and addition, and uses it to present the main styles of semantics side by side: denotational, small-step and big-step operational semantics, abstract machines and compilation, each written as a short Haskell program. A good companion to [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}) and [Lambda Calculus]({{< ref "functional-programming/lambda-calculus" >}}).
{{< /callout >}}

### Books


new books download:

learn haskell by example by philipp hagenlocker

functional design and architecture in haskell

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Both are recent Manning books and neither is in the local library yet. *Learn Haskell by Example* is by Philipp Hagenlocker, project-based. *Functional Design and Architecture* is by Alexander Granin, about structuring larger Haskell applications. Both are worth checking for edition and year before buying.
{{< /callout >}}


books

<https://htdp.org/2023-8-14/Book/index.html> how to design programs

### Courses


<https://www.coursera.org/specializations/scala>

do course <https://www.seas.upenn.edu/~cis1940/spring13/lectures.html>

<https://www.educative.io/blog/haskell-tutorial>

work on courses:

<https://github.com/jdegoes/foundations-scala/tree/main>

<https://github.com/jdegoes/functional-design>

<https://github.com/jdegoes/foundations-streaming>

<https://github.com/jdegoes/advanced-functional-design>

<https://github.com/jdegoes/functional-effects>

<https://github.com/jdegoes/zio-workshop>

<https://github.com/jdegoes/functional-data-modeling>

### Talks and conferences

#### Talks


<https://www.youtube.com/watch?v=to8ISIQjETk>

haskell live coding

big <https://www.youtube.com/watch?v=xiBSb0A_3SQ&list=PLyQXlWxYAh8_9_Q-XeyIF4CmQbE9b0Oc0&index=53>

<https://www.youtube.com/playlist?list=PLIpl4GKFQR6dZKCoIb59b7v2AMb6yj4gd>

<https://www.youtube.com/watch?v=ColY2dknvJs>

#### Conferences


conferences:

Compose conference: <https://www.youtube.com/@composeconference4383>

"Lambda Conference" <https://www.youtube.com/@LambdaConf>

Several Playlists: <https://www.youtube.com/@skills_matter/playlists>

Scala Days <https://www.youtube.com/@ScalaDaysConferences>

### Journals and blogs


Journals:

functional programming journal

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The *Journal of Functional Programming* (JFP), published by Cambridge University Press, is the main journal of the field; the Hutton paper above appeared there. Most new research appears first at conferences, above all ICFP, whose papers are published in the journal *Proceedings of the ACM on Programming Languages* (PACMPL).
{{< /callout >}}


blog: <https://earldouglas.com/posts.html>

### Slides


work on slides of <https://speakerdeck.com/philipschwarz?page=2>

<http://fpilluminated.com/assets/slide-decks-in-reverse-chronological-order.html>

<https://www.slideshare.net/pjschwarz/monad-transformers-part-1>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Several of Philip Schwarz's decks are saved in the library (see Library sources), including *Monads do not Compose*, which motivates monad transformers, the topic of the last deck linked above.
{{< /callout >}}


See also: [Haskell]({{< ref "functional-programming/haskell" >}}#resources), [Scala]({{< ref "functional-programming/scala" >}}#sources), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}), [Exercises And Projects]({{< ref "functional-programming/exercises-and-projects" >}}), [Category Theory]({{< ref "functional-programming/category-theory" >}}#resources).

## Library sources


- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: the classic general argument for FP, through higher-order functions and laziness.
  - Also in *Theory*, lambda calculus and evaluation, item 4.
- [Schwarz 2019](/sources/programming/scala/schwarz-2019-monads-do-not-compose.pdf.enc), *Monads do not Compose*: slides showing why monads need transformers to compose; on the monad-transformers deck under Slides.
  - Also a companion to Part III of the *Book of Monads* and ch. 5 of *Scala with Cats* on monad transformers.
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: an alternative to the new Haskell books under Books.
  - Step 1 of *Haskell*, the thorough option.
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*
  - Step 2 of *Scala*: Parts 1-4, with the exercises.
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-sighting-of-cats-traverse-in-practical-fp.pdf.enc), *A sighting of traverse_ in Practical FP in Scala*
  - On step 5 of *Scala*, as a companion to *Practical FP in Scala*.
- [Schwarz 2020](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc), *Scala 3 by Example: ADTs for DDD, Part 1*
  - On step 1 of *Designing applications functionally*, translating Wlaschin's early chapters to Scala 3.
- Płachta 2022, *Grokking Functional Programming*: step 1 of *Scala*.
- [Bjarnason 2015](/sources/programming/scala/bjarnason-2015-fpis-companion-booklet.pdf.enc), *A companion booklet to Functional Programming in Scala*: chapter notes and hints, on step 2 of *Scala*.
- [Chiusano and Bjarnason 2013](/sources/programming/scala/chiusano-2013-functional-programming-in-scala-meap-v10.pdf.enc), *Functional Programming in Scala* (MEAP version 10): superseded draft, noted on step 2 of *Scala*.
- [Welsh 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: step 3 of *Scala*.
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*: step 4 of *Scala*.
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition*: step 5 of *Scala*.
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture*: step 6 of *Scala*.
- [De Goes 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*: the ZIO branch of *Scala*.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: step 1 of *Haskell*, the practical option.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: step 2 of *Haskell*.
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types*: step 3 of *Haskell*.
- [Marlow 2013](/sources/programming/functional-programming/marlow-2013-parallel-and-concurrent-programming-in-haskell.pdf.enc), *Parallel and Concurrent Programming in Haskell*: a branch of *Haskell*.
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads, 2nd Edition*: a branch of *Haskell*.
- [Serrano Mena 2022](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc), *Haskell: Almost Standard Libraries*: a branch of *Haskell*.
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*: step 1 of *Designing applications functionally*.
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*: step 2 of *Designing applications functionally*, for Scala.
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture*: step 2 of *Designing applications functionally*, for Haskell.
- [Rojas 1997](/sources/programming/functional-programming/rojas-1997-tutorial-introduction-to-lambda-calculus.pdf.enc), *A Tutorial Introduction to the Lambda Calculus*: *Theory*, lambda calculus, item 1.
- [Sestoft 2002](/sources/programming/functional-programming/sestoft-2002-demonstrating-lambda-calculus-reduction.pdf.enc), *Demonstrating Lambda Calculus Reduction*: *Theory*, lambda calculus, item 2.
- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages*: *Theory*, lambda calculus, item 3 (ch. 5 and 9).
- [Takenobu 2016](/sources/programming/functional-programming/takenobu-2016-lazy-evaluation-illustrated-for-haskell.pdf.enc), *Lazy Evaluation Illustrated for Haskell Divers*: *Theory*, lambda calculus and evaluation, item 4.
- [Hutton 1999](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc), *A Tutorial on the Universality and Expressiveness of Fold*: *Theory*, folds, item 1.
- [Gibbons 2003](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc), *Origami Programming*: *Theory*, folds, item 2.
- [Zhang 2021](/sources/programming/functional-programming/zhang-2021-structural-induction-tutorial.pdf.enc), structural induction tutorial: *Theory*, folds, item 3.
- [Bird and Gibbons 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*: *Theory*, folds, item 3.
- [Meijer et al. 1991](/sources/programming/functional-programming/meijer-1991-functional-programming-with-bananas-lenses.pdf.enc), *Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire* (partial copy): *Theory*, folds, item 3.
- [Gibbons and Oliveira 2009](/sources/programming/functional-programming/gibbons-2009-essence-of-the-iterator-pattern.pdf.enc), *The Essence of the Iterator Pattern*: *Theory*, folds, item 4.
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers, Scala Edition*: *Theory*, category theory, item 1.
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc), *Kleisli composition, flatMap, join, map, unit*: *Theory*, category theory, item 1.
- [Cheng 2023](/sources/programming/category-theory/cheng-2023-joy-of-abstraction.pdf.enc), *The Joy of Abstraction*: *Theory*, category theory, item 2.
- [Simmons 2011](/sources/programming/category-theory/simmons-2011-introduction-to-category-theory.pdf.enc), *An Introduction to Category Theory*: *Theory*, category theory, item 2, as a reference.
- [Adámek et al. 2004](/sources/programming/category-theory/adamek-2004-abstract-and-concrete-categories-joy-of-cats.pdf.enc), *Abstract and Concrete Categories: The Joy of Cats*: *Theory*, category theory, item 2, as a reference.

Further reading:

- [Schwarz 2019](/sources/programming/scala/schwarz-2019-state-monad.pdf.enc), *State Monad*
- [Krishnamurthi 2025](/sources/programming/language-theory/krishnamurthi-2025-programming-languages-application-interpretation-v3.pdf.enc), *Programming Languages: Application and Interpretation (PLAI), version 3*
- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages (2nd edition)*
