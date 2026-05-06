---
draft: false
toc: true
title: "02 System Design"
linkTitle: "02 System Design"
---
---

title: "System Design"

linkTitle: "System Design"

# System Design

## Core Principles


- **Feedback Loop:** In most cases, when working on a project or designing a new system, it's all about the existence of a feedback loop and shortening it.
- **Modularity:** [The Golden Age of Modularity](https://vladikk.com/2025/03/30/golden-age-of-modularity/)
- **Interactions:** The question of how to describe interactions is crucial for architecture analysis and for considering a system's behavior.
- **Contextual Design:** Architectural design is system design. System design is contextual design -- it is inherently about boundaries (what's in, what's out, what spans, what moves between), and about tradeoffs. It reshapes what is outside, just as it shapes what is inside.
- **Design Across Time:** System design is design across boundaries, and across (and over) time. It's integrative. The system itself shapes the possibilities and probabilities of sociotechnical adaption.

## Concepts and Patterns


- **Microservices:**
	- **IPC:** The choice of Inter-Process Communication mechanism is an important architectural decision that can impact application availability.
	- **Data Consistency:** To solve the complex problem of maintaining data consistency in a microservice architecture, an application must use a different mechanism that builds on the concepts of loosely coupled, asynchronous services.
	- **Distributed Tracing:** Another way of understanding the behavior of a microservices-based application.
- **Architectural Characteristics (ACs):** Effectiveness, maintainability, user friendliness, etc.
- **Frameworks:**
	- **TOGAF & Zachman:** [Wikipedia](https://en.wikipedia.org/wiki/Zachman_Framework)
	- **C4 Model:** [c4model.com](https://c4model.com/)
- **High-Level Concepts:**
	- **Eventual Consistency:** [Wikipedia](https://en.wikipedia.org/wiki/Eventual_consistency)
	- **C10k problem:** [Wikipedia](https://en.wikipedia.org/wiki/C10k_problem)
	- **CAP Theorem:** A requirement to maintain an eventually consistent replica of some data in order to implement a query.
- **MVP, POC, and Prototyping:**
	- Building a Minimum Viable Product (MVP) is a great first step to ensure that a team understands the constraints and requirements of the microservices style.
	- [Minimum Viable Product, Revisited](https://tidyfirst.substack.com/p/minimum-viable-product-revisited)

## Practices and Heuristics


- **Visualize Your Architecture:** A whole-team whiteboard session is often a useful exercise for reviewing the overall architecture as it evolves. Focus on key quality attributes that drive out your architectural vision (scalability, performance, usability concerns, etc.).
- **Heuristic Questions:** Use leading questions like "who?", "what?", "when?", "why?" to organize information and see the situation from a different angle.
- **Trial and Error:** Perceive each mistake as an experience that will help in making correct decisions in the future.
- **Lifecycle Analysis:** It's sometimes beneficial to introduce time in the analysis of an element/subsystem.
- **Create a practical toolbox** and use it during the processes of design, refactoring, and other activities.
- **Use flash cards** with questions and principles and use them repeatedly in checklists and design stages.

## Resources


- **Blogs & People:**
	- [System Design Blogs on workat.tech](https://workat.tech/system-design/article/best-engineering-blogs-articles-videos-system-design-tvwa05b8bzzr)
	- **Ruth Malan:** [ruthmalan.com](https://www.ruthmalan.com/)
	- **Vlad Khononov:** "Balancing"
	- **Diana Montalion:** [Book and videos](https://www.youtube.com/watch?v=m7cWdYVAzX0)
	- **Christian Posta:** [blog.christianposta.com](https://blog.christianposta.com/)
	- **The Frugal Architect:** [thefrugalarchitect.com](https://thefrugalarchitect.com/)
- **Architecture Centers:**
	- [AWS Architecture Center](https://aws.amazon.com/architecture)
- **Netflix Tech Blog:**
	- [Distributed Counter](https://netflixtechblog.com/netflixs-distributed-counter-abstraction-8d0c45eb66b2)
	- [Data Gateway](https://netflixtechblog.medium.com/data-gateway-a-platform-for-growing-and-protecting-the-data-tier-f1ed8db8f5c6)
	- [Performance Under Load (Adaptive Concurrency Limits)](https://medium.com/@NetflixTechBlog/performance-under-load-3e6fa9a60581)
