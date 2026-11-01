---
draft: false
toc: true
title: "Algebraic Data Types"
description: "Product and sum types, counting a type's values as a design check, and sum types versus class hierarchies, with Wlaschin, Płachta, Bloch and Ghosh."
linkTitle: "Algebraic Data Types"
---

Algebraic data types combine types with AND (product types) and OR (sum types), so the model states which values can exist and invalid combinations can't be constructed. Part of [Domain modeling with types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}).

The names come from counting values. A product `(Bool, Ordering)` has 2 × 3 = 6 values; a sum `Either Bool Ordering` has 2 + 3 = 5. Counting is a quick design check: if a type admits more values than the domain has legal states, each extra value is a case you'll have to reject at runtime or quietly mishandle.

## Product types


The curse of product types: hierarchical design. Example from GPWH 16.1

GPWH is Will Kurt's *Get Programming with Haskell*; lesson 16 is "Creating types with 'and' and 'or'". A product type bundles fields that all exist together: a book has an author *and* an ISBN *and* a title *and* a price. That's enough while the shop sells one kind of thing. The trouble starts when it also sells vinyl records and toys, and you want a single list of store items.

With only products, the usual answer (familiar from Java) is a hierarchy: a `StoreItem` superclass holding the shared fields, with `Book` and `VinylRecord` extending it. Every new kind of item then has to fit a tree designed before it existed. Shared fields get pushed up until the base class is a grab bag, and an item that shares some fields but not others (a toy has a price but no creator) forces an intermediate class. That's the curse: if you can only combine with AND, the only way to share structure is to build a tree.

Wlaschin (chapter 2, "Fighting the Impulse to Do Class-Driven Design") gives the domain-driven version of the warning. Faced with orders and quotes that share fields, a developer invents an `OrderBase` class, and Wlaschin's test is to ask the domain expert what an `OrderBase` is. If the business has no word for it, it's an artifact of the modeling tool, not part of the domain.

## Sum types


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

The trade-off is that a sum is closed. Adding a `Pamphlet` means touching every function that matches on `StoreItem`. That's the expression problem (see [Tagless Final]({{< ref "type-driven-design/04-architecture/tagless-final" >}}#the-expression-problem)): sum types make new operations cheap and new cases expensive, and class hierarchies do the reverse. For a domain whose set of cases is stable and whose operations keep growing (pricing, shipping, tax, display), the sum type is the better bet.

limitation of Haskell with bookPrice and vinylPrice: The issue here has nothing to do with the limitation of sum types but rather a limitation of Haskell's way of dealing with record syntax. There are some workarounds

Haskell record fields are top-level functions, so two records in one module can't both have a field called `price`, hence `bookPrice` and `recordPrice`. The workarounds:

- prefix the field names, as above (the common convention)
- put each record in its own module
- enable `DuplicateRecordFields` with `OverloadedRecordDot` (GHC 9.2 and later), so `b.price` and `r.price` resolve by type
- define a `HasPrice` type class with an instance per record
- use lenses (`generic-lens`, `optics`)

Scala, F# and Rust don't have the problem, because their fields are scoped to the type that declares them.

sum types and product types <https://fares.codes/posts/adts-sum-types-and-product-types/>

## Sums versus hierarchies


A sum type and a class hierarchy can look alike (`sealed trait` with case classes is written as a hierarchy in Scala), but they model different things. Płachta (PDF, chapter 7, "What about inheritance?") names the two differences: an ADT carries no behaviour, since the functions live outside it, and a sum type lists every case, so the compiler can check that each one is handled. Wlaschin (chapter 4) puts it more briefly: cases are not the same as subclasses. `UnitQuantity` and `KilogramQuantity` are alternatives, not two kinds of one thing.

Bloch ([PDF](/sources/99fe404f1fe77aab60731171df07c68f.bin), Item 23 "Prefer class hierarchies to tagged classes") shows the object-oriented version from the other side. A *tagged class* is a Java class with a `kind` field and fields for every kind, of which only some are meaningful for any given object: a `Figure` with a `shape` tag, a `radius` used only by circles and `length` and `width` used only by rectangles. Bloch calls it a pallid imitation of a class hierarchy. The tagged class is the flag-plus-optional-fields problem ([Illegal States Unrepresentable]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}}#a-flag-plus-an-optional-value)) in OO clothing, and his fix, one subclass per kind, is the hierarchy as Java's substitute for a sum type: open where a sum is closed, and without exhaustiveness checking until Java 17's sealed interfaces.

Ghosh ([PDF](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), listing 2.2, roughly) uses a hierarchy differently, to restrict which accounts a function accepts:

```scala
sealed trait Account { def no: String }
trait InterestBearingAccount extends Account { def rateOfInterest: BigDecimal }

case class CheckingAccount(no: String) extends Account
case class SavingsAccount(no: String, rateOfInterest: BigDecimal) extends InterestBearingAccount

def calculateInterest[A <: InterestBearingAccount](account: A, period: DateRange): Try[BigDecimal] = ???
```


Account is now a polymorphic data type, and the function calculateInterest is said to be polymorphic on the Account type. You're using Scala's type system to encode your domain logic. This is only an example of how you can make your domain model richer and more succinct by adding the power of types. You gain expressivity, cut out the extra fat by delegating more tests to the compiler, and get rid of boilerplates in domain logic validation.

"Delegating tests to the compiler" here means that passing a `CheckingAccount` is a compile error, so there's no `if (!account.isInstanceOf[...])` check to write and no unit test for "rejects checking accounts". The limit of this encoding is that a subtype bound expresses one capability. Once accounts have several independent capabilities (interest-bearing, overdraft, multi-currency), the hierarchy runs into the same problem as in [Product types](#product-types), and type classes are the usual alternative.

## Library sources


- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional* -- chapter 2, "Fighting the Impulse to Do Class-Driven Design"; chapter 4, "Understanding Types", on composing types with AND and OR; on *Product types*, *Sum types* and *Sums versus hierarchies*
- Płachta 2022, *Grokking Functional Programming* -- chapter 7, "What about inheritance?": ADTs versus inheritance; on *Sums versus hierarchies*
- [Bloch 2018](/sources/99fe404f1fe77aab60731171df07c68f.bin), *Effective Java, 3rd Edition* -- Item 23, "Prefer class hierarchies to tagged classes"; on *Sums versus hierarchies*
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling* -- listing 2.2, `calculateInterest` with a subtype bound; on *Sums versus hierarchies*
- [Schwarz 2020](/sources/f1c14b872d21423c5ed67709396f62c6.bin), *Scala 3 by Example: ADTs for DDD, Part 1* -- domain modeling with product and sum types, following *Domain Modeling Made Functional* with the F# originals beside the Scala 3 code; on *Product types* and *Sum types*
- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles* -- chapter 11, "Algebraic datatypes": section 11.8, "What makes these datatypes algebraic?", on cardinality, 11.10, "Sum types", on sums adding, and 11.11, "Product types", on products multiplying, where cardinality "roughly equates to how difficult it is to reason about"; 11.11, "Record syntax", on field accessors being ordinary functions; 11.9 on `newtype`; on the counting paragraph under the title, *Product types* and *Sum types*
- [Milewski 2019](/sources/0e04926a1bcff6dccfd4b9a974acdff4.bin), *Category Theory for Programmers, Scala Edition* -- chapter 6, "Simple Algebraic Data Types", whose section 6.4 treats sums as addition and products as multiplication; on the counting paragraph under the title
- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 1, "The Algebra Behind Types": cardinality, with sums as addition, products as multiplication and functions as exponents; on the counting paragraph under the title
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell* -- chapter 4, "Creating New Types": "Dealing with Duplicate Record Fields" and "Naming Record Fields" (selectors are top-level functions, so two records can't share a field name; prefix with the type name or split into modules), and "Summing Records" (record fields on a sum type become partial selectors that throw at runtime, so give each constructor its own record); on *Sum types*

Further reading:

- [Serrano Mena 2022](/sources/5c1001bd2c4b75b2ff640e61358fc71a.bin), *Haskell: Almost Standard Libraries* -- chapter 10, "Optics", section 10.1, "Lenses, prisms, (affine) traversals, folds": `makeLenses` on underscore-prefixed fields, and a field present in only some constructors of `User = Person {...} | Entity {...}` becoming an affine traversal read with `preview`; on *Sum types*
