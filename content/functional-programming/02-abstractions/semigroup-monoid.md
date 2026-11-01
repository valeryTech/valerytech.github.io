---
draft: false
toc: true
title: "Semigroups and Monoids"
aliases:
  - "/functional-programming/semigroup-monoid/"
description: "Associative combination and the identity element: definitions, laws, examples and uses of semigroups and monoids, and why the identity matters."
weight: "60"
linkTitle: "Semigroup and Monoid"
---

The `Semigroup` and `Monoid` type classes in Haskell. A semigroup is a type with an associative way of combining two values; a monoid adds an identity element, and that identity is what makes any list of values easy to fold.

## semigroup

### Definition


In mathematics, a semigroup is a set together with an associative internal binary operation on it. "Internal" means the result stays in the same set: combining two `a`s gives an `a`.

```haskell
class Semigroup a where
  (<>) :: a -> a -> a

  sconcat :: NonEmpty a -> a
  sconcat (a :| as) = go a as where
    go b (c:cs) = b <> go c cs
    go b []     = b

  stimes :: Integral b => b -> a -> a
  -- stimes also has a default (repeated combination); omitted here
```


The methods are `<>`, `sconcat` and `stimes`, and only `(<>)` has to be defined:

- `sconcat` combines a `NonEmpty` list. It can't accept an ordinary list, because a semigroup has no value to return for an empty one.
- `stimes n x` combines `n` copies of `x`, so `stimes 3 "ab"` is `"ababab"`. Instances can override it with something faster than repeated `<>`.

Since GHC 8.4 (base 4.11), `Semigroup` is a superclass of `Monoid` and `(<>)` is exported from the Prelude.

### Law


The only law is associativity:

```haskell
(x <> y) <> z = x <> (y <> z)
```


Associativity is what lets you drop the parentheses and split the work any way you like. `a <> b <> c <> d` has the same value however it is grouped, so a long combination can be computed left to right, right to left, or as a tree in parallel chunks. Map-reduce style aggregation relies on this.

Commutativity (`x <> y = y <> x`) is *not* required: `"ab" <> "cd"` differs from `"cd" <> "ab"`.

### Examples


The positive integers under addition form a semigroup: the sum of two positive integers is a positive integer, and `(a + b) + c = a + (b + c)`. They have no identity element, so they are not a monoid. Another semigroup without an identity is `max` on a type with no smallest value.

The natural numbers under addition are often given as the example. If they include 0, as they do in most programming texts, they form a monoid, not only a semigroup.

In Haskell, numbers have no `Semigroup` instance of their own, because both `+` and `*` qualify. You choose one with the newtypes `Sum` and `Product` from `Data.Monoid`.

### Uses


- Combining configuration or settings records field by field.
- Merging maps: `Map`'s `<>` is a left-biased union.
- Keeping a running `Max`, `Min`, `First` or `Last` (newtypes in `Data.Semigroup`).
- Combining non-empty results with `sconcat` where no sensible "empty" value exists.

Wrapping a semigroup in `Maybe` gives a monoid: `Nothing` becomes the identity.

## monoid

### Definition


Many semigroups have a special element `e` that is an identity for the operation `⊕`: `e ⊕ x = x ⊕ e = x` for every `x`. A semigroup with an identity element is called a monoid.

Since GHC 8.4 the class is:

```haskell
class Semigroup a => Monoid a where
  mempty  :: a

  mappend :: a -> a -> a
  mappend = (<>)

  mconcat :: [a] -> a
  mconcat = foldr mappend mempty
```


Before GHC 8.4 there was no `Semigroup` superclass, and `mappend` was the combining method that every instance defined. It is now kept only for backward compatibility. New code uses `(<>)`, and an instance defines only `mempty` (plus `(<>)` in its `Semigroup` instance).

### Laws


Every `Monoid` instance should be a monoid in the mathematical sense, which gives these laws:

```haskell
mempty <> x = x                     -- left identity
x <> mempty = x                     -- right identity
(x <> y) <> z = x <> (y <> z)       -- associativity
```


Older texts write them with `` `mappend` `` in place of `<>`.

### Why the identity matters


> Having an identity element might seem like a small detail, but it greatly increases the power of a type by allowing you to use a fold function to easily combine lists of the same type.

A fold needs a starting value, and it needs an answer for the empty list. `mempty` provides both, so any list of monoid values can be combined: `mconcat ["ab", "cd"]` is `"abcd"` and `mconcat []` is `""`. Without an identity you can only fold non-empty structures (`sconcat`, `foldr1`).

The more general tool is `foldMap`, which maps every element into a monoid and combines the results:

```haskell
foldMap :: (Foldable t, Monoid m) => (a -> m) -> t a -> m

foldMap Sum [1, 2, 3]   -- Sum 6
```


See [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds).

### Instances


`Bool` has two natural monoids, so neither is the instance for `Bool` itself. The newtypes `All` and `Any` from `Data.Monoid` pick one:

- `All` uses `&&`, with identity `True`.
- `Any` uses `||`, with identity `False`.

So `getAll (foldMap (All . even) [2, 4])` is `True`, and `foldMap` over an empty list gives `All True` and `Any False`. Numbers work the same way, with `Sum` (identity 0) and `Product` (identity 1).

Other common instances:

- lists and `String`: concatenation, identity `[]`;
- `Ordering`: useful for comparing on several keys in turn;
- functions `a -> b` when `b` is a monoid;
- tuples of monoids.

## Further links


- Typeclassopedia, the Semigroup section: <https://wiki.haskell.org/Typeclassopedia#Semigroup>
- Wikipedia, Semigroup: <https://en.wikipedia.org/wiki/Semigroup>
- Haskell Wiki, `Data.Semigroup`: <https://wiki.haskell.org/Data.Semigroup>

See also: [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}) (an applicative can be described as a monoidal functor), [Category theory]({{< ref "functional-programming/02-abstractions/category-theory" >}}), [map and flatMap]({{< ref "functional-programming/02-abstractions/map-flatmap" >}}), and [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}) for checking the laws.

## Library sources


- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: chapter 15, Monoid, Semigroup, covers the classes and their laws, why `Integer` has no single `Monoid` (the newtype wrappers), and testing the laws with QuickCheck; section 15.9, Different instance, same representation, on `All` and `Any` as `Bool`'s two monoids, on *Instances*; section 15.13, Semigroup ("NonEmpty, a useful datatype"), on `NonEmpty` as a semigroup with no `Monoid` because it has no identity, on *Why the identity matters*.
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: chapter 2, Monoids and Semigroups, the same ideas in Scala with Cats.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 2, section 2.1.3, Combining turns with Semigroup and Monoid: both classes on a small example of combining the turns of a radar antenna.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 6, Type Classes, section "Wrapping Types with Newtype": `Semigroup` and `Monoid` as GHCi shows them, `mempty` as tied to an operation rather than a type, and `Sum` and `Product` newtypes that give `Int` two monoids; on *Examples*. Section "Deriving More Things": a first-non-empty monoid for `Maybe`, then the same instance obtained with `DerivingVia`; on *Uses*.
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*: chapter 4, section 4.1.2: spotting a monoid in two folds over money in a banking model, which needs two `Monoid[Money]` instances, one for addition and one for comparison; in Scala.

Further reading:

- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*
- [Bird and Gibbons 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*: chapter 1, Functional programming, exercise and answer 1.10: `foldr (⊕) e` and `foldl (⊕) e` agree on finite lists when `⊕` is associative with identity `e`; on *Why the identity matters*.
