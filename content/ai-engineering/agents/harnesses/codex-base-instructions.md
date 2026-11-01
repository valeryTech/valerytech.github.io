---
draft: false
toc: true
title: "How Codex Builds Its System Prompt"
description: "Where the Codex CLI's system prompt comes from, how a session chooses it, what can change it during a session or through agent roles, and where it sits in the request. Based on the codex-rs source, with an August 2026 experiment on a local branch."
linkTitle: "Codex System Prompt"
---

This note describes the system prompt of the Codex CLI: where its text comes from, how a session chooses one, what can change it, and where it sits in the request. In the code the system prompt is called *base instructions*, and this note uses that term. [How Codex assembles an agent session]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}) covers the rest of the context: the world-state sections, AGENTS.md, memory, skills, and tools.

{{< callout context="note" title="Source" icon="outline/info-circle" >}}
Repository: `~/projects/common/codex`, commit `b1573f1024` (2026-11-14). Paths are relative to `codex-rs/`. Line numbers will drift as the code changes.

The note started from three docs on the local branch `old-investigations` (`my_docs/`), written in August 2026 against commit `1da59ad257`. Where the code has changed since then, the note follows the current code. [Changes since August 2026](#changes-since-august-2026) lists the differences.

[Examples of the first request](#examples-of-the-first-request) comes from running `codex debug prompt-input` at this commit in the repo's devcontainer, with an empty `CODEX_HOME`.
{{< /callout >}}

## Parts of a request


| Part              | What it holds                                                                                                                                                             | Where it goes                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Base instructions | The system prompt                                                                                                                                                         | A developer message in `input`. Responses Lite models record it in the history. For other models the client adds it first in every request. |
| Context           | Developer and user messages built from world-state sections: developer instructions, permissions, collaboration mode, AGENTS.md, environment, skills list, memory summary | `input`, recorded in the history                                                                                                               |
| Conversation      | User and assistant messages, tool calls and tool outputs                                                                                                                  | `input`, recorded in the history                                                                                                               |
| Tools             | Tool definitions                                                                                                                                                          | An `additional_tools` item in `input` for Responses Lite models, and the top-level `tools` field for other models                             |

[Where the base instructions go in the request](#where-the-base-instructions-go-in-the-request) explains the two layouts. At this commit, every bundled model except `gpt-5.5` uses Responses Lite.

The base instructions are chosen once, when the session starts. The context and the tool list are checked at every step. With incremental tools, Codex sends only the sections that changed.

## Where the text comes from


- **Bundled templates.** `models-manager/models.json` holds one entry per model, compiled into the binary (`models-manager/src/lib.rs:20`). The text is in `model_messages.instructions_template`. At this commit the file has 12 models, among them `gpt-5.5`, three `gpt-5.6` models, five `gpt-6` models, and `codex-auto-review`. Each template is 17,000 to 22,000 characters.
- **Remote or cached catalog.** At runtime the models manager can load model metadata from the server or a local cache. That copy wins over `models.json` for a given launch.
- **Literal text.** `instructions_template` once held placeholders for personality text. It's now plain text, and the field keeps its name for compatibility with older catalogs (`protocol/src/openai_models.rs:595`).
- **Fallback.** `models-manager/prompt.md` is used for models that aren't in the catalog (`models-manager/src/model_info.rs:16`, `:153`). An identical copy, `protocol/src/prompts/base_instructions/default.md`, is the value of `BaseInstructions::default` (`protocol/src/models.rs:1805`). Both hold the older generic Codex CLI prompt.

`render_model_instructions` reads the template from the model metadata (`prompts/src/model_instructions.rs`). A model without a template gets empty base instructions and a warning.

To print a model's bundled template:

```bash
jq -r '.models[] | select(.slug=="gpt-5.6-sol") | .model_messages.instructions_template' codex-rs/models-manager/models.json
```

## How a session chooses its base instructions


`Session::initialize` takes the first source that exists (`core/src/session/mod.rs:935-939`):

1. `base_instructions` in the config. Codex takes the first of these that is set (`core/src/config/mod.rs:4288`): text from a caller such as an app-server client, then the file named in `model_instructions_file`, then the inline `instructions` key. `model_instructions_file` replaced the old `experimental_instructions_file` key (#9555), which was later removed (#22724). The code comment on `model_instructions_file` strongly discourages using it, because moving away from the model's own instructions will likely make the model work worse.
2. The base instructions saved in the history of a resumed or forked thread.
3. The model's template.

Each source replaces the others completely. Codex never adds custom text to the model's template or the template to custom text.

Before the template is read, the models manager applies two settings to the model metadata (`models-manager/src/model_info.rs:45-55`):

- Custom base instructions from the config replace the model's template. A later model switch then carries the custom text too.
- `personality = "none"` removes the `# Personality` section from the template. Other personality values don't change the text.

App-server clients pass `base_instructions` and `developer_instructions` on thread start, resume, and fork (`ThreadStartParams`, `ThreadResumeParams` and `ThreadForkParams` in `app-server-protocol/src/protocol/v2/thread.rs:106`, `:425`, `:634`). On resume and fork, a client that leaves `base_instructions` out keeps the saved text, and a client that sends it replaces the saved text.

### Provenance


Codex saves the chosen text with its provenance, which records where the text came from (`protocol/src/models.rs:1811`, set in `core/src/session/session.rs:841-860`):

- **`Custom`**: from the config or a caller. The text stays the same when the model changes.
- **`Model { model }`**: from that model's template.

Rollouts written before provenance existed have none. For those, Codex marks the saved text as `Model` when it equals the current model's template.

Provenance affects three things:

- **The update-plan section.** When the `update_plan` tool is off and no custom model catalog is set, Codex removes the update-plan section from `Model` text (`core/src/session/mod.rs:1726-1742`). This changes only the copy sent in the request. The saved text keeps the section, so forks inherit it whole.
- **Model switches.** See the next section.
- **Roles.** A role that turns `personality = "none"` on or off clears `Model` text, so the child renders the template again with or without the personality section (`core/src/agent/role.rs:227-237`).

## Changes during a session


Codex doesn't replace the saved base instructions during a session. A model switch adds a message instead (`core/src/context/world_state/model.rs`, `core/src/session/world_state.rs:101-161`):

- **Windows without incremental tools** (`gpt-5.5`, and other models and providers that don't use them). The first item of `input` keeps the original text. When the model changes, Codex adds a developer message in `<model_switch>` tags. The message says the user was using a different model and gives the new model's template (`core/src/context/model_switch_instructions.rs`). The same message appears on the first step after a resume with a different model, when the saved `Model` text differs from the current model's template.
- **Incremental-tools windows** (the default for Responses Lite models). The base instructions are recorded in the history as a world-state section. When the model or the text changes, Codex sends an update that names the new model, carries the new text, or both. The `SuppressModelChangeAnnouncements` feature turns off the model name. In the test snapshot `incremental_tools_regular_responses`, a model switch adds three items before the next prompt, and the earlier items stay as they were:
  1. A developer notice that starts "This is an incremental tools update".
  2. An `additional_tools` item with only the tools that changed.
  3. A `<model_instructions>` developer message: "The current model is `<model>`. The following instructions replace the previous base instructions:", followed by the new text.

  After the next compaction, the new window starts with the full tool list and the new model's base instructions.

## Where the base instructions go in the request


The request type has no `instructions` field (`codex-api/src/common.rs:325`). Where the base instructions and the tools go depends on the model's `use_responses_lite` flag. At this commit, every bundled model except `gpt-5.5` has it set.

- **Responses Lite models: incremental tools.** For these models the `IncrementalTools` feature applies (`core/src/session/step_context.rs:61`). The feature is stable and on by default (`features/src/lib.rs:1854`). At the start of each context window, Codex records the tool definitions and the base instructions in the history as world-state sections. The tools become an `additional_tools` developer item, and the base instructions a developer message with content kind `model.base_instructions`. They're sent once and then only when they change. `build_prompt` passes empty base instructions to the client and keeps only hosted tools, such as web search (`core/src/session/turn.rs:1846-1883`). The client puts any hosted tools in another `additional_tools` item at the front of `input` and turns parallel tool calls off (`core/src/client.rs:1198-1211`, `:1300`).
- **Other models.** This covers `gpt-5.5`, and providers other than Amazon Bedrock and GCP. `ModelClient::build_responses_request` (`core/src/client.rs:1162`) puts the base instructions first in `input` for every request, as a developer message with content kind `model.base_instructions` (`core/src/context/base_instructions.rs:13`, `:46`). The tools go in the top-level `tools` field. The item's ID is a UUID derived from the thread ID and the text, so retries and resumed sessions send the same item.
- **Amazon Bedrock and GCP providers** have their own incremental-tools features, `IncrementalToolsLegacy` and `IncrementalToolsLegacyGcp`. Both are stable and on by default, so these providers also record the tool definitions and base instructions in the history.

In both layouts, `input` then holds:

1. The initial context: a developer message, then two multi-agent developer messages (not for `gpt-5.5`), then a user message. [Examples of the first request](#examples-of-the-first-request) lists their parts. The initial context is recorded in the history at the start of the session and after each compaction.
2. The conversation, with world-state updates for sections that changed.

### Examples of the first request


These come from `codex debug prompt-input` (`cli/src/main.rs:275`, `core/src/prompt_debug.rs`). The command builds a session and prints the `input` list for one turn without calling the model. Its output stops before the client adds its own items, so for `gpt-5.5` it doesn't show the base instructions or the tools.

```bash
CODEX_HOME="$(mktemp -d)" codex -C <project> -m gpt-6.1-sol debug prompt-input "List the files in this folder."
```


For `gpt-6.1-sol` in a git project with an empty `CODEX_HOME`, `input` holds seven items:

| # | Item | Contents |
| --- | --- | --- |
| 0 | `additional_tools` (developer) | 11 tool definitions in three namespaces (`functions`, `clock`, `collaboration`), about 25,000 characters as JSON |
| 1 | Developer message | The base instructions, about 21,000 characters |
| 2 | Developer message | Separate text parts: developer instructions (when set), `<skills_instructions>`, `<permissions instructions>`, `<collaboration_mode>` |
| 3 | Developer message | `<multi_agent_role>`, saying the agent is `/root` |
| 4 | Developer message | `<multi_agent_mode>` |
| 5 | User message | AGENTS.md (when present) and `<environment_context>`: cwd, shell, date, timezone, workspace roots and permission profile |
| 6 | User message | The prompt |

For `gpt-5.5`, the debug output has three items. A developer message holds `<skills_instructions>`, `<permissions instructions>` and a `<tools>` list of deferred tool namespaces. It's followed by the environment context and the prompt. There are no multi-agent messages. The client then adds the base instructions in front and the tools in the `tools` field.

What changes with the config, for `gpt-6.1-sol`:

- **`personality = "none"`** removes the `# Personality` section of the base instructions, about 4,300 characters.
- **Sandbox and approvals.** With no flags and an empty `CODEX_HOME`, the session is `read-only` with `on-request` approvals. The permissions part then is a guide of about 4,000 characters on asking for escalation and `prefix_rule`. With `--dangerously-bypass-approvals-and-sandbox` it shrinks to three lines saying there's no sandbox and the approval policy is `never`. The `<permission_profile>` in the environment context changes to match.
- **`developer_instructions`** becomes the first text part of item 2.
- **AGENTS.md.** The `CODEX_HOME` file and the project file are joined into one block headed `# AGENTS.md instructions for <cwd>`, with a `--- project-doc ---` line between them. The block comes before the environment context in the same user message. Nested project files are joined with only a blank line. [AGENTS.md]({{< ref "ai-engineering/agents/harnesses/codex-agent-assembly" >}}#agentsmd) covers discovery, limits and reloading.
- **`model_instructions_file`** replaces the whole base instructions. The provenance is `Custom`.

## Sessions that use their own base instructions


Some internal sessions replace the base instructions with their own `Custom` text:

- **Review.** The review task uses `REVIEW_PROMPT` from the prompts crate. It also sets the approval policy to `never`, turns off web search, and turns off sub-agents (`core/src/tasks/review.rs:108-120`).
- **Guardian reviewer.** The approval reviewer builds its base instructions from the guardian policy, any extra policy from the config, and the transcript (`core/src/guardian/reviewer_config.rs:76-85`).

## Agent roles


Sub-agents get a role through the `agent_type` argument of the spawn tool.

- **Where roles come from.** User roles are defined under `[agents.<name>]` with a `description` and a `config_file`. Built-in roles are `default`, `explorer` and `worker` (`core/src/agent/role.rs:319-360`). The built-in roles change no settings: `explorer.toml` is empty, and the other two have no file. They differ only in the description.
- **What the parent sees.** Role names and descriptions go into the spawn tool's `agent_type` help text (`spawn_tool_spec::build` in `core/src/agent/role.rs`). This is how an app-server client, such as the ChatGPT desktop app, can offer user roles without a new protocol field.
- **What a role can change.** Codex reads the role file and keeps only these keys (`core/src/agent/role.rs:33-44`, `:66-125`): `developer_instructions`, `model`, `model_reasoning_effort`, `model_reasoning_summary`, `model_verbosity`, `personality`, and `service_tier`. A role can turn off `ShellTool`, `Apps`, `Plugins`, `MemoryTool` and `RequestPermissionsTool`, and it can turn skills off. It can't turn features or skills on. The kept keys are written as a session-flags layer on top of the parent's config.
- **What a role can't change.** Codex ignores every other key, without an error. This includes `instructions`, `model_instructions_file`, the model provider, and permissions. A role therefore can't replace a sub-agent's base instructions. It can add a developer message through `developer_instructions`, and it can change the template through `personality`.

## The experiment on the `old-investigations` branch


In August 2026 the branch added two settings on top of `1da59ad257`:

- **`model_instructions_files`.** An ordered list of prompt files. Paths are resolved against the TOML file that declares them. Codex trims each file, rejects empty or missing files, and joins the rest with one blank line, with no headings or file names. The result becomes `Custom` base instructions. The singular `model_instructions_file` and the plural list count as one setting: a higher config layer's value of either form replaces a lower layer's, and both forms in one layer are an error.
- **`--agent-role <name>`.** A root CLI option for interactive sessions, `exec`, `resume`, and `fork`. It applies a `[agents.<name>]` role to the root session while the config is built. On resume and fork, the role's text is sent only when a role is selected. Otherwise the saved text is kept. `Config.root_agent_role` records the choice.

The branch also installed two roles kept in another repository: `workflow`, with one prompt file, and `architect`, with three files in this order: evidence rules, an architecture method, and the role itself. An integration test checked that the request's top-level `instructions` field equals the joined files exactly.

The branch relied on two things that changed on `main` after August:

- Role application now drops instruction keys, so a role file with `model_instructions_files` wouldn't change the root or a sub-agent's base instructions. The branch would need to add the instruction keys to the role's kept keys, or apply the root role's text on its own path.
- The request has no top-level `instructions` field, so the test would need to read the first `input` item.

The `base_instructions` fields on thread start, resume, and fork, which the branch used for the root role, still exist. `--agent-role` and `model_instructions_files` exist only on the branch.

The branch's `system_prompt.md` is the `gpt-5.6-sol` template as of August. Today's `gpt-5.6` templates are close to it in length, but the text differs.

## Changes since August 2026


| August docs                                                                                                                     | `main` at `b1573f1024`                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base instructions go in the top-level `instructions` field. Responses Lite is the exception and sends them as a developer item. | Base instructions are a developer message in `input`, never a top-level field (#51156, 2026-10-05). For Responses Lite models, which are all bundled models except `gpt-5.5`, incremental tools is on by default. The base instructions and tool definitions are then recorded in the history (#51188, 2026-10-05). For other models the client adds the base instructions first in every request. |
| The template has personality placeholders that Codex fills in.                                                                  | The template is literal text. Only `personality = "none"` changes it, by removing the `# Personality` section.                                                                                                                                                                                                                                                                                     |
| A role is a whole config layer and can set base instructions, provider, permissions, and other keys.                            | A role can set only seven keys and turn some features and skills off. Changed in #39299 (2026-08-18).                                                                                                                                                                                                                                                                                              |
| Choice order, provenance, `prompt.md` and `default.md`, app-server `base_instructions` on start, resume, and fork               | Unchanged.                                                                                                                                                                                                                                                                                                                                                                                         |
