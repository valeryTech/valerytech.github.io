---
draft: false
toc: true
title: "Readme"
linkTitle: "Readme"
---
# OpenCode system prompts


Copied by [`../extract.py`](/ai-engineering/agents/system-prompts/opencode/readme.assets/extract.py) from [anomalyco/opencode on GitHub](https://github.com/anomalyco/opencode), commit `d759c548aa` (2026-11-14). The prompts live in `packages/core/src/`.

## Source and license


OpenCode is licensed under the MIT License. A copy is in [LICENSE](/ai-engineering/agents/system-prompts/opencode/readme.assets/license).

Changes from the original: the prompts were copied into Markdown files, the tool guidance lines were filled in (see below), and placeholders and tags such as `<system-reminder>` were wrapped in backticks so that Markdown shows them. The wording was not changed.

## How OpenCode builds the system prompt


Every session starts from [Base]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/base" >}}). Its `${OPENCODE_TOOL_GUIDANCE}` slot gets one line per tool for the shell, write and edit tools, and only for tools the session has. The files here show all three lines.

A plugin then picks a prompt by model ID (`plugin/optimize.ts`):

| Model ID contains | Prompt | Effect |
| --- | --- | --- |
| `gpt` and `astra` | [Model Gpt Astra]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-gpt-astra" >}}) | replaces the base prompt |
| `gpt` | [Model Gpt]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-gpt" >}}) | replaces the base prompt |
| `kimi` | [Model Kimi]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-kimi" >}}) | replaces the base prompt |
| `trinity` (Arcee) | [Model Trinity]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-trinity" >}}) | replaces the base prompt |
| `muse` (Meta) | [Model Meta]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-meta" >}}) | replaces the base prompt; `{{MODEL_NAME}}` becomes the model's name |
| `claude` | [Model Anthropic]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-anthropic" >}}) | added after the base prompt |

The plugin skips agents that have their own system prompt.

## Files


| File | Use |
| --- | --- |
| [Agent Explore]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/agent-explore" >}}) | system prompt of the read-only Explore subagent |
| [Agent Title]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/agent-title" >}}) | hidden agent that names sessions |
| [Agent Summary]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/agent-summary" >}}) | hidden agent that summarizes a session |
| [Claude Code Append]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/claude-code-append" >}}) | added to Claude Code's own prompt when OpenCode runs a model through the Claude Code harness; the agent's role follows under `# Agent role (from OpenCode)` |
| [Goal Kickoff]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/goal-kickoff" >}}), [Goal Reminder]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/goal-reminder" >}}), [Goal Continuation]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/goal-continuation" >}}), [Goal Judge]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/goal-judge" >}}) | the goal feature: starting a goal, reminding the model of it, continuing it, and judging whether it is met |
| [Command Initialize]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/command-initialize" >}}) | built-in command that creates or updates `AGENTS.md` |
| [Command Review]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/command-review" >}}) | built-in code review command |
| [Command Schedule]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/command-schedule" >}}) | built-in command for scheduled prompts |
| [Tool Patch]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/tool-patch" >}}), [Tool Todowrite]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/tool-todowrite" >}}) | tool descriptions kept in text files |

The Build and General agents use the base prompt. A subagent started by another session gets "You are a subagent spawned by another session." before its task.

Not copied: the built-in skills in `plugin/skill/`, the patch grammar in `tool/patch-grammar.txt`, and tool descriptions written inside TypeScript files.
