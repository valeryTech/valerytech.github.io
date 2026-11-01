---
draft: false
toc: true
title: "Experiments, Comparisons, and Shipping Decisions"
description: "Plan controlled evaluation runs before executing them, summarize cases across repeats, separate evaluator noise from product spread, apply pre-committed finding rules and latency/cost budgets, and route findings into product or evaluation changes."
linkTitle: "Experiments and Findings"
---

Raw run logs cannot tell you afterward why two runs were made, which configuration was the baseline, how many repeats were intended, or which criterion had to improve. Whenever you compare versions—or measure behavior that can vary from run to run—write the **experiment** and its **finding rule** *before* executing the runs.

## Pre-committed experiments


An **experiment** plans a bounded set of executions to answer one question:

```yaml
experiment_id: exp-2026-04-expense-prompt-v2
commitment: 25-employee internal pilot (reversible, human-confirmed drafts)
question: Does prompt v2 fix multi-amount extraction without hurting ambiguity clarification, latency, or cost?
baseline_arm: { prompt: v1, model: claude-sonnet-4.5, exec: 1.4 }
candidate_arms:
  - { prompt: v2, model: claude-sonnet-4.5, exec: 1.4 }   # differs in ONE factor
dataset: comparison-set@1.2 (12 held-out cases)
repeats_per_arm: 3
finding_rule:
  - C1_no_unconfirmed_save: 0 FAIL and 0 NOT JUDGEABLE cases
  - C2_stated_total: all 8 unambiguous cases all_pass, >=1 improved over v1, 0 worse
  - C3_clarify_ambiguous: >=3 of 4 ambiguous cases all_pass, 0 worse than v1
  - non_regression_budget: p95 latency <= 4.0s (+0.5s max over v1), median cost <= $0.015/case
```


Compare arms that differ in **one stated factor** (run close together in time against the same dependencies); if you change both the prompt and the retriever at once, the result cannot credit either one. ([Montgomery 2017](#montgomery-2017)) Run experiments in four ordered stages—skipping an earlier stage only when a wrong answer is cheap or immediately reversible, and stating which stage was skipped in the finding:

| Stage | Question | What it establishes (and cannot establish) |
| --- | --- | --- |
| **1. Look** | What does the product actually do on these cases, and where does it break? | Generates observations, failure categories, and candidate criteria ([Failure understanding]({{< ref "ai-engineering/evaluation/framework-v2/failure-understanding" >}})); proves no claim yet |
| **2. Trust the measure** | How much do results vary with nothing changed, and do our evaluators agree with domain truth? | Establishes case **spread** and evaluator \(\text{TPR}\)/\(\text{TNR}\) + stability ([Evaluators and calibration]({{< ref "ai-engineering/evaluation/framework-v2/evaluators-and-judgment" >}})); says nothing yet about a product fix |
| **3. Make a claim** | Did a candidate change beat the baseline? Which option among several won? | Supports a comparison beyond spread (re-run the winner of a multi-arm sweep on fresh repeats so selection luck doesn't inflate its score) |
| **4. Test how far it holds** | Does the gain survive on held-out slices, new fixtures, or another serving environment? | Tests scope; observing "no difference" supports "no worse" only when cases and repeats had enough power to detect a drop of the stated size |

Every observed difference between two arms has **five rival explanations** beyond your change: (1) chance variation in the SUT (addressed by repeats), (2) error or instability in the evaluator (addressed by \(\text{TPR}\)/\(\text{TNR}\) calibration and `disagreed` tracking), (3) a hidden co-varying factor such as provider drift or time of day (addressed by single-factor back-to-back runs), (4) overfitting to development examples (addressed by held-out comparison sets), and (5) cherry-picking metrics after reading results (addressed by a pre-written finding rule).

## Repeats, spread, and case summaries


Setting `temperature = 0` does **not** guarantee deterministic LLM behavior: batched GPU inference servers reorder floating-point reductions across concurrent requests (in [Phased]({{< ref "projects/phased" >}})'s [`experiment-model.md`](https://github.com/valery-judah/phased/blob/main/docs/evaluation/experiment-model.md), identical weights at `temperature = 0` produced identical bytes on an idle local server and conflicting numbers—`780,000` vs. `7,800,000`—across batched runs). Because you cannot know whether behavior varies until you repeat it, **repeats come before comparisons**.

A **repeat** executes the exact same case against the exact same configuration; the **spread** is how much one case's results vary across its repeats. Three rules govern every multi-run analysis:

1. **The case is the unit—never pool raw runs.** Three repeats of 10 cases are 3 looks at 10 cases, not 30 independent cases. Reporting *"8 of 9 executions passed"* hides whether one case failed all 3 times (`all fail`) or three cases each failed once (`mixed`). Summarize each case across its \(k\) repeats first:
   - **`all pass`** (or all `ABSENT` for a failure mode): passed every repeat—corresponds to \(\text{pass}^k\) reliability where users need consistent success every time (in \(\tau\)-bench retail tasks, GPT-4o dropped from ~61% single-run success to <25% across 8 runs; [Yao et al. 2024](#yao-2024)).
   - **`all fail`** (or all `PRESENT`): failed every repeat (whereas \(\text{pass}@k\)—at least 1 pass in \(k\) tries—fits only workflows like code generation where a deterministic test picks a winning attempt).
   - **`mixed`:** produced both `PASS` and `FAIL` across repeats, regardless of any unjudged repeat.
   - **`incomplete`:** agreed on judged repeats, but at least one repeat is missing, `NOT JUDGEABLE`, or `disagreed`—held apart until settled. (`NOT APPLICABLE` across all repeats is excluded from the denominator.)
2. **Count a case difference only beyond spread.** Moving from `all fail` to `all pass` (or `mixed` to `all pass` across sufficient repeats) shows change; two `mixed` arms trading 1-of-3 and 2-of-3 passes sit inside noise.
3. **Separate product spread from judge noise.** If an LLM judge has a 10% false-fail rate, a 100%-consistent product will look `mixed` on ~27% of 3-repeat cases—settle `disagreed` judge labels and check \(\text{TPR}\)/\(\text{TNR}\) before blaming the SUT.

## Measurements


A **measurement** summarizes case outcomes over a defined dataset or production sample. Never report a bare number like *"92% passed"*—state the dataset/sample and selection rule, system and evaluator versions, the unit counted (cases summarized across \(k\) repeats), the denominator, counts of `incomplete`, `NOT JUDGEABLE`, and `NOT APPLICABLE` cases, and error bars or intervals when estimating a population rate. ([Miller 2024](#miller-2024))

With small sets, report raw counts (`"all pass on 7 of 8 cases"`), never percentages, and read every count against the claim's pre-set **required level** ([Commitments and claims]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}})): under `every time`, one failing case refutes the claim; under `at least a share`, 1–3 cases can expose failures or show feasibility, never establish a high reliability share ([the shared definitions]({{< ref "ai-engineering/shared-definitions" >}})). Always break averages down by high-consequence slices—job, permission state, tool route, ambiguity—chosen from the commitment and failure model rather than dredged post hoc, because a 96% overall average easily hides a 0% pass rate on read-only permission boundaries.

## Comparing candidates and non-regression budgets


Real engineering changes trade quality against speed and cost: adding a chain-of-thought verifier or reranker may lift grounding by 6 points while pushing p95 latency past interactive UX limits and tripling token spend. Pair every candidate comparison with explicit **non-regression budgets**:

- **Compare case by case** under identical fixtures, criteria, and evaluator versions—listing which specific cases improved, which regressed, and which stayed `mixed`.
- **Keep orthogonal criteria separate:** never mash safety, grounding, latency, and cost into a weighted scalar score unless an approved decision rule defines exact exchange rates.
- **Enforce operational ceilings alongside quality:** include p50/p95 latency, token/tool cost per case, and error/timeout rates as first-class conditions in the experiment's finding rule so "smarter but unshippably slow" candidates are caught offline.

## Findings


A **finding** interprets what the measurements and comparisons establish for the evaluation question—more than a metric table, and strictly less than a product decision. State both **the scope of the claim** (what the commitment promises) and **the scope of the evidence** (exact versions, cases/sample, environment, date, and evaluator limits), plus **the explicit assumption connecting them** whenever the claim reaches beyond tested cases ([Evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#finding-and-decision)):

> Across 48 confirmation-required write cases, each run 3 times, candidate B was `all pass` on 47 cases and `all fail` on 1; candidate A was `all pass` on 42, `mixed` on 4, and `all fail` on 2. Candidate B's single failing case occurred when confirmation happened two turns earlier. Because the product owner set the required level to confirmation before *every* supported write (`every time`), that failure contradicts the claim for B and shows that confirmation must be enforced as a hard code check at `submit_write()`. The 48 cases cover known confirmation paths but not live traffic frequencies, and count toward live use only under the assumption that live multi-turn confirmations follow the same state transitions. This supports continuing with B once the `submit_write()` code gate is added and verified, and does not support wider autonomous writes.

### Finding rule


A **finding rule** pre-commits the exact per-criterion conditions (including required levels and the size of worsening that counts for any `"no worse"` clause) before executions are read, yielding one of four answers:

| Answer | Condition |
| --- | --- |
| **Supported** | Every pre-committed condition (quality, safety, and latency/cost budgets) is met. |
| **Contradicted** | At least one condition shows the opposite of what was required. |
| **Inconclusive** | Differences sit inside within-version spread, or the design lacked enough cases/repeats to detect a worsening of the stated margin. |
| **Undetermined** | A required result is missing, `NOT JUDGEABLE`, or `disagreed`. |

A rule written or relaxed after inspecting scores is exploratory—label it so. Before finalizing a finding, run **zero-cost sensitivity checks**: recompute the rule dropping one repeat, dropping one borderline condition, or tightening `mixed` handling; if the answer flips, name the fragile assumption in the finding.

## Decision rules


A **decision rule** connects an evaluation result to an operational or release action—distinct from a finding rule, which answers the experiment's question:

- **Informational:** surfaced in dashboards or PR comments for human judgment.
- **Warning / review trigger:** blocks silent merge or rollout until a named owner inspects traces or signs an exception.
- **Release gate:** automatically blocks CI/CD promotion or canary expansion when a committed criterion or budget fails. ([Shankar and Husain 2026](#shankar-2026))
- **Runtime control (guardrail):** blocks, redirects, or escalates a live request in the serving path. When code at that boundary rejects every invalid action with no bypass path, it enforces a **hard property** directly; when it invokes a probabilistic classifier or judge, it remains a **measured claim** whose false-block rate (`TPR`) and miss rate (`TNR`) must be evaluated on their own ([the shared definitions]({{< ref "ai-engineering/shared-definitions" >}})).

Promote a check to an automated release gate or live guardrail only after its criterion is stable, its \(\text{TPR}\)/\(\text{TNR}\) errors are acceptable for the cost of an undetected failure or false block, and override ownership is explicit.

## Route findings by what must change


A failed evaluation does not mean *"go tune the prompt."* Route every finding by what the evidence actually challenges across Delivery, Discovery, Evaluation Knowledge, and Infrastructure:

| What the finding shows | Primary action |
| --- | --- |
| Committed behavior fails in a clear supported case | **Delivery:** fix prompt, retrieval, tool logic, or add a hard code gate; hold release or narrow exposure |
| Failure exposes an unsafe or overbroad promise | **Commitment:** narrow supported scope, add draft-confirm UX, or pause rollout ([Production commitment]({{< ref "ai/product/operating-model/production-commitment" >}})) |
| Intended behavior works, yet causes an unwanted effect | **Discovery:** reconsider the product intent and candidate solution |
| Behavior passes `U1–U4`, but users cannot finish the job (`U5`) | **Discovery / UX:** redesign interaction, review/edit affordances, or latency |
| Users can finish (`U5`), but stick to old workflows (`U6`) | **Discovery:** revisit value proposition, friction, and real-world alternatives |
| Users adopt (`U6`), yet the target condition (`U7`) stays flat | **Discovery / Strategy:** re-examine the causal hypothesis linking the workflow to the outcome |
| Traces expose a real failure that fits no current category or rubric | **Evaluation knowledge:** split/add a failure category, update the criterion, and relabel affected traces |
| Automated evaluator disagrees with independent expert labels | **Evaluation knowledge:** fix judge context slice, few-shot critiques, or demote gate to human review |
| Key checks return `NOT JUDGEABLE` or lack version manifests | **Evaluation infrastructure:** upgrade trace capture contract, state logging, or SUT version pinning |
| Sample cannot support the desired claim (e.g., challenge set used as live rate) | **Evaluation design:** draw a representative sample or narrow the finding's claim scope |

## Who owns what


| Role | Owns in experiments, findings, and decisions |
| --- | --- |
| **PM / Commitment owner** | Approving pre-committed finding rules and latency/cost/harm budgets, weighing trade-offs across criteria, making the ship/rollback/narrow-scope decision, and reopening discovery when `U5–U7` assumptions fail |
| **AI engineer** | Designing single-factor arms, running multi-repeat executions, computing case-level summaries and intervals, running sensitivity checks, maintaining CI release gates, and fixing delivery or infrastructure gaps |

## References


- Miller, E. (2024). [Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations](https://arxiv.org/abs/2411.00640). arXiv:2411.00640. ^miller-2024
- Montgomery, D. C. (2017). Design and Analysis of Experiments (9th ed.). Wiley. ^montgomery-2017
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 5 and 9. O'Reilly. ^shankar-2026
- Yao, S. et al. (2024). [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045). arXiv:2406.12045. [PDF](/sources/271cbb826296fcfb4c240f8c381566ad.bin). ^yao-2024
