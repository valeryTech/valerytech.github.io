---
draft: false
toc: true
title: "CI and Online Monitoring"
description: "How evaluations keep running after an AI application ships: continuous integration on a golden dataset, model upgrades, online monitoring of sampled traffic, guardrails, judge drift, and the continuous improvement loop."
linkTitle: "CI and Online Monitoring"
---

An application uses several evaluations, built into it in four ways ([Shankar and Husain 2026](#shankar-2026)):

- **Monitoring:** checks that run in the background to detect drift or degradation over time.
- **Guardrails:** evaluations in the critical path, so the system can block, retry, or fall back when an output fails a criterion.
- **Improvement:** evaluations that produce feedback, such as labeled examples, few-shot examples for a prompt, or failure cases that motivate a change to the architecture.
- **Model migration:** evaluations that compare model versions before switching.

This note covers the ones that run continuously after an application ships. The book borrows two practices from software engineering: **continuous integration (CI)**, which guards against regressions on failure modes already known, and **continuous deployment (CD)** with **online monitoring**, which watches live traffic for failures no one anticipated. CI catches what the team knows about, and online monitoring catches what it doesn't know yet. ([Shankar and Husain 2026](#shankar-2026))

The book's opening case shows why both are needed. The same math tasks run on the GPT-4 API in March and June 2023 gave very different accuracy on identifying prime numbers, 84% and then 51%, after the provider changed the model behind the endpoint without notice. ([Chen et al. 2024](#chen-2024)) A nightly run of a fixed set of test cases would have caught the drop before users did. ([Shankar and Husain 2026](#shankar-2026))

## Continuous integration


On each proposed change, such as a prompt edit, a model swap, or a new tool, CI runs every input of the [golden dataset]({{< ref "ai-engineering/concepts/evaluation/test-data" >}}#golden-datasets) through the application and checks the outputs with automated evaluators. If a check fails, the build fails and the change isn't merged. In the book's pipeline, a change must pass both the golden-dataset tests and the LLM judge evaluations at a **deploy gate** before it ships. ([Shankar and Husain 2026](#shankar-2026))

CI for an LLM application differs from CI for a trained model. A trained model's CI measures overall accuracy on a large test set after retraining. An LLM application's CI guards a small curated set of known failure modes, because its logic lives in prompts and the foundation model. Its outputs also vary between runs, so its tests must tolerate variation or run several times. Passing CI shows that nothing known broke, and says little about quality on production traffic. ([Shankar and Husain 2026](#shankar-2026))

## Model upgrades


A new model version can break a prompt that worked. When the book's authors upgrade, they ([Shankar and Husain 2026](#shankar-2026)):

1. run the existing prompts through CI to see what breaks;
2. for prompts that pass, remove the most prescriptive instructions, which were often added to work around an older model, and keep the simpler prompt if quality holds;
3. for prompts that fail, check whether the failure is a real regression or a change in format that an evaluator is sensitive to;
4. rerun error analysis on a sample of the new model's outputs, since a new model can introduce failure modes as well as fix them.

In two cases the book describes, a newer GPT-3.5 cost one intent classifier about 10 percentage points of accuracy on the same prompt, and a silent change behind the `gpt-4o` alias made function calls come back as plain text. Teams that had pinned an exact version were unaffected by the second. The book's practice: pin exact model versions in production, in both the application and its LLM judges, treat a model upgrade as a code change that goes through CI, and set a maximum age for a pinned version. If CI results shift with no change on the team's side, rerunning the golden dataset on the pinned version helps confirm that the provider changed the model's behavior. ([Shankar and Husain 2026](#shankar-2026))

## Online monitoring


Online monitoring starts with logging each production request, or a sample of them: see [What a trace records]({{< ref "ai-engineering/concepts/evaluation/traces-and-executions" >}}#what-a-trace-records). On top of the logs, a typical setup runs five to seven automated evaluators, code-based and LLM judges, each tracking a known failure mode. LLM judges are slow and expensive, so they run asynchronously on a small sample, 1% to 5% of traffic, after each request completes. For each failure mode, the team computes a corrected success rate with a 95% confidence interval, as described in [Evaluator alignment]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}}#estimating-the-pass-rate-with-an-imperfect-evaluator), puts the results on a dashboard, and alerts when an interval crosses a threshold. ([Shankar and Husain 2026](#shankar-2026))

Automated evaluators miss subtle failures. The book recommends reviewing a sample of production traces every day, including random traces, not only the flagged ones. If user engagement drops while evaluator results stay flat, an undetected failure is likely. ([Shankar and Husain 2026](#shankar-2026))

Huyen measures how well monitoring works with three metrics from DevOps: the mean time to detect a problem (MTTD), the mean time to respond to it (MTTR), and the change failure rate (CFR), the share of changes or deployments that need a fix or a rollback. She also asks that evaluation metrics carry over to monitoring metrics, so that a model that does well in evaluation also does well in monitoring, and that issues found in monitoring feed back into evaluation. ([Huyen 2025](#huyen-2025))

## Guardrails


A **guardrail** runs during execution, before an output reaches the user. Because it sits in the critical path, it has to be fast and rarely fire on valid outputs. That usually rules out an LLM judge, whose two or three seconds per call users would notice. Cheap deterministic checks work well: regular expressions, JSON schema validation, blocklists and allowlists, length and format checks, and parsers that confirm generated SQL or code is valid. A guardrail runs its check, logs when it fires, and falls back to a safe response. ([Shankar and Husain 2026](#shankar-2026))

The book's practices for guardrails ([Shankar and Husain 2026](#shankar-2026)):

- **Test the false positive rate** on a sample of passing production traces, and keep it under 1% before deploying. A guardrail that fires on valid outputs looks like broken functionality to users.
- **Start from common categories:** personal information in generated text, schema validation of outputs such as generated SQL, toxicity or safety classifiers on the final response, and prompt injection detection on user inputs.
- **Use two layers:** checks between steps, on tool arguments and intermediate context, and checks on the final output.
- **Set fixed thresholds for safety and correctness first,** such as never sending personal information in an email, and tune preferences such as length later.
- **Define the response in advance:** reject the output with a safe fallback message, retry the call, or fall back to a simpler model or code path.

## Judge drift


An LLM judge's TPR and TNR, measured when it was built, change over time. The provider can update the model behind the judge, and the team's own idea of what counts as correct moves as it sees more production data. Either way the judge's accuracy degrades unnoticed. The book calls this **judge drift** and handles it in three ways: pin the judge's model version in CI and production, revalidate every few weeks on freshly labeled production traces, and rerun the full validation after any change to the judge's model. ([Shankar and Husain 2026](#shankar-2026)) See [Keeping alignment current]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}}#keeping-alignment-current).

## The continuous improvement flywheel


CI and online monitoring connect into one loop, which the book calls the **continuous improvement flywheel**: deploy with observability, monitor online, run error analysis and update the evaluations, then improve the application, run CI, and deploy again. ([Shankar and Husain 2026](#shankar-2026))

In the book's example, a week after a release the monitoring dashboard shows more location errors, and product metrics show shorter sessions in some neighborhoods. Error analysis of the flagged traces finds a new failure mode: confusing "West Berkeley" with a "Berkeley West" that doesn't exist. The team adds 5 to 10 examples to the golden dataset, writes a code-based evaluator that checks location names against a list of real neighborhoods, fixes the prompt, confirms the fix passes CI, and redeploys. Each cycle adds test cases and evaluators, so problems are caught earlier. ([Shankar and Husain 2026](#shankar-2026))

## Common pitfalls


The book lists these ([Shankar and Husain 2026](#shankar-2026)):

- **A golden dataset that stays frozen** while production traffic changes, so CI catches less over time.
- **Metrics that conflict,** such as conciseness and factual accuracy, without a decided priority among them.
- **AI metrics and product metrics read apart.** A drop in task completion may come from AI quality or from the interface, so both need checking.
- **Relying only on automated monitoring,** without regular review of random production traces.

## Terms used elsewhere in this vault


The evaluation framework's [decision rules]({{< ref "ai-engineering/evaluation/framework-v2/experiments-and-findings" >}}#decision-rules), the [places where evaluation runs]({{< ref "ai-engineering/evaluation/framework-v2/subsystem-and-production" >}}#where-evaluation-runs), and the [three feedback routes]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}}#three-feedback-routes) use other words for these concepts:

|This note, after the book|The evaluation framework|
|---|---|
|CI on a golden dataset|Offline evaluation; regression set|
|Deploy gate, a failing CI build|Release gate, a decision rule|
|Alert when a confidence interval crosses a threshold|Warning or review rule|
|Online monitoring of sampled traffic|Online evaluation outside the request path|
|Guardrail|Runtime control; online evaluation in the request path|
|Judge drift|Evaluator drift; an evaluator that changes over time|
|Running the golden dataset against a new version|Replay: running captured inputs against a new version|
|Continuous improvement flywheel|The three feedback loops, and the data and evidence flywheel|

Two differences in meaning:

- The book calls a guardrail an evaluation in the critical path. The framework says a runtime control isn't automatically an evaluation: a permission check enforces a rule, and evaluation can establish whether the rule works as intended.
- The book's flywheel is the whole loop, from deployment through monitoring, error analysis, and the fix to the next release. The framework's data and evidence flywheel turns product usage into reusable cases, labels, criteria, evaluators, and findings that all three feedback loops use; see [The delivery view]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}}#the-delivery-view).

## References


- Chen, L., Zaharia, M. and Zou, J. (2024). [How Is ChatGPT's Behavior Changing over Time?](https://arxiv.org/abs/2307.09009). Harvard Data Science Review 6. arXiv:2307.09009. ^chen-2024
- Huyen, C. (2025). [AI Engineering: Building Applications with Foundation Models](/sources/faff32abd78cc0963d6a4a913c8c129e.bin), chapter 10. O'Reilly. ^huyen-2025
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 1 and 9. O'Reilly. ^shankar-2026
