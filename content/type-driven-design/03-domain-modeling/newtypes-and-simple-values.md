---
draft: false
toc: true
title: "Newtypes and Simple Values"
description: "Primitive obsession and the newtype pattern, Scala value classes and opaque types, and simple values whose constructors enforce a rule."
linkTitle: "Newtypes"
---

Wrapping primitives in types of their own, and giving those types constructors that enforce a rule. Part of [Domain modeling with types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}); how much such a type guarantees is in [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}).

## Primitive obsession and the newtype pattern


The Artist excerpts are from Michał Płachta's *Grokking Functional Programming* (PDF, chapter 7), where an artist starts out as primitives only, roughly `Artist(name: String, genre: String, origin: String, yearsActiveStart: Int, isActive: Boolean, yearsActiveEnd: Int)`.

We used primitive types to model the data requirements. As you probably expect, this is far from ideal. However, it's still a very common practice, and many software architectures are built this way. You are probably aware of some limitations of this approach, but let's try to list them all.

The book lists five problems ("Problems with the primitive type approach to modeling"). Three are in the `Artist` type:

- **Arguments can be swapped silently.** `genre` and `origin` are both `String`, so `Artist("Metallica", "U.S.", "Heavy Metal", ...)` compiles. To the compiler they are the same type, so it can't tell which string is which.
- **Fields depend on each other, and the type doesn't say how.** `yearsActiveEnd` means something only when `isActive` is false. When `isActive` is true, is it 0? -1? The type allows every combination, so the meaningless ones have to be handled, or documented and hoped about.
- **The legal values aren't stated.** A genre comes from a small known set, but `String` also admits `"hevy metal"`, `""` or an album title. Every function that branches on genre has to decide what to do with everything else.

Two more are in the signature of the search function that uses it, `searchArtists(artists, genres: List[String], locations: List[String], searchByActiveYears: Boolean, activeAfter: Int, activeBefore: Int)`:

- **Primitives carry hidden meanings.** An empty `genres` list means "don't filter by genre", which nothing in the type says.
- **Some parameters only make sense together.** `activeAfter` and `activeBefore` form one period, and both matter only when `searchByActiveYears` is true.

The usual name for this is *primitive obsession*, a code smell from Fowler's *Refactoring* ([PDF](/sources/software-engineering/craft/fowler-2019-refactoring-2nd-edition.pdf.enc)). An analogy is a form where every field is a free-text box: anyone can fill it in, but the person processing it has to reinterpret every answer.

Other sources describe the same smell from different angles:

- **Bloch, Item 62, "Avoid strings where other types are more appropriate".** Strings are poor substitutes for other value types, for enums, for aggregates (several fields joined into one string with a separator) and for capabilities. Item 34 is the same point about the "int enum pattern", `static final int APPLE_FUJI = 0`, where nothing stops you passing an orange where an apple is expected.
- **Khononov's connascence** ([PDF](/sources/software-engineering/craft/khononov-2025-balancing-coupling-in-software-design.pdf.enc), chapter 6, "Connascence"). Two modules are connascent when a change in one forces a change in the other. *Connascence of meaning* is agreeing on what a magic value means (status `7`); an enumeration turns it into the weaker, compiler-checked *connascence of type*. *Connascence of position* is agreeing on argument order, the genre-and-origin swap above.

What if I told you that the way we modeled the Artist is the reason why implementing searchArtists was so difficult?

It was difficult because of the second problem and the last two. Before `searchArtists` could search, its body had to decode what the fields meant together (is this artist active, and which year field applies?) and what its own parameters meant (does an empty list mean "any"?). Move those rules into the types and the search becomes a straightforward filter.

The newtype pattern is ubiquitous

A newtype wraps an existing type under a new name, usually at no runtime cost, so `Location` and `Genre` stop being interchangeable even though both are strings underneath. Every typed language has some version of it:

```text
Haskell     newtype Location = Location String
Scala 3     opaque type Location = String
F#          type Location = Location of string    (single-case union)
Rust        struct Location(String);
Kotlin      @JvmInline value class Location(val value: String)
TypeScript  type Location = string & { readonly __brand: "Location" }
```


On its own, a newtype fixes only the first problem in the list (swapped arguments). A `Genre` newtype over `String` still admits `"hevy metal"`; for that you need a smart constructor or, better, a sum type of the genres. See [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}#names-are-not-type-safety).

Two cautions:

- **Same shape, different meaning.** Wlaschin (chapter 5, "Modeling Complex Data") keeps `ShippingAddress` and `BillingAddress` as separate types even when they have identical fields, because they play different roles and may diverge.
- **Wrapping can be overdone.** King (HTML) is sceptical of wrappers that are wrapped and unwrapped at every use and protect no invariant. Percival and Gregory ([PDF](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), chapter 9) report a similar Python scepticism: applied mindlessly, the cure for primitive obsession adds complexity, and plain primitives in a service's API keep its clients decoupled from its internal types.

If the wrapper's cost is a concern, Wlaschin (chapter 5, "Avoiding Performance Issues with Simple Types") lists three options: a type alias (fast, but no safety), a struct instead of a class, or wrapping a whole collection at once (`UnitQuantities of int[]`) rather than each element.

### Scala: value classes and opaque types


Moved from [Scala]({{< ref "functional-programming/04-languages/scala" >}}) on 2026-04-05. The **Explanation** and **Critique** callouts are commentary added that day; the rest is the original note text.

**Value classes**

`@newtype` in scala 2 and `OpaqueType` in Scala 3

Bring typesafety without unecessary ...

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The sentence presumably ends "...runtime overhead": a distinct type such as `UserId` that the compiler won't confuse with another `Long`, but that is a plain `Long` at run time.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`@newtype` is not part of Scala 2; it comes from the third-party scala-newtype library. Built-in Scala 2 value classes are written `class UserId(val value: Long) extends AnyVal`, and they still allocate in generic code, arrays and pattern matches. In Scala 3 the feature is the `opaque type` keyword pair, `opaque type UserId = Long`, which never allocates. See [Domain Modeling With Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}).
{{< /callout >}}


Opaque types have limits of their own. Wampler ([PDF](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), chapter 9, "Opaque Types and Value Classes") notes that you can't override `equals` or `toString` for an opaque type, or pattern match on it. Equality also falls through to the underlying type, so a `CustomerId` and a `ProductId` that are both `Int` underneath can be compared with `==` without complaint. Alexander's *Scala Cookbook* ([PDF](/sources/programming/scala/alexander-2021-scala-cookbook-2e.pdf.enc), recipe 23.7, "Creating Meaningful Type Names with Opaque Types") closes that hole by declaring `given CanEqual[CustomerId, CustomerId] = CanEqual.derived` and turning on strict equality, so comparing the two becomes a compile error. Volpe's Scala 3 book ([PDF](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), section 4.1) builds a small newtype library on opaque types for the same reasons.

## Simple values with rules


Wlaschin's chapter 6 ("The Integrity of Simple Values") gives the full recipe for a constrained value such as a `UnitQuantity` between 1 and 1000: a single-case type with a private constructor, a `create` function that returns a `Result`, and a `value` function to read it out. Because the data is immutable, the check happens once and is never repeated. How much that guarantee is worth, and how it can leak, is in [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}).

Units are a special case ("Units of Measure"). F# can attach a unit to a number at no run-time cost, so `5.0<kg>` can't be added to `2.0<m>`. Wlaschin also uses units for currencies and for seconds against milliseconds. Other languages get a similar effect from a phantom type parameter, as in Bragilevsky's `Temp unit` ([PDF](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), section 11.1.2) or Odersky's currency case study ([Scala Type System]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#abstract-types-and-type-members)).

## Library sources


- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- chapter 5, "Modeling Simple Values" and "Avoiding Performance Issues with Simple Types"; chapter 6, "The Integrity of Simple Values", and units of measure; on *Primitive obsession and the newtype pattern* and *Simple values with rules*
- Płachta 2022, *Grokking Functional Programming* -- chapter 7, "Requirements as types": the source of the Artist excerpts, from primitives to opaque types; on *Primitive obsession and the newtype pattern*
- [Bloch 2018](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), *Effective Java, 3rd Edition* -- Item 62, "Avoid strings where other types are more appropriate", and Item 34 on the int enum pattern; on *Primitive obsession and the newtype pattern*
- [Khononov 2025](/sources/software-engineering/craft/khononov-2025-balancing-coupling-in-software-design.pdf.enc), *Balancing Coupling in Software Design* -- chapter 6, "Connascence": name, type, meaning and position; on *Primitive obsession and the newtype pattern*
- [Fowler 2019](/sources/software-engineering/craft/fowler-2019-refactoring-2nd-edition.pdf.enc), *Refactoring: Improving the Design of Existing Code, 2nd Edition* -- the Primitive Obsession smell and the Replace Primitive with Object refactoring; on *Primitive obsession and the newtype pattern*
- [Wampler 2021](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), *Programming Scala, 3rd Edition* -- chapter 9, "Opaque Types and Value Classes"; on *Scala: value classes and opaque types*
- [Alexander 2021](/sources/programming/scala/alexander-2021-scala-cookbook-2e.pdf.enc), *Scala Cookbook, 2nd Edition* -- recipe 23.7, opaque types with `CanEqual`; on *Scala: value classes and opaque types*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles* -- section 11.9, "newtype": `Goats` and `Cows` newtypes over `Int` that can't be mixed up, no runtime cost, and the difference from type synonyms (only a newtype can have its own instances); on *Primitive obsession and the newtype pattern*
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell* -- chapter 4, section "Creating Type Aliases": `type Meters = Double` and `type Seconds = Double` still let `velocity` take its arguments swapped, so an alias gives "a false sense of safety" and suits only names with the same meaning (`String`, `AppValue = Either AppError`); chapter 6, section "Wrapping Types with Newtype": a newtype is a distinct, zero-cost type that can't be substituted for what it wraps; on *Primitive obsession and the newtype pattern*
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types: Type-Level Programming in Haskell* -- section 8.1, "Coercions": Haskell newtypes are guaranteed zero-cost, and `coerce` turns `[Int]` into `[Sum Int]` without the O(n) `fmap Sum`; on the cost of wrappers in *Primitive obsession and the newtype pattern*
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth* -- section 11.1.2, "Delivering information with types": `newtype Temp unit` with a phantom unit (F against C), on *Simple values with rules*; section 12.1.2, "The problem of type safety and generalized newtype deriving": `coerce` and `Coercible`, which turn `[Int]` into `[Age]` with no `map`, and roles (nominal for `Map` keys) as the limit, on the cost of wrapping in *Primitive obsession and the newtype pattern*
- King 2020, *Names are not type safety* -- "Other newtype use, abuse, and misuse": legitimate uses (choosing an instance such as `Sum`, rearranging type parameters, hiding a secret key's `Show`, `Distance` versus `Duration`) against transparent wrappers such as `ArgumentName` that are unwrapped at every use; on *Primitive obsession and the newtype pattern*

Further reading:

- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture: Powered by Scala 3*
- [Percival et al. 2020](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), *Architecture Patterns with Python*
