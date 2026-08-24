---
draft: false
toc: true
title: "Flow 1"
linkTitle: "Flow 1"
---
## Question


We're talking about software engineering. (and architecture, whatever).

Please let's find engineering (and/or architectural ) approaches which follow this scheme - where user needs, or JTBD, or other product thing serve as a base or frame to reason about system, provide required context to our view. I'm talking about this because many of the approaches - like C4 model - where we have just several diagrams, and there is no underlying guiding forces (not just architectural, but I'm talking about why something is even exist? like user send email, bla-bla, then system responds - what we're solving here?)

## First Answer


Yes. There is a fairly deep lineage of software-engineering approaches built around exactly this complaint: architecture becomes much easier to reason about when the primary objects are intentions, goals, scenarios, and responsibilities, with components appearing later as consequences.

The vocabulary I would search under is primarily **goal-oriented requirements engineering**, **scenario-driven architecture**, and **requirements-to-architecture traceability**.

The approaches I think are most relevant, roughly from strongest match to weaker/complementary match:

- **User Requirements Notation (URN): GRL + Use Case Maps.** This is probably the closest formalized thing to what you described. ITU-T Z.151 deliberately combines a goal language, GRL, with a scenario language, UCM. GRL models stakeholder goals, alternatives, dependencies, and rationale--the "why"; UCM then models causal scenario paths and system responsibilities--the "what happens"; those responsibilities can subsequently be allocated to architectural components. The standard explicitly positions UCM scenarios for functional/operational requirements and architectural reasoning. ([ITU](https://www.itu.int/dms_pubrec/itu-t/rec/z/T-REC-Z.151-200811-S%21%21SUM-HTM-E.htm?utm_source=chatgpt.com "Summary - ITU-T Rec. Z.151 (11/2008) User requirements notation (URN) - Language definition"))

    Conceptually:

    `stakeholder goals -> alternatives/contributions -> scenario -> responsibilities -> components`

    That last distinction is important. With UCM, you can describe the causal path **before deciding which component owns each responsibility**. There is old UCM research explicitly describing this as superimposing scenario paths on abstract component structures so that architecture alternatives can be reasoned about. ([IEEE Computer Society](https://www.computer.org/csdl/journal/ts/1998/12/e1131/13rRUzp02pP?utm_source=chatgpt.com "Use Case Maps as Architectural Entities for Complex ..."))
- __Goal-Oriented Requirements Engineering (GORE): KAOS, i_, etc._* This is the larger intellectual family. Instead of starting at "system shall send email," you start with an objective and repeatedly ask why/how until you reach things that software or humans can actually be responsible for. KAOS, for example, explicitly models goals, constraints, assumptions, agents, events and actions, and supports refinement/operationalization from high-level goals toward concrete responsibilities. ([Webperso](https://webperso.info.ucl.ac.be/~avl/gore.php?utm_source=chatgpt.com "Goal-Driven Requirements Engineering: the KAOS Approach"))

    So something like:

    `Customer can regain account access`

    -> `Customer can prove control of recovery channel`

    -> `System provides time-limited proof mechanism`

    -> `System delivers proof to verified email address`

    -> eventually architectural responsibilities.

    This is much closer to JTBD thinking than most architecture-description methods, even though its terminology comes from requirements engineering rather than product management.
- **Tropos.** This one is especially interesting because it tries to carry the same conceptual model _through_ requirements and architecture. Tropos starts from actors and their goals in "early requirements," introduces the system-to-be during late requirements, and continues those concepts into architectural and detailed design. Its authors explicitly describe the method as requirements-driven, with goal models continuing to justify dependencies during architectural design. ([ACM Digital Library](https://dl.acm.org/doi/pdf/10.1145/544741.544748?utm_source=chatgpt.com "The tropos software development methodology"))

    In other words, Tropos comes remarkably close to:

    `Why does this system exist?`

    ↓

    `Who depends on whom for what?`

    ↓

    `What responsibilities must the system assume?`

    ↓

    `What subsystems/agents must exist?`

    It is somewhat academically flavored and agent-oriented, but the underlying reasoning model is relevant even if you never draw a Tropos diagram.
- **Impact Mapping.** Less architectural, but extremely useful as the layer immediately _above_ architecture. Its chain is explicitly `Goal -> Actors -> Impacts -> Deliverables`: start with the business goal, identify actors who can affect it, identify changes in their behavior, and only then discuss software/features. ([Impact Mapping](https://www.impactmapping.org/drawing.html?utm_source=chatgpt.com "Drawing impact maps"))

    This gives you something C4 lacks:

    `Why are we doing anything?`

    -> `Who needs to behave differently?`

    -> `What capability might enable that?`

    -> only then `What software has to exist?`

    Impact Mapping itself stops too early for architecture, but `Impact Map -> scenarios/domain model -> C4` is a coherent pipeline.
- **Domain Storytelling.** Very good for the middle layer. A Domain Story is a concrete narrative of "who does what, with what, and with whom." The method deliberately centers real business-process examples, and its authors describe other artifacts--including requirements and context maps--as growing around those stories. ([Domain Storytelling](https://domainstorytelling.org/quick-start-guide?utm_source=chatgpt.com "Quick-Start Guide - Domain Storytelling"))

    This gives architecture a behavioral backbone:

    `Customer requests refund`

    -> `Support agent examines order`

    -> `Agent approves refund`

    -> `Payment provider receives refund request`

    -> `Customer receives confirmation`

    You can subsequently ask: where are the semantic boundaries? Who owns each responsibility? What messages cross boundaries? That is far more grounded than drawing boxes first.
- **EventStorming + DDD strategic design.** Similar role, although usually domain/business-process-centered rather than user-need-centered. EventStorming starts from meaningful facts in the business process and progressively introduces commands, actors, policies, read models, external systems, aggregates, and eventually bounded contexts. Its usefulness architecturally comes from letting service/context boundaries emerge from the behavior and domain rather than inventing services and then trying to find a justification for them. ([AWS Samples](https://aws-samples.github.io/eda-on-aws/eventstorming/?utm_source=chatgpt.com "EventStorming | Event-driven Architecture on AWS"))
- **SEI Attribute-Driven Design + PALM / ATAM.** This is the architecture-heavy answer to the same problem, particularly for non-functional requirements. ADD says that architecture should be driven by architecturally significant requirements expressed as concrete quality-attribute scenarios; SEI's PALM work goes further upstream and explicitly connects business goals to those architecturally significant requirements. ([SEI](https://www.sei.cmu.edu/library/attribute-driven-design-method-collection/?utm_source=chatgpt.com "Attribute-Driven Design Method Collection | CMU Software Engineering Institute"))

    So, for example:

    `Business goal: checkout abandonment < 10%`

    -> `User need: checkout must feel immediate`

    -> `quality scenario: under normal peak traffic, confirm payment within 2 s for 99% of requests`

    -> `architectural tactics`

    -> `architecture`.

    This is quite rigorous about architectural forces, although the user/JTBD part has to be supplied by another technique.
- **4+1 View Model.** Surprisingly, this is closer to what you're asking for than C4. Kruchten's "+1" consists of selected scenarios/use cases. Those scenarios are supposed to exercise and connect the other architectural views, and the architecture can evolve from them. ([Cheriton School of Computer Science](https://cs.uwaterloo.ca/~a78khan/courses-offered/cs446/2010_05/papers/4plus1_view-architecture.pdf?utm_source=chatgpt.com "Paper published in IEEE Software 12 (6)")) The limitation is that a use case still tends to answer "what interaction must work?" rather than "why does the user care about this interaction?"
- **arc42.** I would consider this a better _documentation frame_ than C4 when you want architectural rationale preserved. It starts with introduction/goals, requirements, stakeholders, constraints and context; later sections contain solution strategy, runtime scenarios, architectural decisions and quality scenarios. ([arc42](https://arc42.org/overview/?utm_source=chatgpt.com "arc42 Template Overview")) It doesn't itself give you the product-discovery mechanism, but it provides places to preserve the chain instead of throwing everything away once boxes are drawn.

The distinction I find useful is that these approaches operate at different levels:

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


C4 basically enters around **components/services**. Consequently, if you start with C4, several causal layers have already disappeared.

And I think that explains the discomfort in your example. Suppose a diagram says:

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

For example, "Why is there a Notification Adapter?" has an answer tracing upward to a responsibility, scenario and ultimately a user outcome. You can also discover that the adapter isn't intrinsically required: perhaps passkeys or recovery codes satisfy the upstream goal better. The goal survives while particular architecture elements become replaceable hypotheses.

That property--**being able to trace a component upward until you reach a reason somebody cares about**--is probably the invariant you're looking for.

If I were constructing a practical method for a software team today, I wouldn't adopt one of these wholesale. I'd combine them roughly as:

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


And I'd require explicit traceability:

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


That transforms C4 into the **projection of the current solution** rather than the root artifact. The higher-level intent/scenario model becomes the stable frame through which you interpret it.

If I had to pick three things to investigate first, I'd go with **URN/GRL/UCM**, **Tropos/GORE**, and **Impact Mapping -> Domain Storytelling -> C4**. The first is perhaps the clearest existing attempt at exactly the integrated "why -> behavior -> architecture" model you're describing.

## Moment 2


I think in my reasoning I connected 2 moments:

- working backwards - but I don't really like this. Perhaps you can find alternatives? step-by-step from the result so we're preventing introducing redundant concepts and entities
- - and second is we're reason about architecture on some more important base - product itself

## Answer 2


Yes. I think your two ideas fit together more tightly than "working backwards" suggests.

What you are describing is closer to a derivation:

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


The important property is that each step has to be justified by the preceding one. You don't begin with a vocabulary of `EmailService`, `NotificationService`, `EventBus`, `UserRepository`, etc. and then arrange it. You earn those concepts as the reasoning proceeds.

There are several established approaches that capture parts of this.

The first term I'd use instead of "working backwards" is **goal refinement**. In KAOS/GORE, a high-level goal is successively refined until you reach goals that can actually be assigned to software or environmental agents. Then those goals are operationalized into services and constraints. Van Lamsweerde describes the sequence almost exactly as WHY -> WHAT -> WHO, and there is work explicitly deriving software architecture from that goal model. ([Webperso](https://webperso.info.ucl.ac.be/~avl/files/avl-ReqToArch-avl.pdf "avl-ReqToArch-avl.PDF"))

That terminology fits your idea much better:

> Start with something that matters, and refine it until implementation responsibilities become inevitable.

It is "top-down" in abstraction rather than "backwards" in time.

A second term is **outside-in development/design**. IBM's formulation starts with stakeholders and business scenarios and carries that focus through the software lifecycle. ([IBM Public Downloads](https://public.dhe.ibm.com/software/rational/web/rsdc/08/D2_Mills.pdf?utm_source=chatgpt.com "Software Development in IBM")) In engineering practice, outside-in often means starting with externally observable behavior and progressively moving inward.

That gives you:

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


This matters because infrastructure doesn't get equal ontological status with the user's problem. Kafka is somewhere near the bottom of the derivation, for example. "Customer can complete X despite Y" is near the top.

There is another old technique I think is especially relevant to your thinking: **Essential Use Cases**. They deliberately express interactions as:

```text
USER INTENTION          SYSTEM RESPONSIBILITY
```


rather than concrete UI actions and system responses. The idea is to remain technology- and implementation-independent so the design isn't contaminated too early by mechanisms. ([Victoria University of Wellington](https://www.mcs.vuw.ac.nz/research/object/Papers/euc-a.pdf?utm_source=chatgpt.com "Essential Use Cases and Responsibility in Object-Oriented ..."))

For example, instead of:

```text
User clicks "Reset password"
System sends an email
User clicks link
```


you could write:

```text
User intention                  System responsibility

regain access                   establish user's authority
provide evidence                validate evidence
choose new credential           establish new credential
resume using account            prevent obsolete access
```


Notice what disappeared: email, links, tokens, buttons.

Those are possible solutions.

Now you can derive them only if something requires them.

And then **Responsibility-Driven Design** provides an interesting next stage. Wirfs-Brock explicitly says to focus first on what actions must be accomplished and who should accomplish them, while deferring how they are accomplished. Internal structure and algorithms come later, after roles and responsibilities are understood.

Put these together and you get something quite close to what you're describing:

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


I think the transition from **responsibility -> concept** is particularly important.

Suppose the product fact is:

> When a payment fails after the user has left the checkout flow, the customer needs to know soon enough to correct it.

You can progressively derive:

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


This gives you a very strong architectural rule:

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


If you encounter:

```text
GenericMessagingPlatform
```


and cannot walk upward through such a chain, that's a signal to question it.

Maybe three future products will need a generic messaging platform. That's still a hypothesis rather than a present architectural requirement.

This connects directly to your "prevent introducing redundant concepts and entities" point. I would phrase the discipline as **derivation under least commitment**.

You postpone introducing a concept until a requirement creates a distinction that the model actually needs.

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


You might initially only need:

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


Each new requirement creates pressure on the model. The model becomes more articulated because the product became more articulated.

That principle has relatives in YAGNI, evolutionary design and "last responsible moment," but I think those names are weaker descriptions of what you're after. Responsibility-driven design states part of it quite nicely: don't make structural decisions before you understand roles and responsibilities.

And this leads to the second part of your thought, which I think is more substantial:

**the architecture is a model interpreted in the coordinate system of the product.**

Normally architecture descriptions implicitly use the system itself as their coordinate system:

```text
Here is System A.
It contains A, B, C.
B calls D.
D owns database E.
```


The obvious question remains unanswered:

> Why should I care that B exists?

C4 has no native answer because its ontology begins around:

```text
Person
System
Container
Component
```


You've already committed to talking about software structure.

Your ontology could instead begin:

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

I'd go even further: **a C4 diagram would become a view generated from a richer justification model**.

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

I'd therefore separate three concepts in the vocabulary you're developing:

**Goal refinement** -- moving from important outcomes toward increasingly concrete necessary conditions.

**Outside-in reasoning** -- maintaining the external/product/user world as the frame of reference while going deeper into the system.

**Just-in-time concept introduction** -- introduce an architectural/domain concept only when some responsibility, constraint or distinction demands it.

That third one doesn't have one canonical methodology attached to it. Responsibility-Driven Design, essential modeling, evolutionary design and YAGNI each cover pieces of it.

For our conversation, I'd perhaps call the combination **intent-grounded architecture** or **outcome-grounded architecture**. I don't mean those as established methodology names; they'd be convenient labels for the thing we're exploring.

And I think there's an interesting criterion hiding here:

```text
For every element E in the architecture:

    ∃ product concern P
    ∃ scenario S
    ∃ responsibility R

such that

    P → S → R → E
```


If no such path exists, `E` carries a **justification debt**.

That gives us something stronger than "keep the architecture simple." It gives us an actual test for whether a concept deserves to exist.

I suspect this "justification graph" is the most interesting direction to pursue from here, because it could become both a reasoning technique and an architecture-description model.
