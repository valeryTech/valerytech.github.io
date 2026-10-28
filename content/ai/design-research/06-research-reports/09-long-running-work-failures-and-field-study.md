---
draft: false
toc: true
description: "A proposed field study of diverse long-running tasks, using eight candidate failure categories to derive persistent state, evolving roles, authority, recovery, and a broader model of collaborative work."
title: "09 Long Running Work Failures And Field Study"
linkTitle: "09 Long Running Work Failures And Field Study"
---
# Long-running work failures and field study


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The retained reply proposes a failure taxonomy and a study of tasks from practice. Its study questions, consolidated model, and closing definition remain together. The sibling [comments]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study-comments" >}}) explain their status and distinguish the proposal from a completed study.

The original reply's five-layer sequence is preserved through the following links:

1. [Work types and task dimensions]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}#work-types-and-task-dimensions) retain the opening framing and comparisons.
2. [Participant roles]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}#roles-in-long-running-work) retain the complete functional role list.
3. [Goal revisions and dependent work]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#goal-revisions-and-dependent-work) retain the complete intent-evolution discussion.
4. [Runtime support]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#runtime-support-for-long-running-work) retains the mechanism list and coding-harness example.
5. The complete failure taxonomy and study proposal follow below.

The existing [runtime evaluation plan]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) proposes controlled execution tests. The retained passage below instead proposes studying recurring structures in work from practice. Neither proposal is selected or carried out by the reassembly.

<a id="retained-failure-taxonomy-and-study-proposal"></a>

## Failure taxonomy and study proposal


The next proposed step is to build a failure taxonomy around these same layers.

### Failures of long-running work


**Intent failures**

```text
goal drift
stale goal
missed goal revision
wrong interpretation of success
premature declaration of completion
```


**State failures**

```text
lost progress
stale state
contradictory state
context degradation
bad handoff
failure to observe world changes
```


**Coordination failures**

```text
bad decomposition
forgotten dependency
duplicated work
unfinished branches
wrong sequencing
participants working from different assumptions
```


**Execution failures**

```text
partial effect
duplicate effect after retry
non-idempotent recovery
unauthorized action
irreversible action performed too early
```


**Verification failures**

```text
agent verifies itself superficially
local success mistaken for end-to-end success
missing evidence
false completion
```


**Adaptation failures**

```text
keeps following obsolete plan
fails to notice changed environment
replans too aggressively
cannot incorporate new constraints
```


**Oversight failures**

```text
human asked too often
human asked too late
approval fatigue
human receives task without enough context
agent fails to escalate uncertainty
```


**Resource failures**

```text
context exhaustion
token/cost runaway
time spent on low-value branches
unbounded retries
```


This isn't purely theoretical. The recent HORIZON study finds that planning- and memory-related failures become increasingly important as task horizon grows, and explicitly distinguishes instruction, false-assumption, environment, planning and other failure categories. ([arXiv](https://arxiv.org/abs/2604.11978 "The Long-Horizon Task Mirage? Diagnosing Where and Why Agentic Systems Break")) Practitioners also report oversight occurring at several stages--before execution, through co-planning, during live monitoring, and after the fact--rather than through one generic "human-in-the-loop" checkpoint. ([arXiv](https://arxiv.org/abs/2606.05391 "[2606.05391] Human oversight of agentic systems in practice: Examining the oversight work, challenges, and heuristics of developers using software agents"))

<a id="how-id-study-this-from-practice"></a>

### Proposed field study


The LLM proposal supports the following research starting point: **don't derive the whole model from agent infrastructure. Start with real long-running work.**

Take perhaps 30-50 real tasks from different domains:

```text
software feature
large migration
incident investigation
research project
support escalation
insurance claim
security investigation
ongoing monitor
technical-debt cleanup
recruiting process
procurement
financial close
...
```


For each, annotate:

```text
What makes it long-running?
What is the work topology?
What state must persist?
What can change?
Who knows what?
Who does what?
Who judges?
Who has authority?
Where are natural control points?
How is progress established?
How is completion established?
What failures happen?
How does recovery work?
```


Then look for recurring structures.

That could produce something much more fundamental than:

> "Here are ten best practices for long-running agents."

It might produce:

```text
LONG-RUNNING WORK MODEL

Task archetype
    project / investigation / case / monitor / backlog / campaign

State
    intent / world / work / artifacts / evidence / decisions

Roles
    steward / coordinator / worker / observer / verifier / authority

Dynamics
    execute / wait / observe / revise / replan / handoff / recover

Contracts
    success / authority / invariants / resource limits

Runtime support
    durability / checkpoints / retries / sandbox / scheduling

Failure model
    intent / state / coordination / execution /
    verification / adaptation / oversight / resources
```


The collaboration-framework direction appears especially relevant here.

The deeper abstraction may eventually be **persistent collaborative work**:

> A long-lived shared computational process in which goals, state, plans and responsibilities may evolve while participants perform, observe, verify and commit work under explicit constraints.

Then "long-running agent" becomes only one implementation of that much broader thing.

That feels like a field structure worth pursuing, because it connects the practical engineering questions people currently ask--"How do you retry it? Where does it run?"--to the harder questions that appear once the system is actually trusted with work over hours, days, or indefinitely.
