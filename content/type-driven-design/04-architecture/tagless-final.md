---
draft: false
toc: true
title: "Tagless Final"
description: "Tagless final as a typed encoding of algebras and interpreters: the encoding, Volpe's rules for using it, two critiques, the expression problem, and an open task."
linkTitle: "Tagless Final"
---

Tagless final is a typed encoding of the algebra-and-interpreter idea in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#modules-as-algebras). The other ways of supplying interpreters (Reader and Kleisli, free monads, ZIO's environment, algebraic effects) are compared in [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}).

## In brief


A starting point for the open task below, not the article itself.

The algebra becomes a trait parameterized by an effect type `F[_]`. Programs are written against the trait, and interpreters are instances for a concrete `F` (Scala 3, with cats for `Monad` and the `flatMap` syntax):

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

What it buys:

- `transfer` doesn't know whether it's running against a database, a test map or a logging wrapper
- the signature lists the capabilities a function uses (`Accounts[F]`, `Monad`), the way a constructor lists its dependencies
- testing means choosing a different interpreter, without a mocking library
- parametricity: because `transfer` knows nothing about `F` beyond `Monad`, it can't log, read the clock or start a thread unless it's given an algebra for that. Volpe ([PDF](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), chapter 2, "Parametricity") treats this, not swapping interpreters, as the main payoff, and as the answer to "why not use `IO` everywhere?": a function over concrete `IO` has all of `IO`'s power.

What it costs (the critique, as in the De Goes link below):

- `F[_]` and type-class constraints spread through the whole codebase
- the abstraction is often unused for swapping: most applications have exactly one production `F` (`IO`), so the polymorphism is paid for everywhere and exercised only in tests. (Its defenders reply with the parametricity point above, but Volpe concedes that the Scala compiler doesn't enforce it: nothing stops an interpreter's details from leaking into a program, so it depends on discipline.)
- the domain algebras have no laws. Capability classes such as `Monad` do, but an algebra like `Accounts[F]` is just an interface, and in Volpe's style that's intended. If the algebra's own rules matter (crediting then debiting leaves the balance unchanged), they have to be written as property tests, as Ghosh does ([Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#modules-as-algebras))
- type inference and compiler errors get worse, and newcomers struggle

The alternatives are plain traits over a concrete `IO` (programming to interfaces without `F`), ZIO's service pattern, free monads, and effect systems with algebraic effects (all in [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}})).

The origin is Carette, Kiselyov and Shan, *Finally Tagless, Partially Evaluated* (APLAS 2007, then JFP 2009; [PDF](/sources/8438a472517b14d83c46797890285d8c.bin)), which is about embedding typed languages in a host language. An *initial* encoding represents a program as a data structure (an AST) that an interpreter walks. A *final* encoding represents it as calls to an interface, so each interpreter is an implementation of that interface. *Tagless* refers to the type tags an initial interpreter needs when its AST is untyped: the interpreter's values must be wrapped in something like `IntVal | BoolVal` and checked at runtime (Carette et al., section 1.1, "The tag problem"). A typed AST written as a GADT avoids the tags as well (their section 1.2; Bragilevsky 2021, section 11.4.2, builds one in Haskell). The point of the final encoding is that it needs neither the tags nor GADTs. See [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}#embedded-dsls-initial-and-final) for the wider picture.

## In practice


Volpe's chapter 2 ("Tagless final encoding") is the most complete practical guide in the library. Its main rules:

- **Algebras, programs, interpreters.** An algebra is an interface with a higher-kinded type (`Counter[F]`); a program combines algebras, with type-class constraints only where it needs them; an interpreter implements an algebra for a concrete `F`. Volpe notes that tagless final encodings have little to do with type classes, despite the original paper using Haskell type classes to present them.
- **No constraints on algebras.** The algebra declares operations; constraints such as `Monad` belong on the programs and interpreters that need them.
- **The least powerful constraint.** If a program only needs to sequence two effects, ask for `Apply`, not `Monad`.
- **Pass business algebras explicitly.** A signature like `def program[F[_]: Cache: Console: Users: Monad: Parallel: Items: EventsManager: HttpClient: KafkaClient: EventsPublisher]` is an anti-pattern. Implicits are for coherent type-class instances (and a few capabilities such as logging); business algebras should be ordinary parameters.
- **No monad transformers in interfaces** (chapter 1, "About monad transformers"): an interface that returns `EitherT[F, E, A]` forces every implementation into that stack.
- **Errors.** By default, let `F` carry errors through `MonadThrow`; return `F[Either[E, A]]` only when the calling logic branches on the error.

## Two critiques


- **De Goes** ([PDF](/sources/4115845a430bc3f50ff12c191a45fd53.bin), chapter 0) argued in the talk "The Death of Finally Tagless" that testability is tagless final's main benefit and that it can be had much more simply by passing interfaces, as object-oriented programmers have done for decades. ZIO's environment type was his alternative.
- **Granin** (section 13.2.6, "Final tagless/mtl") objects that in final tagless the business logic and the type-class instances live in the same environment, so they're tightly coupled; in a free-monad design the program and its interpreter are separate values.

## Open task


Open task: explain what the tagless final (TF) pattern does.

Cover examples, advantages and disadvantages, trade-offs, and the problems it solves. Use a project to develop an article. ^definition

## Sources


Follow-up reading (prerequisite not specified): <https://blog.softwaremill.com/final-tagless-seen-alive-79a8d884691d>

[awesome tagless final github](https://github.com/tofu-tf/awesome-tagless-final)

<https://www.reddit.com/r/scala/comments/s6ih9p/can_you_give_me_a_brief_understanding_on_tagless/>

<https://blog.rockthejvm.com/tagless-final/>

<https://www.baeldung.com/scala/tagless-final-pattern>

<https://scalac.io/blog/tagless-final-pattern-for-scala-code/>

<https://degoes.net/articles/tagless-horror>

<https://www.youtube.com/watch?v=m3Qh-MmWpbM>

## The expression problem


Expression Problem

Philip Wadler named it in 1998: can you add both new cases and new operations to a data type, without modifying or recompiling existing code, and keep static type safety? Each mainstream style makes one direction easy and the other hard:

```text
                  add a case            add an operation
class hierarchy   easy: a new subclass  hard: touch every class
sum type          hard: touch every     easy: a new function
                  match
tagless final     a new algebra trait   a new interpreter
```


Tagless final is one of the known solutions, which is why these links sit next to it. Leduc et al. in *Library sources* generalize the question from data types to extending whole languages.

<https://en.wikipedia.org/wiki/Expression_problem>

<https://eli.thegreenplace.net/2016/the-expression-problem-and-its-solutions/>

<https://eli.thegreenplace.net/2016/on-the-composite-and-interpreter-design-patterns>

## Daniel sentence


These look like the three goals Daniel Ciocîrlan sets out at the start of his Rock the JVM article (linked above):

- where TF comes from
  - from the typed-DSL work in *In brief* (Carette, Kiselyov and Shan), where the aim was to interpret embedded languages without runtime type tags. It became a Scala application-architecture style only later.
- that TF is just an extension of "programming to interfaces"
  - the algebra is the interface and the interpreter is the implementation. The one addition is that the interface is also abstract in the effect `F`, so the same program can run as `IO`, as `Either` or as a pure test.
- that TF is not the same concept as `F[_]` + type classes, but only similar in representation
  - in Scala, TF is usually *written* with `F[_]` and constraints like `F[_]: Monad`, so the two get conflated. But you can have `F[_]` and type classes without TF (generic code over any `Monad`), and TF without making the algebra a type class (pass it as an ordinary parameter, as `transfer` does with `Accounts` in *In brief*). `F[_]: Monad` is only how Scala says "the interpreter's result type supports sequencing". Volpe makes the same point (see *In practice*).

## Library sources


- [Granin 2025](/sources/1c38a03f85e649d3dcd0ebb0dbcbe9ea.bin), *Functional Design and Architecture* -- section 13.2.6, "Final tagless/mtl", on the coupling of business logic and instances and on constraint lists that mix domain effects with domain-agnostic ones such as logging; section 15.2.5, "Testability of different approaches", which calls final tagless/mtl the worst of the dependency-injection approaches for testability because its injection is type-based, and table 15.1, which rates it low beside ReaderT and the service handle, with free monads best; on *Two critiques*
- [Volpe 2021](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), *Practical FP in Scala, 2nd Edition* -- chapter 2, "Tagless final encoding": algebras, programs and interpreters, least power, implicit and explicit parameters, parametricity; chapter 1 on monad transformers in interfaces; on *In practice*
- [De Goes et al. 2025](/sources/4115845a430bc3f50ff12c191a45fd53.bin), *Zionomicon* -- chapter 0, on "The Death of Finally Tagless" and the environment type as the alternative; on *Two critiques*
- [Carette et al. 2009](/sources/8438a472517b14d83c46797890285d8c.bin), *Finally Tagless, Partially Evaluated: Tagless Staged Interpreters for Simpler Typed Languages* -- the paper that introduced the tagless final encoding of typed embedded languages; section 1.3 on final encodings as typed folds; on *In brief* and *Daniel sentence*
- [Leduc et al. 2019](/sources/a33101ab492d5054bb69f20326bc8df2.bin), *The Software Language Extension Problem* -- generalizes the expression problem to extending whole languages; on *The expression problem*
- [Serrano Mena 2021](/sources/4f6f84b5680da34841126999b31e2ed3.bin), *Book of Monads, 2nd Edition* -- chapter 13, "Defining Custom Monads", with section 13.1.1 on algebra (syntax) and interpreters (semantics), section 13.1.2 on restrictive monads such as a file-system-only `FS`, and section 13.2, "Final Style", which names it final tagless or object algebras, compares it with mtl, weighs making `Monad` a superclass of the algebra against a separate constraint, and interprets `FS` both in `IO` and in a `State` mock; section 14.1 on composing final-style algebras by listing their constraints; on *In brief* and *In practice*
- [Gibbons et al. 2014](/sources/55e41880192e3803ac43c73f98018799.bin), *Folding Domain-Specific Languages: Deep and Shallow Embeddings* -- section 2, "Embedding DSLs", on why a deep embedding makes new observers easy and new constructs hard and a shallow one the reverse, which is the expression problem, and on deep and shallow having been called initial and final although both are initial algebras; sections 4.4, "Parametrized interpretations", and 4.5, "Implicitly parametrized interpretations", on a shallow embedding parameterised by an algebra passed explicitly, or implicitly as a type class whose dictionary is that algebra (the tagless-final style); section 5 relates this to Carette et al.; on *The expression problem*, *Daniel sentence* and *In brief*

Further reading:

- Gibbons and de Moor 2003, *The Fun of Programming* -- chapter 12, Hinze, "Fun with phantom types", section 12.1, "Introducing phantom types", a typed initial encoding (a GADT-style `Term t`) whose interpreter is also tag-free; on *In brief*
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 11.4.2, "Example: Representing arithmetic expressions with GADTs", a typed initial encoding as a GADT `Expr a` whose `myeval :: Expr a -> a` needs no runtime tags, at the cost of an existential `SomeExpr` when parsing, the GADT alternative to the final encoding; on *In brief*
- [Mokhov et al. 2020](/sources/968bcf5644f3dbb1736d59b47f1717c1.bin), *Build Systems a la Carte: Theory and Practice* -- section 3.2, "The Task Abstraction", writes a build task as a function polymorphic in its functor under a constraint `c`; section 3.4, "The Need for Polymorphism in Task", shows each build system choosing a different functor for the same task, with the constraint classifying tasks (`Applicative` for static dependencies, `Monad` for dynamic ones); section 3.7, "Computing Dependencies", runs an applicative task in `Const` to list its dependencies without running it, a concrete payoff of asking for the least powerful constraint; on *In practice*
- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell* -- chapter 13, "Building Applications with Many Effects", subsection "Tagless Final Encoding", on mtl style as tagless final over monad transformers, with the trade-off against direct style: flexibility, dependency injection and test stacks, against losing control over which effects run, worse error messages and longer compile times; on *In brief*
