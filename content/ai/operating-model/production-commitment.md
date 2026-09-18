---
draft: false
toc: true
title: "Production Commitment"
linkTitle: "Production Commitment"
---
# Production commitment: what users can rely on


A production commitment states what people may rely on in real use and what we accept responsibility for.

It states:

- which users and situations are supported;
- who else may be affected and what harm must be prevented or limited;
- what users can rely on in those situations;
- what is not supported;
- what the product does when it cannot provide the expected behavior;
- which safety, privacy, security, reliability, capacity, cost, and other operating conditions must hold;
- which important assumptions remain, what happens if they are false, and what other uncertainty remains;
- how the behavior will be observed, limited, stopped, recovered, and maintained.

A commitment does not mean that all uncertainty is gone. It means that the remaining uncertainty is understood well enough to accept responsibility for defined behavior in a limited scope.

It changes the obligations attached to the solution. It does not end discovery or begin a separate delivery phase.

## Define what people can rely on


Describe the product behavior, not only the feature or implementation.

This is too broad:

> Provide natural-language transaction capture.

It does not say which transactions are supported, what the product will do, or what happens when the input is incomplete or ambiguous.

A clearer draft statement is:

> For people recording common expenses, Wallet will turn one natural-language description into an editable transaction draft. The person can review and change the draft before confirming it. Wallet will apply its ledger rules to the confirmed draft before saving one transaction. Missing or ambiguous information needed to record the transaction will remain unresolved. Unsupported or unsafe requests will not change the ledger.

This statement defines behavior that a user can observe. It does not require a particular model, prompt, or system design.

## Parts of a production commitment


Write each part separately.

| Part | Question |
| --- | --- |
| Supported situations | For whom and in which situations does the promise apply? |
| Supported behavior | What can a user accomplish and rely on? |
| Limits | What is not supported? |
| Failure behavior | What happens when the product is uncertain, unable to act, or outside its scope? |
| Affected people and harm | Who could be affected, including people who do not use the product, and what harm must be prevented or limited? |
| Required conditions | Which safety, privacy, security, quality, reliability, capacity, and cost conditions must hold? |
| Operation | How will failures be detected, exposure limited, changes reversed, and service recovered and maintained? |
| Remaining assumptions | Which important assumptions remain about the intended change, the candidate solution, or production and operation? What could happen if they were false, and why is it reasonable to accept the remaining uncertainty within this scope? |

Do not use one of these parts as a substitute for another. A useful behavior is not necessarily safe to operate. An observable and recoverable system is not necessarily useful. Wide coverage does not compensate for weak behavior.

The [`solution-utility-ladder.md`]({{< ref "ai/operating-model/solution-utility-ladder" >}}) describes how to make claims about useful behavior more precise. The [`risk model`]({{< ref "ai/risk-areas/risk-areas-model" >}}) explains the three areas of assumptions.

## State the limits


A smaller commitment may support fewer situations, promise less behavior, or both.

For example, Wallet might initially support common expenses but not income or transfers. It might promise an editable draft that a person confirms, but not autonomous transaction entry.

The limit must be explicit. Do not present partial technical behavior as support for the whole user job. Within the stated promise, do not quietly relax the conditions needed to make that behavior dependable.

For the Wallet example, a draft commitment might contain:

| Part | Draft commitment |
| --- | --- |
| Supported situations | Common expense descriptions within a stated range of accounts, dates, currencies, and language |
| Supported behavior | Produce an editable draft that can be reviewed, corrected, confirmed, checked against Wallet's ledger rules, and saved once |
| Not supported | Income, transfers, balance adjustments, autonomous saving, and requests outside the stated range |
| Failure behavior | Leave important uncertainty unresolved and reject unsupported or unsafe actions without changing the ledger |
| Affected people and harm | Protect account holders, payees, and people named in transaction text from unauthorized exposure or use of their information |
| Required conditions | The model cannot write to the ledger; nothing is saved before confirmation and Wallet's ledger checks; retries do not create duplicates; rules for access to and retention of transaction text are defined |
| Operation | Detect failures, limit rollout, identify the system version involved, stop or reverse changes, and recover safely |
| Remaining assumptions about the intended change | Lower effort will cause transactions to be recorded sooner or more consistently. If this is false, the interaction will not change the target condition. |
| Remaining assumptions about the solution | People will choose and continue using natural-language entry instead of the current method. If this is false, the solution will not be used enough to help. People can also recognize and correct a wrong draft. If this is false, they may confirm incorrect ledger entries. The range of inputs people will provide is still uncertain. |
| Remaining assumptions about production and operation | Latency, capacity, operating cost, failure rates, and regressions will remain within stated limits in real use. If this is false, the scope may need to be narrowed or the release stopped. |

Wallet's ledger checks can enforce rules about valid accounts, currencies, and ledger changes. They cannot prove that the draft means what the person intended. Review, correction, confirmation, and observation are still needed.

Accepting these unknowns would be reasonable only if evidence supports the promised behavior and the release has a limited scope, failure detection, and a way to stop or reverse the change.

This shows how to write a commitment. It does not show that Wallet is ready for production.

## Record the basis for the commitment


The commitment should point to the evidence that supports it and state the limits of that evidence.

Record:

- which important claims are supported;
- which important assumptions remain in each relevant area and what could happen if each were false;
- why it is reasonable to accept the remaining uncertainty within the stated scope;
- which failures would cause the scope to be narrowed, the release to be stopped, or the commitment to be withdrawn;
- what will be observed to detect a failure of the commitment;
- when the decision will be reconsidered.

Some questions can only be answered in production. That is a reason to limit exposure and observe the result, not a reason to leave the promise unclear.

## Commitment record


Use only the fields that matter for the decision.

```text
Users:

Supported situations:

What users can rely on:

Unsupported situations:

Behavior when information is missing, ambiguous, unsafe, or unsupported:

People other than direct users who may be affected, and harm that must be prevented or limited:

Required safety, privacy, security, quality, reliability, capacity, and cost conditions:

How failures will be detected:

How exposure will be limited:

How the change can be stopped, reversed, or recovered:

What will be maintained:

Evidence supporting the commitment and its limits:

Important remaining assumptions and consequences if false:
- intended change:
- candidate solution:
- production and operation:

Other remaining uncertainty:

Why accepting the remaining uncertainty is reasonable within this scope:

What will be observed to detect a failure of this commitment:

Conditions for changing or withdrawing the commitment:
```

## Change the commitment when the evidence changes


A production commitment is not permanent. It may be expanded, narrowed, or withdrawn.

When the commitment changes, update the supported situations, promised behavior, limits, affected people and harm, required conditions, remaining assumptions, and operating obligations together. A wider scope is a new commitment. An important change to what users can rely on is also a new commitment.
