---
draft: false
toc: true
title: "Functions And Composition"
linkTitle: "Functions And Composition"
---

Functions as values: small functions, lambdas and closures, returning functions, currying and partial application, custom control structures, and composing programs from pipelines of small functions.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Small functions


Small functions and their responsibilities

rankedWords(w => score(w) + bonus(w), words)

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`rankedWords` takes the scoring rule as a parameter, so ranking and scoring stay separate small functions, each with one responsibility. The lambda `w => score(w) + bonus(w)` combines two existing small functions into a new rule at the call site, without changing `rankedWords`. A sketch of the function itself:

```scala
def rankedWords(wordScore: String => Int, words: List[String]): List[String] =
words.sortBy(wordScore).reverse
```
{{< /callout >}}

## Lambdas, closures and scope


Being able to use unnamed functions to create scope on the fly is an essential tool for doing much more powerful things with lambda functions, which ... Hutton

It turns out the lambda function on its own is powerful enough to create variables from

nothing.

The even more powerful feature of lambda

functions is that they allow you to create scope as needed.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Applying a lambda to an argument binds a name, so a lambda is enough to introduce a local variable. In Haskell these two are the same:

```haskell
let s = x + y in s * s
(\s -> s * s) (x + y)
```

The second form "creates scope on the fly": `s` exists only inside the lambda's body.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The attribution to Hutton needs checking. The wording, and the `ifEven` passage under Returning functions, match Will Kurt's *Get Programming with Haskell* (the lessons on lambda functions and closures). The `let`/lambda equivalence also has two exceptions in Haskell: `let` bindings can be recursive, and a `let`-bound name can be used at several types (it is generalized), while a lambda-bound name can't.
{{< /callout >}}


**Lambdas**

Intuitively, Scala's closures capture variables themselves, not the value to

which variables refer. By contrast, Java's lambdas do not allow you to access local variables in surrounding

scopes unless they are final or effectively final, so there is no difference between capturing a

variable and capturing its currently held value.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The passage is from *Programming in Scala*. Its example shows the difference:

```scala
var more = 1
val addMore = (x: Int) => x + more
addMore(10)   // 11
more = 9999
addMore(10)   // 10009: the closure sees the variable, not the value 1
```
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
This is also why capturing a `var` makes a closure impure: `addMore(10)` gives different results over time. Capturing only `val`s avoids the question entirely, and in Haskell it never arises, because there are no mutable variables to capture.
{{< /callout >}}

## Returning functions and API design


Returning functions is a foundation of designing flexible APIs.

api construction

in functional codebases, the API is usually the *function signature*.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Signatures are only part of it. Data types also carry much of the API: an algebraic data type says exactly which values a caller can build or must handle. Module boundaries (what a Haskell module exports, what a Scala object or trait exposes) and type classes do too.
{{< /callout >}}


However, some repetition is still there, and it cannot be fixed with a new parameter. We need something more -- a technique that will enable us to specify only some parameters of a function and leave other ones for later.

we need a technique that will *delay applying* this new

parameter. We can achieve this by having a function that will return a

function. Let's modify highScoringWords function in this manner.

Returning a function from highScoringWords allows us to provide two

parameters in one place of the code and the third parameter later in the

code.

example:

3 parameters -> 2 parameters -> 1 parameter

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A version of `highScoringWords` that takes its parameters one group at a time:

```scala
def highScoringWords(wordScore: String => Int)(higherThan: Int)(words: List[String]): List[String] =
words.filter(word => wordScore(word) > higherThan)

val withBonus  = highScoringWords(w => score(w) + bonus(w)) _   // 2 parameters left
val above20    = withBonus(20)                                  // 1 parameter left
above20(List("ada", "haskell", "scala"))                        // the result
```

The scoring rule is fixed once, the threshold in another place, and the word list last. "3 parameters -> 2 parameters -> 1 parameter" is this chain: each call fixes one parameter and returns a function waiting for the rest. In Scala 3 the trailing `_` isn't needed.
{{< /callout >}}


This part will focus more on functional design -- how to create

flexible APIs by treating functions as return values. We will be

forced to use and learn about the functional way of

implementing the builder pattern, method chaining, and fluent

interface you may know from OOP.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Returning functions is one way to build values step by step, but in Scala the more common functional builder is an immutable case class with methods that return modified copies: `Request.get(url).withHeader("A", "1").withTimeout(5.seconds)` reads like an OOP fluent interface, but every call returns a new value and none mutates the builder.
{{< /callout >}}


refactoring

What you've discovered here is a general pattern of computation that you can abstract away.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The refactoring move behind this: when two functions differ only in one piece of behaviour, make that piece a function parameter. Two loops that square or double every element become one `map` with the operation passed in. The same move applied to recursion is described in [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#abstracting-recursion-with-map).
{{< /callout >}}


returning functions

Anytime you might want to use a closure (which in Haskell is pretty much anytime), you want to order your arguments _from most to least general_. In this case, each host can have multiple API keys, each API key is going to use different resources, and each resource is going to have many IDs associated with it. The same is true when you define ifEven; the function you pass will work with a huge range of inputs, so it's more general and should appear first in the argument list.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Ordering from general to specific makes partial application line up with how values are reused:

```haskell
requestUrl :: String -> String -> String -> String -> String
requestUrl host apiKey resource id' =
host ++ "/" ++ resource ++ "/" ++ id' ++ "?token=" ++ apiKey

exampleHost = requestUrl "http://example.com"   -- fix the host once
myKey       = exampleHost "1337"                 -- then a key
books       = myKey "book"                       -- then a resource
books "1234"                                     -- one request
```

With the order reversed, every one of these partial applications would need a lambda.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
It is a rule of thumb, not a law: when a library got the order wrong for your use, `flip` and operator sections such as `` (`div` 2) `` fix it locally. The convention in Haskell's base library follows it: `map f xs`, `filter p xs`, `foldr f z xs` all take the function first.
{{< /callout >}}

## Currying and partial application


currying

[https://stackoverflow.com/questions/4915027/two-ways-of-currying-in-scala-whats-the-use-case-for-each](https://stackoverflow.com/questions/4915027/two-ways-of-currying-in-scala-whats-the-use-case-for-each)

curried functions -> super adder

Currying used for not returning value immediately but instead return another function

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Currying turns a function of several arguments into a chain of one-argument functions: `(Int, Int) => Int` becomes `Int => Int => Int`. Supplying the first argument returns a function waiting for the second. An adder example in Scala:

```scala
def add(x: Int)(y: Int): Int = x + y   // curried method, two parameter lists
val plus5 = add(5) _                    // Int => Int
plus5(10)                               // 15

val addF: Int => Int => Int = x => y => x + y
addF(1)(2)                              // 3
```

In Haskell every function is curried already: `add x y = x + y` has type `Int -> Int -> Int`, which means `Int -> (Int -> Int)`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The last line describes what a curried function does, not why it is used. The point is partial application: building specialized functions from general ones, as below. Currying and partial application are also often confused. Currying is the transformation of the function's type; partial application is supplying some of the arguments, and it can be done without currying, as the `sum(1, _, 3)` example below shows.
{{< /callout >}}

```scala
def sum(a: Int, b: Int, c: Int) = a + b + c
val b = sum(1, _, 3) // b has type Int => Int
```


Since only one argument is missing, the Scala com-

piler generates a new function class whose apply method takes one ar-

gument.

Partially applied functions provide a nice clean way to create specialized functions from general methods.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`sum(1, _, 3)` uses Scala's placeholder syntax for partial application: it is shorthand for `x => sum(1, x, 3)`. Any argument can be left open, not only the last, and `sum` itself is not curried.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Generates a new function class" describes the conceptual model in *Programming in Scala*. Since Scala 2.12 the compiler implements lambdas with the JVM's `invokedynamic` and `LambdaMetafactory`, so no separate class file is written for each function literal; a function object is still created at run time.
{{< /callout >}}

## Custom control structures


This technique is called the loan pattern, because a

control-abstraction function, such as withPrintWriter, opens a resource

and "loans" it to a function.

```scala
def withPrintWriter(file: File, op: PrintWriter => Unit) =
    val writer = new PrintWriter(file)
    try op(writer)
    finally writer.close()
withPrintWriter(
 new File("date.txt"),
 writer => writer.println(new java.util.Date)
)
```

to (with multiple parameters list)

```scala
def withPrintWriter(file: File)(op: PrintWriter => Unit) =
 val writer = new PrintWriter(file)
 try op(writer)
 finally writer.close()
val file = new File("date.txt")
withPrintWriter(file) {
 writer => writer.println(new java.util.Date)
}
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Both versions are from the control abstraction chapter of *Programming in Scala*. The second works because Scala lets you pass the argument of a one-argument parameter list in curly braces, so the call looks like a built-in construct such as `while`. The function owns the resource's lifetime: the caller can't forget to close the writer, and it is closed even if `op` throws. The other common ingredient of custom control structures is by-name parameters (see [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#call-by-name-in-scala)).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Since Scala 2.13 the standard library has this pattern built in: `scala.util.Using.resource(new PrintWriter(file))(op)` closes any `AutoCloseable`, and `Using(...)` returns the result in a `Try`. Haskell has the same pattern as `withFile` and, more generally, `bracket` from `Control.Exception`.
{{< /callout >}}


todo file matcher 9.1 - usage of first-order functions and lambdas

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This is section 9.1, "Reducing code duplication", in chapter 9 ("Control Abstraction") of *Programming in Scala*. A `FileMatcher` object starts with three near-identical methods, `filesEnding`, `filesContaining` and `filesRegex`, which differ only in the test applied to each file name. They are refactored into one `filesMatching(query, matcher: (String, String) => Boolean)` that takes the test as a function, so each original becomes a one-liner such as `filesMatching(query, _.endsWith(_))`, and then simplified further with closures. See [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#custom-control-structures).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"First-order" should be "higher-order". A first-order function takes and returns plain values; the point of the section is passing functions as arguments, which is what makes `filesMatching` higher-order.
{{< /callout >}}

## Composition


dollar sign and function fomposition: `putStrLn . show $ 1 + 1`

```haskell
fmap (> 0) $ Just (-1)
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`.` composes functions: `(f . g) x = f (g x)`. `$` is function application with the lowest precedence, so everything to its right is evaluated as one argument. `putStrLn . show $ 1 + 1` therefore reads as `(putStrLn . show) (1 + 1)` and prints `2`; `putStrLn . show` is what `print` does. `fmap (> 0) $ Just (-1)` is `fmap (> 0) (Just (-1))`, which is `Just False`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The second example contains no composition; it shows `$` saving parentheses, plus `fmap` mapping over a `Maybe` (see [Functor]({{< ref "functional-programming/functor" >}})). The two combine in point-free definitions: `positive = fmap (> 0)` and `showAll = map show . filter even` define functions without naming their argument.
{{< /callout >}}


As you'll see in the coming lessons, the ability to compose functions is a BIG feature of functional programming.

writing pipeline-based algorithms

We can write many computations as a sequence of

operations -- a pipeline -- that together make a bigger, more involved

operation. It's a different take on creating sequential programs

composing larger program from smaller pieces

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In Scala a pipeline is usually a chain of collection methods, or explicit composition with `andThen` and `compose`:

```scala
val clean: String => String         = _.trim.toLowerCase
val words: String => List[String]   = _.split("\\s+").toList
val pipeline: String => Int         = clean andThen words andThen (_.distinct.size)
pipeline("  The cat saw the CAT ")    // 3
```

Each stage is a small function you can test alone. The Haskell version of the idea, with a worked example, is in [Functional Refactoring]({{< ref "functional-programming/functional-refactoring" >}}#wholemeal-programming).
{{< /callout >}}


function composition <https://users.scala-lang.org/t/composing-functions-involving-different-effects/6194/10>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The problem in the thread's title: `f: A => Option[B]` and `g: B => Either[E, C]` don't compose with `andThen`, because the output of `f` isn't the input of `g`. Functions of the form `A => F[B]` compose with `flatMap` (Kleisli composition) only when they share the same `F`. Mixing effects means converting one into the other first, for example `f(a).toRight(err).flatMap(g)`, or using a monad transformer or an effect type that covers both (see [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#effect-systems)).
{{< /callout >}}


See also: [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#call-by-name-in-scala) for by-name parameters in control structures, [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}) for higher-order functions over lists, [Functional Refactoring]({{< ref "functional-programming/functional-refactoring" >}}#wholemeal-programming) for pipelines in Haskell, and [Functor]({{< ref "functional-programming/functor" >}}) for `fmap`. Also [Error Handling]({{< ref "functional-programming/error-handling" >}}) for composing functions that return `Option` or `Either`, and [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) for monad transformers.

## Library sources


- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala (5th edition)*: source of the closures passage, the placeholder partial application and the loan pattern (the chapters on functions and closures, and on control abstraction).
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: currying, partial application, sections and point-free composition in Haskell.
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: higher-order functions and lazy evaluation as the "glue" for composing programs from small pieces.
- Płachta 2022, *Grokking Functional Programming*: chapter 4, Functions as values, is the source of the passages under Small functions and Returning functions and API design (`rankedWords`, `highScoringWords`, returning functions, multiple parameter lists and currying); chapter 5, Sequential programs, is the source of the pipeline passages under Composition.
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*: chapter 8, Understanding Functions: functions as values, currying, partial application, total functions and composition, in F#; chapter 9 uses partial application to bake dependencies into the steps of a pipeline.
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc), *Kleisli composition, flatMap, join, map, unit*: Kleisli composition (`>=>`) of functions `A => F[B]`, defined through `flatMap`; on the last callout under Composition.

Further reading:

- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*
- [Sfregola 2021](/sources/programming/scala/sfregola-2021-get-programming-with-scala.pdf.enc), *Get Programming with Scala*
- [Wampler 2021](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), *Programming Scala (3rd edition)*
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*
