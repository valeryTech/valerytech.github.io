---
draft: false
toc: true
title: "Functors in Haskell"
aliases:
  - "/functional-programming/functor/"
description: "A functor as a computational context: the Functor class and fmap, kinds and type constructors, lifting, the functor laws, and instances including functions."
weight: "20"
linkTitle: "Functor"
---

The `Functor` type class in Haskell: what `fmap` does, why `f` must be a type constructor of kind `* -> *`, `fmap` as lifting, the functor laws, and the function instance `(( -> ) r)`.

## What a functor is


Functors are things that can be mapped over, like lists, `Maybe` values and trees. In Haskell they are described by the type class `Functor`, whose central method is

```haskell
fmap :: (a -> b) -> f a -> f b
```


The class in today's `base` also has `(<$)`, as the `:info` output below shows, but it has a default definition, so `fmap` is the only method you must write.

Two intuitions are common:

- *Mappable*: a functor is a container you can map a function over. This suggests a container, which fails for `IO` or for functions.
- *Computational context*: the context might be that the computation may have a value or may have failed (`Maybe` and `Either a`), or that there may be several values (lists). This fits `Maybe`, lists and `IO`, but not, say, a pair `(e, a)`, which is a functor in its second component and involves no computation at all.

Neither is a definition; both are metaphors and both break somewhere. The definition is only this: a type constructor with a lawful `fmap`.

> In the end, however, a `Functor` is simply what it is defined to be; doubtless there are many examples of `Functor` instances that don't exactly fit either of the above intuitions. The wise student will focus their attention on definitions and examples, without leaning too heavily on any particular metaphor. Intuition will come, in time, on its own.

## Why Functor is useful


Open question: which problems does Functor solve, and how?

Functor solves this: "I have a function on plain values and a value inside some wrapper; apply the one to the other without unwrapping, and without knowing what the wrapper is." The standard example is applying an ordinary function such as `(+1)` to a `Maybe Int` without first checking for `Nothing` by pattern matching. Without Functor you pattern-match on every wrapper by hand, and each case (missing value, list, result of an action) repeats the same plumbing. Since `Maybe` is an instance of `Functor`, `fmap` does that for you:

```haskell
fmap (+1) (Just 3)        -- Just 4
fmap (+1) Nothing         -- Nothing: the missing case is handled for you
fmap (+1) [1, 2, 3]       -- [2,3,4]
fmap length getLine       -- IO Int: the length of a line not read yet
```


Two things follow:

- You write the transformation once and it works for every functor, including ones written later. You transform the wrapped type without knowing anything about the wrapper, which is why a Haskell project can hardly do without a couple of `Functor` instances.
- Thanks to the laws, the wrapper's own logic (absence, multiplicity, effects) stays separate from your logic.

A common overstatement is that the "true power" of Functor is the ability to change the type of the value inside a `Maybe`. That `fmap` can turn an `a` into a `b` follows from its signature, but it isn't where the power lies. The power is that one function and one set of laws cover every functor, so you can write code that works on any of them without knowing which.

Functor can't combine two wrapped values or let a step decide the wrapper; that is what [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}) and [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}) add.

## The `Functor` class and `fmap`

```haskell
> :info Functor
type Functor :: (* -> *) -> Constraint
class Functor f where
  fmap :: (a -> b) -> f a -> f b
  (<$) :: a -> f b -> f a
  {-# MINIMAL fmap #-}
```


- The first line says that `Functor` takes a type constructor of kind `* -> *` and produces a constraint.
- `(<$)` replaces every value inside with a constant: `0 <$ Just 'x'` is `Just 0`. Its default is `fmap . const`, and instances can override it for efficiency.
- The `MINIMAL` pragma tells the compiler which methods an instance must define; here only `fmap`.

The `f` is confusing because `f` usually names a function. Here `f` is a type variable that ranges over type constructors (`Maybe`, `[]`, `IO`), and the constraint is the whole `Functor f`. `f a` is a type, such as `Maybe Int`, whose values people loosely call "functor values". The functor is `f` itself, not `f a`.

The parts of `fmap`'s type:

- `(a -> b)`, the first argument: the function that will be applied to the values inside the functor.
- `f a`, the second argument: a structure `f` that has, or will produce, values of type `a`.
- `f b`, the result: a structure of the same shape with values of type `b`.

"Applied to each element" assumes a container. For `IO a` there are no elements yet: `fmap f action` is a new action that applies `f` to whatever the action returns when it runs. For a function `r -> a`, `fmap f` applies `f` to the output (see [Instances](#instances)). The accurate wording is that `f` is applied to every `a` the structure has or will produce, which may be zero, one, many, or one per run.

We cannot write one implementation of `fmap` that works for all contexts. To use `fmap` on a data type, that type needs an instance of `Functor`, and the instance provides the implementation. For the common data types the instances already exist. For your own types you rarely have to write them by hand: with the `DeriveFunctor` extension (on by default in the GHC2021 language edition) you can write `deriving Functor`, and GHC generates the only lawful instance, which maps over the last type parameter.

## Kinds: `f` is a type constructor


Learn You a Haskell (LYaH) makes the point this way. In `fmap`'s type, `f` is not a concrete type (a type a value can have, like `Int`, `Bool` or `Maybe String`) but a type constructor that takes one type parameter. `fmap` takes a function from one type to another and a functor applied to one type, and returns the functor applied to the other type. So to make a type constructor an instance of `Functor`, it must have kind `* -> *`: it takes exactly one concrete type as a parameter.

Put another way, the `f a` and `f b` in the signature tell us that `f` is a sort of *type function* that takes another type as a parameter. `Maybe` has kind `* -> *`: there are no values of type `Maybe` by itself, only of types like `Maybe Integer`. So `instance Functor Integer` makes no sense, while `instance Functor Maybe` does.

A type constructor with more parameters can still be a functor once you fix all but the last one. `Either` has kind `* -> * -> *`, so the instance is for `Either e`, which has kind `* -> *`, and `fmap` maps only over the `Right` side. The same trick gives the pair instance `((,) e)` and the function instance `(( -> ) r)` below. See [Higher-kinded types]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#higher-kinded-types).

## Lifting


If we write the type as `fmap :: (a -> b) -> (f a -> f b)`, we can read `fmap` not as a function that takes a function and a functor and returns a functor, but as a function that takes a function and returns a *new* function, just like the old one except that it takes a functor and returns a functor. It turns an `a -> b` function into an `f a -> f b` function. This is called *lifting* a function. The two readings are the same thing, because every Haskell function is curried: the parentheses in `(a -> b) -> (f a -> f b)` are implied anyway.

```haskell
ghci> :t fmap (*2)
fmap (*2) :: (Num a, Functor f) => f a -> f a
ghci> :t fmap (replicate 3)
fmap (replicate 3) :: (Functor f) => f a -> f [a]
```


`fmap (*2)` is a function over numbers in any functor: the `Num a` constraint comes from `(*2)`, the `Functor f` constraint from `fmap`. Applied to `Just 4` it gives `Just 8`, applied to `[1,2]` it gives `[2,4]`.

## Laws

```haskell
fmap id = id                     -- fmap preserves identity
fmap (f . g) = fmap f . fmap g   -- fmap distributes over composition
```


Together, these laws ensure that `fmap g` does not change the *structure* of a container, only the elements. Equivalently, and more simply, they ensure that `fmap g` changes a value without altering its context. The Scala version of the same laws, with a discussion of what "preserves structure" means for `Option`, is in [map and flatMap]({{< ref "functional-programming/02-abstractions/map-flatmap" >}}).

A lawless instance shows what the laws forbid. This one type-checks but breaks the identity law, because it also reverses the list:

```haskell
newtype Rev a = Rev [a]
instance Functor Rev where
  fmap f (Rev xs) = Rev (reverse (map f xs))
-- fmap id (Rev [1,2,3]) == Rev [3,2,1], not Rev [1,2,3]
```


It breaks the composition law as well: `fmap f . fmap g` reverses twice, which cancels out, while `fmap (f . g)` reverses once (Serrano Mena 2021, section 5.1.1).

In Haskell the two laws aren't independent. Because of parametricity, any `fmap` that satisfies the identity law also satisfies the composition law, and a type has at most one lawful `Functor` instance. That is why `deriving Functor` can always choose the instance for you. (Strictly, these results ignore `undefined` and `seq`.)

The compiler doesn't enforce the laws, so you have to ensure them yourself. It takes some effort at first, but after a couple of instances it starts to feel natural. Besides proving them by hand with equational reasoning, you can test them with property-based testing: QuickCheck properties such as `fmap id x == x` for random `x`, or ready-made law suites such as the `checkers` package for Haskell and `cats-laws` with Discipline for Scala. See [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}).

If a type obeys both laws, calling `fmap` on a value of that type only maps the function over it, nothing more, and the type has the same fundamental mapping behaviour as every other functor. That leads to more abstract and extensible code: we can use the laws to reason about behaviour every functor must have, and write functions that work reliably on any functor.

## Instances

### Functions: `(( -> ) r)`


Functor is not always a container, and the laws permit some rather wild instances. Functions are functors too.

The function type `r -> a` can be written in prefix form as `( -> ) r a`. Since `( -> )` takes two type arguments, it has kind `* -> * -> *` and can't itself be a `Functor` (the kind rule above). Partially applied, `( -> ) r`, "functions from `r`", has kind `* -> *`, and that poses no problem. The output type is what `fmap` maps over:

```haskell
instance Functor ((->) r) where
  fmap f g = \x -> f (g x)
```


The instance in `base` is written `fmap = (.)`, which is the same definition: mapping over a function means composing after it.

To understand the type, replace every `f` with `( -> ) r`:

```haskell
fmap :: (a -> b) -> ((->) r a) -> ((->) r b)
-- in ordinary arrow syntax
fmap :: (a -> b) -> (r -> a) -> (r -> b)
```


Mapping a function over a function has to produce a function, just as mapping over a `Maybe` produces a `Maybe` and mapping over a list produces a list. Given a way to turn `a` into `b` and a way to turn `r` into `a`, the only thing you can build is a way to turn `r` into `b`: run `g` first, then `f`. Parametricity leaves no other choice, so the type alone tells you that `fmap` for functions is composition. For example, `fmap (+1) (*2) 5` is `(+1) ((*2) 5)`, which is `11`.

In this functor the "context" is a value of type `r` that hasn't been supplied yet. Reader is this functor (plus `Applicative` and `Monad`) under another name; see [Reader]({{< ref "functional-programming/02-abstractions/monads" >}}#reader). Proving the functor laws for this instance is an exercise in [Exercises and projects]({{< ref "functional-programming/05-practice/exercises-and-projects" >}}).

## Further links


What a functor is, where it can be used, and how to implement your own instances:

- Serokell, "What's that typeclass: Functor": <https://serokell.io/blog/whats-that-typeclass-functor>
- Michael Snoyman, "Functors, applicatives and monads" (2017): <https://www.snoyman.com/blog/2017/01/functors-applicatives-and-monads/>

## Open tasks


- [ ] Formulate in my own words which problems Functor solves and how; a first version is in [Why Functor is useful](#why-functor-is-useful).
- [ ] Identify the "material from guy..." noted next to these links and add the author's name or a link.

See also: [map and flatMap]({{< ref "functional-programming/02-abstractions/map-flatmap" >}}) for the same laws on Scala's `Option`, [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}) and [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}) for the next steps up, [Type classes]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#type-classes), [Category theory]({{< ref "functional-programming/02-abstractions/category-theory" >}}) for functors in the mathematical sense, [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}) for checking the laws, and [Traversable and traverse]({{< ref "functional-programming/02-abstractions/traversable" >}}).

## Library sources


- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles*: chapter 16, Functor: section 16.4 on kinds, on *Kinds: `f` is a type constructor*; sections 16.5 and 16.6 on the laws and lawless instances, and 16.9 on testing instances with QuickCheck, on *Laws*; with the `IO` functor and exercises. Section 22.4, Breaking down the Functor of functions, derives `fmap = (.)` for `(( -> ) r)` from the kind `* -> * -> *`; on *Functions: `(( -> ) r)`*.
- [Milewski 2019](/sources/0e04926a1bcff6dccfd4b9a974acdff4.bin), *Category Theory for Programmers (Scala edition)*: chapters 7, Functors (including the reader functor `( -> ) r`), and 8, Functoriality, from the category-theory side.
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth*: chapter 2, section 2.3, Abstracting computations with type classes: `Functor` as mapping over a value in a computational context, the framing used under What a functor is, followed by `Applicative`, `Monad`, `Foldable` and `Traversable`.
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell*: chapter 9, Introducing Monads, opens with "Mapping Functors". Its section "Using the Functor Laws" builds an `Outlaw` functor whose `fmap` increments a counter and so breaks both laws; on *Laws*. Chapter 6, section "Understanding Higher Kinded Types and Polymorphism", introduces kinds with `:kind` and `KindSignatures`; on *Kinds: `f` is a type constructor*.
- [Serrano Mena 2021](/sources/4f6f84b5680da34841126999b31e2ed3.bin), *Book of Monads (2nd edition)*: section 1.5, "Functors", reads `fmap :: (a -> b) -> (f a -> f b)` as lifting a function into the functor, on *Lifting*; section 5.1.1, "Functor Laws", explains the laws as structure preservation and breaks them with two lawless list instances, one that returns `[]` and one that also reverses, on *Laws*; section 0.2, "Higher-kinded Abstraction", introduces abstraction over type constructors such as `[]`, `Set` and `Tree`, on *Kinds: `f` is a type constructor*.

Further reading:

- [Welsh et al. 2020](/sources/08cab18bbc8a17a6885874831fe8c431.bin), *Scala with Cats*
- [Adamek et al. 2004](/sources/5611339137436ee645c28a0ef1ac0116.bin), *Abstract and Concrete Categories: The Joy of Cats*
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling*
- [Serrano Mena 2022](/sources/5c1001bd2c4b75b2ff640e61358fc71a.bin), *Haskell: Almost Standard Libraries*: chapter 21, Functors, section 21.1: `fmap` read as `(a -> b) -> (f a -> f b)`, lifting a function into a functor. It then turns the arrows around to get `Contravariant` (on `Predicate`), `Bifunctor` and `Profunctor`; on *Lifting*.
