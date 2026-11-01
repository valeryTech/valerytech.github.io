---
draft: false
toc: true
title: "Scala Type System"
linkTitle: "Scala Type System"
---
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

The cost of members is visibility: the type no longer shows up in signatures, so readers and type inference have to look inside the class.

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

{{< callout context="note" title="Avoid Structural Typing" icon="outline/info-circle" >}}
When a structural type seems like a good solution to a problem, consider using a [type class](https://nrinaudo.github.io/scala-best-practices/definitions/type_class.html) instead.
{{< /callout >}}


Why the advice:

- **Reflection.** Calls are slower, as above.
- **Matches by accident.** Two unrelated methods that happen to share a name and signature, a widget's `draw()` and a gunslinger's `draw()`, satisfy the same structural type.
- **Can't adapt.** A structural type only accepts classes that already have the member under that exact name. A type class instance can adapt a type you don't own, even one whose method is called something else, and the opt-in is explicit.

Scala's member refinements are not the predicate refinement types of [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}#scalas-terminology-trap).

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


In this version `Cow` is only an alias for "any animal that eats grass", not a class. The book's point ([PDF](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), section 20.8) works better the other way round: `Cow` is an ordinary class, and the refinement appears where it pays off, at the place that needs grass-eaters:

```scala
class Cow extends Animal:
  type SuitableFood = Grass
  override def eat(food: Grass): Unit = ()

class Pasture:
  var animals: List[Animal { type SuitableFood = Grass }] = Nil

val pasture = Pasture()
pasture.animals = Cow() :: pasture.animals   // Cow conforms; it never mentions pastures or grass-eaters
```

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


This is the use case structural types are good at: typed dot access to data whose shape is known only at runtime, such as database rows or JSON. Critique: the `asInstanceOf[Person]` is where trust enters. Nothing checks that the map actually has those fields, so `Record("name" -> "Emma").asInstanceOf[Person].age` compiles and fails at runtime. It's the mirror image of the problem in [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}): there, a check happens and the type doesn't record it; here, the type records a check that never happened.


<https://www.baeldung.com/scala/structural-types>

<https://docs.scala-lang.org/scala3/book/types-structural.html>

<https://docs.scala-lang.org/scala3/reference/changed-features/structural-types.html>

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

The practical use is keeping handles from being mixed across instances: nodes of different graphs, keys of different maps, sessions of different connections. It's a limited form of dependent typing, since the type depends on a value but only on a stable path like `g1`, not on arbitrary expressions. See [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}#towards-dependent-types).

## Type parameters and type tags


> Type parametrization allows you to write generic classes and traits.
For example, sets are generic and take a type parameter: they are defined as Set[T]. As a result, any particular set instance might be a `Set[String]`, a `Set[Int]`, etc., but it must be *a set of something*.

**Raw Types**. A raw type is an object of a generic class or interface if its type arguments are not passed during its creation.

Raw types are a Java concept, and Scala doesn't have them. Java kept them for compatibility with code written before generics (Java 5), and using one switches off generic type checking. In Scala every use of a generic type must supply its arguments. The closest thing is a wildcard, `List[?]` in Scala 3 (`List[_]` in Scala 2), which is still type-safe: you can read elements as `Any` but can't add arbitrary ones. Raw types appear in Scala only through Java interop, where they're read as wildcards.

*Generic Classes* are classes which take a type as a parameter. They are particularly useful for collection classes.

A generic class is a type constructor: `List` on its own isn't a type but a function from types to types (`Int` to `List[Int]`). Abstracting over type constructors is what `F[_]` in [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#tagless-final) does.

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

Critique: needing a type tag is often a sign that the design is fighting erasure. Usually it's better to put the distinction into the data, for example as a sum type, than to recover it from the runtime type.

## To study


unit, nothing, bottom type

A first pass at each:

- **`Unit`** has exactly one value, `()`. It's what Java's `void` would be if it were a real value: a function returning `Unit` still returns something, so it composes like any other function (`List[Unit]`, `IO[Unit]`). In logic it's "true", trivially provable and carrying no information.
- **`Nothing`** is the bottom type: a subtype of every type, with no values at all. An expression of type `Nothing` never completes normally (`throw`, `???`, an infinite loop). Being a subtype of everything is what lets `if ok then 42 else throw Error()` have type `Int`, and what lets `Nil`, a `List[Nothing]`, be used as a `List[Int]` through covariance. In logic it's "false", which has no proof. See [Type Systems]({{< ref "type-driven-design/type-systems" >}}#types-as-propositions).
- **`Null`** is the type of `null`, a subtype of every reference type. With Scala 3's explicit nulls enabled it isn't, and you write `String | Null` instead.
- **`Any`** is the top of the hierarchy, splitting into `AnyVal` (primitives such as `Int`) and `AnyRef` (objects).

The common confusion is `Unit` versus `Nothing`: a `Unit` function returns, with nothing interesting; a `Nothing` function never returns.

## Library sources


- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala, 5th Edition* -- source of the text on abstract types, path-dependent types, nominal and structural subtyping (the Pasture and AnimalThatEatsGrass example, refinement types), and type parametrization; chapter 20, "Abstract Members", covers abstract types (20.6), path-dependent types (20.7) and refinement types (20.8); on *Abstract types and type members*, *Nominal and structural subtyping*, *Path-dependent types* and *Type parameters and type tags*
- [Krishnamurthi 2025](/sources/programming/language-theory/krishnamurthi-2025-programming-languages-application-interpretation-v3.pdf.enc), *Programming Languages: Application and Interpretation*, version 3 -- the chapter "Nominal Types, Structural Types, and Subtyping"; on *Nominal and structural subtyping*
- [Alexander 2021](/sources/programming/scala/alexander-2021-scala-cookbook-2e.pdf.enc), *Scala Cookbook, 2nd Edition* -- recipe 23.6, "Using Duck Typing (Structural Types)", and recipe 23.7 on opaque types; on *Structural types for dynamic records*
- [Suereth 2012](/sources/programming/scala/suereth-2012-scala-in-depth.pdf.enc), *Scala in Depth* -- chapter 6, "The type system": path-dependent types versus type projections, type constraints and existential types, written for Scala 2.9; on *Path-dependent types* and *Type parameters and type tags*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers, Scala Edition* -- section 2.6, "Examples of Types": the empty type, unit and bottom; on *To study*
- [Ramalho 2022](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), *Fluent Python, 2nd Edition* -- chapter 13, "Interfaces, Protocols, and ABCs": static duck typing with `typing.Protocol`, Python's structural typing; on *Nominal and structural subtyping*

Further reading:

- [Wampler 2021](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), *Programming Scala, 3rd Edition*
- Scott et al. 2025, *Programming Language Pragmatics, 5th Edition*
