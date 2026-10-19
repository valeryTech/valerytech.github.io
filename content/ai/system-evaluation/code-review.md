---
draft: false
toc: true
title: "Reviewing Software Changes"
aliases:
  - "/ai/system-evaluation/generation/"
description: "Review software changes by checking the problem, the affected code, design choices, tests, and deployment needs when working with AI."
lastmod: "2026-10-19"
linkTitle: "Reviewing Software Changes"
---

A review should help answer: **Should we merge this change?**

To answer, the reviewer needs to understand what the change is meant to do, how it fits the existing system, what was implemented, and what was checked.

The diff shows the edited code. It may not show a missed caller, a false assumption about an API, an unnecessary design, or a deployment problem. Requirements, existing code, tests, and relevant design notes help fill those gaps.

## Start with the problem


Establish what should change and what must keep working. Ask:

- What problem does this solve?
- Who or what is affected?
- Which existing behavior must stay the same?
- Are important requirements missing or unclear?

Do this before accepting the proposed solution. Otherwise, it is easy to review how well the code implements an idea without asking whether the idea fits the problem.

## Understand the affected system


Read enough surrounding code to understand the change. Follow relevant callers, state changes, dependencies, and error paths. Check important assumptions against the actual API, code, documentation, or runtime behavior.

For example, adding retries requires knowing what a timeout means. The server may already have saved the operation even though the client never received the response.

Keep this work proportional. A small local fix rarely requires reconstructing the entire application.

## Check the design and implementation


Ask whether the chosen approach fits the requirements and existing system. Look for unnecessary services, abstractions, dependencies, and unrelated cleanup.

Then check whether the code implements the approach correctly and completely. A sound design can still miss another caller, a migration, a configuration change, or a failure path.

Some details affect the design directly. A database constraint may be essential to preventing duplicates. A timeout may determine whether a request can meet its deadline. Give those details the attention they need.

If implementation reveals that an assumption was wrong, revisit the decision it supported. Avoid adding layers of fixes around a design that no longer fits.

## Treat explanations as something to check


AI-generated code can come with convincing tests, comments, and a PR description. They may all repeat the same mistake.

Suppose the code assumes an API is safe to retry. A generated test mocks that API as safe, and the PR description says the test proves retries work. The test has not checked the API assumption.

Ask where important expected results come from and whether the checks could find the mistake you are worried about. The same standard applies to human-written work.

A design explanation written after implementation can still be useful. Check whether its reasons and assumptions hold now. It need not prove what the author originally thought.

## Choose checks for the kind of change


| Change | Main things to check |
| --- | --- |
| New feature | Required behavior, a complete user workflow, failure handling, and deployment needs |
| Bug fix | The original failure, the corrected behavior, and nearby regressions |
| Refactor | Behavior that must stay the same, including side effects and errors |
| Migration | Existing data, old and new clients, partial deployment, and recovery |
| Performance change | A realistic workload, measured improvement, and correctness or cost trade-offs |
| Model or retrieval change | Relevant examples, how answers are judged, repeated runs where needed, cost, and latency |

A change can belong to several rows. Use the checks that matter to it.

## Write a useful conclusion


State what was reviewed, the important findings, what was tested, and what remains unclear. Recommend approval, changes, or further checking.

Tie findings to the reviewed revision. A later edit may need another look. Approval of a PR also needs to follow the team's rules for merging and releasing.

See [A Practical Review Process]({{< ref "ai/system-evaluation/review-flow-specification" >}}) and [Testing a Change During Review]({{< ref "ai/system-evaluation/review-flow" >}}).
