---
draft: false
toc: true
title: "Consistency"
description: "The requirement side of consistency: design questions about visibility after writes, staleness, invariants, and partitions, a per-operation checklist, and pointers to the models, CAP, and PACELC in the distributed-systems notes."
linkTitle: "Consistency"
---

The design task is to describe the behavior each operation requires before choosing a model or a product. The models themselves are in [consistency guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}).

## Questions for a design


- What should a client observe immediately after creating or updating an object?
- Can different clients temporarily see different values? For how long, and with what consequence?
- Which invariants must hold when requests occur concurrently?
- What happens when replicas cannot communicate?
- How will replication lag, cache invalidation, and recovery affect the chosen behavior?

The [interviewing.io framework]({{< ref "system-design/interview/frameworks/framework-iv" >}}) uses the opportunity to relax requirements as a design tool. State the user-visible consequence of that relaxation.

## Patterns that address this


- **Consistency across services** (sagas, API composition, CQRS views, command-side replicas, the transactional outbox): [data across services]({{< ref "system-design/elements/data-across-services" >}}).
- **Consistency of copies within one store** (replication lag, cache staleness): [data at scale]({{< ref "system-design/elements/data-at-scale" >}}).
- **Duplicate processing** under retries and at-least-once delivery: [idempotent consumer]({{< ref "system-design/elements/communication" >}}#idempotent-consumer).

## Models and theorems


The theory behind these choices is in [consistency guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}). What a design needs from it:

- **Name the model.** Linearizable, sequential, causal, a session guarantee such as read-your-writes, or eventual. "Strong consistency" is not a model. See [consistency models]({{< ref "engineering/distributed-systems/guarantees" >}}#consistency-models) and [session guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}#session-guarantees).
- **CAP applies per operation and only during a partition.** An operation that needs linearizability must wait or fail on the side that cannot reach the others. See [what CAP proves]({{< ref "engineering/distributed-systems/guarantees" >}}#what-cap-proves).
- **PACELC applies to every request.** Replicated writes trade latency against consistency even with no partition. See [PACELC]({{< ref "engineering/distributed-systems/guarantees" >}}#pacelc).
- **Latency depends on which delay an operation waits for.** See [delay sensitivity]({{< ref "engineering/distributed-systems/guarantees" >}}#delay-sensitivity).
- **Only operations that can break an invariant together need to synchronize.** See [choosing consistency per operation]({{< ref "engineering/distributed-systems/guarantees" >}}#choosing-consistency-per-operation).

## In a design


For each important operation, record:

1. The consistency model it needs, by name.
2. What a client sees when it cannot reach the replicas it needs: an error, stale data, or a local write merged later.
3. Whether its latency depends on network delay, and which delay: within a datacenter or across regions.
4. The invariants it can break, and the operations it conflicts with.

The [coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination) section covers the consensus behind operations that must synchronize; [coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}) covers the operations that need not.

## Study backlog


Examples connecting an access pattern to its required guarantees. Use the [URL-shortener consistency drafts]({{< ref "system-design/projects/url-shortener/url-shortener-nfrs-v0" >}}) as material, including propagation delay, the transactional outbox, and PACELC.

## Sources


- *Understanding Distributed Systems*.
- *Designing Data-Intensive Applications*.
- [Consistency model](https://en.wikipedia.org/wiki/Consistency_model).
- [Sequential consistency](https://en.wikipedia.org/wiki/Sequential_consistency).
- [Consistency patterns -- systemdesign.one](https://systemdesign.one/consistency-patterns/).
- [Consistency patterns -- DesignGurus](https://www.designgurus.io/blog/Consistency-Patterns-Distributed-Systems).
- [Database consistency -- Alex DeBrie](https://www.alexdebrie.com/posts/database-consistency/).
- The papers on CAP, PACELC, and consistency choices are cited in [consistency guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}#sources).

## Library sources


- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 2 on nonfunctional requirements; chapters 6 and 10 for the models behind them
- [Davoudian et al. 2018](/sources/software-engineering/databases/davoudian-2018-survey-on-nosql-stores.pdf.enc), *A Survey on NoSQL Stores* ([doi:10.1145/3158661](https://doi.org/10.1145/3158661))
- [Gessert et al. 2016](/sources/software-engineering/databases/gessert-2016-nosql-database-systems-survey-and-decision-guidance.pdf.enc), *NoSQL database systems: a survey and decision guidance* ([doi:10.1007/s00450-016-0334-3](https://doi.org/10.1007/s00450-016-0334-3))
- [Gorton 2022](/sources/software-engineering/systems-and-operations/gorton-2022-foundations-of-scalable-systems.pdf.enc), *Foundations of Scalable Systems: Designing Distributed Architectures*
