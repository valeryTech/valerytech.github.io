---
draft: false
toc: true
title: "Domain Modeling with Types"
description: "An overview of modeling a domain with types, following Wlaschin: where the notes on algebraic data types, newtypes, illegal states and workflows fit, plus values and entities, errors as values, and the same ideas across languages."
linkTitle: "Domain Types"
---

Domain modeling with types makes the model state which values can exist, so that invalid combinations can't be constructed. The notes in this folder follow the order of Wlaschin's *Domain Modeling Made Functional* ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), chapters 4 to 7):

- [Algebraic data types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}): product and sum types, counting a type's values, and sum types versus class hierarchies.
- [Newtypes and simple values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}): primitive obsession, newtypes, value classes and opaque types, and simple values whose constructors enforce a rule.
- [Making illegal states unrepresentable]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}}): business rules as choice types, booleans, a flag plus an optional value, and behaviour as data.
- [Workflows and states]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}): workflows as function types, one type per state, state machines and typestate.

This note covers what is left: values and entities, errors as values, and how the vocabulary translates between languages. What happens to these types at the edges of the system is in [Types At The Boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}), and how a typed domain is organised into modules and interpreters is in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}).

## Values and entities


DDD distinguishes **value objects**, which have no identity (two `Money(10, EUR)` values are interchangeable), from **entities**, which keep an identity while their attributes change (two accounts with the same balance are still two accounts). In types this shows up as a choice of equality. Wlaschin (chapter 5, "A Question of Identity") gives value objects structural equality, which F# provides by default, and entities equality by ID only. His preferred way to get the second is to forbid equality on the entity type altogether (F#'s `NoEquality`), so code has to compare IDs explicitly instead of relying on an overridden `equals`.

Two practical rules from the same section:

- **Put the ID inside each case of a choice type.** An `Invoice` that is `Unpaid of UnpaidInvoice | Paid of PaidInvoice` carries the `InvoiceId` in both case records, so you can handle a paid invoice on its own without carrying the outer wrapper around.
- **Make change visible in the signature.** With immutable entities, an update is a function that returns a new entity, `UpdateName = Person -> Name -> Person`, rather than a method that mutates and returns nothing. The signature says that a person changes.

Above single entities, Wlaschin (chapter 5, "Aggregates", and chapter 6, "Consistency") uses DDD's **aggregate**: a group of entities, such as an order and its lines, treated as one unit, with the order as its root. The aggregate is the boundary within which consistency is enforced and the unit of persistence and atomicity, so a rule spanning two aggregates (two accounts in a transfer) can't be enforced by one aggregate's types. That's a limit of the approach: types guarantee consistency within one value, and anything wider needs a transaction or eventual consistency. Wlaschin's answer for the transfer is to remodel rather than widen the transaction. The transfer has its own identity, so it becomes an entity of its own (`MoneyTransfer`), and an account's balance is computed from the transfers that reference it. A rule such as "never below zero" can then be shared between aggregates as a constrained type or a shared validation function (chapter 6, "Consistency Between Aggregates in the Same Context" and "Multiple Aggregates Acting on the Same Data"). Aggregates refer to each other by ID, not by containing each other.

The lifecycle of an entity, from creation through behaviours to persistence, is in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#entities-value-objects-and-composition).

## Errors as values


`Result` (or `Either`) types and exhaustiveness checking are in the benefits list in [Type Systems]({{< ref "type-driven-design/01-foundations/type-systems" >}}#benefits). The design question is which errors to put in them. Wlaschin (chapter 10, "Working with Domain Errors") divides errors into three kinds:

- **Domain errors**: expected outcomes that the business already has procedures for, such as an order with an invalid product code or one rejected by billing. These go in the type, as cases of a choice.
- **Panics**: errors that leave the system in an unknown state, such as running out of memory or dividing by zero because of a bug. These stay exceptions and are caught at the top level.
- **Infrastructure errors**: a network timeout or a failed authentication. They're expected in the architecture but aren't part of any business process, so they stay out of the domain model.

Modeling domain errors as a choice has a useful side effect: adding a case forces a conversation with the domain expert about what should happen, so the list grows as the design is understood rather than having to be complete up front.

Other languages draw the same line in their own terms. Bloch (Items 69-71) uses checked exceptions for conditions the caller can be expected to recover from and runtime exceptions for programming errors, and warns against using exceptions for ordinary control flow. ZIO's error channel separates typed errors from defects (see [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}#errors-and-dependencies-in-zios-type)). How errors travel through a pipeline of effectful steps is in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#failures-and-events).

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
- **Python** has `NewType`, frozen dataclasses, `Enum` and `Literal`, all checked only by an external type checker ([Dimensions Of Type Systems]({{< ref "type-driven-design/01-foundations/dimensions-of-type-systems" >}}#static-dynamic-and-gradual-checking)).

## Library sources


- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- the book the domain-modeling notes follow. Here: chapter 5, "A Question of Identity" (value objects and entities) and "Aggregates"; chapter 6, "Consistency" (within and between aggregates and contexts); chapter 10, "Working with Domain Errors"; the F# side of the table in *The same ideas across languages* follows chapters 4 and 5
- [Bloch 2018](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), *Effective Java, 3rd Edition* -- Items 69-71 on exceptions; on *Errors as values*
- [Schwarz 2020](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc), *Scala 3 by Example: ADTs for DDD, Part 1* -- domain modeling with product and sum types, following *Domain Modeling Made Functional* with the F# originals beside the Scala 3 code; on *The same ideas across languages*
- [Bodner 2024](/sources/programming/language-practice/bodner-2024-learning-go-2e.pdf.enc), *Learning Go, 2nd Edition* -- chapter 7 on `iota` enumerations and type switches; on *The same ideas across languages*

Further reading:

- [Percival et al. 2020](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), *Architecture Patterns with Python* -- chapter 1 on value objects and entities in Python
