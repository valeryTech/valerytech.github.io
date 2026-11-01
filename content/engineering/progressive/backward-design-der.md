---
draft: false
toc: true
description: "Trace user needs through outcomes, workflows, capabilities, and system responsibilities; compare JTBD, requirements engineering, Wardley Mapping, and related methods."
title: "Backward Design Der"
linkTitle: "Backward Design Derivation"
---
# Backward design derivation


**Backward design derivation** starts with a user need and works out which responsibilities and design choices are needed to meet it:

> user need -> required outcome -> user workflow -> what the system must make possible at each step -> system responsibilities -> design

Methods that support this chain mainly come from **requirements engineering, strategic design, and architecture evaluation**. Architecture-diagramming methods address a different part of the work.

C4 describes a software system through diagrams at different levels of detail. Its FAQ says that C4 does not define a software delivery or design process. Business processes, workflows, and domain models are also outside its main focus. ([C4 model](https://c4model.com/ "Home | C4 model"))

The key distinction is:

> **Architecture description:** "What exists, and how is it connected?"
>
> **Architecture reasoning:** "What problem does the system solve, for whom, what behavior/outcome is required, and therefore why must these architectural elements exist?"

Backward design derivation mainly concerns the reasoning behind the architecture.

## Related approaches

### 1. JTBD -> capabilities -> target architecture


An industry example directly connects user jobs to a target architecture.

Capital One published **"Leveraging Jobs to Be Done to Start a Target Architecture."** Their chain is roughly:

**Product vision -> JTBD -> capabilities -> systems/data/interfaces -> target architecture**

Their JTBD formulation is:

`While [situation], users need to [action], for the purpose of [goal]`

They map each **action** to a business capability and decide which system should provide it. Doing this for every JTBD produces an initial architecture plan. They also use EventStorming and identified pain points. ([Capital One](https://www.capitalone.com/tech/software-engineering/leveraging-jtbd/ "Leveraging Jobs to Be Done to Start a Target Architecture | Capital One"))

The chain explains why an architectural element is needed:

```text
Why does AccountDetailsService exist?

Customer-support agent
    ↓ has job
Answer a customer's question during a call
    ↓ requires
See relevant account information quickly
    ↓ requires capability
Retrieve customer account details
    ↓ assigned to
Customer Account System
    ↓ architectural realization
API / read model / datastore / authorization / etc.
```


The `Account Details API` has a **causal ancestry**: its purpose can be traced from the API to the capability it provides, and then to the user job it supports.

The Capital One article is one of the first sources to read for this approach.

### 2. JTBD-Oriented Requirements Engineering + RE4SA


Research in requirements engineering describes related methods.

Utrecht University researchers proposed **Jobs-to-be-Done Oriented Requirements Engineering**, giving Job Stories a defined structure. Each requirement includes the **situation, motivation, and expected outcome**, so a feature stays connected to its purpose. ([Utrecht University](https://research-portal.uu.nl/en/publications/jobs-to-be-done-oriented-requirements-engineering-a-method-for-de/ "Jobs-to-be-Done Oriented Requirements Engineering: A Method For Defining Job Stories

-  Utrecht University"))

A related Utrecht line of work developed **RE4SA -- Requirements Engineering for Software Architecture**. RE4SA directly links requirements to architectural elements. It connects epic stories and user stories to modules and features to keep requirements and architecture in agreement. ([Utrecht University Repository](https://dspace.library.uu.nl/handle/1874/396208 "Explicit Alignment of Requirements and Architecture in Agile Development"))

Put the two together conceptually:

```text
JTBD
  ↓
Job Story
  ↓
Requirement / Epic / Feature
  ↓
Architectural responsibility
  ↓
Module / service / component
```


Together, these approaches suggest a way to trace architectural choices back to user jobs.

RE4SA does not itself explain the product-level `why`. The JTBD-oriented requirements work provides that earlier context.

### 3. User Requirements Notation -- probably the closest _single modelling language_


URN is one of the less well-known methods in this comparison.

The ITU standard **User Requirements Notation (URN)** combines two models that cover different needs:

- **GRL -- Goal-oriented Requirement Language**
- **UCM -- Use Case Maps**

GRL models stakeholder goals and intentions. UCM models scenarios of how a system works and helps reason about its architecture. The ITU describes URN as supporting elicitation, analysis, specification, validation, and traceability of requirements. ([itu.int](https://www.itu.int/epublications/publication/itu-t-z-151-2018-10-user-requirements-notation-urn-language-definition "User Requirements Notation (URN) - Language definition"))

Conceptually:

```text
                 WHY
                  │
          ┌───────▼────────┐
          │ Goal / softgoal│
          │ stakeholders   │
          │ alternatives   │
          └───────┬────────┘
                  │
                 HOW
                  │
          ┌───────▼────────┐
          │ Scenario / UCM │
          │ actor behaviour│
          │ responsibilities
          └───────┬────────┘
                  │
          ┌───────▼────────┐
          │ Components /   │
          │ architecture   │
          └────────────────┘
```


For integrating goals with operational scenarios, **URN is one of the strongest matches in this comparison** because goals and operational or architectural scenarios share one notation. This keeps them connected rather than spread across unrelated Jira tickets and architecture diagrams.

Its drawback is practical adoption. It comes from formal requirements engineering, so it may feel heavy compared with a lightweight product and engineering workflow.

### 4. Wardley Mapping -- user need as literal "north"


A Wardley Map starts by identifying:

1. users,
2. their needs,
3. capabilities required to satisfy those needs,
4. dependencies between those capabilities,
5. the evolutionary state of those capabilities.

The landscape is explicitly **anchored on the user and their needs**. ([learnwardleymapping.com](https://learnwardleymapping.com/landscape/ "Landscape"))

So:

```text
User
 │
 └─ Need
     │
     ├─ Capability A
     │   ├─ Capability C
     │   └─ Capability D
     │
     └─ Capability B
         └─ Capability E
```


This gives every lower-level capability an answer to:

> **"Needed by what?"**

This keeps the reason for each capability and dependency visible.

Wardley Mapping then adds another dimension: whether each capability is genesis/custom/product/commodity. That supports decisions such as:

```text
user need
   ↓
capability
   ↓
dependency
   ↓
should we invent / build / buy / outsource / commoditize this?
```


It does not model runtime software behaviour in detail. It belongs **above architecture**, especially when deciding boundaries, ownership, build-vs-buy choices, platforms, and which capabilities make the product different.

## 5. Problem Frames / Architectural Frames


Michael Jackson's **Problem Frames** tradition starts from this principle:

software exists to produce some required effect **in a world outside the software**.

The approach explicitly separates:

```text
problem world
domain properties
requirement
machine/software
```


Jackson describes software development problems as being about the real environment in which the system must have its effect. ([Oro](https://oro.open.ac.uk/7513/ "Open Research Online"))

Later work linked Problem Frames to software architecture through **Architectural Frames** and related extensions. These let architecture help break a problem into parts while keeping each part connected to the original requirements and problem context. ([Oro](https://oro.open.ac.uk/3334/ "Open Research Online"))

This keeps architectural reasoning connected to the problem being solved.

Instead of:

```text
Browser → API Gateway → Service → DB
```


the derivation begins with:

```text
A customer must be able to recover access to their account
                  ↓
Which part of the real world must change?
                  ↓
What phenomena can our software observe/control?
                  ↓
What must the machine guarantee?
                  ↓
What architecture realizes that guarantee?
```


It uses less product-management language than JTBD, but gives more attention to **problem context**.

## 6. Impact Mapping


Impact Mapping comes before architecture. Its structure is well suited to explaining the goals and behavior that architecture needs to support:

```text
GOAL
 ↓
ACTORS
 ↓
IMPACTS / behaviour changes
 ↓
DELIVERABLES
```


Its purpose is to show how technical deliverables are expected to change actor behaviour, and how those changes support business goals. ([Impact Mapping](https://www.impactmapping.org/drawing.html "Drawing impact maps"))

So instead of:

```text
Implement notification service
```


the reasoning becomes:

```text
Goal:
Reduce abandoned applications

Actor:
Applicant

Desired impact:
Returns and completes an interrupted application

Possible deliverable:
Reminder notifications

Architectural consequence:
Notification capability
 ├─ scheduling
 ├─ template rendering
 ├─ preferences
 └─ provider integration
```


Impact Mapping stops before architecture. But as the **top layer of an architecture model**, it's very good.

## 7. Domain Storytelling + DDD


**Domain Storytelling** starts from actual domain actors performing activities with work objects. Its stated goal is to make business processes and domain knowledge concrete, then use that understanding to develop business software. ([Domain Storytelling](https://domainstorytelling.org/ "Domain Storytelling"))

The method can help develop requirements, user-story maps, domain models, and DDD designs. ([Domain Storytelling](https://domainstorytelling.org/requirements "Requirements - Domain Storytelling"))

The derivation can proceed through:

```text
Human/domain story
      ↓
Business process
      ↓
Domain concepts and responsibilities
      ↓
Subdomains
      ↓
Bounded contexts
      ↓
Software boundaries
```


This is excellent at answering:

> "What real process is this software participating in?"

It's somewhat weaker at answering:

> "Why should that process/product exist at all?"

JTBD or Impact Mapping can supply that upstream rationale.

EventStorming belongs roughly in the same family: it is explicitly a collaborative exploration method for complex business domains. ([EventStorming](https://www.eventstorming.com/ "EventStorming"))

## 8. SEI: business goals -> quality scenarios -> architecture


Another group of methods examines **architectural forces**: the needs and constraints that shape a design.

SEI's **Quality Attribute Workshop / ATAM** methods start with **business and mission goals**. They identify the quality attributes that matter to the architecture and turn them into concrete scenarios before analyzing the design. ([SEI](https://insights.sei.cmu.edu/library/the-sei-quality-attribute-workshop/ "The SEI Quality Attribute Workshop"))

For example:

```text
Business concern:
Customers abandon checkout when response is slow
       ↓
Quality goal:
Checkout latency
       ↓
Scenario:
At peak traffic, checkout confirmation completes in < 2 s
       ↓
Architectural forces:
capacity, caching, consistency, failure modes, topology...
       ↓
Architectural decisions
```


This is very good for answering:

> "Why does this architecture need a queue/cache/replica/failover mechanism?"

The reason for the mechanism can be traced to a concrete quality-attribute scenario, and from there to a business need.

It doesn't solve the functional/JTBD side by itself.

## 9. arc42 -- useful as the envelope around all of this


arc42 is worth distinguishing from C4.

Its first section explicitly asks for the **driving forces** of the architecture:

- underlying business goals,
- essential features/functional requirements,
- architecture quality goals,
- stakeholders and expectations. ([arc42 Documentation](https://docs.arc42.org/section-1/ "1 - Introduction and Goals | arc42 Documentation"))

Its solution-strategy section connects the main architecture choices to the problem, quality goals, and constraints. ([arc42 Documentation](https://docs.arc42.org/section-4/ "4 - Solution strategy | arc42 Documentation"))

And the newer **Architecture Inception Canvas** goes further: it starts with the business case/economic driver and quality goals before proceeding to architecture. ([Software Architecture Canvas](https://canvas.arc42.org/architecture-inception-canvas "Architecture Inception Canvas - Software Architecture Canvas"))

For this purpose, arc42 provides a more complete **document structure** than C4 alone. It has places to record the reasons for decisions alongside the structural views.

But it doesn't impose strong traceability such as:

```text
JTBD-17 → Scenario-4 → Capability-X → Service-Y → ADR-23
```


Such links need to be added explicitly.

## A causal architecture model


One proposed way to combine these methods is a **causal architecture model**:

```text
          PRODUCT / PROBLEM WORLD

               User / Actor
                    │
                    ▼
             Need / JTBD
                    │
                    ▼
          Desired outcome
                    │
                    ▼
       Behaviour / Impact / Goal
                    │
                    ▼
       Scenario / Domain story
                    │
                    ▼
           Required capability
                    │
                    ▼
         System responsibility
                    │
                    ▼
       ┌──── Architectural ────┐
       │       decision        │
       ▼                       ▼
  Component                Quality
  / service                mechanism
       │                       │
       └───────────┬───────────┘
                   ▼
            Implementation
```


The important property here is that **every downward edge means "therefore this is required..."**.

And every upward edge means **"this exists because..."**.

This adds questions about purpose to structural questions such as:

> "What does this service call?"

Questions about the reasons for the design include:

> "Remove this service. Which user outcome becomes impossible?"

or:

> "Why is this Kafka topic here?"

and walk:

```text
Kafka topic
  ↑ because
asynchronous processing
  ↑ because
checkout must remain available if fulfillment is degraded
  ↑ because
checkout availability scenario Q-03
  ↑ because
customers must be able to place orders
  ↑ because
JTBD: acquire product when needed
```


This explains the reasons behind the architecture.

## A practical methodology


C4 can describe the structure at the lower end of this reasoning chain:

```text
JTBD / Impact Mapping
        ↓
Domain Storytelling / EventStorming
        ↓
Capabilities + quality-attribute scenarios
        ↓
Architecture decisions
        ↓
C4
```


Record the links between the levels:

```text
JTBD-12
  └─ DomainStory-07
      ├─ Capability-CustomerIdentity
      │   ├─ ADR-018
      │   └─ C4:System.Identity
      └─ Capability-AccountRecovery
          ├─ ADR-027
          └─ C4:Container.RecoveryService
```


For a more formal approach, **URN** is the closest existing model found in this comparison that combines goals and scenarios.

A lighter practical approach combines **JTBD -> Impact Mapping -> Domain Storytelling/EventStorming -> capabilities -> arc42/C4**, with **QAW-style quality scenarios** supplying the non-functional architectural forces.

The Capital One article provides an example of the chain: **JTBD -> capability -> system -> target architecture**. ([Capital One](https://www.capitalone.com/tech/software-engineering/leveraging-jtbd/ "Leveraging Jobs to Be Done to Start a Target Architecture | Capital One"))
