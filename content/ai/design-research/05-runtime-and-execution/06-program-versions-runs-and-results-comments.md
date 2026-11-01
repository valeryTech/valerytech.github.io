---
draft: false
toc: true
description: "Clarifies distinct program, goal, run, artifact, and acceptance records, questioning history-link rules, stale dependencies, retry semantics, and downstream reuse under changed inputs or policies."
title: "06 Program Versions Runs And Results Comments"
linkTitle: "06 Program Versions Runs And Results Comments"
---
# Comments on program versions, runs, and results


Editorial context, 2026-04-20: Wording in this review and the linked research discussion has been edited for standalone reading. References to preserved or unchanged source wording describe the earlier reassembly; the review's judgments remain attributed commentary, not accepted decisions.

The comments were added by Codex on 2026-03-30 at the user's request. They explain the sibling [dialogue note]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) and identify open design questions. They are new commentary, not part of the original dialogues or an agreed implementation specification.

## What the grouped passages describe


The grouped passages describe what happens to a generated program and its results over time. A program has saved versions, and each run produces records and results. Checks and acceptance decisions determine whether a later step may use a result.

The rearrangement keeps the record catalog, repair history, and rules for later use together. The detailed discussion of generating programs remains in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}). The runtime's durability, recovery, replay, and guarded program reuse remain in [Generalized agent runtime]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}).

## A simple example


First, an LLM produces version 1 of a program that analyzes documents. Second, the system runs version 1 and saves result A with a record of the run. Third, the system checks result A, and an acceptance decision records whether a later task may use it for a stated purpose.

If the program needs a change, the system saves version 2 and records a new run. The earlier program, run, result, and checks remain available for comparison.

Running the unchanged version 1 again is different from changing the program. A second run can have different inputs or a different outcome without requiring a new program version.

## Names used in the dialogues


| Name | Meaning in plain language |
|---|---|
| `ProgramRevision` | A saved version of a program. |
| `ExecutionRun` | One execution of a particular program version with recorded inputs and configuration. |
| `ProducedArtifact` or `ResultArtifact` | A saved output from a run. |
| `VerificationReport` or `VerificationFinding` | A record of checks and their findings. |
| `AcceptanceDecision` | A decision about using an exact result revision for a stated purpose. |
| `DependencyGate` or `DownstreamGate` | A rule deciding whether a later task may use earlier results. |

The table explains related ideas without declaring that the earlier and later names are identical types. For example, `AcceptedResult` might contain both a result and its acceptance information, while `AcceptanceDecision` might be a separate record. The dialogues have not settled that choice.

## What the different diagrams mean


The task diagram records which questions or subtasks depend on others. The procedure diagram records executable operations. The result history records which program and run produced a result, and which checks or decisions concern it.

Evidence support is another relationship. A claim can depend on several source passages even when a single operation produced the claim. The earlier provenance diagram emphasizes evidence support, while the later artifact diagram also includes program versions and acceptance decisions. The proposal is to keep the relationship names explicit rather than treating every arrow as the same kind of dependency.

## Open questions

### Rules for history links


Keeping records unchanged does not, by itself, prevent cycles among arbitrary links. The history needs rules for which records may reference which others.

One possible rule is that a recorded derivation may depend only on already existing earlier records. The proposed ordering would prevent cycles in that derivation relation. The task and procedure diagrams need their own rules, and the proposed history rule is not a requirement of every system.

### Changed inputs and acceptance


A result accepted for one source revision, purpose, and policy should not automatically be treated as accepted for another. The [revision-integrity discussion]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}#revision-integrity) already preserves the earlier decision while allowing dependent results to become stale.

The remaining question is which changes require another check or acceptance decision. A source correction, changed contract, and changed policy can affect different results. Their effects need explicit rules rather than one blanket status for the whole history.

### Retrying a run and repairing a program


A service timeout can call for another run of the same program, while a compiler error can call for a changed program version. The runtime's [failure distinctions]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#10-localize-failures) already support separating those cases.

The proposal is to avoid interpreting the repair diagrams as requiring a program change after every failed run. Retry limits and resource budgets should also state what counts as an attempt.

### Using several results


Several results can be competing answers, complementary contributions, or outputs from different conditional branches. A later task needs a rule for the relevant case.

The original examples preserve rules such as requiring all contributions, accepting one alternative, or using an adjudicated merge. Agreement among models alone does not establish that an answer is supported by its sources.

### Inspection and replay


Saved program, model, prompt, tool, and input versions help explain what happened. They do not alone guarantee an identical result from a future model call or external service.

The runtime's [observability and replay discussion]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#11-preserve-observability-and-replay) remains separate from the history model. A later design should distinguish reusing a recorded result from performing the operation again.

## Relation to verification and external actions


[Verification and acceptance]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) explains what checks and decisions mean. The grouped dialogue note records which versions, runs, and results those checks and decisions concern.

Permission to use a result in another task is separate from permission to publish it or change an external system. The [effect-boundary discussion]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}#effect-boundary) retains that distinction.

The original questions and access caveats remain in the behavioral-compilation note. References to attached domain guides and UC-1 material have not been independently verified as part of the rearrangement.

## Imported goal revisions and dependent work


The complete [intent-evolution passage]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#goal-revisions-and-dependent-work) extends the history discussion with changing goals. The earlier placement proposal put the passage in the complexity note. The approved revised placement keeps it with revision records, dependent work, and decisions about later use.

A goal revision changes what the participants are trying to accomplish. A program revision changes an executable procedure, and an execution run records an attempt using a particular procedure and inputs. A changed goal may require changes to a program, but the records describe different events.

The source's mutable specification can be represented by a current accepted revision without overwriting earlier revisions. A later design should distinguish a proposed goal change from an accepted change and identify who may accept it.

The complete feature example and `GoalRevision` record remain together. The listed fields do not provide an algorithm for identifying invalid plans, reusable completed work, or approvals that need reconsideration. Those decisions require explicit dependency and acceptance rules.

The opening [work description]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}#work-types-and-task-dimensions), complete [role list]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}#roles-in-long-running-work), and [runtime support]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#runtime-support-for-long-running-work) retain the surrounding argument. The mapping log records the original range and exact preservation of the earlier history note and comments.
