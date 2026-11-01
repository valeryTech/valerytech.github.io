---
draft: false
toc: true
title: "Evaluation Actions and Their Results"
description: "What observing, measuring, exploring, judging, testing, estimating, comparing, monitoring, diagnosing, validating, and auditing each establish about an AI system's behavior, what each needs, and what each produces."
linkTitle: "Evaluation Actions"
---

Work on AI evaluation uses many verbs: observe, measure, judge, check, score, test, estimate, compare, monitor, diagnose, validate, audit, evaluate. Each names a different action on the behavior of an AI system, and each produces a different kind of result. A result of one kind can't stand in for another. A count of the questions in an answer says nothing about whether the answer is acceptable, and a pass rate on chosen test cases says nothing about how often the system fails in use. This note defines each action by what it establishes about behavior, what it needs, and what it produces. The records the actions work on are described in [Traces and executions]({{< ref "ai-engineering/concepts/evaluation/traces-and-executions" >}}) and in the framework's [evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}).

## Why behavior needs several actions


The behavior of an AI system is hard to know for five reasons. It is a trajectory of model calls, tool calls, and state changes, and only part of it is recorded. It varies between executions of the same case, so one execution shows one possible behavior. It depends on the situation, and the situations a system will meet can't be listed in full. Whether a behavior is acceptable isn't part of the behavior: it depends on what the product is meant to do, and the team often learns that by reading behavior. And judging meaning needs an instrument, an LLM judge or a person, that has behavior of its own and can vary and be wrong. Each action below deals with one of these.

## Describing behavior


**Observing** finds out what happened in an execution, and **capturing** records it as a trace. An observation is a statement the trace supports, such as that a tool was called before the user confirmed. It doesn't say whether that was acceptable.

**Measuring** gives a property of behavior a value on a scale that has no pass mark: a count, such as the number of questions in an answer; a duration; a cost; or a category, such as the word each question opens with. The value describes the behavior. Summed over a set of cases, the values give a measurement of that set. The framework uses "measurement" only for that summary and calls the value for one trace a number or category result.

**Exploring** behavior, which the evaluation literature calls error analysis, means reading traces with no fixed criterion, writing down what goes wrong, and grouping the notes into failure modes ([Shankar and Husain 2026](#shankar-2026)). Its result is a set of failure categories and candidate criteria. Exploring comes before judging because it is how the criteria are found: in a study of LLM-assisted evaluation, people needed criteria to grade outputs, and grading outputs was how they defined the criteria ([Shankar et al. 2024](#shankar-2024)). The method is in [Error analysis]({{< ref "ai-engineering/concepts/evaluation/error-analysis" >}}).

## Judging behavior


**Judging** applies a stated basis, such as a product rule, a requirement, or an expected answer, to the evidence about one execution, and gives a verdict: `PASS` or `FAIL`, or `PRESENT` or `ABSENT` for a failure mode. It needs a basis, a criterion that says how the basis applies, and enough evidence for that criterion. When the criterion doesn't apply, the result is `NOT APPLICABLE`; when the evidence is insufficient, it is `NOT JUDGEABLE`. A measured value becomes a judgment only when the basis supplies a pass mark. "Seven questions" is a measured value, and "at most three questions about each change" is a criterion that turns it into a verdict.

A **check** is a judgment made by code, usually one named test inside a deterministic evaluator. **Scoring** or **rating** judges on an ordered scale with more than two places; each place then needs its own description, and one score built from several criteria hides which of them failed. **Testing** runs the system on chosen cases and judges what it did. A test of ordinary code needs one run. A test of an AI system needs several, because a case that passes once can fail the next time: the share of tasks that succeed in every one of \(k\) runs, pass^k, falls well below the share that succeed in one run ([Yao et al. 2024](#yao-2024)).

## How far a result holds


Every result is about some unit of behavior, and each wider unit needs something more than the one before it:

- **One execution** gives an observation or a verdict.
- **One case** needs repeats. Its repeats are summarized as all pass, all fail, or mixed, and the difference between repeats with nothing changed is the **spread**.
- **A set of cases** gives a measurement, which holds for the situations the set represents. A challenge set, a regression set, and a set of typical inputs support different statements.
- **A population of use** needs an **estimate**: a value, such as how often a failure occurs in a month of traffic, inferred from a sample. It holds only when the sample was selected to represent the population, and its uncertainty should be reported as an error bar ([Miller 2024](#miller-2024)). Correcting an LLM judge's pass rate for the judge's known errors is also an estimate, described in [Evaluator alignment]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}}).
- **A property of the system,** such as a capability, is a claim about what the system would do across a declared range of situations, including ones never tested. A score on cases is evidence for such a property and a separate claim from it ([The inference ladder]({{< ref "ai/capabilities/00-the-inference-ladder" >}})).

## Changes in behavior


**Comparing** runs two versions of the system on the same cases and sets them side by side, case by case. A difference counts only where it is larger than the spread within each version, and the versions should differ in one thing so that the difference can be attributed to it. **Monitoring** measures or judges a sample of live behavior over time to see whether it is changing, and it needs a rule that tells a change from the spread. Behavior can change with no change by the team: on the GPT-4 API, the same prime-number tasks gave 84% accuracy in March 2023 and 51% in June ([Chen et al. 2024](#chen-2024)). **Benchmarking** runs several systems on one shared, fixed set of cases so that their results can be compared, and the result describes behavior in that set's situations.

## Explaining behavior


**Diagnosing** asks why a behavior happened. An AI system is built from components such as retrieval, tools, prompts, and models, so a failure that shows in the final output can begin in any of them. Diagnosis first finds the step where the trace first shows the failure. It then tests a cause by changing one component and running the case again, by reproducing the failure, or by inspecting the implementation. Its result is a cause hypothesis and, when the tests support it, a root cause. A judgment or a measurement shows that behavior failed and where; it doesn't show why. One diagnosis decides what to build next: a failure caused by an unclear prompt is fixed in the prompt, and only a failure that remains once the prompt is clear needs an evaluator ([Shankar and Husain 2026](#shankar-2026)).

## Examining the evaluators and the claims


Some actions are about the evaluation itself. **Validating** an evaluator measures how well its verdicts agree with a domain expert's verdicts on the same traces, as a true positive rate and a true negative rate, and how stable they are across repeated runs. A verdict says no more than its evaluator's validation supports, and only for the kind of traces the evaluator was validated on. **Verifying** checks that something meets a stated requirement, for example that a fix removed a failure, by running the failed cases again. Verifying applies the stated criterion; validating asks whether the criterion and its evaluator capture what the product needs.

**Auditing** examines a claim about the system's behavior and the records behind it. It asks whether each result can be traced to its runs, versions, and evaluators, whether the rule for the conclusion was written before the results were read, and whether the claim stays within what the cases and evaluators support. It reads the evaluation, and someone other than the team that made the claim does it.

**Evaluating** names the whole of this work: answering a question about the system's behavior with evidence, and saying what the evidence supports and where it stops. Its result is a finding. The word is also used for the judging part alone; in these notes it means the whole.

## Reading behavior and acting on it


All the actions above read records and leave behavior as it was. The same kind of check can also act. A **guardrail** runs in the request path and blocks, retries, or redirects an output that fails a criterion ([CI and online monitoring]({{< ref "ai-engineering/concepts/evaluation/ci-and-online-monitoring" >}})). A release **gate** applies a rule decided in advance to an evaluation result and stops a release. Both change what the system does, so they are part of the system being evaluated, and a guardrail needs its own evaluation, including how often it blocks valid outputs. Keeping reading apart from acting also shapes how evaluation is built. When a run's record holds only what happened, a new evaluator can judge old records, and results can be summarized again under a new rule, without running the system again. **Deciding** what to do with a finding stays with the people responsible for the product.

## References


- Chen, L., Zaharia, M. and Zou, J. (2024). [How Is ChatGPT's Behavior Changing over Time?](https://arxiv.org/abs/2307.09009). Harvard Data Science Review 6. arXiv:2307.09009. ^chen-2024
- Miller, E. (2024). [Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations](https://arxiv.org/abs/2411.00640). arXiv:2411.00640. ^miller-2024
- Shankar, S. et al. (2024). [Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences](https://arxiv.org/abs/2404.12272). arXiv:2404.12272. ^shankar-2024
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 2, 3, and 5. O'Reilly. ^shankar-2026
- Yao, S. et al. (2024). [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045). arXiv:2406.12045. [PDF](/sources/271cbb826296fcfb4c240f8c381566ad.bin). ^yao-2024
