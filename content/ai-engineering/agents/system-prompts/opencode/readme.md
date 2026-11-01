---
draft: false
toc: true
title: "Readme"
linkTitle: "Readme"
---
# OpenCode system prompts


Copied by [`../extract.py`](/ai-engineering/agents/system-prompts/opencode/readme.assets/extract.py) from <https://github.com/anomalyco/opencode>, commit `d759c548aa` (2026-11-14). The prompts live in `packages/core/src/`.

## Source and license


OpenCode is licensed under the MIT License. A copy is in [LICENSE](/ai-engineering/agents/system-prompts/opencode/readme.assets/license).

Changes from the original: the prompts were copied into Markdown files, the tool guidance lines were filled in (see below), and placeholders and tags such as `<system-reminder>` were wrapped in backticks so that Markdown shows them. The wording was not changed.

## How OpenCode builds the system prompt


Every session starts from [base.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/base" >}}). Its `${OPENCODE_TOOL_GUIDANCE}` slot gets one line per tool for the shell, write and edit tools, and only for tools the session has. The files here show all three lines.

A plugin then picks a prompt by model ID (`plugin/optimize.ts`):

| Model ID contains | Prompt | Effect |
| --- | --- | --- |
| `gpt` and `astra` | [model-gpt-astra.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-gpt-astra" >}}) | replaces the base prompt |
| `gpt` | [model-gpt.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-gpt" >}}) | replaces the base prompt |
| `kimi` | [model-kimi.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-kimi" >}}) | replaces the base prompt |
| `trinity` (Arcee) | [model-trinity.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-trinity" >}}) | replaces the base prompt |
| `muse` (Meta) | [model-meta.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-meta" >}}) | replaces the base prompt; `{{MODEL_NAME}}` becomes the model's name |
| `claude` | [model-anthropic.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/model-anthropic" >}}) | added after the base prompt |

The plugin skips agents that have their own system prompt.

## Files


| File | Use |
| --- | --- |
| [agent-explore.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/agent-explore" >}}) | system prompt of the read-only Explore subagent |
| [agent-title.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/agent-title" >}}) | hidden agent that names sessions |
| [agent-summary.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/agent-summary" >}}) | hidden agent that summarizes a session |
| [claude-code-append.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/claude-code-append" >}}) | added to Claude Code's own prompt when OpenCode runs a model through the Claude Code harness; the agent's role follows under `# Agent role (from OpenCode)` |
| [goal-kickoff.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/goal-kickoff" >}}), [goal-reminder.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/goal-reminder" >}}), [goal-continuation.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/goal-continuation" >}}), [goal-judge.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/goal-judge" >}}) | the goal feature: starting a goal, reminding the model of it, continuing it, and judging whether it is met |
| [command-initialize.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/command-initialize" >}}) | built-in command that creates or updates `AGENTS.md` |
| [command-review.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/command-review" >}}) | built-in code review command |
| [command-schedule.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/command-schedule" >}}) | built-in command for scheduled prompts |
| [tool-patch.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/tool-patch" >}}), [tool-todowrite.md]({{< ref "ai-engineering/agents/system-prompts/opencode/prompts/tool-todowrite" >}}) | tool descriptions kept in text files |

The Build and General agents use the base prompt. A subagent started by another session gets "You are a subagent spawned by another session." before its task.

Not copied: the built-in skills in `plugin/skill/`, the patch grammar in `tool/patch-grammar.txt`, and tool descriptions written inside TypeScript files.
