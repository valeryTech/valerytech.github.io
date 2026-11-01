---
draft: false
toc: true
title: "Evidence Appraisal"
description: "Claims that AI tools improve engineering need evidence about outcomes, causes, and hidden costs. These notes connect critical appraisal, empirical methods, and evaluation protocols to that investigation."
linkTitle: "Evidence Appraisal"
---

These notes apply the general method in [Evidence in software engineering]({{< ref "engineering/evidence" >}}) to claims about AI tools.

An evidence methodology for AI engineering can build on established scientific traditions, adapted to stochastic systems and human participation.

A useful combination is:

**Evidence-Based Software Engineering + Empirical Software Engineering + causal inference/social-science experiment design + open-science practices + HCI/qualitative methods.**

Together, these traditions support a coherent evidence discipline for AI engineering. In the vault they are in:

- evidence-based software engineering: [EBSE]({{< ref "engineering/evidence/ebse" >}});
- empirical software engineering: [Running an experiment]({{< ref "engineering/evidence/running-experiments" >}}) and [Choosing a method]({{< ref "engineering/evidence/choosing-a-method" >}});
- causal inference: [Causal claims need a comparison]({{< ref "engineering/evidence/causal-claims" >}});
- open science: [preregistration]({{< ref "engineering/evidence/running-experiments" >}}#preregistration) and [reproducibility]({{< ref "engineering/evidence/validity" >}}#reproducibility);
- qualitative methods: [case studies and qualitative methods]({{< ref "engineering/evidence/choosing-a-method" >}}#case-studies-and-qualitative-methods).

## Notes


- [AI engineering evidence protocol]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/evidence-protocol" >}}) -- what a claim about coding agents must report: population, intervention, metrics fixed in advance, baseline, downstream effects, failures and uncertainty.
- [A Zalando case critique]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/zalando-case-critique" >}}) -- one company's report on agentic engineering, read claim by claim.

## Implications for AI engineering


These established methods support the following framing:

**AI Engineering = engineering of probabilistic systems using explicit empirical methodology.**

The protocol wouldn't prescribe "always run an RCT." [Different claims require different methods.]({{< ref "engineering/evidence/choosing-a-method" >}}#different-claims-different-methods)

Interestingly, there is already movement specifically in this direction for AI. A July 2026 preprint proposes 33 guidelines for randomized controlled trials in AI evaluation, explicitly drawing from software engineering, economics, psychology, health sciences, validity theory, and open science. Its stated goal addresses a shared methodological problem: AI evaluation lacks shared standards for producing cumulative, comparable evidence. ([arXiv](https://arxiv.org/abs/2605.02050 "[2605.02050] Principles and Guidelines for Randomized Controlled Trials in AI Evaluation"))

These traditions provide a substantial methodological foundation.

A coherent AI-engineering methodology can **combine the scientific machinery** from these disciplines--hypothesis formulation, construct definition, experimental units, randomization, controls, confounders, power, effect sizes, causal diagrams, preregistration, replication, validity analysis, triangulation, etc.--and turn it into a coherent methodology specifically for evaluating GenAI and agentic software systems. This supplies concrete mechanisms for an AI Engineering Evidence Protocol.
