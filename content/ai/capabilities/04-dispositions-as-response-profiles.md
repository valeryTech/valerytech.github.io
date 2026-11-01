---
draft: false
toc: true
title: "Dispositions as Response Profiles"
description: "A working account: a disposition ascription describes a chosen system's causal response profile across a declared family of scenarios, inferred from limited evidence. Its parts, closest relatives in the literature, and the decisions it still needs."
weight: "40"
linkTitle: "Response Profiles"
---

[What a disposition claim means]({{< ref "ai/capabilities/03-what-a-disposition-claim-means" >}}) ends with the question of who fixes the conditions and the manifestation. This note answers it by making those choices explicit parts of an inquiry. The result is a working account, not a finished theory.

## The account in one sentence


> For an inquiry \(q\), a disposition ascription describes a chosen target system \(S_q\) by a purpose-relevant feature of its causal response profile across a model-defined family of interventions and background conditions. The profile is inferred from actual evidence and remains uncertain. Context fixes the target, variables, scenarios, manifestation criteria, causal paths, measure, and threshold. Reality constrains which of these descriptions turn out to be adequate.

This is a **methodological and epistemological** account of disposition ascriptions. It does not commit to a metaphysics of dispositions.

Its parts come from different fields, each with a separate job:

| Part | Job |
| --- | --- |
| Semantics | what a disposition sentence means |
| Causal modeling | generating and relating scenarios |
| Philosophy of scientific representation | the investigator's choices |
| Epistemology | how evidence about the actual world supports claims about unobserved scenarios |
| Systems theory | why the bearer can be an object together with its environment |

## The picture: one actual state, many scenarios


Start from the actual situation \(w_0\) and build variations of it:

\[W = \{w_1, w_2, \ldots\}\]

For a glass:

| Scenario | Variation |
| --- | --- |
| \(w_1\) | ordinary strike, ordinary air, no protection |
| \(w_2\) | weak strike |
| \(w_3\) | strong strike |
| \(w_4\) | strike with packing |
| \(w_5\) | strike with some unusual intervention |
| \(w_6\) | different temperature |

"Fragile" then summarizes a pattern across this space. It is a **compressed description of a counterfactual response profile**.

The finks, masks, and mimics of the previous note stop being puzzles. Each becomes a coordinate of the scenario space: packing present or absent, Hater present or absent, a device that changes the internal state on touch. Different research questions select different regions. Behavior across ordinary environments and behavior across environments with arbitrary interventions need not give the same description, and there is no reason they should.

## Ten features

### 1. Anchored in an actual state


The inquiry starts from an actual system in an actual state, \(s_0\) at \(t_0\). The alternatives are built from \(s_0\); they are not free-floating possible worlds. "Possible realities" here means model scenarios, potential outcomes, or possible trajectories. Whole possible worlds contain far more than the inquiry needs and raise the unsolved problem of how to count them.

### 2. Relative to a question


A disposition description is relative to a question \(q\), which fixes:

- the target part of reality;
- the spatial and temporal scale;
- the variables represented;
- the outcomes that matter;
- the admissible changes;
- the facts held fixed.

The full form is \(D(S; q)\), not \(D(S)\). Ordinary language leaves \(q\) implicit. Scientific work should state it. This matches Aimar's contextually selected modal base. ([Aimar 2019](/sources/666e59fd95c8b7ae1add31356724b4ff.bin), [doi:10.1007/s11098-018-1084-9](https://doi.org/10.1007/s11098-018-1084-9))

### 3. A chosen system boundary


The target need not be an isolated object:

\[S = O + E + R\]

where \(O\) is the focal object, \(E\) the relevant environment, and \(R\) the relations and interactions between them. Visibility, vulnerability, weight, and a key's ability to open a particular door already need this; the SEP uses them as challenges to the view that every disposition is intrinsic.

The boundary is part of the model specification. In the fink case, one inquiry may be about the wire's material state and another about the wire-and-device assembly. These are different target systems. The natural reaction to the fink example, "you changed the system", is exactly a claim about the boundary. Standard examples say "the glass" or "the wire" and treat the environment as a complication. Here, choosing what counts as the system is part of defining the disposition.

### 4. A family of controlled scenarios


\[\Omega_q = \{\omega_1, \omega_2, \ldots\}\]

Each scenario specifies an intervention, background conditions, environmental values, an initial state, and the resulting trajectory. Manley and Wasserman's *C-cases* are the direct predecessor: fully specified scenarios in which the stimulus occurs, with the disposition judged by behavior across a suitable proportion of them. Not every logically possible scenario is equally relevant. Admissibility is constrained by the question, physical theory, the causal model, and the evidence.

### 5. Explicit variation and invariance


Every scenario family says what varies and what stays fixed. For a glass:

- **Vary:** impact magnitude, direction, temperature.
- **Fix:** glass composition and geometry.
- **Exclude:** interventions that first turn the glass into another material.

Whether a fink belongs inside the system, in the environment, or outside the scenario class becomes a stated choice with a justification that can be examined, not an intuition.

### 6. A response profile, not one conditional


A disposition is not represented by one conditional \(C \mathbin{\square\mkern-7mu\rightarrow} M\), but by a profile:

\[\Pi_q(S) = \left\{ P\bigl(Y \mid \operatorname{do}(i), b, M_q\bigr) : i \in I_q,\ b \in B_q \right\}\]

where \(I_q\) is the set of interventions, \(B_q\) the permitted background conditions, \(M_q\) the causal or dynamical model, and \(Y\) the outcome. A disposition word compresses some feature of the profile:

\[D_q(S) \iff \Phi_{D,q}\bigl(\Pi_q(S)\bigr) \geq \tau_q\]

\(\Phi\) might measure probability, sensitivity, ease, speed, robustness, or required force. The threshold \(\tau_q\) says how strong the response must be for the word to apply.

In the notation of the other notes, \(\Pi_q(S)\) is the function \(p(v \mid \pi, \theta)\) of [05]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) together with the declared range of \(\pi\) it covers: \(Y\) is \(v\), the pair \((i, b)\) is \(\pi\), and holding \(S\) fixed is holding \(\theta\) fixed. See the notation map in [the inference ladder]({{< ref "ai/capabilities/00-the-inference-ladder" >}}).

### 7. Sensitive to the causal path


The profile has to include how the outcome comes about. For material fragility the manifestation is breaking through structural failure caused by the impact. The Hater case reaches the same end state by another path (strike, sound, person intervenes), so a path-sensitive profile does not count it. This matches Aimar's fine-grained manifestations and the causal-modeling distinction between direct, mediated, and path-specific effects.

### 8. Uncertain


Only one actual history occurs. Most of the profile is inferred from experiments, observations, background theory, simulation, and causal assumptions. Pearl's framework separates observational, interventional, and counterfactual questions, and stresses that causal conclusions need assumptions about the data-generating process ([Pearl 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC2836213/)). Rubin's potential outcomes make the same point: a causal effect compares outcomes of the same unit under different treatments, but only one is ever observed.

So the account distinguishes two sets:

- \(\Omega_q\): alternative scenarios *within* a model, representing possible system behavior;
- \(\mathcal{M}_q\): alternative *models* compatible with the evidence, representing our uncertainty about that behavior.

### 9. Context-dependent, under objective constraint


The investigator chooses the question, boundary, variables, resolution, and scenario distribution. Reality decides which models predict well and survive intervention. The description depends on the inquiry; the model's success depends on the target system. This is a limited perspectivism, close to Giere on models as representations of selected aspects of targets ([Giere](https://www.researchgate.net/publication/216300663_How_Models_Are_Used_to_Represent_Reality)), Parker's adequacy for purpose, and Potochnik on idealization for particular aims.

### 10. Metaphysically restrained


The account only needs to say:

> Reality constrains a system's possible responses, and disposition terms describe selected features of those constraints.

It does not need to say that every disposition term names an extra intrinsic entity or fundamental power. Three options stay open:

1. **Deflationary.** Dispositions are only useful modal descriptions (close to Ryle's inference tickets).
2. **Structural realism.** The response structure is real; our disposition categories depend on the inquiry.
3. **Powers realism.** The profile is grounded in genuine dispositional properties.

These notes lean toward the second.

## Closest existing work


No single author states the whole package. The pieces exist:

| Author or approach | Overlap | Difference |
| --- | --- | --- |
| Gebharter and Fischer | Dispositions as generic causal structures in causal Bayes nets; intervening on the stimulus raises the probability of the manifestation; handles finks, masks, mimics. ([Synthese](https://link.springer.com/article/10.1007/s11229-019-02374-8)) | Aims at truth conditions; does not treat boundary, purpose, and model choice as basic. |
| Toby Friend | Structural-equation analysis for masks, mimics, multi-track dispositions, and degrees; the closest technical match. ([Refubium](https://refubium.fu-berlin.de/handle/fub188/43110)) | Still an analysis of dispositions, not of an inquiry-defined system. |
| Manley and Wasserman | Behavior over many fully specified C-cases; dispositions graded by proportion. ([Mind](https://academic.oup.com/mind/article-pdf/117/465/59/4044452/fzn003.pdf)) | Needs a way to define and weight proportions; no epistemology of how cases are built from evidence. |
| Aimar | Context selects the modal base; fine-grained manifestations. ([PDF](/sources/666e59fd95c8b7ae1add31356724b4ff.bin), [doi:10.1007/s11098-018-1084-9](https://doi.org/10.1007/s11098-018-1084-9)) | Existential semantics: one relevant world may be enough. The profile here is graded. |
| Nancy Cartwright | Capacities operate in concrete arrangements; "nomological machines" produce regular behavior. ([OUP](https://academic.oup.com/book/27760/chapter/197990571)) | Realist about capacities; this account stays neutral. |
| Woodward and Pearl | Interventionist and structural-causal machinery for controlled alternatives and causal paths. ([PhilPapers](https://philpapers.org/rec/WOOEIA)) | Theories of causation, not of disposition terms. |
| Jan C. Willems | Behavioral systems theory: a system is the set of trajectories its laws allow; open systems through interconnection. ([IEEE](https://ieeexplore.ieee.org/document/4384643/), [arXiv](https://arxiv.org/pdf/1911.10398)) | Mathematical systems theory, not a theory of ascriptions. |
| Giere, Parker, Potochnik | Representations select targets, aspects, purposes, and simplifications. | About scientific representation in general. |
| Gibson, Chemero | Affordances as relations between an organism's abilities and its environment. ([Chemero 2003](https://www.tandfonline.com/doi/abs/10.1207/S15326969ECO1502_5)) | Specific to perception and action. |

Willems is the strongest scientific analogue. His idea, a system as the set of trajectories its laws allow, without fixing in advance which variables are inputs and outputs, is close to:

> a dispositional description is a selected feature of a system's admissible trajectories.

This account adds three things Willems does not: a research purpose, a causal and counterfactual reading, and an epistemic justification.

## Decisions still open


**What measure over scenarios?** "Most scenarios" means nothing until a measure \(\mu_q\) is given. It could be physical chance, frequency in a reference population, the distribution of interventions in an experimental design, expected operating conditions, or an investigator's credence. These answer different questions and are not interchangeable. A causal model with a probability measure is cleaner than counting worlds, and Aimar names the counting problem for proportional accounts.

**What makes a scenario admissible?** Without independent rules, one can choose scenarios that force any conclusion: the empty *ceteris paribus* problem again. Admissibility should come from the causal model, physical constraints, research design, and declared purpose, decided before the results.

**What persists across scenarios?** The target has to count as the same system across alternatives: same material, organization, causal structure, functional role, or designated state variables. Attaching a fink may preserve the wire and change the operational system. The answer depends on the declared target.

**Properties or descriptions?** A moderate answer: the disposition *category* is an inquiry-relative description; the causal constraints the profile represents are mind-independent. That gives objectivity without primitive powers.

## For LLM systems


Each feature has a direct counterpart in AI evaluation:

| Feature | In an LLM evaluation |
| --- | --- |
| Question \(q\) | What decision the evaluation informs: deployment, comparison, a safety threshold. |
| System boundary | Base model; model with system prompt, sampling settings, and filters; model with tools and retrieval; the full product. Voudouris et al. treat choosing among these as the first step of measurement ([§5.1](/sources/a7b1db57e43f6200e8de28a3f4e6e12d.bin), [arXiv:2603.00063](https://arxiv.org/abs/2603.00063)). |
| Scenario family | Task items placed along declared demand dimensions. |
| Variation and invariance | Which task properties are varied, which held fixed, which excluded. |
| Response profile | \(P(\text{correct} \mid \text{demands})\) for a capability, \(P(\text{behavior} \mid \text{incentives})\) for a propensity. |
| Causal path | Whether a correct answer came through the intended process or through recall or cues. |
| Uncertainty | Sampling noise, item effects, and competing models of what drives difficulty. |

[Measuring dispositions]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) takes this into measurement practice.

## Library sources


- [Ryle 1949](/sources/e858a20fa17c7e6da53dd7da8794c973.bin), *The Concept of Mind*
