---
draft: false
toc: true
title: "Roomote"
description: "Analysis of Roomote, a self-hosted cloud coding agent built on OpenCode. Covers its building blocks, how work enters it and how results return, where each part is deployed, and how it maps to the Agent Development Environment."
linkTitle: "Roomote"
---

[Roomote](https://github.com/RooCodeInc/Roomote) is a server that a team hosts itself. It takes work from chat, tickets, pull requests, and schedules, runs a coding agent in a separate sandbox for each task, and returns the result as a pull request, a diff, or an answer. It comes from the team behind Roo Code. Read 2026-11-14 from its README, about 30 pages of its docs, the `AGENTS.md` files of its API, controller, and worker, `SELF_HOSTING.md`, and the harness source files.

The agent inside Roomote is OpenCode. Roomote has no agent loop of its own. It runs OpenCode as a server and changes its behavior with OpenCode plugins, among them a tool-safety plugin, a Slack hooks plugin, a ChatGPT gateway plugin, and an identity plugin. In the levels described in [Choosing and changing the harness]({{< ref "ai-engineering/agents/environment/ade" >}}#choosing-and-changing-the-harness), Roomote extends OpenCode and doesn't fork it.

## Building blocks


| Block                  | What it does                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Surfaces**           | Where work starts and where replies go: Slack, Teams, Telegram, Discord, email, the web dashboard, Linear, comments and events on GitHub, GitLab, Gitea, Bitbucket, and Azure DevOps, an API, and an MCP server through which Claude Code, Codex, or Cursor can hand work to Roomote.                                                                                                        |
| **Session**            | One conversation per piece of work, whichever surface it came from. A session agent answers directly when it can, reads code through the source-control API without cloning, picks an environment, starts tasks, follows them, and posts results back to the surface. A pull request that a task opens belongs to its session, so a comment on that pull request continues the same session. |
| **Task**               | One run in a sandbox, with an OpenCode server inside. It keeps its transcript, logs, diff, preview URL, and artifacts. A task can be stopped and resumed, on some providers from a snapshot.                                                                                                                                                                                                 |
| **Environment**        | A YAML definition of the workspace: repositories, services such as Postgres or Redis, setup commands, ports to preview, environment variables, instructions, MCP servers, and skills.                                                                                                                                                                                                        |
| **Providers**          | Adapters of four kinds: models, sandboxes, source control, and chat. The repository's `AGENTS.md` requires the same features across all providers of one kind.                                                                                                                                                                                                                               |
| **Context and access** | Integrations such as Sentry, Jira, Notion, and Grafana. A "Brain" memory service that indexes Slack, Notion, GitHub and Linear issues, and facts saved from sessions and tasks. Instructions in four layers: deployment-wide guidance, environment guidance, the automation's prompt, and the task prompt.                                                                                                                                                           |
| **Automations**        | Schedules, provider events, manual runs, and webhooks that open an ordinary session. Built-in examples are code review, CI failure triage, Sentry triage, and merge-conflict resolution.                                                                                                                                                                                                     |

The docs separate the session from the task. The session holds the conversation and decides what to do. The task does the work that needs a workspace. Automations, chat, tickets, and the API all create sessions, so one execution model serves every way of starting work.

### Credentials


Service credentials for integrations stay outside the sandbox. A task receives substitute tokens, and an API-side proxy replaces them with the real key on each request after checking that the run is still active. The tokens are bound to one run and expire, so a token restored with a snapshot doesn't work until Roomote delivers it again. This applies the OWASP rule of giving agents only the access their tasks need ([Access]({{< ref "ai-engineering/agents/environment/ade" >}}#access)).

### Environments


The environment definition has the same purpose as a dev container: it turns an empty sandbox into a workspace for the product. Roomote uses its own schema and doesn't read `devcontainer.json`. The definition applies in a fixed order: services start, tools install, Docker projects build, each repository's setup commands run, and the named ports become previews.

Definitions normally live in Roomote's database and are edited in the web app. A deployment can also load them from a mounted directory (`ROOMOTE_ENVIRONMENTS_DIR`) or an environment variable at startup. The file version then overrides edits made in the UI. Roomote keeps its own definition at `.roomote/environments/roomote.yaml`. Roomote doesn't fetch definitions from a remote repository itself, so the deploy pipeline has to mount them.

When an agent proposes creating or changing an environment, it shows the setup and its effect, and waits for approval of that exact proposal.

## How tickets enter


Support depends on the tracker:

- **Linear** is a full surface. A Linear agent session is a Roomote session. Roomote reads the issue, its comments, and the agent guidance, picks the environment, and streams its progress and questions back into Linear.
- **Azure DevOps** work items start work through comments. `@roomote` in a work item comment starts a session and a task on the repository mapped to that project, and Roomote replies in the same discussion. Roomote installs the service hooks itself. The Roomote API has to be reachable from Azure DevOps, and the commenter needs a linked Azure DevOps account.
- **Jira** gives read-only context: issues, projects, workflows, and JQL queries. Jira can't start work.

This differs from the [task directory]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#task-directory) proposed in the note on project knowledge. Roomote doesn't prepare context ahead of time. The session agent reads the ticket through the API when work starts, and the plan and progress live in Roomote's database, outside the repository.

## Where each part runs


A deployment has three parts, and each can run in a different place. [Where coding agents run]({{< ref "ai-engineering/agents/environment/where-agents-run" >}}) compares this setup with the others.

- **Control plane.** Web app, API (webhooks, tRPC, MCP routes, artifacts), controller (starts workers, recovers orphaned runs), BullMQ queues, preview proxy, Postgres, Redis, MinIO for artifacts, and Caddy for HTTPS. It installs with one command on a Linux host, with Docker Compose, or on Railway, Render, Fly.io, or Coolify. The self-hosting guide says the first supported production setup is one host.
- **Sandboxes.** Docker on the same host, or a hosted provider: Modal, E2B, Daytona, Blaxel, Box, or Azure Container Apps (in preview). Docker is the default and the simplest. It shares the host with the control plane and can't spread work across hosts. Hosted providers move task work off the Roomote server.
- **Models.** Any supported provider, a ChatGPT subscription, or local models through Ollama, vLLM, or LiteLLM.

Webhooks from GitHub, Azure DevOps, Linear, and the chat providers need a public address for the API. The guide covers private networks and Cloudflare Tunnel for this case.

## Mapping to the Agent Development Environment


- **Harness.** OpenCode, extended through plugins. The session agent also runs as an OpenCode session.
- **Environment.** Roomote's environment definition is one of the *Setup Definitions* in the [architecture]({{< ref "ai-engineering/agents/environment/ade" >}}#the-broader-architecture): it prepares each task's sandbox, which is that task's execution environment. It lives in Roomote, and only Roomote reads it, so it doesn't meet the ADE goal that every agent gets the same environment. The repository's own commands and docs still serve that goal: setup commands and instructions in the definition can call `task repo:init` or point to `AGENTS.md`.
- **A layer the ADE architecture doesn't have.** Most of Roomote handles work intake and delegation: where requests come from, how they become a session, how the session hands work to a task, and where results return. In the ADE tree this layer would sit between *Agent Runtime* and *Engineering Process*. Its parts are the surfaces, the session agent, the task runner, the sandbox provider, and the delivery path (branch, pull request, preview).

## Findings from the source


[How Roomote assembles an agent session]({{< ref "ai-engineering/agents/harnesses/roomote-session-assembly" >}}) traces both agents in the source. It answers the two questions this note left open:

- **The repository's own `AGENTS.md`.** Tasks run OpenCode 1.18.30 with `OPENCODE_DISABLE_PROJECT_CONFIG=1`, which keeps the repository's OpenCode config, plugins and MCP servers out of the harness. In that version the flag also stops the root `AGENTS.md` and `CLAUDE.md` from loading. Nested `AGENTS.md` files still load when the agent reads files below them. Roomote writes its own workspace-root `AGENTS.md` and tool text that tell the agent to read the repository's files.
- **Where the session agent runs.** In the control-plane process that handles the turn: the API, the web app, or the queue worker. It uses a shared pool of `opencode serve` processes on the server, with one directory per conversation.

## Sources


- [Roomote repository](https://github.com/RooCodeInc/Roomote): [README](https://github.com/RooCodeInc/Roomote/blob/develop/README.md), [LICENSE](https://github.com/RooCodeInc/Roomote/blob/develop/LICENSE), [AGENTS.md](https://github.com/RooCodeInc/Roomote/blob/develop/AGENTS.md), [SELF_HOSTING.md](https://github.com/RooCodeInc/Roomote/blob/develop/SELF_HOSTING.md), [credential egress](https://github.com/RooCodeInc/Roomote/blob/develop/apps/controller/src/credential-egress/README.md), [OpenCode harness](https://github.com/RooCodeInc/Roomote/tree/develop/apps/worker/src/sandbox-server/lib/harnesses/opencode-server). Read 2026-11-14.
- [Roomote docs](https://docs.roomote.dev): how Roomote works, architecture, sessions, environments, environment definition, sandboxes, automations, agent guidance, Linear, Jira, Azure DevOps. Read 2026-11-14 from the [docs sources in the repository](https://github.com/RooCodeInc/Roomote/tree/develop/apps/docs).
