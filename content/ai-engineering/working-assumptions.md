---
draft: false
toc: true
title: "AI Engineering Working Assumptions"
description: "Plausible proposals are becoming abundant; good experiments and discriminating evidence remain scarce. Scoped task performance, explicit evaluators, and whole-job feedback connect alternatives to useful outcomes."
date: "2026-02-03T00:00:00-03:00"
lastmod: "2026-02-03T00:00:00-03:00"
linkTitle: "Working Assumptions"
sidebar:
  weight: 1
---
## February 2026


These are hypotheses, not doctrine. I update them as evidence changes, and previous versions remain available in the site's history.

### Intelligence is scoped task-solving capacity


I use *intelligence* to mean the capacity of a specified system to solve tasks under specified conditions. It is an operational performance property, not a claim about the mechanism responsible for that performance.

An intelligence claim is incomplete unless it identifies the system, task or task distribution, operating conditions, and evaluation. Evidence of higher performance within that scope does not establish a general scalar ordering across systems.

Intelligence does not by itself imply understanding, grounding, reasoning by a particular mechanism, agency, autonomy, learning, reflection, meaning, selfhood, sentience, or consciousness.

The [capability notes]({{< ref "ai/capabilities" >}}) go one step further than this operational definition and treat a capability as a disposition inferred from scoped performance. [Capability claims and empirical method]({{< ref "ai/capabilities/empirical-method-map" >}}) sets the two positions side by side.

### The current AI cycle is a search problem


The durable question is not where a model can be deployed. It is which implementations can perform valuable jobs under real conditions. Current products are competing hypotheses in that search.

The job should be defined one level above the obvious AI task. In software engineering, for example, writing code is a task; safely delivering a useful software change is the job.

### LLMs generate proposals; evidence drives selection


LLMs make it cheap to generate plausible candidate explanations, plans, hypotheses, interpretations, and actions. They do not produce an unbiased sample of every possibility, and plausibility is not evidence.

The useful division of labor is:

```text
LLM = proposal generator
tools and environment = evidence generators
humans and objective tests = evaluators
```


The value lies in the complete loop: generate alternatives, derive their consequences, seek discriminating evidence, reject inconsistent candidates, test the survivors, and update.

### Measure the whole job and follow the bottleneck


Making one task dramatically cheaper does not necessarily improve the whole job in proportion. Requirements, context, review, integration, testing, coordination, or judgment may become the new constraint.

An AI intervention should therefore be followed by measurement of the whole outcome, identification of the new bottleneck, redesign, and another cycle of evaluation.

### Prefer strong reality signals


The most informative environments have valuable outcomes, digital evidence, results that can be checked, short feedback loops, and mistakes that are detectable and usually reversible. Closed loops allow weak hypotheses to fail quickly and useful ones to improve.

### A recurring thesis


Plausible candidates are becoming abundant. Good experiments and discriminating evidence remain scarce.

The durable engineering work is in building systems that turn cheap variation into useful outcomes through evidence, evaluation, feedback, and selection.

## Library sources


- [Silver and Sutton 2025](/sources/ai-foundations/intelligence-and-turing/silver-2025-era-of-experience.pdf.enc), *Welcome to the Era of Experience* -- on *Prefer strong reality signals*

Further reading:

- [He et al. 2026](/sources/ai-foundations/alignment-and-society/he-2026-beyond-human-measure.pdf.enc), *Beyond Human Measure: ASI Should Be Guided by Open-World Alignment* ([doi:10.20944/preprints202604.1749.v1](https://doi.org/10.20944/preprints202604.1749.v1))
- [Messeri and Crockett 2024](/sources/ai-foundations/alignment-and-society/messeri-2024-ai-and-illusions-of-understanding.pdf.enc), *Artificial intelligence and illusions of understanding in scientific research* ([doi:10.1038/s41586-024-07146-0](https://doi.org/10.1038/s41586-024-07146-0))
- [Butlin et al. 2023](/sources/ai-foundations/cognition-and-mind/butlin-2023-consciousness-in-ai.pdf.enc), *Consciousness in Artificial Intelligence* ([arXiv:2308.08708](https://arxiv.org/abs/2308.08708))
- [French 2000](/sources/ai-foundations/intelligence-and-turing/french-2000-turing-test-first-50-years.pdf.enc), *The Turing Test: the first 50 years*
- [Roitblat 2020](/sources/ai-foundations/intelligence-and-turing/roitblat-2020-algorithms-are-not-enough.pdf.enc), *Algorithms Are Not Enough: Creating General Artificial Intelligence*
- [Turing 1950](/sources/ai-foundations/intelligence-and-turing/turing-1950-computing-machinery-and-intelligence-copeland.pdf.enc), *Computing Machinery and Intelligence* ([doi:10.1093/oso/9780198250791.003.0017](https://doi.org/10.1093/oso/9780198250791.003.0017))
- [Wilhelm and Engle 2005](/sources/ai-foundations/intelligence-and-turing/wilhelm-2005-handbook-of-understanding-and-measuring-intelligence.pdf.enc), *Handbook of Understanding and Measuring Intelligence*
