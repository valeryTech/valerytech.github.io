---
draft: false
toc: true
title: "Processes Derived from the Goals and the Participants"
description: "What the processes of engineering work with agents need to achieve, which features of people, agents, automated checks, and the work make that hard, and ten processes derived from where a goal meets such a feature."
linkTitle: "Processes"
---

This note derives the processes of engineering work with agents from what the work needs to achieve. It doesn't start from a list of loops or steps. It starts from the goals, then looks at the features of the participants that make those goals hard to reach, and derives the processes from the places where a goal meets such a feature. A process exists because a goal can't be reached without it, given how people, agents, and checks work. The note was extracted from step 18 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}).

## What We Need to Achieve


[Two Planes of Goals for Engineering Work with Assistants]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}) asks how software assistants can help people carry out the whole engineering workflow without people giving up understanding and ownership. The processes serve the two engineering goals of Plane 1 and two conditions for reaching them with assistants:

- **Results that hold:** the system, and the findings and decisions behind it, are right and keep holding in real use.
- **Understanding and ownership:** people can explain what the system does and why, and they own the decisions about it.
- **Cheap deliberate work:** framing, checking, and comparing options cost less than generating and accepting. Without this, people fall back on the shortcut.
- **A better next task:** each task leaves the environment and the project's knowledge closer to reality, so the work gets cheaper and more dependable over time.

The first two are the two outputs of the [engineering workflow]({{< ref "ai-engineering/agents/sdlc/workflows" >}}), and a result holds when it meets the product goals of Plane 1: it solves the right problem with behavior people can rely on. The other two are conditions for reaching them with assistants. The Plane 2 goals describe what the agent roles and the substrates give the processes.

## Features of the Participants and the Work That Bear on the Goals


The participants are described in [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}). These are their features, and features of the work itself, that make the goals hard to reach:

- **People** hold the intent, the unwritten context, the authority, and the accountability. Their time and attention are scarce, so reviewing everything turns into rubber-stamping. Their understanding of the system fades when they stop doing the work themselves.
- **Agents** produce quickly and cheaply, and their capability keeps growing. By default they follow a single path: they take the first plausible reading and treat assumptions as facts ([Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}})). They remember nothing between sessions, and their context window is only a view of the shared state. They can hold permissions but not accountability, and a checker agent running the same model can share the author's blind spots. Their behavior isn't fixed: the same task can give a different result on another run, with another person steering, or after the vendor updates the model, and they follow a written instruction only some of the time. They can take any text they read as an instruction, including text from outside the project.
- **Automated checks** are cheap, fast, and repeatable, and each one covers only the properties it was written for. They can't judge intent or trade-offs.
- **The work** is different in every task, so two results are hard to compare. Some of its results show only weeks later. Its value is hard to count: what can be counted, such as lines of code and pull requests, isn't what the team cares about. What's written grows with each change unless someone works against it: the code, the docs, and the agent setup. The result of a task depends on many things at once: the ticket, the person steering, the agent setup, the harness, the model, and what was in the context. Some of them can't be seen, and the effect of changing one depends on the others.

The features of the work and the last two features of agents were added after the first nine processes were derived. They come from [Features behind the Problems in Work with Agents]({{< ref "ai-engineering/agents/problems/problem-features" >}}), which traces a list of problems back to such features. Four of them make it hard to tell whether a change to the environment helped: every task is different, the value of the work is hard to count, an agent's behavior isn't fixed, and the result of a task depends on many things, some of them hidden. The tenth process answers them. The last of the four was added after the tenth process, and the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}#many-parameters-some-of-them-hidden) describes it.

## Ten Processes


Each process answers one place where a goal meets a feature of the participants or of the work:

1. **Grounding.** People hold the intent and the unwritten context, and agents fill gaps with guesses. So intent, context, and constraints have to move from the people who hold them into task state, and someone confirms that the agent understood them, before other work depends on them. It serves results that hold.
2. **Allocating work and autonomy.** Agents are fast and cheap but can't answer for results, and people's time is scarce. So each task needs a decision about who does which part and how far an agent may go on its own, based on capability, consequence, reversibility, and how well the result can be checked. It serves cheap deliberate work.
3. **Producing with self-checks.** Automated checks are cheap and fast. So whoever does the work checks it with them as it goes and fixes what they catch before anyone else judges it. It serves cheap deliberate work and results that hold.
4. **Independent judging.** An author's own checks can share the author's mistakes. So important results are judged by a participant whose failures differ, with evidence and a statement of what wasn't checked. It serves results that hold.
5. **Deciding and committing.** Agents can't be accountable, and some effects can't be undone. So the decisions that belong to people, and the commitments at commitment points, go to the person with the authority, who answers for them. It serves understanding and ownership, and results that hold.
6. **Keeping understanding.** People's understanding fades when agents do the work, and their attention is limited. So people take part where it counts: they form their own view at real decision points, they see what changed and why, and some work stays with the people who need to learn from doing it. It serves understanding and ownership.
7. **Keeping continuity.** Agents remember nothing between sessions, and work passes between participants. So the state of a task lives outside any participant's memory, and each handoff carries what the next participant needs. It serves results that hold and cheap deliberate work.
8. **Repairing breakdowns.** Participants make mistakes, and assumptions fail. So a breakdown is noticed, made visible, and traced back to the decision that depended on it, and the work is planned again from there. It serves results that hold.
9. **Learning across tasks.** Agents don't learn between sessions. So what a task taught is written into lasting knowledge and the environment, and autonomy is adjusted based on evidence, including evidence from production and errors that judging missed. It serves a better next task.
10. **Checking whether a change helped.** Every task is different, the value of the work is hard to count, an agent's behavior isn't fixed, and the result depends on many things at once, some of them hidden. So one good task after a change shows little. A change to the environment, to the agent customization, or to the version of the model or the harness says what should get better and for which task type. Each result is recorded with the setup it came from, so a later difference can be traced. Results of that type are compared before and after, and the change stays only if they got better. It serves a better next task.

The tenth process was added in step 34 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}), after the first nine. Its method is in two other notes: the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) compares cases of the same task type and tests each change on new tasks, and [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}#recording-and-measuring-by-task-type) labels work by type and counts measures per type. Three things stay open: a small team may have too few tasks of one type to tell a pattern from chance, nothing runs a fixed set of tasks again after the vendor updates the model or the harness, and whether the whole setup pays off is a wider question than one change.

## Views of the Processes


These processes are one view: what has to happen and why. The collaboration view describes the steps inside each process: informing, contributing, assessing, committing, and recording, and moving a responsibility to another participant through a handoff, an escalation, a takeover, or a return of control. For example, grounding is mostly people informing and checking the agent's restatement, and deciding and committing is an owner assessing and committing. A third view describes what the environment gives each process; the Plane 2 goals in [Two Planes of Goals]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}) are a first version of it. The four loops in [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}) can be compared with these processes once the processes are settled.
