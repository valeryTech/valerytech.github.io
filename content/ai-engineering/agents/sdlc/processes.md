---
draft: false
toc: true
title: "Processes Derived from the Goals and the Participants"
description: "How work is coordinated across people, coding agents, and automated checks: what multi-participant work adds on top of individual reasoning, which features of the participants and the work make the goals hard, and ten processes derived from them."
linkTitle: "Processes"
---

This note derives the processes of engineering work with agents from what the work needs to achieve and from the features of the participants who do it. Where [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}) describes how to reason through a problem--even when one person works alone--this note describes what has to happen once the work is shared across people, stateless agents, and automated checks. A process exists here because a goal can't be reached without it, given how those participants and the work behave. The note started as step 18 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}) and gained its tenth process in step 34.

## What We Need to Achieve


[Two Planes of Goals]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}) asks how software assistants can help people carry out engineering workflows without people giving up understanding and ownership. The processes serve the two engineering goals of Plane 1 and two conditions for reaching them with assistants:

- **Results that hold:** the system, and the findings and decisions behind it, are right and keep holding in real use.
- **Understanding and ownership:** people can explain what the system does and why, and they own the decisions about it.
- **Cheap deliberate work:** framing, checking, and comparing options cost less than generating and accepting. Without this, people fall back on the shortcut ([Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}})).
- **A better next task:** each task leaves the environment and the project's knowledge closer to reality, so later work gets cheaper and more dependable.

The first two are the two outputs of [engineering workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}), and a result holds when it meets the product goals of Plane 1: solving the right problem with behavior people can rely on. The Plane 2 goals describe what the agent setup and the substrates have to provide so these processes can run.

## Features of the Participants and the Work That Bear on the Goals


The participants are described in [Participants and Substrates]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}). These features of the participants and of the work make the goals hard to reach:

- **People** hold the intent, the unwritten context, the authority, and the accountability. Their time and attention are scarce, so reviewing everything turns into rubber-stamping. Their understanding of the system fades when they stop doing the work themselves.
- **Agents** produce quickly and cheaply, and their capability keeps growing. By default they follow a single path: they take the first plausible reading and treat assumptions as facts ([Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}})). They remember nothing between sessions, and their context window is only a view of the shared state. They can hold permissions but not accountability, and a checker agent running the same model can share the author's blind spots. Their behavior isn't fixed: the same task can give a different result on another run, with another person steering, or after the vendor updates the model, and they follow a written instruction only some of the time. They can take any text they read as an instruction, including text from outside the project.
- **Automated checks** are cheap, fast, and repeatable, and each one covers only the properties it was written for. They can't judge intent or trade-offs.
- **The work** is different in every task, so two results are hard to compare. Some effects show only weeks later. Its value is hard to count: what is easy to count, such as lines of code and pull requests, isn't what the team cares about. What's written grows with each change unless someone trims it: the code, the docs, and the agent setup. The result of a task depends on many things at once--the ticket, the person steering, the agent customization, the harness, the model, and what was in context--some of which can't be seen, and changing one changes how the others behave ([Features behind the Problems in Work with Agents]({{< ref "ai-engineering/agents/problems/problem-features" >}}); [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}#many-parameters-some-of-them-hidden)).

## How Processes Differ from the Approach


When one engineer works alone, the [Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}) covers how to think through the task: frame, choose, act, and look back. Splitting the work across people, agents, and checks changes two things:

- **Six reasoning practices become handoffs or gates between participants:** stating what's known and assumed becomes *grounding* unwritten human intent in shared state (#1); working in small checked steps becomes *producing with self-checks* before handing off (#3); checking results becomes *independent judging* by a participant whose failures don't share a cause with the author's (#4); making explicit choices becomes *deciding and committing* through accountable owners (#5); revisiting broken assumptions becomes *repairing breakdowns* across participants (#8); and recording lessons becomes *learning across tasks* in the environment because agents forget (#9).
- **Four new coordination jobs appear that don't arise in solo work:** *allocating work and autonomy* (#2), *keeping understanding* when people don't write all the code (#6), *keeping continuity* outside session memory (#7), and *checking whether a change helped* across noisy runs and hidden parameters (#10).

## Ten Processes


Each process answers a place where a goal meets a feature of the participants or of the work. The numbering is kept fixed because other notes refer to processes by number.

### Setting Up and Checking One Task


1. **Grounding.** People hold the intent and unwritten context, and agents fill gaps with guesses. So intent, context, and constraints move from the people who hold them into task state, and someone confirms that the agent understood them before later work depends on them. Serves *results that hold* (cf. Approach #1-2).
2. **Allocating work and autonomy.** Agents are fast and cheap but can't answer for results, and people's time is scarce. So each task sets who does which part and how far an agent may go on its own, based on capability, consequence, reversibility, and how checkable the result is ([Task Types: Delegation Profiles]({{< ref "ai-engineering/agents/sdlc/task-types" >}}#delegation-profiles)). Serves *cheap deliberate work*.
3. **Producing with self-checks.** Automated checks are cheap and fast. So whoever does the work runs them as it goes and fixes what they catch before anyone else judges the result. Serves *cheap deliberate work* and *results that hold* (cf. Approach #7).
4. **Independent judging.** An author's own checks can repeat the author's mistake. So consequential results are judged by a participant whose failures don't share a cause with the author's, with evidence and a statement of what wasn't checked ([Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}})). Serves *results that hold* (cf. Approach #8).
5. **Deciding and committing.** Agents can't be accountable, and some effects can't be undone. So decisions that belong to people, and actions at commitment points, go to the person with authority, who answers for them. Serves *understanding and ownership* and *results that hold* (cf. Approach #6).

### Protecting Understanding and State Across Handoffs


6. **Keeping understanding.** People's understanding fades when agents write the code, and attention is limited. So people take part where it counts: they form their own view at real decision points, see what changed and why, and keep doing enough direct work to stay grounded in the system. Serves *understanding and ownership*.
7. **Keeping continuity.** Agents remember nothing between sessions, and work passes between participants. So task state lives outside any participant's memory, and each handoff carries what the next participant needs. Serves *results that hold* and *cheap deliberate work*.
8. **Repairing breakdowns.** Participants make mistakes, and assumptions fail. So a breakdown is noticed, made visible across participants, and traced back to the decision that depended on it, rather than patched locally. Serves *results that hold* (cf. Approach #9).

### Improving the Setup Across Tasks


9. **Learning across tasks.** Agents don't learn between sessions. So what a task taught goes into lasting knowledge, checks, commands, skills, or `AGENTS.md`, and autonomy rises or falls with evidence, including production findings and errors that review missed. Serves *a better next task* (cf. Approach #10).
10. **Checking whether a change helped.** Every task differs, value is hard to count, agent behavior varies across runs, and results depend on many interacting parameters, some hidden. So one good task after a change proves little. A change to the environment, agent customization, model, or harness states what should improve and for which [task type]({{< ref "ai-engineering/agents/sdlc/task-types" >}}). Results of that type are recorded with their setup and compared before and after, and the change stays only if they improved ([Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}})). Serves *a better next task*.

## Views of the Processes


These ten processes describe **what has to happen and why**. Two other views describe the same processes from different sides:

- **The collaboration view** describes the moves inside each process: informing, contributing, assessing, committing, and recording, and moving responsibility between participants through a handoff, escalation, takeover, or return of control.
- **The environment view** describes what the setup has to provide for each process to run; the six Plane 2 goals in [Two Planes of Goals]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}) give that view.

These ten processes also replace the earlier four nested loops from step 7 of the Reasoning Log (kept in the appendix of [Participants and Substrates]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}})): the *framing loop* maps to grounding, allocating, and deciding (1, 2, 5); the *session inner loop* maps to producing with self-checks and keeping continuity (3, 7); the *verification middle loop* maps to independent judging, committing, and repairing breakdowns (4, 5, 8); and the *maintenance outer loop* maps to learning across tasks and checking whether a change helped (9, 10).
