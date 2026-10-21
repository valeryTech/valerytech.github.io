---
draft: false
toc: true
title: "Disciplined AI Experimentation"
description: "Explains why AI delivery needs controlled experiments with baselines, versioned configurations, representative cases, and production feedback to resolve quality, cost, and latency tradeoffs."
linkTitle: "Disciplined AI Experimentation"
---

**Objective:** Define a framework for moving AI development from uncontrolled, intuition-based iteration to evidence-driven engineering that supports decisions.

The engineering problem is not to eliminate experimentation. The engineering problem is to make experimentation **controlled, observable, reproducible, and decision-grade**.

The distinction should not be reduced to:

> guesswork -> engineering

A more useful distinction is:

> uncontrolled experimentation -> disciplined experimentation

or:

> intuition-only iteration -> evidence-driven iteration

## Experimental Approach


AI development is empirical: form hypotheses, use scientific methods, and prioritize the speed of useful experiments.

**Leverage for small teams:** build tools that reduce manual review, unblock migrations, help engineers diagnose incidents, and let domain experts iterate without waiting on platform changes

Augment human work rather than automate it.

## Ad Hoc AI Development


**Ad hoc AI development** means building or improving an AI system through informal, one-off, intuition-driven changes rather than through a defined engineering process.

In practice, it looks like this:

> Prompt changes judged only by whether the result feels better.
> "Try GPT-4.1 instead of this model."
> "Add more context to the RAG prompt."
> "The output looks good on these three examples, so ship it."
> Reports of worse user experience without evidence explaining the cause.

The problem is not experimentation. Experimentation is necessary in AI development. The problem is **uncontrolled experimentation**: no baseline, no test set, no defined success metric, no versioning, and no repeatable way to know whether a change improved the system or just made a few examples look better.

A non-ad hoc AI workflow would usually include:

| Ad hoc                      | More engineered                                    |
| --------------------------- | -------------------------------------------------- |
| Manual prompt tweaking      | Prompt/version tracking                            |
| "Looks better" judgment     | Evaluation metrics and rubrics                     |
| Testing on a few examples   | Fixed test sets / golden datasets                  |
| No baseline                 | Baseline model or prompt comparison                |
| Unclear failures            | Error taxonomy and failure analysis                |
| Hard to reproduce results   | Logged inputs, outputs, model versions, parameters |
| Shipping based on intuition | Deployment gates and regression checks             |

**"ad hoc AI development"** refers to AI work that is reactive, informal, and difficult to measure or reproduce. Alternative descriptions include:

> "intuition-driven AI development"

or:

> "trial-and-error AI development"

or, more precise:

> "unstructured AI experimentation without baselines, evals, or reproducible feedback loops."

## System Assumptions and Constraints


Plan comparisons around the conditions that could change their interpretation. The [model and system reference]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}}) gives background; the [focused checks]({{< ref "ai-engineering/causal-stack/checks" >}}) turn these concerns into concrete procedures.

- **Repeatability:** save relevant inputs, state, versions, and configuration. Repeat cases when variation matters to the decision, and judge task outcomes rather than identical wording.
- **Judgment:** define acceptable behavior with the responsible users or domain reviewers. Compare automated evaluators with those judgments before relying on their scores.
- **Cost and latency:** evaluation work grows with the cases, variants, and repetitions selected. Choose coverage according to the decision and budget; measure the cost of the resulting product workflow as well as the test run.
- **Changing conditions:** record source, model, tool, and environment changes. Keep a stable comparison set while also adding cases from current use, so historical comparisons and new coverage remain distinguishable.
- **Customer outcomes:** an offline behavioral improvement needs follow-up in the actual workflow. Use the [product-use cycle]({{< ref "ai-engineering/causal-stack/practical-checks" >}}) to assess correction effort, completion, and downstream rework.

# Connections


- [Ebse]({{< ref "ai/other/methodology/ebse" >}}) - Empirical Software Engineering
- [Exploratory Design]({{< ref "engineering/eng-exp/exploratory-design" >}})
- [Empirical Nature]({{< ref "ai-engineering/approach/empirical-nature" >}})
- [model and system behavior]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}})
- [Why Use Evaluation Harness]({{< ref "ai-engineering/evaluation/v1/why-use-evaluation-harness" >}})
- [Harness And Platform]({{< ref "ai-engineering/evaluation/v1/harness-and-platform" >}})
- [product behavior guide]({{< ref "ai-engineering/causal-stack" >}})
- science method

Treude and Storey (2025) note that generative AI forces software engineering to adapt traditional empirical research methods to capture the new, probabilistic dynamics of AI tools. Because AI models act as "general-purpose technologies," developers are shifting from writing code to designing, evaluating, and refining experimental solutions. This necessitates the exact kind of structured experimentation pipelines

Treude, C., & Storey, M.-A. (2025). Generative AI and Empirical Software Engineering: A Paradigm Shift. arXiv. https://doi.org/10.48550/arxiv.2502.08108

# Reasoning


Experimentation is necessary in AI Systems Engineering because AI systems are **[empirical systems]({{< ref "ai-engineering/approach/empirical-nature" >}})**, not purely deterministic software systems.

In conventional software engineering, if the logic is correct and the tests pass, the system often behaves predictably. In AI systems, especially those using machine learning or LLMs, behavior depends on data, prompts, model versions, retrieval quality, user inputs, distribution shifts, evaluation design, and runtime context. Many important properties cannot be proven from code inspection alone.

The main reasons are:

### 1. AI behavior is probabilistic


AI models do not simply execute explicit rules. They produce outputs based on learned statistical patterns. Small changes in prompts, data, temperature, retrieval context, or model version can significantly change results.

So experimentation is needed to answer questions like:

- Does this prompt actually improve answer quality?
- Does this retrieval strategy reduce hallucinations?
- Does a smaller model perform well enough?
- Does adding a tool improve task completion or just add latency?
- Does fine-tuning improve the target behavior or overfit?

Architecture diagrams alone cannot reliably establish these answers.

### 2. Requirements are often underspecified


For many AI systems, "correct" is not binary.

A search engine, recommender, chatbot, classifier, fraud detector, ranking system, or agentic workflow may have several competing objectives:

- accuracy
- helpfulness
- latency
- cost
- safety
- explainability
- user satisfaction
- fairness
- robustness
- conversion
- retention

Experimentation helps discover the trade-offs instead of assuming them.

Example: a more cautious AI assistant may reduce hallucinations but also become less useful. A more aggressive retrieval policy may improve factuality but increase latency and cost.

### 3. Offline metrics are not enough


Model behavior on benchmarks or test sets often differs from production behavior.

Offline evaluation may establish:

> "Model A has higher accuracy than Model B."

But production experimentation may reveal:

> "Model B gives slightly worse benchmark scores, but users complete tasks faster, complaints decrease, and cost is 40% lower."

AI systems need both offline evaluation and online experimentation because the real system includes users, product flows, traffic patterns, latency budgets, and failure modes.

This is why teams need a structured [evaluation harness]({{< ref "ai-engineering/evaluation/v1/why-use-evaluation-harness" >}}) rather than relying only on benchmark deltas or isolated demos.

### 4. Data changes over time


AI systems are exposed to distribution shift.

User behavior changes. Product catalogs change. Fraud patterns change. language changes. Business rules change. New edge cases appear. Model providers update APIs. Retrieval indexes become stale.

Experimentation helps detect whether a change improves the system under current conditions rather than historical assumptions. The [model and system reference]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}}) lists conditions to inspect when results change.

### 5. AI systems fail in subtle ways


Traditional bugs often produce visible failures: crashes, exceptions, wrong calculations.

AI failures may look plausible:

- confident but wrong answers
- biased recommendations
- degraded ranking quality
- incomplete retrieval
- unsafe advice
- over-refusal
- under-refusal
- prompt injection vulnerability
- silent regression after a model upgrade

Experimentation gives engineers a way to measure these failures systematically.

### 6. Architecture choices need empirical validation


In AI Systems Engineering, many design decisions are not obviously correct upfront:

- RAG vs. fine-tuning
- prompt engineering vs. supervised fine-tuning
- single-agent vs. multi-agent workflow
- larger model vs. smaller model with better retrieval
- reranking vs. larger context window
- structured outputs vs. free-form generation
- human-in-the-loop vs. full automation

Experimentation turns these from opinions into measured engineering decisions.

### 7. Cost and latency are first-class constraints


A model that performs best may be too expensive or too slow. Experimentation helps find the operating point where quality, latency, and cost are acceptable under the product's [cost and time constraints]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}}#inspect-the-whole-application).

For example:

> GPT-class model with full retrieval may produce the best answer, but a smaller model plus reranker may achieve 95% of the quality at 20% of the cost.

That can only be established through measurement.

### 8. Safety cannot be assumed


AI safety properties require continuous testing:

- Does the model leak sensitive data?
- Can it be prompt-injected?
- Does it follow policy boundaries?
- Does it produce harmful instructions?
- Does it mishandle private documents?
- Does it degrade under adversarial input?

These are empirical questions. Answering them requires red-teaming, adversarial testing, staged rollouts, monitoring, and regression suites.

### 9. User value is not always aligned with model metrics


A model can score well on an internal rubric but still be disliked by users.

For example, users may prefer answers that are shorter, more direct, more actionable, or better formatted, even if another answer scores higher on an academic benchmark.

Experimentation reveals whether the system works for the actual user and use case.

### 10. Experimentation creates feedback loops


AI systems improve through iteration:

1. Build a baseline.
2. Measure behavior.
3. Identify failure modes.
4. Change prompts, data, model, retrieval, tools, or UX.
5. Re-evaluate.
6. Deploy cautiously.
7. Monitor production outcomes.

This is the operational loop that [evaluation harnesses]({{< ref "ai-engineering/evaluation/v1/why-use-evaluation-harness" >}}) and [evaluation platforms]({{< ref "ai-engineering/evaluation/v1/harness-and-platform" >}}) are meant to support.

Without experimentation, AI engineering becomes guesswork.
