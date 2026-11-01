---
draft: false
toc: true
title: "Map Flatmap"
linkTitle: "Map Flatmap"
---
# map and flatMap


What `map` and `flatMap` do on `Option`: why `map` keeps the Some/None decision as it is, how the functor laws formalize that, and why `flatMap` is needed when the next step can itself produce no result.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## `map` preserves structure


Open question: what is this property of `map`, and what is it called?

```
map does not decide what missing data means.
```


It preserves the existing presence/absence decision and transforms only the present value.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
There is no single standard name for exactly this sentence. The usual names are *structure preservation* or *shape preservation*: `map` may change the values inside, never the shape around them. For `Option` the shape is "Some or None", for `List` it is the length and order, for `Either` it is which side you are on. The precise version is the pair of functor laws below. Two related names come up as well. *Parametricity* explains why `map` cannot make up a value: given `None`, a generic function has no `B` to put in a `Some`. *Naturality* says that `map` commutes with conversions between wrappers, so `opt.map(f).toList == opt.toList.map(f)`.
{{< /callout >}}


Open question: could a deliberately information-losing version of `map` be useful for some purpose?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Yes, but not under the name `map`. A function that keeps the Option but forgets or rejects things is useful all the time:

```scala
Some(3).filter(_ > 5)                          // None: rejects the value
Some("42").flatMap(_.toIntOption)              // Some(42); Some("x") gives None
List(1, 2, 3).collect { case x if x > 1 => x * 10 }  // List(20, 30)
Right(1).toOption                              // Either to Option: forgets the error
```

What you shouldn't do is give such a function the name and type of `map`. A `map` that returns `None` for everything already breaks `map(id) = id`. Code written against any functor (Cats' `Functor`, for-comprehensions, refactorings that merge `.map(f).map(g)` into one call) assumes the laws, and a lawless `map` silently changes its meaning. One information-losing operation is lawful: `opt.map(_ => ())` (Cats calls it `void`) drops the value but keeps the shape, so it loses information without deciding anything about presence.
{{< /callout >}}

## The functor laws


The key property is:

```
map(id) = id
```


If `f` does nothing to ordinary values, then its extension should do nothing to the `Option` either.

And:

```
map(g ∘ f) = map(g) ∘ map(f)
```


So extending a composition should be the same as extending each function separately and then composing them.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In Scala syntax these read `opt.map(identity) == opt` and `opt.map(f andThen g) == opt.map(f).map(g)`. Note the order: `g ∘ f` means "apply `f`, then `g`". The word "extension" fits well. `map` turns a function on plain values `A => B` into a function on wrappers `Option[A] => Option[B]`, and the laws say that this conversion respects doing nothing and respects chaining. In Haskell the same laws appear in [Functor]({{< ref "functional-programming/functor" >}}#laws).
{{< /callout >}}

```
"preserves Some/None"
    ↓
structure/context preservation
    ↓
formalized by
    ↓
functor laws (to make composability and other powerful mathematic things)

"can't invent B when given None"
    ↓
parametricity / consequence of the generic type

"may deliberately turn Some into None"
    ↓
filtering / validation / effectful transformation
    ↓
usually filter, collect, flatMap, etc.
```

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The chain is right; two points sharpen it. First, parametricity rules out inventing a `B` from `None`, but it does not rule out dropping a value: `def map[A, B](o: Option[A])(f: A => B): Option[B] = None` type-checks. The identity law is what excludes it. In Haskell the two together go further: for a given type there is at most one `fmap` that satisfies the identity law, and the composition law then follows from parametricity. Second, "composability and other powerful mathematic things" is vague. Concretely the laws buy you safe refactoring (merging or splitting `map` calls, moving code in and out of a `map`) and generic code that behaves the same for every functor.
{{< /callout >}}

## `flatMap`


Possible motivation for `flatMap`: sometimes preserving the `Option` structure is exactly what is needed from `map`, while sometimes the next computation needs to change that structure. This motivation is still an open question.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
That motivation is right, and it can be made concrete. If the next step can itself find nothing, its type is `A => Option[B]`. Passing it to `map` gives a nested `Option[Option[B]]`, because `map` can only put the step's result back into the existing `Some`; it can't let the step decide presence. `flatMap` is `map` followed by `flatten`: it lets the step's own `Some` or `None` become the result.

```scala
def parse(s: String): Option[Int] = s.toIntOption

Some("42").map(parse)      // Some(Some(42)): Option[Option[Int]]
Some("42").flatMap(parse)  // Some(42)
Some("x").flatMap(parse)   // None: the step decided there is no result
None.flatMap(parse)        // None: parse is never called
```

So `map` covers "presence is already decided", and `flatMap` covers "the next step may change it". What `flatMap` still can't do is turn `None` back into `Some`, since the function only runs on a present value. Recovery needs `orElse` or `getOrElse`.
{{< /callout >}}


> We need `flatMap` when the transformation we want to run on the contained value already returns an `Option`.

That usually happens because the next operation can fail, find nothing, reject the value, or otherwise decide that there is no result.

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

## In Scala


How do flatmap and map work in scala?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
On `Option` they are ordinary methods, roughly:

```scala
def map[B](f: A => B): Option[B] = this match {
case Some(a) => Some(f(a))
case None    => None
}

def flatMap[B](f: A => Option[B]): Option[B] = this match {
case Some(a) => f(a)
case None    => None
}
```

Collections follow the same pattern: `List(1, 2).map(x => x * 10)` is `List(10, 20)`, and `List(1, 2).flatMap(x => List(x, x))` is `List(1, 1, 2, 2)`. `List.flatMap` accepts any function returning something iterable, so `List("1", "x").flatMap(_.toIntOption)` gives `List(1)`.

The compiler turns for-comprehensions into these calls. Every generator but the last becomes `flatMap`, the last becomes `map`, and an `if` guard becomes `withFilter`:

```scala
for { a <- oa; b <- ob } yield a + b
// becomes
oa.flatMap(a => ob.map(b => a + b))
```

That is why any type with suitable `map` and `flatMap` methods works in a for-comprehension, as [Monads]({{< ref "functional-programming/monads" >}}#why-monads) notes.
{{< /callout >}}


See also: [Functor]({{< ref "functional-programming/functor" >}}) for the same ideas in Haskell's `Functor` class, [Monads]({{< ref "functional-programming/monads" >}}#option) for `Option` as a monad, and [Applicative]({{< ref "functional-programming/applicative" >}}) for combining several independent `Option` values. Also [Error Handling]({{< ref "functional-programming/error-handling" >}}) for `Either`.

## Library sources


- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: chapter 4, Handling errors without exceptions, builds `map`, `flatMap`, `filter` and `getOrElse` for `Option` as exercises and explains for-comprehensions.
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: the chapters on functors and monads state these laws in Scala and generalize `map` and `flatMap` beyond `Option`.
- Płachta 2022, *Grokking Functional Programming*: chapter 5, Sequential programs: `flatten` and `flatMap` on lists, how `flatMap` can change the size of a list, nested `flatMap`s rewritten as for comprehensions, and `Option` for parsing; chapter 6 continues with `Option` and `Either`.
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc), *Kleisli composition, flatMap, join, map, unit*: slides showing how Kleisli composition, `flatMap`, `join` (`flatten` in Scala), `map` and `unit` can each be defined from the others, with Scala 3 code for `Option` and `List`.

Further reading:

- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala (5th edition)*
- [Chiusano et al. 2013](/sources/programming/scala/chiusano-2013-functional-programming-in-scala-meap-v10.pdf.enc), *Functional Programming in Scala (MEAP version 10)*
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*
