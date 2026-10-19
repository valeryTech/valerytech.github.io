---
draft: false
toc: true
title: "Analysis Or Operation Model"
linkTitle: "Analysis Or Operation Model"
---
# Exploratory design inquiry: operation model


> Status: provisional. This document captures the current model of the work. It intentionally does **not** define exact iteration mechanics, stage gates, templates, or a fixed procedure. Those should be derived later from repeated practice, reflection, and further grounding in theory.

## Core statement


You begin with an unclear situation, progressively construct an understanding of it, expose possibilities, discover better questions, and make selective commitments. Prototypes, sketches, research, examples, and technical experiments are all **inquiry moves** within that process.

The process is therefore broader than prototyping. Prototyping is one way to inquire when making something can reveal information that is hard to obtain by inspection, research, reflection, or comparison alone.

## Starting condition


The starting point does not need to be a well-defined problem. It can be an indeterminate situation containing some combination of:

- a trigger or motivation;
- partial understanding;
- dissatisfaction, curiosity, or perceived opportunity;
- existing assumptions;
- constraints and available means;
- uncertainty about what is relevant, possible, or desirable.

A useful problem formulation may emerge only after some inquiry has already happened.

## Central object


The central object being developed is an **evolving model of the design situation**.

A loose representation is:

```text
DesignSituation {
  frames          // ways of understanding what this situation may be about
  observations    // things encountered or noticed
  assumptions     // propositions currently being taken as plausible
  knowledge       // things currently treated as known
  uncertainties   // things that remain unclear
  questions       // questions that have become visible or useful
  possibilities   // candidate directions, forms, explanations, or solutions
  constraints     // limits that affect the space
  relationships   // connections among the above
  commitments     // things provisionally treated as settled enough to build on
}
```


This representation is intentionally loose. Its purpose is to make clear that the work is developing an understanding of the situation, not merely producing a sequence of artifacts.

## Inquiry moves


An **inquiry move** is an action taken to perturb, inspect, expand, or test the current understanding of the situation.

Examples include:

- observing or inspecting existing material;
- collecting and manipulating examples;
- researching prior work;
- reframing the situation;
- sketching a representation;
- constructing alternative conceptual models;
- making a low-cost prototype;
- comparing alternatives using the same case;
- running a technical spike;
- trying a realistic task with an artifact;
- discussing the situation with another person;
- writing down an assumption and looking for counter-evidence.

The appropriate move depends on what is currently unclear or insufficiently explored. There is no requirement that each iteration contain a prototype or a formal experiment.

## What counts as progress


Progress is multidimensional. It can include:

```text
understanding                 ↑
quality of frames             ↑
quality of questions          ↑
visible possibility space     ↑
ability to distinguish options ↑
relevant knowledge            ↑
justified commitments         ↑
```


Progress does not always mean reducing uncertainty. An inquiry move can be productive when it reveals that the situation is more ambiguous, contains more possible framings, or has more viable directions than previously understood.

For example:

```text
before:
  "I need better search."

after:
  "There are several different things I could mean by better search,
   and they imply different systems."
```


The second state contains more visible uncertainty and is still a better model of the situation.

## Commitment


Commitment is how much of the current model is being treated as settled enough to build on.

Early in inquiry, commitments should usually remain cheap to reverse. As understanding accumulates, commitments can become more specific and more expensive to change.

A working principle is:

> Commit in proportion to accumulated understanding and evidence.

This is a heuristic, not a fixed stage model. A technical uncertainty may justify an early implementation spike, while a conceptual uncertainty may remain open late in the work.

## Possibility and closure


Inquiry should expose meaningful possibilities before the process closes around one direction.

The relevant risk is premature closure: an early artifact or framing can make one direction feel inevitable simply because it is concrete.

Working implications:

- keep important alternatives visible while uncertainty is high;
- distinguish assumptions from observations;
- make the current frame explicit enough to question it;
- treat decisions as provisional when their basis is still weak;
- revisit the possibility space when new observations invalidate the current framing.

## Role of prototyping


Prototyping is an inquiry move used to make an idea concrete enough to experience, inspect, compare, or challenge.

A prototype can help answer questions about:

- what role the system could play;
- what an interaction means in use;
- which information or controls are useful;
- how alternatives behave under the same task;
- whether a conceptual model survives contact with real data;
- whether a technical assumption is feasible.

Prototype fidelity should follow the question being investigated. A manually assembled screen, fake backend, sketch, partial implementation, or realistic vertical slice can all be appropriate depending on the uncertainty.

Prototyping should not become the default response to every uncertainty. Research, observation, conceptual work, comparison, or reframing may be cheaper and more informative.

## Current principles

### 1. Minimize the cost of learning


Use the cheapest representation or action that can produce useful information about the current situation.

Cost includes implementation effort, time, cognitive effort, and the cost of reversing direction.

### 2. Direct effort at what is currently unclear


Inquiry should be connected to a live uncertainty, gap, tension, or possibility. Early inquiry may be too vague for a precise hypothesis, so the target can be exploratory rather than test-like.

### 3. Preserve optionality while understanding is weak


Avoid treating the first coherent framing or solution as settled. Keep meaningful alternatives alive long enough to understand what each exposes.

### 4. Make alternatives comparable when comparison becomes useful


When multiple alternatives are visible, use shared examples, tasks, or evidence so their differences can be observed rather than remembered impressionistically.

### 5. Externalize the current model


Frames, assumptions, observations, questions, possibilities, and commitments should be visible enough to inspect and revise.

### 6. Keep conclusions provisional and traceable


Where possible, preserve the path from observation to interpretation to commitment. This makes later revision possible when the frame changes.

## Lenses for reflection


The following are useful lenses, not mandatory steps:

```text
FRAME
What kind of situation do I currently think this is?
What other framings are plausible?

KNOWLEDGE
What do I currently know?
What relevant knowledge is missing?

POSSIBILITY
What directions can I currently see?
What might the current frame be hiding?

DISCRIMINATION
Which differences among the visible possibilities matter?
What could reveal those differences?

COMMITMENT
What am I currently treating as settled?
Is that commitment justified and reversible enough?
```


These lenses can later inform an iteration method, but this document does not prescribe how or when they must be used.

## Relationship to a future method


A future operating method may eventually specify things such as:

- how an iteration starts;
- how a useful inquiry move is selected;
- how observations and interpretations are recorded;
- how alternative frames are maintained;
- how commitments are made or revisited;
- how reflection changes the next iteration.

Those mechanics should be developed after several real iterations and then grounded against relevant theory. The present model is the conceptual foundation those mechanics should remain consistent with.

## Compact model

```text
indeterminate situation
        ↓
current model of the design situation
        ↓
inquiry move
  observe / research / reframe / sketch /
  compare / prototype / technical probe / ...
        ↓
encounter / experience / evidence
        ↓
interpretation and reflection
        ↓
updated model
  frames / knowledge / questions /
  possibilities / constraints / commitments
        ↺
```


The process can broaden the space, narrow it, or change the frame entirely. The direction of each iteration follows what the inquiry makes visible.
