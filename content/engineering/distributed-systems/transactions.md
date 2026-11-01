---
draft: false
toc: true
title: "Transactions"
description: "What transactions guarantee and how they are built: ACID defined precisely, isolation anomalies and the mechanisms that prevent them, serializability, two-phase commit and its failure modes, Spanner and Calvin, exactly-once processing, and sagas."
document_status: "draft"
linkTitle: "Transactions"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** what do transactions guarantee on one node and across nodes, and how are those guarantees implemented?

A transaction groups reads and writes into a unit that either commits or aborts, so an application can treat a crash halfway through, or a concurrent client, as an ordinary error and retry. Deciding whether an application needs transactions starts with what exactly they promise and what each promise costs. On one node the costs are locks, aborts, and bookkeeping. Across nodes, atomic commit adds a protocol that blocks when its coordinator fails, and between services that share no transaction manager, sagas and the outbox replace it with messages and compensation.

## What ACID means


Härder and Reuter coined ACID in 1983. Implementations differ so much, especially in isolation, that Kleppmann and Riccomini call ACID mostly a marketing term: a claim of ACID compliance says little about what a database guarantees.

- **Atomicity is abortability.** It says nothing about concurrency. If a fault (a crash, a dropped connection, a full disk, a violated constraint) stops a transaction partway, the database discards every write the transaction made, so the application knows nothing changed and can retry. DDIA suggests "abortability" would have been the better word.
- **Consistency is the application's invariants.** Statements such as "credits and debits balance" hold before and after each transaction, though not necessarily in the middle. The database enforces only invariants declared as constraints (foreign keys, uniqueness, check constraints); the rest depend on the application writing correct transactions. Tornow separates it as the one application-level guarantee, the other three being platform-level, and Vitillo reports Hellerstein's remark that the C was added to make the acronym work. It is unrelated to the C of CAP, which is linearizability ([what CAP proves]({{< ref "engineering/distributed-systems/guarantees" >}}#what-cap-proves)).
- **Isolation** means concurrent transactions do not interfere. Textbooks define it as serializability: the outcome equals some serial order. Most databases default to something weaker, and Oracle's level named "serializable" is snapshot isolation.
- **Durability** means committed data survives a crash. On one node that means nonvolatile storage, a write-ahead log, and `fsync`; in a replicated database it means copies on some number of nodes before the commit is acknowledged.

**Durability has limits.** DDIA lists how each technique fails, and concludes that disks, replication, and backups only reduce risk and belong together:

- A machine that dies keeps its data on disk but cannot serve it until repaired, which replication avoids. A correlated fault, such as a power loss or a bug that crashes every node on the same input, can take down all replicas at once and lose data held only in memory, so disks still matter in replicated systems.
- Asynchronous replication loses recent writes when the leader fails.
- Disks do not always do what they report. SSDs have violated their guarantees on sudden power loss, firmware has bugs, `fsync` is hard to use correctly (PostgreSQL misused it for over 20 years), and data can corrupt silently and spread to replicas and recent backups.

**Single-object and multi-object operations.** Storage engines almost always make a write to one object atomic and isolated on one node: a crash mid-write does not splice old and new values, and a reader does not see half a document. A log provides the atomicity and a per-object lock the isolation. Some stores add atomic increments and compare-and-set on single objects. These prevent some races but are not transactions: Cassandra's lightweight transactions, for example, give linearizable conditional writes on one object and nothing across objects.

Multi-object transactions are needed when several pieces of data must stay in step: a foreign key and the row it references, a denormalized counter beside the messages it counts, a secondary index beside its records. A multi-object API is not a transaction unless it says so, since a multi-put may succeed for some keys and fail for others. Retrying an aborted transaction has limits too (DDIA): a commit whose acknowledgment was lost runs twice unless the application deduplicates, retrying under overload adds load, and side effects outside the database, such as an email, happen even when the transaction aborts.

## How one node commits


The storage engine implements atomicity and durability with a write-ahead log (WAL). Each change is appended to the log, with the transaction ID and enough information to redo or undo it, before it is applied to data pages (Vitillo). The commit is decided when the commit record reaches disk: a crash before that point rolls the transaction back on recovery, and a crash after it replays the transaction. One device, the disk holding the log, makes the commit atomic (DDIA). Petrov describes the policies behind recovery. A **steal** policy lets the buffer manager flush an uncommitted transaction's pages, which requires undo records; a **no-force** policy lets a transaction commit before its pages are flushed, which requires redo records. ARIES is steal/no-force: on restart it analyzes the log, redoes history up to the crash, then undoes transactions that had not committed, logging the undo steps so that a crash during recovery does not repeat them. Tornow states the requirement for an undo log directly: undo operations must be idempotent and restartable.

## Isolation, anomaly by anomaly


The table of levels and the anomalies each allows is in [isolation levels]({{< ref "engineering/distributed-systems/guarantees" >}}#isolation-levels); this section covers the mechanism that rules out each anomaly. Level names do not transfer between databases. "Repeatable read" is snapshot isolation in PostgreSQL, a weaker MVCC scheme in MySQL, and serializability in Db2, because the SQL standard predates snapshot isolation and defines its levels ambiguously (Berenson et al. 1995).

### Read committed: dirty writes and dirty reads


Read committed promises no dirty writes (overwriting data another transaction has not committed) and no dirty reads (seeing it). It is the default in PostgreSQL, Oracle, and SQL Server.

- **Dirty writes** are prevented with row-level write locks. A transaction locks each row before modifying it and holds the lock until it commits or aborts; a second writer waits. Without this, two buyers of the same car could each win one of the two tables the purchase writes (DDIA).
- **Dirty reads** could be prevented by making readers take the same lock briefly, and Db2 and SQL Server (with `read_committed_snapshot=off`) do. Most databases avoid read locks, because one long write transaction would stall every reader of its rows. Instead the database keeps the old committed value of each row being written beside the uncommitted one, and serves readers the old value until the writer commits.

Read committed still allows **read skew**: a transaction reads two accounts at different moments and sees a transfer half done. That is harmless on a page the user can reload, but not for backups, analytic queries, and integrity checks that scan for hours while writes continue.

### Snapshot isolation and MVCC


Snapshot isolation gives each transaction a consistent snapshot: everything committed when it started, and nothing later. The implementation generalizes the two-version trick into **multiversion concurrency control** (MVCC), keeping several committed versions of a row because transactions that started at different times need different ones. Writers still take row locks against dirty writes, but reads take no locks, so readers and writers never block each other. PostgreSQL's implementation, as DDIA describes it (the [PostgreSQL MVCC documentation](https://www.postgresql.org/docs/7.2/mvcc.html) gives the database's own account):

- **Versions tagged by transaction ID.** Each transaction gets an increasing ID. Each row version records the ID that inserted it and, once deleted, the ID that deleted it. An update is a delete plus an insert, leaving two versions, and the versions of a row are chained so a query can walk them.
- **Visibility rules.** At its start, a transaction lists the transactions in progress. It then ignores writes by those transactions even if they later commit, writes by transactions with later IDs, and writes by aborted transactions. A version is visible if its inserter had committed when the reader started, and its deleter, if any, had not.
- **Garbage collection.** A delete only marks a version. A background process (vacuum, in PostgreSQL) later removes versions no transaction can see, with their index entries. Aborted writes need no immediate cleanup, since the visibility rules hide them. PostgreSQL's transaction IDs are 32-bit, so vacuum also keeps their wraparound from affecting data.
- **Indexes** point at one version of a row, and a query follows the chain to the visible one. CouchDB, Datomic, and LMDB use copy-on-write B-trees instead: each write transaction creates a new root, and each root is a snapshot.
- **Writes** are not covered by MVCC alone. Write transactions still need two-phase locking or optimistic validation; MVCC is the most common scheme because most transactions are read-only (Vitillo).

### Lost updates


Two transactions each read a value, modify it, and write it back, and the second write discards the first change. Counters, balances, edits inside a JSON document, and wiki pages saved whole are typical. The fixes:

- **Atomic operations** such as `UPDATE counters SET value = value + 1` take the read-modify-write cycle out of the application. The database locks the object exclusively during the update, or runs all such operations on one thread. They are the best fix when the change fits one, and ORMs make it easy to bypass them by accident.
- **Explicit locking** with `SELECT ... FOR UPDATE` locks the rows to be changed, for logic no query can express, such as validating a game move. A forgotten lock is a race, and locking several objects can deadlock.
- **Automatic detection** lets the cycles run in parallel and aborts a transaction whose update would be lost. Snapshot isolation in PostgreSQL (repeatable read), Oracle (serializable), and SQL Server does this; MySQL InnoDB's repeatable read does not, so by some definitions it is not snapshot isolation. It needs no application code beyond retries.
- **Compare-and-set** writes only if the value, or a version number, is unchanged since it was read, and otherwise retries; this is optimistic locking. It is safe only if the check sees concurrent writes, which many MVCC implementations allow as an exception to the visibility rules for the `WHERE` clause of an `UPDATE` or `DELETE`.
- **Merging, in replicated stores.** Multi-leader and leaderless replication have no single current copy, so locks and compare-and-set do not apply. Merging concurrent versions preserves updates only when operations commute, as in [CRDTs]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}#crdts); last write wins loses them by design.

### Write skew and phantoms


Two doctors are on call for a shift, and the hospital requires at least one. Both feel ill and request leave at the same moment. Each transaction checks that at least two doctors are on call, sees two in its snapshot, and takes its own doctor off. Both commit, and nobody is on call. Each updated a different row, so nothing was overwritten and this is not a lost update. It is **write skew**: two transactions read the same data, and each writes something that invalidates the premise of the other. Had the two run one after the other, the second request would have been refused.

Every example (meeting room bookings, claiming a username, spending more than a balance, moving two pieces to one square) follows three steps: a query checks a condition, the application decides on the result, and a write changes what the query would now return. When the write changes rows the query returned, as with the doctors, `FOR UPDATE` on those rows prevents the skew. When the query checks that no row matches, as with a free room, there is nothing to lock. A write that changes the result of another transaction's search is a **phantom**. Snapshot isolation hides phantoms from read-only queries but not from read-write transactions like these.

Single-object atomic operations and snapshot isolation's lost-update detection do not help, and few databases support constraints over several rows. A uniqueness constraint fixes the username case. Otherwise the choice is serializable isolation or **materializing conflicts**: create rows that stand for what is contended, such as one row per room per 15-minute slot for the next six months, and lock them. This turns a phantom into a row lock but leaks concurrency control into the data model, and DDIA treats it as a last resort.

## Serializability


Serializable isolation guarantees that concurrent execution has the same effect as some serial order, so transactions that are correct alone stay correct together. Tornow puts it as a Hoare triple: if each transaction preserves the invariant, any serial composition does too, and a serializable execution is equivalent to one of those. Three implementations are in use.

### Actual serial execution


Run one transaction at a time on one thread. This became practical in the 2000s (VoltDB/H-Store, Redis, Datomic) because the active data fits in RAM and OLTP transactions are short; long read-only queries run on a snapshot outside the loop. The thread cannot wait for a client between statements, so transactions are submitted whole as **stored procedures**, now written in general-purpose languages (Java or Groovy in VoltDB, Lua in Redis). VoltDB also replicates by running the same deterministic procedure on each replica, a form of [state machine replication]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#state-machine-replication). Throughput is one CPU core, and one slow transaction stalls all the others. **Partitioning** gives each core or node its own shard and thread, which scales only while each transaction stays within one shard. VoltDB reports about 1,000 cross-shard writes per second, orders of magnitude below its single-shard rate, and adding machines does not raise it.

### Two-phase locking


For about 30 years two-phase locking (2PL) was the only widely used algorithm for serializability; MySQL InnoDB and SQL Server use it for their serializable level. Despite the name, it has nothing to do with two-phase commit.

- **Shared and exclusive locks.** A reader takes a shared lock, which other readers may also hold; a writer takes an exclusive lock, which excludes everyone; a reader that later writes upgrades its lock. Writers block readers and readers block writers.
- **The two phases.** A transaction acquires locks while it runs and releases them at the end, and may not acquire one after releasing any. Holding all locks until commit (strict 2PL) also prevents cascading aborts (Vitillo).
- **Predicate and index-range locks.** To stop phantoms, a query takes a shared lock on its search condition, covering rows that do not exist yet, and any write whose old or new value matches a held predicate waits (Eswaran et al. 1976). Matching predicates is slow, so databases approximate them with **index-range (next-key) locks**: a lock on the index entry for room 123, or on a time range in a time index, covers a superset of the predicate. Without a suitable index, the fallback is a shared lock on the table.
- **Deadlocks** are frequent. The database finds cycles in a waits-for graph and aborts one transaction, or prevents cycles by age (Petrov): under wait-die an older transaction waits for a younger one's lock while a younger requester aborts; under wound-wait an older requester aborts the younger holder while a younger requester waits.
- **The cost is concurrency.** Any possible race makes one transaction wait. A transaction that reads a whole table blocks all writers to it for as long as it runs, so 2PL databases have unstable latency and slow high percentiles under contention.

### Serializable snapshot isolation


Serializable snapshot isolation (SSI; Cahill, Röhm, and Fekete 2008) is optimistic. Transactions run on a snapshot without blocking, and at commit the database aborts any whose execution was not serializable. SSI and similar algorithms are used in PostgreSQL's serializable level, SQL Server's Hekaton, CockroachDB, and FoundationDB. Write skew comes from acting on a premise that changed before commit, so SSI detects two cases:

- **Stale reads.** The transaction ignored an uncommitted write under the MVCC visibility rules. If that write has committed by the time the transaction commits, the transaction aborts. Deciding only at commit avoids needless aborts: a read-only transaction never needs one, and the other writer may still abort.
- **Writes that affect prior reads.** Reads are recorded on index ranges, as for index-range locks, but the record blocks no one. A write to a recorded range notifies the readers that their premise may be stale, and a transaction that tries to commit after a conflicting write has committed aborts. With the two doctors, the first to commit succeeds and the second aborts.

Performance depends on the abort rate. Coarse tracking is cheaper but aborts more than necessary. Long read-write transactions tend to conflict and abort, while long read-only ones are fine. No transaction waits for another's locks, so latency is steadier than under 2PL, and FoundationDB spreads conflict detection over several machines, so SSI is not limited to one core. Petrov and Vitillo describe classic optimistic concurrency control the same way: run in a private workspace, validate read and write sets against concurrent transactions at commit, restart on conflict. All optimistic schemes suffer under high contention, where retries add load to a busy system.

## Distributed transactions


A transaction that touches several shards, or a global secondary index on another node, is distributed. Concurrency control carries over: 2PL works across nodes, serial execution can be partitioned, and SSI has distributed checkers. Atomicity does not. If each node is told to commit on its own, some may commit and others abort, because of a constraint violation on one node, a lost request, or a crash before the commit record is written. A commit cannot be withdrawn once others may have read it, so all participants must agree on the outcome: the **atomic commitment** problem.

It resembles binary consensus with a stricter rule: one vote to abort forces an abort, and an abort is also allowed when a participant fails or times out. DDIA (chapter 10) lists its properties as uniform agreement (no node commits while another aborts), integrity (no node changes its decision), validity (commit only if all voted to commit), nontriviality (commit if all vote to and nothing times out), and termination (every node that does not crash eventually decides). Tornow states the same as safety, no two participants decide differently, and liveness, each eventually decides. A **blocking** protocol keeps safety but can lose liveness when a participant fails; a **nonblocking** one keeps both.

### Two-phase commit


Two-phase commit (2PC), which van Steen and Tanenbaum attribute to Gray (1978), adds a **coordinator** (transaction manager), often a library in the application process. Following DDIA:

1. The application gets a globally unique transaction ID from the coordinator and runs a local transaction under that ID on each **participant**. Until commit, any of them can abort.
2. **Prepare.** The coordinator asks each participant whether it can commit. A participant that votes yes has written the transaction durably and checked constraints and conflicts, and promises to commit if told to, whatever happens: it gives up the right to abort. A participant may instead vote no and abort on its own (Tornow).
3. **Commit point.** With all votes in, the coordinator decides, committing only if every vote was yes, and writes the decision to its own log on disk.
4. **Commit or abort.** The coordinator sends the decision and retries until every participant has it. A participant that crashed applies the decision when it recovers. The two promises, a participant's yes and the coordinator's logged decision, make 2PC atomic; a single-node commit fuses them into one log write.
- **In doubt.** If the coordinator fails after a participant voted yes, the participant can neither commit (another may have voted no) nor abort (another may have committed). It must wait, and a timeout does not help. van Steen and Tanenbaum describe a termination step in which a participant in doubt asks another: if that one has committed, commit; if it has aborted or never received the vote request, abort; if it is also prepared, ask further. If all are prepared, no one can decide, which is why 2PC is called blocking. Tornow shows why aborting on a timeout is unsafe: when the coordinator returns and sends commit, participants with differing clocks can disagree on whether it arrived in time.
- **Recovery from the coordinator's log.** On restart, the coordinator resolves every in-doubt transaction from its log and aborts those with no commit record. If the log is lost, an administrator must decide; if only its tail is lost, the coordinator may abort transactions it had committed, breaking atomicity.
- **Costs.** 2PC adds network round trips and extra `fsync` calls (DDIA), and one participant unreachable during prepare forces an abort, so every participant must be up for a transaction to commit (Petrov).

### Heterogeneous transactions and XA


X/Open XA (1991) is a C API, not a network protocol, for 2PC across different systems: relational databases such as PostgreSQL, MySQL, Db2, SQL Server, and Oracle, and brokers such as ActiveMQ and IBM MQ. In Java it appears as JTA over JDBC and JMS drivers. The coordinator is usually a library in the application process, logging to the application server's local disk. DDIA lists the operational problems:

- **Locks held while in doubt.** A participant must keep an in-doubt transaction's row locks, even across restarts, or risk violating atomicity. A coordinator that takes 20 minutes to restart holds them for 20 minutes; a lost log holds them until someone intervenes, blocking everything that touches those rows.
- **Orphaned transactions and heuristic decisions.** Bugs and corrupted logs leave transactions no coordinator can resolve. An administrator must check each participant and apply the same outcome everywhere, usually during an outage. Many XA implementations offer heuristic decisions, which let a participant commit or abort an in-doubt transaction unilaterally; DDIA calls "heuristic" a euphemism for probably breaking atomicity.
- **The application is a single point of failure.** Participants reach the coordinator only through the application's drivers, so replicating the coordinator does not take the application process out of the protocol.
- **Lowest common denominator.** XA cannot detect deadlocks across systems or work with SSI, since either needs a protocol for exchanging lock or conflict information.

### Nonblocking commit and consensus


Three-phase commit (Skeen 1981) adds a pre-commit round, so that no participant can move straight from undecided to committed, and participants that time out can decide from each other's states. It assumes bounded network delay and bounded response times. With unbounded delays and process pauses it cannot guarantee atomicity: Petrov shows a partition after which some participants commit on timeout and others abort. van Steen and Tanenbaum add that it is rarely used because the situations in which 2PC blocks are rare. The practical fix is to replace the single coordinator, and usually each participant, with a consensus group, so a failed node is replaced by election instead of waited for. Atomic commit and consensus are equivalent, since each can be built from the other (DDIA chapter 10). Vitillo notes that atomic commit is uniform consensus, in which even processes that later fail must agree, which is harder than plain consensus. The side-by-side comparison is in [consensus versus two-phase commit]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#consensus-versus-two-phase-commit).

### Database-internal transactions: Spanner and Calvin


Distributed transactions inside one database (Spanner, CockroachDB, TiDB, FoundationDB, YugabyteDB, VoltDB, and Kafka among brokers) avoid most of XA's problems because they need not interoperate with anything. DDIA lists what they fix: a replicated coordinator with automatic failover, direct communication between coordinator and shards, replicated shards so that one fault rarely forces an abort, and distributed concurrency control with deadlock detection and consistent reads across shards. Snapshot isolation and SSI are both available across shards. Petrov contrasts two designs:

- **Spanner** runs 2PC over consensus groups. Each shard is a Paxos group whose long-lived leader holds a lock table for 2PL and a transaction manager. In a multishard transaction one leader coordinates and the others participate, and each logs its prepare and commit records through its own Paxos group, so a crashed leader is replaced and the transaction resumes (Vitillo). Read-write transactions take locks; read-only transactions and snapshot reads use timestamped versions and take none. The coordinator picks a commit timestamp from TrueTime and waits out the clock uncertainty before releasing locks, which gives external consistency: if T1 commits before T2 starts, T1 has the smaller timestamp. The clock side is in [clocks with an uncertainty interval]({{< ref "engineering/distributed-systems/time-and-order" >}}#clocks-with-an-uncertainty-interval). Single-shard transactions skip 2PC.
- **Calvin** (Thomson et al. 2012) agrees on the order of transactions before executing them. A sequencer collects transactions into short epochs (10 ms batches in the original paper), replicates each batch with Paxos or asynchronously, and hands it to a scheduler that runs it under a deterministic protocol, in parallel where possible but in the agreed order. Every replica gets the same input and produces the same output, so a node failure does not abort a transaction and no commit round follows execution; Petrov notes the extra 2PC round Spanner pays for multipartition transactions in comparison. A transaction's read and write sets must be known before it runs. FaunaDB implements the design.

### Exactly-once message processing


If a broker's acknowledgment and the database writes for processing a message commit atomically, the message takes effect once even after retries: a failure aborts both, and the broker redelivers. Heterogeneous 2PC makes this possible across a broker and a database, but only if every side effect joins the protocol; an email server that does not will send twice. Two alternatives avoid heterogeneous 2PC (DDIA):

- **Deduplication in the database.** Record each processed message ID in a table, in the same local transaction as the processing writes. A redelivered message finds its ID and is acknowledged and dropped, and a uniqueness constraint covers two concurrent attempts. Only a local transaction is needed.
- **Atomic commit inside the framework.** Kafka, Google Cloud Dataflow, and VoltDB commit operator state, output messages, and input offsets together, with the transactions kept inside the system and amortized over many messages. Checkpoints and idempotent sinks, the rest of the picture, are in [fault tolerance and exactly-once]({{< ref "engineering/distributed-systems/distributed-computation" >}}#fault-tolerance-and-exactly-once).

## Across services: sagas and the outbox


2PC holds locks while it waits for every participant, so it assumes short transactions and available participants. A transaction that runs for hours or days, or spans organizations unwilling to let each other block their systems, cannot use it (Vitillo). Vitillo's model is a check sent between banks: each side acts without waiting for the other, the check must arrive and be deposited exactly once, and the accounts disagree while it travels. The result is atomic but not isolated.

- **Transactional outbox.** A service writes a message to an outbox table in the same local transaction as its change. A relay later sends it to a broker or the destination and deletes it on acknowledgment, so the message exists if and only if the change committed. Delivery is at least once, so the receiver deduplicates by an idempotency key. Vitillo compares it to state machine replication with the outbox as the log. Polling and log-tailing relays are in [publishing changes reliably]({{< ref "system-design/elements/data-across-services" >}}#publishing-changes-reliably).
- **Saga** (Garcia-Molina and Salem 1987). Local transactions T1 to Tn, each with a compensating transaction Ci that undoes it: either all complete, or compensations undo those that did. An orchestrator checkpoints the saga's state after each step, so a restarted orchestrator resumes where it stopped. It may resend a request after a crash or timeout, so participants must deduplicate. Workflow services and [durable execution]({{< ref "engineering/distributed-systems/distributed-computation" >}}#durable-execution) engines provide the orchestrator.
- **Missing isolation.** Other requests see a saga's intermediate states. A semantic lock, a dirty flag cleared when the saga ends, lets them fail or wait. Choreography versus orchestration, step ordering, and other countermeasures are in [operations that change several services]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services).

## Mechanisms compared


| Mechanism | What it guarantees | How it works | Cost |
| --- | --- | --- | --- |
| Write-ahead log | Atomicity and durability on one node | Log each change before applying it; the commit record decides; redo and undo on recovery | An `fsync` per commit or batch; recovery time |
| Row write locks | No dirty writes | Lock each written row until commit or abort | Writers to the same row wait |
| Old committed value, MVCC | No dirty reads; consistent snapshots under snapshot isolation | Versions tagged by transaction ID; visibility rules pick the version a reader sees | Space for old versions; garbage collection; write skew remains |
| Atomic operations, `FOR UPDATE`, compare-and-set | No lost updates | Lock the object, or write only if unchanged and retry | Needed at every call site; explicit locks can deadlock |
| Materialized conflicts | No write skew from phantoms at weaker levels | Precreated rows stand for contended ranges and are locked | Concurrency control in the schema |
| Serial execution | Serializability | One thread per shard runs whole transactions as stored procedures | One core per shard; slow cross-shard transactions; every transaction must be short |
| Two-phase locking | Serializability | Shared and exclusive locks held to commit; index-range locks for phantoms | Readers and writers block each other; deadlocks; unstable tail latency |
| Serializable snapshot isolation | Serializability | Snapshot reads; detect stale reads and writes to read ranges; abort at commit | Aborts under contention; tracking overhead |
| Two-phase commit | Atomic commit across participants | Prepare votes, coordinator logs the decision, then commit | Round trips and `fsync`s; blocks with locks held if the coordinator fails |
| 2PC over consensus groups (Spanner) | Atomic commit that survives node failures; external consistency with TrueTime | Coordinator and participants are replicated groups; commit wait on clock uncertainty | Consensus round per prepare and commit; clock infrastructure |
| Deterministic ordering (Calvin) | Serializable multishard transactions without a commit round | Agree on a batch order, then execute deterministically on every replica | Read and write sets known in advance; batching delay |
| Transactional outbox | A message is published if and only if the local change commits | Message row in the same local transaction; a relay publishes it later | At-least-once delivery; consumers deduplicate |
| Saga | Each step completes or is compensated | Local transactions with compensations, driven by an orchestrator or by events | No isolation; compensations to design; idempotent participants |

## In a design


- Find out which isolation level the database provides by default and what its name means there, then list the operations that can write skew under it: check-then-act on a condition, uniqueness not backed by a constraint, invariants over several rows. Give those serializable isolation, a constraint, or `FOR UPDATE` on the rows read. For single-object updates, prefer atomic operations and conditional writes, which also work in stores without multi-object transactions.
- Keep a transaction's data in one shard where the access pattern allows it, since cross-shard transactions are slower under every scheme above ([partitioning]({{< ref "engineering/distributed-systems/partitioning" >}})).
- Use distributed transactions inside one database; between different systems, use the outbox, [idempotent consumers]({{< ref "system-design/elements/communication" >}}#idempotent-consumer), and sagas instead of XA.
- State durability as a fault model: which failures a committed write survives (process crash, disk loss, datacenter loss) and whether failover can lose acknowledged writes. See [system models]({{< ref "engineering/distributed-systems/system-models" >}}) and [consistency]({{< ref "system-design/nfr/consistency" >}}).

## Related notes


- [Consistency guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}): the isolation level table, and how isolation differs from consistency models.
- [Broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}): the protocols that replicate coordinators and shards, and their comparison with 2PC.
- [Time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}): TrueTime and the timestamps MVCC and Spanner depend on.
- [Coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}): invariants that need no coordination, and merging instead of locking.
- [Distributed computation]({{< ref "engineering/distributed-systems/distributed-computation" >}}): exactly-once in stream processing, and durable execution for long workflows.
- [Replication]({{< ref "engineering/distributed-systems/replication" >}}): replication lag and failover, which bound durability in a replicated database.
- [Data across services]({{< ref "system-design/elements/data-across-services" >}}): sagas, the outbox, and the patterns around them.

## Gaps


- Timestamp ordering and the Thomas write rule (Petrov chapter 5); Percolator's client-driven 2PC over Bigtable and RAMP transactions with read atomic isolation (Petrov chapter 13).
- Formal isolation definitions (Adya's dependency graphs, Jepsen's model map) beyond DDIA's informal, example-based treatment.
- Optimizations of 2PC in practice, such as CockroachDB's parallel commits, and how Spanner's commit wait overlaps with its 2PC.
- Which databases offer which level today: the examples follow DDIA's survey and may have changed.

## Sources


- PostgreSQL Global Development Group, *Multi-Version Concurrency Control*, PostgreSQL 7.2 documentation (<https://www.postgresql.org/docs/7.2/mvcc.html>) -- on *Snapshot isolation and MVCC*.
- Härder and Reuter, *Principles of Transaction-Oriented Database Recovery*, ACM Computing Surveys 15(4), 1983 ([doi:10.1145/289.291](https://doi.org/10.1145/289.291)) -- coined ACID.
- Eswaran, Gray, Lorie, and Traiger, *The Notions of Consistency and Predicate Locks in a Database System*, CACM 19(11), 1976 ([doi:10.1145/360363.360369](https://doi.org/10.1145/360363.360369)).
- Berenson et al., *A Critique of ANSI SQL Isolation Levels*, SIGMOD 1995 ([doi:10.1145/568271.223785](https://doi.org/10.1145/568271.223785)).
- Cahill, Röhm, and Fekete, *Serializable Isolation for Snapshot Databases*, SIGMOD 2008 ([doi:10.1145/1376616.1376690](https://doi.org/10.1145/1376616.1376690)).
- Ports and Grittner, *Serializable Snapshot Isolation in PostgreSQL*, PVLDB 5(12), 2012 ([doi:10.14778/2367502.2367523](https://doi.org/10.14778/2367502.2367523)).
- Skeen, *Nonblocking Commit Protocols*, SIGMOD 1981 ([doi:10.1145/582318.582339](https://doi.org/10.1145/582318.582339)).
- Thomson, Diamond, Weng, Ren, Shao, and Abadi, *Calvin: Fast Distributed Transactions for Partitioned Database Systems*, SIGMOD 2012 ([doi:10.1145/2213836.2213838](https://doi.org/10.1145/2213836.2213838)).
- Corbett et al., *Spanner: Google's Globally-Distributed Database*, OSDI 2012.
- Garcia-Molina and Salem, *Sagas*, SIGMOD 1987 ([doi:10.1145/38713.38742](https://doi.org/10.1145/38713.38742)).

## Library sources


- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 8 on most sections ("The Meaning of ACID", "Weak Isolation Levels", "Serializability", "Distributed Transactions"); chapter 10 ("Atomic commitment as consensus") on *Nonblocking commit and consensus*; chapter 12 ("Atomic commit revisited") on *Exactly-once message processing*
- [Petrov 2019](/sources/system-design/data-systems/petrov-2019-database-internals.pdf.enc), *Database Internals* -- chapter 5 ("Recovery", "Concurrency Control") on *How one node commits*, deadlock handling, and optimistic concurrency control; chapter 13 on *Two-phase commit*, *Nonblocking commit and consensus*, and *Database-internal transactions: Spanner and Calvin*
- [Vitillo 2021](/sources/system-design/distributed-systems/vitillo-2021-understanding-distributed-systems.pdf.enc), *Understanding Distributed Systems, Second Edition* -- chapter 12 on ACID, concurrency control, MVCC, 2PC, and Spanner; chapter 13 on *Across services: sagas and the outbox*
- [Tornow 2025](/sources/system-design/distributed-systems/tornow-2025-think-distributed-systems.pdf.enc), *Think Distributed Systems* -- chapter 5 on consistency as the application-level guarantee, serializability, and undo logging; chapter 6 on atomic commit as safety and liveness, and 2PC under failure
- [van Steen and Tanenbaum 2023](/sources/system-design/distributed-systems/vansteen-2023-distributed-systems-4th-edition.pdf.enc), *Distributed Systems, Fourth Edition* -- section 8.5 on 2PC states, the termination step for participants in doubt, and three-phase commit

Further reading:

- [Cachin et al. 2011](/sources/system-design/distributed-systems/cachin-2011-reliable-and-secure-distributed-programming.pdf.enc), *Introduction to Reliable and Secure Distributed Programming* -- section 6.6, nonblocking atomic commit from best-effort broadcast, a perfect failure detector, and uniform consensus
