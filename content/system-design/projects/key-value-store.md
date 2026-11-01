---
draft: false
toc: true
title: "Key-Value Store"
description: "Key-value-store notes: write-through, write-around, and write-back cache policies, and a Dynamo-style design with consistent hashing, quorums, hinted handoff, anti-entropy, gossip, and version vectors."
linkTitle: "Key-Value Store"
---

Cache write policies and a Dynamo-style store design. Compare the balance of read, write, and memory requirements in a concrete workload before choosing either.

## Cache write policies


| Policy | Write path and acknowledgment in the notes |
| --- | --- |
| Write-through | Write to cache and database; acknowledge after both writes complete. |
| Write-around | Write directly to the database, bypassing the cache. |
| Write-back | Write to the cache and acknowledge there; persist to the database asynchronously. |

## Dynamo-style design


The standard design for a distributed key-value store with `put(key, value)` and `get(key)`, favoring availability, follows Amazon's Dynamo paper.

| Concern | Mechanism | What it costs |
| --- | --- | --- |
| Spreading keys | Consistent hashing places nodes on a ring; each key belongs to the next node clockwise. Each physical node takes many virtual positions, so load evens out and a joining node takes keys from many others. | A routing step: clients or a coordinator must know the ring. |
| Replication | Each key is stored on the next N distinct physical nodes on the ring. | N times the storage. |
| Tunable consistency | A write succeeds after W replicas acknowledge; a read asks R replicas. With R + W > N, every read overlaps the latest write, such as N = 3, W = 2, R = 2. Lower W or R trade consistency for latency. | Quorum waits add latency; even R + W > N is not linearizable under concurrent writes. |
| Temporary failure | Sloppy quorum: a write for an unreachable node goes to the next healthy node with a hint, and is handed back when the node returns (hinted handoff). | During the failure, a read quorum may miss the latest write. |
| Permanent drift | Anti-entropy: replicas compare Merkle trees, hash trees over key ranges, and exchange only the ranges that differ. | Background I/O and network. |
| Membership and failure detection | Gossip: each node periodically exchanges its view of the membership and of node health with a few random peers. | Views converge only after several rounds. |
| Conflicts | Version vectors detect concurrent writes. The store keeps both versions, and the client or a merge rule resolves them on the next read or write. Last-write-wins is simpler but drops one of the concurrent writes. | Clients must handle several versions, or accept lost writes. |
| Storage engine | An LSM tree on each node: a commit log, an in-memory table, and sorted files merged by compaction. | Compaction load; Bloom filters keep reads from checking every file. |

**Trade-offs to state in an interview:**

- **Consistency during partitions:** this design chooses availability; see [CAP and PACELC]({{< ref "engineering/distributed-systems/guarantees" >}}#cap-and-pacelc).
- **Quorum values per workload:** W = 1 for fast writes that tolerate loss, R = 1 for fast reads that tolerate staleness.
- **Conflict handling:** whether the application can merge versions, such as a shopping cart taking the union of items, decides whether version vectors are worth their cost.

The mechanisms are explained in [data at scale]({{< ref "system-design/elements/data-at-scale" >}}): [coordination and logical clocks]({{< ref "system-design/elements/data-at-scale" >}}#coordination), [indexes and storage engines]({{< ref "system-design/elements/data-at-scale" >}}#indexes), and consistent hashing in the options table.

## Questions to develop


Clarify the failure behavior, consistency, and workload that would favor each cache write policy, and how the policies above apply when the store is used as a cache.

Use the [case template]({{< ref "system-design/projects/case-template" >}}) when developing a full store design.

## Library sources


- [DeCandia et al. 2007](/sources/system-design/data-systems/decandia-2007-dynamo-amazons-key-value-store.pdf.enc), *Dynamo: Amazon's Highly Available Key-value Store* -- the design in *Dynamo-style design*
- [Xu 2020](/sources/system-design/interviews/xu-2020-system-design-interview-an-insiders-guide.pdf.enc), *System Design Interview: An Insider's Guide* -- chapters 5 and 6, consistent hashing and a key-value store
- Educative 2023: key-value store, *Grokking Modern System Design Interview*
