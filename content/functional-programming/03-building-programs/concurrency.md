---
draft: false
toc: true
title: "Functional Concurrency and Parallelism"
aliases:
  - "/functional-programming/concurrency/"
description: "Parallelism versus concurrency in functional code: deterministic parallelism with strategies and the Par monad, Haskell threads, MVar, async and STM, fibers in Cats Effect and ZIO, and laws that keep parallel code equivalent to sequential."
weight: "50"
linkTitle: "Concurrency and Parallelism"
---

How functional programs use many cores and juggle many tasks: Marlow's split between parallelism and concurrency, deterministic parallelism in Haskell, threads, `MVar` and STM, fibers in Cats Effect and ZIO, and Pilquist's purely functional `Par` library as a design exercise.

## Parallelism is not concurrency


Marlow opens his book by separating two words that are synonyms in everyday speech (Marlow, ch. 1, "Terminology: Parallelism and Concurrency"):

- A **parallel** program uses several processors at once to get an answer sooner. The only goal is speed.
- A **concurrent** program is structured as several threads of control whose effects the user sees interleaved. Whether they really run at the same moment is an implementation detail; a concurrent program can run on one core. The goal is modularity when a program talks to several independent agents (a user, a database, network clients) without falling back to event loops and callbacks.

A second distinction runs alongside it. A **deterministic** model gives each program exactly one possible result; a **nondeterministic** one allows results that depend on timing. Concurrency is nondeterministic by nature, because outside events arrive when they like. For parallelism we want determinism if possible: then you test and debug the sequential program and the parallel one just runs faster. Using concurrency to get parallelism is therefore often a poor choice, since it throws determinism away (Marlow, ch. 1).

Marlow adds that "threads of control" make no sense in purely functional code, because there are no effects to observe and evaluation order doesn't matter. So in Haskell, concurrency is a structuring technique for code in `IO`, while parallelism can be added to pure code (Marlow, ch. 1).

Plachta draws the same line more informally: concurrent pieces of logic make progress in the same time period, even on one core, while parallel pieces need at least two cores to run simultaneously (Plachta, ch. 10, "Threads and fibers").

The two often meet. An interactive program uses concurrency to keep its interface responsive while compute-heavy work runs in parallel in the background (Marlow, ch. 1). And the effect libraries in Scala blur the words: Cats Effect calls `parMapN` and `parTraverse` "parallel", but what they compose are effects, and running effects side by side is concurrency in Marlow's sense (see "Fibers" below).

For locks, atomicity, volatile fields and the Java memory model, see the general note Concepts. This note covers what functional programming changes.

## Why purity helps, and where it stops helping


Purity gives three concrete benefits, each grounded in the sources:

1. **Determinism for free.** If an expression has no side effects, evaluating its parts in parallel can't change its value. Haskell's parallel models are deterministic: the program gives the same answer however many processors run it, so adding parallelism can't introduce race conditions or deadlocks (Marlow, Part I introduction).
2. **Safe asynchronous cancellation.** Pure code can be stopped at any point and its partial work thrown away, because it hasn't changed anything. Pure code also can't poll for a cancellation flag. So in Haskell cancellation is asynchronous by default, and only `IO` code that updates state needs protecting (Marlow, ch. 9).
3. **Retryable transactions.** STM works by running a transaction optimistically and rerunning it on conflict. That is sound only if the transaction has no other effects, which the `STM` type enforces (Marlow, ch. 10; De Goes et al., ch. 21.5).

What purity does not give is automatic speedup. Data dependencies in a pure program are easy to see, so you might expect the compiler to parallelise it. In practice it can't, because parallelism pays only when the work gained outweighs the overhead of creating tasks, and compile-time analysis can't judge that well. Marlow calls fully automatic parallelisation "still a pipe dream" (Marlow, Part I introduction). This is the practical answer to the old claim, discussed under Church-Rosser in [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}), that functional languages would win parallel programming because evaluation order doesn't matter: order independence makes parallelism safe, but you still have to say where it is worth having.

Two problems remain the programmer's even in pure code (Marlow, Part I introduction):

- **Granularity.** Tasks too small drown in overhead; tasks too large leave cores idle, especially near the end.
- **Data dependencies.** If one task needs another's result, they run in sequence. Strategies leave dependencies implicit; the `Par` monad makes them explicit.

Laziness adds a third: a value you meant to compute in parallel may only be evaluated to its outermost constructor, or not at all, so the work happens later and on one core. See below.

## Deterministic parallelism in Haskell

### par and pseq


The lowest-level interface is in `Control.Parallel` (the `parallel` package):

```haskell
par  :: a -> b -> b   -- spark a, then return b
pseq :: a -> b -> b   -- evaluate a to WHNF, then return b
```


`par a b` hints that `a` could be evaluated in parallel and returns `b`. `pseq` is like `seq` but guarantees the order, which `seq` does not, so it is used to make the current thread do its share first:

```haskell
import Control.Parallel (par, pseq)

pfib :: Int -> Integer
pfib n
  | n < 25    = fib n                       -- below a threshold, stay sequential
  | otherwise = a `par` (b `pseq` (a + b))
  where
    a = pfib (n - 1)
    b = pfib (n - 2)

fib :: Int -> Integer
fib n = if n < 2 then toInteger n else fib (n - 1) + fib (n - 2)
```


The threshold is a granularity decision. Marlow's book doesn't build on `par` and `pseq` directly; it starts one level up, with the `Eval` monad.

### The Eval monad and sparks


`Control.Parallel.Strategies` provides a monad for describing parallel evaluation (Marlow, ch. 2):

```haskell
runEval :: Eval a -> a
rpar    :: a -> Eval a   -- "my argument could be evaluated in parallel"
rseq    :: a -> Eval a   -- "evaluate my argument and wait for it"
```


`runEval` is pure: no `IO` is involved, which is the point. To compute `f x` and `f y` in parallel and wait for both:

```haskell
runEval $ do
  a <- rpar (f x)
  b <- rseq (f y)
  _ <- rseq a
  return (a, b)
```


Marlow walks through the variants (rpar/rpar returns at once; rpar/rseq waits for one; rpar/rseq/rseq waits for both) and their timelines (Marlow, ch. 2).

The argument to `rpar` is a **spark**: an entry in a pool from which idle cores steal work. Sparks are cheap, and the runtime reports what became of them: converted into real parallelism, dropped because the pool was full, garbage-collected because nobody needed the value, or "fizzled" because the main program evaluated the value first (Marlow, ch. 2).

Two traps come from laziness. `rpar` and `rseq` evaluate only to weak head normal form, so `rpar (map solve as)` stops at the first cons cell and does almost no work in parallel; you need `force` or `rdeepseq` from `Control.DeepSeq` (Marlow, ch. 2, "Deepseq"). And sparking an already-evaluated value does nothing.

### Evaluation strategies


A **strategy** separates the algorithm from its parallelism (Marlow, ch. 3):

```haskell
type Strategy a = a -> Eval a

using :: a -> Strategy a -> a
x `using` s = runEval (s x)
```


A strategy walks a data structure, sparks parts of it, and returns the same value. So the program states what to compute and a strategy, attached with `using`, states how to evaluate it:

```haskell
solutions = map solve puzzles `using` parList rseq
```


Delete `` `using` parList rseq `` and the program means the same thing; it just runs on one core. Strategies are parameterised and compose: `parList` takes a strategy for the elements, `parPair` for the two components, and `parBuffer` evaluates a lazy stream with a bounded number of sparks ahead of the consumer (Marlow, ch. 3).

Marlow notes two limits of this "identity property" (Marlow, ch. 3, "The Identity Property"). The library's strategies satisfy `` x `using` s == x ``, but nothing enforces it for user-defined ones, much as nothing enforces the monad laws. And a strategy may make a program *less defined*: it can force a part of `x` that the program never needed, so an expression that used to succeed now fails. His example forces a pair whose first component divides by zero and whose second is the only one used.

### The Par monad


The `Par` monad (`Control.Monad.Par`, the `monad-par` package) trades the brevity of strategies for explicit control (Marlow, ch. 4):

```haskell
runPar :: Par a -> a
fork   :: Par () -> Par ()
new    :: Par (IVar a)
put    :: NFData a => IVar a -> a -> Par ()
get    :: IVar a -> Par a
```


An `IVar` is a write-once box: `get` waits until something has been `put`, and a second `put` is an error. With `fork` and `IVar`s you build a dataflow graph, where nodes are computations and edges are variables:

```haskell
runPar $ do
  i <- new
  j <- new
  fork (put i (fib n))
  fork (put j (fib m))
  a <- get i
  b <- get j
  return (a + b)
```


Write-once variables keep the model deterministic. `put` fully evaluates its argument (hence `NFData`), so the laziness trap above goes away. `spawn` and `parMapM` are derived from these primitives (Marlow, ch. 4).

### Strategies or Par?


Marlow's rules of thumb (Marlow, ch. 4, "The Par Monad Compared to Strategies"):

- If the algorithm naturally produces a lazy data structure, a strategy is usually the easy route. Otherwise `Par` is often more direct.
- `runEval` costs nothing; `runPar` is relatively expensive, so pass the `Par` computation around instead of calling `runPar` in many places, and avoid nesting.
- `Eval` does better at fine granularity because sparks have runtime support; at coarse granularity they perform about the same.
- Strategies separate algorithm from parallelism; `Par` makes dependencies explicit and its scheduler is an ordinary library you can swap.
- Only sparks support speculation: work in `Par` is always executed, while an unneeded spark is simply dropped.

Marlow's Part I also covers data-parallel arrays with Repa and GPU programming with Accelerate (chs. 5 and 6), not summarised here.

## Concurrency in Haskell: threads, MVar and async


Concurrent Haskell lives in `IO` (Marlow, ch. 7):

```haskell
forkIO       :: IO () -> IO ThreadId
newEmptyMVar :: IO (MVar a)
takeMVar     :: MVar a -> IO a        -- blocks while empty
putMVar      :: MVar a -> a -> IO ()  -- blocks while full
```


GHC threads are lightweight and scheduled by the runtime onto a few OS threads ("capabilities"); a program needs the `-threaded` flag and `+RTS -N` to use more than one core (Bragilevsky, ch. 16.1.1). An `MVar` is a box that is empty or full. It serves as a one-place channel, as a lock around shared state (take it to lock, put it back to unlock), and as a building block for larger structures such as unbounded channels (Marlow, ch. 7). It is fair: threads blocked on an `MVar` are woken in FIFO order. If a thread blocks on an `MVar` that no other thread can reach, the runtime notices and throws `BlockedIndefinitelyOnMVar` instead of hanging (Marlow, ch. 7).

```haskell
main :: IO ()
main = do
  box <- newEmptyMVar
  _ <- forkIO (putMVar box (sum [1 .. 1000000 :: Int]))
  r <- takeMVar box
  print r
```


Marlow's verdict is that `MVar` scales badly: building larger abstractions from it is tricky, and taking several `MVar`s in different orders deadlocks, as in the dining philosophers (Marlow, chs. 7 and 10).

Cancellation is an **asynchronous exception** thrown to another thread with `throwTo`. Code that must not be interrupted halfway, such as a take-modify-put on an `MVar`, protects itself with `mask`, and `bracket` keeps resource release safe under cancellation (Marlow, ch. 9).

The `async` package, written by Marlow, wraps these pieces into an `Async a` you can wait for or cancel (Marlow, chs. 8 and 11; Bragilevsky, ch. 16.1.3):

```haskell
import Control.Concurrent (threadDelay)
import Control.Concurrent.Async

-- fetch :: String -> IO String, some I/O action
main :: IO ()
main = do
  (a, b) <- concurrently (fetch "a") (fetch "b")    -- both, cancel the other on failure
  r      <- race (threadDelay 1000000) (fetch "c")  -- first to finish wins, loser cancelled
  rs     <- mapConcurrently fetch ["x", "y", "z"]
  print (a, b, r, rs)
```


`withAsync` scopes a thread to a block, so it is cancelled when the block exits; plain `async` leaves stopping it to you (Bragilevsky, ch. 16.1.3). Marlow's chapter 11 is about avoiding exactly this kind of thread leak. That is structured concurrency in all but name, years before the term became common.

## Software transactional memory


STM groups reads and writes of shared variables into a transaction that runs atomically: no other thread sees an intermediate state (Marlow, ch. 10):

```haskell
import Control.Concurrent.STM
import Control.Monad (when)

transfer :: TVar Int -> TVar Int -> Int -> STM ()
transfer from to n = do
  bal <- readTVar from
  when (bal < n) retry          -- block until the balance changes
  modifyTVar' from (subtract n)
  modifyTVar' to   (+ n)

-- atomically (transfer a b 10)
-- atomically (transfer a c 10 `orElse` transfer b c 10)
```


Three operations carry the design:

- `atomically :: STM a -> IO a` runs a transaction. Transactions compose: two `STM` actions sequenced in one `atomically` form one atomic action, which locks and `MVar`s can't offer.
- `retry` abandons the transaction and blocks until one of the variables it read changes. Blocking on any condition takes one line.
- `orElse` tries one transaction and, if it retries, runs the other instead. This composes blocking operations, for instance waiting on whichever of two queues has data, which is very hard with `MVar` (Marlow, ch. 10, "Merging with STM").

Marlow sums up the gains as composable atomicity, composable blocking, and robustness under exceptions and cancellation, since an aborted transaction leaves no trace (Marlow, ch. 10, "Summary"). The costs: `MVar` is faster for simple cases, and STM is not fair, because when a `TVar` changes every transaction blocked on it must be rerun to see whether it can proceed (Marlow, ch. 10, "What Can We Not Do with STM?"). Long transactions that touch much state also risk being restarted repeatedly (Marlow, ch. 10, "Performance").

Why must `STM` be a separate monad, not `IO`? Because the runtime may run a transaction many times. An effect such as printing would happen once per attempt and break the illusion that the transaction ran once. The type rules this out (De Goes et al., ch. 21.5, which makes the same argument for ZIO).

## Fibers in Cats Effect and ZIO


Scala's effect libraries reach similar designs through `IO` values. See [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}) for the effect types themselves.

### Fibers versus threads


A **fiber** is a lightweight, logical thread: a running effect that the library's runtime schedules onto a small pool of OS threads. Fibers are cheap enough to have hundreds of thousands, can be interrupted safely, and can be joined without blocking an OS thread (De Goes et al., ch. 5.1; Plachta, ch. 10). The ZIO runtime makes each fiber yield after a fixed number of instructions, so long-running fibers can't starve short ones (De Goes et al., ch. 5.1). Waiting on a fiber, a `Deferred` or a `Promise` is **semantic blocking**: the fiber is suspended, but the thread under it goes on running other fibers (Rosien, ch. 9.2; De Goes et al., ch. 5.3).

The basic operations line up across libraries:

| | Haskell (`base`, `async`) | Cats Effect | ZIO |
|---|---|---|---|
| start | `forkIO`, `async` | `io.start` | `zio.fork` |
| wait for result | `wait` | `fiber.join` | `fiber.join` |
| stop | `cancel` (`throwTo`) | `fiber.cancel` | `fiber.interrupt` |
| both results | `concurrently` | `parTupled`, `parMapN` | `zipPar` |
| first result | `race` | `IO.race` | `race` |
| over a collection | `mapConcurrently` | `parTraverse` | `ZIO.foreachPar` |
| atomic reference | `IORef` with `atomicModifyIORef'` | `Ref` | `Ref` |
| write-once value | `MVar` used once; `IVar` in `Par` | `Deferred` | `Promise` |
| transactions | `STM`, `TVar` | not in Cats Effect itself | `ZSTM`, `TRef` |

### Parallel combinators: parMapN and parTraverse


Rosien makes a design point about Cats Effect: `IO` itself has no parallelism. Composing with `flatMap` or `mapN` runs effects in sequence, by design, because a different effect should have a different type (Rosien, ch. 3.1). Parallel composition goes through the `Parallel` type class from Cats, which pairs a monad (sequential) with an applicative (parallel) and converts between them (Rosien, ch. 3.2). The split is principled: `flatMap` makes the second step depend on the first's result, so it can't run both at once, while an [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}) combines independent computations, which can. `parTraverse` is the parallel [traverse]({{< ref "functional-programming/02-abstractions/traversable" >}}) (Rosien, ch. 3.5):

```scala
import cats.effect.IO
import cats.syntax.all.*
import scala.concurrent.duration.*

def fetch(id: Int): IO[String] = IO.sleep(100.millis).as(s"item $id")

val both: IO[(String, String)]   = (fetch(1), fetch(2)).parTupled
val all:  IO[List[String]]       = List(1, 2, 3).parTraverse(fetch)
val sum:  IO[Int]                = (IO(1), IO(2)).parMapN(_ + _)
```


The result list keeps input order; only the timing of the effects is nondeterministic. Plachta introduces the same idea with `parSequence`, which takes a list of `IO` values and runs them concurrently instead of one after another (Plachta, ch. 10, "Making it all concurrent").

Marlow's distinction applies here. These are concurrency combinators. They run effects at the same time; whether that uses several cores depends on the thread pool, and whether the outcome is deterministic depends on what the effects do. They are the right tool for overlapping I/O and the wrong tool for squeezing speed out of a pure computation, where the overhead of a fiber per small task would dominate.

Rosien's chapter 4 rebuilds `parMapN` from `start` and `join` to show what it hides: when one side fails, the other must be cancelled, and the obvious version registers the second error handler too late (Rosien, ch. 4.3.2). It is a good argument for using the library's combinators instead of hand-managed fibers.

### Structured concurrency and supervision


Forking manually is low-level. Plachta warns that after `start` you are responsible for making sure the fiber stops and nothing leaks, even on failure, while `parSequence` and its relatives handle that for you; he treats `start` and `cancel` as a last resort (Plachta, ch. 10, "Managing fibers manually").

ZIO builds the discipline into the runtime. De Goes et al. describe **structured concurrency** as the concurrent counterpart of lexical scoping: a fiber's lifetime should be visible in the program's structure, like a variable's (De Goes et al., ch. 7.2). ZIO's supervision rules (paraphrased from ch. 7.2):

1. Every fiber is forked in a scope, by default its parent's.
2. A fiber's scope closes when the fiber ends, whether it succeeded, failed or was interrupted.
3. Closing a scope interrupts every fiber forked in it.

So no child outlives its parent unless you ask for it with an explicit global or custom scope (De Goes et al., ch. 7.3). Cats Effect's `start` doesn't tie the fiber to its parent this way; for scoped background work Cats Effect 3 provides `background` (a `Resource`) and `Supervisor`. That last point comes from the Cats Effect 3 documentation, not from Rosien's draft.

### Cancellation and interruption


Cancelling a fiber is itself an effect: `fiber.cancel` in Cats Effect returns an `IO[Unit]`, and an effect can register `onCancel` to react (Rosien, ch. 4.3). Plachta's example starts an endless printing loop with `start`, sleeps for a second and cancels it (Plachta, ch. 10). `IO.race` cancels the loser, and a timeout is a race against a sleep (Rosien, ch. 4.4).

ZIO's interruption guarantees that finalizers attached to an effect run whether it succeeds, fails or is interrupted, which is the difference from `Thread.interrupt` in Java: a fiber can't be stopped halfway between debiting one account and crediting another unless you allowed it. Regions can be marked `uninterruptible`, and finalizers themselves aren't interrupted (De Goes et al., chs. 5.4 and 8). This is Marlow's argument about `mask` carried over to Scala: interruption is asynchronous by default, and the code that changes state opts out.

### Shared state: Ref, Deferred and Promise


`Ref` is a purely functional atomic reference: creating one is an effect, and `get`, `set`, `update` and `modify` return effects (Rosien, ch. 9.1; Plachta, ch. 10, "Introducing Ref"; De Goes et al., ch. 9):

```scala
import cats.effect.{IO, Ref, Deferred}
import cats.syntax.all.*
import scala.concurrent.duration.*

val counted: IO[Int] =
  for
    ref <- Ref.of[IO, Int](0)
    _   <- List.fill(1000)(ref.update(_ + 1)).parSequence_
    n   <- ref.get
  yield n                                   // always 1000

val signalled: IO[Unit] =
  for
    done <- Deferred[IO, Unit]
    _    <- (IO.sleep(1.second) *> done.complete(())).start
    _    <- done.get                        // suspends this fiber until completed
  yield ()
```


Two cautions from the books:

- `update` and `modify` are implemented as compare-and-swap loops, so the function you pass may run more than once under contention. It must be pure; Rosien demonstrates a `println` inside `modify` running extra times (Rosien, ch. 9.1; De Goes et al., ch. 21.2).
- Each `Ref` operation is atomic, but a sequence of them isn't. `ref.get.flatMap(n => ref.set(n + 1))` loses updates under concurrency, and two `Ref`s can't be updated together atomically. Keep state that must stay consistent in one `Ref` (De Goes et al., ch. 9.3).

`Deferred` (Cats Effect) and `Promise` (ZIO) are write-once variables that replace polling: one fiber waits on `get`, another calls `complete` (Rosien, ch. 9.2; De Goes et al., ch. 10). They are the effectful cousin of Marlow's `IVar`. Combining a `Ref` holding a state machine with `Deferred`s for waiting is Rosien's recipe for larger coordination structures (Rosien, ch. 9.3), and ZIO adds `Queue`, `Hub` and `Semaphore` (De Goes et al., chs. 11 to 13). Concurrent pipelines over streams of values belong to [Streams]({{< ref "functional-programming/03-building-programs/streams" >}}).

### STM in ZIO


When state must change atomically across several variables, ZIO offers STM with the same design as Haskell's. A `ZSTM` value is a blueprint for a transaction that can be composed with others and becomes an ordinary effect only on `commit` (De Goes et al., ch. 21.3):

```scala
import zio.*
import zio.stm.*

def transfer(from: TRef[Int], to: TRef[Int], amount: Int): STM[String, Unit] =
  for
    bal <- from.get
    _   <- if bal < amount then STM.fail("insufficient funds")
           else from.update(_ - amount) *> to.update(_ + amount)
  yield ()

// transfer(alice, bob, 30).commit : IO[String, Unit]
```


`STM.retry` blocks until a variable read by the transaction changes, as in Haskell. Arbitrary effects aren't allowed inside a transaction, and neither is forking, since a retried transaction would repeat them (De Goes et al., ch. 21.5). Chapter 22 covers transactional data structures (`TMap`, `TQueue`, `TSemaphore` and others) and chapter 23 how STM works inside and how to keep transactions small.

## Design exercise: Pilquist's purely functional parallelism


Chapter 7 of *Functional Programming in Scala* builds a parallelism library from scratch, less for the library than to show how functional design proceeds (Pilquist et al., ch. 7). The steps are worth retracing.

**Start from a use case.** Summing a sequence by splitting it in half suggests a type `Par[A]` for a computation that may run in parallel, with `unit` to wrap a value, `map2` to combine two results and `run` to get the answer (7.1.1 and 7.1.2).

**Make forking explicit.** Should `map2` always run both sides in parallel? Not for `map2(unit(1), unit(1))(_ + _)`. So forking becomes its own combinator, `fork`, and `map2` stays strict. Combining results and deciding what runs asynchronously are now separate concerns, and there is no global policy hidden in `map2` (7.1.3):

```scala
def sum(ints: IndexedSeq[Int]): Par[Int] =
  if ints.size <= 1 then Par.unit(ints.headOption.getOrElse(0))
  else
    val (l, r) = ints.splitAt(ints.size / 2)
    Par.map2(Par.fork(sum(l)), Par.fork(sum(r)))(_ + _)

def lazyUnit[A](a: => A): Par[A] = Par.fork(Par.unit(a))   // derived, not primitive
```


**Keep description apart from execution.** If `fork` started work immediately, it would need a global thread pool. Giving `run` that job keeps `Par` a description, so the representation becomes a function waiting for an executor (7.2):

```scala
opaque type Par[A] = ExecutorService => Future[A]
```


**Write down laws and try to break them.** Mapping the identity function changes nothing, `y.map(id) == y`, which by parametricity also gives map fusion for free (7.3.1). Forking shouldn't change the result: `fork(x) == x` (7.3.2). Then put on "your debugger hat" and look for a counterexample. One exists: with a fixed pool of one thread, `fork` submits a task that submits another task and blocks on it, and the two wait on each other forever (7.3.3). The law exposed an assumption, unbounded threads, that the first implementation never stated. The fix is a non-blocking representation in which a `Future` takes a callback instead of being waited on, built with a small actor (7.3.4).

**Generalise the combinators.** `choice` (pick one of two computations based on a `Par[Boolean]`) generalises to `choiceN`, then `choiceMap`, then `chooser`, which turns out to be `flatMap`, and `flatMap` reduces further to `join: Par[Par[A]] => Par[A]` (7.4). The [monad]({{< ref "functional-programming/02-abstractions/monads" >}}) wasn't the starting point; it was found by generalising.

The exercise connects to the rest of this note. `Par` is a purely functional description of parallel work, like a strategy or the `Par` monad in Haskell, but executed on JVM threads. The deadlock is a small instance of the thread-starvation problem that fibers and semantic blocking solve. And the callback-based `Future` of 7.3.4 is close to how effect runtimes represent asynchronous steps (Rosien, ch. 6, integrates callbacks into `IO` with `async`).

## Laws that say parallelism changes nothing


The same idea appears in each source as a law:

- Strategies: `` x `using` s == x `` for well-behaved strategies, by convention, not enforced (Marlow, ch. 3).
- Pilquist's `Par`: `fork(x) == x` (Pilquist et al., ch. 7.3.2).
- ZIO: the fork/join identity law, `effect.fork.flatMap(_.join) == effect`. Because every ZIO concurrency operator is built on fork and join, `a.zipPar(b)` should give the same result as `a.zip(b)`, and `foreachPar` as `foreach`, provided the effects themselves don't race on shared state. Structured concurrency is what makes the law hold (De Goes et al., ch. 7.1).

Each law lets you reason about the parallel program as if it were sequential. Each also comes with a fine-print exception: a strategy can be less defined than the original, a bounded pool can deadlock `fork`, and parallel effects that share a `Ref` are only as deterministic as their updates. Such laws are best used as property tests (see [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}})), as Pilquist's next chapter does when it tests `fork(x) == x` (Pilquist et al., ch. 8, "Testing Par").

See also: [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}), [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}), [Streams]({{< ref "functional-programming/03-building-programs/streams" >}}), [Referential transparency]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#referential-transparency), [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}), [Traversable and traverse]({{< ref "functional-programming/02-abstractions/traversable" >}}), [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}), Concepts.

## Library sources


- [Marlow 2013](/sources/programming/functional-programming/marlow-2013-parallel-and-concurrent-programming-in-haskell.pdf.enc), *Parallel and Concurrent Programming in Haskell*: ch. 1 (parallelism versus concurrency, determinism), Part I introduction (why automatic parallelisation fails, granularity), chs. 2 to 4 (`Eval`, sparks, deepseq, strategies, the identity property, the `Par` monad and its comparison with strategies), ch. 7 (threads and `MVar`), chs. 8, 9 and 11 (`async`, asynchronous exceptions, `mask`, thread leaks) and ch. 10 (STM, `retry`, `orElse`, fairness, and "Performance": the transaction log, validation at commit, why long transactions get re-executed).
- Płachta 2022, *Grokking Functional Programming*: ch. 10, "Concurrent programs" (concurrency versus parallelism, `Ref`, `parSequence`, fibers, `foreverM`, `start` and `cancel`, why manual fibers are a last resort).
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*: ch. 3 (no parallelism in `IO`, the `Parallel` type class, `parMapN`, `parTraverse`), ch. 4 (fibers, cancellation, rebuilding `parMapN`, racing and timeouts) and ch. 9 (`Ref`, `Deferred`, semantic blocking, concurrent state machines). The draft targets Cats Effect 2 (`ContextShift`, `cats.effect.concurrent`); Cats Effect 3 renamed or removed some of these, so the Scala snippets above use Cats Effect 3 names.
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*: chs. 5 to 8 (the fiber model, concurrency operators, supervision and structured concurrency, the fork/join identity law, interruption), chs. 9 and 10 (`Ref`, `Promise`), chs. 11 to 13 (`Queue`, `Hub`, `Semaphore`) and chs. 21 to 23 (STM, its limits and its implementation).
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala*, 2nd edition: ch. 7, "Purely functional parallelism" (designing `Par`, explicit `fork`, the representation, the laws of mapping and forking, the fixed-pool deadlock, the non-blocking implementation, generalising `choice` to `flatMap` and `join`).
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: ch. 16, "Concurrency" (GHC threads and capabilities, `-threaded` and `-N`, the `async` package with `withAsync` and `race`, mutable variables, channels and STM).

Further reading:

- Tim Harris, Simon Marlow, Simon Peyton Jones and Maurice Herlihy, "Composable Memory Transactions" (PPoPP 2005): the paper behind GHC's STM, `retry` and `orElse`.
- Simon Marlow, Ryan Newton and Simon Peyton Jones, "A Monad for Deterministic Parallelism" (Haskell Symposium 2011): the `Par` monad.
- Simon Marlow, Patrick Maier, Hans-Wolfgang Loidl, Mustafa Aswad and Phil Trinder, "Seq No More: Better Strategies for Parallel Haskell" (Haskell Symposium 2010): the current design of evaluation strategies.
- Nathaniel J. Smith, "Notes on structured concurrency, or: Go statement considered harmful" (blog post, 2018): the essay that popularised the term outside Scala.
- The Cats Effect 3 documentation on fibers, `Supervisor` and the concurrency type classes, to update Rosien's Cats Effect 2 material.
- [Serrano Mena 2022](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc), *Haskell: Almost Standard Libraries*: chapter 18, Async: the introduction gives a decision tree (`async` for IO, `monad-par` for cooperating pure code, `parallel` for containers); section 18.1, "Spawning", covers `concurrently` and `race`, the `Concurrently` applicative (`<*>` waits for both, `<|>` races), `withAsync` as a bracket, why two `wait`s are not `waitBoth`, and `poll`, `waitCatch` and `link`; section 18.2, "Communication", covers `TVar` counters, contention on `TVar (Map k v)` and `stm-containers`, and unbounded `TChan`/`TQueue`; section 18.3, "Pure and parallel", covers `spawnP`/`parMap`/`runPar` and a table of strategies (`r0`, `rseq`, `rdeepseq`, `parListChunk`, `parTraversable`); on *Concurrency in Haskell: threads, MVar and async*, *Software transactional memory* and *Strategies or Par?*.
