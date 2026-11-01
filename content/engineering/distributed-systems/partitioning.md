---
draft: false
toc: true
title: "Partitioning (Sharding)"
description: "How data is split across machines and found again: key-range, hash and compound partition keys, skew and hot keys, local and global secondary indexes, rebalancing, request routing, sharding for multitenancy and cells, and cross-partition queries."
document_status: "draft"
linkTitle: "Partitioning"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** how is data split across machines, and how do requests find the right one as the data and the cluster change?

When the data or the write load outgrows one machine, the dataset is split into partitions, each record belonging to exactly one, and the partitions are spread over nodes. Every scheme then answers three questions: which partition holds a key, which node holds that partition, and how a request finds the node while both answers change. The partition key decides most of the cost: which queries stay on one partition, where hot spots form, and how much data moves when the cluster grows.

## Why partition


- **Data volume and write throughput:** sharding spreads data and writes over many nodes, and is the main tool for scaling out instead of up. If only read throughput is the problem, read replicas are enough (DDIA).
- **Its costs:** DDIA calls sharding a heavyweight solution and advises staying on a single shard while one machine copes. A partition key has to be chosen and is hard to change later; a lookup by anything else searches every shard; joins cross shards; and a write to related records in several shards needs a distributed transaction. Vitillo adds the router every request passes through, aggregations that pull data from many partitions, and the data moved when partitions are added or removed.
- **Any single-resource limit:** Tornow points out that partitioning lifts more than a storage limit. Data volume is an intrinsic limit and request volume an extrinsic one. Redis, VoltDB, and FoundationDB shard even inside one machine, running one single-threaded process per CPU core (DDIA).

Davoudian et al. list what a good partitioner achieves: few multi-partition requests, storage and processing load spread in proportion to node capacity, little data moved when nodes join or leave, and a partition-to-node mapping that is cheap to store and look up. Tornow scores an assignment function on two of these: variance (how evenly items spread) and relocation (how many items move when the partition count changes).

## Terms


The unit has many names (DDIA): a partition in Kafka, a range in CockroachDB, a region in HBase and TiDB, a vBucket in Couchbase, a vnode in Riak, a token range in Cassandra, and a tablet in Bigtable, YugabyteDB, and ScyllaDB. PostgreSQL separates the words: partitioning splits a table into files on one machine, sharding splits a dataset across machines. Elsewhere the two are synonyms. Neither has anything to do with network partitions.

- **Horizontal and vertical:** horizontal partitioning, or sharding, splits by rows. Vertical partitioning splits by columns, such as profile text into a relational database and profile pictures into file storage, and the two combine (Tornow; Davoudian et al.). This note is about horizontal partitioning.
- **Two mappings:** Tornow separates assigning items to partitions (partitioning) from assigning partitions to nodes (balancing). Rebalancing changes the second mapping and moves whole partitions; repartitioning changes the first, as when the number of partitions changes.
- **Item-based or directory-based:** an item-based assignment computes the partition from the key alone, by range or hash, and needs no state. A directory-based assignment looks the key up in a table. It can place any item anywhere, including a hot item on its own, but the directory is stateful and can become the bottleneck that partitioning was meant to remove (Tornow). A range scheme usually needs a directory of boundaries, which adds a lookup to the data path (Davoudian et al.).
- **With replication:** each record belongs to one shard, and each shard is copied to several nodes. Under single-leader replication each node leads some shards and follows for others, and each shard has one leader (DDIA). A leader per shard also removes the single system-wide leader as a bottleneck: Spanner runs a Paxos group per shard (Petrov), and DynamoDB a Multi-Paxos replication group per partition, spread across availability zones (Elhemali et al. 2022). The sharding scheme is mostly independent of the replication scheme; see [replication]({{< ref "engineering/distributed-systems/replication" >}}) and [one log per shard]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#state-machine-replication).

## Choosing a partition key


The partition key is the input to the assignment: in a key-value store the key or its first part, in a relational table a column that need not be the primary key (DDIA). It needs many distinct values; a boolean key allows at most two partitions (Vitillo). Burns adds that it should contain exactly what determines the answer. A key that is too general groups requests that need different results; one that is too specific separates requests that could share one. His cache example keys on the request path plus the client's country, not the client's IP address.

| Scheme | How a key maps | Good at | Costs | Used by (DDIA) |
| --- | --- | --- | --- | --- |
| Key range | Each partition owns a contiguous range of keys, sorted within the partition | Range scans; fetching related records in one query on a concatenated key | Boundaries must follow the data, not the alphabet; writes to nearby keys, such as timestamps, all land on one partition | Bigtable, HBase, CockroachDB, FoundationDB, MongoDB's range option; Vitess, with boundaries set by hand |
| Hash of key | Hash the key, then assign ranges of hash values, or a hash modulo a fixed partition count, to partitions | Even spread even when the keys are skewed | A range query on the key goes to every partition; a hot key stays hot | DynamoDB and YugabyteDB (hash ranges); Citus, Riak, Elasticsearch, Couchbase (fixed count) |
| Compound key | Hash the first part to pick the partition, sort by the remaining parts inside it | Range scans within one partition key, such as one user's events by time | Scans across partition keys still fan out; one partition key can grow too large | Cassandra (partition key plus clustering columns); DynamoDB (partition key plus sort key) |

The hash function need not be cryptographic: MongoDB uses MD5, Cassandra and ScyllaDB use Murmur3. It must return the same value in every process, which rules out Java's `Object.hashCode()` and Ruby's `Object#hash` (DDIA). How hash values map onto nodes, and why `hash mod N` over the nodes fails, is in [hashing]({{< ref "engineering/distributed-systems/hashing" >}}#why-hash-mod-n-fails).

DDIA's sensor database shows the range-key trade. With the timestamp as key, all current writes go to this month's partition. Prefixing the sensor ID spreads the writes, but a query over many sensors in a time range becomes one range query per sensor. Data warehouses use the compound form under other names: BigQuery has a partition key plus cluster columns that sort records within a partition, and Snowflake and Delta Lake have cluster keys (DDIA). A compound key can also make partitions too large. Cassandra's hard limit is two billion values (cells) per partition, and Carpenter and Hewitt recommend at most 100,000. They break a large partition by moving another column into the partition key, or by bucketing, such as adding a month to a hotel-and-date key. Each extra key part shrinks partitions and adds partitions to a query that spans several days.

### Cassandra's partitioner and token ring


- **Tokens:** the partitioner is a hash function that turns the partition key into a token. The default Murmur3Partitioner produces 64-bit tokens from -2^63 to 2^63-1. Clustering columns only order the rows inside a partition (Carpenter and Hewitt).
- **The ring:** a node owns the range above the previous node's token up to and including its own; the node with the lowest token also owns the wrapping range above the highest. Consecutive ranges can be spread over different racks.
- **Virtual nodes:** since Cassandra 1.2, each node holds many tokens instead of one. A joining node then takes small pieces of many ranges, bootstrapping, decommissioning, and repair spread their load over the cluster, and a more powerful machine can take more tokens through `num_tokens`. The historical default was 256 tokens per node; experienced operators recommend 16 or 8, which need less bandwidth to coordinate changes (Carpenter and Hewitt). DDIA gives 16 per node as Cassandra's default and 256 for ScyllaDB. Random boundaries make ranges unequal, and many ranges per node even that out (DDIA); see [virtual nodes]({{< ref "engineering/distributed-systems/hashing" >}}#virtual-nodes).
- **Order-preserving partitioners:** OrderPreservingPartitioner and ByteOrderedPartitioner keep keys sorted for range slices. Carpenter and Hewitt find them no faster for range queries than hashing and prone to hot spots that need manual `nodetool move` rebalancing. The partitioner cannot be changed once data is loaded; the recommended path is migrating to a new cluster.

## Skew and hot spots


Sharding is skewed when some partitions hold more data or receive more requests than others. A partition with disproportionate load is a hot spot, and a single key with disproportionate load is a hot key (DDIA). An even spread of keys does not give an even spread of load:

- **Celebrity keys:** a post by a user with millions of followers sends a storm of reads and writes to one key, such as that user's ID (DDIA). Partitioning by user balances the average user and skews for celebrities and influencers (Tornow).
- **Time-based and sequential keys:** with a date or timestamp key, every partition holds the same amount of data but all current writes go to one (Tornow; Vitillo). DynamoDB found that splitting does not help a partition whose key range is accessed sequentially (Elhemali et al. 2022).
- **Uneven key density:** zip codes cluster where people live, so some ranges hold much more data (Petrov). In Tornow's experiment, five first-letter ranges over an English word list left the largest partition with almost three times the words of the smallest.
- **Load that moves:** a viral post is hot for a couple of days, then cools; some keys are hot for writes and others for reads, and each needs a different remedy (DDIA).

| Remedy | Helps with | Cost |
| --- | --- | --- |
| Change the key, such as prefixing the timestamp with a sensor ID, or hash instead of range | Write hot spots from sequential keys | Range queries across the new prefix fan out |
| Isolate the hot key in its own partition, perhaps on a dedicated machine | One known hot key | Needs range boundaries or a directory that can place a single key (DDIA; Tornow). The AWS cell paper recommends an override table that pins particular keys to particular cells. |
| Split the key with a random suffix, so writes spread over N sub-keys | One key with more writes than a partition absorbs | Reads must combine all sub-keys, and read load is not reduced; the system must track which keys are split and convert keys on demand (DDIA). The counter version is [hot-key splitting]({{< ref "system-design/elements/data-at-scale" >}}#options). |
| Replicate the hot partition | Read hot spots | A replicated, sharded service adds replicas to the hot shard and packs cold shards together on fewer machines (Burns) |
| Automatic heat management | Load that shifts over time | DynamoDB splits a partition for consumption once its throughput passes a threshold, at a split point taken from the observed key distribution, within minutes. It detects traffic to a single item and sequential access, where a split cannot help (Elhemali et al. 2022). |

## Secondary indexes


Partitioning by key works when the client knows the key. A secondary index finds records by value instead (all red cars, all actions by user 123), and it does not map neatly onto partitions. DDIA describes two layouts, with names from information retrieval:

| | Local index (document-partitioned) | Global index (term-partitioned) |
| --- | --- | --- |
| Layout | Each partition indexes only its own records | One index over all records, itself partitioned by the indexed value (the term), by range or by hash |
| Write | Touches only the record's partition | Can also touch several index partitions, one for each indexed value |
| Read by value | Every partition, unless the partition key is known; any single partition if some results are enough | One index partition for the list of matching IDs (the postings list), then the partitions that hold those records |
| Several conditions | Each partition combines the index entries for its own records | The postings lists sit on different index partitions and must be intersected over the network, which is slow when they are long |
| Freshness | Updated with the record | Kept in step by a distributed transaction, or updated asynchronously; DynamoDB's global indexes can return stale reads |
| Used by | MongoDB, Riak, Cassandra, Elasticsearch, SolrCloud, VoltDB | CockroachDB, TiDB, YugabyteDB; DynamoDB offers both |

A query on a local index fans out to every partition, so it suffers tail-latency amplification, and adding partitions adds storage but not query throughput, since every partition processes every query (DDIA). A global index pays on writes instead, and suits workloads where reads outnumber writes and postings lists are short.

- **In Cassandra:** each node indexes only the partitions it owns, so an index query usually involves many nodes. Carpenter and Hewitt advise against indexing columns of very high cardinality (most nodes get queried), very low cardinality (one huge index row), or frequent updates and deletes (tombstones pile up faster than compaction clears them). They prefer denormalized tables or materialized views. A view is a second table partitioned by the indexed column, which Cassandra keeps in step with the base table at the cost of extra reads on base-table writes; in effect, a global index maintained by the database.
- **Built by the application:** a key-value store without indexes tempts the application to maintain a value-to-ID mapping itself. Races and partial write failures then let the index drift from the data unless both writes share a transaction (DDIA).
- **Search:** document and term partitioning for full-text search are in [search index]({{< ref "system-design/elements/data-at-scale" >}}#search-index); the short version of this section is at [indexes]({{< ref "system-design/elements/data-at-scale" >}}#indexes).

## Rebalancing


Rebalancing moves partitions, and the requests for them, from one node to another. It is needed when throughput grows (more CPUs), the dataset grows (more disks and memory), or a machine fails and others take over its work. Whatever the scheme, it should leave load shared fairly, keep accepting reads and writes while it runs, and move no more data than necessary, to limit network and disk I/O (DDIA first edition; Vitillo).

The naive mapping, `hash(key) mod N` over N nodes, fails the last requirement: changing N moves most keys. Tornow measured 83 percent of words moving when five partitions became six, against an ideal of about one sixth; see [why hash mod N fails]({{< ref "engineering/distributed-systems/hashing" >}}#why-hash-mod-n-fails). The workable strategies keep the key-to-partition mapping stable and move or split partitions:

| Strategy | Number of partitions | When a node joins | Limits | Used by (DDIA) |
| --- | --- | --- | --- | --- |
| Fixed number of partitions (static partitioning, overpartitioning) | Set at creation, many more than nodes, such as 1,000 on 10 nodes | It takes whole partitions from existing nodes; no key changes partition; reads and writes use the old assignment until a transfer finishes | No more nodes than partitions; partition size grows with the data, so a wrong count means an expensive resharding, in some systems only offline | Citus, Riak, Elasticsearch, Couchbase |
| Dynamic splitting and merging, by key range or hash range | Follows the data: a partition splits at a size (10 GB by default in HBase) or under sustained write load, and small neighbors merge | It receives some of the split partitions | A split rewrites the data, often on a partition that is already overloaded; an empty store starts with one partition unless pre-split (HBase, MongoDB) | Bigtable, HBase, CockroachDB, FoundationDB (key range); DynamoDB, YugabyteDB (hash range) |
| Partitions proportional to nodes | A fixed number of ranges per node, with random boundaries | It splits some existing ranges and takes parts of them, about a fair share | Ranges differ in size until there are many per node; each range adds metadata to coordinate | Cassandra, ScyllaDB |

- **Sizing a fixed count:** choose a number divisible by many factors so the data divides evenly over many cluster sizes, and give more partitions to more powerful nodes (DDIA). Tornow's overpartitioning makes the same point: with one partition per node there is no room to adapt, while with more partitions than nodes the cluster can add or remove nodes, up to one node per partition. The AWS cell paper uses the two-step form for cells: tens of thousands of logical buckets by modulo, then a bucket-to-cell table. In Tornow's terms the scheme is static when changing the number of partitions is a planned administrative operation, and dynamic (elastic but complex) when it is a normal online one.
- **Hashing algorithms:** consistent hashing on a ring gives a new node pieces of a few existing ranges; rendezvous and jump hashing give it individual keys from every node. DDIA says the better choice depends on the application; see the [comparison]({{< ref "engineering/distributed-systems/hashing" >}}#comparison).
- **During a move:** Petrov's order is to relocate the data, then update the cluster metadata, then route requests to the new owner. The AWS cell paper names four phases for moving state between cells: clone it to the new location as a non-authoritative copy, make that copy authoritative, redirect from the old location to the new, and forget the old copy.

### Automatic versus manual rebalancing


Some systems decide splits and moves themselves, others leave them to an administrator. Couchbase and Riak sit between: they compute a suggested assignment that takes effect only when an administrator commits it (DDIA).

- **Automatic:** less routine work and the ability to autoscale; DynamoDB is promoted as adding and removing shards within minutes. Placement algorithms weigh read load, write load, and data size per shard (Petrov).
- **The risk:** rebalancing reroutes requests and moves a lot of data, so done carelessly it overloads the network and the nodes and slows other requests. A store near its maximum write throughput may not split fast enough to keep up with incoming writes (DDIA).
- **With automatic failure detection:** an overloaded node answers slowly, the other nodes declare it dead and take over its load, they become overloaded and are suspected in turn, and the result is a cascading failure (DDIA). A timeout cannot tell a slow node from a dead one; see [failure detection]({{< ref "engineering/distributed-systems/system-models" >}}#failure-detection).
- **A human in the loop:** slower but with fewer surprises, and the way to rebalance ahead of a known surge, such as holiday sales or ticket sales for a major sporting event (DDIA).

## Request routing


Routing finds the IP address and port of a node that can serve a given key. It resembles service discovery with one difference: any instance of a stateless service can take a request, but only a replica of the right shard can serve a key (DDIA). DDIA describes three approaches:

| Approach | Path | Who holds the assignment | Examples |
| --- | --- | --- | --- |
| Any node | The client reaches any node, for example through a round-robin load balancer; a node that does not own the key forwards the request and relays the reply | Every node | Cassandra, where the contacted node coordinates the query with the replicas (Carpenter and Hewitt); Riak |
| Routing tier | Every request goes to a shard-aware load balancer that holds no data and forwards it | The routers | MongoDB's mongos; DynamoDB's request routers (Elhemali et al. 2022); the gateway in front of Vitillo's partitioned application; a cell router |
| Partition-aware client | The client connects straight to the owning node | Every client | Cassandra's driver computes the token of a prepared statement's partition key and sends the query to a replica (Carpenter and Hewitt) |

Every approach leaves three problems (DDIA): deciding which shard lives on which node, in a way that survives the decider's failure without two coordinators making contradictory assignments (split brain); telling the routing component about changes; and handling requests still in flight to the old node during a cutover. The participants must agree, or requests reach nodes that cannot serve them. Routers learn assignments in one of three ways:

- **A coordination service:** many systems keep the authoritative map in ZooKeeper or etcd, which use consensus for fault tolerance and against split brain. Nodes register themselves, routers and clients subscribe, and the service notifies them when a shard changes owner or a node joins or leaves. HBase and SolrCloud use ZooKeeper, Kubernetes keeps in etcd which instance runs where, and MongoDB uses its own config servers with mongos as the routing tier. Kafka, which earlier used ZooKeeper (DDIA first edition), now runs a built-in Raft implementation for this job, as do YugabyteDB, TiDB, and ScyllaDB (DDIA). LinkedIn's Espresso used Helix, which itself relies on ZooKeeper, for cluster management behind a routing tier (DDIA first edition). See [coordination services in practice]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#coordination-services-in-practice).
- **Gossip:** Riak spreads changes in cluster state among its nodes by gossip (DDIA), and Cassandra's nodes gossip their state every second (Carpenter and Hewitt). Requests can go to any node and no external service is needed, at the price of more complexity in each node (DDIA first edition). Gossip is much weaker than consensus: different parts of the cluster can believe different nodes own the same shard. Leaderless stores tolerate that because their guarantees are weak anyway (DDIA). Davoudian et al. call Cassandra and Dynamo one-hop distributed hash tables, since every node holds enough state to route directly; multi-hop tables such as Chord keep state on O(log N) neighbors and take about O(log N) hops per lookup.
- **From the nodes:** Couchbase, which needs an administrator to rebalance, used a routing tier called moxi that learned routing changes from the cluster nodes (DDIA first edition).

**Stale maps:** a router acts on a cached copy of the assignment and must survive it being wrong.

- **DynamoDB:** request routers at first downloaded a table's whole partition map on first use and cached it. The hit rate was about 99.75 percent, but the behavior was bimodal: a router with an empty cache sends every request to the metadata service, so adding routers caused metadata traffic spikes, and an ineffective cache risked cascading failure. DynamoDB replaced it with MemDS, an in-memory replicated metadata store, and a router cache that refreshes asynchronously on every hit, so metadata load stays constant whatever the hit rate. Storage nodes stay authoritative: a node contacted through a stale map replies with the current membership or with an error that triggers a fresh lookup (Elhemali et al. 2022).
- **Cell routers:** in the AWS cell paper the control plane writes the mapping to object storage and each router holds it in memory, so routing continues when the control plane or the store is down. The control plane prefers failing to giving wrong answers, while the data plane stays available on possibly stale state; see [control plane]({{< ref "system-design/elements/control-plane" >}}).

Clients still need the addresses of the routers or nodes. These change far less often than shard assignments, so DNS is usually enough (DDIA). Analytical databases route differently: one query reads many shards in parallel and combines the results (DDIA); see [distributed computation]({{< ref "engineering/distributed-systems/distributed-computation" >}}#splitting-the-work).

## Multitenancy and cells


A multitenant service can shard by tenant: one tenant per shard, or several small tenants grouped into one, as separate databases or separately managed parts of one (DDIA). DDIA lists the benefits:

- **Resource isolation:** an expensive operation by one tenant is less likely to slow tenants on other shards, the noisy-neighbor problem.
- **Permission isolation:** a bug in access control is less likely to expose one tenant's data to another when the data is physically separate.
- **Per-tenant operations:** back up and restore one tenant; export or delete one person's data under GDPR or CCPA; place a tenant's shard in a required jurisdiction; roll out a schema migration one tenant at a time.
- **Limits:** a tenant too big for one node needs sharding within the tenant; a shard per small tenant costs too much overhead, while grouping tenants means moving them between shards as they grow; and features that join data across tenants become cross-shard queries (DDIA).

Cells apply the split to the whole stack. Vitillo starts from failures that redundancy cannot contain, because every replica runs the same code: a poison-pill request that crashes any server it reaches, or a noisy neighbor that degrades everyone. Partitioning the service by user confines the damage to one partition. With three partitions a bad user reaches a third of users, and more partitions shrink that share. This is the bulkhead pattern; see [containing failure]({{< ref "system-design/elements/containing-failure" >}}#options).

- **Shuffle sharding:** for a stateless service, give each user a random but fixed subset of instances. Six instances taken two at a time give 15 virtual partitions instead of three, so two users rarely share all their instances; load balancers that drop faulty instances and clients that retry improve isolation further (Vitillo).
- **Cells:** a cell is a complete, independent copy of the workload (load balancer, compute, and storage) that shares no state with other cells and serves a subset of the requests. A thin cell router sends each request to its cell by partition key, and a control plane provisions cells and migrates customers between them (AWS 2024; Vitillo). With ten cells, a bad deployment or a poison pill in one cell leaves 90 percent of requests unaffected. The AWS paper frames the choice as all customers seeing a small failure rate versus a few customers seeing a total outage.
- **Cell partition key (AWS 2024):** match the grain of the service, the natural way its work divides with few cross-cell interactions, such as customer ID or resource ID, and pick one available in most API calls. A customer that outgrows a cell needs a second key dimension, or a dedicated cell, which some customers will pay for.
- **Cell mapping:** a full per-key table is flexible but a critical dependency with a lot of state; prefix or range mapping needs less state but risks hot cells; naive modulo is even but every change in the number of cells moves customers in every cell; consistent hashing is often built as many logical buckets mapped to cells by a table. Every approach needs an override table for testing, quarantining, and heavy keys.
- **Cell size:** cap a cell's size and grow by adding cells. A capped cell can be load-tested to its limit, which avoids surprises at scale; smaller cells shrink the impact of a failure but mean more cells to operate.
- **Cell router:** it is the only component shared by all cells, so it must stay as simple as possible, hold no business logic, keep serving the other cells when one is unreachable, and itself be built as cells. Cross-cell work, such as scatter-gather, goes back through the router rather than from cell to cell.

## Cross-partition operations


Each partition works mostly on its own, which is what lets a sharded store scale; operations that span partitions give some of that back (DDIA). Choose the key so the common queries and transactions stay on one partition. Carpenter and Hewitt design each Cassandra table so a query touches a single partition, or failing that, as few as possible.

### Scatter-gather queries


A query by value on a local index, an aggregation such as a group by across partitions (Vitillo), or a search over document-partitioned shards goes to every relevant partition and merges the results. The response waits for the slowest partition, so tail latency grows with the partition count; hedged requests and partial results are in [scatter-gather and tail latency]({{< ref "system-design/elements/data-at-scale" >}}#scatter-gather-and-tail-latency). Petrov frames partial results as trading harvest (how complete an answer is) for yield (how many requests are answered): when the nodes holding some users' records are down, the store keeps serving the other users. Burns's scatter/gather pattern is in [splitting the work]({{< ref "engineering/distributed-systems/distributed-computation" >}}#splitting-the-work).

### Transactions across shards


A write that must update records on several shards atomically needs a distributed transaction, usually much slower than a single-node one and liable to become the bottleneck of the whole system (DDIA; Vitillo). VoltDB, which runs each shard's transactions serially, reports about 1,000 cross-shard writes per second, orders of magnitude below its single-shard throughput, and adding machines does not raise it (DDIA). Data with many secondary indexes needs many cross-shard transactions, because a record and its global index entries live on different shards.

- **Database-internal transactions:** CockroachDB, TiDB, Spanner, FoundationDB, and YugabyteDB run two-phase commit between shards, but avoid the problems of transactions across heterogeneous systems by replicating the coordinator and the shards with consensus; snapshot isolation and serializable snapshot isolation are both possible across shards (DDIA). Spanner pays an extra two-phase commit round on multi-partition transactions, which Calvin avoids by having a sequencer fix the transaction order before execution (Petrov). See [consensus versus two-phase commit]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#consensus-versus-two-phase-commit), [isolation levels]({{< ref "engineering/distributed-systems/guarantees" >}}#isolation-levels), and [transactions]({{< ref "engineering/distributed-systems/transactions" >}}).
- **Avoiding them:** route writes that may conflict to the same shard and process them in order. For an operation that spans shards, such as a payment touching a payer, a payee, and a fees account, DDIA replaces atomic commit with sharded logs. The request gets a unique ID and goes to the payer's log shard; a stream processor checks the balance, reserves the amount, and emits events to the other accounts' log shards; each consumer deduplicates by request ID. See [coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}) and, between services, [sagas]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services).

## In a design


- Stay on one shard while one machine handles the data and the writes; add read replicas for read load first (DDIA).
- Choose the partition key from the recorded access patterns: the value most queries and transactions filter on, with many distinct values and no sequential or celebrity concentration. Use a compound key when queries need ranges within one entity. Estimate the largest partition and the hottest key's request rate before committing, and plan [hot-key splitting]({{< ref "system-design/elements/data-at-scale" >}}#options) or a dedicated partition for known hot keys.
- Never map keys to nodes with `hash mod N`. Use many fixed partitions with a partition map, a store that splits ranges itself, or [consistent hashing]({{< ref "engineering/distributed-systems/hashing" >}}); keep the map in a [coordination service]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#coordination-services-in-practice) or a store that runs consensus internally.
- Have a person approve large rebalances, and do not let failure detection trigger data movement on its own.
- Decide for each secondary index whether it is local or global from the ratio of reads to writes and from how stale it may be; see [indexes]({{< ref "system-design/elements/data-at-scale" >}}#indexes) and the requirement side in [consistency]({{< ref "system-design/nfr/consistency" >}}).
- For a multitenant service, decide between tenants per shard and full cells, and size the blast radius explicitly; keep the cell router simple and cellular itself ([containing failure]({{< ref "system-design/elements/containing-failure" >}})).

## Related notes


- [Hashing]({{< ref "engineering/distributed-systems/hashing" >}}): consistent, rendezvous, and jump hashing, virtual nodes, and why `hash mod N` fails.
- [Replication]({{< ref "engineering/distributed-systems/replication" >}}): the copies of each partition, leaders and followers, and leaderless quorums.
- [Broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}#coordination-services-in-practice): the coordination services that hold partition maps, and a consensus group per shard.
- [Transactions]({{< ref "engineering/distributed-systems/transactions" >}}): atomicity and isolation on one node, which cross-shard transactions extend.
- [Coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}): routing conflicting writes to one shard instead of coordinating across shards.
- [Distributed computation]({{< ref "engineering/distributed-systems/distributed-computation" >}}#splitting-the-work): partitioned input, shuffles, and scatter/gather in batch and stream jobs.
- [System models]({{< ref "engineering/distributed-systems/system-models" >}}#failure-detection): why a slow node is suspected dead, which drives cascading rebalances.
- [Data at scale]({{< ref "system-design/elements/data-at-scale" >}}): the design hub for partitioning, hot keys, indexes, and scatter-gather; the [key-value store case]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design) applies partitioning with a ring.
- [Containing failure]({{< ref "system-design/elements/containing-failure" >}}#options): bulkheads, the general form of cells.

## Gaps


- Generic shard managers such as Facebook's Shard Manager (Lee et al. 2021, SOSP, [doi:10.1145/3477132.3483546](https://doi.org/10.1145/3477132.3483546)), which DDIA cites for placing hot keys flexibly, and the internals of automatic heat management, which DDIA leaves out of scope.
- Operational procedures: online resharding in specific systems (Vitess, Citus) and how long it takes, and cell deployment and observability from the AWS paper.
- Geo-partitioning, placing partitions near their users across regions, beyond data residency.
- Graph partitioning (edge-cut and vertex-cut), workload-aware partitioners, and hyperspace hashing, all covered by Davoudian et al.

## Sources


- Kleppmann 2017, *Designing Data-Intensive Applications*, first edition, chapter 6 (Partitioning): the source of the earlier version of this note, for the rebalancing requirements and the Espresso, Couchbase, and gossip routing examples.
- Karger, Lehman, Leighton, Panigrahy, Levine, and Lewin 1997, *Consistent Hashing and Random Trees: Distributed Caching Protocols for Relieving Hot Spots on the World Wide Web*, STOC ([doi:10.1145/258533.258660](https://doi.org/10.1145/258533.258660)).
- Thaler and Ravishankar 1998, *Using Name-Based Mappings to Increase Hit Rates*, IEEE/ACM Transactions on Networking ([doi:10.1109/90.663936](https://doi.org/10.1109/90.663936)).
- Lamping and Veach 2014, *A Fast, Minimal Memory, Consistent Hash Algorithm* ([arXiv:1406.2294](https://arxiv.org/abs/1406.2294)).
- Manning, Raghavan, and Schütze 2008, [Introduction to Information Retrieval](https://nlp.stanford.edu/IR-book/), Cambridge University Press: the document-partitioned and term-partitioned index terms DDIA uses.
- [Shuffle Sharding: Massive and Magical Fault Isolation](https://aws.amazon.com/blogs/architecture/shuffle-sharding-massive-and-magical-fault-isolation/), AWS Architecture Blog: cited by Vitillo for shuffle sharding.

## Library sources


- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 7 (Sharding) on every section; chapter 8 ("Actual Serial Execution", "Database-Internal Distributed Transactions") and chapter 13 ("Multishard request processing") on *Transactions across shards*
- [Carpenter and Hewitt 2022](/sources/software-engineering/databases/carpenter-2022-cassandra-definitive-guide.pdf.enc), *Cassandra: The Definitive Guide, Revised Third Edition* -- chapter 4 on compound keys; chapter 5 ("Breaking Up Large Partitions") and chapters 6 and 10 ("Rings and Tokens", "Virtual Nodes", "Partitioners", "Tokens and Virtual Nodes") on *Cassandra's partitioner and token ring*; chapter 7 ("Secondary Indexes", "Materialized Views") on *Secondary indexes*; chapters 6, 8, and 9 on coordinator nodes, gossip, and token-aware drivers in *Request routing*
- [AWS 2024](/sources/software-engineering/systems-and-operations/aws-2024-reducing-scope-of-impact-cell-based-architecture.pdf.enc), *Reducing the Scope of Impact with Cell-Based Architecture* -- "What is a cell-based architecture?", "Cell partition", "Cell routing", "Cell sizing", and "Cell migration" on *Multitenancy and cells* and *Rebalancing*; "Control plane and data plane" on stale maps in *Request routing*
- [Davoudian et al. 2018](/sources/software-engineering/databases/davoudian-2018-survey-on-nosql-stores.pdf.enc), *A Survey on NoSQL Stores* ([doi:10.1145/3158661](https://doi.org/10.1145/3158661)) -- section 4 (data partitioning) on partitioner goals, range directories, virtual nodes, and one-hop versus multi-hop routing
- [Vitillo 2021](/sources/system-design/distributed-systems/vitillo-2021-understanding-distributed-systems.pdf.enc), *Understanding Distributed Systems* -- chapter 16 (sections 16.1, 16.2) on *Why partition*, *Choosing a partition key*, and *Rebalancing*; chapter 26 (sections 26.1, 26.2) on *Multitenancy and cells*
- [Tornow 2025](/sources/system-design/distributed-systems/tornow-2025-think-distributed-systems.pdf.enc), *Think Distributed Systems* -- chapter 7 on *Terms*, the skew examples, the measured relocation under mod N, and overpartitioning
- [Petrov 2019](/sources/system-design/data-systems/petrov-2019-database-internals.pdf.enc), *Database Internals* -- chapter 13 ("Database Partitioning", "Consistent Hashing", "Distributed Transactions with Spanner", "Distributed Transactions with Calvin"); chapter 10 on a leader per replica set; chapter 11 ("Harvest and Yield") on *Scatter-gather queries*
- [Elhemali et al. 2022](/sources/software-engineering/databases/dynamodb-book-course/atc22-elhemali.pdf.enc), *Amazon DynamoDB: A Scalable, Predictably Performant, and Fully Managed NoSQL Database Service*, USENIX ATC 2022 -- section 3 on partitions and replication groups; section 4.4 ("Splitting for consumption") on *Skew and hot spots*; section 6.6 ("Metadata availability") on *Request routing*
- [Burns 2018](/sources/system-design/distributed-systems/burns-2018-designing-distributed-systems.pdf.enc), *Designing Distributed Systems* -- chapter 6 (*Sharded Services*) on choosing a shard key and hot sharding systems
