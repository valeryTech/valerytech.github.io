---
draft: false
toc: true
title: "Discovery And Delivery"
linkTitle: "Discovery And Delivery"
---

Discovery and delivery are two kinds of work. They are distinguished by their main purpose, not by when they happen.

- **Discovery** is work done mainly to reduce uncertainty that matters to a decision.
- **Delivery** is work done mainly to build and operate product behavior intended for production use.

They can happen at the same time. Implementation can expose new questions. Production can provide evidence that cannot be obtained elsewhere. New evidence can change the problem, the solution, or the behavior the product should provide.

## Classify the work by its purpose


An artifact, environment, or technical activity does not determine whether work is discovery or delivery.

For example:

| Work | Main purpose | Kind of work |
| --- | --- | --- |
| Build a prototype to see whether people understand an interaction | Learn whether an assumption is reasonable | Discovery |
| Run a narrow production test to learn about real inputs | Reduce uncertainty using production evidence | Discovery |
| Implement a known authorization rule for supported behavior | Meet a production obligation | Delivery |
| Add rollback and recovery for supported behavior | Operate the product dependably | Delivery |
| Release a small part with monitoring | Provide behavior and learn from real use | Both |

The label matters only when it helps choose the right standard for the work. Discovery still needs controls when it can affect people, data, or production systems. Delivery still needs fast feedback and room to learn.

## Use evidence to choose the next commitment


Discovery does not need to remove all uncertainty before delivery work can happen. The question is narrower:

> Is the evidence sufficient for the next commitment, given its cost, consequences, reversibility, and remaining uncertainty?

The next commitment may be:

- another investigation;
- an implementation step;
- a limited production test;
- a narrow release;
- supported production use.

A [`production commitment`]({{< ref "ai/operating-model/production-commitment" >}}) adds defined obligations to product behavior in real use. It does not end discovery or begin a separate delivery phase.

Any test involving real use still needs a production commitment that matches how many people or systems it can affect and how serious those effects could be. State what people may rely on, the limits, how the test will be observed, and how it can be stopped or withdrawn.

The [`risk model`]({{< ref "ai/risk-areas/risk-areas-model" >}}) explains how assumptions, uncertainty, consequences, and evidence inform this decision.

## Keep information moving in both directions


Discovery can inform delivery with:

- the current understanding of the problem and intended change;
- candidate solutions and alternatives considered;
- important assumptions and consequences if they are false;
- evidence and its limits;
- known constraints and remaining uncertainty.

Delivery can inform discovery with:

- constraints found during implementation;
- behavior observed under real conditions;
- failures and operating limits;
- user responses;
- changes in the target condition and the broader result that motivated the work.

This is not a handoff. It is a continuing exchange between learning, implementation, operation, and observation.

## Reconsider the work when its purpose changes


The same work may change purpose over time.

A prototype created to answer a question may later become a reference for production behavior. Existing production code may be used in an investigation. A delivery task may uncover uncertainty that requires a separate test.

When this happens, restate:

- the decision being made;
- the assumption or obligation involved;
- the evidence needed;
- the standard the work must meet;
- the commitment that may follow.

Do not treat discovery as complete because implementation has started. Do not treat production work as an acceptable default test when cheaper credible evidence is available.
