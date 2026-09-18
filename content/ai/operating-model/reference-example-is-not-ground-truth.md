---
draft: false
toc: true
title: "Reference Example Is Not Ground Truth"
linkTitle: "Reference Example Is Not Ground Truth"
---
# A reference example is not ground truth


An eval uses selected cases, criteria, and a person or system to examine a stated claim. It can provide useful evidence. It does not decide what a good product is.

This distinction matters when one example is given more authority than it deserves.

## The circular argument


Consider a product that generates reports:

```text
Choose one report.
Call it Ground Truth.
Score new reports by how closely they match it.
Treat a passing score as proof that the product is good.
```


This starts by assuming that the selected report defines a good result. For the tested cases, the eval may then show that the output resembles that report according to the chosen comparison. It does not examine whether the original definition was right.

The score may be precise while the main question remains unanswered:

> Why is this report a good account of what the product should provide?

## Keep the parts separate


Several different things are often collapsed into "ground truth" or "the eval":

| Thing | Meaning |
| --- | --- |
| External fact or target | Something established independently for a specific case, such as a source amount, a date, or the result of a known calculation. |
| Requirement or rule | Something the product is required to do, such as include a named field or wait for confirmation before taking an action. |
| Product claim | A statement about what the product should do for stated users and situations. |
| Reference example | One possible output that someone has reviewed or accepted. |
| Criterion | A stated condition used to judge an output, such as "every number can be traced to a source record." |
| Evaluator | A person, program, or model that applies a criterion. It can make mistakes. |
| Eval result | What the evaluator observed for the cases that were tested. |
| Product decision | A decision to continue, change, stop, release, or accept responsibility for a stated production scope. |

An eval result may inform a product decision. It is not the decision, and it does not supply the product claim that it is meant to examine.

Use the term ground truth only when an expected value or label is established from an independent source for a specific case. It should have a named source and a reliable way of being established. It can still contain measurement or annotation errors. If reasonable reviewers can disagree, "reviewed judgment" or "reference label" is more exact. A binding rule is a requirement, not ground truth, although an eval may check whether the rule was followed.

## A report can contain facts without being ground truth as a whole


A report may contain:

- facts that can be checked against source records;
- calculations that can be checked;
- fields or sections required by a rule;
- choices about what to include;
- choices about order and emphasis;
- explanations and conclusions that require judgment.

Some parts may have one verifiable answer. The whole report usually does not. Two reports may use different structures, explanations, or conclusions and both be acceptable. The selected report may also contain omissions or mistakes.

A useful question is:

> Would the expected answer still exist if this reference report had never been written?

If the answer is yes, look for the independent source and the way the answer was established. It may be a verifiable fact, or it may instead be a convention or requirement. If the answer is no, the report is probably defining one preferred example rather than recording independent truth.

If an external standard, contract, or fixed template requires a particular form, wording, or value, say which parts are binding and why. An eval can then test whether the output meets that requirement. Meeting it still does not establish that the report is useful or that the product is ready for production.

## What one example can do


One report can:

- show one possible acceptable result;
- help people discuss what they expect;
- reveal possible criteria;
- provide a case for finding later regressions.

It cannot by itself show that:

- its contents and conclusions are right;
- its omissions are acceptable;
- its structure helps the reader;
- it is the only acceptable result;
- the same behavior holds for other inputs;
- people can use the report to complete their work;
- the report is better than the current alternative;
- producing the report changes the condition that motivated the product.

When the same example is used to create the criteria and then check an output, the result can show that the output meets those criteria for that case. It does not independently show that the criteria are right or sufficient.

A single example is enough when the claim concerns only that example. It is not enough to show what happens for other inputs or whether the product is useful.

## What a passing eval supports


"The model passed the eval" is incomplete. A pass can support a narrower statement:

> With this product version, on these cases, under these conditions, the outputs met these criteria according to this evaluator and threshold.

Each part limits the conclusion:

- The cases may not represent the situations in which the product will be used.
- The criteria may omit behavior that matters.
- The evaluator may apply the criteria incorrectly or inconsistently.
- The threshold states what was accepted. It does not prove that the accepted level is appropriate.
- A result for one component may not describe what the whole product does.

An exhaustive and reliable check may establish that a result meets a narrow specification. Passing does not by itself establish wider product correctness, usefulness, safety, or readiness for production. Those are broader claims and may require different evidence.

## State the claim before treating the result as evidence


Exploratory checks may help form or change a product claim. Before treating a result as pass or fail evidence for a decision, state the claim that the eval is meant to examine.

This is circular:

> Produce the correct report. A correct report is one that matches the approved report.

A more useful claim identifies relations to sources, rules, and user actions:

> For supported source data, the product produces an editable report containing the required measures. Each factual claim identifies its supporting source. Each number agrees with its source or with a stated calculation. Missing or conflicting information is shown. The product does not present unsupported conclusions as facts. A reviewer can inspect and correct the report before it is published.

This claim can lead to several checks:

- compare numbers with verified source values;
- check for required information;
- check whether the named sources support the claims;
- examine behavior when sources are missing or conflict;
- use cases that cover the stated range of inputs;
- observe whether reviewers can find and correct errors.

A reference report may help explain the claim or create these checks. It should not be the only reason for the claim.

The clearer claim still does not show that people need the report, understand it, choose to use it, or make better decisions with it. Those remain separate assumptions.

## Report evidence without turning it into a verdict


Avoid:

> The model passed the eval.

> The product provides Ground Truth.

Prefer a statement that says what was tested and what remains unknown:

> On 60 stored cases covering the stated input types, all required figures matched the source records in 57 cases. In the other three, at least one figure did not match. This did not test whether readers understood the reports or whether the reports improved their decisions.

The exact form will depend on the question. The important parts are:

- what claim was examined;
- which cases and conditions were included;
- which criteria and evaluator were used;
- what was observed;
- what the result does not establish;
- which decision the evidence informs.

## Core rule


> A reference example may define the expected result for one case or illustrate a wider requirement. A check can show whether an output meets the expectation for that case. A check of that case cannot show that the requirement is useful, sufficient, or valid beyond it.

An eval is evidence about a stated claim. It is not a verdict that the model or product is good.

This applies the decision logic in [`operating-model.md`]({{< ref "ai/operating-model/operating-model" >}}): state the claim and the decision before choosing the evidence, and keep the limits of that evidence visible.
