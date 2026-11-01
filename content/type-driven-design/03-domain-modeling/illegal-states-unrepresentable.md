---
draft: false
toc: true
title: "Making Illegal States Unrepresentable"
description: "Designing types so that a value breaking a business rule can't be built: verified emails, \\\"at least one of\\\", connascence of value, booleans, a flag plus an optional value, and behaviour as data."
linkTitle: "Illegal States"
---

The phrase is usually credited to Yaron Minsky's writing on OCaml at Jane Street (Ghosh's footnote to section 4.5.2 points to his "Effective ML Revisited" post), and both Ghosh and Wlaschin (chapter 6) use it as a heading. It names the technique behind most of the [domain-modeling notes]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}): design the types so that a value violating a business rule can't be constructed, instead of checking for it at run time.

Wlaschin's examples (chapter 6, "Capturing Business Rules in the Type System") are the standard ones:

- **A flag that guards an operation.** A customer record with an `EmailAddress` and an `IsVerified : bool` can be marked verified by any code that sets the flag. The rule "password resets go only to verified addresses" then lives in comments and code reviews. Model it as a choice instead, `Unverified of EmailAddress | Verified of VerifiedEmailAddress`, and give `VerifiedEmailAddress` a private constructor so that only the verification service can create one. The password-reset function takes a `VerifiedEmailAddress`, and the rule is enforced by the compiler.
- **"At least one of".** "A customer must have an email or a postal address" can't be modeled by two required fields (both would be required) or two optional ones (both could be missing). There are exactly three legal combinations, so the type is a three-case choice: `EmailOnly | AddrOnly | EmailAndAddr`.

Khononov's *connascence of value* is the coupling these designs remove. His example is a customer with two booleans, `isVerified` and `priorityShippingEnabled`, where priority shipping is allowed only for verified customers, so every method that changes one has to remember the other. Connascence of value is near the top of his scale, and it often can't be removed, only kept within one small piece of code; a type that makes the bad combination unrepresentable is the strongest way of keeping it there. In *Learning Domain-Driven Design* ([PDF](/sources/deaedd205f4448340ac88de7be2f3116.bin), chapter 6, "Managing Complexity"), he states the same reduction through Goldratt's *degrees of freedom*: a class with five independent integer fields has five degrees of freedom, whereas encapsulating invariants that determine three of them from the other two leaves only two.

Booleans in general deserve suspicion. Wlaschin (chapter 7) calls them generally a bad choice in a design and replaces a `bool` for "acknowledgment sent" with a two-case choice, `Sent | NotSent`, which is just as cheap and says what it means. Harper's name for the underlying problem is boolean blindness (see [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}#dont-throw-information-away)).

Two more rules come from Wlaschin's chapter 13 on evolving a design:

- **Store the input to a business rule, not its output.** When VIP customers get free shipping, don't add a "free shipping" flag to the order; record that the customer is a VIP and let the shipping rule work from that. Rules change; facts about the customer don't.
- **Keep independent statuses apart.** A VIP status and a loyalty-card status are separate small choice types, not one combined enumeration whose size multiplies with every new status.

## A flag plus an optional value


The excerpt below continues the `Artist` example from Płachta's *Grokking Functional Programming* (PDF, chapter 7, "Modeling possibility of absence in your data" and "Changes in the model force changes in the logic"):

> Any time you see more than one value representing a single logical business entity, make sure to stop and think how to model it better. As an example, we now have two parameters that together make up a single entity. This is a *very common pattern* in programming in general: a Boolean flag plus a parameter that is only applicable if the Boolean flag is true. I am sure you recognize this pattern. We will show you two ways of approaching this pattern using functional programming techniques: the Option type and algebraic data types.

**Changes in the model force changes in the logic.** When `isActive` and `yearsActiveEnd` become one value, every function that read the two fields stops compiling. That's the intended effect, not a nuisance: the compiler hands you the list of places where the old encoding's meaning was being reconstructed by hand, and each one now gets the meaning from a `match`. Compare renaming a column that untyped code reads, where you find the readers by grepping or in production. Parsons ([PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), chapter 10, "Type Safety Back and Forth", section 10.1, "The Ripple Effect") reports the same ripple in production when tightening `Order { items :: [Item] }` to `NonEmpty Item`: every `Maybe` that had been guarding against an empty order vanished from the interior logic, and the check landed at the only two boundaries where orders enter, JSON decoding (returning HTTP 400) and SQL `INNER JOIN` queries.

The cost is real too. A model change ripples through every consumer, so a model shared across teams or services needs the care of a public API: versioning, or a translation layer at the boundary (DDD's anti-corruption layer; see [Types At The Boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}#trust-boundaries)).

Płachta replaces the flag and the value in two steps. The first step folds the flag into an `Option`: `isActive` disappears because `end = None` now means "still active".

```scala
case class PeriodInYears(start: Int, end: Option[Int])
```


That's already better, since an active artist no longer has a meaningless end year -- and even `Option` alone separates allowed absence from a bug, as in Urma, Fusco and Mycroft's `Person -> Optional<Car> -> Optional<Insurance> -> String` chain ([PDF](/sources/58d1df2acb632c20f823cf03c6224a83.bin), chapter 11, section 11.2), where `Insurance.name` stays a plain `String` so a missing name isn't masked by defensive null checks. But `None` in `PeriodInYears` carries an implicit domain meaning that every reader has to know. The second step names both states:

```scala
enum YearsActive {
 case StillActive(since: Int)
 case ActiveBetween(start: Int, end: Int)
}
```


Each case holds only the fields that make sense for it, and code that uses it reads like the domain: `case StillActive(since) => since <= year`. A rule of thumb: `Option` is enough when absence is the whole story; when absence *means* something specific in the domain, give that meaning a name.

What the ADT still can't say is that `start <= end` in `ActiveBetween`. That needs a smart constructor (see [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}#smart-constructors-and-newtypes)) or a refinement type ([Refinement Types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}})).

## Behaviour as data


Płachta applies the same technique to the search function's parameters ("Modeling behaviors as data"). A search condition is one of three things, so it becomes a sum type:

```scala
enum SearchCondition {
  case SearchByGenre(genres: List[MusicGenre])
  case SearchByOrigin(locations: List[Location])
  case SearchByActiveYears(start: Int, end: Int)
}

def searchArtists(artists: List[Artist], requiredConditions: List[SearchCondition]): List[Artist]
```


The boolean flag, the pair of year parameters that only made sense together, and the convention that an empty list means "no filter" are all gone: a search uses exactly the conditions in the list. The requirement became data, and the function interprets it, which is the algebra-and-interpreter idea of [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#modules-as-algebras) in miniature.

## Library sources


- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional* -- chapter 6, "Capturing Business Rules in the Type System"; chapter 7, "Modeling Each Step in the Workflow with Types" (`Sent | NotSent` instead of a `bool`); chapter 13, "Change 2: Adding Support for VIP Customers" (store the input to a rule; separate `VipStatus` and loyalty-card choices); on the introduction, the booleans paragraph and the two chapter 13 rules
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling* -- section 4.5.2, "Making illegal states unrepresentable", and its footnote crediting Minsky
- [Khononov 2025](/sources/d01916d843bdf15a2ab54159c7c865bf.bin), *Balancing Coupling in Software Design* -- chapter 6, "Connascence": connascence of value and the two-booleans example; on the introduction
- [Khononov 2021](/sources/deaedd205f4448340ac88de7be2f3116.bin), *Learning Domain-Driven Design* -- chapter 6, "Managing Complexity": invariants cutting Goldratt's degrees of freedom from five independent fields (`ClassA`) to two (`ClassB`); on the introduction
- Płachta 2022, *Grokking Functional Programming* -- chapter 7, "Requirements as types": the `Artist` excerpts on modeling absence and "Changes in the model force changes in the logic", the `YearsActive` ADT, and `SearchCondition` in "Modeling behaviors as data"; on *A flag plus an optional value* and *Behaviour as data*
- [Parsons 2023](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), *Production Haskell* -- chapter 10, "Type Safety Back and Forth", section 10.1, "The Ripple Effect": tightening `Order { items :: [Item] }` to `NonEmpty Item` removes `Maybe` across the domain logic and pushes the empty-list check to JSON and SQL decoding; on *A flag plus an optional value*
- [Urma et al. 2018](/sources/58d1df2acb632c20f823cf03c6224a83.bin), *Modern Java in Action* -- chapter 11, section 11.2, "Introducing the Optional class": `Optional<Car>` and `Optional<Insurance>` alongside a required `String` name, separating planned absence from missing-data bugs; on *A flag plus an optional value*
- [Odersky et al. 2021](/sources/6d5d72f2cd796c67b467228f976d4a33.bin), *Programming in Scala, 5th Edition* -- chapter 19, enums as enumerated and algebraic data types in Scala 3; on *A flag plus an optional value*

Further reading:

- King 2019, *Parse, don't validate* -- "Parsing, not validating, in practice": choose a structure such as a `Map` that rules out duplicate keys, and avoid denormalized data whose copies can disagree; on the introduction and the connascence-of-value paragraph
- [Kurt 2018](/sources/3adb3487789446f9050e813826487b97.bin), *Get Programming with Haskell* -- lesson 16, section 16.2, listings 16.13-16.15: a sum `Name` with four constructors against a Java `Name` class of six mostly unused fields with no guarantee which combination is populated; on the introduction and *A flag plus an optional value*
