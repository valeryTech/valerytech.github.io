---
draft: false
toc: true
title: "The Inference Ladder"
description: "The section on one page: a capability is never observed, a score only indicates it, and between the two lies a ladder of inferences, each with its own way to fail. With a glossary across philosophy, psychometrics, and AI evaluation."
linkTitle: "Inference Ladder"
---

A capability is a hidden property. Nobody has seen one. What anyone has seen is a model producing an output on an item, under one configuration, in one run. Everything said about the model beyond that, from "scored 78%" to "can reason", is inferred.

The rest of this section works through those inferences one field at a time: philosophy of dispositions, measurement theory, construct validity, cognitive psychology. This note puts them on one ladder so that the five lists in the later notes read as what they are, the same list seen from five sides.

## The ladder


Only the bottom rung is observed. Each step up adds an assumption, and each assumption has a characteristic way of being wrong.

| Rung | What is claimed | What has to be assumed to get here | How it fails | Where this is treated |
| --- | --- | --- | --- | --- |
| 1. **Behavior** | On this item, under this configuration, in this run, the model produced this output. | Nothing. This is the observation. | Only by misrecording. | -- |
| 2. **Score** | The output was correct, or the behavior occurred. Over the item set, this proportion. | The scoring rule tracks what we care about. The items are what they are described as. | The item can be solved from cues, memorized answers, or format artifacts: the right output by the wrong route. | [01]({{< ref "ai/capabilities/01-what-is-a-capability-claim" >}}), mimics in [03]({{< ref "ai/capabilities/03-what-a-disposition-claim-means" >}}) |
| 3. **System boundary** | The score belongs to *this* system. | We have said which system: base model, model with prompt and filters, model with tools, the whole product. | A refusal layer, a prompt format, or a token limit blocks what the base model would do. A product's score is attributed to the model, or the model's to the product. | masks in [03]({{< ref "ai/capabilities/03-what-a-disposition-claim-means" >}}), boundary in [04]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}}), step 1 of [05]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) |
| 4. **Response profile** | Success changes in this way as declared properties of the task change. | The properties that drive difficulty have been named and measured independently of the model's performance. Enough repetition to separate the trend from noise. | A benchmark average collapses different demands into one number. "Difficulty" is defined from what the model failed, so the measurement is circular. One sample per item. | [02]({{< ref "ai/capabilities/02-capabilities-as-dispositions" >}}), [04]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}}), [05]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) |
| 5. **Disposition claim** | The system *would* behave this way across a range of situations, including ones not tested. | The range is stated: what varies, what is held fixed, what is excluded, and how situations are weighted. | The conditions stay implicit and differ between speakers. "Under conditions where it works" makes the claim empty. The system behaves differently because it detects the test. | [03]({{< ref "ai/capabilities/03-what-a-disposition-claim-means" >}}), [04]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}}) |
| 6. **Construct label** | This regularity is *reasoning*, or *planning*. | The label has a theory: which task families it covers, which neighboring constructs it relates to, which it must be separable from. | The regularity is renamed, not explained. It is not separable from knowledge, fluency, or test familiarity. The task families cover a corner of the construct. | [06]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}), [07]({{< ref "ai/capabilities/07-reasoning-as-a-capability" >}}) |
| 7. **Transported claim** | The capability will show up on other tasks, in other deployments, for downstream users. | The relation generalizes to new items, extrapolates to new ranges, and transports to other settings. | Each of these is a separate inference and evidence for one does not carry to the next. | projectibility in [01]({{< ref "ai/capabilities/01-what-is-a-capability-claim" >}}), criterion validity in [06]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}) |

Two things follow.

**A benchmark reports rung 2. A capability lives at rungs 5 and 6.** When a model card says "state-of-the-art reasoning" next to a benchmark number, the number is rung 2 and the sentence is rung 6, and the rungs between are left to the reader. The usual mistake is not that people lie about the number. It is that they read the number as the property, and nothing in the report shows them the ladder in between.

**The failures on rungs 2 to 5 are the counterexamples from the philosophy of dispositions.** Cues and memorization are mimics. Filters and formats are masks. Test awareness is a fink. Implicit conditions are the problem of the speaker's context. The philosophers found these cases by thinking about glasses and wires. AI evaluation rediscovers them one benchmark at a time. [03]({{< ref "ai/capabilities/03-what-a-disposition-claim-means" >}}) has the originals.

## Why the vocabulary comes from three fields


Psychometrics got to this ladder first. A century of trying to measure intelligence, anxiety, and reading ability produced a name for each rung and for each failure, because each failure happened. Cronbach and Meehl's nomological network, which [06]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}) applies to LLM benchmarks, was a 1955 answer to the question of what licenses rung 6. The philosophy of dispositions produced a second vocabulary for rungs 3 to 5 by asking what "fragile" means. AI evaluation is now producing a third vocabulary for the same things.

The table maps them. A row is one concept in three languages, with the symbol these notes use for it in the last column.

| Concept | Philosophy of dispositions | Psychometrics | AI evaluation | In these notes |
| --- | --- | --- | --- | --- |
| The hidden property | disposition | construct, latent trait | capability, propensity | \(D_q(S)\) |
| Its bearer | the object: glass, wire | the person, the test-taker | the system: model, configured model, product | \(S\) |
| What is observed | manifestation | indicator, item response | output, item score | \(v\) |
| What brings it out | stimulus, conditions \(C\) | item, administration condition | prompt, task item | one point of \(\pi\) |
| What is varied to see the property | strength of the stimulus | item difficulty, test form | task demands, incentives | \(\pi\) |
| What is left unsaid | conventional vs. canonical disposition, *ceteris paribus* | standardization, testing conditions | sampling settings, system prompt, tools, scaffolding | \(B_q\), the background conditions |
| Blocked by circumstances | mask | construct-irrelevant variance, situational factors | refusal layer, prompt format, token limit | a mask: the system boundary moved |
| Right output by the wrong route | mimic | criterion contamination, guessing, test-wiseness | dataset cue, memorization, contamination | wrong causal path to \(v\) |
| Probing changes the property | fink | reactivity, demand characteristics | evaluation awareness, test detection | a fink: the intervention changes \(S\) |
| How the property is summarized | degree, threshold | scale score, cut score | accuracy, pass@k, threshold depth | \(\Phi\), \(\tau\) |
| The relation itself | the counterfactual, \(P(M \mid C)\) | item response function, test characteristic curve | demand-response curve | \(p(v \mid \pi, \theta)\), \(f_S(\pi)\) |
| Whether the measure captures the property | -- | validity: content, convergent, discriminant, criterion | construct validity of benchmarks | §validity in [06]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}) |
| What fixes the label's meaning | -- | nomological network | task families and neighboring constructs | \(T_C\), \(N_C\) |
| Stability of the measurement | -- | reliability | run-to-run variance, seed sensitivity | the \(\mathcal{M}_q\) of [04]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}}) |

Empty cells are not oversights. Philosophy had no reason to ask about reliability or validity, because it was analyzing a word rather than building an instrument. Psychometrics and AI evaluation are building instruments.

Two words collide across the columns. *Disposition* is the philosophers' general term, Voudouris et al.'s term for capabilities and propensities together, and the psychologists' word for a thinking tendency such as actively open-minded thinking. [07]({{< ref "ai/capabilities/07-reasoning-as-a-capability" >}}) flags the third use where it appears. *Difficulty* is a property of the item in psychometrics but, in the data-driven item response models that [05]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) criticizes, is inferred from failure rates, which is what makes rung 4 circular.

## One object, four notations


The notes write the response profile in four ways, because each source writes it differently. They are the same object at different resolutions.

| Note | Notation | Reads as |
| --- | --- | --- |
| [02]({{< ref "ai/capabilities/02-capabilities-as-dispositions" >}}) | \(P(M \mid C)\) | probability of the manifestation given the conditions; the philosophers' conditional made probabilistic |
| [04]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}}) | \(\Pi_q(S) = \{P(Y \mid \operatorname{do}(i), b, M_q)\}\), with \(\Phi\) and \(\tau\) | the full profile for inquiry \(q\): outcome \(Y\) under intervention \(i\) and background \(b\) in model \(M_q\); a summary feature of it; the threshold for the word to apply |
| [05]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) | \(p(v \mid \pi, \theta)\) | behavior \(v\) given context properties \(\pi\) and latent system properties \(\theta\); Voudouris et al.'s notation |
| [06]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}) | \(f_S(\pi)\), \(F_{C,S}\) | one demand-response function for system \(S\); the set of them across the task families of construct \(C\) |

The correspondences: \(v\), \(M\), and \(Y\) are the observed behavior. \(C\) and \(\pi\) are the conditions, which 04 splits into the intervention \(i\) and the background \(b\). Holding \(S\) fixed is the same as holding \(\theta\) fixed. \(f_S(\pi)\) is \(p(v \mid \pi, \theta)\) written as a function of \(\pi\) alone, and \(\Pi_q(S)\) is that function together with the declared range of \(\pi\) it is defined over.

## Reading on


[01]({{< ref "ai/capabilities/01-what-is-a-capability-claim" >}}) starts the section at the bottom of the ladder, with the words themselves.

## Library sources


- [Chizhov et al. 2025](/sources/ai-foundations/capabilities-and-measurement/chizhov-2025-what-the-hellaswag.pdf.enc), *What the HellaSwag? On the Validity of Common-Sense Reasoning Benchmarks* ([arXiv:2504.07825](https://arxiv.org/abs/2504.07825))
- [Freiesleben 2026](/sources/ai-foundations/capabilities-and-measurement/freiesleben-2026-nomological-networks.pdf.enc), *Establishing Construct Validity in LLM Capability Benchmarks Requires Nomological Networks* ([arXiv:2603.15121](https://arxiv.org/abs/2603.15121))
- [Reynolds 2026](/sources/ai-foundations/capabilities-and-measurement/reynolds-2026-projectibility.pdf.enc), *When benchmark inferences do not compose* ([arXiv:2607.26159](https://arxiv.org/abs/2607.26159))
- [Gemini Team 2023](/sources/llms/models-and-training/gemini-team-2023-gemini-family-of-multimodal-models.pdf.enc), *Gemini: A Family of Highly Capable Multimodal Models* ([arXiv:2312.11805](https://arxiv.org/abs/2312.11805)) -- on *The ladder*

Further reading:

- [Clark and Watson 2019](/sources/ai-foundations/capabilities-and-measurement/clark-2019-constructing-validity.pdf.enc), *Constructing Validity* ([doi:10.1037/pas0000626](https://doi.org/10.1037/pas0000626))
- [Wilhelm and Engle 2005](/sources/ai-foundations/intelligence-and-turing/wilhelm-2005-handbook-of-understanding-and-measuring-intelligence.pdf.enc), *Handbook of Understanding and Measuring Intelligence*
