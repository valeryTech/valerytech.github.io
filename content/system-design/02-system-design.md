---
draft: false
toc: true
title: "System Design Principles"
description: "Principles for making architectural choices through context, boundaries, feedback, state ownership, interactions, and explicit trade-offs."
document_status: "canonical"
linkTitle: "Design Principles"
---

System design is contextual: the users, boundaries, workload, organization, and expected changes determine which trade-offs matter. A design describes both the parts and their interactions over time.

## Start with the context


Identify what is inside the system, what is outside it, and what crosses the boundary. Connect technical choices to user needs and the few [architectural characteristics]({{< ref "system-design/nfr/non-functional-requirements" >}}) that drive this design.

Include the lifecycle in the analysis: how data is created, read, changed, and removed; how the system is deployed and operated; and how the design might evolve. The relevant architecture views depend on the question being examined.

## Use feedback to improve the design


Keep the feedback loop short. A whole-team whiteboard session, a concrete request trace, a prototype, or a small implementation can expose gaps in the current model. Treat mistakes as information for the next iteration.

An MVP or proof of concept can help test assumptions about requirements and constraints. Choose what to build according to what you need to learn. See [Minimum Viable Product, Revisited](https://tidyfirst.substack.com/p/minimum-viable-product-revisited).

## Make interactions and ownership explicit


For each important flow, show who calls whom, what information crosses the boundary, and which component owns the state. These questions connect the diagram to behavior.

Microservices bring particular questions about inter-process communication, state ownership, consistency across services, independent deployment, and distributed tracing. Use these questions to examine a service boundary before adding it to a design.

Modularity concerns what can change independently as well as how the system is divided. See [The Golden Age of Modularity](https://vladikk.com/2025/03/30/golden-age-of-modularity/).

## Compare choices in their setting


Name the problem, the constraints, the plausible alternatives, and the consequence of each choice. Select an approach and state what evidence or change in requirements would make you revisit it.

Use the [problem-solving checklist]({{< ref "system-design/frameworks/problem-solving-approach" >}}) alongside any of the [interview frameworks]({{< ref "system-design/frameworks" >}}). Keep a practical toolbox and use short questions or flash cards to recall it during design work.

## Models and further reading


- **Architecture views:** [C4 model](https://c4model.com/) and the [Zachman framework](https://en.wikipedia.org/wiki/Zachman_Framework); the original notes also mention TOGAF.
- **Distributed-system topics to study:** consistency models, the CAP theorem, and the [C10k problem](https://en.wikipedia.org/wiki/C10k_problem). Follow the [building-block map]({{< ref "system-design/elements/elements" >}}) for related topics.
- **Architecture writers:** [Ruth Malan](https://www.ruthmalan.com/), Vlad Khononov's "Balancing," [Diana Montalion](https://www.youtube.com/watch?v=m7cWdYVAzX0), and [Christian Posta](https://blog.christianposta.com/).
- **Operational and cost perspectives:** [The Frugal Architect](https://thefrugalarchitect.com/) and the [AWS Architecture Center](https://aws.amazon.com/architecture).
- **Engineering case studies:** Netflix's [distributed counter](https://netflixtechblog.com/netflixs-distributed-counter-abstraction-8d0c45eb66b2), [data gateway](https://netflixtechblog.medium.com/data-gateway-a-platform-for-growing-and-protecting-the-data-tier-f1ed8db8f5c6), and [adaptive concurrency limits](https://medium.com/@NetflixTechBlog/performance-under-load-3e6fa9a60581).

See the [resource catalog]({{< ref "system-design/resources" >}}) for more courses, talks, and papers. The [earlier principles note]({{< ref "system-design/archive/architecture-principles-v0" >}}) preserves the original wording and links.
