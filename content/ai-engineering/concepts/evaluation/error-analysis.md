---
draft: false
toc: true
title: "Error Analysis"
description: "Reading traces to find how an AI application fails: the starting set of traces, open and axial coding, labeling and counting failure modes, saturation, and the grounded theory terms behind the method."
linkTitle: "Error Analysis"
---

**Error analysis** is reading an application's traces and cataloguing how it fails. Its main output is a **failure taxonomy**: a set of failure modes, each with a definition and examples, specific to this application. The taxonomy gives the team a shared vocabulary for how the system fails, and the [evaluators]({{< ref "ai-engineering/concepts/evaluation/evaluators" >}}) built later each measure one of its failure modes. If the taxonomy doesn't match the failures users meet, those evaluators measure the wrong things. ([Shankar and Husain 2026](#shankar-2026))

## Queries and traces


A **query** is the raw request sent to the system, by a person or by another system. A **trace** is the ordered record of everything the system did in response: every LLM message, every tool call and the value it returned, and the final response. Error analysis reads whole traces, because a step can look reasonable alone and still lead to a wrong final output, and reading the whole trace shows where a problem starts. An LLM's outputs vary, so one trace shows one possible execution. A failure that seems intermittent needs the same query run several times. ([Shankar and Husain 2026](#shankar-2026))

## The starting set of traces


The book suggests starting with about 100 traces. The signal to stop is **saturation**: new traces stop showing new kinds of failure. Simple applications saturate sooner than agents with many tools and steps. ([Shankar and Husain 2026](#shankar-2026))

The traces come from one of two places ([Shankar and Husain 2026](#shankar-2026)):

- **Production logs,** where they exist. Sample across features and kinds of input, using clustering on large logs, and include traces where users had a bad experience: a thumbs-down, a request rephrased several times, or a session that moved to another channel. Domain experts often know the hard queries before the data shows them.
- **Synthetic queries,** where no logs exist yet. Asking an LLM directly for user queries gives generic, repetitive ones. The book first defines **dimensions** along which queries vary, such as feature, client persona, and how clearly the request is stated, then writes **tuples** that combine one value from each dimension, and then turns each tuple into a query. The dimensions should describe where the application is likely to fail.

Before running the queries, the book suggests writing down what you expect the system to do and where you expect it to fail, since the comparison shows assumptions you didn't know you had. The traces should be exported whole, often to a spreadsheet with one row per trace. ([Shankar and Husain 2026](#shankar-2026))

## Open coding


**Open coding** is reading each trace and writing a short free-form note about what went wrong. The notes don't follow a fixed list of categories, so the categories can come from what the traces show. A note is a phrase or a sentence, informal, with enough context that a teammate understands it without rereading the trace. ([Shankar and Husain 2026](#shankar-2026)) For example, a note might say that the SQL query dropped the pet-friendly filter the user asked for, or that the email's casual tone doesn't fit an investor client.

The book's practices for open coding ([Shankar and Husain 2026](#shankar-2026)):

- **Read as the user.** Ask whether the user is having a good experience and whether the response does what they asked. Note what went wrong without diagnosing it or planning a fix.
- **Start with the first failure.** The first failure is usually the most upstream one, and later problems are often its consequences. Fixing it often fixes the chain.
- **Give each trace a binary judgment,** acceptable or unacceptable. A forced choice sharpens what counts as a failure.
- **Use known failure types as lenses** when a trace feels wrong and the problem is hard to name. Looking for hallucination, or for policy contradictions in a support bot, helps find problems without forcing traces into fixed categories.
- **Continue** until at least 20 traces have problems and new failure modes stop appearing.
- **Don't hand open coding to an LLM.** It needs the team's judgment of what counts as a failure.

## Axial coding


**Axial coding** groups the open-coding notes into failure modes: distinct kinds of failure that recur. Some groups are obvious, such as ignoring a buyer's budget and omitting a required number of bedrooms, which both violate a user's constraints. Others appear only after more traces. Inventing property features and inventing client activity can look like one failure, and the book splits them into hallucinated listing metadata and hallucinated user actions because they have different causes and need different fixes. Categories can be split or merged later. ([Shankar and Husain 2026](#shankar-2026))

An LLM can propose groupings from the open-coding notes and the traces. The team reviews its proposal, because the model doesn't know how the system works or how each failure would be fixed, so it may merge failures that should stay apart or split ones that belong together. The book warns against asking an LLM for a taxonomy before any open coding: models lean toward generic categories, such as hallucination, instruction following, and tone, and miss failures specific to the application. ([Shankar and Husain 2026](#shankar-2026)) At NurtureBoss, the team wrote open-ended notes on each conversation in a spreadsheet, used an LLM to build a taxonomy from the notes, mapped each conversation to failure modes, and counted them. Three issues accounted for over 60% of all problems. ([Husain 2025](#husain-2025))

## Labeling and counting


With the taxonomy, each trace is labeled again: one column for each failure mode, with 1 when the failure is present and 0 when it is absent. Dividing each column's count by the number of traces gives each failure mode's **prevalence** in the set, and the counts can be split by dimension. An LLM can assign these labels from each trace's notes, if someone reviews its assignments. Traces that fit no failure mode, or fit one badly, show where a definition needs work. ([Shankar and Husain 2026](#shankar-2026))

Labeling only the first failure has a limit: it undercounts failure modes that tend to occur late in a trace, after an earlier failure. To measure whether a fix works, the book labels every occurrence of the failure mode being fixed. This is **exhaustive labeling** for that failure mode, without relabeling all the others. ([Shankar and Husain 2026](#shankar-2026))

## Iteration and saturation


Error analysis usually takes two or three rounds of reading traces and revising the taxonomy: merging categories that can't be told apart reliably, splitting ones that mix failures with different causes, and clarifying definitions. A later round may find a new failure mode, such as a city name resolved to the wrong state without a clarifying question. Two serious rounds often come close to theoretical saturation on one set of traces. After a fix, a release to more users, or a change in how people use the product, the analysis starts again with fresh traces. ([Shankar and Husain 2026](#shankar-2026))

The criteria themselves change during this work, as described under criteria drift in [Rubrics and annotator agreement]({{< ref "ai-engineering/concepts/evaluation/rubrics-and-annotator-agreement" >}}#criteria-drift). People need criteria to grade outputs, and grading outputs is how they find the criteria, so the definitions of the failure modes are refined while people read traces. ([Shankar et al. 2024](#shankar-2024))

Looking across many traces at once, with clustering, distributions, and semantic search, is covered in [Trace data analysis]({{< ref "ai-engineering/concepts/evaluation/trace-data-analysis" >}}).

## Automated error analysis


Several evaluation platforms and coding agents now read traces and report failures on their own. On 100 labeled production traces of an apartment-leasing assistant, the best tool found 87% of the failures that people had labeled, and every tool found minor issues that the people had missed. Every tool also missed the same kind of failure: traces that read as correct and fall short of the product's goal, such as giving up at a prospect's first objection, Markdown in text messages, talking over callers, and missed handoffs to a human. These failures need product context that isn't in the trace. The tools also flagged issues that weren't failures, and some rated them as more severe than they were. The authors recommend annotating traces yourself and letting an AI tool learn from the annotations as you go. ([Saha and Husain 2025](#saha-2025))

## Common pitfalls


The book lists these ([Shankar and Husain 2026](#shankar-2026)):

- **Traces that don't represent real use.** If the queries lack the variety and difficulty of real requests, either no serious failures show up or the ones that do aren't the ones production would show.
- **Skipping open coding.** Generic categories, such as hallucination or verbosity, and off-the-shelf metrics sound useful and miss the failures that cost this application most.
- **Rating on a 1-to-5 scale without a detailed rubric.** Annotators agree less and vary more. A binary decision on one failure mode gives more reproducible labels.
- **Treating the taxonomy as fixed.** Freezing it early builds evaluation infrastructure around an incomplete picture.
- **Leaving domain experts out of labeling.** Annotators without domain knowledge give shallow or wrong labels.

## Grounded theory terms


The book adapts open and axial coding from grounded theory, a qualitative research method, and uses them pragmatically. ([Shankar and Husain 2026](#shankar-2026)) Grounded theory began with Glaser and Strauss, who set out theoretical sampling and the constant comparative method. ([Glaser and Strauss 1967](#glaser-1967)) Charmaz's constructivist version defines the terms this vault's framework uses ([Charmaz 2014](#charmaz-2014)):

- **Initial coding:** the first pass of defining what happens in the data.
- **Focused coding:** taking the most frequent or significant initial codes, testing them against larger amounts of data, and raising the strongest to tentative categories.
- **Constant comparison:** comparing data with data, data with codes, codes with codes, and codes with categories, to build more general concepts step by step.
- **Theoretical sampling:** choosing new data to develop the properties of a tentative category, after one exists, and without trying to represent a population.
- **Theoretical saturation:** the point at which more data about a category shows no new properties.
- **Axial coding:** treating one category as an axis and relating its subcategories and dimensions to it. It is a procedure applied to the data.

The book's axial coding, grouping notes into failure modes, is closer to Charmaz's focused coding and categorizing than to her definition of axial coding.

## Terms used elsewhere in this vault


The [failure understanding]({{< ref "ai-engineering/evaluation/framework-v2/failure-understanding" >}}) method of the evaluation framework follows Charmaz's terms, and its [evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#failure-knowledge-and-diagnosis) names the objects:

|This note, after the book|The evaluation framework|
|---|---|
|Open-coding note|Observation, or a failure incident when it is judged under an evaluation basis; also an initial code|
|Axial coding|Focused codes, then failure categories|
|Failure mode in the taxonomy|Failure category; an operational failure mode once it is chosen for repeated measurement|
|Failure taxonomy|Failure taxonomy; the failure model adds variation, conditions, relationships, and consequences|
|First failure|First observable failure|
|1 or 0 for a failure mode|`PRESENT` or `ABSENT`|
|Saturation after about 100 traces and two rounds|No fixed count: theoretical sampling picks the next cases until they stop changing the categories|

The two differ in how they treat causes. The book splits failure modes partly by cause and fix, and expects that fixing the first failure often fixes what follows. The framework defines a category by the behavior alone, records causes as separate hypotheses that need diagnostic evidence, and says the first observable failure isn't necessarily the root cause.

## References


- Charmaz, K. (2014). [Constructing Grounded Theory](/sources/13da3beb3d611915751782b45ab1faf8.bin). Second edition. SAGE. ^charmaz-2014
- Glaser, B. G. and Strauss, A. L. (1967). [The Discovery of Grounded Theory: Strategies for Qualitative Research](/sources/9770487259f3f344ce2a0749d1c5599c.bin). Aldine. ^glaser-1967
- Husain, H. (2025). [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/index.html). Local copy. ^husain-2025
- Saha, A. and Husain, H. (2025). [Do Automated Evals Work?](https://parlance-labs.com/blog/posts/auto-evals/index.html). Local copy. ^saha-2025
- Shankar, S. et al. (2024). [Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences](https://arxiv.org/abs/2404.12272). arXiv:2404.12272. ^shankar-2024
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapter 3. O'Reilly. ^shankar-2026
