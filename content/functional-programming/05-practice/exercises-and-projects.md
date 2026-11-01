---
draft: false
toc: true
title: "Functional Programming Exercises and Projects"
aliases:
  - "/functional-programming/exercises-and-projects/"
description: "Exercise collections for Haskell and Scala, specific problems on lists, trees, functors and applicatives, learning tasks, and project ideas from games to reference applications."
weight: "30"
linkTitle: "Exercises and Projects"
---

Practice material for functional programming in Haskell and Scala: exercise collections, specific problems with hints, small learning tasks, and project ideas. Language-agnostic sites (Advent of Code, Exercism, Project Euler, Codewars) are in coding katas.

## Exercise collections


H-99 and S-99 are ports of the same problem list, the Ninety-Nine Prolog Problems (P-99). Solving a problem in one language and then the other is a cheap way to compare idioms.

### Haskell


- H-99, Ninety-Nine Haskell Problems: <https://wiki.haskell.org/H-99:_Ninety-Nine_Haskell_Problems>
- JD95/haskell-problem-sets: <https://github.com/JD95/haskell-problem-sets>
- AskElle (ideas.science.uu.nl): <https://ideas.science.uu.nl/AskElle/>
- Educative answers, Haskell exercises: <https://www.educative.io/answers>
- [ ] Work through the CIS 194 exercises.

### Scala


- Li Haoyi, *Hands-on Scala Programming* ([Li 2020](/sources/a280251ad59e61862b88a946d18fae4c.bin)), project-based.
- Coursehunter course, Scala and functional programming practice: <https://coursehunter.net/course/scala-i-funkcionalnogo-programmirovaniya-praktika>
- Scala Exercises: <https://www.scala-exercises.org/>, source at <https://github.com/scala-exercises/scala-exercises>. It brings the Scala Koans to the web, with hundreds of exercises in 42 categories on the basics of the language. Originally built by 47 Degrees; the old address <http://scala-exercises.47deg.com/> is the same site.
- Scala Advent of Code (Scala Center): <https://scalacenter.github.io/scala-advent-of-code/>, source at <https://github.com/scalacenter/scala-advent-of-code>
- S-99, Ninety-Nine Scala Problems: <http://aperiodic.net/phil/scala/s-99>
- Exercism, community-driven Scala exercises: <https://exercism.org/tracks/scala/exercises>
- dehun/learn-fp, a learn-by-doing FP course in Scala covering type classes, functors, applicatives, monads, monad transformers and the free monad: <https://github.com/dehun/learn-fp/>

### Other collections


- Earl Douglas, exercises: <https://earldouglas.com/posts/exercises.html>

Queued to do:

- [ ] Utrecht University FP course, 2019 exercises: [archived copy](https://web.archive.org/web/20230302062937/http://www.cs.uu.nl/docs/vakken/fp/2019/exercises.html) (the original page is gone)
- [ ] Gist by oskarkv: <https://gist.github.com/oskarkv/3168ea3f8d7530ccd94c97c19aafe266>. The jot "learn a haskell" sat next to it; it probably means *Learn You a Haskell for Great Good!*, but it may also have been a label for this gist (needs checking).
- [ ] Drew University (Burd), exercises to accompany *Introduction to Functional Programming*: <https://users.drew.edu/bburd/functionalprogramming/ExercisesToAccompanyIntroductionToFunctionalProgramming.pdf>
- [ ] University of Innsbruck, FP course, winter semester 2015: [archived copy](https://web.archive.org/web/20250917105748/http://cl-informatik.uibk.ac.at/teaching/ws15/fp/content.php) (the original page is gone)

## Specific problems

### Lists and trees as ADTs


- **Write a List type as an ADT.** A list is either empty or a head followed by another list. In Haskell, `data List a = Nil | Cons a (List a)`. In Scala 3, an `enum` with two cases; make it covariant (`+A`) so that `MyList[Nothing]` works as the empty list for every element type.

  ```scala
  enum MyList[+A]:
    case Empty
    case Cons(head: A, tail: MyList[A])
  ```

- **Add `headOption` and `tailOption`, and use them in your code.** The point is totality: `head` on an empty list has no sensible answer and throws, while `headOption: Option[A]` and `tailOption: Option[MyList[A]]` put the empty case in the type. Notice how `Option` forces every caller to decide what happens for the empty list, and how `for` comprehensions over `Option` keep that readable.
- **Write a recursive `toString`.** Build the string for the tail and put the head in front, taking care with the separator so there is no trailing comma. Try it on a list of 100,000 elements: a plain recursive version overflows the stack on the JVM. Fix it with an accumulator and `@tailrec`, or write it as a `foldLeft`. See [Writing recursive functions]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#writing-recursive-functions).
- **Write a Tree type as an ADT.** A binary tree: `data Tree a = Leaf | Node (Tree a) a (Tree a)`, or a Scala 3 `enum` with the same two cases. Follow-ups: `size`, `depth`, insertion and lookup for a binary search tree, a `fold` over the tree, and a `Functor` instance.

### List functions


Write these yourself, in Haskell:

- **`take`, `drop`, `length`, `reverse` and `avg`.** Decide what `take` and `drop` do with a negative count or a count larger than the list; the Prelude versions return `[]` or the whole list rather than failing. Write `reverse` twice: the naive version with `++` is quadratic, the version with an accumulator is linear. For `avg`, compute the sum and the count in one pass, and give it a type that admits the empty list, such as `[Double] -> Maybe Double`.
- **`map`, `filter`, `remove` and `removeFirst`.** `remove p` is `filter (not . p)`. `removeFirst` removes only the first element that matches and keeps the rest unchanged, so it can't be written with `filter`. Use explicit recursion that stops at the first match, or `break`.
- **`product`, `concatAll` and `reverse`, also with a fold.** For each function, find the value for the empty list and the function that combines one element with the result for the rest; that pair is the argument to `foldr`. `reverse` is the odd one out: it reads naturally as a left fold, `foldl` with an accumulator. Compare it with a `foldr` version, which needs `++` and is quadratic. See [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds).
- **`any`, using composition `(.)`.** `any p xs` is true if some element satisfies `p`. With composition it can be built from two existing functions without mentioning `xs` (point-free style): map the predicate over the list, then combine the booleans. Check that your version stops at the first `True` on an infinite list.
- **`all` on `Foldable`.** In `base` the type is `all :: Foldable t => (a -> Bool) -> t a -> Bool`, so the same function works on lists, `Maybe`, `Map k` and trees. Two routes: `foldr` with `&&`, or `foldMap` with the `All` monoid from `Data.Monoid`. Both stop early on the first `False`, because `&&` is lazy in its second argument.
- **`elem`, three ways: directly, with `filter` and `length`, and with `any`.** `elem` needs an `Eq a` constraint, since it compares elements. Direct recursion and the `any` version stop at the first match, so `elem 3 [1..]` returns `True`. The `filter` and `length` version counts every match, so it walks the whole list and never finishes on an infinite one.

### Functor (Serokell)


Haskell exercises from Serokell, "What's that typeclass: Functor": <https://serokell.io/blog/whats-that-typeclass-functor>

- **Implement `Functor` for several types.** The article's list of types was not copied. Good candidates, roughly in order of difficulty: a custom `Maybe`, a custom list, a binary tree, `Either e`, the pair `((,) a)` and the function type `(( -> ) r)`. For the last three, work out from the kind why only the last type parameter can be mapped.
- **Implement `(<$)` for `Maybe a`.** `(<$) :: a -> f b -> f a` replaces every value inside the functor with a constant and keeps the structure. Decide what happens to `Nothing` and to `Just`, then check your answer against the default definition in `base`, which writes it in terms of `fmap` and `const`.
- **Convert a string to upper case without `toUpper`.** A `String` is `[Char]`, so this is `fmap` (or `map`) of a function on single characters. For that function, use `ord` and `chr` from `Data.Char`: lower-case ASCII letters are 32 code points after their upper-case versions. Leave every other character unchanged. Caveat: the offset trick only works for ASCII. Unicode case mapping is not a fixed offset, and some characters don't map one to one (the German `ß` upper-cases to `SS`), which is why `toUpper` uses tables.
- **Prove that the instance `Functor (( -> ) a)` follows the identity and composition laws.** For this instance `fmap` is function composition, `fmap = (.)`. Write each law with that definition substituted, apply both sides to an arbitrary argument `x`, and reduce. The identity law follows from `id` being a unit for composition, the composition law from composition being associative.

### Applicative (GPWH)


Exercises from the Functor, Applicative and Monad unit of Will Kurt, *Get Programming with Haskell* (Manning). See [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}).

`<$>` is `fmap`: it applies a plain function to a value in a context, `(a -> b) -> f a -> f b`. `<*>` applies a function that is itself in a context, `f (a -> b) -> f a -> f b`. Together they apply a function of several arguments to several values in a context: `f <$> x <*> y`.

- **Work with `<*>` and `<$>`:** go back to some of the examples in unit 1 and change the values used as arguments to `Maybe` values.
- **Use `<$>` and `<*>` to combine two `Maybe String` values with `++`.** `(++)` takes two arguments. Mapping it over the first `Maybe String` gives a `Maybe (String -> String)`, a function waiting for its second argument inside a `Maybe`, and `<*>` supplies that argument. Check the result when either value is `Nothing`.

The book then points ahead to Monad:

> This solution works, but having to write a wrapper function to make it work for Maybe should be a warning at this point. In lesson 28, you saw a similar pattern of being forced to write a wrapper function to work in a context as motivating more powerful type classes. But at this point, you might not be convinced of the need for yet another, even more powerful type class.
>
> -- Kurt, *Get Programming with Haskell*

`<$>` and `<*>` handle functions whose arguments are in a context. They don't help when the function itself returns a value in a context, `a -> Maybe b`: mapping it over a `Maybe a` gives `Maybe (Maybe b)`. `>>=` is the operation that chains such functions. See [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}).

## Learning tasks


- **Implement `sum`, `product` and `length` in Haskell, and test them.** Property-based testing with QuickCheck fits well: compare against the Prelude versions, and check laws such as `sum (xs ++ ys) == sum xs + sum ys` and `length (xs ++ ys) == length xs + length ys`. Then try the functions on `[1..10^7]`. A naive `foldl` or a non-strict accumulator builds up thunks and uses far more memory than needed, which is why `foldl'` exists. See [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds), [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}) and [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}).
- **State and Reader monads.** Reader is a function from a shared, read-only environment, `newtype Reader r a = Reader (r -> a)`, used for configuration and dependencies. State is a function from a state to a result and a new state, `newtype State s a = State (s -> (a, s))`. Write both newtypes yourself with their `Functor`, `Applicative` and `Monad` instances, then use State for a stack or a counter and Reader for passing a configuration through several functions. See [Reader]({{< ref "functional-programming/02-abstractions/monads" >}}#reader) and [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}).
- **Build a toy effect system** (#project). Start by describing console programs as data and writing the interpreter separately:

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


  Next steps: give `Console` a `Monad` instance so programs can use `do` notation; write a second, pure interpreter that takes a list of input lines and returns the output, for tests; then generalise the structure, which leads to the free monad. Comparing that with a tagless final version of the same program covers the two main designs. More in [Effect systems]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#effect-systems). This project is also on the list in Project Ideas.

## Project ideas

### Haskell project assignment


A saved project-assignment excerpt (source not recorded):

> For your project you may write some sort of Haskell application or library which does something fun/useful/interesting. Your imagination is the limit. Some possibilities/suggestions include:
>
> - A program to play a game (like tic-tac-toe, Connect 4, othello, gomoku, poker, mancala, ...) against the user.
> - A program to solve puzzles like sudoku or kenken.
> - A program to generate random mazes and let the user interactively solve them, or to solve mazes input by the user.
> - An implementation of some interesting data structure like red-black trees, 2-3-4 trees, binomial heaps, or Fibonacci heaps.
> - An parser and interpreter for a small programming language, such as a while language.
> - A raytracer.
> - Create a web site using hakyll.
> - Take an interesting program you have written in some other language, and figure out how to port/re-implement it in idiomatic Haskell.
> - Whatever else your creativity suggests!

For the game idea, Hughes 1990 (Library sources) has an alpha-beta game-playing example.

### Games


- Andrea/FunctionalProgrammingInGames: <https://github.com/Andrea/FunctionalProgrammingInGames>
- unclebob/spacewar, a game: <https://github.com/unclebob/spacewar>, with the Clean Coder blog post "Spacewar" (2021): <https://blog.cleancoder.com/uncle-bob/2021/11/28/Spacewar.html>
- Devsisters tech blog, Scala for game server development: <https://tech.devsisters.com/posts/scala-for-game-server-development/>
- jdegoes/lambdaconf-2014-introgame, a "find out" game: <https://github.com/jdegoes/lambdaconf-2014-introgame>

### Reference applications in Scala


These are complete applications to read rather than exercises. pfps-shopping-cart is the application built in Volpe's *Practical FP in Scala* (tagless final with Cats, Cats Effect and fs2; see Library sources), and pfps-examples holds the book's smaller examples. scala-pet-store (noted as "scala-petshop") is another full application. Reading one alongside the book and then rebuilding a small slice of it yourself works better than copying it.

- gvolpe/pfps-shopping-cart: <https://github.com/gvolpe/pfps-shopping-cart>
- gvolpe/pfps-examples: <https://github.com/gvolpe/pfps-examples>
- pauljamescleary/scala-pet-store: <https://github.com/pauljamescleary/scala-pet-store>

### Refactor a plain first version


Write a plain first version of a project, then refactor it in small steps towards the structures, tools, libraries and patterns of Scala and FP, keeping each step as a separate commit to compare. Typical steps: `null` to `Option`, exceptions to `Either`, loops to `map` and folds, mutable state to values passed through functions, duplicated logic to type classes, and side effects pushed to the edge with `IO`. See [Refactoring functional code]({{< ref "functional-programming/05-practice/functional-refactoring" >}}).

See also: coding katas, [Recursion and folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}), [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}), [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}), [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}), [Effect systems]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#effect-systems), [Refactoring functional code]({{< ref "functional-programming/05-practice/functional-refactoring" >}}), Project Ideas.

## Library sources


- [Li 2020](/sources/a280251ad59e61862b88a946d18fae4c.bin), *Hands-on Scala Programming*: listed under Scala; project-based, ending with a file synchronizer and a small language implementation.
- [Volpe 2021](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), *Practical FP in Scala (2nd edition)*: the book behind pfps-shopping-cart and pfps-examples.
- [Allen and Moronuki 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles*: the standard list functions by recursion (9.12, "Chapter Exercises") and again with folds (10.10, "Rewriting functions using folds": `myOr`, `myAny`, `myElem`, `myReverse`, `myMap`, `myFilter`), on *List functions*; a `BinaryTree` with insert, map and fold (11.17, "Binary Tree"), on *Lists and trees as ADTs*; `Functor` instances for small types (16.10, "Exercises: Instances of Func"), on *Functor (Serokell)*; implementing the Reader monad (22.7) and State's instances (23.6, "Write State for yourself"), on *Learning tasks*.
- [Pilquist et al. 2023](/sources/075d81d6390bbb592aa1a8ba0a5f967d.bin), *Functional Programming in Scala (2nd edition)*: exercise-driven; its functional data structures chapter covers the List and Tree ADT problems, and its I/O chapter builds an effect type step by step.
- [Hughes 1990](/sources/a88f5c889d6f70309316ef0660f67635.bin), *Why Functional Programming Matters*: section 5, "An Example from Artificial Intelligence", builds alpha-beta game-tree search from small lazily composed parts; relevant to the game project idea; on *Haskell project assignment*.
- [Bird and Gibbons 2020](/sources/c4f62226daeec327477fd1a5a1e478c0.bin), *Algorithm Design with Haskell*: chapter 1 exercises with answers: a linear-time `reverse` with `foldl` (1.4), `map` and `filter` as `foldr` (1.5), `takeWhile` as a `foldr` that stops early (1.7), and when `foldr` and `foldl` agree (1.10); on *List functions*.
- [Serrano Mena 2021](/sources/4f6f84b5680da34841126999b31e2ed3.bin), *Book of Monads (2nd edition)*: section 13.3, "Initial Style", gives the recipe the toy `Console` type follows (one constructor per operation with a continuation for its result, plus one for the final value), with its `Monad` instance and smart constructors, and exercises 13.6 (a `Functor` instance), 13.8 (a `State` interpreter for a file-system monad), 13.11 (rewriting it as a free monad) and 13.3 (a final-style version); section 6.1 and exercise 6.1 on the `State` newtype and its `Monad` instance; on *Learning tasks*.
- [Zhang 2021](/sources/045b287b4f91e1969ef5ff22ae89f360.bin), *Structural induction tutorial (CPCS449)*: the principle of structural induction for lists and a proof template (slides 2-3), then proofs of `sum (xs ++ ys) = sum xs + sum ys`, `xs ++ [] = xs` and associativity of `++` (slide 4); the laws under Learning tasks proved instead of tested; on *Learning tasks*.
- Bird 1998, *Introduction to Functional Programming using Haskell (2nd edition)*: sections 4.2.3, "Reverse", and 4.5, "The fold functions", write `reverse` with `++` and as `foldl cons []`, section 4.6.1, "Duality theorems", proves the two equal, section 7.2.3, "Reverse and concat", times them at Θ(n²) and Θ(n) and shows `concat` is faster as `foldr` than as `foldl`, and section 7.4.4, "Average", computes sum and length in one pass, on the reverse, fold and avg exercises under *List functions*; section 6.1, "Binary trees", defines size, height and `foldBtree`, with size and height as folds (6.1.3), and section 6.2, "Binary search trees", uses `data Stree a = Null | Fork (Stree a) a (Stree a)`, the note's Tree shape, with member, insert and delete (6.2.1), and asks for `mapStree` and `foldStree` as exercises, on *Lists and trees as ADTs*; section 7.5, "Controlling space", reduces `sum [1 .. 1000]` with `foldl` and shows the expression growing linearly, the effect the `[1..10^7]` experiment is meant to show, on *Learning tasks*.
- [Hutton 1999](/sources/ef79cb2cda8798acfb994029dcd0acce.bin), *A tutorial on the universality and expressiveness of fold*: section 2, "The fold operator", defines `sum`, `product`, `and`, `or`, `(++)`, `length`, `reverse`, `map` and `filter` as folds; section 4, "Increasing the power of fold: generating tuples", computes sum and length in one fold (`sumlength`, the one-pass `avg`) and shows why `dropWhile` needs a pair; on *List functions*.

Further reading:

- [Welsh and Gurnell 2020](/sources/08cab18bbc8a17a6885874831fe8c431.bin), *Scala with Cats*
- [Bjarnason 2015](/sources/8fd5eb08346cd7c9f4841b40b9d1bc34.bin), *A companion booklet to "Functional Programming in Scala"*
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell*: worked Haskell projects with end-of-chapter exercises: a pager (chapter 8), a directory-metrics tool (chapter 10), a file archiver serialised, parsed and finally rebuilt on monad transformers (chapters 11 to 13), and a spellchecker refactored from a naive edit distance through memoisation, `ST` and vectors (chapter 14); on *Project ideas* and *Refactor a plain first version*.
