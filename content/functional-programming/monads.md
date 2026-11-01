---
draft: false
toc: true
title: "Monads"
linkTitle: "Monads"
---

Monads as the way to bind pure functions together, with the Option, Writer, State, Reader and IO monads in Haskell and Scala, and links on free monads and monad transformers.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Why monads

### Gluing functions together


**Bind Concept**

The hard part of functional programming involves how you *glue together* all of your

pure functions to make a complete application. Because this process feels like you're

writing "glue" code, I refer to this process as "gluing," and as I learned, a more

technical term for this is called "binding."

example: problem with composing `f` and `g`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The problem in one example. Ordinary functions compose directly: given `f: A => B` and `g: B => C`, `g(f(a))` just works. But often each step returns its result in a wrapper, because it can fail, log, or perform I/O:

```scala
def f(s: String): Option[Int]    = s.toIntOption
def g(n: Int): Option[Double]    = if (n != 0) Some(1.0 / n) else None

// g(f("4"))  does not compile: g wants an Int, f returns Option[Int]
f("4").flatMap(g)               // Some(0.25)
for { n <- f("4"); r <- g(n) } yield r  // the same, as a for-comprehension
```

"Binding" is that glue: an operation that takes a wrapped value and a function producing the next wrapped value and handles the wrapper between them. Scala calls it `flatMap`, Haskell `>>=` ("bind"). A monad is a type with such an operation plus a way to wrap a plain value (`pure`, `return`, `unit`), obeying three laws: wrapping and then binding does nothing extra on either side, and binding is associative.
{{< /callout >}}


There's a good reason for their ubiquity: monads encapsulate the essence of *sequential computation*.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Sequential" here means that each step can depend on the result of the previous one, not that steps happen one after another in time. The list monad, for instance, describes all combinations of choices, not a timeline. The defining feature compared with [Applicative]({{< ref "functional-programming/applicative" >}}) is that the next computation is chosen from the previous result.
{{< /callout >}}


Its main aim is to make simpler the composition of pure functions, that are mathematical functions that cannot have any *side effect*.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
More precisely, the functions being composed have types like `A => F[B]`. They stay pure because the effect (failure, logging, state, I/O) is described in the return type instead of being performed. These are called Kleisli arrows, and a monad is exactly what makes them composable. Monads are also used outside pure languages: Scala's `Option`, `Either` and `Future` are monads whether or not the rest of the program is pure.
{{< /callout >}}


monadic operator, monadic operations

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The core monadic operations are `pure` (or `return`), which puts a value into the context, and `>>=` (bind), which feeds the result of one computation into a function that returns the next one. Around them: `>>` (sequence and ignore the first result), `=<<` (bind with arguments flipped), `>=>` (Kleisli composition, composing `a -> m b` with `b -> m c`) and `join :: m (m a) -> m a`. In Scala, bind is `flatMap`, and `for` comprehensions are sugar for `flatMap` and `map`, as `do` notation is for `>>=` in Haskell. See [Monads]({{< ref "functional-programming/monads" >}}).
{{< /callout >}}

### Why monads are hard to explain


This is why it's so hard to explain monads to beginners, especially with canned tutorials that try to explain what monads *are* without spending too much time on what they're *for*. Monads are the solution to a problem that beginners haven't yet experienced for themselves; and, as a result, they feel pointless, like something out of high-school math.

monads

<https://www.youtube.com/watch?v=C2w45qRc3aU>

<https://wiki.haskell.org/Monad_tutorials_timeline>

<https://wiki.haskell.org/All_About_Monads>

<https://two-wrongs.com/the-what-are-monads-fallacy>

<https://byorgey.wordpress.com/2009/01/12/abstraction-intuition-and-the-monad-tutorial-fallacy/>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The last two links go with the quote above. Brent Yorgey's 2009 post is the one that named the "monad tutorial fallacy".
{{< /callout >}}

### `map`, `flatMap` and for expressions in Scala


Collections supporting map and flatMap are referred to as *monadic*.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Two qualifications. Having `map` and `flatMap` isn't quite enough: a monad also needs a way to wrap a plain value, and the operations must obey the monad laws. And the idea isn't limited to collections: `Option`, `Either`, `Try`, `Future` and the IO types are monadic too. Scala's for-comprehensions work with any type that has the methods, lawful or not.
{{< /callout >}}


FP developers like to say that a method like apply "lifts" an ordinary value into the wrapper.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"Lift" here means going from a plain value to a wrapped one: `List(1)`, `Some(1)`, `Option(1)`. In the monad vocabulary this is `pure` (Cats, Haskell), `return` (Haskell) or `unit` (*Functional Programming in Scala*). "Lift" is also used for functions: `map` lifts `A => B` to `F[A] => F[B]` (see [Functor]({{< ref "functional-programming/functor" >}}#lifting)).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`Option.apply` is not a lawful `pure`, because `Option(null)` is `None`. Wrapping a value and then binding a function over it should be the same as calling the function, and with `null` it isn't. `Some(_)` is the lawful one; `Option(_)` is a bridge from nullable values (see Option below).
{{< /callout >}}


For something to be used in a for expression, it doesn't have to be a

class that implements the map and flatMap methods (like

Sequence); it just needs to return a type that implements map and

flatMap methods.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The compiler rewrites for-comprehensions syntactically, so there is no `Monad` trait to extend. Whatever appears to the right of ` <- ` just needs suitable methods: `flatMap` and `map` for a `for ... yield` with several generators, `withFilter` if there are `if` guards, `foreach` for a `for` without `yield`. Extension methods or implicit conversions count too. So the value you iterate over (often the return value of a function) decides it, not the class where the for-expression is written. Desugaring is shown in [Map Flatmap]({{< ref "functional-programming/map-flatmap" >}}#in-scala).
{{< /callout >}}

## Option


Errors as values: moved to [Error Handling]({{< ref "functional-programming/error-handling" >}}).

Missing values can never cause an error in Haskell because Maybe

makes it impossible to forget that a value might be null.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Overstated. Haskell has no `null` at all; `Maybe` is how optional values are written, and the type checker makes you deal with `Nothing` before you can use the value. But you can still opt out: `fromJust Nothing` crashes at runtime, and so do partial functions such as `head []`. What `Maybe` guarantees is that absence is visible in the type, not that you handle it well.
{{< /callout >}}


What you've done here with your process function is a common pattern in Haskell: you

separate the parts of the code for which you need to worry about a problem (for exam-

ple, missing values) from the ones that you don't.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The `process` function from the source isn't shown. The pattern is: write the logic as an ordinary function on plain values, then apply it to wrapped values with `fmap`, `<*>` or `>>=`. Only the code at the edges sees `Maybe`; the core never checks for `Nothing`.
{{< /callout >}}


Note how clean and simple this function is, concentrating purely on the "happy path" where both operations succeed and letting the Option monad worry about the three different cases where at least one of the operations fails.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The function itself is missing, but the shape is a for-comprehension over two `Option`s, for example `for { a <- toInt(x); b <- toInt(y) } yield a + b`. With two operations there are four combinations, and three of them involve a failure: the first fails, the second fails, or both fail. `flatMap` turns all three into `None` without any code for them.
{{< /callout >}}


Have been created to deal with unsafe APIs:

```scala
val chainedResult = Option(unsafeMethod()).orElse(Option(backupMethod()))
```

^ Here you can see `Option` construction.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`Option(x)` gives `None` when `x` is `null` and `Some(x)` otherwise, so it wraps a Java-style API that signals absence with `null`. `orElse` takes its argument by name, so `backupMethod()` runs only if the first result is `None`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`Option` wasn't created for unsafe APIs; it models absence in general. `Option(...)` is the adapter for null-returning code. It doesn't help if `unsafeMethod()` throws an exception: that needs `Try(unsafeMethod())` or `Either`, where `Try(...).toOption` turns a failure into `None`.
{{< /callout >}}

## Writer


<https://speakerdeck.com/philipschwarz/writer-monad>

<https://wiki.haskell.org/All_About_Monads#The_Writer_monad>

the Writer monad is for values that have another value attached that acts as a sort of log value. Writer allows us to do computations while making sure that all the log values are combined into one log value that then gets attached to the result.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"Combined" means combined with the log's monoid operation, so the log type must be a monoid (see [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid)): lists and strings append, `Sum` adds. In Haskell:

```haskell
import Control.Monad.Writer

half :: Int -> Writer [String] Int
half n = do
tell ["halving " ++ show n]
pure (n `div` 2)

runWriter (half 8 >>= half)  -- (2,["halving 8","halving 4"])
```
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
In practice Writer is a poor fit for application logging. The log only becomes available when the whole computation finishes, and the classic lazy and strict implementations can build up large unevaluated logs (space leaks). The `transformers` package added a continuation-passing variant (`Control.Monad.Trans.Writer.CPS`) for that reason. Writer works well for small accumulations such as collecting warnings or counting steps.
{{< /callout >}}

## State


haskell:

<http://brandon.si/code/the-state-monad-a-tutorial-for-the-confused/>

<https://hugopeters.me/posts/13/>

<https://www.reddit.com/r/haskell/comments/wtgq7o/how_to_get_into_state_monad/>

<https://www.slideshare.net/dgalichet/scalaio-statemonad?from_search=2>

philip slides -> in projects ...

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Philip Schwarz's *State Monad* slides are in the library (see Library sources); whether those are the slides meant here needs checking.
{{< /callout >}}


<https://earldouglas.com/talks/state-monad/slides.html#(1)>

<https://afsal-taj06.medium.com/state-monad-unlocked-e946becf0f6f>

<https://typelevel.org/cats/datatypes/state.html>

<https://www.slideshare.net/pjschwarz/from-scala-monadic-effects-to-unison-algebraic-effects>

<https://blog.tmorris.net/posts/memoisation-with-state-using-scala/index.html>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The first three links are Haskell, the rest Scala. The typelevel.org page is the Cats documentation for its `State` data type, the reference for the Scala version.
{{< /callout >}}


The concept of handling state in FP applications is often similar to pushing items onto a list (Alvin)

source?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"Alvin" is Alvin Alexander. The likely source is his book *Functional Programming, Simplified*, whose State lessons are what Schwarz's *State Monad* slides follow (see Library sources). The exact sentence needs checking against the book, which isn't in the library.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The analogy is loose. What it gets right: you never change the old state, you build a new value from it, as consing onto an immutable list leaves the old list intact. But the State monad isn't about a growing collection. The state can be any value (a counter, a random-number seed, a game board), and each step replaces it.
{{< /callout >}}


We'll say that a *stateful computation* is a function that takes some state and returns a value along with some new state.

First of all the State monad is just *an abstraction for a function that takes a state and returns an intermediate value and some new state value*.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In code the two definitions are the same type: Haskell's `State s a` wraps `s -> (a, s)`, and in Scala it is `case class State[S, A](run: S => (A, S))`. The monad part is `flatMap`, which runs one such function, passes the new state to the next one, and so threads the state through without you passing it by hand:

```scala
val next: State[Int, Int] = State(n => (n, n + 1))   // return the counter, then increment it
val three = for { a <- next; b <- next; c <- next } yield List(a, b, c)
three.run(10)  // (List(10, 11, 12), 13)
```

Written as above, `State` needs its own `map` and `flatMap`. Cats provides a ready-made `cats.data.State`; note that it puts the state *first* in the pair (`S => (S, A)`), and `run(10)` returns an `Eval`, so you call `.value` on the result.
{{< /callout >}}


State monad investigation:

state-monad.pdf ([PDF](/sources/programming/scala/schwarz-2019-state-monad.pdf.enc))

github post

destructuring and transforming code to get better understanding

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A concrete version of this plan: write `State` with its `map` and `flatMap` by hand, take a short for-comprehension like the counter example above, desugar it into nested `flatMap` and `map` calls, then inline the definitions until only plain functions on `(value, state)` pairs remain. At that point it is clear that the monad only passes the state from each step to the next. Schwarz's slides (linked above) take roughly this route.
{{< /callout >}}

## Reader

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Functions from a fixed input type `r` form a functor, an applicative and a monad. Each instance passes the same `r` to every part:

```haskell
fmap f g  = \r -> f (g r)            -- composition
pure x    = \_ -> x                  -- const: ignore the environment
f <*> g   = \r -> f r (g r)          -- both sides get the same r
m >>= k   = \r -> k (m r) r          -- the next step also gets r

((+) <$> (*2) <*> (+10)) 3           -- (3*2) + (3+10) = 19
```

The `Reader r a` type in `mtl`/`transformers` is a wrapper around `r -> a` with `ask` (get the environment), `asks f` (get part of it) and `local` (run a sub-computation with a modified environment). It is used to pass configuration or dependencies implicitly instead of threading a parameter through every call.
{{< /callout >}}


Reader

<https://blog.ssanj.net/posts/2018-03-05-functor-applicative-and-monad-instances-for-reader.html>

<https://gist.github.com/twopoint718/c02164137c6fca9e0c4c>

<https://stackoverflow.com/questions/55797418/what-can-the-reader-monad-do-that-applicative-functions-cannot>

<https://stackoverflow.com/questions/32323680/is-there-any-intuition-to-understand-join-two-functions-in-monad>

<https://engineering.dollarshaveclub.com/the-reader-monad-example-motivation-542c54ccfaa8>

<https://www.reddit.com/r/functionalprogramming/comments/myz9ju/what_are_the_other_use_cases_of_the_either_monad/>

<https://dev.to/choc13/grokking-the-reader-monad-4f45>

reader monad

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Two short answers to the Stack Overflow questions, worked out from the instances above. For functions, `>>=` can be written with `<*>`: `m >>= k` equals `flip k <*> m`, so Reader's `Monad` instance adds no power over its `Applicative`. And `join` on functions duplicates the argument: `join f = \x -> f x x`, so `join (+) 3` is `6`. The reddit thread is about the Either monad, not Reader.
{{< /callout >}}

## IO


<https://typelevel.org/blog/2017/05/02/io-monad-for-cats.html>

<https://underscore.io/blog/posts/2015/04/28/monadic-io-laziness-makes-you-free.html>

Before you jump into using the IO monad, let me share a personal warning: Some

developers say that the IO monad somehow makes I/O pure. This isn't true -- and I

wasted a lot of time trying to understand that claim.

The trick of the IO monad is that it lets you write I/O functions as effects.

Philosophically, what happens is that you use IO to describe how an I/O function

works. Then, instead of dealing with the result of the I/O function at the time when

the I/O function appears to be called, you defer the actual action until some time

later when you really want it to be triggered.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The disagreement is about words. IO doesn't make the I/O pure: reading a file still reads a file. What it makes pure is the code that *builds* I/O: a function returning `IO String` returns the same description every time it is called, and evaluating it has no effect. Only running the description (the runtime executing `main`, or `unsafeRunSync()` in Cats Effect) performs the effect. So "IO makes functions that do I/O referentially transparent" is true, and that is what careful people mean. The passage just below states this model precisely.
{{< /callout >}}


In Haskell, effects are treated as first-class values. The `putStrLn` function doesn't print to standard out, it returns a value (of type `IO ()`) which describes *how* to print to standard out, but stops short of actually *doing* it. These sorts of values can be composed using the monadic operators (in Scala, `flatMap` and `pure`), allowing Haskell programmers to build up expressions composed of sequences of dependent effects, all of which are merely *descriptions* of the side-effects which will eventually be performed by the runtime. Ultimately, the description which comprises your *whole* program is the return result from the `main` function. The Haskell runtime runs the `main` function to get this description of all your effects, and then runs the effects per your instructions.

Odersky: "The IO monad does not make a function pure. It just makes it obvious that it's impure"

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The quote is widely repeated, but its original source needs checking before you rely on the attribution. It also sits in tension with the passage above. Under the description model, the function returning `IO` *is* pure; the impurity is in executing the description. The quote is right in a looser sense: the type `IO` marks which code will have effects when it runs.
{{< /callout >}}


In short, if you want to write for expressions using pure functions and I/O functions in a compositional style, the IO monad provides a solution.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In Scala this means an effect type such as Cats Effect's `IO` or ZIO's `ZIO`. Scala's standard library has none: `Future` starts running as soon as it is created, so it is not a description in this sense.
{{< /callout >}}


<https://www.youtube.com/watch?v=tYH5UsahYQU>

<https://wiki.haskell.org/Introduction_to_IO>

<https://crypto.stanford.edu/~blynn/haskell/io.html>

The other thing that Maybe and IO have in common is that (unlike List or Map) they describe

a context for their parameters rather than a container. The context for the IO type is that

the value has come from an input/output operation. Common examples of this include

reading user input, printing to standard out, and reading a file.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The container/context split is a teaching device, not a rule: lists are also read as a context (non-determinism, see [Applicative]({{< ref "functional-programming/applicative" >}}#lists)), and `Maybe` can be read as a container of zero or one element. And an `IO a` doesn't hold a value that "has come from" an operation. It holds no `a` at all until it runs, which is why the value can't be taken out (see below).
{{< /callout >}}


Clearly, main doesn't return any meaningful value; it simply performs an action. It turns

out that main isn't a function, because it breaks one of the fundamental rules of functions:

it doesn't return a value. Because of this, we refer to main as an IO action. IO actions work

much like functions except they violate at least one of the three rules we established for

functions early in the book. Some IO actions return no value, some take no input, and

others don't always return the same value given the same input.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The conclusion (`main` is an IO action, not a function) is right, but the reasons are muddled. `main :: IO ()` isn't a function simply because its type has no arrow: it is a value, like `42`. And IO actions don't break "same input, same output". `getLine` is the same action every time you mention it; what varies is the result you get each time the action is *run*. Treating actions as ordinary values is what keeps Haskell referentially transparent (see [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#referential-transparency)).
{{< /callout >}}


Keeping values in the context of IO ->

Because I/O is so dangerous and unpredictable, after you have a value come from I/O,

Haskell doesn't allow you to use that value outside of the context of the IO type. For

example, if you fetch a random number using randomRIO, you can't use that value outside

main or a similar IO action. You'll recall that with Maybe you could use pattern matching to

take a value safely out of the context that it might be missing. This is because only one

thing can go wrong with a Maybe type: the value is Nothing. With I/O, an endless variety of

problems could occur. Because of this, after you're working with data in the context of

IO, it must stay there.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The real reason is simpler than danger: an `IO Int` contains no `Int` to pattern-match on, only a recipe that produces one when run. A function `IO a -> a` would have to run the recipe during evaluation, which would break referential transparency. You can still use the value with pure code: `fmap`, `>>=` or a `do` block pass it to ordinary functions, and only the result stays in `IO`. (`unsafePerformIO` exists as an escape hatch, and is unsafe for exactly this reason.)
{{< /callout >}}


? Write I/O code using lazy evaluation to make I/O easier

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This is Haskell's *lazy I/O*: `getContents`, `readFile` and `interact` return the whole input as a lazy `String` that is read only as the program consumes it. So a whole-input program can be written as a pure function: `main = interact (map toUpper)` processes a file of any size in constant memory, and reacts line by line when the input is a terminal.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Lazy I/O is convenient for small scripts but widely discouraged elsewhere. When the reading happens depends on when the string is evaluated, so file handles can stay open longer than expected or be closed before the data is read, and I/O errors surface inside pure code. Larger programs use strict reads (`Data.Text.IO`, `Data.ByteString`) or a streaming library such as `conduit`, `pipes` or `streaming`; in Scala the counterpart is fs2. For the strictness side see [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}).
{{< /callout >}}

## Free monads and monad transformers


Moved to [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}).

## Library sources


- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: chapter 4, Handling errors without exceptions, is the source of the passages under Option; chapter 6 builds the State type, chapter 11 the Monad interface, and chapter 13 an IO type and free monads.
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: chapter 6 on Reader, Writer and State, chapter 11 on monad transformers, chapter 13 on final, initial and operational styles and free monads.
- [Schwarz 2019](/sources/programming/scala/schwarz-2019-state-monad.pdf.enc), *State Monad*: slides following Alvin Alexander's derivation of State from explicit state passing; the `state-monad.pdf` under State.
- [Schwarz 2019](/sources/programming/scala/schwarz-2019-monads-do-not-compose.pdf.enc), *Monads do not Compose*: why `Future[Option[_]]` needs a transformer such as `OptionT`.
- [Vargas 2023](/sources/programming/scala/vargas-2023-why-on-earth-a-zio-io-monad.pdf.enc), *Why on earth a ZIO IO monad for Scala?*: an argument for IO as a description of effects; on the IO section.
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: chapter 4 covers Writer, Reader and State in Cats, chapter 5 monad transformers.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 5, Monads as practical functionality providers: `Maybe`, `Reader` and `Writer` (5.1) and `State` (5.2), with worked examples; chapter 6 on monad transformers.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 7, Understanding IO, on performing IO in a pure, lazy language and ordering IO actions; chapter 9, Introducing Monads, including the monad laws; chapter 12 builds a monadic parser.
- Płachta 2022, *Grokking Functional Programming*: chapter 5 on `flatMap` and for comprehensions over noncollection types, the point under `map`, `flatMap` and for expressions; chapter 8, IO as values, where `IO.delay` describes an action that runs only when `unsafeRunSync` is called, on deferring actions under IO.
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc), *Kleisli composition, flatMap, join, map, unit*: Kleisli composition, `flatMap`, `join`, `map` and `unit` defined in terms of each other; on Gluing functions together.
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*: chapter 1, sections 1.1 and 1.6: a ZIO value as a blueprint of a workflow, and `Future` as an already running effect that can't be delayed or retried; on the IO section.

Further reading:

- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*
- [Chiusano et al. 2013](/sources/programming/scala/chiusano-2013-functional-programming-in-scala-meap-v10.pdf.enc), *Functional Programming in Scala (MEAP version 10)*
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture*
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*
