---
draft: false
toc: true
title: "Type Classes and Polymorphism in Haskell and Scala"
aliases:
  - "/functional-programming/type-classes-and-polymorphism/"
description: "Kinds of polymorphism and parametricity, type classes and their Haskell and Scala encodings compared with Java interfaces, higher-kinded types, GADTs, type-level programming with singletons, and tagless final."
weight: "70"
linkTitle: "Type Classes and Polymorphism"
---

Polymorphism means one piece of code working with values of more than one type. This note covers the kinds of polymorphism, type classes in Haskell and Scala, higher-kinded types, GADTs, type-level programming and, briefly, tagless final.

## Polymorphism

### Kinds of polymorphism


There are several kinds of polymorphism. The usual classification goes back to Christopher Strachey's 1967 lecture notes and was refined by Cardelli and Wegner in 1985:

- **Parametric**: one implementation that works the same for every type, such as `length :: [a] -> Int` or `def length[A](xs: List[A]): Int`.
- **Ad hoc**: a different implementation per type behind one name, chosen by the type. Overloading and type classes are the main forms: `show` for `Int` and `show` for `Bool` are different code.
- **Subtype (inclusion)**: a value of a subtype can be used wherever the supertype is expected, with methods chosen at run time by the object's class, as with inheritance and interfaces. This is the OO kind.
- **Coercion**: the value is converted to the expected type (see below).

Haskell relies on the first two; Scala has all three main kinds. Type classes are also called *bounded* or *constrained* polymorphism: parametric polymorphism restricted to types that have certain operations.

### Coercion


Implicit type conversion has also been counted as a form of polymorphism, called "coercion polymorphism". In Java, `Math.sqrt(4)` accepts an `int` because the compiler inserts a widening conversion to `double`. The function has only one type; the argument is converted so that it fits.

Coercion is polymorphism only in a weak sense, which is why Cardelli and Wegner placed it under "ad hoc" together with overloading: no code works on more than one type, the call site just converts.

- Haskell has no implicit conversions at all. A literal like `4` is polymorphic instead, `4 :: Num a => a`, because it means `fromInteger 4`.
- Scala has implicit conversions, but Scala 3 makes them explicit opt-ins: you define a `given Conversion[A, B]`, and using it without `import scala.language.implicitConversions` produces a feature warning.

### Parametric polymorphism


We say that a function like `f :: a -> a -> a` *is parametric in the type `a`*: it works uniformly for any type *chosen by the caller*. The Scala equivalent is `def f[A](x: A, y: A): A`.

`f` knows nothing about `a`. It can't compare the values, add them or build a new one, because the caller picks the type. So the only possible total implementations return the first argument or the second:

```haskell
f1 :: a -> a -> a
f1 x _ = x

f2 :: a -> a -> a
f2 _ y = y
```


Other parametric functions: `id :: a -> a`, `length :: [a] -> Int`, `map :: (a -> b) -> [a] -> [b]`.

#### The parametricity game


The exercise is to read a polymorphic type and say what any function of that type can possibly do. (The exercise's own list of types wasn't saved.) Some answers:

- `a -> a`: only `id`.
- `a -> b -> a`: only `const`, returning the first argument.
- `a -> b`: no total function exists; you can't produce a `b` from nothing.
- `[a] -> [a]`: it can drop, duplicate and reorder elements, but only based on the list's length and positions, never on the values. So `f (map g xs) == map g (f xs)` for every such `f`.
- `(a -> b) -> [a] -> [b]`: it must use the function to produce the `b`s, so the result elements are `g` applied to elements of the input.

Facts like the `[a] -> [a]` law, derived from the type alone, are called free theorems, after Philip Wadler's 1989 paper "Theorems for free!".

Caveat: the game assumes total functions. In Haskell `undefined`, infinite loops and `seq` add a few extra inhabitants (`a -> b` has `\_ -> undefined`). In Scala the reasoning breaks more often: every value has `equals`, `hashCode` and `toString`, can be `null`, and can be pattern-matched on its runtime class, so `def f[A](x: A, y: A): A` could check `x.isInstanceOf[String]`. Parametric reasoning in Scala holds only by convention, which is why FP style guides ban those operations on type parameters.

### Type-class polymorphism


These passages appear to come from the CIS 194 lecture on type classes (linked below):

> `Num`, `Eq`, `Ord`, and `Show` are *type classes*, and we say that `(==)`, `(<)`, and `(+)` are "type-class polymorphic". Intuitively, type classes correspond to *sets of types* which have certain operations defined for them, and type class polymorphic functions work only for types which are instances of the type class(es) in question.

> If a normal polymorphic type is a promise that the function will work for whatever type the caller chooses, a type class polymorphic function is a *restricted* promise that the function will work for any type the caller chooses, *as long as* the chosen type is an instance of the required type class(es).

> The important thing to note is that when `(==)` (or any type class method) is used, the compiler uses type inference to figure out *which implementation of `(==)` should be chosen*, based on the inferred types of its arguments.

The choice is made at compile time, from types. GHC implements a constraint such as `Eq a =>` as a hidden extra argument, a *dictionary*: a record holding that type's `(==)` and `(/=)`. When you call `elem 3 [1, 2, 3]` at type `Int`, the compiler passes the `Eq Int` dictionary. Scala makes the same mechanism visible as a `using` parameter:

```scala
trait Eq[A]:
  def eqv(x: A, y: A): Boolean

def elem[A](x: A, xs: List[A])(using eq: Eq[A]): Boolean =
  xs.exists(y => eq.eqv(x, y))
```


Because the choice depends on the type and not on a value, the implementation can even be picked by the *result* type: `read "42" :: Int` and `read "42" :: Double` run different code, and `mempty :: String` is `""`.

Caveat: "uses type inference" mixes two steps. Inference works out the types; *instance resolution* then finds the instance that matches them. If inference leaves the type undetermined, resolution fails: `show (read s)` is a type error because nothing says which type to read, except for numeric classes, where Haskell's defaulting rules pick `Integer` or `Double`. In Scala the same step is the search for a `given`, which follows scoping and priority rules, and several instances for the same type can coexist. Haskell instead expects exactly one instance per class and type in the whole program.

### Type classes and Java interfaces


Both declare a set of operations that a type must provide, and both can supply default implementations (Java since version 8). The differences:

- **Where the implementation lives.** A Java class must say `implements Comparable` in its own definition. A type-class instance is declared separately, so you can make an existing type, even one from another library, an instance of your class.
- **What dispatch uses.** A Java method is chosen at run time from the class of the receiver object. A type-class method is chosen at compile time from the types, including the result type, so `mempty` or `read` need no argument to dispatch on.
- **Binary methods.** `(==) :: Eq a => a -> a -> Bool` guarantees that both arguments have the same type. Java's `equals(Object other)` must accept anything and check at run time.
- **Values.** An interface is also a type: you can have a `List<Comparable>` of mixed objects. A type class is not a type, so a list of "anything showable" needs an existential wrapper.

### Links on polymorphism


- CIS 194 (UPenn, spring 2013), lecture 5, type classes: <https://www.seas.upenn.edu/~cis1940/spring13/lectures/05-type-classes.html>
- Wikipedia, Polymorphism (computer science): <https://en.wikipedia.org/wiki/Polymorphism_(computer_science)>
- BalmungSan, a gist (topic not checked): <https://gist.github.com/BalmungSan/c19557030181c0dc36533f3de7d7abf4>

## Type classes

### What a type class is


Type classes in Haskell are a way of describing groups of types that all behave in the same way. A type class declares operations, and an instance says how a particular type provides them. Unlike an interface, a type can join a class after it has been defined, by providing an instance. Type classes are the standard tool for ad hoc polymorphism in functional languages.

The same class in Haskell and in Scala 3:

```haskell
class Describable a where
  describe :: a -> String

instance Describable Bool where
  describe True  = "yes"
  describe False = "no"
```

```scala
trait Describable[A]:
  def describe(a: A): String

given Describable[Boolean] with
  def describe(b: Boolean): String = if b then "yes" else "no"
```


Functions can then require the capability with a constraint, `Describable a => a -> String`, without knowing the concrete type.

Understanding the type classes involved in a type goes a long way toward understanding how the type behaves. A type's instances summarise what it supports: if `Map k` is an instance of `Functor` and `Foldable`, you know you can `fmap` over its values and fold them.

Type classes are sometimes called "the way you use polymorphism in Haskell". That is overstated. Most polymorphism in Haskell is plain parametric polymorphism, such as `map`, `length` or `(.)`, with no type class involved. Type classes are Haskell's way of doing *ad hoc* polymorphism, overloading one name for different types. What Haskell lacks is subtype polymorphism, so type classes cover much of what interfaces and inheritance do in OO languages.

### Haskell and Scala encodings


Haskell has type classes as a language feature (`class` and `instance`). Scala encodes them as a pattern:

- a generic trait (`trait Show[A]`);
- instances defined as `given` values (`implicit` in Scala 2);
- functions that take the instance as a `using` parameter, usually with extension methods for nicer call syntax.

The two differ in one important way. Haskell is designed around one instance per type in the whole program (coherence), so `Ord Int` always means the same ordering. Scala allows several instances for the same type and picks one by scope and priority rules. That is more flexible, but the instance in use depends on imports.

### Default methods


Type classes can have default implementations of methods. If you define `(==)`, Haskell knows what `(/=)` means without any help. This isn't inference: the class definition itself contains the defaults. `Eq` in the Prelude is defined roughly as:

```haskell
class Eq a where
  (==), (/=) :: a -> a -> Bool
  x /= y = not (x == y)
  x == y = not (x /= y)
  {-# MINIMAL (==) | (/=) #-}
```


Each method is defined in terms of the other, so an instance must define at least one of them. The `MINIMAL` pragma tells GHC this, and GHC warns about an instance that defines neither. Without the warning, such an instance would loop forever on the first comparison.

### Why `using` and not an ordinary parameter


Open question, from the `combine` example: why use the `using` keyword rather than an ordinary parameter?

A `using` parameter is filled in by the compiler: it looks for a `given` instance of the required type in scope. So the caller writes `combine(a, b)` and the right `Semigroup` is chosen by the type of `a` and `b`.

```scala
trait Semigroup[A]:
  def combine(x: A, y: A): A

given Semigroup[Int] with
  def combine(x: Int, y: Int): Int = x + y

def combine[A](x: A, y: A)(using s: Semigroup[A]): A = s.combine(x, y)

combine(1, 2) // the compiler supplies the Int instance
```


With an ordinary parameter every caller would have to pass the instance, and every generic function in between would have to thread it through by hand. Resolution also composes: a `given` for `Semigroup[Option[A]]` can itself require a `Semigroup[A]`, and the compiler assembles the chain. An instance can still be passed explicitly with `combine(1, 2)(using someOtherInstance)`. See [Semigroup and monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}).

### Deriving


Haskell can implement some type classes for you automatically, with the `deriving` keyword.

Open question: how does Haskell know how to implement the functions of a derived class for an ADT? It isn't magic, just code generation from the type's structure. The compiler has a built-in generator for each derivable class, and each generator follows the shape of the data type: its constructors and their fields.

```haskell
data Shape = Circle Double | Rect Double Double
  deriving (Eq, Ord, Show)

-- the derived Eq is equivalent to
instance Eq Shape where
  Circle r == Circle r'    = r == r'
  Rect w h == Rect w' h'   = w == w' && h == h'
  _        == _            = False
```


- Derived `Ord` orders by constructor first, in declaration order (every `Circle` is less than every `Rect`), then compares fields left to right.
- Derived `Show` prints the value as the constructor expression that would rebuild it, such as `Rect 1.0 2.0`.
- The derived code needs instances for the field types, here `Eq Double`.

The same kind of generation can be done by a library: GHC's `Generic` class exposes any data type's structure as a generic representation, and libraries such as aeson use it to provide default instances.

You are restricted in deriving to the classes the compiler knows how to derive. The Haskell Report's definition:

> A derived instance is an instance declaration that is generated automatically in conjunction with a data or newtype declaration. The body of a derived instance declaration is derived syntactically from the definition of the associated type. Derived instances are possible only for classes known to the compiler: those defined in either the Prelude or a standard library.

In standard Haskell the derivable classes are `Eq`, `Ord`, `Enum`, `Bounded`, `Show` and `Read` (plus `Ix` from the libraries).

Caveat: this is true for the Haskell standard but dated for GHC. GHC extensions add many more:

- `DeriveFunctor`, `DeriveFoldable` and `DeriveTraversable` for those classes;
- `GeneralizedNewtypeDeriving` to reuse the instance of a newtype's underlying type;
- `DeriveAnyClass` to derive any class whose methods all have defaults;
- `DerivingVia` to borrow an instance from another type with the same representation.

Combined with `Generic`, these let you derive instances of your own classes. Scala 3 has a similar mechanism: a `derives` clause, as in `case class Point(x: Int, y: Int) derives CanEqual`, works for any type class whose companion defines a `derived` method.

### Links on type classes


The Typeclassopedia, Brent Yorgey's tour of the standard Haskell classes from `Functor` and `Applicative` through `Monad`, `Monoid`, `Foldable` and `Traversable`, is the one to read once the basics above are clear. The Scala 3 reference page shows the `given`/`using` encoding used in the examples here.

- Scala 3 reference, type classes: <https://docs.scala-lang.org/scala3/reference/contextual/type-classes.html>
- alexn.org, "OOP vs type classes, part 1: ideology" (2022): <https://alexn.org/blog/2022/05/13/oop-vs-type-classes-part-1-ideology/>
- John De Goes, "Principled typeclasses": <https://degoes.net/articles/principled-typeclasses>
- Haskell Wiki, Typeclassopedia: <https://wiki.haskell.org/Typeclassopedia>
- Andrew Gibiansky, "Haskell typeclasses": <https://andrew.gibiansky.com/blog/haskell/haskell-typeclasses/>
- Stack Overflow, "Typeclasses and overloading, what is the connection?": <https://stackoverflow.com/questions/47971360/typeclasses-and-overloading-what-is-the-connection>

## Higher-kinded types


Kinds are the "types of types".

- `Int` has kind `*` (written `Type` in modern GHC): it is a type of values.
- `Maybe` and `List` have kind `* -> *`. They are not types on their own but type constructors: given a type `A`, they produce `List[A]`.
- `Either` has kind `* -> * -> *`.

A higher-kinded type parameter ranges over type constructors instead of types: `F[_]` in Scala, `f` in Haskell. This is what lets `Functor`, `Monad` and tagless final code be written once for `List`, `Option`, `IO` and every other constructor. Java and Kotlin cannot express this directly.

```haskell
class Functor f where          -- f :: * -> *
  fmap :: (a -> b) -> f a -> f b
```

```scala
trait Functor[F[_]]:
  extension [A](fa: F[A]) def map[B](f: A => B): F[B]
```


Code that is generic in `F[_]` is used by substituting a concrete type constructor for `F`, as in `def double[F[_]: Functor](fa: F[Int]): F[Int]` called with `F = Option` or `F = List`. (This reading of a cut-off jot, "type constructors substitu...", is a guess.)

A constructor with two parameters must be partially applied to fit `F[_]`, which often trips people up:

- In Haskell `Either e` works directly.
- In Scala 3 you write a type lambda, `[X] =>> Either[E, X]`.
- In Scala 2 it needs the kind-projector plugin: `Either[String, *]`.

The Scala 3 kind-polymorphism page covers the next step, `AnyKind`, for code that abstracts over kinds themselves.

- Stack Overflow, "What is a higher kinded type in Scala?": <https://stackoverflow.com/questions/6246719/what-is-a-higher-kinded-type-in-scala>
- the same question, a specific answer: <https://stackoverflow.com/questions/6246719/what-is-a-higher-kinded-type-in-scala/6417328#6417328>
- Wikipedia, Kind (type theory): <https://en.wikipedia.org/wiki/Kind_%28type_theory%29>
- Scala 3 reference, kind polymorphism: <https://docs.scala-lang.org/scala3/reference/other-new-features/kind-polymorphism.html>
- An HKT problem, Stack Overflow, "Scala methods and higher-kinded type parameters": <https://stackoverflow.com/questions/56240426/scala-methods-and-higher-kinded-type-parameters>

## GADTs


A generalised algebraic data type lets each constructor fix the type parameter to something specific. Pattern matching on a constructor then tells the compiler what the parameter is in that branch. The standard example is a typed expression language whose evaluator needs no runtime checks.

In Scala 3:

```scala
enum Expr[A]:
  case IntLit(i: Int) extends Expr[Int]
  case BoolLit(b: Boolean) extends Expr[Boolean]
  case If[T](c: Expr[Boolean], t: Expr[T], e: Expr[T]) extends Expr[T]

def eval[A](expr: Expr[A]): A = expr match
  case Expr.IntLit(i)      => i   // here A is known to be Int
  case Expr.BoolLit(b)     => b
  case Expr.If(c, t, els) => if eval(c) then eval(t) else eval(els)
```


In Haskell the same type needs the `GADTs` extension and uses GADT syntax, in which each constructor is written with its full type, result included (Maguire, ch. 5.2; Bragilevsky, ch. 11.4):

```haskell
{-# LANGUAGE GADTs #-}

data Expr a where
  IntLit  :: Int  -> Expr Int
  BoolLit :: Bool -> Expr Bool
  Add     :: Expr Int -> Expr Int -> Expr Int
  If      :: Expr Bool -> Expr a -> Expr a -> Expr a

eval :: Expr a -> a
eval (IntLit n)  = n                -- in this branch a ~ Int
eval (BoolLit b) = b                -- in this one a ~ Bool
eval (Add x y)   = eval x + eval y
eval (If c t e)  = if eval c then eval t else eval e
```


`Add (IntLit 1) (BoolLit True)` doesn't compile, so the typing rules of the little language are enforced by Haskell's own type checker, and `eval` needs neither a case for ill-typed trees nor an `Either` result. The signature on `eval` is needed: GHC generally can't infer the type of a function that matches on a GADT.

Maguire's observation is that the essential feature is type equality, not the syntax. Each constructor carries a constraint such as `a ~ Int`, which must be proved when the constructor is applied and becomes available when it is matched. The ordinary alternative is an untyped `Expr` plus a separate type-checking pass that can fail at run time.

- Scala 3 book, ADTs and GADTs: <https://docs.scala-lang.org/scala3/book/types-adts-gadts.html>

## Type-level programming


Type-level programming means computing with types at compile time, so that the compiler checks properties such as a vector's length or the fields of a record. In Haskell the tools are type families, `DataKinds` (which lifts values such as numbers and lists to the type level) and `GHC.TypeLits`. In Scala 3 they are match types, singleton literal types and `scala.compiletime`.

### The GHC pieces


- **`DataKinds`** promotes each data type to a kind and its constructors to types. After `data Nat = Z | S Nat`, `'Z` and `'S 'Z` are types of kind `Nat`. They have no values; they serve as indexes of other types (Maguire, ch. 2.2; Bragilevsky, ch. 11.2, which uses promoted temperature units so that Celsius and Fahrenheit can't be mixed).
- **Type-level literals** from `GHC.TypeLits`: numbers of kind `Nat` (GHC's built-in one, not the hand-written `Nat` above) and strings of kind `Symbol`, as in a type `Matrix 3 4` or a field label `"email"`. The `KnownNat` and `KnownSymbol` classes bring a literal back down as a value, with `natVal` and `symbolVal` (Maguire, ch. 2.3 for the literals, with `symbolVal` in ch. 9.2 and `natVal` in ch. 11.2; Bragilevsky, ch. 11.2).
- **Type families** are functions from types to types that the type checker evaluates. A closed family lists all its equations in one place, like a function defined by pattern matching; an associated family is declared inside a type class, and each instance gives its equation (Maguire, ch. 2.4 and 9; Bragilevsky, ch. 11.3). Unlike functions they can't be partially applied; Maguire, ch. 10, works around that with defunctionalisation.

Together with a GADT they give the standard length-indexed vector:

```haskell
{-# LANGUAGE DataKinds, GADTs, KindSignatures, TypeFamilies #-}

data Nat = Z | S Nat

data Vec (n :: Nat) a where
  VNil  :: Vec 'Z a
  VCons :: a -> Vec n a -> Vec ('S n) a

vhead :: Vec ('S n) a -> a          -- total: an empty vector doesn't fit this type
vhead (VCons x _) = x

type family Plus (m :: Nat) (n :: Nat) :: Nat where
  Plus 'Z     n = n
  Plus ('S m) n = 'S (Plus m n)

vappend :: Vec m a -> Vec n a -> Vec (Plus m n) a
vappend VNil         ys = ys
vappend (VCons x xs) ys = VCons x (vappend xs ys)
```

### Singletons


Singletons connect run-time values to these types. A singleton type has exactly one value for each promoted type, so matching on the value tells the compiler the type:

```haskell
data SNat (n :: Nat) where
  SZ :: SNat 'Z
  SS :: SNat n -> SNat ('S n)

vreplicate :: SNat n -> a -> Vec n a
vreplicate SZ     _ = VNil
vreplicate (SS n) x = VCons x (vreplicate n x)
```


A length that arrives at run time, say from user input, has no static type. It is converted to an existentially wrapped singleton ("some `SNat n`, `n` unknown"), and the code that uses it must work for every `n`. This is how GHC approximates dependent types, where a type mentions a value directly; the `singletons` library generates the boilerplate (Maguire, ch. 15; Bragilevsky, ch. 13.2, which builds an elevator interface that can't move with its doors open). Languages with full dependent types, and how far Haskell and Scala get towards them, are in [Towards dependent types]({{< ref "type-driven-design/05-stronger-type-systems/dependent-types" >}}).

### When it is worth it


Bragilevsky (ch. 13.2) puts it plainly: a safer interface is usually less convenient to use, the proofs the compiler demands can be hard or impossible to write, and a program that is unsafe in this sense is fine when it has tests and run-time checks.

The extra typing pays where an error is expensive and the invariant is fixed and simple to state: units, sizes, protocol or state-machine states, the shape of a web API (Bragilevsky, ch. 13.1, on Servant-style API types). Elsewhere a newtype with a smart constructor, or a plain ADT, gets most of the safety at a fraction of the cost (see [Parse, don't validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) and [What belongs in the type system]({{< ref "type-driven-design/01-foundations/what-belongs-in-types" >}})). The costs are long compile errors, code duplicated between the term and type levels, and harder onboarding.

### Study


- Maguire, *Thinking with Types*, is the dedicated book: ch. 2 kinds and data kinds, ch. 5 GADTs, ch. 9 and 10 type families, ch. 15 dependent types.
- Bragilevsky, *Haskell in Depth*, ch. 11 and 13, covers the same ground with larger examples.
- Skinner, *Effective Haskell* ([PDF](/sources/47da28f54846d377221bfd47a62316ff.bin)), ch. 15, is a shorter, applied introduction inside a general Haskell book.
- Video playlist (topic not checked; filed under type-level programming): <https://www.youtube.com/playlist?list=PLmtsMNDRU0ByOQoz6lnihh6CtMrErNax7>

## Tagless final


Tagless final combines the two ideas above: program logic is written against an abstract effect type `F[_]` (a higher-kinded parameter), and the operations it may use are type-class constraints on `F`. A concrete effect type such as `IO`, or a simple one for tests, is substituted only at the edge of the program. It is covered in [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}).

## Open tasks


- [ ] Study polymorphism systematically: for each kind of polymorphism, compare in Haskell and Scala how the polymorphic interface is declared, how a type opts in (an instance, a subclass), how a caller requests it (a type parameter, a constraint, a supertype) and how the compiler picks the implementation.

See also: [Nominal and structural subtyping]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#nominal-and-structural-subtyping) and [Type parameters and type tags]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#type-parameters-and-type-tags), [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}), [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid), [Category theory]({{< ref "functional-programming/02-abstractions/category-theory" >}}), [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}) for type classes in Scala, [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}) for tagless final, [Traversable and traverse]({{< ref "functional-programming/02-abstractions/traversable" >}}), and [Towards dependent types]({{< ref "type-driven-design/05-stronger-type-systems/dependent-types" >}}) for dependent types.

## Library sources


- [Welsh and Gurnell 2020](/sources/08cab18bbc8a17a6885874831fe8c431.bin), *Scala with Cats*: the anatomy of a type class and implicit scope in Scala, then the standard type classes.
- [Allen and Moronuki 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles*: section 5.5, parametric against constrained (ad hoc) polymorphism, on *Kinds of polymorphism* and *Parametric polymorphism*; chapter 6: section 6.5, `Eq`'s minimal complete definition and the standard derivable classes, on *Default methods* and *Deriving*; 6.7, the Report's defaulting rules, and 6.12, instance choice by type, including an ambiguous result type, on *Type-class polymorphism*; section 12.4 on kinds and higher-kinded types, on *Higher-kinded types*.
- [Pierce 2002](/sources/61c011d4c2037767a1b6df1b6fde20de.bin), *Types and Programming Languages*: parametric polymorphism (System F), subtyping and higher kinds (Fω), formally.
- [Volpe 2021](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), *Practical FP in Scala (2nd edition)*: tagless final and typeclass derivation in a real application.
- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types*: section 2.1.2, "Arrow Kinds", on `Maybe :: Type -> Type` and the kind of `MaybeT`, on *Higher-kinded types*; section 5.2, "GADTs", on the typed `Expr` evaluator and GADTs as sugar for type equalities, on *GADTs*; sections 2.2-2.4 (data kinds, promoted `Symbol`, `Nat` and lists, closed type families), chapter 9 (associated type families) and chapter 10 (first-class families through defunctionalisation), on *The GHC pieces*; sections 15.2-15.4 on singletons built by hand, `SomeSing` for values that arrive at run time, and the `singletons` package, on *Singletons*; section 7.1 on `HasShow`, an existential that packs a `Show` dictionary, on the last point of *Type classes and Java interfaces*; sections 13.1-13.2 on `Generic` representations and on `DefaultSignatures` with `DeriveAnyClass` for deriving your own classes, on *Deriving*; the Introduction's advice to keep type-level code for cases where errors would be catastrophic, on *When it is worth it*.
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth*: chapter 2, Type classes; chapter 11, Type system advances (kinds, data kinds and type-level literals, type families, GADTs, rank-N types); section 12.1 on deriving strategies, including `GeneralizedNewtypeDeriving` and `DerivingVia`, with 12.1.1 on the stock, newtype and anyclass strategies, `DeriveFunctor`, `DeriveFoldable` and `DeriveTraversable`, and `DeriveGeneric` with `DeriveAnyClass` for `ToJSON`, and the opening of section 12.2 on `GHC.Generics` as the representation behind generic default instances, on *Deriving*; section 13.2 on singletons.
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell*: chapter 6, Type Classes, section "Deriving Instances": the standard derivable classes, and the error when a field type lacks the instance; "Deriving More Things" covers `GeneralizedNewtypeDeriving` (a `USD` newtype), `DerivingVia`, roles, `DeriveAnyClass` and `DerivingStrategies`; on *Deriving*. Chapter 11, Serializing Heterogenous Data, section "Building a List of FileData Values", tries `forall` and impredicative types before using an existential wrapper, `data Packable = forall a. Encode a => Packable ...`, to put differently typed values in one list; on *Type classes and Java interfaces*. Chapter 15, Programming with Types: "Types and Kinds" on type-level naturals and `Symbol` strings evaluated with `:kind!`, and `DataKinds`; "Functions from Types to Types" covers associated, open and closed type families, with `symbolVal`/`KnownSymbol` and `natVal` bringing literals back to terms; on *The GHC pieces*. "GADTs: Functions from Terms to Types" builds a heterogeneous user list and a typed shell-command wrapper; on *GADTs*.
- Gibbons and de Moor 2003, *The Fun of Programming*: chapter 12, Hinze, "Fun with phantom types": section 12.1, "Introducing phantom types", builds the typed expression language (`Zero`, `Succ`, `IsZero`, `If`) with constructors that carry type-equality constraints and a tag-free `eval :: Term t -> t`, with an exercise on why such functions need signatures; section 12.7, "A type equality type", encodes the constraints with a type-equality type; on *GADTs*.
- [Serrano Mena 2022](/sources/5c1001bd2c4b75b2ff640e61358fc71a.bin), *Haskell: Almost Standard Libraries*: chapter 25, Reflection, section 25.3, "Automatic derivation, explained": `GHC.Generics` represents any data type with `U1`, `K1`, `:*:`, `:+:` and metadata `M1`, links each type to its representation through `Generic`/`Rep`, and writes a generic equality class whose pattern aeson's `GToJSON` follows; on *Deriving*.
- [Serrano Mena 2021](/sources/4f6f84b5680da34841126999b31e2ed3.bin), *Book of Monads (2nd edition)*: introduction, section 0.1, "Type Classes", sets Haskell type classes beside Scala 2 implicits and Scala 3 `given`/`using`; section 0.2, "Higher-kinded Abstraction", abstracts over type constructors (`Container c`, `Container[C[_]]`); section 0.3, "Haskell's Newtype", uses `newtype` to give a type a second instance when Haskell rejects overlapping ones; on *Haskell and Scala encodings* and *Higher-kinded types*.
- King 2019, *Parse, don't validate*: section "Parsing, not validating, in practice": where an invariant is impractical to make unrepresentable, an abstract newtype with a smart constructor "fakes" a parser, and singletons are not worth it to remove one `error "impossible"`; on *When it is worth it*.

Further reading:

- [Milewski 2019](/sources/0e04926a1bcff6dccfd4b9a974acdff4.bin), *Category Theory for Programmers (Scala edition)*
- [Odersky et al. 2021](/sources/6d5d72f2cd796c67b467228f976d4a33.bin), *Programming in Scala (5th edition)*
- [Harper 2016](/sources/844b46f25205adfc27e60dec253a34fc.bin), *Practical Foundations for Programming Languages (2nd edition)*
- [Volpe 2023](/sources/42ef10a33c54df6756cd49d40ee34101.bin), *Functional Event-Driven Architecture*
- [Noonan 2018](/sources/82bc6785596e6b9c5b3e2d9a2b2e9c58.bin), *Ghosts of Departed Proofs (Functional Pearl)* ([doi:10.1145/3242744.3242755](https://doi.org/10.1145/3242744.3242755)): the Abstract and section 7, "Summary": preconditions as phantom-typed proofs needing only mild extensions to Haskell 2010, a middle rung between smart constructors and singletons; on *When it is worth it*.
