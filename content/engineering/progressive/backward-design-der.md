---
draft: false
toc: true
title: "Backward Design Der"
linkTitle: "Backward Design Der"
---
What you were doing was closer to **backward design derivation**:

> user need -> required outcome -> user workflow -> what the system must make possible at each step -> system responsibilities -> design

XXX

Yes. What you are looking for exists, but it sits mostly in **requirements engineering / strategic design / architecture evaluation**, rather than in architecture-diagramming methods.

Your observation about C4 is essentially consistent with C4's stated scope: C4 describes a software system through hierarchical abstractions and diagrams, and its FAQ explicitly says that it implies nothing about the software delivery/design process. It also says business processes, workflows, domain models, etc. are outside its main focus. ([C4 model](https://c4model.com/?utm_source=chatgpt.com "Home | C4 model"))

The distinction I'd make is:

> **Architecture description:** "What exists, and how is it connected?"
>
> **Architecture reasoning:** "What problem are we solving, for whom, what behavior/outcome is required, and therefore why must these architectural elements exist?"

You're looking primarily for the second category.

## The closest approaches I found

### 1. JTBD -> capabilities -> target architecture


There is actually an explicit industry approach doing almost exactly what you described.

Capital One published **"Leveraging Jobs to Be Done to Start a Target Architecture."** Their chain is roughly:

**Product vision -> JTBD -> capabilities -> systems/data/interfaces -> target architecture**

Their JTBD formulation is:

`While [situation], users need to [action], for the purpose of [goal]`

They then map the **action** to a business capability and decide which system should provide that capability. Repeating this across the JTBD inventory yields an initial architecture blueprint. They also combine this with EventStorming and pain points. ([Capital One](https://www.capitalone.com/tech/software-engineering/leveraging-jtbd/ "Leveraging Jobs to Be Done to Start a Target Architecture | Capital One"))

This is extremely close to your idea:

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


Now the `Account Details API` has a **causal ancestry**. You can navigate upward from technical artifact to capability to user job.

I'd put this near the top of your reading list.

### 2. JTBD-Oriented Requirements Engineering + RE4SA


There's also academic work surprisingly close to this.

Utrecht University researchers proposed **Jobs-to-be-Done Oriented Requirements Engineering**, formalizing Job Stories so that requirements explicitly contain **situation, motivation, and expected outcome** rather than becoming feature statements detached from their purpose. ([Utrecht University](https://research-portal.uu.nl/en/publications/jobs-to-be-done-oriented-requirements-engineering-a-method-for-de/ "Jobs-to-be-Done Oriented Requirements Engineering: A Method For Defining Job Stories

-  Utrecht University"))

A related Utrecht line of work developed **RE4SA -- Requirements Engineering for Software Architecture**. RE4SA explicitly links requirements to architectural elements: epic stories/user stories are related to modules/features, with the intent of keeping requirements and architecture aligned. ([Utrecht University Repository](https://dspace.library.uu.nl/handle/1874/396208 "Explicit Alignment of Requirements and Architecture in Agile Development"))

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


That is almost a direct research answer to your question.

RE4SA itself doesn't give you the product-level `why`; the JTBD-oriented RE work supplies that upstream context.

### 3. User Requirements Notation -- probably the closest _single modelling language_


This one is quite interesting and relatively obscure.

The ITU standard **User Requirements Notation (URN)** deliberately combines two complementary models:

- **GRL -- Goal-oriented Requirement Language**
- **UCM -- Use Case Maps**

GRL models things such as stakeholder goals and intentions; UCM models operational/functional scenarios and supports architectural reasoning. The ITU describes URN as supporting elicitation, analysis, specification, validation, and traceability of requirements. ([itu.int](https://www.itu.int/epublications/publication/itu-t-z-151-2018-10-user-requirements-notation-urn-language-definition?utm_source=chatgpt.com "User Requirements Notation (URN) - Language definition"))

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


For your stated criterion, **URN is one of the strongest matches** because goals and operational/architectural scenarios belong to one coherent notation instead of living in disconnected Jira tickets and architecture diagrams.

Its downside is cultural/practical: it comes from the more formal requirements-engineering tradition rather than today's lightweight product/engineering workflow.

### 4. Wardley Mapping -- user need as literal "north"


This may appeal to you for a different reason.

A Wardley Map starts by identifying:

1. users,
2. their needs,
3. capabilities required to satisfy those needs,
4. dependencies between those capabilities,
5. the evolutionary state of those capabilities.

The landscape is explicitly **anchored on the user and their needs**. ([learnwardleymapping.com](https://learnwardleymapping.com/landscape/?utm_source=chatgpt.com "Landscape"))

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


This gives every lower-level thing an answer to:

> **"Needed by what?"**

Which is exactly the missing property you're describing.

Wardley Mapping then adds another dimension: whether each capability is genesis/custom/product/commodity. That means you can reason about things like:

```text
user need
   ↓
capability
   ↓
dependency
   ↓
should we invent / build / buy / outsource / commoditize this?
```


It doesn't model runtime software behaviour very well. I would use it **above architecture**, particularly when reasoning about boundaries, ownership, build-vs-buy, platforms and strategic differentiation.

## 5. Problem Frames / Architectural Frames


Michael Jackson's **Problem Frames** tradition starts from a principle very close to what you're getting at:

software exists to produce some required effect **in a world outside the software**.

The approach explicitly separates:

```text
problem world
domain properties
requirement
machine/software
```


Jackson describes software development problems as being about the real environment in which the system must have its effect. ([Oro](https://oro.open.ac.uk/7513/?utm_source=chatgpt.com "Open Research Online"))

Later work connected Problem Frames directly to software architecture through **Architectural Frames** and related extensions: architecture can participate in decomposition of the problem while retaining the relationship to the original requirement/problem context. ([Oro](https://oro.open.ac.uk/3334/?utm_source=chatgpt.com "Open Research Online"))

This is philosophically very close to your objection to architecture-first reasoning.

Instead of:

```text
Browser → API Gateway → Service → DB
```


you begin with something like:

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


It's less product-management-flavoured than JTBD, but much stronger about **problem context**.

## 6. Impact Mapping


Impact Mapping is upstream from architecture, but its structure is almost ideal for providing the missing context:

```text
GOAL
 ↓
ACTORS
 ↓
IMPACTS / behaviour changes
 ↓
DELIVERABLES
```


Its explicit purpose is to show how technical deliverables are expected to create changes in actor behaviour and how those changes contribute to business goals. ([Impact Mapping](https://www.impactmapping.org/drawing.html?utm_source=chatgpt.com "Drawing impact maps"))

So instead of:

```text
Implement notification service
```


you get:

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


**Domain Storytelling** starts from actual domain actors performing activities with work objects. Its stated goal is to make business processes and domain knowledge tangible and then use that understanding to develop business software. ([Domain Storytelling](https://domainstorytelling.org/?utm_source=chatgpt.com "Domain Storytelling"))

The method can feed requirements, user-story mapping, domain modelling and DDD. ([Domain Storytelling](https://domainstorytelling.org/requirements?utm_source=chatgpt.com "Requirements - Domain Storytelling"))

So you can go:

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

For that, I'd put JTBD/Impact Mapping above it.

EventStorming belongs roughly in the same family: it is explicitly a collaborative exploration method for complex business domains. ([EventStorming](https://www.eventstorming.com/?utm_source=chatgpt.com "EventStorming"))

## 8. SEI: business goals -> quality scenarios -> architecture


There's another branch dealing with the _architectural forces_ part of your question.

SEI's **Quality Attribute Workshop / ATAM** methods deliberately derive architecturally important quality attributes from **business and mission goals** and turn them into concrete scenarios before analyzing architecture. ([SEI](https://insights.sei.cmu.edu/library/the-sei-quality-attribute-workshop/?utm_source=chatgpt.com "The SEI Quality Attribute Workshop"))

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

> "Why do we have this queue/cache/replica/failover mechanism?"

Because you can trace it to a concrete quality-attribute scenario and ultimately a business driver.

It doesn't solve the functional/JTBD side by itself.

## 9. arc42 -- useful as the envelope around all of this


arc42 is worth distinguishing from C4.

Its first section explicitly asks for the **driving forces** of the architecture:

- underlying business goals,
- essential features/functional requirements,
- architecture quality goals,
- stakeholders and expectations. ([arc42 Documentation](https://docs.arc42.org/section-1/?utm_source=chatgpt.com "1 - Introduction and Goals | arc42 Documentation"))

Its solution-strategy section then connects architectural cornerstones to the problem statement, quality goals and constraints. ([arc42 Documentation](https://docs.arc42.org/section-4/?utm_source=chatgpt.com "4 - Solution strategy | arc42 Documentation"))

And the newer **Architecture Inception Canvas** goes further: it starts with the business case/economic driver and quality goals before proceeding to architecture. ([Software Architecture Canvas](https://canvas.arc42.org/architecture-inception-canvas?utm_source=chatgpt.com "Architecture Inception Canvas - Software Architecture Canvas"))

So arc42 gives you a much better **document structure** than bare C4 for this purpose.

But it doesn't impose strong traceability such as:

```text
JTBD-17 → Scenario-4 → Capability-X → Service-Y → ADR-23
```


You'd add that yourself.

# I think the underlying model you're searching for is this


I would formulate it as a **causal architecture model**:

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


The important property here is that **every downward edge means "therefore we need..."**.

And every upward edge means **"this exists because..."**.

That gives you a much more useful architecture question than:

> "What does this service call?"

You can ask:

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


That's genuine architectural rationale.

## If I were assembling a practical methodology


I wouldn't replace C4. I'd put it at the lower end:

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


And make the traceability explicit:

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


For something more formal, **URN** is the closest ready-made unified model I found.

For something more contemporary/pragmatic, I'd investigate the combination of **JTBD -> Impact Mapping -> Domain Storytelling/EventStorming -> capabilities -> arc42/C4**, with **QAW-style quality scenarios** supplying the non-functional architectural forces.

And the Capital One article is particularly worth looking at because somebody has independently arrived at almost exactly the chain you're describing: **JTBD -> capability -> system -> target architecture**. ([Capital One](https://www.capitalone.com/tech/software-engineering/leveraging-jtbd/ "Leveraging Jobs to Be Done to Start a Target Architecture | Capital One"))
