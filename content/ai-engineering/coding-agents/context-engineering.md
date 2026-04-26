---
draft: false
toc: true
title: "Context Engineering"
linkTitle: "Context Engineering"
---
# Mental Model


Think of a coding agent as a capable colleague whose memory is reset at the start of every session.

Do not write `AGENTS.md` as if the agent is dumb. Write it as onboarding context for a competent engineer who can read the repository, search files, run tools, infer patterns, and make reasonable decisions.

The problem is not that the agent cannot work. The problem is that it does not automatically know this project's local defaults, constraints, history, or preferred workflows.

Good instructions tell the agent what a new teammate would need to know before making changes here. Bad instructions restate generic software-engineering advice the agent already knows.

# What `AGENTS.md` is


`AGENTS.md` is a repository-local context management file for coding agents.

It is loaded at the start of agent sessions, so every line has a recurring context cost. The file should contain only high-leverage information that helps the agent act correctly across many tasks.

Its job is to:

- establish project-specific defaults;
- explain how to run and validate the project;
- state non-negotiable constraints;
- route the agent to canonical sources of truth;
- define when the agent should stop and ask for help (sometimes).

In practice, `AGENTS.md` is the agent's first-read entry point into the repository.

> A good `AGENTS.md` reduces repeated human steering. It makes the repository more legible to agents by turning local conventions into explicit, versioned context.

# Assumptions and LLM-based coding agents features


Before designing `AGENTS.md`, it helps to make the operating model explicit.

We are designing for modern coding agents -- Codex, Claude Code, Cursor-style agents, and similar systems -- that already have strong generic engineering knowledge, tool use, default policies, and learned conventions.

The following assumptions explain what `AGENTS.md` can usefully influence.

## Agents work from assembled context


Coding agents do not arrive with this repository's working context already assembled.

They construct a task-specific model from what enters the session: the user request, loaded instructions, inspected files, search results, tool outputs, previous messages, test failures, and conventions inferred from nearby code.

This model can be useful but incomplete. If the agent sees stale docs, generated files, legacy code, or an unrepresentative example, it may infer the wrong project convention.

Therefore, `AGENTS.md` should act as orientation: point to canonical entry points, name sources of truth, and highlight local defaults that are easy to miss or easy to infer incorrectly.

## Agents bring generic priors


Coding agents already have strong generic software-engineering priors. They know common project layouts, naming patterns, libraries, workflows, and refactoring moves.

These priors are useful, but they are not project-specific. When the repository does not make its local expectations explicit, the agent may apply generic "good engineering" that is locally wrong: adding abstractions, renaming for clarity, broadening the scope of a refactor, introducing a popular dependency, copying a legacy pattern, or writing tests in the wrong framework.

The purpose of `AGENTS.md` is not to replace the agent's priors with a long rulebook. It is to correct the places where generic defaults conflict with this project's defaults.

## Context is limited and signals are mixed


Even when the right information exists somewhere in the repository, it may not influence the agent in the right way. Coding agents can receive a large amount of context, but not all context has equal influence as their attention is not evenly distributed.

There are two constraints:

- First axis. Attention has a budget. As the amount of visible material grows, each individual instruction has less effective weight. Long `AGENTS.md` files, long conversations, broad search results, duplicated docs, and noisy tool output all increase the chance that important guidance is missed, forgotten, or applied weakly.
- Second, **signals differ in kind and authority**. A coding agent does not receive only instructions. It receives authority rules, user intent, repository docs, local examples, comments, test results, errors, tool output, and inferred conventions. Some of these are explicit instructions; others are evidence.

Therefore, `AGENTS.md` should stay short and act as a signal router. It should name canonical sources of truth, distinguish project policy from local examples, and route detailed or task-specific guidance to harnesses, docs, commands, and package-level rules.

# From assumptions to design rules


The build method follows from the assumptions above:

- Because agents work from assembled context, `AGENTS.md` should orient them toward the right files, commands, and sources of truth.
- Because agents bring generic priors, it must encode project-specific defaults;
- Because context is limited, root `AGENTS.md` should stay short, stable, and high-signal.
- Because signals are mixed, it should clarify source-of-truth hierarchy instead of duplicating guidance across docs.
- Because plausible completion is not correctness, it should route agents to validation commands, task harnesses, contracts, and checks.

### 6.1 Start with the smallest useful file


Start from an empty file or a minimal template.

Do not try to write the perfect `AGENTS.md` upfront. A large first version will usually contain generic advice, duplicated docs, and speculative rules that have not earned their place.

The first version should usually contain only:

- what this repo is;
- how to install, run, test, lint, typecheck, and build;
- where the canonical docs live;
- any hard constraints that are already known and broadly relevant.

A minimal first version is better than a comprehensive one because it lets you observe where the agent actually struggles.

Examples:

- https://github.com/valery-judah/sem-rag/blob/main/AGENTS.md
- https://github.com/valery-judah/python-repo-template

### 6.2 Add only project-specific defaults


The most valuable instructions are not generic engineering advice. They are local defaults that an agent cannot reliably infer from public training data or common conventions.

Add instructions when the agent's default behavior is misaligned with this project.

Examples:

- the agent uses `pip`, but the project uses `uv`;
- the agent runs `pytest`, but the project expects `make test`;
- the agent edits generated files instead of source files;
- the agent adds a dependency without checking existing libraries;
- the agent writes tests in the wrong framework;
- the agent violates local architecture boundaries;
- the agent changes public behavior without updating the contract.

Do not add rules like "write clean code" or "follow best practices." The agent already has generic software-engineering priors. `AGENTS.md` should correct those priors where they are wrong for this repository.

### 6.3. Treat context as a budget


Root `AGENTS.md` is expensive because it is read broadly across sessions and tasks.

Every line competes with more task-relevant context: source files, diffs, test output, error logs, design docs, and user instructions.

Therefore, root `AGENTS.md` should contain only information that is:

- stable;
- high leverage;
- relevant to many tasks;
- easy to miss from code alone;
- not better enforced elsewhere.

If a topic requires a long explanation, it probably does not belong in the root file. Move it to a canonical doc and link to it.

### 6.4. Make it a map, not a manual: use progressive disclosure


> The file should route agents to sources of truth, not duplicate them.

`AGENTS.md` should not contain all project knowledge. It should route the agent to the right knowledge at the right time.

The root file should contain only universal context:

- what this repo is;
- required commands;
- non-negotiable constraints;
- task routing;
- validation expectations.

Detailed or specialized instructions should live in canonical docs and be loaded only when relevant.

### 6.5. Add modules only when they are earned


Do not add modules because they sound useful. Add them because the agent repeatedly needs that instruction and the absence of the instruction causes real mistakes.

Before adding a module, ask:

1. What failure mode did we observe?
2. Is the failure recurring or costly?
3. Can the instruction be stated in a few lines?
4. Is it stable enough to belong in root `AGENTS.md`?
5. Can we tell whether the instruction helped?
6. Would a test, lint rule, script, or canonical doc be better?

If the module cannot pass this test, do not add it yet.

### 6.6. Prefer enforcement over prose


If a rule matters, eventually enforce it with CI, lint, scripts, tests, or structural checks. `AGENTS.md` should point to those mechanisms, not become the only enforcement layer. When a rule becomes mechanically enforced, shrink the prose to a short reminder or link.

This is also a core harness-engineering lesson: agents work better in environments with strict boundaries, predictable structure, accessible tools, fast tests, and feedback messages that tell them how to recover.

### 6.7. Convert repeated failures into harness improvements


Every repeated agent failure is a signal that the harness is missing something.

When an agent makes the same kind of mistake twice, do not only correct the current output. Improve the environment so the mistake is less likely next time.

Possible destinations:

- add a short rule to `AGENTS.md`;
- add or update a canonical doc;
- create a script for a repeated workflow;
- add a Make target;
- improve test coverage;
- add a lint rule or CI check;
- improve error messages so they tell the agent how to recover;
- add a feature contract, runbook, or execution plan.

Use this rough rule:

```
Simple local default      → AGENTS.md  
Detailed explanation      → canonical doc  
Repeated manual workflow  → script or Make target  
Important invariant       → CI, lint, test, or structural check  
Feature-specific behavior → feature contract
```


This keeps `AGENTS.md` from becoming a dumping ground while still turning agent mistakes into durable improvements.

### 7. Separate stable root rules from changing domain knowledge


Stable, universal rules belong in root `AGENTS.md`. Changing guidance belongs deeper in the handbook, domain docs, feature docs, or package-level `AGENTS.md` files. In monorepos, rules that apply only to one package should live in that package's nested `AGENTS.md`, not in the root.

### Anti-patterns to avoid


Do not let root `AGENTS.md` become:

- a full engineering handbook;
- a style guide replacement;
- a dumping ground for "important things";
- a graveyard of stale rules;
- a duplicate of canonical docs;
- a place for rules that should be enforced by tooling;
- a large generic prompt full of conflicting dos and don'ts.

Keep the loop simple, use clear markdown sections, write explicit algorithms for important workflows, and provide examples where the agent must choose between similar actions.

# Goals of the user-project-agent context system


The goal is not to "write a good `AGENTS.md`." `AGENTS.md` is only one part of a larger system: user, project, coding agent, repository knowledge, validation tools, and feedback loops.

The real goal is to increase the agent's **reliable autonomy** on project work.

Reliable autonomy means that a coding agent can complete larger, more valuable tasks end-to-end while preserving project quality, following local constraints, validating its work, and escalating when it cannot safely proceed.

This is a property of the whole system, not of the agent alone and not of `AGENTS.md` alone.

## North star


The north star is **quality-adjusted autonomous task completion**.

A stronger formulation is:

> The system should allow a coding agent to complete larger, more valuable tasks end-to-end with less repeated human steering, stronger validation, and controlled risk.

## System-level goal


The context-management system should make the project **legible, navigable, and safely changeable** by agents.

It should give the agent the right context, constraints, tools, and feedback at the right time, so the agent can transform user intent into validated project changes.

This system includes more than `AGENTS.md`. It includes canonical docs, architecture maps, feature contracts, execution plans, tests, linters, CI, scripts, generated schemas, runbooks, review feedback, and maintenance processes.

The core system goal is:

> Maximize agent effectiveness per unit of context.

This matches the "context engineering" idea: the problem is not just prompting, but filling the model's context window with the right information for the next step, while controlling what does and does not enter context.

## User goals


The user wants leverage.

A good context-management system should let the user delegate well-scoped work and receive a result that is useful, reviewable, and close to mergeable.

The user should spend less time repeating project-specific instructions, correcting predictable mistakes, reminding the agent which commands to run, explaining where docs live, or catching the same architectural violations again and again.

The user should remain responsible for intent, product judgment, architecture judgment, and risk decisions. The agent should absorb routine execution work, but not silently take over decisions that require ownership or taste.

So the user goal is:

> Delegate more routine and semi-complex work without losing control over quality, architecture, or risk.

# Examples

```
# Agent Contract

## Canonical sources
- `docs/evergreen/mvp.md` - product scope
- `docs/evergreen/architecture.md` - architecture and current repo shape
- `docs/evergreen/api-contracts.md` - stable runtime interfaces
- `docs/evergreen/runbook.md` - local commands and operation
- `docs/README.md` - docs index

`docs/evergreen/` is canonical. `docs/delivery/` is reference-only. `docs/workstreams/` is history-only.

## Commands
- Use `uv` as the Python command entrypoint for this repo.
- Prefer `uv run poe <task>` for defined developer workflows; otherwise use `uv run <tool>`.
- Do not use `pip`, `python -m pip`, `poetry`, `pipenv`, `npm`, or `npx` for repo workflows.
- Use `make` for local DevEx and infrastructure wrappers such as Docker, Docker Compose, observability stack operations, and docs harness helpers like `make workstream-new type=<work_type> slug=<slug>`, as defined in [`Makefile`](Makefile).
- Common anchors: `uv sync`, `uv run poe verify`, `uv run poe run-api`, `uv run poe run-worker`, `make docker-up-build`, `make workstream-new type=feature slug=my-feature`.
- For the full command catalog and operational guidance, use [`docs/evergreen/runbook.md`](docs/evergreen/runbook.md).
- To inspect the current command surface directly, use `uv run poe --help` and `make help`.

## Validation
- Docs-only change: no mandatory validation; run targeted checks only if docs affect commands or generated artifacts.
- Code change: `uv run poe verify`

## Development Practices
- Save any temporary, exploratory, or developer-experience (devex) scripts into the `scripts/devex/` directory.
```
