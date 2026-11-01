---
draft: false
toc: true
title: "Streams"
linkTitle: "Streams"
---

A stream is a sequence whose elements are produced on demand, possibly forever. In functional programming the idea runs from plain lazy lists, through Hughes's argument that laziness is glue for modular programs, to effectful streaming libraries (fs2 in Scala; conduit, pipes and streaming in Haskell) that keep the compositional style while doing I/O safely.

This note was written on 2026-11-05 from the library sources listed at the end. Passages moved in from earlier notes keep their original wording under "Earlier notes" headings, with commentary in callouts titled **Explanation** and **Critique**.

## Lazy lists as streams


In Haskell every list is already a stream. Because evaluation is non-strict (see [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}})), a list cell is built only when someone looks at it, so infinite lists are ordinary values:

```haskell
nats :: [Integer]
nats = [0 ..]

fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

-- take 10 fibs                          == [0,1,1,2,3,5,8,13,21,34]
-- head (filter (> 1000) (map (^ 2) nats)) == 1024
```


Scala is strict, so it needs a separate type. Since Scala 2.13 the standard library's lazy sequence is `LazyList` (the older `Stream` is deprecated); unlike the old `Stream`, it is lazy in its head as well as its tail.

```scala
val nats: LazyList[BigInt] = LazyList.iterate(BigInt(0))(_ + 1)
lazy val fibs: LazyList[BigInt] =
  BigInt(0) #:: BigInt(1) #:: fibs.zip(fibs.tail).map(_ + _)

fibs.take(10).toList                 // List(0, 1, 1, 2, 3, 5, 8, 13, 21, 34)
nats.map(n => n * n).find(_ > 1000)  // Some(1024)
```


Pilquist et al. build their own `LazyList` to show what is inside (ch. 5.2). A non-empty cell holds two thunks, `Cons(h: () => A, t: () => LazyList[A])`, and a smart constructor `cons` wraps the by-name arguments in `lazy val`s so each thunk is evaluated at most once. Without that memoisation, inspecting the head twice would compute it twice.

What laziness buys is visible in a trace (Pilquist, listing 5.3). For a strict `List`, `map(_ + 10).filter(_ % 2 == 0).map(_ * 3)` builds a full intermediate list at every stage. For a `LazyList` the stages interleave: `map` produces one element, `filter` tests it, and only then does `map` produce the next. No intermediate list is ever fully built, which is why the book calls lazy lists "first-class loops" (ch. 5.2). It also means a stage like `find` can be written as `filter(p).headOption` and still stop at the first match.

Infinite lazy lists are defined by corecursion: instead of consuming data down to a base case, the function produces data and keeps going as long as it is productive (Pilquist, ch. 5.4). The general tool is `unfold`, the dual of a fold (see [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds)):

```scala
def unfold[A, S](state: S)(f: S => Option[(A, S)]): LazyList[A] =
  f(state) match
    case Some((a, s)) => a #:: unfold(s)(f)
    case None         => LazyList.empty
```


Haskell's `Data.List.unfoldr` has the same shape.

Two cautions carry over from [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}). A memoised lazy list keeps every forced element alive for as long as something references its head, so `val xs = hugeLazyList; xs.foreach(...); xs.size` holds the whole thing in memory. And sharing is fragile: Pilquist notes that a self-referential `ones = cons(1, ones)` runs in constant memory while the `unfold` version does not, and that even `xs.map(x => x)` destroys sharing (ch. 5, footnote 9).

## Why laziness gives modularity


Hughes's *Why Functional Programming Matters* argues that the ways a language lets you divide a problem depend on the ways it lets you glue the parts back together, and that functional languages add two kinds of glue: higher-order functions and lazy evaluation (Hughes 1990, sections 2 to 4).

The lazy glue joins whole programs. In `g . f`, Hughes describes `f` and `g` as running "in strict synchronization": `f` runs only when `g` tries to read input, and only long enough to deliver it. If `g` stops early, `f` is abandoned, so `f` may even be non-terminating. That separates termination conditions from loop bodies. A program can be split into a *generator* that proposes many answers and a *selector* that picks one (section 4).

His first example is Newton-Raphson square roots. The conventional version is one indivisible loop. The lazy version is a generator and a selector:

```haskell
next :: Double -> Double -> Double
next n x = (x + n / x) / 2

within :: Double -> [Double] -> Double
within eps (a : b : rest)
  | abs (a - b) <= eps = b
  | otherwise          = within eps (b : rest)

squareRoot :: Double -> Double -> Double -> Double
squareRoot a0 eps n = within eps (iterate (next n) a0)
```


Hughes's `repeat f a` is what Haskell now calls `iterate`. The `within` pattern is partial, which is harmless here because `iterate` never ends. To stop on a relative rather than an absolute difference, you replace only the selector (`relative`, testing `abs (a / b - 1) <= eps`); the generator is untouched. The same selectors are then reused for numerical differentiation and integration (section 4.2 onward).

The second example is game-tree search (section 5): `evaluate = maximize . maptree static . prune 5 . gametree`. The tree from `gametree` is potentially infinite, and only lazy evaluation lets `prune 5` be a separate function rather than being folded into the generator. Laziness also keeps memory small, because `maximize` demands parts of the tree one at a time and the garbage collector can reclaim each part once it is done.

Pilquist et al. state the same lesson in Scala: laziness separates the description of a computation from the how and when of its evaluation, so one description can be reused and only the needed part run (ch. 5.3 and 5.5).

Hughes also notes the limit. Lazy evaluation and side effects cannot comfortably coexist, because laziness gives up direct control over when, or whether, each part runs, and predicting effects would then need global knowledge of the context (section 4). That limit is what effectful streams are built to get around.

## Effectful streams

### Why lazy I/O isn't enough


Real streams come from files, sockets, databases and message brokers. The tempting shortcut is lazy I/O: hand back a lazy list whose cells perform reads when they are forced. Haskell's `readFile`, `getContents` and `hGetContents` do exactly this, using `unsafeInterleaveIO` underneath.

```haskell
-- fine: the file is read incrementally and closed when fully consumed
countLines :: FilePath -> IO Int
countLines path = length . lines <$> readFile path

-- broken: withFile closes the handle before the string is forced
bad :: IO ()
bad = do
  s <- withFile "data.txt" ReadMode hGetContents
  putStr s
```


What `bad` does depends on the GHC version: older versions silently produced a truncated string, newer ones raise a "delayed read on closed handle" error (check the exact behaviour for your version). Either way, the program's meaning depends on when a pure-looking value happens to be evaluated.

Pilquist et al. build the Scala equivalent, `IO[LazyList[String]]` that closes the file when the end is reached, and list what goes wrong (ch. 15.1):

- It isn't resource-safe. The file closes only if the consumer reads to the end, and consumers often stop early (`exists` stops at the first match).
- The list can be traversed again after the file is closed. If cells are memoised, the whole file stays in memory; if not, the second traversal reads a closed handle.
- Forcing has side effects, so two threads traversing it at once behave unpredictably.
- Using the value correctly needs out-of-band knowledge of where it came from, which defeats composition by type.

The alternative the book starts from, a hand-written loop inside `IO` with a `try`/`finally`, is incremental and resource-safe but monolithic: the counting logic is tangled with iteration and file handling, and every variation means rewriting the loop (ch. 15.1). Bragilevsky shows the same trade-off in Haskell. A list version that prints numbers in columns and also sums them is compositional but keeps the whole list in memory; the constant-memory `foldM` version interleaves the two jobs by hand and loses compositionality (*Haskell in Depth*, ch. 14.1.2).

Bragilevsky gives the requirements the Haskell community settled on (ch. 14.1): stages should be clearly separated so they compose, they should be able to run effects of your choice while processing, and data should be processed in chunks of predictable size so memory doesn't leak.

### Streams as values


Plachta's chapter on streams sets the scene by comparing Java streams and Python generators. They are already lazy and support separation of concerns (the consumer that calls `limit(3)` knows nothing about how elements are made) and inversion of control (a function receives a stream instead of calling a data source). But they treat pure and impure producers alike: `Stream.generate(() -> apiCall())` runs the side effect each time an element is pulled, with no type-level trace of it. And a Java `Stream` can be consumed only once (Plachta, ch. 9).

A functional stream is an immutable value describing a stream-processing program, just as an `IO` value describes an effectful program. Nothing runs until it is compiled into an effect and that effect is run. In fs2 the type `Stream[F, O]` says it all: `F` is the effect type and `O` the output type, so `Stream[Pure, Int]` makes integers without effects and `Stream[IO, BigDecimal]` may perform `IO` effects while producing (Plachta, ch. 9). See [Effect Systems]({{< ref "functional-programming/effect-systems" >}}) for `IO` itself.

```scala
import cats.effect.IO
import fs2.Stream

val numbers = Stream(1, 2, 3)
numbers.filter(_ % 2 != 0).toList            // List(1, 3); reusable, unlike Java
Stream(1, 2, 3).repeat.take(8).toList        // List(1, 2, 3, 1, 2, 3, 1, 2)

def castTheDie(): IO[Int] = ???
val casts: Stream[IO, Int] = Stream.eval(castTheDie()).repeat
val firstSix: IO[List[Int]] = casts.filter(_ == 6).take(1).compile.toList
val hundred: IO[Unit]       = casts.take(100).compile.drain
```


`Stream.eval` lifts one `IO` into a one-element stream. `repeat` is a combinator, defined from the primitive `append` and recursion, and it is safe on an infinite stream because `append` is lazy. `compile.toList` and `compile.drain` turn the stream into an `IO`. Compiling the infinite `casts` with `toList` would type-check and never finish, which is why `drain`, returning `IO[Unit]`, exists (Plachta, ch. 9).

## The core model: pull-based streams


Under the different APIs, the libraries share one idea: a stream is a program that can interleave three kinds of step, emitting an element, running an effect, and finishing with a result.

Bragilevsky derives it from scratch (ch. 14.1.1). Start with a list and add effects and a final result:

```haskell
data Stream e m r
  = Element e (Stream e m r)   -- emit an element, then continue
  | Action (m (Stream e m r))  -- run an effect to get the rest
  | Result r                   -- finish with a result
```


Then generalise the `Element` case to any functor `f`, giving `Stream f m r = Step (f (Stream f m r)) | Effect (m (Stream f m r)) | Return r`, with elements carried by the pair-like functor `data Of a b = a :> b`. That is exactly the type in the `streaming` package. With a general functor, chunking a stream into substreams has type `Stream (Stream f m) m r`, which never has to hold a whole group in memory (ch. 14.1.2).

Pilquist et al. take the same route in Scala (ch. 15.2 and 15.3). A `Pull[O, R]` outputs any number of `O`s and then finishes with one `R`:

```scala
enum Pull[+O, +R]:
  case Result[+R](result: R) extends Pull[Nothing, R]
  case Output[+O](value: O) extends Pull[O, Unit]
  case FlatMap[X, +O, +R](source: Pull[O, X], f: X => Pull[O, R])
    extends Pull[O, R]
```


Its `flatMap` sequences on the final result, not on each output, so `p1 >> p2` concatenates two pulls. A stream is then `opaque type Stream[+O] = Pull[O, Unit]`, and a stream transformation is a function, `type Pipe[-I, +O] = Stream[I] => Stream[O]`. Adding an effect parameter and an `Eval(action: F[R])` case gives `Pull[F, O, R]` and `Stream[F, O]`. The design is modelled on fs2, which has the same `Stream`, `Pull` and `Pipe` split.

"Pull-based" means the consumer drives. Nothing is produced until the interpreter (`fold`, `compile`, `runConduit`, `runEffect`) steps the stream to ask for the next element, which is Hughes's "strict synchronization" with effects added. Early termination comes for free: if the consumer stops pulling, the producer simply never runs again. What does *not* come for free is releasing the producer's resources at that point, which is the subject of the resource-safety section.

The result type `R` matters. `streaming`'s folds return both the fold's value and the stream's result (`S.sum :: Stream (Of a) m r -> m (Of a r)`), and `S.copy` duplicates a stream's steps so two consumers can run in one pass. Bragilevsky's constant-memory sum-and-tabulate becomes the composition `fmap S.fst' . S.mapM_ TIO.putStrLn . tabulateS cols . S.store S.sum` (ch. 14.1.2).

## fs2


fs2 (Functional Streams for Scala) is the Typelevel streaming library, built on Cats Effect. It began as scalaz-stream, which grew out of the first edition of *Functional Programming in Scala* (Volpe 2023, ch. 5). Its core types:

- `Stream[F, O]`: the user-facing type, a wrapper over `Pull[F, O, Unit]`.
- `Pull[F, O, R]`: the lower-level monad for writing custom stateful transformations.
- `Pipe[F, I, O]`: an alias for `Stream[F, I] => Stream[F, O]`, applied with `through`.
- `Chunk[O]`: a strict, finite sequence with index access (Volpe, ch. 5.3.2). fs2 streams move chunks, not single elements, so per-element overhead is paid per chunk.

A file conversion pipeline in the style of the fs2 README, the same program Pilquist et al. build towards in ch. 15.3:

```scala
import cats.effect.{IO, IOApp}
import fs2.text
import fs2.io.file.{Files, Path}

object Convert extends IOApp.Simple:
  def toCelsius(f: Double): Double = (f - 32.0) * (5.0 / 9.0)

  def run: IO[Unit] =
    Files[IO].readAll(Path("fahrenheit.txt"))
      .through(text.utf8.decode)
      .through(text.lines)
      .filter(s => s.trim.nonEmpty && !s.startsWith("//"))
      .map(line => toCelsius(line.toDouble).toString)
      .intersperse("\n")
      .through(text.utf8.encode)
      .through(Files[IO].writeAll(Path("celsius.txt")))
      .compile
      .drain
```


The file is read in chunks, both files are closed when the stream ends for any reason, and every stage is an ordinary value that can be tested or reused alone.

When no combinator fits, you drop to `Pull`. `uncons1` asks for the next element, `output1` emits one, and `.stream` turns a `Pull[F, O, Unit]` back into a stream:

```scala
import fs2.{Pipe, Pull, Stream}

def evens[F[_]]: Pipe[F, Int, Int] =
  def go(s: Stream[F, Int]): Pull[F, Int, Unit] =
    s.pull.uncons1.flatMap {
      case Some((n, rest)) =>
        (if n % 2 == 0 then Pull.output1(n) else Pull.done) >> go(rest)
      case None => Pull.done
    }
  in => go(in).stream
```


Volpe's book shows fs2 in service code (ch. 5):

- **State machines.** A finite state machine `(S, I) => F[(S, O)]` has exactly the shape of `evalMapAccumulate`, so `commands.evalMapAccumulate(TradeState.empty)(fsm.run)` runs a trading engine over an incoming stream of commands (ch. 5.1).
- **Resources.** `Stream.resource` lifts a Cats Effect `Resource` (an HTTP server, a Redis connection) into a stream so the app's lifetime and its resources' lifetimes are the same thing (ch. 5.2).
- **Pipelines.** `parEvalMap(n)` processes up to `n` elements concurrently and keeps their order; `parEvalMapUnordered` doesn't keep order. `chunkN(1000)` batches a fast stream for an expensive sink such as a database (ch. 5.3).
- **Composition of services.** `c1.concurrently(p2)` runs `p2` in the background and stops it when `c1` ends; `Stream(http, subs, alerts).parJoin(3)` runs independent streams side by side (ch. 5.4).

The concurrency combinators (`concurrently`, `merge`, `parJoin`, `parEvalMap`) run streams on Cats Effect fibers; see [Concurrency]({{< ref "functional-programming/concurrency" >}}).

### Earlier notes


fs2 articles:

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
fs2 is the streaming library of the Typelevel ecosystem, built on Cats Effect. A `Stream[F, O]` describes a possibly infinite sequence of `O` values produced with effects in `F`, with resource safety and backpressure.
{{< /callout >}}


<https://blog.rockthejvm.com/fs2/>

## Haskell: conduit, pipes and streaming


Bragilevsky traces the Haskell streaming libraries to Oleg Kiselyov's iteratees and names conduit (Michael Snoyman) and pipes (Gabriel Gonzalez) as the two established ones, each with a large ecosystem. He teaches the newer `streaming` package instead, as simpler and often faster (ch. 14.1.1). All three are pull-based and share the model above. What differs is how a component's type is shaped:

| Library | Core type | Read | Emit | Compose | Run |
|---|---|---|---|---|---|
| conduit | `ConduitT i o m r` | `await` | `yield` | `.\|` | `runConduit` |
| pipes | `Proxy a' a b' b m r`, with aliases `Producer`, `Pipe`, `Consumer`, `Effect` | `await` | `yield` | `> -> ` | `runEffect` |
| streaming | `Stream (Of a) m r` | pattern match via `S.next`, or folds | `S.yield` | ordinary function composition | the fold returns an `m` action |

In conduit and pipes a component has both an input and an output type: it is a stage, and a pipeline is built by fusing stages. In `streaming` a stream has only an output type, and a transformation is a plain function from stream to stream, closer to lists and to fs2's `Pipe`.

```haskell
-- conduit
import Conduit
main1 :: IO ()
main1 = runConduit $ yieldMany [1 .. 10] .| mapC (* 2) .| filterC (> 10) .| mapM_C print

-- pipes
import Pipes
import qualified Pipes.Prelude as P
main2 :: IO ()
main2 = runEffect $ each [1 .. 10] >-> P.map (* 2) >-> P.filter (> 10) >-> P.print

-- streaming
import qualified Streaming.Prelude as S
main3 :: IO ()
main3 = S.print $ S.filter (> 10) $ S.map (* 2) $ S.each [1 .. 10]
```


The pipes type has four interface parameters because pipes is bidirectional: `a'` and `a` are what a component sends upstream and receives from it, `b'` and `b` what it receives from and sends downstream. The common aliases close off the directions they don't use.

## Resource safety


A stream that holds a file handle, socket or connection has to release it exactly once, as soon as it is no longer needed. Pilquist et al. list the three ways a stream can end, all of which must release (ch. 15.3.3):

- **Producer exhaustion:** the source has nothing more to emit.
- **Early termination:** a consumer such as `take(5)` discards the rest.
- **Abnormal termination:** an exception is raised.

Exhaustion and errors can be handled with error handlers and an `onComplete` combinator, but that isn't compositional. Move a `mapEval` or a `take(10)` to after the `onComplete` and the finaliser is skipped (ch. 15.3.2). The book's answer is to make finalisers part of the interpreter. A `resource(acquire)(release)` constructor registers `release` in a *scope*; scopes form a tree, closing a scope closes its subscopes first and runs finalisers in last-in, first-out order, and every operation that can discard the rest of a stream (`take`, `takeWhile`) opens a fresh scope so its subtree is closed when it stops (ch. 15.3.3). With that, `flatMap` over a stream of file names, opening each file in turn, is resource-safe with no extra code (ch. 15.3.4).

In fs2 this is `Stream.bracket` and `Stream.resource`:

```scala
import cats.effect.IO
import fs2.Stream
import scala.io.Source

def lines(path: String): Stream[IO, String] =
  Stream.bracket(IO(Source.fromFile(path)))(src => IO(src.close()))
    .flatMap(src => Stream.fromIterator[IO](src.getLines(), 64))

// the file is closed after five lines, not at the end of the program
val firstFive: IO[List[String]] = lines("big.txt").take(5).compile.toList
```


The Haskell libraries mostly rely on the `resourcet` package. A `MonadResource` computation registers release actions, and `runResourceT` guarantees they run, exceptions included (Bragilevsky, ch. 14.2.1). Bragilevsky's file copy with `streaming-bytestring`:

```haskell
copyFile :: FilePath -> FilePath -> IO Int
copyFile fIn fOut = do
  (len :> ()) <- runResourceT
    $ BS.writeFile fOut
    $ BS.length
    $ BS.copy
    $ BS.readFile fIn
  pure len
```


conduit has `runConduitRes` (`runConduit` under `runResourceT`), so `runConduitRes $ sourceFile "in.txt" .| sinkFile "out.txt"` copies a file safely. pipes keeps resource handling out of its core; the `pipes-safe` package adds it.

## Backpressure


Backpressure is the problem of a producer that is faster than its consumer. Ghosh describes it for push-based stream systems such as Akka Streams: without handling, the consumer drops data or runs out of memory. Reactive Streams implementations solve it by sending demand upstream, opposite to the data, so the sink tells the source how much it can take (*Functional and Reactive Domain Modeling*, ch. 6.4.3). He also notes that pull models have backpressure built in, because the reader pulls at the rate it can consume, while push models need an explicit mechanism (ch. 8).

That is why pull-based libraries rarely mention it. In a single-threaded fs2, conduit or pipes pipeline, the producer runs only when the consumer asks for the next element, so there is no buffer to overflow.

The question comes back once stages run concurrently, because two fibers are now joined by a buffer:

- Bounded queues give backpressure. A Cats Effect `Queue.bounded` makes `offer` wait when the queue is full. Volpe's in-memory producer and consumer communicate through a `Queue[F, Option[A]]`, with `None` marking the end of the stream (ch. 5.4.1).
- `parEvalMap(n)` bounds how much work is in flight.
- In Volpe's fan-out examples each subscriber of an fs2 `Topic` has a bounded queue (`subscribe(1000)`). As I understand fs2's `Topic`, a full subscriber queue makes publishers wait (check against the fs2 docs).
- For the "fast producer, slow consumer" case Volpe batches: `chunkN(1000)` then a parallel `persist` per chunk, so the expensive sink is called less often (ch. 5.3.2).

In Haskell, concurrency for these libraries comes from add-on packages (for example `stm-conduit` and `pipes-concurrency`), and the same rule applies: a bounded channel between stages is what gives backpressure.

## Stream fusion


Composing stream stages costs something. Each stage allocates the cells or steps that pass values to the next. *Fusion* (or deforestation) is the compiler optimisation that merges adjacent stages and removes those intermediate values. My earlier notes on the fusion laws and the two shortcut-fusion families are in [Study Log]({{< ref "functional-programming/study-log" >}}#271123).

For Haskell lists GHC uses foldr/build fusion: producers are written with `build`, consumers with `foldr`, and one rewrite rule, `foldr k z (build g) = g k z`, removes the list between them. Bragilevsky works through `isPrime n = all notDividedBy [2 .. n-1]` and shows that with `-O1` GHC compiles it to a loop with no list at all (ch. 9.3).

foldr/build handles `map`, `filter` and list comprehensions but not left folds such as `sum` or zips that consume two lists at once. *Stream fusion* (Coutts, Leshchinskiy and Stewart 2007) covers those too. It represents a sequence as its unfolding, a stepper function plus a hidden state:

```haskell
{-# LANGUAGE ExistentialQuantification #-}
data Step a s = Done | Yield a s | Skip s
data Stream a = forall s. Stream (s -> Step a s) s

filterS :: (a -> Bool) -> Stream a -> Stream a
filterS p (Stream next s0) = Stream next' s0
  where
    next' s = case next s of
      Done                   -> Done
      Skip s'                -> Skip s'
      Yield x s' | p x       -> Yield x s'
                 | otherwise -> Skip s'
```


List functions are defined as `map f = unstream . maps f . stream`, and one rewrite rule, `stream (unstream s) = s`, removes the conversions between adjacent functions. The rule itself only removes lists the encoding introduced. The real gain comes from the fact that every stepper is non-recursive. `Skip` is what lets `filter` drop an element without looping, so ordinary inlining and case simplification can merge a whole pipeline into one loop (Coutts et al. 2007, sections 2 and 7). The `vector` library uses stream fusion; GHC's list library still uses foldr/build.

Fusion connects back to the start of this note. A lazy list already interleaves its stages (Pilquist's "first-class loops"), but it still allocates a cell and a thunk per element per stage. Fusion removes even that. Effectful streaming libraries mostly don't rely on compiler fusion. conduit calls its `.|` operator "fusion", meaning composing two components into one, not deforestation. fs2 instead pays its per-step overhead once per chunk. Kiselyov et al. (2017) reach fused, hand-written-quality code by staging instead of by optimiser rewrites.

See also: [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}), [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}), [Concurrency]({{< ref "functional-programming/concurrency" >}}), [Monads]({{< ref "functional-programming/monads" >}}), [Study Log]({{< ref "functional-programming/study-log" >}}).

Assembled on 2026-11-05; earlier fragments came from [To Sort]({{< ref "functional-programming/to-sort" >}}).

## Library sources


- Płachta 2022, *Grokking Functional Programming*: ch. 9, "Streams as values" (Java streams and Python generators compared, producers and consumers, fs2 `Stream[F, O]`, `eval`, `repeat`, `compile`, `sliding`, `zipLeft` with `fixedRate`).
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: ch. 5, strictness and laziness (lazy lists, memoisation, the interleaving trace, corecursion and `unfold`); ch. 15, stream processing and incremental I/O (problems with imperative and lazy I/O, `Pull`, `Stream` and `Pipe`, effects, error handling, scopes and resource safety).
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: section 4 (lazy evaluation as glue, Newton-Raphson, differentiation) and section 5 (game trees and alpha-beta).
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture*: ch. 5, "Effectful streams" (FSMs with `evalMapAccumulate`, `Stream.resource`, real-time and batching pipelines, chunks, `concurrently` and `parJoin`, producer and consumer over a `Queue`).
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: ch. 14.1 and 14.2 (why lazy I/O falls short, a stream type from scratch, the `streaming` package, `copy` and `store`, `resourcet` and `streaming-bytestring`); ch. 9.3 (foldr/build list fusion by example).
- [Coutts et al. 2007](/sources/programming/functional-programming/coutts-2007-stream-fusion.pdf.enc), *Stream Fusion: From Lists to Streams to Nothing at All*: sections 1 to 3 (foldr/build and its gaps, the `Stream` and `Step` types, `stream`/`unstream`, `Skip`).
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*: ch. 6.4.3 (back-pressure in push-based streams) and ch. 8 (pull models have built-in back-pressure).

Further reading:

- [Kiselyov et al. 2017](/sources/programming/functional-programming/kiselyov-2017-stream-fusion-to-completeness.pdf.enc), *Stream Fusion, to Completeness*
- [Svenningsson 2002](/sources/programming/functional-programming/svenningsson-2002-shortcut-fusion-accumulating-parameters.pdf.enc), *Shortcut Fusion for Accumulating Parameters and Zip-like Functions*
- [Hinze et al. 2010](/sources/programming/functional-programming/hinze-2010-theory-and-practice-of-fusion.pdf.enc), *Theory and Practice of Fusion*
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*: ZIO's `ZStream`, the main alternative to fs2 in Scala.
