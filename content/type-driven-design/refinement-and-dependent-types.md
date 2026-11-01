---
draft: false
toc: true
title: "Refinement and Dependent Types"
description: "Refinement types as base types restricted by predicates: how checking works, support by language, Scala's terminology trap, the limits of the approach, and the step towards dependent types."
linkTitle: "Refinement and Dependent Types"
---
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

- **Tests refine values.** In the branch of `if isPositive d` the checker knows `d > 0`, but only if it knows what `isPositive` means. The tutorial ("Testing Values: Booleans and Propositions") gives the boolean function a refined result, `isPositive :: x:Int -> {v:Bool | v <=> x > 0}`, which ties the bit to the proposition it answers. That's the refinement-type fix for Harper's boolean blindness ([Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#dont-throw-information-away)), and it needs no wrapper type: the same `Int` is simply known to be positive inside the branch.
- **Refinements are inferred.** Liquid Types (Rondon, Kawaguchi and Jhala, [PDF](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc)) infers refinements as conjunctions of *qualifiers*, simple predicate templates such as `0 <= v` or `v < len a`, so loop invariants and the refinements of local variables don't have to be written. In their benchmarks the annotations needed to prove array-bounds safety dropped from 31% of the program text to under 1%. When a property can't be proved, the results show where to add a qualifier, or where a run-time check is needed after all.
- **Measures lift functions into the logic.** A *measure* is a total Haskell function, such as `len` or `notEmpty`, that the checker can use inside predicates (Jhala, chapter 6, "Boolean Measures"). With it, "this list is non-empty" becomes a refinement of an ordinary list, `{v:[a] | notEmpty v}`, rather than a separate `NonEmpty` type with its own functions.

LiquidHaskell also checks termination by default, since a function that might not terminate could "prove" anything (see the caveat in [Type Systems]({{< ref "type-driven-design/type-systems" >}}#types-as-propositions)).

## Support by language


Support in common languages:

| Language | True predicate refinement types? | Closest feature |
|---|---|---|
| Scala | Via libraries/tools | Iron, `refined`; Scala's own "refinement types" mean something different |
| Python | No | `Literal`, `TypeIs`, `TypeGuard`, `Annotated` |
| TypeScript | No general support | narrowing, literal types, template literal types, branded types |
| Haskell | Via Liquid Haskell | Liquid Haskell is a canonical refinement-type system |
| Rust | Via external tools | Flux; native Rust commonly uses newtypes + smart constructors |
| Ada | Range constraints, checked at run time | `subtype Small is Integer range 0 .. 99` (Sebesta, section 6.15) |

Ada is the old exception: a subtype with a range constraint is a refinement type whose predicate is checked at run time rather than proved, and SPARK, Ada's verifiable subset, can prove many of those checks statically.

### Python


Python has several features that look somewhat similar:

```python
Literal[3]
```


is effectively the tiny subset of `int` containing exactly `3`.

And:

```python
def is_str(x: object) -> TypeIs[str]:
    return isinstance(x, str)
```


lets a checker narrow `x` after a runtime test.

You can even write:

```python
Annotated[int, ValueRange(1, 100)]
```


but Python's typing specification says ordinary type checkers may ignore that metadata. It doesn't mean the type checker proves `1 <= x <= 100`.

So Python has refinement-like building blocks, but no general refinement type system. Ramalho ([PDF](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), chapter 8) notes the gap directly: the type system has no way to say "an integer between 1 and 1000".

### TypeScript


TypeScript is similar. It has sophisticated control-flow narrowing:

```ts
function f(x: string | number) {
    if (typeof x === "string") {
        // x: string
    }
}
```


TypeScript explicitly calls this narrowing: the compiler tracks runtime checks and derives a more specific type.

It also has literal and template literal types:

```ts
type Port = 80 | 443

type EventName = `${string}Changed`
```


which describe subsets of larger types.

But you can't generally say:

```ts
type Positive = { x: number | x > 0 } // hypothetical
```


and have TypeScript prove arithmetic facts about `x`.

The usual TypeScript workaround, a brand plus validation, is in [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#smart-constructors-and-newtypes).

### Haskell


Haskell is probably the clearest example because Liquid Haskell adds exactly this model:

```haskell
{-@ type Nat = {v:Int | 0 <= v} @-}
```


Liquid Haskell describes refinement types directly as "types + logical predicates" and uses logical solvers for verification.

Plain GHC Haskell has GADTs, type families, DataKinds, etc., which can encode many invariants, but general value predicates like `x > 0` aren't ordinary Haskell types.

### Rust


Rust also doesn't have general logical refinement types built into the language.

There is also Flux, an external refinement type checker for Rust, which supports actual logical refinements and describes itself explicitly as a refinement type checker for Rust.

The usual Rust approach, a newtype with a private constructor, is in [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#smart-constructors-and-newtypes).

## Scala's terminology trap


In Scala, there's a terminology trap. Scala itself has something called a "refinement type," such as structural member refinement:

```scala
SomeType { type Element = String }
```


Scala documentation uses that terminology.

That's different from the logical refinement types we're discussing.

For predicate refinements in Scala, libraries can provide something much closer to the classical concept. For example, Iron supports:

```scala
val x: Int :| Greater[0] = 5
```


and can reject a known-invalid value at compile time. There is also the older `refined` library, explicitly described as refinement types using type-level predicates.

Scala's own member refinements are in [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#nominal-and-structural-subtyping).

Links on refined types in Scala:

<https://engineering.contentsquare.com/2021/scala-refined-types/>

<https://blog.rockthejvm.com/refined-types/> with restrictions:

<https://msitko.pl/blog/build-your-own-refinement-types-in-scala3.html>

refined types: <http://fthomas.github.io/talks/2016-05-04-refined>

<https://github.com/fthomas/refined>

### Notes moved from the Scala note


Moved from [Scala]({{< ref "functional-programming/04-languages/scala" >}}) on 2026-11-05. The **Explanation** and **Critique** callouts are commentary added that day; the rest is the original note text.

**Refinement types**

In type theory, a refinement type is a type endowed with a predicate which is assumed to hold for any element of the refined type. Refinement types can express preconditions when used as function arguments or postconditions when used as return types:

<https://github.com/Iltotore/iron>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Iron is a Scala 3 library for this: `val age: Int :| Positive = 42` is checked at compile time for literals, and runtime values are checked with methods such as `refineEither`. The Scala 2 equivalent is the refined library. Note that Scala's own "refinement type" means something else; see [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}).
{{< /callout >}}


Both libraries appear in the library's Scala books: Volpe's *Practical FP in Scala* ([PDF](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), chapter 1) uses `refined` and validates runtime values into it, and his Scala 3 book ([PDF](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), chapter 4) uses Iron.

## Limits


The power comes with practical limits:

- **The logic has to stay decidable.** SMT-based checkers work well with linear arithmetic, equality and uninterpreted functions. With non-linear arithmetic (`x * y > z`) or quantifiers, the solver can time out or give up, and you end up adding hints or restructuring code to please it.
- **Errors are failed implications.** A rejection says that some generated logical formula couldn't be proved, which takes practice to trace back to the line that's wrong.
- **Some annotation is unavoidable.** Liquid inference finds most loop invariants and local refinements from qualifiers, so the burden is far lower than in classic program verification. What remains is writing the specifications of exported functions, adding qualifiers or measures when inference falls short, and termination arguments for recursion the checker can't see terminating.
- **The trusted base.** Specifications for code the checker can't see, such as library functions, foreign calls or data from outside, are assumed rather than proved. Jhala's chapter 11 ("Assumptions vs Guarantees") makes the distinction explicit: an assumed specification is trusted, a verified one is checked. A wrong assumption is the refinement-type version of a type that lies ([What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}#costs-and-failure-modes)).
- **Library encodings stop at literals.** Iron and `refined` check literal values at compile time, but a value that arrives at runtime still goes through a checking function (`refineEither`, `refineV`). For real input they're [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) with nicer syntax, not proofs.

## Towards dependent types


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

- **Haskell** has no dependent types, but GADTs, DataKinds and type families let types be indexed by type-level copies of values, and *singletons* connect each type-level value to a run-time value. Maguire ([PDF](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), chapter 15, "Dependent Types") builds this up by hand and then with the `singletons` package, ending with dependent pairs (Σ types). Bragilevsky ([PDF](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), section 13.2.3) uses singletons for a safe elevator interface ([Workflows And States]({{< ref "type-driven-design/workflows-and-states" >}}#typestate-with-phantom-types)).
- **Scala 3** has singleton types, match types and dependently typed methods. Wampler ([PDF](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), chapter 17, "Match Types" and "Dependent Typing") builds a `DTList[N <: Int]` whose length is in its type, so `head` on an empty list is a compile error. Path-dependent types are a different, older feature ([Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#path-dependent-types)).

Once you understand that progression, a lot of features in **Scala, TypeScript, Rust and Haskell start looking like different compromises along the same axis**. For example, Rust's newtypes and typestate, Scala's match types and singleton types, TypeScript's narrowing and conditional types, and Haskell's GADTs/DataKinds all become much easier to place conceptually.

Refinement types are a good example of how a type system can do far more than inference. It can progressively move properties you'd otherwise test or document into properties the compiler can prove.

Related: [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}#the-cost-of-stronger-guarantees) covers where this sits on the cost curve, and the Idris entries in [Reading Paths]({{< ref "type-driven-design/reading-paths" >}}) push this furthest.

## Library sources


- [Jhala et al. 2020](/sources/programming/language-theory/jhala-2020-programming-with-refinement-types.pdf.enc), *Programming with Refinement Types: An Introduction to LiquidHaskell* -- the LiquidHaskell tutorial: chapter 1 on bugs well-typed programs still have, chapter 2 on the logic and SMT, chapter 3 on refinement types, subtyping and testing values, chapter 6 on measures, chapter 11 on assumptions and guarantees; on *What a refinement type is*, *How the checking works*, *Limits* and *Towards dependent types*
- [Rondon et al. 2008](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc), *Liquid Types* -- inference of refinement types from qualifiers, with run-time checks where proof fails; on *How the checking works*, *Limits* and *Towards dependent types*
- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages* -- section 30.5, "Going Further: Dependent Types": the indexed list, the cost warning and Dependent ML; on *Towards dependent types*
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 15, "Dependent Types", built up from GADTs and type families to the singletons package and dependent pairs; on *Towards dependent types*
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth* -- the "Type system advances" part on data kinds, type-level literals, type families and GADTs, followed by dependent types with singletons (section 13.2); on *Haskell* and *Towards dependent types*
- [Wampler 2021](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), *Programming Scala, 3rd Edition* -- chapter 17, match types, dependently typed methods and `DTList`; on *Towards dependent types*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- chapter 1 uses the `refined` library for refinement types and validates runtime values into them; on *Scala's terminology trap* and *Limits*
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture: Powered by Scala 3* -- chapter 4 uses Iron for refinement types in Scala 3; on *Scala's terminology trap*
- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala, 5th Edition* -- section 20.8, Scala's own "refinement types" (member refinements); on *Scala's terminology trap*
- [Sebesta 2019](/sources/programming/language-theory/sebesta-2019-concepts-of-programming-languages-12e.pdf.enc), *Concepts of Programming Languages, 12th Edition* -- section 6.15 on Ada subtypes with range constraints; on *Support by language*
- [Ramalho 2022](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), *Fluent Python, 2nd Edition* -- chapter 8 on what Python's type hints can't say; on *Python*

Further reading:

- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages, 2nd Edition*
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*
- [Wadler 2015](/sources/programming/language-theory/wadler-2015-propositions-as-types.pdf.enc), *Propositions as Types*
