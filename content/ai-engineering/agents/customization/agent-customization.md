---
draft: false
toc: true
title: "Agent Customization"
description: "The layer between the harness and the project: the text the model reads, the settings the harness applies, the code it runs, and the bundles that combine them, shared across projects and managed like an application's configuration."
linkTitle: "Agent Customization"
---

This note describes the part of the agent setup that a team creates, shares, and assembles for its agents: instructions, skills, prompts, settings, hooks, plugins, agent roles, workflows, and packages. It calls this part the *agent customization*. The layer was proposed in step 30 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}) under the name agent configuration, adopted in step 31, which moved these parts out of the [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}), and renamed in step 35, which also sorted its parts into four kinds.

## Why a Separate Layer


The VS Code documentation separates the harness, the software that runs a session, from the model, from the access to the model, from the execution environment, and from the *agent role*, which it describes as the instructions, tools, and behavior that apply to a task. Changing the role doesn't replace the harness ([VS Code docs a](#vscode-harnesses)).

Until step 31, agent roles, skills, instruction files, and harness settings were parts of the [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}), and some of them sat on the boundary with the harness. They differ from the other parts of the environment in three ways:

- **They're about the agents.** The code, the project knowledge, the commands, and the checks serve any participant, people included. Roles, skills, and policies shape what an agent does.
- **They're reused across projects.** A reviewer role, a skill for testing a change, or a permission policy can serve many projects, and an organization can share them with every team.
- **They're written for a harness and assembled.** Each harness reads them from its own folders and formats, and what a session loads is assembled from several layers, from the organization down to the person and the task.

They're also not a method. Diaz et al. put specifications and working practices into what they call the methodological harness ([Diaz et al. 2026](#diaz-2026)). Roles, skills, and policies are what a team writes, versions, shares, and manages to shape how fixed software behaves, the way it manages the configuration of an ordinary application. The working practices stay in the Agent Development Environment.

## Four Kinds of Parts


The parts differ in what the harness does with them. Some are text the harness puts into the model's context, some are settings the harness applies, some are code the harness runs, and some combine the other three:

| Kind | Parts | What the harness does with them | Whether it holds when the agent doesn't follow it | Examples |
|---|---|---|---|---|
| Text the model reads | Instructions, skills, saved prompts and commands, the prompts of agent roles | Puts the text into the context, in every session or when it's needed | Guidance | `AGENTS.md`, `CLAUDE.md`, `.claude/skills/`, `.agents/skills/`, VS Code prompt files, Droid's `.factory/commands/` |
| Settings the harness applies | Permission rules, modes and autonomy levels, sandbox settings, model and reasoning effort, the tools each role may use, connections to MCP servers | Enforces the rules and changes how it behaves | Rule, for actions through the harness's own tools; the sandbox confines every command | `.claude/settings.json`, `.codex/config.toml`, `.codex/rules/`, Droid's `permissionRules`, `.mcp.json` |
| Code the harness runs | Hooks, plugins that change behavior, custom tools | Runs the code at its extension points | Rule, as long as the code itself doesn't fail | Hooks in Claude Code, Codex, and Droid; OpenCode plugins and custom tools; Pi extensions |
| Bundles | Agent roles, runnable workflows, packages | Loads the parts each bundle holds | Each part holds as its own kind does | VS Code custom agents in `.github/agents/`, Claude Code subagents in `.claude/agents/`, Droid custom droids in `.factory/droids/`, VS Code agent plugins, Claude Code plugins |

Only the second kind is configuration in the narrow sense: values the harness reads and applies. The third kind is the *extend* level of [Choosing and changing the harness]({{< ref "ai-engineering/agents/environment/ade" >}}#choosing-and-changing-the-harness), code the team writes and maintains. The first kind is closer to documents. The harness only places the text, and the agent weighs it. The fourth kind is how the others are combined for a task and shared.

The kinds also differ in who they reach. Text in `AGENTS.md` reaches every harness that reads it, while most settings, code, and bundles are written for one harness. [What a Team Can Set in a Harness It Doesn't Change]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}) gives each part's properties in Claude Code, Codex, and Droid.

### Text the Model Reads


The root `AGENTS.md` is the entry point. It loads in every session, reaches every harness that reads it, and is guidance the agent weighs. So it holds only what the agent can't get by itself and most sessions need: the project's purpose and stage, its sources of truth, what done means, and its hard constraints and defaults. It points to the rest, such as the docs, the command catalog, and the task directory in the Agent Development Environment. The harness lists the skills itself, so the root file doesn't need to name them. A project's root file can be assembled from a shared template and the project's own lines.

Nested files hold guidance for one folder, and each harness loads them at a different moment ([Instructions the Harness Loads]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}#instructions-the-harness-loads)). Tool-specific files, such as `CLAUDE.md`, import the shared core ([Keep one core for all agents]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#keep-one-core-for-all-agents)). [Designing the Root AGENTS.md]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}) gives the design rules for the root file. User-level files, such as `~/.codex/AGENTS.md` and `~/.claude/CLAUDE.md`, hold one person's instructions for every project.

Skills hold the instructions for one type of task, such as how to test a change, how to set up a new service, or how to review a branch. Their names and descriptions are in the context of every session, and their instructions load when a task needs them, so they keep the root file short. Most skills are guides. A skill with review instructions is a sensor, and a skill that comes with a script combines an inferential and a computational guide ([Böckeler 2026](#bockeler-2026)). A skill works only when the agent recognizes that a task needs it, so a procedure that has to run every time belongs in a command or a check.

The skill folders differ between harnesses ([Knowledge the Agent Loads When It Needs It]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}#knowledge-the-agent-loads-when-it-needs-it)). For knowledge that every project shares, `agent-docs` is another way: every agent reads the same files without installing them as skills ([Shared agent docs]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#shared-agent-docs)).

Saved prompts and commands are text the person invokes, so they take context only when the person runs them. Some harnesses also let the settings replace the system prompt, such as Codex's `model_instructions_file` and an OpenCode agent defined in Markdown. The replaced prompt is text the model reads, but it changes a part the harness owns, and the team has to keep it in step with the harness's tools ([What the Harness Fixes]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}#what-the-harness-fixes)).

### Settings the Harness Applies


Settings are what one harness reads and applies: permission rules that allow, ask for, or deny an action, the default mode or autonomy level, sandbox settings for files and the network, the model and the reasoning effort, the tools each role may use, and connections to MCP servers. The harness enforces the rules for actions through its own tools, and the sandbox confines every command. Text in an instruction file enforces none of these limits ([Access]({{< ref "ai-engineering/agents/environment/ade" >}}#access)).

An MCP server can be a tool in the Agent Development Environment, while each harness's connection to it is a setting. The connection decides which of the server's tools the agent sees, and their descriptions take context in every session unless the harness defers them ([Tools and Commands]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}#tools-and-commands)).

### Code the Harness Runs


Hooks are commands the harness runs at events, such as before a tool call, after a tool call, or at the end of a turn. A hook before a tool call can block it, a hook after an edit can run the formatter or the linter, and a hook at the end of a turn can keep the agent working until the checks pass ([Checks on Results]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}#checks-on-results)). A hook's settings belong to one harness, and the command it runs belongs to the command layer of the Agent Development Environment, so the same check can run from several harnesses ([Command layer]({{< ref "ai-engineering/agents/environment/ade" >}}#command-layer)).

Plugins and custom tools go further. OpenCode loads plugins from `.opencode/plugins/` and custom tools written in TypeScript, and a custom tool with the name of a built-in tool replaces it. Pi's extensions can add or replace tools, rewrite tool calls, filter what the model sees, and take over context compaction ([Choosing and changing the harness]({{< ref "ai-engineering/agents/environment/ade" >}}#choosing-and-changing-the-harness)). This code works in one harness, and the team maintains it as the extension API changes.

### Bundles


Agent roles are subagents the team defines, each with its own instructions, tools, and model, working in a separate context. A role with read-only tools that reviews a change is a sensor that doesn't share the author's context, although it can share the author's blind spots when it runs the same model ([Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}})). Each harness reads role definitions from its own folder and in its own format. [Agent Roles and Participant Roles](#agent-roles-and-participant-roles) connects them to the roles of the participants.

A VS Code custom agent shows how much one role can hold. Its file has a name and a description, a list of tools, the subagents it may call, a model or an ordered list of models, a reasoning effort, skills, MCP servers, handoffs to other agents, hooks, and the instructions in its body ([VS Code docs b](#vscode-agent-file)). A Droid custom droid sets its prompt, tools, model, reasoning effort, and MCP servers ([Factory 2026a](#factory-2026-subagents)). So one role holds parts of all three other kinds.

Workflows appear in two places. The written workflow for a type of task, such as how a bug fix goes, is a working practice in the Agent Development Environment. The workflow that runs, such as a skill that calls an implementer role and then a reviewer role, is a bundle in the agent customization.

Packages bundle parts for installing and sharing them, such as VS Code agent plugins and Claude Code plugins. [Managing It Like the Configuration of an Application](#managing-it-like-the-configuration-of-an-application) describes how they're distributed.

## Agent Roles and Participant Roles


[Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}) describes participants by four responsibilities: who supplies information, who does the work, who judges the result, and who may commit it. Each agent role gets a level of autonomy for each type of action and a trigger that starts it ([Autonomy and Triggers for Agent Roles]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}#autonomy-and-triggers-for-agent-roles)). An agent role in the customization is how such a role becomes something a harness can run. Its instructions and skills say how it does the work, its tools and policies set what it may do, and its hooks and handoffs set when it acts and to whom it passes the work.

## Four Things Around a Session


| | Harness | Agent customization | Agent Development Environment | Execution environment |
|---|---|---|---|---|
| What it is | The software that runs a session | What turns the harness into the team's agents | The project and what it gives every participant | Where one session runs |
| Who makes it | The vendor, or the team for its own harness | The team, the organization, and each person | The team | The setup and the platform |
| Where it lives | Installed on the machine or in the platform | Shared repositories and packages, organization settings, and each project's repository for the project's own part | The project's repository | A machine, container, CI runner, or sandbox |
| How it's shared | Through releases | Across projects, through templates, packages, and organization settings | With the project | Not shared: each session has its own, or many tasks use one long-lived machine |
| How it changes | When the team upgrades it | When the team learns what helps its agents, and when the harness or the model changes | With the project | Through setup, and through what the agent and people do in it |

A session puts the four together: a version of the harness, the agent customization resolved for this project, this person, and this task, and a checkout of the Agent Development Environment, all in one execution environment.

## Managing It Like the Configuration of an Application


Teams already manage the configuration of ordinary applications: they keep it in version control, split it into layers, build it from templates, release it, check it, and watch for drift. The same practices fit the agent customization, for its text and code as well as its settings:

- **Layers and overrides.** The customization has layers, from the organization through the team and the project to the person and the session. VS Code has user, workspace, and organization levels, and the limits an organization sets on tools, MCP servers, and approvals can't be overridden by other customizations ([VS Code docs c](#vscode-customization)). In Droid, the organization's hard controls can't be weakened at lower levels, while the closest level wins for session defaults ([Factory 2026b](#factory-2026-hierarchy)).
- **Templates and assembly.** A project's `AGENTS.md` can be assembled from a shared template and the project's own lines, and a project's reviewer role from a shared base role and the project's instructions. The [python-repo-template](https://github.com/valery-judah/python-repo-template) and the shared `agent-docs` already share parts across projects this way ([Shared agent docs]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#shared-agent-docs)).
- **Packages and distribution.** VS Code agent plugins bundle skills, MCP servers, custom agents, instructions, hooks, and commands. They install from a marketplace, which is a Git repository with a catalog, and they can update automatically. An organization can require a plugin, and a GitHub organization can define custom agents that VS Code finds for every account with access to them ([VS Code docs d](#vscode-plugins); [VS Code docs b](#vscode-agent-file)).
- **Rendering for each harness.** The same role or skill goes into a different folder and format for each harness, and a shared location doesn't mean the harnesses behave the same ([VS Code docs e](#vscode-custom-agents)). One source can be written once and rendered for each harness, the way an application's configuration is rendered for each place it's deployed.
- **Versions and releases.** Each release of the customization gets a version and a record of what changed and why, and a bad release can be rolled back. The VS Code pages don't describe versions for single files.
- **Checks and tests.** Schema and link checks catch broken files and pointers. Code such as hooks and plugins also needs the tests any code needs. Behavior tests show the effect: baseline tasks without a part, and removing one part at a time ([Improving the environment]({{< ref "ai-engineering/agents/environment/ade" >}}#improving-the-environment)).
- **Drift.** A project's copy can fall behind the template, and the folders of different harnesses can disagree. Keeping them in sync is an open question in the ADE note ([Definitions and boundaries]({{< ref "ai-engineering/agents/environment/ade" >}}#definitions-and-boundaries)).

## What Moved Out of the Agent Development Environment


Step 31 moved instruction files, skills, agent roles, and harness settings from the Agent Development Environment to this layer. The Agent Development Environment keeps the code, project knowledge and task state, working practices and written workflows, commands and tools, checks, repository and platform settings, and setup definitions. The project's own part of the agent customization, such as its `AGENTS.md` and its `.claude/` folder, still lives in the project's repository, the way an application's settings for one deployment live next to that deployment.

## Names Considered


- **Agent customization**, the chosen name since step 35. VS Code uses it for the same set of parts: instructions, skills, custom agents, tools through MCP, hooks, prompt files, and plugins that bundle them, at the user, workspace, and organization levels ([VS Code docs c](#vscode-customization)). It covers text and code as well as settings. Step 30 turned it down because it suggests personal adjustments, but VS Code also uses it for what an organization requires.
- **Agent configuration**, the name in steps 30 to 34. It matches the practice of managing an application's configuration, but in its usual sense it covers only the settings, and the layer also holds text the model reads and code the harness runs. This note now uses *configuration* only for the settings, and for the practices of managing the layer.
- **Agent definitions.** It fits roles and skills, and fits policies and packages less well.
- **Methodological harness**, the term of Diaz et al. It covers practices and specifications, which stay in the Agent Development Environment.

## Open Questions


- Whether the project's own part of the agent customization counts as part of the Agent Development Environment, or only lives in its repository.
- How to write a role or a skill once and render it for several harnesses.
- How to version, release, and test a customization, and who approves a release.
- Where the agent customization sits among the substrates, which have the agent runtime, the Agent Development Environment, and the authority layer.
- Whether code the harness runs, such as plugins that replace tools or take over compaction, belongs in this layer or with the harness, since the team maintains it like a small fork.

## References


- Böckeler, B. (2026). [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html). martinfowler.com. ^bockeler-2026
- Diaz, J., Gayoso, J., Cimminio, A., and Perez, J. (2026). [Spec-Driven Development for Agentic Software Engineering: Harnessing Human-Agent Teamwork](https://arxiv.org/abs/2609.00252). arXiv:2609.00252. ^diaz-2026
- Factory (2026a). [Subagents](https://docs.factory.com/docs/harness/subagents). Droid documentation. ^factory-2026-subagents
- Factory (2026b). [Hierarchical Settings and Org Control](https://docs.factory.com/docs/enterprise/hierarchical-settings-and-org-control). Droid documentation. ^factory-2026-hierarchy
- VS Code docs (a). [Understand agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses). ^vscode-harnesses
- VS Code docs (b). [Custom agent file reference](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference). ^vscode-agent-file
- VS Code docs (c). [Customization concepts](https://code.visualstudio.com/docs/agents/concepts/customization). ^vscode-customization
- VS Code docs (d). [Agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins). ^vscode-plugins
- VS Code docs (e). [Custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents). ^vscode-custom-agents
