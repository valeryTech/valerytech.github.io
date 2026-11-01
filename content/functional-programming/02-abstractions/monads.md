---
draft: false
toc: true
title: "Monads in Haskell and Scala"
aliases:
  - "/functional-programming/monads/"
description: "Monads as a way to glue functions into sequential computations, map, flatMap and for expressions in Scala, and the Option, Writer, State, Reader and IO monads, including what IO does and doesn't make pure."
weight: "50"
linkTitle: "Monads"
---

A monad is the glue for composing functions whose results come in a context: failure, a log, state, configuration or I/O. This note covers why monads exist and the standard instances (Option, Writer, State, Reader and IO) in Haskell and Scala.

## Why monads

### Gluing functions together


> The hard part of functional programming involves how you *glue together* all of your pure functions to make a complete application. Because this process feels like you're writing "glue" code, I refer to this process as "gluing," and as I learned, a more technical term for this is called "binding."

Ordinary functions compose directly: given `f: A => B` and `g: B => C`, `g(f(a))` just works. But often each step returns its result in a wrapper, because it can fail, log or perform I/O, and then plain composition no longer type-checks:

```scala
def f(s: String): Option[Int] = s.toIntOption
def g(n: Int): Option[Double] = if n != 0 then Some(1.0 / n) else None

// g(f("4"))  does not compile: g wants an Int, f returns Option[Int]
f("4").flatMap(g)                        // Some(0.25)
for { n <- f("4"); r <- g(n) } yield r   // the same, as a for-comprehension
```


Binding is the glue: an operation that takes a wrapped value and a function producing the next wrapped value, and handles the wrapper between them. Scala calls it `flatMap`, Haskell `>>=` ("bind").

A monad is a type with such an operation plus a way to wrap a plain value (`pure`, `return` or `unit`), obeying three laws:

- left identity: wrapping a value and then binding a function over it is the same as calling the function;
- right identity: binding with the wrapping function changes nothing;
- associativity: binding is associative, so a chain of steps can be grouped either way.

### Sequential computation


> There's a good reason for their ubiquity: monads encapsulate the essence of *sequential computation*.

"Sequential" here means that each step can depend on the result of the previous one, not that steps happen one after another in time. The list monad, for instance, describes all combinations of choices, not a timeline. The defining feature compared with [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}) is that the next computation is chosen from the previous result.

The aim is to make it simple to compose pure functions, that is, mathematical functions without side effects. More precisely, the functions being composed have types like `A => F[B]`. They stay pure because the effect (failure, logging, state, I/O) is described in the return type instead of being performed. Such functions are called Kleisli arrows, and a monad is exactly what makes them composable.

Caveat: monads are not only for pure languages. Scala's `Option`, `Either` and `Future` are monads whether or not the rest of the program is pure.

### The monadic operations


The core operations:

- `pure` (or `return`) puts a value into the context.
- `>>=` (bind) feeds the result of one computation into a function that returns the next one.

Around them:

- `>>` sequences two computations and ignores the first result;
- `=<<` is bind with the arguments flipped;
- `>=>` is Kleisli composition: it composes `a -> m b` with `b -> m c`;
- `join :: m (m a) -> m a` flattens one level of context.

In Scala, bind is `flatMap`, and `for` comprehensions are sugar for `flatMap` and `map`, as `do` notation is sugar for `>>=` in Haskell.

### Why monads are hard to explain


> This is why it's so hard to explain monads to beginners, especially with canned tutorials that try to explain what monads *are* without spending too much time on what they're *for*. Monads are the solution to a problem that beginners haven't yet experienced for themselves; and, as a result, they feel pointless, like something out of high-school math.

Brent Yorgey's 2009 post, linked below, is the one that named the "monad tutorial fallacy". It and the two-wrongs article go with the quote above.

- Video on monads: <https://www.youtube.com/watch?v=C2w45qRc3aU>
- Haskell Wiki, Monad tutorials timeline: <https://wiki.haskell.org/Monad_tutorials_timeline>
- Haskell Wiki, All About Monads: <https://wiki.haskell.org/All_About_Monads>
- two-wrongs, "The 'what are monads' fallacy": <https://two-wrongs.com/the-what-are-monads-fallacy>
- Brent Yorgey, "Abstraction, intuition, and the 'monad tutorial fallacy'" (2009): <https://byorgey.wordpress.com/2009/01/12/abstraction-intuition-and-the-monad-tutorial-fallacy/>

### `map`, `flatMap` and for expressions in Scala


Collections that support `map` and `flatMap` are called *monadic*. Two qualifications:

- Having `map` and `flatMap` isn't quite enough. A monad also needs a way to wrap a plain value, and the operations must obey the monad laws.
- The idea isn't limited to collections: `Option`, `Either`, `Try`, `Future` and the IO types are monadic too.

FP developers say that a method like `apply` "lifts" an ordinary value into the wrapper: `List(1)`, `Some(1)`, `Option(1)`. In the monad vocabulary this is `pure` (Cats, Haskell), `return` (Haskell) or `unit` (*Functional Programming in Scala*). "Lift" is also used for functions: `map` lifts `A => B` to `F[A] => F[B]` (see [Functor: Lifting]({{< ref "functional-programming/02-abstractions/functor" >}}#lifting)).

Caveat: `Option.apply` is not a lawful `pure`, because `Option(null)` is `None`. Wrapping a value and then binding a function over it should be the same as calling the function, and with `null` it isn't. `Some(_)` is the lawful one; `Option(_)` is a bridge from nullable values (see [Option](#option) below).

For something to be used in a for expression, it doesn't have to be a class that implements `map` and `flatMap` (like a sequence); the expression after ` <- ` just has to have a type with those methods. The compiler rewrites for-comprehensions syntactically, so there is no `Monad` trait to extend. The methods needed are:

- `flatMap` and `map` for a `for ... yield` with several generators;
- `withFilter` if there are `if` guards;
- `foreach` for a `for` without `yield`.

Extension methods or implicit conversions count too. So the value you iterate over (often the return value of a function) decides it, not the class where the for-expression is written, and the type need not be lawful. Desugaring is shown in [In Scala]({{< ref "functional-programming/02-abstractions/map-flatmap" >}}#in-scala).

## Option


Errors as values in general, with `Either` and `Try`, are in [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}).

In Haskell `Maybe` makes it impossible to forget that a value might be missing. Haskell has no `null` at all; `Maybe` is how optional values are written, and the type checker makes you deal with `Nothing` before you can use the value. Caveat: you can still opt out. `fromJust Nothing` crashes at runtime, and so do partial functions such as `head []`. What `Maybe` guarantees is that absence is visible in the type, not that you handle it well.

A common pattern in Haskell is to separate the code that has to worry about a problem (for example, missing values) from the code that doesn't. Write the logic as an ordinary function on plain values, then apply it to wrapped values with `fmap`, `<*>` or `>>=`. Only the code at the edges sees `Maybe`; the core never checks for `Nothing`.

The same shape in Scala is a for-comprehension over two `Option`s:

```scala
for { a <- toInt(x); b <- toInt(y) } yield a + b
```


The function concentrates on the happy path, where both operations succeed, and lets the Option monad deal with the cases where at least one fails. With two operations there are four combinations, and three of them involve a failure: the first fails, the second fails, or both fail. `flatMap` turns all three into `None` without any code for them.

`Option(...)` is the adapter for APIs that signal absence with `null`:

```scala
val chainedResult = Option(unsafeMethod()).orElse(Option(backupMethod()))
```


`Option(x)` gives `None` when `x` is `null` and `Some(x)` otherwise. `orElse` takes its argument by name, so `backupMethod()` runs only if the first result is `None`.

Caveat: `Option` wasn't created for unsafe APIs; it models absence in general, and `Option(...)` is only the bridge from null-returning code. It doesn't help if `unsafeMethod()` throws an exception. That needs `Try(unsafeMethod())` or `Either`, and `Try(...).toOption` turns a failure into `None`.

## Writer


The Writer monad is for values that have another value attached, acting as a log. Writer lets you run computations while all the log values are combined into one log that is attached to the result.

"Combined" means combined with the log's monoid operation, so the log type must be a monoid (see [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid)): lists and strings append, `Sum` adds.

```haskell
import Control.Monad.Writer

half :: Int -> Writer [String] Int
half n = do
  tell ["halving " ++ show n]
  pure (n `div` 2)

runWriter (half 8 >>= half)  -- (2,["halving 8","halving 4"])
```


Caveat: Writer is a poor fit for application logging. The log only becomes available when the whole computation finishes, and the classic lazy and strict implementations can build up large unevaluated logs (space leaks). The `transformers` package added a continuation-passing variant (`Control.Monad.Trans.Writer.CPS`) for that reason. Writer works well for small accumulations such as collecting warnings or counting steps.

- Philip Schwarz, Writer monad slides: <https://speakerdeck.com/philipschwarz/writer-monad>
- Haskell Wiki, All About Monads, the Writer monad: <https://wiki.haskell.org/All_About_Monads#The_Writer_monad>

## State


A *stateful computation* is a function that takes some state and returns a value along with some new state. The State monad is just an abstraction for such a function: it takes a state and returns an intermediate value and a new state.

In code: Haskell's `State s a` wraps `s -> (a, s)`, and in Scala it can be written as a case class around `S => (A, S)`. The monad part is `flatMap`, which runs one such function, passes the new state to the next one, and so threads the state through without you passing it by hand:

```scala
case class State[S, A](run: S => (A, S)):
  def flatMap[B](f: A => State[S, B]): State[S, B] =
    State { s => val (a, s1) = run(s); f(a).run(s1) }
  def map[B](f: A => B): State[S, B] =
    flatMap(a => State(s => (f(a), s)))

val next: State[Int, Int] = State(n => (n, n + 1))   // return the counter, then increment it
val three = for { a <- next; b <- next; c <- next } yield List(a, b, c)
three.run(10)  // (List(10, 11, 12), 13)
```


Cats provides a ready-made `cats.data.State`. It puts the state *first* in the pair (`S => (S, A)`), and `run(10)` returns an `Eval`, so you call `.value` on the result.

Alvin Alexander compares state handling to building a list:

> The concept of handling state in FP applications is often similar to pushing items onto a list

The source is probably his book *Functional Programming, Simplified*, whose State lessons are what Schwarz's *State Monad* slides follow; the exact sentence needs checking against the book, which isn't in the library. The analogy is loose. What it gets right: you never change the old state, you build a new value from it, as consing onto an immutable list leaves the old list intact. But the State monad isn't about a growing collection. The state can be any value (a counter, a random-number seed, a game board), and each step replaces it.

To understand State by taking it apart:

- [ ] State monad investigation: work through state-monad.pdf ([PDF](/sources/programming/scala/schwarz-2019-state-monad.pdf.enc)) and the GitHub post (which post is not recorded). Write `State` with its `map` and `flatMap` by hand, take a short for-comprehension like the counter above, desugar it into nested `flatMap` and `map` calls, then inline the definitions until only plain functions on `(value, state)` pairs remain. At that point it is clear that the monad only passes the state from each step to the next. Schwarz's slides take roughly this route.

Philip Schwarz's State slides were also noted as kept "in projects". The *State Monad* slides in the library may be the ones meant (needs checking).

Haskell:

- brandon.si, "The State monad: a tutorial for the confused": <http://brandon.si/code/the-state-monad-a-tutorial-for-the-confused/>
- Hugo Peters, blog post 13: <https://hugopeters.me/posts/13/>
- Reddit, "How to get into State monad": <https://www.reddit.com/r/haskell/comments/wtgq7o/how_to_get_into_state_monad/>

Scala:

- Scala.io talk on the State monad (slides, dgalichet): <https://www.slideshare.net/dgalichet/scalaio-statemonad?from_search=2>
- earldouglas.com, State monad talk slides: <https://earldouglas.com/talks/state-monad/slides.html#(1)>
- Medium, "State monad unlocked": <https://afsal-taj06.medium.com/state-monad-unlocked-e946becf0f6f>
- Cats documentation, the `State` data type (the reference for the Scala version): <https://typelevel.org/cats/datatypes/state.html>
- Philip Schwarz, "From Scala monadic effects to Unison algebraic effects" (slides): <https://www.slideshare.net/pjschwarz/from-scala-monadic-effects-to-unison-algebraic-effects>
- blog.tmorris.net, "Memoisation with State using Scala": <https://blog.tmorris.net/posts/memoisation-with-state-using-scala/index.html>

## Reader


Functions from a fixed input type `r`, written `(( -> ) r)`, form a functor, an applicative and a monad. Each instance passes the same `r` to every part:

```haskell
fmap f g  = \r -> f (g r)            -- composition
pure x    = \_ -> x                  -- const: ignore the environment
f <*> g   = \r -> f r (g r)          -- both sides get the same r
m >>= k   = \r -> k (m r) r          -- the next step also gets r

((+) <$> (*2) <*> (+10)) 3           -- (3*2) + (3+10) = 19
```


The `Reader r a` type in `mtl` and `transformers` is a wrapper around `r -> a` with `ask` (get the environment), `asks f` (get part of it) and `local` (run a sub-computation with a modified environment). It is used to pass configuration or dependencies implicitly instead of threading a parameter through every call.

Two short answers to the Stack Overflow questions below, worked out from the instances above:

- What can the Reader monad do that the applicative can't? Nothing: for functions, `m >>= k` equals `flip k <*> m`, so Reader's `Monad` instance adds no power over its `Applicative`.
- What does `join` do on functions? It duplicates the argument: `join f = \x -> f x x`, so `join (+) 3` is `6`.

Still to do:

- [ ] Work through ChatGPT's answers about `(( -> ) r)` as the Reader applicative, together with the material from *Learn You a Haskell*.

Links:

- ssanj, "Functor, Applicative and Monad instances for Reader" (2018): <https://blog.ssanj.net/posts/2018-03-05-functor-applicative-and-monad-instances-for-reader.html>
- twopoint718, a gist (topic not checked): <https://gist.github.com/twopoint718/c02164137c6fca9e0c4c>
- Stack Overflow, "What can the Reader monad do that applicative functions cannot?": <https://stackoverflow.com/questions/55797418/what-can-the-reader-monad-do-that-applicative-functions-cannot>
- Stack Overflow, "Is there any intuition to understand join two functions in monad?": <https://stackoverflow.com/questions/32323680/is-there-any-intuition-to-understand-join-two-functions-in-monad>
- Dollar Shave Club engineering, "The Reader monad: example, motivation": <https://engineering.dollarshaveclub.com/the-reader-monad-example-motivation-542c54ccfaa8>
- dev.to, "Grokking the Reader monad": <https://dev.to/choc13/grokking-the-reader-monad-4f45>
- Reddit, "What are the other use cases of the Either monad?" (about Either, not Reader): <https://www.reddit.com/r/functionalprogramming/comments/myz9ju/what_are_the_other_use_cases_of_the_either_monad/>

## IO

### Does IO make I/O pure?


> Before you jump into using the IO monad, let me share a personal warning: Some developers say that the IO monad somehow makes I/O pure. This isn't true -- and I wasted a lot of time trying to understand that claim.
>
> The trick of the IO monad is that it lets you write I/O functions as effects. Philosophically, what happens is that you use IO to describe how an I/O function works. Then, instead of dealing with the result of the I/O function at the time when the I/O function appears to be called, you defer the actual action until some time later when you really want it to be triggered.

The disagreement is about words. IO doesn't make the I/O pure: reading a file still reads a file. What it makes pure is the code that *builds* I/O. A function returning `IO String` returns the same description every time it is called, and evaluating it has no effect. Only running the description (the runtime executing `main`, or `unsafeRunSync()` in Cats Effect) performs the effect. So "IO makes functions that do I/O referentially transparent" is true, and that is what careful people mean. The passage below states this model precisely:

> In Haskell, effects are treated as first-class values. The `putStrLn` function doesn't print to standard out, it returns a value (of type `IO ()`) which describes *how* to print to standard out, but stops short of actually *doing* it. These sorts of values can be composed using the monadic operators (in Scala, `flatMap` and `pure`), allowing Haskell programmers to build up expressions composed of sequences of dependent effects, all of which are merely *descriptions* of the side-effects which will eventually be performed by the runtime. Ultimately, the description which comprises your *whole* program is the return result from the `main` function. The Haskell runtime runs the `main` function to get this description of all your effects, and then runs the effects per your instructions.

A widely repeated quote attributed to Odersky (the original source needs checking):

> The IO monad does not make a function pure. It just makes it obvious that it's impure

It sits in tension with the description model. Under that model the function returning `IO` *is* pure; the impurity is in executing the description. The quote is right in a looser sense: the type `IO` marks which code will have effects when it runs.

In short, if you want to write for expressions that mix pure functions and I/O functions in a compositional style, the IO monad provides a solution. In Scala this means an effect type such as Cats Effect's `IO` or ZIO's `ZIO`. Scala's standard library has none: `Future` starts running as soon as it is created, so it is not a description in this sense. See [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}).

### IO as a context


> The other thing that Maybe and IO have in common is that (unlike List or Map) they describe a context for their parameters rather than a container. The context for the IO type is that the value has come from an input/output operation. Common examples of this include reading user input, printing to standard out, and reading a file.

The container/context split is a teaching device, not a rule. Lists are also read as a context (non-determinism, see [Applicative: Lists]({{< ref "functional-programming/02-abstractions/applicative" >}}#lists)), and `Maybe` can be read as a container of zero or one element. And an `IO a` doesn't hold a value that "has come from" an operation: it holds no `a` at all until it runs, which is why the value can't be taken out (see below).

### `main` is an action, not a function


> Clearly, main doesn't return any meaningful value; it simply performs an action. It turns out that main isn't a function, because it breaks one of the fundamental rules of functions: it doesn't return a value. Because of this, we refer to main as an IO action. IO actions work much like functions except they violate at least one of the three rules we established for functions early in the book. Some IO actions return no value, some take no input, and others don't always return the same value given the same input.

The conclusion is right: `main` is an IO action, not a function. The reasons are muddled. `main :: IO ()` isn't a function simply because its type has no arrow; it is a value, like `42`. And IO actions don't break "same input, same output". `getLine` is the same action every time you mention it; what varies is the result you get each time the action is *run*. Treating actions as ordinary values is what keeps Haskell referentially transparent (see [Referential transparency]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#referential-transparency)).

### Values stay in the IO context


> Because I/O is so dangerous and unpredictable, after you have a value come from I/O, Haskell doesn't allow you to use that value outside of the context of the IO type. For example, if you fetch a random number using randomRIO, you can't use that value outside main or a similar IO action. You'll recall that with Maybe you could use pattern matching to take a value safely out of the context that it might be missing. This is because only one thing can go wrong with a Maybe type: the value is Nothing. With I/O, an endless variety of problems could occur. Because of this, after you're working with data in the context of IO, it must stay there.

The real reason is simpler than danger: an `IO Int` contains no `Int` to pattern-match on, only a recipe that produces one when run. A function `IO a -> a` would have to run the recipe during evaluation, which would break referential transparency. You can still use the value with pure code: `fmap`, `>>=` or a `do` block pass it to ordinary functions, and only the result stays in `IO`. `unsafePerformIO` exists as an escape hatch, and is unsafe for exactly this reason.

### Lazy I/O


Open question: can lazy evaluation make I/O code easier to write? Yes, through Haskell's *lazy I/O*. `getContents`, `readFile` and `interact` return the whole input as a lazy `String` that is read only as the program consumes it, so a whole-input program can be written as a pure function:

```haskell
import Data.Char (toUpper)

main :: IO ()
main = interact (map toUpper)
```


This processes a file of any size in constant memory, and reacts line by line when the input is a terminal.

Caveat: lazy I/O is convenient for small scripts but widely discouraged elsewhere. When the reading happens depends on when the string is evaluated, so file handles can stay open longer than expected or be closed before the data is read, and I/O errors surface inside pure code. Larger programs use strict reads (`Data.Text.IO`, `Data.ByteString`) or a streaming library such as `conduit`, `pipes` or `streaming`; in Scala the counterpart is fs2. For the strictness side see [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}).

### Links


- Typelevel blog, "An IO monad for Cats" (2017): <https://typelevel.org/blog/2017/05/02/io-monad-for-cats.html>
- Underscore, "Monadic IO: laziness makes you free" (2015): <https://underscore.io/blog/posts/2015/04/28/monadic-io-laziness-makes-you-free.html>
- Video on IO: <https://www.youtube.com/watch?v=tYH5UsahYQU>
- Haskell Wiki, Introduction to IO: <https://wiki.haskell.org/Introduction_to_IO>
- blynn, Haskell IO notes (crypto.stanford.edu): <https://crypto.stanford.edu/~blynn/haskell/io.html>

See also: [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}) for free monads and monad transformers, [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}), [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}), [map and flatMap]({{< ref "functional-programming/02-abstractions/map-flatmap" >}}) and [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}).

## Library sources


- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: chapter 4, Handling errors without exceptions, is the source of the passages under Option; chapter 6 builds the State type, chapter 11 the Monad interface, and chapter 13 an IO type and free monads.
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: section 5.3, "Monad Laws", and 5.3.1, "Kleisli Arrows", restate the three laws as identity and associativity of `<=<`, with `return` as the identity, on *Gluing functions together* and *Sequential computation*; section 2.1.2, "Comprehensions", translates a for comprehension into `flatMap` calls and a final `map`, on *`map`, `flatMap` and for expressions in Scala*; sections 6.1-6.3 build State (`get`, `put`, `modify`), Reader (`ask`, `asks`, `local`, `withReader`, and bind as a function of the environment) and Writer, which needs a `Monoid` for `return` and is recommended only for basic logging, on *State*, *Reader* and *Writer*; section 8.2 treats IO actions as descriptions that only `main` executes and covers `unsafePerformIO`, and 8.2.4 shows GHC's `IO` as a state function over a `RealWorld` token, on *IO*; chapter 11 on monad transformers, chapter 13 on final, initial and operational styles and free monads.
- [Schwarz 2019](/sources/programming/scala/schwarz-2019-state-monad.pdf.enc), *State Monad*: slides following Alvin Alexander's derivation of State from explicit state passing; the `state-monad.pdf` in the State investigation task.
- [Schwarz 2019](/sources/programming/scala/schwarz-2019-monads-do-not-compose.pdf.enc), *Monads do not Compose*: why `Future[Option[_]]` needs a transformer such as `OptionT`.
- [Vargas 2023](/sources/programming/scala/vargas-2023-why-on-earth-a-zio-io-monad.pdf.enc), *Why on earth a ZIO IO monad for Scala?*: an argument for IO as a description of effects; on the IO section.
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: chapter 4 covers Writer, Reader and State in Cats, chapter 5 monad transformers.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 5, Monads as practical functionality providers: `Maybe`, `Reader` and `Writer` (5.1) and `State` (5.2), with worked examples; chapter 6 on monad transformers; the opening of 5.1 on Writer's space leaks, with 5.1.3, "Writing logs via Writer"; the opening of 14.1, "Streaming data", on why lazy I/O makes memory hard to predict; on *Writer* and *Lazy I/O*.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 7, Understanding IO, sections "Performing IO in a Pure, Lazy Language" and "Ordering and Combining IO Actions", on why IO actions must be sequenced, and "Running IO in Real Applications", which writes and reads tens of thousands of files with `mapM` and `readFile` and crashes with "Too many open files", because each lazily read file stays open until its contents are forced, on *Lazy I/O*; chapter 9, Introducing Monads, including the monad laws; chapter 12 builds a monadic parser; chapter 13, section "Revisiting the Parsing Problem", subsection "The State Monad", writes `newtype State s a = State { runState :: s -> (a, s) }` with its `Functor`, `Applicative` and `Monad` instances, `get` and `put`, after splitting a parser into `Either` plus `State`, on *State*.
- Płachta 2022, *Grokking Functional Programming*: chapter 5 on `flatMap` and for comprehensions over noncollection types, the point under `map`, `flatMap` and for expressions; chapter 8, IO as values, where `IO.delay` describes an action that runs only when `unsafeRunSync` is called, on deferring actions under IO.
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc), *Kleisli composition, flatMap, join, map, unit*: Kleisli composition, `flatMap`, `join`, `map` and `unit` defined in terms of each other; on Gluing functions together.
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*: chapter 1, sections 1.1 and 1.6: a ZIO value as a blueprint of a workflow, and `Future` as an already running effect that can't be delayed or retried; on the IO section.
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: chapter 18, sections 18.2 (`join`, and bind as `fmap` plus `join`), 18.5 (the laws, QuickChecked) and 18.6 (Kleisli composition `>=>`), on *The monadic operations* and *Gluing functions together*; chapter 22, Reader: the Functor, Applicative and Monad of functions (22.2 to 22.7, including `((+) <$> (*2) <*> (+10)) 3`), "Reader Monad by itself is kinda boring" (22.8) and `ReaderT` in practice (22.10), on *Reader*; chapter 23, State: the `State` newtype `s -> (a, s)` (23.4) and the "Write State for yourself" exercise (23.6), on *State* and its open task; section 26.6, why not to use Writer (thunks, logs unavailable until the end), on *Writer*; chapter 29, sections 29.2 (against explaining IO as State, and against saying IO destroys referential transparency) and 29.6 (a function returning `IO a` is referentially transparent), on *Does IO make I/O pure?*.
- Bird 1998, *Introduction to Functional Programming using Haskell (2nd edition)*: section 9.6, "Stream-based interaction": an interactive program as a `String -> String` function run with `interact`, the style of early Haskell, with `interact (map capitalise)` answering each keystroke as it arrives and the programmer responsible for interleaving input and output, on *Lazy I/O*; section 10.2, "Variations on an evaluator", adds error handling, an operation count and a trace to a small evaluator by hand before rewriting it once against an arbitrary monad, so the problem comes before the abstraction; section 10.3, "Monad laws", states the unit and associativity laws, then restates them for do notation (10.3.1); on *Why monads are hard to explain* and the laws under *Gluing functions together*.
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*: chapter 10, Implementation: Working with Errors, section "Chaining Result-Generating Functions": `Result`-returning "switch" functions don't compose until `bind` adapts them to two-track input; section "Monads and More" then defines a monad as a data type with `return` and `bind` obeying the monad laws; on *Gluing functions together*.

Further reading:

- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*
- Chiusano et al. 2013, *Functional Programming in Scala (MEAP version 10)*
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture*: appendix A, "Plenty of monads": IO and `do` notation, table A.1 of common monads (State, Reader, Writer, RWS, Free, Either, Maybe, Par, ST, STM), and a factorial rewritten from argument passing to `State` with `get`, `put` and `runState`/`execState`/`evalState`; on *State* and *IO*.
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*
