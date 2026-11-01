---
draft: false
toc: true
title: "How Coding Agents Check Actions"
description: "When and how six coding agents check an action before, during and after it runs: commands, file actions, network and integration calls, and limits on a whole run. Separates deterministic checks from checks where a model judges the action."
linkTitle: "Action Checks"
---

[How coding agents set up and restrict their environment]({{< ref "ai-engineering/agents/environment/environment-controls" >}}) lists the concepts six agents use for the workspace and its limits. This note follows one action through those limits: at which stage each check runs, what it looks at, and whether a rule decides or a model judges.

{{< callout context="note" title="Sources" icon="outline/info-circle" >}}
Read 2026-11-14.
- **From source:** Codex (`~/projects/common/codex`, commit `b1573f1024`, paths under `codex-rs/`), OpenCode 2.3.0 (`~/projects/common/opencode`, commit `d759c548aa`, paths under `packages/core/src/` unless noted), Zoo Code (`~/projects/common/Roomote/Zoo-Code`, commit `f2b4d1c0d`), Cline (`~/projects/common/cline`, commit `72b3d71405`), Roomote 1.21.0 (`~/projects/common/Roomote`, commit `6c8d4c3f0`).
- **From official docs:** Claude Code. The permissions, permission modes, sandboxing and hooks pages were only partly read verbatim; the rest came from summaries.

Paths are relative to each repository root. Line numbers will drift.
{{< /callout >}}

## Stages


A tool call can meet checks at five stages:

1. **Tool list.** Before the model sees its tools, some are removed: by deny rules, by the mode, or by a preset.
2. **At the call, before execution.** Hooks, input checks, command parsing, rule matching, path checks, and then the approval decision: allow, deny, ask a person, or ask a reviewer model.
3. **During execution.** The OS sandbox or container, the network proxy, the credential proxy, and timeouts.
4. **After execution.** Output redaction and size limits, post-tool hooks, and commit hooks.
5. **Across the run.** Loop detection, mistake counts, request and cost caps, and pauses after repeated denials.

Rules decide first in every agent. In the three agents that have a model-based check, the model judges only the actions that the rules leave open: an action the rules forbid never reaches it.

## Deterministic and model-based checks


- **Deterministic checks** give the same answer for the same input: pattern rules, command parsers, fixed lists, path checks, counters, and OS enforcement. All six agents have them.
- **Model-based checks** ask a separate model to judge one planned action. Codex, Claude Code and Roomote have them. OpenCode, Zoo Code and Cline use no model to approve or deny an action.

### Codex: the Guardian reviewer


- **When it runs.** When the approval policy is `on-request` or `granular` and `approvals_reviewer` is `auto_review`, or when admin requirements force it (`ext/guardian-reviewer/src/routing.rs:59-67`, `core/src/guardian/decision.rs:108-115`). It runs after hooks and only for actions that would otherwise go to the user (`core/src/tools/approvals.rs:687-705`). It can judge commands, patches, MCP calls, network hosts and requests for more permissions.
- **Setup.** A separate sub-agent with read-only tools, approval policy `never` and no exec rules (`core/src/guardian/review.rs:244-257`). The model is `codex-auto-review`, or `gpt-5.6-luna` with an API key, falling back to the parent model at low effort (`model-provider/src/provider.rs:98-100`).
- **What it receives.** The policy, the permission context, the transcript, retained user instructions, the reason for a retry, and the planned action as JSON. Its prompt opens "You are judging one planned coding-agent action." It treats only user and developer messages, `AGENTS.md` files and answers to its questions as trusted; tool outputs, skills and assistant messages are untrusted evidence (`prompts/templates/guardian/policy_template.md:1-12`).
- **Decision.** It assigns a risk level and the level of user authorization, then an outcome. Low and medium risk are allowed; high risk only when the user authorized it and the action is narrow; critical is always denied (`policy_template.md:66-75`).
- **Failures.** The default timeout is 90 seconds, with 3 attempts on parse errors and server errors. Other errors deny the action. Three denials in a row, or 10 of the last 50, interrupt the turn (`ext/guardian-reviewer/src/circuit_breaker.rs:3-7`).
- **Asynchronous score.** A second classifier scores actions `high` or `low` ahead of time. A current low score lets the action skip the synchronous review (`ext/guardian-v2/src/async_scorer/approval.rs:113-163`).

### Claude Code: the auto mode classifier


- **When it runs.** In `auto` mode, after the rules. Read-only actions and edits in the working directory are approved without it; shell and network actions go to it.
- **What it receives.** User messages, tool calls and `CLAUDE.md`. Tool results are left out, so file or web content can't steer it directly.
- **What it blocks by default.** Piping curl to bash, sending sensitive data out, production deploys, force pushes, `git reset --hard`, and turning off safety settings. Broad allow rules such as `Bash(*)` are dropped on entering auto mode.
- **Failures.** Three blocks in a row, or 20 in total, pause auto mode and return to asking. A classifier with no verdict blocks.
- It also reviews retries outside the sandbox in auto mode.

### Roomote: the judgment model


- **Integration tools in Auto mode.** Only with the `integrationToolAutoApprovals` experiment and the session owner's opt-in (`packages/cloud-agents/src/server/integration-tool-auto-evaluation.ts:790-817`).
  - **Code runs first.** A credential-shaped argument always goes to a person, and an identifier never seen in the session marks the target as unverified (`:545-574`).
  - **The model** (TypeSafe's Jev, no general model allowed) answers scored questions: risk, whether the call only reads, whether it matches the request, whether the user authorized it, whether untrusted content steered it, whether it sends private data out (`:62-149`).
  - **Thresholds** turn the scores into "run" or "ask". The call runs only when the injection, exfiltration and guidance scores are all at most 0.2 and the call is routine, harmless or authorized (`:152-182`, `:381-437`).
  - **Without a judgment model** the answer is "ask". In a task with the owner away, "ask" becomes a denial with a reason (`packages/sdk/src/server/lib/task-tool-approvals.ts:567-615`).
- **Commits.** A git hook runs `judgement check --staged` in each task checkout and judges the staged diff against the repository's `.judgement/rules.json` (`apps/worker/src/run-task/repository-judgement.ts:19-23`, `packages/types/src/judge-policy.ts:3-4`). Without a rules file it passes with no model call.

### A model's own label


The Cline docs say the model marks each command with a `requires_approval` flag. In the source, the command tool `run_commands` has no such field (`sdk/packages/core/src/extensions/tools/schemas.ts:127-176`). The flag survives only in an unused error string. The VS Code extension approves commands from one setting, `executeSafeCommands`, off by default (`apps/vscode/src/shared/AutoApprovalSettings.ts:30-43`).

Codex lets the main model propose a `prefix_rule` or ask for escalation with a justification, but the decision stays with the rules, the reviewer or the user. A proposed rule is dropped if it is too broad: bare shells, interpreters with `-c` or `-e`, `git`, `env`, `sudo`, `rm`, `npm run` and others (`core/src/exec_policy.rs:64-153`).

## Commands


| Agent | How the command is split | Built-in risky-command check | What decides |
|---|---|---|---|
| Codex | tree-sitter splits `bash -c` scripts into plain commands, only for `&&`, `\|\|`, `;`, `\|` without expansions; otherwise the whole command is one unit (`shell-command/src/bash.rs:36-52`, `:103-116`, `:257`) | only `rm` with a force flag; Windows adds a few launch and delete forms (`shell-command/src/command_safety/is_dangerous_command.rs:141-144`) | exec-policy `.rules`, strictest result per segment; then the approval policy; then the reviewer or the user; then the OS sandbox |
| Claude Code | splits `&&`, `\|\|`, `;`, `\|`, `\|&`, `&` and newlines; checks inside `$()`, subshells and loops; strips wrappers such as `timeout`, `nice`, `nohup` | a fixed read-only set (`ls`, `cat`, `grep`, read-only `git` forms) runs without asking; unparseable commands and commands over 10,000 characters ask | deny, then ask, then allow; then the mode; the classifier in auto mode; the sandbox at execution |
| OpenCode | its own shell scanner handles compound commands, subshells, substitutions and control flow; a command it can't analyze is refused without asking (`shell/scan.ts`, `shell/parse.ts:169-170`) | none | rules on a command prefix of 1 to 3 words from an arity table, for example `git push` or `npm run test` (`shell/parse.ts:21-160`) |
| Zoo Code | a quote and heredoc scanner plus shell-quote; `$()`, backticks and process substitution are checked as separate commands (`src/shared/parse-command.ts`) | an optional guard binary, DCG v0.7.7, off by default, with a 3-second limit; any failure stops the command (`src/services/destructive-command-guard/`) | `deniedCommands` and `allowedCommands` by longest prefix, case-insensitive; any denied part blocks the whole command (`src/core/auto-approval/commands.ts:207-265`) |
| Cline | only in Plan mode: masks quotes and heredocs, splits on separators, strips wrappers (`sdk/packages/core/src/extensions/tools/command-guard.ts:479-509`) | Plan mode refuses commands that change files: `rm`, `mv`, `cp`, `mkdir`, `sed -i`, writing redirects, mutating `git` and package-manager subcommands (`command-guard.ts:23-176`) | in Act mode, the `executeSafeCommands` setting, otherwise the user |
| Roomote | none | a regex in the tool-safety plugin blocks `printenv`, bare `env` and `pm2` environment dumps (`apps/worker/src/run-task/opencode-tool-safety-plugin-script.ts:51-54`) | all commands allowed; the sandbox is the limit |

### After a sandbox blocks a command


- **Codex** detects a sandbox denial by exit code and error text (`sandboxing/src/denial.rs:13-72`). Under `untrusted`, or with `granular` sandbox approval, it can retry outside the sandbox after a fresh approval; a reviewer approval doesn't carry over to the retry. Under `on-request` the denial goes back to the model, which can rerun with `require_escalated`.
- **Claude Code** retries outside the sandbox through `dangerouslyDisableSandbox`, following the mode: a prompt by default, the classifier in auto mode, denied in `dontAsk`. `allowUnsandboxedCommands: false` turns retries off.

### Prefix rules are not a boundary


The Claude Code docs say a Bash rule "isn't a security boundary": `/usr/bin/curl` or `sh -c '...'` get past `Bash(curl *)`. In Zoo Code, a denied `rm` prefix doesn't match `sudo rm`, `env X=1 rm` or `/bin/rm`. Codex matches only the executable when it isn't the configured shell or in `/bin` or `/usr/bin` (`core/src/exec_policy/executable_identity.rs:62-102`). Only an OS sandbox holds against commands that a parser misreads.

## Files


- **Inside or outside the workspace.**
  - Codex checks every patch target, including move destinations, against the writable roots (`core/src/safety.rs:67-180`). A patch inside them is approved and still written under the sandbox.
  - OpenCode asks for `external_directory`, but resolves paths by text only, so a symlink inside the project that points outside counts as inside (`file-access.ts:68-137`).
  - Zoo Code marks a path as outside the workspace; the mark only changes whether it is approved automatically.
  - Cline confines only relative paths and accepts any absolute path, and its tool schema asks the model for absolute paths (`sdk/packages/core/src/extensions/tools/editor.ts:28-65`).
- **Protected files.**
  - Codex keeps `.git`, `.agents`, `.codex` and `.aws` read-only inside writable roots, so a patch touching them asks (`protocol/src/permissions.rs:50-61`).
  - Zoo Code always asks before writing `.rooignore`, `.roomodes`, `.roorules*`, `.clinerules*`, `.roo/**`, `.vscode/**`, `*.code-workspace`, `.rooprotected`, `AGENTS.md` and `AGENT.md` (`src/core/protect/RooProtectedController.ts:15-26`).
  - OpenCode, Cline and Claude Code have no fixed list. Claude Code relies on `Edit` deny rules.
- **Ignore files.**
  - Zoo Code's `.rooignore` blocks reads and edits. It blocks a command only when the command starts with a read command such as `cat`, `grep` or `sed` and names an ignored file; chains aren't split for this check (`src/core/ignore/RooIgnoreController.ts:123-172`).
  - Cline's `.clineignore` isn't enforced in the source; the controller is never created. The docs offer an example PreToolUse hook.
  - Claude Code has no ignore file. Its `Read` and `Edit` rules also apply to file commands such as `cat`, `head`, `sed` and to redirect targets, but not to scripts that open files themselves.
- **`.env` files.** OpenCode asks before reading `*.env` and `*.env.*` with the read tool, but `grep` is checked on its pattern, so the rule doesn't cover it. Roomote's plugin refuses `read` of `.env*`, but not `cat .env` through bash.
- **Per-role limits.** Zoo Code's `fileRegex` limits which files a mode may edit, tested against the raw path. OpenCode's plan agent may edit only its plan folder. Cline's Plan mode removes the edit tools.
- **Redirects.** OpenCode treats a redirect target such as `> file` only as part of the command text; it never checks it as a file write.

## Network and integrations


- **Codex** sends traffic through its network proxy (`network-proxy/src/runtime.rs:898-938`):
  - An explicit deny wins.
  - Private and local addresses are blocked unless allowlisted.
  - Limited mode allows only GET, HEAD and OPTIONS.
  - Unknown hosts go to hooks, then the reviewer, then the user; an approval can't override a deny or the local block.
  - `require_escalated` bypasses the proxy.
- **Claude Code** sends sandboxed commands through a proxy with allowed and denied domains. A command that reaches an unknown host waits for a decision.
- **OpenCode** asks for `webfetch` on the URL and checks each redirect against deny rules only. It has no block on private addresses (`tool/plugin/webfetch.ts:71-167`).
- **MCP tool approval.**
  - Codex has per-tool modes (`Auto`, `Prompt`, `Writes`, `Approve`). `Auto` relies on the server's read-only, destructive and open-world hints (`core/src/mcp_tool_call.rs:2801-2829`).
  - Zoo Code has per-tool `alwaysAllow` lists and per-mode `allowedMcpServers`.
  - Roomote fingerprints each approved integration call. The API proxy consumes the approval, so one approval runs exactly one call (`packages/db/src/lib/integration-tool-approvals.ts:66-74`, `:218-233`). Roomote shows `readOnlyHint` to people but never uses it to decide. Tasks can't make GitHub writes through MCP.

## Hooks


Every agent except Roomote lets a team add its own checks as hooks before a tool runs:

- **Codex.** `PreToolUse` can deny with a reason, or allow only together with a changed input; "ask" isn't supported. `PermissionRequest` returns allow or deny, and deny always wins (`hooks/src/engine/output_parser.rs`).
- **Claude Code.** `PreToolUse` returns allow, deny, ask or defer. Deny and ask rules are still checked whatever the hook returns, so a hook can't approve what a rule denies. Prompt and agent hook types let a team add its own model-based check.
- **OpenCode.** `tool.execute.before` can reject a call or change its input. `permission.evaluate` can change any decision, including to allow; managed policy uses it to deny.
- **Zoo Code.** No user hooks for tool calls.
- **Cline.**
  - `PreToolUse` can cancel the run, add context or replace the input.
  - A returned `review` value is parsed but never used.
  - Hook timeouts and errors let the call through (`sdk/packages/core/src/hooks/hook-file-hooks.ts:415-454`, `:577-606`).

## Limits on a run


| Agent | Loop or mistake limit | Other limits |
|---|---|---|
| Codex | the reviewer pauses the turn after 3 denials in a row or 10 of the last 50 | -- |
| Claude Code | auto mode pauses after 3 blocks in a row or 20 in total | -- |
| OpenCode | none | optional step limit per agent; sub-agent depth 1 by default |
| Zoo Code | the 3rd identical call is refused, and 3 mistakes ask the user (`src/core/tools/ToolRepetitionDetector.ts`, `packages/types/src/provider-settings.ts:57-64`) | caps on requests and cost, `allowedMaxRequests` and `allowedMaxCost` |
| Cline | a warning at 3 identical calls and a stop at 5; 6 mistakes, or 3 in the CLI (`sdk/packages/core/src/runtime/safety/loop-detection.ts:113-116`) | no iteration limit in VS Code |
| Roomote | a stop after 5 identical calls (`packages/types/src/agent-safety.ts:2-7`) | 20 minutes per pass; 1,000 model requests per task |

## Gaps visible in the source


- **Zoo Code** creates parent directories and an empty file while a write call is still streaming in, before the mode and `.rooignore` checks run (`src/core/tools/WriteToFileTool.ts:194-255`).
- **Cline**'s SDK doesn't pass the approval policy to sub-agents: approving the spawn approves everything the child does. Plan-mode hooks are inherited. The VS Code extension turns sub-agents off.
- **Roomote**'s tasks can still read the run token and `GH_TOKEN` from the shell; the plugin blocks only the obvious commands and redacts output.
- **OpenCode** doesn't resolve symlinks before its workspace check and doesn't check redirect targets as writes.

## Patterns


- **Model-based checks sit behind rules.** No agent lets a model override a deny rule. The model replaces the person for decisions the rules leave open.
- **The reviewer is a separate model with a narrow view.** Codex marks tool output as untrusted, and Claude Code leaves tool results out. Both try to keep the content an agent reads from steering the check on what it does. Roomote adds a scored question about whether untrusted content steered the call.
- **Command parsing is the main deterministic technique, and the weakest point.** The agents differ most in how they split a command and what they do with a command they can't parse:
  - Codex treats it as one unit.
  - Claude Code asks.
  - OpenCode refuses.
  - Zoo Code reports an error.
- **Built-in risky-command lists are short.** Codex checks only forced `rm`, OpenCode and Roomote have none, Zoo Code's guard is off by default, and Cline's list applies only in Plan mode. The protection against a harmful command comes from the sandbox or from a person.
- **Docs and source can disagree.** Cline's docs describe the `requires_approval` flag and `.clineignore` enforcement, and the source has neither. Checks are worth reading in the source before relying on them.

## Sources


- Codex: `codex-rs/core/src/exec_policy.rs`, `codex-rs/core/src/tools/orchestrator.rs`, `codex-rs/core/src/tools/approvals.rs`, `codex-rs/core/src/safety.rs`, `codex-rs/shell-command/src/`, `codex-rs/prompts/templates/guardian/`, `codex-rs/ext/guardian-reviewer/`, `codex-rs/network-proxy/`, `codex-rs/hooks/`.
- OpenCode: `packages/core/src/shell/scan.ts`, `packages/core/src/shell/parse.ts`, `packages/core/src/permission.ts`, `packages/core/src/file-access.ts`, `packages/core/src/tool/plugin/`.
- Zoo Code: `src/core/tools/ExecuteCommandTool.ts`, `src/core/auto-approval/`, `src/shared/parse-command.ts`, `src/services/destructive-command-guard/`, `src/core/ignore/RooIgnoreController.ts`, `src/core/protect/RooProtectedController.ts`, `src/core/tools/validateToolUse.ts`.
- Cline: `sdk/packages/core/src/extensions/tools/command-guard.ts`, `sdk/packages/core/src/extensions/tools/`, `sdk/packages/core/src/hooks/`, `sdk/packages/core/src/runtime/safety/loop-detection.ts`, `apps/vscode/src/sdk/sdk-tool-policies.ts`, `apps/vscode/src/shared/AutoApprovalSettings.ts`.
- Roomote: `apps/worker/src/run-task/opencode-tool-safety-plugin-script.ts`, `packages/cloud-agents/src/server/integration-tool-auto-evaluation.ts`, `packages/sdk/src/server/lib/task-tool-approvals.ts`, `apps/api/src/handlers/mcp/`, `apps/worker/src/run-task/repository-judgement.ts`, `packages/types/src/agent-safety.ts`.
- Claude Code docs: [permissions](https://code.claude.com/docs/en/permissions), [permission modes](https://code.claude.com/docs/en/permission-modes), [sandboxing](https://code.claude.com/docs/en/sandboxing), [hooks](https://code.claude.com/docs/en/hooks), [security](https://code.claude.com/docs/en/security).
