---
draft: false
toc: true
title: "Time and Order"
description: "How nodes order events without a shared clock: time-of-day and monotonic clocks, drift and NTP, happens-before and Lamport clocks, vector clocks and version vectors, hybrid logical clocks, causal versus total order, leases, and fencing tokens."
document_status: "draft"
linkTitle: "Time and Order"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** how do nodes agree on the order of events without a shared clock?

Each machine has its own clock, and messages take an unknown time to arrive, so a timestamp from one node cannot be compared with confidence to a timestamp from another. Lamport (1978) observed that systems usually need the order of events rather than the time, and that the order available without physical time is only partial. The mechanisms below differ in which order they produce (real-time, causal, or an arbitrary total order), whether they can tell that two events were concurrent, and what they cost in metadata, waiting, or coordination.

## Physical clocks

### Time-of-day and monotonic clocks


Computers expose two kinds of clock, and they answer different questions (Kleppmann and Riccomini's *Designing Data-Intensive Applications*, 2026, hereafter DDIA, chapter 9):

- **Time-of-day clock** (`CLOCK_REALTIME` on Linux, `System.currentTimeMillis` in Java): seconds since the epoch, synchronized with NTP so that readings on different machines roughly agree. It can jump: NTP resets it backward if it is too far ahead, and leap seconds cause jumps too. It is unsuitable for measuring elapsed time.
- **Monotonic clock** (`CLOCK_MONOTONIC`, `System.nanoTime`): guaranteed to move forward, so the difference between two readings on one node is a valid duration. Its absolute value is arbitrary (time since boot, for example), so readings from two machines cannot be compared. NTP may slew its rate, by up to 0.05% by default, but cannot make it jump.

Tornow (2025) frames the difference as clock consistency (a -> b implies C(a) < C(b)): a monotonic clock is consistent with itself, while a time-of-day clock can put two readings on the same node in the wrong order. Timeouts and latency measurements belong on the monotonic clock. Points in time that must mean the same thing on every machine need the time-of-day clock, with all its problems.

### Drift, skew, and synchronization


- **Drift** is a difference in rate: one quartz oscillator runs slightly faster or slower than another, depending on manufacturing and temperature. **Skew** is the difference between two clocks' readings at one moment (Vitillo 2021; Tornow 2025).
- **Resynchronization interval:** van Steen and Tanenbaum (2023) put a typical quartz drift rate at about 10⁻⁶ seconds per second, roughly 31.5 seconds a year. Two clocks drifting in opposite directions at maximum rate ρ separate by up to 2ρΔt, so keeping them within π of each other requires resynchronizing at least every π/(2ρ) seconds. Google assumes up to 200 ppm of drift for its servers: 6 ms between resynchronizations 30 seconds apart, or 17 seconds over a day (DDIA).
- **Precision versus accuracy:** precision bounds how far clocks in the system differ from each other (internal synchronization); accuracy bounds how far each differs from UTC (external synchronization). Clocks accurate within α are precise within 2α, but precise clocks can all be wrong together (van Steen and Tanenbaum 2023).

NTP follows Cristian's scheme. A client sends a request at T1, the server records receipt at T2 and replies at T3, and the client receives the reply at T4. Assuming equal delay in both directions, the client's offset from the server is ((T2 − T1) + (T3 − T4)) / 2. NTP keeps eight offset and delay samples, trusts the one with the smallest delay, and arranges servers in strata below a reference clock (van Steen and Tanenbaum 2023). The network limits its accuracy: van Steen and Tanenbaum give 1 to 50 ms worldwide, and DDIA cites an experiment in which 35 ms was the best achievable over the internet, with spikes near a second under congestion.

DDIA lists how this fails in practice. A clock too far from the server is forcibly reset and jumps. A node firewalled off from NTP drifts unnoticed. Some NTP servers report times off by hours. A leap second makes a minute 59 or 61 seconds long and has crashed large systems; smearing the adjustment over a day avoids the jump, and leap seconds stop from 2035. A VM paused while another VM runs sees its clock leap forward. Devices the operator does not control may have deliberately wrong clocks. A faulty clock rarely crashes anything, so the usual result is silent data loss, and systems that depend on synchronized clocks should monitor offsets and remove nodes that drift too far.

Lamport (1978) and van Steen and Tanenbaum both require that a corrected clock never move backward, because setting it back lets a later event on the same process get a smaller timestamp. A fast clock is slowed gradually instead, for example by adding 9 ms per timer interrupt instead of 10 until the correction is made.

### When wall-clock timestamps are unsafe


- **Last write wins (LWW).** In DDIA's example, client A writes x = 1 on node 1, the write replicates to node 3, and client B increments it to x = 2 there. Node 1's clock is slightly ahead, so the first write is stamped 42.004 s and the causally later increment 42.003 s. Node 2 keeps x = 1 and silently drops the increment, with skew under 3 ms. In general, a node with a lagging clock cannot overwrite values from a node with a fast clock until the skew has elapsed; LWW cannot tell sequential writes from concurrent ones; and equal timestamps need a tiebreaker. Always giving an overwrite a higher timestamp than the value it replaces fixes the first problem at the cost of an extra read; Cassandra and ScyllaDB skip that read and use the client's timestamp. Dynamo offers timestamp LWW as an option for data such as session state (DeCandia et al. 2007).
- **Lease expiry.** A lease expiry set by one machine and checked against another machine's time-of-day clock is only as correct as the skew between them. The local monotonic clock fixes the comparison but not process pauses; see [leases and fencing tokens](#leases-and-fencing-tokens).
- **Ordering in general.** NTP's error is bounded below by network round-trip time, and correct ordering would need clock error well below network delay. A packet sent at 100 ms on the sender's clock can arrive at 99 ms on the receiver's (DDIA). This is the same condition Lamport derives for physical clocks, below.

Physical timestamps remain fine where an approximate order is harmless, such as log lines read for debugging (Vitillo 2021).

### Clocks with an uncertainty interval


A clock reading is better treated as an interval than a point. Its width comes from drift since the last synchronization, the time server's own error, and the round trip to it, but `clock_gettime` reports none of this. Google's TrueTime API in Spanner and Amazon's ClockBound do: a read returns [earliest, latest], and the true time lies within it (DDIA chapter 9).

Spanner uses the interval to order transactions across datacenters. If two intervals do not overlap, their order is certain. Before committing a read-write transaction, Spanner waits for the length of the interval, so any transaction that could read its data gets a later, non-overlapping timestamp. GPS receivers or atomic clocks in each datacenter keep the uncertainty to about 7 ms, which keeps the wait short. The hardware only narrows the interval; what the scheme needs is a bound that is never wrong (DDIA; Petrov 2019, chapter 13). YugabyteDB can use ClockBound on AWS in the same way.

## Happens-before and Lamport clocks


Lamport (1978) defines order without physical time. The **happened-before** relation -> is the smallest relation such that:

1. if a and b are events in the same process and a comes first, a -> b;
2. if a is the sending of a message and b its receipt, a -> b;
3. if a -> b and b -> c, then a -> c.

Two events are **concurrent** if neither happened before the other, so -> is a partial order. a -> b means a could have causally affected b; Tornow (2025) stresses that it means potentially, not actually, influenced. Concurrency does not mean overlapping in physical time: events a second apart are concurrent if no chain of messages connects them (DDIA chapter 6).

A **logical clock** assigns a number C(a) to each event, with no tie to physical time. It is correct if it satisfies the **Clock Condition**: if a -> b then C(a) < C(b). Two implementation rules suffice:

- **IR1:** each process increments its counter between any two successive events.
- **IR2:** a message carries the sender's counter as its timestamp Tm; on receipt, the receiver sets its counter to at least its current value and greater than Tm.

The converse cannot hold: if C(a) < C(b) implied a -> b, all concurrent events would need equal timestamps, which contradicts the condition for events within one process (Lamport 1978). A larger Lamport timestamp shows only that its event did not happen before the smaller one, never that the smaller one caused it.

**Total order.** Ordering events by timestamp, with ties broken by any fixed order of processes such as process ID, gives a total order ⇒ that extends -> . The order is arbitrary: different correct clocks give different total orders, and only the partial order is determined by the events. Lamport uses ⇒ for mutual exclusion. Every process keeps a queue of timestamped requests, and a process takes the resource when its own request is first in its queue and it has received a later-timestamped message from every other process. He generalizes this to any synchronization specified as a state machine: every process executes all commands in timestamp order, so all go through the same states. The condition "every other process" is the cost: the failure of a single process halts the rest. Lamport adds that failure is only meaningful with physical time, since otherwise a failed process cannot be told from one pausing between events.

**Anomalous behavior.** The total order can contradict what users observe. A person issues request A on one computer, then telephones a friend in another city, who issues request B on another computer. B can receive the lower timestamp and be ordered first, because the phone call is outside the system and carries no timestamp. Lamport gives two remedies:

- **The user carries the order:** the person receives A's timestamp, and the friend submits B with a later one.
- **Physical clocks:** clocks synchronized tightly enough satisfy a Strong Clock Condition, under which timestamps respect causality through external channels too. This holds when ε/(1 − κ) ≤ μ, where ε bounds the difference between any two clocks, κ bounds their drift rate, and μ is less than the shortest transmission time of any message, the phone call included. His synchronization algorithm (on receipt, set the clock to the maximum of its own value and Tm plus the minimum message delay, never backward) keeps clocks within about d(2κτ + ξ), where d is the network diameter, τ how often each link carries a message, and ξ the bound on unpredictable delay.

Tornow (2025) points out logical clocks in ordinary systems: a Kafka partition's offsets and an etcd key's sequence numbers are logical timestamps, comparable within one partition or key but not across them.

## Vector clocks and version vectors


A **vector clock** keeps one counter per process, and each process holds its own copy of the vector (Vitillo 2021; van Steen and Tanenbaum 2023; the idea is due to Fidge and Mattern, both 1988):

- before each event, process i increments entry i;
- a message carries the sender's whole vector;
- on receipt, the receiver takes the element-wise maximum of its vector and the message's, then increments its own entry.

Two timestamps compare entry by entry. If every entry of T1 is at most the corresponding entry of T2, and at least one is smaller, the first event happened before the second. If neither dominates, the events are concurrent. So vector clocks capture -> exactly, which Lamport clocks cannot. Van Steen and Tanenbaum, following Baquero and Preguiça, derive the vector as a compressed causal history: keeping only the latest event per process, entry j counts the events at process j that precede the event.

Two limits remain. The clock captures potential causality only: it marks two messages from one sender as ordered even when they are unrelated, and it misses causality through channels outside the system, such as a phone call (van Steen and Tanenbaum 2023). And the vector grows with the number of participants, which becomes a problem when there are many clients (Vitillo 2021).

**Version vectors** apply the idea to versions of one replicated item: one counter per replica that accepted writes for the key, returned to the client on a read and sent back with the next write. The store can then tell an overwrite from a concurrent write and keep concurrent values as siblings, and reading from one replica and writing to another loses nothing as long as siblings are merged (DDIA chapter 6). DDIA notes that version vectors and vector clocks differ subtly, and that version vectors are the right structure for comparing replica states. Riak 2.0 uses a variant, dotted version vectors.

**In Dynamo** (DeCandia et al. 2007), every version of every object carries a vector clock, a list of (node, counter) pairs in which the node is the server that coordinated the write. A client updating an object passes the context from its earlier read. If one clock's counters are all at most another's, the first version is an ancestor and is discarded (syntactic reconciliation). Otherwise both versions are kept and returned to the client for semantic reconciliation, such as merging two shopping carts; an added item is never lost, but deleted items can resurface. Writes are usually coordinated by one of the top N nodes in a key's preference list, so clocks stay short. When failures spread coordination wider, Dynamo truncates the clock, removing the oldest pair (by a stored timestamp) once a threshold such as 10 pairs is reached. After truncation, descendant relationships can no longer always be derived; the authors report that this had not surfaced in production. Over 24 hours of the shopping cart service, 99.94% of requests saw exactly one version.

Petrov (2019, chapter 12) describes bitmap version vectors, which represent each write as a dot (sequence number, coordinating node), so that anti-entropy can find exactly which writes a replica is missing.

## Hybrid logical clocks


Lamport timestamps have no relation to physical time, so they cannot find, for example, all messages posted on a given date, and two nodes that never communicate can hold very different counters for events at the same moment. A **hybrid logical clock** (Kulkarni et al. 2014) counts physical time, like a time-of-day clock, but when a node sees a timestamp greater than its own, it moves forward to match, like a Lamport clock. It also increments on every timestamp it issues, so it never moves backward even when NTP sets the physical clock back.

The result can be used almost like a time-of-day timestamp, with ordering consistent with happens-before. It needs only roughly synchronized clocks and no special hardware; CockroachDB uses it. Like Lamport clocks, hybrid logical clocks order concurrent events arbitrarily, so they cannot detect concurrency (DDIA chapter 10).

## Causal order versus total order


- **Causal order** respects -> and leaves concurrent events unordered, so different replicas may apply concurrent events in different orders. It needs no coordination. With vector clocks, a process delays delivering a message m from process i until m is the next message expected from i and the process has delivered everything i had delivered before sending m (van Steen and Tanenbaum 2023). Causally consistent stores buffer early updates in the same way until their dependencies arrive (Petrov 2019, chapter 11). Causal consistency is the strongest model that never waits for the network; see [consistency models]({{< ref "engineering/distributed-systems/guarantees" >}}#consistency-models).
- **Total order** puts every pair of events in one sequence that all nodes share. Assigning one is cheap: Lamport timestamps do it with no extra messages. Knowing that it is final is not: before acting on its own timestamp, a node must know that no other node will produce a lower one, which means hearing from every node, and one failed or unreachable node stops everything (Lamport 1978; DDIA chapter 10). A fault-tolerant total order is total order broadcast, which is equivalent to consensus; see [broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}).

DDIA (chapter 13) draws the practical consequence. A totally ordered log usually passes through one leader, so it is bounded by one machine's throughput, and it does not span shards, regions with their own leaders, independent services, or clients that work offline. Where events have no causal link, the missing total order costs nothing. Where they do, the dependency has to be captured explicitly, for example by logging the ID of the event the user saw before acting and referencing it from later events.

## Leases and fencing tokens


A **lease** is a lock with a timeout: one node holds it and renews it before it expires, and if the holder stops renewing, another node can take over. Leases implement claims such as one leader per shard or one writer per file (DDIA chapter 9). A lease based on time is unsafe on its own, for two reasons:

- **Clock dependence:** the expiry is computed on one machine and compared against the holder's clock. Using the local monotonic clock removes this problem but not the next one.
- **Pauses and delays:** the holder checks that its lease is valid, then stops past the expiry: a garbage collection pause, a VM suspended for live migration, a thread waiting on a contended lock. Another node acquires the lease, and the first resumes and writes, still believing it holds the lease. A write sent just before expiry can also sit in the network and arrive after the new holder has started. HBase once had this bug. Checking that the lease has plenty of time left narrows the window but does not close it (Vitillo 2021).

A former holder that does not yet know it lost the lease is a **zombie**. Shutting zombies down (STONITH) does not stop delayed requests and may come after the damage. The fix is a **fencing token**: the lock service returns a number that increases with every grant, every write carries it, and the storage rejects a write whose token is lower than one it has already accepted. In DDIA's example, client 1 holds token 33 and pauses, client 2 is granted 34 and writes, and client 1's late write with 33 is rejected. A new holder should write immediately after acquiring the lease; once that write completes, zombies are fenced off.

- **Where tokens come from:** Chubby calls them sequencers and Kafka epoch numbers; Paxos ballot numbers and Raft terms play the same role. ZooKeeper's `zxid` or `cversion`, and etcd's revision with the lease ID, serve as tokens.
- **What the storage must do:** check the token, or offer a conditional write that succeeds only if the object is unchanged since the client read it, as S3 conditional writes do. Vitillo (2021) uses the second form: a version number per file, updated by compare-and-swap.
- **With replicas:** in a leaderless LWW store, putting the token in the most significant bits of each write's timestamp makes every write from the new holder outrank every write from the old one on every replica.
- **Limits:** the token is a counter from a lock service that is usually built on consensus, and it stops an honest node acting in error, not a malicious one, which can send a fake token.

## ID generators and logical clocks


DDIA chapter 10 treats ID generation as an ordering problem. A single-node autoincrementing counter (an atomic fetch-and-add) gives IDs that are unique, compact, and **linearizable**: if one request completes before another begins, the second gets the larger ID. But it is a single point of failure, a cross-region round trip, and a throughput bottleneck. The distributed alternatives give up ordering in different ways:

| Scheme | Coordination per ID | Order of IDs |
| --- | --- | --- |
| Sharded assignment (shard number in the ID) | None | None across shards |
| Preallocated blocks of IDs | One request per block | None across blocks |
| Random UUID (version 4), 128 bits | None | None |
| Wall-clock timestamp made unique (UUIDv7, Snowflake, ULID, MongoDB ObjectID) | None, but needs synchronized clocks | Approximate; wrong under skew or a backward jump |
| Lamport timestamp (counter, node ID) | None; timestamps travel on existing messages | Consistent with causality, not with real time |
| Hybrid logical clock | None; roughly synchronized clocks | Consistent with causality, close to physical time |
| Linearizable generator (single node, or TrueTime-style waiting) | A round trip to the generator, or a wait | Consistent with real time |

**Snowflake-style IDs** put a millisecond timestamp in the high bits and fill the rest with a worker ID and a per-worker sequence number; the Educative lesson gives the original layout as 41 timestamp bits, 10 worker bits, and 12 sequence bits. They sort roughly by creation time with no coordination but inherit the clock problems above: under skew a later ID can be smaller, and after a backward jump even one worker can issue IDs out of order, so a generator has to detect the jump and refuse, or wait, until its clock passes the last timestamp it used.

**Why causal order is not enough.** In DDIA's example, a user sets their account to private on a laptop, then uploads a photo from a phone. The two writes go to different databases and are stamped with a Lamport or hybrid clock. The photos database never read the accounts database, so its counter may lag and the photo gets the lower timestamp. A viewer's snapshot read can fall between the two and show the photo under the old, public setting. This is Lamport's anomalous behavior, with the user moving between devices as the external channel. DDIA's alternative of having the device track the user's latest timestamp is Lamport's first remedy, and it fails here because the user switched devices. A linearizable ID generator prevents the anomaly.

**Implementing a linearizable generator:** one node increments, persists, and replicates the counter, as TiDB's timestamp oracle does, following Google's Percolator. It can persist and replicate a batch of IDs at a time, skipping some after a crash or failover but never issuing duplicate or out-of-order IDs. It cannot easily be sharded or spread across regions, though its job is simple enough for one node to handle high throughput. Spanner's alternative waits out the clock uncertainty instead, which needs no communication but does need the clock infrastructure.

Neither a logical clock nor a linearizable generator implements locks or uniqueness on its own. Picking the request with the lowest timestamp as the winner still requires hearing from every node that might hold a lower one, so a fault-tolerant lock needs consensus (DDIA chapter 10).

## Comparison


| Mechanism | What it orders | What it can detect | Cost |
| --- | --- | --- | --- |
| Time-of-day timestamp | Events across nodes, approximately | Nothing reliably; can invert causally related events | NTP, plus monitoring of clock offsets |
| Monotonic clock | Durations on one node | Elapsed time, timeouts | Meaningless across nodes |
| Uncertainty interval (TrueTime, ClockBound) | Events in real-time order when intervals do not overlap | Whether an order is certain | A wait of the interval width on commit; clock infrastructure |
| Lamport timestamp | All events, in a total order consistent with -> | That a larger timestamp did not happen before a smaller one; not concurrency | One counter, plus a node ID for uniqueness |
| Hybrid logical clock | The same, close to physical time | The same as Lamport | Roughly synchronized clocks |
| Vector clock or version vector | Events, in exactly the partial order -> | Concurrency, and so conflicting writes | One counter per participant; truncation or dotted variants to bound size |
| Fencing token | Grants of one lease | Writes from a stale holder | A consensus-backed lock service; storage that checks tokens |
| Linearizable ID generator | IDs in real-time order | Nothing beyond the order | A round trip to one node in one region; a throughput bottleneck |
| Total order broadcast (consensus) | Every event, the same on every node, despite failures | Nothing beyond the order | A majority round trip per entry; one leader's throughput |

## In a design


- Use the monotonic clock for timeouts, rate windows, and lease durations on one node. Use the time-of-day clock only for dates people read, or where an approximate order is harmless.
- For conflicts in multi-leader and leaderless stores, choose between LWW, which drops one of two concurrent writes and, under skew, sequential ones too, and version vectors with a merge. See [Dynamo-style design]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design) and [coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination).
- Any lease, lock, or leader claim that protects data needs a fencing token checked by the storage, or a conditional write. That includes job leases in [task queues]({{< ref "system-design/elements/messaging" >}}#task-queues-and-scheduling).
- For IDs, state which order is required: none (UUIDv4), rough creation order (Snowflake-style), causal, or real-time (a linearizable generator). See the unique ID row in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options) and the [Snowflake case]({{< ref "system-design/projects/infra/slowflake-id" >}}).
- If an anomaly would come from one user acting on two devices, or from any channel outside the system, a causal clock does not prevent it.

## Related notes


- [System models]({{< ref "engineering/distributed-systems/system-models" >}}): the timing assumptions (synchronous, partially synchronous, asynchronous) that decide whether clocks and timeouts can be trusted.
- [Consistency guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}): causal consistency and linearizability, the guarantees these orderings implement.
- [Broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}): total order broadcast, with Raft terms and Paxos ballots acting as fencing tokens.
- [Coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}): what replicas can do with causal order alone.
- [Replication]({{< ref "engineering/distributed-systems/replication" >}}): the multi-leader and leaderless conflicts that version vectors and LWW resolve.
- [Transactions]({{< ref "engineering/distributed-systems/transactions" >}}): MVCC snapshots, which need transaction IDs consistent with causality.

## Gaps


- The algorithms of hybrid logical clocks (Kulkarni et al. 2014) and dotted version vectors, read here only through DDIA, Vitillo, and Petrov.
- The Spanner paper itself: how TrueTime computes its interval, and how commit wait combines with two-phase commit.
- Clock synchronization beyond NTP: the Precision Time Protocol, and the Berkeley and wireless-network algorithms in van Steen and Tanenbaum.
- Causally consistent stores such as COPS and Eiger, which Petrov mentions.
- The proof of Lamport's synchronization bound.

## Sources


- Lamport, *Time, Clocks, and the Ordering of Events in a Distributed System*, Communications of the ACM 21(7), 1978 ([doi:10.1145/359545.359563](https://doi.org/10.1145/359545.359563)).
- DeCandia et al., *Dynamo: Amazon's Highly Available Key-value Store*, SOSP 2007 ([doi:10.1145/1294261.1294281](https://doi.org/10.1145/1294261.1294281)).
- Kulkarni, Demirbas, et al., *Logical Physical Clocks*, OPODIS 2014 ([doi:10.1007/978-3-319-14472-6_2](https://doi.org/10.1007/978-3-319-14472-6_2)) -- hybrid logical clocks, summarized here from DDIA.

## Library sources


- [Lamport 1978](/sources/system-design/distributed-systems/lamport-1978-time-clocks-ordering-of-events.pdf.enc), *Time, Clocks, and the Ordering of Events in a Distributed System* ([doi:10.1145/359545.359563](https://doi.org/10.1145/359545.359563)) -- on *Happens-before and Lamport clocks* and the cost of total order in *Causal order versus total order*
- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 9 on *Physical clocks* and *Leases and fencing tokens*; chapter 10 on *Hybrid logical clocks* and *ID generators and logical clocks*; chapter 6 on version vectors; chapter 13 on the limits of total ordering
- [Vitillo 2021](/sources/system-design/distributed-systems/vitillo-2021-understanding-distributed-systems.pdf.enc), *Understanding Distributed Systems, Second Edition* -- chapter 8 on physical, logical, and vector clocks; chapter 9 on leases
- [van Steen and Tanenbaum 2023](/sources/system-design/distributed-systems/vansteen-2023-distributed-systems-4th-edition.pdf.enc), *Distributed Systems, 4th Edition* -- chapter 5 on clock synchronization, NTP, Lamport clocks, vector clocks, and causal delivery
- [Tornow 2025](/sources/system-design/distributed-systems/tornow-2025-think-distributed-systems.pdf.enc), *Think Distributed Systems* -- chapter 2 on happened-before, clock consistency, and physical versus logical clocks
- [Petrov 2019](/sources/system-design/data-systems/petrov-2019-database-internals.pdf.enc), *Database Internals* -- chapter 8 on clocks and time; chapter 11 on causal consistency and vector clocks; chapter 12 on bitmap version vectors; chapter 13 on Spanner's TrueTime
- [DeCandia et al. 2007](/sources/system-design/data-systems/decandia-2007-dynamo-amazons-key-value-store.pdf.enc), *Dynamo: Amazon's Highly Available Key-value Store* ([doi:10.1145/1294261.1294281](https://doi.org/10.1145/1294261.1294281)) -- on vector clocks in *Vector clocks and version vectors*

Further reading:

- Educative 2023: unique IDs with causality -- Snowflake's bit layout, and ID schemes compared by whether they preserve causality, ending with TrueTime
