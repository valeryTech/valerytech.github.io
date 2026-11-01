---
draft: false
toc: true
title: "Pure Functions, Referential Transparency and Effects"
aliases:
  - "/functional-programming/pure-functions-and-effects/"
description: "Referential transparency and where substitution breaks, side effects, immutability and persistent data structures, and the functional core with an imperative shell."
weight: "10"
linkTitle: "Pure Functions and Effects"
---

Purity, referential transparency, side effects and immutability, and the effect systems that keep effects visible in types and separate from pure code. Referential transparency is the core tenet of FP; the rest of this note is about what breaks it and how functional code keeps it.

## Referential transparency


An expression is *referentially transparent* when every occurrence of it can be replaced by its value, as many times as we want, without changing what the program does. With `def square(x: Int) = x * x`, any `square(3)` in the program can become `9`. Because each part means just its value, you can understand a program piece by piece and rewrite it like algebra (see [Substitution model and equational reasoning]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#substitution-model-and-equational-reasoning)).

The replacement works in both directions, and the reverse direction is where impure code usually breaks. Naming an expression with a `val` and reusing the name should be the same as writing the expression out twice. For `val x = readLine()` it isn't: `x + x` reads one line, `readLine() + readLine()` reads two.

### Purity: no side effects and determinism


From Wikipedia:

> Absence of side effects is a necessary, but not sufficient, condition for referential transparency. Referential transparency means that an expression (such as a function call) can be replaced with its value. This requires that the expression is [pure](https://en.wikipedia.org/wiki/Pure_function "Pure function"), that is to say the expression must be [deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm "Deterministic algorithm") (always give the same [value](https://en.wikipedia.org/wiki/Value_(computer_science) "Value (computer science)") for the same input) and side-effect free.

"Not sufficient" means a function can change nothing and still not be referentially transparent, because it *reads* changing state. With `var rate = 2` and `def scale(x: Int) = x * rate`, `scale` writes nothing, but `scale(3)` is `6` now and `30` after `rate = 10`, so it can't be replaced by one value. A pure function needs both:

- no writes to the outside (no side effects);
- no reads of anything except its arguments (determinism).

### Where substitution breaks


In pure programs substitution works; in impure ones it breaks. The two standard counterexamples are printing to the console and changing a variable.

Printing:

```scala
val x = { println("hi"); 1 }
val a = x + x                                          // prints "hi" once, when x is defined
val b = { println("hi"); 1 } + { println("hi"); 1 }    // prints "hi" twice
```


Changing a variable, the `StringBuilder` example from chapter 1 of *Functional Programming in Scala*:

```scala
// original program
val sb = new StringBuilder("Hello")
val y  = sb.append(", World")
val r1 = y.toString   // "Hello, World"
val r2 = y.toString   // "Hello, World"

// the same program with y replaced by its definition
val sb2 = new StringBuilder("Hello")
val s1  = sb2.append(", World").toString   // "Hello, World"
val s2  = sb2.append(", World").toString   // "Hello, World, World"
```


In both cases the program with the substitution behaves differently from the original, so the expressions aren't referentially transparent.

## Side effects


A common definition:

> An operation, function or expression is said to have a side effect if it modifies some state variable value(s) outside its *local environment*, which is to say if it has any observable effect other than its *primary effect of returning a value* to the invoker of the operation. Example side effects include modifying a non-local variable, modifying a static local variable, modifying a mutable argument passed by reference, performing I/O or calling other functions with side-effects.

"Observable" carries most of the weight. Mutation that nobody outside can see doesn't count: a function may build its result in a local mutable buffer, or cache results internally, and still be pure from the caller's side. Haskell's `ST` monad makes that guarantee checkable by the type system.

The list leaves out throwing an exception, which breaks referential transparency too. The example from chapter 4 of *Functional Programming in Scala*:

```scala
def failingFn(i: Int): Int =
  val y: Int = throw new Exception("fail!")
  try
    val x = 42 + 5
    x + y
  catch case e: Exception => 43
```


`failingFn` throws, because `y` is evaluated before the `try`. Replace `y` with its definition inside the `try`, `x + ((throw new Exception("fail!")): Int)`, and the function returns `43`.

### A balanced attitude


Scala doesn't forbid mutation. *Programming in Scala* states the language's position in a box:

> **A balanced attitude for Scala programmers**
>
> Prefer vals, immutable objects, and methods without side effects. Reach for them first. Use vars, mutable objects, and methods with side effects when you have a specific need and justification for them.
>
> (Odersky et al. 2021)

The immutable choice is the default you reach for, and the mutable one is an exception you justify. Typical justified cases are a local `var` in a performance-critical loop that doesn't escape the method, and mutable builders used inside a function that returns an immutable result.

## Immutability and functional methods

### Passing copies of data


> This may not seem like a big change but passing copies of data is one of the fundamental things done in functional programming!
>
> (Płachta 2022, ch. 2, "Passing copies of the data")

The change in question is to a Java `ShoppingCart` class: `getItems` returns `new ArrayList<>(items)` instead of the internal list, so a caller that modifies the returned list can no longer corrupt the cart's state. More generally, a function returns a modified copy instead of modifying the data it receives. Callers keep their original, so a function can't break data someone else is still using.

Caveat: "copies" is the mental model, not what usually happens in memory. Immutable collections share structure between versions, so the "copy" is often a few new nodes (see Persistent data structures below).

### Functional methods


A *functional method* is one whose result depends only on its arguments and on the (immutable) object it is called on, and which changes nothing. All the methods on an immutable `Seq` are functional in this sense: they don't mutate the existing sequence but return a new value. `xs.appended(4)` or `xs :+ 4` returns a new sequence and leaves `xs` as it was. The mutable counterpart, `buffer += 4` on an `ArrayBuffer`, changes the buffer and returns it.

Caveat: this depends on which `Seq`. `scala.collection.mutable.Seq` has an `update` method that changes it in place. Since Scala 2.13 the default `Seq` is `scala.collection.immutable.Seq`; in 2.12 and earlier the default was `scala.collection.Seq`, which could be a mutable sequence.

### Functional objects and `this`


A common way of describing methods on immutable objects:

> But in Scala's "functional objects" approach, you can access value implicitly. Technically this violates my rule that for pure functions, "Output depends only on input," but when you use the functional objects coding style, this is the one case where you are allowed to implicitly access other fields in a function in your class.

It isn't really an exception to "output depends only on input". The object the method is called on is an input, passed implicitly as `this`. A method `r.add(s)` on an immutable `Rational` is a pure function of `r` and `s`, just as `add(r, s)` would be. The rule only breaks if a field the method reads can change, that is if it is a `var` or refers to a mutable object.

### Copy and return


The copy-and-return style: a function never changes its arguments; when it needs a changed version, it builds a copy with the changes and returns that. In Scala, case classes generate a `copy` method for exactly this:

```scala
final case class Account(owner: String, balance: BigDecimal)

def deposit(acc: Account, amount: BigDecimal): Account =
  acc.copy(balance = acc.balance + amount)   // acc itself is unchanged
```


Should *all* functions be written this way? The rule is about what callers can observe: a function may mutate local data it created itself, as long as none of it escapes. And "copy" sounds expensive, but immutable collections rarely copy everything, because they are persistent.

### Persistent data structures


*Programming in Scala*, in its chapter on type parameterization, builds a functional queue from two lists:

> Purely functional queues also have some similarity with lists. Both are so called *fully persistent* data structures, where old versions remain available even after extensions or modifications.
>
> (Odersky et al. 2021)

"Persistent" means an update produces a new version and the old version keeps working. Prepending to a list shows how this stays cheap: `val ys = 0 :: xs` creates one new cell that points at `xs`, and both lists share the rest. Updating one key in an immutable `Map` likewise costs little.

Caveat: the two-list queue has a subtlety that persistence exposes. Its constant-time cost is amortized: an occasional expensive reversal is paid for by many cheap operations before it. If old versions are reused, the same expensive reversal can be triggered again and again from one old version, and the amortized bound no longer holds. Chris Okasaki's *Purely Functional Data Structures* treats this problem and shows how laziness restores the bounds.

## Effect systems


Functional code doesn't remove effects; it makes them visible. An effect type such as `IO[A]`, `Option[A]` or `Either[E, A]` is a value that *describes* a computation with some extra behaviour, so the code that builds it stays referentially transparent, and the effect happens only when a runtime executes the description. In the Scala and Haskell libraries, an *effect system* is a library built around such an `IO` type: Cats Effect and ZIO in Scala, and the built-in `IO` in Haskell. In programming-language theory the term means something narrower: an extension of the type system that records and checks what a function may do besides returning a value (Nielson and Nielson 1999).

The full treatment, including the two senses of "effect", `IO` in Haskell, Cats Effect and ZIO, is in [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}); see also [IO]({{< ref "functional-programming/02-abstractions/monads" >}}#io) and [Option]({{< ref "functional-programming/02-abstractions/monads" >}}#option).

## Functional core, imperative shell


Some developers describe this technique as having a "functional core and imperative shell". The phrase comes from Gary Bernhardt's screencast of that name. The core holds the decisions as pure functions over plain data; the shell is a thin layer that reads input, calls the core, and performs whatever the core decided.

```scala
// core: pure, testable without mocks
def reorder(stock: Int, threshold: Int, batch: Int): Option[Int] =
  if stock < threshold then Some(batch) else None

// shell: all I/O happens here
def run(): Unit =
  val stock = inventory.read()
  reorder(stock, threshold = 10, batch = 50).foreach(orders.place)
```


*Grokking Functional Programming* argues for the same structure:

> We don't have to live with IO-based code spread all over our codebase. This would make our lives miserable. We will solve all three aforementioned problems by pushing the impurity out of most of our functions. This is the functional way.
>
> (Płachta 2022, ch. 8, "Can we really do better using FP?")

The three problems belong to an imperative `schedule` function that books a meeting through a calendar API:

1. It has two responsibilities: calling the APIs and finding a free slot.
2. Any failed API call makes the whole function fail with an exception.
3. Its signature lies: it promises a `MeetingTime` while it may throw or return `null`.

The chapter's functional version returns `IO[Option[MeetingTime]]`.

Code written with `IO` is already referentially transparent, because an `IO` value is only a description. The gain from pushing it to the edges is that the remaining functions take and return plain data: they can be tested with ordinary values and read without thinking about the outside world at all.

See also: [Substitution model and equational reasoning]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#substitution-model-and-equational-reasoning) for why referential transparency makes substitution valid, [IO]({{< ref "functional-programming/02-abstractions/monads" >}}#io) and [Option]({{< ref "functional-programming/02-abstractions/monads" >}}#option) for effect types, [Functions and composition]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}), and [Parse, don't validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) for pushing validation to the boundary. Also [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}) for `IO` and effect types in detail, and [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}) for organising the effectful shell.

## Library sources


- [Pilquist et al. 2023](/sources/075d81d6390bbb592aa1a8ba0a5f967d.bin), *Functional Programming in Scala (2nd edition)*: chapter 1 defines referential transparency and pure functions with the `StringBuilder` example; chapter 4 has the exception example; the chapters on external effects and I/O build an `IO` type step by step.
- [Rosien 2021](/sources/26d28e80e57cc7f4abab6120e2fa075d.bin), *Essential Effects*: the effect pattern checklist and Cats Effect.
- [Odersky et al. 2021](/sources/6d5d72f2cd796c67b467228f976d4a33.bin), *Programming in Scala (5th edition)*: source of the balanced-attitude box and the functional queue passage.
- [Nielson and Nielson 1999](/sources/7abd708cb67eaf6c1203211adf64c6a7.bin), *Type and Effect Systems*: effect systems in the programming-language sense.
- Płachta 2022, *Grokking Functional Programming*: chapter 2, Pure functions, is the source of the "passing copies of data" sentence (section "Passing copies of the data"), and chapter 3 covers immutable values and shared mutable state; chapter 8, IO as values, is the source of the passage under Functional core, imperative shell, and its "Functional architecture" section describes the functional core.
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell*: chapter 8, Working with the Local System, section "Procedural Shell, Functional Core": Haskell's name for the pattern, with IO kept at the edges of the program; on *Functional core, imperative shell*. Chapter 14, section "Internal Mutability with ST": a function that is pure from the outside but mutates state internally, using `ST` rather than `IO` or `unsafePerformIO`; on *A balanced attitude*.
- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional*: chapter 12, Persistence, section "Pushing Persistence to the Edges": pure functions make the decisions and are sandwiched between I/O steps, the functional core applied to databases; chapter 3, A Functional Architecture, section "Code Structure Within a Bounded Context": the onion architecture with dependencies pointing inward (naming hexagonal and clean architecture as relatives) and the rule to keep I/O at the edges of a workflow; on *Functional core, imperative shell*.
- [Cunningham 2022](/sources/03f5a1670784f5bcdf040f3e142fb3f3.bin), *Exploring Languages with Interpreters and Functional Programming, Chapter 8: Evaluation Model*: section 8.2, "Referential Transparency Revisited": within a context a variable always stands for the same value, so equals can be replaced by equals in both directions, and the mutable variables of imperative languages break this; on *Referential transparency*.
- Gibbons and de Moor 2003, *The Fun of Programming*: chapter 1, Okasaki, "Fun with binary heap trees": persistence by sharing (1.3), an amortised credit analysis of skew heaps (1.5), why reusing old versions breaks that bound, and how lazy evaluation with memoisation restores it (1.6, 1.7); chapter 2, section 2.3, notes that the two-list queue is amortised constant time only if never used persistently; on *Persistent data structures*.
- [Allen and Moronuki 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles*: section 29.6, Purity is losing meaning: referential transparency as replacing an expression with its value, and why a function returning `IO` stays referentially transparent (`gimmeShelter` returns the same `IO` "recipe" for the same argument); on *Referential transparency* and *Effect systems*.
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth*: chapter 1, sections 1.3, "Functional programs as sets of IO actions", and 1.4, "Embracing pure functions": a vocabulary program first written as a set of IO actions with one pure function, then rebuilt so that pure functions extract the vocabulary and format the reports and a thin IO driver only reads the file and prints; on *Functional core, imperative shell*. Section 5.3.2, "Mutable references in the ST monad", counts zeros with an `STRef` inside a pure function, and `runST`'s `forall s` stops the reference from escaping (revisited in section 11.5.2, "Use cases", as rank-2 polymorphism); on *Side effects*.
- [Serrano Mena 2021](/sources/4f6f84b5680da34841126999b31e2ed3.bin), *Book of Monads (2nd edition)*: sections 8.1, "Mutable References", and 8.1.1, "Keeping References Pure", on `ST` and `runST`, which allow mutation inside a block and return a pure value, while the type variable `s` keeps references from escaping, on the `ST` sentence in *Side effects*; the "Purity" paragraph of section 8.2, where a hypothetical `random :: a` makes `let r = random in r == r` differ from `random == random`, on *Where substitution breaks*.

Further reading:

- [Volpe 2021](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), *Practical FP in Scala (2nd edition)*
- [Vargas 2023](/sources/1f40f87f29d5d7e59178edbc1c0104fa.bin), *Why on earth a ZIO IO monad for Scala?*
- [Hughes 1990](/sources/a88f5c889d6f70309316ef0660f67635.bin), *Why Functional Programming Matters*
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling*
- [De Goes et al. 2025](/sources/4115845a430bc3f50ff12c191a45fd53.bin), *Zionomicon*
