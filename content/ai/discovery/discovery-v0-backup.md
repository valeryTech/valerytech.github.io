---
draft: false
toc: true
description: "A preserved version of the discovery research, including DSL interaction examples, prototyping principles, theory comparisons, and an appended inquiry-state model. It records the reasoning behind the later synthesis."
title: "Discovery V0 Backup"
linkTitle: "Discovery V0 Backup"
---
# Exploratory discovery and prototyping


Earlier version of the discovery research notes, edited for standalone reading.

## Exploratory interaction prototyping


Early conceptual exploration uses fast feedback from interfaces and interactions to clarify what is wanted and needed.

Several established HCI prototyping methods can support this exploration without requiring a full product-design process.

A useful conceptual guide is Houde & Hill's _What Do Prototypes Prototype?_ Their point is that a prototype should be built to answer a particular design question. They distinguish questions about the product's **role**, **look and feel**, and **implementation**. ([DOI](https://doi.org/10.1016/b978-044481862-1/50082-0?utm_source=chatgpt.com "What do Prototypes Prototype? - ScienceDirect"))

The initial knowledge-search example explores **role + interaction**:

> What should "search my knowledge" actually mean?
> What information should appear?
> What choices should the system expose?
> What should happen after I search `DSL`?

Embeddings, indexing, and ranking infrastructure can remain outside the initial interaction prototype.

A possible exploration loop is:

```text
design question
     ↓
tiny prototype
     ↓
try a realistic task
     ↓
observe what happens
     ↓
change the prototype
     ↓
new question
```


A concrete iteration might be:

```text
Question:
"When I search DSL, is seeing literal evidence first useful?"

Prototype:
┌──────────────────────────────────┐
│ DSL                              │
└──────────────────────────────────┘

Exact mentions -- 12 passages

[passage...]
[passage...]
[passage...]

Explore further:
  aliases
  related concepts
  semantic matches
```


This example can use completely fake data. The prototype is testing the interaction model, not retrieval quality.

This is where **Wizard of Oz prototyping** is especially appropriate. The UI behaves as though there is an intelligent retrieval system behind it, while you manually provide its outputs. It is specifically used to investigate interactions before the underlying technology is implemented. ([Institute of Applied Computer Science](https://www.iad.tu-darmstadt.de/forschung_iad/methoden_iad/wizard_of_oz_iad.en.jsp?utm_source=chatgpt.com "Wizard-of-Oz - Ergonomics & Human Factors - TU Darmstadt"))

For example:

```text
user searches "DSL"

                fake system

Exact
→ you manually select 8 passages containing DSL

Aliases
→ you manually add passages containing
  "domain-specific language"

Related
→ you manually choose 5 passages that you
  judge conceptually related
```


Trying the prototype may reveal that the UI should hide these categories, or that "related" should mean something different, before retrieval is implemented.

For getting feedback, **think-aloud testing** fits this stage well: perform a realistic task while verbalizing what you expect, what you think each thing means, and what you want to do next. It works with early prototypes and is intended to expose users' mental models and misconceptions. ([Nielsen Norman Group](https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/?utm_source=chatgpt.com "Thinking Aloud: The #1 Usability Tool - NN/G"))

For a personal knowledge system, the main user can initially perform the think-aloud exercise:

```text
Goal:
"I vaguely remember thinking about DSLs.
Show me what I've written."

Search: DSL

"I expect these to be literal mentions."
"I don't care about this passage."
"Oh, this note calls it domain-specific language;
I expected the system to find that."
"I want to see the different things I've said
about what a DSL actually is."
```


Those statements are much more valuable at this stage than metrics like NDCG or embedding similarity. They reveal requirements.

Then use the **RITE method -- Rapid Iterative Testing and Evaluation**: when you find a clear problem, change the prototype immediately and test the revised version in the next session, instead of completing a large research round before making changes. The method was explicitly developed around rapid cycles of finding problems, fixing them, and testing the fixes. ([J Patton Associates](https://jpattonassociates.com/wp-content/uploads/2015/04/rite_method.pdf?utm_source=chatgpt.com "Using the RITE method to improve products; a definition"))

Another useful technique is **parallel prototyping**. Occasionally make two or three substantially different versions at once:

```text
A -- conventional search
DSL → ranked passage list

B -- evidence expansion
DSL → exact → aliases → semantic

C -- exploratory map
DSL
 ├ definition
 ├ examples
 ├ criticisms
 ├ implementation
 └ related ideas
```


Research on parallel prototyping found that exploring alternatives concurrently reduces fixation on the first solution and produces more design exploration. ([DOI](https://doi.org/10.1145/1879831.1879836?utm_source=chatgpt.com "Parallel prototyping leads to better design results, more divergence, and increased self-efficacy | ACM Transactions on Computer-Human Interaction"))

A possible working method is:

```text
1. Write a question
   "What should happen immediately after 'DSL'?"

2. Make 2-3 crude alternatives
   Don't build backend functionality.

3. Use real notes
   Manually assemble realistic passages.

4. Walk through a real information need
   Think aloud.

5. Record:
   observed
   expected
   wanted
   confusing
   new idea

6. Modify immediately.

7. Only implement something when
   repeated prototypes depend on it.
```


A small design log would also help:

```text
Question
What should the initial DSL results represent?

Prototype
Literal word matches only.

Observation
I immediately wanted full-form matches too.

Inference
The first evidence set may need concept resolution.

Change
Show:
  Explicit mentions
  Same-concept mentions

Open question
Should semantic evidence appear automatically
or only when I ask to expand?
```


This format keeps **observation -> interpretation -> design decision** separate.

Three useful starting references are Houde & Hill for thinking about prototypes, Wizard of Oz for a simulated search/reasoning backend, and RITE for the iteration cycle. [What Do Prototypes Prototype?](https://doi.org/10.1016/B978-044481862-1/50082-0?utm_source=chatgpt.com) [Wizard of Oz guide](https://www.usabilitybok.org/wizard-of-oz/?utm_source=chatgpt.com) [RITE method paper](https://jpattonassociates.com/wp-content/uploads/2015/04/rite_method.pdf?utm_source=chatgpt.com)

**Exploratory interaction prototyping** uses prototypes as instruments for discovering what the system could be and how it could work.

## Evolving design space


**Design knowledge** is a broad established term for what is learned through exploration.

In HCI, prototypes are explicitly treated as tools for generating knowledge about a **design space**--the possible forms the system and interaction could take. Lim, Stolterman, and Tenenberg describe prototypes as supporting reflection while exploring that space, and Beaudouin-Lafon & Mackay similarly describe prototyping as expanding and contracting a design space while learning about the system. ([KAIST](https://pure.kaist.ac.kr/en/publications/the-anatomy-of-prototypes-prototypes-as-filters-prototypes-as-man/?utm_source=chatgpt.com "The anatomy of prototypes: Prototypes as filters, prototypes as manifestations of design ideas - Korea Advanced Institute of Science and Technology"))

Three levels make the meaning of design knowledge more specific:

|Term|What it would mean here|
|---|---|
|**Design knowledge**|everything you learn through exploration|
|**Problem framing**|evolving understanding of what the search problem actually is|
|**Design-space model**|understanding of possible interaction structures, alternatives, and dimensions|

So after several `DSL` experiments, you might have learned:

```text
Search isn't simply:
query → ranked documents

There appear to be several useful operations:

query
  ↓
literal evidence
  ↓
concept expansion
  ↓
semantic evidence
  ↓
organize evidence by ...
```


That is not yet a decision. It is knowledge about the structure of the problem and the possible solution space.

The process can be represented as:

```text
exploratory interaction prototyping

input
    initial problem / curiosity

activity
    prototype → use → observe → reinterpret → prototype

output
    evolving design-space model
```


The model can accumulate:

```text
observations
    "When searching DSL I immediately wanted full-form matches."

hypotheses
    "Users may distinguish explicit evidence from expanded evidence."

concepts
    "evidence acquisition channel"

dimensions
    literal ↔ semantic
    automatic ↔ user-requested expansion
    passage ↔ synthesized representation

open questions
    "Should expansion happen automatically?"

possibilities
    A. mixed result list
    B. progressive expansion
    C. separate evidence channels
```


The term **design-space model** draws on the history of "design space" in prototyping: prototypes expose and structure alternatives, constraints, and possibilities before a final choice is made. ([Taylor & Francis](https://www.taylorfrancis.com/chapters/edit/10.1201/b11963-ch-47/prototyping-tools-techniques-michel-beaudouin-lafon-wendy-mackay?utm_source=chatgpt.com "Prototyping Tools and Techniques | v3 | Human Computer Interaction Han"))

There is also a more academic term, **intermediate-level knowledge**. Höök and Löwgren use it for design knowledge that sits between a particular artifact and a general theory. For example, after many experiments you might arrive at a reusable concept such as "progressive evidence expansion." That is more abstract than one `DSL` screen, but it isn't a universal theory of search. ([ResearchGate](https://www.researchgate.net/publication/259823438_Strong_Concepts_Intermediate-Level_Knowledge_in_Interaction_Design_Research?utm_source=chatgpt.com "(PDF) Strong Concepts: Intermediate-Level Knowledge in Interaction Design Research"))

The levels can be distinguished as follows:

```text
individual iteration
    ↓
observations / findings

iterations accumulate
    ↓
design-space model

some patterns stabilize
    ↓
design knowledge / intermediate-level concepts

eventually
    ↓
design decisions
```


An **evolving design-space model** is a useful proposed name for this output: the dimensions, possibilities, concepts, constraints, and questions discovered so far, with choices remaining open.

## Principles


**Principles for productive exploratory interaction prototyping** provide a layer above individual methods.

A process can iterate quickly while learning very little. A more useful principle concerns the cost of learning:

**1. Minimize the cost of learning.**

For any uncertainty, use the cheapest representation or experiment that can teach you something meaningful.

This is close to Lim et al.'s "economic principle of prototyping": the best prototype is the simplest, most efficient one that makes the relevant possibilities and limitations visible. ([ResearchGate](https://www.researchgate.net/publication/220286331_The_anatomy_of_prototypes_Prototypes_as_filters_prototypes_as_manifestations_of_design_ideas?utm_source=chatgpt.com "(PDF) The anatomy of prototypes: Prototypes as filters, prototypes as manifestations of design ideas"))

So:

```text
cheap experiment
→ more experiments
→ more feedback
→ more opportunities to revise understanding
```


Speed is one contributor:

```text
cost of learning ≈
    time
  + implementation effort
  + cognitive effort
  + cost of changing direction
```


Choosing questions appropriate to the current understanding suggests a second principle:

**2. Spend experiments on the current uncertainty.**

Before prototyping, ask:

```text
What don't I understand yet?
What uncertainty blocks further exploration?
What could this experiment distinguish?
```


This fits Houde & Hill's argument that prototypes should be understood by the question they are intended to answer. ([DOI](https://doi.org/10.1016/b978-044481862-1/50082-0?utm_source=chatgpt.com "What do Prototypes Prototype? - ScienceDirect"))

For example, during early knowledge-search exploration:

```text
Bad use of effort:
"How should embedding ranking work?"

Current uncertainty:
"What kinds of evidence do I even want to encounter
when I search DSL?"

Useful experiment:
manually construct different evidence sets and interact with them
```


This can be called **question-directed exploration** or **uncertainty-directed exploration**.

A separate concern is the breadth of possibilities that remain visible:

**3. Preserve the opportunity space.**

Early representations and prototypes should expose possible directions without accidentally making one direction look inevitable.

For instance:

```text
DSL
 ↓
ranked list
```


already embeds a large assumption:

> the correct interaction is a single ranked list.

Whereas:

```text
DSL
 ↓
exact mentions
aliases
semantic relations
linked notes
contradictions
examples
...
```


keeps more structures available for inspection.

This is related to **design fixation**. Serially improving one solution can cause designers to keep refining that solution; experiments with parallel prototyping found greater divergence when multiple alternatives were explored before feedback. ([DOI](https://doi.org/10.1145/1879831.1879836?utm_source=chatgpt.com "Parallel prototyping leads to better design results, more divergence, and increased self-efficacy | ACM Transactions on Computer-Human Interaction"))

A more precise formulation is:

> **Avoid premature collapse of the design space.**

Or positively:

> **Maintain optionality while uncertainty is high.**

These principles address three different concerns:

```text
                  exploratory process

     cheap learning
          │
          │ enables many probes
          ▼
    ┌───────────────┐
    │ design space  │
    └───────────────┘
       ▲         ▲
       │         │
 right questions │ preserve optionality
       │         │
       └─────────┘
```


Three further principles concern comparison, reflection, and revision.

**4. Make alternatives comparable.**

Generating many possibilities isn't enough. You want experiments that reveal meaningful differences between them.

Suppose you prototype:

```text
A. lexical evidence first
B. lexical + semantic mixed
C. lexical first, semantic on demand
```


Trying all three against the _same_ searches--`DSL`, `monads`, `distributed transactions`, etc.--makes differences visible.

The principle is something like:

> Structure experiments so competing possibilities can be distinguished.

This prevents "I tried lots of things" from turning into an accumulation of impressions.

**5. Make thinking external and inspectable.**

A prototype shouldn't only simulate a future product. It should help you think.

Lim et al. explicitly describe prototypes as manifestations that externalize ideas and as filters through a design space. ([ResearchGate](https://www.researchgate.net/publication/220286331_The_anatomy_of_prototypes_Prototypes_as_filters_prototypes_as_manifestations_of_design_ideas?utm_source=chatgpt.com "(PDF) The anatomy of prototypes: Prototypes as filters, prototypes as manifestations of design ideas"))

An inspectable artifact can make changes in understanding visible:

```text
I thought:
  evidence = matching passages

Then discovered:
  exact match
  alias match
  semantic match

Then noticed:
  retrieval mechanism itself may be useful information

Open:
  should these be mixed or kept distinct?
```


The artifact should expose the current model enough to reveal what is missing.

**6. Keep conclusions provisional and traceable.**

An evolving design-space model needs conclusions that can be revisited.

Instead of:

```text
Decision:
semantic search should be separate
```


capture:

```text
Observation:
When exact and semantic matches were mixed,
I couldn't tell why a passage appeared.

Hypothesis:
Retrieval provenance may be useful in the interaction.

Open alternatives:
A. separate channels
B. badges
C. progressive expansion
D. don't expose provenance
```


You haven't collapsed an observation into a design rule.

That gives a fairly coherent initial set:

|Principle|What it protects|
|---|---|
|**Cheap learning**|iteration rate|
|**Question-directed exploration**|relevance of experiments|
|**Preserve optionality**|breadth of design space|
|**Comparable alternatives**|quality of feedback|
|**Externalize thinking**|ability to reflect|
|**Provisional, traceable conclusions**|ability to revise the model|

And there is a useful relationship among them:

```text
cheap learning
    ↓
lets you run more experiments

right questions
    ↓
makes those experiments informative

preserve optionality
    ↓
prevents experiments from all exploring one branch

comparable alternatives
    ↓
makes feedback discriminative

externalization
    ↓
makes what you're learning visible

traceability
    ↓
lets learning accumulate into a design-space model
```


A possible organizing principle is **frequent, broad learning that distinguishes alternatives**.

Then speed, low prototype cost, question selection, parallel alternatives, and explicit observations are mechanisms that enable it.

A possible criterion for evaluating the _process_ separately from the product is:

> **Does this process efficiently increase my understanding of the relevant design space without closing it prematurely?**

## Structuring exploration by uncertainty and commitment


Prototype choice can be guided by the current uncertainty and degree of commitment.

A proposed framing uses **uncertainty as the primary lens** and **commitment** as a second lens. Phases can then be interpreted through these dimensions.

A fixed sequence like `discovery -> prototype -> implementation` can be too rigid for exploratory inquiry. You can understand the interaction quite well while still being uncertain about the information model, or discover a new conceptual uncertainty after building something functional. Design processes such as the Double Diamond already acknowledge repeated divergence, convergence, and iteration rather than a strictly linear progression. ([Design Council](https://www.designcouncil.org.uk/resources/the-double-diamond/?utm_source=chatgpt.com "The Double Diamond - Design Council"))

An approximate model is:

```text
                 uncertainty
                     high
                      │
      explore         │       probe
      possibilities   │       assumptions
                      │
                      │
 low commitment ──────┼──────────── high commitment
                      │
      compare         │       validate
      alternatives    │       integrated behavior
                      │
                     low
```


"Commitment" means how much of the current model is treated as fixed. Low commitment means almost everything can change cheaply. High commitment means assumptions have accumulated and changing them affects more of the system.

Then prototypes are selected according to the **uncertainty currently being investigated**. This is close to Houde & Hill's core argument: choose prototypes according to the questions they answer, such as questions about role, interaction, or implementation, rather than according to generic fidelity levels. ([DOI](https://doi.org/10.1016/b978-044481862-1/50082-0?utm_source=chatgpt.com "What do Prototypes Prototype? - ScienceDirect"))

The following states describe different kinds of inquiry:

| State             | Main uncertainty                         | Useful prototype                                         | What you learn                                    |
| ----------------- | ---------------------------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| **Explore**       | "What could this even be?"               | sketches, fake screens, manually assembled evidence      | concepts, dimensions, possibilities               |
| **Structure**     | "What are the meaningful parts?"         | alternative interaction models, flows, conceptual models | vocabulary, relationships, design-space structure |
| **Discriminate**  | "Which alternatives behave differently?" | parallel prototypes using the same tasks/data            | strengths, weaknesses, missing alternatives       |
| **Probe reality** | "Do these ideas survive real data?"      | partially functional prototypes over actual notes   | hidden assumptions, edge cases, new requirements  |
| **Validate**      | "Does this interaction actually work?"   | realistic end-to-end prototype                           | usability, usefulness, coherence                  |
| **Commit**        | "Can we build and maintain this?"        | technical spikes / vertical slices                       | feasibility, cost, performance                    |

Importantly, these aren't irreversible stages.

An early knowledge-search example might have this profile:

```text
query: DSL

uncertainty:
  HIGH  what should "evidence" mean?
  HIGH  what retrieval channels should exist?
  HIGH  how should exploration unfold?
  MED   whether passages are the useful base unit
  LOW   whether Markdown notes can be searched somehow

commitment:
  deliberately low
```


So implementing a production embedding pipeline would be premature. A better prototype could literally be a manually constructed screen:

```text
DSL

Exact mentions
  [P1]
  [P2]

Also called
  domain-specific language
  [P3]

Conceptually related
  [P4]
  [P5]
```


Trying the screen may reveal a preference:

> "Actually, I don't care how the passage was retrieved. I care whether it's a definition, example, disagreement, or use."

This changes the visible design space without requiring an implementation of semantic retrieval.

**Commitment** complements uncertainty in this model. Lim, Stolterman, and Tenenberg describe prototypes as both _filters_ on a design space and _manifestations_ of design ideas: any prototype makes some dimensions concrete while leaving others open. ([ResearchGate](https://www.researchgate.net/publication/277527546_The_anatomy_of_prototypes?utm_source=chatgpt.com "(PDF) The anatomy of prototypes: Prototypes as filters, prototypes as manifestations of design ideas")) The danger is that making something concrete can make it feel settled.

So an explicit rule could be:

```text
high uncertainty → low commitment
                    broad / cheap prototypes

uncertainty decreases
        ↓
increase commitment selectively
        ↓
more integrated / realistic prototypes
```


There is another useful axis besides uncertainty: **divergence vs. convergence**.

Uncertainty asks:

> What don't I know?

Divergence/convergence asks:

> Should I currently generate possibilities or discriminate among existing ones?

Those are different. You could know that you need an evidence representation but still deliberately diverge:

```text
passages
claims
notes
clusters
graph
timeline
contradiction sets
```


Then later converge by comparing them. The Double Diamond formalizes exactly this alternation between broadening the space and narrowing it. ([Design Council](https://www.designcouncil.org.uk/resources/framework-for-innovation/?utm_source=chatgpt.com "Framework for Innovation - Design Council"))

These dimensions can be combined in a proposed process model:

```text
                 current design-space model
                           │
                           ↓
                identify uncertainties
                           │
                           ↓
           choose one useful question/probe
                           │
                  ┌────────┴────────┐
                  │                 │
              diverge?          converge?
           expose options     distinguish options
                  │                 │
                  └────────┬────────┘
                           ↓
             cheapest adequate prototype
                           ↓
                 experience / observe
                           ↓
              update design-space model
                           │
                           ↺
```


And the prototype's sophistication should follow **the question's maturity**, rather than elapsed project time.

In this proposed framing, **question maturity** or **state of knowledge** guides prototype type; uncertainty directs probes; divergence/convergence guides expansion or comparison; and commitment determines how much is treated as settled.

## Inquiry before a problem is defined


At the earliest stage, the problem and the possible system may both be unclear.

Relevant approaches extend beyond prototyping methods into **problem framing, generative research, sensemaking, and design-space exploration**. Those are closer to the stage where the object itself is still unclear.

Several approaches address inquiry before a solution can be proposed.

Relevant approaches include:

|Approach|Starts from|Exploration mechanism|Main output|
|---|---|---|---|
|**Sensemaking / Data-Frame theory**|messy observations|evidence <-> provisional frames|better frames / interpretations|
|**C-K theory**|something partly unknown|expand concepts <-> expand knowledge|larger concept + knowledge spaces|
|**Frame Creation**|an open, unclear situation|construct alternative ways of seeing the problem|alternative frames|
|**QOC / Design Space Analysis**|design questions|question -> options -> criteria|explicit design space|
|**Set-based design**|multiple plausible directions|keep alternatives alive; eliminate with evidence|progressively constrained option set|
|**Research through Design**|questions that need making|artifacts as experiments/inquiry|design knowledge|

The following sections examine these approaches in more detail.

### 1. Sensemaking: evidence and frames co-evolve


Klein's Data-Frame theory doesn't assume that you first collect all the facts and then form an understanding. You encounter data through some existing frame, while new data can elaborate, question, or replace that frame. ([ResearchGate](https://www.researchgate.net/publication/303171216_A_data-frame_theory_of_sensemaking?utm_source=chatgpt.com "(PDF) A data-frame theory of sensemaking"))

The corresponding exploration loop is:

```text
observations
    ↓
provisional understanding
    ↓
changes what I look for
    ↓
new observations
    ↓
reframe
    ↺
```


For example:

```text
Observation:
Searching DSL gives passages.

Frame 1:
"This is an information-retrieval problem."

↓ experiment

Observation:
I care about examples, contradictions,
different framings, and relationships.

Frame 2:
"Maybe this is an evidence-exploration problem."

↓ experiment

Observation:
The way evidence is organized affects
what questions occur to me.

Frame 3:
"Maybe this is an interactive sensemaking system."
```


There isn't necessarily a "solution" produced at each cycle. The product of a cycle can simply be a changed frame.

This connects framing to **question selection**: a frame determines which questions even become visible.

### 2. C-K theory: deliberately expand knowledge and possibilities


C-K means **Concept-Knowledge theory**. It explicitly separates:

```text
K -- Knowledge
things currently known / established

C -- Concepts
possible things whose properties aren't yet established
```


Design proceeds by expanding both spaces and moving between them. The theory was created specifically to describe innovative design where the object itself isn't already known. ([ResearchGate](https://www.researchgate.net/publication/228609791_A_new_approach_of_innovative_design_an_introduction_to_CK_theory?utm_source=chatgpt.com "(PDF) A new approach of innovative design: an introduction to CK theory"))

The distinction can be applied to knowledge-search exploration.

Suppose you begin with:

```text
C:
"A better way of searching my notes"

K:
- hundreds of Markdown notes
- inconsistent terminology
- contradictions
- current search is text based
```


Exploration creates concepts:

```text
C
├ search as ranked retrieval
├ search as evidence exploration
├ search as dialogue
├ search as concept map
└ search as progressive expansion
```


Those concepts generate questions requiring new knowledge:

```text
Would I want exact matches separated?
What happens with real contradictory passages?
Does provenance matter?
Can embeddings find useful things?
```


Experiments add to `K`.

And new knowledge creates more concepts.

```text
C → K → C → K ...
```


C-K theory explicitly treats design as the **joint expansion of concept and knowledge spaces**, and later work connects it to overcoming fixation effects. ([Cambridge University Press](https://www.cambridge.org/core/journals/ai-edam/article/abs/teaching-innovative-design-reasoning-how-conceptknowledge-theory-can-help-overcome-fixation-effects/C6BBCFEB0A1368C37A616E4F26AA7EAC?utm_source=chatgpt.com "Teaching innovative design reasoning: How concept-knowledge theory can help overcome fixation effects | AI EDAM | Cambridge Core"))

C-K theory offers a possible foundation for the aim:

> maximize opportunity-space discovery and avoid shadowing options.

Useful reflection questions include:

```text
Did this activity expand K?
Did it expand C?
Did it only validate something we already assumed?
Did it accidentally shrink C too early?
```


That's a useful process diagnostic.

### 3. Frame Creation: explore the problem framing


Kees Dorst's work focuses on open, complex problems where conventional problem solving fails because the original framing itself may be wrong. Frame creation means generating different ways of interpreting the situation before committing to a solution. ([MIT Press Direct](https://direct.mit.edu/books/book/2239/Frame-InnovationCreate-New-Thinking-by-Design?utm_source=chatgpt.com "Frame Innovation: Create New Thinking by Design | Books Gateway | MIT Press"))

Knowledge-search exploration provides an example:

```text
"search notes"
       ↓
"retrieve passages"
       ↓
"explore evidence"
       ↓
"support information needs"
       ↓
"support sensemaking?"
```


Each one changes the space of possible systems.

If the frame is:

> Find documents relevant to a query.

then you naturally investigate BM25, embeddings and ranking.

If the frame becomes:

> Help me inspect what my knowledge base says about something.

you start investigating passages, contradictions, provenance and grouping.

If it becomes:

> Help me develop my understanding of something using my accumulated notes.

you start thinking about questions, perspectives, gaps, concept formation and interaction history.

These shifts change **the kind of problem being addressed**.

Frame Creation makes that activity explicit.

### 4. QOC: Questions -> Options -> Criteria


QOC provides an explicit representation of design alternatives and their rationale.

QOC comes from **Design Space Analysis**:

```text
Question
   ├── Option A
   ├── Option B
   └── Option C

Criteria
   ↕ evaluate the options
```


MacLean et al. explicitly describe the output as a representation of the **design space around an artifact**, including alternatives and reasoning. ([Taylor & Francis Online](https://www.tandfonline.com/doi/abs/10.1080/07370024.1991.9667168?utm_source=chatgpt.com "Questions, Options, and Criteria: Elements of Design Space Analysis: Human-Computer Interaction: Vol 6, No 3-4"))

For example:

```text
Q: What should the first result of searching "DSL" be?

O1: exact passages only
O2: exact + synonym passages
O3: blended semantic ranking
O4: several explicit evidence channels
O5: synthesized overview

Q: Should retrieval mechanisms be visible?

O1: yes, separate sections
O2: badges on passages
O3: hidden by default
O4: user-controlled expansion
```


This is useful because **the output is the design space**, not merely the final choice. The original work says precisely that: Design Space Analysis emphasizes production of a design space rather than a single solution. ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/0142694X94900264?utm_source=chatgpt.com "Reasoning with Design Rationale: practical experience with design space analysis - ScienceDirect"))

The output can therefore capture alternatives and reasoning before a design decision is made.

One limitation is that QOC assumes meaningful questions can already be formulated. Some sensemaking and framing may be needed first.

### Set-based design: don't choose yet


Set-based design offers another way to avoid prematurely hiding possibilities.

The basic principle is to develop multiple alternatives concurrently and progressively eliminate them as evidence appears, rather than selecting one early and repeatedly modifying it. ([Lean Enterprise Institute](https://www.lean.org/the-lean-post/articles/frontloading-product-development/?utm_source=chatgpt.com "Front-loading Product Development - Lean Enterprise Institute"))

For knowledge-search exploration:

```text
Evidence representation could be:

A passages
B claims
C notes
D clusters
E graph
F generated synthesis
```


Don't immediately decide "passages are the model."

Carry several representations far enough to understand what each exposes.

This provides a process principle:

> **Commit in proportion to accumulated knowledge.**

That is stronger than simply "keep an open mind."

### Research through Design: making itself can be inquiry


Research through Design (RtD) is also relevant, although it comes from academic design research. It treats designing and making artifacts as a way to generate knowledge. ([ACM Digital Library](https://dl.acm.org/doi/10.1145/1240624.1240704?utm_source=chatgpt.com "Research through design as a method for interaction ..."))

An exploratory making loop can look like this:

```text
I don't know exactly what I want.

→ make something
→ experience it
→ notice something
→ reformulate the question
→ make something else
```


The artifact isn't only testing a hypothesis. Sometimes you make it precisely because you don't yet know what the useful hypothesis is.

This distinction matters when useful hypotheses have not yet emerged.

These approaches can be combined into a proposed model of inquiry:

```text
                  SITUATION
                      │
                      ▼
                SENSEMAKING
          evidence ↔ current frames
                      │
                      ▼
               FRAME EXPLORATION
         What different problems could
              this situation imply?
                      │
                      ▼
             C ↔ K EXPANSION
       What possibilities can we imagine?
       What do we need to learn about them?
                      │
                      ▼
             DESIGN-SPACE MAPPING
          Questions → Options → Criteria
                      │
                      ▼
             SET-BASED EXPLORATION
       Keep meaningful alternatives alive
                      │
                      ▼
                EXPERIMENT / MAKE
                      │
                      └──────────────↺
```


These are **modes of inquiry**, with movement between them as needed.

And this suggests a better structure than "uncertainty level" alone.

At any moment, ask four things:

```text
1. FRAME
   Do I understand what situation/problem I'm looking at?

2. KNOWLEDGE
   What do I know, and what do I need to learn?

3. POSSIBILITY
   What alternatives can I currently see?
   What might my current framing be hiding?

4. DISCRIMINATION
   What question or experiment would distinguish
   meaningful alternatives?
```


Then choose the activity accordingly:

```text
frame unclear
→ sensemaking / reframing

knowledge poor
→ investigate / observe / make probes

possibility space narrow
→ divergence / C-K expansion / alternative frames

many possibilities, little discrimination
→ QOC / comparative experiment

evidence accumulating
→ progressively constrain the set
```


These lenses allow more flexibility than a fixed sequence of named phases such as Discover -> Define -> Develop. The Double Diamond is useful as a coarse reminder to diverge and converge, but its `Discover -> Define` transition implies that at some point the problem has been "defined." ([Design Council](https://www.designcouncil.org.uk/resources/the-double-diamond/?utm_source=chatgpt.com "The Double Diamond - Design Council")) In the proposed recursive model, **understanding the problem, possibilities, and useful questions all co-evolve**.

A next area to develop is the **state representation of the exploration itself**: `frames + knowledge + questions + possibilities + observations`. This could represent the evolving output of the process.

## Exploratory design inquiry


**Exploratory design inquiry** describes the beginning of discovery and design, before the problem or solution space is understood.

The starting point is usually not a well-formed problem. It is closer to:

```text
situation
+ motivation
+ vague dissatisfaction / opportunity
+ prior assumptions
```


Then the process evolves like this:

```text
initial situation
      ↓
provisional framing
      ↓
questions / uncertainties
      ↓
exploration
  - inspect
  - sketch
  - compare
  - prototype
  - research
  - manipulate examples
      ↓
observations / findings
      ↓
updated understanding
      ↓
new frames + new possibilities + new questions
      ↺
```


The central object being developed is not the prototype. It is the person's **model of the design situation**.

That model could contain:

```text
DesignSituation {
  frames          // ways of understanding what this is about
  observations    // things encountered or noticed
  assumptions
  uncertainties
  questions
  possibilities   // candidate directions
  constraints
  relationships
  commitments     // things provisionally treated as settled
}
```


At the beginning:

```text
frames: vague
questions: few and poorly formed
possibilities: mostly invisible
uncertainty: high
commitments: low
```


During discovery, the goal is roughly:

```text
make the situation more intelligible
+
expose meaningful possibilities
+
discover useful questions
+
reduce selected uncertainties
```


Crucially, **reducing uncertainty is only one kind of progress**.

Sometimes an iteration increases apparent uncertainty:

```text
before:
"I need better search"

after:
"There are at least five different things
I could mean by better search."
```


That iteration was successful because it expanded the visible design space.

Progress can be described along several dimensions:

```text
understanding ↑
question quality ↑
visible possibility space ↑
ability to distinguish alternatives ↑
justified commitments ↑
```


This also gives "fast iteration" a clearer role. Fast iteration is an **enabler of inquiry**, because it lets the person repeatedly modify this evolving model.

So the conceptual core could be:

> **Exploratory design inquiry is the iterative construction and revision of an understanding of a design situation and its possibility space.**

Prototypes, research, sketches, experiments, conversations, and examples are then **inquiry moves**--ways to perturb the current understanding and see what becomes visible.

## Foundations and adjacent approaches


Several established traditions differ in what they assume exists at the beginning. This distinction helps position exploratory design inquiry.

The closest match is probably Donald Schön's **problem setting / reflective practice**. Schön starts before there is a well-defined problem: there is a _problematic situation_ that is puzzling, uncertain, or incoherent. The practitioner selects what to attend to ("naming"), imposes a provisional interpretation ("framing"), makes moves, sees how the situation responds, and reframes. ([Andy Matuschak](https://andymatuschak.org/files/papers/Schon%20-%20The%20Reflective%20Practitioner.pdf?utm_source=chatgpt.com "The Reflective Practitioner"))

Conceptually:

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


In this model, the early output is an evolving understanding of the situation, including what is even relevant.

A surprisingly direct operational counterpart is **Creative Problem Solving (CPS)**. Older versions explicitly begin:

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


And each stage has divergence followed by convergence. ([Sage Journals](https://journals.sagepub.com/doi/abs/10.1177/107621758901200522?download=true&utm_source=chatgpt.com "Update: Guidelines for Effective Facilitation of Creative Problem Solving - Roger L. Firestien, Donald J. Treffinger, 1989"))

"Mess" is a useful term here. It deliberately precedes "problem." At the beginning you only know that there is a situation worth attending to. You explore the situation, collect observations, construct possible problems, and only then begin solution generation. This provides a precedent for exploratory inquiry before problem formulation.

Rittel and Webber's **wicked problems** provides a theoretical warning about that sequence. For some problems, there is no definitive problem formulation; understanding the problem depends on ideas about how it might be resolved. Their formulation is stronger: problem formulation and solution conception are intertwined. ([DOI](https://doi.org/10.1007/bf01405730?utm_source=chatgpt.com "Dilemmas in a general theory of planning | Policy Sciences | Springer Nature Link"))

Dorst and Cross later describe essentially this dynamic as **co-evolution of problem and solution spaces**:

```text
problem understanding ←→ possible solutions
```


Exploring a possible solution changes the understanding of the problem; the changed problem suggests different solutions. Their empirical work found this pattern in creative design. ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0142694X01000096?utm_source=chatgpt.com "Creativity in the design process: co-evolution of problem-solution - ScienceDirect"))

This challenges a hard boundary such as:

```text
DISCOVERY → understood problem → DESIGN
```


A better model may allow discovery to continue throughout exploratory making.

There is also an established organizational literature called the **Fuzzy Front End** or **Front End of Innovation**. Its starting condition is an opportunity or raw idea before formal product development. The New Concept Development model structures it around opportunity identification, opportunity analysis, idea generation/enrichment, idea selection, and concept definition, with iteration among these activities rather than a fixed sequence. ([National Academies](https://www.nationalacademies.org/read/10676/chapter/4?utm_source=chatgpt.com "Read \"Reducing the Time from Basic Research to Innovation in the Chemical Sciences: A Workshop Report to the Chemical Sciences Roundtable\" at NAP.edu"))

That tradition provides the concept of a distinct **front end**:

```text
vague opportunity / idea
        ↓
   fuzzy front end
        ↓
sufficiently formed concept
        ↓
formal development
```


This tradition is more management-oriented, with a focus on reaching a viable concept. Exploratory design inquiry emphasizes the epistemic process: how understanding and possibility emerge.

Sanders and Stappers explicitly use the term **front end of design** for **generative design research**. Their focus is bringing people into early exploration so that latent needs, experiences, aspirations, and future possibilities can emerge before the design is established. ([TU Delft Research Portal](https://research.tudelft.nl/en/publications/convivial-toolbox-generative-research-for-the-front-end-of-design/?utm_source=chatgpt.com "Convivial toolbox: Generative research for the front end of design - TU Delft Research Portal")) Related **needfinding** approaches use iterative observation during the early problem space to discover needs and reframe opportunities. ([Design Society](https://www.designsociety.org/publication/46487/needfinding_practice_enhancing_students_problem_framing_skills_through_iterative_observation_for_business_innovation?utm_source=chatgpt.com "Needfinding Practice: Enhancing Students' Problem Framing Skills through Iterative Observation for Business Innovation / Publications / Knowledge Base / The Design Society"))

That family is especially relevant when the initial uncertainty is:

```text
I don't understand the people / context / needs yet.
```


It is less general for exploration of a personal conceptual or technical system, such as a knowledge base.

The Design Council's **Double Diamond** packages the early part more simply as:

```text
Discover              Define
   \                  /
    \                /
     \______________/

diverge             converge
```


Discover is explicitly about understanding the issue instead of assuming the problem; Define synthesizes what was learned into a framing. The current Design Council material also emphasizes that the process is iterative and that early making/testing may occur during discovery. ([Design Council](https://www.designcouncil.org.uk/resources/the-double-diamond/?utm_source=chatgpt.com "The Double Diamond - Design Council"))

It is a useful broad shape, though possibly too coarse to describe the detailed inquiry process.

Another adjacent tradition is **effectuation**. It comes from entrepreneurship under genuine uncertainty, where even the eventual goal may not be known. Instead of choosing a goal and optimizing toward it, you begin with available means--what you know, who you know, what you can do--take affordable actions, encounter contingencies and commitments, and allow goals to emerge. ([Effectuation](https://effectuation.org/research-papers-inception-2011?utm_source=chatgpt.com "Research Papers Inception to 2011"))

That gives a different starting model:

```text
means + vague aspiration
          ↓
        action
          ↓
new knowledge / contingencies
          ↓
new means + possible goals
          ↺
```


This is relevant when exploration begins before a meaningful problem has been formulated.

Finally, **Discovery-Driven Planning** and Lean Startup become useful slightly later. They assume that you can identify assumptions or hypotheses, then organize work around learning about the most important uncertainties. Discovery-Driven Planning explicitly defines success under high uncertainty as maximizing useful learning for minimum expenditure. ([Kellogg School of Management](https://www.kellogg.northwestern.edu/academics-research/research/detail/2008/technical-note-putting-discovery-driven-planning-to-work/?utm_source=chatgpt.com "Putting Discovery-Driven Planning to Work | Kellogg School of Management")) Lean Startup similarly treats validated learning as progress and uses experiments to test assumptions. ([The Lean Startup](https://theleanstartup.com/principles?lang=es&utm_source=chatgpt.com "The Lean Startup | Methodology")) These fit the principle of inexpensive learning, while assuming that something testable can already be formulated.

These approaches form a useful spectrum:

```text
almost nothing is understood
│
│  Schön
│  problematic situation → naming / framing
│
│  CPS
│  mess → data → possible problems
│
│  Rittel / Dorst
│  problem and solution understanding co-evolve
│
│  Generative research / needfinding
│  understand people, context, latent possibilities
│
│  C-K / design-space exploration
│  deliberately expand possible concepts and knowledge
│
│  Front End Innovation
│  opportunity → concepts
│
│  Discovery-Driven / Lean
│  assumptions → experiments → learning
│
▼
sufficiently understood to pursue a direction
```


**Schön, CPS, and co-evolution** are proposed as the main foundations for this model.

They give three complementary ideas:

```text
Schön:
You begin with a situation, not a problem.

CPS:
Early exploration can deliberately move
mess → observations → possible problem framings.

Dorst/Cross:
Don't expect the problem to become fixed;
possible solutions help you understand it.
```


A proposed starting point for the model is:

> The process starts from an **indeterminate situation** and progressively develops **observations, frames, questions, and possibilities**, through exploratory moves and reflection.

And crucially, "progress" can mean discovering _more_ possible framings or questions. It doesn't have to mean reducing uncertainty yet.

## Inquiry example


The whole activity is an **inquiry**. Search is one action within it.

At the very beginning, the person may not yet have a clear "information need." They have some combination of a trigger, partial understanding, curiosity, uncertainty, and context.

A useful conceptualization is:

```text
situation / trigger
        ↓
current inquiry state
  - what I know
  - what I suspect
  - what I'm uncertain about
  - what I'm trying to accomplish
  - what has caught my attention
        ↓
probe
  query, browse, follow a link,
  inspect a note, ask a question...
        ↓
evidence encountered
        ↓
interpretation / sensemaking
        ↓
updated inquiry state
        ↺
```


So `DSL` is a **probe** produced from the person's current inquiry state.

The important part is that the inquiry state can itself change:

```text
"I want to look up DSL"

→ "I want to remember what DSL means"

→ "I have several conflicting ideas about DSL"

→ "I'm actually interested in DSLs as abstraction mechanisms"

→ "How are DSLs different from APIs?"
```


The person isn't necessarily pursuing one fixed information need throughout. The need becomes clearer or changes as they encounter evidence.

The terms can be distinguished as follows:

|Concept|Meaning|
|---|---|
|**Inquiry**|whole evolving activity|
|**Inquiry state**|person's current understanding, uncertainty, goals, questions|
|**Information seeking**|actions taken to improve that state|
|**Search**|retrieval-oriented information-seeking action|
|**Probe**|a particular move: query, filter, browse action, question|
|**Evidence**|material encountered as a result|
|**Sensemaking**|interpreting evidence and changing one's understanding|

For a knowledge system, this gives the following model:

```text
person
  has an inquiry state S₀

S₀
  ↓
probe: "DSL"
  ↓
system presents evidence E₁
  ↓
person interprets E₁
  ↓
new inquiry state S₁
  ↓
next probe
  ↓
...
```


**Inquiry state** is a useful proposed central object because it does not assume that a person already knows their intent, question, or desired answer.

A loose definition is:

```text
InquiryState {
  context
  current_understanding
  uncertainties
  questions
  interests
  goals
  encountered_evidence
}
```


At the very beginning, many of these may be empty or vague.

This suggests an **interactive inquiry system** in which retrieval supports an evolving inquiry and successive queries are interpreted in that context.

## Compact inquiry model


The whole activity is an **inquiry**. Search is one action within it.

At the very beginning, the person may not yet have a clear "information need." They have some combination of a trigger, partial understanding, curiosity, uncertainty, and context.

A useful conceptualization is:

```text
situation / trigger
        ↓
current inquiry state
  - what I know
  - what I suspect
  - what I'm uncertain about
  - what I'm trying to accomplish
  - what has caught my attention
        ↓
probe
  query, browse, follow a link,
  inspect a note, ask a question...
        ↓
evidence encountered
        ↓
interpretation / sensemaking
        ↓
updated inquiry state
        ↺
```


So `DSL` is a **probe** produced from the person's current inquiry state.

The important part is that the inquiry state can itself change:

```text
"I want to look up DSL"

→ "I want to remember what DSL means"

→ "I have several conflicting ideas about DSL"

→ "I'm actually interested in DSLs as abstraction mechanisms"

→ "How are DSLs different from APIs?"
```


The person isn't necessarily pursuing one fixed information need throughout. The need becomes clearer or changes as they encounter evidence.

The terms can be distinguished as follows:

|Concept|Meaning|
|---|---|
|**Inquiry**|whole evolving activity|
|**Inquiry state**|person's current understanding, uncertainty, goals, questions|
|**Information seeking**|actions taken to improve that state|
|**Search**|retrieval-oriented information-seeking action|
|**Probe**|a particular move: query, filter, browse action, question|
|**Evidence**|material encountered as a result|
|**Sensemaking**|interpreting evidence and changing one's understanding|

For a knowledge system, this gives the following model:

```text
person
  has an inquiry state S₀

S₀
  ↓
probe: "DSL"
  ↓
system presents evidence E₁
  ↓
person interprets E₁
  ↓
new inquiry state S₁
  ↓
next probe
  ↓
...
```


**Inquiry state** is a useful proposed central object because it does not assume that a person already knows their intent, question, or desired answer.

A loose definition is:

```text
InquiryState {
  context
  current_understanding
  uncertainties
  questions
  interests
  goals
  encountered_evidence
}
```


At the very beginning, many of these may be empty or vague.

This suggests an **interactive inquiry system** in which retrieval supports an evolving inquiry and successive queries are interpreted in that context.
