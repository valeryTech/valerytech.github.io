---
draft: false
toc: true
title: "Distributed Computation"
description: "How work is split across machines: partitioning and data locality, Burns's sharding, scatter/gather and work-queue patterns, MapReduce and dataflow engines, distributed joins, stream processing, consistent checkpoints, and durable execution."
document_status: "draft"
linkTitle: "Distributed Computation"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** how is a computation split across machines, and how is the result kept correct when parts fail?

A computation too large or too slow for one machine is split into tasks that run in parallel, each over part of the input, and their partial results are combined. With many tasks running for a long time, some task will crash or be preempted, so the central design question is what makes a task safe to run again. The answer depends on the input: batch jobs rerun tasks over immutable input, stream processors restore checkpoints and make their output idempotent or transactional, and durable execution records each step of a workflow so a crashed process can resume.

## Splitting the work


Every distributed computation makes three choices:

- **Partition the input:** divide data or requests into shards, by hash of a key or by range, so tasks run independently. The key decides which records meet in the same task, and a skewed key creates a hot shard ([partitioning]({{< ref "engineering/distributed-systems/partitioning" >}})).
- **Place computation near the data:** a distributed filesystem such as HDFS lets the scheduler run a task on a machine holding a replica of its input, which saves bandwidth when the code is smaller than the data. Object stores keep storage and compute apart: more network traffic, but each side scales independently, and fast datacenter networks make that acceptable (Kleppmann and Riccomini 2026).
- **Combine partial results:** a root merges answers from leaves, a reducer merges values per key, or a barrier waits for every task before the next stage. A partial result must carry what the merge needs: Burns (2018) merges per-town histograms of family size only after weighting each by the town's population.

Burns names the shapes that recur when this is built from containers:

| Pattern (Burns chapter) | How work is split | How results combine | Failure behavior |
| --- | --- | --- | --- |
| Sharded services (6) | Each shard serves a subset of requests, picked by a sharding function on a key | No merge: one shard answers | A failed shard affects only its keys; a hot shard is replicated or moved |
| Scatter/gather (7) | Each request fans out to all leaves, which hold replicas or shards of the data | The root merges partial answers: intersection for term-sharded search, union for document-sharded | The slowest leaf sets the latency and any failed leaf fails the request, so each leaf shard is replicated |
| Work queue systems (10) | Independent items, one worker each | None needed | The manager diffs the item list against existing jobs; the orchestrator reruns a job until it succeeds |
| Event-driven batch processing (11) | Queues linked into a directed acyclic graph by copier, filter, splitter, sharder, and merger stages | A merger joins queues into one | Sharding a queue limits a bad worker release to one shard |
| Coordinated batch processing (12) | Sharded work queues (the map side) | Join: release nothing until all items finish; reduce: merge outputs as they arrive | A join holds back irreversible steps, such as deleting originals, until every shard has succeeded |

Three points from Burns carry over to any framework:

- **Parallelism has limits:** each leaf adds fixed request overhead, so speedup from more leaves is asymptotic, and the fan-out multiplies tail latency ([scatter-gather and tail latency]({{< ref "system-design/elements/data-at-scale" >}}#scatter-gather-and-tail-latency)).
- **Queues need capacity math:** a work queue is stable only while processing time per item, divided by the parallelism, stays below the interarrival time of new items. Burns scales down until processing time reaches 90 percent of the interarrival time.
- **Join versus reduce:** a join (barrier synchronization) guarantees the full set is present before aggregation, at the cost of parallelism and latency. A reduce produces output of the same form as its input, so it can be applied repeatedly in a tree and can start while the map side still runs.

## Batch processing


A batch job reads bounded, read-only input and generates its output from scratch. It does not mutate data in place, so a failed task's partial output can be deleted and the task rerun on another machine, and a buggy job can be fixed and rerun; Kleppmann and Riccomini call this human fault tolerance. Throughput is the measure, and jobs run for minutes to days. Retries are routine because schedulers preempt low-priority tasks and spot instances more often than hardware fails.

### MapReduce


Dean and Ghemawat (2004) published MapReduce at Google. It is now largely obsolete and no longer used there, but its model lives on in its successors. A job has four steps:

1. Read the sharded input and break it into records.
2. The **mapper** extracts key-value pairs from each record, keeping no state between records.
3. The **shuffle** sorts by key across machines. Each mapper writes one local file per reducer, picking the file by a hash of the key, and sorts each file. Each reducer copies its file from every mapper and merges them, so values for a key become adjacent.
4. The **reducer** is called once per key with an iterator over its values and writes one output shard per reduce task.

Fault tolerance follows from the model:

- **Deterministic tasks on immutable input:** the mapper and reducer depend only on what the framework passes them, so any call can be rerun elsewhere with the same input. Retries happen per task, not per job.
- **Visibility on success:** task output becomes visible only when the task completes, so a successful job's output equals one run of every task, even if some ran twice. A failed job produces nothing.
- **Materialized intermediate state:** between jobs of a workflow, MapReduce writes intermediate data to the distributed filesystem and lets the next job read it only after the writer succeeds. That tolerates frequent preemption but costs replicated writes and prevents pipelining.
- **External writes break it:** a task that writes to a live database duplicates those writes on retry and exposes partial results. Kleppmann and Riccomini recommend pushing output through a stream or bulk-loading a newly built database, with a completion notice before consumers make the data visible.

### Dataflow engines


Spark (Zaharia et al. 2012) and Flink (Carbone et al. 2015) treat a whole workflow as one job, a graph of operators, following the Dryad and Nephele research systems. Compared with chained MapReduce jobs, they sort only where an operator needs it, fuse consecutive operators that keep the partitioning (map, filter) into one task, place consumers near producers, keep intermediate state in memory or on local disk, and start operators as soon as their input is ready.

With intermediate state no longer durable, recovery takes one of two forms:

- **Recompute from lineage:** Spark records how each intermediate dataset was derived and recomputes a lost partition from its inputs. Recomputation has to produce the same data that downstream tasks already consumed, so operators need to be deterministic.
- **Restore a checkpoint:** Flink periodically snapshots task state to durable storage and restarts from the latest snapshot ([consistent checkpoints](#consistent-checkpoints)).
- **The trade-off:** materializing, as MapReduce does, pays I/O on every run so that failures are cheap; lineage pays only when something is lost, and the cost grows with the number of stages to recompute.

### Joins and grouping


The shuffle makes joins and aggregations scale: it brings every record with a given key to the same task, whichever input shard it came from. In Kleppmann and Riccomini's sort-merge join, one mapper emits activity events keyed by user ID and another emits each user's date of birth keyed the same way. A secondary sort puts the profile first, so the reducer holds one profile in memory, streams that user's events, and makes no network requests. Grouping works the same way: a second job shuffles by URL and counts viewers by age group.

| Join | Precondition | Data movement |
| --- | --- | --- |
| Sort-merge | None | Both inputs shuffled and sorted by the join key |
| Broadcast hash | One input fits in memory on every task | The small input is copied to every task, which streams its shard of the large input against a hash table |
| Partitioned hash | Both inputs already partitioned by the join key into the same partitions | Each task joins one pair of matching partitions; nothing is shuffled |

Cost-based optimizers in Hive, Trino, Spark, and Flink pick the algorithm from properties of the inputs and may reorder joins to keep intermediate state small.

## Stream processing


A stream processor is a job whose input never ends. Sharding and parallelism work as in batch, but two things change: an unbounded input cannot be sorted, which rules out sort-merge joins, and a job that has run for years cannot restart from the beginning after a crash.

### Event time and late events


- **Processing time** is the clock of the machine running the operator. It is simple and fine when delays are negligible, but breaks under lag: a processor redeployed after a minute of downtime shows a false spike in request rate while it drains the backlog.
- **Event time** is the timestamp in the event. Windowing by it makes reprocessing deterministic: the same input gives the same result.
- **Stragglers:** with event time, a window is never certainly complete. The options are to drop late events and count them as a metric, or to publish a corrected result and retract the earlier one. A producer can also emit a message saying no event earlier than time *t* will follow, which frameworks call a watermark; with many producers, consumers must track each one.
- **Untrusted clocks:** for device events, log the device time of the event, the device time of sending, and the server time of receipt; the last two estimate the device's clock offset.

Window types are tumbling (fixed length, each event in exactly one window), hopping (fixed length with overlap, built from tumbling windows), sliding (all events within an interval of each other), and session (per user, closed after a gap in activity). A count needs constant state, but sliding windows and joins buffer events, so window length times throughput sets the state each task holds.

### Stream joins


All three kinds keep state built from one input and query it with records from the other:

- **Stream-stream (window join):** match searches and clicks by session ID within, for example, an hour. Both are indexed in state; a match emits an event naming the clicked result, and a search that expires unmatched emits one naming the results not clicked. The click can arrive first.
- **Stream-table (enrichment):** keep a local copy of the table, a hash join, and keep it current by consuming the table's changelog through change data capture. This is a join whose window reaches back to the beginning of time.
- **Table-table (materialized view maintenance):** home timelines are the join of posts and follows, kept current incrementally: a change on one side joins with the current state of the other, following the product rule (u·v)′ = u′v + uv′.

Order across streams and partitions is not guaranteed, so which version of a profile an event meets can differ between runs: the join is nondeterministic. Giving each version of a record its own identifier (the slowly changing dimension technique) makes it deterministic, at the cost of keeping every version, which rules out log compaction.

### Fault tolerance and exactly-once


Batch gets correct output despite retries because output is visible only when a task finishes. A stream never finishes, so Kleppmann and Riccomini describe other mechanisms:

- **Microbatching** (Spark Streaming) cuts the stream into batches of about one second and treats each as a batch job. Smaller batches cost scheduling overhead; larger ones delay results. It imposes a processing-time tumbling window equal to the batch size.
- **Checkpointing** (Flink) injects barriers into the stream that trigger rolling checkpoints of operator state to durable storage. After a crash, an operator restarts from its latest checkpoint and discards output produced since, without a fixed window size.
- **Atomic commit** makes outputs, state changes, and input acknowledgments (including consumer offsets) take effect together. Google Cloud Dataflow, VoltDB, and Kafka do this with transactions kept inside the framework and amortized over several messages ([transactions]({{< ref "engineering/distributed-systems/transactions" >}})).
- **Idempotent writes** store the input offset with each value written, so a replayed write is recognized. This assumes replay in the same order, deterministic processing, and no concurrent writer; failover to a new node needs fencing ([coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination)).
- **State recovery:** keep state in a replicated remote store (slow per message), keep it local and replicate it periodically (Flink snapshots to a distributed filesystem, Kafka Streams writes a compacted changelog topic, VoltDB processes each input on several nodes), or rebuild short-window state by replaying input.

**Where "exactly-once" comes from.** The term describes an outcome, not a count of executions. Tornow (2025) separates exactly-once processing, which cannot be guaranteed, from exactly-once processing semantics: the final state is equivalent to processing each message once. Kleppmann and Riccomini make the same point by calling Viktor Klang's term, effectively-once, the more descriptive one. It is assembled from three parts:

1. **At-least-once input:** a replayable source, such as a log-based broker, and retries, so nothing is skipped.
2. **Rollback of internal effects:** a checkpoint or batch boundary restores state and rewinds input to the same point, discarding later output.
3. **Safe external effects:** output committed atomically with the input offsets, or idempotent output keyed by offset or request ID.

Microbatching and checkpointing alone give parts 1 and 2, so the guarantee holds only inside the framework. Writes to a database, an external broker, or an email service repeat after a restart unless part 3 covers them.

## Consistent checkpoints


van Steen and Tanenbaum (2023) define the requirement for recovery: a set of checkpoints must form a consistent global state, or distributed snapshot, in which every message recorded as received is also recorded as sent. The most recent such set is the recovery line.

- **Independent checkpointing:** each process saves state on its own schedule. After a crash, the latest checkpoints may be inconsistent, forcing further rollbacks that can cascade to the initial state (the domino effect). Avoiding it requires tracking dependencies between checkpoint intervals.
- **Coordinated checkpointing:** a coordinator multicasts a checkpoint request; each process saves its state, queues later outgoing messages, and acknowledges; a checkpoint-done message releases them. Messages after the request are excluded, so the result is consistent. An incremental snapshot involves only processes that depend on the coordinator.
- **Why coordination wins:** the cost of saving state to stable storage, not coordination, dominates, so the simpler coordinated scheme is the more popular one (Elnozahy and Plank 2004, cited by van Steen).

**Chandy and Lamport (1985)** record a consistent global state without stopping the system, assuming FIFO channels. The initiator records its own state and sends a marker on every outgoing channel. A process that receives its first marker records its state, records that channel as empty, and sends markers on all its outgoing channels. On each other incoming channel, it records the messages that arrive until the marker arrives on that channel; those messages are the channel's state, in flight when the snapshot was cut. The snapshot is complete when every process has received a marker on every incoming channel. The recorded state may never have existed at a single instant, but it is one the system could have passed through, which is all recovery needs.

A stream processor's barrier plays the role of the marker: it travels with the data and separates the records each operator processed before the checkpoint from those after it. Flink's asynchronous barrier snapshots (Carbone et al. 2015) adapt the algorithm to dataflow graphs. An operator with several inputs waits until the barrier has arrived on all of them before snapshotting, which aligns the inputs, so in an acyclic graph no channel state has to be recorded. Recovery restores every operator from the same checkpoint and rewinds the input to the matching position, which is why the input must be replayable.

## Resource conflicts without a coordinator


Tasks sometimes need exclusive access to overlapping sets of resources, such as write locks on the same data items. Chandy and Misra (1984) solved fair allocation of such resources with no central lock manager.

- **Drinking philosophers:** processes sit at the vertices of a graph, with an edge where two may conflict and a bottle on each edge. A thirsty process needs a nonempty subset of its bottles, possibly a different one each session, and drinks once it holds them all. Neighbors communicate only by messages delivered in finite time. The solution must be fair (no process stays thirsty forever), symmetric (same rules for all, no static priorities), economical, concurrent (neighbors needing different bottles can drink at once), and bounded in messages.
- **Why symmetry is hard:** a deterministic algorithm can favor only a process that is distinguishable from its rivals, and fairness requires that the favored process change over time. The paper cites Lehmann and Rabin's result that no perfectly symmetric deterministic solution exists even for dining philosophers.
- **Precedence graph:** each edge points from the process with precedence to the one that must yield to it. If the graph stays acyclic, a process's depth distinguishes it from its neighbors. Two rules keep it so: a process may redirect all its edges toward itself in one atomic step, and a process that wins must then yield to all its neighbors in finite time.
- **Forks encode the graph:** each edge also carries an auxiliary fork, clean or dirty. A fork gets dirty when used and is cleaned when sent; a process that is not eating gives up a requested dirty fork and keeps a clean one. Who holds the fork, and its state, gives the edge direction, so precedence changes locally. A process sends a requested bottle unless it needs that bottle and is either drinking or holding the fork.

At most three messages (a request, a bottle, or a fork) are in transit from one neighbor to another at any time. The same construction solves concurrent mutual exclusion over many resources, with colored bottles standing for, say, exclusive access to particular files.

## Durable execution


Tornow (2025) starts from a signup function that charges a card and then creates an account. A crash between the two steps leaves the user charged with no account: the sequential composition of two atomic actions is not atomic.

- **Failure-transparent recovery:** a failed, recovered, and continued execution is equivalent to a failure-free one, under an equivalence the application chooses. Identity equivalence means exactly-once, which is not always achievable; practical choices allow repeating the last step, the last *n* steps, or (restart) all of them, so steps must be idempotent.
- **Restart or resume:** restarting from the beginning is simple but wrong when a step waits (a restart resets a one-week delay before charging) or is nondeterministic (reading the clock, generating random numbers). Resuming continues from the last saved point.
- **Sagas:** application-level, failure-aware code that persists the saga's state and next step after each step, typically as a state machine. Tornow finds that this obscures the business logic.
- **Durable execution:** platform-level, failure-agnostic code. A log-based runtime records each step's result and, after a crash, reruns the function while returning recorded results for steps already done; it needs deterministic code and its log keeps growing. A state-based runtime saves the continuation after each step and reloads it, needing no determinism but requiring serializable continuations, which most runtimes lack.

Kleppmann and Riccomini add the operational costs of frameworks such as Temporal and Restate: external services still need idempotent APIs called with unique IDs; reordering calls in workflow code breaks replay, so new code is deployed as a new version while running workflows finish on the old one; and clocks and random numbers must come from the framework's deterministic versions. The idea matches stream checkpointing at the granularity of a step: record progress durably, replay deterministically, and make external effects idempotent. Task queues and schedulers that hand such steps to workers are covered in [task queues and scheduling]({{< ref "system-design/elements/messaging" >}}#task-queues-and-scheduling).

## Comparing the approaches


| Approach | Unit of work | How failure is handled | Latency of results |
| --- | --- | --- | --- |
| Scatter/gather | One request's share on each leaf | Replicated leaves; the root waits for, hedges, or drops the slow leaf | One request, set by the slowest leaf |
| Work queue | One independent item | Orchestrator reruns the job until it succeeds; workers must tolerate reruns | Per item, set by backlog against worker capacity |
| MapReduce | One map or reduce task over a shard | Rerun the task on immutable input; intermediate data materialized; output visible only on success | When the whole job ends: minutes to days |
| Dataflow engine (batch) | One operator task over a partition | Recompute lost partitions from lineage, or restart from a checkpoint | When the job ends, sooner than chained MapReduce |
| Microbatch stream | A batch of about one second | Rerun the batch; external writes need idempotence or atomic commit | Batch interval plus processing time |
| Checkpointed stream | Each event, with operator state | Restore the last checkpoint, replay input, discard later output; transactional or idempotent sinks | Continuous, per event or per window |
| Durable execution | One workflow step | Replay the step log or reload the continuation; completed steps are skipped; external calls idempotent | Per workflow, which may wait for days |

## In a design


- **Choose by input and freshness:** bounded input with a deadline suits batch; results needed as events arrive suit a stream processor; a multi-step operation across services suits durable execution or a saga ([data across services]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services)).
- **Make every task restartable:** read immutable input, write to a new location, expose output only on success. A job that writes into a live database loses this; publish through a stream or bulk-load a new database and switch over.
- **State the time semantics:** event or processing time, the window type, and the late-event policy (drop and count, or correct and retract).
- **Draw the exactly-once boundary:** list every external side effect and give each a transactional sink or an idempotency key ([idempotent consumer]({{< ref "system-design/elements/communication" >}}#idempotent-consumer), [publishing changes reliably]({{< ref "system-design/elements/data-across-services" >}}#publishing-changes-reliably)).
- **Partition for parallelism and order:** stream partitions bound both parallelism and ordering, and partitions move between consumers on rebalance ([consumer groups and rebalancing]({{< ref "system-design/elements/messaging" >}}#consumer-groups-and-rebalancing)).
- **Treat the scheduler as a control plane:** a job orchestrator's resource manager and scheduler are centralized, which Kleppmann and Riccomini note can limit scalability and availability; YARN and Kubernetes keep cluster state in ZooKeeper or etcd ([control plane]({{< ref "system-design/elements/control-plane" >}})). Task leases need fencing tokens ([coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination)).

## Related notes


- [System models]({{< ref "engineering/distributed-systems/system-models" >}}): crash-stop and partial failure, the faults these mechanisms tolerate.
- [Time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}): the clocks behind event time, and timestamp-based mutual exclusion.
- [Partitioning]({{< ref "engineering/distributed-systems/partitioning" >}}): how input is sharded and where hot keys come from.
- [Replication]({{< ref "engineering/distributed-systems/replication" >}}): replicated input blocks and replicated operator state.
- [Transactions]({{< ref "engineering/distributed-systems/transactions" >}}): the atomic commit behind transactional stream output.
- [Broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}): the coordination services that hold scheduler and cluster state.
- [Coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}): merging partial results without agreement, as a reduce does.
- [Guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}): what readers of derived output can expect.
- [Verification]({{< ref "engineering/distributed-systems/verification" >}}): testing that recovery actually produces equivalent results.
- [Stream processing]({{< ref "engineering/topics/stream-processing" >}}) and [streaming]({{< ref "engineering/topics/streaming" >}}): earlier collected notes and links on event streaming.
- System design hubs: [messaging]({{< ref "system-design/elements/messaging" >}}) and [data at scale]({{< ref "system-design/elements/data-at-scale" >}}).

## Gaps


- The Chandy-Lamport and asynchronous-barrier descriptions above come from the original papers' well-known content, not from a local source; the papers are not in the library. Unaligned checkpoints and snapshots of cyclic dataflows are not covered.
- Broadcast and partitioned hash joins are standard techniques that the second edition of DDIA no longer details; the first edition's batch chapter did.
- Skew in shuffles and joins, and speculative execution of straggler tasks in batch jobs.
- Watermark generation, triggers, and accumulation modes in the Dataflow model (Akidau et al. 2015).
- Iterative and graph computation, such as bulk synchronous parallel processing.
- Cluster scheduling policies (gang scheduling, dominant resource fairness), only named here.
- Unifying batch and stream processing (Kleppmann and Riccomini, chapter 13).

## Sources


- Dean and Ghemawat, *MapReduce: Simplified Data Processing on Large Clusters*, OSDI 2004.
- Zaharia et al., *Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing*, NSDI 2012.
- Carbone, Ewen, Haridi, Katsifodimos, Markl, and Tzoumas, *Apache Flink: Stream and Batch Processing in a Single Engine*, IEEE Data Engineering Bulletin 38(4), 2015.
- Carbone, Fóra, Ewen, Haridi, and Tzoumas, *Lightweight Asynchronous Snapshots for Distributed Dataflows*, 2015 ([arXiv:1506.08603](https://arxiv.org/abs/1506.08603)).
- Akidau et al., *MillWheel: Fault-Tolerant Stream Processing at Internet Scale*, PVLDB 6(11), 2013 ([doi:10.14778/2536222.2536229](https://doi.org/10.14778/2536222.2536229)).
- Akidau et al., *The Dataflow Model: A Practical Approach to Balancing Correctness, Latency, and Cost in Massive-Scale, Unbounded, Out-of-Order Data Processing*, PVLDB 8(12), 2015 ([doi:10.14778/2824032.2824076](https://doi.org/10.14778/2824032.2824076)).
- Helland, *Idempotence Is Not a Medical Condition*, Communications of the ACM 55(5), 2012 ([doi:10.1145/2160718.2160734](https://doi.org/10.1145/2160718.2160734)).
- Elnozahy and Plank, *Checkpointing for Peta-Scale Systems: A Look into the Future of Practical Rollback-Recovery*, IEEE Transactions on Dependable and Secure Computing 1(2), 2004.
- Chandy and Misra, *The Drinking Philosophers Problem*, ACM Transactions on Programming Languages and Systems 6(4), 1984 ([doi:10.1145/1780.1804](https://doi.org/10.1145/1780.1804)).
- Chandy and Lamport, *Distributed Snapshots: Determining Global States of Distributed Systems*, ACM Transactions on Computer Systems 3(1), 1985 ([doi:10.1145/214451.214456](https://doi.org/10.1145/214451.214456)) -- on *Consistent checkpoints*.

## Library sources


- [Kleppmann and Riccomini 2026](/sources/f639f3efb30ff1f78d5f3bec89441c6e.bin), *Designing Data-Intensive Applications, Second Edition* -- chapter 11 (*Batch Processing in Distributed Systems*, *MapReduce*, *Dataflow Engines*, *Shuffling Data*, *Joins and Grouping*, *Serving Derived Data*) on *Splitting the work* and *Batch processing*; chapter 12 (*Reasoning About Time*, *Stream Joins*, *Fault Tolerance*) on *Stream processing*; chapter 5 (*Durable Execution and Workflows*) on *Durable execution*
- [Burns 2018](/sources/217f0c643d90d836d19e229608ed9405.bin), *Designing Distributed Systems* -- chapters 6 (*Sharded Services*), 7 (*Scatter/Gather*), 10 (*Work Queue Systems*), 11 (*Event-Driven Batch Processing*), and 12 (*Coordinated Batch Processing*) on *Splitting the work*
- [Tornow 2025](/sources/70c0d56c1ae98a9f558a6a07dc87c787.bin), *Think Distributed Systems* -- chapter 11 (*Durable executions*) on *Durable execution*; chapter 4, sections 4.4 and 4.5, on exactly-once processing semantics and idempotence in *Fault tolerance and exactly-once*
- [van Steen and Tanenbaum 2023](/sources/f2bbf8813969eb53517df7404b01c885.bin), *Distributed Systems, Fourth Edition* -- chapter 8, section 8.6.2 (*Checkpointing*) on *Consistent checkpoints*
- [Chandy and Misra 1984](/sources/b96aa1604487a89124755ed1dad97dd4.bin), *The Drinking Philosophers Problem* -- sections 1-3 and 6 on *Resource conflicts without a coordinator*

Further reading:

- [Vitillo 2021](/sources/ad3d4e8b5cefd65937e33aaa96a1f034.bin), *Understanding Distributed Systems* -- section 23.2 on why a consumer can only simulate exactly-once processing with idempotent messages
- Educative 2023: distributed task scheduler, *Grokking Modern System Design Interview* -- retries, idempotent tasks, checkpoints for long tasks, and dead-letter queues
