---
draft: false
toc: true
title: "Scala Language Notes and Resources"
aliases:
  - "/functional-programming/scala/"
description: "Scala language notes from expressions, classes, traits and variance to comprehensions, collections and implicits with their Scala 3 equivalents, plus the functional ecosystem, dependency injection, and books, talks and other resources."
weight: "20"
linkTitle: "Scala"
---

A reference note on Scala as a language for functional programming: the library ecosystems, the core language (expressions, classes and objects, operators, comprehensions, collections, traits, variance, implicits) and where to learn and practise. Examples are Scala 3 unless they say otherwise; Scala 2 forms are given where they differ.

## Ecosystem and libraries

### The functional ecosystems


Scala has two main ecosystems for purely functional programming, and a codebase usually picks one:

- **Typelevel**: Cats (type classes such as `Functor`, `Monad` and `Traverse`), Cats Effect (the `IO` runtime with fibers and resources), fs2 (functional streams built on Cats Effect) and http4s (HTTP), plus related libraries such as circe (JSON) and doobie (JDBC).
- **ZIO**: a separate ecosystem, not part of Typelevel, with its own effect type `ZIO[R, E, A]`, streams, HTTP library and dependency injection (`ZLayer`). The `zio-interop-cats` module lets the two interoperate. De Goes et al. 2025 (*Zionomicon*) is the reference book.

Outside them are Akka or Pekko with Play, the libraries of Li Haoyi (os-lib, requests, upickle, Mill), and plain "direct style" Scala with the standard library.

Two common confusions, both found in job descriptions such as "Framework: ZIO, Cats (any other Scala framework also works)":

- Cats is a library of type classes, not a framework, and it has no runtime. The counterpart of ZIO is Cats Effect. Such a line usually means "experience with a purely functional effect system".
- "Cats IO" means the `IO` type from Cats Effect. Cats itself has no `IO`.

### Effect libraries


The `IO` libraries are Cats Effect `IO`, ZIO and Monix. Monix provides `Task` (an effect type) and `Observable` (reactive streams). Its `Task` predates Cats Effect 3 and was one of the main effect types in the Cats Effect 2 era. Monix has not kept pace since Cats Effect 3 appeared, so new code usually chooses Cats Effect `IO` or ZIO; check the project's current status before adopting it. See [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}).

- Ziverge, "ZIO in 2025": <https://www.ziverge.com/post/zio-in-2025>

### Other common libraries


- **Tapir** describes HTTP endpoints as typed values and turns them into servers, clients and OpenAPI docs.
- **sttp** is an HTTP client library. Tapir and sttp both come from SoftwareMill.
- **fs2** is the Typelevel streaming library (see [Streams]({{< ref "functional-programming/03-building-programs/streams" >}})).
- **Akka** is Lightbend's actor toolkit. It is not an effect-system library, and since September 2022 (Akka 2.7) it is under the Business Source License rather than Apache 2.0. Apache Pekko is the Apache-licensed fork of Akka 2.6 that most open-source projects moved to.

Concurrency utilities usually come from the effect library itself (fibers, `Ref`, `Deferred`, queues); see [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}).

## Expressions, blocks and methods


Instructions are executed (think Java); expressions are evaluated (think Scala). In Scala, `if`, `match`, `try` and blocks all produce values, so you write

```scala
val sign = if x < 0 then -1 else 1
```


instead of assigning a variable inside each branch. The contrast between statements and expressions is a matter of degree: Java has expressions too, and since Java 14 even `switch` can be one. Scala still has constructs run only for their effect: an assignment `x = 1` and a `while` loop are expressions of type `Unit`, which carries no information.

A block is an expression, which is why it can stand on the right of `=`. Its value is the value of its last expression, it has its own scope, and it can define local values and methods:

```scala
val area = {
  val r = 2.0
  def square(x: Double) = x * x
  math.Pi * square(r)
}
```


`r` and `square` are visible only inside the braces. Strictly, a `def` inside a block defines a local method, not a function value. In Scala 3 the braces can be replaced by indentation.

### Methods and `return`


> The recommended style for methods is in fact to avoid having explicit, and especially multiple, return statements. Instead, think of each method as an expression that yields one value, which is returned. This philosophy will encourage you to make methods quite small, to factor larger methods into multiple smaller ones.
>
> *Programming in Scala*

There is also a technical reason to avoid `return`. Inside a lambda, `return` exits the enclosing method, not the lambda, and is implemented by throwing an exception. Scala 3.2 deprecated these non-local returns, and Scala 3.3 added `scala.util.boundary` and `break` as the explicit replacement.

### `val` over `var`


Use `val`, not `var`, as a default. *Programming in Scala* itself argues for a balanced attitude: a local `var` inside a method that is pure from the outside is sometimes the clearest code. See [Side effects]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#side-effects).

## Classes and objects

### Class parameters and fields


> In Java, classes have constructors, which can take parameters; whereas in Scala, classes can take parameters directly. The Scala notation is more concise -- class parameters can be used directly in the body of the class; there's no need to define fields and write assignments that copy constructor parameters into fields. This can yield substantial savings in boilerplate code, especially for small classes.
>
> *Programming in Scala*

A plain class parameter is not a public member. Adding `val` makes it a public read-only field, `var` a public mutable one:

```scala
class Person(name: String, val age: Int = 10)
```


If a plain parameter is used only in the constructor, no field is generated. If a method uses it, the compiler stores it in a private field that belongs to that instance only. The two books put it this way:

> When neither val nor var are specified on constructor parameters, the visibility of the field becomes very restricted, and Scala doesn't generate accessor or mutator methods
>
> *Scala Cookbook*

> Although class parameters `n` and `d` are in scope in the code of your add method, you can only access their value on the object on which `add` was invoked.
>
> *Programming in Scala*

So you have no access to plain class parameters from outside the object, not even from another instance of the same class.

In a case class every parameter is a `val` by default. A case class also gets structural `equals` and `hashCode`, a readable `toString`, a `copy` method, and a companion object with `apply` (construction without `new`) and `unapply` (pattern matching).

### Members and access


The class body is written in `{}`, or in Scala 3 after `class Person(name: String):` as an indented block. `val` and `var` definitions in the body are fields, `def`s are methods, and a `lazy val` is a field initialised on first access.

> Inside a class definition, you place fields and methods, which are collectively called *members*. [...] Fields are also known as *instance variables*, because every instance gets its own set of the variables. Collectively, an object's instance variables make up the memory image of the object.
>
> *Programming in Scala*

Public is Scala's default access level. There is no `public` keyword; to restrict access you write `private`, `protected`, or a qualified form such as `private[mypackage]`.

### Parameterization


> When you instantiate an object in Scala, you can *parameterize* it with values and types. Parameterization means "configuring" an instance when you create it. You parameterize an instance with values by passing objects to a constructor in parentheses.
>
> *Programming in Scala*

Arrays can be parameterised with types: `new Array[String](3)` is parameterised with the type `String` and the value `3`. Type parameters go in square brackets, value arguments in parentheses.

### Singleton and companion objects


An `object` defines a dedicated singleton: a type with exactly one instance, created lazily.

> Each singleton object is implemented as an instance of a *synthetic class* referenced from a static variable, so they have the same initialization semantics as Java statics. In particular, a singleton object is initialized the first time some code accesses it.
>
> *Programming in Scala*

A companion object is an `object` with the same name as a class, defined in the same file. The class and its companion can access each other's private members. Factory methods, constants and type-class instances usually live there.

Scala has no class-level (`static`) members. Their role is taken by the companion object, and for Java interop the compiler adds static forwarder methods to the class for the methods of its companion.

`apply` in an object acts as a factory: `Person("Ann")` is shorthand for `Person.apply("Ann")`. Scala 3 adds such a call for every class ("creator applications"), so `new` can be omitted even without a hand-written `apply`.

### Anonymous classes and function objects


An anonymous class extends a trait or class and implements its abstract members on the spot:

```scala
val r = new Runnable { def run() = println("hi") }
```


Implementing `Function1` this way shows what a function value is, an object with an `apply` method:

```scala
val incrementer = new Function1[Int, Int] {
  override def apply(x: Int) = x + 1
}
val two = incrementer(1)
```


The anonymous *function* is the literal `val incrementer = (x: Int) => x + 1`. Since Scala 2.12, function literals compile to JVM lambdas (`invokedynamic`) rather than one class per literal.

Single abstract method (SAM) conversion: since Scala 2.12, a function literal can be used wherever a trait or abstract class with a single abstract method is expected, and the compiler converts it, as in `val r: Runnable = () => println("hi")`. This is how Scala code passes lambdas to Java APIs.

### Repeated parameters

```scala
def echo(args: String*) =
  for arg <- args do println(arg)

val seq = List("one", "2")
echo(seq*)
```


Inside `echo`, `args` is a `Seq[String]`. `seq*` passes the elements of an existing sequence as separate arguments. Scala 2 writes `for (arg <- args) println(arg)` and `echo(seq: _*)`.

## Operators and method syntax


All operators are methods, at the language level: `1 + 2` is `1.+(2)`. The compiler still emits a primitive JVM addition for `Int`. `&&` and `||` are methods whose second parameter is by-name, which is how they short-circuit. `=` is not an operator method, and `==` is a final method on `Any` that handles `null` before calling `equals`.

- **Infix (operator) notation** is syntactic sugar: `s indexOf 'o'` means `s.indexOf('o')`. Scala 3 restricts it for alphanumeric names: such a method is meant to be called infix only if it is declared with the `infix` modifier, and the compiler warns otherwise under newer source levels. Symbolic methods such as `+` or `::` are unaffected. `s.indexOf('o')` is the normal style.
- **Postfix notation**, as in `println(mary isAlive)`, works only for methods without parameters. It is a feature flag that needs `import scala.language.postfixOps`; without it you get a feature warning or, in newer versions, an error. The style guides advise against it because it confuses semicolon inference. Write `mary.isAlive`.
- **Right-associative methods**: a method whose name ends in `:` is called on its right operand. `1 :: Nil` means `Nil.::(1)`, and `x +: xs` means `xs.+:(x)`. That's why prepending reads left to right in code, and why `1 :: 2 :: Nil` groups to the right.
- **`apply`**: `x(args)` desugars to `x.apply(args)` for any value `x` whose type has an `apply` method, so `mary()` calls `mary.apply()`. That's why `xs(0)` indexes a `List`, `m(key)` looks up a `Map`, and calling a function value `f(1)` works.
- **`@targetName`** (Scala 3, `scala.annotation.targetName`) sets the name a method gets in the bytecode, so a symbolic operator has a readable name for Java callers and stack traces: `@targetName("append") def ++(other: Buf): Buf`. The argument must be a legal JVM name; `@targetName(".")` can only be a placeholder, since a dot is not a legal JVM method name.
- **Infix types**: a type constructor with two parameters can be written between its arguments. `type ×[A, B] = (A, B)` lets you write `Int × String`. Scala 3's `A & B` and `A | B` are built-in infix types.

### `apply` and `unapply`


`apply` builds a value, `unapply` takes one apart for pattern matching. An object with only `unapply` is an extractor:

```scala
object Even:
  def unapply(n: Int): Option[Int] = if n % 2 == 0 then Some(n / 2) else None

10 match
  case Even(half) => s"twice $half"
  case _          => "odd"
```


Case classes generate both in their companion object.

## Comprehensions


A `for` with `yield` builds a result from each step:

```scala
val nums = List(1, 2, 3)
val doubled = for n <- nums yield n * 2   // List(2, 4, 6)

def scalaFiles =
  for
    file <- filesHere
    if file.getName.endsWith(".scala")
  yield file
```


A common picture of how this works:

> It's like the for loop has a buffer you can't see, and for each iteration of your for loop another item is added to that buffer. When your for loop finishes running, it will return this collection of all the yielded values. The type of the collection that is returned is the same type that you were iterating over

The buffer is a useful picture for collections, but no loop or buffer is involved. `for ... yield` is syntactic sugar for chains of `map`, `flatMap` and `withFilter` calls, which is why it also works for `Option`, `Either`, `Future` and `IO`, where nothing is iterated. The result type is decided by the first generator's `flatMap` or `map`, and isn't always the same as the input: `for c <- "abc" yield c.toUpper` gives a `String`, but yielding something other than a pair from a `Map` gives an `Iterable`.

*Programming in Scala* (5th edition, section 7.3 "For expressions") covers iterating over collections, filters, nested generators, mid-stream variable bindings and `yield`.

### Desugaring

```scala
for { x <- xs; if x > 0; y <- ys } yield x * y
// is rewritten to
xs.withFilter(x => x > 0).flatMap(x => ys.map(y => x * y))
```


Every generator except the last becomes a `flatMap`, the last becomes a `map`, and each `if` a `withFilter`. A `for` without `yield` becomes `foreach`. More on this in [map and flatMap]({{< ref "functional-programming/02-abstractions/map-flatmap" >}}) and [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}).

### Generators as filters, and mixing types


This example is from chapter 5 of *Grokking Functional Programming*. `validateRadius` returns `List(r)` for a valid radius and `List.empty` otherwise, so a generator over it acts as a filter. `insideFilter` works the same way for points:

```scala
for
  r           <- riskyRadiuses
  validRadius <- validateRadius(r)
  point       <- points
  inPoint     <- insideFilter(point, validRadius)
yield s"$inPoint is within a radius of $r"
// == List("Point(1,1) is within a radius of 2")
```


Every generator here is a `List`; the book's example of mixing types puts a `List` and a `Set` in one comprehension. The book says the compiler "casts" the second collection, which is not what happens. `List.flatMap` accepts any function returning an `IterableOnce`, so a `Set` (or an `Option`) can supply elements to it. The reverse fails: `Option.flatMap` needs a function returning an `Option`, so a `List` inside an `Option` comprehension doesn't compile, and neither does mixing `Option` with `Future` or `Either`. That gap is what monad transformers and effect types address.

### Parsing as a pipeline


"Parsing as a pipeline" is the last section of chapter 5 of *Grokking Functional Programming*, which introduces `Option`. Chapter 6, Error handling, uses `toIntOption` and says:

> We will use function composition to our advantage not only in advanced error handling but also in side-effectful programming, multithreading, and testing later in the book!

`"1985".toIntOption` is `Some(1985)` and `"MCMLXXXV".toIntOption` is `None` (Scala 2.13 and later), so parsing never throws. Each step returns an `Option`, and the steps are chained:

```scala
case class Event(name: String, start: Int, end: Int)

def parseEvent(name: String, startStr: String, endStr: String): Option[Event] =
  for
    n     <- Option(name).filter(_.nonEmpty)
    start <- startStr.toIntOption
    end   <- endStr.toIntOption.filter(_ < 3000)
    if start <= end
  yield Event(n, start, end)
```


`Option` says that parsing failed but not why. When the caller needs the reason, use `Either[String, A]` (for example `toIntOption.toRight("not a number")`), which composes the same way. See [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}).

## Functional collections

### Collections are functions


- `Set[A]` extends `A => Boolean`, so `Set(1, 2)(1)` is `true` and a set can be passed directly to `filter`: `xs.filter(allowed)`. This is also the usual explanation for why `Set` is invariant in `A` while `List` is covariant: a function is contravariant in its argument type, so `Set[A]` can't be covariant (see [Variances](#variances)).
- `Seq[A]` extends `PartialFunction[Int, A]`: `xs.isDefinedAt(i)` checks the index, `xs(i)` throws outside the range, and `xs.lift(i)` returns an `Option[A]`.
- `Map[K, V]` is a `PartialFunction[K, V]` in the same way.

### Rich wrappers


> For each basic type described in this chapter, there is also a "rich wrapper" that provides several additional methods. These methods are available by implicit conversions
>
> *Programming in Scala*, chapter on basic types and operations

`1 to 5`, `3.max(5)` and `(-2).abs` come from `RichInt`, and `"abc".capitalize` from `StringOps`, through implicit conversions defined in `Predef`.

A nested `filter`/`flatMap`/`map` chain such as

```scala
val combinations = numbers.filter(_ % 2 == 0)
  .flatMap(n => chars.flatMap(c => colors.map(color => "" + c + n + "-" + color)))
println(combinations)
```


reads better as a comprehension:

```scala
val combinations = for
  n     <- numbers if n % 2 == 0
  c     <- chars
  color <- colors
yield "" + c + n + "-" + color
```

### Maps


> You can control the properties of the maps you use in your program in a more fine-grained way - you could specify a particular implementation, or provide a default value for the map, or you could override any other method of the map you create.
>
> *Programming in Scala*, on associative maps

For example, `TreeMap` keeps keys sorted, `mutable.LinkedHashMap` keeps insertion order, and `Map("a" -> 1).withDefaultValue(0)` returns `0` for missing keys instead of throwing. Overriding methods means subclassing a collection class, which is rarely done in practice; wrapping the map or using `withDefault` covers most needs.

## Traits


> Traits have two main uses: They allow you to define classes through mixin composition, and they define types.
>
> *Programming in Scala*

**As mixins.** A trait meant mainly as a mixin, not as a type, can be declared `transparent` (Scala 3), so its name doesn't appear in inferred types. Without it, `val x = if c then Cat() else Dog()` might be inferred as `Animal & Loggable` when `Loggable` is a helper mixin you never meant as a type; with `transparent trait Loggable` the compiler infers `Animal`. Scala 3 treats some standard traits such as `Product` and `Serializable` this way automatically.

**As interfaces.** In the most basic use a trait defines only abstract members that extending classes must implement:

> Traits can be used to define granular units of behavior, and then those granular units can be combined to build larger components. [...] in their most basic use, they can be used like a pre-Java 8 interface, where the primary reason you use them is to declare the signatures for abstract methods that extending classes must implement.
>
> *Scala Cookbook*

The interface use is only the start. Unlike Java interfaces, even after Java 8, traits can hold state (`val` and `var` fields), and in Scala 3 they can take parameters (`trait Greeting(val name: String)`).

### Stackable traits


In the stackable trait pattern each trait overrides a method, does its own work and calls `super`, and the mix-in order decides the order of the calls. *Programming in Scala* (section 11.3, "Traits as stackable modifications") uses a queue:

```scala
import scala.collection.mutable.ArrayBuffer

abstract class IntQueue:
  def get(): Int
  def put(x: Int): Unit

class BasicIntQueue extends IntQueue:
  private val buf = ArrayBuffer.empty[Int]
  def get(): Int = buf.remove(0)
  def put(x: Int): Unit = buf += x

trait Doubling extends IntQueue:
  abstract override def put(x: Int): Unit = super.put(2 * x)

trait Incrementing extends IntQueue:
  abstract override def put(x: Int): Unit = super.put(x + 1)

val q = new BasicIntQueue with Incrementing with Doubling
q.put(10) // Doubling runs first, then Incrementing: stores 21
```


`abstract override` says the method calls `super` on a method that must be provided concretely by whatever the trait is mixed into. It works because `super` in a trait is resolved late, as the next section explains.

### super calls in traits


> The key difference between classes and traits is that whereas in classes, super calls are statically bound, in traits, they are dynamically bound. If you write "super.toString" in a class, you know exactly which method implementation will be invoked. When you write the same thing in a trait, however, the method implementation to invoke for the super call is undefined when you define the trait. Rather, the implementation to invoke will be determined anew each time the trait is mixed into a concrete class.
>
> *Programming in Scala*

The rule that fixes the order is *linearization*: the compiler puts the class and all its traits in a single line, roughly right to left in the `extends ... with ...` clause, and `super` means the next element in that line. "Dynamically" here means "per concrete class, at compile time", not at run time.

### Thin vs rich interfaces


> Adding a concrete method to a trait tilts the thin-rich trade-off heavily towards rich interfaces, because it is a one-time effort. You only need to implement the concrete method once, in the trait itself, instead of needing to reimplement it for every class that mixes in the trait. Thus, rich interfaces are less work to provide in Scala than in a language without traits.
>
> To enrich an interface using traits, simply define a trait with a small number of abstract methods -- the thin part of the trait's interface -- and a potentially large number of concrete methods, all implemented in terms of the abstract methods. Then you can mix the enrichment trait into a class, implement the thin portion of the interface, and end up with a class that has all of the rich interface available.
>
> A good example of a domain where a rich interface is convenient is comparison.
>
> *Programming in Scala*

The book's comparison example is Scala's `Ordered[A]` trait, the counterpart of Java's `Comparable`: implement the one abstract method `compare`, and you get `<`, `>`, `<=` and `>=`:

```scala
case class Version(major: Int, minor: Int) extends Ordered[Version]:
  def compare(that: Version) =
    if major != that.major then major - that.major else minor - that.minor
```


Idiomatic Scala now usually prefers the `Ordering[A]` type class to inheriting `Ordered[A]`: an ordering can be defined for types you don't own, and there can be more than one. Type classes with extension methods are the other way to get a rich interface from a thin one; see [Type classes]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#type-classes).

### Self-types


A self-type is a way of declaring the dependencies of a trait. `self: B =>` says the trait can only be mixed into something that is also a `B`, which lets the trait's body use `B`'s members without the trait itself extending `B`. The compiler enforces that the dependency is provided when a concrete class is built.

```scala
case class User(name: String)

trait UserRepo:
  def find(id: Long): Option[User]

trait UserService:
  self: UserRepo =>
  def nameOf(id: Long): Option[String] = find(id).map(_.name)

object App extends UserService with UserRepo:
  def find(id: Long): Option[User] = ???
```


Unlike `extends`, `UserService` doesn't become a subtype of `UserRepo`. Self-types are the basis of the "cake pattern" for dependency injection, which most Scala teams have since abandoned as heavy and hard to follow. Constructor parameters do the same job more plainly (see [Dependency injection](#dependency-injection)).

- Yadu Krishnan, "Self type in Scala": <https://yadukrishnan.live/self-type-in-scala>
- Rock the JVM, self-types: <https://blog.rockthejvm.com/self-types/>

## Abstract members


> A member of a class or trait is abstract if the member does not have a complete definition in the class. Abstract members are intended to be implemented in subclasses of the class in which they are declared. [...] But Scala goes beyond that and implements the idea in its full generality: Besides methods, you can declare abstract fields and even abstract types as members of classes and traits.
>
> *Programming in Scala*

All four kinds in one trait:

```scala
trait Abstract:
  type T
  def transform(x: T): T
  val initial: T
  var current: T
```


A subclass fixes them with `type T = String`, a `def`, a `val` and a `var`. Abstract types are covered in [Abstract types and type members]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#abstract-types-and-type-members).

## Variances


Variance links functions, parameters, errors and collections through one rule: a type parameter used only in outputs can be covariant (`+`), one used only in inputs can be contravariant (`-`).

- Functions are `Function1[-A, +B]`: a function that accepts any `Animal` can stand in where one accepting `Cat` is expected, and one returning `Cat` where one returning `Animal` is expected.
- Immutable collections are covariant (`List[+A]`), mutable ones invariant.
- Error types are usually covariant: `Either[+E, +A]`. ZIO's `ZIO[-R, +E, +A]` is also contravariant in its environment `R`.

In *Programming in Scala* (5th edition), chapter 18 "Type Parameterization" has 18.3 Variance annotations, 18.4 Checking variance annotations, 18.5 Lower bounds and 18.6 Contravariance; 18.6 is where the Liskov Substitution Principle comes in.

### The Box example


The Tour of Scala's Variances page explains invariance with a mutable box:

```scala
class Animal
case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal

class Box[A](var content: A)

val catBox: Box[Cat] = Box[Cat](Cat("Felix"))
val animalBox: Box[Animal] = catBox // does not compile...
animalBox.content = Dog("Fido")      // ...because this would put a Dog in catBox
```


> From this, we have to conclude that `Box[Cat]` and `Box[Animal]` can't have a subtyping relationship, even though Cat and Animal do.
>
> Tour of Scala, Variances

In other words: because we could put a `Dog` in an animal box, a cat box can't be an animal box. Making the field a `val` and the class `ImmutableBox[+A]` removes the problem.

### Covariance


> We say that ImmutableBox is covariant in `A`, and this is indicated by the `+` before the `A`.
>
> More formally, that gives us the following relationship: given some `class Cov[+T]`, then if `A` is a subtype of `B`, `Cov[A]` is a subtype of `Cov[B]`. This allows us to make very useful and intuitive subtyping relationships using generics.
>
> Tour of Scala, Variances

The Tour sums this up as: covariance is achieved by making sure we can't put something into the covariant type, only get something out. The compiler's actual rule is about positions, not about putting things in: a covariant type parameter may not appear as a method parameter type or as the type of a `var`. A method can still accept new elements if it introduces a lower-bounded type parameter, as in the next section.

### Lower bounds


> variance annotations and lower bounds play well together. They are a good example of type-driven design, where the types of an interface guide its detailed design and implementation.
>
> *Programming in Scala*, section 18.5

The book's example is a covariant queue. `def enqueue(x: T)` is rejected in `Queue[+T]` because `T` would appear in an input position. A lower bound fixes it:

```scala
class Queue[+T]:
  def enqueue[U >: T](x: U): Queue[U] = ???
```


Adding an `Orange` to a `Queue[Apple]` gives a `Queue[Fruit]`. `List`'s `::` and `prepended` use the same trick.

### Immutability and variance


> Immutability constitutes an important part of the design decision behind using variance. For example, Scala's collections systematically distinguish between [mutable and immutable collections](https://docs.scala-lang.org/overviews/collections-2.13/overview.html). The main issue is that a covariant mutable collection can break type safety. This is why `List` is a covariant collection, while `scala.collection.mutable.ListBuffer` is an invariant collection.
>
> Tour of Scala, Variances

Java shows the danger: its arrays are covariant, so `Object[] objs = new String[1]; objs[0] = 1;` compiles and fails at run time with `ArrayStoreException`. Scala's `Array[A]` is invariant, so the equivalent doesn't compile.

## String interpolators


> In Scala, string interpolation is implemented by rewriting code at compile time. The compiler will treat any expression consisting of an identifier followed immediately by the open double quote of a string literal as a string interpolator expression. The s, f, and raw string interpolators are implemented via this general mechanism. Libraries and users can define other string interpolators for other purposes.
>
> *Programming in Scala*

The rewrite turns `s"Hello, $name!"` into `StringContext("Hello, ", "!").s(name)`: the literal parts go to `StringContext`, and the spliced expressions become arguments of a method named after the prefix. Only this rewriting is guaranteed to happen at compile time; semantically `s` and `raw` are ordinary methods, though the compiler may optimise such calls into plain concatenation. `f` is different: the compiler checks its format string, so a mismatch such as `f"$name%d"` with a `String` is a compile error.

### Custom interpolators


A custom interpolator is just a method added to `StringContext`:

```scala
extension (sc: StringContext)
  def shout(args: Any*): String = sc.s(args*).toUpperCase

val name = "Ann"
shout"hello $name" // "HELLO ANN"
```


In Scala 2 the same is an `implicit class` wrapping `StringContext`, with `sc.s(args: _*)`.

- Rock the JVM, how to create your own string interpolator: <https://blog.rockthejvm.com/how-to-create-your-own-string-interpolator/>

## Encapsulation


> Private constructors and private members are one way to hide the initialization and representation of a class. Another more radical way is to hide the class itself and only export a trait that reveals the public interface of the class.
>
> *Programming in Scala*

### State encapsulation


> Notice how we made the interpreter's constructor private. This has a fundamental reason: state shall not leak. If we were to make this constructor public, our Ref could be used in places where we have no control.
>
> *Practical FP in Scala* (Volpe; probably the 1st edition, since the 2nd edition words it differently)

The constructor that creates the `Ref` is the only code that ever sees it:

```scala
import cats.effect.{IO, Ref}

trait Counter:
  def incr: IO[Unit]
  def get: IO[Int]

object Counter:
  def make: IO[Counter] =
    Ref.of[IO, Int](0).map { ref =>
      new Counter:
        def incr = ref.update(_ + 1)
        def get  = ref.get
    }
```


Creating a `Ref` is itself an effect, so `make` returns `IO[Counter]`, and each run of `make` creates a new counter. See [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}).

### Exports


Scala 3 `export` clauses create forwarder methods to the members of another object, which gives the convenience of inheritance with composition:

```scala
class Printer { def print(s: String) = println(s) }
class Service(p: Printer):
  export p.print   // Service now has a print method that calls p.print
```

## Implicits


Scala 3 splits Scala 2's single `implicit` keyword by purpose:

| Scala 2 | Scala 3 |
| --- | --- |
| implicit parameters | `using` clauses |
| implicit values and instances | `given` instances |
| implicit classes | `extension` methods |
| implicit conversions | `given Conversion[A, B]` instances, discouraged with a feature warning |

Material written for Scala 2 maps onto these one by one.

- Li Haoyi, "Implicit design patterns in Scala": <https://www.lihaoyi.com/post/ImplicitDesignPatternsinScala.html>
- An implicit in use, boolean operators for `Option`s (Coderwall): <https://coderwall.com/p/6lwybw/boolean-operators-for-options>

### Implicit classes and extension methods


An implicit class adds methods to an existing type. With `implicit class ScenarioOps(scenario: BrickScenario)` in scope, `scenario.someOp` compiles by wrapping `scenario` in `ScenarioOps`. This is how Scala 2 writes extension methods. Scala 3 replaces it with `extension (scenario: BrickScenario) def someOp = ...`:

```scala
extension (s: String)
  def shout: String = s.toUpperCase + "!"

"hi".shout // "HI!"
```


Extension methods inside a `given` instance are how type classes expose their operations, as in the [The Monad type class](#the-monad-type-class) definition below.

### Conditional instances


An implicit conditional value is an instance that exists only if another one does. `implicit def listOrd[A](implicit ord: Ordering[A]): Ordering[List[A]]` gives an ordering for `List[A]` whenever there is one for `A`. In Scala 3: `given [A](using Ordering[A]): Ordering[List[A]] = ...`.

### Context functions


Scala 3 function types whose parameters are passed implicitly, written `A ?=> B`. `type Logged[T] = Logger ?=> T` lets `def work: Logged[Int] = ...` use `summon[Logger]` in its body, and callers supply the `Logger` with a `given`. They are useful for builder DSLs and for passing context such as transactions.

### Implicit conversions and autoboxing


These are two separate mechanisms. Autoboxing is done by the compiler: `Int` is compiled to a JVM `int` where possible and boxed into `java.lang.Integer` when used generically or as `Any`, with no implicit involved. Implicit conversions are user-visible: `Predef` defines some, such as `int2Integer` for Java interop and the conversions to [Rich wrappers](#rich-wrappers).

## Dependency injection


The main options in Scala, from plainest to most structured:

1. Pass dependencies as constructor parameters and wire them by hand in one place, optionally with the MacWire macros.
2. The cake pattern with self-types (see [Self-types](#self-types)).
3. The Reader monad (see [Reader]({{< ref "functional-programming/02-abstractions/monads" >}}#reader)) or context parameters (`using`).
4. The effect libraries' own mechanisms, such as ZIO's `ZLayer` or Cats Effect `Resource`s composed in `main`.
- Dependency injection in Scala, a guide: <http://di-in-scala.github.io/>

## Types


- **Type parameters and arguments.** In `class Box[A]`, `A` is a type parameter; in `Box[Int]`, `Int` is a type argument. Scala usually calls a parameterised type a generic type. Haskell's terminology:

  > If a type contains type parameters, we say that it is a parameterised type, or a polymorphic type. If a function or value's type contains type parameters, we call it polymorphic.
  >
  > *Real World Haskell*, "Types and functions" (near the end): <https://book.realworldhaskell.org/read/types-and-functions.html>

- **Type constructors and higher-kinded types.** `List` is a type constructor: given a type `Int` it produces the type `List[Int]`. A higher-kinded type abstracts over type constructors, as in `trait Functor[F[_]]`. See [Higher-kinded types]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#higher-kinded-types).
- **Structural subtyping and path-dependent types**: see [Nominal and structural subtyping]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#nominal-and-structural-subtyping) and [Path-dependent types]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#path-dependent-types). The rest of the type system is in [Scala type system]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}).
- **Newtypes and refinement types**: value classes and opaque types are in [Primitive obsession and the newtype pattern]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}#primitive-obsession-and-the-newtype-pattern); refinement types and Iron in [Scala's terminology trap]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types-by-language" >}}#scalas-terminology-trap).

Links on types:

- Stack Overflow, "What is type and what is type constructor in Scala": <https://stackoverflow.com/questions/45300288/what-is-type-and-what-is-type-constructor-in-scala>
- Rock the JVM, Scala types and kinds: <https://blog.rockthejvm.com/scala-types-kinds/>
- Typelevel blog, "More types than classes" (types vs classes): <https://typelevel.org/blog/2017/02/13/more-types-than-classes.html>

## Functions and functional abstractions

### Eta-expansion


Eta-expansion turns a method into a function value: given `def inc(x: Int) = x + 1`, `List(1, 2).map(inc)` passes `x => inc(x)`. Scala 2 does this automatically only where a function type is expected and otherwise needs `inc _`; Scala 3 does it for any method with parameters, so `val f = inc` works.

### Currying, partial application and partial functions


Partial functions are a different thing from partial application. A partially applied function fixes some arguments: `val add5 = add(5, _)`. A `PartialFunction[A, B]` is defined only for some inputs, is written as a `{ case ... }` literal, and is what `collect` takes. Currying and partial application are in [Currying and partial application]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#currying-and-partial-application).

- Alvin Alexander, *Functional Programming, Simplified*, how to write functions with multiple parameter groups: <https://alvinalexander.com/scala/fp-book/how-to-write-functions-multiple-parameter-groups/>

### Call-by-name


See [Call-by-name in Scala]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#call-by-name-in-scala).

### Referential transparency and side effects


An expression is referentially transparent if replacing it with its value never changes the program's behaviour. See [Referential transparency]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#referential-transparency) for this and for variables and side effects in functional programming.

### The Monad type class


In Scala 3, the usual encoding of `Monad` is a type class over a type constructor `F[_]`:

```scala
trait Monad[F[_]]:
  def pure[A](a: A): F[A]
  extension [A](fa: F[A])
    def flatMap[B](f: A => F[B]): F[B]
    def map[B](f: A => B): F[B] = fa.flatMap(a => pure(f(a)))
```


An instance must satisfy three laws:

- left identity: `pure(a).flatMap(f) == f(a)`;
- right identity: `fa.flatMap(pure) == fa`;
- associativity: `fa.flatMap(f).flatMap(g) == fa.flatMap(a => f(a).flatMap(g))`.

In Scala 2 the extension block becomes a plain method `def flatMap[A, B](fa: F[A])(f: A => F[B]): F[B]`. Cats defines `Monad` in this way. See [Why monads]({{< ref "functional-programming/02-abstractions/monads" >}}#why-monads).

### Topics in the concept notes


Scala material on these topics lives in the concept notes:

- Modelling with `Option` and ADTs: [A flag plus an optional value]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}}#a-flag-plus-an-optional-value)
- Pushing impurity out of functions: [Functional core, imperative shell]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#functional-core-imperative-shell)
- Copy-and-return style and persistent data structures: [Immutability and functional methods]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#immutability-and-functional-methods)
- Partially applied functions and closures: [Lambdas, closures and scope]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#lambdas-closures-and-scope) and [Currying and partial application]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#currying-and-partial-application)
- Custom control structures (the loan pattern): [Custom control structures]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#custom-control-structures)
- Lazy evaluation and call-by-name: [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}})
- Functional combinators: [Functional combinators]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#functional-combinators)
- `Option`: [Option]({{< ref "functional-programming/02-abstractions/monads" >}}#option)

## Learning and practice

### Books


- *Grokking Functional Programming* (Płachta 2022) teaches functional programming in Scala 3; the comprehension and parsing passages above come from it (PDF).
- *Creative Scala*, a free book by Dave Gurnell and Noel Welsh, teaches Scala and functional programming through drawing pictures with the Doodle library. The same authors wrote *Scala with Cats* (see Library sources).
  - <https://www.creativescala.org/>
  - Its parser case study: <https://www.creativescala.org/case-study-parser/>
- Alvin Alexander's articles and books: the *Scala Cookbook* (in the library) and *Functional Programming, Simplified*, whose online version is the alvinalexander.com fp-book link above.

### Exercises and example code


- S-99, "Ninety-Nine Scala Problems", Phil Gold's Scala adaptation of the Prolog problem set P-99: list, arithmetic, logic, tree and graph exercises. The solutions on the site are written in old Scala 2 style. <https://aperiodic.net/phil/scala/s-99/>
- John De Goes, LambdaConf 2014 intro game: <https://github.com/jdegoes/lambdaconf-2014-introgame>
- absent1706/saga-framework: <https://github.com/absent1706/saga-framework>
- scala-pet-store, an example application: <https://github.com/pauljamescleary/scala-pet-store>

More exercises and project ideas are in [Exercises and projects]({{< ref "functional-programming/05-practice/exercises-and-projects" >}}).

### Articles and discussions


- John De Goes's articles: <https://degoes.net/articles/>
- Reddit r/haskell, "What about Scala 3?": <https://www.reddit.com/r/haskell/comments/wp4h72/what_about_scala_3/>
- Video for a guide to the most common Scala topics (see Open tasks): <https://www.youtube.com/watch?v=1uw1Qb1wrNk>

## Design, architecture and talks

### Vanilla Scala


- Functional World #9, "Breaking framework chains with vanilla Scala": <https://www.youtube.com/watch?v=U67BAeH3cxo>

### Design and modelling


The three docs.scala-lang.org links are chapters of the official Scala 3 Book and the shortest starting point for modelling with case classes, enums and ADTs in Scala 3. See also [Algebraic data types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}).

- Scala 3 Book, FP domain modelling: <https://docs.scala-lang.org/scala3/book/domain-modeling-fp.html>
- Scala 3 Book, ADTs and GADTs: <https://docs.scala-lang.org/scala3/book/types-adts-gadts.html>
- Scala 3 Book, domain modelling tools: <https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html>
- Thoughtworks, "Domain-driven design in functional programming": <https://www.thoughtworks.com/en-cn/insights/blog/architecture/domain-driven-design-in-functional-programming>
- Rock the JVM, algebraic data types: <https://blog.rockthejvm.com/algebraic-data-types/>
- BigPanda Engineering, "Refactoring to functional patterns in Scala": <https://medium.com/bigpanda-engineering/refactoring-to-functional-patterns-in-scala-bf81e7abfe77>
- InfoQ presentation, "Type Functional Design": <https://www.infoq.com/presentations/Type-Functional-Design/#.WgQgsvnDY9Q>
- SoftwareMill, "Principles of developing applications in Scala", on how to move a project to FP: <https://softwaremill.com/principles-of-developing-applications-in-scala/>
- *Functional and Reactive Domain Modeling* (Ghosh 2017) builds domain models in Scala with algebraic data types, type classes and reactive techniques: [PDF](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin).
- Videos listed with design and modelling, topics not checked:
  - <https://www.youtube.com/watch?v=2JB1_e5wZmU>
  - <https://www.youtube.com/watch?v=yan1YOXvAUM>
  - <https://www.youtube.com/watch?v=b3qUNnJYXb4>
  - <https://www.youtube.com/watch?v=6GA9cXgidBs>
  - <https://www.youtube.com/watch?v=WZBuelv_cxQ>
  - <https://www.youtube.com/watch?v=-qf8yteuxPs>

### Twitter's server stack


Twitter's server stack (Finagle, Finatra, twitter-server, util) is built on Twitter's own `com.twitter.util.Future`, not Scala's `Future` or an effect system. Check that it is still maintained before studying it as a model.

- twitter-server: <https://github.com/twitter/twitter-server>
- Finatra: <https://github.com/twitter/finatra>
- util: <https://github.com/twitter/util>
- iago2: <https://github.com/twitter/iago2>

## Sources

### Blogs, courses and tutorials


- Rock the JVM (Daniel Ciocîrlan), whose blog and YouTube channel are behind many links in this note:
  - Blog: <https://blog.rockthejvm.com/>
  - YouTube: <https://www.youtube.com/@rockthejvm>
  - "Scala & Functional Programming for Beginners" course code: <https://github.com/rockthejvm/udemy-scala-beginners>
- Courses on Coursehunter (Russian titles):
  - Scala 3 and the basics of functional programming: <https://coursehunter.net/course/scala-3-i-osnovy-funkcionalnogo-programmirovaniya>
  - Advanced Scala 3 and functional programming: <https://coursehunter.net/course/prodvinutyy-scala-3-i-funkcionalnoe-programmirovanie>
  - Scala Applied, parts 1 to 3: <https://coursehunter.net/course/scala-applied-chast-1>, <https://coursehunter.net/course/scala-applied-chast-2>, <https://coursehunter.net/course/scala-applied-chast-3>
- Twitter's Scala School, written for early Scala 2 and not updated since, so its syntax and library advice are dated: <https://twitter.github.io/scala_school/index.html>
- Baeldung, functional programming series in Scala: <https://www.baeldung.com/scala/functional-programming-series>
- "Functional Structures in Scala", YouTube playlist: <https://www.youtube.com/playlist?list=PLFrwDVdSrYE6dy14XCmUtRAJuhCxuzJp0>
- Philip Schwarz, who publishes slide decks on functional programming in Scala (several are in the library): <https://twitter.com/philip_schwarz?lang=en>

### Finding libraries


Scaladex (index.scala-lang.org), the official index of Scala libraries, and awesome-scala are the two places to look for a library by topic.

- awesome-scala: <https://github.com/lauris/awesome-scala>
- Scaladex, awesome list: <https://index.scala-lang.org/awesome>
- Scaladex, libraries tagged akka: <https://index.scala-lang.org/search?q=*&topics=akka>

### Communities, companies and people


- Scala users forum: <https://users.scala-lang.org/>
- Reddit r/scala: <https://www.reddit.com/r/scala/>
- Tinkoff, Scala interview page: <https://www.tinkoff.ru/career/it/interview/scala/>
- Signify Technology: <https://www.signifytechnology.com/>
- SoftwareMill, a Scala consultancy that maintains Tapir, sttp and other open-source Scala libraries.
- People to follow: Adam Warski (SoftwareMill), Marcin Baraniecki.

## Open tasks


- [ ] Create a guide with examples on the most common Scala topics, using the video under Articles and discussions.
- [ ] Read John De Goes's articles.
- [ ] Read *Programming in Scala* section 18.5 (lower bounds) and section 18.6 (contravariance and the Liskov Substitution Principle) ([PDF](/sources/6d5d72f2cd796c67b467228f976d4a33.bin)).
- [ ] Work through the Box example on the Tour of Scala's Variances page.

See also: [Scala type system]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}) for the type system, [Type classes and polymorphism]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}), [Functions and composition]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}), [Call-by-name in Scala]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#call-by-name-in-scala), [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}), [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}) and [Haskell]({{< ref "functional-programming/04-languages/haskell" >}}). Also [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}) for tagless final, [Streams]({{< ref "functional-programming/03-building-programs/streams" >}}) for fs2, [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}) for fibers, and [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}) for `Either`.

## Library sources


- [Odersky et al. 2021](/sources/6d5d72f2cd796c67b467228f976d4a33.bin), *Programming in Scala (5th edition)*: source of most quoted passages (class parameters, singleton objects, string interpolation, traits, thin and rich interfaces, abstract members, variance and lower bounds).
- [Wampler 2021](/sources/15972064071d3223586f8945de281cea.bin), *Programming Scala (3rd edition)*: the Scala 2 to Scala 3 changes described in this note (givens and `using`, extension methods, `export`, optional braces).
- [Volpe 2021](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), *Practical FP in Scala (2nd edition)*: state encapsulation with `Ref` and smart constructors, newtypes and refinement types.
- [Suereth 2012](/sources/4e8d2d10ca6fd931719965959de39eac.bin), *Scala in Depth*: Scala 2 implicits and implicit resolution, for the Implicits section; dated (Scala 2.9).
- Płachta 2022, *Grokking Functional Programming*: chapters 5 and 6 are the source of the passages under Comprehensions, and chapters 8 to 10 cover `IO`, streams and concurrency with Cats Effect and fs2.
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling*: chapter 2 (Scala for functional domain models: ADTs, modules), chapter 3 (algebraic API design, smart constructors) and chapter 5 (modularization).
- [De Goes et al. 2025](/sources/4115845a430bc3f50ff12c191a45fd53.bin), *Zionomicon*: the ZIO book: the `ZIO[R, E, A]` type and its error channel (chapters 1 and 3), fibers (chapters 5 to 8), dependency injection with `ZLayer` (chapters 17 and 18) and ZStream (chapters 27 to 33); for the ZIO ecosystem and dependency injection.

Further reading:

- [Alexander 2021](/sources/852fbe203cb432c7ab553608147935d9.bin), *Scala Cookbook (2nd edition)*: source of the quoted passages on constructor parameters and on traits as interfaces.
- [Sfregola 2021](/sources/938932d9b4e4bd1177769b29018c5ff6.bin), *Get Programming with Scala*
- [Li 2020](/sources/a280251ad59e61862b88a946d18fae4c.bin), *Hands-on Scala Programming*
- [Welsh and Gurnell 2020](/sources/08cab18bbc8a17a6885874831fe8c431.bin), *Scala with Cats*
- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional*: chapter 9, "Injecting Dependencies": dependencies passed as function parameters and supplied once at the top level by partial application, the functional form of option 1; on *Dependency injection*.
- [Schwarz 2020](/sources/f1c14b872d21423c5ed67709396f62c6.bin), *Scala 3 by Example: ADTs for DDD, Part 1*
- [Volpe 2023](/sources/42ef10a33c54df6756cd49d40ee34101.bin), *Functional Event-Driven Architecture*
