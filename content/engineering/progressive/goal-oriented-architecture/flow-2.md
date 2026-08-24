---
draft: false
toc: true
title: "Flow 2"
linkTitle: "Flow 2"
---
## Answer 1


Yes. The thing you are looking for is not really another architecture-view notation. It is closer to an **intent-driven / goal-driven / scenario-driven architecture process**, where architectural elements remain traceable back to the reason the system exists.

C4 is deliberately downstream of that problem. It can tell you:

`Person -> System -> Container -> Component`

but it does not answer:

`Why does the person care? -> what change are we trying to create? -> what behavior must exist? -> what forces does that impose? -> therefore why does this component exist?`

There are several approaches that cover pieces of exactly that chain.

### 1. Impact Mapping -- probably the closest product-level match


Impact Mapping uses:

`Goal -> Actor -> Impact -> Deliverable`

So instead of starting with "we need an email service", you start with the business/product outcome, identify whose behavior must change, and only then introduce things to build. Importantly, the method explicitly describes the map as preserving the reasoning that led to a feature suggestion. ([Impact Mapping](https://www.impactmapping.org/drawing.html?utm_source=chatgpt.com "Drawing impact maps"))

For what you're describing, this is extremely useful as the layer **above architecture**.

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


Its limitation is that it deliberately stops roughly at "what should we build?" It doesn't derive architecture.

### 2. Goal-Oriented Requirements Engineering -- KAOS / i*


This is the more rigorous, engineering-oriented version of the same idea.

GORE asks what stakeholder/system **goals** exist, refines higher-level goals into subgoals, determines alternative ways of satisfying them, and eventually assigns concrete responsibilities to humans/software/other agents. Van Lamsweerde describes requirements engineering precisely as identifying goals, operationalizing them into services/constraints, and assigning responsibility to agents. ([DOI](https://doi.org/10.1145/337180.337184?utm_source=chatgpt.com "Requirements engineering in the year 00 | Proceedings of the 22nd international conference on Software engineering"))

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


This is surprisingly close to your complaint about C4.

With KAOS you can potentially point at something and ask:

> Why must this responsibility exist?

and follow the graph upward until you reach an actual stakeholder goal.

The downside: KAOS/i* come from requirements-engineering academia and are significantly heavier than most modern product teams want.

### 3. Domain Storytelling -- very strong for your "user does X, then..." example


Domain Storytelling's central question is essentially:

> Who does what with what, and with whom?

It models actors, their activities, and the work objects flowing between them. It is explicitly scenario-based and can model both existing and desired processes. Its authors also describe deriving requirements and domain models from those stories. ([Domain Storytelling](https://domainstorytelling.org/quick-start-guide?utm_source=chatgpt.com "Quick-Start Guide - Domain Storytelling"))

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


Now your architecture isn't floating in space. It is supporting a **domain story**.

This is one of the approaches I'd investigate most seriously for what you're after.

### 4. EventStorming -- business process as the substrate for architecture


EventStorming goes a little further toward architecture than Domain Storytelling.

You first discover what actually happens in the business/domain:

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


and progressively discover commands, policies, actors, aggregates/boundaries, etc. Brandolini explicitly positions it as collaborative exploration of complex business domains rather than modeling the existing software; the technique has Process Modelling and Software Design variants. ([EventStorming](https://www.eventstorming.com/?utm_source=chatgpt.com "EventStorming"))

That last distinction is important:

> Don't model the software and ask what it does.
> Model the domain and discover what software needs to exist.

That's very close to the inversion you're asking for.

Its weakness is that EventStorming doesn't inherently explain the **product outcome**. You can EventStorm a completely pointless business process.

So I would put Impact Mapping/JTBD above it.

### 5. SEI QAW + Attribute-Driven Design -- probably the closest actual architecture methodology


This is where things get particularly relevant architecturally.

The SEI's Quality Attribute Workshop starts from **business/mission goals and stakeholder concerns**, converts those into concrete scenarios, identifies architectural drivers, and then Attribute-Driven Design uses architecturally significant requirements to produce architecture. ([SEI](https://insights.sei.cmu.edu/library/the-sei-quality-attribute-workshop/?utm_source=chatgpt.com "The SEI Quality Attribute Workshop"))

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

> "We need Kafka."

you could have:

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

ATAM complements this on the evaluation side: its utility tree translates business context into quality-attribute drivers and concrete stimulus/response scenarios, which are then used to judge architectural approaches and tradeoffs. ([SEI](https://www.sei.cmu.edu/documents/629/2000_005_001_13706.pdf?utm_source=chatgpt.com "ATAM: Method for"))

This SEI family probably deserves more attention than it gets in contemporary software architecture.

### 6. arc42 -- a much better "frame around C4"


arc42 doesn't solve product discovery, but its architecture documentation structure begins with **business goals, essential requirements, stakeholders, quality goals, context and constraints** before getting into building blocks/runtime/deployment. ([arc42 Documentation](https://docs.arc42.org/section-1/?utm_source=chatgpt.com "1 - Introduction and Goals | arc42 Documentation"))

So you can effectively do:

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


I would regard C4 as a perfectly good **notation inside** something like arc42, rather than as the architecture method itself.

### 7. 4+1 / use-case-driven architecture -- older, but conceptually important


Kruchten's 4+1 model is interesting because the `+1` is not merely another structural view: it consists of selected use cases/scenarios. The architecture is iteratively developed around scenarios, which also illustrate and validate the other views. ([arXiv](https://arxiv.org/abs/2006.04975?utm_source=chatgpt.com "Architectural Blueprints: The 4+1 View Model of Software Architecture"))

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

It's not as outcome-oriented as what you're describing--the "why" usually stops at the use case--but historically this is an important predecessor.

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


Cucumber's current BDD description explicitly frames the process as breaking down user problems into examples and using those examples continuously from concept through implementation. ([Cucumber](https://cucumber.io/docs/bdd/?utm_source=chatgpt.com "Behaviour-Driven Development | Cucumber"))

So BDD does at the code/design boundary approximately what you're asking architecture to do at a larger scale.

The interesting conclusion is that I don't think the ideal method is one of these individually.

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


That, I think, is the missing property you're describing.

Not "better diagrams," but an **explanation graph from intent to implementation**.

If I were choosing just three things to dig into first, I'd use **Impact Mapping -> Domain Storytelling/EventStorming -> QAW/ADD**, with **arc42 + C4 as the presentation layer**. Those four layers fit together unusually well even though they weren't designed as one methodology.

## Answer 2


Yes. I think you've connected two dimensions that are often treated separately:

1. **How architecture is derived** -- progressively, introducing structure only when something forces it.
2. **What architecture is derived from** -- product intent and observable product behavior, rather than an abstract catalog of "architectural concerns."

I would not call the first one "working backwards."

A better term is **progressive refinement from intent** or simply **goal refinement**.

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

That is much closer to your idea than "working backwards":

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


There is also a useful older term, **stepwise refinement**, from Wirth: begin with an abstract statement and progressively replace it with more concrete decisions. ([Research Collection](https://www.research-collection.ethz.ch/items/cf590cb8-3d8f-40eb-9026-071a68b7a116?utm_source=chatgpt.com "Program development by step-wise refinement")) The difference is that classic stepwise refinement is about programs; what you're describing applies the same epistemic rule starting at the product level.

The second particularly relevant family is **outside-in + Responsibility-Driven Design**.

Responsibility-Driven Design says, roughly, don't begin by classifying data into objects. Start from the responsibilities that need to be fulfilled and then find roles that collaborate to fulfill them. Wirfs-Brock explicitly frames objects as roles and responsibilities working together toward the larger goals of the application. ([Wirfs-Brock](https://www.wirfs-brock.com/Design.html "Wirfs-Brock Associates Responsibility-Driven Design"))

Freeman and Pryce take this further in outside-in TDD. One striking property is that a collaborator **doesn't even need to exist yet**: a test can expose that a responsibility requires some supporting role, and only then do you introduce it. ([InformIT](https://www.informit.com/articles/article.aspx?p=1400614&seqNum=6 "Unit-Testing the Collaborating Objects | Test-Driven Development with Objects | InformIT")) They explicitly contrast this dynamic, responsibility-based view with starting from static classifications of things. ([InformIT](https://www.informit.com/articles/article.aspx?p=1400614&seqNum=3 "Follow the Messages | Test-Driven Development with Objects | InformIT"))

That seems extremely close to your "prevent redundant concepts and entities" requirement.

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


Now you have justification for:

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

There is an old requirements technique that fits your second point unusually well too: **Essential Use Cases**. Constantine and Lockwood structure them explicitly as:

```text
User intention       System responsibility
--------------       ---------------------
identify self    →   verify identity
request invoice  →   provide invoice
```


and deliberately describe these in abstract, implementation-independent terms. ([ResearchGate](https://www.researchgate.net/publication/2350151_Structure_and_Style_in_Use_Cases_for_User_Interface_Design?utm_source=chatgpt.com "(PDF) Structure and Style in Use Cases for User Interface Design"))

I think that distinction -- **user intention / system responsibility** -- may be one of the missing conceptual links you're looking for.

Then Vertical Slice Architecture gives you an implementation consequence of the same philosophy. Bogard argues for treating each request/use case independently, starting simple, allowing abstractions to emerge when the business logic actually requires them rather than imposing `Controller -> Service -> Repository` everywhere. ([Jimmy Bogard](https://www.jimmybogard.com/vertical-slice-architecture/ "Vertical Slice Architecture"))

So I'd currently formulate the combined principle as:

> **Architecture is the progressive allocation of product responsibilities to software structures.**

Not:

> First design an architecture, then see how features fit into it.

And perhaps even more importantly, I would slightly modify your second point. The foundation shouldn't be "the product" understood as its current features or UI.

It should be:

```text
product purpose
+ user intentions
+ domain behavior
+ product promises
+ externally observable constraints
```


The existing product is only one realization of those things.

That gives you a nice rule for every architecture concept:

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


This is, I think, more precise than both "working backwards" and "user-centered architecture." It's essentially **architecture by successive justification**: each refinement introduces only the concepts necessary to satisfy something already established one level above.
