---
draft: false
toc: true
title: "Worked Example: Shipping an Expense-Capture Workflow"
description: "One end-to-end evaluation pass with copyable artifacts: production commitment slice, SUT manifest, case and trace excerpt, narrow LLM judge prompt, 2-arm × 3-repeat case summaries, finding rule, and 3-loop shipping actions."
linkTitle: "Worked Example"
---

This walkthrough applies [Commitments and claims]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}}), [Cases and coverage]({{< ref "ai-engineering/evaluation/framework-v2/cases-and-coverage" >}}), [Evaluators and calibration]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}}), and [Experiments and findings]({{< ref "ai-engineering/evaluation/framework-v2/experiments-and-findings" >}}) to a real shipping gate, with concrete artifacts an engineer and PM can adapt directly.

## 1. Product framing and decision


A personal-expense assistant (`C3` in [LLM capabilities]({{< ref "ai/heuristics/llm-capabilities" >}})) turns a short message into an editable transaction draft (`U1–U5` on the [solution utility ladder]({{< ref "ai/product/operating-model/solution-utility-ladder" >}})) and saves one ledger entry after explicit user confirmation.

- **Supported scope & proposed commitment:** single-currency English text expenses against accounts in the user's workspace; ambiguous totals or accounts must stay unresolved and trigger a brief clarifying question; income, transfers, receipt photos, and autonomous saves are unsupported ([production commitment]({{< ref "ai/product/operating-model/production-commitment" >}})).
- **Decision on the table:** does candidate prompt `v2` + executor `exec@1.4` have enough support to open a reversible **25-employee internal pilot**, where every saved entry is inspectable and undoable?
- **Evaluation question:** does `v2` fix the subtotal-vs.-total failures discovered in `v1` without regressing on ambiguity clarification, latency, or cost?

## 2. Claims, required levels, and criteria


Before running any case, the product owner splits the behavioral expectations by their form ([the shared definitions]({{< ref "ai-engineering/shared-definitions" >}})):

| Expectation | Form | Criterion | Evaluator | Required level (set before the run) |
| --- | --- | --- | --- | --- |
| **C1. No unconfirmed save** | Hard property | `save_transaction` executes only when a confirmation record exists for the same draft hash, and read-only ledgers reject writes | Code inspection of `exec@1.4` plus a deterministic trace check that flags any `save_transaction` call without a matching confirmation ID | Every time (established by reading and unit-testing `exec@1.4`; trace check verifies wiring) |
| **C2. Stated total preserved** | Measured claim | When the user states an unambiguous final total, `draft.amount` equals that total in minor units | Deterministic check comparing `draft.amount` against the case's reference amount (`NOT APPLICABLE` when the case is intentionally ambiguous) | `all pass` on all 8 unambiguous cases in the comparison set, and no case worse than `v1` |
| **C3. Ambiguity triggers clarification** | Measured claim | When two plausible totals or accounts remain, the assistant asks a specific clarifying question and creates no draft total | Narrow LLM judge (`judge-clarify@0.2`), called 3 times per trace; `NOT APPLICABLE` on unambiguous cases | At least 3 of the 4 ambiguous cases `all pass`, and at least 1 case improved over `v1` with none worse |

## 3. Cases and capture contract


Rather than generating generic prompts, the team builds a 12-case comparison set from two **input dimensions** (*amount structure*: single amount, subtotal + tip/tax, split bill, missing amount; *account cue*: named, omitted, conflicting) and one **case-condition dimension** set by fixtures (*ledger permission*: writable personal ledger vs. read-only shared ledger):

- **4 baseline cases (`B1`–`B4`):** single stated amount, writable ledger.
- **4 multi-number unambiguous cases (`M1`–`M4`):** e.g., *"Lunch \(42 plus \)8 tip on Visa, total $50"* and *"Taxi 38 EUR, receipt shows 32 + 6 airport fee"*, held out from the examples used while writing `v2`.
- **4 boundary and permission cases (`A1`–`A4`):** ambiguous split (*"Dinner $90 with Sam, put my half"* when split rules aren't set), two matching cards, missing amount, and a write request against a read-only shared ledger (`A4`).

**Capture contract & recorded trace excerpt (`M3`, repeat 1 on `v1`):**

```json
{
  "execution_id": "run_v1_r1_M3",
  "case_id": "M3_lunch_subtotal_plus_tip",
  "sut_manifest": { "prompt": "expense-draft@v1", "model": "claude-sonnet-4-5-20250929", "exec": "1.4.0" },
  "fixture_id": "fx_personal_writable_visa",
  "input": "Client lunch $42 plus $8 tip on Corp Visa, total $50",
  "draft_output": { "amount_minor": 4200, "currency": "USD", "account": "corp_visa", "status": "draft_ready" },
  "tool_calls": [{ "tool": "propose_draft", "args": { "amount_minor": 4200 }, "status": "ok" }],
  "ledger_writes": [],
  "latency_ms": 1480,
  "cost_usd": 0.006
}
```


A trace missing `tool_calls` or `ledger_writes` makes `C1` `NOT JUDGEABLE`, never `PASS`. On `M3` above, `C1` passes (no unconfirmed write), while `C2`'s deterministic check compares `draft_output.amount_minor` (`4200`) against `reference_amount_minor` (`5000`) and records `FAIL`.

## 4. Evaluator check and experiment design


Before comparing `v1` and `v2`, the team checks its instruments (*Trust the measure* in [Pre-committed experiments]({{< ref "ai-engineering/evaluation/framework-v2/experiments-and-findings" >}}#pre-committed-experiments)):

1. **4-part narrow LLM judge prompt (`judge-clarify@0.2`):**

```text
Task: Decide whether the assistant properly handled an ambiguous expense request without guessing.
Context provided: user_message, workspace_accounts, assistant_reply, draft_output.

Pass (ABSENT): Assistant asks a specific clarifying question naming the unresolved amount or account, AND draft_output.amount_minor is null.
Fail (PRESENT): Assistant populates a guessed amount/account in draft_output, ignores the ambiguity, or asks a vague generic question ("Can you clarify?").
Not Judgeable: assistant_reply or draft_output is missing from the trace record.

Examples:
- [Pass] Input: "Dinner $90 with Sam, put my half" (no split rule on file) -> Reply: "Should I log $45.00, or did you split $90 unevenly?" | draft_output.amount_minor: null. (Critique: names the exact assumption and leaves amount unset.)
- [Fail] Input: "Coffee $6 on my Visa" (user has Personal Visa and Corp Visa) -> Reply: "Drafted $6.00 on Corp Visa—confirm to save?" | draft_output.amount_minor: 600. (Critique: guessed between two matching cards instead of asking.)

Return JSON: {"reasoning": "<1-2 sentences citing trace fields>", "verdict": "Pass" | "Fail" | "Not Judgeable"}
```


2. **Independent validation of `judge-clarify@0.2`:** the product owner labels 16 historical and planted-fault traces blind to judge outputs—11 acceptable clarifications and 5 clear failures (silent guesses). `judge-clarify@0.2` catches all 5 failures (\(\text{TNR} = 5/5\)) and passes 10 of 11 acceptable traces (\(\text{TPR} = 10/11\)), with all 3 judge calls agreeing on 15 of 16 traces and 1 terse trace marked `disagreed`.
3. **Pre-committed experiment & finding rule:** run `v1` and `v2` (differing *only* in the prompt's line-item extraction instruction) back-to-back across all 12 held-out cases × 3 repeats (72 executions). *Supported* iff: (a) `C1` has 0 `FAIL` and 0 `NOT JUDGEABLE` cases, (b) `C2` is `all pass` on all 8 unambiguous cases (`B1`–`B4`, `M1`–`M4`) with \(\ge 1\) case improved over `v1` and 0 worse, (c) `C3` is `all pass` on \(\ge 3\) of `A1`–`A4` with 0 worse, and (d) p95 latency stays \(\le 3.0\text{ s}\) and median cost \(\le \$0.01\text{/case}\).

## 5. Executions, case summaries, and finding


All 72 executions complete and satisfy the capture contract. Summarizing each case across its 3 repeats first ([Repeat and spread]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#repeat-and-spread)) gives:

| Slice (cases) | Criterion | `v1` case summaries (3 repeats/case) | `v2` case summaries (3 repeats/case) | Case-by-case comparison |
| --- | --- | --- | --- | --- |
| All 12 cases | `C1` No unconfirmed save | 12 `all pass` | 12 `all pass` | No violation; `A4` blocked at `exec@1.4` gate in every repeat |
| `B1`–`B4` (4 baseline) | `C2` Stated total | 4 `all pass` | 4 `all pass` | Unchanged |
| `M1`–`M4` (4 multi-amount) | `C2` Stated total | 1 `all pass`, 1 `mixed` (2 pass, 1 fail), 2 `all fail` (recorded pre-tip subtotal) | 4 `all pass` | 3 cases improved (`M2` from `mixed` to `all pass`; `M3`, `M4` from `all fail` to `all pass`), 0 worse |
| `A1`–`A4` (4 ambiguous / read-only) | `C3` Clarification | 2 `all pass`, 1 `mixed`, 1 `all fail` | 3 `all pass`, 1 `incomplete` (`A2` had 2 `PASS` repeats and 1 `disagreed` judge label) | 1 case improved (`A3` from `all fail` to `all pass`), 0 worse; `A2` held apart until reviewed |
| All 12 cases (36 runs/arm) | Latency & cost budget | p95 `1.9s`, median `$0.006` | p95 `2.1s`, median `$0.007` | Within `<= 3.0s` and `<= $0.01` ceiling |

Because `A2` has one `disagreed` judge label in repeat 3 (`judge-clarify@0.2` returned 2 `PASS`, 1 `FAIL` on a terse two-card prompt), `A2` is **incomplete**, not `mixed` and not `NOT JUDGEABLE` ([Raw results, labels, and disagreement]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}}#raw-results-labels-and-disagreement)). Even with `A2` counted apart, `A1`, `A3`, and `A4` are `all pass` (3 of 4), so condition (c) does not depend on `A2`. Leaving out any single repeat leaves Conditions (a) and (b) unchanged; leaving out `A3` would drop `C3` to 2 `all pass` and make the answer `Inconclusive`.

**Finding (`Supported`):** Across 12 designed cases run 3 times per arm against `exec@1.4`, every condition of the finding rule is met: `C1` passed all 12 cases, `C2` moved from 5 of 8 `all pass` (`v1`) to 8 of 8 `all pass` (`v2`) by fixing subtotal-vs.-total extraction on `M2`–`M4`, and `C3` reached 3 of 4 `all pass` with 1 `incomplete` case (`A2`) awaiting human adjudication. *Scope and assumption:* the evidence covers these 12 English text cases under `exec@1.4`; it supports the 25-employee pilot commitment only under the stated assumption that employees' multi-number messages follow the same subtotal/tip/fee structures, and it establishes nothing about receipt photos, foreign-currency conversion, or live adoption. `C1`'s "every time" guarantee rests on `exec@1.4`'s gate code and absence of a second write path, not on the 12-case sample.

## 6. Decision and feedback routes


The product owner accepts `v2` + `exec@1.4` for the 25-employee internal pilot (the **decision**), and routes follow-up work across the [three feedback routes]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}}#three-feedback-routes):

- **Product improvement:** ship `v2` to the 25-user pilot behind the `exec@1.4` confirmation gate; keep multi-currency conversion unsupported.
- **Evaluation knowledge:** adjudicate `A2`'s `disagreed` trace with the product owner, tighten `judge-clarify` around two-card ambiguity with `A2` added to the tuning set (not the validation set), and promote `M3` and `M4` into the regression set.
- **Evaluation infrastructure:** extend pilot trace capture to log post-draft user edits before confirmation, so [production learning]({{< ref "ai-engineering/evaluation/framework-v2/subsystem-and-production" >}}) can detect silent amount errors that passed `C2`'s offline cases.
