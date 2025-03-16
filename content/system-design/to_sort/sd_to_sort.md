---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Sd To Sort
toc: true
weight: 810
---

# Various

Think Big - Start Small

Fake it until you can make it

The ivory-tower architect most enjoys an end-state vision of ringing crystal perfection, but the pragmatic architect constantly thinks about the **dynamics of change**.

A new architect will focus on the boxes; an experienced one is more interested in the arrows.


Thus, the set of architectural structures is neither fixed nor limited. What is architectural depends on what is useful to reason about in your context for your system. This means that architecture *specically and intentionally omits certain information* about elements that is not useful for reasoning about the system.

There is a reasoning behind the design of Kafka and Samza, which allow complex applications to be built by composing a small number of simple primitives – replicated logs and stream operators. #architecture

Picking the right architecture = Picking the right battles + Managing trade-offs

Robustness principle. Be conservative in what you do, be liberal in what you accept from others. #engineering

This also makes testing useful as a design tool #engineering

# Fundamentals of SA & SA Hard Parts

Because virtually every problem presents novel challenges, the real job of an architect lies in their ability to objectively determine and assess the set of trade-offs on either side of a consequential decision to resolve it as well as possible.

## Other

Meilir Page-Jones made the astute observation that coupling in architecture may be split into static and dynamic coupling. *Static coupling* refers to the way architectural parts (classes, components, services, and so on) are wired together: dependencies, coupling degree, connection points, and so on. *Dynamic couplin*g refers to how architecture parts call one another: what kind of communication, what information is passed, strictness of contracts, and so on.

ATAM process

Architectural modularity: increased scalability is only one benefit of architectural modularity. Another important benefit is agility, the ability to respond quickly to change.

Modularity Drivers
Architects shouldn't break a system into smaller parts unless clear business drivers exist. The primary business drivers for breaking applications into smaller parts include *speed-to-market* (sometimes called time-to-market) and achieving a level of competitive advantage in the marketplace.

Elasticity relies on services having a very small mean time to startup (MTTS), which is achieved  architecturally by having very small, fine-grained services.


## Architectural characteristics

Architects may collaborate on defining the domain or business requirements, but one key responsibility entails defining, discovering, and otherwise analyzing all the things the software must do that isn't directly related to the domain functionality: architectural characteristics (AC).

When designing an application, the requirements specify what the application should do; architecture characteristics specify operational and design criteria for success, concerning how to implement the requirements and why certain choices were made. For example, a common important architecture characteristic specifies a certain level of performance for the application, which often doesn't appear in a requirements document. Even more pertinent: no requirements document states "prevent technical debt," but it is a common design consideration for archi‐ tects and developers.

*Main goal:*
Thus, a critical job for architects lies in choosing *the fewest* architecture characteristics rather than the most possible.

### Trade-Offs and Least Worst Architecture

Applications can only support a few of the architecture characteristics we've listed for a variety of reasons. First, each of the supported characteristics requires design effort and perhaps structural support. Second, the bigger problem lies with the fact that each architecture characteristic often has an impact on others. For example, if an architect wants to improve security, it will almost certainly negatively impact performance. More often, the decisions come down to trade-offs between several competing concerns.

Our goal is to investigate how to do trade-off analysis in distributed architectures; to do that, we must pull the moving pieces apart so that we can discuss them in isolation to understand them fully before putting them back together.

Distributed architectures like microservices are difficult, especially if architects cannot untangle all the forces at play. What we need is an approach or framework that helps us figure out the hard problems in our architecture

Problem with decoupling:
Architects design fine-grained microservices to achieve decoupling, but then orchestration, transactionality, and asynchronicity become huge problems. Until now, architects lacked the correct perspective and terminology to allow a careful analysis that could determine the best (or least worst) set of trade-offs on a case-by-case basis.

## Processes of SD

## Trade-offs Analysis

To analyze trade-offs, an architect must first determine what forces need to trade off with each other.

### Architectural Characteristics

Identifying the driving architectural characteristics is one of the first steps in creating an architecture or determining the validity of an existing architecture.

Understanding the key domain goals and domain situation allows an architect to translate those domain concerns to "-ilities," which then forms the basis for correct and justifiable architecture decisions.

One tip when collaborating with domain stakeholders to define the driving architecture characteristics is to work hard to keep the final list *as short as possible*. A common anti-pattern in architecture entails trying to design *a generic architecture*, one that supports all the architecture characteristics. Each architecture characteristic the architecture supports complicates the overall system design; supporting too many architecture characteristics leads to greater and greater complexity before the architect and developers have even started addressing the problem domain, the original motivation for writing the software. Don't obsess over the number of charateristics, but rather the motivation to keep design simple.

A better approach is to have the domain stakeholders select the top three most important characteristics from the final list (in any order).

### Component Design

Components form the fundamental modular building block in architecture, making them a critical consideration for architects. In fact, one of the primary decisions an architect must make concerns the top-level partitioning of components in the architecture.

Architects, often in collaboration with other roles such as developers, business analysts, and subject matter experts, create an initial component design based on general knowledge of the system and how they choose to decompose it, based on technical or domain partitioning. The team goal is an initial design that partitions the problem space into coarse chunks that take into account differing architecture characteristics.

Approaches:

- actors/actions approach.
- event storming
- workflow approach

### Choose architecture style

Choosing an architecture style represents the culmination of analysis and thought about tradeoffs for architecture characteristics, domain considerations, strategic goals, and a host of other things.

### Analysing architecture risks

Analyzing architecture risk is one of the key activities of architecture.

- 4+1 architecture model
- To successfully design, analyze, and evolve software, developers must consider all the coupling points that could break.

## Other Distributed Considerations

In addition to the eight fallacies of distributed computing previously described, there are other *issues and challenges* facing distributed architecture that aren't present in monolithic architectures:

- distributed logging
- distributed transactions
- contract maintenance and versioning

## Styles

## Data architecture concerns

There is separation between operational versus analytical data.

# Understanding Distributed Systems

Building reliable abstractions on top of unreliable ones is a common pattern we will encounter again in the rest of the book.
For example, this protocol could be TCP. TCP's reliability and stability come at the price of lower bandwidth and higher latencies than the underlying network can deliver

## Failure detection

Pings and heartbeats are generally used for processes that interact with each other frequently, in situations where an action needs to be taken as soon as one of them is no longer reachable. In other circumstances, detecting failures just at communication time is good enough.

## Time

But in a distributed system, there is no shared global clock that all processes agree on that can be used to order operations. And, to make matters worse, processes can run concurrently.

This happened-before relationship creates a causal bond between the two operations, since the one that happens first can have side-effects that affect the operation that comes after it. We can use this intuition to build a different type of clock that isn't tied to the physical concept of time but rather captures the causal relationship between operations: **a logical clock**.

A **vector clock** is a logical clock that guarantees that if a logical timestamp is less than another, then the former must have happened-before the latter. A vector clock is implemented with an array of counters, one for each process in the system. And, as with Lamport clocks, each process has its local copy.

## Leader election

There are times when a single process in the system needs to have special powers, like accessing a shared resource or assigning work to others. To grant a process these powers, the system needs to elect a leader among a set of candidate processes, which remains in charge until it relinquishes its role or becomes otherwise unavailable. When that happens, the remaining processes can elect a new leader among themselves.

A leader election algorithm needs to guarantee that there is at most one leader at any given time and that an election eventually completes even in the presence of failures. These two properties are also referred to as safety and liveness, respectively, and they are general properties of distributed algorithms. Informally, safety guarantees that nothing bad happens and liveness that something good eventually does happen.

Although having a leader can simplify the design of a system as it eliminates concurrency, it can also become a scalability bottleneck if the number of operations performed by it increases to the point where it can no longer keep up. Also, a leader is a single point of failure with a large blast radius; if the election process stops working or the leader isn't working as expected, it can bring down the entire system with it. We can mitigate some of these downsides by introducing partitions and assigning a different leader per partition, but that comes with additional complexity. This is the solution many distributed data stores use since they need to use partitioning anyway to store data that doesn't fit in a single node.

## Flow control

Flow control is a *backoff mechanism* that TCP implements to prevent the sender from overwhelming the receiver. The receiver stores incoming TCP segments waiting to be processed by the application into a receive buffer. Assuming *it's respecting the protocol*, the sender avoids sending more data than can fit in the receiver's buffer.

# DDIA

But the basic idea is still the same: each layer **hides the complexity of the layers below it** by providing a clean data model (27)

Other databases at that time forced application developers to think a lot about the internal representation of the data in the database. The goal of the relational model was to **hide that implementation detail behind a cleaner interface**.

(NoSQL) They embrace schemaless data, run on clusters, and have the ability **to trade off traditional consistency for other useful properties**. (Martin Fowler)

The JSON representation **has better locality** than the multi-table schema (32). It's worth pointing out that the idea of grouping related data together for locality is not limited to the document model (41).

Evolution of a data model: moreover, even if the initial version of an application fits well in a join-free document model, data has a tendency of becoming more interconnected as features are added to applications.

The ease of changes to be made to an application's data model. <- data models comparison

- ?? schema changes and migrations
- ?? joins in Document DBs

## Part II

...
In this part of the book, we focus on shared-nothing architectures—not because they are necessarily the best choice for every use case, but rather because they require the most caution from you, the application developer. If your data is distributed across multiple nodes, you need to be aware of the constraints and trade-offs that occur in such a distributed system—the database cannot magically hide these from you.

With an understanding of those concepts, we can discuss the difficult trade-offs that you need to make in a distributed system.

However, you do need to know how your software reacts to network problems and ensure that the system can recover from them.

We will now continue along the same lines, and seek abstractions that can allow an application to ignore some of the problems with distributed systems. For example, one of the most important abstractions for distributed systems is consensus: that is, getting all of the nodes to agree on something.

# Hopre - Architect

As our world is becoming more complex and difficult to understand, telling stories is one of the best ways to engage and teach.

An architect shouldn't ignore production issues, which provide valuable feedback into possible architectural weaknesses.

Making decisions is important, but I also believe in Martin Fowler's conclusion that "one of an architect's most important tasks is to eliminate irreversibility in software designs, avoiding the "big" decisions that cannot be easily reversed.

When asked to characterize the seniority of an architect, I resort to *a simple framework that I believe applies to most high-end professions*

As I converse with colleagues about what distinguishes a great architect, we often identify rational and disciplined decision-making as a key factor in translating skill into impact.

# Designing fine-grained microservices

## Key Concepts of Microservices

- *Independent Deployability.* Independent deployability is the idea that we can make a change to a microservice, deploy it, and release that change to our users, without having to deploy any other microservices. More important, it's not just the fact that we can do this; it's that this is actually how you manage deployments in your system. It's a discipline you adopt as your default release approach.
- *Modeled Around a Business Domain.* Rolling out a feature that requires changes to more than one microservice is expensive. You need to coordinate the work across each service (and potentially across sep‐ arate teams) and carefully manage the order in which the new versions of these services are deployed. That takes a lot more work than making the same change inside a single service (or inside a monolith, for that matter). It therefore follows that we want to find ways to make cross-service changes as infrequent as possible.
- *Owning Their Own State.* If a microservice wants to access data held by another microservice, it should go and ask that second microservice for the data. This gives the microservices the ability to decide what is shared and what is hidden, which allows us to clearly separate functionality that can change freely (our internal implementation) from the functionality that we want to change infrequently (the external contract that the consumers use).
- Microservices embrace the concept of information hiding.  Information hiding means hiding as much information as possible inside a component and exposing as little as possible via external interfaces. This allows for clear separation between what can change easily and what is more difficult to change. Implementation that is hidden from external parties can be changed freely as long as the networked interfaces the microservice exposes don't change in a backward-incompatible fashion. C

## CI

Integrate early, and integrate often. Avoid the use of long-lived branches for feature development, and consider trunk-based devel‐ opment instead. If you really have to use branches, keep them short!
