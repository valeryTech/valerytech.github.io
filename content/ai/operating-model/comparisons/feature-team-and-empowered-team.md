---
draft: false
toc: true
title: "Feature Team And Empowered Team"
linkTitle: "Feature Team And Empowered Team"
---
> **Editorial note:** This is a comparison from the source note. Its claim that the team is accountable for the customer or business result is not settled in the current operating model.

## From old to the new model

### 1. Old model: feature team


A rough model is:

```text
BUSINESS / STAKEHOLDERS
    │
    │ business needs, obligations, ideas
    │
    ▼
Choose a solution
(feature / project)
    │
    ▼
Prioritize + roadmap + date
    │
    ▼
┌───────────────────────────┐
│       FEATURE TEAM        │
│                           │
│ PM → requirements/spec    │
│        ↓                  │
│ Designer → design         │
│        ↓                  │
│ Engineers → build         │
└───────────────────────────┘
    │
    ▼
Delivered feature
    │
    ▼
Customers / business
    │
    ▼
Outcome unknown
```


Its system model is:

| Attribute                           | Feature team                                                          |
| ----------------------------------- | --------------------------------------------------------------------- |
| **Inputs**                          | Feature/project, requirements, priority, expected delivery date       |
| **Activities**                      | Specification -> design -> implementation -> test -> deployment       |
| **Primary decisions owned by team** | How to implement the requested solution                               |
| **Outputs**                         | Shipped features/projects                                             |
| **Expected outcome**                | Customer/business result that motivated the feature                   |
| **Feedback**                        | Mostly after the feature has been built and released                  |
| **Accountability**                  | Team: delivery/output. Stakeholder/requester: assumed value/viability |

Cagan therefore argues that this type of team cannot reasonably be held accountable for business outcomes because it did not choose the solution.

### 2. Where the old model breaks


The first major problem is **solution selection happens before most uncertainty has been tested**.

A feature is only a hypothesis about how to solve some underlying problem. Yet the old system converts that hypothesis into a commitment very early:

```text
problem
   ↓
untested solution hypothesis
   ↓
roadmap commitment
   ↓
investment
   ↓
evidence
```


Cagan's Four Big Risks makes the missing uncertainty clearer. Before investing heavily, there are at least four questions:

- **Value:** will customers choose it?
- **Usability:** can users use it?
- **Feasibility:** can the team build it with the available technology, skills, and time?
- **Viability:** does it work for the business? ([Silicon Valley Product Group](https://www.svpg.com/four-big-risks/ "The Four Big Risks - Silicon Valley Product Group : Silicon Valley Product Group"))

The feature-team system deals with these asymmetrically. Designers and engineers may address usability and feasibility while executing the feature. Value and business viability are largely assumptions embedded in the original stakeholder request. ([Silicon Valley Product Group](https://www.svpg.com/product-vs-feature-teams/?utm_source=chatgpt.com "Article: Product vs Feature Teams : Silicon Valley Product Group"))

A second problem is therefore **the cost of learning**. Most or all of the production feature may need to be built before the team learns that the original solution was wrong.

A third problem is **split knowledge and split responsibility**:

```text
Stakeholder
knows business need
+ selects solution
        │
        ▼ handoff
PM / designer
        │
        ▼ handoff
engineering
        │
        ▼
customers
```


Cagan argues that discovery and delivery shouldn't be performed by separate groups for the same reason: the people obtaining the learning need to stay involved in turning that learning into the solution. Otherwise information gets handed off and engineers become implementers of other people's decisions. ([Silicon Valley Product Group](https://www.svpg.com/discovery-delivery/ "Discovery - Delivery - Silicon Valley Product Group : Silicon Valley Product Group"))

Then there's a fourth problem that follows from the first three:

```text
feature ships
   │
   ├── outcome achieved → good
   │
   └── outcome not achieved
          │
          ▼
     who owns iteration?
          │
     new roadmap request
          │
     maybe someday...
```


This is how Cagan explains "orphaned" features: the first attempt doesn't work, but further iterations compete with all the other roadmap commitments.

The old system can be summarized as:

> **Convert stakeholder-selected solutions into production software efficiently.**

That is a legitimate operating system. Its weakness is that efficient production of solutions doesn't establish that they solve the underlying problem.

### 3. Empowered product team


The empowered-team model changes the system boundary.

Leadership still decides **which problems are important**. Empowerment does not mean teams choose whatever problems interest them. SVPG puts problem selection and team assignment explicitly with product leadership, based on product strategy. ([Silicon Valley Product Group](https://www.svpg.com/team-objectives-summary/?utm_source=chatgpt.com "Team Objectives - Summary - Silicon Valley Product Group : Silicon Valley Product Group"))

SVPG describes discovery and delivery as two continuous activities of the **same cross-functional team**. PM and design tend to spend more time in discovery and engineers more in delivery, but all three participate in both. ([Silicon Valley Product Group](https://www.svpg.com/discovery-delivery/ "Discovery - Delivery - Silicon Valley Product Group : Silicon Valley Product Group"))

Cagan summarizes the input as a leader explaining the strategic context, the problem the team needs to solve, and how success will be measured. ([Silicon Valley Product Group](https://www.svpg.com/team-objectives-summary/?utm_source=chatgpt.com "Team Objectives - Summary - Silicon Valley Product Group : Silicon Valley Product Group"))

The flow becomes:

```text
PRODUCT LEADERSHIP
    │
    ├── product strategy / context
    ├── problem to solve
    ├── desired outcome
    └── success measures
    │
    ▼
┌─────────────────────────────────────┐
│       EMPOWERED PRODUCT TEAM        │
│                                     │
│   PM + Designer + Engineers         │
│            │                        │
│            ▼                        │
│       DISCOVERY                     │
│                                     │
│ Problem → ideas → prototypes        │
│          → tests → evidence         │
│                                     │
│ value / usability / feasibility /   │
│ viability                           │
│            │                        │
│            ▼                        │
│        DELIVERY                     │
│        build / deploy               │
└─────────────────────────────────────┘
    │
    ▼
Product in customers' hands
    │
    ▼
Measure outcome
    │
    ├── achieved → next problem
    │
    └── not achieved
           │
           └────────► DISCOVERY
                     iterate
```


Its system model becomes:

| Attribute                           | Empowered product team                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Inputs**                          | Problem/objective, desired outcome, strategic context, success measures, business constraints                     |
| **Activities**                      | Understand problem -> generate solutions -> test four risks -> prototype -> build -> deploy -> measure -> iterate |
| **Primary decisions owned by team** | Which solution can best achieve the outcome                                                                       |
| **Outputs**                         | Evidence, prototypes, learning, production software                                                               |
| **Outcome**                         | Measured customer/business result                                                                                 |
| **Feedback**                        | Continuous discovery plus post-release outcome measurement                                                        |
| **Accountability**                  | Team is accountable for solving the assigned problem / achieving the necessary result                             |

### 4. The transformation is a change in where decisions happen


This is perhaps the core of the model.

Old:

```text
Leadership / stakeholder:
    WHAT problem?
    WHICH solution?
    WHEN?
          │
          ▼
Team:
    HOW should it be built?
```


Empowered:

```text
Leadership:
    WHICH problems matter?
    WHY?
    WHAT result is needed?
          │
          ▼
Product team:
    WHICH solution?
    HOW should it be tested?
    HOW should it be built?
    DID it produce the result?
    WHAT should change if it did not?
```


"Empowerment" is not simply autonomy. It is a **transfer of solution decision rights together with outcome accountability**.

Leadership retains strategic choices. The team gets tactical solution choices. SVPG describes product strategy as deciding what problems to solve, discovery as finding a solution, and delivery as building that solution. ([Silicon Valley Product Group](https://www.svpg.com/product-strategy-overview/?utm_source=chatgpt.com "Product Strategy - Overview - Silicon Valley Product Group : Silicon Valley Product Group"))

### 5. How each change addresses an old-model problem


The causal mapping is:

| Problem in feature-team model                      | Structural change                                    | Why it should help                                                             |
| -------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| Stakeholder solution is treated as a requirement   | Team receives a **problem + outcome**                | Multiple solutions remain possible                                             |
| Value is mostly assumed before development         | **Discovery before expensive delivery**              | Test whether customers care before full investment                             |
| Usability discovered late                          | Designer participates in discovery                   | Test interaction before production implementation                              |
| Feasibility discovered during implementation       | Engineers participate in discovery                   | Technical constraints and new technical possibilities shape the solution early |
| Business viability is dispersed among stakeholders | PM works with stakeholders on viability              | Constraints become part of solution discovery                                  |
| Learning is handed from one group to another       | Same cross-functional team owns discovery + delivery | Learning stays with the people making the product                              |
| Engineers implement other people's ideas           | Engineers help discover solutions                    | Technical knowledge becomes a source of solution ideas                         |
| Team success = feature shipped                     | Team receives measurable outcome                     | Success criterion becomes impact                                               |
| Failed feature becomes another roadmap request     | Team remains responsible for the problem             | Failed first attempt drives another iteration                                  |
| Stakeholder and team can blame each other          | Decision authority and accountability move together  | The group choosing the solution also owns its result                           |
| Every iteration requires expensive production work | Prototypes/test techniques address risks cheaply     | Several solution iterations can happen before production                       |

The proposed speed does not come only from engineers writing code faster. It comes from trying several possible solutions through less expensive discovery before committing to production implementation.

### 6. Transformation model


At the highest level:

```text
FEATURE TEAM

Stakeholder need
      ↓
stakeholder solution
      ↓
roadmap commitment
      ↓
      BUILD
      ↓
    output
      ↓
 outcome unknown

EMPOWERED PRODUCT TEAM

Strategy
   ↓
problem + desired outcome
   ↓
DISCOVER ↔ DELIVERY
   ↑          │
   │          ▼
   └── measure outcome
```


Or in one sentence:

> **The old system manages the flow of solutions into engineering; the empowered-team system manages the flow of problems through discovery and delivery until they produce outcomes.**
