---
draft: false
toc: true
title: "Declarative Specifications and Engines"
aliases:
  - "/engineering/ddd/"
  - "/engineering/ddd/declarative/"
description: "Research notes connecting declarative specifications, execution engines, domain models, DSLs, and semantic modeling, with a list of contributors to study."
linkTitle: "Declarative Specifications"
---
## Sources, to read


Influential contributors: Robert Kowalski, John McCarthy,

- **Robert Kowalski** co-founded logic programming. His equation "Algorithm = Logic + Control" (1979, [PDF](/sources/programming/language-theory/kowalski-1979-algorithm-logic-control.pdf.enc)) is the cleanest statement of the declarative idea: the logic says what is true, the control (the engine) decides how to search for an answer, and either can change without the other.
- **John McCarthy** created Lisp, and in "Programs with Common Sense" (1959) proposed the Advice Taker, a program that would act on declarative statements of facts instead of procedures. That's the root of knowledge representation.
- Worth adding: **Edgar Codd**, whose relational model (1970) is why SQL is declarative and why a query optimizer can exist, and **Paul Hudak**, "Building Domain-Specific Embedded Languages" (1996, [PDF](/sources/programming/dsls/hudak-1996-building-domain-specific-embedded-languages.pdf.enc)), the standard reference for embedded DSLs.

## Semantics


The deepest idea behind declarative systems is: The specification itself has meaning independent of execution.

A SQL query means "the set of rows that satisfy these conditions", whatever join order the optimizer picks. A Kubernetes manifest means "three replicas of this pod should be running", whatever the controller does to get there. That separation is what gives the engine its freedom: it can reorder, parallelize, cache or retry, as long as the meaning is preserved. An imperative program means only the sequence of its steps. The analogy is ordering in a restaurant: "steak, medium-rare" is a declarative spec, and the kitchen decides the steps. The formal version of "meaning independent of execution" is denotational semantics.

Declarative approaches (sub-paradigms): functional programming; query language; desired state systems <- what is interesting for our use case.

Logic programming (Prolog, Datalog) belongs on this list too, and is the most purely declarative of them.

Desired-state systems (Kubernetes, Terraform, Puppet) run a reconciliation loop: observe the actual state, compare it with the desired state, act on the difference, and repeat. That makes them idempotent, convergent and self-healing. The catch is that the engine has to know how to get from *any* actual state to the desired one, and where it can't (a migration that would destroy data), the abstraction leaks and someone writes imperative steps after all. See [GitOps]({{< ref "engineering/platform/gitops" >}}).

**Specification.** Formal representation of intent. <- for now we just described steps, agents, prompts; so like it's externalized imperative program;

That diagnosis is the important one. A file that says "step 1: call agent A; step 2: call agent B" isn't declarative just because it's YAML: the engine has no freedom, so it's an imperative program in a data format, like a CI pipeline file. A declarative spec would state the goal and the constraints ("a summary that cites every source, within 30 seconds") and leave the plan to the engine. A quick test: could the engine reorder, parallelize, cache or skip a step without changing what the spec means? If not, the spec is imperative.

Two papers in the library sharpen the critique:

- **AgentSPEX** (Wang et al. 2026, [PDF](/sources/ai-engineering/harness/wang-2026-agentspex-agent-specification-execution-language.pdf.enc)) is a clean example of the step-file style. An agent is a YAML file of steps, loops and variables, and the interpreter iterates through the operations in order; what the engine adds is checkpointing, logging and replay, not planning. The authors' case for explicit control flow is controllability compared with a free-running ReAct agent, which is a real benefit, but it isn't declarative in the sense of *Semantics* above.
- **Etas** (Tan et al. 2026, [PDF](/sources/ai-engineering/harness/tan-2026-etas-effect-typed-language-agent-systems.pdf.enc)) points at what such files lack besides goals. A LangGraph graph shows the order of the steps but not that one of them may send an email or needs a human approval. If each step's effects were typed ([Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}#algebraic-effects-and-effect-typing)), an engine could reorder, retry or cache exactly the steps whose effects allow it, which is the freedom the quick test asks about.

**Engine / Runtime.** Determines:

- execution plan
- scheduling
- optimization
- reasoning

Examples:

- SQL optimizer
- Prolog's resolution and Datalog's bottom-up evaluation
- Kubernetes controllers (reconciliation)
- Terraform's plan, a diff between desired and recorded state
- build systems such as Make and Bazel, which decide what to rebuild from the dependency graph
- React's reconciler, which turns a description of the UI into DOM updates

## Four senses of "declarative"


The word is used in at least four senses in this note and its sources, and they're easy to mix up:

1. **A goal plus an engine that plans.** SQL, Prolog, a Kubernetes manifest: the specification states what must be true, and the engine chooses how. This is the sense of *Semantics* above, and the one the quick test checks.
2. **A program as a value, run later.** A free-monad scenario or a tagless-final program describes steps without performing them, and an interpreter performs them. Granin ([PDF](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), section 6.2.1, "Decoupling of computation and interpretation") admits such scenarios may feel imperative, since they're still a sequence of steps, and calls them declarative because they're pure values that can be interpreted in more than one way. The engine's freedom is the choice of interpretation (real, test, logging), not the order of the steps.
3. **What separated from how, by combinators.** Ghosh's principle "publish what to do, hide how to do within combinators" ([PDF](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), section 10.2.4) and the contract combinators of Peyton Jones et al.: the domain code names the operations, and the library decides the mechanics.
4. **Declarative steps inside an imperative program.** DSPy (Khattab et al. 2023) describes its pipelines as imperative computation graphs in which the language-model calls are declarative modules. Each call is a *signature*, a typed declaration of its inputs and outputs, and the compiler is free to choose the prompt and the demonstrations for it, but the program's control flow stays as written.

An agent workflow file can be declarative in sense 4 (each step's contract) or sense 2 (the file is data that an interpreter runs) without being declarative in sense 1. Only sense 1 gives the engine freedom over the plan, and only sense 1 passes the quick test.

## Relationships


The branch of declarative systems that uses domain models and DSLs (Domain-Specific Languages) is the intersection of:

- Declarative Programming
- Domain-Driven Design (DDD)
- Model-Driven Engineering (MDE) ???
- Language-Oriented Programming (LOP) ??
- Semantic Modeling / Ontologies

Both question-marked entries belong:

- **MDE** makes models, not code, the primary artifacts. A metamodel defines what a valid model is, and transformations turn models into code or into other models (OMG's MDA, Eclipse EMF, the ATL language). It belongs because a metamodel is a domain model of a modeling language, and Bézivin, listed below, is MDE. Critique: the heavyweight, UML-centred wave of the early 2000s had a mixed record in industry; what survived is narrow DSLs with code generators.
- **LOP** is Martin Ward's 1994 term: first design a language for the problem, then write the solution in it. Sergey Dmitriev's JetBrains MPS and Racket's "languages as libraries" are the main lines. It's the DSL side of the intersection, and Völter's MPS work below is LOP tooling.

## Influential Contributors


- Martin Fowler
  - *Domain-Specific Languages* (2010, [PDF](/sources/programming/dsls/fowler-2010-domain-specific-languages.pdf.enc)): internal versus external DSLs, and the **semantic model**. The DSL is a thin syntax that populates an in-memory model, and the model is what runs, which is the specification/engine split above. He also coined "language workbench" (2005).
- Markus Völter (JetBrains MPS);
  - MPS is a projectional editor: you edit the syntax tree directly, so tables, diagrams and maths notation can mix with text. Völter also wrote *DSL Engineering* (2013) and worked on mbeddr, a set of C extensions for embedded software.
- Steven Kelly & Juha-Pekka Tolvanen (Domain-Specific Modeling)
  - *Domain-Specific Modeling: Enabling Full Code Generation* (2008), from MetaCase and its MetaEdit+ tool. Their argument is that a modeling language narrow enough for one domain can generate all of the code, not just skeletons.
- Andrzej Wasowski & Thorsten Berger
  - *Domain-Specific Languages: Effective Modeling, Automation, and Reuse* (2023, [PDF](/sources/programming/dsls/wasowski-2023-domain-specific-languages.pdf.enc)): DSLs as modeling languages, from metamodel to type checker and generator.
- Philip Wadler (embedded DSLs)
  - Critique of the label: Wadler's link to DSLs is mostly through monads (as a way to structure interpreters) and the expression problem, which he named. The canonical name for embedded DSLs is Paul Hudak (see *Sources, to read*).
- Simon Peyton Jones. Lead architect of Haskell. Much work on:
  - compositional DSLs
  - type systems
  - executable specifications

  Many modern internal DSL approaches originate from Haskell research.

  The classic example is "Composing Contracts: An Adventure in Financial Engineering" (Peyton Jones, Eber and Seward, 2000, [PDF](/sources/programming/dsls/peyton-jones-2000-composing-contracts.pdf.enc)). Financial contracts are built from about a dozen combinators, and a compositional denotational semantics says what each contract is worth; the same semantics decides when two differently written contracts are equivalent. A formal account of how a contract evolves during its life is listed in the paper as future work. The authors' own summary is that the significant feature of their contract language is that it's declarative, not that Haskell is lazy: a domain-specific language whose meaning doesn't depend on the host. It's a declarative domain model and its valuation engine in one paper.
- Jean Bézivin. A leading figure in Model-Driven Engineering.
  - He argued that in MDE "everything is a model", as in object orientation everything is an object ("On the Unification Power of Models", 2005), and his group created the ATL transformation language.
- Tom Gruber. Defined ontology as an explicit specification of a conceptualization. This is almost a declarative domain model.
  - "Almost" because an ontology states concepts, relations and constraints without saying how to compute anything. Paired with a reasoner (OWL with a description-logic reasoner), it becomes executable: a specification with an engine again.

## Functional programming connection


Many DSL researchers implement DSLs inside functional languages because they provide:

- compositional semantics
  - the meaning of a combined program follows from the meaning of its parts, so a DSL built from combinators can be reasoned about piece by piece
- algebraic structures
  - DSL operations often form monoids or monads, whose laws justify rewrites and optimizations
- type systems
  - the host language's types check the DSL's programs too, so an embedded DSL gets a type checker for free
- interpreters as first-class citizens
  - one description, several interpreters (run, print, optimize, test). This is the algebra-and-interpreter idea in [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#modules-as-algebras).

The two ways to embed a DSL, deep (the program is an AST that interpreters walk) and shallow (the program is directly its meaning, as functions), mirror the initial and final encodings of tagless final, in Carette et al.'s sense of the names; Gibbons and Wu point out that both are initial algebras, with no categorical duality between them. Both are covered, with Hudak, Carette et al. and Gibbons and Wu, in [Effects And Interpreters]({{< ref "type-driven-design/04-architecture/effects-and-interpreters" >}}#embedded-dsls-initial-and-final).

Some Ladder in progression:

- [Domain-Specific Languages (DSLs) | SE@RWTH](https://se-rwth.github.io/research/Domain-Specific-Languages/)

That's the DSL research page of the Software Engineering group at RWTH Aachen, the home of the MontiCore language workbench.

## Library sources


- [Guarino et al. 2009](/sources/research-methods/ontology-and-conceptual-modeling/guarino-2009-what-is-an-ontology.pdf.enc), *What Is an Ontology?* ([doi:10.1007/978-3-540-92673-3](https://doi.org/10.1007/978-3-540-92673-3)) -- on *Influential Contributors*
- [Fowler 2010](/sources/programming/dsls/fowler-2010-domain-specific-languages.pdf.enc), *Domain-Specific Languages* -- on *Influential Contributors* (Martin Fowler); internal and external DSLs and the semantic model
- [Wasowski et al. 2023](/sources/programming/dsls/wasowski-2023-domain-specific-languages.pdf.enc), *Domain-Specific Languages: Effective Modeling, Automation, and Reuse* -- on *Influential Contributors* (Andrzej Wasowski and Thorsten Berger); DSLs as modeling languages, from meta-model to type checker and generator
- [Mokhov et al. 2020](/sources/programming/functional-programming/mokhov-2020-build-systems-a-la-carte-theory-practice.pdf.enc), *Build Systems a la Carte: Theory and Practice* -- section 2, "Background", on Make (static dependencies, file modification times), Excel (dynamic dependencies at the cost of minimality), Shake (dynamic dependencies, early cutoff) and Bazel (cloud builds), summarised in Table 1 (2.5); sections 4, "Schedulers", and 5, "Rebuilders", which split every build system into a scheduler (topological, restarting, suspending) and a rebuilder (dirty bit, verifying traces, constructive and deep constructive traces); on the engine examples in *Semantics*
- [Khattab et al. 2023](/sources/ai-engineering/harness/khattab-2023-dspy-compiling-declarative-language-model-calls.pdf.enc), *DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines* ([arXiv:2310.03714](https://arxiv.org/abs/2310.03714)) -- LM pipelines as imperative computation graphs whose model calls are declarative modules (typed signatures) that a compiler optimizes; on the specification critique in *Semantics* and sense 4 in *Four senses of "declarative"*
- [Abelson et al. 2022](/sources/programming/language-theory/abelson-2022-sicp-javascript-edition.pdf.enc), *Structure and Interpretation of Computer Programs, JavaScript Edition* -- chapter 4, "Metalinguistic Abstraction": evaluators, and a logic-programming query language built on them; on *Functional programming connection* and the logic-programming line in *Semantics*
- [Kowalski 1979](/sources/programming/language-theory/kowalski-1979-algorithm-logic-control.pdf.enc), *Algorithm = Logic + Control* -- the logic and control split behind the note's first entry; on *Sources, to read*
- [Hudak 1996](/sources/programming/dsls/hudak-1996-building-domain-specific-embedded-languages.pdf.enc), *Building Domain-Specific Embedded Languages* ([doi:10.1145/242224.242477](https://doi.org/10.1145/242224.242477)) -- the case for embedding DSLs in a host language; on *Sources, to read* and the Wadler entry in *Influential Contributors*
- [Gibbons et al. 2014](/sources/programming/functional-programming/gibbons-2014-folding-dsls-deep-and-shallow-embeddings.pdf.enc), *Folding Domain-Specific Languages: Deep and Shallow Embeddings* -- section 2, "Embedding DSLs", on why a shallow embedding can capture only a compositional semantics, and section 4.1, "Multiple interpretations", on running several interpreters over one description by tupling folds; on the compositional-semantics and several-interpreters bullets in *Functional programming connection*
- [Peyton Jones et al. 2000](/sources/programming/dsls/peyton-jones-2000-composing-contracts.pdf.enc), *Composing Contracts: An Adventure in Financial Engineering* ([doi:10.1145/351240.351267](https://doi.org/10.1145/351240.351267)) -- contracts built from combinators, with a compositional valuation semantics; on the Peyton Jones entry in *Influential Contributors*
- Gibbons and de Moor 2003, *The Fun of Programming* -- chapter 6, Peyton Jones and Eber, "How to write a financial contract", the book version of the 2000 paper, with compositional valuation (6.4), an outline of an operational semantics in which a partly executed contract is still a contract the valuation engine can price (6.6), and the point that the payoff is the declarative description, not Haskell (6.7); on the Peyton Jones entry in *Influential Contributors*
- [Wang et al. 2026](/sources/ai-engineering/harness/wang-2026-agentspex-agent-specification-execution-language.pdf.enc), *AgentSPEX: An Agent SPecification and EXecution Language* ([arXiv:2604.13346](https://arxiv.org/abs/2604.13346)) -- agents as YAML step files run by an interpreter; on the specification critique in *Semantics*
- [Tan et al. 2026](/sources/ai-engineering/harness/tan-2026-etas-effect-typed-language-agent-systems.pdf.enc), *Etas: An Effect-Typed Language for Agent Systems* ([arXiv:2607.17780](https://arxiv.org/abs/2607.17780)) -- effect types for model calls, tools and approvals; on the specification critique in *Semantics*
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture* -- section 6.2.1 on free-monad scenarios as declarative descriptions; on sense 2 in *Four senses of "declarative"*
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling* -- section 10.2.4, "Publish what to do, hide how to do within combinators"; on sense 3 in *Four senses of "declarative"*

Further reading:

- [Guizzardi 2007](/sources/research-methods/ontology-and-conceptual-modeling/guizzardi-2007-on-ontology-ontologies-conceptualizations.pdf.enc), *On Ontology, Ontologies, Conceptualizations, Modeling Languages, and (Meta)Models*
- [Iung et al. 2020](/sources/programming/dsls/iung-2020-systematic-mapping-dsl-development-tools.pdf.enc), *Systematic mapping study on domain-specific language development tools*
- [Mernik et al. 2005](/sources/programming/dsls/mernik-2005-when-and-how-to-develop-dsls.pdf.enc), *When and How to Develop Domain-Specific Languages*
- [Lammel 2018](/sources/programming/dsls/lammel-2018-software-languages.pdf.enc), *Software Languages: Syntax, Semantics, and Metaprogramming*
- [Erdweg et al. 2012](/sources/programming/dsls/erdweg-2012-language-composition-untangled.pdf.enc), *Language Composition Untangled*
- [Carette et al. 2009](/sources/programming/dsls/carette-2009-finally-tagless-partially-evaluated.pdf.enc), *Finally Tagless, Partially Evaluated: Tagless Staged Interpreters for Simpler Typed Languages*
- Gibbons and de Moor 2003, *The Fun of Programming* -- chapter 4, Hudak, "Describing and interpreting music in Haskell", music as data given meaning by its interpretation as a performance (4.4), from which an algebra of laws is proved (sequential and parallel composition associative, the zero rest an identity), on the algebraic-structures bullet in *Functional programming connection*; chapter 9, Spivey and Seres, "Combinators for logic programming", logic programs written inside Haskell with a combinator library rather than a new language, from lists of successes (9.2) to search monads (9.3), on the logic-programming line in *Semantics*
