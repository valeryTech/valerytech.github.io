---
draft: false
toc: true
title: "Functional Domain Modeling"
description: "A domain model built from pure functions over domain types, with side effects kept out of the domain logic and behavior described as algebras with separate interpreters."
linkTitle: "Functional Domain Modeling"
---

A domain model built from pure functions over domain types, with side effects kept out of the domain logic and behavior described as algebras with separate interpreters.

The excerpts are from Debasish Ghosh's *Functional and Reactive Domain Modeling* (Manning, 2017, [PDF](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc)), which builds a banking domain in Scala. The listing and figure numbers refer to that book.

The types themselves (sums, simple values, identity) are in [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}), and the states a workflow moves through in [Workflows And States]({{< ref "type-driven-design/workflows-and-states" >}}). The ways of supplying interpreters and effects to an algebra (Reader, tagless final, free monads, ZIO, algebraic effects) are in [Effects And Interpreters]({{< ref "type-driven-design/effects-and-interpreters" >}}).

## Ghosh's design principles


Ghosh ends the book (section 10.2, "Rehashing core principles for functional domain modeling") with seven principles, which work as a map of this note:

1. **Think in expressions.** Build behaviour from expressions that compose, not from statements that mutate.
2. **Abstract early, evaluate late.** Describe the computation first and run it at the edge.
3. **Use the least powerful abstraction that fits.** A more powerful abstraction is more specialized and so reusable in fewer places: monads are more powerful than applicatives, so prefer applicatives where they're enough.
4. **Publish what to do, hide how to do it within combinators.** The API states the domain operations; the combinators decide how they're carried out.
5. **Decouple the algebra from its implementation**, with modules, type classes or free monads.
6. **Isolate bounded contexts.**
7. **Prefer futures to actors**, because futures compose and actors don't.

The sections below follow roughly the same order.

## Entities, value objects and composition


Every object (entity or **value** object) that you have in any model must have a definite lifecycle pattern.

In DDD terms the lifecycle has three stages: creation (factories), participation in behaviors (an aggregate changing state), and persistence and retrieval (repositories). In a functional model each stage is a function. Creation is a function from raw inputs to a valid object or an error, a behavior is a function from an object to a new object, and persistence is an effect kept at the edge (next section). Entities differ from value objects only in having an identity that survives those changes; see [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#values-and-entities).

You need to apply proper software engineering principles when designing any creational pattern for your domain model.

Concretely, in a functional model the creational pattern is a smart constructor: one entry point that validates, with the case class constructor itself made private, and errors returned as values (`Either`, `Try`) instead of thrown. When the fields are independent, the errors should accumulate, so that a form with three bad fields reports all three (see *Composing effectful operations* below). This is [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) applied to entities.

This is the first step toward appreciating the fact that functional programming is based on function composition, which in turn is similar to the way we treat functions in mathematics. This is known as the **compositionality property** of functional programs.

Compositionality means you can understand the whole from its parts and the way they're combined: if `f` and `g` are pure, `f andThen g` holds no surprises that aren't already in `f` or `g`. An analogy is LEGO bricks versus a glued model: bricks can be recombined because each one's behavior doesn't depend on what it's attached to. Hidden state and side effects are the glue.

## Keep effects out of the domain


The entanglement in question is domain rules and side effects in one function. In the book's example (listing 1.9), `openCheckingAccount` first calls `Verifications.verifyRecord`, an identity check that may go through an external web service and throws if it fails, and only then builds the account. So the domain rule (what a valid new account is) can't be tested without that service, and a failure of an outside system surfaces as an exception in the middle of domain logic.

You need to refactor to avoid this entanglement, and you need to ensure that side effects are decoupled from the domain logic.

Managing side effects is an area that can make a big difference between compositional domain models and noncompositional ones. A model that's not compositional often suffers from the baggage of boilerplates and glue code. It becomes a maintenance nightmare -- difficult to manage and extend. But after you've isolated side effects from pure logic, you can write code that offers better compositionality. In our example, openCheckingAccount is once again pure logic.

After the refactoring, verification is its own function, `verifyCustomer`, which returns its result as a value, and `openCheckingAccount` only builds the account. The two are glued with `verifyCustomer(cust).map(c => openCheckingAccount(c, date))`. Gary Bernhardt's name for this shape is "functional core, imperative shell".

You can manage exceptions and latency as effects that compose along with the other pure abstractions of your domain model.

That works by putting the effect in the return type. A function that may fail returns `Try[Account]` or `Either[AccountError, Account]` instead of throwing, and a function that takes time returns `Future[Account]` or `IO[Account]` instead of blocking. The signature now says "this can fail" or "this is slow", and `flatMap` chains these values just like ordinary ones.

The catch is stacking: `Future[Either[AccountError, Account]]` composes clumsily, which is the problem that monad transformers, ZIO's `ZIO[R, E, A]` and tagless final each try to solve ([Effects And Interpreters]({{< ref "type-driven-design/effects-and-interpreters" >}})).

The object-oriented architecture literature reaches the same shape from a different direction:

- **Dependency inversion.** Percival and Gregory ([PDF](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), chapter 2) argue that hexagonal architecture, ports and adapters, onion architecture and clean architecture are different names for the same thing, and that they all come down to the dependency inversion principle: the domain defines the interfaces it needs, and infrastructure implements them. A port is an algebra and an adapter is an interpreter.
- **The dependency rule.** Martin ([PDF](/sources/software-engineering/architecture/martin-2018-clean-architecture.pdf.enc), chapter 22, "The Clean Architecture") states the Dependency Rule as source-code dependencies pointing only inwards, towards the policies. His Humble Object pattern (chapter 23) is the imperative shell: a thin, hard-to-test part that does I/O, next to a testable part that holds the logic.
- **A pure domain layer.** Granin ([PDF](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), section 2.2.1, "Architecture layers") makes the domain layer pure and the impure layer as small as possible, in the same spirit.

Which dependencies count as effects? Seemann's test for a *volatile dependency* ([PDF](/sources/software-engineering/craft/seemann-2019-dependency-injection-principles-practices-patterns.pdf.enc), section 1.3.2) is a good one, though it was written for object-oriented DI: a dependency is volatile if it needs a runtime environment set up (a database, a message queue, a web service, the file system), if it doesn't exist yet or is still being developed, if it isn't installed on every developer's machine, or if it's nondeterministic (the clock, random numbers). Those are the things to push to the edge. Seemann himself notes that DI as he describes it may not be the best solution in functional languages, where passing functions and returning decisions as data often replace it.

## Modules as algebras


A *module*, as defined in a functional domain model, is a collection of functions that operate on a set of types and honor a set of invariants known as domain rules. In mathematical terms, this is known as the algebra of the module. Note that we haven't yet talked about the implementation, which is not part of the algebra. It's the contract the behaviors publish that forms the algebra of the API. Implementation comes later in the lifecycle and takes the form of an interpreter of your algebra.

In mathematics an algebra is a set of types, operations on them, and laws the operations obey: integers with `+` and `0`, where `x + 0 = x` and `+` is associative. The analogy is the rules of chess versus a chess set. The rules (the algebra) say which moves are legal; a wooden set, a screen or a correspondence game by post (interpreters) are different ways of carrying them out. Critique: in most codebases the laws are never written down, and then "algebra" just means "interface". The laws are what make the word worth using.

Ghosh does write them down, later in the book. Section 9.4 ("Revisiting the algebra of your model") restates the algebra as three parts: the types that model entities and value objects, the functions over them grouped into modules, and the laws, which are the business rules. Section 9.5 then turns the laws into property-based tests with ScalaCheck, so they're checked against generated data rather than documented. That's the answer to the critique above: an algebra whose laws are tested is more than an interface.

Remember, when you defined the APIs, you pulled some types out of thin air (for example, Amount, Account, Balance) and **parameterized AccountService on them** in listing 3.1.

The shape of that listing:

```scala
trait AccountService[Account, Amount, Balance] {
  def open(no: String, name: String, openDate: Option[Date]): Try[Account]
  def close(account: Account, closeDate: Option[Date]): Try[Account]
  def debit(account: Account, amount: Amount): Try[Account]
  def credit(account: Account, amount: Amount): Try[Account]
  def balance(account: Account): Try[Balance]
}
```


Here `Account`, `Amount` and `Balance` are type parameters, not concrete classes. The service doesn't commit to what an account is, so the API can be designed, reasoned about and even tested against laws (crediting and then debiting the same amount leaves the balance unchanged) before any representation exists. It's an interface that abstracts over the data as well as the implementation, like writing a board game's rules before choosing the pieces.

The cost is noise: three type parameters on every use. Scala's abstract type members are the alternative (see [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#abstract-types-and-type-members)).

Why abstract the types at all? Ghosh's "ladder of goodness" (section 4.3, figure 4.4) gives the argument in steps: pure functions let you compose freely; adding static types gives you algebraic abstractions, functions over types that obey laws; making the functions generic over types gives parametricity; and if you don't leak implementation details (specialized types, exceptions), parametricity gives you *free theorems*, properties that hold for every implementation because of the type alone (Wadler's "Theorems for Free"). A function `def f[A](xs: List[A]): List[A]` can only rearrange, drop or duplicate elements, because it knows nothing else about `A`. The more generic the signature, the fewer implementations it has, and the fewer tests it needs (section 9.2.3).

Ghosh's chapter 4 ("Functional patterns for domain models") applies the same idea to design patterns. An object-oriented pattern is a recipe you re-implement each time. A functional pattern is a generic algebra with laws, written once, plus an interpreter for each context: a `Monoid` (an associative `op` with an identity `zero`) is defined once, and `Money` becomes a monoid by interpreting `zero` and `op` for money, which immediately gives you summing over any collection of amounts.

## Composing effectful operations


Figure 3.2 illustrates the *monadic model of computation*, which you'll use to chain the methods of AccountService in case of sequenced operation invocation. The return type of each of the service functions needs **to support this monadic model**. This is the strategy that you'll adopt for *composing your algebras*.

In code, the monadic model is the for-comprehension:

```scala
for {
  a <- open("a-123", "Alice", None)
  b <- credit(a, 1000)
  c <- debit(b, 200)
} yield c
```


Each step returns `Try[Account]`. `flatMap` hands each result to the next step and stops at the first failure, so the caller writes no error checks between the steps. "Supporting the monadic model" means the return type has `flatMap` and a way to wrap a plain value (`pure`). Think of an assembly line where any station can pull the cord: the stations don't check whether earlier ones succeeded, because the line stops by itself.

Stopping at the first failure is right for a sequence where each step needs the previous result. It's wrong for checks that are independent of each other, such as validating the fields of a form. Ghosh (sections 4.2.2 and 4.2.3) contrasts the two:

- **Applicative composition** runs every check and collects all the failures, because no check depends on another's result. This is what cats' `Validated` does.
- **Monadic composition** stops at the first failure, because each step may depend on the one before.

His principle of least power (above) says to use the applicative form whenever the checks are independent: it's less powerful, so it fits more situations, and it reports more.

Section 4.4 shows a third form, composing whole operations as **Kleisli arrows**, functions `A => F[B]` for some effect `F`. Once each step of a trading workflow has that shape, the workflow reads like the business description:

```scala
clientOrders andThen execute andThen allocate
```


where each arrow takes the previous step's result and runs in the same effect. The types do the gluing: if one step's output doesn't match the next step's input, the composition doesn't compile.

## Failures and events


The solution lies in the design of the failure-handling module itself. It's not that you must have one single module for failure handling in the whole of your application. The idea is to have centralized handlers.

Centralized handling follows from failures being values. A failure travels through the chain as a `Left` or `Failure` and is handled in one place, usually at the edge, where for example the HTTP layer maps domain errors to status codes. That works best when the errors are an ADT (`InsufficientFunds`, `AccountClosed`, ...) rather than strings or exceptions, so the handler can match on them exhaustively. Critique: a handler far from the failure only knows what the error value tells it, so a vague error type loses context. Make the errors specific enough to act on. Which errors belong in the type at all is in [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#errors-as-values).

The next section covers how domain events can form one of the first class constructs of composing behaviors within your reactive model.

A domain event is an immutable record of something that happened, named in the past tense: `AccountOpened`, `MoneyDebited`. Because events are ordinary values, they can be stored (event sourcing), replayed to rebuild state, and sent to other parts of the system, which react without the sender knowing who they are.

*Event-based modeling complements the functional model* -- Event-based programming delineates the "what" from the "how" of your model. And this is also what functional programming encourages. Events are small messages that specify what you want to do, and the handler for the event describes the "how" part. No wonder functional programming and event-driven programming play well together.

Strictly, a message that says what you *want* done is a command (`OpenAccount`); an event says what *has* happened (`AccountOpened`). The sentence above, from chapter 1, blurs the two, but the split matters in practice: a command can be rejected, while an event is a fact that handlers can only react to. Ghosh makes the split himself in chapter 8 (section 8.3.1, "Commands and events in an event-sourced domain model"): a command builds or updates an aggregate, runs the domain validations and any side effects, and, if all goes well, produces an event that's appended to the event log, the source of truth. Section 8.4.2 then models commands as free monads over events, so that a command is a description of which events it would produce, and the interpreter (section 8.4.3, "Interpreters--hideouts for all the interesting stuff") is where persistence and other effects happen. Free monads are covered in [Effects And Interpreters]({{< ref "type-driven-design/effects-and-interpreters" >}}#free-monads).

The two principal traits that describe our modeling paradigm are functional and reactive.

Functional covers everything above: pure domain logic, effects as values, algebraic APIs. Reactive refers to the Reactive Manifesto (2014): responsive, resilient, elastic and message-driven. In practice that means non-blocking calls, streams and actors (Akka, in the book). The two pull in different directions, since actors are stateful and side-effecting. Ghosh's reconciliation treats the two differently:

- **Streams can be part of the model.** Section 6.4.2 ("A graph as a domain pipeline") models a sequence of domain behaviours as a stream graph, describing it separately from running it, so the pipeline itself is a typed domain value.
- **Actors stay out of the API.** Akka actors receive messages of any type and return nothing, so they don't compose and can't be reasoned about like functions. Ghosh keeps them for specific jobs, such as guarding mutable state that needs mutual exclusion, and his last principle is to reach for futures first.

## Modules and bounded contexts


Ghosh's chapter 5 ("Modularization of domain models") groups algebras into modules and modules into bounded contexts (section 5.4, "Aggregate modules at bounded context"). Each bounded context has its own model, and contexts talk to each other through messages or an anticorruption layer that translates one model into another, never by sharing domain objects. The same chapter shows how a module's dependencies, such as an account repository, are supplied: as a Kleisli arrow that reads the repository from its environment (section 5.2.1), or through a free monad interpreted later (section 5.5); see [Effects And Interpreters]({{< ref "type-driven-design/effects-and-interpreters" >}}#reader-and-kleisli).

What a bounded context's boundary looks like in types (DTOs, trust boundaries, evolution) is in [Types At The Boundary]({{< ref "type-driven-design/types-at-the-boundary" >}}).

## Library sources


- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling* -- the source of the excerpts: lifecycle patterns and the `openCheckingAccount` example (chapter 1), `AccountService` (listing 3.1) and the monadic model of computation; chapter 4 on functional patterns, applicative and monadic effects, the ladder of goodness and Kleisli composition; chapter 5 on modules and bounded contexts; chapter 6 on streams and actors; chapter 8 on commands, events and event sourcing; sections 9.4-9.5 on laws as properties; section 10.2 on principles; on every section
- [Percival et al. 2020](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), *Architecture Patterns with Python* -- the dependency inversion principle and ports and adapters (chapter 2), and chapters 8 and 10 on events and on commands with command handlers; on *Keep effects out of the domain* and *Failures and events*
- [Martin 2018](/sources/software-engineering/architecture/martin-2018-clean-architecture.pdf.enc), *Clean Architecture* -- chapter 22, "The Clean Architecture" (the Dependency Rule), and chapter 23, "Presenters and Humble Objects"; on *Keep effects out of the domain*
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture* -- section 2.2.1, architecture layers with a pure domain layer; on *Keep effects out of the domain*
- [Seemann et al. 2019](/sources/software-engineering/craft/seemann-2019-dependency-injection-principles-practices-patterns.pdf.enc), *Dependency Injection: Principles, Practices, and Patterns* -- section 1.3.2, "Volatile Dependencies"; on *Keep effects out of the domain*
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala, 2nd Edition* -- section 7.3, "The algebra of an API", and section 9.1, "Designing an algebra first": an algebra as functions over types plus laws; on *Modules as algebras*
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters* -- modularity through higher-order functions and lazy evaluation as the "glue" of functional programs; on the compositionality paragraph in *Entities, value objects and composition*
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects* -- the effect pattern and Cats Effect `IO`; on *Keep effects out of the domain*
- [Schwarz 2019](/sources/programming/scala/schwarz-2019-monads-do-not-compose.pdf.enc), *Monads do not Compose* -- slides showing that functors and applicatives compose generically but monads don't, which is why transformers exist; on the stacking point in *Keep effects out of the domain*
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats* -- chapter 10's data-validation case study and chapter 5 on monad transformers; on the applicative point in *Composing effectful operations* and the stacking point in *Keep effects out of the domain*
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc), *Kleisli composition, flatMap, join, map, unit* -- slides on Kleisli composition and how it relates to `flatMap`; on *Composing effectful operations*

Further reading:

- [Schwarz 2023](/sources/programming/scala/schwarz-2023-sighting-of-cats-traverse-in-practical-fp.pdf.enc), *A sighting of traverse_ in Practical FP in Scala*
- [Richardson 2019](/sources/system-design/microservices/richardson-2019-microservices-patterns.pdf.enc), *Microservices Patterns: With Examples in Java*
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture: Powered by Scala 3*
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads, 2nd Edition*
