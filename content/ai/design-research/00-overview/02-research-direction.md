---
draft: false
toc: true
description: "Proposes testing executable epistemic contracts in a narrow investigation paper, then generalizing toward shared heterogeneous computation with explicit authority, provenance, and commitment."
title: "02 Research Direction"
linkTitle: "02 Research Direction"
---
# Research direction and proposed investigation paper


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Scope and status


The retained LLM dialogue recommends an investigation paper, then reframes the wider program around shared heterogeneous computation. The paper sequence and publication advice remain proposals.

The [research-scope note]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) separates the general theory, builder method, and applications. It also distinguishes investigation, behavioral compilation, and human collaboration. The shared-runtime architecture below is an application, and the reassembly does not select it as the definition of the general problem.

External literature and novelty claims in the dialogue have not been independently verified during reassembly.

<a id="retained-dialogue"></a>

## Development of the proposal


The proposal is to treat this as a research project first, with the startup as a possible consequence. The paper should test one narrow computational claim, not try to publish the whole platform vision at once. The following proposal identifies a paper thesis, experiments that could falsify it, and material to keep outside the first paper.

The current literature changes the positioning. A generic "LLM proposes a typed plan, compiler validates it" paper would now overlap heavily with PlanCompiler; formal control-flow verification overlaps AgentVerify; explicit query algebra overlaps RUBICON.

The part in the research notes that still looks like the sharper research contribution is **epistemic contracts as executable program semantics**: coverage, provenance, authority, contradiction handling, abstention, and resource limits. The research notes already identify that boundary clearly.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The proposal is to publish it. But the proposal is to reduce the first paper to one falsifiable claim and resist publishing the entire "agent operating environment" vision at once.

The proposed paper is approximately:

**"Typed Epistemic Contracts for LLM-Based Investigation"**

The research question:

> Can we make properties such as evidence coverage, provenance, authority resolution, contradiction handling, and abstention part of a program's semantics, and does enforcing those properties improve the reliability of LLM investigations?

That is sharper than "a compiler for agents." Generic typed-plan compilation is already being explored by PlanCompiler; temporal verification of agent control flow by AgentVerify; explicit query algebra and cost-based execution by RUBICON; and LLM proposal + symbolic rejection by AutoSpec+. ([arXiv](https://arxiv.org/abs/2604.13092?utm_source=chatgpt.com "PlanCompiler: A Deterministic Compilation Architecture for Structured Multi-Step LLM Pipelines"))

The proposed distinction in the research notes is explicit: conclusions should only be constructible when the investigation has satisfied declared epistemic requirements.

The proposal is to run the project like this:

1. **Define a very small language.** Maybe `search`, `screen`, `extract`, `support`, `contradict`, `resolve_authority`, `verify_coverage`, `synthesize`, and `abstain`. Don't build the visual environment, multi-agent system, Petri-net runtime, custom DB, or optimizer yet.
2. **Give values epistemic types/effects.** For example:

```text
    EvidenceSet<
        coverage = Complete,
        provenance = Exact,
        authority = Verified,
        conflicts = Resolved
    >
```


    and make `FinalFinding` impossible to produce from weaker evidence. This is already the strongest compiler idea in your notes.
3. **Separate what you can prove from what you can't.** Don't claim that the compiler proves "this paragraph really supports this claim." It can't. It can prove or check things such as whether the span exists, whether every final claim has lineage, whether the declared corpus was screened, whether authority resolution ran, and whether an incomplete result was prevented from becoming a final result. The research notes make exactly this distinction. This limitation actually makes the research framing stronger.
4. **Build a benchmark designed specifically to break ordinary RAG/agents.** The proposal is to create perhaps 100-300 carefully constructed investigation questions, close to what you already proposed. Include required evidence, distractors, contradictory documents, superseded documents, rare facts, authority conflicts, and questions for which the correct result is abstention. Use at least one controlled corpus where you know the complete evidence set, plus one real public corpus so the evaluation isn't purely synthetic.
5. **Use strong, controlled baselines.** Compare against strong hybrid RAG, an iterative agentic RAG system, exhaustive LLM screening as an expensive upper baseline, and crucially the proposed runtime with the contracts removed. Keep models and retrieval components as constant as possible. The last comparison tells you whether the semantics themselves provide value.
6. **Measure outcomes that correspond to the thesis.** The proposed primary metric is the existing idea, **critical evidence omission rate**. Then measure evidence recall, contradiction recall, unsupported-claim rate, correct abstention, provenance integrity, contract violations, cost, and latency. The proposal is to care much less about generic answer-similarity scores.

There is also a clean formal result available. You could define the type/effect semantics and prove something along the lines of:

```text
If program P type-checks as

    Investigation -> FinalFinding<Complete, Exact, Resolved>

and the physical operators satisfy their declared contracts,

then a successful execution of P cannot produce
a FinalFinding lacking the corresponding runtime certificates.
```


The theorem is conditional: it concerns properties of the computation around probabilistic operations. It does not claim to prove the LLM's semantic judgment.

That gives the paper three contributions that fit together: a computational model, an implementation, and empirical evidence.

The specific recommendation is to **not make Colored Petri Nets the headline of paper 1**. They're worth experimenting with as an execution semantics or lowering target--the notes identify good reasons for them--but "agents on Petri nets" is already being explored publicly. ([HASH](https://hash.ai/blog/petri-nets-for-agentic-ai?utm_source=chatgpt.com "Petri Net-Powered Agents - HASH Blog")) If Petri nets turn out to be essential to a theorem or capability, they can become part of the paper. Otherwise they're an implementation choice.

Likewise, leave the optimizer mostly out. Once you prove that `coverage=complete` and `coverage=best_effort` are meaningfully different program contracts, a second paper can ask how to choose the cheapest physical plan satisfying a contract. That is where the proposed cost/quality optimizer becomes a substantial research problem. The research notes already formulate exactly that compiler problem as epistemic requirements + resource budget + available operators -> physical plan.

On publication, the proposal is to lean open: release the language implementation, benchmark, evaluation harness, and enough operators to reproduce the paper. Keep product integrations and UI work separate. That gives other researchers something concrete to attack, extend, and compare against. It also makes the claim much harder to dismiss as an architecture essay.

The result sought before writing the paper is simple: **under the same models and roughly comparable resources, does making epistemic requirements executable cause the system to omit less critical evidence, make fewer unsupported conclusions, and abstain correctly more often?**

If yes, you have a paper with a clear contribution. If the difference disappears under good baselines, you've learned something important before spending a year building the larger environment.

And if that first result works, _then_ the proposal is to generalize from "investigation programs" toward the broader question already present in the research notes: whether probabilistic agent behavior can live inside a deterministic, typed, verifiable computation model. That is a much larger research program; the investigation paper can provide the first empirical foundation for it.

The next proposed step is to describe the whole program as a progression:

```text
Evidence-seeking computation
        ↓
typed investigation programs
        ↓
verified agent workflows
        ↓
adaptive probabilistic programs
        ↓
general agentic computation model
```


That progression is already present in the research notes as "evidence-grade investigation -> reusable investigation programs -> generalized verified agent workflows -> agent computation platform."

And the proposal is to keep one distinction very clear throughout the research program:

**the symbolic system does not prove that an LLM judgment is semantically correct.**

It proves and enforces properties around that judgment: which inputs existed, which operations ran, which permissions were satisfied, which dependencies were traversed, what provenance was preserved, whether required branches completed, and whether a result with weaker guarantees was allowed to masquerade as a stronger one.

That boundary makes the research program credible.

Provisional neutral names for the field of inquiry are something like **programmable probabilistic agent computation** or **verified agentic computation**. The proposal is to avoid locking the project to "investigation," "Petri nets," or even "agents" too early. The broader subject is the semantics, execution, and verification of programs containing probabilistic neural operators.

The main startup warning is strategic: The proposal is to **not start by selling "general-purpose agent runtime."** That immediately puts you against LangGraph, Temporal, DBOS, OpenAI/Anthropic agent SDKs, orchestration frameworks, eval platforms, and cloud vendors.

The proposal is to use the broader architecture internally while selling one hard vertical problem.

A sensible trajectory is:

```text
1. Evidence-grade investigation
           ↓
2. reusable investigation programs
           ↓
3. generalized verified agent workflows
           ↓
4. agent computation platform
```


If the underlying abstractions are good, the generalization will happen naturally.

## reframing


according to [Problem Framing]({{< ref "ai/architecture-dsl-like/dsl-approach/problem-framing" >}})

TODO: Clarify the original `XX` marker; no further text is recorded here.

The proposal is to make one substantial change to `research-direction.md`: keep the first paper almost exactly as it is, but change the umbrella research program.

The file currently generalizes toward:

> "Can probabilistic agent behavior be embedded inside a deterministic, typed, inspectable, and verifiable computation model...?"

The later critique is that this still puts too much weight on the LLM/agent. The broader idea in the newer framing is stronger:

> the computation consists of heterogeneous participants contributing to a shared world, while the runtime controls what becomes authoritative state and what can affect the external world.

That follows directly from the distinction in the newer notes between opaque component behavior and constrained system behavior. Participants can generate arbitrary candidates; accepted state transitions go through permissions and checks.

<a id="what-i-would-keep"></a>

### Elements proposed for retention


The proposal is to keep the first research project very narrow:

**Typed Epistemic Contracts for LLM-Based Investigation**

The claim in `research-direction.md` is good because it is falsifiable:

> Can coverage, provenance, authority resolution, contradiction handling and abstention become program semantics, and does enforcing them improve investigation reliability?

The corresponding theorem shape is also exactly right: if a program produces `FinalFinding<Complete, Exact, Resolved>`, then execution must carry the required certificates. It explicitly does **not** prove that an LLM's semantic judgment is correct.

That is an excellent first instance of the larger idea.

So the proposal is to preserve:

`epistemic contracts -> compiler/runtime enforcement -> empirical improvement`

and build that before the larger platform.

<a id="i-would-reorganize-the-seven-research-areas"></a>

### Proposed reorganization of the seven research areas


The current seven areas are good, but the proposal is to change their hierarchy. Right now "shared computation between humans and agents" is item 6.

The working interpretation is that that has become the parent problem.

The proposal is to structure the research program approximately as:

1. **Shared computation semantics**
    What are participant, state, artifact, proposal, transition and effect?
2. **Contracts, authority and provenance**
    What properties can be represented and enforced? Types, effects, capabilities, obligations, lineage and invariants live here.
3. **Open-ended coordination**
    How can participants dynamically construct and modify computation without losing the guarantees?
4. **Durable execution**
    Transactions, concurrency, recovery, time, external effects, replay.
5. **Human interaction with computation**
    How do people inspect and modify the same computational object that models and programs modify? The current structured-projection question remains useful here.
6. **Physical planning and optimization**
    Given a valid logical operation, choose models, search strategies, people, tools, parallelism, etc. The existing "query optimization for probabilistic computation" fits here.

The LLM-specific questions then cut across these areas. They don't define the architecture.

<a id="and-i-would-make-the-research-sequence-concrete"></a>

### Proposed research sequence


The revised proposal gives the following progression:

```text
Paper 1
Epistemic contracts
"Can guarantees around uncertain semantic operations
be made executable?"

        ↓

Paper 2
Shared transition semantics
"Can heterogeneous participants operate over one
typed, authoritative shared state?"

        ↓

Paper 3
Open-ended composition
"Can participants dynamically change the computation
while preserving contracts?"

        ↓

Paper 4
Physical planning
"Can the system choose cheap/effective implementations
while preserving the logical contract?"

        ↓

HCI / system work
"Can humans and models jointly inspect, construct,
debug and govern these computations?"
```


This also gives the first paper a much better role. `research-direction.md` currently describes the progression as evidence-seeking computation -> typed investigation programs -> verified agent workflows -> adaptive probabilistic programs -> general agentic computation.

The proposal is to change the latter half:

```text
typed investigation programs
        ↓
contract-governed computation
        ↓
shared heterogeneous computation
        ↓
open-ended programmable environments
```


The shift is subtle but important. The revised research aim is no longer to generalize **an agent architecture**.

The aim is to discover the **computational substrate in which agents, humans, models and ordinary software can coexist**.

And the working interpretation is that the central thesis underneath all of it becomes:

> **Leave participant behavior open-ended. Make shared state transitions, authority, effects, provenance and required invariants part of the semantics of the environment.**

That is the proposed basis to carry forward from the previous comparison and use to rewrite the upper half of `research-direction.md`.
