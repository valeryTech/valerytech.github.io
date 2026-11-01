---
draft: false
toc: true
title: "Cases, Fixtures, and Coverage"
description: "Design executable evaluation cases, state fixtures, pinned-prefix multi-turn tests, tuple-driven synthetic inputs, and purpose-built datasets tied to product commitments and failure risk."
linkTitle: "Cases and Coverage"
---

A dataset is never "good" or "representative" in general—it only supports conclusions about the specific claims, situations, and operating conditions it exercises. ([Bean et al. 2025](#bean-2025)) Do not start by scraping or prompting an LLM for 200 generic user messages; start from the decision, the [claims and hard gates]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}}), and the capability demands your workflow faces.

## Define what the evidence must cover


Before writing a single case, write down the decision, the behavior claim, and its required level:

```text
Decision:        Expand refund assistant rollout from 5 pilot agents to all 80 support agents?
Behavior claim:  For supported refund requests, preserve stated customer constraints, read only
                 permitted account records, and never issue a refund before explicit confirmation.
Required level:  Every time for permitted account access and confirmation (enforced in tool code);
                 at least 95% of cases (lower interval bound) for preserving stated constraints,
                 set by the commitment owner before running the comparison set.
```


Derive **coverage requirements** from four sources: (1) main jobs to be done and supported vs. unsupported scope, (2) product rules and high-consequence failure hypotheses, (3) architecture boundaries (routes, tools, permissions, empty/conflicting retrieved records), and (4) the evaluation demands of your product's [LLM capability type]({{< ref "ai/heuristics/llm-capabilities" >}}#evaluation-focus-codes)—such as grounding against supplied records (`GR`), state before/after tool writes (`ST`), permission and confirmation boundaries (`TB`), adaptive follow-ups (`AP`), noisy speech/photo inputs (`MM`), or run-to-run variability (`RV`).

## Keep cases and production samples separate


Designed test cases and live production samples answer completely different questions—mixing them produces misleading metrics:

| Object | What it specifies | What its results establish (and cannot establish) |
| --- | --- | --- |
| **Evaluation case** | A chosen input or interaction paired with explicit state fixtures and execution conditions | Exposes boundaries, compares candidates apples-to-apples, and guards regressions; **never** estimates live production failure frequency because hard and rare cases are intentionally over-represented |
| **Production sample** | A selection rule over a defined live user population, time window, and inclusion filter | Estimates real behavior in that population when sampled representatively (random or stratified), or surfaces live failures when sampled by risk/events; **misses** rare catastrophic boundaries absent from the window |

A production trace can always be promoted into a controlled offline case, keeping the original live trace as historical evidence of what happened and the extracted case + fixture as a repeatable check.

## Define the parts of an evaluation case


A user message alone is almost never an executable evaluation case. If an assistant must refuse writes on a read-only ledger or disambiguate two active orders, that condition lives in the **fixture**, not inside fake hints stuffed into the user's phrasing:

```yaml
case_id: refund-readonly-earlier-turn-confirm
source: production-incident-2026-03-14   # real | manual | synthetic | regression
purpose: verify read-only role blocks refund even after user says "yes, confirm"
input:
  prefix_turns: [...]                    # pinned 2-turn conversation history
  user_message: "Yes, refund the $48 charge to my Visa."
fixture:
  agent_role: support_readonly
  account_orders: [ord_881, ord_882]     # two $48 charges on the same day
expected_condition:                      # verifies the fixture actually set up the trap
  matching_orders_count: 2
  write_permission: false
applicable_claims: [C1_no_unauthorized_refund, C3_disambiguate_multiple_matches]
```


Keep **setup verification** (`expected_condition`: did the fixture actually create zero search hits or two matching orders?) separate from **behavioral criteria** (did the assistant handle that situation properly without prescribing one exact wording?). Run the full configured product rather than a bare model call unless your question is specifically about that single prompt step; if any tool or external service is mocked, record that limit in the finding.

### Testing multi-turn and stateful workflows


Multi-turn agents fail when teams try to simulate every conversation end to end with an LLM user simulator on Day 1—the simulator drifts off-script, invents impossible user replies, and confounds product spread with simulator noise. Use two patterns in order:

1. **Pinned-prefix (turn-slice) cases first.** Freeze a real conversation transcript and database state up to turn \(t - 1\), run the candidate system on turn \(t\), and check its tool calls, state transition, and reply. When debugging a turn-4 policy error, also test the turn-4 question standalone in turn 1 to separate retrieval/knowledge failures from conversation-memory failures. ([Husain and Shankar 2025d](#husain-shankar-2025d))
2. **Adaptive participants for trajectory stress tests.** Use a rule-driven or LLM-simulated user only when later turns genuinely depend on which clarifying question or branch the product chooses—and enforce strict **information isolation** so the simulated user sees only participant-visible messages, never internal database records or evaluator rubrics ([Evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}})).

## Use dimensions only when they help


A **dimension** is one axis of variation expected to trigger different failure behavior. Keep two kinds strictly apart:

- **Input dimensions** describe properties visible in the user's request itself—*intent/feature* (track order, return, cancel), *persona/register* (first-time buyer, enterprise admin), or *clarity* (complete, ambiguous, contradictory, multi-intent).
- **Case-condition dimensions** describe hidden system state set up by fixtures—*permission level*, *record match count* (0, 1, many), *tool timeout/error*, or *conflicting policy docs*.

Start with roughly three dimensions grounded in observed bugs, domain risks, or architecture branches—not arbitrary demographic permutations. Do not generate the full Cartesian grid blindly; include multi-dimension interactions only where combining values plausibly exposes a distinct failure path. ([Montgomery 2017](#montgomery-2017)) A **tuple** selects one value per relevant dimension (omitting dimensions irrelevant to that scenario) as a blueprint before writing or generating concrete cases.

## Choose case sources deliberately


| Source | Best for | Blind spots to watch |
| --- | --- | --- |
| **Real production inputs** | Natural user phrasing, typos, shorthand, implicit context, and real edge conditions | Skewed toward common low-risk paths; sparse on new features; requires PII/access controls |
| **Hand-written cases** | Exact boundary rules, adversarial traps, planted faults, and clean controlled comparisons | Authors unconsciously mirror their own prompt vocabulary and miss messy user mental models |
| **Tuple-driven synthetic cases** | Filling specific gaps in your coverage map before live traffic exists | Generic or repetitive if prompted naively; cannot estimate live frequency; unreliable where the generator lacks domain realism |

Synthetic inputs mislead whenever no human can verify their realism—especially complex domain artifacts (clinical notes, legal filings), low-resource dialects, high-stakes safety scenarios, or underrepresented user groups where the generator reproduces its own priors. ([Husain and Shankar 2025a](#husain-shankar-2025a); [Husain and Shankar 2025c](#husain-shankar-2025c)) Also skip synthetic data when a bug is a plain prompt omission (e.g., the system prompt never mentioned dietary restrictions—fix the prompt first).

### Generating missing cases from reviewed tuples


Asking an LLM *"give me 50 test queries"* produces polite, repetitive paraphrases. Separate **tuple design** from **message generation** ([Shankar and Husain 2026](#shankar-2026)):

1. **Classify real inputs first** against your dimensions into *observed tuples* to see which cells real logs already cover.
2. **Hand-write 10–20 seed tuples** targeting uncovered jobs, guarantees, and failure hypotheses, then optionally expand tuples with an LLM (or filter a cross-product when most combinations are valid) and **human-approve** the target tuples before generating any prose.
3. **Generate realistic user inputs** from each approved tuple + fixture context—instructing the model to output *only* the user's messy request (shorthand, omissions, typos), **never** the ideal assistant response, and without leaking test-case jargon into the message. Pair each reviewed input with its executable fixture.

## Build sets for a stated purpose


Never silently reuse one "eval dataset" for every question—the same pass rate means completely different things depending on how the set was built ([Test data]({{< ref "ai-engineering/concepts/evaluation/test-data" >}})):

| Set or sample | Purpose | Typical size & maintenance rule |
| --- | --- | --- |
| **Exploratory / discovery set** | Surface failure modes, test boundaries, and build a failure taxonomy | Start with **10–20 purposeful cases** for a first pass; Literature default is **~100 diverse traces** when coding a taxonomy from scratch until new traces stop changing categories (_theoretical saturation_, [Morse 1995](#morse-1995)) |
| **Comparison set** | Compare candidate prompts, models, or architectures head-to-head | **Held out** from the examples used to write the prompt or fix; keep fixtures and criteria identical across arms |
| **Regression (golden) set** | Verify in CI that core workflows and fixed bugs stay unbroken | Start at **20–50 curated cases**, growing toward **100–200** only for behaviors worth protecting ([Shankar and Husain 2026](#shankar-2026)) |
| **Commitment / release set** | Check the bounded scope and conditions of a proposed [production commitment]({{< ref "ai/product/operating-model/production-commitment" >}}) | Sized to the commitment's loss if wrong and chance of going unnoticed ([Commitments and claims]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}})) |
| **Challenge set** | Stress-test adversarial, rare, or asymmetric high-severity traps | Kept separate from baseline rates so deliberate edge traps aren't misread as live traffic quality |
| **Production sample** | Estimate live behavior or hunt novel failures in real traffic | Random/stratified for population rates; feedback-, outlier-, or cluster-triggered for failure discovery ([Husain and Shankar 2025b](#husain-shankar-2025b)) |

## Decide where the set needs more coverage


Balance does **not** mean equal case counts per feature or persona. Allocate cases by **consequence of failure**, **uncertainty about current behavior**, **meaningful architectural branches**, and **commitment risk**: give straightforward happy paths just enough baseline cases to catch broken wiring, and concentrate the remaining budget on high-harm boundaries, ambiguous inputs, tool failures, and known regressions.

## Review the set before execution


Before running a dataset, audit both individual cases and dataset hygiene:

- **Case validity:** Does each case link to a named claim or risk, set up its situation in the fixture rather than hidden wording, and expose observable behavior that a near-duplicate case wouldn't?
- **No prompt leakage:** Verify—ideally with an automated CI diff on every commit—that no input or reference from your **comparison**, **regression**, or **evaluator validation** sets appears as a few-shot example inside the SUT's prompts or an LLM judge's prompt. ([Shankar and Husain 2026](#shankar-2026))
- **Explicit blind spots:** Record which supported situations, modalities, or user segments the set still omits so they appear directly in the finding's scope limits.

## Execute, inspect, and revise


Version every case set, fixture pack, and sampling rule alongside the runs that used them. Datasets decay as users and features shift: add newly discovered production failures to regression and comparison sets, retire checks that exercise dead code paths or pass 100% of the time without guarding a hard risk (dropping expensive LLM judges first), and never compare raw pass rates across two different dataset versions as if the denominator stayed fixed. ([Husain and Shankar 2026](#husain-shankar-2026))

| Role | Owns in case and coverage design |
| --- | --- |
| **PM / Domain owner** | Defining supported vs. unsupported scenarios, ranking failure severity, approving target tuples for domain realism, and reviewing remaining coverage gaps before a release decision |
| **AI engineer** | Building deterministic fixtures and `expected_condition` assertions, isolating pinned-prefix turns, automating prompt-leakage checks in CI, and versioning datasets and sample queries |

## References


- Bean, A. M. et al. (2025). [Measuring what Matters: Construct Validity in Large Language Model Benchmarks](/sources/015e29150096f262478300d13488bbc2.bin). NeurIPS 2025 Datasets and Benchmarks Track. ^bean-2025
- Husain, H. and Shankar, S. (2025a). [Q: What is the best approach for generating synthetic data?](https://hamel.dev/blog/posts/evals-faq/what-is-the-best-approach-for-generating-synthetic-data.html). Local copy. ^husain-shankar-2025a
- Husain, H. and Shankar, S. (2025b). [Q: How can I efficiently sample production traces for review?](https://hamel.dev/blog/posts/evals-faq/how-can-i-efficiently-sample-production-traces-for-review.html). Local copy. ^husain-shankar-2025b
- Husain, H. and Shankar, S. (2025c). [Q: Are there scenarios where synthetic data may not be reliable?](https://hamel.dev/blog/posts/evals-faq/are-there-scenarios-where-synthetic-data-may-not-be-reliable.html). Local copy. ^husain-shankar-2025c
- Husain, H. and Shankar, S. (2025d). [Q: How do I debug multi-turn conversation traces?](https://hamel.dev/blog/posts/evals-faq/how-do-i-debug-multi-turn-conversation-traces.html). Local copy. ^husain-shankar-2025d
- Husain, H. and Shankar, S. (2026). [Q: What should I do when my "gold" eval dataset becomes stale?](https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-my-gold-eval-dataset-becomes-stale.html). Local copy. ^husain-shankar-2026
- Montgomery, D. C. (2017). Design and Analysis of Experiments (9th ed.). Wiley. ^montgomery-2017
- Morse, J. M. (1995). [The Significance of Saturation](https://doi.org/10.1177/104973239500500201). Qualitative Health Research 5(2), 147-149. doi:10.1177/104973239500500201. ^morse-1995
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 3 and 9. O'Reilly. ^shankar-2026
