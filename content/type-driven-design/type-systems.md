---
draft: false
toc: true
title: "Type Systems"
description: "What a type system is, starting from Pierce's definition: the dimensions along which type systems differ, what they buy, type inference as ergonomics, and types as propositions."
linkTitle: "Type Systems"
---
## What a type system is


A useful starting definition comes from Benjamin Pierce ([PDF](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc)): a type system is a tractable syntactic method for proving the absence of certain program behaviors by classifying phrases according to the kinds of values they compute. That framing is much broader than type inference. ([MIT Press](https://mitpress.ublish.com/book/types-and-programming-languages "Types and Programming Languages | The MIT Press"))

Each part of the definition does work:

- **Tractable**: the checker has to finish, and quickly enough to run on every build. That rules out asking it to decide arbitrary facts about programs.
- **Syntactic**: it works on the program text, before the program runs, by looking at how the pieces are put together.
- **Classifying phrases by the values they compute**: a type is a static approximation of what an expression will produce at run time, and the approximation is compositional: the type of `f(x)` follows from the types of `f` and `x`.
- **The absence of certain behaviors**: each language chooses which bad behaviors its type system rules out. Calling a number as a function is on almost every list; dividing by zero and indexing out of bounds are on almost none.

The key word is "proving." You can think of a static type checker as a small, deliberately limited theorem prover. Pierce makes the comparison himself: with enough annotations, a type checker turns into a proof checker.

Two consequences follow:

- **The checker is conservative.** Because it proves things before the program runs, it must sometimes reject programs that would behave well. Pierce's example is `if <complex test> then 5 else <type error>`: the checker rejects it even when the test is always true, because it can't know that. Every type system lives with this tension between conservativity and expressiveness: a more expressive system rejects fewer good programs, but is harder to check and to use.
- **"Proving" has a precise meaning: soundness.** Krishnamurthi's statement of it ([PDF](/sources/programming/language-theory/krishnamurthi-2025-programming-languages-application-interpretation-v3.pdf.enc), "Soundness") is: if `e : t`, and `e` evaluates to a value `v`, then `v : t`. The checker's prediction holds. The stronger version, that the checker accepts *exactly* the programs that behave well, is impossible for a Turing-complete language (Rice's theorem), which is the formal reason for the conservativity above.

For example:

```text
UserId != OrderId
```


is a property you might ask the compiler to prove.

So are:

```text
value is present
state is one of Loading | Ready | Failed
all cases were handled
meters aren't added to seconds
this resource hasn't already been consumed
this function doesn't perform IO
this channel follows protocol P
this integer is between 0 and len(xs)-1
```


Different type systems can prove different sets of properties. Effect systems, session types, units of measure, linear types, refinement types, dependent types, etc. are all extensions of this basic idea. ([UCLA Computer Science](https://web.cs.ucla.edu/~palsberg/tba/papers/nielson-nielson-csd99.pdf "Type and Eﬀect Systems")) ([PDF](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc)) Which of these properties are worth encoding in a given program is the subject of [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}).

## Dimensions


The terminology varies, so it helps to separate a few dimensions:

- Static vs dynamic: when type errors are checked.
- Safe vs unsafe: whether the language protects its own abstractions. This is the useful core of "strong vs weak".
- Nominal vs structural: whether two types are the same because of their names or because of their shape.
- Inferred vs explicit: whether you have to write the types yourself.
- Expressive vs simple: how precisely the type system can describe valid programs.

And "strong typing" itself isn't necessarily the key property. Python, for example, is often described as strongly typed, but its checks happen mostly at runtime. Haskell, Rust, OCaml, Swift, Kotlin, and TypeScript occupy quite different points in this design space.

### Static, dynamic and gradual checking


Pierce suggests that "dynamically typed" should really be "dynamically checked": a dynamic language has run-time tags that distinguish a string from a number, but no types in his sense, since nothing is proved before the program runs. Harper ([PDF](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), section 21.4 "Untyped Means Uni-Typed" and chapter 22 "Dynamic Typing") goes further: a dynamic language is a static language with exactly one type, every value belongs to it, and the operations check the tags at run time. On that reading the usual opposition between static and dynamic typing is illusory; it's a question of how many types the checker distinguishes.

Kleppmann ([PDF](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), chapter 3, "Schema flexibility in the document model") makes the same comparison for databases. A "schemaless" document store still has a schema, but it's implicit in the code that reads the data (schema-on-read), as opposed to enforced when data is written (schema-on-write). Schema-on-read is like dynamic checking and schema-on-write like static checking, and he calls neither a clear winner. The cost of schema-on-read is that every reader has to handle every old format ever written.

**Gradual typing** mixes the two in one program. In Siek and Taha's original design ([PDF](/sources/programming/language-theory/siek-2006-gradual-typing-for-functional-languages.pdf.enc)), an unknown type `?` marks the dynamic parts. A fully annotated program catches all type errors at compile time, and where typed and untyped code meet, the compiler inserts casts, so a program fails with a cast error at the boundary rather than with a type error deep inside typed code. The dynamic parts cost only where they're used ("pay-as-you-go").

Krishnamurthi ("Gradual Typing") separates two schools:

- **Micro gradual typing** lets you annotate any subset of variables, as in Python and TypeScript. It's convenient, but it's unclear what soundness means once typed and untyped code mix within a single expression.
- **Macro gradual typing** has a typed and an untyped sibling language that share a runtime, as in Typed Racket. Values are checked when they cross between modules, which gives a clear guarantee and blame for whoever broke it.

In practice the familiar gradual languages are micro and *erased*. Python's type hints, Ramalho points out ([PDF](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), chapter 8, "About Gradual Typing"), don't catch type errors at runtime and don't make code faster: they're read by external checkers, linters and IDEs, and ignored by the interpreter. TypeScript erases its types the same way. So a value annotated `int` can still arrive as a string from an untyped caller or from JSON. That's one reason [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) matters more, not less, in these languages: the boundary check is the only check that actually runs.

### Safety, and what "strong" means


Pierce's definition of a safe language is one that protects its own abstractions: you can't read past the end of an array, forge a pointer, or treat a closure as an integer. Safety is a separate question from when checking happens:

```text
                 statically checked        dynamically checked
safe             ML, Haskell, Java         Lisp, Scheme, Python
unsafe           C, C++
```


(Pierce's table, with Python in place of Perl and PostScript.) The empty corner is empty because once a language checks some operations at run time, checking all of them costs little.

"Strong typing" is usually a loose name for the safe row. Sebesta ([PDF](/sources/programming/language-theory/sebesta-2019-concepts-of-programming-languages-12e.pdf.enc), section 6.14 "Strong Typing") gives a precise version: a language is strongly typed if type errors are always detected, at compile time or run time. By that test C and C++ aren't strongly typed, because their unions aren't checked, and implicit coercions (`"5" + 1` in JavaScript) weaken a language because they turn would-be type errors into silent conversions.

### Nominal and structural equivalence


When are two types the same? Sebesta (section 6.15 "Type Equivalence") gives the two standard answers:

- **Name equivalence**: two types are the same only if they have the same name. A `Celsius` and a `Fahrenheit` that both wrap a float are different types, and mixing them is an error.
- **Structure equivalence**: two types are the same if they have the same shape. `Celsius` and `Fahrenheit` would be interchangeable, which is exactly the bug you wanted to prevent.

Every newtype in this section relies on name equivalence. Sebesta's examples show how old the idea is: Ada's derived type `type Celsius is new Float` is a newtype, and Ada's `subtype Small is Integer range 0..99` is a range-constrained type checked at run time, an early relative of [refinement types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}). C's `typedef` is the counterexample: it creates only an alias, so it gives no protection.

Pierce (section 19.3 "Nominal and Structural Type Systems") adds a practical reason most mainstream languages are nominal: the type names double as run-time tags, which makes casts, `instanceof` and pattern matching cheap. Structural systems are more flexible and closer to the mathematics. Ramalho (chapter 13, "The Typing Map") lays out the whole space as a grid:

```text
                  structural                      nominal
runtime check     duck typing                     goose typing
                  (any object with .quack())      (isinstance against an ABC)
static check      static duck typing              static typing
                  (typing.Protocol, Go interfaces) (classes and declared interfaces)
```


Scala supports both, with nominal as the default; see [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}}#nominal-and-structural-subtyping).

## Benefits


The main benefits of a strong, expressive static type system are:

1. Catching invalid programs early. The compiler can reject things like passing a `UserId` where an `OrderId` is expected, forgetting to handle a case, returning `null` where null isn't allowed, or calling an operation on a value that can't support it.
2. Encoding invariants in types. Good types can make invalid states hard or impossible to represent. For example:

```ts
type Result<T, E> =
  | { kind: "ok"; value: T }
  | { kind: "error"; error: E };
```


Now callers must deal with success and failure explicitly.

Languages with algebraic data types, refinement types, dependent types, etc. can push this much further.

3. Safer refactoring. If you change an API, rename a field, split a variant, or change a function signature, the compiler gives you a list of affected code. In a large codebase, this is one of the biggest practical benefits.
4. Better API design. A function like:

```haskell
parseUserId :: Text -> Either ParseError UserId
```


communicates much more than something returning a generic string or nullable object. The type tells you what can happen. Pierce's version of this point is that a type signature is documentation that can't go out of date, because the compiler checks it on every build, unlike a comment.

5. Local reasoning. You can understand code without knowing every possible runtime value. If something is `NonEmpty<User>`, you don't need to defensively check whether it's empty everywhere downstream.
6. Exhaustiveness checking. With enums/sealed types/discriminated unions:

```rust
match state {
    State::Loading => ...,
    State::Ready(x) => ...,
    State::Failed(e) => ...,
}
```


adding a new `State` variant can make all incomplete matches fail compilation. That's extremely useful when software evolves.

A catch-all branch (`_ => ...`) switches this off for that match. *The Pragmatic Programmer* ([PDF](/sources/software-engineering/craft/thomas-2020-pragmatic-programmer-2nd-edition.pdf.enc), Topic 24 "Dead Programs Tell No Lies") advises putting a default clause in every switch, so that the "impossible" case is caught. That's right for a language that can't check exhaustiveness, but in one that can, a default throws away the check that would have listed every place to update. There, prefer naming every case.

7. Better tooling. Types power autocomplete, go-to-definition, safe rename, code navigation, signature help, and static analysis. IDEs don't have to guess as much.
8. Fewer defensive runtime checks. If the compiler has proved something, downstream code doesn't need to repeatedly validate it. You move some correctness work from runtime into compile time.
9. Better boundaries between components. Types can express ownership, mutability, effects, capabilities, units, protocol states, and so on. Rust's ownership system is a strong example: the type system helps prevent use-after-free and data races. Pierce calls this abstraction: the type of a module is its interface, and the checker makes sure clients use nothing else.
10. Efficiency. This was the first use of types (Fortran distinguished integer from floating-point arithmetic). A compiler that knows a value is an `i32` can store it unboxed and skip run-time tag checks, and Rondon et al. ([PDF](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc)) use refinement types to remove array bounds checks.

For large software systems, the main practical benefits are safer refactoring, making illegal states harder to express, and turning implicit assumptions into machine-checked interfaces.

The counterweight is conservativity again: the checker rejects some correct programs, and the workarounds (casts, `Any`, `as unknown as T`) switch checking off locally. Ramalho (chapter 8, "Imperfect Typing and Strong Testing") adds that type checkers report both false positives and false negatives, and that type hints say little about errors in business logic, so they complement tests rather than replace them. What each kind of check is good for is in [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}#types-contracts-runtime-checks-and-tests).

## Type inference is ergonomics


Type inference is a convenience feature. For everyday type systems it's largely independent of how "strong" or expressive the system is, though not entirely: see the limits below.

Type inference helps with a different problem: ergonomics.

For example:

```rust
let xs = vec![1, 2, 3];
```


The compiler infers `Vec<i32>`. You get static guarantees without writing `Vec<i32>` yourself.

In fact, some of the most powerful type systems rely heavily on inference because otherwise writing all the types would become painful.

A useful mental model is:

> Type inference reduces the cost of using a type system.
> Type expressiveness increases what the type system can prove.

Type inference sits underneath an expressive type system as an ergonomics mechanism:

```text
expressive type system
        +
type inference
        ↓
many properties proved
without writing every proof/type explicitly
```


It doesn't define what the compiler proves. It reduces how much work you have to do to make those proofs possible.

The two aren't fully independent, though. The more a type system can express, the harder inference gets, and past a point it becomes impossible:

- Hindley-Milner (ML, Haskell 98) infers every type without annotations, which is why it's the standard example.
- Full inference for System F, the polymorphic lambda calculus behind higher-rank types, is undecidable (Wells 1994; Pierce section 23.6 "Erasure, Typability, and Type Reconstruction"). That's why Haskell and Scala ask for annotations on higher-rank and polymorphic-recursive functions.
- Once type families and GADTs are involved, GHC often can't infer a type at all, and Bragilevsky ([PDF](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), section 11.6.1) advises being explicit about types.
- Refinement types have the same problem. Liquid Types ([PDF](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc)) keeps inference possible by restricting refinements to combinations of programmer-supplied predicates ("qualifiers"), which cut manual annotation in their benchmarks from 31% of the program text to under 1%.

So language designers trade expressiveness against inference, and the boundary between the two is where annotations become mandatory.

## Types as propositions


There's a deeper theoretical basis for treating types as evidence. Under the Curry-Howard correspondence, types correspond to propositions and programs correspond to proofs. For example, function types, product types, and sum types correspond to logical implication, conjunction, and disjunction. Wadler gives a good overview in "Propositions as Types" ([PDF](/sources/programming/language-theory/wadler-2015-propositions-as-types.pdf.enc)). ([Edinburgh Research](https://www.research.ed.ac.uk/en/publications/propositions-as-types/ "Propositions as Types - University of Edinburgh Research Explorer"))

Wadler describes the correspondence at three levels: propositions as types, proofs as programs, and simplification of proofs as evaluation of programs. Pierce (section 9.4 "The Curry-Howard Correspondence") gives the working version: a proposition is provable exactly when its type has a value (is inhabited).

So:

```text
A -> B
```


can be read informally as:

```text
given evidence of A,
I can produce evidence of B
```


and

```text
Result<A, B>
```


roughly corresponds to:

```text
A OR B
```


The "roughly" matters. In the constructive logic behind the correspondence, a proof of A OR B has to say which of the two it proves, and `Result` does: it's a tagged sum, and the tag (`Ok` or `Err`) is that indication. An untagged union such as TypeScript's `string | number` records less; Pierce (section 15.7 "Intersection and Union Types") notes that `Nat ∨ Nat` is just `Nat`, so the union can't tell you which side you have.

The rest of logic has counterparts too (Wadler, sections 3 and 5):

| Logic | Types |
|---|---|
| true | unit type `()` |
| false | empty type (`Void`, `Nothing`, `never`) |
| A AND B | pair, record |
| A OR B | tagged sum |
| A implies B | function |
| for all x | polymorphism over types; over values, dependent function types |
| there exists x | existential types; over values, dependent pairs |
| use exactly once (linear logic) | linear types, session types |

Two rows explain things elsewhere in this section. Existential types correspond to data abstraction (Mitchell and Plotkin): a module that hides its representation says "there exists a type `T` with these operations", which is what an opaque type with a smart constructor does ([Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#primitive-obsession-and-the-newtype-pattern)). And quantifying over values is where dependent types begin ([Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}#towards-dependent-types)).

This explains why algebraic data types can feel like designing a little logic for your application.

A caveat: in most languages the logic is inconsistent, because every type has a cheating inhabitant. `null`, a thrown exception, an infinite loop or Haskell's `undefined` can stand in for a value of any type, so a function of type `A -> B` proves `A implies B` only if it doesn't cheat. Wadler puts the trade-off in terms of the halting problem: a typed lambda calculus without general recursion is a consistent logic in which every program halts, and adding a fixpoint operator gives you all computable functions but loses the logic. Only total languages (Agda, Idris with totality checking, Rocq) make the correspondence exact. In Haskell, Scala or TypeScript, read a type as strong evidence, not a proof. The explicit escape hatches belong on the same list: a `cast` or `asInstanceOf` is a proof by assertion, and Ramalho notes that checkers believe `typing.cast` without question.

## Library sources


- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages* -- section 1.1 for the definition and conservativity, section 1.2 for language safety and the benefits list, section 9.4 for Curry-Howard, section 15.7 on untagged unions, section 19.3 on nominal and structural systems, section 23.6 on undecidable inference; on *What a type system is*, *Dimensions*, *Benefits*, *Type inference is ergonomics* and *Types as propositions*
- [Krishnamurthi 2025](/sources/programming/language-theory/krishnamurthi-2025-programming-languages-application-interpretation-v3.pdf.enc), *Programming Languages: Application and Interpretation*, version 3 -- "Soundness" (the one-directional guarantee and Rice's theorem) and "Gradual Typing" (micro and macro); on *What a type system is* and *Static, dynamic and gradual checking*
- [Sebesta 2019](/sources/programming/language-theory/sebesta-2019-concepts-of-programming-languages-12e.pdf.enc), *Concepts of Programming Languages, 12th Edition* -- section 6.14 "Strong Typing" and section 6.15 "Type Equivalence" (name and structure equivalence, Ada derived types and subtypes); on *Safety, and what "strong" means* and *Nominal and structural equivalence*
- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages, 2nd Edition* -- section 21.4 "Untyped Means Uni-Typed" and chapter 22 "Dynamic Typing"; Part V, "Types and Propositions", and Part III on total functions; on *Static, dynamic and gradual checking* and *Types as propositions*
- [Siek et al. 2006](/sources/programming/language-theory/siek-2006-gradual-typing-for-functional-languages.pdf.enc), *Gradual Typing for Functional Languages* -- the unknown type, consistency instead of equality, casts at the typed-untyped boundary; on *Static, dynamic and gradual checking*
- [Ramalho 2022](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), *Fluent Python, 2nd Edition* -- chapter 8, "About Gradual Typing" and "Imperfect Typing and Strong Testing"; chapter 13, "The Typing Map"; on *Static, dynamic and gradual checking*, *Nominal and structural equivalence* and *Benefits*
- [Kleppmann et al. 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, 2nd Edition* -- chapter 3, "Schema flexibility in the document model": schema-on-read and schema-on-write as dynamic and static checking; on *Static, dynamic and gradual checking*
- [Wadler 2015](/sources/programming/language-theory/wadler-2015-propositions-as-types.pdf.enc), *Propositions as Types* -- the Curry-Howard correspondence told through its history and natural deduction, including quantifiers, data abstraction and linear logic; on *Types as propositions*
- [Rondon et al. 2008](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc), *Liquid Types* -- inference of refinement types from qualifiers; on *Type inference is ergonomics* and the efficiency benefit
- [Nielson et al. 1999](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc), *Type and Effect Systems* -- the paper cited by URL where effect systems are listed as an extension of the basic idea, in *What a type system is*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers, Scala Edition* -- chapters on products, coproducts and algebraic data types; on *Types as propositions*
- [Thomas et al. 2020](/sources/software-engineering/craft/thomas-2020-pragmatic-programmer-2nd-edition.pdf.enc), *The Pragmatic Programmer, 2nd Edition* -- Topic 24, "Dead Programs Tell No Lies", on default clauses; on exhaustiveness in *Benefits*

Further reading:

- Scott et al. 2025, *Programming Language Pragmatics, 5th Edition*
- [Pretnar 2015](/sources/ai-engineering/harness/pretnar-2015-introduction-to-algebraic-effects-and-handlers.pdf.enc), *An Introduction to Algebraic Effects and Handlers*
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth*
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types: Type-Level Programming in Haskell*
