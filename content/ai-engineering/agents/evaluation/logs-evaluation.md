---
draft: false
toc: true
title: "Reasoning Log: Evaluating Engineering Work with Agents"
aliases:
  - "/ai-engineering/agents/logs-evaluation/"
description: "Working notes on how a team can tell whether its work with coding agents is any good: the problem in a developer's words, first candidate questions, what a good result looks like for one kind of task, and why it's hard."
linkTitle: "Evaluation Log"
---

This log records the thinking on how to evaluate engineering work with agents. The steps keep the discussion in the order the thoughts came up. New steps go after the last one.

The thing being evaluated is the whole system. The agent is one part of it.

The problems collected in this log are listed, without the discussion, in [Problems in Engineering Work with Agents]({{< ref "ai-engineering/agents/problems/problems" >}}).

The general evaluation framework is in [AI Evaluation]({{< ref "ai-engineering/evaluation/framework-v2" >}}). The log continues step 32 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}).

## The Problem


We've set up an agent on our repository. There's an `AGENTS.md`, a few skills, some hooks, and commands that run the checks. Then someone asks, "Is it any good?" Nobody can answer. What we have is "it felt better this week" and a list of merged pull requests.

The same happens after every change. I rewrite a section of `AGENTS.md`, the next task goes well, and I can't tell whether the rewrite helped or the task was easy.

## What a Developer Wants to Know


1. I hand the agent a ticket. Does the pull request come back ready to merge, or do I spend an hour fixing it?
2. When it's wrong, how is it wrong? Did it solve the wrong problem, break something else, write tests that test nothing, ignore our conventions, or touch files it shouldn't?
3. I changed `AGENTS.md` or added a skill last week. Did that help?
4. A new version of the model or the harness came out. Is it the same, better, or worse on our repository?
5. Can I leave the agent alone for half an hour on this kind of task, or do I have to watch it?
6. Two weeks later, does anyone understand the code it wrote? Did it cause a bug?

## What a Good Result Looks Like


"Make the agent handle tickets better" can't be checked. Better how, and for which tickets? Before looking at any pull request, we have to say what a good result is for one kind of task in our repository, as a list that someone can tick off.

For a bug fix, the list could be:

- the bug was reproduced before anything was changed;
- the fix is in the layer where the bug is, and it doesn't guard the symptom somewhere else;
- a new test fails without the fix and passes with it;
- the existing tests pass, and none of them was weakened or deleted;
- the diff contains only what the fix needs;
- the pull request says what was checked and what wasn't.

For a small feature, the list adds that the change matches the acceptance criteria in the ticket, and that a decision about the API or the schema was made by the person who owns it.

For an investigation, the list is different: the question has an answer, the answer cites the files, logs, or queries it came from, and it says what is still unknown.

Some lines are about the agent, and some are about us. "The ticket had acceptance criteria" is on me. "The migration check ran in CI" is on the pipeline. "I read the plan before the agent started editing" is on me again. They all belong on the list, because the result depends on all of them.

A quick test for each line: could two of us look at the same pull request and agree whether the line holds? If we couldn't, the line is still vague.

## Why It's Harder Than Evaluating a Chatbot


- **We can't run the same ticket a hundred times.** There are a few tasks a week, and each one is different.
- **The result depends on the person.** The same agent gives a different result when I write a better ticket or stop it at the right moment.
- **There are many correct fixes.** We can't compare the diff with a reference answer.
- **Green tests don't mean the change is right.** The agent often writes the tests from the same wrong idea as the code ([Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}})).
- **A good pull request can come out of a bad session.** The agent may have tried three wrong things first, or I may have corrected it five times.
- **The model and the harness change under us.** The vendor updates them, and last month's results may no longer hold.
- **Some problems show up weeks later:** code that's hard to change, or a change that nobody on the team can explain.
