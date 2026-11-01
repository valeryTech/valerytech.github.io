---
draft: false
toc: true
title: "Measures and Constructs"
description: "A metric stands for the concept a claim is about only with an argument that it does. Productivity has several dimensions, and a measure that becomes a target stops measuring."
linkTitle: "Measures and Constructs"
---

A claim is usually about a concept, such as productivity, quality or maintainability. The data is a count or a time. The gap between the two needs an argument. Part of [Evidence in software engineering]({{< ref "engineering/evidence" >}}).

## A metric is an operationalization


The ACM SIGSOFT empirical standards address claims based on counts such as PRs under **construct validity**.

If someone says:

> "Agents improved engineering productivity."

"Engineering productivity" is a theoretical construct. Its operational definition must be explicit.

If the operationalization is:

> productivity = number of merged PRs

the immediate scientific question becomes:

> Does merged-PR count actually measure engineering productivity?

The SIGSOFT standards explicitly warn against bad proxy variables and unvalidated operationalizations--for example, using a simple observable metric as a proxy for a more complex construct. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

That seems like a foundational rule:

**Every metric must come with an argument for why it measures the thing being claimed.**

## Productivity has several dimensions


Developer productivity is particularly vulnerable to construct problems. The SPACE framework argues that productivity cannot be represented by one activity metric or one dimension. It includes outcomes, activity, collaboration, satisfaction, and efficiency or flow. PR count, PR size, and lead time can contribute to such an evaluation, but none can stand alone. ([Microsoft](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/ "https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/"))

## A measure that becomes a target


Once a count is used to judge people or tools, the work changes to move the count. The [evidence protocol]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/evidence-protocol" >}}) gives the example: once merged PRs become a target, splitting work into agent-friendly PRs can increase the count without increasing useful output. A measure that was a fair proxy before it became a target may not be one afterwards.

Choosing the measure after seeing the data is the other way a measure stops meaning what it says. [Preregistration]({{< ref "engineering/evidence/running-experiments" >}}#preregistration) fixes it in advance.

## Library sources


- [Trochim et al. 2016](/sources/95c4dfddb0a330d19ccec7a9579c993f.bin), *Research Methods: The Essential Knowledge Base* -- operationalization and construct validity; on *Introduction to Measurement* (ch. 5)

Further reading:

- [Clark and Watson 2019](/sources/7fc85943e4bd06680a1aaf4f357404b6.bin), *Constructing Validity* ([doi:10.1037/pas0000626](https://doi.org/10.1037/pas0000626))
- [Lambert and Newman 2023](/sources/49b689d6cd563df789695944f06ff04c.bin), *Construct Development and Validation in Three Practical Steps* ([doi:10.1177/10944281221115374](https://doi.org/10.1177/10944281221115374))
- [Freiesleben 2026](/sources/c84d75800beb21af8a1cc54b8f79c168.bin), *Establishing Construct Validity in LLM Capability Benchmarks Requires Nomological Networks* ([arXiv:2603.15121](https://arxiv.org/abs/2603.15121))
