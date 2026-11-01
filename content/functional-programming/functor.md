---
draft: false
toc: true
title: "Functor"
linkTitle: "Functor"
---

The `Functor` type class in Haskell: what `fmap` does, why `f` must be a type constructor of kind `* -> *`, `fmap` as lifting, the functor laws, and the function instance `(( -> ) r)`.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## What a functor is


Functor = mappable

A more correct term for what a functor is would be _computational context_. The context might be that the computation can have a value or it might have failed (`Maybe` and `Either a`) or that there might be more values (lists), stuff like that.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"More correct" overstates it: "computational context" is a second metaphor, not a definition, as the quote below says. Both break somewhere. "Mappable" suggests a container, which fails for `IO` or for functions. "Computational context" fits `Maybe`, lists and `IO` but not, say, a pair `(e, a)`, which is a functor in its second component and involves no computation at all. The definition is only this: a type constructor with a lawful `fmap`.
{{< /callout >}}


Functors are things that can be mapped over, like lists, Maybes, trees, and such. In Haskell, they're described by the typeclass Functor, which has only one typeclass method, namely fmap, which has a type of

`fmap :: (a -> b) -> f a -> f b.`

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Only one typeclass method" doesn't match the class in today's `base`, which also has `(<$)`, as the `:info` output below shows. It has a default definition, so `fmap` is the only one you must write.
{{< /callout >}}


> In the end, however, a `Functor` is simply what it is defined to be; doubtless there are many examples of `Functor` instances that don't exactly fit either of the above intuitions. The wise student will focus their attention on definitions and examples, without leaning too heavily on any particular metaphor. Intuition will come, in time, on its own.

which problems functor allows us to solve and how? #todo formulate

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
One formulation: Functor solves "I have a function on plain values and a value inside some wrapper; apply the one to the other without unwrapping, and without knowing what the wrapper is." Without it you pattern-match on every wrapper by hand, and each case (missing value, list, result of an action) repeats the same plumbing:

```haskell
fmap (+1) (Just 3)        -- Just 4
fmap (+1) Nothing         -- Nothing: the missing case is handled for you
fmap (+1) [1, 2, 3]       -- [2,3,4]
fmap length getLine       -- IO Int: the length of a line not read yet
```

Two things follow. You write the transformation once and it works for every functor, including ones written later. And thanks to the laws, the wrapper's own logic (absence, multiplicity, effects) stays separate from your logic. Functor can't combine two wrapped values or let a step decide the wrapper; that is what [Applicative]({{< ref "functional-programming/applicative" >}}) and [Monads]({{< ref "functional-programming/monads" >}}) add.
{{< /callout >}}


Haskell has a wonderful solution to this problem. `Maybe` is a member of the `Functor` type class. The `Functor` type class requires only one definition: `fmap`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"This problem" refers to context the quote lost: applying an ordinary function such as `(+1)` to a `Maybe Int` without first checking for `Nothing` by pattern matching.
{{< /callout >}}


This ability to transform the types of values inside a Maybe is the **true power** of the Functor type class.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Overstated. That `fmap` can change the type from `a` to `b` follows from its signature, but it isn't where the power lies. The power is that one function and one set of laws cover every functor, so you can write code that works on any of them without knowing which.
{{< /callout >}}


Nevertheless, a Haskell project can hardly do without a couple of Functor instances. It enables one to do transformations on the wrapped type _without knowing anything about the wrapper_, and that's very beneficial.

## The `Functor` class and `fmap`

```haskell
> :info Functor
type Functor :: (* -> *) -> Constraint
class Functor f where
  fmap :: (a -> b) -> f a -> f b
  (<$) :: a -> f b -> f a
  {-# MINIMAL fmap #-}
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`(<$)` replaces every value inside with a constant: `0 <$ Just 'x'` is `Just 0`. Its default is `fmap . const`, and instances can override it for efficiency. The `MINIMAL` pragma tells the compiler which methods an instance must define; here only `fmap`. The first line says that `Functor` takes a type constructor of kind `* -> *` and produces a constraint.
{{< /callout >}}


`f` is confusing because you often associate `f` with function. But here is a _type class constraint_. `f a` - is a functor

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Imprecise in two places. `f` is a type variable that ranges over type constructors (`Maybe`, `[]`, `IO`); the constraint is the whole `Functor f`. And `f a` is a type, such as `Maybe Int`, whose values people loosely call "functor values". The functor is `f` itself, not `f a`.
{{< /callout >}}


Arguments of the `fmap`:

- `(a -> b)`: This is the first argument to `fmap` and represents a function from type `a` to type `b`. This is the function that will be applied to the values inside the functor.
- `f a`: This is the second argument to `fmap` and represents a functor `f` containing values of type `a`. The function `(a -> b)` will be applied to each element of this functor.
- `f b`: This is the result type of `fmap`. It represents a new functor containing values of type `b`. After applying the function `(a -> b)` to each element of the original functor, you get a new functor with the transformed values.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Each element" assumes a container. For `IO a` there are no elements yet: `fmap f action` is a new action that applies `f` to whatever the action returns when it runs. For a function `r -> a`, `fmap f` applies `f` to the output (see Instances below). A more accurate wording is "applied to every `a` that the structure has or will produce", which may be zero, one, many, or one per run.
{{< /callout >}}


For most common data types, instances of Functor are already implemented. For your own data types, you'll need to define them yourself.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
For most of your own types you don't have to write the instance by hand. With the `DeriveFunctor` extension (on by default in the GHC2021 language edition) you can write `deriving Functor`, and GHC generates the only lawful instance, which maps over the last type parameter.
{{< /callout >}}


Of course, we cannot provide an implementation of `fmap` that works for all contexts. Instead, to use it on a data type, that type needs to have an instance of the Functor typeclass. As we'll see, Functor is the thing that provides the implementation.

## Kinds: `f` is a type constructor


information from LYaH

But now, the `f` _is not a concrete type_ (a type that a value can hold, like Int, `Bool` or `Maybe String`), but a type constructor that takes one type parameter. Anyway, we see that `fmap` takes a function from one type to another and a functor _applied_** with one type and returns a functor _applied_ with another type.

If we want to make a type constructor an instance of `Functor`, it has to have a kind of `* -> *`, which means that it has to take exactly one concrete type as a type parameter.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A type constructor with more parameters can still be a functor once you fix all but the last one. `Either` has kind `* -> * -> *`, so the instance is for `Either e`, which has kind `* -> *`, and `fmap` maps only over the `Right` side. The same trick gives the pair instance `((,) e)` and the function instance `(( -> ) r)` below. See [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#higher-kinded-types).
{{< /callout >}}


another description ` -> `

First, the `f a` and `f b` in the type signature for `fmap` tell us that `f` isn't a concrete type like `Int`; it is a sort of _type function_ which takes another type as a parameter. More precisely, the _kind_ of `f` must be `* -> *`. For example, `Maybe` is such a type with kind `* -> *`: `Maybe` is not a concrete type by itself (that is, there are no values of type `Maybe`), but requires another type as a parameter, like `Maybe Integer`. So it would not make sense to say `instance Functor Integer`, but it could make sense to say `instance Functor Maybe`.

## Lifting


intuition

In the same vein, if we write `fmap :: (a -> b) -> (f a -> f b)`, we can think of fmap not as a function that takes one function and a functor and returns a functor, but as a function that takes a function and returns a _new_ function that's just like the old one, only it takes a functor as a parameter and returns a functor as the result. It takes an `a -> b` function and returns a function `f a -> f b`. This is called _lifting_ a function.

```haskell
ghci> :t fmap (*2)
fmap (*2) :: (Num a, Functor f) => f a -> f a
ghci> :t fmap (replicate 3)
fmap (replicate 3) :: (Functor f) => f a -> f [a]
```

functor over numbers

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This labels the first `ghci` result. `fmap (*2)` is a function that works on any functor whose contents are numbers: the `Num a` constraint comes from `(*2)`, the `Functor f` constraint from `fmap`. Applied to `Just 4` it gives `Just 8`, applied to `[1,2]` it gives `[2,4]`. The two readings of the type are the same thing, because every Haskell function is curried: the parentheses in `(a -> b) -> (f a -> f b)` are implied anyway.
{{< /callout >}}

## Laws

```haskell
fmap id = id                     -- fmap preserves identity
fmap (f . g) = fmap f . fmap g   -- fmap distributes over composition
```

Together, these laws ensure that `fmap g` does not change the _structure_ of a container, only the elements. Equivalently, and more simply, they ensure that `fmap g` changes a value without altering its context ∗.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A lawless instance shows what the laws forbid. This one type-checks but breaks the identity law, because it also reverses the list:

```haskell
newtype Rev a = Rev [a]
instance Functor Rev where
fmap f (Rev xs) = Rev (reverse (map f xs))
-- fmap id (Rev [1,2,3]) == Rev [3,2,1], not Rev [1,2,3]
```

The `∗` is a leftover footnote marker from the source (the passage reads like the Typeclassopedia). The Scala version of the same laws, with a discussion of what "preserves structure" means for `Option`, is in [Map Flatmap]({{< ref "functional-programming/map-flatmap" >}}).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
In Haskell the two laws aren't independent. Because of parametricity, any `fmap` that satisfies the identity law also satisfies the composition law, and a type has at most one lawful `Functor` instance. That is why `deriving Functor` can always choose the instance for you. (Strictly, these results ignore `undefined` and `seq`.)
{{< /callout >}}


Laws aren't enforced by the compiler, hence you need to ensure their correctness yourself. It may be a bit difficult at the beginning, but after a couple of instances, it will start to feel natural.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Besides proving them by hand with equational reasoning, you can test laws with property-based testing: QuickCheck properties such as `fmap id x == x` for random `x`, or ready-made law suites such as the `checkers` package for Haskell and `cats-laws` with Discipline for Scala.
{{< /callout >}}


If we can show that some type obeys both functor laws, we can rely on it having the same fundamental behaviors as other functors when it comes to mapping.

`f a` type obeys the functor laws, we know that calling `fmap` on a value of that type will only map the function over it, nothing more. This leads to code that is more abstract and extensible, because we can use laws to reason about behaviors that any functor should have and make functions that operate reliably on any functor.

## Instances

### Functions: `(( -> ) r)`


`( -> ) r` - function composition

The function type `r -> a` can be rewritten as `( -> ) r a`

There is one noteworthy fact about Functor - it's not always a container. The laws of Functor permit some rather wild implementations. For example, functions are functors too!

That's why we can't make `( -> )` an instance of Functor, but if we partially apply it to `( -> ) r`, it doesn't pose any problems.

```haskell
instance Functor ((-> ) r) where
  fmap f g = (\x -> f (g x))
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"That's why" points back to the kind rule above: `( -> )` takes two type arguments, so it has kind `* -> * -> *` and can't be a `Functor`. Fixing the input type gives `( -> ) r`, "functions from `r`", of kind `* -> *`. The output type is what `fmap` maps over. The instance in `base` is written `fmap = (.)`, which is the same definition as the lambda above.
{{< /callout >}}


How to understand this? We can mentally replace all `f` with `( -> ) r`:

```haskell
fmap :: (a -> b) -> ((-> ) r a) -> ((-> ) r b)
```

Hmmm OK. Mapping one function over a function has to produce a function, just like mapping a function over a Maybe has to produce a Maybe and mapping a function over a list has to produce a list.

What does the type of this intance tell us?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Written in ordinary arrow syntax the type is `fmap :: (a -> b) -> (r -> a) -> (r -> b)`. Given a way to turn `a` into `b` and a way to turn `r` into `a`, the only thing you can build is a way to turn `r` into `b`: run `g` first, then `f`. Parametricity leaves no other choice, so the type alone tells you that `fmap` for functions is composition. For example, `fmap (+1) (*2) 5` is `11`. In this functor the "context" is a value of type `r` that hasn't been supplied yet, the idea behind the Reader monad (see [Monads]({{< ref "functional-programming/monads" >}}#reader)).
{{< /callout >}}


functions as functors

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A function type with a fixed input, `r -> a`, is a functor in its output: `instance Functor (( -> ) r) where fmap = (.)`. Mapping over a function means composing after it, so `fmap (+1) (*2) 5` is `(+1) ((*2) 5)`, which is `11`. Reader is this functor (plus `Applicative` and `Monad`) under another name. See [Functor]({{< ref "functional-programming/functor" >}}), and the exercise on proving the functor laws for this instance in [Exercises And Projects]({{< ref "functional-programming/exercises-and-projects" >}}).
{{< /callout >}}

## Reading


Definition and questions:

what it is, where it can be used, and how to implement your own instances of Functor.

<https://serokell.io/blog/whats-that-typeclass-functor>

<https://www.snoyman.com/blog/2017/01/functors-applicatives-and-monads/>

material from guy...

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"material from guy..." doesn't say which source it means, so it will be hard to find again. Worth replacing with the author's name or a link.
{{< /callout >}}


See also: [Map Flatmap]({{< ref "functional-programming/map-flatmap" >}}) for the same laws on Scala's `Option`, [Applicative]({{< ref "functional-programming/applicative" >}}) and [Monads]({{< ref "functional-programming/monads" >}}) for the next steps up, [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#type-classes), and [Category Theory]({{< ref "functional-programming/category-theory" >}}) for functors in the mathematical sense. Also [Property Based Testing]({{< ref "functional-programming/property-based-testing" >}}) for checking the laws, and [Traversable]({{< ref "functional-programming/traversable" >}}).

## Library sources


- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: chapter 16, Functor, covers kinds, the laws, lawless instances, testing instances with QuickCheck and the `IO` functor, with exercises.
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*: chapters 7, Functors (including the reader functor `( -> ) r`), and 8, Functoriality, from the category-theory side.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 2, section 2.3, Abstracting computations with type classes: `Functor` as mapping over a value in a computational context, the framing used under What a functor is, followed by `Applicative`, `Monad`, `Foldable` and `Traversable`.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 9, Introducing Monads, opens with "Mapping Functors" and has a section on using the functor laws; chapter 6 covers higher-kinded types, the kind `* -> *` behind `Functor`.

Further reading:

- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*
- [Adamek et al. 2004](/sources/programming/category-theory/adamek-2004-abstract-and-concrete-categories-joy-of-cats.pdf.enc), *Abstract and Concrete Categories: The Joy of Cats*
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*
