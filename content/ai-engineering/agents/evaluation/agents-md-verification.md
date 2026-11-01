---
draft: false
toc: true
title: "Why It Is Hard to Tell Whether AGENTS.md Works"
aliases:
  - "/ai-engineering/agents/agents-md/agents-md-verification/"
description: "Reading AGENTS.md and running static checks can't show whether the file makes the work better. Only the results of real tasks show it, and they also depend on the ticket, the person, the model and the setup, so the evidence is weak."
linkTitle: "Does It Work"
---

Review can tell whether `AGENTS.md` is clear and matches the project. Static checks can tell whether its links, commands, and paths exist and whether it stays within its length budget. Neither can tell whether the file makes the work better.

This is a case of a broader rule: [evaluating AI systems requires behavioral evidence]({{< ref "ai-engineering/approach/behavioral-evidence" >}}). How a system is built doesn't show how it behaves. For `AGENTS.md`, the instructions are what reviewers read, and the results of the work are what need to be evaluated.

{{< callout context="caution" title="Core problem" icon="outline/alert-triangle" >}}
Review and static checks can show that `AGENTS.md` is correct as a document. They can't show what it does to the work. That takes watching real tasks. Telling whether the file caused a difference takes comparing tasks with and without the instruction, which is hard when tasks are few and don't repeat.
{{< /callout >}}

## Reading doesn't show it


Review can check whether the instructions are accurate, clear, and consistent with the project. It can't tell whether agents follow the instructions, need them, or do better because of them. An instruction can look sound and change nothing.

Shared [design rules]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#the-rules) make reviews more consistent. They still can't show whether the instructions help.

## Static checks don't show it


Static checks can verify properties of the file and its references:

- Links resolve.
- Referenced commands and paths exist.
- The file stays within its length budget.
- The file doesn't repeat the docs or rules that a check already enforces.

These checks find stale references and some redundant content. They say nothing about what the file does in a session.

## Only the results of the work show it


The file's effect shows in what happens on real tasks:

- **What the agent did:** which files it read, which commands it ran, and whether it followed the instruction.
- **The result:** whether the change was correct and was accepted.
- **People's effort:** how much time people spent preparing the task, steering the agent, reviewing its work, and correcting it.
- **What happened later:** whether the code stayed easy and safe to change.

The agent is one part of what produces these results. The same file gives a different result with a better ticket, a different person steering, or a new model version. So one good or bad result says little about the file ([Why it's harder than evaluating a chatbot]({{< ref "ai-engineering/agents/evaluation/logs-evaluation" >}}#why-its-harder-than-evaluating-a-chatbot)).

Telling whether the file caused a difference is harder still. A team has a few tasks a week, and each one is different. The same task run twice gives two different results. The model, the harness, and the rest of the setup change in the same weeks, and some of these changes nobody records. [Many Parameters, Some of Them Hidden]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}#many-parameters-some-of-them-hidden) describes this problem and what can be done about it.

## Consequences


These consequences appear as problems 48 to 50 in [Problems in Engineering Work with Agents]({{< ref "ai-engineering/agents/problems/problems" >}}#telling-whether-one-change-helped).

- **Decisions about the file rest on weak evidence.** When an instruction has no visible effect, it may be redundant, ignored, unclear, or irrelevant to the tasks that were watched. Each explanation calls for a different response: remove the instruction, rewrite it, or keep it. The evidence usually can't tell them apart, so nobody knows which lines still do something.
- **The file grows.** Without evidence, keeping an instruction feels safer than removing it. A line added after a mistake stays, though nobody knows whether it did anything.
- **The effect of a rewrite stays unknown.** After the file is rewritten or reorganized, the next task may go well because of the rewrite or because the task was easy.

## What helps


- **Treat each instruction as a hypothesis.** When adding a line, record the behavior it's meant to change and how that change would show. Keep the line only if cases show that it helps ([Make every added structure prove its value]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}#sandbox-first-capability-discovery)).
- **Prefer enforceable rules.** When possible, put a requirement in a lint rule, a test, or a CI check that finds violations automatically ([Prefer enforcement over prose]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#prefer-enforcement-over-prose)). For an instruction that can't be enforced, name what would show that it was followed, such as the commands the agent ran or the files it changed.
- **Use static checks for what they can check.** Check references, length, and stale or repeated content. Passing them isn't evidence that the instructions help.
- **Record the setup with each task.** Note the model and harness versions, the commit of the agent setup, the task type, and who ran the session, so that a later difference can be traced.
- **Compare within one task type, and repeat.** When a change is worth the effort, compare results with and without the instruction on several tasks of the same type ([A Practical Way to Study Coding-Agent Improvements]({{< ref "ai-engineering/agents/evaluation/coding-agent-experimentation-primer" >}})). With a few tasks a week, only large effects will show.
- **Check again after the model or the harness changes.** An instruction that helped with one model can do nothing with the next.
