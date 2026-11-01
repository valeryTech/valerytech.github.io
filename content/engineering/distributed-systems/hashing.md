---
draft: false
toc: true
title: "Consistent and Rendezvous Hashing"
description: "Why hash mod N remaps almost every key, consistent hashing on a ring with virtual nodes and replication, rendezvous hashing and its weighting, a comparison of key movement and lookup cost, and how DDIA 2e uses the term consistent hashing."
document_status: "draft"
linkTitle: "Hashing"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** how do you map keys to a changing set of nodes so that adding or removing a node moves only a few keys?

A sharded store, a cache cluster, or a load balancer with sticky sessions needs a function that every client can compute to answer "which node owns this key". The function must spread keys evenly and, when the node set changes, move only about K/N of K keys over N nodes (Vitillo, Petrov). Consistent hashing and rendezvous hashing both meet that target, and both keep most existing key-to-node mappings, such as client-to-server assignments, stable across a change. Both also need a hash function that gives the same output in every process: DDIA 2e notes that Java's `Object.hashCode()` and Ruby's `Object#hash` can differ between processes, which rules them out.

## Why hash mod N fails


The obvious mapping is `node = hash(key) mod N`. It is cheap and even, but the result depends on N. Going from N to N+1 nodes, a key stays put only when `hash mod N` equals `hash mod (N+1)`, which holds for about 1/(N+1) of keys; nearly all the rest move. Tornow measured this directly: going from 5 to 6 partitions moved 83.3% of items. In a cache, those moved keys are misses, so a resize causes a storm of misses (Xu); Burns notes that in the worst case changing `hash % 10` to `hash % 11` is equivalent to losing the whole cache. The ideal is the reverse: only the 1/(N+1) share the new node should own moves.

## Consistent hashing


Karger et al. (1997) introduced consistent hashing for distributed web caching; Dynamo, DDIA 2e, Petrov, Vitillo, and Xu all trace the ring scheme to that paper.

- **The ring:** the output range of the hash function is treated as a circle, so the largest value wraps to the smallest (Dynamo hashes keys with MD5 to a 128-bit position). Each node is hashed (by name, address, or a random token) to a position on the ring. Each key is hashed onto the same ring and belongs to the first node clockwise from it, so a node owns the arc between its predecessor and itself.
- **Join and leave:** a joining node takes the part of its successor's arc that now precedes it; a leaving node's arc passes to its successor. Only the neighbors of the change are affected (Dynamo, Petrov).
- **Lookup:** keep node positions sorted and binary-search for the first position at or after the key's hash, so lookup is logarithmic in the number of positions (the akshatm post implements this with a search tree or a sorted list).

### Virtual nodes


With one position per node, the basic ring has three problems (Xu, Dynamo). Random positions give arcs of unequal size, so data and load are uneven, and removing a node can double its successor's arc. A failed node's entire load lands on a single neighbor. And the ring ignores differences in node capacity. The fix is to give each physical node many positions, called virtual nodes or tokens. Dynamo lists the effects: when a node fails, its load spreads evenly across the remaining nodes; a new node takes a roughly equal share from each existing node; and a more powerful node can take more virtual nodes. Xu cites an experiment in which the standard deviation of load was about 10% of the mean with 100 virtual nodes per server and about 5% with 200. The cost is metadata: whoever routes requests keeps the full list of positions, and in Dynamo's first scheme that list grew linearly with cluster size. The Educative lesson places virtual nodes by applying several hash functions to a node's ID.

### Replication along the ring


Dynamo stores each key on its owner (the coordinator) and on the next N-1 nodes clockwise, so each node holds the arc between its Nth predecessor and itself. The nodes responsible for a key form its preference list, which holds more than N nodes so that writes can fall through to later entries when earlier ones are down. With virtual nodes, the next N positions may belong to fewer than N machines, so the preference list skips positions whose physical node is already on it (Dynamo, Xu, Educative). Xu adds placing replicas in different data centers. What those replicas do with reads and writes (quorums, hinted handoff) is in [replication]({{< ref "engineering/distributed-systems/replication" >}}).

### Dynamo's move to fixed partitions


Dynamo's first scheme (random tokens per node, each range between tokens a partition) tied partitioning to placement. A joining node had to "steal" ranges, so existing nodes scanned their local stores to find the keys to hand over; at peak season bootstrapping took almost a day. Every membership change also changed many ranges, forcing Merkle-tree recalculation, and random ranges made archiving the key space awkward. Dynamo moved to a scheme that splits the hash space into Q equal, fixed partitions and gives each of S nodes Q/S of them. Partitions then move as whole files, load balance was the best of the three strategies measured, and the membership data each node gossips shrank by three orders of magnitude. The cost is that membership changes need coordination to keep the assignment balanced.

## Rendezvous hashing


Rendezvous hashing, also called highest random weight hashing, comes from Thaler and Ravishankar (the journal paper DDIA cites is from 1998; the randorithms post dates a technical report to 1996). Each key scores every node with `hash(key, node)` and goes to the node with the highest score. The ranking is pseudo-random per key, and every client computes the same ranking from the node list alone.

- **Removing a node:** only the keys that ranked it first move, each to its own second choice. Second choices differ by key, so the load spreads over all remaining nodes instead of landing on one neighbor, with no virtual nodes needed.
- **Adding a node:** the new node scores highest for about 1/(N+1) of keys, taken from every existing node. The randorithms post points out that a store must migrate those keys or lookups fail, while a cache can tolerate the change: a miss refills from the origin, and stale copies on the old nodes age out under LRU.
- **Replication:** the top k nodes of a key's ranking are k distinct nodes, which gives replica placement directly.
- **Weighting:** to give node i a share proportional to weight w_i, rank by `-w_i / ln(h_i(x))`, where h_i(x) is the key's hash for that node normalized to (0, 1). The randorithms post attributes this form to Jason Resch's 2015 SDC slides.
- **Cost:** a lookup computes N hashes, so it is O(N) per key, against O(log N) for a ring. The only state is the node list. The randorithms post recommends it for small and medium node sets.

## Comparison


| Approach | Keys moved on a change | Lookup cost | Load balance | Notes |
| --- | --- | --- | --- | --- |
| Hash mod N | Nearly all, about N/(N+1) | O(1) | Even | Only for a node count that never changes |
| Fixed partitions (`hash mod Q`, plus a partition-to-node map) | Whole partitions, about 1/(N+1) of the data | O(1) plus a map lookup | Even when Q is much larger than N; weight by giving a node more partitions | Q caps the node count; changing Q means resharding |
| Ring, one position per node | The arc next to the change, about K/N on average but uneven | O(log N) | Uneven arcs | A failed node's load goes to one successor |
| Ring with V virtual nodes per node | About K/N, exchanged with many nodes | O(log NV) | Near even as V grows; weight by virtual node count | Metadata grows with N times V |
| Rendezvous | Only the changed node's share, about K/N, spread over all nodes | O(N) | Even; weighted by the score formula | No ring to maintain; top k gives replicas |
| Jump consistent hash (Lamping and Veach 2014) | About K/N | O(log N), no stored state | Even | Buckets are numbered 0 to N-1, so nodes can only be added or removed at the end; suits shards more than failing nodes |

## What DDIA 2e says


Chapter 7 (Sharding) treats these as options under sharding by hash of key, and its stance differs from the first edition, which advised dropping the term in favor of "hash partitioning". It rejects hash mod N because changing N moves most keys, which makes rebalancing very inefficient.

- **Fixed number of shards:** create many more shards than nodes (the example is 1,000 shards on 10 nodes), map a key to shard `hash(key) % 1,000`, and track separately which node holds which shard. Adding a node moves whole shards to it; the key-to-shard mapping never changes. Citus, Riak, Elasticsearch, and Couchbase work this way. The limits: no more nodes than shards, an expensive resharding if the count was wrong, and shard size that grows with the dataset.
- **Hash-range sharding:** each shard owns a contiguous range of hash values and splits when it grows too large (YugabyteDB, DynamoDB). Cassandra and ScyllaDB use a variant: the hash range is cut into a number of ranges proportional to the node count (16 per node by default in Cassandra, 256 in ScyllaDB) with random boundaries, and a joining node takes parts of existing ranges.
- **The term:** DDIA 2e defines a consistent hashing algorithm by two properties: each shard gets roughly the same number of keys, and a change in the number of shards moves as few keys as possible. "Consistent" here has nothing to do with replica consistency or ACID consistency; chapter 8 lists it among at least five meanings of the word. Cassandra's scheme is close to the original definition, while rendezvous and jump consistent hashing are other algorithms with the same properties. The difference: the ring variant gives a new node pieces of a few existing ranges, while rendezvous and jump hashing give it individual keys scattered across all nodes. DDIA says the better choice depends on the application.
- **Keys versus load:** even key distribution does not mean even load. A hot key, such as a celebrity's user ID, still overloads its node, and needs range-based isolation or key splitting; see [partitioning]({{< ref "engineering/distributed-systems/partitioning" >}}).

## In a design


- **Partitioned stores:** a Dynamo-style store uses a ring with virtual nodes and walks it for replicas, as in the [key-value store case]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design). Many databases instead keep a fixed set of partitions and a partition map; rebalancing and request routing for both are in [partitioning]({{< ref "engineering/distributed-systems/partitioning" >}}).
- **Caches:** clients hash keys to cache servers so that growing the pool keeps most keys on the same server and the hit ratio holds (Xu, Vitillo, Burns). NGINX exposes this as `hash $request_uri consistent` (Burns).
- **Load balancers:** hashing a session cookie or client address keeps a user on one backend across scaling events (Vitillo, Burns); see [load balancer]({{< ref "system-design/elements/request-path" >}}#load-balancer).
- **Choosing:** rendezvous fits small node sets, weighted nodes, and cases where a failed node's keys must spread evenly; a ring with virtual nodes fits large, changing node sets; fixed partitions fit when a coordination service can hold the map. The [options table]({{< ref "system-design/elements/data-at-scale" >}}#options) lists consistent or rendezvous hashing as the option for caches and stores whose node set changes.

## Related notes


- [Partitioning]({{< ref "engineering/distributed-systems/partitioning" >}}): rebalancing, skew and hot keys, request routing.
- [Replication]({{< ref "engineering/distributed-systems/replication" >}}): what the replicas on a preference list do, including quorums and hinted handoff.
- [Consistency models]({{< ref "engineering/distributed-systems/guarantees" >}}#consistency-models): the unrelated meaning of "consistent".
- [Data at scale]({{< ref "system-design/elements/data-at-scale" >}}#options): the consistent hashing row in the options table, and the hub for the [key-value store case]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design).

## Gaps


- Bounded-load consistent hashing, Maglev hashing, and multi-probe consistent hashing are not covered; DDIA 2e cites Gryski's survey of the trade-offs among these algorithms.
- Hierarchical rendezvous hashing, which cuts the O(N) lookup for large node sets, is not covered, nor are measurements of virtual node count against balance beyond the figures Xu cites.

## Sources


- <https://randorithms.com/2020/12/26/rendezvous-hashing.html>: rendezvous hashing as a per-key ranking of servers, the weighting formula, failover, and why node additions suit caches better than stores.
- <https://akshatm.svbtle.com/consistent-hash-rings-theory-and-implementation>: the ring with a Python implementation over sorted positions.
- interviewing.io: noted as additional reading on consistent hashing; no specific page recorded.
- Karger, Lehman, Leighton, Panigrahy, Levine, and Lewin 1997, *Consistent Hashing and Random Trees: Distributed Caching Protocols for Relieving Hot Spots on the World Wide Web*, STOC ([doi:10.1145/258533.258660](https://doi.org/10.1145/258533.258660)).
- Thaler and Ravishankar 1998, *Using Name-Based Mappings to Increase Hit Rates*, IEEE/ACM Transactions on Networking ([doi:10.1109/90.663936](https://doi.org/10.1109/90.663936)).
- Lamping and Veach 2014, *A Fast, Minimal Memory, Consistent Hash Algorithm* ([arXiv:1406.2294](https://arxiv.org/abs/1406.2294)).

## Library sources


- [DeCandia et al. 2007](/sources/software-engineering/databases/decandia-2007-dynamo-amazons-key-value-store.pdf.enc), *Dynamo: Amazon's Highly Available Key-value Store* -- sections 4.2, 4.3, and 6.2 on *Virtual nodes*, *Replication along the ring*, and *Dynamo's move to fixed partitions*
- [Xu 2020](/sources/system-design/interviews/xu-2020-system-design-interview-an-insiders-guide.pdf.enc), *System Design Interview: An Insider's Guide* -- chapter 5 on *Why hash mod N fails* and *Virtual nodes*; chapter 6 on *Replication along the ring*
- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 7 on *What DDIA 2e says*
- [Petrov 2019](/sources/system-design/data-systems/petrov-2019-database-internals.pdf.enc), *Database Internals* -- chapter 13, sections "Database Partitioning" and "Consistent Hashing", on *Consistent hashing*
- [Vitillo 2021](/sources/system-design/distributed-systems/vitillo-2021-understanding-distributed-systems.pdf.enc), *Understanding Distributed Systems* -- chapter 16 on *Why hash mod N fails* and *Consistent hashing*; chapters 18 and 20 on load balancers and external caches in *In a design*
- Educative 2023: ensure scalability and replication, *Grokking Modern System Design Interview* -- mod N, the ring, virtual nodes, and preference lists in a key-value store

Further reading:

- [Tornow 2025](/sources/system-design/distributed-systems/tornow-2025-think-distributed-systems.pdf.enc), *Think Distributed Systems* -- chapter 7, a measured comparison of mod N and consistent hashing, and overpartitioning
- [Burns 2018](/sources/system-design/distributed-systems/burns-2018-designing-distributed-systems.pdf.enc), *Designing Distributed Systems* -- chapter 5 on session tracking by consistent hashing; chapter 6 on resharding a cache and an NGINX consistent hashing proxy
