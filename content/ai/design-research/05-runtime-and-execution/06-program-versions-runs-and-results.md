---
draft: false
toc: true
description: "Proposes immutable program revisions, run traces, repair histories, and acceptance gates, separating task, procedure, and provenance graphs and tracking how goal changes affect dependent work."
title: "06 Program Versions Runs And Results"
linkTitle: "06 Program Versions Runs And Results"
---
# Program versions, runs, and results


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The following arguments were moved from [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) and [Generalized agent runtime]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}). Original section numbers are retained. New explanations and open questions are in the sibling [comments note]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}).

## Initial lifecycle and domain records


The following sections 11 and 12 come from the initial behavioral-compilation analysis. Its original question and access caveat remain in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}).

# 11. Suggested canonical lifecycle


A refined lifecycle could be:

```
0. Ingest ProblemBundle
1. Validate domain structures and source identities
2. Frame the task and construct TaskSpec
3. Assign source/support constraints before answer generation
4. Generate multiple CandidateWitnesses
5. Validate witness claims and discard unsupported portions
6. Distill BehaviorSpec and test obligations
7. Synthesize ProgramCandidate in the DSL
8. Compile:
      parse
      type-check
      effect-check
      provenance-check
      graph-check
9. Execute in a sandbox and record a complete RunRecord
10. Verify:
      structure
      domain invariants
      provenance
      task behavior
      witness compatibility
      robustness
11. Produce:
      AcceptedResult
      RepairableResult
      RejectedResult
      EscalatedResult
12. Append the resulting artifact to the relevant graphs
13. Release downstream nodes whose gates are now satisfied
```


One modification is especially important: **source support and scope should be determined before the program output is treated as correct**. The evaluation-support semantics already distinguishes supported, partially supported, unsupported-in-corpus, unsupported-question-type, and ambiguous/conflicting cases. Those states are excellent candidates for a closed result family in this architecture.

# 12. Core domain artifacts


A likely minimal domain vocabulary is:

```
ProblemBundle
TaskSpec
SourceArtifact
EvidenceUnit
DomainEntity
Invariant
OutputContract

CandidateWitness
Claim
Assumption
SupportDecision

BehaviorSpec
VerificationPlan
TestObligation

ProgramCandidate
CompiledProgram
CompileDiagnostic

ExecutionRun
ToolInvocation
ModelInvocation
ExecutionTrace
ProducedArtifact

VerificationReport
Counterexample
AcceptedResult
RepairRequest
Escalation

TaskNode
ArtifactEdge
DependencyGate
BranchDecision
```


Important invariants include:

1. Every artifact is immutable and versioned.
2. Every accepted result identifies its exact input, program, compiler, tools, and model configuration.
3. Compilation success is necessary but never sufficient for acceptance.
4. Reference similarity alone cannot produce acceptance.
5. Every citation resolves to a specific source snapshot.
6. Every supported claim identifies the evidence actually used.
7. No downstream node consumes an artifact whose contract failed.
8. Branch merging requires an explicit merge or adjudication operation.
9. Every repair attempt is a new artifact with a recorded parent and reason.
10. Every loop is bounded.
11. Untrusted model and tool outputs are parsed at a boundary before becoming domain objects.
12. Unsupported and ambiguous outcomes are explicit variants, not missing fields or empty strings.

The connected code-mode document's requirement that work proceed in discrete, verifiable steps and that completion require the strongest relevant verification maps naturally to immutable attempts plus first-class verification reports.

## Initial graphs, repairs, and branches


The following sections 7 to 9 continue the same initial analysis. Their source context is retained with the passages.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Source context for behavioral compilation


The following sections come from [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}). The original question and access caveat remain in that note. The original arguments and section numbers are retained, with editorial wording.

# 7. You probably need three graphs, not one


"Move further in the DAG" currently overloads several different relationships.

## Semantic task graph


Represents what depends on what conceptually:

```
frame problem
├── analyze source A
├── analyze source B
└── compare A and B
        └── produce conclusion
```

## Execution graph


Represents actual operations:

```
retrieve
→ LLM call
→ parser
→ validator
→ repair call
→ finalizer
```

## Provenance graph


Represents why the result is supportable:

```
source span
→ extracted evidence
→ claim
→ section conclusion
→ final conclusion
```


These graphs overlap but are not identical.

A single execution node may support several claims. A final claim may depend on evidence from several distant execution branches. A semantic task may be retried many times without changing its position in the conceptual problem decomposition.

Treating them as separate typed graphs will prevent many future ambiguities.

# 8. Repair loops and a DAG are compatible


A logical repair process contains a cycle:

```
synthesize → compile → diagnose → repair → synthesize
```


But the persisted execution history should remain an append-only DAG by representing each attempt as a new immutable node:

```
ProgramAttempt_1
→ CompileFailure_1
→ ProgramAttempt_2
→ Run_2
→ VerificationFailure_2
→ ProgramAttempt_3
→ AcceptedRun_3
```


Nothing mutates "the current program" in place. Each new candidate records:

- its parent attempt;
- the diagnostic or counterexample that motivated it;
- the synthesis agent and model version;
- the exact prompt or repair instruction;
- the changed program hash;
- compilation and execution artifacts.

This provides replayability, auditability, and easy comparison among branches.

Every loop also needs a termination policy:

- maximum attempts;
- resource budget;
- minimum progress requirement;
- repeated-failure detection;
- fallback or escalation state;
- retained best candidate.

Without bounded termination, a compiler-repair loop can consume arbitrary resources while oscillating among equivalent failures.

# 9. Alternatives, complements, and branches must not be conflated


"One or several outputs" can mean very different things:

- **Alternatives:** several competing answers; select or adjudicate one.
- **Complements:** several artifacts are all required.
- **Conditional branches:** which artifact is needed depends on a domain state.
- **Ensemble witnesses:** several samples are used only to infer the specification.
- **Decomposition:** each output solves a different subproblem.

These require different join semantics:

```
AllOf
AnyOf
BestOf
Quorum
Conditional
MergeWithAdjudication
Fallback
```


A generic list of outputs will make the graph semantics unclear. The relationship should be explicit in the domain model.

Similarly, downstream progression must have a typed gate:

```
Advance when:
- every required child is accepted;
- at least one alternative is accepted;
- a quorum agrees;
- an adjudicator accepts a merge;
- an explicit partial-result policy applies.
```

## Later execution histories and records


The opening passage comes from the [abstraction analysis]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#abstraction-analysis). The execution-run and graph passages then come from the [later reanalysis]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#reanalysed).

## DAG versus evolving artifact graph


The control process contains cycles:

```
generate program
→ compile
→ run
→ find failure
→ revise program
```


The persisted history can still be a DAG:

```
Program v1
→ Compile failure
→ Program v2
→ Run 1
→ Counterexample
→ Program v3
→ Accepted run
```


The useful persistent structure is therefore an **artifact derivation graph**, containing:

- problems;
- demonstrations;
- traces;
- programs;
- compiled representations;
- runs;
- counterexamples;
- verification results;
- reusable abstractions.

The runtime control graph may contain loops. The immutable derivation history remains acyclic.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Execution and downstream gates from the reanalysis


The following material comes from the reanalysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#reanalysed). The original source context remains in that note. The original arguments are retained with editorial wording.

### 6. Execute and retain the trace


Execution should produce an immutable `ExecutionRun`:

```
ExecutionRun
├── problem revision
├── program revision
├── compiler version
├── model and prompt versions
├── tool versions
├── input artifacts
├── invocation records
├── output artifacts
├── observed effects
├── failures
└── resource usage
```


The run does not modify the source history or overwrite previous attempts.

A repair creates:

```
ProgramRevision 1
→ CompileDiagnostic 1
→ ProgramRevision 2
→ ExecutionRun 2
→ VerificationFinding 2
→ ProgramRevision 3
→ ExecutionRun 3
```


This allows the persisted history to remain a DAG even though the logical development process includes loops.

## The DAG should probably be several related graphs


One generic DAG will conflate different meanings.

### Task graph


Represents conceptual dependencies:

```
analyze sources A and B
→ reconcile findings
→ produce conclusion
```

### Procedure graph


Represents executable operations:

```
retrieve
→ interpret
→ validate
→ synthesize
→ verify
```

### Artifact and provenance graph


Represents derivation and revision:

```
SourceRevision
→ InterpretationProposal
→ ProgramRevision
→ ExecutionRun
→ ResultArtifact
→ AcceptanceDecision
```


These graphs can reference one another, but their edge semantics differ.

A downstream task should normally depend on an acceptance decision, not merely on the existence of an output:

```
Task B requires:
  artifact X
  accepted for purpose Y
  under policy version P
  derived from problem revision R
```


Branch joins also need explicit semantics:

```
all_of
any_of
first_accepted
adjudicated_merge
human_approved
accept_partial
```


Without these, "process all results and continue" is underspecified.

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Goal revisions and dependent work


The complete intent-evolution passage below follows the [participant-role discussion]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}#roles-in-long-running-work). It concerns changes to goals and their effects on plans, completed work, and approvals. The sibling [comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}#imported-goal-revisions-and-dependent-work) distinguish goal revisions from program revisions and execution runs.

### 4. Evolution -- what is allowed to change while work is running?


The working interpretation is that the concern about changing intent is particularly important.

Most agent abstractions look approximately like:

```text
prompt / goal
    ↓
long execution
    ↓
result
```


But in real long-running work, almost everything can change:

```text
goal
constraints
priorities
world state
available tools
participants
authority
resources
evidence
plan
success criteria
```


So **the specification itself is mutable state**.

For example:

```text
Goal v1
"Implement feature X"

↓ discovery

New information:
X conflicts with architecture Y

↓ human decision

Goal v2
"Implement X without changing Y;
defer subfeature Z"

↓ replan
```


That shouldn't be treated as "another user message somewhere in the context."

It should perhaps be:

```text
GoalRevision {
    supersedes: GoalV1
    reason: ...
    changed_constraints: ...
    effective_at: ...
}
```


Then the system can determine:

- which planned tasks are now invalid;
- which completed work remains useful;
- which approvals need reconsideration;
- what must be replanned.

This fits the existing proposal that coordination structure itself can remain open-ended while accepted changes remain governed by contracts.

The working interpretation is that **intent evolution** deserves to become a first-class part of the long-running model.

<!-- The long-running-work dialogue continues with runtime support. -->

The original reply continues with [runtime support]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#runtime-support-for-long-running-work), then the complete [failure taxonomy and field study]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}).
