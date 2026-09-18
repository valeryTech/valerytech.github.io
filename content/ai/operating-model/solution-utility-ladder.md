---
draft: false
toc: true
title: "Solution Utility Ladder"
linkTitle: "Solution Utility Ladder"
---

A solution utility ladder connects basic system behavior to a useful result for the user and to the change the solution is meant to produce.

It answers:

> What must this solution do to help the user, and which claim should we examine next?

The ladder turns a broad statement such as "the AI works" into separate claims. Producing valid output, handling a clear case correctly, completing the user's job, and changing the target condition are different claims. Evidence for one does not establish the others.

The name does not mean that every level is direct value for a user. Early levels describe behavior needed to provide value later. Later levels concern the completed job, comparison with the current alternative, and the intended change.

Write a separate ladder for each solution and stated scope. It is not a product development process, a sequence of implementation tasks, or a set of release stages.

## Utility is not coverage


Coverage and utility answer different questions.

| Concept | Question |
| --- | --- |
| Coverage | Which users, inputs, situations, and tasks can the solution handle? |
| Utility | What can the user accomplish in those situations? |

A solution may work weakly across many situations or work well in a few. Adding another situation increases coverage. Making an existing situation more useful increases utility.

Do not describe the whole solution as being at one utility level when different situations behave differently. State both the situation and the claim:

```text
For common expense descriptions within the stated coverage,
Wallet can produce an editable draft that the user can confirm and save.
```

## Utility is not production readiness


The following questions are also separate:

| Concept | Question |
| --- | --- |
| Required conditions | What harm must be prevented or limited, and which safety, privacy, security, quality, and reliability limits must hold? |
| Operation | Can the behavior be observed, limited, stopped, recovered, and maintained within its capacity and cost limits? |

Safety and privacy are not higher levels of usefulness. They apply wherever the solution is used.

Production readiness is not a utility level either. A useful prototype may be unsafe or impossible to operate dependably. A reliable and observable system may still fail to help the user.

## Write a ladder for one solution and one stated scope


Start with the job or condition the solution is meant to affect. Then write a series of claims from weak technical behavior to useful product behavior.

Each level should:

- describe behavior that can be observed;
- be stronger than the level before it;
- name the situation in which the claim applies;
- avoid implementation tasks such as building a prompt or adding an API;
- avoid treating safety or production operation as a utility level.

The levels depend on the solution. Add, remove, or change them when this produces clearer claims.

The following pattern is a starting point, not a standard ladder:

| Level | Type of claim | Claim |
| --- | --- | --- |
| U1. Valid | Enabling behavior | The system produces an output the product can use. |
| U2. Correct | Enabling behavior | The product works as stated in clear supported cases. |
| U3. Handles uncertainty | Enabling behavior | The product marks missing or ambiguous information instead of hiding or inventing it. |
| U4. Holds across variation | Enabling behavior | The product keeps the stated behavior across the range of inputs in scope. |
| U5. Completes the job | User utility | The user can complete the whole job, not only receive an intermediate output. |
| U6. Improves on the alternative | Comparative utility | The solution is more useful than the current way of doing the job. |
| U7. Changes the target condition | Intended effect | Repeated use changes the condition the solution was meant to affect. |

U1 is a technical claim, not useful behavior for a customer by itself. Passing one level does not establish the next. A correct intermediate output does not show that the user can complete the job. Job completion does not show that the solution is better than the alternative. A better interaction does not show that repeated use changes the target condition.

Sometimes a stronger claim also introduces a harder situation. When that happens, record the change in coverage instead of hiding it inside the utility level.

## Relate the ladder to risk


The ladder separates claims about one solution. The [`risk model`]({{< ref "ai/risk-areas/risk-areas-model" >}}) helps find important assumptions that the ladder may not show.

The two views connect like this:

- U1 to U4 often provide evidence about Feasibility and product behavior.
- Evidence at U5 can support a Usability assumption, but only for the users and situations examined.
- Evidence at U6 can support a Value assumption, but only for the people, alternatives, and situations examined. It does not establish that people will choose, adopt, or continue using the solution.
- U7 is a claim about the intended effect. It sits outside the solution risk dimensions.
- Viability and Harm assumptions can affect any level.

The ladder does not replace the five risk questions. Use it to make utility claims precise, then check for important Value, Usability, Feasibility, Viability, and Harm assumptions that those claims do not cover.

## Wallet example


Suppose Wallet is considering a way to reduce the effort of recording transactions.

The condition is:

> People who track expenses may delay entry because recording a transaction takes effort.

One possible solution is:

> Let a person describe a transaction in natural language, then review and confirm an editable draft.

The table below contains claims to establish. It does not describe current Wallet capability or evidence.

| Level | Type of claim | Claim to establish |
| --- | --- | --- |
| U1. Structured | Enabling behavior | Wallet can turn an input into the transaction draft structure. |
| U2. Correct | Enabling behavior | For clear supported expenses, the draft contains the values required by the stated fields, rules, and current Wallet data. |
| U3. Handles uncertainty | Enabling behavior | Missing or ambiguous important information remains unresolved instead of being invented. |
| U4. Holds across variation | Enabling behavior | The behavior continues across the stated range of wording, account references, dates, currencies, and shorthand. |
| U5. Completes the job | User utility | The draft can be reviewed, corrected, confirmed, checked against Wallet rules, and saved successfully. |
| U6. Reduces effort | Comparative utility | With real latency and errors, people can record supported expenses with less effort while retaining understanding and control. |
| U7. Changes recording behavior | Intended effect | Repeated use causes transactions to be recorded sooner or more consistently. |

"Correct" here means correct against the stated fields and rules and the relevant Wallet data. It does not imply that every input has one objectively correct interpretation.

These levels move through different kinds of claims:

```text
valid output
    ↓
correct behavior in clear supported cases
    ↓
proper handling of uncertainty
    ↓
behavior across realistic variation
    ↓
completion of the user’s job
    ↓
improvement over the alternative
    ↓
change in the target condition
```


The example also has separate conditions that are not ladder levels:

- the model cannot change the ledger directly;
- nothing is saved before explicit confirmation;
- Wallet's ledger rules are checked before saving;
- retrying a save does not create a duplicate transaction;
- unsupported input fails without changing the ledger;
- handling, access, and retention rules for transaction text are defined.

It also has separate operating needs, including latency, reliability, cost, observation, versioning, rollback, recovery, and maintenance.

This is a draft example, not a claim that the solution has passed these levels. The project-specific reasoning remains in the Wallet `utility-ladder.md`.

## Use coverage and utility together


When coverage differs, record the claim and its evidence state for each situation instead of assigning one level to the whole solution.

For example:

| Situation | Claim to establish | Current evidence |
| --- | --- | --- |
| Common, complete expenses | An editable draft can be reviewed, confirmed, checked, and saved | Not yet established |
| Expenses with missing information | Missing important information remains unresolved | Not yet established |
| Transfers | Outside the proposed scope | Not applicable |

This makes two kinds of change visible:

- expanding the situations the solution handles;
- strengthening what the solution can do in an already supported situation.

## Use the ladder in a production commitment


The ladder helps define useful behavior. It does not decide whether that behavior is ready for production.

A [`production commitment`]({{< ref "ai/operating-model/production-commitment" >}}) defines what users can rely on within stated situations, then adds the conditions and responsibilities required for real use:

```text
production commitment
= stated scope and behavior people can rely on
+ limits and failure behavior
+ harm and required conditions
+ operation and support
+ accepted uncertainty and an observation plan
```


A production commitment does not need to include every ladder claim. Claims such as U6 and U7 may remain questions to investigate in controlled production use. They describe comparative utility or intended effects, not behavior that the product can promise. The commitment must distinguish what users can rely on now from what the product is still trying to learn.
