---
draft: false
toc: true
description: "A research synthesis framing substrate design as maximal permissiveness subject to guarantees, identifying open problems in constraint synthesis, semantic interoperability, and composing authority, replication, and provenance."
title: "02 Semantic Substrate Design Report"
linkTitle: "02 Semantic Substrate Design Report"
---
# Constrained Generativity and Semantic Substrate Design


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## Executive summary


The saved survey reports strong precedents across computer science for **constrained generativity**, but did not identify a canonical term covering the whole idea. Refinement theory, assume-guarantee contracts, interface theories, type and module systems, capability security, CRDTs, consensus, Unix composition, the relational model, declarative APIs, and effect systems each capture a different part of it. Taken together, they support a coherent design principle. [^turn1search0][^turn14search3][^turn15search11][^turn2search7]

The proposal is to define it as:

> **Constrained generativity is the design principle of restricting the observable behaviours and interactions of components just enough to establish stable guarantees that survive compatible composition, while leaving the choice, implementation, and higher-order organisation of future components open.**

And **semantic substrate design** as the corresponding engineering method:

> **Semantic substrate design is the construction of the smallest shared vocabulary, behavioural rules, authority model, and composition semantics sufficient to preserve a chosen set of guarantees across independently developed components.**

This is close to the formulation already emerging in the research notes: constrain the common semantics while leaving higher-order structure generative, with a participant-neutral environment as one application rather than the definition of the principle. [^turn0file0] [^turn0file1]

The central relationship is:

\[
\text{allowed behaviour}

\;\xrightarrow{\text{restrict}}\;

\text{invariants}

\;\xrightarrow{\text{rely on}}\;

\text{local reasoning}

\;\xrightarrow{\text{compose}}\;

\text{larger systems}
\]

But one qualification is essential: **constraints do not automatically produce generativity**. A constraint is useful when it eliminates behaviours that interfere with the desired guarantees while retaining a large class of independently implementable components. Module-system research makes this trade-off explicit: complete transparency creates excessive dependencies, while complete opacity can hide information needed for composition. [^turn6search16]

The corresponding optimisation problem is therefore better stated as **maximal permissiveness subject to guarantees**, rather than "apply more constraints":

\[
C^\star

=

\operatorname{maximise}_{C}

\;\operatorname{Permissiveness}(C)

\quad

\text{subject to}

\quad

\operatorname{Compose}(C)\models G
\]

where \(G\) is the guarantee set and \(C\) defines admissible component behaviour.

That formulation has direct ancestors. Dijkstra's weakest-precondition calculus computes the weakest condition sufficient for a desired postcondition; assume-guarantee research synthesises assumptions an environment must satisfy; interface and contract theories define refinement, compatibility, composition, and quotient operators for finding what a missing component must provide. [^turn15search0][^turn15search4][^turn15search11]

The most important practical conclusion is:

> **Start with the system guarantee, derive the behaviours that must be excluded, place those restrictions at the narrowest enforceable boundary, prove or test that the guarantee survives composition and replacement, and leave everything else unspecified.**

This gives builders a theory for constructing their own systems rather than one prescribed architecture.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The original summary, general research gaps, and complete bibliography stay here. The [literature and case studies]({{< ref "ai/design-research/01-foundations/06-architectural-least-commitment-and-precedents" >}}#foundations-in-the-literature), [formal models]({{< ref "ai/design-research/01-foundations/07-constraint-guarantee-and-composition-models" >}}), and [builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) now have separate locations. The builder note includes the complete dialogue passages added during the preceding split.

## Research gaps and promising directions

### There is no general "least semantic substrate" calculus yet


The strongest conclusion of this survey is an inference from the literature: there are mature theories for individual pieces, but no single widely adopted framework simultaneously answers

\[
\text{behaviour}

+

\text{effects}

+

\text{authority}

+

\text{replication}

+

\text{provenance}

+

\text{evolution}

+

\text{open composition}.
\]

Refinement and contract theories handle behavioural inclusion, assumptions and composition. Effect systems expose computational effects. Capability systems constrain authority. CRDT and consensus theory address replicated state. Protobuf addresses structural evolution. These are largely separate semantic layers. [^turn1search0][^turn15search11][^turn5search0][^turn14search9][^turn11search6][^turn18search4]

A promising research programme would investigate when their guarantees compose:

\[
G_{\text{type}}

\land

G_{\text{authority}}

\land

G_{\text{replication}}

\land

G_{\text{provenance}}

\stackrel{?}{\Longrightarrow}

G_{\text{system}}.
\]

The answer is generally not automatic. Cross-layer assumptions can invalidate each other.

### Constraint synthesis is more important than constraint specification


Existing contract work is good at checking a contract once it exists. The harder builder problem is:

> Given \(G\), what contract should I write?

Weakest preconditions, contract quotient and automated assumption learning are three partial answers. [^turn15search0][^turn15search11][^turn15search4]

A broader semantic-substrate tool could work counterexample-first:

\[
G

\rightarrow

\text{counterexample composition}

\rightarrow

\text{missing constraint}

\rightarrow

\text{new candidate substrate}

\rightarrow

\text{repeat}.
\]

This could turn "architectural design" into a constrained synthesis problem: seek a **maximally permissive contract that excludes known counterexamples and preserves the target property**.

A single optimum should not be assumed. There may be several incomparable solutions: for replicated data, for example, stronger coordination and stronger algebraic restrictions can both produce useful guarantees through very different designs. [^turn11search5][^turn11search6]

### Structural interoperability remains much easier than semantic interoperability


Unix, gRPC and Protobuf show how much can be achieved with a narrow structural interface. But a syntactically valid stream, decodable message or successful RPC can still have the wrong meaning.

Protobuf's compatibility guarantees deliberately concern wire representation and schema evolution, not arbitrary behavioural compatibility. [^turn18search4][^turn18search5] Interface and contract theories address richer behaviour, but require more specification. [^turn14search3][^turn15search11]

This suggests a useful spectrum:

\[
\text{bytes}

<

\text{typed values}

<

\text{protocols}

<

\text{behavioural contracts}

<

\text{state/effect contracts}

<

\text{domain semantics}.
\]

Moving right gives stronger guarantees but demands more common semantics and therefore creates more coupling.

Finding the right point on that spectrum for each boundary is one of the central design problems of constrained generativity.

### Convergence needs application semantics


CRDT research provides a concrete warning against mistaking an easily stated formal property for the actual desired guarantee.

Strong eventual consistency establishes convergence, but collaborative users may also require properties about preservation of editing intent. Recent work on text CRDTs formulates stronger properties such as maximal non-interleaving because convergence alone permits undesirable text arrangements. [^turn11search17]

The general lesson is:

\[
\text{machine property}

\neq

\text{automatically sufficient user property}.
\]

A builder method should therefore repeatedly ask:

> "What failure would still be unacceptable if every formal invariant currently written were satisfied?"

That question generates the next semantic requirement.

### Authority, replication and offline work are beginning to meet


Traditional capability systems assume a clearly authoritative runtime or object graph. CRDT/local-first systems deliberately permit disconnected concurrent operation. Combining revocable authority with offline replicated state is therefore a harder problem.

Recent work such as Keyhive explores "convergent capabilities": access-control state designed to merge under local-first replication while retaining capability-style grant and revocation semantics. [^turn4search9]

This is a promising example of the next stage of semantic substrate research: compose two constraint systems that were previously studied mostly separately.

### Generative and stochastic participants sharpen the boundary problem


Humans and generative models create a useful stress test for existing component theories because their internal behaviour is difficult to enumerate and may deliberately explore many alternatives.

The natural response is not necessarily to fully specify the generator. The proposal/commit model suggests dividing properties into two classes:

\[\text{soft properties of generation}\]

and

\[\text{hard properties of committed consequences}.\]

The generator may be measured statistically:

\[\Pr[\text{useful proposal}]\]

while the commit boundary is required to satisfy a deterministic invariant:

\[
\forall p:

\operatorname{Commit}(p)

\Rightarrow

I(p).
\]

Formal research on probabilistic assume-guarantee contracts already shows that compositional contracts can be extended to quantitative and uncertain systems; multi-agent contract work similarly handles shared temporal constraints. [^turn19search0][^turn19search14]

For LLM systems specifically, 2026 research is beginning to use explicit trace contracts, capability restrictions and proposal/commit-style runtime boundaries. These works are early and should currently be treated as emerging evidence rather than a settled formal foundation. [^turn19search3][^turn19search2] A 2026 survey of formal safety work for LLM agents likewise characterises specification, verification and enforcement as fragmented and identifies specification quality and end-to-end preservation as open problems. [^turn19academia47]

The proposed broader theory could therefore avoid being tied to current models:

\[
\text{participant internals}

=

\text{opaque / deterministic / stochastic / human / learned}
\]

while requiring:

\[
\text{observable commitments}

\models

C.
\]

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The remaining research-gap sections discuss [provenance as part of validation]({{< ref "ai/design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations" >}}#provenance-should-become-operational-semantics-when-it-affects-trust) and the [proposed generativity measure and concluding thesis]({{< ref "ai/design-research/01-foundations/07-constraint-guarantee-and-composition-models" >}}#generativity-itself-needs-a-better-formal-measure). The complete original bibliography follows.

## References


[^turn1search0]: [The Existence of Refinement Mappings](https://www.microsoft.com/en-us/research/publication/the-existence-of-refinement-mappings/)

[^turn14search3]: [Interface theories for component-based design](https://research-explorer.ista.ac.at/record/4623)

[^turn15search11]: [Compositional assume-guarantee reasoning for input/output component theories](https://www.sciencedirect.com/science/article/pii/S0167642314000057)

[^turn2search7]: [The Principle of Least Power](https://www.w3.org/2001/tag/doc/leastPower-2006-01-23.html)

[^turn0file0]: User-provided source: `Pasted markdown(1).md`.

[^turn0file1]: User-provided source: `Pasted markdown (2).md`.

[^turn6search16]: [A type-theoretic approach to higher-order modules with sharing](https://doi.org/10.1145/174675.176927)

[^turn15search0]: [Guarded commands, non-determinacy and formal derivation of programs (EWD 472)](https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD472.html)

[^turn15search4]: [Learning Assumptions for Compositional Verification](https://ntrs.nasa.gov/citations/20030017771)

[^turn14search8]: [On Relational Interfaces](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2009/EECS-2009-60.html)

[^turn0search0]: [Contracts for system design](https://research-explorer.ista.ac.at/record/5677)

[^turn15search5]: [Proof Rules for Automated Compositional Verification through Learning](https://ntrs.nasa.gov/citations/20030107507)

[^turn16search0]: [Family Values: A Behavioral Notion of Subtyping](https://www.cs.cmu.edu/afs/cs/project/venari/www/subtype-tr.html)

[^turn16search4]: [Behavioral Subtyping Using Invariants and Constraints](https://www.cs.cmu.edu/afs/cs/project/calder/www/fmdp.html)

[^turn16search5]: [Semantics DG -- Spring 2018](https://research.cs.cornell.edu/tpls/papers/20170717.shtml)

[^turn16search6]: [Types: Type Systems](https://www.cs.cornell.edu/courses/cs4160/2020sp/sf/plf/terse/Types.html)

[^turn5search0]: [Koka: Programming with Row-Polymorphic Effect Types](https://www.microsoft.com/en-us/research/publication/koka-programming-with-row-polymorphic-effect-types/)

[^turn5search3]: [The Koka Programming Language](https://koka-lang.github.io/)

[^turn5search2]: [Abilities and ability handlers -- Unison](https://www.unison-lang.org/docs/language-reference/abilities-and-ability-handlers/)

[^turn13search0]: [Typed Memory Management in a Calculus of Capabilities](https://www.cs.cornell.edu/talc/papers/capabilities-abstract.html)

[^turn13search3]: [Typed Memory Management in a Calculus of Capabilities -- abstract](https://www.cs.cmu.edu/~dpw/papers/capabilities-abstract.html)

[^turn13search4]: [A Capability Calculus for Concurrency and Determinism](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2006/EECS-2006-84.html)

[^turn13search8]: [A capability calculus for concurrency and determinism](https://waseda.elsevierpure.com/en/publications/a-capability-calculus-for-concurrency-and-determinism-2/)

[^turn12search2]: [Concern for Correctness as a Guiding Principle for Program Composition (EWD 288)](https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD288.html)

[^turn12search1]: [Can Programming Be Liberated from the von Neumann Style? A Functional Style and Its Algebra of Programs](https://research.ibm.com/publications/can-programming-be-liberated-from-the-von-neumann-style-a-functional-style-and-its-algebra-of-programs)

[^turn6search3]: [A Calculus of Mobile Processes Pt.1](https://www.lfcs.inf.ed.ac.uk/reports/89/ECS-LFCS-89-85/)

[^turn6search6]: [A Calculus of Mobile Processes, I](https://www.research.ed.ac.uk/en/publications/a-calculus-of-mobile-processes-i/)

[^turn16search14]: [Formalizing Architectural Connection](https://www.cs.cmu.edu/~Compose/paper_abstracts/wright-icse16.html)

[^turn13search10]: [What are Microservices?](https://aws.amazon.com/microservices/)

[^turn18search1]: [Introduction to gRPC](https://grpc.io/docs/what-is-grpc/introduction/)

[^turn2search0]: [Kafka, Samza, and the Unix philosophy of distributed data](https://martin.kleppmann.com/2015/08/05/kafka-samza-unix-philosophy-distributed-data.html)

[^turn2search1]: [Kafka, Samza and the Unix philosophy of distributed data -- publication](https://martin.kleppmann.com/2015/12/15/stream-processing-data-engineering-bulletin.html)

[^turn2search8]: [stdin -- The Open Group Base Specifications](https://pubs.opengroup.org/onlinepubs/9699919799/functions/stdin.html)

[^turn2search15]: [Principles of Design](https://www.w3.org/DesignIssues/Principles.html)

[^turn3search0]: [Overview: An Ode to the Granovetter Diagram](https://erights.org/elib/capability/ode/overview.html)

[^turn3search5]: [Auditors -- E language](https://www.erights.org/elang/kernel/auditors/index.html)

[^turn14search0]: [Capabilities -- seL4 documentation](https://docs.sel4.systems/Tutorials/capabilities.html)

[^turn14search2]: [Frequently Asked Questions -- seL4](https://sel4.systems/About/FAQ.html)

[^turn14search9]: [Capability Distribution Language (capDL)](https://docs.sel4.systems/projects/capdl/index.html)

[^turn11search0]: [Raft Consensus Algorithm](https://raft.github.io/)

[^turn11search2]: [In Search of an Understandable Consensus Algorithm](https://www.usenix.org/node/184041.)

[^turn11search5]: [Research for Practice: Convergence](https://martin.kleppmann.com/2022/11/01/convergence-cacm.html)

[^turn11search6]: [Verifying Strong Eventual Consistency in Distributed Systems](https://martin.kleppmann.com/2017/10/25/verifying-crdt-isabelle.html)

[^turn11search12]: [OpSets: Sequential Specifications for Replicated Datatypes (Extended Version)](https://martin.kleppmann.com/2018/05/11/opsets-sequential-specifications.html)

[^turn7search0]: [A Relational Model of Data for Large Shared Data Banks](https://research.ibm.com/publications/a-relational-model-of-data-for-large-shared-data-banks)

[^turn7search2]: [A data base sublanguage founded on the relational calculus](https://research.ibm.com/publications/a-data-base-sublanguage-founded-on-the-relational-calculus)

[^turn7search16]: [Query Planning -- SQLite](https://www.sqlite.org/queryplanner.html)

[^turn18search4]: [Proto Best Practices](https://protobuf.dev/best-practices/dos-donts/)

[^turn18search5]: [Overview -- Protocol Buffers](https://protobuf.dev/overview/)

[^turn18search8]: [gRPC](https://grpc.io/)

[^turn17search0]: [Custom Resources -- Kubernetes](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)

[^turn17search3]: [Extending Kubernetes](https://kubernetes.io/docs/concepts/extend-kubernetes/)

[^turn4search5]: [Automerge CRDT](https://automerge.org/)

[^turn4search6]: [Peritext: A CRDT for Rich-Text Collaboration](https://www.inkandswitch.com/peritext/)

[^turn11search17]: [The Art of the Fugue: Minimizing Interleaving in Collaborative Text Editing](https://martin.kleppmann.com/2025/11/01/fugue-minimizing-interleaving.html)

[^turn10search1]: [Ethereum Virtual Machine (EVM)](https://ethereum.org/developers/docs/evm/)

[^turn10search2]: [Ethereum Whitepaper](https://ethereum.org/whitepaper/)

[^turn10search13]: [Policies -- Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.4/policies/policies.html)

[^turn10search16]: [Ledger -- Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.4/ledger.html)

[^turn7search15]: [The SQLite Query Optimizer Overview](https://www.sqlite.org/optoverview.html)

[^turn18search0]: [Language Guide (editions) -- Protocol Buffers](https://protobuf.dev/programming-guides/editions/)

[^turn19search3]: [A Trace-Based Assurance Framework for Agentic AI Orchestration: Contracts, Testing, and Governance](https://doi.org/10.48550/arXiv.2603.18096)

[^turn19search2]: [State-Aware Runtime for Long-Horizon LLM Agents: A Conceptual Framework and Research Agenda](https://www.cambridge.org/engage/coe/article-details/6a78e51a810b9dcc82ea7f02)

[^turn10search4]: [Overview and basic concepts -- CometBFT ABCI++](https://docs.cosmos.network/cometbft/latest/spec/abci/Outline)

[^turn4search9]: [Keyhive](https://www.inkandswitch.com/project/keyhive/)

[^turn19search0]: [Probabilistic Assume-Guarantee Contracts for Islanded Mission-Critical Power System Operations](https://doi.org/10.3390/electronics15040855)

[^turn19search14]: [Contract-based Design and Verification of Multi-Agent Systems with Quantitative Temporal Requirements](https://ojs.aaai.org/index.php/AAAI/article/view/34480)

[^turn19academia47]: [Toward Safe LLM Agents: A Survey of Specification, Verification, and Enforcement](https://arxiv.org/abs/2608.14590)

[^turn19academia48]: [The Granularity Mismatch in Agent Security: Argument-Level Provenance Solves Enforcement and Isolates the LLM Reasoning Bottleneck](https://arxiv.org/abs/2605.11039)
