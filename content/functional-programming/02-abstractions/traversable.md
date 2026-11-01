---
draft: false
toc: true
title: "Traversable and traverse in Haskell and Scala"
aliases:
  - "/functional-programming/traversable/"
description: "traverse, sequenceA and traverse_, how the chosen applicative decides between short-circuiting, IO effects, parallelism and state, writing instances, the laws, and the essence of the iterator pattern."
linkTitle: "Traversable"
---

`traverse` maps an effectful function over a structure and collects the results inside a single effect, keeping the structure's shape. `Traversable` is the type class of structures that support it, and it sits on top of `Functor`, `Foldable` and `Applicative`.

## The problem traverse solves


Mapping a function that returns an effect gives you a structure full of effects, which is usually the wrong way round. Mapping `readMaybe :: String -> Maybe Int` over a list gives `[Maybe Int]`, when what you want is `Maybe [Int]`: all the numbers, or a failure. Mapping a Scala `getUptime: String => Future[Int]` over a list of hostnames gives `List[Future[Int]]`, when you want one `Future[List[Int]]` to wait on.

Welsh and Gurnell (ch. 7.2.1) start from the second case. Written by hand, the fix is a `foldLeft` that threads an accumulator `Future[List[Int]]` and combines it with each new `Future` in a for comprehension. It works but is noisy, and it is the same code for every effect type. The standard library's `Future.traverse(hostnames)(getUptime)` hides exactly that fold. `traverse` is the general form: it works for any effect with an `Applicative` instance and any structure with a `Traversable` instance.

```haskell
traverse readMaybe ["1", "2", "3"] :: Maybe [Int]   -- Just [1,2,3]
traverse readMaybe ["1", "x", "3"] :: Maybe [Int]   -- Nothing
```

```scala
import cats.syntax.all.*

List("1", "2", "3").traverse(_.toIntOption)   // Some(List(1, 2, 3))
List("1", "x", "3").traverse(_.toIntOption)   // None
```

## The class and its functions


In Haskell the class lives in `Data.Traversable` and its methods are exported from the Prelude (Allen and Moronuki, ch. 21.2):

```haskell
class (Functor t, Foldable t) => Traversable t where
  traverse  :: Applicative f => (a -> f b) -> t a -> f (t b)
  traverse f = sequenceA . fmap f

  sequenceA :: Applicative f => t (f a) -> f (t a)
  sequenceA = traverse id

  mapM      :: Monad m => (a -> m b) -> t a -> m (t b)
  sequence  :: Monad m => t (m a) -> m (t a)
  {-# MINIMAL traverse | sequenceA #-}
```


Each of `traverse` and `sequenceA` can be defined from the other, so an instance gives one of them.

- `sequenceA` only flips two layers: `t (f a)` becomes `f (t a)`. `sequenceA [Just 1, Just 2]` is `Just [1,2]`, and one `Nothing` anywhere makes the whole result `Nothing`.
- `traverse f` is `fmap f` followed by `sequenceA`, done in one pass. Allen and Moronuki's rule of thumb (ch. 21.5): whenever you write `sequence` or `sequenceA` composed with `map` or `fmap`, write `traverse` instead.
- `mapM` and `sequence` are the same operations restricted to monads. Before GHC 7.10 they were list-only and required `Monad`; `traverse` generalises the list to any `Traversable` and weakens `Monad` to `Applicative` (Allen and Moronuki, ch. 21.4). They survive for compatibility.
- `for = flip traverse` and `forM = flip mapM` put the structure first, which reads well with a lambda body: `for users $ \u -> ...`.

The fold-only cousins live in `Data.Foldable` and need only `Foldable`:

```haskell
traverse_ :: (Foldable t, Applicative f) => (a -> f b) -> t a -> f ()
mapM_     :: (Foldable t, Monad m)       => (a -> m b) -> t a -> m ()
for_      :: (Foldable t, Applicative f) => t a -> (a -> f b) -> f ()
```


They run an effect per element and throw the results away, so they never rebuild the structure. That is why `Foldable` is enough: there is nothing to put back.

In Cats the type class is `Traverse` (Welsh and Gurnell, ch. 7.2.3), with `traverse` and `sequence` as methods and syntax from `cats.syntax.traverse` (or `cats.syntax.all`):

```scala
trait Traverse[F[_]] extends Functor[F] with Foldable[F]:
  def traverse[G[_]: Applicative, A, B](fa: F[A])(f: A => G[B]): G[F[B]]
  def sequence[G[_]: Applicative, A](fga: F[G[A]]): G[F[A]] =
    traverse(fga)(identity)
```


That is the shape of the real trait, abbreviated; an instance must also supply `foldLeft` and `foldRight`. Cats names the flipping operation `sequence`, not `sequenceA`, and `traverse_` sits on `Foldable`. Schwarz's slides (Schwarz 2023) point out exactly that while unpacking a real use of `traverse_` from Volpe's *Practical FP in Scala*. The shopping-cart `update` method iterates over the cart's items with `traverse_` to issue one Redis write per item, and calls `traverse_` on an `Option[Quantity]`, so the write only happens when a quantity is present. An `Option` is a structure with zero or one element, and `traverse_` over it is the idiomatic "do this if present".

## Relation to Functor and Foldable


`Traversable` is stronger than both its superclasses: from `traverse` you can recover `fmap` and `foldMap` by choosing the applicative (Allen and Moronuki, ch. 21.8; Pilquist et al., ch. 12.7 and 12.7.1).

```haskell
import Data.Functor.Identity
import Data.Functor.Const

fmap' :: Traversable t => (a -> b) -> t a -> t b
fmap' f = runIdentity . traverse (Identity . f)

foldMap' :: (Traversable t, Monoid m) => (a -> m) -> t a -> m
foldMap' f = getConst . traverse (Const . f)
```


`Identity` has no effect at all, so traversing in it is a plain map. `Const m` ignores its second type parameter and, given a `Monoid m`, is an applicative whose `pure` is `mempty` and whose `<*>` is `<>`. Traversing in it throws the rebuilt structure away and keeps only the combined summary, which is a fold. `Data.Traversable` exports these two as `fmapDefault` and `foldMapDefault`, for defining the superclass instances from a hand-written `traverse`.

Pilquist et al. (ch. 12.6) put the difference from folding this way: `foldMap` discards the structure and replaces it with a monoid's operations, while `traverse` preserves it. A `Tree[Option[A]]` sequenced becomes an `Option[Tree[A]]`, still a tree.

The hierarchy is strict in both directions:

- `Foldable` cannot extend `Functor` (Pilquist et al., exercise 12.15). A `Set` can be folded but has no lawful `fmap` without extra constraints, because mapping can merge elements and the result needs an `Ord` instance.
- Not every functor is traversable. A function `r -> a` is a functor, but you cannot pull an effect out from under the arrow without knowing every argument in advance. `IO a` is a functor too, and there is no way to turn `IO (Maybe a)` into `Maybe (IO a)`: whether the result is `Nothing` is only known after the action runs.

See [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds) for `Foldable` itself and [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}) for `fmap`.

## What the applicative decides


`traverse` itself only walks the structure and combines one result per element with `<*>` (or `map2`). What happens along the way is decided by the applicative you traverse in. The same call means very different things:

| Applicative | `traverse f xs` means |
| --- | --- |
| `Maybe` / `Option` | all succeed, or `Nothing` at the first failure |
| `Either e` | all succeed, or the first `Left` |
| `Validation` / `Validated` | all succeed, or every error collected |
| `IO` | run one action per element, left to right, collect the results |
| `State s` | thread a state through the elements in order |
| `Const m` | fold the elements into the monoid `m` |
| list | every combination (a cartesian product) |

### Short-circuiting with Maybe and Either


With `Maybe` or `Either` as the applicative, a single failure fixes the result. In Haskell, laziness means the remaining elements aren't even examined, so a traversal stops on an infinite list as soon as it meets a failure. The study-log entry for 30.11.23 has the example:

```haskell
check :: Int -> Maybe Int
check x = if x > 0 then Just x else Nothing

traverse check [1, 2, 3]               -- Just [1,2,3]
traverse check ([1, 2, -3] ++ [4 ..])  -- Nothing
```


`Either` works the same way but keeps the reason. The Exercism RNA-transcription task in the 27.11.23 entry of [FP study log]({{< ref "functional-programming/05-practice/study-log" >}}) reduces to `toRNA = traverse complement`, where `complement :: Char -> Either Char Char` returns the first invalid character in `Left`.

```scala
def positive(n: Int): Either[String, Int] =
  if n > 0 then Right(n) else Left(s"$n is not positive")

List(1, 2, 3).traverse(positive)    // Right(List(1, 2, 3))
List(1, -2, -3).traverse(positive)  // Left("-2 is not positive")
```


Short-circuiting is a property of the applicative, not of `traverse`. Swap in an error-accumulating applicative and the same traversal reports everything. Welsh and Gurnell's exercises (ch. 7.2.2.2 and 7.2.2.3) run one even-number check through `Option` and then through `Validated[List[String], *]`. On `List(1, 2, 3)` the first gives `None`; the second gives both "1 is not even" and "3 is not even". `Validated` is an applicative but deliberately not a monad, and that is what lets it keep going: no later step depends on an earlier result. See [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}) and [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}).

```scala
import cats.data.{Validated, ValidatedNel}

def positiveV(n: Int): ValidatedNel[String, Int] =
  if n > 0 then Validated.validNel(n)
  else Validated.invalidNel(s"$n is not positive")

List(1, -2, -3).traverse(positiveV)
// Invalid(NonEmptyList("-2 is not positive", "-3 is not positive"))
```

### Effects in IO


With `IO`, every element's action runs, in order from left to right, and the results come back in a structure of the same shape. Allen and Moronuki (ch. 21.8) turn a list of URLs into one action that fetches them all with `traverse get urls`, where mapping `get` would give a list of separate actions.

```haskell
traverse print [1, 2, 3]   -- prints three lines, returns [(), (), ()]
traverse_ print [1, 2, 3]  -- prints three lines, returns ()
```

```scala
import cats.effect.IO

List("snap", "crackle", "pop").traverse(IO.println)   // IO[List[Unit]]
List("snap", "crackle", "pop").traverse_(IO.println)  // IO[Unit]
```


When the results are units, use `traverse_`: it says you only care about the effect and avoids building a list of `()`.

Allen and Moronuki's "axing tedious code" example (ch. 21.7) shows two traversals nesting. A pipeline fetches strings from a database (`IO [String]`), decodes each one (`String -> Either Err SomeObj`), and then runs an `IO` step on the decoded list. The original code mapped, called `sequence`, cased on the `Either` by hand, and rewrapped. The refactored body is one line: `traverse makeIoOnlyObj (traverse decodeFn a)`. The inner `traverse` runs in `Either`, so decoding stops at the first error. The outer one traverses the `Either` itself, which has zero or one value, in `IO`: the `IO` step runs only if decoding succeeded, and the result has type `IO (Either Err [...])`.

### Parallel traversal


`traverse` in `IO` is sequential. Cats has `parTraverse` (and `parSequence`) with the same shape, `F[A] => (A => G[B]) => G[F[B]]`, which runs the per-element effects in parallel and still returns the results in the original order (Rosien, ch. 3.5 and 3.6). Rosien explains it as `traverse` in a different applicative: each `IO` is converted to its parallel counterpart, whose `Applicative` instance runs both sides at once, and converted back at the end. That only works because `traverse` asks for nothing more than an `Applicative`. In Haskell, the `async` package's `mapConcurrently` plays the same role. See [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}).

### State: labelling and accumulating


Traversing in `State` threads a value through the elements in order, so you can number, label or accumulate in one pass over any traversable (Pilquist et al., ch. 12.7.2):

```haskell
import Control.Monad.State

label :: Traversable t => t a -> t (Int, a)
label t = evalState (traverse step t) 0
  where
    step a = do
      n <- get
      put (n + 1)
      pure (n, a)
```


The same function numbers a list, the nodes of a tree or the values of a map. Pilquist et al. factor the pattern into `mapAccum`; in Haskell it is `mapAccumL :: Traversable t => (s -> a -> (s, b)) -> s -> t a -> (s, t b)` in `Data.Traversable`. From it they derive `toList`, `zipWithIndex`, a generic `reverse` and `foldLeft` for every traversable. Their generic `zip` shows the limit of the approach: a traversal must keep the shape of its input, so zipping two structures of different shapes has to fail or pad with `None`.

## Writing instances


An instance looks like `fmap` with `pure` and `<*>` in the right places. For a binary tree:

```haskell
data Tree a = Leaf a | Node (Tree a) (Tree a)
  deriving (Show, Functor, Foldable)

instance Traversable Tree where
  traverse f (Leaf x)   = Leaf <$> f x
  traverse f (Node l r) = Node <$> traverse f l <*> traverse f r
```


GHC can also derive all three classes (`deriving (Functor, Foldable, Traversable)`, through the `DeriveTraversable` extension, which GHC2021 enables), and the derived instance is the one you would write by hand.

Some standard instances surprise people because they traverse only the last type parameter (Allen and Moronuki, ch. 21.9). `Either e` traverses the `Right` value and leaves a `Left` alone. A pair `(a, b)` traverses only the second component: `traverse f (x, y) = (,) x <$> f y`. A `Map k` traverses the values, keeping the keys.

## Laws


A lawful `traverse` must satisfy three laws (Allen and Moronuki, ch. 21.10):

```haskell
-- naturality: for every applicative transformation t
t . traverse f = traverse (t . f)

-- identity
traverse Identity = Identity

-- composition
traverse (Compose . fmap g . f) = Compose . fmap (traverse g) . traverse f
```


An applicative transformation is a function `forall a. f a -> g a` that preserves `pure` and `<*>`. In plain terms:

- **Identity:** traversing with no effect changes nothing. An instance can't drop elements, add structure or invent effects of its own.
- **Composition:** two traversals in a row can be fused into a single traversal in the composed applicative. Running `f` over everything and then `g` over everything is the same as running `f` then `g` on each element in one pass.
- **Naturality:** the traversal doesn't care which applicative it is in. It can't, for example, inspect the effect and decide to skip elements.

The `sequenceA` versions are equivalent (Allen and Moronuki, ch. 21.10). The laws can be checked with property-based tests: the `checkers` library has a `traversable` test batch for Haskell (Allen and Moronuki, ch. 21.11), and Cats ships law-checking tests in `cats-laws`. See [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}).

Gibbons and Oliveira (sec. 5) show what the laws exclude. They derive a purity law, `traverse pure = pure`, from naturality. A tree instance that traverses the right child before the left and puts the results back in swapped positions is well typed but breaks it, because `traverse pure` then mirrors the tree. One that visits the left subtree twice and the right not at all breaks it too. Swapping the visiting order while also flipping the constructor back is lawful: it just traverses from right to left. A list instance that runs each element's effect twice still satisfies the purity law; they flag such "duplicating" traversals as an open problem rather than settle it. Later work showed that the full set of laws, composition included, rules them out (Jaskelioff and Rypáček, "An Investigation of the Laws of Traversals", 2012; needs checking).

## The essence of the iterator pattern


Gibbons and Oliveira's paper "The Essence of the Iterator Pattern" (2009) asks what the object-oriented Iterator pattern is, seen functionally. Their starting point is a C# `foreach` loop that does two things at once: it touches every element of a collection (mapping) and counts them (accumulating). Earlier functional models captured one aspect or the other, `map` the first and folds the second. Their claim is that McBride and Paterson's applicative functors, and `traverse` in particular, capture both, so `traverse` is the essence of the pattern (sec. 1). By "iteration" they mean internal iteration: the collection drives the loop and the client supplies the body.

The argument rests on the fact that one `traverse` specialises to every kind of loop by choosing the applicative (sec. 3.4 and 4):

- in `Identity` it is `fmap`, a pure map;
- in a monoidal `Const` it is a fold, so `contents`, which collects the elements into a list, is a traversal;
- in a monad such as `State` it is monadic map, with effects threaded through.

The middle case is why applicatives, not monads, are the right level. `Const m` is an applicative but not a monad, so a traversal defined over monads (`mapM`) can't express accumulation. They draw the conclusion that monadic map never needed `bind` in the first place (sec. 3.4).

The second half of the argument is modularity. Applicatives are closed under products and under composition, which monads are not (sec. 3.3). So two traversals can be fused into one pass:

- the product of two applicatives runs two independent traversals at once. Their example splits a structure into its shape and its contents in a single pass, `traverse (shapeBody ⊗ contentsBody)`, justified by naturality (sec. 4.1 and 5.3);
- composition fuses two dependent traversals, which is the composition law above (sec. 5.2).

Their worked example is the Unix `wc` utility (sec. 6). In imperative form it is one loop that counts characters, words and lines with shared mutable state. They write the three counts as three small traversals, each in a simple applicative, and combine them with the product into a single traversal again. Monadic traversals fuse only under extra conditions, which shows the advantage concretely: Kleisli composition of two monadic traversals fuses only when the monad is commutative, while the applicative fusion law needs no side condition (sec. 5.4). They also note one way in which traversals beat object-oriented iterators: a traversal can change the element type, which an iterator over mutable objects can't (sec. 7).

Pilquist et al. (ch. 12.7.4 and 12.7.5) give the practical side of the same ideas as exercises: fuse two traversals with an applicative product, and compose two `Traverse` instances to reach the values in a nested `Map[K, Option[List[V]]]` in one go. Their chapter 12.7.6 uses `Traverse` once more: two monads `F` and `G` compose into a monad when `G` is traversable, because `sequence` can swap the inner layers before joining. That is the general idea behind some monad transformers.

## Pitfalls


- `traverse` over a huge list in a strict effect builds the whole result list before you see any of it. When you don't need the results, `traverse_` (or `mapM_`) avoids that.
- `traverse` and `sequence` in `IO` are sequential. Reach for `parTraverse` or `mapConcurrently` deliberately, not by default: parallel calls to an external service can need a limit on how many run at once.
- `sequence` on a list in the list applicative is a cartesian product, not a transpose: `sequenceA [[1,2],[3,4]]` is `[[1,3],[1,4],[2,3],[2,4]]`. Welsh and Gurnell's exercise 7.2.2.1 does the same with `Vector`.
- For a pair, an `Either` or a `Map`, `traverse` and the folds only see the last type parameter. `length (1, 2)` is `1`.

See also: [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}), [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}), [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}), [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds), [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}), [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}), [Property-based testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}), [FP study log]({{< ref "functional-programming/05-practice/study-log" >}}) (the `traverse`, `mapM` and short-circuiting jots of 29.11.23 and 30.11.23, and the `toRNA` task).

## Library sources


- [Gibbons and Oliveira 2009](/sources/programming/functional-programming/gibbons-2009-essence-of-the-iterator-pattern.pdf.enc), *The Essence of the Iterator Pattern*: applicative functors and idiomatic traversal (sec. 3), shape and contents (sec. 4), the laws of traverse and fusion (sec. 5), the `wc` example (sec. 6).
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: chapter 21, Traversable: the class, `sequenceA`, `traverse` and `mapM`, the Morse-code and pipeline refactorings, recovering `fmap` and `foldMap`, instances, laws and QuickChecking them.
- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: chapter 7, Foldable and Traverse: from `Future.traverse` to a generic `listTraverse`, exercises with `Vector`, `Option` and `Validated`, and Cats' `Traverse`.
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: chapter 12, Applicative and traversable functors, sections 12.6 and 12.7: `Traverse` as a generalisation of `map` and `foldMap`, traversals with `State`, `mapAccum`, zipping, fusion, nesting and monad composition.
- [Schwarz 2023](/sources/programming/scala/schwarz-2023-sighting-of-cats-traverse-in-practical-fp.pdf.enc), *A sighting of traverse_ in Practical FP in Scala*: `traverse_` on a `List` and on an `Option` in a real Cats Effect shopping cart.
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*: chapter 3, Parallel execution, sections 3.5 and 3.6: `parTraverse` and `parSequence`.

Further reading:

- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: the shopping-cart code Schwarz annotates.
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *The Book of Monads (2nd edition)*: section 4.2, Traversables.
