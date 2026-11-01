---
draft: false
toc: true
title: "Structuring Effectful Programs"
linkTitle: "Structuring Effectful Programs"
---

How to organise a program that needs several effects (configuration, state, errors, I/O) and several replaceable dependencies (a database, an HTTP client). The note compares the main designs: monad transformer stacks, mtl-style classes, passing handles (the Service Handle and ReaderT patterns), free monads, tagless final, and ZIO's environment with `ZLayer`, then sets out the trade-offs and when to pick which.

This note was written on 2026-11-05 from the library sources listed at the end. Passages moved in from earlier notes keep their original wording under "Earlier notes" headings, with commentary in callouts titled **Explanation** and **Critique**.

## The design problem


A real program rarely lives in one simple monad. A request handler reads configuration, keeps a counter, can fail with a domain error, and talks to a database. Two separate questions hide in that sentence:

- **Combining effects.** How do Reader, State, Either and IO become one monad you can write a single `do` block or for-comprehension in? This is where transformers and mtl come in.
- **Abstracting dependencies.** How does business logic call "the user repository" without knowing whether it is Postgres or an in-memory map for tests? This is dependency inversion, and the answers are handles, Reader environments, interpreters of a free monad, tagless final algebras, or ZIO layers.

Granin (ch. 13.2) treats all of these as kinds of *functional interface* and compares them by simplicity, boilerplate, convenience and the language features they need. Serrano Mena (ch. 13) frames the same split as *final* style (the program is written against an interface) versus *initial* style (the program is a data structure that an interpreter walks). Most of the approaches below are one of those two, plus a decision about how to combine effects.

## Why monads don't compose


Functors compose: if `F` and `G` are functors, so is `F[G[_]]`, by mapping twice. Applicatives compose the same way. Monads don't. To write `flatten` (Haskell's `join`) for the composite you would need a function

```haskell
join :: f (g (f (g a))) -> f (g a)
```


and the only tools a monad offers are `return`, `fmap`, and a `join` that collapses two *adjacent* layers of the *same* monad. The layers here alternate, so nothing fits (Serrano Mena, ch. 10.3; Schwarz 2019, following *Functional Programming in Scala*).

There are partial escapes. If you can write `swap :: g (f a) -> f (g a)`, a *distributive law*, the middle layers can be swapped and both joins applied. `Maybe` distributes over any monad, and two Readers compose because swapping is just `flip`. A well-typed `swap` is not enough, though: the result must still obey the monad laws, and lists composed with lists break associativity (Serrano Mena, ch. 10.3). Schwarz quotes the FPiS version of the same idea: if the inner monad is also `Traverse`, `sequence` provides the swap. Neither gives a generic `compose` for monads, so each combination needs code written for it. Monad transformers are that code, written once per monad.

## Monad transformers


A transformer adds one monad's features on top of *any* monad `m`. `MaybeT` (Cats: `OptionT`) is the simplest:

```haskell
newtype MaybeT m a = MaybeT { runMaybeT :: m (Maybe a) }

instance Monad m => Monad (MaybeT m) where
  return x = MaybeT (return (Just x))
  MaybeT x >>= f = MaybeT $ do
    y <- x
    case y of
      Nothing -> return Nothing
      Just z  -> runMaybeT (f z)
```


The bind is `Maybe`'s bind with `m`'s plumbing threaded through. In `transformers`, the plain monads are the transformers over `Identity`: `State s = StateT s Identity`, `Reader r = ReaderT r Identity` (Serrano Mena, ch. 11.1; Bragilevsky, ch. 6.4).

Stacking several gives an application monad. Here configuration, a counter, a typed error and I/O:

```haskell
import Control.Monad (when)
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Reader
import Control.Monad.State
import Control.Monad.Except

newtype Config   = Config { maxTries :: Int }
newtype AppError = TooManyTries String deriving Show

type App = ReaderT Config (StateT Int (ExceptT AppError IO))

attempt :: String -> App ()
attempt key = do
  limit <- asks maxTries
  n     <- get
  when (n >= limit) $ throwError (TooManyTries key)
  put (n + 1)
  liftIO (putStrLn ("trying " ++ key))

runApp :: App a -> Config -> IO (Either AppError (a, Int))
runApp app cfg = runExceptT (runStateT (runReaderT app cfg) 0)
```


Things to notice:

- **Order changes meaning.** With `ExceptT` below `StateT`, the result is `Either AppError (a, Int)`: on failure the counter is lost. Put `StateT` below `ExceptT` and you get `(Either AppError a, Int)`, which keeps the state. Serrano Mena's example is a log that survives failure or not depending on whether `WriterT` sits above or below `MaybeT` (ch. 11.1.3).
- **Lifting.** With bare `transformers`, reaching the `StateT` layer from inside `ReaderT` takes `lift get`, and the layer below that `lift (lift ...)`. The mtl classes in the next section hide this. `IO` has no transformer and must sit at the bottom, reached with `liftIO` (Bragilevsky, ch. 6.2).
- **Hiding the stack.** Bragilevsky's `du` application wraps a `ReaderT`/`WriterT`/`StateT` stack over `IO` in a `newtype` and derives `MonadReader`, `MonadWriter`, `MonadState` and `MonadIO` with `GeneralizedNewtypeDeriving`, so the rest of the code never sees the layers (ch. 6.2.4).
- **Callbacks.** `lift` only works when the monad appears in the result type. Functions that take monadic arguments, such as `catch` or `bracket`, need *unlifting*. `MonadUnliftIO` from `unliftio` does this, but only for stacks of `ReaderT` over `IO`, because a stateful or error layer would behave differently if a callback ran twice (Serrano Mena, ch. 12.3).

In Scala the common transformers are Cats' `OptionT`, `EitherT` and `Kleisli` (Cats' Reader). Ghosh adds asynchrony to an account service by changing one alias, from `type Valid[A] = NonEmptyList[String] \/ A` to an `EitherT` over `Future`, so the algebra's signatures stay the same (ch. 6.2). Volpe's rule is to keep transformers out of interfaces: return `F[Option[A]]`, not `OptionT[F, A]`, so callers aren't forced to wrap and unwrap (ch. 1, "About monad transformers").

### Earlier notes


`Future[Option[_]]` and monad transformers

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
The problem: a for-comprehension over `Future` gives you `Option` values, which you must unwrap by hand at every step. In general two monads don't compose into a monad. A monad transformer is a specific fix for one monad: `OptionT[F, A]` wraps `F[Option[A]]` and provides a `flatMap` that goes through both layers.

```scala
import cats.data.OptionT
import cats.implicits._   // Monad[Future]; also needs an implicit ExecutionContext

def findUser(id: Int): Future[Option[User]] = ???
def findAddress(u: User): Future[Option[Address]] = ???

val address: OptionT[Future, Address] = for {
u <- OptionT(findUser(1))
a <- OptionT(findAddress(u))
} yield a

address.value  // Future[Option[Address]]
```

Haskell's version is `MaybeT` from `transformers`. Stacking several transformers (`ReaderT`, `StateT`, `ExceptT` over `IO`) is the classic way to build an application monad.
{{< /callout >}}


See also: [Functor]({{< ref "functional-programming/functor" >}}) and [Applicative]({{< ref "functional-programming/applicative" >}}) for the weaker abstractions, [Map Flatmap]({{< ref "functional-programming/map-flatmap" >}}) for `map` versus `flatMap` on `Option`, [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#side-effects) and [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#effect-systems), and [Effect Systems]({{< ref "functional-programming/effect-systems" >}}) for the Scala library.

## mtl-style classes


A function typed against a concrete stack breaks whenever the stack changes. mtl replaces the concrete type with constraints that name only the operations used:

```haskell
attempt :: (MonadReader Config m, MonadState Int m, MonadError AppError m, MonadIO m)
        => String -> m ()
```


The body is unchanged. `App` from above satisfies all four constraints, and so would any other stack that provides them. Each class needs two kinds of instance: one for the transformer that really implements the operation (`MonadReader r (ReaderT r m)`), and pass-through instances for every other transformer (`MonadReader r m => MonadReader r (MaybeT m)`). With *n* classes and *n* transformers that is roughly n² instances, which is why you use the `mtl` library instead of writing them (Serrano Mena, ch. 11.2).

Limits worth knowing (Serrano Mena, ch. 11.2):

- `MonadReader r m` has a functional dependency `m -> r`, which helps inference but allows only one environment type per monad. Two separate `MonadReader` constraints in one signature are rejected. The usual workaround is one environment with `HasX` classes for each part.
- The classes have few laws, so "polymorphic in `m`" says little about how the effects interact. That still depends on the order of the stack that is eventually chosen.

Cats MTL is the Scala counterpart, with finer-grained classes such as `Ask` and `Stateful` instead of `MonadReader` and `MonadState`. Volpe notes that a `Stateful` constraint is usually satisfied by `StateT`, but a `Ref`-backed instance over plain `IO` is faster and easier to use. That is a sign that in Scala the constraints are what you want, not the transformers behind them (Volpe, Bonus Chapter, "MTL").

mtl is tagless final for the standard effects: the class is the algebra, the instances are interpreters. Granin calls mtl a special case of final tagless (ch. 13.2.6), and Serrano Mena says final style resembles mtl but allows more than one interpretation per monad (ch. 13.2).

## Passing handles: the Service Handle and ReaderT patterns


The simplest functional interface is a record of functions. Granin calls it the Service Handle pattern and recommends it as the default (ch. 4.2.2, 13.2.2):

```haskell
data UserRepo = UserRepo
  { findUser :: UserId -> IO (Maybe User)
  , saveUser :: User -> IO ()
  }

rename :: UserRepo -> UserId -> Text -> IO Bool
rename repo uid newName = do
  mu <- findUser repo uid
  case mu of
    Nothing -> pure False
    Just u  -> saveUser repo u { name = newName } >> pure True
```


Production builds a `UserRepo` from a connection pool. A test builds one from an `IORef (Map UserId User)`. Nothing here needs type classes or higher kinds. It is an OOP interface passed as an argument, and the effect is a fixed `IO`. The Scala form is a trait over concrete `IO` taken as a constructor argument. Granin names two drawbacks: once there are many handles, grouping and passing them is unpleasant; and an interface that needs type-level machinery turns the record into "a monster".

The **ReaderT pattern** puts the handles in an environment instead of passing them:

```haskell
data Env = Env { envUsers :: UserRepo, envRequests :: IORef Int }

type App = ReaderT Env IO

renameApp :: UserId -> Text -> App Bool
renameApp uid newName = do
  repo <- asks envUsers
  liftIO (rename repo uid newName)
```


Granin's verdict is that this costs lifts and a run step for little gain over passing the handle, so keep it simple (ch. 13.2.3). The pattern is more often argued for on other grounds, set out in Michael Snoyman's "ReaderT design pattern" post (not in the library). Keep the stack at exactly `ReaderT Env IO`. Put mutable state in `IORef`s or `TVar`s inside `Env` instead of using `StateT` or `WriterT`. Then exceptions and concurrency behave like plain `IO`, and `MonadUnliftIO` works, since it supports only `ReaderT` over `IO` (Serrano Mena, ch. 12.3).

Ghosh uses Scala's version for dependency injection: service functions return `AccountRepository => Try[A]`, or a `Kleisli` over the repository, and the repository is supplied at the edge (ch. 3, "The Reader monad"; ch. 6.2). He notes that the language needs no DI framework for this. For Reader itself see [Monads]({{< ref "functional-programming/monads" >}}#reader).

## Free monads


A free monad turns a set of operations into a data type and gives you a monad over it without writing one. Each operation becomes a constructor holding its arguments and a continuation for its result. `Free` adds `Pure` (return) and nesting (bind), and an interpreter folds the tree into a real monad (Serrano Mena, ch. 13.3; Granin, ch. 6):

```haskell
{-# LANGUAGE DeriveFunctor #-}
import Control.Monad.Free

data ConsoleF next
  = ReadLine (String -> next)
  | PrintLine String next
  deriving Functor

type Console = Free ConsoleF

readLine :: Console String
readLine = liftF (ReadLine id)

printLine :: String -> Console ()
printLine s = liftF (PrintLine s ())

greet :: Console ()
greet = do
  printLine "Name?"
  n <- readLine
  printLine ("Hello, " ++ n)

runIO :: Console a -> IO a
runIO = foldFree step
  where
    step :: ConsoleF x -> IO x
    step (ReadLine k)    = k <$> getLine
    step (PrintLine s k) = putStrLn s >> pure k

runPure :: [String] -> Console a -> (a, [String])
runPure _      (Pure a)                = (a, [])
runPure ins    (Free (PrintLine s k)) = let (a, out) = runPure ins k in (a, s : out)
runPure (i:is) (Free (ReadLine k))    = runPure is (k i)
runPure []     (Free (ReadLine k))    = runPure [] (k "")
```


`greet` is a value. `runIO` runs it against the terminal and `runPure` against canned input. The interpreter passed to `foldFree` is a natural transformation `forall x. ConsoleF x -> IO x`.

**Freer and operational.** Writing continuations into every constructor is awkward. In *operational* style each instruction is a GADT constructor indexed by its result type, with no continuation, and a generic `Program instr a` (from the `operational` package) adds `Done` and `Bind`. Because the instruction type no longer needs to be a functor, this is called the *freer* monad. Cats' and Scalaz's `Free` are freer monads in this sense (Serrano Mena, ch. 13.4):

```scala
import cats.free.Free
import cats.~>
import cats.effect.IO

enum ConsoleOp[A]:
  case ReadLine extends ConsoleOp[String]
  case PrintLine(s: String) extends ConsoleOp[Unit]

def readLine: Free[ConsoleOp, String]          = Free.liftF(ConsoleOp.ReadLine)
def printLine(s: String): Free[ConsoleOp, Unit] = Free.liftF(ConsoleOp.PrintLine(s))

val greet = for
  _ <- printLine("Name?")
  n <- readLine
  _ <- printLine(s"Hello, $n")
yield ()

val toIO: ConsoleOp ~> IO = new (ConsoleOp ~> IO) {
  def apply[A](op: ConsoleOp[A]): IO[A] = op match
    case ConsoleOp.ReadLine     => IO.readLine
    case ConsoleOp.PrintLine(s) => IO.println(s)
}

val run: IO[Unit] = greet.foldMap(toIO)
```


What free monads buy:

- **Programs as values.** The same program can be interpreted for production, tests, logging or a different backend. Ghosh says the strong separation of algebra from interpreter "subsumes" dependency injection (ch. 5.5.5).
- **Inspection, with a limit.** Because the program is data, an interpreter can rewrite it before running it. Serrano Mena's example removes a `push` immediately followed by `pop` (ch. 13.5). But every bind holds a function, so you can't see past the next step without running it. Full static analysis needs free *applicatives*.
- **Stack safety in Scala.** Interpreting through `Free` is trampolined, which keeps deep monadic recursion off the JVM stack (Ghosh, ch. 5.5.5).
- **Clear boundaries.** Granin builds a whole framework from free monadic languages, nested into hierarchies ("hierarchical free monads"), with the interpreters as the only place that touches real subsystems (ch. 2, 6).

What they cost:

- **Boilerplate.** You write a data type, smart constructors and an interpreter for every language. Granin's own comparison concedes that for a simple service a handle is enough (ch. 13.2.4).
- **Performance.** Left-nested binds re-traverse the tree, so naive `Free` is quadratic. The fixes are the codensity transformation (Serrano Mena, ch. 15.2), Church-encoded `F` from the `free` package, and the "reflection without remorse" representation (Granin, ch. 6.2). There is also interpretive overhead per instruction.
- **Combining languages.** Two free languages in one program need a coproduct of their instruction types and injections (Serrano Mena, ch. 14.2). Generalising that gives *extensible effects*: one `Eff` monad indexed by a type-level list of effects, with handlers in place of interpreters. The book names `freer-simple`, `freer-effects` and Scala's `eff` (ch. 14.3). Later Haskell effect libraries such as `polysemy`, `fused-effects` and `effectful` continue the line (outside the library sources; check current status before choosing one).

### Earlier notes


free monad <https://underscore.io/blog/posts/2015/04/14/free-monads-are-simple.html>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A free monad turns a set of operations into a program that is plain data. You define the operations as a data type (for example `ReadLine`, `PrintLine`), and `Free` gives you `flatMap` over them for free, hence the name. The result is a tree of instructions, which a separate interpreter later runs: against real I/O in production, against a list of canned inputs in tests. Cats provides `cats.free.Free`; in Haskell it is `Control.Monad.Free` from the `free` package.
{{< /callout >}}

## Tagless final

### Origin: typed embedded languages


Carette, Kiselyov and Shan were solving a language-implementation problem. An interpreter for a typed object language, written over an AST, has to wrap its results in a universal value type (`IntV | BoolV | FunV`) and check those *tags* at run time, even though the object program was well typed. Their fix is to represent object terms by ordinary functions, one per syntactic form, instead of data constructors. They call this *final* because a term is represented by its denotation rather than its syntax. Abstracting those functions over a type constructor `repr` lets the same term be read many ways: evaluated, measured, compiled with staging, partially evaluated, or CPS-transformed (Carette et al. 2009, sections 1.3 and 2). A referee's summary, quoted in the paper, calls it "a way to write a typed fold function over a typed term."

```haskell
class Symantics repr where
  int :: Int -> repr Int
  add :: repr Int -> repr Int -> repr Int
  leq :: repr Int -> repr Int -> repr Bool
  if_ :: repr Bool -> repr a -> repr a -> repr a

newtype Eval a   = Eval   { runEval   :: a }
newtype Pretty a = Pretty { runPretty :: String }

instance Symantics Eval where
  int = Eval
  add (Eval a) (Eval b) = Eval (a + b)
  leq (Eval a) (Eval b) = Eval (a <= b)
  if_ (Eval c) t e = if c then t else e

instance Symantics Pretty where
  int n     = Pretty (show n)
  add a b   = Pretty ("(" ++ runPretty a ++ " + " ++ runPretty b ++ ")")
  leq a b   = Pretty ("(" ++ runPretty a ++ " <= " ++ runPretty b ++ ")")
  if_ c t e = Pretty ("if " ++ runPretty c ++ " then " ++ runPretty t ++ " else " ++ runPretty e)

term :: Symantics repr => repr Int
term = if_ (leq (int 1) (int 2)) (add (int 3) (int 4)) (int 0)
-- runEval term == 7; runPretty term is the source text
```


An ill-typed term such as `add (int 1) (leq (int 1) (int 2))` doesn't compile, so `Eval` needs no tags and cannot get stuck. The paper also notes that extending the language with new forms doesn't invalidate terms already written, which is why tagless final is cited as a solution to the expression problem (Volpe, ch. 2). `repr` has kind `* -> *`, a higher-kinded parameter (see [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#higher-kinded-types)). The paper's own conclusion is that abstracting over higher-kinded types pays off.

### In application code


In Scala, and in some Haskell codebases, the same shape became an architecture style. The object language is your domain's operations, `repr` becomes the effect `F[_]`, and the instances are interpreters for `IO` and for tests. Volpe's vocabulary (ch. 2):

- **Algebras** are traits like `Users[F[_]]` with no type-class constraints on them. If an algebra seems to need `Monad`, what you need is a program.
- **Programs** combine algebras and ask for capabilities as constraints (`F[_]: Monad: Log`).
- **Interpreters** implement algebras for a concrete `F`, often built inside `Resource`.
- **Business algebras are passed explicitly** as ordinary parameters. Implicits are for capabilities and lawful type classes. A context bound listing ten services is the anti-pattern he warns against.
- **Capability traits** such as a `Files[F]` with one method replace broad constraints like `Sync[F]`, by the principle of least power.

```scala
import cats.Monad
import cats.data.State
import cats.syntax.all.*

final case class User(id: Long, name: String)

trait Users[F[_]]:
  def find(id: Long): F[Option[User]]
  def save(u: User): F[Unit]

trait Log[F[_]]:
  def info(msg: String): F[Unit]
object Log:
  def apply[F[_]](using l: Log[F]): Log[F] = l

def rename[F[_]: Monad: Log](users: Users[F])(id: Long, newName: String): F[Boolean] =
  users.find(id).flatMap {
    case None    => Log[F].info(s"no user $id").as(false)
    case Some(u) => users.save(u.copy(name = newName)).as(true)
  }

// test interpreter: pure state over a map
type Test[A] = State[Map[Long, User], A]

val testUsers: Users[Test] = new Users[Test] {
  def find(id: Long): Test[Option[User]] = State.inspect(_.get(id))
  def save(u: User): Test[Unit]          = State.modify(_.updated(u.id, u))
}
given Log[Test] with
  def info(msg: String): Test[Unit] = State.pure(())

val (db, ok) = rename[Test](testUsers)(1L, "Bob").run(Map(1L -> User(1L, "Al"))).value
```


Volpe's argument for paying the `F[_]` tax is parametricity. Inside `rename` the type allows only `Users`, `Log` and `Monad` operations, while a function in `IO` can do anything. He adds that Scala doesn't enforce this, since nothing stops a side effect inside `F`, so it rests on team discipline (ch. 2, "Why Tagless Final?"). Composition is easy: a program needing two algebras just has two constraints, and interpreting has no intermediate data structure, so the overhead is close to nil (Serrano Mena, ch. 13.2, 14.1).

Two differences between Haskell and Scala. In Haskell the algebra is usually a type class, so interpreters are chosen by type, and two interpreters for the same `F` need distinct newtypes. Volpe distinguishes algebras (many interpreters) from type classes (coherent, one instance per type) for that reason (ch. 2, "Algebras"). Granin is critical of the Haskell form: business logic and instances live in the same monad `m`, so domain effects and infrastructure effects mix in one constraint list, and he ranks it below handles and free monads (ch. 13.2.6).

The domain-modeling side of tagless final, with an accounts example, its costs and the expression-problem links, is in [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#tagless-final) and not repeated here.

### Earlier notes


[Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#tagless-final)

[Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#daniel-sentence)

<https://okmij.org/ftp/tagless-final/course/index.html#lecture>

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Tagless final combines the two main ideas of this note: a program is written against a type class over a higher-kinded parameter, such as `trait Console[F[_]]`, and each interpreter is an instance of that type class for a concrete `F`, such as `IO` in production or a pure state type in tests. The okmij.org course is by Oleg Kiselyov, who introduced the technique with Jacques Carette and Chung-chieh Shan in "Finally tagless, partially evaluated".
{{< /callout >}}


Tagless final

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
A style where business logic is written against interfaces parameterised by the effect type, and the concrete effect is chosen at the edge of the program:

```scala
trait Users[F[_]]:
def find(id: UserId): F[Option[User]]

def greet[F[_]: Monad](users: Users[F], id: UserId): F[String] =
users.find(id).map(_.fold("unknown")(_.name))
```

Production code runs it with `IO`, tests with a simple in-memory `F`. The name comes from Carette, Kiselyov and Shan's "Finally Tagless, Partially Evaluated", where it is a technique for embedding typed languages. The alternative, free monads, represents the program as a data structure that is interpreted later. See [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}) and [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}).
{{< /callout >}}

{{< callout context="note" title="Critique" icon="outline/help-octagon" >}}
In Scala the style is contested. When an application only ever uses one effect type, abstracting over `F[_]` adds type parameters and constraints everywhere for flexibility that is never used; ZIO's authors, John De Goes among them, have argued against it for that reason. Its strongest case is libraries meant to work with any effect type.
{{< /callout >}}

## Free monads versus tagless final


The two are the initial and final encodings of the same idea: an algebra of operations with interchangeable interpreters (Serrano Mena, ch. 13; Volpe, ch. 2).

| | Free / freer monad | Tagless final |
|---|---|---|
| Program is | a data structure | a polymorphic function |
| Interpreter is | a natural transformation folded over the tree | an instance / implementation for one `F` |
| Inspect or rewrite before running | yes, up to the next bind | no, unless an interpreter builds a structure |
| Combine two languages | coproducts or an effect library | add a constraint |
| Runtime cost | allocation and interpretation per step; naive `Free` is quadratic on left-nested binds | close to none |
| Boilerplate | data type, smart constructors, interpreter | trait and implementations |

They can be converted into each other. An interpreter of a final program can build an AST, and an initial program can be folded into any final interpretation.

### Earlier notes


**Tagless Final Encoding** approach vs Free monad

{{< callout context="note" title="Explanation" icon="outline/info-circle" >}}
Both separate *what* a program does from *how* it is run. With a free monad the program is a data structure that an interpreter walks. With tagless final the program is written against an interface of operations that is generic in the effect type, for example `trait Console[F[_]] { def readLine: F[String] }` with code that needs `Monad[F]` and `Console[F]`. Each interpreter is an instance of that interface (for `IO`, for a test state type). Trade-offs: free programs can be inspected, transformed or optimized before they run, but cost boilerplate and runtime overhead. Tagless final is lighter and faster, and it is the style most of the Scala Cats Effect ecosystem uses. See [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}) and [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#effect-systems).
{{< /callout >}}

## ZIO's environment and ZLayer


ZIO takes a different route: one concrete effect type with the reader and error channels built in. Its mental model is `ZIO[R, E, A] = ZEnvironment[R] => Either[Cause[E], A]` (De Goes, ch. 17.1), which is roughly `ReaderT R (ExceptT E IO)` fused into one type. Because the channels are part of `ZIO`, no transformer stack is needed. Because `R` is contravariant and requirements combine as intersection types (`Users & Log`), the compiler infers what a workflow needs.

De Goes presents this as a reaction against tagless final. In a talk he calls "The Death of Finally Tagless", he argued that testability was the technique's main benefit and that passing interfaces gets the same result more simply, without teaching higher-kinded types, type classes and implicits (De Goes, Foreword, 0.9). ZIO later dropped its polymorphic variants of `Ref` and `Queue` for concrete ones for the same reason (0.21).

The recommended structure is the *Service Pattern* (ch. 17.7): a service trait; a case class implementing it; dependencies taken as constructor arguments; a `ZLayer` that builds the service, with any setup and teardown; and optional accessors. A `ZLayer[RIn, E, ROut]` is a recipe that builds `ROut` from `RIn` and may fail with `E`. Layers are values, can be effectful and resourceful (`ZLayer.scoped`), and `provide` wires them automatically, with compile errors naming any missing service (ch. 17.5).

```scala
import zio.*

final case class User(id: Long, name: String)

trait Users:
  def find(id: Long): Task[Option[User]]
  def save(u: User): Task[Unit]

final case class Renamer(users: Users):
  def rename(id: Long, newName: String): Task[Boolean] =
    users.find(id).flatMap {
      case None    => ZIO.succeed(false)
      case Some(u) => users.save(u.copy(name = newName)).as(true)
    }

object Renamer:
  val layer: ZLayer[Users, Nothing, Renamer] = ZLayer.fromFunction(Renamer(_))

val program: ZIO[Renamer, Throwable, Boolean] =
  ZIO.serviceWithZIO[Renamer](_.rename(1L, "Bob"))

// production: program.provide(Renamer.layer, UsersLive.layer, Database.layer)
// test:       program.provide(Renamer.layer, ZLayer.succeed[Users](inMemoryUsers))
```


Two rules from the book. Service methods should have environment `Any`, with dependencies in the implementation's constructor, so the interface doesn't leak how it is built (ch. 17.8). The environment itself is best kept for capabilities that are introduced and removed locally, such as `Scope` for resources or a transaction (ch. 17.3).

This is the Service Handle pattern with a dependency-graph builder on top. The trade-offs: you commit to ZIO as the effect type everywhere; the wiring relies on macros and type tags; and the business logic can still perform any `Task`, because nothing like parametricity restricts it.

## Trade-offs


Rough guidance drawn from the sources above. Granin's own table (ch. 13.2.7) is the starting point, and he warns it is not the final word.

| Approach | Performance | Testability | Boilerplate | Familiarity needed |
|---|---|---|---|---|
| Transformer stack (concrete) | each bind goes through every layer; usually acceptable in Haskell, allocation-heavy on the JVM | swap the base monad or run layers purely | lifts, runners, newtype deriving | monads and transformers; stack order |
| mtl classes | good when specialised; polymorphic code passes dictionaries | choose a test stack or instance | low per function; n² instances live in the library | type classes, functional dependencies |
| Service Handle | plain function calls | build a fake record | very little | none beyond records of functions |
| ReaderT `Env IO` | plain `IO` plus an environment lookup | build a test `Env` | small; `asks` and `liftIO` | Reader; `IORef`/`TVar` discipline |
| Free / freer monad | interpretive overhead; needs codensity or Church encoding at scale | excellent: pure interpreters, inspect programs | high: ADT, smart constructors, interpreters | free monads, natural transformations |
| Tagless final | near zero | excellent: test interpreters, no mocks | moderate: `F[_]` and constraints everywhere | higher-kinded types, type classes, implicits |
| ZIO environment + `ZLayer` | one optimised runtime; no abstraction over `F` | swap layers | low; auto-wiring | ZIO's API; layers |

Performance statements here are qualitative. Measure before choosing on performance grounds.

## When to pick which


- **Small program, one effect type, a few dependencies.** Pass handles (records or traits over `IO`). Granin's advice for most services (ch. 13.2).
- **Haskell application.** `ReaderT Env IO` with handles or `Has`-style accessors in `Env` is the low-risk default. Use `ExceptT` or `StateT` locally inside pure or isolated code, not as the global stack. mtl constraints on top are reasonable when the team already knows them.
- **Scala on Cats Effect.** Tagless final is the ecosystem's idiom, and libraries such as http4s, fs2 and doobie are written that way, so following Volpe's rules fits best. For application code with a single `F = IO`, plain traits over `IO` are a defensible simplification (see the Critique above).
- **Scala on ZIO.** Use the Service Pattern and `ZLayer`. Don't layer tagless final on top.
- **You need to analyse, optimise, replay or serialise programs, or you are building a DSL or framework.** Use a free or freer monad (or free applicative) where the inspection is needed, and keep it local.
- **A library meant to work with any effect type.** Use tagless final: this is its strongest case.
- **Many fine-grained effects with precise types in Haskell.** Consider an effect library from the extensible-effects line, and weigh how mature it is and what your team already knows. See [Effect Systems]({{< ref "functional-programming/effect-systems" >}}).

See also: [Monads]({{< ref "functional-programming/monads" >}}), [Effect Systems]({{< ref "functional-programming/effect-systems" >}}), [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}#higher-kinded-types), [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}#tagless-final), [Monads]({{< ref "functional-programming/monads" >}}#reader), [Error Handling]({{< ref "functional-programming/error-handling" >}}), [Pure Functions And Effects]({{< ref "functional-programming/pure-functions-and-effects" >}}#functional-core-imperative-shell).

Assembled on 2026-11-05; earlier fragments came from [Monads]({{< ref "functional-programming/monads" >}}), [Type Classes And Polymorphism]({{< ref "functional-programming/type-classes-and-polymorphism" >}}) and [To Sort]({{< ref "functional-programming/to-sort" >}}).

## Library sources


- [Serrano Mena 2021](/sources/programming/functional-programming/serrano-mena-2021-book-of-monads-2e.pdf.enc), *Book of Monads (2nd edition)*: ch. 10 why monads don't compose and distributive laws; ch. 11 transformers and mtl-style classes; ch. 12 lifting and `MonadUnliftIO`; ch. 13 final, initial and operational styles, free and freer monads; ch. 14 composing them and extensible effects; ch. 15 performance of free monads.
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*: ch. 6 structuring programs with monad transformers (the `du` stack, newtype deriving, the `transformers` and `mtl` packages); ch. 7.2 `ExceptT`.
- [Schwarz 2019](/sources/programming/scala/schwarz-2019-monads-do-not-compose.pdf.enc), *Monads do not Compose*: functor and applicative composition, the failed `join`, and the `Traverse` escape, after FPiS.
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture*: ch. 4.2 the Service Handle pattern; ch. 6 free monads as functional interfaces; ch. 13.2 handles, ReaderT, free monads, GADTs and final tagless/mtl compared.
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling*: ch. 3 the Reader monad for injecting repositories; ch. 5.5 free monads for a repository algebra; ch. 6.2 stacking `Future` and `\/` with `EitherT`.
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala (2nd edition)*: ch. 1 "About monad transformers"; ch. 2 tagless final (algebras, interpreters, programs, explicit versus implicit parameters, capability traits, parametricity); Bonus Chapter on Cats MTL.
- [De Goes 2025](/sources/programming/scala/degoes-2025-zionomicon.pdf.enc), *Zionomicon*: Foreword on the ZIO environment, `ZLayer` and the move away from tagless final; ch. 17 the environment, layers and the Service Pattern; ch. 18 `ZEnvironment`.
- [Carette et al. 2009](/sources/programming/dsls/carette-2009-finally-tagless-partially-evaluated.pdf.enc), *Finally Tagless, Partially Evaluated*: sections 1 to 2, the tag problem, the final encoding, and the `Symantics` interpreters.

Further reading:

- [Welsh and Gurnell 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats*: ch. 5 monad transformers in Cats.
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala (2nd edition)*: ch. 13 builds an IO type and free monads, trampolining included.
- [Rosien 2021](/sources/programming/scala/rosien-2021-essential-effects.pdf.enc), *Essential Effects*: Cats Effect `IO`, resources and concurrency, the runtime under a tagless final application.
