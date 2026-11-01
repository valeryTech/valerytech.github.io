---
draft: false
toc: true
title: "Recursion and Folds in Functional Programming"
aliases:
  - "/functional-programming/recursion-and-folds/"
description: "Writing recursive functions with pattern matching and accumulators, map as abstracted recursion, foldr and foldl with their corner cases, Foldable, and combinators built from folds."
linkTitle: "Recursion and Folds"
---

How to write recursive functions, and the patterns that abstract recursion away: `map`, folds and `Foldable`, and functional combinators built from folds.

## Writing recursive functions


Will Kurt's *Get Programming with Haskell* (the lesson on rules for recursion) gives five rules:

> Rule 1: Identify the end goal(s)
>
> Generally, recursive processes come to an end. What does this end look like? For a list, the end of the process is the empty list.
>
> Rule 2: Determine what happens when a goal is reached.
>
> With functions, you need to return a value, so you have to determine *what value* should be returned at the end state. A typical problem programmers face is trying to think of the goal state in terms of being the end of a long recursive process. This is usually unnecessary and overly complicated. Often the answer is obvious when you ask the question, "What happens if I call my function on the goal state value?"
>
> Rule 3: List all alternate possibilities
>
> If you aren't at your goal state, what do you have? This sounds like it can be a lot of work, but most of the time you have only one or two alternatives to being in the goal state. If you don't have an empty list, you have a list with something in it.
>
> Rule 4: Determine your "Rinse and Repeat"
>
> This rule is nearly identical to rule 2, except you have to repeat your process. Don't overthink or try to unwind the recursion. For a list, you might take the element and look at the tail.
>
> Rule 5: Ensure that each alternative moves you toward the goal
>
> This is a big one! For every process you list in rule 4, you need to ask yourself, "Does this move me closer to the goal?" If you keep taking the tail of a list, you'll get the empty list.

Rules 1 and 2 give the base case, rules 3 and 4 the recursive case, and rule 5 is the termination argument.

Caveat: the rules fit structural recursion, where every call works on a smaller piece of the input, such as the tail of a list. Then rule 5 holds automatically. For general recursion rule 5 can be hard or impossible to check. The Collatz function in [Collatz]({{< ref "functional-programming/05-practice/functional-refactoring" >}}#collatz) is the famous case: whether its recursion reaches 1 for every positive starting number is an open problem.

### Pattern matching


Pattern matching makes recursion much easier to write: each case from the rules becomes one clause, so the definition reads like the rules.

```haskell
myLength :: [a] -> Int
myLength []     = 0                 -- rules 1 and 2: the goal and its value
myLength (_:xs) = 1 + myLength xs   -- rules 3 to 5: the other case, repeated on the shorter tail
```


With `-Wincomplete-patterns` (part of `-Wall`), GHC also warns when a case from rule 3 is missing.

*Land of Lisp* says that "recursive functions are list eaters". Any trace of a list recursion shows why: each call eats the head of the list and passes the rest on, until nothing is left and the base case answers.

### Tail recursion and accumulators


A function like `myLength` is not tail-recursive: after the recursive call returns, it still has to add 1. The common pattern for turning a recursive function that accumulates a result into a tail-recursive one:

1. Write a helper with an extra parameter, the accumulator, that holds the result so far.
2. In the recursive case, do the work on the accumulator *before* the call, so the recursive call is the last thing the function does.
3. In the base case, return the accumulator.
4. Call the helper from the original function with the initial accumulator (`0` for a sum, `Nil` for a list).

```scala
import scala.annotation.tailrec

def sum(xs: List[Int]): Int =
  @tailrec
  def go(rest: List[Int], acc: Int): Int = rest match
    case Nil    => acc
    case h :: t => go(t, acc + h)
  go(xs, 0)
```


In Scala, `@tailrec` doesn't make a function tail-recursive; it makes compilation fail if it isn't, which is what you want. The compiler only turns self-recursive calls into loops. The JVM has no general tail-call elimination, so mutual recursion needs a trampoline such as `scala.util.control.TailCalls`.

In Haskell the trade-off differs. A lazy accumulator can grow into a chain of thunks (see `foldl'` under [foldr and foldl](#foldr-and-foldl)), and a function that produces a constructor before recursing, like `map`, is often better than a tail-recursive one.

## Abstracting recursion with map


Two functions with the same shape that differ only in what they do to each element:

```haskell
squareAll []     = []
squareAll (x:xs) = x ^ 2 : squareAll xs

addAnA []     = []
addAnA (x:xs) = ("a " ++ x) : addAnA xs

-- the varying part becomes a parameter:
myMap _ []     = []
myMap f (x:xs) = f x : myMap f xs
```


Remove the concatenating and the squaring function, replace them with an `f` for any function, and you get the definition of `map`. Now `squareAll = myMap (^ 2)` and `addAnA = myMap ("a " ++)`. The same refactoring move for functions in general is in [Small functions as parameters]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#small-functions-as-parameters).

It is common to use a fold and `map` together. `sumOfSquares` squares every value in a list and then takes the sum:

```haskell
sumOfSquares :: [Int] -> Int
sumOfSquares xs = foldl (+) 0 (map (^ 2) xs)
```


In practice write `sum (map (^ 2) xs)`, or use `foldl'`: plain `foldl` builds unevaluated thunks (see [foldr and foldl](#foldr-and-foldl)). Mapping and then folding doesn't mean two passes over the list: laziness interleaves them, and GHC's list fusion can often remove the intermediate list.

## Folds


`map` and `filter` are simple recursive functions, but they handle each element independently: they can't carry any state from element to element. A fold can. It is the standard operator that captures a simple pattern of recursion over a list, carrying an accumulator from element to element and combining the elements into a result.

### Structure of a fold


A fold has two structural parts, the initial accumulator value and the folding function, and they are connected through their types. In

```haskell
foldr :: (a -> b -> b) -> b -> [a] -> b
```


the initial value, the second argument and the result of the folding function, and the final result all have the same type `b`. So the initial value fixes what the fold produces: `foldr (\x acc -> x : acc) []` returns a list because `[]` is a list, and `foldr (\x acc -> x + acc) 0` returns a number. The initial value is usually the identity of the folding operation: `0` for `+`, `1` for `*`, `[]` for `++` (see [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid)).

**A type-driven reading.** One article on folds (which one was not recorded) analyses the parts of the type signature and names each one:

```haskell
foldl :: (a -> b -> a) -> a -> [b] -> a

foldl ::
  (result -> item -> result) -> -- Folding Function
  result ->                      -- Initial Result
  [item] ->                      -- List of inputs
  result                         -- Final Result
```


The same type can be read as `foldl :: (a -> b -> a) -> a -> ([b] -> a)`. This uses currying: given a folding function and an initial result, `foldl` returns a function from lists to results. So `foldl (+) 0` is itself a function, `[Int] -> Int`, which you can name, pass around or compose.

These are the list-only signatures. Since GHC 7.10 the Prelude's folds work on any `Foldable` container: `foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b`. The Prelude uses `b` for the accumulator and `a` for the items, the reverse of the version above.

**Deriving a function from its results.** An interesting approach to designing functions: start from what the function must return and construct the function from that. This is the *universal property of fold* from Hutton's tutorial (Hutton 1999). For finite lists, `g = foldr f v` holds exactly when `g [] = v` and `g (x:xs) = f x (g xs)`. So from what `g` must return you can read off `v` and `f`, and get `g` as a fold. For `length`: `length [] = 0` gives `v = 0`, and `length (x:xs) = 1 + length xs` gives `f _ n = 1 + n`, hence `length = foldr (\_ n -> 1 + n) 0`.

### foldr and foldl


Folds on lists are structural transformations. A list `[1,2,3]` is the tree `1 : (2 : (3 : []))`, and the two folds turn it into two different trees:

```
  list             foldr f z         foldl f z
   :                  f                   f
  / \                / \                 / \
 1   :              1   f               f   3
    / \                / \             / \
   2   :              2   f           f   2
      / \                / \         / \
     3   []             3   z       z   1
```


`foldr` keeps the shape of the list: it replaces every `:` with `f` and the final `[]` with `z`, giving `f 1 (f 2 (f 3 z))`. It associates to the right. `foldl` builds the mirror image, nested to the left with `z` innermost, giving `f (f (f z 1) 2) 3`. With `f` written infix:

```
foldl f z [x1, x2, ..., xn] = (... ((z `f` x1) `f` x2) `f` ...) `f` xn
foldr f z [x1, x2, ..., xn] = x1 `f` (x2 `f` ... (xn `f` z) ...)
```


The definitions explain the shapes:

```haskell
foldr f z []     = z
foldr f z (x:xs) = f x (foldr f z xs)

foldl f z []     = z
foldl f z (x:xs) = foldl f (f z x) xs
```


`foldr` hands `f` the first element and, as its second argument, the not-yet-computed fold of the rest. If `f` doesn't need that argument, the rest is never folded: `foldr (\x _ -> Just x) Nothing [1..]` returns `Just 1` even on an infinite list. `foldl` is tail-recursive: it combines into the accumulator and moves on, and returns nothing until it has reached the end of the list.

**The problem with `foldr` on a strict operation.** A trace of a sum:

```
foldr (+) 0 [1..1000000]
--> 1 + foldr (+) 0 [2..1000000]
--> 1 + (2 + foldr (+) 0 [3..1000000])
--> ...
```


`+` needs both of its arguments, so none of the additions in `1 + (2 + (3 + ...))` can be done until the end of the list is reached. Each pending `1 +`, `2 +`, `3 +` waits on the stack, so memory use grows with the length of the list. In older GHC versions, with their small default stack limit, a list of a million elements overflowed the stack. Current GHC versions set a much larger default limit, so the example usually no longer crashes, but memory still grows with the list.

**`foldl` is not the fix; `foldl'` is.** The first idea is a fold that associates the other way, `foldl f z [1,2,3] = f (f (f z 1) 2) 3`. But plain `foldl` is lazy in the accumulator: it builds the thunk `((0 + 1) + 2) + ...`, and evaluating that thunk at the end needs the same deep stack. To avoid relying on the optimizer, make the fold evaluate `f z x` first:

```haskell
foldl' f z []     = z
foldl' f z (x:xs) = let y = f z x in seq y (foldl' f y xs)
```


`seq y rest` evaluates `y` before returning `rest`, so the accumulator is a computed value at every step and no chain of thunks builds up. This is `foldl'` from `Data.List` and `Data.Foldable`. "Relying on the optimizer" refers to GHC's strictness analysis, which, with `-O`, often makes plain `foldl (+) 0` strict on its own. It doesn't apply in GHCi or without optimization, which is why `foldl'` is the safe choice.

`seq` is not a hint: it guarantees the evaluation. It only evaluates to weak head normal form, though. With a pair as the accumulator, `foldl'` evaluates the pair constructor but not its components, which can still grow as thunks (see [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}})).

In practice: use `foldr` to build lazy results or stop early (`map`, `filter`, `any`, `concat`), `foldl'` to compute one strict value (sums, counts, maxima), and plain `foldl` almost never.

### Corner cases


The main corner case is the empty structure. `foldr` and `foldl` return the initial value, but `foldr1`, `foldl1`, `maximum` and `minimum` have no initial value and throw an exception on an empty list.

### Using folds


A fold is the functional replacement for a for-loop that updates a variable: `total = 0; for x in xs: total += x` is `foldl' (+) 0 xs`, with the accumulator playing the variable.

Adding a list to a set is a fold with the set as accumulator:

```haskell
import qualified Data.Set as Set

addAll :: Ord a => [a] -> Set.Set a -> Set.Set a
addAll xs s = foldr Set.insert s xs
```


In Scala, `xs.foldLeft(s)(_ + _)`. For an empty starting set, `Set.fromList xs` or `xs.toSet` already does this.

### Foldable


`Foldable` generalizes folding from lists to any container whose elements can be visited in order: `Maybe`, `Map k`, `Set`, trees, and more. An instance needs only `foldMap` or `foldr`; `sum`, `length`, `elem`, `maximum`, `toList` and the rest come for free.

`foldMap` is where monoids come in: it folds a data structure by mapping each element into a monoid, then combining everything with `<>`, starting from `mempty`.

```haskell
import Data.Monoid (Sum (..), All (..))

-- foldMap :: (Foldable t, Monoid m) => (a -> m) -> t a -> m

getSum (foldMap Sum [1, 2, 3])       -- 6
getAll (foldMap (All . even) [2, 4]) -- True
```


Because the operation is associative, the container is free to group the combinations however suits its shape (see [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid)).

Caveat: tuples and `Either` are `Foldable` over their last component only, so `length (1, 2)` is `1` and `sum (Right 3)` is `3`. Generic folds then type-check on values where a list was meant.

**`foldM`.** `foldM` (from `Control.Monad`) is a left fold whose step function returns a monadic result, so each step can fail, log or do I/O:

```haskell
foldM :: (Foldable t, Monad m) => (b -> a -> m b) -> b -> t a -> m b

divideAll :: Int -> [Int] -> Maybe Int
divideAll = foldM step
  where step _   0 = Nothing
        step acc d = Just (acc `div` d)

divideAll 100 [2, 5]    -- Just 10
divideAll 100 [2, 0, 5] -- Nothing: the first failure stops the fold
```


**Related classes: [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}) and [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}).** `Foldable` doesn't require `Functor`, but the two meet in `Traversable`, which needs both and uses `Applicative` to rebuild the structure: `traverse :: (Traversable t, Applicative f) => (a -> f b) -> t a -> f (t b)`. Its fold-only cousin `traverse_ :: (Foldable t, Applicative f) => (a -> f b) -> t a -> f ()` runs an effect for each element and keeps no structure.

### Reading


The best single reading on the universal property and on how much can be written as a fold is Hutton's tutorial, *A tutorial on the universality and expressiveness of fold* ([PDF](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc)).

- Haskell wiki, Fold: <https://wiki.haskell.org/Fold>
- Haskell wiki, Foldr Foldl Foldl': <https://wiki.haskell.org/Foldr_Foldl_Foldl%27>
- Haskell wiki, Foldl as foldr: <https://wiki.haskell.org/Foldl_as_foldr>
- Monday Morning Haskell, "First try: fold" (2022): <https://mmhaskell.com/blog/2022/4/7/first-try-fold>
- Monday Morning Haskell, "Using scans to accumulate" (2022): <https://mmhaskell.com/blog/2022/4/14/using-scans-to-accumulate>
- Well-Typed, "Fixing foldl" (2014): <https://well-typed.com/blog/2014/04/fixing-foldl/>

## Functional combinators


- Stack Overflow, "Explanation of combinators for the working man": <https://stackoverflow.com/questions/7533837/explanation-of-combinators-for-the-working-man>

"Combinator" has two senses. In the strict sense, from combinatory logic, a combinator is a function with no free variables, defined only in terms of its arguments. In Scala usage it has come to mean any higher-order function for building larger computations from smaller ones, such as `map`, `filter` and `fold`.

### Generalized functional combinators


`map` written as a right fold, the same construction as `myMap` in Haskell:

```scala
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
def timesTwo(i: Int): Int = i * 2

def ourMap(numbers: List[Int], fn: Int => Int): List[Int] =
  numbers.foldRight(List[Int]()) { (x: Int, xs: List[Int]) =>
    fn(x) :: xs
  }

ourMap(numbers, timesTwo(_))
// List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```


Start from the empty list and, for each element from the right, put `fn(x)` in front of what has been built. `filter`, `flatMap`, `reverse`, `length` and `sum` can all be written the same way, which is the sense in which fold is the general combinator.

Caveat: the example is only stack-safe because the standard library implements `foldRight` on `List` by reversing the list and folding left. A naive recursive `foldRight` would overflow on long lists.

## Open tasks


- [ ] Review the explanation under [foldr and foldl](#foldr-and-foldl) of the two list shapes the folds produce and how their different mechanisms produce them. #todo
- [ ] Fold study outline: definition, problems, applications, corner cases, types, type deconstruction. Most of it is covered above (definition and problems under foldr and foldl, applications under Using folds, types under Structure of a fold, corner cases under Corner cases); "type deconstruction" may refer to the type-driven reading under Structure of a fold (needs checking).

See also: [Functions and composition]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}) for higher-order functions and pipelines, [Wholemeal programming]({{< ref "functional-programming/05-practice/functional-refactoring" >}}#wholemeal-programming) for replacing explicit recursion with list functions, [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}) for thunks and `seq`, [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid), [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}) and [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}), and [Traversable and traverse]({{< ref "functional-programming/02-abstractions/traversable" >}}) for `traverse`, the effectful relative of folds.

## Library sources


- [Hutton 1999](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc), *A tutorial on the universality and expressiveness of fold*: the universal property of fold and how to derive functions as folds; presumably the "pdf article" in the original reading list.
- [Gibbons 2003](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc), *Origami programming*: folds and unfolds generalized from lists to other data types.
- [Meijer et al. 1991](/sources/programming/functional-programming/meijer-1991-functional-programming-with-bananas-lenses.pdf.enc), *Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire*: folds as catamorphisms, the general theory behind abstracting recursion.
- [jooohn 2018](/sources/programming/scala/jooohn-2023-why-foldright-is-beautiful.pdf.enc), *Why foldRight is beautiful*: `foldRight` in Scala, on the `ourMap` example.
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: the chapters on recursion and on folding lists.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 1, section "Looping", replaces loops with recursion; chapter 2, Working with Lists, writes `foldl` and `foldr` by hand, starting from an explicit `reduce`, and compares how they associate.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 2, section 2.3.4, Folding and traversing: the `Foldable` class, with `foldMap` and `foldr` as the methods an instance must define; on Foldable.
- Płachta 2022, *Grokking Functional Programming*: chapter 4, sections on `foldLeft` ("Reducing many values into a single one using foldLeft", "foldLeft must-knows"), the Scala side of Using folds; chapter 9 on recursive functions and infinity.

Further reading:

- [Bird and Gibbons 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*
- [Gibbons and Jones 1998](/sources/programming/functional-programming/gibbons-1998-the-under-appreciated-unfold.pdf.enc), *The Under-Appreciated Unfold*
- [Elliott 2013](/sources/programming/functional-programming/elliott-2013-folds-and-unfolds-all-around-us.pdf.enc), *Folds and unfolds all around us*
- [Zhang 2021](/sources/programming/functional-programming/zhang-2021-structural-induction-tutorial.pdf.enc), *Structural induction tutorial (CPCS449)*
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*
