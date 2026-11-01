---
draft: false
toc: true
title: "Refactoring Functional Code in Haskell"
aliases:
  - "/functional-programming/functional-refactoring/"
description: "Refactoring examples in Haskell: splitting a Collatz step counter into separate jobs, replacing partial functions with types that carry the guarantee, and wholemeal programming."
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

The input check can move into a type as well. A `Positive` newtype with a smart constructor makes the check happen once, so functions that take a `Positive` never see a bad input. This is the same move as under [Partial functions](#partial-functions).

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

The two options match the general rule in Wlaschin 2018: a partial function becomes total either by extending its output (`safeHead`) or by restricting its input (`NonEmptyList`). As a design rule, the second is [Parse, don't validate]({{< ref "type-driven-design/parse-dont-validate" >}}).

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

A common misconception is that the pipeline makes three passes and builds two intermediate lists. It doesn't make three passes: laziness pulls each element through `filter`, `map` and `sum` one at a time, and GHC's list fusion can often remove the intermediate lists entirely when compiling with optimization (Coutts et al. 2007). Explicit recursion is still the right tool when no standard pattern fits, for example a loop that carries several pieces of state and stops early.

## Open tasks


- [ ] Write up the Collatz refactoring as a step-by-step worked example: how to do it, and how to spot the code that needs it.

See also: [Writing recursive functions]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#writing-recursive-functions) and [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds) for the recursion patterns used here, [Composition]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#composition) for pipelines, [Parse, don't validate]({{< ref "type-driven-design/parse-dont-validate" >}}) for the design rule behind `NonEmptyList`, [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}) for `Maybe` and `Either`, [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}) for checking that a refactoring keeps the behaviour, and [Exercises and projects]({{< ref "functional-programming/05-practice/exercises-and-projects" >}}) for a refactoring project.

## Library sources


- [Gibbons 2002](/sources/programming/functional-programming/gibbons-2002-calculating-functional-programs.pdf.enc), *Calculating Functional Programs*: rewriting programs step by step with equational reasoning, so that each refactoring is a proof that the behaviour is unchanged.
- [Coutts et al. 2007](/sources/programming/functional-programming/coutts-2007-stream-fusion.pdf.enc), *Stream Fusion: From Lists to Streams to Nothing at All*: how compilers remove the intermediate lists of pipelines like `foobar'`.
- [Hutton 1999](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc), *A tutorial on the universality and expressiveness of fold*: turning explicit recursion into folds, with proofs.
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*: chapter 8, section "Total Functions": a partial function becomes total either by restricting its input or by extending its output, which are the `NonEmptyList` and `safeHead` options under Partial functions.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: section 13.2.1, Safety in Haskell programs: `head` as unsafe, `Maybe` and `NonEmpty` as safer alternatives, and the cost that safer interfaces are less convenient to use.

Further reading:

- [Bird and Gibbons 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*
- [Hinze et al. 2010](/sources/programming/functional-programming/hinze-2010-theory-and-practice-of-fusion.pdf.enc), *Theory and Practice of Fusion*
