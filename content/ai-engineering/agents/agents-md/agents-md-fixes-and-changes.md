---
draft: false
toc: true
title: "Where Fixes Go and How AGENTS.md Changes"
description: "Rules 7 to 13 for the root AGENTS.md: put each fix where it works best, prefer enforcement over prose, add lines only for observed failures or project decisions, record each change, and recheck the file when the setup changes."
linkTitle: "Fixes and Changes"
---

[Designing the Root AGENTS.md]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}) lists thirteen [design rules]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#the-rules) for the root `AGENTS.md` and explains rules 1 to 6, which say what goes in the file. This note explains rules 7 to 13. Rules 7 to 10 say where a fix goes when it doesn't belong in the root file. Rules 11 to 13 say when the file changes and how a change is recorded and checked again. The last section works through examples: approval rules, and fixes for failures that agents repeat.

## What goes elsewhere


These rules support enforcement, consistency across agents, and stability.

### Put each fix where it works best


Place fixes for agent mistakes and important project decisions where they are most effective, usually outside the root file. Choose the location based on what the agent lacked:

| Problem or requirement                                             | Where to address it                       |
| ------------------------------------------------------------------ | ----------------------------------------- |
| A simple local default                                             | `AGENTS.md`                               |
| Something that takes more than a few lines to explain              | A canonical doc, linked from `AGENTS.md`  |
| A workflow it repeats by hand                                      | A script or task target                   |
| A rule about behavior that holds across the code                   | A test, run in CI                         |
| A rule about how the code is organized                             | A structural test or lint rule, run in CI |
| How one feature must behave                                        | A feature contract, backed by tests       |
| An action it should not take, or should ask before taking          | A permission setting or a review gate     |
| Guidance for one package or domain, or guidance that changes often | A nested `AGENTS.md` or a domain doc      |
| Something only one tool needs                                      | That tool's own file, such as `CLAUDE.md` |

See [Repeated failures](#repeated-failures) for examples of the first six cases and [Approval rules](#approval-rules) for the seventh. For task targets, [Subsystem commands and scenarios]({{< ref "ai-engineering/agents/environment/command-layer" >}}#subsystem-commands-and-scenarios) shows how a workflow becomes one command built from smaller ones. The following rules explain enforcement, nested files, and tool-specific instructions.

A **structural check** verifies code organization: permitted module dependencies, file locations and naming conventions, and consistency between related artifacts such as generated code and its schema. Architecture boundaries are a common example, including one-way dependencies between layers and cross-cutting concerns accessed through a single interface.

A **feature contract** is a short document defining a feature's required behavior: rules, edge cases, behavior that looks wrong but is deliberate, scope boundaries, and the tests that verify each requirement. Agents could need feature contracts to distinguish intentional behavior from bugs, especially when their [generic priors]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#agents-bring-generic-priors) suggest a different implementation. Tests enforce the contract's key requirements.

### Prefer enforcement over prose


Eventually enforce important rules through CI, linting, scripts, tests, or structural checks. `AGENTS.md` should reference these enforcement mechanisms. Once a rule is enforced mechanically, reduce its explanation in `AGENTS.md` to a brief reminder or link.

Core principles of harness engineering are to provide clear boundaries, predictable structure, accessible tools, fast tests, and actionable feedback. Every check should report which rule failed and how to recover, since agents use failure messages to decide what to do next.

Rules governing permitted actions, such as "ask before deploying," belong in permission settings. See [Approval rules in AGENTS.md](#approval-rules) for how to enforce these restrictions. When commands are grouped by what they can affect, such as remote operations under `infra:*`, one permission rule covers a whole group ([Keeping risky commands apart]({{< ref "ai-engineering/agents/environment/command-layer" >}}#keeping-risky-commands-apart)).

### Separate stable root rules from changing domain knowledge


Keep stable, repository-wide rules in the root `AGENTS.md`. Place frequently changing guidance in the handbook, domain or feature documentation, or package-level `AGENTS.md` files. In monorepos, place package-specific rules in that package's nested `AGENTS.md`.

### Keep one core for all agents


Keep guidance shared by all coding agents in the root `AGENTS.md`. Tool-specific files, such as `CLAUDE.md`, should reference or import the shared core and contain only tool-specific additions. Separate copies can diverge, causing agents in the same repository to follow inconsistent rules.

Claude Code requires an explicit import. Claude Code reads `AGENTS.md` automatically only when no `CLAUDE.md` exists. Once `CLAUDE.md` is present, it must import the shared core using `@AGENTS.md`, or the core stops loading.

## How the file changes


These rules keep each change justified and the file current.

### Convert repeated failures into harness improvements


Do not add a line or a section because it sounds useful. Add guidance only to address an observed failure that recurs or is costly, or to document a project decision that agents cannot infer.

Repeated agent failures may indicate a gap in the harness. When an agent repeats a mistake, address its underlying cause rather than merely correcting the output or adding another instruction to `AGENTS.md`. Use the [placement table](#put-each-fix-where-it-works-best) to choose an improvement that reduces the likelihood of recurrence. Reserve the root file for short, stable, project-specific defaults ([Treat context as a budget]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#treat-context-as-a-budget)).

This prevents `AGENTS.md` from accumulating unnecessary instructions and turns repeated failures into lasting improvements. [Record and review every change](#record-and-review-every-change) and [Recheck when the setup changes](#recheck-when-the-setup-changes) describe how to record a change and when to check it again.

### Record and review every change


Make each change to the file on its own, and record why it was made: the failure or project decision behind it, the behavior it should change, and when it can be removed. The commit message is a good place for this record. Describe the expected effect as something that can be seen in a session, such as a command the agent runs or a mistake it stops making. Without that, nobody can later tell whether the line helps ([Why It Is Hard to Tell Whether AGENTS.md Works]({{< ref "ai-engineering/agents/evaluation/agents-md-verification" >}})). Before merging, review the change against the [design rules]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#the-rules). Keep the change history outside `AGENTS.md`, because the file loads in every session.

### Recheck when the setup changes


After a model upgrade, a change in how a tool loads or enforces instructions, or a large change to the repository, check each line of the file again ([Agents, tools, and models change]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#agents-tools-and-models-change)). Remove a line, replace it with a link, or move it elsewhere when:

- A check, script, or permission setting now enforces it.
- Agents follow it without the instruction.
- It repeats canonical documentation.
- It applies only to one package or domain.
- It refers to commands, paths, or documentation that no longer exist.
- Nobody recorded why it was added, and nobody can tell. Find out before removing it.

Keep hard constraints, such as how to handle secrets and irreversible operations, until a check or a permission setting enforces them. Record each removal with its reason, as with an addition.

## Examples

### Approval rules


Instruction files often contain lines such as "Ask before deploying" or "Never touch production config." They read like hard constraints, so they get written early and kept for good.

{{< callout context="caution" title="Core idea" icon="outline/alert-triangle" >}}
A line of the form "ask before X" or "never do X" is a permission. Enforce it where the action happens: in the agent's access, in its permission settings, or in a review gate. `AGENTS.md` keeps at most the project facts the agent needs to recognize X.
{{< /callout >}}

#### Why text is the wrong place


- **Text is not enforced.** The Claude Code documentation calls instruction files "context, not enforced configuration." A model can misread or forget a line, especially late in a long session. A permission rule applies every time.
- **CI comes too late.** The [placement table](#put-each-fix-where-it-works-best) sends rules that must always hold to tests, lint rules, and structural checks, which run in CI and check code after it is written. An approval rule is about an action during the session, such as rotating a key or deploying. By the time CI runs, the action has already happened, or CI never sees it at all.
- **Most of these lines fail the root file's criteria.** They apply to few tasks, and they restate what agents already do by default ([Agents bring generic priors]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#agents-bring-generic-priors)).

#### Where an approval rule goes


Take the first option that settles the rule:

1. **Remove the access.** An agent without production credentials or deploy rights cannot misuse them.
2. **Gate the action in the harness.** Write a permission rule that asks or denies. In Claude Code, that is an entry such as `"ask": ["Bash(task deploy *)"]` or `"deny": ["Edit(./config/production/**)"]` in `.claude/settings.json`. In Codex, it is the rules and the approval policy. For a team, keep these in shared or managed settings.
3. **Require review.** Code owners, branch protection, and approval for deployment environments cover every agent and every person.
4. **Keep only the project fact.** The agent cannot know which files are production config here, or which commands deploy. That fact may go in text, placed like any other fact.
5. **Drop the rest.** Agents and their harnesses already ask before risky actions by default. Restating that adds context cost and changes no behavior.

When approval prompts are turned off, text is the only layer left. Removed access and review gates still hold in those modes, and so do Claude Code's deny rules.

#### Where the common advice comes from


GitHub recommends three tiers of boundaries: always do, ask first, never do (Nigh 2025). That advice is about Copilot custom agents, each with one job. Copied into a root `AGENTS.md`, which every task loads, the same lines turn into generic prohibitions.

#### Sources


- Claude Code documentation: [Permissions](https://code.claude.com/docs/en/permissions), [Permission modes](https://code.claude.com/docs/en/permission-modes), [How Claude remembers your project](https://code.claude.com/docs/en/memory).
- Codex documentation: [Rules](https://developers.openai.com/codex/rules), [Approvals and security](https://learn.chatgpt.com/codex/agent-approvals-security).
- Matt Nigh, [How to write a great agents.md: Lessons from over 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/), GitHub blog, 2025-11-19.

### Repeated failures


Each example is a mistake an agent made twice, and where the fix goes under the [placement table](#put-each-fix-where-it-works-best). Only the first fix is a line in `AGENTS.md`. The others leave the root file a pointer at most.

#### A local default


The agent runs `pip install` in a project managed with `uv`, and the package lands outside the project's environment. This is the one case where a line in `AGENTS.md` is the fix: the agent's default is wrong here, and the correction is short and stable.

```markdown
- Manage dependencies with `uv add` and run tools with `uv run`. Do not use `pip`.
```

#### Something that takes explaining


The agent writes a migration that adds an index to a large PostgreSQL table in one step, and the table stops accepting writes while the index builds. The safe pattern has several parts: build the index concurrently, in its own migration, outside a transaction. It takes a page with its exceptions, so it goes in a canonical doc, and `AGENTS.md` routes to it:

```markdown
- Before writing a migration, read `docs/migrations.md`.
```

#### A workflow done by hand


The agent runs the release steps one at a time and skips the changelog. A task target such as `task release` runs every step in order and fails when the changelog has no entry for the new version. The runbook lists the target, and `AGENTS.md` needs nothing unless agents keep releasing by hand. [Subsystem commands and scenarios]({{< ref "ai-engineering/agents/environment/command-layer" >}}#subsystem-commands-and-scenarios) shows the same pattern for starting a local stack.

#### A rule about behavior


The agent stores local time in a field where every timestamp must be in UTC. A test saves a record and fails when the stored timestamp is naive or not in UTC. A lint rule catches the common cause earlier: Ruff's [DTZ005](https://docs.astral.sh/ruff/rules/call-datetime-now-without-tzinfo/) flags `datetime.now()` called without a time zone.

#### A rule about structure


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

#### How one feature behaves


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
