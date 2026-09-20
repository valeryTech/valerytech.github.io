---
draft: false
toc: true
title: "Justification"
linkTitle: "Justification"
---

Your "Client gives us a `completeness = 0.84`, therefore the product works" example is almost exactly the class of eval practice Hamel argues against.

One important qualification: **"completeness" itself is not automatically a bad evaluator.** It becomes defensible if you have discovered that incompleteness is an actual product failure, defined precisely what constitutes that failure, obtained human labels, and validated an evaluator against those labels. What Hamel objects to is inventing an abstract quality dimension first and treating its score as evidence of product quality. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/should-i-use-ready-to-use-evaluation-metrics.html?utm_source=chatgpt.com))

### Bad practices to demonstrate


1. **Start with generic qualities: completeness, helpfulness, relevance, coherence, fluency, quality.** These sound plausible but don't establish whether users can successfully do the task. Hamel calls these generic metrics a source of false confidence. His example is a team celebrating a higher "helpfulness" score while users still fail basic tasks. The metric should emerge from application-specific failures such as "calendar scheduling failure" or "failed to escalate to human." ([Hamel's Blog](https://hamel.dev/blog/posts/field-guide/ "A Field Guide to Rapidly Improving AI Products - Hamel's Blog"))
2. **Create a dashboard with lots of metrics because more measurement feels more rigorous.** Hamel explicitly identifies "too many metrics" as a recurring mistake. Metric sprawl fragments attention and makes it unclear what engineering action should follow a score change. ([Hamel's Blog](https://hamel.dev/blog/posts/llm-judge/ "Using LLM-as-a-Judge For Evaluation: A Complete Guide - Hamel's Blog"))
3. **Use arbitrary numeric scales: `completeness=0.82`, `quality=4.1/5`, etc., without calibrated semantics.** Hamel repeatedly criticizes 1-5/Likert-style grading. What separates a 3 from a 4? What should an engineer change because the score moved from 3.7 to 4.1? His preferred starting point is scoped pass/fail plus a critique explaining the decision. ([Hamel's Blog](https://hamel.dev/blog/posts/llm-judge/ "Using LLM-as-a-Judge For Evaluation: A Complete Guide - Hamel's Blog"))
4. **Define the rubric before looking at actual outputs.** This is a major anti-pattern. Hamel calls for error analysis first because evaluation criteria change as experts inspect real outputs--"criteria drift." A recent production case he documents did exactly this wrong: the team wrote criteria first and spent labeling effort on failures that did not actually occur. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/ "AI Evals: Everything You Need to Know - Hamel's Blog"))
5. **Write evals for failures you imagine instead of failures you observe.** His FAQ explicitly pushes back on "eval-driven development" as a general approach for LLM products. The output space is too broad to anticipate all meaningful failures. Start with traces, discover failures, then codify the important ones into tests. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/should-i-practice-eval-driven-development.html?utm_source=chatgpt.com "Q: Should I practice eval-driven development? - Hamel's Blog"))
6. **Generate a test set with "LLM, give me 50 test queries."** Hamel calls this bad experimental design: you tend to get generic, repetitive, unrepresentative examples. Synthetic data should be based on production behavior and deliberate dimensions--personas, workflows, edge cases, known failure conditions, system constraints. ([Hamel's Blog](https://hamel.dev/blog/posts/revenge/ "The Revenge of the Data Scientist - Hamel's Blog"))
7. **Trust an LLM judge because its answers look reasonable.** Hamel treats the judge as another classifier that itself must be evaluated. You need human labels from someone whose judgment you trust, a train/dev/test split, prompt iteration on dev, and a held-out test set. Otherwise the number emitted by the judge has no established meaning. ([Hamel's Blog](https://hamel.dev/blog/posts/revenge/ "The Revenge of the Data Scientist - Hamel's Blog"))
8. **Report "judge accuracy" or "agreement" as proof that the judge is good.** This fails badly for uncommon failures. If only 5% of examples fail, a judge that always says "pass" has 95% agreement and detects zero failures. Hamel recommends looking separately at the judge's ability to detect failures and passes--TPR/TNR or precision/recall depending on framing. ([Hamel's Blog](https://hamel.dev/blog/posts/llm-judge/ "Using LLM-as-a-Judge For Evaluation: A Complete Guide - Hamel's Blog"))
9. **Put the entire rubric and entire trace into one giant judge call.** Hamel argues for scoped evaluations. His more recent guidance also warns that giving every judge the full trace can make it worse because irrelevant context distracts the evaluator. Each evaluator should receive the evidence needed for its specific failure mode. ([Hamel's Blog](https://hamel.dev/blog/posts/revenge/ "The Revenge of the Data Scientist - Hamel's Blog"))
10. **Automate the evaluation process before humans understand the failures.** One especially dangerous pattern is having an AI generate the rubric and immediately use that rubric to score outputs. Hamel describes this as stacking abstractions that can hide errors behind convincing scores. LLMs can accelerate taxonomy work and evaluator implementation after people have inspected the data; they don't replace that step. ([Hamel's Blog](https://hamel.dev/blog/posts/eval-tools/ "Selecting The Right AI Evals Tool - Hamel's Blog"))
11. **Let engineers, vendors, or outsourced annotators decide what "good" means without domain experts.** Hamel repeatedly pushes domain experts and PMs toward raw traces and actual outcomes. Outsourcing error analysis is, in his words, usually a mistake because the process itself creates the product understanding you need to define quality. ([Hamel's Blog](https://hamel.dev/blog/posts/revenge/ "The Revenge of the Data Scientist - Hamel's Blog"))
12. **Build an expensive LLM evaluator for every problem you encounter.** Some failures need a prompt fix; others need a deterministic assertion, schema check, regex, execution check, or product change. Hamel explicitly says to fix obvious issues first and reserve expensive evaluators for persistent failures that require judgment. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/ "AI Evals: Everything You Need to Know - Hamel's Blog"))
13. **Treat the eval dataset as a permanent "golden set."** Products, users, and failure patterns change. Hamel recommends recurring error analysis and updating the eval set. He even notes that old and new aggregate scores may stop being directly comparable, which is acceptable because evals are primarily a hill-climbing mechanism. Long-term product health should additionally be measured with actual product metrics. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-my-gold-eval-dataset-becomes-stale.html?utm_source=chatgpt.com))
14. **Sample only what your existing evaluator or user feedback already flags.** That ensures you mostly rediscover known failures. Hamel recommends retaining random production samples while using targeted sampling for known problems, so new failure modes can still emerge. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/how-can-i-efficiently-sample-production-traces-for-review.html "Q: How can I efficiently sample production traces for review? - Hamel's Blog"))
15. **Try to evaluate the entire product surface equally from day one.** His office-hours material explicitly recommends narrowing the problem. A product might have 40 conversation categories while 5-6 account for most traffic. Start where usage, impact, or uncertainty is concentrated, get that methodology working, then expand. ([Hamel's Blog](https://hamel.dev/notes/llm/officehours/scoping.html "Tame Complexity By Scoping LLM Evals - Hamel's Blog"))
16. **Measure implementation success instead of user success.** "Did the tool call succeed?" can be a useful component check, but a product eval should ask whether the intended outcome happened--for example, whether the appointment was actually made. Hamel explicitly tells teams to expose product outcomes to domain experts. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/ "AI Evals: Everything You Need to Know - Hamel's Blog"))
17. **Build the eval dashboard before building the ability to inspect traces.** This is the "tools trap" in the Field Guide. A polished dashboard full of generic scores can actively discourage investigation because it creates the feeling that measurement already exists. Hamel puts a simple, domain-specific trace viewer and low-friction annotation workflow ahead of sophisticated evaluation infrastructure. ([Hamel's Blog](https://hamel.dev/blog/posts/field-guide/ "A Field Guide to Rapidly Improving AI Products - Hamel's Blog"))
18. **Assume "hard to evaluate" is purely an eval-engineering problem.** Hamel's 2026 article goes further: if experts cannot cheaply verify an AI output, users probably cannot either. Product design should expose sources, intermediate artifacts, diffs, constraints, provenance, or other checkable evidence. That also makes evals much easier. ([Hamel's Blog](https://hamel.dev/blog/posts/eval-smell/))

I would make **#1-#8 the core argument**. They directly attack the idea that an eval platform succeeds by producing plausible-looking quality numbers.

The question I would put next to a metric such as **"Completeness: 0.84"** is:

> What concrete product failure does 0.84 measure; who established the ground truth; what does pass/fail mean on actual examples; how well does the evaluator reproduce expert judgment on unseen labeled data; and what product decision changes if this number moves?

If those questions don't have answers, **0.84 is an output of the evaluation system, but there is no evidence yet that it measures product quality**. That is the distinction I think you should build the demonstration around.

There is also a very clean conceptual chain across:

**raw traces -> human error analysis -> observed failure taxonomy -> prioritize failures -> scoped pass/fail criteria -> human labels -> validated automated evaluator -> failure rates on representative data -> engineering experiments -> production/product outcomes.**

Additionally:

The single best article to give the Client team is [The Revenge of the Data Scientist](https://hamel.dev/blog/posts/revenge/). It was published in March 2026 and is almost a ready-made critique of a score/dashboard-first eval product. Then use [Using LLM-as-a-Judge For Evaluation](https://hamel.dev/blog/posts/llm-judge/?utm_source=chatgpt.com) for the methodological details and [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/) for the broader development loop.

## second phase


We could consider each anti-pattern as a failure mechanism, not just a rule: what information gets lost, what false inference follows, and what concrete safeguard blocks it. 

Once a failure mode exists, the evaluator estimates its prevalence; each failure gets its own evaluator; objective failures should use deterministic checks; LLM judges are for narrow judgment tasks and must be aligned against human labels. That gives us a precise way to explain why the common shortcuts fail.

XXX

Model backbone:

**observed behavior -> failure model -> criterion -> evaluator -> judgment -> aggregation -> product decision**

That matches failure-understanding flow, where discovery precedes operationalisation and measurement, ([Systems & Engineering](https://valery.tech/ai-engineering/evaluation/v1/20-error-analysis/?utm_source=chatgpt.com "20 Error Analysis | AI Engineering and Architecture")) and it also maps cleanly onto `wallet-evals` distinction between Execution -> Judgment -> Evaluation. [wallet-evals concepts.md](https://github.com/valery-judah/wallet-evals/blob/main/docs/product/concepts.md?utm_source=chatgpt.com)

The useful claim: Every step adds an inference. If you skip a step, the final number may still be computable, but you haven't established what the number means.

### 1. Start with generic metrics


Suppose Client gives you:

```text
Completeness: 0.91
Relevance:    0.94
Coherence:    0.96
```


The problem happens before measurement. There is no demonstrated relationship between `Completeness` and the behaviors that determine whether your product works.

Hamel calls this out directly: generic metrics such as helpfulness, coherence, and quality measure abstract properties that may have little connection to application-specific failures. A good score therefore doesn't establish successful product behavior. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/should-i-use-ready-to-use-evaluation-metrics.html?utm_source=chatgpt.com))

Consider a wallet assistant:

```text
Response A:
"Your transfer of $500 is ready. Would you like me to confirm it?"

Completeness = 0.96
```


But perhaps the actual product failure discovered from traces is:

```text
F12: Confirmation is offered without showing the source account
     when the user owns multiple eligible accounts.
```


The response can be linguistically complete while failing F12.

So:

```text
high Completeness
        ↓
does NOT imply
        ↓
absence of F12
        ↓
does NOT imply
        ↓
successful wallet behavior
```


This is a **construct validity** failure: we haven't shown that the thing being measured represents the product behavior we care about.

Prevention is your current sequence:

```text
traces
  ↓
observed incidents
  ↓
recurring failure mode F12
  ↓
criterion:
"Before confirmation, source account must be unambiguous."
  ↓
evaluator
  ↓
F12 failure rate
```


Now `2.7% F12 failures` has an interpretable meaning. Hamel similarly recommends that application-specific metrics emerge from error analysis. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html?utm_source=chatgpt.com))

### 2. Write the rubric first


This looks more disciplined:

```text
We care about:
- completeness
- relevance
- coherence
- tone
- conciseness
- grounding
```


But the categories came from someone's expectations about how an AI _might_ fail.

The failure occurs because the taxonomy constrains observation. Reviewers start fitting behavior into existing boxes instead of discovering what the application actually does.

Hamel documents a production case where a team wrote its rubric first and then spent labeling effort on criteria that rarely appeared as actual failures. ([Hamel's Blog](https://hamel.dev/notes/llm/ai-product-engineering/evals-production.html?utm_source=chatgpt.com "Case Study: Putting Evals Into Production - Hamel's Blog"))

Your failure-understanding model handles this better:

```text
trace 17 → wrong account selected
trace 31 → wrong account selected
trace 42 → ambiguous account silently resolved
trace 58 → confirmation shown for wrong account

              ↓ comparison

Account-selection / disambiguation failure
```


Only then do you operationalise it.

So the problem with rubric-first evaluation is not primarily that the rubric might be wrong. It's that **you have no evidence yet about which distinctions are useful**.

### 3. Put several concerns into one evaluator


Suppose the evaluator asks:

> Is this response complete, correct, relevant, concise, and professional? Score 1-5.

Imagine:

```text
Version A:
correctness  -> bad
style        -> excellent

Version B:
correctness  -> excellent
style        -> mediocre
```


Both could receive `4.1`.

You've now destroyed information needed for engineering.

The aggregate permits compensation:

```text
critical behavior failure
        +
cosmetic improvement
        =
same score
```


And if `4.1 -> 3.9`, nobody knows what changed.

Hamel identifies arbitrary multidimensional scoring as a recurring mistake and recommends narrow binary judgments because they give a much clearer decision boundary and failure interpretation. ([Hamel's Blog](https://hamel.dev/blog/posts/llm-judge/?utm_source=chatgpt.com "Using LLM-as-a-Judge For Evaluation: A Complete Guide - Hamel's Blog"))

Your evaluator unit should therefore usually be:

```text
Evaluator E12
Criterion: Source account is unambiguous before confirmation.

PASS
FAIL
```


and separately:

```text
Evaluator E17
Criterion: Fee is disclosed before confirmation.

PASS
FAIL
```


Aggregation happens afterward.

This distinction is important. **Atomic evaluators and aggregate evaluation results are different artifacts.**

### 4. Trust an LLM judge without validating it


Suppose Client implements your F12 evaluator:

```text
LLM judge:
Does this interaction clearly identify the source account?

→ PASS
```


The criterion may now be good.

But we have a second inference:

```text
judge says PASS
        ↓ ?
human expert would say PASS
```


Without validation, that arrow is unsupported.

The judge is another probabilistic model. A `97% product pass rate` could mean:

```text
product is excellent
```


or:

```text
judge almost always says PASS
```


You can't distinguish them.

This is a **measurement validity** problem.

Hamel recommends validating scoped judges against human labels on held-out data and measuring their ability to correctly identify both passes and failures. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/can-i-use-the-same-model-for-both-the-main-task-and-evaluation.html?utm_source=chatgpt.com "Q: Can I use the same model for both the main task and evaluation? - Hamel's Blog"))

So you want:

```text
Failure mode F12

Human-labeled examples
        ↓
train / dev / test
        ↓
build evaluator
        ↓
compare evaluator ↔ humans
        ↓
TPR = ...
TNR = ...
```


Only after that does evaluator output become credible measurement.

This is also why your `automatic-evaluators.md` approach is the right second stage: **failure discovery creates the criterion; evaluator validation establishes whether automation can apply that criterion reliably.**

### 5. Use overall judge accuracy


This produces another deceptively good number.

Suppose F12 occurs in 2% of interactions.

An evaluator that says `PASS` for everything gets:

```text
98% accuracy
```


while catching:

```text
0% of actual F12 failures
```


So overall accuracy can make a useless evaluator look excellent.

The product question normally requires knowing separately:

```text
When humans say PASS, how often does evaluator say PASS?

When humans say FAIL, how often does evaluator catch the failure?
```


Hence TPR/TNR, sensitivity/specificity, precision/recall depending on how you define the positive class.

Hamel explicitly recommends measuring the judge against human labels this way. ([Hamel's Blog](https://hamel.dev/blog/posts/evals-faq/can-i-use-the-same-model-for-both-the-main-task-and-evaluation.html?utm_source=chatgpt.com "Q: Can I use the same model for both the main task and evaluation? - Hamel's Blog"))

This gives you a strong counterexample whenever somebody presents:

> Our evaluator has 95% agreement.

Your next question is simply:

> What's the failure prevalence, and what are the evaluator's false-positive and false-negative rates?

### 6. Treat evaluator output as the evaluation result


This is where your `wallet-evals` vocabulary becomes particularly useful.

Suppose:

```text
F12 judge: PASS
F17 judge: PASS
F22 judge: FAIL
```


Those are **judgments**.

They don't yet answer:

> Does Wallet work?

That question is underspecified.

For which:

```text
version?
feature?
user cohort?
scenario?
environment?
risk level?
time period?
```


And according to what decision rule?

Your model correctly separates these:

```text
Execution
    ↓
evidence

Judgment
    ↓
criterion-specific assessments

Evaluation
    ↓
answer to an evaluation question
for a declared scope
```


[wallet-evals concepts.md](https://github.com/valery-judah/wallet-evals/blob/main/docs/product/concepts.md?utm_source=chatgpt.com)

So a defensible result would look more like:

```text
Question:
Did Wallet v1.14 regress transfer confirmation behavior?

Scope:
consumer accounts
multi-account users
EN locale
transfer scenarios
build 1.14 vs 1.13

Evidence:
412 case executions

Result:
F12 failure rate
1.13: 1.8%
1.14: 7.5%

Decision rule:
release threshold <= 3%
```


That is an evaluation result you can use.

`Quality = 87.3` has no comparable semantics.

### 7. Treat a failed eval as root cause


Another subtle mistake:

```text
F12 = FAIL
```


means:

> The observed behavior violates F12.

It does **not** mean:

> The prompt caused F12.

The cause might be:

```text
retrieval
account state
tool response
tool-selection logic
prompt
model
conversation state
UI contract
```


Your concepts document already makes exactly this separation: judgments tell you whether evidence satisfies a criterion; failure understanding and diagnosis consume that evidence afterward. [wallet-evals concepts.md](https://github.com/valery-judah/wallet-evals/blob/main/docs/product/concepts.md?utm_source=chatgpt.com)

This also explains why complete traces matter. Your current error-analysis writeup explicitly treats final output as insufficient because earlier tool/state failures can be hidden by a plausible final answer. ([Systems & Engineering](https://valery.tech/ai-engineering/evaluation/v1/20-error-analysis/?utm_source=chatgpt.com "20 Error Analysis | AI Engineering and Architecture"))

So:

```text
Evaluator → detects
Trace review → diagnoses
```


Those are different jobs.

I think this yields a much stronger overall model than "Hamel says generic metrics are bad."

The argument becomes:

```text
                 PRODUCT CLAIM
"Wallet works for scenario X"
                      ▲
                      │
             evaluation result
                      ▲
          scope + aggregation rule
                      │
                  judgments
                      ▲
          validated evaluators
                      │
                  criteria
                      ▲
              failure model
                      │
             observed traces
```


Every arrow is a **proof obligation**.

For any metric Client proposes, you can therefore ask five questions:

|Question|What it establishes|
|---|---|
|What observed product behavior or requirement does this measure?|construct validity|
|What precise criterion defines pass/fail?|interpretable decision boundary|
|What evidence does the evaluator inspect?|evidence sufficiency|
|How was the evaluator validated against expert judgment?|measurement validity|
|What evaluation question, population, and decision does the aggregate answer?|decision validity|

If they say:

> We measure completeness because completeness is important.

they fail question 1.

If they say:

> GPT-5 evaluates completeness.

they fail question 4.

If they say:

> Average completeness is 0.91, therefore the product is good.

they fail question 5.

That, I think, is the cleanest reasoning framework for demonstrating exactly **why** these anti-patterns fail rather than merely saying that your approach is preferable.
