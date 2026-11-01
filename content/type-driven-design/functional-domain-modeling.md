---
draft: false
toc: true
title: "Functional Domain Modeling"
linkTitle: "Functional Domain Modeling"
---

A domain model built from pure functions over domain types, with side effects kept out of the domain logic and behavior described as algebras with separate interpreters.

The excerpts are from Debasish Ghosh's *Functional and Reactive Domain Modeling* (Manning, 2017, [PDF](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc)), which builds a banking domain in Scala. The listing and figure numbers refer to that book.

## Entities, value objects and composition


Every object (entity or **value** object) that you have in any model must have a definite lifecycle pattern.

In DDD terms the lifecycle has three stages: creation (factories), participation in behaviors (an aggregate changing state), and persistence and retrieval (repositories). In a functional model each stage is a function. Creation is a function from raw inputs to a valid object or an error, a behavior is a function from an object to a new object, and persistence is an effect kept at the edge (next section). Entities differ from value objects only in having an identity that survives those changes: two `Money(10, EUR)` values are interchangeable, two accounts with the same balance are not.

You need to apply proper software engineering principles when designing any creational pattern for your domain model.

Concretely, in a functional model the creational pattern is a smart constructor:

- one entry point that validates (the case class constructor itself is made private)
- errors returned as values (`Either`, `Try`) instead of thrown
- errors accumulated when the fields are independent (cats' `Validated`), so a form with three bad fields reports all three, not just the first

This is [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) applied to entities.

This is the first step toward appreciating the fact that functional programming is based on function composition, which in turn is similar to the way we treat functions in mathematics. This is known as the **compositionality property** of functional programs.

Compositionality means you can understand the whole from its parts and the way they're combined: if `f` and `g` are pure, `f andThen g` holds no surprises that aren't already in `f` or `g`. An analogy is LEGO bricks versus a glued model: bricks can be recombined because each one's behavior doesn't depend on what it's attached to. Hidden state and side effects are the glue.

## Keep effects out of the domain


The entanglement in question is domain rules and side effects in one function. In the book's example (listing 1.9), `openCheckingAccount` first calls `Verifications.verifyRecord`, an identity check that may go through an external web service and throws if it fails, and only then builds the account. So the domain rule (what a valid new account is) can't be tested without that service, and a failure of an outside system surfaces as an exception in the middle of domain logic.

You need to refactor to avoid this entanglement, and you need to ensure that side effects are decoupled from the domain logic.

Managing side effects is an area that can make a big difference between compositional domain models and noncompositional ones. A model that's not compositional often suffers from the baggage of boilerplates and glue code. It becomes a maintenance nightmare -- difficult to manage and extend. But after you've isolated side effects from pure logic, you can write code that offers better compositionality. In our example, openCheckingAccount is once again pure logic.

After the refactoring, verification is its own function, `verifyCustomer`, which returns its result as a value, and `openCheckingAccount` only builds the account. The two are glued with `verifyCustomer(cust).map(c => openCheckingAccount(c, date))`. Gary Bernhardt's name for this shape is "functional core, imperative shell".

You can manage exceptions and latency as effects that compose along with the other pure abstractions of your domain model.

That works by putting the effect in the return type. A function that may fail returns `Try[Account]` or `Either[AccountError, Account]` instead of throwing, and a function that takes time returns `Future[Account]` or `IO[Account]` instead of blocking. The signature now says "this can fail" or "this is slow", and `flatMap` chains these values just like ordinary ones.

The catch is stacking: `Future[Either[AccountError, Account]]` composes clumsily, which is the problem that monad transformers, ZIO's `ZIO[R, E, A]` and tagless final (below) each try to solve.

## Encoding domain logic in types


The example is the book's listing 2.2, roughly: an interest-bearing account is a subtype, and `calculateInterest` accepts only that subtype.

```scala
sealed trait Account { def no: String }
trait InterestBearingAccount extends Account { def rateOfInterest: BigDecimal }

case class CheckingAccount(no: String) extends Account
case class SavingsAccount(no: String, rateOfInterest: BigDecimal) extends InterestBearingAccount

def calculateInterest[A <: InterestBearingAccount](account: A, period: DateRange): Try[BigDecimal] = ???
```


Account is now a polymorphic data type, and the function calculateInterest is said to be polymorphic on the Account type. You're using Scala's type system to encode your domain logic. This is only an example of how you can make your domain model richer and more succinct by adding the power of types. You gain expressivity, cut out the extra fat by delegating more tests to the compiler, and get rid of boilerplates in domain logic validation.

"Delegating tests to the compiler" here means that passing a `CheckingAccount` is a compile error, so there's no `if (!account.isInstanceOf[...])` check to write and no unit test for "rejects checking accounts". The limit of this encoding is that a subtype bound expresses one capability. Once accounts have several independent capabilities (interest-bearing, overdraft, multi-currency), the hierarchy runs into the same problem as in [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#product-types), and type classes are the usual alternative.

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

## Modules as algebras


A *module*, as defined in a functional domain model, is a collection of functions that operate on a set of types and honor a set of invariants known as domain rules. In mathematical terms, this is known as the algebra of the module. Note that we haven't yet talked about the implementation, which is not part of the algebra. It's the contract the behaviors publish that forms the algebra of the API. Implementation comes later in the lifecycle and takes the form of an interpreter of your algebra.

In mathematics an algebra is a set of types, operations on them, and laws the operations obey: integers with `+` and `0`, where `x + 0 = x` and `+` is associative. The analogy is the rules of chess versus a chess set. The rules (the algebra) say which moves are legal; a wooden set, a screen or a correspondence game by post (interpreters) are different ways of carrying them out. Critique: in most codebases the laws are never written down, and then "algebra" just means "interface". The laws are what make the word worth using.

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

## Failures and events


The solution lies in the design of the failure-handling module itself. It's not that you must have one single module for failure handling in the whole of your application. The idea is to have centralized handlers.

Centralized handling follows from failures being values. A failure travels through the chain as a `Left` or `Failure` and is handled in one place, usually at the edge, where for example the HTTP layer maps domain errors to status codes. That works best when the errors are an ADT (`InsufficientFunds`, `AccountClosed`, ...) rather than strings or exceptions, so the handler can match on them exhaustively. Critique: a handler far from the failure only knows what the error value tells it, so a vague error type loses context. Make the errors specific enough to act on.

The next section covers how domain events can form one of the first class constructs of composing behaviors within your reactive model.

A domain event is an immutable record of something that happened, named in the past tense: `AccountOpened`, `MoneyDebited`. Because events are ordinary values, they can be stored (event sourcing), replayed to rebuild state, and sent to other parts of the system, which react without the sender knowing who they are.

*Event-based modeling complements the functional model* -- Event-based programming delineates the "what" from the "how" of your model. And this is also what functional programming encourages. Events are small messages that specify what you want to do, and the handler for the event describes the "how" part. No wonder functional programming and event-driven programming play well together.

Strictly, a message that says what you *want* done is a command (`OpenAccount`); an event says what *has* happened (`AccountOpened`). The book's sentence blurs the two, but the split matters in practice: a command can be rejected, while an event is a fact that handlers can only react to.

The two principal traits that describe our modeling paradigm are functional and reactive.

Functional covers everything above: pure domain logic, effects as values, algebraic APIs. Reactive refers to the Reactive Manifesto (2014): responsive, resilient, elastic and message-driven. In practice that means non-blocking calls, streams and actors (Akka, in the book). The two pull in different directions, since actors are stateful and side-effecting. The usual reconciliation is to keep the actors and streams at the edges and the pure model inside them.

## Tagless final


Tagless final is a typed encoding of the algebra-and-interpreter idea above.

### In brief


A starting point for the open task below, not the article itself.

The algebra becomes a trait parameterized by an effect type `F[_]`. Programs are written against the trait, and interpreters are instances for a concrete `F` (Scala 3, with cats for `Monad` and the `flatMap` syntax):

```scala
trait Accounts[F[_]]:
  def open(no: String, owner: String): F[Account]
  def debit(a: Account, amount: BigDecimal): F[Account]
  def credit(a: Account, amount: BigDecimal): F[Account]

def transfer[F[_]: Monad](accounts: Accounts[F])(from: Account, to: Account, amount: BigDecimal): F[(Account, Account)] =
  for
    f <- accounts.debit(from, amount)
    t <- accounts.credit(to, amount)
  yield (f, t)
```


One interpreter is an `Accounts[IO]` that talks to Postgres, another an in-memory one over `State` for tests, and a third might wrap either to add logging.

What it buys:

- `transfer` doesn't know whether it's running against a database, a test map or a logging wrapper
- the signature lists the capabilities a function uses (`Accounts[F]`, `Monad`), the way a constructor lists its dependencies
- testing means choosing a different interpreter, without a mocking library

What it costs (the critique, as in the De Goes link below):

- `F[_]` and type-class constraints spread through the whole codebase
- the abstraction is often unused: most applications have exactly one production `F` (`IO`), so the polymorphism is paid for everywhere and exercised only in tests
- the type classes involved usually have no laws, so "algebra" is just a name for an interface
- type inference and compiler errors get worse, and newcomers struggle

The alternatives are plain traits over a concrete `IO` (programming to interfaces without `F`), ZIO's environment, free monads, and effect systems with algebraic effects.

The origin is Carette, Kiselyov and Shan, *Finally Tagless, Partially Evaluated* (APLAS 2007, then JFP 2009; [PDF](/sources/programming/dsls/carette-2009-finally-tagless-partially-evaluated.pdf.enc)), which is about embedding typed languages in a host language. An *initial* encoding represents a program as a data structure (an AST) that an interpreter walks. A *final* encoding represents it as calls to an interface, so each interpreter is an implementation of that interface. *Tagless* refers to the type tags an initial interpreter needs: the interpreter's values must be wrapped in something like `IntVal | BoolVal` and checked at runtime, and the typed final encoding needs no such wrapper.

### Open task


Open task: explain what the tagless final (TF) pattern does.

Cover examples, advantages and disadvantages, trade-offs, and the problems it solves. Use a project to develop an article. ^definition

### Sources


Follow-up reading (prerequisite not specified): <https://blog.softwaremill.com/final-tagless-seen-alive-79a8d884691d>

[awesome tagless final github](https://github.com/tofu-tf/awesome-tagless-final)

<https://www.reddit.com/r/scala/comments/s6ih9p/can_you_give_me_a_brief_understanding_on_tagless/>

<https://blog.rockthejvm.com/tagless-final/>

<https://www.baeldung.com/scala/tagless-final-pattern>

<https://scalac.io/blog/tagless-final-pattern-for-scala-code/>

<https://degoes.net/articles/tagless-horror>

<https://www.youtube.com/watch?v=m3Qh-MmWpbM>

Expression Problem

Philip Wadler named it in 1998: can you add both new cases and new operations to a data type, without modifying or recompiling existing code, and keep static type safety? Each mainstream style makes one direction easy and the other hard:

```text
                  add a case            add an operation
class hierarchy   easy: a new subclass  hard: touch every class
sum type          hard: touch every     easy: a new function
                  match
tagless final     a new algebra trait   a new interpreter
```


Tagless final is one of the known solutions, which is why these links sit next to it. Leduc et al. in *Library sources* generalize the question from data types to extending whole languages.

<https://en.wikipedia.org/wiki/Expression_problem>

<https://eli.thegreenplace.net/2016/the-expression-problem-and-its-solutions/>

<https://eli.thegreenplace.net/2016/on-the-composite-and-interpreter-design-patterns>

### Daniel sentence


These look like the three goals Daniel Ciocîrlan sets out at the start of his Rock the JVM article (linked above):

- where TF comes from
  - from the typed-DSL work in *In brief* (Carette, Kiselyov and Shan), where the aim was to interpret embedded languages without runtime type tags. It became a Scala application-architecture style only later.
- that TF is just an extension of "programming to interfaces"
  - the algebra is the interface and the interpreter is the implementation. The one addition is that the interface is also abstract in the effect `F`, so the same program can run as `IO`, as `Either` or as a pure test.
- that TF is not the same concept as `F[_]` + type classes, but only similar in representation
  - in Scala, TF is usually *written* with `F[_]` and constraints like `F[_]: Monad`, so the two get conflated. But you can have `F[_]` and type classes without TF (generic code over any `Monad`), and TF without making the algebra a type class (pass it as an ordinary parameter, as `transfer` does with `Accounts` in *In brief*). `F[_]: Monad` is only how Scala says "the interpreter's result type supports sequencing".

## Library sources


- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling* -- the source of the excerpts: lifecycle patterns and the `openCheckingAccount` example (chapter 1), `calculateInterest` (listing 2.2), `AccountService` (listing 3.1) and the monadic model of computation; on *Entities, value objects and composition*, *Keep effects out of the domain*, *Encoding domain logic in types*, *Modules as algebras* and *Failures and events*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- uses tagless final throughout a production-style application; on *Tagless final*
- [Leduc et al. 2019](/sources/programming/dsls/leduc-2019-software-language-extension-problem.pdf.enc), *The Software Language Extension Problem* -- generalizes the expression problem to extending whole languages; on the expression problem in *Tagless final*
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads, 2nd Edition* -- chapters 13 and 14 on the final, initial and operational styles, free monads and extensible effects, and chapter 11 on monad transformers; on *In brief* in *Tagless final* and the stacking point in *Keep effects out of the domain*
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala, 2nd Edition* -- section 7.3, "The algebra of an API", and section 9.1, "Designing an algebra first": an algebra as functions over types plus laws; on *Modules as algebras*
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters* -- modularity through higher-order functions and lazy evaluation as the "glue" of functional programs; on the compositionality paragraph in *Entities, value objects and composition*
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects* -- the effect pattern and Cats Effect `IO`; on *Keep effects out of the domain*
- [Schwarz 2019](/sources/programming/scala/schwarz-2019-monads-do-not-compose.pdf.enc), *Monads do not Compose* -- slides showing that functors and applicatives compose generically but monads don't, which is why transformers exist; on the stacking point in *Keep effects out of the domain*
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats* -- chapter 10's data-validation case study and chapter 5 on monad transformers; on the smart-constructor bullets in *Entities, value objects and composition* and the stacking point in *Keep effects out of the domain*
- [Carette et al. 2009](/sources/programming/dsls/carette-2009-finally-tagless-partially-evaluated.pdf.enc), *Finally Tagless, Partially Evaluated: Tagless Staged Interpreters for Simpler Typed Languages* -- the paper that introduced the tagless final encoding of typed embedded languages; on *In brief* and *Daniel sentence*
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture* -- chapter 6 on domain modeling with free monads, and section 13.2.6 comparing final tagless with the Service Handle pattern; on *In brief*
- [Percival et al. 2020](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), *Architecture Patterns with Python* -- chapter 1 on entities and value objects, and chapters 8 and 10 on events and on commands with command handlers; on *Entities, value objects and composition* and *Failures and events*

Further reading:

- [Gibbons et al. 2014](/sources/programming/functional-programming/gibbons-2014-folding-dsls-deep-and-shallow-embeddings.pdf.enc), *Folding Domain-Specific Languages: Deep and Shallow Embeddings*
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-sighting-of-cats-traverse-in-practical-fp.pdf.enc), *A sighting of traverse_ in Practical FP in Scala*
- [Vargas 2023](/sources/programming/scala/vargas-2023-why-on-earth-a-zio-io-monad.pdf.enc), *Why on earth a ZIO IO monad for Scala?*
- [Pretnar 2015](/sources/ai-engineering/harness/pretnar-2015-introduction-to-algebraic-effects-and-handlers.pdf.enc), *An Introduction to Algebraic Effects and Handlers*
- [Richardson 2019](/sources/system-design/microservices/richardson-2019-microservices-patterns.pdf.enc), *Microservices Patterns: With Examples in Java*
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture: Powered by Scala 3*
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc), *Kleisli composition, flatMap, join, map, unit*
