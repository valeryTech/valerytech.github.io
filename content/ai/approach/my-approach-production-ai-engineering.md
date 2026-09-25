---
draft: false
toc: true
title: "My Approach Production Ai Engineering"
linkTitle: "My Approach Production Ai Engineering"
---


This note explains how I understand production AI engineering, the responsibilities it involves, and the conditions needed to carry them out.

My perspective comes from building and operating systems, investigating their behavior, and turning that experience into engineering practices and frameworks I have applied across teams. It informs how I work across product discovery, architecture, evaluation, delivery, and learning from production.

# My approach to production AI engineering


I build and operate production systems that use large language models (LLMs) and agents. I have turned that experience into engineering practices and frameworks I have applied across teams. My work connects product discovery, architecture, evaluation, delivery, and learning from production.

I take hands-on responsibility for the AI capability and the surrounding system needed to provide it. This includes model orchestration, tool execution, context and retrieval, state and memory, long-running workflows, and recovery. Evaluation, observability, release engineering, and operations are part of that responsibility.

I use this experience to help decide which solutions to pursue, what behavior users can depend on, where to invest engineering effort, and how to improve or extend the product.

## The engineering problem


In LLM-based systems, behavior depends on interactions among the model, prompts, context, data, tools, state, and runtime. A change in one part can affect behavior elsewhere, and code structure alone does not establish what users will experience. Some expectations become clear or more precise as we examine actual cases. Behavior also needs to be reassessed as inputs and operating conditions change.

I therefore treat behavior as a concern for the complete system. Required behavior needs to be specified and assessed under relevant conditions. Investigation needs enough context to reconstruct failures and examine their causes. Changes need to be assessed for their effects on supported behavior, and production findings need to inform subsequent development.

## Discovery, delivery, and production responsibility


I start from a product problem and a desired outcome. Discovery investigates whether and how a candidate solution could address them. Delivery builds and operates the solution customers will depend on. Both are continuous activities of the same team, and learning from either can change the next decision.

The solution risk areas help identify assumptions that need investigation: value, whether users will choose the solution; usability, whether they can use it; feasibility, whether we can build it with the available technology, skills, and time; and viability, whether it works for the business.

I aim to shorten the path from an important question to credible evidence and a decision. Before an experiment, I identify the uncertainty, the decision it affects, the evidence that could change that decision, and the limits of the test. The next step can be small and fast. When it affects real users or systems, it also needs safeguards, observation, and a way to stop it.

A decision to invest in delivery starts from a candidate solution, the evidence supporting it, the uncertainty that remains, and known constraints. That evidence needs to justify the investment. We still need to establish that the implementation is ready to release and, through live use, whether the product achieves the intended outcome.

A production commitment defines the users and situations we support, the behavior they can depend on, its limits, the operating constraints, and how failures will be detected and handled. An initial release can cover a narrow set of situations while meeting production requirements within that scope.

Before release, the team needs evidence about the required behavior and its boundaries, satisfied operating constraints, a controllable rollout, and the means to observe and respond to failures. Remaining uncertainty is part of the responsibility we accept. Implementation findings and production experience inform subsequent discovery and delivery decisions.

## Evaluation and system development


I treat evaluation as a necessary part of discovery and delivery. It helps establish what the product can currently support and investigate how to improve or extend it. This requires a maintained evaluation subsystem: the people, methods, data, and software needed to gather and interpret evidence about behavior.

The practice uses relevant cases, recorded system behavior, and criteria grounded in the application and its failure modes. Results need enough context to be examined, including the system version, information available to it, actions taken, and basis for the judgment. Engineers and domain experts refine the criteria and methods as their understanding develops.

Evaluation provides evidence for decisions. Architecture, implementation, controls, and operations provide the means to act on those decisions and maintain supported behavior. A finding may lead to changes in retrieval, tool execution, application logic, the user interaction, or recovery. It may also justify revising the supported scope or investigating a different solution.

The solution utility ladder keeps claims about usefulness distinct: valid output, correct behavior, completion of the user's job, improvement over the current alternative, and the intended outcome. Evidence for one claim does not establish the next. Understanding whether the complete workflow helps users requires attention to review, correction, delays, and failures, alongside technical behavior.

The depth of investigation, infrastructure, and automation should follow the decisions and the consequences involved. A focused set of cases and recorded findings can be a suitable starting point. The [evaluation note](https://valery.tech/ai/approach/evaluations/) explains how I develop and maintain this capability.

## Judgment, methods, and collaboration


I bring judgment developed through building, operating, and investigating systems. I expect it to inform problem framing, technical decisions, and the methods used by the team. Improving those methods is part of the engineering contribution, and I continue refining my frameworks through further work.

Honesty means distinguishing observations from assumptions, making uncertainty and failures visible, and limiting claims to what the evidence supports. Willingness to learn means investigating unfamiliar questions and revising decisions when warranted. Trust and cooperation mean people can question ideas, report problems, ask for help, and contribute knowledge across roles.

Shared understanding develops through examining concrete situations together. Domain experts help clarify expectations and consequences. Users help establish whether the workflow serves their needs. Engineers investigate how behavior arises and how to change it. I expect this collaboration to challenge and improve my understanding as well.

My reasoning and methods remain open to examination. Colleagues can start with different terminology and approaches while working toward decisions supported by shared evidence. The [language, mindset, and discipline note](https://valery.tech/ai/approach/minset-language-discipline/) develops these expectations.

## Responsibility, support, and role alignment


I'm looking for a hands-on senior AI product engineering role that uses this experience across the system and its development. The work should include substantive problems that develop my judgment further, with access to users, production experience, and colleagues with complementary expertise.

I can lead the development of missing engineering practices. That work needs agreed responsibilities, appropriate decision authority, allocated time, access to relevant people and data, engineering capacity to act on findings, and leadership support. Findings must be able to affect product scope, architecture, priorities, and release decisions.

The team's practices can still be developing. The commitment to support this work needs to be established before I accept the role. I can explain unfamiliar engineering concerns and investigate them with the team. I'm not looking for a role that depends on prolonged internal advocacy, repeatedly securing permission to do the agreed work, or waiting for the company to recognize the need for it.

Before a lengthy interview process, I'd welcome a conversation with the relevant engineering or product lead about the project, responsibilities, and support, using concrete examples from my work to assess the fit. The [alignment note](https://valery.tech/ai/approach/align/) explains what I want to establish in that discussion.
