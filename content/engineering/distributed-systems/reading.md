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
  - [Vitillo 2021](/sources/ad3d4e8b5cefd65937e33aaa96a1f034.bin), *Understanding Distributed Systems*, second edition;
  - [Tornow 2025](/sources/70c0d56c1ae98a9f558a6a07dc87c787.bin), *Think Distributed Systems*;
  - [van Steen and Tanenbaum 2023](/sources/f2bbf8813969eb53517df7404b01c885.bin), *Distributed Systems*, fourth edition;
  - [Burns 2018](/sources/217f0c643d90d836d19e229608ed9405.bin), *Designing Distributed Systems*;
  - [Cachin et al. 2011](/sources/ba524a2347f2a938124b8603dc085d10.bin), *Introduction to Reliable and Secure Distributed Programming*;
  - [Wattenhofer 2016](/sources/31e8cfe1b5a2478873df1d290ecbc86b.bin), *Principles of Distributed Computing*, lecture notes.
- **Papers:**
  - [Lamport 1978](/sources/374efeb6477bfa54be13f19dc15cce9b.bin), *Time, Clocks, and the Ordering of Events in a Distributed System*;
  - [Chandy and Misra 1984](/sources/b96aa1604487a89124755ed1dad97dd4.bin), *The Drinking Philosophers Problem*;
  - [Abadi 2012](/sources/71a1481cb1f870e715b6be7feef91e92.bin), PACELC;
  - [Burckhardt 2014](/sources/7abc015740f3cc14b1ac9e64ffc75719.bin), *Principles of Eventual Consistency*, excerpt;
  - [Kleppmann 2015](/sources/163a59f55b2a55b55d2b612b4b906d03.bin), *A Critique of the CAP Theorem*;
  - [Gotsman et al. 2016](/sources/59710f6d9572a0a505cc420ab5f77304.bin), *'Cause I'm Strong Enough*.
- **Articles:** [Orosz and Nilsson 2024](/sources/596d036a67209aca6c534ece269cdee0.bin), *How to debug large, distributed systems: Antithesis*.
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
