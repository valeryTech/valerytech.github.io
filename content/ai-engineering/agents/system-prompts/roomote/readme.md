---
draft: false
toc: true
title: "Readme"
linkTitle: "Readme"
---
# Roomote system prompts


Copied by [`../extract.py`](/ai-engineering/agents/system-prompts/roomote/readme.assets/extract.py) from <https://github.com/RooCodeInc/Roomote>, commit `6c8d4c3f0d` (2026-11-13). The prompts live in `packages/cloud-agents/src/`.

## Source and license


Roomote is licensed under the Fair Core License 1.0 with an Apache 2.0 future license (FCL-1.0-ALv2), copyright 2026 Roo Code, Inc. A copy is in [LICENSE](/ai-engineering/agents/system-prompts/roomote/readme.assets/license).

Changes from the original: the prompt strings were taken out of the TypeScript files and joined the way the source code joins them, and placeholders and tags such as `<summary>` were wrapped in backticks so that Markdown shows them. The wording was not changed.

## How Roomote builds the system prompt


Roomote runs its tasks inside a coding harness such as OpenCode. Its own prompt is a layer on top of the harness prompt: `opencode-identity-plugin.ts` removes the opening "You are OpenCode, ..." sentence from OpenCode's model prompt, and Roomote's identity is added by later layers. Workflow and tool instructions come from other runtime layers that were not copied.

`buildRoomoteSystemPrompt` (`system-prompt.ts`) joins, separated by blank lines:

1. an opening sentence, which depends on who gets the task's report,
2. a release line, "Roomote release X (prod, commit SHA)", when the version is known (left out here),
3. the `# Roomote Identity` section,
4. for a task working with a user, the `# Personality` section with the style guidance; for a task delegated by an orchestrator, a short engineering section, the naming rule and the ownership rules,
5. the private session section, for private sessions only.

## Files


| File | Use |
| --- | --- |
| [system-direct-user.md]({{< ref "ai-engineering/agents/system-prompts/roomote/prompts/system-direct-user" >}}) | a task working directly with a user |
| [system-orchestrator.md]({{< ref "ai-engineering/agents/system-prompts/roomote/prompts/system-orchestrator" >}}) | a task delegated by an orchestrator, which gets the report |
| [private-session-task.md]({{< ref "ai-engineering/agents/system-prompts/roomote/prompts/private-session-task" >}}) | added for private sessions |
| [compact.md]({{< ref "ai-engineering/agents/system-prompts/roomote/prompts/compact" >}}) | prompt for compacting the context when a task resumes |
| [multi-agent.md]({{< ref "ai-engineering/agents/system-prompts/roomote/prompts/multi-agent" >}}) | section about starting other agents during a task |
| [subagent-explore.md]({{< ref "ai-engineering/agents/system-prompts/roomote/prompts/subagent-explore" >}}) | read-only code search subagent; `<jevgrep skill path>` stands in for a path filled at run time |
| [subagent-proof-judge.md]({{< ref "ai-engineering/agents/system-prompts/roomote/prompts/subagent-proof-judge" >}}) | subagent in the sandbox that checks the screenshots of visual proof |
| [subagent-judge-fast.md]({{< ref "ai-engineering/agents/system-prompts/roomote/prompts/subagent-judge-fast" >}}) | review subagent of the Fast agent, which has no workspace |
| [subagent-advisor-fast.md]({{< ref "ai-engineering/agents/system-prompts/roomote/prompts/subagent-advisor-fast" >}}) | advisor subagent of the Fast agent |

The advisor also has a sandbox version, which differs from the Fast version in one paragraph. It was not copied.

Not copied, because they are built from many functions and run-time values: the Fast agent prompt (`server/fast-agent/fast-agent-prompt.ts`, about 1,000 lines) and the prompts for CI failure triage, issue fixing, task suggestions and the video agent (`server/*-prompt.ts`).
