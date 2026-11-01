---
draft: false
toc: true
title: "Readme"
linkTitle: "Readme"
---
# System prompts of coding agents


| Folder | Agent | Source |
| --- | --- | --- |
| [codex]({{< ref "ai-engineering/agents/system-prompts/codex/readme" >}}) | OpenAI Codex | `codex-rs/models-manager/models.json`, split by `codex/build.py` |
| [opencode]({{< ref "ai-engineering/agents/system-prompts/opencode/readme" >}}) | OpenCode | text files in `packages/core/src/` |
| [cline]({{< ref "ai-engineering/agents/system-prompts/cline/readme" >}}) | Cline | TypeScript strings in `sdk/packages/` |
| [roomote]({{< ref "ai-engineering/agents/system-prompts/roomote/readme" >}}) | Roomote | TypeScript strings in `packages/cloud-agents/src/` |

[`extract.py`](/ai-engineering/agents/system-prompts/readme.assets/extract.py) creates the `prompts/` folders of OpenCode, Cline and Roomote from local checkouts of the three repositories:

```bash
python3 -I extract.py <checkouts folder> .
```


It reads the source files and doesn't run any code from the repositories. Each folder's README names the commit it was copied from. When a repository changes, the script stops with an error if a string it looks for has moved.

In all folders, placeholders and tags such as `<X>` or `<system-reminder>` are wrapped in backticks so that Markdown shows them.
