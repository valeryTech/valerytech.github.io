---
draft: false
toc: true
title: "Study Log"
linkTitle: "Study Log"
---
# FP study log


A dated study log from November and December 2023: folds and fusion laws, unfolds and origami programming, laziness, traversals, monoids, and a plan for further Haskell study.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## 22.11.23


solved 0.5 Bob exercise

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Bob is an Exercism exercise: classify a remark (a question, shouting, a shouted question, silence, anything else) and return Bob's fixed reply for that case. The 23.11.23 entry comes back to one of its approach pages.
{{< /callout >}}

## 23.11.23


vim and ranger - 0.5 to 1 hour?

+write `any`, `all` functions in recusive manner then using folds

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
```haskell
anyR :: (a -> Bool) -> [a] -> Bool
anyR _ []     = False
anyR p (x:xs) = p x || anyR p xs

anyF, allF :: (a -> Bool) -> [a] -> Bool
anyF p = foldr (\x acc -> p x || acc) False
allF p = foldr (\x acc -> p x && acc) True
```
Because `||` doesn't evaluate its right argument when the left one is `True`, the `foldr` version stops at the first match and works on infinite lists: `anyF even [1 ..]` returns `True`. A `foldl` version would have to reach the end of the list first, so it never returns on an infinite list.
{{< /callout >}}


what is going on with these functions? (use foldr and or)

and how they relate to map fusion law? (gibbons origami) ([PDF](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc))

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`or = foldr (||) False` and `any p = or . map p`. The fusion law for `foldr` says

`h . foldr f e = foldr g (h e)`, provided `h (f x y) = g x (h y)` for all `x`, `y`

(for partial or infinite lists, `h` must also be strict). Since `map p = foldr ((:) . p) []`, taking `h = or` gives the special case called foldr-map fusion: `foldr f e . map p = foldr (f . p) e`. Applied to `any`:

`or . map p = foldr (||) False . map p = foldr ((||) . p) False = foldr (\x acc -> p x || acc) False`

which is exactly `anyF` above. So the composed definition and the single-fold definition are provably equal, and the law tells you how to turn one into the other. The "map fusion law" in the narrow sense is `map f . map g = map (f . g)`, another instance of the same theorem.
{{< /callout >}}


<https://www.reddit.com/r/haskell/comments/167lmt/foldr_and_fusion_laws/>

fusion laws: <https://www.cs.ox.ac.uk/ralf.hinze/publications/IFL10.pdf> ([PDF](/sources/programming/functional-programming/hinze-2010-theory-and-practice-of-fusion.pdf.enc))

fusion in pearls of fpd

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Richard Bird's *Pearls of Functional Algorithm Design* (2010) derives efficient programs from simple specifications by equational reasoning, and the fusion law is one of its most used steps. It isn't in the library; Hutton's fold tutorial and Gibbons's origami chapter (see Library sources) introduce the same law more gently.
{{< /callout >}}


<https://www.reddit.com/r/haskellquestions/comments/382e1p/fusion_and_fission_law_of_fold/>

<https://gist.github.com/regiskuckaertz/63c60151ef85670312d1d1f92490de2e>

<https://myhaskelljournal.com/an-exercise-in-equational-reasoning/>

hspec & tasty?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Two Haskell testing libraries. hspec is a behaviour-style framework modelled on Ruby's RSpec (`describe`, `it`, `shouldBe`); the Exercism Haskell track's test suites use it. tasty is a framework that groups tests from separate providers into one tree: `tasty-hunit` for unit tests, `tasty-quickcheck` for properties, `tasty-hspec` to run hspec specs. Fusion laws make good QuickCheck properties, e.g. `\xs -> anyF even xs == any even (xs :: [Int])`.
{{< /callout >}}


correct the initial acc error in <https://exercism.org/tracks/haskell/exercises/bob/approaches/string> in `or`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The approach page wasn't checked here. The general rule: the start value of a fold must be the identity of the combining operator, `False` for `||` and `True` for `&&`. Starting `or` from `True` makes it return `True` for every list, including `[]`.
{{< /callout >}}


usage of lastMay and other functions from Safe. How do they use `liftMay`? How it can 'pom' lists fusion?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The `safe` package offers total versions of Prelude's partial functions in several flavours: `lastMay :: [a] -> Maybe a` returns `Nothing` on an empty list, `lastDef` takes a default, `lastNote` fails with your own error message. `liftMay` is a small internal helper, roughly
```haskell
liftMay :: (a -> Bool) -> (a -> b) -> a -> Maybe b
liftMay test func val = if test val then Nothing else Just (func val)

lastMay = liftMay null last
```
i.e. "check the precondition, then call the partial function". Check the current source before relying on the exact definitions; they have changed between versions.

On fusion: `null` looks only at the first constructor, so `lastMay xs` still walks the list once, lazily, in constant space. But `xs` is used twice, so GHC won't inline a producer such as `map f ys` into both uses, which most likely stops foldr/build fusion from removing the intermediate list. The cost is allocation, not asymptotic memory.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"pom" is unclear; probably a typo for "help" or "harm".
{{< /callout >}}


use of Prelude -> use and develop engineering approach

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Prelude exports several partial functions: `head`, `tail`, `init`, `last`, `(!!)`, `read`, `maximum` on an empty list. An engineering approach is a team rule for them: pattern match instead, use total alternatives (`Safe`, `Data.List.NonEmpty`, `readMaybe` from `Text.Read`), or switch to a custom prelude (see [Haskell]({{< ref "functional-programming/haskell" >}}#custom-prelude)). GHC 9.8 added the `-Wx-partial` warning for uses of `head` and `tail`.
{{< /callout >}}


notes:

mayLast from Safe. We have an engineering question - how to work safely with partial functions?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Three options, from weakest to strongest guarantee. Report a better error (`lastNote`). Return the failure in the type (`lastMay`, so the caller must handle `Nothing`). Or make the precondition part of the argument's type: `Data.List.NonEmpty.last :: NonEmpty a -> a` is total, because an empty `NonEmpty` can't be constructed. The last option moves the check to where the list is built, often far from where it is used. [Functional Refactoring]({{< ref "functional-programming/functional-refactoring" >}}) has notes on the same question.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The function is called `lastMay`, not `mayLast`.
{{< /callout >}}


**Foldable and things** #todo

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`Foldable` is the class of containers that can be folded. A minimal instance defines `foldMap` or `foldr`; the class then provides `foldl'`, `toList`, `null`, `length`, `elem`, `sum`, `maximum` and more. Since GHC 7.10 the Prelude versions of `any`, `all`, `or`, `sum`, `length` and similar are Foldable-generic, so they work on `Maybe`, `Map`, `Set` and trees as well as lists.
{{< /callout >}}


question: "why someone could define the `any` function through `or` and `map` functions"

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`any p = or . map p` is the definition in the Haskell 2010 Report Prelude. Reasons to write it that way:
- It says what `any` means, built from existing parts, instead of re-writing the recursion.
- Laziness keeps it efficient. `map` produces elements only as `or` asks for them, and `or` stops at the first `True`, so the full intermediate list is never built and the function still works on infinite lists.
- The fusion law above proves it equal to the hand-written single fold, and GHC's foldr/build fusion can remove the intermediate list when compiling with optimisation.

base now defines the Foldable version through `foldMap` with the `Any` monoid instead, which is the same idea phrased with monoids.
{{< /callout >}}


so there is thing <https://discourse.haskell.org/t/composing-or-piping-multiple-folds/1439>

<https://www.haskellforall.com/2013/08/composable-streaming-folds.html>

<https://hackage.haskell.org/package/foldl-1.4.15/docs/Control-Foldl.html>

<https://deque.blog/2017/01/13/beautiful-code-control-fold/>

<https://www.haskellforall.com/2013/08/foldl-100-composable-streaming-and.html>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
These links are about Gabriella Gonzalez's `foldl` package (`Control.Foldl`). The problem it solves: `sum xs / fromIntegral (length xs)` walks `xs` twice and keeps the whole list in memory between the walks. `foldl` makes a left fold a value that can be combined with others, so that `L.fold ((/) <$> L.sum <*> L.genericLength) xs` computes the mean in a single pass.
{{< /callout >}}


Foldable class

DSL

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Probably refers to `Fold` as a small embedded language: the primitive folds are the vocabulary, `Functor` and `Applicative` are the grammar for combining them, and `L.fold` is the interpreter that runs a combined fold over any `Foldable`.
{{< /callout >}}


*implementation of the Applicative instance of the Fold*

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A `Fold` packages a step function, an initial accumulator and a final extraction step; the accumulator type is hidden. Combining two folds runs both steps on a pair of accumulators:
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
The real library uses a strict pair instead of a tuple. `foldl'` forces the accumulator only to weak head normal form, so with a lazy tuple both components would grow into chains of thunks (see [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#costs-of-laziness-space-leaks)).
{{< /callout >}}


foldMap

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`foldMap :: (Foldable t, Monoid m) => (a -> m) -> t a -> m` maps each element into a monoid and combines the results with `<>`. Choosing the monoid chooses the fold: `getSum (foldMap Sum xs)` is `sum`, `getAny (foldMap (Any . p) xs)` is `any p`, `foldMap (\x -> [x])` is `toList`. See the 1.12.23 entry on folds and monoids.
{{< /callout >}}


<https://en.wikipedia.org/wiki/Fold_(higher-order_function)>

## 24.11.22

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Probably a typo for 24.11.23: the entry sits between 23.11.23 and 25.11.23 and continues the previous day's topics.
{{< /callout >}}


explore several presented approaches to solve collatz conjencture

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The Collatz conjecture itself is an open problem. The Exercism exercise asks for the number of steps from `n` to 1, where each step halves an even number and maps an odd `n` to `3n + 1`.
{{< /callout >}}


folds, foldable from prev point

make collatz with fold ?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A fold consumes a structure that already exists. Collatz generates a sequence from a starting number, which is the job of an unfold; counting the steps is then a fold (`length`) over the unfolded list:
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
`unfoldr step 6` is `[6,3,10,5,16,8,4,2]`, eight steps. An unfold followed by a fold is called a hylomorphism. Thanks to laziness, the list is consumed as it is produced, so it is never held in memory in full.
{{< /callout >}}


unfoldr

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`unfoldr :: (b -> Maybe (a, b)) -> b -> [a]`, from `Data.List`, is the dual of `foldr`. Starting from a seed, the function either says stop (`Nothing`) or gives the next element and the next seed. `unfoldr (\n -> if n > 10 then Nothing else Just (n, n + 1)) 1` is `[1 .. 10]`. Its implementation is answered under 27.11.23.
{{< /callout >}}


<https://kseo.github.io/posts/2016-12-12-unfold-and-fold.html>

<https://www.youtube.com/watch?v=S_HSt6jEtWM&list=PLD8gywOEY4HaG5VSrKVnHxCptlJv2GAn7&index=1>

## 25.11.23


collatz example+

refactoring example with collatz+ moved to refactoring

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The Collatz refactoring example is now in [Functional Refactoring]({{< ref "functional-programming/functional-refactoring" >}}).
{{< /callout >}}


explore different methods in <https://pages.cpsc.ucalgary.ca/~robin/class/449/Evolution.htm> and collatz

## 26.11.23


computations in Haskell

highlight useful phrases posts

get more information about recursion patterns

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The standard vocabulary, from the "recursion schemes" literature:
- catamorphism: a fold, which consumes a structure bottom-up (`foldr` for lists);
- anamorphism: an unfold, which builds a structure from a seed (`unfoldr`);
- hylomorphism: an unfold followed by a fold, with the intermediate structure fused away (the Collatz counter above);
- paramorphism: a fold whose step also sees the unprocessed rest of the structure, i.e. primitive recursion (needed for `dropWhile` or insertion into a sorted list);
- apomorphism: an unfold that can stop early by returning a ready-made remainder.

Meijer, Fokkinga and Paterson's 1991 paper introduced most of these names for programmers; Edward Kmett's `recursion-schemes` package implements them for any datatype. See also [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds).
{{< /callout >}}

## 27.11.23


toRNA task: 1. straight, maybe imperative solution

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The Exercism RNA transcription task: complement each nucleotide (G to C, C to G, T to A, A to U) and reject anything else. In the Haskell track the signature is `toRNA :: String -> Either Char String`, with the first invalid character in `Left` (check against the current version). A straight recursive solution, then the idiomatic one:
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
{{< /callout >}}


course

unfoldr:

Source gap: the original local reference is [Unfoldr.hs](file://~/projects/haskell/src/Unfoldr.hs), but the file and type signature are not available in this note.

Open question: how can `unfoldr` be implemented with that type signature?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
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
{{< /callout >}}


Origami programming ([PDF](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc))

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Jeremy Gibbons's chapter in *The Fun of Programming* (2003). Folds and unfolds are the "origami" of functional programming: the chapter shows them for lists, trees and arbitrary datatypes, with their laws (fusion among them) and the hylomorphisms you get by composing an unfold with a fold.
{{< /callout >}}


<http://conal.net/talks/folds-and-unfolds.pdf> ([PDF](/sources/programming/functional-programming/elliott-2013-folds-and-unfolds-all-around-us.pdf.enc))

<https://functional.works-hub.com/learn/number-anamorphisms-aka-unfolds-explained-50e1a>

<https://thealmarty.com/2022/09/06/anamorphisms-aka-unfolds-explained/>

someone said that fold/unfold is the particular form of recusion/corecursion <https://en.wikipedia.org/wiki/Corecursion>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A fold is structural recursion: it consumes data, each recursive call is on a direct substructure, so on finite input it always terminates. An unfold is corecursion: it produces data one constructor at a time from a seed. It needn't terminate, but it is productive, delivering each piece in finite time: `iterate f = unfoldr (\x -> Just (x, f x))` produces an infinite list.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"A particular form" is the right phrase: folds capture structural recursion, not all recursion. Quicksort, for example, recurses on lists that aren't substructures of its input; it fits as a hylomorphism (unfold into a tree, fold the tree) but not as a single fold. In Haskell, finite data and infinite codata share one type (a list can be either), so the distinction is not enforced; in total languages such as Agda or Coq it is.
{{< /callout >}}


unfold is an anamorphism <https://en.wikipedia.org/wiki/Anamorphism>

fold is <https://en.wikipedia.org/wiki/Catamorphism>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The names come from category theory and were popularised for programmers by Meijer, Fokkinga and Paterson (1991). For a recursive type described by a "base functor" `f`, the catamorphism takes an algebra `f a -> a` that handles one layer, and the anamorphism takes a coalgebra `a -> f a` that produces one layer. The general definitions are in the explanation of "other types of List" below.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
For lists the catamorphism is `foldr`. `foldl` is not directly a catamorphism; it can be expressed as a `foldr` that builds a function.
{{< /callout >}}


? stream fusion. based on unfoldr-destroy fusion

? ... (list?) fusion on foldr-build fusion

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Two families of "shortcut fusion", both removing intermediate lists between a producer and a consumer:
- **foldr/build** (Gill, Launchbury and Peyton Jones, 1993). Producers are written with `build g = g (:) []`, consumers with `foldr`, and one rewrite rule does the work: `foldr k z (build g) = g k z`. Yes, this is GHC's list fusion in `base`. It handles `map`, `filter`, `sum` and list comprehensions well, but not functions that consume two lists at once (`zip`), and left folds with accumulating parameters fuse poorly.
- **destroy/unfoldr** (Svenningsson, 2002) is the dual: producers are unfolds, consumers are written with `destroy`, and `zip`-like functions fuse. Its weak spot is `filter`, which has to loop until it finds the next element.

Stream fusion (Coutts, Leshchinskiy and Stewart, 2007) builds on the second idea. A list becomes a non-recursive stepper, `data Stream a = forall s. Stream (s -> Step a s) s`, with `data Step a s = Done | Yield a s | Skip s`. `Skip` lets `filter` drop an element without a recursive loop, so every stage stays non-recursive and GHC can inline the whole pipeline into one loop. The `vector` library uses stream fusion.
{{< /callout >}}


<https://danilafe.com/blog/haskell_catamorphisms/>

<https://wiki.haskell.org/Catamorphisms>

other types of List (with additional `r` parameter) and folds/unfolds with them

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The extra parameter marks where the recursion goes. Taking it out of the list type and adding the fixed point separately gives one generic fold and unfold:
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
An algebra describes what to do with one layer once the `r` positions already hold results. `Mu`, in the linked question, is another encoding of the fixed point, `newtype Mu f = Mu (forall a. (f a -> a) -> a)`: a value represented by its own catamorphism.
{{< /callout >}}


<https://stackoverflow.com/questions/50946004/how-to-write-a-show-instance-for-mu-recursive-types/50950944>

maybe this is related to list usage in collatz function:

<https://gist.github.com/beala/d871ae8397167e7035f218a25ddf87dd>

Lazy fibonacci as a memo table: moved to [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#thunks-sharing-and-pattern-matching).

tree in containers

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`Data.Tree` in the `containers` package is a rose tree: `data Tree a = Node { rootLabel :: a, subForest :: [Tree a] }`. It comes with `Foldable` and `Traversable` instances, `flatten`, `levels`, `drawTree`, and its own fold and unfold, `foldTree :: (a -> [b] -> b) -> Tree a -> b` and `unfoldTree :: (b -> (a, [b])) -> b -> Tree a`. A tree is a good next datatype for practising folds and unfolds after lists.
{{< /callout >}}


laziness <http://www.usrsb.in/selling-laziness.html>

john hudges article "Why FP matters" and <https://blog.acolyer.org/2016/09/14/why-functional-programming-matters/> ([PDF](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc))

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
John Hughes's paper argues that the power of functional languages lies in modularity, and that two kinds of "glue" provide it: higher-order functions, which let you reuse recursion patterns such as folds, and lazy evaluation, which lets a producer and a consumer be written separately and still run in step. His examples include numerical algorithms built on lazy infinite lists and game-tree search over a lazily generated tree, which makes it a good companion to the unfold and tree topics above.
{{< /callout >}}


<https://github.com/rampion/tree-traversals>

## 28.11.23


<http://conal.net/talks/folds-and-unfolds.pdf> ([PDF](/sources/programming/functional-programming/elliott-2013-folds-and-unfolds-all-around-us.pdf.enc))

origami

haskell 194 course

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
CIS 194, the University of Pennsylvania's introductory Haskell course. The Spring 2013 version by Brent Yorgey is the one usually recommended for self-study (its lectures are linked from [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}})).
{{< /callout >}}


technique: Theme: replace control structures by data structures and standard

combining forms. -> `fact n = product [1..n]`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Instead of a loop with a counter and an accumulator, build the data the loop would walk over (`[1..n]`) and hand it to a standard combinator (`product`). This is Hughes's "glue" again, and CIS 194 calls the style wholemeal programming. Laziness keeps it cheap: the list is produced on demand, and with optimisation GHC can often fuse it away completely.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
If `fact` is used at type `Int`, `product [1..n]` overflows silently from `n = 21` on, since 21! is larger than the largest 64-bit `Int`. Give it the type `Integer -> Integer`.
{{< /callout >}}

## 29.11.23


make and use Listable type class from chapter 5 cs194

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
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
The instances for `[Int]` and `Tree Int` need `FlexibleInstances` (on by default under GHC2021), because Haskell 2010 only allows instance heads made of a type constructor applied to type variables.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`Listable` is a teaching example. Fixing the element type to `Int` is what forces the flexible instances. The library version of the idea is `Foldable`, whose `toList :: Foldable t => t a -> [a]` works for any element type and comes with `sum`, `length` and the rest for free.
{{< /callout >}}


create spark port to haskell

`traverse :: Applicative f => (a -> f b) -> t a -> f (t b)`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`traverse` applies an effectful function to every element and collects the results in a structure of the same shape, running the effects from left to right. `traverse readMaybe ["1", "2"] :: Maybe [Int]` is `Just [1,2]`; with `"x"` in the list it is `Nothing`. `traverse print [1, 2, 3]` prints three lines and returns `[(), (), ()]`. `sequenceA = traverse id` turns a `[Maybe a]` into a `Maybe [a]`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
This is the signature as written inside `class (Functor t, Foldable t) => Traversable t`, where `t` is the class variable. Used on its own, the type is `traverse :: (Traversable t, Applicative f) => (a -> f b) -> t a -> f (t b)`.
{{< /callout >}}


`mapM`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`mapM :: (Traversable t, Monad m) => (a -> m b) -> t a -> m (t b)` is `traverse` restricted to monads. It is older than `Applicative` and survives for compatibility; in practice `mapM = traverse`. `mapM_` and `traverse_` discard the results and only need `Foldable`.
{{< /callout >}}


continuation-passing style

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In continuation-passing style (CPS) a function never returns its result. It takes an extra argument, the continuation, and calls it with the result:
```haskell
factCPS :: Integer -> (Integer -> r) -> r
factCPS 0 k = k 1
factCPS n k = factCPS (n - 1) (\r -> k (n * r))
-- factCPS 5 id == 120
```
Every call is now a tail call, and "what happens next" is an ordinary value, so you can drop it (early exit), call it twice (backtracking) or store it. The `Cont` monad and `callCC` package this pattern. The same trick defines `foldl` through `foldr` by folding into a function.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
CPS doesn't make recursion cheaper by itself. The pending multiplications move from the stack into a chain of `n` closures on the heap.
{{< /callout >}}


<https://en.wikibooks.org/wiki/Haskell/Continuation_passing_style>

Forcing evaluation, Bang Pattern

Bang patterns: moved to [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#costs-of-laziness-space-leaks).

The worker-wrapper construct

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The wrapper is the function with the public interface, `collatz :: Integer -> Maybe Integer`, which checks the input. The worker is a local helper, usually called `go`, with extra parameters such as an accumulator or step counter, which does the recursion. The Collatz code in [Functional Refactoring]({{< ref "functional-programming/functional-refactoring" >}}) already has this shape.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The term has a second meaning. GHC's worker/wrapper transformation is a compiler optimisation that splits a function the same way automatically, for example so the worker can take unboxed `Int#` arguments that strictness analysis has shown are always needed, while the small wrapper is inlined at call sites. Gill and Hutton's 2009 paper gives the general theory. The Exercism Collatz approach is about the source-level idiom.
{{< /callout >}}


<https://exercism.org/tracks/haskell/exercises/collatz-conjecture/approaches/worker-wrapper>

## 30.11.23


Open question for today: what do I want to work on?

course? <https://john.cs.olemiss.edu/~hcc/csci450/notes/450lectureNotes.html>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
These are the course notes for H. Conrad Cunningham's CSci 450, the same source as the evaluation-model chapter quoted in [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}).
{{< /callout >}}


traversable

! short-circuiting

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
With `Maybe` or `Either` as the applicative, `traverse` stops at the first failure. It doesn't look at the remaining elements, so it terminates even on an infinite list:
```haskell
check :: Int -> Maybe Int
check x = if x > 0 then Just x else Nothing

traverse check [1, 2, 3]                  -- Just [1,2,3]
traverse check ([1, 2, -3] ++ [4 ..])     -- Nothing
```
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Short-circuiting is a property of the applicative, not of `traverse`. With `IO` or `State`, every element's effect runs, so traversing an infinite list never finishes. With an error-accumulating applicative such as `Validation`, the traversal deliberately continues so it can collect all errors.
{{< /callout >}}


<https://hackage.haskell.org/package/base-4.19.0.0/docs/Data-Traversable.html#g:4>

<https://stackoverflow.com/questions/7460809/can-someone-explain-the-traverse-function-in-haskell>

traverse, Traversable, iterator pattern paper, use and problems solved, ([PDF](/sources/programming/functional-programming/gibbons-2009-essence-of-the-iterator-pattern.pdf.enc))

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Gibbons and Oliveira's "The Essence of the Iterator Pattern" (2009) argues that `traverse`, from McBride and Paterson's applicative functors, is the functional form of the object-oriented Iterator pattern: one pass that can map over the elements and accumulate effects at the same time. Because products and compositions of applicatives are again applicative, two traversals can be fused into one. Problems it solves in everyday code:
- validating every element and failing on the first error (`Maybe`, `Either`), as in `toRNA` above;
- running an action per element and collecting results (`IO`);
- numbering or labelling the nodes of a tree in one pass (`State`);
- flipping nested structure, `[Maybe a]` to `Maybe [a]`, with `sequenceA`.
{{< /callout >}}

## 1.12.23


instances of Monoid (how to inverstigate it)

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In GHCi, `:info Monoid` (or `:i Monoid`) prints the class and every instance currently in scope; importing more modules shows more. The Haddock page for `Data.Monoid` lists the instances in base. Common ones: lists (`[]` and `++`), `Sum` and `Product`, `Any` and `All`, `First` and `Last`, `Ordering` (for chaining comparisons), `Maybe a` when `a` is a `Semigroup`, functions `a -> b` when `b` is a monoid, tuples of monoids, and `Map` with left-biased union.
{{< /callout >}}


readings about monoids <https://wiki.haskell.org/Typeclassopedia#Monoid> (futher reading)

? Applicative is almost the same as monads, except that effects cannot depend on previous results. #todo

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
That is the core difference. `(<*>) :: f (a -> b) -> f a -> f b` fixes which effects happen before anything runs; `(>>=) :: m a -> (a -> m b) -> m b` lets the next computation be chosen by looking at the previous result. Reading a number `n` and then reading `n` lines (`readLn >>= \n -> replicateM n getLine`) needs `Monad`; reading a name and an age and combining them (`(,) <$> getLine <*> readLn`) needs only `Applicative`. The fixed structure is also what makes applicatives analysable in advance: an applicative parser's grammar or an applicative build system's dependencies can be inspected without running anything (see Mokhov et al. under Library sources). More in [Applicative]({{< ref "functional-programming/applicative" >}}) and [Monads]({{< ref "functional-programming/monads" >}}).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Almost the same" undersells the gap. Every monad is an applicative, but many applicatives have no lawful monad instance: `ZipList`, `Const m`, and `Validation` (which collects all errors, something a monad can't do because it has to stop at the first failure to get the value it needs). Also, applicative effects still run in order. What they can't do is depend on earlier results; the final *value* can still combine all of them.
{{< /callout >}}


haskell programming:

write all the functions on lists in a recursive manner and with using folds <http://wiki.haskell.org/How_to_work_on_lists>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Good warm-ups with `foldr`:
```haskell
length' = foldr (\_ n -> 1 + n) 0
map' f = foldr (\x acc -> f x : acc) []
filter' p = foldr (\x acc -> if p x then x : acc else acc) []
reverse' = foldl (flip (:)) []
takeWhile' p = foldr (\x acc -> if p x then x : acc else []) []
```
The instructive hard cases are `dropWhile` (needs a pair of results or a paramorphism, since the step must know the unprocessed tail) and `foldl` itself (fold into a function: `foldl f z xs = foldr (\x k acc -> k (f acc x)) id xs z`). Hutton's fold tutorial (see Library sources) works through both.
{{< /callout >}}


folds on other data structures

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Every algebraic datatype has a fold: replace each constructor by a function with the same number of arguments.
```haskell
data Tree a = Leaf | Node (Tree a) a (Tree a)

foldTree :: b -> (b -> a -> b -> b) -> Tree a -> b
foldTree leaf _    Leaf         = leaf
foldTree leaf node (Node l x r) = node (foldTree leaf node l) x (foldTree leaf node r)

size  = foldTree 0 (\l _ r -> l + 1 + r)
depth = foldTree 0 (\l _ r -> 1 + max l r)
```
The folds of `Maybe`, `Either` and `Bool` are already in base as `maybe`, `either` and `bool`.
{{< /callout >}}


folds and monoids

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`foldMap` folds with a monoid. Associativity means the elements can be combined in any grouping, so a balanced tree can be folded from both halves independently (and in parallel); the identity element is the answer for an empty structure. The connection goes both ways: `foldr` can be recovered from `foldMap` with the monoid of functions under composition, `foldr f z t = appEndo (foldMap (Endo . f) t) z`, which is how `Foldable` defines `foldr` by default. See [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid).
{{< /callout >}}


FP with Haskell (*part 1*) -

monads, monad combinations, applicatives, functors etc

functional and domain modeling,

algorithms and usage foldl, traversable etc.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A workable order for this plan is functor, then applicative, then monad, then traversable, since `Traversable` is defined in terms of `Applicative`. Notes on these topics already exist in [Functor]({{< ref "functional-programming/functor" >}}), [Applicative]({{< ref "functional-programming/applicative" >}}), [Monads]({{< ref "functional-programming/monads" >}}) and [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds), and on domain modelling in [To Sort]({{< ref "functional-programming/to-sort" >}}#domain-modeling-in-haskell-and-scala).
{{< /callout >}}


See also: [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds) and [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#functional-combinators) for folds, [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}) for laziness, thunks and bang patterns, [Functional Refactoring]({{< ref "functional-programming/functional-refactoring" >}}) for Collatz and partial functions, [Applicative]({{< ref "functional-programming/applicative" >}}) and [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid) for the 1.12.23 topics, and [Exercises And Projects]({{< ref "functional-programming/exercises-and-projects" >}}#learning-tasks).

## Library sources


- [Hinze et al. 2010](/sources/programming/functional-programming/hinze-2010-theory-and-practice-of-fusion.pdf.enc), *Theory and Practice of Fusion*: the fusion-laws paper linked under 23.11.23.
- [Hutton 1999](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc), *A tutorial on the universality and expressiveness of fold*: the fusion law, list functions written as folds, `dropWhile` and `foldl` through `foldr`.
- [Gibbons 2003](/sources/programming/functional-programming/gibbons-2003-origami-programming.pdf.enc), *Origami programming*: the chapter referred to under 23.11.23 and 27.11.23.
- [Elliott 2013](/sources/programming/functional-programming/elliott-2013-folds-and-unfolds-all-around-us.pdf.enc), *Folds and unfolds all around us*: the conal.net talk linked under 27.11.23 and 28.11.23.
- [Gibbons et al. 1998](/sources/programming/functional-programming/gibbons-1998-the-under-appreciated-unfold.pdf.enc), *The Under-Appreciated Unfold*: unfolds and their laws, for the `unfoldr` questions.
- [Meijer et al. 1991](/sources/programming/functional-programming/meijer-1991-functional-programming-with-bananas-lenses.pdf.enc), *Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire*: catamorphisms, anamorphisms, hylomorphisms and paramorphisms.
- [Svenningsson 2002](/sources/programming/functional-programming/svenningsson-2002-shortcut-fusion-accumulating-parameters.pdf.enc), *Shortcut Fusion for Accumulating Parameters and Zip-like Functions*: destroy/unfoldr fusion.
- [Coutts et al. 2007](/sources/programming/functional-programming/coutts-2007-stream-fusion.pdf.enc), *Stream Fusion: From Lists to Streams to Nothing at All*: stream fusion, for the 27.11.23 question.
- [Gibbons et al. 2009](/sources/programming/functional-programming/gibbons-2009-essence-of-the-iterator-pattern.pdf.enc), *The Essence of the Iterator Pattern*: the iterator pattern paper under 30.11.23.
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: the article under 27.11.23.

Further reading:

- [Gibbons 2002](/sources/programming/functional-programming/gibbons-2002-calculating-functional-programs.pdf.enc), *Calculating Functional Programs*
- [Kiselyov et al. 2017](/sources/programming/functional-programming/kiselyov-2017-stream-fusion-to-completeness.pdf.enc), *Stream Fusion, to Completeness*
- [Mokhov et al. 2020](/sources/programming/functional-programming/mokhov-2020-build-systems-a-la-carte-theory-practice.pdf.enc), *Build Systems a la Carte: Theory and Practice*
- [Bird et al. 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*
