---
draft: false
toc: true
title: "Type-Driven Design: Stronger Type Systems"
description: "Type systems that say more than ordinary ones: refinement types and how they are checked, what each language offers, the step to dependent types, and the Scala type system's features for correctness."
weight: "50"
linkTitle: "Stronger Type Systems"
---
# Stronger type systems


Type systems that can state more than ordinary static types: predicates checked by a solver, types that depend on values, and Scala's richer type features. Part of [Type-driven design]({{< ref "type-driven-design" >}}).

- [Refinement types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}): what they are, why bother, how SMT-based checking and Liquid inference work, and their limits.
- [Refinement types by language]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types-by-language" >}}): Python, TypeScript, Haskell, Rust, Ada and Scala, and Scala's terminology trap.
- [Towards dependent types]({{< ref "type-driven-design/05-stronger-type-systems/dependent-types" >}}): the progression from ordinary to dependent types, and the two senses of "dependent".
- [Scala type system]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}): abstract types and the currency case study, nominal and structural subtyping, union and intersection types, path-dependent types, type tags, multiversal equality, and encoding contracts.
