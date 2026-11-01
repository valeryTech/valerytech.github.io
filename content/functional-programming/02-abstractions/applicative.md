---
draft: false
toc: true
title: "Applicative Functors in Haskell"
aliases:
  - "/functional-programming/applicative/"
description: "Applying functions that sit inside a functor with pure and <*>, applicative style for independent computations, how it differs from a monad, the laws, and the Maybe, list and ZipList instances."
weight: "30"
linkTitle: "Applicative"
---

Applicative functors in Haskell: why mapping a multi-argument function over a functor leads to `<*>`, the `Applicative` class and its laws, the applicative style, how it differs from a monad, and the list and ZipList instances.

## From Functor to Applicative


When mapping functions over functors we usually map functions of one parameter. Mapping a function of two parameters, such as `*`, gives a functor that contains a function:

```haskell
ghci> :t fmap (*) (Just 3)
fmap (*) (Just 3) :: Num a => Maybe (a -> a)
```


The `Num a` matters: it says the function inside can only be applied to numbers of the same type as the `3`.

So mapping "multi-parameter" functions over functors gives *functors that contain functions*. What can we do with them? Say we have `Just (3 *)` and `Just 5`, and want to take the function out of the first and map it over the second. We could pattern-match on `Just` to get the function out, but we want a general way that works for every functor.

What we would like is `fmap` with one more argument, a function that applies a two-argument function to two wrapped arguments:

```haskell
liftA2 :: Applicative f => (a -> b -> c) -> f a -> f b -> f c
```


That function exists in `base` as `liftA2`. `fmap` only works on single-argument functions, and since the problem is the extra argument, partial application gets you close to a solution: the key is being able to do partial application inside a context such as `Maybe` or `IO`.

A common way to state the limit of `<$>` is that you end up with a function in a context and, because every Haskell function takes one argument at a time, no way to use it. That is too strong. If the argument is a plain value you can still use it: `fmap ($ 5) (Just (3 *))` gives `Just 15`. The real limit is that `Functor` has no way to combine two wrapped values. Given `Just (3 *)` and `Just 5`, `fmap` can reach into only one of them. Doing that for any functor needs a new operation, `<*>`, and that operation is what `Applicative` adds.

Because of the way partial application works, `<$>` and `<*>` chain together any number of arguments. Both operators are left-associative with the same precedence, so `f <$> x <*> y <*> z` means `((f <$> x) <*> y) <*> z`, and each `<*>` feeds one more argument to the partially applied function in the context:

```haskell
(\a b c -> a + b * c) <$> Just 1 <*> Just 2 <*> Just 3   -- Just 7
(\a b c -> a + b * c) <$> Just 1 <*> Nothing <*> Just 3  -- Nothing
```

## The `Applicative` class


The textbook definition:

```haskell
class (Functor f) => Applicative f where
  pure :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b
```


The class in today's `base` also has `liftA2`, `(*>)` and `(<*)`. An instance must define `pure` plus either `(<*>)` or `liftA2`; each of those two can be defined from the other.

### `<*>`, sequential application


"Sequential application" is the name the `base` documentation gives `(<*>)`; it is also read "ap" or "apply". "Sequential" refers to effects: in `fs <*> xs`, the effects of `fs` come before those of `xs`. For `IO` that means the first action runs first; for lists it fixes the order of the results.

As always, the type signatures are the key. The type of `(<*>)` is like the type of `($)` with everything enclosed in an `f`: `(<*>)` is function application within a computational context. It is also very like the type of `fmap`; the only difference is that the first parameter is `f (a -> b)`, a function in a context, instead of a plain function `a -> b`.

### `pure`


`pure` takes a value of any type `a` and returns a context of type `f a`. The intention is that `pure` creates a "default" container or an "effect-free" context:

- for `Maybe`, `pure = Just` (never fails);
- for lists, `pure x = [x]` (exactly one result);
- for `IO`, `pure x` does no I/O and returns `x`.

The behaviour of `pure` is tightly constrained by the laws it must satisfy together with `(<*>)`. Usually, for a given `(<*>)` there is only one possible `pure`. The [ZipLists](#ziplists) instance shows this at work: there `pure` has to produce an infinite list.

## Applicative style


`Applicative` enables the *applicative style*, a convenient way of structuring functorial computations, and gives a way to express a number of important patterns. The style `pure f <*> x <*> y <*> ...` takes a function whose parameters aren't wrapped in functors and uses it on several values that are in functor contexts. The function can take as many parameters as you like, because it is partially applied one step at a time between the `<*>`s. Since `pure f <*> x` equals `f <$> x` (a consequence of the laws), in practice the style is written `f <$> x <*> y <*> z`.

Open question: what is applicative style, and when should you use it? It means writing an ordinary function call, with `<$>` and `<*>` in place of plain application, so that each argument can come from its own context. Use it when you have several values in the same kind of context, need all of them, and none of them depends on another's result:

```haskell
data User = User { name :: String, age :: Int }

mkUser :: Maybe String -> Maybe Int -> Maybe User
mkUser n a = User <$> n <*> a

-- IO: read two lines, then build a pair
pairUp :: IO (String, String)
pairUp = (,) <$> getLine <*> getLine
```


It reads like the function call it replaces, which `do` notation with temporary variables does not. In Scala with Cats the same thing is written `(n, a).mapN(User.apply)`.

### Independent computations


Applicative style is particularly useful when several computations can be performed independently and then combined in a structured way. "Independently" means the computations don't depend on one another's *results*. It doesn't mean they run in parallel or out of order: in `(,) <$> getLine <*> getLine` the two reads still happen in order. What is fixed in advance is the *structure*: which computations run is known before any of them runs. That is what makes applicatives useful in practice:

- Validation can collect every error instead of stopping at the first one (`Validated` in Cats, `Validation` in the `validation` package), because nothing depends on an earlier success.
- A parser or command-line parser can be inspected before it runs. `optparse-applicative` generates `--help` text from the parser itself.
- Independent data fetches can be batched or run concurrently, which is how Facebook's Haxl library uses the `Applicative` interface.

"Combined in a structured way" is then just the function on the left of `<$>`.

## Applicative versus monad


Many applications turn out to need only applicative functors, not monads. Monads let you run actions that depend on the outcomes of earlier actions. The difference shows up in the types. With `>>=`, the next computation is a function of the previous result, `m a -> (a -> m b) -> m b`, so it can be chosen at run time:

```haskell
do n <- readLn
   if n > 0 then putStrLn "positive" else pure ()
```


With `<*>` both sides already exist before anything runs, so the structure is fixed. Every monad is an applicative, but not the other way round: `ZipList`, and validation types that collect errors, have no lawful monad matching their `<*>`. Mokhov et al. 2020 ([PDF](/sources/968bcf5644f3dbb1736d59b47f1717c1.bin)) make the difference concrete for build systems: applicative builds have static dependencies, known before the build, while monadic ones have dynamic dependencies that appear during it.

- Stack Overflow, "What advantage does monad give us over an applicative?": [https://stackoverflow.com/questions/17409260/what-advantage-does-monad-give-us-over-an-applicative/17412969#17412969](https://stackoverflow.com/questions/17409260/what-advantage-does-monad-give-us-over-an-applicative/17412969#17412969)

## Laws


Applicative instances in Haskell are expected to satisfy the applicative functor laws; the Typeclassopedia describes how to interpret them.

```haskell
pure id <*> v = v                             -- Identity

pure (.) <*> u <*> v <*> w = u <*> (v <*> w)  -- Composition

pure f <*> pure x = pure (f x)                -- Homomorphism

u <*> pure y = pure ($ y) <*> u               -- Interchange
```


In plain words:

- **Identity:** applying a wrapped `id` changes nothing.
- **Composition:** `<*>` is associative in the sense that composing first and applying later gives the same result.
- **Homomorphism:** applying a pure function to a pure value is just a pure result, with no effects created.
- **Interchange:** when the argument is pure, it doesn't matter which side is evaluated "first", because the pure side has no effects.

Together they say that `pure` adds no effects, which is why `pure f <*> x = fmap f x` follows.

## Instances

### Maybe

```haskell
instance Applicative Maybe where
  pure = Just

  Nothing  <*> _         = Nothing
  (Just f) <*> something = fmap f something
```

### Lists


You can view lists as non-deterministic computations. A value like `100` or `"what"` is a deterministic computation with one result, while a list like `[1,2,3]` is a computation that can't decide which result it wants, so it presents all the possible results. So `(+) <$> [1,2,3] <*> [4,5,6]` can be read as *adding together two non-deterministic computations with `+`*, producing another non-deterministic computation that is even less sure about its result.

The result is every combination, the first list varying slowest: `(+) <$> [1,2,3] <*> [4,5,6]` is `[5,6,7,6,7,8,7,8,9]`, the same as the list comprehension `[x + y | x <- [1,2,3], y <- [4,5,6]]`.

### ZipLists


Lists have a second lawful `Applicative`, which pairs elements by position instead of taking all combinations. A type can have only one instance of a class, so it lives on a newtype, `ZipList` from `Control.Applicative`:

```haskell
getZipList ((+) <$> ZipList [1,2,3] <*> ZipList [4,5,6])  -- [5,7,9]
```


The result is as long as the shortest list. `pure x` is the infinite list `ZipList (repeat x)`. A one-element list would break the identity law: `pure id <*> v` would then cut `v` to one element.

## Further links


- Wikibooks, Haskell, "Applicative functors": <https://en.wikibooks.org/wiki/Haskell/Applicative_functors>
- HaskellWiki, "Applicative functor": <https://wiki.haskell.org/Applicative_functor>
- serpentine.com, "The basics of applicative functors, put to practical work" (2008): <http://www.serpentine.com/blog/2008/02/06/the-basics-of-applicative-functors-put-to-practical-work/>
- Ross Paterson's page for the paper that introduced applicative functors, Conor McBride and Ross Paterson's *Applicative programming with effects* (Journal of Functional Programming, 2008); read for the motivation: <https://www.staff.city.ac.uk/~ross/papers/Applicative.html>
- Exercism forum, "Perspectives on Applicative": some explanation, further links and exercises: <https://forum.exercism.org/t/perspectives-on-applicative/4328/2>

## Open tasks


- [ ] Finish formulating when computations are independent enough for applicative style; a first answer is in [Independent computations](#independent-computations).

See also: [Functor]({{< ref "functional-programming/02-abstractions/functor" >}}) for `fmap` and the functor laws, [Monads]({{< ref "functional-programming/02-abstractions/monads" >}}) for what `>>=` adds, [map and flatMap]({{< ref "functional-programming/02-abstractions/map-flatmap" >}}) for the Scala view of `map` and `flatMap`, and [Semigroup and monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}), since an applicative can be described as a monoidal functor. Also [Error handling as values]({{< ref "functional-programming/03-building-programs/error-handling" >}}) for `Validated`, [Traversable and traverse]({{< ref "functional-programming/02-abstractions/traversable" >}}) for `traverse`, and [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}) for running independent effects in parallel.

## Library sources


- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles*: chapter 17, Applicative, covers Functor vs. Applicative, applicatives as monoidal functors, the four laws, and the ZipList monoid.
- [Mokhov et al. 2020](/sources/968bcf5644f3dbb1736d59b47f1717c1.bin), *Build Systems a la Carte: Theory and Practice*: section 3.4, "The Need for Polymorphism in Task" (the constraint on a task classifies it: `Applicative` for static dependencies, `Monad` for dynamic ones, with `Functor` and `Selective` as other points); section 3.5, "Monadic Tasks" (spreadsheet formulas whose dependencies depend on a cell's value); section 3.7, "Computing Dependencies" (static dependencies extracted by running the task in `Const`); on *Applicative versus monad*.
- [Welsh et al. 2020](/sources/08cab18bbc8a17a6885874831fe8c431.bin), *Scala with Cats*: chapter 6, Semigroupal and Applicative, the Scala version with `mapN` and `Validated`.
- [Ghosh 2017](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin), *Functional and Reactive Domain Modeling*: chapter 4, section 4.2.2, The Applicative Functor pattern: lifting a function of several arguments into a context, applied to validating the fields of a bank account in Scala; the same motivation as From Functor to Applicative.
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell*: chapter 9, Introducing Monads, sections "Applying Applicatives" and "Using the Applicative Laws".
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth*: chapter 2, section 2.3: `Applicative` between `Functor` and `Monad`, with `IO`, `Writer` and lists compared side by side (2.3.2).
- [Gibbons et al. 2009](/sources/0887110810ff7a2b58876a95a1481907.bin), *The Essence of the Iterator Pattern*: section 3, "Applicative Functors": the four laws rewrite any applicative expression to `pure f <*> u1 <*> ... <*> un`, so the effects are fixed in advance, unlike with `>>=`; section 3.1, every monad gives an applicative; section 3.2, `Const` over a monoid is an applicative that is not a monad, and lists are applicative in three ways (cartesian, concatenating, zipping); section 3.3, applicatives are closed under product and composition, monads are not; on *Applicative versus monad*, *Laws* and *ZipLists*.
- [Serrano Mena 2021](/sources/4f6f84b5680da34841126999b31e2ed3.bin), *Book of Monads (2nd edition)*: chapter 3, Lifting Pure Functions: section 3.1 starts from `fmap` lifting only one-argument functions and from the duplication in `lift2`, `lift3`, ..., and arrives at `ap`; section 3.2 defines `Applicative` and gives `ZipList`, with `pure` as `repeat`, as an applicative that is not a monad; section 3.3 covers applicative style, `<*` and `*>` (3.3.1) and `ApplicativeDo`, with Haxl as the reason to prefer applicative translations (3.3.2); section 3.4 shows that applicatives are monoidal functors; on *From Functor to Applicative*, *Applicative versus monad*, *ZipLists* and *Independent computations*.

Further reading:

- [Gibbons et al. 2023](/sources/351d745643344e9ecfa3dc8b88296685.bin), *Phases in Software Architecture* ([doi:10.1145/3609025.3609479](https://doi.org/10.1145/3609025.3609479))
- [Pilquist et al. 2023](/sources/075d81d6390bbb592aa1a8ba0a5f967d.bin), *Functional Programming in Scala (2nd edition)*
- [Schwarz 2019](/sources/e08d684028ca8873968d5625f4173f0a.bin), *Monads do not Compose*
- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional*: chapter 10, Implementation: Working with Errors, section "Monads and More", sub-heading "Composing in Parallel with Applicatives": a two-paragraph contrast of combining results in series (monads) with combining them independently (applicatives), with error-collecting validation as the use; on *Independent computations*.
- [Serrano Mena 2022](/sources/5c1001bd2c4b75b2ff640e61358fc71a.bin), *Haskell: Almost Standard Libraries*: chapter 9, Validation and parsing, section 9.2, "Parsers": an applicative `Person <$> word <* spaces <*> ...` parser; section 9.2.1, "Monadic parsing": `Monad` is needed once a parsed count decides how many words follow (`count n`); on *Applicative versus monad*.
