---
draft: false
toc: true
title: "Test Data"
description: "Where evaluation inputs come from: production traces and how to sample them, synthetic queries from dimensions and tuples, golden datasets for regression checks, and how test data goes stale."
linkTitle: "Test Data"
---

An evaluation needs inputs to run the application on. They come from production traffic, from synthetic queries, or from a curated set kept for regression checks. Each source supports different conclusions. What a run of these inputs records is in [Traces and executions]({{< ref "ai-engineering/concepts/evaluation/traces-and-executions" >}}).

## Production traces


Real traces are the preferred source where they exist. ([Shankar and Husain 2026](#shankar-2026)) Common ways to choose traces for review, from the most exploratory to the most targeted ([Husain and Shankar 2025b](#husain-shankar-2025b)):

|Method|What it does|Main limit|
|---|---|---|
|Random|Picks traces with equal probability|A small batch can miss rare cases|
|Clustering|Groups similar traces and picks examples from each group|Depends on the features and clustering choices|
|Data analysis|Picks extreme values, such as long latency or many tool calls|An extreme value may have nothing to do with quality|
|Classification|Uses an evaluator or another model to flag likely failures|Favors failures the classifier already knows|
|Feedback|Picks traces with negative user feedback|Misses problems users don't report|

Early on, the sampling should explore. As the team learns, it can lean more on signals. Every batch keeps some random traces, so failures that no current signal describes can still appear. A rare failure is found by targeted sampling on signals that go with it, such as a tool sequence, retries, or a known input pattern. ([Husain and Shankar 2025b](#husain-shankar-2025b)) Signs of a bad experience include a thumbs-down, a request rephrased several times, and a session that moved to another channel. ([Shankar and Husain 2026](#shankar-2026))

## Synthetic queries


Synthetic queries fill the gap before an application has enough traffic, or test a known failure that real data shows rarely. Asking an LLM directly for test queries gives generic, repetitive ones that test the same capability in different words. ([Shankar and Husain 2026](#shankar-2026); [Husain and Shankar 2025a](#husain-shankar-2025a))

The book's method adds a step between the LLM and the queries ([Shankar and Husain 2026](#shankar-2026)):

1. **Define dimensions.** A **dimension** is one axis along which requests differ, such as the feature a user wants, the client persona, or how clearly the request is stated. Three varied dimensions are enough to start. They should describe where the application is likely to fail, and using the application, or watching a few people use it, gives the first hypotheses.
2. **Write tuples.** A **tuple** is one value from each dimension, such as (property search, investor, ambiguous), and describes one use case. Writing about 20 tuples by hand builds an understanding of the problem space.
3. **Generate more tuples, then queries.** An LLM generates more tuples in one prompt, and turns each tuple into a natural-language query in a separate prompt. Separating the two steps keeps the queries varied.
4. **Filter.** Rewrite or discard awkward and unrealistic queries until about 100 good ones remain.

Tuples can also come from the full cross product of the dimensions, filtered by an LLM, which covers every combination including edge cases and fits when most combinations are valid. Generating tuples directly with an LLM gives more realistic combinations, tends toward generic ones, and misses rare scenarios, so it fits when many combinations are invalid. ([Husain and Shankar 2025a](#husain-shankar-2025a))

Synthetic data can't show how common a failure is in production, and it can mislead where an LLM can't produce realistic inputs ([Husain and Shankar 2025a](#husain-shankar-2025a); [Husain and Shankar 2025c](#husain-shankar-2025c)):

- complex domain documents, such as legal filings or medical records;
- low-resource languages and dialects;
- inputs whose realism no one can check;
- high-stakes domains, such as medicine, law, or emergency response;
- user groups that the model represents poorly, where synthetic data can repeat the model's biases.

Synthetic queries should be compared with real data as soon as real data exists. A failure that a prompt change can fix needs no synthetic data: if the prompt never mentions dietary restrictions, fix the prompt. ([Husain and Shankar 2025a](#husain-shankar-2025a))

## Golden datasets


A **golden dataset** is a hand-curated set of inputs with reference outputs, used to catch regressions in continuous integration. It holds examples of the core features, past critical failures, edge cases found in error analysis, and inputs that exercise particular tools, retrieval paths, or prompt branches. It is purpose-built and isn't a random sample of production. The book suggests starting with 20 to 50 examples and growing to 100 to 200 as new failure modes are confirmed, adding an example only for a behavior worth preserving. Checks on it are reference-based, and an LLM judge used there runs on a pinned model version. ([Shankar and Husain 2026](#shankar-2026))

A golden dataset says little about overall quality. Passing it means the application still handles the cases tested, as a smoke test does. Its examples must stay out of the application's prompts and the LLM judges' prompts, since an example the model has seen no longer tests generalization. The book recommends an automated check on every commit that compares golden inputs with prompt content. How CI runs the golden dataset is in [CI and online monitoring]({{< ref "ai-engineering/concepts/evaluation/ci-and-online-monitoring" >}}#continuous-integration). ([Shankar and Husain 2026](#shankar-2026))

## Keeping test data current


Test data goes stale as the product and its users change. Regular error analysis finds new problems to add, and examples that no longer exercise live code paths are retired or replaced. ([Shankar and Husain 2026](#shankar-2026)) An evaluation that always passes gives little signal and can run less often or be retired, expensive LLM judges first. Scores on a changed set aren't directly comparable with earlier scores, so progress over long periods is better tracked with product metrics, such as churn or active users. ([Husain and Shankar 2026](#husain-shankar-2026))

## Terms used elsewhere in this vault


The evaluation framework's [cases, fixtures, and coverage]({{< ref "ai-engineering/evaluation/framework-v2/cases-and-coverage" >}}) note uses these terms:

|This note, after the book|The evaluation framework|
|---|---|
|Query|User input; an evaluation case adds fixtures, conditions, and the expectations that apply|
|Dimension, tuple|Dimension, tuple, with the rule that a dimension must be identifiable from the user's input|
|Synthetic query|Generated user input, made from approved tuples|
|Golden dataset|Regression set, or a commitment or release set|
|Sample of production traces|Production sample|
|Traces for error analysis|Exploratory or discovery sample|
|Examples, tuning set, and validation set for an LLM judge|Evaluator validation set; see [Evaluator alignment]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}})|

The framework adds a **fixture**, the data, permissions, tools, and state that make a case executable, and an **expected condition**, which confirms that the intended situation was set up without prescribing one response. It also names sets the book doesn't, such as a comparison set and a challenge set, and states for each what its results can support. For example, a challenge set's failure rate doesn't estimate a production failure rate.

## References


- Husain, H. and Shankar, S. (2025a). [Q: What is the best approach for generating synthetic data?](https://hamel.dev/blog/posts/evals-faq/what-is-the-best-approach-for-generating-synthetic-data.html). Local copy. ^husain-shankar-2025a
- Husain, H. and Shankar, S. (2025b). [Q: How can I efficiently sample production traces for review?](https://hamel.dev/blog/posts/evals-faq/how-can-i-efficiently-sample-production-traces-for-review.html). Local copy. ^husain-shankar-2025b
- Husain, H. and Shankar, S. (2025c). [Q: Are there scenarios where synthetic data may not be reliable?](https://hamel.dev/blog/posts/evals-faq/are-there-scenarios-where-synthetic-data-may-not-be-reliable.html). Local copy. ^husain-shankar-2025c
- Husain, H. and Shankar, S. (2026). [Q: What should I do when my "gold" eval dataset becomes stale?](https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-my-gold-eval-dataset-becomes-stale.html). Local copy. ^husain-shankar-2026
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 3 and 9. O'Reilly. ^shankar-2026
