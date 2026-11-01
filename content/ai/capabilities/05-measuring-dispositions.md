---
draft: false
toc: true
title: "Measuring Dispositions"
description: "Why measure a capability at all, what a disposition-respecting measurement looks like (vary context, hold the system fixed, recover p(v | π, θ)), and how hypotheses connect theoretical concepts to variables."
linkTitle: "Measuring Dispositions"
---

If a capability is a [response profile]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}}) across declared scenarios, measuring it means recovering that profile from a limited set of observations. This note sets out the method, mostly following Voudouris et al. ([PDF](/sources/ai-foundations/capabilities-and-measurement/voudouris-2026-measuring-what-ai-might-do.pdf.enc), [arXiv:2603.00063](https://arxiv.org/abs/2603.00063), §2.2 and §5).

## Why measure at all


Before asking how to measure a disposition, ask what the measurement is for.

The aim is not to recover the internal mechanism. Voudouris et al. say explicitly that dispositional measurement can give explanatory and predictive power without mechanistic interpretability. What it requires is evidence of a causal relation between properties of the context and behavior.

The purpose of measurement is to build a representation of the system that answers questions about cases we have not observed:

> What will this model do when the task is more complex than anything in the benchmark?

> How will its behavior change if the incentive to deceive increases?

A benchmark score cannot answer these. It describes the sampled items. The measurement has to support inference over a larger space of contexts.

## The measurement target


Hold the system fixed and vary the contextual properties hypothesized to cause the behavior of interest. Because the relations are probabilistic, the target is a conditional probability:

\[p(v \mid \pi, \theta)\]

- \(v\): the target behavior (a correct answer, a disallowed response);
- \(\pi\): properties of the context (task demands for a capability, incentives for a propensity);
- \(\theta\): latent properties of the system that interact with \(\pi\).

The curve or surface \(\hat p(v \mid \pi, \theta)\) is the **empirical signature** of the disposition. It shows thresholds, monotone trends, plateaus, and interactions, and it supports extrapolation beyond the tested range. For physical dispositions \(\pi\) is well understood: fragility depends mainly on impact force; solubility on temperature, exposure time, and surface area. For AI systems, finding \(\pi\) is part of the research.

This is Voudouris et al.'s notation. [02]({{< ref "ai/capabilities/02-capabilities-as-dispositions" >}}) writes the same object as \(P(M \mid C)\), [04]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}}) as the profile \(\Pi_q(S)\), and [06]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}) as \(f_S(\pi)\). The map is in [the inference ladder]({{< ref "ai/capabilities/00-the-inference-ladder" >}}).

## Four steps


| Step | What it requires |
| --- | --- |
| 1. **Define the subject** | Say which system is measured: base model, deployed model with prompts and filters, model with tools, full product. Each has different dispositions. |
| 2. **Hypothesize the causal basis** | Say which properties of the context are expected to drive the behavior. For capabilities: symbolic complexity, number of transformations, novelty, reasoning depth. For propensities: rewards, user identity, oversight cues, role framing, moral justification. |
| 3. **Operationalize the contextual properties** | Turn them into variables on a scale, **defined before testing and independently of the system's performance**. Otherwise "difficulty" becomes whatever the system fails at, and the measurement is circular. |
| 4. **Map context to probability** | Vary \(\pi\) densely and in a controlled way, repeat to handle stochasticity, isolate irrelevant variation, and estimate \(\hat p(v \mid \pi, \theta)\) with anything from binomial regression to hierarchical Bayesian models. |

First hypotheses will be partial or wrong. Early thermometry rested on a wrong theory of heat and still made progress, because its assumptions were explicit and could be revised.

### Example: arithmetic capability


- \(v\): a correct final answer to a multi-step arithmetic problem.
- \(\pi\): number of steps, digit length of operands, complexity of carries, all fixed from the problem itself.
- Measurement: vary these, hold the model fixed, estimate how \(P(\text{correct})\) changes.
- Result: not one accuracy number, but the response function itself, or an indicator derived from it, such as the largest number of steps at which success stays high.

For a propensity, the structure is the same, but \(\pi\) spans justification, apparent urgency, and oversight signals, and the curve need not be monotone.

### What this replaces


- **Benchmarks** collapse different demands into one aggregate and hide which property drives failure.
- **Data-driven item response theory** infers item difficulty from failure rates rather than from independently described task features, so it cannot tell apart items that are hard for different reasons.
- **Red-teaming** samples a small, human-chosen region of the context space and yields anecdotes of failure, not measurements of inclination.

## From question to measurement


The paper starts from measurement. It helps to start one level earlier. The conceptual order is:

1. **Purpose.** Why do we need knowledge of this system?
2. **Target phenomenon.** What behavior do we want to explain, predict, compare, or control?
3. **Ontology.** What kinds of properties are in the account: system properties \(\theta\), contextual properties \(\pi\) (task demands, incentives), behavior \(v\), dispositions.
4. **Theory.** How these properties might be related.
5. **Hypotheses.** Concrete, falsifiable claims about specific relations.
6. **Operationalization.** How theoretical properties become measurable variables.
7. **Experimental variation.** Vary those variables while controlling the others.
8. **Measurement model.** Estimate \(p(v \mid \pi, \theta)\).
9. **Validation.** Does the relation behave as the theory predicts, generalize, and separate the intended property from alternatives? See [capability constructs and validity]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}).
10. **Use.** Prediction, explanation, comparison, extrapolation, safety decisions.

The distinction between capabilities and propensities already comes from step 3: it is a split within \(\pi\) between task demands and incentives.

### Hypotheses as bridges


A hypothesis carries a theoretical concept over to a variable that can be manipulated.

> Reasoning complexity influences mathematical capability.

is still vague.

> **H₁:** The probability of a correct answer decreases as the required transformation depth increases.

now connects "reasoning complexity" to something measurable. The hypothesis says what to vary, what to hold fixed, what to observe, what relation to expect, and what result would refute it.

## Three levels of understanding


| Level | Example |
| --- | --- |
| Descriptive | Performance falls as tasks get harder. |
| Causal | Increasing symbolic depth lowers the probability of a correct answer. |
| Mechanistic | Symbolic depth causes failure because particular internal representations cannot hold intermediate states. |

Dispositional measurement aims at the **causal** level. Benchmarks mostly stay descriptive. The mechanistic level is not required.

So a disposition is not necessarily an explanation of *why, internally,* a system behaves as it does. It is a stable causal regularity that supports counterfactual predictions:

> If the context changed from \(\pi_1\) to \(\pi_2\), behavior would change in this way.

That is already useful, because it lets us reason about contexts we have not tested.

## Questions this leaves open


- Is "disposition" the right category for everything we call a capability?
- Do capabilities and propensities exhaust the kinds of properties that matter?
- A response function says that performance falls with depth. It does not say why that regularity should be called *reasoning*, whether it holds across different reasoning tasks, or how it differs from memory or knowledge. That is the job of construct theory: [capability constructs and validity]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}).

## Library sources


- [Shojaee et al. 2025](/sources/ai-foundations/capabilities-and-measurement/shojaee-2025-illusion-of-thinking.pdf.enc), *The Illusion of Thinking*
- [Zhou et al. 2026](/sources/ai-foundations/capabilities-and-measurement/zhou-2026-general-scales.pdf.enc), *General scales unlock AI evaluation with explanatory and predictive power* ([doi:10.1038/s41586-026-10303-2](https://doi.org/10.1038/s41586-026-10303-2))
- [Jaccard and Jacoby 2020](/sources/research-methods/philosophy-of-science/jaccard-2020-theory-construction-and-model-building-skills.pdf.enc), *Theory Construction and Model-Building Skills* -- on *From question to measurement*

Further reading:

- [Liang et al. 2023](/sources/ai-engineering/evaluation/liang-2023-holistic-evaluation-of-language-models.pdf.enc), *Holistic Evaluation of Language Models (HELM)* ([arXiv:2211.09110](https://arxiv.org/abs/2211.09110))
- [Dellibarda Varela et al. 2025](/sources/ai-foundations/capabilities-and-measurement/dellibarda-varela-2025-rethinking-illusion-of-thinking.pdf.enc), *Rethinking the Illusion of Thinking* ([arXiv:2507.01231](https://arxiv.org/abs/2507.01231))
- [Kearns 2025](/sources/ai-foundations/capabilities-and-measurement/kearns-2025-quantifying-construct-validity.pdf.enc), *Quantifying construct validity in large language model evaluations* ([arXiv:2602.15532](https://arxiv.org/abs/2602.15532))
- [Lambert and Newman 2023](/sources/ai-foundations/capabilities-and-measurement/lambert-2023-construct-development-validation.pdf.enc), *Construct Development and Validation in Three Practical Steps* ([doi:10.1177/10944281221115374](https://doi.org/10.1177/10944281221115374))
- [Fried 2020](/sources/research-methods/philosophy-of-science/fried-2020-theories-and-models.pdf.enc), *Theories and Models* ([doi:10.1080/1047840X.2020.1854011](https://doi.org/10.1080/1047840X.2020.1854011))
- [Popper 1959](/sources/research-methods/philosophy-of-science/popper-1959-logic-of-scientific-discovery.pdf.enc), *The Logic of Scientific Discovery*
