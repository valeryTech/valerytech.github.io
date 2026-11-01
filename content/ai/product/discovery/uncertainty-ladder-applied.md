---
draft: false
toc: true
description: "The uncertainty ladder placed on the owner's own cases: worked claim records for Wallet capture and the Still companion, the operation rung in the recruiting coordinator, and a table of open rungs. Placements are to check, not evidence."
title: "Uncertainty Ladder Applied"
linkTitle: "Uncertainty Ladder Applied"
---
# Uncertainty ladder applied to the cases


This note places the [`uncertainty ladder`]({{< ref "ai/product/discovery/uncertainty-ladder" >}}) on undertakings already described elsewhere in these notes: the eight [AI project examples]({{< ref "ai/system-types/project-examples/ai-project-examples-and-design-model" >}}), the systems under test and SUT candidates, and the Wallet [`utility ladder`]({{< ref "ai/product/operating-model/solution-utility-ladder" >}}).

The placements are a reading of the existing notes, not evidence. Where a rung is marked closed, the note says what observation closes it; where no such observation has been recorded, the rung is open whatever has been built. Every row is for the owner to confirm or move.

Two cases are worked as claim records: Wallet transaction capture, where possibility was never in doubt and the open rungs are the usual ones, and the Still hard-moment companion, where possibility is open on a safety-critical property. The recruiting coordinator gets a paragraph for the operation rung. The remaining cases are placed in one table.

## Case 1: Wallet transaction capture


The common case. The ladder's main use here is to say which claims are not research, so they are not treated as research.

Scope is the utility ladder for Solution B: common expenses within a stated range of accounts, dates, currencies, and language; an editable draft confirmed before saving.

### Claim: U2, correct draft for clear supported expenses

```text
Claim:        For clear, complete common expenses, the draft contains the values
              required by the stated fields, rules, and current Wallet data.
Situation:    Common, complete expenses (coverage C1).
Bar:          The plan's criterion per case; owner review of the whole trace.

Possibility:  not in question. Current models extract amount, account, category
              from short text; the dataset-1 walkthroughs show it.
Approach:     open, pending review. The recipe exists (router, interpreter,
              propose-then-confirm) and runs on workbench-check-8. It closes when
              the owner's reviews of held-out cases are recorded, not when the
              code checks pass.
Feasibility:  open. Two constraints untested at the bar: a smaller model
              (qwen3.5:4b) and variability across repeated runs (each case
              currently runs once).
Operation:    open; conventional. No live users. The production commitment
              draft states the obligations; none observed yet.
Value:        open. U6 (less effort than the quick form) and U7 (recorded
              sooner) have no evidence. Both can be probed before feasibility
              closes: a comparative usability study needs only the prototype.

Next rung to work:   approach, by recording the expert reviews on the eight
                     cases; then feasibility, by repeated runs and the smaller
                     model on the same cases.
Result that moves the decision:  failures in review that the code checks
                     missed change the plan; a smaller model within the bar
                     changes the cost assumption.
Reconsider when:     model version changes (approach carries the version it
                     closed on).
```

### Claim: U3, missing information stays unresolved

```text
Claim:        Missing or ambiguous important information remains unresolved
              instead of being invented.
Situation:    Expenses with missing information (coverage C2).
Bar:          A question instead of a guessed candidate (plan expectation 3);
              no guessed endpoint (tuple T006 failure surface).

Possibility:  open on one property, probably closable in a day. Models tend
              to fill gaps with a default account or "today". Whether the best
              available model, with unlimited prompting, refuses to guess
              across hard instances has not been recorded.
Approach:     open. Depends on possibility.
Feasibility:  open. The property has to hold across the variation in C6
              (wording, shorthand, references) and under the smaller model.
Operation:    not in question separately from U2.
Value:        not in question. The property is a required condition of the
              commitment, not a benefit users choose.

Next rung to work:   possibility, by an existence probe: the hardest
                     underdetermined inputs from dataset-1 and new ones,
                     best model, hand-steered prompt, owner reads failures
                     for invention versus clarification.
Result that moves the decision:  stable invention under favorable conditions
                     moves the property into code (a guard that blocks a
                     draft with unresolved required fields), which your
                     "one requirement, several implementations" comparison
                     already proposes.
Reconsider when:     a new model generation.
```


What the two records show: the project is not "on a rung". U2 is open at approach and feasibility; U3 is open at possibility on one property; both are open at value, and value can be probed now.

## Case 2: Still hard-moment companion


The rare case. A claim is open at possibility on a property where one missed failure matters.

Scope is Release 1 of the fasting assistant: conversational support in a hard moment, with the "must not" lines in the features document and the safety rules as the floor.

### Claim: supportive without pushing, with red flags caught

```text
Claim:        In a hard-moment conversation, the companion responds in an
              MI-consistent way, does not agree to extend a fast under
              pressure, and recognizes a red flag stated inside the
              conversation.
Situation:    Hard moments during a running fast; the person may be
              describing symptoms indirectly.
Bar:          Zero missed red flags on the probe set. MI consistency as a
              trained coder would judge it. "Supportive" is not yet defined
              closely enough to be a bar; see below.

Possibility:  open. Three properties, each possibly open:
              (a) refusing to extend under sustained pressure across turns;
              (b) recognizing a red flag embedded in talk about hunger;
              (c) MI-consistent response rather than advice or reassurance.
              (a) and (b) are likely closable by an existence probe.
              (c) is open at the bar because the bar's instrument is open
              (see the MITI evaluator in the table).
Approach:     open. No recipe can be tested until the bar is judgeable.
Feasibility:  open. Local or small models for a personal app; latency in a
              conversation someone is having while struggling.
Operation:    open; distinctive. The production sample is the owner's own
              health data; traces need access and retention rules before
              anyone else can review them.
Value:        open. F19's intent is support in the moment; whether a person
              in a hard moment opens the app at all is a value question
              that a stand-in (a human replying by message) could probe
              before any of the above.

Next rung to work:   possibility, decomposed. First (b) and (a): adaptive
                     participants who escalate pressure and bury a red flag;
                     owner reviews every trace; one miss is a negative
                     result for that configuration. Then (c), only once a
                     trusted coder has labeled a set of turns.
Result that moves the decision:  a miss on (b) under favorable conditions
                     moves red-flag detection out of the conversation into a
                     deterministic check on the transcript, or narrows the
                     commitment to exclude hard-moment support.
Reconsider when:     a new model generation; a trained MI coder becomes
                     available.
```


What this record shows: the bar for (c) cannot be stated without an instrument that is itself open at possibility. Until the MITI evaluator is validated, apparent progress on "supportive" cannot be read. This is the ladder's "check the measurement first" in a concrete case, and it argues for working (a) and (b) first, where code and the owner can judge.

## Case 3: Recruiting coordinator, and the operation rung


The [coordination note]({{< ref "ai/system-types/project-examples/cases/agentic-operations-and-coordination" >}}) gives the sentence that justifies the operation rung as a kind of unknown rather than a release stage: sending an email does not establish that the recipient responded; creating a meeting does not establish that it occurred; completing several operations does not establish that the objective was achieved.

For the coordinator, possibility is closed per step (each tool call is ordinary), approach is open (how much discretion the model gets over next steps), and feasibility is secondary. The dominant open rung is operation: waits over days, restarts, participants who change their minds, and verification of outcomes against external state rather than against the action taken. No prototype closes it; only limited real use with observation does. A production commitment for this case would accept that uncertainty explicitly and say what it observes, which is why the rung and the commitment are two forms of the same concern.

The SUT candidate for this rung is the Wallet recurring-charge review with a check the next month (code LT). It is the only candidate whose evidence cannot be produced in a single session, which is what makes it an operation probe.

## The other cases in one table


Placements are to check. "Settled" means the owner's notes already contain the observation; "open" means no observation is recorded; "one property" names the specific behavior that keeps possibility open.

| Case (type) | Possibility | Approach | Feasibility | Operation | Value | Note |
| --- | --- | --- | --- | --- | --- | --- |
| Wallet spending questions answered by deterministic queries (analytical environment) | Settled | **Open: H2**, translate to queries versus let the model calculate | Follows the recipe | Low | Open | The comparison is the probe; result named in advance |
| Wallet message router on a smaller model (component) | Settled | Settled | **Open**: smaller model at the bar | Low | Not in question | A pure feasibility probe; CP and RV |
| Meal capture with clarification questions (domain copilot) | Settled for estimation; **one property open**: whether questions reduce error enough | Open: which question policy | Open: photo and voice input | Low | Tied to the possibility property | Weighed meals give a reference, itself an estimate |
| Still weekly review numbers (analytical environment) | Settled | Settled, if numbers come from code | Open: every stated number matches | Low | Open | Mostly a required condition |
| Still notes into themes (analysis) | **One property open**: themes supported by quoted notes, invariant to note order | Open | Open | Low | Open | EV: a criterion worth automating once labeled |
| Still rules and phase answers (support) | Settled | Open: grounding in protocol definitions | Open: paraphrase and language invariance | Low | Open | GR and RF |
| Audit analytical assessment (analysis and investigation) | **One property open**: attention shadowing. Whether coverage can be assured, or only measured, is unresolved | Open | Open: summarized views lack the underlying transactions | Open | Judgment stays with the auditor | The one case where possibility may stay open at the bar |
| Context-aware support with a refund workflow (synthetic) | Settled | Settled in architecture: read-only plus bounded workflow | Open | Open | Not probeable; no real users | Synthetic cases cannot close value |
| Coding agent on Still and Wallet (coding agent) | Settled | Open: which tasks, with which checks | Open | Open: production samples exist | Open | PS makes operation probeable now |
| MITI-based evaluator (instrument) | **Open**: agreement with a trusted coder on boundary turns | Open | Open: TPR and TNR on held-out labels | Low | Only if the companion is pursued | On the ladder as an instrument, not a product |
| Simulated participant for adaptive cases (instrument) | Settled | Open: follows case rules, acts only on visible evidence | Open | Low | Not in question | Validated by review, not by seeded faults |

## What the cases show


**Possibility is open in a minority of claims, and on one property each.** Not "can Wallet capture expenses" but "does it refuse to guess"; not "can Still talk" but "does it catch a red flag inside a hunger conversation"; not "can the audit system find patterns" but "can it avoid hiding the ones it did not find". This confirms that the rung is asked per claim. It also sets the scale of the probe: hard instances plus the owner's review, not research methods.

**The instruments are on the ladder.** Two rows are evaluation components, not products. The MITI evaluator's open possibility blocks the bar for a product claim. The eval-failure-mode note's catalog (an always-pass judge, rubrics written before failures, annotators below chance) is the list of ways a team misreads its rung. Reading the ladder's diagnostic table before the instrument is sound produces the wrong rung.

**Operation is a kind of unknown, not a release stage.** The coordinator shows it: a system can be possible, have a recipe, meet constraints, and still have no way to verify its own outcomes. The production commitment is how that uncertainty is accepted, not how it is closed.

**The SUT discipline already is the per-rung toolkit.** "Add a SUT when an evidence need appears" and "complete one evaluation before expanding" are gate rules. Each candidate's "decision it could inform" names the rung its evidence would move. The one addition the ladder suggests is a column in the candidate tables: which rung the decision reduces. Most entries would read "feasibility"; the exceptions are the ones to schedule first or to stop pretending about.

**Value is probeable early in almost every row.** A human stand-in, a comparative study on the prototype, the owner's own daily use. Nothing in the early rungs blocks it, and its result sets the bar that the early rungs are measured against.

## Open questions


- Which of the "one property open" placements the owner disagrees with, and on what observation.
- Whether the SUT candidate tables should carry the rung column, or whether the claim record in the general note is enough.
- Whether the audit case's attention-shadowing property is open at possibility (assurance cannot be reached) or at approach (nobody has a method yet). The assurance notes may already decide this.
