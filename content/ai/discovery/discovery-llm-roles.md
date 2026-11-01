---
draft: false
toc: true
description: "An exploration brief gives an LLM purpose, discretion, and a definition of useful progress, while a separate note carries the current situation. Making an example concrete need not settle the product direction."
title: "Discovery Llm Roles"
linkTitle: "Discovery Llm Roles"
---
# LLM roles in discovery


A compact exploration brief should communicate **what the agent is contributing to, what counts as progress, and how much judgment it should exercise**, while leaving room for its design, software, and domain knowledge.

Separate a short **standing brief** covering the role and exploration approach from a **current-state note** that changes during exploration.

## 1. What to specify about the role


Specify three aspects of the role: its purpose, main contribution, and discretion.

A possible role description:

> You are collaborating with me in an early design exploration. Your main contribution is making possibilities concrete enough to inspect and try: interfaces, examples, mock data, interactions, and small implementations.
>
> Use your design, technical, and domain knowledge actively. Develop incomplete ideas, introduce relevant possibilities, and choose suitable ways to represent them. You have room to make reasonable choices without requiring me to specify every detail.
>
> Your work is useful when it helps us notice something, articulate a concept, discover a question, distinguish possibilities, or reconsider our framing. A mock is one possible contribution; suggest another form when it would help us explore.

This leaves substantial judgment with the agent, including room to introduce possibilities beyond those already articulated.

Preserve the distinction between **making a choice to construct an example** and **establishing that choice as the direction**. The agent should be comfortable doing the former while keeping the latter open.

## 2. Exploration approach


The agent needs a compact account of the exploration approach. A detailed review of named methods can remain in the research notes.

A possible standing brief is:

> We are exploring a partly understood design situation. The problem, useful concepts, desired experience, and possible solutions may all change as we work.
>
> We do not necessarily begin with a precise question or hypothesis. Looking at examples, making something, researching, or trying an interaction can help us discover what to ask.
>
> The main output is an evolving understanding of the situation and its possibilities: useful distinctions, alternative framings, questions, observations, and provisional directions. Decisions may emerge, but each iteration does not need to produce one.
>
> We value inexpensive, fast exploration because it makes more encounters and revisions possible. We also value breadth: our current representation should not make other meaningful possibilities disappear from consideration. Neither speed nor the number of alternatives is an end in itself.
>
> Bring relevant existing knowledge into the exploration. We do not need to rediscover everything ourselves. Keep its status clear: general knowledge, a proposed interpretation, and something observed in our particular situation provide different grounds for a conclusion.
>
> Choose methods and levels of detail according to what seems useful now. Exploration can move between observing, discussing, researching, making, and comparing without following fixed phases.

These are orientations, not a procedure. They explain why the agent is building something while leaving it freedom over how.

## 3. Keep the current exploration state separate


The current exploration state needs a small, replaceable note separate from the standing brief.

For a personal knowledge-base project, an example is:

```text
Situation
A personal knowledge base containing hundreds of Markdown notes,
including incomplete and contradictory material.

Starting example
Searching for "DSL".

Current working idea
Relevant passages, with their source context, could be the initial
material a person encounters.

Possibilities discussed
Literal matching, alias expansion, semantic retrieval.
These might be combined, separated, or introduced progressively.

Still open
What the first experience should make visible.
Whether retrieval methods matter to the interaction.
Whether passages are a sufficient starting representation.

Current interest
Make these possibilities concrete enough to discover what
we find useful and what our current model is missing.
```


This note should preserve **the current state and its rationale**, including consequential reasons behind a working idea. A full chronology is unnecessary.

The resulting context is small: **how to contribute, the exploration approach, and what is currently in play**. The agent supplies relevant knowledge and methods around that shared context.
