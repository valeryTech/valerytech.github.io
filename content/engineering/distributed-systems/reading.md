---
draft: false
toc: true
title: "Distributed Systems Reading List"
description: "Courses, books, papers, articles, and verification resources for studying distributed systems, with the books and papers in the library."
linkTitle: "Reading List"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

## In the library


The distributed-systems books and papers in the library:

- **Books:**
  - [Vitillo 2021](/sources/system-design/distributed-systems/vitillo-2021-understanding-distributed-systems.pdf.enc), *Understanding Distributed Systems*, second edition;
  - [Tornow 2025](/sources/system-design/distributed-systems/tornow-2025-think-distributed-systems.pdf.enc), *Think Distributed Systems*;
  - [van Steen and Tanenbaum 2023](/sources/system-design/distributed-systems/vansteen-2023-distributed-systems-4th-edition.pdf.enc), *Distributed Systems*, fourth edition;
  - [Burns 2018](/sources/system-design/distributed-systems/burns-2018-designing-distributed-systems.pdf.enc), *Designing Distributed Systems*;
  - [Cachin et al. 2011](/sources/system-design/distributed-systems/cachin-2011-reliable-and-secure-distributed-programming.pdf.enc), *Introduction to Reliable and Secure Distributed Programming*;
  - [Wattenhofer 2016](/sources/system-design/distributed-systems/wattenhofer-2016-principles-of-distributed-computing.pdf.enc), *Principles of Distributed Computing*, lecture notes.
- **Papers:**
  - [Lamport 1978](/sources/system-design/distributed-systems/lamport-1978-time-clocks-ordering-of-events.pdf.enc), *Time, Clocks, and the Ordering of Events in a Distributed System*;
  - [Chandy and Misra 1984](/sources/system-design/distributed-systems/chandy-1984-drinking-philosophers-problem.pdf.enc), *The Drinking Philosophers Problem*;
  - [Abadi 2012](/sources/system-design/distributed-systems/abadi-2012-consistency-tradeoffs-distributed-database-design.pdf.enc), PACELC;
  - [Burckhardt 2014](/sources/system-design/distributed-systems/burckhardt-2014-principles-of-eventual-consistency-excerpt.pdf.enc), *Principles of Eventual Consistency*, excerpt;
  - [Kleppmann 2015](/sources/system-design/distributed-systems/kleppmann-2015-critique-of-the-cap-theorem.pdf.enc), *A Critique of the CAP Theorem*;
  - [Gotsman et al. 2016](/sources/system-design/distributed-systems/gotsman-2016-cause-im-strong-enough-consistency-choices.pdf.enc), *'Cause I'm Strong Enough*.
- **Articles:** [Orosz and Nilsson 2024](/sources/system-design/distributed-systems/orosz-2024-debugging-distributed-systems-antithesis.pdf.enc), *How to debug large, distributed systems: Antithesis*.
- **Elsewhere in the library:** Kleppmann and Riccomini's *Designing Data-Intensive Applications* (second edition), Petrov's *Database Internals*, and the Dynamo paper.

## Courses and lectures


- [Martin Kleppmann's distributed systems course](https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB), with PDF lecture notes.
- [MIT 6.824 Distributed Systems](https://pdos.csail.mit.edu/6.824/schedule.html), strong on practice through its labs.
- [Distributed Algorithms -- Seif Haridi](https://www.youtube.com/playlist?list=PL700757A5D4B3F368).
- CS Primer, "Distributed Systems" (17 lessons, including replication, partitioning, consistency models, and consensus).
- [Think Distributed Systems with Dominik Tornow](https://www.youtube.com/watch?v=FBKDHpkdrGk).
- Udi Dahan, "Advanced Distributed Systems Design" (course; no link recorded).

## Reading guides and articles


- [Patterns of Distributed Systems -- Unmesh Joshi](https://martinfowler.com/articles/patterns-of-distributed-systems/).
- [Distributed systems theory for the distributed systems engineer -- The Paper Trail](https://www.the-paper-trail.org/post/2014-08-09-distributed-systems-theory-for-the-distributed-systems-engineer/).
- [Gray failures -- The Paper Trail](https://www.the-paper-trail.org/post/2020-04-19-gray-failures/).
- [Learning about distributed systems -- Murat Demirbas](https://muratbuffalo.blogspot.com/2020/06/learning-about-distributed-systems.html).
- AWS Builders' Library: [challenges with distributed systems](https://aws.amazon.com/builders-library/challenges-with-distributed-systems/), [avoiding fallback](https://aws.amazon.com/builders-library/avoiding-fallback-in-distributed-systems/), [leader election](https://aws.amazon.com/builders-library/leader-election-in-distributed-systems), [instrumenting for operational visibility](https://aws.amazon.com/builders-library/instrumenting-distributed-systems-for-operational-visibility).
- DesignGurus: [consistency patterns](https://www.designgurus.io/blog/consistency-patterns-distributed-system) and [split brain](https://www.designgurus.io/course-play/grokking-the-advanced-system-design-interview/doc/12-split-brain).

## Specification and verification


See [verification]({{< ref "engineering/distributed-systems/verification" >}}) for how these fit together.

- Leslie Lamport, *Specifying Systems*, and the [industrial use of TLA+](https://lamport.azurewebsites.net/tla/industrial-use.html).
- [Verifying distributed systems with Isabelle -- Martin Kleppmann](https://martin.kleppmann.com/2022/10/12/verifying-distributed-systems-isabelle.html).
- [Why TLA+ is important for concurrent programming](https://medium.com/@polyglot_factotum/why-tla-is-important-for-concurrent-programming-365d9eeb491e).
- [An introduction to model checking with TLA+](https://medium.com/@thesammiller/an-introduction-to-model-checking-with-tla-4898a8cccc5d).
- [Introduction to model checking, video series](https://www.youtube.com/watch?v=VHWEldcSx14&list=PLhZdSWbNhIbCQKxUta0VrDGg3gLguedIh).
