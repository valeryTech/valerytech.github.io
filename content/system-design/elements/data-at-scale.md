---
draft: false
toc: true
title: "Data at Scale"
description: "Design question hub on storing and serving more data than one machine can: replication, partitioning, consistent hashing, hot keys, caching, storage choice, indexes and search, unique identifiers, rate limiting across nodes, and batch processing."
linkTitle: "Data at Scale"
---

**Question:** how do you store more data, and serve more reads and writes, than one machine can handle, while keeping latency and correctness acceptable?

The microservices pattern language does not cover this question; it assumes each service can handle its own data. Most interview cases are about it, so it keeps its own hub, using the same format.

## Forces


- **Data size and throughput:** what grows, and which resource runs out first. See [scalability]({{< ref "system-design/nfr/scalability" >}}#define-what-grows) and [capacity estimates]({{< ref "engineering/topics/envelope-estimations" >}}).
- **Latency:** distance to the data and the number of round trips.
- **Availability and durability:** copies on several machines survive failures. They must be kept in agreement.
- **Consistency:** every copy, whether a replica, a cache, an index, or a view, can be stale. Decide what each operation may observe; see [consistency]({{< ref "system-design/nfr/consistency" >}}).
- **Skew:** real workloads concentrate on hot keys, hot partitions, and peak hours.
- **Coordination:** every decision that several nodes must agree on costs round trips and fails when nodes cannot reach each other.

## Options


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Replication | Keep copies on several nodes: single-leader, multi-leader, or leaderless. | Read scaling, availability, or data close to users. | Replication lag and its read anomalies; with asynchronous replication, failover can lose acknowledged writes. See [replication]({{< ref "engineering/distributed-systems/replication" >}}). |
| Partitioning (sharding) | Split data across nodes by key range or by hash of a key. | The data or write load exceeds one node. | The partition key decides the load distribution; hot keys, cross-partition queries, secondary indexes, rebalancing. See [partitioning]({{< ref "engineering/distributed-systems/partitioning" >}}). |
| Consistent or rendezvous hashing | Map keys to nodes so that a membership change moves only a small share of keys. | Caches and stores whose node set changes. | Uneven load without virtual nodes or weighting. See [hashing]({{< ref "engineering/distributed-systems/hashing" >}}). |
| Hot-key splitting (sharded counters) | Split one hot key into N sub-keys, such as `likes:post42#0` to `likes:post42#7`. Each write goes to one sub-key; a read sums them, or reads a total that a background job refreshes. Salting a hot partition key is the same idea. | One value receives more writes than one partition can absorb, such as likes or views on a viral post. | Reads fan out to N keys or see a slightly stale total; choosing N. Whether a user has already liked a post needs a separate set keyed by user, which also makes the like idempotent. For unique counts, HyperLogLog trades exactness for small, fixed memory. |
| Caching | Keep frequently read data closer to the reader: client, CDN, application cache, or database cache. Write policies include cache-aside, write-through, write-around, and write-back. | Read-heavy access with tolerable staleness. | Invalidation, cache stampedes, cold starts, and data loss with write-back. See [caching]({{< ref "engineering/topics/caching" >}}). |
| Storage choice | Match the storage model to the access patterns: relational, key-value, wide-column, document, or object storage. | Always; decide from objects, relations, mutability, and access patterns. | Each model makes some queries cheap and others expensive. See [databases]({{< ref "engineering/data/databases" >}}), [database trade-offs]({{< ref "engineering/data/trade-off-db" >}}), and [key-value stores and data grids](#key-value-stores-and-data-grids). |
| Indexes | Extra structures that let a read find rows without a full scan: B-trees, LSM trees, hash indexes, and secondary indexes. See [indexes](#indexes). | A query filters or sorts by something other than the primary key. | Every index slows writes and takes storage. In a partitioned store, a secondary index is either local or global, with different costs. |
| Search index | An inverted index kept as a derived view of the system of record. See [search index](#search-index). | Full-text, fuzzy, faceted, or relevance-ranked queries that the primary store cannot serve. | The index lags the source; another cluster to run; reindexing when the mapping changes. |
| Unique ID generation | Generate identifiers without a single coordination point: Snowflake-style IDs (timestamp, worker, sequence), UUIDs, or pre-allocated ranges. | IDs must be unique across many writers, sometimes roughly time-ordered. | Clock dependence and ordering; ID size; range allocation needs coordination. See [Snowflake ID sources]({{< ref "system-design/projects/infra/snowflake-id" >}}). |
| Rate limiting | Bound request rates per client or tier: token bucket, leaky bucket, fixed or sliding window counters. | Protect capacity and share it fairly. | With several enforcing nodes, they must share the count; see [rate limiting across nodes](#rate-limiting-across-nodes). See the [rate limiter]({{< ref "system-design/projects/rate-limiter" >}}). |
| Scatter-gather | Send the request to every relevant partition in parallel and merge the results. | The answer needs data from all partitions: a search, a top-k, or a query by a value that is not the partition key. | The response waits for the slowest partition, so tail latency grows with the number of partitions. See [scatter-gather and tail latency](#scatter-gather-and-tail-latency). |
| Batch processing (MapReduce, dataflow) | Map over every partition, shuffle the output by key, and reduce each group, off the request path. Spark and other dataflow engines generalize the model. | Derived datasets, analytics, index builds, and backfills over the whole dataset. | Results are minutes to hours old. Because the input is immutable, a job can be rerun after a bug fix, which makes batch the safe way to rebuild derived data. The streaming counterpart is in [stream processing]({{< ref "engineering/topics/stream-processing" >}}). |
| Coordination service | A small replicated store built on consensus, such as etcd or ZooKeeper, offering leases, locks, membership, and configuration. See [coordination](#coordination). | Leader election, membership, or a lock that must hold across nodes. | Another critical dependency; every write waits for a majority. Avoiding coordination is usually better. |

Partitioning and replication answer different questions and are usually combined: partitioning spreads the load, and replication keeps each partition available.

For splitting read and write models, see [CQRS]({{< ref "system-design/elements/data-across-services" >}}#queries-that-need-several-services). It applies within one service as well as across services.

## Indexes


**Storage engines:**

| Structure | How it works | Good at | Costs |
| --- | --- | --- | --- |
| B-tree | Fixed-size pages in a sorted tree, updated in place. A write-ahead log makes updates crash-safe. The default in relational databases. | Point lookups and range scans with predictable read latency. | Random writes; page splits; rewriting a whole page for a small change. |
| LSM tree | Writes go to a sorted in-memory table and a log, are flushed as immutable sorted files, and are merged by background compaction. Used by Cassandra, RocksDB, and many key-value stores. | High write throughput; good compression. | A read may check several files, which Bloom filters reduce; compaction competes with foreground work for disk. |
| Hash index | An in-memory hash map from each key to its position in a file. | Point lookups. | No range queries; the keys must fit in memory. |

**Secondary indexes in a partitioned store:**

- **Local index**, partitioned by document: each partition indexes only its own rows. A write stays on one partition, but a query by the indexed value must go to every partition, which is [scatter-gather](#scatter-gather-and-tail-latency).
- **Global index**, partitioned by the indexed value: a query reads one index partition, but a write may touch several. The index is usually updated asynchronously, so reads can be stale. DynamoDB's global secondary indexes behave this way; see the [DynamoDB notes]({{< ref "engineering/topics/dynamodb" >}}).

Choose indexes from the access patterns recorded with the requirements. Each one is paid for on every write. The [database notes]({{< ref "engineering/data/databases" >}}#indexing) show how an index reduces disk reads.

## Search index


An inverted index maps each term to a posting list: the documents that contain the term, often with positions. Treat it as a derived view, not as the system of record.

- **Feeding it:** publish changes from the owning service through the [outbox or change data capture]({{< ref "system-design/elements/data-across-services" >}}#publishing-changes-reliably), and apply them idempotently. The index is then a read model in the sense of [CQRS]({{< ref "system-design/elements/data-across-services" >}}#queries-that-need-several-services).
- **Partitioning by document:** each shard holds a complete index for a subset of the documents. A write touches one shard. Every query goes to all shards, and the top results from each are merged. Elasticsearch and most search engines work this way.
- **Partitioning by term:** each shard holds the posting lists for some terms. A one-term query reads one shard, but multi-term queries and document writes span shards, so it is rare in practice.
- **Ranking:** BM25 scores keyword matches. Dense retrieval over embeddings and hybrid search are in the RAG definitions.
- **Costs:** the index lags the source by the propagation delay. A change to the mapping needs a full reindex, usually into a new index followed by an alias switch. Replicas add read throughput, but the cluster is one more system to operate.

## Scatter-gather and tail latency


When a request fans out to N partitions, its latency is the latency of the slowest one. If one call in a hundred to a single server is slow, a request that calls 100 servers is slow about 63 percent of the time (1 − 0.99¹⁰⁰). Dean and Barroso describe the mitigations:

- **Hedged requests:** if a partition has not answered within, for example, its 95th-percentile latency, send the same request to another replica and use whichever answers first.
- **Partial results:** answer at a deadline with the partitions that replied, when the use case tolerates it, as search usually does.
- **Fewer partitions per query:** choose the partition key so the common queries hit one partition.

[Timeouts]({{< ref "system-design/elements/containing-failure" >}}) bound each partition's call; hedging and partial results decide what to do when they fire.

## Coordination


Coordination is slow and fails when nodes cannot reach each other, so the options come in order. The theory is in [time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}), [broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}), and [coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}).

1. **Avoid it.** Give each key one writer by partitioning, so no two nodes need to agree.
2. **Use a coordination service.** etcd and ZooKeeper provide leader election, membership, locks, and configuration on top of consensus. Kubernetes keeps its state in etcd; see the [control plane]({{< ref "system-design/elements/control-plane" >}}).
3. **Do not implement consensus yourself.**

**Mechanisms:**

- **Leases and fencing tokens:** a leader holds a lease that expires unless it is renewed. A process can pause, for garbage collection or a VM migration, past the end of its lease and still believe it is the leader. So each lease carries a fencing token, a number that increases with every grant, and the storage rejects writes that carry an older token.
- **Consensus (Raft, Paxos):** nodes agree on an ordered log; an entry is committed once a majority accepts it, so 2f + 1 nodes tolerate f failures. Every write waits for a majority, which is the latency cost in [CAP and PACELC]({{< ref "engineering/distributed-systems/guarantees" >}}#cap-and-pacelc).
- **Logical clocks:** a Lamport clock orders events consistently with causality, but cannot tell whether two events were concurrent. Version vectors can. Leaderless and multi-leader stores such as Dynamo use them to detect concurrent writes, then keep both versions for the application, or a CRDT, to merge.
- **Last-write-wins:** resolving conflicts by wall-clock timestamp silently drops one of two concurrent writes, and clock skew decides which one.

## Key-value stores and data grids


A key-value store is the storage choice for access by key. Its internals are a standard interview design, recorded in the [key-value store case]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design): consistent hashing, replication with quorums, hinted handoff, anti-entropy, gossip, and version vectors.

An in-memory data grid, such as Hazelcast, Apache Ignite, or Oracle Coherence, is a partitioned and replicated store held in memory that can also run computation next to the data. Unlike a cache, it may be the system of record. Losing a node then means rebalancing and possibly losing data, so replication and persistence settings matter. It fits low-latency state shared by many application instances, such as sessions or reference data, and costs memory and operational care.

## Rate limiting across nodes


One limiter keeps an exact count. When many nodes enforce one limit, they must share the count:

| Approach | Mechanism | Accuracy | Costs |
| --- | --- | --- | --- |
| Central store | Every check updates a counter in a shared store with an atomic operation, such as a Redis Lua script implementing a token bucket or sliding window. | Exact. | A network hop on every request; the store becomes a dependency on the request path. |
| Owner node | Hash the client key to the node that owns its count; other nodes forward checks to it. Gubernator works this way. | Exact. | A hop to the owner; one heavy client loads one node. |
| Local share | Each of N nodes enforces the limit divided by N on its own. | Right only when the load balancer spreads each client evenly. | No coordination; wrong after scaling events or with uneven traffic. |
| Local counts, synchronized | Nodes count locally and exchange counts every few hundred milliseconds. | Eventually exact; a client can exceed the limit briefly. | Bursts over the limit; more moving parts. |

**Two further decisions:**

- **When the store is down:** fail open and allow traffic, risking overload, or fail closed and reject it, causing an outage. Failing open with a local fallback limit is the common choice when the limiter protects a shared backend.
- **Tiers and several limits:** key each limit by tenant and tier, read the limits from configuration rather than code, and apply several at once, such as a per-second burst limit and a daily quota. Reject with a 429 response and a `Retry-After` header so clients can back off.

## Leads to


- Every copy creates a consistency question: [consistency]({{< ref "system-design/nfr/consistency" >}}).
- Propagating changes to caches, replicas, and search indexes reliably leads to the [outbox and change data capture]({{< ref "system-design/elements/data-across-services" >}}#publishing-changes-reliably).
- Stateless instances behind a [load balancer]({{< ref "system-design/elements/request-path" >}}#load-balancer) move state into these stores.
- Failover of a primary leads to [reliability and availability]({{< ref "system-design/nfr/reliability-availability" >}}).
- Scatter-gather leads to [timeouts and degraded results]({{< ref "system-design/elements/containing-failure" >}}).
- A coordination service is the state store of a [control plane]({{< ref "system-design/elements/control-plane" >}}).

## Seen in cases


- [URL shortener]({{< ref "system-design/projects/url-shortener" >}}): key generation, caching of redirects, replication, and failover with possible loss of recent writes.
- [Key-value store]({{< ref "system-design/projects/key-value-store" >}}): cache write policies and a Dynamo-style design.
- [Dropbox]({{< ref "system-design/projects/dropbox" >}}): large objects, metadata, and synchronization.
- [Ticketmaster]({{< ref "system-design/projects/ticketmaster" >}}): event search served from Elasticsearch, kept in sync with PostgreSQL through change data capture.
- [Job scheduler]({{< ref "system-design/projects/job-scheduler" >}}): due jobs claimed with leases, and a single active scheduler.
- [Rate limiter]({{< ref "system-design/projects/rate-limiter" >}}) and [Snowflake IDs]({{< ref "system-design/projects/infra/snowflake-id" >}}): focused applications.

## Gaps


- Object storage: chunking, metadata, and durability through replication or erasure coding (Xu and Lam 2022, chapter 9).
- Approximate structures beyond HyperLogLog: Bloom filters and count-min sketches.
- Vector indexes, such as HNSW, as a storage choice; the RAG notes use them without a design discussion.
- No case yet designs a search index end to end or uses a coordination service explicitly.

## Sources


- [Data partitioning](https://docs.microsoft.com/en-us/azure/architecture/best-practices/data-partitioning) and the [sharding pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/sharding) -- Microsoft.
- [Designing Data-Intensive Applications, second edition](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/): storage and indexes, replication, sharding, transactions, distributed-systems faults, consistency and consensus, and batch processing.
- Xu 2020: chapters on scaling from one server, consistent hashing, a key-value store, a unique ID generator, a rate limiter, and a URL shortener.
- Dean and Barroso, *The Tail at Scale*, Communications of the ACM, 2013 ([doi:10.1145/2408776.2408794](https://doi.org/10.1145/2408776.2408794)).
- [How to do distributed locking -- Martin Kleppmann](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html): leases and fencing tokens.
- [Gubernator: distributed rate limiting -- Mailgun](https://www.mailgun.com/blog/it-and-engineering/gubernator-cloud-native-distributed-rate-limiting-microservices/).
- [Distributed-systems notes]({{< ref "engineering/distributed-systems" >}}) for coordination and theory, with a [reading list]({{< ref "engineering/distributed-systems/reading" >}}).

## Library sources


- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 4 on *Indexes* and *Search index*; chapter 7 on hot spots and secondary indexes; chapters 9 and 10 on *Coordination*; chapter 11 on batch processing
- [Xu 2020](/sources/system-design/interviews/xu-2020-system-design-interview-an-insiders-guide.pdf.enc), *System Design Interview: An Insider's Guide* -- chapters 1 and 4-8
- [DeCandia et al. 2007](/sources/system-design/data-systems/decandia-2007-dynamo-amazons-key-value-store.pdf.enc), *Dynamo: Amazon's Highly Available Key-value Store*
- [Petrov 2019](/sources/system-design/data-systems/petrov-2019-database-internals.pdf.enc), *Database Internals* -- part I (chapters 2-7) on B-trees and log-structured storage; chapters 10 and 14 on leader election and consensus
- Educative 2023: sharded counters, distributed search, and rate limiter, *Grokking Modern System Design Interview*
- [Manning et al. 2008](/sources/retrieval-and-knowledge/information-retrieval/manning-2008-introduction-to-information-retrieval.pdf.enc), *Introduction to Information Retrieval* -- chapters 1 and 4 on the inverted index and its construction; chapter 20 on partitioning an index by term or by document

Further reading:

- [Gorton 2022](/sources/software-engineering/systems-and-operations/gorton-2022-foundations-of-scalable-systems.pdf.enc), *Foundations of Scalable Systems: Designing Distributed Architectures*
