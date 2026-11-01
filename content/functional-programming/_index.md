---
draft: false
toc: true
title: "Functional Programming"
linkTitle: "Functional Programming"
---

Notes on programming with pure functions and composition. They cover evaluation and laziness, referential transparency, recursion and folds, the functor, applicative, traversable and monad family, and how real programs are built from them: errors as values, effect systems, program structure, streams, concurrency and property-based testing. Haskell and Scala (with Cats, Cats Effect and ZIO) are the languages used to practise it.

## Notes in this section


Two kinds of note live here. Notes built from the original study notes keep that text verbatim, with commentary in callouts titled **Explanation** and **Critique** (added on 2026-11-05) directly after the fragment they discuss. Notes marked *(new)* were written on 2026-11-05 from the library books they cite; any earlier fragments in them sit under "Earlier notes" headings with the same callouts.

Start with [FP reading paths]({{< ref "functional-programming/fp-reading-paths" >}}) to pick a route through the books.

Foundations:

1. [Pure functions and effects]({{< ref "functional-programming/pure-functions-and-effects" >}}): referential transparency, side effects, immutability, and the functional core with an imperative shell.
2. [Evaluation and laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}): reduction and the substitution model, the Church-Rosser property, thunks and non-strict semantics, space leaks, and call-by-name in Scala.
3. [Lambda calculus]({{< ref "functional-programming/lambda-calculus" >}}): binding, function application and β-reduction, reduction strategies, Church encodings, and interactive tools.
4. [Functions and composition]({{< ref "functional-programming/functions-and-composition" >}}): lambdas and closures, returning functions as API design, currying and partial application, the loan pattern, and pipelines.
5. [Recursion and folds]({{< ref "functional-programming/recursion-and-folds" >}}): rules for writing recursive functions, map as abstracted recursion, `foldl` and `foldr` and their types, Foldable, and combinators built from folds.

Abstractions:

6. [Map and flatMap]({{< ref "functional-programming/map-flatmap" >}}): what `map` preserves in an `Option`, the identity and composition laws behind it, and when the next step needs `flatMap`.
7. [Functor]({{< ref "functional-programming/functor" >}}): a functor as a computational context, `fmap` and its type, writing your own instances, and the functor laws.
8. [Applicative]({{< ref "functional-programming/applicative" >}}): applying functions that are themselves inside a functor, `pure` and `<*>`, and applicative style.
9. [Traversable and traverse]({{< ref "functional-programming/traversable" >}}) *(new)*: `traverse`, `sequenceA` and `traverse_`, how the applicative decides the behaviour, laws, and the essence of the iterator pattern.
10. [Monads]({{< ref "functional-programming/monads" >}}): binding pure functions together, and the Option, Writer, State, Reader and IO monads.
11. [Semigroup and monoid]({{< ref "functional-programming/semigroup-monoid" >}}): associative combination, the identity element, the Haskell classes and their laws.
12. [Type classes and polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}): parametric and type-class polymorphism, type classes in Haskell and Scala, higher-kinded types, GADTs, and type-level programming.
13. [Category theory]({{< ref "functional-programming/category-theory" >}}): why it is worth knowing, purity and denotational semantics, natural transformations, and links for learning it.

Building programs:

14. [Error handling as values]({{< ref "functional-programming/error-handling" >}}) *(new)*: why not exceptions, `Option`, `Either` and `Try`, fail-fast versus accumulating validation, typed errors in effect types, and converting at boundaries.
15. [Effect systems]({{< ref "functional-programming/effect-systems" >}}) *(new)*: effects as values, the effect pattern, a toy IO, Haskell `IO`, Cats Effect 3, ZIO, and a comparison of the three; also the former Cats note.
16. [Structuring effectful programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) *(new)*: monad transformers, mtl-style classes, service handles and `ReaderT`, free monads, tagless final, ZIO layers, and when to pick which.
17. [Streams]({{< ref "functional-programming/streams" >}}) *(new)*: lazy lists, why laziness gives modularity, effectful pull-based streams (fs2, conduit, pipes), resource safety, backpressure, and stream fusion.
18. [Concurrency and parallelism]({{< ref "functional-programming/concurrency" >}}) *(new)*: deterministic parallelism in Haskell, threads and STM, fibers in Cats Effect and ZIO, and purely functional parallelism as a design exercise.
19. [Property-based testing]({{< ref "functional-programming/property-based-testing" >}}) *(new)*: properties instead of examples, generators and shrinking, where good properties come from, and testing type-class laws.

Languages:

20. [Haskell]({{< ref "functional-programming/haskell" >}}): learning path, resources, ecosystem, libraries, language notes (definitions, GHCi, lists, constructors), advice, the design costs of `base`, and a custom Prelude.
21. [Scala]({{< ref "functional-programming/scala" >}}): ecosystem, expressions and methods, classes and objects, operators, comprehensions, collections, traits, abstract members, variance, interpolators, encapsulation, dependency injection, implicits (with Scala 3 equivalents), and sources.

Practice and study:

22. [FP reading paths]({{< ref "functional-programming/fp-reading-paths" >}}): goal-ordered routes through the library (Scala, Haskell, application design, theory), followed by the original article, course and talk links.
23. [Refactoring functional code]({{< ref "functional-programming/functional-refactoring" >}}): Haskell examples: a Collatz step counter, replacing partial functions with types that carry the guarantee, and wholemeal programming.
24. [Exercises and projects]({{< ref "functional-programming/exercises-and-projects" >}}): exercise collections, specific problems, learning tasks, and project ideas.
25. [FP study log]({{< ref "functional-programming/study-log" >}}): a dated log from November and December 2023 on folds, fusion, unfolds, laziness and traversals.
26. [FP links to sort]({{< ref "functional-programming/to-sort" >}}): links and jots not yet filed into the notes above.

## Related material elsewhere


The [type-driven design]({{< ref "type-driven-design" >}}) section holds the typed-modeling material that used to sit in these notes:

- [Functional domain modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}): effects kept out of the domain, modules as algebras with interpreters, and tagless final.
- [Domain modeling with types]({{< ref "type-driven-design/domain-modeling-with-types" >}}): product and sum types, newtypes, and type-first design, moved from `haskell.md` and `scala.md`.
- [Scala type system]({{< ref "type-driven-design/scala-type-system" >}}): abstract types, nominal and structural subtyping, and refined types, moved from `scala.md`.
- [Declarative design]({{< ref "type-driven-design/declarative-design" >}}): functional programming as one of the declarative sub-paradigms.

Other notes:

- Refactoring: general refactoring sources and open tasks.
- Problems and katas: language-agnostic katas and exercise sites.
- [Language choice for AI systems]({{< ref "ai/design/workflow-design/langs-aspects" >}}): Go, Scala, Haskell and BEAM compared for AI systems.

In `notes-acc`, only one file is about functional programming in any depth: Semantic kernel. It is a ChatGPT conversation on building an AI system's semantic kernel in Haskell or Scala, with a Haskell versus Scala 3 comparison. Other hits there are passing mentions of immutability or Lisp.

Library source maps: functional programming, Scala, category theory.

## Where this came from


The concept, language and library notes moved from `topics/coding-other/functional/`. `Haskell.md` was renamed to `haskell.md` and `lambda_calculus.md` to `lambda-calculus.md`. This note replaces `index.md`, whose dataview query pointed at a stale `coding/functional` path.

The concept notes, the resources note and the study log were then split out of three large notes. `functional.md` was dissolved completely. `haskell.md` and `scala.md` kept their language material, and each moved passage left a "Moved to" pointer behind.

Pieces moved in from other notes, each leaving a one-line pointer behind:

- `topics/coding/topics/refactoring.md`: the Haskell examples, now in [Refactoring functional code]({{< ref "functional-programming/functional-refactoring" >}}).
- `topics/coding/problems-and-katas.md`: FP exercise collections and specific problems, now in [Exercises and projects]({{< ref "functional-programming/exercises-and-projects" >}}).
- `topics/gtd/projects_gtd/projects.md`: the Haskell project assignment, FP-in-games links, and the shopping cart and pet store projects, now in [Exercises and projects]({{< ref "functional-programming/exercises-and-projects" >}}).
- `topics/gtd/in2.md`: FP learning tasks, now in [Exercises and projects]({{< ref "functional-programming/exercises-and-projects" >}}). Domain-modeling, effect-system and Scala links are now in [FP links to sort]({{< ref "functional-programming/to-sort" >}}).
- `topics/gtd/in3.md`: a paragraph on category theory, now in [Category theory]({{< ref "functional-programming/category-theory" >}}).

On 2026-11-05 the seven notes marked *(new)* were written from the library books, taking over the effect-system, tagless-final, free-monad and errors-as-values passages of older notes (each left a pointer). `cats.md` was merged into [Effect systems]({{< ref "functional-programming/effect-systems" >}}), and `resources.md` became [FP reading paths]({{< ref "functional-programming/fp-reading-paths" >}}).
