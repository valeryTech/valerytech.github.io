---
draft: false
toc: true
title: "Representations, composition, and understanding in AI systems"
description: "A conceptual research note on how representations guide construction, constraints support composition, and explicit models can help people develop understanding, with candidate principles and open questions."
linkTitle: "Representations, composition, and understanding in AI systems"
---

As people do more work with generative models, an important design question concerns the representations through which that work happens. A language, domain model, diagram, or partial program can shape what people and models can express, which combinations they can construct, and what they can understand about the result.

This note develops three connected ideas from the [design-research collection]({{< ref "ai/design-research/00-index" >}}) and the [programming-language research]({{< ref "ai/design-research/input/research-llm-programming-languages/alignment" >}}):

1. Representations can participate in the construction of ideas and programs.
2. Chosen properties need to survive the composition of parts.
3. Explicit representations can provide objects through which people develop and revise understanding.

The aim is to identify principles that could explain these relationships and help practitioners reason about system design. The principles below are working formulations. Some have concrete precedents in the reviewed literature; their combination into a broader account remains conceptual research.

The central question is:

> How do representations and constraints shape what people and generative systems can construct together, which properties survive composition, and what people can understand about the resulting work?

## The concepts we need to keep distinct


A **representation** makes selected distinctions explicit. A domain model may distinguish an observation from an interpretation; a type may distinguish a document from a permission to modify it. The form matters together with its interpretation: a label alone does not establish the property it names.

A **constraint** limits possible expressions, combinations, or behavior. A **guarantee** states a property that holds under specified assumptions. The research question is how particular constraints support particular guarantees, including when components are combined or replaced.

**Composition** concerns how parts form a larger whole. The parts might be programs, operations, representations, or contributions to a shared investigation. Different kinds of composition need different accounts; a sequence of computations and a synthesis of arguments do not have the same semantics.

**Understanding** concerns what a person can make of the represented situation: which distinctions they can explain, which consequences they can anticipate, and how they can revise their view. These are candidate ways to examine understanding, rather than a complete definition. A machine-checkable representation and a humanly understood representation are different achievements.

## Principle 1: representations can be instruments of construction


We often describe a language as a way to express an idea that is already formed. The research suggests a second role: the available distinctions and operations can help an idea take shape.

Consider an unfinished comparison of two system designs. A representation that separates assumptions, evidence, and consequences makes some questions easier to notice. An empty evidence field may expose a missing investigation. Two incompatible assumptions may reveal that the alternatives are being compared under different conditions. The representation has contributed to the inquiry by making a relationship available for attention.

Programming-language research gives a concrete version of this constructive role. [Statically Contextualizing Large Language Models with Typed Holes](https://arxiv.org/abs/2409.00921) uses the type and binding context of an incomplete program to guide completion and refinement. [Type-Constrained Code Generation](https://arxiv.org/abs/2504.09246) uses type rules during generation. Structure can therefore influence the candidate while it is being constructed.

The broader hypothesis is that a useful representation changes the space of plausible next moves. It can expose relevant context, suggest a missing relationship, or make an inconsistency apparent. This applies to the [program-authoring work]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}), and may also help explain how shared models support conceptual inquiry.

There is a corresponding limitation. A representation can make some possibilities conspicuous while making others difficult to express. If the domain model is poorly chosen, it may guide construction toward a coherent answer to the wrong question. The research must examine what a representation enables and what it hides.

## Principle 2: constraints can create dependable possibilities for composition


The [constrained-generativity notes]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) explore a seemingly paradoxical relationship: limiting local behavior can increase what can be constructed at the system level.

The proposed explanation is that constraints establish expectations on which other components can rely. If independently produced parts share an interface and preserve its relevant assumptions, they can participate in combinations their creators did not anticipate. Some local freedom is exchanged for more dependable opportunities to combine parts.

This is a conditional principle. A restriction may eliminate a useful construction without buying a relevant guarantee. A uniform interface may permit connections while leaving their meaning incompatible. The important question is which restrictions support which kinds of useful composition, at what cost.

For systems involving LLMs, this suggests a distinction between **freedom to propose** and **conditions for participation**. A person or model may explore many possible constructions. A shared language or environment can make explicit the obligations a construction must satisfy to be combined with other work. The particular obligations depend on the purpose of the system.

This gives “richness” a more precise meaning. The valuable richness of a language may be its ability to express the distinctions the domain needs. The behavior it permits may still be deliberately narrow. Vocabulary, expressive power, analyzability, and freedom of execution are separate dimensions.

The open theoretical problem is to characterize this exchange: when do constraints increase useful generativity, and when do they merely reduce the space of possible work? The existing [constraint-and-composition models]({{< ref "ai/design-research/01-foundations/07-constraint-guarantee-and-composition-models" >}}) begin to formulate the question; they do not yet supply a general measure of useful generativity.

## Principle 3: a property of the whole requires an account of composition


Properties of individual parts do not automatically become properties of their combination. The relationship between the parts can introduce a new obligation.

The permission example makes this clear. A system may permit reading a private document and permit sending messages. Those individual permissions do not settle whether private information may enter an outgoing message. The property of the whole depends on the permitted flow between operations. [Fides](https://arxiv.org/html/2505.23643v2) provides a concrete treatment of confidentiality and integrity, with distinctions between explicit disclosure and information revealed through control flow.

The same question appears outside security. Two contributors may each state their uncertainty clearly, while a combined summary drops the qualifications. Each source passage may be reproduced accurately, while their arrangement suggests an unsupported conclusion. In these illustrative cases, preservation depends on how contributions are combined, rather than on inspecting each contribution independently.

This is why the program's fundamental concern is broader than whether a component is reliable. It asks which relationships, assumptions, and composition rules allow a selected property to remain true as the system grows or changes.

Replacement and evolution are part of that question. A new component may satisfy the same data schema while interpreting a field differently. A revised goal may change what counts as a relevant result. Structural compatibility alone does not settle whether the larger system still has the meaning or property its participants expect.

The research therefore needs to state the property being preserved and the sense of composition involved. Claims about preserving authority, preserving evidence qualifications, and preserving a person's understanding require different arguments.

## Principle 4: explicit representations can become objects of shared inquiry


A representation gives people something they can point to, question, compare, and revise. This can make disagreement more precise: participants may discover that they disagree about a premise, a category, a relationship, or the desired outcome.

For example, a team asking for “the best design” may initially treat cost as its central criterion. Making the alternatives and assumptions explicit could reveal that the real disagreement concerns recovery from failure or the ability to change the system later. The useful result of the conversation is then a revised understanding of the problem.

This connects the language work to [sensemaking and epistemic action]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}). A diagram, partial model, or program can be an object used in thinking. Its value may include the questions and distinctions it makes available, even before it supports execution.

An LLM can contribute candidate distinctions, alternative formulations, or interpretations of a contradiction. People can challenge those contributions against their experience, source material, and purpose. The shared artifact can retain the reasons for a revision and make the development of the inquiry available for later reflection.

Explicitness alone does not establish understanding. A representation can be visible but opaque to its readers, formally consistent but misleading, or so detailed that it obscures the decision at hand. Inspectability, comprehensibility, and usefulness for judgment should therefore remain distinct concepts.

The hypothesis worth developing is that some representations improve people's ability to explain, challenge, and revise the work. The reviewed programming-language results do not establish that broader human outcome.

## Principle 5: incompleteness and revision are part of the subject


The preceding principles imply that an unfinished representation can be useful in its own right. It can preserve what is known while making an unresolved part available for inquiry.

A typed hole is one concrete instance of structured incompleteness. In a conceptual model, an unresolved relationship or competing interpretation can serve a related role. These examples are not equivalent mechanisms, but both suggest the value of distinguishing a meaningful gap from an arbitrary absence.

A failed check can then have several interpretations. The candidate may be wrong; the representation may be inadequate; or the requirement may need to change. A process that treats every failure as a request to repair the candidate risks preserving a mistaken formulation indefinitely.

This suggests a reciprocal relationship between intention and formalization. People articulate an intention, a representation exposes consequences or gaps, and those consequences can change what people intend. Formalization can be part of discovering the problem, as well as expressing a problem already understood.

Revision raises a further question: what should remain stable while understanding changes? The purpose, evidence, conceptual vocabulary, and accepted conclusions can evolve at different rates. The [history and revision notes]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}) address some operational consequences; the conceptual issue is how continuity of inquiry can coexist with changes to its framing.

## A possible unifying account


The three initial contributions describe different relationships around a representation:

| Relationship | Central question | What must not be inferred automatically |
|---|---|---|
| Representation and construction | How does a representation shape what can be proposed or built? | A well-formed construction is useful or meaningful. |
| Constraint and composition | Under which rules do chosen properties survive combination and change? | Individually acceptable parts produce an acceptable whole. |
| Representation and understanding | How does making distinctions explicit affect people's ability to reason and revise? | A visible or machine-checkable artifact is understood by its readers. |

One possible contribution of the program is a conceptual account connecting these relationships. It would explain how the same representation can support construction, carry obligations for composition, and provide an object for inquiry—while showing where these roles conflict.

For instance, a language optimized for mechanical checking may be difficult for a domain expert to interpret. A flexible notation may support exploration while leaving some properties unspecified. Different views of the same model may help, but their correspondence becomes another conceptual obligation: are participants actually examining the same claim?

The [research hierarchy]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) leaves room for this account without choosing a particular runtime or DSL. The general work concerns representations, constraints, and composition. A later design method could draw on those principles, and particular systems could make them concrete.

## What is grounded, and what remains to develop


The reviewed literature provides specific precedents for type-directed context, constrained generation, and information-flow reasoning. The existing notebook already develops compiler feedback, semantic models, constrained generativity, and shared inquiry. The new programming-language material strengthens the connections among these strands; it does not make the combined theory established or novel.

The most useful next conceptual work would address questions such as:

- **What makes a representation constructive?** Which distinctions guide useful exploration, and how do we recognize when a representation is narrowing thought prematurely?
- **What does useful generativity mean?** Does it concern the number of possible constructions, their diversity, their usefulness, or the ability of independently developed parts to participate?
- **What must a composition preserve?** How do assumptions, meaning, uncertainty, and authority differ as objects of preservation?
- **When does explicitness support understanding?** Which relationships between a representation and its readers matter, beyond the availability of information?
- **How can formalization remain revisable?** What allows a system to preserve dependable boundaries while participants reconsider the question or domain model?
- **Where do these principles stop applying?** Which tasks depend on distinctions or contextual judgments that the chosen representation cannot adequately capture?

Developing these questions calls for definitions, contrasting examples, counterexamples, and a closer comparison with existing work in programming languages, compositional reasoning, and human sensemaking. Later formal or empirical studies should follow the particular claims that emerge. The current aim is to understand what the claims should be.

## Why this could matter to practitioners


The intended industry contribution is a clearer way to reason before and during design. These principles could help a team explain why a distinction deserves a place in its domain model, why valid components can interact badly, or why a technically inspectable system still leaves people unable to judge its work.

They could also help teams recognize conceptual progress: discovering a missing distinction, revising an assumption, or understanding why a proposed solution cannot satisfy the actual goal. Such progress can be valuable before selecting a language or building a new platform.

The eventual practical guidance should be derived from these relationships and their limits. The present note supplies candidate foundations for that work, with the [introduction]({{< ref "ai/design-research/00-introduction" >}}) providing the wider motivation and the [alignment review]({{< ref "ai/design-research/input/research-llm-programming-languages/alignment" >}}) recording the source-check scope.

The companion [Twenty research problems for AI systems design]({{< ref "ai/ai-system-design/research-problems-and-prototypes" >}}) turns these foundations into questions to investigate through complete examples in different languages. It proposes comparisons that could help refine the principles and reveal their limits.

*Editorial note, 2026-10-29: Drafted with Codex from the author's research material and clarification that the focus is conceptualization and fundamental principles. The proposed principles and synthesis remain open to revision.*
