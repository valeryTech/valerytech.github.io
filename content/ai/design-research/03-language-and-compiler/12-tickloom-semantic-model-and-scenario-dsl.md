---
draft: false
toc: true
description: "A captured Tickloom case study shows how compute, network, storage, and clock abstractions ground generated quorum-store code and a constrained Java DSL for reproducible failure scenarios."
title: "12 Tickloom Semantic Model And Scenario Dsl"
linkTitle: "12 Tickloom Semantic Model And Scenario Dsl"
---
# Tickloom semantic model and scenario DSL


<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

The following passages come from the captured article ["DSLs Enable Reliable Use of LLMs"]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}). They were moved unchanged from [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) and [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}), in the article's original order. New explanations and open questions are in the sibling [comments note]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl-comments" >}}).

## Semantic model and quorum-store example


The article's preceding [presentation example]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}#example-using-llms-to-generate-diagram-rich-powerpoint-presentations) remains in the reliability note.

## Building the Semantic Model


The example we covered in the previous section was straightforward. The YAML was used as a carrier syntax, and I process its parsed syntax tree directly, effectively using the syntax tree itself as my [Semantic Model](https://martinfowler.com/dslCatalog/semanticModel.html) (though this couples the syntax to the execution semantics). But in more complex domains, like distributed systems, we need more complex semantic models to represent the concepts in the domain and the design decisions we have made in the codebase. Let's look at an example based on a small framework I built to quickly build and test distributed systems.

## Example: Tickloom -- a semantic model for distributed systems


Implementing distributed systems such as quorum-based key-value stores or consensus protocols like Raft and Paxos is a daunting task. Even if implementation is guided incrementally through prompts, specifications, or carefully constructed.md skill files, the asynchronous runtimes still expose an overwhelming space of possible implementation decisions. Threading models, networking patterns, storage coordination, retry behavior, and timing semantics all remain entangled within the generated code. The problem is not merely code generation complexity, but verification complexity. The resulting state space created by all possible interleavings across thread scheduling, network delays, process pauses, and clock skew becomes so large that systematically reviewing and validating correctness across all interacting behaviors is nearly impossible. This is the reason we see that [Jepsen](https://jepsen.io/) tests find bugs even in the most battle-tested distributed systems.

This is exactly where a semantic model is beneficial. [Tickloom](https://github.com/unmeshjoshi/tickloom) is a small framework I built to construct and test distributed algorithms. Its abstractions are not a generic runtime; they are a set of design decisions about how a distributed process behaves. Every node runs in a *single-threaded tick loop*: each call to `tick()` advances a logical clock by one and processes pending work in a fixed, deterministic order (network, then message bus, then process, then storage). Time is measured in ticks, not milliseconds. Messages are plain Java records. Coordination across replicas is expressed through a `         Replica` base class that already knows about peers, broadcasts, and quorums.

Threading, timing, network delivery are no longer open questions to be re-decided in every prompt. What remains for the algorithm author is the actual protocol logic. A quorum replica, for instance, is just a set of message handlers expressed in the framework's vocabulary.

Because the framework supplies the vocabulary -- `Replica`, `quorumRequest`, `countResponseIf`, `MessageType`, `Handler` -- a prompt can stay at the level of the protocol rather than the plumbing:

Using the Tickloom Replica abstraction, implement a quorum-based key-value store. A client GET should collect values from a majority and return the one with the highest timestamp (last-writer-wins). Apply a write locally only if its timestamp is newer than the stored one.

This high level description produces code like following:

```
@Override
protected Map<MessageType, Handler> initialiseHandlers() {
    return Map.of(
            LWWMessageType.CLIENT_SET_REQUEST, this::handleClientSetRequest,
            LWWMessageType.CLIENT_GET_REQUEST, this::handleClientGetRequest,
            LWWMessageType.INTERNAL_SET_REQUEST, this::handleInternalSetRequest,
            LWWMessageType.INTERNAL_GET_REQUEST, this::handleInternalGetRequest,
            LWWMessageType.INTERNAL_SET_RESPONSE, this::handleInternalSetResponse,
            LWWMessageType.INTERNAL_GET_RESPONSE, this::handleInternalGetResponse
    );
}

private void handleClientGetRequest(Message message) {
    var req = deserializePayload(message.payload(), ClientGetRequest.class);
    var internalReq = new InternalGetRequest(req.key());

    this.<InternalGetResponse>quorumRequest(LWWMessageType.INTERNAL_GET_REQUEST, internalReq)
            .countResponseIf(r -> true) // any response is fine, just need a majority
            .send()
            .whenComplete((responses, error) -> {
                if (error != null) {
                    send(createMessage(message.source(), 
                                       message.correlationId(), 
                                       new ClientGetResponse(req.key(), null, false),
                                       LWWMessageType.CLIENT_GET_RESPONSE));
                    return;
                }

                byte[] highestValue = null;
                long highestTimestamp = -1;

                for (InternalGetResponse r : responses.values()) {
                    if (r.value() != null && r.timestamp() > highestTimestamp) {
                        highestTimestamp = r.timestamp();
                        highestValue = r.value();
                    }
                }

                boolean found = highestValue != null;
                send(createMessage(message.source(), 
                                   message.correlationId(), 
                                   new ClientGetResponse(req.key(), highestValue, found),
                                   LWWMessageType.CLIENT_GET_RESPONSE));
            });
}
```


[source](https://github.com/unmeshjoshi/tickloom/blob/3829bd158b2ea848affc65c0ea8a6ab1bea4fb2c/src/main/java/com/tickloom/algorithms/replication/quorum/QuorumReplica.java)

The semantic model itself acts as a context. The prompt names concepts that exist as concrete types in the codebase, so the LLM is not inventing a threading model or a networking layer -- it is filling in protocol logic against a fixed, well-understood substrate.

## Even good abstractions help -- without a DSL


A DSL is one end of the spectrum, and it is not easy to build. Before reaching for a language of your own it is worth noticing that a clean set of abstractions is already a lighter version of the same idea -- and, just as the framework supplied the vocabulary for the quorum store above, a library's named types and methods are themselves a vocabulary the model can be grounded in. Tickloom's semantic model is really just four such seams -- `Process` / `Replica` for compute and message handling, `Network` for communication, `Storage` for persistence, and a logical `Clock` for time -- and that decomposition does most of the work with no new syntax at all.

This is why abstractions, not just DSLs, pair well with LLMs. A prompt to "implement Raft as a Tickloom Replica" has limited state space to explore. The existing `QuorumReplica` can be used in context as a worked example.

## Scenario DSL and generated tests


The article's closing discussions of [LLM roles during design and use]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#two-phases-working-with-llms) and [the DSL as the source of truth]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}#the-dsl-as-the-source-of-truth) remain in related notes.

## Example: Building a DSL for testing distributed system scenarios


Implementing the algorithm is one thing; exercising it is another. The subtle bugs in distributed systems live in specific orderings: a write that replicates to one node before a reader's quorum shifts, a partition that heals at just the wrong moment, two coordinators whose clocks have drifted apart. Writing such a scenario directly against the testkit involves juggling futures, and manual `tick()` loops. Here is a clock-skew scenario written that way:

```
Cluster cluster = new Cluster()
        .withProcessIds(Arrays.asList(ATHENS, BYZANTIUM, CYRENE))
        .useSimulatedNetwork()
        .build(QuorumReplica::new);

cluster.start();

try {
    cluster.tickUntil(cluster::areAllNodesInitialized);

    cluster.setTimeForProcess(ATHENS, 1000L);
    cluster.setTimeForProcess(BYZANTIUM, 2000L);

    QuorumReplicaClient alice = cluster.newClientConnectedTo(ALICE, ATHENS, QuorumReplicaClient::new);
    QuorumReplicaClient bob = cluster.newClientConnectedTo(BOB, BYZANTIUM, QuorumReplicaClient::new);
    QuorumReplicaClient reader = cluster.newClientConnectedTo(READER, ATHENS, QuorumReplicaClient::new);

    TickCompletableFuture<SetResponse> bobWrite = bob.set(KEY.getBytes(StandardCharsets.UTF_8), "B".getBytes(StandardCharsets.UTF_8));
    cluster.tickUntilComplete(bobWrite);

    TickCompletableFuture<SetResponse> aliceWrite = alice.set(KEY.getBytes(StandardCharsets.UTF_8), "A".getBytes(StandardCharsets.UTF_8));
    cluster.tickUntilComplete(aliceWrite);

    TickCompletableFuture<GetResponse> read = reader.get(KEY.getBytes(StandardCharsets.UTF_8));
    cluster.tickUntilComplete(read);

    assertEquals("B", new String(read.getResult().value(), StandardCharsets.UTF_8));
} finally {
    cluster.close();
}
```


[source](https://github.com/unmeshjoshi/tickloom/blob/3829bd158b2ea848affc65c0ea8a6ab1bea4fb2c/src/test/java/com/tickloom/testkit/dsl/quorum/LWWLostUpdateWithoutDslTest.java)

The intent -- "Bob writes through Byzantium, Alice writes through Athens, a reader sees Bob's value because Byzantium's clock was ahead" -- is buried under mechanics. This is also a hard to verify code: there are dozens of incidental decisions (when to tick, how to encode bytes, which factory overload to call) for an LLM to get subtly wrong, and a reviewer must check every one of them.

So on top of the semantic model I built an internal DSL whose vocabulary is the vocabulary of the scenario itself -- servers, clients, who is connected to whom, what each client does, and which faults are in effect while it does it. The same scenario becomes:

```
Scenario<QuorumReplicaClient> scenario =                        
                QuorumStepBuilder.scenario("LWW lost update via server clock skew")
                .servers(ATHENS, BYZANTIUM, CYRENE)
                .clients(ALICE, BOB, READER)
                .client(ALICE).connectedTo(ATHENS)
                .client(BOB).connectedTo(BYZANTIUM)
                .given(g -> g.serverTimeAt(ATHENS, 1_000L)
                             .serverTimeAt(BYZANTIUM, 2_000L))
                .steps(s -> {
                    s.client(BOB).writes(KEY, "B").expectSuccess();
                    s.client(ALICE).writes(KEY, "A").expectSuccess();

                    s.client(READER).reads(KEY)
                            .expectResponse(v -> "B".equals(v));
                });
```


[source](https://github.com/unmeshjoshi/tickloom/blob/3829bd158b2ea848affc65c0ea8a6ab1bea4fb2c/src/test/java/com/tickloom/testkit/dsl/quorum/LWWLostUpdateScenarioTest.java)

The DSL is a thin, declarative surface that compiles down to a pure intermediate representation -- a `Scenario` made of `Step` s, where each step carries an `Action` (a read or write) and optional `ClusterEvent` s (faults like partitions and message delays). Faults read as English too: `         partition(BYZANTIUM).from(CYRENE)`, `reconnect(BYZANTIUM)`, `delay(INTERNAL_SET_REQUEST).from(ATHENS).to(BYZANTIUM,         CYRENE).byTicks(100)`. The grammar is enforced by the type system through progressive interfaces -- you cannot declare a step before the topology, or an action before selecting a client -- so whole classes of malformed scenarios simply do not compile. Because the DSL is an internal DSL built in Java, the host compiler validates the grammar for free, and a malformed generation comes back as a compile error pinned to exactly the illegal step rather than a runtime surprise.

Once the DSL exists, a natural language description of a failure scenario maps almost directly onto it. A prompt like:

Using the Tickloom scenario DSL, write a scenario reproducing the DDIA §10.6 non-linearizable quorum read. A writer connected to Athens sets the key, then updates it while replication from Athens to the other replicas is delayed. Alice, reading through Byzantium, is forced onto a quorum that includes Athens and sees the new value; Bob, reading later through a quorum of Byzantium and Cyrene, still sees the old value.

yields a scenario that stays entirely within the DSL's constrained vocabulary:

```
Scenario<QuorumReplicaClient> scenario =
        QuorumStepBuilder.scenario("Non-linearizable quorum read")
                .servers(ATHENS, BYZANTIUM, CYRENE)
                .clients(WRITER, ALICE, BOB)
                .client(WRITER).connectedTo(ATHENS)
                .client(ALICE).connectedTo(BYZANTIUM)
                .client(BOB).connectedTo(BYZANTIUM)
                .steps(s -> {
                    // Writer sets the key to VOLD initially and it replicates fully
                    s.client(WRITER).writes(KEY, VOLD).expectSuccess();

                    // Writer updates to VNEW, but replication from Athens is delayed
                    s.client(WRITER).writes(KEY, VNEW)
                            .whileClusterEvent(delay(QuorumMessageTypes.INTERNAL_SET_REQUEST)
                                    .from(ATHENS).to(BYZANTIUM, CYRENE).byTicks(100))
                            .expectSuccess();

                    // Alice reads through Byzantium. Force quorum to include Athens by partitioning Cyrene.
                    // She will read VNEW from Athens.
                    s.client(ALICE).reads(KEY)
                            .whileClusterEvent(partition(BYZANTIUM).from(CYRENE))
                            .expectResponse(v -> VNEW.equals(v));

                    // Bob reads later through Byzantium. Force quorum to include Cyrene (and exclude Athens).
                    // The delayed VNEW replication hasn't arrived at Cyrene, so Bob reads VOLD.
                    s.client(BOB).reads(KEY)
                            .whileClusterEvent(reconnect(BYZANTIUM))
                            .whileClusterEvent(partition(BYZANTIUM).from(ATHENS))
                            .expectResponse(v -> VOLD.equals(v));
                });

ScenarioResult result = scenario.run();
```


[source](https://github.com/unmeshjoshi/tickloom/blob/3829bd158b2ea848affc65c0ea8a6ab1bea4fb2c/src/test/java/com/tickloom/testkit/dsl/quorum/DDIA_LinearizabilityScenarioTest.java)

Because the surface is so small -- and the space of valid code it can generate is so much smaller than the space of valid Java programs -- the LLM has very little room to hallucinate, and a reviewer can read the result as a description of an experiment rather than as code to be audited line by line. Even if LLM hallucinates, the internal DSL will fail to compile allowing LLM to correct the errors made.
