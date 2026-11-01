---
draft: false
toc: true
title: "To Sort"
linkTitle: "To Sort"
---
# FP links to sort


Functional programming links, questions and jots moved out of the GTD inbox notes, not yet filed into the notes of this section.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Domain modeling in Haskell and Scala


Belongs with [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}) once read.

<https://www.youtube.com/@HaskellatWork/videos> with haskell

<https://haskell-at-work.com/domain-modelling-with-haskell-data-structures/>

<https://github.com/debasishg/hask/tree/master> some kind of playground

<https://www.reddit.com/r/haskell/comments/9wfduz/how_i_write_restish_services_in_haskell_part_2/>

<https://www.reddit.com/r/haskell/comments/p681m0/modelling_a_polymorphic_data_domain_in_haskell/>

blog <https://alexn.org/blog/2022/04/18/scala-oop-design-sample/#beware-io-in-our-api-is-a-constraint>

### Algebraic data types and state machines


scala sealed trait as ADTs

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In Scala 2 a sum type is written as a `sealed trait` with `case class` and `case object` subtypes. `sealed` means every subtype must be declared in the same file, so the compiler knows the full list and warns when a `match` misses a case. The case classes are the product types. Scala 3 adds `enum` as shorter syntax for the same thing.

```scala
sealed trait Shape
case class Circle(r: Double) extends Shape
case class Rect(w: Double, h: Double) extends Shape

def area(s: Shape): Double = s match
case Circle(r)  => math.Pi * r * r
case Rect(w, h) => w * h
```

See [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}).
{{< /callout >}}


state machines?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The functional version of a state machine: the states are a sum type, the events are a sum type, and the transitions are one pure function `(State, Event) => Either[Error, State]` (or `State` if every event is accepted). Running the machine over a history of events is a fold: `events.foldLeft(initial)(step)` for the plain version, a monadic fold (`foldM` in Cats or Haskell) for the `Either` version, so the first rejected event stops it. Replaying events this way is also the core of event sourcing. If invalid transitions should be rejected by the compiler rather than at runtime, the next step is encoding the state in the type (phantom types or GADTs), at the cost of more complex signatures. See [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}) and [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds).
{{< /callout >}}

## Encoding contracts in types


Moved to [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}#encoding-contracts-in-scala).

## Types, type classes and polymorphism

### Polymorphism


Moved to [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#polymorphism).

### Type classes


Moved to [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#type-classes) (three jots).

### Higher-kinded types, functors and wrappers


Moved to [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#higher-kinded-types) (two jots).

`functions as functors`: moved to [Functor]({{< ref "functional-programming/functor" >}}#instances).

`Functor = mappable`: moved to [Functor]({{< ref "functional-programming/functor" >}}).

`Wrapper` concept and it's use

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"Wrapper" is used in two senses. The first is a newtype: `newtype Email = Email String` in Haskell, or `opaque type Email = String` in Scala 3, the same runtime value with a distinct type so the compiler keeps them apart (see [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}})). The second is the informal name for a context type such as `Option[A]` or `Future[A]` in Functor and Monad tutorials: a value "wrapped" in some extra structure that `map` and `flatMap` work through.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The box metaphor in the second sense breaks quickly. An `IO[A]`, a parser or a function `r -> a` does not contain an `A`; it can produce one when run. "Context" or "computation" describes these better than "wrapper".
{{< /callout >}}


`monadic operator, monadic operations`: moved to [Monads]({{< ref "functional-programming/monads" >}}#why-monads).

`How do flatmap and map work in scala?`: moved to [Map Flatmap]({{< ref "functional-programming/map-flatmap" >}}).

Natural transformations: moved to [Category Theory]({{< ref "functional-programming/category-theory" >}}#natural-transformations).

## Goals and languages


Idris, F*, Haskell,

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Three points on a scale of how much the types can say. Idris has full dependent types: types can mention values, as in `Vect n a`, a vector of length `n`. F* (from Microsoft Research and Inria) combines dependent types with an effect system and sends proof obligations to an SMT solver; it was used in Project Everest, for example for the verified HACL* cryptography library. Haskell has no full dependent types, but GADTs, `DataKinds` and type families approximate some of them.
{{< /callout >}}


type safety and referential transparency as main goals

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Type safety means a well-typed program cannot hit a type error at runtime. Referential transparency means an expression can be replaced by its value without changing the program's behaviour, which makes local reasoning, refactoring and testing straightforward. See [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#referential-transparency).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Both are means rather than goals. The goal is code you can understand and change without breaking it. "Type safety" in the formal sense is also weaker than what people usually mean: it guarantees no runtime type errors, not that the types capture your invariants. How much of those invariants to encode is the question in [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}).
{{< /callout >}}


metaprogramming

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Code that generates or inspects code at compile time. In Scala 3 that means `inline`, quoted macros and type class derivation with `derives`; Scala 2 macros cannot be used from Scala 3. In Haskell, Template Haskell and `GHC.Generics`. The most common FP use is deriving type class instances (JSON codecs, `Show`, `Eq`) instead of writing them by hand.
{{< /callout >}}

## Effect systems and libraries


Moved to [Effect Systems]({{< ref "functional-programming/effect-systems" >}}), [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) (tagless final) and [Streams]({{< ref "functional-programming/streams" >}}) (fs2).

## Lenses


<https://blog.rockthejvm.com/lens/>

<https://medium.com/zyseme-technology/functional-references-lens-and-other-optics-in-scala-e5f7e2fdafe>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A lens is a composable getter and setter for one field of an immutable structure. With nested case classes, updating `person.address.street` by hand needs a `copy` at every level; a lens for each field composes into one that does the whole update. Lenses are one kind of optic; others focus on one case of a sum type (prisms) or many elements (traversals). The usual libraries are Monocle in Scala and `lens` or `optics` in Haskell. No note in this section covers optics yet.
{{< /callout >}}

## Scala and FP articles


Collected together in the inbox; the topics of the untitled links were not checked.

<https://www.youtube.com/watch?v=lvlnH-uEjZA> advices

<https://habr.com/ru/companies/tinkoff/articles/764768/>

<https://blog.michalp.net/posts/scala/scala-derivations/>

<https://blog.rockthejvm.com/snake/>

<https://habr.com/ru/articles/725462/>

<https://www.slideshare.net/pjschwarz/nqueens-combinatorial-problem-polyglot-fp-for-fun-and-profit-haskell-and-scala-part-1>

<https://habr.com/ru/articles/742628/>

<https://habr.com/ru/articles/490112/>

<https://habr.com/ru/articles/469441/> + comment in scala

<https://ru.hexlet.io/blog/posts/self-help>

<https://habr.com/ru/articles/479238/>

<https://softwaremill.com/retrying-function-calls-in-scala/>

<https://www.vasinov.com/blog/16-months-of-functional-programming/>

<https://www.binwang.me/2023-08-27-Compare-Task-Processing-Approaches-in-Scala.html>

<https://www.youtube.com/watch?v=iC4_U_vhUSU&list=PLLrf_044z4Jr5KerLBngYLP_2I7E5vZPs>

scala digest

number 10 <https://habr.com/ru/companies/tinkoff/articles/770964/>

## Study plan and todos


haskell 2-3 books and add haskell to resume

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Candidates already in the library: Allen 2016 (*Haskell Programming from First Principles*) as the main course, Serrano Mena 2021 (*Book of Monads*) for monads, transformers and effects, and Bird 2020 (*Algorithm Design with Haskell*) for algorithms with equational reasoning. See Library sources.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Books alone make a weak resume line. One finished, published Haskell project is better evidence; the ideas in [Exercises And Projects]({{< ref "functional-programming/exercises-and-projects" >}}#project-ideas) are sized for that.
{{< /callout >}}


Investigate `leetcode_tracker` with ChatGPT.

task <https://www.youtube.com/watch?v=Ae2HR-qD1UE&t=1371s>

scala & fp features to use in projects

Over time you'll come to understand the Scala/FP *thought process*; you'll discover that one concept logically leads to another.

See also: [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}), [Monads]({{< ref "functional-programming/monads" >}}), [Functor]({{< ref "functional-programming/functor" >}}), [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}), [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}), [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}).

## Library sources


- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala (5th edition)*: covers givens and `using` clauses. Its section 9.1, the file matcher, is now discussed in [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#custom-control-structures).
- [Vargas 2023](/sources/programming/scala/vargas-2023-why-on-earth-a-zio-io-monad.pdf.enc), *Why on earth a ZIO IO monad for Scala?*: the saved copy of the Medium article linked under Effect systems.
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*: Cats Effect `IO`, programs as values, parallelism and resources; an alternative to the Cats Effect course.
- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: type classes and implicit scope, functors and monads in Scala.
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: tagless final, newtypes and refinement types in a full application.
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: final, initial and free-monad styles side by side.
- [Schwarz 2020](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc), *Scala 3 by Example: ADTs for DDD, Part 1*: sealed traits and enums as sum types.
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*: functors and natural transformations.

Further reading:

- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*
- [Bird and Gibbons 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*
- [Nielson and Nielson 1999](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc), *Type and Effect Systems*
