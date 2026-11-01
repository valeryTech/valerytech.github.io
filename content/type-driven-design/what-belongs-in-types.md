---
draft: false
toc: true
title: "What Belongs In Types"
linkTitle: "What Belongs In Types"
---
# What belongs in the type system


Several sources study these ideas systematically, although there is no universally accepted "type-system design methodology."

## A good type-system target


There is a fairly clean way to reason about when something belongs in the type system.

|Property|Good type-system target?|Typical mechanism|
|---|---|---|
|`UserId` vs `OrderId`|Yes|distinct/new types|
|value may be absent|Yes|`Option<T>`|
|value is A, B, or C|Yes|sum type / enum|
|every case handled|Yes|exhaustive matching|
|collection is non-empty|Often|`NonEmpty<T>`|
|meters vs seconds|Yes|units-of-measure types|
|resource may only be consumed once|Often|linear/affine types|
|object follows state transitions|Often|typestate|
|operation can perform IO|Often|effect system|
|network protocol ordering|Sometimes|session types|
|integer is `0 <= x < n`|Sometimes|refinement/dependent types|
|username is unique in today's database|No|runtime/database constraint|
|user currently has enough money|Usually runtime|domain validation/transaction|
|algorithm sorts correctly|Usually beyond normal types|tests/proofs|
|service eventually answers|Usually beyond normal types|model checking/testing/monitoring|

That gives a useful principle:

**Put a property in the type system when it is stable, mechanically checkable, and useful to know throughout the program.**

## Where types stop matching reality


There is, however, a limit.

Suppose you want:

```text
withdraw(account, amount)
```


with the invariant:

```text
amount <= current account balance
```


You could imagine an extremely sophisticated dependent type:

```text
withdraw :
  Account<balance = b>
  -> Amount<a where a <= b>
  -> Account<balance = b-a>
```


But your balance lives in a database and another transaction may modify it.

At that point, encoding the property entirely into compile-time types stops matching reality. The database transaction is the authority.

That doesn't leave types with nothing to say. They can't prove that the balance is enough, but they can force every caller to deal with the case where it isn't:

```scala
def withdraw(account: AccountId, amount: PositiveAmount): IO[Either[InsufficientFunds, Balance]]
```


The amount being positive is a stable fact about the value, so it goes in the type. Whether the balance covers it is a fact about the world, checked inside the transaction. What reaches the type is the *possibility* of failure, as a value the caller can't ignore. That's the usual division of labour: types for what's true of the value, runtime checks for what's true of the world, and the result type for the outcome of the check.

## The cost of stronger guarantees


So there's a tradeoff:

```text
                  stronger static guarantees
                           ▲
                           │
 refinement types          │
 dependent types           │
 session types             │
                           │
 algebraic data types      │
 generics                  │
                           │
 primitive types           │
                           └──────────────────────►
                              proof/complexity cost
```


Refinement-type research makes this tradeoff explicit. Liquid Types ([PDF](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc)), for example, combine ordinary inferred types with logical predicates to prove properties such as safe array indexing, while attempting to keep annotation cost manageable. ([UCSD GOTO](https://goto.ucsd.edu/~rjhala/papers/liquid_types.html "Rondon/Kawaguchi/Jhala: Liquid Types"))

And gradual typing studies another point on this spectrum: letting parts of a program carry stronger static guarantees while other parts remain dynamically checked. Siek and Taha explicitly frame it as programmer-controlled migration between static and dynamic typing. ([Stanford University](https://web.stanford.edu/class/cs242/materials/old/siek06__gradual.pdf "Gradual Typing for Functional Languages")) ([PDF](/sources/programming/language-theory/siek-2006-gradual-typing-for-functional-languages.pdf.enc))

## A decision procedure


Proposed decision procedure:

1. Ask what invariant you're currently checking mentally, in comments, or repeatedly with `if`.
2. Ask whether violating it represents a programming error.
3. Ask whether the invariant remains true once established.
4. Ask whether many downstream functions benefit from knowing it.
5. See whether your language can represent it simply.
6. If the type representation becomes much harder to understand than the invariant itself, use runtime validation/tests.

Applied to two invariants:

```text
                          cart is non-empty at checkout     balance covers a withdrawal
1. checked repeatedly?    yes: pricing, shipping, UI        yes
2. violation is a bug?    yes: checkout shouldn't be        no: it's a normal business
                          reachable with an empty cart      outcome
3. stays true?            yes, once the cart is frozen      no: another transaction
                          for checkout                      can change it
4. many users downstream? yes                               few: the withdrawal itself
5. simple to represent?   yes: NonEmptyList                 no: needs dependent types
→                         put it in the type                check at runtime, put the
                                                            failure in the result type
```


Question 3 decides the second case on its own. A fact that can stop being true is a poor type, however useful it would be downstream.

A particularly good signal is repeated defensive code:

```ts
if (user != null)
if (order.status === "paid")
if (items.length > 0)
if (currency === expectedCurrency)
if (resource.isOpen)
```


When the same check appears throughout a codebase, there's often missing information in the types.

## Rule of thumb


A suggested rule for ordinary application design is: **use types to capture stable facts that would otherwise have to be remembered by programmers.** That's where the compiler tends to give the highest return for the added type complexity.

Related: [Type Systems]({{< ref "type-driven-design/type-systems" >}}) for what a type system can prove, [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) for carrying a checked property through the program, and [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}) for the stronger end of the cost curve.

## Encoding contracts in Scala


Moved from [To Sort]({{< ref "functional-programming/to-sort" >}}) on 2026-11-05. The **Explanation** and **Critique** callouts are commentary added that day; the rest is the original note text.

[https://docs.scala-lang.org/scala3/book/domain-modeling-fp.html](https://docs.scala-lang.org/scala3/book/domain-modeling-fp.html)

How deep do you want to encode your contracts.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The question behind this list: each invariant can be checked by a test, by a runtime check in a constructor, or by the type system. Moving it into types gives earlier and more complete guarantees but costs more code, slower compilation and harder error messages. [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}) works through how to decide.
{{< /callout >}}


[Refined](https://github.com/fthomas/refined) let's you constrain your primitive types ([https://github.com/fthomas/refined#provided-predicates](https://github.com/fthomas/refined#provided-predicates)) at compile time rather than runtime with assert.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Only literals can be checked at compile time. A value that arrives at runtime (user input, JSON, a database row) still has to be validated at runtime; refined does this with functions that return an `Either`, so the check happens once at the boundary and the rest of the code receives the refined type. Refined's compile-time literal checks rely on Scala 2 macros; for Scala 3, Iron is the commonly used refinement-types library. Worth checking against the current refined documentation.
{{< /callout >}}


[Shapeless](https://github.com/milessabin/shapeless/wiki/Feature-overview:-shapeless-2.0.0#collections-with-statically-known-sizes) can encode heterogeneous lists, extensible records, and dependently sized collections (among other things).

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Dated for Scala 3. Shapeless 2 is a Scala 2 library built on macros and implicit tricks. Scala 3 covers much of the same ground in the language: tuples are heterogeneous lists with type-level operations, and `Mirror` plus `inline` supports generic derivation.
{{< /callout >}}


[Value Types](https://docs.scala-lang.org/overviews/core/value-classes.html) can differentiate between a StreetNumber Int and an Age Int.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Value classes (`class Age(val value: Int) extends AnyVal`) avoid allocation only in simple cases. They are boxed when used as a generic type argument, stored in an array, or pattern matched. In Scala 3, `opaque type Age = Int` gives the distinct type with no runtime wrapper at all, and is usually the better choice.
{{< /callout >}}


[Leon](http://leon.epfl.ch/) and its scala subset Pure Scala can statically verify scala code.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Leon has been superseded by Stainless, its successor from the same EPFL lab, which verifies a subset of Scala with contracts (`require`, `ensuring`). The Leon link is probably stale.
{{< /callout >}}


[EitherT[IO, Throwable, A]](https://typelevel.org/cats/datatypes/eithert.html) can encode side effects and error handling as a data type, so that even error handling is encoded as data, so that if you are reading data from disk and deserializing it into your model fails, you can encode the failure as data without having to use try/catch flow control statements.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The example type is redundant. Cats Effect's `IO` already has an error channel for `Throwable` (`raiseError`, `handleErrorWith`, `attempt`), so `EitherT[IO, Throwable, A]` gives two places for the same failures. `EitherT` pays off when the left side is a domain error type, as in `EitherT[IO, ParseError, A]`, so that expected failures are visible in the signature while unexpected exceptions stay in `IO`.
{{< /callout >}}


You pay varying degrees of compiler execution time penalty with these things.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Compile time is only one of the costs. The others are harder error messages, a steeper learning curve for the rest of the team, and friction when the model changes, since every invariant in the types has to be kept consistent.
{{< /callout >}}

## Library sources


- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages* -- chapter 1 counts type systems among the lightweight formal methods, at the opposite end of the spectrum from Hoare logic and other heavyweight verification frameworks; on *The cost of stronger guarantees*
- [Rondon et al. 2008](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc), *Liquid Types* -- Hindley-Milner inference plus predicate abstraction, used to verify array bounds in OCaml; the paper cited by URL in *The cost of stronger guarantees*
- [Siek et al. 2006](/sources/programming/language-theory/siek-2006-gradual-typing-for-functional-languages.pdf.enc), *Gradual Typing for Functional Languages* -- the original gradual typing paper, cited by URL in *The cost of stronger guarantees*

Further reading:

- [Nielson et al. 1999](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc), *Type and Effect Systems*
- [Ousterhout 2018](/sources/software-engineering/craft/ousterhout-2018-philosophy-of-software-design.pdf.enc), *A Philosophy of Software Design*
