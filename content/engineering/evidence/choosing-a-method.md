---
draft: false
toc: true
title: "Choosing a Method"
description: "Different claims need different methods: benchmarks for capability under set conditions, experiments for causes, case studies for how and why, longitudinal studies for change, and reviews for the total evidence. Experience reports are none of these."
linkTitle: "Choosing a Method"
---

Part of [Evidence in software engineering]({{< ref "engineering/evidence" >}}).

## Different claims, different methods


A protocol for evidence wouldn't prescribe "always run an RCT." Different claims require different methods.

A benchmark can establish **capability under defined conditions**. A randomized controlled experiment can support **causal claims** about productivity. A case study can establish **how and why** a workflow behaves as it does. A longitudinal study can establish **how outcomes evolve over time**. A systematic review can establish **what the total evidence currently supports**.

And every one of them should expose its assumptions, sampling, measurement, protocol, analysis, uncertainty, limitations, and artifacts.

Experiments have a note of their own, [Running an experiment]({{< ref "engineering/evidence/running-experiments" >}}), and systematic reviews are part of [evidence-based software engineering]({{< ref "engineering/evidence/ebse" >}}#replication-and-synthesis).

## Benchmarks


Benchmarking is useful, but benchmark design itself needs evidence.

The SIGSOFT benchmarking standard says a benchmark should define what quality is being measured, the metrics, the measurement method, and the workload/task sample. It should justify why that workload represents the intended use, run enough repetitions to assess stability, and provide enough information for independent replication. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

This is extremely relevant to LLMs.

A 72% benchmark success rate is insufficient without a description of the benchmark and its limits.

The evaluation should establish:

> Where did those tasks come from?
> What distribution do they represent?
> Could the model have seen them?
> How were tasks selected?
> What constitutes success?
> How many attempts were allowed?
> What tools and context were available?
> How variable are results across repeated runs?

For stochastic systems, the unit of evaluation often needs to become a **distribution of outcomes**, rather than one successful run.

## Case studies and qualitative methods


Controlled experiments answer certain questions well. They can lose the context that determines why an agent succeeds or fails.

Runeson and Höst's software-engineering case-study methodology came directly from social-science and information-systems research. They argue that case studies are appropriate when software-engineering phenomena need to be studied in their real organizational context. They define a process of study design, preparation, evidence collection, analysis, and reporting. ([Springer](https://link.springer.com/article/10.1007/s10664-008-9102-8 "Guidelines for conducting and reporting case study research in software engineering | Empirical Software Engineering | Springer Nature Link"))

For agents, this could answer questions like:

> Why do senior engineers abandon generated solutions?
> When do engineers stop checking agent output?
> What kinds of architectural errors escape normal review?
> How does agent use change code-review behavior?
> What causes developers to trust incorrect suggestions?

Those aren't secondary questions. They can explain why a quantitative result exists.

## Mixed methods


This leads to **mixed methods**: combine quantitative experiments with interviews, observations, think-aloud sessions, repository analysis, and production data. The SIGSOFT standard explicitly treats multiple methods as a way to corroborate, complement, and expand findings, including investigation of cases where the different methods disagree. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

## Longitudinal studies


Longitudinal studies solve the "merged today, expensive tomorrow" problem. Longitudinal evaluation is particularly useful for detecting overengineering costs.

The empirical-SE standards explicitly define longitudinal studies for phenomena such as productivity and technical debt that need repeated observation over time. They require appropriate treatment of repeated measurements, attrition/missing data, construct validity, confounding, and time-related analysis. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

So a serious coding-agent evaluation might measure:

`T0`: task completed

`T+1 day`: review effort

`T+30 days`: bugs/rework

`T+90 days`: modifications and maintenance

`T+180 days`: incidents, complexity, abandonment/refactoring

That could reveal a hidden cost transfer: an agent appears productive at merge time while transferring work into future maintenance. This is the *lifecycle factor* that [EBSE]({{< ref "engineering/evidence/ebse" >}}#skill-and-lifecycle-factors) warned about.

## Experience reports are not case studies


Much of what practitioners read is an experience report: an organization describing what it did and what it saw. The SIGSOFT standards distinguish experience reports from case studies that systematically collect and analyze data. A case study states how the case was selected, its units of analysis, how data was collected, and a chain of evidence from data to conclusion.

The label is often applied loosely. Wohlin and Rainer checked studies labelled "case study" against the established definitions and found only about half correctly labelled, with about 40% better described as small-scale evaluations.

An experience report can describe what happened. It rarely shows what caused it. The [Zalando case critique]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/zalando-case-critique" >}}) reads one in detail.

## Library sources


- [Wohlin et al. 2024](/sources/c07438c70e29bb5bfa57fbc2bc8ae6b6.bin), *Experimentation in Software Engineering* -- choosing a research design for a question, and case studies as a related kind of study; on *Empirical Research* (ch. 2, *Selecting a Research Design* 2.1) and *Case Studies* (ch. 7)
- [Wohlin and Rainer 2022](/sources/259b57ac164515376430c68ba4848f6b.bin), *Is it a case study? A critical analysis and guidance* -- how often "case study" is mislabelled, with a checklist; on *Experience reports are not case studies*
- [Bean et al. 2025](/sources/015e29150096f262478300d13488bbc2.bin), *Measuring what Matters* -- recurring failures across 445 benchmarks, and a checklist; on *Benchmarks*
- [Eriksson et al. 2025](/sources/5078ee4dc38d25871465fce92643eb36.bin), *Can We Trust AI Benchmarks? An Interdisciplinary Review of Current Issues in AI Evaluation* ([arXiv:2502.06559](https://arxiv.org/abs/2502.06559)) -- a review of benchmark critiques; on *Benchmarks*

Further reading:

- [Wohlin and Runeson 2021](/sources/3cfb734c3eb89c6fc1a4f131e4a9b4d0.bin), *Guiding the selection of research methodology in industry-academia collaboration in software engineering*
- [Silverman 2021](/sources/60ad3c9172623ab4ec15bf346a7d7a31.bin), *Qualitative Research* -- interviews, focus groups, ethnography and document analysis
- [Denzin and Lincoln 2018](/sources/22f3ac39414dd99205b2f2679dd71b89.bin), *The SAGE Handbook of Qualitative Research*
- [Gillespie et al. 2024](/sources/a06a5565fd216fcdd8ac46c10bdb8900.bin), *Pragmatism and Methodology* ([doi:10.1017/9781009031066](https://doi.org/10.1017/9781009031066)) -- mixing qualitative and quantitative methods
