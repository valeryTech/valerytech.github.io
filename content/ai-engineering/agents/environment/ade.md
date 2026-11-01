---
draft: false
toc: true
title: "Agent Development Environment"
description: "A proposed term for the project and what it gives the people and agents working in it, described as feedforward and feedback controls, and separated from the harness, the agent customization, and the execution environment."
linkTitle: "Development Environment"
---

Here, _Agent Development Environment_ is a proposed architectural term, not a formally standardized industry category.

**The harness determines how the agent operates. The development environment determines what resources, conventions, and feedback are available for doing engineering work.**

This note assumes the situation in [What a Team Can Set in a Harness It Doesn't Change]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}): the team uses a harness it doesn't change. What the team builds goes into two places: the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}), which turns the harness into the team's agents and is shared across projects, and this environment, which is the project and what it gives every participant. The note defines the environment, describes its parts as feedforward and feedback controls, says which goals they serve, lists the parts, and gives principles for building them. The command layer has its own section at the end, and project knowledge has its own note, [Project Knowledge in the Agent Development Environment]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}). The environment is a different thing from the execution environment, the machine or container where a session runs ([Execution environment](#execution-environment)). The earlier version of this note is kept as ade-0.

## Definitions and boundaries


| Concept                           | Responsibility                                                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Agent harness**                 | Runs the agent, connects it to models and tools, and controls execution.                                                                              |
| **Agent customization**           | The text the model reads, the settings the harness applies, the code the harness runs, and the agent roles, workflows, and packages that bundle them. Together they turn the harness into the team's agents, shared across projects. |
| **Agent Development Environment** | The project and what it gives every participant: the code, project knowledge, working practices, commands, checks, repository settings, and setup definitions. |
| **Execution environment**         | The machine or container where one session runs, with its workspace, tools, running services, isolation, and credentials. It's prepared from the environment's setup definitions. |
| **Agentic DevEx**                 | The practice of building the agent customization and the environment and improving them from what happens in the work, so that development is effective for both people and agents. |

### Agent harness


In this note, the *agent harness* is the software that runs an agent session. It connects the model to context and tools, runs the agent loop, and keeps the session's state (VS Code docs). Claude Code and Codex are harnesses. A source-code study of eleven coding harnesses identified seven subsystems common to them: the agent loop, model integration, the tool system, context and memory, safety and permissions, orchestration, and extensibility (Barbaste et al. 2026).

The VS Code documentation separates the harness from the language model, from the account that gives access to the model, from the *agent role* (the instructions and tools that apply to a task), and from the *execution environment* (where tools run and changes are made, such as the local machine, a dev container, or a cloud host).

Most teams configure the harness they use and don't change its code. They set what the harness exposes: instruction files, permission settings, hooks, skills, and tool connections. [What a Team Can Set in a Harness It Doesn't Change]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}) lists these for Claude Code, Codex, and Droid. A team that uses an open-source harness can also extend it with its own code or change the harness's source ([Choosing and changing the harness](#choosing-and-changing-the-harness)).

### Choosing and changing the harness


A team chooses its harness, and the choice decides how far the team can change it. Claude Code is closed source. Codex CLI (Apache 2.0), OpenCode (MIT), Pi (MIT), and Cline (Apache 2.0) are open source. A team can change a harness at four levels, from least to most work:

|Level|What the team does|Examples|
|---|---|---|
|**Configure**|Writes settings and instruction files that the harness reads.|Permission rules, approval policy, MCP servers, model choice|
|**Extend**|Writes code that the harness loads at its extension points.|Hooks, plugins, custom tools, a replaced system prompt|
|**Fork**|Changes the harness's source and maintains the changed copy.|A changed agent loop, context compaction, or permission enforcement|
|**Build**|Assembles its own harness from libraries.|Claude Agent SDK, Pi's agent and model packages|

Closed-source harnesses also allow the first two levels. Claude Code has hooks, skills, and plugins. The harnesses differ in how much an extension can change:

- **Codex CLI** offers mostly configuration: `AGENTS.md`, rules that allow, prompt for, or forbid commands, hooks before and after tool calls and other events, skills, and MCP servers. A hook can block some actions. Hooks that the repository defines run only after the user reviews and trusts them. Codex also has TypeScript and Python SDKs for running it from other programs (Codex docs).
- **OpenCode** loads plugins from `.opencode/plugins/` or from npm, and custom tools written in TypeScript. A custom tool with the name of a built-in tool replaces the built-in tool. An agent defined in Markdown uses its text as the system prompt in place of the default one (OpenCode docs).
- **Pi** is built to be adapted. Its extensions are TypeScript modules that can add or replace tools, block or rewrite tool calls, replace the system prompt, filter what the model sees, take over context compaction, and add commands and UI. Pi has no built-in permission system, so a team that wants approvals writes them as an extension. Its model API and agent loop are separate packages that a team can build its own harness from (Pi docs).
- **Cline** reads rules from `.clinerules/` and also reads `AGENTS.md`. Its plugins, written against `@cline/sdk`, run hooks before a run, before a tool call, and after a run. The docs present hooks mainly for logging and auditing (Cline docs).

Teams have also forked these harnesses. Roo Code started from Cline's code, and Kilo's CLI is a fork of OpenCode (Roo Code README; Kilo Code README). Products also build on a harness without forking it. Roomote, a self-hosted cloud agent, runs OpenCode in each task's sandbox and changes its behavior with OpenCode plugins ([Roomote]({{< ref "ai-engineering/agents/harnesses/roomote" >}})).

Changing the harness lets a team do things the repository can't. It can run a check after every edit whatever the agent decides, choose what context compaction keeps, add an approval step the harness lacks, or replace the system prompt. The changes have costs:

- **They work in one harness.** Knowledge and checks placed in an extension don't reach a developer or another agent. This works against the goal that every agent gets the same environment ([Goals](#goals)).
- **The team maintains them.** A fork has to be merged with each upstream release, and the team becomes responsible for what it changed, including how permissions are enforced. Extension APIs also change: Codex marks its rules as experimental (Codex docs).

This note puts a capability in the environment when it can work there, as a command, a check, or a document. It goes in the harness only when it depends on the agent loop: when it runs, what the model sees, or what the agent may do. A hook can combine both. Its configuration belongs to one harness, and the command it runs belongs to the environment, so the same check can run from a Claude Code hook, a Codex hook, and a git hook.

### Other uses of "harness"


Other sources draw the line elsewhere:

- **Böckeler** uses the wide sense: an agent is a model plus its harness, so the harness is everything except the model. Part of it is built into the coding agent, such as its system prompt, its code retrieval, and its orchestration. The rest is the *outer harness*, which users build from the agent's features for their own codebase; her figure calls it the user harness (Böckeler 2026).
- **Diaz et al.** separate the *technical harness*, the software around one model in one session, from the *methodological harness*, the practices and artifacts a team owns, centered on specifications. They call the technical harness transient and the methodological harness durable (Diaz et al. 2026).
- **OpenAI's team** uses *harness engineering* for its whole job: designing environments, specifying intent, and building feedback loops (OpenAI 2026).
- **The design note** also uses the wide sense. Its harness includes permission settings, hooks, scripts, tests, linters, and CI ([Participants]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#participants)).

|Source|The software that runs the session|What the team builds around it|
|---|---|---|
|VS Code docs|Agent harness|Not named|
|Böckeler|The part built into the coding agent|Outer harness (user harness)|
|Diaz et al.|Technical harness|Methodological harness|
|This note|Agent harness|Agent customization and Agent Development Environment, built and improved through Agentic DevEx|

The last column lines up only roughly. The environment in this note includes the methodological harness of Diaz et al.: shared knowledge, executable specifications, isolated worktrees, and the working practices a team writes down, such as how results are accepted and how much autonomy agents get.

### Agent Development Environment


The *Agent Development Environment* is the project and what it gives the people and agents working in it. Together with the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}), it makes up what Böckeler calls the outer harness, and it includes the methodological harness of Diaz et al. This note uses a separate term for three reasons. The environment is designed to behave the same whichever harness runs the agent. It includes setup definitions as well as guides and sensors. And it includes the working practices the team writes down, such as how tasks are specified and how results are accepted.

The environment has these parts, grouped by kind of artifact, which [What the environment contains](#what-the-environment-contains) describes:

- **The code**, whose structure, types, and module boundaries guide the agent and make checks possible.
- **Project knowledge and task state.**
- **Working practices and written workflows.**
- **Commands and tools**: the command layer, scripts, and MCP servers.
- **Checks.**
- **Repository and platform settings**: branch protection, required review, deploy rights, and the scope of credentials.
- **Setup definitions**, which prepare the execution environment.

Instruction files such as `AGENTS.md`, skills, agent roles, and harness settings are the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}), a layer of its own: the team writes it for a harness, assembles it from layers, and shares it across projects. The project's own part of it, such as its `AGENTS.md` and its `.claude/` folder, lives in the project's repository next to the environment.

For example, the agent doesn't need to decide where temporary scripts belong. The project defines that convention. It doesn't need to discover how to run tests. The project exposes a standard command. It doesn't need every engineering convention copied into its initial context. It can access shared documentation when relevant.

The [python-repo-template](https://github.com/valery-judah/python-repo-template) mainly implements this concept: an environment that behaves predictably whichever coding agent uses it.

The boundary with the harness follows which software runs a part and whether the part works for any agent. Who writes the part doesn't decide it, since a team can write extensions for an open-source harness or fork it ([Choosing and changing the harness](#choosing-and-changing-the-harness)):

- **Harness:** a part that runs the agent session, such as the agent loop, context compaction, and the enforcement of permission rules. This holds whether the part ships with the tool or the team changed it in a fork.
- **Agent customization:** a part that the team writes for the harness to read, such as `AGENTS.md`, tool-specific settings like `.claude/settings.json` and Codex rules, and harness extensions like hook configuration, plugins, custom tools, skill folders, and agent role definitions. The harness enforces or runs each of them. Some are read by several harnesses, such as `AGENTS.md`, and most by only one. Keeping them in sync across tools is an open question ([Several agent tools in one repository]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#several-agent-tools-in-one-repository)).
- **Environment:** a part that the team writes and keeps in the repository or its tooling, and that works for any agent and any person, such as documentation, task targets, tests, linters, CI, and git hooks.

The machine or container where a session runs isn't part of the environment. [Execution environment](#execution-environment) describes it.

In [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}), the environment is one of three substrates, next to the agent runtime and the authority layer. The limits the team writes are split between two layers: permission rules are part of the agent customization, and branch protection is part of the environment. The authority layer groups the places where they're enforced.

### Execution environment


The *execution environment* is where one session runs: the machine or container, the workspace in it (the checkout or worktree, its files, the installed tools, and the running services), the isolation around it, and the credentials present there. The VS Code documentation uses the same term for where tools run and changes are made. [Where Coding Agents Run]({{< ref "ai-engineering/agents/environment/where-agents-run" >}}) describes where it can be and how it's prepared, and [How Coding Agents Set Up and Restrict Their Environment]({{< ref "ai-engineering/agents/environment/environment-controls" >}}) compares how agents confine it.

The Agent Development Environment and the execution environment are different things:

| | Agent Development Environment | Execution environment |
|---|---|---|
| What it is | A designed set of artifacts: the code, project knowledge, working practices, commands, checks, repository settings, and setup definitions | A concrete machine or container with a workspace, tools, services, isolation, and credentials |
| Who makes it | The team writes it | The setup creates it from definitions, and the harness or a platform runs the session in it |
| Where it lives | Versioned in the repository and in shared repositories such as `agent-docs` | On a developer's machine, in a container, on a CI runner, or in a sandbox |
| How many there are | One per project, plus the parts projects share | Many: one for each session or task, or one long-lived machine for many tasks |
| How it changes | Through reviewed changes, from what tasks teach | Through setup, and through what the agent and people do in it |

The environment reaches the agent through the execution environment. The checkout carries the docs and the commands, together with the project's part of the agent customization, such as `AGENTS.md` and the skills. The setup definitions prepare the machine, and the limits the team writes are enforced there. The two can drift apart: a fresh sandbox can lack the linked shared docs or Docker, and a prebuilt image can fall behind the repository ([What each setup asks of the repository]({{< ref "ai-engineering/agents/environment/where-agents-run" >}}#what-each-setup-asks-of-the-repository)).

### Agentic DevEx


*Developer experience* (DevEx) is how easily and effectively developers can do their work with a team's tools and processes. *Agentic DevEx* extends it to agents: the practice of building the agent customization and the environment and improving them from what happens in the work, so that development is effective for both people and agents. Böckeler calls the people's part of it the steering loop: when an issue comes back, people improve the guides or the sensors so that it becomes less likely or can't happen, and agents can help build them (Böckeler 2026). [Improving the environment](#improving-the-environment) gives the principles.

## Feedforward and feedback controls


Böckeler describes what a team builds around the agent as controls of two kinds (Böckeler 2026):

- **Guides** are feedforward controls. They anticipate what the agent will do and steer it before it acts, so its first attempt is more likely to be right. Examples are `AGENTS.md`, skills, architecture docs, and code navigation through a language server.
- **Sensors** are feedback controls. They observe what the agent did and help it correct itself. Examples are tests, linters, type checks, structural tests, and review agents. A sensor helps most when its output is written for the agent to read, such as a linter message that says how to fix the violation.

With sensors alone, the agent repeats the same mistake in every session. With guides alone, nobody checks whether the agent followed them.

Each control is also computational or inferential:

- **Computational** controls are deterministic and fast: tests, linters, type checkers, structural analysis, code mods, and scripts. They're cheap enough to run on every change.
- **Inferential** controls use a model: instructions the agent interprets, review agents, and a model judging the result. They can judge meaning and design, but they're slower, cost more, and give different answers on different runs.

| | Computational | Inferential |
|---|---|---|
| **Guides** | Types and module boundaries in the code, code generators and code mods, bootstrap scripts, code navigation through a language server | `AGENTS.md`, docs, skills, specs, the instructions of an agent role |
| **Sensors** | Tests, linters, type checks, structural tests, and the hooks and CI jobs that run them | Review agents and review skills, a model judging the result |

Human review is one more sensor. The harness also has guides of its own, such as its system prompt. The controls the team adds come from two layers: `AGENTS.md`, skills, and reviewer roles are part of the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}), and the code, docs, tests, and linters are part of the environment.

**When the controls run.** Böckeler's rule is to keep quality left: run each check as early as its cost allows, because a problem found early costs less to fix. Fast sensors, such as linters, fast tests, and a basic review agent, run during the session and before a commit. Slow sensors, such as mutation testing and a broader review, run after integration, where the fast ones run again. Other sensors run continuously, outside any one change, such as dead-code detection and dependency scanners, and some watch the running system (Böckeler 2026). [Feedback and checks](#feedback-and-checks) turns this into principles.

**What the controls regulate.** Böckeler sorts the controls by what they keep in check (Böckeler 2026):

- **Maintainability** of the code. Existing tools already give many computational sensors here, for duplication, complexity, coverage, and style.
- **Architecture fitness**, through fitness functions: guides that state requirements such as performance or logging conventions, and sensors that check them.
- **Behavior**: whether the application does what it should. The usual guide is a functional spec, and the usual sensor is a test suite the agent wrote. She considers this category the least solved. No sensor can check correctness when the person hasn't said what they want.

**Harnessability.** Some codebases are easier to build controls for. Strong typing gives type checks, clear module boundaries allow architecture rules, and frameworks hide details the agent doesn't need to handle. Böckeler calls this property harnessability. Legacy codebases, where the controls are needed most, have the least of it (Böckeler 2026).

**What else the environment gives.** Guides and sensors steer and check the agent's work. The environment also gives the agent the means to act, such as commands and the running application, and it limits what the agent may do, through permission rules, the sandbox, and scoped credentials. So this note uses four kinds of control: guides, sensors, tools, and limits. [What the environment contains](#what-the-environment-contains) groups the parts by kind of artifact and gives each part its kind of control.

## Problems and goals


The central question is how the environment can guide the agent toward valid solutions and expose its mistakes early enough for the agent to correct them.

### Problems


Teams that hand engineering work to coding agents report these problems:

- **The environment is underspecified.** The agent lacks the tools, structure, and documentation it needs to make progress. OpenAI's team traced its slow early progress to this (OpenAI 2026).
- **Knowledge outside the repository is invisible to the agent.** Decisions made in chat, documents stored elsewhere, and what people remember don't exist for the agent until someone writes them into the repository (OpenAI 2026). Agents also keep no memory between sessions, so plans and decisions are lost unless something stores them (Diaz et al. 2026).
- **Human attention becomes the bottleneck.** Agents produce changes faster than people can review and test them. OpenAI's team found its limit in human QA capacity (OpenAI 2026). At Harness, pull requests grew about sevenfold in a year while active contributors grew about 30%, and the load moved to source control, review, and CI. These are one company's internal figures (Singh and Kanodia 2026).
- **Results are hard to trust.** Models are nondeterministic and lack the team's context, and tests written by agents can give false confidence (Böckeler 2026). Agents rate their own work too highly, especially on subjective tasks such as design, and sometimes accept flawed work even when it can be checked (Rajasekaran 2026). At agent volume, people can't build trust by reading every line (Diaz et al. 2026).
- **Mistakes found late cost more.** A problem that reaches human review costs review time and tokens that an earlier check would have saved (Böckeler 2026).
- **Checks can't catch a misunderstood task.** When the intent was never written down, no test or linter can show that the agent solved the wrong problem (Böckeler 2026).
- **The codebase drifts.** Agents copy the patterns they find, including poor ones, and documentation goes stale. OpenAI's team at first spent a day a week cleaning up after agents (OpenAI 2026).
- **Agents have more access than their tasks need.** Agents often run with the developer's full credentials, read untrusted content, and can act outside the repository, which exposes them to prompt injection and misuse (OWASP).

### Goals


The environment serves the six Plane 2 goals in [Two Planes of Goals]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}), and through them the product and engineering goals of Plane 1. For the environment, the six goals mean:

1. **The agent works from the project's reality.** Guides steer it toward valid solutions before it acts, so it gets the change right more often on the first attempt. The knowledge it needs is written into the repository, including the intent of the task.
2. **Work can be checked as it's done and by someone else.** Fast computational sensors let the agent find and fix its own mistakes before a person sees them, so fewer problems reach review and fewer tokens and runs go to rework (Böckeler 2026). Independent checks, such as CI and a separate reviewer, catch what the author's own checks miss. Results come with evidence, so a reviewer can judge a change from check results and test output without reading every line.
3. **People can see and steer the work.** Plans, diffs, check results, and logs show what the agent did. People spend their attention on the decisions that need them: defining intent, accepting results, and making product, architecture, and risk decisions.
4. **Commitments go through the people who own them.** Agents get only the access their tasks need, the damage a mistaken or misled agent can do is limited, and each action can be traced to the agent that took it (OWASP). Pushing, merging, and deploying need a person.
5. **Task state lives outside any participant's memory.** Plans, progress, and handoffs are kept in files, so another session or another participant can continue the work.
6. **The environment and autonomy change with evidence.** Recurring failures become changes to the guides and sensors, and each part stays only while it helps.

Two more goals are specific to the environment:

- **Every agent gets the same environment.** Commands, documentation, and checks work the same for Codex, Claude Code, or any other agent, so each piece of knowledge goes into the repository once. The [command layer](#command-layer) gives every agent the same named commands.
- **The codebase stays coherent as agents add code.** Architecture boundaries and conventions hold without constant manual cleanup. This serves results that hold, an engineering goal of Plane 1.

Together these goals let agents do as much of the work as the evidence supports while the Plane 1 goals hold, which [Two Planes of Goals]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}) calls autonomy matched to evidence. The earlier version of this note took its goal from the design note for `AGENTS.md`, reliable autonomy, which step 19 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}) replaced.

## What the environment contains


The parts below are grouped by kind of artifact: what the team writes and keeps. Each part also acts as one or more of the kinds of control in [Feedforward and feedback controls](#feedforward-and-feedback-controls): a guide, a sensor, a tool, or a limit. The two groupings cut across each other: the command layer, for example, is a tool that also runs computational guides and sensors. When the team decides where a piece of guidance or a rule goes, three properties decide which part fits: when it takes the agent's context, whether it holds when the agent doesn't follow it, and who it reaches ([Three Properties That Decide Where Something Goes]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}#three-properties-that-decide-where-something-goes)). The table gives each part's kind of control and its reach. The parts of the agent customization, such as `AGENTS.md`, skills, agent roles, and policies, are described in [Agent Customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}#four-kinds-of-parts).

| Part | What it holds | Kind of control | Who it reaches | Details |
|---|---|---|---|---|
| Code | The subject system: its structure, types, and module boundaries | Computational guide, and what makes many sensors possible | Every agent and person | [Code](#code) |
| Project knowledge and task state | Docs, decisions, contracts, shared agent docs, and task directories | Inferential guide | Every agent and person | [Project knowledge and task state](#project-knowledge-and-task-state) |
| Working practices and workflows | How tasks are specified and accepted, what done means, how much autonomy each type of action gets, and the written steps of each type of task | Guide for people and agents | Every agent and person | [Working practices and workflows](#working-practices-and-workflows) |
| Commands and tools | The command layer, scripts, and MCP servers | Tool, and commands also run the computational guides and sensors | Every agent and person, and an MCP server reaches the harnesses connected to it | [Commands and tools](#commands-and-tools) |
| Checks | Tests, linters, type and structural checks, git hooks, and CI workflows | Computational sensor | Every agent and person | [Checks](#checks) |
| Repository and platform settings | Branch protection, required review, deploy rights, and the scope of credentials | Limit | Every agent and person | [Repository and platform settings](#repository-and-platform-settings) |
| Setup definitions | Repository templates, setup scripts, dev container definitions, the initialization command, and workspace conventions | Tool, which prepares the execution environment | Every setup that calls them | [Setup definitions](#setup-definitions) |

### The broader architecture

```
Agentic Software Engineering
│
├── Agent Runtime
│   ├── Model
│   ├── Harness, with its built-in guides
│   ├── Built-in tools
│   └── Execution controls
│
├── Agent Customization
│   ├── Text the model reads
│   │   ├── Instructions: AGENTS.md, nested files, adapters, templates
│   │   ├── Skills
│   │   └── Prompts and commands
│   ├── Settings the harness applies
│   │   ├── Policies: permission rules, modes, sandbox settings
│   │   ├── Model settings
│   │   └── Tool connections
│   ├── Code the harness runs
│   │   ├── Hooks
│   │   └── Plugins and custom tools
│   └── Bundles
│       ├── Agent roles
│       ├── Runnable workflows
│       └── Packages
│
├── Execution Environment
│   ├── Machine or container
│   ├── Workspace: checkout or worktree, tools, and running services
│   ├── Isolation
│   └── Credentials
│
├── Agent Development Environment
│   │
│   ├── Code
│   │
│   ├── Project Knowledge and Task State
│   │   ├── Repository docs
│   │   ├── Shared agent docs
│   │   └── Task directories
│   │
│   ├── Working Practices and Workflows
│   │   ├── Task specification
│   │   ├── Definition of done and acceptance
│   │   ├── Autonomy for each type of action
│   │   └── Written workflows for types of tasks
│   │
│   ├── Commands and Tools
│   │   ├── Command layer
│   │   ├── Scripts and command-line tools
│   │   └── MCP servers
│   │
│   ├── Checks
│   │   ├── Tests, linters, type and structural checks
│   │   ├── Git hooks
│   │   └── CI workflows
│   │
│   ├── Repository and Platform Settings
│   │   ├── Branch protection and required review
│   │   ├── Deploy rights
│   │   └── Scope of credentials
│   │
│   └── Setup Definitions
│       ├── Repository templates
│       ├── Setup scripts and dev container definitions
│       ├── Project initialization command
│       └── Workspace conventions
│
└── Engineering Process
    ├── Problem and opportunity framing
    ├── Investigation and uncertainty reduction
    ├── Trade-off analysis and design decisions
    ├── Implementation
    ├── Verification and review
    └── Release, operation, and learning
```


The engineering process is the six activities of [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}). The agent customization is a layer of its own, and each harness reads it from its own folders and formats ([Managing It Like the Configuration of an Application]({{< ref "ai-engineering/agents/customization/agent-customization" >}}#managing-it-like-the-configuration-of-an-application)). The earliest tree grouped the parts by Workspace Management, Knowledge Management, Workflow Infrastructure, Agent Integration, and Environment Provisioning, step 26 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}) grouped them by kind of control, and step 31 moved the agent customization out of the environment.

### Code


The code is the subject system the agents work on, and its structure is also a guide. The agent follows the patterns it finds, including poor ones, so the code teaches conventions whether or not anyone wrote them down ([Problems](#problems)). Strong types and clear module boundaries also make sensors possible, such as type checks and architecture rules ([Feedforward and feedback controls](#feedforward-and-feedback-controls)). In the substrates, the code, its data, and the running application form the subject system ([Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}})), and the running application runs in the execution environment.

### Project knowledge and task state


Project knowledge is what the agent needs to know about the project: product framing, domain concepts, architecture, decisions, conventions, and contracts. It's kept as docs split by status, shared agent docs, and linked directories. Task state is the knowledge of one task, such as the plan and the handoff, kept in a task directory or in the repository. Both are inferential guides, and the root `AGENTS.md` says where each one is. [Project Knowledge in the Agent Development Environment]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}) describes them, with an example layout.

### Working practices and workflows


Working practices describe how people and agents work together, written down so that every participant can follow them. Most of what Diaz et al. call the methodological harness falls here or under project knowledge (Diaz et al. 2026). They cover:

- **How tasks are specified:** a brief, a spec, or a task directory that states the intent and the context before the work starts ([Task directory]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#task-directory)).
- **What done means:** the baseline checks, and the acceptance criteria for the task agreed before the work starts ([Knowledge and intent](#knowledge-and-intent)).
- **How results are accepted:** which checks and reviews a result goes through before it's merged or deployed.
- **How much autonomy each type of action gets**, and what starts an agent role ([Autonomy and Triggers for Agent Roles]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#autonomy-and-triggers-for-agent-roles)).
- **How the environment improves:** how failures are recorded and turned into changes to the guides and sensors ([Improving the environment](#improving-the-environment)).
- **Workflows for types of tasks:** the steps a type of task goes through, such as reproducing, diagnosing, fixing, and verifying a bug. [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) describes the workflows in general, and the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) builds a project's version of them from its cases. A skill can carry out a workflow's steps, and commands can run its checks. A workflow that runs, such as a skill that calls an implementer role and then a reviewer role, is part of the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}).

[Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}) describes the processes these practices support.

### Commands and tools


- **The command layer:** named commands for setup, checks, running the application, diagnostics, and remote operations. The rest of the environment uses commands more than any other tool: checks, setup definitions, hooks, and CI all run them. [Command layer](#command-layer) at the end of this note describes it.
- **Scripts and command-line tools** in the repository or installed by the setup, which the agent runs through the shell. A script that people or agents run more than once usually becomes a command.
- **MCP servers**, which give the agent tools for systems outside the repository, such as a ticket system or a database. The server can serve several harnesses, and each harness's connection to it is part of the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}) ([Tools and Commands]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}#tools-and-commands)).

### Checks


Checks are the computational sensors the team writes: tests, linters, type checks, structural tests, the git hooks that run them before a commit, and the CI workflows that run them after a push. They run as commands, so the agent, the git hooks, and CI run the same check ([Command layer](#command-layer)). Hooks in the harness can also run them at fixed points whatever the agent decides ([Code the Harness Runs]({{< ref "ai-engineering/agents/customization/agent-customization" >}}#code-the-harness-runs)). The inferential sensors are part of the agent customization: a review skill or a reviewer role judges what the computational checks can't. Human review comes last. [Feedback and checks](#feedback-and-checks) gives the principles, and [How Coding Agents Check Actions]({{< ref "ai-engineering/agents/environment/action-checks" >}}) describes how harnesses check an agent's actions before they run.

### Repository and platform settings


Some limits are set outside every harness, in the systems that hold the repository and run its deploys: branch protection, required review, who may deploy, and the scope of the credentials the agent gets. They hold for every agent and person, and they guard the points where work becomes shared or has an effect outside the workspace ([commitment points]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#contributions-effects-and-commitment-points)). The execution environment decides which credentials are actually there. In the substrates, the places where these settings and the harness's rules are enforced form the authority layer ([How Coding Agents Set Up and Restrict Their Environment]({{< ref "ai-engineering/agents/environment/environment-controls" >}})).

### Setup definitions


Setup definitions prepare the execution environment: repository templates, setup scripts, dev container definitions, dependency installation, and the project initialization command, such as `task repo:init`, which also creates the links to shared docs and task directories ([Shared agent docs]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#shared-agent-docs), [Task directory]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#task-directory)). They also include workspace conventions, such as where scratch scripts go and which artifacts Git ignores. The definitions are part of the environment, and what a session gets when they run is the execution environment ([Execution environment](#execution-environment)).

## Principles


These principles come from the sources below. Böckeler's outer harness overlaps with the development environment, so most of her principles apply to it directly.

### Feedback and checks


- **Combine guides and sensors.** Guides alone never show whether they worked. Sensors alone let the agent repeat the same mistake in every session (Böckeler 2026).
- **Run each check as early as its cost allows.** Fast checks, such as linters, type checks, fast tests, and a basic review agent, run before a commit, or during the session as agent hooks. Slow checks, such as mutation testing and broad review, run after integration, where the fast checks run again. Human review is one more check in this sequence ([Feedforward and feedback controls](#feedforward-and-feedback-controls); Böckeler 2026).
- **Prefer computational checks, and use inferential checks for what they can't judge.** Computational checks, such as tests, linters, type checkers, and structural tests, are fast and cheap and give the same answer on every run, so they can run on every change. Inferential checks, such as review agents, can judge meaning and design, but they are slower, cost more, and vary between runs (Böckeler 2026).
- **Write check output for the agent.** An error message that says how to fix the violation lets the agent correct it without help. OpenAI's team writes its custom linters' messages this way (OpenAI 2026).
- **Check the agent's work with a separate checker.** A separate evaluator is easier to make skeptical than an agent judging its own work (Rajasekaran 2026). An agent should not approve its own change (OWASP).

### Knowledge and intent


- **Put the knowledge the agent needs in the repository.** Write decisions, product context, and conventions into versioned files, or give the agent another way to reach them ([Project Knowledge]({{< ref "ai-engineering/agents/environment/project-knowledge" >}})).
- **Give the agent a short entry point, and let it load details when needed.** OpenAI's team replaced a large `AGENTS.md` with a file of about 100 lines that points into a structured `docs/` directory, and checks those docs with linters and CI jobs (OpenAI 2026). The design note applies this to the root file ([Make it a map, not a manual]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#make-it-a-map-not-a-manual)), and skills apply it to procedures ([Text the Model Reads]({{< ref "ai-engineering/agents/customization/agent-customization" >}}#text-the-model-reads)).
- **Define what done means before the work starts.** A written specification of the change, kept with the code, gives the agent and the reviewer the same acceptance criteria (Diaz et al. 2026). In Anthropic's experiments, the agent writing the code and the agent checking it agreed on what done meant, and how to test it, before any code was written (Rajasekaran 2026).
- **Store plans and progress in the repository.** Work can then continue across sessions and agents. OpenAI's team checks execution plans, with their progress and decision logs, into the repository (OpenAI 2026).

### Structure and visibility


- **Enforce boundaries, and leave the implementation free.** Enforce architecture rules and other invariants mechanically, through linters and structural tests, and let the agent choose how to implement within them (OpenAI 2026). A fixed architecture limits what the agent can produce, which makes its output easier to check (Böckeler 2026).
- **Make the codebase easy to check.** Strong typing makes type checks possible, and clear module boundaries make architecture rules possible. This is the harnessability of [Feedforward and feedback controls](#feedforward-and-feedback-controls), and legacy codebases have the least of it (Böckeler 2026).
- **Make the running application visible to the agent.** When the agent can start the application for its change, drive the UI, and query logs and metrics, it can reproduce a bug and check its own fix. OpenAI's team made the application start separately in each git worktree, with its own logs and metrics (OpenAI 2026). In the projects, commands to start the local stack, show its status and logs, and stop it give the agent this access ([Command layer](#command-layer)).

### Improving the environment


- **Turn each recurring failure into a change to the environment.** When the agent fails, find the missing guide, sensor, tool, or document, and add it (OpenAI 2026; Böckeler 2026). The design note applies this to `AGENTS.md` ([Convert repeated failures into harness improvements]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#convert-repeated-failures-into-harness-improvements)).
- **Clean up continuously.** Run recurring checks and cleanup tasks outside individual changes, for drift from conventions, dead code, stale documentation, and outdated dependencies. OpenAI's team runs background agent tasks that open small refactoring pull requests (OpenAI 2026; Böckeler 2026).
- **Test each part of the environment against agent behavior.** Each part of a harness assumes something about what the model can't do alone. Remove one part at a time to see whether it still helps, and check again when a new model ships (Rajasekaran 2026). Targeted behavioral evaluations show which behavior changed, while an end-to-end score shows only that the result moved (Mullen and Gunderman 2026). See [Why it is hard to tell whether AGENTS.md works]({{< ref "ai-engineering/agents/evaluation/agents-md-verification" >}}).

### Access


- **Give agents only the access their tasks need.** Use separate agent identities with short-lived, scoped credentials, sandboxes, and network allowlists, and require human approval for pushing, merging, and deploying (OWASP). Text in an instruction file enforces none of this ([Approval rules]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#approval-rules)). Commands grouped by risk let one permission rule cover a whole namespace, such as `infra:*` ([Command layer](#command-layer)).

## Command layer


The *command layer* is the set of named commands a repository defines for its workflows. In established terms it's build automation: a task runner, such as Make or Go Task, gives each of the project's workflows a named target, and the target holds the tools, their flags, and the order of the steps. Projects have long done this so that a build, a test run, or a release takes one command and runs the same way for everyone. The command layer covers more than the build: setup, checks, running the application, starting and stopping local services, diagnostics, and remote operations. A task runner keeps them in one file, `Taskfile.yml` for Go Task or `Makefile` for Make. In the architecture above, it's the first part under *Commands and Tools*.

In terms of controls, the command layer is how the environment runs its computational guides and sensors. A setup or code generation command is a computational guide, and a check command is a computational sensor. The same command runs in the agent's session, in a harness hook, in a git hook, and in CI, which is what lets each check run as early as its cost allows ([Feedforward and feedback controls](#feedforward-and-feedback-controls)). The commands also give the agent the means to act on the running system, and grouping them by risk lets one permission rule limit a whole group.

The command layer adds no new concept. It is ordinary tooling that most projects have in some form. It belongs in this note because many other parts of the environment reach the agent through it: checks run as commands, the local application starts and stops through commands, setup creates the shared links through a command, and the runbook's procedures name commands. The same commands serve the developer working locally, the agent, and the git hooks.

[Command layer]({{< ref "ai-engineering/agents/environment/command-layer" >}}) describes it in detail across eight projects, comparing how agents and developers use the command line and how commands are structured, isolated, and documented. This section summarizes what it consists of and what it gives the rest of the environment.

### What it consists of


- **Named commands with a catalog.** A developer or an agent runs a command by name, such as `task quality:verify`, without knowing which tools it runs, with which flags, or in which order. `task help` lists every command with a one-line description ([Finding commands]({{< ref "ai-engineering/agents/environment/command-layer" >}}#finding-commands)).
- **Namespaces for the parts of the system.** The template starts with `repo:*`, `quality:*`, `security:*`, and `app:*`. knowledge-assistant adds `config:*`, `api:*`, `db:*`, `scenario:*`, `eval:*`, and `infra:*`, and writes down what each namespace owns and what it doesn't ([Namespaces]({{< ref "ai-engineering/agents/environment/command-layer" >}}#namespaces)).
- **Commands built from smaller commands.** Tool calls appear only inside the task runner file. Subsystem commands, such as `db:up` and `app:dev`, each do one job for one part of the system. Scenarios, such as `scenario:local:up`, combine them into one workflow, and the smaller commands stay available for when something fails ([Subsystem commands and scenarios]({{< ref "ai-engineering/agents/environment/command-layer" >}}#subsystem-commands-and-scenarios)).
- **Separation by risk.** Local and remote commands, read-only and changing commands, and stopping and deleting get different names, as in `infra:runpod:*` for a paid remote machine ([Keeping risky commands apart]({{< ref "ai-engineering/agents/environment/command-layer" >}}#keeping-risky-commands-apart)).
- **Toolchains in containers.** Tools that need another toolchain, such as Node.js or Bun, run in containers behind a command. The host then needs only Python, `uv`, the task runner, and Docker ([Isolating tool dependencies]({{< ref "ai-engineering/agents/environment/command-layer" >}}#isolating-tool-dependencies)).
- **Procedures written in terms of commands.** The runbook says when and why to run a command, and the task runner says how ([Commands and runbooks]({{< ref "ai-engineering/agents/environment/command-layer" >}}#commands-and-runbooks)).

### What it gives the rest of the environment


- **Checks.** `AGENTS.md` names one validation command, `task quality:verify`, which runs the format check, lint, type checks, and tests in order and stops at the first failure. The template's pre-commit hook runs `task security:scan:staged`, the same scan the agent can run during the session. Each check is one command that can run at any point, which makes it easier to run each check as early as its cost allows ([Feedback and checks](#feedback-and-checks)).
- **The running application.** Commands to start, inspect, follow the logs of, and stop the local stack let the agent reproduce a bug and check its fix. A start command that returns once the services are ready lets the agent continue, and diagnostic commands, such as sem-rag's `collect-query-context`, collect the evidence for one request in one directory ([Structure and visibility](#structure-and-visibility), [Commands that start services]({{< ref "ai-engineering/agents/environment/command-layer" >}}#commands-that-start-services)).
- **Access.** With commands grouped by risk, one permission rule covers a namespace, such as asking before any `infra:*` command. A rule matches only the command as written, so removing the access still comes first ([Access](#access)).
- **Provisioning.** `task repo:init` syncs the dependencies, installs the git hooks, and links `agent-docs`. A `repo:tasks` command could link the task directory the same way ([Shared agent docs]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#shared-agent-docs), [Task directory]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#task-directory)).
- **Knowledge.** `AGENTS.md` needs one line for commands, such as "Use `task <namespace>:<name>` for repository workflows and `task help` for the current catalog." The runbook holds the command reference ([Make it a map, not a manual]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#make-it-a-map-not-a-manual)).
- **The same environment for every agent.** Codex, Claude Code, and a developer run the same commands, and containers pin the tool versions, so a check that passes for the agent passes for the developer ([Goals](#goals)).
- **Improving the environment.** When the agent repeats a workflow by hand and skips a step, the fix is a new command in the right namespace. The catalog lists it, and `AGENTS.md` needs no new line ([Improving the environment](#improving-the-environment)).

[What the command layer gives agents]({{< ref "ai-engineering/agents/environment/command-layer" >}}#what-the-command-layer-gives-agents) checks each of these against the premises and rules of the design note for `AGENTS.md`, and lists what to observe in agent sessions to find out whether they hold.

### For developers


The same commands help a developer working locally. A developer new to the repository learns its workflows from `task help`. One command starts the local stack, and one stops it. A renamed command keeps working as an alias, so scripts and habits don't break ([Renaming commands]({{< ref "ai-engineering/agents/environment/command-layer" >}}#renaming-commands)).

Developers and agents differ in a few places. An agent reads the catalog in every session, needs a start command to return, can't use an interactive prompt such as `psql`, and needs its approval rules in permission settings ([Where developers and agents differ]({{< ref "ai-engineering/agents/environment/command-layer" >}}#where-developers-and-agents-differ)).

### Limits


- The agent has to know the catalog exists, so `AGENTS.md` still needs one line for it.
- With two task runners, such as Make and Poe, there are two catalogs to read.
- A command name hides the tools it runs, so a failure can send the agent to the task runner file to see what ran.
- A doc that names a removed command sends the agent to an error.
- Commands that run tools in containers fail where the agent's execution environment has no Docker.

[Limits and costs]({{< ref "ai-engineering/agents/environment/command-layer" >}}#limits-and-costs) covers these in more detail.

## Sources


- Paul Barbaste, Tristan Darrigol, Germain Vu, and Tom Wiltberger, *Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents -- A Source-Code Study of Eleven Systems* ([arXiv:2609.00006](https://arxiv.org/abs/2609.00006)), 2026. Read from the abstract.
- VS Code documentation, [Understand agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses).
- Birgitta Böckeler, [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html), martinfowler.com, 2026-04-02.
- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/), 2026.
- Prithvi Rajasekaran, [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps), Anthropic, 2026-03-24.
- Taylor Mullen and Christian Gunderman, [The anatomy of harness engineering: how to evaluate, iterate, and guard AI coding agents](https://developers.googleblog.com/en/the-anatomy-of-harness-engineering-how-to-evaluate-iterate-and-guard-ai-coding-agents/), Google Developers Blog, 2026-09-09.
- Jessica Diaz, Joaquin Gayoso, Andrea Cimminio, and Jorge Perez, *Spec-Driven Development for Agentic Software Engineering: Harnessing Human-Agent Teamwork* ([arXiv:2609.00252](https://arxiv.org/abs/2609.00252)), 2026.
- Abhinav Singh and Juveria Kanodia, [When code stops being the bottleneck](https://www.harness.io/blog/when-code-stops-being-the-bottleneck), Harness blog, 2026-10-22.
- OWASP DevSecOps Guideline, [AI agent and MCP security](https://owasp.github.io/DevSecOpsGuideline/2-Process/2-2-Develop/2-2-5-AI-Agent-and-MCP-Security/).
- Codex docs: [repository](https://github.com/openai/codex), [configuration reference](https://learn.chatgpt.com/codex/config-file/config-reference), [rules](https://learn.chatgpt.com/codex/agent-configuration/rules), [hooks](https://learn.chatgpt.com/codex/hooks), [SDK](https://learn.chatgpt.com/codex/codex-sdk). Read 2026-11-14.
- OpenCode docs: [repository](https://github.com/anomalyco/opencode), [plugins](https://opencode.ai/docs/plugins/), [custom tools](https://opencode.ai/docs/custom-tools/), [agents](https://opencode.ai/docs/agents/). Read 2026-11-14.
- Pi docs: [repository](https://github.com/earendil-works/pi), [extensions](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md), [SDK](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sdk.md). Read 2026-11-14.
- Cline docs: [repository](https://github.com/cline/cline), [rules](https://docs.cline.bot/customization/cline-rules), [writing plugins](https://docs.cline.bot/sdk/guides/writing-plugins). Read 2026-11-14.
- [Roo Code README](https://github.com/RooCodeInc/Roo-Code) and [Kilo Code README](https://github.com/Kilo-Org/kilocode), read 2026-11-14.
