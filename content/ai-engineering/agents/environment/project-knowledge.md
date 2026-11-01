---
draft: false
toc: true
title: "Project Knowledge in the Agent Development Environment"
description: "What agents need to know about a project and where it's kept: three dimensions of project knowledge, an example layout of repository docs, shared agent docs, task directories, and local files, and how AGENTS.md points to each."
linkTitle: "Project Knowledge"
---

This note describes project knowledge, the part of the [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}) that reduces the effort agents need to find and understand the knowledge their work requires. It was moved out of the ADE note in step 27 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}). In the terms of the ADE note, project knowledge is an inferential guide: the agent reads it and decides what it means for the task ([Feedforward and feedback controls]({{< ref "ai-engineering/agents/environment/ade" >}}#feedforward-and-feedback-controls)).

That knowledge extends beyond technical documentation. It includes product vision, product framing, domain concepts, architectural principles, design decisions (like ADRs), and engineering conventions. It also includes task state, such as plans and handoffs, which belongs to one task and changes all the time ([Lasting Knowledge and Task State]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#lasting-knowledge-and-task-state)).

## Dimensions and approaches


Project knowledge has three dimensions:

| Dimension                   | Question                                         | Examples                                                                               |
| --------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Knowledge sources**       | What information does the agent need?            | Product vision, architecture, engineering conventions, task requirements               |
| **Knowledge accessibility** | How can the agent access that information?       | Repository files, mounted directories, external systems, synchronized task directories |
| **Knowledge guidance**      | How does the agent know what information to use? | `AGENTS.md`, task instructions, direct human guidance                                  |

The approaches operate at different levels:

1. **Knowledge provisioning:** Make information available locally through repository documentation, mounted directories, or external systems.
	- **Repository-local documentation:** Maintain a `docs/` directory containing canonical project knowledge.
	- **Mounted documentation:** Link external documentation repositories into the development workspace, as with `agent-docs/`.
2. **Knowledge discovery:** Declare authoritative sources in `AGENTS.md` or structured configuration so the agent knows where to look.
3. **Human guidance:** Direct the agent to specific documents, concepts, or constraints when assigning work.
4. **Task context preparation:** Assemble task-specific context, such as an Azure Boards ticket and related documentation, into a `tasks/` directory.

## Example layout for project knowledge


This layout follows the [python-repo-template](https://github.com/valery-judah/python-repo-template). The template already splits `docs/` by status and links a shared `agent-docs` directory into each project. The `tasks` link and the extra directories marked *proposed* are not in the template yet. Projects with the same structure add further patterns: knowledge-assistant and its sibling repositories, wallet-evals, and lang-assistant. Each subsection below adds what they do.

```text
project/
├── AGENTS.md                    # entry point: sources, commands, validation
├── CLAUDE.md                    # imports AGENTS.md for Claude Code
├── README.md                    # setup and running locally
├── Taskfile.yml                 # repo:init creates the links below
├── .claude/settings.json        # Claude Code deny rules
├── docs/
│   ├── README.md                # index of the docs tree
│   ├── evergreen/               # canonical; wins when sources disagree
│   │   ├── architecture.md
│   │   ├── api-contracts.md
│   │   ├── mvp.md
│   │   └── runbook.md           # command reference and procedures
│   ├── product/                 # product work in progress
│   │   ├── concepts.md
│   │   └── spec.md
│   └── delivery/                # reference-only delivery notes
├── scripts/devex/               # temporary and exploratory scripts
├── src/<package>/
├── tests/
├── agent-docs -> ~/agent-docs   # shared across projects; ignored by Git
└── tasks -> ~/tasks/<project>   # proposed: task context; ignored by Git
```

### Repository docs


`docs/` holds the knowledge that is versioned with the code, split by status. `evergreen/` is canonical and wins when sources disagree. `product/` holds product work in progress until it is promoted to `evergreen/`. `delivery/` holds reference-only notes. `docs/README.md` indexes the tree, and `README.md` covers setup.

`docs/evergreen/runbook.md` holds the full command reference and, as the project needs them, operational procedures such as deployment and troubleshooting. Other canonical project knowledge also goes in `evergreen/`, for example architecture decision records and feature contracts ([How one feature behaves]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#how-one-feature-behaves)).

knowledge-assistant gives each kind of document its own folder:

```text
docs/
├── README.md        # map: what each folder holds and where new material goes
├── evergreen/       # canonical description of implemented behavior
├── product/         # product direction before it is implemented
├── adr/             # numbered records of durable technical decisions
├── evals/           # human-readable acceptance protocols
├── infra/           # setup, operation, and recovery of infrastructure
├── workstreams/     # reference-only delivery history
└── ideas.md         # scratchpad; promote an idea before implementing it
evals/               # executable eval schemas and examples
```


Its `docs/README.md` says where each new piece goes. Update the evergreen contract when the implementation changes. Start unimplemented product direction in `product/`. Record a durable technical choice as an ADR, and repeatable acceptance work as a protocol in `docs/evals/`. Workstream and scratch notes are never current contracts. The workstreams hold the specs of past slices and saved discussions, such as a research conversation about a retrieval design. With the map in `docs/README.md`, the project's `AGENTS.md` needs one line for documentation: use `docs/README.md` as the map.

### Shared agent docs

```text
~/agent-docs/                          # its own Git repository
├── conventions/
│   └── commit-message-conventions.md
├── domain-modeling-and-refactoring.md
├── guides/                            # proposed
│   ├── testing.md
│   └── review-checklist.md
├── runbooks/                          # proposed
│   ├── new-repository.md
│   └── python-release.md
└── templates/                         # proposed
    ├── adr.md
    ├── feature-spec.md
    └── task-brief.md
```


`agent-docs` is a separate Git repository of Markdown files, cloned once, by default to `~/agent-docs`. `task repo:init` runs `task repo:agent-docs`, which links the clone into the project as `agent-docs` when the clone exists and keeps any existing entry. `.gitignore` keeps the link out of the project's history. Every project then reads the same files, without installing them as skills.

It holds knowledge that applies to every project. Today that is the commit message conventions and a guide to domain modeling and refactoring. Other candidates:

- **Guides** for practices the projects share, such as the testing approach or a review checklist.
- **General runbooks** for procedures that are the same in every project, such as creating a repository from the template or releasing a Python package with `uv`.
- **Templates** for documents that projects create often, such as an architecture decision record, a feature spec, or a task brief.

A fact about one project goes in that project's `docs/`. When the shared docs and a project's docs disagree, the project's docs win.

The projects link `agent-docs` in three ways:

- **A link created by a task and ignored by Git.** The template's `task repo:agent-docs` links `~/agent-docs` on each machine. The runbook shows how to link a clone kept elsewhere by hand.
- **A relative link committed to Git.** knowledge-assistant tracks `agent-docs -> ../../../agent-docs`. It works only when the checkout sits at the same depth below the clone's parent directory.
- **A link made on another machine.** lang-assistant's link holds an absolute Linux path from another machine, so on this Mac it points nowhere.

The task's link holds an absolute path, so it survives a move of the project. A move of the clone breaks it, and `task repo:agent-docs` keeps an existing entry even when it points nowhere, so the broken link has to be removed before the task can create a new one. A committed relative link breaks on any machine where the two directories sit differently.

### Other linked directories


The same mechanism brings in other sources that the agent needs and the repository doesn't own:

- **Data.** knowledge-assistant and knowledge-assistant-search-ui both link `data -> ../data`, a Markdown corpus kept beside the repositories. The application indexes the corpus through the link, and the corpus stays out of both repositories.
- **Product notes.** knowledge-assistant links `docs/assistant-docs` to a folder in the author's notes vault, so the agent can read product thinking kept outside the repository. The link is an absolute path committed to Git, and the folder no longer exists at that path, so the link points nowhere.
- **The system under test.** wallet-evals evaluates the wallet application and links its checkout as `wallet-sut`, ignored by Git, so the agent can read the code it evaluates.
- **A sibling repository's contract.** knowledge-assistant's browser application lives in knowledge-assistant-frontend. The backend exports its OpenAPI schema with `task api:schema`. The frontend commits the schema as `openapi.json`, generates its client from it, and checks that the committed client still matches. Its `AGENTS.md` tells the agent to treat `openapi.json` as the backend-owned contract. The contract crosses the repository boundary as a file, so neither repository needs a link to the other.

### Task directory

```text
~/tasks/<project>/
├── 1234-export-invoices/        # one directory per work item
│   ├── ticket.md                # work item text, exported from Azure Boards
│   ├── context.md               # links to related docs, decisions, and code
│   ├── plan.md                  # steps, progress, and decision log
│   └── notes/                   # logs, query output, screenshots
└── 1240-fix-login-timeout/
```


A task directory holds the context for one piece of work, prepared before the agent starts: the work item text, links to the docs, decisions, and code it touches, the plan, and output from investigation. The agent reads the directory at the start and updates `plan.md` as it works, so a later session can continue where the last one stopped.

The proposed setup works like `agent-docs`. The task directories live outside the repository, for example in `~/tasks/<project>/`, and the project links them as `tasks`, ignored by Git. A `repo:tasks` target, like `repo:agent-docs`, could create the link, and a script could fill `ticket.md` from Azure Boards.

Keeping task context outside the repository keeps ticket text and working notes out of the project's history. OpenAI's team made the opposite choice and checks execution plans into the repository, where every agent and reviewer can see them ([OpenAI 2026](#openai-2026-harness)). Either way, a decision that outlasts the task moves to `docs/` when the task ends.

wallet-evals keeps workstreams inside the repository:

```text
workstreams/
├── ws-003-eval-runner.md        # what the workstream delivers
├── ws-003-eval-runner/          # its design notes
│   ├── eval-runner-interface.md
│   └── eval-runner-workflow.md
├── ws-004-trace-viewer.md
└── ws-004-trace-viewer/
.rws.yaml                        # current_workstream: workstreams/ws-004-trace-viewer
```


Git tracks the workstream files. It ignores `.rws.yaml`, which names the workstream in progress on this checkout. No other file in the repository mentions `.rws.yaml`, so an agent learns which workstream is current only when someone tells it.

lang-assistant uses a handoff file instead. `docs/handoff.md` is written for the next session that continues the work. It names the commits the work depends on, says what changed, and says what to check before continuing in another worktree. Git ignores the file, so it stays in the checkout where it was written. The file itself warns that other worktrees don't have it.

### Local and private files


Some knowledge stays on one machine, and Git ignores it:

- **Secrets.** `.env` holds secrets. The tracked `.env.example` shows which variables exist without their values.
- **Local configuration.** knowledge-assistant tracks `config/runtime.toml` and ignores `config/runtime.local.toml`, which holds local overrides.
- **Private evaluation data.** knowledge-assistant keeps the eval schema and an example in the tracked `evals/` directory and the judgments on the real corpus in `.local/evals/`. An agent can learn the format and run the evaluation, and the private judgments stay out of Git.

### Pointing the agent to each source


A linked directory helps only when the agent knows it is there. Search tools may skip linked directories. By default, ripgrep skips paths listed in `.gitignore` and doesn't follow symlinks. In the template, `rg` run from the project root finds nothing in `agent-docs/`. It finds the files when given the path `agent-docs/`, or when run with `--follow --no-ignore-vcs`.

The template's `AGENTS.md` therefore names each source, says when to read it, and says how to search the linked directory:

```markdown
## Canonical sources
- `README.md` - setup and running locally
- `docs/evergreen/runbook.md` - full command reference
- `docs/README.md` - docs index
- `agent-docs/` - conventions shared across projects, when present. Git ignores it, so search it by path, such as `rg <pattern> agent-docs/`.
- `tasks/<id>/` - context for the current task, when present. Read `plan.md` first and keep it up to date.

`docs/evergreen/` is canonical and wins when sources disagree.
```


When assigning work, name the task directory in the request, for example "Work on `tasks/1234-export-invoices/`."

## References


- OpenAI (2026). [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/). ^openai-2026-harness
