---
draft: false
toc: true
title: "Broadcast and Consensus"
description: "Broadcast from best-effort to total order, consensus and its equivalence with total-order broadcast, the FLP result and how systems escape it, quorums, Paxos, Raft, Viewstamped Replication and Zab, Byzantine consensus, and coordination services."
document_status: "draft"
linkTitle: "Consensus"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** how do nodes agree on a value or an order of operations when some may fail?

Agreement is easy on one node and hard on several, because a node cannot tell a crashed peer from a slow one. The problem has two shapes: deliver the same messages in the same order to every replica (broadcast), and decide one value that no node later contradicts (consensus). They turn out to be the same problem. Practical protocols (Paxos, Raft, Viewstamped Replication, Zab) solve it with a leader, numbered epochs, and majority quorums, and most systems use it through a coordination service.

## Broadcast abstractions


Cachin, Guerraoui, and Rodrigues (2011) build broadcast as a ladder: each abstraction keeps the properties of the one below and adds one. Reliability (who delivers) and ordering (in what order) are separate axes.

| Abstraction | Adds | How it is built | Cost without failures |
| --- | --- | --- | --- |
| Best-effort | If the sender is correct, every correct process delivers the message; no duplicates, no invented messages. | Send to every process over perfect point-to-point links. | One step, O(N) messages. If the sender crashes mid-send, some processes deliver and others never do. |
| Regular reliable | Agreement: if one correct process delivers a message, every correct process does, even when the sender crashed. | Relay it: eagerly on first receipt, or lazily once a perfect failure detector reports the sender crashed. | Eager: one step, O(N²) messages. Lazy: O(N) messages, but needs a perfect failure detector. |
| Uniform reliable | Uniform agreement: if any process delivers a message, even one that crashes right after, every correct process delivers it. | Deliver only after all correct processes (with a perfect failure detector) or a majority (N > 2f) have relayed it. | Two steps and about N² messages: one step more than regular. |
| FIFO | Messages from one sender are delivered in the order it sent them. | Per-sender sequence numbers; buffer early arrivals. | No extra messages. |
| Causal | If m1 happened before m2, no process delivers m2 before m1. Implies FIFO. | Attach a vector clock; hold a message until its causal past is delivered. | No extra messages; the header grows with N; delivery may wait. |
| Total order (atomic) | All correct processes deliver the same messages in the same order. | Reliable broadcast plus one consensus instance per batch of messages. | Three steps per batch; inherits every limit of consensus. |

- **Why uniformity matters:** a process that delivers a message and then acts on the outside world (answers a client, dispenses cash) may crash right after. Under regular agreement the survivors may never deliver that message, so the action leaves no trace among them. A replicated log needs the uniform variant.
- **Ordering is orthogonal:** causal broadcast leaves concurrent messages unordered, so two replicas can apply them in different orders. Total order fixes one sequence, but it need not respect causality unless specified to (Cachin et al.).
- **Where the line falls:** everything up to causal broadcast works with no failure detector and no timing assumption (the uniform variants need a majority of correct processes). Total order does not, because it is equivalent to consensus. [Time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}#causal-order-versus-total-order) covers happened-before, vector clocks, and the gap between causal and total order.

## The consensus problem


Each process proposes a value, and all must decide one. Without fault tolerance this is trivial, since one "dictator" node can decide for everyone (Kleppmann and Riccomini 2026, cited below as DDIA). Cachin et al. state four properties:

- **Termination:** every correct process eventually decides, even if others crash. This liveness property is where all the difficulty lies; the other three are safety properties.
- **Validity:** a decided value was proposed by some process, which rules out always deciding a fixed default.
- **Integrity:** no process decides twice.
- **Agreement:** no two correct processes decide differently. The uniform variant, which DDIA uses, extends this to processes that later crash. With crash faults and an eventually accurate failure detector, the two variants coincide.

**Equivalence with total-order broadcast:**

- **Consensus gives total order:** disseminate messages with reliable broadcast. In rounds, each process proposes the set of messages it has received but not yet delivered; consensus picks one set; every process sorts it deterministically and delivers it (Cachin et al., Algorithm 6.1). Deciding large batches per instance is what makes this fast in practice.
- **Total order gives consensus:** each process broadcasts its proposal and decides the first value delivered, which is the same at every process.
- **The wider family:** a shared append-only log, a linearizable compare-and-set, and atomic commitment are each equivalent to consensus. Fetch-and-add is weaker: it solves consensus for only two processes (DDIA).

## Impossibility and how systems escape it


Fischer, Lynch, and Paterson (1985) proved that no deterministic algorithm can guarantee consensus in the asynchronous model (no clocks, no bound on message delay) if even one process may crash. In outline: some initial configuration is still undecided, and any algorithm that decides must pass through a critical configuration where the deciding steps all happen at one node. If that node crashes there, no decision is ever reached, and since a crashed node looks like a slow one, the others cannot work around it (Wattenhofer 2016).

The result concerns termination only. Agreement, validity, and integrity can always be kept; what cannot be guaranteed is that a decision arrives (DDIA; Tornow 2025).

| Escape | What it adds to the model | Example |
| --- | --- | --- |
| Partial synchrony | Timing bounds hold eventually, from an unknown time on (Dwork, Lynch, and Stockmeyer 1988). | Every protocol below: safe under any timing, live once the network behaves for long enough. |
| Failure detectors | Suspicions that may be wrong but are eventually accurate (Chandra and Toueg 1996). The eventual leader detector Ω only promises that all correct processes eventually trust the same correct leader. | Election timeouts in Raft; Cachin et al.'s leader-driven consensus, a modular form of Paxos. |
| Randomization | Processes flip coins, so termination holds in expectation rather than in every execution (Ben-Or 1983). | Ben-Or's algorithm tolerates f < n/2 crashes but needs exponentially many rounds in expectation; a shared coin makes it fast. |

Two limits remain. Consensus with unreliable failure detection needs a majority of correct processes (Chandra and Toueg; Wattenhofer, Theorem 16.21). And Paxos itself does not guarantee termination: two proposers can keep preempting each other (Wattenhofer). [System models]({{< ref "engineering/distributed-systems/system-models" >}}#timing-models) covers the timing models and [failure detection]({{< ref "engineering/distributed-systems/system-models" >}}#failure-detection).

## Quorums


For crash faults, a quorum is any majority: more than N/2 processes. Any two majorities share at least one process, and with fewer than N/2 crashes a majority of live processes always exists (Cachin et al.).

- **Why majorities:** a decision is recorded at a quorum, and any later quorum, such as the one that elects the next leader, contains a process that saw it. That shared process prevents split brain (Tornow). A minority partition cannot form a quorum and stops.
- **2f + 1:** tolerating f crashes needs f + 1 live processes to form a quorum, so N = 2f + 1: three nodes for one failure, five for two. A fourth node adds no tolerance over three, since its majority is three. The bounds for other fault models are in [how many replicas]({{< ref "engineering/distributed-systems/system-models" >}}#how-many-replicas).
- **Intersection is what matters, not majority:** Howard, Malkhi, and Spiegelman (2016) showed that Paxos only needs each leader-election quorum to intersect each replication quorum: Q1 + Q2 > N. With five acceptors, an election can require four votes and each write two (Flexible Paxos). Wattenhofer studies other quorum systems, such as grids, that lower the load per node.
- **Read and write quorums are not consensus:** Dynamo-style stores with w + r > n use the same intersection idea, but without a leader or an ordered log they can still return non-linearizable results (DDIA); see the [key-value store case]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design).

## Paxos


Lamport (1998) described Paxos, and his "Paxos Made Simple" (2001) introduced the plainer terms now commonly used (Petrov 2019). There are three roles, usually colocated in each server: **proposers** drive a value, **acceptors** vote, and **learners** find out what was chosen. Each proposal carries a unique, increasing number, typically a (counter, node ID) pair.

Single-decree Paxos decides one value in two phases:

1. **Prepare (1a):** a proposer picks number n and sends prepare(n) to the acceptors.
2. **Promise (1b):** an acceptor that has seen no higher number promises to ignore proposals below n and returns the highest-numbered proposal it has already accepted, if any.
3. **Accept (2a):** with promises from a majority, the proposer sends accept(n, v), where v is the value of the highest-numbered accepted proposal among the replies. Only if there is none may it use its own value.
4. **Accepted (2b):** an acceptor accepts unless it has since promised a higher number, and tells the learners. A value is chosen once a majority accepts the same proposal.

The adoption rule in step 3 carries safety: once a majority has accepted a value, any later prepare majority overlaps it, so every higher-numbered proposal carries the same value (van Steen and Tanenbaum 2023; Wattenhofer, Lemma 15.14). Safety does not depend on timeouts, since a proposer can abandon an attempt and start a new one at any moment (Wattenhofer). Liveness does: competing proposers can preempt each other indefinitely, which random backoff and a single distinguished proposer avoid.

**Multi-Paxos** runs one instance per log slot. A stable leader (the distinguished proposer) skips phase 1 and runs only phase 2 per entry: one round trip to a majority (Petrov). Any node can become leader, but it must bring its log up to date with the others before appending (DDIA). A leader that serves reads locally may already have been replaced, so implementations read through a quorum or use leases, which assume bounded clock drift (Petrov, citing Chandra, Griesemer, and Redstone 2007).

## Raft


Ongaro and Ousterhout (2014) designed Raft to be easier to understand than Paxos. It makes the leader explicit and separates leader election, log replication, and safety.

- **Terms:** time is divided into numbered terms, each starting with an election. Every message carries the sender's term; a node that sees a higher term adopts it and becomes a follower, and messages with a lower term are rejected. The term works as a fencing token: two nodes may both believe they lead, but only the one with the current term can act (Tornow).
- **Leader election:** a follower that hears no heartbeat within its election timeout increments the term, becomes a candidate, votes for itself, and requests votes. Each node votes for at most one candidate per term, so at most one candidate gets a majority. A split vote ends in a new election; randomized timeouts make it likely that one candidate starts first.
- **Log replication:** the leader appends a command to its log as an entry tagged with its term and index, then sends AppendEntries to the followers. The request carries the index and term of the preceding entry; a follower whose log does not match rejects it, and the leader walks back until the logs agree, then overwrites the follower's entries after that point. The leader never rewrites its own log, and if two logs hold an entry with the same index and term, they agree on every entry up to it (Petrov; Vitillo 2021).
- **Commit rule:** an entry is committed once it is stored on a majority, counting the leader. The leader advances its commit index, which reaches followers in later AppendEntries, and every node applies entries to its state machine only up to that index. Committing an entry commits every entry before it. A leader counts replicas only for entries of its own term; entries left by an earlier leader become committed when a later entry of the current term commits (Ongaro and Ousterhout 2014, section 5.4.2; van Steen and Tanenbaum illustrate the case).
- **Safety:** a node refuses its vote to a candidate whose log is less up to date, comparing the term of the last entry first and then log length. A winner needs a majority, which overlaps every majority that stored a committed entry, so the new leader already holds every committed entry and entries flow only from leader to followers (Vitillo; Tornow). Uncommitted entries can be lost on a leader change; clients retry.
- **Edge cases:** with one consistently unreliable link, leadership can bounce between nodes without progress. A pre-vote phase, from Ongaro's thesis, addresses this (DDIA): a would-be candidate first asks whether it could win, and nodes that still hear from a current leader say no, so a node cut off from the leader does not keep raising the term and disrupting the cluster.

## Viewstamped Replication and Zab


**Viewstamped Replication** (Oki and Liskov 1988) is a primary-copy method published a decade before the Paxos paper; Tornow regards it as the first published consensus algorithm, though it did not use the word. Replicas move through numbered views, each with a unique primary, with a structure similar to Paxos (Cachin et al.).

**Zab** (Junqueira, Reed, and Serafini 2011) is ZooKeeper's atomic broadcast. Each epoch has one leader, and a prospective leader runs three phases (Petrov):

- **Discovery:** learn the latest epoch each follower has seen and propose a higher one.
- **Synchronization:** bring followers to the same history, delivering proposals committed in earlier epochs before any new ones. Recovery can copy from the single follower with the highest proposal.
- **Broadcast:** for each write, send a proposal, wait for acknowledgments from a quorum, then commit, like two-phase commit without aborts.

Kleppmann and Riccomini observe that all four protocols share one structure: a quorum vote elects a leader for an epoch, and a second quorum vote, which must overlap the first, accepts each entry. They differ in how a leader change is handled.

| Protocol | Agrees on | Epoch | How a new leader holds every committed entry | Seen in (per the sources) |
| --- | --- | --- | --- | --- |
| Single-decree Paxos | One value | Proposal (ballot) number | Phase 1 returns accepted values; the proposer adopts the highest-numbered one. | Building block for the others |
| Multi-Paxos | A log, one instance per slot | Ballot number | Any node may lead; it catches up its log before appending. | Chubby; Spanner's per-shard Paxos groups |
| Raft | A log | Term | Only a candidate at least as up to date as a majority can win, so it never needs to catch up. | etcd, Consul, CockroachDB |
| Viewstamped Replication | A log of operations | View number | A view change installs a new primary. | None named |
| Zab | A log of state changes | Epoch (part of the zxid) | Discovery and synchronization run before any new broadcast. | ZooKeeper |

## State machine replication


A deterministic state machine that starts in a known state and applies the same commands in the same order reaches the same state and produces the same outputs. Replicate it on several processes, feed every replica the log that consensus orders, and the group behaves as one server that survives the loss of a minority (Schneider 1990; Cachin et al.; Tornow).

- **Determinism:** each operation must be deterministic, but it can be arbitrarily complex, such as a compare-and-swap or a multi-key transaction (Vitillo).
- **Clients:** a client tags each command with a unique ID and resends it to another replica on timeout, so replicas must recognize duplicates. With Byzantine replicas, a client waits for f + 1 matching responses (Cachin et al.).
- **Reads:** a linearizable read must confirm leadership through a quorum, as etcd does, or rely on a lease (DDIA; Petrov).
- **Scale:** one log serializes every command, so sharded databases run one log per shard and need extra coordination for transactions across shards (DDIA). Spanner runs a Paxos group per shard (Petrov).

## Membership and configuration changes


In their standard form, consensus algorithms assume a fixed set of voting nodes: nodes may go down and come back, but the set does not change. Deployments need to add and remove nodes, for example to add a region, or to migrate by adding new nodes and then removing old ones, so the algorithms have been extended with reconfiguration (DDIA; van Steen and Tanenbaum note that Raft allows servers to join and leave).

- **Why it is delicate:** the voting set defines what a majority is. If nodes switched from the old set to the new one at different moments, a majority of the old set and a majority of the new set might not overlap, and two leaders could be elected. Membership is therefore itself agreed through consensus: Cachin et al. specify group membership as a sequence of numbered views and install each new view with one instance of uniform consensus. Their treatment covers removal after crashes and leaves explicit joins and leaves to the literature.
- **Virtual synchrony:** a message is delivered only within the view in which it was sent, so a view change acts as a barrier that messages cannot cross (van Steen and Tanenbaum; Petrov). Petrov notes it saw little commercial adoption.
- **Non-voting members:** ZooKeeper observers receive the log and serve possibly stale reads without voting, adding read capacity without enlarging the quorum (DDIA).

## Byzantine consensus


If nodes can lie, send conflicting messages, or collude, consensus needs N ≥ 3f + 1 (Cachin et al.), because two quorums must share a correct process and a quorum must still form while f processes stay silent ([how many replicas]({{< ref "engineering/distributed-systems/system-models" >}}#how-many-replicas)). Wattenhofer proves agreement impossible with f ≥ n/3.

PBFT (Castro and Liskov 1999) is the classic protocol. In each view one replica is primary. A request passes through pre-prepare (the primary assigns a sequence number), prepare (a replica waits for 2f matching prepares), and commit (it waits for 2f + 1 matching commits) before execution, and the client accepts a result once f + 1 replicas return the same answer. A suspected primary is replaced by a view change. Each step costs on the order of N² messages, because every replica cross-checks the others (Petrov).

PBFT fits when nodes do not trust each other: blockchains (DDIA), or storage in an incompletely trusted environment such as Farsite (Wattenhofer). Within one organization, authenticated and encrypted links usually suffice (Petrov), and the common protocols assume crash faults only (DDIA).

## Consensus versus two-phase commit


Atomic commitment looks like binary consensus but is stricter: one abort vote forces an abort, whereas consensus may decide any proposed value (Cachin et al.; DDIA).

| | Two-phase commit | Consensus (Raft, Paxos) |
| --- | --- | --- |
| Who drives it | One coordinator | The leader of the current epoch |
| Votes needed | A yes from every participant | An acknowledgment from a majority |
| Who can start a vote | Only the coordinator | Any node, by starting an election with a higher epoch |
| If the coordinator or leader fails | Participants that voted yes are in doubt: they can neither commit nor abort until the coordinator recovers. The protocol blocks. | A majority elects a new leader and continues. |

- **Non-blocking commit:** three-phase commit assumes bounded delays, which practical networks do not provide. The practical fix is to replace the single-node coordinator with a consensus group (DDIA). Cachin et al. build non-blocking atomic commit from a broadcast of votes plus one uniform consensus on commit or abort.
- **Two-phase commit over consensus groups:** Spanner runs two-phase commit between shard leaders, and each participant is a Paxos group, so a participant survives the loss of some of its replicas (Petrov).
- **Across services:** a saga avoids atomic commit, accepting visible intermediate states and compensations; see [operations that change several services]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services). Atomicity on a single node is in [transactions]({{< ref "engineering/distributed-systems/transactions" >}}).

## Coordination services in practice


Chubby (Burrows 2006), ZooKeeper, etcd, and Consul hold small, slowly changing data in memory, replicated by consensus over a fixed set of usually three or five nodes, on behalf of another distributed system (DDIA). Kubernetes keeps its state in etcd; see the [control plane]({{< ref "system-design/elements/control-plane" >}}). They offer:

- **Locks and leases:** built on the linearizable compare-and-set that consensus provides; of several clients racing for a lease, one wins.
- **Fencing tokens:** a number that grows with every grant (zxid and cversion in ZooKeeper, the revision in etcd, a sequencer with a lock generation number in Chubby). A lease alone cannot guarantee mutual exclusion, because its holder can pause past expiry, so the protected resource rejects older tokens (Vitillo; DDIA; Design Gurus 2021); see [leases and fencing tokens]({{< ref "engineering/distributed-systems/time-and-order" >}}#leases-and-fencing-tokens).
- **Leader election:** candidates race to create the same key with a time-to-live; the winner leads until it stops renewing (Vitillo).
- **Failure detection and watches:** client sessions are kept alive by heartbeats, and when one times out its ephemeral nodes disappear and its leases are released. Watches notify clients when a key changes, so they learn about joins, failures, and new configuration without polling.
- **Configuration and work allocation:** small settings, and which node leads or owns which shard. Such data changes over minutes or hours, not thousands of times per second.

Failure detection and watches do not need consensus; locks and fencing do. Service discovery rarely needs linearizability and is often better served by a cached, highly available source (DDIA). Chubby supports only coarse-grained locks, not ones held for seconds or less, so its load stays low and a brief outage stalls few clients (Design Gurus 2021).

Most systems should use one of these, or a database that runs consensus internally, rather than implement consensus: implementations are notoriously easy to get wrong, and running consensus on a handful of dedicated nodes is far cheaper than across thousands of storage nodes (Vitillo; DDIA). See [coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination).

## The cost


- **Latency:** every committed write waits for a round trip to a majority, each of which persists the entry; a linearizable read needs a quorum check or a lease. This is the latency side of [PACELC]({{< ref "engineering/distributed-systems/guarantees" >}}#pacelc): consistency costs latency even when nothing fails. When voters span regions, that round trip crosses regions.
- **Throughput:** adding voting nodes does not add throughput, and each one makes agreement slower (DDIA). Throughput comes from deciding batches of commands per consensus instance (Cachin et al.) and from running independent groups per shard.
- **Availability:** only the side of a partition that holds a majority makes progress; the minority blocks (DDIA).
- **Timeouts:** too long and failover is slow; too short and spurious elections consume the cluster. Tuning is hard across regions with variable delay (DDIA).
- **Weakening it:** options such as Kafka's unclean leader election let a stale replica lead, buying availability at the risk of losing data; the guarantees of consensus then no longer apply (DDIA).

## In a design


- Choose consensus as a component rather than build it: a coordination service for metadata and leases, or a store that replicates with Raft or Paxos internally.
- Keep it off the per-request path where possible. Use it to decide who leads each partition, which node owns which shard, and what the configuration is, and let that leader serve the data. A leader per partition also spreads the leader's load (Petrov; Vitillo). [Consumer rebalancing]({{< ref "system-design/elements/messaging" >}}#consumer-groups-and-rebalancing) is the same kind of work allocation (DDIA).
- Run three or five voters in separate failure domains; Chubby places its replicas on different racks.
- Put a fencing token on every lease-protected resource, and design for an occasional second leader (Vitillo).
- Give client commands unique IDs so retries are safe; see [idempotent consumer]({{< ref "system-design/elements/communication" >}}#idempotent-consumer).
- Decide per operation whether linearizability is required ([consistency requirements]({{< ref "system-design/nfr/consistency" >}})); where it is not, [coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}) is cheaper.

## Related notes


- [System models]({{< ref "engineering/distributed-systems/system-models" >}}): the failure and timing assumptions behind FLP and partial synchrony.
- [Time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}): happened-before and vector clocks, which causal broadcast uses.
- [Guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}#consistency-models): linearizability, which consensus provides, and [PACELC]({{< ref "engineering/distributed-systems/guarantees" >}}#pacelc).
- [Replication]({{< ref "engineering/distributed-systems/replication" >}}): single-leader replication and failover, which consensus makes safe.
- [Transactions]({{< ref "engineering/distributed-systems/transactions" >}}): atomicity on one node, which atomic commit extends across nodes.
- [Partitioning]({{< ref "engineering/distributed-systems/partitioning" >}}): one consensus group per partition.
- [Coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}): when replicas can proceed without agreeing.
- [Verification]({{< ref "engineering/distributed-systems/verification" >}}#specification-and-model-checking): consensus protocols are the usual targets of specification and model checking.

## Gaps


- Reconfiguration protocols in detail, such as Raft's joint consensus and single-server changes; the sources only note that they exist.
- Read paths beyond a sentence: lease reads, follower reads, and their clock assumptions.
- Leaderless and fast variants (Fast Paxos, EPaxos, Generalized Paxos), blockchain consensus, and BFT protocols newer than PBFT.
- Probabilistic (gossip) broadcast and Byzantine broadcast (Cachin et al., chapter 3).
- Measured latency and throughput of real deployments.

## Sources


- Fischer, Lynch, and Paterson, *Impossibility of Distributed Consensus with One Faulty Process*, Journal of the ACM, 1985 ([doi:10.1145/3149.214121](https://doi.org/10.1145/3149.214121)).
- Dwork, Lynch, and Stockmeyer, *Consensus in the Presence of Partial Synchrony*, Journal of the ACM, 1988 ([doi:10.1145/42282.42283](https://doi.org/10.1145/42282.42283)).
- Chandra and Toueg, *Unreliable Failure Detectors for Reliable Distributed Systems*, Journal of the ACM, 1996 ([doi:10.1145/226643.226647](https://doi.org/10.1145/226643.226647)).
- Ben-Or, *Another Advantage of Free Choice: Completely Asynchronous Agreement Protocols*, PODC 1983 ([doi:10.1145/800221.806707](https://doi.org/10.1145/800221.806707)).
- Lamport, *The Part-Time Parliament*, ACM Transactions on Computer Systems, 1998 ([doi:10.1145/279227.279229](https://doi.org/10.1145/279227.279229)), and [Paxos Made Simple](https://www.microsoft.com/en-us/research/publication/paxos-made-simple/), 2001.
- Chandra, Griesemer, and Redstone, *Paxos Made Live: An Engineering Perspective*, PODC 2007 ([doi:10.1145/1281100.1281103](https://doi.org/10.1145/1281100.1281103)).
- Howard, Malkhi, and Spiegelman, *Flexible Paxos: Quorum Intersection Revisited*, 2016 ([arXiv:1608.06696](https://arxiv.org/abs/1608.06696)).
- Ongaro and Ousterhout, [In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf), USENIX ATC 2014.
- Oki and Liskov, *Viewstamped Replication: A New Primary Copy Method to Support Highly-Available Distributed Systems*, PODC 1988 ([doi:10.1145/62546.62549](https://doi.org/10.1145/62546.62549)).
- Junqueira, Reed, and Serafini, *Zab: High-Performance Broadcast for Primary-Backup Systems*, DSN 2011 ([doi:10.1109/DSN.2011.5958223](https://doi.org/10.1109/DSN.2011.5958223)).
- Schneider, *Implementing Fault-Tolerant Services Using the State Machine Approach: A Tutorial*, ACM Computing Surveys, 1990 ([doi:10.1145/98163.98167](https://doi.org/10.1145/98163.98167)).
- Castro and Liskov, *Practical Byzantine Fault Tolerance*, OSDI 1999, and *Practical Byzantine Fault Tolerance and Proactive Recovery*, ACM Transactions on Computer Systems, 2002 ([doi:10.1145/571637.571640](https://doi.org/10.1145/571637.571640)).
- Burrows, *The Chubby Lock Service for Loosely-Coupled Distributed Systems*, OSDI 2006.

## Library sources


- [Cachin et al. 2011](/sources/ba524a2347f2a938124b8603dc085d10.bin), *Introduction to Reliable and Secure Distributed Programming* -- chapter 3 (sections 3.2-3.4, 3.9) on *Broadcast abstractions*; chapter 5 on *The consensus problem*, *Impossibility and how systems escape it*, and *Byzantine consensus*; chapter 6 (sections 6.1, 6.6, 6.7) on total-order broadcast, *Consensus versus two-phase commit*, and *Membership and configuration changes*; section 2.7.3 on *Quorums*
- [Kleppmann and Riccomini 2026](/sources/f639f3efb30ff1f78d5f3bec89441c6e.bin), *Designing Data-Intensive Applications, Second Edition* -- chapter 10 ("Consensus", "Coordination Services") on most sections, especially the equivalences, the shared structure of the protocols, *Coordination services in practice*, and *The cost*; chapter 8 ("Two-Phase Commit") on *Consensus versus two-phase commit*
- [Petrov 2019](/sources/611239aecf452fc6fb065bb3088b0326.bin), *Database Internals* -- chapter 14 on broadcast, *Paxos*, Flexible Paxos, *Raft*, Zab, and PBFT; chapter 8 ("FLP Impossibility"); chapter 10 on leader election; chapter 13 ("Two-Phase Commit", "Distributed Transactions with Spanner")
- [Vitillo 2021](/sources/ad3d4e8b5cefd65937e33aaa96a1f034.bin), *Understanding Distributed Systems* -- chapter 9 on Raft leader election and leases; chapter 10 (sections 10.1, 10.2) on *Raft* log replication, *State machine replication*, and coordination services
- [van Steen and Tanenbaum 2023](/sources/f2bbf8813969eb53517df7404b01c885.bin), *Distributed Systems*, 4th edition -- chapter 8 (sections 8.2.3-8.2.5 and 8.2.7) on *Raft*, *Paxos*, PBFT, and FLP; section 8.4.3 on virtual synchrony
- [Wattenhofer 2016](/sources/31e8cfe1b5a2478873df1d290ecbc86b.bin), *Principles of Distributed Computing* -- chapter 15 on *Paxos*; chapter 16 on FLP and randomized consensus; chapter 17 on Byzantine agreement; chapter 19 on quorum systems
- [Tornow 2025](/sources/70c0d56c1ae98a9f558a6a07dc87c787.bin), *Think Distributed Systems* -- chapter 10 on *The consensus problem*, *Quorums*, *State machine replication*, and *Raft*

Further reading:

- [Design Gurus 2021](/sources/14611823c7e3f35a54646eb2069a2e96.bin), *Grokking the Advanced System Design Interview* -- the Chubby case study: coarse-grained advisory locks, sequencers, and a cell of typically five replicas running Paxos
