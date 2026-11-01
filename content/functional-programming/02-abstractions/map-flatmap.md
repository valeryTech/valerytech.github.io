---
draft: false
toc: true
title: "Understanding map and flatMap"
aliases:
  - "/functional-programming/map-flatmap/"
description: "What map preserves in a structure such as Option, the identity and composition laws behind it, and when the next step needs flatMap instead, with Scala examples."
linkTitle: "map and flatMap"
---

What `map` and `flatMap` do on `Option`: `map` keeps the Some/None decision as it is, the functor laws make that precise, and `flatMap` is needed when the next step can itself produce no result.

## `map` preserves structure


`map` does not decide what missing data means. It keeps the existing presence/absence decision and transforms only the present value.

There is no single standard name for exactly this property. The usual names are *structure preservation* or *shape preservation*: `map` may change the values inside, never the shape around them. For `Option` the shape is "Some or None", for `List` it is the length and order, for `Either` it is which side you are on. The precise version is the pair of functor laws in the next section. Two related names come up as well:

- *Parametricity* explains why `map` cannot make up a value: given `None`, a generic function has no `B` to put in a `Some`.
- *Naturality* says that `map` commutes with conversions between wrappers, so `opt.map(f).toList == opt.toList.map(f)`.

### Operations that do lose information


Open question: could a deliberately information-losing version of `map` be useful? Yes, but not under the name `map`. Functions that keep the `Option` but forget or reject things are useful all the time:

```scala
Some(3).filter(_ > 5)                                // None: rejects the value
Some("42").flatMap(_.toIntOption)                    // Some(42); Some("x") gives None
List(1, 2, 3).collect { case x if x > 1 => x * 10 }  // List(20, 30)
Right(1).toOption                                    // Either to Option: forgets the error
```


What you shouldn't do is give such a function the name and type of `map`. A `map` that returns `None` for everything already breaks `map(id) = id`. Code written against any functor (Cats' `Functor`, for-comprehensions, refactorings that merge `.map(f).map(g)` into one call) assumes the laws, and a lawless `map` silently changes its meaning.

One information-losing operation is lawful: `opt.map(_ => ())` (Cats calls it `void`) drops the value but keeps the shape, so it loses information without deciding anything about presence.

## The functor laws


The key property is

```
map(id) = id
```


If `f` does nothing to ordinary values, its extension should do nothing to the `Option` either. The second law is

```
map(g ∘ f) = map(g) ∘ map(f)
```


Extending a composition should be the same as extending each function separately and then composing them.

In Scala syntax these read `opt.map(identity) == opt` and `opt.map(f andThen g) == opt.map(f).map(g)`. Note the order: `g ∘ f` means "apply `f`, then `g`". The word "extension" fits well: `map` turns a function on plain values `A => B` into a function on wrappers `Option[A] => Option[B]`, and the laws say that this conversion respects doing nothing and respects chaining. The Haskell form of the same laws is in [Functor: Laws]({{< ref "functional-programming/02-abstractions/functor" >}}#laws).

How the ideas fit together:

```
"preserves Some/None"
    ↓
structure/context preservation
    ↓
formalized by
    ↓
functor laws (safe refactoring, generic code over any functor)

"can't invent B when given None"
    ↓
parametricity / consequence of the generic type

"may deliberately turn Some into None"
    ↓
filtering / validation / effectful transformation
    ↓
usually filter, collect, flatMap, etc.
```


Two points sharpen this picture:

- Parametricity rules out inventing a `B` from `None`, but it does not rule out dropping a value: `def map[A, B](o: Option[A])(f: A => B): Option[B] = None` type-checks. The identity law is what excludes it. In Haskell the two together go further: for a given type there is at most one `fmap` that satisfies the identity law, and the composition law then follows from parametricity.
- What the laws buy you, concretely, is safe refactoring (merging or splitting `map` calls, moving code in and out of a `map`) and generic code that behaves the same for every functor.

## `flatMap`


Sometimes preserving the `Option` structure is exactly what is needed, and sometimes the next computation needs to change that structure. That is the motivation for `flatMap`.

We need `flatMap` when the transformation we want to run on the contained value already returns an `Option`. That usually happens because the next operation can fail, find nothing, reject the value, or otherwise decide that there is no result. Its type is then `A => Option[B]`. Passing it to `map` gives a nested `Option[Option[B]]`, because `map` can only put the step's result back into the existing `Some`; it can't let the step decide presence. `flatMap` is `map` followed by `flatten`: it lets the step's own `Some` or `None` become the result.

```scala
def parse(s: String): Option[Int] = s.toIntOption

Some("42").map(parse)      // Some(Some(42)): Option[Option[Int]]
Some("42").flatMap(parse)  // Some(42)
Some("x").flatMap(parse)   // None: the step decided there is no result
None.flatMap(parse)        // None: parse is never called
```


The progression is:

```
map
A => B

"I can definitely produce B if you give me A."
```

```
flatMap
A => Option[B]

"Even if you give me A, I may or may not be able to produce B."
```


So `map` covers "presence is already decided", and `flatMap` covers "the next step may change it". What `flatMap` still can't do is turn `None` back into `Some`, since the function only runs on a present value. Recovery needs `orElse` or `getOrElse`.

## In Scala


On `Option`, `map` and `flatMap` are ordinary methods, roughly:

```scala
def map[B](f: A => B): Option[B] = this match
  case Some(a) => Some(f(a))
  case None    => None

def flatMap[B](f: A => Option[B]): Option[B] = this match
  case Some(a) => f(a)
  case None    => None
```


Collections follow the same pattern: `List(1, 2).map(x => x * 10)` is `List(10, 20)`, and `List(1, 2).flatMap(x => List(x, x))` is `List(1, 1, 2, 2)`. `List.flatMap` accepts any function returning something iterable, so `List("1", "x").flatMap(_.toIntOption)` gives `List(1)`.

The compiler turns for-comprehensions into these calls. Every generator but the last becomes `flatMap`, the last becomes `map`, and an `if` guard becomes `withFilter`:

```scala
for { a <- oa; b <- ob } yield a + b
// becomes
oa.flatMap(a => ob.map(b => a + b))
```


That is why any type with suitable `map` and `flatMap` methods works in a for-comprehension, as [Why monads]({{< ref "functional-programming/02-abstractions/monads" >}}#why-monads) notes.

See also: [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}) for the same ideas in Haskell's `Functor` class, [Option]({{< ref "functional-programming/02-abstractions/monads" >}}#option) for `Option` as a monad, [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}) for combining several independent `Option` values, and [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}) for `Either`.

## Library sources


- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: chapter 4, Handling errors without exceptions, builds `map`, `flatMap`, `filter` and `getOrElse` for `Option` as exercises and explains for-comprehensions.
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: the chapters on functors and monads state these laws in Scala and generalize `map` and `flatMap` beyond `Option`.
- Płachta 2022, *Grokking Functional Programming*: chapter 5, Sequential programs: `flatten` and `flatMap` on lists, how `flatMap` can change the size of a list, nested `flatMap`s rewritten as for comprehensions, and `Option` for parsing; chapter 6 continues with `Option` and `Either`.
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc), *Kleisli composition, flatMap, join, map, unit*: slides showing how Kleisli composition, `flatMap`, `join` (`flatten` in Scala), `map` and `unit` can each be defined from the others, with Scala 3 code for `Option` and `List`.

Further reading:

- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala (5th edition)*
- [Chiusano et al. 2013](/sources/programming/scala/chiusano-2013-functional-programming-in-scala-meap-v10.pdf.enc), *Functional Programming in Scala (MEAP version 10)*
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*
