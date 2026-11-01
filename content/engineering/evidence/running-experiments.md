---
draft: false
toc: true
title: "Running an Experiment"
description: "Empirical software engineering already has a method for experiments: a five-stage process, method-specific standards for what a study must report, and preregistration to fix the outcome before the data is seen."
linkTitle: "Running an Experiment"
---

When no existing evidence answers the question, a team can produce some. A controlled experiment is the strongest design for a [causal claim]({{< ref "engineering/evidence/causal-claims" >}}), and [Choosing a method]({{< ref "engineering/evidence/choosing-a-method" >}}) covers the others. Part of [Evidence in software engineering]({{< ref "engineering/evidence" >}}).

## The experiment process


Empirical software engineering already has a methodology for experiments. This is probably the strongest thing to borrow.

Wohlin et al.'s _Experimentation in Software Engineering_ ([PDF](/sources/c07438c70e29bb5bfa57fbc2bc8ae6b6.bin)), updated in 2024, describes experimentation as a five-stage process: **scoping -> planning -> execution -> analysis -> result presentation**. The new edition explicitly covers research design, A/B testing, replication, open science, validity threats, surveys, and case studies. ([Lund University](https://portal.research.lu.se/en/publications/experimentation-in-software-engineering-2024-edition/ "Experimentation in Software Engineering (2024 edition) - Lund University"))

## Method-specific standards


Even more useful is the ACM SIGSOFT **Empirical Standards for Software Engineering** project. It contains different standards for controlled experiments, benchmarking, case studies, longitudinal studies, repository mining, surveys, mixed methods, replication, systematic reviews, and other methods. The authors explicitly argue that evidence standards need to be method-specific because the standard for a controlled experiment is different from the standard for an ethnographic case study. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/about/ "About | Empirical Standards"))

For controlled experiments, their requirements are close to the needs of an AI-engineering protocol. They require formal hypotheses; defined dependent and independent variables; discussion of confounding variables; justified sample sizes; explicit experimental design and treatment allocation; justified experimental objects; appropriate statistical analysis; effect sizes with confidence intervals; and discussion of construct, internal, external, and conclusion validity. Preregistration and publishing protocols, raw data, and analysis scripts are recommended. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

The validity requirement is the subject of [Four kinds of validity]({{< ref "engineering/evidence/validity" >}}), and reporting effect sizes with uncertainty is in [Stating a claim]({{< ref "engineering/evidence/stating-claims" >}}#reporting-an-estimate).

## Preregistration


Before running an experiment, record:

> hypothesis
> primary outcome
> secondary outcomes
> dataset/task selection procedure
> exclusion rules
> statistical analysis
> stopping rule

Then run it.

This is called **preregistration**. Registered Reports go further by having the experimental protocol reviewed before the results are known. The Center for Open Science describes this specifically as a mechanism for separating hypothesis-driven analysis from decisions made after observing results. ([Center for Open Science](https://www.cos.io/initiatives/registered-reports "Registered Reports"))

This is valuable wherever there are many possible metrics, as there usually are for AI tools.

A comparison of agent A with agent B might show:

- A generates code faster.
- B produces fewer lines.
- A gets higher test coverage.
- B requires fewer review comments.
- A gets more PRs merged.

Choosing "merged PRs" after observing that it favors A introduces researcher degrees of freedom.

Preregistering:

> "The primary outcome is total engineer minutes from task assignment through accepted merge"

makes the experiment considerably harder to manipulate unconsciously.

## Library sources


- [Wohlin et al. 2024](/sources/c07438c70e29bb5bfa57fbc2bc8ae6b6.bin), *Experimentation in Software Engineering* -- the experiment process and each of its steps; on *Experiments* (ch. 6, *Process* 6.3), *Scoping* (ch. 8), *Planning* (ch. 9, with *Hypothesis Formulation* 9.2) and *Analysis and Interpretation* (ch. 11)

Further reading:

- [Marczyk et al. 2005](/sources/8b198ee52250fb21e5e2839e1fe56d96.bin), *Essentials of Research Design and Methodology*
- [Treude and Storey 2025](/sources/a9ef1bb46c863ff00c25f1acda85a9c6.bin), *Generative AI and Empirical Software Engineering: A Paradigm Shift* -- how LLMs change the phenomena, methods and validity threats of empirical software engineering
