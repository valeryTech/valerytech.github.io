---
draft: false
toc: true
title: "Functional Programming"
description: "Notes on programming with pure functions and composition in Haskell and Scala, from evaluation and the functor-to-monad abstractions to errors, effects, streams, concurrency and testing in real programs."
linkTitle: "Functional Programming"
---

Notes on programming with pure functions and composition. They cover evaluation and laziness, referential transparency, recursion and folds, the functor, applicative, traversable and monad family, and how real programs are built from them: errors as values, effect systems, program structure, streams, concurrency and property-based testing. Haskell and Scala (with Cats, Cats Effect and ZIO) are the languages used to practise it.

## How the notes are organised


The notes sit in five subfolders that match the sections below, in reading order. Notes marked *(new)* were written from the library books they cite; the others grew out of earlier study notes. Each note ends with the library sources it draws on.

Start with [FP reading paths]({{< ref "functional-programming/05-practice/fp-reading-paths" >}}) to pick a route through the books.

## Foundations


- [Pure functions and effects]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}): referential transparency, side effects, immutability, and the functional core with an imperative shell.
- [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}): reduction and the substitution model, the Church-Rosser property, thunks and non-strict semantics, space leaks, and call-by-name in Scala.
- [Lambda calculus]({{< ref "functional-programming/01-foundations/lambda-calculus" >}}): binding, function application and β-reduction, reduction strategies, Church encodings, and interactive tools.
- [Functions and composition]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}): lambdas and closures, returning functions as API design, currying and partial application, the loan pattern, and pipelines.
- [Recursion and folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}): rules for writing recursive functions, map as abstracted recursion, `foldl` and `foldr` and their types, Foldable, and combinators built from folds.

## Abstractions


- [Map and flatMap]({{< ref "functional-programming/02-abstractions/map-flatmap" >}}): what `map` preserves in an `Option`, the identity and composition laws behind it, and when the next step needs `flatMap`.
- [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}): a functor as a computational context, `fmap` and its type, writing your own instances, and the functor laws.
- [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}): applying functions that are themselves inside a functor, `pure` and `<*>`, and applicative style.
- [Traversable and traverse]({{< ref "functional-programming/02-abstractions/traversable" >}}) *(new)*: `traverse`, `sequenceA` and `traverse_`, how the applicative decides the behaviour, laws, and the essence of the iterator pattern.
- [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}): binding pure functions together, and the Option, Writer, State, Reader and IO monads.
- [Semigroup and monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}): associative combination, the identity element, the Haskell classes and their laws.
- [Type classes and polymorphism]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}): parametric and type-class polymorphism, type classes in Haskell and Scala, higher-kinded types, GADTs, and type-level programming.
- [Category theory]({{< ref "functional-programming/02-abstractions/category-theory" >}}): why it is worth knowing, purity and denotational semantics, natural transformations, and links for learning it.

## Building programs


- [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}) *(new)*: why not exceptions, `Option`, `Either` and `Try`, fail-fast versus accumulating validation, typed errors in effect types, and converting at boundaries.
- [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}) *(new)*: effects as values, the effect pattern, a toy IO, Haskell `IO`, Cats Effect 3, ZIO, and a comparison of the three; also the former Cats note.
- [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}) *(new)*: monad transformers, mtl-style classes, service handles and `ReaderT`, free monads, tagless final, ZIO layers, and when to pick which.
- [Streams]({{< ref "functional-programming/03-building-programs/streams" >}}) *(new)*: lazy lists, why laziness gives modularity, effectful pull-based streams (fs2, conduit, pipes), resource safety, backpressure, and stream fusion.
- [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}) *(new)*: deterministic parallelism in Haskell, threads and STM, fibers in Cats Effect and ZIO, and purely functional parallelism as a design exercise.
- [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}) *(new)*: properties instead of examples, generators and shrinking, where good properties come from, and testing type-class laws.

## Languages


- [Haskell]({{< ref "functional-programming/04-languages/haskell" >}}): learning path, resources, ecosystem, libraries, language notes (definitions, GHCi, lists, constructors), advice, the design costs of `base`, and a custom Prelude.
- [Scala]({{< ref "functional-programming/04-languages/scala" >}}): ecosystem, expressions and methods, classes and objects, operators, comprehensions, collections, traits, abstract members, variance, interpolators, encapsulation, dependency injection, implicits (with Scala 3 equivalents), and sources.

## Practice and study


- [FP reading paths]({{< ref "functional-programming/05-practice/fp-reading-paths" >}}): goal-ordered routes through the library (Scala, Haskell, application design, theory), followed by the original article, course and talk links.
- [Refactoring functional code]({{< ref "functional-programming/05-practice/functional-refactoring" >}}): Haskell examples: a Collatz step counter, replacing partial functions with types that carry the guarantee, and wholemeal programming.
- [Exercises and projects]({{< ref "functional-programming/05-practice/exercises-and-projects" >}}): exercise collections, specific problems, learning tasks, and project ideas.
- [FP study log]({{< ref "functional-programming/05-practice/study-log" >}}): a dated log from November and December 2023 on folds, fusion, unfolds, laziness and traversals.
- [FP links to sort]({{< ref "functional-programming/05-practice/to-sort" >}}): unfiled links, open questions and todos, grouped by where they should end up.

## Related material elsewhere


The [type-driven design]({{< ref "type-driven-design" >}}) section holds the typed-modeling material that used to sit in these notes:

- [Functional domain modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}): effects kept out of the domain, and modules as algebras with interpreters.
- [Effects, interpreters and wiring]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}): Reader and Kleisli, free monads, ZIO and algebraic effects; [Tagless final]({{< ref "type-driven-design/04-architecture/tagless-final" >}}) has a note of its own.
- [Algebraic data types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}) and [Newtypes and simple values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}): product and sum types and newtypes, moved from `haskell.md` and `scala.md`; the folder's overview is [Domain modeling with types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}). Type-first design, moved from `haskell.md` too, is now in [Workflows and states]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}).
- [Scala type system]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}): abstract types, nominal and structural subtyping, and refined types, moved from `scala.md`.
- [Declarative design]({{< ref "type-driven-design/04-architecture/declarative-design" >}}): functional programming as one of the declarative sub-paradigms.

Other notes:

- [Language choice for AI systems]({{< ref "ai/design/workflow-design/language-choice" >}}): Go, Scala, Haskell and BEAM compared for AI systems.
