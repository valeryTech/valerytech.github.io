---
draft: false
toc: true
title: "Type Systems"
linkTitle: "Type Systems"
---
## What a type system is


A useful starting definition comes from Benjamin Pierce ([PDF](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc)): a type system is a tractable syntactic method for proving the absence of certain program behaviors. That framing is much broader than type inference. ([MIT Press](https://mitpress.ublish.com/book/types-and-programming-languages "Types and Programming Languages | The MIT Press"))

The key word is "proving." You can think of a static type checker as a small, deliberately limited theorem prover.

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


Different type systems can prove different sets of properties. Effect systems, session types, units of measure, linear types, refinement types, dependent types, etc. are all extensions of this basic idea. ([UCLA Computer Science](https://web.cs.ucla.edu/~palsberg/tba/papers/nielson-nielson-csd99.pdf "Type and Eﬀect Systems")) ([PDF](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc))

## Dimensions


The terminology varies, so it helps to separate a few dimensions:

- Static vs dynamic: when type errors are checked.
- Strong vs weak: roughly, how much the language prevents implicit or unsafe mixing of incompatible values. This term isn't formally consistent across languages.
- Inferred vs explicit: whether you have to write the types yourself.
- Expressive vs simple: how precisely the type system can describe valid programs.

And "strong typing" itself isn't necessarily the key property. Python, for example, is often described as strongly typed, but its checks happen mostly at runtime. Haskell, Rust, OCaml, Swift, Kotlin, and TypeScript occupy quite different points in this design space.

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


communicates much more than something returning a generic string or nullable object. The type tells you what can happen.

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

7. Better tooling. Types power autocomplete, go-to-definition, safe rename, code navigation, signature help, and static analysis. IDEs don't have to guess as much.
8. Fewer defensive runtime checks. If the compiler has proved something, downstream code doesn't need to repeatedly validate it. You move some correctness work from runtime into compile time.
9. Better boundaries between components. Types can express ownership, mutability, effects, capabilities, units, protocol states, and so on. Rust's ownership system is a strong example: the type system helps prevent use-after-free and data races.

For large software systems, the main practical benefits are safer refactoring, making illegal states harder to express, and turning implicit assumptions into machine-checked interfaces.

In Scala terms:

**In Scala, we use types to ensure correctness,** and we do it by encoding code invariants in the types and relationships between types. **The compiler enforces those invariants,** guaranteeing our programs are free of certain error categories.

We pay the price for these guarantees; the compiler makes some programs a bit harder to write.

## Type inference is ergonomics


Type inference is a convenience feature. It is largely independent of how "strong" or expressive a type system is.

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

## Types, runtime checks, and tests


Types, runtime checks, and tests handle program assumptions in complementary ways:

```text
                     Program assumptions
                            │
          ┌─────────────────┼──────────────────┐
          ▼                 ▼                  ▼
       Types             Runtime             Tests
          │               checks               │
          │                 │                  │
     prove broadly      check current       sample actual
     and statically       reality            executions
```


They're complementary.

Each covers a gap the others leave:

- **Types** say something about *every* run, but only properties the type language can express, and only about code the checker sees.
- **Runtime checks** handle what the code can't know in advance: input from outside. They're exact, but only about the value in front of them, at that moment.
- **Tests** run real code on chosen inputs. They can check anything you can compute (that a list is sorted, that totals add up), but only for the cases someone thought of.

An analogy from building: the plan review (types) rules out whole classes of mistakes before anything is built; the inspector at the loading dock (runtime checks) examines each delivery as it arrives; the fire drill (tests) shows that particular scenarios work. [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}) is how the second feeds the first: check once at the boundary, then let the type carry the result.

## Types as propositions


There's a deeper theoretical basis for treating types as evidence. Under the Curry-Howard correspondence, types correspond to propositions and programs correspond to proofs. For example, function types, product types, and sum types correspond to logical implication, conjunction, and disjunction. Wadler gives a good overview in "Propositions as Types" ([PDF](/sources/programming/language-theory/wadler-2015-propositions-as-types.pdf.enc)). ([Edinburgh Research](https://www.research.ed.ac.uk/en/publications/propositions-as-types/ "Propositions as Types - University of Edinburgh Research Explorer"))

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


This explains why algebraic data types can feel like designing a little logic for your application.

A caveat: in most languages the logic is inconsistent, because every type has a cheating inhabitant. `null`, a thrown exception, an infinite loop or Haskell's `undefined` can stand in for a value of any type, so a function of type `A -> B` proves `A implies B` only if it doesn't cheat. Only total languages (Agda, Idris with totality checking, Rocq) make the correspondence exact. In Haskell, Scala or TypeScript, read a type as strong evidence, not a proof.

## Library sources


- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages* -- on Pierce's definition in *What a type system is*
- [Nielson et al. 1999](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc), *Type and Effect Systems* -- the paper cited by URL where effect systems are listed as an extension of the basic idea, in *What a type system is*
- [Milewski 2019](/sources/programming/category-theory/milewski-2019-category-theory-for-programmers-scala-edition.pdf.enc), *Category Theory for Programmers, Scala Edition* -- chapters on products, coproducts and algebraic data types; on *Types as propositions*
- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages, 2nd Edition* -- Part V, "Types and Propositions" (constructive and classical logic), and Part III on total functions; on *Types as propositions* and its caveat about total languages
- [Wadler 2015](/sources/programming/language-theory/wadler-2015-propositions-as-types.pdf.enc), *Propositions as Types* -- the Curry-Howard correspondence told through its history and natural deduction; the paper cited by URL in *Types as propositions*

Further reading:

- [Krishnamurthi 2025](/sources/programming/language-theory/krishnamurthi-2025-programming-languages-application-interpretation-v3.pdf.enc), *Programming Languages: Application and Interpretation*, version 3
- Scott et al. 2025, *Programming Language Pragmatics, 5th Edition*
- [Pretnar 2015](/sources/ai-engineering/harness/pretnar-2015-introduction-to-algebraic-effects-and-handlers.pdf.enc), *An Introduction to Algebraic Effects and Handlers*
