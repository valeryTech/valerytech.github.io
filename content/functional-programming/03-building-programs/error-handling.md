---
draft: false
toc: true
title: "Error Handling as Values"
aliases:
  - "/functional-programming/error-handling/"
description: "Errors as values instead of exceptions: totality, Option, Either and Try, fail-fast versus accumulating validation and why accumulation is applicative, typed errors in effect types, and converting at boundaries."
weight: "10"
linkTitle: "Error Handling"
---

Functional code reports failure by returning a value that says so, instead of throwing. This note covers why, the standard types (`Option`/`Maybe`, `Either`, `Try`, `Validated`/`Validation`), fail-fast versus accumulating composition, typed errors inside effect types, and converting between all of these at the edges of a program.

## Why not exceptions


Pilquist et al. (ch. 4.1) give two objections to `throw`.

- **It breaks referential transparency.** In their example, `val y: Int = throw Exception("fail!")` followed by `try { x + y } catch { case e: Exception => 43 }` throws, because `y` is evaluated before the `try`. Substitute the `throw` expression for `y` inside the `try` and the function returns 43 instead. The meaning of `throw` depends on which `try` block surrounds it, so it can't be reasoned about locally. `42 + 5` means 47 wherever it appears.
- **It isn't type safe.** `failingFn: Int => Int` says nothing about failure, and the compiler doesn't make callers deal with it. A forgotten case shows up at runtime.

Java's checked exceptions fix the second point at the cost of boilerplate, and they don't work with higher-order functions: a generic `map[A, B](l: List[A], f: A => B)` can't know what `f` might throw, which is why generic Java code falls back to `RuntimeException` (Pilquist et al., ch. 4.1). Plachta (ch. 6) makes a related practical point. A Java `parseShow` that throws checked exceptions looks the same as one returning `Option`, until you add a fallback ("if there's no start year, try a single year"). The exception version needs a `try`/`catch` block around each attempt and a variable initialised to `null`, while the `Option` version adds one `orElse`.

The older alternatives are no better (Pilquist et al., ch. 4.2). Sentinel values such as `NaN`, `-1` or `null` let errors propagate silently, need an `if` at every call site, and don't exist for a polymorphic `A`. An extra "what to return on failure" parameter makes the function total but forces the immediate caller to decide, when the decision often belongs several levels up.

### Totality


The fix is to put the possibility of failure into the return type. `mean: Seq[Double] => Double` is a *partial* function: it is undefined for the empty list. `mean: Seq[Double] => Option[Double]` is *total*: every input maps to exactly one output of the declared type (Pilquist et al., ch. 4.3). Wlaschin (ch. 10) asks for the same thing: a signature that documents every outcome, so `UnvalidatedAddress -> CheckedAddress`, which secretly throws, becomes `UnvalidatedAddress -> Result<CheckedAddress, AddressValidationError>`.

Haskell has the same problem in its own partial functions. `head []` and `tail []` throw at runtime (Skinner, ch. 2), and so do incomplete pattern matches. Bragilevsky (ch. 7.1.2) advises catching these at compile time instead, with `-fwarn-incomplete-patterns` or `-Wall`.

### Exceptions in Haskell


GHC still has runtime exceptions. They can be thrown anywhere, including pure code, but caught only in `IO`. Exceptions thrown from pure code are *imprecise*: laziness means the failing thunk may be forced much later, during some unrelated computation (Bragilevsky, ch. 7.1.1 and 7.3). Bragilevsky's guidelines (ch. 7.1.3):

1. Avoid exceptions through discipline: types, tests and compiler warnings.
2. Use programmable exceptions (`Maybe`, `Either`, `ExceptT`) in pure code whose errors only show up during processing.
3. Use GHC exceptions for talking to the outside world (`IO`), throwing and catching them in a few chosen places.
4. Use GHC exceptions to log whatever slipped through everything else.

Pilquist et al. (ch. 4.3.1) give the Scala version of the rule: throw only when no reasonable program would ever catch the exception. If some caller might want to recover, return a value.

### What values keep from exceptions


Pilquist et al. (ch. 4) state the alternative and what it preserves:

> The functional solution, of returning errors as values, is safer and retains referential transparency, and through the use of higher-order functions, we can preserve the primary benefit of exceptions -- *consolidation of error-handling logic.*

> But instead of using error codes, we introduce a new generic type for these "possibly defined values" and use higher-order functions to encapsulate common patterns of handling and propagating errors.

"Consolidation of error-handling logic" is what a `catch` block gives you: failures anywhere in a chain are handled in one place. With `Option` the chain is a sequence of `map`/`flatMap` calls, and the single handling point is a final `getOrElse` or pattern match.

Two things set this apart from C-style error codes. The error lives in a different type (`Option[A]` is not `A`), so the compiler won't let you use the result without dealing with the failure case. And the propagation is written once, inside `flatMap`, instead of as an `if` after every call.

Caveat: the consolidation has a limit. `flatMap` stops at the first failure, so a chain of `Option` or `Either` steps can only ever report one error. Reporting several needs a different kind of composition (see [Fail-fast versus accumulating](#fail-fast-versus-accumulating)).

## Option and Maybe: a value that might be missing


`Option[A]` in Scala and `Maybe a` in Haskell have two cases: a value (`Some a` / `Just a`) or none (`None` / `Nothing`).

```haskell
safeDiv :: Int -> Int -> Maybe Int
safeDiv _ 0 = Nothing
safeDiv a b = Just (a `div` b)

mean :: [Double] -> Maybe Double
mean [] = Nothing
mean xs = Just (sum xs / fromIntegral (length xs))
```

```scala
def safeDiv(a: Int, b: Int): Option[Int] =
  if b == 0 then None else Some(a / b)

def mean(xs: Seq[Double]): Option[Double] =
  if xs.isEmpty then None else Some(xs.sum / xs.length)
```


Pilquist et al. (ch. 4.3.1) describe `Option` as a list with at most one element, and most of its API follows from that: `map`, `flatMap`, `filter`, `getOrElse` (unwrap with a default) and `orElse` (try another `Option`). You apply several steps and look at the result once, at the end.

Using `Option` doesn't mean rewriting every function to accept `Option`. Ordinary functions are *lifted* into it (ch. 4.3.2): `map` turns `A => B` into `Option[A] => Option[B]`, and `map2` does the same for two arguments. `traverse` handles lists: apply a function returning `Option` to each element and get `Some` of all results, or `None` if any failed.

```haskell
import Text.Read (readMaybe)

quote :: Int -> Int -> Double
quote age tickets = undefined   -- the business formula

parseQuote :: String -> String -> Maybe Double
parseQuote age tickets = quote <$> readMaybe age <*> readMaybe tickets

parseAll :: [String] -> Maybe [Int]
parseAll = traverse readMaybe
```

```scala
def quote(age: Int, tickets: Int): Double = ???

def parseQuote(age: String, tickets: String): Option[Double] =
  for
    a <- age.toIntOption
    t <- tickets.toIntOption
  yield quote(a, t)

// The standard library has no traverse; Cats adds it:
import cats.syntax.all.*
def parseAll(xs: List[String]): Option[List[Int]] = xs.traverse(_.toIntOption)
```


Recovery is a function too. Plachta's (ch. 6) parser falls back to a single year when there is no start year:

```scala
yearStart <- extractYearStart(raw).orElse(extractSingleYear(raw))
```


In Haskell the same fallback is `<|>` from `Alternative`: `extractYearStart raw <|> extractSingleYear raw`.

The limitation is that `None` says nothing about *why*. See [Option]({{< ref "functional-programming/02-abstractions/monads" >}}#option) for the monad view of `Option`, and [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}) for `<*>`.

## Either: saying what went wrong


`Either[E, A]` / `Either e a` carries a value in both cases. By convention `Right` is success and `Left` is the error (Pilquist et al., ch. 4.4). The error type can be anything, and the advice from every source here is to make it a domain type, not a `String` or `Throwable`.

Welsh and Gurnell (ch. 4.4.4) give the reason: `Throwable` is so broad that it tells you almost nothing, while a sealed ADT of errors gives a fixed list of expected failures and exhaustivity checking when you match on it. Wlaschin (ch. 10) treats domain errors as part of the domain model: a choice type such as `ValidationError | ProductOutOfStock | RemoteServiceError`, discussed with domain experts. Adding a case later makes the compiler point at every match that doesn't handle it.

```haskell
data LoginError
  = UserNotFound String
  | PasswordIncorrect String
  deriving Show

findUser      :: String -> Either LoginError User          -- definitions elided
checkPassword :: String -> User -> Either LoginError User

login :: String -> String -> Either LoginError User
login name pw = do
  user <- findUser name
  checkPassword pw user
```

```scala
enum LoginError:
  case UserNotFound(name: String)
  case PasswordIncorrect(name: String)

def findUser(name: String): Either[LoginError, User] = ???
def checkPassword(pw: String, u: User): Either[LoginError, User] = ???

def login(name: String, pw: String): Either[LoginError, User] =
  for
    user <- findUser(name)
    ok   <- checkPassword(pw, user)
  yield ok
```


Wlaschin (ch. 10, "Chaining Result-Generating Functions") calls this the *two-track* model, or *railroad-oriented programming*. A function returning `Result` is a "switch" from one track onto two, success and failure. `bind` (`flatMap`, `>>=`) adapts a switch so it takes two-track input, skipping the function when the input is already a failure. `map` adapts an ordinary one-track function. Every step must share one error type, so a `mapError` step converts each function's errors into a common union type before composing (for example, an `AppleError` and a `BananaError` both become a `FruitError`).

For the Haskell side, Skinner (ch. 4) recommends a type alias such as `type AppValue = Either AppError` to cut repetition and keep one error type throughout.

## Try: exceptions caught into a value


Scala's `scala.util.Try[A]` is essentially `Either[Throwable, A]`, with `Success` and `Failure` cases. `Try(expr)` runs `expr` and catches non-fatal exceptions, as Pilquist et al.'s `catchNonFatal` does. Their comparison (ch. 4.4): `Either` is to `Try` as checked exceptions are to unchecked ones. `Either[NumberFormatException, Int]` records a precise error type, while `Try` only records `Throwable`.

```scala
import scala.util.Try

val n: Try[Int] = Try("42".toInt)
val e: Either[Throwable, Int] = n.toEither
```


`Try` is an adapter for code that throws, such as Java libraries and `String#toInt`. Inside your own logic, a domain error type in `Either` says more.

Haskell has no `Try` type. The equivalent is `Control.Exception.try :: Exception e => IO a -> IO (Either e a)`, which runs an `IO` action and returns the chosen exception type as a `Left`. Other exception types are rethrown (Bragilevsky, ch. 7.3.3). It works only in `IO`, because that is the only place GHC exceptions can be caught.

## Fail-fast versus accumulating


Plachta (ch. 6) names two strategies for parsing a list. *Best-effort* keeps the items that parsed and drops the rest (`List[Option[A]]` flattened to `List[A]`), which silently loses data. *All-or-nothing* returns `Option[List[A]]`: everything or nothing. He implements it with `foldLeft`. `traverse` does the same job in one call. Both are fail-fast in a sense: you learn that something failed, at most one reason.

`flatMap` can't do better. In `a.flatMap(x => f(x))`, if `a` failed there is no `x` to pass to `f`, so the second step can't run. The steps are dependent, so the first error ends the computation.

When the steps are *independent*, as when validating the fields of a form, nothing forces you to stop. Pilquist et al. (ch. 4.4.1 and 4.4.2) show this step by step. `map2` on `Either` reports only one error even when both arguments are `Left`. A `map2All` over `Either[List[E], A]` concatenates the errors. Naming that behaviour gives a new type, `Validated`, which is convertible to and from `Either` and differs only in `map2`. Generalising from `List[E]` to any `E` needs a way to combine two errors, which in Cats is a `Semigroup[E]` (see [Semigroup and monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}})).

```scala
import cats.data.ValidatedNel
import cats.syntax.all.*

final case class Person(name: String, age: Int)

def validName(s: String): ValidatedNel[String, String] =
  if s.nonEmpty then s.validNel else "Name is empty.".invalidNel

def validAge(n: Int): ValidatedNel[String, Int] =
  if n >= 0 then n.validNel else "Age is out of range.".invalidNel

def person(name: String, age: Int): ValidatedNel[String, Person] =
  (validName(name), validAge(age)).mapN(Person.apply)

// person("", -1) is Invalid, holding both messages in a NonEmptyList
```

```haskell
import Data.List.NonEmpty (NonEmpty)
import Data.Validation (Validation, validationNel)   -- the validation package

data Person = Person String Int deriving Show

notEmpty :: String -> Either String String
notEmpty "" = Left "Name is empty."
notEmpty s  = Right s

nonNegative :: Int -> Either String Int
nonNegative n
  | n < 0     = Left "Age is out of range."
  | otherwise = Right n

personE :: String -> Int -> Either String Person
personE n a = Person <$> notEmpty n <*> nonNegative a

personV :: String -> Int -> Validation (NonEmpty String) Person
personV n a = Person <$> validationNel (notEmpty n) <*> validationNel (nonNegative a)

-- personE "" (-1)  ==  Left "Name is empty."
-- personV "" (-1)  ==  Failure ("Name is empty." :| ["Age is out of range."])
```


Serrano Mena (*Almost Standard Libraries*, ch. 9.1; [PDF](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc)) uses the same pattern and calls `Either` fail-first and `Validation` accumulating. A `NonEmpty` list is the usual error type, because an `Invalid` with no errors makes no sense (Pilquist et al. make the same point). Allen and Moronuki (ch. 17) introduce `Validation` as a type identical to `Either` except for its `Applicative` instance, with total conversion functions both ways.

### Why accumulation is applicative, not monadic


Accumulation needs `<*>` / `mapN`, which sees both arguments before combining them. It can't come from `flatMap`, which has to stop. Welsh and Gurnell (ch. 6.3.1) explain why Cats' `Either` doesn't accumulate even through `product`/`mapN`: for any monad, `product` has to agree with the version defined via `flatMap` and `map`, so it fails fast. `Validated` therefore has an `Applicative` but no lawful `Monad`. When you do need a dependent step, use `andThen`, or convert to `Either`, `flatMap`, and convert back (Welsh and Gurnell, ch. 10).

Cats' `Parallel` type class pairs a monad with a related applicative. For `Either` the pair is accumulating, so `(e1, e2).parMapN(f)` on two `Either[Vector[String], _]` values collects both errors (Welsh and Gurnell, ch. 6.4). `traverse` with `Validated` collects one error per failing element (ch. 7.2.2.3). Wlaschin (ch. 10) makes the same split: monadic composition chains in series, applicative composition combines in parallel and is what you want for validation.

| | Fail-fast | Accumulating |
|---|---|---|
| Scala | `Option`, `Either`, `Try` | Cats `Validated`, `ValidatedNel`, or `Either` with `parMapN` |
| Haskell | `Maybe`, `Either`, `ExceptT` | `Validation` from the `validation` package |
| Composition | `flatMap`, `>>=`, `for`, `do` | `mapN`, `<*>`, `traverse` |
| Use when | later steps need earlier results | the checks are independent |

## Typed errors in effect types


Real programs fail inside effects such as `IO`, database calls and async work, not only in pure functions. The error can be part of the effect type. See [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}) for the effect types themselves.

**MonadError** abstracts "a monad that can fail with `E`". The two core operations are `throwError`/`raiseError`, which fails, and `catchError`/`handleErrorWith`, which recovers. In Haskell's mtl the class is `MonadError e m | m -> e`: the monad fixes the error type (Bragilevsky, ch. 7.2.1). In Cats it is `MonadError[F[_], E]` with extras such as `handleError` and `ensure`, and instances for `Either`, `Try` and `Future`. The `Try` and `Future` instances always use `Throwable` (Welsh and Gurnell, ch. 4.5). The book marks MonadError as optional: you only need it to write code that works for any error-handling monad.

```haskell
import Control.Monad.Except

data AppError = NotFound String | Forbidden String deriving Show

-- users :: [(String, User)] and guest :: User are defined elsewhere

findUser :: MonadError AppError m => String -> m User
findUser name = maybe (throwError (NotFound name)) pure (lookup name users)

findUserOrGuest :: MonadError AppError m => String -> m User
findUserOrGuest name = findUser name `catchError` \_ -> pure guest
```

```scala
import cats.MonadError

def validateAdult[F[_]](age: Int)(using F: MonadError[F, Throwable]): F[Int] =
  if age >= 18 then F.pure(age)
  else F.raiseError(IllegalArgumentException("Age must be at least 18"))

// validateAdult[scala.util.Try](8) is a Failure
// type ExceptionOr[A] = Either[Throwable, A]; validateAdult[ExceptionOr](8) is a Left
```


**ExceptT** adds a typed error to another monad: `newtype ExceptT e m a = ExceptT { runExceptT :: m (Either e a) }`. Skinner (ch. 13) builds it by first writing an `EitherIO` newtype over `IO (Either String a)`. Its instances don't depend on `IO`, so they generalise to any monad. She also states the case against relying on `IO` exceptions for application errors: nothing forces you to catch them, and they mix errors that should be handled differently. Bragilevsky (ch. 7.1.3) suggests `ExceptT` for stacks not based on `IO`, because `IO` can throw so many runtime exceptions that no finite error type lists them all.

**A fixed `Throwable` channel.** Scala's `Future`, `Try` and Cats Effect's `IO` all fail with `Throwable` only. Zionomicon (ch. 3.1) argues that this loses information. There is no way to say that an effect cannot fail, or that it fails only with a business error, and expected failures look the same as bugs.

**ZIO's `E` channel.** `ZIO[R, E, A]` puts the error type in the signature. `UIO[A]` (where `E` is `Nothing`) cannot fail with a typed error. ZIO splits failures into *errors*, which are anticipated, recoverable and appear in `E`, and *defects*, which are unanticipated, absent from `E`, and recorded in a `Cause` as a `Die` (Zionomicon, ch. 3.1 and 3.2). Which one a failure is depends on where you stand. A low-level file read can't know whether a missing file is recoverable, so it returns `ZIO[Any, IOException, String]`. Higher up, where a missing file means a broken deployment, `.orDie` turns the error into a defect and removes it from the type (ch. 3.5). `refineToOrDie[E1]` keeps one error type in the channel and turns the rest into defects.

```scala
import zio.*
import java.io.IOException

def readFile(path: String): ZIO[Any, IOException, String] = ???

val referenceData: ZIO[Any, Nothing, String] =
  readFile("reference.csv").orDie            // missing file is a defect here

def parseOrder(s: String): Either[OrderError, Order] = ???

def loadOrder(path: String): ZIO[Any, OrderError, Order] =
  readFile(path)
    .mapError(e => OrderError.Unreadable(e.getMessage))
    .flatMap(s => ZIO.fromEither(parseOrder(s)))
```


Volpe (ch. 1, Error handling) pushes back on typing every error. In a Cats Effect application he works in `F[_]: MonadThrow` (Cats' alias for `MonadError[F, Throwable]`) and adds `F[Either[E, A]]` only when the caller will act on the error differently. His test question is what you will actually do with the error information. One example is mapping business errors to HTTP status codes at the HTTP layer, where an unhandled error becomes a 500 response from the framework. The cost, which he acknowledges, is that the interface no longer says which errors can occur.

The errors-versus-defects split matches Wlaschin's (ch. 10) three kinds of error. *Domain errors* belong in the types. *Panics* (out of memory, divide by zero, programmer mistakes) should throw and be caught once at the top level. *Infrastructure errors* (timeouts, authentication failures) can go either way, and it often pays to model them, because how to react may be a business decision.

## Converting at boundaries


Most programs mix all of these, so much of error handling is conversion. The usual shape: catch exceptions into values at the edge where you call throwing code, work with values inside, and turn unrecoverable values back into exceptions or defects at the very top.

| Conversion | Scala | Haskell |
|---|---|---|
| Throwing code to a value | `Try(expr)`, Cats `Either.catchNonFatal(expr)`, `ZIO.attempt(expr)` | `try action` in `IO` |
| `Option` to `Either` | `opt.toRight(err)` | `maybe (Left err) Right m` |
| `Either` to `Option` | `e.toOption` | `either (const Nothing) Just e` |
| `Try` to `Either` | `t.toEither` | none needed |
| `Either` to accumulating | Cats `e.toValidated`, `e.toValidatedNel` | `validationNel e` |
| Accumulating to `Either` | Cats `v.toEither` | write it by hand, as Allen and Moronuki (ch. 17) do |
| Change the error type | `e.left.map(f)`, Cats `leftMap`, ZIO `mapError` | `first f e` (from `Data.Bifunctor`) |
| `Either` into an effect | `ZIO.fromEither(e)` | `liftEither e` (mtl) |
| Value back to an exception | `opt.getOrElse(throw ...)`, ZIO `.orDie` | `either (throwIO . userError . show) pure` |

Three of these appear in the sources as named adapters:

- Pilquist et al. (ch. 4.4) write `catchNonFatal`, which uses `NonFatal` so that fatal errors such as running out of memory are not caught.
- Wlaschin (ch. 10) writes `serviceExceptionAdapter`. It wraps an exception-throwing service call and catches only the exceptions that matter to the domain (timeout, authorisation), turning them into a `RemoteServiceError`. Everything else still propagates.
- Skinner (ch. 8) writes `eitherToErr :: Show a => Either a b -> IO b`. It goes the other way, turning a `Left` into an `IOError` with `throwIO` so a whole `IO` pipeline can be handled by one `catch`. She also notes that `throwIO` is the right choice inside `IO`, because the pure `throw` "may not always evaluate predictably".

When several error types meet, map each into a shared union before composing, as Wlaschin does with `mapError`. Don't widen everything to `Throwable` or `String`.

## Errors as values and parse, don't validate


Returning `Either` from a constructor is how the type-driven-design idea in [Parse, don't validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) gets implemented. Pilquist et al. (ch. 4.4, listing 4.4) give `Name` and `Age` private constructors and companion `apply` methods that return `Either[String, Name]` and `Either[String, Age]`. The only way to get a `Person` is through those checks, so a `Person` value is evidence that they passed. Wlaschin (ch. 10) does the same at workflow scale: `UnvalidatedOrder` goes in, and `Result<ValidatedOrder, ValidationError>` comes out.

The two ideas fit together like this:

- The parser's result type is the error-handling type. `String => Either[E, Email]` is a parser. `String => Boolean` followed by using the raw `String` is a validator, and it throws the evidence away.
- Accumulating types suit parsing at the boundary, where a user wants every problem with a form at once. Fail-fast types suit the steps after it, which depend on earlier results.
- Once input is parsed, the core receives domain types and needs fewer error cases. The error handling sits at the edge.

See also: [Option]({{< ref "functional-programming/02-abstractions/monads" >}}#option), [Applicative]({{< ref "functional-programming/02-abstractions/applicative" >}}), [Traversable and traverse]({{< ref "functional-programming/02-abstractions/traversable" >}}), [Semigroup and monoid]({{< ref "functional-programming/02-abstractions/semigroup-monoid" >}}), [Effect systems]({{< ref "functional-programming/03-building-programs/effect-systems" >}}), [Parse, don't validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}), [Functional domain modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}), [Domain modeling with types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}).

## Library sources


- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: chapter 4, Handling errors without exceptions. The case against exceptions and sentinels, totality, `Option` and lifting with `map2`/`traverse`, `Either` and `catchNonFatal`, accumulating errors and the derivation of `Validated`, and `Try` versus `Either`. Source of the two quoted passages.
- Płachta 2022, *Grokking Functional Programming*: chapter 6, Error handling. `Option` versus checked exceptions under conditional recovery, `orElse`, best-effort versus all-or-nothing strategies, refactoring to `Either`, `toRight`/`toOption`.
- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: section 4.4.4 (error ADTs versus `Throwable`), 4.5 (MonadError), chapter 6 (why `Either`'s `product` fails fast, `Parallel` and `parMapN`, `Validated`), 7.2.2.3 (traversing with `Validated`), chapter 10 (data validation case study).
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell*: chapter 8 (`catch`, `throwIO` versus `throw`, `eitherToErr`), chapter 13 (from `EitherIO` to `ExceptT`, `throwError`/`catchError`), chapter 4 (type aliases for `Either AppError`).
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional*: chapter 10, Working with Errors. Domain errors, panics and infrastructure errors, error choice types, the two-track model ("railroad-oriented programming") with `bind`/`map`/`mapError`, exception adapters, a brief mention of applicatives for validation, `AsyncResult`.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: chapter 7, Error handling and logging. Programmable versus GHC runtime exceptions, guidelines for choosing, `MonadError` and `ExceptT`, `try`/`tryJust`, `bracket`.
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: chapter 1, Error handling. `MonadThrow` in Cats Effect code, and when `F[Either[E, A]]` is worth it.
- [De Goes et al. 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*: chapter 3, The ZIO Error Model. Errors versus defects, `Cause`, `orDie`, `refineWith`/`refineToOrDie`.
- [Serrano Mena 2022](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc), *Haskell: Almost Standard Libraries*: chapter 9, Validation and parsing, section 9.1, "Applicative and Alternative": `Maybe`, `Either` and `Validation` (`validationNel`) for the same `validPerson`, with `Either` as fail-fast and `Validation` as accumulating, and `<|>` for alternatives; on *Fail-fast versus accumulating*. Chapter 12, Exceptions and resources: the introduction explains why IO code uses exceptions (otherwise `IO (Either ErrorType Result)` everywhere); section 12.1 covers `throw` from pure code but `catch` only in IO, `catchJust`, `catches` and the `handle` family, `safe-exceptions` for the synchronous/asynchronous split, and the runtime errors GHC turns into exceptions (pattern-match failure, `error`/`undefined`, missing fields); 12.1.1 covers `HasCallStack`, and 12.1.2 the `MonadThrow`/`MonadCatch`/`MonadMask` classes; on *Exceptions in Haskell*.
- [Allen and Moronuki 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles*: section 17.8, subsection "Either and Validation Applicative" (`Validation` accumulates errors with a `Monoid`; `validToEither` and `eitherToValid`), and section 18.4, the `mkSoftware` example (`Either`'s monad short-circuits, and there is no `Monad` for `Validation` because `(<*>)` must equal `ap`); on *Fail-fast versus accumulating*, *Why accumulation is applicative, not monadic* and *Converting at boundaries*. Sections 30.4 and 30.5: `try :: Exception e => IO a -> IO (Either e a)` catches only the chosen exception type; section 30.8: bottoms in lazy values can be forced outside the handler; on *Try: exceptions caught into a value* and *Exceptions in Haskell*.
- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: section 8.2.1, "Exceptions": `throw` from pure code, `catch`, `catches` and `try`, the `MonadThrow` and `MonadCatch` classes, and a `catch` that misses a division by zero because the result is still a thunk (fixed with `evaluate`); on *Exceptions in Haskell* and *Try: exceptions caught into a value*. Section 7.3, "Catching Errors": `MonadError` with its functional dependency, with `Maybe` as a `MonadError` whose error is unit; on *Typed errors in effect types*. Section 7.1, "Failure with Fallback": `<|>` and `Alternative` for trying another computation; on *Option and Maybe: a value that might be missing*.
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture*: sections 13.1.1-13.1.3, "Errors vs. exceptions", "Error domains" and "Native exception-handling schemes": errors versus exceptions and native errors, error domains whose boundaries require converting one error representation into another, and three places to convert a native exception (smart constructor, interpreter, or silencing it), with the rule that interpreters catch every external exception; on *Converting at boundaries* and *Why not exceptions*.
- King 2019, *Parse, don't validate*: "The power of parsing" contrasts `validateNonEmpty :: [a] -> IO ()` with `parseNonEmpty :: [a] -> IO (NonEmpty a)`; "The danger of validation" on shotgun parsing and splitting a program into a parse phase and an execute phase; "Parsing, not validating, in practice" advises treating functions that return `m ()` with suspicion; on *Errors as values and parse, don't validate*.
