---
draft: false
toc: true
title: "Evaluator Alignment"
description: "How far an evaluator agrees with a domain expert, measured by TPR and TNR, how an LLM judge is tuned against labeled traces, and how its errors are corrected when estimating a pass rate."
linkTitle: "Evaluator Alignment"
---

An evaluator stands in for a domain expert, so its results are only as good as its agreement with that expert. **Alignment** is that agreement, measured on traces both have judged. An LLM judge rarely works out of the box for criteria specific to one product, such as tone for luxury clients. ([Shankar and Husain 2026](#shankar-2026)) Where the expert's labels come from is in [Rubrics and annotator agreement]({{< ref "ai-engineering/concepts/evaluation/rubrics-and-annotator-agreement" >}}).

## TPR and TNR


Alignment is measured with two rates, counting Pass as positive. The **true positive rate (TPR)** is the share of the expert's Passes that the evaluator also passes, and the **true negative rate (TNR)** is the share of the expert's Fails that it also fails. A low TPR means false Fails, and a low TNR means false Passes. ([Shankar and Husain 2026](#shankar-2026))

A single agreement rate hides which way the evaluator is wrong. If 5% of traces fail, an evaluator that always says Pass agrees with the expert on 95% of them and catches nothing. ([Husain 2024](#husain-2024))

The [evaluation framework]({{< ref "ai-engineering/evaluation/framework-v2" >}}) marks a failure mode `PRESENT` or `ABSENT`. Its `PRESENT` is a Fail here, so the framework's rate of correctly found failures is the TNR.

## Tuning an LLM judge


The book splits the expert's labeled traces into three sets with no trace in common: a few clear Passes and Fails used as examples in the prompt, a tuning set for checking the judge after each prompt change, and a validation set held back and judged once to report TPR and TNR. The book calls them the training, development, and test sets; this vault avoids "test set" because it already names the cases the system runs on. The tuning and validation sets each need about 30 to 50 Passes and as many Fails, and a trace shown in the prompt must not be used to measure alignment. ([Shankar and Husain 2026](#shankar-2026))

Tuning is a loop: run the judge on the tuning set, read each disagreement with the expert, revise the definitions or examples, and run it again. The book stops when TPR and TNR are above about 90%, or higher where a missed failure is costly, and suggests doing this by hand before using a prompt optimizer. If the rates stay low, it tries a stronger model, a narrower criterion, or better labels. ([Shankar and Husain 2026](#shankar-2026)) Reading the disagreements also finds problems no prompt change fixes, such as a judge missing context it needs. ([Husain and Shankar 2026](#husain-shankar-2026))

An LLM judge can give different results on the same trace. Running it three to five times on one trace shows whether it is stable, and a result that changes means the criterion needs more detail or more examples. ([Shankar and Husain 2026](#shankar-2026))

## Estimating the pass rate with an imperfect evaluator


On unlabeled production traces, a judge's raw pass rate is biased by its errors. The book corrects it with the judge's TPR and TNR from the validation set ([Shankar and Husain 2026](#shankar-2026)):

\[\hat{\theta} = \frac{p_{\text{obs}} + \text{TNR} - 1}{\text{TPR} + \text{TNR} - 1}\]

Here \(p_{\text{obs}}\) is the share of traces the judge passed. This is Rogan and Gladen's correction for an imperfect screening test. ([Rogan and Gladen 1978](#rogan-1978)) A bootstrap over the validation set gives a confidence interval around the corrected rate, and its lower bound, compared with the rate the team requires, shows whether the evidence is enough to ship. ([Shankar and Husain 2026](#shankar-2026))

## Keeping alignment current


Alignment holds only for the judge's prompt, its model, and the kind of traces it was measured on. The book relabels a few fresh traces regularly and recomputes TPR and TNR, as described under judge drift in [CI and online monitoring]({{< ref "ai-engineering/concepts/evaluation/ci-and-online-monitoring" >}}#judge-drift). ([Shankar and Husain 2026](#shankar-2026)) The expert's own criteria also move as they see more traces. ([Shankar et al. 2024](#shankar-2024)) And high agreement doesn't show that the judge reaches its result for the right reason. ([Pita 2026](#pita-2026))

## References


- Husain, H. (2024). [Using LLM-as-a-Judge For Evaluation: A Complete Guide](https://hamel.dev/blog/posts/llm-judge/index.html). Local copy. ^husain-2024
- Husain, H. and Shankar, S. (2026). [Q: What should I do when I can't get my LLM judge to agree with human reviewers?](https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-i-cant-get-my-llm-judge-to-agree-with-human-reviewers.html). Local copy. ^husain-shankar-2026
- Pita, M. (2026). [Correct codes for the wrong reasons? Validating LLMs as measurement instruments for theoretical constructs](https://arxiv.org/abs/2606.28574). arXiv:2606.28574. [PDF](/sources/e927379435f1073f97f490f01b8bffcf.bin). ^pita-2026
- Rogan, W. J. and Gladen, B. (1978). [Estimating Prevalence from the Results of a Screening Test](https://doi.org/10.1093/oxfordjournals.aje.a112510). American Journal of Epidemiology 107(1), 71-76. doi:10.1093/oxfordjournals.aje.a112510. ^rogan-1978
- Shankar, S. et al. (2024). [Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences](https://arxiv.org/abs/2404.12272). arXiv:2404.12272. ^shankar-2024
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapter 5. O'Reilly. ^shankar-2026
