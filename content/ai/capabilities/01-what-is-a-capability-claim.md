---
draft: false
toc: true
title: "What a Capability Claim Says"
description: "The starting problem: words like reasoning, planning, and agentic capability are used to describe LLMs without saying what kind of property they name or what evidence would support the claim."
weight: "10"
linkTitle: "Capability Claims"
---

We say that a model "can reason", "has strong planning", or "has better agentic capabilities". These sentences sound like reports of a measurement. Usually it is not clear what they claim.

This note sets out the problem. [The inference ladder]({{< ref "ai/capabilities/00-the-inference-ladder" >}}) has the whole argument on one page. The rest of the section works through it:

1. What kind of property a capability is ([capabilities as dispositions]({{< ref "ai/capabilities/02-capabilities-as-dispositions" >}})).
2. What a claim about such a property means ([what a disposition claim means]({{< ref "ai/capabilities/03-what-a-disposition-claim-means" >}}), [dispositions as response profiles]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}})).
3. How evidence could support the claim ([measuring dispositions]({{< ref "ai/capabilities/05-measuring-dispositions" >}}), [capability constructs and validity]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}})).
4. A worked case, reasoning ([reasoning as a capability]({{< ref "ai/capabilities/07-reasoning-as-a-capability" >}})), and its use in system design ([deriving capabilities from tasks]({{< ref "ai/capabilities/08-deriving-capabilities-from-tasks" >}})).

## The words are not established properties


Industry and benchmark vocabulary offers a ready list:

- reasoning;
- planning;
- autonomy;
- long-horizon capability;
- agentic capability;
- tool use, self-reflection, robustness.

These should not be taken as established natural properties of a system. The list mixes different kinds of things. Some items could be cognitive constructs. Others describe how the system is set up (what tools it has), its interface, or its outcomes (whether the task was finished). Whether "planning" or "reasoning" is a sound scientific construct for an LLM is itself part of the research problem, not a premise.

Sorted by what kind of thing each word names:

| Word | Kind | Why |
| --- | --- | --- |
| reasoning | candidate cognitive construct | Names a process the system is supposed to carry out. Earns the name only with a theory of which tasks show it and what it must be separable from ([06]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}})). |
| planning | candidate cognitive construct | Same status as reasoning, with a narrower task family. |
| tool use | system configuration, then a capability of the configured system | Whether tools are available is a design choice. Choosing and using them well is a capability, but of the model plus tools, which is a different system from the model alone. |
| long-horizon capability | a demand dimension, not a capability | Horizon length is a property of the task that makes it harder. It is a coordinate of \(\pi\), the axis along which some capability is measured, not the thing measured. |
| agentic capability | a bundle | Mixes configuration (a loop, tools, memory), outcomes (tasks completed), and several distinct capabilities. Nothing to measure until it is unbundled. |
| autonomy | mostly configuration and propensity | How much is delegated is decided by the deployer. How the system behaves when unsupervised is a propensity: it varies with incentives and oversight cues, not with task demands. |
| self-reflection | an output format, sometimes a capability | A model emitting text that looks like reflection is an interface fact. Whether the reflection changes the answer, and in the right direction, is the capability. |
| robustness | a feature of a response profile | How flat the profile stays across variation that should not matter. A summary \(\Phi\) of some other capability's profile, not a separate capability. |
| honesty, sycophancy | propensity | Varies with incentive-relevant features of the situation rather than with difficulty ([02]({{< ref "ai/capabilities/02-capabilities-as-dispositions" >}})). |

Only the first two rows are candidates for the kind of property the rest of this section is about. The others are either part of the measurement setup or part of what gets measured along the way.

Voudouris et al. make the same point about evaluation in general: *capabilities*, *propensities*, *skills*, *values*, and *abilities* are used interchangeably, and all of them are conflated with observed performance. Evaluations rarely say what quantity they measure. ([Voudouris et al. 2026](/sources/ai-foundations/capabilities-and-measurement/voudouris-2026-measuring-what-ai-might-do.pdf.enc), [arXiv:2603.00063](https://arxiv.org/abs/2603.00063))

## A score is not the claim


A benchmark score reports what happened on a fixed set of items:

> The model answered 78 of 100 questions correctly.

A capability claim says more. It is about questions that were not asked, harder versions of them, other phrasings, other deployments of the same model. Between the score and the claim there are several inferential steps. Reynolds names them: the result is generalized to further cases, interpreted as evidence of a capability, extrapolated to new tasks, transported to another system or site, and combined with assumptions about downstream use. Each step needs its own evidence, and evidence for one does not carry over to the next. ([Reynolds 2026, projectibility](/sources/ai-foundations/capabilities-and-measurement/reynolds-2026-projectibility.pdf.enc), [arXiv:2607.26159](https://arxiv.org/abs/2607.26159))

Treating the score as the capability only works if the capability *is* the exact distribution of benchmark items. That assumption is almost never defended.

The step from score to capability can also fail outright. A benchmark presented as measuring common-sense reasoning can contain cues that let a model score well without the intended reasoning ([Chizhov et al. 2025, "What the HellaSwag?"](/sources/ai-foundations/capabilities-and-measurement/chizhov-2025-what-the-hellaswag.pdf.enc), [arXiv:2504.07825](https://arxiv.org/abs/2504.07825)). A review of 445 LLM benchmarks found recurring problems in how authors move from an abstract capability to tasks and scores ([Bean et al. 2025](/sources/ai-foundations/capabilities-and-measurement/bean-2025-measuring-what-matters.pdf.enc), [NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/hash/1967e0fc3aa6cbbace562f5cb8e3954e-Abstract-Datasets_and_Benchmarks_Track.html)).

## A better starting point


Instead of beginning with the label, begin with a behavioral regularity and treat the label as a hypothesis.

Not:

> Agent X has better planning capability.

But:

> Performance appears to degrade as dependencies between actions get longer.

Then propose a construct that would explain the regularity, for example *prospective plan maintenance*, and derive a prediction that could fail:

> If this construct exists and architecture B improves it, B should outperform A as dependency depth increases, and should show little advantage when the same number of independent actions is required.

The construct earns its name only if predictions like this hold.

## The hardest case: understanding


"Understanding" is used of LLMs more often than any word in the list above, and it is the hardest to place on the ladder. For reasoning there is at least rough agreement about the manifestation: a correct conclusion from given premises. For understanding there is not. One speaker means fluent paraphrase, another means transfer to a new domain, a third means an internal model that supports prediction and intervention. These are different conditions and different manifestations, so they are different disposition claims wearing one word.

The working dictionary in [research terms and levels of analysis]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}) takes the third reading: understanding is having internal representations that support reliable prediction, intervention, transfer, and counterfactual reasoning about what they represent, and it is kept separate from task competence. In the terms of this section, that definition does one useful thing. It names a manifestation family, prediction, intervention, transfer, counterfactual answers, that can be varied and measured. Until a claim about understanding is pinned to such a family, it sits at the construct rung with nothing beneath it.

## Questions for the rest of the section


- What kind of property is a capability? Something the system has, or a description of its behavior?
- A claim about what a system *would* do goes beyond what it *did*. What licenses that step?
- Who decides which situations a capability claim covers?
- What should be varied in an evaluation, and what held fixed?
- When does a regularity in behavior deserve a name like "reasoning"?

## Library sources


- [Ryle 1949](/sources/ai-foundations/cognition-and-mind/ryle-1949-concept-of-mind.pdf.enc), *The Concept of Mind* -- on *The hardest case: understanding*
- [Li et al. 2024](/sources/thinking-and-learning/reflection-and-lessons-learned/li-2024-when-hindsight-is-not-20-20.pdf.enc), *When Hindsight is Not 20/20* ([arXiv:2404.09129](https://arxiv.org/abs/2404.09129)) -- on *The words are not established properties*

Further reading:

- [Chang et al. 2024](/sources/ai-engineering/evaluation/chang-2024-survey-on-evaluation-of-llms.pdf.enc), *A Survey on Evaluation of Large Language Models* ([doi:10.1145/3641289](https://doi.org/10.1145/3641289))
- [Guo et al. 2023](/sources/ai-engineering/evaluation/guo-2023-evaluating-llms-comprehensive-survey.pdf.enc), *Evaluating Large Language Models: A Comprehensive Survey* ([arXiv:2310.19736](https://arxiv.org/abs/2310.19736))
- [Liang et al. 2023](/sources/ai-engineering/evaluation/liang-2023-holistic-evaluation-of-language-models.pdf.enc), *Holistic Evaluation of Language Models (HELM)* ([arXiv:2211.09110](https://arxiv.org/abs/2211.09110))
- [Zhu et al. 2025](/sources/ai-engineering/evaluation/zhu-2025-best-practices-for-rigorous-agentic-benchmarks.pdf.enc), *Establishing Best Practices for Building Rigorous Agentic Benchmarks* ([arXiv:2507.02825](https://arxiv.org/abs/2507.02825))
- [Coeckelbergh and Gunkel 2025](/sources/ai-foundations/alignment-and-society/coeckelbergh-2025-communicative-ai.pdf.enc), *Communicative AI: A Critical Introduction to Large Language Models*
- [Eriksson et al. 2025](/sources/ai-foundations/capabilities-and-measurement/eriksson-2025-can-we-trust-ai-benchmarks.pdf.enc), *Can We Trust AI Benchmarks? An Interdisciplinary Review of Current Issues in AI Evaluation* ([arXiv:2502.06559](https://arxiv.org/abs/2502.06559))
- [Turing 1950](/sources/ai-foundations/intelligence-and-turing/turing-1950-computing-machinery-and-intelligence-copeland.pdf.enc), *Computing Machinery and Intelligence* ([doi:10.1093/oso/9780198250791.003.0017](https://doi.org/10.1093/oso/9780198250791.003.0017))
- [Mahowald et al. 2024](/sources/language/language-and-llms/mahowald-2024-dissociating-language-and-thought-in-llms.pdf.enc), *Dissociating language and thought in large language models* ([doi:10.1016/j.tics.2024.01.011](https://doi.org/10.1016/j.tics.2024.01.011))
- [de la Croix and Veen 2018](/sources/thinking-and-learning/reflection-and-lessons-learned/de-la-croix-2018-reflective-zombie.pdf.enc), *The reflective zombie* ([doi:10.1007/s40037-018-0479-9](https://doi.org/10.1007/s40037-018-0479-9))
