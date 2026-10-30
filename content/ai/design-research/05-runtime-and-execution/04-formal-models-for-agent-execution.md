---
draft: false
toc: true
description: "Compares complementary execution formalisms: Petri nets for concurrency and resources, types and effects for local constraints, temporal logic for history obligations, and behavior trees for recovery."
title: "04 Formal Models For Agent Execution"
linkTitle: "04 Formal Models For Agent Execution"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## this separation


The proposal is to treat "neuro-symbolic" as one useful lens, but not the whole architecture. The richer opportunity is to borrow the best machinery from several mature theories--especially ones that already model concurrency, partial failure, uncertainty, invariants, and long-running processes.

The working interpretation is that the most promising move is to make the system explicitly **neuro-symbolic at the operator boundary**: LLMs propose, interpret, classify, and synthesize; a symbolic runtime owns control flow, state, permissions, invariants, lineage, and resource accounting. Recent work is converging on exactly this separation for agent verification.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The working interpretation is that "neuro-symbolic" describes the system, but **Colored Petri Nets + type/effect systems + temporal logic** may give you a much richer computational foundation than LangGraph's generic state/nodes/edges model.

LangGraph already has durable execution, shared state, dynamic `Send`, subgraphs, interrupts and checkpointing, so we shouldn't dismiss it as primitive. Its abstraction is intentionally generic, though: application semantics mostly live inside node code and state schemas. ([Docs by LangChain](https://docs.langchain.com/oss/python/langgraph/graph-api?utm_source=chatgpt.com "Graph API overview - Docs by LangChain"))

The proposal is to investigate a stronger machine.

### 1. Petri nets look especially suitable


A Petri net has:

```text
places       = states / available facts / resources
tokens       = actual typed values or resources
transitions  = computations
```


Instead of:

```text
A → B → C
```


you can express:

```text
                  Evidence
                     │
                     │
Task ──→ Retrieve ───┼────→ Analyze
                     │        ▲
Corpus ──────────────┘        │
                              │
                         Model capacity
```


A transition fires only when its required inputs are available.

That naturally represents:

- concurrency;
- joins and synchronization;
- resource constraints;
- multiple instances of the same task;
- producer/consumer relationships;
- deadlocks;
- liveness;
- retries;
- hierarchical workflows.

And **Colored Petri Nets** let tokens have types/values instead of being anonymous dots:

```text
Evidence {
    source
    claim
    authority
    provenance
}
```


So a place can contain:

```text
Evidence<Verified>[]
```


and a transition can require:

```text
Evidence<Verified>
+
Approval<Human>
```


before it can fire.

This is already being explored specifically for long-running agent systems. HASH, for example, is experimenting with Petri nets as an orchestration formalism for multi-agent AI because they give explicit concurrency, decomposition and control. ([HASH](https://hash.ai/blog/petri-nets-for-agentic-ai?utm_source=chatgpt.com "Petri Net-Powered Agents - HASH Blog"))

That makes Petri nets much more interesting to me than simply inventing a richer graph API.

### 2. Time and compute fit naturally


The earlier resource observation becomes much cleaner.

Tokens can represent resources:

```text
GPU tokens
LLM-call budget
money
API quota
human attention
```


For example:

```text
DeepScan
requires:

Question
CorpusPartition
8 × ComputeToken
$BudgetToken

produces:

Evidence
CoverageCertificate
```


If only four compute tokens exist, only four scans execute concurrently.

You could use extensions such as:

```text
Timed Petri nets
Stochastic Petri nets
Colored Petri nets
Hierarchical Petri nets
```


without changing the fundamental model.

That is already a much richer apparatus than:

```text
node()
edge()
state
```

### 3. Add a type/effect system above it


The recommendation is not to make Petri nets responsible for every property.

Let the language have types:

```text
Evidence
Claim
Approval
Source
Task
Result
```


and effects:

```text
effects {
    llm
    network_read
    filesystem_write
    financial_write
    probabilistic
    irreversible
}
```


Plus domain-specific effects:

```text
epistemic {
    incomplete_coverage
    unverified_authority
    unresolved_conflict
}
```


Then:

```text
publish : Finding<Verified> -> Report
```


cannot accept:

```text
Finding<CoverageIncomplete>
```


and:

```text
deploy
```


may require:

```text
Approval
+
TestsPassed
+
RollbackAvailable
```


This gives the compiler static reasoning that a bare graph representation doesn't provide.

Recent work on agent verification is already heading in this direction: LLMs synthesize candidate structured programs/specifications, while symbolic systems reject invalid ones. AutoSpec+ uses an LLM for specification generation and a symbolic verifier as a deterministic critic. ([ACL Anthology](https://aclanthology.org/2026.acl-demo.66/?utm_source=chatgpt.com "Formally Specifying the Intended Behavior of the Program: LLM-Driven Neuro-Symbolic Program Specification Synthesis - ACL Anthology"))

### 4. Temporal logic handles properties about the execution history


Types tell you about local operations.

Some guarantees concern sequences over time:

> Every external write must eventually be verified.

> A payment cannot occur before approval.

> Once a secret enters an untrusted context, it can never reach an external tool.

> Every started investigation must eventually produce either a result or an explicit failure.

Those are temporal properties.

Something conceptually like:

```text
always(
    financial_write ->
        previously(human_approval)
)
```


and:

```text
always(
    external_write ->
        eventually(verify_result)
)
```


This is where LTL/CTL and model checking become useful.

Current agent-verification research is explicitly treating the LLM as a nondeterministic component inside a formally observable transition system and applying temporal-logic checking to the surrounding orchestration. ([Preprints](https://www.preprints.org/manuscript/202604.1029?utm_source=chatgpt.com "AgentVerify: Compositional Formal Verification of AI Agent Safety Properties via LTL Model Checking[v1] | Preprints.org"))

That's almost exactly the architecture we're discussing.

<a id="8-process-calculi-may-be-useful-but-id-keep-them-underneath"></a>

### 8. Process calculi as a possible underlying layer


Things like CSP, π-calculus and actor semantics are powerful for:

- concurrent independent agents;
- message channels;
- dynamic agent creation;
- synchronization;
- distributed protocols.

There is current formal work explicitly combining concurrency theory with epistemic models for dynamic multi-agent systems. ([Springer](https://link.springer.com/article/10.1007/s10849-026-09461-3?utm_source=chatgpt.com "Bridging concurrency theory and epistemic models: a formal framework for dynamic multi-agent systems | Journal of Logic, Language and Information | Springer Nature Link"))

But the recommendation is not to make users write π-calculus.

It might eventually provide formal semantics for some lower-level runtime behavior.

Petri nets are much easier to:

- visualize;
- compile;
- simulate;
- monitor;
- explain to engineers.

### 9. Behavior trees are useful for one particular class of agents


Robotics has already dealt with long-running agents that must:

```text
act
fail
retry
choose fallback
recover
continue
```


Behavior trees encode that very nicely.

Recent work combines LLM planning with formal planners and behavior trees specifically because flat LLM-generated plans become difficult to manage for long-horizon execution. ([arXiv](https://arxiv.org/abs/2603.01113?utm_source=chatgpt.com "From Dialogue to Execution: Mixture-of-Agents Assisted Interactive Planning for Behavior Tree-Based Long-Horizon Robot Execution"))

One tentative proposal is to treat a behavior tree as another compilable sublanguage:

```text
retry {
    primary_action
    fallback_action
}
```


rather than the universal runtime model.

## Formal foundations and architectural synthesis


The proposal is to resist selecting one existing formalism and declaring it *the* theory. Different formalisms correspond to different kinds of guarantees. The architecture becomes cleaner if they compose.

**Type and effect systems** are the right starting point for local, compositional properties. Classical effect systems extend ordinary types with information about what an expression may do; Lucassen and Gifford's 1988 work is an early foundational example. [19](#ref-19) For agent programs, a modern effect row might be:

```text
classify :
    Document
    -> Probabilistic<Classification>
       ! { neural }

read_customer :
    CustomerId
    -> Customer
       ! { external_read, pii }

refund :
    Money
    -> Receipt
       ! { external_write, financial, irreversible }
```


The research extension is to make effects cover more than side effects:

```text
{
    neural,
    external_read,
    external_write,
    probabilistic,
    privacy<PII>,
    authority<finance>,
    irreversible,
    incomplete_coverage,
    semantic_judgement
}
```


A final value can then carry both a value type and established/refuted properties:

```text
Finding<
    provenance = complete,
    coverage   = complete,
    authority  = resolved,
    conflicts  = resolved
>
```


That generalises the epistemic type/effect idea in the compiler notes from investigations to arbitrary agentic computation. [2](#ref-2)

**Hoare-style contracts** are a good fit for state-changing operators. Hoare logic's basic idea is that an operation is related to a precondition and a postcondition; ToolGate demonstrates how naturally that maps to agent tool calls. [3](#ref-3), [20](#ref-20) A bank operation could be expressed schematically as:

```text
refund(order, amount)

requires:
    authenticated(user)
    owns(user, order)
    refundable(order)
    amount <= remaining_refundable(order)

ensures:
    refunded(order) increases by amount
    receipt exists
```


The model may decide that `refund` is useful. The symbolic runtime decides whether the transition is legal.

**Temporal logic** handles properties that cannot be decided from one operation in isolation. Pnueli's temporal-logic work supplied the classical foundation for reasoning about behaviour over execution traces; Agent-C demonstrates the direct modern application to agents. [21](#ref-21), [4](#ref-4) Examples include:

```text
always(
    financial_write
    -> previously(human_approval)
)

always(
    external_write
    -> eventually(verify_outcome)
)

always(
    secret_loaded
    -> not eventually(send_to_untrusted_tool)
)
```


Safety properties such as "payment never happens before approval" are usually easier than liveness properties such as "every started job eventually completes", because neural operators, humans and external services can stall indefinitely. That distinction should be explicit in the research programme.

**Colored Petri Nets are attractive as an intermediate representation for concurrency and resources.** Petri-net workflow research has long used tokens, places and transitions to model concurrency, synchronisation, deadlock and workflow correctness. [22](#ref-22) For this project, coloured tokens could carry typed values:

```text
Task<Order>
Approval<Human>
Budget<USD>
GPUCapacity
Evidence<Verified>
```


and a transition might require a combination before firing. The proposal is to use Petri nets primarily as a **lower-level control/resource semantics**, not as the whole language. They are weaker as a natural home for rich types, authority lattices, provenance expressions, source-level abstractions and probabilistic quality contracts.

**Provenance should be semantic, not just logging.** W3C PROV distinguishes entities, activities and agents and specifies relations such as derivation and generation; its constraint model gives a basis for checking whether a provenance history is consistent. [23](#ref-23), [24](#ref-24) Database provenance research goes further by making lineage compositional through query operations. For agentic programs, that suggests each value carries a derivation object:

```text
FinalDecision
    <- generated_by Synthesis#42
    <- used Claim#9
    <- supported_by Evidence#71
    <- extracted_by ModelCall#183
    <- from SourceSpan#819
```


For an operations agent, the same machinery could answer "which observations and model calls led to this remediation?" For a coding agent: "which requirements and repository observations caused this patch?"

**The database/compiler analogy is deeper than a metaphor.** DSPy establishes a modern precedent for declaring an LM computation and compiling/optimising its implementation. [11](#ref-11) RUBICON brings explicit database algebra, source wrappers, intermediate results and optimisation into agentic data access. [10](#ref-10) The proposed separation can therefore be formalised as:

```text
Source program
    ↓
typed + effect-checked AST
    ↓
logical agent plan
    ↓
proof / runtime obligations
    ↓
cost-quality optimiser
    ↓
physical plan
    ↓
durable execution
```


A logical operation:

```text
find_evidence[
    coverage = complete,
    authority = verified
]
```


could have multiple physical implementations, while the compiler requires each implementation to refine the same logical contract. A similar mechanism could select among small/frontier models, deterministic parsers, database queries, human review, retrieval methods or redundant model adjudication.

This gives a plausible central **soundness theorem** for the programme:

> If a source program type-checks under contract environment Γ, each physical operator implements the declared logical contract, and the runtime commits only verified state transitions, then every committed execution trace preserves the statically declared safety and provenance invariants.

That statement deliberately does **not** prove that arbitrary model-generated semantic judgements are true. ToolGate, Agent-C and SEVerA demonstrate ways to prove or enforce properties of state, sequence or output shape/content when those properties are formally decidable; they do not turn open-ended semantic interpretation into theorem proving. [3](#ref-3), [4](#ref-4), [5](#ref-5)

This boundary may be one of the strongest intellectual positions for the programme:

> **Neural operations remain uncertain. Their authority to change the world does not.**

The unresolved theoretical opportunity is then to treat the uncertainty itself more seriously. Current formal systems mostly convert the neural component into a source of candidate values and verify those values against hard predicates. A richer language could distinguish, for example:

```text
Deterministic<T>
Probabilistic<T>
Estimated<T, quality_distribution>
Certified<T, property>
```


and reason about a composition containing both hard guarantees and empirical reliability targets. SEVerA's explicit separation of hard constraints from a soft optimisation objective is one useful starting point. [5](#ref-5)

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Citation links added during reassembly


The original numbered citations link to the entries below, which point to the [shared bibliography]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#references).

- <a id="ref-2"></a>[Reference 2]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-2)
- <a id="ref-3"></a>[Reference 3]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-3)
- <a id="ref-4"></a>[Reference 4]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-4)
- <a id="ref-5"></a>[Reference 5]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-5)
- <a id="ref-10"></a>[Reference 10]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-10)
- <a id="ref-11"></a>[Reference 11]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-11)
- <a id="ref-19"></a>[Reference 19]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-19)
- <a id="ref-20"></a>[Reference 20]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-20)
- <a id="ref-21"></a>[Reference 21]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-21)
- <a id="ref-22"></a>[Reference 22]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-22)
- <a id="ref-23"></a>[Reference 23]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-23)
- <a id="ref-24"></a>[Reference 24]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-24)

## A DSL could hide almost all of that machinery


The user might write something fairly normal:

```text
agent investigate(question: Question) {

    evidence = parallel {
        lexical(question)
        semantic(question)
        generated_questions(question)
    }
    | merge
    | verify_sources

    claims = extract_claims(evidence)

    conflicts = claims
        | find_conflicts

    require coverage(evidence) >= 0.99
    require unresolved(conflicts) == 0

    return synthesize(claims)
}
```


The compiler could lower it into:

```text
typed AST
   ↓
Petri/dataflow net
   ↓
resource allocation
   ↓
temporal monitors
   ↓
physical operators
```


while the UI can show the higher-level representation.

The LLM can manipulate the same AST:

> add another counterevidence branch

> parallelize these two stages

> require human approval here

> spend another $5 trying to close requirement R7

and every mutation goes back through the compiler/verifier.

The working interpretation is that **Colored Petri Nets deserve the deepest investigation next**. They give us several things we've independently discovered we need--typed state, concurrency, joins, resources, long-running computation, formal analysis and a visual representation--in one mature formalism.

The recommendation is not to declare "our runtime is a Petri net engine" yet. But the proposal is to try to express 5-10 difficult agent workflows as Colored Petri Nets and see where the formalism breaks. Whatever can't be expressed cleanly would tell us what additional algebra the language actually needs.
