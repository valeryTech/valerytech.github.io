---
draft: false
toc: true
title: "Risk Areas Model"
linkTitle: "Risk Areas Model"
---
# Risk, Assumptions, and Evidence


This is the canonical risk model for product decisions in these notes.

It explains how to turn uncertainty into specific assumptions, gather evidence for a decision, and decide what to commit to next. It complements the broader [`operating model`]({{< ref "ai/operating-model/operating-model" >}}).

The model has three parts:

1. assumptions about the current condition and the change being sought;
2. assumptions about candidate solutions;
3. assumptions and obligations related to production and operation.

Do not put all three into one flat list of risks. They answer different questions.

## Working terms

### Assumption


An assumption is a specific statement that must be true for an explanation, a solution, or a commitment to hold.

Write it so that evidence could support or weaken it.

> People who review these transactions can understand why the product assigned each category.

The assumption is the main unit in this model. A broad label such as "usability risk" is not specific enough to investigate.

### Uncertainty


Uncertainty means that the truth of an assumption or the outcome of events is not known.

Uncertainty may come from missing evidence, weak evidence, conflicting evidence, changing conditions, or behavior that varies from case to case.

### Risk and consequence


Risk is why uncertainty matters to the decision. Record it as the consequence if an important assumption is false.

> If reviewers cannot understand the category, they may check every result manually. The solution may then save too little time to be useful.

Do not replace this statement with a number such as "high risk" unless the number helps make a real choice.

### Evidence


Evidence is an observation or result that supports or weakens an assumption.

Evidence has limits. It applies to particular people, inputs, conditions, and measures. It rarely proves that an assumption will remain true in every situation.

## Three areas to examine

### 1. Current condition and intended change


Before examining a solution, ask whether the starting point is understood well enough.

Typical assumptions include:

- the current condition has been described accurately;
- the people or systems affected have been identified;
- the condition matters enough to address;
- the proposed change would be useful;
- the observations chosen would show whether the condition changed;
- changing that condition could contribute to the broader result that motivated the work.

These are assumptions about the current condition and intended change. They are not Value, Usability, Feasibility, Viability, or Harm assumptions about a candidate solution.

Evidence may change the description of the condition or the change being sought. That is a valid result, not a failure of the process.

### 2. Candidate solutions


For each serious candidate, look for assumptions about how the solution could fail.

Five dimensions can help with this scan:

| Dimension | Question |
|---|---|
| **Value** | Will the people or customers concerned choose, adopt, buy, or keep using the solution instead of the available alternatives? |
| **Usability** | Can the intended users understand it and complete the relevant work in realistic conditions? |
| **Feasibility** | Can the product provide the required behavior with the available technical capabilities, data, and constraints? |
| **Viability** | Can the solution be offered and sustained within the relevant economic, legal, commercial, and service constraints? |
| **Harm** | Could the solution cause unacceptable harm to users, other people, systems, or the wider environment, including through safety, privacy, security, or abuse failures? |

Use the five questions to find assumptions that may otherwise be missed. They are prompts, not a checklist, sequence, score, proof, or complete account of product uncertainty.

The dimensions may overlap. For example, a privacy concern may affect Harm, Viability, and Feasibility. The category matters less than stating the assumption and its consequence clearly.

Value and intended change are also different. Value asks whether someone will choose or use the solution. The intended change asks whether that use changes the condition it was meant to change. Adoption can occur without that change.

Record the link from solution behavior to the intended change as a separate assumption, not as part of the Value dimension.

The [`solution utility ladder`]({{< ref "ai/operating-model/solution-utility-ladder" >}}) can make claims about one solution more precise. It does not replace this wider scan.

### 3. Production and operation


A production commitment creates obligations that extend beyond the solution scan. These may include:

- supported users and situations;
- behavior people can rely on;
- quality and reliability;
- people, systems, or parts of the wider environment that may be affected;
- harm that must be prevented or limited;
- safety, privacy, security, and abuse controls;
- detection of failures;
- limits on exposure;
- rollback and recovery;
- support and maintenance;
- cost and capacity in real use.

Some of these may first appear as solution assumptions. If uncertainty about a condition could invalidate the solution or change the commitment, it is a learning question.

A condition becomes an obligation when it is accepted as part of a commitment. The way to meet it may still be uncertain. Work done to learn whether or how the condition can be met is learning work. Work done to apply a known way of meeting it is implementation work.

For example:

- "Can this design meet the required response time on representative inputs?" is a learning question.
- "Add the agreed timeout, alert, and recovery behavior" is an implementation obligation.

The difference is the purpose of the work, not whether it happens before or after release.

## Use assumptions as the working unit


For each important assumption, record:

- what must be true;
- the consequence if it is false;
- the evidence that already exists;
- the limits of that evidence;
- how much uncertainty remains;
- which decision the assumption could change.

An assumption deserves attention when:

- it is relevant to the next decision;
- the consequence of being wrong is serious;
- current evidence is weak;
- useful evidence can be obtained at a reasonable cost.

These are prompts for judgment, not inputs to a mandatory score.

Do not investigate every uncertain assumption. Start with the ones that could change the next decision.

## Learning and implementation


Work done mainly to reduce uncertainty is learning work. Work done mainly to meet a known product or production obligation is implementation work. The same concern may produce both kinds of work. The difference is their purpose, not when they happen. See [`discovery-and-delivery.md`]({{< ref "ai/operating-model/discovery-and-delivery" >}}).

## Decision loop


Use this loop for one decision:

```text
Current condition and intended change
                ↓
Possible explanations and candidate solutions
                ↓
Important assumptions and consequences
                ↓
Evidence for a named decision
                ↓
Decision: continue | change | stop
                ↓
Next commitment
                ↓
Build, operate, and observe
                ↺
```


This is a reasoning loop, not a product lifecycle. Several loops may be active at once. Evidence from building, operation, or observation may change an earlier part of the reasoning.

Start evidence work with a named decision. Choose a method that can provide credible evidence for the relevant assumption. Define in advance what result would support continuing and what result would cause a change or stop.

After considering the evidence, decide whether to:

- continue investigating;
- change or reject a candidate solution;
- return to the current condition or intended change;
- implement part of a solution;
- make a limited production commitment;
- make a larger production commitment;
- stop the work.

Before increasing evidence work, ask whether the next commitment can be smaller, safer, easier to reverse, and easier to observe.

## Next commitment


A decision to continue should state what is being committed to next. It may be another investigation, an implementation step, a limited release, or supported production use. Evidence can justify a limited commitment without removing all uncertainty. The evidence needed depends on the possible consequences, scale, reversibility, and ability to detect failure.

For production use, record what people may rely on, the obligations that apply, the uncertainty being accepted, and how the commitment can be limited, observed, and reconsidered. Use the practical [`production commitment`]({{< ref "ai/operating-model/production-commitment" >}}) template.

## Production evidence


Production may provide evidence about product behavior, Usability, Value, the intended change, or the broader result. Evidence for one does not establish the others. Production also shows whether its obligations and harm limits hold. See [`Production is part of learning`]({{< ref "ai/operating-model/operating-model" >}}#8-production-is-part-of-learning) and the [`solution utility ladder`]({{< ref "ai/operating-model/solution-utility-ladder" >}}).

## Compact record


Use one record when an assumption can change an important decision.

```text
Current condition and intended change:

Decision to make:

Option or commitment under review:

Assumption:

Area: current condition/intended change | candidate solution [optional dimension] | production/operation

Consequence if false:

Evidence and its limits:

Remaining uncertainty:

Decision and reason:

Next commitment and obligations:

Observation that could change this decision:

Reconsider when:
```


Keep the record proportional to the decision. A small reversible choice may need only a few lines.

## Supporting material


The longer [`risk-areas-reassembled.md`]({{< ref "ai/risk-areas/risk-areas-reassembled" >}}) explains the source frameworks, differences in terminology, and the reasoning behind this model. It is research support, not the canonical operating guidance.
