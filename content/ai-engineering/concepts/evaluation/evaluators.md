---
draft: false
toc: true
title: "Evaluators"
description: "What an evaluator is, the kinds of evaluators (deterministic evaluators, LLM judges, and human review), reference-free and reference-based evaluation, and how LLM judge prompts are written."
linkTitle: "Evaluators"
---

An **evaluator** reads one trace, or one part of it, and gives a result for one failure mode: **Pass** when the failure is absent and **Fail** when it is present. Automated evaluators exist to estimate how often each failure mode occurs across many traces, which people can't label by hand at that scale. Each failure mode gets its own evaluator, built from the failure definition that [error analysis]({{< ref "ai-engineering/concepts/evaluation/error-analysis" >}}) produced. ([Shankar and Husain 2026](#shankar-2026))

How far an evaluator's results can be trusted is a separate question, covered in [Evaluator alignment]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}}).

## Which failure modes get an evaluator


Error analysis produces a list of failure modes. Before building evaluators, the book sorts them by where they come from ([Shankar and Husain 2026](#shankar-2026)):

- A **specification failure** comes from an unclear or incomplete prompt, such as a prompt that never says which fields an email must include. It is fixed by editing the prompt, so an evaluator for it is wasted effort.
- A **generalization failure** happens when the instructions are clear and the model still fails, such as omitting a price limit the prompt stated. Evaluators are built for these.

The book puts this as "fix ambiguity first, then measure generalization". An evaluator for a task the prompt never specified measures how well the model guesses the team's intent. Two frequent cases of specification failure are preferences the prompt never stated, such as concise answers, and a missing tool, such as a scheduling tool with no way to reschedule. ([Shankar and Husain 2026](#shankar-2026))

## Kinds of evaluators

### Deterministic evaluators


A **deterministic evaluator**, which the book calls a code-based evaluator, is code. It suits a failure definition that is objective and can be checked by a rule, for example ([Shankar and Husain 2026](#shankar-2026)):

- parsing structure, such as JSON validity or SQL syntax;
- regular expressions or string matching for required or forbidden phrases;
- counting, such as a summary having three bullet points;
- running a generated tool call and checking that it raised no error;
- simple logical checks, such as an output mentioning "pets allowed" when the query asked for a dog-friendly apartment.

Code evaluators are fast, cheap, deterministic, and easy to interpret. An **executability check** runs what the model produced, such as a SQL query against a test database or a simulated tool call, and checks that it works. ([Shankar and Husain 2026](#shankar-2026))

A deterministic evaluator checks only the letter of its rule. Valid JSON doesn't show that an answer is useful, and a successful tool call doesn't show that the user wanted the action. A word list fails a fair use of a listed word and passes the same meaning in other words.

### LLM judges


An **LLM judge** is a model, separate from the application, asked about one failure mode. It suits a failure that needs interpretation that code can't capture, such as whether a tone fits a client or a summary is faithful to its source. LLM judges work best on narrow, binary questions. ([Shankar and Husain 2026](#shankar-2026))

Zheng et al. introduced the term "LLM-as-a-judge" for models fine-tuned on large amounts of human preference data. Most teams lack that data and use an off-the-shelf model, aligned to the failure definition through its prompt. The same study found three biases ([Zheng et al. 2023](#zheng-2023); [Shankar and Husain 2026](#shankar-2026)):

- **Position bias:** comparing two responses, a judge favors the one shown first, or for some models the one shown second. GPT-4 showed this bias in about 26% of its judgments in the study.
- **Verbosity bias:** a judge rates longer responses higher when a shorter one is equally correct.
- **Self-enhancement bias:** a judge rates outputs of its own model higher than a neutral judge would.

An LLM judge is also inconsistent between runs and adds inference cost. Its results can't be trusted until they are compared with a domain expert's labels. ([Shankar and Husain 2026](#shankar-2026))

#### The parts of an LLM judge prompt


The book's prompt for an LLM judge has four parts ([Shankar and Husain 2026](#shankar-2026)):

1. **The task and one criterion.** The prompt asks about one well-scoped failure, such as whether "the tone is appropriate for a luxury buyer persona", and never whether an email is "good".
2. **Pass and Fail definitions.** Pass means the failure is absent and Fail means it is present, both taken from the failure description written during error analysis.
3. **Few-shot examples.** A clear Pass and a clear Fail, drawn from traces a domain expert labeled. They show the judge where the decision boundary lies.
4. **A structured answer.** A JSON object with a one- or two-sentence `reasoning` and then the `answer`, Pass or Fail.

The book names two common mistakes in these prompts. The most common is leaving out examples, which leaves the judge without grounding for what counts as a failure. The second is asking about several criteria at once, such as tone, correctness, and next steps in one Pass or Fail, which makes errors hard to diagnose. Splitting the criterion into narrower judges gives better alignment. ([Shankar and Husain 2026](#shankar-2026)) A judge for one failure, such as whether the assistant escalated to a human when policy required it, is easier to align and its results are easier to act on than a judge of overall conversation quality. ([Husain and Shankar 2026](#husain-shankar-2026))

Detailed critiques from the domain expert also make good examples. Including expert critiques as few-shot examples gave 15-20% higher agreement between the LLM judge and the expert, in Husain's experience. ([Husain 2025](#husain-2025))

### Human review


A person who knows the domain is an evaluator too, and the one every automated evaluator stands in for. The evaluation framework lists when it uses human review in [Judgment and findings]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}}#judgment-methods).

The book recommends one trusted domain expert who defines the failure modes, finalizes the rubric, and labels the traces needed for building and validating LLM judges, typically 100 to 200. The labels should come from people with context on the application. ([Shankar and Husain 2026](#shankar-2026)) When one expert isn't enough and several people label, see [Rubrics and annotator agreement]({{< ref "ai-engineering/concepts/evaluation/rubrics-and-annotator-agreement" >}}).

### Several evaluators on one trace


One trace can be read by several evaluators, each for its own failure mode, and each keeps its own result. The framework's rule for combining them is in [Judgment and findings]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}}#judgment-methods).

## Reference-free and reference-based evaluation


Each evaluator, deterministic or LLM judge, is either reference-free or reference-based ([Shankar and Husain 2026](#shankar-2026)):

- A **reference-free** evaluator checks the output against criteria, with no correct answer to compare with. For an email summarizer, it might check for a `Sender:` field, exactly three bullet points, and no details that the email doesn't contain. It can run on new, unlabeled traces, so it scales to monitoring and online use.
- A **reference-based** evaluator compares the output with a reference that someone labeled as correct, often called ground truth or a golden answer. It gives a clear right or wrong, and needs labeled data, which is expensive. It also penalizes a valid answer that differs from the one reference, so the book recommends it where there is a single correct answer, such as an extracted field. Reference-based evaluators are useful during prompt iteration and in continuous integration.

The book suggests designing both kinds for each important failure mode. For "missing SQL constraints", a reference-based evaluator compares the generated SQL's syntax tree with a reference query, and a reference-free one checks that a price mentioned in the input appears as a filter in the SQL. A Pass from each says something different: the reference-free result says the output keeps a rule, and the reference-based result says it agrees with the reference. ([Shankar and Husain 2026](#shankar-2026))

## Terms used elsewhere in this vault


The [evaluation framework]({{< ref "ai-engineering/evaluation/framework-v2" >}}) uses some other words for these concepts:

|This note, after the book|The evaluation framework|
|---|---|
|Deterministic (code-based) evaluator|Deterministic check|
|LLM judge|Model evaluator, model-based evaluation|
|Failure mode with its Pass and Fail definitions|Operational failure mode and its criterion|
|Fail|`PRESENT`: the failure mode occurs|
|Pass|`ABSENT`: the failure mode doesn't occur|
|A domain expert's label|Label with provenance `reference`|
|An evaluator's result|Raw evaluator result, or a label with provenance `evaluator-produced`|

The framework also records two results that the book's binary scale lacks: `NOT APPLICABLE`, when the failure mode doesn't apply to the trace, and `NOT JUDGEABLE`, when it applies but the evidence can't support a result. ([Judgment and findings]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}}))

## References


- Husain, H. (2025). [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/index.html). Local copy. ^husain-2025
- Husain, H. and Shankar, S. (2026). [Q: What should I do when I can't get my LLM judge to agree with human reviewers?](https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-i-cant-get-my-llm-judge-to-agree-with-human-reviewers.html). Local copy. ^husain-shankar-2026
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 2 and 5. O'Reilly. ^shankar-2026
- Zheng, L. et al. (2023). [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685). arXiv:2306.05685. ^zheng-2023
