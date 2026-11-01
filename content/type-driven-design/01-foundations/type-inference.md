---
draft: false
toc: true
title: "Type Inference"
description: "Type inference as ergonomics rather than a guarantee: what inference saves, where it stops (System F, type families, refinement qualifiers), and why signatures are still worth writing."
linkTitle: "Type Inference"
---

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
- Full inference for System F, the polymorphic lambda calculus behind higher-rank types, is undecidable (Wells 1994; Pierce, [PDF](/sources/61c011d4c2037767a1b6df1b6fde20de.bin), section 23.6 "Erasure, Typability, and Type Reconstruction"). That's why Haskell and Scala ask for annotations on higher-rank and polymorphic-recursive functions.
- Type families and multi-parameter type classes make inference harder because a type function isn't injective in general (knowing `F a` doesn't tell the checker `a`) and unconstrained class parameters leave intermediate types ambiguous unless functional dependencies or `TypeFamilyDependencies` declare which parameters determine which (Parsons, [PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), chapter 22 "Trade-offs in Type Programming"). Bragilevsky ([PDF](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), section 11.6.1) advises explicit signatures, local ones too, to guide it.
- Refinement types have the same problem. Liquid Types ([PDF](/sources/c1ee665591c2e20039979587673830e7.bin)) keeps inference possible by restricting refinements to combinations of programmer-supplied predicates ("qualifiers"), which cut manual annotation in their benchmarks from 31% of the program text to under 1%.

So language designers trade expressiveness against inference, and the boundary between the two is where annotations become mandatory.

Even where inference succeeds, top-level signatures remain worth writing. When unification fails in an unannotated program, the conflicting constraints come from several places at once, so the checker can report only that the uses disagree, not which one broke your intent (Krishnamurthi, [PDF](/sources/175c9cb05c2ba00aa61a8b4132dd630e.bin), "Type Inference"; Scott and Aldrich, PDF, section 7.4.1, Sidebar 7.8). Explicit signatures pin down what you meant, localize errors, and document module boundaries without exposing function bodies (Thompson, [PDF](/sources/cc601a3f46c1bd0a06f4ab71aeb8da53.bin), section 13.5). Most mainstream languages strike that balance directly: Rust, Scala, Go, C# and C++ infer local bindings while keeping function signatures explicit (Scott and Aldrich, section 7.2.3).

## Library sources


- [Pierce 2002](/sources/61c011d4c2037767a1b6df1b6fde20de.bin), *Types and Programming Languages* -- chapter 22, "Type Reconstruction" (constraint generation, unification, principal types, and section 22.7 "Let-Polymorphism"), and section 23.6, "Erasure, Typability, and Type Reconstruction", on undecidable inference for System F
- [Rondon et al. 2008](/sources/c1ee665591c2e20039979587673830e7.bin), *Liquid Types* -- sections 1 and 4: inference of refinement types over Hindley-Milner templates from programmer-supplied qualifiers, and the drop in manual annotation from 31% to under 1%
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 11.5.1, "The meaning": RankNTypes makes inference impossible in general, so top-level signatures are required; section 11.6.1, "Be explicit about types": explicit types, local ones too, guide inference "particularly in the presence of type families"; on the System F and type-family bullets
- [Parsons 2023](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), *Production Haskell* -- chapter 22, "Trade-offs in Type Programming": why bare `MultiParamTypeClasses` have poor inference and require intermediate annotations (22.1), and how functional dependencies (22.2) and `TypeFamilyDependencies` on injective type families (22.4) restore directional inference; on the type-family bullet
- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles* -- section 5.6, "Type inference": Haskell infers the most general type on an extended Damas-Hindley-Milner system, and declaring the types of finished code is still good practice; on the Hindley-Milner bullet and writing signatures
- [Krishnamurthi 2025](/sources/175c9cb05c2ba00aa61a8b4132dd630e.bin), *Programming Languages: Application and Interpretation*, version 3 -- "Type Inference": constraint generation and unification, why unannotated type errors can report only inconsistency across multiple sites, and why leaving off all annotations hurts readability; on why signatures remain worth writing
- Scott et al. 2025, *Programming Language Pragmatics, 5th Edition* -- section 7.2.3, "Local Type Inference", and section 7.4.1, "Hindley-Milner Type Inference" (with Sidebar 7.8 on unification error reporting); on local versus Hindley-Milner inference and why annotations localize errors
- [Thompson 2023](/sources/cc601a3f46c1bd0a06f4ab71aeb8da53.bin), *Haskell: The Craft of Functional Programming, 3rd Edition* -- section 13.5, "Type checking and type inference: an overview": three reasons to write explicit type declarations even when Haskell can infer them (documentation, specializing a polymorphic function, and checking your intended type against the definition), plus ambiguity from overloading; on why signatures remain worth writing

Further reading:

- [Urma et al. 2018](/sources/58d1df2acb632c20f823cf03c6224a83.bin), *Modern Java in Action* -- section 21.3, "Java 10 local variable type inference": how `var` extends diamond and lambda-parameter inference to initialized locals, and why good inference must reject ambiguous cases rather than guess between incomparable types; on local inference in mainstream languages
