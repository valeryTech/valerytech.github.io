---
draft: false
toc: true
title: "Laws of Software Architecture"
description: "Richards and Ford's three laws of software architecture (everything is a trade-off, why matters more than how, decisions sit on a spectrum), with their corollaries, worked examples, and a trade-off procedure built from them."
linkTitle: "Laws of Architecture"
---

**TL;DR:** three statements that Richards and Ford found to hold for every architecture decision. Every option has a cost, so the job is trade-off analysis (first law). The reasoning behind a decision is worth more than its visible structure, so it must be recorded (second law). Options are rarely two opposite choices; the question is where on a spectrum this case falls (third law). [Coupling and Modularity]({{< ref "engineering/architecture/coupling" >}}) applies the same laws to module and service boundaries.

## Where the laws come from


While writing the first edition of *Fundamentals of Software Architecture*, Richards and Ford tried to collect things that are true of software architecture regardless of context. They expected ten or fifteen and found two. The second edition (2025) added a third. Chapter 1 states the laws, and chapter 27 returns to them with worked examples. *Software Architecture: The Hard Parts* (Ford et al. 2022) applies the first law at book length to distributed architectures, starting from the premise that there are no best practices, only trade-offs.

## The laws at a glance


| Law | Statement | What it asks of you | Practice it leads to |
| --- | --- | --- | --- |
| First | Everything in software architecture is a trade-off. | Name the cost of every option, including the one that looks free. | Trade-off analysis: list the factors, compare the options, weight the factors for this context. |
| Second | Why is more important than how. | Keep the reasoning, not only the result. | Architecture decision records (ADRs) and diagrams that carry rationale. |
| Third | Most architecture decisions aren't binary but rather exist on a spectrum between extremes. | Find where this case sits between the extremes. | Answer "it depends" by saying what it depends on. |

## First law: everything is a trade-off

{{< callout context="note" title="First Law" icon="outline/info-circle" >}}
Everything in software architecture is a trade-off.
{{< /callout >}}


**Meaning.** No option has only benefits. The architect's job is not to find a silver bullet but to analyze trade-offs. Richards and Ford add a point about reputation: an architect should be known as an objective judge of trade-offs, not as an evangelist for one approach. Today's best practice tends to become tomorrow's antipattern, and decision makers want sober objectivity more than enthusiasm.

### Corollary 1: the trade-off you haven't found yet


If you think you have found something with no trade-off, you most likely have not identified its trade-off yet. Keep looking.

**Example: code reuse.** Reuse looks purely good: less code to write, less duplication. Two conditions decide whether it pays off, and the second is the one people miss:

1. **Abstraction:** the code can be generalized and used from several call points.
2. **Low volatility:** the code rarely changes. Every change to shared code makes all its callers coordinate, even if only to check that nothing broke.

This is why the most successful reuse targets are "plumbing" (frameworks, libraries, platforms), and why domain code, the part that changes fastest, is a poor reuse target. Domain-driven design's bounded context rule, that no context reuses another's implementation details, rests on the same observation. The orchestration-driven SOA style, built on maximum reuse, showed the cost: every change could ripple unpredictably through the system.

A related point: a system implements reuse through coupling. An organization cannot have both a high degree of decoupling and a high degree of reuse. This is the stability rule in the coupling model: strong coupling is safe only when the shared part has low volatility. See [Coupling and Modularity]({{< ref "engineering/architecture/coupling" >}}#combining-the-dimensions).

### Corollary 2: you can't do it just once


Trade-off analysis is not done once. A decision depends on dozens of variables (complexity, team experience, budget, team topology, schedule pressure), and small differences between situations can tip the result. Teams that tried to set one default for all cases, such as choreography for every distributed workflow, found it worked in some cases and failed badly in others.

Defaults are still useful as a starting point if each one names the condition that should reopen it. See [defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}).

### Worked example: shared library or shared service


Shared behavior in a distributed architecture can be a library compiled into each service or a service that the others call at runtime. The analysis lists the factors that matter for this solution and compares the two options on each:

| Factor | Shared library | Shared service |
| --- | --- | --- |
| Several technology stacks | − one version per stack, kept in sync | + callers only need the network |
| High code volatility | − every consumer must rebuild and redeploy | + callers get the change when the service deploys |
| Versioning | + resolved at compile time | − resolved at runtime |
| Change risk | + checked at compile time | − can break at call time |
| Performance | + in-process call | − network call |
| Fault tolerance | + no network failure | − network failures |
| Scalability | + no latency cost | − latency limits scale |

The library wins on count. That holds only for these factors and this context, because the factors are not equally important. See the [Out of Context antipattern](#out-of-context-antipattern).

### Worked example: queue or topic


A trading service has to send trade information to a notification service and an analytics service.

- **Queue (point to point):** each consumer gets its own queue, and the producer knows every consumer. Pros: messages can differ per consumer, queues can be monitored and scaled separately, and it is harder for another service to listen in. Cons: the producer is coupled to its consumers and must change for each new one.
- **Topic (broadcast):** the producer publishes one message and does not know who subscribes. Pros: low coupling, and new consumers subscribe without anyone else changing. Cons: every consumer gets the same message (stamp coupling), anyone subscribed can read all of it, and consumers cannot be monitored or scaled individually.

The choice comes from the organization's goals. If security matters most, use queues. If the system is growing and more services will want trade data, extensibility wins and topics fit.

## Second law: why is more important than how

{{< callout context="note" title="Second Law" icon="outline/info-circle" >}}
Why is more important than how.
{{< /callout >}}


**Meaning.** An experienced architect can look at an unfamiliar system and work out how it works. Why it was built that way is usually not recoverable from the system, because the decision criteria were not recorded alongside the solution.

Architecture is broader than structure. Richards and Ford define it along four dimensions: the structure (architecture style), the architecture characteristics it must support, the architecture decisions, and the design principles. Only the first is visible in the code. Decisions are made in very specific contexts, and the why includes the trade-offs that were weighed and the options rejected.

**Examples of what is lost without the why:**

- Two services talk through a message broker where a direct call would seem simpler. The how is plain to see. The reason (an unreliable downstream service, or more consumers expected soon) is not. Without it you cannot tell whether the reason still holds, or whether changing the design is safe.
- Richards and Ford once tried to keep the diagrams students produced in architecture katas as an answer key, and gave up. The diagrams showed how each team solved the problem; the trade-offs they had discussed in class were the more interesting half and had not been written down.

**Practice:** every trade-off analysis produces context that does not show up in the solution. Record it, along with the known compromises and limits, in ADRs next to the architecture diagrams, so that future architects (who may be you) do not have to redo the analysis to understand the decision. See [decisions and ADRs]({{< ref "engineering/architecture/architecture" >}}#decisions) and the ADR row in [lifecycle techniques]({{< ref "engineering/architecture/techniques" >}}).

### Out of Context antipattern


The architect knows the trade-offs but does not weight them for the current context. In the shared library example the library has more pluses. A team with code in several languages that cares little about performance or scale should weight the first two factors far above the rest and choose the shared service. As a bonus, the analysis already tells them which drawbacks they will need to mitigate. Generic trade-off analysis is of little use; it becomes valuable when applied to a specific context. *The Hard Parts* calls the same mistake the "out-of-context trap".

## Third law: decisions sit on a spectrum

{{< callout context="note" title="Third Law" icon="outline/info-circle" >}}
Most architecture decisions aren't binary but rather exist on a spectrum between extremes.
{{< /callout >}}


**Meaning.** This law is new in the second edition. It explains why central distinctions in the field are so hard to define cleanly: architecture versus design, orchestration versus choreography, topics versus queues. The criteria behind them are not binary.

**A test for "is this architecture?"** Combined with the first law, the third law gives a working definition: an architecture decision is one where each of the options has significant trade-offs. Architecture versus design is itself a spectrum (strategic versus tactical, the effort involved, how much the trade-offs matter), and the decision's position on it says how much analysis it needs.

**"It depends" is the honest answer,** but you have to go on to say what it depends on and where this case falls. Architects decide with incomplete information, and many decisions would not be clear-cut even with complete information, because the answer lies somewhere between two extremes.

Coupling is a good illustration. "Coupled or decoupled" is a false binary; coupling varies in how much knowledge is shared, how far it travels, and how often it changes. See [Coupling and Modularity]({{< ref "engineering/architecture/coupling" >}}#the-three-dimensions).

## How the laws fit together


- The **first law** says every option has a cost, so you have to analyze. **Corollary 1** says to keep looking until you find the cost. **Corollary 2** says to repeat the analysis when the situation changes.
- The **second law** says the analysis is the valuable part, so you keep it, and the Out of Context antipattern says it is only valid with its context attached.
- The **third law** says the analysis places you somewhere on a spectrum, not at one of two poles.

Two principles from the same books follow from the laws:

- **Least worst architecture:** never aim for the best architecture; aim for the least worst. Supporting each architecture characteristic costs design and implementation effort, and characteristics interact. Richards and Ford compare it to flying a helicopter, where moving one control affects all the others. A design that tries to maximize everything becomes generic and unwieldy. See [Architectural Characteristics]({{< ref "engineering/architecture/characteristics" >}}).
- **Make the architecture easy to change:** the easier it is to change the architecture, the less the first decision has to be right. Iteration applies to architecture too. See [Changeability]({{< ref "engineering/architecture/changeability" >}}) and the ETC principle in the [toolbox]({{< ref "engineering/architecture/toolbox" >}}#the-essence-of-good-design-etc).

## Using the laws: a trade-off procedure


*The Hard Parts* gives three steps, built on the plainest definition of coupling (two parts are coupled if a change in one might cause a change in the other):

1. **Untangle:** find which parts of the problem are entangled with each other.
2. **Analyze the coupling:** find how they are coupled, both statically (how they are wired and what they depend on) and dynamically (how they call each other at runtime).
3. **Assess the trade-offs:** judge each option by the impact of change on the parts that depend on each other.

Chapter 27 of *Fundamentals* adds the mechanics:

4. List the factors that matter for this organization and solution: platforms, team skills, budget, volatility, operational needs.
5. Compare the options on each factor (a +/− matrix like the one above).
6. Weight the factors for the current context.
7. Decide, record the why and the known compromises in an ADR, and note what would make you revisit the decision.

*The Hard Parts* (chapter 15) lists further techniques:

- choose between qualitative and quantitative analysis;
- build MECE lists (mutually exclusive, collectively exhaustive) so that the options compared are really comparable;
- avoid the out-of-context trap;
- model relevant domain cases, testing each option against concrete scenarios;
- give decision makers the bottom line rather than an overwhelming pile of evidence;
- avoid snake oil and evangelism.

**Quick questions for any decision:**

- What does each option cost? If I cannot name a cost, I have not looked hard enough.
- Which factors matter most here, and why?
- Where on the spectrum does this case sit?
- Have I written down the why, and what would change my mind?

## Related


- [Coupling and Modularity]({{< ref "engineering/architecture/coupling" >}}): the laws applied to module and service boundaries.
- [Architecture Toolbox]({{< ref "engineering/architecture/toolbox" >}}): other heuristics and principles.
- [Architectural Characteristics]({{< ref "engineering/architecture/characteristics" >}}): the qualities being traded off.
- [Software Architecture]({{< ref "engineering/architecture/architecture" >}}#decisions): decisions and ADRs.
- [Architecture style and service boundaries]({{< ref "system-design/elements/boundaries" >}}): a design question where these trade-offs come up constantly.

## Library sources


- [Richards and Ford 2025](/sources/2d49b5a0c9a1eb1beeb05703a3d3d23e.bin), *Fundamentals of Software Architecture, 2nd Edition* -- chapter 1 (the laws stated), chapter 27 (the laws revisited, with the worked examples above), chapter 4 (least worst architecture)
- [Ford et al. 2022](/sources/08f60e529d971e5ad6408c46accea44c.bin), *Software Architecture: The Hard Parts* -- chapters 1-2 (no best practices; the three-step trade-off analysis), chapter 15 (trade-off techniques)

Further reading:

- Gandhi et al. 2024, *Head First Software Architecture* -- a teaching-oriented version of the first two laws
- [Khononov 2025](/sources/d01916d843bdf15a2ab54159c7c865bf.bin), *Balancing Coupling in Software Design* -- trade-off analysis for coupling; see [Coupling and Modularity]({{< ref "engineering/architecture/coupling" >}})
