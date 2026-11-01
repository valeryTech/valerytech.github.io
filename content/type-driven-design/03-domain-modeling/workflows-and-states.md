---
draft: false
toc: true
title: "Workflows and States"
description: "Modeling a value that moves through states: a workflow as a function type, one type per state, state machines, typestate encodings with phantom types, and long-running workflows."
linkTitle: "Workflows and States"
---

The hub's core example is a value moving through states, `DraftOrder -> SubmittedOrder -> PaidOrder`, with the type recording what has already happened. This note is about modeling that movement: a workflow as a function type, one type per state, state machines, typestate encodings that put the state in a type parameter, and long-running workflows that cross persistence boundaries. The values themselves are modeled as in [Domain Modeling With Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}).

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

The pipeline is the hub's "weaker type to stronger type" idea at the scale of a business process (and the macro-scale counterpart of [Domain Modeling With Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}#type-first-design)): each arrow can fail or succeed, and success produces a type that records one more established fact.

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

Object-oriented DDD reaches the same design against the Gang of Four State pattern. Millett and Tune ([PDF](/sources/9d5539a5016c513dd6cba96230483320.bin), chapter 16, "Avoid the State Pattern; Use Explicit Modeling", listings 16-18 and 16-19) show an `OnlineTakeawayOrder` that delegates `Cook`, `TakeOutOfOven`, `Package` and `Deliver` to an `IOnlineTakeawayOrderState` interface: `InKitchenQueue` implements `Cook` and throws `ActionNotPermittedInThisState` from the other three. Replacing the single entity and state interface with explicit classes per state (`InKitchenOnlineTakeawayOrder.Cook()` returning `InOvenOnlineTakeawayOrder`, which alone defines `TakeOutOfOven()`) drops the unimplemented methods and moves the lifecycle rules into the type checker.

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

Khononov ([PDF](/sources/deaedd205f4448340ac88de7be2f3116.bin), chapter 9, "Saga" and "Process Manager") notes that "long-running" here means *multi-transaction* rather than slow (since each aggregate commits on its own), and separates two patterns that Wlaschin's sketch covers together: a **saga** is a linear reaction chain that maps domain events to commands and runs compensating actions when a step fails, whereas a **process manager** (Hohpe and Woolf) is an explicitly instantiated central unit with its own persisted state -- often an aggregate itself (`BookingProcessManager`) -- used when choosing the next step takes `if-else` business logic. Ford, Richards, Sadalage and Dehghani ([PDF](/sources/08f60e529d971e5ad6408c46accea44c.bin), chapter 11, "Managing Distributed Workflows", and chapter 12, "Transactional Sagas") draw the same line as **orchestration** (a mediator that owns workflow state and recovery) versus **choreography** (services reacting to events with no central state owner, simpler on the happy path but adding cross-service links on every compensation path).

Without distributed transactions and under at-least-once, out-of-order message delivery, Helland ([PDF](/sources/6ae2299d96866be308e4ac412117c114.bin), sections 5 and 6) points out that each participating entity also runs a fine-grained state machine of its own: per-partner *activities* that record processed messages for idempotence and manage uncertainty across entities through tentative, confirming and cancelling operations (such as reserving stock before payment settles). Vernon ([PDF](/sources/b38f90837dd74283bea4b629417e8718.bin), chapter 5, "Rule 4", and chapter 6) adds that steps are also triggered by time-based domain events (`FiscalYearEnded`, `MarketsClosed`), which record an elapsed deadline as a fact rather than a rejectable command. Which messages start, advance and record a workflow (commands and events) is in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#failures-and-events).

## Library sources


- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional* -- chapter 5, "Modeling Workflows with Functions"; chapter 7, "Modeling Workflows as Pipelines": an order as a set of states, state machines and why to use them, dependencies in public and internal functions, long-running workflows; on *Workflows as functions*, *One type per state* and *Long-running workflows*
- [Millett et al. 2015](/sources/9d5539a5016c513dd6cba96230483320.bin), *Patterns, Principles, and Practices of Domain-Driven Design* -- chapter 16, "Avoid the State Pattern; Use Explicit Modeling" (listings 16-18 and 16-19): replacing `IOnlineTakeawayOrderState` and `ActionNotPermittedInThisState` exceptions with separate classes per state (`InKitchenOnlineTakeawayOrder`, `InOvenOnlineTakeawayOrder`); on *One type per state*
- [Khononov 2021](/sources/deaedd205f4448340ac88de7be2f3116.bin), *Learning Domain-Driven Design* -- chapter 9, "Saga" and "Process Manager": multi-transaction workflows, linear event-to-command sagas with compensating actions versus explicitly instantiated stateful process managers (`BookingProcessManager`); on *Long-running workflows*
- [Ford et al. 2022](/sources/08f60e529d971e5ad6408c46accea44c.bin), *Software Architecture: The Hard Parts* -- chapter 11, "Managing Distributed Workflows", on orchestration versus choreography and where workflow state and error links live, and chapter 12, "Transactional Sagas", classifying sagas across communication, consistency and coordination; on *Long-running workflows*
- [Helland 2007](/sources/6ae2299d96866be308e4ac412117c114.bin), *Life Beyond Distributed Transactions: An Apostate's Opinion* -- sections 5 and 6: per-partner *activities* inside entities for idempotent message handling and fine-grained workflows using tentative, confirming and cancelling operations; on *Long-running workflows*
- [Vernon 2016](/sources/b38f90837dd74283bea4b629417e8718.bin), *Domain-Driven Design Distilled* -- chapter 5, "Rule 4: Update Other Aggregates Using Eventual Consistency", and chapter 6, "Designing, Implementing, and Using Domain Events", including time-triggered domain events (`FiscalYearEnded`, `MarketsClosed`); on *Long-running workflows*
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling* -- section 4.5.2 and listing 4.13, the loan workflow with phantom types and Kleisli arrows; on *Typestate with phantom types*
- [Wampler 2021](/sources/15972064071d3223586f8945de281cea.bin), *Programming Scala, 3rd Edition* -- chapter 16, "Phantom Types", the payroll example; on *Typestate with phantom types*
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 13.2.3, "Dependent types and substituting them with singletons": door states as singletons, so that opening an open door doesn't compile; section 13.2.4, "Example: Safe interface for elevators": `up` and `down` need an `Elevator mx cur Closed`, and `open` needs the requested floor to be the current one; on *Typestate with phantom types*
- [Volpe 2023](/sources/42ef10a33c54df6756cd49d40ee34101.bin), *Functional Event-Driven Architecture: Powered by Scala 3* -- section 5.1, "Finite state machines"; on *State machines as values*
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell* -- chapter 5, section "Choosing What to Export", subsection "Phantom Types and Export Lists": `User isAuthenticated` with empty, unexported `Authenticated` and `Unauthenticated` types; `authenticate :: User Unauthenticated -> String -> Maybe (User Authenticated)` is the only transition, and `getUserEmailAddress` accepts only an authenticated user; on *Typestate with phantom types*
- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types: Type-Level Programming in Haskell* -- chapter 14, "Indexed Monads": an indexed monad `m i j a` carries a pre- and a post-condition, and section 14.2, "Linear Allocations", tracks open file handles at the type level so that each must be closed exactly once, with the ST trick keeping handles from leaking; on *Typestate with phantom types*

Further reading:

- [Noonan 2018](/sources/82bc6785596e6b9c5b3e2d9a2b2e9c58.bin), *Ghosts of Departed Proofs (Functional Pearl)* -- sections 2.2, "Implementing a Safe API for Sorting and Merging", and 2.4, "Aside: On the Danger of Naming a Ghost": a phantom-typed newtype (`SortedBy comp`) with a hidden constructor, so only the library can produce the tagged value; the same pattern as the loan states, carrying a fact instead of a state; on *Typestate with phantom types*
- Płachta 2022, *Grokking Functional Programming* -- chapter 11, "Designing functional programs", sections "Modeling using immutable values", "Data access modeling" and "Business logic as a pure function" (turning requirements into ADTs and `DataAccess` function signatures before implementing them); on *Workflows as functions*
- [Pilquist et al. 2023](/sources/075d81d6390bbb592aa1a8ba0a5f967d.bin), *Functional Programming in Scala, 2nd Edition* -- section 6.6, "Purely functional imperative programming" (exercise 6.11, modeling a candy-dispenser finite state machine with `Input` and `Machine` transitions composed over `State`); on *State machines as values*
