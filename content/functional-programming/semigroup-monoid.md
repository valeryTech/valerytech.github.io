---
draft: false
toc: true
aliases: "[semigroup_monoid]"
title: "Semigroup Monoid"
linkTitle: "Semigroup Monoid"
---
# Semigroup and monoid


The `Semigroup` and `Monoid` type classes in Haskell: an associative combining operation, the identity element that turns a semigroup into a monoid, their laws, and why the identity makes folds easy.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## semigroup


definitions

In mathematics, a semigroup is an algebraic structure consisting of a set together with an associative internal binary operation on it.

```haskell
class Semigroup a where
  (<>) :: a -> a -> a
  sconcat :: NonEmpty a -> a
  sconcat (a :| as) = go a as where
    go b (c:cs) = b <> go c cs
    go b []     = b
  stimes :: Integral b => b -> a -> a
  stimes = ...
```

methods: `<>`, `sconcat`, `stimes`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"Internal" means the result stays in the same set: combining two `a`s gives an `a`. `sconcat` combines a `NonEmpty` list; it can't accept an ordinary list, because a semigroup has no value to return for an empty one. `stimes n x` combines `n` copies of `x`, so `stimes 3 "ab"` is `"ababab"`. Instances can override it with something faster than repeated `<>`. Only `(<>)` has to be defined. Since GHC 8.4 (base 4.11) `Semigroup` is a superclass of `Monoid` and `(<>)` is exported from the Prelude.
{{< /callout >}}


laws

The only law is that `(<>)` must be associative. `(x <> y) <> z = x <> (y <> z)`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Associativity is what lets you drop the parentheses and split the work any way you like. `a <> b <> c <> d` has the same value however it is grouped, so a long combination can be computed left to right, right to left, or as a tree in parallel chunks. Map-reduce style aggregation relies on this. Commutativity (`x <> y = y <> x`) is *not* required: `"ab" <> "cd"` differs from `"cd" <> "ab"`.
{{< /callout >}}


terminology:

For example, the natural numbers under addition form a semigroup: the sum of any two natural numbers is a natural number, and `( a + b ) + c = a + ( b + c )` for any natural numbers `a`, `b`, and `c`.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
If the natural numbers include 0, as they do in most programming texts, they form a monoid under addition, not only a semigroup. The positive integers under addition are a cleaner example of a semigroup with no identity. Another is `max` on a type with no smallest value. Also, in Haskell numbers have no `Semigroup` instance of their own, because both `+` and `*` qualify. You choose one with the newtypes `Sum` and `Product` from `Data.Monoid`.
{{< /callout >}}


usage

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Typical uses: combining configuration or settings records field by field, merging maps (`Map`'s `<>` is a left-biased union), keeping a running `Max`, `Min`, `First` or `Last` (newtypes in `Data.Semigroup`), and combining non-empty results with `sconcat` where no sensible "empty" value exists. Wrapping a semigroup in `Maybe` gives a monoid: `Nothing` becomes the identity.
{{< /callout >}}


<https://wiki.haskell.org/Typeclassopedia#Semigroup>

<https://en.wikipedia.org/wiki/Semigroup>

<https://wiki.haskell.org/Data.Semigroup>

## monoid


Many semigroups have a special element `e` for which the binary operation `⊕` is the identity, that is, `e ⊕ x = x ⊕ e = x` for every element `x`. Such a semigroup-with-identity-element is called a monoid.

```haskell
class Monoid a where
  mempty  :: a
  mappend :: a -> a -> a
  mconcat :: [a] -> a
  mconcat = foldr mappend mempty
```

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
This is the definition from before GHC 8.4. The class is now `class Semigroup a => Monoid a`, and `mappend` defaults to `(<>)`. It is kept only for backward compatibility, so new code uses `(<>)` and defines only `mempty` (plus `(<>)` in the `Semigroup` instance).
{{< /callout >}}


Laws

Of course, every `Monoid` instance should actually be a monoid in the mathematical sense, which implies these laws:

```
mempty `mappend` x = x
x `mappend` mempty = x
(x `mappend` y) `mappend` z = x `mappend` (y `mappend` z)
```

Having an identity element might seem like a small detail, but it greatly increases

the power of a type by allowing you to use a fold function to easily combine lists of the

same type.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A fold needs a starting value, and it needs an answer for the empty list. `mempty` provides both, so any list of monoid values can be combined: `mconcat ["ab", "cd"]` is `"abcd"` and `mconcat []` is `""`. The more general tool is `foldMap :: (Foldable t, Monoid m) => (a -> m) -> t a -> m`, which maps every element into a monoid and combines the results. For example, `foldMap Sum [1,2,3]` is `Sum 6`. Without an identity you can only fold non-empty structures (`sconcat`, `foldr1`). See [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds).
{{< /callout >}}


Instances:

All, Any for bool

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`Bool` has two natural monoids, so neither is the instance for `Bool` itself; the newtypes `All` and `Any` from `Data.Monoid` pick one. `All` uses `&&` with identity `True`, and `Any` uses `||` with identity `False`. So `getAll (foldMap (All . even) [2,4])` is `True`, and `foldMap` of an empty list gives `All True` and `Any False`. Numbers work the same way, with `Sum` (identity 0) and `Product` (identity 1). Other common instances: lists and `String` (concatenation, identity `[]`), `Ordering` (useful for comparing on several keys in turn), functions `a -> b` when `b` is a monoid, and tuples of monoids.
{{< /callout >}}


See also: [Applicative]({{< ref "functional-programming/applicative" >}}) (an applicative can be described as a monoidal functor), [Category Theory]({{< ref "functional-programming/category-theory" >}}), and [Map Flatmap]({{< ref "functional-programming/map-flatmap" >}}). Also [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}) for checking the laws.

## Library sources


- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: chapter 15, Monoid, Semigroup, covers the classes and their laws, why `Integer` has no single `Monoid` (the newtype wrappers), and testing the laws with QuickCheck.
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: chapter 2, Monoids and Semigroups, the same ideas in Scala with Cats.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 2, section 2.1.3, Combining turns with Semigroup and Monoid: both classes on a small example of combining the turns of a radar antenna.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 6, Type Classes, section "Wrapping Types with Newtype": `Semigroup` and `Monoid` as GHCi shows them, and newtype wrappers that give one type several instances, such as combining `Maybe` values versus taking the first non-empty one.
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*: chapter 4, section 4.1.2: spotting a monoid in two folds over money in a banking model, which needs two `Monoid[Money]` instances, one for addition and one for comparison; in Scala.

Further reading:

- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*
