---
draft: false
toc: true
title: "Evaluating Engineering Work with Agents"
description: "How a team can tell whether its work with coding agents is any good and whether a change to its setup helps: why reading the setup can't show it, why hidden parameters hide the effect, and how to study a change with experiments."
linkTitle: "Evaluation"
---

Whether a change to the agent's setup helps shows only in agent behavior and in the work people do with the agent. These notes cover why that is hard to see and how to study it. For evaluating AI products in general, see [Evaluating AI Products]({{< ref "ai-engineering/evaluation" >}}).

## Notes in this section


- [Reasoning Log: Evaluating Engineering Work with Agents]({{< ref "ai-engineering/agents/evaluation/logs-evaluation" >}}): working notes on the problem in a developer's words, the first candidate questions, what a good result looks like for one kind of task, and why evaluating this system is harder than evaluating a chatbot.
- [Why It Is Hard to Tell Whether AGENTS.md Works]({{< ref "ai-engineering/agents/evaluation/agents-md-verification" >}}): reading the file and running static checks can't show whether it improves agent behavior. That takes behavioral evidence, which is costly and depends on the agent, model, repository, and task.
- [A Practical Way to Study Coding-Agent Improvements]({{< ref "ai-engineering/agents/evaluation/coding-agent-experimentation-primer" >}}): how to start from the engineering decision a study could change, form a hypothesis, choose a method, decide what counts as improvement, and interpret the results without overclaiming.

## Sections on evaluation in other notes


- [Problems in Engineering Work with Agents: Layer 3]({{< ref "ai-engineering/agents/problems/problems" >}}#layer-3-telling-whether-a-change-helps): the problems of telling whether a change helps, in five groups: saying what better means, finding the cause, many hidden parameters, telling whether one change helped, and telling whether it pays off.
- [Bottom-Up Approach: Many Parameters, Some of Them Hidden]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}#many-parameters-some-of-them-hidden): the result of a task depends on many parameters, some of them hidden, so the effect of one change is hard to tell. The section lists the parameters, compares the problem with the same problem in other fields, and describes what the approach does to make it smaller.
- [Features of a Good Approach: Look Back and Learn]({{< ref "ai-engineering/agents/sdlc/approach" >}}#look-back-and-learn): three practices for the last part of the problem-solving cycle: check the result independently of the explanation, revisit the decisions that depend on a failed assumption, and record what was learned where the next task will find it.
- [Task Types: Recording and Measuring by Task Type]({{< ref "ai-engineering/agents/sdlc/task-types" >}}#recording-and-measuring-by-task-type): where to label each piece of work with its task type, which measures to count per type, and how comparing work by people, by agents, and by people with agents on the same type shows whether agents help with it.
- [Reasoning Log, step 32: Not Knowing How to Evaluate the System]({{< ref "ai-engineering/agents/logs-reasoning" >}}#32-not-knowing-how-to-evaluate-the-system): the step where the gap was first named. The system's two improvement loops depend on telling whether a task went well, and no earlier step says how to tell.
