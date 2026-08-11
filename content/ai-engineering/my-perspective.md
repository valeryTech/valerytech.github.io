---
draft: false
toc: true
title: "My Perspective"
linkTitle: "My Perspective"
---
# My approach to production AI engineering


I build production LLM and agentic systems, and I am most aligned with roles where the engineering responsibility extends across both the AI capability itself and the surrounding system required to make that capability work in production.

That includes orchestration, tool use, context and retrieval, state (loops) and memory, long-running execution and recovery, together with evaluation, observability, release, operation, and continuous improvement. I see these as connected parts of the same engineering problem rather than separate concerns added at different stages.

## The engineering problem


Much of AI engineering today tends to address problems by layering on additional capabilities, mechanisms, and autonomy, increasing the complexity of the resulting system.

Building those capabilities well is an essential part of production AI engineering. My focus is on the broader engineering problem that emerges once those capabilities have to work together as part of a product. This problem is how to engineer the resulting system so that **its behaviour can be understood and evaluated**, and **the system itself can be changed and operated systematically**.

This matters because the behaviour of LLM-based and agentic systems cannot be inferred from implementation structure alone. Relatively small changes in prompts or runtime context can materially affect behaviour, which also emerges from interactions across multiple components. Many important behavioural expectations cannot be specified completely in advance.

In other words, **AI systems have particular behavioural properties:** prompt/context sensitivity, partial specification, compositional behaviour, runtime drift, non-local change effects, weak attribution. So gaps in the surrounding engineering system quickly affect the ability to develop, change, and operate the product with confidence.

I therefore treat **AI behaviour as a system-level concern** throughout the product lifecycle: how required behaviour is specified, how it is established across realistic conditions, how failures are reconstructed and attributed, how the effects of changes are understood, how release decisions are supported by evidence, and how production experience informs subsequent system evolution.

This has shaped how I approach AI product design and delivery. It connects product and problem framing with system architecture, experimentation and evaluation, observability and reliability, release engineering, and feedback from production throughout the product lifecycle. I treat these as connected parts of the same engineering system so that what we build, how we expect it to behave, what we evaluate, and what we learn in production continue to inform one another.

Putting these pieces in place is not enough. Each of these practices has to account for the behavioural properties of LLM-based systems. For example, an evaluation system built around generic metrics may still miss the failures that actually matter to the product. Useful evaluation needs to be grounded in real system behaviour, representative traces, and application-specific failure modes.

Evaluation plays a central role in this engineering system. It extends beyond an evaluation harness or a set of tests. The technical subsystem needs to be paired with a methodology for identifying the behaviours and failure modes that matter, translating them into evaluation criteria and representative test cases, and feeding lessons from experimentation and production back into evaluation and the system.

I want to make this explicit upfront because AI products are often approached with expectations beyond what LLM-based systems can reliably deliver. Some of the most important problems are not known at the start and only emerge through production use. What matters to me is whether the team works in a way that reflects a few important principles for dealing with that uncertainty:

- **Intellectual honesty about uncertainty** -- being explicit about what is known, what is assumed, and where confidence is weak.
- **An empirical mindset** -- using experimentation, evaluation, traces, and production evidence to inform engineering decisions.
- **Willingness to expose failures** -- creating conditions where failure modes are surfaced, investigated, and learned from.
- **Adaptability** -- changing architecture, prompts, evaluation criteria, operating practices, or product assumptions when the evidence calls for it.
- **Shared ownership of behaviour** -- treating AI behaviour as an engineering responsibility across product, architecture, evaluation, release, and operations.
- **Pragmatism about capability limits** -- designing the product around what the system can support reliably and making those limits explicit.

I mention these qualities because this kind of engineering approach depends on them. Evaluation, experimentation, and production feedback are useful when a team is prepared to surface uncertainty, learn from actual system behaviour, and revise its assumptions and engineering decisions as evidence accumulates. In my experience, that ability to learn and adapt is an important part of turning AI capabilities into products that can be developed and operated reliably.
