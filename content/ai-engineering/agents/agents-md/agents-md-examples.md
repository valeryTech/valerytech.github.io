---
draft: false
toc: true
title: "Two Example AGENTS.md Files"
description: "Two root AGENTS.md files from real projects with the same layout: keys, a small CLI run through a Taskfile, and sem-rag, a document question-answering service run through a Makefile, with notes on how each follows the design rules."
linkTitle: "Examples"
---

These are the root `AGENTS.md` files of two of my projects, copied on 2026-11-16. Both use the layout of the agent contract in python-repo-template: a short description of the project, the canonical sources, commands, validation, and where scratch scripts go. They differ in the command runner. `keys` runs its workflows through Go Task (`Taskfile.yml`), and `sem-rag` runs them through GNU Make (`Makefile`), which calls Poe tasks for Python work and Docker Compose for containers.

[Designing the Root AGENTS.md]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}) gives the design rules the notes below refer to, and [Where Fixes Go and How AGENTS.md Changes]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}) says where guidance goes when it doesn't belong in the root file. [Command Layer]({{< ref "ai-engineering/agents/environment/command-layer" >}}) describes the command runners.

## a small CLI with a Taskfile


`keys` is a small terminal tool for a developer's local setup. It was generated from python-repo-template, so its `AGENTS.md` is the template's contract with the project's description and package filled in. In the copy below, the description and the package name are replaced with generic text.

```markdown
# Agent Contract

Small terminal tool for a developer's local setup.

The Python package is in `src/<package>/`.

## Canonical sources

### Repository and infrastructure
- `README.md` - setup and running locally
- `docs/README.md` - docs index
- `docs/evergreen/runbook.md` - full command reference
- `agent-docs/` - conventions shared across projects, when present. Git ignores it, so search it by path, such as `rg <pattern> agent-docs/`.
- `tasks/<id>/` - context for the current task, when present. Read `plan.md` first and keep it up to date.

### Product and architecture
- `docs/product/framing.md` - what the product is, who it is for, and why. Read it before changing product behavior.
- `docs/product/concepts.md` - exploratory concepts and mental models
- `docs/evergreen/mvp.md` - stable product scope
- `docs/evergreen/architecture.md` - module boundaries and repository shape
- `docs/evergreen/api-contracts.md` - runtime interfaces and compatibility guarantees

`docs/evergreen/` is canonical and wins when sources disagree. `docs/product/` holds product work in progress until it is promoted to `docs/evergreen/`. `docs/delivery/` is reference-only.

## Commands
- Run workflows through `task`, otherwise `uv run <tool>`. Do not use `pip`, `python -m pip`, `poetry`, `pipenv`, `npm`, or `npx`.

## Validation
- Code change: `task quality:verify`.
- Docs-only change: none.

## Scratch scripts
- Put temporary, exploratory, and devex scripts in `scripts/devex/`.
```

### How the file follows the design rules


- **The commands section is one line.** It names the runner, the fallback, and the tools not to use. The commands themselves are in `Taskfile.yml`, grouped in namespaces (`repo:`, `quality:`, `app:`, `security:`), and `task help` lists them with descriptions. The full reference is in the runbook ([Make it a map, not a manual]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#make-it-a-map-not-a-manual)).
- **It states a local default.** Agents tend to use `pip`, and this project uses `uv` ([A local default]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#a-local-default)).
- **It says which source wins.** `docs/evergreen/` is canonical, `docs/product/` is work in progress, and `docs/delivery/` is reference only ([Name the sources of truth]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#name-the-sources-of-truth)).
- **It gives one check for code changes.** `task quality:verify` runs the format check, lint, type checks, and tests. Docs-only changes need no check ([Define done and when to ask]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#define-done-and-when-to-ask)).

Two lines come from the template and apply only when the folder exists: `agent-docs/` and `tasks/<id>/`. They say "when present", so the same contract works in every project generated from the template.

## sem-rag: a service with a Makefile


`sem-rag` answers questions over uploaded PDF and Markdown files and shows the evidence behind each answer. It has an API, a background worker, and a Postgres database, and it runs locally in Docker Compose. Make is the entry point for every workflow: its targets call Poe tasks in `poe_tasks.toml` for Python work and Docker Compose for containers, and `make help` prints the targets in groups.

```markdown
# Agent Contract

sem-rag (Python package `doc_forge`) answers questions over a bounded corpus of uploaded PDF and Markdown files and shows the evidence behind each answer. A FastAPI app and a lifecycle worker share a Postgres database. Local runs use Docker Compose, and answer generation can use Ollama or MLX.

## Canonical sources

### Repository and infrastructure
- `README.md` - project overview and quick start
- `docs/README.md` - docs index
- `docs/evergreen/runbook.md` - commands, local workflows, configuration, and troubleshooting
- `docs/evergreen/observability-operations.md` - the observability stack, log and query bundle locations, and eval run flows
- `docs/engineering/` - Python modeling, logging, and testing conventions
- `docs/harness/` - workstream templates, playbooks, and scripts

### Product and architecture
- `docs/evergreen/mvp.md` - product scope
- `docs/evergreen/functional-requirements.md` - MVP acceptance criteria
- `docs/evergreen/first-tier-failures.md` - critical failure model
- `docs/evergreen/architecture.md` - current architecture and the gap to the target
- `docs/evergreen/lifecycle-and-evidence-flow.md` - document and query lifecycles
- `docs/evergreen/retrieval-hierarchy.md` - retrieval units and provenance structure
- `docs/evergreen/api-contracts.md` - HTTP contract and local routes
- `docs/adrs/` - architecture decisions

`docs/evergreen/` is canonical and wins when sources disagree. `docs/delivery/` is reference only,
and `docs/workstreams/` is history only.

## Commands
- Use `make <target>` for repository workflows and `make help` for the current catalog. Pass extra arguments with `ARGS='...'`.
- Make calls Poe tasks in `poe_tasks.toml` for Python work and Docker Compose for containers. If no target exists, use `uv run <tool>`.
- Do not use `pip`, `python -m pip`, `poetry`, `pipenv`, `npm`, or `npx`.
- `app-api` and `app-worker` stay in the foreground. To run the app and get the shell back, use `make stack-up`, then `make stack-status`, `make stack-logs`, and `make stack-down`.
- `make stack-clean` deletes the database volume. Run it only when asked.
- `make db-shell` is interactive. Pass the query with `ARGS='-c "<sql>"'`.
- To convert a PDF to Markdown, follow the PDF-to-Markdown section of the runbook.

## Validation
- Code change: `make verify`.
- Change to ingestion, retrieval, answering, or the runtime containers: also run `make e2e-test`. It needs Docker.
- Docs-only change: check that the commands and links you changed exist.

## Scratch scripts
- Put temporary, exploratory, and devex scripts in `scripts/devex/`.
```

### How the file follows the design rules


- **It has more canonical sources.** The project has an API contract, a lifecycle model, a retrieval hierarchy, and architecture decisions, and the file lists where each one is. It still only points to them ([Make it a map, not a manual]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#make-it-a-map-not-a-manual)).
- **The commands section explains how to call Make.** Make has no standard way to pass arguments to a target, so the file says to use `ARGS='...'`. It also says that Make calls Poe and Compose, so the agent doesn't call them directly.
- **It names the targets an agent would get wrong.** `app-api` and `app-worker` don't return, so the file points to `make stack-up`, which starts the services in the background and returns once they're healthy ([Commands that start services]({{< ref "ai-engineering/agents/environment/command-layer" >}}#commands-that-start-services)). `make db-shell` opens an interactive `psql` session, so the file shows how to pass one query instead ([Where developers and agents differ]({{< ref "ai-engineering/agents/environment/command-layer" >}}#where-developers-and-agents-differ)).
- **Validation depends on what changed.** Every code change runs `make verify`. Changes to ingestion, retrieval, answering, or the containers also run `make e2e-test`, which needs Docker. A docs-only change still needs a check that the changed commands and links exist.
- **One line is an approval rule.** "`make stack-clean` deletes the database volume. Run it only when asked." is a rule of the form "ask before X". By [Approval rules]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#approval-rules), it would hold better as a permission setting, such as `"ask": ["Bash(make stack-clean*)"]` in Claude Code, with at most the fact that the target deletes data kept in the file.

## Comparing the two files


| | `keys` | `sem-rag` |
|---|---|---|
| Command runner | Go Task | GNU Make, which calls Poe and Docker Compose |
| Lines in the file | 33 | 46 |
| Lines in the commands section | 1 | 7 |
| Command catalog | `task help` | `make help` |
| How commands are grouped | Namespaces such as `quality:verify` | Prefixes such as `stack-up` and `stack-down` |
| Passing arguments | After `--`, as in `task app:run -- <args>` | `ARGS='...'` |
| Checks for a code change | `task quality:verify` | `make verify`, and `make e2e-test` for some areas |

Most of the difference comes from the project. `keys` has no services, database, or containers, so it has no commands that run in the foreground, open an interactive session, or delete data. The runner accounts for the rest. Go Task has namespaces and passes arguments after `--` the same way for every task, so the file doesn't need to explain how to call it. With Make, the file says how to pass arguments and what Make calls underneath.
