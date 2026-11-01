---
draft: false
toc: true
title: "Phased: building an AI product together with its evaluation subsystem"
description: "An example project that shows how building the evaluation subsystem beside an AI product makes a team's experiments faster and more reliable, shown on a report helper for auditors."
linkTitle: "Phased"
---

[`phased`](https://github.com/valery-judah/phased) is an example project. It shows, on a working product, one way to build an AI product: build its evaluation subsystem beside it from the start. The evaluation subsystem is the part that runs the product on test cases, judges what it produced, and compares one version with another. We advocate this approach because it makes a team's experiments faster and more reliable.

## Who it's for


AI engineers and product managers who have taken an AI system past its first demo and got stuck. Most teams start with a prompt, a few test inputs and one hand-written right answer for each, and compare each new answer with it as a whole, once. After a while this stops working. A fail doesn't say which part of the answer is wrong. A correct answer in other words fails. And after a change to the prompt, nobody can tell whether it helped, because the model gives different answers to the same input ([Atil et al. 2024](#atil-2024)).

These readers already know their way of working falls short and are looking for another. The project shows them the approach working on a product, lets them try it by hand, and says what it gives their team.

## Why build the evaluation beside the product


While a product is in discovery, the team doesn't yet know what a right answer is in every part, or which version is better. It learns by trying: each idea becomes a new version, run on the same cases as the version before it, judged and compared. How fast the team learns depends on how many experiments it can run, and how far it can trust each result. A team that's still learning to build AI products is in the same place: it learns how AI systems fail from what its experiments show.

An evaluation subsystem built beside the product makes those experiments:

- **Faster.** Trying an idea means changing one part, such as the prompt or the model, and running the same cases again. A new way of judging can be applied to the runs already made, with no new run. Runs can use answers written in advance, so the whole setup can be tried with no model and no cost. A mistake costs only a run.
- **More reliable.** Only one part changes between the versions compared, so a difference has a known cause. Each version runs several times, so a real difference can be told from chance. Each result leads back to exactly what produced it. What would count as success is written down before the runs, so a result can contradict what we expected.

Later, when people depend on the product, the same cases, records and judges give regression checks and evidence for a release, and cases from real use go back into the experiments.

## The words the evaluation uses


People can discuss and trust what an experiment shows only when they use the same words for the same things. "The run failed" can mean four different things: the run didn't finish, its record is missing something, the answer can't be judged, or the answer is wrong. Each needs a different fix. The project gives each concept one name and uses it everywhere, in the documents, the code and the files.

Making these words clear is one of the project's main directions, because it's what lets people understand the evaluation and what its results mean. Two pages hold them:

- [The evaluation concepts](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluation-concepts.md): the words for each stage of an experiment, from deciding what to ask to writing the finding, followed through the records of one real experiment.
- [The run model](https://github.com/valery-judah/phased/blob/main/docs/evaluation/run-model.md): what a run is, how it goes, and what its record must hold.

## The guarantees an experiment needs


An experiment compares versions and says whether a difference comes from the one change between them or from chance. Later, its records are judged again by new judges. That works only if certain things hold every time, so the project treats them as required guarantees:

- A name and version always mean the same content. Any change makes a new version.
- Each record names everything that could change what the model was sent, what came back, or how it was judged.
- Everything a record names can be fetched again.
- Records and results are only added, never changed.
- Nothing is dropped without saying so.
- The product never sees the expected answers, and a judge never knows which version wrote the answer it reads.
- The versions compared differ in one part only, and the same judges judge them.

If one of these breaks, an experiment still produces numbers, but they no longer say what changed or why. So the guarantees are a requirement of the approach. For each one, the project says whether code enforces it today or it's still kept by hand.

- [The experiment guarantees](https://github.com/valery-judah/phased/blob/main/docs/evaluation/experiment-guarantees.md): each guarantee, and what keeps it today.
- [Scenarios for the guarantees](https://github.com/valery-judah/phased/blob/main/docs/evaluation/guarantee-scenarios.md): each guarantee tried against things that go wrong or change.

## The example product


The approach is shown on a report helper for auditors. When an auditor reviews the journal entries posted to one account, the helper points their attention to the changes and patterns that need understanding, writes the questions that would close each open item, and says what it didn't assess.

Auditing suits the demonstration because a convincing answer can do harm: a polished summary makes the auditor less likely to look at what it left out. So the evaluation has to check what the helper missed as well as what it said. The helper is only the example, and it may change.

## What the first experiments showed


- Splitting one judge that checked three rules into three judges with one rule each showed that the product's own prompt asked the model to write a leading question. The combined judge had passed it.
- A cheaper model was compared with the current one, three runs each. It failed in a different place on each run, so a single run would have shown only one of its failures.

## Where it stands


It's a prototype in discovery. It runs offline on simulated cases, and nothing reaches a live auditor. What it can't tell us yet:

- How the helper does beyond the one case its main experiments run on.
- Whether its automated judges agree with a person. They're checked only on answers with faults planted on purpose.
- Whether the reference answers are right. No auditor has reviewed them yet.
- Whether the helper helps an auditor in their work.

The next step is to bring auditors in. Only an auditor can say what should be noticed in an account and what mustn't be missed, and their judgments are what the automated judges get checked against.

## What to read in the repository, in order


The repository holds many pages, most of them written while the work was going on. These sections, read in this order, take a reader from the problem they're stuck on to the result of one experiment. The pages are written to be read in Obsidian, so their own links between pages don't work on GitHub. The links below go straight to each section.

1. **Where teams get stuck.** One right answer, compared with each new answer as a whole and run once, stops saying what's wrong. Read [Symptoms of comparing whole answers](https://github.com/valery-judah/phased/blob/main/docs/log.md#symptoms-of-comparing-whole-answers) in the log.
2. **What the product must do decides what to check.** The product's role says what counts as a failure, and each requirement needs a check that reads it. Read [Two ways to fail](https://github.com/valery-judah/phased/blob/main/docs/product/framing.md#two-ways-to-fail), [Attention shadowing](https://github.com/valery-judah/phased/blob/main/docs/product/framing.md#attention-shadowing) and [The behavior to claim, and how to evaluate it](https://github.com/valery-judah/phased/blob/main/docs/product/framing.md#the-behavior-to-claim-and-how-to-evaluate-it) in the framing, then [What nothing reads](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluators/evaluation-basis.md#what-nothing-reads) in the evaluation basis: the requirements that no check reads yet.
3. **The words the evaluation uses.** "It ran", "everything was recorded", "it can be judged" and "it passed" are four separate questions. Read examples [2](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluation-concepts.md#2-a-run-that-completes-and-cant-be-read-four-questions-four-answers) and [3](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluation-concepts.md#3-judging-six-answers-judging) of the evaluation concepts, then [Words with more than one meaning](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluation-concepts.md#words-with-more-than-one-meaning). The same examples are drawn in an interactive page, [evaluation-concepts.html](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluation-concepts.html), which works once downloaded and opened in a browser. GitHub shows only its source.
4. **Passing every check isn't enough.** Two prompt versions can both pass every check and still differ a lot in what the user gets, and a judge can be wrong too. Read [the answers of two prompt versions side by side](https://github.com/valery-judah/phased/blob/main/docs/workstreams/ws001_v21_vs_v30_comparison.md), then [How an evaluator can be wrong](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluators/evaluators.md#how-an-evaluator-can-be-wrong), then how splitting one judge into three found a fault in the product's own prompt: rules [5](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluators/evaluator-history.md#5-the-split-into-three-llm-judges-11-25-2030) and [6](https://github.com/valery-judah/phased/blob/main/docs/evaluation/evaluators/evaluator-history.md#6-question-3-is-a-fault-of-the-prompt-and-the-evaluators-stay-11-25-2102) of the evaluator history.
5. **Why repeats, and one change at a time.** A model gives different answers to the same message, and "the new version did better" always has other explanations. Read [What else could explain a result](https://github.com/valery-judah/phased/blob/main/docs/evaluation/experiment-model.md#what-else-could-explain-a-result), [Repeats come first](https://github.com/valery-judah/phased/blob/main/docs/evaluation/experiment-model.md#repeats-come-first) and [What the records already tell](https://github.com/valery-judah/phased/blob/main/docs/evaluation/experiment-model.md#what-the-records-already-tell) in the experiment model, then [What to expect at today's size](https://github.com/valery-judah/phased/blob/main/docs/evaluation/analysis.md#what-to-expect-at-todays-size) in the analysis.
6. **Why the guarantees are required.** The section above lists them, and these pages show what each one protects. Read [What an experiment needs](https://github.com/valery-judah/phased/blob/main/docs/evaluation/guarantee-scenarios.md#what-an-experiment-needs), then [The guarantees](https://github.com/valery-judah/phased/blob/main/docs/evaluation/experiment-guarantees.md#the-guarantees), then [A content changed while its ref stayed](https://github.com/valery-judah/phased/blob/main/docs/evaluation/guarantee-scenarios.md#a-content-changed-while-its-ref-stayed), where a rule kept by hand broke and nothing showed it.
7. **One experiment, from question to finding.** Read [Failures, one by one](https://github.com/valery-judah/phased/blob/main/docs/findings/ap-understanding-haiku-compare@1.md#failures-one-by-one), [What the design could and couldn't have shown](https://github.com/valery-judah/phased/blob/main/docs/findings/ap-understanding-haiku-compare@1.md#what-the-design-could-and-couldnt-have-shown) and [After the analysis changed](https://github.com/valery-judah/phased/blob/main/docs/findings/ap-understanding-haiku-compare@1.md#after-the-analysis-changed) in the finding on Haiku 5.5 beside Sonnet 5.5.
8. **What code does and what the model does.** Work with one right answer, such as arithmetic and joining tables, goes to code, and the model does what code can't. Read [Numbers written by code](https://github.com/valery-judah/phased/blob/main/docs/workstreams/ws001_numbers_by_code_suggestion.md), [Splitting one prompt into phases](https://github.com/valery-judah/phased/blob/main/docs/workstreams/ws001_prompt_splitting.md), and [Organized by data situation, not by prompt](https://github.com/valery-judah/phased/blob/main/docs/evaluation/test-data.md#organized-by-data-situation-not-by-prompt) and [Keeping test data honest](https://github.com/valery-judah/phased/blob/main/docs/evaluation/test-data.md#keeping-test-data-honest) in the test data.

To try it by hand, follow [Try it](https://github.com/valery-judah/phased#try-it) in the README. It runs the product and its checks with no model and no API key. A walkthrough that goes on to change one thing and compare the runs isn't written yet.

## Where to read more


- [Runs, records and results: the concepts behind the evaluation in Phased](https://www.linkedin.com/pulse/runs-records-results-concepts-behind-evaluation-phased-valery-yudaev-obk5f/), an article on LinkedIn: a short introduction to the words of a run and its evaluation.
- [The reflection](https://github.com/valery-judah/phased/blob/main/docs/reflection.md), in the repository: why the product needs an evaluation subsystem, what we advocate, and how the project is demonstrated.
- [The repository's README](https://github.com/valery-judah/phased): how to run it, with no model and no API key.
- [The AI evaluation framework, version 1]({{< ref "ai-engineering/evaluation/framework-v1" >}}), which the project draws on.

## References


- Atil, B. et al. (2024). [Non-Determinism of "Deterministic" LLM Settings](https://arxiv.org/abs/2408.04667). arXiv:2408.04667. ^atil-2024
