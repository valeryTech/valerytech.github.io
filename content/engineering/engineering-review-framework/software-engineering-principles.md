---
draft: false
toc: true
description: "Apply simplicity, scope control, reuse, consistent abstractions, clear responsibilities, and maintainability when designing and reviewing code."
title: "Software Engineering Principles"
linkTitle: "Software Engineering Principles"
---
## Purpose


Keep a shared list of engineering principles available when considering a solution. This note supports the single **Software engineering principles** entry in the main review checklist.

The list is intended to reduce omissions. It does not require a separate checklist response or justification for every principle on every change.

## Simplicity and scope


- **KISS -- keep it simple.** Prefer the simplest understandable solution that satisfies the requirements. Consider the effort to read, test, change, and operate it.
- **YAGNI -- you aren't gonna need it.** Keep speculative capabilities out of the current implementation until there is a concrete need.
- **Start small and develop incrementally.** Begin with the smallest useful solution and add complexity as requirements justify it.
- **Avoid premature abstraction.** Introduce shared structures and extension points when they represent a clear concept or demonstrated need.
- **Avoid premature optimization.** Base added optimization complexity on a requirement or measurement, while respecting known constraints from the start.
- **Reuse existing solutions.** Consider suitable repository code, standard libraries, and existing platform capabilities before adding another implementation or dependency.
- **Minimal change.** Keep the change focused on its purpose. Include supporting changes needed for correctness and maintainability; keep unrelated work separate.

## Responsibilities and abstraction


- **Single level of abstraction.** Keep each function at a consistent conceptual level. Move lower-level details into suitable functions when they obscure the purpose of the surrounding code.
- **Single responsibility.** Give a function, class, or module a cohesive responsibility, with closely related reasons for change.
- **Separation of concerns.** Keep distinct concerns within appropriate boundaries so that their details do not become unnecessarily entangled.
- **High cohesion, low coupling.** Keep related behavior together and limit dependencies between unrelated parts.
- **Encapsulation.** Expose the operations consumers need while keeping internal representations and implementation choices private where practical.
- **Dependency inversion.** Keep high-level policies independent of low-level implementation details where that separation is useful.
- **Composition over inheritance.** Prefer combining components when it produces a simpler design than an inheritance hierarchy.
- **Law of Demeter.** Limit dependence on collaborators' internal structure and chains of objects that expose it.

### What abstraction levels mean here


A function that describes a business workflow should remain understandable in terms of that workflow. Detailed parsing, storage mechanics, or calculation steps can belong in functions that express those operations at the appropriate level.

Abstraction level and responsibility describe different aspects of organization. A function can serve one business purpose while still mixing workflow decisions with implementation mechanics.

This principle does not prescribe a fixed set of architectural layers, a class for every concern, or a helper for every expression. Extraction should give a useful name and boundary to a concept. Keep small, cohesive details together when separating them would make the code harder to follow.

## Clarity and maintainability


- **DRY -- don't repeat yourself.** Keep shared knowledge and business rules consistent. Similar-looking code alone is insufficient reason to create a shared abstraction.
- **Least astonishment.** Keep behavior consistent with names, contracts, and the expectations established by the surrounding code.
- **Clarity over cleverness.** Make intent and control flow straightforward to understand.
- **Consistency.** Follow established project conventions unless there is a concrete reason to change them.
- **Explicit failure handling.** Make invalid states and failures visible, and handle them according to the operation's contract.
- **Testability.** Keep important behavior practical to verify without unnecessary setup, hidden state, or dependence on unrelated systems.

## Applying principles together


Use the principles to guide judgment. They are not a scoring system or a mandate to introduce more structure.

Some duplication may be acceptable while the shared concept is unclear. An interface may be useful at an actual dependency boundary, while adding one to every class may create unnecessary work. A shorter function can improve readability when its extracted operations have meaningful names.

Simplicity includes satisfying correctness, security, and operational requirements. Required validation, recovery behavior, or compatibility support remains part of the solution even when it adds code.

Apply the principles to AI-generated changes with the same expectations. Additional AI-specific risks are collected in the reference lists and explained in the [LLM-Specific Review Guide]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}}).

## Related documents


[Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}) · [Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}) · [Requirements and Quality Targets]({{< ref "engineering/engineering-review-framework/requirements-and-quality-targets" >}}) · [Technical Review Guide]({{< ref "engineering/engineering-review-framework/technical-review-guide" >}}) · [LLM-Specific Review Guide]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}}) · [Review Agents, Skills, and Tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}})
