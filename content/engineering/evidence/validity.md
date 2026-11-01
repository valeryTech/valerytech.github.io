---
draft: false
toc: true
title: "Four Kinds of Validity"
description: "Construct, internal, external and conclusion validity name four ways a study can be wrong, and reproducibility adds a fifth question: whether anyone else could repeat it."
linkTitle: "Validity"
---

Part of [Evidence in software engineering]({{< ref "engineering/evidence" >}}).

Experimental social science distinguishes several different ways an experiment can be wrong. The SIGSOFT standards use essentially the same framework, and a July 2026 paper specifically proposing standards for randomized AI evaluations builds on these established validity frameworks. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

An evaluation should address four validity questions:

|Validity|Question, with a coding-agent example|
|---|---|
|Construct validity|Does the measurement capture the claimed construct? Does "PR count" measure productivity? See [Measures and constructs]({{< ref "engineering/evidence/measures-and-constructs" >}}).|
|Internal validity|Did the agent cause the observed difference, or was something else responsible? See [Causal claims]({{< ref "engineering/evidence/causal-claims" >}}).|
|External validity|Does the result apply to other engineers, repositories, tasks, models, and organizations?|
|Conclusion validity|Do the data and statistical analysis actually support the conclusion?|

This is much more useful than asking simply, "Was the experiment successful?"

## External validity


A coding-agent experiment could have excellent internal validity and terrible external validity: perhaps the agent performs well on 30 carefully selected CRUD tasks completed by experienced Python engineers. That's meaningful evidence for that population. It isn't evidence that "AI agents improve software engineering."

## Reproducibility


A fifth question sits beside the four: could someone else repeat the study? That needs the dataset or task set, the queries and selection rules, the configuration of the tools measured, and the analysis scripts. The [evidence protocol]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/evidence-protocol" >}}) asks for the same under "preserve the experiment", and [replication]({{< ref "engineering/evidence/ebse" >}}#replication-and-synthesis) depends on it.

## Applying the questions


The [Zalando case critique]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/zalando-case-critique" >}}#validity-assessment) works through all five for one engineering report.

## Library sources


- [Trochim et al. 2016](/sources/95c4dfddb0a330d19ccec7a9579c993f.bin), *Research Methods: The Essential Knowledge Base* -- the four validity types and their threats; on *The Validity of Research* (1.5), *External Validity* (4.3), *Internal Validity* (8.2b) and *Conclusion Validity* (11.2)
- [Wohlin et al. 2024](/sources/c07438c70e29bb5bfa57fbc2bc8ae6b6.bin), *Experimentation in Software Engineering* -- the same four classes applied to software engineering experiments; on *Validity Evaluation* (9.7) and *Detailed Description of Validity Threats* (9.8)

Further reading:

- [Hernandez et al. 2025](/sources/9cbf2e8396ea69c074933162eaa37645.bin), *Reproducible research policies and software/data management in scientific computing journals* -- reproducibility strategies, and how unevenly journals enforce them
- [Reynolds 2026](/sources/f31a48720f6829630133d42608c798d0.bin), *When benchmark inferences do not compose* ([arXiv:2607.26159](https://arxiv.org/abs/2607.26159)) -- evidence for each link from a result to a decision does not warrant the whole chain
