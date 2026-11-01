---
draft: false
toc: true
title: "Type-Driven Design: Domain Modeling"
description: "Modeling a domain so that its types state which values and states can exist: algebraic data types, newtypes, illegal states made unrepresentable, values and entities, errors, workflows and state machines."
weight: "30"
linkTitle: "Domain Modeling"
---
# Domain modeling


Modeling a domain so that the types say which values can exist and which transitions are legal, following Wlaschin's *Domain Modeling Made Functional*. Part of [Type-driven design]({{< ref "type-driven-design" >}}).

- [Domain modeling with types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}): an overview of the folder, plus values and entities, errors as values, and the same ideas across languages.
- [Algebraic data types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}): product and sum types, counting values, and sum types versus class hierarchies.
- [Newtypes and simple values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}): primitive obsession, newtypes, value classes and opaque types, and constrained simple values.
- [Making illegal states unrepresentable]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}}): business rules as choice types, connascence of value, booleans, a flag plus an optional value, and behaviour as data.
- [Workflows and states]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}): workflows as function types, one type per state, state machines, typestate with phantom types, and type-first design.
