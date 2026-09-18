---
draft: false
toc: true
title: "Amortized Generation Problem"
linkTitle: "Amortized Generation Problem"
---

There is **amortized problem solving**: the model, viewed as an agent, has learned a mapping from prompts to plausible outputs during training and applies that mapping at inference time, without necessarily instantiating the problem as an explicit structure and solving that structure.

In classical AI, AIMA distinguishes a reflex-like mapping from a **problem-solving agent**. A problem-solving agent explicitly formulates a goal, formulates a problem, searches for a solution, and then acts. A reflex agent essentially maps its current state to an action using what it already contains. ([AIMA](https://aima.cs.berkeley.edu/figures.pdf?utm_source=chatgpt.com "4x3-sas-exploring-adp-error+loss.eps"))

The LLM example behaves closer to the first pattern:

`request -> learned model -> plausible answer`

where the desired process is something like:

`request`

` -> formulate the problem`

` -> identify unresolved work`

` -> create subtasks`

` -> establish dependencies`

` -> execute/resolve subtasks`

` -> verify results`

` -> compose answer`

That distinction has a direct analogue in machine learning called **amortization**. Amortized optimization learns a function that predicts solutions to new instances, avoiding solving an optimization problem from scratch for every instance. ([arXiv](https://arxiv.org/abs/2202.00665?utm_source=chatgpt.com "Tutorial on amortized optimization")) Amortized inference similarly replaces per-instance optimization with a learned mapping; the literature even calls the error introduced by doing this the **amortization gap**. ([Proceedings of Machine Learning Research](https://proceedings.mlr.press/v80/marino18a.html?utm_source=chatgpt.com "Iterative Amortized Inference"))

That is very close to what pretrained LLMs do conceptually. Training has compressed enormous amounts of regularity into the weights. At inference, ordinary generation can produce something that resembles the result of planning, analysis, decomposition, research, etc., without those operations having been explicitly carried out for this particular problem.

Recent LLM literature usually describes the other side of this distinction as **test-time computation**, **planning**, **search**, **decomposition**, or **verification**. For example, recent work contrasts conventional single-pass generation with methods that spend inference-time compute on intermediate reasoning, search, candidate evaluation, and verification. ([arXiv](https://arxiv.org/abs/2502.12521?utm_source=chatgpt.com "Inference-Time Computations for LLM Reasoning and Planning: A Benchmark and Insights")) ADaPT makes the distinction operationally: an LLM can act as an iterative executor, or explicitly plan and recursively decompose tasks when necessary. ([aclanthology.org](https://aclanthology.org/2024.findings-naacl.264/?utm_source=chatgpt.com "ADaPT: As-Needed Decomposition and Planning with Language Models - ACL Anthology"))

The phenomenon can therefore be framed as:

**amortized generation substituting for explicit problem solving.**

Or, more specifically:

> The LLM **simulates the output of a problem-solving process without necessarily instantiating and executing that process**.

There is one important qualification. Saying it "just generates from its weights" is directionally right but technically too strong. Autoregressive generation itself involves inference-time computation, and internal activations can implement some reasoning. The final prose alone generally does not reveal whether a particular intermediate computation happened internally. The observable failure is that the system hasn't made the necessary **problem structure, subtasks, dependencies, verification, or external work operational** before committing their supposed results to the answer.

This also explains why the original examples reflect one property:

- an unsupported assumption,
- invented delivery stages,
- an architecture selected before requirements are investigated,
- conclusions that require research that hasn't happened,
- recommendations that depend on an evaluation that wasn't done.

They are all cases where the model **amortizes away a computation that the current task actually requires**.

A useful terminology stack would therefore be:

**Underlying mechanism:** amortized generation / amortized problem solving

**Missing capability:** explicit or deliberative problem solving

**Specific failure:** skipped task-specific computation

**Observable symptom:** the answer contains outputs of unresolved subtasks

An LLM evaluation criterion for this property could be called **task-specific deliberation**:

> **Task-specific deliberation:** whether the system identifies and performs the problem-specific work required to justify its answer, instead of directly generating plausible outputs from its learned prior.

That term gets closer to the fundamental property under discussion than "task-structure awareness." Task-structure awareness is one prerequisite. The deeper question is whether the model **actually performs the task-specific computation that the answer presupposes**.
