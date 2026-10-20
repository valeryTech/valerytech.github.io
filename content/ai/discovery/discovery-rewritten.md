---
draft: false
toc: true
description: "A working research synthesis grounding inquiry before problem definition in Schön, creative problem solving, co-evolution, sensemaking, and design-space theory, with prototyping as one method and selective commitment."
title: "Discovery Rewritten"
linkTitle: "Discovery Rewritten"
---
# Exploratory design inquiry


> Working research synthesis. This document reorganizes the current notes around the conceptual model that emerged from them. It separates the broad inquiry model from specific prototyping methods. Claims and references below come from the existing research notes and have not been re-verified in this rewrite.

## 1. Current synthesis


The work is best understood as **exploratory design inquiry**.

The process begins before a stable problem or solution exists. A person encounters an indeterminate situation, makes provisional sense of it, exposes possibilities, discovers questions, takes exploratory actions, reflects on what happens, and updates their understanding.

The central object being developed is an **evolving model of the design situation**. Prototypes are one class of inquiry move within that process, alongside research, observation, reframing, sketches, examples, comparison, and technical experiments.

A compact representation is:

```text
indeterminate situation
        ↓
provisional understanding / framing
        ↓
questions, uncertainties, possibilities
        ↓
inquiry move
        ↓
observations / evidence / experience
        ↓
reflection and reinterpretation
        ↓
updated understanding, possibilities, and commitments
        ↺
```


This model does not assume that the problem becomes fixed before design begins. Problem understanding and possible solutions can continue to co-evolve.

## 2. Starting before the problem is known

### Schön: problem setting and reflective practice


Donald Schön's reflective-practice tradition starts from a problematic or indeterminate situation rather than a well-defined problem. The practitioner notices and names aspects of the situation, frames it provisionally, makes a move, observes how the situation responds, and reframes.

```text
problematic situation
        ↓
      naming
        ↓
      framing
        ↓
 exploratory move
        ↓
situation responds
        ↓
reflection / reframing
        ↺
```


This supplies a foundation for treating early design as construction of an understanding rather than execution against a given problem.

Reference: [The Reflective Practitioner](https://andymatuschak.org/files/papers/Schon%20-%20The%20Reflective%20Practitioner.pdf?utm_source=chatgpt.com)

### Creative Problem Solving: the mess precedes the problem


Older Creative Problem Solving models make the pre-problem state explicit:

```text
Mess-Finding
    ↓
Data-Finding
    ↓
Problem-Finding
    ↓
Idea-Finding
    ↓
Solution-Finding
    ↓
Acceptance-Finding
```


The useful idea here is that early work can deliberately move from a messy situation through observations and candidate problem formulations before solution generation is meaningful.

Reference: [Firestien & Treffinger, CPS guidance](https://journals.sagepub.com/doi/abs/10.1177/107621758901200522?download=true&utm_source=chatgpt.com)

### Wicked problems and co-evolution


Rittel and Webber's wicked-problems work warns that some situations do not admit a definitive problem formulation independently of their possible resolutions.

Dorst and Cross describe a related dynamic as **co-evolution of problem and solution spaces**:

```text
problem understanding ←→ possible solutions
```


A possible solution can expose something new about the problem. The changed problem then produces different solution possibilities.

References:

- [Rittel & Webber, Dilemmas in a General Theory of Planning](https://doi.org/10.1007/bf01405730?utm_source=chatgpt.com)
- [Dorst & Cross, Creativity in the Design Process](https://www.sciencedirect.com/science/article/abs/pii/S0142694X01000096?utm_source=chatgpt.com)

## 3. The evolving design situation


A useful current representation is:

```text
DesignSituation {
  frames
  observations
  assumptions
  knowledge
  uncertainties
  questions
  possibilities
  constraints
  relationships
  commitments
}
```


At the beginning, many of these are vague or nearly empty:

```text
frames:          weak / provisional
questions:       few or poorly formed
possibilities:   mostly invisible
uncertainty:     high
commitments:     low
```


Early inquiry develops this representation. Progress can include:

```text
understanding                  ↑
question quality               ↑
visible possibility space      ↑
ability to distinguish options ↑
justified commitments          ↑
```


An iteration can be useful even if apparent uncertainty increases. Discovering several different meanings of an initially vague goal expands the visible design space and improves the model of the situation.

## 4. Sensemaking and framing

### Data-Frame theory


Sensemaking can be understood as interaction between observations and provisional frames. A frame affects what evidence is noticed; new evidence can elaborate, challenge, or replace the frame.

```text
observations
    ↓
provisional frame
    ↓
changes what is inspected
    ↓
new observations
    ↓
reframe
    ↺
```


This is relevant when inquiry is still changing what kind of problem the situation appears to contain.

Reference: [A Data-Frame Theory of Sensemaking](https://www.researchgate.net/publication/303171216_A_data-frame_theory_of_sensemaking?utm_source=chatgpt.com)

### Frame Creation


Frame Creation makes the possibility of changing the problem frame explicit. For example, a system initially understood as "search my notes" might be reframed as "inspect what my knowledge base says," "explore evidence," or "develop my understanding from accumulated notes." Each frame exposes different system possibilities.

Reference: [Kees Dorst, Frame Innovation](https://direct.mit.edu/books/book/2239/Frame-InnovationCreate-New-Thinking-by-Design?utm_source=chatgpt.com)

## 5. Expanding knowledge and possibility

### C-K theory


Concept-Knowledge theory separates:

```text
K -- knowledge currently treated as established
C -- concepts whose properties are not yet established
```


Design expands both spaces. Concepts generate questions that require new knowledge; new knowledge makes new concepts possible.

```text
C → K → C → K ...
```


This is useful for diagnosing exploratory work:

```text
Did this move expand relevant knowledge?
Did it expose a new concept or possibility?
Did it only confirm an existing assumption?
Did it close the concept space before we understood it?
```


References:

- [Introduction to C-K theory](https://www.researchgate.net/publication/228609791_A_new_approach_of_innovative_design_an_introduction_to_CK_theory?utm_source=chatgpt.com)
- [C-K theory and fixation effects](https://www.cambridge.org/core/journals/ai-edam/article/abs/teaching-innovative-design-reasoning-how-conceptknowledge-theory-can-help-overcome-fixation-effects/C6BBCFEB0A1368C37A616E4F26AA7EAC?utm_source=chatgpt.com)

### Set-based exploration


Set-based design contributes a related principle: keep multiple meaningful alternatives alive and progressively constrain the set as evidence accumulates.

```text
possible representations:
  passages
  claims
  notes
  clusters
  graphs
  synthesis
```


The point is not to maximize the number of alternatives indefinitely. It is to avoid selecting one representation before enough has been learned about what each one makes possible.

Reference: [Lean Enterprise Institute, Front-loading Product Development](https://www.lean.org/the-lean-post/articles/frontloading-product-development/?utm_source=chatgpt.com)

## 6. Making the design space explicit

### QOC / Design Space Analysis


Questions, Options, and Criteria (QOC) represents a design space explicitly:

```text
Question
   ├── Option A
   ├── Option B
   └── Option C

Criteria
   ↕
evaluate / distinguish options
```


This becomes useful once meaningful design questions and alternatives have emerged. It is less suitable as the very first activity because early inquiry may not yet contain well-formed questions.

References:

- [Questions, Options, and Criteria](https://www.tandfonline.com/doi/abs/10.1080/07370024.1991.9667168?utm_source=chatgpt.com)
- [Reasoning with Design Rationale](https://www.sciencedirect.com/science/article/abs/pii/0142694X94900264?utm_source=chatgpt.com)

## 7. Prototyping as inquiry


Prototypes are useful when making an idea concrete can reveal something about the current design situation.

Houde and Hill's framing is especially useful: understand a prototype by the design question it is intended to answer, including questions about role, look and feel, and implementation.

Reference: [Houde & Hill, What Do Prototypes Prototype?](https://doi.org/10.1016/B978-044481862-1/50082-0?utm_source=chatgpt.com)

### Prototypes as filters and manifestations


Lim, Stolterman, and Tenenberg describe prototypes as filters on a design space and as manifestations of design ideas. This supports two uses:

- make some dimensions concrete enough to inspect;
- expose or constrain parts of the possibility space deliberately.

References:

- [The Anatomy of Prototypes -- KAIST record](https://pure.kaist.ac.kr/en/publications/the-anatomy-of-prototypes-prototypes-as-filters-prototypes-as-man/?utm_source=chatgpt.com)
- [The Anatomy of Prototypes -- ResearchGate](https://www.researchgate.net/publication/220286331_The_anatomy_of_prototypes_Prototypes_as_filters_prototypes_as_manifestations_of_design_ideas?utm_source=chatgpt.com)

### Research through Design


Research through Design treats making artifacts as a way to generate design knowledge. This is relevant when an artifact is made because the useful question is not yet fully known and experience with the artifact may reveal it.

Reference: [Research through Design as a Method for Interaction Design Research](https://dl.acm.org/doi/10.1145/1240624.1240704?utm_source=chatgpt.com)

### Specific prototyping techniques


The following remain useful techniques, but they sit below the broader inquiry model.

**Wizard of Oz.** Simulate behavior manually before the underlying system exists. This is useful for exploring an interaction model without committing to retrieval, ranking, reasoning, or automation infrastructure.

References:

- [Wizard of Oz -- TU Darmstadt](https://www.iad.tu-darmstadt.de/forschung_iad/methoden_iad/wizard_of_oz_iad.en.jsp?utm_source=chatgpt.com)
- [Wizard of Oz -- Usability Body of Knowledge](https://www.usabilitybok.org/wizard-of-oz/?utm_source=chatgpt.com)

**Think-aloud.** Perform a realistic task while verbalizing expectations, interpretations, confusion, and desired next actions. This can expose the person's current mental model.

Reference: [Nielsen Norman Group, Thinking Aloud](https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/?utm_source=chatgpt.com)

**Parallel prototyping.** Explore substantially different alternatives concurrently so that feedback is not limited to refinement of the first solution.

Reference: [Dow et al., Parallel Prototyping](https://doi.org/10.1145/1879831.1879836?utm_source=chatgpt.com)

**RITE.** Rapidly modify and retest a prototype when a clear usability issue is observed. This is useful during iterative evaluation, but should not be treated as the general model of exploratory inquiry because immediate fixing can also narrow attention around one local solution.

Reference: [RITE method](https://jpattonassociates.com/wp-content/uploads/2015/04/rite_method.pdf?utm_source=chatgpt.com)

## 8. Uncertainty, commitment, divergence, and convergence


These are useful lenses on the state of inquiry. They should not be treated as a fixed sequence of phases.

### Uncertainty


Uncertainty identifies what is not currently understood. It helps direct research, observation, prototypes, or technical probes.

Uncertainty reduction is only one form of progress. Early inquiry may deliberately expose new uncertainty by revealing hidden alternatives or assumptions.

### Commitment


Commitment describes how much of the current model is being treated as settled. A useful working principle is:

> Commit in proportion to accumulated understanding and evidence.

Low commitment keeps change cheap. Higher commitment becomes useful when enough has been learned to build on a choice.

### Divergence and convergence


Divergence asks whether the inquiry should expose more possibilities. Convergence asks whether it is useful to distinguish among existing possibilities or make a provisional commitment.

The Double Diamond is useful as a coarse reminder that both modes occur repeatedly. Its named phases should not be taken as a hard boundary where the problem becomes permanently defined.

References:

- [Design Council, Double Diamond](https://www.designcouncil.org.uk/resources/the-double-diamond/?utm_source=chatgpt.com)
- [Design Council, Framework for Innovation](https://www.designcouncil.org.uk/resources/framework-for-innovation/?utm_source=chatgpt.com)

## 9. Current principles

### Minimize the cost of learning


Use the cheapest representation or inquiry move that can reveal something useful. Cost includes time, implementation effort, cognitive effort, and the cost of reversing direction.

### Direct effort at the current gap


Connect inquiry to something currently unclear, missing, contradictory, or underexplored. The target may be a precise question later in the work, or a broader exploratory concern earlier.

### Preserve optionality while understanding is weak


Avoid letting the first coherent solution or representation become the default simply because it exists.

### Make alternatives comparable when useful


Once meaningful alternatives exist, use common examples, tasks, or evidence to expose differences among them.

### Externalize thinking


Represent current frames, observations, assumptions, questions, possibilities, and commitments so they can be inspected and revised.

### Keep conclusions provisional and traceable


Separate observation, interpretation, hypothesis, and commitment where practical. This prevents an early interpretation from silently turning into a fixed design rule.

## 10. Inquiry lenses


The current notes suggest four strong lenses, with commitment added as a fifth:

```text
FRAME
Do I understand what kind of situation I am looking at?
What alternative framings are plausible?

KNOWLEDGE
What do I currently know?
What do I need to learn?

POSSIBILITY
What alternatives can I currently see?
What might the current frame be hiding?

DISCRIMINATION
Which differences among visible possibilities matter?
What could reveal those differences?

COMMITMENT
What am I currently treating as settled?
Is that justified by what I have learned?
```


These are reflection lenses, not a prescribed iteration method.

## 11. Example: a knowledge-system inquiry


An initial situation might be expressed as:

```text
"I want a better way to search my notes."
```


Early exploration can reframe that situation:

```text
"search my notes"
        ↓
"retrieve useful passages"
        ↓
"inspect what my knowledge base says about a topic"
        ↓
"explore evidence, disagreement, examples, and relationships"
        ↓
"support an evolving inquiry using accumulated notes"
```


A search for `DSL` is then one possible **probe** inside a larger inquiry:

```text
current inquiry state
        ↓
probe: "DSL"
        ↓
evidence encountered
        ↓
interpretation / sensemaking
        ↓
updated inquiry state
        ↓
next probe
```


This application-specific model is useful as an example of the general process. It should remain separate from the general foundation so that the methodology does not become defined by one knowledge-system use case.

## 12. Adjacent approaches


Several other traditions help locate the current model:

### Fuzzy Front End / Front End of Innovation


These approaches recognize a distinct period before formal product development in which opportunities, ideas, and concepts are still being formed. They provide useful organizational precedent for treating early inquiry as legitimate work, though they are more management-oriented than the present model.

Reference: [National Academies, Front End of Innovation discussion](https://www.nationalacademies.org/read/10676/chapter/4?utm_source=chatgpt.com)

### Generative design research and needfinding


These are especially relevant when the main uncertainty concerns people, context, latent needs, or aspirations.

References:

- [Sanders & Stappers, Convivial Toolbox](https://research.tudelft.nl/en/publications/convivial-toolbox-generative-research-for-the-front-end-of-design/?utm_source=chatgpt.com)
- [Needfinding Practice](https://www.designsociety.org/publication/46487/needfinding_practice_enhancing_students_problem_framing_skills_through_iterative_observation_for_business_innovation?utm_source=chatgpt.com)

### Effectuation


Effectuation is relevant when even the eventual goal is unclear. It begins from available means, takes affordable actions, encounters contingencies, and allows possible goals to emerge.

Reference: [Effectuation research](https://effectuation.org/research-papers-inception-2011?utm_source=chatgpt.com)

### Discovery-Driven Planning and Lean Startup


These become useful when assumptions or hypotheses can already be articulated and work can be organized around learning about them. They support the principle of cheap learning under uncertainty, but they begin later than a situation in which the useful problem or hypothesis is still unclear.

References:

- [Discovery-Driven Planning](https://www.kellogg.northwestern.edu/academics-research/research/detail/2008/technical-note-putting-discovery-driven-planning-to-work/?utm_source=chatgpt.com)
- [Lean Startup principles](https://theleanstartup.com/principles?lang=es&utm_source=chatgpt.com)

## 13. What remains intentionally unresolved


The present synthesis does not define:

- a fixed sequence of stages;
- exact mechanics for one iteration;
- a mandatory format for recording inquiry state;
- how to rank uncertainties;
- when to diverge or converge;
- formal criteria for making commitments;
- the final terminology for every construct;
- an evaluation framework for the inquiry process itself.

These should be developed after several real iterations, with reflection on what was actually useful, and then compared against the relevant theory.

## 14. Working foundation


The strongest current foundation can be summarized as:

```text
Schön
  begin from an indeterminate situation;
  framing and action interact through reflection.

Creative Problem Solving
  the mess can precede the problem;
  early work can deliberately construct possible problem formulations.

Rittel / Dorst / Cross
  problem and solution understanding can co-evolve.

Sensemaking / Frame Creation
  observations and frames change each other;
  reframing changes which possibilities become visible.

C-K / set-based exploration
  expand knowledge and concepts;
  keep meaningful alternatives alive while understanding is weak.

Design Space Analysis
  once questions and alternatives are visible,
  make the space and reasoning explicit.

Research through Design / prototyping theory
  making is one way to generate knowledge about the situation.
```


The resulting working definition is:

> **Exploratory design inquiry is the iterative construction and revision of an understanding of a design situation and its possibility space through observation, framing, research, making, comparison, reflection, and selective commitment.**
