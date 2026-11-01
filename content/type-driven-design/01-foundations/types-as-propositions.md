---
draft: false
toc: true
title: "Types as Propositions"
description: "The Curry-Howard reading of types: types as propositions and programs as proofs, what it means for ordinary code, and how far each kind of type system takes it."
linkTitle: "Types as Propositions"
---

There's a deeper theoretical basis for treating types as evidence. Under the Curry-Howard correspondence, types correspond to propositions and programs correspond to proofs. For example, function types, product types, and sum types correspond to logical implication, conjunction, and disjunction. Wadler gives a good overview in "Propositions as Types" ([PDF](/sources/e73a714dde09d48962f58768e5bd200a.bin)). ([Edinburgh Research](https://www.research.ed.ac.uk/en/publications/propositions-as-types/ "Propositions as Types - University of Edinburgh Research Explorer"))

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

Two rows explain things elsewhere in this section. Existential types correspond to data abstraction (Mitchell and Plotkin): a module that hides its representation says "there exists a type `T` with these operations", which is what an opaque type with a smart constructor does ([Newtypes And Simple Values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}#primitive-obsession-and-the-newtype-pattern)). And quantifying over values is where dependent types begin ([Dependent Types]({{< ref "type-driven-design/05-stronger-type-systems/dependent-types" >}})).

This explains why algebraic data types can feel like designing a little logic for your application.

A caveat: in most languages the logic is inconsistent, because every type has a cheating inhabitant. `null`, a thrown exception, an infinite loop or Haskell's `undefined` can stand in for a value of any type, so a function of type `A -> B` proves `A implies B` only if it doesn't cheat. Wadler puts the trade-off in terms of the halting problem: a typed lambda calculus without general recursion is a consistent logic in which every program halts, and adding a fixpoint operator gives you all computable functions but loses the logic. Only total languages (Agda, Idris with totality checking, Rocq) make the correspondence exact. In Haskell, Scala or TypeScript, read a type as strong evidence, not a proof. The explicit escape hatches belong on the same list: a `cast` or `asInstanceOf` is a proof by assertion, and Ramalho notes that checkers believe `typing.cast` without question.

## Library sources


- [Wadler 2015](/sources/e73a714dde09d48962f58768e5bd200a.bin), *Propositions as Types* -- the Curry-Howard correspondence told through its history and natural deduction, including quantifiers, data abstraction and linear logic, and the trade-off between general recursion and a consistent logic
- [Pierce 2002](/sources/61c011d4c2037767a1b6df1b6fde20de.bin), *Types and Programming Languages* -- section 9.4, "The Curry-Howard Correspondence"; section 15.7 on untagged unions
- [Harper 2016](/sources/844b46f25205adfc27e60dec253a34fc.bin), *Practical Foundations for Programming Languages, 2nd Edition* -- Part V, "Types and Propositions", and Part III on total functions
- [Milewski 2019](/sources/0e04926a1bcff6dccfd4b9a974acdff4.bin), *Category Theory for Programmers, Scala Edition* -- chapters on products, coproducts and algebraic data types
- [Ramalho 2022](/sources/c09d057b50eb8836ae7e40220e951a83.bin), *Fluent Python, 2nd Edition* -- chapter 15, "More About Type Hints": `typing.cast` as an assertion the checker believes
- [Maguire 2018](/sources/405eaf932837c8349209bea8675e06e4.bin), *Thinking with Types: Type-Level Programming in Haskell* -- section 1.4, "The Curry-Howard Isomorphism": a table matching `Either`, pairs, functions, `Void` and `()` with disjunction, conjunction, implication, false and true; section 15.5, "Dependent Pairs": Σ types as the existential quantifier; on the table of logic and types

Further reading:

- Bird 1998, *Introduction to Functional Programming using Haskell (2nd edition)* -- section 1.3, "Values": every type has an undefined value ⊥ ("bottom"), the value of a non-terminating definition such as `infinity = infinity + 1`; on the caveat that `undefined` or an infinite loop inhabits any type
