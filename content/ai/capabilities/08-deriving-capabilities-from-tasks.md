---
draft: false
toc: true
title: "Deriving Capabilities from Tasks"
description: "Using the capability account to design a system: start from purpose and tasks, identify what makes the tasks hard, derive the capabilities, and test each link from task demand to mechanism."
weight: "80"
linkTitle: "Deriving from Tasks"
---

The earlier notes treat capabilities as things to understand and measure. This note turns the account around for building a system. If a capability is a disposition that varies with task demands, then the tasks and their demands have to be described before the capability can be defined. Reasoning belongs in the capability layer; the system's purpose and task model come first.

The order:

1. Define what the system is for.
2. Define the tasks it must perform.
3. Identify what makes those tasks difficult, risky, or variable.
4. Derive the capabilities required.
5. Choose mechanisms that might provide them.
6. Test the causal assumptions linking tasks, capabilities, and mechanisms.

The running example is a software-engineering agent.

## 1. Purpose


> Given a repository, an issue description, and execution access, produce a correct, minimal, verified code change.

This fixes the users, the expected output, the environment, the system boundary, the cost of failure, and when the system should abstain or ask. "Build a system that reasons" would not: it says neither what reasoning is for nor how to tell whether it helped.

## 2. Task model


**Domain**: the objects, relations, rules, and resources. Source files, modules and dependencies, functions and types, requirements and issues, tests, build systems, version history, runtime traces, coding and security constraints.

**Task types**: the transformation required. Explain an implementation, locate code for an issue, diagnose a defect, implement a feature, repair a failing test, refactor without changing behavior, migrate an API, detect a security problem, verify that a change meets requirements. Two systems can work on the same codebase and perform very different tasks.

**Workflow**: how a task decomposes. Interpret the request, inspect the repository, find relevant code, model current behavior, identify the gap to intended behavior, propose a change, edit, run tools and tests, diagnose failures, verify, decide whether to finish, retry, or ask. The workflow shows where different capabilities are needed.

**Demands**: the variables that change difficulty or risk. Repository size, dependency depth, number of modules involved, ambiguity of the requirement, quality of the test suite, amount of irrelevant code, novelty of libraries, availability of execution, length of the change sequence, observability of the failure, strength of safety constraints, time and compute.

These demand variables are the \(\pi\) of [measuring dispositions]({{< ref "ai/capabilities/05-measuring-dispositions" >}}). They are more useful than an opaque "difficulty" score.

## 3. Capabilities from demands


A capability is introduced because some task needs it over some range of conditions. For this system:

- understanding natural-language requirements;
- retrieving relevant repository information;
- building a structured representation of code;
- tracking dependencies and state changes;
- inferring likely causes of failures;
- generating candidate changes;
- planning sequences of edits and tool calls;
- executing tools;
- checking formal and semantic constraints;
- verifying behavior;
- estimating uncertainty;
- deciding when to retry, abstain, or ask;
- communicating the result.

Reasoning shows up in diagnosis, inference, planning, and constraint checking, working alongside retrieval, representation, memory, action, and verification. It may be better treated as a family: causal diagnosis, deduction, constraint propagation, analogical transfer, planning, search, comparison of alternatives (see [reasoning as a capability]({{< ref "ai/capabilities/07-reasoning-as-a-capability" >}})). The useful unit is whichever capability explains variation in task performance and supports a design decision.

## 4. A chain of hypotheses


Hypotheses connect the task model to the architecture as a chain of testable claims:

| Hypothesis | Example |
| --- | --- |
| **Task demand** | Cross-module repair gets harder as dependency depth increases. |
| **Capability** | Explicitly tracking dependency relations reduces that decline. |
| **Architecture** | A symbolic dependency graph with a learned search policy tracks dependencies more reliably than text-only context. |
| **Measurement** | Shortest dependency-path length is an adequate measure of dependency depth for this class of repairs. |
| **Outcome** | Adding the graph flattens the decline in repair success as depth increases. |

\[\text{task requirement} \rightarrow \text{task demand} \rightarrow \text{required capability} \rightarrow \text{proposed mechanism} \rightarrow \text{predicted effect}\]

Each link can be challenged on its own. This avoids jumping from "the system needs reasoning" to "add a reasoning module".

## 5. Architecture from the capability model


A possible neuro-symbolic design:

- a neural model for interpreting requirements, code, documentation, and ambiguous evidence;
- a repository index for semantic and structural retrieval;
- syntax trees, type information, dependency and control-flow graphs as symbolic representations;
- a planner or controller that selects actions;
- code generation;
- a tool-execution environment;
- a test runner and static analyzer;
- a verifier for constraints and results;
- a state store for the current hypothesis, plan, edits, and evidence.

Neural mechanisms suit demands for interpreting ambiguous language, judging semantic similarity, forming hypotheses, and generating candidates. Symbolic mechanisms suit demands for exact relations, formal rules, constraint checking, state tracking, and verification. The task has both kinds of demand, so the design is likely hybrid. "Neuro-symbolic" should follow from the task analysis rather than be a starting commitment.

## 6. Evaluating the chain


**Task level.** Was the issue fixed? Did tests pass? Were regressions introduced? Was the patch minimal? Were time and compute acceptable?

**Capability level.** How does behavior change as demands increase? Success against dependency depth, implementation choice against requirement ambiguity, verification against test coverage, localization against repository size, plan completion against number of edits. This is where dispositional measurement applies: the capability is the relation between controlled demands and behavior, not the average over an arbitrary benchmark.

**Mechanism level.** Did the component produce the capability? Intervene on it:

- remove the dependency graph;
- replace it with an oracle graph;
- corrupt parts of it;
- hold the graph fixed and change the neural model;
- give the planner correct intermediate states;
- replace generated formalizations with correct ones.

These interventions show whether the component causes the improvement.

For running such studies, see the guidelines for empirical software-engineering studies involving LLMs ([Baltes et al. 2025](/sources/research-methods/empirical-methods/baltes-2025-empirical-studies-se-llms.pdf.enc), [arXiv:2508.15503](https://arxiv.org/abs/2508.15503)) and the [Evaluation]({{< ref "ai-engineering/evaluation" >}}) notes.

## Summary


| Layer | Question |
| --- | --- |
| Purpose | What outcome, for whom, under which constraints? |
| Task model | Which task families, workflows, contexts, and failure conditions define the work? |
| Demand model | Which independently describable properties make tasks harder, riskier, or more uncertain? |
| Capability model | Which stable abilities are needed to handle variation in those demands? |
| Architectural hypotheses | Which components might provide those capabilities? |
| Operationalization | How are demands, intermediate behaviors, and outcomes measured? |
| Experiments | How are demands varied and components intervened on? |
| Validation | Do results support the demand, capability, architecture, and measurement hypotheses? |
| Revision | Revise the architecture, capability model, task decomposition, or purpose? |

The central dependency: **capabilities are defined from the structure of the tasks the system must perform.** Reasoning comes in only where the task analysis shows a need for inference, search, planning, diagnosis, or constraint handling. The same analysis may show that retrieval, memory, representation, execution, or verification is the real limit.

## Library sources


- [Cui et al. 2026](/sources/ai-foundations/capabilities-and-measurement/cui-2026-measuring-the-unmeasurable.pdf.enc), *Measuring the Unmeasurable*
- [Zhou et al. 2026](/sources/ai-foundations/capabilities-and-measurement/zhou-2026-general-scales.pdf.enc), *General scales unlock AI evaluation with explanatory and predictive power* ([doi:10.1038/s41586-026-10303-2](https://doi.org/10.1038/s41586-026-10303-2))
- [Vernon 2016](/sources/ai-foundations/cognition-and-mind/vernon-2016-two-ways-not-to-design-a-cognitive-architecture.pdf.enc), *Two Ways (Not) To Design a Cognitive Architecture*
- [Colelough and Regli 2025](/sources/retrieval-and-knowledge/neuro-symbolic/colelough-2025-neuro-symbolic-ai-in-2024-review.pdf.enc), *Neuro-Symbolic AI in 2024: A Systematic Review* ([arXiv:2501.05435](https://arxiv.org/abs/2501.05435))
- [Dinu et al. 2024](/sources/retrieval-and-knowledge/neuro-symbolic/dinu-2024-symbolicai-logic-based-generative-models-solvers.pdf.enc), *SymbolicAI* ([arXiv:2402.00854](https://arxiv.org/abs/2402.00854))
- [Hamilton et al. 2024](/sources/retrieval-and-knowledge/neuro-symbolic/hamilton-2024-neuro-symbolic-ai-nlp-structured-review.pdf.enc), *Is neuro-symbolic AI meeting its promises in natural language processing? A structured review* ([doi:10.3233/SW-223228](https://doi.org/10.3233/SW-223228))
