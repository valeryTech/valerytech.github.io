---
draft: false
toc: true
title: "Applicative"
linkTitle: "Applicative"
---

Applicative functors in Haskell: why mapping a multi-argument function over a functor leads to `<*>`, the `Applicative` class and its laws, the applicative style, how it differs from a monad, and the list and ZipList instances.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## From Functor to Applicative


a way to applicative

So far, when we were mapping functions over functors, we usually mapped functions that take only one parameter. But what happens when we map a function like `*`, which takes two parameters, over a functor?
 >>
fmap (*) (Just 3) :: Maybe (a -> a)

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
GHCi reports the type with its constraint: `fmap (*) (Just 3) :: Num a => Maybe (a -> a)`. The `Num a` matters, because it says the function inside can only be applied to numbers of the same type as the `3`.
{{< /callout >}}


We see how by mapping "multi-parameter" functions over functors, we get *functors that contain functions inside them*. So now what can we do with them?

But what if we have a functor value of `Just (3 *)` and a functor value of Just 5 and we want to take out the function from `Just (3 *)` and map it over `Just 5`?

We could pattern-match against the Just constructor to get the function out of it and then map it over `Just 5`, but we're looking for a more general and abstract way of doing that, which works across functors.

This is nearly identical to `fmap`, except you're adding one argument. This is one of the limitations of Functor's `fmap`: it only works on single-argument functions. Because your main problem is having an extra argument, using partial application should move you close to a solution.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The quote has lost its example. It compares `fmap` with a function you would like to have, one that applies a two-argument function to two wrapped arguments: `(a -> b -> c) -> f a -> f b -> f c`. That function exists in `base` as `liftA2`.
{{< /callout >}}


The key to solving your problem lies in being able to perform partial application in a context such as `Maybe` or `IO`.

the real limitations of `<$>` is that you end up with a function in a context. and because of partial application you have no way of using that function (because every function in haskell is seen as only taking a single argument)

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Close, but "no way of using that function" is too strong. If the argument is a plain value you can still use it: `fmap ($ 5) (Just (3 *))` gives `Just 15`. The real limit is that `Functor` has no way to combine two wrapped values. Given `Just (3 *)` and `Just 5`, `fmap` can reach into only one of them. Doing that for any functor needs a new operation, `<*>`, and that operation is what `Applicative` adds.
{{< /callout >}}


Because of the way partial application works, you can use `<$>` and `<*>` to chain together any number of arguments.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Both operators are left-associative with the same precedence, so `f <$> x <*> y <*> z` means `((f <$> x) <*> y) <*> z`. Each `<*>` feeds one more argument to the partially applied function in the context:

```haskell
(\a b c -> a + b * c) <$> Just 1 <*> Just 2 <*> Just 3   -- Just 7
(\a b c -> a + b * c) <$> Just 1 <*> Nothing <*> Just 3  -- Nothing
```
{{< /callout >}}

## The `Applicative` class


Meet the Applicative:

```haskell
class (Functor f) => Applicative f where
  pure :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b
```

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
This is the textbook version. The class in today's `base` also has `liftA2`, `(*>)` and `(<*)`, and an instance must define `pure` plus either `(<*>)` or `liftA2`; each of those two can be defined from the other.
{{< /callout >}}


`<*>` - sequental application

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
"Sequential application" is the name the `base` documentation gives `(<*>)`. "Sequential" refers to effects: in `fs <*> xs`, the effects of `fs` come before those of `xs`. For `IO` that means the first action runs first; for lists it fixes the order of the results. It is also read "ap" or "apply".
{{< /callout >}}


As always, it's crucial to understand the type signatures. First, consider `(<*>)`: the best way of thinking about it comes from noting that the type of `(<*>)` is similar to the type of `($)`, but with everything enclosed in an `f`. In other words, `(<*>)` is just function application within a computational context. The type of `(<*>)` is also very similar to the type of `fmap`; the only difference is that the first parameter is `f (a -> b)`, a function in a context, instead of a "normal" function `(a -> b)`.

`pure` takes a value of any type `a`, and returns a context/container of type `f a`. The intention is that `pure` creates some sort of "default" container or "effect free" context. In fact, the behavior of `pure` is quite constrained by the laws it should satisfy in conjunction with `(<*>)`. Usually, for a given implementation of `(<*>)` there is only one possible implementation of `pure`.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Examples of "effect free": for `Maybe`, `pure = Just` (never fails); for lists, `pure x = [x]` (exactly one result); for `IO`, `pure x` does no I/O and returns `x`. The ZipList instance below shows the laws at work: there `pure` has to produce an infinite list.
{{< /callout >}}

## Applicative style


style

It enables the eponymous *applicative style*, a convenient way of structuring functorial computations, and also provides means to express a number of important patterns.

Isn't this awesome?! Applicative functors and the applicative style of doing `pure f <*> x <*> y <*>` ... allow us to take a function that expects parameters that aren't necessarily wrapped in functors and use that function to operate on several values that are in functor contexts. The function can take as many parameters as we want, because it's always partially applied step by step between occurences of `<*>`.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`pure f <*> x` equals `f <$> x` (a consequence of the laws), so in practice the style is written `f <$> x <*> y <*> z`.
{{< /callout >}}


questions

What is an *applicative style* and when to use it?

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Applicative style means writing an ordinary function call, with `<$>` and `<*>` in place of plain application, so that each argument can come from its own context. Use it when you have several values in the same kind of context, need all of them, and none of them depends on another's result:

```haskell
data User = User { name :: String, age :: Int }

mkUser :: Maybe String -> Maybe Int -> Maybe User
mkUser n a = User <$> n <*> a

-- IO: read two lines, then build a pair
pairUp :: IO (String, String)
pairUp = (,) <$> getLine <*> getLine
```

It reads like the function call it replaces, which `do` notation with temporary variables does not. If a later step needs an earlier result to decide what to do next, you need a monad (`>>=` or `do`). In Scala with Cats the same thing is written `(n, a).mapN(User.apply)`.
{{< /callout >}}


Applicative style is particularly beneficial when dealing with scenarios where you have multiple computations that *can be performed independently*? #todo and then combined in a structured way.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Yes, with one refinement: "independently" means the computations don't depend on one another's *results*. It doesn't mean they run in parallel or out of order. In `(,) <$> getLine <*> getLine` the two reads still happen in order. What is fixed in advance is the *structure*: which computations run is known before any of them runs. That is what makes applicatives useful in practice:

- Validation can collect every error instead of stopping at the first one (`Validated` in Cats, `Validation` in the `validation` package), because nothing depends on an earlier success.
- A parser or command-line parser can be inspected before it runs. `optparse-applicative` generates `--help` text from the parser itself.
- Independent data fetches can be batched or run concurrently, which is how Facebook's Haxl library uses the `Applicative` interface.

"Combined in a structured way" is then just the function on the left of `<$>`.
{{< /callout >}}


It has turned out that many applications do not require monad functionality but only those of applicative functors. Monads allow you to run actions depending on the outcomes of earlier actions.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The difference shows up in the types. With `>>=`, the next computation is a function of the previous result, `m a -> (a -> m b) -> m b`, so it can be chosen at run time:

```haskell
do n <- readLn
if n > 0 then putStrLn "positive" else pure ()
```

With `<*>` both sides already exist before anything runs, so the structure is fixed. Every monad is an applicative, but not the other way round: `ZipList`, and validation types that collect errors, have no lawful monad matching their `<*>`. Mokhov et al. (see Library sources) make the difference concrete for build systems: applicative builds have static dependencies, known before the build, while monadic ones have dynamic dependencies that appear during it.
{{< /callout >}}

## Laws


Applicative instances in Haskell are expected to satisfy the applicative functor laws. Their interpretation is described in typeclassopedia.

```haskell
pure id <*> v = v               -- Identity

pure (.) <*> u <*> v <*> w = u <*> (v <*> w)  -- Composition

pure f <*> pure x = pure (f x)  -- Homomorphism

u <*> pure y = pure ($ y) <*> u  -- Interchange
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In plain words. Identity: applying a wrapped `id` changes nothing. Composition: `<*>` is associative in the sense that composing first and applying later gives the same result. Homomorphism: applying a pure function to a pure value is just a pure result, with no effects created. Interchange: when the argument is pure, it doesn't matter which side is evaluated "first", because the pure side has no effects. Together they say that `pure` adds no effects, which is why `pure f <*> x = fmap f x` follows.
{{< /callout >}}

## Instances

### Maybe


for example, for `Maybe`:

```haskell
instance Applicative Maybe where

 pure = Just

 Nothing <*> _ = Nothing

 (Just f) <*> something = fmap f something
```

### Lists


You can view lists as non-deterministic computations. A value like `100` or `"what"` can be viewed as a deterministic computation that has only one result, whereas a list like `[1,2,3]` can be viewed as a computation that can't decide on which result it wants to have, so it presents us with all of the possible results. So when you do something like `(+) <$> [1,2,3] <*> [4,5,6]`, you can think of it as *adding together two non-deterministic computations with `+`*, only to produce another non-deterministic computation that's even less sure about its result.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The result is every combination, the first list varying slowest: `(+) <$> [1,2,3] <*> [4,5,6]` is `[5,6,7,6,7,8,7,8,9]`, the same as the list comprehension `[x + y | x <- [1,2,3], y <- [4,5,6]]`.
{{< /callout >}}

### ZipLists

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This heading had no content yet. Lists have a second lawful `Applicative`, which pairs elements by position instead of taking all combinations. A type can have only one instance of a class, so it lives on a newtype, `ZipList` from `Control.Applicative`:

```haskell
getZipList ((+) <$> ZipList [1,2,3] <*> ZipList [4,5,6])  -- [5,7,9]
```

The result is as long as the shortest list. `pure x` is the infinite list `ZipList (repeat x)`. A one-element list would break the identity law: `pure id <*> v` would then cut `v` to one element.
{{< /callout >}}

## Reading


<https://en.wikibooks.org/wiki/Haskell/Applicative_functors>

<https://wiki.haskell.org/Applicative_functor>

<http://www.serpentine.com/blog/2008/02/06/the-basics-of-applicative-functors-put-to-practical-work/>

<https://www.staff.city.ac.uk/~ross/papers/Applicative.html> - motivation

<https://forum.exercism.org/t/perspectives-on-applicative/4328/2> some info + links + exercises

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The city.ac.uk link is Ross Paterson's page for the paper that introduced applicative functors, Conor McBride and Ross Paterson's *Applicative programming with effects* (Journal of Functional Programming, 2008).
{{< /callout >}}


See also: [Functor]({{< ref "functional-programming/functor" >}}) for `fmap` and the functor laws, [Monads]({{< ref "functional-programming/monads" >}}) for what `>>=` adds, [Map Flatmap]({{< ref "functional-programming/map-flatmap" >}}) for the Scala view of `map` and `flatMap`, and [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}), since an applicative can be described as a monoidal functor. Also [Error Handling]({{< ref "functional-programming/error-handling" >}}) for `Validated`, [Traversable]({{< ref "functional-programming/traversable" >}}) for `traverse`, and [Concurrency]({{< ref "functional-programming/concurrency" >}}) for running independent effects in parallel.

[https://stackoverflow.com/questions/17409260/what-advantage-does-monad-give-us-over-an-applicative/17412969#17412969](https://stackoverflow.com/questions/17409260/what-advantage-does-monad-give-us-over-an-applicative/17412969#17412969)

## Library sources


- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: chapter 17, Applicative, covers Functor vs. Applicative, applicatives as monoidal functors, the four laws, and the ZipList monoid.
- [Mokhov et al. 2020](/sources/programming/functional-programming/mokhov-2020-build-systems-a-la-carte-theory-practice.pdf.enc), *Build Systems a la Carte: Theory and Practice*: applicative tasks have static dependencies and monadic tasks dynamic ones; on the applicative-versus-monad passage.
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: chapter 6, Semigroupal and Applicative, the Scala version with `mapN` and `Validated`.
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*: chapter 4, section 4.2.2, The Applicative Functor pattern: lifting a function of several arguments into a context, applied to validating the fields of a bank account in Scala; the same motivation as From Functor to Applicative.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 9, Introducing Monads, sections "Applying Applicatives" and "Using the Applicative Laws".
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 2, section 2.3: `Applicative` between `Functor` and `Monad`, with `IO`, `Writer` and lists compared side by side (2.3.2).

Further reading:

- [Gibbons et al. 2023](/sources/software-engineering/architecture/gibbons-2023-phases-in-software-architecture.pdf.enc), *Phases in Software Architecture* ([doi:10.1145/3609025.3609479](https://doi.org/10.1145/3609025.3609479))
- [Gibbons et al. 2009](/sources/programming/functional-programming/gibbons-2009-essence-of-the-iterator-pattern.pdf.enc), *The Essence of the Iterator Pattern*
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*
- [Schwarz 2019](/sources/programming/scala/schwarz-2019-monads-do-not-compose.pdf.enc), *Monads do not Compose*
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*
