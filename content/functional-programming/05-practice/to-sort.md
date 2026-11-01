---
draft: false
toc: true
title: "Functional Programming Links to Sort"
aliases:
  - "/functional-programming/to-sort/"
description: "Unfiled functional programming links, open questions and todos, grouped by the note they should move to, from domain modelling and optics to Scala articles and the study plan."
linkTitle: "Links to Sort"
---

Functional programming links, open questions and todos from the GTD inbox notes that are not yet filed into the notes of this section. Each group says where it should end up. Fragments that have already been filed are listed at the end.

Link labels come from the URL or the original jot; the pages themselves were not checked.

## Domain modeling in Haskell and Scala


These belong with [Functional domain modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}) once read.

Haskell:

- Haskell at Work, video channel: <https://www.youtube.com/@HaskellatWork/videos>
- Haskell at Work, "Domain modelling with Haskell data structures": <https://haskell-at-work.com/domain-modelling-with-haskell-data-structures/>
- debasishg/hask, a playground repository: <https://github.com/debasishg/hask/tree/master>
- Reddit, "How I write REST-ish services in Haskell, part 2": <https://www.reddit.com/r/haskell/comments/9wfduz/how_i_write_restish_services_in_haskell_part_2/>
- Reddit, "Modelling a polymorphic data domain in Haskell": <https://www.reddit.com/r/haskell/comments/p681m0/modelling_a_polymorphic_data_domain_in_haskell/>

Scala:

- alexn.org, "Scala OOP design sample", the section on `IO` in an API as a constraint: <https://alexn.org/blog/2022/04/18/scala-oop-design-sample/#beware-io-in-our-api-is-a-constraint>

### Sum types with sealed traits


In Scala 2 a sum type is a `sealed trait` with `case class` and `case object` subtypes. `sealed` means every subtype is declared in the same file, so the compiler knows the full list and warns when a `match` misses a case. The case classes are the product types. Scala 3 adds `enum` as shorter syntax for the same thing.

```scala
sealed trait Shape
case class Circle(r: Double) extends Shape
case class Rect(w: Double, h: Double) extends Shape

def area(s: Shape): Double = s match
  case Circle(r)  => math.Pi * r * r
  case Rect(w, h) => w * h
```


More in [Domain modeling with types]({{< ref "type-driven-design/domain-modeling-with-types" >}}); Schwarz 2020 (Library sources) works through the same encoding for DDD.

### State machines


Open question: how to write a state machine functionally.

- The states are a sum type and the events are a sum type.
- A transition is one pure function, `(State, Event) => Either[Error, State]`, or `(State, Event) => State` if every event is accepted.
- Running the machine over a history of events is a fold: `events.foldLeft(initial)(step)`, or a monadic fold (`foldM` in Cats and Haskell) for the `Either` version, which stops at the first rejected event. Replaying events like this is also the core of event sourcing.
- To have the compiler reject invalid transitions instead of rejecting them at runtime, encode the state in the type (phantom types or GADTs). Signatures get more complex.

See [Functional domain modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}) and [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds).

## Lenses and optics


- Rock the JVM, lenses: <https://blog.rockthejvm.com/lens/>
- Medium, "Functional references: lens and other optics in Scala": <https://medium.com/zyseme-technology/functional-references-lens-and-other-optics-in-scala-e5f7e2fdafe>

A lens is a composable getter and setter for one field of an immutable structure. With nested case classes, updating `person.address.street` by hand needs a `copy` at every level; lenses for each field compose into one that does the whole update. Lenses are one kind of optic: prisms focus on one case of a sum type, traversals on many elements. The usual libraries are Monocle in Scala and `lens` or `optics` in Haskell.

No note in this section covers optics yet. If these get read, they could start one.

## What "wrapper" means


Open question: the `Wrapper` concept and its use. The word is used in two senses.

1. A newtype: `newtype Email = Email String` in Haskell, or `opaque type Email = String` in Scala 3. It is the same runtime value with a distinct type, so the compiler keeps the two apart. See [Domain modeling with types]({{< ref "type-driven-design/domain-modeling-with-types" >}}).
2. Functor and monad tutorials call a context type such as `Option[A]` or `Future[A]` a wrapper: a value inside some extra structure that `map` and `flatMap` work through. The box picture breaks quickly. An `IO[A]`, a parser or a function `r -> a` does not contain an `A`; it can produce one when run. "Context" or "computation" fits better. See [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}) and [map and flatMap]({{< ref "functional-programming/02-abstractions/map-flatmap" >}}).

## Goals and languages


**Idris, F\*, Haskell.** Three points on a scale of how much the types can say:

- Idris has full dependent types: types can mention values, as in `Vect n a`, a vector of length `n`.
- F\* (Microsoft Research and Inria) combines dependent types with an effect system and sends proof obligations to an SMT solver. Project Everest used it, for example for the verified HACL\* cryptography library.
- Haskell has no full dependent types, but GADTs, `DataKinds` and type families approximate some of them.

See [Refinement and dependent types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}).

**Type safety and referential transparency as the main goals.** Type safety means a well-typed program cannot hit a type error at runtime. Referential transparency means an expression can be replaced by its value without changing behaviour, which makes local reasoning, refactoring and testing straightforward ([Referential transparency]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#referential-transparency)). Both are really means: the goal is code you can understand and change without breaking it. Formal type safety is also weaker than the everyday meaning: it rules out runtime type errors, not broken invariants. How much of the invariants to put in the types is the question of [What belongs in the type system]({{< ref "type-driven-design/what-belongs-in-types" >}}).

**Metaprogramming.** Code that generates or inspects code at compile time. Scala 3 has `inline`, quoted macros and type class derivation with `derives`; Scala 2 macros cannot be used from Scala 3. Haskell has Template Haskell and `GHC.Generics`. In FP the most common use is deriving type class instances (JSON codecs, `Show`, `Eq`) instead of writing them by hand.

## Scala and FP articles


These were collected together in the inbox. Pages whose topic is given were not opened; the topic comes from the URL or the original jot.

- Video, advice: <https://www.youtube.com/watch?v=lvlnH-uEjZA>
- Video playlist: <https://www.youtube.com/watch?v=iC4_U_vhUSU&list=PLLrf_044z4Jr5KerLBngYLP_2I7E5vZPs>
- Type class derivation in Scala (michalp): <https://blog.michalp.net/posts/scala/scala-derivations/>
- Snake game (Rock the JVM): <https://blog.rockthejvm.com/snake/>
- N-Queens, polyglot FP in Haskell and Scala, part 1 (Philip Schwarz, slides): <https://www.slideshare.net/pjschwarz/nqueens-combinatorial-problem-polyglot-fp-for-fun-and-profit-haskell-and-scala-part-1>
- Retrying function calls in Scala (SoftwareMill): <https://softwaremill.com/retrying-function-calls-in-scala/>
- 16 months of functional programming (Vasinov): <https://www.vasinov.com/blog/16-months-of-functional-programming/>
- Comparing task processing approaches in Scala (Bin Wang, 2023): <https://www.binwang.me/2023-08-27-Compare-Task-Processing-Approaches-in-Scala.html>
- Hexlet blog, self-help: <https://ru.hexlet.io/blog/posts/self-help>
- Scala digest number 10 (Tinkoff, Habr): <https://habr.com/ru/companies/tinkoff/articles/770964/>
- Habr, Tinkoff: <https://habr.com/ru/companies/tinkoff/articles/764768/>
- Habr, worth reading together with the Scala comment: <https://habr.com/ru/articles/469441/>
- Habr, topics not checked:
  - <https://habr.com/ru/articles/725462/>
  - <https://habr.com/ru/articles/742628/>
  - <https://habr.com/ru/articles/490112/>
  - <https://habr.com/ru/articles/479238/>

## Study plan and todos


- [ ] Read two or three Haskell books. Candidates already in the library: Allen and Moronuki 2016 as the main course, Serrano Mena 2021 for monads, transformers and effects, and Bird and Gibbons 2020 for algorithms with equational reasoning.
- [ ] Add Haskell to the resume. One finished, published Haskell project is stronger evidence than books; [Project ideas]({{< ref "functional-programming/05-practice/exercises-and-projects" >}}#project-ideas) has ideas of that size.
- [ ] Investigate `leetcode_tracker` with ChatGPT.
- [ ] Do the task from this video: <https://www.youtube.com/watch?v=Ae2HR-qD1UE&t=1371s>
- [ ] List the Scala and FP features to use in projects.

Kept as motivation:

> Over time you'll come to understand the Scala/FP *thought process*; you'll discover that one concept logically leads to another.

## Already filed


These inbox fragments now live in other notes:

- Encoding contracts in types: [Encoding contracts in Scala]({{< ref "type-driven-design/scala-type-system" >}}#encoding-contracts-in-scala)
- Polymorphism: [Polymorphism]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#polymorphism)
- Type classes (three jots): [Type classes]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#type-classes)
- Higher-kinded types (two jots): [Higher-kinded types]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#higher-kinded-types)
- Functions as functors: [Functor: Instances]({{< ref "functional-programming/02-abstractions/functor" >}}#instances)
- Functor as "mappable": [Functor]({{< ref "functional-programming/02-abstractions/functor" >}})
- Monadic operators and operations: [Why monads]({{< ref "functional-programming/02-abstractions/monads" >}}#why-monads)
- How `map` and `flatMap` work in Scala: [map and flatMap]({{< ref "functional-programming/02-abstractions/map-flatmap" >}})
- Natural transformations: [Natural transformations]({{< ref "functional-programming/02-abstractions/category-theory" >}}#natural-transformations)
- Effect systems and libraries: [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}), [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}) (tagless final) and [Streams]({{< ref "functional-programming/03-building-programs/streams" >}}) (fs2)

## Library sources


- [Schwarz 2020](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc), *Scala 3 by Example: ADTs for DDD, Part 1*: sealed traits and enums as sum types.
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: tagless final, newtypes and refinement types in a full application.
- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: type classes and implicit scope, functors and monads in Scala.
- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala (5th edition)*: givens and `using` clauses. Its section 9.1, the file matcher, is discussed in [Custom control structures]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#custom-control-structures).
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*: Cats Effect `IO`, programs as values, parallelism and resources.
- [Vargas 2023](/sources/programming/scala/vargas-2023-why-on-earth-a-zio-io-monad.pdf.enc), *Why on earth a ZIO IO monad for Scala?*: a saved Medium article, now used in [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}).
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: final, initial and free-monad styles side by side.
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*: functors and natural transformations.

Further reading:

- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*
- [Bird and Gibbons 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*
- [Nielson and Nielson 1999](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc), *Type and Effect Systems*
