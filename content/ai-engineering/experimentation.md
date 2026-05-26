---
draft: false
toc: true
title: "Experimentation"
linkTitle: "Experimentation"
---
# Disciplined AI Experimentation


**Objective:** Define the systemic framework for transitioning AI development workflows from uncontrolled, intuition-based iterations to evidence-driven, decision-grade engineering.

The engineering problem is not to eliminate experimentation. The engineering problem is to make experimentation **controlled, observable, reproducible, and decision-grade**.

So the contrast should not be:

> guesswork -> engineering

A better contrast is:

> uncontrolled experimentation -> disciplined experimentation

or:

> intuition-only iteration -> evidence-driven iteration

## System Assumptions and Constraints


To design an effective experimentation infrastructure, we must explicitly bound the system with the following operational realities:

- **Non-Determinism:** Foundational models introduce inherent stochasticity. System design assumes exact output replication is rarely guaranteed; reproducibility focuses on replicating the _distribution_ of outcomes and exact state configurations.
- **Eval-Driven Bottlenecks:** Ground-truth evaluations often require human-in-the-loop (HITL) review. Automated proxy metrics (e.g., LLM-as-a-judge) operate under the constraint of imperfect alignment with human preference.
- **Cost and Latency:** Exhaustive regression testing across all model parameters and prompts scales linearly in cost and time. The architecture must support statistical sampling and multi-tiered evaluation pipelines.
- **Data Drift:** The operational environment is highly dynamic. Data distributions and user behaviors will shift, requiring continuous feedback loops to update baseline evaluation sets.
- and others. #todo add link to AI System Core Properties

# Connections


- [Ebse]({{< ref "engineering/ebse" >}}) - Empirical Software Engineering
- [Exploratory Design]({{< ref "engineering/delivery-techniques/exploratory-design" >}})
- science method

Treude and Storey (2025) note that generative AI forces software engineering to adapt traditional empirical research methods to capture the new, probabilistic dynamics of AI tools. Because AI models act as "general-purpose technologies," developers are shifting from writing code to designing, evaluating, and refining experimental solutions. This necessitates the exact kind of structured experimentation pipelines

Treude, C., & Storey, M.-A. (2025). Generative AI and Empirical Software Engineering: A Paradigm Shift. arXiv. https://doi.org/10.48550/arxiv.2502.08108

# Reasoning


Experimentation is necessary in AI Systems Engineering because AI systems are **empirical systems**, not purely deterministic software systems.

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

You cannot reliably infer these answers from architecture diagrams.

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


You can evaluate a model on benchmarks or test sets, but production behavior often differs.

Offline evaluation may tell you:

> "Model A has higher accuracy than Model B."

But production experimentation may reveal:

> "Model B gives slightly worse benchmark scores, but users complete tasks faster, complaints decrease, and cost is 40% lower."

AI systems need both offline evaluation and online experimentation because the real system includes users, product flows, traffic patterns, latency budgets, and failure modes.

### 4. Data changes over time


AI systems are exposed to distribution shift.

User behavior changes. Product catalogs change. Fraud patterns change. language changes. Business rules change. New edge cases appear. Model providers update APIs. Retrieval indexes become stale.

Experimentation helps detect whether a change improves the system under current conditions rather than historical assumptions.

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


A model that performs best may be too expensive or too slow. Experimentation helps find the operating point where quality, latency, and cost are acceptable.

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

These are empirical questions. You need red-teaming, adversarial testing, staged rollouts, monitoring, and regression suites.

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

Without experimentation, AI engineering becomes guesswork.
