---
draft: false
toc: true
description: "A research-method proposal separating observations, construct inferences, mechanisms, generalizations, and forecasts, with claim/evidence records, competing hypotheses, interventions, replication, and explicit limits on LLM-generated authority."
title: "13 Research Method And Claim Validation"
linkTitle: "13 Research Method And Claim Validation"
---
# Research method and claim validation


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The retained reply proposes how to test concepts, distinguish types of claims, and use LLMs in research. The proposed methods and complete closing artifact plan remain source material, not an adopted research policy or a completed study. The sibling [comments]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation-comments" >}}) explain the grouping and evidence limits.

The reply begins with [research terms and levels of analysis]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}). [Provenance and argumentation]({{< ref "ai/design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations" >}}) concerns recording derivations and support relations, while the present proposal concerns whether evidence supports an interpretation. The existing [collaboration evaluation]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}) and [runtime evaluation]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) address more specific study questions.

## Research practices and claim records

### 3. Construct validity is directly applicable


There is already a scientific discipline around precisely this problem: **construct validity**.

A construct is something such as:

`trust`, `understanding`, `intelligence`, `reflection`, `autonomy`.

You cannot directly observe most of these. You observe measurements and behaviors and then infer the construct. Construct-validation work goes back at least to Cronbach and Meehl's classic 1955 treatment. ([Psych Classics](https://psychclassics.yorku.ca/Cronbach/construct.htm?utm_source=chatgpt.com "Classics in the History of Psychology -- Cronbach & Meehl (1955)"))

For AI research, the question becomes:

```text
observable behavior B
        ↓ ?
construct C
```


What evidence licenses the arrow?

For `understanding`, a single benchmark isn't enough.

Our dictionary suggests stronger consequences:

```text
representation survives intervention
representation supports prediction
counterfactual reasoning works
transfer survives surface changes
causal interaction grounds the representation
```


Then "understanding" becomes a research hypothesis with tests instead of praise attached to successful output.

The same applies to reflection. Producing:

> "I made this mistake because..."

is evidence that the model can produce a self-explanation.

It is not yet evidence of a persistent metacognitive process changing its own future cognition.

<a id="4-we-should-explicitly-distinguish-observation-from-interpretation"></a>

### 4. Distinguishing observation from interpretation


The proposal is to introduce a standard claim structure for our notes and eventually papers:

```text
OBSERVATION
What happened?

OPERATIONAL RESULT
What measured property changed?

CONSTRUCT INFERENCE
What latent property might explain it?

MECHANISM
What process caused it?

GENERALIZATION
Under what systems/conditions should it hold?

FORECAST
What should happen in the future?
```


An experiment might strongly support the first two and weakly support the remaining four.

Anthropic often has good evidence here:

```text
OBSERVATION
three scaffolded Claude instances repeatedly
interfered with one another on shared infrastructure
```


Then considerably more assumptions enter:

```text
INTERPRETATION
autonomous agents with conflicting goals
engaged in social conflict
```


And even more enter here:

```text
GENERALIZATION
future agent societies may require
norms/reputation/social pressure
```


Putting those statements in different columns makes the epistemic jump visible.

<a id="5-there-are-established-practices-we-can-borrow"></a>

### 5. Relevant established research practices


We don't need to invent scientific rigor from scratch. The proposal is to combine practices from several fields into one protocol:

1. **Scoping review before strong novelty claims.** Use an adapted PRISMA-ScR process: define search terms, databases, inclusion/exclusion rules, related traditions, and what was actually searched. Scoping reviews are specifically intended to map the extent of existing literature. ([PRISMA statement](https://www.prisma-statement.org/scoping?utm_source=chatgpt.com "Scoping -- PRISMA statement")) This would likely have caught much of the multi-agent institutions, social laws, mechanism design, CSCW, organizational science and distributed-systems prior art before making broad "emergent society" claims.
2. **Operational definitions and construct validation.** Every important theoretical term gets observable criteria, competing interpretations, and evidence that would weaken the interpretation.
3. **Pre-registration.** State hypotheses, measures, exclusions and analysis decisions before seeing the result. For important experiments, Registered Reports go further: peer review happens before results are known, which removes a large incentive to reinterpret the experiment around an exciting outcome. ([Center for Open Science](https://www.cos.io/initiatives/registered-reports?utm_source=chatgpt.com "Registered Reports"))
4. **Ablation and intervention.** If you say the "agent learned," vary memory persistence. If you say model intelligence caused coordination, hold the model fixed and change the scaffold; then hold the scaffold fixed and change models. If you say communication caused conformity, remove communication while preserving every other relevant variable.
5. **Competing hypotheses.** Before an experiment, write at least two plausible explanations. For Anthropic's "turf war," one might be psychological/social; another might be concurrent controllers with incompatible target states and overlapping write authority. Design an experiment that distinguishes them.
6. **Adversarial collaboration.** Researchers with competing theories agree on experiments in advance. This is an established practice, recently used even in the major IIT-versus-GNWT consciousness test. ([Nature](https://www.nature.com/articles/d41586-025-01379-3?utm_source=chatgpt.com "Make science more collegial: why the time for 'adversarial collaboration' has come | Nature")) It seems particularly suitable for AGI research because terminology and worldview differences are enormous.
7. **Independent/multiple analysis.** Give the same data and research question to independent analysts. Current large-scale work shows that reasonable analytical choices can materially alter results. ([Nature](https://www.nature.com/articles/s41586-025-09844-9?utm_source=chatgpt.com "Investigating the analytical robustness of the social and behavioural sciences | Nature")) That seems especially important for qualitative interpretation of agent trajectories.
8. **Replication across models, scaffolds and labs.** A phenomenon that disappears when the system prompt changes slightly probably belongs to a different theoretical category from one invariant across architectures and environments.
9. **Explicit negative evidence.** Record which claimed properties were tested and failed. Current AI papers often accumulate demonstrations of capabilities much more readily than evidence against their preferred interpretation.
10. **Source and inference provenance when LLMs assist research.** LLMs can search, generate hypotheses, find counterarguments and propose classifications. But every substantive factual claim should terminate in a primary source or experimental evidence. LLM-generated synthesis should never become evidence for another LLM-generated synthesis.

That last point is especially relevant now.

<a id="6-i-would-make-an-explicit-policy-for-using-llms-in-our-own-research"></a>

### 6. A proposed policy for using LLMs in this research


Something like:

```text
LLM may:
    discover terminology
    search candidate literature
    summarize papers
    generate alternative hypotheses
    challenge definitions
    propose experiments
    search for counterexamples

LLM may not be treated as:
    source of a factual claim
    authority on novelty
    evidence that a construct exists
    adjudicator between theories
```


And every research note should preserve:

```text
claim
source
exact evidence
our inference
alternative interpretations
confidence
what would falsify/change it
```


This actually fits the broader provenance work very well.

<!-- The research-method reply continues in the critique note. -->

The original reply continues with [research paradigms and institutional framing]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}#research-paradigms-and-institutional-framing), then returns to the complete artifact proposal below. The source overview (archived source 009) records the original order.

## Proposed research artifacts


The final passage follows the critique and proposes linked research records. Its complete five-artifact list remains a proposal, and the reassembly does not create or adopt the listed dictionary, ontology, claim record, method, or evidence ledger.

<a id="what-i-would-build-next"></a>

### Proposed next research artifacts


The working interpretation is that we should stop expanding the theory temporarily and construct five linked artifacts:

```text
dictionary.md
    precise vocabulary + evidence requirements

ontology.md
    model / invocation / process / participant /
    agent / environment / system levels

claims.md
    observation → construct → mechanism →
    generalization → forecast

research-method.md
    literature search, preregistration,
    ablations, competing hypotheses,
    replication, LLM-use policy

evidence-ledger.md
    claim → sources → assumptions →
    alternatives → confidence → falsifier
```


Then take **Anthropic multiagent**, **Wei**, and perhaps one strong "AGI/agent" paper and run them through this apparatus.

If it works, we should be able to say very precisely:

> this result is supported;

> this word is under-defined;

> this inference changes levels of analysis;

> this mechanism wasn't distinguished from alternative M;

> this claim is already covered by prior literature;

> this forecast is speculative;

> and here is an experiment that would discriminate between the interpretations.

That would give us the methodological foundation both for the collaboration work and, later, for Alice--where conceptual discipline will be even more important because terms such as `entity`, `life`, `agency`, `meaning`, `understanding`, `reflection`, and `intelligence` are themselves part of what the research is trying to explain.
