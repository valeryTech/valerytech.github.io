---
draft: false
toc: true
title: "Stating a Claim"
description: "A claim about engineering practice names its outcome, population, intervention, comparison and time, and whether it is descriptive, associational, causal or speculative. Empirical claims carry evidence, not proof, and a stated uncertainty."
linkTitle: "Stating a Claim"
---

Evidence supports or refutes a claim, so the first step is a claim precise enough for either. Part of [Evidence in software engineering]({{< ref "engineering/evidence" >}}).

## What a precise claim names


"This practice improves productivity" names nothing that would let anyone check it. A claim that can be checked names:

- **the outcome**: what changed, and how it was measured (see [Measures and constructs]({{< ref "engineering/evidence/measures-and-constructs" >}}));
- **the population**: which people, teams, codebases, tasks and period;
- **the intervention**: what exactly was done or used;
- **the comparison**: compared with what (see [Causal claims need a comparison]({{< ref "engineering/evidence/causal-claims" >}}));
- **the time**: when the outcome was observed, and for how long.

The [AI engineering evidence protocol]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/evidence-protocol" >}}) turns these into requirements for claims about coding agents.

## Four kinds of claim


Statements in a report differ in what they assert, and each kind needs different evidence:

- **Descriptive**: what was observed. "The share of large PRs rose."
- **Associational**: two things vary together. "Teams that adopted the tool merged larger PRs."
- **Causal**: one thing produced another. "The tool made PRs larger." This needs a counterfactual.
- **Speculative**: an explanation or forecast that has not been tested.

Labelling each important statement this way is the first rule drawn from the [Zalando case critique]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/zalando-case-critique" >}}). Most of that report was descriptive or associational, while words such as "impact" and "reduced" implied causal claims.

The same rule applies within one result. In the evidence protocol's example, "Lead time dropped 18%" is an observation, and "the agent understands the architecture" is an interpretation that needs evidence of its own.

## Evidence, not proof


The discipline benefits from a consistent vocabulary for evidence and proof.

Formal mathematical statements can be proven. Empirical claims accumulate **evidence** under assumptions.

So instead of:

> "Agents have been proven to improve developer productivity."

the scientifically appropriate claim looks more like:

> "Under conditions X, treatment A produced an estimated 17% reduction in engineering time compared with B, with this uncertainty interval and these identified limitations."

## Reporting an estimate


The ACM experimental standard requires hypotheses, appropriate statistical tests, effect sizes and confidence intervals, and explicit discussion of alternative explanations. It also recommends separating evidence-based results from interpretation and speculation. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

And the statistical literature strongly cautions against reducing evidence to whether `p < 0.05`; the American Statistical Association has issued formal guidance specifically because p-values are commonly overinterpreted. ([Amstat Magazine](https://magazine.amstat.org/blog/2016/03/07/pvalue-mar16/ "ASA Releases 'Statement on Statistical Significance and P ..."))

Engineering evaluations should therefore emphasize:

`effect estimate + uncertainty + practical significance + assumptions`

A 3% productivity gain can be statistically convincing and economically irrelevant. A 30% estimated gain with huge uncertainty may be commercially interesting but scientifically weak.

How far the estimate reaches is part of the claim too: which people, tasks and settings it covers. [External validity]({{< ref "engineering/evidence/validity" >}}#external-validity) is the check on that.

## Library sources


- [Trochim et al. 2016](/sources/95c4dfddb0a330d19ccec7a9579c993f.bin), *Research Methods: The Essential Knowledge Base* -- p-values, effect sizes, confidence intervals and practical significance; on *Inferential Analysis* (ch. 12)

Further reading:

- [Ghasemi et al. 2025](/sources/c805de7771cea01858c0badc063222cd.bin), *Research Hypothesis: A Brief History, Central Role in Scientific Inquiry, and Characteristics* -- null and alternative hypotheses, Popper's falsification and Hempel's verification
- [Popper 1959](/sources/c68fa1c135c0f988c39d2624f0a61097.bin), *The Logic of Scientific Discovery*
