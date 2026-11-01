---
draft: false
toc: true
title: "Category Theory"
linkTitle: "Category Theory"
---

Why category theory is worth knowing for functional programming, and links for learning it.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Why study it


Often this is just a fun curiosity and not really helpful, but sometimes it can be *a useful new perspective on something you know already*. And knowing the most standard categorical constructions (e.g. categories, functors, natural transformations, limits, adjoints, and representables) can let you see connections between subfields of mathematics more easily.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The quote is written for mathematicians, but most of the constructions it lists have direct counterparts in functional programming:

- **Category**: types as objects and functions as arrows, with `.` (or `andThen`) as composition and `id` as identity.
- **Functor**: a type constructor with a lawful `map`, such as `List` or `Option`.
- **Natural transformation**: a polymorphic function between two functors, such as `headOption: List[A] => Option[A]`, which works the same way for every `A`.
- **Adjunction**: currying. Functions `(A, B) => C` correspond one to one with functions `A => (B => C)` (see [Lambda Calculus]({{< ref "functional-programming/lambda-calculus" >}})).
- **Representable functor**: a functor isomorphic to functions from a fixed type, such as `R => A`, the Reader type.

Limits show up in programming mostly in their simplest forms, product types (pairs, records) and the terminal object (`Unit`).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
For a programmer the "useful new perspective" is mostly vocabulary and laws. Knowing that `map` must preserve identity and composition, or that monoid combination must be associative, pays off daily, and needs very little theory. Limits, adjoints and representables matter mainly when reading library design papers or advanced Haskell libraries.
{{< /callout >}}

## Purity and category theory


In a pure functional language like Haskell all functions are pure. Because of that, it's easier to give these languages denotational semantics and model them using category theory. As for other languages, it's always possible to restrict yourself to a pure subset, or reason about side effects separately. Later we'll see how monads let us model all kinds of effects using only pure functions. So we really don't lose anything by restricting ourselves to mathematical functions.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The passage is from Milewski's *Category Theory for Programmers* (see Library sources). Denotational semantics gives each program a meaning as a mathematical object: a type denotes a set, a pure function denotes a mathematical function between those sets. Composition of programs is then composition of functions, which is exactly what a category describes. Effects are modelled by changing the arrows: a function `a -> m b` for a monad `m` is an arrow in the Kleisli category of `m`, and monadic composition `>=>` is composition in that category.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"All functions are pure" needs two caveats. Haskell has escape hatches such as `unsafePerformIO`. More importantly for the categorical model, every Haskell type also contains ⊥ (nontermination or `undefined`), and `seq` can tell `undefined` apart from `\x -> undefined x`. Because of this, Haskell types and functions don't form a category quite as cleanly as the passage suggests, and the usual practice is to reason in an idealised category of total functions and accept that the model ignores ⊥.

"We really don't lose anything" is also strong. Monads can describe any effect, but combining several effects is where the cost shows up: monads don't compose in general, which is why monad transformers, free monads and effect systems exist (see [Monads]({{< ref "functional-programming/monads" >}}#why-monads) and [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#effect-systems)).
{{< /callout >}}

## Natural transformations


other information

Natural transformations, loftTo, transform

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A natural transformation from functor `F` to functor `G` is a function `F[A] => G[A]` that works for every `A` without inspecting the elements: `headOption: List[A] => Option[A]`, or `maybeToList :: Maybe a -> [a]` in Haskell. In Haskell its type is `forall a. f a -> g a`; Cats calls it `FunctionK[F, G]`, written `F ~> G`. It satisfies `fmap f . nt = nt . fmap f`: mapping before or after the transformation gives the same result. In FP code it mostly appears when changing the effect type, for example interpreting a free monad into `IO`, or using `mapK` to move an algebra from one `F` to another. See [Category Theory]({{< ref "functional-programming/category-theory" >}}).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"loftTo" is most likely `liftTo`, from Cats syntax on `Option` and `Either`: `opt.liftTo[F](error)` turns an `Option[A]` into an `F[A]` for any `F` with an `ApplicativeError`, using the given error when the option is empty. That is close in spirit to a natural transformation, though it needs the error value. What "transform" referred to can't be recovered; several Cats data types (`EitherT`, `OptionT`) have a `transform` method, which maps over the whole wrapped value rather than being a natural transformation.
{{< /callout >}}

## Resources


<https://en.wikipedia.org/wiki/Category_theory>

<https://en.wikibooks.org/wiki/Haskell/Category_theory>

<https://github.com/prathyvsh/category-theory-resources>

<https://github.com/Gabriella439/slides/blob/main/lambdaconf/category/category.md>

<https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/> ([PDF](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc))

<https://ctfpis.gitbook.io/project/category-theory-for-programmers>

<https://mathworld.wolfram.com/Category.html>

category theory <https://www.math3ma.com/blog/what-is-category-theory-anyway>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
For a programmer, Milewski's *Category Theory for Programmers* is the usual starting point: it was written as the blog series that the preface link opens, and the library PDF is the edition with Scala examples next to the Haskell ones. The Wikipedia and MathWorld entries are reference definitions rather than places to learn from.
{{< /callout >}}


How to Bake Pi: Easy recipes for understanding complex maths

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A popular-mathematics book by Eugenia Cheng (2015) that introduces the ideas behind category theory, abstraction and generalisation, through cooking analogies. It was published in the US with a different subtitle. Her later *The Joy of Abstraction* (in Library sources) covers the same ground in much more depth and gets as far as functors, natural transformations and the Yoneda lemma.
{{< /callout >}}

## Associativity and commutativity


Associativity

<https://en.wikipedia.org/wiki/Associative_property>

and commutativity

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Associativity is one of the two axioms of a category: composition must satisfy `h . (g . f) == (h . g) . f`, and identity arrows must satisfy `id . f == f == f . id`. Associativity means you never need to say how a chain of compositions is grouped. The same property is what makes a monoid useful: `(a <> b) <> c == a <> (b <> c)` lets a fold, or a parallel reduction, group the work however it likes (see [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid)).

Commutativity (`a <> b == b <> a`) is an extra property on top of that. It lets you also reorder the elements, for example to combine partial results in whatever order they arrive.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Commutativity is not part of the definition of a category, and composition is not commutative in general: if `f: A => B` and `g: B => C`, then `g . f` exists but `f . g` usually doesn't even type-check. Many useful monoids aren't commutative either, such as string concatenation and function composition. Watch out for a separate use of the word: a *commutative diagram* means that all paths between two objects compose to the same arrow, which has nothing to do with swapping operands.
{{< /callout >}}


See also: [Functor]({{< ref "functional-programming/functor" >}}), [Monads]({{< ref "functional-programming/monads" >}}#why-monads), [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid), [Lambda Calculus]({{< ref "functional-programming/lambda-calculus" >}}) for currying and the curry/apply adjunction, and [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}).

## Library sources


- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*: the book behind the preface link and the purity passage, with Scala snippets next to the Haskell.
- [Cheng 2023](/sources/programming/category-theory/cheng-2023-joy-of-abstraction.pdf.enc), *The Joy of Abstraction: An Exploration of Math, Category Theory, and Life*: a gentle but rigorous first pass, by the author of *How to Bake Pi*.
- [Simmons 2011](/sources/programming/category-theory/simmons-2011-introduction-to-category-theory.pdf.enc), *An Introduction to Category Theory*: a slow textbook with exercises, for limits, colimits and adjunctions.

Further reading:

- [Adamek et al. 2004](/sources/programming/category-theory/adamek-2004-abstract-and-concrete-categories-joy-of-cats.pdf.enc), *Abstract and Concrete Categories: The Joy of Cats*
