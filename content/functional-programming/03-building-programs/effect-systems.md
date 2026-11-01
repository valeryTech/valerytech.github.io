---
draft: false
toc: true
title: "Effect Systems: Haskell IO, Cats Effect and ZIO"
aliases:
  - "/functional-programming/effect-systems/"
description: "Effects as values kept apart from their execution, built up from a toy IO to Haskell IO, Cats Effect 3 and ZIO, with a comparison of the three and a study order for the Scala effect libraries."
weight: "20"
linkTitle: "Effect Systems"
---

What an effect type is, why building a program and running it are kept apart, and how Haskell's `IO`, Cats Effect 3 and ZIO put that idea into practice: errors, fibers and cancellation, resources, shared state, and dependencies.

## Effects and effect systems


"Effect" is used in two senses, and it helps to keep them apart.

In the Scala and Haskell libraries an *effect* is a type constructor `F` in `F[A]`: something that happens around producing an `A`. `Option` may produce nothing, `Either[E, _]` may fail, `List` may produce many values, `IO` may interact with the world. A value of such a type *describes* the computation; building it does nothing. That is how effectful code stays referentially transparent (see [Referential transparency]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#referential-transparency), and [Option]({{< ref "functional-programming/02-abstractions/monads" >}}#option) and [IO]({{< ref "functional-programming/02-abstractions/monads" >}}#io) for two of these types as monads). An *effect system* in this sense is a library built around one very general effect type, an `IO`, plus a runtime that executes it: Cats Effect and ZIO in Scala; in Haskell, the `IO` type built into the language plays that role.

In programming-language theory an *effect system* is an extension of the type system that records what a function may do besides returning a value, and checks it at compile time (Nielson and Nielson 1999). Wikipedia's definition:

> [An effect system] is a [formal system](https://en.wikipedia.org/wiki/Formal_system "Formal system") that describes the computational effects of computer programs, such as [side effects](https://en.wikipedia.org/wiki/Side_effect_(computer_science) "Side effect (computer science)"). An effect system can be used to provide a [compile-time](https://en.wikipedia.org/wiki/Compile-time "Compile-time") check of the possible effects of the program.

A familiar small example is Java's checked exceptions: `throws IOException` in a method signature is an effect annotation, and the compiler checks that callers handle or declare it. Languages such as Koka track effects like state, exceptions and I/O in every function type. The library sense reuses the name, but the mechanism is the ordinary type system: the effect shows up in the return type, not as an annotation on the function arrow. The two senses meet in the monadic approach, but they are not the same concept.

### Effect, effectful and side effect


- A *side effect* is anything a function does besides returning a value: I/O, mutation, throwing (see [Side effects]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#side-effects)).
- An *effect* is the context type, such as `Option`, `Either[E, _]` or `IO`.
- A function is *effectful* when it returns its result inside such a context, as in `String => Option[Int]` or `UserId => IO[User]`, instead of a plain value. An effectful function in this sense can be completely pure, because it returns a description of the effect rather than performing it.

Pilquist et al. (ch. 13) draw the line that matters in practice: a program that returns an `IO` *has effects* but no *side effects*. Its evaluation only computes a description. The effects happen when an interpreter outside the program runs that description.

Useful programs still have to act on the world in the end, so the real job of an effect system is to manage the boundary:

> Functional programming favors pure functions and composition, but useful programs must eventually have an effect, like printing to the console or writing to a file. Since most programs will contain a mix of pure and effectful code, we need to control the boundary between both types of code. This is the job of an effects system.

A naming detail: Cats Effect 2 also had a type class called `Effect`. It was removed in Cats Effect 3.

## The effect pattern: what the type should tell you


Rosien (ch. 1.3) gives a two-part test for calling something an effect. The type should tell you what kind of effect the program has and what value it produces. And if the behaviour needs side effects visible outside the program, describing them must be kept apart from performing them. `Option[A]` passes trivially, since it needs no side effects. `Future[A]` fails the second part, because a `Future` is already running when you hold it (Rosien ch. 1.3; De Goes et al., ch. 1.6). Cats Effect's `IO[A]` passes: its constructors and combinators only build a description, and only an `unsafe*` method executes it (Rosien ch. 2.4).

How much the type says varies a lot between the three libraries in this note:

| Type | Says about failure | Says about dependencies |
|---|---|---|
| Haskell `IO a` | nothing; any exception is possible | nothing |
| Cats Effect `IO[A]` | can fail with a `Throwable` | nothing |
| ZIO `ZIO[R, E, A]` | fails with `E`; `Nothing` means it can't fail | needs services `R`; `Any` means none |
| `F[A]` with `F[_]: Console: Clock` | as much as the constraints say | exactly the listed capabilities |

The last row is tagless final style (see [Tagless final]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#tagless-final)): the effect type stays abstract and the constraints list what the code may do.

The design goal behind the pattern is that the type signature of an effect alone should let you tell, or at least anticipate, what kind of computation it performs and what it produces. How far that goes depends on how fine-grained the type is. `IO[User]` says only "some interaction with the world, then a `User`". `ZIO[UserRepo, NotFound, User]` also names the environment it needs and the error it can fail with, and `def load[F[_]: Console: Clock]: F[User]` lists exactly the capabilities used.

Caveat: a type tells you which effects are *possible*, not which ones happen or in what order. `IO[A]` can do anything, so precision has to come from narrower types or capabilities, and that costs extra type plumbing.

## Programs as values: construction versus execution


An `IO[A]` is an immutable value that represents a computation which, if it succeeds, produces an `A` (Plachta, ch. 8). Constructing one runs nothing. Cats Effect has two basic constructors, and the difference between them is the difference between lazy and eager evaluation (Plachta, ch. 8; Rosien ch. 2.1):

```scala
import cats.effect.IO

val now: IO[Long] = IO.delay(System.currentTimeMillis()) // evaluated each time it is run
val six: IO[Int]  = IO.pure(6)                            // argument evaluated right away
val bad: IO[Int]  = IO.pure(sys.error("boom"))           // throws while *building* the value
```


`IO.pure` is for values you already have. Anything with a side effect goes through `IO.delay` (or `IO(...)`, an alias), otherwise substitution breaks (Rosien ch. 2.1).

Because a program is a value, you can do with it what you do with values: store it, pass it, repeat it, combine it, retry it, run it twice. A `Future` is different, because it starts running when it is created:

```scala
import cats.effect.IO
import scala.concurrent.{ExecutionContext, Future}
given ExecutionContext = ExecutionContext.global

val hi: IO[Unit] = IO.println("hi")
val twice = hi >> hi            // prints "hi" twice when run

val f = Future(println("hi"))   // prints now
f.flatMap(_ => f)               // does not print again
```


So a `Future` can't be retried either: by the time you have one it has already run (De Goes et al., ch. 1.6). Plachta (ch. 8) makes retries an ordinary function on descriptions:

```scala
def retry[A](action: IO[A], maxRetries: Int): IO[A] =
  List.range(0, maxRetries).foldLeft(action)((program, _) =>
    program.handleErrorWith(_ => action))
```


Execution happens once, at the edge. In a Cats Effect application you extend `IOApp` and return the whole program as one `IO` from `run`; the runtime executes it (Rosien ch. 2.5). Methods like `unsafeRunSync` exist for the REPL and for integration with non-effectful code, and their names warn that substitution stops there (Rosien ch. 2.3). Pilquist et al. (ch. 13.7.1) build the same structure by hand: a `main` that only interprets a pure `pureMain: IO[Unit]`. In Haskell the language does this for you: `main :: IO ()` is the description and the runtime executes it.

Two consequences follow. First, `IO` is "viral": a function that uses a result of an `IO` must itself return an `IO` (Plachta, ch. 8). So keep `IO` in as few functions as possible and put the logic in pure functions over plain data. Pilquist et al. (ch. 13.1) show that any impure procedure can be factored into a pure core plus an input step and an output step; this is the functional core, imperative shell of [Functional core, imperative shell]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#functional-core-imperative-shell). Second, an `IO` type on its own is a "lowest common denominator": inside it you program much as you would imperatively, so the books push towards narrower abstractions on top (Pilquist et al., ch. 13.2.2 and 13.9).

Further reading on the idea: the systemfw.org post archive, <https://systemfw.org/archive.html>.

## Building a toy IO


Pilquist et al. (ch. 13) derive an `IO` step by step, and the steps explain design choices visible in every real library:

1. **A thunk.** `IO` as a wrapper around `() => A`, with `map` and `flatMap`. It already separates description from execution and makes programs first-class values (ch. 13.2).
2. **Stack safety.** That version overflows the stack on long `flatMap` chains, because each `unsafeRun` calls the next. The fix is to represent `FlatMap(io, f)` as a data constructor and run the program in a tail-recursive interpreter loop: *trampolining* (ch. 13.3).
3. **Opacity and asynchrony.** A thunk is opaque: you can't inspect it, and it can only block. Generalising the trampoline gives the free monad, whose interpreter can target an asynchronous type and use non-blocking I/O (ch. 13.4 and 13.5).
4. **Capabilities.** Instead of one algebra per effect plus free-monad plumbing, define capability traits such as `Console[F[_]]` with instances for a concrete `IO` (ch. 13.6). This is tagless final, taken up in [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}).

A minimal version of step 1, which is a good starting point for building your own:

```scala
final case class IO[A](unsafeRun: () => A):
  def map[B](f: A => B): IO[B]         = IO(() => f(unsafeRun()))
  def flatMap[B](f: A => IO[B]): IO[B] = IO(() => f(unsafeRun()).unsafeRun())

object IO:
  def delay[A](a: => A): IO[A] = IO(() => a)

val program = IO.delay(println("hi")).flatMap(_ => IO.delay(42))
// nothing printed yet; program.unsafeRun() prints and returns 42
```


Natural next steps are error handling, then a stack-safe `flatMap`, then concurrency. This naive version overflows the stack on a recursive loop written with `flatMap`. Representing `map` and `flatMap` as data and running them in an interpreter loop, as in step 2, is where most of the work in Cats Effect and ZIO goes.

Links filed under "build your own effect system: there are 2 projects" (the two projects were not named; these links may be them):

- Demystifying functional effect systems in Scala (Wix Engineering): <https://medium.com/wix-engineering/demystifying-functional-effect-systems-in-scala-14419039a423>
- Introduction to Cats Effect (Baeldung): <https://www.baeldung.com/scala/cats-effects-intro>

The chapter ends by noting what its `IO` lacks compared with Cats Effect: concurrency, cancellation and resource management (ch. 13.9). Those are what the rest of this note is about.

## IO in Haskell


Haskell has no separate effect library at the core: `IO` is a built-in type and `main :: IO ()` is the program. Skinner (ch. 7) separates three meanings of "IO": the general idea of talking to the outside world, an *IO action* (one specific interaction, such as reading a file), and the type `IO a`, a computation that may have side effects and produces an `a`. How GHC represents `IO` internally is an implementation detail; Skinner only sketches it, calling `IO` "essentially a version of State" over the real world (ch. 13). (GHC defines it as a state-passing function over a `RealWorld` token; Serrano Mena, section 8.2.4.)

Purity and laziness together are why Haskell needs `IO` at all. Under lazy evaluation, an action whose result nobody uses might never run, or run out of order. So actions are ordered by `>>=` and `>>`, which make running one action a precondition of the next (Skinner, ch. 7). Two consequences are easy to trip over (Skinner, ch. 7, "Running IO in Real Applications"):

```haskell
quiet :: IO ()
quiet =
  let scream = putStrLn "quack"   -- an action bound to a name: nothing happens
  in return ()

twice :: IO () -> IO ()
twice act = act >> act            -- the same description, run twice
```


- An action that is defined but never sequenced into `main` never runs.
- `>>=` forces the *effects* of the previous action, not its *result value*. ``putStrLn "x" >> return (1 `div` 0)`` prints and does not fail unless something uses the result. Lazy I/O such as `readFile` builds on this and causes the file-handle problems described under [IO]({{< ref "functional-programming/02-abstractions/monads" >}}#io).

The rest of an effect system is spread over the standard library and a few packages:

- **Errors.** `IO` can throw any exception; `Control.Exception` provides `throwIO` and `catch` (Skinner, ch. 8), `handle` (Skinner, ch. 10) and `try` (Bragilevsky, ch. 7.3.3). Errors that callers should handle are usually returned as `Either` or carried by `ExceptT` instead (Skinner, ch. 13; see [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}})).
- **Mutable state.** `IORef` is a mutable reference used from `IO` (Skinner, ch. 10).
- **Concurrency.** `forkIO` starts a lightweight thread managed by the GHC runtime; `MVar` is a shared box that also synchronises (Marlow, ch. 7).
- **Cancellation.** One thread cancels another by throwing it an *asynchronous exception* with `throwTo` or `killThread`. Because most Haskell code is pure, it is safe to interrupt anywhere, so cancellation is asynchronous by default, and `mask` protects the critical sections that must not be interrupted (Marlow, ch. 9).
- **Resources.** `bracket acquire release use` runs the release step even when an exception, including an asynchronous one, interrupts the use step (Marlow, ch. 9).
- **Composable atomicity.** `STM` with `TVar`s and `atomically` (Marlow, ch. 10).
- **Structure.** The `async` package adds `withAsync`, `concurrently` and `race`, which tie a thread's lifetime to a scope (Marlow, ch. 11).

```haskell
import Control.Concurrent (forkIO, killThread, threadDelay)
import Control.Exception (bracket)
import Control.Monad (forever)
import System.IO

main :: IO ()
main =
  bracket (openFile "data.txt" ReadMode) hClose $ \h -> do
    ticker <- forkIO (forever (putStrLn "tick" >> threadDelay 1000000))
    hGetLine h >>= putStrLn
    killThread ticker   -- skipped if hGetLine throws: forkIO is not scoped
```


The file handle is safe because of `bracket`; the ticker thread is not, because `forkIO` ties it to nothing. `withAsync` from the `async` package, or `race`, fixes that. Cats Effect and ZIO make the scoped form the default.

## Cats Effect 3


Cats Effect is the Typelevel effect system, built on Cats' type classes (see [Learning Cats, Cats Effect and ZIO](#learning-cats-cats-effect-and-zio)). Rosien's *Essential Effects* covers it chapter by chapter; the book's code targets both Cats Effect 2 and 3, with an appendix listing the differences.

### `IO` and its error channel


`cats.effect.IO[A]` is a functor, applicative and monad, so `map`, `mapN`, `flatMap` and for comprehensions work as for any monad (Rosien ch. 2.2). Its error type is fixed to `Throwable`: `IO.raiseError(e)` fails, and `handleErrorWith`, `recoverWith` and `attempt` (which gives `IO[Either[Throwable, A]]`) handle failures (Rosien ch. 2.2). Domain errors that should be visible in types are modelled separately, with `Either` inside `IO`, an ADT, or `MonadError` constraints (Volpe 2021, ch. 1, "Error handling"; see [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}})).

### Fibers and cancellation


A *fiber* is a lightweight logical thread: the runtime schedules many fibers over a small thread pool (Rosien ch. 4). `start` forks an `IO` into a fiber and returns a handle; `join` waits for it; `cancel` stops it. In Cats Effect 3 `join` returns an `Outcome`, one of succeeded, errored or canceled (Rosien, appendix C).

```scala
import cats.effect.{IO, IOApp}
import scala.concurrent.duration.*

object Ticker extends IOApp.Simple:
  val tick: IO[Unit] = (IO.println("tick") >> IO.sleep(1.second)).foreverM

  def run: IO[Unit] =
    for
      fiber   <- tick.onCancel(IO.println("stopped")).start
      _       <- IO.sleep(3.seconds)
      _       <- fiber.cancel
      outcome <- fiber.join         // Outcome.Canceled()
      _       <- IO.println(outcome)
    yield ()
```


Cancellation is checked at *cancellation boundaries*. In Cats Effect 3 every `flatMap` is one, so long loops written with `flatMap` stop promptly (Rosien ch. 4.3, notes 14 and 15). Finalizers registered with `onCancel` or `guarantee` run when a fiber is cancelled. Higher-level operators are built from these pieces: `parMapN` and `parTraverse` run effects in parallel and cancel the others if one fails (Rosien ch. 3 and 4.3.2), `race` keeps the winner and cancels the loser, and `timeout` is a race against a sleep (Rosien ch. 4.4).

Blocking calls should run on a separate pool: `IO.blocking(...)` marks them, and `evalOn(ec)` runs an effect on a given `ExecutionContext` (Rosien ch. 5 and appendix C). Cats Effect 2's `ContextShift` and `Blocker` were removed in version 3 (Rosien, appendix C).

`start` on its own is unstructured: nothing cancels the fiber if the parent finishes first. The scoped alternatives are `background`, which returns a `Resource` that cancels the fiber on release, and `Supervisor`, which ties fire-and-forget fibers to its own lifetime (on `Supervisor`, Volpe 2021, ch. 1 and ch. 4).

### `Resource`


`Resource[F, A]` captures acquire, use and release, keeping the code that acquires and releases separate from the code that uses (Rosien ch. 7). `Resource.make(acquire)(release)` builds one, `use` runs it, and release runs whether the use succeeds, fails or is cancelled. Resources compose, in sequence with `flatMap` or in parallel with `parTupled`, and are released in reverse order (Rosien ch. 7.2):

```scala
import cats.effect.{IO, Resource}
import cats.syntax.all.*
import java.io.BufferedReader
import java.nio.file.{Files, Path}

def reader(path: String): Resource[IO, BufferedReader] =
  Resource.make(IO.blocking(Files.newBufferedReader(Path.of(path))))(r =>
    IO.blocking(r.close()))

val firstLines: IO[(String, String)] =
  (reader("a.txt"), reader("b.txt")).tupled.use { (a, b) =>
    IO.blocking((a.readLine(), b.readLine()))
  }
```


Applications use `Resource` for their dependencies too: HTTP servers, database pools and clients are built as resources and acquired in `main` (Rosien ch. 7.3; Volpe 2021, ch. 9; Volpe 2023, ch. 5.2).

### `Ref` and `Deferred`


Shared mutable state between fibers lives in `Ref[F, A]`, a purely functional atomic reference with `get`, `set`, `update` and `modify`; it is implemented with a compare-and-set loop (Rosien ch. 9.1; Volpe 2021, ch. 1). `Deferred[F, A]` is a write-once cell: `get` waits, without blocking a thread, until some fiber calls `complete` (Rosien ch. 9.2). Together they build concurrent state machines (Rosien ch. 9.3), and the standard library adds `Semaphore`, `Queue` and others in `cats.effect.std` (Rosien, appendix C).

```scala
val counted: IO[Unit] =
  for
    count  <- Ref[IO].of(0)
    ready  <- Deferred[IO, Unit]
    waiter <- (ready.get >> count.get.flatMap(n => IO.println(s"count = $n"))).start
    _      <- List.fill(100)(count.update(_ + 1)).parSequence_
    _      <- ready.complete(())
    _      <- waiter.join
  yield ()
```


Creating a `Ref` is itself an effect, and that is deliberate: the `flatMap` that binds it marks the *region of sharing*, so you can see exactly which code shares the state. A `Ref` created once with `unsafeRunSync` and kept in a global value turns into hidden shared state (Volpe 2021, ch. 1, "Shared state"). When the state is only sequential, the `State` monad is enough; `Ref` is for state updated concurrently (Volpe 2021, ch. 1).

### The type-class hierarchy


Cats Effect also describes `IO`'s abilities as type classes, so library code can be written for any `F[_]`. In Cats Effect 3, at a high level:

- `MonadCancel` adds cancellation, `uncancelable` regions and safe acquire-release (`bracket`). `MonadCancelThrow` is the variant with `Throwable` errors.
- `Spawn` adds fibers (`start`, `race`), `Concurrent` adds `Ref` and `Deferred`, and `Temporal` adds time (`sleep`, `timeout`).
- `Sync` adds suspension of side-effecting code (`delay`, `blocking`), and `Async` adds callback-based asynchronous code. They sit at the bottom of the hierarchy as the most powerful classes.

The point of the reorganisation was that in Cats Effect 2 asking for `Concurrent` also gave the right to run arbitrary side effects, because it extended `Sync`. In Cats Effect 3 `Concurrent` no longer implies `Sync`, so a constraint can grant concurrency without that right (Volpe 2021, ch. 2; Rosien's appendix B lists the old Cats Effect 2 classes). Volpe recommends going further and depending on narrow capability traits of your own rather than on these classes (ch. 2, "Capability traits"). The exact hierarchy is documented on the Cats Effect site; check it there before relying on a detail.

## ZIO


ZIO's core type is `ZIO[R, E, A]`, a *functional effect*: a blueprint of a workflow that needs an environment `R`, may fail with an `E`, and may succeed with an `A` (De Goes et al., ch. 1.1 and 1.4). A useful mental model, though not the implementation, is a function `R => Either[E, A]` (ch. 1.4). Type aliases cover the common cases: `Task[A]` fails with `Throwable` and needs nothing, `UIO[A]` cannot fail, `IO[E, A]` needs nothing, and `RIO[R, A]` and `URIO[R, A]` add an environment (ch. 1.5). Note that ZIO's `IO` alias is not Cats Effect's `IO`. ZIO is the main alternative to Cats Effect in Scala and comes with its own ecosystem, including ZIO Streams and ZIO HTTP.

**Typed errors.** `E` lists the failures callers are expected to handle, and `Nothing` proves there are none left. ZIO separates these *errors* from *defects*: unexpected failures that aren't in the type, such as an exception thrown inside `ZIO.succeed`. Both are recorded in a `Cause`, which can also hold several failures from parallel or finalizer code (ch. 3.1 and 3.2). Which failures count as errors and which as defects is a design choice made per layer of the application (ch. 3.1).

**Environment and layers.** `R` is a set of services the effect needs, written as an intersection type such as `Request & Scope` (ch. 17.1). A `ZLayer[RIn, E, ROut]` is a recipe for building services `ROut` from services `RIn`, possibly failing and possibly with setup and teardown; ZIO can wire layers together automatically (ch. 17.5). The recommended service pattern keeps `R` out of service interfaces, whose methods have environment `Any`, and passes an implementation's dependencies as constructor arguments; the environment is then mainly for wiring and for contextual values (ch. 17.8, 19).

**Concurrency.** ZIO also runs on fibers (ch. 5). Forked fibers are supervised by their parent by default, so interrupting a parent interrupts its children: structured concurrency (ch. 5.5 and 7.2). Effects are interruptible by default, `uninterruptible` marks regions that must finish, and the runtime checks for interruption before each step (ch. 8.2). The concurrent structures mirror Cats Effect's and add some: `Ref`, `Promise` (like `Deferred`), `Queue`, `Hub`, `Semaphore`, and software transactional memory (ch. 9 to 13, 21 to 23).

**Resources.** `ZIO.acquireReleaseWith` is the bracket form. `acquireRelease` instead returns an effect that needs a `Scope`, so a resource is just a `ZIO[R & Scope, E, A]` and composes like any other effect until `ZIO.scoped` closes the scope (ch. 14 and 15).

**Retries.** `Schedule` describes repetition and retry policies as composable values (ch. 24).

```scala
import zio.*

final case class User(id: Long, name: String)
final case class NotFound(id: Long)

trait UserRepo:
  def find(id: Long): IO[NotFound, User]

final case class InMemoryRepo(users: Map[Long, User]) extends UserRepo:
  def find(id: Long): IO[NotFound, User] =
    ZIO.fromOption(users.get(id)).orElseFail(NotFound(id))

val repoLayer: ULayer[UserRepo] =
  ZLayer.succeed[UserRepo](InMemoryRepo(Map(1L -> User(1L, "Ada"))))

def greet(id: Long): ZIO[UserRepo, NotFound, String] =
  ZIO.serviceWithZIO[UserRepo](_.find(id)).map(u => s"Hello, ${u.name}")

val program: UIO[Unit] =
  greet(2L)
    .catchAll(e => ZIO.succeed(s"no user ${e.id}"))  // E becomes Nothing
    .provide(repoLayer)                               // R becomes Any
    .flatMap(msg => Console.printLine(msg).orDie)
```


ZIO and Cats Effect code can be mixed through an interop module that gives ZIO the Cats Effect type-class instances (De Goes et al., ch. 4.3).

## Comparing Cats Effect, ZIO and Haskell IO


All three share the core idea: a program is a value of an effect type, executed by a runtime at the edge, with lightweight threads, cancellation, masked regions and bracket-style resource safety. They differ in where information lives and how much the library decides for you.

| | Haskell `IO` | Cats Effect 3 | ZIO 2 |
|---|---|---|---|
| Core type | `IO a`, built into the language | `IO[A]`, a library type | `ZIO[R, E, A]` |
| Errors in the type | none; exceptions | none; fixed to `Throwable` | yes, `E`; defects kept separate |
| Dependencies | arguments, or a reader over `IO` | constructor arguments, tagless final | `R` plus `ZLayer` wiring |
| Lightweight threads | GHC threads (`forkIO`) | fibers | fibers |
| Cancellation | asynchronous exceptions | cancellation at `flatMap` boundaries | interruption checked before each step |
| Protecting a region | `mask` | `uncancelable` | `uninterruptible` |
| Resources | `bracket` | `Resource` | `Scope`, `acquireRelease` |
| Child threads | unscoped (`forkIO`); scoped with `async` | unscoped (`start`); scoped with `background`, `Supervisor` | supervised by the parent by default |
| STM | `stm` package | not in the core library | built in |
| Streaming | conduit, pipes, streaming | fs2 | ZIO Streams |
| Typical style | concrete `IO`, transformers or effect libraries | polymorphic `F[_]` with type classes, or concrete `IO` | concrete `ZIO` |

A fair reading:

- **Typed errors** are ZIO's clearest difference. In Cats Effect and Haskell the same information is available, but you put it in yourself with `Either`, `EitherT` or `ExceptT`, at the cost of extra wrapping.
- **The environment** makes dependencies visible in ZIO's types, but De Goes et al. themselves advise keeping it out of service interfaces (ch. 17.8). For most application code the difference from passing dependencies to constructors, as Volpe does with Cats Effect, is smaller than it first looks.
- **Polymorphism.** Cats Effect's type classes let libraries such as fs2, http4s and Skunk be written once for any `F[_]`. ZIO trades that abstraction for a single concrete type, which tends to mean better type inference and less ceremony.
- **Haskell `IO`** is the simplest of the three and the oldest. It gets purity from the language rather than from discipline, but it says the least in its type, and its concurrency defaults (unscoped `forkIO`, asynchronous exceptions everywhere) put more of the burden on the programmer.
- The Zionomicon's own comparison, in its foreword, calls Cats Effect much less expressive than ZIO. That is a ZIO author's view; read it as advocacy, not a neutral benchmark (De Goes et al., "ZIO Alternatives").

## Where effect systems meet the rest

### Streaming


An `IO` produces one result. Processing a large or unbounded input with it means a hand-written loop over handles, which composes badly: adding a moving average means editing the loop (Pilquist et al., ch. 13.8). Streaming libraries fix this by making the stream the value: fs2's `Stream[F, O]` for Cats Effect and ZIO Streams for ZIO. They reuse the effect system's resources and concurrency. fs2's `Stream.resource` lifts a `Resource` into a stream, and `concurrently` runs a second stream next to the first (Volpe 2023, ch. 5.2). Plachta (ch. 9) is a gentle introduction. See [Streams]({{< ref "functional-programming/03-building-programs/streams" >}}).

### Concurrency


Fibers, cancellation, `Ref`, `Deferred`, queues and STM are the effect systems' answer to concurrent programming. They make concurrency something you compose rather than something the program happens to do. Marlow (ch. 7 to 11) is the Haskell treatment, Rosien (ch. 3 to 6 and 9) the Cats Effect one, De Goes et al. (ch. 5 to 13) the ZIO one. See [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}).

### Program structure


An `IO` that can do anything says little, so larger programs narrow it. The options are capability traits and tagless final over an abstract `F[_]` (Pilquist et al., ch. 13.6; Volpe 2021, ch. 2), free monads (Pilquist et al., ch. 13.4), monad transformer stacks (Skinner, ch. 13), and ZIO's environment and layers. Haskell also has extensible-effect libraries such as polysemy, fused-effects and effectful. How to choose between them is the subject of [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}); the domain-modeling side is in [Functional domain modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}).

In Scala, the `eff` library (<https://github.com/atnos-org/eff>) was offered as an alternative to monad transformers. When a program needs several effects at once, say reading configuration, failing with an error and doing I/O, a transformer stack fixes the order of the layers and needs lifting between them. `eff` implements *extensible effects* instead: one `Eff` type carries an open list of effects, and each effect is handled, or interpreted, separately. It is based on Kiselyov and Ishii's "freer monad" approach (2015) (needs checking against its README). In Scala the approach stayed niche: most code that needs several effects uses tagless final over Cats Effect, or ZIO, whose environment and error parameters cover the common cases without a transformer stack.

## Learning Cats, Cats Effect and ZIO


A sequence the library supports: Plachta's chapters 8 to 10 for `IO`, streams and concurrency at a gentle pace, then Rosien for Cats Effect 3 itself, then Volpe 2021 for a complete service and Volpe 2023 for streaming and event-driven systems. For ZIO, the Zionomicon covers everything from the basics to STM. Pilquist et al. (ch. 13) explains how an `IO` is built inside, and Marlow does the same job for concurrency in Haskell.

### A study order


One workable order for FP and effect systems:

1. pure functions and referential transparency;
2. ADTs and higher-order functions;
3. Functor, Applicative and Monad;
4. `IO` as a description of a program;
5. one effect library in depth, Cats Effect or ZIO: error handling, resources, fibers and concurrency;
6. streaming, with fs2 or ZIO Streams.

### Cats and Cats Effect


Cats and Cats Effect are the Typelevel libraries for functional programming in Scala, and they are two separate libraries. Cats provides the type classes (`Semigroup`, `Monoid`, `Functor`, `Applicative`, `Monad`, `Traverse` and so on), their instances for standard types, and data types such as `Validated`. Cats Effect builds on it with the `IO` type, fibers, resource safety (`Resource`) and a runtime for concurrent programs. Learn Cats first: Cats Effect code uses its type classes and syntax throughout.

Caveat: check which major version a tutorial or overview describes. Cats Effect 3, released in 2021, changed the API substantially (for example it removed `ContextShift` and reorganised the type-class hierarchy), so code written for Cats Effect 2 won't compile as is.

Documentation and overviews:

- Cats on GitHub: <https://github.com/typelevel/cats>
- Cats resources for learners (typelevel.org): <https://typelevel.org/cats/resources_for_learners.html>
- Cats Effect tutorial (typelevel.org): <https://typelevel.org/cats-effect/docs/tutorial>
- Cats Effect third-party resources (typelevel.org): <https://typelevel.org/cats-effect/docs/third-party-resources>
- Cats Effect, an overview (beyondthelines.net): <https://www.beyondthelines.net/programming/cats-effect-an-overview/#disqus_thread>. The link ends in `#disqus_thread`, so it opens at the comments rather than the start of the article.

The two typelevel.org pages with "resources" in their address are the projects' own lists of learning material.

### Courses


- Cats Effect 3 course (coursehunter): <https://coursehunter.net/course/cats-effect-3>
- Rock the JVM's Cats Effect course (no link recorded).

If no course is at hand, Rosien's *Essential Effects* in the library covers the same ground for Cats Effect 3: the `IO` type, parallelism, fibers and cancellation, resources and testing (see Library sources).

### Books


- Gabriel Volpe, *Practical FP in Scala* (2nd edition, 2021) ([PDF](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc)). It builds one shopping-cart service from start to finish with Cats, Cats Effect and fs2, using the tagless final style (see [Tagless final]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#tagless-final)). It assumes you already know the Cats type classes, so it works best after *Scala with Cats*.
- Noel Welsh and Dave Gurnell, *Scala with Cats* ([PDF](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc)). It teaches the type classes one at a time (monoids and semigroups, functors, monads, monad transformers, applicatives, `Foldable` and `Traverse`) with exercises, then applies them in case studies. It is the usual first book on Cats. The library copy is the 2020 edition, which uses Scala 2 syntax: type-class instances are `implicit val`s and `implicit` parameters rather than Scala 3's `given` and `using`. The concepts carry over unchanged, but the code needs translating for Scala 3.

## Further links

### What "effect" means


- What "effect" and "effectful" mean in functional programming (Alvin Alexander): <https://alvinalexander.com/scala/what-effects-effectful-mean-in-functional-programming>
- What exactly does "effectful" mean? (Stack Overflow): [https://stackoverflow.com/questions/33386622/what-exactly-does-effectful-mean](https://stackoverflow.com/questions/33386622/what-exactly-does-effectful-mean)
- So what is an effect? (r/scala): [https://www.reddit.com/r/scala/comments/174u2gj/so_what_is_an_effect/](https://www.reddit.com/r/scala/comments/174u2gj/so_what_is_an_effect/)
- Effect system (Wikipedia): [https://en.wikipedia.org/wiki/Effect_system](https://en.wikipedia.org/wiki/Effect_system)

### Effect systems


- Effect systems, a talk (earldouglas.com): [https://earldouglas.com/talks/effect-systems.html](https://earldouglas.com/talks/effect-systems.html)
- The future of effects in Scala (SoftwareMill): [https://softwaremill.com/the-future-of-effects-in-scala/](https://softwaremill.com/the-future-of-effects-in-scala/)
- The case against effect systems: the IO data type (alexn.org, 2022): <https://alexn.org/blog/2022/10/13/the-case-against-effect-systems-io-data-type/#isso-thread>. The `#isso-thread` anchor points at the comment thread.
- Functional effect systems to the rescue, Scala in the City conference (Signify Technology, 2020): [https://www.signifytechnology.com/blog/2020/06/functional-effect-systems-to-the-rescue-scala-in-the-city-conference?source=google.com](https://www.signifytechnology.com/blog/2020/06/functional-effect-systems-to-the-rescue-scala-in-the-city-conference?source=google.com)
- Videos on effect systems:
  - [https://www.youtube.com/watch?v=GhERMBT7u4w](https://www.youtube.com/watch?v=GhERMBT7u4w)
  - [https://www.youtube.com/watch?v=GZRL5Z40w60](https://www.youtube.com/watch?v=GZRL5Z40w60)

### ZIO


- ZIO posts on the SoftwareMill blog (a search page): <https://softwaremill.com/blog/?search=zio>
- Why on earth a ZIO IO monad for Scala? (Americo Vargas): <https://americovargas.medium.com/why-on-earth-a-zio-io-monad-for-scala-90768e89ab2a> ([PDF](/sources/programming/scala/vargas-2023-why-on-earth-a-zio-io-monad.pdf.enc))
- Building a super easy rate limiter with ZIO (Wix Engineering): <https://medium.com/wix-engineering/building-a-super-easy-rate-limiter-with-zio-88f1ccb49776>

### Libraries and ecosystem


- Video about libraries, topic not checked further: <https://www.youtube.com/watch?v=KjDG9c5zuKs>
- Inner Product blog posts: <https://www.inner-product.com/posts/>
- Scala FP notes (niqdev):
  - advanced: <https://niqdev.github.io/scala-fp/docs/fp-advanced>
  - ecosystem: <https://niqdev.github.io/scala-fp/docs/fp-ecosystem>
  - more: <https://niqdev.github.io/scala-fp/docs/fp-more>
- Tofu, Scala libraries: <https://github.com/tofu-tf/tofu>

### OOP design in Scala


- Scala OOP design sample (alexn.org, 2022): [https://alexn.org/blog/2022/04/18/scala-oop-design-sample/](https://alexn.org/blog/2022/04/18/scala-oop-design-sample/)

See also: [Pure functions and effects]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}), [Effect systems]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#effect-systems), [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}), [IO]({{< ref "functional-programming/02-abstractions/monads" >}}#io), [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}), [Streams]({{< ref "functional-programming/03-building-programs/streams" >}}), [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}), [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}), [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}), [Type classes and polymorphism]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}), [Tagless final]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#tagless-final) and [Scala: Sources]({{< ref "functional-programming/04-languages/scala" >}}#sources).

## Library sources


- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: the usual first book on Cats (see [Books](#books)).
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: a complete Cats Effect service in tagless final style (see [Books](#books)).
  - Chapter 1 (best practices: `Ref` versus `State`, regions of sharing, error handling), chapter 2 (tagless final and capability traits, the Cats Effect 3 hierarchy change), chapter 4 (`Supervisor`) and chapter 9 (resources in the main program).
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*: a short book on Cats Effect `IO`, fibers, cancellation and resources; a good bridge between the two books above.
  - Chapter 1 (the effect pattern), 2 (`IO`, `IOApp`), 3 (parallelism), 4 (fibers and cancellation), 5 (thread pools and blocking), 7 (`Resource`), 9 (`Ref`, `Deferred`), appendix B (the Cats Effect 2 type classes), appendix C (changes in Cats Effect 3).
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*
  - Chapter 13, External effects and I/O: effects versus side effects, factoring effects, a simple `IO` and its stack-safety problem, trampolining and free monads, capability traits, `IOApp`, and why `IO` alone is not enough for streaming.
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*: chapter 1 (functional effects as blueprints, the `ZIO[R, E, A]` type and aliases, comparison with `Future`), chapter 3 (errors, defects and `Cause`), 4.3 (Cats Effect interop), 5 to 8 (fibers, supervision, structured concurrency, interruption), 9 to 13 (concurrent structures), 14 and 15 (resources and `Scope`), 17 (environment and layers), 21 to 24 (STM and schedules); the foreword's "ZIO Alternatives" section.
- Płachta 2022, *Grokking Functional Programming*: chapter 8, IO as values (`IO.pure` versus `IO.delay`, the viral `IO` type, retries as values, functional architecture); chapter 9 for streams.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 7, Understanding IO, sections "Talking About IO" (three meanings of "IO"), "Performing IO in a Pure, Lazy Language" and "Running IO in Real Applications" (unsequenced actions never run, and `>>` forces effects but not result values); chapter 8, "Dealing with IO Exceptions", and the procedural shell and functional core; chapter 10, "Working with IORefs" (also `handle`); chapter 13 on `ExceptT` instead of IO exceptions, and transformers for many effects; on *IO in Haskell* and *Program structure*.
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture*: chapter 4.4 (effectful context and `Supervisor` as a dependency) and chapter 5 (effectful streams, `Resource` with fs2).
- [Marlow 2013](/sources/programming/functional-programming/marlow-2013-parallel-and-concurrent-programming-in-haskell.pdf.enc), *Parallel and Concurrent Programming in Haskell*: chapters 7 to 11 on threads and `MVar`, asynchronous exceptions, `mask` and `bracket`, STM and the `Async` API.
- [Nielson and Nielson 1999](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc), *Type and Effect Systems*: effect systems in the programming-language sense.
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: chapter 29, IO: GHC's representation `newtype IO a = IO (State# RealWorld -> (# State# RealWorld, a #))` and why "IO is State" misleads (29.2); IO exists to fix the order of operations and to switch off some sharing (29.3, 29.4); its Functor, Applicative and Monad (29.7); on *IO in Haskell*.
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: section 8.2, "Interfacing with the Real World", on IO actions as descriptions that run only from `main` or the REPL, on *Programs as values: construction versus execution*; section 8.2.4, "The Truth Behind GHC's IO", which shows `IO` defined as a state function over a `RealWorld` token, section 8.2.3, "Transactional Variables", on `STM` as a restricted subset of IO, and sections 9.1-9.2, "The Bracket Idiom" and "Nicer Code with Continuations", on `bracket`, `withFile` and the `Managed` monad; on *IO in Haskell*.

Further reading:

- [Schwarz 2023](/sources/programming/scala/schwarz-2023-sighting-of-cats-traverse-in-practical-fp.pdf.enc), *A sighting of traverse_ in Practical FP in Scala*
- [Vargas 2023](/sources/programming/scala/vargas-2023-why-on-earth-a-zio-io-monad.pdf.enc), *Why on earth a ZIO IO monad for Scala?*
- Hudak 2004, *The Haskell School of Expression, chapter 3 slides*: the slide "Sample Effects or Actions" lists the effects a program may need (changing state, exceptions, non-determinism, communication with the outside world), and the do-syntax slides introduce `IO a`, `return` and `getChar`, `readFile` and `writeFile` before monads are named; on *Effects and effect systems*.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: section 5.3.1, "Mutable references in the IO monad", counts files in a directory tree with an `IORef` and `modifyIORef'`, on the mutable-state bullet of *IO in Haskell*; section 7.3.3, "Catching exceptions", for `try`, on the errors bullet of *IO in Haskell*.
