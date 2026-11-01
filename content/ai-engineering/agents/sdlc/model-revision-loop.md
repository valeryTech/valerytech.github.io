---
draft: false
toc: true
title: "Testing and Revising the Working Model"
description: "A loop for the working model of engineering work with assistants: apply its concepts on real tasks, reflect on whether they helped, and revise the model, with what the loop needs to work."
linkTitle: "Model Revision Loop"
---

The notes in this folder and the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}) describe engineering work with software assistants: goals, the approach, activities, phases, and cycles, participants and substrates, processes, and coordination. This note calls that set of concepts the working model, because it's in use and it's expected to change. It describes a loop that applies the working model on real tasks, reflects on whether it helped, and revises it. The loop was added in step 22 of the Reasoning Log, after step 20 found that the model hadn't been tested yet.

## What the Working Model Is


The working model is the set of concepts we use to look at and plan engineering work with assistants. It lives in these notes:

- [Two Planes of Goals]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}})
- [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}})
- [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) and [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}})
- [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}) and [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}})
- [Coordination Mechanisms Between People and Agents]({{< ref "ai-engineering/agents/environment/coordination-mechanisms" >}})
- [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}), which describes how cases are collected

The concepts start as a vocabulary and as hypotheses about what helps. Grounded theory calls such concepts sensitizing concepts: they suggest where to look, and the cases decide whether they stay.

## Three Loops at Different Levels


What a task teaches can change three things, and each one has its own loop:

- **The task.** The problem-solving cycle inside the task changes what we do next in it.
- **The project's environment.** Learning across tasks changes `AGENTS.md`, commands, checks, and docs in one project, within the working model as it is. This is the ninth process in [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}).
- **The working model.** The model revision loop changes the concepts themselves, when cases show that a concept doesn't help, doesn't fit, or is missing.

The third loop changes the assumptions behind the other two, which is what double-loop learning means (Reflective Practice). It's slower: it needs several cases, often from more than one project. It's close to the cross-project loop of the Engineering Knowledge Loop, applied to our own concepts.

## The Loop


1. **Apply.** Use the working model on a real task: plan with it, label what happens with it, and decide with it where fixes belong. Note which concepts were used.
2. **Reflect on the model.** After the task, ask about the model as well as the task: which concepts helped notice, decide, or place something; which ones got in the way or cost more than they gave; which ones didn't fit what happened; and what happened that the model has no concept for.
3. **Compare across cases.** One case is local evidence. When several cases point to the same problem with a concept, the problem becomes a candidate change.
4. **Revise.** Keep, change, merge, split, or drop the concept, and record the change as a new step in the Reasoning Log, with the cases behind it. A concept that no case has used for a long time is a candidate for dropping.
5. **Apply the revised model** to the next tasks, and check whether the change helped.

## What the Loop Needs


- **A known set of notes.** The working model is the notes listed above, so it's clear which concepts are being tested.
- **Claims that a case can test.** Each concept needs to say what it's expected to help with, such as "independent checks catch mistakes that self-checks miss" or "the survey of the environment finds the gaps behind the first failures". A case can't confirm or contradict a concept without such a claim. The claims can be written as cases come in, so they don't all have to be written in advance.
- **A section on the model in each case record.** The case record in the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) has an item for it: which concepts were used, which helped, which didn't fit, and what had no concept.
- **A reflection after each task, and a review across cases.** The reflection is short and happens right after the task. The review compares cases and happens when several have been collected, for example after a few cases of one task type.
- **A record of the changes.** The Reasoning Log is the change history of the model: each revision is a new step that names its cases, and a note keeps its earlier version in an appendix when a comparison helps.
- **Signs of whether the model helps.** Signs that it helps: problems noticed earlier, fixes that don't have to be moved later, decisions that changed because of a concept, and fewer corrections by people. Signs that it doesn't: concepts nobody uses, time spent on the model that doesn't change any decision, and cases that keep needing words the model lacks.

## Open Questions


- How many cases are enough before a concept is revised. The [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) has the same question about generalizing.
- Whether the claims for each concept go into the concept's note or into one list.
- How to tell what the model changed. The same person uses the model and judges it, and no task is done both with and without it. Baseline tasks (step 21 of the Reasoning Log) give only a partial comparison.
