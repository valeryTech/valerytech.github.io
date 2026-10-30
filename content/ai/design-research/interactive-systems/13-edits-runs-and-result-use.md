---
draft: false
toc: true
description: "New design commentary proposes revision-bound edits, exact run inputs, scoped interventions, and purpose-specific acceptance, using out-of-order retrieval and synthesis to separate historical display from current result use."
title: "13 Edits Runs And Result Use"
linkTitle: "13 Edits Runs And Result Use"
---
# Proposed relationships between edits, runs, and result use


Date: 2026-04-01. The note is new design commentary, not retained dialogue. Its rules are a proposed starting point for discussion, not accepted requirements or an implemented system.

An edit should identify what it changes and which revision it starts from. A computation should identify the exact inputs it reads, and a result-use decision should identify the exact output and purpose it concerns. A view can display the history and decisions without treating a displayed result as current or accepted by default.

The proposal develops the [collection review's example]({{< ref "ai/design-research/interactive-systems/00-collection-review-comments" >}}#a-concrete-example-for-a-later-design-discussion). It connects [application state]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}), [program and run history]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}), and [workbench interventions]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}). It does not merge their vocabularies into a universal schema.

## What each relationship needs to explain


The labels below describe roles in the example. They do not declare new types or require a separate database for each role.

| Role | Proposed relationship |
|---|---|
| A view | It identifies the task or revision being shown and the particular results displayed. Selection and layout can remain local unless an operation explicitly changes shared work. |
| An edit request | It identifies the actor, target, base revision, proposed change, and scope. Its outcome identifies an applied revision or a refusal, conflict, or unresolved request. |
| A job request | It identifies the requested work and its input references. Progress and cancellation concern the job, independently of the person's ability to keep editing. |
| An execution run | It identifies one attempt for a job and the exact inputs and configuration actually used. A retry is another attempt, while a changed request need not be treated as a retry. |
| A result artifact | It identifies its producing run or other derivation. A manually changed artifact identifies its parent revision and intervention instead of being attributed unchanged to the earlier run. |
| A judgment | It identifies the assessed artifact revision, relevant passage or property, assessor, and stated assessment. A reason or label remains a judgment rather than proven evidence. |
| An acceptance decision | It identifies an exact result revision, purpose, relevant task context, decider, and supporting checks. It records the policy version where a policy governs the decision. |

The separate [authorization discussion]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#authorization-of-concrete-operations) concerns permission for a concrete action and its arguments. Acceptance of an answer does not supply that permission.

## Proposed rules for edits and execution


First, a control should distinguish presentation changes from changes to the work. Sorting an evidence table can change only the view, while choosing an evidence order for synthesis changes an input artifact.

Second, an applied edit should retain its base revision and resulting revision. If another participant changes the target before application, the application needs an explicit conflict rule. Rejecting the edit or reviewing a rebased change are possible choices, and neither choice is selected here.

Third, each run should bind its inputs to identifiable revisions rather than an unspecified "latest" value. If a live external input cannot be frozen, the run should record its observed value or version where available. An unavailable snapshot limits the claim that the run can be reproduced.

Fourth, completion should record the result against its originating run before considering its use in the current task. Arrival order alone should not select the current result. Historical display, current-task use, and acceptance should remain separate decisions.

The [application comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}#decide-when-a-result-is-still-usable) explain the limits of a job identifier. The [history comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}#changed-inputs-and-acceptance) explain why an earlier acceptance need not apply after a revision.

## A worked example


The example uses illustrative identifiers, with revision numbers attached to the records being changed. It assumes retention of earlier records and explicit confirmation of the active information need. Neither assumption selects a storage framework.

1. First, a person confirms information need `Q1` and starts job `J1`. Its run `R1` reads `Q1` and source snapshot `S1` using pipeline variant revision `A1`.
2. Second, the person revises and confirms the information need as `Q2`, then starts job `J2` and run `R2`. The second run still uses `S1` and `A1`, while the first run retains its association with `Q1`.
3. Third, `R2` finishes and produces evidence artifact `E1`. When `R1` finishes later, its result remains associated with `Q1` and does not automatically replace the result displayed for `Q2`. A person may inspect the earlier result without accepting it for the revised task.
4. Fourth, the person chooses to promote a passage in `E1` for the next synthesis. Intervention `I1` records the change from `E1` to derived artifact `E2`, and a separate judgment records the reason. New synthesis job `J3` starts run `R3`, which reads `Q2`, `E2`, and `A1`. The intervention neither rewrites `R2`'s original output nor updates the saved variant `A1`.
5. Fifth, `R3` produces answer `O1`, and checks produce findings `V1`. Decision `D1` records acceptance of `O1` for internal research under `Q2`, with the relevant checks and conditions. `D1` does not approve a new pipeline policy or authorize publication of the answer.

The intervention is scoped to the next synthesis in this example. Applying the same change to future tasks would require a separate variant or policy proposal, with its own evaluation and adoption decision.

## Result use needs more than one status


A completed run can produce an unsupported answer. A result associated with an earlier information need can still be useful for historical comparison. Current inputs and successful execution therefore do not establish acceptance.

For a proposed use, the application should separately determine:

- Identify the run and revisions that produced the result.
- Check whether its dependencies match the current task or satisfy a stated compatibility rule.
- Identify the checks and judgments concerning the exact result revision.
- Determine whether the result is accepted for the proposed purpose and conditions.
- Determine whether a requested external action has the required authority.

The proposal permits an explicit compatibility rule rather than requiring every reusable result to match every revision exactly. The rule must identify which changes are allowed and which require another check or decision. A result should not become usable merely because it arrived last or carries an unqualified approval label.

The existing [verification-and-acceptance note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) supplies the related distinctions. A correction to an accepted answer creates a different revision, so the earlier decision remains about the earlier answer unless an explicit rule establishes continued applicability.

## Choices still open


- Decide whether editing an input schedules dependent computation automatically or requires another run request.
- Define which source, goal, interpretation, configuration, and policy changes affect which results.
- Define how cancellation handles work that finishes after a stop request. A request to stop is not evidence that a worker stopped or that an external effect was reversed.
- Define how undo changes the active revision without confusing it with cancellation, deletion of history, or execution of an earlier operation again.
- Define whether partial results may be used and how competing or complementary results are combined.
- Define the conflict policy for concurrent edits and the retention and access rules for drafts, results, and judgments.

The [workbench comments]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches-comments" >}}#record-an-intervention-separately-from-its-meaning) and [history replay comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}#inspection-and-replay) provide the starting questions. No transition implementation, automatic policy learning, or replay guarantee follows from naming the relationships.

## Next discussion


Review the worked example first, especially the scope of `I1` and the conditions attached to `D1`. Then examine a source change or cancellation using the same relationships before expanding the record vocabulary.

The later language-interface review can use the same questions for an editable interpretation, a displayed preview, and the concrete operation submitted after review. It should determine which revisions the preview concerns and what changes require another check before execution.

## Preservation


The note adds a proposal without moving, copying, or rewriting any retained dialogue passage. Links from the index and collection review identify it as new commentary. The existing [reassembly log]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}) remains the record of original source locations.

Verification on 2026-04-01 rechecked all 48 mapped passages across eight source audits and reconstructed the original sources exactly. The proposal, review, and index passed checks for 114 local links, including 29 heading anchors, and passed the whitespace checks.

At the recorded workspace snapshot, 140 of 145 existing files were unchanged. The index and review received the intended editorial changes, while three design-research files changed externally and were left untouched. The Git index remained unchanged, and this pass did not stage, unstage, or commit files.
