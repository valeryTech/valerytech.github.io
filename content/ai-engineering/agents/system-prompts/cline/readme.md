---
draft: false
toc: true
title: "Readme"
linkTitle: "Readme"
---
# Cline system prompts


Copied by [`../extract.py`](/ai-engineering/agents/system-prompts/cline/readme.assets/extract.py) from [cline/cline on GitHub](https://github.com/cline/cline), commit `72b3d71405` (2026-11-13). The prompts live in `sdk/packages/shared/src/prompt/` and `sdk/packages/core/src/cloud/`.

## Source and license


Cline is licensed under the Apache License 2.0. A copy is in [LICENSE](/ai-engineering/agents/system-prompts/cline/readme.assets/license).

Changes from the original: the prompt strings were taken out of the TypeScript files and joined the way `buildClineSystemPrompt` joins them, and placeholders and tags such as `<env>` were wrapped in backticks so that Markdown shows them. The wording was not changed.

## How Cline builds the system prompt


`buildClineSystemPrompt` (`prompt/cline.ts`) starts from one of two base prompts: act or yolo. The `{{CLINE_RULES}}` slot gets, in order and separated by blank lines:

1. the caller's rules (project rules and similar; empty in these files),
2. the Plan / Act mode section, except in yolo mode,
3. the Plan Mode section, in plan mode only.

These placeholders are kept as they are: `{{PLATFORM_NAME}}`, `{{CURRENT_DATE}}`, `{{IDE_NAME}}`, `{{CWD}}`, and `{{CLINE_METADATA}}`. The last one becomes a `# Workspace Configuration` block with workspace details when the provider is Cline's own, and is empty for other providers.

## Files


| File | Use |
| --- | --- |
| [Act]({{< ref "ai-engineering/agents/system-prompts/cline/prompts/act" >}}) | act mode, the default |
| [Plan]({{< ref "ai-engineering/agents/system-prompts/cline/prompts/plan" >}}) | plan mode when the host has the `switch_to_act_mode` tool (the CLI) |
| [Plan Vscode]({{< ref "ai-engineering/agents/system-prompts/cline/prompts/plan-vscode" >}}) | plan mode in the VS Code extension, where the user switches modes with a toggle |
| [Yolo]({{< ref "ai-engineering/agents/system-prompts/cline/prompts/yolo" >}}) | yolo mode, for background work with no user to talk to; ends with the `submit_and_exit` tool |
| [Cloud Computer Use]({{< ref "ai-engineering/agents/system-prompts/cline/prompts/cloud-computer-use" >}}) | section for cloud sandboxes with a virtual display, added for models that accept images |

Subagents and team members (`extensions/tools/team/subagent-prompts.ts`): with Cline's own provider, a team member gets the act prompt with its role under `# Team Teammate Role` as the rules, and a subagent gets its spawn prompt in place of the base prompt. With other providers, both get only their spawn prompt.
