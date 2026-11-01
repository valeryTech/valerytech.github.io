---
draft: false
toc: true
title: "Agent Development Environment"
description: "A proposed term for what a repository gives coding agents, apart from the harness that runs them: structure, commands, docs, conventions, and feedback. Covers feedforward and feedback controls, developer experience, and project knowledge."
linkTitle: "Development Environment"
---

Here, _Agent Development Environment_ is a proposed architectural term, not a formally standardized industry category.

**The harness determines how the agent operates. The development environment determines what resources, conventions, and feedback are available for doing engineering work.**

## Definitions and boundaries


The terms in this area have no settled meanings. *Harness*, in particular, names both the software that runs the agent and everything a team builds around it. This section fixes the meanings used in this note and says where each part ends.

|Concept|Responsibility|
|---|---|
|**Agent harness**|Runs the agent, connects it to models and tools, and controls execution.|
|**Agent Development Environment**|Provides the repository structure, commands, documentation, checks, and workspace conventions the agent works with.|
|**Agentic DevEx**|The broader engineering practice of making development workflows effective for both humans and agents.|

### Agent harness


In this note, the *agent harness* is the software that runs an agent session. It connects the model to context and tools, runs the agent loop, and keeps the session's state (VS Code docs). Claude Code and Codex are harnesses. A source-code study of eleven coding harnesses identified seven subsystems common to them: the agent loop, model integration, the tool system, context and memory, safety and permissions, orchestration, and extensibility (Barbaste et al. 2026).

The VS Code documentation separates the harness from the language model, from the account that gives access to the model, from the *agent role* (the instructions and tools that apply to a task), and from the *execution environment* (where tools run and changes are made, such as the local machine, a dev container, or a cloud host).

A team using Claude Code or Codex configures the harness and doesn't change its code. It sets what the harness exposes: instruction files, permission settings, hooks, skills, and tool connections.

### Other uses of "harness"


Other sources draw the line elsewhere:

- **Böckeler** uses the wide sense: an agent is a model plus its harness, so the harness is everything except the model. She splits it into the *built-in harness*, which ships with the tool (its system prompt, context retrieval, and orchestration), and the *user harness*, the guides and sensors a team adds for its own codebase (Böckeler 2026).
- **Diaz et al.** separate the *technical harness*, the software around one model in one session, from the *methodological harness*, the practices and artifacts a team owns, centered on specifications. They call the technical harness transient and the methodological harness durable (Diaz et al. 2026).
- **OpenAI's team** uses *harness engineering* for its whole job: designing environments, specifying intent, and building feedback loops (OpenAI 2026).
- **The design note** also uses the wide sense. Its harness includes permission settings, hooks, scripts, tests, linters, and CI ([Participants]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#participants)).

|Source|The software that runs the session|What the team builds around it|
|---|---|---|
|VS Code docs|Agent harness|Not named|
|Böckeler|Built-in harness|User harness|
|Diaz et al.|Technical harness|Methodological harness|
|This note|Agent harness|Agent Development Environment, within Agentic DevEx|

The last column lines up only roughly. Diaz et al.'s methodological harness includes parts of the environment, such as shared knowledge, executable specifications, and isolated worktrees, and also team practices, such as how results are accepted and how much autonomy agents get.

### Agent Development Environment


The *Agent Development Environment* is what a repository and its tooling provide to any agent that works in it: the repository structure, commands, documentation, checks, and workspace conventions. It overlaps with Böckeler's user harness. This note uses a separate term for two reasons. The environment is designed to behave the same whichever harness runs the agent, and it includes workspace setup and provisioning as well as guides and sensors.

For example, the agent doesn't need to decide where temporary scripts belong. The project defines that convention. It doesn't need to discover how to run tests. The project exposes a standard command. It doesn't need every engineering convention copied into its initial context. It can access shared documentation when relevant.

The [python-repo-template](https://github.com/valery-judah/python-repo-template) mainly implements this concept: an environment that behaves predictably whichever coding agent uses it.

The boundary with the harness follows who writes a part and who runs it:

- **Harness:** a part that ships with the tool and that the team can only configure, such as the agent loop, context compaction, and the enforcement of permission rules.
- **Environment:** a part that the team writes and keeps in the repository or its tooling, and that works for any agent, such as `AGENTS.md`, documentation, task targets, tests, linters, CI, and git hooks.
- **On the boundary:** tool-specific settings, such as `.claude/settings.json`, Codex rules, and Copilot agent profiles. The team writes them, but only one harness reads each file, and that harness enforces it. The architecture below places them under *Agent Integration*. Keeping them in sync across tools is an open question ([Several agent tools in one repository]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#several-agent-tools-in-one-repository)).

VS Code's execution environment, the machine or container where the tools run, is infrastructure. The environment includes how that machine or container is set up: setup scripts, dev container definitions, and a separate worktree for each task.

### Agentic DevEx


*Developer experience* (DevEx) is how easily and effectively developers can do their work with a team's tools and processes. *Agentic DevEx* extends it to agents: the practice of making development workflows effective for both people and agents. It includes the environment, and also team practices, such as how tasks are specified, how results are accepted, and how much autonomy agents get. Most of Diaz et al.'s methodological harness falls here.

## Problems and goals


The central question is how the environment can guide the agent toward valid solutions and expose its mistakes early enough for the agent to correct them.

### Problems


Teams that hand engineering work to coding agents report these problems:

- **The environment is underspecified.** The agent lacks the tools, structure, and documentation it needs to make progress. OpenAI's team traced its slow early progress to this (OpenAI 2026).
- **Knowledge outside the repository is invisible to the agent.** Decisions made in chat, documents stored elsewhere, and what people remember don't exist for the agent until someone writes them into the repository (OpenAI 2026). Agents also keep no memory between sessions, so plans and decisions are lost unless something stores them (Diaz et al. 2026).
- **Human attention becomes the bottleneck.** Agents produce changes faster than people can review and test them. OpenAI's team found its limit in human QA capacity (OpenAI 2026). At Harness, pull requests grew about sevenfold in a year while active contributors grew about 30%, and the load moved to source control, review, and CI. These are one company's internal figures (Singh and Kanodia 2026).
- **Results are hard to trust.** Models are nondeterministic and lack the team's context, and tests written by agents can give false confidence (Böckeler 2026). Agents rate their own work too highly, especially on subjective tasks such as design, and sometimes accept flawed work even when it can be checked (Rajasekaran 2026). At agent volume, people can't build trust by reading every line (Diaz et al. 2026).
- **Mistakes found late cost more.** A problem that reaches human review costs review time and tokens that an earlier check would have saved (Böckeler 2026).
- **Checks can't catch a misunderstood task.** When the intent was never written down, no test or linter can show that the agent solved the wrong problem (Böckeler 2026).
- **The codebase drifts.** Agents copy the patterns they find, including poor ones, and documentation goes stale. OpenAI's team at first spent a day a week cleaning up after agents (OpenAI 2026).
- **Agents have more access than their tasks need.** Agents often run with the developer's full credentials, read untrusted content, and can act outside the repository, which exposes them to prompt injection and misuse (OWASP).

### Goals


The overall goal is the one the design note sets for `AGENTS.md`: increase the agent's [reliable autonomy]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#goal). Agents complete larger tasks with less supervision, and people can still trust the results. For the environment, this means:

- **The agent gets the change right more often on the first attempt.** Guidance and structure steer it toward valid solutions before it acts.
- **The agent finds and fixes its own mistakes before a person sees them.** Fewer problems reach review, and fewer tokens and runs go to rework (Böckeler 2026).
- **Results come with evidence.** A reviewer can judge a change from check results, test output, and other evidence without reading every line.
- **People spend their attention on the decisions that need them.** They define intent, accept results, and make product, architecture, and risk decisions.
- **The codebase stays coherent as agents add code.** Architecture boundaries and conventions hold without constant manual cleanup.
- **Every agent gets the same environment.** Commands, documentation, and checks work the same for Codex, Claude Code, or any other agent, so each piece of knowledge goes into the repository once.
- **Agents get only the access their tasks need.** The damage a mistaken or misled agent can do is limited, and each action can be traced to the agent that took it (OWASP).

## Principles


These principles come from the sources below. Böckeler's user harness overlaps with the development environment, so most of her principles apply to it directly.

### Feedback and checks


Böckeler sorts these controls into two kinds. She calls them guides and sensors:

|Control|Purpose|Examples|
|---|---|---|
|Feedforward|Guide the agent before acting|Instructions, architecture docs, skills, code navigation|
|Feedback|Detect errors after an action|Tests, linters, structural checks, review agents|

- **Combine guidance and checks.** Guidance alone never shows whether it worked. Checks alone let the agent repeat the same mistake in every session (Böckeler 2026).
- **Run each check as early as its cost allows.** The earlier a problem is found, the cheaper it is to fix; Böckeler calls this keeping quality left. Fast checks, such as linters, type checks, fast tests, and a basic review agent, run before a commit, or during the session as agent hooks. Slow checks, such as mutation testing and broad review, run after integration, where the fast checks run again. Human review is one more check in this sequence (Böckeler 2026).
- **Prefer deterministic checks, and use model-based checks for what they can't judge.** Deterministic checks, such as tests, linters, type checkers, and structural tests, are fast and cheap and give the same answer on every run, so they can run on every change. Model-based checks, such as review agents, can judge meaning and design, but they are slower, cost more, and vary between runs (Böckeler 2026).
- **Write check output for the agent.** An error message that says how to fix the violation lets the agent correct it without help. OpenAI's team writes its custom linters' messages this way (OpenAI 2026).
- **Check the agent's work with a separate checker.** A separate evaluator is easier to make skeptical than an agent judging its own work (Rajasekaran 2026). An agent should not approve its own change (OWASP).

### Knowledge and intent


- **Put the knowledge the agent needs in the repository.** Write decisions, product context, and conventions into versioned files, or give the agent another way to reach them ([Project Knowledge](#project-knowledge)).
- **Give the agent a short entry point, and let it load details when needed.** OpenAI's team replaced a large `AGENTS.md` with a file of about 100 lines that points into a structured `docs/` directory, and checks those docs with linters and CI jobs (OpenAI 2026). The design note applies this to the root file ([Make it a map, not a manual]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#make-it-a-map-not-a-manual)).
- **Define what done means before the work starts.** A written specification of the change, kept with the code, gives the agent and the reviewer the same acceptance criteria (Diaz et al. 2026). In Anthropic's experiments, the agent writing the code and the agent checking it agreed on what done meant, and how to test it, before any code was written (Rajasekaran 2026).
- **Store plans and progress in the repository.** Work can then continue across sessions and agents. OpenAI's team checks execution plans, with their progress and decision logs, into the repository (OpenAI 2026).

### Structure and visibility


- **Enforce boundaries, and leave the implementation free.** Enforce architecture rules and other invariants mechanically, through linters and structural tests, and let the agent choose how to implement within them (OpenAI 2026). A fixed architecture limits what the agent can produce, which makes its output easier to check (Böckeler 2026).
- **Make the codebase easy to check.** Strong typing makes type checks possible, and clear module boundaries make architecture rules possible. Böckeler calls this property *harnessability*. Legacy codebases have the least of it (Böckeler 2026).
- **Make the running application visible to the agent.** When the agent can start the application for its change, drive the UI, and query logs and metrics, it can reproduce a bug and check its own fix. OpenAI's team made the application start separately in each git worktree, with its own logs and metrics (OpenAI 2026).

### Improving the environment


- **Turn each recurring failure into a change to the environment.** When the agent fails, find the missing capability, documentation, or check, and add it (OpenAI 2026; Böckeler 2026). The design note applies this to `AGENTS.md` ([Convert repeated failures into harness improvements]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#convert-repeated-failures-into-harness-improvements)).
- **Clean up continuously.** Run recurring checks and cleanup tasks outside individual changes, for drift from conventions, dead code, stale documentation, and outdated dependencies. OpenAI's team runs background agent tasks that open small refactoring pull requests (OpenAI 2026; Böckeler 2026).
- **Test each part of the environment against agent behavior.** Each part of a harness assumes something about what the model can't do alone. Remove one part at a time to see whether it still helps, and check again when a new model ships (Rajasekaran 2026). Targeted behavioral evaluations show which behavior changed, while an end-to-end score shows only that the result moved (Mullen and Gunderman 2026). See [Why it is hard to tell whether AGENTS.md works]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/agents-md-verification" >}}).

### Access


- **Give agents only the access their tasks need.** Use separate agent identities with short-lived, scoped credentials, sandboxes, and network allowlists, and require human approval for pushing, merging, and deploying (OWASP). Text in an instruction file enforces none of this ([Approval rules]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#approval-rules)).

## The broader architecture

```
Agentic Software Engineering
│
├── Agent Runtime
│   ├── Model
│   ├── Harness
│   ├── Tools
│   └── Execution controls
│
├── Agent Development Environment
│   │
│   ├── Workspace Management
│   │   ├── Scratch directories
│   │   ├── Ignored artifacts
│   │   └── Local development utilities
│   │
│   ├── Knowledge Management
│   │   ├── AGENTS.md
│   │   ├── Shared agent docs
│   │   ├── Architecture documentation
│   │   └── Engineering conventions
│   │
│   ├── Workflow Infrastructure
│   │   ├── Taskfile
│   │   ├── Build and test tooling
│   │   ├── Git hooks
│   │   └── CI
│   │
│   ├── Agent Integration
│   │   ├── Harness-specific settings
│   │   ├── Instruction adapters
│   │   └── Skills
│   │
│   └── Environment Provisioning
│       ├── Repository templates
│       ├── Dependency installation
│       └── Project initialization
│
└── Engineering Process
    ├── Task specification
    ├── Architecture and design
    ├── Implementation
    ├── Verification and review
    └── Delivery
```

## Project Knowledge in ADE.


The important part is the **Project Knowledge Infrastructure** component with central idea of reducing the effort agents need to find and understand the knowledge required for their work.

That knowledge extends beyond technical documentation. It includes product vision, product framing, domain concepts, architectural principles, design decisions (like ADRs), and engineering conventions.

We have three dimensions:

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

`docs/evergreen/runbook.md` holds the full command reference and, as the project needs them, operational procedures such as deployment and troubleshooting. Other canonical project knowledge also goes in `evergreen/`, for example architecture decision records and feature contracts ([How one feature behaves]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#how-one-feature-behaves)).

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

Keeping task context outside the repository keeps ticket text and working notes out of the project's history. OpenAI's team made the opposite choice and checks execution plans into the repository, where every agent and reviewer can see them (OpenAI 2026). Either way, a decision that outlasts the task moves to `docs/` when the task ends.

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

## Sources


- Paul Barbaste, Tristan Darrigol, Germain Vu, and Tom Wiltberger, *Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents -- A Source-Code Study of Eleven Systems* ([arXiv:2609.00006](https://arxiv.org/abs/2609.00006)), 2026. Read from the abstract.
- VS Code documentation, [Understand agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses).
- Birgitta Böckeler, [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html), martinfowler.com, 2026-04-02.
- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/), 2026.
- Prithvi Rajasekaran, [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps), Anthropic, 2026-03-24.
- Taylor Mullen and Christian Gunderman, [The anatomy of harness engineering: how to evaluate, iterate, and guard AI coding agents](https://developers.googleblog.com/en/the-anatomy-of-harness-engineering-how-to-evaluate-iterate-and-guard-ai-coding-agents/), Google Developers Blog, 2026-09-09.
- Jessica Diaz, Joaquin Gayoso, Andrea Cimminio, and Jorge Perez, *Spec-Driven Development for Agentic Software Engineering: Harnessing Human-Agent Teamwork* ([arXiv:2609.00252](https://arxiv.org/abs/2609.00252)), 2026.
- Abhinav Singh and Juveria Kanodia, [When code stops being the bottleneck](https://www.harness.io/blog/when-code-stops-being-the-bottleneck), Harness blog, 2026-10-22.
- OWASP DevSecOps Guideline, [AI agent and MCP security](https://owasp.github.io/DevSecOpsGuideline/2-Process/2-2-Develop/2-2-5-AI-Agent-and-MCP-Security/).
