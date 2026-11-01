---
draft: false
toc: true
title: "Property Based Testing"
linkTitle: "Property Based Testing"
---
# Property-based testing


A property-based test states something that must hold for all inputs of a type and lets a library generate many inputs to look for a counterexample. This note covers properties versus examples, generators and shrinking, QuickCheck and ScalaCheck, where good properties come from, and checking type-class laws.

This note was written on 2026-11-05 from the library sources listed at the end.

## Properties instead of examples


An example-based test picks an input, works out the expected output by hand and asserts it. Plachta (ch. 12) shows how far that gets you: three carefully chosen examples for a travel-guide scoring function all pass, yet the function has a bug none of them reaches. The hard part of example testing is choosing the examples, and the author of the code is the person worst placed to choose them.

A property is a more general statement of the function's behaviour, closer to a requirement. "Reversing a list twice gives back the list." "The maximum is greater than or equal to every element." "The score is between 0 and 70 whatever the subjects." The testing library then does the part humans are bad at: it generates hundreds of inputs and checks the property on each one. Pilquist et al. (ch. 8) describe the idea as decoupling the specification of behaviour from the creation of test cases. Plachta's way of seeing it: a property is an example with some "wiggle points", parts that are left free and filled in randomly.

Bragilevsky (ch. 8.2.4) lists three stages:

1. Define generators that describe how to produce inputs.
2. State properties as equalities or assertions relating inputs to outputs.
3. Check the properties on generated inputs and analyse the failures.

A passing property is evidence, not proof. It means no counterexample was found among the inputs tried (Pilquist et al., ch. 8.1 and summary; Bragilevsky, ch. 8.2.4). Only when the domain is small enough to enumerate completely does exhaustive testing amount to a proof.

## QuickCheck and ScalaCheck


QuickCheck, by Koen Claessen and John Hughes, was the first property-testing library (Allen and Moronuki, ch. 14.4); their paper appeared at ICFP in 2000. ScalaCheck is the Scala library based on it (Pilquist et al., ch. 8.2), and Hedgehog is a newer Haskell library with different design choices (Bragilevsky, ch. 8.2.4). The same property in Haskell and Scala:

```haskell
import Test.QuickCheck

prop_reverseTwice :: [Int] -> Bool
prop_reverseTwice xs = reverse (reverse xs) == xs

prop_reverseWrong :: [Int] -> Bool
prop_reverseWrong xs = reverse xs == xs

-- ghci> quickCheck prop_reverseTwice
-- +++ OK, passed 100 tests.
-- ghci> quickCheck prop_reverseWrong
-- fails with a small counterexample such as [0,1]
```

```scala
import org.scalacheck.{Gen, Prop}

val intList = Gen.listOf(Gen.choose(0, 100))

val reverseTwice = Prop.forAll(intList)(ns => ns.reverse.reverse == ns)
val reverseWrong = Prop.forAll(intList)(ns => ns.reverse == ns)

// reverseTwice.check   + OK, passed 100 tests.
// reverseWrong.check   ! Falsified after a few tests, e.g. ARG_0: List(0, 1)
```


The ScalaCheck example is Pilquist et al.'s listing 8.1. Both libraries run 100 cases by default. In Haskell the property's argument type tells QuickCheck what to generate, through the `Arbitrary` type class. If the type is left polymorphic, GHCi's defaulting picks `()` and the property passes vacuously on unit values, so always fix a concrete type (Allen and Moronuki, ch. 14.4 and 15.12; `verboseCheck` shows what was actually tested).

In Scala the property is often written inside a test framework. Plachta uses ScalaTest with its ScalaCheck integration, where `forAll` takes a function and the framework generates its arguments:

```scala
test("guide score should not depend on the attraction's name and description") {
  forAll((name: String, description: String) => {
    val guide = TravelGuide(Attraction(name, Some(description), yellowstone), twoMovies)
    assert(guideScore(guide) == 65)
  })
}
```


(Plachta, ch. 12, "Property-based testing"; `yellowstone` and `twoMovies` stand in for the book's literal values.)

Hedgehog writes properties as monadic blocks: `forAll` draws a value from a generator and `===` asserts equality (Bragilevsky, ch. 8.2.4):

```haskell
prop_parseIP :: Property
prop_parseIP = property $ do
  ip <- forAll genIP
  parseIP (show ip) === Just ip
```

## Generators


A generator is a value of type `Gen a` that describes how to produce random `a`s. It is not a random value itself, just a description, and it composes like any other functional value (Plachta, ch. 12, "Custom generators").

In QuickCheck, `arbitrary :: Arbitrary a => Gen a` is the default generator for a type, and combinators build others (Allen and Moronuki, ch. 14.4):

```haskell
genDigit :: Gen Char
genDigit = elements ['0' .. '9']

genSmall :: Gen Int
genSmall = choose (0, 10)

genMaybe :: Arbitrary a => Gen (Maybe a)
genMaybe = frequency [(1, pure Nothing), (3, Just <$> arbitrary)]

genPair :: Gen (Int, Char)
genPair = do
  n <- genSmall
  c <- genDigit
  pure (n, c)
```


`sample` and `sample'` print or return a few generated values, which is the quickest way to see what a generator does. Allen and Moronuki call `Arbitrary` "not a terribly principled typeclass", because it has no laws: it is only a convenient place to find a default generator. A type can have many useful generators besides its `Arbitrary` instance. `forAll gen prop` uses an explicit one.

In ScalaCheck the same building blocks exist as `Gen.choose`, `Gen.oneOf`, `Gen.frequency`, `Gen.listOf`, `Gen.listOfN` and friends, and generators compose in for comprehensions because `Gen` has `flatMap` (Plachta, ch. 12):

```scala
val nonNegativeInt: Gen[Int] = Gen.chooseNum(0, Int.MaxValue)

val randomArtist: Gen[Artist] = for
  name      <- Gen.identifier
  followers <- nonNegativeInt
yield Artist(name, followers)

val randomArtists: Gen[List[Artist]] = for
  n       <- Gen.chooseNum(0, 100)
  artists <- Gen.listOfN(n, randomArtist)
yield artists
```


`flatMap` is what lets one generated value decide how to generate the next, for example a list whose length was itself generated (Pilquist et al., ch. 8.1.5). Bragilevsky's IP-range generator does the same in Hedgehog: it generates the first address, then the second from a range that starts at the first, so every generated range is valid (ch. 8.2.4).

Some practical rules from the books:

- **Generate valid inputs instead of filtering them.** Plachta's first attempt replaced negative generated numbers with 0 inside the test. Because the function under test is pure, every negative input then produced the same test, and about half the runs were wasted. A custom generator that only produces non-negative numbers spends every run on a different case. Filtering with QuickCheck's `==>`, ScalaCheck's `suchThat` or Hedgehog's `Gen.filter` discards inputs, and too many discards make the test give up or test little.
- **Bound sizes deliberately.** Inputs for property tests are random data plus control over sizes and bounds, a strategy for growing them, and a strategy for shrinking them (Bragilevsky, ch. 8.2.4). Hedgehog makes this explicit with `Range` values: constant, linear or exponential in a size parameter, each with an origin that shrinking moves towards.
- **Mind where the generator puts its weight.** Plachta notes that ScalaCheck gives extra weight to corner cases such as 0 and the minimum and maximum of the type. Allen and Moronuki show QuickCheck trying 0 early for the same reason (ch. 14.4). Their first example property, `x + 1 > x` for `Int`, passes, although it is false for `maxBound`. QuickCheck's default `Int` generator draws small numbers, bounded by the size parameter, so it almost never meets `maxBound`. The overflow bug in Plachta's example, by contrast, was found because the generator ranged up to `Int.MaxValue`.

### Generators are pure


Pilquist et al. build their own library in chapter 8 and represent a generator as a state transition over a purely functional random-number generator, `opaque type Gen[+A] = State[RNG, A]` (ch. 8.1.4). Generation is then deterministic given a seed, so a failing run can be replayed exactly. QuickCheck's `sample` runs in `IO` only because it fetches a seed from a global source of randomness (Allen and Moronuki, ch. 14.4).

### Generating functions


Testing a higher-order function needs random functions as inputs, which is harder than random data (Pilquist et al., ch. 8.3). QuickCheck generates functions through a second type class, `CoArbitrary`, for the argument type, and the `Fun` type from `Test.QuickCheck.Function`, which wraps a generated function together with a representation that can be shown and shrunk (Allen and Moronuki, ch. 14.6 and 16.9). ScalaCheck can generate `A => B` from an `Arbitrary[B]` and a `Cogen[A]`, its counterpart to `CoArbitrary`.

## Shrinking


The first counterexample found is usually large and noisy. Test-case minimisation turns it into the smallest input that still fails. Pilquist et al. (ch. 8.2) describe two approaches:

- **Shrinking:** after a failure, repeatedly try smaller versions of the failing input and keep any that still fail. QuickCheck and ScalaCheck work this way. Traditionally it needs shrinking code per data type, such as QuickCheck's `shrink` method in `Arbitrary`.
- **Sized generation:** generate inputs in order of increasing size, so the first failure found is already small. This is what Pilquist et al. build in their own library with `SGen[+A] = Int => Gen[A]`.

Hedgehog builds shrinking into the generators themselves, so a custom generator shrinks without extra code, towards the origin of its `Range` (Bragilevsky, ch. 8.2.4). Its counterexamples show it: after 131 shrinks, the failing input for an IP-range parser was `0.0.0.1,0.0.0.0`, an obviously invalid range that the parser accepted.

Plachta's travel-guide example shows why shrinking matters. A property says that the score of a guide with only artists stays between 0 and 55. ScalaCheck finds a failing list and, after six shrinks, reports two artists whose followers are 225,818,040 and 2,147,483,647. The small example points straight at the cause: adding the two follower counts overflows `Int`, and the score goes negative. The fix is to sum in `Long`.

## Where good properties come from


Coming up with properties is the hardest part (Plachta, ch. 12; Bragilevsky, ch. 8.2.4). A few recurring shapes cover most of them.

**Round trips.** Encoding and then decoding gives back the input. Allen and Moronuki's Morse-code project (ch. 14.5) checks that converting a character to Morse and back returns it, using a custom generator restricted to characters that have a Morse code:

```haskell
prop_thereAndBackAgain :: Property
prop_thereAndBackAgain =
  forAll charGen (\c -> (charToMorse c >>= morseToChar) == Just c)
```


Hedgehog has a helper for exactly this, `tripping ip show parseIP` (Bragilevsky, ch. 8.2.4). `reverse . reverse = id` is the same shape.

**Invariants and postconditions.** Something about the output always holds. The maximum is at least every element; a sorted list is ordered and is a permutation of the input (Pilquist et al., ch. 8.2.2, exercises 8.13 and 8.14); a score stays within its bounds (Plachta). Bragilevsky checks that both borders of every range in a database are found by the lookup function, which caught a `<` that should have been `<=`.

**Invariance under a change of input.** Changing something irrelevant shouldn't change the result. Summing a reversed list gives the same sum (Pilquist et al., ch. 8.1); the score doesn't depend on the attraction's name and description (Plachta).

**Comparison with a model.** Test the real implementation against a simpler one that is obviously correct. Bragilevsky (ch. 8.2.4) checks that three implementations of `buildIP`, one straightforward and two optimised, agree on all generated inputs. The same idea scales up to testing a stateful system against a simple model of its state, which is beyond what these books cover.

**Algebraic laws.** If an API has an algebra, its laws are properties. Pilquist et al. (ch. 8.2.3) test the laws of their parallelism library, and in section 8.4 notice that `map(id) == y` holds for `Gen` as well as for `Par`, `List`, `Option` and `State`: the first hint of the functor laws of part 3. Idempotence (`sort . sort = sort`), associativity and identity elements belong here too.

**Rejection of invalid input.** Generate invalid inputs on purpose and check that they are rejected. Bragilevsky's generator of invalid IP ranges found the parser bug above.

### Wrong test or a bug?


A failing property doesn't always mean the code is wrong (Plachta, ch. 12, "Wrong test or a bug?"). Plachta's first failure came from negative box-office earnings, which the domain never needs; the fix was a better generator, not a change to the function. Pilquist et al.'s property for `max` fails on the empty list, which forces a decision: use a generator of non-empty lists, or change the function's type (ch. 8.2.2). Both cases show a property-based test exposing an assumption nobody had written down.

## Testing type-class laws


Type-class laws are properties, which makes them a natural fit for property-based testing. Proving them by hand is tedious and has to be redone whenever an instance changes; QuickCheck is a cheap way to see whether they probably hold (Allen and Moronuki, ch. 15.12). Volpe (ch. 8, "Law testing") makes the stronger point that every hand-written instance should be checked, because unlawful instances are easy to write and silently break the guarantees code relies on.

### Monoid laws


Allen and Moronuki (ch. 15.12) write the laws as ordinary functions and give QuickCheck concrete types:

```haskell
monoidAssoc :: (Eq m, Monoid m) => m -> m -> m -> Bool
monoidAssoc a b c = (a <> (b <> c)) == ((a <> b) <> c)

monoidLeftIdentity :: (Eq m, Monoid m) => m -> Bool
monoidLeftIdentity a = (mempty <> a) == a

-- quickCheck (monoidAssoc :: String -> String -> String -> Bool)
```


Their counterexample is a type `Bull = Fools | Twoo` whose combination always returns `Fools` and whose identity is `Fools`. Associativity passes, but both identity laws fail at once with the counterexample `Twoo`, since `mempty <> Twoo` is `Fools`. See [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}).

### Functor and monad laws


The functor laws become two properties (Allen and Moronuki, ch. 16.9). The composition law needs random functions, which is where `Fun` comes in:

```haskell
functorIdentity :: (Functor f, Eq (f a)) => f a -> Bool
functorIdentity x = fmap id x == x

functorCompose :: (Functor f, Eq (f c)) => f a -> Fun a b -> Fun b c -> Bool
functorCompose x (Fn f) (Fn g) = fmap (g . f) x == (fmap g . fmap f) x

-- quickCheck (functorIdentity :: [Int] -> Bool)
-- quickCheck (functorCompose :: Maybe Int -> Fun Int Int -> Fun Int String -> Bool)
```


`Fn` is a pattern that extracts the plain function from a `Fun`; Allen and Moronuki match `Fun _ f` instead, which does the same. The monad laws follow the same pattern: `return a >>= f == f a`, `m >>= return == m`, and `(m >>= f) >>= g == m >>= (\x -> f x >>= g)`. See [Functor]({{< ref "functional-programming/functor" >}}) and [Monads]({{< ref "functional-programming/monads" >}}).

The same laws in ScalaCheck, for `Option`:

```scala
import org.scalacheck.Prop.forAll
import org.scalacheck.Properties

object OptionFunctorLaws extends Properties("Option functor"):
  property("identity") = forAll((fa: Option[Int]) => fa.map(identity) == fa)

  property("composition") = forAll { (fa: Option[Int], f: Int => Int, g: Int => String) =>
    fa.map(f).map(g) == fa.map(f andThen g)
  }
```

### Ready-made law suites


Writing the laws by hand is good for learning them; in practice libraries ship them.

- In Haskell, the `checkers` library bundles the laws into test batches run with `quickBatch`: `monoid`, `functor`, `applicative`, `monad` and `traversable` (Allen and Moronuki, ch. 17, 18 and 21.11). It needs an `EqProp` instance to compare results, and a dummy value of the right type to pick the instances, often `undefined` with a type annotation. On `Bull` it reports the two failing identity laws and a passing associativity law.
- In Scala, Cats ships the laws in the `cats-laws` module, built on the Discipline law-checking library and ScalaCheck. Volpe (ch. 8) checks a `Monoid[Money]` instance with `checkAll("Monoid[Money]", MonoidTests[Money].monoid)`, given an `Arbitrary[Money]`. The output lists every law in the suite, more than the textbook three: Cats' monoid laws also cover `combineAll`, `combineN` and `isEmpty`. There are matching suites for functors, monads and traversables. See [Traversable]({{< ref "functional-programming/traversable" >}}) for the traversal laws.

One caution applies to both: laws are stated as equalities, so you need a way to compare values. For functions, `IO` or `State`, equality has to be approximated, for example by running both sides on generated inputs. That is what `EqProp` and Cats' `Eq` instances for these types are for.

## Why purity makes this easy


Plachta's main point in chapter 12 is that functional tests need no new concepts: a test is itself a function, built from the same pure functions and immutable values as the production code. A pure function returns the same output for the same input, so a test is a call and an assertion, with no setup, no mocks and no flakiness. Properties push this further. Generating a thousand inputs is only practical when each call is cheap, independent and repeatable, and those are exactly the guarantees of a pure function. Equational laws such as `reverse . reverse = id` only make sense for code you can reason about by substitution; see [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#referential-transparency).

It also explains which code to test this way. Plachta starts with pure functions that take and return plain values: they are usually the business logic, in the functional core, and they are the easiest to test. Code that talks to external services is tested separately, with stubbed services written as plain values or with integration tests against real ones; see [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#functional-core-imperative-shell). Plachta does show that properties still work at the edges: an integration test checks, for random non-negative limits, that a real SPARQL server never returns more results than requested ("Property-based integration tests").

Properties sit next to other ways of being confident in code, not instead of them. Plachta's requirements table counts some requirements as covered by function signatures and types alone, with no test at all. Bragilevsky (ch. 8.3) covers doctest, which runs the examples in documentation comments, and LiquidHaskell, which checks refinement types statically. See [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}) and [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}).

See also: [Functor]({{< ref "functional-programming/functor" >}}), [Monads]({{< ref "functional-programming/monads" >}}), [Semigroup Monoid]({{< ref "functional-programming/semigroup-monoid" >}}), [Applicative]({{< ref "functional-programming/applicative" >}}), [Traversable]({{< ref "functional-programming/traversable" >}}), [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}), [Study Log]({{< ref "functional-programming/study-log" >}}) (the 23.11.23 note on hspec, tasty and `tasty-quickcheck`, with a fusion law as a QuickCheck property).

## Library sources


- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: chapter 8, Property-based testing: ScalaCheck in brief, designing `Gen` and `Prop` from scratch, generators as `State[RNG, A]`, shrinking versus sized generation, example properties for `max` and `sorted`, testing laws and higher-order functions, and the laws of generators.
- Płachta 2022, *Grokking Functional Programming*: chapter 12, Testing functional programs: example-based against property-based tests with ScalaTest and ScalaCheck, custom generators, a shrunk counterexample that exposes integer overflow, wrong test versus bug, stubbing services as values, and property-based integration tests.
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: chapter 14, Testing (Hspec, QuickCheck, `Arbitrary` and `Gen`, the Morse-code round trip, `CoArbitrary`); section 15.12 (monoid laws); section 16.9 (functor laws and `Fun`); the `checkers` test batches in chapters 17, 18 and 21.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: part 3, Quality assurance, chapter 8, Writing tests: tasty and Hspec, property-based testing with Hedgehog (ranges, generators, `tripping`, shrunk counterexamples), golden tests, doctest and LiquidHaskell.
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: chapter 8, Testing, "Law testing": checking a `Monoid` instance with `cats-laws` and Discipline.

Further reading:

- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: chapter 8, a case study on testing asynchronous code by abstracting over the effect type.
- [Hughes 1990](/sources/programming/functional-programming/hughes-1990-why-functional-programming-matters.pdf.enc), *Why Functional Programming Matters*: by one of QuickCheck's authors, on the modularity that makes functional code easy to test in pieces.
