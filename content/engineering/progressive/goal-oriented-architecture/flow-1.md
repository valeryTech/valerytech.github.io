---
draft: false
toc: true
description: "Research notes on how user goals and workflows can ground architectural responsibilities and provide context beyond structural diagrams."
title: "Flow 1"
linkTitle: "Architecture Grounded in User Goals"
---
# Architecture grounded in user goals


The research question is which software-engineering and architectural approaches start from user needs, Jobs-to-be-Done (JTBD), or other product concerns when reasoning about a system. Structural diagrams, such as C4 views, may show interactions without explaining why the elements exist or which needs shape them. Those reasons include more than architectural concerns: a sequence such as a user sending an email and a system responding still needs an explanation of the problem being solved.

## Relevant engineering approaches


Several established software-engineering approaches address this gap. They start with intentions, goals, scenarios, and responsibilities. Components follow from that reasoning, which makes the architecture easier to explain.

The relevant research vocabulary includes **goal-oriented requirements engineering**, **scenario-driven architecture**, and **requirements-to-architecture traceability**.

The following approaches are ordered roughly from strongest match to weaker or complementary match:

- **User Requirements Notation (URN): GRL + Use Case Maps.** This is probably the closest formally defined approach that combines the goals and scenarios considered here. ITU-T Z.151 deliberately combines a goal language, GRL, with a scenario language, UCM. GRL models stakeholder goals, alternatives, dependencies, and the reasons behind them: the "why." UCM models how a scenario unfolds and what the system is responsible for: the "what happens." Those responsibilities can then be assigned to architectural components. The standard explicitly positions UCM scenarios for functional/operational requirements and architectural reasoning. ([ITU](https://www.itu.int/dms_pubrec/itu-t/rec/z/T-REC-Z.151-200811-S%21%21SUM-HTM-E.htm "Summary - ITU-T Rec. Z.151 (11/2008) User requirements notation (URN) - Language definition"))

    Conceptually:

    `stakeholder goals -> alternatives/contributions -> scenario -> responsibilities -> components`

    That last distinction is important. UCM can describe the causal path **before deciding which component owns each responsibility**. Earlier UCM research describes placing scenario paths over abstract component structures to compare alternative architectures. ([IEEE Computer Society](https://www.computer.org/csdl/journal/ts/1998/12/e1131/13rRUzp02pP "Use Case Maps as Architectural Entities for Complex ..."))
- **Goal-Oriented Requirements Engineering (GORE): KAOS, i*, etc.** This is the broader group of related approaches. Instead of starting at "system shall send email," goal refinement starts with an objective and repeatedly asks why and how. It continues until the requirements can be assigned to software or people. KAOS, for example, explicitly models goals, constraints, assumptions, agents, events and actions, and supports refinement/operationalization from high-level goals toward concrete responsibilities. ([Webperso](https://webperso.info.ucl.ac.be/~avl/gore.php "Goal-Driven Requirements Engineering: the KAOS Approach"))

    So something like:

    `Customer can regain account access`

    -> `Customer can prove control of recovery channel`

    -> `System provides time-limited proof mechanism`

    -> `System delivers proof to verified email address`

    -> eventually architectural responsibilities.

    This is much closer to JTBD thinking than most architecture-description methods, even though its terminology comes from requirements engineering rather than product management.
- **Tropos.** Tropos tries to use the same concepts _throughout_ requirements and architecture. Tropos starts with actors and their goals in "early requirements." It introduces the proposed system during late requirements, then carries those concepts into architectural and detailed design. Its authors explicitly describe the method as requirements-driven, with goal models continuing to justify dependencies during architectural design. ([ACM Digital Library](https://dl.acm.org/doi/pdf/10.1145/544741.544748 "The tropos software development methodology"))

    In other words, Tropos comes remarkably close to:

    `Why does this system exist?`

    ↓

    `Who depends on whom for what?`

    ↓

    `What responsibilities must the system assume?`

    ↓

    `What subsystems/agents must exist?`

    It comes from academic work on agents, but the reasoning can be useful without adopting the full notation.
- **Impact Mapping.** Less architectural, but extremely useful as the layer immediately _above_ architecture. Its chain is explicitly `Goal -> Actors -> Impacts -> Deliverables`: start with the business goal, identify actors who can affect it, identify changes in their behavior, and only then discuss software/features. ([Impact Mapping](https://www.impactmapping.org/drawing.html "Drawing impact maps"))

    This supplies an intent chain beyond C4 structural views:

    `Why are we doing anything?`

    -> `Who needs to behave differently?`

    -> `What capability might enable that?`

    -> only then `What software has to exist?`

    Impact Mapping does not reach the architecture by itself, but `Impact Map -> scenarios/domain model -> C4` forms a connected sequence.
- **Domain Storytelling.** Very good for the middle layer. A Domain Story is a concrete narrative of "who does what, with what, and with whom." The method starts with real examples of business processes. Its authors explain how requirements, context maps, and other artifacts can develop from those stories. ([Domain Storytelling](https://domainstorytelling.org/quick-start-guide "Quick-Start Guide - Domain Storytelling"))

    This gives architecture a behavioral backbone:

    `Customer requests refund`

    -> `Support agent examines order`

    -> `Agent approves refund`

    -> `Payment provider receives refund request`

    -> `Customer receives confirmation`

    Subsequent questions include: where are the semantic boundaries? Who owns each responsibility? What messages cross boundaries? That is far more grounded than drawing boxes first.
- **EventStorming + DDD strategic design.** Similar role, although usually domain/business-process-centered rather than user-need-centered. EventStorming starts from meaningful facts in the business process and progressively introduces commands, actors, policies, read models, external systems, aggregates, and eventually bounded contexts. Its architectural value comes from finding service and context boundaries in the domain and its behavior. Services are introduced for those reasons, rather than invented first and justified later. ([AWS Samples](https://aws-samples.github.io/eda-on-aws/eventstorming/ "EventStorming | Event-driven Architecture on AWS"))
- **SEI Attribute-Driven Design + PALM / ATAM.** This is the architecture-heavy answer to the same problem, particularly for non-functional requirements. ADD says that architecture should be driven by architecturally significant requirements expressed as concrete quality-attribute scenarios; SEI's PALM work starts earlier and directly connects business goals to those architecturally significant requirements. ([SEI](https://www.sei.cmu.edu/library/attribute-driven-design-method-collection/ "Attribute-Driven Design Method Collection | CMU Software Engineering Institute"))

    So, for example:

    `Business goal: checkout abandonment < 10%`

    -> `User need: checkout must feel immediate`

    -> `quality scenario: under normal peak traffic, confirm payment within 2 s for 99% of requests`

    -> `architectural tactics`

    -> `architecture`.

    This is quite rigorous about architectural forces, although the user/JTBD part has to be supplied by another technique.
- **4+1 View Model.** This model connects architectural views through scenarios. Kruchten's "+1" consists of selected scenarios/use cases. Those scenarios are supposed to exercise and connect the other architectural views, and the architecture can evolve from them. ([Cheriton School of Computer Science](https://cs.uwaterloo.ca/~a78khan/courses-offered/cs446/2010_05/papers/4plus1_view-architecture.pdf "Paper published in IEEE Software 12 (6)")) The limitation is that a use case still tends to answer "what interaction must work?" rather than "why does the user care about this interaction?"
- **arc42.** This provides a _documentation structure_ for recording the reasons behind the architecture alongside its diagrams. It starts with introduction/goals, requirements, stakeholders, constraints and context; later sections contain solution strategy, runtime scenarios, architectural decisions and quality scenarios. ([arc42](https://arc42.org/overview/ "arc42 Template Overview")) It does not itself supply the product-discovery mechanism, but it provides places to keep the reasoning chain after the diagrams have been drawn.

A useful distinction is that these approaches operate at different levels:

```text
INTENT
  Business outcome / JTBD / user need
       |
       v
  Goal / desired actor impact
       |
       v
BEHAVIOR
  Scenario / domain story / use case
       |
       v
  Responsibilities
       |
       v
DESIGN
  Domain boundaries / capabilities
       |
       v
  Components / services
       |
       v
IMPLEMENTATION
  APIs / modules / queues / DBs / deployment
```


C4 basically enters around **components/services**. Starting with C4 alone can leave the preceding causal layers unmodeled.

A structural diagram can leave the rationale implicit. For example:

```text
User
  |
  | send email
  v
Email Service
  |
  v
Notification Service
  |
  v
SMTP Provider
```


There is almost nothing to reason about. Why email? Why synchronous/asynchronous? Is delivery itself valuable? What happens if it takes fifteen minutes? Can SMS fulfill the same need? Why is Notification Service a separate thing? Does the user even initiate this operation?

Start farther upstream:

```text
JTBD
"When I detect suspicious activity,
 I need to regain exclusive control of my account quickly."

        ↓

Outcome
Account owner can recover access without contacting support.

        ↓

Scenario
1. User requests recovery.
2. System establishes an independent proof of control.
3. User presents proof.
4. Existing sessions are invalidated.
5. User regains access.

        ↓

Architectural forces
- proof must expire
- replay must be impossible
- attacker must not enumerate accounts
- notification provider may be unavailable
- recovery should complete within N minutes
- security-sensitive actions need an audit trail

        ↓

Responsibilities
- Recovery orchestration
- Proof generation/verification
- Session revocation
- Rate limiting
- Notification delivery
- Audit recording

        ↓

Architecture
Identity Service
Token Store
Notification Adapter
Session Service
Audit Log
...
```


Now an architect can actually argue about things.

For example, "Why is there a Notification Adapter?" has an answer tracing upward to a responsibility, scenario and ultimately a user outcome. The reasoning can also reveal that the adapter is not required in itself: perhaps passkeys or recovery codes satisfy the upstream goal better. The goal stays the same, while particular architecture elements remain possible solutions that can be replaced.

The key invariant is **being able to trace a component upward to a meaningful stakeholder concern**.

The proposed practical method combines the approaches rather than adopting any one of them wholesale:

```text
JTBD / business outcome
        ↓
Impact Map / lightweight goal model
        ↓
2–5 critical scenarios
        ↓
Domain Storytelling or EventStorming
        ↓
Responsibilities + domain boundaries
        ↓
Quality-attribute scenarios
        ↓
C4
        ↓
ADRs
```


Explicit traceability links each component to its rationale:

```text
Component
  ← satisfies Responsibility R7
  ← needed by Scenario S3
  ← supports Outcome O2
  ← supports Goal G1
```


Likewise an ADR would say:

```text
Decision:
Use asynchronous delivery for recovery notifications.

Drivers:
S3 Account Recovery
QA-4 Provider degradation
O2 Recovery completes without support

Consequences:
...
```


C4 then becomes a **projection of the current solution**: a view drawn from the richer model. The intent and scenario model provides a stable basis for understanding that solution, rather than making the C4 diagram the starting point.

Three useful starting points are **URN/GRL/UCM**, **Tropos/GORE**, and **Impact Mapping -> Domain Storytelling -> C4**. The first is perhaps the clearest existing attempt at exactly an integrated "why -> behavior -> architecture" model.

## Derivation from product intent


Two related ideas guide this derivation. First, move step by step from the desired result so that redundant concepts and entities are not introduced; "working backwards" may be an inadequate label for this. Second, use the product itself as the more fundamental frame for architectural reasoning. Together, these ideas describe a derivation more precisely than a backward chronological process.

The resulting chain is:

```text
product intent
    ↓
necessary observable behavior
    ↓
system responsibilities
    ↓
collaborations
    ↓
architectural concepts
    ↓
implementation mechanisms
```


The important property is that each step has to be justified by the preceding one. The process does not begin with a vocabulary of `EmailService`, `NotificationService`, `EventBus`, `UserRepository`, etc. and then arrange it. Those concepts are introduced as the reasoning justifies them.

There are several established approaches that capture parts of this.

The first relevant term is **goal refinement**. In KAOS/GORE, a high-level goal is broken into more specific goals until they can be assigned to software or agents in the surrounding environment. Then those goals are operationalized: translated into services and constraints. Van Lamsweerde describes the sequence almost exactly as WHY -> WHAT -> WHO, and there is work explicitly deriving software architecture from that goal model. ([Webperso](https://webperso.info.ucl.ac.be/~avl/files/avl-ReqToArch-avl.pdf "avl-ReqToArch-avl.PDF"))

The principle is:

> Start with something that matters, and refine it until implementation responsibilities become inevitable.

It is "top-down" in abstraction rather than "backwards" in time.

A second term is **outside-in development/design**. IBM's formulation starts with stakeholders and business scenarios and carries that focus through the software lifecycle. ([IBM Public Downloads](https://public.dhe.ibm.com/software/rational/web/rsdc/08/D2_Mills.pdf "Software Development in IBM")) In engineering practice, outside-in often means starting with externally observable behavior and progressively moving inward.

The outside-in sequence is:

```text
outside
User/product world
       ↓
System boundary
       ↓
Application behavior
       ↓
Domain responsibilities
       ↓
Infrastructure
inside
```


This keeps infrastructure in a different role from the user's problem in the model. Kafka is somewhere near the bottom of the derivation, for example. "Customer can complete X despite Y" is near the top.

Another relevant technique is **Essential Use Cases**. They deliberately express interactions as:

```text
USER INTENTION          SYSTEM RESPONSIBILITY
```


rather than concrete UI actions and system responses. The aim is to describe the need without choosing a technology or implementation too early. ([Victoria University of Wellington](https://www.mcs.vuw.ac.nz/research/object/Papers/euc-a.pdf "Essential Use Cases and Responsibility in Object-Oriented ..."))

For example, instead of:

```text
User clicks "Reset password"
System sends an email
User clicks link
```


the interaction can be expressed as:

```text
User intention                  System responsibility

regain access                   establish user's authority
provide evidence                validate evidence
choose new credential           establish new credential
resume using account            prevent obsolete access
```


Notice what disappeared: email, links, tokens, buttons.

Those are possible solutions.

Those mechanisms are introduced only when a requirement justifies them.

And then **Responsibility-Driven Design** provides an interesting next stage. Wirfs-Brock says to first identify what must happen and who is responsible for it. Decisions about how it happens come later. Internal structure and algorithms come later, after roles and responsibilities are understood.

Together, these methods suggest the following synthesis:

```text
JTBD / desired product outcome
              │
              │ goal refinement
              ▼
       user intentions
              │
              │ essential use cases
              ▼
     system responsibilities
              │
              │ scenarios
              ▼
       collaborations
              │
              │ responsibility assignment
              ▼
    architectural concepts
              │
              │ design refinement
              ▼
      technical mechanisms
```


The transition from **responsibility -> concept** is a key commitment point.

Suppose the product fact is:

> When a payment fails after the user has left the checkout flow, the customer needs to know soon enough to correct it.

The progressive derivation is:

```text
Outcome
Customer can recover from an asynchronous payment failure.

↓ because...

User need
Customer must become aware that intervention is required.

↓ therefore the product must...

System responsibility
Recognize payment outcomes requiring user attention.

System responsibility
Communicate enough information for the customer to act.

↓ this raises forces...

- payment result may arrive asynchronously
- user may no longer be online
- communication can fail
- duplicate payment events may occur
- some failures aren't actionable

↓ therefore we need...

Responsibility: classify payment outcome
Responsibility: decide whether notification is warranted
Responsibility: construct actionable notification
Responsibility: attempt delivery
Responsibility: handle duplicate processing

↓ only now might concepts appear...

PaymentOutcomePolicy
Notification
DeliveryAttempt
IdempotencyKey
NotificationChannel
```


And only _later_:

```text
Kafka topic
Postgres table
SendGrid adapter
PaymentNotificationWorker
```


This yields an architectural rule:

**No architectural concept without a justification path back to a product outcome.**

Something like:

```text
SendGridAdapter
    ↑ implements
EmailDelivery
    ↑ realizes
NotifyCustomer
    ↑ required by
RecoverFromAsyncPaymentFailure
    ↑ supports
Customer successfully completes purchase
```


For an element such as:

```text
GenericMessagingPlatform
```


and cannot walk upward through such a chain, that's a signal to question it.

Maybe three future products will need a generic messaging platform. That's still a hypothesis rather than a present architectural requirement.

A proposed label for the discipline of avoiding redundant concepts and entities is **derivation under least commitment**.

A concept is introduced when a requirement creates a distinction that the model actually needs.

For example:

```text
Need to inform user
```


doesn't imply:

```text
Notification
NotificationTemplate
NotificationPreference
Channel
EmailChannel
SMSChannel
DeliveryProvider
DeliveryAttempt
NotificationCampaign
```


The initial implementation might only require:

```text
sendRecoveryInstructions(user)
```


Later requirements force distinctions:

```text
User chooses delivery channel
              ↓
Channel becomes a meaningful concept

Retry providers independently
              ↓
DeliveryAttempt becomes meaningful

Legal copy differs by jurisdiction
              ↓
Template/ContentPolicy becomes meaningful
```


Each new requirement creates a reason to add detail to the model. The model becomes more detailed as the product requirements become more specific.

That principle has relatives in YAGNI, evolutionary design and "last responsible moment," but those names describe the proposed discipline less precisely. Responsibility-driven design states part of it quite nicely: don't make structural decisions before roles and responsibilities are understood.

The second principle concerns the frame of reference:

**the architecture is a model interpreted in the coordinate system of the product.**

Normally architecture descriptions implicitly use the system itself as their coordinate system:

```text
Here is System A.
It contains A, B, C.
B calls D.
D owns database E.
```


The obvious question remains unanswered:

> Which product concern justifies B?

C4 has no native answer because its ontology begins around:

```text
Person
System
Container
Component
```


These concepts already commit the model to software structure.

An intent-grounded model can instead begin with:

```text
Outcome
Actor
Need / JTBD
Scenario
Responsibility
Constraint
Decision
Architectural element
```


Then architecture is downstream.

In the proposed approach, **a C4 diagram becomes a view generated from a richer justification model**.

Imagine the underlying graph:

```text
                      Product Goal
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
             Scenario A          Scenario B
                 │                   │
            ┌────┴────┐              │
            ▼         ▼              ▼
           R1         R2             R3
            │       ┌──┴──┐           │
            └──────►│ C1  │◄──────────┘
                    └──┬──┘
                       ▼
                      C2
```


Where:

- `R*` = responsibilities
- `C*` = architectural elements.

C4 is then one projection:

```text
C1 → C2
```


A product-oriented projection could show:

```text
Scenario A → R1, R2 → C1
```


And an architectural-rationale projection:

```text
C1 exists because R1 + R2 + R3
```


That's considerably more powerful than simply adding "requirements" beside a C4 model.

Three distinct concepts support this approach:

**Goal refinement** -- moving from important outcomes toward increasingly concrete necessary conditions.

**Outside-in reasoning** -- keep the external world, product, and users as the basis for reasoning while working deeper into the system.

**Just-in-time concept introduction** -- introduce an architectural/domain concept only when some responsibility, constraint or distinction demands it.

There is no single established method for the third idea. Responsibility-Driven Design, essential modeling, evolutionary design and YAGNI each cover pieces of it.

**Intent-grounded architecture** and **outcome-grounded architecture** are proposed descriptive labels for this combination, not established methodology names.

A proposed traceability criterion is:

```text
For every element E in the architecture:

    ∃ product concern P
    ∃ scenario S
    ∃ responsibility R

such that

    P → S → R → E
```


If no such path exists, `E` carries a **justification debt**.

This gives a concrete test for whether a concept belongs in the architecture, going beyond general advice to keep the design simple.

The proposed **justification graph** is a promising research direction because it could become both a reasoning technique and an architecture-description model.
