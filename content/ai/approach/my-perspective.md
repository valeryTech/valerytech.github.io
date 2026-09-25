---
draft: false
toc: true
aliases:
  - "/ai-engineering/my-perspective/"
title: "My Perspective"
linkTitle: "My Perspective"
---
# My approach to production AI engineering


I build production LLM and agentic systems, and I am most aligned with roles where the engineering responsibility extends across both the AI capability itself and the surrounding system required to make that capability work in production.

That includes orchestration, tool use, context management and retrieval, state and memory, long-running execution, and recovery. It also includes evaluation, observability, release engineering, production operations, and continuous improvement.

I see these as parts of the same engineering problem because the behaviour of an AI product emerges from the interaction of the model, prompts, context, tools, state, data, and runtime environment.

## The engineering problem


My focus is on how to engineer AI systems so that **its behaviour can be understood and evaluated**, and **the system itself can be changed and operated systematically**.

This matters because the behaviour of LLM-based and agentic systems cannot be inferred from implementation structure alone. And relatively small changes in prompts or runtime context can materially affect behaviour, which also emerges from interactions across multiple components. Many important behavioural expectations cannot be specified completely in advance.

In other words, **AI systems have particular behavioural properties:** prompt/context sensitivity, partial specification, compositional behaviour, runtime drift, non-local change effects, weak attribution. So gaps in the surrounding engineering system quickly affect the ability to develop, change, and operate the product with confidence.

I therefore treat **AI behaviour as a system-level concern** throughout the product lifecycle: how required behaviour is specified, how it is established across realistic conditions, how failures are reconstructed and attributed, how the effects of changes are understood, how release decisions are supported by evidence, and how production experience informs subsequent system evolution.

This has shaped how I approach AI product design and delivery. I keep the problem and intended outcome explicit when making decisions about the solution, its scope, required behaviour and evaluation. What we learn through experimentation, implementation and production can lead us to revise those decisions or our understanding of the problem.

## Evaluation


Putting these pieces in place is not enough. Each of these practices has to account for the behavioural properties of LLM-based systems. For example, an evaluation system built around generic metrics may still miss the failures that actually matter to the product. Useful evaluation needs to be grounded in real system behaviour, representative traces, and application-specific failure modes.

Evaluation plays a central role in this engineering system. It combines a technical subsystem with the methods and discipline needed to identify the behaviours and failure modes that matter, translate them into evaluation criteria and representative test cases, and interpret what the evidence supports. Lessons from experimentation and production feed back into evaluation and guide changes to the system.

**Evaluation provides evidence for product and engineering decisions; the surrounding engineering practices provide the means to act on those decisions.** My approach includes both.

## Enabling principles


**Honesty about what we know.** People need to distinguish what they know from what they assume, acknowledge uncertainty, failures and limits, and avoid claiming more than the evidence supports.

**Willingness to learn and change.** People need to investigate what they don't understand, test their ideas, and reconsider their thinking and decisions as they learn.

**Trust and cooperation.** People need to be able to question ideas, report problems, ask for help and contribute knowledge across roles. The team's response needs to make those actions possible.

## Discovery / Delivery Operating model


I'm developing a companion discovery and delivery framework as one way to organise this work. Discovery reduces uncertainty about possible solutions, while delivery takes responsibility for building and operating product behaviour within a committed scope. Both continue as the team learns from experiments, implementation and production use.

I aim to move quickly by shortening the path from an important question to credible evidence and a decision. When time is tight, I choose the smallest useful next step: a quick test for an uncertain choice, or a narrow production release that we can support. Before acting, I make the question, limits and failure response clear enough for that step. The depth of evidence and control reflects the consequences of being wrong, and what we learn informs the next commitment.

The framework uses **solution risk areas** -- Value, Usability, Feasibility and Viability -- to help identify important assumptions that might otherwise be missed. The **solution utility ladder** makes claims about a solution's usefulness explicit: from basic system behaviour to completing the user's job, improving on the current alternative and producing the intended change.

Together, these tools connect what the team learns with decisions about the solution, its scope, architecture and production commitments.
