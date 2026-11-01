---
draft: false
toc: true
title: "Refactoring Functional Code in Haskell"
aliases:
  - "/functional-programming/functional-refactoring/"
description: "Refactoring examples in Haskell: splitting a Collatz step counter into separate jobs, replacing partial functions with types that carry the guarantee, and wholemeal programming."
weight: "20"
linkTitle: "Refactoring Functional Code"
---

Three Haskell refactorings: splitting a Collatz step counter into small pieces, replacing partial functions with types that carry the guarantee, and rewriting explicit recursion as a pipeline of list functions. The common recipe is to name each job a function does, find the library function or type for each, and compose them.

## Collatz

### The starting code


Both versions count the steps from `num` down to 1 and return `Nothing` for inputs below 1.

```haskell
collatz :: Integer -> Maybe Integer
collatz num
  | num >= 1 = Just $ col 0 num
  | otherwise = Nothing
  where
    col steps 1 = steps
    col steps n
      | even n = col (steps + 1) (n `div` 2)
      | otherwise = col (steps + 1) (3 * n + 1)

collatz' :: (Num a, Integral t) => t -> Maybe a
collatz' num
  | num > 0 = Just $ go 0 num
  | otherwise = Nothing
  where
    go acc 1 = acc
    go acc k = go (acc + 1) (if even k then k `div` 2 else 3 * k + 1)
```


`collatz'` is already a first refactoring of `collatz`: the two branches that both did `steps + 1` are merged into one recursive call, and only the choice of the next number stays conditional.

Problems that remain in `collatz'`:

- The signature `(Num a, Integral t) => t -> Maybe a` is more general than anything needs. A concrete type is easier to read and gives better error messages.
- The accumulator `acc + 1` is lazy: without optimization it builds a chain of `+1` thunks as long as the sequence. For Collatz sequences that is small, but the habit matters (see `foldl'` in [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds)).

### Splitting the jobs


Both versions mix three jobs in one loop: computing the next number, generating the sequence, and counting it. Split them, and let library functions do the recursion:

```haskell
collatzStep :: Integer -> Integer
collatzStep n
  | even n    = n `div` 2
  | otherwise = 3 * n + 1

collatzSequence :: Integer -> [Integer]
collatzSequence = takeWhile (/= 1) . iterate collatzStep

collatz :: Integer -> Maybe Int
collatz n
  | n < 1     = Nothing
  | otherwise = Just (length (collatzSequence n))
```


`iterate collatzStep n` is the infinite list `n, step n, step (step n), ...`; laziness means only the part before the first 1 is ever computed. The results match the originals: `collatz 1 = Just 0`, `collatz 2 = Just 1`, `collatz 3 = Just 7`. Each piece can now be tested alone, and the sequence is reusable, for example to find its maximum.

The return type becomes `Int`, from `length`; use `genericLength` from `Data.List` to keep `Integer`.

The input check can move into a type as well. A `Positive` newtype with a smart constructor makes the check happen once, so functions that take a `Positive` never see a bad input. The guarantee holds only if the module exports `mkPositive` but not the `Positive` constructor, so that no other module can build a `Positive` without the check (King 2020, "Newtypes as tokens"). This is the same move as under [Partial functions](#partial-functions).

```haskell
newtype Positive = Positive Integer

mkPositive :: Integer -> Maybe Positive
mkPositive n
  | n >= 1    = Just (Positive n)
  | otherwise = Nothing
```


Caveat: nothing in the code guarantees termination. That every positive start reaches 1 is the Collatz conjecture, which is unproven, though it has been checked by computer for all starting values far beyond any input you would try.

### Recognising code that needs refactoring


Open question: how can code that needs refactoring be identified? Signs visible in the Collatz example:

- Explicit recursion whose shape matches a library function. Here "apply a step until a condition, counting" is `iterate`, `takeWhile` and `length`.
- One function with several responsibilities: deciding the next value, looping and counting all happen in `col`.
- The same expression repeated across branches, like `steps + 1` in `collatz`.
- A hand-written accumulator, which usually signals a fold or a library function waiting to be used.
- Validation tangled with computation: the `num >= 1` guard sits in the same function as the arithmetic.

Once the pieces have names, a useful test is whether each one can be described in one sentence without "and".

## Partial functions


`head` fails on an empty list. There are two ways to make it total.

The first is `safeHead :: [a] -> Maybe a`, which returns `Nothing` for `[]` and makes every caller handle that case. The second is to move the check into a type. The CIS 194 lecture on recursion patterns and polymorphism (<https://www.seas.upenn.edu/~cis1940/spring13/lectures/03-rec-poly.html>) puts it this way:

> OK, but what if we know that we will only use `head` in situations where we are _guaranteed_ to have a non-empty list? In such a situation, it is really annoying to get back a `Maybe a`, since we have to expend effort dealing with a case which we "know" cannot actually happen.
>
> The answer is that if some condition is really _guaranteed_, then the types ought to reflect the guarantee! Then the compiler _can enforce_ your guarantees for you. For example:
>
> ```haskell
> data NonEmptyList a = NEL a [a]
> nelToList :: NonEmptyList a -> [a]
> nelToList (NEL x xs) = x:xs
> listToNel :: [a] -> Maybe (NonEmptyList a)
> listToNel []     = Nothing
> listToNel (x:xs) = Just $ NEL x xs
> headNEL :: NonEmptyList a -> a
> headNEL (NEL a _) = a
> tailNEL :: NonEmptyList a -> [a]
> tailNEL (NEL _ as) = as
> ```

Here `listToNel` is the only place where emptiness is tested; from then on `headNEL` can't fail. The standard library has this type as `Data.List.NonEmpty`, with `data NonEmpty a = a :| [a]` and `nonEmpty :: [a] -> Maybe (NonEmpty a)` in place of `listToNel`. In Scala, Cats has `NonEmptyList`.

The two options match the general rule in Wlaschin 2018: a partial function becomes total either by extending its output (`safeHead`) or by restricting its input (`NonEmptyList`). As a design rule, the second is [Parse, don't validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}).

Caveats:

- The refactoring only pays off if the non-empty value is created once, near where the data enters, and passed along as `NonEmpty`. Converting back to a list and calling `head` again throws the guarantee away.
- Recent GHC versions warn about `head` and `tail` by default (the `-Wx-partial` warning, added in GHC 9.8), which is an easy way to find candidates for this refactoring.

## Wholemeal programming


The passage below presents the "wholemeal" style. Its source is not recorded in the note; it is probably also from CIS 194 (needs checking).

> Let's put some of the things we've just learned together in an example that also shows the power of a "wholemeal" style of programming. Consider the function `foobar`, defined as follows:
>
> ```haskell
> foobar :: [Integer] -> Integer
> foobar []     = 0
> foobar (x:xs)
>   | x > 3     = (7*x + 2) + foobar xs
>   | otherwise = foobar xs
> ```
>
> This seems straightforward enough, but it is not good Haskell style. The problem is that it is
>
> - doing too much at once; and
> - working at too low of a level.
>
> Instead of thinking about what we want to do with each element, we can instead think about making incremental transformations to the entire input, using the existing recursion patterns that we know of. Here's a much more idiomatic implementation of `foobar`:
>
> ```haskell
> foobar' :: [Integer] -> Integer
> foobar' = sum . map (\x -> 7*x + 2) . filter (>3)
> ```
>
> This defines `foobar'` as a "pipeline" of three functions: first, we throw away all elements from the list which are not greater than three; next, we apply an arithmetic operation to every element of the remaining list; finally, we sum the results.

A quick check that the two agree: for `[1, 4, 5]`, `foobar` skips `1` and computes `(7*4 + 2) + (7*5 + 2) + 0 = 67`, and `foobar'` filters to `[4, 5]`, maps to `[30, 37]` and sums to `67`. The recipe is the one used for Collatz: name each job the recursion was doing (selecting, transforming, combining), find the library function for each, and compose them. The pipeline reads right to left, like the composition it is (see [Composition]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#composition)).

A common misconception is that the pipeline makes three passes and builds two intermediate lists. It doesn't make three passes: laziness pulls each element through `filter`, `map` and `sum` one at a time, and GHC's foldr/build list fusion can often remove the intermediate lists when compiling with optimization; Coutts et al. 2007 (section 1.1) review it and what it cannot fuse. Explicit recursion is still the right tool when no standard pattern fits, for example a loop that carries several pieces of state and stops early.

## Open tasks


- [ ] Write up the Collatz refactoring as a step-by-step worked example: how to do it, and how to spot the code that needs it.

See also: [Writing recursive functions]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#writing-recursive-functions) and [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds) for the recursion patterns used here, [Composition]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#composition) for pipelines, [Parse, don't validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) for the design rule behind `NonEmptyList`, [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}) for `Maybe` and `Either`, [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}) for checking that a refactoring keeps the behaviour, and [Exercises and projects]({{< ref "functional-programming/05-practice/exercises-and-projects" >}}) for a refactoring project.

## Library sources


- [Gibbons 2002](/sources/programming/functional-programming/gibbons-2002-calculating-functional-programs.pdf.enc), *Calculating Functional Programs*: rewriting programs step by step with equational reasoning, so that each refactoring is a proof that the behaviour is unchanged; sections 1.1, "Why calculate programs?", and 1.2, "Functional programming", on programs as equations whose parts can be replaced by equal expressions, and section 2.5, "Properties of folds", on the fusion and identity laws of folds; on *Wholemeal programming*.
- [Coutts et al. 2007](/sources/programming/functional-programming/coutts-2007-stream-fusion.pdf.enc), *Stream Fusion: From Lists to Streams to Nothing at All*: section 1.1, "Short-cut fusion", on GHC's foldr/build fusion and what it cannot fuse (left folds such as `sum`, zips); sections 2 and 3 on stream fusion, which fuses those too; on *Wholemeal programming*.
- [Hutton 1999](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc), *A tutorial on the universality and expressiveness of fold*: section 3.3, "Universality as a definition principle", turns explicitly recursive definitions into folds step by step, and section 5, "Using fold to generate functions", shows that an accumulator-passing helper (`suml'`) is itself a fold; on *Recognising code that needs refactoring* (explicit recursion and hand-written accumulators).
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*: chapter 8, section "Total Functions": a partial function becomes total either by restricting its input or by extending its output, which are the `NonEmptyList` and `safeHead` options under Partial functions.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: section 13.2.1, Safety in Haskell programs: `head` as unsafe, `Maybe` and `NonEmpty` as safer alternatives, and the cost that safer interfaces are less convenient to use.
- [Bird and Gibbons 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*: chapter 1, section 1.3, "Inductive and recursive definitions", defines loops as `until p f` and `while`; section 1.4, "Fusion", fuses `map`, `concatMap` and `foldr` pipelines into single traversals with the fusion law of `foldr`, the equational version of the "not three passes" point; section 1.5, "Accumulating and tupling", on accumulating parameters and tupling; on *Wholemeal programming* and *Splitting the jobs*.
- [Hinze et al. 2010](/sources/programming/functional-programming/hinze-2010-theory-and-practice-of-fusion.pdf.enc), *Theory and Practice of Fusion*: section 1 starts from the pipeline `sum . map sq . filter odd . between`, writes out the hand-fused loop, and explains why a compiler cannot fuse recursive definitions unless they use a standard recursion scheme; section 5.5 fuses the same pipeline; on *Wholemeal programming*.
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: section 4, "Gluing Programs Together": in `g . f` the two run in strict synchronization, `f` producing only what `g` asks for, so a pipeline holds no full intermediate list; section 3 composes `sum . map sum` the same way; on *Wholemeal programming*.
- [Gibbons 2003](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc), *Origami programming*: section 3.3, "Origami by numbers: loops": `unfoldN p f x` counts the iterations of `f` until `p` holds (the minimisation function, which is the Collatz step count), `until` is a fold after that unfold with the count deforested away, and this is why such loops go beyond primitive recursion; on *Splitting the jobs*.
- King 2019, *Parse, don't validate*: section "Turning partial functions total": `head` fixed either by weakening its result to `Maybe` or by strengthening its argument to `NonEmpty`, why the second is better (`head' = fmap head . nonEmpty`, but not the reverse), and parsing once where the input arrives; on *Partial functions*.

Further reading:

- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: section 8.3, "Bottom", on partial against total functions and `Maybe` as the fix; section 9.3, "Pattern matching on lists", on `safeTail` and rewriting `myHead` with `Maybe`; section 15.13 on `data NonEmpty a = a :| [a]`; on *Partial functions*.
- [Elliott 2013](/sources/programming/functional-programming/elliott-2013-folds-and-unfolds-all-around-us.pdf.enc), *Folds and unfolds all around us*: slides 10, "Factorial again", and 11, "Combining unfold and fold", turn a recursive factorial into `product [1..n]`, a fold after an unfold (a hylomorphism), under the theme "replace control structures by data structures"; on *Wholemeal programming*.
- King 2020, *Names are not type safety*: section "Newtypes as tokens": a newtype plus smart constructor protects its invariant only when the constructor is not exported, and even then only as far as its module can be trusted; on *Splitting the jobs*.
