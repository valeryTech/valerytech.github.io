---
draft: false
toc: true
title: "Type-Driven Design: Architecture"
description: "Organising a typed domain into a program: functional domain modeling with algebras and interpreters, ways to wire them (Reader, tagless final, free monads, ZIO, algebraic effects), and declarative design."
weight: "40"
linkTitle: "Architecture"
---
# Architecture


How a typed domain becomes a program: domain behaviour described as algebras, interpreters supplied for them, and effects kept at the edges. Part of [Type-driven design]({{< ref "type-driven-design" >}}).

- [Functional domain modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}): Ghosh's principles, keeping effects out of the domain, modules as algebras with laws, composing effectful operations, commands and events, and bounded contexts.
- [Effects, interpreters and wiring]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}): ways to wire an algebra, Reader and Kleisli, free monads, ZIO's type, algebraic effects, and initial and final embedded DSLs.
- [Tagless final]({{< ref "type-driven-design/04-architecture/tagless-final" >}}): the encoding, rules for using it, two critiques, the expression problem, and an open task.
- [Declarative design]({{< ref "type-driven-design/04-architecture/declarative-design" >}}): declarative specifications and engines, four senses of "declarative", and the people behind the idea.
