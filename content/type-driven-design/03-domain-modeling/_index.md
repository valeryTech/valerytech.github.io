---
draft: false
toc: true
title: "Type-Driven Design: Domain Modeling"
description: "Modeling a domain so that its types state which values and states can exist: type-first design, newtypes, algebraic data types, illegal states made unrepresentable, values and entities, errors, workflows and state machines."
weight: "30"
linkTitle: "Domain Modeling"
---
# Domain modeling


Modeling a domain so that the types say which values can exist and which transitions are legal, following Wlaschin's *Domain Modeling Made Functional*. Part of [Type Driven Design]({{< ref "type-driven-design" >}}).

- [Domain Modeling With Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}): overview of the folder, type-first design, how the vocabulary translates across languages, values, entities and aggregates, and errors as values.
- [Newtypes And Simple Values]({{< ref "type-driven-design/03-domain-modeling/newtypes-and-simple-values" >}}): primitive obsession, newtypes, value classes and opaque types, and constrained simple values.
- [Algebraic Data Types]({{< ref "type-driven-design/03-domain-modeling/algebraic-data-types" >}}): product and sum types, counting values as a design check, and sum types versus tagged classes and class hierarchies.
- [Making illegal states unrepresentable]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}}): business rules as choice types, connascence of value, booleans, a flag plus an optional value, and behaviour as data.
- [Workflows And States]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}): workflows as function types, one type per state, state machines, typestate with phantom types, and long-running workflows.
