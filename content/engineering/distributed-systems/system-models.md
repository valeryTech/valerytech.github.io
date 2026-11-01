---
draft: false
toc: true
title: "System Models and Failures"
description: "What can go wrong in a distributed system and what an algorithm assumes about it: partial failure, node, link and timing models, safety and liveness, failure detectors, gray failure, and how to state fault assumptions in a design."
document_status: "draft"
linkTitle: "System Models"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** what can go wrong in a distributed system, and what does an algorithm assume about it?

An algorithm is correct only relative to a system model: a stated set of assumptions about how nodes fail, what links do to messages, and how long things take. The same algorithm can be correct under one model and broken under another, so the model is part of the design, not a footnote. Cachin, Guerraoui, and Rodrigues (2011) define a system model as the combination of a process abstraction, a link abstraction, and optionally a failure detector; the sections below take each in turn.

## Partial failure


A single computer is built to be either working or broken. A distributed system is not: some parts fail while others keep running and appear correct. Kleppmann and Riccomini (DDIA) and van Steen and Tanenbaum both name this partial failure as the defining property of distributed systems. Partial failures are nondeterministic, and a node may not even know whether its own request succeeded.

When a request gets no response, DDIA lists what may have happened: the request was lost or is still queued; the remote node crashed, or is paused (for example, by garbage collection) and will resume; or it processed the request and the response was lost or delayed. The sender cannot tell which.

A timeout is the usual response, but it only ends the waiting. When it fires, the sender still does not know whether the request took effect, and a queued request may still be delivered after the sender gave up. Acknowledgments do not close the gap. In the two generals problem (Gray 1978, as DDIA cites it), two parties that communicate only by messages that may be lost can never be sure they agree: each acknowledgment needs its own acknowledgment, so the last messenger's fate is always unknown (Petrov 2019).

## Node failure models


A process fails when it stops behaving according to its algorithm. Models differ in what a faulty process may do, and therefore in what the algorithm may assume about the faulty ones.

| Model | A faulty node may | An algorithm may assume |
| --- | --- | --- |
| Crash-stop (fail-stop) | Stop at any moment and never take another step. | A node that stopped stays silent; the algorithm never needs it back. |
| Omission | Fail to send or receive some messages it should, for example after a buffer overflow. | Messages it does send are correct. |
| Crash-recovery | Crash and restart, losing in-memory state. | Stable storage survives the crash, and a node that eventually stays up counts as correct. |
| Degraded (gray failure, limping node) | Keep answering health checks while too slow to do useful work, or lose one function, such as a background thread, while the rest runs. | Little; most algorithms treat such a node as alive. See [gray failure](#gray-failure). |
| Byzantine (arbitrary) | Do anything: send wrong, forged, or contradictory messages, by bug or by malice. | Nothing about faulty nodes. Correct nodes follow the protocol, and cryptography is not broken. |

Points that matter when choosing among them:

- **Crash-stop does not forbid restarts.** It only means the algorithm does not rely on a crashed node coming back. A restarted node can rejoin a later instance of the algorithm. Giving it a new identity does not turn the model into crash-recovery, because the set of processes is fixed and known in advance (Cachin et al.; Petrov).
- **Crash-recovery's cost is amnesia.** A node that forgets what it sent before a crash can contradict itself after restart, so it writes what it must remember to stable storage before acting on it. Each such write is a disk access, and minimizing them is a central design concern in this model (Cachin et al.). The model also assumes the disk survives. DDIA points out that a corrupted or wiped disk, or a node that fails to find its drives after reboot, breaks quorum algorithms, which rely on nodes remembering what they acknowledged.
- **"Omission" varies by author.** Cachin et al. mean a process that does not send or receive messages it should. Van Steen and Tanenbaum split it into send omission (the server did the work but the reply was not sent, so it must expect the client to retry) and receive omission. Petrov treats network partitions and slow nodes as omissions. Tornow (2025) defines it as a component that pauses for an arbitrary time and resumes with its state intact. Van Steen and Tanenbaum also list timing failures (a response outside its time interval, usually too late) and response failures (a wrong value or a wrong state transition).
- **Byzantine tolerance rarely pays in a datacenter.** DDIA argues that nodes under one organization's control can be trusted, that the protocols are expensive, and that they do not help against a bug present on every node unless each node runs an independent implementation. An attacker who compromises one node running the same software can usually compromise all of them. Byzantine models fit aerospace hardware, cryptocurrencies, and peer-to-peer systems with no central authority. DDIA recommends guarding against weak forms of lying instead: application-level checksums, input validation, and several NTP servers so that one bad clock is outvoted.

### How many replicas


A resilience bound states that at most f of N processes are faulty. Cachin et al. stress that this is a claim about the execution, not the hardware: more than f must be unlikely to fail during the algorithm's lifetime, and the engineer must make that plausible. The required N depends on the fault model and on whether replicas must agree.

| Fault model | Mechanism | Replicas to tolerate f faults | Why |
| --- | --- | --- | --- |
| Crash or fail-silent, no agreement | Client uses any answer | f + 1 | One survivor can answer (van Steen and Tanenbaum). |
| Arbitrary, no agreement | Client votes on answers | 2f + 1 | The f + 1 correct answers outvote f wrong ones (van Steen and Tanenbaum). |
| Crash, agreement | Majority quorums | 2f + 1 | Any two majorities intersect, and with f < N/2 crashed a majority of live nodes still exists (Cachin et al.). Three nodes tolerate one fault, five tolerate two (DDIA). |
| Byzantine, agreement | Byzantine quorums of more than (N + f)/2 | 3f + 1 | Two such quorums share a correct process, and progress needs a quorum of correct processes: N − f > (N + f)/2, so N > 3f (Cachin et al.). |

The other books agree on the Byzantine bound: DDIA requires more than two-thirds of the nodes to function correctly, van Steen and Tanenbaum require 3k + 1 members to tolerate k faults, and Vitillo (2021) puts the limit at a third of the processes. Beyond f faults, van Steen and Tanenbaum's verdict is that all bets are off.

## Link models


Cachin et al. build reliable links in layers on top of a weak one. Each layer adds one mechanism.

| Link | Guarantees | Built from |
| --- | --- | --- |
| Fair-loss | If a correct sender keeps resending a message to a correct receiver, it is delivered infinitely often. A message sent finitely often is not delivered infinitely often, and no message is invented. | The network itself; UDP behaves like this (Petrov). |
| Stubborn | A message sent once is delivered infinitely often. | Fair-loss plus retransmitting every message on a timer. |
| Perfect (reliable) | A message from a correct sender to a correct receiver is delivered exactly once; nothing is invented. | Stubborn plus a set of delivered messages to drop duplicates. |
| Logged perfect | As perfect, for crash-recovery. Delivery means writing to a log in stable storage, and delivery is guaranteed only if the sender never crashes. | Stubborn plus a delivered set kept in stable storage. |
| Authenticated perfect | As perfect, and a message that claims to come from a correct process really does. | Stubborn plus a MAC on each message, for Byzantine settings. |
| Partitionable (Kleppmann 2015) | No duplication and no creation, nothing else: links may drop infinitely many messages and delay any message without bound. | Defined to make the CAP proof precise. |

What the layers mean in practice:

- **Retries plus deduplication turn loss into delay.** Retransmission makes delivery eventual; deduplication makes it single. Cachin et al. add acknowledgments to stop retransmitting, and note that the delivered set grows without bound unless timestamps let the receiver recognize old messages.
- **TCP is a perfect link for one connection only.** Its deduplication and retransmission do not survive a reconnect, so an application that reconnects and resends can deliver duplicates. An acknowledgment from the remote kernel does not mean the application processed the data; only an application-level response does (DDIA). Exactly-once delivery is not available; exactly-once processing is. Real systems send at least once and have the receiver ignore duplicates, or make the operation idempotent (Petrov). Cachin et al. make the layering point: if the application already records which messages it processed, it can deduplicate itself over stubborn links instead of paying for the same mechanism at two layers.
- **Fair-loss is a good model of real networks.** Kleppmann (2015) argues that faults occur unpredictably, messages are lost while a fault lasts, and the fault heals after seconds or hours, with no adversary dropping messages forever. A partition of finite duration is allowed under fair-loss links, so an algorithm correct in that model tolerates it. Gilbert and Lynch's CAP proof needs partitions that never heal, which the partitionable model allows and fair-loss does not; see [what CAP proves]({{< ref "engineering/distributed-systems/guarantees" >}}#what-cap-proves).
- **Links fail in one direction, and connectivity is not transitive.** DDIA describes a node that receives everything while its outgoing messages are dropped, a network interface that drops inbound packets but sends outbound ones, and A reaching B and B reaching C while A cannot reach C. A failure detector that trusts one node's view misjudges these cases; see [who decides](#failure-detection) below.

## Timing models


| Model | Assumes | Allows | Limitation |
| --- | --- | --- | --- |
| Synchronous | Known upper bounds on message delay, processing time, and clock drift (Cachin et al.); DDIA includes process pauses. | Exact crash detection by timeout, leases, worst-case response times, synchronized clocks. | Unbounded delays and pauses do occur (DDIA). Bounds set to the worst case make every timeout, and so every algorithm, slow (Cachin et al.). |
| Partially synchronous | The bounds hold most of the time but are sometimes exceeded; formally, they hold from some unknown point on (Dwork, Lynch, and Stockmeyer 1988; Cachin et al.). | Timeouts that are sometimes wrong. Consensus is solvable. | Algorithms must tolerate false suspicion. |
| Asynchronous | No timing assumptions. DDIA's version has no clock and so no timeouts. Tornow notes a second version in which each node has a local clock with unknown drift and can time out, as in Kleppmann's partitionable model; check which one a result assumes. | Algorithms that never wait on time, and logical clocks. | Fischer, Lynch, and Paterson (1985) proved that no deterministic algorithm always reaches consensus if even one process can crash. Timeouts with occasionally wrong suspicions, or random numbers, make it solvable (DDIA). |

**Partial synchrony is the practical model.** Cachin et al. describe why: networks and processes are well behaved most of the time, but overload, memory pressure, and buffer overflows produce periods with no useful bound. The model does not claim the system becomes synchronous forever, only that periods of synchrony happen and some last long enough for an algorithm to finish. DDIA, Vitillo, Tornow, and van Steen and Tanenbaum all call it the realistic model, and the first three combine it with crash-recovery nodes. The design rule that follows (Tornow; DDIA): keep safety in every execution, including asynchronous periods, and promise liveness only while the system behaves synchronously. Raft is an example. Timeouts drive leader election, so during asynchrony two nodes can believe they are leader; Raft resolves this by making the lagging one accept the other (Petrov), and its safety does not depend on the timeouts being right. Timing assumptions also cover clocks, which [time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}) treats.

## Safety and liveness


Alpern and Schneider (1985), as Cachin et al. and DDIA cite them, separate two kinds of property:

- **Safety:** something bad never happens. A violation happens at an identifiable point, and nothing afterward can undo it. Formally, a violating execution has a finite prefix that every continuation also violates.
- **Liveness:** something good eventually happens. At any point there is still hope it will hold later, so showing a violation takes an infinite execution in which it never does. Definitions often contain the word "eventually".

Any property of an execution can be written as the combination of a safety property and a liveness property (Alpern and Schneider, per Cachin et al.). A specification with only one kind is usually flawed: doing nothing is always safe.

| Property | Kind |
| --- | --- |
| No two requests for a fencing token get the same value; tokens increase (DDIA) | Safety |
| A node that requests a token and does not crash eventually gets one (DDIA) | Liveness |
| A link delivers no message that was not sent and none twice (Cachin et al.) | Safety |
| A failure detector suspects only crashed processes: accuracy (Petrov) | Safety |
| A failure detector eventually suspects every crashed process: completeness (Petrov) | Liveness |
| Replicas eventually converge: eventual consistency (DDIA) | Liveness |

The distinction is what lets an algorithm be correct in a hostile model. DDIA: safety must hold in every situation the model allows, even if every node crashes or the whole network fails; liveness may carry conditions, such as a majority of nodes being up and the network eventually recovering. Tornow classifies how a system behaves while a failure lasts:

| | Live | Not live |
| --- | --- | --- |
| **Safe** | Masking: the failure is hidden. | Fail-safe: the system stops rather than err, as a queue that halts delivery instead of reordering. |
| **Not safe** | Nonmasking: the system keeps going and may err, as a queue that delivers out of order during the failure. | Not failure tolerant. |

## Failure detection


There are two ways to watch a node: probe it ("are you alive?", a ping) and expect a reply within a deadline, or have it send periodic heartbeats and suspect it when one is late (Vitillo; Petrov; van Steen and Tanenbaum). Either way, the witness of a crash is a timeout (Tornow). Vitillo notes that this pays off for nodes that interact often and need to react quickly; elsewhere, detecting failure when a call times out is enough. Sometimes faster signals exist, such as a TCP reset from a host whose process died, but they cannot be relied on (DDIA).

**Choosing the timeout.** If the network delivered every packet within d and a live node answered within r, then 2d + r would be an exact timeout; real networks and servers give neither bound (DDIA). Too short a timeout declares live nodes dead; too long a timeout leaves users waiting on dead ones. A premature declaration does harm: a node still running an action may run it twice once another node takes over, and moving an overloaded node's work onto others can cascade until nodes declare each other dead. DDIA recommends measuring the round-trip distribution over time and many machines, or adapting the timeout to observed jitter, as TCP's retransmission timeout does.

**Detector properties.** Chandra and Toueg (1996) observed that algorithms use timing assumptions mainly to detect crashes, so the timing model can be packaged as a failure detector with stated properties instead of bounds on every step (Cachin et al.). Completeness means every crashed process is eventually suspected; accuracy means no live process is suspected. Tornow restates them as no false negatives and no false positives, and notes that in a partially synchronous or asynchronous system over an unreliable network, no detector has both.

| Detector | Properties | Needs | Algorithm (Cachin et al.) |
| --- | --- | --- | --- |
| Perfect (P) | Strong completeness and strong accuracy; a detection is never revised. | Synchrony | Heartbeat with a timeout of at least the worst-case processing time plus twice the worst-case message delay. |
| Eventually perfect (◇P) | Strong completeness; accuracy only after an unknown time, so suspicions may be withdrawn. | Partial synchrony | Increasing timeout: when a suspected process turns out alive, stop suspecting it and lengthen its timeout. |
| Eventual leader detector (Ω) | Eventually every correct process trusts the same correct leader. | Partial synchrony; also defined for crash-recovery | Used inside consensus; leaders may change arbitrarily before that point. |

Because ◇P is allowed to be wrong, its timeout can start short and react faster than P. Consensus is solvable with it (Cachin et al.), and Petrov summarizes Chandra and Toueg's result as consensus being possible even with a detector that makes infinitely many mistakes. For Byzantine processes there is no algorithm-independent failure detector: a malicious node can answer heartbeats perfectly while subverting the protocol (Cachin et al.).

Practical detectors refine the plain timeout:

- **Accrual (phi) detector:** Hayashibara et al. (2004) replace up-or-down with a suspicion level φ. The detector keeps a sliding window of heartbeat arrival times, assumes they are normally distributed, estimates mean and variance, and computes how unlikely the current silence is; the node is marked down when φ crosses a threshold. It separates monitoring, interpretation, and action, and adapts to network conditions. Cassandra and Akka use it (Petrov; DDIA).
- **Indirect probes (SWIM):** when P2 does not answer P1's ping, P1 asks a few random members to ping P2 and relay the acknowledgment. A broken link between P1 and P2 then does not condemn P2, and no node needs to know the whole membership (Petrov). Van Steen and Tanenbaum describe the same idea as a way to separate network failures from node failures.
- **Gossip-style detection:** van Renesse, Minsky, and Hayden (1998). Each member keeps a heartbeat counter for every member and the local time it last increased. Periodically a member increments its own counter and sends the table to a random neighbor, which merges it. A member whose counter stops increasing for long enough is declared failed. Heartbeats route around a single broken link, so the detector catches crashed nodes and nodes no member can reach, without condemning a node over one bad link (Petrov). Van Steen and Tanenbaum describe gossiped availability the same way.

**Who decides.** A node cannot trust its own judgment: a node with an asymmetric link fault is declared dead while working, and a node paused for a minute resumes unaware that it was declared dead. DDIA's answer is to let a quorum decide, and have the declared node step down. Because the "dead" node may still act, its later writes must be rejected, for example with fencing tokens; see [time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}) and [broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}).

## Gray failure


DDIA lists degraded performance and partial functionality next to the classic node models. A limping node, also called gray failure or fail-slow, may still answer health checks while being too slow to do real work. Its examples: a gigabit network interface that drops to 1 Kb/s from a driver bug, a process under memory pressure spending most of its time in garbage collection, worn-out SSDs, and hardware affected by heat, loose connectors, vibration, or firmware bugs. A related case is a process whose background thread has crashed or deadlocked while the rest keeps serving. DDIA judges these harder to handle than a clean crash. Vitillo calls slow network calls the silent killers of distributed systems: a gray failure cannot be detected quickly or accurately, and it can bring a whole system down.

An active health check queries a dedicated endpoint. Vitillo notes that the simplest handler always returns 200, relying on the check itself timing out when the server is degraded; DDIA's limping node is the case where the check still answers in time while real requests do not. A handler can instead compare local metrics such as CPU, memory, or concurrent requests against thresholds, which catches some degradation but still measures the node rather than the requests users send. Vitillo's mitigations:

- **Passive checks:** the load balancer removes a server whose real requests time out or return errors such as 503.
- **Fail open:** a misconfigured threshold or a bug in the check can fail every server at once. A load balancer that sees a large fraction of servers unhealthy should treat the checks as unreliable and keep routing.
- **Watchdog:** a background thread restarts a server whose monitored metric, such as free memory under a slow leak, breaches a threshold for some time. The watchdog itself must be tested, or a bug restarts servers in a loop.

## Named models compared


Cachin et al. combine the three abstractions into named models. Van Steen and Tanenbaum use the same names for how reliably process P can detect that Q has halted, and add fail-safe: arbitrary failures that are benign.

| Model | Nodes | Links | Failure detector | Timing it encodes | What it permits |
| --- | --- | --- | --- | --- | --- |
| Fail-stop | Crash-stop | Perfect | Perfect (P) | Synchronous | The simplest algorithms; crashes are detected exactly. |
| Fail-noisy | Crash-stop | Perfect | Eventually perfect (◇P) or Ω | Partially synchronous | Consensus, with detection that is eventually accurate. |
| Fail-silent | Crash-stop | Perfect | None | Asynchronous | No information about crashes; no deterministic consensus (FLP). A linearizable register with a majority correct is still possible: Kleppmann (2015) cites the ABD algorithm for asynchronous networks with fair-loss links. |
| Fail-recovery | Crash-recovery | Stubborn | Ω | Partially synchronous | Restarts with amnesia, handled through stable storage. |
| Fail-arbitrary | Byzantine | Authenticated perfect | None (with a Byzantine leader detector: fail-noisy-arbitrary) | Asynchronous, or partially synchronous with the detector | Untrusted participants, usually at the cost of 3f + 1 replicas and cryptography. |
| Randomized | Any of the above | Any | Any | Orthogonal | Probabilistic algorithms; randomization is sometimes the only way to solve a problem. |

The model the practitioner books assume sits between fail-noisy and fail-recovery: crash-recovery nodes, fair-loss links made reliable by retries and deduplication, and partial synchrony (Vitillo; DDIA; Tornow, who also allows omission). Byzantine faults are excluded.

## Stating assumptions


Kleppmann (2015, section 4.5) proposes terminology that replaces "highly available" and "partition tolerant" with statements a reader can check. Earlier in the paper he argues that partition tolerance describes the system model, not the algorithm: say that an algorithm "assumes that partitions may occur", not that it "provides partition tolerance". An algorithm that assumes no partitions and meets one may violate its guarantees in arbitrary ways, including failing to respond after the partition heals or deleting data (Kleppmann 2015; DDIA). For each stateful component, write down:

- **Fault types tolerated:** the node model (crash-stop or crash-recovery, and what is durable before an acknowledgment), whether slow nodes are treated as failed, and whether Byzantine faults are excluded, with any checksums or validation that guard against weak lying.
- **How many:** the largest fault tolerated, in Kleppmann's form: "the algorithm can tolerate up to a minority of replicas crashing or disconnecting", or f of N with the quorum used.
- **Network faults:** Kleppmann's term covers packet loss, transient and long-lasting, and unusually large delay; partitions are one case, and a design should plan for all of them. As long as lost packets and failed requests are retried, they can be modeled as delay. Say where duplicates are removed.
- **Timing assumed:** usually partial synchrony. Say which properties depend on timing. If only liveness does, delays cost availability; if safety does, as with leases or clock bounds, a long pause can break correctness, and the bound belongs in the assumptions.
- **What happens beyond the limit:** Kleppmann's examples are that all requests return an error, or that a consistency property is violated: fail-safe or nonmasking in Tornow's terms. Cachin et al. ask the same of an algorithm: which properties survive when more than f processes crash, and which can be violated. DDIA adds that an implementation still needs code for the case its model rules out, even if that code only stops and calls an operator: the model limits what must be tolerated, not what can happen.
- **Availability as measured:** Kleppmann defines it as an empirical metric, the share of requests that return a non-error response within a latency bound, not a property of the algorithm. Whether an operation can meet that bound during a network fault depends on its [delay sensitivity]({{< ref "engineering/distributed-systems/guarantees" >}}#delay-sensitivity).

## In a design


The caller-side controls in [containing failure]({{< ref "system-design/elements/containing-failure" >}}) are these models applied to one call. A timeout is a failure detector with false positives, and its value is the timing assumption. A retry turns a fair-loss link into a stubborn one, so the receiver must deduplicate, which is the [idempotent consumer]({{< ref "system-design/elements/communication" >}}#idempotent-consumer). A circuit breaker or health check acts on a suspicion, not on knowledge, and gray failure is the case where that suspicion never forms. Use [fault injection]({{< ref "system-design/elements/containing-failure" >}}#testing-the-controls) to exercise the faults the model claims to tolerate: delay, loss, and crashed or slow replicas.

The options in [coordination]({{< ref "system-design/elements/data-at-scale" >}}#coordination) each rest on a model. The consensus algorithms behind coordination services (Raft, Paxos, Zab) assume a non-Byzantine model in which messages may be delayed or dropped and nodes may crash, restart, and disconnect (DDIA). With majority quorums, 2f + 1 nodes tolerate f failures; the cluster stays safe under any delay and stops making progress when no majority can communicate. Leases need fencing tokens because the model allows a paused node to return and act on an expired lease.

A system design should state its fault assumptions next to its consistency requirements ([consistency]({{< ref "system-design/nfr/consistency" >}})), using the list in [stating assumptions](#stating-assumptions): node model and durability, f of N, network faults and where duplicates are removed, timing and which properties depend on it, and behavior beyond the limit. For each assumption, name the mechanism that makes it plausible: replicas in separate failure domains for f, fsync before acknowledgment for crash-recovery, measured round-trip times for timeouts.

## Related notes


- [Guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}): what consistency models promise, and how [CAP]({{< ref "engineering/distributed-systems/guarantees" >}}#cap-and-pacelc) depends on the partition assumption.
- [Time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}): clocks, leases, and process pauses, the timing assumptions about clocks.
- [Broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}): FLP, quorums, and consensus under fail-noisy and fail-recovery models.
- [Replication]({{< ref "engineering/distributed-systems/replication" >}}): failover, which depends on failure detection.
- [Verification]({{< ref "engineering/distributed-systems/verification" >}}): checking a protocol against its model, and testing what the model leaves out.
- [Containing failure]({{< ref "system-design/elements/containing-failure" >}}): timeouts, retries, and circuit breakers as caller-side failure handling.

## Gaps


- The gray failure paper itself (Huang et al. 2017) and the fail-slow study (Gunawi et al. 2018), which DDIA and Vitillo cite, have not been read.
- Failure detectors for the crash-recovery model (Aguilera, Chen, and Toueg 2000) and indulgent algorithms (Guerraoui 2000), both named in Cachin et al.'s chapter notes.
- Storage fault models: DDIA's suggestion of a model in which stable storage mostly survives crashes but sometimes does not.
- Empirical studies of network faults, such as Bailis and Kingsbury's *The Network Is Reliable*, cited by DDIA and Kleppmann.

## Sources


- Kleppmann, *A Critique of the CAP Theorem*, 2015 ([arXiv:1509.05393](https://arxiv.org/abs/1509.05393)).
- Alpern and Schneider, *Defining Liveness*, Information Processing Letters 21(4), 1985 ([doi:10.1016/0020-0190(85)90056-0](https://doi.org/10.1016/0020-0190(85)90056-0)) -- cited via Cachin et al. and DDIA.
- Dwork, Lynch, and Stockmeyer, *Consensus in the Presence of Partial Synchrony*, Journal of the ACM 35(2), 1988 ([doi:10.1145/42282.42283](https://doi.org/10.1145/42282.42283)) -- cited via DDIA and Cachin et al.
- Fischer, Lynch, and Paterson, *Impossibility of Distributed Consensus with One Faulty Process*, Journal of the ACM 32(2), 1985 ([doi:10.1145/3149.214121](https://doi.org/10.1145/3149.214121)) -- cited via DDIA, Petrov, and Cachin et al.
- Chandra and Toueg, *Unreliable Failure Detectors for Reliable Distributed Systems*, Journal of the ACM 43(2), 1996 ([doi:10.1145/226643.226647](https://doi.org/10.1145/226643.226647)) -- cited via Tornow, Petrov, and Cachin et al.
- Lamport, Shostak, and Pease, *The Byzantine Generals Problem*, TOPLAS 4(3), 1982 ([doi:10.1145/357172.357176](https://doi.org/10.1145/357172.357176)) -- cited via DDIA and Vitillo.
- Hayashibara, Défago, Yared, and Katayama, *The φ Accrual Failure Detector*, SRDS 2004 ([doi:10.1109/RELDIS.2004.1353004](https://doi.org/10.1109/RELDIS.2004.1353004)) -- cited via Petrov and DDIA.
- van Renesse, Minsky, and Hayden, *A Gossip-Style Failure Detection Service*, Middleware 1998 -- cited via Petrov.
- Huang et al., *Gray Failure: The Achilles' Heel of Cloud-Scale Systems*, HotOS 2017 ([doi:10.1145/3102980.3103005](https://doi.org/10.1145/3102980.3103005)) -- cited via DDIA and Vitillo.

## Library sources


- [Cachin et al. 2011](/sources/system-design/distributed-systems/cachin-2011-reliable-and-secure-distributed-programming.pdf.enc), *Introduction to Reliable and Secure Distributed Programming*, second edition ([doi:10.1007/978-3-642-15260-3](https://doi.org/10.1007/978-3-642-15260-3)) -- chapter 2 on *Node failure models*, *How many replicas*, *Link models*, *Timing models*, *Safety and liveness*, the detector table in *Failure detection*, and *Named models compared*
- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 9 on *Partial failure*, Byzantine faults, timeouts and *Failure detection*, *Gray failure*, *Timing models*, and *Safety and liveness* ("System Model and Reality"); chapter 10 on FLP and the model consensus algorithms assume
- [Kleppmann 2015](/sources/system-design/distributed-systems/kleppmann-2015-critique-of-the-cap-theorem.pdf.enc), *A Critique of the CAP Theorem* ([arXiv:1509.05393](https://arxiv.org/abs/1509.05393)) -- fair-loss and partitionable links in *Link models*; section 4.5 on *Stating assumptions*
- [Petrov 2019](/sources/system-design/data-systems/petrov-2019-database-internals.pdf.enc), *Database Internals* -- chapter 8 on links, the two generals problem, FLP, and failure models; chapter 9 on *Failure detection* (phi accrual, SWIM, gossip)
- [Vitillo 2021](/sources/system-design/distributed-systems/vitillo-2021-understanding-distributed-systems.pdf.enc), *Understanding Distributed Systems, Second Edition* -- chapter 6 on system models; chapter 7 on *Failure detection*; chapter 18 on health checks and chapter 24 on gray failure in *Gray failure*
- [Tornow 2025](/sources/system-design/distributed-systems/tornow-2025-think-distributed-systems.pdf.enc), *Think Distributed Systems* -- chapter 2 on *Timing models* and node and network failures; chapter 3 on failure tolerance classes in *Safety and liveness* and failure detection
- [van Steen and Tanenbaum 2023](/sources/system-design/distributed-systems/vansteen-2023-distributed-systems-4th-edition.pdf.enc), *Distributed Systems*, fourth edition -- chapter 8 (sections 8.1 and 8.2) on failure models, *How many replicas*, and failure detection

Further reading:

- Educative 2023: The Spectrum of Failure Models -- a short ordering of fail-stop, crash, omission, temporal, and Byzantine failures by difficulty, separating a detectable fail-stop from a silent crash
