---
draft: false
toc: true
title: "Domain Modeling with Types"
description: "An overview of modeling a domain with types, following Wlaschin and Kurt: type-first design, how the vocabulary translates across languages, values, entities and aggregates, and errors as values."
linkTitle: "Domain Types"
---

Domain modeling with types makes the model state which values can exist and which transitions are legal, so that invalid combinations can't be constructed. Following the progression in Wlaschin's *Domain Modeling Made Functional* ([PDF](/sources/3165b993e939de6a47737a073d7633a4.bin), chapters 4 to 7 and 10) and Płachta's *Grokking Functional Programming* (PDF, chapter 7), the notes in this folder build from the leaves of a model up to full workflows:

1. [Newtypes And Simple Values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}): replace bare primitives at the leaves with distinct types (`EmailAddress`, `OrderId`, `UnitQuantity`) whose constructors enforce their rules.
2. [Algebraic Data Types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}): combine types with AND (product types) and OR (sum types), count a type's values as a design check, and compare closed sums with class hierarchies.
3. [Making illegal states unrepresentable]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}}): encode business rules directly in those combinations so values that violate an invariant cannot be built.
4. [Workflows And States]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}): put the types in motion across workflow pipelines, one type per state, state machines, typestate, and multi-transaction sagas.

This note covers the foundations that cut across all four: **type-first design** (sketching a program as types and transformations before writing code), **how the vocabulary translates across languages**, **values, entities and aggregates** (where identity and consistency boundaries live), and **errors as values** (which failures belong in a function's return type). What happens to these types at the edges of a system is in [Types At The Boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}), and how a typed domain is organized into modules and interpreters is in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}).

## Type-first design


Designing with types starts by writing down the types of values and the signatures of transformations before implementing any bodies. Kurt ([PDF](/sources/3adb3487789446f9050e813826487b97.bin), lessons 12 and 13) introduces the three basic tools Haskell provides for this, each with counterparts in Scala, F#, Rust and TypeScript:

- **Algebraic data declarations (`data`):** `data Shape = Circle Double | Rect Double Double` declares a new type combining products and sums in one declaration ([Algebraic Data Types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}})). This is where the domain's concepts and states get their names.
- **Type synonyms (`type`):** `type Name = String` gives an existing type a second name and nothing more. Because the compiler treats `Name` and `String` as identical, a synonym documents intent but protects nothing: any `String` can be passed where a `Name` is expected. Use a newtype or opaque type when you want the compiler to keep values apart ([Newtypes And Simple Values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}})).
- **Type classes (`class`):** a type class states what a type can *do* (`Eq`, `Ord`, `Show`, `Num`), independently of what it *is*. Instances can be added after the fact, even for types defined elsewhere, whereas a Java interface must be declared when the class is defined. A class hierarchy is a family tree, where what you are depends on your ancestors; a type class is a driving licence, which anyone who passes the test can hold. It is the open-world counterpart to the closed sum types in [Algebraic Data Types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}#sums-versus-hierarchies).

Miran Lipovača's *Learn You a Haskell for Great Good!* (chapter 8, "Making Our Own Types and Typeclasses") summarises how that shifts design away from inheritance trees:

> Haskell's combination of purity, higher order functions, parameterized algebraic data types, and typeclasses allows us to implement polymorphism on a much higher level than possible in other languages. We don't have to think about types belonging to a big hierarchy of types. Instead, we think about what the types can act like and then connect them with the appropriate typeclasses. An Int can act like a lot of things. It can act like an equatable thing, like an ordered thing, like an enumerable thing, etc.

In Kurt's Unit 3 opener ("Programming in types", [PDF](/sources/3adb3487789446f9050e813826487b97.bin), before lesson 16), thinking in types means planning a program as a chain of type signatures before writing the code:

> But what does it mean to think about programming in types? When you look at the type signature of a function -- say, `a -> b` -- you can view this signature as a description of **a transformation**.
>
> When solving problems in Haskell, you can approach them first as *a sequence of abstract transformations*. For example, say you have a large text document and you need to find all the numbers in that document and then add them together.

Kurt sketches the plan as a sequence of signatures (`Document -> [String]`, `[String] -> (String -> Bool) -> [String]`, `[String] -> [Integer]`, `[Integer] -> Integer`). Written out with `Int`, the pipeline is:

```text
String        the document
  → [String]  split into words
  → [String]  keep the words that are numbers
  → [Int]     convert each one
  → Int       add them up
```


Each arrow is either in the standard library or a line long:

```haskell
import Data.Char (isDigit)

sumNumbers :: String -> Int
sumNumbers = sum . map read . filter (all isDigit) . words
```


Writing the type chain first also exposes where the plan is weak. `read :: String -> Int` is partial: it crashes on anything that isn't a number, so the filter in front of it has to be exactly right and `read` has no way to see that the filter ran. Merging the check and the conversion into `readMaybe :: String -> Maybe Int` is [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) in miniature:

```haskell
import Data.Maybe (mapMaybe)
import Text.Read (readMaybe)

sumNumbers :: String -> Int
sumNumbers = sum . mapMaybe readMaybe . words
```


As Kurt concludes:

> And you're finished! By thinking about the types of transformations that you're going to make, you've been able to design your overall program much the same way you design a single function.
>
> The more Haskell you learn, the more you'll find yourself programming in types first and then using functions to hash out the details.

At the scale of a whole business process, this is Wlaschin's workflow pipeline in [Workflows And States]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}#workflows-as-functions): write the chain of domain types (`UnvalidatedOrder -> ValidatedOrder -> PricedOrder`), then fill in each arrow.

## The same ideas across languages


*Domain Modeling Made Functional* ([PDF](/sources/3165b993e939de6a47737a073d7633a4.bin)) uses F#, and the same building blocks translate directly across statically typed functional and multi-paradigm languages:

```text
F#                     Rust / Scala / TypeScript
--------------------------------------------------------
DU / union             enum / enum or sealed trait / discriminated union
single-case union      newtype struct / opaque type / branded type
Result                 Result / Either / Result-like union
Option                 Option / Option / T | undefined
pattern matching       match / match / switch narrowing
```


Languages with weaker or more traditional type systems get part of the way:

- **Java** (Bloch, [PDF](/sources/99fe404f1fe77aab60731171df07c68f.bin)) has enums, records, `Optional` and, since Java 17, `sealed` interfaces with exhaustive pattern-matching `switch`. Before that, a sum type had to be encoded as a class hierarchy (Item 23) or an enum with per-constant behaviour. Urma, Fusco and Mycroft ([PDF](/sources/58d1df2acb632c20f823cf03c6224a83.bin), chapter 11, "Using Optional as a better alternative to null") use `Optional<T>` to separate planned absence from missing-data bugs in domain getters, while noting that `Optional` was designed only for return values and isn't `Serializable`, so frameworks that serialize fields push it onto accessor methods.
- **Go** has named types (`type UserID string`), which give name equivalence, but no sum types. Its enumerations are constants defined with `iota`, and Bodner ([PDF](/sources/9c094741f6655c74e9b828ed1b091426.bin), chapter 7, "iota Is for Enumerations -- Sometimes") warns that nothing stops a caller from creating values outside the set, and that inserting a constant in the middle renumbers the rest, which corrupts any values already stored. A type switch needs a `default` case because the compiler can't check exhaustiveness.
- **Python** has `NewType`, frozen dataclasses, `Enum`, `Literal` and `Union`, all checked only by an external type checker ([Dimensions Of Type Systems]({{< ref "type-driven-design/01-foundations/dimensions-of-type-systems" >}}#static-dynamic-and-gradual-checking)).

## Values and entities


DDD distinguishes **value objects**, which have no identity (two `Money(10, EUR)` values are interchangeable), from **entities**, which keep an identity while their attributes change (two accounts with the same balance are still two accounts). Whether a concept has identity depends on the bounded context: Millett and Tune ([PDF](/sources/9d5539a5016c513dd6cba96230483320.bin), chapter 16, "Context-Dependent") note that £100 in retail banking is a `Money` value object, whereas in banknote printing or serial-number tracing each note is an entity.

In types this shows up as a choice of equality. Wlaschin (chapter 5, "A Question of Identity") gives value objects structural equality, which F# provides by default, and entities equality by ID only. His preferred way to get the second is to forbid equality on the entity type altogether (F#'s `NoEquality`), so code has to compare IDs explicitly instead of relying on an overridden `equals`. Khononov ([PDF](/sources/deaedd205f4448340ac88de7be2f3116.bin), chapter 6, "Value object" and "Entities") shows the converse bug: adding a `ColorId` field to an RGB `Color` lets two rows hold the same RGB values under different IDs, so comparing IDs misses that they are the same color; an entity's own ID (`PersonId`) is itself a value object.

Two practical rules from Wlaschin's section:

- **Put the ID inside each case of a choice type.** An `Invoice` that is `Unpaid of UnpaidInvoice | Paid of PaidInvoice` carries the `InvoiceId` in both case records, so you can handle a paid invoice on its own without carrying the outer wrapper around (the distributive law \(a \times (b + c) = a \times b + a \times c\) from [Algebraic Data Types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}#counting-values-why-algebraic-matters)).
- **Make change visible in the signature.** With immutable entities, an update is a function that returns a new entity, `UpdateName = Person -> Name -> Person`, rather than a method that mutates and returns nothing. The signature says that a person changes. Vernon ([PDF](/sources/b38f90837dd74283bea4b629417e8718.bin), chapter 5, "What Is an Entity?" and "What about Functional Programming?") notes that individuality rather than mutability is what defines an entity, and that separating immutable record types from pure functions returning a new state or a domain event -- the "anemic domain model" anti-pattern in object-oriented DDD -- is standard functional style.

Above single entities, Wlaschin (chapter 5, "Aggregates", and chapter 6, "Consistency") uses DDD's **aggregate**: a group of entities, such as an order and its lines, treated as one unit, with the order as its root. The aggregate is the boundary within which consistency is enforced and the unit of persistence and atomicity, so a rule spanning two aggregates (two accounts in a transfer) can't be enforced by one aggregate's types. That's a limit of the approach: types guarantee consistency within one value, and anything wider needs a transaction or eventual consistency. Vernon (chapter 5, "Aggregate Rules of Thumb" and "Right-Sizing Aggregates") states DDD's discipline in four rules: protect business invariants inside aggregate boundaries, design small aggregates (starting from a single root entity and merging another in only when the business requires immediate rather than eventual consistency), reference other aggregates by identity only, and update other aggregates using eventual consistency via domain events, committing at most one aggregate instance per transaction; Khononov (chapter 6, "Aggregates") pairs that boundary with an optimistic concurrency version check (`agg_version`) on save so concurrent commands on the same aggregate can't overwrite each other silently. Wlaschin's answer for the transfer is to remodel rather than widen the transaction. The transfer has its own identity, so it becomes an entity of its own (`MoneyTransfer`), and an account's balance is computed from the transfers that reference it. A rule such as "never below zero" can then be shared between aggregates as a constrained type or a shared validation function (chapter 6, "Consistency Between Aggregates in the Same Context" and "Multiple Aggregates Acting on the Same Data").

Helland ([PDF](/sources/6ae2299d96866be308e4ac412117c114.bin), sections 1 and 2) gives the distributed-systems reason for the same boundary: once uniquely keyed *entities* (aggregates, in DDD's terms) can be repartitioned across machines, each key is its own disjoint scope of serializability, atomic transactions cannot span two keys (or even an entity and a secondary index), and updates across entities have to travel as asynchronous messages addressed by key.

The lifecycle of an entity, from creation through behaviours to persistence, is in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#entities-value-objects-and-composition).

## Errors as values


`Result` (or `Either`) types and exhaustiveness checking are in the benefits list in [Type Systems]({{< ref "type-driven-design/01-foundations/type-systems" >}}#benefits). The design question is which errors to put in them. Wlaschin (chapter 10, "Working with Domain Errors") divides errors into three kinds:

- **Domain errors**: expected outcomes that the business already has procedures for, such as an order with an invalid product code or one rejected by billing. These go in the type, as cases of a choice.
- **Panics**: errors that leave the system in an unknown state, such as running out of memory or dividing by zero because of a bug. These stay exceptions and are caught at the top level.
- **Infrastructure errors**: a network timeout or a failed authentication. They're expected in the architecture but aren't part of any business process, so they stay out of the domain model.

Modeling domain errors as a choice has a useful side effect: adding a case forces a conversation with the domain expert about what should happen, so the list grows as the design is understood rather than having to be complete up front.

Other languages draw the same line in their own terms. Bloch (Items 69-71) uses checked exceptions for conditions the caller can be expected to recover from and runtime exceptions for programming errors, and warns against using exceptions for ordinary control flow. ZIO's error channel separates typed errors from defects (see [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}#errors-and-dependencies-in-zios-type)). How errors travel through a pipeline of effectful steps is in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#failures-and-events).

Typed errors have a composition failure mode of their own. Parsons ([PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), chapter 12, "The Trouble with Typed Errors", and chapter 13, "Exceptions") traces what happens when functions with small, honest error types (`HeadError`, `LookupError`, `ParseError`) are sequenced with monadic bind `(>>=)`, which requires one shared error type: teams merge every case into a single `AppError` (`AllErrorsEver`) sum. A pure function returning `Either AllErrorsEver Integer` then claims it can fail with `FileNotFound`, callers add catch-all `_ -> error "impossible"` branches that defeat exhaustiveness when new errors appear, and handling one case (`AllParseError`) still returns `Either AllErrorsEver Integer` because the handled case can't be subtracted from the sum. Even classy-prism constraints (`AsParseError err => Either err a`) compose cases without being able to remove one once handled. Without open variants (OCaml, PureScript) or union types that narrow per branch -- De Goes, Fraser and Khajavi ([PDF](/sources/4115845a430bc3f50ff12c191a45fd53.bin), Appendix 1, "Union Types") note the same loss in Scala 2 when `IOError` and `InvalidPassword` widen to a broader parent trait, and point to Scala 3's `A | B` unions as the fix -- Parsons argues for single-constructor structured error types and, in GHC Haskell, runtime exception hierarchies (`throwIO`) over a monolithic `Either` sum.

## Library sources


- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional* -- the book the domain-modeling notes follow. Here: chapter 5, "A Question of Identity" (value objects and entities) and "Aggregates"; chapter 6, "Consistency" (within and between aggregates and contexts); chapter 10, "Working with Domain Errors"; the F# side of the table in *The same ideas across languages* follows chapters 4 and 5
- [Kurt 2018](/sources/3adb3487789446f9050e813826487b97.bin), *Get Programming with Haskell* -- Unit 3 opener, "Programming in types" (before lesson 16): functions as transformations and the document-numbers type chain; lessons 12 and 13 on `type` synonyms, `data` declarations and type classes; lesson 38, "Errors in Haskell and the Either type" (from partial `head` through `Maybe` to `Either PrimeError Bool`); on *Type-first design* and *Errors as values*
- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles* -- chapter 11, "Algebraic datatypes", section 11.9, "newtype", on `newtype` against type synonyms (a synonym is the same type and can't have its own instances); chapter 6, "Typeclasses", on typeclasses as what a type can do, with dispatch by type in section 6.12; on *Type-first design*
- [Vernon 2016](/sources/b38f90837dd74283bea4b629417e8718.bin), *Domain-Driven Design Distilled* -- chapter 5, "Tactical Design with Aggregates": "What Is an Entity?", "What Is a Value Object?", "Aggregate Rules of Thumb" (the four rules), "What about Functional Programming?" (immutable records and pure functions against the OO anemic model) and "Right-Sizing Aggregates"; on *Values and entities*
- [Khononov 2021](/sources/deaedd205f4448340ac88de7be2f3116.bin), *Learning Domain-Driven Design* -- chapter 6, "Tackling Complex Business Logic": "Value object" (including figure 6-1's redundant `ColorId` bug), "Entities" (`PersonId` as a value object) and "Aggregates" (consistency and transaction boundaries, one aggregate per transaction, optimistic concurrency with `agg_version`); on *Values and entities*
- [Millett et al. 2015](/sources/9d5539a5016c513dd6cba96230483320.bin), *Patterns, Principles, and Practices of Domain-Driven Design* -- chapter 15 on value objects and attribute-based equality; chapter 16, "Context-Dependent" (`Money` as a value object in retail banking versus an entity when tracing banknotes); chapter 19 on aggregates as consistency boundaries and favoring IDs over object references; on *Values and entities*
- [Helland 2007](/sources/6ae2299d96866be308e4ac412117c114.bin), *Life Beyond Distributed Transactions: An Apostate's Opinion* -- sections 1 and 2: uniquely keyed *entities* as disjoint scopes of serializability under repartitioning, why atomic transactions cannot span entities or secondary indexes, and cross-entity updates via asynchronous messages; on *Values and entities*
- [Bloch 2018](/sources/99fe404f1fe77aab60731171df07c68f.bin), *Effective Java, 3rd Edition* -- Items 69-71 on exceptions; on *Errors as values* and *The same ideas across languages*
- [Parsons 2023](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), *Production Haskell* -- chapter 12, "The Trouble with Typed Errors": sequencing `Either` with `(>>=)` pushing teams into a monolithic `AllErrorsEver` sum, classy prisms failing to decompose handled cases, and single-constructor structured errors; chapter 13, "Exceptions", on single-constructor runtime exceptions and exception hierarchies; on *Errors as values*
- [De Goes et al. 2025](/sources/4115845a430bc3f50ff12c191a45fd53.bin), *Zionomicon* -- section 3.1 on typed errors versus defects, chapter 26, section 26.2.1.3 on domain error ADTs, and Appendix 1, "Union Types", on Scala 2 widening `IOError` and `InvalidPassword` to a parent trait versus Scala 3's `A | B` union types; on *Errors as values*
- [Urma et al. 2018](/sources/58d1df2acb632c20f823cf03c6224a83.bin), *Modern Java in Action* -- chapter 11, "Using Optional as a better alternative to null", on modeling optionality in `Person`/`Car`/`Insurance` and why `Optional` isn't `Serializable`; chapter 20 comparing Java and Scala on tuples, `Option` and immutability; on *The same ideas across languages*
- [Schwarz 2020](/sources/f1c14b872d21423c5ed67709396f62c6.bin), *Scala 3 by Example: ADTs for DDD, Part 1* -- domain modeling with product and sum types, following *Domain Modeling Made Functional* with the F# originals beside the Scala 3 code; on *The same ideas across languages*
- [Bodner 2024](/sources/9c094741f6655c74e9b828ed1b091426.bin), *Learning Go, 2nd Edition* -- chapter 7 on `iota` enumerations and type switches; on *The same ideas across languages*

Further reading:

- Płachta 2022, *Grokking Functional Programming* -- chapter 9, "Streams as values", sections "Functional jigsaw puzzle" and "Following types in a bottom-up design" (assembling functions by matching input and output signatures), and chapter 11, "Designing functional programs", sections "Modeling using immutable values", "Data access modeling" and "Business logic as a pure function" (turning requirements into ADTs and `DataAccess` function signatures before implementing them); on *Type-first design*
- [Pilquist et al. 2023](/sources/075d81d6390bbb592aa1a8ba0a5f967d.bin), *Functional Programming in Scala, 2nd Edition* -- section 2.5, "Following types to implementations" (deriving polymorphic functions such as `partial1`, `curry`, `uncurry` and `compose` from their type signatures alone); on *Type-first design*
- [Hutton 2016](/sources/f0e4725efb19f3066e064f035d04d900.bin), *Programming in Haskell, 2nd Edition* -- chapter 8, "Declaring types and classes", sections 8.1-8.5: `type` synonyms, `data` declarations, `newtype` declarations and type classes side by side; on *Type-first design*
- [Percival et al. 2020](/sources/1b11fd9a1f1b2a8156524d833d153d29.bin), *Architecture Patterns with Python* -- chapter 1, "Domain Modeling", sections "More Types for More Type Hints" (`typing.NewType`), "Dataclasses Are Great for Value Objects" (`@dataclass(frozen=True)` and `NamedTuple` for structural equality) and "Value Objects and Entities" (`__eq__` and `__hash__` on `Batch.reference`, or `__hash__ = None`); on *Values and entities* and *The same ideas across languages*
- [Dean et al. 2019](/sources/fc5462126577e55d837e2d4d25b2843f.bin), *Event Streams in Action* -- chapter 8, "Railway-oriented processing": adapts Wlaschin's railway metaphor to Scala stream jobs, halting only on startup or novel errors and routing expected per-event failures to a structured failure stream with Scalaz `ValidationNel` inside a step and `flatMap` across steps; on *Errors as values*
- [Harsanyi 2022](/sources/6478a252c0ec58c019489edc7c56f00e.bin), *100 Go Mistakes and How to Avoid Them* -- chapter 7, mistakes #48, "Panicking", and #49, "Ignoring when to wrap an error": reserving `panic` for programmer errors and failed mandatory startup dependencies while returning `error` values elsewhere; on *Errors as values* and *The same ideas across languages*
