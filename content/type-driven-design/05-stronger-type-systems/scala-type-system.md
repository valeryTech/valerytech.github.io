---
draft: false
toc: true
title: "Scala Type System"
description: "The Scala type features type-driven design relies on: abstract type members, nominal and structural subtyping, union and intersection types, path-dependent types, multiversal equality and contracts."
linkTitle: "Scala Type System"
---

The Scala features this section relies on. Variance, givens and extension methods are in [Scala]({{< ref "functional-programming/04-languages/scala" >}}#variances) and the rest of the Scala language note; type classes and higher-kinded types are in [Type Classes And Polymorphism]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}).

## Types for correctness


Moved from [Type Systems]({{< ref "type-driven-design/01-foundations/type-systems" >}}) on 2026-04-05.

**In Scala, we use types to ensure correctness,** and we do it by encoding code invariants in the types and relationships between types. **The compiler enforces those invariants,** guaranteeing our programs are free of certain error categories.

We pay the price for these guarantees; the compiler makes some programs a bit harder to write.

Odersky et al. ([PDF](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), section 17.4, "Avoiding a types monoculture") give the everyday version: a method like `title(text: String, anchor: String, style: String)` is *stringly typed*, since nothing stops a caller from swapping the arguments, and a few tiny value classes fix it. Domain modeling with such types is in [Newtypes And Simple Values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}#primitive-obsession-and-the-newtype-pattern).

## Abstract types and type members


the term abstract type in Scala means a type declared (with the "type" keyword) to be a member of a class or trait, without specifying a definition.

An abstract type in Scala is always a member of some class or trait, such as type T in trait Abstract.

Like all other abstract declarations, an abstract type declaration is a placeholder for something that will be defined concretely in subclasses. In this case, it is a type that will be defined further down the class hierarchy. So T above refers to a type that is as yet unknown at the point where it is declared. Different subclasses can provide different realizations of T.

The `Abstract` trait and a subclass that fixes `T`:

```scala
trait Abstract:
  type T
  def transform(x: T): T
  val initial: T
  var current: T

class Concrete extends Abstract:
  type T = String
  def transform(x: String) = x + x
  val initial = "hi"
  var current = initial
```


`trait Abstract[T]` would express almost the same thing. The rough rule for choosing:

- **Type parameter** when the *user* of the type picks it: `List[Int]`, `Map[String, User]`.
- **Type member** when the *implementation* fixes it and users mostly don't care. `Animal`'s `SuitableFood` below is the classic case: a cow decides what it eats, not the code that holds a cow. Members also avoid signatures like `Service[A, B, C, D]` when several types belong together, and they're what makes path-dependent types possible (below).

Wampler ([PDF](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), chapter 2, "Parameterized Types Versus Abstract Type Members") puts the same rule differently: a type parameter suits a type that behaves uniformly for any argument (a `Seq[A]` maps the same way whatever `A` is), while a type member suits a type that evolves in parallel with the enclosing type, so that the two must match. That pairing is sometimes called family polymorphism.

The cost of members is visibility: the type no longer shows up in signatures, so readers and type inference have to look inside the class.

Odersky's motivating example (section 20.6, "Abstract types") shows why the member is needed. An `Animal` with `def eat(food: Food)` can't be specialized to `Cow` with `def eat(food: Grass)`, because a method parameter can't be narrowed in an override; if it could, code holding an `Animal` could feed fish to a cow. Making the food an abstract type member, `type SuitableFood <: Food`, lets each animal fix its own food type, and `bessy.eat(new Fish)` is then a type error that mentions the path type `bessy.SuitableFood`.

### Case study: currencies


The most type-driven passage in Odersky's book is the currency case study (section 20.9). A `CurrencyZone` has an abstract type member `Currency` and a factory `make`; `US` fixes `Currency` to `Dollar`, `Europe` to `Euro`. Adding dollars to dollars compiles, and adding dollars to euros doesn't, because `US.Dollar` and `Europe.Euro` are different types; converting between them goes through an explicit converter with exchange rates. The book ties it to the Mars Climate Orbiter, lost in 1999 because one team used metric units and another imperial units: had the units been coded like the currencies, a compile would have caught it. The chapter's conclusion (section 20.10) states the method: when designing a class, make everything not yet known into an abstract member, and the type system will then drive the development of the model.

[abstract type members](https://docs.scala-lang.org/tour/abstract-type-members.html)

[type parameters vs type members](https://typelevel.org/blog/2015/07/13/type-members-parameters.html)

<https://stackoverflow.com/questions/1154571/scala-abstract-types-vs-generics>

## Nominal and structural subtyping


When a class inherits from another, the first class is said to be a nominal subtype of the other one. It's a nominal subtype because each type has a name, and the names are explicitly declared to have a subtyping relationship.

Scala additionally supports structural subtyping, where you get a subtyping relationship simply because two types have compatible members.

One of the primary advantages of using structural types is the increased flexibility they bring to the table. Instead of being bound by strict class hierarchies, developers can focus on the actual operations an object can perform.

To get structural subtyping in Scala, use Scala's refinement types.

You write the members you need in braces, with or without a base type: `Animal { type SuitableFood = Grass }` or `{ def name: String }`. Any value whose type has those members conforms, whether or not its class ever declared a relationship. It's duck typing, checked by the compiler: if it has a `quack` of the right type, it's accepted as a duck.

? compile time checks

Yes, the members are checked at compile time: passing an `Int` where `{ def name: String }` is expected is a type error. What happens at runtime is the *call*. The JVM has no structural types, so calling a method or value that the base type doesn't declare goes through Java reflection: in Scala 2 behind `import scala.language.reflectiveCalls`, in Scala 3 through the `Selectable` trait (import `scala.reflect.Selectable.reflectiveSelectable` for ordinary classes). So it's checked statically and dispatched reflectively, which is slower than a normal call. Refining only a type member, as in `Animal { type SuitableFood = Grass }`, needs no reflection, because types are erased anyway.

The reflection is a JVM artifact, not a property of structural typing. Pierce ([PDF](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), section 19.3) explains why: in a nominal language the class name doubles as a run-time tag, and method calls are dispatched through it. Go has no such constraint: an interface is satisfied by any type with the right methods, without declaring it, and calls through it are ordinary dynamic dispatch. Bodner ([PDF](/sources/programming/language-practice/bodner-2024-learning-go-2e.pdf.enc), chapter 7, "Interfaces Are Type-Safe Duck Typing") adds the design rule that goes with it: interfaces specify what callers need, so they're defined by the code that uses them. Python's `typing.Protocol` is the same idea, checked only statically (Ramalho, [PDF](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), chapter 13; see the grid in [Dimensions Of Type Systems]({{< ref "type-driven-design/01-foundations/dimensions-of-type-systems" >}}#nominal-and-structural-equivalence)).

{{< callout context="note" title="Avoid Structural Typing" icon="outline/info-circle" >}}
When a structural type seems like a good solution to a problem, consider using a [type class](https://nrinaudo.github.io/scala-best-practices/definitions/type_class.html) instead.
{{< /callout >}}


Why the advice:

- **Reflection.** Calls are slower, as above. Suereth ([PDF](/sources/programming/scala/suereth-2012-scala-in-depth.pdf.enc), section 6.1.3, rule 15, "Avoid structural types") gives this reason, plus the fact that reflection isn't available on every platform Scala targets.
- **Matches by accident.** Two unrelated methods that happen to share a name and signature, a widget's `draw()` and a gunslinger's `draw()`, satisfy the same structural type.
- **Can't adapt.** A structural type only accepts classes that already have the member under that exact name. A type class instance can adapt a type you don't own, even one whose method is called something else, and the opt-in is explicit (Odersky, section 23.1, "Why typeclasses?").

Odersky's own advice (section 20.8) is to try nominal types first with any new design: a name is shorter than a list of members, and it states the intent. Wampler (chapter 16, "Structural Types") adds that the alternative is often simpler than a type class: an observer that needs "something with an `update` method" can take a plain function instead.

Scala's member refinements are not the predicate refinement types of [Refinement Types By Language]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types-by-language" >}}#scalas-terminology-trap).

<https://stackoverflow.com/questions/75149674/what-is-a-difference-between-refinement-type-and-anonymous-subclass-in-scala-3>

### Trade-offs


Further, structural subtyping is often more flexible than you want. Nonetheless, structural subtyping has its own advantages. One is that sometimes there really is no more to a type than its members. For example, suppose you want to define a Pasture class that can contain animals that eat grass. One option would be to define a trait AnimalThatEatsGrass and mix it into every class where it applies. It would be verbose, however. Class Cow has already declared that it's an animal and that it eats grass, and now it would have to declare that it is also an animal-that-eats-grass.

Instead of defining AnimalThatEatsGrass, you can use a refinement type. Simply write the base type, Animal, followed by a sequence of members listed in curly braces. The members in the curly braces further specify -- or refine, if you will -- the types of members from the base class.

example to refactor:

```scala
trait Food
trait Grass extends Food
abstract class Animal:
  type SuitableFood <: Food
  def eat(food: SuitableFood): Unit
type Cow = Animal { type SuitableFood = Grass }
```


In this version `Cow` is only an alias for "any animal that eats grass", not a class. The book itself does it the other way round ([PDF](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), listing 20.11 and section 20.8): `Cow` is an ordinary class, and the refinement appears where it pays off, at the place that needs grass-eaters:

```scala
class Cow extends Animal:
  type SuitableFood = Grass
  override def eat(food: Grass): Unit = ()

class Pasture:
  var animals: List[Animal { type SuitableFood = Grass }] = Nil

val pasture = Pasture()
pasture.animals = Cow() :: pasture.animals   // Cow conforms; it never mentions pastures or grass-eaters
```


A structural bound on a type parameter works the same way. Alexander's *Scala Cookbook* ([PDF](/sources/programming/scala/alexander-2021-scala-cookbook-2e.pdf.enc), recipe 23.6, "Using Duck Typing (Structural Types)") writes `def callSpeak[A <: { def speak(): Unit }](obj: A)`, which accepts any object with a `speak()` method.

### Structural types for dynamic records


use on *client side*

Structural types fit best at the *use* site: a function parameter says "I need something with a `name`", and the callers' classes don't have to agree on a shared trait. Defining your own domain types structurally is where the problems in the advice above start.

Here the function says it needs only a `name` field, without naming a type for its parameter. In Scala 3, calling `entity.name` on an ordinary class needs the `reflectiveSelectable` import mentioned above.

```scala
def printName(entity: {def name: String}): Unit = println(entity.name)
```


Structural types help in situations where you'd like to support simple dot notation in dynamic contexts without losing the advantages of static typing. They allow developers to use dot notation and configure how fields and methods should be resolved.

The type `Person` adds a *refinement* to its parent type `Record` that defines the two fields `name` and `age`. We say the refinement is *structural* since `name` and `age` are not defined in the parent type. But they exist nevertheless as members of type `Person`.

```scala
type Person = Record { val name: String; val age: Int }
val person: Person = ???
println(s"${person.name} is ${person.age} years old.") // works
println(person.email) // error: value email is not a member of Person
```


`Record` isn't built in. It's a class you write, extending `Selectable`, and its `selectDynamic` decides how a field is fetched:

```scala
class Record(elems: (String, Any)*) extends Selectable:
  private val fields = elems.toMap
  def selectDynamic(name: String): Any = fields(name)

val person = Record("name" -> "Emma", "age" -> 42).asInstanceOf[Person]
```


This is the use case structural types are good at: typed dot access to data whose shape is known only at runtime, such as database rows or JSON. Critique: the `asInstanceOf[Person]` is where trust enters. Nothing checks that the map actually has those fields, so `Record("name" -> "Emma").asInstanceOf[Person].age` compiles and fails at runtime. It's the mirror image of the problem in [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}): there, a check happens and the type doesn't record it; here, the type records a check that never happened.

Wampler (chapter 20, "Structural Types Revisited") shows that the trust goes further than the one cast: the compiler turns `person.name` into `person.selectDynamic("name").asInstanceOf[String]`, so every field access is a cast as well.


<https://www.baeldung.com/scala/structural-types>

<https://docs.scala-lang.org/scala3/book/types-structural.html>

<https://docs.scala-lang.org/scala3/reference/changed-features/structural-types.html>

## Union and intersection types


Scala 3 adds two type operators (Odersky, sections 17.5 "Intersection types" and 17.6 "Union types"):

- **`A & B`** is the intersection: a value that is both an `A` and a `B`, with the members of both. It replaces Scala 2's compound type `A with B`.
- **`A | B`** is the union: a value that is an `A` or a `B`. Only members that both share are available directly; to use anything else you pattern match.

Together they make Scala's types a lattice: for any two types, `A | B` is their least upper bound and `A & B` their greatest lower bound, which is why inference can give a precise type to `if c then 1 else "one"` (`Int | String`) instead of falling back to `Any`.

A union isn't a sum type. `String | Int` carries no tag of its own; matching works on the run-time class. That's enough when the alternatives are different classes, but `Int | Int` is just `Int`, so a union can't distinguish two cases with the same type, which a sum type (`enum`) can (see [Types As Propositions]({{< ref "type-driven-design/01-foundations/types-as-propositions" >}})). Wampler (chapter 16) shows unions used for lightweight error types, `Good | Bad` in place of `Either[Bad, Good]`; the trade-off is that `Either` is biased and composes with `flatMap`, while a union needs a match at each use.

## Path-dependent types


A path-dependent types resembles the syntax for an inner class type in Java, but there is crucial difference: a path-dependent types names an outer object, whereas an inner class type names an outer class.

An example:

```scala
class Graph:
  class Node
  def connect(a: Node, b: Node): Unit = ()

val g1 = Graph()
val g2 = Graph()
val n1 = new g1.Node
val n2 = new g2.Node

g1.connect(n1, new g1.Node)   // ok
g1.connect(n1, n2)            // error: found g2.Node, required g1.Node
```


`g1.Node` and `g2.Node` are different types because each depends on a *value*, the object `g1` or `g2`. In Java, `Graph.Node` names the class, so a node from any graph would be accepted. Scala's `Graph#Node` (a type projection) is the Java-like "node of any graph" when you want it.

Odersky (section 20.7, "Path-dependent types") states the relationship: `g1.Node` is a subtype of `Graph#Node`, but you can't write `new Graph#Node`, because a node has to belong to a particular graph. Scala 3 also restricts projections: `T#A` is no longer allowed when `T` is an abstract type (Wampler, chapter 17, "Type Projections").

The practical use is keeping handles from being mixed across instances: nodes of different graphs, keys of different maps, sessions of different connections. Suereth (section 6.1.1, "Types and paths") works through an example, an observable whose subscription handles are path-dependent, so a handle from one observable can't be used to unsubscribe from another even if the two handles are equal at run time. It's a limited form of dependent typing, since the type depends on a value but only on a stable path like `g1`, not on arbitrary expressions. See [Dependent Types]({{< ref "type-driven-design/05-stronger-type-systems/dependent-types" >}}).

## Type parameters and type tags


> Type parametrization allows you to write generic classes and traits.
For example, sets are generic and take a type parameter: they are defined as Set[T]. As a result, any particular set instance might be a `Set[String]`, a `Set[Int]`, etc., but it must be *a set of something*.

**Raw Types**. A raw type is an object of a generic class or interface if its type arguments are not passed during its creation.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Not quite: a raw type is a *type*, not an object. Bloch ([PDF](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), Item 26 "Don't use raw types") defines it as the name of a generic type used without any type arguments, such as `List` for `List<E>`. Java kept raw types, and erased generics, for migration compatibility with code written before generics.
{{< /callout >}}


Raw types are a Java concept, and Scala doesn't have them. Java kept them for compatibility with code written before generics (Java 5), and using one switches off generic type checking. In Scala every use of a generic type must supply its arguments. The closest thing is a wildcard, `List[?]` in Scala 3 (`List[_]` in Scala 2), which is still type-safe: you can read elements as `Any`, and you can't put an element in as the unknown element type. In Java this means you can't add to a `Collection<?>`. Scala's immutable `List` is different because it's covariant: `x :: xs` on a `List[?]` compiles and returns a list of a wider type (`::` takes `B >: A`), so "adding" produces a new list rather than putting a wrong element into the old one. Raw types appear in Scala only through Java interop, where they're read as wildcards.

*Generic Classes* are classes which take a type as a parameter. They are particularly useful for collection classes.

A generic class is a type constructor: `List` on its own isn't a type but a function from types to types (`Int` to `List[Int]`). Abstracting over type constructors is what `F[_]` in [Tagless Final]({{< ref "type-driven-design/04-architecture/tagless-final" >}}) does.

How a generic type relates to its argument under subtyping (whether a `List[Cat]` is a `List[Animal]`) is variance, covered in [Scala]({{< ref "functional-programming/04-languages/scala" >}}#variances). Bloch's Java view is a useful contrast. Arrays are covariant and reified (they know their element type at run time), generics are invariant and erased (Item 28), so they mix badly; and Java expresses variance at each use site with wildcards, summed up as PECS, "producer extends, consumer super" (Item 31). Bloch also warns that if the user of a class has to think about wildcard types, there's probably something wrong with its API. Scala declares variance once, on the class (`List[+A]`), which is the design Odersky argues for in section 18.5.

In summary, type erasure is a mechanism in Scala where the compiler removes information about type parameters and type arguments during compilation, which can lead to limitations in the type system. To overcome this, Scala provides type tags, which are runtime representations of erased types.

The typical symptom:

```scala
def isStrings(x: Any) = x match
  case _: List[String] => true   // warning: unchecked; also true for List(1, 2)
  case _ => false
```


At runtime the JVM sees only `List`, so the `String` part can't be checked. The tools:

- `ClassTag[T]` carries the runtime class. It's enough to create arrays of `T` and to match on a non-generic `T`.
- `TypeTag[T]` (Scala 2, in `scala-reflect`) carried the full type, including type arguments. Scala 3 has no `TypeTag`. It offers inline methods (`erasedValue`, `summonInline`), `TypeTest` for safe matching, and `quoted.Type` in macros.

Critique: needing a type tag is often a sign that the design is fighting erasure. Usually it's better to put the distinction into the data, for example as a sum type, than to recover it from the runtime type. Java's version of the type tag is the *type token*, a `Class<T>` passed as a key (Bloch, Item 33, "Consider typesafe heterogeneous containers"), and it has the same limit as `ClassTag`: it can't represent `List<String>` as distinct from `List<Integer>`.

Two related Scala 3 features:

- **`Matchable`.** Wampler (chapter 4, "Safer Pattern Matching with Matchable") shows that a type test can break an abstraction: `IArray`, an immutable array, is an opaque alias of `Array`, so matching `case a: Array[Int]` on an `IArray` recovers a mutable array. Scala 3 warns when you pattern match on a type not bounded by `Matchable`, which opaque types aren't.
- **Type evidence.** A using parameter of type `A <:< B` (or `A =:= B`) is evidence that `A` is a subtype of `B` (or equal to it). It has no other job: a method such as `flatten` on `Option[A]` can require `A <:< Option[B]`, and the call compiles only where the evidence exists (Wampler, chapter 6, "Implicit Evidence"). It's the Scala-library version of the evidence values in [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}#evidence-without-runtime-cost).

Sources for this section: the quotation on type parametrization is the introduction to Odersky's chapter 18 ("Type Parameterization"); erasure in pattern matching is section 13.2 ("Type erasure"); `ClassTag` is in section 24.9 ("Arrays"); Suereth covers the Scala 2 `Manifest`s that preceded `ClassTag` and `TypeTag` in section 7.2.

## Multiversal equality


Scala 2 let you compare any two values with `==`, so `"hello" == Option("hello")` compiled and was always false, a bug that tends to appear when a refactoring changes a `String` to an `Option[String]`. Scala 3's multiversal equality (Odersky, section 23.4) rejects that comparison at compile time: `==` between two types is allowed only when a given `CanEqual` says they can be compared. The standard library provides instances for its own types, and the `strictEquality` option extends the requirement to every type, including your own classes, which then need a `derives CanEqual` or a given instance. `CanEqual` has no methods; it only grants permission, so it's another form of type evidence. Its main use in domain modeling is keeping distinct identifier types from being compared ([Newtypes And Simple Values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}#scala-value-classes-and-opaque-types)).

## To study


unit, nothing, bottom type

A first pass at each:

- **`Unit`** has exactly one value, `()`. It's what Java's `void` would be if it were a real value: a function returning `Unit` still returns something, so it composes like any other function (`List[Unit]`, `IO[Unit]`). In logic it's "true", trivially provable and carrying no information.
- **`Nothing`** is the bottom type: a subtype of every type, with no values at all. An expression of type `Nothing` never completes normally (`throw`, `???`, an infinite loop). Being a subtype of everything is what lets `if ok then 42 else throw Error()` have type `Int`, and what lets `Nil`, a `List[Nothing]`, be used as a `List[Int]` through covariance. In logic it's "false", which has no proof. See [Types As Propositions]({{< ref "type-driven-design/01-foundations/types-as-propositions" >}}).
- **`Null`** is the type of `null`, a subtype of every reference type. With Scala 3's explicit nulls enabled it isn't, and you write `String | Null` instead. Odersky notes that explicit nulls were still an experimental option (`-Yexplicit-nulls`) at the time of the fifth edition.
- **`Any`** is the top of the hierarchy, splitting into `AnyVal` (primitives such as `Int`) and `AnyRef` (objects).

The common confusion is `Unit` versus `Nothing`: a `Unit` function returns, with nothing interesting; a `Nothing` function never returns.

## Encoding contracts in Scala


Moved from [To Sort]({{< ref "functional-programming/05-practice/to-sort" >}}) on 2026-04-05, and from [What Belongs In Types]({{< ref "type-driven-design/01-foundations/what-belongs-in-types" >}}) to this note the same day. The **Explanation** and **Critique** callouts are commentary added that day; the rest is the original note text.

[https://docs.scala-lang.org/scala3/book/domain-modeling-fp.html](https://docs.scala-lang.org/scala3/book/domain-modeling-fp.html)

How deep do you want to encode your contracts.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The question behind this list: each invariant can be checked by a test, by a runtime check in a constructor, or by the type system. Moving it into types gives earlier and more complete guarantees but costs more code, slower compilation and harder error messages. [What Belongs In Types]({{< ref "type-driven-design/01-foundations/what-belongs-in-types" >}}) works through how to decide.
{{< /callout >}}


[Refined](https://github.com/fthomas/refined) let's you constrain your primitive types ([https://github.com/fthomas/refined#provided-predicates](https://github.com/fthomas/refined#provided-predicates)) at compile time rather than runtime with assert.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Only literals can be checked at compile time. A value that arrives at runtime (user input, JSON, a database row) still has to be validated at runtime; refined does this with functions that return an `Either`, so the check happens once at the boundary and the rest of the code receives the refined type. Refined's compile-time literal checks rely on Scala 2 macros; for Scala 3, Iron is the commonly used refinement-types library. Worth checking against the current refined documentation. See [Refinement Types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}#limits).
{{< /callout >}}


[Shapeless](https://github.com/milessabin/shapeless/wiki/Feature-overview:-shapeless-2.0.0#collections-with-statically-known-sizes) can encode heterogeneous lists, extensible records, and dependently sized collections (among other things).

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Dated for Scala 3. Shapeless 2 is a Scala 2 library built on macros and implicit tricks. Scala 3 covers much of the same ground in the language: tuples are heterogeneous lists with type-level operations, and `Mirror` plus `inline` supports generic derivation.
{{< /callout >}}


[Value Types](https://docs.scala-lang.org/overviews/core/value-classes.html) can differentiate between a StreetNumber Int and an Age Int.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Value classes (`class Age(val value: Int) extends AnyVal`) avoid allocation only in simple cases. They are boxed when used as a generic type argument, stored in an array, or pattern matched. In Scala 3, `opaque type Age = Int` gives the distinct type with no runtime wrapper at all, and is usually the better choice.
{{< /callout >}}


[Leon](http://leon.epfl.ch/) and its scala subset Pure Scala can statically verify scala code.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Leon has been superseded by Stainless, its successor from the same EPFL lab, which verifies a subset of Scala with contracts (`require`, `ensuring`). The Leon link is probably stale.
{{< /callout >}}


[EitherT[IO, Throwable, A]](https://typelevel.org/cats/datatypes/eithert.html) can encode side effects and error handling as a data type, so that even error handling is encoded as data, so that if you are reading data from disk and deserializing it into your model fails, you can encode the failure as data without having to use try/catch flow control statements.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The example type is redundant. Cats Effect's `IO` already has an error channel for `Throwable` (`raiseError`, `handleErrorWith`, `attempt`), so `EitherT[IO, Throwable, A]` gives two places for the same failures. `EitherT` pays off when the left side is a domain error type, as in `EitherT[IO, ParseError, A]`, so that expected failures are visible in the signature while unexpected exceptions stay in `IO`. Volpe's rule (see [Tagless Final]({{< ref "type-driven-design/04-architecture/tagless-final" >}}#in-practice)) is to keep transformers like `EitherT` out of interfaces.
{{< /callout >}}


You pay varying degrees of compiler execution time penalty with these things.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Compile time is only one of the costs. The others are harder error messages, a steeper learning curve for the rest of the team, and friction when the model changes, since every invariant in the types has to be kept consistent. See [What Belongs In Types]({{< ref "type-driven-design/01-foundations/what-belongs-in-types" >}}#costs-and-failure-modes).
{{< /callout >}}

## Library sources


- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala, 5th Edition* -- source of the text on abstract types, path-dependent types, nominal and structural subtyping (the Pasture and AnimalThatEatsGrass example, refinement types), and type parametrization; chapter 20, "Abstract Members", covers abstract types (20.6), path-dependent types (20.7), refinement types (20.8) and the currency case study (20.9); also sections 17.4-17.6 on value classes, intersection and union types, chapter 18's introduction and section 18.5, section 13.2 on erasure, section 23.1 on type classes, section 23.4 on multiversal equality and section 24.9 on `ClassTag`; on every section
- [Wampler 2021](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), *Programming Scala, 3rd Edition* -- chapter 2 on type parameters versus type members, chapter 4 on `Matchable`, chapter 6 on implicit evidence, chapter 16 on structural and union types, chapter 17 on type projections, chapter 20 on structural types and `selectDynamic`; on *Abstract types and type members*, *Nominal and structural subtyping*, *Union and intersection types*, *Path-dependent types* and *Type parameters and type tags*
- [Suereth 2012](/sources/programming/scala/suereth-2012-scala-in-depth.pdf.enc), *Scala in Depth* -- section 6.1, "Types and paths" (path-dependent handles in 6.1.1, and rule 15, "Avoid structural types", in 6.1.3), and section 7.2 on Manifests, written for Scala 2.9; on *Nominal and structural subtyping*, *Path-dependent types* and *Type parameters and type tags*
- [Bloch 2018](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), *Effective Java, 3rd Edition* -- Item 26 on raw types, Item 28 on arrays and generics, Item 31 on bounded wildcards, Item 33 on type tokens; on *Type parameters and type tags*
- [Alexander 2021](/sources/programming/scala/alexander-2021-scala-cookbook-2e.pdf.enc), *Scala Cookbook, 2nd Edition* -- recipe 23.6, "Using Duck Typing (Structural Types)"; on *Trade-offs*
- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages* -- section 19.3, "Nominal and Structural Type Systems"; on *Nominal and structural subtyping*
- [Bodner 2024](/sources/programming/language-practice/bodner-2024-learning-go-2e.pdf.enc), *Learning Go, 2nd Edition* -- chapter 7, "Interfaces Are Type-Safe Duck Typing"; on *Nominal and structural subtyping*
- [Ramalho 2022](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), *Fluent Python, 2nd Edition* -- chapter 13, "Interfaces, Protocols, and ABCs": static duck typing with `typing.Protocol`, Python's structural typing; on *Nominal and structural subtyping*
- [Krishnamurthi 2025](/sources/programming/language-theory/krishnamurthi-2025-programming-languages-application-interpretation-v3.pdf.enc), *Programming Languages: Application and Interpretation*, version 3 -- the chapter "Nominal Types, Structural Types, and Subtyping"; on *Nominal and structural subtyping*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers, Scala Edition* -- section 2.6, "Examples of Types": the empty type, unit and bottom; on *To study*

Further reading:

- Scott et al. 2025, *Programming Language Pragmatics, 5th Edition*
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture: Powered by Scala 3*
