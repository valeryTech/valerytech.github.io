---
draft: false
toc: true
title: "Refinement And Dependent Types"
linkTitle: "Refinement And Dependent Types"
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

## Support by language


Support in common languages:

| Language | True predicate refinement types? | Closest feature |
|---|---|---|
| Scala | Via libraries/tools | Iron, `refined`; Scala's own "refinement types" mean something different |
| Python | No | `Literal`, `TypeIs`, `TypeGuard`, `Annotated` |
| TypeScript | No general support | narrowing, literal types, template literal types, branded types |
| Haskell | Via Liquid Haskell | Liquid Haskell is a canonical refinement-type system |
| Rust | Via external tools | Flux; native Rust commonly uses newtypes + smart constructors |

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

So Python has refinement-like building blocks, but no general refinement type system.

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


Moved from [Scala]({{< ref "functional-programming/scala" >}}) on 2026-11-05. The **Explanation** and **Critique** callouts are commentary added that day; the rest is the original note text.

**Refinement types**

In type theory, a refinement type is a type endowed with a predicate which is assumed to hold for any element of the refined type. Refinement types can express preconditions when used as function arguments or postconditions when used as return types:

<https://github.com/Iltotore/iron>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Iron is a Scala 3 library for this: `val age: Int :| Positive = 42` is checked at compile time for literals, and runtime values are checked with methods such as `refineEither`. The Scala 2 equivalent is the refined library. Note that Scala's own "refinement type" means something else; see [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}).
{{< /callout >}}

## The spectrum


The conceptual spectrum is roughly:

```text
number
   ↓
literal/union type
0 | 1 | 2
   ↓
newtype / branded type
Positive
   ↓
refinement type
{x : Int | x > 0}
   ↓
dependent/refinement relationship
{x : Int | x > y && x < y + 10}
```


The last step is the key difference. A refinement system can express facts about the value itself and relationships between values.

Refinement types are a good example of how a type system can do far more than inference. It can progressively move properties you'd otherwise test or document into properties the compiler can prove.

## Limits


The power comes with practical limits:

- **The logic has to stay decidable.** SMT-based checkers work well with linear arithmetic, equality and uninterpreted functions. With non-linear arithmetic (`x * y > z`) or quantifiers, the solver can time out or give up, and you end up adding hints or restructuring code to please it.
- **Errors are failed implications.** A rejection says that some generated logical formula couldn't be proved, which takes practice to trace back to the line that's wrong.
- **Annotation burden.** Recursive functions and loops need invariants or termination measures written by hand, much like in program verification.
- **Library encodings stop at literals.** Iron and `refined` check literal values at compile time, but a value that arrives at runtime still goes through a checking function (`refineEither`, `refineV`). For real input they're [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) with nicer syntax, not proofs.

## Towards dependent types


There's an important conceptual progression from ordinary types to proofs:

```text
ordinary static type
Int

        ↓

parametric type
List<A>

        ↓

algebraic type
Result<A, E>

        ↓

refinement type
{x : Int | x > 0}

        ↓

dependent type
Vector<A, n>

        ↓

propositions as types
proof : x + 0 = x
```


The last two steps are the least familiar. A dependent type mentions a value: in `Vector<A, n>`, the length `n` is part of the type. Signatures can then state relationships, as in `append : Vector a n -> Vector a m -> Vector a (n + m)`, and `head` can accept only vectors whose length is at least one, so `head` of an empty vector is a type error rather than a runtime crash. In the last step, a type is a statement, and a value of that type is a proof of it. `x + 0 = x` has a value only if the statement is true.

The price is that type checking can now involve running code: to check `append`, the compiler has to evaluate `n + m`. That's why dependently typed languages require the functions that appear in types to be total (they terminate and handle every input), since otherwise type checking itself could loop forever.

Once you understand that progression, a lot of features in **Scala, TypeScript, Rust and Haskell start looking like different compromises along the same axis**. For example, Rust's newtypes and typestate, Scala's match types and singleton types, TypeScript's narrowing and conditional types, and Haskell's GADTs/DataKinds all become much easier to place conceptually.

Related: [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}#the-cost-of-stronger-guarantees) covers Liquid Types and gradual typing, and the Idris entries in [Reading Paths]({{< ref "type-driven-design/reading-paths" >}}) push this furthest.

## Library sources


- [Jhala et al. 2020](/sources/programming/language-theory/jhala-2020-programming-with-refinement-types.pdf.enc), *Programming with Refinement Types: An Introduction to LiquidHaskell* -- the LiquidHaskell tutorial: logic and SMT, refinement types, measures and case studies; on *What a refinement type is* and *Haskell*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- chapter 1 uses the `refined` library for refinement types and validates runtime values into them; on *Scala's terminology trap* and *Limits*
- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala, 5th Edition* -- section 20.8, Scala's own "refinement types" (member refinements); on *Scala's terminology trap*
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth* -- the "Type system advances" part on data kinds, type-level literals, type families and GADTs, followed by dependent types; on *Haskell* and *Towards dependent types*
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 15, "Dependent Types", built up from GADTs and type families; on *Towards dependent types*
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture: Powered by Scala 3* -- chapter 4 uses Iron for refinement types in Scala 3; on *Scala's terminology trap*

Further reading:

- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages, 2nd Edition*
- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages*
- [Rondon et al. 2008](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc), *Liquid Types*
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*
- [Ramalho 2022](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), *Fluent Python, 2nd Edition*
