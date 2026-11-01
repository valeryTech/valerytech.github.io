---
draft: false
toc: true
title: "Functional Programming Study Log"
aliases:
  - "/functional-programming/study-log/"
description: "A dated study log from November and December 2023 covering folds and fusion, unfolds and origami programming, laziness and trees, traverse, continuation-passing style, monoids and monads."
weight: "40"
linkTitle: "Study Log"
---

A dated study log from November and December 2023, mostly Haskell: folds and fusion laws, unfolds and origami programming, recursion schemes, laziness, traversals, monoids, and a plan for further study. Each entry records what was done or planned that day, with the explanation worked out for it.

## 22.11.23


Solved the Exercism Bob exercise (logged as "0.5"). Bob classifies a remark (a question, shouting, a shouted question, silence, anything else) and returns a fixed reply for each case. The 23.11.23 entry comes back to one of its approach pages.

## 23.11.23


Plan: vim and ranger, 0.5 to 1 hour?

### `any` and `all`, recursively and as folds


- [x] Write `any` and `all` recursively, then with folds.

```haskell
anyR :: (a -> Bool) -> [a] -> Bool
anyR _ []     = False
anyR p (x:xs) = p x || anyR p xs

anyF, allF :: (a -> Bool) -> [a] -> Bool
anyF p = foldr (\x acc -> p x || acc) False
allF p = foldr (\x acc -> p x && acc) True
```


`||` doesn't evaluate its right argument when the left one is `True`, so the `foldr` version stops at the first match and works on infinite lists: `anyF even [1 ..]` returns `True`. A `foldl` version has to reach the end of the list first, so it never returns on an infinite list.

The start value of a fold must be the identity of the combining operator: `False` for `||`, `True` for `&&`. Starting `or` from `True` makes it return `True` for every list, including `[]`.

- [ ] Correct the initial accumulator error in `or` on the Bob string approach page: <https://exercism.org/tracks/haskell/exercises/bob/approaches/string>. The page itself hasn't been re-checked; the rule above is what the fix should follow.

### `any` through `or` and `map`, and the fusion law


Question: what is going on with these functions, written with `foldr` and `or`, and how do they relate to the map fusion law (Gibbons, *Origami programming*, [PDF](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc))?

`or = foldr (||) False` and `any p = or . map p`. The fusion law for `foldr` says

```text
h . foldr f e = foldr g (h e)    provided h (f x y) = g x (h y) for all x, y
```


For partial or infinite lists, `h` must also be strict. Since `map p = foldr ((:) . p) []`, taking `h = foldr f e` (for `any`, `h = or`) gives the special case called foldr-map fusion, `foldr f e . map p = foldr (f . p) e`. Applied to `any`:

```text
or . map p = foldr (||) False . map p
           = foldr ((||) . p) False
           = foldr (\x acc -> p x || acc) False
```


which is exactly `anyF` above. The composed definition and the single-fold definition are provably equal, and the law shows how to turn one into the other. The "map fusion law" in the narrow sense is `map f . map g = map (f . g)`, another instance of the same theorem.

Why define `any` through `or` and `map` at all? `any p = or . map p` is the definition in the Haskell 2010 Report Prelude, and there are good reasons for it:

- It says what `any` means, built from existing parts, instead of re-writing the recursion.
- Laziness keeps it efficient. `map` produces elements only as `or` asks for them, and `or` stops at the first `True`, so the full intermediate list is never built and the function still works on infinite lists.
- The fusion law proves it equal to the hand-written single fold, and GHC's foldr/build fusion can remove the intermediate list when compiling with optimisation.

base now defines the Foldable version through `foldMap` with the `Any` monoid, which is the same idea phrased with monoids.

Fusion in Richard Bird's *Pearls of Functional Algorithm Design* (2010): the book derives efficient programs from simple specifications by equational reasoning, and the fusion law is one of its most used steps. It isn't in the library; Hutton's fold tutorial and Gibbons's origami chapter (see Library sources) introduce the same law more gently. Bird's own textbook treatments are in the library: *Introduction to Functional Programming using Haskell* (1998), section 4.6.2, "Fusion", and Bird and Gibbons 2020, section 1.4.

Links on fusion and equational reasoning:

- Reddit r/haskell, "foldr and fusion laws": <https://www.reddit.com/r/haskell/comments/167lmt/foldr_and_fusion_laws/>
- Hinze et al., fusion laws (IFL 2010): <https://www.cs.ox.ac.uk/ralf.hinze/publications/IFL10.pdf> ([PDF](/sources/programming/functional-programming/hinze-2010-theory-and-practice-of-fusion.pdf.enc))
- Reddit r/haskellquestions, "Fusion and fission law of fold": <https://www.reddit.com/r/haskellquestions/comments/382e1p/fusion_and_fission_law_of_fold/>
- A GitHub gist, topic not checked: <https://gist.github.com/regiskuckaertz/63c60151ef85670312d1d1f92490de2e>
- My Haskell Journal, "An exercise in equational reasoning": <https://myhaskelljournal.com/an-exercise-in-equational-reasoning/>

### Testing: hspec and tasty


Two Haskell testing libraries. hspec is a behaviour-style framework modelled on Ruby's RSpec (`describe`, `it`, `shouldBe`); the Exercism Haskell track's test suites use it. tasty groups tests from separate providers into one tree: `tasty-hunit` for unit tests, `tasty-quickcheck` for properties, `tasty-hspec` to run hspec specs. Fusion laws make good QuickCheck properties, for example `\xs -> anyF even xs == any even (xs :: [Int])`.

### Partial functions and `Safe`


Question: how are `lastMay` and the other functions from `Safe` used, how do they use `liftMay`, and does it help or harm list fusion? (The note says "pom", probably a typo for "help" or "harm".)

The `safe` package offers total versions of Prelude's partial functions in several flavours: `lastMay :: [a] -> Maybe a` returns `Nothing` on an empty list, `lastDef` takes a default, `lastNote` fails with your own error message. `liftMay` is a small internal helper, roughly "check the precondition, then call the partial function":

```haskell
liftMay :: (a -> Bool) -> (a -> b) -> a -> Maybe b
liftMay test func val = if test val then Nothing else Just (func val)

lastMay = liftMay null last
```


Check the current source before relying on the exact definitions; they have changed between versions.

On fusion: `null` looks only at the first constructor, so `lastMay xs` still walks the list once, lazily, in constant space. But `xs` is used twice, so GHC won't inline a producer such as `map f ys` into both uses, which most likely stops foldr/build fusion from removing the intermediate list. The cost is allocation, not asymptotic memory.

Using Prelude calls for an engineering approach. Prelude exports several partial functions: `head`, `tail`, `init`, `last`, `(!!)`, `read`, and `maximum` on an empty list. The engineering question is how to work safely with them, as a team rule. Three options, from weakest to strongest guarantee:

1. Report a better error (`lastNote`).
2. Return the failure in the type (`lastMay`), so the caller must handle `Nothing`.
3. Make the precondition part of the argument's type: `Data.List.NonEmpty.last :: NonEmpty a -> a` is total, because an empty `NonEmpty` can't be constructed. This moves the check to where the list is built, often far from where it is used.

Other tools: pattern matching instead of partial functions, `readMaybe` from `Text.Read`, or a custom prelude (see [Custom Prelude]({{< ref "functional-programming/04-languages/haskell" >}}#custom-prelude)). GHC 9.8 added the `-Wx-partial` warning for uses of `head` and `tail`. [Refactoring functional code]({{< ref "functional-programming/05-practice/functional-refactoring" >}}) has notes on the same question.

### Foldable


- [ ] Foldable and related classes.

`Foldable` is the class of containers that can be folded. A minimal instance defines `foldMap` or `foldr`; the class then provides `foldl'`, `toList`, `null`, `length`, `elem`, `sum`, `maximum` and more. Since GHC 7.10 the Prelude versions of `any`, `all`, `or`, `sum`, `length` and similar are Foldable-generic, so they work on `Maybe`, `Map`, `Set` and trees as well as lists.

`foldMap :: (Foldable t, Monoid m) => (a -> m) -> t a -> m` maps each element into a monoid and combines the results with `<>`. Choosing the monoid chooses the fold: `getSum (foldMap Sum xs)` is `sum`, `getAny (foldMap (Any . p) xs)` is `any p`, `foldMap (\x -> [x])` is `toList`. See the 1.12.23 entry on folds and monoids.

- Wikipedia, "Fold (higher-order function)": <https://en.wikipedia.org/wiki/Fold_(higher-order_function)>

### Composable folds: the `foldl` package


There is a thing for composing or piping several folds: Gabriella Gonzalez's `foldl` package (`Control.Foldl`). The problem it solves: `sum xs / fromIntegral (length xs)` walks `xs` twice and keeps the whole list in memory between the walks. `foldl` makes a left fold a value that can be combined with others, so `L.fold ((/) <$> L.sum <*> L.genericLength) xs` computes the mean in a single pass.

`Fold` works as a small embedded DSL: the primitive folds are the vocabulary, `Functor` and `Applicative` are the grammar for combining them, and `L.fold` is the interpreter that runs a combined fold over any `Foldable`.

The Applicative instance of `Fold`: a `Fold` packages a step function, an initial accumulator and a final extraction step, with the accumulator type hidden. Combining two folds runs both steps on a pair of accumulators.

```haskell
{-# LANGUAGE ExistentialQuantification #-}
import Data.List (foldl')

data Fold a b = forall x. Fold (x -> a -> x) x (x -> b)

instance Functor (Fold a) where
  fmap f (Fold step begin done) = Fold step begin (f . done)

instance Applicative (Fold a) where
  pure b = Fold (\_ _ -> ()) () (const b)
  Fold stepL beginL doneL <*> Fold stepR beginR doneR =
    Fold (\(l, r) a -> (stepL l a, stepR r a))
         (beginL, beginR)
         (\(l, r) -> doneL l (doneR r))

fold :: Fold a b -> [a] -> b
fold (Fold step begin done) = done . foldl' step begin
```


The real library uses a strict pair instead of a tuple. `foldl'` forces the accumulator only to weak head normal form, so with a lazy tuple both components would grow into chains of thunks (see [Costs of laziness: space leaks]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#costs-of-laziness-space-leaks)).

- Haskell Discourse, "Composing or piping multiple folds": <https://discourse.haskell.org/t/composing-or-piping-multiple-folds/1439>
- Haskell for all, "Composable streaming folds" (2013): <https://www.haskellforall.com/2013/08/composable-streaming-folds.html>
- `Control.Foldl` documentation, foldl 1.4.15: <https://hackage.haskell.org/package/foldl-1.4.15/docs/Control-Foldl.html>
- deque.blog, "Beautiful code: Control.Fold" (2017): <https://deque.blog/2017/01/13/beautiful-code-control-fold/>
- Haskell for all, on foldl 1.0.0 and composable streaming folds (2013): <https://www.haskellforall.com/2013/08/foldl-100-composable-streaming-and.html>

## 24.11.23


Logged as 24.11.22, almost certainly a typo: the entry sits between 23.11.23 and 25.11.23 and continues the previous day's topics.

Explore the several approaches presented for the Collatz conjecture exercise. The conjecture itself is an open problem; the Exercism exercise asks for the number of steps from `n` to 1, where each step halves an even number and maps an odd `n` to `3n + 1`.

Next: folds and `Foldable`, from the previous entry. Can Collatz be written with a fold?

Not directly. A fold consumes a structure that already exists; Collatz generates a sequence from a starting number, which is the job of an unfold. Counting the steps is then a fold (`length`) over the unfolded list:

```haskell
import Data.List (genericLength, unfoldr)

collatz :: Integer -> Maybe Integer
collatz n
  | n < 1     = Nothing
  | otherwise = Just (genericLength (unfoldr step n))
  where
    step 1 = Nothing
    step k = Just (k, if even k then k `div` 2 else 3 * k + 1)
```


`unfoldr step 6` is `[6,3,10,5,16,8,4,2]`, eight steps. An unfold followed by a fold is called a hylomorphism. Thanks to laziness the list is consumed as it is produced, so it is never held in memory in full.

`unfoldr :: (b -> Maybe (a, b)) -> b -> [a]`, from `Data.List`, is the dual of `foldr`. Starting from a seed, the function either says stop (`Nothing`) or gives the next element and the next seed: `unfoldr (\n -> if n > 10 then Nothing else Just (n, n + 1)) 1` is `[1 .. 10]`. Its implementation is under 27.11.23.

- kseo.github.io, "Unfold and fold" (2016): <https://kseo.github.io/posts/2016-12-12-unfold-and-fold.html>
- YouTube playlist, topic not checked: <https://www.youtube.com/watch?v=S_HSt6jEtWM&list=PLD8gywOEY4HaG5VSrKVnHxCptlJv2GAn7&index=1>

## 25.11.23


- [x] Collatz example.
- [x] Refactoring example with Collatz, now in [Collatz]({{< ref "functional-programming/05-practice/functional-refactoring" >}}#collatz).
- [ ] Explore the different methods on the CPSC 449 "Evolution" page, and Collatz with them: <https://pages.cpsc.ucalgary.ca/~robin/class/449/Evolution.htm>

## 26.11.23


- Computations in Haskell.
- Highlight useful phrases in posts.
- Get more information about recursion patterns.

The standard vocabulary for recursion patterns comes from the recursion-schemes literature:

- catamorphism: a fold, which consumes a structure bottom-up (`foldr` for lists);
- anamorphism: an unfold, which builds a structure from a seed (`unfoldr`);
- hylomorphism: an unfold followed by a fold, with the intermediate structure fused away (the Collatz counter above);
- paramorphism: a fold whose step also sees the unprocessed rest of the structure, i.e. primitive recursion (the natural fit for `dropWhile` or insertion into a sorted list);
- apomorphism: an unfold that can stop early by returning a ready-made remainder.

Meijer, Fokkinga and Paterson's 1991 paper introduced most of these names for programmers; Edward Kmett's `recursion-schemes` package implements them for any datatype. See also [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds).

## 27.11.23

### RNA transcription


`toRNA` task, step 1: a straight, maybe imperative solution.

The Exercism RNA transcription task: complement each nucleotide (G to C, C to G, T to A, A to U) and reject anything else. In the Haskell track the signature is `toRNA :: String -> Either Char String`, with the first invalid character in `Left` (check against the current version of the exercise). A straight recursive solution, then the idiomatic one:

```haskell
complement :: Char -> Either Char Char
complement 'G' = Right 'C'
complement 'C' = Right 'G'
complement 'T' = Right 'A'
complement 'A' = Right 'U'
complement c   = Left c

toRNA :: String -> Either Char String
toRNA []     = Right []
toRNA (x:xs) = case complement x of
  Left c  -> Left c
  Right y -> (y :) <$> toRNA xs

toRNA' :: String -> Either Char String
toRNA' = traverse complement
```


The recursive version is exactly what `traverse` does for `Either`: map each element to an action, collect the results, stop at the first `Left`. That links this task to the 29.11.23 and 30.11.23 entries.

### Implementing `unfoldr`


Course exercise: `unfoldr`. The original local file, [Unfoldr.hs](file://~/projects/haskell/src/Unfoldr.hs), and its type signature are not available in this note.

Open question: how can `unfoldr` be implemented with that type signature?

For the `Data.List` signature, the type leaves essentially one sensible implementation. The only way to get an `a` is to apply `f` to a `b`, and the only `b` at the start is the seed:

```haskell
unfoldr :: (b -> Maybe (a, b)) -> b -> [a]
unfoldr f seed = case f seed of
  Nothing         -> []
  Just (x, seed') -> x : unfoldr f seed'
```


The recursive call sits under the `(:)` constructor (guarded corecursion), so a lazy consumer gets each element as soon as it is produced, even if the list is infinite.

If `Unfoldr.hs` used the textbook form with three functions instead (a stop test, an element function and a next-seed function), the implementation is

```haskell
unfold :: (b -> Bool) -> (b -> a) -> (b -> b) -> b -> [a]
unfold p f g x
  | p x       = []
  | otherwise = f x : unfold p f g (g x)
```


and `map f = unfold null (f . head) tail`.

### Origami programming, folds and unfolds


Origami programming ([PDF](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc)) is Jeremy Gibbons's chapter in *The Fun of Programming* (2003; book). Folds and unfolds are the "origami" of functional programming: the chapter shows them for lists, natural numbers and rose trees (a single generic definition for all datatypes is left out of scope, section 3.1), with their laws (fusion among them) and the hylomorphisms you get by composing an unfold with a fold.

- Conal Elliott, "Folds and unfolds all around us" (talk slides): <http://conal.net/talks/folds-and-unfolds.pdf> ([PDF](/sources/programming/functional-programming/elliott-2013-folds-and-unfolds-all-around-us.pdf.enc))
- WorksHub, "Anamorphisms, aka unfolds, explained": <https://functional.works-hub.com/learn/number-anamorphisms-aka-unfolds-explained-50e1a>
- thealmarty.com, "Anamorphisms, aka unfolds, explained" (2022): <https://thealmarty.com/2022/09/06/anamorphisms-aka-unfolds-explained/>

Someone said that fold and unfold are particular forms of recursion and corecursion (Wikipedia, "Corecursion": <https://en.wikipedia.org/wiki/Corecursion>). That is the right phrase:

- A fold is structural recursion. It consumes data, each recursive call is on a direct substructure, so on finite input it always terminates.
- An unfold is corecursion. It produces data one constructor at a time from a seed. It needn't terminate, but it is productive, delivering each piece in finite time: `iterate f = unfoldr (\x -> Just (x, f x))` produces an infinite list.

Folds capture structural recursion, not all recursion. Quicksort, for example, recurses on lists that aren't substructures of its input; it fits as a hylomorphism (unfold into a tree, fold the tree) but not as a single fold. In Haskell, finite data and infinite codata share one type (a list can be either), so the distinction is not enforced; in total languages such as Agda or Coq it is.

An unfold is an anamorphism and a fold is a catamorphism:

- Wikipedia, "Anamorphism": <https://en.wikipedia.org/wiki/Anamorphism>
- Wikipedia, "Catamorphism": <https://en.wikipedia.org/wiki/Catamorphism>

The names come from category theory and were popularised for programmers by Meijer, Fokkinga and Paterson (1991) ([PDF](/sources/programming/functional-programming/meijer-1991-functional-programming-with-bananas-lenses.pdf.enc), section 2; the library copy has only the first 5 pages). For a recursive type described by a "base functor" `f`, the catamorphism takes an algebra `f a -> a` that handles one layer, and the anamorphism takes a coalgebra `a -> f a` that produces one layer; the general definitions are below. For lists the catamorphism is `foldr`. `foldl` is not directly a catamorphism; it can be expressed as a `foldr` that builds a function.

### Shortcut fusion and stream fusion


Questions: stream fusion is based on destroy/unfoldr fusion? And GHC's list fusion on foldr/build fusion?

Yes to both. These are the two families of "shortcut fusion", both removing intermediate lists between a producer and a consumer:

- **foldr/build** (Gill, Launchbury and Peyton Jones, 1993). Producers are written with `build g = g (:) []`, consumers with `foldr`, and one rewrite rule does the work: `foldr k z (build g) = g k z`. This is GHC's list fusion in `base`. It handles `map`, `filter` and list comprehensions well, but not functions that consume two lists at once (`zip`). Left folds with accumulating parameters, such as `foldl` and the `sum` built on it, were the other gap when Svenningsson (2002, section 2.2) and Coutts et al. (2007, section 1.1) wrote. GHC 7.10 (2015) closed it by defining `foldl` through `foldr`, with the Call Arity analysis removing the extra closures ([Breitner 2014](https://www.joachim-breitner.de/publications/CallArity-TFP.pdf); GHC ticket [#7994](https://mail.haskell.org/pipermail/ghc-tickets/2014-January/009171.html)), so current GHC fuses `sum (map f xs)` too.
- **destroy/unfoldr** (Svenningsson, 2002) is the dual: producers are unfolds, consumers are written with `destroy`, and `zip`-like functions fuse. Its weak spot is `filter`, which has to loop until it finds the next element.

Stream fusion (Coutts, Leshchinskiy and Stewart, 2007) builds on the second idea. A list becomes a non-recursive stepper, `data Stream a = forall s. Stream (s -> Step a s) s`, with `data Step a s = Done | Yield a s | Skip s`. `Skip` lets `filter` drop an element without a recursive loop, so every stage stays non-recursive and GHC can inline the whole pipeline into one loop. The `vector` library uses stream fusion.

- danilafe.com, "Haskell catamorphisms": <https://danilafe.com/blog/haskell_catamorphisms/>
- HaskellWiki, "Catamorphisms": <https://wiki.haskell.org/Catamorphisms>

### Base functors: lists with an extra `r` parameter


Other types of list, with an additional `r` parameter, and folds and unfolds over them. The extra parameter marks where the recursion goes. Taking it out of the list type and adding the fixed point separately gives one generic fold and unfold:

```haskell
{-# LANGUAGE DeriveFunctor #-}
data ListF e r = NilF | ConsF e r deriving Functor

newtype Fix f = Fix { unFix :: f (Fix f) }
-- Fix (ListF e) is isomorphic to [e]

cata :: Functor f => (f a -> a) -> Fix f -> a
cata alg = alg . fmap (cata alg) . unFix

ana :: Functor f => (a -> f a) -> a -> Fix f
ana coalg = Fix . fmap (ana coalg) . coalg

sumAlg :: ListF Int Int -> Int
sumAlg NilF          = 0
sumAlg (ConsF x acc) = x + acc

countdown :: Int -> ListF Int Int
countdown 0 = NilF
countdown n = ConsF n (n - 1)
-- cata sumAlg (ana countdown 3) == 6
```


An algebra describes what to do with one layer once the `r` positions already hold results. `Mu`, in the linked Stack Overflow question, is another encoding of the fixed point, `newtype Mu f = Mu (forall a. (f a -> a) -> a)`: a value represented by its own catamorphism.

- Stack Overflow, "How to write a Show instance for Mu recursive types": <https://stackoverflow.com/questions/50946004/how-to-write-a-show-instance-for-mu-recursive-types/50950944>
- A GitHub gist, maybe related to the list usage in the Collatz function (topic not checked): <https://gist.github.com/beala/d871ae8397167e7035f218a25ddf87dd>

### Laziness and trees


Lazy Fibonacci as a memo table: see [Thunks, sharing and pattern matching]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#thunks-sharing-and-pattern-matching).

Trees in `containers`: `Data.Tree` is a rose tree, `data Tree a = Node { rootLabel :: a, subForest :: [Tree a] }`. It comes with `Foldable` and `Traversable` instances, `flatten`, `levels`, `drawTree`, and its own fold and unfold, `foldTree :: (a -> [b] -> b) -> Tree a -> b` and `unfoldTree :: (b -> (a, [b])) -> b -> Tree a`. A tree is a good next datatype for practising folds and unfolds after lists.

John Hughes's paper *Why Functional Programming Matters* ([PDF](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc)) argues that the power of functional languages lies in modularity, and that two kinds of "glue" provide it: higher-order functions, which let you reuse recursion patterns such as folds, and lazy evaluation, which lets a producer and a consumer be written separately and still run in step. His examples include numerical algorithms built on lazy infinite lists and game-tree search over a lazily generated tree, which makes it a good companion to the unfold and tree topics above.

- usrsb.in, "Selling laziness": <http://www.usrsb.in/selling-laziness.html>
- The Morning Paper, on "Why functional programming matters" (2016): <https://blog.acolyer.org/2016/09/14/why-functional-programming-matters/>
- rampion/tree-traversals, GitHub repository: <https://github.com/rampion/tree-traversals>

## 28.11.23


- Elliott's folds and unfolds talk again: <http://conal.net/talks/folds-and-unfolds.pdf> ([PDF](/sources/programming/functional-programming/elliott-2013-folds-and-unfolds-all-around-us.pdf.enc))
- Origami.
- The Haskell CIS 194 course: the University of Pennsylvania's introductory Haskell course. The Spring 2013 version by Brent Yorgey is the one usually recommended for self-study (its lectures are linked from [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}})).

Technique, from the course (also on slide 10 of Elliott's talk, [PDF](/sources/programming/functional-programming/elliott-2013-folds-and-unfolds-all-around-us.pdf.enc)): replace control structures by data structures and standard combining forms, as in `fact n = product [1..n]`. Instead of a loop with a counter and an accumulator, build the data the loop would walk over (`[1..n]`) and hand it to a standard combinator (`product`). This is Hughes's "glue" again, and CIS 194 calls the style wholemeal programming. Laziness keeps it cheap: the list is produced on demand, and with optimisation GHC can often fuse it away completely.

Caveat: at type `Int`, `product [1..n]` overflows silently from `n = 21` on, since 21! is larger than the largest 64-bit `Int`. Give it the type `Integer -> Integer`:

```haskell
fact :: Integer -> Integer
fact n = product [1..n]
```

## 29.11.23

### The `Listable` type class


- [ ] Make and use the `Listable` type class from chapter 5 of CIS 194.

The CIS 194 lecture on type classes defines a class for things that can be flattened into a list of `Int`s:

```haskell
{-# LANGUAGE FlexibleInstances #-}
class Listable a where
  toList :: a -> [Int]

instance Listable Int where
  toList x = [x]

instance Listable Bool where
  toList True  = [1]
  toList False = [0]

instance Listable [Int] where
  toList = id

data Tree a = Empty | Node (Tree a) a (Tree a)

instance Listable (Tree Int) where
  toList Empty        = []
  toList (Node l x r) = toList l ++ [x] ++ toList r

instance (Listable a, Listable b) => Listable (a, b) where
  toList (x, y) = toList x ++ toList y

sumL :: Listable a => a -> Int
sumL = sum . toList
```


The instances for `[Int]` and `Tree Int` need `FlexibleInstances` (on by default under GHC2021), because Haskell 2010 only allows instance heads made of a type constructor applied to type variables. Fixing the element type to `Int` is what forces the flexible instances. `Listable` is a teaching example; the library version of the idea is `Foldable`, whose `toList :: Foldable t => t a -> [a]` works for any element type and comes with `sum`, `length` and the rest for free.

- [ ] Create a Spark port to Haskell.

### `traverse` and `mapM`


Inside `class (Functor t, Foldable t) => Traversable t`, where `t` is the class variable, the method is written `traverse :: Applicative f => (a -> f b) -> t a -> f (t b)`. Used on its own, its type is

```haskell
traverse :: (Traversable t, Applicative f) => (a -> f b) -> t a -> f (t b)
```


`traverse` applies an effectful function to every element and collects the results in a structure of the same shape, running the effects from left to right. `traverse readMaybe ["1", "2"] :: Maybe [Int]` is `Just [1,2]`; with `"x"` in the list it is `Nothing`. `traverse print [1, 2, 3]` prints three lines and returns `[(), (), ()]`. `sequenceA = traverse id` turns a `[Maybe a]` into a `Maybe [a]`.

`mapM :: (Traversable t, Monad m) => (a -> m b) -> t a -> m (t b)` is `traverse` restricted to monads. It is older than `Applicative` and survives for compatibility; in practice `mapM = traverse`. `mapM_` and `traverse_` discard the results and only need `Foldable`.

### Continuation-passing style


In continuation-passing style (CPS) a function never returns its result. It takes an extra argument, the continuation, and calls it with the result:

```haskell
factCPS :: Integer -> (Integer -> r) -> r
factCPS 0 k = k 1
factCPS n k = factCPS (n - 1) (\r -> k (n * r))
-- factCPS 5 id == 120
```


Every call is now a tail call, and "what happens next" is an ordinary value, so you can drop it (early exit), call it twice (backtracking) or store it. The `Cont` monad and `callCC` package this pattern. The same trick defines `foldl` through `foldr` by folding into a function.

Caveat: CPS doesn't make recursion cheaper by itself. The pending multiplications move from the stack into a chain of `n` closures on the heap.

- Haskell Wikibook, "Continuation passing style": <https://en.wikibooks.org/wiki/Haskell/Continuation_passing_style>

### Forcing evaluation and worker/wrapper


Forcing evaluation with bang patterns is covered in [Costs of laziness: space leaks]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#costs-of-laziness-space-leaks).

The worker/wrapper construct: the wrapper is the function with the public interface, `collatz :: Integer -> Maybe Integer`, which checks the input. The worker is a local helper, usually called `go`, with extra parameters such as an accumulator or step counter, which does the recursion. The Collatz code in [Refactoring functional code]({{< ref "functional-programming/05-practice/functional-refactoring" >}}) already has this shape. The Exercism Collatz approach is about this source-level idiom:

- Exercism, Collatz conjecture, worker-wrapper approach: <https://exercism.org/tracks/haskell/exercises/collatz-conjecture/approaches/worker-wrapper>

The term has a second meaning. GHC's worker/wrapper transformation is a compiler optimisation that splits a function the same way automatically, for example so the worker can take unboxed `Int#` arguments that strictness analysis has shown are always needed, while the small wrapper is inlined at call sites. Gill and Hutton's 2009 paper gives the general theory.

## 30.11.23


Open question for today: what do I want to work on?

A course? H. Conrad Cunningham's CSci 450 course notes, the same source as the evaluation-model chapter ([ch. 8 PDF](/sources/programming/functional-programming/cunningham-2022-exploring-languages-ch08-evaluation-model.pdf.enc)) quoted in [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}): <https://john.cs.olemiss.edu/~hcc/csci450/notes/450lectureNotes.html>

### Traversable and short-circuiting


With `Maybe` or `Either` as the applicative, `traverse` stops at the first failure. It doesn't look at the remaining elements, so it terminates even on an infinite list:

```haskell
check :: Int -> Maybe Int
check x = if x > 0 then Just x else Nothing

traverse check [1, 2, 3]                  -- Just [1,2,3]
traverse check ([1, 2, -3] ++ [4 ..])     -- Nothing
```


Short-circuiting is a property of the applicative, not of `traverse`. With `IO` or `State`, every element's effect runs, so traversing an infinite list never finishes. With an error-accumulating applicative such as `Validation`, the traversal deliberately continues so it can collect all errors.

- `Data.Traversable` documentation, base 4.19.0.0: <https://hackage.haskell.org/package/base-4.19.0.0/docs/Data-Traversable.html#g:4>
- Stack Overflow, "Can someone explain the traverse function in Haskell?": <https://stackoverflow.com/questions/7460809/can-someone-explain-the-traverse-function-in-haskell>

### The iterator pattern paper


`traverse`, `Traversable`, the iterator pattern paper ([PDF](/sources/programming/functional-programming/gibbons-2009-essence-of-the-iterator-pattern.pdf.enc)): its use and the problems it solves.

Gibbons and Oliveira's *The Essence of the Iterator Pattern* (2009) argues that `traverse`, from McBride and Paterson's applicative functors, is the functional form of the object-oriented Iterator pattern: one pass that can map over the elements and accumulate effects at the same time. Because products and compositions of applicatives are again applicative, two traversals can be fused into one. Problems it solves in everyday code:

- validating every element and failing on the first error (`Maybe`, `Either`), as in `toRNA` above;
- running an action per element and collecting results (`IO`);
- numbering or labelling the nodes of a tree in one pass (`State`);
- flipping nested structure, `[Maybe a]` to `Maybe [a]`, with `sequenceA`.

## 1.12.23

### Monoids


Instances of `Monoid`, and how to investigate them. In GHCi, `:info Monoid` (or `:i Monoid`) prints the class and every instance currently in scope; importing more modules shows more. The Haddock page for `Data.Monoid` lists the instances in base. Common ones: lists (`[]` and `++`), `Sum` and `Product`, `Any` and `All`, `First` and `Last`, `Ordering` (for chaining comparisons), `Maybe a` when `a` is a `Semigroup`, functions `a -> b` when `b` is a monoid, tuples of monoids, and `Map` with left-biased union.

- Further reading on monoids, Typeclassopedia: <https://wiki.haskell.org/Typeclassopedia#Monoid>

### Applicative and Monad


- [ ] Applicative versus Monad: effects cannot depend on previous results.

The jot said Applicative is "almost the same" as Monad, except that effects cannot depend on previous results. That is the core difference. `(<*>) :: f (a -> b) -> f a -> f b` fixes which effects happen before anything runs; `(>>=) :: m a -> (a -> m b) -> m b` lets the next computation be chosen by looking at the previous result. Reading a number `n` and then reading `n` lines (`readLn >>= \n -> replicateM n getLine`) needs `Monad`; reading a name and an age and combining them (`(,) <$> getLine <*> readLn`) needs only `Applicative`. The fixed structure is also what makes applicatives analysable in advance: an applicative parser's grammar or an applicative build system's dependencies can be inspected without running anything (see Mokhov et al. under Library sources). More in [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}) and [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}).

"Almost the same" undersells the gap, though. Every monad is an applicative, but many applicatives have no lawful monad instance: `ZipList`, `Const m`, and `Validation` (which collects all errors, something a monad can't do because it has to stop at the first failure to get the value it needs). Also, applicative effects still run in order. What they can't do is depend on earlier results; the final *value* can still combine all of them.

### Haskell programming: list functions and folds


- [ ] Write all the list functions recursively and with folds: <http://wiki.haskell.org/How_to_work_on_lists>

Good warm-ups with folds:

```haskell
length' = foldr (\_ n -> 1 + n) 0
map' f = foldr (\x acc -> f x : acc) []
filter' p = foldr (\x acc -> if p x then x : acc else acc) []
reverse' = foldl (flip (:)) []
takeWhile' p = foldr (\x acc -> if p x then x : acc else []) []
```


The instructive hard cases are `dropWhile` (needs a pair of results or a paramorphism, since the step must know the unprocessed tail) and `foldl` itself (fold into a function: `foldl f z xs = foldr (\x k acc -> k (f acc x)) id xs z`). Hutton's fold tutorial (see Library sources) works through both.

Folds on other data structures: every algebraic datatype has a fold, which replaces each constructor by a function with the same number of arguments.

```haskell
data Tree a = Leaf | Node (Tree a) a (Tree a)

foldTree :: b -> (b -> a -> b -> b) -> Tree a -> b
foldTree leaf _    Leaf         = leaf
foldTree leaf node (Node l x r) = node (foldTree leaf node l) x (foldTree leaf node r)

size  = foldTree 0 (\l _ r -> l + 1 + r)
depth = foldTree 0 (\l _ r -> 1 + max l r)
```


The folds of `Maybe`, `Either` and `Bool` are already in base as `maybe`, `either` and `bool`.

Folds and monoids: `foldMap` folds with a monoid. Associativity means the elements can be combined in any grouping, so a balanced tree can be folded from both halves independently (and in parallel); the identity element is the answer for an empty structure. The connection goes both ways: `foldr` can be recovered from `foldMap` with the monoid of functions under composition, `foldr f z t = appEndo (foldMap (Endo . f) t) z`, which is how `Foldable` defines `foldr` by default. See [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid).

### Plan: FP with Haskell, part 1


- monads, monad combinations, applicatives, functors and so on;
- functional and domain modeling;
- algorithms and the use of `foldl`, `Traversable` and so on.

A workable order is functor, then applicative, then monad, then traversable, since `Traversable` is defined in terms of `Applicative`. Notes on these topics already exist in [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}), [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}), [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}) and [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds), and on domain modelling in [Domain modeling in Haskell and Scala]({{< ref "functional-programming/05-practice/to-sort" >}}#domain-modeling-in-haskell-and-scala).

See also: [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds) and [Functional combinators]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#functional-combinators) for folds, [Evaluation and laziness]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}) for laziness, thunks and bang patterns, [Refactoring functional code]({{< ref "functional-programming/05-practice/functional-refactoring" >}}) for Collatz and partial functions, [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}) and [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid) for the 1.12.23 topics, and [Learning tasks]({{< ref "functional-programming/05-practice/exercises-and-projects" >}}#learning-tasks).

## Library sources


- [Hinze et al. 2010](/sources/programming/functional-programming/hinze-2010-theory-and-practice-of-fusion.pdf.enc), *Theory and Practice of Fusion*: the fusion-laws paper linked under 23.11.23; section 2, "Background: Algebras and Coalgebras", states the fold fusion law (equation 2), noting that fusing means inventing a new algebra that meets the precondition, and the functor fusion law (equation 3), which fuses a fold after a map into one fold; section 5 recasts foldr/build (5.2), destroy/unfoldr (5.3) and stream fusion with `Skip` (5.5) in one framework; on *`any` through `or` and `map`, and the fusion law* and *Shortcut fusion and stream fusion*.
- [Hutton 1999](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc), *A tutorial on the universality and expressiveness of fold*: the fusion law, list functions written as folds, `dropWhile` and `foldl` through `foldr`; section 4's "banana split" (two folds over one list become one fold returning a pair) is the law behind the `foldl` package; on *Composable folds: the `foldl` package* (23.11.23).
- [Gibbons 2003](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc), *Origami programming*: the chapter referred to under 23.11.23 and 27.11.23.
- [Elliott 2013](/sources/programming/functional-programming/elliott-2013-folds-and-unfolds-all-around-us.pdf.enc), *Folds and unfolds all around us*: the conal.net talk linked under 27.11.23 and 28.11.23; slides 15-19, "Playing with type isomorphisms" to "General regular algebraic data types – Haskell", build lists as `Fix` of a base functor and define the generic `fold`, `unfold` and `hylo`, the same construction as under *Base functors: lists with an extra `r` parameter*; slide 10, "Factorial again", has the technique under 28.11.23.
- [Gibbons et al. 1998](/sources/programming/functional-programming/gibbons-1998-the-under-appreciated-unfold.pdf.enc), *The Under-Appreciated Unfold*: unfolds and their laws, for the `unfoldr` questions.
- [Meijer et al. 1991](/sources/programming/functional-programming/meijer-1991-functional-programming-with-bananas-lenses.pdf.enc), *Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire*: catamorphisms, anamorphisms, hylomorphisms and paramorphisms.
- [Svenningsson 2002](/sources/programming/functional-programming/svenningsson-2002-shortcut-fusion-accumulating-parameters.pdf.enc), *Shortcut Fusion for Accumulating Parameters and Zip-like Functions*: section 2.2, "Limitations" (zips and accumulating parameters under foldr/build); section 3, "destroy/unfoldr" (`unfoldr`, `destroy`, the rule, and Figure 1, where `filter` needs a recursive helper); section 4, "zip fusion"; section 5, "Fusion with accumulating parameters"; on *Shortcut fusion and stream fusion*.
- [Coutts et al. 2007](/sources/programming/functional-programming/coutts-2007-stream-fusion.pdf.enc), *Stream Fusion: From Lists to Streams to Nothing at All*: stream fusion, for the 27.11.23 question; section 1.1, "Short-cut fusion", compares build/foldr, destroy/unfoldr and stream fusion; section 2 defines `Stream`, `Step` and `Skip`; section 3, "No recursion: filter", explains why `Skip` keeps every stepper non-recursive; on *Shortcut fusion and stream fusion*.
- [Gibbons et al. 2009](/sources/programming/functional-programming/gibbons-2009-essence-of-the-iterator-pattern.pdf.enc), *The Essence of the Iterator Pattern*: the iterator pattern paper under 30.11.23.
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: the article under 27.11.23.
- [Gibbons 2002](/sources/programming/functional-programming/gibbons-2002-calculating-functional-programs.pdf.enc), *Calculating Functional Programs*: section 2.7, ". . . and never the twain shall meet", explains why, with total functions on sets, data and codata differ and "unfold then fold" (quicksort, mergesort) can't be written; section 3 moves to pointed CPOs, where they coincide (3.1, "The category Cpo"); section 3.4.4 defines quicksort as `flatten . buildBST`, a hylomorphism (3.4, "Hylomorphisms"); on *Origami programming, folds and unfolds* (27.11.23).
- [Mokhov et al. 2020](/sources/programming/functional-programming/mokhov-2020-build-systems-a-la-carte-theory-practice.pdf.enc), *Build Systems a la Carte: Theory and Practice*: section 3.4, "The Need for Polymorphism in Task" (a `Task Applicative` has static dependencies, a `Task Monad` dynamic ones); section 3.7, "Computing Dependencies" (running an applicative task in `Const [k]` lists its dependencies without computing anything, which is impossible for a monadic task because `Const` has no `Monad` instance); on *Applicative and Monad* (1.12.23).
- [Bird et al. 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*: section 1.4, "Fusion": the fusion law of `foldr` with its proof by induction, the `foldr`-`map` instance, and the finite-list proviso (exercises 1.16 and 1.17); on *`any` through `or` and `map`, and the fusion law* (23.11.23).
- Bird 1998, *Introduction to Functional Programming using Haskell (2nd edition)*: section 4.6.2, "Fusion", states the fusion theorems for `foldr` and `foldl` with the strictness condition, and section 4.6.3 derives the fold-map fusion law `foldr f a . map g = foldr (f . g) a`, on *`any` through `or` and `map`, and the fusion law* (23.11.23); section 6.4, "Rose trees": `data Rose a = Node a [Rose a]` (the shape of `Data.Tree`), with size, height, induction, `foldRose` and `mapRose`, and depth-first and breadth-first order (6.4.2), on the `Data.Tree` paragraph of *Laziness and trees* (27.11.23); exercises 4.5.1 and 4.5.2 ask for `filter` and `takeWhile` as `foldr` and whether `dropWhile` can be a fold, and section 6.1.3, "Map and fold", writes size and height as folds over a binary tree, on *Haskell programming: list functions and folds* (1.12.23).

Further reading:

- [Kiselyov et al. 2017](/sources/programming/functional-programming/kiselyov-2017-stream-fusion-to-completeness.pdf.enc), *Stream Fusion, to Completeness*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: section 10.10, rewriting list functions (`myAnd`, `myOr`, `myAny`, `myElem`, `myReverse`) as folds, point-free where possible; sections 20.2 and 20.3, `Foldable`'s minimal definition and `foldMap` with `Sum`, `Product`, `All` and `Any`; on *`any` and `all`, recursively and as folds*, *Foldable* and *Haskell programming: list functions and folds*.
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: section 4.2, "Traversables", on `mapM` and `traverse` as one function duplicated by history, on *`traverse` and `mapM`*; section 9.2, "Nicer Code with Continuations", on `Cont r a` as `(a -> r) -> r`, callbacks and the `Cont` monad, on *Continuation-passing style*; section 3.2 on `ZipList` as an applicative without a monad, on *Applicative and Monad*.
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types*: section 6.4, "The Continuation Monad", on the isomorphism between `a` and `forall r. (a -> r) -> r` and on `Cont` flattening nested callbacks into `do` notation; on *Continuation-passing style*.
