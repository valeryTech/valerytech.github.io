---
draft: false
toc: true
title: "Towards Dependent Types"
description: "The progression from ordinary types through refinement types to dependent types, the two senses of \\\"dependent\\\", and how Haskell, Scala and Pierce's Dependent ML approach it."
linkTitle: "Dependent Types"
---

This note continues [Refinement Types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}) past the point where a solver can do the work.

There's an important conceptual progression from ordinary types to proofs:

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


"Dependent" is used in two senses along this line, which is a common source of confusion:

- **Value-dependent refinements.** A refinement that mentions another value (`hi >= lo`) already makes one type depend on a value. Systems of this kind keep the predicates in a restricted, decidable logic. Rondon et al. call Liquid Types a system of dependent types in this sense, and Pierce (section 30.5) describes Dependent ML, where dependent types are restricted to linear constraints and used to eliminate array bounds checks.
- **Full dependent types.** Types are indexed by arbitrary terms of the language, and types can compute. Agda, Idris, Lean and Rocq work this way.

Jhala's tutorial puts refinement types on this map as a restricted class of dependent types: less expressive, but with the proofs left to a solver.

The last two steps are the least familiar. A dependent type mentions a value: in `Vector<A, n>`, the length `n` is part of the type. Signatures can then state relationships, as in `append : Vector a n -> Vector a m -> Vector a (n + m)`, and `head` can accept only vectors whose length is at least one, so `head` of an empty vector is a type error rather than a runtime crash. In the last step, a type is a statement, and a value of that type is a proof of it. `x + 0 = x` has a value only if the statement is true.

Pierce's version of the `head` example (section 30.5, "Going Further: Dependent Types") is a list type indexed by its length, with `hd : Πn:Nat. FloatList (succ n) -> Float`: `hd` accepts only a list whose length is the successor of some `n`, so never an empty one. He also gives the warning: dependent types are a two-edged sword. Blurring type checking with theorem proving doesn't make theorem proving easy; it makes type checking intractable, so programs need hints to guide the checker, which may be worth it for critical code but is almost certainly too costly for everyday programming. That's why the practical languages restrict them.

The price is that type checking can now involve running code: to check `append`, the compiler has to evaluate `n + m`. That's why dependently typed languages require the functions that appear in types to be total (they terminate and handle every input), since otherwise type checking itself could loop forever.

Mainstream languages approximate the dependent end in their own ways:

- **Haskell** has no dependent types, but GADTs, DataKinds and type families let types be indexed by type-level copies of values, and *singletons* connect each type-level value to a run-time value. Maguire ([PDF](/sources/405eaf932837c8349209bea8675e06e4.bin), chapter 15, "Dependent Types") builds this up by hand and then with the `singletons` package, ending with dependent pairs (Σ types). Bragilevsky ([PDF](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), sections 13.2.3 and 13.2.4) introduces singletons on a door state machine and then uses them, with type-level naturals from the fin package, for a safe elevator interface ([Workflows And States]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}#typestate-with-phantom-types)).
- **Scala 3** has singleton types, match types and dependently typed methods. Wampler ([PDF](/sources/15972064071d3223586f8945de281cea.bin), chapter 17, "Match Types" and "Dependent Typing") builds a `DTList[N <: Int]` whose length is in its type, so `head` on an empty list is a compile error. Path-dependent types are a different, older feature ([Scala Type System]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#path-dependent-types)).

Once you understand that progression, a lot of features in **Scala, TypeScript, Rust and Haskell start looking like different compromises along the same axis**. For example, Rust's newtypes and typestate, Scala's match types and singleton types, TypeScript's narrowing and conditional types, and Haskell's GADTs/DataKinds all become much easier to place conceptually.

Refinement types are a good example of how a type system can do far more than inference. It can progressively move properties you'd otherwise test or document into properties the compiler can prove.

Related: [What Belongs In Types]({{< ref "type-driven-design/01-foundations/what-belongs-in-types" >}}#the-cost-of-stronger-guarantees) covers where this sits on the cost curve, and the Idris entries in [Reading Paths]({{< ref "type-driven-design/reading-paths" >}}) push this furthest.

## Library sources


- [Pierce 2002](/sources/61c011d4c2037767a1b6df1b6fde20de.bin), *Types and Programming Languages* -- section 30.5, "Going Further: Dependent Types": the indexed list, the cost warning and Dependent ML
- [Jhala et al. 2020](/sources/c7c34c23605882ae6298a988734fef45.bin), *Programming with Refinement Types: An Introduction to LiquidHaskell* -- the footnote in chapter 1 placing refinement types as a restricted class of dependent types, traded for automation
- [Rondon et al. 2008](/sources/c1ee665591c2e20039979587673830e7.bin), *Liquid Types* -- Liquid Types as a system of dependent types whose predicates stay in a decidable logic
- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 15, "Dependent Types", with singletons by hand, using `SBool` and the existential `SomeSBool` for a value read at run time (15.2), the general `Sing`/`SingKind` machinery (15.3), the `singletons` package (15.4) and dependent pairs with a structured-logging example (15.5); the chapter opens by naming its prerequisites, rank-N types, GADTs, type families and data kinds
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 13.2, dependent types with singletons
- [Wampler 2021](/sources/15972064071d3223586f8945de281cea.bin), *Programming Scala, 3rd Edition* -- chapter 17, match types, dependently typed methods and `DTList`

Further reading:

- [Noonan 2018](/sources/82bc6785596e6b9c5b3e2d9a2b2e9c58.bin), *Ghosts of Departed Proofs (Functional Pearl)* ([doi:10.1145/3242744.3242755](https://doi.org/10.1145/3242744.3242755)): sections 6, "Related Work", and 7, "Summary", on named values and phantom proofs that get many of the benefits of dependent and refinement types with only mild extensions to Haskell 2010, compared with Liquid Haskell and hs-to-coq, which keep the proofs outside the code; on the Haskell bullet
