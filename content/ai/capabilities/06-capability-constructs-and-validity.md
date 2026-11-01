---
draft: false
toc: true
title: "Capability Constructs and Validity"
description: "How construct theory and dispositional measurement fit together: the nomological network says what a capability like reasoning means, response functions supply the evidence, and validity checks whether they agree."
weight: "60"
linkTitle: "Constructs and Validity"
---

[Measuring dispositions]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) gives a way to recover how a system responds to varying demands. It does not say which of these regularities deserve a name like *reasoning*. That is a question about **constructs**.

The two approaches have different jobs:

> **Construct theory** defines what a capability means.
> **Dispositional measurement** defines what behavior would count as evidence that a particular system has it.

## Latent variables and the validity question


Science routinely deals with properties that cannot be observed directly. Psychology and education treat intelligence, anxiety, and reading ability as latent variables inferred from test items, using factor analysis, item response theory, and structural equation modeling. Economics models latent preferences and productivity; medicine infers latent disease states from symptoms and tests.

The pattern is:

\[\text{latent property} \rightarrow \text{observable indicators}\]

for example, intelligence underlying verbal, spatial, and math tests.

A statistical model can always find structure in data. That does not show that the structure is the construct claimed. Science separates:

- **statistical fit**, and
- **construct validity**.

A factor that predicts several benchmark scores may be useful while being a mix of knowledge, task familiarity, language skill, and other things rather than "reasoning". The criticism of AI evaluation is not that it uses latent variables. It is that it often treats a statistically inferred score as a capability without the theory or causal evidence to justify that reading. Voudouris et al. make this criticism of latent-variable methods directly ([§4](/sources/a7b1db57e43f6200e8de28a3f4e6e12d.bin), [arXiv:2603.00063](https://arxiv.org/abs/2603.00063)).

## The nomological network


Cronbach and Meehl (1955) introduced the **nomological network**: before claiming a test measures a construct, specify what the construct should relate to, what it should be distinct from, and which observable behaviors should change as it changes.

Freiesleben applies this to LLM benchmarks. A construct such as reasoning gets its meaning from its relations to narrower tasks and to neighboring constructs (working memory, knowledge, processing speed), not from one benchmark score. The network should be built before the benchmark. His running example is the Cattell-Horn-Carroll (CHC) model, where narrow tasks sit beneath broad abilities. ([Freiesleben 2026](/sources/c84d75800beb21af8a1cc54b8f79c168.bin), [arXiv:2603.15121](https://arxiv.org/abs/2603.15121))

So a nomological definition would not say:

> Reasoning is accuracy on GSM8K.

It would say something like:

> Reasoning is a capability manifested across inductive, deductive, relational, and planning tasks, with specified relations to working memory, knowledge, and processing speed.

## Division of labor

```text
                    CONSTRUCT THEORY
                       "reasoning"
                           │
             ┌─────────────┼──────────────┐
             │             │              │
         induction     deduction       planning
             │             │              │
             ▼             ▼              ▼
        task family    task family    task family
             │
             ▼
      demand dimensions
    ┌────────┼─────────┐
  depth   branching  distractors
             │
             ▼
  vary demands systematically
             │
             ▼
  dispositional response function
  P(success | depth, branching, distractors, system)
             │
             ▼
  thresholds / slopes / interactions
             │
             ▼
     NOMOLOGICAL VALIDATION
  relations among tasks and constructs
```


The construct answers **which behaviors belong together, and why this family is called reasoning**. That is a theoretical question.

The disposition answers **how strongly a given system manifests the capability as the relevant demands change**. That is a measurement question. Within deductive reasoning, for instance, the demands might be

\[\pi = (\text{inference depth},\ \text{number of premises},\ \text{distractor count},\ \text{representation complexity})\]

and the measurement is \(f_S(\pi) = P(\text{correct conclusion} \mid \pi, S)\) for a fixed system \(S\).

\(f_S(\pi)\) is the \(p(v \mid \pi, \theta)\) of [05]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) written as a function of \(\pi\) alone, with the system fixed; the notation map is in [the inference ladder]({{< ref "ai/capabilities/00-the-inference-ladder" >}}).

| Question | Construct approach | Disposition approach |
| --- | --- | --- |
| What is reasoning? | yes | not by itself |
| Which tasks instantiate it? | yes | depends on theory |
| What should vary inside those tasks? | partly | central question |
| How does the system respond to rising demand? | usually weakly specified | central object |
| Is reasoning distinct from memory? | convergent and discriminant evidence | can contribute |
| Is reasoning an internal mechanism? | not required | not required |

## A capability need not be a scalar


Freiesleben builds capability scores from weighted task scores and validates their relations. The dispositional view gives a reason to keep more structure. Instead of

\[\operatorname{Reasoning}(S) = 0.78\]

describe the system by a set of demand-response functions:

\[R_S = \{f_{\text{induction},S},\ f_{\text{deduction},S},\ f_{\text{planning},S},\ \ldots\}\]

```text
Deduction   threshold depth 9, steep decline after it, low distractor sensitivity
Induction   extrapolation threshold 14, high abstraction sensitivity
Planning    horizon threshold 7, very high branching sensitivity
```


The whole profile instantiates the construct. A scalar can be derived later for a particular use, as a summary of an already validated construct.

## Validity criteria, restated


**Content validity.** Do the task families cover the construct (induction, deduction, relational inference, planning, constraint reasoning)? And within each family, does the experiment cover its demand space? Under-representation can happen at two levels:

- missing task families, such as a reasoning benchmark that contains only arithmetic;
- missing demand ranges, such as deduction tasks with inference depth only from 1 to 3.

**Convergent validity.** Independent operationalizations of the same construct should give related dispositional parameters, for example the depth threshold in symbolic deduction and in natural-language deduction.

**Discriminant validity.** Variation attributed to the construct should not just reproduce other capabilities. Sensitivity to reasoning depth should be separable from sensitivity to rare vocabulary.

**Criterion validity.** The measured disposition should predict performance on real tasks not used to build the measurement, for instance a planning response surface predicting unseen long-horizon agent tasks. This matters most, because a disposition is supposed to support counterfactual prediction, not summarize the test set.

Response functions make these tests sharper. If the network says reasoning and working memory are related and reasoning and emotional understanding are mostly independent, test it across many systems on dispositional parameters:

\[\operatorname{corr}(\text{working-memory threshold},\ \text{reasoning-depth threshold}) > 0\]

That is stronger evidence than "math accuracy correlates with memory benchmark accuracy", because the varied demand is defined independently.

## No conflict over causality


Freiesleben rejects Borsboom's strong causal account of validity, which would need an internal "reasoning faculty" that causes benchmark behavior. There is little basis for claiming such an entity in an LLM. The dispositional approach still talks about causes, but a different kind:

\[
\text{not}\quad \operatorname{Reasoning}_{\text{internal}} \rightarrow \text{Behavior}

\qquad\text{but}\quad \text{inference depth} \rightarrow P(\text{successful inference})
\]

with the system held fixed. So reasoning can stay a theoretical construct defined by a nomological network, while its evidence consists of causal response patterns in context. Reasoning does not have to be reified as a module.

## A combined definition


> **A capability construct is a theoretically specified family of dispositional relations between task demands and behavior, whose identity is fixed by its relations to task families, neighboring constructs, and empirical outcomes.**

\[C = (T_C,\ F_C,\ N_C)\]

- \(T_C\): the task families in which the construct manifests;
- \(F_C\): the demand-response functions for those families;
- \(N_C\): the nomological relations to other constructs.

For a system \(S\):

\[F_{C,S} = \left\{ P(v_k \mid \pi_k, S) \right\}_{k \in T_C}\]

Construct validation asks whether the profiles \(F_{C,S}\) behave as \(N_C\) predicts.

Each approach alone has a gap. Construct theory alone risks "here is our concept of reasoning, and here are some tasks", with no account of what drives variation inside the tasks. Dispositional measurement alone risks "performance falls with transformation depth", with no reason to call that reasoning. Together:

```text
Nomological theory        →  what the construct means
Task theory               →  where it manifests
Disposition theory        →  which demands modulate it
Controlled measurement    →  response surfaces
Construct validation      →  relations across tasks and constructs
Revision                  ↺
```


The construct layer says which capability categories deserve names. The disposition layer says whether those categories correspond to stable, measurable structure in behavior.

## Building a construct of LLM reasoning

```text
LLM reasoning
   ↓ theoretical definition
dimensions / subconstructs
   ↓
observable reasoning tasks
   ↓
benchmark items
   ↓
scoring model
   ↓
validation evidence
```


Candidate subconstructs: deductive, inductive, abductive, causal, analogical, quantitative, compositional or multi-step reasoning, and planning. Each needs evidence that it belongs under a broader reasoning construct and is separable from factual knowledge, memorization, linguistic fluency, pattern matching, and test familiarity. [Reasoning as a capability]({{< ref "ai/capabilities/07-reasoning-as-a-capability" >}}) works through this case.

## Reading


Core path, from "what do we mean by LLM reasoning?" to a measurement and validation framework:

1. **Freiesleben (2026)**, construct validity for LLM benchmarks through nomological networks; covers content, convergent, discriminant, concurrent, and criterion validity. [PDF](/sources/c84d75800beb21af8a1cc54b8f79c168.bin), [arXiv:2603.15121](https://arxiv.org/abs/2603.15121)
2. **Bean et al. (NeurIPS 2025)**, *Measuring What Matters*: a review of 445 LLM benchmarks with eight recommendations. [PDF](/sources/015e29150096f262478300d13488bbc2.bin), [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2025/hash/1967e0fc3aa6cbbace562f5cb8e3954e-Abstract-Datasets_and_Benchmarks_Track.html)
3. **Zhou et al. (Nature 2026)**, *General scales*: 18 demand scales applied across 63 tasks and 15 LLMs, with benchmark sensitivity and specificity. The closest working example of independently defined demands. [PDF](/sources/76e02efd0fb2f02796388644a91327d0.bin), [doi:10.1038/s41586-026-10303-2](https://doi.org/10.1038/s41586-026-10303-2), [open access](https://pmc.ncbi.nlm.nih.gov/articles/PMC13043289/)
4. **Cronbach and Meehl (1955)**, *Construct Validity in Psychological Tests*, the origin of the nomological network.

Failure cases and critiques:

- **Chizhov et al. (2025)**, *What the HellaSwag?*: a common-sense benchmark that can be solved through cues. [PDF](/sources/0d0f57129a2ce4bb6104c39c80966d31.bin), [arXiv:2504.07825](https://arxiv.org/abs/2504.07825)
- **Reynolds (2026)**, projectibility: why the inferences from benchmark to claim do not compose. [PDF](/sources/f31a48720f6829630133d42608c798d0.bin), [arXiv:2607.26159](https://arxiv.org/abs/2607.26159)

Measurement practice from psychology and the organizational sciences:

- **Clark and Watson (2019)**, *Constructing Validity*: scale construction. [PDF](/sources/7fc85943e4bd06680a1aaf4f357404b6.bin), [doi:10.1037/pas0000626](https://doi.org/10.1037/pas0000626)
- **Lambert and Newman (2023)**, construct development in three steps: define, operationalize, validate. [PDF](/sources/49b689d6cd563df789695944f06ff04c.bin), [doi:10.1177/10944281221115374](https://doi.org/10.1177/10944281221115374)

Applied to LLMs:

- **Kearns (2025)**, quantifying construct validity in LLM evaluations. [PDF](/sources/b905bdbeb5794014d45a8888fc9b85bd.bin), [arXiv:2602.15532](https://arxiv.org/abs/2602.15532)
- **Cui et al. (2026)**, *Measuring the Unmeasurable*: latent cognitive capabilities of LLMs. [PDF](/sources/c0787e6b002b3193a564d0d985b75f62.bin)
- **Pita et al. (2026)**, *Correct codes for the wrong reasons?*: validating LLMs as measurement instruments for theoretical constructs. [PDF](/sources/e927379435f1073f97f490f01b8bffcf.bin), [arXiv:2606.28574](https://arxiv.org/abs/2606.28574)

## Library sources


- [Zhu et al. 2025](/sources/327b05c1d9406bc91c6b0344e7d4bbca.bin), *Establishing Best Practices for Building Rigorous Agentic Benchmarks* ([arXiv:2507.02825](https://arxiv.org/abs/2507.02825))
- [Wilhelm and Engle 2005](/sources/2375228c6a7957a1808fc25b83be9a33.bin), *Handbook of Understanding and Measuring Intelligence* -- on *Latent variables and the validity question*
- [Mahowald et al. 2024](/sources/d3e4e4f8abb1b5705082eb2c4c76ee17.bin), *Dissociating language and thought in large language models* ([doi:10.1016/j.tics.2024.01.011](https://doi.org/10.1016/j.tics.2024.01.011)) -- on *Building a construct of LLM reasoning*
- [Fried 2020](/sources/b3fc13357b44cb45b100a2468bd9f252.bin), *Theories and Models* ([doi:10.1080/1047840X.2020.1854011](https://doi.org/10.1080/1047840X.2020.1854011)) -- on *Latent variables and the validity question*

Further reading:

- [Chang et al. 2024](/sources/6fdbd2f1789fc60cbbeaff5f486ac4d4.bin), *A Survey on Evaluation of Large Language Models* ([doi:10.1145/3641289](https://doi.org/10.1145/3641289))
- [Fedorenko et al. 2024](/sources/b973412a112912a6d83e065823e98424.bin), *Language is primarily a tool for communication rather than thought* ([doi:10.1038/s41586-024-07522-w](https://doi.org/10.1038/s41586-024-07522-w))
- [Hanna et al. 2025](/sources/7d99051e9c9171b66ec427609a4106f6.bin), *Are formal and functional linguistic mechanisms dissociated in language models?* ([arXiv:2503.11302](https://arxiv.org/abs/2503.11302))
- [Trochim et al. 2016](/sources/95c4dfddb0a330d19ccec7a9579c993f.bin), *Research Methods: The Essential Knowledge Base*
- [Jaccard and Jacoby 2020](/sources/4e48dc173034e0f9c9293879dffd510d.bin), *Theory Construction and Model-Building Skills*
