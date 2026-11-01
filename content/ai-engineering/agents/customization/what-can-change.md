---
draft: false
toc: true
title: "What a Team Can Change Around an Agent Session"
description: "Everything a team can change that affects an agent session, from the task, the model and the harness to the agent customization, the environments, the authority layer and the participants, and where each kind of change belongs."
linkTitle: "What Can Change"
---

The result of an agent session depends on more than the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}). The task, the model, the harness, the project, the machine the session runs on, and the people involved all affect it, and a team can change each of them. This note lists them in one place and points to the notes that describe each part. It was written in step 36 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}), after step 35 sorted the agent customization into four kinds of parts and left the other parts unlisted.

## The Parts


| Part | What a team can change | Who changes it | How long a change lasts | Where it's described |
|---|---|---|---|---|
| The task | The request, the brief or specification, the examples and context given with it, the plan, and the handoff | The person who starts the task, and the agent as it works | One task | [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}), [Task directory]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#task-directory) |
| The model | Which model, the reasoning effort, and the access to it, such as the provider and the limits | The person, a role's settings, or the organization | Every session that uses it, until the next version | [Settings the Harness Applies]({{< ref "ai-engineering/agents/customization/agent-customization" >}}#settings-the-harness-applies) |
| The harness | Which harness and which version, and its own code: configure, extend, fork, or build | The team that chooses it; the vendor for each release | Until the next release or the next change to a fork | [Choosing and changing the harness]({{< ref "ai-engineering/agents/environment/ade" >}}#choosing-and-changing-the-harness), [What a Team Can Set in a Harness It Doesn't Change]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}) |
| The agent customization | Text the model reads, settings the harness applies, code the harness runs, and the bundles that combine them | The organization, the team, and each person | Until the next release of the customization | [Agent Customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}) |
| The Agent Development Environment | The code, project knowledge and task state, working practices and written workflows, the command layer and tools, checks, and setup definitions | The team | With the project | [What the environment contains]({{< ref "ai-engineering/agents/environment/ade" >}}#what-the-environment-contains) |
| The execution environment | The machine or container, the workspace in it, the isolation around it, and the credentials there | The setup and the platform, from the team's setup definitions | One session or task, or one long-lived machine | [Where Coding Agents Run]({{< ref "ai-engineering/agents/environment/where-agents-run" >}}), [How Coding Agents Set Up and Restrict Their Environment]({{< ref "ai-engineering/agents/environment/environment-controls" >}}) |
| The authority layer | Branch protection, required review, CI gates, deploy rights, and the scope of credentials | The team and the organization | Until the rule is changed | [Contributions, Effects, and Commitment Points]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}#contributions-effects-and-commitment-points) |
| The participants | Who supplies information, who does the work, who judges the result, and who may commit it; each agent role's autonomy and trigger; how people steer a session while it runs | The team, and the person in each session | Until the team changes the roles; steering lasts one session | [Roles]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}#roles), [Autonomy and Triggers for Agent Roles]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}#autonomy-and-triggers-for-agent-roles) |

The rows overlap in a few places. Task state is kept in the Agent Development Environment, in the task directory. Permission rules are settings in the agent customization, while the places where they're enforced belong to the authority layer. An MCP server can be a tool in the Agent Development Environment, while each harness's connection to it is a setting in the agent customization.

## How the Parts Differ


The parts differ in four ways that decide what a change can do:

- **Who makes the change.** The team makes most changes, but two parts change without it: the vendor releases new versions of the harness, and the provider releases new versions of the model. Either can change the agent's behavior when nothing in the project changed.
- **Who it reaches.** A change to the Agent Development Environment or the authority layer reaches every agent and every person. A change to the agent customization mostly reaches one harness, except `AGENTS.md` and skill folders that several harnesses read. A change to the task reaches one task.
- **Whether it holds when the agent doesn't follow it.** Text in the task, in the agent customization, and in project knowledge is guidance the agent weighs. Settings, hooks, the sandbox, and the authority layer hold whatever the agent decides. [Three Properties That Decide Where Something Goes]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}#three-properties-that-decide-where-something-goes) gives this property for each part of a harness.
- **How much work it takes.** Changing the task or a setting takes minutes. Writing a skill, a check, or a command takes longer and pays back over many tasks. Forking or building a harness makes the team responsible for maintaining it.

## Where a Change Belongs


The notes already give a few rules for choosing the part:

- **Put a capability in the Agent Development Environment when it can work there**, as a command, a check, or a document, so it reaches every agent and every person. Put it in the harness only when it depends on the agent loop: when it runs, what the model sees, or what the agent may do ([Choosing and changing the harness]({{< ref "ai-engineering/agents/environment/ade" >}}#choosing-and-changing-the-harness)).
- **Put a limit where it holds.** Text in an instruction file enforces nothing ([Access]({{< ref "ai-engineering/agents/environment/ade" >}}#access)). A limit that has to hold goes into a permission rule, the sandbox, or a hook, and a limit on what becomes shared or has an effect outside the workspace goes into the authority layer ([Contributions, Effects, and Commitment Points]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}#contributions-effects-and-commitment-points)).
- **Keep the root `AGENTS.md` for what most sessions need** and the agent can't get by itself, and put the rest in skills, docs, and the task.
- **Keep what one task needs in the task.** What's worth keeping moves from task state into lasting knowledge when the task ends ([Lasting Knowledge and Task State]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}#lasting-knowledge-and-task-state)).

## Telling Whether a Change Helped


A change to any of these parts should say what should get better and for which task type, and it stays only if results of that type got better. This is the tenth process in [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}), and it applies to the versions of the model and the harness as well as the team's own changes. [Why It Is Hard to Tell Whether AGENTS.md Works]({{< ref "ai-engineering/agents/evaluation/agents-md-verification" >}}) describes why the evidence for one part, `AGENTS.md`, is costly.

## Open Questions


- Who owns the budgets for time, tokens, and compute? [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}#contributions-effects-and-commitment-points) notes that the model doesn't say yet, and the budgets could be one more part a team changes.
- How does the team notice that a new version of the model or the harness changed the agent's behavior, when it made no change of its own?
- When a problem comes back, which part should the team change first? The rules above say where a change belongs once it's chosen, and not which part to look at first.
