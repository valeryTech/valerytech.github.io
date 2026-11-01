---
draft: false
toc: true
title: "Category Theory for Functional Programmers"
aliases:
  - "/functional-programming/category-theory/"
description: "Why category theory is worth knowing for a programmer, how its standard constructions map onto types, functors and currying, purity and denotational semantics, natural transformations, and resources for learning it."
linkTitle: "Category Theory"
---

Why category theory is worth knowing for functional programming, the few constructions that show up in everyday FP code, and resources for learning it.

## Why study it


A passage written for mathematicians:

> Often this is just a fun curiosity and not really helpful, but sometimes it can be *a useful new perspective on something you know already*. And knowing the most standard categorical constructions (e.g. categories, functors, natural transformations, limits, adjoints, and representables) can let you see connections between subfields of mathematics more easily.

Most of the constructions it lists have direct counterparts in functional programming:

- **Category**: types as objects and functions as arrows, with `.` (or `andThen`) as composition and `id` as identity.
- **Functor**: a type constructor with a lawful `map`, such as `List` or `Option` ([Functor]({{< ref "functional-programming/02-abstractions/functor" >}})).
- **Natural transformation**: a polymorphic function between two functors, such as `headOption: List[A] => Option[A]`, which works the same way for every `A` ([Natural transformations](#natural-transformations)).
- **Adjunction**: currying. Functions `(A, B) => C` correspond one to one with functions `A => (B => C)` (see [Lambda calculus]({{< ref "functional-programming/01-foundations/lambda-calculus" >}})).
- **Representable functor**: a functor isomorphic to functions from a fixed type, such as `R => A`, the Reader type.
- **Limits** show up in programming mostly in their simplest forms: product types (pairs, records) and the terminal object (`Unit`).

For a programmer the "useful new perspective" is mostly vocabulary and laws. Knowing that `map` must preserve identity and composition, or that combining in a monoid must be associative, pays off daily and needs very little theory. Limits, adjoints and representables matter mainly when reading library design papers or advanced Haskell libraries.

## Purity and category theory


Milewski, in *Category Theory for Programmers*:

> In a pure functional language like Haskell all functions are pure. Because of that, it's easier to give these languages denotational semantics and model them using category theory. As for other languages, it's always possible to restrict yourself to a pure subset, or reason about side effects separately. Later we'll see how monads let us model all kinds of effects using only pure functions. So we really don't lose anything by restricting ourselves to mathematical functions.

Denotational semantics gives each program a meaning as a mathematical object: a type denotes a set, and a pure function denotes a mathematical function between those sets. Composition of programs is then composition of functions, which is exactly what a category describes. Effects are modelled by changing the arrows: a function `a -> m b` for a monad `m` is an arrow in the Kleisli category of `m`, and monadic composition `>=>` is composition in that category.

Two caveats to the passage:

- "All functions are pure" needs qualifying. Haskell has escape hatches such as `unsafePerformIO`. More importantly for the categorical model, every Haskell type also contains ⊥ (nontermination or `undefined`), and `seq` can tell `undefined` apart from `\x -> undefined x`. So Haskell types and functions don't form a category quite as cleanly as the passage suggests. The usual practice is to reason in an idealised category of total functions and accept that the model ignores ⊥.
- "We really don't lose anything" is strong. Monads can describe any effect, but combining several effects is where the cost shows up: monads don't compose in general, which is why monad transformers, free monads and effect systems exist (see [Why monads]({{< ref "functional-programming/02-abstractions/monads" >}}#why-monads) and [Effect systems]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#effect-systems)).

## Natural transformations


A natural transformation from functor `F` to functor `G` is a function `F[A] => G[A]` that works for every `A` without inspecting the elements: `headOption: List[A] => Option[A]` in Scala, or `maybeToList :: Maybe a -> [a]` in Haskell. In Haskell its type is `forall a. f a -> g a`; Cats calls it `FunctionK[F, G]`, written `F ~> G`. It satisfies `fmap f . nt = nt . fmap f`: mapping before or after the transformation gives the same result.

In FP code it mostly appears when changing the effect type, for example interpreting a free monad into `IO`, or using `mapK` to move an algebra from one `F` to another.

Related names in Cats:

- `liftTo`, from Cats syntax on `Option` and `Either`: `opt.liftTo[F](error)` turns an `Option[A]` into an `F[A]` for any `F` with an `ApplicativeError`, using the given error when the option is empty. It is close in spirit to a natural transformation, though it needs the error value.
- `transform`: several Cats data types (`EitherT`, `OptionT`) have a `transform` method, which maps over the whole wrapped value rather than being a natural transformation. Open question: which `transform` was meant here is not recorded.

## Associativity and commutativity


Associativity is one of the axioms of a category, together with identity. Composition must satisfy `h . (g . f) == (h . g) . f`, and identity arrows must satisfy `id . f == f == f . id`. Associativity means you never need to say how a chain of compositions is grouped. The same property is what makes a monoid useful: `(a <> b) <> c == a <> (b <> c)` lets a fold, or a parallel reduction, group the work however it likes (see [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid)).

- Wikipedia, "Associative property": <https://en.wikipedia.org/wiki/Associative_property>

Commutativity (`a <> b == b <> a`) is an extra property on top of that. It lets you also reorder the elements, for example to combine partial results in whatever order they arrive.

Caveat: commutativity is not part of the definition of a category, and composition is not commutative in general. If `f: A => B` and `g: B => C`, then `g . f` exists but `f . g` usually doesn't even type-check. Many useful monoids aren't commutative either, such as string concatenation and function composition. The word also has a separate use: a *commutative diagram* means that all paths between two objects compose to the same arrow, which has nothing to do with swapping operands.

## Resources


For a programmer, Milewski's *Category Theory for Programmers* is the usual starting point. It was written as a blog series, which the preface link opens, and the library PDF is the edition with Scala examples next to the Haskell ones.

Learning:

- Bartosz Milewski, *Category Theory for Programmers*, the preface of the blog series: <https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/> ([PDF](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc))
- *Category Theory for Programmers* on GitBook: <https://ctfpis.gitbook.io/project/category-theory-for-programmers>
- Wikibooks, Haskell, "Category theory": <https://en.wikibooks.org/wiki/Haskell/Category_theory>
- Gabriella439, LambdaConf slides on categories: <https://github.com/Gabriella439/slides/blob/main/lambdaconf/category/category.md>
- Math3ma, "What is category theory, anyway?": <https://www.math3ma.com/blog/what-is-category-theory-anyway>
- prathyvsh/category-theory-resources, a list of resources: <https://github.com/prathyvsh/category-theory-resources>
- Eugenia Cheng, *How to Bake Pi: Easy recipes for understanding complex maths* (2015): a popular-mathematics book that introduces the ideas behind category theory, abstraction and generalisation, through cooking analogies. It was published in the US with a different subtitle. Her later *The Joy of Abstraction* (Library sources) covers the same ground in much more depth and gets as far as functors, natural transformations and the Yoneda lemma.

Reference definitions rather than places to learn from:

- Wikipedia, "Category theory": <https://en.wikipedia.org/wiki/Category_theory>
- Wolfram MathWorld, "Category": <https://mathworld.wolfram.com/Category.html>

See also: [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}), [Why monads]({{< ref "functional-programming/02-abstractions/monads" >}}#why-monads), [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid), [Lambda calculus]({{< ref "functional-programming/01-foundations/lambda-calculus" >}}) for currying and the curry/apply adjunction, and [Type classes and polymorphism]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}).

## Library sources


- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*: the book behind the preface link and the purity passage, with Scala snippets next to the Haskell.
- [Cheng 2023](/sources/programming/category-theory/cheng-2023-joy-of-abstraction.pdf.enc), *The Joy of Abstraction: An Exploration of Math, Category Theory, and Life*: a gentle but rigorous first pass, by the author of *How to Bake Pi*.
- [Simmons 2011](/sources/programming/category-theory/simmons-2011-introduction-to-category-theory.pdf.enc), *An Introduction to Category Theory*: a slow textbook with exercises, for limits, colimits and adjunctions.

Further reading:

- [Adamek et al. 2004](/sources/programming/category-theory/adamek-2004-abstract-and-concrete-categories-joy-of-cats.pdf.enc), *Abstract and Concrete Categories: The Joy of Cats*
