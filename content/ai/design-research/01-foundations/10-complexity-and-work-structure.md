---
draft: false
toc: true
description: "Proposes profiling work by uncertainty, dependencies, state, coordination, authority, and recovery, treating long-running work as continuity across execution boundaries rather than elapsed time."
title: "10 Complexity And Work Structure"
linkTitle: "10 Complexity And Work Structure"
---
# Complexity and work structure


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The retained LLM reply proposes a profile of work complexity and a model of continuity across execution episodes. It is a design proposal, not a validated complexity measure. The sibling [comments]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}) explain the arrangement and its limits.

The [builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#deriving-requirements-from-work-complexity) retains the complete requirements example. The [durable execution discussion]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#4-durable-execution-and-controlled-adaptation) describes possible runtime support.

## Complexity profile and examples


The working interpretation is that complexity may be an even better starting point than duration.

"Long-running" is often a symptom. The underlying reason is that the work cannot be safely collapsed into one bounded act because it contains too much state, uncertainty, coordination, or consequence.

A useful distinction is:

**Duration = how long the work takes.**

**Complexity = how much structure must be maintained while doing it.**

A task can run for three days because it is waiting for approval and still be structurally simple. Another can take twenty minutes but require many interacting hypotheses, tools, participants, and irreversible decisions.

The proposal is to model complexity along several dimensions.

|Complexity|Question|
|---|---|
|**Structural**|How many subtasks, branches, dependencies, and intermediate artifacts exist?|
|**Epistemic**|How much is unknown at the start? Must the system discover what to do?|
|**State**|How much relevant state accumulates and must remain consistent?|
|**Environmental**|How much can the external world change while the task runs?|
|**Coordination**|How many participants contribute, and how interdependent is their work?|
|**Intent**|How stable are goals, constraints, priorities, and success criteria?|
|**Authority**|How many decisions require different permissions or human judgment?|
|**Consequence**|How costly or irreversible are mistakes?|
|**Recovery**|How hard is it to resume correctly after failure or interruption?|
|**Resource**|How constrained are time, tokens, money, compute, context, tools, etc.?|

This gives you a **complexity profile** for a task.

For example, a large refactor:

```text
structural       high
epistemic        medium
state            high
environmental    low
coordination     medium
intent           fairly stable
authority        low/medium
consequence      medium
recovery         medium
```


A production incident:

```text
structural       medium
epistemic        very high
state            high
environmental    very high
coordination     high
intent           somewhat changing
authority        high
consequence      high
recovery         high
```


An approval process:

```text
structural       medium
epistemic        low
state            medium
environmental    low
coordination     high
intent           stable
authority        very high
consequence      medium
```


These should not use the same "long-running agent" architecture even if they all take eight hours.

The intervening source passage on deriving requirements is in the [builder-method note]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#deriving-requirements-from-work-complexity). The original reply continues below.

## Continuity and work structure

### Complexity may also explain when work becomes "long-running"


One possible definition:

> **Work becomes operationally long-running when its complexity exceeds what can be safely held and resolved within one bounded execution episode.**

That threshold might be crossed because of:

```text
too many dependencies
too much accumulated state
unknown future steps
external waits
changing environment
multiple participants
goal revisions
authority boundaries
context/resource limits
```


So "long-running" becomes less about hours and more about **continuity across boundaries**.

Those boundaries could be:

`model context boundary`

`process restart`

`human handoff`

`day/week boundary`

`tool failure`

`goal revision`

`approval boundary`

The system must preserve the work across them.

<a id="i-would-separate-intrinsic-and-induced-complexity"></a>

### Intrinsic and induced complexity


This could be important for the framework.

**Intrinsic task complexity** comes from the work itself:

`many dependencies`, `uncertainty`, `changing world`, `multiple actors`.

**Execution complexity** comes from how we implement it:

`LLM context limits`, `unreliable tool calls`, `process crashes`, `rate limits`, `sandbox expiration`.

You don't want to confuse the two.

For example:

> "We need checkpointing because Claude's context is finite."

is implementation-specific.

Whereas:

> "We need persistent task state because the work spans several reasoning episodes and participants."

is a property of the computational model.

The second survives future model improvements.

### This could give us a stronger field structure


Instead of:

```text
Long-running agents
    sandbox
    retries
    checkpoints
    memory
    ...
```


we get:

```text
LONG-RUNNING WORK

1. Complexity
   Why can't this work be completed as one bounded action?

2. Work structure
   What kind of evolving process is it?

3. State
   What must persist?

4. Participants
   Who contributes information, execution, judgment, authority?

5. Dynamics
   What can change during execution?

6. Guarantees
   What must remain true despite those changes?

7. Runtime mechanisms
   What infrastructure preserves those properties?
```


Then:

`complexity -> required semantics -> runtime mechanisms`

rather than:

`agent -> list of reliability features`.

The working interpretation is that this direction also connects very naturally to the framework idea. The framework could potentially let developers describe the **complexity structure of the work**--dependencies, uncertainty, authority, volatility, recovery requirements--and derive some collaboration/runtime behavior from it automatically.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Coordination and epistemic refinements


The following retained passage extends the proposed profile with coupling, goal compatibility, behavioral correlation, and different sources of uncertainty. It comes from the [multiagent coordination dialogue]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}). The sibling [comments]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}#imported-coordination-and-epistemic-refinements) distinguish the proposal from a validated measure.

<a id="1-anthropic-provides-evidence-for-your-complexity-framing"></a>

### 1. Anthropic as evidence for the proposed complexity framing


The proposed complexity document starts from the claim that duration is secondary; the underlying issue is how much structure has to remain coherent across uncertainty, state, participants, authority, failures, and resource constraints.

Anthropic's experiments fit this much better than a simple "`N` agents = harder" model.

|Anthropic result|Your complexity model|What it tells us|
|---|---|---|
|Parallel vulnerability search works well|High epistemic/structural complexity, relatively low coordination dependency|Multiple agents help when work can be partitioned|
|Shared software project becomes difficult|Structural + state + coordination complexity|Dependencies between participants are more important than participant count|
|Agents independently choose similar strategies|Missing/weakly represented|Correlated participant behavior creates systemic risk|
|Agents flood a shared job queue|Resource + coordination complexity|Shared resources create externalities between otherwise rational local actions|
|Agents fail to identify unreliable peers|Epistemic complexity|Epistemic complexity includes source reliability, not only unknown facts|
|Groups suppress decisive private evidence|Epistemic + coordination complexity|Distribution of knowledge across participants is a distinct problem|
|Contradictory goals produce destructive conflict|Intent + authority + consequence complexity|Goal compatibility matters independently of goal stability|
|Agents eventually request human arbitration|Authority + repair complexity|Escalation and conflict resolution are system properties|

Anthropic explicitly finds that weakly dependent parallel work is tractable, while rich and changing dependencies cause coordination failures. Their agent teams frequently avoided conflicts by isolating ownership of files; only their strongest tested model managed substantial shared code ownership together with high merge throughput. ([Anthropic](https://www.anthropic.com/research/multiagent-systems "Patterns and problems in multiagent systems \ Anthropic"))

This is almost a direct empirical justification for the proposed chain:

`complexity -> required semantics -> runtime mechanisms`

rather than designing from "`agent -> reliability features`."

The proposal is to refine the proposed complexity taxonomy, though.

The initial `coordination` dimension asks how many participants contribute and how interdependent their work is, while `intent` asks how stable goals and priorities are. Anthropic exposes three variables that deserve explicit treatment:

|Proposed refinement|Question|
|---|---|
|**Coupling**|How strongly can one participant's work change, block, invalidate, or interfere with another's?|
|**Goal compatibility**|Are participants' objectives mutually satisfiable, partially competing, or contradictory?|
|**Behavioral correlation**|How independent are participants' strategies, beliefs, and failure modes?|

One tentative proposal is to make **coupling** a subdimension of coordination and **goal compatibility** part of intent. Behavioral correlation may deserve its own dimension because adding 100 nearly identical agents does not give you 100 independent perspectives. Anthropic's conformity experiments demonstrate exactly this: replicated agents can make correlated choices and therefore turn local mistakes into system-level failures. ([Anthropic](https://www.anthropic.com/research/multiagent-systems "Patterns and problems in multiagent systems \ Anthropic"))

The proposed epistemic dimension also needs decomposition. At present it asks roughly how much is unknown and how much discovery is required. Anthropic separates at least three epistemic problems:

`unknown information`

`distributed/private information`

`unreliable or strategically misleading information`

Those require different semantics.

<!-- The surrounding coordination analysis remains in its report. -->

The surrounding framework analysis and later methodological critique remain in the [coordination report]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}).

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Work types and task dimensions


The complete opening of the long-running-work reply follows below. Its task types and descriptive dimensions remain a separate proposal from the earlier complexity profile and coordination refinements. The sibling [comments]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}#imported-work-types-and-task-dimensions) explain their relation.

The working interpretation is that the key reframing is:

**"Long-running agent" is too implementation-centered. The real object is long-running work.**

Sandboxing, retries, checkpointing, durable execution, context management, etc. are necessary runtime machinery. Current production systems emphasize exactly those concerns. ([LangChain](https://www.langchain.com/blog/runtime-behind-production-deep-agents?utm_source=chatgpt.com "The Runtime Behind Production Deep Agents")) But they don't tell us what kind of work is being performed, how the goal evolves, who should participate, or what "progress" means.

The proposal is to structure the field in five layers.

### 1. Work structure -- what kind of long-running task is this?


"Long-running" itself has several causes.

A useful starting taxonomy might be:

|Work type|What makes it long-running|Examples|
|---|---|---|
|**Project / construction**|many dependent pieces must accumulate into a deliverable|build application, migration, large refactor|
|**Investigation / discovery**|path is unknown; evidence changes the next step|research, incident diagnosis, due diligence|
|**Case / process**|one case moves through stages, waits, approvals, outside systems|support escalation, insurance claim, onboarding|
|**Monitoring / control**|there may be no terminal state; maintain a condition over time|SRE monitor, fraud detection, compliance watch|
|**Backlog / maintenance**|repeated work over an evolving collection|technical debt, issue triage, data cleanup|
|**Goal pursuit / campaign**|actions produce feedback that may change tactics or even objectives|optimization campaign, recruiting, sales process|

These need very different systems.

For example, a project needs decomposition and completion tracking. An investigation needs hypothesis/evidence state and stopping criteria. Monitoring needs event handling, persistent policy, and escalation. A case process needs waits and authority transitions.

Research is already starting to separate **intrinsic horizon** from an agent simply taking many actions. HORIZON characterizes tasks using required effective actions and compositional depth, and shows that breadth itself adds coordination overhead. ([arXiv](https://arxiv.org/abs/2604.11978 "The Long-Horizon Task Mirage? Diagnosing Where and Why Agentic Systems Break")) The proposal is to extend that substantially for real work.

### 2. Task dimensions -- what makes this particular task difficult over time?


Instead of relying only on archetypes, characterize each task along dimensions:

```text
duration
    seconds → hours → days → indefinite

goal stability
    fixed → refinable → changing

path certainty
    prescribed → partially specified → exploratory

work topology
    linear → hierarchical → parallel → event-driven

environment
    mostly static → continuously changing

participants
    one → many

external dependencies
    none → tools → humans → organizations

authority
    autonomous → checkpoints → continuous joint control

effects
    reversible → expensive → irreversible

completion
    exact → judgment-based → continuous
```


This is important because two "seven-hour tasks" may have almost nothing in common.

A seven-hour code implementation could have:

`fixed goal + deep dependency tree + mostly local environment`

while a support case open for seven hours could have:

`changing information + waiting for customer + authority handoffs + external systems`

The same "long-running runtime" supports both, but the work semantics differ.

<!-- The long-running-work dialogue continues with participant roles. -->

The original reply continues with [participant roles]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}#roles-in-long-running-work), then [goal revisions]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#goal-revisions-and-dependent-work), [runtime support]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#runtime-support-for-long-running-work), and the proposed [failure taxonomy and field study]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}).
