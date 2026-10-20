---
draft: false
toc: true
title: "Consistency"
description: "Design questions and study references for specifying visibility after writes, acceptable staleness, concurrency invariants, replication behavior, and consistency trade-offs."
linkTitle: "Consistency"
---

Study note in progress. The immediate design task is to describe the behavior required by each operation before choosing a model or a product.

## Questions for a design


- What should a client observe immediately after creating or updating an object?
- Can different clients temporarily see different values? For how long, and with what consequence?
- Which invariants must hold when requests occur concurrently?
- What happens when replicas cannot communicate?
- How will replication lag, cache invalidation, and recovery affect the chosen behavior?

The [interviewing.io framework]({{< ref "system-design/frameworks/framework-iv" >}}) uses the opportunity to relax requirements as a design tool. State the user-visible consequence of that relaxation.

## Study backlog


Definitions and models; consistency patterns; examples connecting an access pattern to its required guarantees. Use [URL-shortener consistency drafts]({{< ref "system-design/projects/url-shortener/url-shortener-nfrs-v0" >}}) as material to examine, including propagation delay, the transactional outbox, and PACELC.

## Sources


- *Understanding Distributed Systems*.
- *Designing Data-Intensive Applications*.
- [Consistency model](https://en.wikipedia.org/wiki/Consistency_model).
- [Sequential consistency](https://en.wikipedia.org/wiki/Sequential_consistency).
- [Consistency patterns -- systemdesign.one](https://systemdesign.one/consistency-patterns/).
- [Consistency patterns -- DesignGurus](https://www.designgurus.io/blog/Consistency-Patterns-Distributed-Systems).
- [Database consistency -- Alex DeBrie](https://www.alexdebrie.com/posts/database-consistency/).
