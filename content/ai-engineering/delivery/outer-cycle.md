---
draft: false
toc: true
title: "Problem and Response Cycle"
description: "Frames the problem and desired outcome before selecting a response, defining the project's contribution and evidence that may require revising or stopping it."
linkTitle: "Problem and Response Cycle"
---

The Problem and Response Cycle helps a team decide what needs to change and whether a product or engineering project is an appropriate response.

It comes before and around the Project Loop.

The two cycles answer different questions:

- **Problem and Response Cycle:** What is happening, what should change, and what response is likely to help?
- **Project Design and Delivery Cycle:** What should this project contribute, and how should its product, service, or system be designed, built, evaluated, released, and operated?

The Problem and Response Cycle may lead to:

- no further action;
- a change to a workflow, responsibility, policy, data source, or existing system;
- one software or AI project;
- several related projects and supporting changes.

Do not assume that the response must involve AI or even software.

## How the cycles work together


The Problem and Response Cycle defines why a project should exist, what outcome it should support, and what role it should play.

The Project Loop takes that definition and works out how to design and deliver the product, service, or system.

The relationship is iterative. Work on the project may reveal that:

- the original problem was misunderstood;
- an assumption was incorrect;
- the proposed product will not produce the expected outcome;
- additional changes are required outside the project;
- the scope should change;
- the project should stop.

When this happens, return to the relevant part of the Problem and Response Cycle and revise the response.

## How much work is needed


The depth of the cycle should depend on the problem. A familiar, low-risk problem may require only a short discussion and a one-page project brief. A complex, uncertain, or high-impact problem may require research, interviews, data analysis, experiments, and a more explicit model of causes, constraints, and dependencies. The goal is not to complete a fixed process. The goal is to develop enough understanding to make a defensible decision about what to do next.

## Problem Framing as a Foundation


Problem framing is a foundational activity within the Problem and Response Cycle. Before project-level design begins, the team should develop a clear understanding of the problem, the wider social, organizational, and technical context, and the change that is required.

This work should define the problem and its boundaries, identify key assumptions and uncertainties, and describe the environment in which any proposed intervention would operate.

The outcome may be a decision to initiate one AI project, several related projects, a different type of intervention, or no technical project at all.

The amount of work needed at this stage should depend on the problem. Complex, uncertain, or high-risk problems may require a structured analysis. Simpler and well-understood problems may need only a short framing exercise.

This document does not cover the outer cycle in detail. Its main focus is the design and delivery of a specific project once its purpose and scope are clear. Findings from the project may also lead the team to reconsider the original problem, the planned solution, or the role of the project.

Also, the relationship between the two cycles is iterative. Findings from project design, evaluation, deployment, or operation may lead the team to revisit the original problem framing, revise the selected intervention, change the project scope, or reconsider whether the project should continue.

# The Cycle


The cycle has four steps:

1. Understand the problem
2. Define the desired outcome
3. Choose a response
4. Define the project and review the results

## 1. Understand the problem


Build a clear description of the current situation before selecting a solution.

Start with what is observable:

- What is happening today?
- Who is affected?
- What work, decision, or experience is difficult?
- How often does it happen?
- What are the consequences?
- Why does it matter now?

Then examine what may be causing or sustaining the problem:

- workflow and process constraints;
- missing or unclear responsibilities;
- unavailable, incomplete, or poor-quality data;
- limitations of existing software;
- incentives or policies;
- gaps in knowledge or capability;
- environmental or operational constraints.

Separate evidence from assumptions. Record important unknowns rather than filling them with plausible explanations.

Also define the current scope of the problem. State which users, workflows, systems, decisions, locations, or time periods are included. The scope may change as new evidence becomes available.

### Ready when


The team can explain:

- what the problem is;
- who is affected;
- why it matters;
- what evidence supports the description;
- what may be causing or sustaining it;
- what is still uncertain;
- what is currently inside and outside the scope.

## 2. Define the desired outcome


Describe what should be different if the response succeeds.

The desired outcome should describe a change in the real situation, not the delivery of a product.

For example:

- reduce the time required to review a support case;
- improve the consistency of a technical decision;
- help users find relevant information with less manual work;
- reduce avoidable failures in a workflow;
- improve access to a service;
- increase the proportion of cases completed correctly.

"A chatbot is available" or "the model reaches a target score" may be project results, but they do not by themselves describe the outcome the project is expected to support.

Define how the outcome could be observed or measured. This may include quantitative measures, qualitative evidence, or both.

Also identify constraints that must continue to hold, such as:

- acceptable error rates;
- privacy and security requirements;
- human review boundaries;
- latency or availability requirements;
- cost limits;
- legal or policy constraints;
- accessibility requirements.

### Ready when


The team can explain:

- what should change;
- for whom it should change;
- how the change would be observed;
- which constraints must hold;
- which assumptions connect the proposed change to the desired outcome.

## 3. Choose a response


Consider what changes could produce the desired outcome.

Possible responses include:

- changing a workflow or process;
- clarifying responsibilities or ownership;
- improving data or knowledge;
- changing an existing product or service;
- introducing a new software system;
- introducing an AI-enabled product;
- providing training, guidance, or operational support;
- combining several of these changes;
- deciding that no project is justified.

A technical product may address only part of the problem. For example, an AI system may generate a recommendation, while the overall outcome still depends on data quality, user training, workflow changes, review procedures, and clear ownership.

For each possible response, ask:

- Which part of the problem does it address?
- How is it expected to help?
- What assumptions does it depend on?
- What must happen outside the product?
- What risks or new failure modes might it introduce?
- Is there a simpler response?
- What evidence would show that the idea is feasible?

When uncertainty is high, use research, prototypes, baselines, or small experiments before committing to a full project.

### Ready when


The team has selected a response and can explain:

- why it is likely to help;
- which causes or constraints it addresses;
- why AI or software is required, when applicable;
- which supporting changes are needed;
- which assumptions still need to be tested;
- why the response is preferable to simpler alternatives.

## 4. Define the initiatives and govern the response


When the response requires a product or engineering project, create a project brief.

The brief should be small enough to remain useful. It should define:

- the problem and relevant context;
- the affected users or groups;
- the desired outcome;
- the contribution expected from the project;
- the initial scope and boundaries;
- important constraints;
- assumptions that must be tested;
- dependencies outside the project;
- evidence that will be used to assess the result;
- known reasons to change or stop the project.

The project brief becomes an input to the Project Loop.

It should describe the project's role without prescribing the full implementation. Detailed product decisions, system design, model choices, evaluation methods, and release plans belong in the Project Loop.

### Ready when


- the response has an accountable owner;
- projects and supporting changes have been identified;
- each project's expected contribution is stated;
- dependencies have owners;
- assumptions have been allocated for testing;
- outcome evidence and review triggers are agreed;
- reasons to revise or stop are recorded.

### Review during delivery


Evidence from design and delivery should be used to review the original response.

Check whether:

- the problem still appears as originally described;
- the desired outcome remains relevant;
- the project is addressing the important part of the problem;
- the underlying assumptions are holding;
- required supporting changes are happening;
- the product is changing real work or behavior as expected;
- the overall situation is improving;
- unexpected effects have appeared.

A project can be delivered successfully while failing to improve the original situation. Review both the product and the wider outcome.

The result of a review may be to:

- continue with the current approach;
- change the product;
- change the supporting workflow or process;
- revise the project scope;
- add or remove related work;
- revisit the original problem;
- stop the project.

# In Short


The Problem and Response Cycle exists to prevent a team from moving directly from a problem statement to an assumed AI solution.

It establishes:

1. what is happening;
2. what should change;
3. what response is likely to help;
4. what role a project should play;
5. what evidence may require the decision to be revised.

Its main output is a small project brief that provides a clear starting point for the Project Loop.

## Library sources


- [Zinkevich 2016](/sources/903c644dfdc4b32ef0ad55c8393288d6.bin), *Rules of Machine Learning: Best Practices for ML Engineering* -- on *3. Choose a response*
- [Chevallier 2016](/sources/653e8cb4b8ea4b17693fe5cd76adfcc6.bin), *Strategic Thinking in Complex Problem Solving* -- on *The Cycle*

Further reading:

- [Babushkin and Kravchenko 2025](/sources/39e0cbe26b72ead73bbe6633505b42c1.bin), *Machine Learning System Design*
- Burkov 2020, *Machine Learning Engineering*
- Thompson 2023, *Delivering Machine Learning Projects: From Design to Deployment*
- [Kalinowski et al. 2024](/sources/a448e14caac8d1967dd9b92204d44a65.bin), *Naming the Pain in Machine Learning-Enabled Systems Engineering*
- Conn and McLean 2019, *Bulletproof Problem Solving: The One Skill That Changes Everything*
- [Potthoff 2020](/sources/b38894bcaf0aed832490ad4d276b979b.bin), *Applied Problem-Solving in Healthcare Management, Chapter 3* ([doi:10.1891/9780826165657.0003](https://doi.org/10.1891/9780826165657.0003))
