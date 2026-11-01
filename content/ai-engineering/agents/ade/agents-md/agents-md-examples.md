---
draft: false
toc: true
title: "AGENTS.md Examples"
aliases:
  - "/ai-engineering/agents/agents-md/agents-md-examples/"
  - "/ai-engineering/agents/agents-md/agents-md-approval-rules/"
description: "Worked examples of placing common AGENTS.md lines with the root file's design rules: approval rules such as 'ask before X' become permissions, and a repeated agent failure goes into AGENTS.md only when it is a local default."
linkTitle: "Examples"
---

Each section takes something that often ends up in instruction files and shows where it belongs under the [design rules]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#design-rules).

## Approval rules


Instruction files often contain lines such as "Ask before deploying" or "Never touch production config." They read like hard constraints, so they get written early and kept for good.

{{< callout context="caution" title="Core idea" icon="outline/alert-triangle" >}}
A line of the form "ask before X" or "never do X" is a permission. Enforce it where the action happens: in the agent's access, in its permission settings, or in a review gate. `AGENTS.md` keeps at most the project facts the agent needs to recognize X.
{{< /callout >}}

### Why text is the wrong place


- **Text is not enforced.** The Claude Code documentation calls instruction files "context, not enforced configuration." A model can misread or forget a line, especially late in a long session. A permission rule applies every time.
- **CI comes too late.** The [placement table]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#put-each-fix-where-it-works-best) sends rules that must always hold to tests, lint rules, and structural checks, which run in CI and check code after it is written. An approval rule is about an action during the session, such as rotating a key or deploying. By the time CI runs, the action has already happened, or CI never sees it at all.
- **Most of these lines fail the root file's criteria.** They apply to few tasks, and they restate what agents already do by default ([Agents bring generic priors]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#agents-bring-generic-priors)).

### Where an approval rule goes


Take the first option that settles the rule:

1. **Remove the access.** An agent without production credentials or deploy rights cannot misuse them.
2. **Gate the action in the harness.** Write a permission rule that asks or denies. In Claude Code, that is an entry such as `"ask": ["Bash(task deploy *)"]` or `"deny": ["Edit(./config/production/**)"]` in `.claude/settings.json`. In Codex, it is the rules and the approval policy. For a team, keep these in shared or managed settings.
3. **Require review.** Code owners, branch protection, and approval for deployment environments cover every agent and every person.
4. **Keep only the project fact.** The agent cannot know which files are production config here, or which commands deploy. That fact may go in text, placed like any other fact.
5. **Drop the rest.** Agents and their harnesses already ask before risky actions by default. Restating that adds context cost and changes no behavior.

When approval prompts are turned off, text is the only layer left. Removed access and review gates still hold in those modes, and so do Claude Code's deny rules.

### Where the common advice comes from


GitHub recommends three tiers of boundaries: always do, ask first, never do (Nigh 2025). That advice is about Copilot custom agents, each with one job. Copied into a root `AGENTS.md`, which every task loads, the same lines turn into generic prohibitions.

### Sources


- Claude Code documentation: [Permissions](https://code.claude.com/docs/en/permissions), [Permission modes](https://code.claude.com/docs/en/permission-modes), [How Claude remembers your project](https://code.claude.com/docs/en/memory).
- Codex documentation: [Rules](https://developers.openai.com/codex/rules), [Approvals and security](https://learn.chatgpt.com/codex/agent-approvals-security).
- Matt Nigh, [How to write a great agents.md: Lessons from over 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/), GitHub blog, 2025-11-19.

## Repeated failures


Each example is a mistake an agent made twice, and where the fix goes under the [placement table]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#put-each-fix-where-it-works-best). Only the first fix is a line in `AGENTS.md`. The others leave the root file a pointer at most.

### A local default


The agent runs `pip install` in a project managed with `uv`, and the package lands outside the project's environment. This is the one case where a line in `AGENTS.md` is the fix: the agent's default is wrong here, and the correction is short and stable.

```markdown
- Manage dependencies with `uv add` and run tools with `uv run`. Do not use `pip`.
```

### Something that takes explaining


The agent writes a migration that adds an index to a large PostgreSQL table in one step, and the table stops accepting writes while the index builds. The safe pattern has several parts: build the index concurrently, in its own migration, outside a transaction. It takes a page with its exceptions, so it goes in a canonical doc, and `AGENTS.md` routes to it:

```markdown
- Before writing a migration, read `docs/migrations.md`.
```

### A workflow done by hand


The agent runs the release steps one at a time and skips the changelog. A task target such as `task release` runs every step in order and fails when the changelog has no entry for the new version. The runbook lists the target, and `AGENTS.md` needs nothing unless agents keep releasing by hand.

### A rule about behavior


The agent stores local time in a field where every timestamp must be in UTC. A test saves a record and fails when the stored timestamp is naive or not in UTC. A lint rule catches the common cause earlier: Ruff's [DTZ005](https://docs.astral.sh/ruff/rules/call-datetime-now-without-tzinfo/) flags `datetime.now()` called without a time zone.

### A rule about structure


The agent adds an import from the UI layer to a service module, so business logic now breaks when the UI changes.

OpenAI's harness-engineering team built its application around rules of this kind ([Enforcing architecture and taste](https://openai.com/index/harness-engineering/)). Each business domain has a fixed set of layers, Types, Config, Repo, Service, Runtime, and UI, and code may depend only forward through them. Cross-cutting concerns such as auth and telemetry enter through one interface, Providers. Custom linters and structural tests reject any other dependency, and the team writes the linters' error messages to tell the agent how to fix the violation.

In Python, [import-linter](https://import-linter.readthedocs.io/en/stable/contract_types/layers/) states such a rule as configuration in `pyproject.toml`. The list runs from the highest layer to the lowest, and a layer may import only the layers below it:

```toml
[tool.importlinter]
root_package = "app"

[[tool.importlinter.contracts]]
name = "Layers depend forward only"
type = "layers"
layers = [
    "app.ui",
    "app.runtime",
    "app.service",
    "app.repo",
    "app.config",
    "app.types",
]
```


`lint-imports` then fails on any import that breaks the contract, including indirect imports through other modules. Run it in CI next to the tests.

### How one feature behaves


The agent "fixes" invoice totals so that they equal the exact total rounded once, and breaks a rule the business relies on. A feature contract records the rule and why it holds:

```markdown
# Invoicing contract

## Rules

- Each line amount is rounded half-up to cents, and the total is the sum of the rounded lines. The total can differ by a few cents from the rounded exact sum. This is deliberate: it matches the printed invoice that customers check line by line. Checked by `tests/invoicing/test_rounding.py`.

## Out of scope

- Currency conversion. It happens in the payments module.
```


`AGENTS.md` gets one routing line for all contracts:

```markdown
- Each feature has a contract in `docs/features/`. Read it before changing the feature, and update it only when the task changes the feature's behavior.
```
