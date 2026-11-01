---
draft: false
toc: true
title: "What a Disposition Claim Means"
description: "Why the simple counterfactual reading of 'x is disposed to M when C' fails, how the speaker's context fixes the conditions and the manifestation, and what this means for claims about LLM capabilities."
weight: "30"
linkTitle: "Disposition Claims"
---

[Capabilities as dispositions]({{< ref "ai/capabilities/02-capabilities-as-dispositions" >}}) says a capability claim is a claim about what a system would do. This note asks what such a claim says exactly. The philosophy of dispositions has worked on this for decades, and the results transfer to LLMs almost directly.

The main source is the [SEP entry on dispositions](https://plato.stanford.edu/archives/spr2022/entries/dispositions/), sections 1.1 to 1.5.

## The simple conditional analysis


The obvious reading is a counterfactual:

> **Simple Conditional Analysis (SCA).** An object is disposed to \(M\) when \(C\) if and only if it would \(M\) if \(C\) were the case.

Ryle, Goodman, and Quine held versions of it. ([Ryle 1949, *The Concept of Mind*](/sources/ai-foundations/cognition-and-mind/ryle-1949-concept-of-mind.pdf.enc))

## Three kinds of counterexample


| Case | Story | What goes wrong |
| --- | --- | --- |
| **Fink** (Martin) | A dead wire is connected to a device that makes it live whenever a conductor is about to touch it. | If touched, the wire would conduct, so SCA says it is live, but it is dead. The stimulus itself changes the disposition. |
| **Mask** (Johnston, Bird) | A fragile glass is wrapped in packing material. | If struck, it would not break, so SCA says it is not fragile, but it is. The disposition is still there; the process from strike to breaking is blocked. |
| **Mimic** (Lewis and others) | A styrofoam dish makes a sound when struck. The Hater of Styrofoam hears it and tears the dish apart. | If struck, the dish would break, so SCA says it is fragile, but it is not. The outcome happens by another route. |

These cases are not exotic. Valuable fragile objects are routinely packed (Fara).

## Conventional and canonical dispositions


Ordinary predicates such as *fragile*, *soluble*, and *poisonous* name no stimulus and no manifestation. These are **conventional** dispositions. A **canonical** disposition states them: "disposed to break when struck". Analysis usually goes in two steps: turn the conventional predicate into one or more canonical dispositions, then analyze those (Lewis 1997). Context already enters at the first step. "Poisonous" may mean poisonous when ingested by humans.

## The speaker's conditions


Introduce the person making the ascription. Anna says:

> This glass is fragile.

She probably means: if struck with an ordinary force, in ordinary circumstances, it would break. She does not mean: in absolutely any circumstances, if struck, it would break. If someone wraps the glass in foam, no problem with fragility has been found. We have moved outside the conditions Anna had in mind.

The same works for the mimic. What Anna would mean by "disposed to break when struck" is closer to:

\[\text{strike} \rightarrow \text{the dish's structure fails} \rightarrow \text{break}\]

The Hater case follows a different path:

\[\text{strike} \rightarrow \text{sound} \rightarrow \text{Hater tears the dish}\]

The end state is the same, but it is not the manifestation Anna was talking about.

The general move, which the SEP calls **the strategy of getting specific**:

\[\text{"}x\text{ is disposed to }M\text{ when }C\text{"} \quad\longrightarrow\quad \text{"}x\text{ is disposed to }M^*\text{ when }C^*\text{"}\]

- \(C^*\) adds background conditions: *struck under ordinary conditions, without a masker*.
- \(M^*\) says how the manifestation must come about: *breaks through the object's own physical response to the strike*.

Lewis takes this line. The manifestation of fragility is breaking by a "direct and standard process", and the stimulus can be *struck without protective packing*. Choi and Gundersen argue that the packed glass is simply not disposed to break when struck; it is disposed to break when struck without the packing.

## The limit: how much may go into \(C^*\)?


Getting specific can go too far. Suppose:

\[C^* = \text{struck in conditions where nothing prevents it from breaking}\]

Then the analysis says that the glass is fragile if, struck in conditions where it would break, it would break. That is empty. The counterexamples have been excluded by definition. The SEP raises the same worry about *ceteris paribus* clauses: if "normal conditions" means "unless something prevents the manifestation", the analysis is vacuous.

So the question underneath the counterexamples is not whether SCA survives them, but:

> **Who determines what counts as \(C\) and \(M\), and how precisely must they be specified?**

With a conventional word like *fragile* it is plausible that the speaker leaves many conditions implicit. With an explicit canonical phrase, the theorist has to explain why hidden conditions are allowed, and whether they belong to the meaning or are added afterwards to save the analysis.

## Where the literature puts context


| Where context does its work | Authors | Idea |
| --- | --- | --- |
| The speaker and the context of utterance | Fara, Choi, Aimar | Disposition sentences work like habituals ("John smokes"): they allow failures in interfering circumstances (Fara 2005). Context selects the relevant possibilities (Choi 2011, "Finkish Dispositions and Contextualism"). |
| Implicit qualifications of \(C\) and \(M\) | Lewis, Gundersen, Steinberg | Get specific about stimulus and manifestation. Steinberg 2010 adds an implicit *ceteris paribus*. J. and A. Steinberg 2017 place the ascription inside an implicit causal framework. |
| The degree or threshold | Manley and Wasserman, Vetter | Context sets what proportion of relevant cases is enough (Manley and Wasserman 2008), or how much potentiality counts as "fragile" (Vetter 2015). |

**Aimar** gives the cleanest semantic version. Context fixes the **modal base**: which possibilities are relevant and which features stay fixed across them. The manifestation may need a finer description, such as *breaking easily*. She separates two questions: what the sentence means, and what property, if any, makes it true. Separating them dissolves some counterexamples before the metaphysics comes in. ([Aimar 2019, "Disposition ascriptions"](/sources/ai-foundations/capabilities-and-measurement/aimar-2019-disposition-ascriptions.pdf.enc), [doi:10.1007/s11098-018-1084-9](https://doi.org/10.1007/s11098-018-1084-9))

**Ryle** goes further. Disposition sentences need not name a hidden property inside the object. They work like "inference tickets": they license predictions and explanations about what would happen in various circumstances. ([Ryle 1949](/sources/ai-foundations/cognition-and-mind/ryle-1949-concept-of-mind.pdf.enc), [SEP: Ryle](https://plato.stanford.edu/entries/ryle/))

For the line developed in these notes, the most useful next reading is Aimar, Choi, and Steinberg.

## The same structure in LLM capability claims


"The model can do multi-step arithmetic" has an implicit \(C\) and \(M\) too.

- **Implicit conditions.** Which prompt format, which sampling settings, with or without tools, with or without a system prompt. A different evaluator may have different conditions in mind.
- **Masks.** A filter or refusal layer can block a behavior the base model is capable of. Voudouris et al. use the glass in a protective box for exactly this case: the subject of measurement changed, not the disposition ([Voudouris et al. 2026](/sources/ai-foundations/capabilities-and-measurement/voudouris-2026-measuring-what-ai-might-do.pdf.enc), [arXiv:2603.00063](https://arxiv.org/abs/2603.00063), §5.1). A badly chosen prompt format can mask a capability the same way.
- **Mimics.** A correct answer can come from a memorized item or a dataset cue rather than from the process the capability names ([Chizhov et al. 2025](/sources/ai-foundations/capabilities-and-measurement/chizhov-2025-what-the-hellaswag.pdf.enc), [arXiv:2504.07825](https://arxiv.org/abs/2504.07825)). The output matches, the path does not. This is why \(M^*\) has to say how the answer is produced.
- **Finks**, by analogy: a system whose behavior changes because it detects that it is being tested would alter the disposition under the very conditions used to probe it.
- **Vacuity.** "The model can reason, under conditions where it reasons correctly" is the LLM version of the empty \(C^*\). Conditions have to be fixed before looking at results.

[Dispositions as response profiles]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}}) turns this into an explicit account: the speaker's implicit choices become declared parts of an inquiry.

## Reading on dispositions


From easiest to most demanding:

1. Toby Friend and Samuel Kimpton-Nye, *Dispositions and Powers* (Cambridge Elements, 2023). Short, current, open access. [Cambridge](https://www.cambridge.org/core/elements/dispositions-and-powers/B5E3BD78798365332743236ED9913C34)
2. Stephen Mumford, *Dispositions*. The full-length book closest to the SEP entry: conditional analyses, the dispositional/categorical distinction, dispositions as causes. [OUP](https://academic.oup.com/book/5754)
3. The [SEP entry](https://plato.stanford.edu/archives/spr2022/entries/dispositions/).
4. Neil E. Williams, *The Powers Metaphysic* (2019), which argues for a powers-based metaphysics. [OUP](https://academic.oup.com/book/35233). Alexander Bird, *Nature's Metaphysics*, a defense of dispositional essentialism. [OUP](https://academic.oup.com/book/8067)
5. Barbara Vetter, *Potentiality: From Dispositions to Modality*, dispositions as what an object *can* do. [OUP](https://academic.oup.com/book/26364). George Molnar, *Powers*. [OUP](https://academic.oup.com/book/1620)

## Library sources


- [Dellibarda Varela et al. 2025](/sources/ai-foundations/capabilities-and-measurement/dellibarda-varela-2025-rethinking-illusion-of-thinking.pdf.enc), *Rethinking the Illusion of Thinking* ([arXiv:2507.01231](https://arxiv.org/abs/2507.01231))
- [Lu et al. 2024](/sources/ai-foundations/capabilities-and-measurement/lu-2024-are-emergent-abilities-in-llms-just-icl.pdf.enc), *Are Emergent Abilities in Large Language Models just In-Context Learning?* ([arXiv:2309.01809](https://arxiv.org/abs/2309.01809))
