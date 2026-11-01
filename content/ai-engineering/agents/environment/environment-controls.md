---
draft: false
toc: true
title: "How Coding Agents Set Up and Restrict Their Environment"
description: "The concepts six coding agents use for the environment an agent works in: the workspace, where commands run, how the machine is prepared, and how access is restricted. Compares Codex, Claude Code, OpenCode, Zoo Code, Cline and Roomote."
linkTitle: "Environment Controls"
---

[Where coding agents run]({{< ref "ai-engineering/agents/environment/where-agents-run" >}}) describes the setups in which an agent runs. This note compares the concepts that six agents use for the environment inside those setups: what the agent may work on, where its commands run, how that place is prepared, and what restricts the agent. It stays at the level of concepts and terms. The session notes ([Codex]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}), [OpenCode]({{< ref "ai-engineering/agents/harnesses/opencode-agent-assembly" >}}), [Roomote]({{< ref "ai-engineering/agents/harnesses/roomote-session-assembly" >}})) cover how each agent builds its context and runs its loop.

{{< callout context="note" title="Sources" icon="outline/info-circle" >}}
Read 2026-11-14.
- **From source:** Codex (`~/projects/common/codex`, commit `b1573f1024`), OpenCode 2.3.0 (`~/projects/common/opencode`, commit `d759c548aa`), Zoo Code (`~/projects/common/Roomote/Zoo-Code`, commit `f2b4d1c0d`).
- **From the session notes:** Roomote 1.21.0 (commit `6c8d4c3f0`).
- **From official docs:** Claude Code and Cline. The Claude Code pages on sandboxing, permissions, hooks and cloud environments, and Cline's hooks page, were only partly read.
- **Checked later in source:** Cline (`~/projects/common/cline`, commit `72b3d71405`). The Cline section reflects the source where it differs from the docs.

Zoo Code is the community continuation of Roo Code, which started as a fork of Cline. Roomote runs OpenCode 1.18.30, not the 2.3.0 runtime read here.
{{< /callout >}}

## Four questions


Every agent's execution environment, the place where a session runs ([Execution environment]({{< ref "ai-engineering/agents/environment/ade" >}}#execution-environment)), answers the same four questions:

1. **Workspace.** Which directories the agent works in, and what counts as outside them.
2. **Execution backend.** Where commands run: the developer's machine, a container, a virtual machine, or a remote executor.
3. **Preparation.** How the backend gets ready before the agent starts: nothing, a setup script, an environment definition, an image or a snapshot.
4. **Controls.** What limits the agent.

The controls are of two kinds:

- **Confinement** is enforced outside the agent: by an OS sandbox, a container or virtual machine, or a network or credential proxy. It holds for any command the agent runs, including a shell command the harness can't interpret.
- **Rules** are enforced by the harness: approvals, allow and deny lists, ignore files, protected files, and modes. They cover only the actions that pass through the harness's own tools.

Four further concepts sit next to these: tool sets by role, undo, secrets, and trust and admin policy.

## Terms by agent


| Concept               | Codex                                                                                                     | Claude Code                                                                      | OpenCode                                                                    | Zoo Code                                                                             | Cline                                                   | Roomote                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------- |
| Workspace             | `cwd`, writable roots, `--add-dir`                                                                        | primary working directory, additional directories                                | Location (directory plus workspace), Project                                | workspace path, `task.cwd`                                                           | workspace root, multi-root workspace                    | task workspace, `REPOSITORIES.md`, Blank slate                      |
| Outside the workspace | paths outside the writable roots                                                                          | writes blocked by the sandbox                                                    | `external_directory` permission                                             | approvals with `OutsideWorkspace` in their names                                     | "all files" approvals                                   | not used; the whole sandbox is the workspace                        |
| Parallel copies       | managed worktree                                                                                          | worktree, `.worktreeinclude`                                                     | worktree tools, `session_move`                                              | `WorktreeService`, `.worktreeinclude`                                                | worktree per Kanban card                                | one sandbox per task                                                |
| Execution backend     | Environment: local or remote exec server                                                                  | host, dev container, cloud VM                                                    | Environment with a driver; `WorkspaceDriver` supplied by a host application | VS Code terminal or execa on the host                                                | host; cloud sandbox                                     | sandbox from a compute provider                                     |
| Preparation           | provisioning states, Codex Cloud environments, shell snapshot                                             | cloud environment with setup script and cache; dev container                     | none in core                                                                | none                                                                                 | cloud sandbox; setup not documented                     | environment definition, recipe, setup commands, snapshot or standby |
| Confinement           | permission profiles enforced by Seatbelt, bubblewrap with seccomp, Windows backends; network proxy        | sandbox for Bash only; network proxy with allowlist                              | none                                                                        | none                                                                                 | none locally; cloud sandbox                             | container or VM; Docker egress policy; credential proxy             |
| Approval rules        | approval policy (`untrusted`, `on-request`, `granular`, `never`); exec policy `.rules` with `prefix_rule` | permission modes; allow, ask and deny rules such as `Read()`, `Edit()`, `Bash()` | rules of action, resource and effect; Unattended ruleset                    | auto-approve toggles; `allowedCommands`, `deniedCommands`; destructive command guard | auto-approve settings; Plan-mode command guard; YOLO in the CLI | built-in tools allowed; approvals for integration tools             |
| File rules            | `.git`, `.agents`, `.codex`, `.aws` read-only; per-path access modes                                              | `Read` and `Edit` deny rules; no ignore file                                     | ask before reading `.env` files                                             | `.rooignore`; protected list                                                         | `.clineignore`, only through an example hook                 | tool-safety plugin blocks reading `.env*`                           |
| Tool sets by role     | collaboration modes, agent roles, feature flags                                                           | plan mode; sub-agent `tools` and `disallowedTools`                               | agents defined by permissions (build, plan, explore)                        | modes, tool groups, `fileRegex`                                                      | Plan and Act modes                                      | separate tool policies for the session agent and the task agent     |
| Undo                  | none active                                                                                               | checkpoints, `/rewind`                                                           | snapshots, session revert                                                   | shadow-git checkpoints                                                               | shadow-git checkpoints                                  | branch and pull request                                             |
| Secrets               | `shell_environment_policy`; credential masking                                                            | `sandbox.credentials` deny or mask; environment scrub                            | nothing built in; plugin hook                                               | full environment passed to commands                                                  | not documented                                          | substitute tokens with an egress proxy                              |
| Trust and admin       | project trust, `requirements.toml`                                                                        | workspace trust, managed settings                                                | managed policies from the Console                                           | MDM, organization allowList                                                          | not documented                                          | deployment settings                                                 |

## Each agent in short

### Codex


The workspace is a `cwd` plus writable roots, and it sits inside an **Environment**: a local or remote execution backend attached to each thread and turn (`codex-rs/exec-server/src/environment.rs:704`). A remote environment can still be provisioning when the agent starts, and a `wait_for_environment` tool waits for it.

Limits come from **permission profiles** (`:read-only`, `:workspace`, `:danger-full-access`, or custom `[permissions.<id>]`). They replace the older `sandbox_mode` (`codex-rs/protocol/src/models.rs:419-431`). A profile splits into a filesystem policy and a network policy, enforced by a platform sandbox:

- Seatbelt on macOS
- bubblewrap with seccomp on Linux
- restricted-token, elevated, or MXC container backends on Windows

`.git`, `.agents`, `.codex` and `.aws` stay read-only even inside writable roots (`codex-rs/protocol/src/permissions.rs:50-61`). Several mechanisms decide when the agent asks or is blocked:

- the approval policy
- Starlark exec-policy rules (`prefix_rule` with allow, prompt or forbidden)
- project trust
- admin constraints in `requirements.toml`

`shell_environment_policy` filters the variables commands receive and drops names matching `*KEY*`, `*SECRET*` and `*TOKEN*` by default (`codex-rs/protocol/src/config_types.rs:236-240`). Codex has no active undo: ghost snapshots and rollback remain only so old configs and sessions still load.

### Claude Code


The workspace is the primary working directory plus additional directories. The machine can be the host, a dev container, or an Anthropic-managed VM for cloud sessions. A cloud environment holds network access, environment variables and a setup script, and its setup is cached.

There are two kinds of limits:

- **The sandbox** confines Bash commands only: filesystem writes are limited to the workspace and temporary directories, and network traffic goes through a proxy with allowed and denied domains. File tools, hooks and MCP servers run outside it.
- **Permission rules** cover all tools:
	- modes: default, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`
	- allow, ask and deny lists with patterns such as `Read(./.env)`, `Edit(/src/**)` and `Bash(npm run *)`
	- managed settings that override the user and the project

There is no ignore file; the docs point to `Read` deny rules instead. Checkpoints are taken before each turn and restored with `/rewind`. Sub-agents limit their tools with `tools` and `disallowedTools`.

### OpenCode


Everything is scoped to a **Location**: a directory plus an optional workspace ID (`packages/core/src/location.ts:16`). The Location resolves to a **Project**, found by `.git` or `.hg` markers. Commands run through an **Environment** whose driver is either the local host or a **WorkspaceDriver** with `create`, `connect`, `suspendForIdle` and `destroy` (`packages/core/src/workspace/driver.ts:26`). Core ships no driver of that kind: a host application has to supply one.

There is no confinement; `SECURITY.md` says the permission system is a user-interface feature, not isolation, and suggests Docker or a VM. Limits are permission rules of action, resource and effect:

- per agent, from config, saved per project
- an **Unattended** ruleset that denies whatever it doesn't allow
- managed policies from the Console

`external_directory` marks the boundary of the workspace. Undo comes from shadow-git snapshots with session revert. The only built-in secret rule is asking before reading `.env` files.

### Zoo Code


The workspace is one task `cwd` taken from the VS Code workspace, with a setting for choosing the root in a multi-root window (`src/utils/path.ts:152`). Worktrees open in a new window and copy untracked files listed in `.worktreeinclude`. Commands run on the host, in a VS Code terminal or through execa. There is no sandbox and no environment preparation.

Access is controlled by approval:

- auto-approve toggles for reads, writes, commands, MCP, mode switches and subtasks, each with variants inside and outside the workspace
- `allowedCommands` and `deniedCommands` matched by longest prefix
- a destructive command guard
- `.rooignore`, a gitignore-style deny list that also refuses commands touching ignored files (`src/core/ignore/RooIgnoreController.ts:68`)
- a fixed list of protected files that always need approval to write: `.rooignore`, `.roomodes`, `.roorules*`, `.clinerules*`, `.roo/**`, `.vscode/**`, `*.code-workspace`, `AGENTS.md` (`src/core/protect/RooProtectedController.ts:15`)

**Modes** limit tools through tool groups (`read`, `edit`, `command`, `mcp`, `modes`). A group can carry a `fileRegex`: the Architect mode may edit only `\.md$` files (`packages/types/src/mode.ts:10`). Custom modes come from `.roomodes` in the project or `custom_modes.yaml` globally. Undo is shadow-git checkpoints, which refuse to run in the home, Desktop, Documents or Downloads folders. Commands receive the extension's full environment.

### Cline


The workspace is the project root, with one `.clineignore` per root in a multi-root workspace. Kanban gives each card its own worktree. Cloud agents run each task in its own sandbox on a `cline/` branch; rules, skills and MCP servers don't load there.

Locally there is no confinement:

- **Auto-approve settings** in the VS Code extension cover reading files, editing files, commands, the browser and MCP. They don't depend on whether a path is inside the workspace (`apps/vscode/src/shared/AutoApprovalSettings.ts:30-43`).
- The docs say the model marks each command with `requires_approval`. In the source, the command tool has no such field, and the extension approves commands from one setting, `executeSafeCommands`.
- **YOLO** exists in the CLI (`--yolo`), and one-shot CLI runs default to it. In the extension, the old toggle became "all actions on".
- **Plan and Act**: Plan mode removes the edit tools and keeps the shell, with a fixed guard that refuses commands that change files (`sdk/packages/core/src/extensions/tools/command-guard.ts`).
- `.clineignore` is marked for deprecation. The source doesn't enforce it; the docs offer an example PreToolUse hook.
- Checkpoints are kept in a shadow git repository after each tool use.

### Roomote


The whole sandbox is the workspace. Repositories are listed in `REPOSITORIES.md`, and a Blank slate task starts with no repository. The backend is a sandbox from a compute provider: Docker, Modal, E2B, Daytona, Blaxel, Box or Azure.

- **Preparation** is Roomote's own environment definition: services, tools, Docker Compose, setup commands, ports, instructions, MCP servers and skills. A recipe can generate it, and a snapshot or standby keeps the prepared state.
- **Confinement** is the container or VM, a Docker egress policy, and a credential proxy that keeps service keys out of the sandbox.
- **Inside the sandbox,** OpenCode's built-in tools are allowed without asking, and the agent has passwordless sudo. Approvals apply only to integration tools.
- **Undo** is the branch and pull request; snapshots exist to resume a task.

[Credentials and isolation]({{< ref "ai-engineering/agents/harnesses/roomote-session-assembly" >}}#credentials-and-isolation) has the details.

## Observations


[How coding agents check actions]({{< ref "ai-engineering/agents/environment/action-checks" >}}) follows one action through these controls, stage by stage, and separates deterministic checks from model-based ones.

- **Only two local agents confine anything.** Codex and Claude Code use OS sandboxes. OpenCode, Zoo Code and Cline rely on approvals. Cloud runners confine by infrastructure: Roomote, Claude Code on the web, and Cline's cloud agents.
- **Rules cover only the harness's own tools.** An ignore file keeps a file out of the read tool, but a shell command can still print it:
	- Zoo Code refuses commands that touch ignored files.
	- Cline doesn't enforce `.clineignore` itself; a team has to install the example hook.
	- Claude Code relies on deny rules for files and on the sandbox for commands, and its sandbox doesn't cover file tools.
- **Preparation exists where a server owns the machine.** Local agents inherit the developer's machine. Codex has a model of remote environments with provisioning states, and OpenCode 2.x has the `WorkspaceDriver` extension point without an implementation. Only hosted or self-hosted runners have setup definitions.
- **Two agents protect their own instruction files.** Codex keeps `.git`, `.agents`, `.codex` and `.aws` read-only. Zoo Code always asks before writing `.roo/**`, `.vscode/**`, `AGENTS.md` and its mode files. The agent can't change its own rules without someone seeing it.
- **Only Zoo Code limits tools to certain files per mode.** `fileRegex` on the edit group restricts a mode to matching files. OpenCode's plan agent is a narrower case of the same idea: it can edit only its plan folder.
- **Undo takes three forms.** IDE agents keep shadow-git checkpoints (Claude Code, Cline, Zoo Code). OpenCode has snapshots with revert. Codex dropped its undo feature, and Roomote relies on branches and pull requests.
- **Secret handling varies the most.**
	- Codex and Claude Code filter or mask variables.
	- Roomote keeps service keys behind a proxy but leaves some tokens in the shell.
	- OpenCode and Zoo Code pass the environment through unchanged.

## What a repository can supply


Several controls are files a team can keep in the repository:

| File | Read by | What it controls |
|---|---|---|
| `.claude/settings.json` | Claude Code | permission rules, sandbox settings |
| `.codex/config.toml`, `.codex/rules/*.rules` | Codex (trusted projects) | permission profile, exec policy |
| `opencode.json` | OpenCode | permission rules, agents |
| `.roomodes`, `.rooignore` | Zoo Code | modes and their tool groups, ignored files |
| `.clineignore` with a hook | Cline | files kept out of context |
| `.worktreeinclude` | Claude Code, Zoo Code | untracked files copied into new worktrees |
| `devcontainer.json` | Claude Code and other dev-container tools | the container the agent runs in |
| a setup command such as `task repo:init` | any runner whose setup calls it | workspace preparation |

Each file except the last is read by only one or two harnesses. In the [ADE note]({{< ref "ai-engineering/agents/environment/ade" >}}#agent-development-environment), files like these sit on the boundary between the harness and the environment. The setup command is the one piece every runner can share, as long as each runner's setup calls it ([What each setup asks of the repository]({{< ref "ai-engineering/agents/environment/where-agents-run" >}}#what-each-setup-asks-of-the-repository)).

## Sources


- Codex: `codex-rs/protocol/src/permissions.rs`, `codex-rs/protocol/src/models.rs`, `codex-rs/exec-server/src/environment.rs`, `codex-rs/execpolicy/README.md`, `codex-rs/linux-sandbox/README.md`, `codex-rs/network-proxy/README.md`, `codex-rs/config/src/config_requirements.rs`.
- OpenCode: `SECURITY.md`, `packages/core/src/location.ts`, `packages/core/src/project.ts`, `packages/core/src/environment/`, `packages/core/src/workspace/driver.ts`, `packages/core/src/permission.ts`, `packages/core/src/snapshot.ts`.
- Zoo Code: `src/core/ignore/RooIgnoreController.ts`, `src/core/protect/RooProtectedController.ts`, `packages/types/src/global-settings.ts`, `packages/types/src/mode.ts`, `src/services/checkpoints/ShadowCheckpointService.ts`, `packages/core/src/worktree/`.
- Claude Code docs: [settings](https://code.claude.com/docs/en/settings), [permissions](https://code.claude.com/docs/en/permissions), [sandboxing](https://code.claude.com/docs/en/sandboxing), [dev containers](https://code.claude.com/docs/en/devcontainer), [cloud environments](https://code.claude.com/docs/en/cloud-environments), [checkpointing](https://code.claude.com/docs/en/checkpointing), [worktrees](https://code.claude.com/docs/en/worktrees), [sub-agents](https://code.claude.com/docs/en/sub-agents).
- Cline docs: [.clineignore](https://docs.cline.bot/customization/clineignore), [auto-approve](https://docs.cline.bot/features/auto-approve), [Plan and Act](https://docs.cline.bot/core-workflows/plan-and-act), [checkpoints](https://docs.cline.bot/core-workflows/checkpoints), [cloud agents](https://docs.cline.bot/usage/cloud-agents), [Kanban](https://docs.cline.bot/usage/kanban), [subagents](https://docs.cline.bot/features/subagents).
- Roomote: [How Roomote assembles an agent session]({{< ref "ai-engineering/agents/harnesses/roomote-session-assembly" >}}).
