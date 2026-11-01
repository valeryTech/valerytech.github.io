---
draft: false
toc: true
title: "Traces and Executions"
description: "What evaluation reads: queries, traces, spans, and sessions, what a trace records, the levels of a multi-turn conversation, and why one query is run several times."
linkTitle: "Traces and Executions"
---

Evaluation reads records of what an AI application did. This note defines those records and the terms around them. How the records are read for failures is in [Error analysis]({{< ref "ai-engineering/concepts/evaluation/error-analysis" >}}), and how they are judged is in [Evaluators]({{< ref "ai-engineering/concepts/evaluation/evaluators" >}}).

## Query, trace, span, and session


- A **query** is the raw request sent to the system. It can come from a person, an automated pipeline, a scheduled job, or another system calling the application's API. ([Shankar and Husain 2026](#shankar-2026))
- A **trace** is the ordered record of everything the system did in response to one query: every LLM message, every tool call and the value it returned, and the final response shown to the user. ([Shankar and Husain 2026](#shankar-2026)) It covers every agent, tool, and component involved, including retrieved documents. ([Husain and Shankar 2025](#husain-shankar-2025))
- A **span** is one step within a trace, such as one LLM call, one tool call, or one database query.
- A **session** groups the traces of one multi-turn conversation. ([Shankar and Husain 2026](#shankar-2026))

Observability vendors define traces and spans differently, so the same word can name different units in two tools. ([Husain and Shankar 2025](#husain-shankar-2025))

## What a trace records


For each production request, or a sample of them, the book captures ([Shankar and Husain 2026](#shankar-2026)):

- the input and its metadata, such as user and session IDs and feature flags;
- every LLM call, with its prompt, response, and any intermediate reasoning;
- every tool call, with its name, arguments, response, and errors;
- the documents retrieved in a RAG pipeline;
- the final output shown to the user;
- user feedback, such as a thumbs-up or thumbs-down, an edit, or a follow-up;
- the results of any evaluators that ran.

Tools such as LangSmith, Arize Phoenix, and W&B Weave, or an OpenTelemetry integration, store and display these records. The book recommends reviewing a sample of production traces every day. ([Shankar and Husain 2026](#shankar-2026))

## Reading whole traces


An evaluation reads the whole trace, because an agent's behavior makes sense only end to end. One step can look reasonable alone and still lead to a wrong final output, and reading the whole trace shows where the problem starts. ([Shankar and Husain 2026](#shankar-2026))

A multi-turn conversation can be judged at three levels ([Shankar and Husain 2026](#shankar-2026)):

- **Session level:** whether the conversation as a whole achieved the user's goal, usually as one Pass or Fail. The book starts here, since it gives the broadest signal for the least effort.
- **Turn level:** each turn of a failing session, read to find where it went wrong. This is for diagnosis.
- **Coherence:** properties that exist only across turns, such as whether the assistant keeps track of facts stated earlier in the conversation.

An application that keeps memory between sessions adds further questions: whether it stores a new fact, retrieves the right facts in a later session, and updates a fact that changed. ([Shankar and Husain 2026](#shankar-2026))

## Repeated runs of one query


An LLM's outputs vary, so the same query can produce different traces, and one trace shows only one possible execution. A failure that seems intermittent needs the same query run several times to see how often it happens. ([Shankar and Husain 2026](#shankar-2026))

Two metrics summarize repeated runs of the same task ([Yao et al. 2024](#yao-2024)):

- **pass@k** is the chance that at least one of \(k\) independent runs succeeds. It fits tasks with a reliable check, such as code with unit tests, where one success can be picked.
- **pass^k** is the chance that all \(k\) independent runs succeed, averaged across tasks. It fits tasks where the system must succeed every time, such as customer service. In τ-bench's retail tasks, a GPT-4o agent with function calling succeeded on about 61% of tasks in one run, and on fewer than 25% in all of eight runs.

An evaluation result is an estimate from a sample of questions and runs, so it needs error bars. Miller treats evaluations as experiments: report a standard error, cluster it when questions come in related groups, and reduce variance by sampling several answers to each question. ([Miller 2024](#miller-2024))

## Terms used elsewhere in this vault


The [evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}) of the evaluation framework separates three things that the book's "trace" covers:

|This note, after the book|The evaluation framework|
|---|---|
|Query|User input, part of an evaluation case or a production sample|
|One run of the system on a query|Execution: one run against identified product, model, configuration, environment, and data versions|
|Everything the system did|Trajectory: the actual sequence of behavior and state changes, which can't usually be reconstructed in full|
|Trace: "the complete, ordered record"|Trace: the record captured about an execution, which is evidence only in relation to a named claim and may omit behavior that occurred|
|What to log for each request|Capture contract: the evidence one evaluation requires|
|Running the same query several times|Repeats; their spread decides whether a difference between versions counts|

The main difference is completeness. The book defines a trace as complete. The framework assumes a trace can miss things, such as the channel a message went through or what a voice agent did while the caller spoke, and states which evidence each evaluation needs. The framework also takes the case, not the run, as the unit: repeats of one case are summarized first, and then cases are counted.

## References


- Husain, H. and Shankar, S. (2025). [Q: What is a trace?](https://hamel.dev/blog/posts/evals-faq/what-is-a-trace.html). Local copy. ^husain-shankar-2025
- Miller, E. (2024). [Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations](https://arxiv.org/abs/2411.00640). arXiv:2411.00640. ^miller-2024
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 3, 6, and 9. O'Reilly. ^shankar-2026
- Yao, S. et al. (2024). [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045). arXiv:2406.12045. [PDF](/sources/271cbb826296fcfb4c240f8c381566ad.bin). ^yao-2024
