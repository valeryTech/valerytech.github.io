---
draft: false
toc: true
description: "Compares Unix composition, trusted kernels, organizations, generative search, feedback control, and compilers as complementary ways to frame systems combining people, models, and software."
title: "04 Architectural Framings"
linkTitle: "04 Architectural Framings"
---
# Architectural framings


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The retained LLM response explores possible framings for the [original prompt]({{< ref "ai/design-research/00-overview/01-problem-framing" >}}). The alternatives concern a family of collaborative systems, while the [research-scope note]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) separates that application from the general theory and builder method.

<a id="retained-response"></a>

## Proposed framing


There are several useful ways to reason about such a system.

1. **Unix / compositional programming.** Build a small set of useful components with strict interfaces and let complicated behavior emerge from composition. The earlier notes already reached the useful formulation: "small vocabulary + strong semantics + unrestricted valid composition." The graph is a consequence of composition; it doesn't have to be the user's fundamental mental model.

    The Unix "thin waist" shouldn't be bytes, though. It could be typed artifacts:

```text
    Task
    Observation
    Proposal
    Plan
    Evidence
    Decision
    Action
    Result
    Approval
    Memory
```


    plus streams/collections of them.

    Then:

```text
    observe
    | generate_hypotheses
    | evaluate
    | ask_human
    | act
    | verify
```


    is as natural conceptually as a Unix pipeline.
2. **Operating-system / kernel framing.** This becomes particularly useful once components can cause consequences. The "kernel" owns the things no participant gets to improvise: committed state, identity, capabilities, permissions, resource accounting, external effects, durability, provenance, and perhaps temporal obligations. The sources already move in this direction: neural components propose and interpret, while the symbolic runtime owns control, permissions, state, lineage, resources, and verification.

    So an LLM might say:

```text
    proposed:
        refund($700)
```


    while the environment determines:

```text
    identity verified?
    policy permits refund?
    actor has financial capability?
    approval required?
    budget available?
```


    This is a stronger boundary than "neural vs symbolic." It is essentially **untrusted/creative computation inside a trusted execution environment**.
3. **Organization / multi-agent framing.** This may be the best way to think about augmentation of human work.

    A company doesn't consist of one intelligence. It consists of people, software systems, documents, processes, authorities, and shared institutional state.

    Likewise:

```text
                          Shared state

                 tasks / artifacts / decisions
                          /    |    \
                         /     |     \
                     Human    LLM   Service
                     expert   agent  / tool
```


    Participants have different roles and authority.

    One creates a proposal. Another critiques it. Another supplies data. A person approves a consequential decision. Another component executes it.

    The blackboard/shared-state idea in the sources maps directly onto this: agents collaborate by publishing typed artifacts to shared state, rather than depending on long chains of free-form agent-to-agent conversation.
4. **Generative search framing.** The working interpretation is that this incorporates the author's observation about LLMs better than simply calling them "probabilistic."

    An LLM is often useful because it can expand the space of possibilities:

```text
    current situation
           ↓
         generate
           ↓
    hypothesis A
    hypothesis B
    hypothesis C
    possible plan D
    alternative framing E
    imagined future F
```


    Then other machinery can:

```text
    constrain
    compare
    simulate
    test
    verify
    rank
    ask a human
    execute
```


    So one fundamental primitive might be:

```text
    propose<T> :
        Context → Candidate<T>*
```


    rather than:

```text
    model :
        Input → Answer
```


    This is a meaningful conceptual change. The model isn't merely a noisy implementation of a deterministic function. **Generating useful possibilities is itself part of the computation.**
5. **Control-system framing.** For open-ended work, we often shouldn't prescribe the entire workflow in advance.

    Instead:

```text
    observe
       ↓
    propose
       ↓
    constrain / select
       ↓
    act
       ↓
    observe consequence
       ↓
    verify
       ↓
    continue / repair / replan
```


    The sources already identify `propose -> execute -> observe -> verify -> repair` as a generic loop across research, coding, operations, and support.

    This is useful because "task" can mean a desired condition or set of constraints, while the actual path remains adaptive.
6. **Programming-language / compiler framing.** This is what makes the above manageable rather than turning into an agent free-for-all.

    You can let humans and models construct programs freely, while the compiler/runtime restricts the admissible computation:

```text
    generated / human-written program
               ↓
           type checks
           effect checks
           capability checks
           policy checks
           obligation checks
               ↓
        executable program
```


    That is where neuro-symbolic representation fits: symbolic structures give us a machine-readable program/state/contract; neural components can generate and manipulate that structure. The runtime can then lower the logical program into Petri nets, dataflow, durable workflows, SQL, model calls, tools, humans, etc. The sources already propose exactly this layered separation.
