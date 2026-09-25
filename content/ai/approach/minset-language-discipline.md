---
draft: false
toc: true
title: "Minset Language Discipline"
linkTitle: "Minset Language Discipline"
---
# Language, mindset, and discipline in AI product development


I see AI product engineering as a practice that is still taking shape. It brings together knowledge from software engineering, machine learning, experimentation, product development, domain expertise, and operations. We have established knowledge to use in these areas. How we combine it into a dependable way of building AI products still needs examination and development. ([Systems & Engineering](https://valery.tech/ai/approach/align/ "Aligning on AI product engineering | Systems & Engineering"))

A team can have a clear product goal while needing to investigate whether and how a proposed system can achieve it. The intended outcome can remain stable as the team discovers which implementation works, under which conditions, and with which limits.

There are therefore two things to develop: the product and the practice used to understand and improve it. Both belong in the engineering work.

## When language makes the work sound settled


My concern is that people can speak about AI engineering as though the important questions about the practice have already been answered. Familiar titles, tools, and methods can make the remaining work sound like straightforward application. That leaves less room to examine whether the approach itself is adequate for the problem. ([Systems & Engineering](https://valery.tech/ai/approach/align/ "Aligning on AI product engineering | Systems & Engineering"))

Consider a team assigning someone responsibility for evaluation. One person understands the task as maintaining the existing tests and improving their scores. Another understands it as investigating whether those tests capture the required behavior, establishing suitable methods, and using the findings to guide development. Both responsibilities could be described as "owning evaluation," but they involve different work and authority.

The same care is needed when discussing the product. Saying that an assistant is reliable leaves important questions unanswered: reliable at which task, for which situations, and with what consequences when it fails? A statement about acceptable drafts also leaves open whether people can check them effectively and whether using them saves work.

We need to examine confidence in both the product and the methods used to judge it. An evaluation result can be carefully reported while the choice of cases or criteria remains poorly examined. Naming a practice does not settle whether it is suitable.

I do not expect every statement to be hesitant or overloaded with qualifications. I expect people to be able to explain what their confidence rests on, where it applies, and which questions remain open.

## What I mean by a scientific mindset


For me, a scientific mindset starts with distinguishing what we have observed from what we assume. It means making our reasoning available for examination, investigating what we do not understand, and being willing to change our conclusions. Honesty about failures and limits is part of that work. ([Systems & Engineering](https://valery.tech/ai/approach/my-perspective/ "My approach to production AI engineering | Systems & Engineering"))

In practical terms, an uncertain idea should lead to a question we can investigate. What do we expect to happen? Why? What evidence would support that explanation, and what could show that it is wrong? When several explanations or solutions are plausible, we should consider how to distinguish between them. An experiment is useful when its result can improve our understanding or inform a decision.

The same scrutiny applies to our methods. We may need to question whether an evaluation measures the behavior we care about, whether its cases represent the intended use, or whether our interpretation goes beyond the evidence. My own framework and preferred methods must remain open to that examination.

Experience contributes judgment: which questions to ask, which failures to investigate, and which assumptions deserve attention. I want that judgment to influence the work and to be understandable through the reasoning behind it. Further experience should also give us reasons to revise it.

## Building shared understanding


Shared language develops through examining concrete situations together.

Suppose two people review an assistant's answer against the requirement that it follow company policy. One accepts the answer because its statements are correct. The other rejects it because it omits an exception that could change the customer's decision. Reviewing the case helps the team make an implicit expectation explicit: an applicable exception must be included when it changes the answer's meaning or consequences. The product goal can remain the same while the criteria become more precise.

This is why domain knowledge belongs in the work of understanding behavior. People who know the domain can explain why an answer fails, help choose relevant cases, and refine the criteria used to judge it. Engineers contribute knowledge about how the system produces that behavior and how it might be changed.

Users contribute another part of the picture. A technically correct answer may still require too much checking or correction to help them. Understanding the complete workflow requires examining what people actually do with the product.

The purpose of shared language is to make these distinctions understandable across roles. People should be able to tell whether they disagree about the expected behavior, the evidence, its interpretation, or the decision to make.

That does not require everyone to arrive with the same terminology. It requires enough openness and cooperation to develop shared understanding, including when someone introduces a problem the team has not yet recognized.

## Making the mindset part of everyday work


Discipline means carrying this way of thinking into the work consistently.

When investigating a change, we should preserve enough information to explain the question, what was changed, how the result was judged, what happened, and what we concluded. That lets other people examine the reasoning and lets the team use what it learned in later decisions. Counting experiments tells us little unless we understand what those experiments established.

Evaluation provides practical support for this. Its data, tools, methods, and review practices help people inspect behavior, compare changes, and examine failures. Shared criteria connect those observations to product expectations. The findings can then inform decisions about what to build, change, support, or investigate further. ([Systems & Engineering](https://valery.tech/ai/approach/my-perspective/ "My approach to production AI engineering | Systems & Engineering"))

The amount of investigation should fit the decision. A familiar, reversible change may need little additional work. A decision with serious consequences, weak evidence, or failures that are difficult to detect deserves more attention. Sometimes a smaller supported release is a reasonable way to proceed while continuing to learn.

Discovery and delivery can continue together. Building and operating the product can expose questions that earlier investigation missed. Once people rely on it, however, the team needs to be clear about supported use, limits, and responsibility for failures. Learning from use comes with those obligations.

The purpose is to make progress with an understood basis for the step being taken. We need enough evidence to support that step and the means to respond when experience challenges our understanding.

## What the company must make possible


These expectations depend on how the company responds to questions and findings. People need to be able to report failures, acknowledge uncertainty, ask for help, and challenge an explanation. Trust and cooperation make it possible for knowledge from different roles to influence the work. ([Systems & Engineering](https://valery.tech/ai/approach/my-perspective/ "My approach to production AI engineering | Systems & Engineering"))

A team may initially lack the methods or understanding it needs. Helping establish them can be part of the engineering contribution. A concrete investigation gives people something to examine together and may also reveal that the proposed solution is larger than necessary. Questions about relevance, frequency, consequences, cost, or alternatives can help clarify the need.

Understanding the need, agreeing about its importance, and committing resources are separate steps. When a practice becomes necessary for continuing development, it needs shared responsibility and planned support. It cannot depend indefinitely on someone supplying the work through personal time.

The company also needs the ability to act on findings: access to users and domain experts, relevant evidence, engineering capacity, and authority to revise decisions. A team can have evaluation tools and still be unable to change a product claim or release plan when the results call it into question.

These are the conditions under which I want to help develop AI products and the practice around them. I bring an approach shaped by experience, and I expect it to be examined and improved through the work. The goal is to use what we know, investigate what we still need to understand, and let that understanding affect what we deliver.
