---
draft: false
toc: true
title: "Evaluations"
linkTitle: "Evaluations"
---
# The role of evaluation in AI product development


A company building an AI product needs to decide which approach to pursue, what it can offer users, where to invest engineering effort, and what to improve next. Evaluation provides evidence about the product's behavior for those decisions. I treat it as a foundation for developing and delivering the product.

The intended product can be clear while the way to build it remains uncertain. We may know what an assistant should do without knowing which combination of model, instructions, information, tools, and workflow will achieve it across the situations users encounter. Evaluation helps us investigate that relationship between what we build and how it behaves.

Here, evaluation means examining behavior in stated situations and interpreting what the observations tell us. It can help us explore an unfamiliar problem, compare possible solutions, or assess behavior against an agreed expectation. Before calling a result acceptable, we need to explain what we judged and on what basis. ([Systems & Engineering](https://valery.tech/ai-engineering/evaluation/v1/ai-evaluation-goals/ "Ai Evaluation Goals | Systems & Engineering"))

## What evaluation helps us decide


During early development, evaluation helps investigate whether an approach can provide the required behavior and where its limits are. Comparing alternatives and examining failures can show which assumptions need more work, which implementation deserves further investment, or whether the proposed scope needs to change.

As the product becomes something people rely on, the questions become more specific. Which situations can we support? Where is human intervention needed? What happens when information is missing? Evidence about these questions helps the team define what users can depend on and the limits it must communicate and maintain.

Evaluation also helps develop the capability further. When we change a prompt, a model, retrieval, or a workflow, we need to understand whether the change improves the intended behavior and whether it damages something that already worked. Findings can guide the next change, support a release, or reveal that a different solution is needed.

These questions continue after release. Live use exposes situations and failures that earlier work did not represent. That evidence can change priorities, supported scope, or the approach itself. Investigation and delivery can happen together; releasing a product does not finish the work of understanding it. ([Systems & Engineering](https://valery.tech/ai-engineering/evaluation/v1/ai-evaluation-goals/ "Ai Evaluation Goals | Systems & Engineering"))

## How this changes the engineering work


Consider a hypothetical assistant that drafts customer-support replies using company policies and order information. The goal is to help support agents resolve requests with less effort while avoiding incorrect promises to customers.

Suppose a review finds that routine answers are acceptable, but some drafts miss an important policy exception. The finding gives the team a concrete problem to investigate. Did the system receive the relevant policy? Did it overlook the exception? Was the expected behavior unclear? The answer affects whether the team should change retrieval, instructions, application logic, or the criteria used to judge the draft. Evaluation can expose a mismatch; identifying its cause may require further investigation. ([Systems & Engineering](https://valery.tech/ai-engineering/evaluation/v1/ai-evaluation-goals/ "Ai Evaluation Goals | Systems & Engineering"))

After making a change, the team can compare results on the relevant cases and check whether previously acceptable behavior has deteriorated. The purpose is to understand the effects of the change well enough to decide what to do next.

There is a separate product question: do these drafts save support agents time after checking and correcting them? Answering that requires observing the workflow. Accurate drafts can still create too much review work. The team may need to improve the interaction, limit the kinds of requests supported, or reconsider whether drafting is the right solution.

Evaluation therefore contributes to both understanding the current system and finding ways to make it more useful.

## Why this needs a continuing capability


The questions recur as the product changes. A team needs to preserve useful cases, compare versions, inspect failures, and bring findings from production into later development. I call the maintained capability for doing this the **evaluation subsystem**. It includes the people, practices, data, and software involved. ([Systems & Engineering](https://valery.tech/ai-engineering/evaluation/v1/evaluation-subsystem/ "Evaluation Subsystem | Systems & Engineering"))

To make a result understandable, the team needs enough context to examine it: the input, relevant information and actions, the system version, the observed result, and the reason for the judgment. A reviewer should be able to move from a summary back to the evidence behind it. This is what makes results useful for comparison and investigation. ([Systems & Engineering](https://valery.tech/ai-engineering/evaluation/v1/evaluation-subsystem/ "Evaluation Subsystem | Systems & Engineering"))

The practice around that evidence is equally important. Engineers and domain experts need to select relevant situations, examine behavior together, and make expectations concrete. For the support assistant, "follows company policy" becomes clearer when people inspect a case where omitting an exception changes the answer. Shared examples and criteria give the team a more precise language for discussing success, failure, and proposed improvements.

This capability also needs maintenance. Cases can become outdated, records can omit necessary information, and automated evaluators can make unreliable judgments. The evaluation subsystem must expose these limits and allow its own methods to be revised. Otherwise, a change in the evaluation may be mistaken for a change in the product. ([Systems & Engineering](https://valery.tech/ai-engineering/evaluation/v1/evaluation-subsystem/ "Evaluation Subsystem | Systems & Engineering"))

## What the evidence supports


An evaluation result has a scope. It reflects the selected cases, the system version, the criteria, and the way the judgments were made. A score needs that context before it can support a conclusion about the product.

A deliberately difficult case may demonstrate that a failure is possible. It does not establish how often that failure occurs in live use. Likewise, discovering one failure does not by itself justify a large evaluation platform. It may first justify a fix, a control, or a narrower scope. The case for continuing evaluation comes from the questions the team will need to answer repeatedly.

Evidence about behavior also has limits as evidence about product success. Whether users can complete their work, whether they choose to use the product, and whether it produces the intended benefit require their own investigation. A behavioral score cannot answer all of those questions.

Finally, findings need people and engineering work that can act on them. Evaluation can help identify the need for an authorization check, a different workflow, or better recovery. The surrounding system must implement and operate those changes. The people responsible for the product remain responsible for deciding what to offer and under which conditions.

## How to establish it


I would start with a question the team needs to answer. For example: can we support this kind of request, or does a proposed change improve the behavior we care about? The initial work may need only a small set of relevant cases, saved results with enough context to review, people able to judge them, and a record of the finding and its limits. The amount of infrastructure should follow the evidence needed for the decision.

A team may need help understanding that need before it can agree on how to meet it. Investigating a concrete concern together gives people something to examine: the expected behavior, what happened, and the consequences of the difference. That investigation should also be able to change the initial diagnosis or show that a smaller intervention is sufficient.

The depth of evaluation should reflect the decision. A limited, reversible step with visible failures can justify proceeding with more uncertainty than a broad release whose failures are difficult to detect or costly to correct. We do not need to resolve every question before building. We need enough relevant evidence, suitable limits, and a way to respond for the step we are taking.

When evaluation becomes a recurring dependency of product development, it needs planned time, access to relevant data and expertise, and clear responsibility. Establishing the need is part of the work. Continuing to depend on someone supplying it through personal time leaves that responsibility unsupported. Findings must also be able to influence the decisions they were collected to inform.

Evaluation itself has a cost. Its usefulness should be judged through the work it enables: choosing between approaches, understanding failures, assessing changes, and making supported product commitments. Claims that it makes delivery faster or cheaper need to be demonstrated in the particular project.

That is my reason for treating evaluation as foundational. A team building an AI product needs a continuing way to understand its behavior and use that understanding to guide development. Evaluation supplies that evidence; engineering and product responsibility turn it into a supported, improving product.
