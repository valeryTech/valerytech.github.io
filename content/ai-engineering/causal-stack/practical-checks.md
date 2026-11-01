---
draft: false
toc: true
title: "Learning through real product use"
description: "Start from an existing customer job, build one usable path, inspect real attempts, compare changes, and observe repeat use. Record which investigation questions improve decisions and how much effort the guide adds."
linkTitle: "Learning through real product use"
---

Choose a product because there is a customer job worth improving. Use these notes to investigate difficulties encountered while delivering that improvement.

**Status:** a proposed practice for future product work. No customer results or completed experiments are reported here.

Keep three questions separate: does the product improve the customer's work; does a particular engineering change improve behavior; and do these notes help us make better decisions at a reasonable cost?

## Order of work


Return to earlier questions when new evidence changes the problem. Prioritize consequential failures even when they fall outside the current stage.

| Order | Practical work | Evidence and decision |
|---|---|---|
| 1. Understand the existing job | Observe intended customers doing the task with current tools; inspect recent examples and workarounds | Establish the trigger, acceptable result, current effort, and recurring difficulty. Decide whether the problem and first scope are clear enough to build |
| 2. Build one complete useful path | Deliver a small workflow from real input to a usable result, recording manual assistance | Inspect accepted and rejected results and total effort. Decide whether the approach is usable and technically plausible |
| 3. Observe first use | Watch customers use it on their own tasks with minimal coaching | Capture corrections, abandoned work, successes, and assistance. Find what actually limits useful completion |
| 4. Investigate one important problem | Use [cases]({{< ref "ai-engineering/causal-stack/cases" >}}) and the [debugging guide]({{< ref "ai-engineering/causal-stack/debugging" >}}) | Compare explanations and choose the next inspection or experiment |
| 5. Check a candidate change | Use a [focused check]({{< ref "ai-engineering/causal-stack/checks" >}}), including fresh cases and previous successes | Assess benefit, regressions, and added work. Retain, revise, reject, or investigate further |
| 6. Observe repeated real use | Keep the product available through further natural occurrences of the job | Inspect repeat use, non-use and its reasons, rework, support load, and operating cost. Decide whether to continue, narrow, expand, or stop |
| 7. Revise the notes | Review which questions changed an investigation or decision | Retain useful distinctions; qualify unsupported generalizations; merge or remove overhead |

A first pilot can be small and exploratory. Its results describe the participants and tasks observed. Select further customers and cases according to the uncertainty that matters next; do not treat an early convenience sample as a market-wide estimate.

Before comparing versions, agree with the responsible customer or domain expert on what acceptable completion means. Try the judgment rule on actual examples and resolve material disagreements.

## Example: helping support staff answer tickets


**Illustrative product, not a customer finding.** Take one recurring ticket type. The product drafts a reply from current documentation; a support person checks and sends it through the normal workflow.

The first useful outcome is an acceptable reply delivered with less total work. Track whether the customer's problem is subsequently resolved separately. An accepted draft does not establish resolution.

Observe the existing workflow and include time spent finding information, preparing inputs, reviewing, correcting, sending, and dealing with follow-up problems. Include hidden work by the builder or operator. Retain attempted tasks that were abandoned or completed manually.

A positive response to a demonstration is limited evidence. Observe whether staff choose the product when the job recurs, what they use instead, and why. Investigate product value and workflow fit if technical improvements do not improve use or outcomes.

## From an incident to a product change


Suppose a support person corrects a draft because it uses an obsolete rule:

1. Inspect the governing source, retrieved documents, and actual model input. If the input was not captured, preserve that uncertainty.
2. Check applicability with the domain owner. The newest document might not govern a historical question.
3. Replay the fixed question under verified current, obsolete, and missing evidence conditions. Define the appropriate result separately for each.
4. If a source-selection change looks promising, compare it with the current product on failures, ordinary successes, exceptions, and fresh cases.
5. Observe whether the released change reduces corrections without excessive delay, missed answers, or extra work.

This sequence can support a local engineering decision. It does not by itself identify an internal model mechanism. Record the result as evidence for the relevant [claim]({{< ref "ai-engineering/causal-stack/claims" >}}#selecting-applicable-evidence).

## Make the comparison interpretable


Choose the primary outcome and tolerable tradeoffs before examining results. For the example, these might be acceptable replies and corrections for obsolete rules, with review effort, unnecessary fallback, delay, and cost as additional outcomes.

Use the [comparison recipe]({{< ref "ai-engineering/causal-stack/checks" >}}#compare-a-proposed-change). Keep selected challenge cases separate from normal work. Repeated generations help reveal variation within a task; they do not create new independent tasks or customers.

Set sample size and repetitions according to observed variation and the improvement needed for the decision. When the evidence is insufficient, state what additional evidence would change the decision. A small pilot can improve the measurement procedure without establishing a general performance advantage.

In live use, a before/after comparison can mix the product change with customer learning, task difficulty, or source changes. Report that limitation. If a causal estimate becomes necessary and traffic permits, choose an appropriate randomized comparison that accounts for repeated customers and shared state.

## Improve the guide through use


At a product review, identify a question from the guide that changed what was inspected, tested, built, or decided. Link the case. Also record misleading suggestions and time spent reading or maintaining the notes.

Use those observations to retain, qualify, merge, or remove material. If the guide becomes a team practice, consider the [claim about its usefulness]({{< ref "ai-engineering/causal-stack/claims" >}}#using-the-guide-during-investigation). Agreement on a label is secondary to useful diagnosis and less wasted work.

## Methodological basis


- [GOV.UK's moderated usability guidance](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing) describes observing task attempts and using participants' own data where feasible. It informs first-use sessions; it does not establish sustained demand.
- [Runeson and Höst's case-study guidelines](https://link.springer.com/article/10.1007/s10664-008-9102-8) support clear questions and a traceable chain of evidence from real settings. They inform the product case records.
- [Wieringa's design-science methodology](https://link.springer.com/book/10.1007/978-3-662-43839-8) provides the broader frame of designing an artifact and evaluating it in its intended context.
- [Evidence-Based Software Engineering](https://ebse.webspace.durham.ac.uk/) combines appraisal of research with practical expertise and stakeholder circumstances. It informs the review of recommendations before treating them as established practice.

The local [evaluation approach]({{< ref "ai/approach/evaluations" >}}), [experimentation note]({{< ref "ai-engineering/approach/experimentation" >}}), and [evidence protocol]({{< ref "ai/other/methodology/in-protocol" >}}) remain the parent methodology. The procedures here are a practical application that should itself be revised through use.
