---
draft: false
toc: true
title: "Tagless Final"
description: "Tagless final as a typed encoding of algebras and interpreters: its origin in typed EDSLs, the expression problem, Volpe's and Parsons' rules for production code, and two critiques."
linkTitle: "Tagless Final"
---

Tagless final is a typed encoding of the algebra-and-interpreter idea in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#modules-as-algebras). The other ways of supplying interpreters (Reader and Kleisli, free monads, ZIO's environment, algebraic effects) are compared in [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}).

## In brief


The algebra becomes a trait parameterized by an effect type constructor `F[_]`. Programs are written against the trait, and interpreters are implementations for a concrete `F` (Scala 3, with Cats for `Monad` and `flatMap` syntax):

```scala
trait Accounts[F[_]]:
  def open(no: String, owner: String): F[Account]
  def debit(a: Account, amount: BigDecimal): F[Account]
  def credit(a: Account, amount: BigDecimal): F[Account]

def transfer[F[_]: Monad](accounts: Accounts[F])(from: Account, to: Account, amount: BigDecimal): F[(Account, Account)] =
  for
    f <- accounts.debit(from, amount)
    t <- accounts.credit(to, amount)
  yield (f, t)
```


One interpreter is an `Accounts[IO]` that talks to Postgres, another an in-memory one over `State` for tests, and a third might wrap either to add logging.

Three distinctions clarify what the pattern is and isn't (following Carette, Kiselyov and Shan, [PDF](/sources/8438a472517b14d83c46797890285d8c.bin), Volpe, [PDF](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), chapter 2, and Daniel Ciocîrlan's Rock the JVM overview):

- **Where the name comes from.** Carette, Kiselyov and Shan introduced *finally tagless* (APLAS 2007, then JFP 2009) to embed typed domain-specific languages in a host language without runtime type tags. An *initial* encoding represents a program as a data structure (an AST) that an interpreter walks; when that AST is untyped, the interpreter's values must be wrapped in sum tags such as `IntVal | BoolVal` and checked at runtime (section 1.1, "The tag problem"). A typed AST written as a GADT avoids the tags (section 1.2; Bragilevsky, [PDF](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), section 11.4.2, builds one in Haskell). A *final* encoding represents a term as calls to an interface (its denotation in a semantic algebra), needing neither runtime tags nor GADTs. It became a Scala and Haskell application-architecture style only later; see [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}#embedded-dsls-initial-and-final).
- **An extension of "programming to interfaces".** The algebra is the interface and the interpreter is the implementation. The one addition over ordinary object-oriented interfaces is that the interface is also abstract in the effect type `F[_]`, so the same program can run in `IO`, in `Either`, or in a pure state monad for tests.
- **Not the same thing as `F[_]` + type classes.** In Scala and Haskell, tagless final is usually written alongside `F[_]: Monad` constraints, so the two get conflated. You can write generic code over `F[_]: Monad` without any domain algebra, and you can write tagless final without making the algebra a type class -- by passing `accounts: Accounts[F]` as an ordinary value parameter, as `transfer` does above. `F[_]: Monad` is only how the caller states that the interpreter's result type supports sequential composition.

What it buys:

- `transfer` doesn't know whether it's running against a database, a test map or a logging wrapper.
- The signature lists the capabilities a function uses (`Accounts[F]`, `Monad`), the way a constructor lists its dependencies.
- Testing means choosing a different interpreter, without a mocking library.
- **Parametricity:** because `transfer` knows nothing about `F` beyond `Monad`, it can't log, read the clock or start a thread unless it's given an algebra for that. Volpe (chapter 2, "Parametricity") treats this -- not swapping production interpreters -- as the main payoff, and as the answer to "why not use `IO` everywhere?": a function over concrete `IO` has all of `IO`'s power.

What it costs:

- `F[_]` and type-class constraints spread through the whole codebase.
- The abstraction is rarely used to swap production effect systems: most applications have one production `F` (`IO`), so the polymorphism is paid for everywhere and exercised mainly in tests. (Its defenders reply with the parametricity point above, though Volpe concedes that the Scala compiler doesn't enforce discipline if an interpreter leaks implementation details.)
- Domain algebras carry no compiler-checked laws. Capability classes such as `Monad` have laws, but an algebra like `Accounts[F]` is just an interface. Even a one-method capability class such as `MonadTime` (`getCurrentTime`) shows the trap: a pure mock returning a fixed timestamp violates `x <- getCurrentTime; y <- getCurrentTime; pure (x < y)`, whereas passing `UTCTime` as an ordinary parameter to a pure function needs no algebra at all (Parsons, [PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), section 6.2). If a domain algebra's own invariants matter (crediting then debiting leaves the balance unchanged), they have to be written as property tests, as Ghosh does ([Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#modules-as-algebras)).
- Type inference and compiler error messages get worse, and newcomers face a steeper learning curve.

The alternatives are plain traits or records of functions over a concrete `IO`, ZIO's service pattern, free monads, and algebraic effect handlers (all compared in [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}})).

## The expression problem


Philip Wadler named the **expression problem** in 1998: can you add both new cases (data variants) and new operations (interpreters) to a data type, without modifying or recompiling existing code, while keeping static type safety? Mainstream styles make one direction easy and the other hard, and tagless final is one of the known ways to get both:

```text
                  add a case            add an operation
class hierarchy   easy: a new subclass  hard: touch every class
sum type          hard: touch every     easy: a new function
                  match
tagless final     a new algebra trait   a new interpreter
                  extending the base    implementing the traits
```


Leduc et al. ([PDF](/sources/a33101ab492d5054bb69f20326bc8df2.bin)) generalize the question from data types to extending whole languages.

## In practice


Volpe's chapter 2 ("Tagless final encoding") is the most complete practical guide in the library, complemented by Parsons ([PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), chapters 6 and 7) for Haskell:

- **Algebras, programs, interpreters.** An algebra is an interface parameterized by a higher-kinded type (`Counter[F]`); a program combines algebras, putting type-class constraints only where it needs them; an interpreter implements an algebra for a concrete `F`.
- **No constraints on algebras.** The algebra declares operations; constraints such as `Monad` belong on the programs and interpreters that need them.
- **The least powerful constraint.** If a program only needs to combine independent effects, ask for `Apply` or `Applicative`, not `Monad` (as Mokhov et al., [PDF](/sources/968bcf5644f3dbb1736d59b47f1717c1.bin), do to distinguish static build dependencies from dynamic ones).
- **Pass business algebras explicitly.** A signature like `def program[F[_]: Cache: Console: Users: Monad: Parallel: Items: EventsManager: HttpClient: KafkaClient: EventsPublisher]` is an anti-pattern. Implicits (`given` / `using`) are for coherent type-class instances and cross-cutting capabilities such as logging; business algebras should be ordinary value parameters. Parsons (section 6.2) gives the Haskell version of the same choice (`LockService` record versus `MonadLock` class): a record closes over runtime connections without putting them in `F`'s type and can be wrapped or modified as a value (`lockForTenTimesLonger`), whereas varying a type-class instance locally requires wrapping `F` in a `newtype`; what a type class buys is one canonical instance per type.
- **Slice algebras by domain, not infrastructure.** Parsons (sections 6.2 and 7.5) warns against broad classes such as `MonadDatabase` or `MonadRedis`, whose mocks would have to reimplement a database; abstract only the narrow set of domain queries or locks a caller actually uses (`MonadLock`, `GetUsers`).
- **No monad transformers in interfaces** (Volpe, chapter 1, "About monad transformers"): an interface that returns `EitherT[F, E, A]` forces every implementation into that stack.
- **Errors.** By default, let `F` carry errors through `MonadThrow`; return `F[Either[E, A]]` only when the calling logic branches on the domain error.

## Two critiques


- **De Goes** ([PDF](/sources/4115845a430bc3f50ff12c191a45fd53.bin), chapter 0) argued in "The Death of Finally Tagless" and "Tagless Horror" that testability is tagless final's main practical benefit in business applications and can be achieved much more directly by passing plain interfaces over a concrete effect type, as object-oriented programmers have done for decades.
- **Granin** ([PDF](/sources/1c38a03f85e649d3dcd0ebb0dbcbe9ea.bin), section 13.2.6, "Final tagless/mtl", and section 15.2.5) objects that in `mtl`-style final tagless the business logic and the type-class instances live in the same environment, coupling them tightly and rating poorly for white-box testability compared with free monads, where the program description and its interpreter are separate values.

## Library sources


- [Volpe 2021](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), *Practical FP in Scala, 2nd Edition* -- chapter 2, "Tagless final encoding": algebras, programs and interpreters, least power, implicit and explicit parameters, parametricity; chapter 1 on monad transformers in interfaces; on *In brief* and *In practice*
- [Carette et al. 2009](/sources/8438a472517b14d83c46797890285d8c.bin), *Finally Tagless, Partially Evaluated: Tagless Staged Interpreters for Simpler Typed Languages* -- the paper that introduced the tagless final encoding of typed embedded languages; section 1.1 on the runtime tag problem in untyped ASTs, section 1.2 on GADTs, and section 1.3 on final encodings as typed folds; on *In brief*
- [Gibbons et al. 2014](/sources/55e41880192e3803ac43c73f98018799.bin), *Folding Domain-Specific Languages: Deep and Shallow Embeddings* -- section 2, "Embedding DSLs", on why a deep embedding makes new observers easy and new constructs hard and a shallow one the reverse (the expression problem), and on deep and shallow having been called initial and final although both are initial algebras; sections 4.4, "Parametrized interpretations", and 4.5, "Implicitly parametrized interpretations", on a shallow embedding parameterized by an algebra passed explicitly or as a type-class dictionary; section 5 relating this to Carette et al.; on *In brief* and *The expression problem*
- [Parsons 2023](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), *Production Haskell* -- section 6.2, "Layer 2: Object Oriented Programming", on why `MonadTime` fails a realistic mock law (`x < y`), why broad `MonadDatabase` or `MonadRedis` classes are unmockable compared with narrow domain slices (`MonadLock`, `GetUsers` in 7.5), and the trade-off between `mtl` type classes and explicit records of functions (`LockService`) when closing over connections or wrapping behavior locally; section 7.3 on passing effectful functions polymorphic in `Monad m =>` without type classes; on *In brief* and *In practice*
- [Serrano Mena 2021](/sources/4f6f84b5680da34841126999b31e2ed3.bin), *Book of Monads, 2nd Edition* -- chapter 13, "Defining Custom Monads", with section 13.1.1 on algebra (syntax) and interpreters (semantics), section 13.1.2 on restrictive monads such as a file-system-only `FS`, and section 13.2, "Final Style", which names it final tagless or object algebras, compares it with `mtl`, weighs making `Monad` a superclass of the algebra against a separate constraint, and interprets `FS` both in `IO` and in a `State` mock; section 14.1 on composing final-style algebras by listing their constraints; on *In brief* and *In practice*
- [Granin 2025](/sources/1c38a03f85e649d3dcd0ebb0dbcbe9ea.bin), *Functional Design and Architecture* -- section 13.2.6, "Final tagless/mtl", on the coupling of business logic and instances and on constraint lists that mix domain effects with domain-agnostic ones such as logging; section 15.2.5, "Testability of different approaches", and table 15.1 rating final tagless/mtl against ReaderT, service handles and free monads; on *Two critiques*
- [De Goes et al. 2025](/sources/4115845a430bc3f50ff12c191a45fd53.bin), *Zionomicon* -- chapter 0, on "The Death of Finally Tagless" and the environment type as the alternative; on *Two critiques*
- [Leduc et al. 2019](/sources/a33101ab492d5054bb69f20326bc8df2.bin), *The Software Language Extension Problem* -- generalizes the expression problem from data types to extending whole languages; on *The expression problem*

Further reading:

- Gibbons and de Moor 2003, *The Fun of Programming* -- chapter 12, Hinze, "Fun with phantom types", section 12.1, "Introducing phantom types", a typed initial encoding (a GADT-style `Term t`) whose interpreter is also tag-free; on *In brief*
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 11.4.2, "Example: Representing arithmetic expressions with GADTs", a typed initial encoding as a GADT `Expr a` whose `myeval :: Expr a -> a` needs no runtime tags, at the cost of an existential `SomeExpr` when parsing, the GADT alternative to the final encoding; on *In brief*
- [Mokhov et al. 2020](/sources/968bcf5644f3dbb1736d59b47f1717c1.bin), *Build Systems a la Carte: Theory and Practice* -- section 3.2, "The Task Abstraction", writes a build task as a function polymorphic in its functor under a constraint `c`; section 3.4, "The Need for Polymorphism in Task", shows each build system choosing a different functor for the same task, with the constraint classifying tasks (`Applicative` for static dependencies, `Monad` for dynamic ones); section 3.7, "Computing Dependencies", runs an applicative task in `Const` to list its dependencies without running it, a concrete payoff of asking for the least powerful constraint; on *In practice*
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell* -- chapter 13, "Building Applications with Many Effects", subsection "Tagless Final Encoding", on `mtl` style as tagless final over monad transformers, with the trade-off against direct style: flexibility, dependency injection and test stacks, against losing control over which effects run, worse error messages and longer compile times; on *In brief*
- [Rosien 2021](/sources/26d28e80e57cc7f4abab6120e2fa075d.bin), *Essential Effects* -- Appendix B, "Abstracting effects with typeclasses", refactoring concrete `IO` to `F[_]: Monad` for effect polymorphism and error reduction (restricting what an implementation can invoke to the type-class methods); on *In brief*
- [Serrano Mena 2022](/sources/5c1001bd2c4b75b2ff640e61358fc71a.bin), *Haskell: Almost Standard Libraries* -- section 22.2, "Architecture: classes, AppM, and RIO", weighing `mtl` constraint lists (pruned with `-Wredundant-constraint`, at the cost of `ConstraintKinds` aliases and weaker cross-module GHC specialization) against concrete `AppM` stacks and `RIO`; on *In brief* and *In practice*
- Oleg Kiselyov, "Tagless-Final Style" lecture notes: [Tagless-Final Style lecture notes (Oleg Kiselyov)](https://okmij.org/ftp/tagless-final/course/index.html#lecture)
- Daniel Ciocîrlan (Rock the JVM), "[Tagless Final in Scala](https://blog.rockthejvm.com/tagless-final/)" and video [Tagless Final in Scala video (Rock the JVM)](https://www.youtube.com/watch?v=m3Qh-MmWpbM)
- Adam Warski (SoftwareMill), "[Final Tagless Seen Alive](https://blog.softwaremill.com/final-tagless-seen-alive-79a8d884691d)"
- John De Goes, "[Tagless Horror](https://degoes.net/articles/tagless-horror)"
- [Awesome Tagless Final repository](https://github.com/tofu-tf/awesome-tagless-final)
- Additional Scala tutorials and discussions: [Scalac](https://scalac.io/blog/tagless-final-pattern-for-scala-code/), [Baeldung](https://www.baeldung.com/scala/tagless-final-pattern), and [r/scala discussion](https://www.reddit.com/r/scala/comments/s6ih9p/can_you_give_a_brief_understanding_on_tagless/)
- On the expression problem: [Wikipedia](https://en.wikipedia.org/wiki/Expression_problem) and Eli Bendersky on [the expression problem and its solutions](https://eli.thegreenplace.net/2016/the-expression-problem-and-its-solutions/) and [the Composite and Interpreter design patterns](https://eli.thegreenplace.net/2016/on-the-composite-and-interpreter-design-patterns)
