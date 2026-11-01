---
draft: false
toc: true
description: "An initial agent-platform outlook is reworked into a computational-platform proposal centered on typed programs, durable authoritative state, contracts, provenance, and verification, with harnesses treated as replaceable execution policies."
title: "Perspective Topics"
linkTitle: "Perspective Topics"
---
## perspective


Working forecast as of August 2026: put **long-running delegated work + the harness/runtime needed to support it** at the center of the 2026 -> 2027 shift.

The key change is that an AI application is becoming a **persistent execution system**, rather than a model call wrapped in a product.

Tentative ranking:

|Trend|2026 status|2027 direction|
|---|---|---|
|Long-horizon agent work|🔥 dominant|Core workload|
|Agent harness / execution loop|🔥 dominant|Becomes platform infrastructure|
|Context, state & memory|🔥 dominant|Splits into distinct platform services|
|Sandboxed durable execution|🔥 rapidly maturing|Expected infrastructure|
|Agent evaluation|🔥 rapidly maturing|Continuous production feedback loop|
|Agent identity / permissions / containment|🔥 rapidly rising|Mandatory enterprise layer|
|Skills / reusable procedures|↑ growing|Major unit of reuse|
|MCP / A2A / interoperability|↑ standardizing|Plumbing|
|Multi-agent systems|lots of attention|Useful selectively|
|Bigger context windows|still important|Increasingly treated as one resource among several|

### 1. Long-running work is the main capability shift


This is no longer mostly speculation.

OpenAI reports that by May 2026, 70% of sampled Codex users had requested at least one task estimated to represent more than an hour of human work, and 25.6% had requested one estimated above eight hours. ([OpenAI](https://openai.com/index/how-agents-are-transforming-work/ "How agents are transforming work | OpenAI")) Anthropic similarly says Claude usage is shifting from conversations toward long-running agent tasks. ([Anthropic](https://www.anthropic.com/research/economic-index-june-2026-report?trk=public_post_comment-text "Anthropic Economic Index report: Cadences \ Anthropic"))

METR's measurements are even more useful conceptually. Their frontier-agent **task horizon** has continued to grow quickly; by early 2026 some software benchmarks were already becoming saturated, with agents completing work corresponding to days of expert human effort and, on particular reimplementation tasks, sometimes weeks. They caution that this is human-equivalent task difficulty, not literal uninterrupted runtime. ([Metr](https://metr.org/time-horizons/ "Task-Completion Time Horizons of Frontier AI Models - METR"))

Proposed 2027 question:

> How do we safely delegate a piece of work, come back hours later, and get a trustworthy artifact?

That's a much bigger systems problem than chat.

### 2. Harness engineering is becoming a first-class discipline


Working assessment: harness engineering deserves attention as a separate discipline.

The **harness** is everything surrounding the model that lets it repeatedly observe -> reason -> act -> verify -> continue.

It increasingly owns things such as:

- context construction
- tool selection and invocation
- planning / task decomposition
- retries
- verification
- context resets and compaction
- subagents
- checkpoints
- workspace management
- approvals
- stopping criteria

Anthropic has explicitly been publishing about _harness design for long-running application development_, including resetting contexts and handing structured state to fresh agents when long runs lose coherence. ([Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps "Harness design for long-running application development \ Anthropic"))

OpenAI's 2026 Agents SDK similarly describes a model-native harness plus sandboxed execution specifically for long-horizon work. ([OpenAI](https://openai.com/index/the-next-evolution-of-the-agents-sdk/ "The next evolution of the Agents SDK | OpenAI"))

There's even current research using terms like **"loop engineering"**: optimizing the whole iterative execution system, rather than evaluating a model by itself. ([arXiv](https://arxiv.org/abs/2608.00267 "LoopsBench: From Harness Engineering to Loop Engineering in Coding Agent Evaluation"))

Forecast: this may be one of the defining AI-engineering topics of 2027.

There is an important caveat: **harnesses have a short half-life**. Anthropic explicitly points out that harness logic often encodes compensations for weaknesses that later models stop having. ([Anthropic](https://www.anthropic.com/engineering/managed-agents?lid=8orHBY9s2fwFg2gZ "Scaling Managed Agents: Decoupling the brain from the hands \ Anthropic"))

Recommendation for a platform team: avoid building a giant proprietary orchestration framework.

Proposed investment priority: the stable pieces surrounding the loop:

**task state -> tools -> execution environment -> permissions -> telemetry -> evals -> artifacts**

while keeping the actual model loop replaceable.

### 3. "Memory" is really four different problems


Forecast: the terminology may become much clearer during 2027.

Proposed distinctions:

**Working context**

What should the model see _right now_?

This is context engineering: retrieval, tool results, compaction, summarization, context resets and keeping irrelevant information out. Anthropic describes context as a finite resource whose usefulness degrades when overloaded. ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents "Effective context engineering for AI agents \ Anthropic"))

**Task state**

What has happened in this job?

For example:

```text
goal
├── completed subtasks
├── pending subtasks
├── decisions
├── artifacts
├── environment state
├── verification results
└── next action
```


Hypothesis: for long-running agents, task state becomes more important than conventional "memory."

Recent LongHorizon-Harness research gets strong gains by moving task state outside the model context and independently verifying it before progressing. ([arXiv](https://arxiv.org/abs/2608.01964 "LongHorizon-Harness: Advancing Long-Horizon Agents for Real-World Tasks"))

**Episodic/user memory**

What should this agent retain across sessions about a user, customer or past interaction?

Google now has Agent Memory Bank; Microsoft has persistent agent memory with explicit management and retention controls. ([Google Cloud Documentation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank?hl=en "Agent Platform Memory Bank  |  Gemini Enterprise Agent Platform  |  Google Cloud Documentation"))

**Procedural memory**

What did we learn about _how to perform this job_?

This is particularly interesting. Microsoft now explicitly separates procedural memory--learned ways of completing tasks--from remembering facts, and has introduced STATE-Bench to measure whether experience improves later agent behavior. ([Microsoft for Developers](https://devblogs.microsoft.com/foundry/memory-build2026/ "Making agent memory more reliable, transparent, and production-ready | Microsoft Foundry Blog"))

That overlaps heavily with another major trend: **skills**.

### 4. Skills may become the reusable unit above tools


Tools answer:

> What can the agent call?

Skills answer:

> How does our organization perform this task?

For example:

```text
Tool:
    jira.create_issue()

Skill:
    Triage a production incident
      → gather logs
      → determine severity
      → check runbook
      → reproduce
      → create incident
      → notify owners
      → verify mitigation
```


OpenAI is now treating Skills as portable reusable workflows, including instructions, resources and tool access. ([OpenAI Academy](https://academy.openai.com/en/public/clubs/work-users-ynjqu/resources/skills "Skills - Resource | OpenAI Academy"))

This is especially relevant to the **team discovery/delivery perspective**: how a team explores possible solutions and takes responsibility for operating them.

A mature AI platform may eventually have:

```text
models
tools
skills
memory
execution
evals
```


with **skills encoding organizational know-how**.

That could be much more valuable than a giant prompt registry.

### 5. Durable execution is becoming its own infrastructure layer


Once a job lasts an hour, the usual web-request assumptions break.

Required runtime capabilities:

```text
pause / resume
checkpoint
retry
schedule
recover
fork
cancel
inspect
parallelize
```


and a durable workspace.

OpenAI's current SDK explicitly supports snapshotting and rehydrating agent environments so a failed or expired sandbox doesn't destroy the run. ([OpenAI](https://openai.com/index/the-next-evolution-of-the-agents-sdk/ "The next evolution of the Agents SDK | OpenAI")) Microsoft similarly supports persistent agent runtimes, checkpoints, sandboxes, filesystems and scheduled routines. ([Microsoft for Developers](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-build-2026/ "What's new in Microsoft Foundry | Build Edition | Microsoft Foundry Blog"))

So I expect an **agent runtime** to become analogous to an application runtime or workflow engine.

Something like:

```text
Agent definition
       ↓
Harness / loop
       ↓
Durable task runtime
       ↓
Sandbox / computer
       ↓
Tools + external systems
```


This feels like one of the clearest platform layers emerging now.

### 6. Evals are shifting from "was the answer good?" to "was the process good?"


This follows directly from long-running agents.

For a 30-second generation, grading the final response may be enough.

For a six-hour agent run, relevant evaluation questions include:

```text
Did it form the right plan?
Did it use appropriate tools?
Did it notice failure?
Did it recover?
Did it verify its work?
Did it ask for approval at the right point?
Did it waste 4 hours exploring something irrelevant?
Did it leave the environment consistent?
```


Google's current agent evaluation product includes tool-use and trajectory metrics and explicitly connects development evaluation with evaluation of production runs. ([Google Developers Blog](https://developers.googleblog.com/agent-and-model-evaluations-in-gemini-enterprise-agent-platform-are-now-ga/ "Agent and Model Evaluations in Gemini Enterprise Agent Platform are now GA - Google Developers Blog"))

Recent long-horizon research is making the same move, evaluating execution and feedback control throughout the run rather than only the final result. ([arXiv](https://arxiv.org/abs/2608.13417 "Beyond Final Scores: A Systematic Evaluation of Agents for Long-Horizon AI Research and Development"))

Proposal for an internal platform: a **closed loop**:

```text
production runs
      ↓
traces + failures
      ↓
candidate eval cases
      ↓
eval suite
      ↓
model / skill / harness change
      ↓
re-evaluate
      ↓
deployment
```


That may become the agent equivalent of CI/CD.

### 7. Security moves from content safety to delegated authority


This is another big 2026 -> 2027 change.

A chatbot can say something wrong.

An agent can:

- execute code
- send messages
- change infrastructure
- move data
- approve something
- spend money
- modify production systems.

So the questions become:

```text
Who delegated this task?
What identity does the agent act as?
What can it access?
For how long?
What actions require approval?
What is its maximum blast radius?
Can I reconstruct exactly what happened?
```


OpenAI is emphasizing boundaries, approvals and agent-native audit telemetry for Codex. ([OpenAI](https://openai.com/index/running-codex-safely/ "Running Codex safely at OpenAI | OpenAI")) Anthropic describes containment as a key engineering problem as agent access increases. ([Anthropic](https://www.anthropic.com/engineering/how-we-contain-claude "How we contain Claude across products \ Anthropic"))

Forecast: **agent identity, delegated authorization and policy enforcement** may be major enterprise platform work through 2027.

<a id="8-mcpa2a-matter-but-i-think-they-become-boring-infrastructure"></a>

### 8. MCP/A2A as ordinary infrastructure


MCP is settling into the model/agent <-> tools/data boundary.

A2A addresses agent <-> agent interaction.

Both have substantial industry backing now. MCP is under the Linux Foundation's Agentic AI Foundation, while A2A reported support from more than 150 organizations and production use in 2026. ([Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation "Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF), Anchored by New Project Contributions Including Model Context Protocol (MCP), goose and AGENTS.md"))

Recommendation: avoid making "multi-agent" the center of an AI platform strategy.

Multiple agents are useful for:

- parallel exploration
- context isolation
- independent verification
- specialization
- delegation across ownership boundaries.

But a swarm of persistent personas isn't inherently better architecture.

The forecast is that **A2A/MCP become protocols**, much like HTTP or OAuth: important plumbing that isn't where most product differentiation sits.

<a id="my-2027-platform-picture"></a>

## Proposed 2027 platform picture


Combined forecast: the center of gravity may move toward this platform model:

```text
                    AI PRODUCT / AGENT
                           │
                    ┌──────▼──────┐
                    │   Skills    │
                    │ + policies  │
                    └──────┬──────┘
                           │
              ┌────────────▼─────────────┐
              │     Agent Harness        │
              │ plan / act / verify      │
              │ context / subagents      │
              └────────────┬─────────────┘
                           │
       ┌───────────────────▼──────────────────┐
       │          Durable Agent Runtime       │
       │ tasks / checkpoints / schedules     │
       │ sandboxes / files / artifacts       │
       └──────────────┬──────────────┬───────┘
                      │              │
               ┌──────▼─────┐  ┌────▼────────┐
               │ State &    │  │ Tools / MCP │
               │ Memory     │  │ Apps / A2A  │
               └────────────┘  └─────────────┘
                      │              │
              ┌───────▼──────────────▼───────┐
              │ Identity / Policy / Security │
              └──────────────┬───────────────┘
                             │
                    ┌────────▼─────────┐
                    │ Traces + Evals   │
                    │ + improvement    │
                    └──────────────────┘
```


And this changes the platform-team question substantially.

In 2024-25 it was often:

> "Which models, vector DB, gateway and prompt management system should we provide?"

Proposed discovery question for 2026-27:

> **"What does a team need to safely delegate increasingly long pieces of work to AI, inspect what happened, and improve that work over time?"**

That leads naturally to **harnesses, durable execution, state/memory, skills, evals, permissions and observability**.

The strongest 2027 bets in this forecast are **long-horizon execution + harness/loop engineering + externalized state + eval-driven improvement**. "Memory" is absolutely part of it, but the forecast is that memory as a single product category will fragment into these more precise concepts.

# analysis One (before fund)

## Overall assessment


The perspective is directionally correct: the defining shift is from short model interactions to **persistent execution systems** that can perform delegated work over hours or days.

Refinement proposal based on a computational-platform approach: move the center of gravity one layer lower. [Source gap: the computational-platform sources referenced throughout this analysis were not linked in the original note.]

> **Long-running delegated work is the workload. The stable platform is a typed, durable state machine that compiles, executes, verifies, records, and improves probabilistic programs.**

The harness remains important, but it is a replaceable planning and control strategy. The durable platform kernel consists of:

```text
typed programs
state
effects
capabilities
obligations
provenance
compilation
physical planning
durable execution
verification
artifacts
```


That distinction matters because harness behavior will change quickly as models improve. The sources already identify this: the stable pieces are task state, tools, execution environments, permissions, telemetry, evaluations, and artifacts, while the exact model loop should remain replaceable.

## Revised platform model


Proposed revision of the platform diagram:

```text
                 USER / PRODUCT / DOMAIN EXPERT
                              │
                              ▼
                 SKILL / TYPED SOURCE PROGRAM
              goals • policies • contracts • budgets
                              │
                              ▼
                     COMPILER / VERIFIER
          types • effects • capabilities • obligations
                              │
                              ▼
                       LOGICAL PLAN
                              │
                              ▼
                CONTRACT-AWARE OPTIMIZER
                              │
                              ▼
                       PHYSICAL PLAN
                              │
                              ▼
              DURABLE RUNTIME + WORKSPACE
        checkpoints • transactions • schedules • recovery
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
       MODELS             TOOLS / MCP          HUMANS /
                                               SUBAGENTS
         └────────────────────┼────────────────────┘
                              ▼
              DURABLE TYPED STATE + ARTIFACTS
        provenance • certificates • versions • history
                              │
                              ▼
                VIEWS • TRACES • EVALUATIONS
                              │
                              ▼
               SKILL / OPTIMIZER IMPROVEMENT
```


Identity, policy, security, privacy, and resource accounting should span the entire diagram. They should not appear as a box below tools and state. Observability and evaluation should also span compilation, execution, finalization, and deployment.

The missing layer in the original perspective is therefore:

```text
skill / program
      ↓
compiler
      ↓
logical plan
      ↓
optimizer
      ↓
physical plan
```


The sources consistently treat this logical-to-physical boundary as central. An LLM can propose a program, while the compiler rejects invalid structure, missing obligations, prohibited effects, or plans that cannot meet a declared contract.

## Topic-by-topic analysis


|Perspective topic|Computational-platform interpretation|Consequence|
|---|---|---|
|Long-running delegated work|Primary workload and market driver|Requires durable, versioned computation with explicit completion conditions|
|Harness / execution loop|Replaceable planner and controller|Keep it above a stable compiler/runtime boundary|
|Context, state, memory|Several typed state systems with different semantics|Working context becomes an ephemeral view over durable state|
|Skills|Reusable versioned programs|Give skills types, effects, contracts, budgets, and evaluation profiles|
|Durable execution|Infrastructure substrate|Reuse Temporal, DBOS, Postgres, sandboxes, and schedulers|
|Evals|Feedback for verification and physical planning|Production data should train the optimizer and improve skills|
|Identity and security|Capability/effect/obligation system|Enforce delegated authority at every state transition|
|MCP / A2A|Physical adapters and transport protocols|Wrap them in typed operators with declared effects and contracts|
|Multi-agent systems|One possible physical execution plan|Agents should coordinate through shared typed state|
|Larger context windows|A resource in the cost model|Context construction becomes a materialization and optimization problem|

### 1. Long-running work


Long-running work is the strongest demand signal in the perspective. It exposes failures that short interactions can hide:

```text
lost progress
duplicated effects
stale state
unbounded exploration
policy changes during execution
model changes during execution
unclear stopping conditions
unresolved obligations
```


The computational-platform response is broader than persistence. A long-running task should be represented as a **versioned program executing over durable state**.

A run might contain:

```text
Run {
    program_version
    current_plan_version

    completed_operations
    pending_operations
    outstanding_obligations

    committed_model_results
    environment_state
    artifacts

    budget_spent
    budget_remaining

    policy_version
    approvals
    provenance
}
```


This makes a six-hour execution inspectable and recoverable. The database/runtime notes describe essentially this kind of durable, queryable execution state, including plan versions, completed nodes, evidence or artifacts, budgets, human changes, and unresolved requirements.

The strategic conclusion is:

> Long duration creates the need. Typed durable state creates the platform.

"Runs for eight hours" will become table stakes. "Preserves invariants, authority, lineage, and committed work for eight hours" is a stronger capability.

### 2. Harness and loop engineering


The harness should operate as a **planner and program repair component**:

```text
observe state
    ↓
propose logical plan or plan modification
    ↓
compile
    ├── accepted → execute
    └── rejected → return diagnostics
                       ↓
                    repair
```


It should not be responsible for enforcing correctness through prompts.

For example, the harness may propose:

```text
inspect_repository
→ modify_files
→ deploy
```


The compiler rejects it because deployment requires:

```text
TestsPassed
SecurityChecksPassed
RollbackAvailable
Approval<ReleaseManager>
```


This creates a stable boundary:

```text
Model / harness
    proposes and adapts

Compiler / runtime
    controls admissible computation
```


The sources call this the neuro-symbolic operator boundary: neural components interpret, propose, classify, synthesize, and repair; symbolic components own state transitions, permissions, dependencies, resources, provenance, temporal constraints, and verification.

This also protects the platform from model progress. Better models may need fewer critic loops, context resets, personas, or prompt conventions. They will still require authorization, transactions, budgets, provenance, recovery, and external-effect verification.

### 3. Context, state, and memory


The four-way split in the perspective is useful. The computational-platform model can define each category more precisely.

**Working context** is an ephemeral physical representation produced for one model invocation:

```text
WorkingContext =
    materialize(
        durable_state,
        current_task,
        policy,
        token_budget,
        relevance_model
    )
```


It is comparable to a database query result or materialized view. It should not be the authoritative state.

**Task state** is the authoritative state of the running program:

```text
goal
program version
completed and pending work
decisions
artifacts
environment state
verification results
outstanding obligations
```


**Episodic or user memory** is typed durable knowledge:

```text
Memory<UserConfirmed>
Memory<Inferred, confidence=.64>
Memory<Sensitive>
Memory<Expired>
Memory<Revoked>
```


The state must retain source, confidence, sensitivity, retention, visibility, and correction history. The companion analysis in the sources develops exactly this distinction between observed, inferred, confirmed, stale, private, and revoked memories.

**Procedural memory** is best represented as versioned programs or skills. It is organizational knowledge about how work should be performed.

Proposal: add three categories that the initial perspective leaves implicit:

```text
World state
    current state of repositories, accounts,
    infrastructure and external systems

Policy state
    current rules, capabilities, approvals
    and authority relationships

Artifact state
    documents, code, reports, models and other
    durable outputs produced by the execution
```


The important platform rule is:

> Model context is derived from state. It is never the sole location of state.

### 4. Skills


Skills are probably more central to this platform than the original diagram shows.

A skill should become a reusable typed program:

```text
skill TriageIncident {
    input:
        Incident

    output:
        MitigationReport<Verified>

    effects:
        observability_read
        issue_write
        user_visible

    capabilities:
        read_logs
        create_incident
        notify_owner

    obligations:
        verify_after_mitigation
        escalate_if_severity >= critical

    resources:
        max_cost
        max_time
        max_parallelism

    implementations:
        physical_plan[]

    evaluations:
        success_rate
        recovery_rate
        false_escalation_rate
        cost_distribution
}
```


This is much stronger than storing a prompt, Markdown procedure, or collection of tool instructions.

It also unifies several concepts:

```text
procedural memory
reusable workflow
organization policy
evaluation target
optimization unit
deployment artifact
```


The reusable artifact may eventually be the program itself. The visual editor, source DSL, and agent-facing AST can all be projections of that same program.

### 5. Durable execution


The perspective correctly identifies durable execution as a separate infrastructure layer. From the computational-platform position, it should be treated as substrate.

Temporal, DBOS, Postgres, sandbox providers, object stores, and existing schedulers can supply much of:

```text
pause
resume
checkpoint
retry
schedule
recover
cancel
fork
transaction
workspace persistence
```


The semantic layer remains yours.

Durability can guarantee that a refund operation resumes after a crash. It does not establish that the refund was permitted, properly approved, within policy, or verified afterward.

That separation is:

```text
Durable runtime:
    Did the computation execute and recover correctly?

Semantic runtime:
    Was this transition admissible?
    Which authority permitted it?
    Which obligations followed?
    What result type may now be constructed?
```


This is why "durable agent runtime" alone is unlikely to be a strong moat. The sources repeatedly place the differentiated layer above durability: types, effects, capabilities, contracts, temporal obligations, provenance, and logical-to-physical compilation.

### 6. Evaluation


The perspective correctly moves evaluation from final-answer grading to trajectory and process evaluation.

The computational platform should go one step further. Evaluation data should become input to both the **compiler** and the **optimizer**.

Suppose a logical operation is:

```text
ClassifySupportRequest<
    error_probability < 0.5%,
    latency < 2s
>
```


Available physical implementations might be:

```text
rules
small model
frontier model
small model + verifier
two-model adjudication
human escalation
```


The platform needs empirical information about:

```text
cost
latency
failure probability
contract violation rate
recovery rate
workload class
model version
verifier effectiveness
```


The optimizer then chooses a compatible implementation.

The investigation sources apply the same model to retrieval: measured evidence recall, contradiction recall, cost, latency, and documents screened become planning data rather than dashboard-only metrics.

This produces a stronger feedback loop:

```text
production execution
        ↓
typed traces + failures + outcomes
        ↓
evaluation cases
        ↓
operator reliability estimates
        ↓
physical planner / optimizer
        ↓
new deployment
```


Evals therefore become part of the platform's operational intelligence and eventual moat.

### 7. Identity, permissions, and containment


Security should be a cross-cutting semantic system based on:

```text
effects
capabilities
delegation
preconditions
approvals
information flow
temporal obligations
provenance
```


A tool should not simply be "enabled." It should declare what it can do:

```text
Refund {
    effects:
        external_write
        financial

    requires:
        CustomerIdentity<Verified>
        PolicyEligibility<Verified>
        Capability<Refund, scope=account>
        Approval<FinanceManager> when amount > 500

    ensures:
        RefundReceipt
        VerifyExternalState
}
```


Approvals should be typed values:

```text
Approval<
    principal = Alice,
    role = FinanceManager,
    scope = refund_8192,
    policy_version = 14,
    expires = ...
>
```


This is richer than `approved = true`. It supports reconstruction of who delegated authority, under which policy, for what scope, and for how long.

The original perspective asks the correct operational questions about identity, access, approvals, blast radius, and reconstruction. The computational-platform approach turns those questions into enforceable program semantics.

### 8. MCP, A2A, and multi-agent systems


MCP and A2A should be treated as transport and interoperability protocols.

An MCP operation becomes a physical operator with metadata:

```text
MCPTool {
    input_type
    output_type

    effects
    capabilities
    trust_boundary

    preconditions
    postconditions

    cost
    latency
    reliability
}
```


The protocol describes how to call the service. The platform determines whether the service may be called and whether its result may enter trusted state.

Multi-agent execution should be treated as one possible physical plan:

```text
logical operation:
    investigate_conflict

physical choices:
    one frontier model
    parallel specialist workers
    worker + independent verifier
    two-model adjudication
    human specialist
```


The optimizer can choose among these according to cost, reliability, context isolation, and required independence.

Agents should coordinate through shared typed state:

```text
Planner       creates Task
Retriever     creates Candidate
Extractor     creates Evidence
Critic        creates Objection
Human         creates Approval
Synthesizer   creates Finding
```


They should not depend on long free-form agent conversations as the authoritative record. The source architecture explicitly proposes typed artifacts in shared state and gives agents separate capabilities over the same runtime.

### 9. Bigger context windows


The perspective is correct to treat context as one resource among several.

From the compiler perspective, context selection is a physical planning problem:

```text
logical requirement:
    compare all applicable policies

physical context plan:
    retrieve current policies
    expand governing sections
    include prior decisions
    remove superseded material
    compact completed-task history
    allocate 40k tokens
```


The optimizer can trade:

```text
tokens
latency
cost
coverage
recency
authority
context coherence
```


A larger context window expands the available physical plans. It does not change the semantic model.

## What the original platform picture is missing


Four layers need to be explicit.

First, **source program and typed IR**. Skills and policies need a machine-readable representation shared by humans, agents, compilers, and visual tools.

Second, **compilation and contract checking**. The compiler must derive obligations, reject incapable plans, and separate deterministic checks from uncertain model judgments. The sources distinguish static guarantees, runtime assertions, and post-execution or evidence validation.

Third, **logical and physical plans**. A logical operation such as:

```text
find_evidence[coverage=complete]
```


cannot be implemented by ordinary top-k retrieval. The optimizer may choose any physical plan that satisfies the contract, subject to cost and time limits.

Fourth, **certificates and finalization**. Completion should not mean "the agent stopped." It should mean that the runtime has either:

```text
produced the certificates required
for the requested result type
```


or:

```text
returned a qualified result / abstention
with unresolved obligations
```


The research synthesis describes this sequence directly: compiler checks that a physical plan can produce required certificates; execution produces them; finalization accepts or rejects the requested result type.

## Revised priority order


Proposed classification of the perspective topics:

### Workload driver


1. **Long-horizon delegated work**

This creates demand for the rest of the system.

### Stable semantic core


2. **Typed durable state**
3. **Effects, capabilities, contracts, and obligations**
4. **Skills as versioned programs**
5. **Compiler and contract-aware finalizer**
6. **Provenance, artifacts, and certificates**
7. **Logical-to-physical optimizer**

These are the layers most likely to survive model changes.

### Infrastructure becoming table stakes


8. **Durable execution**
9. **Sandbox and workspace infrastructure**
10. **Tool adapters, MCP, and A2A**
11. **Enterprise identity integration**

These remain necessary, but much of their lower-level implementation can be reused.

### Replaceable execution policies


12. **Harness and loop design**
13. **Context-construction strategy**
14. **Model routing**
15. **Multi-agent topology**

These will change rapidly with model capability and economics.

### Compounding commercial advantage


16. **Production evaluation data**
17. **Learned cost, risk, and reliability models**
18. **Verified operator libraries**
19. **Domain contract and policy packs**
20. **Collaborative visual environment**

This matches the commercial strategy in the sources: open or standardize the semantics, then own the operational intelligence needed to execute those semantics well.

## Product and research implications


Product-positioning proposal: avoid centering the product on "a better harness" or "a durable agent runtime." Those markets will be crowded and the underlying capabilities will increasingly come from model providers, clouds, and workflow vendors.

The external product should solve one consequential workflow:

```text
evidence-grade enterprise investigation
safe customer-support actions
controlled financial operations
verified coding and deployment
security or compliance remediation
```


The internal architecture can remain the generalized computational platform.

For research, the strongest object is not harness engineering. It is:

> **The semantics and execution of programs containing probabilistic neural operators inside a typed, durable, inspectable state machine.**

Investigation is a good first domain because coverage, authority, contradiction, provenance, and abstention provide clear contracts that ordinary workflow benchmarks do not capture. The broader research direction is already stated in the sources as embedding probabilistic agent behavior inside a deterministic, typed, inspectable, and verifiable computation model.

The platform-team question can therefore be sharpened to:

> **What does a team need to express delegated work as a typed program, compile it into a contract-compatible execution plan, run it durably over authoritative state, and accept the resulting artifact only when the required obligations and certificates have been satisfied?**

That is the computational-platform form of the perspective.
