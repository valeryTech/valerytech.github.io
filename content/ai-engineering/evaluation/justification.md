---
draft: false
toc: true
title: "Product-Specific AI Evaluation: Measurement and Validity"
description: "Defines the evidence needed to interpret AI evaluation results: operational criteria, validated evaluators, explicit sampling and aggregation, and decision rules tied to a declared scope."
linkTitle: "Product-Specific Evaluation"
---

An evaluation score supports a product claim only when the measured behavior, judgment method, sample, and interpretation are specified. A value such as `completeness = 0.84` is insufficient on its own: it could represent a fraction of required fields, an average ordinal rating, or an uncalibrated model output. Each interpretation has different implications.

Completeness can be a useful measure when the required content is defined and its omission constitutes a product failure. The methodological problem is treating a named quality dimension as a product measure without establishing that relationship.

This note describes the evidence needed to move from observed behavior to a scoped evaluation finding. Wallet-assistant examples and all numerical results below are illustrative.

## 1. Evaluation objects and scope


The main objects have distinct roles:

| Object | Role |
| --- | --- |
| Product expectation | States the behavior the product is expected to provide within a defined scope. |
| Failure mode | Describes a recurring observed departure from an applicable expectation. |
| Criterion | Defines how a specific aspect of an execution will be judged. |
| Evaluator | Applies a criterion to evidence using code, human review, an LLM, or a combination of methods. |
| Judgment | Records the assessment of one judgment unit, with supporting evidence. |
| Measurement | Aggregates judgments over a declared set or sample. |
| Finding | Interprets the evidence for an evaluation question, with stated limitations. |
| Decision | Uses findings, requirements, and tradeoffs to select an action. |

A typical failure-oriented workflow is:

```text
Production observations or executed cases
    → trace review and error analysis
    → recurring failure modes
    → operational criteria
    → validated evaluators
    → judgments
    → measurements over a declared sample
    → scoped findings
    → product or engineering decisions
```


Criteria can also originate from explicit product requirements, guarantees, or invariants. A requirement such as “no transfer is submitted before confirmation” can be tested before a violation occurs. Error analysis adds evidence about actual failures and helps refine criterion boundaries; it is not a prerequisite for every requirement-based test.

Define the evaluation question and scope before interpreting an aggregate. Relevant scope fields include system version, feature, user cohort, scenario, locale, environment, and time period. These determine which executions belong in the analysis and how far the finding can generalize.

This separation is consistent with the Execution → Judgment → Evaluation model described in [wallet-evals concepts](https://github.com/valery-judah/wallet-evals/blob/main/docs/product/concepts.md).

## 2. Establish the relationship between the metric and product behavior

### Construct validity


Construct validity concerns whether a measure represents the behavior or property of interest. A generic language-quality score does not establish this relationship by itself.

Consider the response:

```text
“Your transfer of $500 is ready. Would you like me to confirm it?”

Completeness = 0.96
```


Suppose trace review has identified this failure mode:

```text
F12: The assistant offers transfer confirmation without making
     the source account unambiguous when multiple accounts are eligible.
```


The response may satisfy a generic completeness rubric while still exhibiting F12. The score and the product failure concern different properties.

An operational criterion makes the intended relationship explicit:

```text
Criterion C12: Source-account identification before confirmation

Judgment unit:
A transfer-confirmation offer and the preceding interaction state.

Applicability:
The user has multiple eligible source accounts and the assistant
has reached the confirmation step.

PASS:
The user-visible interaction unambiguously identifies the source account
associated with the proposed transfer.

FAIL:
Confirmation is offered while that account remains ambiguous.

Required evidence:
Eligible accounts, relevant user selections, conversation context,
user-visible confirmation content, and the proposed transfer's account ID.

NOT APPLICABLE:
The execution is outside the applicability conditions.

NOT JUDGEABLE:
The criterion applies, but required evidence is missing or inconclusive.
```


Account identity and wording are related but distinct. A unique account label may establish what was shown to the user; matching it to the proposed transfer also requires action-state evidence.

A failure rate for C12 now has a defined interpretation. It still needs a denominator, an evaluator with known limitations, and a suitable sample.

### Criterion discovery and revision


Trace review should compare concrete incidents, successful contrasts, and ambiguous cases. For example:

```text
Trace 17: Wrong account selected.
Trace 31: Wrong account selected after an ambiguous reference.
Trace 42: Ambiguity resolved silently.
Trace 58: Confirmation presented for an unintended account.
```


These observations suggest related account-selection and disambiguation problems. Further review determines whether they share a criterion or require separate criteria.

A taxonomy defined entirely before inspection can constrain what reviewers notice. Use initial requirements and categories as provisional guidance, then revise them when evidence exposes missing distinctions, unused categories, or disputed expectations. Reviewers need relevant product and domain knowledge; annotator instructions alone cannot resolve an undefined product expectation.

LLMs can assist with clustering observations, drafting criteria, and locating candidate examples. Human review is still needed to establish whether the resulting categories and boundaries reflect the product's expectations.

See [Failure Understanding]({{< ref "ai-engineering/evaluation/v2/failure-understanding" >}}) for the distinction between observations, failure candidates, failure modes, and evidence gaps.

## 3. Design evaluators around separable criteria

### Judgment granularity


A rubric such as “score correctness, completeness, relevance, conciseness, and professionalism from 1 to 5” combines several concerns. Two executions can receive the same score while having different failure profiles:

| Execution | Correctness | Style | Possible composite score |
| --- | --- | --- | --- |
| A | Incorrect | Strong | 4/5 |
| B | Correct | Weak | 4/5 |

The composite obscures which behavior changed and may allow improvements in one dimension to offset failures in another. Retain separate judgments when criteria protect different outcomes, such as account identification and fee disclosure. Any later aggregation should declare whether compensation is allowed.

Pass/fail is a useful default for a specific behavioral boundary. Numeric measures are appropriate when their semantics are defined: latency, cost, the fraction of required items present, or an ordinal rubric with explicit anchors. Averaging an ordinal rating additionally assumes that differences between adjacent levels are meaningful for the intended analysis.

Keep applicability and evidence sufficiency separate from pass/fail. Excluding `NOT JUDGEABLE` cases without reporting them can make a system appear better as trace coverage deteriorates.

### Method and evidence selection


Choose the simplest method that can apply the criterion reliably enough for its intended use.

| Criterion type | Suitable starting method |
| --- | --- |
| Schema, required fields, allowed values | Deterministic validation |
| Event order, tool arguments, state transitions | Code over structured execution evidence |
| Exact expected result | Comparison with a trusted reference or execution result |
| Context-dependent semantic judgment | Human review or a validated, scoped LLM judge |

Fix obvious product defects when the required change is already clear. A new LLM evaluator is useful when repeated measurement requires semantic judgment; it is not required for every observed defect.

Each evaluator needs enough context to apply its criterion. A final response alone cannot establish event ordering or state correctness. Conversely, passing every available trace field to every judge can add irrelevant context and complicate validation. Define the evidence contract per criterion and retain access to the complete trace for investigation.

A judgment record should identify the execution, criterion version, evaluator version, label, and supporting evidence. LLM judgments should include a short rationale tied to that evidence so reviewers can inspect disagreements.

## 4. Validate automated judgment


A well-defined criterion does not establish that an automated evaluator applies it correctly. Treat an LLM judge as a classifier with a specified input contract, label definition, and validation population.

A validation procedure should:

1. Collect examples covering passes, failures, ambiguous boundaries, and relevant operating conditions.
2. Obtain labels from qualified reviewers using the same criterion and evidence contract.
3. Review disagreements and resolve unclear expectations or annotation instructions.
4. Separate examples used for prompt development and selection from a held-out test set.
5. Evaluate the frozen evaluator on the held-out set and report errors by class and relevant scenario.

A train/development/test split is useful when examples serve distinct development roles. The essential constraint is that the test set remains independent of evaluator tuning. Keep related traces, repeated executions, and close synthetic variants together when splitting to reduce leakage.

Human labels are a reference with their own limitations. Persistent reviewer disagreement can indicate an unclear criterion, insufficient evidence, or a disputed product expectation. It should not be hidden by treating one label as unquestionable ground truth.

### Class imbalance and error rates


Define the positive class explicitly. With **failure as positive**:

| Human reference | Evaluator says FAIL | Evaluator says PASS |
| --- | --- | --- |
| FAIL | True positive (TP) | False negative (FN) |
| PASS | False positive (FP) | True negative (TN) |

```text
Failure recall / sensitivity = TP / (TP + FN)
Specificity                 = TN / (TN + FP)
Failure precision           = TP / (TP + FP)
Accuracy                    = (TP + TN) / total
```


If 2% of examples fail, an evaluator that always returns `PASS` has 98% accuracy and zero failure recall. Overall agreement therefore cannot establish whether the evaluator detects the behavior of interest.

Report class counts as well as rates. Recall estimated from a small number of failures is uncertain even when the point estimate is high. Precision also depends on failure prevalence, so precision measured on a failure-enriched validation set does not directly describe production performance.

The acceptable error profile depends on use. False negatives can hide release regressions; false positives can generate monitoring noise or block acceptable executions. A judge validated for offline analysis needs additional assessment before it is used as a runtime control.

### Judge error and measured prevalence


The fraction of executions labeled `FAIL` is the evaluator's observed failure rate. It is not automatically the true product failure rate.

For an applicable, judgeable population, let:

```text
p = true failure prevalence
s = evaluator sensitivity
f = evaluator false-positive rate
q = observed fraction labeled FAIL
```


Then:

```text
q = s × p + f × (1 − p)
```


For example, if `p = 0.02`, `s = 0.90`, and `f = 0.05`, the observed failure rate is `0.067`: 6.7% instead of 2%. False positives can dominate when the underlying failure is rare.

This relationship assumes sensitivity and false-positive rate apply to the population being measured. They may change across scenarios, system versions, or production conditions. Any correction for judge error must account for that assumption and for uncertainty in the validation estimates.

## 5. Separate coverage from prevalence estimation


Different sampling designs answer different questions.

| Sample | Main use | Interpretation limit |
| --- | --- | --- |
| Random production sample | Estimate behavior in a defined production population; discover unanticipated failures | Rare conditions may have few examples |
| Targeted sample | Investigate known failures, affected cohorts, or uncertain boundaries | Raw failure frequency does not estimate overall prevalence |
| Regression suite | Check previously observed failures and explicit requirements | Results describe the suite rather than traffic frequency |
| Synthetic cases | Exercise deliberate variations, rare situations, and system constraints | Representativeness requires separate evidence |

Retain random production review alongside targeted sampling. Sampling only traces flagged by existing evaluators or user feedback limits discovery to problems those mechanisms already expose.

Synthetic generation should vary specified dimensions such as workflows, account configurations, constraints, and known failure conditions. An unconstrained request for “50 test queries” provides little control over coverage or redundancy. Cases derived from hypothetical risks should be identified as such rather than presented as observed production failures.

Prioritize initial coverage using traffic, failure impact, and uncertainty. Equal case counts across every feature are not a requirement; the coverage rationale and resulting gaps should be explicit.

For aggregate prevalence, report the population, sampling method, applicability rules, and denominators. A stratified or targeted sample needs appropriate weighting to estimate a population rate, and that requires known sampling probabilities or defensible population weights.

Evaluation datasets also change as the product and its failure modes change. Version cases, criteria, and evaluator configurations. When the suite changes, an aggregate-score change may reflect changed coverage as well as changed product behavior. A fixed comparison subset can preserve continuity while an updated suite measures current concerns.

## 6. Aggregate judgments into scoped findings


For criterion C12, a basic sample failure rate is:

```text
C12 failure rate = FAIL / (PASS + FAIL)
```


This denominator contains applicable, judgeable units. Report `NOT APPLICABLE` and `NOT JUDGEABLE` counts separately, including the fraction of applicable units that could not be judged. Otherwise the failure rate describes an undisclosed subset of executions.

A result should retain enough context to interpret the measurement:

```text
Question:
Did version 1.14 regress source-account identification
before transfer confirmation?

Scope:
Consumer users with multiple eligible source accounts;
English-language transfer scenarios; controlled test environment.

Design:
412 applicable, judgeable case executions per version,
using the same cases, criterion, and evaluator configuration.

Observed C12 failures:
Version 1.13:  7 / 412 = 1.7%
Version 1.14: 31 / 412 = 7.5%

Illustrative acceptance rule:
Observed C12 failure rate must be no greater than 3%
on this regression suite.

Finding:
Version 1.14 exceeds the specified acceptance threshold
and has a higher observed failure rate on this suite.

Limits:
These results do not estimate production prevalence.
Repeated executions may be needed to characterize stochastic variation.
Evaluator error and uncertainty remain relevant to interpretation.
```


The threshold is a product decision input; it does not follow from the score itself. If a decision concerns an underlying population rate rather than a fixed suite result, specify how sampling uncertainty and evaluator error enter the rule. A point estimate below a threshold may still leave substantial uncertainty about compliance.

For version comparisons, keep cases and operating conditions comparable. Paired cases can expose which behaviors changed, but repeated runs from the same case are not necessarily independent observations. Counts, case-level changes, and uncertainty matter alongside percentage differences.

Avoid hiding critical failures in a broad average. Where applicable, define independent acceptance conditions for critical criteria and use other measurements to describe tradeoffs. A single aggregate is useful only when its weighting and compensation rules match the intended decision.

## 7. Separate failure detection, diagnosis, and product outcomes


A C12 failure establishes that the observed execution violated the source-account criterion. It does not identify the cause. Possible causes include account-state errors, retrieval, tool responses, selection logic, prompts, model behavior, conversation-state handling, or the UI contract.

Diagnosis uses the complete trace to locate observable divergences and form causal hypotheses. Controlled changes and subsequent evaluation can test those hypotheses. A lower failure rate after a change supports an improvement under the comparison conditions; attribution to a specific component requires a design that isolates its contribution.

Likewise, component success does not establish user success. A tool can return successfully while acting on the wrong account. Evaluation of a transfer workflow may need to inspect intended account selection, confirmation, resulting state, and the user-visible outcome.

Criterion-specific regression results support engineering decisions. Production measures of task completion, recovery, and user outcomes provide additional evidence about product performance. Their definitions and denominators need the same care as offline evaluation measures.

## 8. Evaluation infrastructure and review artifacts


Trace inspection and annotation are prerequisites for understanding what automated scores mean. A dashboard can summarize measurements, but investigation requires access to the executions, criteria, evidence, and disagreements behind them.

When reviewers cannot verify an output, inspect the evidence available to both reviewers and users. Missing provenance, intermediate artifacts, state changes, or confirmation details may indicate an observability or product-design gap. Adding these can improve both evaluation and user verification.

For each decision-relevant metric, retain the following artifacts:

| Artifact | Required content |
| --- | --- |
| Criterion specification | Product expectation or observed failure, applicability, judgment unit, boundary, required evidence, and handling of missing evidence |
| Evaluator specification | Method, input contract, implementation or prompt version, and output schema |
| Validation report | Labeling procedure, data split, class counts, error rates, scenario coverage, and limitations |
| Dataset or sample manifest | Case versions or sampling design, target population, coverage, and exclusions |
| Result record | System version, judgment counts, denominators, aggregation rules, and relevant uncertainty |
| Finding and decision rule | Evaluation question, supported interpretation, acceptance conditions, limitations, and resulting action |

Changes to product behavior, criteria, evidence collection, evaluator models, or traffic can invalidate earlier assumptions. Revisit the affected artifacts and revalidate where the measurement relationship may have changed.

## References


The methodological issues discussed here are developed in:

- [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/): trace inspection, error analysis, and application-specific measurement.
- [Using LLM-as-a-Judge for Evaluation](https://hamel.dev/blog/posts/llm-judge/): scoped judgments, human-label validation, and class-specific error rates.
- [The Revenge of the Data Scientist](https://hamel.dev/blog/posts/revenge/): experimental design, synthetic data, and evaluator development.
- [Case Study: Putting Evals Into Production](https://hamel.dev/notes/llm/ai-product-engineering/evals-production.html): rubric design and production error analysis.
- [Should I Use Ready-to-Use Evaluation Metrics?](https://hamel.dev/blog/posts/evals-faq/should-i-use-ready-to-use-evaluation-metrics.html): the relationship between generic metrics and product failures.
- [How Can I Efficiently Sample Production Traces for Review?](https://hamel.dev/blog/posts/evals-faq/how-can-i-efficiently-sample-production-traces-for-review.html): random and targeted sampling.
- [What Should I Do When My Gold Eval Dataset Becomes Stale?](https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-my-gold-eval-dataset-becomes-stale.html): dataset maintenance and score comparability.
- [Selecting the Right AI Evals Tool](https://hamel.dev/blog/posts/eval-tools/): tooling and automation boundaries.
- [Tame Complexity by Scoping LLM Evals](https://hamel.dev/notes/llm/officehours/scoping.html): prioritizing evaluation scope.
- [Eval Smell](https://hamel.dev/blog/posts/eval-smell/): output verification and product design.

Related notes:

- [Failure Understanding]({{< ref "ai-engineering/evaluation/v2/failure-understanding" >}})
- [Operationalising Product Behaviour with Automated Evaluators]({{< ref "ai-engineering/evaluation/v2/operationalising-product-behaviour-with-automated-evaluators" >}})
- [Judgment and Findings]({{< ref "ai-engineering/evaluation/v1/30-judgment-and-findings" >}})
