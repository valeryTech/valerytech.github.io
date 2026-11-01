---
draft: false
toc: true
title: "Declarative Design"
description: "Research notes connecting declarative specifications, execution engines, domain models, DSLs, and semantic modeling, with a list of contributors to study."
linkTitle: "Declarative Design"
---
## Sources, to read


Influental contributors: Robert Kowalki, John McCarthy,

```md
# Semantics

The deepest idea behind declarative systems is: The specification itself has meaning independent of execution.

Declarative approaches (sub-paradigms): functional programming; query language; desired state systems <- what is interesting for our use case.

**Specification.** Formal representation of intent. <- for now we just described steps, agents, prompts; so like it's externalized imperative program;

**Engine / Runtime.** Determines:
- execution plan
- scheduling
- optimization
- reasoning

Examples:
- SQL optimizer

# Relationships

The branch of declarative systems that uses domain models and DSLs (Domain-Specific Languages) is the intersection of:

- Declarative Programming
- Domain-Driven Design (DDD)
- Model-Driven Engineering (MDE) ???
- Language-Oriented Programming (LOP) ??
- Semantic Modeling / Ontologies

# Influential Contributors

- Martin Fowler
- Markus Völter (JetBrains MPS);
- Steven Kelly & Juha-Pekka Tolvanen (Domain-Specific Modeling)
- Andrzej Wasowski & Thorsten Berger
- Philip Wadler (embedded DSLs)
- Simon Peyton Jones. Lead architect of Haskell. Much work on:
  - compositional DSLs
  - type systems
  - executable specifications

  Many modern internal DSL approaches originate from Haskell research.
- Jean Bézivin. A leading figure in Model-Driven Engineering.
- Tom Gruber. Defined ontology as an explicit specification of a conceptualization. This is almost a declarative domain model.

# Functional programming connection

Many DSL researchers implement DSLs inside functional languages because they provide:

- compositional semantics
- algebraic structures
- type systems
- interpreters as first-class citizens

Some Ladder in progression:

- [Domain-Specific Languages (DSLs) | SE@RWTH](https://se-rwth.github.io/research/Domain-Specific-Languages/)
```

## Library sources


- [Guarino et al. 2009](/sources/research-methods/ontology-and-conceptual-modeling/guarino-2009-what-is-an-ontology.pdf.enc), *What Is an Ontology?* ([doi:10.1007/978-3-540-92673-3](https://doi.org/10.1007/978-3-540-92673-3)) -- on *Influential Contributors*

Further reading:

- [Guizzardi 2007](/sources/research-methods/ontology-and-conceptual-modeling/guizzardi-2007-on-ontology-ontologies-conceptualizations.pdf.enc), *On Ontology, Ontologies, Conceptualizations, Modeling Languages, and (Meta)Models*
