---
draft: false
toc: true
title: "Consistency Guarantees"
description: "What a replicated system can promise about the values clients read: consistency models and their latency cost, session guarantees, transaction isolation levels, what CAP proves, PACELC, delay sensitivity, and choosing consistency per operation."
document_status: "draft"
linkTitle: "Guarantees"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** what can a replicated system promise about the values clients read and write, and what does each promise cost?

Every copy of data, whether a replica, a cache, or an index, can disagree with the others for a while. A guarantee names which disagreements a client may observe. Stronger guarantees hide more of them and cost more waiting on the network. The requirement side, deciding what each operation of a design needs, is in [consistency]({{< ref "system-design/nfr/consistency" >}}).

## Consistency models


State the requirement for each operation as one of these models, from strongest to weakest. Burckhardt (2014) builds the same hierarchy formally.

| Model | What a client observes | Lowest latency, as a function of network delay d |
| --- | --- | --- |
| Linearizable | Every read sees the latest completed write, as if there were one copy. | Reads and writes both wait for the network: O(d). |
| Sequential | All clients see operations in one order that respects each client's own order, but not necessarily real time. | Either reads or writes wait for the network, and the other can be local. |
| Causal | Effects appear after their causes, such as a comment after the post it answers. Concurrent operations may appear in different orders on different replicas. | Neither waits: O(1). Causal consistency is the strongest model that never has to wait for the network. |
| Read-your-writes and monotonic reads | A client sees its own writes, and never sees time move backward. | O(1), with sticky routing or a version tracked per client. |
| Eventual | Replicas converge once writes stop; a read can return any earlier value. | O(1); the application handles stale reads and conflicts. |

The latency column follows Kleppmann's (2015) summary of known lower bounds. For sequential consistency, a single register is an exception: Burckhardt shows one that is sequentially consistent with every operation answering at once, so the cost appears only with richer data types.

Three cautions on terms:

- **"Strong consistency"** is not a defined model. It can mean linearizability, sequential consistency, or one-copy serializability, so name the model instead.
- **Consistency models and isolation levels** are different restrictions. Consistency models constrain single-object operations across replicas; isolation levels such as serializability and snapshot isolation constrain multi-object transactions, usually on one copy.
- **The C in ACID** is a third, unrelated meaning: the application's invariants hold after each transaction.

The weaker per-client guarantees in [session guarantees](#session-guarantees) are often enough and cost far less than linearizability.

## Session guarantees


Terry et al. (1994) defined four guarantees for a single client's session. They are cheap because they constrain what one client sees, not what all clients agree on.

| Guarantee | The client never sees | Typical mechanism |
| --- | --- | --- |
| Read your writes | Its own earlier write missing. | Read data the user may have just changed from the leader, or from a replica known to have the write, for example by tracking the write's version. |
| Monotonic reads | Older data after newer data. | Route each client to the same replica, or track the latest version it has seen. |
| Monotonic writes | Its own writes applied out of order. | Order each client's writes by a per-client sequence number. |
| Writes follow reads | Its write applied before the writes it had read. | Send the versions the client has read along with its write. |

DDIA adds **consistent prefix reads**: readers see writes in an order that respects causality, so an answer never appears before its question. Partitioned stores break it when related writes land on different partitions; writing causally related data to the same partition, or tracking dependencies, restores it.

Causal consistency provides all four session guarantees across every client, not only within one session.

## Isolation levels


Isolation levels restrict what concurrent transactions may observe of each other's multi-object reads and writes. They are a different axis from the consistency models above, which describe single objects across replicas.

| Level | Prevents | Still allows |
| --- | --- | --- |
| Read committed | Dirty reads (seeing uncommitted data) and dirty writes (overwriting uncommitted data). | Read skew, lost updates, write skew. |
| Snapshot isolation | The above, plus read skew: each transaction reads a consistent snapshot. | Write skew; lost updates, unless the database detects them, as some implementations do. |
| Serializable | Every race condition: the result equals some serial order of the transactions. | Nothing, at the cost of serial execution, two-phase locking, or aborts under serializable snapshot isolation. |
| Strict serializability | Everything serializability prevents, and the serial order also respects real time. | Nothing; it combines serializability with linearizability. |

Level names are not portable. "Repeatable read" means snapshot isolation in some databases and something weaker in others, so check what a given database actually provides. **Write skew** is the anomaly to watch for: two transactions each read the same data, decide based on it, and write different objects, as when two doctors both leave an on-call rota that requires at least one of them. Mechanics and examples are in [transactions]({{< ref "engineering/distributed-systems/transactions" >}}).

## CAP and PACELC

### What CAP proves


Fox and Brewer stated the CAP principle in 1999, and Gilbert and Lynch proved a version of it in 2002. In an asynchronous network that can lose messages, no read-write register can guarantee both linearizability and that every request to a non-failing node eventually gets a response.

**What the terms mean** (Kleppmann 2015):

- **C is linearizability**, one model from the table above. Fox and Brewer used one-copy serializability. It is not the C in ACID, and CAP says nothing about the weaker models.
- **A means every non-failing node eventually answers**, with no bound on latency. That is a property of an algorithm, not the uptime percentage engineers measure. A leader-based database with 99.99 percent uptime is "unavailable" in this sense, because a client cut off from the leader cannot write even when it can reach another replica.
- **P is an assumption, not a feature.** It says partitions can occur. Networks do partition, so a distributed system has to assume it, and "pick two" with a "CA" option is misleading.
- **The proof needs partitions that never heal.** If every partition eventually ends, a linearizable algorithm can wait it out and still satisfy A, which sets no deadline. Under a partition that never heals, eventual consistency is impossible too, because no information crosses it.

**Its scope is narrower than its reputation:**

- It covers one model and, in Gilbert and Lynch's form, one data type. Burckhardt (2014) proves a version for sequential consistency that holds for all but the simplest data types.
- It covers only the time a partition exists. With no partition, it allows full consistency and availability together (Abadi 2012).
- Kleppmann concludes that CAP has done its job, prompting the exploration of weaker models, and should no longer be used to justify design decisions.

**What remains useful:** during a partition, an operation that needs linearizability must wait or fail on the side that cannot reach the others. Make that choice per operation:

- A ticket booking rejects the write when the primary is unreachable, because a double booking is worse than an error.
- A news feed serves stale data from any replica, because an old feed is better than none.

### PACELC


Abadi (2012) starts from an observation: Dynamo, Cassandra, Riak, and PNUTS weaken consistency all the time, not only during partitions, which are rare. The reason is latency, not CAP. High availability requires replication, and once data is replicated, every update trades consistency against latency, with or without a partition.

**The formulation:** if there is a Partition (P), how does the system trade Availability against Consistency (A and C)? Else (E), in normal operation, how does it trade Latency against Consistency (L and C)?

**Where the latency comes from.** An update can go first to one of three places, and each forces the trade-off:

| Update goes first to | Consistent option, and its latency | Fast option, and its inconsistency |
| --- | --- | --- |
| All replicas at once | An agreement protocol or a preprocessor orders the updates, adding messages or a detour. | Without agreement, replicas may apply concurrent updates in different orders and diverge. |
| An agreed master for each item | Synchronous replication waits for the slowest replica. Reads routed to the master travel to it, possibly across a WAN, and wait if it is overloaded. A quorum with R + W > N sits in between. | Asynchronous replication with reads served by any replica returns stale values. |
| Any node | Synchronous replication pays the master case's latency, plus detecting concurrent updates made at different nodes. | Asynchronous replication diverges as in the two cases above. |

Within one datacenter, synchronous replication to a master can be cheap. Across a WAN, there is no way around the trade-off. Even R + W > N does not give linearizability without further protocol steps.

**Abadi's classification of the 2012 default configurations:**

| Class | Systems | Behavior |
| --- | --- | --- |
| PA/EL | Dynamo, Cassandra, Riak | Give up consistency during partitions and for lower latency in normal operation. Once a system handles inconsistency, using that ability in both cases is simpler. Quorum settings can move the EL choice toward consistency. |
| PC/EC | VoltDB and H-Store, Megastore, BigTable, HBase | Never give up consistency; pay in availability and latency. |
| PA/EC | MongoDB | Consistent in normal operation. When the master fails or is cut off, the rest elect a new one, and writes the old master had not replicated are set aside for manual reconciliation. |
| PC/EL | PNUTS | Replicates asynchronously and serves reads from any replica in normal operation. During a partition, items whose master is unreachable cannot be updated. Here PC means consistency does not drop further during a partition, not that the system becomes fully consistent. |

PNUTS is Abadi's main evidence: it chooses consistency during partitions, so CAP did not make it weaken consistency; latency did. Several of these systems have since added settings that move them between classes, so treat the table as an illustration of the trade-off, not a current product guide.

### Delay sensitivity


Kleppmann (2015) proposes replacing CAP with a question every operation can answer: does its latency depend on network delay?

- **Treat network faults as delay.** When lost messages are retried, packet loss, and even a partition that eventually heals, look like very large delay.
- **Define availability empirically:** the share of requests that return a successful response within the SLA's latency bound, such as 500 ms.
- **Classify each operation** as delay-sensitive, with latency proportional to network delay, or delay-independent. The models table gives the lower bound for each consistency model.
- **Name the delay that matters.** A leader-based write depends on the delay between client and leader, which may include a WAN link and grows to the length of a partition between them. A majority quorum depends only on the fastest majority, so a partitioned minority does not slow it. COPS places a leader in each datacenter: operations are linearizable within a datacenter and causal across datacenters, so they depend only on local delay.
- **Match it to the SLA.** If the latency bound is much shorter than the network interruptions to expect, the operation must be delay-independent. Taken to the end, that is offline operation: a calendar app on a phone keeps working in a tunnel and syncs later.
- **State fault tolerance explicitly** instead of "highly available" or "partition tolerant": the largest fault tolerated, such as a minority of replicas crashing or disconnecting, and what happens beyond it, such as errors or a violated guarantee.

### Choosing consistency per operation


Many databases let an application request stronger consistency for some operations only. Requesting it too often costs latency and availability; requesting it too rarely breaks correctness. Gotsman et al. (2016) separate two kinds of problem:

- **Ordering anomalies,** such as seeing a comment without the post it answers, are prevented by causal consistency, which needs no synchronization.
- **Integrity invariants,** such as "a balance never goes negative", can still break under causal consistency. Two replicas each accept a withdrawal of 100 from a balance of 100, and once they exchange updates the balance is −100.

Their rule: declare which pairs of operations conflict, meaning neither may run without seeing the other, and synchronize only those pairs. For the account, withdrawals conflict with each other; deposits conflict with nothing and stay causal. Their proof rule then checks each operation on its own against the invariant, assuming the others behave as the conflict relation allows, and their tool automates the check with an SMT solver.

In a design: list the invariants, then for each pair of operations ask whether running both concurrently, without either seeing the other, can break one. Two bookings of the same seat conflict; browsing conflicts with nothing.

## In a design


The checklist for recording each operation's requirement (model, behavior when replicas are unreachable, delay sensitivity, invariants) is in [consistency]({{< ref "system-design/nfr/consistency" >}}#in-a-design). The consensus behind operations that must synchronize is in [broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}), and the alternatives that avoid it are in [coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}).

## Related notes


- [System models]({{< ref "engineering/distributed-systems/system-models" >}}): the fault and timing assumptions every guarantee depends on.
- [Time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}): the clocks and orderings that causal and linearizable systems are built from.
- [Replication]({{< ref "engineering/distributed-systems/replication" >}}): replication logs, lag, and the read anomalies these guarantees rule out.
- [Transactions]({{< ref "engineering/distributed-systems/transactions" >}}): the mechanisms behind the isolation levels.
- [Data at scale]({{< ref "system-design/elements/data-at-scale" >}}): where replicas, caches, and indexes create the copies that disagree.

## Gaps


- The other papers in the 2012 IEEE Computer issue on CAP: Brewer's *CAP Twelve Years Later* and Gilbert and Lynch's *Perspectives on the CAP Theorem*.
- Work Kleppmann cites on avoiding coordination: highly available transactions, coordination-avoiding databases, and probabilistically bounded staleness (Bailis et al.).
- The variants of causal consistency (causal+, real-time causal, observable causal) that Kleppmann mentions without comparing.

## Sources


- Abadi, *Consistency Tradeoffs in Modern Distributed Database System Design: CAP Is Only Part of the Story*, IEEE Computer 45(2), 2012 ([doi:10.1109/MC.2012.33](https://doi.org/10.1109/MC.2012.33)).
- Kleppmann, *A Critique of the CAP Theorem*, 2015 ([arXiv:1509.05393](https://arxiv.org/abs/1509.05393)).
- Gotsman, Yang, Ferreira, Najafzadeh, and Shapiro, *'Cause I'm Strong Enough: Reasoning about Consistency Choices in Distributed Systems*, POPL 2016 ([doi:10.1145/2837614.2837625](https://doi.org/10.1145/2837614.2837625)).
- Burckhardt, *Principles of Eventual Consistency*, Foundations and Trends in Programming Languages 1(1-2), 2014 ([doi:10.1561/2500000011](https://doi.org/10.1561/2500000011)).
- Gilbert and Lynch, *Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services*, ACM SIGACT News, 2002 ([doi:10.1145/564585.564601](https://doi.org/10.1145/564585.564601)) -- the CAP proof.
- Fox and Brewer, *Harvest, Yield, and Scalable Tolerant Systems*, HotOS 1999 ([doi:10.1109/HOTOS.1999.798396](https://doi.org/10.1109/HOTOS.1999.798396)) -- the original CAP principle.
- Terry et al., *Session Guarantees for Weakly Consistent Replicated Data*, PDIS 1994 ([doi:10.1109/PDIS.1994.331722](https://doi.org/10.1109/PDIS.1994.331722)).
- Herlihy and Wing, *Linearizability: A Correctness Condition for Concurrent Objects*, TOPLAS, 1990 ([doi:10.1145/78969.78972](https://doi.org/10.1145/78969.78972)).
- Berenson et al., *A Critique of ANSI SQL Isolation Levels*, SIGMOD 1995 ([doi:10.1145/568271.223785](https://doi.org/10.1145/568271.223785)).

## Library sources


- [Abadi 2012](/sources/system-design/distributed-systems/abadi-2012-consistency-tradeoffs-distributed-database-design.pdf.enc), *Consistency Tradeoffs in Modern Distributed Database System Design* ([doi:10.1109/MC.2012.33](https://doi.org/10.1109/MC.2012.33)) -- on *PACELC*
- [Kleppmann 2015](/sources/system-design/distributed-systems/kleppmann-2015-critique-of-the-cap-theorem.pdf.enc), *A Critique of the CAP Theorem* ([arXiv:1509.05393](https://arxiv.org/abs/1509.05393)) -- on *What CAP proves*, *Delay sensitivity*, and the latency column of *Consistency models*
- [Gotsman et al. 2016](/sources/system-design/distributed-systems/gotsman-2016-cause-im-strong-enough-consistency-choices.pdf.enc), *'Cause I'm Strong Enough* ([doi:10.1145/2837614.2837625](https://doi.org/10.1145/2837614.2837625)) -- on *Choosing consistency per operation*
- [Burckhardt 2014](/sources/system-design/distributed-systems/burckhardt-2014-principles-of-eventual-consistency-excerpt.pdf.enc), *Principles of Eventual Consistency*, excerpt ([doi:10.1561/2500000011](https://doi.org/10.1561/2500000011)) -- the hierarchy of models and CAP for sequential consistency
- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 6 on *Session guarantees*; chapter 8 on *Isolation levels*; chapter 10 on linearizability, its cost, and CAP
- [Vitillo 2021](/sources/system-design/distributed-systems/vitillo-2021-understanding-distributed-systems.pdf.enc), *Understanding Distributed Systems, Second Edition* -- chapter 10 on consistency models; chapter 12 on transactions

Further reading:

- [Tornow 2025](/sources/system-design/distributed-systems/tornow-2025-think-distributed-systems.pdf.enc), *Think Distributed Systems* -- chapter 9, consistency
- [Davoudian et al. 2018](/sources/software-engineering/databases/davoudian-2018-survey-on-nosql-stores.pdf.enc), *A Survey on NoSQL Stores* ([doi:10.1145/3158661](https://doi.org/10.1145/3158661)) -- consistency models and CAP as design principles of NoSQL stores
