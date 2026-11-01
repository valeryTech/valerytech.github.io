---
draft: false
toc: true
title: "Rubrics and Annotator Agreement"
description: "How people agree on what counts as a failure: one trusted expert or several annotators, writing and revising rubrics, measuring inter-annotator agreement with Cohen's kappa, alignment sessions, and criteria drift."
linkTitle: "Rubrics and Annotator Agreement"
---

Every step of evaluation rests on someone's judgment of what counts as a failure. Criteria are often subjective, and one person can judge the same trace differently on different days. If the labels are unreliable, everything built on them inherits the noise: failure counts, automated evaluators, and decisions. This note covers how a team makes those judgments consistent. ([Shankar and Husain 2026](#shankar-2026))

A **rubric** is the written definition of one criterion: what it covers, what counts as Pass and Fail, and examples. The labels it produces become the reference that [evaluator alignment]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}}) measures LLM judges against.

## One expert or several annotators


Often one person is enough. The book recommends a single principal domain expert, whose judgment is the standard, in small and medium companies, and calls this the **benevolent dictator** model. It works when the team trusts that person's judgment, the criteria are within their expertise, and the labeling volume is manageable for one person. Examples are a psychologist for a mental health assistant, a lawyer for a legal document tool, or a customer service director for a support bot. With one person, there are no labeling conflicts to resolve, and reviewing traces helps the expert state preferences they couldn't have written down in advance. ([Shankar and Husain 2026](#shankar-2026))

The book warns against a developer acting as the expert, or a convenient proxy such as their manager, since people across an organization disagree about what is acceptable. Several annotators are needed when the domain is too broad for one person, the criteria are contested among stakeholders, or the team must show that its evaluation is rigorous and unbiased. ([Shankar and Husain 2026](#shankar-2026))

## A workflow for several annotators


The book's workflow has nine steps ([Shankar and Husain 2026](#shankar-2026)):

1. **Assemble the team:** two or more annotators with domain expertise or a stakeholder's view, such as engineering, product, legal, and support.
2. **Draft the rubrics,** one for each criterion, each with a working definition and a few Pass and Fail examples. The drafts often formalize failure modes found in [error analysis]({{< ref "ai-engineering/concepts/evaluation/error-analysis" >}}).
3. **Choose a shared set** of 20 to 50 representative traces that everyone labels, including borderline cases, where rubrics get tested.
4. **Label independently,** with no discussion, so that differences in how people read the rubric show up.
5. **Measure inter-annotator agreement** for each criterion separately.
6. **Hold alignment sessions** on the disagreements, one criterion at a time.
7. **Revise the rubrics.**
8. **Repeat** with new traces until agreement is acceptable, typically a Cohen's kappa of 0.6 or more for each criterion.
9. **Finalize** the rubrics and a consensus-labeled **gold-standard dataset**, which shows that people can apply the rubrics consistently and provides the reference labels for validating LLM judges.

Annotators usually label several criteria in one pass through a trace, which saves time. Agreement and alignment sessions still go criterion by criterion, since one score across criteria hides which rubric needs work. ([Shankar and Husain 2026](#shankar-2026))

## Measuring agreement


**Percent agreement** is the share of traces on which two annotators gave the same label. It is easy to compute and misleading when one label is common. If 95% of traces pass, two annotators who label everything Pass agree on 95% of traces without reading them. As a system improves and more traces pass, the agreement expected by chance rises: with 90% Pass, it is about 82%. ([Shankar and Husain 2026](#shankar-2026))

**Cohen's kappa** corrects for chance ([Cohen 1960](#cohen-1960)):

\[\kappa = \frac{P_o - P_e}{1 - P_e}\]

\(P_o\) is the observed agreement. \(P_e\) is the agreement expected if each annotator labeled at random with their own share of Passes and Fails; for binary labels, \(P_e = P_{\text{Pass},1} P_{\text{Pass},2} + P_{\text{Fail},1} P_{\text{Fail},2}\). A kappa of 1 is perfect agreement, 0 is agreement no better than chance, and a negative kappa means the annotators agree less often than chance, perhaps because they read the rubric in opposite ways. In the book's example, two annotators agree on 85 of 100 email summaries, and since both mostly said Pass, kappa is only 0.48. ([Shankar and Husain 2026](#shankar-2026))

A common reading of kappa runs from slight (0 to 0.20) through fair, moderate, and substantial (0.61 to 0.80) to almost perfect (0.81 to 1). ([Landis and Koch 1977](#landis-1977)) How much agreement is enough depends on the use ([Shankar and Husain 2026](#shankar-2026)):

|Use of the labels|Kappa the book aims for|
|---|---|
|Deciding whether failure categories need splitting or merging|About 0.5|
|Validating an LLM judge against human labels|At least 0.6|
|Training data or regulatory reporting|0.7 or more|

Reaching 0.6 is hard for subjective criteria, and around 0.4 already shows progress on many real tasks. Agreement among people also limits how far an LLM judge can be trusted: if annotators agree at a kappa of 0.7, a judge can't reliably exceed that level against their labels. Factual criteria, such as the number of bedrooms, produce high agreement. Tone or fit to a persona often don't, and splitting such a criterion into narrower ones shows where the disagreement lies. When kappa is well below 0.6, labeling more traces only produces more inconsistent data; the disagreements should be read first. ([Shankar and Husain 2026](#shankar-2026))

Other measures fit other setups ([Shankar and Husain 2026](#shankar-2026)):

- **Fleiss's kappa** for three or more annotators labeling the same traces.
- **Weighted kappa** for ordered ratings, such as 1 to 5, where being one point off counts less than being four points off. The book still recommends binary Pass and Fail labels until finer distinctions are needed.
- **Krippendorff's alpha** when not every annotator labels every trace, for any number of annotators and any scale. Its usual thresholds are stricter: 0.8 for reliable data, and 0.67 to 0.8 for tentative conclusions.

Kappa measures agreement between two peers, neither assumed correct. Comparing an LLM judge with gold-standard labels is a different question, whether the judge gets the right answer, and needs rates that show which way it is wrong, such as TPR and TNR. The book names using kappa for that comparison as a common mistake. ([Shankar and Husain 2026](#shankar-2026))

## Alignment sessions


An **alignment session** is a meeting where annotators go through their disagreements to improve the rubric. Its aim is future consistency, and arguing about whether past labels were right misses that aim. For each disagreement, the book asks three questions: what each annotator thought, where the rubric allowed both readings, and what change would make future annotators agree. Five minutes per case is usually enough; a case that takes longer is flagged and revisited. ([Shankar and Husain 2026](#shankar-2026))

The rubric improves in five ways ([Shankar and Husain 2026](#shankar-2026)):

- **Clarify wording** that is vague or overloaded, such as "tailored to the client's background and goals".
- **Add examples** of clear Passes and Fails, including the edge case that caused the disagreement.
- **Add decision rules** for tricky situations, such as when family-oriented language counts as appropriate for an investor client.
- **Split the criterion** when it covers two ideas that annotators agree on separately.
- **Acknowledge cases that stay ambiguous,** document them, and set a tiebreaker rule.

Majority voting can settle one trace's label and teaches nothing about the rubric, so the book keeps it as a last resort for final labels. When annotators still can't agree, a project lead or senior domain expert makes a binding decision, which is written into the rubric. Every rubric change and its reason is documented. The gold-standard dataset and the documentation are kept after an automated evaluator exists, for validating evaluators, for fine-tuning, for audits, and for later revisions of the criteria. ([Shankar and Husain 2026](#shankar-2026))

## Criteria drift


What counts as good shifts as a team sees more traces and learns more about its users. Notion, which runs evaluations across about 70 engineers, has a team whose job is to define good for each AI feature in a rubric, and its framework allows for this drift. ([Shankar and Husain 2026](#shankar-2026)) In a controlled study, developers routinely revised their earlier labels as they saw more examples. ([Shankar et al. 2024](#shankar-2024))

Annotators' own standards drift too, from new business context, fatigue, or having seen more examples, and they often become more lenient or more strict after hundreds of traces. The book catches this by periodically relabeling an **anchor set** of 10 to 15 traces labeled at the start of the project. Drift is expected; the point is to know about it and recalibrate the labels. ([Shankar and Husain 2026](#shankar-2026))

## Common pitfalls


The book lists these ([Shankar and Husain 2026](#shankar-2026)):

- **Discussing before labeling independently,** which makes agreement measure a shared conversation instead of the rubric's clarity. With a single expert, this doesn't apply.
- **Starting with a vague rubric,** which frustrates annotators in the first round. A draft needs clear definitions and a few examples.
- **Reporting only percent agreement.**
- **Ignoring drift** in annotators' standards.
- **Two annotators using the same LLM** to speed up labeling, which gives high agreement that reflects the model's consistency with itself.
- **Arguing about past labels** in alignment sessions.

## Terms used elsewhere in this vault


The evaluation framework's [Judgment and findings]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}}) and [Failure understanding]({{< ref "ai-engineering/evaluation/framework-v2/failure-understanding" >}}) notes touch these practices:

|This note, after the book|The evaluation framework|
|---|---|
|Rubric for one criterion|Criterion: the behavior, where it applies, what counts as acceptable, the evidence required, and how missing evidence is handled|
|Single principal domain expert|Trusted judgments, which "may require more than one reviewer, domain expertise, and a process for resolving disagreements"|
|Shared annotation set, independent labels, and kappa|Piloting the criterion and reviewing disagreements|
|Consensus label in a gold-standard dataset|Adjudicated label, or a label with provenance `reference`|
|Escalation to a binding decision|Adjudication|
|Criteria drift and the anchor set|Relabeling affected evidence when a criterion changes materially|

One term has a different meaning. In the book, a **decision rule** is a labeling rule added to a rubric for a tricky case. In the framework, a decision rule states how a result affects operation or delivery, such as a release gate.

The framework has no measure of agreement between people; kappa fills that gap.

## References


- Cohen, J. (1960). [A Coefficient of Agreement for Nominal Scales](https://doi.org/10.1177/001316446002000104). Educational and Psychological Measurement 20(1), 37-46. doi:10.1177/001316446002000104. ^cohen-1960
- Landis, J. R. and Koch, G. G. (1977). [The Measurement of Observer Agreement for Categorical Data](https://doi.org/10.2307/2529310). Biometrics 33(1), 159-174. doi:10.2307/2529310. ^landis-1977
- Shankar, S. et al. (2024). [Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences](https://arxiv.org/abs/2404.12272). arXiv:2404.12272. ^shankar-2024
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapter 4. O'Reilly. ^shankar-2026
