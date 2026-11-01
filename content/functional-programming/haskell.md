---
draft: false
toc: true
title: "Haskell"
linkTitle: "Haskell"
---

The Haskell language itself: a study path, learning resources, the ecosystem and libraries, small language notes, advice from experienced users, and collected phrasing; concept material lives in the concept notes listed at the end.

Callouts titled **Explanation** and **Critique** are commentary added on 2026-11-05 to the fragment directly above them. Everything outside them is the original note text.

## Learning path


getting fluent with Monad [transformers](http://hackage.haskell.org/package/transformers) and [mtl](https://hackage.haskell.org/package/mtl) libraries

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`transformers` defines the concrete monad transformers (`ReaderT`, `StateT`, `WriterT`, `ExceptT`, `MaybeT`) and `lift`, which moves an action from the inner monad up one layer. `mtl` builds on it with type classes such as `MonadReader`, `MonadState` and `MonadError`, so `get` or `ask` works at any depth of a stack without manual lifting, and functions can be written against a capability instead of a concrete stack: `tick :: MonadState Int m => m ()`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Worth learning, but it is no longer the only mainstream way to structure effects. Many applications use a single `ReaderT Env IO` (the pattern `rio` is built around, see Ecosystem), and effect libraries such as `effectful` or `polysemy` are common alternatives (see [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#effect-systems)). One practical trap: the ordinary `WriterT` leaks space; `StateT` or the CPS writer in `Control.Monad.Trans.Writer.CPS` avoids it.
{{< /callout >}}



start "Learn Haskell by building" serie. It'll be a series of cumulative assignments that gradually introduce the language, tooling, and idioms.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The "http hello-world project" under Courses, <https://learn-haskell.blog/>, is the free book *Learn Haskell by building a blog generator*, which grows one project step by step and introduces tooling along the way. If the series meant here is your own, that book is a good model for its structure.
{{< /callout >}}


FP complete toolset

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
FP Complete is the company behind Stack (the build tool), Stackage (curated package sets that are known to build together), the `rio` standard library and School of Haskell.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The tooling landscape has shifted. GHCup is the installer haskell.org recommends; it installs GHC, cabal-install, Stack and the language server (HLS) side by side. Stack is still widely used, but cabal-install is at least as common for new projects. Some fpcomplete.com links in this note may have moved; they need checking.
{{< /callout >}}


don't use predule and make your own type classes [Haskell]({{< ref "functional-programming/haskell" >}}#custom-prelude)

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Two different pieces of advice are mixed here. Replacing the Prelude (see Custom Prelude below) is about importing safer, more complete defaults, such as `Text` instead of `String` and total instead of partial functions. Defining your own type classes is rarely a good idea when learning: write your own `Functor` or `Monad` as an exercise (that is the point of the fp-course under Courses), but use the standard ones in real code so that libraries interoperate. Most learners are better off with the standard Prelude until its limits actually bother them.
{{< /callout >}}


effective haskell book ([PDF](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc))

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
*Effective Haskell* by Rebecca Skinner (Pragmatic Bookshelf, 2023), also listed under Resources.
{{< /callout >}}


yet another haskell tutorial by

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The sentence is unfinished. *Yet Another Haskell Tutorial* (YAHT) is by Hal Daumé III; the Wikibooks link under Resources is an edited version of it. It predates much of today's tooling and libraries.
{{< /callout >}}


tasks from GPiN

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The abbreviation is unclear and needs checking. It may mean Graham Hutton's *Programming in Haskell*, whose chapters end with exercises, or *Get Programming with Haskell* by Will Kurt, which other notes in the vault abbreviate as GPWH.
{{< /callout >}}


projects!!!

- time management

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Reads as a project idea: a time-management tool (tasks, time tracking, a calendar) is a good first real project because it needs persistence, parsing, dates and a user interface. Other ideas are collected in [Exercises And Projects]({{< ref "functional-programming/exercises-and-projects" >}}#project-ideas).
{{< /callout >}}

## Resources

### Books


pdf books

effective haskell, book of monads, haskell in depth ([Effective Haskell PDF](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), [Book of Monads PDF](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), [Haskell in Depth PDF](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc))

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
*Effective Haskell* is by Rebecca Skinner, *Book of Monads* by Alejandro Serrano Mena (the PDF link is to its 2nd edition) and *Haskell in Depth* by Vitaly Bragilevsky (Manning). The library also has *Haskell Programming from First Principles*, a full beginner's book (see Library sources).
{{< /callout >}}

### Tutorials and wikis


**tutorials etc.**

<https://en.wikibooks.org/wiki/Haskell> useful

<https://wiki.haskell.org/Typeclassopedia> useful

<https://www.schoolofhaskell.com/> hosted by FP Complete

<https://www.haskell.org/tutorial/index.html> "gentle" tutorial

<https://en.wikibooks.org/wiki/Yet_Another_Haskell_Tutorial/>

<https://wiki.haskell.org> wiki

<http://wiki.haskell.org/Haskell>

links to other sources:

<https://wiki.haskell.org/Learning_Haskell> links to resources

<https://wiki.haskell.org/Tutorials> links to tutorials

<https://wiki.haskell.org/Blog_articles> links to blog articles

<https://www.cs.middlebury.edu/~pjohnson/guides/haskell>

<https://github.com/bitemyapp/learnhaskell/blob/master/specific_topics.md> various topics

<https://github.com/chemouna/HaskellResources> also var topics

<https://www.classcentral.com/report/best-free-haskell-courses/>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The "gentle" tutorial is *A Gentle Introduction to Haskell*, written for Haskell 98; the quotes are deserved, since it assumes experience with another functional language. The Typeclassopedia, by Brent Yorgey, explains the standard type classes (`Functor`, `Applicative`, `Monad`, `Foldable`, `Traversable` and others) and their laws, and is best read after a first tutorial.
{{< /callout >}}

### Video


**youtube**

<https://www.youtube.com/@haskellhutt/playlists>

haskell for imperative programmers course

videos <https://github.com/andys8/awesome-haskell-videos>

The Haskell Unfolder Serie <https://www.youtube.com/playlist?list=PLD8gywOEY4HaG5VSrKVnHxCptlJv2GAn7>

Data61 fp-course + videos about games <https://www.youtube.com/playlist?list=PLly9WMAVMrayYo2c-1E_rIRwBXG_FbLBW>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
*Haskell for Imperative Programmers* is a YouTube series by Philipp Hagenlocker. *The Haskell Unfolder* is a video series by Well-Typed, presented by Edsko de Vries and Andres Löh. The Data61 fp-course is the exercise course linked under Courses (`system-f/fp-course`).
{{< /callout >}}

### Roadmaps


**roadmap**

<https://github.com/soupi/haskell-study-plan>

<https://stackoverflow.com/questions/1012573/getting-started-with-haskell>

<https://www.reddit.com/r/haskell/comments/2ali12/complete_roadmap_from_total_novice_to_haskell/>

<https://www.reddit.com/r/haskell/comments/el25ft/comment/fdfdh9q/> checklist

<https://williamyaoh.com/posts/2020-01-11-road-to-proficient.html>

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Several of these are old (the Stack Overflow question dates from about 2009), so their tooling advice, such as installing the Haskell Platform, is out of date: the Platform is deprecated and GHCup replaced it. The advice about what to learn and in what order ages much better.
{{< /callout >}}

### Courses


**courses**

CIS 194 by Brent Yorgey

<https://www.seas.upenn.edu/~cis1940/spring13/>

CS240H Winter 2016 "Functional systems in Haskell"

<http://www.scs.stanford.edu/16wi-cs240h/>

http hello-world project <https://learn-haskell.blog/> + video

FP complete courses

<https://www.fpcomplete.com/haskell/learn/>

<https://www.fpcomplete.com/haskell/syllabus/>

FP Fundamentals

<https://learn.microsoft.com/en-us/shows/c9-lectures-erik-meijer-functional-programming-fundamentals/>

<https://github.com/system-f/fp-course>

<https://haskell.mooc.fi/>

fp in nsu

<https://compsciclub.ru/courses/func-prog/nsk/2020-spring/>

some course "what I should learn"

<https://github.com/sdiehl/wiwinwlh>

exercises? <https://ggbaker.ca/prog-langs/>

<https://www.futurelearn.com/courses/functional-programming-haskell>

<https://pages.cpsc.ucalgary.ca/~robin/class/521/webnotes.html>

<https://pages.cpsc.ucalgary.ca/~robin/class/449/webnotes.html>

something about reduction model

<https://john.cs.olemiss.edu/~hcc/csci450/ELIFP/>

<https://www.cs.princeton.edu/~dpw/cos441-11/>

<https://www.cse.chalmers.se/edu/year/2015/course/afp/lectures.html>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
To start, CIS 194 (spring 2013) and the University of Helsinki MOOC (haskell.mooc.fi) are the most self-contained, with exercises. `system-f/fp-course` is a set of exercises in which you implement the standard type classes and a parser yourself. `wiwinwlh` is not a course: it is Stephen Diehl's *What I Wish I Knew When Learning Haskell*, a long reference on the language, extensions and ecosystem. The ELIFP link ("reduction model") is H. Conrad Cunningham's textbook *Exploring Languages with Interpreters and Functional Programming*; its evaluation-model chapter is quoted in [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#substitution-model-and-equational-reasoning).
{{< /callout >}}

### Blogs


**blogs**

<https://crypto.stanford.edu/~blynn/haskell/>

<http://planet.haskell.org/> aggregates blogs

<https://serokell.io/blog/haskell>

<https://serokell.io/blog/programming>

<https://mmhaskell.com/>

<https://www.parsonsmatt.org/programming/>

<https://github.com/quchen/articles/tree/master> David Luposchainsky

<https://presentations.tmorris.net/>

<https://www.defmacro.org/>

<https://www.poberezkin.com/posts/>

<https://alvinalexander.com/haskell/>

<https://www.youtube.com/@BrianMcKennaPuffnfresh>

<https://tech.freckle.com/>

<https://www.well-typed.com/blog/>

<https://dev.to/zelenya>

<https://jelv.is/blog/>

### Topic links


**var**

map, fold visualization

<https://stevekrouse.com/hs.js/>

<https://stackoverflow.com/questions/38778320/r-applicative-functor>

<https://stackoverflow.com/questions/40131562/how-to-interpret-bind-of-the-function-instance/40136614#40136614>

<https://stackoverflow.com/questions/32323680/is-there-any-intuition-to-understand-join-two-functions-in-monad>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Judging by their titles, the three Stack Overflow questions are all about the function instance, `( -> ) r`, of `Applicative` and `Monad`: the reader monad in disguise, where `join f x = f x x`. See [Monads]({{< ref "functional-programming/monads" >}}#reader).
{{< /callout >}}


<https://tech.freckle.com/2023/10/31/haskell-refactoring-step-through/>

parsing, parsers etc

<https://www.youtube.com/watch?v=r_Enynu_TV0>

Lambda lifting

<https://wiki.haskell.org/Lambda_lifting>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Lambda lifting turns a local function that uses variables from its surrounding scope into a top-level function that takes those variables as extra parameters, so no closure has to be allocated:

```haskell
f x = map g [1, 2, 3] where g y = x + y
-- lambda-lifted:
g' x y = x + y
f x = map (g' x) [1, 2, 3]
```

It is the alternative to closure conversion, which keeps the function local and packs its free variables into a heap object. GHC applies lambda lifting selectively as an optimisation late in compilation.
{{< /callout >}}


evolution of a programmer <https://willamette.edu/~fruehr/haskell/evolution.html>

## Ecosystem

### Standard library alternatives


FP Complete created "commercial haskell library"

<https://www.fpcomplete.com/haskell/library/rio/>

<https://github.com/commercialhaskell/rio>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The library is `rio`, described as a standard library for Haskell. It is a Prelude replacement that re-exports `Text`, `ByteString`, containers and safe exception handling, and is built around the `RIO env a` monad (a `ReaderT env IO` for application environments). It is one answer to the problem described under Economics below, and one option for Custom Prelude.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Commercial Haskell" is the name of the GitHub organisation (`commercialhaskell`, which also hosts Stack), not of the library.
{{< /callout >}}

### Project lists


projects

<https://serokell.io/blog/best-haskell-open-source-projects>

<https://homepages.inf.ed.ac.uk/wadler/realworld/>

<https://github.com/krispo/awesome-haskell>

<https://github.com/uhub/awesome-haskell>

<https://wiki.haskell.org/Haskell_in_industry>

<https://habr.com/ru/companies/typeable/articles/595289/>

<https://habr.com/ru/articles/496370/>

### Notable projects


**projects**:

<https://wiki.haskell.org/BayHac2017/Unison>

<https://github.com/ekmett>

<https://github.com/snoyberg/conduit>

<https://github.com/Gabriella439/pipes>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Unison is a programming language implemented in Haskell. `ekmett` is Edward Kmett, author of `lens` and many of the abstraction libraries (`comonad`, `free`, `profunctors` and others). `conduit` and `pipes` are the two classic streaming libraries, for processing data in constant memory with interleaved effects; `streaming` and `streamly` are later alternatives.
{{< /callout >}}


Monadic parser combinators

<https://hackage.haskell.org/package/parsec>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A parser combinator library represents a parser as a value, roughly `String -> Maybe (a, String)`, and builds big parsers from small ones with `Functor`, `Applicative`, `Monad` and `Alternative`. The phrase is also the title of a well-known 1996 report by Graham Hutton and Erik Meijer that builds such a library from scratch.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`parsec` is the classic, but new code more often uses `megaparsec`, which has better error messages and is actively developed, or `attoparsec` for fast parsing of `ByteString` and `Text` where error quality matters less.
{{< /callout >}}


some effect library

<https://github.com/hasura/eff>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`eff` is Alexis King's effect library, designed around delimited continuations that she added to GHC as primitive operations. It aims to make algebraic effects fast.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
As far as I know `eff` stayed experimental; this needs checking. The effect libraries in wider use are `effectful`, `polysemy`, `fused-effects` and `bluefin`. See [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#effect-systems).
{{< /callout >}}


<https://www.schoolofhaskell.com/user/edwardk/cellular-automata/part-1>

<https://github.com/simplex-chat/simplexmq/tree/master>

### Games


swarm game

<https://github.com/swarm-game/swarm/>

games in haskell

<https://crypto.stanford.edu/~blynn/play/>

game in haskell <https://www.youtube.com/watch?v=1MNTerD8IuI>

sudoku solver

<http://www.cs.nott.ac.uk/~pszgmh/sudoku.lhs>

## Libraries


Data.Functor, Control.Applicative, Data.Foldable, Data.Traversable, Data.Monoid are all useful for manipulating the "weirder" values and I wish I paid attention to them earlier. (Of course, Control.Monad is useful too, but I found that early enough.)

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The functions these modules provide, and which beginners tend to reimplement:
- `Data.Functor`: `<$>`, `<&>` (flipped `<$>`), `<$`, `$>` and `void`.
- `Control.Applicative`: `<*>`, `liftA2`, `*>`, `<*`, and `Alternative` with `<|>`, `many`, `some` and `optional`.
- `Data.Foldable`: `traverse_`, `for_`, `foldl'`, `foldMap`, and `toList`, `null`, `length`, `elem` for any container.
- `Data.Traversable`: `traverse`, `for`, `sequenceA`, `mapAccumL`.
- `Data.Monoid`: the newtype wrappers listed below.
{{< /callout >}}


`base` ... container data types

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`base` is the library that ships with GHC and contains the Prelude, lists, `Maybe`, `Either`, `Data.List.NonEmpty`, IO, `IORef`, concurrency primitives and the standard type classes.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
If the jot means `base` contains the container types, it doesn't: `Data.Map`, `Data.Set`, `Data.IntMap` and `Data.Sequence` are in `containers`, arrays are in `array` or `vector`, and `Text` and `ByteString` have their own packages. All of these come with a GHC installation, but you still have to list them as dependencies.
{{< /callout >}}


`containers`, `unordered-containers`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`containers` has ordered maps and sets (`Map`, `Set`, needing `Ord` keys), `IntMap`, `Seq` (a finger tree with fast access at both ends) and `Tree`. `unordered-containers` has hash-based `HashMap` and `HashSet`, needing `Hashable` keys, usually faster for lookups on large maps with string-like keys. Import them qualified, `import qualified Data.Map.Strict as Map`, and prefer the `.Strict` modules unless you need lazy values.
{{< /callout >}}


Data.List, Data.Maybe also contain a wide range of small utility functions.... `mapMaybe`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`mapMaybe :: (a -> Maybe b) -> [a] -> [b]` maps and drops the `Nothing`s in one pass: `mapMaybe readMaybe ["1", "x", "3"] :: [Int]` is `[1, 3]`. Others worth knowing: `catMaybes`, `fromMaybe`, `maybe` and `listToMaybe` in `Data.Maybe`; `sortOn`, `groupBy`, `partition`, `foldl'`, `isPrefixOf`, `intercalate` and `nub` in `Data.List`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`nub` is quadratic. For large lists use `Set.toList . Set.fromList`, or `nubOrd` from `containers` (`Data.Containers.ListUtils`) to keep the original order.
{{< /callout >}}


Data.Monoid `newTypeS`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Presumably "newtypes": `Data.Monoid` defines wrappers that pick which monoid a type uses, since a type can have only one instance of a class. Numbers can be combined by addition or multiplication, so there are `Sum` and `Product`; booleans by `&&` or `||`, so `All` and `Any`; plus `First`, `Last`, `Endo` (composition of `a -> a` functions) and `Dual` (flipped order). Example: `getSum (foldMap Sum [1, 2, 3])` is `6`. See [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`First` and `Last` exist twice with different meanings: in `Data.Monoid` they wrap `Maybe a` and skip `Nothing`s, while in `Data.Semigroup` they wrap plain values. Importing both modules unqualified leads to confusing type errors.
{{< /callout >}}


Control.Monad .. `guard`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`guard :: Alternative f => Bool -> f ()` fails the computation when the condition is false: `Nothing` in `Maybe`, the empty list in lists. In the list monad it works like a filter in a list comprehension:

```haskell
pythagorean n = do
a <- [1 .. n]; b <- [a .. n]; c <- [b .. n]
guard (a * a + b * b == c * c)
pure (a, b, c)
```
{{< /callout >}}


`extra` library. For each module, like `Data.List`, the library defines a `Data.List.Extra` with more

functions.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`extra` is Neil Mitchell's collection of small utilities that "should have been in `base`": for example `Data.List.Extra` has `splitOn`, `trim` and `nubOrd`, and `Control.Monad.Extra` has `whenM`, `unlessM` and `concatMapM`.
{{< /callout >}}


`split` library

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`split` provides list splitting, which `base` lacks: `splitOn "," "a,b,,c"` is `["a", "b", "", "c"]`, plus `chunksOf`, `splitWhen` and more configurable splitters.
{{< /callout >}}


`safe` library

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`safe` provides total versions of the Prelude's partial functions: `headMay :: [a] -> Maybe a`, `tailMay`, `readMay`, `atMay` instead of `!!`, `maximumMay`, plus `headDef`-style versions that take a default.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Part of this is now covered by `base` itself: `Text.Read.readMaybe` replaces `readMay`, and `Data.List.NonEmpty` lets you avoid needing `head` at all. Recent GHC versions (9.8 and later) also warn when you use `head` and `tail`.
{{< /callout >}}


better folds: `Control.Foldl`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`Control.Foldl` is from Gabriella Gonzalez's `foldl` package. A fold is a value with an `Applicative` instance, so several folds can be combined and run in one pass over the data with no space leak: `L.fold ((/) <$> L.sum <*> L.genericLength) xs` computes a mean while traversing `xs` once. The study log has the background posts ([Study Log]({{< ref "functional-programming/study-log" >}})).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
"Better" means composable, not a replacement for `foldr` or `foldl'`. It pays off when you need several statistics of one stream, or folds you can reuse over lists, vectors and streaming libraries alike.
{{< /callout >}}


Control.Monad, Control.Applicative, etc.

`category-extras`

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`category-extras` is long deprecated. Edward Kmett split it into separate packages such as `comonad`, `free`, `semigroupoids`, `kan-extensions`, `adjunctions` and `recursion-schemes`; use those instead.
{{< /callout >}}

## Language notes

### Variables and definitions


Variable definition

In Haskell, a variable provides a way to give a name to an expression. Once a variable is _bound to_ (i.e. associated with) a particular expression, its value does not change: we can always use the name of the variable instead of writing out the expression, and get the same result either way. #dict

When a function doesn't take any parameters, we usually say it's a _definition_ (or a _name_).

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Strictly, something that takes no parameters is not a function at all: `x = 5` or `primes = sieve [2 ..]` binds a name to a value, whose type has no ` -> `. A top-level binding like `primes` is called a constant applicative form (CAF); it is evaluated at most once and its value is shared by every use, which matters for memory (see [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#thunks-sharing-and-pattern-matching)).
{{< /callout >}}

### Exploring in GHCi

```haskell
ghci> :t head
head :: [a] -> a
ghci> :t (==)
(==) :: Eq a => a -> a -> Bool
ghci> read "[1,2,3,4]" ++ [3]
[1,2,3,4,3]
read "5" :: Float
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`:t` shows a type. `Eq a =>` is a constraint: `==` works for any type `a` that has an `Eq` instance. `read :: Read a => String -> a` parses a string into whatever type the context demands: in the third example `++ [3]` fixes the result as a list of numbers, while in the last one there is no context, so the annotation `:: Float` is needed.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`head` and `read` are partial: `head []` and `read "x" :: Int` crash at run time. Use pattern matching or `Data.List.NonEmpty` instead of `head`, and `readMaybe` from `Text.Read` instead of `read`.
{{< /callout >}}

### Functions and lists


??

Lists

[ x | x <- [50..100], x `mod` 7 == 3]

boomBangs xs = [ if x < 10 then "BOOM!" else "BANG!" | x <- xs, odd x]

boomBangs [7..13]

length' xs = sum [1 | _ <- xs]

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
List comprehensions, from *Learn You a Haskell*. The first gives `[52, 59, 66, 73, 80, 87, 94]`, the numbers from 50 to 100 that leave remainder 3 when divided by 7. `boomBangs [7..13]` keeps the odd numbers 7, 9, 11 and 13 and gives `["BOOM!", "BOOM!", "BANG!", "BANG!"]`. `length'` replaces every element with `1` (the `_` ignores the element) and sums the ones. A comprehension is sugar: `[f x | x <- xs, p x]` is `map f (filter p xs)`.
{{< /callout >}}


Haskell has an alternative to `where` clauses called `let` expressions.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Both bind local names, but they differ in shape and scope:

```haskell
cylinder r h = sideArea + 2 * topArea
where sideArea = 2 * pi * r * h
topArea  = pi * r ^ 2

cylinder' r h =
let sideArea = 2 * pi * r * h
topArea  = pi * r ^ 2
in  sideArea + 2 * topArea
```
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
They are not interchangeable. `let ... in ...` is an expression and can appear anywhere an expression can, for example inside a lambda or one branch of an `if`. `where` belongs to a whole equation and scopes over all its guards, which `let` cannot do. The choice between them is otherwise a matter of style: `where` puts the main expression first and details after.
{{< /callout >}}

### Data constructors and type constructors


Value constructors are functions, so we can map them and partially apply them and everything. If we want a list of concentric circles with different radii, we can do this.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The code was not copied. With `data Shape = Circle Float Float Float`, `Circle` has type `Float -> Float -> Float -> Shape`, so `map (Circle 10 20) [4, 5, 6]` gives three circles with centre (10, 20) and different radii.
{{< /callout >}}


Type parameters

A value constructor can take some values parameters and then produce a new value. For instance, the Car constructor takes three values and produces a car value. In a similar manner, type constructors can take types as parameters to produce new types.

```haskell
{-# LANGUAGE GADTSyntax #-}
data Maybe a where
    Nothing :: Maybe a
    Just :: a -> Maybe a
```

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
`GADTSyntax` lets you declare a data type by giving each constructor's full type signature. It defines exactly the usual `data Maybe a = Nothing | Just a`, but makes the point of the paragraph visible: `Just` is a function from `a` to `Maybe a`, and `Maybe` is a function from a type `a` to a type `Maybe a`, with kind `Type -> Type`. With the full `GADTs` extension, constructors may also return a more specific type, such as `IntLit :: Int -> Expr Int`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
In a normal module this clashes with the Prelude's `Maybe`: uses of `Maybe`, `Just` and `Nothing` become ambiguous, so add `import Prelude hiding (Maybe (..))` or choose a different name.
{{< /callout >}}

## Advice

### Tips and cheatsheets


interesting cheatsheet

<https://github.com/system-f/fp-course/blob/master/CHEATSHEET.md>

another cheatsheet <http://cheatsheet.codeslower.com/CheatSheet.pdf>

<https://github.com/quchen/articles/blob/master/useful_techniques.md>

<https://wiki.haskell.org/Haskell_programming_tips>

<https://twitter.com/HaskellTips>

<https://www.poberezkin.com/posts/2021-04-21-what-i-wish-somebody-told-me-when-i-was-learning-Haskell.html>

style guide <https://kowainik.github.io/posts/2019-02-06-style-guide>

haskell in production, iterations

<https://blog.sumtypeofway.com/posts/fast-iteration-with-haskell.html>

### Types first


Read types first, not code.

You need start seeing the types as _the primary part_ of your code that _drives_ your implementation, rather than restricts it.

Read it slowly.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In Haskell a type signature often tells you most of what a function can do. `a -> a` can only be the identity (or fail or loop forever), and `(a -> b) -> [a] -> [b]` can only rearrange, drop or duplicate results of applying the function, because it knows nothing else about `a` and `b`. Reading the signature first narrows down the implementation before you read a line of it. Code is also dense, so reading slowly is normal, not a sign of being lost.
{{< /callout >}}


In Haskell, you should use the powerful type system to help you as much as

you can.

Types are the model of your program

Follow the types.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
These are the "type-driven development" slogans: first model the domain as types so that invalid states can't be represented, then write functions whose types make the remaining choices obvious, and let compiler errors guide you to the implementation. See [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#type-first-design).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Types constrain shape, not meaning: `sum` and `product` have the same type, and so do `sort` and `reverse` on a list of `Int`s. Following the types gets you to *a* program that compiles; tests or properties are still needed to get the right one.
{{< /callout >}}


Use type holes recursively for arguments and output parameters

`product ns = foldr _f _n` -> `product = foldr (\a b -> _c) _n`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A name starting with `_` in an expression is a typed hole. GHC refuses to compile but reports the type each hole needs and the variables in scope that fit. With `product :: Num a => [a] -> a` and `product = foldr _f _n`, it reports `_n :: a` and `_f :: a -> a -> a`. Replacing `_f` by a lambda with a new hole `_c` asks the same question one level down, with `a` and `b` now in scope. Filling them in gives `product = foldr (\a b -> a * b) 1`, which is `foldr (*) 1`.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The first version doesn't type-check as written: `foldr _f _n` is still a function waiting for the list, so it needs `ns` at the end (`product ns = foldr _f _n ns`) or no `ns` on the left, as in the second version.
{{< /callout >}}


Use `:type`, `:info`

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
In GHCi, `:type` (`:t`) shows an expression's type, `:info` (`:i`) shows where a name is defined, a class's methods and instances, or a type's constructors, and `:kind` (`:k`) shows a type's kind. `:browse Data.Maybe` lists everything a module exports. Examples are under Exploring in GHCi above.
{{< /callout >}}

### Learn the language precisely


I wish I had read the Haskell Report earlier. I haven't read the whole thing, but the first 6 chapters we really good to know.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The current standard is the Haskell 2010 Report. Its first chapters cover lexical structure, expressions (including how `do`, list comprehensions, `if` and sections are translated into simpler core forms), declarations and bindings, modules, and the predefined types and classes. GHC implements many extensions beyond it, but the core is still exactly this.
{{< /callout >}}


Understanding how to parse Haskell expressions. I went for a long time without really understanding the details.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The rules that matter most: function application binds tighter than any operator, so `f x + g y` is `(f x) + (g y)` and `f x:xs` is `(f x) : xs`; operators have fixity declarations (`infixr 5 :`, `infixl 6 +`, `infixr 0 $`), which `:info` shows; `$` is just a low-precedence application operator; and sections like `(subtract 1)` exist because `(- 1)` is negative one, not a function. `f -1` parses as `f - 1`, so write `f (-1)`.
{{< /callout >}}


What unification is. How it is similar to pattern matching.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Unification is how type inference solves equations between types. To type `map length`, GHC has to make `a -> b` (the argument type of `map`) equal to `[c] -> Int` (the type of `length`, simplified), and finds `a = [c]` and `b = Int`. Pattern matching is the one-sided version: only the pattern has variables, and the value is fixed. In unification both sides may contain variables, and solving can fail, for example `a ~ [a]` produces the "occurs check" error.
{{< /callout >}}


How instance selection works for type classes.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
To solve a constraint like `Show [Int]`, GHC looks for an instance whose head matches (`instance Show a => Show [a]`), looking only at the head and not at the context before the `=>`. Once it commits to that instance, it then has to solve the context, here `Show Int`. It never backtracks. This is why two instances with the same head are rejected even if their contexts differ, and why overlapping instances need explicit pragmas. See [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#type-classes).
{{< /callout >}}


Knowing all the things you can do with Maybe.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Beyond pattern matching: `maybe` and `fromMaybe` for defaults; `fmap` to transform the value inside; `>>=` or `do` to chain steps that can fail; `<|>` to take the first `Just`; `traverse` to turn `[a]` and `a -> Maybe b` into `Maybe [b]` (all succeed or nothing); and `catMaybes` and `mapMaybe` for lists. See [Monads]({{< ref "functional-programming/monads" >}}#option).
{{< /callout >}}


use recommendations from Complete IO about

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The sentence is unfinished. If it refers to FP Complete's guidance on IO, that is probably the "ReaderT design pattern" and their advice on exceptions in IO, which `rio` (see Ecosystem) packages together; this needs checking.
{{< /callout >}}

### Terminology


Avoid terms used in imperative languages

It may seem insignificant, but using the correct terminology would help switching to the functional mindset:

- functions are not "called" and "executed", they are "applied" and "evaluated".
- functions do not "return" values, even when they use `return` function, they are a binding of function code to the function name.
- preferring `pure` over `return` [5](https://www.poberezkin.com/posts/2021-04-21-what-i-wish-somebody-told-me-when-i-was-learning-Haskell.html#fn5) would both save you typing and help switching mindset.
- "names" are not "variables", they are not "assigned", they are "bound" to values.

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
Useful as a nudge, but not as dogma. The second point is muddled: what it seems to mean is that a function definition binds a name to an expression, and `return` is an ordinary function (the same as `pure`) that wraps a value in a monad without ending anything. The last point clashes with the official terminology: the Haskell Report and GHC's error messages call bound names "variables", in the mathematical sense of a name that stands for a value, not a mutable cell. What matters is the idea behind the words: nothing is reassigned, and applying a function causes nothing to happen except producing its result.
{{< /callout >}}

## Economics


On the other end of this spectrum, we have the libraries that ship with GHC, especially `base`. There is a strong sentiment for maintaining backwards compatibility and retaining workflows developed over the decades of the Haskell language. This includes some great stuff, but also some things many would consider design mistakes (such as partial functions).

We're left with a world where there are arguably too many degrees of freedom when starting a new Haskell project, and too many points of failures by relying on dangerous code. Teams can easily spend significant time making basic architectural and library decisions on a new project. And for those relatively new to the Haskell ecosystem, it's all too easy to make choices with unknown costs, with those costs only showing themselves later.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The passages read like the motivation for `rio` (see Ecosystem), though the source wasn't recorded. Partial functions are ones that crash on some inputs, such as `head`, `tail`, `fromJust`, `read` and `!!`. The "degrees of freedom" are decisions every new project faces: `String` or `Text`, which Prelude, which effect style (mtl, `ReaderT` over IO, an effect library), which streaming and logging libraries, Stack or cabal.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`base` does change slowly, but not never: `Semigroup` became a superclass of `Monoid`, and recent GHC versions warn about `head` and `tail`. The cost of choice has also eased, since a few conventions (`Text`, the `containers` family, the ReaderT-over-IO pattern) are now common defaults.
{{< /callout >}}

## Phrases


It is tempting to say "called", but the functions are not "called" in functional languages - they are _evaluated_ and combined in bigger transformations, until the whole program is constructed.

That means that the evaluation of the program replaces all occurrences of `r` with `5` (within the scope of the definition).

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
The context is missing, presumably a binding like `r = 5`. "Replaces all occurrences" describes the substitution model, a way to reason about the program, not what GHC does: at run time `r` is a reference to a shared value. See [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#substitution-model-and-equational-reasoning).
{{< /callout >}}

## Custom Prelude


? Using basic-prelude with NoImplicitPrelude to lower the amount of importing I do, and it tends to steer you into Text based solution instead of Strings.

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
This answers the todo under Learning path. The Prelude is imported into every module automatically. `{-# LANGUAGE NoImplicitPrelude #-}` switches that off, and you import a replacement explicitly:

```haskell
{-# LANGUAGE NoImplicitPrelude #-}
module Main where

import RIO   -- or: import Relude
```

To do it for the whole project, `relude` documents the cabal `mixins` approach, `mixins: base hiding (Prelude), relude (Relude as Prelude)`, together with a dependency on `relude`. Writing a project-local `Prelude` module that re-exports your preferred set is another common option.
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
`basic-prelude` is little used now; `relude` and `rio` are the usual choices. Using `Text` everywhere also needs `OverloadedStrings`, so that string literals can be `Text`. Many teams decide a custom Prelude isn't worth it and import `Data.Text`, `Data.Map.Strict` and the rest qualified instead.
{{< /callout >}}

## Moved to concept notes


Category theory links moved to [Category Theory]({{< ref "functional-programming/category-theory" >}}#resources).

Milewski's passage on purity and category theory moved to [Category Theory]({{< ref "functional-programming/category-theory" >}}#purity-and-category-theory).

The `myDrop` mental model of function application moved to [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#working-through-an-evaluation-by-hand).

Applicative functors link: merged into [Applicative]({{< ref "functional-programming/applicative" >}}), which already lists it. `$` and composition example: moved to [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#composition).

Lambdas and scope moved to [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#lambdas-closures-and-scope).

Returning functions and argument order moved to [Functions And Composition]({{< ref "functional-programming/functions-and-composition" >}}#returning-functions-and-api-design); pattern matching and recursion to [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#writing-recursive-functions).

Type classes moved to [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#type-classes).

Folds and Foldable moved to [Recursion And Folds]({{< ref "functional-programming/recursion-and-folds" >}}#folds).

Memory leaks moved to [Evaluation And Laziness]({{< ref "functional-programming/evaluation-and-laziness" >}}#costs-of-laziness-space-leaks).

### Programming in types


Moved to [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#type-first-design) and [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#product-and-sum-types).

### Monoids


Moved to [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}#monoid) (identity and folds) and [Monads]({{< ref "functional-programming/monads" >}}#option) (Maybe and missing values).

### Reader and IO


Moved to [Monads]({{< ref "functional-programming/monads" >}}#reader) and [Monads]({{< ref "functional-programming/monads" >}}#io).

### Monads


Moved to [Monads]({{< ref "functional-programming/monads" >}}#why-monads).

See also: [Functional Programming]({{< ref "functional-programming" >}}) for the section overview, [Fp Reading Paths]({{< ref "functional-programming/fp-reading-paths" >}}) for general FP reading, [Exercises And Projects]({{< ref "functional-programming/exercises-and-projects" >}}) for Haskell exercises and project ideas, and [Study Log]({{< ref "functional-programming/study-log" >}}) for dated study notes on folds and laziness. Also [Structuring Effectful Programs]({{< ref "functional-programming/structuring-effectful-programs" >}}) for transformers and mtl, and [Concurrency]({{< ref "functional-programming/concurrency" >}}).

## Library sources


- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: one of the books listed under Books; monads and monad transformers, for the transformers and mtl item in Learning path.
- [Allen 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: a complete beginner's book, an alternative backbone for the Learning path.
- [Serrano Mena 2022](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc), *Haskell: Almost Standard Libraries*: the libraries projects add on top of `base`, for Libraries and Ecosystem.
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: the *Effective Haskell* under Learning path and Books; a practical route from basics through projects and modules (chapter 5), type classes, IO and monad transformers (chapter 13) to type-level programming (chapter 15); chapter 3, section "Getting Help from Type Holes", backs the type-holes advice under Types first.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: the *Haskell in Depth* under Books; section 4.1 covers modules and custom preludes, for Custom Prelude; section 6.4 covers the transformers and mtl libraries, for the first item under Learning path; section 1.2 moves a program from `String` to `Text`.

Further reading:

- [Bird 2020](/sources/programming/functional-programming/bird-2020-algorithm-design-with-haskell.pdf.enc), *Algorithm Design with Haskell*
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*
- [Marlow 2013](/sources/programming/functional-programming/marlow-2013-parallel-and-concurrent-programming-in-haskell.pdf.enc), *Parallel and Concurrent Programming in Haskell*
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types*
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture*
