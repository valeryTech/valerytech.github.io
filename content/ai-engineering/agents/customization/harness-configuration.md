---
draft: false
toc: true
title: "What a Team Can Set in a Harness It Doesn't Change"
description: "What a team can set when it can't change its coding harness: instruction files, skills, subagents, tools, permission rules, the sandbox, hooks, and checks in Claude Code, Codex, and Droid, and what that means for AGENTS.md."
linkTitle: "Harness Configuration"
---

This note looks at a constrained situation: the team uses a harness it can't change, such as Claude Code, Codex, or Factory's Droid, and can only set what the harness reads. It lists what the team can set, describes each part by three properties, and draws the consequences for a minimal `AGENTS.md`. It was written in step 25 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}). Most of what it lists makes up the [Agent Customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}), and the command layer, checks, git hooks, CI, and branch protection are part of the [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}).

## The Constraint


[Choosing and changing the harness]({{< ref "ai-engineering/agents/environment/ade" >}}#choosing-and-changing-the-harness) names four levels of changing a harness: configure, extend, fork, and build. Here the team uses the first two: it writes the settings and files the harness reads, and it uses the extension points the harness already has, such as hooks, skills, subagents, and MCP servers. The harness's code, its agent loop, and its system prompt stay as they are.

## What the Harness Fixes


The harness decides most of what the agent sees and how it works: the system prompt, the built-in tools and their descriptions, the agent loop, when instruction files load, what compaction keeps, and how approvals work. In one Codex session, the tool definitions and the system prompt were 77% of the first request, and the project's `AGENTS.md` was 2,725 of 55,898 characters, about 5% ([Checking the assembled context]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#checking-the-assembled-context)).

So `AGENTS.md` is one small part of the context the harness assembles, and the harness's own parts already tell the agent how to use its tools, how to edit files, and when to ask for approval. In Codex, the permissions part alone is a guide of about 4,000 characters on asking for more access ([Examples of the first request]({{< ref "ai-engineering/agents/harnesses/codex-base-instructions" >}}#examples-of-the-first-request)). The root file doesn't need to repeat any of this. Codex also lets the settings replace the system prompt (`model_instructions_file`), but this note leaves that out: the replaced prompt would have to be kept in step with the harness's tools by the team.

## What the Team Can Set

### Instructions the Harness Loads


- **The root `AGENTS.md`.** It loads in every session. Codex and Droid read `AGENTS.md`, and Droid also reads `CLAUDE.md` under a compatible name ([Factory 2026a](#factory-2026a)). Claude Code reads `CLAUDE.md`, which has to import `AGENTS.md` ([Keep one core for all agents]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#keep-one-core-for-all-agents)).
- **Nested `AGENTS.md` files.** They load for one folder, and each harness loads them at a different moment. Codex joins the files from the project root down to the session's working directory, so a nested file loads only when the session starts in its folder or moves there ([AGENTS.md in Codex]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#agentsmd)). Droid loads a nested file when the agent reads, edits, lists, or searches files in its folder, and shell commands don't trigger it ([Factory 2026a](#factory-2026a)). Claude Code loads a nested `CLAUDE.md` when the agent reads files in its folder.
- **A user-level file**, such as `~/.codex/AGENTS.md`, `~/.claude/CLAUDE.md`, or a file in `~/.factory/`. It loads in every session of one person, in every project.
- **Instructions in the settings.** Codex adds `developer_instructions` from its config as a developer message ([Config layers]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#config-layers)).

### Knowledge the Agent Loads When It Needs It


- **Skills.** A skill is a folder with a `SKILL.md` file. Its name and description are in the context of every session, and its instructions load when the agent decides a task needs them or the person invokes it. Codex reads skills from `.agents/skills` and `.codex/skills` and limits the list to 2% of the context window ([Skills in Codex]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#skills)). Droid reads `.factory/skills`, the folder-specific `<folder>/.factory/skills`, and `.agents/skills`; a skill can be limited to the person invoking it, and its `allowed-tools` field doesn't limit the agent's tools ([Factory 2026b](#factory-2026b)). Claude Code reads `.claude/skills`.
- **Docs in the repository.** They load when the agent follows a link from `AGENTS.md`, a skill, or another doc.
- **Custom subagents.** Each has a description in the main agent's context, and its own prompt, tools, and model in a separate context. A Droid custom droid in `.factory/droids/` sets its prompt, tools, model, reasoning effort, and MCP servers ([Factory 2026c](#factory-2026c)). A Claude Code subagent in `.claude/agents/` limits its tools with `tools` and `disallowedTools` ([Claude Code]({{< ref "ai-engineering/agents/environment/environment-controls" >}}#claude-code)). A Codex agent role changes only a few settings and can't replace the system prompt ([Agent roles]({{< ref "ai-engineering/agents/harnesses/codex-base-instructions" >}}#agent-roles)).
- **Commands the person invokes.** Droid reads Markdown or executable commands from `.factory/commands`, and its docs recommend skills for new reusable workflows ([Factory 2026d](#factory-2026d)). They take context only when the person runs them.

### Tools and Commands


- **The command layer.** Named commands for setup, checks, running the application, diagnostics, and remote operations, with a catalog the agent can print ([Command layer]({{< ref "ai-engineering/agents/environment/ade" >}}#command-layer)). A command takes context when the agent reads the catalog or runs it, and it works the same for every harness and for people.
- **Scripts and command-line tools** installed in the environment, which the agent runs through the shell.
- **MCP servers.** They add tools for systems outside the repository. Their tool descriptions take context in every session, unless the harness defers them: Codex defers MCP tools when the model supports tool search ([MCP tools]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#mcp-tools)). Droid reads `.factory/mcp.json` and can enable or disable single tools ([Factory 2026e](#factory-2026e)), and Claude Code reads `.mcp.json`.
- **Tool sets for subagents**, described above.

### Limits on Actions


- **Permission rules.** Allow, ask, or deny an action by tool, command, or path. Claude Code keeps them in `.claude/settings.json`, and Codex in `.codex/rules/*.rules` for trusted projects ([What a repository can supply]({{< ref "ai-engineering/agents/environment/environment-controls" >}}#what-a-repository-can-supply)). Droid keeps them in `permissionRules` in `.factory/settings.json`, matches the exact first words of a command, applies block before ask before allow, and uses project rules only in trusted workspaces ([Factory 2026f](#factory-2026f)). The harness enforces them only for actions that go through its own tools.
- **The mode or autonomy level.** Claude Code has permission modes, Codex has an approval policy and a sandbox mode ([Approval and sandbox settings]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#approval-and-sandbox-settings)), and Droid has autonomy levels from Off to High and a read-only planning mode ([Factory 2026g](#factory-2026g)). The project can set a default, and the person often changes it during a session.
- **The sandbox.** It confines the agent's commands at the level of the operating system, so it holds for any command, including one the harness can't parse ([Four questions]({{< ref "ai-engineering/agents/environment/environment-controls" >}}#four-questions)). Claude Code's sandbox covers shell commands only ([Claude Code]({{< ref "ai-engineering/agents/environment/environment-controls" >}}#claude-code)). Droid's sandbox sets allowed writes, denied reads, and allowed network domains, and also covers hooks, MCP servers, subagents, and file tools ([Factory 2026h](#factory-2026h)).
- **Hooks before a tool call.** A command that runs before the tool and can block it with a reason. All three harnesses have them ([Hooks]({{< ref "ai-engineering/agents/environment/action-checks" >}}#hooks)). In Droid such a hook can also rewrite the tool's input, and invalid output from a hook lets the call through unless the hook is set to block on failure ([Factory 2026i](#factory-2026i)).
- **The execution environment**: the machine or container the agent runs in, and which credentials exist there.

### Checks on Results


- **Hooks after a tool call and at the end of a turn.** A hook after an edit can run the formatter or the linter and report the errors back to the agent. A hook at the end of a turn can run the checks and keep the agent working until they pass; Droid's `Stop` hook can do this ([Factory 2026i](#factory-2026i)), and Codex runs its Stop hooks before it ends a turn ([Turn loop]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#turn-loop)).
- **Checks as commands.** Tests, linters, type checks, and structural checks. Their output enters the context when they fail, so the error message is also something the team writes.
- **Git hooks and CI.** They run outside the harness and hold for every agent and every person.

### Context Added by Events


- **Hooks that add context.** Hooks at the start of a session or on each prompt can add text to the context, such as the current branch or the state of a task. Codex accepts added context from `SessionStart`, `UserPromptSubmit`, `PreToolUse`, and `PostToolUse` hooks ([Hooks in Codex]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#hooks)), and Droid from `SessionStart`, `UserPromptSubmit`, and `PostToolUse` hooks ([Factory 2026i](#factory-2026i)).
- **Memory features** of the harness, such as Codex memories, which are off by default ([Memories feature]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#memories-feature)). They keep what one person's sessions learned, outside the repository.

### Session Settings


The model, the reasoning effort, the compaction prompt in Codex, and size limits for instruction files: 32 KiB for project files in Codex and 80,000 characters at startup in Droid ([AGENTS.md in Codex]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#agentsmd); [Factory 2026a](#factory-2026a)).

### Outside the Harness


Branch protection, required review, deploy rights, and the scope of credentials. They hold for every agent and person, and they're where work becomes shared or has an effect outside the workspace ([commitment points]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#contributions-effects-and-commitment-points)).

## Three Properties That Decide Where Something Goes


Each part above can be described by three properties:

- **When it takes the agent's context:** in every session, when the agent works in a folder, when the agent or the person invokes it, when an event fires, when something fails, or never.
- **Whether it holds when the agent doesn't follow it:** guidance, which the agent weighs; a rule, which the harness enforces for actions through its own tools; confinement, which holds for any command; or a check outside the harness.
- **Who it reaches:** one harness, several harnesses that read the same file, or every agent and person.

| What the team sets | When it takes the agent's context | Whether it holds when the agent doesn't follow it | Who it reaches |
| :--- | :--- | :--- | :--- |
| Root `AGENTS.md` | Every session | Guidance | All three harnesses, Claude Code through an import |
| Nested `AGENTS.md` | When the agent works in the folder, by each harness's own rule | Guidance | All three harnesses, at different moments |
| User-level file | Every session of one person | Guidance | One person in one harness |
| Instructions in the settings | Every session | Guidance | One harness |
| Skill | Name and description in every session, instructions when invoked | Guidance | The harnesses that read its folder |
| Doc | When the agent follows a link | Guidance | Every agent and person |
| Custom subagent | Description in every session, its prompt in its own context | Guidance, with a tool set the harness enforces | One harness |
| Command the person invokes | When the person runs it | Guidance | One harness |
| Command in the command layer | When the agent reads the catalog or runs it | Runs the same steps every time | Every agent and person |
| MCP server | Tool descriptions in every session, unless deferred | Depends on the tools | The harnesses configured for it |
| Permission rule | When an action matches | Rule | One harness |
| Mode or autonomy level | Every session, as a short text | Rule | One harness, per session |
| Sandbox | Never, except when it blocks a command | Confinement | One harness, or every agent when it's a container |
| Hook before or after a tool call, or at the end of a turn | When it blocks or reports | Rule, as long as the hook itself doesn't fail | One harness; the command it runs can be shared |
| Check as a command | When it fails | Holds when it runs | Every agent and person |
| Git hook, CI | Only when the agent runs them | Check outside the harness | Every agent and person |
| Hook that adds context | When its event fires | Guidance | One harness |
| Branch protection, review, deploy rights | Never | Check outside the harness | Every agent and person |

## What This Means for a Minimal AGENTS.md


The root `AGENTS.md` is the only part that is guidance, takes context in every session, and reaches all three harnesses. Everything else has a narrower moment, a stronger hold, or a narrower reach. So the root file can be short and hold the project's principles, such as the purpose and stage of the project, its sources of truth, what done means, and its hard constraints and defaults. The rest goes to the part whose properties fit it:

- **A procedure for one type of task** goes to a skill. The harness lists the skills itself, so the root file doesn't need to name them.
- **A workflow the agent repeats** goes to a named command, and the root file has one line for the catalog.
- **An action that must not happen** goes to a permission rule, and to the sandbox when it must hold for any command.
- **A check that must run** goes to a command, run by a hook in each harness and by CI. The hook's settings belong to one harness, and the command it runs is shared, as [Choosing and changing the harness]({{< ref "ai-engineering/agents/environment/ade" >}}#choosing-and-changing-the-harness) suggests.
- **The state of a task** goes to files in the repository or the task folder, and a hook at the start of a session can add a pointer to it.
- **Guidance for one folder** goes to a nested file, keeping in mind that the harnesses load it at different moments.
- **A decision that belongs to people** goes to branch protection, review, and deploy rights, which hold outside every harness.

## Open Questions


- How to see the assembled context in each harness. Codex has `codex debug prompt-input` ([Checking the assembled context]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#checking-the-assembled-context)); the other two need their own way.
- Whether to keep one folder of skills for several harnesses. Codex and Droid both read `.agents/skills`, and Claude Code reads `.claude/skills`.
- How much of what the root file says the harness's system prompt already says.
- How to test that a hook holds, since a hook that fails can let the action through.

## References


- Factory (2026a). [AGENTS.md](https://docs.factory.com/docs/harness/agents-md). Droid documentation. ^factory-2026a
- Factory (2026b). [Skills](https://docs.factory.com/docs/harness/skills). Droid documentation. ^factory-2026b
- Factory (2026c). [Subagents](https://docs.factory.com/docs/harness/subagents). Droid documentation. ^factory-2026c
- Factory (2026d). [Custom Slash Commands](https://docs.factory.com/docs/harness/custom-slash-commands). Droid documentation. ^factory-2026d
- Factory (2026e). [MCP](https://docs.factory.com/docs/harness/mcp). Droid documentation. ^factory-2026e
- Factory (2026f). [Permission Rules](https://docs.factory.com/docs/autonomy-and-safety/permission-rules). Droid documentation. ^factory-2026f
- Factory (2026g). [Auto-Run](https://docs.factory.com/docs/autonomy-and-safety/auto-run). Droid documentation. ^factory-2026g
- Factory (2026h). [Sandbox](https://docs.factory.com/docs/autonomy-and-safety/sandbox). Droid documentation. ^factory-2026h
- Factory (2026i). [Hooks](https://docs.factory.com/docs/harness/hooks). Droid documentation. ^factory-2026i
