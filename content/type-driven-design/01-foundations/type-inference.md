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
- Full inference for System F, the polymorphic lambda calculus behind higher-rank types, is undecidable (Wells 1994; Pierce section 23.6 "Erasure, Typability, and Type Reconstruction"). That's why Haskell and Scala ask for annotations on higher-rank and polymorphic-recursive functions.
- Type families make inference harder, and Bragilevsky ([PDF](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), section 11.6.1) advises explicit signatures, local ones too, to guide it.
- Refinement types have the same problem. Liquid Types ([PDF](/sources/c1ee665591c2e20039979587673830e7.bin)) keeps inference possible by restricting refinements to combinations of programmer-supplied predicates ("qualifiers"), which cut manual annotation in their benchmarks from 31% of the program text to under 1%.

So language designers trade expressiveness against inference, and the boundary between the two is where annotations become mandatory.

## Library sources


- [Pierce 2002](/sources/61c011d4c2037767a1b6df1b6fde20de.bin), *Types and Programming Languages* -- section 23.6, "Erasure, Typability, and Type Reconstruction", on undecidable inference for System F
- [Rondon et al. 2008](/sources/c1ee665591c2e20039979587673830e7.bin), *Liquid Types* -- inference of refinement types from programmer-supplied qualifiers, and the drop in manual annotation
- [Bragilevsky 2021](/sources/ffe3ac8b34a3561966d61969ca73f474.bin), *Haskell in Depth* -- section 11.5.1, "The meaning": RankNTypes makes inference impossible in general, so top-level signatures are required; section 11.6.1, "Be explicit about types": explicit types, local ones too, guide inference "particularly in the presence of type families"; on the System F and type-family bullets
- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles* -- section 5.6, "Type inference": Haskell infers the most general type on an extended Damas-Hindley-Milner system, and declaring the types of finished code is still good practice; on the Hindley-Milner bullet
