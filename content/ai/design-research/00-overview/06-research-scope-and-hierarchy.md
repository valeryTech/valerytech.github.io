---
draft: false
toc: true
description: "Distinguishes a general theory of guarantee-preserving composition, a method for deriving semantic boundaries, and separate investigation, behavioral-compilation, and human-collaboration research tracks."
title: "06 Research Scope And Hierarchy"
linkTitle: "06 Research Scope And Hierarchy"
---
# Research scope and hierarchy


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Scope and status


The collection separates a general theory, a builder method, and applications. The retained dialogue below proposes the distinction, and the note set now uses it for navigation. The distinction does not establish a theorem, select an implementation, or choose the first experiment.

| Level | Question | Main notes |
|---|---|---|
| General theory | Which constraints and composition rules preserve chosen guarantees when independently developed components are combined? | [Constrained generativity]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) and [constraint, guarantee, and composition models]({{< ref "ai/design-research/01-foundations/07-constraint-guarantee-and-composition-models" >}}). |
| Builder method | How can a builder derive suitable boundaries, contracts, and enforcement from desired properties? | [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}). |
| Applications | How can the theory and method inform a particular system or task? | [Participant-neutral system model]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}), [investigation language and algebra]({{< ref "ai/design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra" >}}), and [behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}). |

Shared state, runtime enforcement, authority, provenance, and open workflows are possible choices for an application. The [critique of the earlier question]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}#3-the-second-problem-framing-is-currently-too-solution-shaped) explains why they need not be requirements of the general theory.

The formal models explore which constraints imply which guarantees. The builder method explores how to use the relationship when designing a system.

## Proposed research tracks


The application dialogues propose different questions, which need separate hypotheses and evaluation plans.

- The investigation track asks whether executable evidence contracts improve coverage, provenance, conflict handling, and abstention. The [research-direction dialogue]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) recommends it as a first paper, but the recommendation remains a proposal.
- The behavioral-compilation track asks whether provisional model-generated examples can help produce executable programs that satisfy an independently checked contract. The [specification dialogue]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) distinguishes solving one instance from learning a reusable procedure.
- The human-collaboration track asks how people and software can develop and inspect shared representations. [Sensemaking and epistemic action]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}) allows better understanding to be the result, without requiring an external action.

The tracks can share infrastructure without sharing a hypothesis or a required sequence. No first experiment is selected by the reassembly.

## Development of the question


The links distinguish the stages of the argument, rather than treating every recommendation as a current requirement.

1. The [original prompt]({{< ref "ai/design-research/00-overview/01-problem-framing" >}}) asks how to frame collaboration among people, models, and software.
2. The [architectural framings]({{< ref "ai/design-research/00-overview/04-architectural-framings" >}}) and [participant-neutral model]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) explore possible system designs.
3. [Constrained generativity]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}#another) broadens the discussion beyond agent architectures.
4. The [refined-question note]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) preserves the earlier environment question alongside the later critique of its assumptions.
5. The retained scope dialogue below proposes the general theory, builder method, and application hierarchy. Its original sections 2 and 4 remain in the [builder-method note]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#builder-questions-and-examples-from-the-dialogue), and section 3 remains in the refined-question note.

LLM recommendations, literature summaries, formal claims, and experimental plans remain proposals or source material unless separately verified. Rearranging the notes does not verify their external claims.

<a id="retained-scope-dialogue"></a>

## Scope proposal


The following argument was moved from the end of the constrained-generativity note. The original `[another](#another)` reference points back to the [broader-principle discussion]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}#another). The original `[Problem Framing]({{< ref "ai/architecture-dsl-like/dsl-approach/problem-framing" >}})` reference concerns the [framing prompt]({{< ref "ai/design-research/00-overview/01-problem-framing" >}}) and the architecture developed from it.

## analyse problem


Scope question: Analyze the problem formulations in [Problem Framing]({{< ref "ai/architecture-dsl-like/dsl-approach/problem-framing" >}}) and [another](#another).

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The working interpretation is that the material becomes stronger if you separate three things that are currently mixed together:

1. a general theory of how systems become composable,
2. a method builders can use to design a substrate,
3. one concrete architecture for human/LLM/software collaboration.

The first file is close to (1). The second file jumps fairly quickly to (3).

<a id="1-your-core-research-object-should-be-the-construction-rule"></a>

### 1. The construction rule as the proposed core research object


The strongest part of the first note is:

> constrain -> strengthen -> compose -> generate

A substrate removes some possible behaviors; that allows stronger invariants; components can then rely on those invariants; valid compositions can produce structures the substrate designer didn't anticipate.

There is an important mathematical shape underneath it. Suppose the unconstrained behavior space is \(B\). A builder introduces constraints \(C\), producing:

\[B_C = \{b \in B \mid C(b)\}\]

If every remaining behavior satisfies some property \(G\):

\[\forall b \in B_C:\ G(b)\]

then the constraint has bought the builder a guarantee.

But this alone isn't enough. The central concern is composition. You need something like:

\[A \models C,\quad B \models C\]

and under some composition operator \(\otimes\):

\[A \otimes B \models G\]

Ideally this keeps working for components that didn't exist when the substrate was designed.

That is where the first note's observation about Unix becomes important: the interesting property isn't simply that individual programs obey an interface; arbitrary future programs can participate if they obey the same interface.

So the working interpretation is that the fundamental design problem is:

> **What is the smallest set of constraints under which the guarantees we care about are preserved under open-ended composition?**

That's almost exactly where the earlier document eventually arrives with its question about the "smallest semantic discipline" that permits reliable and unknown higher-order systems.

That should probably become the center.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The intervening passages are now in the [builder questions]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#2-this-changes-what-you-give-builders), the [critique of the earlier question]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}#3-the-second-problem-framing-is-currently-too-solution-shaped), and the [complete comparison of three builders]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#4-start-from-guarantees-then-derive-constraints). The dialogue continues below with the relation between constraints and guarantees.

### 5. The theory needs a relation between constraints and guarantees


This part is proposed for further development.

The first file correctly says that reducing behavior space makes stronger invariants possible.

For builders, though, you need to make that actionable:

\[
\text{Constraints}

\longrightarrow

\text{Guarantees}

\longrightarrow

\text{Composition properties}
\]

And ideally also solve the inverse problem:

\[
\text{Desired guarantees}

\longrightarrow

\text{required constraints?}
\]

That second direction is much more valuable as a design theory.

A builder says:

> I want independently developed components to be safely replaceable.

The proposed theory might derive requirements such as explicit contracts, limited observable effects, and compatible input/output semantics.

Or:

> I want arbitrary generators to participate, but only authorized actions to affect the external world.

That leads naturally toward proposal/commit separation and capability-controlled effects.

This gives you a design optimization problem:

\[\max \text{generativity}(C)\]

subject to:

\[C \models G_{\text{required}}\]

In plain terms:

> **Impose as little semantic discipline as possible while still obtaining the guarantees the system needs.**

That is stronger than simply saying "constraints are good." Excess constraints destroy generativity too.

<a id="6-i-would-therefore-reframe-the-research-question"></a>

### 6. Proposed reframing of the research question


My current broad version would be:

> **How can builders define the minimal semantic constraints and composition rules of a computational substrate so that independently developed components can be combined into systems whose chosen guarantees are preserved under composition, including compositions the substrate designer did not anticipate?**

Then the human/LLM/software question becomes a major application:

> **What semantic substrate is sufficient for humans, generative models, and deterministic software to construct and modify shared computational systems while preserving chosen guarantees about state, effects, authority, provenance, and coordination?**

Notice the change in order.

The earlier version starts with the architecture:

```text
participants
shared state
authority
effects
provenance
runtime
```


The revised version starts with:

```text
desired guarantees
       ↓
minimal constraints
       ↓
composition laws
       ↓
semantic substrate
       ↓
possible architectures
```


That is much closer to giving builders a **theory for creating systems**.

And it gives you a clean hierarchy of terms:

**Constrained generativity** -- the general principle: restricting local behavior can create greater system-level generativity.

**Semantic substrate design** -- the engineering discipline: choosing boundaries, constraints, guarantees, and composition rules.

**Constraint-guarantee theory** -- the formal part: determining which constraints imply which guarantees and which guarantees survive composition.

**Human/AI programmable environment** -- one system family built using the theory.

The proposal is to develop the work in that order. The participant-neutral shared runtime from the second file then becomes a strong worked example, not the definition of the problem.
