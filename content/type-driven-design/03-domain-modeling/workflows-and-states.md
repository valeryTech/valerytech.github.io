---
draft: false
toc: true
title: "Workflows and States"
description: "Modeling a value that moves through states: a workflow as a function type, one type per state, state machines, and typestate encodings that put the state in a type parameter."
linkTitle: "Workflows and States"
---

The hub's core example is a value moving through states, `DraftOrder -> SubmittedOrder -> PaidOrder`, with the type recording what has already happened. This note is about modeling that movement: a workflow as a function type, one type per state, state machines, and typestate encodings that put the state in a type parameter. The values themselves are modeled as in [Domain Modeling With Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}).

## Workflows as functions


Wlaschin ([PDF](/sources/3165b993e939de6a47737a073d7633a4.bin), chapter 5, "Modeling Workflows with Functions") writes a whole business process as one function type before writing any code:

```fsharp
type PlaceOrder = UnvalidatedOrder -> Result<PlaceOrderEvents, PlaceOrderError>
```


The shape of the signature follows from the domain:

- **The input** is a command or the data that arrived with it (`UnvalidatedOrder`).
- **Several outputs that all happen** form a record: placing an order produces an acknowledgment *and* an order-placed event *and* a billing event, so `PlaceOrderEvents` is a record of the three.
- **Alternative outcomes** form a choice: a quote and an order go down different paths, so the output is one or the other.
- **Effects are part of the signature.** A step that can fail returns a `Result`; a step that does I/O is wrapped in `Async`. Wlaschin uses them to document effects, so a reader can see from the type alone which steps touch the outside world.

Chapter 7 ("Modeling Workflows as Pipelines") breaks the workflow into steps, each a function from one state of the order to the next:

```text
UnvalidatedOrder ──validate──▶ ValidatedOrder ──price──▶ PricedOrder ──acknowledge──▶ events
```


Each step's dependencies (a function that checks whether a product code exists, a function that looks up prices) are ordinary parameters. Wlaschin's guideline is to hide those dependencies in the public API, where callers shouldn't need to know about them, and to keep them explicit in internal functions, where they show what a step relies on. Supplying them is a question of wiring, covered in [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}).

The pipeline is the hub's "weaker type to stronger type" idea at the scale of a business process: each arrow can fail or succeed, and success produces a type that records one more established fact.

## One type per state


The naive way to model an order that moves through states is one record with flags (Wlaschin, chapter 7, "Modeling an Order as a Set of States"):

```fsharp
type Order = {
  OrderId : OrderId
  IsValidated : bool             // set when validated
  IsPriced : bool                // set when priced
  AmountToBill : decimal option  // also set when priced
  }
```


Wlaschin lists what's wrong with it:

- the states exist but are implicit, so handling them takes conditional code everywhere;
- some data belongs to one state only, so it has to be optional in all of them (`AmountToBill` exists only once the order is priced);
- nothing ties fields to flags: `AmountToBill` should be set whenever `IsPriced` is, but only a comment says so.

The fix is a type per state, `UnvalidatedOrder`, `ValidatedOrder` and `PricedOrder`, each with exactly the fields that state has, plus a top-level choice when something needs to hold an order in any state. It's the flag-plus-optional-value fix from [Illegal States Unrepresentable]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}}#a-flag-plus-an-optional-value) applied to a whole entity. A side benefit is that a new state can be added without breaking code that works with the existing ones: adding `RefundedOrder` touches only the code that deals with refunds.

### State machines


The same section generalizes this to state machines. A shopping cart is empty, active (with unpaid items) or paid, each case carries its own data, and each transition is a function that accepts only the states it applies to:

```fsharp
type ShoppingCart =
  | EmptyCart                     // no data
  | ActiveCart of ActiveCartData  // UnpaidItems
  | PaidCart of PaidCartData      // PaidItems, Payment
```


Wlaschin's reasons for using state machines ("Why Use State Machines?"):

- **Each state can allow different behaviour.** Only an active cart can be paid for; a paid cart can't be added to. With a type per state, those rules are function signatures.
- **All the states are written down.** Implicit states, such as an empty cart behaving differently from an active one, are rarely documented otherwise.
- **It forces you to consider every case.** What should happen if you verify an already verified email, remove an item from an empty cart, or deliver a package that's already delivered? A match over the states makes each question unavoidable.

The analogy is a form that changes as it's processed. A visa application is a draft until submitted, then pending until a decision, then approved or refused; a clerk can stamp only a pending one, and an approved one gets a visa number that a draft doesn't have. A record with an `isApproved` flag and an optional visa number is one form with every box printed on it; a type per state is a different form for each stage.

### State machines as values


Volpe ([PDF](/sources/42ef10a33c54df6756cd49d40ee34101.bin), section 5.1, "Finite state machines") represents a state machine as a function from the current state and an input to the next state and an output:

```scala
case class FSM[F[_], S, I, O](run: (S, I) => F[(S, O)])
```


`F` is the context the transition runs in. When a transition needs nothing, `F` is `cats.Id` and the machine is a pure function, which makes it easy to test with recorded inputs. Volpe uses this shape for the trading engine in the rest of the book.

## Typestate with phantom types


When the states share all their data and differ only in what's allowed next, a type per state duplicates fields. The alternative is one type with a **phantom type parameter**: a type parameter that appears in the type but not in the data, used only to mark the state. This encoding is usually called *typestate*.

Ghosh ([PDF](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), section 4.5.2, "Making illegal states unrepresentable", listing 4.13) models a loan application this way:

```scala
case class LoanApplication[Status] private[Loans](/* the same fields in every state */)

trait Applied
trait Approved
trait Enriched

type LoanApplied  = LoanApplication[Applied]
type LoanApproved = LoanApplication[Approved]
type LoanEnriched = LoanApplication[Enriched]

def approve: Kleisli[Option, LoanApplied, LoanApproved]
def enrich:  Kleisli[Option, LoanApproved, LoanEnriched]
```


`Applied`, `Approved` and `Enriched` have no values; they exist only so that `enrich` can demand an approved loan. Composing the steps in the wrong order, `enrich andThen approve`, doesn't compile. The private constructor matters as much as the phantom type: without it, anyone could build a `LoanApplication[Approved]` directly.

Two more examples from the library:

- **Wampler** ([PDF](/sources/15972064071d3223586f8945de281cea.bin), chapter 16, "Phantom Types") computes a payroll in steps, with `Pay[S <: Step]` marking the stage reached (`PreTaxDeductions`, `PostTaxDeductions`, `Final`). US payroll has to subtract pre-tax deductions before calculating tax and post-tax deductions after it, and the phantom parameter makes the compiler enforce that order.
- **Bragilevsky** ([PDF](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), sections 13.2.3-13.2.4) builds a safe interface for an elevator in Haskell, where the door state and the floor are tracked in types (using singletons, see [Dependent Types]({{< ref "type-driven-design/05-stronger-type-systems/dependent-types" >}})) so that the door can't be opened unless the elevator is level with a floor.

Typestate works best for short, local protocols (building a request, a payroll calculation, a file handle that must be opened before it's read) where the value stays in one variable. It works badly when the state comes from outside: a loan read from the database has a status column, not a static type, so it has to be parsed into one of the typed states first ([Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}})). It also can't stop you from using an old value after a transition, since nothing deletes the `LoanApplied` you already hold; preventing that needs linear or affine types, as in Rust, where a transition can consume its input.

## Long-running workflows


A pipeline that finishes in seconds can run in memory. When a step waits on a person or another department (validation done by hand, pricing by a different team), Wlaschin (chapter 7, "Long-Running Workflows") splits the workflow: save the state to storage, wait for a message saying the step has finished, reload the state and continue. Each saved state is then one of the per-state types, persisted and read back, which brings the database boundary into the middle of the workflow ([Types At The Boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}#the-database-is-a-boundary-too)). These workflows are sometimes called sagas.

Which messages start, advance and record a workflow (commands and events) is in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#failures-and-events).

## Type-first design


Moved from [Domain Modeling With Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}) on 2026-04-05.

The three Haskell tools for designing in types:

data

`data` declares a new algebraic type, with products and sums in one declaration: `data Shape = Circle Double | Rect Double Double`. This is where the domain's states get their names.

type synonyms

`type Name = String` gives an existing type a second name, and nothing more. The compiler treats `Name` and `String` as the same type, so a synonym documents intent but protects nothing: you can pass any `String` where a `Name` is expected. It's easy to mistake for safety. Use `newtype` when you want the compiler to keep the values apart. The same holds for `type` aliases in Scala, TypeScript and Rust.

type classes

A type class describes what a type can *do* (`Eq`, `Ord`, `Show`, `Num`), independently of what it *is*. Instances can be added after the fact, even for types you don't own, whereas a Java interface has to be declared on the class itself. An analogy: a class hierarchy is a family tree, where what you are depends on your ancestors; a type class is a driving licence, which anyone who passes the test can hold, whoever their parents are. It's the alternative to the hierarchical design in [Algebraic Data Types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}#product-types).

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


The type chain also shows where the plan is weak. `read :: String -> Int` is partial: it crashes on anything that isn't a number, so the filter in front of it has to be exactly right. A more honest step is `String -> Maybe Int`, which merges the filter and the conversion and is [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) in miniature:

```haskell
import Data.Maybe (mapMaybe)
import Text.Read (readMaybe)

sumNumbers :: String -> Int
sumNumbers = sum . mapMaybe readMaybe . words
```


And you're finished! By thinking about the types of transformations that you're going to make, you've been able to design your overall program much the same way you design a single function.

The more Haskell you learn, the more you'll find yourself programming in types first and then using functions to hash out the details.

This is the same method as Wlaschin's *Workflows as functions* above, at the scale of a single function: write the chain of types, then fill in each arrow.

## Library sources


- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional* -- chapter 5, "Modeling Workflows with Functions"; chapter 7, "Modeling Workflows as Pipelines": an order as a set of states, state machines and why to use them, dependencies in public and internal functions, long-running workflows; on *Workflows as functions*, *One type per state* and *Long-running workflows*
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling* -- section 4.5.2 and listing 4.13, the loan workflow with phantom types and Kleisli arrows; on *Typestate with phantom types*
- [Wampler 2021](/sources/15972064071d3223586f8945de281cea.bin), *Programming Scala, 3rd Edition* -- chapter 16, "Phantom Types", the payroll example; on *Typestate with phantom types*
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 13.2.3, "Dependent types and substituting them with singletons": door states as singletons, so that opening an open door doesn't compile; section 13.2.4, "Example: Safe interface for elevators": `up` and `down` need an `Elevator mx cur Closed`, and `open` needs the requested floor to be the current one; on *Typestate with phantom types*
- [Volpe 2023](/sources/42ef10a33c54df6756cd49d40ee34101.bin), *Functional Event-Driven Architecture: Powered by Scala 3* -- section 5.1, "Finite state machines"; on *State machines as values*
- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles* -- chapter 11, "Algebraic datatypes", section 11.9, "newtype", on `newtype` against type synonyms (a synonym is the same type and can't have its own instances); chapter 6, "Typeclasses", on typeclasses as what a type can do, with dispatch by type in section 6.12, "Instances are dispatched by type"; on *Type-first design*
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell* -- chapter 5, section "Choosing What to Export", subsection "Phantom Types and Export Lists": `User isAuthenticated` with empty, unexported `Authenticated` and `Unauthenticated` types; `authenticate :: User Unauthenticated -> String -> Maybe (User Authenticated)` is the only transition, and `getUserEmailAddress` accepts only an authenticated user; on *Typestate with phantom types*
- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 14, "Indexed Monads": an indexed monad `m i j a` carries a pre- and a post-condition, and section 14.2, "Linear Allocations", tracks open file handles at the type level so that each must be closed exactly once, with the ST trick keeping handles from leaking; on *Typestate with phantom types*

Further reading:

- [Noonan 2018](/sources/82bc6785596e6b9c5b3e2d9a2b2e9c58.bin), *Ghosts of Departed Proofs (Functional Pearl)* -- sections 2.2, "Implementing a Safe API for Sorting and Merging", and 2.4, "Aside: On the Danger of Naming a Ghost": a phantom-typed newtype (`SortedBy comp`) with a hidden constructor, so only the library can produce the tagged value; the same pattern as the loan states, carrying a fact instead of a state; on *Typestate with phantom types*
- Płachta 2022, *Grokking Functional Programming*
