---
draft: false
toc: true
title: "Trace Data Analysis"
description: "Finding patterns across many traces: exploratory analysis and clustering to form hypotheses, confirming a pattern by reading traces, semantic search for similar traces, and treating causal claims as hypotheses."
linkTitle: "Trace Data Analysis"
---

[Error analysis]({{< ref "ai-engineering/concepts/evaluation/error-analysis" >}}) reads traces one at a time. Data analysis looks across many traces at once to decide which ones to read closely. Its output is a hypothesis, and a pattern in a chart or a cluster becomes a failure mode only after someone reads the traces behind it. ([Shankar and Husain 2026](#shankar-2026))

## Looking for patterns


Exploratory data analysis means plotting, grouping, and filtering data until a hypothesis is sharp enough to test. For traces, the book clusters them and reads a few from each cluster, and looks at per-trace measures such as turns, latency, tool calls, tokens, and user feedback: how they are distributed, how they relate to each other, and how they differ by user segment or agent version. A distribution with two peaks often mixes two groups or two failures, and traces far outside the usual range are worth reading. Reading 20 traces from one slice, such as all thumbs-down sessions, shows patterns that reading one at a time misses. ([Shankar and Husain 2026](#shankar-2026))

The choice of what to cluster changes what shows up. In the book's real estate example, clustering the queries gave only the obvious groups, and clustering the final emails found a group that opened with a long apology, a tone problem error analysis had missed. Most first attempts lead nowhere, and that is expected. ([Shankar and Husain 2026](#shankar-2026))

## Confirming a pattern


A cluster can contain several unrelated failures that look alike. To confirm it, the book reads 20 traces from it, writes a testable criterion from what it sees, and checks that the criterion holds for 70% to 80% of them. If it does, the pattern becomes a failure mode in the taxonomy; if not, the cluster is split or looked at again. When an LLM extracts features for clustering, its extraction is checked on a few hand-labeled traces first. ([Shankar and Husain 2026](#shankar-2026))

Once a failure mode is known, semantic search finds more traces like it, starting from one bad trace or from a description of the failure. Embedding similarity often follows topic words, so two traces about tour scheduling look alike even when only one double-booked a showing. Embedding a short list of features extracted from each trace, such as whether the agent booked a tour, gets closer to the kind of similarity the team is looking for. ([Shankar and Husain 2026](#shankar-2026))

## Causes and confounders


A pattern can come from a third factor. Traces with many tool calls may fail more often because complex queries need more tool calls and are harder, so the book splits the data by likely confounders, such as query complexity or user segment, before drawing a conclusion. Any explanation of why traces fail is a hypothesis, including one from an AI assistant, which sounds convincing whether or not it's right. The test is to change one thing, such as the prompt or a tool, and compare results on a golden dataset before and after. ([Shankar and Husain 2026](#shankar-2026)) The evaluation framework keeps causes apart in the same way, as [cause hypotheses]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#cause-hypothesis) that need diagnostic evidence.

Coding assistants such as Claude Code or Codex speed up the mechanics: loading traces, plotting, clustering, and searching. The book uses them to find, summarize, search, and plot, and keeps the analysis itself with the team. Every analysis session also includes a random sample of traces, because clusters, outliers, and search results all lean toward unusual cases. ([Shankar and Husain 2026](#shankar-2026))

## References


- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapter 11. O'Reilly. ^shankar-2026
