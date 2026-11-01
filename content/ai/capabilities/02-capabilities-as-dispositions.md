---
draft: false
toc: true
title: "Capabilities as Dispositions"
description: "A capability is a disposition: a property defined by what a system would do under conditions that may never occur. The shift from actual behavior to possible behavior, and from a score to a response profile."
weight: "20"
linkTitle: "Dispositions"
---

The first answer to [what a capability claim says]({{< ref "ai/capabilities/01-what-is-a-capability-claim" >}}) is to name the kind of property involved. Voudouris et al. propose that capabilities and propensities are **dispositions**. ([Voudouris et al. 2026](/sources/a7b1db57e43f6200e8de28a3f4e6e12d.bin), [arXiv:2603.00063](https://arxiv.org/abs/2603.00063), §2)

## Terms


- **Disposition.** A property defined by what its bearer would do in certain conditions. Fragility, solubility, and conductivity are standard examples.
- **Manifestation.** The behavior the disposition is a disposition *to*: breaking, dissolving.
- **Stimulus or condition.** The circumstances in which the manifestation would occur: being struck, being placed in water.
- **Ascription.** The act of attributing something to something. A *disposition ascription* is a statement that attributes a disposition: "this glass is fragile", "this model is good at arithmetic".
- **Categorical property.** A property that is present and observable now, such as shape or color.

The standard philosophical reference is the [Stanford Encyclopedia of Philosophy entry on dispositions](https://plato.stanford.edu/archives/spr2022/entries/dispositions/) (Spring 2022 edition).

## Fragility and mathematical capability


A wine glass is fragile even while it sits on a shelf. It is fragile because, if it were struck hard enough, it would break, with high probability. We can see that an apple is red. We cannot see fragility in the same way. We consider what would happen under conditions that may never occur.

Capabilities have the same structure. A system has high mathematical capability because, if it were given difficult mathematical questions, it would answer correctly with high probability, and that probability depends systematically on measurable properties of the questions.

Voudouris et al. split AI dispositions into two kinds:

| Kind | Varies with | Example |
| --- | --- | --- |
| **Capability** | the demands or difficulty of the task | arithmetic accuracy as the number of steps grows |
| **Propensity** | incentive-relevant features of the situation | giving unsafe instructions as the user's justification or the absence of oversight changes |

A low propensity to give bomb-making instructions means that, in contexts with strong incentives to do so, the system would do it with low probability. In both cases the claim is about a potential that may never be fully realized.

## Four shifts in what we describe


Calling a capability a disposition changes what kind of description we are giving. It helps to separate the shifts.

### 1. From actuality to potentiality


A glass can be able to break without breaking. A system can have a capability without exercising it. This is Aristotle's distinction between *dunamis* (capacity) and *energeia* (actualization). In current philosophy it appears as the distinction between a **disposition** and its **manifestation**.

### 2. From what happens to what would happen


\[\text{what happens} \;\longrightarrow\; \text{what would happen}\]

"Fragile" does not summarize breaking events that occurred. It makes a claim about possible circumstances. The simplest form is a conditional, \(C \Rightarrow M\). A more realistic form is a probability, \(P(M \mid C)\). Counterfactual conditionals are the usual philosophical tool for this ([SEP: Counterfactuals](https://plato.stanford.edu/entries/counterfactuals/)).

This \(P(M \mid C)\) is the object that [05]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) writes as \(p(v \mid \pi, \theta)\) and [06]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}) as \(f_S(\pi)\): the manifestation is \(v\), the conditions are \(\pi\). [The inference ladder]({{< ref "ai/capabilities/00-the-inference-ladder" >}}) maps all four notations.

### 3. From a value to a relation


Instead of giving a system a bare number,

\[\text{capability} = 0.83,\]

we describe it relative to conditions:

\[P(\text{success} \mid \text{task properties}).\]

The object of interest changes from a scalar to a **response profile**:

| Disposition | Profile |
| --- | --- |
| Fragility | \(\text{force} \mapsto P(\text{break})\) |
| Mathematical capability | \(\text{difficulty} \mapsto P(\text{correct})\) |
| Propensity for unsafe behavior | \(\text{incentive, context} \mapsto P(\text{unsafe behavior})\) |

### 4. From extensional to modal description


An extensional description says what happened:

> The model answered 78 of 100 questions correctly.

A modal description is about behavior across possible situations:

> As mathematical demand increases, the probability of a correct answer follows this curve.

A benchmark gives the first. A capability claim needs the second.

Taken together, a disposition is characterized by the role it plays under specified conditions (stimulus or context leads to manifestation). This is a **functional characterization**, the same pattern used in functionalism in philosophy of mind and in causal modeling.

## What the shift is not


It is tempting to call this *abstraction* or *reification*. Neither fits well. Reification suggests turning an abstraction into a thing. The dispositional view says something different: the disposition is a property of the system, and each observed behavior is one manifestation of it. The core move is the **separation of disposition from manifestation**, or more generally, of potentiality from actuality.

## What follows


If capabilities are dispositions, then evaluation has to infer something about unobserved situations from observed ones. Two questions follow:

- What exactly does a disposition claim say: which situations count, and what counts as the manifestation? See [what a disposition claim means]({{< ref "ai/capabilities/03-what-a-disposition-claim-means" >}}).
- How can that kind of claim be measured? See [measuring dispositions]({{< ref "ai/capabilities/05-measuring-dispositions" >}}).

## Library sources


- [Aimar 2019](/sources/666e59fd95c8b7ae1add31356724b4ff.bin), *Disposition ascriptions* ([doi:10.1007/s11098-018-1084-9](https://doi.org/10.1007/s11098-018-1084-9))
- [Millière 2024](/sources/e6f31e3cf83a46a20b3d2c39a8f61808.bin), *Language Models as Models of Language* ([arXiv:2408.07144](https://arxiv.org/abs/2408.07144))
- [Chomsky 1965](/sources/571ccebf26f88d5a26a69181a10ef638.bin), *Aspects of the Theory of Syntax*
