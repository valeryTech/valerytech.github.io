---
draft: false
toc: true
title: "Evaluation And Laziness"
linkTitle: "Evaluation And Laziness"
---

How functional programs are evaluated: reduction and the substitution model, the Church-Rosser property, strict and non-strict evaluation, thunks and sharing, the space leaks laziness can cause, and call-by-name in Scala.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Reduction


- Functional programs don't have statements!
- The mechanism for executing functional programs is *reduction*.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A functional program is one large expression. Running it means rewriting that expression step by step until a value is left, much as you simplify `(2 + 3) * 4` to `5 * 4` and then to `20`. Each step replaces a function application with the function's body.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Both claims hold for the core language, but Haskell code is full of things that look like statements: a `do` block reads like a sequence of commands. It is sugar for nested `>>=` applications, so it is still one expression. Reduction is also a model, not what the machine literally does. GHC compiles to code for an abstract machine (the STG machine) that implements graph reduction, sharing results instead of copying expressions.
{{< /callout >}}


Reduction is the process of converting an expression to a simpler form. Conceptually, an expression is reduced by simplifying one reducible expression (called "redex") at a time.

Similarly, evaluating the code `f x = x + 3` replaces all occurrences of `f` followed by a number (f's argument) with that number plus three.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The argument doesn't have to be a number, and the rewrite isn't textual search-and-replace. The definition licenses one rule: an application `f e` can be rewritten to `e + 3` for any expression `e`. Under lazy evaluation `e` isn't evaluated before the rewrite, and if `e` is used several times its value is computed once and shared.
{{< /callout >}}

## Substitution model and equational reasoning


The Substitution Model of Evaluation

How can we evaluate (i.e., execute) an expression that "calls" a function like the fact1 function from Chapter 4? We do this by rewriting expressions using a substitution model, as we see in this

chapter.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The passage is from chapter 8 of Cunningham's *Exploring Languages with Interpreters and Functional Programming* (see Reading). The substitution model is the one SICP introduces in section 1.1.5: to apply a function, replace the call with the function's body, with each parameter replaced by the corresponding argument, then keep simplifying. It is valid only when evaluating an expression has no side effects. That is why it works for pure functional code and breaks for imperative code.
{{< /callout >}}


In a lazy functional language where variables are immutable and effects are explicit, new powerful tools for understanding what programs mean become available - substitution and equational reasoning.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Purity, not laziness, is what makes substitution valid; a strict pure language such as Standard ML without its references supports equational reasoning too. Laziness widens it. In a strict language you can only substitute an argument once it is a value, because substituting an expression that diverges, or one that is never used, changes whether the program terminates. Under non-strict semantics, substitution is valid for any expression. Either way, the substitution model says nothing about cost: it treats every copy of an argument as separate, while a real lazy implementation evaluates it once and shares it.
{{< /callout >}}


In Haskell, when we write the equals sign (`=`) what we mean is that the two sides in this context are the same, and we can substitute one for another keeping the same behaviour of the program.
> There are no statements, as in imperative languages; all computation is achieved purely by reducing expressions.
This is useful when you want to understand the behaviour of an expression, and is often called 'applying equational reasoning'.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Two qualifications. A function defined by several clauses is not a set of independent equations: clauses are tried top to bottom, so with overlapping patterns a single clause holds only when the earlier ones didn't match. And `seq` breaks some laws you might expect: `seq (\x -> undefined x) ()` returns `()`, while `seq undefined ()` fails, so a function and its eta-expansion are not interchangeable.
{{< /callout >}}

## Church-Rosser: the result doesn't depend on the reduction path


**Properties of reduction**
> The result doesn't depend on reduction path!
A fundamental theorem (the Church-Rosser theorem):
> Every terminating reduction path gives the same result
>

{{< callout context="note" title="This means that" icon="outline/info-circle" >}}
- Correctness doesn't depend on order of evaluation.
- The compiler (or programmer) can change the order freely to improve performance, without affecting the result.
- Different expressions can be evaluated in parallel, without affecting the result.
- As a result, functional languages are leading contenders for programming future parallel systems.
{{< /callout >}}

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The theorem is about the lambda calculus. If an expression can be reduced in two different ways, both results can be reduced further to a common expression. So an expression has at most one fully reduced form, its normal form. A companion result, the normalization theorem, says that always reducing the leftmost outermost redex first (normal order) reaches that normal form whenever one exists. Non-strict evaluation is built on that strategy. See [Lambda Calculus]({{< ref "functional-programming/lambda-calculus" >}}).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Correctness doesn't depend on order" holds for the value you get, not for whether you get one. `fst (1, loop)` returns `1` under normal order and never finishes if arguments are evaluated first. Order also changes cost: time and especially memory can differ enormously (see Costs of laziness below).

The parallelism claim has aged badly. Pure code does make parallel execution *deterministic*, but automatic parallelisation of functional programs never worked out in practice. The hard part is deciding which work is large enough to be worth a parallel task, and laziness makes it harder to see when work happens at all. In GHC you mark parallelism explicitly with `par` and `pseq`, evaluation strategies or the `Par` monad, as Marlow's book describes (see Library sources).
{{< /callout >}}

## Strict and non-strict evaluation


In a language that uses *strict* evaluation, the arguments to a function are evaluated before the function is applied. Haskell chooses another path: *non-strict* evaluation.

The benefit of strict evaluation is that it is easy to predict *when* and *in what order* things will happen. Usually languages with strict evaluation will even specify the order in which function arguments should be evaluated (*e.g.* from left to right).

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Usually" is too strong. C and C++ leave the order in which arguments are evaluated unspecified, and so does OCaml, which in practice evaluates right to left. Java, C#, JavaScript and Scala do specify left to right.
{{< /callout >}}


An expression language is said to have *non-strict semantics* if expressions can have a value even if some of their subexpressions do not. Haskell is one of the few modern languages to have non-strict semantics by default: nearly every other language has [strict semantics](https://wiki.haskell.org/Strict_semantics "Strict semantics"), in which if any subexpression fails to have a value, the whole expression fails with it.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In denotational terms, write ⊥ ("bottom") for a computation that has no value because it loops or crashes. A function `f` is strict if `f ⊥ = ⊥`. Haskell's `const 1 undefined` is `1`, so `const` is non-strict in its second argument.
{{< /callout >}}


> A common mistake people make is to say that Haskell is lazy when in fact it is non-strict.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Non-strictness is semantics: which expressions have values. Lazy evaluation (call-by-need) is one strategy for implementing it. The Haskell Report requires only non-strict semantics, so an implementation may evaluate something early whenever that can't change the result. GHC does this routinely: its strictness analysis finds arguments that will always be needed and evaluates them eagerly.
{{< /callout >}}


Nonstrictness is a property of a function. To say that a function is nonstrict just means the function may choose not to evaluate one or more of its arguments. In contrast, a strict function always evaluates its arguments. Strict functions are the norm in most programming languages, and indeed, most languages only support functions that expect their arguments fully evaluated.

Lazy evaluation or call-by-need is a evaluation strategy where an expression isn't evaluated until its first use i.e to postpone the evaluation till its demanded. Functional programming languages like **Haskell** use this strategy extensively. **C, C++** are called *strict languages* who evaluate the expression as soon as it's declared. Then there are languages like Scala who are strict by default but can be lazy if specified explicitly i.e. of mixed type.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Evaluate the expression as soon as it's declared" is imprecise. Strictness is about function arguments being evaluated before the call. Even C has non-strict constructs: `&&`, `||` and `?:` skip operands, and macros receive unevaluated code. "Mixed type" is informal. Concretely, Scala gives you call-by-need with `lazy val`, call-by-name with `=> A` parameters (see below), and lazy collections such as `LazyList` and views. The definition also omits what separates call-by-need from call-by-name: the result is cached after first use.
{{< /callout >}}

## Thunks, sharing and pattern matching


cis194

So now that we understand strict evaluation, let's see what lazy evaluation actually looks like. Under a lazy evaluation strategy, evaluation of function arguments is *delayed as long as possible*: they are not evaluated until it actually becomes necessary to do so. When some expression is given as an argument to a function, it is simply packaged up as an *unevaluated expression* (called a "thunk", don't ask me why) without doing any actual work.

A **thunk** is a value that is yet to be evaluated. It is used in Haskell systems that implement [non-strict semantics](https://wiki.haskell.org/Non-strict_semantics "Non-strict semantics") by [lazy evaluation](https://wiki.haskell.org/Lazy_evaluation "Lazy evaluation").

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The name goes back to 1961, when Peter Ingerman used it for the hidden procedures that implemented ALGOL 60's call-by-name parameters. A thunk holds the code for an expression plus the variables it refers to. When it is first forced, the runtime overwrites it with the result. That overwrite is the sharing that makes call-by-need cheaper than call-by-name: every later use reads the stored value.
{{< /callout >}}


The slogan to remember is "*pattern matching drives evaluation*". To reiterate the important points:

- Expressions are only evaluated when pattern-matched
- ...only as far as necessary for the match to proceed, and no farther!

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Pattern matching is the main trigger but not the only one. Evaluation is also forced by `seq`, by bang patterns, by built-in strict operations such as adding two `Int`s, and ultimately by the runtime running `main`. Not every pattern forces anything: a variable, a wildcard `_` or a lazy pattern `~p` matches without evaluating. "As far as necessary" has a precise name: weak head normal form (WHNF), meaning evaluated until the outermost constructor or lambda is known. Matching `x : xs` exposes the first cons cell and leaves `x` and `xs` as thunks.
{{< /callout >}}


This is one of the most important features in Haskell: it is what allows programs to work with conceptually infinite data structures, and it is why people say that Haskell lets you write your own control structures. It's also one of the motivations behind Haskell being a [pure](https://wiki.haskell.org/Pure "Pure") language (though there are several other good ones).

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The causality ran the other way. In "Wearing the hair shirt" (2003), Simon Peyton Jones argues that laziness kept Haskell pure. When evaluation order is hard to predict, side effects hidden inside functions are unusable, so the designers could never take the shortcut of adding them. That pressure led to monadic I/O. "Write your own control structures" means that functions like `when`, `unless` or a custom `&&` are ordinary library functions, because their arguments are only evaluated if needed.
{{< /callout >}}


Now for the nice solution. Rather than trying to model imperative code  inside State, we can take advantage of laziness: Calculate an infinite list  of fibonacci values. When a value in the list is forced, its result is  automatically "cached" by the runtime. If the value at that index is asked  for again, it needn't be re-calculated.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This is the standard `fibs = 0 : 1 : zipWith (+) fibs (tail fibs)`. Each list cell starts as a thunk. Once forced it is overwritten with its value, so the list acts as a memo table without any explicit state.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The "cache" lives as long as something refers to the list. A top-level `fibs` is never garbage-collected, so asking for the millionth element keeps a million cells in memory for the rest of the program. It is a small, intentional space leak (see below).
{{< /callout >}}


serie from this article: <http://blog.ezyang.com/2011/04/the-haskell-heap/>

<http://blog.ezyang.com/2011/04/evaluation-on-the-haskell-heap/>

<http://blog.ezyang.com/2011/04/io-evaluates-the-haskell-heap/>

<http://blog.ezyang.com/2011/04/implementing-the-haskell-heap-in-python-v1/>

<http://blog.ezyang.com/2011/04/functions-produce-the-haskell-heap/>

<http://blog.ezyang.com/2011/04/how-the-grinch-stole-the-haskell-heap/>

Understanding what happens when you open a present is key to understanding the time and space behavior of Haskell programs.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Yang's series pictures thunks as wrapped presents on a heap: forcing one means opening it, which may require opening others, and the opened contents replace the box. The series fills the gap the substitution model leaves: it shows sharing and memory use, which explain both why laziness can be fast and where space leaks come from.
{{< /callout >}}

## Costs of laziness: space leaks


**Memory leaks**

<https://wiki.haskell.org/Memory_leak>

iteresting post about memory leaks detection using heap profiling

<https://stackoverflow.com/questions/61666819/haskell-how-to-detect-lazy-memory-leaks>

The main method for detecting memory leaks is heap profiling.

discourse: problem, symptoms, tools, methods, best practices to avoid

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In Haskell the usual problem is a *space leak*, not a classic memory leak: memory that the program will eventually free, but holds far longer or in far larger amounts than expected. Two causes dominate. One is unevaluated thunks piling up: `foldl (+) 0 [1..n]` builds a chain of n pending additions before computing any of them (see `foldl'` in [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds)). The other is a thunk that keeps a large structure reachable just because it might need it later. Common fixes are strict accumulators (`foldl'`, bang patterns), strict data fields (`!` in a type definition or the `StrictData` extension), and forcing values at known points.
{{< /callout >}}


tools: profilers, heap dump, ghc-heap

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The list mixes levels. `ghc-heap` is a low-level library for inspecting individual heap objects, not a diagnostic tool, and GHC has no JVM-style heap dump. In practice: `+RTS -s` for total allocation and maximum residency, heap profiling by closure type with `-hT` (works without a profiling build), by cost centre or type with `-hc` and `-hy` (needs one), or by info table with `-hi` on GHC 9.2 or later, viewed with `eventlog2html`. `ghc-debug` inspects the heap of a running process.
{{< /callout >}}


Haskell offers various ways to force intermediate evaluation. One convenient tool is the bang pattern, enabled by the BangPatterns language extension. Bang patterns force evaluation of arguments at function invocation.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
A bang pattern forces only to weak head normal form. `go !acc (x:xs)` with a pair as the accumulator evaluates the pair constructor but leaves both components as growing thunks. Each field needs its own strictness.
{{< /callout >}}

## Call-by-name in Scala


Call-by-Name & Call-by-Value

```scala
def calledByName(x: => Long): Unit = {
 println("by name: " + x)
 println("by name: " + x)
}
```

CBN - evaluated every time. Extremely useful in lazy streams. And things that can go fail.

Also, by-Name parameter *delays* the evaluation the expression until it's used.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A by-name parameter `x: => Long` is passed as an unevaluated expression, compiled to a function with no arguments. Every mention of `x` in the body runs it again. In the example the argument is evaluated twice, so an argument like `System.nanoTime()` prints two different numbers, and an argument with a side effect performs it twice.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Both uses need precision. In lazy streams, by-name on its own would recompute the rest of the stream on every access. `LazyList` takes its tail by name and immediately stores it in a `lazy val`, which turns it into call-by-need. "Things that can fail" refers to APIs that decide whether and when to evaluate their argument: `Try(expr)` and `Future(expr)` evaluate it inside an exception handler or on another thread, `opt.getOrElse(default)` only builds `default` when it is needed, and `require(cond, message)` only builds the message when the check fails.
{{< /callout >}}


<https://blog.rockthejvm.com/3-tricks-for-CBN/>

Although call-by-name and lazy evaluation are related, they are not the same thing. Call-by-name evaluates the argument each time it is used, while lazy evaluation evaluates the argument only once and caches the result for future use[1](https://stackoverflow.com/questions/41785985/call-by-name-in-scala-vs-lazy-evaluation-in-haskell)[5](https://www.geeksforgeeks.org/scala-lazy-evaluation/)[6](https://tpolecat.github.io/2014/06/26/call-by-name.html).

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The distinction is right. The numbered references (1, 5, 6, with gaps) look copied from an AI-generated or search-engine answer, so the remaining sources aren't listed. Of the three, tpolecat's post is the most careful. To get call-by-need inside a Scala method, assign the by-name parameter to a local `lazy val` and use that.
{{< /callout >}}


By-name-parameters vs by-value parameters - what's the difference?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A by-value parameter (`x: Long`) is evaluated exactly once, before the call. A by-name parameter (`x: => Long`) is evaluated each time the body uses it, so zero, one or many times. Use by-name for things the callee may not need or must control: default values, conditions, log messages, retries and custom control structures.
{{< /callout >}}

## Working through an evaluation by hand


**First wording**

If you encounter a function that seems unclear or if you're struggling to grasp its operations fully, it's helpful to write down a detailed evaluation of the function step-by-step.

**Alternative wording**

If you have a function that you can not understand. Or cant get full understanding what is going on. In this case, you should write down an evaluation of your function step by step.

In our description of `myDrop`, we have so far focused on surface features. We need to go deeper, and develop _a useful mental model_ of how function application works. To do this, we'll first work through a few simple examples, until we can walk through the evaluation of the expression `myDrop 2 "abcd"`.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The `myDrop` passage is from chapter 2 of *Real World Haskell* (the types-and-functions link under Reading). Its walk-through of `myDrop 2 "abcd"` is a worked example of the advice above, and it shows lazy evaluation of `if` and `||` along the way. For a hand evaluation, the useful habit is to write one rewrite step per line and to mark each thunk explicitly instead of evaluating arguments up front.
{{< /callout >}}

## Reading


<https://gilmi.me/blog/post/2020/10/01/substitution-and-equational-reasoning>

<https://john.cs.olemiss.edu/~hcc/csci450/ELIFP/Ch08/08_Evaluation_Model.html>

<https://john.cs.olemiss.edu/~hcc/docs/ELIFP/Ch08/08_Evaluation_Model.pdf> ([PDF](/sources/programming/functional-programming/cunningham-2022-exploring-languages-ch08-evaluation-model.pdf.enc))

<https://book.realworldhaskell.org/read/types-and-functions.html>

controlling evaluation in mena library book ([PDF](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc))

<https://wiki.haskell.org/Thunk>

<https://wiki.haskell.org/Non-strict_semantics>

<https://stackoverflow.com/questions/66943741/what-does-seq-actually-do-in-haskell>

<https://www.seas.upenn.edu/~cis1940/spring13/lectures/06-laziness.html>

laziness

<https://www.youtube.com/watch?v=fSqE-HSh_NU>

See also: [Lambda Calculus]({{< ref "functional-programming/lambda-calculus" >}}) for reduction and normal forms, [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds) for `foldl'` and `seq`, [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#referential-transparency), and the [Study Log]({{< ref "functional-programming/study-log" >}}) entries on bang patterns and the worker-wrapper construct (29.11.23). Also [Streams]({{< ref "functional-programming/streams" >}}) for `LazyList` and effectful streams, and [Concurrency]({{< ref "functional-programming/concurrency" >}}) for parallelism in practice.

## Library sources


- [Cunningham 2022](/sources/programming/functional-programming/cunningham-2022-exploring-languages-ch08-evaluation-model.pdf.enc), *Exploring Languages with Interpreters and Functional Programming, Chapter 8: Evaluation Model*: the chapter quoted under Substitution model.
- [Takenobu 2016](/sources/programming/functional-programming/takenobu-2016-lazy-evaluation-illustrated-for-haskell.pdf.enc), *Lazy evaluation illustrated for Haskell divers*: thunks, WHNF and sharing drawn step by step.
- [Abelson et al. 2022](/sources/programming/language-theory/abelson-2022-sicp-javascript-edition.pdf.enc), *Structure and Interpretation of Computer Programs, JavaScript Edition*: the substitution model, section 1.1.5.
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: the chapter on strictness and laziness, source of the nonstrictness passage.
- [Marlow 2013](/sources/programming/functional-programming/marlow-2013-parallel-and-concurrent-programming-in-haskell.pdf.enc), *Parallel and Concurrent Programming in Haskell*: explicit, deterministic parallelism; on the parallelism claim under Church-Rosser.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 2, Working with Lists, section "Understanding How Programs Are Evaluated", explains call by need, thunks and infinite lists; chapter 10, section "Dealing with Laziness and IO", tracks down a space leak in a small metrics program.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 9, Haskell data and code at run time: how thunks and closures are laid out in memory (9.1), and controlling strictness with `seq` and bang patterns on an accumulating loop (9.2.1); on Thunks and Costs of laziness.

Further reading:

- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*
- [Serrano Mena 2022](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc), *Haskell: Almost Standard Libraries*
- [Sestoft 2002](/sources/programming/functional-programming/sestoft-2002-demonstrating-lambda-calculus-reduction.pdf.enc), *Demonstrating Lambda Calculus Reduction*
- [Chiusano et al. 2013](/sources/programming/scala/chiusano-2013-functional-programming-in-scala-meap-v10.pdf.enc), *Functional Programming in Scala (MEAP version 10)*
- Płachta 2022, *Grokking Functional Programming*
