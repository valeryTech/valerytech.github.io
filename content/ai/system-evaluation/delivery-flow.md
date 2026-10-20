---
draft: false
toc: true
title: "Common Mistakes in AI-Assisted Development"
description: "A reviewer’s catalog of AI-assisted development mistakes, showing how guessed requirements, missed impacts, unsuitable designs, and shared code–test assumptions can survive passing tests."
lastmod: "2026-10-19"
linkTitle: "Common Development Mistakes"
---

Code can look reasonable and pass tests while still solving the wrong problem or breaking something elsewhere. This list helps reviewers decide where to look.

The mistakes overlap. Use the list to guide a review, not to assign every problem to exactly one category. A missing explanation is a reason to check further, not proof that the author skipped the work.

## Mistakes to look for


| Mistake | Example | How to check |
| --- | --- | --- |
| Guessing at an unclear requirement | The agent chooses one interpretation without making the choice visible. | Establish the intended behavior with the person responsible for it. |
| Misunderstanding the system | The code assumes a timeout means the operation was never saved. | Read the API contract and test what happens when the response is lost after saving. |
| Missing part of the system | A caller, state, dependency, or failure path is overlooked. | Trace relevant calls and walk the main failure cases. |
| Missing part of the change's impact | One caller is updated while another still uses the old behavior. | Compare affected consumers with the files and interfaces changed. |
| Sticking with the first solution | Work continues on an approach after a simpler or better-fitting option becomes clear. | Compare the useful alternatives against the requirements. |
| Choosing an unsuitable design | A queue, cache, or consistency model cannot provide the required behavior. | Check the behavior the design depends on, including failures. |
| Adding unnecessary complexity | The change introduces abstractions or dependencies without a clear need. | Ask whether a smaller change can do the job and remain easy to operate. |
| Leaving out an important concern | Deployment, recovery, security, or compatibility is not addressed. | Walk through how the change will be used, deployed, and recovered. |
| Implementing the design incorrectly | The code breaks an agreed rule or uses an API incorrectly. | Follow the rule through the code and test the affected behavior. |
| Leaving implementation work unfinished | A migration, cleanup path, configuration, or second caller is missing. | Compare what needs to change with what was actually delivered. |
| Patching around a wrong assumption | More retries or locks are added without reconsidering the underlying design. | Return to the failed assumption and check which decisions depend on it. |
| Testing too little | Only the happy path or the original failing example is checked. | Add the failure cases and nearby variations that could expose another problem. |

Searches and tests have limits. Code search can miss external consumers. A local benchmark may not reflect production. Review the setup before relying on the result.

## Code and tests can share the same mistake


An agent may write code that retries after every timeout, then write a test whose mock returns a timeout before doing any work. The test passes, but it never checks the dangerous case: the server saves the operation and its response is lost.

Make the test exercise that case and inspect the saved state. Check that the mock or test environment has not assumed the behavior you need to verify.

Another agent can help review the test, but it may repeat the same assumption. The useful question is whether the check can actually expose the mistake.

## Fixing the example is not always fixing the problem


A duplicate-prevention fix might make one test pass by suppressing every later request. It would also reject valid new requests.

Check the rule behind the fix. Try cases that should still succeed, cases that should fail, and relevant variations of the original problem. For retries, that might include process restarts, concurrent requests, and genuinely different operations.

## One wrong assumption can spread


A mistaken assumption can end up in the design, code, tests, and PR description. It then looks settled because every document agrees with it.

Watch for requirements being lost during handoff, guesses being repeated as facts, and local fixes preserving a design that no longer works. When an assumption fails, revisit the decisions and code that depend on it.

Use [the review process]({{< ref "ai/system-evaluation/review-flow-specification" >}}) to turn these checks into a clear recommendation about the change.
