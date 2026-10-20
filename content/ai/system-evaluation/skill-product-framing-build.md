---
draft: false
toc: true
title: "Defining the Product Before Building"
description: "How to draft a useful product brief from users, jobs, workflows, and scope, while separating requirements from current behavior, assumptions, and unresolved product choices."
lastmod: "2026-10-19"
linkTitle: "Product Framing"
---

Before designing a system, establish who it is for, what they need to do, and what the product should help them accomplish. Write a short brief that engineers and coding agents can use without guessing at important product choices.

Keep it small enough to update as you learn. The goal is to support the next decision, not to write a complete specification before doing any work.

## Start from the problem


For a new idea, separate the problem from the suggested solution. "Build an AI PR reviewer" describes a possible solution. "Help authors find important bugs before requesting human review" describes a job the product might help with.

For an existing product, inspect its behavior, documentation, issues, prior decisions, and relevant code. Keep track of what is explicitly required, what the product currently does, what you are assuming, and what is still unclear.

Current behavior is not automatically the intended behavior. It may include bugs, outdated choices, or accidental limits.

## What the brief should cover


| Part | Questions |
| --- | --- |
| People and situation | Who uses it, who does the work, and who else is affected? |
| Job and result | What are they trying to do? What should improve? |
| Workflow | What starts the work, what happens next, and how does the person finish? |
| Required features | What must the product enable for that workflow to work? |
| Scope | Which situations are included, excluded, or undecided? |
| Fixed requirements | Which choices and restrictions are already agreed? |
| Open questions | What could change the next decision, and how could we find out? |

Include technical restrictions when they are real, such as a required integration. Avoid choosing storage, services, or APIs just to make the brief feel concrete.

For example, "Users approve generated changes before publication" is a product requirement. The system design decides how to enforce it.

## Draft something early


Write a first version from the available information, then use it to focus the discussion. A concrete draft makes it easier to spot gaps than a long list of general discovery questions.

Check whether:

- the right person benefits from the proposed work;
- the feature could work technically while failing to help that person;
- the person can complete the whole job, including checking and correcting results;
- any proposed feature can be removed without losing the useful workflow;
- an important assumption could change what should be built next.

## Resolve the questions needed now


Ask whether different answers would change a decision you need to make now.

If they would, choose a practical way to get the answer. Read existing code or documentation, talk to the responsible person, observe the current workflow, build a small prototype, or run a test.

If the answer matters later, keep the question for later. Do not turn every unknown into a requirement or an investigation.

A prototype can help people try an interaction. You can also measure its behavior or test it with users. Seeing it run does not by itself show that it saves time or solves the user's problem.

Give an investigation a clear question, enough context, and a time limit. Ask what happened and what remains unclear. If the result does not answer the question, decide whether another check is worthwhile, the plan should be smaller, or the decision can wait.

## Be clear about who decides


An agent can read existing material, draft the brief, investigate factual questions, and make routine choices within its assignment. It should not quietly invent an important product requirement.

When the available information leaves a product choice open, bring it to the responsible person with the options and their effects. For example, deciding whether generated output can be published automatically needs a product decision. The fact that automatic publishing would be easier to implement is not enough.

Ask for decisions that are needed. Avoid asking people to repeat facts that can be found in the code or documents, and avoid doing unnecessary research when the missing answer is someone's preference.

## Record important assumptions


Sometimes work can proceed with an assumption that is easy to change later. Write down the ones that could affect the result and what would make you revisit them.

The brief does not need a label on every sentence. It needs enough clarity that a later engineer or agent will not mistake an unresolved choice for an agreed requirement.

## Say whether this is a prototype or a supported feature


A prototype can leave parts unfinished because it is being used to answer a question. A feature released to users needs testing, failure handling, and support within the scope you promise.

A small first release can support fewer situations while still working properly in those situations. Be specific about that limit. See [Production Commitment]({{< ref "ai/operating-model/production-commitment" >}}).

## Stop when the next person can proceed


The brief is ready for the next step when someone can identify the user, intended behavior, scope, fixed choices, and open questions without inventing product intent.

It does not need to answer every future design question. Update it when implementation, review, or real use reveals something that changes the plan.

For a coding agent, the working instructions can stay short:

```text
Read the available material and draft a short product brief.
Keep requirements, current behavior, assumptions, and open questions clear.
Investigate important questions needed for the next decision.
Make routine choices within the assignment.
Ask the responsible person about important product choices left open.
Update the brief when answers change the plan.
Stop when the next activity can proceed without guessing product intent.
```


Continue with [Making System Design Decisions]({{< ref "ai/system-evaluation/skills-hld-build" >}}) and [Working with a Coding Agent]({{< ref "ai/system-evaluation/harness" >}}).
