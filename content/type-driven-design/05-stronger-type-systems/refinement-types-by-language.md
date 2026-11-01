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

Ada is the old exception: a subtype with a range constraint is a refinement type whose predicate is checked at run time rather than proved, and SPARK, Ada's verifiable subset, can prove many of those checks statically. Scott et al. (PDF, sections 7.1.5, Example 7.14, and 7.2.1, Example 7.23) note that Ada separates the two jobs a newtype often conflates: `subtype` constrains the range while staying compatible with the base type (checked dynamically on narrowing), whereas `new ... range` creates an incompatible derived type as well.

## Python


Python has several building blocks that resemble refinements on specific shapes, without a general refinement type checker:

```python
Literal[3]

def is_str(x: object) -> TypeIs[str]:
    return isinstance(x, str)

Annotated[int, ValueRange(1, 100)]
```


`Literal[3]` is the one-element subset of `int` containing `3`, and `TypeIs[str]` (or `TypeGuard`) lets a static checker narrow `x` after a runtime test. You can attach metadata such as `Annotated[int, ValueRange(1, 100)]` for runtime validators like Pydantic, but Python's typing specification allows static type checkers to ignore `Annotated` metadata and never proves `1 <= x <= 100`. Ramalho ([PDF](/sources/c09d057b50eb8836ae7e40220e951a83.bin), chapter 8) notes the gap directly: the type system has no way to express "an integer between 1 and 1000".

## TypeScript


TypeScript combines control-flow narrowing with literal and template literal types to carve out subsets of larger types:

```ts
function f(x: string | number) {
    if (typeof x === "string") {
        // x: string
    }
}

type Port = 80 | 443
type EventName = `${string}Changed`
```


The compiler tracks runtime checks (`typeof`, `instanceof`, discriminant checks, user-defined type predicates) to narrow a type inside a branch, and literal or template literal types restrict finite sets or string patterns. What TypeScript cannot do is attach an arbitrary logical predicate such as `{ x: number | x > 0 }` and prove arithmetic facts about `x`. The usual TypeScript workaround, a branded type paired with a validating smart constructor, is in [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}#smart-constructors-and-newtypes).

## Haskell


Haskell has the canonical refinement-type system in **Liquid Haskell**, which writes types plus logical predicates inside `{-@ ... @-}` specification comments and discharges them with an SMT solver (Bragilevsky, [PDF](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), section 8.3.2):

```haskell
{-@ type Nat = {v:Int | 0 <= v} @-}
```


Plain GHC Haskell has GADTs, type families and `DataKinds`, which can encode many structural invariants at the type level, but general value predicates like `x > 0` aren't ordinary Haskell types. In everyday Haskell, Parsons ([PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), chapter 10, "Type Safety Back and Forth", and chapter 11, "Keep Your Types Small...") calls the practical substitute "pushing responsibility back": shrinking domains and ranges with smart-constructor types like `NonZero a` (paired with `PatternSynonyms` so callers can pattern-match without bypassing validation), `NonEmpty a`, and `Natural` in place of `Int` for `take` and `length`, before reaching for the heavier type-level machinery of chapters 20-22.

## Rust


Rust has no general logical refinement types built into the language. Its external refinement-type checker is **Flux**, which adds Liquid-style logical refinements checked by an SMT solver on top of the Rust compiler. In native Rust, the standard substitute is a newtype with a private field and a smart constructor ([Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}#smart-constructors-and-newtypes)).

## Scala's terminology trap


In Scala, the phrase "refinement type" has two different meanings:

1. **Structural member refinements (Scala's official language term).** In the Scala specification and *Programming in Scala* (Odersky et al., [PDF](/sources/6d5d72f2cd796c67b467228f976d4a33.bin), section 20.8), a refinement type narrows a base type by specifying or adding members in braces, such as `SomeType { type Element = String }`. That feature is covered in [Scala Type System]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#nominal-and-structural-subtyping).
2. **Predicate refinement types (the type-theory term, via libraries).** A base type endowed with a predicate that holds for every element--expressing preconditions on function arguments and postconditions on return types--is provided in Scala by libraries rather than the core compiler: **Iron** in Scala 3 (Volpe, [PDF](/sources/42ef10a33c54df6756cd49d40ee34101.bin), section 4.1.3) and **`refined`** in Scala 2 (Volpe, [PDF](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), chapter 1).

With Iron in Scala 3:

```scala
val x: Int :| Greater[0] = 5
```


Literals are checked at compile time (so `val x: Int :| Greater[0] = -1` is a compile error), while runtime values are validated at the boundary with methods such as `refineEither` or `refineNel`. Volpe ([PDF](/sources/42ef10a33c54df6756cd49d40ee34101.bin), section 4.1.3.1, "The copy method") notes an extra advantage over smart constructors on plain fields: refining the field's type (`String :| Not[Blank]`) also keeps a case class's generated `copy` method from bypassing validation.

## Library sources


- [Sebesta 2019](/sources/0d1e41edfd02fae6c9aa5352f2229b01.bin), *Concepts of Programming Languages, 12th Edition* -- section 6.15 on Ada subtypes with range constraints; on the Ada row of the table
- Scott et al. 2025, *Programming Language Pragmatics, 5th Edition* -- section 7.1.5, "Refinement Types" (Examples 7.13-7.16 on Pascal and Ada subranges and Liquid Haskell), and section 7.2.1, "Type Equivalence" (Example 7.23 on Ada `subtype` versus derived `new` types); on the Ada row of the table and *Haskell*
- [Ramalho 2022](/sources/c09d057b50eb8836ae7e40220e951a83.bin), *Fluent Python, 2nd Edition* -- chapter 8 on what Python's type hints can't say; on *Python*
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 8.3.2, "Lightweight verification with LiquidHaskell", on `type Nat = {n : Int | n >= 0}` in `{-@ @-}` comments, with `addV` accepted and `subV` rejected, and checking by SMT solvers; chapter 11, "Type system advances", on data kinds, type-level literals, type families and GADTs; on *Haskell*
- [Parsons 2023](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), *Production Haskell* -- chapter 10, "Type Safety Back and Forth", on `NonZero` (with `PatternSynonyms`) and `NonEmpty`, chapter 11, "Keep Your Types Small...", on restricting domains and ranges (`Natural` versus `Int`), and chapters 20-22 on GHC's type-level programming features and their trade-offs; on *Haskell*
- [Volpe 2021](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), *Practical FP in Scala, 2nd Edition* -- chapter 1 uses the `refined` library for refinement types and validates runtime values into them; on *Scala's terminology trap*
- [Volpe 2023](/sources/42ef10a33c54df6756cd49d40ee34101.bin), *Functional Event-Driven Architecture: Powered by Scala 3* -- section 4.1.3, "Refinement types", on Iron (compile-time constraints, intersection refinements with `&`, runtime validation via `refineNel`, and closing the case-class `copy` loophole in 4.1.3.1); on *Scala's terminology trap*
- [Odersky et al. 2021](/sources/6d5d72f2cd796c67b467228f976d4a33.bin), *Programming in Scala, 5th Edition* -- section 20.8, Scala's own "refinement types" (member refinements); on *Scala's terminology trap*

Further reading:

- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types: Type-Level Programming in Haskell* -- sections 2.2-2.4 on data kinds, promoted built-in types and type-level functions (closed type families), and section 5.2 on GADTs, the GHC features the note lists; section 2.3.2, "Natural Numbers", notes that there are no negative, fractional or floating type-level numeric literals; on *Haskell*
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell* -- chapter 15, "Programming with Types", on `DataKinds`, type-level naturals and strings, open and closed type and data families, and GADTs; on *Haskell*
- Iron (type constraints for Scala 3): <https://github.com/Iltotore/iron>
- `refined` (type-level predicate refinements for Scala): <https://github.com/fthomas/refined> and Frank Thomas's talk <http://fthomas.github.io/talks/2016-05-04-refined>
- Scala tutorials on refined types: [Rock the JVM](https://blog.rockthejvm.com/refined-types/), [Marcin Sitko on building refinement types in Scala 3](https://msitko.pl/blog/build-your-own-refinement-types-in-scala3.html), and [Contentsquare engineering blog](https://engineering.contentsquare.com/2021/scala-refined-types/)
