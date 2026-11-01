---
draft: false
toc: true
title: "Scala"
linkTitle: "Scala"
---

Notes on the Scala language: the library ecosystem, expressions and methods, classes and objects, operators, comprehensions, collections, traits, abstract members, variance, string interpolators, encapsulation, implicits, and where to learn more.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Ecosystem and libraries


Cats Effect 3, Tapir, Sttp, Fs2, Akka

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Cats Effect 3 is the Typelevel effect runtime (`IO`, fibers, resources). Tapir describes HTTP endpoints as typed values and turns them into servers, clients and OpenAPI docs. sttp is an HTTP client library. Tapir and sttp both come from SoftwareMill. fs2 is the Typelevel library for functional streams, built on Cats Effect. Akka is Lightbend's actor toolkit.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Akka is the odd one out: it is not an effect-system library, and since September 2022 (Akka 2.7) it is under the Business Source License rather than Apache 2.0. Apache Pekko is the Apache-licensed fork of Akka 2.6 that most open-source projects moved to.
{{< /callout >}}


ScalaTypelevel stack (Cats, ZIO, http4s, etc.)

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
ZIO is not part of Typelevel. It is a separate ecosystem with its own effect type, streams, HTTP library and dependency injection (`ZLayer`). The Typelevel stack is Cats, Cats Effect, fs2 and http4s, plus related libraries such as circe and doobie. The two ecosystems interoperate through the `zio-interop-cats` module, but a codebase usually picks one.
{{< /callout >}}


Framework: ZIO, CATs (Any other Scala framework also work)

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Cats is a library of type classes (Functor, Monad, Traverse and so on), not a framework, and it has no runtime. The counterpart of ZIO is Cats Effect. In a job description this line usually means "experience with a purely functional effect system".
{{< /callout >}}


tapir, monix, effect systems, concurrency utilits

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Monix provides `Task` (an effect type) and `Observable` (reactive streams). Its `Task` predates Cats Effect 3 and was one of the main effect types in the Cats Effect 2 era.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Monix has not kept pace since Cats Effect 3 appeared, so new code usually chooses Cats Effect `IO` or ZIO. Check the project's current status before adopting it.
{{< /callout >}}


**Scala ecosystems:** ZIO?, Typelevel

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
These are the two main functional-programming ecosystems. Outside them are Akka or Pekko with Play, the libraries of Li Haoyi (os-lib, requests, upickle, Mill), and plain "direct style" Scala with the standard library.
{{< /callout >}}


<https://www.ziverge.com/post/zio-in-2025>

scala IO libraries: cats IO, zio, monix

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"cats IO" means the `IO` type from Cats Effect. Cats itself has no `IO`.
{{< /callout >}}


[Effect Systems]({{< ref "functional-programming/effect-systems" >}})

## Learning and practice


grokking scala notes (PDF)

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Probably *Grokking Functional Programming* by Michał Płachta (Manning, 2022), which teaches functional programming in Scala 3. The for-comprehension example and the parsing passage under Comprehensions below come from it.
{{< /callout >}}


read de goes articles <https://degoes.net/articles/>

book? <https://www.creativescala.org/>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
*Creative Scala* is a free book by Dave Gurnell and Noel Welsh that teaches Scala and functional programming through drawing pictures with the Doodle library. The same authors wrote *Scala with Cats* (see Library sources).
{{< /callout >}}


<https://www.creativescala.org/case-study-parser/>

<https://github.com/jdegoes/lambdaconf-2014-introgame>

todo:

get Monad definition

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In Scala 3, the usual encoding is a type class over a type constructor `F[_]`:
```scala
trait Monad[F[_]]:
def pure[A](a: A): F[A]
extension [A](fa: F[A])
def flatMap[B](f: A => F[B]): F[B]
def map[B](f: A => B): F[B] = fa.flatMap(a => pure(f(a)))
```
An instance must satisfy three laws: `pure(a).flatMap(f) == f(a)` (left identity), `fa.flatMap(pure) == fa` (right identity) and `fa.flatMap(f).flatMap(g) == fa.flatMap(a => f(a).flatMap(g))` (associativity). In Scala 2 the extension block becomes a plain method `def flatMap[A, B](fa: F[A])(f: A => F[B]): F[B]`. Cats defines `Monad` in this way. See [Monads]({{< ref "functional-programming/monads" >}}#why-monads).
{{< /callout >}}


create guide with examples on most common scala topics (video <https://www.youtube.com/watch?v=1uw1Qb1wrNk>)

<https://aperiodic.net/phil/scala/s-99/>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
S-99, "Ninety-Nine Scala Problems", is Phil Gold's Scala adaptation of the Prolog problem set P-99: list, arithmetic, logic, tree and graph exercises. The solutions on the site are written in old Scala 2 style.
{{< /callout >}}


<https://github.com/absent1706/saga-framework>

## Expressions, blocks and methods


Instructions are executed (think Java), expressions are evaluated (think Scala)

In Scala we think in terms of expressions.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In Scala, `if`, `match`, `try` and blocks all produce values, so you write `val sign = if x < 0 then -1 else 1` instead of assigning a variable inside each branch.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The contrast is between statements and expressions, and it is a matter of degree. Java has expressions too, and since Java 14 even `switch` can be one. Scala still has constructs run only for their effect: an assignment `x = 1` and a `while` loop are expressions of type `Unit`, which carries no information.
{{< /callout >}}


Code block is an expression as he can be on the right sight of the `=`. Blocks has it's own scope. Code blocks also allow you define functions.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The value of a block is the value of its last expression:
```scala
val area = {
val r = 2.0
def square(x: Double) = x * x
math.Pi * square(r)
}
```
`r` and `square` are visible only inside the braces.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
A block isn't an expression because it can stand after `=`; it can stand there because it is an expression. Strictly, `def` inside a block defines a local method, not a function value. In Scala 3 the braces can be replaced by indentation.
{{< /callout >}}


methods and return

The recommended style for methods is in fact to avoid having explicit, and especially multiple, return statements. Instead, think of each method as an expression that yields one value, which is returned. This philosophy will encourage you to make methods quite small, to factor larger methods into multiple smaller ones.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
There is also a technical reason to avoid `return`. Inside a lambda, `return` exits the enclosing method, not the lambda, and is implemented by throwing an exception. Scala 3.2 deprecated these non-local returns, and Scala 3.3 added `scala.util.boundary` and `break` as the explicit replacement.
{{< /callout >}}


Use val, not var.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
As a default, yes. *Programming in Scala* itself argues for a balanced attitude: a local `var` inside a method that is pure from the outside is sometimes the clearest code. See [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#side-effects).
{{< /callout >}}

## Classes and objects

### Class parameters and fields


In Java, classes have constructors, which can take parameters;

whereas in Scala, classes can take parameters directly. The Scala notation

is more concise -- class parameters can be used directly in the body of the

class; there's no need to define fields and write assignments that copy

constructor parameters into fields. This can yield substantial savings in

boilerplate code, especially for small classes.

Class parameters are not class members/fields. You can use `val` keyword in class definition:

```scala
class Person(name: String, val age: Int = 10)
```

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
More precisely, a plain parameter is not a *public* member. If it is used only in the constructor, no field is generated. If a method uses it, the compiler stores it in a private field that belongs to that instance only, which is why the quote below says you can access it only on the object on which the method was invoked. `val` makes it a public read-only field, `var` a public mutable one.
{{< /callout >}}


When neither val nor var are specified on constructor parameters, the visibility of the field becomes very restricted, and Scala doesn't generate accessor or mutator methods

When case classes are involved, by default each parameter has `val` modifier.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A case class also gets structural `equals` and `hashCode`, a readable `toString`, a `copy` method, and a companion object with `apply` (construction without `new`) and `unapply` (pattern matching).
{{< /callout >}}


Although class parameters `n` and `d` are in scope in the code of your add

method, you can only access their value on the object on which `add` was

invoked. You don't have access to class parameters from outside of the object.

Class body defined by `{}`. `val and var` definitions inside class body is fields.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
In Scala 3 the braces are optional: `class Person(name: String):` followed by an indented body works too. `def`s in the body are methods, and a `lazy val` is a field initialised on first access.
{{< /callout >}}


Inside a class definition, you place fields and methods, which are collectively called *members*.

Fields are also known as *instance variables*, because every instance gets its own set of the variables. Collectively, an object's instance variables make up the memory image of the object.

Public is Scala's default access level.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Scala has no `public` keyword. To restrict access you write `private`, `protected`, or a qualified form such as `private[mypackage]`.
{{< /callout >}}

### Parameterization


When you instantiate an object in Scala, you can *parameterize* it with values and types. Parameterization means "configuring" an instance when you create it. You parameterize an instance with values by passing objects to a constructor in parentheses.

You can parameterize arrays with types.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
For example, `new Array[String](3)` is parameterised with the type `String` and the value `3`. Type parameters go in square brackets, value arguments in parentheses.
{{< /callout >}}

### Singleton and companion objects


Each singleton object is implemented as an instance of a *synthetic class* referenced from a static variable, so they have the same initialization semantics as Java statics.[4] In particular, a singleton object is initialized the first time some code accesses it.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A companion object is an `object` with the same name as a class, defined in the same file. The class and its companion can access each other's private members. Factory methods, constants and type-class instances usually live there.
{{< /callout >}}


objects is a dedicated

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The sentence is unfinished. It probably meant that an `object` defines a dedicated singleton: a type with exactly one instance, created lazily.
{{< /callout >}}


`apply` in objects

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`Person("Ann")` is shorthand for `Person.apply("Ann")`, so an `apply` method in the companion object acts as a factory. Scala 3 adds such a call for every class ("creator applications"), so `new` can be omitted even without a hand-written `apply`.
{{< /callout >}}


Scala does not have class-level functionality

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
More precisely, Scala has no `static` members. Their role is taken by the companion object, and for Java interop the compiler adds static forwarder methods to the class for the methods of its companion.
{{< /callout >}}

### Anonymous classes and function objects


anonimous classes

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`new Runnable { def run() = println("hi") }` creates an instance of an unnamed class that extends the trait and implements its abstract members on the spot.
{{< /callout >}}


Anonimous functions:

```scala
val incrementer = new Function1[Int, Int] {
override def apply(x: Int) = x + 1
}
val two = incrementer(1)
```

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
This is an anonymous *class* implementing `Function1`, which shows what a function value is: an object with an `apply` method. The anonymous *function* is the literal `val incrementer = (x: Int) => x + 1`. Since Scala 2.12, function literals compile to JVM lambdas (`invokedynamic`) rather than one class per literal.
{{< /callout >}}


Single Abstract Method Pattern.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Since Scala 2.12, a function literal can be used wherever a trait or abstract class with a single abstract method is expected, and the compiler converts it (SAM conversion): `val r: Runnable = () => println("hi")`. This is how Scala code passes lambdas to Java APIs.
{{< /callout >}}

### Repeated parameters

```scala
def echo(args: String*) =
   for arg <- args do println(arg)
// and
val seq = List("one", "2")
echo(seq*)
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Inside `echo`, `args` is a `Seq[String]`. `seq*` passes the elements of an existing sequence as separate arguments. Both lines use Scala 3 syntax; Scala 2 writes `for (arg <- args) println(arg)` and `echo(seq: _*)`.
{{< /callout >}}

## Operators and method syntax


infix notation = operator notation (syntactic sugar): `s indexOf 'o'`

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Scala 3 restricts this for alphanumeric names: a method like `indexOf` is meant to be called infix only if it is declared with the `infix` modifier, and the compiler warns otherwise under newer source levels. Symbolic methods such as `+` or `::` are unaffected. `s.indexOf('o')` is the normal style.
{{< /callout >}}


All operators are methods.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
True at the language level: `1 + 2` is `1.+(2)`. The compiler still emits a primitive JVM addition for `Int`. `&&` and `||` are methods whose second parameter is by-name, which is how they short-circuit. `=` is not an operator method, and `==` is a final method on `Any` that handles `null` before calling `equals`.
{{< /callout >}}


postfix notation: `println(mary isAlive)` - only available for methods without parameters

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Postfix notation is a feature flag that needs `import scala.language.postfixOps`; without it you get a feature warning or, in newer versions, an error. The style guides advise against it because it confuses semicolon inference. Write `mary.isAlive`.
{{< /callout >}}


`apply` method -> use as `mary()`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`x(args)` desugars to `x.apply(args)` for any value `x` whose type has an `apply` method. That's why `xs(0)` indexes a `List`, `m(key)` looks up a `Map`, and calling a function value `f(1)` works.
{{< /callout >}}

## Comprehensions


`yield` keyword:

In Scala, the `yield` keyword is used in conjunction with the for loop to store a variable at each iteration of the loop. The stored variables are then combined to form a collection that is returned as the result of the loop.

It's like the for loop has a buffer you can't see, and for each iteration of your for loop another item is added to that buffer. When your for loop finishes running, it will return this collection of all the yielded values. The type of the collection that is returned is the same type that you were iterating over

```scala
val nums = List(1, 2, 3)
val doubled = for (n <- nums) yield n * 2
```

```scala
def scalaFiles =
    for {
        file <- filesHere
        if file.getName.endsWith(".scala")
    } yield file
```

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The buffer is a useful picture for collections, but no loop or buffer is involved. `for ... yield` is rewritten into `map`, `flatMap` and `withFilter` calls, which is why it also works for `Option`, `Either`, `Future` and `IO`, where nothing is iterated. The result type is decided by the first generator's `flatMap` or `map`, and isn't always the same: `for (c <- "abc") yield c.toUpper` gives a `String`, but yielding something other than a pair from a `Map` gives an `Iterable`.
{{< /callout >}}


For-comprehension is to sugar really common chains of map and flatmap functions.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
```scala
for { x <- xs; if x > 0; y <- ys } yield x * y
// is rewritten to
xs.withFilter(x => x > 0).flatMap(x => ys.map(y => x * y))
```
Every generator except the last becomes a `flatMap`, the last becomes a `map`, and each `if` a `withFilter`. A `for` without `yield` becomes `foreach`.
{{< /callout >}}


`validateRadius` and `filterFunction` in for comprehension (function returns `List[P]`)

```scala
for {
 r <- riskyRadiuses
 validRadius <- validateRadius(r)
 point <- points
 inPoint <- insideFilter(point, validRadius)
} yield s"$inPoint is within a radius of $r") == List("Point(1,1) is within a radius of 2"))
```

we can mix enumerator types in for comprehension

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The example is from chapter 5 of *Grokking Functional Programming*. `validateRadius` returns `List(r)` for a valid radius and `List.empty` otherwise, so a generator over it acts as a filter. `insideFilter` (called `filterFunction` in the note's first line) works the same way for points. The last line has a stray `)` and `== List(...)` left over from an assertion. The expected result is `List("Point(1,1) is within a radius of 2")`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Every generator in this example is a `List`, so it doesn't mix types; the book's mixing example puts a `List` and a `Set` in one comprehension. The book says the compiler "casts" the second collection, which is not what happens. `List.flatMap` accepts any function returning an `IterableOnce`, so a `Set` (or an `Option`) can supply elements to it. The reverse fails: `Option.flatMap` needs a function returning an `Option`, so `List` inside an `Option` comprehension doesn't compile, and neither does mixing `Option` with `Future` or `Either`. That gap is what monad transformers and effect types address.
{{< /callout >}}


For loops in "Programming in Scala" ([PDF](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc))

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In the 5th edition, section 7.3 "For expressions" (chapter 7, Built-in Control Structures) covers iterating over collections, filters, nested generators, mid-stream variable bindings and `yield`.
{{< /callout >}}

### Parsing as a pipeline


example: Parsing as pipeline

when parsing -> toIntOption

We will use function composition to our

advantage not only in advanced error handling but also in side-effectful

programming, multithreading, and testing later in the book!

...

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"Parsing as a pipeline" is the last section of chapter 5 of *Grokking Functional Programming*, which introduces `Option`; `toIntOption` and the quoted sentence are from chapter 6, Error handling. `"1985".toIntOption` is `Some(1985)` and `"MCMLXXXV".toIntOption` is `None` (Scala 2.13 and later), so parsing never throws. Each step returns an `Option`, and the steps are chained:
```scala
def parseEvent(name: String, startStr: String, endStr: String): Option[Event] =
for
n     <- Option(name).filter(_.nonEmpty)
start <- startStr.toIntOption
end   <- endStr.toIntOption.filter(_ < 3000)
if start <= end
yield Event(n, start, end)
```
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`Option` says that parsing failed but not why. When the caller needs the reason, use `Either[String, A]` (or `toIntOption.toRight("not a number")`), which composes the same way.
{{< /callout >}}

## Functional collections


Sets are invocable like a functions. => Sets ARE Functions! `A => Boolean`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`Set[A]` extends `A => Boolean`, so `Set(1, 2)(1)` is `true` and a set can be passed directly to `filter`: `xs.filter(allowed)`. In the same way `Map[K, V]` is a `PartialFunction[K, V]`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Being a function `A => Boolean` is also the usual explanation for why `Set` is invariant in `A` while `List` is covariant: a function is contravariant in its argument type, so `Set[A]` can't be covariant (see [Variances](#variances)).
{{< /callout >}}


Seq are partial functions `Int => A`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`Seq[A]` extends `PartialFunction[Int, A]`: `xs.isDefinedAt(i)` checks the index, `xs(i)` throws outside the range, and `xs.lift(i)` returns an `Option[A]`.
{{< /callout >}}

### Rich wrappers


For each basic type described in this chapter, there is also a "rich wrapper" that provides several additional methods. These methods are available by implicit conversions

```scala
// "iterating"
val combinations = numbers.filter(_ % 2 == 0)
.flatMap(n => chars.flatMap(c => colors.map(color => "" + c + n + "-" + color)))
println(combinations)
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The passage is from the chapter on basic types and operations in *Programming in Scala*. `1 to 5`, `3.max(5)` and `-2.abs` come from `RichInt`, and `"abc".capitalize` from `StringOps`, through implicit conversions defined in `Predef`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The code block isn't about rich wrappers; it is a nested `filter`/`flatMap`/`map` chain, which reads better as a comprehension:
```scala
val combinations = for
n     <- numbers if n % 2 == 0
c     <- chars
color <- colors
yield "" + c + n + "-" + color
```
{{< /callout >}}

### Maps


associative map. You *can control the properties* of the maps you use in your program in a more fine-grained way - you could specify a particular implementation, or provide a default value for the map, or you could override any other method of the map you create.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
For example, `TreeMap` keeps keys sorted, `mutable.LinkedHashMap` keeps insertion order, and `Map("a" -> 1).withDefaultValue(0)` returns `0` for missing keys instead of throwing.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Overriding methods means subclassing a collection class, which is rarely done in practice; wrapping the map or using `withDefault` covers most needs.
{{< /callout >}}

## Traits


Traits have two main uses: They allow you to define classes through mixin composition, and they define types.

1. Mixins. Sometimes you may intend a trait to be used primarily as a mixin, and not as a type. You can indicate that you don't want the name of a trait to appear in inferred types by declaring it with the `transparent` modifier.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`transparent trait` is Scala 3. Without it, `val x = if c then Cat() else Dog()` might be inferred as `Animal & Loggable` when `Loggable` is a helper mixin you never meant as a type; with `transparent trait Loggable` the compiler infers `Animal`. Scala 3 treats some standard traits such as `Product` and `Serializable` this way automatically.
{{< /callout >}}


In a basic use, a trait can be used as an interface, defining only abstract members that will be (need to be) implemented by other classes.

Traits can be used to define granular units of behavior, and then those granular units can be combined to build larger components.

in their most basic use, they can be used like a pre-Java 8 interface, where the primary reason you use them is to declare the signatures for abstract methods that extending classes must implement.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The interface use is only the start. Unlike Java interfaces, even after Java 8, traits can hold state (`val` and `var` fields), and in Scala 3 they can take parameters (`trait Greeting(val name: String)`).
{{< /callout >}}

### ? Stackable Trait Pattern

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Each trait overrides a method, does its own work and calls `super`, and the mix-in order decides the order of the calls. *Programming in Scala* (section 11.3, "Traits as stackable modifications") uses a queue:
```scala
abstract class IntQueue { def get(): Int; def put(x: Int): Unit }
class BasicIntQueue extends IntQueue { /* stores ints in a buffer */ }
trait Doubling extends IntQueue { abstract override def put(x: Int) = super.put(2 * x) }
trait Incrementing extends IntQueue { abstract override def put(x: Int) = super.put(x + 1) }

val q = new BasicIntQueue with Incrementing with Doubling
q.put(10) // Doubling runs first, then Incrementing: stores 21
```
`abstract override` says the method calls `super` on a method that must be provided concretely by whatever the trait is mixed into. It works because `super` in a trait is resolved late, as the next section says.
{{< /callout >}}

### super calls in traits


The key difference between classes and traits is that whereas in classes,

super calls are statically bound, in traits, they are dynamically bound. If

you write "super.toString" in a class, you know exactly which method

implementation will be invoked. When you write the same thing in a trait,

however, the method implementation to invoke for the super call is unde-

fined when you define the trait. Rather, the implementation to invoke will

be determined anew each time the trait is mixed into a concrete class.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The rule that fixes the order is *linearization*: the compiler puts the class and all its traits in a single line, roughly right to left in the `extends ... with ...` clause, and `super` means the next element in that line. "Dynamically" means "per concrete class at compile time", not at run time.
{{< /callout >}}

### Thin vs Rich Interfaces


Adding a concrete method to a trait tilts the thin-rich trade-off heavily

towards rich interfaces, because it is is a one-time effort. You only need to

implement the concrete method once, in the trait itself, instead of needing to

reimplement it for every class that mixes in the trait. Thus, rich interfaces

are less work to provide in Scala than in a language without traits.

To enrich an interface using traits, simply define a trait with a small num-

ber of abstract methods -- the thin part of the trait's interface -- and a poten-

tially large number of concrete methods, all implemented in terms of the

abstract methods. Then you can mix the enrichment trait into a class, imple-

ment the thin portion of the interface, and end up with a class that has all of

the rich interface available.

A good example of a domain where a rich interface is convenient is com-

parison. `Comparable` example

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The book's example is Scala's `Ordered[A]` trait: implement the one abstract method `compare`, and you get `<`, `>`, `<=` and `>=`:
```scala
case class Version(major: Int, minor: Int) extends Ordered[Version]:
def compare(that: Version) =
if major != that.major then major - that.major else minor - that.minor
```
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Idiomatic Scala now usually prefers the `Ordering[A]` type class to inheriting `Ordered[A]`: an ordering can be defined for types you don't own, and there can be more than one. Type classes with extension methods are the other way to get a rich interface from a thin one.
{{< /callout >}}

### Self-Type

{{< callout context="caution" title="Note" icon="outline/alert-triangle" >}}
create several alternatives
**Self Types** are a way of specifying the dependencies for a class/trait in Scala. Using this, the compiler can enforce to provide the required dependencies while instances are created.
{{< /callout >}}

<https://yadukrishnan.live/self-type-in-scala>

<https://blog.rockthejvm.com/self-types/>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
An alternative wording: a self-type `self: B =>` declares that a trait can only be mixed into something that is also a `B`, which lets the trait's body use `B`'s members without the trait itself extending `B`.
```scala
trait UserRepo { def find(id: Long): Option[User] }
trait UserService { self: UserRepo =>
def nameOf(id: Long) = find(id).map(_.name)
}
object App extends UserService with UserRepo { def find(id: Long) = ??? }
```
Unlike `extends`, `UserService` doesn't become a subtype of `UserRepo`; the requirement is checked when a concrete class is built.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
This is the basis of the "cake pattern" for dependency injection, which most Scala teams have since abandoned as heavy and hard to follow. Constructor parameters do the same job more plainly (see Dependency Injection below).
{{< /callout >}}

## Abstract members


A member of a class or trait is abstract if the member does not have a com-

plete definition in the class. Abstract members are intended to be imple-

mented in subclasses of the class in which they are declared.

But Scala goes beyond that and implements the idea in its

full generality: Besides methods, you can declare abstract fields and even

abstract types as members of classes and traits.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
All four kinds in one trait:
```scala
trait Abstract:
type T
def transform(x: T): T
val initial: T
var current: T
```
A subclass fixes them with `type T = String`, a `def`, a `val` and a `var`. Abstract types are covered in [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#abstract-types-and-type-members).
{{< /callout >}}

## Variances

#todo: find about links between variance and functions, parameters, errors, collections

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The links come from one rule: a type parameter used only in outputs can be covariant (`+`), one used only in inputs can be contravariant (`-`). Functions are `Function1[-A, +B]`: a function that accepts any `Animal` can stand in where one accepting `Cat` is expected, and one returning `Cat` where one returning `Animal` is expected. Immutable collections are covariant (`List[+A]`), mutable ones invariant. Error types are usually covariant: `Either[+E, +A]`, and ZIO's `ZIO[-R, +E, +A]` is contravariant in its environment `R`.

In the 5th edition, chapter 18 "Type Parameterization" has 18.3 Variance annotations, 18.4 Checking variance annotations, 18.5 Lower bounds and 18.6 Contravariance; 18.6 is where the Liskov Substitution Principle comes in. Section 18.5 is about lower bounds, which is where the next quote comes from.
{{< /callout >}}


variance annotations and lower bounds play well together. They are a good example of type-driven design, where the types of an interface guide its detailed design and implementation.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The book's example is a covariant queue. `def enqueue(x: T)` is rejected in `Queue[+T]` because `T` would appear in an input position. A lower bound fixes it: `def enqueue[U >: T](x: U): Queue[U]`. Adding an `Orange` to a `Queue[Apple]` gives a `Queue[Fruit]`. `List`'s `::` and `prepended` use the same trick.
{{< /callout >}}


Box example. #todo from tour in Scala

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The Box example is on the Variances page of the Tour of Scala. In outline:
```scala
class Box[A](var content: A)
val catBox: Box[Cat] = Box[Cat](Cat("Felix"))
val animalBox: Box[Animal] = catBox // does not compile...
animalBox.content = Dog("Fido")      // ...because this would put a Dog in catBox
```
Making the field a `val` and the class `ImmutableBox[+A]` removes the problem, which is the point of the quotes below.
{{< /callout >}}


From this, we have to conclude that `Box[Cat]` and `Box[Animal]` can't have a subtyping relationship, even though Cat and Animal do. In another words, The problem we ran in to above, is that because we could put a Dog in an Animal Box, a Cat Box can't be an Animal Box.

### Covariance


We say that ImmutableBox is covariant in `A`, and this is indicated by the `+` before the `A`.

More formally, that gives us the following relationship: given some `class Cov[+T]`, then if `A` is a subtype of `B`, `Cov[A]` is a subtype of `Cov[B]`. This allows us to make very useful and intuitive subtyping relationships using generics.

We've seen we can accomplish covariance by making sure that we can't put something in the covariant type, but only get something out.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The compiler's actual rule is about positions, not about putting things in: a covariant type parameter may not appear as a method parameter type or as the type of a `var`. A method can still accept new elements if it introduces a lower-bounded type parameter, as with `enqueue[U >: T]` above.
{{< /callout >}}

### Immutability and Variance


Immutability constitutes an important part of the design decision behind using variance. For example, Scala's collections systematically distinguish between [mutable and immutable collections](https://docs.scala-lang.org/overviews/collections-2.13/overview.html). The main issue is that a covariant mutable collection can break type safety. This is why `List` is a covariant collection, while `scala.collection.mutable.ListBuffer` is an invariant collection.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Java shows the danger: its arrays are covariant, so `Object[] objs = new String[1]; objs[0] = 1;` compiles and fails at run time with `ArrayStoreException`. Scala's `Array[A]` is invariant, so the equivalent doesn't compile.
{{< /callout >}}

## String interpolators


string interpolators and how they work

In Scala, string interpolation is implemented by rewriting code at com-

pile time. The compiler will treat any expression consisting of an identifier

followed immediately by the open double quote of a string literal as a string

interpolator expression. The s, f, and raw string interpolators are imple-

mented via this general mechanism. Libraries and users can define other

string interpolators for other purposes.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The rewrite turns `s"Hello, $name!"` into `StringContext("Hello, ", "!").s(name)`: the literal parts go to `StringContext`, the spliced expressions become arguments of a method named after the prefix. So a custom interpolator is just a method added to `StringContext`. In Scala 3:
```scala
extension (sc: StringContext)
def shout(args: Any*): String = sc.s(args*).toUpperCase

shout"hello $name" // "HELLO ANN"
```
In Scala 2 the same is an `implicit class` wrapping `StringContext`, with `sc.s(args: _*)`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Only the rewriting into a method call is guaranteed to happen at compile time; semantically `s` and `raw` are ordinary methods, though the compiler may optimise such calls into plain concatenation. `f` is different: the compiler checks its format string, so a mismatch such as `f"$name%d"` with a `String` is a compile error.
{{< /callout >}}

### Custom Interpolators


<https://blog.rockthejvm.com/how-to-create-your-own-string-interpolator/>

## Encapsulation


Private constructors and private members are one way to hide the initial-

ization and representation of a class. Another more radical way is to hide

the class itself and only export a trait that reveals the public interface of the

class.

**State Incapsulation**

Notice how we made the interpreter's constructor private. This has a fundamental reason: state shall not leak. If we were to make this constructor public, our Ref could be used in places where we have no control.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The idea comes from Volpe's *Practical FP in Scala*; the 2nd edition words it differently, so the quote is probably from the 1st edition. The constructor that creates the `Ref` is the only code that ever sees it:
```scala
trait Counter { def incr: IO[Unit]; def get: IO[Int] }
object Counter:
def make: IO[Counter] =
Ref.of[IO, Int](0).map { ref =>
new Counter:
def incr = ref.update(_ + 1)
def get  = ref.get
}
```
Creating a `Ref` is itself an effect, so `make` returns `IO[Counter]`, and each run of `make` creates a new counter.
{{< /callout >}}

### Exports

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Scala 3 `export` clauses create forwarder methods to the members of another object, which gives the convenience of inheritance with composition:
```scala
class Printer { def print(s: String) = println(s) }
class Service(p: Printer):
export p.print   // Service now has a print method that calls p.print
```
{{< /callout >}}

## Newtypes and refinement types


Value classes and opaque types moved to [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#primitive-obsession-and-the-newtype-pattern); refinement types and Iron to [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}#scalas-terminology-trap).

## Dependency Injection


<http://di-in-scala.github.io/>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The main options in Scala, from plainest to most structured: pass dependencies as constructor parameters and wire them by hand in one place (optionally with the MacWire macros), the cake pattern with self-types (see Self-Type above), the Reader monad or context parameters (`using`), and the effect libraries' own mechanisms, such as ZIO's `ZLayer` or Cats Effect `Resource`s composed in `main`.
{{< /callout >}}

## Implicits


implicit class ScenarioOps(scenario: BrickScenario)

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
An implicit class adds methods to an existing type: wherever it is in scope, `scenario.someOp` compiles by wrapping `scenario` in `ScenarioOps`. This is how Scala 2 writes extension methods. Scala 3 replaces it with `extension (scenario: BrickScenario) def someOp = ...`.
{{< /callout >}}


implicit conditional value

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Probably a conditional instance: an implicit that exists only if another one does. `implicit def listOrd[A](implicit ord: Ordering[A]): Ordering[List[A]]` gives an ordering for `List[A]` whenever there is one for `A`. In Scala 3: `given [A](using Ordering[A]): Ordering[List[A]] = ...`.
{{< /callout >}}


<https://www.lihaoyi.com/post/ImplicitDesignPatternsinScala.html>

implicit usage: <https://coderwall.com/p/6lwybw/boolean-operators-for-options>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Scala 3 splits Scala 2's single `implicit` keyword by purpose. Implicit parameters become `using` clauses, implicit values and instances become `given`s, implicit classes become `extension` methods, and implicit conversions become `given Conversion[A, B]` instances, which the compiler now discourages with a feature warning. Material written for Scala 2 maps onto these one by one.
{{< /callout >}}

### Extension methods

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Scala 3 syntax for adding methods to a type you don't own:
```scala
extension (s: String)
def shout: String = s.toUpperCase + "!"

"hi".shout // "HI!"
```
Extension methods inside a `given` instance are how type classes expose their operations, as in the `Monad` definition above.
{{< /callout >}}

## Design, architecture and talks


**Vanilla Scala** # Functional World #9 | Breaking framework chains with vanilla Scala

<https://www.youtube.com/watch?v=U67BAeH3cxo>

**Design and Modeling**

<https://docs.scala-lang.org/scala3/book/domain-modeling-fp.html>

<https://docs.scala-lang.org/scala3/book/types-adts-gadts.html>

<https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The three docs.scala-lang.org links are chapters of the official Scala 3 Book; they are the shortest starting point for modelling with case classes, enums and ADTs in Scala 3. See also [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}).
{{< /callout >}}


<https://www.youtube.com/watch?v=2JB1_e5wZmU>

<https://www.youtube.com/watch?v=yan1YOXvAUM>

<https://www.thoughtworks.com/en-cn/insights/blog/architecture/domain-driven-design-in-functional-programming>

<https://blog.rockthejvm.com/algebraic-data-types/>

<https://medium.com/bigpanda-engineering/refactoring-to-functional-patterns-in-scala-bf81e7abfe77>

<https://www.infoq.com/presentations/Type-Functional-Design/#.WgQgsvnDY9Q>

alvin alexander articles and books

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Alvin Alexander wrote the *Scala Cookbook* (in the library, see below) and *Functional Programming, Simplified*, whose online version is the alvinalexander.com fp-book link under To study.
{{< /callout >}}


functional reactive modelling book ([PDF](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc))

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Probably *Functional and Reactive Domain Modeling* by Debasish Ghosh (Manning, 2016), which builds domain models in Scala with algebraic data types, type classes and reactive techniques.
{{< /callout >}}


<https://www.youtube.com/watch?v=b3qUNnJYXb4>

<https://www.youtube.com/watch?v=6GA9cXgidBs>

<https://softwaremill.com/principles-of-developing-applications-in-scala/> #project how to move to FP

<https://www.youtube.com/watch?v=WZBuelv_cxQ>

<https://github.com/twitter/twitter-server>

<https://github.com/twitter/finatra>

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Twitter's server stack (Finagle, Finatra, twitter-server, util) is built on Twitter's own `com.twitter.util.Future`, not Scala's `Future` or an effect system. Check that it is still maintained before studying it as a model.
{{< /callout >}}


<https://www.youtube.com/watch?v=-qf8yteuxPs>

[[exercises]]

## To study


<https://alvinalexander.com/scala/fp-book/how-to-write-functions-multiple-parameter-groups/>

variables in fuctional programming & side effects.

referential transparency

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
An expression is referentially transparent if replacing it with its value never changes the program's behaviour. See [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#referential-transparency).
{{< /callout >}}


call-by-name and it's usage

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Covered in [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#call-by-name-in-scala).
{{< /callout >}}


currying, it's usage and partial functions

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Partial functions are a different thing from partial application. A partially applied function fixes some arguments: `val add5 = add(5, _)`. A `PartialFunction[A, B]` is defined only for some inputs, as a `{ case ... }` literal, and is what `collect` takes. Currying and partial application are in [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#currying-and-partial-application).
{{< /callout >}}


map and flatmap chain to for comprehension

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
See the desugaring under [Comprehensions](#comprehensions).
{{< /callout >}}


covariant type parameter

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
See [Variances](#variances).
{{< /callout >}}


[Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#functional-combinators)

@targetName(".")

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`@targetName` (Scala 3, `scala.annotation.targetName`) sets the name a method gets in the bytecode, so a symbolic operator has a readable name for Java callers and stack traces: `@targetName("append") def ++(other: Buf): Buf`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The argument should be an alphanumeric name. A dot is not a legal JVM method name, so `"."` here can only be a placeholder.
{{< /callout >}}


right-associative methods (ending in ":")

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A method whose name ends in `:` is called on its right operand: `1 :: Nil` means `Nil.::(1)`, and `x +: xs` means `xs.+:(x)`. That's why prepending reads left to right in code, and why `::` chains like `1 :: 2 :: Nil` group to the right.
{{< /callout >}}


infix types

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A type constructor with two parameters can be written between its arguments: `type ×[A, B] = (A, B)` lets you write `Int × String`. Scala 3's `A & B` and `A | B` are built-in infix types.
{{< /callout >}}


apply/unapply usage

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`apply` builds a value, `unapply` takes one apart for pattern matching. An object with only `unapply` is an extractor:
```scala
object Even:
def unapply(n: Int): Option[Int] = if n % 2 == 0 then Some(n / 2) else None

10 match
case Even(half) => s"twice $half"
case _          => "odd"
```
Case classes generate both in their companion object.
{{< /callout >}}


eta-expansion

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Turning a method into a function value: given `def inc(x: Int) = x + 1`, `List(1, 2).map(inc)` passes `x => inc(x)`. Scala 2 does this automatically only where a function type is expected and otherwise needs `inc _`; Scala 3 does it for any method with parameters, so `val f = inc` works.
{{< /callout >}}


context functions

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Scala 3 function types whose parameters are passed implicitly, written `A ?=> B`. `type Logged[T] = Logger ?=> T` lets `def work: Logged[Int] = ...` use `summon[Logger]` in its body, and callers supply the `Logger` with a `given`. They are useful for builder DSLs and for passing context such as transactions.
{{< /callout >}}


implicit conversions; autobox and

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Two separate mechanisms. Autoboxing is done by the compiler: `Int` is compiled to a JVM `int` where possible and boxed into `java.lang.Integer` when used generically or as `Any`, with no implicit involved. Implicit conversions are user-visible: `Predef` defines some, such as `int2Integer` for Java interop and the conversions to rich wrappers. See [Implicits](#implicits).
{{< /callout >}}


type constructor; and HKT

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`List` is a type constructor: given a type `Int` it produces the type `List[Int]`. A higher-kinded type abstracts over type constructors, as in `trait Functor[F[_]]`. See [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#higher-kinded-types).
{{< /callout >}}


<https://github.com/pauljamescleary/scala-pet-store>

from reddit <https://www.reddit.com/r/haskell/comments/wp4h72/what_about_scala_3/>

structural subtyping, dependent types

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
See [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#nominal-and-structural-subtyping) and [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#path-dependent-types).
{{< /callout >}}


Type constructors

<https://stackoverflow.com/questions/45300288/what-is-type-and-what-is-type-constructor-in-scala>

<https://blog.rockthejvm.com/scala-types-kinds/>

types vs classes <https://typelevel.org/blog/2017/02/13/more-types-than-classes.html>

terminology: type parameter

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In `class Box[A]`, `A` is a type parameter; in `Box[Int]`, `Int` is a type argument. Scala usually calls a parameterised type a generic type.
{{< /callout >}}


**types**

<https://book.realworldhaskell.org/read/types-and-functions.html> closer to the end

If a type contains type parameters, we say that it is a parameterised type, or a polymorphic type. If a function or value's type contains type parameters, we call it polymorphic.

## Moved to concept notes


Modeling with Option and ADTs moved to [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#a-flag-plus-an-optional-value).

Pushing impurity out of functions moved to [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#functional-core-imperative-shell).

Call-by-name and call-by-value moved to [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#call-by-name-in-scala).

Side effects ("a balanced attitude") moved to [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#side-effects).

Partially applied functions and closures moved to [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}).

Custom control structures (the loan pattern) moved to [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#custom-control-structures).

Copy-and-return style and persistent data structures moved to [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#immutability-and-functional-methods).

### PAFs


Moved to [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#currying-and-partial-application).

### Types


Moved to [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}); refined types are in [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}#scalas-terminology-trap).

### HKT and currying


Moved to [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#higher-kinded-types) and [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#currying-and-partial-application).

### Lazy evaluation and call-by-name


Moved to [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}).

### Functional Combinators


Moved to [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#functional-combinators).

### Options


Moved to [Monads]({{< ref "functional-programming/monads" >}}#option).

## Sources


<https://blog.rockthejvm.com/>

courses:

<https://coursehunter.net/course/scala-3-i-osnovy-funkcionalnogo-programmirovaniya>

<https://coursehunter.net/course/prodvinutyy-scala-3-i-funkcionalnoe-programmirovanie>

**software list**

<https://github.com/lauris/awesome-scala>

<https://index.scala-lang.org/awesome>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
index.scala-lang.org is Scaladex, the official index of Scala libraries; it and awesome-scala are the two places to look for a library by topic.
{{< /callout >}}


<https://github.com/twitter/util>

<https://github.com/twitter/iago2>

companies and communities:

<https://users.scala-lang.org/>

<https://www.reddit.com/r/scala/>

<https://www.tinkoff.ru/career/it/interview/scala/>

softwaremill

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
SoftwareMill is a Scala consultancy that maintains Tapir, sttp and other open-source Scala libraries.
{{< /callout >}}


rocketjvm site

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Rock the JVM, Daniel Ciocîrlan's site: the blog and YouTube links in this section belong to it.
{{< /callout >}}


<https://www.youtube.com/@rockthejvm>

<https://www.signifytechnology.com/>

<https://coursehunter.net/course/scala-applied-chast-1>

<https://coursehunter.net/course/scala-applied-chast-2>

<https://coursehunter.net/course/scala-applied-chast-3>

<https://twitter.github.io/scala_school/index.html>

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Twitter's Scala School was written for early Scala 2 and hasn't been updated, so its syntax and library advice are dated.
{{< /callout >}}


<https://www.baeldung.com/scala/functional-programming-series>

**Scala & Functional Programming for Beginners | Rock the JVM**

<https://github.com/rockthejvm/udemy-scala-beginners>

<https://index.scala-lang.org/search?q=*&topics=akka>

<https://twitter.com/philip_schwarz?lang=en>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Philip Schwarz publishes slide decks on functional programming in Scala; four of them are in the library (see below).
{{< /callout >}}


Functional Structures in Scala

<https://www.youtube.com/playlist?list=PLFrwDVdSrYE6dy14XCmUtRAJuhCxuzJp0>

## Community


Scala community:

Adam Warski (softwaremill)

Marcin Baraniecki

See also: [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}) for the type system, [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}), [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}), [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#call-by-name-in-scala), [Monads]({{< ref "functional-programming/monads" >}}), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}) and [Haskell]({{< ref "functional-programming/haskell" >}}). Also [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) for tagless final, [Streams]({{< ref "functional-programming/streams" >}}) for fs2, [Concurrency]({{< ref "functional-programming/concurrency" >}}) for fibers, and [Error Handling]({{< ref "functional-programming/error-handling" >}}) for `Either`.

## Library sources


- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala (5th edition)*: source of most quoted passages (class parameters, singleton objects, string interpolation, traits, thin and rich interfaces, abstract members, variance and lower bounds).
- [Wampler 2021](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), *Programming Scala (3rd edition)*: the Scala 2 to Scala 3 changes behind several critiques (givens and `using`, extension methods, `export`, optional braces).
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: state encapsulation with `Ref` and smart constructors, newtypes and refinement types.
- [Suereth 2012](/sources/programming/scala/suereth-2012-scala-in-depth.pdf.enc), *Scala in Depth*: Scala 2 implicits and implicit resolution, for the Implicits section; dated (Scala 2.9).
- Płachta 2022, *Grokking Functional Programming*: the book behind "grokking scala notes"; chapters 5 and 6 are the source of the passages under Comprehensions, and chapters 8 to 10 cover `IO`, streams and concurrency with Cats Effect and fs2.
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*: the "functional reactive modelling book" under Design, architecture and talks; chapter 2 (Scala for functional domain models: ADTs, modules), chapter 3 (algebraic API design, smart constructors) and chapter 5 (modularization).
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*: the ZIO book: the `ZIO[R, E, A]` type and its error channel (chapters 1 and 3), fibers (chapters 5 to 8), dependency injection with `ZLayer` (chapters 17 and 18) and ZStream (chapters 27 to 33); on the ZIO lines under Ecosystem and libraries and on Dependency Injection.

Further reading:

- [Alexander 2021](/sources/programming/scala/alexander-2021-scala-cookbook-2e.pdf.enc), *Scala Cookbook (2nd edition)*
- [Sfregola 2021](/sources/programming/scala/sfregola-2021-get-programming-with-scala.pdf.enc), *Get Programming with Scala*
- [Li 2020](/sources/programming/scala/li-2020-hands-on-scala-programming.pdf.enc), *Hands-on Scala Programming*
- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*
- [Schwarz 2020](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc), *Scala 3 by Example: ADTs for DDD, Part 1*
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture*
