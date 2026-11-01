---
draft: false
toc: true
title: "Cases from product use"
description: "A case links an attempted customer job to its outcome, hidden human assistance, and supporting artifacts. Competing explanations and a next check keep observations useful without prematurely naming a cause."
linkTitle: "Cases from product use"
---

A case starts with an actual task attempt. It can be a failure, a success, an abandoned attempt, or a task that worked only because someone intervened.

Record the customer's job before naming a technical fault. "The answer was grounded" is a property of an answer; "the customer resolved the issue" is a different outcome.

## Small case record


Copy these fields into the product's existing issue or work log:

- **Job and acceptable result:** who was doing what, under which relevant conditions?
- **Observed result and consequence:** what happened, including correction, waiting, abandonment, or later rework?
- **Evidence:** links to the request, relevant input/state, result, and customer or reviewer response. Mark unavailable evidence.
- **Possible explanation and alternative:** what could account for the observation? "Unknown" is acceptable.
- **Next check and result:** what would distinguish the explanations? Leave the result empty until performed.
- **Decision and limits:** what changes now, and what remains unsupported?

Add the date and product version where needed to distinguish cases. Add model, source, prompt, tool, and state versions when they matter for reconstruction. Record which conditions could not be recovered.

Use the [debugging guide]({{< ref "ai-engineering/causal-stack/debugging" >}}) to decide which artifacts are worth collecting. Recording everything indefinitely is not a prerequisite for investigating one problem.

## Capture the human contribution


Include setup, prompting, checking, correcting, and later repair. Record help supplied by the builder or operator as well as the customer. Otherwise a manually rescued workflow can look like successful automation.

Define completion at the right boundary. For a support product, draft accepted, reply sent, and customer's problem resolved are three different events.

## Keep a useful set of cases


Collect ordinary successes alongside failures. When investigating a recurring problem, retain the difficult cases but also sample normal work so their frequency is not exaggerated.

Separate cases used to develop a fix from fresh cases used to assess it. Keep attempted tasks in the record when they are abandoned or completed manually. A result calculated only from accepted outputs hides failures.

A customer correction is evidence of a problem or preference; check whether it establishes a reusable requirement. A reviewer can be mistaken, and two customers may legitimately need different behavior.

## Illustration of the distinction


**Constructed example, not a measured case:**

> A support person asks for the current return policy. The draft states the old return period. The person changes it before sending. We have the request, draft, and correction, but no captured model input.
>
> Possible explanations include stale retrieval, an omitted current excerpt, or incorrect generation despite current information. First inspect source versions and reproduce the context assembly. We cannot yet say that the model ignored the current source.

This record is useful without deciding which fault family it belongs to.

When the same pattern recurs, link the cases and formulate a [claim]({{< ref "ai-engineering/causal-stack/claims" >}}). Do not turn an illustration into a finding by copying it into a results table.
