---
draft: false
toc: true
title: "Type Classes And Polymorphism"
linkTitle: "Type Classes And Polymorphism"
---

Kinds of polymorphism, type classes in Haskell and Scala, higher-kinded types, GADTs and type-level programming.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Polymorphism


There are several types of polymorphism

polymorphism

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Polymorphism means one piece of code working with values of more than one type. The usual classification, going back to Christopher Strachey's 1967 lecture notes and refined by Cardelli and Wegner in 1985:

- **Parametric**: one implementation that works the same for every type, such as `length :: [a] -> Int` or `def length[A](xs: List[A]): Int`.
- **Ad hoc**: a different implementation per type behind one name. Overloading and type classes are the main forms: `show` for `Int` and `show` for `Bool` are different code.
- **Subtype (inclusion)**: a value of a subtype can be used wherever the supertype is expected, with methods chosen at run time by the object's class. This is the OO kind; Scala has it, Haskell doesn't.
- **Coercion**: the value is converted to the expected type (see below).

Type classes are also called *bounded* or *constrained* polymorphism: parametric polymorphism restricted to types that have certain operations.
{{< /callout >}}


Implicit type conversion has also been defined as a form of polymorphism, referred to as "coercion polymorphism".

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In Java, `Math.sqrt(4)` accepts an `int` because the compiler inserts a widening conversion to `double`. The function only has one type; the argument is converted so that it fits.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Coercion is polymorphism only in a weak sense, which is why Cardelli and Wegner placed it under "ad hoc" together with overloading: no code works on more than one type, the call site just converts. Haskell has no implicit conversions at all. A literal like `4` is polymorphic instead, `4 :: Num a => a`, because it means `fromInteger 4`. Scala has implicit conversions, but Scala 3 makes them explicit opt-ins: you define a `given Conversion[A, B]`, and using it without `import scala.language.implicitConversions` produces a feature warning.
{{< /callout >}}

### Parametric polymorphism


`f :: a -> a -> a`

This style of polymorphism is known as parametric polymorphism.

We say that a function like f :: a -> a -> a *is parametric in the type a*. Here "parametric" is just a fancy term for "works uniformly for any type *chosen by the caller*".

example?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
For `f :: a -> a -> a` the only possible total implementations are returning the first argument or the second:

```haskell
f1 :: a -> a -> a
f1 x _ = x

f2 :: a -> a -> a
f2 _ y = y
```

`f` knows nothing about `a`: it can't compare the values, add them or build a new one, because the caller picks the type. The Scala equivalent is `def f[A](x: A, y: A): A`. Other examples of parametric functions: `id :: a -> a`, `length :: [a] -> Int`, `map :: (a -> b) -> [a] -> [b]`.
{{< /callout >}}


Parametricity game: for each of the following polymorphic types determine what behavior

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The exercise (its list of types isn't in the note) is to read a type and say what any function of that type can possibly do. Some answers:

- `a -> a`: only `id`.
- `a -> b -> a`: only `const`, returning the first argument.
- `a -> b`: no total function exists; you can't produce a `b` from nothing.
- `[a] -> [a]`: it can drop, duplicate and reorder elements, but only based on the list's length and positions, never on the values. So `f (map g xs) == map g (f xs)` for every such `f`.
- `(a -> b) -> [a] -> [b]`: it must use the function to produce the `b`s, so the result elements are `g` applied to elements of the input.

Facts like the `[a] -> [a]` law, derived from the type alone, are called free theorems, after Philip Wadler's 1989 paper "Theorems for free!".
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The game assumes total functions. In Haskell `undefined`, infinite loops and `seq` add a few extra inhabitants (`a -> b` has `\_ -> undefined`). In Scala the reasoning breaks more often: every value has `equals`, `hashCode` and `toString`, can be `null`, and can be pattern-matched on its runtime class, so `def f[A](x: A, y: A): A` could check `x.isInstanceOf[String]`. Parametric reasoning in Scala holds only by convention, which is why FP style guides ban those operations on type parameters.
{{< /callout >}}

### Type-class polymorphism


`Num`, `Eq`, `Ord`, and `Show` are *type classes*, and we say that `(==)`, `(<)`, and `(+)` are "type-class polymorphic". Intuitively, type classes correspond to *sets of types* which have certain operations defined for them, and type class polymorphic functions work only for types which are instances of the type class(es) in question.

If a normal polymorphic type is a promise that the function will work for whatever type the caller chooses, a type class polymorphic function is a *restricted* promise that the function will work for any type the caller chooses, *as long as* the chosen type is an instance of the required type class(es).

The important thing to note is that when `(==)` (or any type class method) is used, the compiler uses type inference to figure out *which implementation of `(==)` should be chosen*, based on the inferred types of its arguments. In

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The passages above appear to come from the CIS 194 lecture on type classes linked below. To complete the thought: the choice is made at compile time, from types. GHC implements a constraint such as `Eq a =>` as a hidden extra argument, a *dictionary*: a record holding that type's `(==)` and `(/=)`. When you call `elem 3 [1, 2, 3]` at type `Int`, the compiler passes the `Eq Int` dictionary. Scala makes the same mechanism visible as a `using` parameter:

```scala
trait Eq[A]:
def eqv(x: A, y: A): Boolean

def elem[A](x: A, xs: List[A])(using eq: Eq[A]): Boolean =
xs.exists(y => eq.eqv(x, y))
```

Because the choice depends on the type and not on a value, the implementation can even be picked by the *result* type: `read "42" :: Int` and `read "42" :: Double` run different code, and `mempty :: String` is `""`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Uses type inference" mixes two steps. Inference works out the types; *instance resolution* then finds the instance that matches them. If inference leaves the type undetermined, resolution fails: `show (read s)` is a type error because nothing says which type to read, except for numeric classes, where Haskell's defaulting rules pick `Integer` or `Double`. In Scala the same step is the search for a `given`, which follows scoping and priority rules, and several instances for the same type can coexist. Haskell instead expects exactly one instance per class and type in the whole program.
{{< /callout >}}


**Type classes and Java interfaces**

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Both declare a set of operations that a type must provide, and both can supply default implementations (Java since version 8). The differences:

- **Where the implementation lives.** A Java class must say `implements Comparable` in its own definition. A type-class instance is declared separately, so you can make an existing type, even one from another library, an instance of your class.
- **What dispatch uses.** A Java method is chosen at run time from the class of the receiver object. A type-class method is chosen at compile time from the types, including the result type, so `mempty` or `read` need no argument to dispatch on.
- **Binary methods.** `(==) :: Eq a => a -> a -> Bool` guarantees that both arguments have the same type. Java's `equals(Object other)` must accept anything and check at run time.
- **Values.** An interface is also a type: you can have a `List<Comparable>` of mixed objects. A type class is not a type, so a list of "anything showable" needs an existential wrapper.
{{< /callout >}}


<https://www.seas.upenn.edu/~cis1940/spring13/lectures/05-type-classes.html>

<https://en.wikipedia.org/wiki/Polymorphism_(computer_science)>

<https://gist.github.com/BalmungSan/c19557030181c0dc36533f3de7d7abf4>

### Study plan


Study polymorphism systematically through its API, creation, client-side definition, and usage.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
There are three main kinds of polymorphism. Parametric: one implementation works for every type, as in `def length[A](xs: List[A]): Int`. Ad hoc: a different implementation per type, chosen by the type, as with overloading and type classes. Subtype: code written against a supertype accepts any subtype, as with inheritance and interfaces. Haskell relies on the first two, Scala has all three.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The four angles are vague as written. A more concrete plan is to take each kind of polymorphism and compare, in Haskell and Scala, how the polymorphic interface is declared, how a type opts in (an instance, a subclass), how a caller requests it (a type parameter, a constraint, a supertype) and how the compiler picks the implementation.
{{< /callout >}}

## Type classes


Type classes in Haskell are a way

of describing groups of types that all behave in the same way.

Understanding the type classes involved in a type can go a long way toward help-

ing you understand how a type behaves.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A type class declares operations; an instance says how a particular type provides them. The same idea in Haskell and in Scala 3:

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

"Understanding the type classes involved in a type" means reading a type's instances as a summary of what it supports: if `Map k` is an instance of `Functor` and `Foldable`, you know you can `fmap` over its values and fold them.
{{< /callout >}}


Type

classes are the way you use polymorphism in Haskell

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Overstated. Most polymorphism in Haskell is plain parametric polymorphism, such as `map`, `length` or `(.)`, with no type class involved. Type classes are Haskell's way of doing *ad hoc* polymorphism, overloading one name for different types. What Haskell lacks is subtype polymorphism, so type classes cover much of what interfaces and inheritance do in OO languages.
{{< /callout >}}


It turns out that Haskell is smart enough to figure this out. Type classes _can have default implementations_ of methods. If you define `(==)`, Haskell _can figure_ out what `(/=)` means without any help.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
It isn't inference: the class definition itself contains the defaults. `Eq` in the Prelude is defined roughly as:

```haskell
class Eq a where
(==), (/=) :: a -> a -> Bool
x /= y = not (x == y)
x == y = not (x /= y)
{-# MINIMAL (==) | (/=) #-}
```

Each method is defined in terms of the other, so an instance must define at least one of them. The `MINIMAL` pragma tells GHC this, and GHC warns about an instance that defines neither. Without the warning, such an instance would loop forever on the first comparison.
{{< /callout >}}


type classes?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A type class is an interface that a type can join after it has been defined, by providing an instance. It is the standard tool for ad hoc polymorphism in functional languages. In Haskell:

```haskell
class Describable a where
describe :: a -> String

instance Describable Bool where
describe True  = "yes"
describe False = "no"
```

Functions can then require the capability with a constraint, `Describable a => a -> String`, without knowing the concrete type. See [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#type-classes).
{{< /callout >}}


The definitions of Type Class

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Haskell has type classes as a language feature (`class` and `instance`). Scala encodes them as a pattern: a generic trait (`trait Show[A]`), instances defined as `given` values (`implicit` in Scala 2), and functions that take the instance as a `using` parameter, usually with extension methods for nicer call syntax.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The two definitions differ in one important way. Haskell is designed around one instance per type in the whole program (coherence), so `Ord Int` always means the same ordering. Scala allows several instances for the same type and picks one by scope and priority rules, which is more flexible but means the instance in use depends on imports.
{{< /callout >}}


Open question for the combine example: why use the `using` keyword rather than an ordinary parameter?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A `using` parameter is filled in by the compiler: it looks for a `given` instance of the required type in scope. So the caller writes `combine(a, b)` and the right `Semigroup` is chosen by the type of `a` and `b`.

```scala
trait Semigroup[A]:
def combine(x: A, y: A): A

given Semigroup[Int] with
def combine(x: Int, y: Int): Int = x + y

def combine[A](x: A, y: A)(using s: Semigroup[A]): A = s.combine(x, y)

combine(1, 2) // the compiler supplies the Int instance
```

With an ordinary parameter every caller would have to pass the instance, and every generic function in between would have to thread it through by hand. Resolution also composes: a `given` for `Semigroup[Option[A]]` can itself require a `Semigroup[A]`, and the compiler assembles the chain. An instance can still be passed explicitly with `combine(1, 2)(using someOtherInstance)`. See [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}).
{{< /callout >}}

### Deriving


Additionally, you saw that Haskell is able to _automatically implement_ type classes for you in some cases by using the deriving keyword.

Q: how does Haskell know how to implement the functions of the derived typeclass for the deriving ADT?

A: it's a kind of magic.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The compiler has a built-in generator for each derivable class, and each generator follows the shape of the data type: its constructors and their fields. For example:

```haskell
data Shape = Circle Double | Rect Double Double
deriving (Eq, Ord, Show)

-- the derived Eq is equivalent to
instance Eq Shape where
Circle r == Circle r'    = r == r'
Rect w h == Rect w' h'   = w == w' && h == h'
_        == _            = False
```

Derived `Ord` orders by constructor first, in declaration order (every `Circle` is less than every `Rect`), then compares fields left to right. Derived `Show` prints the value as the constructor expression that would rebuild it, such as `Rect 1.0 2.0`. The derived code needs instances for the field types, here `Eq Double`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Not magic, just code generation from the type's structure, and it can be reproduced in a library: GHC's `Generic` class exposes any data type's structure as a generic representation, and libraries such as aeson use it to provide default instances.
{{< /callout >}}


You are restricted in deriving to particular classes, in terms of what the compiler knows how to derive for you.

A derived instance is an instance declaration that is generated automatically in conjunction with a data or newtype declaration. The body of a derived instance declaration is derived syntactically from the definition of the associated type. Derived instances are possible only for classes known to the compiler: those defined in either the Prelude or a standard library.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This is the Haskell Report's definition. In standard Haskell the derivable classes are `Eq`, `Ord`, `Enum`, `Bounded`, `Show` and `Read` (plus `Ix` from the libraries).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
True for the Haskell standard, dated for GHC. GHC extensions add many more: `DeriveFunctor`, `DeriveFoldable` and `DeriveTraversable` for those classes, `GeneralizedNewtypeDeriving` to reuse the instance of a newtype's underlying type, `DeriveAnyClass` to derive any class whose methods all have defaults, and `DerivingVia` to borrow an instance from another type with the same representation. Combined with `Generic`, these let you derive instances of your own classes. Scala 3 has a similar mechanism: a `derives` clause, `case class Point(x: Int, y: Int) derives CanEqual`, works for any type class whose companion defines a `derived` method.
{{< /callout >}}


<https://docs.scala-lang.org/scala3/reference/contextual/type-classes.html>

<https://alexn.org/blog/2022/05/13/oop-vs-type-classes-part-1-ideology/>

<https://degoes.net/articles/principled-typeclasses>

<https://wiki.haskell.org/Typeclassopedia>

<https://andrew.gibiansky.com/blog/haskell/haskell-typeclasses/>

<https://stackoverflow.com/questions/47971360/typeclasses-and-overloading-what-is-the-connection>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The Typeclassopedia, Brent Yorgey's tour of the standard Haskell classes from `Functor` and `Applicative` through `Monad`, `Monoid`, `Foldable` and `Traversable`, is the one to read once the basics above are clear. The Scala 3 reference page shows the `given`/`using` encoding of type classes used in the examples here.
{{< /callout >}}

## Higher-kinded types


<https://stackoverflow.com/questions/6246719/what-is-a-higher-kinded-type-in-scala>

<https://en.wikipedia.org/wiki/Kind_%28type_theory%29>

<https://docs.scala-lang.org/scala3/reference/other-new-features/kind-polymorphism.html>

<https://stackoverflow.com/questions/6246719/what-is-a-higher-kinded-type-in-scala/6417328#6417328>

hkt problem <https://stackoverflow.com/questions/56240426/scala-methods-and-higher-kinded-type-parameters>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Kinds are the "types of types". `Int` has kind `*` (written `Type` in modern GHC): it is a type of values. `Maybe` and `List` have kind `* -> *`: given a type, they produce a type. `Either` has kind `* -> * -> *`. A higher-kinded type parameter is one that ranges over type constructors instead of types, which is what lets you write `Functor` once for every container:

```haskell
class Functor f where          -- f :: * -> *
fmap :: (a -> b) -> f a -> f b
```

```scala
trait Functor[F[_]]:
extension [A](fa: F[A]) def map[B](f: A => B): F[B]
```

A constructor with two parameters must be partially applied to fit `F[_]`. In Haskell `Either e` works directly. In Scala 3 you write a type lambda, `[X] =>> Either[E, X]`. The Scala 3 kind-polymorphism page covers the next step, `AnyKind`, for code that abstracts over kinds themselves.
{{< /callout >}}


higher kinded types

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`List` and `Option` are not types on their own but type constructors: given a type `A`, they produce `List[A]`. Their kind is written `* -> *`. A higher-kinded type parameter abstracts over such a constructor: `F[_]` in Scala, `f` in Haskell's `class Functor f where fmap :: (a -> b) -> f a -> f b`. This is what lets `Functor`, `Monad` and tagless final code be written once for `List`, `Option`, `IO` and every other constructor. Java and Kotlin cannot express this directly.

See [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#higher-kinded-types).
{{< /callout >}}


type constructors substitu

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The jot is cut off, probably "type constructor substitution". The likely meaning: code that is generic in `F[_]` gets used by substituting a concrete type constructor for `F`, as in `def double[F[_]: Functor](fa: F[Int]): F[Int]` called with `F = Option` or `F = List`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Since the text is truncated, this reading is a guess. A related point that often trips people up: a constructor with two parameters such as `Either` has to be partially applied before it fits `F[_]`. Scala 3 has type lambdas for this (`[A] =>> Either[String, A]`); in Scala 2 it needs the kind-projector plugin (`Either[String, *]`).
{{< /callout >}}

## GADTs


<https://docs.scala-lang.org/scala3/book/types-adts-gadts.html>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A generalised algebraic data type lets each constructor fix the type parameter to something specific. Pattern matching on a constructor then tells the compiler what the parameter is in that branch. The standard example is a typed expression language whose evaluator needs no runtime checks:

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

In Haskell the same type needs the `GADTs` extension.
{{< /callout >}}

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The Haskell version uses GADT syntax, in which each constructor is written with its full type, result included (Maguire, ch. 5.2; Bragilevsky, ch. 11.4):

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

Maguire's observation is that the essential feature is type equality, not the syntax: each constructor carries a constraint such as `a ~ Int`, which must be proved when the constructor is applied and becomes available when it is matched. The ordinary alternative is an untyped `Expr` plus a separate type-checking pass that can fail at run time.
{{< /callout >}}

## Type-level programming


<https://www.youtube.com/playlist?list=PLmtsMNDRU0ByOQoz6lnihh6CtMrErNax7>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Type-level programming means computing with types at compile time, so that the compiler checks properties such as a vector's length or the fields of a record. In Haskell the tools are type families, `DataKinds` (which lifts values such as numbers and lists to the type level) and `GHC.TypeLits`. In Scala 3 they are match types, singleton literal types and `scala.compiletime`.
{{< /callout >}}

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The GHC pieces in brief:

- **`DataKinds`** promotes each data type to a kind and its constructors to types. After `data Nat = Z | S Nat`, `'Z` and `'S 'Z` are types of kind `Nat`. They have no values; they serve as indexes of other types (Maguire, ch. 2.2; Bragilevsky, ch. 11.2, which uses promoted temperature units so that Celsius and Fahrenheit can't be mixed).
- **Type-level literals** from `GHC.TypeLits`: numbers of kind `Nat` (GHC's built-in one, not the hand-written `Nat` above) and strings of kind `Symbol`, as in a type `Matrix 3 4` or a field label `"email"`. The `KnownNat` and `KnownSymbol` classes bring a literal back down as a value, with `natVal` and `symbolVal` (Maguire, ch. 2.3; Bragilevsky, ch. 11.2).
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
{{< /callout >}}

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
**Singletons** connect run-time values to these types. A singleton type has exactly one value for each promoted type, so matching on the value tells the compiler the type:

```haskell
data SNat (n :: Nat) where
SZ :: SNat 'Z
SS :: SNat n -> SNat ('S n)

vreplicate :: SNat n -> a -> Vec n a
vreplicate SZ     _ = VNil
vreplicate (SS n) x = VCons x (vreplicate n x)
```

A length that arrives at run time, say from user input, has no static type, so it is converted to an existentially wrapped singleton ("some `SNat n`, `n` unknown") and the code that uses it must work for every `n`. This is how GHC approximates dependent types, where a type mentions a value directly; the `singletons` library generates the boilerplate (Maguire, ch. 15; Bragilevsky, ch. 13.2, which builds an elevator interface that can't move with its doors open). Languages with full dependent types, and how far Haskell and Scala get towards them, are in [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}#towards-dependent-types).
{{< /callout >}}

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
When it is worth it. Bragilevsky (ch. 13.2) puts it plainly: a safer interface is usually less convenient to use, the proofs the compiler demands can be hard or impossible to write, and a program that is unsafe in this sense is fine when it has tests and run-time checks. The extra typing pays where an error is expensive and the invariant is fixed and simple to state: units, sizes, protocol or state-machine states, the shape of a web API (Bragilevsky, ch. 13.1, on Servant-style API types). Elsewhere a newtype with a smart constructor, or a plain ADT, gets most of the safety at a fraction of the cost (see [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) and [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}})). The costs are long compile errors, code duplicated between the term and type levels, and harder onboarding.

For study: Maguire, *Thinking with Types*, is the dedicated book (ch. 2 kinds and data kinds, ch. 5 GADTs, ch. 9 and 10 type families, ch. 15 dependent types); Bragilevsky, *Haskell in Depth*, ch. 11 and 13, covers the same ground with larger examples; Skinner, *Effective Haskell*, ch. 15, is a shorter, applied introduction inside a general Haskell book.
{{< /callout >}}

## Tagless final


Moved to [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}).

See also: [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#nominal-and-structural-subtyping) and [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#type-parameters-and-type-tags), [Functor]({{< ref "functional-programming/functor" >}}), [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid), [Category Theory]({{< ref "functional-programming/category-theory" >}}), and [Effect Systems]({{< ref "functional-programming/effect-systems" >}}) for type classes in Scala. Also [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) for tagless final, [Traversable]({{< ref "functional-programming/traversable" >}}), and [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}) for dependent types.

## Library sources


- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: the anatomy of a type class and implicit scope in Scala, then the standard type classes.
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: a chapter on typeclasses, then the `Functor`-`Applicative`-`Monad` hierarchy, with exercises.
- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages*: parametric polymorphism (System F), subtyping and higher kinds (Fω), formally.
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: tagless final and typeclass derivation in a real application.
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types*: chapter 2 (kinds, data kinds, type-level functions), chapter 5 (constraints and GADTs), chapters 9 and 10 (type families) and chapter 15 (dependent types and singletons); the main source for GADTs and Type-level programming.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 2, Type classes; chapter 11, Type system advances (kinds, data kinds and type-level literals, type families, GADTs, rank-N types); section 12.1 on deriving strategies, including `GeneralizedNewtypeDeriving` and `DerivingVia`, on the Deriving critique; section 13.2 on singletons.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 6, Type Classes (ad hoc polymorphism, newtypes, higher-kinded types, deriving), and chapter 15, Programming with Types (kinds, type families, GADTs).

Further reading:

- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers (Scala edition)*
- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala (5th edition)*
- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages (2nd edition)*
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture*
