---
draft: false
toc: true
description: "Develops the proposed principle that restricting observable behavior creates trustworthy boundaries and local reasoning, enabling open-ended composition across networking, programming, databases, and collaborative systems."
title: "01 Constrained Generativity"
linkTitle: "01 Constrained Generativity"
---
# Constrained generativity


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The retained dialogue develops the general principle, construction rules, and examples. The opening discussion and historical survey are in [Architectural least commitment and precedents]({{< ref "ai/design-research/01-foundations/06-architectural-least-commitment-and-precedents" >}}). The later [scope dialogue and revised research question]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}#analyse-problem) are now in the overview.

## another


Author scope correction: The question extends beyond agent architectures to a broader principle. For example, the author recalls Kleppmann describing in DDIA how a layer over unreliable components could provide guarantees.

Additional research question: How does the Unix approach structure a design space by constraining components while allowing participants to build more powerful structures? Whether "space" is the right term remains open.

Related examples: Higher-level programming languages introduce constraints, such as removing go to, and immutability introduces another restriction. Could these constraints support more powerful and complex systems?

TODO: Clarify the original `XXX` marker; no further text is recorded here.

This is broader than architectural least commitment. The proposed common pattern is: **remove degrees of freedom at a lower layer so that stronger guarantees and richer composition become possible at a higher layer**. The analysis compares DDIA/distributed systems, Unix, structured programming, types/immutability, and protocol design, then proposes a name for the general stance.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The working interpretation is that the concept is broader than "architectural least commitment." The recurring pattern across the examples in the research notes is:

> **We deliberately reduce freedom at one level in order to obtain stronger guarantees, better local reasoning, and greater compositional freedom at the next level.**

There isn't one standard CS term covering the whole pattern. It appears repeatedly under abstraction, fault tolerance, structured programming, compositionality, type safety, declarative programming, and the principle of least power.

Provisional names: **constrained generativity** for the general stance, and **semantic substrate design** for the engineering approach.

The important part is what "constraint" means here.

A raw substrate usually admits a very large set of possible behaviors:

```text
raw components
────────────────────────────
loss
reordering
mutation
arbitrary jumps
arbitrary effects
hidden coupling
invalid states
unknown execution strategy
...
```


A layer deliberately removes or masks possibilities:

```text
              abstraction / discipline
                        ↓
        ┌──────────────────────────┐
        │ allowed behavior         │
        │ invariants               │
        │ composition rules        │
        │ observable guarantees    │
        └──────────────────────────┘
```


The space visible to the builder is now **smaller**, but much easier to compose.

And that can make the space of useful systems built above it much larger.

### DDIA is exactly one instance


Kleppmann describes distributed algorithms as taking unreliable communication and building stronger guarantees on top of it. ([Martin Kleppmann's Website](https://martin.kleppmann.com/2022/10/12/verifying-distributed-systems-isabelle.html?utm_source=chatgpt.com "Verifying distributed systems with Isabelle/HOL -- Martin Kleppmann's blog")) TCP is the canonical concrete example: IP datagrams are the underlying mechanism, while TCP presents applications with a reliable, ordered byte stream. ([IETF](https://www.ietf.org/rfc/rfc9293.pdf?utm_source=chatgpt.com "RFC 9293: Transmission Control Protocol (TCP)"))

So the transformation is approximately:

```text
messy behavior space
──────────────────────
lost
duplicated
reordered
delayed packets

        ↓ protocol

smaller abstract behavior space
────────────────────────────────
ordered reliable byte stream
```


The application gets **less information and less freedom** regarding what the network actually does.

That loss is enormously valuable.

The application can now reason in terms of:

```text
read(bytes)
write(bytes)
```


instead of implementing loss recovery, ordering, duplicate elimination, etc. everywhere.

So this isn't merely abstraction as hiding complexity. The abstraction establishes a **stronger semantic world** than the components themselves provide.

The proposal is to call that part **semantic strengthening** or **guarantee amplification**.

### Structured programming is the same shape from the other direction


Dijkstra's argument wasn't basically "goto syntax is ugly."

He argued that rigid sequencing disciplines were needed so we could make statements about program execution from the structure of the program. ([UT Austin Computer Science](https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD268.html?utm_source=chatgpt.com "E.W. Dijkstra Archive: Structured programming (EWD268)")) His broader concern was finding the subclass of programs that are intellectually manageable and whose correctness can be established compositionally. ([UT Austin Computer Science](https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD288.html?utm_source=chatgpt.com "E.W.Dijkstra Archive: Concern for Correctness as a Guiding Principle for Program Composition. (EWD 288)"))

Consider:

```text
unrestricted control flow

anywhere ───────► anywhere
   ▲                │
   └────────────────┘
```


You have maximum local freedom.

Remove arbitrary `goto`, and you get:

```text
sequence
if
while
function call
return
```


That's a smaller language of control-flow structures.

But now:

```text
function {
    ...
}
```


becomes a meaningful boundary.

Nathaniel Smith makes exactly this connection in his structured-concurrency analysis: unrestricted spawning breaks the ability to treat functions as black boxes with respect to control flow; structured concurrency restricts task lifetimes and restores local reasoning, resource cleanup and error propagation. ([Vorpus](https://vorpus.org/blog/notes-on-structured-concurrency-or-go-statement-considered-harmful/?utm_source=chatgpt.com "Notes on structured concurrency, or: Go statement considered harmful -- njs blog"))

This is a very important formulation for this research direction:

> **The purpose of the constraint is to make boundaries trustworthy.**

If I know what can cross a boundary, I don't need to understand everything behind it.

That is what makes composition scale.

### Immutability is another instance


With arbitrary shared mutation:

```text
A ──write──► X
B ──write──► X
C ──read───► X
D ──write──► X
```


the meaning of `X` depends on potentially arbitrary interaction history.

Remove mutation from some part of the system:

```text
x = value
f(x) = y
g(y) = z
```


You have removed a large class of programs you could have written.

But you've gained substitution, caching, parallel evaluation, deterministic replay, easier testing, and algebraic reasoning.

Backus's 1978 Turing lecture is especially relevant here. His goal was to replace a very permissive state-transition style with combining forms possessing useful algebraic laws, specifically so that high-level programs could be composed into still higher-level programs and reasoned about mathematically. ([IBM Research](https://research.ibm.com/publications/can-programming-be-liberated-from-the-von-neumann-style-a-functional-style-and-its-algebra-of-programs?utm_source=chatgpt.com "Can Programming Be Liberated from the von Neumann Style? A Functional Style and Its Algebra of Programs for CACM - IBM Research"))

His argument is surprisingly close to the proposed principle:

```text
more primitive freedom
        ↓ restrict
more regular semantics
        ↓
strong combining laws
        ↓
larger comprehensible structures
```

### Unix adds another piece: closure under composition


Unix doesn't give every program every possible interaction mechanism.

It strongly encourages:

```text
stdin → program → stdout
```


and programs that don't care who produced their input or who consumes their output.

McIlroy's original principle explicitly says to expect a program's output to become the input of another, **as yet unknown**, program. ([Textbook of Linux](https://www.textbookoflinux.com/references/mcilroy1978.html?utm_source=chatgpt.com "M. Douglas McIlroy, Elliot N. Pinson, & Berkley A. Tague (1978) -- References -- Textbook of Linux")) Kleppmann points out that the shell performs the wiring, leaving individual tools loosely coupled and ignorant of their neighbors. ([Martin Kleppmann's Website](https://martin.kleppmann.com/2015/08/05/kafka-samza-unix-philosophy-distributed-data.html?utm_source=chatgpt.com "Kafka, Samza, and the Unix philosophy of distributed data -- Martin Kleppmann's blog"))

This gives us something beyond constraint:

**closure/compositionality.**

If:

```text
A : Stream → Stream
B : Stream → Stream
C : Stream → Stream
```


then:

```text
A | B | C
```


is automatically meaningful at the structural level.

And importantly:

```text
A | X | B
```


can include some future `X` that neither A nor B's authors knew would exist.

This is where the author's "we don't know what we don't know" premise becomes technically precise.

You aren't trying to anticipate `X`.

The boundary is designed so that unknown `X`s can participate.

### Relational databases may be an even better analogy


Codd's relational model deliberately protects users from physical representation; applications should continue working when storage representations and access paths change. ([DOI](https://doi.org/10.1145/362384.362685?utm_source=chatgpt.com "A relational model of data for large shared data banks | Communications of the ACM"))

A declarative query gives up the ability to prescribe:

```text
scan this index
then nested-loop here
then sort this buffer
...
```


and says approximately:

```text
I want this relation.
```


That restriction buys the database the freedom to choose a physical execution plan. Modern query optimizers can choose among physically different plans that have the same logical semantics. ([Springer](https://link.springer.com/article/10.1007/s00778-021-00676-3?utm_source=chatgpt.com "Data dependencies for query optimization: a survey | The VLDB Journal | Springer Nature Link"))

So:

```text
             USER
               │
       constrained logical
          description
               │
──────── semantic boundary ────────
               │
       arbitrary valid physical
          implementation
               │
             SYSTEM
```


Notice the inversion:

**Constraining the user above the line increases the implementation freedom below the line.**

Unix does something related:

**Constraining component interfaces increases composition freedom around them.**

Types do it too:

**Constraining individual programs increases the guarantees available to programs that consume them.**

Fault-tolerant layers:

**Constraining observable failure behavior gives applications a stronger world to build upon.**

These are manifestations of the same design move.

### The established idea closest to the general principle


Tim Berners-Lee's **Principle of Least Power** is very relevant:

> choose the least powerful language suitable for the task.

The W3C's argument is that unrestricted expressive power can make information harder to analyze, reuse and transform; deliberately weaker languages expose more structure to other machinery. ([W3C](https://www.w3.org/2001/tag/doc/leastPower-2006-01-23.html?utm_source=chatgpt.com "The Principle of Least Power"))

That's one axis of the proposed principle.

But "least power" doesn't capture DDIA well, because TCP isn't primarily restricting the expressive power of its clients. And it doesn't fully capture Unix, where the key issue is a common composition boundary.

So the recommendation is not to use it as the umbrella term.

<a id="i-think-there-are-three-operations-underneath-your-idea"></a>

### Three proposed underlying operations


The proposal is to formulate the general theory around these:

```text
1. CONSTRAIN

Reduce the set of admissible behaviors/interactions.

        ↓

2. STRENGTHEN

Because fewer behaviors are admissible,
stronger invariants can be promised.

        ↓

3. COMPOSE

Because components can rely on those invariants,
they can be combined without knowing their internals.

        ↓

4. GENERATE

Because valid compositions remain valid,
builders can construct structures the substrate
designer did not anticipate.
```


Or mathematically, if the raw behavior space is:

```text
B
```


the substrate establishes some admissible subset:

```text
B_valid ⊂ B
```


with an invariant:

```text
∀ b ∈ B_valid : I(b)
```


Now everything above the boundary can assume `I`.

That reduces the number of possibilities each higher-level component must consider.

And that reduction compounds.

This is why constraints can produce **more effective expressive power at system scale**, even though they reduce primitive expressive power locally.

### There is a fourth idea: local reasoning


The working interpretation is that this may actually be the key property.

The common enemy in all of these examples is **global knowledge**.

Without TCP:

> every application needs to understand network failures.

Without structured control flow:

> understanding a function may require following arbitrary jumps.

Without immutability:

> understanding a value may require knowing every potential writer.

Without types:

> understanding an operation may require knowing every runtime value that could arrive.

Without Unix-style boundaries:

> understanding a tool may require knowing its neighbors.

Without transactions:

> understanding an operation may require reasoning about arbitrary intermediate states and interleavings.

The constraints make it possible to say:

> **I can reason about this component using its boundary contract and the relevant local state.**

Dijkstra explicitly connects structure and abstraction to keeping the required amount of reasoning manageable. ([UT Austin Computer Science](https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD288.html?utm_source=chatgpt.com "E.W.Dijkstra Archive: Concern for Correctness as a Guiding Principle for Program Composition. (EWD 288)"))

That's probably more fundamental than "simplicity."

### Then comes generativity


There is an adjacent literature that actually uses **generativity** for systems designed so that people can create unanticipated extensions.

Zittrain defines generativity as a system's capacity for unanticipated change through contributions from varied participants. ([Yupnet](https://yupnet.org/zittrain/2008/03/01/chapter-4-the-generative-pattern/?utm_source=chatgpt.com "The Future of the Internet--And How to Stop It » Chapter 4: The Generative Pattern")) A systematic review of generative architectures describes them as being **designed for incompleteness**, with the whole system not knowable in advance; stable rules and boundary resources coexist with decentralized extension. ([Wiley Online Library](https://onlinelibrary.wiley.com/doi/full/10.1111/ijmr.12277?utm_source=chatgpt.com "Generativity: A systematic review and conceptual framework - Thomas - 2022 - International Journal of Management Reviews - Wiley Online Library"))

That gets quite close to your "we don't know what we don't know."

But the proposed principle adds something important to generativity:

> **Generativity comes from disciplined boundaries, not merely openness.**

An interface with no constraints isn't necessarily generative. It may simply be impossible to reason about.

So the working interpretation is that **constrained generativity** is a good term for the broad stance, provided you define it.

The proposal is to formulate it like this:

> **Constrained generativity is the design principle of deliberately restricting the behavior visible at a system boundary so that the boundary can provide stable invariants, local reasoning, and composition, while leaving the structures built from those constrained parts open-ended.**

And the engineering method:

> **Semantic substrate design:** identify the smallest shared semantics that make independently developed components safely composable, enforce those semantics at the boundary, and leave higher-order organization unspecified.

That is broader than the agent-focused research.

It applies to:

|System|What is constrained|What becomes possible|
|---|---|---|
|TCP|observable packet behavior|applications assume ordered reliable streams|
|transactions|visibility of partial/interleaved operations|atomic business operations|
|structured programming|arbitrary control transfer|compositional control flow|
|structured concurrency|arbitrary task lifetime|local lifetime/error reasoning|
|types|admissible programs/values|static guarantees|
|immutability|state transitions|equational/local reasoning|
|relational model|physical access specification|data independence + optimization|
|Unix|component interaction boundary|arbitrary pipelines of unknown tools|
|capability systems|possible authority|safe delegation/composition|
|your substrate|state transitions/effects/authority/provenance|unknown future human/model/software organizations|

So the proposal is to revise the stance we've been developing.

**Architectural least commitment** becomes a consequence of a more general principle:

> **Constrain semantics, leave structure generative.**

Or in fuller academic form:

> **Do not attempt to enumerate the complex systems that should exist above the substrate. Identify the constraints that make their components locally understandable and safely composable; enforce those constraints, and allow higher-order structures to emerge through unrestricted valid composition.**

That formulation connects DDIA, Dijkstra, Unix, functional programming, relational databases, and the heterogeneous-participant system proposal much better than an agent-specific framing does.

And it gives the author's research a deeper question:

> **What is the smallest semantic discipline that turns unconstrained heterogeneous computation into a space of components from which reliable, comprehensible, and presently unknown higher-order systems can be constructed?**

The working interpretation is that that's closer to the proposed foundational direction.

## isolated - from 0


There is a coherent idea here, although there isn't one canonical name that covers all of the examples in the research notes.

The proposal is to call the general principle **power through constraint**, or more technically **constraint-induced compositionality**.

The core idea is:

> By reducing the behavior space of lower-level components, we can establish stronger invariants. Those invariants make components easier to reason about and compose, which lets us build systems with stronger guarantees and greater complexity.

There are several established concepts underneath this.

In formal methods, the closest concept is **refinement**. A specification can be viewed as a set of allowed behaviors. A stronger specification allows fewer behaviors. An implementation refines a specification when its observable behaviors fall within the behaviors permitted by that specification. This gives you a precise version of "constraints -> guarantees." ([eCommons](https://ecommons.cornell.edu/bitstreams/f2c57ea0-1b95-4b32-9a68-48ae2ee83c3d/download?utm_source=chatgpt.com "QUANTIFICATION AND FORMALIZATION OF"))

So, schematically:

```text
large behavior space
        ↓ constrain / mask / normalize
smaller behavior space
        ↓ therefore
stronger invariants
        ↓ therefore
simpler reasoning
        ↓ therefore
more reliable composition
        ↓
more complex higher-level systems
```


The examples in the research notes fit this quite closely.

With distributed systems:

```text
unreliable machines/network
        ↓
replication + retries + protocols + consensus
        ↓
"this behaves like one reliable register/log/database"
        ↓
applications can ignore many lower-level failure modes
```


The lower layer has many possible behaviors: dropped packets, crashes, reorderings, duplicate delivery, etc. The abstraction layer hides or eliminates some of those observable behaviors and exposes a stronger contract.

With Unix, the restriction is mostly at the **interface**. A tool agrees to communicate through a small, uniform interface such as `stdin`/`stdout`. That gives an individual program fewer ways of interacting with its environment, but it gives the system far more opportunities for composition. Kleppmann explicitly identifies the uniform Unix interface as the reason arbitrary tools can be piped together. ([Martin Kleppmann's Website](https://martin.kleppmann.com/2015/08/05/kafka-samza-unix-philosophy-distributed-data.html?utm_source=chatgpt.com "Kafka, Samza, and the Unix philosophy of distributed data -- Martin Kleppmann's blog"))

So there's a useful apparent paradox:

> **Local expressive power is sacrificed to gain global compositional power.**

That also describes structured programming. `goto` gives a programmer more possible control-flow graphs. Removing unrestricted `goto` reduces that space, making program execution easier to understand and reason about; that was central to Dijkstra's argument. ([UT Austin Computer Science](https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD215.html?utm_source=chatgpt.com "E.W. Dijkstra Archive: A Case against the GO TO Statement. (EWD215)"))

Immutability does the same thing to state:

```text
mutable state:
many possible state transitions

immutable values:
far fewer possible interactions

→ stronger assumptions
→ local reasoning
→ safe sharing/composition
```


And declarative languages provide an especially clear example. SQL gives you less control over _how_ a query executes. Because you surrender that freedom, the database gains freedom to reorder joins, select indexes, parallelize execution, etc. This is closely related to the W3C's established **Rule of Least Power**: use the least powerful language sufficient for the job, because restricting expressiveness can make information easier to analyze and reuse. ([W3C](https://www.w3.org/2001/tag/doc/leastPower?utm_source=chatgpt.com "The Rule of Least Power"))

The working interpretation is that the deepest formulation of the proposed principle is therefore:

> **Constraint trades local freedom for global structure.**
>
> We deliberately restrict the possible behaviors of components or participants. The reduced behavior space gives us invariants. Those invariants enable independent reasoning and predictable composition. Composition then lets us construct systems whose capabilities or guarantees exceed those of the individual components.

If you're naming this for an essay/note, the proposal is to use **"Power Through Constraint: How Restricting Behavior Enables Composition"**.

A CS-specific proposed name is **"Constraint, Invariants, and Compositionality."**

The most formal proposed framing is:

**behavior-space restriction -> stronger contracts -> compositional reasoning -> abstraction/refinement.**

That last chain is probably the closest technical formulation of the unresolved `XXX` concept in the original question.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Continued scope analysis


The next user prompt and the LLM's scope analysis are now in [Research scope and hierarchy]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}#analyse-problem). The dialogue proposes a general theory, a builder method, and a collaborative-system application. The original prompt, construction-rule argument, inverse design problem, and final proposed question remain together there.
