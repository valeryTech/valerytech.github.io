---
draft: false
toc: true
title: "Pure Functions And Effects"
linkTitle: "Pure Functions And Effects"
---

Purity, referential transparency, side effects and immutability, and the effect systems that keep effects visible in types and separate from pure code.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Referential transparency


-> we can replace an expression with its value as many times as we want without changing behaviour

core tenet to FP

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
An expression is referentially transparent when every occurrence of it can be replaced by its value without changing what the program does. With `def square(x: Int) = x * x`, any `square(3)` in the program can become `9`. Because each part means just its value, you can understand a program piece by piece and rewrite it like algebra (see [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#substitution-model-and-equational-reasoning)).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The replacement works in both directions, and the reverse direction is where impure code usually breaks. Naming an expression with a `val` and reusing the name should be the same as writing the expression out twice. For `val x = readLine()` it isn't: `x + x` reads one line, `readLine() + readLine()` reads two.
{{< /callout >}}


Absence of side effects is a necessary, but not sufficient, condition for referential transparency. Referential transparency means that an expression (such as a function call) can be replaced with its value. This requires that the expression is [pure](https://en.wikipedia.org/wiki/Pure_function "Pure function"), that is to say the expression must be [deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm "Deterministic algorithm") (always give the same [value](https://en.wikipedia.org/wiki/Value_(computer_science) "Value (computer science)") for the same input) and side-effect free.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"Not sufficient" means a function can change nothing and still not be referentially transparent, because it *reads* changing state. With `var rate = 2` and `def scale(x: Int) = x * rate`, `scale` writes nothing, but `scale(3)` is `6` now and `30` after `rate = 10`, so it can't be replaced by one value. A pure function needs both: no writes to the outside (no side effects) and no reads of anything except its arguments (determinism).
{{< /callout >}}


in pure programs it works, but in impure substituion is broken

examples: print to console and changing variable

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The two standard counterexamples, in Scala:

```scala
// printing
val x = { println("hi"); 1 }
x + x                                          // prints "hi" once
{ println("hi"); 1 } + { println("hi"); 1 }    // prints "hi" twice

// changing a variable (the StringBuilder example from Functional Programming in Scala, chapter 1)
val sb = new StringBuilder("Hello")
val y  = sb.append(", World")
val r1 = y.toString   // "Hello, World"
val r2 = y.toString   // "Hello, World"
// substitute y with its definition:
val s1 = sb.append(", World").toString  // "Hello, World, World"
val s2 = sb.append(", World").toString  // "Hello, World, World, World"
```

In both cases the program with the substitution behaves differently from the original, so the expressions aren't referentially transparent.
{{< /callout >}}

## Side effects


An operation, function or expression is said to have a side effect if it modifies some state variable value(s) outside its *local environment*, which is to say if it has any observable effect other than its *primary effect of returning a value* to the invoker of the operation. Example side effects include modifying a non-local variable, modifying a static local variable, modifying a mutable argument passed by reference, performing I/O or calling other functions with side-effects.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Observable" carries most of the weight. Mutation that nobody outside can see doesn't count: a function may build its result in a local mutable buffer, or cache results internally, and still be pure from the caller's side. Haskell's `ST` monad makes that guarantee checkable by the type system. The list also leaves out throwing an exception, which breaks referential transparency too. In the example from chapter 4 of *Functional Programming in Scala*, `val y: Int = throw new Exception("fail!")` followed by `try { 42 + y } catch { case _: Exception => 43 }` throws, but writing the `throw` in place of `y` inside the `try` returns `43`.
{{< /callout >}}


Side effects

**A BALANCED ATTITUDE FOR SCALA PROGRAMMERS**

Prefer vals, immutable objects, and methods without side effects. Reach for them first. Use vars, mutable objects, and methods with side effects when you have a specific need and justification for them.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This box is from *Programming in Scala* (Odersky, Spoon, Venners and Sommers; see Library sources). It describes Scala's position: the language doesn't forbid mutation, it makes the immutable choice the default you reach for and the mutable one an exception you justify. Typical justified cases are a local `var` in a performance-critical loop that doesn't escape the method, and mutable builders used inside a function that returns an immutable result.
{{< /callout >}}

## Immutability and functional methods


This may not seem like a big change but passing copies of data is one of the fundamental things done in functional programming!

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The "change" isn't recorded here; from the wording it is a function that, instead of modifying the data it receives, returns a modified copy. Callers keep their original, so a function can't break data someone else is still using.
{{< /callout >}}

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The sentence is from chapter 2 of *Grokking Functional Programming* (Płachta), section "Passing copies of the data". The change there is to a Java `ShoppingCart` class: `getItems` returns `new ArrayList<>(items)` instead of the internal list, so a caller that modifies the returned list can no longer corrupt the cart's state.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Copies" is the mental model, not what usually happens in memory. Immutable collections share structure between versions, so the "copy" is often a few new nodes (see [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#immutability-and-functional-methods)).
{{< /callout >}}


What is functional method?

All the methods on a `Sec` are functional, meaning that they *don't mutate the existing sequence* but instead return a new value when they're applied.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A functional method is one whose result depends only on its arguments and on the (immutable) object it is called on, and which changes nothing. `xs.appended(4)` or `xs :+ 4` returns a new sequence and leaves `xs` as it was. The mutable counterpart, `buffer += 4` on an `ArrayBuffer`, changes the buffer and returns it.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`Sec` is presumably `Seq`. The claim depends on which `Seq`: `scala.collection.mutable.Seq` has an `update` method that changes it in place. Since Scala 2.13 the default `Seq` is `scala.collection.immutable.Seq`; in 2.12 and earlier the default was `scala.collection.Seq`, which could be a mutable sequence.
{{< /callout >}}


But in Scala's "functional objects" approach, you can access value implicitly. Technically this violates my rule that for pure functions, "Output depends only on input," but when you use the functional objects coding style, this is the one case where you are allowed to implicitly access other fields in a function in your class.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
It isn't really an exception to "output depends only on input". The object the method is called on is an input, passed implicitly as `this`. A method `r.add(s)` on an immutable `Rational` is a pure function of `r` and `s`, just as `add(r, s)` would be. The rule only breaks if a field the method reads can change, that is if it is a `var` or refers to a mutable object.
{{< /callout >}}


**Copy and Return Function Style** #todo rewrite

you should write ?all functions in manner: don't mutate the arguments, just copy it with changes and return new changed copy.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A possible rewrite of the todo: "Copy and return: a function never changes its arguments; when it needs a changed version, it builds a copy with the changes and returns that." In Scala, case classes generate a `copy` method for exactly this:

```scala
final case class Account(owner: String, balance: BigDecimal)

def deposit(acc: Account, amount: BigDecimal): Account =
acc.copy(balance = acc.balance + amount)   // acc itself is unchanged
```
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The "?all" doubt is justified. The rule is about what callers can observe: a function may mutate local data it created itself, as long as none of it escapes. And "copy" sounds expensive, but immutable collections rarely copy everything. They are persistent (see the next fragment): a new version shares most of its structure with the old one, so `x :: xs` or updating one key in an immutable `Map` costs little.
{{< /callout >}}


Purely functional queues also have some similarity with lists. Both are so called *fully persistent* data structures, where old versions remain available even after extensions or modifications.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The passage is from the chapter on type parameterization in *Programming in Scala*, which builds a functional queue from two lists. "Persistent" means an update produces a new version and the old version keeps working. Prepending to a list shows how this stays cheap: `val ys = 0 :: xs` creates one new cell that points at `xs`, and both lists share the rest.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The two-list queue has a subtlety that persistence exposes. Its constant-time cost is amortized: an occasional expensive reversal is paid for by many cheap operations before it. If old versions are reused, the same expensive reversal can be triggered again and again from one old version, and the amortized bound no longer holds. Chris Okasaki's *Purely Functional Data Structures* treats this problem and shows how laziness restores the bounds.
{{< /callout >}}

## Effect systems


Moved to [Effect Systems]({{< ref "functional-programming/effect-systems" >}}).

## Functional core, imperative shell


Some developers describe this technique as having

a "functional core and imperative shell."

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The phrase comes from Gary Bernhardt's screencast of that name. The core holds the decisions as pure functions over plain data; the shell is a thin layer that reads input, calls the core, and performs whatever the core decided. A small Scala example:

```scala
// core: pure, testable without mocks
def reorder(stock: Int, threshold: Int, batch: Int): Option[Int] =
if (stock < threshold) Some(batch) else None

// shell: all I/O happens here
def run(): Unit = {
val stock = inventory.read()
reorder(stock, threshold = 10, batch = 50).foreach(orders.place)
}
```
{{< /callout >}}


We don't have to live with IO-based code spread all over our codebase. This would make our lives miserable. We will solve all three aforementioned problems by pushing the impurity out of most of our functions. This is the functional way.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The "three aforementioned problems" aren't recorded here, so the passage has lost its context. Note also that code written with `IO` is already referentially transparent, because an `IO` value is only a description. The gain from pushing it to the edges is that the remaining functions take and return plain data: they can be tested with ordinary values and read without thinking about the outside world at all.
{{< /callout >}}

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The passage is from chapter 8 of *Grokking Functional Programming* (Płachta), section "Can we really do better using FP?". The three problems belong to an imperative `schedule` function that books a meeting through a calendar API: it has two responsibilities (calling the APIs and finding a free slot), any failed API call makes the whole function fail with an exception, and its signature lies, promising a `MeetingTime` while it may throw or return `null`. The chapter's functional version returns `IO[Option[MeetingTime]]`.
{{< /callout >}}


See also: [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#substitution-model-and-equational-reasoning) for why referential transparency makes substitution valid, [Monads]({{< ref "functional-programming/monads" >}}#io) and [Monads]({{< ref "functional-programming/monads" >}}#option) for effect types, [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}), and [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) for pushing validation to the boundary. Also [Effect Systems]({{< ref "functional-programming/effect-systems" >}}) for `IO` and effect types in detail, and [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) for organising the effectful shell.

## Library sources


- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: chapter 1 defines referential transparency and pure functions with the `StringBuilder` example; the chapters on external effects and I/O build an `IO` type step by step.
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*: the effect pattern checklist and Cats Effect.
- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala (5th edition)*: source of the balanced-attitude box and the functional queue passage.
- [Nielson and Nielson 1999](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc), *Type and Effect Systems*: effect systems in the programming-language sense of the Wikipedia quote.
- Płachta 2022, *Grokking Functional Programming*: chapter 2, Pure functions, is the source of the "passing copies of data" sentence (section "Passing copies of the data"), and chapter 3 covers immutable values and shared mutable state; chapter 8, IO as values, is the source of the passage under Functional core, imperative shell, and its "Functional architecture" section describes the functional core.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 8, Working with the Local System, presents "Procedural Shell, Functional Core" as the way to structure a Haskell program around `IO`.
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*: chapter 12, Persistence, section "Pushing Persistence to the Edges": pure functions make the decisions and are sandwiched between I/O steps, the functional core applied to databases.

Further reading:

- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*
- [Vargas 2023](/sources/programming/scala/vargas-2023-why-on-earth-a-zio-io-monad.pdf.enc), *Why on earth a ZIO IO monad for Scala?*
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*
