---
draft: false
toc: true
title: "Verifying Distributed Systems"
description: "How to gain confidence that a distributed system is correct: why ordinary tests miss distributed bugs, randomized testing, fault injection and Jepsen checks, deterministic simulation testing, TLA+ model checking, proofs, and how to combine them."
document_status: "draft"
linkTitle: "Verification"
---

Part of [distributed systems]({{< ref "engineering/distributed-systems" >}}).

**Question:** how do you gain confidence that a distributed protocol or system is correct?

A distributed algorithm must keep its properties in every execution its system model allows, and concurrency, message delay, and partial failure make the number of executions enormous. No single technique covers them all. The techniques below form a spectrum by how much of that space they cover: randomized testing samples executions of the real code, deterministic simulation samples far more of them and replays any failure, model checking explores every state of a bounded model of the design, and proof covers every state of the design without a bound. Cost rises roughly along the same line, and the stronger techniques check a model of the design rather than the code that runs.

## Why ordinary tests miss distributed bugs


- **Partial failures are nondeterministic.** DDIA (Kleppmann and Riccomini 2026, chapter 9) names partial failure as the defining trait of distributed systems: some parts break while others work, and an operation involving several nodes may work one time and fail the next. A test that passes once says little about the next run.
- **Tests cover imagined failures.** Vitillo (2021, chapter 29) notes that no test suite can predict every state a distributed application can reach. Tests cover the failures developers can imagine, while a system at scale eventually runs into every possible behavior, including ones where several rare events coincide.
- **Rare in a test, frequent in production.** Will Wilson, cofounder of Antithesis, interviewed by Orosz and Nilsson (2024): a one-in-a-million bug is urgent when a system handles millions of requests, yet a test will probably not reproduce it, because it depends on specific timings, delayed messages, or thread pauses.
- **Realistic tests are flaky.** Vitillo classifies tests by size. A small test runs in one process without I/O and is deterministic; a large test spans several nodes and adds nondeterminism and delay. The tests that exercise distribution are the ones least able to give a repeatable answer, and the test doubles that shrink them behave less like the real dependency.

The bugs that matter live in specific interleavings: a reply that arrives after a timeout fired, a crash between two writes, a partition that heals at the wrong moment. Finding them takes either far more executions than hand-written tests produce, or a way to enumerate executions systematically.

## Randomized testing and fault injection


DDIA groups property-based testing, fuzzing, and deterministic simulation testing as techniques that use randomization to test a system in a wide range of situations, and recommends combining them with theoretical analysis of the algorithm.

- **Property-based testing and fuzzing:** generate many random inputs or operation sequences and check a stated property on each, instead of checking one hand-picked example. Orosz and Nilsson describe fuzzing as feeding a program invalid, unexpected, or random inputs.
- **Fault injection:** inject faults into the running system's environment and observe the result: network failures, machine crashes, disk corruption, paused processes (DDIA). A coordinator decides which faults to run and when, and scripts inject them on each node, for example by killing or pausing a process, unmounting a disk, or changing firewall rules. Tests usually run in an environment that resembles production. Chaos engineering, popularized by Netflix's Chaos Monkey, runs them in production.
- **Jepsen:** a fault injection framework with integrations for several operating systems and prebuilt fault injectors, which DDIA calls remarkably effective at finding critical bugs in widely used systems. It treats the system as a black box: clients run operations against a real cluster while faults are injected, each request and response is recorded with its timing, and a checker decides whether the resulting history is allowed by a consistency model. DDIA (chapter 10) describes the check for linearizability: test whether the recorded operations can be arranged into a valid sequential order, which is possible but computationally expensive. It cites Kingsbury's Knossos checker and Elle (Kingsbury and Alvaro 2020), which infers isolation anomalies from observed histories.

Fault injection exercises the real binaries against real faults. Its weaknesses: tests are cumbersome to write because each kind of fault needs its own tool, and the injector has no fine-grained control over the order of events, so a failure seen once may not recur. Majumdar and Niksic (2017) study why random testing is nonetheless effective for partition-tolerance bugs.

## Deterministic simulation testing


Deterministic simulation testing (DST) runs the real code, not a model, under a simulator that controls every source of nondeterminism. Network communication, I/O, and clocks are replaced with mocks, so the simulator decides the exact order of events, including timings and failures, across a large number of randomized executions (DDIA). Orosz and Nilsson describe it as running software in a single thread with control over time, randomness, and every other variable. When a run fails it can be replayed exactly, because the simulator chose every ordering that led to the failure; in practice those choices derive from a random seed, so the failing seed reproduces the run. Fault injection cannot do this.

DDIA describes three ways to make code deterministic:

| Level | How | Examples in DDIA |
| --- | --- | --- |
| Application | Build the system so that all communication passes through a point where a simulation can be injected. | FoundationDB's Flow library; TigerBeetle, whose state machine performs all mutations in one event loop with mock clocks. |
| Runtime | Swap the asynchronous runtime for a single-threaded deterministic one. | FrostDB patches Go's runtime to run goroutines sequentially; Rust's MadSim provides deterministic versions of Tokio and of S3 and Kafka client libraries. |
| Machine | Make a whole machine deterministic with a hypervisor that answers every nondeterministic call deterministically. | Antithesis, which runs an entire distributed system in containers inside its hypervisor. |

Beyond replay, simulated time runs faster than wall-clock time, so a test can trigger long timeouts without waiting for them (TigerBeetle's time abstraction), and Antithesis branches an execution into several subexecutions when it reaches less common behavior, to explore more paths. Properties are checked with assertions: conditions that must always hold and that stop the run when they fail.

Costs and limits:

- **Every source of nondeterminism must be controlled.** Even after removing concurrency and replacing I/O, clocks, and random number generators, hash-table iteration order and resource limits such as allocation failure or stack overflow can remain nondeterministic (DDIA).
- **It is hard to build.** Orosz and Nilsson note that existing frameworks and libraries cannot be used unchanged. FoundationDB, which Will Wilson helped create, was one of the first systems built for DST; Antithesis made the hypervisor deterministic so that its customers do not have to rebuild their stack.
- **It still takes understanding and upkeep.** Phil Eaton, quoted in the same article, lists the tradeoffs: users must understand their system well enough to instrument and explore it, heavy mocking of third parties limits the value, and frequently changing code reduces it. The authors add that prototypes gain little and that price matters: Polar Signals tried Antithesis and kept an in-house DST.

Some Antithesis customers run short tests on almost every pull request, others run long tests overnight or over weekends, and some use it only to chase a hard bug.

**Tickloom** is a small Java framework, described in the note on [the Tickloom semantic model and scenario DSL]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}), that takes the application-level approach. Every node runs a single-threaded tick loop: each `tick()` advances a logical clock by one and processes pending work in a fixed order (network, message bus, process, storage), and the cluster runs on a simulated network. A scenario DSL on top states the servers, clients, steps, and the faults in effect during each step: partitions, reconnects, message delays measured in ticks, and per-server clock settings. The note's examples reproduce DDIA's non-linearizable quorum read and a last-writer-wins lost update caused by clock skew, each as a short hand-written scenario.

## Specification and model checking


Simulation and fault injection test an implementation. A specification tests the design, before the code exists or alongside it. Vitillo (2021, section 29.4) describes a specification as anything from an informal one-pager to a formal description a computer can check, and recommends specifying only the parts most likely to contain errors that tests cannot easily find, at a deliberately chosen level of abstraction.

TLA+ (the Temporal Logic of Actions), Leslie Lamport's specification language, is the best-known example:

- **State:** an assignment of values to the specification's variables.
- **Behavior:** a sequence of states. The specification of a system is the set of all its possible behaviors.
- **Safety property (invariant):** a condition true in every state of every behavior, such as "no two nodes hold the lease".
- **Liveness property:** something that eventually happens, such as "every request eventually gets a response".
- **Error trace:** when a property fails, the model checker returns the behavior, a sequence of states, that violates it.

DDIA adds that safety must hold in every situation the system model allows, while liveness may be promised only under conditions, such as a majority of nodes staying up and the network eventually recovering. [System models]({{< ref "engineering/distributed-systems/system-models" >}}) covers those assumptions.

Lamport's PlusCal is an algorithm language, closer to pseudocode, that translates into TLA+, and TLC is the model checker usually run on TLA+ specifications. The DynamoDB paper cites Lamport's *Specifying Systems* and the PlusCal paper for its replication-protocol specification.

Vitillo's example is a migration from key-value store X to Y without downtime: dual-write to both while reading from X, backfill Y from X, then switch to Y. A model checker finds that a service instance crashing between the two writes leaves the stores permanently different, a liveness violation of "the stores eventually hold the same data". Making the dual write atomic fixes that but not the next problem: two instances writing concurrently can apply their writes to the two stores in different orders. Serializing writes through a message channel gives one order. Vitillo's point is that a formal model tests architectural decisions that would be hard to check any other way.

DDIA names other specification languages, Gallina (the language of the Coq proof assistant) and FizzBee. It reports that CockroachDB, TiDB, and Kafka use model specifications to find and fix bugs, and that a TLA+ model showed potential data loss in viewstamped replication caused by ambiguity in the algorithm's prose description (Vanlightly 2022).

Limits (DDIA):

- **Bounded, not complete.** Most real algorithms have infinite state spaces, so a model checker checks a reduced model or bounded executions, such as a maximum number of messages. Bugs that need longer executions are not found.
- **The model is not the code.** The checker runs the specification, not the implementation, and the two can drift apart. Checking that they behave the same requires instrumenting the implementation (Ouyang et al. 2025).

## Proof


A proof covers every state, with no bound. DDIA notes that a true verification of all states requires a formal proof, which is possible but typically harder than running a model checker, and that proving an algorithm correct does not mean its implementation behaves correctly. A proof is still a good first step, because it uncovers problems that would otherwise surface only when unusual timing defeats an assumption.

Kleppmann (2022) shows the approach in the Isabelle/HOL proof assistant, which has no built-in notion of distribution:

- **Model:** each process has a step function from its local state and an event (a received message, a user request, or a timeout) to a new state and a set of messages to send. An execution is a list of events.
- **Network:** messages may be lost, reordered, delayed, or received more than once. The only assumption is that a received message was sent in an earlier step.
- **Proof:** a property is shown to be invariant by induction over the list: it holds initially, and every valid step preserves it, so it holds in every reachable state.
- **Cost:** the hard part is designing an invariant that is both true and strong enough to imply the desired property, which has to be done by hand. The post covers safety only; liveness would need fairness assumptions. The worked example is a simple consensus algorithm.

The DynamoDB paper (Elhemali et al. 2022, section 6.1) credits its formally proven Paxos implementation with the confidence to change the protocol, for example by adding log replicas that keep a partition's write quorum available when a replica is unresponsive.

## Proof rules for consistency choices


A narrower kind of proof checks an application rather than a protocol. In a database that lets each operation choose its consistency, the question is whether a given choice is strong enough to preserve an integrity invariant, such as a non-negative account balance. Gotsman, Yang, Ferreira, Najafzadeh, and Shapiro (2016) gave the first proof rule for this.

- **Model:** causal consistency by default. Operations that must not run concurrently acquire tokens, and a conflict relation on tokens says which operations must synchronize. In their bank example, withdrawals conflict with each other and deposits conflict with nothing.
- **Rule:** modular and state-based, using rely-guarantee reasoning. Each token has a guarantee describing every state change an operation holding it may cause, at its origin replica and wherever its effect is applied. The obligations: the invariant holds initially; every guarantee preserves the invariant; and each operation's effect, applied at any replica state reachable from its origin state through non-conflicting changes, stays within its guarantee. Each operation is checked on its own, against states of a single database copy, instead of against all interleavings.
- **Automation:** a prototype tool reduces the obligations to SMT queries discharged by the Z3 solver. The authors verified a banking application, an auction service, and a course registration system, including applications built on CRDTs.
- **Limits:** soundness depends on the model guaranteeing at least causal consistency, and the state-based rule is unsound on weaker models. The tool assumes, rather than checks, that operations commute.

The design question this rule answers is in [choosing consistency per operation]({{< ref "engineering/distributed-systems/guarantees" >}}#choosing-consistency-per-operation).

## In industry


- **DynamoDB** (Elhemali et al. 2022, section 5.4): the team uses formal methods extensively for its replication protocols, citing Newcombe et al. (2015). The core replication protocol is specified in TLA+; features that affect it are added to the specification and model checked, which caught subtle bugs that could have caused durability and correctness problems before the code reached production. Formal methods have also verified the control plane and features such as distributed transactions. Alongside these, DynamoDB runs failure injection and stress testing on every piece of software it deploys; power-off tests that switch off random nodes under realistic simulated traffic and then check that the stored data is valid (section 6); upgrade and downgrade tests that roll a release back on purpose (section 6.4); and continuous verification of data at rest (section 5.3), in which a scrub process checks that all three replicas hold the same data and that a live replica matches one rebuilt from the archived write-ahead log. The paper calls continuous verification the most reliable protection it has found against hardware failures, silent data corruption, and software bugs.
- **S3 and Cosmos DB:** the DynamoDB paper notes that S3 found model checking useful in similar cases, citing Bornholt et al. (2021) on lightweight formal methods for an S3 storage node. Vitillo names S3 and Cosmos DB among the systems Amazon and Microsoft describe in TLA+.
- **Others:** DDIA cites AWS (Brooker and Desai 2024), FoundationDB, and TigerBeetle as organizations that combine these techniques across many products. Orosz and Nilsson report that MongoDB uses Antithesis.

## Comparison


| Technique | What it checks | What it misses | Cost to adopt |
| --- | --- | --- | --- |
| Example-based tests | Expected behavior in chosen scenarios | Interleavings and failures nobody wrote down; multi-node tests are flaky | Low; usually in place |
| Property-based testing and fuzzing | A property over many random inputs or operation sequences | Timing and partial failure, unless the test setup controls them | Low to moderate: properties and generators |
| Fault injection and chaos engineering | The real system under real crashes, partitions, pauses, and disk faults | Failures that need an exact ordering; failing runs are not reproducible | Moderate: environment, injectors, coordinator; risk when run in production |
| Jepsen-style history checking | Client-visible histories against a consistency model, under faults | Internal states; anything the runs did not trigger | Moderate: workload, fault schedule, checker; checking linearizability is expensive |
| Deterministic simulation | The real code across very many controlled interleavings and failures, each replayable | Behavior outside the simulator: mocked third parties, leftover nondeterminism, real networks and disks | High: control every source of nondeterminism, or buy a deterministic hypervisor |
| Model checking (TLA+) | Every state of a bounded model of the design, for invariants and liveness, with error traces | Bugs beyond the bound; implementation bugs; drift between model and code | Moderate: learn the language, write and maintain the specification |
| Proof (Isabelle/HOL) | Every state of the design, without a bound | Implementation bugs; liveness, if only safety is proved | High: invariants designed by hand |
| Consistency proof rule (Gotsman et al.) | That per-operation consistency choices preserve an integrity invariant | Protocol correctness; models weaker than causal; commutativity, which is assumed | Moderate: specify operations, invariant, and tokens; the SMT checks are automatic |
| Continuous verification in production | Divergence and corruption in the running system's data | Bugs that leave all copies consistent but wrong | Moderate: scrub jobs, checksums, rebuilds from logs |

## Choosing an approach


Each technique checks a different artifact, so they combine rather than compete.

1. **Model-check the protocol design.** Specify the parts most likely to hide subtle errors (replication, leader election, commit, membership changes, migrations) and check their invariants and liveness properties within a bound. This is cheapest before the code exists. Prove the design only when the protocol is central and stable enough to repay the effort.
2. **Test the implementation with simulation or fault injection.** Use DST when the architecture can route communication, time, and randomness through a controllable layer, or when a deterministic hypervisor is available. Use fault injection and Jepsen-style history checks otherwise, and on the deployed binaries in any case. Turn the specification's invariants into assertions, so that the tests check the same properties the model did.
3. **Check the running system.** Check recorded histories, inject faults in production with a small blast radius, and verify data at rest continuously, as DynamoDB's scrub does.

Every technique checks against a system model, and DDIA warns that reality breaks models: a node that forgets data it claimed to have stored breaks the quorum condition, and with it a quorum algorithm that is correct in a model where stable storage survives crashes. The third layer exists for the faults the model and the tests assumed away.

## In a design


A design review should ask for a specification when the design introduces or changes a protocol whose correctness depends on ordering or failure timing: a new replication or commit protocol, leader election or leases, a change to quorum membership, a dual write or cross-store migration like Vitillo's example, or any feature that touches the replication protocol, which DynamoDB adds to its TLA+ specification before shipping. The specification states the invariants and liveness properties, and the review checks that they match the requirement recorded in [consistency]({{< ref "system-design/nfr/consistency" >}}). The [control plane]({{< ref "system-design/elements/control-plane" >}}) deserves the same scrutiny as the data plane; DynamoDB verified both.

The failure-handling controls themselves (timeouts, retries, circuit breakers, fallbacks) are checked by making them fire: see [testing the controls]({{< ref "system-design/elements/containing-failure" >}}#testing-the-controls) for fault injection at the network layer and as chaos experiments. When a design lets operations choose different consistency levels, list the integrity invariants and check that each operation's choice preserves them, with the per-operation reasoning of Gotsman et al.

## Related notes


- [System models]({{< ref "engineering/distributed-systems/system-models" >}}): the fault and timing assumptions every check is relative to.
- [Consistency guarantees]({{< ref "engineering/distributed-systems/guarantees" >}}#consistency-models): the models that history checkers test against.
- [Broadcast and consensus]({{< ref "engineering/distributed-systems/broadcast-and-consensus" >}}): the protocols most often specified and model checked.
- [Coordination avoidance]({{< ref "engineering/distributed-systems/coordination-avoidance" >}}): the designs whose invariants a consistency proof rule checks.
- [Time and order]({{< ref "engineering/distributed-systems/time-and-order" >}}): the clocks that simulation replaces and that clock-skew scenarios exercise.
- [Containing failure]({{< ref "system-design/elements/containing-failure" >}}#testing-the-controls): fault injection for timeouts, retries, and fallbacks.
- [Tickloom semantic model and scenario DSL]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}): a deterministic tick-loop framework and fault-scenario DSL for distributed-system code.
- [Reading list]({{< ref "engineering/distributed-systems/reading" >}}#specification-and-verification): TLA+ and verification resources.

## Gaps


- Verified implementations, in which the running code itself is proved (for example IronFleet and Verdi), and proof assistants other than Isabelle, such as Coq and Lean; no source read here covers them.
- Specification languages other than TLA+ (P, Quint, Alloy), and FizzBee beyond its mention in DDIA.
- How Jepsen's checkers (Knossos, Elle) search for a valid order, and what bounds their cost.
- AWS practice in its own words: Newcombe et al. (2015), Brooker and Desai (2024), and Bornholt et al. (2021) are cited here only through DDIA and the DynamoDB paper.
- Checking liveness in simulation, which DDIA cites from TigerBeetle (Kladov 2023) without detail.

## Sources


- Kleppmann, *Verifying distributed systems with Isabelle/HOL*, 2022 (<https://martin.kleppmann.com/2022/10/12/verifying-distributed-systems-isabelle.html>).
- Lamport, [The TLA+ Home Page](https://lamport.azurewebsites.net/tla/tla.html) and [Industrial Use of TLA+](https://lamport.azurewebsites.net/tla/industrial-use.html).
- Lamport, *Specifying Systems*, Addison-Wesley, 2002, and *The PlusCal Algorithm Language*, ICTAC 2009 -- both cited by the DynamoDB paper.
- Gotsman, Yang, Ferreira, Najafzadeh, and Shapiro, *'Cause I'm Strong Enough: Reasoning about Consistency Choices in Distributed Systems*, POPL 2016 ([doi:10.1145/2837614.2837625](https://doi.org/10.1145/2837614.2837625)).
- Newcombe, Rath, Zhang, Munteanu, Brooker, and Deardeuff, *How Amazon Web Services Uses Formal Methods*, Communications of the ACM 58(4), 2015 ([doi:10.1145/2699417](https://doi.org/10.1145/2699417)) -- cited by the DynamoDB paper.
- Brooker and Desai, *Systems Correctness Practices at AWS*, ACM Queue 22(6), 2024 ([doi:10.1145/3712057](https://doi.org/10.1145/3712057)) -- cited by DDIA.
- Bornholt et al., *Using Lightweight Formal Methods to Validate a Key-Value Storage Node in Amazon S3*, SOSP 2021 -- cited by the DynamoDB paper.
- Kingsbury and Alvaro, *Elle: Inferring Isolation Anomalies from Experimental Observations*, PVLDB 14(3), 2020 ([doi:10.14778/3430915.3430918](https://doi.org/10.14778/3430915.3430918)).
- Majumdar and Niksic, *Why Is Random Testing Effective for Partition Tolerance Bugs?*, PACMPL 2(POPL), 2017 ([doi:10.1145/3158134](https://doi.org/10.1145/3158134)).
- Ouyang et al., *Multi-Grained Specifications for Distributed System Model Checking and Verification*, EuroSys 2025 ([doi:10.1145/3689031.3696069](https://doi.org/10.1145/3689031.3696069)).
- Vanlightly, *VR Revisited* blog series on viewstamped replication, 2022 -- cited by DDIA.
- [Jepsen](https://jepsen.io/) and [Tickloom](https://github.com/unmeshjoshi/tickloom).

## Library sources


- [Kleppmann and Riccomini 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, Second Edition* -- chapter 9 ("Faults and Partial Failures", "System Model and Reality", "Formal Methods and Randomized Testing") on *Why ordinary tests miss distributed bugs*, *Randomized testing and fault injection*, *Deterministic simulation testing*, *Specification and model checking*, *Proof*, and *Choosing an approach*; chapter 10 ("What Makes a System Linearizable?") on history checking
- [Vitillo 2021](/sources/system-design/distributed-systems/vitillo-2021-understanding-distributed-systems.pdf.enc), *Understanding Distributed Systems, Second Edition* -- chapter 29, sections 29.2 on test size and 29.4 on formal verification, for *Why ordinary tests miss distributed bugs* and *Specification and model checking*
- [Orosz and Nilsson 2024](/sources/system-design/distributed-systems/orosz-2024-debugging-distributed-systems-antithesis.pdf.enc), *How to debug large, distributed systems: Antithesis* -- on *Deterministic simulation testing* and why distributed bugs resist tests
- [Elhemali et al. 2022](/sources/system-design/data-systems/dynamodb-book-course/atc22-elhemali.pdf.enc), *Amazon DynamoDB: A Scalable, Predictably Performant, and Fully Managed NoSQL Database Service*, USENIX ATC 2022 -- sections 5.3, 5.4, 6, 6.1, and 6.4 on *In industry* and *Proof*
- [Gotsman et al. 2016](/sources/system-design/distributed-systems/gotsman-2016-cause-im-strong-enough-consistency-choices.pdf.enc), *'Cause I'm Strong Enough* ([doi:10.1145/2837614.2837625](https://doi.org/10.1145/2837614.2837625)) -- on *Proof rules for consistency choices*

Further reading:

- [Tornow 2025](/sources/system-design/distributed-systems/tornow-2025-think-distributed-systems.pdf.enc), *Think Distributed Systems* -- chapter 1 uses Lamport's TLA+ course to contrast two models of distributed commit, one that ignores message exchange and one that can represent lost, duplicated, or reordered messages
