---
draft: false
toc: true
description: "Apply shared engineering goals across programming paradigms, using design techniques appropriate to the language, code, and actual dependencies."
title: "Software Engineering Principles"
linkTitle: "Software Engineering Principles"
---
## Purpose


Use a shared list of engineering principles when considering a solution. This note supports the single **Software engineering principles** entry in the main review checklist.

The list helps prevent important concerns from being missed. It does not require a separate checklist response or justification for every principle on every change.

Use the shared goals across functional, object-oriented, procedural, and mixed code. Choose design techniques according to the language and the actual problem. A principle's familiar name does not prescribe a class hierarchy, an interface, or a particular architecture.

## Simplicity and scope


- **KISS -- keep it simple.** Prefer the simplest understandable solution that satisfies the requirements. Consider the effort to read, test, change, and operate it.
- **YAGNI -- you aren't gonna need it.** Keep speculative capabilities out of the current implementation until there is a concrete need.
- **Start small and develop incrementally.** Begin with the smallest useful solution and add complexity as requirements justify it.
- **Avoid premature abstraction.** Introduce shared structures and extension points when they represent a clear concept or demonstrated need.
- **Avoid premature optimization.** Base added optimization complexity on a requirement or measurement, while respecting known constraints from the start.
- **Reuse existing solutions.** Consider suitable repository code, standard libraries, and existing platform capabilities before adding another implementation or dependency.
- **Minimal change.** Keep the change focused on its purpose. Include supporting changes needed for correctness and maintainability; keep unrelated work separate.

## Responsibilities and abstraction


- **Single level of abstraction.** Keep each function at a consistent level of detail. Move lower-level details into suitable functions when they obscure the purpose of the surrounding code.
- **Cohesive responsibilities.** Give a function, type, or module a coherent purpose. Keep behavior and knowledge that change together close together.
- **Separation of concerns.** Give different concerns clear boundaries so that their details do not become unnecessarily mixed together.
- **High cohesion, low coupling.** Keep related behavior together and limit dependencies between unrelated parts.
- **Information hiding.** Expose the behavior and data consumers need while limiting dependence on internal representation and implementation choices. Functions, modules, types, and objects can all provide useful boundaries. - **Explicit state and effects.** Make dependencies on mutable state, time, randomness, and I/O understandable. Keep ownership, ordering, and failure behavior clear.

### What abstraction levels mean here


A function that describes a business workflow should remain understandable in terms of that workflow. Detailed parsing, storage mechanics, or calculation steps can belong in functions that express those operations at the appropriate level.

Abstraction level and responsibility describe different aspects of organization. A function can serve one business purpose but still mix workflow decisions with the details of how they are implemented.

This principle does not prescribe a fixed set of architectural layers, a class for every concern, or a helper for every expression. Extracting code should give a concept a useful name and a clear boundary. Keep small, cohesive details together when separating them would make the code harder to follow.

### What callers need to know


Assess an abstraction by the behavior it provides and the knowledge its callers need to use it correctly. Include ordering rules, state, configuration, failure handling, and coordination with other operations. A small function or method signature can still require substantial knowledge of the implementation.

A useful abstraction absorbs complexity and keeps shared knowledge in one place. Mentally remove it: would callers have to recover that knowledge and coordination themselves, or would unnecessary indirection disappear? Use this question to evaluate its purpose alongside actual contract and dependency requirements.

## Clarity and maintainability


- **DRY -- don't repeat yourself.** Keep shared knowledge and business rules in agreement. Similar-looking code alone is insufficient reason to create a shared abstraction.
- **Least astonishment.** Keep behavior consistent with names, contracts, and the expectations established by the surrounding code.
- **Clarity over cleverness.** Make intent and control flow straightforward to understand.
- **Consistency.** Follow established project conventions unless there is a concrete reason to change them.
- **Explicit failure handling.** Make invalid states and failures visible. Handle them as the operation's contract requires.
- **Testability.** Keep important behavior practical to verify without unnecessary setup, hidden state, or dependence on unrelated systems.

## Techniques that depend on context


- **Dependency inversion.** When important policy needs protection from infrastructure details, make it depend on the behavior it requires. The original principle is expressed through object-oriented abstractions; functional code can pursue the same separation with function parameters or module contracts. For example, a workflow can receive a `loadCustomer` function rather than call a particular database library. Introduce that boundary when it reduces a concrete dependency problem.
- **Composition over inheritance.** Where inheritance is an available design choice, consider whether composition makes behavior and contracts easier to understand. This comparison is relevant to code using inheritance.
- **Law of Demeter.** In object-oriented code, consider whether navigation through collaborators exposes internal structure and spreads coupling. Apply the broader information-hiding goal to other styles; nested data access alone does not establish a design defect.

In functional code, consider whether data transformations, state changes, and effects are easy to reason about. Pure functions can isolate calculations from I/O, and immutable data can reduce unintended changes to shared values. Where the language supports them, domain types and explicit success/failure values can express valid states and outcomes. Use these techniques when they improve the solution within the project's conventions.

## Applying principles together


Use the principles to guide judgment. They are not a scoring system or a mandate to introduce more structure.

Some duplication may be acceptable while the shared concept is unclear. A dependency boundary may be useful when it isolates a real concern; introducing a new interface or function parameter everywhere can create unnecessary work. A shorter function can improve readability when its extracted operations have meaningful names.

Simplicity includes satisfying correctness, security, and operational requirements. Required validation, recovery behavior, or compatibility support remains part of the solution even when it adds code.

Apply the principles to AI-generated changes with the same expectations. Additional AI-specific risks are collected in the reference lists and explained in the [LLM-Specific Review Guide]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}}).

## Related notes


- [AHA Programming]({{< ref "engineering/aha-programming" >}}) -- when duplication is preferable to a poorly understood abstraction.
- [Premature Abstraction]({{< ref "engineering/premature-abstraction" >}}) -- speculative generality, wrong abstractions, and learning from concrete cases before generalizing.
- SOLID notes -- working notes on responsibility, extension points, and protecting components from changes elsewhere.
- Type-driven design -- expressing domain states, constraints, workflows, and errors through types.
- Module-design guidance -- evaluating abstractions by the capability they provide and the knowledge required of callers.

jota.feldmann@virtasant.com
