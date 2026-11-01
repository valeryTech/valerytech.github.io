---
draft: false
toc: true
title: "Shared Definitions for Requirements, Acceptance, Claims, Support and Assurance"
description: "Five definitions that the frameworks share: the two forms of a requirement, acceptance, the form of a claim, support, and the assurance an acceptance needs."
linkTitle: "Shared Definitions"
---

This note defines five things that the frameworks on evaluation, product decisions, design, work with agents, dialogue, context and memory, system models and engineering all use: the two forms of a requirement, acceptance, the form of a claim, support, and the assurance an acceptance needs. Each framework links here and states only what is specific to its subject.

## Base terms


- **Item.** Anything that can be offered and accepted: a value, a draft, a change, a statement, a plan, a check. Its **source** is the person, model, tool or search that produced it. An **offer** is an item that a source has put forward and nobody may rely on yet.
- **Version.** One fixed state of an item or a system. A system version covers model, prompts, code, tools, data and settings; for a practice, or a probe made before any version is fixed, it is the practice or the means as used. The **environment** is what the system depends on and doesn't control: external services, data that changes, the date.
- **Record.** A durable entry that code can read: an item version with its source, an observation, an acceptance. Together they are "the record".
- **Observation.** A record of what happened or was said, with source and time, kept as it was made, or a statement read from such records that cites them and adds no judgment: a trace, or "the agent called the refund tool twice" read from it.
- **Party.** A named person, or a group that answers as one, to whom an act is attributed. Whether a model or a program can be a party is an open choice; this note follows the first option, in which a model or a program is a source that can apply a rule, and the act belongs to the party that set the rule.
- **Claim.** A statement that could be false about a named system version in stated situations. A **requirement** is a claim that a party needs to be true before it relies on the system.
- **Check.** A procedure that reads records and returns a result, carried out by code, a model or a person.
- **Finding.** What check results show about a claim. It is an offer to whoever decides.
- **Decision.** A choice by a party among stated options, citing the findings it used.
- **Acceptance.** A decision by an entitled party, under a stated rule, that one version of an item may be relied on for one purpose. The **point of acceptance** is the place in code that every acceptance of one kind of item passes through: a gate, a commit step, a constructor. A **second path** is any other way to obtain an accepted item of that kind: a cast, a deserializer, a copy, a direct write. An acceptance with no such place in code, such as a label a reviewer adjudicates, is recorded, and no hard property covers it.
- **Effect.** A change outside the record that revising the record doesn't undo.
- **Commitment.** An accepted statement that named parties may rely on, with an owner who keeps it true or withdraws it openly. Every acceptance creates one: this version is fit for this purpose. Its size is what those parties lose if it is false and how hard it is to withdraw. The smallest is a decision that only the owner's later work builds on; whether that counts is an open choice.

## 1. Two forms of requirement


A requirement has one of two forms, and every requirement names its form.

| | Hard property | Measured claim |
| --- | --- | --- |
| Definition | Holds for every item accepted at a named point of acceptance. Code there rejects, or can't produce, an item that violates it, and items of that kind are accepted nowhere else. | Holds at a stated level, a share or a margin against a baseline, over a stated population of situations, for one system version. The population can be a fixed set, such as one run's screened-out documents, sampled at random. |
| A property of | Each accepted item, as a condition over records that exist at acceptance. Code alone decides it; a verdict by a model or a person can be one of the records. | One system version's behavior across the population. |
| Established by | Reading and testing that code, and showing there is no second path to acceptance. | A measurement on cases from the population that meets the condition for support (section 4). |
| Can't say | What code can't decide from the records: that a passage supports a statement, that a draft is what the user meant. How many acceptable items are rejected. | Anything about a single item, another system version or other situations. |

```text
Hard property:  For every [kind of item] accepted at [point] for [purpose], [condition]. Enforced by [check or constructor]. Assumes [assumptions].
Of a component: For every input to [component], [condition]. Established by [proof, or reading and testing its code]. Assumes [assumptions].
Measured claim: For [system version] on [population], [behavior] holds at [level]. Measured by [evaluation]. Lapses when [version or population] changes.
```


**A hard property of a component**, such as TCP's ordered delivery or a refinement that keeps every trace inside the specified set, has no point of acceptance. It is established by proof or by reading and testing the code, as in conventional software, and the rest of this note applies to it as to any hard property.

**A rule that people follow with no code to enforce it**, such as a review step in a workflow, gives a hard property only where code requires a record of the step: that the record exists. That the step is followed and catches what it should is a measured claim or an assumption.

Behavior wanted with no stated level is best-effort behavior, as in [the note on prompt-specified systems]({{< ref "ai/design/prompt-driven" >}}). It isn't a requirement, and no acceptance depends on it.

**"Every time" is available only for what code can decide.** A requirement about meaning (no risk signal is dropped, the draft is what the user meant) can in that form be contradicted by one case and supported by none. It is written as a measured claim: the largest share of failures at which the party that relies on it would still rely on it, with that party as owner. Giving the judgment to a person changes who answers for the share, and the form stays. The hard property available is about records: a named person accepted this version.

**A requirement with parts of both forms** is split into the hard property of records, the measured claim about what is left, and each assumption that neither establishes. The requirement that a compromised ticket is never closed automatically, in the example of [the behavioral evidence note]({{< ref "ai-engineering/approach/behavioral-evidence" >}}), becomes: no ticket whose classification record says compromised is passed to the close operation (hard property); at least 97% of compromised tickets are classified as compromised (measured claim); tickets in use are like the measured ones (assumption).

## 2. Acceptance


For one party and one purpose, a version of an item is in one of three states.

- **Offered.** A source has put it forward.
- **Acknowledged.** The party addressed has received this version. This records delivery only. A model's reply that it understood is at most an acknowledgement. A person's reply ("yes, that's what I meant") is an acceptance when it answers one shown version and the rule names that person and the purpose; otherwise it is an acknowledgement.
- **Accepted.** An entitled party has decided, under a stated rule, that this version may be relied on for this purpose. The other outcome is rejected.

Each acceptance is a dated record that names four things.

```text
Version: the exact version of the item
Purpose: what it may now be relied on for
Rule:    who may accept this kind of item for this purpose, and which records must exist first
Party:   who accepted; when code applies the rule, the party that set it
```


An item has no single status: its status is the list of its acceptances. An acceptance for one purpose doesn't cover another, and an effect needs an acceptance of its own. The rule says who is entitled; this note doesn't say who it should be.

**When the item changes**, the new version is offered and no earlier acceptance covers it. Items made from the earlier version, and acceptances that used it as support, are stale until checked against the new one. A point of acceptance that releases an effect compares the accepted version with the version it acts on.

| Case | Offered | Accepted | Lapses when |
| --- | --- | --- | --- |
| A proposed change to a record | The change, with its source | An entitled party, or code under its rule, makes this version part of the record | The proposal is edited |
| A candidate becomes evidence | A search returns a hit | Twice: kept for the inquiry, then accepted by a judge as support for or against one named claim | The source document changes |
| An assumption becomes an obligation | The claim, in the form of section 3 | Its owner accepts it as part of a commitment to named parties | The situations widen or the system version changes; the commitment stays until its owner narrows or withdraws it, and the old version's acceptance and measurements lapse |
| A user confirms a draft | The system shows draft version n | The user confirms version n for one save | Anyone edits the draft |

A claim is held as an assumption when an observation that disagrees with it changes the claim, and as an obligation when such an observation changes the system or openly narrows the commitment. Acceptance as part of a commitment makes it an obligation, as [the risk model]({{< ref "ai/product/risk-areas/risk-areas-model" >}}) says, whatever is known about it. It usually stays an assumption as well.

**The limit of an acceptance.** An acceptance gives authorization: an entitled party allowed this version for this purpose. It is also a check, so it supports the claim that the item is right only as far as the accepting party would have rejected a wrong item (section 4). That share is a measured claim, and until it is measured, "the user confirmed" gives authorization and no support.

## 3. The form of a claim


A claim that can be supported or contradicted has five fields.

```text
System version:         for a hard property, the code at the point of acceptance or the component; the environment the claim assumes
Situations:             the population, how cases were taken from it (all, a random sample, designed to be hard), and whether a share counts cases or runs when cases are repeated
Behavior and criterion: what the system does, the rule that decides it for one case, and who or what applies the rule
Required level:         every time | at least a share | no worse than a baseline by a margin
Set by, and when:       the party that relies on the claim, and the date
```


A share or a margin says how a result is compared with it: by the measured share or by the end of its interval less favorable to the claim, which is the lower end for a share of successes and the upper end for a share of failures such as a miss rate. A percentile is a share: "p95 under 8 s" is at least 95% of requests under 8 s. A margin can also require an improvement: "lead time at least 10% shorter than the baseline". With one to three cases neither comparison shows that a share is met, since each case moves the share by a third or more; such cases show that a behavior can occur and find failures. "Every time" belongs to hard properties and the other two forms to measured claims. A claim that something can be done at all keeps its required level, tested with the most favorable means on cases chosen to be hard.

**The level is set before the results by whoever relies on the claim.** For the users of a product, the owner of the commitment sets it. A statement with no level is not yet a claim: "47 of 48 cases passed" neither supports nor contradicts it. With "every time" the one failure contradicts the claim, and with "at least 95% by the measured share" the result meets the level on those cases.

Three examples, with invented numbers:

| Field | Every time | At least a share | No worse than a baseline by a margin |
| --- | --- | --- | --- |
| System version | A transaction capture assistant's executor at one commit, with any model and prompt | A retrieval system over a closed set of notes: one snapshot, index, model and prompt | A coding agent with a new root instruction file; baseline: the same model with the current file |
| Situations | Every request to save a transaction | 60 questions taken at random from the question log, with relevant passages labeled over the whole snapshot | The 40 closed issues of the last quarter that have a reproducing test, each run three times; the share counts runs |
| Behavior and criterion | A transaction is saved only if a confirmation record exists for the same draft version; decided by code | The 50 candidates contain the labeled passages; decided by passage identifier | The change passes the reproducing test and every test that existed before the session |
| Required level | Every time | Mean recall per question of at least 95%, by the lower end of the interval | Share of solved tasks at most 5 points below the baseline |
| Set by, and when | The product owner, before release | The person who will rely on the synthesis, before the run | The engineer who maintains the agent setup, before either run |

## 4. Support


**The condition.** A result supports a claim only as far as the procedure that produced it would have given a different result had the claim been false. To apply it, name one way the claim could be false and say what the procedure would then have shown.

- **Scope of a check.** The set of wrong versions of the item checked that the check would reject; the item is a value for a type and the implementation for a test or a review. A pass supports "the item is none of these" and nothing wider.
- **Independence.** A check is independent of an item, with respect to one kind of error, when nothing that could put that error into the item would also make the check miss it. A statement of independence names the kind of error and the common source of error that was removed. A fresh context removes the author's line of reasoning and keeps a wrong task text. Tests written in the session that wrote the code share any misreading of the task with it.
- **Evidence.** An observation or a finding in relation to a named claim. Kept with no claim named, it is a collected item. Results with a common source of error count once for that error: a passage, its copy and a summary of it are one source.

Three things follow.

- **A check that never fails supports nothing.** The same holds for any result the procedure would give either way: a missing record, a rule for reading results chosen after them, cases used to build the fix, a number that a model reports whether or not it's right.
- **A result outside the claim's coordinates supports it only through a stated assumption.** The coordinates are the first three fields, and a result also has the environment and date it was obtained in. A result for another system version, environment or date, other situations or another criterion counts only when the assumption that joins them is written down, for example "these designed cases stand for live requests of the same class". The assumption is a claim of its own.
- **No difference seen supports "no worse" only when the design could have seen one.** A level of the form "no worse than a baseline by a margin" is met only when the measurement would have shown a drop of the size of the margin, as [the evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}) says for one case.

## 5. Assurance before an acceptance


How much assurance an acceptance needs depends on two inputs.

1. **The loss.** What the parties who rely on the accepted item lose if it is wrong and the acceptance isn't undone.
2. **The chance of not noticing.** The chance that the item is wrong and nobody notices in time to undo the acceptance.

The assurance needed grows with both. Two levers supply it.

1. **More support** for the claim that the item is right: a check with a wider scope, a check that is independent with respect to the likely error, more cases, a source's record on this type of task. It lowers the second input.
2. **A smaller commitment**: fewer supported situations, a draft in place of an effect, fewer people exposed, a way to withdraw. It lowers the first input, and the second when it makes a failure visible sooner.

Assurance belongs to one acceptance. A level given to a system, a task type or a type of action is a default over many acceptances. Before an acceptance, the party that will own the commitment says what support is enough for it. Then the item is accepted, or more support is obtained, or the commitment is made smaller until the support at hand is enough.

**"Enough", "closed" and "sufficient" always name the commitment they are enough for.** "Possibility: closed" is written "enough support to commit two weeks to finding an approach". Support that is enough for one commitment says nothing about a larger one.

| Acceptance | Loss if wrong and not undone | A wrong item passes when | More support | A smaller commitment |
| --- | --- | --- | --- | --- |
| Merging a code change: how deep is the review? | What later work and users lose, and what a revert can't restore | The change is hard to check; the tests were written with the change | Tests that existed before the change; a reviewer who didn't steer the session | A smaller change, a staged rollout, a tested revert |
| An assistant's action: ask or act? | What a wrong value costs the user | The user doesn't see the effect; the user never stated the value | A value the user entered or stated; a question for the missing fact | A draft; an effect that is shown and can be undone |
| A release: how much evaluation? | What users lose when the stated behavior fails | Failures aren't detected in use; the cases differ from live situations | More cases from the stated population; cases for the serious failures | Fewer supported situations, a limited rollout, a way to stop |
| Fixing a structure that other parts build on: can it be postponed? | Rework in everything built on a wrong structure | A wrong structure is absorbed without a signal | Real cases; a trace of how the failure happens | A default with a trigger; a decision hidden so that little depends on it |

Working without a structure is an acceptance too. The decision can be postponed when that is the smaller commitment: a loss from the missing structure would be noticed and undone in time, and no hard property depends on the structure.

## Open choices


The rest of this note follows the first option of each.

- **Whether a model or a program can be a party.** First option: its acceptances belong to whoever set the rule it applies, so a person or group answers for every acceptance, and the design research's neutrality between participants is given up. Second option: a model-backed process that holds a grant can be the party; participants are treated alike, and each rule also names who made the grant and answers for its misuse. Either way, how often the process rejects a wrong item is a measured claim.
- **Whether a commitment to oneself counts.** First option: a builder who accepts an item and is its only user records the acceptance, and the assurance rule applies with the builder's own rework as the loss. Second option: a commitment needs a party other than the one who accepts, so the builder's decision is a working assumption with no record until the first acceptance that others rely on, such as a first release. The first keeps one rule from the first day; the second drops records nobody else reads.

## What these definitions don't cover


- **Value and progress.** The definitions say what may be relied on and leave open which accepted items are useful. A system that accepts nothing meets every hard property, and a smaller commitment is safer and gives less.
- **Where claims and criteria come from.** Every definition starts from a claim that is already written. A system can meet all five against the wrong requirement.
- **The limits of a person's attention.** How much a person can check, and how often a person who is shown a wrong item notices it, are quantities the definitions use and don't supply.

## Terms this note replaces


| Older term | Framework | What to write now |
| --- | --- | --- |
| "Guarantee" and "invariant" for both forms | System models, design, dialogue | Both words only for a hard property with its check and assumptions |
| "Statistical requirement", "rate" | Design, system models | "Measured claim". "Best-effort behavior" keeps its name |
| "Validated", "backend validates" | Dialogue | "Passed [named checks]", each a hard property; that the value is what the user meant is a measured claim |
| "Complete", `coverage = complete` | Context and memory, design | "Every listed item has a record" (hard property) and "at most [share] of relevant items missed" (measured claim) |
| "Bounded behavior" | System models | The situations of each measured claim, and separately the hard properties on effects |
| "Confirmed", "approved" as a state; one status field | Dialogue, design, work with agents | "Accepted by [party] in version [n] for [purpose]" |
| "User confirms", "human review" as a control | Dialogue, system models, work with agents | A hard property (an acceptance by a named person exists for this version) and a measured claim (the item is right) |
| "Ground" and "review and commit" as two mechanics | Design | One protocol. Common ground is the set of readings a named person has accepted |
| Obligation "when the solution is known" or "when the rung closes" | Product | An obligation when accepted as part of a commitment |
| "Behavior claim", "assumption", "capability claim" with no level; "threshold", "bar", "tolerable rate" | Evaluation, product, capability notes | A claim in the five fields; "required level" |
| "Evidence" for a trace or for kept items | Evaluation, context and memory | "Record" or "observation", "collected items"; "evidence" and "support" only with a named claim |
| "Independent" as yes or no; "fresh context" as its definition | Work with agents, engineering, design | "Independent of [item] with respect to [kind of error]", with the common source of error removed |
| "Confidence" compared with a threshold | Dialogue, design, context and memory | Support only where the number has been measured to differ between right and wrong items for this system version; otherwise name the checks passed |
| "Closed"; "enough", "sufficient", "ready" with no object | Product, system models | "Enough support for [commitment]", with the support and the date |
| "Scale the depth to consequence, uncertainty and reversibility"; "autonomy matched to evidence" | Work with agents, engineering, product, dialogue | The rule of section 5: the loss, the chance of not noticing, and the lever used |
