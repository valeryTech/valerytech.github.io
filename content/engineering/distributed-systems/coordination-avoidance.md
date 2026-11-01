---
draft: false
toc: true
title: "Coordination Avoidance"
description: "When replicas can accept operations without agreeing first: the cost of coordination, strong eventual consistency, last-write-wins, siblings and merges, OT and CRDTs, the CALM theorem and invariant confluence, and local-first sync engines."
document_status: "draft"
linkTitle: "Coordination Avoidance"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** when can replicas accept operations without agreeing first, and what do they give up?

Coordination means replicas agree on the order of operations before applying them, through a leader, a quorum, or consensus. It puts a network round trip inside every operation and stops operations on the side of a partition that cannot reach the others. The alternative is to apply each operation at one replica, answer at once, and propagate it later. That works when the replicas are guaranteed to converge and the application's invariants survive concurrent updates; the price is conflicts, metadata, and anomalies users can see.

## Why avoid coordination


Vitillo describes state machine replication as two ingredients: a total order broadcast that delivers every update to every replica in the same order, and a deterministic update function. Total order broadcast is equivalent to consensus, and it has three costs:

- **Latency proportional to network delay.** Kleppmann (2015) collects the lower bounds: linearizable reads and writes take O(d) for network delay d; sequential consistency lets either reads or writes be local, not both. See [delay sensitivity]({{< ref "engineering/distributed-systems/guarantees" >}}#delay-sensitivity).
- **Unavailability during partitions.** An operation that must hear from other replicas waits or fails on the side of a partition that cannot reach them.
- **A sequential bottleneck.** A total order is processed one update at a time by one process, such as the Raft leader (Vitillo).

Kleppmann (2015) adds the limit on the other side: causal consistency with eventual convergence is the strongest model in which no operation waits for the network (Mahajan et al. 2011; Attiya et al. 2015). Read-your-writes, PRAM, and eventual consistency are weaker and also achievable without waiting. Convergence still takes time proportional to d, but it is decoupled from operation latency, which is what makes disconnected operation possible. Even on fast, reliable networks, such coordination-free designs have shown performance and scalability benefits.

Burckhardt (2014) states the choice bluntly: mutable shared state across geographic distance is "either slow (require coordination when updating data) or weird (provide weak consistency only)." His recipe for the weird side has three steps: replicate the data, perform updates tentatively at each participant, and propagate them asynchronously when connections allow. His seat-reservation example shows the limit: two users in different partitions booking the last seat force the system to delay one of them or risk a double booking. He also notes that airlines overbook and reservations can be undone at a cost, so the real requirement is often weaker than it first looks.

## Convergence


Without a total order, replicas receive updates in different orders. The guarantees below say how they come back together.

| Guarantee | Definition | Leaves open |
| --- | --- | --- |
| Eventual consistency | Eventual delivery: an update applied at one replica reaches every non-faulty replica. Convergence: once updates stop, replicas reach the same state. | What reads return while updates continue, and how replicas agree on a resolution. |
| Strong eventual consistency | Eventual delivery, plus strong convergence: any two replicas that have received the same set of updates are in the same state, in whatever order they arrived. | Whether the merged state is what the users meant. |
| Causal consistency with convergence (causal+) | Causally related updates are applied in order everywhere, and concurrent ones are merged deterministically so replicas do not diverge. | The order in which concurrent updates become visible; integrity invariants. |

Plain eventual consistency allows replicas to reconcile later, for example by running consensus off the critical path. Strong eventual consistency removes even that: if every possible conflict has a deterministic outcome, replicas need no agreement to reconcile (Vitillo). DDIA ties it to automatic conflict resolution: an algorithm that merges concurrent writes so that replicas that processed the same writes are in the same state.

Burckhardt decomposes consistency into guarantees about three things: the data type and how it resolves conflicts, the ordering of updates, and convergence. His overview gives the key move for replicated data types: think of the current state as a graph of prior operations, not as a value. His first example is an epidemic register. Each peer keeps a value and a logical timestamp (a counter and the peer's ID), reads and writes return immediately, and each peer periodically broadcasts its value and timestamp; a receiver keeps whichever timestamp is larger. Messages may be lost or duplicated as long as some delivery path eventually exists. He calls the protocol epidemic, or state-based, because each message carries the sender's local state. He states, with the proof later in the book, that this register is sequentially consistent; [guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}#consistency-models) explains why the cost of sequential consistency appears only with richer data types.

Convergence is not automatic. Gotsman et al. (2016) give a bank account where interest adds 5 percent of the balance seen at the origin replica: that effect commutes with deposits, and replicas converge. If interest instead multiplies the balance by 1.05 at every replica, a concurrent deposit and interest leave the replicas at 126 and 125 after all messages are delivered. Convergence requires the effects of concurrent operations to commute.

## Resolving conflicts


Two writes are concurrent when neither was aware of the other when it was made, however far apart in time they happened (DDIA). Detecting this needs causality tracking. On a single replica, a version number per key works: a client reads the key with its version, writes back with that version, and the server overwrites values at or below it while keeping higher ones as siblings. With several replicas accepting writes, each replica keeps its own counter, and the collection is a version vector; DDIA notes that version vectors, not vector clocks, are the right structure for comparing replica states. See [time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}).

| Strategy | How it works | What it costs | Used by |
| --- | --- | --- | --- |
| Conflict avoidance | Route all writes for a record to one leader, such as a user's home region; or partition the ID space, such as odd and even IDs for two leaders. | Breaks down when the designated leader changes; impossible for an offline client. | Geo-replicated server systems (DDIA). |
| Last write wins (LWW) | Tag each write with a timestamp and keep the greatest. | Concurrent writes are silently discarded; their order is essentially random. Clock skew can drop a later write unless a logical clock is used. | Cassandra and ScyllaDB (DDIA); Dynamo's session-information service. |
| Siblings with version vectors | Keep every concurrent value; return all of them on read; the client merges and writes back with the causal context. | The API returns sets of values; merging is application work; concurrent resolutions can conflict again. | Dynamo, Riak, CouchDB. |
| Application merge | Business logic collapses siblings, such as taking the union of shopping carts. | Union keeps every add but resurrects deleted items. | Dynamo's shopping cart. |
| Automatic merge | A CRDT or operational transformation merges concurrent updates for a data type. | Metadata per element; some invariants cannot be merged. | Riak, Redis Enterprise, Azure Cosmos DB; Automerge, Yjs, ShareDB. |

DeCandia et al. (2007) designed Dynamo to be always writeable, because rejecting a customer's update, such as a change to a shopping cart, gives a poor customer experience. That pushes conflict resolution from writes to reads. Each version carries a vector clock of (node, counter) pairs; if one clock is less than or equal to the other in every entry, it is an ancestor and can be dropped (syntactic reconciliation). Otherwise both versions are returned with a context summarizing their clocks, and a write with that context collapses the branches (semantic reconciliation). Under this scheme an add-to-cart is never lost, but deleted items can resurface. Divergence was rare in production: over 24 hours, 99.94 percent of shopping cart requests saw exactly one version, and the paper attributes increases in divergence to concurrent writers, usually automated clients, not to failures.

### Collaborative editing: OT and CRDTs


Text is the hard case: users insert and delete by position, and positions shift under concurrent edits. The Educative Google Docs lesson shows two failures: two inserts at the same index produce interleaved or overwritten text (the operations do not commute), and two users deleting the same extra character can remove more than intended (the operation is not idempotent). Any solution must make concurrent edits commute and apply repeated ones once.

DDIA's example starts with "ice" on two replicas; one prepends "n", the other appends "!", and both must end with "nice!".

| | Operational transformation (OT) | CRDT for sequences |
| --- | --- | --- |
| Position of an edit | An integer index. | A unique, immutable ID per character; an insert names the ID of the character it follows. |
| Merging concurrent edits | Transform each incoming operation against concurrent ones already applied: "!" at index 3 becomes index 4 after "n" is inserted at 0. | Apply operations as they are; concurrent inserts at the same place are ordered by their IDs, so no transformation is needed. |
| Correctness conditions | Causality preservation and convergence (the CC model); CCI adds intention preservation (Educative). | Operations commute by construction. |
| Implementation | Hard to get right; Educative reports that the Google Wave team took two years. | A more complex data structure with a simpler algorithm (Educative). |
| Where used | Google Docs (DDIA); ShareDB. | Automerge, Yjs; peer-to-peer editing without a server becomes possible. |

The Educative design still routes edits through a logically centralized server with a replicated operations queue that fixes the final order for all clients: edits apply locally for latency, but one service orders them. DDIA notes that the two approaches have different performance and functionality trade-offs, and that one algorithm can combine their advantages.

## CRDTs


Conflict-free replicated data types (Shapiro et al. 2011) are data types whose concurrent updates merge deterministically, so any replica can accept updates and replicas reach strong eventual consistency. There are two variants, which differ in what they send and what they ask of the network.

| Variant | Replicas send | The type must provide | The network must provide |
| --- | --- | --- | --- |
| State-based (convergent, CvRDT) | Their whole state, on update or periodically as anti-entropy. | A merge that is commutative, associative, and idempotent: the states form a semilattice and merge returns the least upper bound. | Eventual delivery, possibly indirect. Lost, duplicated, and reordered messages are tolerated. |
| Operation-based (commutative, CmRDT) | Each operation. | Concurrent operations commute. | No operation lost, each applied effectively once, and causally related operations delivered in order. |

Vitillo gives the state-based conditions and notes that naive periodic state exchange is expensive; Tornow and Petrov give the operation-based ones. The two trade the same burden: idempotence lives in the merge for state-based types, and in the delivery layer (deduplication, an [idempotent consumer]({{< ref "system-design/elements/communication" >}}#idempotent-consumer)) for operation-based ones. The replica model in Gotsman et al. is operation-based: effects are delivered causally and at most once, and they must commute.

| Type | State | Update and merge | Under concurrency |
| --- | --- | --- | --- |
| G-counter | A vector with one count per replica. | A replica increments only its own slot; merge takes the element-wise maximum; the value is the sum. | Increments are never lost or double-counted: [1, 0, 0] merged with [0, 0, 1] is [1, 0, 1], value 2 (Petrov). |
| PN-counter | Two G-counters, P for increments and N for decrements. | Value is the sum of P minus the sum of N. | Supports decrements, but cannot enforce a lower bound. |
| G-set | A set. | Add only; merge is union. | Elements are never removed. |
| Remove-wins set (two-phase set) | An add set A and a tombstone set T. | Add puts an element in A, remove puts it in T; contents are A minus T. | A removed element can never be added again (Gotsman et al.). |
| OR-set (add-wins set) | Elements tagged with unique IDs. | Each add carries a new tag; a remove deletes the tags it has observed. | A concurrent add has an unobserved tag and survives; a removal is not undone by a stale replica, avoiding the cart resurrection. |
| LWW register | A value and a timestamp. | Timestamp is a Lamport timestamp plus replica ID; merge keeps the greater. | One concurrent write wins and the others are discarded. |
| Multi-value (MV) register | Values tagged with version vectors. | Merge keeps every value not dominated by another. | All concurrent values are returned for the application to resolve. |
| Map | A CRDT per key. | Merge per key with the value type's merge. | Different keys merge independently; a Dynamo-style store is a map of LWW or MV registers (Vitillo). |
| Sequence (text, list) | Elements with unique, immutable IDs. | Insert after a named ID; deletes refer to IDs. | Concurrent inserts at one position are ordered by ID on every replica (DDIA). |

CRDTs compose, which is how maps and JSON documents are built from registers, sets, and sequences. They cannot merge away every constraint: if a list may hold at most five items and users concurrently add enough to exceed it, the only option is to drop some (DDIA). Gotsman et al. use CRDTs for exactly this division of labor: CRDTs make effects commute, and a separate mechanism protects the invariants.

## Which programs need no coordination: CALM


The CALM theorem (Hellerstein and Alvaro, as presented by Vitillo) states that a program has a consistent, coordination-free distributed implementation if and only if it is monotonic.

- **Monotonic:** new inputs refine the output and never retract earlier output. Set union is the standard example, and CRDTs are monotonic.
- **Non-monotonic:** a new input can retract earlier output. Assignment is non-monotonic because it overwrites the previous value.
- **Consistency here means output, not reads and writes.** A CALM-consistent program produces the same output whatever order its inputs arrive in. It is not the linearizability of CAP.

Vitillo's counter shows the difference. With only reads and writes, order matters: write(1), write(2), write(3) ends at 3, while write(3), write(1), write(2) ends at 2. With an increment operation, any order gives the same total. A system can be consistent at the application level while its storage-level reads and writes are not. CALM also shows how to rescue assignment: pairing it with a logical clock gives the LWW and MV registers above, which are monotonic.

**Invariant confluence** (Bailis et al. 2014) asks the same question about integrity invariants. An invariant is I-confluent for a set of operations if, whenever two replicas start from a valid state and each applies valid operations on its own, merging their states still gives a valid state. If it holds, the invariant survives coordination-free execution; if it fails, some operations need coordination. Typical results:

| Invariant and operations | I-confluent? |
| --- | --- |
| Uniqueness of system-generated IDs, with a replica prefix in each ID | Yes |
| Uniqueness of values users choose, such as usernames | No |
| Balance at least zero, under deposits only | Yes |
| Balance at least zero, under withdrawals | No |
| A new row references an existing row (foreign-key insert) | Yes |
| Deleting a row that other replicas may concurrently reference | No, unless the delete cascades |

I-confluence says whether an invariant needs coordination at all. Gotsman et al., below, say which pairs of operations need it when the answer is no.

## Synchronizing only the operations that conflict


Gotsman et al. (2016) start from the observation that causal consistency, which needs no synchronization, prevents ordering anomalies such as a comment appearing without its post, but not integrity violations. Their contribution is a consistency model that adds synchronization only where an invariant needs it, and a proof rule that checks the choice. The summary is in [choosing consistency per operation]({{< ref "engineering/distributed-systems/guarantees" >}}#choosing-consistency-per-operation); the mechanism follows.

**The replica model.** An operation runs at its origin replica, returns immediately, and produces an effect, a function on the state, that every replica applies: at once at the origin, and on receipt elsewhere. Effects are delivered causally and at most once. The semantics of an operation o in state σ is a triple: its return value, its effect, and a set of tokens it acquires.

**Tokens and the conflict relation.** A token system is a set of tokens and a symmetric conflict relation between them. If two operations acquire conflicting tokens, they must be causally dependent: one origin replica must have applied the other's effect before running its operation. Implementations need synchronization to ensure this. Because conflicting operations are then seen in the same order everywhere, commutativity is required only of operations that acquire no conflicting tokens.

**The bank example.** The invariant is that the balance is never negative. Withdraw checks the balance and subtracts if there is enough; under plain causal consistency, two replicas each accept a withdrawal of 100 from a balance of 100, and the merged balance is −100. Giving withdraw a token τ that conflicts with itself, and giving deposit, interest, and query no tokens, forces any two withdrawals to see each other, so the second fails; deposits still run without synchronization. With many accounts, a token per account means only withdrawals from the same account synchronize.

The model encodes several published ones as choices of tokens:

| Model | Token choice | Effect |
| --- | --- | --- |
| Causal consistency | No tokens. | No synchronization; every pair of effects must commute. |
| Sequential consistency | Every operation acquires one mutual exclusion token. | Happens-before is a total order. |
| RedBlue consistency | Red operations acquire the mutual exclusion token, blue ones none. | The bank example: withdraw is red, the rest blue. |
| Multi-level locks | Auction: close acquires τc, which conflicts with itself and with τp; place-bid acquires τp, which does not conflict with itself. | Bids proceed without synchronization; only closing synchronizes. The most frequent operation is the cheapest. |
| Parallel snapshot isolation | One token per object; operations writing the same object conflict. | Writes to one object are ordered; writes to different objects may be concurrent. |

**The proof rule.** The aim is to show that every execution allowed by the token system ends in a state satisfying the invariant I, without enumerating executions. The rule uses rely-guarantee reasoning. Assign each token τ a guarantee G(τ), the state changes an operation holding τ may cause at any replica, and assign G0 to operations without tokens. Then check:

- **S1:** the initial state satisfies I.
- **S2:** every guarantee preserves I.
- **S3:** for each operation o generated at a state σ in I, and every state σ′ reachable from σ through changes allowed by G0 or by tokens that do not conflict with o's tokens, applying o's effect to σ′ is a change allowed by G0 or by o's own tokens.

S3 models the replica that receives o's effect in a different state from the one where o ran. Acquiring a token denies other replicas permission to make the conflicting changes concurrently, which narrows the states σ′ to consider. Each operation is checked separately, in terms of single-copy states, as in proof rules for strongly consistent shared memory.

For the bank: G(τ) allows decreasing a balance without making it negative, and G0 allows increasing a non-negative balance. Withdraw holds τ, which conflicts with itself, so no token-holding change can happen concurrently and σ′ is reachable from σ only through G0, which only increases the balance: 0 ≤ σ ≤ σ′. If σ ≥ a, then σ′ ≥ a, and subtracting a stays within G(τ). If there was enough money where the withdrawal ran, there is enough wherever it is applied. The naive check, that each effect preserves I when applied to any state satisfying I, fails here: the withdrawal generated at 100 could be applied at 0.

**Soundness has preconditions.** The rule is sound only because happens-before is transitive (causal delivery) and non-conflicting effects commute; the paper gives counterexamples for models that drop either. Soundness is proved through a more general event-based rule over partial orders of events.

**The tool.** A prototype reduces a variant of the rule, with predicates in place of the transitive closure, to SMT queries discharged by Z3. It takes the token system, the operation semantics, and the invariant in SMT-LIB form, and assumes commutativity is checked separately. It verified a multi-account bank with transfers, an auction with 12 invariants including referential integrity, and a course registration system, each in under six seconds. The courseware example adds a referential-integrity invariant: enrolling a student into a course and removing that course acquire conflicting tokens, while enrollments among themselves, and course additions and removals among themselves, stay unsynchronized.

## Local-first software and sync engines


DDIA treats offline-capable apps as multi-leader replication taken to the extreme. A calendar on a phone, a laptop, and a server has a replica on each device that accepts writes, and sync is asynchronous replication whose lag may be hours or days. Real-time collaboration (Google Docs, Figma, Linear) has the same structure even without offline editing: each open browser tab is a replica that applies edits before the server responds.

- **Sync engine:** a library that captures local changes, sends them or stores them for later, receives collaborators' changes, merges them into the local copy, and updates the UI.
- **Offline-first:** the app keeps working without a connection; with a sync engine, being offline is the same as a very large network delay.
- **Local-first:** offline-first collaborative software that keeps working even if its developer shuts down all online services, through an open sync protocol with several providers. Git is local-first, without real-time collaboration.

The benefits are local reads and writes that can respond within one display frame (16 ms at 60 Hz), no separate offline mode, and a simpler programming model, since local operations almost never fail. The limit is that the data a user may need must be downloaded in advance, which suits a user's own documents and not an ecommerce catalog. Lotus Notes pioneered the approach; current engines include Firestore, Realm, and Ditto with proprietary backends, and PouchDB/CouchDB, Automerge, and Yjs with open ones. Conflict avoidance is unavailable to an offline client, so conflict resolution is inevitable, and DDIA recommends automating it. Kleppmann (2015) gives the same case from the latency side: a fully delay-independent system supports offline operation.

## What is given up


| Given up | Example | What designs do instead |
| --- | --- | --- |
| Invariants over one agreed value | Unique usernames, non-negative balances, stock levels, seat and room bookings. Two leaders can each accept a write that is fine alone and violates the constraint together (DDIA). | Route conflicting writes to one shard and process them in order; synchronize only the conflicting pairs; or accept violations and compensate. |
| Referential integrity when targets are deleted | Enrolling a student while another replica removes the course (Gotsman et al.). DDIA, citing Bailis et al., says foreign-key constraints can be implemented without linearizability; this case is a delete racing an insert. | Make the insert of a reference and the delete of its target conflict; inserts alone need nothing. |
| Bounded collections | At most five items in a list. | Drop items after the merge. |
| Writes the user made | LWW silently discards concurrent writes. | MV registers or CRDTs, at the cost of metadata. |
| Up-to-date reads | Interest computed on a balance that has not yet seen a concurrent deposit (Gotsman et al.). | Session guarantees for a user's own writes; where the user needs the outcome, wait for it (DDIA). |
| Acknowledged writes | In COPS, a replica that fails after committing locally but before broadcasting loses the write (Vitillo). | COPS accepts the window to avoid waiting on remote replicas; closing it means waiting for another replica before acknowledging. |

**Metadata grows.** Version vectors gain an entry per coordinating node; Dynamo drops the oldest entry once a clock reaches a threshold (about 10 in the paper's example), so descendant relationships can no longer be derived accurately. Counters keep a slot per replica, and Petrov mentions super-peers to avoid propagating large vectors. The tombstone set of a remove-wins set only grows. Causal consistency needs dependency tracking, such as the per-client dictionary of versions in COPS, and Kleppmann (2015) names the metadata overhead of tracking causality as a reason to choose weaker models.

**Anomalies are visible.** Users see deleted items reappear (Dynamo's cart), concurrent posts in different orders on different replicas (Gotsman et al.), conflict sets surfacing in the API or a merge dialog, and merges that are inconsistent if replicas resolve the same conflict differently, such as B/C on one and C/B on another (DDIA).

DDIA's framing of the trade-off: consistency conflates timeliness, which eventual consistency gives up temporarily, and integrity, whose violation is permanent. Many businesses already tolerate late enforcement of constraints: warehouses apologize for oversold stock, airlines overbook, banks charge overdraft fees. Coordination reduces apologies for inconsistency but adds apologies for outages, and the design goal is the balance between them, with synchronous coordination kept for the actions that cannot be undone.

## In a design


1. For each operation, record whether it may run at any replica and merge later, alongside its model and its behavior when replicas are unreachable, in [consistency]({{< ref "system-design/nfr/consistency" >}}#in-a-design).
2. Choose a merge per data type: PN-counter for counts, an add-wins or remove-wins set for membership, LWW only where losing a concurrent write is acceptable, MV registers or application merges otherwise, a sequence CRDT or OT for text.
3. List the integrity invariants. For each operation, find the operations that could invalidate its precondition at another replica, and synchronize only those pairs, as in [choosing consistency per operation]({{< ref "engineering/distributed-systems/guarantees" >}}#choosing-consistency-per-operation). The consensus behind them is in [coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination).
4. In a Dynamo-style store, decide between LWW and siblings with version vectors for each kind of record; the mechanisms are in the [key-value store design]({{< ref "system-design/projects/key-value-store" >}}#dynamo-style-design).
5. Budget the metadata: version vector size, tombstone retention and garbage collection, and dependency tracking for causal delivery.
6. Decide where apologies happen: which constraint violations are detected after the fact and repaired by [compensation]({{< ref "system-design/elements/data-across-services" >}}#operations-that-change-several-services).
7. For operation-based replication, make delivery idempotent with request IDs and an [idempotent consumer]({{< ref "system-design/elements/communication" >}}#idempotent-consumer).

## Related notes


- [Guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}): the consistency models, delay sensitivity, and the short version of per-operation consistency.
- [Broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}): what the coordination avoided here costs, and total order broadcast.
- [Time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}): happens-before, Lamport timestamps, and version vectors used to detect concurrency.
- [Replication]({{< ref "engineering/distributed-systems/replication" >}}): multi-leader and leaderless replication, where conflicts arise.
- [Transactions]({{< ref "engineering/distributed-systems/transactions" >}}): isolation and write skew, the single-node form of concurrent invariant violations.
- [Verification]({{< ref "engineering/distributed-systems/verification" >}}): other ways to check that a protocol preserves its invariants.
- [Consistency]({{< ref "system-design/nfr/consistency" >}}): the requirement side.

## Gaps


- **Invariant confluence** (Bailis et al. 2014): the summary above comes from the paper's well-known definition, not from a local source; neither Vitillo chapter 11 nor DDIA defines it, and the paper is not in the library. Its full table of invariants and its benchmark results are not covered.
- **Burckhardt beyond chapter 1:** the excerpt covers only chapter 1 and the contents, so his replicated data type specifications, protocol templates, and proofs are not covered.
- **CRDT catalogs and internals:** the OR-set description is standard but not from the sources read; delta-state CRDTs, tombstone garbage collection, and sequence algorithms (those inside Automerge and Yjs, and Egwalker by Gentle and Kleppmann 2025, which DDIA cites as combining OT and CRDT advantages) are not covered.
- **Primary papers known only through summaries:** the CALM paper (through Vitillo), the local-first paper (through DDIA), and COPS (through Vitillo).

## Sources


- Gotsman, Yang, Ferreira, Najafzadeh, and Shapiro, *'Cause I'm Strong Enough: Reasoning about Consistency Choices in Distributed Systems*, POPL 2016 ([doi:10.1145/2837614.2837625](https://doi.org/10.1145/2837614.2837625)).
- Burckhardt, *Principles of Eventual Consistency*, Foundations and Trends in Programming Languages 1(1-2), 2014 ([doi:10.1561/2500000011](https://doi.org/10.1561/2500000011)).
- Kleppmann, *A Critique of the CAP Theorem*, 2015 ([arXiv:1509.05393](https://arxiv.org/abs/1509.05393)).
- DeCandia et al., *Dynamo: Amazon's Highly Available Key-value Store*, SOSP 2007 ([doi:10.1145/1294261.1294281](https://doi.org/10.1145/1294261.1294281)).
- Shapiro, Preguiça, Baquero, and Zawirski, *Conflict-Free Replicated Data Types*, SSS 2011 ([doi:10.1007/978-3-642-24550-3_29](https://doi.org/10.1007/978-3-642-24550-3_29)) -- cited by DDIA and Vitillo.
- Sun and Ellis, *Operational Transformation in Real-Time Group Editors: Issues, Algorithms, and Achievements*, CSCW 1998 ([doi:10.1145/289444.289469](https://doi.org/10.1145/289444.289469)) -- cited by DDIA and Educative.
- Hellerstein and Alvaro, *Keeping CALM: When Distributed Consistency Is Easy* ([arXiv:1901.01930](https://arxiv.org/abs/1901.01930)) -- cited by Vitillo.
- Bailis, Fekete, Franklin, Ghodsi, Hellerstein, and Stoica, *Coordination Avoidance in Database Systems*, PVLDB 8(3), 2014 ([doi:10.14778/2735508.2735509](https://doi.org/10.14778/2735508.2735509); [arXiv:1402.2237](https://arxiv.org/abs/1402.2237)) -- invariant confluence; cited by DDIA, Kleppmann 2015, and Gotsman et al.
- Lloyd, Freedman, Kaminsky, and Andersen, *Don't Settle for Eventual: Scalable Causal Consistency for Wide-Area Storage with COPS*, SOSP 2011 ([doi:10.1145/2043556.2043593](https://doi.org/10.1145/2043556.2043593)) -- as described by Vitillo.
- Attiya, Ellen, and Morrison, *Limitations of Highly-Available Eventually-Consistent Data Stores*, PODC 2015 ([doi:10.1145/2767386.2767419](https://doi.org/10.1145/2767386.2767419)), and Mahajan, Alvisi, and Dahlin, *Consistency, Availability, and Convergence*, UT Austin technical report, 2011 -- the results that causal consistency is the strongest model whose operations never wait, cited by Kleppmann 2015 and Vitillo.
- Kleppmann, Wiggins, van Hardenberg, and McGranaghan, *Local-First Software: You Own Your Data, in Spite of the Cloud*, Onward! 2019 ([doi:10.1145/3359591.3359737](https://doi.org/10.1145/3359591.3359737)) -- cited by DDIA.

## Library sources


- [Gotsman et al. 2016](/sources/59710f6d9572a0a505cc420ab5f77304.bin), *'Cause I'm Strong Enough* ([doi:10.1145/2837614.2837625](https://doi.org/10.1145/2837614.2837625)) -- sections 2, 4, and 6 on *Synchronizing only the operations that conflict*; section 2 on *Convergence*
- [Vitillo 2021](/sources/ad3d4e8b5cefd65937e33aaa96a1f034.bin), *Understanding Distributed Systems*, second edition -- chapter 11 on *Why avoid coordination*, *Convergence*, *CRDTs*, *Which programs need no coordination: CALM*, and the COPS durability window in *What is given up*
- [Kleppmann and Riccomini 2026](/sources/f639f3efb30ff1f78d5f3bec89441c6e.bin), *Designing Data-Intensive Applications*, second edition -- chapter 6 on *Resolving conflicts*, *Collaborative editing: OT and CRDTs*, and *Local-first software and sync engines*; chapter 10 and chapter 13 on *What is given up*
- [Kleppmann 2015](/sources/163a59f55b2a55b55d2b612b4b906d03.bin), *A Critique of the CAP Theorem* ([arXiv:1509.05393](https://arxiv.org/abs/1509.05393)) -- section 4 on *Why avoid coordination*
- [Burckhardt 2014](/sources/7abc015740f3cc14b1ac9e64ffc75719.bin), *Principles of Eventual Consistency*, excerpt ([doi:10.1561/2500000011](https://doi.org/10.1561/2500000011)) -- chapter 1 on *Why avoid coordination* and *Convergence*
- [DeCandia et al. 2007](/sources/da9436e162d5abe60df8b9ef9e4993ea.bin), *Dynamo: Amazon's Highly Available Key-value Store* -- sections 2.3 and 4.4, and section 6 (reconciliation modes and 6.3 on divergent versions) on *Resolving conflicts*
- Educative 2023: concurrency in collaborative editing, *Grokking Modern System Design Interview* -- *Collaborative editing: OT and CRDTs*
- [Tornow 2025](/sources/70c0d56c1ae98a9f558a6a07dc87c787.bin), *Think Distributed Systems* -- chapter 9 on *Convergence* and the two CRDT variants
- [Petrov 2019](/sources/611239aecf452fc6fb065bb3088b0326.bin), *Database Internals* -- chapter 11 on the CRDT examples in *CRDTs*

Further reading:

- Educative 2023: evaluation of Google Docs' design, *Grokking Modern System Design Interview* -- why the design orders edits through a centralized, replicated operations queue
- [Petrov 2019](/sources/611239aecf452fc6fb065bb3088b0326.bin), *Database Internals* -- chapter 12, anti-entropy: read repair, hinted handoff, Merkle trees, and gossip, the delivery side of state-based replication
