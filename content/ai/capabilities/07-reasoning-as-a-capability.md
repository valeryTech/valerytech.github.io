---
draft: false
toc: true
title: "Reasoning as a Capability"
description: "A worked case: decomposing reasoning into capacity, representation, inference, knowledge, control, and metacognition, mapping the human literature onto LLMs, and evaluating reasoning as a capability profile rather than one score."
weight: "70"
linkTitle: "Reasoning"
---

This note applies the section to one capability. [Capability constructs and validity]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}) says a capability construct needs task families, demand dimensions, and relations to neighboring constructs. For reasoning, the human literature already offers much of that structure.

## Working definition


> **Reasoning capability** is a system's ability to transform available information, through useful intermediate representations and inference steps, into correct and calibrated conclusions or actions on problems that require more than direct recall.

The last clause matters. If a model has memorized the answer, we have learned about its knowledge and very little about its reasoning. In the terms of [what a disposition claim means]({{< ref "ai/capabilities/03-what-a-disposition-claim-means" >}}), a recalled answer is a mimic: the right output by the wrong path.

## Reasoning in human cognition


Cognitive psychology, psychometrics, and decision science treat reasoning as more than IQ. A useful summary:

\[\text{reasoning capability} \approx \text{capacity} + \text{representations and strategies} + \text{relevant knowledge} + \text{dispositions to use them}\]

People with similar cognitive ability differ in rational judgment because they differ in strategies, knowledge of logic and probability, willingness to reconsider, and tendency to engage reflective processing ([Stanovich and West 2000](https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/individual-differences-in-reasoning-implications-for-the-rationality-debate/2906AEF620B36C10018DD291F790BE97)).

| Area | Key idea | Entry point |
| --- | --- | --- |
| Fluid reasoning | Solving novel problems with little reliance on learned knowledge | Ferrer, O'Hare and Bunge, [Fluid reasoning and the developing brain](https://pmc.ncbi.nlm.nih.gov/articles/PMC2858618/) |
| Relational reasoning | Representing and combining relations; central to analogy | Holyoak, [Analogy and relational reasoning](https://academic.oup.com/edited-volume/34559/chapter/293248246) |
| Reflective reasoning | Overriding an immediate response and reasoning hypothetically; depends on working memory | Evans and Stanovich, [Dual-process theories](https://pubmed.ncbi.nlm.nih.gov/26172965/) |
| Rational thinking | Intelligence and good judgment are related but separable | [Stanovich and West](https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/individual-differences-in-reasoning-implications-for-the-rationality-debate/2906AEF620B36C10018DD291F790BE97) |
| Mental models | Reasoning by constructing possible situations and searching for counterexamples | Johnson-Laird, [Mental models and human reasoning](https://pmc.ncbi.nlm.nih.gov/articles/PMC2972923/) |
| Probabilistic reasoning | Everyday inference is better described by probability than by formal logic | Oaksford and Chater, [Bayesian Rationality](https://academic.oup.com/book/4597) |
| Thinking dispositions | Seeking counterevidence and considering alternatives predict reasoning beyond ability | Stanovich and Toplak, [Actively open-minded thinking](https://pmc.ncbi.nlm.nih.gov/articles/PMC9966223/) |
| Metacognition | Monitoring and regulating one's own cognition | Fleur, Bredeweg and van den Bos, [Metacognition](https://www.nature.com/articles/s41539-021-00089-5) |
| Social reasoning | Reasoning may have evolved for producing and evaluating arguments | Mercier and Sperber, [Why do humans reason?](https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/abs/why-do-humans-reason-arguments-for-an-argumentative-theory/53E3F3180014E80E8BE9FB7A2DD44049) |

For measurement of intelligence and reasoning in humans, see Wilhelm and Engle's *Handbook of Understanding and Measuring Intelligence* (2005; [PDF](/sources/2375228c6a7957a1808fc25b83be9a33.bin)).

Training results show the parts are separable. Explicit critical-thinking instruction produces measurable gains (a meta-analysis of 341 effect sizes: about \(g = 0.30\), [Abrami et al. 2015](https://doi.org/10.3102/0034654314551063)). Working-memory training shows little or no transfer to fluid intelligence ([2024 meta-analysis](https://pubmed.ncbi.nlm.nih.gov/38366265/)).

### Components


| Component | Content |
| --- | --- |
| Capacity | working memory, attention, relational complexity |
| Representation | models of possibilities and of causal and relational structure |
| Inference | deduction, induction, abduction, analogy, probabilistic updating |
| Knowledge | logic, probability, statistics, causal concepts, domain knowledge |
| Control | recognizing when intuition is inadequate and engaging deliberate reasoning |
| Epistemic disposition | seeking counterevidence, considering alternatives, updating, calibrating confidence |
| Metacognition | detecting uncertainty and errors in one's own reasoning |

Note that "disposition" here is used in the psychologists' sense of a thinking tendency. In the sense of [capabilities as dispositions]({{< ref "ai/capabilities/02-capabilities-as-dispositions" >}}), every row is a disposition.

## From human constructs to LLMs


| Human construct | AI analogue | What to measure |
| --- | --- | --- |
| Capacity, working memory | Effective internal state plus available inference compute | Performance as problem complexity and compute budget increase |
| Mental representations | Internal representations, chain of thought, latent reasoning state | Whether the right variables and relations are represented and composed correctly |
| Inference strategies | Decomposition, deduction, search, sampling, backtracking | Generalization to novel compositions; error propagation |
| Knowledge | Parametric knowledge plus retrieved information | Performance when all required premises are supplied |
| Reflective control | Choosing whether and how to reason, search, verify, ask, or use tools | Adaptive allocation of computation |
| Epistemic dispositions | Checking alternatives, testing assumptions | Robustness to misleading hints, distractors, framing |
| Metacognition | Confidence, error detection, abstention, strategy switching | Calibration; recognizing that information is missing |
| External aids | Calculators, code, retrieval, solvers, verifiers | Choosing and correctly using external operations |

### 1. Capacity is partly a compute budget


Capability depends on the trained model and on the computation allowed at inference. OpenAI reported o1 improving with both training-time RL compute and inference-time compute ([OpenAI](https://openai.com/index/learning-to-reason-with-llms/)). Snell et al. showed that allocating test-time compute well can let a smaller model beat a much larger one on some problems ([arXiv](https://arxiv.org/abs/2408.03314)).

But more thinking does not mean monotonically better reasoning:

\[\text{more thinking} \not\Rightarrow \text{better reasoning}\]

Anthropic found tasks where longer reasoning lowers accuracy ([inverse scaling in test-time compute](https://alignment.anthropic.com/2025/inverse-scaling/)). Apple's controlled puzzles showed collapse as compositional complexity grows; Dellibarda Varela et al. replicate and refine two of those puzzles (Towers of Hanoi, River Crossing) and qualify the conclusions ([Dellibarda Varela et al. 2025](/sources/86edf232a4144ab902dd5f19092c91ca.bin), [arXiv:2507.01231](https://arxiv.org/abs/2507.01231)). A 2026 review separates three kinds of inference compute: extending one trajectory, sampling many, and searching over partial ones ([arXiv](https://arxiv.org/abs/2608.04001)).

So reasoning capability is better written as \(C(T, B)\), capability on a task distribution \(T\) under budget \(B\), than as one universal score. In dispositional terms, the budget is one more coordinate of \(\pi\).

### 2. Representation matters more than chain of thought


Chain-of-thought prompting showed that generating intermediate tokens greatly improves multi-step performance ([Wei et al.](https://arxiv.org/abs/2201.11903)). But written reasoning is not the same as the mechanism. Turpin et al. showed that explanations can hide the factors that actually drove the answer ([arXiv](https://arxiv.org/abs/2305.04388)), and later work finds the same for reasoning models: traces are informative, not guaranteed faithful.

Coconut lets models carry intermediate computation in continuous hidden states instead of tokens, with gains on tasks that need branching and backtracking ([arXiv](https://arxiv.org/abs/2412.06769)). This matches the mental-model view:

\[\text{reasoning} = \text{build a representation} \rightarrow \text{operate on it} \rightarrow \text{evaluate the result}\]

Natural-language chain of thought is one possible representation format.

### 3. Reasoning skill looks like a learned policy over operations


- **Self-consistency**: sample several reasoning paths and aggregate ([arXiv](https://arxiv.org/abs/2203.11171)).
- **Tree of Thoughts**: explore, evaluate, and backtrack over candidate states ([arXiv](https://arxiv.org/abs/2305.10601)).
- **Verifiers**: generate candidates and train a separate judge ([arXiv](https://arxiv.org/abs/2110.14168)).
- **Process supervision**: reward intermediate steps, not only the final answer ([Let's Verify Step by Step](https://proceedings.iclr.cc/paper_files/paper/2024/hash/aca97732e30bcf1303bc22ac3924fd16-Abstract-Conference.html)).
- **ReAct**: interleave reasoning with actions that gather information ([arXiv](https://doi.org/10.48550/arXiv.2210.03629)); see also [the ReAct notes]({{< ref "ai-engineering/agents/react/definition-and-lineage" >}}).

These are less about knowing more and more about procedures for using what is known. DeepSeek-R1 showed that RL with verifiable rewards produced reflection, verification, and strategy switching without human-written trajectories ([Nature](https://doi.org/10.1038/s41586-025-09422-z)). A decomposition:

\[\text{reasoning performance} = f(K, R, P, S, V, B)\]

where \(K\) is available knowledge, \(R\) quality of representations, \(P\) the reasoning policy, \(S\) search ability, \(V\) verification ability, and \(B\) the compute budget. This is more useful than calling some models "reasoning models".

### 4. Knowledge and reasoning have to be separated experimentally


A clean reasoning test supplies all premises and varies the required transformation. Otherwise failure could mean either missing knowledge or failure to infer from known facts. Retrieval-augmented systems deliberately combine the two: retrieval supplies premises, reasoning decides what to retrieve and how to combine it ([survey](https://aclanthology.org/2025.findings-emnlp.648/)). RAG performance is therefore not automatically reasoning capability: retrieval changes the information available, which in dispositional terms changes the system boundary.

### 5. Metacognition may be a separate capability


A strong reasoner should be able to tell whether it understands the problem, whether information is missing, how confident it is, which strategy to use, whether to use a tool, whether to generate alternatives, and when to stop. A 2026 survey organizes LLM metacognition around monitoring and control ([arXiv](https://arxiv.org/abs/2607.11881)); for architectures, see Nolte's review ([PDF](/sources/2af58406e13e42072bca886ec3caf534.bin), [doi:10.1007/s10462-026-11669-5](https://doi.org/10.1007/s10462-026-11669-5)).

Gaps remain. Reasoning models can recognize that information is insufficient and still give an unsupported answer ([arXiv](https://doi.org/10.48550/arXiv.2605.28070)):

\[\text{error detection} \neq \text{appropriate error response}\]

This mirrors Stanovich: computational ability alone does not ensure that the right process is engaged.

## Evaluating reasoning as a profile


Not one benchmark score, but a **capability profile**. Each item is a demand dimension or a task family in the sense of [capability constructs and validity]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}):

1. **Novel composition**: known rules combined in unseen ways.
2. **Complexity scaling**: accuracy as inference depth grows.
3. **Compute scaling**: how much extra inference compute helps.
4. **Efficiency**: compute needed for a given success probability.
5. **Search quality**: exploring alternatives and recovering from bad branches.
6. **Verification**: whether detecting a wrong solution is easier than producing a right one.
7. **Robustness**: whether irrelevant premises, misleading hints, or framing change conclusions.
8. **Calibration**: whether confidence tracks correctness.
9. **Abstention and inquiry**: recognizing missing information and asking for it.
10. **Transfer**: whether the procedure carries over to structurally similar, superficially different tasks.

ARC-AGI-2 targets novel abstraction ([arcprize.org](https://arcprize.org/arc-agi/2)); FrontierMath, Humanity's Last Exam, and OlymMATH push expert difficulty. Math benchmarks mainly measure mathematical reasoning, and models show clear limits on open argumentative reasoning in natural language ([ACL 2025](https://aclanthology.org/2025.findings-acl.192/)). A general reasoning evaluation needs several domains.

The question to ask is not "can LLMs reason?" but **which component fails, under which shift in distribution, and how the failure changes as information and computation vary**.

## Reading


Human reasoning, roughly in order:

1. Jonathan Baron, *Thinking and Deciding* (5th ed., 2023): logic, probability, hypothesis testing, actively open-minded thinking. [Cambridge](https://www.cambridge.org/highereducation/books/thinking-and-deciding/5EA7EBEACA950A41646043CBC4D04886)
2. Philip Johnson-Laird, *How We Reason*: reasoning as a cognitive mechanism. [OUP](https://academic.oup.com/book/11984)
3. Keith Stanovich, *Rationality and the Reflective Mind*: separates computational capacity from reflective control and thinking dispositions. [OUP](https://academic.oup.com/book/5930)
4. Stanovich, West and Toplak, *The Rationality Quotient*: what an assessment of rational thinking would measure. [MIT Press](https://mitpress.mit.edu/9780262034845/the-rationality-quotient/)
5. Holyoak and Morrison (eds.), *The Oxford Handbook of Thinking and Reasoning*. [OUP](https://academic.oup.com/edited-volume/34559)
6. Oaksford and Chater, *Bayesian Rationality*. [OUP](https://academic.oup.com/book/4597)
7. Mercier and Sperber, *The Enigma of Reason*.

AI reasoning:

1. Russell and Norvig, *Artificial Intelligence: A Modern Approach*: search, constraint satisfaction, logic, probabilistic reasoning, planning. [PDF](/sources/c85f4853f67516e521a455cdea6aeedc.bin)
2. Wei et al., chain-of-thought prompting.
3. Yao et al., Tree of Thoughts.
4. Lightman et al., Let's Verify Step by Step.
5. Snell et al., scaling test-time compute.
6. DeepSeek-R1.
7. Kambhampati, Stechly and Valmeekam, [(How) do reasoning models reason?](https://nyaspubs.onlinelibrary.wiley.com/doi/abs/10.1111/nyas.15339), a skeptical reading of what these results show.
8. Liu et al. (2026), metacognition in LLMs.
9. Sumers et al., *Cognitive Architectures for Language Agents*. [PDF](/sources/979eab1fc41b7066edf51770802bf09d.bin)

Also: Kochenderfer, Wheeler and Wray, [*Algorithms for Decision Making*](https://mitpress.ublish.com/book/algorithms-for-decision-making); Pearl, [*Causality*](https://www.cambridge.org/core/books/causality/B0046844FAE10CBF274D4ACBDAEB5F5B); Sebastian Raschka, *Build a Reasoning Model (From Scratch)* ([PDF](/sources/f3150de6e11ff0d18db1eae975db2f98.bin)) (2026), for the engineering side.

## Library sources


- [Cui et al. 2026](/sources/c0787e6b002b3193a564d0d985b75f62.bin), *Measuring the Unmeasurable*
- [Lu et al. 2024](/sources/8d24ac43f69499f7108a7c2837faa72f.bin), *Are Emergent Abilities in Large Language Models just In-Context Learning?* ([arXiv:2309.01809](https://arxiv.org/abs/2309.01809)) -- on *4. Knowledge and reasoning have to be separated experimentally*
- [Shojaee et al. 2025](/sources/a1b801eb54f7be4be97bca840d16bb64.bin), *The Illusion of Thinking* -- on *1. Capacity is partly a compute budget*
- [Zhou et al. 2026](/sources/76e02efd0fb2f02796388644a91327d0.bin), *General scales unlock AI evaluation with explanatory and predictive power* ([doi:10.1038/s41586-026-10303-2](https://doi.org/10.1038/s41586-026-10303-2)) -- on *Evaluating reasoning as a profile*
- [Hamilton et al. 2024](/sources/37affd9279cab197f5ec9c63c8af2c8e.bin), *Is neuro-symbolic AI meeting its promises in natural language processing? A structured review* ([doi:10.3233/SW-223228](https://doi.org/10.3233/SW-223228)) -- on *Working definition*
- [Gao et al. 2025](/sources/d3f64fccb6acf62b35b4e70d7e0e588b.bin), *Synergizing RAG and Reasoning: A Systematic Review* ([arXiv:2504.15909](https://arxiv.org/abs/2504.15909)) -- on *4. Knowledge and reasoning have to be separated experimentally*
- [Davidson and Sternberg 2003](/sources/86bdc5d428ebe1e2aa85e1413940ba8f.bin), *The Psychology of Problem Solving* -- on *Reasoning in human cognition*

Further reading:

- [Kearns 2025](/sources/b905bdbeb5794014d45a8888fc9b85bd.bin), *Quantifying construct validity in large language model evaluations* ([arXiv:2602.15532](https://arxiv.org/abs/2602.15532))
- [Mohsin et al. 2025](/sources/52ba2872a178acfd074f7a58fbc37efa.bin), *On the Fundamental Limits of LLMs at Scale* ([arXiv:2511.12869](https://arxiv.org/abs/2511.12869))
- [Baddeley et al. 2020](/sources/b130452e34ab0be753e894e35327f6af.bin), *Memory*
- [Binz et al. 2025](/sources/0207741285ce650aba6d4b4eff6e8350.bin), *A foundation model to predict and capture human cognition* ([doi:10.1038/s41586-025-09215-4](https://doi.org/10.1038/s41586-025-09215-4))
- *Reasoning and Agency in Contemporary AI Research*, a ChatGPT Deep Research report
- [Fleming 2020](/sources/8d2c25f86959a22ceddaacca6e9c0c91.bin), *Awareness as inference in a higher-order state space* ([doi:10.1093/nc/niz020](https://doi.org/10.1093/nc/niz020))
- [Nobre and Gresch 2025](/sources/e3bc15ed61f3e0330df638a73650c7bf.bin), *How the brain shifts between external and internal attention* ([doi:10.1016/j.neuron.2025.06.013](https://doi.org/10.1016/j.neuron.2025.06.013))
- [Sandved-Smith et al. 2021](/sources/d6797164b8651f2bb59d8b26e9c8931a.bin), *Towards a computational phenomenology of mental action* ([doi:10.1093/nc/niab018](https://doi.org/10.1093/nc/niab018))
- [Schwieter and Wen 2022](/sources/ead1fef4c544e8e31cb255f2f93b0465.bin), *The Cambridge Handbook of Working Memory and Language* ([doi:10.1017/9781108955638](https://doi.org/10.1017/9781108955638))
- [Mahowald et al. 2024](/sources/d3e4e4f8abb1b5705082eb2c4c76ee17.bin), *Dissociating language and thought in large language models* ([doi:10.1016/j.tics.2024.01.011](https://doi.org/10.1016/j.tics.2024.01.011))
- [Zheng et al. 2025](/sources/36c71a2d45176db9f43db03d50458e9e.bin), *Stabilizing Reinforcement Learning with LLMs* ([arXiv:2512.01374](https://arxiv.org/abs/2512.01374))
- [Kahneman 2011](/sources/6b0f64ff483334496619f7f55334a949.bin), *Thinking, Fast and Slow*
- [Frensch and Funke 1995](/sources/fa071f1fee948fe9ce3ecbd3bafae933.bin), *Complex Problem Solving: The European Perspective*
