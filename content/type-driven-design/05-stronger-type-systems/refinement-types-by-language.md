---
draft: false
toc: true
title: "Refinement Types by Language"
description: "What Python, TypeScript, Haskell, Rust, Ada and Scala offer in place of, or as, refinement types, and Scala's terminology trap: its own \\\"refinement types\\\" mean something else."
linkTitle: "By Language"
---

[Refinement types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}) explains what they are. This note covers what each language offers: true refinement types through a library or tool, or the nearest native feature.

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

## Python


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

So Python has refinement-like building blocks, but no general refinement type system. Ramalho ([PDF](/sources/c09d057b50eb8836ae7e40220e951a83.bin), chapter 8) notes the gap directly: the type system has no way to say "an integer between 1 and 1000".

## TypeScript


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

The usual TypeScript workaround, a brand plus validation, is in [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}#smart-constructors-and-newtypes).

## Haskell


Haskell is probably the clearest example because Liquid Haskell adds exactly this model:

```haskell
{-@ type Nat = {v:Int | 0 <= v} @-}
```


Liquid Haskell describes refinement types directly as "types + logical predicates" and uses logical solvers for verification.

Plain GHC Haskell has GADTs, type families, DataKinds, etc., which can encode many invariants, but general value predicates like `x > 0` aren't ordinary Haskell types.

## Rust


Rust also doesn't have general logical refinement types built into the language.

There is also Flux, an external refinement type checker for Rust, which supports actual logical refinements and describes itself explicitly as a refinement type checker for Rust.

The usual Rust approach, a newtype with a private constructor, is in [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}#smart-constructors-and-newtypes).

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

Scala's own member refinements are in [Scala Type System]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#nominal-and-structural-subtyping).

Links on refined types in Scala:

<https://engineering.contentsquare.com/2021/scala-refined-types/>

<https://blog.rockthejvm.com/refined-types/> with restrictions:

<https://msitko.pl/blog/build-your-own-refinement-types-in-scala3.html>

refined types: <http://fthomas.github.io/talks/2016-05-04-refined>

<https://github.com/fthomas/refined>

### Notes moved from the Scala note


Moved from [Scala]({{< ref "functional-programming/04-languages/scala" >}}) on 2026-04-05. The **Explanation** and **Critique** callouts are commentary added that day; the rest is the original note text.

**Refinement types**

In type theory, a refinement type is a type endowed with a predicate which is assumed to hold for any element of the refined type. Refinement types can express preconditions when used as function arguments or postconditions when used as return types:

<https://github.com/Iltotore/iron>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Iron is a Scala 3 library for this: `val age: Int :| Positive = 42` is checked at compile time for literals, and runtime values are checked with methods such as `refineEither`. The Scala 2 equivalent is the refined library. Note that Scala's own "refinement type" means something else; see [Refinement Types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}).
{{< /callout >}}


Both libraries appear in the library's Scala books: Volpe's *Practical FP in Scala* ([PDF](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), chapter 1) uses `refined` and validates runtime values into it, and his Scala 3 book ([PDF](/sources/42ef10a33c54df6756cd49d40ee34101.bin), chapter 4) uses Iron.

## Library sources


- [Sebesta 2019](/sources/0d1e41edfd02fae6c9aa5352f2229b01.bin), *Concepts of Programming Languages, 12th Edition* -- section 6.15 on Ada subtypes with range constraints; on the Ada row of the table
- [Ramalho 2022](/sources/c09d057b50eb8836ae7e40220e951a83.bin), *Fluent Python, 2nd Edition* -- chapter 8 on what Python's type hints can't say; on *Python*
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 8.3.2, "Lightweight verification with LiquidHaskell", on `type Nat = {n : Int | n >= 0}` in `{-@ @-}` comments, with `addV` accepted and `subV` rejected, and checking by SMT solvers; chapter 11, "Type system advances", on data kinds, type-level literals, type families and GADTs; on *Haskell*
- [Volpe 2021](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), *Practical FP in Scala, 2nd Edition* -- chapter 1 uses the `refined` library for refinement types and validates runtime values into them; on *Scala's terminology trap*
- [Volpe 2023](/sources/42ef10a33c54df6756cd49d40ee34101.bin), *Functional Event-Driven Architecture: Powered by Scala 3* -- chapter 4 uses Iron for refinement types in Scala 3; on *Scala's terminology trap*
- [Odersky et al. 2021](/sources/6d5d72f2cd796c67b467228f976d4a33.bin), *Programming in Scala, 5th Edition* -- section 20.8, Scala's own "refinement types" (member refinements); on *Scala's terminology trap*

Further reading:

- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types: Type-Level Programming in Haskell* -- sections 2.2-2.4 on data kinds, promoted built-in types and type-level functions (closed type families), and section 5.2 on GADTs, the GHC features the note lists; section 2.3.2, "Natural Numbers", notes that there are no negative, fractional or floating type-level numeric literals; on *Haskell*
