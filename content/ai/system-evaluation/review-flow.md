---
draft: false
toc: true
title: "Testing a Change During Review"
description: "A retry test can miss duplicate writes if its timeout mock never saves anything. The worked example checks a lost response after commit, then inspects request identities, saved state, and side effects."
lastmod: "2026-04-19"
linkTitle: "Testing During Review"
---

When a PR says that retries cannot create duplicates, the reviewer can test the situations where duplication might happen and inspect the saved state.

A coding agent can help write test clients, fixtures, fault injectors, and comparison scripts. That can make checks easier to run. The scripts still need checking: they can contain bugs or repeat the same wrong assumption as the application.

This article expands the testing step in [A Practical Review Process]({{< ref "ai/system-evaluation/review-flow-specification" >}}).

## Start with what needs to work


Pick important statements about the change, such as:

- retrying a request will not save the same operation twice;
- existing clients will still work;
- a migration will preserve the required data;
- a refactor will keep specified behavior unchanged;
- a new prompt or retrieval setting will improve answers without breaking existing cases.

Find the requirement behind the statement. The PR description tells you what the author believes; a requirement, API contract, or agreed design tells you what the system needs to do.

Make broad statements specific enough to test. For example:

> A confirmed request has a stable operation identifier. If the response is lost, retrying that request must not create another saved operation. The caller must be able to find out what happened to the first attempt.

Different APIs may promise different behavior. Establish what this system is required to support before testing it.

## Choose a useful check


Ask what could go wrong and what you would observe if it did.

For a retry change, useful cases might include a lost response, a process restart, concurrent requests, or repeated message delivery. For a compatibility change, try the relevant combinations of old and new clients.

Start with the few cases most likely to affect the review decision. Some questions can be answered by reading code; others need a unit test, integration test, or a temporary environment.

Use test systems or disposable data for checks that interrupt processes or change state. Be clear about which dependencies are real and which are mocked. A mock must reproduce the behavior being investigated.

## Check the test setup


Before relying on the result, ask:

- Does the test reach the code and failure path we care about?
- Is the expected result based on a requirement or just copied from the implementation?
- Does a mock assume the behavior we need to check?
- Are we checking saved data and side effects as well as the return value?
- Would the test fail if the relevant part of the fix were removed?

An extra agent can help inspect the setup, but it may make the same mistake. Focus on what the test does and what it can detect.

## Worked example: a response is lost after commit


Consider a change that retries an operation after a timeout. The PR says this cannot create duplicates.

**What needs to happen.** One confirmed request should create at most one saved operation, even when retried. The request has a stable identifier that the caller can use to check its result.

**What could go wrong.** The server saves the operation, but its response never reaches the client. The client retries with a new identifier, so the server treats it as a different operation.

**How to test it.** Send a request in a test environment. Let the receiver save the operation, then block the response. Trigger the client's retry. Inspect the saved records, operation identifiers, emitted events, and the client's result.

Returning a timeout from a mock before it saves anything would miss this case.

**What a failure looks like.** Two saved operations represent the same confirmed request. First check that the test used the identifiers and conditions required by the API. If the failure is real, save the trace and enough state to reproduce it.

**What to revisit.** The timeout does not mean that nothing happened. Check how the caller keeps the same request identity, how the receiver prevents duplicates, and how the caller finds the result of an uncertain attempt. The fix depends on the actual API and storage behavior.

**What else to test.** Try a restart between attempts, concurrent retries, and genuinely different requests. A fix that suppresses every later request may prevent duplicates while also rejecting valid new work.

## Compare the old and new versions


Run both versions through the same relevant cases and compare what matters:

- returned values and errors;
- saved data;
- events and external calls;
- latency and resource use, where relevant.

Decide which behavior should stay the same before interpreting differences. A bug fix should change the failing behavior. An old bug should not become a requirement merely because the old version is easy to run.

Matching outputs can also hide changed side effects. Check those separately when they matter.

## When the change affects an AI feature


For changes to prompts, models, retrieval, or routing, record the versions, settings, source data, examples, and judging criteria used in the comparison.

Use examples that cover the jobs and failures the product needs to handle. Repeat runs when the same input can produce different results. Look at important regressions, cost, and latency as well as an overall score.

Keep the comparison fair. Changing the judge can change the score even when the product is unchanged. A different document set can make the task easier or harder. A few difficult examples can reveal bugs without telling you how often users will encounter them.

See [Evaluation in AI Product Development]({{< ref "ai/approach/evaluations" >}}) and [choosing evaluation cases]({{< ref "ai-engineering/evaluation/v1/coverage-and-case-design" >}}) for more detail.

## Keep enough information to reproduce a failure


Before deleting a temporary environment, save the useful parts: the reviewed commit, setup, commands, inputs, important logs or state, and what happened. Follow the project's rules for handling sensitive data.

Be clear about whether a later check reads an old recording or runs the system again. A new model call or a changed dependency can produce a different result.

Describe the result plainly:

- the checked cases passed, with any important gaps listed;
- a problem was found, with reproduction steps and its effect;
- the check could not answer the question, with the missing information explained.

Use that result in the review conclusion. One passing check is not a reason to ignore other important parts of the change.

## Make sure automated review is useful


Try the reviewer on past changes and known bugs. Have engineers check disputed findings. Look at missed bugs, false positives, how hard the findings are to verify, and the time and cost of running the review.

Finding more issues helps only when the findings are useful. Add tooling around checks that repeatedly help the team make better decisions.
