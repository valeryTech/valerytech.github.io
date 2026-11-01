---
draft: false
toc: true
title: "How Strong the Evidence Is"
description: "How much a parsed type guarantees: smart constructors and newtypes, constructive versus encapsulated types, names that are not type safety, constructors that bypass the check, and evidence without runtime cost."
linkTitle: "Strength of Evidence"
---

A parsed type is evidence that a check happened. How much that evidence is worth depends on how the type is built. This note continues [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}); part of [Parsing and evidence]({{< ref "type-driven-design/02-parsing-and-evidence" >}}).

## Smart constructors and newtypes


Most languages can't prove a predicate such as `x > 0` (see [Refinement Types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}})). The usual substitute is a constructor that validates once and a type that records that it happened.

In TypeScript, a brand plus validation emulates a refinement type:

```ts
declare const positive: unique symbol

type Positive = number & {
    readonly [positive]: true
}

function makePositive(x: number): Positive | undefined {
    return x > 0 ? x as Positive : undefined
}
```


After construction, `Positive` carries evidence that validation happened, but TypeScript itself hasn't mathematically proved the predicate.

The evidence is also only a convention. `-5 as Positive` compiles anywhere the type is in scope, so the brand guarantees as much as the team's discipline about casts: keep the one `as Positive` inside `makePositive`'s module and forbid casts elsewhere with a lint rule. Rust's private field, below, is enforced by the compiler instead.

In Rust, the normal approach is a newtype with a smart constructor:

```rust
struct Positive(u32);

impl Positive {
    fn new(x: u32) -> Option<Self> {
        if x > 0 {
            Some(Self(x))
        } else {
            None
        }
    }
}
```


With a private field, outside code can't construct an invalid `Positive`. This is an invariant enforced through encapsulation and the type system.

Which wrappers to introduce in the first place, and how each language spells them, is in [Newtypes And Simple Values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}#primitive-obsession-and-the-newtype-pattern).

## Names are not type safety


Alexis King's **"Names are not type safety"** (HTML) addresses an important subtlety with `newtype`/opaque wrappers: merely giving a `String` another type name prevents mixing values, but doesn't establish an invariant such as "this is a valid email." This is the distinction between type identity and value validity. ([Lexi Lambda](https://lexi-lambda.github.io/blog/2020/11/01/names-are-not-type-safety/ "Names are not type safety"))

The article contrasts two ways of getting safety from a type, which King calls intrinsic and extrinsic:

- **Constructive (intrinsic).** The type's shape makes invalid values impossible to build. A non-empty list defined as a head plus a tail (`data NonEmpty a = a :| [a]`) has no empty value, so nothing needs checking anywhere.
- **By encapsulation (extrinsic).** A newtype with a hidden constructor and a smart constructor that checks. The guarantee is only as good as that one module: the compiler checks that every value went through the module, not that the module's check is right.

Two consequences of the difference are easy to miss:

- **Consumers lose exhaustiveness checking.** King's example is a number from one to five. As a sum type with five constructors, a function over it is checked for missing cases. As a newtype over `Int`, every consumer needs an `error "impossible"` branch, and if a sixth value is added later, the constructive version stops compiling while the newtype version compiles and fails at run time.
- **Encapsulated values are tokens.** The module issues them and is the only place they can be redeemed. That restricts where the invariant can be broken to one module, which King says you can then test thoroughly (property-based tests or fuzzing), but it's still weaker than a proof.

Prefer constructive types when they're cheap, and fall back on encapsulation when the invariant can't be expressed by shape (a valid email address). An analogy: a constructive type is a plug whose shape won't fit the wrong socket, while encapsulation is an inspector's sign-off, as trustworthy as the inspector.

## Hidden constructors


An encapsulated type is only as safe as its *only* constructor, and most languages generate extra constructors without asking:

- **Derived instances.** King shows that deriving `Generic` or `Read` for a `NonEmpty` newtype lets anyone build `NonEmpty []` (`read "NonEmpty []"` works).
- **`copy` on case classes.** In Scala, `Username.from(s)` can validate, but `username.copy(value = "")` bypasses it. Volpe ([PDF](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), chapter 1) closes the hole with a `sealed abstract case class`, which has no `copy` and no public `apply`.
- **Deserialization.** Bloch ([PDF](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), Item 88) points out that Java's `readObject` is effectively another public constructor: a crafted byte stream can create an object that no normal constructor would allow, so `readObject` must check everything the constructor checks. JSON decoders that write fields directly have the same problem.
- **Mutable inputs.** A constructor that checks a mutable argument and keeps a reference to it can be invalidated afterwards; see [What Belongs In Types]({{< ref "type-driven-design/01-foundations/what-belongs-in-types" >}}#where-types-stop-matching-reality).

## Evidence without runtime cost


Matt Noonan's **"Ghosts of Departed Proofs"** ([PDF](/sources/programming/functional-programming/noonan-2018-ghosts-of-departed-proofs.pdf.enc)) examines the relationship between compile-time guarantees and runtime checks. Its premise is that a precondition can be verified and evidence of that verification encoded in types, so later operations don't have to check it again. It describes encoding sophisticated preconditions in types while retaining no runtime overhead for the proof representation. ([Input | Output](https://www.iog.io/papers/ghosts-of-departed-proofs-functional-pearls "Ghosts of Departed Proofs (Functional Pearls)"))

The motivating example is merging sorted lists, which is only correct if both lists were sorted with the *same* comparator. Roughly:

```haskell
newtype SortedBy comp a = SortedBy a

sortBy  :: ((a -> a -> Ordering) ~~ comp) -> [a] -> SortedBy comp [a]
mergeBy :: ((a -> a -> Ordering) ~~ comp)
        -> SortedBy comp [a] -> SortedBy comp [a] -> SortedBy comp [a]
```


`f ~~ comp` attaches a type-level name, `comp`, to the comparator, and `SortedBy comp [a]` is a list tagged with the fact that it was sorted by the comparator of that name. `mergeBy` therefore accepts only lists sorted by the comparator it's given. Names and facts are phantom types, erased at compile time, which is where "no runtime overhead" comes from. The ghosts in the title are these proofs: present while type checking, gone at runtime.

The scheme depends on who gets to choose a name (section 2.4, "On the Danger of Naming a Ghost"). Names come from a function with a rank-2 type, so the library invents a fresh name for every comparator and the caller can't pick it. If callers could name values themselves (`any_name :: a -> (a ~~ name)`), they could give two different comparators the same name, and `mergeBy` would accept lists sorted in opposite orders. It's the hidden-constructor problem again, at the type level.

## Library sources


- King 2020, *Names are not type safety* -- intrinsic (constructive) versus extrinsic (encapsulation-based) safety, newtypes as tokens, and derived instances that break the abstraction; on *Names are not type safety* and *Hidden constructors*
- [Noonan 2018](/sources/programming/functional-programming/noonan-2018-ghosts-of-departed-proofs.pdf.enc), *Ghosts of Departed Proofs (Functional Pearl)* ([doi:10.1145/3242744.3242755](https://doi.org/10.1145/3242744.3242755)) -- preconditions as phantom types on newtype wrappers, with the `sortBy` and `mergeBy` example, and section 2.4 on naming; on *Evidence without runtime cost*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- chapter 1 on value classes, smart constructors, newtypes ("newtypes do not solve validation"), `sealed abstract case class` against `copy`, refinement types and runtime validation; on *Smart constructors and newtypes*, *Names are not type safety* and *Hidden constructors*
- [Bloch 2018](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), *Effective Java, 3rd Edition* -- Item 88, "Write readObject methods defensively"; on *Hidden constructors*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles* -- chapter 12, "Signaling adversity": smart constructors that return `Maybe` or `Either`; on *Smart constructors and newtypes*
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell* -- chapter 5, section "Choosing What to Export": subsection "Smart Constructors" exports `SortedList (getSorted)` and `makeSortedList` but not the constructor; subsection "Phantom Types and Export Lists" tags `User` with unexported empty types `Authenticated` and `Unauthenticated`, so only `authenticate` can produce a `User Authenticated`; on *Smart constructors and newtypes* and *Evidence without runtime cost*
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types: Type-Level Programming in Haskell* -- section 7.2, "Scoping Information with Existentials": the ST trick, where a rank-2 `runST` gives each block a fresh type the caller can't name, the same device as the naming function in Noonan's section 2.4, on *Evidence without runtime cost*; sections 8.1, "Coercions", and 8.2, "Roles": `coerce` could turn a `Map k v` into a `Map (Reverse k) v` and break its ordering, which a nominal role prevents (`type role BST nominal` for your own types), on *Hidden constructors*
