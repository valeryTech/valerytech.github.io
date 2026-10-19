---
draft: false
toc: true
title: "Discovery Analysis"
linkTitle: "Discovery Analysis"
---
# Structuring exploratory design inquiry


Prototyping is one activity within a broader process of exploratory design inquiry.

The proposed foundation is **exploratory design inquiry**. You begin with an unclear situation, progressively construct an understanding of it, expose possibilities, discover better questions, and make selective commitments. Prototypes, sketches, research, examples, and technical experiments are all inquiry moves within that process.

The approach can be structured in five layers.

## 1. Foundation: what the process is for


The core object being developed is an evolving **model of the design situation**. That model contains frames, observations, assumptions, uncertainties, questions, possibilities, constraints, relationships, and provisional commitments.

So the goal is approximately:

```text
make the situation intelligible
+
expose meaningful possibilities
+
discover useful questions
+
reduce selected uncertainties
+
make justified commitments
```


This is important because progress can sometimes increase visible uncertainty: discovering that "better search" actually contains five different possible problems is useful progress.

## 2. The main intellectual foundation


Three ideas provide a proposed foundation:

```text
Schön
situation → naming → framing → move → reflection → reframing

CPS
mess → observations/data → possible problems → ideas

Dorst/Cross
problem understanding ↔ possible solutions
```


These support a stance of starting from an **indeterminate situation**, deliberately forming possible problems, and using possible solutions to revise the understanding of the problem. Schön, CPS, and co-evolution are the proposed foundations.

## 3. The evolving state


A loose state representation makes this explicit:

```text
DesignSituation {
  frames
  observations
  assumptions
  uncertainties
  questions
  possibilities
  constraints
  commitments
}
```


Then the process is simply repeated transformation of this state.

```text
current situation model
        ↓
notice uncertainty / gap / possibility
        ↓
choose inquiry move
        ↓
encounter something
        ↓
interpret it
        ↓
update situation model
        ↺
```


This is stronger than organizing the process around "prototype 1 -> prototype 2 -> prototype 3."

## 4. Modes of inquiry


Four questions help guide the choice of the next inquiry move:

```text
FRAME
Do I understand what kind of situation/problem this is?

KNOWLEDGE
What do I know? What do I need to learn?

POSSIBILITY
What alternatives can I currently see?
What might my framing be hiding?

DISCRIMINATION
What would help distinguish meaningful alternatives?
```


Those lead to different moves:

```text
frame unclear
→ observe, sensemake, reframe

knowledge missing
→ research, inspect data, make probes

possibility space too narrow
→ generate alternatives, change frames, explore concepts

many plausible alternatives
→ compare them systematically

specific uncertainty
→ experiment / prototype

enough evidence
→ make a provisional commitment
```


So you don't always prototype. Sometimes the correct next action is reframing, research, collecting examples, drawing a conceptual model, or simply writing down alternatives.

## 5. Principles


Six proposed principles follow from this structure:

- **Minimize the cost of learning.** Use the cheapest representation that can teach you what you need.
- **Direct inquiry at the current uncertainty.** Ask what you need to understand before choosing an experiment.
- **Preserve optionality while uncertainty is high.** Avoid letting the first plausible solution collapse the design space.
- **Make alternatives comparable.** Use common tasks/data so differences become visible.
- **Externalize your thinking.** Make assumptions, frames, alternatives, and questions inspectable.
- **Keep conclusions provisional and traceable.** Preserve the path from observation -> interpretation -> hypothesis -> commitment.

The [research synthesis]({{< ref "ai/discovery/discovery-rewritten" >}}) develops these principles in more detail.

The distinction between a prototype-centered process and broader inquiry can be represented as follows:

```text
Prototype-centered model

idea
→ prototype
→ evaluate
→ improve prototype
→ build

Proposed model

indeterminate situation
→ construct current understanding
→ expose questions / uncertainties / possibilities
→ choose appropriate inquiry move
    research
    inspect
    sketch
    prototype
    compare
    technical probe
→ observe
→ reframe / expand / discriminate
→ update design situation
→ selectively commit
→ repeat
```


And prototyping becomes one particularly useful inquiry move when **making something will expose information you cannot get cheaply through thought, observation, or research alone**.

A next area to develop is the mechanics of an iteration: **selecting the next question, choosing an inquiry move, recording what happened, and updating the design situation**. These mechanics remain open.

## Relationship to earlier formulations


The later formulations revise the earlier prototype-centered account: the starting object becomes an indeterminate situation, the central object becomes an evolving model of that situation, and prototyping becomes one possible inquiry move.
