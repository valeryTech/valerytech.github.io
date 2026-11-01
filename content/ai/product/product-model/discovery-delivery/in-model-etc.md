---
draft: false
toc: true
title: "In-Model Notes: Funnel, Experiments, Timeboxes"
description: "An evolving operating-model draft traces the shift from feature teams to outcome ownership, then refines the discovery-delivery interface around candidate solutions, supporting evidence, remaining risks, and constraints."
linkTitle: "In-Model Notes"
---

- Capability funnel
- Experimental-based planning
- Timeboxes
- Evaluation infrastructure (as well as CI/CD and test infra)
- Sharing failed experiments

Working proposition, still to review: teams should receive a problem and desired outcome, then discover a solution that is valuable, usable, feasible, and viable. Discovery explicitly involves rapid experimentation.

## From old to the new model

### 1. Old model: feature team


Proposed model:

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
Outcome ???
```


Cagan's [Product vs Feature Teams](https://www.svpg.com/product-vs-feature-teams/) describes essentially this chain: stakeholders understand their own needs, select features/projects they believe will address them, and give those priorities to feature teams through a roadmap. The designer designs the feature and engineers build it; value and viability of the selected feature remain with whoever requested it.

So its system model is:

| Attribute                           | Feature team                                                          |
| ----------------------------------- | --------------------------------------------------------------------- |
| **Inputs**                          | Feature/project, requirements, priority, expected delivery date       |
| **Activities**                      | Specification -> design -> implementation -> test -> deployment       |
| **Primary decisions owned by team** | How to implement the requested solution                               |
| **Outputs**                         | Shipped features/projects                                             |
| **Expected outcome**                | Customer/business result that motivated the feature                   |
| **Feedback**                        | Mostly after the feature has been built and released                  |
| **Accountability**                  | Team: delivery/output. Stakeholder/requester: assumed value/viability |

### 2. Where the old model breaks


That separation creates a structural problem, alongside other problems. #review #todo Expand the problem analysis of the old model.

That is why Cagan argues that this type of team cannot reasonably be held accountable for business outcomes: it didn't choose the solution.

<!-- Draft marker: XX -->

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
- **Feasibility:** can we build it with our technology, skills and time?
- **Viability:** does it work for the business? ([Silicon Valley Product Group](https://www.svpg.com/four-big-risks/ "The Four Big Risks - Silicon Valley Product Group : Silicon Valley Product Group"))

The feature-team system deals with these asymmetrically. Designers and engineers may address usability and feasibility while executing the feature. Value and business viability are largely assumptions embedded in the original stakeholder request. ([Silicon Valley Product Group](https://www.svpg.com/product-vs-feature-teams/ "Article: Product vs Feature Teams : Silicon Valley Product Group"))

A second problem is **the cost of learning**. A team may need to build most or all of the production feature before learning that the original solution was wrong.

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

Working characterization of the old system:

> **Convert stakeholder-selected solutions into production software efficiently.**

That is a legitimate operating system. Its weakness is that efficient production of solutions doesn't establish that they solve the underlying problem.

### 3. Empowered product team


Now change the system boundary.

Leadership still decides **which problems are important**. Empowerment does not mean teams choose whatever problems interest them. SVPG puts problem selection and team assignment explicitly with product leadership, based on product strategy. ([Silicon Valley Product Group](https://www.svpg.com/team-objectives-summary/ "Team Objectives - Summary - Silicon Valley Product Group : Silicon Valley Product Group"))

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


SVPG describes discovery and delivery as two continuous activities of the **same cross-functional team**. PM and design tend to spend more time in discovery and engineers more in delivery, but all three participate in both. ([Silicon Valley Product Group](https://www.svpg.com/discovery-delivery/ "Discovery - Delivery - Silicon Valley Product Group : Silicon Valley Product Group"))

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

Cagan summarizes the input as a leader explaining the strategic context, the problem the team needs to solve, and how success will be measured. ([Silicon Valley Product Group](https://www.svpg.com/team-objectives-summary/ "Team Objectives - Summary - Silicon Valley Product Group : Silicon Valley Product Group"))

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
    HOW do we build it?
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
    HOW do we test it?
    HOW do we build it?
    DID it produce the result?
    WHAT do we change if it didn't?
```


So "empowerment" isn't simply autonomy. It is a **transfer of solution decision rights together with outcome accountability**.

Leadership retains strategic choices. The team gets tactical solution choices. SVPG describes product strategy as deciding what problems to solve, discovery as finding a solution, and delivery as building that solution. ([Silicon Valley Product Group](https://www.svpg.com/product-strategy-overview/ "Product Strategy - Overview - Silicon Valley Product Group : Silicon Valley Product Group"))

### 5. How each change addresses an old-model problem


We can now make the causal mapping explicit:

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
| Every iteration requires expensive production work | Prototypes/test techniques address risks cheaply     | Several solution iterations can happen before production                       |
| Stakeholder and team can blame each other          | Decision authority and accountability move together  | The group choosing the solution also owns its result                           |

The article's discussion of "time to money" follows directly from this last part. Cagan's claim isn't simply that empowered engineers code faster. The proposed speedup comes from moving multiple iterations into inexpensive discovery before committing to production implementation.

<a id="6-so-i-would-model-the-transformation-this-way"></a>

### 6. Proposed transformation model


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
 outcome?

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

This is a possible foundation for modeling the wider Product Operating Model, because it also shows where the other dimensions connect. **Product strategy supplies the problems; empowered teams turn problems into solutions; discovery manages uncertainty around those solutions; delivery turns validated ideas into production changes; outcome measurement closes the loop.** ([Silicon Valley Product Group](https://www.svpg.com/product-strategy-overview/ "Product Strategy - Overview - Silicon Valley Product Group : Silicon Valley Product Group"))

The next useful step would be to model the **four risks as gates/feedback loops inside this system**, because that shows much more precisely what "discovery" actually does and why PM, design, and engineering have to work together.

During uncertain AI discovery, the primary unit of work is the **experiment**. The capability funnel organizes evidence from those experiments. The feature becomes the primary unit only after the team has enough evidence to productize the approach.

## structuring


When an empowered team is given a problem by product strategy, its build-to-learn work is primarily solution discovery. The team still has to understand the problem, and exploring solutions may deepen that understanding.

<!-- Draft marker: ++ -->

Discovery and delivery are a conceptual model, not serialized phases. Both happen continuously, and learning also happens during delivery and after deployment.

The distinction is therefore about **purpose of work**, not chronology:

- Discovery: build something primarily to reduce uncertainty.
- Delivery: build something primarily to operate for customers.

SVPG explicitly says learning continues in production and that the ultimate test of whether the problem was solved and outcome achieved can only happen once the product is live.

## feature/capability discussion

## Interface


The key point is that it is a **conceptual interface inside one team**, not a handoff between phases or groups. Discovery and delivery run continuously and the same cross-functional team owns both. The model warns against one group learning and another group executing. **Discovery and delivery are two continuous, parallel activities of the same cross-functional team**.

"We have enough evidence that this solution is worth building" or "We have sufficient evidence to believe this solution will work."

representation of solution

shared understanding

relevant constraints

<!-- Draft marker: +++ -->

We can now place a candidate solution at the Discovery-Delivery interface and ask a very concrete question: **what evidence should exist before we spend Delivery capacity productizing it, and which uncertainties can only be resolved after it becomes live?**

<!-- Draft marker: +++ -->

Open drafting task: revise the description of what happens at this point. Original unfinished comment: "to change - because th".

- Discovery asks: Do we have enough evidence that this is the solution worth building?
- Delivery asks: Can we turn this into the production-quality solution customers can depend on?

Cagan describes the transition as: once the team has evidence that it knows the solution it needs, engineers build the production-quality software. In the newer material, the prototype is the primary way the discovered solution is communicated--"prototype as spec"--with use cases and non-functional requirements supplementing it where needed

So our interface can be modeled as:

DISCOVERY: effective solution + evidence + prototype + shared team understanding + relevant constraints / NFRs -> conceptual interface -> DELIVERY

But this is **not a handoff**. The same PM, designer, and engineers are responsible for both activities; having one group learn and another group execute is an anti-pattern.

This is a **two-way interface**.

Discovery influences Delivery:

- what solution to productize;
- intended customer experience;
- known risks and constraints;
- evidence about value/usability/feasibility/viability.

Delivery influences Discovery:

- engineering knowledge shapes feasible solution ideas;
- implementation can reveal constraints;
- production generates much richer usage data;
- actual outcomes can show that the solution hypothesis was wrong.

<!-- Draft marker: +++ -->

<!-- Draft marker: +++ -->

### What crosses the interface?


There seem to be four things.

**1. A solution, sufficiently defined.** Discovery has moved from many possible approaches to a particular solution that the team believes is worth productizing.

We use prototype as the main representation of that solution -- **"prototype as spec."** The prototype communicates what the intended experience should be.

**2. Evidence that justifies the investment.** The decision to productize isn't simply: prototype works -> delivery

Discovery tests the solution against the four risks. Cagan explicitly says the team seeks "evidence (or, when necessary, proof)" that something is worth building and deploying. The amount and kind of evidence depend on the risk.

So conceptually:

Solution S + Evidence Evalue + Evidence Eusability + Evidence Efeasibility + Evidence Eviability │ ▼ decision: worth production investment?

**3. Shared understanding.** This is easy to miss. The engineers who will productize the solution are already participating in discovery. They have seen prototype iterations, assessed feasibility, contributed technical ideas, and developed an understanding of why the solution looks the way it does.

When engineers have interacted with the discovery prototype, asked questions, and identified missing use cases, later implementation is faster and has fewer expensive detours.

**4. Additional delivery requirements.** The prototype doesn't necessarily encode everything required for production.

A PRD may supplement the prototype with things that are hard to represent there--for example specific use cases and non-functional requirements such as expected scale. The warning is that the PRD supplements discovery; it doesn't replace discovery.

## Discovery

## Capability funnel


Capability funnel is a progressive levels of utility for an AI system, beginning with basic operation and ending with fully solving the user's job. We could say it's practical way to show increasing utility across several dimensions--syntax, execution, relevance, intent, and job completion.

We won't use "funnel" for the path from problems to possible solutions. That structure is better described as an **option tree**, **solution space**, or simply a decision process.

It is **not another phase in the lifecycle**. It is an evaluation model that we can apply to an AI solution while discovering and improving it.

Capability funnel should attach to the **solution**, or more precisely to the solution's ability to solve the user's job.

The solution is the evolving object. Capabilities describe what that solution must do. Experiments evolve the solution. The capability funnel shows how far the solution has progressed toward solving the job.

### Query assistant example


Suppose the problem is:

> Operations managers depend on analysts to answer routine questions from company data.

Potential solution:

> Let managers ask questions in natural language and get trustworthy answers directly.

The central value path could be:

```
User question
     │
     ▼
Understand intent
     │
     ▼
Map intent to company data / semantics
     │
     ▼
Construct correct query
     │
     ▼
Execute query
     │
     ▼
Interpret result
     │
     ▼
Give user a useful answer
```


So the funnel:

```
User job:
Get a trustworthy answer from company data without depending on an analyst.

        ▲
        │
L5  User can complete the analytical task
        ▲
        │
L4  Answer matches the user's actual intent
        ▲
        │
L3  Result is correct and relevant
        ▲
        │
L2  Generated query executes successfully
        ▲
        │
L1  System can generate a valid query
```

## Central Object


SVPG describes features as **potential solutions to problems**, and elsewhere defines a feature as output: a particular approach to a solution that someone wants built.

Proposal: stop making "feature" the main lifecycle object.

The more useful central concept is **solution**.

And we could present the model as Discovery and Delivery are activities. The phase transformations happen to the solution.

```
ACTIVITIES                         STATES OF THE SOLUTION

Discovery ───────────────┐         idea
                         │         prototype
Delivery ────────────────┘         discovered solution
                                   production solution
                                   live product
```


Discovery moves from an idea that could solve a problem to a prototype of an effective solution; once there is a solution worth building, the team proceeds to production-quality delivery.

<!-- Draft marker: +++ -->

| Concept                         | Meaning                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Problem**                     | Condition we have been asked to change                                                                              |
| **Outcome**                     | How we know the problem has been meaningfully improved                                                              |
| **Solution idea**               | One possible approach to solving the problem                                                                        |
| **Prototype**                   | Cheap representation/implementation used to learn about that solution                                               |
| **Effective solution**          | A solution for which we have enough evidence on value, usability, feasibility, and viability to justify building it |
| **Production solution/product** | Commercial-quality implementation created through delivery                                                          |
| **Capability**                  | An ability the live product now provides to a user or system                                                        |
| **Feature**                     | A concrete piece of product output that implements some part of the solution/capability                             |

### But "effective solution" needs care


There's a subtle issue in SVPG's language.

At the end of discovery, they call it an **effective solution**: valuable, usable, feasible, and viable.

But discovery hasn't actually proved the business outcome.

Cagan explicitly says the ultimate test of whether the problem was solved and the necessary outcome achieved can only happen once the product is live.

## Feature Role


We should stop making "feature" our main lifecycle object.

# Some Additional Remarks


Interface refinement proposal: simplify the current four-part interface because its items are different kinds of things.

The earlier formulation above says that Discovery -> Delivery carries a sufficiently defined solution, evidence, shared understanding, and additional delivery requirements. Proposed three-part formulation:

```text
                     DISCOVERY
                  build to learn
                        │
                        │
                        ▼
              ┌───────────────────┐
              │ Candidate solution│
              │                   │
              │ Evidence / risk   │
              │ profile           │
              │                   │
              │ Known constraints │
              └───────────────────┘
                        │
                        ▼
                     DELIVERY
                  build to operate
```


More precisely:

|What crosses|Meaning|
|---|---|
|**Candidate solution**|What we currently believe should be productized. A prototype may be its main representation.|
|**Evidence / risk profile**|Why we believe it is worth the production investment, plus material uncertainty that remains.|
|**Known constraints**|Business and technical conditions Delivery must respect: scale, security, compliance, integrations, etc.|

The **risk profile** can stay deliberately abstract:

```text
Risk profile

Value       ───── evidence / remaining uncertainty
Usability   ───── evidence / remaining uncertainty
Feasibility ───── evidence / remaining uncertainty
Viability   ───── evidence / remaining uncertainty
```


Those four dimensions come directly from the Four Big Risks: whether users choose it, can use it, engineering can build it with the available technology/time/skills, and whether it works for the business. The important principle is to address these risks early and collaboratively.

Proposal: remove **shared understanding** from the list of things "passed." It is important, but in this model it is a property of the team, not an interface artifact. The earlier formulation establishes that Discovery and Delivery are continuous activities of the same cross-functional team and explicitly warns against treating this as a handoff.

Proposed interface wording:

> **Delivery begins from a candidate solution, the evidence supporting it, its remaining risk profile, and the constraints already known.**

And the two-way nature remains:

```text
Discovery                           Delivery
─────────                           ────────

solution hypothesis ─────────────► production implementation
evidence / risk profile ─────────►
known constraints ───────────────►

                  ◄────────────── implementation findings
                  ◄────────────── operational constraints
                  ◄────────────── production evidence
                  ◄────────────── measured outcomes
```


This fits the earlier distinction: Discovery primarily reduces uncertainty; Delivery primarily creates something customers can depend on.

Terminology proposal: avoid saying that the four risks are fully "passed." Discovery only needs **enough evidence to justify the next investment**. The earlier formulation includes an important limitation: even an "effective solution" at the end of Discovery hasn't proved the business outcome; that ultimately requires a live product.

That gives us a fairly clean conceptual model:

```text
Problem + desired outcome
          │
          ▼
      DISCOVERY
          │
          │  candidate solution
          │  evidence + risk profile
          │  known constraints
          ▼
      DELIVERY
          │
          ▼
     Live product
          │
          ▼
  Outcome evidence
          │
          └──────────────► Discovery
```


Proposed level of detail for the main model: explain prototype-as-spec, NFRs, experiment design, evidence strength, and individual risk tests in supporting material about how the interface works.
