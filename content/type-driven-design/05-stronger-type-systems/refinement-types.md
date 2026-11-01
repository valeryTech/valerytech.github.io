---
draft: false
toc: true
title: "Refinement Types"
description: "Refinement types as base types restricted by predicates: why bother, how SMT-based checking and Liquid inference work, and the limits of the approach."
linkTitle: "Refinement Types"
---

A refinement type puts a predicate into a type, and a solver checks it. Part of [Stronger type systems]({{< ref "type-driven-design/05-stronger-type-systems" >}}): what the major languages offer is in [Refinement Types By Language]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types-by-language" >}}), and the step beyond, to types that depend on values, is in [Dependent Types]({{< ref "type-driven-design/05-stronger-type-systems/dependent-types" >}}).

## What a refinement type is


In the usual PL sense, a refinement type is a base type restricted by a logical predicate:

```text
{x : Int | x > 0}
```


Read that as "an `Int` named `x` for which `x > 0` is true."

So:

```text
Int
```


contains `-3, 0, 1, 2, ...`, while

```text
{x : Int | x > 0}
```


contains only `1, 2, 3, ...`.

It's set-builder notation from mathematics, {x ∈ ℤ | x > 0}, used as a type. Another analogy is a SQL `CHECK (x > 0)` constraint, but checked by the compiler on every code path that produces an `x`, instead of by the database on every insert.

The important part is that the predicate participates in static type checking. In systems like Liquid Haskell, the compiler/checker can send these logical constraints to an SMT solver and prove them.

For example:

```text
type Positive = {x : Int | x > 0}

divide : Int -> {d : Int | d != 0} -> Int
```


Then:

```text
divide 10 2   // accepted
divide 10 0   // rejected statically
```


They can get more powerful because predicates can refer to other values:

```text
range :
    lo : Int ->
    {hi : Int | hi >= lo} ->
    List {x : Int | lo <= x && x < hi}
```


Now the type describes relationships between inputs and outputs. That's where refinement types start looking like lightweight program verification.

### Why bother


Jhala, Seidel and Vazou's LiquidHaskell tutorial ([PDF](/sources/programming/language-theory/jhala-2020-programming-with-refinement-types.pdf.enc)) opens with a chapter called "Well-Typed Programs Do Go Wrong". Haskell's types rule out a lot, but a well-typed Haskell program can still divide by zero, look up a key that isn't in a map, take the `head` of an empty list, or, with an unchecked index, read memory it shouldn't (the tutorial reconstructs a Heartbleed-style overread in Haskell). These are the bugs refinement types target: properties of values, not of shapes.

### Three ideas from the tutorial


Chapter 3 ("Refinement Types") gives the working model:

- **Subtyping is implication.** `{v:Int | v = 0}` is a subtype of `{v:Int | 0 <= v}` because `v = 0` implies `0 <= v`. So `zero` has type `Nat`, and also `Even`, and also `Lt100`: a value has every refinement its predicate implies.
- **Erasing the predicates gives ordinary types.** `Int` is `{v:Int | true}`. A refinement type is an ordinary type plus extra information, so the program still compiles and runs as plain Haskell.
- **Pre- and postconditions are types.** A refined argument is a precondition; a refined result is a postcondition. `die :: {v:String | false} -> a` has a precondition no value can meet, so every call to `die` that type-checks is provably unreachable.

## How the checking works


The checker turns each place where a value flows into a refined type into a logical implication, a *verification condition*, and asks an SMT solver whether it holds. To keep that automatic, the logic is restricted. LiquidHaskell uses QF-UFLIA (Jhala, chapter 2): quantifier-free formulas over linear integer arithmetic and uninterpreted functions, a fragment the solver can decide.

Three consequences shape how refinement types are used:

- **Tests refine values.** In the branch of `if isPositive d` the checker knows `d > 0`, but only if it knows what `isPositive` means. The tutorial ("Testing Values: Booleans and Propositions") gives the boolean function a refined result, `isPositive :: x:Int -> {v:Bool | v <=> x > 0}`, which ties the bit to the proposition it answers. That's the refinement-type fix for Harper's boolean blindness ([Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}#dont-throw-information-away)), and it needs no wrapper type: the same `Int` is simply known to be positive inside the branch.
- **Refinements are inferred.** Liquid Types (Rondon, Kawaguchi and Jhala, [PDF](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc)) infers refinements as conjunctions of *qualifiers*, simple predicate templates such as `0 <= v` or `v < len a`, so loop invariants and the refinements of local variables don't have to be written. In their benchmarks the annotations needed to prove array-bounds safety dropped from 31% of the program text to under 1%. When a property can't be proved, the results show where to add a qualifier, or where a run-time check is needed after all.
- **Measures lift functions into the logic.** A *measure* is a total Haskell function, such as `len` or `notEmpty`, that the checker can use inside predicates (Jhala, chapter 6, "Boolean Measures"). With it, "this list is non-empty" becomes a refinement of an ordinary list, `{v:[a] | notEmpty v}`, rather than a separate `NonEmpty` type with its own functions.

LiquidHaskell also checks termination by default, since a function that might not terminate could "prove" anything (see the caveat in [Types As Propositions]({{< ref "type-driven-design/01-foundations/types-as-propositions" >}})).

## Limits


The power comes with practical limits:

- **The logic has to stay decidable.** SMT-based checkers work well with linear arithmetic, equality and uninterpreted functions. With non-linear arithmetic (`x * y > z`) or quantifiers, the solver can time out or give up, and you end up adding hints or restructuring code to please it.
- **Errors are failed implications.** A rejection says that some generated logical formula couldn't be proved, which takes practice to trace back to the line that's wrong.
- **Some annotation is unavoidable.** Liquid inference finds most loop invariants and local refinements from qualifiers, so the burden is far lower than in classic program verification. What remains is writing the specifications of exported functions, adding qualifiers or measures when inference falls short, and termination arguments for recursion the checker can't see terminating.
- **The trusted base.** Specifications for code the checker can't see, such as library functions, foreign calls or data from outside, are assumed rather than proved. Jhala's chapter 11 ("Assumptions vs Guarantees") makes the distinction explicit: an assumed specification is trusted, a verified one is checked. A wrong assumption is the refinement-type version of a type that lies ([What Belongs In Types]({{< ref "type-driven-design/01-foundations/what-belongs-in-types" >}}#costs-and-failure-modes)).
- **Library encodings stop at literals.** Iron and `refined` check literal values at compile time, but a value that arrives at runtime still goes through a checking function (`refineEither`, `refineV`). For real input they're [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) with nicer syntax, not proofs.

## Library sources


- [Jhala et al. 2020](/sources/programming/language-theory/jhala-2020-programming-with-refinement-types.pdf.enc), *Programming with Refinement Types: An Introduction to LiquidHaskell* -- the LiquidHaskell tutorial: chapter 1 on bugs well-typed programs still have, chapter 2 on the logic and SMT, chapter 3 on refinement types, subtyping and testing values, chapter 6 on measures, chapter 11 on assumptions and guarantees; on *What a refinement type is*, *How the checking works* and *Limits*
- [Rondon et al. 2008](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc), *Liquid Types* -- inference of refinement types from qualifiers, with run-time checks where proof fails; on *How the checking works* and *Limits*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- chapter 1 uses the `refined` library for refinement types and validates runtime values into them; on *Limits*

Further reading:

- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages, 2nd Edition*
- [Wadler 2015](/sources/programming/language-theory/wadler-2015-propositions-as-types.pdf.enc), *Propositions as Types*
