---
draft: false
toc: true
title: "Criteria, Evaluators, and Calibration"
description: "Write narrow behavioral criteria, check judgeability before scoring, choose between code checks, references, LLM judges, and human review, align annotators with Cohen's kappa, and calibrate automated judges with TPR and TNR."
linkTitle: "Evaluators and Calibration"
---

Calling an execution right or wrong requires three things before any score is computed: **an explicit basis for judgment**, **a narrow criterion**, and **trace records sufficient to apply that criterion**.

## Start with a basis for judgment


Exploratory trace reading can record raw observations and open questions before expectations settle. Once you assign a verdict (`PASS` / `FAIL` or `PRESENT` / `ABSENT`), name the **evaluation basis**: a provisional discovery claim, a proposed or active [production commitment]({{< ref "ai/product/operating-model/production-commitment" >}}), a product rule/invariant, a safety or policy requirement, a case-specific expectation, or domain judgment made explicit for the review. When the basis is a behavior claim or commitment that results are meant to support or contradict, set its **required level** beforehand and state whether each product rule is a hard property in code or a measured claim ([Commitments and claims]({{< ref "ai-engineering/evaluation/framework-v2/commitments-and-claims" >}}); [the shared definitions]({{< ref "ai-engineering/shared-definitions" >}})).

A **criterion** translates one slice of that basis into an executable decision rule: which unit it judges (trace, turn, item, or tool call), when it applies, which trace records are required, and what separates acceptable from unacceptable behavior. Most real AI tasks allow several valid phrasings or action sequences—write criteria that test the behavioral invariant (`"trace shows participant-visible confirmation before submit_write is called"`) rather than penalizing valid surface variation, and never bundle correctness, grounding, safety, and latency into one opaque 1-to-5 quality score. ([Guerdan et al. 2024](#guerdan-2024); [Reiter 2025](#reiter-2025))

## Check whether a judgment is possible before judging correctness


Every evaluator must answer two gate questions before returning a behavioral verdict:

```text
1. Does the criterion apply to this unit?
   └── no  → NOT APPLICABLE
   └── yes → 2. Do the captured trace records support a judgment?
                └── no  → NOT JUDGEABLE
                └── yes → Did behavior meet the criterion? → PASS / FAIL (or ABSENT / PRESENT)
```


- **`NOT JUDGEABLE` is never a pass:** a missing log line is missing whether or not the product behaved safely, so counting it as `PASS` fabricates support ([Evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#evidence)).
- **Operational failure modes** invert the polarity explicitly: `FAIL` maps to failure `PRESENT` and `PASS` maps to failure `ABSENT`.
- **Unreadable SUT outputs are `FAIL`, not `NOT JUDGEABLE`:** if the product returned malformed JSON or truncated text that breaks schema parsing, the trace *captured* the output and the SUT caused the fault—mark every verdict criterion that needed to read that output `FAIL`, while leaving descriptive categories or numbers `NOT JUDGEABLE` because they have no fail state. Reserve `NOT JUDGEABLE` for missing capture records.

## Judgment methods


Pick the simplest evaluator that reaches the reliability your decision needs, combining methods on the same trace rather than forcing LLM judges onto mechanical checks ([Raschka 2025](#raschka-2025); [Shankar and Husain 2026](#shankar-2026)):

| Method | Best used when | Main blind spot |
| --- | --- | --- |
| **Deterministic code check** | The rule is objective: JSON/SQL syntax, schema fields, allowed tools/permissions, confirmation order, state diffs, idempotency, latency, or token cost | Checks only the letter of its rule—valid JSON or HTTP `200` does not mean the answer is helpful or matches user intent |
| **Reference-based check** | Expected values are known in advance: exact extracted fields, verified record IDs, or SQL AST / result equivalence against a golden query | Penalizes valid alternative answers when a task is open-ended; requires curated ground-truth labels |
| **Model-based evaluator (LLM judge)** | A narrow semantic or contextual rule—faithfulness to retrieved chunks, tone for a persona, non-leading questions—must scale across many traces | Sensitive to prompt phrasing, context bloat, model upgrades, and three systematic biases: **position bias** (~26% in GPT-4 pairwise tests), **verbosity bias**, and **self-enhancement bias** ([Zheng et al. 2023](#zheng-2023)) |
| **Human & domain review** | Criteria are new or shifting, domain nuance is required, automated judges disagree, or an undetected error would be costly and hard to undo | Inconsistent without a written rubric, independent labeling, and drift checks; blind to effects outside the trace ([He et al. 2026](#he-2026)) |

Both deterministic checks and LLM judges can be **reference-free** (checking rules against the input/trace alone, scaling to live monitoring) or **reference-based** (comparing against a golden output in CI). Pairing both on critical tasks—e.g., checking SQL AST equivalence against a reference query *and* checking reference-free that user-stated price filters appear in `WHERE`—gives stronger signal than either alone. ([Shankar and Husain 2026](#shankar-2026))

### Writing a narrow LLM judge prompt


Never build one "overall conversation quality" judge—its `FAIL`s tell engineers nothing actionable and rarely align with experts. Build **one binary LLM judge per operational failure mode** using four components ([Shankar and Husain 2026](#shankar-2026); [Husain and Shankar 2026b](#husain-shankar-2026b)):

1. **One narrow task & context slice:** pass only the trace fields required for this rule (ablate full-trace noise that distracts the judge; [Husain and Shankar 2026a](#husain-shankar-2026a))—and **never** instruct the judge to excuse mistakes invited by the SUT's own system prompt, or it will miss prompt bugs.
2. **Explicit `Pass` (`ABSENT`) and `Fail` (`PRESENT`) definitions** plus an abstention option when required trace records are missing.
3. **Clear `Pass` and `Fail` few-shot examples** with expert critique notes explaining *why* each crosses the boundary—omitting examples is the single most common cause of poor alignment, and expert critiques lifted agreement by 15–20% in practice. ([Husain 2025](#husain-2025))
4. **Structured JSON output** putting a 1–2 sentence `reasoning` *before* the binary `verdict`.

## Evaluator scales and sub-trace units


Version every evaluator alongside its criterion, model/code commit, prompt, temperature, and scale.

### Results that are not verdicts


Not every evaluator returns `PASS`/`FAIL`. Descriptive evaluators return a **closed category** (e.g., how an assistant opens its reply) or a **number in a stated unit** (e.g., count of clarifying questions asked, p95 latency in ms). Categories and numbers describe behavior with no pass mark until an evaluation basis sets a rule over them; `NOT JUDGEABLE` and `NOT APPLICABLE` replace the value on every scale (never substitute `0` for an unjudged count). Summarize categories across repeats by whether all repeats matched, and numbers by individual values plus their median—never average unordered categories or mix scales into a composite score.

### Items within a trace


When an evaluator judges individual **items** inside one output—such as each audit question asked or each proposed line-item edit—record both the item's output index and **which input records it refers to**. Across repeats or candidate versions, **pair items by the input records they are about, never by list position** (question #3 in repeat 1 is often question #4 in repeat 2). Distinguish an item *absent* from one repeat's valid output from an item *missing* because the output could not be parsed. Because all items in one response come from a single correlated execution, keep the **case** as the unit of measurement rather than reporting item-level pass rates as if 40 items across 3 cases were 40 independent cases.

## Raw results, labels, and disagreement


Keep **raw evaluator outputs** separate from **labels** so disagreements stay inspectable and criteria updates can relabel old traces:

```text
Label record:  execution_id | unit_id | criterion@ver | evaluator@ver | result | cited_spans
Provenance:    reference (human/domain) | evaluator-produced
Status:        raw | disagreed | reviewed | adjudicated
Acceptance:    reviewer, acceptance rule, purpose (e.g. measurement vs. judge validation), date
```


When an LLM judge runs 3–5 times on the *same* trace and its calls split (e.g., 2 `PASS`, 1 `FAIL`), record the label status as **`disagreed`** and count it apart in every summary until human review adjudicates it. **Do not record judge self-contradiction as `NOT JUDGEABLE`**: the trace records may be completely sufficient, and what is unsettled is the judge or rubric ([Phased]({{< ref "projects/phased" >}}) initially overloaded `NOT JUDGEABLE` here, hiding rubric ambiguity inside capture status). An **adjudicated** label is accepted for a stated purpose under a stated rule—a label accepted for quick sprint tracking is not automatically accepted as a gold validation reference ([the shared definitions]({{< ref "ai-engineering/shared-definitions" >}})).

### Human rubrics, Cohen's kappa, and alignment sessions


Automated judges cannot beat the consistency of the humans they are calibrated against. In small teams, appoint **one principal domain expert** (*benevolent dictator*—a clinician, auditor, lawyer, or support lead, not the engineer who wrote the prompt) to own failure definitions and label reference traces. ([Shankar and Husain 2026](#shankar-2026)) When multiple stakeholders must label, have 2+ annotators label 20–50 borderline-rich traces **independently without prior discussion** (and without using the same LLM helper), then compute **Cohen's kappa** per criterion to strip out chance agreement ([Cohen 1960](#cohen-1960); [Landis and Koch 1977](#landis-1977)):

\[\kappa = \frac{P_o - P_e}{1 - P_e}\]

Raw percent agreement misleads whenever passes dominate (two annotators rubber-stamping 90% `Pass` agree 82% by chance alone; [Shankar and Husain 2026](#shankar-2026)). Target \(\kappa \approx 0.5\) for exploratory category refinement, **\(\kappa \ge 0.6\)** before calibrating an LLM judge, and **\(\kappa \ge 0.7\)** for high-stakes or regulatory reporting (use Fleiss's \(\kappa\) for 3+ fixed raters or Krippendorff's \(\alpha\) for sparse raters). Run 5-minute-per-case **alignment sessions** focused on tightening vague rubric clauses, adding boundary examples, or splitting overloaded criteria—never arguing over past scores—and periodically re-score a 10–15 trace **anchor set** to catch annotator **criteria drift**. ([Shankar et al. 2024](#shankar-2024); [Shankar and Husain 2026](#shankar-2026))

## Validate evaluators


Never trust an LLM judge on raw percent agreement or on planted faults alone. At a 5% failure rate, a broken judge that always outputs `Pass` achieves 95% raw agreement with human experts while catching **0%** of failures. ([Husain 2024](#husain-2024)) And a validation set holding only planted failures (a trap caught in [Phased]({{< ref "projects/phased" >}})) proves the judge can spot obvious bugs while saying nothing about false alarms on clean outputs ([Evidence model]({{< ref "ai-engineering/evaluation/framework-v2/evidence-model" >}}#evidence)). Validate every automated evaluator in four steps:

1. **Planted-fault smoke test (Day 1 cheap filter):** inject 3–5 realistic faults into clean outputs to verify a new evaluator can trigger `FAIL` at all before spending expert labeling hours.
2. **Three disjoint expert-labeled sets:** split human-labeled traces with zero overlap into (a) **prompt examples** (2–6 clear `Pass`/`Fail` critiques), (b) a **tuning set** (ideally 30–50 `Pass` and 30–50 `Fail` traces for iterative prompt edits), and (c) a held-out **validation set** (30–50 `Pass` and 30–50 `Fail` traces run once to report honest error rates). Ensure expert labels are **independent** of the judge—reviewers must never see the judge's output while labeling, and state which shared error sources were removed. ([Shankar and Husain 2026](#shankar-2026))
3. **Report TPR, TNR, self-consistency, and construct faithfulness:** counting `Pass` (`ABSENT`) as positive, measure **True Positive Rate (\(\text{TPR}\))**—share of expert `Pass`es the judge passes—and **True Negative Rate (\(\text{TNR}\))**—share of expert `Fail`s the judge catches—separately (never use symmetric \(\kappa\) against gold truth). Run the judge 3–5 times per validation trace so `disagreed` instability isn't mistaken for product `spread` later ([Experiments and findings]({{< ref "ai-engineering/evaluation/framework-v2/experiments-and-findings" >}})), and verify the judge's cited evidence matches the theoretical construct rather than a spurious surface correlate. ([Pita 2026](#pita-2026))
4. **Correct biased pass-rate estimates on unlabeled traffic:** when estimating prevalence \(p_{\text{obs}}\) across unlabeled production traces with an imperfect judge, apply Rogan and Gladen's correction with bootstrap confidence intervals over the validation set ([Rogan and Gladen 1978](#rogan-1978); [Shankar and Husain 2026](#shankar-2026)):

\[\hat{\theta} = \frac{p_{\text{obs}} + \text{TNR} - 1}{\text{TPR} + \text{TNR} - 1}\]

Size required \(\text{TPR}\)/\(\text{TNR}\) to the commitment's loss if wrong and chance of going unnoticed (often \(>90\%\) for CI gates; [Shankar and Husain 2026](#shankar-2026)); if an evaluator falls short, tighten its criterion or **demote its use** from a release blocker to a human-review queue ([the shared definitions]({{< ref "ai-engineering/shared-definitions" >}})). Re-check alignment on fresh labeled traces whenever models, prompts, or live traffic shift.

## Who owns what


| Role | Owns in criteria and evaluator calibration |
| --- | --- |
| **PM / Principal domain expert** | Setting required claim levels, acting as the reference standard (or leading rubric alignment sessions), labeling tuning/validation traces blind to judge outputs, and adjudicating `disagreed` labels |
| **AI engineer** | Writing deterministic checks first, building narrow 4-part LLM judges with clean context slices, preventing leakage across example/tuning/validation sets, measuring \(\text{TPR}\)/\(\text{TNR}\) and repeat stability, and computing Rogan–Gladen intervals |

## References


- Cohen, J. (1960). [A Coefficient of Agreement for Nominal Scales](https://doi.org/10.1177/001316446002000104). Educational and Psychological Measurement 20(1), 37-46. doi:10.1177/001316446002000104. ^cohen-1960
- Guerdan, L. et al. (2024). [A Framework for Evaluating LLMs Under Task Indeterminacy](https://arxiv.org/abs/2411.13760). arXiv:2411.13760. [PDF](/sources/2478056b91cd37d03393aedc5b4b14b3.bin). ^guerdan-2024
- He, C. et al. (2026). [Beyond Human Measure: ASI Should Be Guided by Open-World Alignment](https://doi.org/10.20944/preprints202604.1749.v1). doi:10.20944/preprints202604.1749.v1. [PDF](/sources/ec007122245e7e5a9574334e98c5c4e5.bin). ^he-2026
- Husain, H. (2024). [Using LLM-as-a-Judge For Evaluation: A Complete Guide](https://hamel.dev/blog/posts/llm-judge/index.html). Local copy. ^husain-2024
- Husain, H. (2025). [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/index.html). Local copy. ^husain-2025
- Husain, H. and Shankar, S. (2026a). [Q: How much context should I give a LLM judge?](https://hamel.dev/blog/posts/evals-faq/how-much-of-a-trace-should-i-give-an-llm-judge.html). Local copy. ^husain-shankar-2026a
- Husain, H. and Shankar, S. (2026b). [Q: What should I do when I can't get my LLM judge to agree with human reviewers?](https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-i-cant-get-my-llm-judge-to-agree-with-human-reviewers.html). Local copy. ^husain-shankar-2026b
- Landis, J. R. and Koch, G. G. (1977). [The Measurement of Observer Agreement for Categorical Data](https://doi.org/10.2307/2529310). Biometrics 33(1), 159-174. doi:10.2307/2529310. ^landis-1977
- Pita, M. (2026). [Correct codes for the wrong reasons? Validating LLMs as measurement instruments for theoretical constructs](https://arxiv.org/abs/2606.28574). arXiv:2606.28574. [PDF](/sources/e927379435f1073f97f490f01b8bffcf.bin). ^pita-2026
- Raschka, S. (2025). [Build a Reasoning Model (From Scratch)](/sources/f3150de6e11ff0d18db1eae975db2f98.bin) (MEAP v2). Manning. ^raschka-2025
- Reiter, E. (2025). [Natural Language Generation](https://doi.org/10.1007/978-3-031-68582-8). Springer. doi:10.1007/978-3-031-68582-8. [PDF](/sources/75150fd51c9544e19f3ae64bd809970c.bin). ^reiter-2025
- Rogan, W. J. and Gladen, B. (1978). [Estimating Prevalence from the Results of a Screening Test](https://doi.org/10.1093/oxfordjournals.aje.a112510). American Journal of Epidemiology 107(1), 71-76. doi:10.1093/oxfordjournals.aje.a112510. ^rogan-1978
- Shankar, S. et al. (2024). [Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences](https://arxiv.org/abs/2404.12272). arXiv:2404.12272. ^shankar-2024
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapters 2, 4, and 5. O'Reilly. ^shankar-2026
- Zheng, L. et al. (2023). [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685). arXiv:2306.05685. ^zheng-2023
