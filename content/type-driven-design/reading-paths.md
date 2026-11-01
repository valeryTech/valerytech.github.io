---
draft: false
toc: true
title: "Type-Driven Design Reading Paths"
description: "Books, papers and courses on type-driven design grouped by goal: a map that lists each source once with what it is for, then reading paths for practical design, runtime evidence and type theory."
linkTitle: "Reading Paths"
---

Study material for the section, grouped by goal. *The map* lists each source once, with where it's held and what it's for; the three sections after it are the original reading paths, with their explanations. General functional-programming books (Płachta, Pilquist, Welsh, Volpe, Allen, Skinner, Bragilevsky, Maguire) are placed in [Fp Reading Paths]({{< ref "functional-programming/05-practice/fp-reading-paths" >}}); this note lists only their type-related chapters.

## The map


Each source appears once. **[lib]** means it's in the library, **[web]** that it's free online, **[—]** that it's named here but not held.

**Core: designing with types** (in this order)

1. King, "Parse, don't validate" **[lib]**, then "Names are not type safety" **[lib]**. Short; the central idea and its main caveat. → [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}})
2. Wlaschin, *Designing with Types* series **[web]**, or his one-hour talk **[web]**. A free introduction to the book.
3. Wlaschin, *Domain Modeling Made Functional* **[lib]**, chapters 4-7, then 10-13. The main book: types, integrity, workflows, errors, serialization, persistence, evolution. → [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}), [Workflows And States]({{< ref "type-driven-design/workflows-and-states" >}}), [Types At The Boundary]({{< ref "type-driven-design/types-at-the-boundary" >}})
4. A language track:
   - **Scala**: Płachta, *Grokking Functional Programming* **[lib]**, chapter 7, "Requirements as types" (beginner); Volpe, *Practical FP in Scala* **[lib]**, chapter 1 (Scala 2 libraries); Volpe, *Functional Event-Driven Architecture* **[lib]**, section 4.1 and chapter 4 (the same ideas with Scala 3 opaque types and Iron); Odersky et al., *Programming in Scala* **[lib]**, section 17.4 and chapter 20; Wampler, *Programming Scala* **[lib]**, chapters 9, 16 and 17. Schwarz's *Scala 3 by Example: ADTs for DDD* **[lib]** puts Wlaschin's F# beside Scala 3. → [Scala Type System]({{< ref "type-driven-design/scala-type-system" >}})
   - **Haskell**: Allen and Moronuki, *Haskell Programming from First Principles* **[lib]**, chapters 11-12; Skinner, *Effective Haskell* **[lib]**, chapter 5.
   - **TypeScript**: *Effective TypeScript* **[—]**, Total TypeScript workshops **[web]**, Riscutia's *Programming with Types* **[—]**.
   - **Rust**: *Rust for Rustaceans* **[—]**.
   - **Java**: Bloch, *Effective Java* **[lib]**, Items 17, 23, 34, 50, 55, 62 and 88: the same ideas in an object-oriented language.
5. Errors and validation in practice: Pilquist et al., *Functional Programming in Scala* **[lib]**, sections 4.4.1-4.4.2 ("Accumulating errors", "Extracting a Validated type"); Welsh and Gurnell, *Scala with Cats* **[lib]**, chapter 10, "Case Study: Data Validation".
6. Architecture around the model: Ghosh, *Functional and Reactive Domain Modeling* **[lib]**, chapters 3-5 and 10; Volpe 2021, chapter 2 on tagless final; Granin, *Functional Design and Architecture* **[lib]**, chapter 13. → [Functional Domain Modeling]({{< ref "type-driven-design/functional-domain-modeling" >}}), [Effects And Interpreters]({{< ref "type-driven-design/effects-and-interpreters" >}})

**Branch: evidence and proof-carrying types**

7. Noonan, "Ghosts of Departed Proofs" **[lib]**. → [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#evidence-without-runtime-cost)
8. Kleppmann, *Designing Data-Intensive Applications* **[lib]**, chapter 5, for what happens to types once data is stored and sent. → [Types At The Boundary]({{< ref "type-driven-design/types-at-the-boundary" >}}#evolving-types)

**Branch: theory**

9. Krishnamurthi, *Programming Languages: Application and Interpretation* **[lib]**, "Safety and Soundness" and "Gradual Typing". A gentler start than TAPL. → [Type Systems]({{< ref "type-driven-design/type-systems" >}})
10. Pierce, *Types and Programming Languages* **[lib]**, selected chapters (listed under *Type theory and refinement types*), plus section 19.3 on nominal and structural types.
11. Wadler, "Propositions as Types" **[lib]**. → [Type Systems]({{< ref "type-driven-design/type-systems" >}}#types-as-propositions)
12. Jhala, Seidel and Vazou, *Programming with Refinement Types* **[lib]**, with Vazou's Liquid Haskell course **[web]**; Rondon et al., "Liquid Types" **[lib]**. → [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}})
13. Towards dependent types: Maguire, *Thinking with Types* **[lib]**, chapters 1 and 15, and Bragilevsky, *Haskell in Depth* **[lib]**, chapters 11 and 13, as Haskell routes; Brady, *Type-Driven Development with Idris* **[—]**; *The Little Typer* **[—]**; *Programming Language Foundations in Agda* **[web]**; *Software Foundations* **[web]**.
14. Harper, *Practical Foundations for Programming Languages* **[lib]**, as the advanced reference.

Two names are easy to confuse: Sandy Maguire's *Algebra-Driven Design* **[—]** (deriving abstractions and tests from the laws of a domain) is a different book from his *Thinking with Types* **[lib]** (type-level programming in Haskell).

## Practical type-driven design


The following reading suggestions focus on software design with types.

The strongest recommendation for this focus is **Scott Wlaschin -- _Domain Modeling Made Functional_** ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc)). It covers things like replacing primitive values with domain types, making invalid states unrepresentable, modeling workflows as functions, representing errors explicitly, validation at boundaries, keeping I/O outside the domain model, serialization/persistence, and evolving the model as requirements change. ([Pragmatic Bookshelf](https://pragprog.com/titles/swdddf/domain-modeling-made-functional/ "Domain Modeling Made Functional: Tackle Software Complexity with Domain-Driven Design and F# by Scott Wlaschin"))

For the F# to Rust / Scala / TypeScript mapping, see [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#the-same-ideas-across-languages).

There's also a free **Designing with Types** article series by Wlaschin. It explicitly covers adding meaning to primitive types, making illegal states unrepresentable, discovering domain concepts through types, explicit state machines, constrained strings, dates, etc. ([F# for Fun and Profit](https://fsharpforfunandprofit.com/series/designing-with-types/ "The 'designing with types' series | F# for fun and profit"))

[Designing with Types series](https://fsharpforfunandprofit.com/series/designing-with-types/)

Schwarz's slides *Scala 3 by Example: ADTs for DDD* ([PDF](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc)) follow the book's F# examples with Scala 3 versions side by side, which makes them a good companion for readers working in Scala.

His ~1 hour talk is a suggested introduction before buying a book:

[Domain Modeling Made Functional -- Scott Wlaschin](https://www.youtube.com/watch?v=Up7LcbGZFuo)

The second recommendation is **Vlad Riscutia -- _Programming with Types_**. This one uses TypeScript and is deliberately aimed at working programmers. It moves from primitives and data structures through functions, composition, generics, and more advanced abstractions, with the goal of using types to produce safer and easier-to-maintain software. ([Simon & Schuster](https://www.simonandschuster.com/books/Programming-with-Types/Vlad-Riscutia/9781617296413 "Programming with Types | Book by Vlad Riscutia | Official Publisher Page | Simon & Schuster"))

The distinction between the two is useful:

```text
Domain Modeling Made Functional
    "How should I represent my domain?"

Programming with Types
    "How should I use types when designing software?"
```


For domain modeling with types, the suggested first book is **Domain Modeling Made Functional**.

The next suggestion is Alexis King's short article **"Parse, don't validate"** (HTML). It captures one of the central practical ideas of this whole approach. ([Lexi Lambda](https://lexi-lambda.github.io/ "Alexis King's Blog")) See [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}).

For TypeScript specifically, **Effective TypeScript, 2nd ed.** is also useful. It's much more about using TypeScript well in production than domain modeling, with 83 concrete guidelines and updated material on generics and type-level programming. ([Effective TypeScript](https://effectivetypescript.com/ "Effective TypeScript"))

For exercise-based study, **Total TypeScript** has hands-on workshops on unions, generics, branded types, type predicates and advanced application/library patterns. ([Total TypeScript](https://www.totaltypescript.com/workshops "Professional TypeScript Workshops from Matt Pocock | Total TypeScript"))

For Rust, the additional suggestion is **_Rust for Rustaceans_**. It isn't a domain-modeling book, but for readers who already know Rust, it covers API design, traits, ownership, error handling, and using Rust's type system to design ergonomic APIs. ([Penguin Random House](https://www.penguinrandomhouse.com/books/696987/rust-for-rustaceans-by-jon-gjengset/ "Rust for Rustaceans by Jon Gjengset: 9781718501850 | PenguinRandomHouse.com: Books"))

Two books are suggested for deeper study afterward.

**_Type-Driven Development with Idris_ -- Edwin Brady** shows what happens when you push the same philosophy much further. Types guide implementation; later chapters model state machines, protocols, state changes and concurrency in the type system. ([Simon & Schuster](https://www.simonandschuster.com/books/Type-Driven-Development-with-Idris/Edwin-Brady/9781638352242 "Type-Driven Development with Idris eBook by Edwin Brady | Official Publisher Page | Simon & Schuster"))

And **_Algebra-Driven Design_ -- Sandy Maguire** (not in the library; his *Thinking with Types*, which is, is a different book) is about deriving good abstractions from the operations and laws of the domain, including deriving implementations and tests from the model. It's much more advanced and Haskell-heavy. ([Leanpub](https://leanpub.com/algebra-driven-design "Algebra-Driven Design [Leanpub PDF/iPad/Kindle]"))

Proposed practical curriculum:

```text
1. Scott Wlaschin
   Designing with Types              ← free, short

2. Scott Wlaschin
   Domain Modeling Made Functional   ← main book

3. Alexis King
   Parse, Don't Validate             ← very short, important idea

4. Programming with Types            ← broader perspective

5. Language-specific practice
   TS    → Effective TypeScript / Total TypeScript
   Rust  → Rust for Rustaceans
   Scala → apply the same patterns with enums,
           opaque types, Either, refined types, etc.
           (books: see the Scala track in The map)

6. Later:
   Type-Driven Development with Idris
   Algebra-Driven Design
```


Useful search terms are **type-driven design, domain modeling with types, algebraic data types, making illegal states unrepresentable, parse don't validate, smart constructors, newtypes, opaque types, typestate, value objects, and type-safe API design**.

Together, these terms describe this area more precisely than "strong type systems."

## Runtime checks and type evidence


Type-driven design connects domain modeling, static type systems, runtime validation, and the use of types as evidence that a property holds.

Suggested reading order:

1. **Alexis King -- "Parse, don't validate"** (HTML). This is probably the closest match to the question of preserving runtime validation results in types. See [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}). ([Lexi Lambda](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/ "Parse, don't validate"))
    [Read "Parse, don't validate"](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
2. **Alexis King -- "Names are not type safety"** (HTML). Read this immediately afterward. See [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#names-are-not-type-safety). ([Lexi Lambda](https://lexi-lambda.github.io/blog/2020/11/01/names-are-not-type-safety/ "Names are not type safety"))
    [Read "Names are not type safety"](https://lexi-lambda.github.io/blog/2020/11/01/names-are-not-type-safety/)
3. **Scott Wlaschin -- _Domain Modeling Made Functional_** ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc)). This is the suggested book to follow Wlaschin's article. Chapters 4-6 are especially relevant: "Understanding Types," "Domain Modeling with Types," and "Integrity and Consistency in the Domain." Chapter 6 explicitly covers "Enforcing Invariants with the Type System." ([Pragmatic Bookshelf](https://pragprog.com/titles/swdddf/domain-modeling-made-functional/ "Domain Modeling Made Functional: Tackle Software Complexity with Domain-Driven Design and F# by Scott Wlaschin"))
    [Domain Modeling Made Functional](https://pragprog.com/titles/swdddf/domain-modeling-made-functional/)
4. **Gabriel Volpe -- _Practical FP in Scala_** ([PDF](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc)). This is the Scala book suggested as the most directly relevant to this topic. Chapter 1 has sections titled "Strongly-typed functions," "Value classes," "Newtypes," "Refinement types," and crucially "Runtime validation." It covers Scala implementation choices for type-driven design. ([Leanpub](https://leanpub.com/pfp-scala "Practical FP in Scala [Leanpub PDF/iPad/Kindle]"))
    [Practical FP in Scala](https://leanpub.com/pfp-scala)
    Some library-specific examples are from an earlier Scala ecosystem, but the design ideas transfer directly to Scala 3 opaque types.
5. **Matt Noonan -- "Ghosts of Departed Proofs"** ([PDF](/sources/programming/functional-programming/noonan-2018-ghosts-of-departed-proofs.pdf.enc)). Encodes evidence of a verified precondition in types, with no runtime overhead. See [Parse Dont Validate]({{< ref "type-driven-design/parse-dont-validate" >}}#evidence-without-runtime-cost). ([Input | Output](https://www.iog.io/papers/ghosts-of-departed-proofs-functional-pearls "Ghosts of Departed Proofs (Functional Pearls)"))
    [Ghosts of Departed Proofs](https://www.iog.io/papers/ghosts-of-departed-proofs-functional-pearls)
6. **Edwin Brady -- _Type-Driven Development with Idris_**. This takes the idea substantially further. Idris has dependent types, so properties that Scala would normally establish through runtime validation can sometimes be expressed and proven directly in types. The book covers predicates, assumptions/contracts in types, equality proofs, and state machines verified through types. ([Manning Publications](https://www.manning.com/books/type-driven-development-with-idris?query=type "Type-Driven Development with Idris - Edwin Brady"))
    [Type-Driven Development with Idris](https://www.manning.com/books/type-driven-development-with-idris)
7. **Benjamin Pierce -- _Types and Programming Languages_ (TAPL)** ([PDF](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc)). This is the formal foundation. Pierce defines a type system as a mechanism for checking the absence of certain erroneous behaviors by classifying program expressions according to the values they can compute. (His exact wording, "a tractable syntactic method for proving the absence of certain program behaviors by classifying phrases according to the kinds of values they compute", is discussed in [Type Systems]({{< ref "type-driven-design/type-systems" >}}#what-a-type-system-is).) It covers type safety, abstraction, subtyping, polymorphism, recursive types, and related theory. This is suggested for understanding what the compiler can establish and how that differs from using types as an engineering technique. ([MIT Press](https://mitpress.mit.edu/9780262303828/types-and-programming-languages/ "Types and Programming Languages"))
    [Types and Programming Languages -- MIT Press](https://mitpress.mit.edu/9780262303828/types-and-programming-languages/)

There is also a useful conceptual bridge to formal verification: **Philip Wadler's "Propositions as Types"** ([PDF](/sources/programming/language-theory/wadler-2015-propositions-as-types.pdf.enc)). It introduces the Curry-Howard correspondence: propositions correspond to types and proofs correspond to programs/values. ([Informatics Homepages](https://homepages.inf.ed.ac.uk/wadler/papers/propositions-as-types/propositions-as-types.pdf "Propositions as Types *"))

[Propositions as Types -- paper](https://homepages.inf.ed.ac.uk/wadler/papers/propositions-as-types/propositions-as-types.pdf)

Suggested path for studying runtime checks and type evidence:

```text
Parse, don't validate
        ↓
Names are not type safety
        ↓
Domain Modeling Made Functional, ch. 4–6
        ↓
Practical FP in Scala, ch. 1
        ↓
Ghosts of Departed Proofs
        ↓
Type-Driven Development with Idris
        ↓
TAPL / Propositions as Types
```


The first four should provide a precise practical model. The later three explain why it works at a deeper level.

## Type theory and refinement types


A suggested starting point for systematic study is Pierce's _Types and Programming Languages_ ([PDF](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc)). ([MIT Press](https://mitpress.ublish.com/book/types-and-programming-languages "Types and Programming Languages | The MIT Press")) Then read Wadler's _Propositions as Types_ ([PDF](/sources/programming/language-theory/wadler-2015-propositions-as-types.pdf.enc)) for the logical perspective, ([Edinburgh Research](https://www.research.ed.ac.uk/en/publications/propositions-as-types/ "Propositions as Types - University of Edinburgh Research Explorer")) and _Parse, Don't Validate_ (HTML) for the direct software-design consequence. ([Lexi Lambda](https://lexi-lambda.github.io/ "Alexis King's Blog")) After that, topics like refinement types, effects, linear types, and session types make much more sense.

For refinement types specifically, there are good books and courses, but surprisingly few books focus only on refinement types. Most teach them as part of type systems, dependent types, or program verification.

A path for a software engineer:

1. **Types and Programming Languages -- Benjamin C. Pierce (TAPL)**
   This is the standard foundation. It explains typing judgments, lambda calculus, type safety, subtyping, polymorphism, type reconstruction, existential types, kinds, etc. It doesn't focus on refinement types, but it gives you the machinery needed to understand why refinement typing works.
   Prioritize chapters **8-11, 15-16, 22-24, 29-30** rather than reading all 600+ pages linearly. Chapter 1 is a short, readable overview of what type systems are for, and section 19.3 covers nominal versus structural typing.
   [MIT Press: Types and Programming Languages](https://mitpress.mit.edu/9780262162098/types-and-programming-languages/)
2. **Programming with Refinement Types -- Ranjit Jhala, Eric Seidel, Niki Vazou** ([PDF](/sources/programming/language-theory/jhala-2020-programming-with-refinement-types.pdf.enc))
   This is the most direct text on refinement types. It's free and built around Liquid Haskell. It starts with logic and SMT solvers, then covers refinement types, subtyping, pre/postconditions, refined data types, measures, and real case studies.
   [Programming with Refinement Types](https://ucsd-progsys.github.io/liquidhaskell-tutorial/)
3. **Niki Vazou's Liquid Haskell course**
   A direct course on refinement types. It goes beyond syntax and explains how checking actually works: refinement subtyping becomes logical verification conditions that are discharged by an SMT solver. It then covers data invariants, abstract refinements, termination, induction, and programs-as-proofs.
   The course has runnable examples, so you can experiment instead of only reading equations.
   [Liquid Haskell course](https://nikivazou.github.io/lh-course/Lecture_01_RefinementTypes.html)
4. **Software Foundations -- Benjamin Pierce et al.**
   Read this if TAPL makes you wonder, "Okay, but how do we actually prove that a type system is sound?" It's an interactive textbook where the definitions and proofs are machine-checked in Rocq/Coq. Volume 2 covers operational semantics and static type systems.
   It teaches concepts such as the classic:

```text
   type safety = progress + preservation
```

   This is one of the key ideas behind static type-system theory.
5. **Programming Language Foundations in Agda -- Wadler, Kokke, Siek**
   This is a good bridge from ordinary static types toward dependent types and theorem proving. The entire book is available online and executable in Agda.
   [Programming Language Foundations in Agda](https://plfa.github.io/)
6. **The Little Typer -- Friedman & Christiansen**
   This is about **dependent types**, which are closely related to refinement types but go further. It's much gentler than TAPL and uses the small Pie language to build intuition about propositions-as-types, equality proofs, dependent function types, etc.
   Best read after some practice with Liquid Haskell.
7. **Practical Foundations for Programming Languages -- Robert Harper** ([PDF](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc))
   Use this as the advanced reference after TAPL. It gives a systematic treatment of programming-language theory and is more abstract and formal. An abbreviated corrected edition is available from CMU.
   [Practical Foundations for Programming Languages](https://www.cs.cmu.edu/~rwh/pfpl/)

A narrower path:

```text
TAPL selected chapters
        ↓
Liquid Haskell course
        ↓
Programming with Refinement Types
        ↓
The Little Typer / PLFA
```


The first three cover most practical questions about refinement types.

A quick start: the first 2-3 chapters of Vazou's Liquid Haskell course. It gets to actual refinement typing much faster than TAPL and explains the SMT/subtyping connection particularly well.

## Library sources


- King 2019, *Parse, don't validate* -- item 1 of *The map*; recommended in *Practical type-driven design* and as item 1 of *Runtime checks and type evidence*
- King 2020, *Names are not type safety* -- item 1 of *The map*; item 2 of *Runtime checks and type evidence*
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- item 3 of *The map*; the main recommendation in *Practical type-driven design*, and item 3 of *Runtime checks and type evidence*
- [Schwarz 2020](/sources/programming/scala/schwarz-2020-scala-3-by-example-adts-for-ddd-part-1.pdf.enc), *Scala 3 by Example: ADTs for DDD, Part 1* -- slides that follow *Domain Modeling Made Functional*, with Wlaschin's F# beside the Scala 3 version; the Scala track of *The map* and the DMMF entry in *Practical type-driven design*
- Płachta 2022, *Grokking Functional Programming* -- chapter 7, "Requirements as types"; the Scala track of *The map*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- chapter 1, and chapter 2 on tagless final; the Scala track and item 6 of *The map*, and item 4 of *Runtime checks and type evidence*
- [Volpe 2023](/sources/programming/scala/volpe-2023-functional-event-driven-architecture.pdf.enc), *Functional Event-Driven Architecture: Powered by Scala 3* -- chapter 4, newtypes on opaque types and Iron; the Scala track of *The map*
- [Odersky et al. 2021](/sources/programming/scala/odersky-2021-programming-in-scala-5e.pdf.enc), *Programming in Scala, 5th Edition* -- section 17.4 and chapter 20; the Scala track of *The map*
- [Wampler 2021](/sources/programming/scala/wampler-2021-programming-scala-3e.pdf.enc), *Programming Scala, 3rd Edition* -- chapters 9, 16 and 17; the Scala track of *The map*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles* -- chapters 11 and 12; the Haskell track of *The map*
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell* -- chapter 5 on smart constructors; the Haskell track of *The map*
- [Bloch 2018](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), *Effective Java, 3rd Edition* -- the Java track of *The map*
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala, 2nd Edition* -- sections 4.4.1-4.4.2 on accumulating errors and `Validated`; item 5 of *The map*
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats* -- chapter 10, "Case Study: Data Validation"; item 5 of *The map*
- [Ghosh 2017](/sources/programming/scala/ghosh-2017-functional-and-reactive-domain-modeling.pdf.enc), *Functional and Reactive Domain Modeling* -- chapters 3-5 and 10; item 6 of *The map*
- [Granin 2025](/sources/programming/functional-programming/granin-2025-functional-design-and-architecture.pdf.enc), *Functional Design and Architecture* -- chapter 13 on interfaces and wiring; item 6 of *The map*
- [Noonan 2018](/sources/programming/functional-programming/noonan-2018-ghosts-of-departed-proofs.pdf.enc), *Ghosts of Departed Proofs (Functional Pearl)* ([doi:10.1145/3242744.3242755](https://doi.org/10.1145/3242744.3242755)) -- item 7 of *The map*; item 5 of *Runtime checks and type evidence*
- [Kleppmann et al. 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, 2nd Edition* -- chapter 5, "Encoding and Evolution"; item 8 of *The map*
- [Krishnamurthi 2025](/sources/programming/language-theory/krishnamurthi-2025-programming-languages-application-interpretation-v3.pdf.enc), *Programming Languages: Application and Interpretation*, version 3 -- "Safety and Soundness" and "Gradual Typing"; item 9 of *The map*
- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages* -- item 10 of *The map*; item 7 of *Runtime checks and type evidence* and item 1 of *Type theory and refinement types*
- [Wadler 2015](/sources/programming/language-theory/wadler-2015-propositions-as-types.pdf.enc), *Propositions as Types* -- item 11 of *The map*; the bridge to formal verification in *Runtime checks and type evidence*, and an early step in *Type theory and refinement types*
- [Jhala et al. 2020](/sources/programming/language-theory/jhala-2020-programming-with-refinement-types.pdf.enc), *Programming with Refinement Types: An Introduction to LiquidHaskell* -- item 12 of *The map*; item 2 of *Type theory and refinement types*
- [Rondon et al. 2008](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc), *Liquid Types* -- item 12 of *The map*
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types: Type-Level Programming in Haskell* -- chapters 1 and 15; item 13 of *The map*
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth* -- chapters 11 and 13; item 13 of *The map*
- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages, 2nd Edition* -- item 14 of *The map*; item 7 of *Type theory and refinement types*
