---
draft: false
toc: true
title: "Command Layer"
description: "How a repository exposes its workflows to developers and agents through named, cataloged commands in a task runner. Covers how agents and humans differ at the command line, three-level composition, service lifecycles, risk boundaries, and runbooks."
linkTitle: "Command Layer"
---

In an [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}), a repository exposes two main interfaces to the people and coding agents working in it:

1. A **knowledge interface** (`AGENTS.md`, canonical docs, feature contracts, schemas), which records how the system is structured, what behavior is intended, and where decisions live.
2. An **operational interface**--the **command layer** (`Taskfile.yml`, `Makefile`, and the scripts behind them)--which defines how to act on the system: setting up a checkout, running checks, starting and inspecting local services, collecting diagnostics, running evaluations, and operating remote infrastructure.

Each command wraps the underlying tools, flags, environment variables, and step order behind a stable name such as `task quality:verify` or `task db:up`. Developers, coding agents, git hooks, and CI jobs invoke the same entry points instead of reconstructing raw shell pipelines. Across a project, those commands support more than code checks: they cover workspace provisioning (`repo:init`), implementation and contract sync (`quality:verify`, `api:schema`), runtime investigation (`db:status`, `collect-query-context`), behavioral evaluation (`scenario:e2e`, `eval:*`), and remote infrastructure (`infra:*`).

In the [ADE architecture]({{< ref "ai-engineering/agents/environment/ade" >}}#the-broader-architecture), the command layer is the first part under *Commands and Tools*, and it runs the environment's computational guides and sensors. This note calls an entry in the task runner a *command* rather than a *task*, because *task* in these notes refers to a unit of engineering work ([Task directory]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#task-directory)). Examples throughout come from `python-repo-template` and seven sibling projects listed in [Projects](#projects).

## Problems without a command layer


Without a command layer, operational workflows are scattered across `README.md`, shell scripts, Docker Compose files, git hooks, and CI workflows. Developers memorize the subset they run often, while newcomers piece workflows together by reading configuration files or asking teammates. Because coding agents retain no memory across sessions, they enter every session as that newcomer:

- **Agents fall back on generic tool habits.** Left to its training priors, an agent runs `pip install` in a `uv` project, invokes bare `pytest` without the project's flags, or runs host `npm` when the frontend toolchain lives in a container.
- **Multi-step workflows get rebuilt by hand.** Bringing up a local environment or running end-to-end tests often requires starting a database container, waiting until it accepts connections, passing host user IDs or profile settings, starting the API, and cleaning up afterward. Reconstructed manually, steps get skipped or run out of order.
- **Safe and costly actions look alike.** A script that provisions a billed remote GPU pod or deletes a database volume looks like any other `bash scripts/...` invocation.
- **Tool details drift across files.** When `AGENTS.md`, the runbook, git hooks, and CI each spell out raw tool invocations, changing how a tool runs (for example, moving type checking into a pinned container) leaves stale commands behind in whichever files were missed.

## Where developers and agents differ


Most of what makes a command layer effective for agents is ordinary developer experience. Still, a command set built around human terminal habits often fails coding agents in five places:

- **Cold-start discovery and priors.** A developer learns a project's handful of daily commands once and stops reading `help`. An agent starts every session with generic engineering priors and discovers local workflows from `AGENTS.md` and the command catalog. Often, a command's name and one-line description are all the agent sees before choosing whether to run it.
- **Returning vs. foreground processes.** A developer happily leaves a server running in the foreground of a terminal tab and stops it with `Ctrl+C`. In an agent's sequential tool loop, a command that never exits blocks the turn unless the harness backgrounds it and polls separately. Agents work far more reliably when service-start commands detach and return as soon as health checks pass.
- **Interactive prompts.** Commands like `sem-rag`'s `make docker-db-shell` open an interactive `psql` session, which suits a human exploring a database. An agent needs non-interactive commands that accept a query or identifier as an argument, print output, and exit.
- **Observability through files and status commands.** Humans watch streaming terminal output or click around a browser UI. Agents diagnose bugs and verify fixes by running status commands, reading logs at predictable file paths, and calling diagnostic collectors that bundle traces and logs for a specific request.
- **Mechanical risk gates and parallel workspaces.** A human pauses before running a script that bills a cloud GPU or wipes local state, and usually runs one stack at a time. For an agent, side effects and cost must be reflected in command names (`infra:*`, `--dry-run`, `down` vs. `clean`) so harness permission settings (`allow`, `ask`, `deny`) can gate them; and when multiple agents work concurrently across git worktrees, local stacks need isolated ports, project names, and volumes so they do not collide.

## Structure of the command layer


A well-structured command layer makes workflows easy to discover from a single catalog, groups commands by clear subsystem boundaries, and composes end-to-end scenarios out of smaller building blocks.

### Finding commands


Both a new developer and an agent in a fresh session need one predictable command that prints every workflow the repository supports.

In repositories using Go Task (`python-repo-template`, `knowledge-assistant`, `lang-assistant`, and the repos inside `medicine-doctor`), `task help` runs `task --list`, building the catalog directly from each command's `desc` field. `AGENTS.md` then needs only a single routing rule. `knowledge-assistant` writes:

> Use `task <namespace>:<name>` for repository workflows and `task help` for the current catalog. If no task exists, use `uv run <tool>`.

Other projects in the set combine two runners. `wallet` places GNU Make in front of Poe the Poet (`poe_tasks.toml` under `backend/`), while `sem-rag` and `wallet-evals` use Make for Docker, Compose, and setup alongside Poe for Python checks, migrations, and diagnostics. Splitting runners works, and Poe handles positional CLI arguments cleanly, but it adds friction for agents:

| Aspect | Single runner (Go Task) | Make wrapping Poe (`wallet`) | Make + Poe side by side (`sem-rag`) |
| --- | --- | --- | --- |
| **Catalog command** | `task help` (`task --list`) | `make help` (custom `awk` target), plus `poe --help` | Both `make help` and `uv run poe --help` |
| **Naming structure** | Hierarchical (`namespace:action`) | Flat targets (`run-stack`, `frontend-type`), grouped in `help` variables | Flat targets in both runners (`docker-up`, `run-api`) |
| **Execution visibility** | Prints steps by default; stops on first failure | Depends on `@` prefixes; uses Make prerequisites (e.g., `test: install`) | `@` in Make hides failing shell lines unless echoed manually |
| **Passing arguments** | Uniform after `--` | Make variables (`CMD='<bun args>'`) | Poe positional args and Make `key=value` variables |
| **Cost in `AGENTS.md`** | One routing line | One routing line, indirection on failure | Extra rules explaining which runner owns which kind of work |

In multi-repository workspaces, keeping each repository's command layer self-contained prevents cross-repo confusion. `medicine-doctor` is a parent folder holding separate backend, frontend, and evaluation repositories rather than a monorepo; its root `AGENTS.md` instructs agents to read each repository's own `AGENTS.md` and run commands only from that repository's root.

### Namespaces


Namespaces group commands by the subsystem or concern they act on. In Go Task, `:` separates levels of hierarchy (`db:up`, `quality:fmt:check`, `infra:runpod:embedding:pod`), so related commands sort together in `task help` and a template test can verify that every public command (apart from `default` and `help`) belongs to a namespace. Flat Make targets can approximate this with consistent prefixes (`docker-up`, `docker-logs`, `docker-down`), though nothing enforces the convention.

`python-repo-template` starts every repository with four baseline namespaces:

| Namespace | Scope |
| --- | --- |
| `repo:*` | Dependency sync, workspace setup, shared doc links, git hooks, cleanup |
| `quality:*` | Formatting, linting, type checking, unit tests, and the read-only verification gate |
| `security:*` | Full-repository and staged secret scans |
| `app:*` | Running and building the application |

As a project grows, explicit ownership rules keep namespaces from blurring together. `knowledge-assistant` defines ten namespaces and documents both what each namespace owns and what it *does not* own in `docs/evergreen/commands.md`:

| Namespace | Owns | Does not own |
| --- | --- | --- |
| `repo:*` | Dependency sync, repository setup, hooks, cleanup | Starting the application |
| `quality:*` | Read-only baseline verification (`quality:verify`) and explicit formatting (`quality:fmt`) | Formatting side effects inside read-only checks |
| `security:*` | Repository and staged secret scans | Cloud or infrastructure credentials |
| `config:*` | Inspecting tracked runtime profiles selected by name | Secrets or service processes |
| `app:*` | CLI, host API server, package builds | Qdrant, frontend containers, or remote GPUs |
| `api:*` | Exporting the backend-owned OpenAPI schema | Generating the frontend client |
| `db:*` | Local Qdrant lifecycle and connectivity checks | API or frontend processes |
| `scenario:*` | Multi-subsystem local workflows | Paid remote resources |
| `eval:*` | Retrieval evaluation runs | Service lifecycle |
| `infra:*` | Paid remote or hardware-specific operations (RunPod) | Local application orchestration |

The "Does not own" boundary prevents hidden side effects: even though the API depends on Qdrant, `app:dev` starts only the API, leaving Qdrant strictly to `db:*`. Multi-service startup belongs explicitly to `scenario:*`. As `commands.md` states: *"Use the lowest-level command that owns the work. Use a scenario when the desired outcome requires more than one subsystem."*

### Subsystem commands and scenarios


Commands across these projects fall into three layers of abstraction:

1. **Raw tool calls** (`uv run pytest ...`, `docker compose up -d qdrant`), which appear only inside `Taskfile.yml`, `Makefile`, or helper scripts.
2. **Subsystem commands** (`db:up`, `app:dev`, `quality:type`, `quality:test`), each performing one operation on a single subsystem.
3. **Scenarios and composite gates** (`scenario:local:up`, `scenario:e2e`, `quality:verify`), which sequence subsystem commands to complete a cross-cutting workflow.

In `knowledge-assistant`, local scenarios compose `config:*`, `db:*`, and `app:*` commands directly in `Taskfile.yml`:

```yaml
scenario:local:up:
  desc: Start Qdrant, then run the selected local application in the foreground
  cmds:
    - task: db:up       # docker compose up -d qdrant, then wait for readiness
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


Keeping both levels exposed matters when things break. A caller runs `task quality:verify` or `task scenario:e2e` for the normal workflow without remembering step order or teardown. In `lang-assistant`, `scenario:e2e` spins up a dedicated `mock` stack, runs Playwright browser tests, and tears down the stack on exit whether the tests pass or fail; `scenario:demo` resumes the remote GPU pod, starts the local stack, and preloads sample text. When a composite command fails, the atomic commands (`db:status`, `db:logs`, `quality:type`) remain available in the catalog to isolate the fault.

What counts as a "stack" or "scenario" depends on where services run. `lang-assistant` puts its API, frontend, and SSH tunnel in Compose, so a single `stack:*` namespace manages all local containers. `knowledge-assistant` deliberately has no `stack:*` namespace: Qdrant runs in Compose (`db:*`), the Python API runs on the host (`app:*`), and the browser UI lives in `knowledge-assistant-frontend` with its own container lifecycle and an OpenAPI contract (`openapi.json`) exported from the backend via `task api:schema`.

| Workflow | `knowledge-assistant` | `lang-assistant` | `wallet` | `sem-rag` |
| --- | --- | --- | --- | --- |
| Set up checkout | `task repo:init` | `task repo:init` | `make setup` | `uv sync`, then `make install-git-hooks` |
| Run baseline checks | `task quality:verify` | `task quality:verify` | `make verify` | `uv run poe verify` |
| Start local services | `task scenario:local:up` | `task stack:up` | `make run-stack` | `make docker-up-build` |
| Check service status | `task scenario:local:status` | `task stack:status` | None | None |
| Read service logs | `task db:logs` | `task stack:logs` | `make logs-stack` | `make docker-logs` |
| Stop local services | `Ctrl+C`, then `task scenario:local:down` | `task stack:down` | `make stop-stack` | `make docker-down` |
| Run end-to-end checks | None | `task scenario:e2e` | `make check-smoke-managed` (API) | `uv run poe test-e2e` |
| Sync API contract | `task api:schema`, then frontend `api:generate` and `api:check` | None | `make gen-client` | None |

## Designing commands for workflows

### Baseline verification gates


For code and configuration changes, `AGENTS.md` needs one exact command that defines the baseline check ([Define done and when to ask]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#define-done-and-when-to-ask)). In the Go Task projects, `task quality:verify` runs `quality:fmt:check`, `quality:lint`, `quality:type`, and `quality:test` in sequence, stops at the first failure, and modifies no tracked files. Other hooks reuse the same building blocks: `python-repo-template`'s pre-commit hook calls `task security:scan:staged`, the same staged secret scan an agent can invoke before committing. Because the gate is read-only and deterministic, an agent can run it mid-session without side effects, and a passing run means the same thing locally and in CI.

### Commands that start services


Making the running application accessible to an agent lets it reproduce bugs, test end-to-end behavior, and gather runtime evidence rather than relying on unit tests alone ([Structure and visibility]({{< ref "ai-engineering/agents/environment/ade" >}}#structure-and-visibility)). Four design choices determine whether service commands work cleanly in agent sessions:

- **Complete lifecycle sets (`up`, `status`, `logs`, `down`).** `knowledge-assistant` provides all four under `db:*`, and `lang-assistant` provides all four under `stack:*`. By contrast, `wallet` (`run-stack`, `logs-stack`, `stop-stack`) and `sem-rag` (`docker-up`, `docker-logs`, `docker-down`) omit a `status` command, forcing an agent to drop down to raw `docker compose ps` or port checks to see whether the stack is already up.
- **Returning once services are healthy.** `knowledge-assistant`'s `scenario:local:up` runs FastAPI in the foreground, holding the terminal until interrupted with `Ctrl+C`--convenient for a human in a dedicated tab, but blocking for an agent unless its harness manages background processes. `lang-assistant` instead starts containers with `docker compose up -d --wait`, which blocks only until health checks succeed and then returns control to the shell so the agent can run checks, inspect logs, and stop the stack normally.
- **Predictable log paths and diagnostic bundles.** Live log tailing (`docker compose logs -f`) is awkward for agents; saved logs and structured diagnostic snapshots are direct inputs to investigation. `sem-rag` archives each Compose run's container logs under `data/logs/compose/runs/<run_id>/`, updates symlinks in `data/logs/compose/latest/`, and prints those paths via `make docker-log-index`. Its `uv run poe collect-query-context <query_id>` command gathers a single query's trace, replay payload, container logs, and evaluation records into one directory so a human or an agent investigating a bad answer inspects the exact same bundle.
- **Parameterized stacks for side-by-side and multi-worktree runs.** In `lang-assistant`, `stack:up`, `stack:down`, `stack:status`, and `stack:logs` call a Python script (`scripts/devex/local_stack.py`) backed by `config/local-stacks.toml`. Passing a short *slug* (`draft`, `explore`, `mock`) selects an isolated Compose project name, port range, data volume, and inference mode, allowing two stacks to run side by side on one machine. Parallel coding agents working in separate git worktrees need the same per-stack isolation--indexed by worktree or slug--so concurrent runs do not fight over port `8000` or corrupt a shared database (OpenAI 2026).

### Keeping risky commands apart


Command names and namespaces also encode blast radius:

- **Local vs. paid or shared remote.** `knowledge-assistant` and `lang-assistant` isolate RunPod GPU operations under `infra:runpod:*`. Local commands (`db:*`, `stack:*`) never create, resume, or bill remote machines; only `infra:runpod:*` (and `lang-assistant`'s explicit `scenario:demo`) touch remote state.
- **Read-only checks vs. file mutations.** `quality:verify` and `quality:fmt:check` inspect code without modifying repository files, making them safe to run at any point. Rewriting files happens only in `quality:fmt`.
- **Stopping processes vs. deleting data.** `db:down`, `stack:down`, and `sem-rag`'s `docker-down` stop containers while preserving volumes. Wiping volumes or generated artifacts requires a separate command (`docker-clean` or `poe clean`).
- **Previews before lasting changes.** `infra:runpod:plan` (and `infra:runpod:embedding:plan`) prints the remote machine specification without provisioning anything, and `sem-rag`'s `uv run poe clean --dry-run` lists files before deleting them.

Separating commands by risk gives harness permission settings clean prefixes to target: a team can allow `task quality:*` without prompts while requiring human approval (`ask`) for `task infra:*`. Prefix rules also reduce configuration drift when multiple agent harnesses share a repository and each maintains its own settings file ([Several agent tools in one repository]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#several-agent-tools-in-one-repository)).

However, a command-pattern rule only matches the string passed to the shell. If an agent holds cloud credentials and unrestricted shell access, denying or gating `task infra:*` does not stop it from calling the underlying Python script or cloud CLI directly. Enforcing risk boundaries starts with removing unnecessary credentials and restricting direct tool access; command namespaces make the remaining approval rules legible and compact ([Where an approval rule goes]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#where-an-approval-rule-goes)).

### Isolating tool dependencies


The command layer can also shield the host machine from secondary toolchains and environment drift:

- **Running secondary toolchains in pinned containers.** `knowledge-assistant` runs Pyright together with Node.js inside a pinned Docker image so the backend repository never installs host Node packages. `knowledge-assistant-frontend`, `wallet`, and `lang-assistant` run Bun checks, frontend builds, and Playwright browser tests in containers, exposing pass-through commands (`task tooling:run -- <args>` or `make frontend-bun CMD='<args>'`) for ad-hoc package operations. Every developer laptop and agent environment then needs only Python, `uv`, the task runner, and Docker, and runs identical tool versions.
- **Pairing tool denials with allowed commands.** Blocking host tools (`pip`, `poetry`, `npm`, `npx`, `yarn`) in harness deny lists without providing a substitute leaves an agent searching for workarounds. Pairing the denial with a cataloged command--such as forbidding host Node managers in `AGENTS.md` and `.claude/settings.json` while routing package operations through `task tooling:run`--steers the agent cleanly to the supported path.
- **Computing host defaults and selecting profiles by name.** Commands should compute machine-specific boilerplate rather than asking callers to export variables by hand. `wallet`'s Makefile automatically injects the host's `UID` and `GID` into every Compose call; `sem-rag`'s runbook instead asks users to export `DOC_FORGE_UID` and `DOC_FORGE_GID` before `make docker-up-build`, which is easy to miss on macOS where the user ID rarely matches container UID `1000`. Likewise, selecting runtime settings via a named profile (`KNOWLEDGE_CONFIG=mlx task scenario:local:up` from `config/runtime.toml`, or `task stack:up -- --slug explore` from `config/local-stacks.toml`) lets tracked profile values override `.env` for ports and project names, reserving `.env` for secrets and machine-local paths so leftover `.env` edits cannot cross-wire two setups.

## Documentation and maintenance

### Commands and runbooks


Splitting command knowledge across three files keeps each one focused and avoids duplication:

- **`AGENTS.md` routes.** It names the baseline verification gate (`task quality:verify`) and points to `task help` and the runbook, keeping the always-loaded root file short ([Make it a map, not a manual]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#make-it-a-map-not-a-manual)). `knowledge-assistant` exposes 45 commands in `task help`, yet its `AGENTS.md` names only two (`quality:verify` and `quality:type`).
- **The task runner file specifies *how*.** `Taskfile.yml` owns tool binaries, flags, container mounts, and execution order. When Pyright moves from a local virtualenv into Docker, `AGENTS.md` and the runbook stay unchanged because both say `task quality:type`.
- **The runbook specifies *when* and *why*.** `docs/evergreen/runbook.md` (paired in `knowledge-assistant` with a dedicated `docs/evergreen/commands.md` for namespace ownership rules) holds operational procedures: initial setup, indexing, remote GPU recovery, troubleshooting, and steps that require judgment--such as copying `.env.example` to `.env` only when `.env` does not exist yet so existing credentials are preserved. Steps that always run in the same unconditional sequence graduate from the runbook into a scenario command; procedures shared across repositories belong in [shared agent docs]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#shared-agent-docs).

### Renaming commands


As workflows evolve, the command layer absorbs fixes and renames without breaking existing callers or bloating `AGENTS.md`:

- **Fixing skipped workflow steps in the runner.** When an agent repeatedly runs a multi-step procedure by hand and forgets a step, the [placement table]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#put-each-fix-where-it-works-best) puts the fix in a task command rather than adding prose to `AGENTS.md` ([A workflow done by hand]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#a-workflow-done-by-hand)). Once added under the appropriate namespace, the new command appears automatically in `task help`.
- **Keeping marked compatibility aliases.** Renaming a command breaks scripts, docs, and developer habits that still use the old name. `knowledge-assistant` retains old names (`app:run` for `app:cli`, `search:dev` for `app:dev`, `quality:check` for `quality:verify`) in a dedicated alias block in `Taskfile.yml`. Each alias's description starts with `"Compatibility alias for ..."`, and `AGENTS.md` notes that new docs and automation must use canonical names. Because `task --list` prints descriptions alongside names, agents see both and immediately know which one is canonical.
- **Checking that documented commands and paths still exist.** Broken command references fail silently until someone runs them. In the projects reviewed, `knowledge-assistant`'s `AGENTS.md` continued referencing `task frontend:run` after the target was deleted, and `sem-rag`'s `make install-git-hooks` continued pointing Git to `.githooks` after that directory was removed, silently disabling pre-commit secret scans. Automated checks--verifying that every command named in `AGENTS.md` and `docs/` exists in `Taskfile.yml`, and that hook or script paths exist on disk--prevent silent drift.

## What the command layer gives agents


Viewed against the premises and design rules for `AGENTS.md` ([Premises]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#premises), [The rules]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#the-rules)), each part of the command layer addresses a specific agent failure mode:

| Mechanism | Effect on agent sessions | Related ADE / `AGENTS.md` principle |
| --- | --- | --- |
| Self-describing catalog (`task help`) | Keeps command manuals out of root context; agents load details only when needed | [Make it a map, not a manual]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#make-it-a-map-not-a-manual), [Treat context as a budget]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#treat-context-as-a-budget) |
| Predictable `namespace:action` names | Redirects generic habits (`pytest`, `docker compose up`) to local workflows without per-tool prose rules | [Agents bring generic priors]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#agents-bring-generic-priors) |
| Containerized toolchains + pass-through commands | Gives every denied host tool (`npm`, `pip`) a working, version-pinned alternative across machines and harnesses | [Same environment for every agent]({{< ref "ai-engineering/agents/environment/ade" >}}#goals) |
| Read-only, fail-fast `quality:verify` | Defines one unambiguous baseline gate that matches developer and CI results | [Define done and when to ask]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#define-done-and-when-to-ask) |
| Detached `--wait` startup, `status`, `logs`, and diagnostic bundles | Lets agents reproduce failures, inspect live behavior, and attach runtime evidence to diagnoses and reviews | [Plausible completion is not correctness]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#plausible-completion-is-not-correctness), [Structure and visibility]({{< ref "ai-engineering/agents/environment/ade" >}}#structure-and-visibility) |
| Isolated stack slugs (ports, projects, volumes) | Prevents port and database collisions across concurrent stacks or parallel git worktrees | [Structure and visibility]({{< ref "ai-engineering/agents/environment/ade" >}}#structure-and-visibility) |
| Risk-separated namespaces (`infra:*`), `plan`, and `down` vs. `clean` | Lets compact permission rules gate costly or destructive actions and lowers the cost of mistakes | [Prefer enforcement over prose]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#prefer-enforcement-over-prose), [Approval rules]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#approval-rules) |
| Scenarios for multi-step workflows | Gives recurring manual mistakes a mechanical home without expanding `AGENTS.md` | [Convert repeated failures into harness improvements]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#convert-repeated-failures-into-harness-improvements) |

### Limits and costs


- **Agents still have to be pointed to the catalog.** Without a routing line in `AGENTS.md`, agents often overlook `Taskfile.yml` or guess raw commands. Splitting workflows across two runners (such as Make and Poe) doubles the catalog lookup and requires extra routing rules.
- **Abstraction can obscure failure output.** When a wrapped command fails, the agent needs to see which underlying tool ran. Go Task echoes each command before executing it; Make lines prefixed with `@` (as in `sem-rag`'s `docker-up`) hide the failing command and force the agent to read the `Makefile`.
- **Containerized tools depend on Docker access.** In cloud sandboxes or restricted environments without a Docker daemon, containerized type checks, frontend builds, and browser tests cannot run, and cold runs pay image-pull latency.
- **Read-only code checks can still mutate local state.** `quality:verify` leaves tracked files untouched, but `uv run` may create or sync `.venv`, and Make prerequisites like `wallet`'s `test: install` mutate the environment before running tests.
- **Maintenance has an ongoing cost.** Like `AGENTS.md`, commands and wrapper scripts save session turns and human review effort at the cost of keeping task definitions, container images, and docs aligned as tools evolve.

### What to observe


Whether a repository's command layer actually helps agents shows up in session traces and reviews rather than in how tidy `Taskfile.yml` looks (Observe agents on real tasks). Useful signals to watch for include:

- **Catalog bypasses:** raw `pytest`, `pip`, `npm`, or `docker compose` calls when an equivalent task command exists.
- **Discovery churn:** turns spent searching scripts or invoking nonexistent command names (including stale names left in docs).
- **Blocked turns:** sessions where an agent starts a foreground server or interactive shell and hangs waiting for it to return.
- **Permission friction:** unexpected approval prompts on routine local checks, or risky commands slipping through without a prompt because they sit outside a gated namespace.

## Projects


The examples in this note come from eight projects (four on GitHub and four local-only repositories):

- **[python-repo-template](https://github.com/valery-judah/python-repo-template):** Copier template for Python repositories with `uv`, Go Task (`repo:*`, `quality:*`, `security:*`, `app:*`), pytest, a starter `AGENTS.md`, and `docs/evergreen/runbook.md`.
- **knowledge-assistant:** Local workspace for keyword and semantic search over a bounded Markdown corpus, showing source passages and provenance. Runs a host Python API, Qdrant in Compose, and semantic embeddings on Apple Silicon or a RunPod GPU machine.
- **knowledge-assistant-frontend:** Separate React, TypeScript, Vite, and Bun repository for `knowledge-assistant`, running its frontend toolchain inside containers.
- **lang-assistant:** Margin, a local writing workspace that splits text into editable units and proposes unit-level and whole-text alternatives using a private RunPod model over an SSH tunnel, with named Compose stacks in `config/local-stacks.toml`.
- **[wallet](https://github.com/valery-judah/wallet):** Money-tracking app recording what moved, from where, to where, and why, with a local Ollama chat assistant; combines a Python backend (Poe) and containerized Bun frontend behind a root `Makefile`.
- **[wallet-evals](https://github.com/valery-judah/wallet-evals):** Evaluation runner that executes case suites against a sibling `wallet` checkout and stores the evidence from each run.
- **[sem-rag](https://github.com/valery-judah/sem-rag):** `doc_forge`, question answering over a bounded PDF and Markdown corpus with inspectable evidence; runs Postgres, API, worker, and Ollama in Compose, plus an optional Loki, Vector, and Grafana observability stack.
- **medicine-doctor:** Folder of separate repositories for a healthcare AI prototype using synthetic cases (`doctor` backend, React frontend, `doctor-evals`, and two scaffolds), each with its own `Taskfile.yml` and `AGENTS.md`.

## Sources


The projects the examples come from are listed in [Projects](#projects).

- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/), 2026.
