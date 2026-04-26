---
draft: false
toc: true
title: "Agents Old"
linkTitle: "Agents Old"
---
# Agent Contract For This Repository


This file is the root contract for agents working in this repository. It is a short map, not the full handbook.

## 1) Instruction Precedence


When instructions conflict, apply this order:

1. System and developer instructions
2. `AGENTS.md`
3. Handbook and feature docs under `docs/`
4. Task-specific plans

## 2) Non-Negotiables

### Environment and commands


- Use `uv` for Python package and tool execution.
- Prefer `make` targets when available.
- If a task is not covered by `Makefile`, use `uv run <tool>`.
- Do not use `pip`, `python -m pip`, `poetry`, or `pipenv` directly.

### Package and import behavior


- Treat `src/` as the source of truth.
- Validate installed-package behavior in tests; do not rely on path hacks.
- Use editable install via `make install` for local development and tests.
- Do not modify `PYTHONPATH` to bypass package behavior.

### Dependency management


- Change dependencies through `pyproject.toml` and `uv`.
- Keep `uv.lock` committed and in sync after dependency changes.
- Do not hand-edit `uv.lock`.

### Change discipline


- Keep changes small and focused.
- Update tests when behavior changes.
- Preserve public API compatibility unless the task explicitly changes it.
- Avoid dead code, commented-out code blocks, and broad `except Exception` without justification.
- Never revert unrelated user changes.

## 3) Command Policy


Use these commands by default:

- Sync environment: `make sync`
- Editable install: `make install`
- Run app: `make run`
- Format: `make fmt`
- Lint: `make lint`
- Type check: `make type`
- Tests: `make test`

## 4) Task Matrix


| Task type                    | Required checks                                                                     | Open next                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Docs-only                    | No mandatory test run; run targeted validation if docs change contracts or commands | `docs/handbook/02_task-routing.md`                                                       |
| Code change, no API change   | `make test`                                                                         | `docs/handbook/03_engineering-standards.md`                                              |
| API, schema, or logic change | `make fmt`, `make lint`, `make type`, `make test`                                   | `docs/handbook/03_engineering-standards.md` and `docs/handbook/04_review-and-quality.md` |
| Feature work                 | Required checks from the slice being changed                                        | `docs/handbook/05_feature-doc-contract.md`, then `docs/features/<feature>/`              |
| Review                       | Findings first, with concrete file references                                       | `docs/handbook/04_review-and-quality.md`                                                 |
| Workflow or policy change    | Update the handbook in the same change                                              | `docs/handbook/07_maintenance-and-governance.md`                                         |

## 5) Stop And Escalate


Stop and ask for guidance when:

- Requirements conflict across source-of-truth docs.
- A task requires changing public behavior without a documented contract.
- Existing docs or code imply multiple valid implementations and the choice matters.
- You find unexpected user changes that directly conflict with the current task.

Escalate documentation when:

- Workflow, quality gates, architecture boundaries, or operating conventions change.
- The same feedback appears twice in review or postmortems.
- A rule would be more reliable as lint, CI, or automation than as prose.

## 6) Review Contract


When asked to review:

- Prioritize bugs, regressions, risks, and missing tests.
- Order findings by severity.
- Include concrete file references.
- Keep summaries brief and secondary.
- State explicitly when no findings were found and note residual risks or testing gaps.

## 7) Routing Map


Use the handbook as the system of record:

- Start at `docs/handbook/README.md` for the handbook index.
- Open `docs/handbook/01_operating-model.md` for repo-wide execution behavior.
- Open `docs/handbook/02_task-routing.md` to decide which docs to load next.
- Open `docs/handbook/03_engineering-standards.md` for coding, architecture, and tooling rules.
- Open `docs/handbook/04_review-and-quality.md` for checks, review, and definition of done.
- Open `docs/handbook/05_feature-doc-contract.md` before creating or changing feature docs.
- Open `docs/handbook/06_golden-principles.md` for legibility and consistency rules.
- Open `docs/handbook/07_maintenance-and-governance.md` when changing workflow, docs, or recurring quality processes.

Feature contracts live under `docs/features/<feature>/`.

Start new feature docs from `docs/templates/features/`.
