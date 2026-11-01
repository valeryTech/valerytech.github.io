---
draft: false
toc: true
title: "Recursion And Folds"
linkTitle: "Recursion And Folds"
---

Writing recursive functions, and the patterns that abstract recursion away: map, folds and Foldable, and functional combinators built from folds.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Writing recursive functions


Rule 1: Identify the end goal(s)

Generally, recursive processes come to an end. What does this end look like? For a list,

the end of the process is the empty list

Rule 2: Determine what happens when a goal is reached.

With functions, you need to return a value, so you have to determine *what value* should be returned at the end state. A typical problem programmers face is trying to think of the goal state in terms of being the end of a long recursive process. This is usually unneces- sary and overly complicated. Often the answer is obvious when you ask the question, "What happens if I call my function on the goal state value?"

Rule 3: List all alternate possibilities

If you aren't at your goal state, what do you have? This sounds like it can be a lot of

work, but most of the time you have only one or two alternatives to being in the goal

state. If you don't have an empty list, you have a list with something in it.

Rule 4: Determine your "Rinse and Repeat"

This rule is nearly identical to rule 2, except you have to repeat your process. Don't over-

think or try to unwind the recursion. For a list, you might take the element and look at

the tail.

Rule 5: Ensure that each alterative moves you toward the goal

This is a big one! For every process you list in rule 4, you need to ask yourself, "Does

this move me closer to the goal?" If you keep taking the tail of a list, you'll get the empty

list.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The five rules are from Will Kurt's *Get Programming with Haskell* (the lesson on rules for recursion). Rules 1 and 2 give the base case, rules 3 and 4 the recursive case, and rule 5 is the termination argument.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The rules fit structural recursion, where every call works on a smaller piece of the input, such as the tail of a list. Then rule 5 holds automatically. For general recursion rule 5 can be hard or impossible to check. The Collatz function in [Functional Refactoring]({{< ref "functional-programming/functional-refactoring" >}}#collatz) is the famous case: whether its recursion reaches 1 for every positive starting number is an open problem.
{{< /callout >}}


Pattern matching is a wonderful way to alleviate the pain and symptoms of

recursion.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Each case from the rules becomes one clause, so the definition reads like the rules:

```haskell
myLength :: [a] -> Int
myLength []     = 0                 -- rules 1 and 2: the goal and its value
myLength (_:xs) = 1 + myLength xs   -- rules 3 to 5: the other case, repeated on the shorter tail
```

With `-Wincomplete-patterns` (part of `-Wall`), GHC also warns when a case from rule 3 is missing.
{{< /callout >}}


The book, Land of Lisp states, "recursive functions are list eaters," and this output shows why that statement is true.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"This output" isn't recorded here. The image works for any trace of a list recursion: each call eats the head of the list and passes the rest on, until nothing is left and the base case answers.
{{< /callout >}}

### Tail recursion and accumulators


Now that you know the current approach isn't tail-recursive, the question becomes, "How do I make it tail-recursive?"

A common pattern used to make a recursive function that "accumulates a result" into a tail-recursive function is to follow these steps:

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The steps themselves weren't copied. The usual recipe:

1. Write a helper with an extra parameter, the accumulator, that holds the result so far.
2. In the recursive case, do the work on the accumulator *before* the call, so the recursive call is the last thing the function does.
3. In the base case, return the accumulator.
4. Call the helper from the original function with the initial accumulator (`0` for a sum, `Nil` for a list).

```scala
import scala.annotation.tailrec

def sum(xs: List[Int]): Int = {
@tailrec
def go(rest: List[Int], acc: Int): Int = rest match {
case Nil    => acc
case h :: t => go(t, acc + h)
}
go(xs, 0)
}
```
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
In Scala, `@tailrec` doesn't make a function tail-recursive; it makes compilation fail if it isn't, which is what you want. The compiler only turns self-recursive calls into loops; the JVM has no general tail-call elimination, so mutual recursion needs a trampoline such as `scala.util.control.TailCalls`. In Haskell the trade-off differs: a lazy accumulator can grow into a chain of thunks (see `foldl'` below), and a function that produces a constructor before recursing, like `map`, is often better than a tail-recursive one.
{{< /callout >}}

## Abstracting recursion with map


Abstracting away recursion with map.

If you go ahead and remove the concatenating and squaring function, replacing them

with an f for any function, you end up with the definition of map!

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
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

Now `squareAll = myMap (^ 2)` and `addAnA = myMap ("a " ++)`.
{{< /callout >}}


It's common to use foldl and map together. For example, you can create sumOfSquares, which

squares every value in a list and then takes the sum of it:

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The definition that the passage leads to:

```haskell
sumOfSquares :: [Int] -> Int
sumOfSquares xs = foldl (+) 0 (map (^ 2) xs)
```
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
In practice write `sum (map (^ 2) xs)`, or use `foldl'`: plain `foldl` builds unevaluated thunks (see Folds). Mapping and then folding doesn't mean two passes over the list: laziness interleaves them, and GHC's list fusion can often remove the intermediate list.
{{< /callout >}}

## Folds


`map` and `fold` is an example of simple recurcive functions. However, they have a major limitation in that they don't let us carry any kind of state from element to element. In order to get this, we'll need the idea of a **Fold**. fold is a standard operator that encapsulates a simple pattern of recursion for processing lists.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The first sentence is presumably about `map` and `filter`; a fold is exactly the operator that does carry state, the accumulator, from element to element, so it can't be the limited one. Read that way, the passage holds: `map` and `filter` handle each element independently, a fold combines them.
{{< /callout >}}

### Structure of a fold


**First wording**

We are talking about structural elements of a fold operator: initial accumulator value and folding function. There is a connection between initial accumulator value and a type of a folding function.

**Alternative wording**

We're discussing the structural components of a fold operator: the initial accumulator value and the folding function. There exists a correlation between the both.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The connection is through the accumulator type. In `foldr :: (a -> b -> b) -> b -> [a] -> b`, the initial value, the second argument and the result of the folding function, and the final result all have the same type `b`. So the initial value fixes what the fold produces: `foldr (\x acc -> x : acc) []` returns a list because `[]` is a list, `foldr (\x acc -> x + acc) 0` a number. The initial value is usually the identity of the folding operation: `0` for `+`, `1` for `*`, `[]` for `++` (see [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid)).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The alternative wording loses the point. "A correlation between the both" doesn't say what is connected; the first wording says it is a connection of *types*, which is the useful part.
{{< /callout >}}


**Type-Driven Approach**

In one of the articles about folds authors analyse the parts of type signature and distinguish folding function:

```haskell
foldl :: (a -> b -> a) -> a -> [b] -> a
```

\(\downarrow\)

```haskell
foldl ::
  (result -> item -> result) -> -- Folding Function
  result -> -- Initial Result
  [item] -> -- List of inputs
  result -- Final Result
```

or `foldl :: (a -> b -> a) -> a -> ([b] -> a)`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The last form uses currying: given a folding function and an initial result, `foldl` returns a function from lists to results. So `foldl (+) 0` is itself a function, `[Int] -> Int`, which you can name, pass around or compose.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
These are the list-only signatures. Since GHC 7.10 the Prelude's folds work on any `Foldable` container: `foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b`. Note also that the Prelude uses `b` for the accumulator and `a` for the items, the reverse of the note's version.
{{< /callout >}}


Here is an interesting _approach_ to designing functions: we are given a function result and use it to construct function itsels.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The context is lost, but this matches the *universal property of fold* from Hutton's tutorial (see Library sources). For finite lists, `g = foldr f v` holds exactly when `g [] = v` and `g (x:xs) = f x (g xs)`. So from what `g` must return you can read off `v` and `f`, and get `g` as a fold. For `length`: `length [] = 0` gives `v = 0`, and `length (x:xs) = 1 + length xs` gives `f _ n = 1 + n`, hence `length = foldr (\_ n -> 1 + n) 0`.
{{< /callout >}}

### foldr and foldl


Open task: rewrite the explanation of the two resulting list-folding structures and how they are produced by the different mechanisms of `foldl` and `foldr`. #todo

List folds as structural transformations

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A proposed explanation for the todo. A list `[1,2,3]` is the tree `1 : (2 : (3 : []))`. The two folds turn it into two different trees:

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

`foldr` keeps the shape of the list: it replaces every `:` with `f` and the final `[]` with `z`, giving `f 1 (f 2 (f 3 z))`. `foldl` builds the mirror image, nested to the left with `z` innermost, giving `f (f (f z 1) 2) 3`.

The mechanisms explain the shapes. `foldr f z (x:xs) = f x (foldr f z xs)` hands `f` the first element and, as its second argument, the not-yet-computed fold of the rest. If `f` doesn't need that argument, the rest is never folded: `foldr (\x _ -> Just x) Nothing [1..]` returns `Just 1` even on an infinite list. `foldl f z (x:xs) = foldl f (f z x) xs` is tail-recursive: it combines into the accumulator and moves on, and returns nothing until it has reached the end of the list.

In practice: use `foldr` to build lazy results or stop early (`map`, `filter`, `any`, `concat`), `foldl'` to compute one strict value (sums, counts, maxima), and plain `foldl` almost never.
{{< /callout >}}


`foldr` associates to the right, i.e. `foldr f z [1,2,3] = f 1 (f 2 (f 3 z))`

```haskell
foldr (+) 0 [1, 2, 3, 4] --> 
1 + (foldr (+) 0 [2, 3, 4]) --> 
1 + (2 + (foldr (+) 0 [3..1000000])) --> 
```


1. 2, 3, -> pushing to the stack

problem roots and description

foldr to the resque

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`+` needs both of its arguments, so none of the additions in `1 + (2 + (3 + ...))` can be done until the end of the list is reached. Each pending `1 +`, `2 +`, `3 +` waits on the stack. That is the problem: for a long list, memory use grows with the list's length, and in older GHC versions, with their small default stack limit, a list of a million elements overflowed the stack.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The trace mixes two examples: it starts on `[1, 2, 3, 4]` and switches to `[3..1000000]`, which belongs to a trace that starts from `[1..1000000]`. And "foldr to the rescue" is presumably a slip for `foldl`, which is what the text below turns to. Plain `foldl` doesn't rescue anything either, though: it builds the thunk `((0 + 1) + 2) + ...`, and evaluating that thunk at the end needs the same deep stack. The actual fix is `foldl'`. Current GHC versions set a much larger default stack limit, so the example usually no longer crashes, but memory still grows with the list.
{{< /callout >}}


So what do we do? Well, to start with we could write a function that associates things the other way:

```
foldl f z [1,2,3] = (f (f (f z 1) 2) 3)
```

How does it work?

```haskell
foldl f z [] = z
foldl f z (x:xs) = foldl f (f z x) xs
```

If we don't want to fully rely on the optimizer, we can make a version that hints to the compiler that it ought to evaluate the `f z x` first:

```haskell
foldl' f z [] = z
foldl' f z (x:xs) = let y = f z x in seq y (foldl' f y xs)
```

Another way:

```haskell
foldl f z [x1, x2, ..., xn] = (... ((z `f` x1) `f` x2) `f`...) `f` xn
foldr f z [x1, x2, ..., xn] = x1 `f` (x2 `f` ... (xn `f` z)...)
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`seq y rest` evaluates `y` before returning `rest`, so the accumulator is a computed value at every step and no chain of thunks builds up. This is `foldl'` from `Data.List` and `Data.Foldable`. "Rely on the optimizer" refers to GHC's strictness analysis, which, with `-O`, often makes plain `foldl (+) 0` strict on its own. It doesn't apply in GHCi or without optimization, which is why `foldl'` is the safe choice.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Hints" undersells it: `seq` is not a hint, it guarantees the evaluation. It only evaluates to weak head normal form, though: with a pair as the accumulator, `foldl'` evaluates the pair constructor but not its components, which can still grow as thunks (see [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}})).
{{< /callout >}}

### Using folds


**Usage**

for-cycles

add list to set

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A fold is the functional replacement for a loop that updates a variable: `total = 0; for x in xs: total += x` is `foldl' (+) 0 xs`, with the accumulator playing the variable. Adding a list to a set is a fold with the set as accumulator:

```haskell
import qualified Data.Set as Set
addAll :: Ord a => [a] -> Set.Set a -> Set.Set a
addAll xs s = foldr Set.insert s xs
```

In Scala, `xs.foldLeft(s)(_ + _)`. For an empty starting set, `Set.fromList xs` or `xs.toSet` already does this.
{{< /callout >}}

### Foldable


Foldable structures

Foldable class

Using monoids to fold data structures

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`Foldable` generalizes folding from lists to any container whose elements can be visited in order: `Maybe`, `Map k`, `Set`, trees, and more. An instance needs only `foldMap` or `foldr`; `sum`, `length`, `elem`, `maximum`, `toList` and the rest come for free. `foldMap` is where monoids come in:

```haskell
foldMap :: (Foldable t, Monoid m) => (a -> m) -> t a -> m

getSum (foldMap Sum [1, 2, 3])       -- 6
getAll (foldMap (All . even) [2, 4]) -- True
```

Map each element into a monoid, then combine everything with `<>`, starting from `mempty`. Because the operation is associative, the container is free to group the combinations however suits its shape (see [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid)).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
One well-known surprise: tuples and `Either` are `Foldable` over their last component only, so `length (1, 2)` is `1` and `sum (Right 3)` is `3`. Generic folds then type-check on values where a list was meant.
{{< /callout >}}


? `foldM`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`foldM` (from `Control.Monad`) is a left fold whose step function returns a monadic result, so each step can fail, log or do I/O:

```haskell
foldM :: (Foldable t, Monad m) => (b -> a -> m b) -> b -> t a -> m b

divideAll :: Int -> [Int] -> Maybe Int
divideAll = foldM step
where step _   0 = Nothing
step acc d = Just (acc `div` d)

divideAll 100 [2, 5]    -- Just 10
divideAll 100 [2, 0, 5] -- Nothing: the first failure stops the fold
```
{{< /callout >}}


[Functor]({{< ref "functional-programming/functor" >}})

[Applicative]({{< ref "functional-programming/applicative" >}})

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
These two links are left over from an older section on related type classes. `Foldable` doesn't require `Functor`, but the two meet in `Traversable`, which needs both and uses `Applicative` to rebuild the structure: `traverse :: (Traversable t, Applicative f) => (a -> f b) -> t a -> f (t b)`. Its fold-only cousin `traverse_ :: (Foldable t, Applicative f) => (a -> f b) -> t a -> f ()` runs an effect for each element and keeps no structure.
{{< /callout >}}

### Reading


<https://wiki.haskell.org/Fold>

<https://wiki.haskell.org/Foldr_Foldl_Foldl%27>

<https://wiki.haskell.org/Foldl_as_foldr>

tutorial on folds "pdf article" ([PDF](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc))

<https://mmhaskell.com/blog/2022/4/7/first-try-fold>

<https://well-typed.com/blog/2014/04/fixing-foldl/>

<https://mmhaskell.com/blog/2022/4/14/using-scans-to-accumulate>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The "pdf article" is presumably Hutton's *A tutorial on the universality and expressiveness of fold*, which is in the library (linked above). It is the best single reading on the universal property used under Structure of a fold, and on how much can be written as a fold.
{{< /callout >}}


definition, problems, applications, corner cases, types, type deconstruction

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This study outline maps onto the sections above: definition under foldr and foldl, problems (stack and thunks) under the `foldr` trace and `foldl'`, applications under Using folds, types under Structure of a fold. Not covered yet are corner cases. The main one is the empty structure: `foldr` and `foldl` return the initial value, but `foldr1`, `foldl1`, `maximum` and `minimum` have no initial value and throw an exception on an empty list.
{{< /callout >}}

## Functional combinators


<https://stackoverflow.com/questions/7533837/explanation-of-combinators-for-the-working-man>

### Generalized functional combinators

```scala
def ourMap(numbers: List[Int], fn: Int => Int): List[Int] = {
  numbers.foldRight(List[Int]()) { (x: Int, xs: List[Int]) =>
    fn(x) :: xs
  }
}
scala> ourMap(numbers, timesTwo(_))
res0: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This is `map` written as a right fold, the same construction as `myMap` in Haskell: start from the empty list and, for each element from the right, put `fn(x)` in front of what has been built. The REPL line assumes `numbers` is `List(1, 2, ..., 10)` and `timesTwo` doubles its argument; neither is defined in the snippet. `filter`, `flatMap`, `reverse`, `length` and `sum` can all be written the same way, which is the sense in which fold is the general combinator.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Combinator" is used loosely here. In the strict sense, from combinatory logic, a combinator is a function with no free variables, defined only in terms of its arguments. In Scala usage it has come to mean any higher-order function for building larger computations from smaller ones, such as `map`, `filter` and `fold`. The example is also only stack-safe because the standard library implements `foldRight` on `List` by reversing the list and folding left; a naive recursive `foldRight` would overflow on long lists.
{{< /callout >}}


See also: [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}) for higher-order functions and pipelines, [Functional Refactoring]({{< ref "functional-programming/functional-refactoring" >}}#wholemeal-programming) for replacing explicit recursion with list functions, [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}) for thunks and `seq`, [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid), [Functor]({{< ref "functional-programming/functor" >}}) and [Applicative]({{< ref "functional-programming/applicative" >}}). Also [Traversable]({{< ref "functional-programming/traversable" >}}) for `traverse`, the effectful relative of folds.

## Library sources


- [Hutton 1999](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc), *A tutorial on the universality and expressiveness of fold*: the universal property of fold and how to derive functions as folds; presumably the "pdf article" under Reading.
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
