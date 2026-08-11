---
draft: false
toc: true
title: "My Perspective"
linkTitle: "My Perspective"
---
# My approach to production AI engineering


A large part of AI engineering today is focused on expanding capability: adding RAG, tool use, agentic workflows, longer-running execution, memory, retries, fallbacks, and increasingly autonomous behaviour.

Those capabilities matter, and production AI systems depend on getting them right. My own focus, however, is increasingly on the broader problem that appears once those capabilities become part of real products: **how to turn them into production systems that can be understood, evaluated, changed, and operated systematically.**

This becomes important because the behaviour of LLM-based and agentic systems cannot be understood from implementation structure alone. It can be sensitive to relatively small changes in prompts and runtime context, emerges from interactions across multiple components, and is often judged against behaviour that can only be partially specified in advance.

In other words, **AI systems have particular behavioural properties:**   prompt/context sensitivity, partial specification, compositional behaviour, runtime drift, non-local change effects, weak attribution. So gaps in the surrounding engineering system quickly affect the ability to develop, change, and operate the product with confidence.

I therefore see the system-level engineering around AI behaviour as a core architectural concern throughout the product lifecycle: how required behaviour is specified, how it is established across realistic conditions, how failures are reconstructed and attributed, how the effects of changes are understood, how release decisions are supported by evidence, and how production experience informs subsequent system evolution.

This has led me to develop an integrated approach to AI product design and delivery. It connects problem and product framing, system architecture, empirical experimentation, evaluation and evidence, observability, reliability and production readiness, release engineering, and production feedback throughout the product lifecycle. These are treated as coordinated parts of the same engineering system, so that decisions about what to build, how AI should behave, what risks matter, what needs to be evaluated, what evidence is required for release, and what production findings should change remain connected as the product evolves.

Having these capabilities is not enough on its own. Their value comes from how well they account for the properties of LLM-based systems that make development, evaluation, and operation different from conventional software. For example, an evaluation subsystem built around generic metrics may still miss the failures that actually matter to the product; useful evaluation has to emerge from real system behaviour, representative traces, and application-specific failure modes.

Evaluation is a particularly important part of this engineering system. I see it as more than an evaluation harness or a set of tests. The technical subsystem needs to be paired with a methodology for discovering relevant behaviours and failure modes, turning them into trustworthy evaluation evidence, and continuously incorporating what is learned from experimentation and production.

I want to align on this upfront because AI products are still often approached with expectations that exceed what LLM-based systems can reliably support. Some of the most important problems are also unknown at the start and only become visible through experimentation and production use. What matters to me is therefore less whether a team already has mature answers, and more whether it recognizes that uncertainty, is willing to expose what it does not yet know, and can adapt its architecture and engineering practices as evidence accumulates.

What matters to me is the scope of the engineering responsibility. I am comfortable working on foundational capabilities such as orchestration, tool use, state management, retrieval, retries, and long-running workflows when they are part of building the product. I am most aligned with roles where that responsibility also extends to how the resulting system is evaluated, observed, changed, released, operated, and improved over time.

I do not expect those capabilities to already be mature. In a greenfield environment, much of the work may be to establish them. The important distinction is whether evaluation, behavioural observability, production controls, and operating practices are treated as part of developing the AI product, or as concerns to defer until after the core capability has been proven.
