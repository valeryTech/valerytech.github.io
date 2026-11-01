---
draft: false
toc: true
title: "Lambda Calculus"
linkTitle: "Lambda Calculus"
---

The untyped lambda calculus as the core model of functional programming: binding, function application and β-reduction, reduction strategies and Church encodings.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Binding


binding

`(λx.t)` *binds* the variable x in the term t.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A lambda calculus term is one of three things: a variable `x`, an abstraction `λx.t` (a function with parameter `x` and body `t`), or an application `t u`. In `λx.t`, every free occurrence of `x` inside `t` refers to this parameter; we say it is *bound*. A variable that isn't bound by any enclosing λ is *free*. In `λx.x y`, `x` is bound and `y` is free.

Two consequences matter in practice. Bound names don't matter: `λx.x` and `λy.y` are the same term (α-equivalence). And substitution must avoid *capture*: substituting `x` for `y` in `λx.y` must give `λz.x` after renaming, not `λx.x`, which would change the meaning.
{{< /callout >}}

## Function application and β-reduction


function application

apply

Function application in the lambda calculus is expressed by β-reduction.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The one computation rule is β-reduction: `(λx.t) u -> t[x := u]`, meaning replace every free `x` in `t` with `u`, renaming bound variables where needed to avoid capture. For example `(λx.x x) (λy.y)` reduces to `(λy.y) (λy.y)` and then to `λy.y`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Slightly imprecise. Application is a piece of syntax: writing `t u` side by side. β-reduction is the rule that says what an application means when its left side is a lambda. An application such as `x u`, with a free variable on the left, is a valid term that cannot be β-reduced.
{{< /callout >}}


<https://en.wikipedia.org/wiki/Apply>

More precisely, curry and apply are [adjoint functors](https://en.wikipedia.org/wiki/Adjoint_functors "Adjoint functors").

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`curry` turns a function of a pair into a function that returns a function, `((A, B) => C) => (A => B => C)`, and `apply` (also called `eval`) takes a function and an argument and applies one to the other, `(B => C, B) => C`. Category theory states their relationship precisely. In a category with products and function types (a cartesian closed category, such as an idealised category of types and functions), pairing with `B` (`A ↦ A × B`) is left adjoint to taking functions out of `B` (`C ↦ B ⇒ C`). The adjunction is the one-to-one correspondence between arrows `A × B -> C` and arrows `A -> (B ⇒ C)` that `curry` and `uncurry` witness, and `apply: (B ⇒ C) × B -> C` is its counit. See [Category Theory]({{< ref "functional-programming/category-theory" >}}) and [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#currying-and-partial-application).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The sentence (it comes from the Wikipedia article linked above) is a loose shorthand. `curry` and `apply` are not themselves functors. The adjoint functors are `− × B` and `B ⇒ −`; `curry` is the natural bijection between arrows that makes them adjoint, and `apply` is the counit of the adjunction.
{{< /callout >}}

## Reduction strategies


reduction strategy

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A term can contain several redexes (reducible applications), and a reduction strategy decides which one to reduce next. The main ones:

- **Normal order**: always reduce the leftmost outermost redex, even inside a lambda body. If a term has a normal form, normal order reaches it (the normalization theorem).
- **Applicative order**: reduce the leftmost innermost redex first, so arguments are reduced before the function is applied.
- **Call-by-name**: like normal order, but don't reduce inside lambda bodies. Arguments are passed unevaluated.
- **Call-by-value**: reduce an argument to a value before substituting it, and don't reduce inside lambda bodies. This is what most languages do.
- **Call-by-need**: call-by-name with sharing, so each argument is evaluated at most once. This is lazy evaluation, as in Haskell.

With `Ω = (λx.x x) (λx.x x)`, which reduces to itself forever, the term `(λx.λy.y) Ω` reduces to `λy.y` under call-by-name, but loops under call-by-value. The Church-Rosser theorem guarantees that whenever two strategies both finish, they give the same normal form. See [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}).
{{< /callout >}}

## Church encodings


church encodings

boolean values and functions

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The pure lambda calculus has only functions, so data is encoded as functions that *do something* with their alternatives. A Church boolean takes two arguments and returns one of them:

```
true  = λt.λf.t
false = λt.λf.f
if    = λb.λx.λy.b x y
not   = λb.b false true
and   = λp.λq.p q p
or    = λp.λq.p p q
```

For example `and true false = true false true = false`. Numbers work the same way: the Church numeral `n` applies a function `n` times, `0 = λf.λx.x`, `1 = λf.λx.f x`, `2 = λf.λx.f (f x)`, and `succ = λn.λf.λx.f (n f x)`. The same idea in a typed language is a fold: a Church-encoded list is its own `foldr`.
{{< /callout >}}

## Resources


<https://lambdacalc.io/>

<https://lambda-machine.com/>

<https://opendsa-server.cs.vt.edu/OpenDSA/Books/PL/html/Syntax.html>

<https://pages.cs.wisc.edu/~horwitz/CS704-NOTES/>

<https://www.reddit.com/r/haskell/comments/c3ahcd/how_get_a_understanding_of_lambada_calculus/>

<https://plato.stanford.edu/entries/lambda-calculus/>

ex

<https://pages.cs.wisc.edu/~horwitz/CS704-NOTES/1.LAMBDA-CALCULUS.html>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"ex" most likely marks the lambda-calculus chapter of the Wisconsin CS704 notes below it as a source of examples or exercises; the note doesn't say which. For working through reductions by hand, Rojas's short tutorial and Sestoft's paper on reduction strategies (Library sources) are a good pair: the first covers β-reduction, Church encodings and the Y combinator in nine pages, the second compares the strategies above precisely.
{{< /callout >}}


See also: [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}) for reduction, the Church-Rosser theorem and lazy evaluation, [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#currying-and-partial-application), and [Category Theory]({{< ref "functional-programming/category-theory" >}}).

## Library sources


- [Rojas 1997](/sources/programming/functional-programming/rojas-1997-tutorial-introduction-to-lambda-calculus.pdf.enc), *A Tutorial Introduction to the Lambda Calculus*: binding, β-reduction, Church numerals and booleans, and the fixed-point combinator.
- [Sestoft 2002](/sources/programming/functional-programming/sestoft-2002-demonstrating-lambda-calculus-reduction.pdf.enc), *Demonstrating Lambda Calculus Reduction*: normal order, applicative order, call-by-name and call-by-value, side by side.
- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages*: the untyped lambda calculus with precise definitions of substitution and evaluation, then the typed calculi.

Further reading:

- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*
- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages (2nd edition)*
