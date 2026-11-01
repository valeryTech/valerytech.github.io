---
draft: false
toc: true
title: "Haskell Language Notes and Resources"
aliases:
  - "/functional-programming/haskell/"
description: "Haskell learning path, toolchain and ecosystem, standard library alternatives and a custom Prelude, useful libraries, language notes from GHCi to constructors, practical advice, and books, courses and other resources."
weight: "10"
linkTitle: "Haskell"
---

A reference note on the Haskell language: a study path, the toolchain and libraries, small language notes, advice from experienced users, and collected links. Concept material (monads, folds, laziness, type classes) lives in the concept notes listed under See also.

## Learning path


The plan is a mix of books, one cumulative project, exercises and a real project.

- **Books.** *Effective Haskell* by Rebecca Skinner (Pragmatic Bookshelf, 2023; [PDF](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc)) as a practical main course, with the other books under [Books](#books). *Yet Another Haskell Tutorial* (YAHT) by Hal Daumé III is also worth a look; the Wikibooks version under [Tutorials and wikis](#tutorials-and-wikis) is an edited copy of it, and it predates much of today's tooling and libraries.
- **A cumulative series.** "Learn Haskell by building": a series of cumulative assignments that gradually introduce the language, tooling and idioms. A good model for its structure is the free book *Learn Haskell by building a blog generator* (<https://learn-haskell.blog/>, under [Courses](#courses)), which grows one project step by step and introduces tooling along the way.
- **Exercises.** The tasks from "GPiN". The abbreviation needs checking: it may mean Graham Hutton's *Programming in Haskell*, whose chapters end with exercises, or *Get Programming with Haskell* by Will Kurt, which other notes in the vault abbreviate as GPWH.
- **Projects.** A time-management tool (tasks, time tracking, a calendar) is a good first real project, because it needs persistence, parsing, dates and a user interface. More ideas are in [Project ideas]({{< ref "functional-programming/05-practice/exercises-and-projects" >}}#project-ideas).
- **Effects.** Get fluent with the monad [transformers](http://hackage.haskell.org/package/transformers) and [mtl](https://hackage.haskell.org/package/mtl) libraries:
  - `transformers` defines the concrete monad transformers (`ReaderT`, `StateT`, `WriterT`, `ExceptT`, `MaybeT`) and `lift`, which moves an action from the inner monad up one layer.
  - `mtl` builds on it with type classes such as `MonadReader`, `MonadState` and `MonadError`. With them, `get` or `ask` works at any depth of a stack without manual lifting, and functions can be written against a capability instead of a concrete stack: `tick :: MonadState Int m => m ()`.
  - Caveat: transformers and mtl are worth learning, but no longer the only mainstream way to structure effects. Many applications use a single `ReaderT Env IO` (the pattern `rio` is built around, see [Standard library alternatives](#standard-library-alternatives)), and effect libraries such as `effectful` or `polysemy` are common alternatives (see [Effect systems]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#effect-systems) and [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}})).
  - A practical trap: the ordinary `WriterT` leaks space. `StateT`, or the CPS writer in `Control.Monad.Trans.Writer.CPS`, avoids it.
- **The Prelude.** A common piece of advice is "don't use the Prelude and make your own type classes". It mixes two things. Replacing the Prelude ([Custom Prelude](#custom-prelude)) means importing safer, more complete defaults, such as `Text` instead of `String` and total instead of partial functions. Defining your own type classes is rarely a good idea when learning: write your own `Functor` or `Monad` as an exercise (the point of the fp-course under [Courses](#courses)), but use the standard ones in real code so that libraries interoperate. Most learners are better off with the standard Prelude until its limits actually bother them.

Tasks:

- [ ] Start the "Learn Haskell by building" series.
- [ ] Get fluent with `transformers` and `mtl`.
- [ ] Work through the tasks from GPiN.
- [ ] Build a project, for example the time-management tool.
- [ ] Find and use FP Complete's recommendations about IO. The original jot is unfinished; it probably means the "ReaderT design pattern" and their advice on exceptions in IO, which `rio` packages together (needs checking).

## Ecosystem and tooling

### Toolchain


FP Complete is the company behind Stack (the build tool), Stackage (curated package sets that are known to build together), the `rio` standard library and School of Haskell.

The tooling landscape has shifted since that toolset was the default. GHCup is the installer haskell.org recommends; it installs GHC, cabal-install, Stack and the language server (HLS) side by side. Stack is still widely used, but cabal-install is at least as common for new projects. Some fpcomplete.com links in this note may have moved (needs checking).

### Standard library alternatives


`rio`, from FP Complete, describes itself as a standard library for Haskell:

- <https://www.fpcomplete.com/haskell/library/rio/>
- <https://github.com/commercialhaskell/rio>

It is a Prelude replacement that re-exports `Text`, `ByteString`, containers and safe exception handling, and it is built around the `RIO env a` monad, a `ReaderT env IO` for application environments. It is one answer to the problem described in [The cost of choice](#the-cost-of-choice), and one option for a [Custom Prelude](#custom-prelude). "Commercial Haskell" is the name of the GitHub organisation (`commercialhaskell`, which also hosts Stack), not of the library.

### Custom Prelude


The Prelude is imported into every module automatically. One user's experience:

> Using basic-prelude with NoImplicitPrelude to lower the amount of importing I do, and it tends to steer you into Text based solution instead of Strings.

`{-# LANGUAGE NoImplicitPrelude #-}` switches the implicit import off, and you import a replacement explicitly:

```haskell
{-# LANGUAGE NoImplicitPrelude #-}
module Main where

import RIO   -- or: import Relude
```


To do it for the whole project, `relude` documents the cabal `mixins` approach, `mixins: base hiding (Prelude), relude (Relude as Prelude)`, together with a dependency on `relude`. Writing a project-local `Prelude` module that re-exports your preferred set is another common option.

Notes on the choice:

- `basic-prelude` is little used now; `relude` and `rio` are the usual choices.
- Using `Text` everywhere also needs `OverloadedStrings`, so that string literals can be `Text`.
- Many teams decide a custom Prelude isn't worth it and import `Data.Text`, `Data.Map.Strict` and the rest qualified instead.

### The cost of choice


A passage on the state of the ecosystem (source not recorded; it reads like the motivation for `rio`):

> On the other end of this spectrum, we have the libraries that ship with GHC, especially `base`. There is a strong sentiment for maintaining backwards compatibility and retaining workflows developed over the decades of the Haskell language. This includes some great stuff, but also some things many would consider design mistakes (such as partial functions).
>
> We're left with a world where there are arguably too many degrees of freedom when starting a new Haskell project, and too many points of failures by relying on dangerous code. Teams can easily spend significant time making basic architectural and library decisions on a new project. And for those relatively new to the Haskell ecosystem, it's all too easy to make choices with unknown costs, with those costs only showing themselves later.

Partial functions crash on some inputs: `head`, `tail`, `fromJust`, `read` and `!!`. The "degrees of freedom" are the decisions every new project faces: `String` or `Text`, which Prelude, which effect style (mtl, `ReaderT` over IO, an effect library), which streaming and logging libraries, Stack or cabal.

Caveat: `base` changes slowly, but it does change: `Semigroup` became a superclass of `Monoid`, and recent GHC versions warn about `head` and `tail`. The cost of choice has also eased, since a few conventions (`Text`, the `containers` family, the ReaderT-over-IO pattern) are now common defaults.

## Libraries

### Modules in base


`base` ships with GHC. It contains the Prelude, lists, `Maybe`, `Either`, `Data.List.NonEmpty`, IO, `IORef`, concurrency primitives and the standard type classes. It does not contain the container types: `Data.Map`, `Data.Set`, `Data.IntMap` and `Data.Sequence` are in `containers`, arrays are in `array` or `vector`, and `Text` and `ByteString` have their own packages. All of these come with a GHC installation, but you still have to list them as dependencies.

Advice from an experienced user (source not recorded):

> Data.Functor, Control.Applicative, Data.Foldable, Data.Traversable, Data.Monoid are all useful for manipulating the "weirder" values and I wish I paid attention to them earlier. (Of course, Control.Monad is useful too, but I found that early enough.)

The functions these modules provide, which beginners tend to reimplement:

- `Data.Functor`: `<$>`, `<&>` (flipped `<$>`), `<$`, `$>` and `void`.
- `Control.Applicative`: `<*>`, `liftA2`, `*>`, `<*`, and `Alternative` with `<|>`, `many`, `some` and `optional`.
- `Data.Foldable`: `traverse_`, `for_`, `foldl'`, `foldMap`, and `toList`, `null`, `length`, `elem` for any container.
- `Data.Traversable`: `traverse`, `for`, `sequenceA`, `mapAccumL`.
- `Data.Monoid`: the newtype wrappers described below.
- `Control.Monad`: among others `guard`, below.

`Data.List` and `Data.Maybe` also contain a wide range of small utility functions (Serrano Mena, ch. 3; [PDF](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc)):

- `mapMaybe :: (a -> Maybe b) -> [a] -> [b]` maps and drops the `Nothing`s in one pass: `mapMaybe readMaybe ["1", "x", "3"] :: [Int]` is `[1, 3]`.
- In `Data.Maybe`: `catMaybes`, `fromMaybe`, `maybe` and `listToMaybe`.
- In `Data.List`: `sortOn`, `groupBy`, `partition`, `foldl'`, `isPrefixOf`, `intercalate` and `nub`. Caveat: `nub` is quadratic. For large lists use `Set.toList . Set.fromList`, or `nubOrd` from `containers` (`Data.Containers.ListUtils`) to keep the original order.

**`Data.Monoid` newtypes.** A type can have only one instance of a class, so `Data.Monoid` defines wrappers that pick which monoid a type uses. Numbers can be combined by addition or multiplication, so there are `Sum` and `Product`; booleans by `&&` or `||`, so `All` and `Any`; plus `First`, `Last`, `Endo` (composition of `a -> a` functions) and `Dual` (flipped order). Example: `getSum (foldMap Sum [1, 2, 3])` is `6`. See [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid).

Caveat: `First` and `Last` exist twice with different meanings. In `Data.Monoid` they wrap `Maybe a` and skip `Nothing`s; in `Data.Semigroup` they wrap plain values. Importing both modules unqualified leads to confusing type errors.

**`Control.Monad.guard`.** `guard :: Alternative f => Bool -> f ()` fails the computation when the condition is false: `Nothing` in `Maybe`, the empty list in lists. In the list monad it works like a filter in a list comprehension:

```haskell
import Control.Monad (guard)

pythagorean :: Int -> [(Int, Int, Int)]
pythagorean n = do
  a <- [1 .. n]
  b <- [a .. n]
  c <- [b .. n]
  guard (a * a + b * b == c * c)
  pure (a, b, c)
```

### Containers


`containers` has ordered maps and sets (`Map`, `Set`, needing `Ord` keys), `IntMap`, `Seq` (a finger tree with fast access at both ends) and `Tree`. `unordered-containers` has hash-based `HashMap` and `HashSet`, needing `Hashable` keys, usually faster for lookups on large maps with string-like keys. Import them qualified, `import qualified Data.Map.Strict as Map`, and prefer the `.Strict` modules unless you need lazy values.

### Utility packages


- `extra`: Neil Mitchell's collection of small utilities that "should have been in `base`". For each module, such as `Data.List`, it defines a `Data.List.Extra` with more functions: `Data.List.Extra` has `splitOn`, `trim` and `nubOrd`, and `Control.Monad.Extra` has `whenM`, `unlessM` and `concatMapM`.
- `split`: list splitting, which `base` lacks. `splitOn "," "a,b,,c"` is `["a", "b", "", "c"]`; there are also `chunksOf`, `splitWhen` and more configurable splitters.
- `safe`: total versions of the Prelude's partial functions, such as `headMay :: [a] -> Maybe a`, `tailMay`, `readMay`, `atMay` instead of `!!` and `maximumMay`, plus `headDef`-style versions that take a default. Part of this is now covered by `base` itself: `Text.Read.readMaybe` replaces `readMay`, and `Data.List.NonEmpty` lets you avoid needing `head` at all. GHC 9.8 and later also warn when you use `head` and `tail`.

### Folds: Control.Foldl


`Control.Foldl`, from Gabriella Gonzalez's `foldl` package, gives better folds in the sense of composable ones (Serrano Mena, ch. 3.1). A fold is a value with an `Applicative` instance, so several folds can be combined and run in one pass over the data with no space leak: `L.fold ((/) <$> L.sum <*> L.genericLength) xs` computes a mean while traversing `xs` once. It is not a replacement for `foldr` or `foldl'`. It pays off when you need several statistics of one stream, or folds you can reuse over lists, vectors and streaming libraries alike. The background posts are in [FP study log]({{< ref "functional-programming/05-practice/study-log" >}}).

### Parser combinators


Monadic parser combinators: <https://hackage.haskell.org/package/parsec>

A parser combinator library represents a parser as a value, roughly `String -> Maybe (a, String)`, and builds big parsers from small ones with `Functor`, `Applicative`, `Monad` and `Alternative`. "Monadic parser combinators" is also the title of a well-known 1996 report by Graham Hutton and Erik Meijer that builds such a library from scratch.

`parsec` is the classic, but new code more often uses `megaparsec`, which has better error messages and is actively developed, or `attoparsec` for fast parsing of `ByteString` and `Text` where error quality matters less.

### Effect libraries


`eff` (<https://github.com/hasura/eff>) is Alexis King's effect library, designed around delimited continuations that she added to GHC as primitive operations. It aims to make algebraic effects fast. As far as I know it stayed experimental (needs checking). The effect libraries in wider use are `effectful`, `polysemy`, `fused-effects` and `bluefin`. See [Effect systems]({{< ref "functional-programming/01-foundations/pure-functions-and-effects" >}}#effect-systems).

### Streaming and abstraction libraries


- `conduit` (<https://github.com/snoyberg/conduit>) and `pipes` (<https://github.com/Gabriella439/pipes>) are the two classic streaming libraries, for processing data in constant memory with interleaved effects. `streaming` and `streamly` are later alternatives.
- Edward Kmett (<https://github.com/ekmett>) is the author of `lens` and many of the abstraction libraries, such as `comonad`, `free` and `profunctors`.
- `category-extras` is long deprecated. Kmett split it into separate packages such as `comonad`, `free`, `semigroupoids`, `kan-extensions`, `adjunctions` and `recursion-schemes`; use those instead.

## Language notes

### Variables and definitions


A definition from a learning text (source not recorded):

> In Haskell, a variable provides a way to give a name to an expression. Once a variable is _bound to_ (i.e. associated with) a particular expression, its value does not change: we can always use the name of the variable instead of writing out the expression, and get the same result either way.
>
> When a function doesn't take any parameters, we usually say it's a _definition_ (or a _name_).

Tags: #dict

Strictly, something that takes no parameters is not a function at all: `x = 5` or `primes = sieve [2 ..]` binds a name to a value, whose type has no ` -> `. A top-level binding like `primes` is called a constant applicative form (CAF). It is evaluated at most once and its value is shared by every use, which matters for memory (see [Thunks, sharing and pattern matching]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#thunks-sharing-and-pattern-matching)).

Another collected phrase, from a context with a binding like `r = 5`: "the evaluation of the program replaces all occurrences of `r` with `5` (within the scope of the definition)". This describes the substitution model, a way to reason about the program, not what GHC does: at run time `r` is a reference to a shared value. See [Substitution model and equational reasoning]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#substitution-model-and-equational-reasoning).

### Exploring in GHCi

```haskell
ghci> :t head
head :: [a] -> a
ghci> :t (==)
(==) :: Eq a => a -> a -> Bool
ghci> read "[1,2,3,4]" ++ [3]
[1,2,3,4,3]
ghci> read "5" :: Float
5.0
```


`:t` shows a type. `Eq a =>` is a constraint: `==` works for any type `a` that has an `Eq` instance. `read :: Read a => String -> a` parses a string into whatever type the context demands. In the third example `++ [3]` fixes the result as a list of numbers; in the last one there is no context, so the annotation `:: Float` is needed.

The GHCi commands worth using all the time:

- `:type` (`:t`) shows an expression's type.
- `:info` (`:i`) shows where a name is defined, a class's methods and instances, or a type's constructors, and an operator's fixity.
- `:kind` (`:k`) shows a type's kind.
- `:browse Data.Maybe` lists everything a module exports.

Caveat: `head` and `read` are partial. `head []` and `read "x" :: Int` crash at run time. Use pattern matching or `Data.List.NonEmpty` instead of `head`, and `readMaybe` from `Text.Read` instead of `read`.

### List comprehensions


Examples from *Learn You a Haskell*:

```haskell
[x | x <- [50 .. 100], x `mod` 7 == 3]
-- [52,59,66,73,80,87,94]

boomBangs xs = [if x < 10 then "BOOM!" else "BANG!" | x <- xs, odd x]
boomBangs [7 .. 13]
-- ["BOOM!","BOOM!","BANG!","BANG!"]

length' xs = sum [1 | _ <- xs]
```


The first keeps the numbers from 50 to 100 that leave remainder 3 when divided by 7. `boomBangs [7 .. 13]` keeps the odd numbers 7, 9, 11 and 13. `length'` replaces every element with `1` (the `_` ignores the element) and sums the ones. A comprehension is sugar: `[f x | x <- xs, p x]` is `map f (filter p xs)`.

### let and where


Haskell has an alternative to `where` clauses called `let` expressions. Both bind local names, but they differ in shape and scope:

```haskell
cylinder r h = sideArea + 2 * topArea
  where sideArea = 2 * pi * r * h
        topArea  = pi * r ^ 2

cylinder' r h =
  let sideArea = 2 * pi * r * h
      topArea  = pi * r ^ 2
  in  sideArea + 2 * topArea
```


They are not interchangeable. `let ... in ...` is an expression and can appear anywhere an expression can, for example inside a lambda or one branch of an `if`. `where` belongs to a whole equation and scopes over all its guards, which `let` cannot do. Otherwise the choice is style: `where` puts the main expression first and the details after.

### Data constructors and type constructors


Value constructors are functions, so they can be mapped and partially applied. A list of concentric circles with different radii:

```haskell
data Shape = Circle Float Float Float   -- centre x, centre y, radius
-- Circle :: Float -> Float -> Float -> Shape

concentric :: [Shape]
concentric = map (Circle 10 20) [4, 5, 6]
```


In the same way that a value constructor (such as a `Car` constructor taking three values) takes values and produces a new value, a type constructor takes types as parameters and produces a new type. `GADTSyntax` makes this visible by giving each constructor's full type signature:

```haskell
{-# LANGUAGE GADTSyntax #-}
module MyMaybe where

import Prelude hiding (Maybe (..))

data Maybe a where
  Nothing :: Maybe a
  Just    :: a -> Maybe a
```


This defines exactly the usual `data Maybe a = Nothing | Just a`. `Just` is a function from `a` to `Maybe a`, and `Maybe` is a function from a type `a` to a type `Maybe a`, with kind `Type -> Type`. The `hiding` import is needed because otherwise the definition clashes with the Prelude's `Maybe` and uses of `Maybe`, `Just` and `Nothing` become ambiguous; alternatively, choose a different name. With the full `GADTs` extension, constructors may also return a more specific type, such as `IntLit :: Int -> Expr Int`.

### Lambda lifting


Lambda lifting (<https://wiki.haskell.org/Lambda_lifting>) turns a local function that uses variables from its surrounding scope into a top-level function that takes those variables as extra parameters, so no closure has to be allocated:

```haskell
f x = map g [1, 2, 3] where g y = x + y

-- lambda-lifted:
g' x y = x + y
f' x = map (g' x) [1, 2, 3]
```


It is the alternative to closure conversion, which keeps the function local and packs its free variables into a heap object. GHC applies lambda lifting selectively as an optimisation late in compilation.

## Practice and advice

### Types first


Slogans collected from experienced users:

> Read types first, not code.
>
> You need start seeing the types as _the primary part_ of your code that _drives_ your implementation, rather than restricts it.
>
> Read it slowly.
>
> In Haskell, you should use the powerful type system to help you as much as you can.
>
> Types are the model of your program. Follow the types.

In Haskell a type signature often tells you most of what a function can do. `a -> a` can only be the identity (or fail, or loop forever), and `(a -> b) -> [a] -> [b]` can only rearrange, drop or duplicate results of applying the function, because it knows nothing else about `a` and `b`. Reading the signature first narrows down the implementation before you read a line of it. Code is also dense, so reading slowly is normal, not a sign of being lost.

The rest are the slogans of type-driven development: first model the domain as types so that invalid states can't be represented, then write functions whose types make the remaining choices obvious, and let compiler errors guide you to the implementation. See [Type-first design]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}#type-first-design) and [Product and sum types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}).

Caveat: types constrain shape, not meaning. `sum` and `product` have the same type, and so do `sort` and `reverse` on a list of `Int`s. Following the types gets you to *a* program that compiles; tests or properties are still needed to get the right one.

### Typed holes


Use type holes recursively, for arguments and for results. A name starting with `_` in an expression is a typed hole: GHC refuses to compile but reports the type each hole needs and the variables in scope that fit.

```haskell
-- Three successive versions of one definition, not one module.
product :: Num a => [a] -> a

-- Step 1
product ns = foldr _f _n ns
-- GHC reports _f :: a -> a -> a and _n :: a

-- Step 2
product = foldr (\a b -> _c) _n
-- one level down: _c :: a, with the values a and b in scope

-- Step 3
product = foldr (\a b -> a * b) 1   -- which is foldr (*) 1
```


The first step needs the list on both sides (`product ns = ... ns`) or on neither, as in the later steps: `product ns = foldr _f _n` does not type-check, because `foldr _f _n` is still a function waiting for the list. Replacing `_f` by a lambda with a new hole `_c` asks the same question one level down. *Effective Haskell* covers this in chapter 3, "Getting Help from Type Holes" (Skinner 2023).

### Learn the language precisely


Advice from an experienced user (source not recorded), with what each point involves.

> I wish I had read the Haskell Report earlier. I haven't read the whole thing, but the first 6 chapters we[re] really good to know.

The current standard is the Haskell 2010 Report. Its first chapters cover lexical structure, expressions (including how `do`, list comprehensions, `if` and sections are translated into simpler core forms), declarations and bindings, modules, and the predefined types and classes. GHC implements many extensions beyond it, but the core is still exactly this.

> Understanding how to parse Haskell expressions. I went for a long time without really understanding the details.

The rules that matter most:

- Function application binds tighter than any operator: `f x + g y` is `(f x) + (g y)`, and `f x:xs` is `(f x) : xs`.
- Operators have fixity declarations (`infixr 5 :`, `infixl 6 +`, `infixr 0 $`), which `:info` shows.
- `$` is just a low-precedence application operator.
- Minus is special. `(- 1)` is negative one, not a section, so the function that subtracts one is written `subtract 1` (or `(+ (-1))`). `f -1` parses as `f - 1`, so write `f (-1)`.

> What unification is. How it is similar to pattern matching.

Unification is how type inference solves equations between types. To type `map length`, GHC has to make `a -> b` (the argument type of `map`) equal to `[c] -> Int` (the type of `length`, simplified), and finds `a = [c]` and `b = Int`. Pattern matching is the one-sided version: only the pattern has variables, and the value is fixed. In unification both sides may contain variables, and solving can fail; for example `a ~ [a]` produces the "occurs check" error.

> How instance selection works for type classes.

To solve a constraint like `Show [Int]`, GHC looks for an instance whose head matches (`instance Show a => Show [a]`), looking only at the head and not at the context before the `=>`. Once it commits to that instance, it has to solve the context, here `Show Int`. It never backtracks. This is why two instances with the same head are rejected even if their contexts differ, and why overlapping instances need explicit pragmas. See [Type classes]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#type-classes).

> Knowing all the things you can do with Maybe.

Beyond pattern matching: `maybe` and `fromMaybe` for defaults; `fmap` to transform the value inside; `>>=` or `do` to chain steps that can fail; `<|>` to take the first `Just`; `traverse` to turn `[a]` and `a -> Maybe b` into `Maybe [b]` (all succeed or nothing); and `catMaybes` and `mapMaybe` for lists. See [Option]({{< ref "functional-programming/02-abstractions/monads" >}}#option).

### Terminology


On avoiding the terms of imperative languages; the footnote link points to Poberezkin's post "What I wish somebody told me when I was learning Haskell":

> It may seem insignificant, but using the correct terminology would help switching to the functional mindset:
>
> - functions are not "called" and "executed", they are "applied" and "evaluated".
> - functions do not "return" values, even when they use `return` function, they are a binding of function code to the function name.
> - preferring `pure` over `return` [5](https://www.poberezkin.com/posts/2021-04-21-what-i-wish-somebody-told-me-when-i-was-learning-Haskell.html#fn5) would both save you typing and help switching mindset.
> - "names" are not "variables", they are not "assigned", they are "bound" to values.

A related phrase, source not recorded: "It is tempting to say 'called', but the functions are not 'called' in functional languages - they are _evaluated_ and combined in bigger transformations, until the whole program is constructed."

This is useful as a nudge, not as dogma:

- The second point is muddled. What it seems to mean is that a function definition binds a name to an expression, and that `return` is an ordinary function (the same as `pure`) that wraps a value in a monad without ending anything.
- The last point clashes with the official terminology. The Haskell Report and GHC's error messages call bound names "variables", in the mathematical sense of a name that stands for a value, not a mutable cell.
- What matters is the idea behind the words: nothing is reassigned, and applying a function causes nothing to happen except producing its result.

### Tips, cheatsheets and style


- fp-course cheatsheet: <https://github.com/system-f/fp-course/blob/master/CHEATSHEET.md>
- Another cheatsheet (PDF): <http://cheatsheet.codeslower.com/CheatSheet.pdf>
- quchen, useful techniques: <https://github.com/quchen/articles/blob/master/useful_techniques.md>
- Haskell wiki, programming tips: <https://wiki.haskell.org/Haskell_programming_tips>
- HaskellTips on Twitter: <https://twitter.com/HaskellTips>
- Poberezkin, "What I wish somebody told me when I was learning Haskell": <https://www.poberezkin.com/posts/2021-04-21-what-i-wish-somebody-told-me-when-i-was-learning-Haskell.html>
- Kowainik style guide: <https://kowainik.github.io/posts/2019-02-06-style-guide>
- Haskell in production, fast iteration: <https://blog.sumtypeofway.com/posts/fast-iteration-with-haskell.html>

## Resources

### Books


- *Effective Haskell* by Rebecca Skinner: [Effective Haskell PDF](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc)
- *Book of Monads* by Alejandro Serrano Mena (the PDF is the 2nd edition): [Book of Monads PDF](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc)
- *Haskell in Depth* by Vitaly Bragilevsky (Manning): [Haskell in Depth PDF](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc)

The library also has *Haskell Programming from First Principles*, a full beginner's book, and the others under [Library sources](#library-sources).

### Tutorials and wikis


- Haskell Wikibook, useful: <https://en.wikibooks.org/wiki/Haskell>
- Typeclassopedia, useful: <https://wiki.haskell.org/Typeclassopedia>. By Brent Yorgey, it explains the standard type classes (`Functor`, `Applicative`, `Monad`, `Foldable`, `Traversable` and others) and their laws, and is best read after a first tutorial.
- School of Haskell, hosted by FP Complete: <https://www.schoolofhaskell.com/>
- *A Gentle Introduction to Haskell*: <https://www.haskell.org/tutorial/index.html>. Written for Haskell 98; the quotes around "gentle" are deserved, since it assumes experience with another functional language.
- *Yet Another Haskell Tutorial* (Wikibooks): <https://en.wikibooks.org/wiki/Yet_Another_Haskell_Tutorial/>
- Haskell wiki: <https://wiki.haskell.org> and <http://wiki.haskell.org/Haskell>
- Middlebury, Haskell guides: <https://www.cs.middlebury.edu/~pjohnson/guides/haskell>

Lists of other sources:

- Haskell wiki, Learning Haskell (links to resources): <https://wiki.haskell.org/Learning_Haskell>
- Haskell wiki, Tutorials: <https://wiki.haskell.org/Tutorials>
- Haskell wiki, Blog articles: <https://wiki.haskell.org/Blog_articles>
- bitemyapp/learnhaskell, specific topics: <https://github.com/bitemyapp/learnhaskell/blob/master/specific_topics.md>
- chemouna/HaskellResources, also various topics: <https://github.com/chemouna/HaskellResources>
- Class Central, best free Haskell courses: <https://www.classcentral.com/report/best-free-haskell-courses/>

### Courses


To start, CIS 194 (spring 2013) and the University of Helsinki MOOC are the most self-contained, with exercises.

- CIS 194 by Brent Yorgey: <https://www.seas.upenn.edu/~cis1940/spring13/>
- CS240H, Winter 2016, "Functional systems in Haskell" (Stanford): <http://www.scs.stanford.edu/16wi-cs240h/>
- *Learn Haskell by building a blog generator*, an HTTP hello-world style project, with a video: <https://learn-haskell.blog/>
- FP Complete, learn: <https://www.fpcomplete.com/haskell/learn/>
- FP Complete, syllabus: <https://www.fpcomplete.com/haskell/syllabus/>
- Erik Meijer, *Functional Programming Fundamentals* (Channel 9 lectures): <https://learn.microsoft.com/en-us/shows/c9-lectures-erik-meijer-functional-programming-fundamentals/>
- system-f/fp-course, exercises in which you implement the standard type classes and a parser yourself: <https://github.com/system-f/fp-course>
- University of Helsinki MOOC: <https://haskell.mooc.fi/>
- Functional programming at NSU (CS club, Novosibirsk, spring 2020): <https://compsciclub.ru/courses/func-prog/nsk/2020-spring/>
- *What I Wish I Knew When Learning Haskell* by Stephen Diehl: <https://github.com/sdiehl/wiwinwlh>. Not a course but a long reference on the language, extensions and ecosystem, useful for "what should I learn".
- Programming languages course, possibly with exercises: <https://ggbaker.ca/prog-langs/>
- FutureLearn, functional programming in Haskell: <https://www.futurelearn.com/courses/functional-programming-haskell>
- University of Calgary, CPSC 521 web notes: <https://pages.cpsc.ucalgary.ca/~robin/class/521/webnotes.html>
- University of Calgary, CPSC 449 web notes: <https://pages.cpsc.ucalgary.ca/~robin/class/449/webnotes.html>
- H. Conrad Cunningham, *Exploring Languages with Interpreters and Functional Programming* (ELIFP), with material on the reduction model: <https://john.cs.olemiss.edu/~hcc/csci450/ELIFP/>. Its evaluation-model chapter is quoted in [Substitution model and equational reasoning]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#substitution-model-and-equational-reasoning).
- Princeton COS 441 (2011): <https://www.cs.princeton.edu/~dpw/cos441-11/>
- Chalmers, Advanced Functional Programming (2015), lectures: <https://www.cse.chalmers.se/edu/year/2015/course/afp/lectures.html>

### Video


- Graham Hutton's channel, playlists: <https://www.youtube.com/@haskellhutt/playlists>
- *Haskell for Imperative Programmers*, a YouTube series by Philipp Hagenlocker (no link saved).
- awesome-haskell-videos: <https://github.com/andys8/awesome-haskell-videos>
- *The Haskell Unfolder*, a series by Well-Typed presented by Edsko de Vries and Andres Löh: <https://www.youtube.com/playlist?list=PLD8gywOEY4HaG5VSrKVnHxCptlJv2GAn7>
- Data61 fp-course, plus videos about games: <https://www.youtube.com/playlist?list=PLly9WMAVMrayYo2c-1E_rIRwBXG_FbLBW>

### Roadmaps


- soupi, Haskell study plan: <https://github.com/soupi/haskell-study-plan>
- Stack Overflow, "Getting started with Haskell": <https://stackoverflow.com/questions/1012573/getting-started-with-haskell>
- Reddit, "Complete roadmap from total novice to Haskell...": <https://www.reddit.com/r/haskell/comments/2ali12/complete_roadmap_from_total_novice_to_haskell/>
- Reddit comment, a checklist: <https://www.reddit.com/r/haskell/comments/el25ft/comment/fdfdh9q/>
- William Yao, "Road to proficient" (2020): <https://williamyaoh.com/posts/2020-01-11-road-to-proficient.html>

Several of these are old (the Stack Overflow question dates from about 2009), so their tooling advice, such as installing the Haskell Platform, is out of date: the Platform is deprecated and GHCup replaced it. The advice about what to learn and in what order ages much better.

### Blogs


- Haskell pages at crypto.stanford.edu (blynn): <https://crypto.stanford.edu/~blynn/haskell/>
- Planet Haskell, aggregates blogs: <http://planet.haskell.org/>
- Serokell blog, Haskell: <https://serokell.io/blog/haskell>
- Serokell blog, programming: <https://serokell.io/blog/programming>
- mmhaskell.com: <https://mmhaskell.com/>
- Matt Parsons, programming: <https://www.parsonsmatt.org/programming/>
- David Luposchainsky (quchen), articles: <https://github.com/quchen/articles/tree/master>
- tmorris, presentations: <https://presentations.tmorris.net/>
- defmacro.org: <https://www.defmacro.org/>
- Poberezkin, posts: <https://www.poberezkin.com/posts/>
- Alvin Alexander, Haskell: <https://alvinalexander.com/haskell/>
- Brian McKenna, YouTube channel: <https://www.youtube.com/@BrianMcKennaPuffnfresh>
- Freckle tech blog: <https://tech.freckle.com/>
- Well-Typed blog: <https://www.well-typed.com/blog/>
- zelenya on dev.to: <https://dev.to/zelenya>
- jelv.is blog: <https://jelv.is/blog/>

### Topic links


- Visualisation of `map` and folds: <https://stevekrouse.com/hs.js/>
- Stack Overflow questions which, judging by their titles, are about the function instance `( -> ) r` of `Applicative` and `Monad`, the reader monad in disguise, where `join f x = f x x` (see [Reader]({{< ref "functional-programming/02-abstractions/monads" >}}#reader)):
  - <https://stackoverflow.com/questions/38778320/r-applicative-functor>
  - <https://stackoverflow.com/questions/40131562/how-to-interpret-bind-of-the-function-instance/40136614#40136614>
  - <https://stackoverflow.com/questions/32323680/is-there-any-intuition-to-understand-join-two-functions-in-monad>
- Freckle, a Haskell refactoring step-through (2023): <https://tech.freckle.com/2023/10/31/haskell-refactoring-step-through/>
- Parsing and parsers, video: <https://www.youtube.com/watch?v=r_Enynu_TV0>
- Lambda lifting, Haskell wiki: <https://wiki.haskell.org/Lambda_lifting> (see [Lambda lifting](#lambda-lifting))
- The evolution of a Haskell programmer: <https://willamette.edu/~fruehr/haskell/evolution.html>

### Project lists


- Serokell, best Haskell open-source projects: <https://serokell.io/blog/best-haskell-open-source-projects>
- Wadler, real-world uses of functional languages: <https://homepages.inf.ed.ac.uk/wadler/realworld/>
- krispo/awesome-haskell: <https://github.com/krispo/awesome-haskell>
- uhub/awesome-haskell: <https://github.com/uhub/awesome-haskell>
- Haskell wiki, Haskell in industry: <https://wiki.haskell.org/Haskell_in_industry>
- Habr, Typeable: <https://habr.com/ru/companies/typeable/articles/595289/>
- Habr, topic not checked: <https://habr.com/ru/articles/496370/>

### Notable projects


- Unison, a programming language implemented in Haskell (BayHac 2017): <https://wiki.haskell.org/BayHac2017/Unison>
- Edward Kmett, cellular automata, part 1 (School of Haskell): <https://www.schoolofhaskell.com/user/edwardk/cellular-automata/part-1>
- simplexmq: <https://github.com/simplex-chat/simplexmq/tree/master>
- Libraries with their own entries above: `conduit`, `pipes`, `parsec`, `eff` and Edward Kmett's packages.

### Games


- Swarm, a game: <https://github.com/swarm-game/swarm/>
- Games in Haskell (blynn): <https://crypto.stanford.edu/~blynn/play/>
- A game in Haskell, video: <https://www.youtube.com/watch?v=1MNTerD8IuI>
- Sudoku solver (literate Haskell, Nottingham): <http://www.cs.nott.ac.uk/~pszgmh/sudoku.lhs>

See also:

- [Functional programming]({{< ref "functional-programming" >}}) for the section overview, [FP reading paths]({{< ref "functional-programming/05-practice/fp-reading-paths" >}}) for general FP reading, [Exercises and projects]({{< ref "functional-programming/05-practice/exercises-and-projects" >}}) for Haskell exercises and project ideas, and [FP study log]({{< ref "functional-programming/05-practice/study-log" >}}) for dated study notes on folds and laziness.
- [Structuring effectful programs]({{< ref "functional-programming/03-building-programs/structuring-effectful-programs" >}}) for transformers and mtl, and [Concurrency and parallelism]({{< ref "functional-programming/03-building-programs/concurrency" >}}).
- Category theory: [Category theory: Resources]({{< ref "functional-programming/02-abstractions/category-theory" >}}#resources) for links and [Purity and category theory]({{< ref "functional-programming/02-abstractions/category-theory" >}}#purity-and-category-theory) for Milewski's passage on purity.
- Evaluation: [Working through an evaluation by hand]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#working-through-an-evaluation-by-hand) for the `myDrop` model of function application, and [Costs of laziness: space leaks]({{< ref "functional-programming/01-foundations/evaluation-and-laziness" >}}#costs-of-laziness-space-leaks) for memory leaks.
- Functions: [Composition]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#composition) for `$` and composition, [Lambdas, closures and scope]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#lambdas-closures-and-scope), and [Returning functions and API design]({{< ref "functional-programming/01-foundations/functions-and-composition" >}}#returning-functions-and-api-design) for returning functions and argument order.
- Recursion: [Writing recursive functions]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#writing-recursive-functions) for pattern matching and recursion, [Folds]({{< ref "functional-programming/01-foundations/recursion-and-folds" >}}#folds) for folds and `Foldable`.
- Abstractions: [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}), [Type classes]({{< ref "functional-programming/02-abstractions/type-classes-and-polymorphism" >}}#type-classes), [monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}#monoid) (identity and folds), and [Why monads]({{< ref "functional-programming/02-abstractions/monads" >}}#why-monads), [Option]({{< ref "functional-programming/02-abstractions/monads" >}}#option) (`Maybe` and missing values), [Reader]({{< ref "functional-programming/02-abstractions/monads" >}}#reader) and [IO]({{< ref "functional-programming/02-abstractions/monads" >}}#io).
- Programming in types: [Type-first design]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}#type-first-design) and [Product and sum types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}).

## Library sources


- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: one of the books under Books; section 11.1, "Monadic Stacks", with table 11.1 of the transformers in `transformers`, section 11.2, "Classes of Monads, MTL-style", with table 11.2 of the mtl classes and `MonadIO`, and section 12.1, "MonadTrans and Lift", on `MonadTrans` and `lift`; on the effects item in *Learning path*.
- [Allen 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: an alternative backbone for the Learning path; chapter 24, sections 24.3, "Understanding the parsing process" (a parser as `String -> Maybe (a, String)`, "State plus failure"), 24.5, "Haskell's parsing ecosystem" (parsec, attoparsec, megaparsec, trifecta) and 24.6, "Alternative", on *Parser combinators*; sections 11.3 to 11.5 on type constructors against data constructors, on *Data constructors and type constructors*; section 26.6, "Types you probably don't want to use", on why Writer and WriterT leak, on the WriterT trap in *Learning path*.
- [Serrano Mena 2022](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc), *Haskell: Almost Standard Libraries*: section 1.2, "Alternative Preludes" (relude, classy-prelude, protolude; good for applications, not for libraries); on *Custom Prelude*. Chapter 2, Dependencies (Cabal against Stack, Hackage downloads, Stackage snapshots, and 2.3, "Advice on choosing a library"); on *Toolchain* and *The cost of choice*. Chapter 3, Utilities (`mapMaybe`, `guard`, `Data.Monoid`, `extra`, `split`, `safe`) and 3.1, "Better folds" (`Control.Foldl`); on *Modules in base*, *Utility packages* and *Folds: Control.Foldl*. Chapter 4, Containers, and 11.2 on strict containers; on *Containers*. Chapter 5, Text (`String` against `Text`, `OverloadedStrings`); on *Custom Prelude*. Section 9.2, "Parsers" (attoparsec for speed, megaparsec for errors, both from parsec); on *Parser combinators*. Section 22.3 on effect systems; on *Effect libraries*. Chapter 15 on conduit, pipes, streamly and streaming; on *Streaming and abstraction libraries*.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: the main book in Learning path; a practical route from basics through projects and modules (chapter 5), type classes, IO and monad transformers (chapter 13) to type-level programming (chapter 15); chapter 3, section "Getting Help from Type Holes", backs Typed holes; chapter 3, sections "Working with Polymorphic Functions" (what a type variable already says about `id` and `apply`) and "Exploring the Type Space of an Application with Undefined" (writing signatures with `undefined` bodies before implementing); on *Types first*.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: one of the books under Books; section 4.1 covers modules and custom preludes, for Custom Prelude; section 6.4 covers the transformers and mtl libraries, for the effects item in Learning path; section 1.2 moves a program from `String` to `Text`; section 11.4.2, "Example: Representing arithmetic expressions with GADTs", rewrites a data type in `GADTSyntax` and then gives constructors specific result types (`BoolLit :: Bool -> Expr Bool`), on *Data constructors and type constructors*; section 11.6.2, "Ask the compiler", on typed holes, named holes and `PartialTypeSignatures`, on *Typed holes*; the opening of 5.1 on Writer's space leaks, on *Learning path*.
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types*: section 2.1.2, "Arrow Kinds", on `Maybe` as a type constructor of kind `Type -> Type`, and section 5.2, "GADTs", whose `LitInt :: Int -> Expr Int` is a constructor with a more specific result type; on *Data constructors and type constructors*.
- Bird 1998, *Introduction to Functional Programming using Haskell (2nd edition)*: chapter 11, "Parsing", builds a monadic parser library from scratch, refining `String -> Tree` to `newtype Parser a = MkP (String -> [(a, String)])`, then adds alternation (11.2), repetition and white-space (11.3), and fixes left recursion and laziness (11.4), on *Parser combinators*; section 7.1, "Lazy evaluation", shows a top-level `numbers = [1 .. 1000]` evaluated once and kept, so a script's memory grows with use, on the CAF paragraph under *Variables and definitions*; section 1.4.5, "Precedence" (function application binds tighter than any operator), and section 1.5.2, "Local definitions" (a where clause covers all the guarded equations of a definition), on *Learn the language precisely* and *let and where*.
- [Hutton 1999](/sources/programming/functional-programming/hutton-1999-universality-and-expressiveness-of-fold.pdf.enc), *A tutorial on the universality and expressiveness of fold*: section 4, "Increasing the power of fold: generating tuples", shows that any two folds over the same list combine into one fold that returns a pair (the "banana split" law), as `sumlength` computes a sum and a length in one pass, the idea behind combining folds applicatively; on *Folds: Control.Foldl*.

Further reading:

- [Bird 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*
- [Marlow 2013](/sources/programming/functional-programming/marlow-2013-parallel-and-concurrent-programming-in-haskell.pdf.enc), *Parallel and Concurrent Programming in Haskell*
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture*: section 13.1.1, "Errors vs. exceptions", lists the overlapping Haskell error mechanisms (synchronous and asynchronous exceptions, `ExceptT`, `MaybeT`, `MonadThrow` and friends); section 13.2, "Functional interfaces and dependency inversion", compares service handle, `ReaderT`, free monads, GADTs and final tagless/mtl (table 13.1); on *The cost of choice* and the effects item in *Learning path*.
- Hudak 2004, *The Haskell School of Expression, chapter 3 slides*: the slide "The do Syntax" introduces `return` as an ordinary function that turns a value into an IO action that does nothing but return it; on the `return` point under *Terminology*.
