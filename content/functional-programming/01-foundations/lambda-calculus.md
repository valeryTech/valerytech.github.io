---
draft: false
toc: true
title: "Lambda Calculus for Functional Programmers"
aliases:
  - "/functional-programming/lambda-calculus/"
description: "The lambda calculus as a programmer needs it: terms and binding, β-reduction, currying, reduction strategies, and Church encodings of booleans and numbers."
linkTitle: "Lambda Calculus"
---

The untyped lambda calculus is the core model of functional programming. It has only three kinds of term and one computation rule, and it is enough to explain binding, function application, evaluation strategies and how data can be built from functions.

## Terms and binding


A lambda calculus term is one of three things:

- a variable `x`;
- an abstraction `λx.t`, a function with parameter `x` and body `t`;
- an application `t u`, the term `t` applied to the term `u`.

`λx.t` *binds* the variable `x` in the term `t`: every free occurrence of `x` inside `t` refers to this parameter. A variable that no enclosing λ binds is *free*. In `λx.x y`, `x` is bound and `y` is free.

Two consequences matter in practice:

- Bound names don't matter. `λx.x` and `λy.y` are the same term; this is α-equivalence.
- Substitution must avoid *capture*. Substituting `x` for `y` in `λx.y` must give `λz.x`, after renaming the bound variable, not `λx.x`, which would change the meaning.

## Function application and β-reduction


Application and β-reduction are related but not the same thing. Application is a piece of syntax: writing `t u` side by side. β-reduction is the one computation rule, and it says what an application means when its left side is a lambda:

```
(λx.t) u  ->  t[x := u]
```


That is, replace every free `x` in `t` with `u`, renaming bound variables where needed to avoid capture. For example:

```
(λx.x x) (λy.y)  ->  (λy.y) (λy.y)  ->  λy.y
```


An application whose left side is not a lambda, such as `x u` with a free variable `x`, is a valid term that cannot be β-reduced.

### Curry and apply


`curry` turns a function of a pair into a function that returns a function, `((A, B) => C) => (A => B => C)`. `apply` (also called `eval`) takes a function and an argument and applies one to the other, `(B => C, B) => C`. The Wikipedia article on apply states their relationship in category-theory terms:

> More precisely, curry and apply are [adjoint functors](https://en.wikipedia.org/wiki/Adjoint_functors "Adjoint functors").

That is a loose shorthand: `curry` and `apply` are not themselves functors. The precise statement is about a category with products and function types, a cartesian closed category such as an idealised category of types and functions. There, pairing with `B` (`A ↦ A × B`, the functor `− × B`) is left adjoint to taking functions out of `B` (`C ↦ B ⇒ C`, the functor `B ⇒ −`). The adjunction is the one-to-one correspondence between arrows `A × B -> C` and arrows `A -> (B ⇒ C)`; `curry` and `uncurry` witness it, and `apply: (B ⇒ C) × B -> C` is its counit. See [Category theory]({{< ref "functional-programming/02-abstractions/category-theory" >}}) and [Currying and partial application]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#currying-and-partial-application).

- Wikipedia, "Apply": <https://en.wikipedia.org/wiki/Apply>

## Reduction strategies


A term can contain several redexes (reducible applications). A reduction strategy decides which one to reduce next. The main ones:

- **Normal order**: always reduce the leftmost outermost redex, even inside a lambda body. If a term has a normal form, normal order reaches it (the normalization theorem).
- **Applicative order**: reduce the leftmost innermost redex first, so arguments are reduced before the function is applied.
- **Call-by-name**: like normal order, but don't reduce inside lambda bodies. Arguments are passed unevaluated.
- **Call-by-value**: reduce an argument to a value before substituting it, and don't reduce inside lambda bodies. This is what most languages do.
- **Call-by-need**: call-by-name with sharing, so each argument is evaluated at most once. This is lazy evaluation, as in Haskell.

The strategies can differ in whether they finish at all. Take `Ω = (λx.x x) (λx.x x)`, which reduces to itself forever. Then `(λx.λy.y) Ω` reduces to `λy.y` under call-by-name, because the argument is discarded unevaluated, but loops under call-by-value, which tries to evaluate `Ω` first. The Church-Rosser theorem guarantees that whenever two strategies both reach a normal form, it is the same one. See [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}).

## Church encodings


The pure lambda calculus has only functions, so data is encoded as functions that *do something* with their alternatives.

### Booleans and their functions


A Church boolean takes two arguments and returns one of them:

```
true  = λt.λf.t
false = λt.λf.f
if    = λb.λx.λy.b x y
not   = λb.b false true
and   = λp.λq.p q p
or    = λp.λq.p p q
```


For example, `and true false = true false true = false`.

### Numbers


The Church numeral `n` applies a function `n` times:

```
0    = λf.λx.x
1    = λf.λx.f x
2    = λf.λx.f (f x)
succ = λn.λf.λx.f (n f x)
```


The same idea in a typed language is a fold: a Church-encoded list is its own `foldr` (see [Recursion and folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}})).

## Resources


Introductions and references:

- Stanford Encyclopedia of Philosophy, "The Lambda Calculus": <https://plato.stanford.edu/entries/lambda-calculus/>
- OpenDSA, Programming Languages book, chapter on syntax: <https://opendsa-server.cs.vt.edu/OpenDSA/Books/PL/html/Syntax.html>
- University of Wisconsin CS704 course notes: <https://pages.cs.wisc.edu/~horwitz/CS704-NOTES/>
- CS704 notes, chapter 1, lambda calculus, marked as a source of examples or exercises: <https://pages.cs.wisc.edu/~horwitz/CS704-NOTES/1.LAMBDA-CALCULUS.html>
- Reddit r/haskell, "How to get an understanding of lambda calculus": <https://www.reddit.com/r/haskell/comments/c3ahcd/how_get_a_understanding_of_lambada_calculus/>

Online tools, topics not checked:

- lambdacalc.io: <https://lambdacalc.io/>
- Lambda Machine: <https://lambda-machine.com/>

For working through reductions by hand, Rojas 1997 and Sestoft 2002 (Library sources) are a good pair. Rojas covers β-reduction, Church encodings and the Y combinator in nine pages; Sestoft compares the reduction strategies above precisely.

See also: [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}) for reduction, the Church-Rosser theorem and lazy evaluation, [Currying and partial application]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#currying-and-partial-application), and [Category theory]({{< ref "functional-programming/02-abstractions/category-theory" >}}).

## Library sources


- [Rojas 1997](/sources/programming/functional-programming/rojas-1997-tutorial-introduction-to-lambda-calculus.pdf.enc), *A Tutorial Introduction to the Lambda Calculus*: binding, β-reduction, Church numerals and booleans, and the fixed-point combinator.
- [Sestoft 2002](/sources/programming/functional-programming/sestoft-2002-demonstrating-lambda-calculus-reduction.pdf.enc), *Demonstrating Lambda Calculus Reduction*: normal order, applicative order, call-by-name and call-by-value, side by side.
- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages*: the untyped lambda calculus with precise definitions of substitution and evaluation, then the typed calculi.

Further reading:

- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*
- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages (2nd edition)*
