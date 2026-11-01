---
draft: false
toc: true
title: "Where Coding Agents Run"
description: "The execution environment of a coding agent: who receives the work, where the agent loop and its workspace are, and how the workspace is prepared, across six setups from a developer's terminal to a self-hosted agent server."
linkTitle: "Where Agents Run"
---

The same repository can be used by an agent in a developer's terminal, in a CI runner, or in a sandbox that a server starts for each task. This note describes where the agent runs and how its workspace is prepared. The place where one session runs is its execution environment: the machine or container, the workspace in it, the isolation around it, and the credentials there. It's a different thing from the [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}), which the team designs and keeps in the repository: the execution environment is prepared from the environment's setup definitions, for each session, for each task, or once for many tasks ([Execution environment]({{< ref "ai-engineering/agents/environment/ade" >}}#execution-environment)). The repository stays the same across these setups, and the setups differ in how they use it.

## Three parts


Every setup has three parts:

1. **Control plane.** Receives the work, keeps track of it, and returns the result. In a terminal session, the developer does this. In a server such as [Roomote]({{< ref "ai-engineering/agents/harnesses/roomote" >}}), it is the server with its database, queues, and webhooks.
2. **Agent loop.** The harness that calls the model and runs its tools, such as Claude Code, Codex, or OpenCode ([Agent harness]({{< ref "ai-engineering/agents/environment/ade" >}}#agent-harness)).
3. **Workspace.** The files, tools, and running services the agent works on. Together with the machine it's on, its isolation, and its credentials, it makes up the execution environment, the term the VS Code documentation uses.

In a terminal session, all three run on the developer's machine. In Roomote, they are separate: the control plane runs on a server, and each task gets its own sandbox, where the agent loop and the workspace run together. Roomote's session agent runs an agent loop on the server with no workspace.

## How the workspace is prepared


|Mode|What happens|Examples|
|---|---|---|
|**Inherited**|The agent uses the developer's existing checkout and machine as they are. Nothing is prepared.|Claude Code or Codex CLI in a terminal|
|**Set up at start**|A fresh machine runs a setup definition when the task starts.|Roomote environment definitions, Codex cloud install scripts, setup scripts in Claude Code on the web, dev container lifecycle commands, `task repo:init`|
|**From a prebuilt image**|Setup runs once into an image or snapshot, and each task starts from it.|Codespaces prebuilds, sandbox snapshots on Modal or Daytona|
|**Long-lived**|One machine stays up and serves many tasks.|A developer's remote machine, retained Docker containers in Roomote|
|**Copied from an existing workspace**|A new workspace branches off one that exists.|A git worktree per task, a sandbox resumed or forked from a snapshot|
|**No workspace**|The agent works only through APIs.|Roomote's session agent reading code through the source-control API|

The modes trade start time against how clean the workspace is:

- An inherited workspace starts at once, but the result depends on the state of the developer's machine.
- Setup at start gives a clean workspace every time and costs setup time on every task.
- A prebuilt image starts fast, but it can fall behind the repository. The split between image and start has to be decided. A Codespaces prebuild runs `onCreateCommand` and `updateContentCommand`, and leaves `postCreateCommand` for when the codespace starts (GitHub docs).
- A long-lived machine starts fast and collects leftover state from earlier tasks.
- A copied workspace starts from a known state, which may already carry changes.

## Other differences


- **Isolation.** None, when the agent runs in the developer's shell. An OS sandbox: Codex CLI uses Seatbelt on macOS and bubblewrap with seccomp on Linux (Codex docs). Claude Code's sandbox uses Seatbelt and bubblewrap, and is off by default (Claude Code docs). A separate git worktree, which separates files and nothing else. A container. A virtual machine, as in E2B's sandboxes (E2B docs). A separate host. [How coding agents set up and restrict their environment]({{< ref "ai-engineering/agents/environment/environment-controls" >}}) compares the isolation and access rules of six agents.
- **Lifetime.** One terminal session, one task and then deleted, resumable from a snapshot, or permanent.
- **What starts the work.** A person typing in a terminal or IDE, a person writing in chat, on a ticket, or on a pull request, a repository event or a schedule, or another agent, for example through MCP.
- **Whether a person is watching.** When a person watches, the harness can ask questions and request approvals during the session. When no one watches, approval rules have to be written down beforehand, the result needs evidence such as test output, screenshots, and preview URLs, and the agent needs a way to notify someone when it is blocked.
- **Credentials.** The developer's own credentials, scoped tokens injected for each task, or a proxy that keeps the real key outside the workspace, as Roomote does ([Credentials]({{< ref "ai-engineering/agents/harnesses/roomote" >}}#credentials)).
- **Where results go.** Changes in the developer's working tree, a branch and pull request, or a comment on a ticket or in chat.

## Common setups


|Setup|Control plane|Agent loop and workspace|Examples|
|---|---|---|---|
|Local, interactive|The developer|The developer's machine, inherited workspace|Claude Code, Codex CLI, Pi|
|Local, isolated|The developer|The developer's machine, with a worktree, a container, or an OS sandbox|Claude Code in a dev container, a worktree per task|
|Remote machine, driven by a person|The developer|A remote machine the developer connects to|A machine reached over SSH, GitHub Codespaces|
|CI as the host|The CI system|A CI runner, prepared by the workflow file|Claude Code GitHub Action, Copilot coding agent on GitHub Actions|
|Hosted asynchronous agent|The vendor|Vendor sandboxes, prepared from a definition|Codex cloud, Claude Code on the web, Devin|
|Self-hosted asynchronous agent|The team's server|Sandboxes from a provider the team chooses|Roomote|

A team can also build its own control plane on a harness that runs as a library or server, such as the Claude Agent SDK, the Codex SDK, Pi's SDK, or the OpenCode server ([Choosing and changing the harness]({{< ref "ai-engineering/agents/environment/ade" >}}#choosing-and-changing-the-harness)). Roomote is one finished example: its control plane runs OpenCode as a server in each sandbox.

CI as the host reuses a system most teams already run. The CI system supplies the trigger, the runner, the credentials, and the path for results. The Claude Code GitHub Action runs on the team's own runner and starts from `@claude` mentions, issue assignments, or workflow events (claude-code-action README). The Copilot coding agent can run on GitHub Actions, where `.github/workflows/copilot-setup-steps.yml` prepares its environment. It can also run in GitHub's cloud sandbox or in a custom environment (GitHub docs).

## What each setup asks of the repository


The repository's commands, documentation, and checks serve every setup. Some parts of the Agent Development Environment work differently from one execution environment to another:

- **Preparing the workspace.** In a terminal, the developer runs `task repo:init` once. In Roomote, the environment definition runs for every task. In CI, the workflow file prepares the runner. When all of them call the same repository command, the setup is defined in one place ([Command layer]({{< ref "ai-engineering/agents/environment/ade" >}}#command-layer)).
- **Reaching the running application.** In a terminal, the agent uses `localhost`. In a remote sandbox, a person reviewing the change needs a preview URL. Commands that start the local stack and return once it is ready work in both cases ([Commands that start services]({{< ref "ai-engineering/agents/environment/command-layer" >}}#commands-that-start-services)).
- **Approvals.** With a person watching, the harness can ask before a risky command. Without one, the rules have to be in permission settings or in the server's policy beforehand ([Where developers and agents differ]({{< ref "ai-engineering/agents/environment/command-layer" >}}#where-developers-and-agents-differ)).
- **Linked directories.** The `agent-docs` and `tasks` links point to directories on the developer's machine ([Shared agent docs]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#shared-agent-docs)). In a fresh sandbox or CI runner those directories don't exist, so the setup has to clone them, or the agent works without them.
- **Docker.** Commands that run tools in containers need Docker in the workspace. Many sandboxes and CI runners don't provide it, or provide it only with extra setup.

## Sources


- VS Code documentation, [Understand agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses).
- Codex docs: [permissions](https://learn.chatgpt.com/codex/permissions), [sandboxing](https://learn.chatgpt.com/codex/sandboxing), [cloud](https://learn.chatgpt.com/codex/cloud), [cloud environments](https://learn.chatgpt.com/codex/environments/cloud-environments). Read 2026-11-14.
- Claude Code docs: [sandboxing](https://code.claude.com/docs/en/sandboxing), [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web). Read 2026-11-14.
- [claude-code-action README](https://github.com/anthropics/claude-code-action). Read 2026-11-14.
- GitHub docs: [customize the Copilot coding agent's environment](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment), [about Codespaces prebuilds](https://docs.github.com/en/codespaces/prebuilding-your-codespaces/about-github-codespaces-prebuilds). Read 2026-11-14.
- E2B docs: [sandbox](https://docs.e2b.dev/sandbox.md). Read 2026-11-14.
- Dev Container specification, [metadata reference](https://containers.dev/implementors/json_reference/).
- Roomote, see the sources in [Roomote]({{< ref "ai-engineering/agents/harnesses/roomote" >}}).
