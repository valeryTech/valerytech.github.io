---
draft: false
toc: true
title: "Domain Modeling with Types"
description: "Product and sum types, newtypes, simple values with rules, values and entities, and errors as values: domain models whose types state which values can exist, so illegal states cannot be built."
linkTitle: "Domain Modeling"
---

Algebraic data types combine types with AND (product types) and OR (sum types), so the model states which values can exist and invalid combinations can't be constructed.

The names come from counting values. A product `(Bool, Ordering)` has 2 × 3 = 6 values; a sum `Either Bool Ordering` has 2 + 3 = 5. Counting is a quick design check: if a type admits more values than the domain has legal states, each extra value is a case you'll have to reject at runtime or quietly mishandle.

The note follows the order of Wlaschin's *Domain Modeling Made Functional* ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), chapters 4 to 6): composing types, simple values, making illegal states unrepresentable, identity, and errors. Workflows and the states an entity moves through are in [Workflows And States]({{< ref "type-driven-design/workflows-and-states" >}}); what happens to these types at the edges of the system is in [Types At The Boundary]({{< ref "type-driven-design/types-at-the-boundary" >}}).

## Product and sum types

### Product types


The curse of product types: hierarchical design. Example from GPWH 16.1

GPWH is Will Kurt's *Get Programming with Haskell*; lesson 16 is "Creating types with 'and' and 'or'". A product type bundles fields that all exist together: a book has an author *and* an ISBN *and* a title *and* a price. That's enough while the shop sells one kind of thing. The trouble starts when it also sells vinyl records and toys, and you want a single list of store items.

With only products, the usual answer (familiar from Java) is a hierarchy: a `StoreItem` superclass holding the shared fields, with `Book` and `VinylRecord` extending it. Every new kind of item then has to fit a tree designed before it existed. Shared fields get pushed up until the base class is a grab bag, and an item that shares some fields but not others (a toy has a price but no creator) forces an intermediate class. That's the curse: if you can only combine with AND, the only way to share structure is to build a tree.

Wlaschin (chapter 2, "Fighting the Impulse to Do Class-Driven Design") gives the domain-driven version of the warning. Faced with orders and quotes that share fields, a developer invents an `OrderBase` class, and Wlaschin's test is to ask the domain expert what an `OrderBase` is. If the business has no word for it, it's an artifact of the modeling tool, not part of the domain.

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

The trade-off is that a sum is closed. Adding a `Pamphlet` means touching every function that matches on `StoreItem`. That's the expression problem (see [Effects And Interpreters]({{< ref "type-driven-design/effects-and-interpreters" >}}#the-expression-problem)): sum types make new operations cheap and new cases expensive, and class hierarchies do the reverse. For a domain whose set of cases is stable and whose operations keep growing (pricing, shipping, tax, display), the sum type is the better bet.

limitation of Haskell with bookPrice and vinylPrice: The issue here has nothing to do with the limitation of sum types but rather a limitation of Haskell's way of dealing with record syntax. There are some workarounds

Haskell record fields are top-level functions, so two records in one module can't both have a field called `price`, hence `bookPrice` and `recordPrice`. The workarounds:

- prefix the field names, as above (the common convention)
- put each record in its own module
- enable `DuplicateRecordFields` with `OverloadedRecordDot` (GHC 9.2 and later), so `b.price` and `r.price` resolve by type
- define a `HasPrice` type class with an instance per record
- use lenses (`generic-lens`, `optics`)

Scala, F# and Rust don't have the problem, because their fields are scoped to the type that declares them.

sum types and product types <https://fares.codes/posts/adts-sum-types-and-product-types/>

### Sums versus hierarchies


A sum type and a class hierarchy can look alike (`sealed trait` with case classes is written as a hierarchy in Scala), but they model different things. Płachta (PDF, chapter 7, "What about inheritance?") names the two differences: an ADT carries no behaviour, since the functions live outside it, and a sum type lists every case, so the compiler can check that each one is handled. Wlaschin (chapter 4) puts it more briefly: cases are not the same as subclasses. `UnitQuantity` and `KilogramQuantity` are alternatives, not two kinds of one thing.

Bloch ([PDF](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), Item 23 "Prefer class hierarchies to tagged classes") shows the object-oriented version from the other side. A *tagged class* is a Java class with a `kind` field and fields for every kind, of which only some are meaningful for any given object: a `Figure` with a `shape` tag, a `radius` used only by circles and `length` and `width` used only by rectangles. Bloch calls it a pallid imitation of a class hierarchy. The tagged class is the flag-plus-optional-fields problem (below) in OO clothing, and his fix, one subclass per kind, is the hierarchy as Java's substitute for a sum type: open where a sum is closed, and without exhaustiveness checking until Java 17's sealed interfaces.

Ghosh ([PDF](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), listing 2.2, roughly) uses a hierarchy differently, to restrict which accounts a function accepts:

```scala
sealed trait Account { def no: String }
trait InterestBearingAccount extends Account { def rateOfInterest: BigDecimal }

case class CheckingAccount(no: String) extends Account
case class SavingsAccount(no: String, rateOfInterest: BigDecimal) extends InterestBearingAccount

def calculateInterest[A <: InterestBearingAccount](account: A, period: DateRange): Try[BigDecimal] = ???
```


Account is now a polymorphic data type, and the function calculateInterest is said to be polymorphic on the Account type. You're using Scala's type system to encode your domain logic. This is only an example of how you can make your domain model richer and more succinct by adding the power of types. You gain expressivity, cut out the extra fat by delegating more tests to the compiler, and get rid of boilerplates in domain logic validation.

"Delegating tests to the compiler" here means that passing a `CheckingAccount` is a compile error, so there's no `if (!account.isInstanceOf[...])` check to write and no unit test for "rejects checking accounts". The limit of this encoding is that a subtype bound expresses one capability. Once accounts have several independent capabilities (interest-bearing, overdraft, multi-currency), the hierarchy runs into the same problem as in [Product types](#product-types), and type classes are the usual alternative.

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


On its own, a newtype fixes only the first problem in the list (swapped arguments). A `Genre` newtype over `String` still admits `"hevy metal"`; for that you need a smart constructor or, better, a sum type of the genres. See [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#names-are-not-type-safety).

Two cautions:

- **Same shape, different meaning.** Wlaschin (chapter 5, "Modeling Complex Data") keeps `ShippingAddress` and `BillingAddress` as separate types even when they have identical fields, because they play different roles and may diverge.
- **Wrapping can be overdone.** King (HTML) is sceptical of wrappers that are wrapped and unwrapped at every use and protect no invariant. Percival and Gregory ([PDF](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), chapter 9) report a similar Python scepticism: applied mindlessly, the cure for primitive obsession adds complexity, and plain primitives in a service's API keep its clients decoupled from its internal types.

If the wrapper's cost is a concern, Wlaschin (chapter 5, "Avoiding Performance Issues with Simple Types") lists three options: a type alias (fast, but no safety), a struct instead of a class, or wrapping a whole collection at once (`UnitQuantities of int[]`) rather than each element.

### Scala: value classes and opaque types


Moved from [Scala]({{< ref "functional-programming/04-languages/scala" >}}) on 2026-11-05. The **Explanation** and **Critique** callouts are commentary added that day; the rest is the original note text.

**Value classes**

`@newtype` in scala 2 and `OpaqueType` in Scala 3

Bring typesafety without unecessary ...

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The sentence presumably ends "...runtime overhead": a distinct type such as `UserId` that the compiler won't confuse with another `Long`, but that is a plain `Long` at run time.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`@newtype` is not part of Scala 2; it comes from the third-party scala-newtype library. Built-in Scala 2 value classes are written `class UserId(val value: Long) extends AnyVal`, and they still allocate in generic code, arrays and pattern matches. In Scala 3 the feature is the `opaque type` keyword pair, `opaque type UserId = Long`, which never allocates. See [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}).
{{< /callout >}}


Opaque types have limits of their own. Wampler ([PDF](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), chapter 9, "Opaque Types and Value Classes") notes that you can't override `equals` or `toString` for an opaque type, or pattern match on it. Equality also falls through to the underlying type, so a `CustomerId` and a `ProductId` that are both `Int` underneath can be compared with `==` without complaint. Alexander's *Scala Cookbook* ([PDF](/sources/programming/scala/alexander-2021-scala-cookbook-2e.pdf.enc), recipe 23.7, "Creating Meaningful Type Names with Opaque Types") closes that hole by declaring `given CanEqual[CustomerId, CustomerId] = CanEqual.derived` and turning on strict equality, so comparing the two becomes a compile error. Volpe's Scala 3 book ([PDF](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), section 4.1) builds a small newtype library on opaque types for the same reasons.

## Making illegal states unrepresentable


The phrase is usually credited to Yaron Minsky's writing on OCaml at Jane Street (Ghosh's footnote to section 4.5.2 points to his "Effective ML Revisited" post), and both Ghosh and Wlaschin (chapter 6) use it as a heading. It names the technique this whole note is about: design the types so that a value violating a business rule can't be constructed, instead of checking for it at run time.

Wlaschin's examples (chapter 6, "Capturing Business Rules in the Type System") are the standard ones:

- **A flag that guards an operation.** A customer record with an `EmailAddress` and an `IsVerified : bool` can be marked verified by any code that sets the flag. The rule "password resets go only to verified addresses" then lives in comments and code reviews. Model it as a choice instead, `Unverified of EmailAddress | Verified of VerifiedEmailAddress`, and give `VerifiedEmailAddress` a private constructor so that only the verification service can create one. The password-reset function takes a `VerifiedEmailAddress`, and the rule is enforced by the compiler.
- **"At least one of".** "A customer must have an email or a postal address" can't be modeled by two required fields (both would be required) or two optional ones (both could be missing). There are exactly three legal combinations, so the type is a three-case choice: `EmailOnly | AddrOnly | EmailAndAddr`.

Khononov's *connascence of value* is the coupling these designs remove. His example is a customer with two booleans, `isVerified` and `priorityShippingEnabled`, where priority shipping is allowed only for verified customers, so every method that changes one has to remember the other. Connascence of value is near the top of his scale, and it often can't be removed, only kept within one small piece of code; a type that makes the bad combination unrepresentable is the strongest way of keeping it there.

Booleans in general deserve suspicion. Wlaschin (chapter 7) calls them generally a bad choice in a design and replaces a `bool` for "acknowledgment sent" with a two-case choice, `Sent | NotSent`, which is just as cheap and says what it means. Harper's name for the underlying problem is boolean blindness (see [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#dont-throw-information-away)).

Two more rules come from Wlaschin's chapter 13 on evolving a design:

- **Store the input to a business rule, not its output.** When VIP customers get free shipping, don't add a "free shipping" flag to the order; record that the customer is a VIP and let the shipping rule work from that. Rules change; facts about the customer don't.
- **Keep independent statuses apart.** A VIP status and a loyalty-card status are separate small choice types, not one combined enumeration whose size multiplies with every new status.

### A flag plus an optional value


Any time you see more than one value representing a single logical business entity, make sure to stop and think how to model it better. As an example, we now have two parameters that together make up a single entity. This is a *very common pattern* in programming in general: a Boolean flag plus a parameter that is only applicable if the Boolean flag is true. I am sure you recognize this pattern. We will show you two ways of approaching this pattern using functional programming techniques: the Option type and algebraic data types.

Changes in the model force changes in the logic

When `isActive` and `yearsActiveEnd` become one value, every function that read the two fields stops compiling. That's the intended effect, not a nuisance: the compiler hands you the list of places where the old encoding's meaning was being reconstructed by hand, and each one now gets the meaning from a `match`. Compare renaming a column that untyped code reads, where you find the readers by grepping or in production.

The cost is real too. A model change ripples through every consumer, so a model shared across teams or services needs the care of a public API: versioning, or a translation layer at the boundary (DDD's anti-corruption layer; see [Types At The Boundary]({{< ref "type-driven-design/types-at-the-boundary" >}}#trust-boundaries)).

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

### Behaviour as data


Płachta applies the same technique to the search function's parameters ("Modeling behaviors as data"). A search condition is one of three things, so it becomes a sum type:

```scala
enum SearchCondition {
  case SearchByGenre(genres: List[MusicGenre])
  case SearchByOrigin(locations: List[Location])
  case SearchByActiveYears(start: Int, end: Int)
}

def searchArtists(artists: List[Artist], requiredConditions: List[SearchCondition]): List[Artist]
```


The boolean flag, the pair of year parameters that only made sense together, and the convention that an empty list means "no filter" are all gone: a search uses exactly the conditions in the list. The requirement became data, and the function interprets it, which is the algebra-and-interpreter idea of [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#modules-as-algebras) in miniature.

## Simple values with rules


Wlaschin's chapter 6 ("The Integrity of Simple Values") gives the full recipe for a constrained value such as a `UnitQuantity` between 1 and 1000: a single-case type with a private constructor, a `create` function that returns a `Result`, and a `value` function to read it out. Because the data is immutable, the check happens once and is never repeated. How much that guarantee is worth, and how it can leak, is in [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#how-strong-the-evidence-is).

Units are a special case ("Units of Measure"). F# can attach a unit to a number at no run-time cost, so `5.0<kg>` can't be added to `2.0<m>`. Wlaschin also uses units for currencies and for seconds against milliseconds. Other languages get a similar effect from a phantom type parameter, as in Bragilevsky's `Temp unit` ([PDF](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), section 11.1.2) or Odersky's currency case study ([Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#abstract-types-and-type-members)).

## Values and entities


DDD distinguishes **value objects**, which have no identity (two `Money(10, EUR)` values are interchangeable), from **entities**, which keep an identity while their attributes change (two accounts with the same balance are still two accounts). In types this shows up as a choice of equality. Wlaschin (chapter 5, "A Question of Identity") gives value objects structural equality, which F# provides by default, and entities equality by ID only. His preferred way to get the second is to forbid equality on the entity type altogether (F#'s `NoEquality`), so code has to compare IDs explicitly instead of relying on an overridden `equals`.

Two practical rules from the same section:

- **Put the ID inside each case of a choice type.** An `Invoice` that is `Unpaid of UnpaidInvoice | Paid of PaidInvoice` carries the `InvoiceId` in both case records, so you can handle a paid invoice on its own without carrying the outer wrapper around.
- **Make change visible in the signature.** With immutable entities, an update is a function that returns a new entity, `UpdateName = Person -> Name -> Person`, rather than a method that mutates and returns nothing. The signature says that a person changes.

Above single entities, Wlaschin (chapter 6, "Consistency") uses DDD's **aggregate**: a group of entities, such as an order and its lines, treated as one unit, with the order as its root. The aggregate is the boundary within which consistency is enforced and the unit of persistence and atomicity, so a rule spanning two aggregates (two accounts in a transfer) can't be enforced by one aggregate's types. That's a limit of the approach: types guarantee consistency within one value, and anything wider needs a transaction or eventual consistency. Aggregates refer to each other by ID, not by containing each other.

The lifecycle of an entity, from creation through behaviours to persistence, is in [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#entities-value-objects-and-composition).

## Errors as values


`Result` (or `Either`) types and exhaustiveness checking are in the benefits list in [Type Systems]({{< ref "type-driven-design/type-systems" >}}#benefits). The design question is which errors to put in them. Wlaschin (chapter 10, "Working with Domain Errors") divides errors into three kinds:

- **Domain errors**: expected outcomes that the business already has procedures for, such as an order with an invalid product code or one rejected by billing. These go in the type, as cases of a choice.
- **Panics**: errors that leave the system in an unknown state, such as running out of memory or dividing by zero because of a bug. These stay exceptions and are caught at the top level.
- **Infrastructure errors**: a network timeout or a failed authentication. They're expected in the architecture but aren't part of any business process, so they stay out of the domain model.

Modeling domain errors as a choice has a useful side effect: adding a case forces a conversation with the domain expert about what should happen, so the list grows as the design is understood rather than having to be complete up front.

Other languages draw the same line in their own terms. Bloch (Items 69-71) uses checked exceptions for conditions the caller can be expected to recover from and runtime exceptions for programming errors, and warns against using exceptions for ordinary control flow. ZIO's error channel separates typed errors from defects (see [Effects And Interpreters]({{< ref "type-driven-design/effects-and-interpreters" >}}#errors-and-dependencies-in-zios-type)). How errors travel through a pipeline of effectful steps is in [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#failures-and-events).

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


Languages with weaker type systems get part of the way:

- **Java** (Bloch) has enums, records, `Optional` and, since Java 17, sealed interfaces with exhaustive `switch`. Before that, a sum type was a class hierarchy (Item 23) or an enum.
- **Go** has named types (`type UserID string`), which give name equivalence, but no sum types. Its enumerations are constants defined with `iota`, and Bodner ([PDF](/sources/programming/language-practice/bodner-2024-learning-go-2e.pdf.enc), chapter 7, "iota Is for Enumerations--Sometimes") warns that nothing stops a caller from creating values outside the set, and that inserting a constant in the middle renumbers the rest, which corrupts any values already stored. A type switch needs a `default` case because the compiler can't check exhaustiveness.
- **Python** has `NewType`, frozen dataclasses, `Enum` and `Literal`, all checked only by an external type checker ([Type Systems]({{< ref "type-driven-design/type-systems" >}}#static-dynamic-and-gradual-checking)).

## Library sources


- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- chapter 2 on class-driven design; chapters 4 and 5, "Understanding Types" and "Domain Modeling with Types" (simple values, complex data, identity), which the F# table follows; chapter 6, "Integrity and Consistency in the Domain" (business rules in types, aggregates); chapter 7 on booleans; chapter 10, "Working with Domain Errors"; chapter 13 on evolving the model; on most sections
- Płachta 2022, *Grokking Functional Programming* -- chapter 7, "Requirements as types": the source of the Artist excerpts, from primitives to opaque types, `Option`, the `YearsActive` ADT and `SearchCondition`, plus ADTs versus inheritance; on *Primitive obsession and the newtype pattern*, *A flag plus an optional value*, *Behaviour as data* and *Sums versus hierarchies*
- [Bloch 2018](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), *Effective Java, 3rd Edition* -- Item 23 on tagged classes, Item 34 on the int enum pattern, Item 62 on strings, Items 69-71 on exceptions; on *Sums versus hierarchies*, *Primitive obsession and the newtype pattern* and *Errors as values*
- [Khononov 2025](/sources/software-engineering/craft/khononov-2025-balancing-coupling-in-software-design.pdf.enc), *Balancing Coupling in Software Design* -- chapter 6, "Connascence": name, type, meaning, position and value; on *Primitive obsession and the newtype pattern* and *Making illegal states unrepresentable*
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling* -- listing 2.2, `calculateInterest` with a subtype bound, and section 4.5.2, "Making illegal states unrepresentable"; on *Sums versus hierarchies* and *Making illegal states unrepresentable*
- [Schwarz 2020](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc), *Scala 3 by Example: ADTs for DDD, Part 1* -- domain modeling with product and sum types, following *Domain Modeling Made Functional* with the F# originals beside the Scala 3 code; on *Product and sum types* and *The same ideas across languages*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles* -- chapter 11, "Algebraic datatypes": cardinality, `newtype`, sum types and product types; on the counting paragraph under the title and *Product and sum types*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers, Scala Edition* -- chapter 6, "Simple Algebraic Data Types", whose section 6.4 treats sums as addition and products as multiplication; on the counting paragraph under the title
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 1, "The Algebra Behind Types": cardinality, with sums as addition, products as multiplication and functions as exponents; on the counting paragraph under the title
- [Fowler 2019](/sources/software-engineering/craft/fowler-2019-refactoring-2nd-edition.pdf.enc), *Refactoring: Improving the Design of Existing Code, 2nd Edition* -- the Primitive Obsession smell and the Replace Primitive with Object refactoring; on *Primitive obsession and the newtype pattern*
- [Wampler 2021](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), *Programming Scala, 3rd Edition* -- chapter 9, "Opaque Types and Value Classes"; on *Scala: value classes and opaque types*
- [Alexander 2021](/sources/programming/scala/alexander-2021-scala-cookbook-2e.pdf.enc), *Scala Cookbook, 2nd Edition* -- recipe 23.7, opaque types with `CanEqual`; on *Scala: value classes and opaque types*
- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala, 5th Edition* -- chapter 19, enums as enumerated and algebraic data types in Scala 3; on *A flag plus an optional value*
- [Bodner 2024](/sources/programming/language-practice/bodner-2024-learning-go-2e.pdf.enc), *Learning Go, 2nd Edition* -- chapter 7 on `iota` enumerations and type switches; on *The same ideas across languages*

Further reading:

- [Percival et al. 2020](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), *Architecture Patterns with Python*
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture: Powered by Scala 3*
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*
- King 2020, *Names are not type safety*
