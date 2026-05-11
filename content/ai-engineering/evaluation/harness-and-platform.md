---
draft: false
toc: true
title: "Harness And Platform"
linkTitle: "Harness And Platform"
---
# Evaluation of LLM Workflows and Coding Agents


This page covers evaluation for LLM-based workflows and coding agents.

The goal is to make agent behavior **observable, repeatable, and comparable** across prompts, tools, models, orchestration strategies, and workflow designs.

## Why This Matters


Without a reliable evaluation loop, changes to prompts, tools, models, or orchestration quickly become anecdotal tuning. Teams end up relying on isolated examples, manual spot checks, or subjective impressions.

An evaluation harness gives you controlled execution and repeatable scenarios. An evaluation platform helps you compare runs over time, inspect failures, identify regressions, and decide whether a change actually improved the system.

The core question is:

> Can this workflow or agent be changed safely without losing control of its behavior?

## Evaluation Harness


The **evaluation harness** is the execution layer. It runs scenarios under controlled conditions and captures enough evidence to compare, debug, and replay behavior.

A useful harness should:

- define representative tasks for workflows and coding agents;
- capture inputs, tool calls, intermediate outputs, final responses, and generated artifacts;
- run the same task across prompt variants, models, tools, or agent strategies;
- score runs using deterministic checks, human review, rubric-based review, or hybrid evaluation;
- preserve traces so failures can be replayed, inspected, and debugged;
- compare candidate behavior against a baseline or previous version.

See also: [Why Use Evaluation Harness]({{< ref "ai-engineering/evaluation/why-use-evaluation-harness" >}})

## Evaluation Platform


The **evaluation platform** is the analysis and operations layer on top of the harness. It helps teams organize, compare, review, and act on evaluation results.

A useful platform should:

- organize datasets, scenarios, baselines, experiments, and run history;
- track metrics over time and compare versions;
- surface failure clusters rather than isolated bad examples;
- support manual review for nuanced or subjective outputs;
- preserve run metadata such as prompt version, model version, tool configuration, and environment;
- connect evaluation results back to workflow, product, or release decisions.

The harness answers: **what happened when we ran the system?**

The platform answers: **what changed, why does it matter, and what should we do next?**

## Coding Agent Focus


Coding agents require more than generic answer-quality checks. Evaluation should measure whether the agent can complete real development tasks while respecting the repository, tooling, and workflow constraints.

Important evaluation dimensions include:

- task completion against the requested outcome;
- code correctness and regression risk;
- test behavior, including whether relevant tests pass or fail;
- tool-use quality, including unnecessary or redundant actions;
- edit scope and respect for repository constraints;
- ability to recover after failed commands, test failures, or incomplete context;
- quality of explanations, plans, and final summaries;
- latency, cost, and token usage;
- safety around destructive commands, secrets, credentials, and production-impacting changes.

For coding agents, the final answer is only part of the behavior. The trace matters: what the agent inspected, what it changed, which commands it ran, how it handled errors, and whether the final artifact satisfies the task.

## Initial Structure


A practical starting point is:

1. A small scenario set based on real or realistic tasks.
2. Clear pass/fail checks where correctness can be verified mechanically.
3. A review workflow for ambiguous or subjective cases.
4. Stored traces for each run.
5. Versioned prompts, models, tools, and agent settings.
6. A baseline run to compare future changes against.
7. Simple release criteria: approve, review, block, or investigate.

The first version does not need full coverage. Its purpose is to stop relying only on manual spot checks and to create a repeatable loop for evaluating change.

## tbc



- concrete metrics for agentic workflows;
- example benchmark tasks;
- a failure taxonomy for coding agents;
- evaluation methodology trade-offs;
- examples of deterministic checks versus human review;
- architecture of the harness and platform;
- guidance on baselines, traces, release gates, and regression analysis.
