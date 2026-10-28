---
draft: false
toc: true
description: "Proposes a working dictionary separating task capability from understanding, grounding, agency, autonomy, and meaning, with analysis levels that distinguish model behavior from whole-system claims."
title: "12 Research Terms And Levels Of Analysis"
linkTitle: "12 Research Terms And Levels Of Analysis"
---
# Research terms and levels of analysis


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The retained reply proposes how to describe systems without treating task performance as evidence of every other cognitive property. The opening motivation, complete dictionary-entry template, learning example, and levels of analysis remain together.

The [participant profiles]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) concern work allocation, and the [participant-neutral model]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) proposes a system architecture. Neither note establishes the definitions or evidence tests below. The sibling [comments]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis-comments" >}}) distinguish working conventions from accepted criteria and link the related dictionary drafts.

<a id="retained-terms-and-levels-of-analysis"></a>

## Terms and levels of analysis


The working interpretation is that this is the right priority now. Before extending either the collaboration framework or Alice, we need a small scientific apparatus for talking about these systems without importing assumptions through words like `agent`, `understanding`, `intelligence`, or `goal`.

The Wei critique shows the problem particularly cleanly. His empirical argument concerns measurable task capabilities, yet the conclusion is phrased as "intelligence becoming a commodity." The author's critique points out that this compresses task competence, reasoning, grounding, understanding, agency, autonomy, and general intelligence into one term. More importantly, you noticed a second-order problem: if research progresses fastest where there is a cheap verifier, the field may gradually define intelligence in terms of exactly those things it can cheaply measure.

That is a methodology problem.

<a id="1-i-would-make-the-dictionary-considerably-stricter"></a>

### 1. A stricter working dictionary


The current dictionary already has the essential separation:

`capability` = ability to perform a task under specified conditions;

`intelligence` = task-solving capability, without a mechanism claim;

`agent` = persistent entity that perceives and acts in a world and whose actions influence its future state;

`agency`, `autonomy`, `grounding`, `understanding`, `learning`, etc. are separate properties.

But for research use, a definition alone isn't enough. Each term should probably have six fields:

| Field                         | Example: `Agent`                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| Definition                    | Persistent entity that perceives and acts in a world and whose actions affect its future state |
| Level                         | Entity/system                                                                                  |
| Observable requirements       | persistence, state across time, perception/action boundary, causal effect on future state      |
| Does **not** imply            | understanding, autonomy, consciousness, LLM                                                    |
| Counterexamples               | isolated LLM call; stateless tool invocation                                                   |
| Evidence required to use term | identify the persistent entity and show the relevant causal continuity                         |

That gives us a way to challenge papers mechanically.

If someone writes:

> "The agent learned to distrust the other agent."

we ask three separate questions:

```text
What is the agent?
What changed persistently?
What observation distinguishes learning
from context-conditioned behavior?
```


If those cannot be answered, the statement should be weakened.

For example:

> "After contradictory reports were added to its context, the model became less likely to follow reports attributed to participant B."

That may sound less exciting. It is also much closer to the observation.

<a id="2-we-need-explicit-levels-of-analysis"></a>

### 2. Explicit levels of analysis


This may be the most useful methodological tool for current AI research.

An "AI agent" experiment can contain at least:

```text
model weights
↓
one inference
↓
model + current context
↓
persistent scaffolded process
↓
several scaffolded processes
↓
shared runtime/environment
↓
human + AI + institutional system
```


Claims must state which level they concern.

Otherwise you get exactly the Anthropic problem:

```text
system-level behavior observed

        ↓

property attributed to "the agent"

        ↓

psychological property attributed
implicitly to the LLM
```


There is a mature methodological reason to care about this. Research in other fields treats inference across levels as dangerous: conclusions about individuals do not automatically follow from group-level observations, and vice versa. ([Sage Journals](https://journals.sagepub.com/doi/10.1177/0013916591234002?utm_source=chatgpt.com "Units of Analysis and the Psychometrics of Environmental Assessment Scales - James M. Richards, Denise C. Gottfredson, Gary D. Gottfredson, 1991"))

For our purposes, this becomes something like:

> Never attribute a property to the model when the experimental intervention and observation concern the model+context+scaffold+environment unless an experiment separates those components.

That one rule would improve a lot of current agent research.

<!-- The terminology reply continues in the research-method note. -->

The original reply continues with [research practices and claim records]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation" >}}#research-practices-and-claim-records). The source overview (archived source 009) links all pieces in their original order.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Initial working dictionary


The complete dictionary reply below proposes working definitions and compares task capability with stronger cognitive claims. Its full 17-term table and Alice terminology discussion remain together. The source overview (archived source 005) links both replies in their original order. The [comments]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis-comments" >}}#imported-dictionary-dialogue) distinguish the conventions from accepted definitions or design requirements.

The working interpretation is that a shared dictionary would help a lot, because most disagreement in AI discussions comes from using words like "intelligence," "understanding," and "agency" as if they were interchangeable.

The proposal is to make one deliberate choice: use **intelligence in a weak, operational sense**. That lets you say that current LLMs are intelligent without implying that they understand, are autonomous, or are agents.

A first version could be:

| Term                     | Working definition                                                                                                                                                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Capability**           | Ability of a system to perform a particular task under specified conditions.                                                                                                                                                                          |
| **Intelligence**         | Capability to solve tasks. Intelligence is therefore a property we infer from performance, not a claim about how the system produces that performance.                                                                                                |
| **General intelligence** | Ability to solve a broad range of tasks, including unfamiliar ones, and transfer what was learned between them.                                                                                                                                       |
| **Competence**           | Observed level of performance on a task or task family. A system can be highly competent without understanding the task.                                                                                                                              |
| **Reasoning**            | A process that transforms available information into intermediate representations or conclusions that improve task performance. This definition does not assume understanding.                                                                        |
| **Understanding**        | Having an internal model whose concepts are grounded in the system's interaction with the world and which supports prediction, intervention, and counterfactual reasoning.                                                                            |
| **World model**          | An internal representation that predicts how relevant parts of the world change, including consequences of possible actions.                                                                                                                          |
| **Grounding**            | The connection between internal representations and things, states, actions, and consequences in the world.                                                                                                                                           |
| **Agent**                | A persistent entity that perceives a world, acts on it, and whose actions influence its future state.                                                                                                                                                 |
| **Agency**               | The capacity of an agent to select and perform actions that affect its future.                                                                                                                                                                        |
| **Autonomy**             | The degree to which an agent's continued activity, goals, and regulation arise from its own organization and interaction with the world instead of being supplied externally at every step.                                                           |
| **Embodiment**           | Having a privileged boundary through which an agent senses and affects its world. The body need not be biological. This corresponds closely to the Alice definition of the body as the part of the universe she can preferentially sense and control. |
| **Viability**            | The set of conditions under which an agent can continue to exist and retain its capacities.                                                                                                                                                           |
| **Mattering**            | A relation in which something changes futures relevant to the agent's viability, capacities, or commitments.                                                                                                                                          |
| **Meaning**              | Significance that some state, object, or event acquires through its relations to the agent's possible actions and consequences.                                                                                                                       |
| **Planning**             | Evaluating possible sequences of actions and their predicted future consequences before acting.                                                                                                                                                       |
| **Learning**             | Persistent modification of the system that improves its future behavior based on experience.                                                                                                                                                          |

This vocabulary gives us an important sentence:

> **An LLM can display high intelligence and competence while having weak grounding, limited agency, no intrinsic viability, and possibly limited understanding.**

There is no contradiction there because we've stopped loading all those properties into the word _intelligence_.

It also makes Wei's claim much clearer. When he says intelligence will become a commodity, we can translate it into our vocabulary as:

> **Task-solving capability will become cheap.**

The LLM analysis regards this as a much narrower and more defensible claim.

And then we can ask the separate question that the author's Alice framework is concerned with:

> Does increasing task-solving capability eventually produce understanding, grounded agency, autonomy, and general intelligence?

We shouldn't assume that it does.

There is one place where this dictionary intentionally departs from the terminology in the attached theory. That document states **"intelligence is relational"** and treats the agent's ongoing relation with a world as constitutive of intelligence. The proposal is to avoid defining the word that strongly. Otherwise the debate with someone like Wei becomes partly terminological: under our definition, we'd simply announce that LLMs aren't intelligent.

Using the weak definition gives us a cleaner argument:

**LLMs clearly possess intelligence in the task-performance sense. The open question is what additional mechanisms are required for understanding, autonomous agency, grounded meaning, and the kind of intelligence exhibited by living cognitive systems.**

That is probably the vocabulary distinction proposed first before sharing the broader Alice theory.

<!-- The initial dictionary reply continues with disputed concepts. -->

The next reply narrows the discussion to disputed concepts. Both arguments remain visible, including their different treatment of general intelligence, with editorial wording.

## Disputed cognitive concepts


The complete narrowed reply below retains its six-concept table, explanations, and Alice examples. The dependency diagram remains beside the explicit warning that its causal order is not established. The [Alice scope note]({{< ref "ai/design-research/00-overview/08-collaborative-computation-and-alice-research-scope" >}}) keeps that research program separate from collaboration among existing participants.

## problematic segment


The proposal is to narrow the dictionary to the terms where people can use the same word while making completely different claims.

The most problematic are these six.

|Concept|Why it causes trouble|Proposed working definition|
|---|---|---|
|**Intelligence**|Often mixes task performance with understanding, autonomy, reasoning, or consciousness.|**Capacity to solve tasks.** This is deliberately operational and makes no claim about the mechanism.|
|**Understanding**|Hard to observe directly. People often infer it from fluent behavior.|**Possessing internal representations that support reliable prediction, intervention, transfer, and counterfactual reasoning about what they represent.**|
|**Grounding**|"Connected to reality" is too vague.|**A systematic causal connection between internal representations and the states, actions, and consequences they represent.**|
|**Agency**|Often applied to anything running in an agent loop.|**Capacity of a persistent entity to select actions that alter its future interaction with its environment.**|
|**Autonomy**|Frequently confused with "runs without a human clicking buttons."|**Degree to which an entity regulates its own continued activity and action from processes internal to the entity and its ongoing interaction with its world.**|
|**Meaning**|Probably the hardest term. In LLM discussions it can mean statistical association, semantics, intention, or significance.|**The significance something has for an agent because of its relation to possible actions and consequences for that agent.**|

The proposal is to treat these differently from terms such as memory, planning, prediction, tool use, and perception. Those are easier to define functionally.

### 1. Intelligence


The LLM response supports the author's proposed choice:

> **Intelligence = capability to solve tasks.**

This is useful precisely because it is modest.

A chess engine is intelligent with respect to chess. An LLM can show substantial linguistic, coding, or mathematical intelligence. None of that settles whether it understands, possesses agency, or has grounded concepts.

It also lets us translate Wei's claim cleanly:

> "Intelligence becomes cheap" -> **task-solving capability becomes cheap.**

That avoids smuggling a theory of mind into a claim about economics.

One tentative proposal is to avoid defining "general intelligence" initially, because then we immediately inherit difficult questions about what counts as a task distribution, transfer, generality, and novelty.

### 2. Understanding


This is probably the central disputed concept.

The weak behavioral definition--

> "If it answers correctly, it understands."

--collapses understanding back into intelligence under our definition.

We need something stronger.

The proposal is to use:

> **A system understands some domain to the extent that its internal representations capture relations in that domain well enough to support prediction, intervention, counterfactuals, and transfer beyond previously encountered cases.**

This is close to the concern motivating the Alice framework. Alice shouldn't merely receive an already interpreted statement such as "the apple is two metres left." She should construct concepts from repeated sensory and causal interaction.

Notice that this definition is graded. We don't have to decide whether an LLM either "understands" or "doesn't understand." We can ask:

- What does it understand?
- How deeply?
- Under what distribution?
- Does the representation survive interventions?
- Does it generalize when surface cues disappear?

That is a much better scientific question.

### 3. Grounding


Understanding and grounding shouldn't be synonymous.

A useful distinction is:

> **Grounding concerns where representations get their connection to what they represent. Understanding concerns what the system can subsequently do with those representations.**

The Alice files make the grounding requirement especially strong: cognition receives raw bodily signals, acts through the body, and representations are repeatedly constrained by consequences.

So:

`representation`

`↕`

`perception/action`

`↕`

`world`

This gives us a meaningful disagreement about LLMs.

Text can provide **indirect grounding**, because human language contains descriptions produced by grounded humans. But that is different from the model itself acquiring the concepts through direct causal interaction.

We shouldn't define grounding so strongly that only biological organisms qualify, though. A simulated Alice could be fully grounded relative to her artificial universe.

### 4. Agency


"AI agent" has become too broad to be useful philosophically.

A script like:

`LLM -> tool call -> observe -> LLM -> tool call`

is commonly called an agent.

For our vocabulary, the proposal is to reserve a stronger concept:

> **Agency is the capacity of a persistent entity to select actions that affect its own future relationship with its environment.**

Persistence is important.

The Alice framework explicitly requires a trajectory where earlier events constrain what is possible later.

That means an isolated LLM inference has little agency. An LLM embedded in a persistent system may participate in an agent. Whether the **LLM itself** is the agent is then a separate question.

That distinction will prevent a lot of confusion.

### 5. Autonomy


This one needs care because there are several levels.

A cron job is operationally autonomous: nobody needs to press a button.

That isn't what we're talking about.

Suggested formulation:

> **Autonomy is the degree to which the processes governing an entity's continued activity and actions originate within, and are maintained through, that entity's organization and interaction with its world.**

This naturally allows degrees.

An LLM chatbot has low autonomy: its existence, goals, context, invocation and stopping conditions are mostly external.

Alice is intended to have considerably more because her continued functioning depends on her own regulation of viability. The files explicitly distinguish this from externally supplied reward.

The proposal is to avoid saying "true autonomy." It creates an unnecessary binary.

### 6. Meaning


This may be the deepest one.

The standard ML usage is often basically:

> representations encode statistical relationships.

But the proposed framework is aiming at something stronger.

The files introduce "mattering" precisely to address it: something matters when it changes futures relevant to Alice's continued existence, capacities, or commitments.

That lets us define meaning relationally:

> **Something has meaning for an agent when the agent has learned how it relates to possible states, actions, and consequences that matter to the agent.**

For example, the same physical object can become:

`shelter`

`obstacle`

`tool`

`resource`

depending on Alice's body, history, and possible actions.

This is much stronger than a token embedding.

The working interpretation is that these concepts should also have an explicit dependency structure:

```text
intelligence
    |
    | independent observational property
    |
    └── task-solving capability

world ↔ persistent entity
          ↓
       grounding
          ↓
     understanding
          ↓
        agency
          ↓
       autonomy
          ↓
        meaning
```


The recommendation is not to claim that this exact causal order is established. But it clarifies what we are trying to distinguish.

The key convention proposed for the top of the shared dictionary is:

> **We use "intelligence" narrowly for task-solving capability. Intelligence alone does not imply understanding, grounding, agency, autonomy, meaning, selfhood, or consciousness.**

That one sentence would eliminate a large fraction of the ambiguity in discussions like the Wei talk.
