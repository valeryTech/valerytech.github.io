---
draft: false
toc: true
title: "Towards Dependent Types"
description: "The progression from ordinary types through refinement types to dependent types, the two senses of \\\"dependent\\\", and how Haskell, Scala and Pierce's Dependent ML approach it."
linkTitle: "Dependent Types"
---

This note continues [Refinement Types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}) past the point where a solver can do the work.

## The progression from types to proofs


Features across static type systems sit along a single progression from ordinary types to formal proofs:

```text
ordinary static type          Int
        ↓
literal / union type          0 | 1 | 2
        ↓
parametric type               List<A>
        ↓
algebraic type                Result<A, E>
        ↓
newtype / branded type        Positive              (checked once, at construction)
        ↓
refinement type               {x : Int | x > 0}     (predicate proved by a solver)
        ↓
refinement relating values    {x : Int | x > y && x < y + 10}
        ↓
dependent type                Vector<A, n>          (a value inside a type)
        ↓
propositions as types         proof : x + 0 = x
```


Seen along this line, many features in **Scala, TypeScript, Rust and Haskell are different compromises on the same axis**: Rust's newtypes and typestate, Scala's match types and singleton types, TypeScript's narrowing and conditional types, and Haskell's GADTs and `DataKinds` each trade expressiveness against inference and ergonomics at a different step, moving properties you'd otherwise test or document into properties the compiler checks.

## Two senses of "dependent"


"Dependent" is used in two senses along the upper steps of this progression, which is a common source of confusion:

- **Value-dependent refinements.** A refinement that mentions another value (`hi >= lo`) already makes one type depend on a value. Systems of this kind keep the predicates in a restricted, decidable logic. Rondon et al. ([PDF](/sources/c1ee665591c2e20039979587673830e7.bin)) call Liquid Types a system of dependent types in this sense, and Pierce ([PDF](/sources/61c011d4c2037767a1b6df1b6fde20de.bin), section 30.5) describes Dependent ML, where dependent types are restricted to linear constraints and used to eliminate array bounds checks. Jhala's tutorial ([PDF](/sources/c7c34c23605882ae6298a988734fef45.bin), chapter 1) puts refinement types on this map as a restricted class of dependent types: less expressive, but with the proofs left to a solver.
- **Full dependent types.** Types are indexed by arbitrary terms of the language, and types can compute. Agda, Idris, Lean and Rocq work this way.

The last two steps of the progression belong to full dependent types. A dependent type mentions a value: in `Vector<A, n>`, the length `n` is part of the type. Signatures can then state relationships, as in `append : Vector a n -> Vector a m -> Vector a (n + m)`, and `head` can accept only vectors whose length is at least one, so `head` of an empty vector is a type error rather than a runtime crash. In the final step, a type is a logical statement and a value of that type is a proof of it: `x + 0 = x` has a value only if the statement is true. Wadler ([PDF](/sources/e73a714dde09d48962f58768e5bd200a.bin), section 3, "Propositions as Types") places that step in logic: ordinary product, sum and function types correspond to propositional connectives (`&`, `∨`, `⊃`), and dependent types (Π and Σ types) are what extend the correspondence to predicate logic's quantifiers `∀` and `∃`.

Pierce's version of the `head` example (section 30.5, "Going Further: Dependent Types") is a list type indexed by its length, with `hd : Πn:Nat. FloatList (succ n) -> Float`: `hd` accepts only a list whose length is the successor of some `n`, so never an empty one. He also gives the warning: dependent types are a two-edged sword. Blurring type checking with theorem proving doesn't make theorem proving easy; it makes type checking intractable, so programs need hints to guide the checker, which may be worth it for critical code but is almost certainly too costly for everyday programming. That's why practical languages restrict them.

The price is that type checking can now involve running code: to check `append`, the compiler has to evaluate `n + m`. That's why dependently typed languages require the functions that appear in types to be total (they terminate and handle every input), since otherwise type checking itself could loop forever and a diverging term could inhabit any proposition (Wadler, section 1, "Church, and the theory of computation"; see [Types As Propositions]({{< ref "type-driven-design/01-foundations/types-as-propositions" >}})).

## Approximations in Haskell and Scala


Mainstream languages approximate the dependent end in their own ways:

- **Haskell** has no full dependent types, but GADTs, `DataKinds` and type families let types be indexed by type-level copies of values, and *singletons* connect each type-level value to a run-time value. Maguire ([PDF](/sources/405eaf932837c8349209bea8675e06e4.bin), chapter 15, "Dependent Types") builds this up by hand and then with the `singletons` package, ending with dependent pairs (Σ types). Bragilevsky ([PDF](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), sections 13.2.3 and 13.2.4) introduces singletons on a door state machine and then uses them, with type-level naturals from the `fin` package, for a safe elevator interface ([Workflows And States]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}#typestate-with-phantom-types)). Parsons ([PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), chapters 20-22) shows where the approximation leaks in production code: in `append :: Vector n a -> Vector m a -> Vector (Add n m) a`, a tail-recursive `Add` fails to type-check because GHC cannot deduce `Add n ('Succ m) ~ 'Succ (Add n m)` unless `Add`'s recursion is rewritten to match `VCons` (sections 20.6-20.8), and a missing equation in a type-level function yields a "stuck" unreduced type rather than an exhaustiveness error (section 22.4, which also weighs type families against functional dependencies and places type classes on the Lambda Cube as the `Type -> Value` bridge).
- **Scala 3** has singleton types, match types and dependently typed methods. Wampler ([PDF](/sources/15972064071d3223586f8945de281cea.bin), chapter 17, "Match Types" and "Dependent Typing") builds a `DTList[N <: Int]` whose length is in its type, so `head` on an empty list is a compile error. Volpe ([PDF](/sources/42ef10a33c54df6756cd49d40ee34101.bin), section 4.5, "Dependent types", and section 8.1.2.5, "FSM Dependent Types") uses match types for an everyday domain invariant, computing a finite state machine's state and tracer types from its input type so mismatched combinations can't be constructed. Path-dependent types are a different, older feature ([Scala Type System]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#path-dependent-types)).

Related: [What Belongs In Types]({{< ref "type-driven-design/01-foundations/what-belongs-in-types" >}}#the-cost-of-stronger-guarantees) covers where this sits on the cost curve, and the Idris entries in [Reading Paths]({{< ref "type-driven-design/reading-paths" >}}) push this furthest.

## Library sources


- [Pierce 2002](/sources/61c011d4c2037767a1b6df1b6fde20de.bin), *Types and Programming Languages* -- section 30.5, "Going Further: Dependent Types": the indexed list, the cost warning and Dependent ML; on *Two senses of "dependent"*
- [Wadler 2015](/sources/e73a714dde09d48962f58768e5bd200a.bin), *Propositions as Types* -- section 1, "Church, and the theory of computation", on termination and logical consistency, and section 3, "Propositions as Types", on Howard's extension from propositional connectives to predicate quantifiers (`∀`, `∃`) as dependent types; on *Two senses of "dependent"*
- [Jhala et al. 2020](/sources/c7c34c23605882ae6298a988734fef45.bin), *Programming with Refinement Types: An Introduction to LiquidHaskell* -- the footnote in chapter 1 placing refinement types as a restricted class of dependent types, traded for automation; on *Two senses of "dependent"*
- [Rondon et al. 2008](/sources/c1ee665591c2e20039979587673830e7.bin), *Liquid Types* -- Liquid Types as a system of dependent types whose predicates stay in a decidable logic; on *Two senses of "dependent"*
- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 15, "Dependent Types", with singletons by hand, using `SBool` and the existential `SomeSBool` for a value read at run time (15.2), the general `Sing`/`SingKind` machinery (15.3), the `singletons` package (15.4) and dependent pairs with a structured-logging example (15.5); the chapter opens by naming its prerequisites, rank-N types, GADTs, type families and data kinds; on *Approximations in Haskell and Scala*
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 13.2, dependent types with singletons; on *Approximations in Haskell and Scala*
- [Parsons 2023](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), *Production Haskell* -- chapter 20, "Basic Type Level Programming" (sections 20.6-20.8 on length-indexed `Vector` and why tail-recursive `Add` fails unification in `append`), chapter 21, "Family Values" (closed, open and associated type families, data families, and bridging types and values), and chapter 22, "Trade-offs in Type Programming" (functional dependencies versus type families, the Lambda Cube, and stuck type families); on *Approximations in Haskell and Scala*
- [Wampler 2021](/sources/15972064071d3223586f8945de281cea.bin), *Programming Scala, 3rd Edition* -- chapter 17, match types, dependently typed methods and `DTList`; on *Approximations in Haskell and Scala*
- [Volpe 2023](/sources/42ef10a33c54df6756cd49d40ee34101.bin), *Functional Event-Driven Architecture: Powered by Scala 3* -- section 4.5, "Dependent types", and section 8.1.2.5, "FSM Dependent Types", using Scala 3 match types to determine state and tracer types from an FSM's input type; on *Approximations in Haskell and Scala*

Further reading:

- [Noonan 2018](/sources/82bc6785596e6b9c5b3e2d9a2b2e9c58.bin), *Ghosts of Departed Proofs (Functional Pearl)* ([doi:10.1145/3242744.3242755](https://doi.org/10.1145/3242744.3242755)): sections 6, "Related Work", and 7, "Summary", on named values and phantom proofs that get many of the benefits of dependent and refinement types with only mild extensions to Haskell 2010, compared with Liquid Haskell and hs-to-coq, which keep the proofs outside the code; on *Approximations in Haskell and Scala*
- [Hackett 2020](/sources/6e9810f06b69f2d55edd9b9bd9bb4b5a.bin), *Review of "Thinking with Types" by Sandy Maguire* (*Journal of Functional Programming*) -- situates Maguire's book as a digest of Haskell Symposium type-level programming techniques and notes two slips to watch for (conflating cardinal arithmetic of types with Curry-Howard, which has almost no proof material in the book, and presenting the codensity monad as the continuation monad); on *Approximations in Haskell and Scala*
