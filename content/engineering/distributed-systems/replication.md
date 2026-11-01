---
draft: false
toc: true
title: "Replication in Distributed Systems"
description: "How copies of the same data stay in step across machines: single-leader replication and failover, replication logs and change data capture, replication lag, multi-leader conflicts, leaderless quorums and anti-entropy, and a comparison of strategies."
document_status: "draft"
linkTitle: "Replication"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** how do copies of the same data on several machines stay in step, and what does each replication strategy cost?

Replication keeps a copy of the same data on several machines connected by a network. Copying data that never changes is trivial; the difficulty lies in propagating changes, in deciding what clients may see while copies differ, and in surviving the failure of whichever node coordinates the changes. Each strategy answers three questions differently: where writes go, whether the client is answered before or after the other copies are updated, and how copies that diverged come back together.

## Why replicate


- **Latency:** a copy near the user shortens access time (DDIA; van Steen and Tanenbaum). The price is bandwidth: a replica updated far more often than it is read receives mostly useless updates (van Steen and Tanenbaum).
- **Availability and durability:** the system keeps serving, and keeps the data, when some nodes fail. With three copies, a value two of them agree on also outvotes one corrupted write (van Steen and Tanenbaum).
- **Read throughput:** more machines serve read queries.
- **Transparency as the goal:** Tornow describes replication as one logical object represented by several identical physical objects, and replication transparency as hiding from clients that there are several. Replication lag is what makes the copies visible.
- **Replication versus partitioning:** replication copies the same data to several nodes; [partitioning]({{< ref "engineering/distributed-systems/partitioning" >}}) splits the data so each node holds a part. In Tornow's phrasing, replication distributes the data and partitioning distributes the load. Designs combine them: every partition is replicated, and a single-leader store has one leader per partition, spread across nodes (DDIA).
- **Replication versus backup:** a replica applies an accidental delete within seconds; a backup keeps old snapshots to go back to. They meet in practice: a snapshot plus the archived log both restores a database and seeds a new follower (DDIA).

Gray et al. (1996), as summarized by Davoudian et al. (2018), classify replication along two independent axes: where writes run (one primary copy, or any replica, "update anywhere") and when the other copies are updated (eagerly, before the client is answered, or lazily, after). Single-leader, multi-leader, and leaderless replication are points in that space (DDIA; Tornow). Petrov notes that updating several copies atomically is equivalent to consensus, which is why most configurations relax one of the axes.

## Single-leader replication


One replica, the leader (primary), accepts writes. It applies each write locally and sends the change to the followers as a replication log; followers apply changes in the leader's order, and reads may go to any replica (DDIA). Van Steen and Tanenbaum call this a primary-backup or remote-write protocol: because one primary orders every write, all replicas see writes in the same order. PostgreSQL, MySQL, MongoDB, DynamoDB, and Kafka replicate this way, and so do Raft-based systems such as etcd and CockroachDB (DDIA). Where reads are served determines what clients see (Vitillo):

| Reads served by | Model | Cost |
| --- | --- | --- |
| The leader, after a majority confirms it still leads | Linearizable | A quorum round trip per read; the leader caps read throughput. |
| One follower per client | Sequential: every client sees the same order, at different times | The client loses access if its follower fails. |
| Any follower | Eventual: a client can see time move backward | None beyond staleness; the most capacity and availability. |

### Synchronous, semi-synchronous, and asynchronous


| Mode | Leader acknowledges after | When a follower is slow or down | When the leader fails |
| --- | --- | --- | --- |
| Synchronous to all followers | Every follower confirms | Writes block; one node outage halts writing, so systems rarely make every follower synchronous | No acknowledged write is lost |
| Semi-synchronous | One synchronous follower confirms; the rest are asynchronous, and one of them is made synchronous if the synchronous follower stalls | Writes continue | The data is on at least two nodes; fail over to the synchronous follower |
| Majority | A majority, counting the leader, such as three of five | Writes continue while a majority responds | The basis of consensus-based failover |
| Asynchronous | The leader's own write | Writes continue even if every follower lags | Writes not yet replicated are lost, though the client was told they succeeded |

Asynchronous replication is common despite its weaker durability, especially with many followers or followers in other regions, and read scaling across many followers only works asynchronously (DDIA). Van Steen and Tanenbaum call the same split blocking versus nonblocking primary-backup. Tornow describes the majority mode as replication in the foreground inside the quorum and in the background outside it, and separates **inherent lag** (no update reaches every replica at the same instant) from **imposed lag** (added by partitions and failures).

### Chain replication


Van Renesse and Schneider (2004) arrange the replicas in a chain. Clients write to the head, which applies each update and forwards it; each node does the same until the tail applies it. In the variant Vitillo describes, taken from CRAQ, the acknowledgment travels back to the head, which answers the client; in the original paper the tail replies (Davoudian et al.). Reads go to the tail. A write commits only after every node has it, so the tail holds only committed state and serves linearizable reads without a quorum round trip (Vitillo).

- **Failures:** a separate control plane, itself replicated with consensus, removes failed nodes and relinks the chain. If the head fails, its successor becomes head; a write the head never forwarded was never acknowledged, so the client retries. If the tail fails, its predecessor already holds everything the tail had. If a middle node fails, its successor reports the last update it received and the predecessor resends the rest. A chain of N nodes tolerates N − 1 failures, so failed nodes are replaced by syncing a new node and appending it as the tail (Vitillo).
- **Costs:** write latency spans the whole chain, so one slow node slows every write, and writes stop until the control plane removes a failed node; a Raft leader waits only for a majority. In exchange, writes can be pipelined, and the head and tail split the work of a single leader (Vitillo). Davoudian et al. add that the tail can become a hot spot and that the protocol assumes fail-stop nodes, which timeout-based detection cannot guarantee.
- **CRAQ:** Terrace and Freedman (2009) let every node serve reads. A node marks each new version dirty until the tail's acknowledgment passes back, serves clean versions itself, and asks the tail which version is committed when its latest is dirty (Vitillo).
- **In use:** Azure Storage replicates its extents synchronously with chain replication, with a stream manager as the control plane (Vitillo). Only the control plane needs consensus, and it runs only on failures, off the request path; see [control plane]({{< ref "system-design/elements/control-plane" >}}).

## Adding followers and handling outages


- **A new follower** (DDIA): take a consistent snapshot of the leader without locking it, tied to an exact log position (PostgreSQL's log sequence number, MySQL's binlog coordinates or GTIDs); copy it; request every change after that position; once the backlog is applied, the follower has caught up. Archiving snapshots and the log to object storage, as WAL-G and Litestream do, serves both backups and new followers.
- **Follower failure:** the follower's own log records the last change it applied, so it reconnects and requests the rest. Catch-up after a long outage loads both the follower and the leader. The leader can keep its log until every follower confirms, risking its disk, or delete it, forcing a long-absent follower to restore from a backup (DDIA).

**Leader failure (failover):** detect the failure, usually by a timeout; choose a new leader, by a majority of the remaining replicas or by a controller, preferring the most up-to-date follower; reconfigure clients to write to it, and make sure the old leader becomes a follower if it returns. The dangers explain why some teams fail over manually even when automatic failover is available (DDIA):

- **Lost writes:** under asynchronous replication, the new leader may lack the old leader's last writes, and the usual resolution discards them, so acknowledged writes were not durable. Choosing the follower the old leader waited for, or the one with the highest log position, minimizes the loss.
- **Conflicting IDs:** at GitHub, a lagging MySQL follower was promoted, and its autoincrement counter reissued primary keys the old leader had already assigned. Redis also stored those keys, so some private data reached the wrong users. Discarded writes are most dangerous when other systems have already acted on them.
- **Split brain:** two nodes both believe they lead and both accept writes. Automatically shutting one down can end with both down, or come after the data is corrupted. The reliable guard is fencing the old leader: see [leases and fencing tokens]({{< ref "engineering/distributed-systems/time-and-order" >}}#leases-and-fencing-tokens).
- **The timeout:** a long one slows recovery; a short one fails over on a load spike or a network glitch, adding work to a system already struggling. See [failure detection]({{< ref "engineering/distributed-systems/system-models" >}}#failure-detection).

**Consensus makes failover safe.** Raft and Multi-Paxos are single-leader replication with automatic election: a quorum elects each leader, a term or ballot number fences the previous one, and the election rule guarantees that the new leader holds every committed entry, so no acknowledged write is lost. See [broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}). Even then, a node that serves reads without confirming its leadership can return stale data (DDIA chapter 10). DynamoDB shows the pattern: each partition's replicas form a group that elects a leader with Multi-Paxos; the leader acknowledges a write once a quorum has persisted its log record, holds a renewable lease, and alone serves writes and strongly consistent reads, while any replica serves eventually consistent ones. A new leader serves no writes or strongly consistent reads until the old leader's lease expires (Elhemali et al. 2022).

**Replicas that keep only the log.** When a DynamoDB storage replica fails, the leader adds a log replica, which stores only recent log entries and takes seconds to create instead of the minutes needed to copy the B-tree (Elhemali et al.). Petrov describes the general idea as witness replicas: they record that a write happened and hold data only while a full copy is missing. With n copies and m witnesses, majority quorums that always include at least one copy give the availability of n + m copies at lower storage cost; Spanner and Cassandra use the idea.

**Replication through object storage.** DDIA's second edition describes databases that hand replication to object stores such as S3. Object storage is cheap, replicated across zones or regions with very high durability, and its conditional writes (a compare-and-set) can implement leader election and transactions. The costs are much higher latency than local disks, per-request fees that push systems to batch, immutable objects, and missing filesystem semantics. Systems respond with tiered storage, with a separate low-latency store for the WAL (Neon's Safekeepers), or with a zero-disk architecture in which all data lives in object storage and nodes only cache, so they hold no persistent state (WarpStream, Bufstream, Redpanda Serverless, SlateDB, and most cloud data warehouses).

## Replication logs


| Method | What the leader ships | Strength | Problem |
| --- | --- | --- | --- |
| Statement-based | Each write statement (INSERT, UPDATE, DELETE), re-executed by followers | Compact | Nondeterministic functions (NOW, RAND), statements whose effect depends on order (autoincrement, UPDATE ... WHERE), and triggers or stored procedures can diverge. MySQL used it before 5.1 and now switches to row-based for nondeterministic statements; VoltDB stays safe by requiring deterministic transactions. |
| Write-ahead log shipping | The storage engine's log: which bytes changed in which disk blocks | No second log; followers hold identical files | Ties replication to the storage format, so leader and followers usually must run the same version, and upgrades need downtime. PostgreSQL and Oracle. |
| Logical (row-based) | A record per changed row: all new values for an insert, the key for a delete, the key and new values for an update, then a commit record | Decoupled from the storage engine: mixed versions allow upgrades with little downtime, and outside systems can parse it | A separate log (MySQL's binlog) or a decoding step (PostgreSQL decodes its WAL into row events). |

Statement-based replication made deterministic is [state machine replication]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#state-machine-replication), the scheme consensus logs use (DDIA). Tornow's broader split is **state-based** replication, which sends the current state or a diff (counter = 5), versus **log-based**, which sends the operations (increment by 3); he notes that log-based replication is becoming the industry favorite. Van Steen and Tanenbaum add a third choice, sending only an invalidation, which saves bandwidth when writes far outnumber reads.

**Change data capture.** A logical log doubles as an interface. CDC reads it and streams each committed change, in commit order, to search indexes, caches, and warehouses, which makes the database the leader and the derived systems its followers (DDIA chapter 12). CDC is asynchronous, so every lag problem below applies, and a new consumer starts from a snapshot tied to a log offset, exactly like a new follower. The outbox and log-tailing patterns built on it are in [publishing changes reliably]({{< ref "system-design/elements/data-across-services" >}}#publishing-changes-reliably).

## Replication lag


Lag is the delay between a write on the leader and its appearance on a follower: usually a fraction of a second, but seconds or minutes under load or network trouble, with no upper bound. Reads from lagging followers are eventually consistent, a term Terry et al. coined and Vogels popularized, and "eventually" is deliberately vague (DDIA). DDIA names three anomalies; the guarantees that rule them out, and their mechanisms, are tabulated in [session guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}#session-guarantees):

- **Reading your own writes:** a user submits data and then reads a follower that lacks it. DDIA's options include reading from the leader for a minute after the user's last write, or having the client remember its last write's log position. Across devices, that position must be stored centrally, and the devices may reach different regions.
- **Monotonic reads and consistent prefix reads:** a comment appears on one read and vanishes on the next, served by a more lagged follower; an answer appears before its question, because the partitions holding them lag differently.

**How to think about it:** ask what the application does if lag grows to minutes or hours. If that is a bad experience, provide a stronger guarantee instead of treating asynchronous replication as synchronous (DDIA). Working around lag in application code is error-prone; the alternative is a database that offers linearizability and [transactions]({{< ref "engineering/distributed-systems/transactions" >}}), so the application can treat it as one node. The NoSQL movement of the early 2010s argued that scale required giving these up; NewSQL databases have since combined them with fault tolerance and scale, though weaker models still win on tolerance of network interruptions and on overhead (DDIA).

## Multi-leader replication


Several nodes accept writes, and each forwards its changes to the others, acting as a follower of them. Synchronous multi-leader replication behaves like single-leader replication with forwarding, so the useful form is asynchronous: each leader keeps accepting writes while cut off from the rest (DDIA). It rarely pays off within one region. It fits three situations:

- **Several regions:** a leader per region, with ordinary leader-follower replication inside each. Writes complete locally, hiding the inter-region delay, and each region keeps working through a regional outage or a broken inter-region link, catching up afterwards. Zones within one region already survive a zone outage; only several regions survive a regional one, at the cost of latency, throughput, and network fees (DDIA).
- **Offline clients and collaborative editing:** a calendar on a phone, a laptop, and a server has a leader on each device, and sync is replication whose lag may be days; in real-time collaboration, each open browser tab is a replica that applies edits before the server answers. Both are built with [sync engines]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}#local-first-software-and-sync-engines).

**What it costs:** two leaders can each accept a write that is valid alone and violates a constraint together, so uniqueness or a non-negative balance cannot be guaranteed; such constraints need a single leader (DDIA). Multi-leader support is often retrofitted onto databases and interacts badly with autoincrement keys, triggers, and integrity constraints, which is why it is often treated as territory to avoid.

| Topology | How a write travels | Failure mode |
| --- | --- | --- |
| All-to-all | Every leader sends to every other. | Survives a failed node, since messages take several paths; but on faster links some messages overtake others, so an update can arrive before the insert it modifies. |
| Circular | Each node forwards to the next, adding its own writes. | One failed node cuts propagation between the others until the ring is reconfigured, usually by hand. |
| Star (or tree) | A root forwards to every other node. | The root, or any inner node of a tree, is a single point of failure in the same way. |

In circular and star topologies, each write carries the IDs of the nodes it has passed through, and a node ignores changes tagged with its own ID, which prevents loops. Ordering messages that overtook each other needs causality tracking such as [version vectors]({{< ref "engineering/distributed-systems/time-and-order" >}}#vector-clocks-and-version-vectors); timestamps fail because clocks are not synchronized well enough. DDIA warns that many multi-leader systems order updates poorly and advises testing what a database actually guarantees; see [randomized testing and fault injection]({{< ref "engineering/distributed-systems/verification" >}}#randomized-testing-and-fault-injection).

**Conflicts.** Two writes are concurrent when neither was aware of the other, however far apart in time they happened (DDIA). [Resolving conflicts]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}#resolving-conflicts) and [CRDTs]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}#crdts) cover the mechanisms in depth, and the Ably article in the sources is a short introduction to CRDTs. From simplest to most careful:

- **Avoid them:** route all writes for a record to one leader, such as the user's home region (sticky routing), or partition the ID space, such as odd and even IDs for two leaders. This fails while the designated leader changes and is impossible for an offline client.
- **Last write wins:** keep the write with the largest timestamp. Replicas converge, but concurrent writes are silently discarded, and with wall clocks a later write can lose to one from a node whose clock runs ahead.
- **Keep every version:** store concurrent values as siblings, return them all, and let the application or the user merge and write back.
- **Merge automatically:** a CRDT or operational transformation merges concurrent updates for each data type.
- **Invariants:** some conflicts touch no shared record. Two bookings of one room, inserted on different leaders, are each valid alone; such invariants are covered in [what is given up]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}#what-is-given-up).

## Leaderless replication


Any replica accepts writes. The client, or a coordinator acting for it, sends each write to several replicas, and unlike a leader the coordinator imposes no order (DDIA). Amazon's Dynamo (DeCandia et al. 2007) revived the approach, and Riak, Cassandra, and ScyllaDB follow it. DynamoDB, despite the name, is single-leader with Multi-Paxos (DDIA; Elhemali et al. 2022).

**Quorums.** With n replicas per key, a write succeeds once w replicas acknowledge it and a read asks r replicas. If w + r > n, every read set overlaps every successful write set, so at least one response carries the latest value, and version numbers or timestamps identify it. Requests go to all n replicas in parallel; w and r only set how many responses to wait for (DDIA).

- **Typical settings:** n odd (3 or 5) and w = r = (n + 1)/2, rounded up; n = 3 tolerates one unavailable node and n = 5 two (DDIA). Dynamo's common configuration was (N, R, W) = (3, 2, 2), and the latency of an operation is set by the slowest of the R or W replicas it waits for (DeCandia et al.).
- **Tuning:** w = n, r = 1 speeds reads but lets one failed node block every write; w = 1 accepts a write while any single node can store it, at a durability cost (DDIA; DeCandia et al.). With w + r ≤ n, latency and availability improve and stale reads become more likely.
- **Intersection, not majority:** quorums need only overlap; see [quorums]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#quorums). Gifford's (1979) weighted voting also required w > n/2, so that two writes cannot both succeed without seeing each other (van Steen and Tanenbaum); Dynamo-style stores drop that rule and detect concurrent writes with versions instead.

**Catching up on missed writes.** Petrov calls these anti-entropy mechanisms, in the foreground (piggybacked on reads and writes) or the background:

| Mechanism | When it runs | What it repairs |
| --- | --- | --- |
| Read repair | During a read: the coordinator sees a stale response and writes the newer value back. Blocking repair makes quorum reads monotonic but delays the read; asynchronous repair does not. Digest reads cut traffic: one replica returns the value, the others a hash (Petrov). | Only keys that are read. |
| Hinted handoff | During a write to an unreachable replica: another node stores the write as a hint and replays it when the replica returns. | Keys written during the outage, whether read or not. |
| Background anti-entropy | Periodically: replicas compare contents and copy what is missing, in no particular order and possibly with a long delay (DDIA). | Everything, including data that is neither read nor recently written. |

**Merkle trees** make background comparison affordable. Each leaf is a hash of a key or key range, and each parent is a hash of its children; two replicas compare roots and descend only into subtrees whose hashes differ, which limits both the data exchanged and the disk reads (DeCandia et al.; Petrov). Dynamo keeps a tree per key range a node hosts, so a node joining or leaving changes many ranges and forces trees to be recomputed. A larger tree locates differences more precisely but costs more to exchange (Petrov).

**Sloppy quorums.** A strict quorum fails when fewer than w of a key's designated replicas are reachable. Dynamo instead uses the first n healthy nodes in the key's preference list, which may lie outside the usual set; such a node keeps the write with a hint naming the intended replica and hands it back when that replica recovers (DeCandia et al.). Cassandra and ScyllaDB call this consistency level ANY. The write survives, but a read from the designated replicas may miss it: availability bought with consistency (Petrov; DDIA).

**Why quorums do not give linearizability.** Even with w + r > n, a read can miss or reverse a write (DDIA):

- **A read concurrent with a write:** with n = 3 and w = 3, a write has reached one node. Client A reads two nodes and sees the new value; client B then reads two others and sees the old one. B started after A finished, yet saw older data (DDIA chapter 10).
- **A partly failed write:** reported as failed on fewer than w nodes, but not rolled back, so later reads may or may not return it, and successive reads can alternate (Petrov).
- **Lost overlap:** a node holding the new value is restored from a stale replica, rebalancing briefly confuses which nodes hold a key, or a sloppy quorum wrote outside the designated set.
- **Clocks and concurrency:** last write wins with wall-clock timestamps (Cassandra, ScyllaDB) drops writes when another node's clock runs ahead, and concurrent writes applied in different orders conflict as in multi-leader replication.
- **The fix and its limits:** reads and writes can be made linearizable if readers finish read repair before returning and writers first read a quorum's latest timestamp (Attiya, Bar-Noy, and Dolev 1995, via DDIA). Riak skips synchronous read repair for its cost; Cassandra performs it but loses linearizability to clock timestamps. Compare-and-set cannot be built this way at all; it needs consensus. The safe assumption is that a Dynamo-style store is not linearizable, and that w and r tune the probability of stale reads rather than guarantee fresh ones (DDIA). The models themselves are in [consistency models]({{< ref "engineering/distributed-systems/guarantees" >}}#consistency-models).

**Compared with a leader.** A leaderless store has no failover and handles the normal case and the failure case the same way: requests already go to several replicas, so a slow or failed one barely affects response time, and using the fastest responses (request hedging) cuts tail latency. This helps most with [gray failure]({{< ref "engineering/distributed-systems/system-models" >}}#gray-failure), where a leader-based system must decide whether a degraded node deserves a failover. The costs: hinted handoff adds load when the system is already strained, larger quorums raise the odds of waiting on a slow node (quorums rarely exceed four of seven or five of nine), and a wide network interruption can leave no quorum at all (DDIA).

**Across regions:** in Cassandra and ScyllaDB, a client writes to a coordinator in its own region, which sends the write to one replica in each other region for local fan-out. The client chooses a quorum across all regions, in each region, or only locally; a local quorum is fastest and most likely to be stale. Riak keeps n within one region and replicates between regions asynchronously, as multi-leader replication does (DDIA). The design checklist is in the [key-value store case]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design).

## Choosing a strategy


| Strategy | Writes go to | Consistency it can offer | Behavior on failure | Fits when |
| --- | --- | --- | --- | --- |
| Single leader, asynchronous | The leader | Linearizable at the leader; eventual from followers, with session guarantees through routing | Failover can lose acknowledged writes, and risks split brain without fencing | Read-heavy workloads that tolerate stale reads and a small loss window |
| Single leader, semi-synchronous or majority | The leader | As above, and failover to the up-to-date follower loses nothing acknowledged | Writes stall if the synchronous follower, or a majority, is unreachable | Data that must survive losing a node |
| Consensus (Raft, Multi-Paxos) | The elected leader | Linearizable, if reads confirm leadership or rely on a lease | Automatic, fenced failover; only the side with a majority progresses | Metadata, configuration, and data with invariants such as uniqueness |
| Chain replication | The head; reads at the tail | Linearizable; CRAQ adds reads at any node | Writes stop until the control plane removes a failed node; a chain tolerates N − 1 failures | Storage layers with a separate consensus-backed control plane |
| Multi-leader | A leader in each region or on each device | Eventual, or causal with dependency tracking; no invariants across leaders | Each leader keeps accepting writes through partitions; conflicts surface later | Several regions needing local write latency, offline clients, collaborative editing |
| Leaderless quorum | n replicas, through the client or a coordinator | Eventual, with staleness tuned by w and r; not linearizable in practice | No failover; writes survive n − w unavailable replicas and reads n − r; sloppy quorums trade consistency for availability | High availability and low tail latency for data whose conflicts can be merged |

**Trade-offs to state.** Most of these choices are database configuration options whose details vary, but the principles carry over (DDIA):

- **Synchronous or asynchronous:** how many acknowledged writes a failover may lose, against write latency and stalls behind a slow replica.
- **Failed replicas:** manual or automatic failover, fencing, the failure-detection timeout, and how long the leader keeps its log for an absent follower.
- **Whether writes can conflict:** single-leader replication avoids conflicts; multi-leader and leaderless replication need a resolution per data type.
- **Overall:** single-leader replication is popular because it is easy to understand and offers strong consistency; multi-leader and leaderless replication cope better with faulty nodes, network interruptions, and latency spikes, at the price of conflict resolution and weaker guarantees (DDIA). The theory behind this trade is [CAP and PACELC]({{< ref "engineering/distributed-systems/guarantees" >}}#cap-and-pacelc).

## In a design


1. For each dataset, record the strategy, the acknowledgment mode, and what a leader failure can lose; the options are in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options).
2. For each read, decide whether a follower may serve it and which session guarantee it needs, and record it with the requirement in [consistency]({{< ref "system-design/nfr/consistency" >}}#in-a-design).
3. Prefer a store whose failover runs on consensus, or elect leaders through a [coordination service]({{< ref "system-design/elements/data-at-scale" >}}#coordination), and fence everything a leader writes.
4. With multi-leader or leaderless replication, choose a merge per data type, and route writes that must preserve an invariant to one leader ([coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}})).
5. Alert on replication lag, measured as the leader's log position minus the follower's. Leaderless stores apply writes in no common order, so lag is hard to measure there, and the number of stored hints is only a rough signal (DDIA). Keep backups too, since replication copies mistakes.
6. Feed search indexes, caches, and other services from the log with CDC instead of dual writes ([publishing changes reliably]({{< ref "system-design/elements/data-across-services" >}}#publishing-changes-reliably)).

## Related notes


- [Partitioning]({{< ref "engineering/distributed-systems/partitioning" >}}): splitting the data that replication then copies; one leader per partition.
- [Guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}): the consistency models and [session guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}#session-guarantees) that lag violates, and CAP and PACELC.
- [Broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}): the election and log replication that make failover safe, and [quorums]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#quorums).
- [Coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}): conflict resolution, CRDTs, and sync engines for multi-leader and leaderless replication.
- [Time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}): version vectors, fencing tokens, and why wall-clock timestamps misorder writes.
- [System models]({{< ref "engineering/distributed-systems/system-models" >}}): failure detection, timeouts, and gray failure.
- [Transactions]({{< ref "engineering/distributed-systems/transactions" >}}): the guarantees replication alone does not provide.

## Gaps


- **Primary papers known only through summaries:** chain replication (van Renesse and Schneider 2004) and CRAQ through Vitillo and Davoudian et al.; Gray et al. (1996) through Davoudian et al.; Attiya, Bar-Noy, and Dolev (1995) through DDIA.
- **Not covered:** replica placement, push versus pull, and lease-based update propagation (van Steen and Tanenbaum section 7.4); probabilistically bounded staleness (Bailis et al.), which DDIA cites for how stale quorum reads are in practice.
- **Detecting concurrent writes:** DDIA's version-number and version-vector algorithm for leaderless stores is only linked, through [time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}) and [coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}); so are Petrov's bitmap version vectors and gossip (chapter 12). Leader election mechanisms (Vitillo chapter 9; Petrov chapter 10) are left to [broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}).

## Sources


- DeCandia et al., *Dynamo: Amazon's Highly Available Key-value Store*, SOSP 2007 ([doi:10.1145/1294261.1294281](https://doi.org/10.1145/1294261.1294281)).
- Elhemali et al., *Amazon DynamoDB: A Scalable, Predictably Performant, and Fully Managed NoSQL Database Service*, USENIX ATC 2022.
- van Renesse and Schneider, *Chain Replication for Supporting High Throughput and Availability*, OSDI 2004 ([PDF](https://www.cs.cornell.edu/home/rvr/papers/OSDI04.pdf)) -- cited by Vitillo and Davoudian et al.
- Terrace and Freedman, *Object Storage on CRAQ*, USENIX ATC 2009 ([PDF](https://www.usenix.org/legacy/event/usenix09/tech/full_papers/terrace/terrace.pdf)) -- cited by Vitillo.
- Gifford, *Weighted Voting for Replicated Data*, SOSP 1979 ([doi:10.1145/800215.806583](https://doi.org/10.1145/800215.806583)) -- cited by DDIA and van Steen and Tanenbaum.
- Attiya, Bar-Noy, and Dolev, *Sharing Memory Robustly in Message-Passing Systems*, Journal of the ACM 42(1), 1995 ([doi:10.1145/200836.200869](https://doi.org/10.1145/200836.200869)) -- cited by DDIA for linearizable quorum reads and writes.
- Gray, Helland, O'Neil, and Shasha, *The Dangers of Replication and a Solution*, SIGMOD 1996 -- cited by Davoudian et al. and van Steen and Tanenbaum.
- Ably blog, an introduction to CRDTs and the consistency problems they address: <https://ably.com/blog/crdts-distributed-data-consistency-challenges>.

## Library sources


- [Kleppmann and Riccomini 2026](/sources/f639f3efb30ff1f78d5f3bec89441c6e.bin), *Designing Data-Intensive Applications, Second Edition* -- chapter 6 on *Why replicate*, *Single-leader replication*, *Adding followers and handling outages*, *Replication logs*, *Replication lag*, *Multi-leader replication*, *Leaderless replication* (including multi-region operation), and *Choosing a strategy*, plus the object-storage sidebar in *Adding followers and handling outages*; chapter 10 ("Implementing Linearizable Systems") on why quorums do not give linearizability and on consensus-based failover; chapter 12 ("Change Data Capture") on CDC
- [Vitillo 2021](/sources/ad3d4e8b5cefd65937e33aaa96a1f034.bin), *Understanding Distributed Systems, Second Edition* -- chapter 10 on where reads are served (10.3) and *Chain replication* (10.4); chapter 17 on Azure Storage's use of chain replication
- [Petrov 2019](/sources/611239aecf452fc6fb065bb3088b0326.bin), *Database Internals* -- chapter 11 ("Tunable Consistency", "Witness Replicas") on quorums and witness replicas; chapter 12 ("Read Repair", "Digest Reads", "Hinted Handoff", "Merkle Trees") on catching up on missed writes and sloppy quorums. Petrov does not cover chain replication.
- [Tornow 2025](/sources/70c0d56c1ae98a9f558a6a07dc87c787.bin), *Think Distributed Systems* -- chapter 8 on replication transparency, replication versus partitioning, inherent and imposed lag, synchronous versus asynchronous replication, and state-based versus log-based replication
- [van Steen and Tanenbaum 2023](/sources/f2bbf8813969eb53517df7404b01c885.bin), *Distributed Systems, Fourth Edition* -- chapter 7: section 7.1 on reasons for replication and its bandwidth cost; section 7.4.3 on propagating state, operations, or invalidations; sections 7.5.1 and 7.5.2 on primary-backup and quorum-based protocols
- [DeCandia et al. 2007](/sources/da9436e162d5abe60df8b9ef9e4993ea.bin), *Dynamo: Amazon's Highly Available Key-value Store* ([doi:10.1145/1294261.1294281](https://doi.org/10.1145/1294261.1294281)) -- sections 4.5 to 4.7 on quorums, sloppy quorums, hinted handoff, and Merkle-tree anti-entropy; section 6 on the (3, 2, 2) configuration
- [Elhemali et al. 2022](/sources/545d057f7db540d59d6302aec8d112a4.bin), *Amazon DynamoDB*, USENIX ATC 2022 -- section 3 on Multi-Paxos replication groups and leader leases; sections 5.1 and 6.1 on log replicas
- [Davoudian et al. 2018](/sources/ed8ca9d23115ca84b294330e59371e82.bin), *A Survey on NoSQL Stores* ([doi:10.1145/3158661](https://doi.org/10.1145/3158661)) -- electronic appendix B on primary-copy versus update-anywhere and eager versus lazy replication, ROWA, quorum protocols, Paxos-based replication, and chain replication; appendix A on the replication strategy of each NoSQL store

Further reading:

- Educative 2023: Data Replication, *Grokking Modern System Design Interview* -- an interview-level overview of the same three families; it credits DynamoDB with leaderless replication, which applies to Dynamo, not DynamoDB
