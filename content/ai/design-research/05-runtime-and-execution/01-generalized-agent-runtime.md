---
draft: false
toc: true
description: "Proposes durable typed execution around probabilistic operations, combining recorded outcomes, localized failures, controlled adaptation, and guarded program reuse with fallback when applicability assumptions fail."
title: "01 Generalized Agent Runtime"
linkTitle: "01 Generalized Agent Runtime"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The same architecture generalizes well beyond RAG.

The broader abstraction is not "retrieval pipeline." It is:

> a typed, durable, inspectable runtime for long-running probabilistic computations.

RAG becomes one workload on top.

For example, a coding agent loop:

```text
task
→ inspect repo
→ form plan
→ edit files
→ run tests
→ inspect failures
→ revise
→ request review
→ merge
```


A support agent:

```text
ticket
→ gather customer state
→ classify issue
→ retrieve policy
→ propose action
→ execute bounded action
→ verify outcome
→ escalate if needed
```


A research agent:

```text
question
→ decompose
→ retrieve
→ extract evidence
→ detect gaps
→ investigate further
→ synthesize
→ verify
```


An operations agent:

```text
incident
→ inspect telemetry
→ form hypotheses
→ run diagnostics
→ compare results
→ apply remediation
→ verify recovery
```


They all share the same computational skeleton.

The common operators become things like:

```text
observe
plan
select
search
call
transform
branch
join
retry
verify
assert
approve
wait
resume
compensate
abstain
```


Then each domain adds its own operators:

```text
research:
  find_evidence
  check_authority
  detect_conflicts

coding:
  edit_file
  run_tests
  inspect_diff

support:
  read_account
  issue_refund
  escalate

operations:
  query_metrics
  restart_service
  rollback
```


This suggests a two-layer design.

```text
Generic agent computation layer
--------------------------------
state
types
effects
durability
budgets
branching
retries
transactions
provenance
human approval
compiler
optimizer

Domain semantics
----------------
research
coding
support
security
finance
operations
```


The generic layer is potentially much larger than the original startup idea.

The compiler becomes even more valuable here because agentic loops have many failure modes that can be checked structurally.

For example:

```text
deploy(change)
require tests.passed
require reviewer.approved
require rollback.available
```


The compiler can reject:

```text
edit
→ deploy
```


because the required verification path is absent.

Or in customer support:

```text
refund(amount)
require policy_checked
require amount <= agent_limit
require customer_identity == verified
```


Again, those constraints are part of the program semantics rather than prompt text.

The same applies to resource limits:

```text
agent {
    max_time = 2h
    max_cost = $8

    require human_approval before destructive_action
    require verification after external_side_effect
}
```


And long-running execution makes the DBOS-style runtime especially relevant:

```text
step 1 completed
step 2 completed
step 3 waiting for human
process crashes
      ↓
restart
      ↓
resume from step 3
```


You also get a useful distinction between three classes of operations.

```text
Pure
----
summarize
classify
compare

Read effects
------------
search
read database
inspect repository

Write effects
-------------
send email
modify file
refund payment
deploy service
```


That can become an effect system:

```text
LLMCompare:
  effects = [probabilistic]

SearchCRM:
  effects = [external_read]

Refund:
  effects = [external_write, financial]
```


Then policies can constrain programs:

```text
policy SupportAgent {
    allow external_read

    external_write requires approval

    financial(amount > 100)
        requires human_approval
}
```


This is very close to how programming languages constrain effects, capabilities and permissions.

There is another important generalization: verification becomes an operator rather than something every agent prompt invents separately.

For example:

```text
action
→ verify(predicate)
→ success | repair
```


Coding:

```text
edit
→ verify(tests_pass)
```


Research:

```text
synthesize
→ verify(all_claims_supported)
```


Operations:

```text
restart
→ verify(error_rate < threshold)
```


Support:

```text
update_account
→ verify(expected_state)
```


So you could build a generic control loop:

```text
propose
→ execute
→ observe
→ verify
    ├── valid → continue
    └── invalid → repair
```


That is a much more fundamental abstraction than RAG.

The same goes for augmentation. You could have an agent dynamically augment its own program:

```text
initial program

task
→ inspect
→ act
→ verify
```


At runtime it discovers uncertainty:

```text
task
→ inspect
→ [NEW: gather more context]
→ [NEW: ask specialist agent]
→ act
→ verify
```


The agent modifies the logical program, the compiler validates the modification, and the runtime resumes execution.

That gives you controlled self-extension:

```text
agent proposes graph change
        ↓
compiler checks types/effects/policy/budget
        ↓
accepted
        ↓
runtime executes
```


That is much safer than allowing an LLM to arbitrarily spawn tools and agents.

The resulting proposal is to think of the larger concept as something like:

> **an operating environment for agentic computations**

with:

```text
language
compiler
runtime
state
effects
policies
verification
provenance
cost model
human controls
```


And then RAG/evidence investigation is one domain implementation.

And the working interpretation is that there is one especially promising research direction here:

> **Can probabilistic agent behavior be embedded inside a deterministic, typed, verifiable computation model?**

That question applies equally to RAG, coding agents, operations agents, support agents, scientific agents, and long-running autonomous workflows.

## Programmable probabilistic agentic computation


The proposal is to frame the generalized research program around one central question:

> **Can probabilistic agent behavior be embedded inside a deterministic, typed, inspectable, and verifiable computation model without destroying the flexibility that makes LLM agents useful?**

That is broader than investigation, RAG, or agents-as-workflows. The object of study becomes a new class of computation:

> **long-running probabilistic computations whose uncertain operations are constrained by symbolic semantics.**

The research notes already describe the target as a "typed, durable, inspectable runtime for long-running probabilistic computations."

The proposal is to organize the research program into seven connected areas.

### 1. Computational model


First ask: what is the machine?

The model probably needs to represent:

```text
state
typed values
probabilistic operations
deterministic operations
effects
resources
concurrency
branching
iteration
failure
human intervention
verification
provenance
time
```


The important split is the one already in the research notes:

```text
Neural
------
interpret
propose
classify
extract
synthesize
repair

Symbolic
--------
types
state transitions
permissions
dependencies
resources
provenance
verification
execution
```


The first theoretical question is therefore:

**What is the minimal abstract machine that can express useful agent behavior while keeping the uncertain parts explicit?**

Colored Petri Nets, dataflow, type/effect systems, temporal logic, logic programming, blackboard systems, and provenance algebra are candidate pieces of the semantics, rather than necessarily one universal formalism.

### 4. Durable execution and controlled adaptation


These programs are long-running and stateful.

The runtime therefore needs durable state, resumability, retries, checkpoints, transactions, and inspectable execution history. The DBOS analysis already motivates treating completed computation as durable state rather than restarting an entire investigation after failure.

But there is a harder question beyond workflow durability:

**Can the agent modify its own program safely while it is running?**

The research notes already contain the seed:

```text
agent proposes graph change
        ↓
compiler checks types/effects/policy/budget
        ↓
accepted
        ↓
runtime executes
```


That could become a major research area: **verified self-extension of agent programs**.

### 10. Localize failures


Failures should be associated with a stage and an artifact:

```text
Synthesis failure:
    no candidate found

Compilation failure:
    invalid program

Preflight failure:
    current state does not satisfy requirements

Execution failure:
    external operation failed

Postcondition failure:
    execution completed but result is unacceptable
```


This makes retry behavior clearer. A compilation failure calls for program repair. A service timeout may call for execution retry. A failed quality check may call for another research iteration.

Without this distinction, an agent tends to respond to every problem by generating a new plan from scratch.

### 11. Preserve observability and replay


Each transition should produce an artifact:

```text
user intent
candidate DSL source
compiler diagnostics
accepted AST
lowered execution plan
runtime trace
external results
final evaluation
```


This enables:

- replaying the same accepted plan;
- comparing two generated plans;
- explaining why execution stopped;
- auditing external effects;
- testing compiler changes;
- detecting nondeterministic operators;
- measuring which checks prevent failures.

The explicit program gives useful observability without storing private model reasoning.

### Versioning also becomes cleaner


A run could identify:

```text
program:
    revenue-procedure@42

semantic-language:
    2.1

policy:
    ey-audit-policy@17

method-catalog:
    8.4

compiled-plan:
    sha256:...

inputs:
    EvidenceSet@193
```


You can preserve the original source DSL and the canonical compiled representation.

That gives you:

```text
Source program
    ↓ reproducibly compiles to
Typed program
    ↓
Execution plan
    ↓
Run
```


And you can answer later:

> Why did workflow v42 behave differently from v41?

with an actual semantic diff rather than comparing two arbitrary JSON blobs.

## So we may want several calculi, not one giant theory


This is the architecture proposed for detailed investigation:

```text
                 USER / LLM AGENT
                       │
                       ▼
                Investigation DSL
                       │
                       ▼
                 Type checking
                  Effect checking
                 Policy checking
                       │
                       ▼
               Logical computation
                       │
        ┌──────────────┼───────────────┐
        │              │               │
        ▼              ▼               ▼
    Dataflow        Logic rules     Agent protocol
 / Petri nets        / Datalog      / Blackboard
        │              │               │
        └──────────────┼───────────────┘
                       ▼
                Execution runtime
                       │
            ┌──────────┼───────────┐
            ▼          ▼           ▼
           LLMs      tools       humans
            │          │           │
            └──────────┼───────────┘
                       ▼
                  event trace
                       │
           temporal verification
                       │
                       ▼
                   durable state
```


And provenance passes through all of it.

This is genuinely neuro-symbolic:

```text
Neural
------
interpret intent
generate candidate plans
semantic retrieval
classification
extraction
synthesis
repair

Symbolic
--------
types
state transitions
dependencies
permissions
resources
rules
provenance
temporal constraints
verification
execution
```


The neural system proposes things the symbolic system cannot easily derive.

The symbolic system controls things we do not want the neural system to improvise.

## Durable runtimes, open-source systems and industry practice


The durable-execution part of the research programme does not need to be invented from scratch. Existing systems already solve substantial parts of persistence, replay, timers, retries and human pauses. The research question is how to give those facilities **typed agent semantics**.

| Project | Scope / formalism | Runtime and durability | Verification | HITL | Evaluation/usage orientation | Licence |
|---|---|---|---|---|---|---|
| [**Temporal**](https://github.com/temporalio/temporal) | General durable workflow programming | Event-history replay; long-running workflows; nondeterministic I/O isolated into activities | Runtime determinism/replay discipline, not domain semantic verification | Strong: workflows can wait on external events/humans | Production distributed workflows and explicit AI-agent reference architecture | **MIT**. [17](#ref-17), [25](#ref-25) [25](#ref-25) |
| [**DBOS**](https://github.com/dbos-inc/dbos-transact-py) | Database-backed durable execution | Workflow state/checkpoints persisted in Postgres; completed model/tool steps can be reused after recovery | Transaction/recovery semantics; application contracts remain the developer's job | Supported through durable workflows/events | Explicit LLM/agent integrations and durable streams | **MIT** for DBOS Transact Python. [18](#ref-18), [26](#ref-26), [27](#ref-27) [26](#ref-26) |
| [**LangGraph**](https://github.com/langchain-ai/langgraph) | Stateful graph abstraction for agent programs | Checkpointed state/threads, persistence, resumability, fault tolerance | Graph/state structure, but no general formal contract system | **Strong** interrupts and resume primitives | Agent orchestration | **MIT**. [28](#ref-28), [29](#ref-29) [30](#ref-30) |
| [**Restate**](https://github.com/restatedev/restate) | Durable services/workflows | Durable invocations, state, timers and exactly-once-oriented communication semantics | Infrastructure-level execution guarantees | Supported | General durable applications including agents | **Business Source License 1.1**, therefore source-available rather than currently OSI-open-source; versions convert to Apache-2.0 after the stated four-year change period. [31](#ref-31) [31](#ref-31) |
| [**DSPy**](https://github.com/stanfordnlp/dspy) | Declarative LM programming + compiler optimisation | Ordinary program execution; no durable-workflow semantics | Empirical metric optimisation | Application-defined | Prompt/model/program optimisation | **MIT**. [11](#ref-11) [12](#ref-12) |

Temporal's AI-agent architecture is especially relevant to a subtle problem: **replay of stochastic computation**. Temporal recommends keeping workflow orchestration deterministic while placing model calls, tool calls, database reads and other nondeterministic I/O in Activities. During recovery, recorded results can be replayed rather than asking the model to regenerate an allegedly "same" answer. [17](#ref-17) DBOS's current agent integrations apply a related idea by checkpointing model/tool steps so a recovered workflow does not have to repeat every completed model call. [18](#ref-18), [27](#ref-27)

That gives the proposed research programme a useful semantic distinction:

```text
replay(program execution)
    !=
rerun(neural inference)
```


A durable runtime should normally replay the **recorded value and model provenance** from an already committed neural operation. A deliberate recomputation should be a different operation, producing a new version of that value and a new provenance edge. This becomes important whenever a provider silently updates a model, sampling is nondeterministic, external data changes or a prompt depends on current state.

DBOS also supplies a systems precedent for treating computation state as database state. Its foundational DBOS work proposes building system facilities over transactional database state, and the current workflow system uses that idea for durable application execution. [32](#ref-32), [18](#ref-18) That matches the proposal for an inspectable runtime where completed computation, budgets, provenance, agent state and dependencies remain queryable rather than disappearing into an in-memory agent loop. [16](#ref-16)

The main missing layer across these runtimes is semantic. Temporal can faithfully resume:

```text
RefundCustomer(order=42)
```


but the generic runtime does not know that refunding requires verified identity, policy eligibility and a financial-authority capability. LangGraph can checkpoint an `EvidenceSet`, but it does not know that a `FinalFinding` should be unconstructible from evidence with incomplete provenance. DBOS can ensure a workflow step survives process failure, but that is different from proving the step was epistemically or organisationally legitimate. [17](#ref-17), [18](#ref-18), [28](#ref-28)

That is a promising implementation strategy for research: **compile onto an existing durable runtime** and make the new contribution the language, effects, contracts, provenance and verification semantics.

The resulting proposal is to prototype the stack approximately as:

```text
Language / typed IR                 ← research
Effect + capability checker         ← research
Contracts + temporal obligations    ← research
Logical → physical planner          ← research
Provenance model                    ← research

Temporal or DBOS                    ← reuse
Postgres                            ← reuse
Model APIs / local models           ← reuse
Search / SQL / tools                ← reuse
```


This keeps the paper focused on the semantic contribution and avoids spending most of the project reimplementing a workflow scheduler.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Citation links added during reassembly


The original numbered citations link to the entries below, which point to the [shared bibliography]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#references).

- <a id="ref-11"></a>[Reference 11]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-11)
- <a id="ref-12"></a>[Reference 12]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-12)
- <a id="ref-16"></a>[Reference 16]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-16)
- <a id="ref-17"></a>[Reference 17]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-17)
- <a id="ref-18"></a>[Reference 18]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-18)
- <a id="ref-25"></a>[Reference 25]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-25)
- <a id="ref-26"></a>[Reference 26]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-26)
- <a id="ref-27"></a>[Reference 27]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-27)
- <a id="ref-28"></a>[Reference 28]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-28)
- <a id="ref-29"></a>[Reference 29]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-29)
- <a id="ref-30"></a>[Reference 30]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-30)
- <a id="ref-31"></a>[Reference 31]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-31)
- <a id="ref-32"></a>[Reference 32]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-32)

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Program versions, runs, and results


The complete [graph, repair, and branch discussions]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#7-you-probably-need-three-graphs-not-one) are now in the program-history note. Its sibling [comments note]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}) contains new explanations. The runtime's execution tiers and guarded program reuse remain below.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Execution tiers from the behavioral dialogue


The following material comes from the abstraction analysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#abstraction-analysis). The original source context remains in that note. The original arguments are retained with editorial wording.

## The strongest conceptual analogy: a tracing JIT for model behavior


A useful way to understand the proposed architecture is as a **tracing just-in-time compiler for semantic work**.

In a tracing JIT:

1. a general interpreter executes the program;
2. the runtime records frequently used paths;
3. a compiler specializes those paths;
4. guards record the assumptions under which the specialized code is valid;
5. when a guard fails, execution falls back to the interpreter.

Tracing JIT implementations explicitly use guards and return to interpreted execution when an assumption or compiled path no longer applies. [System Software Wien](https://ssw.jku.at/Research/Papers/Haeubl11/?utm_source=chatgpt.com)

The corresponding proposed architecture would be:

```
General interpreter:
    capable LLM using tools

Observed trace:
    candidate result, intermediate artifacts,
    tool calls, evidence selections, decisions

Tracing compiler:
    program-synthesis agent

Compiled trace:
    DSL program or hybrid workflow

Guards:
    assumptions about input shape, available evidence,
    source type, task class, or domain state

Deoptimization:
    fall back to the general LLM when guards fail
```


This suggests a tiered runtime:

```
Tier 0 — Direct generative execution
    General, flexible, expensive, difficult to inspect

Tier 1 — Compiled hybrid workflow
    Structured operations plus selected model calls

Tier 2 — Symbolic or deterministic implementation
    Cheap, repeatable, strongly testable
```


A node does not need to move immediately from "LLM" to "ordinary code." Compilation can be progressive:

```
one large model call
→ several typed model operations
→ deterministic preprocessing and model interpretation
→ mostly deterministic program with model fallback
→ fully compiled procedure
```


The system can compile only stable or frequently repeated paths. New or ambiguous cases remain at the generative tier.

This is a stronger architecture than attempting to synthesize a complete program for every single output.

### Distribution shift and deoptimization


A synthesized program will usually be valid for a region of the input space, not universally.

It should therefore have explicit applicability conditions:

```
supports:
    text documents with recoverable citations
    question type = comparative analysis
    source count ≤ N
    required fields available

fallback:
    direct LLM procedure
```


When those assumptions fail, the system should return to the general model, record the new trace, and possibly extend the compiled procedure.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Recorded history and later result use


The [artifact-history discussion]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#dag-versus-evolving-artifact-graph), [execution-run records]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#6-execute-and-retain-the-trace), and [rules for later result use]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#the-dag-should-probably-be-several-related-graphs) are now in the program-history note.

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Runtime support for long-running work


The complete mechanism list and coding-harness example below follow the [goal-revision discussion]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#goal-revisions-and-dependent-work). The dedicated [comments]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime-comments" >}}) explain how the proposed mechanisms relate to the work, rather than treating every mechanism as a requirement of every task.

### 5. Runtime -- only now do sandbox/retries/checkpoints enter


Then we can answer the original engineering question.

Given the work above, the runtime needs mechanisms such as:

```text
durability
checkpointing
resumption
sandboxing
isolation
idempotent effects
retries
scheduling / waiting
event delivery
resource budgets
interruptions
human control points
versioned state
provenance
observability
recovery
```


These aren't the architecture of long-running work. They are the infrastructure needed to preserve it.

Anthropic's long-running coding work illustrates this distinction nicely. Their practical problems included agents trying to do too much at once, context/session loss, declaring completion prematurely, and marking features complete without end-to-end verification. Their fixes included persistent feature state, incremental units of work, clean handoffs, Git checkpoints and explicit end-to-end testing. ([Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents "Effective harnesses for long-running agents \ Anthropic"))

So even their solution isn't simply "retry the model." It's partly **structuring the work**.

<!-- The long-running-work dialogue continues with its proposed field study. -->

The original reply continues with its complete [failure taxonomy, proposed field study, and consolidated model]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}). The earlier runtime arguments are retained with editorial wording, and their bibliography links remain intact.
