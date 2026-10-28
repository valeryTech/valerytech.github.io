---
draft: false
toc: true
title: "DSLs Enable Reliable Use of LLMs"
description: "A captured article argues that small validated DSLs improve LLM generation and repair, illustrated by step-marked PlantUML and YAML for diagram-rich presentations."
linkTitle: "DSLs Enable Reliable Use of LLMs"
---
# DSL reliability


<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

The note retains the source metadata, reliability argument, and complete presentation example from the captured article "DSLs Enable Reliable Use of LLMs". The [opening design discussion]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#design-and-llm-roles-from-the-captured-dsl-article) is now in the builder method note. The remaining article sections are linked after the presentation example.

## Why DSLs work so well with LLMs


It is a common experience that DSLs work well with LLMs. PlantUML, Mermaid, and Graphviz are domain specific languages for visual modeling; SQL is a DSL for querying databases; Kubernetes YAML is a DSL for describing cloud infrastructure. These are not general-purpose programming languages -- they are deliberately constrained, designed to express a narrow set of concepts in one domain. And it is no surprise that LLMs are remarkably good at generating Mermaid diagrams, SQL queries, or Kubernetes manifests from a plain English description.

My observation is that DSLs make LLMs more reliable because they respond so well to a few in-context examples. A general-purpose language like Java offers lots of valid ways to express the same intent. A DSL strips the variation away. Giving the model a few examples is enough to reliably generate the correct syntax. It's worth noting that frontline models are already heavily exposed to PlantUML or Java fluent interfaces during training, so they aren't starting from scratch. It will be curious to see how smaller, more constrained models perform when tasked with a truly novel DSL.

For an agent -- an LLM running in an autonomous generate-and-check loop rather than a single shot generation -- there is one more benefit. A DSL almost always ships with a deterministic validator: a parser, a JSON schema, a type checker, or a compiler. The agent can generate a candidate, run it past the validator, and repair it from the error, all without a human in the loop. Crucially, the errors are phrased at the level of the domain -- "you cannot select an action before choosing a client" -- rather than as a stack trace buried deep in generated code. DSL's toolset itself acts as an excellent harness. We will see it concretely in the Tickloom examples below, where the DSL's grammar is enforced by the host language's compiler and the resulting runs are checked automatically.

It is important to note that this is not a one-size-fits-all solution. The advantage holds while the DSL stays small and constrained enough that a few in-context examples can convey its usage. There is also a real upfront cost in designing and maintaining the language and its semantic model. The payoff is therefore concentrated in well-factored, genuinely constrained DSLs backed by a validator.

## Example: Using LLMs to generate diagram rich powerpoint presentations


[LLMs make it really easy to build custom tools](https://www.martinfowler.com/articles/exploring-gen-ai/16-building-custom-tooling-with-llms.html). While teaching distributed systems, I frequently need to create presentations which mostly have diagrams explaining distributed operations in a cluster. UML Sequence diagrams have been great for that but showing a full sequence diagram while explaining the flow of messages through the cluster is not very useful. I needed a tool to show a sequence diagram step by step in a powerpoint presentation. With the help of LLMs I was able to build a tool which processes a YAML describing the presentation structure with references to the PlantUML diagrams and generates a powerpoint presentation. The PlantUML diagrams are marked with steps, and the tool generates a separate slide for each step. This made it really easy to create diagram-rich presentations.

Generate a PlantUML sequence diagram showing a cluster of three nodes athens, byzantium and cyrene. Put a box to mark the cluster. Actor Alice sends a message "title", "After Dawn" to athens, Athens sends message to itself. Put a note to show state 'title: After Dawn'. Athens sends message to byzantium which fails. Athens sends to cyrene. Put a note placed to the right of cyrene. athens then checks with isQuorumReached and returning a synchronous Success arrow back to Alice. Put a '\[step\] marker after each message.

This prompt generates the following PlantUML code with step markers:

```
@startuml
actor Alice

box "Cluster" #lightblue
participant athens
participant byzantium
participant cyrene
end box

'[step]
Alice -> athens: "title", "After Dawn"

'[step]
athens -> athens: save()

note right of athens
  state:
  title: After Dawn
end note

'[step]
athens -[#red]x byzantium: "title", "After Dawn"

'[step]
athens -> cyrene: "title", "After Dawn"

note right of cyrene
  state:
  title: After Dawn
end note

'[step]
athens -> athens: isQuorumReached()

'[step]
athens --> Alice: Success

@enduml
```


I used it to create a series of slides in a powerpoint presentation. For doing that, I developed a small YAML specification to describe the presentation structure and the diagrams to be used in each slide. This allowed me to use LLMs to create presentations describing complex distributed systems concepts, without having to manually create animations on the slides. An example prompt to generate a slide YAML spec is as simple as following.

Create a slide YAML referring to the diagram 'quorum-write' with a title 'Quorum Write Example'

This generates a slide spec YAML like following:

```
- slide:
    title: "Quorum Write Example"
    diagram: "quorum-write"
```


It's important to note that even if the prompt is saying create a slide YAML, it's not any random YAML spec. Because the tool to generate the powerpoint presentation and the YAML specification understood by the tool is used as a context in the prompt, the LLM is able to generate the correct YAML spec which can be directly used by the tool to generate the powerpoint presentation.

The full YAML spec can be viewed at [this Github repo](https://github.com/unmeshjoshi/MADSPlantUMLSteps/blob/main/src/presentation/deterministic-simulation-testing.yaml)

Notice that the LLM played two different parts in this single example. First it was a co-designer -- helping shape the step-marked PlantUML extension and the slide YAML on top of existing PlantUML tooling. Then, once that small DSL existed, it became the natural-language interface that turns an English request into a valid spec. We will come back to this division of labour at the end of the article.

<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

## Continuation of the captured article


The article continues with the [Tickloom semantic model]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}#building-the-semantic-model) and the [complete scenario DSL case study]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}#example-building-a-dsl-for-testing-distributed-system-scenarios), now together in one note. The closing discussions of [LLM roles during design and use]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#two-phases-working-with-llms) and [the DSL as the source of truth]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}#the-dsl-as-the-source-of-truth) remain in related notes.
