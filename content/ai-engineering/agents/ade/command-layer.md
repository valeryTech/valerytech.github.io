---
draft: false
toc: true
title: "Command Layer"
description: "The named commands a repository defines for setup, checks, local services, and remote operations, kept in a task runner such as Go Task or Make. Compares six projects and covers namespaces, risky commands, tool isolation, and runbooks."
linkTitle: "Command Layer"
---

The *command layer* is the set of named commands a repository defines for its workflows: setup, checks, running the application, starting and stopping local services, and remote operations. A task runner keeps them in one file, `Taskfile.yml` for Go Task or `Makefile` for Make. Each command wraps the tools it calls and their arguments. A developer or an agent runs the command by name, for example `task quality:verify`, without knowing which tools it runs, with which flags, or in which order. The same commands serve the developer working locally, the agent, and the git hooks.

The command layer is part of the [Agent Development Environment]({{< ref "ai-engineering/agents/ade/ade" >}}). In the architecture there, it is the Taskfile under *Workflow Infrastructure*. It is also part of ordinary developer experience: most of what helps an agent in a new session also helps a developer new to the repository. This note says *command* for an entry in the task runner, because *task* in these notes already means a piece of work ([Task directory]({{< ref "ai-engineering/agents/ade/ade" >}}#task-directory)).

The examples come from the [python-repo-template](https://github.com/valery-judah/python-repo-template) and the projects built on it or next to it: knowledge-assistant and its frontend repository, lang-assistant, wallet, wallet-evals, sem-rag, and medicine-doctor.

## Problems it addresses


Without a command layer, a project's commands are spread across the README, scripts, Compose files, and CI configuration. Each developer remembers a different subset, and a new developer learns them by asking or by reading those files. An agent starts every session as that new developer, because it keeps no memory between sessions:

- **The tool gets guessed.** A developer or an agent installs a package with `pip` in a `uv` project, or runs `pytest` without the flags the project uses.
- **One workflow takes several files to rebuild.** Starting the application locally can mean starting a database container, waiting until the database accepts connections, and then starting the API server, in that order.
- **Safe and risky commands look alike.** A script that starts a paid GPU machine looks like any other `bash scripts/...` line.
- **The same details are written in several places.** `AGENTS.md`, the runbook, git hooks, and CI each spell out the same tool calls, and they drift apart when one of them changes.

## Configurations in the projects


Six configurations cover the range in the projects:

1. **One Taskfile with four namespaces.** The python-repo-template generates a `Taskfile.yml` with `repo:*`, `quality:*`, `security:*`, and `app:*`, and a runbook that lists every command. Most repositories in medicine-doctor keep this shape and add namespaces of their own, such as `prototype:*` and `study:*`.
2. **Namespaces with owners, and scenarios.** knowledge-assistant has ten namespaces, and a separate file, `docs/evergreen/commands.md`, says what each one owns. `scenario:*` commands combine `db:*` and `app:*` for local work, `infra:*` holds the paid remote machine, and old names stay as aliases.
3. **A stack script selected by name.** lang-assistant's `stack:*` commands call one Python script, which reads named stack settings from `config/local-stacks.toml`. Scenarios combine the stack, the remote machine, and the browser tests.
4. **Make in front of Poe.** wallet holds a backend and a frontend in one repository. Make is the entry point, with flat target names, and its `help` prints them in sections. The Python commands live in Poe under `backend/`, and the frontend's Bun commands run in Docker.
5. **Make and Poe side by side.** sem-rag splits its commands by kind. Poe, configured in `poe_tasks.toml`, runs the Python workflows: checks, tests, the API, the worker, migrations, and diagnostics. Make wraps Docker, Compose, the observability stack, and documentation helpers. Its `AGENTS.md` explains which runner to use for what. wallet-evals uses the same split and keeps only setup in Make.
6. **A folder of repositories with no shared commands.** medicine-doctor is a folder of several repositories and isn't a repository itself. Its `AGENTS.md` tells the agent to read each repository's own `AGENTS.md`, run commands from that repository, and not carry one repository's commands into another.

|Feature|Template|knowledge-assistant|lang-assistant|wallet|sem-rag|
|---|---|---|---|---|---|
|Runner|Go Task|Go Task|Go Task|Make, which calls Poe|Make and Poe|
|Names|`namespace:action`|`namespace:action`|`namespace:action`|Flat, such as `run-stack`|Flat, such as `docker-up` and `run-api`|
|Catalog|`task help`|`task help`|`task help`|`make help`, then Poe's `--help`|`make help` and `uv run poe --help`|
|Local stack|None|`scenario:local:*`|`stack:*`, selected by slug|`run-stack`, `logs-stack`, `stop-stack`|`docker-up`, `docker-logs`, `docker-down`|
|Remote machine|None|`infra:runpod:*`|`infra:runpod:*`|None|None|
|Arguments|After `--`|After `--`|After `--`|Variables, such as `CMD='<bun args>'`|Poe positional arguments, such as `show-query-context <query_id>`, and Make variables, such as `type=feature slug=my-feature`|

The two runners differ in more than names. Go Task builds its catalog from each command's `desc`, runs a command's `cmds` in order, and stops at the first failure. Make has no built-in catalog: wallet and sem-rag add a `help` target that reads the `## ` comments with `awk`. wallet's `help` sorts the targets into sections, "Preferred Workflows", "Setup", "Backend Checks", and "Frontend / Docker", from lists kept in variables. Make orders work through prerequisites: wallet's `test: install` syncs the dependencies before every test run. With Poe under Make, the Python commands sit one level down: wallet's targets for formatting, checks, tests, and the backend server call `uv --directory backend run poe <task>`.

## Principles


These principles come from the configurations above. They apply to a developer working locally and to an agent alike. The last subsection lists where the two differ.

### Finding commands


- **Give the repository one entry point that lists every command.** A new developer and an agent in a new session both start from the catalog. `task help` runs `task --list`, which prints every command that has a description, and the template's tests check that each listed command except `default` and `help` has a namespace. `AGENTS.md` then needs one rule for commands. knowledge-assistant's reads: "Use `task <namespace>:<name>` for repository workflows and `task help` for the current catalog. If no task exists, use `uv run <tool>`." With two runners there are two catalogs, and the instructions have to say which runner owns what, as sem-rag's do.
- **Name each command after the part of the system and the action.** In `db:up`, `db:status`, and `db:down`, the first part says where the related commands are. Flat Make names can follow the same pattern with a prefix, as in sem-rag's `docker-up`, `docker-logs`, and `docker-down`, but nothing enforces it: wallet has `run-stack` and `stop-stack` next to `frontend-type`.
- **Write down what each namespace owns and what it doesn't.** The list tells where a new command goes, and it keeps the commands for one part of the system out of another ([Namespaces](#namespaces)).
- **Keep the tools behind the name.** In the template, `quality:type` runs `uv run pyright`. In knowledge-assistant, it runs Pyright with Node.js from a pinned Docker image. `AGENTS.md` and the runbook name only `task quality:type`, so they stay correct when the tool changes, and so do developers' habits.

### Composing workflows


- **Build workflows from small commands, and keep the small commands available.** `quality:verify` runs `quality:fmt:check`, `quality:lint`, `quality:type`, and `quality:test`, and stops at the first failure. A scenario starts the local stack in one command. When it fails, the subsystem commands show which part failed ([Subsystem commands and scenarios](#subsystem-commands-and-scenarios)).
- **Let the command compute what the developer would otherwise type.** wallet's Makefile passes the host's user and group IDs to every Compose call. sem-rag's runbook asks the developer to export `DOC_FORGE_UID` and `DOC_FORGE_GID` before `make docker-up-build`. Without them, the containers run as user 1000, which on macOS is usually not the developer's user ID. sem-rag's `docker-up` does detect the host for another setting: on Apple Silicon, with Ollama running on the host, the stack uses it for answers.
- **Select a configuration by name.** A slug picks one consistent set of values, so switching setups takes one argument, and leftover values in `.env` can't mix two setups ([Isolating tool dependencies](#isolating-tool-dependencies)).
- **Clean up after a workflow, even when it fails.** lang-assistant's `scenario:e2e` stops the test stack on exit, whether the tests pass or fail.

### Running local services


- **Pair each start command with status, logs, and stop.** knowledge-assistant has `db:up`, `db:status`, `db:logs`, and `db:down`. lang-assistant has the same four under `stack:*`. wallet has `run-stack`, `logs-stack`, and `stop-stack`, and sem-rag has `docker-up`, `docker-logs`, and `docker-down`, but neither has a status command.
- **Return once the services are ready.** `docker compose up -d --wait` returns when the services are healthy. The developer gets the terminal back, and the agent can continue ([Commands that start services](#commands-that-start-services)).
- **Keep logs and diagnostics in known places, and print where they are.** sem-rag archives the container logs of each run under `data/logs/compose/runs/<run_id>/`, keeps links to the latest run in `data/logs/compose/latest/`, and prints these locations with `make docker-log-index`. `uv run poe collect-query-context <query_id>` collects one query's trace, replay input, logs, and eval data into one directory. The developer and the agent read the same files.
- **Let several stacks run side by side.** lang-assistant gives each slug its own ports, data volume, and Compose project. A developer can run two setups at once. Two agents in two worktrees would need the same separation, with a stack for each worktree, so they don't compete for one port or one database.

### Limiting side effects


- **Separate commands by what they can affect.** Local and remote, read-only and changing, and stopping and deleting get different names ([Keeping risky commands apart](#keeping-risky-commands-apart)).
- **Offer a preview for commands with lasting effects.** `infra:runpod:plan` shows the remote machine without creating it, and sem-rag's `uv run poe clean --dry-run` lists what `clean` would remove.

### Isolating tools and repositories


- **Run extra toolchains in containers.** The host then needs only Python, `uv`, the task runner, and Docker, and every developer and agent runs the same tool versions ([Isolating tool dependencies](#isolating-tool-dependencies)).
- **Let each repository run only its own processes.** The frontend's `stack:down` leaves the backend's data alone, and medicine-doctor's `AGENTS.md` keeps each repository's commands in that repository.

### Keeping docs and commands consistent


- **Write procedures in terms of commands.** The runbook says when and why to run a command, and the task runner says how ([Commands and runbooks](#commands-and-runbooks)).
- **Rename with aliases, and mark them as aliases** ([Renaming commands](#renaming-commands)).
- **Check that commands and the files they name exist.** Two references in the projects pointed to nothing, and neither caused an error. knowledge-assistant's `AGENTS.md` kept naming `task frontend:run` after a commit removed that command from the Taskfile. sem-rag's `make install-git-hooks` kept pointing Git at `.githooks` after a commit deleted the directory, so the secret scan stopped running before commits. knowledge-assistant's `AGENTS.md` already asks for "relevant link and command checks" on documentation changes.

### Where developers and agents differ


- **Memory.** A developer learns the few commands they use and stops reading the catalog. An agent reads the catalog or `AGENTS.md` in every session, so a command's description is all it knows about the command.
- **Foreground processes.** A developer can leave a server running in one terminal and stop it with Ctrl+C. An agent needs the command to return, or a harness that runs it in the background.
- **Interactive commands.** sem-rag's `make docker-db-shell` opens a `psql` prompt, which suits a developer. An agent needs a command that takes the query as an argument and exits.
- **Risk.** A developer decides on the spot whether to start a paid machine. For an agent, that decision has to be in the permission settings, and namespaces keep the rule short ([Keeping risky commands apart](#keeping-risky-commands-apart)).

## What the isolation gives agents


The command layer isolates several things from each other: the caller from the tools a command runs, one subsystem's commands from another's, risky commands from safe ones, the host from extra toolchains, one local stack from another, and one repository from the next. This section checks what each of these gives agents against the premises and rules of the design note for `AGENTS.md` ([Premises]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#premises), [The rules]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#the-rules)).

### Benefits


- **A shorter root file.** `AGENTS.md` names the catalog and the baseline check, and the agent loads the rest with `task help` when it needs a command. knowledge-assistant's catalog lists 45 commands, and its `AGENTS.md` names two of them, `quality:verify` and `quality:type`. The root file stays a map, and the command details cost context only in sessions that need them ([Make it a map, not a manual]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#make-it-a-map-not-a-manual), [Treat context as a budget]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#treat-context-as-a-budget)).
- **The project's command where the agent's habit is wrong.** An agent's generic priors suggest `pytest`, `npm install`, or `docker compose up`. The catalog offers the project's command under a predictable name, so the agent finds `quality:test` or `db:up` without a correction in `AGENTS.md` for each tool ([Agents bring generic priors]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#agents-bring-generic-priors)). Some corrections stay: no command adds a dependency, so the template's `AGENTS.md` still says not to use `pip`.
- **An allowed command for each denied tool.** The template's Claude Code settings deny `pip`, `poetry`, `pipenv`, `npm`, and `npx`. A denial with no alternative leaves the agent to search for another way to run the tool. When the toolchain runs in a container behind a command, the agent finds the allowed command in the catalog. The frontend repository's `AGENTS.md` pairs the two: it forbids npm, pnpm, and Yarn and sends package commands through `task tooling:run`.
- **One exact baseline check.** `quality:verify` runs every baseline check in order, changes no repository files, and stops at the first failure. The agent can run it at any point, and its result means the same as the developer's run ([Define done and when to ask]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#define-done-and-when-to-ask)).
- **Risk shown in the name.** The design note's approval rules say the agent can't know which commands deploy unless the project says so ([Where an approval rule goes]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#where-an-approval-rule-goes)). A namespace such as `infra:*` puts that fact in the command name, and one permission rule covers the namespace. Stop commands that keep data and plan commands that only preview also make a wrong command cheaper to undo.
- **Fewer restrictions to keep in sync.** When several agent tools share a repository, each restriction has to be repeated in each tool's settings ([Several agent tools in one repository]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#several-agent-tools-in-one-repository)). Rules that cover a namespace are fewer than rules for each script, so there is less to repeat and less to drift.
- **The same results for every agent and on every machine.** Codex, Claude Code, and a developer run the same `task` commands, and containers pin the tool versions. A check that passes for the agent passes for the developer ([Many agents and people share the file]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#many-agents-and-people-share-the-file), [Goals]({{< ref "ai-engineering/agents/ade/ade" >}}#goals)).
- **Evidence from the running application.** Start commands that return once the services are ready, status and logs commands, and diagnostic commands such as sem-rag's `collect-query-context` let the agent reproduce a failure, check a fix in the running application, and attach evidence to a diagnosis. The design note counts manual checks in the running application and a reproducible failure as acceptance evidence, which baseline checks don't give ([Define done and when to ask]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#define-done-and-when-to-ask), [Plausible completion is not correctness]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#plausible-completion-is-not-correctness)). A scenario such as `scenario:e2e` turns a manual acceptance check into a repeatable command, as the design note recommends once a check becomes repeatable.
- **Parallel work without collisions.** When each stack has its own ports, data volume, and Compose project, agents in separate worktrees can each run the application. lang-assistant's slugs are fixed names, so this needs a stack for each worktree.
- **One place for the fix to a skipped step.** When an agent repeats a workflow by hand and skips a step, the placement table sends the fix to a script or task target ([Put each fix where it works best]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#put-each-fix-where-it-works-best), [A workflow done by hand]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#a-workflow-done-by-hand)). With a command layer, the fix is one more command in the right namespace. The catalog lists it, and `AGENTS.md` needs no new line.

### Limits and costs


- **The agent has to know the catalog exists.** One line in `AGENTS.md` tells it to run `task help`. With two runners, as in wallet and sem-rag, the agent reads two catalogs, and `AGENTS.md` needs more lines to say which runner owns what.
- **A name hides what runs.** When a command fails, the error comes from the tool inside it. Go Task prints each command before running it, so the agent sees what ran. Make hides a command whose line starts with `@`, as in sem-rag's `docker-up`, and the agent has to read the `Makefile` to find out what failed.
- **A stale name costs a turn.** A doc that names a removed command sends the agent to an error and then to the catalog, as knowledge-assistant's `frontend:run` did.
- **Containers move the dependency to Docker.** If the agent's execution environment has no Docker, or its sandbox blocks access to Docker, every containerized command fails. The first run also pulls the images, which takes time.
- **A check can still change the environment.** `quality:verify` changes no repository files, but `uv run` creates or syncs `.venv` before it runs a tool, and wallet's `make test` syncs the dependencies as a prerequisite.
- **Foreground and interactive commands block the agent** ([Where developers and agents differ](#where-developers-and-agents-differ)).

### What to observe


The benefits above are expectations. The build protocol lists failures to look for in agent sessions, and three of them are the ones a command layer should reduce: unnecessary searches before finding the correct command, skipped checks, and incorrect verification commands ([Observe agents on real tasks]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}#observe-agents-on-real-tasks)). Signs specific to the command layer:

- tool calls that bypass the catalog, such as a raw `docker compose` or `pytest` where a command exists;
- turns spent finding a command, including runs of a name that doesn't exist;
- permission prompts in a session, and which commands caused them;
- sessions where the agent started a service and then waited on a command that never returned.

The cost and benefit analysis for `AGENTS.md` applies here too: a command saves context and turns, and it costs maintenance when tools change ([Costs and Benefits of Optimizing AGENTS.md]({{< ref "ai-engineering/agents/ade/agents-md-costs-and-benefits" >}})).

## Namespaces


A namespace groups the commands for one part of the system. Go Task allows `:` in names, so the namespace is the first part of the name, as in `db:up` and `db:down`. Longer names group further, as in `quality:fmt:check` and `infra:runpod:embedding:pod`.

The template starts with four namespaces:

|Namespace|Commands|
|---|---|
|`repo:*`|Dependency sync, environment setup, git hooks, cleanup|
|`quality:*`|Formatting, linting, type checks, tests, verification|
|`security:*`|Repository and staged secret scans|
|`app:*`|Running and building the application|

Projects add namespaces as they grow. knowledge-assistant has ten, and its `docs/evergreen/commands.md` says what each one owns and what it doesn't:

|Namespace|Owns|Doesn't own|
|---|---|---|
|`repo:*`|Dependency sync, repository setup, hooks, cleanup|Application startup|
|`quality:*`|The complete read-only verification gate|Formatting changes outside `quality:fmt`|
|`security:*`|Repository and staged secret scans|Infrastructure credentials|
|`config:*`|Inspection of tracked runtime values selected by slug|Secrets or process lifecycle|
|`app:*`|CLI, host API, package builds|Qdrant, frontend, or remote GPU lifecycle|
|`api:*`|Export of the backend-owned OpenAPI schema|Frontend client generation|
|`db:*`|Local Qdrant lifecycle and connectivity|Application or frontend processes|
|`scenario:*`|Explicit workflows spanning multiple local subsystems|Paid remote resources|
|`eval:*`|Retrieval evaluation|Service lifecycle|
|`infra:*`|Explicit remote or hardware-specific operations|Local application orchestration|

The third column draws the boundaries. Starting Qdrant belongs to `db:*`, even though the application needs Qdrant, so `app:dev` starts only the API. The same file gives the rule for choosing a command: "Use the lowest-level command that owns the work. Use a scenario when the desired outcome requires more than one subsystem."

## Subsystem commands and scenarios


The commands form three levels:

1. **Tool calls**, such as `docker compose up -d qdrant` or `uv run pytest`. They appear only inside the task runner file.
2. **Subsystem commands**, such as `db:up`, `app:dev`, and `quality:test`. Each one does one job for one part of the system.
3. **Scenarios**, such as `scenario:local:up`. Each one runs several subsystem commands to reach an outcome that spans subsystems.

knowledge-assistant's local scenarios:

```yaml
scenario:local:up:
  desc: Start Qdrant, then run the selected local application in the foreground
  cmds:
    - task: db:up       # docker compose up -d qdrant, then wait for a connection
    - task: app:dev     # FastAPI on port 8766

scenario:local:down:
  desc: Stop Qdrant after the foreground application has been stopped
  cmds:
    - task: db:down

scenario:local:status:
  desc: Show the selected profile and local database status
  cmds:
    - task: config:show
    - task: db:status
```


A developer runs `task scenario:local:up` and doesn't need to know the order. When something fails, the subsystem commands are still there to look closer: `db:status`, `db:logs`, and `db:check`.

lang-assistant has a `stack:*` namespace for its local containers. `stack:up`, `stack:down`, `stack:status`, and `stack:logs` call one script, `scripts/devex/local_stack.py`, which reads the stack settings from `config/local-stacks.toml`. A *slug*, a short name such as `draft`, `explore`, or `mock`, selects one set of settings: the Compose project, the ports, the data volume, and the inference mode. Each slug has its own ports and volume, so the `draft` and `explore` stacks can run at the same time. Two scenarios build on the stack:

- `scenario:demo` resumes the remote GPU machine, starts the local stack, and loads sample text into both of the application's views.
- `scenario:e2e` starts the `mock` stack, runs the browser tests, and stops the stack when the tests end, even when they fail.

knowledge-assistant has no `stack:*` namespace, and its commands file says this is deliberate: Qdrant runs in Compose, the API runs on the host, and the frontend has its own repository and lifecycle. Its frontend repository has `stack:status` and `stack:down` for its own containers only. So `stack` covers different services in each repository. `scenario:local:up` differs too: knowledge-assistant uses it as the current name, and lang-assistant keeps it as an old name for `stack:up`.

### Local workflows and their commands


|Workflow|knowledge-assistant|lang-assistant|wallet|sem-rag|
|---|---|---|---|---|
|Set up a new checkout|`task repo:init`|`task repo:init`|`make setup`|`uv sync`, then `make install-git-hooks`|
|Check a change|`task quality:verify`|`task quality:verify`|`make verify`|`uv run poe verify`|
|Start the local stack|`task scenario:local:up`|`task stack:up`|`make run-stack`|`make docker-up-build`|
|See what is running|`task scenario:local:status`|`task stack:status`|None|None|
|Follow the logs|`task db:logs`|`task stack:logs`|`make logs-stack`|`make docker-logs`|
|Stop the local stack|Ctrl+C, then `task scenario:local:down`|`task stack:down`|`make stop-stack`|`make docker-down`|
|Run the end-to-end tests|None|`task scenario:e2e`|`make check-smoke-managed`, API scenarios only|`uv run poe test-e2e`|
|Update the API contract|`task api:schema`, then `task api:generate` and `task api:check` in the frontend repository|None|`make gen-client`|None|

### Commands that start services


knowledge-assistant's `scenario:local:up` runs the API in the foreground. The command returns only after someone stops it with Ctrl+C, and `scenario:local:down` then stops Qdrant. lang-assistant's `app:dev` commands start the containers with `docker compose up -d --wait`, which returns once the services are running and healthy.

An agent has to get its shell command back before it can continue. With the second form, the agent starts the stack, continues, and checks on it with the `status` and `logs` commands. With a foreground server, the harness has to run the command as a background process. This is part of making the running application visible to the agent ([Structure and visibility]({{< ref "ai-engineering/agents/ade/ade" >}}#structure-and-visibility)). OpenAI's team went further and started the application separately in each git worktree (OpenAI 2026). lang-assistant's slugs already give each stack its own Compose project, ports, and volume, which separate stacks for separate worktrees would also need.

## Keeping risky commands apart


Namespaces also separate commands by what they can affect:

- **Local and remote.** knowledge-assistant keeps the RunPod commands in `infra:runpod:*`, apart from the local scenarios, because they can start billing or change shared external state. In lang-assistant, `stack:up` and `stack:down` never create, resume, or stop the remote machine. The `infra:runpod:*` commands and `scenario:demo` do that.
- **Preview before acting.** `infra:runpod:embedding:plan` in knowledge-assistant and `infra:runpod:plan` in lang-assistant show the machine specification without creating anything. sem-rag's `uv run poe clean --dry-run` lists the generated files that `clean` would remove.
- **Read-only and changing.** `quality:verify` only reads, so an agent can run it at any time. `quality:fmt` rewrites files, and `quality:fmt:check` reports the same formatting problems without changing anything.
- **Stopping and deleting.** `db:down` stops Qdrant without deleting its data volume, and lang-assistant's `app:down` stops the containers without deleting data. sem-rag's `docker-down` keeps the volumes, and a separate `docker-clean` removes them.

With this split, a permission setting can cover a namespace at once: the agent runs `quality:*` commands without asking and needs approval for `infra:*` commands. A command pattern matches only the command as written, and the agent can still call the tools behind it directly, so removing the access comes first ([Where an approval rule goes]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#where-an-approval-rule-goes)).

## Isolating tool dependencies


The command layer also decides where each tool runs, so the host needs only a few tools installed:

- knowledge-assistant runs Pyright with Node.js from a pinned Docker image. Its runbook says the backend "does not install or manage frontend packages". The frontend repository runs Bun in a container, and `task tooling:run -- <arguments>` passes any Bun command to it.
- wallet runs the frontend's Bun commands in Docker, for example `make frontend-type`, and passes other Bun arguments with `make frontend-bun CMD='<bun args>'`.
- lang-assistant runs the frontend checks, formatting, and the Playwright browser tests in containers.

The host then needs Python, `uv`, Go Task, and Docker. `AGENTS.md` can forbid the host tools that the containers replace. knowledge-assistant's says "Do not use `pip`, Poetry, Pipenv, or host Node package tools." It then sends frontend commands to the frontend repository's `task tooling:run -- <arguments>`.

Runtime settings are selected the same way. `KNOWLEDGE_CONFIG=mlx task scenario:local:up` selects a profile from knowledge-assistant's `config/runtime.toml`, and `task stack:up -- --slug explore` selects a stack in lang-assistant. In both projects the selected values win over `.env`, which supplies the rest, such as secrets and machine-specific paths. lang-assistant's docs note that an old port or Compose project name left in `.env` can't send the stack somewhere else.

Each repository runs only its own processes. The frontend's `stack:down` stops its containers "without touching backend data", and the backend's scenarios don't start the frontend.

## Commands and runbooks


The task runner file says how a command runs. The runbook says when to run it, in what order, what to check, and what to do when it fails. Runbook steps name commands, such as `task repo:init`, and leave the tool calls to the task runner, so a change in tooling leaves the procedure as it is.

The projects split this text in different ways:

- The template's `docs/evergreen/runbook.md` opens with the command model and the namespaces, lists all commands, and leaves a section for operational procedures.
- knowledge-assistant gives the command system its own file, `docs/evergreen/commands.md`, with the namespaces, what each owns, the scenarios, arguments, and aliases. Its runbook holds the procedures: setup, runtime profiles, local Qdrant, indexing, the RunPod machine, and troubleshooting, with a table of the commands they use.
- lang-assistant describes the stack script and its slugs in `docs/evergreen/local-stack.md`.
- sem-rag's runbook lists its Make and Poe commands in groups, such as setup, the Docker stack, and checks, and then explains each command for the local runtime: what it starts, on which port, and where it writes its logs.

Some steps stay in the runbook because they need a decision. Setup copies `.env.example` to `.env` only when `.env` doesn't exist yet, to keep existing credentials. Steps that run the same way and in the same order every time can become a scenario.

Procedures that are the same in every project can go in the shared agent docs as general runbooks ([Shared agent docs]({{< ref "ai-engineering/agents/ade/ade" >}}#shared-agent-docs)).

## Renaming commands


Renaming a command breaks the scripts, docs, and habits that use the old name. knowledge-assistant keeps old names as *compatibility aliases* that call the new command: `app:run` calls `app:cli`, `search:serve` calls `app:serve`, `search:dev` calls `app:dev`, and `quality:check` calls `quality:verify`. Its `AGENTS.md` says: "Use canonical task names in new documentation and automation. Compatibility aliases are for existing callers only." In the Taskfile, a comment marks the block of aliases, and each alias's description starts with "Compatibility alias for".

The aliases still appear in `task --list`, so an agent sees both names. The description tells it which name is current.

## Sources


- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/), 2026.
