---
draft: false
toc: true
title: "Functions and Composition in Haskell and Scala"
aliases:
  - "/functional-programming/functions-and-composition/"
description: "Functions as values in Haskell and Scala: lambdas and closures, returning functions for API design, currying and partial application, custom control structures, and composition into pipelines."
weight: "40"
linkTitle: "Functions and Composition"
---

Functions are values: they can be passed as arguments, returned from other functions, partially applied and composed. This note covers small functions as parameters, lambdas and closures, returning functions, currying and partial application, custom control structures, and building programs as pipelines of small functions.

## Small functions as parameters


Give each function one responsibility, and pass behaviour in as a parameter. In this call from Płachta 2022, ch. 4, `rankedWords` takes the scoring rule as an argument:

```scala
rankedWords(w => score(w) + bonus(w), words)
```


Ranking and scoring stay separate small functions. The lambda `w => score(w) + bonus(w)` combines two existing functions into a new rule at the call site, without changing `rankedWords`. A sketch of the function itself:

```scala
def rankedWords(wordScore: String => Int, words: List[String]): List[String] =
  words.sortBy(wordScore).reverse
```


The refactoring move behind this: when two functions differ only in one piece of behaviour, make that piece a function parameter. Two loops that square or double every element become one `map` with the operation passed in. In the words of one of the source books:

> What you've discovered here is a general pattern of computation that you can abstract away.

The same move applied to recursion is in [Abstracting recursion with map]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#abstracting-recursion-with-map).

## Lambdas, closures and scope

### Lambdas create scope


> Being able to use unnamed functions to create scope on the fly is an essential tool for doing much more powerful things with lambda functions ...
>
> It turns out the lambda function on its own is powerful enough to create variables from nothing. The even more powerful feature of lambda functions is that they allow you to create scope as needed.

The jot attributed this to Hutton. The wording, and the `ifEven` passage under [Argument order](#argument-order), match Will Kurt's *Get Programming with Haskell*, the lessons on lambda functions and closures (needs checking).

Applying a lambda to an argument binds a name, so a lambda is enough to introduce a local variable. In Haskell these two are the same:

```haskell
let s = x + y in s * s
(\s -> s * s) (x + y)
```


The second form creates scope on the fly: `s` exists only inside the lambda's body.

Caveat: the equivalence has two exceptions in Haskell. `let` bindings can be recursive, and a `let`-bound name can be used at several types (it is generalized), while a lambda-bound name can't.

### Closures capture variables


From *Programming in Scala* (Odersky et al. 2021):

> Intuitively, Scala's closures capture variables themselves, not the value to which variables refer. By contrast, Java's lambdas do not allow you to access local variables in surrounding scopes unless they are final or effectively final, so there is no difference between capturing a variable and capturing its currently held value.

The book's example shows the difference:

```scala
var more = 1
val addMore = (x: Int) => x + more
addMore(10)   // 11
more = 9999
addMore(10)   // 10009: the closure sees the variable, not the value 1
```


This is also why capturing a `var` makes a closure impure: `addMore(10)` gives different results over time. Capturing only `val`s avoids the problem, and in Haskell it never arises, because there are no mutable variables to capture.

## Returning functions and API design


From Płachta 2022, ch. 4:

> Returning functions is a foundation of designing flexible APIs.

In functional codebases the API is usually the function signature. Signatures are only part of it, though. Data types carry much of the API too: an algebraic data type says exactly which values a caller can build or must handle. Module boundaries (what a Haskell module exports, what a Scala object or trait exposes) and type classes are part of it as well.

### Delaying a parameter


Płachta 2022, ch. 4, motivates returning functions with `highScoringWords`:

> However, some repetition is still there, and it cannot be fixed with a new parameter. We need something more -- a technique that will enable us to specify only some parameters of a function and leave other ones for later.

The technique delays applying a parameter by having the function return a function. Returning a function from `highScoringWords` lets you provide two parameters in one place of the code and the third later. Written with one parameter group at a time (Scala 3):

```scala
def highScoringWords(wordScore: String => Int)(higherThan: Int)(words: List[String]): List[String] =
  words.filter(word => wordScore(word) > higherThan)

val withBonus = highScoringWords(w => score(w) + bonus(w))   // 2 parameters left
val above20   = withBonus(20)                                // 1 parameter left
above20(List("ada", "haskell", "scala"))                     // the result
```


The scoring rule is fixed once, the threshold in another place, and the word list last: 3 parameters, then 2, then 1. Each call fixes one parameter and returns a function waiting for the rest. Scala 2 needs a trailing `_` on the first partial application (`highScoringWords(...) _`); Scala 3 expands the method into a function automatically.

### Builders and fluent interfaces


The same chapter continues:

> This part will focus more on functional design -- how to create flexible APIs by treating functions as return values. We will be forced to use and learn about the functional way of implementing the builder pattern, method chaining, and fluent interface you may know from OOP.

Returning functions is one way to build values step by step. In Scala the more common functional builder is an immutable case class whose methods return modified copies: `Request.get(url).withHeader("A", "1").withTimeout(5.seconds)` reads like an OOP fluent interface, but every call returns a new value and none mutates the builder.

## Currying and partial application


Currying turns a function of several arguments into a chain of one-argument functions: `(Int, Int) => Int` becomes `Int => Int => Int`. Supplying the first argument returns a function waiting for the second, instead of a value. A "super adder" in Scala 3:

```scala
def add(x: Int)(y: Int): Int = x + y   // curried method, two parameter lists
val plus5 = add(5)                      // Int => Int (Scala 2: add(5) _)
plus5(10)                               // 15

val addF: Int => Int => Int = x => y => x + y
addF(1)(2)                              // 3
```


In Haskell every function is curried already: `add x y = x + y` has type `Int -> Int -> Int`, which means `Int -> (Int -> Int)`.

Currying is not used for its own sake. The point is partial application: building specialized functions from general ones. The two are often confused. Currying is the transformation of the function's type; partial application is supplying some of the arguments, and it can be done without currying.

- Stack Overflow, "Two ways of currying in Scala; what's the use case for each": <https://stackoverflow.com/questions/4915027/two-ways-of-currying-in-scala-whats-the-use-case-for-each>

### Placeholder syntax


Scala's placeholder syntax partially applies a method that is not curried:

```scala
def sum(a: Int, b: Int, c: Int) = a + b + c
val b = sum(1, _: Int, 3) // b has type Int => Int
```


`sum(1, _: Int, 3)` is shorthand for `x => sum(1, x, 3)`. Any argument can be left open, not only the last. From *Programming in Scala*:

> Since only one argument is missing, the Scala compiler generates a new function class whose apply method takes one argument.
>
> Partially applied functions provide a nice clean way to create specialized functions from general methods.

Caveat: "generates a new function class" describes the book's conceptual model. Since Scala 2.12 the compiler implements lambdas with the JVM's `invokedynamic` and `LambdaMetafactory`, so no separate class file is written for each function literal; a function object is still created at run time.

### Argument order


> Anytime you might want to use a closure (which in Haskell is pretty much anytime), you want to order your arguments _from most to least general_. In this case, each host can have multiple API keys, each API key is going to use different resources, and each resource is going to have many IDs associated with it. The same is true when you define ifEven; the function you pass will work with a huge range of inputs, so it's more general and should appear first in the argument list.

Ordering from general to specific makes partial application line up with how values are reused:

```haskell
requestUrl :: String -> String -> String -> String -> String
requestUrl host apiKey resource id' =
  host ++ "/" ++ resource ++ "/" ++ id' ++ "?token=" ++ apiKey

exampleHost = requestUrl "http://example.com"   -- fix the host once
myKey       = exampleHost "1337"                 -- then a key
books       = myKey "book"                       -- then a resource

-- in GHCi: books "1234" is one request
```


With the order reversed, every one of these partial applications would need a lambda.

It is a rule of thumb, not a law. When a library got the order wrong for your use, `flip` and operator sections such as `` (`div` 2) `` fix it locally. Haskell's base library follows the convention: `map f xs`, `filter p xs` and `foldr f z xs` all take the function first.

## Custom control structures


From the control abstraction chapter of *Programming in Scala*:

> This technique is called the loan pattern, because a control-abstraction function, such as withPrintWriter, opens a resource and "loans" it to a function.

```scala
import java.io.{File, PrintWriter}

def withPrintWriter(file: File, op: PrintWriter => Unit) =
  val writer = new PrintWriter(file)
  try op(writer)
  finally writer.close()

withPrintWriter(
  new File("date.txt"),
  writer => writer.println(new java.util.Date)
)
```


With multiple parameter lists, the call looks like a built-in construct:

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


The second version works because Scala lets you pass the argument of a one-argument parameter list in curly braces, so the call reads like `while`. The function owns the resource's lifetime: the caller can't forget to close the writer, and it is closed even if `op` throws. The other common ingredient of custom control structures is by-name parameters (see [Call-by-name in Scala]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#call-by-name-in-scala)).

Since Scala 2.13 the standard library has this pattern built in: `scala.util.Using.resource(new PrintWriter(file))(op)` closes any `AutoCloseable`, and `Using(...)` returns the result in a `Try`. Haskell has the same pattern as `withFile` and, more generally, `bracket` from `Control.Exception`.

### The file matcher


Section 9.1 of *Programming in Scala*, "Reducing code duplication", in chapter 9, "Control Abstraction", shows higher-order functions and lambdas removing duplication. A `FileMatcher` object starts with three near-identical methods, `filesEnding`, `filesContaining` and `filesRegex`, which differ only in the test applied to each file name. They are refactored into one `filesMatching(query, matcher: (String, String) => Boolean)` that takes the test as a function, so each original becomes a one-liner such as `filesMatching(query, _.endsWith(_))`. Closures then simplify it further.

Common misconception: the original jot called these "first-order functions". A first-order function takes and returns plain values; passing the test in as a function is what makes `filesMatching` higher-order.

- [ ] Work through the file matcher in section 9.1 of *Programming in Scala*.

## Composition


The ability to compose functions is a central feature of functional programming.

### Composition and application in Haskell

```haskell
putStrLn . show $ 1 + 1
fmap (> 0) $ Just (-1)
```


`.` composes functions: `(f . g) x = f (g x)`. `$` is function application with the lowest precedence, so everything to its right is evaluated as one argument. `putStrLn . show $ 1 + 1` therefore reads as `(putStrLn . show) (1 + 1)` and prints `2`; `putStrLn . show` is what `print` does.

The second line contains no composition. It shows `$` saving parentheses, plus `fmap` mapping over a `Maybe` (see [Functor]({{< ref "functional-programming/02-abstractions/functor" >}})): `fmap (> 0) $ Just (-1)` is `fmap (> 0) (Just (-1))`, which is `Just False`.

The two combine in point-free definitions, which define functions without naming their argument:

```haskell
positive :: (Functor f, Num a, Ord a) => f a -> f Bool
positive = fmap (> 0)

showAll :: [Int] -> [String]
showAll = map show . filter even
```

### Pipelines


Płachta 2022, ch. 5, on writing pipeline-based algorithms:

> We can write many computations as a sequence of operations -- a pipeline -- that together make a bigger, more involved operation. It's a different take on creating sequential programs.

The larger program is composed from smaller pieces. In Scala a pipeline is usually a chain of collection methods, or explicit composition with `andThen` and `compose`:

```scala
val clean: String => String         = _.trim.toLowerCase
val words: String => List[String]   = _.split("\\s+").toList
val pipeline: String => Int         = clean andThen words andThen (_.distinct.size)
pipeline("  The cat saw the CAT ")    // 3
```


Each stage is a small function you can test alone. The Haskell version of the idea, with a worked example, is in [Wholemeal programming]({{< ref "functional-programming/05-practice/functional-refactoring" >}}#wholemeal-programming).

### Composing functions with different effects


- Scala Users forum, "Composing functions involving different effects": <https://users.scala-lang.org/t/composing-functions-involving-different-effects/6194/10>

The problem in the thread's title: `f: A => Option[B]` and `g: B => Either[E, C]` don't compose with `andThen`, because the output of `f` isn't the input of `g`. Functions of the form `A => F[B]` compose with `flatMap` (Kleisli composition) only when they share the same `F`. Mixing effects means converting one into the other first, for example `f(a).toRight(err).flatMap(g)`, or using a monad transformer or an effect type that covers both (see [Effect systems]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#effect-systems)).

See also: [Call-by-name in Scala]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#call-by-name-in-scala) for by-name parameters in control structures, [Recursion and folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}) for higher-order functions over lists, [Wholemeal programming]({{< ref "functional-programming/05-practice/functional-refactoring" >}}#wholemeal-programming) for pipelines in Haskell, [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}) for `fmap`, [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}) for composing functions that return `Option` or `Either`, and [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}) for monad transformers.

## Library sources


- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala (5th edition)*: source of the closures passage, the placeholder partial application, the loan pattern and the file matcher (the chapters on functions and closures, and on control abstraction).
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: section 5.4, Currying (every function takes one argument; partial application, manual currying and uncurrying, sectioning), and section 7.6, Higher-order functions (`flip`), on *Currying and partial application* and *Argument order*; section 2.9, Parenthesization, on `($)`, and sections 7.8 and 7.9, Function composition and Pointfree style, on *Composition and application in Haskell*.
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: section 3, "Gluing Functions Together", is the refactoring move under Small functions as parameters applied to `sum`, turning its parts into parameters to get `foldr` and then `map`; section 4, "Gluing Programs Together", composes whole programs as `g . f`, run on demand; on *Small functions as parameters* and *Pipelines*.
- Płachta 2022, *Grokking Functional Programming*: chapter 4, Functions as values, is the source of the passages under Small functions as parameters and Returning functions and API design (`rankedWords`, `highScoringWords`, returning functions, multiple parameter lists and currying); chapter 5, Sequential programs, is the source of the pipeline passage under Composition.
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*: chapter 8, Understanding Functions: functions as values, currying, partial application, total functions and composition, in F#; chapter 9 uses partial application to bake dependencies into the steps of a pipeline.
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-kleisli-composition-flatmap-join-map-unit.pdf.enc), *Kleisli composition, flatMap, join, map, unit*: Kleisli composition (`>=>`) of functions `A => F[B]`, defined through `flatMap`; on composing functions with different effects.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 1, Getting Started with Haskell, section "Writing Functions": automatic currying, partial application and η-reduction, and `flip` and backticks for supplying a later argument first. Its subsections "Composing Functions" (`($)` and `(.)`) and "Writing Functions with No Named Parameters" (pointfree style) cover the rest; on *Currying and partial application*, *Argument order* and *Composition and application in Haskell*.

Further reading:

- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*
- [Sfregola 2021](/sources/programming/scala/sfregola-2021-get-programming-with-scala.pdf.enc), *Get Programming with Scala*
- [Wampler 2021](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), *Programming Scala (3rd edition)*
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: section 5.3.1, "Kleisli Arrows", on `<=<`, which composes `a -> m b` arrows for one monad `m`, and section 10.1, "Combining Monads by Hand", where an evaluator over `Reader Assignment (Maybe Integer)` has to check failures by hand; on *Composing functions with different effects*.
