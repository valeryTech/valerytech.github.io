---
draft: false
toc: true
title: "Domain Modeling With Types"
linkTitle: "Domain Modeling With Types"
---

Algebraic data types combine types with AND (product types) and OR (sum types), so the model states which values can exist and invalid combinations can't be constructed.

The names come from counting values. A product `(Bool, Ordering)` has 2 × 3 = 6 values; a sum `Either Bool Ordering` has 2 + 3 = 5. Counting is a quick design check: if a type admits more values than the domain has legal states, each extra value is a case you'll have to reject at runtime or quietly mishandle.

## Product and sum types

### Product types


The curse of product types: hierarchical design. Example from GPWH 16.1

GPWH is Will Kurt's *Get Programming with Haskell*; lesson 16 is "Creating types with 'and' and 'or'". A product type bundles fields that all exist together: a book has an author *and* an ISBN *and* a title *and* a price. That's enough while the shop sells one kind of thing. The trouble starts when it also sells vinyl records and toys, and you want a single list of store items.

With only products, the usual answer (familiar from Java) is a hierarchy: a `StoreItem` superclass holding the shared fields, with `Book` and `VinylRecord` extending it. Every new kind of item then has to fit a tree designed before it existed. Shared fields get pushed up until the base class is a grab bag, and an item that shares some fields but not others (a toy has a price but no creator) forces an intermediate class. That's the curse: if you can only combine with AND, the only way to share structure is to build a tree.

### Sum types


Sum types are the way out. Instead of saying what an item *is* (a subtype of something), you say a store item is *one of* a closed set of alternatives, each with its own shape. A sketch of the idea:

```haskell
data Book        = Book        { author :: Creator, isbn :: String, bookTitle :: String, bookPrice :: Double }
data VinylRecord = VinylRecord { artist :: Creator, recordTitle :: String, recordPrice :: Double }
data Toy         = Toy         { toyName :: String, toyPrice :: Double }

data StoreItem = BookItem Book | RecordItem VinylRecord | ToyItem Toy

price :: StoreItem -> Double
price (BookItem b)   = bookPrice b
price (RecordItem r) = recordPrice r
price (ToyItem t)    = toyPrice t
```


There's no base class and no shared fields, and `StoreItem` didn't have to exist when `Book` was written. Sums nest as well: a creator can be an author or an artist, and an artist can be a person or a band, each with different data.

The trade-off is that a sum is closed. Adding a `Pamphlet` means touching every function that matches on `StoreItem`. That's the expression problem (see [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#tagless-final)): sum types make new operations cheap and new cases expensive, and class hierarchies do the reverse. For a domain whose set of cases is stable and whose operations keep growing (pricing, shipping, tax, display), the sum type is the better bet.

limitation of Haskell with bookPrice and vinylPrice: The issue here has nothing to do with the limitation of sum types but rather a limitation of Haskell's way of dealing with record syntax. There are some workarounds

Haskell record fields are top-level functions, so two records in one module can't both have a field called `price`, hence `bookPrice` and `recordPrice`. The workarounds:

- prefix the field names, as above (the common convention)
- put each record in its own module
- enable `DuplicateRecordFields` with `OverloadedRecordDot` (GHC 9.2 and later), so `b.price` and `r.price` resolve by type
- define a `HasPrice` type class with an instance per record
- use lenses (`generic-lens`, `optics`)

Scala, F# and Rust don't have the problem, because their fields are scoped to the type that declares them.

sum types and product types <https://fares.codes/posts/adts-sum-types-and-product-types/>

## Primitive obsession and the newtype pattern


The Artist excerpts are from Michał Płachta's *Grokking Functional Programming* (PDF, chapter 7), where an artist starts out as primitives only, roughly `Artist(name: String, genre: String, origin: String, yearsActiveStart: Int, isActive: Boolean, yearsActiveEnd: Int)`.

We used primitive types to model the data requirements. As you probably expect, this is far from ideal. However, it's still a very common practice, and many software architectures are built this way. You are probably aware of some limitations of this approach, but let's try to list them all.

The limitations of that `Artist`:

- **Arguments can be swapped silently.** `genre` and `origin` are both `String`, so `Artist("Metallica", "U.S.", "Heavy Metal", ...)` compiles. To the compiler they are the same type, so it can't tell which string is which.
- **The legal values aren't stated.** A genre comes from a small known set, but `String` also admits `"hevy metal"` and `""`. Every function that branches on genre has to decide what to do with everything else.
- **Fields depend on each other, and the type doesn't say how.** `yearsActiveEnd` means something only when `isActive` is false. When `isActive` is true, is it 0? -1? The type allows every combination, so the meaningless ones have to be handled, or documented and hoped about.
- **The rules live in the logic.** Because the type doesn't carry these rules, every function that uses `Artist` re-implements them.

The usual name for this is *primitive obsession*, a code smell from Fowler's *Refactoring* ([PDF](/sources/software-engineering/craft/fowler-2019-refactoring-2nd-edition.pdf.enc)). An analogy is a form where every field is a free-text box: anyone can fill it in, but the person processing it has to reinterpret every answer.

What if I told you that the way we modeled the Artist is the reason why implementing searchArtists was so difficult?

It was difficult because of the last point in the list: before `searchArtists` could search, its body had to decode what the fields meant together (is this artist active, and which year field applies?). Move those rules into the types and the search becomes a straightforward filter.

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


On its own, a newtype fixes only the first problem in the list (swapped arguments). A `Genre` newtype over `String` still admits `"hevy metal"`; for that you need a smart constructor or, better, a sum type of the genres. See [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#names-are-not-type-safety).

### Scala: value classes and opaque types


Moved from [Scala]({{< ref "functional-programming/scala" >}}) on 2026-11-05. The **Explanation** and **Critique** callouts are commentary added that day; the rest is the original note text.

**Value classes**

`@newtype` in scala 2 and `OpaqueType` in Scala 3

Bring typesafety without unecessary ...

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The sentence presumably ends "...runtime overhead": a distinct type such as `UserId` that the compiler won't confuse with another `Long`, but that is a plain `Long` at run time.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`@newtype` is not part of Scala 2; it comes from the third-party scala-newtype library. Built-in Scala 2 value classes are written `class UserId(val value: Long) extends AnyVal`, and they still allocate in generic code, arrays and pattern matches. In Scala 3 the feature is the `opaque type` keyword pair, `opaque type UserId = Long`, which never allocates. See [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}).
{{< /callout >}}

## A flag plus an optional value


Any time you see more than one value representing a single logical business entity, make sure to stop and think how to model it better. As an example, we now have two parameters that together make up a single entity. This is a *very common pattern* in programming in general: a Boolean flag plus a parameter that is only applicable if the Boolean flag is true. I am sure you recognize this pattern. We will show you two ways of approaching this pattern using functional programming techniques: the Option type and algebraic data types.

Changes in the model force changes in the logic

When `isActive` and `yearsActiveEnd` become one value, every function that read the two fields stops compiling. That's the intended effect, not a nuisance: the compiler hands you the list of places where the old encoding's meaning was being reconstructed by hand, and each one now gets the meaning from a `match`. Compare renaming a column that untyped code reads, where you find the readers by grepping or in production.

The cost is real too. A model change ripples through every consumer, so a model shared across teams or services needs the care of a public API: versioning, or a translation layer at the boundary (DDD's anti-corruption layer).

Modeling the flag and the value in two steps. The first step folds the flag into the value: `isActive` disappears because `end = None` now means "still active".

```scala
case class PeriodInYears(start: Int, end: Option[Int])
```


That's already better, since an active artist no longer has a meaningless end year. But `None` carries an implicit meaning that every reader has to know. The second step names both states:

```scala
enum YearsActive {
 case StillActive(since: Int)
 case ActiveBetween(start: Int, end: Int)
}
```


Each case holds only the fields that make sense for it, and code that uses it reads like the domain: `case StillActive(since) => since <= year`. A rule of thumb: `Option` is enough when absence is the whole story; when absence *means* something specific in the domain, give that meaning a name.

What the ADT still can't say is that `start <= end` in `ActiveBetween`. That needs a smart constructor (see [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#smart-constructors-and-newtypes)) or a refinement type ([Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}})).

## The same ideas across languages


*Domain Modeling Made Functional* ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc)) uses F#, and the concepts translate to other languages:

```text
F#                     Rust / Scala / TypeScript
--------------------------------------------------------
DU / union             enum / sealed trait / union
single-case union      newtype / opaque type / brand
Result                 Result / Either / Result-like
Option                 Option / Option / optional union
pattern matching       match / match / switch narrowing
```

## Results and exhaustive matching


The `Result` type and exhaustiveness checking are in the benefits list in [Type Systems]({{< ref "type-driven-design/type-systems" >}}#benefits).

## Type-first design


The three Haskell tools for designing in types:

data

`data` declares a new algebraic type, with products and sums in one declaration: `data Shape = Circle Double | Rect Double Double`. This is where the domain's states get their names.

type synonyms

`type Name = String` gives an existing type a second name, and nothing more. The compiler treats `Name` and `String` as the same type, so a synonym documents intent but protects nothing: you can pass any `String` where a `Name` is expected. It's easy to mistake for safety. Use `newtype` when you want the compiler to keep the values apart. The same holds for `type` aliases in Scala, TypeScript and Rust.

type classes

A type class describes what a type can *do* (`Eq`, `Ord`, `Show`, `Num`), independently of what it *is*. Instances can be added after the fact, even for types you don't own, whereas a Java interface has to be declared on the class itself. An analogy: a class hierarchy is a family tree, where what you are depends on your ancestors; a type class is a driving licence, which anyone who passes the test can hold, whoever their parents are. It's the alternative to the hierarchical design in [Product types](#product-types).

Haskell's combination of purity, higher order functions, parameterized algebraic data types, and typeclasses allows us to implement polymorphism on a much higher level than possible in other languages. We don't have to think about types belonging to a big hierarchy of types. Instead, we think about what the types can act like and then connect them with the appropriate typeclasses. An Int can act like a lot of things. It can act like an equatable thing, like an ordered thing, like an enumerable thing, etc.

But what does it mean to think about programming in types? When you look at the type signature of a function - say, `a -> b` - you can view this signature as a description of **a transformation**.

When solving problems in Haskell, you can approach them first as _a sequence of abstract transformations_. For example, say you have a large text document and you need to find all the numbers in that document and then add them together.

Example with numbers in a document.

Written as types first, the plan is a chain of transformations:

```text
String        the document
  → [String]  split into words
  → [String]  keep the words that are numbers
  → [Int]     convert each one
  → Int       add them up
```


Each arrow is a function that is either in the standard library or a line long:

```haskell
import Data.Char (isDigit)

sumNumbers :: String -> Int
sumNumbers = sum . map read . filter (all isDigit) . words
```


The type chain also shows where the plan is weak. `read :: String -> Int` is partial: it crashes on anything that isn't a number, so the filter in front of it has to be exactly right. A more honest step is `String -> Maybe Int`, which merges the filter and the conversion and is [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) in miniature:

```haskell
import Data.Maybe (mapMaybe)
import Text.Read (readMaybe)

sumNumbers :: String -> Int
sumNumbers = sum . mapMaybe readMaybe . words
```


And you're finished! By thinking about the types of transformations that you're going to make, you've been able to design your overall program much the same way you design a single function.

The more Haskell you learn, the more you'll find yourself programming in types first and then using functions to hash out the details.

## Library sources


- Płachta 2022, *Grokking Functional Programming* -- chapter 7, "Requirements as types": the source of the Artist excerpts, from primitives to opaque types, `Option` and the `YearsActive` ADT; on *Primitive obsession and the newtype pattern* and *A flag plus an optional value*
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- chapters 4 and 5, "Understanding Types" and "Domain Modeling with Types", which the F# table follows; on *The same ideas across languages*
- [Schwarz 2020](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc), *Scala 3 by Example: ADTs for DDD, Part 1* -- domain modeling with product and sum types, following *Domain Modeling Made Functional* with the F# originals beside the Scala 3 code; on *Product and sum types* and *The same ideas across languages*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles* -- chapter 11, "Algebraic datatypes": cardinality, `newtype`, sum types and product types; on the counting paragraph under the title, *Product and sum types* and *Type-first design*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers, Scala Edition* -- chapter 6, "Simple Algebraic Data Types", whose section 6.4 treats sums as addition and products as multiplication; on the counting paragraph under the title
- [Fowler 2019](/sources/software-engineering/craft/fowler-2019-refactoring-2nd-edition.pdf.enc), *Refactoring: Improving the Design of Existing Code, 2nd Edition* -- the Primitive Obsession smell and the Replace Primitive with Object refactoring; on *Primitive obsession and the newtype pattern*
- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala, 5th Edition* -- chapter 19, enums as enumerated and algebraic data types in Scala 3; on *A flag plus an optional value*
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 1, "The Algebra Behind Types": cardinality, with sums as addition, products as multiplication and functions as exponents; on the counting paragraph under the title
