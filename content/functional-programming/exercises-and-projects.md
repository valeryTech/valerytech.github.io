---
draft: false
toc: true
title: "Exercises And Projects"
linkTitle: "Exercises And Projects"
---

Practice material for the section: exercise collections, specific problems to solve in Haskell and Scala, small learning tasks, and project ideas.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Exercise collections

### Haskell


Also work through CIS 194 exercises.

<https://wiki.haskell.org/H-99:_Ninety-Nine_Haskell_Problems>

<https://github.com/JD95/haskell-problem-sets>

<https://ideas.science.uu.nl/AskElle/>

haskell exercises <https://www.educative.io/answers>

### Scala


li_haoyi_handson_scala_programming.pdf ([PDF](/sources/programming/scala/li-2020-hands-on-scala-programming.pdf.enc))

<https://coursehunter.net/course/scala-i-funkcionalnogo-programmirovaniya-praktika>

<https://www.scala-exercises.org/>

<https://github.com/scala-exercises/scala-exercises>

<https://scalacenter.github.io/scala-advent-of-code/>

<https://github.com/scalacenter/scala-advent-of-code>

[S-99](http://aperiodic.net/phil/scala/s-99) - Ninety-Nine Scala Problems

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
H-99 and S-99 are ports of the same problem list, the Ninety-Nine Prolog Problems (P-99). Solving a problem in one language and then the other is a cheap way to compare idioms.
{{< /callout >}}


[Scala Exercises](http://scala-exercises.47deg.com/) - Brings the popular Scala Koans to the web. Offering hundreds of solvable exercises organized into 42 categories covering the basics of the Scala language.

[Exercism - Scala Exercises](http://exercism.io/languages/scala/exercises) - Community-driven Scala exercises.

[Learn-by-doing functional programming course on Scala](https://github.com/dehun/learn-fp/) - Covers type classes, functors, applicatives, monads, monad transformers, free monad

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Some of these URLs are old addresses. Exercism moved from exercism.io to exercism.org, and Scala Exercises (originally built by 47 Degrees) is the scala-exercises.org site listed above, so the 47deg link is a duplicate under its old address.
{{< /callout >}}

### Other collections


<https://earldouglas.com/posts/exercises.html>

Exercises to do:

<http://www.cs.uu.nl/docs/vakken/fp/2019/exercises.html>

learn a haskell

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Probably *Learn You a Haskell for Great Good!*, but the jot sits in a list of exercise links, so it may also have been a label for the gist below. Needs checking.
{{< /callout >}}


<https://gist.github.com/oskarkv/3168ea3f8d7530ccd94c97c19aafe266>

<https://users.drew.edu/bburd/functionalprogramming/ExercisesToAccompanyIntroductionToFunctionalProgramming.pdf>

<http://cl-informatik.uibk.ac.at/teaching/ws15/fp/content.php>

Language-agnostic sites (Advent of Code, Exercism, Project Euler, Codewars) stay in [[problems-and-katas]].

## Specific problems

### Lists and trees as ADTs


write List class as ADT

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A list is either empty or a head followed by another list. In Scala 3, `enum MyList[+A]` with two cases, `Empty` and `Cons(head: A, tail: MyList[A])`; in Haskell, `data List a = Nil | Cons a (List a)`. Make it covariant (`+A`) in Scala so that `MyList[Nothing]` works as the empty list for every element type.
{{< /callout >}}


write List class with headOption and tailOption and use it in your code

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The point is totality: `head` on an empty list has no sensible answer and throws, while `headOption: Option[A]` and `tailOption: Option[MyList[A]]` put the empty case in the type. When using them, notice how `Option` forces every caller to decide what happens for the empty list, and how `for` comprehensions over `Option` keep that readable.
{{< /callout >}}


write toString recursive method on a List

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A recursive `toString` builds the string for the tail and puts the head in front, with care for the separator so you don't get a trailing comma. Try it on a list of 100,000 elements: a plain recursive version overflows the stack on the JVM. Fix it with an accumulator and `@tailrec`, or by writing it as a `foldLeft`. See [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#writing-recursive-functions).
{{< /callout >}}


Tree class as adt

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A binary tree: `data Tree a = Leaf | Node (Tree a) a (Tree a)`, or a Scala 3 `enum` with the same two cases. Natural follow-ups: `size`, `depth`, insertion and lookup for a binary search tree, a `fold` over the tree, and a `Functor` instance.
{{< /callout >}}

### List functions


*write*

take, drop, length, reverse, avg function on a list

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Hints: decide what `take` and `drop` do with a negative count or a count larger than the list (the Prelude versions return `[]` or the whole list rather than failing). Write `reverse` twice: the naive version with `++` is quadratic, the version with an accumulator is linear. For `avg`, compute the sum and the count in one pass, and give it a type that admits the empty list, such as `[Double] -> Maybe Double`.
{{< /callout >}}


map, filter, remove, remove first

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`remove p` is `filter (not . p)`. `remove first` is different: it removes only the first element that matches and keeps the rest unchanged, so it can't be written with `filter`. Write it with explicit recursion that stops at the first match, or with `break`.
{{< /callout >}}


product, concatAll, reverse -> + also using fold

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
For each function, find the value for the empty list and the function that combines one element with the result for the rest. That pair is the argument to `foldr`. `reverse` is the odd one out: it reads naturally as a left fold, `foldl` with an accumulator. Compare it with a `foldr` version, which needs `++` and is quadratic. See [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds).
{{< /callout >}}


`any` function

using composition (.)

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`any p xs` is true if some element satisfies `p`. With composition it can be built from two existing functions, without mentioning `xs` (point-free style): first map the predicate over the list, then combine the booleans. Check that your version stops at the first `True` on an infinite list.
{{< /callout >}}


`all` function on Foldable

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In `base` the type is `all :: Foldable t => (a -> Bool) -> t a -> Bool`, so the same function works on lists, `Maybe`, `Map k` and trees. Two routes: `foldr` with `&&`, or `foldMap` with the `All` monoid from `Data.Monoid`. Both stop early on the first `False`, because `&&` is lazy in its second argument.
{{< /callout >}}


`elem` function,

elem function with filter and length

elem using `any`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`elem` needs an `Eq a` constraint, since it compares elements. The three versions behave differently. Direct recursion and the `any` version stop at the first match, so `elem 3 [1..]` returns `True`. The `filter` and `length` version has to count every match, so it walks the whole list and never finishes on an infinite one.
{{< /callout >}}

### Applicative (GPWH)


GPWH

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
*Get Programming with Haskell* by Will Kurt (Manning). The exercises below come from its unit on Functor, Applicative and Monad.
{{< /callout >}}


working with `<*>` and `<$>`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`<$>` is `fmap`: it applies a plain function to a value in a context, `(a -> b) -> f a -> f b`. `<*>` applies a function that is itself in a context, `f (a -> b) -> f a -> f b`. Together they apply a function of several arguments to several values in a context: `f <$> x <*> y`. See [Applicative]({{< ref "functional-programming/applicative" >}}).
{{< /callout >}}


Try going back to some of the examples in unit 1 and change values used as arguments to Maybe values.

Use `<$>` and `<*>` to combine two `Maybe String` types with `++`.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Hint: `(++)` takes two arguments. Mapping it over the first `Maybe String` gives a `Maybe (String -> String)`, a function waiting for its second argument inside a `Maybe`, and `<*>` supplies that argument. Check the result when either value is `Nothing`.
{{< /callout >}}


This solution works, but having to write a wrapper function to make it work for Maybe

should be a warning at this point. In lesson 28, you saw a similar pattern of being forced

to write a wrapper function to work in a context as motivating more powerful type

classes. But at this point, you might not be convinced of the need for yet another, even

more powerful type class.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The passage sets up the Monad type class. `<$>` and `<*>` handle functions whose arguments are in a context. They don't help when the function itself returns a value in a context, `a -> Maybe b`: mapping it over a `Maybe a` gives `Maybe (Maybe b)`. `>>=` is the operation that chains such functions. See [Monads]({{< ref "functional-programming/monads" >}}).
{{< /callout >}}

### Functor (Serokell)


Haskell

from <https://serokell.io/blog/whats-that-typeclass-functor>

implement Functor for

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The list of types was not copied. Good practice candidates, roughly in order of difficulty: a custom `Maybe`, a custom list, a binary tree, `Either e`, the pair `((,) a)` and the function type `(( -> ) r)`. For the last three, work out from the kind why only the last type parameter can be mapped.
{{< /callout >}}


implement `(<$)` for `Maybe a`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`(<$) :: a -> f b -> f a` replaces every value inside the functor with a constant and keeps the structure. For `Maybe`, decide what happens to `Nothing` and to `Just`. Then check your answer against the default definition in `base`, which writes it in terms of `fmap` and `const`.
{{< /callout >}}


Implement a function that converts strings to upper case without using toUpper

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A `String` is `[Char]`, so this is `fmap` (or `map`) of a function on single characters. For that function, use `ord` and `chr` from `Data.Char`: lower-case ASCII letters are 32 code points after their upper-case versions. Leave every other character unchanged.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The offset trick only works for ASCII. Unicode case mapping is not a fixed offset, and some characters don't map one to one (the German `ß` upper-cases to `SS`), which is why `toUpper` uses tables.
{{< /callout >}}


Prove that the instance`Functor (( -> ) a)` we discussed previously follows the identity and composition laws.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Hint: for this instance `fmap` is function composition, `fmap = (.)`. Write each law with that definition substituted, apply both sides to an arbitrary argument `x`, and reduce. The identity law then follows from `id` being a unit for composition, and the composition law from composition being associative.
{{< /callout >}}

## Learning tasks


Implement sum, product, and length functions in Haskell and test them.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
For tests, property-based testing with QuickCheck fits well: compare against the Prelude versions, and check laws such as `sum (xs ++ ys) == sum xs + sum ys` and `length (xs ++ ys) == length xs + length ys`. Then try the functions on `[1..10^7]`. A naive `foldl` or non-strict accumulator builds up thunks and uses far more memory than needed, which is why `foldl'` exists (see [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds) and [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}})).
{{< /callout >}}


state, reader monad

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Reader is a function from a shared, read-only environment: `newtype Reader r a = Reader (r -> a)`, used for configuration and dependencies. State is a function from a state to a result and a new state: `newtype State s a = State (s -> (a, s))`. A good exercise is to write both newtypes yourself with their `Functor`, `Applicative` and `Monad` instances, then use State for a stack or a counter and Reader for passing a configuration through several functions. See [Monads]({{< ref "functional-programming/monads" >}}#reader) and [Monads]({{< ref "functional-programming/monads" >}}).
{{< /callout >}}


build a toy effect system #project

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A small start: describe console programs as data and write the interpreter separately.

```haskell
data Console a
= Done a
| PrintLine String (Console a)
| ReadLine (String -> Console a)

run :: Console a -> IO a
run (Done a)        = pure a
run (PrintLine s k) = putStrLn s >> run k
run (ReadLine k)    = getLine >>= run . k
```

Next steps: give `Console` a `Monad` instance so programs can use `do` notation; write a second, pure interpreter that takes a list of input lines and returns the output, for tests; then generalise the structure, which leads to the free monad. Comparing that with a tagless final version of the same program covers the two main designs.
{{< /callout >}}


more details in  [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#effect-systems)

## Project ideas


The toy effect system is also on the list in [[06_project_ideas]].

### Haskell project assignment


Saved Haskell project-assignment excerpt (source not recorded):

For your project you may write some sort of Haskell application or library which does something fun/useful/interesting. Your imagination is the limit. Some possibilities/suggestions include:

A program to play a game (like tic-tac-toe, Connect 4, othello, gomoku, poker, mancala, ...) against the user.

A program to solve puzzles like sudoku or kenken.

A program to generate random mazes and let the user interactively solve them, or to solve mazes input by the user.

An implementation of some interesting data structure like red-black trees, 2-3-4 trees, binomial heaps, or Fibonacci heaps.

An parser and interpreter for a small programming language, such as a while language.

A raytracer.

Create a web site using hakyll.

Take an interesting program you have written in some other language, and figure out how to port/re-implement it in idiomatic Haskell.

Whatever else your creativity suggests!

### Functional programming in games


<https://github.com/Andrea/FunctionalProgrammingInGames>

game <https://github.com/unclebob/spacewar>

<https://blog.cleancoder.com/uncle-bob/2021/11/28/Spacewar.html>

game development

<https://tech.devsisters.com/posts/scala-for-game-server-development/>

### Reference applications in Scala


projects: scala-petshop, pfps-shopping-cart

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Both are complete applications to read rather than exercises: pfps-shopping-cart is the application built in Volpe's *Practical FP in Scala* (tagless final with Cats, Cats Effect and fs2; see Library sources), and "scala-petshop" presumably means the scala-pet-store repository linked below. Reading one alongside the book, then rebuilding a small slice of it yourself, works better than copying it.
{{< /callout >}}


<https://github.com/gvolpe/pfps-examples>

<https://github.com/gvolpe/pfps-shopping-cart>

<https://github.com/pauljamescleary/scala-pet-store>

See also: [[problems-and-katas]], [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}), [Functor]({{< ref "functional-programming/functor" >}}), [Applicative]({{< ref "functional-programming/applicative" >}}), [Monads]({{< ref "functional-programming/monads" >}}), [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#effect-systems), [[06_project_ideas]].

### Other project ideas


find out game: <https://github.com/jdegoes/lambdaconf-2014-introgame>

project: initial -> refactoring + using structures, tool, libs and patterns from scala and FP

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The plan is to write a plain first version of a project, then refactor it in small steps and keep each step as a separate commit to compare. Typical steps: `null` to `Option`, exceptions to `Either`, loops to `map` and folds, mutable state to values passed through functions, duplicated logic to type classes, and side effects pushed to the edge with `IO`. See [Functional Refactoring]({{< ref "functional-programming/functional-refactoring" >}}) and [Exercises And Projects]({{< ref "functional-programming/exercises-and-projects" >}}#project-ideas).
{{< /callout >}}

## Library sources


- [Li 2020](/sources/programming/scala/li-2020-hands-on-scala-programming.pdf.enc), *Hands-on Scala Programming*: the PDF listed under Scala; project-based, ending with a file synchronizer and a small language implementation.
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: the book behind pfps-shopping-cart and pfps-examples.
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: exercises in every chapter on lists, folds, Functor, Applicative, Monad, Reader and State.
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: exercise-driven; its functional data structures chapter covers the List and Tree ADT problems, and its I/O chapter builds an effect type step by step.
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: the alpha-beta game-playing example, relevant to the game project idea.

Further reading:

- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*
- [Bjarnason 2015](/sources/programming/scala/bjarnason-2015-fpis-companion-booklet.pdf.enc), *A companion booklet to "Functional Programming in Scala"*
- [Bird and Gibbons 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*
