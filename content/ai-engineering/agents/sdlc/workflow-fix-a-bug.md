---
draft: false
toc: true
title: "Workflow Example: Fix a Bug"
description: "A concrete workflow for fixing a bug with a coding assistant, written in the six-part workflow format and ready to test on actual tasks."
linkTitle: "Workflow: Fix a Bug"
---

This note is a concrete example of the six-part workflow format in [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}). It covers the **Fix a bug** task type from [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}). Like any workflow built before case data exists, it starts as a draft hypothesis to test and trim on actual bug fixes ([Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}})).

## 1. Scope and Starting Input


- **Task type:** Fix a bug (one pull request of reviewable size).
- **Activities used:** Investigation, design decisions, implementation, and verification and review.
- **Starting input:** A bug report that states expected behavior, observed behavior, and how to see the bug (an input, log lines, or reproduction steps). If expected behavior is unclear, run [Frame a problem]({{< ref "ai-engineering/agents/sdlc/workflow-frame-a-problem" >}}) first so the agent does not guess product intent.
- **Out of scope:** Production emergencies under time pressure (use **Ship a hotfix**) and missing features where current behavior matches the spec.

## 2. Steps


| Step | Activity | Participant | What happens | Output |
| :--- | :--- | :--- | :--- | :--- |
| **1. Reproduce** | Investigation | Collaborator agent | Read the relevant code and logs, then write a failing test or runnable script that reproduces the bug. | Failing test and observed output |
| **2. Confirm reproduction** | Investigation | Engineer | Check that the failing test matches the reported bug and exercises actual system behavior, with no mock hiding the cause. | Confirmed reproduction |
| **3. Diagnose and list options** | Investigation and design decisions | Collaborator agent | Trace the cause and list fix options (such as guarding the symptom, fixing the caller, or changing the contract) with affected callers and risks for each. | Cause note and fix options |
| **4. Choose the fix** | Design decisions | Engineer (or owner) | Select the fix option. Routine local fixes stay with the engineer; changes to user behavior or shared contracts go to the product or architecture owner. | Chosen fix and what must stay true |
| **5. Implement and check** | Implementation | Collaborator agent | Apply the chosen fix, verify the reproduction test now passes, add tests for nearby variations, and run the project's baseline checks. | Code diff, passing tests, and check output |
| **6. Review and merge** | Verification and review | Reviewer (and CI) | Review the diff and evidence: cause, failing-then-passing test, nearby cases checked, and what wasn't checked. Decide to merge or request changes. | Merged pull request or change requests |
| **7. Record lessons** | Upkeep | Engineer | When the bug or session exposed a recurring project trap, add a lint check, command, doc note, or `AGENTS.md` line. | Environment or doc update (when needed) |

## 3. Decision Points


Work pauses for a person at three points:

- **After step 1 (confirm reproduction):** The engineer checks the failing test before any fix is written. This prevents fixing the wrong problem or trusting a test that fails for an unrelated reason.
- **After step 3 (choose the fix):** The engineer or owning role picks the fix level before code changes start. The agent supplies the root cause, the options, and which callers each option touches.
- **After step 5 (merge):** A person with merge authority commits the change into the main branch after checking the diff and evidence.

For a small, local, reversible bug (such as an obvious typo or off-by-one inside one private helper), steps 2 and 4 can stay brief. For bugs touching authentication, permissions, money, security, or stored data, require full review of both the reproduction and the fix options ([Adjusting the Level for One Task]({{< ref "ai-engineering/agents/sdlc/task-types" >}}#adjusting-the-level-for-one-task)).

## 4. Checks


- **Self-checks (step 5):** The collaborator agent runs the project's test suite, type checker, and linter as it edits and fixes what they catch before opening the pull request.
- **Independent checks (steps 2 and 6):** The engineer inspects the reproduction before the fix exists, CI runs all automated checks on the pull request, and the reviewer checks the diff and evidence. For high-risk areas, a fresh checker agent reviews from the bug report and the diff alone, without the implementation session transcript ([Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}})).

## 5. Backtracks


- **Current behavior matches the docs (step 1 or 2):** Stop and send the ticket to the product owner to clarify whether the behavior is a bug or a feature request.
- **Chosen fix breaks callers or relies on a false assumption (step 5):** Stop coding, discard local patches around the assumption, and return to step 3 with the new evidence.
- **Tests pass only because a mock hides the failure (step 6):** Return to step 1 and replace the mock with a check against the actual failure path.

## 6. Placement in a Project's Setup


| Workflow element | Where it lives | How it holds |
| :--- | :--- | :--- |
| Step order and pull request checklist (cause, failing-then-passing test, nearby cases, unchecked items) | Written practice in the [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}) (project docs and PR template) | Guidance that people and reviewers check |
| Commands to run tests, types, and linters | Command layer in the ADE (`Taskfile` or `Makefile`) | Same command runs for people, agents, and CI |
| Optional reproduction or diagnosis procedure | Skill in the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}) | Loaded only when working on a bug |
| Passing CI checks and required human approval before merge | [Authority layer]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#contributions-effects-and-commitment-points) (branch protection and CI gates) | Enforced mechanically on every change |

## Testing and Trimming This Workflow


Run this workflow on a few bug fixes in one project and record each case ([Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}})). Watch for two signals:

- **Steps that earn their keep:** cases where step 2 caught a misread bug report or step 3 prevented a symptom patch.
- **Steps that add friction without changing decisions:** if step 2 or step 4 adds delay on routine local bugs without catching errors, merge them into a single pre-implementation checkpoint for low-risk fixes and keep both stops only for higher-risk bugs.
