---
draft: false
toc: true
title: "Evaluation and Laziness in Functional Programming"
aliases:
  - "/functional-programming/evaluation-and-laziness/"
description: "How functional programs are evaluated, from reduction, the substitution model and Church-Rosser to strict and non-strict semantics, thunks and sharing, space leaks, and call-by-name in Scala."
weight: "20"
linkTitle: "Evaluation and Laziness"
---

How functional programs are evaluated: reduction and the substitution model, the Church-Rosser property, strict and non-strict evaluation, thunks and sharing, the space leaks laziness can cause, and call-by-name in Scala.

## Reduction


A functional program has no statements. It is one large expression, and running it means *reduction*: rewriting the expression step by step until a value is left, much as you simplify `(2 + 3) * 4` to `5 * 4` and then to `20`. Each step simplifies one reducible expression, a *redex*, usually by replacing a function application with the function's body.

A definition such as `f x = x + 3` licenses one rewrite rule: an application `f e` can be rewritten to `e + 3`, for any expression `e`, not just a number. The rewrite is not a textual search-and-replace. Under lazy evaluation `e` is not evaluated before the rewrite, and if `e` is used several times its value is computed once and shared.

Caveats:

- Haskell code is full of things that look like statements: a `do` block reads like a sequence of commands. It is sugar for nested `>>=` applications, so it is still one expression.
- Reduction is a model, not what the machine literally does. GHC compiles to code for an abstract machine, the STG machine, that implements graph reduction: results are shared instead of expressions being copied.

## Substitution model and equational reasoning


Cunningham opens his chapter on the evaluation model with the question:

> How can we evaluate (i.e., execute) an expression that "calls" a function like the fact1 function from Chapter 4? We do this by rewriting expressions using a substitution model, as we see in this chapter.
>
> (Cunningham 2022, ch. 8, section 8.1, "Chapter Introduction")

The substitution model is the one SICP introduces in section 1.1.5: to apply a function, replace the call with the function's body, with each parameter replaced by the corresponding argument, then keep simplifying. It is valid only when evaluating an expression has no side effects. That is why it works for pure functional code and breaks for imperative code (see [Referential transparency]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#referential-transparency)).

In Haskell the equals sign in a definition means that the two sides are the same: you can substitute one for the other without changing the behaviour of the program.

> There are no statements, as in imperative languages; all computation is achieved purely by reducing expressions.

Using this to understand what an expression does is called *equational reasoning*.

Substitution and equational reasoning are often presented as tools that a lazy language, with immutable variables and explicit effects, makes available. More precisely:

- **Purity, not laziness, is what makes substitution valid.** A strict pure language, such as Standard ML without its references, supports equational reasoning too.
- **Laziness widens it.** In a strict language you can substitute an argument only once it is a value, because substituting an expression that diverges, or one that is never used, changes whether the program terminates. Under non-strict semantics, substitution is valid for any expression.
- **Plain substitution miscounts cost.** It treats every copy of an argument as separate, while a real lazy implementation evaluates it once and shares it. Once sharing is added (graph reduction), the model does measure cost: Bird (1998, section 7.1) counts time as reduction steps and space as the largest graph in the sequence, and Cunningham (2022, section 8.4) does the same.

Two qualifications for Haskell:

- A function defined by several clauses is not a set of independent equations. Clauses are tried top to bottom, so with overlapping patterns a clause holds only when the earlier ones didn't match.
- `seq` breaks some laws you might expect. `seq (\x -> undefined x) ()` returns `()`, while `seq undefined ()` fails, so a function and its eta-expansion are not interchangeable.

## Church-Rosser: the result doesn't depend on the reduction path


The fundamental theorem about reduction is the Church-Rosser theorem: every terminating reduction path gives the same result.

It is a theorem about the lambda calculus. If an expression can be reduced in two different ways, both results can be reduced further to a common expression. So an expression has at most one fully reduced form, its *normal form*. A companion result, the normalization theorem, says that always reducing the leftmost outermost redex first (normal order) reaches that normal form whenever one exists. Non-strict evaluation is built on that strategy, with two differences: Haskell never reduces under a lambda, so it stops at weak head normal form rather than full normal form, and call-by-need evaluates a shared argument once (Sestoft 2002, sections 4 and 5). See [Lambda calculus]({{< ref "functional-programming/01-foundations/lambda-calculus" >}}).

The usual consequences, with corrections:

- **Correctness doesn't depend on the order of evaluation**, but only for the value you get, not for whether you get one. `fst (1, loop)` returns `1` under normal order and never finishes if arguments are evaluated first.
- **The compiler or programmer can reorder evaluation freely without changing the result.** True of the result, but order changes cost: time and especially memory can differ enormously (see Costs of laziness below).
- **Different expressions can be evaluated in parallel without changing the result.** Pure code does make parallel execution *deterministic*.
- **Functional languages are therefore leading contenders for programming parallel systems.** This claim has aged badly. Automatic parallelisation of functional programs never worked out in practice. The hard part is deciding which work is large enough to be worth a parallel task, and laziness makes it harder to see when work happens at all. In GHC you mark parallelism explicitly, with `par` and `pseq`, evaluation strategies or the `Par` monad, as Marlow 2013 ([PDF](/sources/programming/functional-programming/marlow-2013-parallel-and-concurrent-programming-in-haskell.pdf.enc)) describes. See [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}).

## Strict and non-strict evaluation


In a language with *strict* evaluation, the arguments to a function are evaluated before the function is applied. Haskell instead has *non-strict* evaluation.

The benefit of strict evaluation is that it is easy to predict *when* and *in what order* things happen. Many strict languages also fix the order in which arguments are evaluated: Java, C#, JavaScript and Scala specify left to right. Not all do: C and C++ leave it unspecified, and so does OCaml, which in practice evaluates right to left.

From the Haskell Wiki page on non-strict semantics:

> An expression language is said to have *non-strict semantics* if expressions can have a value even if some of their subexpressions do not. Haskell is one of the few modern languages to have non-strict semantics by default: nearly every other language has [strict semantics](https://wiki.haskell.org/Strict_semantics "Strict semantics"), in which if any subexpression fails to have a value, the whole expression fails with it.

In denotational terms, write ⊥ ("bottom") for a computation that has no value because it loops or crashes. A function `f` is strict if `f ⊥ = ⊥`. Haskell's `const 1 undefined` is `1`, so `const` is non-strict in its second argument.

### Non-strict is not the same as lazy


> A common mistake people make is to say that Haskell is lazy when in fact it is non-strict.

Non-strictness is semantics: which expressions have values. Lazy evaluation (call-by-need) is one strategy for implementing it. The Haskell Report requires only non-strict semantics, so an implementation may evaluate something early whenever that can't change the result. GHC does this routinely: its strictness analysis finds arguments that will always be needed and evaluates them eagerly.

Pilquist et al. describe non-strictness as a property of individual functions:

> Nonstrictness is a property of a function. To say that a function is nonstrict just means the function may choose not to evaluate one or more of its arguments. In contrast, a strict function always evaluates its arguments. Strict functions are the norm in most programming languages, and indeed, most languages only support functions that expect their arguments fully evaluated.
>
> (Pilquist et al. 2023, chapter on strictness and laziness)

### Lazy evaluation


Lazy evaluation, or call-by-need, does not evaluate an expression until its first use, and then caches the result. Haskell uses it extensively. C and C++ are strict languages, and Scala is strict by default with explicit opt-in laziness.

Caveats on the usual way this is put:

- Strictness is about function arguments being evaluated before the call, not about an expression being evaluated "as soon as it is declared".
- Even C has non-strict constructs: `&&`, `||` and `?:` skip operands, and macros receive unevaluated code.
- Scala's laziness comes in three concrete forms: call-by-need with `lazy val`, call-by-name with `=> A` parameters (see Call-by-name in Scala below), and lazy collections such as `LazyList` and views.
- What separates call-by-need from call-by-name is the caching: the result is stored after the first use.

## Thunks, sharing and pattern matching


The CIS 194 lecture on laziness describes what lazy evaluation looks like:

> Under a lazy evaluation strategy, evaluation of function arguments is *delayed as long as possible*: they are not evaluated until it actually becomes necessary to do so. When some expression is given as an argument to a function, it is simply packaged up as an *unevaluated expression* (called a "thunk", don't ask me why) without doing any actual work.

And the Haskell Wiki:

> A **thunk** is a value that is yet to be evaluated. It is used in Haskell systems that implement [non-strict semantics](https://wiki.haskell.org/Non-strict_semantics "Non-strict semantics") by [lazy evaluation](https://wiki.haskell.org/Lazy_evaluation "Lazy evaluation").

The name goes back to 1961, when Peter Ingerman used it for the hidden procedures that implemented ALGOL 60's call-by-name parameters. A thunk holds the code for an expression plus the variables it refers to. When it is first forced, the runtime overwrites it with the result. That overwrite is the *sharing* that makes call-by-need cheaper than call-by-name: every later use reads the stored value.

### Pattern matching drives evaluation


CIS 194's slogan is "*pattern matching drives evaluation*":

> - Expressions are only evaluated when pattern-matched
> - ...only as far as necessary for the match to proceed, and no farther!

"As far as necessary" has a precise name: *weak head normal form* (WHNF), meaning evaluated until the outermost constructor or lambda is known. Matching `x : xs` exposes the first cons cell and leaves `x` and `xs` as thunks.

Caveat: pattern matching is the main trigger but not the only one. Evaluation is also forced by `seq`, by bang patterns, by built-in strict operations such as adding two `Int`s, and ultimately by the runtime running `main`. And not every pattern forces anything: a variable, a wildcard `_` or a lazy pattern `~p` matches without evaluating.

### What laziness makes possible


Laziness is what lets programs work with conceptually infinite data structures, and it is why people say that Haskell lets you write your own control structures: functions like `when`, `unless` or a custom `&&` are ordinary library functions, because their arguments are only evaluated if needed.

Laziness is also often named as one of the motivations for Haskell being a [pure](https://wiki.haskell.org/Pure "Pure") language. The causality ran the other way: in "Wearing the hair shirt" (2003), Simon Peyton Jones argues that laziness *kept* Haskell pure. When evaluation order is hard to predict, side effects hidden inside functions are unusable, so the designers could never take the shortcut of adding them. That pressure led to monadic I/O.

### Memoization through sharing


Sharing gives memoization for free. Rather than modelling imperative code inside `State`, compute an infinite list of Fibonacci numbers:

```haskell
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
```


Each list cell starts as a thunk. When a value is forced, the runtime overwrites the cell with its result, so asking for the same index again does not recompute it. The list acts as a memo table without any explicit state.

Caveat: the cache lives as long as something refers to the list. A top-level `fibs` is never garbage-collected, so asking for the millionth element keeps a million cells in memory for the rest of the program. It is a small, intentional space leak (see below).

### The Haskell heap


Edward Z. Yang's series on the Haskell heap pictures thunks as wrapped presents on a heap: forcing one means opening it, which may require opening others, and the opened contents replace the box. As he puts it:

> Understanding what happens when you open a present is key to understanding the time and space behavior of Haskell programs.

The series fills the gap the substitution model leaves: it shows sharing and memory use, which explain both why laziness can be fast and where space leaks come from.

- The Haskell Heap: <http://blog.ezyang.com/2011/04/the-haskell-heap/>
- Evaluation on the Haskell Heap: <http://blog.ezyang.com/2011/04/evaluation-on-the-haskell-heap/>
- IO evaluates the Haskell Heap: <http://blog.ezyang.com/2011/04/io-evaluates-the-haskell-heap/>
- Implementing the Haskell Heap in Python, v1: <http://blog.ezyang.com/2011/04/implementing-the-haskell-heap-in-python-v1/>
- Functions produce the Haskell Heap: <http://blog.ezyang.com/2011/04/functions-produce-the-haskell-heap/>
- How the Grinch stole the Haskell Heap: <http://blog.ezyang.com/2011/04/how-the-grinch-stole-the-haskell-heap/>

## Costs of laziness: space leaks


In Haskell the usual problem is a *space leak* rather than a classic memory leak: memory that the program will eventually free, but holds far longer, or in far larger amounts, than expected. Two causes dominate:

- **Unevaluated thunks piling up.** `foldl (+) 0 [1..n]` builds a chain of n pending additions before computing any of them (see `foldl'` in [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds)).
- **A thunk that keeps a large structure reachable** just because it might need it later.

Common fixes are strict accumulators (`foldl'`, bang patterns), strict data fields (`!` in a type definition, or the `StrictData` extension), and forcing values at known points.

### Bang patterns


Haskell offers several ways to force intermediate evaluation. A convenient one is the bang pattern, enabled by the `BangPatterns` extension: a bang pattern forces an argument when the function is called.

Caveat: a bang pattern forces only to weak head normal form. In `go !acc (x:xs)` with a pair as the accumulator, the pair constructor is evaluated but both components remain growing thunks. Each field needs its own strictness.

### Detecting space leaks


The main method is heap profiling. The tools work at different levels:

- `+RTS -s` reports total allocation and maximum residency.
- Heap profiling by closure type, `-hT`, works without a profiling build.
- Profiling by cost centre or by type, `-hc` and `-hy`, needs a profiling build.
- Info-table profiling, `-hi`, is available from GHC 9.2.
- `eventlog2html` renders the profiles.
- `ghc-debug` inspects the heap of a running process.
- `ghc-heap` is a low-level library for inspecting individual heap objects, not a diagnostic tool. GHC has no JVM-style heap dump.

Links:

- Haskell Wiki, "Memory leak": <https://wiki.haskell.org/Memory_leak>
- Stack Overflow, "Haskell: how to detect lazy memory leaks", on detection with heap profiling: <https://stackoverflow.com/questions/61666819/haskell-how-to-detect-lazy-memory-leaks>
- [ ] Expand this section along the outline of a Discourse discussion of space leaks: the problem, symptoms, tools, methods, and best practices for avoiding them.

## Call-by-name in Scala


A by-name parameter `x: => Long` is passed as an unevaluated expression, compiled to a function with no arguments. It *delays* evaluation until the parameter is used, and every mention of `x` in the body evaluates it again:

```scala
def calledByName(x: => Long): Unit =
  println("by name: " + x)
  println("by name: " + x)

calledByName(System.nanoTime())   // prints two different numbers
```


Here the argument is evaluated twice, so `System.nanoTime()` gives two different values, and an argument with a side effect performs it twice.

### By-name versus by-value parameters


- A by-value parameter (`x: Long`) is evaluated exactly once, before the call.
- A by-name parameter (`x: => Long`) is evaluated each time the body uses it: zero, one or many times.

Use by-name for things the callee may not need or must control: default values, conditions, log messages, retries and custom control structures.

### Where by-name is useful


- **Lazy streams**, with a qualification. By-name alone would recompute the rest of the stream on every access. `LazyList` takes its tail by name and immediately stores it in a `lazy val`, which turns it into call-by-need. See [Streams]({{< ref "functional-programming/03-building-programs/streams" >}}).
- **Things that can fail**, or more generally APIs that decide whether and when to evaluate their argument. `Try(expr)` and `Future(expr)` evaluate it inside an exception handler or on another thread; `opt.getOrElse(default)` builds `default` only when it is needed; `require(cond, message)` builds the message only when the check fails.
- Rock the JVM, "3 tricks for CBN": <https://blog.rockthejvm.com/3-tricks-for-CBN/>

### Call-by-name is not lazy evaluation


Call-by-name and lazy evaluation are related but not the same. Call-by-name evaluates the argument each time it is used; lazy evaluation evaluates it once and caches the result. To get call-by-need inside a Scala method, assign the by-name parameter to a local `lazy val` and use that:

```scala
def twiceLazily(x: => Long): Unit =
  lazy val v = x       // evaluated at most once, on first use
  println("lazy: " + v)
  println("lazy: " + v)  // same number as the line above
```


Sources for the distinction (tpolecat's post is the most careful of the three):

- Stack Overflow, "Call-by-name in Scala vs lazy evaluation in Haskell": <https://stackoverflow.com/questions/41785985/call-by-name-in-scala-vs-lazy-evaluation-in-haskell>
- GeeksforGeeks, "Scala lazy evaluation": <https://www.geeksforgeeks.org/scala-lazy-evaluation/>
- tpolecat, "Call-by-name" (2014): <https://tpolecat.github.io/2014/06/26/call-by-name.html>

## Working through an evaluation by hand


When a function is unclear, or you can't fully see what it is doing, write out its evaluation step by step: one rewrite step per line, with each thunk marked explicitly instead of evaluating arguments up front.

*Real World Haskell* does this for its `myDrop` function:

> In our description of `myDrop`, we have so far focused on surface features. We need to go deeper, and develop _a useful mental model_ of how function application works. To do this, we'll first work through a few simple examples, until we can walk through the evaluation of the expression `myDrop 2 "abcd"`.
>
> (*Real World Haskell*, chapter 2, "Types and functions")

```haskell
myDrop :: Int -> [a] -> [a]
myDrop n xs = if n <= 0 || null xs
              then xs
              else myDrop (n - 1) (tail xs)
```


A hand evaluation in that style, showing lazy evaluation of `if` and `||` along the way:

```
myDrop 2 "abcd"
= if 2 <= 0 || null "abcd" then "abcd" else myDrop (2 - 1) (tail "abcd")
= if False || False then ... else ...        -- both tests evaluated
= myDrop (2 - 1) (tail "abcd")               -- arguments passed as thunks
= if (2 - 1) <= 0 || null (tail "abcd") then ...
                                             -- forces 2 - 1 = 1 and tail "abcd" = "bcd"
= myDrop (1 - 1) (tail "bcd")
= if (1 - 1) <= 0 || null (tail "bcd") then tail "bcd" else ...
                                             -- 0 <= 0 is True, so || never evaluates null
= tail "bcd"
= "cd"
```

## Further links


Substitution and the evaluation model:

- gilmi, "Substitution and equational reasoning" (2020): <https://gilmi.me/blog/post/2020/10/01/substitution-and-equational-reasoning>
- Cunningham, *Exploring Languages with Interpreters and Functional Programming*, chapter 8, Evaluation Model, HTML: <https://john.cs.olemiss.edu/~hcc/csci450/ELIFP/Ch08/08_Evaluation_Model.html>
- The same chapter as PDF: <https://john.cs.olemiss.edu/~hcc/docs/ELIFP/Ch08/08_Evaluation_Model.pdf> ([PDF](/sources/programming/functional-programming/cunningham-2022-exploring-languages-ch08-evaluation-model.pdf.enc))
- *Real World Haskell*, chapter 2, Types and functions: <https://book.realworldhaskell.org/read/types-and-functions.html>

Laziness, thunks and `seq`:

- Haskell Wiki, "Thunk": <https://wiki.haskell.org/Thunk>
- Haskell Wiki, "Non-strict semantics": <https://wiki.haskell.org/Non-strict_semantics>
- Stack Overflow, "What does seq actually do in Haskell?": <https://stackoverflow.com/questions/66943741/what-does-seq-actually-do-in-haskell>
- CIS 194 (spring 2013), lecture 6, laziness: <https://www.seas.upenn.edu/~cis1940/spring13/lectures/06-laziness.html>
- Video on laziness: <https://www.youtube.com/watch?v=fSqE-HSh_NU>
- Controlling evaluation, chapter 11 of Serrano Mena's library book ([PDF](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc))

See also: [Lambda calculus]({{< ref "functional-programming/01-foundations/lambda-calculus" >}}) for reduction and normal forms, [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds) for `foldl'` and `seq`, [Referential transparency]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#referential-transparency), and the [FP study log]({{< ref "functional-programming/05-practice/study-log" >}}) entries on bang patterns and the worker-wrapper construct (29.11.23). Also [Streams]({{< ref "functional-programming/03-building-programs/streams" >}}) for `LazyList` and effectful streams, and [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}) for parallelism in practice.

## Library sources


- [Cunningham 2022](/sources/programming/functional-programming/cunningham-2022-exploring-languages-ch08-evaluation-model.pdf.enc), *Exploring Languages with Interpreters and Functional Programming, Chapter 8: Evaluation Model*: section 8.1 is the passage quoted under Substitution model; section 8.3, "Substitution Model", classifies redexes as leftmost or rightmost and innermost or outermost, reduces `fact1 2` one annotated step at a time, then redoes it as graph reduction, where the shared `2-1` is reduced once instead of three times; section 8.4 takes reduction steps as time and the largest expression as space; section 8.7 asks for hand reductions of `fib 4` and `fact6 2`; on *Substitution model and equational reasoning*, *Reduction* and *Working through an evaluation by hand*.
- [Takenobu 2016](/sources/programming/functional-programming/takenobu-2016-lazy-evaluation-illustrated-for-haskell.pdf.enc), *Lazy evaluation illustrated for Haskell divers*: section 2, "WHNF" (slides 38-50), defines WHNF, HNF and NF with examples; section 3, "Thunk" (slides 67-71), draws a thunk as code plus free variables, and slide 158 shows it overwritten by its value; section 4, "Evaluation in Haskell (GHC)" (slides 100-104), shows pattern matching driving evaluation and stopping at WHNF, and "Controlling the evaluation" (slides 130-143) lists what forces it: primitive operations, `foldl'`, `seq` and `$!` (to WHNF), `deepseq` and `force` (to NF), bang patterns, strictness flags and `-O`; section 5 covers lazy graph reduction and the STG machine (slides 145-162); section 6 covers bottom and strict functions (slides 164-181) and GHC's strictness analysis (slides 193-200); on *Thunks, sharing and pattern matching*, *Pattern matching drives evaluation*, *Bang patterns*, *Strict and non-strict evaluation*, *Non-strict is not the same as lazy* and the STG caveat under *Reduction*.
- [Abelson et al. 2022](/sources/programming/language-theory/abelson-2022-sicp-javascript-edition.pdf.enc), *Structure and Interpretation of Computer Programs, JavaScript Edition*: the substitution model, section 1.1.5.
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: the chapter on strictness and laziness, source of the nonstrictness passage.
- [Marlow 2013](/sources/programming/functional-programming/marlow-2013-parallel-and-concurrent-programming-in-haskell.pdf.enc), *Parallel and Concurrent Programming in Haskell*: the Part I introduction (why fully automatic parallelisation still fails, granularity, data dependencies), on the parallelism claims under *Church-Rosser*; chapter 2, "Lazy Evaluation and Weak Head Normal Form", which uses GHCi's `:sprint` to show thunks, sharing in a pair `(x, x)` and `seq` evaluating to WHNF, with a footnote that Haskell is non-strict and lazy evaluation is one implementation strategy; on *Thunks, sharing and pattern matching* and *Non-strict is not the same as lazy*.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 2, Working with Lists, section "Understanding How Programs Are Evaluated", explains call by need and thunks, and steps `findFirst (> 2)` through a list whose tail is a `<thunk>`, one rewrite per line; "Hands-On with Infinite Fibonacci Numbers" does the same for `fibs = 0 : 1 : helper fibs (tail fibs)`; on *Working through an evaluation by hand*. Chapter 10, section "Dealing with Laziness and IO", finds a space leak in a small metrics program from the maximum residency in `+RTS -s` ("Understanding Space Leaks"). It draws thunks as heap objects with a header, code and payload ("Thunks and Evaluation in Haskell Programs"), and fixes the leak with `modifyIORef'`, `seq`, `$!` and bang patterns. It then shows that forcing a `FileStats` wrapper leaves the map inside it a thunk until the field itself is strict; on *The Haskell heap*, *Bang patterns* and *Detecting space leaks*. Chapter 14, section "Memoizing editDistance", memoizes edit distance with a lazy list of lists of thunks. It warns that a top-level cache is never garbage-collected and that let floating can keep a cache alive (`-fno-full-laziness`); on *Memoization through sharing*.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 9, Haskell data and code at run time: how thunks and closures are laid out in memory (9.1), and controlling strictness with `seq` and bang patterns on an accumulating loop (9.2.1); on Thunks and Costs of laziness. Chapter 10, Benchmarking and profiling, sections 10.2.2, "Analyzing execution time and memory allocation", and 10.2.3, "Analyzing memory usage": `+RTS -s` for allocation and maximum residency, profiling builds with `-prof` or `--enable-profiling`, and `+RTS -h` heap profiles; on *Detecting space leaks*.
- Bird 1998, *Introduction to Functional Programming using Haskell (2nd edition)*: section 1.2, "Evaluation", treats a definition as a left-to-right rewrite rule, reduces `square (3 + 4)` two ways to the same result, and shows that `three infinity` terminates only if `three` is reduced first; section 1.3, "Values", introduces ⊥ and defines a strict function by f ⊥ = ⊥; section 7.1, "Lazy evaluation", compares innermost and outermost reduction, shows that outermost reduction on trees duplicates work and that graphs share it, and defines lazy evaluation as outermost graph reduction; on *Reduction*, *Church-Rosser*, *Strict and non-strict evaluation* and the cost bullet under *Substitution model and equational reasoning*. Section 7.5, "Controlling space", shows `foldl (+) 0` growing an expression of size n and fixes it with a strict fold; section 7.5.1 shows that a pair accumulator is already in head-normal form (Bird's name for what the note calls WHNF), so its components must be forced separately; section 7.6.1 finds a quadratic space leak in quicksort, where a pair from `partition` stays reachable until its second half is used; on *Costs of laziness: space leaks* and *Bang patterns*. Section 9.4, "Cyclic structures", shows `ones = 1 : ones` as a constant-size cyclic graph and gives a self-referential `iterate` and the Hamming numbers in O(n) steps where the non-sharing versions take Θ(n²) (exercise 9.3.2 is the `fibs` definition); section 7.1 also notes that a top-level list such as `numbers = [1 .. 1000]` stays in memory once evaluated; on *Memoization through sharing* and its caveat.
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: chapter 27, Non-strictness: section 27.2 (the "Standards and obligations" box: the Report requires only non-strictness, not laziness), 27.5 (call by value, call by name, call by need), 27.7 and 27.8 (thunks, `:sprint`, what promotes and what prevents sharing), 27.9 (lazy patterns with `~`), 27.10 and 27.11 (bang patterns in functions and data, `Strict` and `StrictData`, "lazy in the spine, strict in the leaves"); section 9.8 defines WHNF against normal form; on *Non-strict is not the same as lazy*, *Lazy evaluation*, *Thunks, sharing and pattern matching*, *Pattern matching drives evaluation* and *Bang patterns*.
- [Sestoft 2002](/sources/programming/functional-programming/sestoft-2002-demonstrating-lambda-calculus-reduction.pdf.enc), *Demonstrating Lambda Calculus Reduction*: section 4, "Functional Programming Languages", and section 6, "Normal Forms" (Fig. 1): functional languages don't reduce under lambdas, so call-by-name stops at weak head normal form and call-by-value at weak normal form; section 5, "Lazy Functional Programming Languages": call-by-need is call-by-name with shared argument evaluation, and modelling its sharing and cyclic data needs graph reduction or an explicit heap rather than substitution; on *Reduction*, the cost bullet under *Substitution model and equational reasoning*, and weak head normal form under *Pattern matching drives evaluation*.
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: section 4, "Gluing Programs Together": lazy evaluation lets a generator of infinitely many answers be composed with a selector, separating termination conditions from loop bodies, and Hughes argues that lazy evaluation and side effects cannot coexist because laziness gives up control over when each part runs; on *What laziness makes possible*, including the paragraph on laziness keeping Haskell pure.
- [Serrano Mena 2022](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc), *Haskell: Almost Standard Libraries*: chapter 11, Controlling evaluation: the opening traces sharing in `let x = expensiveComputation in x * x`; section 11.1, "Forcing evaluation", forces values with pattern matching, `seq` and bang patterns, and 11.1.1 explains WHNF as the form a GHC Core `case` needs; section 11.2, "Strict and lazy containers", shows insertions piling up thunks until the first lookup, and `Data.Map.Strict`; section 11.3, "Deep evaluation", covers `deepseq` and `NFData`, with the advice to profile first; on *Thunks, sharing and pattern matching*, *Pattern matching drives evaluation*, *Bang patterns* and *Costs of laziness: space leaks*.

Further reading:

- Chiusano et al. 2013, *Functional Programming in Scala (MEAP version 10)*
- Płachta 2022, *Grokking Functional Programming*
