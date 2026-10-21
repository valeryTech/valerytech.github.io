---
draft: false
toc: true
description: "Compare goal-driven and scenario-driven architecture methods, from Impact Mapping and KAOS to Domain Storytelling, EventStorming, quality scenarios, and BDD."
title: "Flow 2"
linkTitle: "Flow 2"
---
# Intent-driven and scenario-driven architecture


The relevant approach is an **intent-driven / goal-driven / scenario-driven architecture process**, rather than another architecture-view notation. It keeps each architectural element connected to the reason the system exists.

C4 describes structural levels downstream of those concerns:

`Person -> System -> Container -> Component`

but it does not answer:

`Why does the person care? -> what change are we trying to create? -> what behavior must exist? -> what forces does that impose? -> therefore why does this component exist?`

There are several approaches that cover pieces of exactly that chain.

### 1. Impact Mapping -- probably the closest product-level match


Impact Mapping uses:

`Goal -> Actor -> Impact -> Deliverable`

The process starts with a business/product outcome, identifies whose behavior must change, and only then introduces possible deliverables such as an email service. The method describes the map as a record of the reasoning behind a suggested feature. ([Impact Mapping](https://www.impactmapping.org/drawing.html "Drawing impact maps"))

Impact Mapping can supply the layer **above architecture**.

For example:

```text
Goal
  Reduce time for customers to resolve support cases

Actor
  Customer

Desired impact
  Customer can resolve routine issues without waiting for support

Deliverable
  Conversational support channel
      ↓
  architectural/system reasoning starts here
```


Its limitation is that it stops at potential deliverables; it does not derive architecture.

### 2. Goal-Oriented Requirements Engineering -- KAOS / i*


This is the more rigorous, engineering-oriented version of the same idea.

GORE identifies stakeholder and system **goals**, breaks them into subgoals, compares ways to meet them, and assigns concrete responsibilities to people, software, or other agents. Van Lamsweerde describes requirements engineering as identifying goals, operationalizing them into services and constraints, and assigning responsibility to agents. Here, operationalizing means turning a goal into requirements that can be carried out. ([DOI](https://doi.org/10.1145/337180.337184 "Requirements engineering in the year 00 | Proceedings of the 22nd international conference on Software engineering"))

Conceptually:

```text
Stakeholder goal
    ↓ why?
System goal
    ↓ refinement
Subgoals
    ↓
Responsibilities
    ↓
Required system behaviour
    ↓
Architecture
```


This supplies a goal-refinement model beyond the structural views provided by C4.

A KAOS model can support the question:

> Why must this responsibility exist?

The graph can then be followed upward to a stakeholder goal.

The drawback is that KAOS/i* come from academic requirements engineering and require more formal work than most modern product teams want.

### 3. Domain Storytelling -- grounding architecture in user activity


Domain Storytelling's central question is essentially:

> Who does what with what, and with whom?

It models actors, their activities, and the work objects flowing between them. It is explicitly scenario-based and can model both existing and desired processes. Its authors also describe deriving requirements and domain models from those stories. ([Domain Storytelling](https://domainstorytelling.org/quick-start-guide "Quick-Start Guide - Domain Storytelling"))

So:

```text
Customer
  │
  │ sends support request
  ▼
Support request
  │
System categorizes it
  │
  ▼
Support agent
  │ responds
  ▼
Customer
```


The architecture supports a concrete **domain story**. Domain Storytelling is therefore one of the first methods to investigate for this approach.

### 4. EventStorming -- business process as the substrate for architecture


EventStorming goes a little further toward architecture than Domain Storytelling.

The process first discovers what happens in the business/domain:

```text
User submitted request
        ↓
Request classified
        ↓
Agent assigned
        ↓
Response composed
        ↓
Response sent
```


The workshop gradually identifies commands, policies, actors, aggregates, and boundaries. Brandolini describes it as a way to explore complex business domains together, rather than model the existing software; the technique has Process Modelling and Software Design variants. ([EventStorming](https://www.eventstorming.com/ "EventStorming"))

That last distinction is important:

> Don't model the software and ask what it does.
> Model the domain and discover what software needs to exist.

EventStorming does not inherently establish whether the modeled process contributes to a valuable **product outcome**.

Impact Mapping or JTBD can provide that upstream justification.

### 5. SEI QAW + Attribute-Driven Design -- probably the closest actual architecture methodology


This is where things get particularly relevant architecturally.

The SEI's Quality Attribute Workshop starts with **business/mission goals and stakeholder concerns**. It turns them into concrete scenarios and identifies architectural drivers: the requirements that shape the design. Attribute-Driven Design then uses these architecturally significant requirements to develop the architecture. ([SEI](https://insights.sei.cmu.edu/library/the-sei-quality-attribute-workshop/ "The SEI Quality Attribute Workshop"))

The chain becomes:

```text
Business / mission goal
        ↓
Stakeholder concern
        ↓
Scenario
        ↓
Architecturally Significant Requirement
        ↓
Architectural driver
        ↓
Design decision
        ↓
Architecture
```


For example, instead of:

> "Use Kafka."

the reasoning can establish:

```text
Business goal:
Customers receive fraud notifications quickly.

Scenario:
When a fraud event is detected during peak load,
the customer receives a notification within 5 seconds.

Architectural driver:
Low-latency asynchronous notification at peak load.

Decision:
Separate notification processing from transaction processing;
use durable asynchronous messaging.

Architecture:
Transaction Service → Event Bus → Notification Service
```


Now Kafka isn't a box on a diagram. There is an explicit causal explanation for why something Kafka-like is required.

ATAM helps evaluate the result. Its utility tree connects business context to quality-attribute drivers and concrete stimulus/response scenarios. Those scenarios are used to assess architectural approaches and tradeoffs. ([SEI](https://www.sei.cmu.edu/documents/629/2000_005_001_13706.pdf "ATAM: Method for"))

This SEI family probably deserves more attention than it gets in contemporary software architecture.

### 6. arc42 -- a much better "frame around C4"


arc42 doesn't solve product discovery, but its architecture documentation structure begins with **business goals, essential requirements, stakeholders, quality goals, context and constraints** before getting into building blocks/runtime/deployment. ([arc42 Documentation](https://docs.arc42.org/section-1/ "1 - Introduction and Goals | arc42 Documentation"))

One possible documentation structure is:

```text
arc42
│
├─ 1. Goals / stakeholders / requirements
├─ 2. Constraints
├─ 3. Context
├─ ...
├─ Building-block view
│    └─ C4 container/component diagrams
│
└─ Runtime scenarios
```


C4 can serve as a **notation inside** an arc42 architecture description, rather than being treated as the architecture method itself.

### 7. 4+1 / use-case-driven architecture -- older, but conceptually important


In Kruchten's 4+1 model, the `+1` consists of selected use cases and scenarios, rather than another structural view. The architecture develops through repeated work on those scenarios, which also explain and validate the other views. ([arXiv](https://arxiv.org/abs/2006.04975 "Architectural Blueprints: The 4+1 View Model of Software Architecture"))

So it already recognizes:

```text
Scenario
     ↓
Logical view
Process view
Development view
Physical view
```


RUP pushed the idea further by being explicitly **use-case-driven and architecture-centric**.

Its reasoning usually stops at the use case rather than the product outcome. This makes it a relevant earlier approach, with a narrower scope.

### 8. BDD / outside-in development -- same principle at code scale


BDD provides another piece of the chain:

```text
User problem
  ↓
Example of desired behaviour
  ↓
Executable specification
  ↓
Implementation
```


Cucumber's current BDD description explicitly frames the process as breaking down user problems into examples and using those examples continuously from concept through implementation. ([Cucumber](https://cucumber.io/docs/bdd/ "Behaviour-Driven Development | Cucumber"))

BDD connects desired behavior to implementation at the code/design boundary.

No single method in this comparison appears to cover the whole chain; the proposed approach combines the parts that support one another.

The coherent stack would be something like:

```text
JTBD / Product outcome
          │
          ▼
     Impact Mapping
   WHY / WHO / IMPACT
          │
          ▼
Domain Storytelling / EventStorming
   ACTUAL BEHAVIOUR
          │
          ▼
Functional scenarios
+
Quality attribute scenarios
          │
          ▼
Architectural drivers / ASRs
          │
          ▼
Attribute-Driven Design
          │
          ▼
Architectural Decisions
          │
          ├──────────────┐
          ▼              ▼
        ADRs          arc42
                         │
                         ▼
                    C4 diagrams
```


And critically, maintain **traceability between those layers**.

Then a C4 box could conceptually have:

```text
Notification Service
  exists because:
    ADR-017
      because:
        ASR-04: notification <5s
          because:
            Scenario-12: fraud detected → customer notified
              because:
                Impact-3: customer can react to fraud immediately
                  because:
                    Goal-1: reduce fraud losses
```


This forms an **explanation graph from intent to implementation**.

A practical starting sequence is **Impact Mapping -> Domain Storytelling/EventStorming -> QAW/ADD**, with **arc42 + C4 used to document and present the result**. Those four layers fit together unusually well even though they weren't designed as one methodology.

## Progressive refinement from product intent


Two dimensions are often treated separately:

1. **How architecture is derived** -- step by step, adding structure only when a need requires it.
2. **What architecture is derived from** -- the product purpose and its observable behavior, rather than a general list of "architectural concerns."

The first dimension is better described as **progressive refinement from intent** or **goal refinement** than as "working backwards."

The conceptual process is:

```text
Product outcome
    ↓
User intention
    ↓
System responsibility
    ↓
Required behavior
    ↓
Constraints / invariants
    ↓
Responsibilities and collaborations
    ↓
Boundaries
    ↓
Components / storage / queues / services / etc.
```


Notice what is deliberately absent near the top: `Service`, `Repository`, `EventBus`, `Entity`, `Aggregate`, `Controller`.

Those concepts don't get admission merely because they're familiar architecture concepts. Something has to justify them.

This has several surprisingly close precedents.

KAOS calls the move **goal refinement** and **goal operationalization**: progressively turn goals into lower-level requirements, then assign those requirements to responsible agents. Van Lamsweerde even has work explicitly titled _From System Goals to Software Architecture_. ([Webperso](https://webperso.info.ucl.ac.be/~avl/gore.php "Goal-Driven Requirements Engineering: the KAOS Approach"))

The goal-refinement chain is:

```text
Goal
 ↓ refine
Subgoal
 ↓ operationalize
Required behavior
 ↓ assign
Responsibility
 ↓
Architecture
```


There is also a useful older term, **stepwise refinement**, from Wirth: begin with an abstract statement and progressively replace it with more concrete decisions. ([Research Collection](https://www.research-collection.ethz.ch/items/cf590cb8-3d8f-40eb-9026-071a68b7a116 "Program development by step-wise refinement")) The difference is that classic stepwise refinement is about programs; the proposed approach applies the same reasoning rule starting at the product level.

The second particularly relevant family is **outside-in + Responsibility-Driven Design**.

Responsibility-Driven Design says, roughly, don't begin by classifying data into objects. Start from the responsibilities that need to be fulfilled and then find roles that collaborate to fulfill them. Wirfs-Brock explicitly frames objects as roles and responsibilities working together toward the larger goals of the application. ([Wirfs-Brock](https://www.wirfs-brock.com/Design.html "Wirfs-Brock Associates Responsibility-Driven Design"))

Freeman and Pryce take this further in outside-in TDD. A collaborator **doesn't even need to exist yet**. A test can reveal that a responsibility needs a supporting role; the collaborator is introduced when that need appears. ([InformIT](https://www.informit.com/articles/article.aspx?p=1400614&seqNum=6 "Unit-Testing the Collaborating Objects | Test-Driven Development with Objects | InformIT")) They contrast this view of roles working together with starting from a fixed classification of things. ([InformIT](https://www.informit.com/articles/article.aspx?p=1400614&seqNum=3 "Follow the Messages | Test-Driven Development with Objects | InformIT"))

This supports the aim of avoiding redundant concepts and entities.

For example, don't begin with:

```text
Email
EmailService
EmailRepository
EmailProvider
EmailEvent
EmailQueue
EmailDispatcher
```


Begin with:

```text
User intention:
    Send an invoice to the customer.

System responsibility:
    Ensure the customer receives the invoice.
```


Then ask what has to be true.

```text
Need to accept the request.
Need to produce the invoice.
Need to deliver it.
Need to tell the user whether delivery succeeded.
```


Still no queue.

Then a product/operational constraint appears:

```text
Delivery providers can be unavailable for 30 minutes,
but sending an invoice must not be lost.
```


The constraint now justifies:

```text
persist pending delivery
retry delivery
```


Maybe that becomes a durable queue. Maybe not.

Another constraint:

```text
Customers may receive invoices by email or electronic
document exchange.
```


Now some notion of delivery channel/policy becomes justified.

So the architecture is almost a **proof tree**:

```text
Why does this thing exist?

RetryWorker
  because delivery must retry

Why?
  because provider failure must not lose invoices

Why?
  because "Send invoice" means eventual delivery,
  not merely "we called an email API"

Why?
  because that's part of the product promise
```


That's substantially different from ordinary architecture modeling.

A related requirements technique is **Essential Use Cases**. Constantine and Lockwood structure them explicitly as:

```text
User intention       System responsibility
--------------       ---------------------
identify self    →   verify identity
request invoice  →   provide invoice
```


These interactions describe intentions and responsibilities without choosing an implementation. ([ResearchGate](https://www.researchgate.net/publication/2350151_Structure_and_Style_in_Use_Cases_for_User_Interface_Design "(PDF) Structure and Style in Use Cases for User Interface Design"))

The distinction between **user intention and system responsibility** connects product intent to design obligations.

Vertical Slice Architecture provides a related implementation approach. Bogard argues for treating each request/use case independently, starting simple, allowing abstractions to emerge when the business logic actually requires them rather than imposing `Controller -> Service -> Repository` everywhere. ([Jimmy Bogard](https://www.jimmybogard.com/vertical-slice-architecture/ "Vertical Slice Architecture"))

The proposed combined principle is:

> **Architecture is the progressive allocation of product responsibilities to software structures.**

Not:

> First design an architecture, then see how features fit into it.

The foundation is broader than the current product features or UI. It comprises:

```text
product purpose
+ user intentions
+ domain behavior
+ product promises
+ externally observable constraints
```


The existing product is only one realization of those things.

This yields a rule for every architecture concept:

```text
No architectural element without a parent reason.
```


Every node should be traceable upward:

```text
mechanism
    ↑ because
responsibility
    ↑ because
constraint / behavior
    ↑ because
user intention / product capability
    ↑ because
product outcome
```


The proposed label **architecture by successive justification** is more precise for this synthesis than "working backwards" or "user-centered architecture": each step adds only the concepts needed to meet a requirement already established at the level above.
