---
draft: false
toc: true
title: "A Practical Review Process"
description: "A practical review process covering requirements, affected code, design, implementation, testing, deployment, and the decision to merge."
lastmod: "2026-10-19"
linkTitle: "Review Process"
---

The review should answer whether the change is ready to merge. Check what it is meant to do, how it fits the system, whether the code works, and what could go wrong during deployment.

This process works for code written by people, coding agents, or both. An agent can also help review it. The important part is whether the checks can find real mistakes.

Use the steps that matter to the change. A small fix may need a quick pass; a schema migration or concurrency change may need much more work.

## Before starting


Identify the commit being reviewed, the requested change, and any relevant requirements or design notes. If comparing versions, record which versions and settings you used.

The PR description explains what the author intended. Check important statements against the code, documentation, or actual behavior. Existing behavior may include bugs.

## 1. Agree on what should change


Establish the intended behavior, what must keep working, and what is outside scope.

If an unclear requirement would lead to different implementations, resolve it with the person responsible. Avoid quietly choosing whichever interpretation fits the code already written.

The result can be a few sentences. It should give the reviewer something clear to check.

## 2. Read the relevant system


Follow the components, callers, data, dependencies, and error paths that matter to this change. Check assumptions that could make the design wrong.

For example, a retry change depends on what the receiving service does when a request times out. Read its contract and test unclear behavior where needed. A local helper change usually needs much less investigation.

## 3. Find the affected parts


Work out what needs to change and what could be affected, then compare that with the diff.

Look beyond the edited files when necessary: another caller, a migration, a configuration setting, a compatibility path, or monitoring may need an update.

## 4. Check the design


Does the approach fit the requirements and the existing system? Are responsibilities, data ownership, communication, and failure handling clear enough?

Consider a simpler approach when it could make a meaningful difference. Avoid requiring an alternatives document for every local choice.

A design choice may emerge while writing code. What matters is whether it makes sense and whether the implementation and tests account for its effects.

## 5. Check the implementation


Does the code do what was agreed, including the parts outside the main success path?

Inspect relevant error handling, concurrent requests, cleanup, configuration, and callers. Check that the implementation has not quietly changed a requirement or added unrelated work.

If the code reveals a problem with the design, return to that decision before adding more fixes around it.

## 6. Test the important behavior


Choose checks from the requirements and the ways the change could fail. Check that the expected results are correct and that the test setup reaches the behavior being tested.

For example, a test for retries must account for a server saving the operation before its response is lost. A mock that always times out before saving does not test that case.

| Change | Useful checks |
| --- | --- |
| A rule must always hold when saving or accepting an action | Inspect where the rule is enforced; test invalid requests, alternate paths, and relevant failures. |
| A refactor must preserve behavior | Run relevant cases on old and new versions; compare outputs, data changes, errors, and side effects. |
| A model or retrieval change should improve answers | Use relevant examples and clear judging criteria; check regressions, repeated runs where needed, cost, and latency. |
| A change must meet a performance target | Measure under a workload and configuration close enough to the intended use. |

Passing the checks does not establish everything about the change. Say what was tested and which important cases remain unchecked. See [Testing a Change During Review]({{< ref "ai/system-evaluation/review-flow" >}}).

## 7. Check deployment and recovery


Can old and new versions run together where needed? Will the data migration work if deployment stops halfway through? What happens if the change must be rolled back?

Check how failures will be noticed and handled. Focus on the problems this change could actually introduce rather than adding a full operations checklist to every PR.

## 8. Write the review conclusion


Explain the important findings, what the checks showed, and what still needs attention.

- **Approve:** the change meets the requirements well enough to merge under the team's review rules.
- **Request changes:** describe the problem, why it matters, and the relevant code or reproduction steps.
- **Ask for more information or a decision:** explain what is missing and who can help resolve it.

Do not approve merely because no bug was found. If an important part could not be checked, say so. Further work might be another test, a smaller change, or a decision by someone responsible for the product or system.

Approval of the review does not automatically grant permission to deploy or perform other actions. Follow the team's existing responsibilities.

## When a check changes the plan


Suppose a test shows that an operation can be saved before the client times out. The retry design assumed the opposite.

Revisit that assumption, the retry behavior, and any tests based on it. A new local patch may be enough, but it must address the actual problem. Do the same if the review's own test setup turns out to be wrong.

## Keep a short record

```text
Commit reviewed:
What the change should do:
What must keep working:
Important assumptions checked:
Tests run and results:
Problems found:
Important things not checked:
Recommendation and next steps:
```


Link to existing tests, logs, or design notes where useful. Keep the explanation short enough that another engineer can understand the recommendation without reading the entire chat.

Related: [Reviewing Software Changes]({{< ref "ai/system-evaluation/code-review" >}}), [Common Development Mistakes]({{< ref "ai/system-evaluation/delivery-flow" >}}), and [Working with a Coding Agent]({{< ref "ai/system-evaluation/harness" >}}).
