---
draft: false
toc: true
description: "Surveys minimal semantic boundaries through refinement, contracts, Unix, SQL, Kubernetes, capabilities, CRDTs, and schema evolution, comparing how restrictions preserve unknown future implementations and compositions."
title: "06 Architectural Least Commitment And Precedents"
linkTitle: "06 Architectural Least Commitment And Precedents"
---
# Architectural least commitment and precedents


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The opening question, its answer, and the historical survey remain together here. The dialogue continues in [Constrained generativity]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}#another), which broadens the argument beyond one architecture.

how would you named and formulated this build approach and stance: we don't know which (or what type, kind or combination of them) architecture will be successful for a certain problem class. So instead of prescribing these architectures we should structure the underlying principles and don't constrain builders. Kind of type of ground theory.

We don't know what we don't know

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The proposal is to call the stance **architectural least commitment**.

The broader build approach could be:

> **Principle-first, architecture-agnostic substrate design.**

The core idea is:

> We do not know in advance which architecture, participant mix, coordination pattern, or control structure will work best for a given problem class. Therefore the substrate should encode the properties that must remain true across architectures, while leaving the architecture itself open to construction, adaptation, and discovery.

More compactly:

> **Specify invariants; leave organization open.**

Or, in systems language:

> **Provide mechanisms and semantics without prescribing policy or topology.**

That distinction is important. You would prescribe things such as:

```text
identity
state
types
authority
capabilities
effects
provenance
obligations
invariants
commit semantics
```


But deliberately avoid prescribing:

```text
single agent vs multi-agent
planner / executor / critic
workflow DAG
blackboard
hierarchy
market
swarm
pipeline
human-led process
model-led process
fixed vs dynamically changing topology
```


Those are architectures built **on top of** the substrate.

The working interpretation is that "architecture-agnostic" alone is slightly too weak. It can sound like ordinary portability. The deeper stance is epistemic:

> **The design should preserve room for architectures we have not yet conceived.**

That is where "least commitment" fits well. The claim is not that every architecture is equally good. It is that architecture selection is a downstream empirical question, and the foundational layer shouldn't prematurely eliminate possibilities.

There is also a useful connection to the classic **mechanism-policy separation** in operating systems. The kernel supplies mechanisms; higher layers decide policy. The proposed version extends that idea:

> **The substrate supplies enforceable semantics; builders supply computational organization.**

One possible formulation of the research stance is:

> **Architectural least commitment.** Because the effective organization of heterogeneous human, model, and software computation is not known a priori, we avoid making a particular coordination architecture part of the computational model. We instead identify the minimal shared semantics required for safe composition--state, authority, effects, provenance, identity, obligations, and invariants--and allow arbitrary architectures to be constructed within those constraints.

And there is an even stronger sentence underneath it:

> **Unknown architectures are part of the design space, not exceptions to the design.**

That captures "we don't know what we don't know" without making it sound like vague uncertainty. It turns ignorance into an explicit systems requirement.

The proposal is to use **architectural least commitment** for the principle and **architecture-agnostic computational substrate** for the thing you build.

## similar


The research outline considers exact precedents and nearby design traditions: AI planning, operating systems, Internet architecture, programming languages, and software architecture. The key test is whether they preserve unknown future architectures by fixing only a minimal semantic substrate.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The saved LLM review reports searching across AI planning, operating systems, programming languages, Internet architecture, and current agent systems. It identifies an intellectual lineage for this stance, but no single established term covering the whole idea.

The closest direct precedent may be **least-commitment planning**. In classical AI planning, the principle is to avoid fixing ordering, bindings, or implementation choices until they become necessary. Stefik's MOLGEN work explicitly argued that a planner needs to keep options open because early decisions have consequences elsewhere; Weld later systematized this as least-commitment planning. ([ScienceDirect](https://www.sciencedirect.com/science/chapter/edited-volume/pii/B9780934613033500234?utm_source=chatgpt.com "Planning and Meta-Planning (MOLGEN: Part 2) - ScienceDirect"))

Even closer to the initial premise is Veloso and Stone's 1995 FLECS work. They found that least commitment worked better for some planning problems while eager commitment worked better for others. Their response was essentially: stop assuming a universally best strategy, and build something that lets different strategies be explored. They explicitly describe the "futility of trying to find a universally successful planning strategy." ([UT Austin Computer Science](https://www.cs.utexas.edu/~pstone/Papers/bib2html/b2hd-jair-flecs.html?utm_source=chatgpt.com "Peter Stone: FLECS: Planning with a Flexible Commitment Strategy"))

That is close to the proposed principle:

> We don't know which architecture will win for which problem class.

SICP generalizes the same principle beyond planning. Abelson and Sussman describe data abstraction itself as **the principle of least commitment**: the abstraction boundary lets the system defer choosing a concrete representation and can even allow multiple representations to coexist. ([Source Academy](https://sicp.sourceacademy.org/split_py/chapters/2.4.2.html?utm_source=chatgpt.com "2.4.2   Tagged data - SICP Comparison Edition"))

So there is precedent for extending "least commitment" from decisions inside a plan to decisions inside system design.

The second major lineage is **mechanism-policy separation** in operating systems. Wulf's HYDRA work argues that putting policy into the substrate makes systems difficult to experiment with and adapt; the substrate should provide mechanisms while leaving complex decisions to higher-level designers. ([CSE Web](https://cseweb.ucsd.edu/classes/wi19/cse221-a/papers/wulf74.pdf?utm_source=chatgpt.com "2. Separation of mechanism and policy. Among the major causes of our inability to experiment with, and adapt, existing operating systems is their failure to properly separate mechanisms from policies. (Hansen [1] has presented cogent arguments for this separation.) Such separation contributes to the flexibility of the system, for it leaves the complex decisions in the hands of the person who should make them--the higher-level system designer."))

The Exokernel project takes this much further. Its starting observation is that conventional operating systems constrain applications by fixing abstractions such as virtual memory and IPC. The exokernel therefore securely exposes low-level resources and lets applications implement, specialize, or replace higher-level abstractions themselves. ([EECG](https://www.eecg.utoronto.ca/~yuan/teaching/gradOS/papers/exokernel.pdf?utm_source=chatgpt.com "Exokernel: An Operating System Architecture for Application-Level Resource Management"))

L4's **minimality principle** is an even cleaner formulation:

> A concept should live in the kernel only when moving it outside would make required functionality impossible.

The explicit reason for moving things outside is to permit **competing implementations**. ([Microkernel Dude](https://microkerneldude.org/2020/03/11/sel4-design-principles/?utm_source=chatgpt.com "seL4 Design Principles | microkerneldude"))

That gives you a very useful test for the proposed substrate:

> If an architectural choice can safely have competing implementations, why is it part of the substrate?

This might be one of the best design tests for the author's project.

The third lineage is the Internet's **narrow waist / hourglass architecture**. The Internet succeeds partly because a relatively small common layer sits between many implementations below and many applications above. Micah Beck formalizes the idea as supporting diversity on both sides by keeping the spanning layer simple and general. ([ResearchGate](https://www.researchgate.net/publication/305638436_On_the_Hourglass_Model?utm_source=chatgpt.com "(PDF) On the Hourglass Model"))

That's very close to what you have been calling the thin waist:

```text
unknown future architectures
unknown coordination schemes
unknown combinations of humans / models / programs
             ↑
             │
   -----------------------
      minimal semantics
   -----------------------
             │
             ↓
state / storage / models / tools / infrastructure
```


The point of the waist isn't knowing what will be built. Its value comes partly from **not having to know**.

Saltzer, Reed, and Clark's later commentary on the end-to-end principle contains perhaps the closest description of the proposed methodological stance. They say general design principles:

> "impose a structure on the design space, rather than solving the design problem."

([Massachusetts Institute of Technology](https://web.mit.edu/~saltzer/www/publications/endtoend/ANe2ecomment.html?utm_source=chatgpt.com "Active Networking and End-To-End Arguments"))

The working interpretation is that that's very close to what you were reaching for with "ground theory."

The aim is to **structure a design space**, rather than select a point in that space.

There is another useful lineage in Kiczales's **Open Implementation** work. Its premise is that substrate designers often cannot know which implementation strategy will suit every application. Instead of adding ever more features, the substrate exposes disciplined ways for builders to inspect and control implementation choices. ([ResearchGate](https://www.researchgate.net/publication/3247116_Beyond_the_Black_Box_Open_Implementation?utm_source=chatgpt.com "(PDF) Beyond the Black Box: Open Implementation"))

So:

```text
closed substrate

designer predicts needs
       ↓
fixed abstractions
       ↓
application adapts to them
```


versus:

```text
open substrate

stable semantics
       ↓
multiple implementation strategies
       ↓
application chooses / specializes
```


Again, very close.

Current agent work shows pieces of the same instinct, though the saved review regards it as generally narrower. A2A explicitly wants agents built with different frameworks and by different vendors to interoperate through a common language. ([Google Open Source Blog](https://opensource.googleblog.com/2026/04/meet-the-a2family.html?utm_source=chatgpt.com "Meet the A2Family")) MCP similarly emphasizes composable servers, a small required core, capability negotiation, and independent evolution. ([Model Context Protocol](https://modelcontextprotocol.io/specification/2025-06-18/architecture?utm_source=chatgpt.com "Architecture - Model Context Protocol"))

But these standards still make fairly substantial architectural commitments: MCP has host/client/server roles; A2A assumes agents communicating through tasks and messages. They're **framework-agnostic inside an architecture**, which is weaker than the proposed design stance.

A recent example closer to the proposed enforcement boundary is Faramesh: it is explicitly protocol- and framework-agnostic and introduces a mandatory authorization boundary between an agent's proposed action and execution. ([arXiv](https://arxiv.org/abs/2601.17744?utm_source=chatgpt.com "Faramesh: A Protocol-Agnostic Execution Control Plane for Autonomous Agent Systems")) That's close to the `proposal -> validate -> commit` proposal, but it focuses specifically on authorization of agent effects.

So the proposal is to place the proposed stance at the intersection of these traditions:

```text
Least-commitment planning
        │
        │ don't decide before necessary
        │
        ▼
SICP least commitment
        │
        │ don't fix representations unnecessarily
        │
        ▼
Mechanism / policy separation
        │
        │ substrate mechanism ≠ application organization
        │
        ▼
Microkernel / Exokernel minimality
        │
        │ permit competing implementations
        │
        ▼
Internet narrow waist
        │
        │ minimal common semantics enable unknown uses
        │
        ▼
Open implementation
        │
        │ expose safe points of variation
        │
        ▼
YOUR STANCE
```


The working interpretation is that **architectural least commitment** is therefore a defensible name with genuine historical grounding. The proposal extends an existing principle by one level.

The proposal is to formulate it more precisely now as:

> **Architectural least commitment:** A foundational computational substrate should commit only to the semantics required for heterogeneous components to compose safely. Decisions about participant organization, coordination, control, decomposition, reasoning strategy, and execution topology should remain outside the substrate whenever competing implementations can satisfy those semantics.

And the accompanying methodological principle:

> **Structure the design space; don't prematurely choose within it.**

The latter is almost a direct continuation of Saltzer/Reed/Clark.

One possible name for the build discipline is **least-commitment substrate design**:

> We assume that the effective architectures for heterogeneous human-machine computation are not known in advance and may differ by problem class. We therefore seek the smallest set of stable semantics and invariants that lets architectures be freely constructed, compared, adapted, and replaced.

That final clause matters: **constructed, compared, adapted, and replaced**. The stated goal isn't architecture independence as an aesthetic property. It is to make architecture itself an **experimental variable**.

That gives the research stance teeth:

```text
architecture = hypothesis
problem class = environment
substrate = experimental ground
invariants = rules that every experiment must obey
evaluation = evidence about which architectures work
```


This is where the author's "we don't know what we don't know" premise becomes a scientific position rather than a slogan. You expect new organizational forms to be discovered, so the system should make discovering them possible.

One terminology point: The recommendation is not to use **grounded theory** for this. That term already names a specific qualitative research methodology in which theories are induced from empirical data. ([APA Dictionary](https://dictionary.apa.org/grounded-theory?utm_source=chatgpt.com "APA Dictionary of Psychology")) **Design-space theory**, **semantic substrate**, **least-commitment substrate**, or **architectural least commitment** are much closer to what you mean.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The following literature foundations, case studies, and comparison table come from the [semantic-substrate report]({{< ref "ai/design-research/01-foundations/02-semantic-substrate-design-report" >}}). They supplement the earlier dialogue above. The [formal models]({{< ref "ai/design-research/01-foundations/07-constraint-guarantee-and-composition-models" >}}) and [builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) remain separate from the survey.

## Foundations in the literature

### Refinement and behavioural restriction


Refinement gives the cleanest formal ancestor of the first half of the idea. Abadi and Lamport model implementation by relating a lower-level specification to a higher-level specification through refinement mappings. Informally, an implementation is acceptable when every externally relevant behaviour it produces is allowed by the abstraction. Auxiliary history or prophecy variables may be needed to construct such mappings. [^turn1search0]

At the trace level, a simplified formulation is:

\[
M_1 \preceq M_0

\quad\Longleftrightarrow\quad

\operatorname{Beh}(M_1)\subseteq\operatorname{Beh}(M_0)
\]

The implementation \(M_1\) admits fewer behaviours than its specification \(M_0\).

This captures a fundamental part of constrained generativity:

\[
\text{fewer admissible behaviours}

\Rightarrow

\text{more properties universally true of those behaviours}.
\]

For ordinary safety properties, if all behaviours of the abstraction satisfy \(P\), then restricting the behaviour set through refinement preserves \(P\). Richer notions are needed for liveness, fairness, timing, probability, and other properties for which plain trace inclusion is insufficient. Interface and contract theories extend the basic idea in precisely these directions. [^turn14search3][^turn15search11]

### Interfaces, contracts, and substitutability


De Alfaro and Henzinger's **interface theories** move the focus from describing what a component does in every possible environment to describing what the component expects from its environment. Compatibility and refinement then become first-class design questions; they describe interface reasoning as naturally game-theoretic because inputs and outputs are controlled by different parties. [^turn14search3]

Later relational-interface work makes the connection to the research problem especially direct: it includes explicit notions of environments and "pluggability", and establishes conditions under which refinement is preserved by composition. The theory must restrict some forms of feedback to obtain these properties. [^turn14search8]

Assume-guarantee contracts make the structure explicit:

\[\Gamma=(A,G)\]

where \(A\) says what the component assumes of its environment and \(G\) says what it guarantees whenever those assumptions hold. Contract frameworks support parallel composition, refinement and, in some theories, a **quotient** operation: given a desired whole and an existing component, derive a specification for a component that can fill the missing part. [^turn0search0][^turn15search11]

This is one of the closest established formulations of the proposed inverse problem:

\[
\text{desired system guarantee}

+

\text{known components}

\longrightarrow

\text{requirements on the unknown component}.
\]

There is also work on automatically *learning* environment assumptions from a desired property, refining them from counterexamples until the property is proved or disproved. [^turn15search4][^turn15search5]

Behavioural subtyping supplies another formulation of open replacement. Liskov and Wing require that properties established about supertype objects continue to hold for subtype objects; their work uses explicit invariants and behavioural constraints to support this property even for mutable objects. [^turn16search0][^turn16search4]

That principle is important for an open-ended substrate:

\[
X' \preceq X

\Longrightarrow

K[X'] \text{ remains valid wherever } K[X] \text{ was valid}.
\]

A future component need not have been anticipated. It must satisfy the published behavioural boundary.

### Types, modules, effects, and programming restrictions


A type system deliberately excludes programs. Its benefit is the property obtained for the programs that remain. In the standard progress-and-preservation formulation of type soundness, well-typed programs preserve their types while executing and cannot reach the particular class of "stuck" states ruled out by the language's soundness theorem. [^turn16search5][^turn16search6]

Types therefore instantiate:

\[
\text{syntactic/semantic restriction}

\rightarrow

\text{statically established invariant}

\rightarrow

\text{safe substitution and composition}.
\]

The exact guarantee depends on the type system. Ordinary static typing does not establish arbitrary behavioural correctness, security, termination, or authority properties.

Module systems add an information-boundary problem. Harper and Lillibridge's work on higher-order modules explicitly studies the tension between opaque interfaces, which support abstraction, and transparent interfaces, which expose information needed to express dependencies between modules. [^turn6search16] This is directly relevant to "minimal semantic constraints": exposing too little prevents useful composition; exposing too much couples components.

**Effect systems** move another class of otherwise hidden behaviour into the boundary contract. Koka's type system records possible effects in types and can, for example, statically establish absence of particular effects such as unhandled exceptions; effect handlers then let effectful operations be interpreted separately from the computation that requests them. [^turn5search0][^turn5search3] Unison similarly represents abilities in function types, including I/O, exceptions, streaming and distributed computation. [^turn5search2]

This is highly relevant to semantic substrate design because:

\[f:A\rightarrow B\]

says much less about a component boundary than

\[f:A\rightarrow^{\{Network,Write,Exception\}}B.\]

The second interface exposes behaviour that matters for composition without requiring the caller to know the function's implementation.

Capability calculi extend the same approach to resources and permissions. Crary, Walker and Morrisett's **Capability Calculus** statically records permission to perform operations such as memory access and deallocation while tracking aliasing, producing a type-safe low-level language. [^turn13search0][^turn13search3] Terauchi and Aiken use capabilities to derive partial confluence and therefore determinism properties for communicating concurrent processes. [^turn13search4][^turn13search8]

The programming-language restrictions you mentioned fit the same pattern. Dijkstra argued for deliberately choosing a more manageable subclass of programs in which correctness could be related structurally to program text; unrestricted jumps defeat that style of reasoning. [^turn12search2] Backus's Turing Award lecture similarly proposed functional combining forms with algebraic laws so that programs could be built from components and reasoned about at progressively higher levels without continual dependence on machine state. [^turn12search1]

The deeper commonality is therefore **preservation of reasoning boundaries**, not the removal of one particular construct such as `goto` or mutation.

### Process calculi, component models, and explicit composition


The π-calculus supplies a formal language for systems whose communication topology itself changes over time. Channels can be communicated, allowing the connectivity graph between processes to evolve; the calculus provides formal composition and behavioural-equivalence machinery for such dynamically structured concurrent systems. [^turn6search3][^turn6search6]

This is useful to constrained generativity because it separates two questions:

\[\text{What structures may participants dynamically build?}\]

from

\[\text{Which observational laws remain valid as those structures change?}\]

Early software-architecture work made connectors themselves semantic entities. Allen and Garlan model architectural connectors as interaction protocols and use formal semantics to check architectural compatibility in a manner analogous to type checking. [^turn16search14] This captures an important point that ordinary function signatures miss: **the composition operator has semantics of its own**.

That observation also appears in component-based software engineering more generally. Independent deployability only becomes useful when a component's explicit boundary carries enough information for a third party to use it without access to its implementation. Modern microservice practice inherits this idea through independently deployed services communicating via well-defined APIs. [^turn13search10][^turn18search1]

### Unix, least power, and independent invention


Unix is the clearest practical example of obtaining broad generativity from a narrow boundary.

Kleppmann's analysis emphasises the uniform `stdin`/`stdout` interface, shell-managed wiring and the fact that individual tools do not have to know who supplies their input or consumes their output. This permits later tools to participate in pipelines that their authors did not anticipate. [^turn2search0][^turn2search1] POSIX standardises the conventional standard input, output and error streams that help make that programming model portable. [^turn2search8]

The crucial guarantee is modest:

\[
\text{byte stream producer}

\;\vert\;

\text{byte stream consumer}
\]

is *structurally* composable.

Unix pipes do **not** prove that the producer's bytes mean what the consumer expects. Their semantic waist is deliberately thin. That low semantic commitment is a major source of openness, and also the source of many integration errors.

The W3C's **Principle of Least Power** expresses the same trade-off from the language side: use the least powerful language adequate for a purpose because weaker languages expose more information to generic processors and analysis. [^turn2search7] Berners-Lee's design notes add the "Test of Independent Invention": a protocol is stronger when independently invented implementations can still interoperate. [^turn2search15]

That gives a useful operational test for the proposed theory:

> Can a component built years later, by someone who did not know the original implementations, obtain the substrate's guarantees merely by satisfying its published semantics?

### Capabilities and controlled authority


Object-capability systems deliberately remove ambient ways of acquiring authority. In the object-capability model, possession of an unforgeable reference conveys authority; references can normally be obtained only through initial endowment, creation, or transfer by an entity that already possesses them. The constraint on how authority can flow enables local reasoning about what a component can affect. [^turn3search0][^turn3search5]

seL4 makes this concrete at operating-system level. A capability is an unforgeable token referencing a kernel object and carrying rights; kernel operations require an appropriate capability. [^turn14search0][^turn14search2] Its capDL language declaratively describes capability distributions and supports analysis of questions such as whether one component could ever acquire access to a resource in future states. [^turn14search9]

This is one of the strongest examples of the thesis:

\[
\text{remove ambient authority}

\rightarrow

\text{explicit authority graph}

\rightarrow

\text{reason about isolation and delegation}.
\]

### Consensus and CRDTs: two ways to constrain distributed behaviour


Consensus-based replicated state machines and CRDTs illustrate two very different forms of semantic strengthening.

Raft arranges replicas around a replicated log so that multiple servers implement one state machine while tolerating failures subject to the protocol's assumptions. Its design deliberately strengthens coherence between nodes, reducing the behaviours that clients have to reason about. [^turn11search0][^turn11search2] Kleppmann and Alvaro contrast this general family of approaches with systems based on convergence: consensus can emulate stronger single-system semantics, but coordination carries availability, latency and scalability costs. [^turn11search5]

CRDTs restrict the data type and update/merge semantics so independently updated replicas can converge without synchronous agreement. Formal verification work has proved strong eventual consistency for reusable classes of CRDTs and individual data structures; subsequent work such as OpSets has explored richer executable semantics and composition. [^turn11search6][^turn11search12]

The two approaches therefore illustrate a general builder choice:

\[
\text{stronger global ordering constraint}

\rightarrow

\text{stronger shared-state abstraction}
\]

versus

\[
\text{stronger algebraic restriction on operations}

\rightarrow

\text{less coordination}.
\]

Neither dominates the other. The desired guarantee determines the appropriate constraint.

## Applied systems and case studies


The table below treats deployed systems as instances of a common pattern. The "waist" is the part that participants must share; everything behind that boundary remains comparatively free.

| System | Constrained semantic waist | Guarantee obtained | What remains open | Important limit |
|---|---|---|---|---|
| **Unix/POSIX pipes** [^turn2search0][^turn2search8] | Processes exchange conventional streams through a uniform I/O boundary. | Structural pipeline composition and loose coupling. | Tool implementation, language, purpose and pipeline topology. | Bytes provide little semantic compatibility. |
| **Relational databases / SQL** [^turn7search0][^turn7search2][^turn7search16] | Applications express data in a relational/declarative model and largely omit physical access paths. | Logical/physical data independence; DBMS can choose equivalent execution strategies. | Storage layout, indexes, join algorithms and physical plans. | SQL semantics do not themselves guarantee application-level correctness. |
| **gRPC + Protobuf** [^turn18search1][^turn18search4][^turn18search5] | Methods, request/response types and stable field-number/evolution rules. | Cross-language structural interoperability and substantial wire-version compatibility when evolution rules are followed. | Client/server implementation and programming language. | Schema compatibility is weaker than behavioural compatibility. |
| **Microservices** [^turn13search10][^turn18search8] | Independently owned services interact through explicit network APIs. | Deployment and implementation independence at service boundaries. | Internal languages, storage and release cycles. | Distribution introduces partial failure, latency and cross-service consistency problems; the architecture alone solves none of them. |
| **Kubernetes APIs/controllers** [^turn17search0][^turn17search3] | Typed API resources represent desired state; controllers reconcile observed state against it. | A common declarative extension model with shared API mechanisms, authentication, authorisation and audit for CRDs. | New resource kinds and independently deployed controllers. | Kubernetes explicitly notes that its declarative resource model does not provide transactions across resources. |
| **CRDT editors** [^turn4search5][^turn4search6][^turn11search17] | Updates and merge behaviour obey a CRDT's convergence discipline. | Concurrent/offline editing with deterministic convergence under the datatype's assumptions. | Timing and order of disconnected user actions. | Convergence alone is insufficient to capture all forms of user intent; later CRDT work explicitly adds stronger semantic criteria. |
| **seL4 / capability OSes** [^turn14search0][^turn14search9] | Access to kernel resources is mediated by explicit capabilities. | Fine-grained authority and analysable isolation boundaries. | Component implementation within granted authority. | Capability distribution and trusted code still need correct design. |
| **Raft replicated state machine** [^turn11search0][^turn11search2] | Replicas participate in a prescribed consensus/log protocol. | One agreed command history and coherent replicated-state-machine behaviour under the fault model. | State-machine application logic. | Coordination and quorum requirements reduce availability in some failures. |
| **Ethereum EVM** [^turn10search1][^turn10search2] | Transactions execute through a deterministic state-transition machine with signed transactions and metered gas. | Network participants can replay an ordered transaction sequence and derive the same protocol state under consensus. | Arbitrary contract programs within VM rules. | Determinism does not make contract logic correct or economically safe. |
| **Hyperledger Fabric** [^turn10search13][^turn10search16] | Proposed transaction executions are endorsed, ordered and then validated before their writes are committed. | Only transactions satisfying endorsement and version checks alter ledger state. | Proposal generation and application-specific endorsement policies. | Cross-world external side effects need separate treatment. |
| **Typed effects: Koka / Unison** [^turn5search0][^turn5search2] | Potential effects are represented in program types/abilities. | Callers and compilers can reason about which classes of effect may occur. | Internal computation and effect-handler implementation. | An effect label describes behaviour; it need not establish permission to perform that effect. |

### Unix and SQL show two different forms of freedom


Unix constrains **how components connect**. SQL constrains **how a request is expressed**.

Codd's relational model was explicitly motivated by insulating users and applications from changes in physical storage representation. [^turn7search0] Contemporary SQL engines retain this distinction: SQL describes the desired result while the query planner selects among physical execution strategies. [^turn7search15][^turn7search16]

Thus:

\[
\underbrace{\text{less implementation prescription by caller}}_{\text{constraint}}

\quad\Rightarrow\quad

\underbrace{\text{more implementation freedom for substrate}}_{\text{generativity below boundary}}
\]

whereas Unix gives:

\[
\underbrace{\text{less interaction freedom per component}}_{\text{constraint}}

\quad\Rightarrow\quad

\underbrace{\text{more combinations between components}}_{\text{generativity above boundary}}.
\]

These are dual manifestations of the same substrate-design move.

### Kubernetes is a particularly close modern analogue


Kubernetes is useful because it combines a constrained common model with explicit extension points.

A custom resource has a known API shape and schema. When paired with a controller, the resource becomes a declarative API: the resource states the desired condition and a controller works to reconcile current state towards it. Custom resources can be dynamically installed and independently updated, and CRDs reuse core API machinery including authentication, authorisation and audit. [^turn17search0]

A new operator therefore does not have to alter the fundamental Kubernetes execution model. It supplies:

\[
\text{new resource vocabulary}

+

\text{controller interpreting that vocabulary}.
\]

That is close to **open-ended composition over a constrained substrate**.

The limits are equally informative. Kubernetes advises that the model is a poor fit when operations are naturally RPC-like, high-bandwidth, or require cross-object transactions. [^turn17search0] A good substrate does not merely define rules; it defines the domain in which those rules buy useful guarantees.

### Protobuf shows why evolution rules belong to semantics


A `.proto` definition is more than a static data shape. Protobuf imposes evolution constraints: field numbers identify data on the wire, must not be reused, and should be reserved after deletion; old and new implementations can often coexist when documented compatibility rules are followed. [^turn18search0][^turn18search4][^turn18search5]

That is a strong example of a point often missed in interface design:

> **Open-ended composition requires constraints across time as well as across space.**

A boundary that works between components \(A\) and \(B\) today is not necessarily generative if evolving \(A\) forces all existing or unknown \(B_i\) to upgrade simultaneously.

Semantic substrate design therefore needs a refinement/evolution relation:

\[I_{t+1}\preceq_{\text{compatible}} I_t\]

or an explicit version/conversion mechanism.

### CRDTs show that a stronger algebra can replace coordination


Automerge exposes collaborative data structures that can merge concurrent changes independently of a particular network topology. [^turn4search5] Research CRDTs for text such as Peritext add specific semantic rules to preserve meaningful rich-text behaviour under concurrent edits. [^turn4search6]

The lesson is broader than collaborative editing:

> When a global guarantee appears to require a coordinator, look for an algebraic restriction on operations that makes conflicting execution orders equivalent.

This is exactly the kind of inverse design question the proposed framework should encourage.

The qualification is again important: subsequent work on text CRDTs demonstrates that mathematical convergence does not exhaust application semantics; stronger properties such as non-interleaving of logically contiguous edits may also be required. [^turn11search17]

So the method is:

\[
\text{desired user-visible guarantee}

\rightarrow

\text{derive required algebra}
\]

and not simply:

\[
\text{use a CRDT}

\rightarrow

\text{assume collaboration is correct}.
\]

### Capabilities show how a negative constraint becomes a positive guarantee


A capability design removes ways to exercise authority.

Without that restriction:

```text
component
   ├── global namespace
   ├── ambient credentials
   ├── arbitrary file/network access
   └── hidden delegation
```


With capability discipline:

```text
component
   |
   +-- capability A -> object X : read
   |
   +-- capability B -> service Y : invoke
```


seL4 makes the kernel enforce this relation; capDL then exposes the authority topology to analysis. [^turn14search0][^turn14search9]

This is directly applicable to environments containing people, models and software: the semantic substrate can leave proposal generation unconstrained while making **commit authority** explicit.

### Proposal and commit as a derived pattern


"Proposal -> validation -> commit" is not one universal named architecture, but it appears repeatedly wherever speculative computation must be separated from authoritative state.

Hyperledger Fabric executes proposals and obtains endorsements before ordered transactions are finally validated and applied to ledger state. [^turn10search13][^turn10search16] Ethereum similarly distinguishes an offered transaction from a valid state transition: protocol checks, execution and gas rules determine whether and how it changes state. [^turn10search1][^turn10search2]

This gives a useful general pattern for systems with humans or generative models:

```text
arbitrary / generative computation
              |
              v
           Proposal
              |
      semantic boundary
              |
     type / policy / authority /
     invariant / provenance checks
              |
              v
            Commit
              |
              v
       canonical state/effect
```


The benefit is not that the proposal generator becomes trustworthy. The substrate narrows the set of consequences the generator can cause.

Recent 2026 work on LLM-agent runtimes is independently moving towards this boundary: trace contracts, capability mediation, canonical-state/commit separation and runtime validation are active research directions, though much of this literature remains preprint or working-paper work rather than settled theory. [^turn19search3][^turn19search2]

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The intervening formal derivation is now in [Constraint, guarantee, and composition models]({{< ref "ai/design-research/01-foundations/07-constraint-guarantee-and-composition-models" >}}). The complete comparison table follows below.

## Comparison of approaches


"Openness" below means whether a previously unknown implementation can participate by satisfying a published local boundary, without the substrate designer enumerating that implementation in advance. It does not mean that every possible composition is valid.

| Approach | Primary goal | Main constraint | Guarantee or reasoning benefit | Enforcement | Openness to unknown components | Main trade-off |
|---|---|---|---|---|---|---|
| **Refinement** [^turn1search0] | Correct implementation of abstractions | Implementation behaviours must refine specification behaviours | Properties established at abstraction can be transferred through an appropriate refinement relation | Proof, model checking, refinement checker | High when specification is stable | Constructing refinement relations can be difficult; plain trace models miss richer properties |
| **Assume-guarantee contracts** [^turn15search11][^turn15search4] | Compositional verification/design | Explicit environment assumptions and component guarantees | Derive global properties from local contracts; quotient/assumption synthesis can solve inverse problems | Static verification/model checking | High for compatible contract implementations | Assumptions can be hard to discover and circular dependencies need careful semantics |
| **Interface theories** [^turn14search3][^turn14search8] | Compatibility and substitutability | Explicit admissible input/output interaction | Pluggability, refinement-preserving composition | Interface analysis | High | Rich interaction semantics make checking more complex |
| **Ordinary type systems** [^turn16search5][^turn16search6] | Rule out classes of invalid programs | Terms must satisfy typing judgement | Type-specific safety properties, substitution and local checking | Compiler/static checker | Very high | Guarantees usually stop at the language/type boundary |
| **Module systems / behavioural subtyping** [^turn6search16][^turn16search0] | Independent implementation and replacement | Public interface/specification hides implementation while preserving required behaviour | Abstraction and substitutability | Compiler + specification discipline | High | Opacity and useful dependency information must be balanced |
| **Algebraic/type-and-effect systems** [^turn5search0][^turn5search2] | Make side effects explicit/composable | Effect capabilities appear in signatures or handlers | Reason locally about classes of effect | Static types + handlers/runtime | High | Effect visibility does not automatically establish authority or semantic correctness |
| **Capability systems** [^turn14search0][^turn14search9] | Constrain authority | No effect on protected resource without explicit capability | Isolation, least authority and controlled delegation | Kernel/runtime, unforgeable tokens, sometimes cryptography | High within granted authority | Requires careful capability distribution and revocation strategy |
| **Capability calculus** [^turn13search0][^turn13search4] | Static resource/concurrency reasoning | Operations require statically tracked capabilities | Memory safety, resource properties or confluence depending on calculus | Type checker | High inside language | Strong annotations/analysis can restrict programming model |
| **π-calculus / process theories** [^turn6search6] | Reason about communicating/dynamic systems | Processes constructed from a formal interaction calculus | Behavioural equivalence and compositional concurrency reasoning | Formal semantics/proof tools | High at calculus level | Mapping rich real systems faithfully into the calculus is non-trivial |
| **Unix/POSIX** [^turn2search0][^turn2search8] | Cheap composition of tools | Narrow stream/process conventions | Structural pipeline composability | OS and shell conventions | Very high | Very weak semantic contract |
| **Relational/SQL model** [^turn7search0][^turn7search16] | Data independence and declarative querying | Logical relational representation; physical plan hidden | Optimiser freedom and reduced coupling to storage | DBMS/query planner | High for conforming clients | Limited control over execution; abstraction does not encode domain semantics |
| **Protobuf/gRPC** [^turn18search1][^turn18search4] | Cross-language RPC interoperability/evolution | IDL, typed messages, compatibility rules | Wire compatibility and generated interfaces | Schema compiler/runtime | High | Syntax/wire compatibility is weaker than behavioural compatibility |
| **Kubernetes API/controller model** [^turn17search0] | Extensible declarative control plane | Resource schemas, desired-state model, controller conventions | Generic tooling and independently installed extensions | API server, validation, RBAC, controllers | High | Poor fit for transactional/RPC/high-throughput domains |
| **Consensus/Raft** [^turn11search0][^turn11search2] | Strong replicated-state abstraction | Participants obey one consensus/log protocol | Agreed ordering/state-machine replication | Distributed protocol | Conditional | Coordination affects availability and latency |
| **CRDTs** [^turn11search6][^turn11search12] | Replicated convergence without synchronous coordination | Update and merge algebra | Strong eventual consistency for conforming datatype | Datatype implementation | Conditional to high | Algebra restricts data semantics; convergence may underspecify user intent |
| **Blockchain VM/state machine** [^turn10search1][^turn10search4] | Replicated execution across mutually distrusting nodes | Deterministic transition protocol, transaction validity, resource rules | Reproducible replicated state under consensus | Protocol + cryptography + VM | High for programs accepted by VM | Cost, latency, limited execution model; application correctness remains separate |
| **Structured/functional programming** [^turn12search2][^turn12search1] | Make programs locally understandable | Restricted control flow/state manipulation and structured combining forms | Easier compositional reasoning and algebraic manipulation | Language design/compiler/programming discipline | High | Some low-level expressiveness/convenience is deliberately surrendered |

Three comparisons are especially important.

First, **wire compatibility, behavioural compatibility and authority compatibility are different properties**. Protobuf may prove that a message can be decoded; an interface contract may establish that the interaction protocol remains valid; a capability system may establish that the caller is authorised. One does not imply the others. [^turn18search4][^turn14search3][^turn14search0]

Second, **consensus and CRDTs put constraints in different places**. Consensus constrains global execution order; CRDTs constrain the operations/data algebra. The builder should choose according to the required observable guarantee. [^turn11search5][^turn11search6]

Third, **Unix and capability systems represent opposite ends of semantic richness**. Unix intentionally provides a semantically weak composition boundary; capability systems add strong semantics precisely where effects and authority make a weak boundary unsafe. A future semantic substrate can therefore be thin in some dimensions and strict in others.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Citation definitions for the imported report sections


The definitions below are local copies of the entries used in these passages. The [complete original bibliography]({{< ref "ai/design-research/01-foundations/02-semantic-substrate-design-report" >}}#references) remains in the report. The copies are separate from the original source text.

[^turn1search0]: [The Existence of Refinement Mappings](https://www.microsoft.com/en-us/research/publication/the-existence-of-refinement-mappings/)

[^turn14search3]: [Interface theories for component-based design](https://research-explorer.ista.ac.at/record/4623)

[^turn15search11]: [Compositional assume-guarantee reasoning for input/output component theories](https://www.sciencedirect.com/science/article/pii/S0167642314000057)

[^turn2search7]: [The Principle of Least Power](https://www.w3.org/2001/tag/doc/leastPower-2006-01-23.html)

[^turn6search16]: [A type-theoretic approach to higher-order modules with sharing](https://doi.org/10.1145/174675.176927)

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
