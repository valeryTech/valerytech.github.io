---
draft: false
toc: true
title: "Algebraic Data Types"
description: "Combining types with AND (product types) and OR (sum types), counting a type's values as a design check, and sum types versus tagged classes and class hierarchies, with Wlaschin, Kurt, Milewski, Parsons, Płachta, Bloch and Ghosh."
linkTitle: "Algebraic Data Types"
---

Algebraic data types build composite domain types from two operations: **AND** (product types: records, structs, case classes, tuples) and **OR** (sum types: choice types, discriminated unions, `enum`s, `sealed trait`s). By stating which fields exist together and which cases are alternatives, the model says up front which values can exist so invalid combinations can't be constructed. Part of [Domain Modeling With Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}).

Wlaschin ([PDF](/sources/3165b993e939de6a47737a073d7633a4.bin), chapter 4, "Composing Types") starts directly from the words domain experts use: when they say an order line has a product code *and* a quantity *and* a price, that's a product type; when they say a quantity is *either* a unit count *or* a weight in kilograms, that's a sum type. Thompson ([PDF](/sources/cc601a3f46c1bd0a06f4ab71aeb8da53.bin), chapter 14, section 14.5, "Design with algebraic data types") turns that into a three-stage method:

1. **Identify the types** the domain needs.
2. **List each type's constructors** (the cases of the sum).
3. **Choose each constructor's components** (the fields of each product).

## Product and sum types


A **product type** bundles fields that all exist together; a **sum type** defines a closed set of alternatives, each with its own shape. Instead of building a top-down inheritance tree, you compose small product and sum types from the bottom up.

Will Kurt's bookstore example in *Get Programming with Haskell* ([PDF](/sources/3adb3487789446f9050e813826487b97.bin), lesson 16, "Creating types with 'and' and 'or'", sections 16.2 and 16.3) shows both working together. A book alone is a single product type: an author *and* an ISBN *and* a title *and* a publication year *and* a price. Once the shop also sells vinyl records and collectible toys, neither their creators nor the items themselves share a single set of fields:

- **Sums inside products (nested variations).** A book is made by an `Author`, whereas a record is made by an `Artist` who may be a solo `Person` (*Elliott Smith*) or a `Band` (*The Smiths*). Even `Name` is a sum that can gain constructors for middle names or initials (*H.P. Lovecraft*, *Andrew W.K.*) without touching `Author`, `Artist` or `Creator` -- whereas a product-only Java `Name` class ends up with six fields (`firstName`, `lastName`, `middleName` and three initials), mostly unused and with no guarantee which combination is populated.
- **Products inside sums (one record per case).** Each store item keeps its own record, and `StoreItem` sums them:

```haskell
data Creator = AuthorCreator Author | ArtistCreator Artist
data Author  = Author Name
data Artist  = Person Name | Band String

data Book           = Book           { author :: Creator, isbn :: String, bookTitle :: String, bookYear :: Int, bookPrice :: Double }
data VinylRecord    = VinylRecord    { artist :: Creator, recordTitle :: String, recordYear :: Int, recordPrice :: Double }
data CollectibleToy = CollectibleToy { name :: String, toyDescription :: String, toyPrice :: Double }

data StoreItem = BookItem Book | RecordItem VinylRecord | ToyItem CollectibleToy

price :: StoreItem -> Double
price (BookItem b)   = bookPrice b
price (RecordItem r) = recordPrice r
price (ToyItem t)    = toyPrice t
```


`StoreItem` needs no base class and no shared fields, and it didn't have to exist when `Book` was written.

Giving each branch its own single-argument record (`BookItem Book`) rather than attaching record fields directly to `StoreItem`'s constructors (`data StoreItem = Book { ... } | VinylRecord { ... }`) is an important idiom (Skinner, [PDF](/sources/47da28f54846d377221bfd47a62316ff.bin), chapter 4, "Summing Records"; Parsons, [PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), chapter 15, section 15.2, "Sum Types"):

- **No partial selectors.** In Haskell, a record field declared directly on a sum constructor generates a partial selector function that throws a runtime exception when called on another constructor.
- **Each case is a type in its own right.** Because `Book` is a standalone type (just as `UnpaidInvoice` and `PaidInvoice` are in Wlaschin's `Invoice = Unpaid of UnpaidInvoice | Paid of PaidInvoice`), a function that operates only on books can take a `Book` directly instead of taking a `StoreItem` and handling impossible cases.
- **Stable pattern matches.** Adding a field to `Book` doesn't change the arity of `BookItem b` in functions that match on `StoreItem`.

Why `bookPrice` and `recordPrice` in the snippet above instead of `price`? As Kurt notes in "Why not just price?" (lesson 16, section 16.3; revisited with modules in lesson 34), this is a quirk of Haskell's record syntax rather than of sum types: Haskell record fields are module-level functions, so two records in one module can't share a field name unless you prefix the names, put each record in its own module, enable `DuplicateRecordFields` with `OverloadedRecordDot` (GHC 9.2+), or use type classes or optics (`generic-lens`, `optics`). Scala, F# and Rust scope fields to the type that declares them, so `b.price`, `r.price` and `t.price` work directly.

## Counting values: why "algebraic" matters


The word *algebraic* comes from counting how many distinct values (inhabitants) a type has (Allen and Moronuki, [PDF](/sources/ef73b442d98627834d86e8f39127b0d6.bin), chapter 11, sections 11.8-11.11; Milewski, [PDF](/sources/0e04926a1bcff6dccfd4b9a974acdff4.bin), chapter 6; Maguire, [PDF](/sources/405eaf932837c8349209bea8675e06e4.bin), chapter 1):

| Type construct | Examples | Number of values |
|---|---|---|
| Empty type | `Void`, `Nothing`, `never` | \(0\) |
| Unit type | `()`, `Unit` | \(1\) |
| Sum type (OR) | `Either a b`, `enum` | \(\|a\| + \|b\|\) (`Either Bool Ordering` has \(2 + 3 = 5\)) |
| Product type (AND) | `(a, b)`, record, `case class` | \(\|a\| \times \|b\|\) (`(Bool, Ordering)` has \(2 \times 3 = 6\)) |
| Function type | `a -> b` | \(\|b\|^{\|a\|}\) (`Ordering -> Bool` has \(2^3 = 8\)) |

See [Types As Propositions]({{< ref "type-driven-design/01-foundations/types-as-propositions" >}}) (and Hackett's review of Maguire, [PDF](/sources/6e9810f06b69f2d55edd9b9bd9bb4b5a.bin)) for how this cardinal arithmetic differs from the Curry-Howard correspondence: logically, \(A \lor A\) is equivalent to \(A\), whereas `Either a a` has \(2 \times |a|\) values.

Counting inhabitants isn't just a naming curiosity; it is a direct design check:

- **Products multiply where sums add.** Allen and Moronuki (section 11.11) note that a type's cardinality roughly measures how difficult it is to reason about. If a type admits more values than the domain has legal states, every extra value is an illegal state you must either reject at runtime or quietly mishandle. Most illegal-state bugs happen when a model uses a product (\(|A| \times |B|\)) where the domain is a sum (\(|A| + |B|\)) -- such as a record with a boolean flag and a field that matters only when the flag is set ([Illegal States Unrepresentable]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}}#a-flag-plus-an-optional-value)).
- **Algebraic identities become type refactorings.** Milewski (chapter 6, section 6.4) shows that familiar high-school algebra laws hold on types up to isomorphism:
	- `Option[A]` / `Maybe a` is \(1 + a\) (`None` is the \(1\)), and `Bool` is \(1 + 1\).
	- \(a \times 0 = 0\): a pair `(a, Void)` has \(0\) values, so a record with even one uninhabited field cannot be constructed at all.
	- Distributivity, \(a \times (b + c) = (a \times b) + (a \times c)\): a single record holding an `InvoiceId` and a two-case status `(InvoiceId, Either UnpaidData PaidData)` has the exact same information as a two-case sum `Either (InvoiceId, UnpaidData) (InvoiceId, PaidData)` where each case record carries the `InvoiceId` (Wlaschin's rule in [Domain Modeling With Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}#values-and-entities)).
- **Expanding outputs versus restricting inputs.** Parsons ([PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), chapter 11, "Keep Your Types Small...", section 11.1) reads `Maybe a` (\(1 + a\)) and `Either e a` (\(e + a\)) as *expanding* a function's range to push failure handling forward to callers, and types such as `NonZero a` (\(a - 1\)) and `NonEmpty a` (\([a] - 1\)) as *restricting* its domain to push responsibility back to construction sites ([Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}#partial-functions-made-total)). His caveat on `NonEmpty a` is that `[a]` and `[a] - 1` are the same infinity: what buys safety is not a smaller cardinal number in the abstract, but removing the specific value (`[]`) that the operation cannot handle.

## Sums versus hierarchies


When a domain has variants, object-oriented and functional codebases reach for three different encodings: **tagged classes**, **class hierarchies**, and **sum types**.

### Why product-only designs fall into hierarchies


In a language whose records only combine fields with AND, the standard way to put books, records and toys into one list is an inheritance hierarchy (Kurt, lesson 16, section 16.1.1, "The curse of product types: hierarchical design"): a `StoreItem` superclass holding the shared fields, with `Book` and `VinylRecord` extending it. Every new kind of item then has to fit a tree designed before it existed. Shared fields get pushed up until the base class is a grab bag, and an item that shares some fields but not others (a `CollectibleToy` has no author or publication year, so `StoreItem` shrinks to `price`; in Kurt's exercise Q16.1, a free `Pamphlet` has no price field at all) forces dummy fields, an intermediate class, or another round of refactoring. With a sum type, adding `| PamphletItem Pamphlet` lets `price (PamphletItem _) = 0.0` work without forcing a dummy price onto `Pamphlet`.

Wlaschin (chapter 2, "Fighting the Impulse to Do Class-Driven Design") gives the domain-driven version of the warning. Faced with orders and quotes that share fields, a developer invents an `OrderBase` superclass; Wlaschin's test is to ask the domain expert what an `OrderBase` is. If the business has no word for it, it is an artifact of the modeling tool, not part of the domain. Vernon ([PDF](/sources/b38f90837dd74283bea4b629417e8718.bin), chapter 5, "Choose Your Abstractions Carefully") warns against the same move in Scrum: collapsing `Product`, `BacklogItem`, `Release` and `Sprint` into a generic `ScrumElement` and `ScrumElementContainer` with a `typeName` string trades the ubiquitous language for an over-general hierarchy that domain experts don't recognize and that breaks once the cases diverge.

### Tagged classes: a product pretending to be a sum


Bloch ([PDF](/sources/99fe404f1fe77aab60731171df07c68f.bin), Item 23, "Prefer class hierarchies to tagged classes") shows the failure mode from the object-oriented side. A *tagged class* is a single class with a `kind` tag and fields for every variant, of which only some are meaningful for any given instance: a `Figure` with a `shape` field, a `radius` used only by circles, and `length` and `width` used only by rectangles. Bloch calls it a pallid imitation of a class hierarchy. In algebraic terms, it models a sum (\(A + B\)) as a product (\(\text{Tag} \times A \times B\)). Bloch's fix -- one subclass per kind -- uses a class hierarchy as Java's substitute for a sum type: open where a sum is closed, and without compiler exhaustiveness checking until Java 17's `sealed` interfaces and pattern-matching `switch`.

### Closed sums versus open hierarchies


A sum type and a class hierarchy can look alike syntactically (`sealed trait` or `enum` with case classes in Scala), but they model different things. Płachta (PDF, chapter 7, "What about inheritance?") names the two structural differences:

- **Data is separate from behaviour:** an ADT carries only data, and functions live outside it and pattern-match on it.
- **The set of cases is closed:** every alternative is listed in one place, so the compiler checks that every `match` handles all of them.

Wlaschin (chapter 4) states the conceptual difference: *cases are not subclasses*. `UnitQuantity` and `KilogramQuantity` are alternatives for measuring an order line, not two specialized kinds of a parent entity.

The trade-off between a closed sum and an open class hierarchy is the **expression problem** (see [Tagless Final]({{< ref "type-driven-design/04-architecture/tagless-final" >}}#the-expression-problem)):

- **Sum types** close the set of cases, making **new operations cheap** (add a function; the compiler checks every case) and **new cases expensive** (adding `PamphletItem` touches every function that matches on `StoreItem`).
- **Class hierarchies** leave the set of subclasses open, making **new cases cheap** (add a subclass implementing the interface) and **new operations expensive** (adding a method touches every subclass).

For a domain model whose set of cases is known and whose operations keep growing (pricing, shipping, tax, display, serialization), a closed sum type is usually the right trade.

### Subtype bounds and type classes for capabilities


Ghosh ([PDF](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), section 2.2, listings 2.2-2.3, adapted) shows where a hierarchy inside a sealed ADT can still earn its keep -- restricting which cases a function accepts:

```scala
sealed trait Account { def no: String }
trait InterestBearingAccount extends Account { def rateOfInterest: BigDecimal }

case class CheckingAccount(no: String) extends Account
case class SavingsAccount(no: String, rateOfInterest: BigDecimal) extends InterestBearingAccount

def calculateInterest[A <: InterestBearingAccount](account: A, period: DateRange): Try[BigDecimal] = ???
```


> Account is now a polymorphic data type, and the function calculateInterest is said to be polymorphic on the Account type. You're using Scala's type system to encode your domain logic. This is only an example of how you can make your domain model richer and more succinct by adding the power of types. You gain expressivity, cut out the extra fat by delegating more tests to the compiler, and get rid of boilerplates in domain logic validation.

"Delegating tests to the compiler" here means that passing a `CheckingAccount` to `calculateInterest` is a compile error, so there is no `if (!account.isInstanceOf[...])` check to write and no unit test for "rejects checking accounts". The limit of this encoding is that a subtype bound expresses a single hierarchy of capabilities. Once accounts have several independent capabilities (interest-bearing, overdraft, multi-currency), a trait tree runs into the same combinatorial wall as `StoreItem`, and type classes (or separate capability values) are the clean alternative.

## Library sources


- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional* -- chapter 2, "Fighting the Impulse to Do Class-Driven Design" (`OrderBase`); chapter 4, "Understanding Types", on composing types with AND and OR and why cases are not subclasses; on the introduction, *Product and sum types* and *Sums versus hierarchies*
- [Kurt 2018](/sources/3adb3487789446f9050e813826487b97.bin), *Get Programming with Haskell* -- lesson 16, "Creating types with 'and' and 'or'": section 16.1.1, "The curse of product types: hierarchical design" (the Java `StoreItem` hierarchy), section 16.2 on nested sums (`Creator`, `Author`, `Artist` and `Name` against a six-field Java `Name` class), section 16.3, "Putting together your bookstore" and "Why not just price?", and exercise Q16.1 (`Pamphlet` with no price field); lesson 34 on resolving duplicate record fields with modules; on *Product and sum types* and *Sums versus hierarchies*
- [Thompson 2023](/sources/cc601a3f46c1bd0a06f4ab71aeb8da53.bin), *Haskell: The Craft of Functional Programming, 3rd Edition* -- chapter 14, "Algebraic types", section 14.5, "Design with algebraic data types": a three-stage method (identify the types, list each type's constructors, choose each constructor's components) worked through on string edit distance (`Edit`) and queue simulation (`Inmess`, `Outmess`); on the introduction
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell* -- chapter 4, "Creating New Types": "Dealing with Duplicate Record Fields" and "Naming Record Fields" (selectors are top-level functions, so two records can't share a field name; prefix with the type name or split into modules), and "Summing Records" (record fields on a sum type become partial selectors that throw at runtime, so give each constructor its own record); on *Product and sum types*
- [Parsons 2023](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), *Production Haskell* -- chapter 11, "Keep Your Types Small...", section 11.1, "Expansion and Restriction", on `Maybe`/`Either` (\(1 + a\), \(e + a\)) versus `NonZero`/`NonEmpty` (\(a - 1\), \([a] - 1\)) and why removing `[]` matters even though \([a] - 1\) is still infinite; chapter 15, "Growing Pains", section 15.2, "Sum Types", on why sum constructors should wrap single-argument records rather than inline record fields and why hiding sum constructors behind projections loses exhaustiveness; chapter 23, section 23.5 on `DuplicateRecordFields` with `generic-lens`; on *Product and sum types* and *Counting values: why "algebraic" matters*
- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles* -- chapter 11, "Algebraic datatypes": section 11.8, "What makes these datatypes algebraic?", on cardinality, 11.10, "Sum types", on sums adding, and 11.11, "Product types", on products multiplying, where cardinality "roughly equates to how difficult it is to reason about"; 11.11, "Record syntax", on field accessors being ordinary functions and why not to put record fields on sum types; on *Product and sum types* and *Counting values: why "algebraic" matters*
- [Milewski 2019](/sources/0e04926a1bcff6dccfd4b9a974acdff4.bin), *Category Theory for Programmers, Scala Edition* -- chapter 6, "Simple Algebraic Data Types", especially section 6.4 on sums as addition, products as multiplication, `Option` as \(1 + a\), `(a, Void)` as \(a \times 0 = 0\), and the distributive law \(a \times (b + c) = a \times b + a \times c\) up to isomorphism; on *Counting values: why "algebraic" matters*
- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 1, "The Algebra Behind Types": cardinality, with `Void` as \(0\), `()` as \(1\), sums as addition, products as multiplication and functions as exponents; on *Counting values: why "algebraic" matters*
- [Vernon 2016](/sources/b38f90837dd74283bea4b629417e8718.bin), *Domain-Driven Design Distilled* -- chapter 5, "Choose Your Abstractions Carefully": `ScrumElement` and `ScrumElementContainer` with a `typeName` string versus explicit `Product`, `BacklogItem`, `Release` and `Sprint` types in the ubiquitous language; on *Sums versus hierarchies*
- Płachta 2022, *Grokking Functional Programming* -- chapter 7, "What about inheritance?": ADTs versus inheritance (no behaviour inside the data, closed set of cases); on *Sums versus hierarchies*
- [Bloch 2018](/sources/99fe404f1fe77aab60731171df07c68f.bin), *Effective Java, 3rd Edition* -- Item 23, "Prefer class hierarchies to tagged classes"; on *Sums versus hierarchies*
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling* -- section 2.2, "Static types and rich domain models", listings 2.2-2.3, `calculateInterest` with a subtype bound; on *Sums versus hierarchies*
- [Schwarz 2020](/sources/f1c14b872d21423c5ed67709396f62c6.bin), *Scala 3 by Example: ADTs for DDD, Part 1* -- domain modeling with product and sum types, following *Domain Modeling Made Functional* with the F# originals beside the Scala 3 code; on *Product and sum types*

Further reading:

- [Hackett 2020](/sources/6e9810f06b69f2d55edd9b9bd9bb4b5a.bin), *Review of "Thinking with Types"* ([doi:10.1017/S0956796820000015](https://doi.org/10.1017/S0956796820000015)) -- notes that Maguire's chapter 1 conflates two correspondences: Curry-Howard links types with logic, whereas sums as addition, products as multiplication and functions as exponents belong to cardinal arithmetic; on *Counting values: why "algebraic" matters*
- [Serrano Mena 2022](/sources/5c1001bd2c4b75b2ff640e61358fc71a.bin), *Haskell: Almost Standard Libraries* -- chapter 10, "Optics", section 10.1, "Lenses, prisms, (affine) traversals, folds": `makeLenses` on underscore-prefixed fields, and a field present in only some constructors of `User = Person {...} | Entity {...}` becoming an affine traversal read with `preview`; on *Product and sum types*
- Fares, "[ADTs: Sum Types and Product Types](https://fares.codes/posts/adts-sum-types-and-product-types/)" -- a short introduction to product and sum types; on *Product and sum types*
