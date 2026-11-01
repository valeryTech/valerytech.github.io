---
draft: false
toc: true
title: "Reframing the Command Layer"
description: "Working notes on the command layer in ADE: separating solid base structures and practical consequences from system-wide dimensions in a holding space and explicit, optional design prototypes."
linkTitle: "Command Layer (Working Model)"
---

[Command Layer]({{< ref "ai-engineering/agents/environment/command-layer" >}}) describes how eight existing projects organize their task runners today. When stepping back to redesign this area--following the same modeling approach as [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}})--we should avoid jumping straight from observed repo quirks to a heavy new set of Taskfile rules.

Instead, this note separates three levels of certainty:

1. **Base structures:** What the command layer solidly is, how it relates to project knowledge, where humans and agents differ, and what consequences current repo variations actually have in practice.
2. **Holding space (beyond commands alone):** Two deeper dimensions--*epistemic/workflow role* and *effect/blast-radius boundaries*--that surfaced while looking at commands, but actually belong to the **whole ADE and runtime system**, not just `Taskfile.yml`.
3. **Explicit prototypes and future trade-offs:** Candidate mechanisms to test selectively when real project friction justifies them, rather than treating them as mandatory boilerplate.

---

## 1. Base structures

### 1.1 Where the command layer sits across ADE (not just one leaf under Workflow Infrastructure)


In ADE's earlier architecture tree, `Taskfile` appears as one item under *Workflow Infrastructure* alongside build/test tools, git hooks, and CI. In practice, as [ade.md]({{< ref "ai-engineering/agents/environment/ade" >}}#command-layer) hints, the command layer acts as an **execution spine across all five ADE subsystems**:

- **Environment Provisioning:** `task repo:init` runs dependency installation, git hook setup, and workspace symlinks such as `repo:agent-docs` and `repo:tasks` ([Shared agent docs]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#shared-agent-docs), [Task directory]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}#task-directory)).
- **Workspace Management:** Helper scripts in `scripts/devex/` and ignored runtime artifacts in `.local/` (logs, local eval data) sit directly behind commands.
- **Knowledge Management:** `AGENTS.md` routes to the catalog, and `docs/evergreen/runbook.md` writes procedures in terms of named commands rather than raw tool flags.
- **Workflow Infrastructure:** Developers, agents, git hooks (`task security:scan:staged`), and CI invoke the same wrapped build, lint, type, and test commands.
- **Agent Integration ("On the boundary" in [Definitions and boundaries]({{< ref "ai-engineering/agents/environment/ade" >}}#definitions-and-boundaries)):** Tool-specific settings (`.claude/settings.json`, Codex rules) attach permission rules to command prefixes--right where the repository meets each harness.

### 1.2 How the knowledge interface and the operational interface relate


In [Working Assumptions]({{< ref "ai-engineering/working-assumptions" >}}#llms-generate-proposals-evidence-drives-selection), language models generate candidate explanations and changes while *tools and the environment generate discriminating evidence*. In [ADE's control terms]({{< ref "ai-engineering/agents/environment/ade" >}}#feedback-and-checks), Böckeler calls these **feedforward guides** and **feedback sensors**.

Seen through both lenses, the **knowledge interface** (`AGENTS.md`, `docs/`, contracts, ADRs) and the **operational interface** (`Taskfile.yml`, `Makefile`, scripts) are not a flat "docs = read, commands = write" split:

1. **Intended reality (feedforward) vs. observed reality (evidence/feedback).** Canonical docs and feature contracts state *what the system is supposed to do and why*. Read-only checks and runtime commands (`quality:verify`, `db:status`, `config:show`, log/trace capture) expose *what the system actually does right now* ([Structure and visibility]({{< ref "ai-engineering/agents/environment/ade" >}}#structure-and-visibility)). Investigation, bug resolution, and review live in comparing those two sources--preventing the agent from treating buggy code as intended behavior or unverified prose as working reality.
2. **Conditional judgment vs. repeatable execution.**
   - `AGENTS.md` **routes**: points to the catalog (`task help`) and names the baseline gate (`task quality:verify`) ([Make it a map, not a manual]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#make-it-a-map-not-a-manual)).
   - `docs/evergreen/runbook.md` holds **conditional procedures and human decisions**: *when* and *why* to run an operation, recovery judgment, and steps that should not run blindly (such as initializing `.env` without overwriting existing credentials).
   - `Taskfile.yml` absorbs **unconditional, repeatable sequences**: *how* tools, flags, containers, and step ordering execute once a decision is made.
3. **Mutual constraining and checking.** Docs define what each command namespace owns and *does not* own (as in `knowledge-assistant`'s `commands.md`), keeping commands modular. Conversely, deterministic verification commands (`quality:verify`, `api:check`) check as early as cost allows ("keeping quality left" in [Feedback and checks]({{< ref "ai-engineering/agents/environment/ade" >}}#feedback-and-checks)) that code, generated schemas, and contracts have not drifted apart, with failure output written so the agent knows how to fix the violation.

### 1.3 Where humans and agents differ at the command line


Most good command-layer habits help humans and agents alike, which is why developers, assistants, git hooks, and CI share the same commands. The baseline places where human terminal assumptions fail coding agents are solid:

- **Cold start vs. memorized habit:** Developers memorize a handful of commands; agents start every session fresh with generic priors (`pip`, `pytest`, `npm`) and choose commands from `task help` names and one-line descriptions.
- **Returning vs. foreground execution:** Developers keep long-running servers in separate terminal tabs (`Ctrl+C`); agents in a sequential tool loop need service-start commands that detach and return once healthy (`--wait`).
- **Arguments vs. interactive REPLs:** Developers explore through interactive shells (`psql`); agents need non-interactive commands that accept arguments, print output, and exit.
- **Files and status commands vs. live visual streams:** Developers watch streaming terminal logs or click through a UI; agents inspect discrete `status` output, bounded logs, and saved diagnostic files.
- **Mechanical gates and parallel checkouts:** Humans pause before running a script that bills a cloud GPU and usually run one local stack; agents require explicit risk boundaries and collide on fixed ports/volumes when working across parallel git worktrees.

### 1.4 Three-level command composition


Across the projects that scale cleanly (`python-repo-template`, `knowledge-assistant`, `lang-assistant`), commands form three stable layers:

1. **Raw tool invocations** (`uv run ...`, `docker compose ...`, containerized `bun`/`pyright`), hidden inside the runner file or `scripts/devex/` helpers.
2. **Atomic subsystem commands** (`repo:*`, `quality:*`, `security:*`, `db:*`, `app:*`, `api:*`, `infra:*`), each doing one job for one subsystem under explicit *Owns / Does not own* boundaries.
3. **Scenarios and composite gates** (`quality:verify`, `scenario:local:up`, `scenario:e2e`), which compose atomic commands for multi-step workflows (including exit cleanup) while leaving the atomic commands available when a step fails.

---

## 2. Practical consequences of current variations


Not every inconsistency across the eight projects is equally costly. Evaluating their real consequences separates what matters now from what can wait.

### 2.1 Split task runners (`Make` + `Poe` vs. one runner)


In `wallet`, `wallet-evals`, and `sem-rag`, workflows are split between `Makefile` and `poe_tasks.toml`. Earlier we noted "extra routing rules in `AGENTS.md`" as a downside--what does that actually mean, and how much does it matter?

- **What "extra routing in `AGENTS.md`" means (and why token cost is minor):** With one runner (`knowledge-assistant`), `AGENTS.md` needs one sentence: *"Use `task <namespace>:<name>` for repository workflows and `task help` for the current catalog."* With `Make` + `Poe` side by side (`sem-rag`), `AGENTS.md` has to explain the split itself (*use `make` for Docker, Compose, and observability; use `uv run poe` for Python checks, migrations, API/worker, and query diagnostics*). In pure token cost, those extra 2-3 lines are tiny (~40 tokens).
- **The actual operational costs of the split:**
  1. **Two catalogs to discover:** An agent looking for workflows has to run both `make help` and `uv run poe --help`, or guesses `make test` when tests live in `poe`.
  2. **Awkward cross-layer composition:** Whenever a workflow spans Docker containers *and* Python scripts (starting services, running migrations, executing E2E tests), one runner ends up shelling out to the other anyway--which is why `wallet` ended up wrapping `uv run poe ...` targets inside `Makefile`.
  3. **Make-specific sharp edges:** `@`-prefixed lines in `Makefile` hide which command failed, `make help` requires custom `awk` comments, and file/target prerequisites like `wallet`'s `test: install` trigger dependency syncs during what looks like a read-only test run.
- **Why Poe was attractive (the real trade-off):** Poe installs inside `uv` with no extra host binary and handles typed positional and flag arguments cleanly (`uv run poe collect-query-context <query_id>`), whereas Go Task passes raw arguments after `--` and Make relies on `VAR=value`.
- **Practical takeaway:** In a pure-Python repo with no container orchestration, `Poe` alone is fine; in multi-service repos, consolidating on a single public runner (`Taskfile.yml` calling Python scripts under `scripts/devex/` when rich CLI args are needed) removes the two-catalog split cleanly.

### 2.2 Service `status`, observation commands, and worktree concurrency


- **Service `status` and non-blocking startup:** Worth applying incrementally in practice whenever touching a repo's local stack--adding a `status` check and ensuring `up` can return when healthy (`--wait`) directly prevents hung agent turns.
- **Structured observation (`diag:*`):** Useful in data- and pipeline-heavy systems like `sem-rag` (`collect-query-context`), where reconstructing a failed RAG run by hand is tedious. In simpler CRUD or library repos where standard test output and logs suffice, pre-building `diag:*` commands upfront is unnecessary overhead.
- **Concurrent worktree stacks:** Acceptable to defer where one local stack runs at a time; becomes important once running multiple `bb` threads or agents against live stacks in parallel worktrees.

### 2.3 Harness permission drift vs. `.env` secrets (two separate issues)


Earlier we compressed "permission drift" and "`.env` secrets" into one critique, which obscured how they relate. They are two distinct problems, and separating them shows why safety cannot be solved inside `Taskfile.yml` alone:

1. **Permission rule drift (configuration mismatch):**
   - Harness permission files match the literal command string an agent tries to run--for example, `"ask": ["Bash(task infra:*)"]` in `.claude/settings.json`.
   - *Tool-to-tool drift:* Claude Code, Codex, and OpenCode each read different permission files with different capabilities ([Several agent tools in one repository]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}#several-agent-tools-in-one-repository)). Updating one leaves the others out of sync.
   - *Taskfile-to-rule drift:* If `Taskfile.yml` adds a composite command outside that namespace that internally calls a risky one--such as `lang-assistant`'s `task scenario:demo`, which resumes the paid RunPod GPU pod--a harness rule watching `Bash(task infra:*)` **will not match `task scenario:demo`**, so the prompt never fires.
2. **Workspace `.env` secrets (bypassing the command layer entirely):**
   - Even if `"ask": ["Bash(task infra:*)"]` is completely accurate, `task infra:runpod:up` authenticates using `RUNPOD_API_KEY` from `.env` in the repo root.
   - Because `.env` sits in the agent's working directory and environment, an agent does not need `task` to use that key: it can read `.env` or run `uv run python scripts/...` or `curl` directly, bypassing the `task infra:*` permission rule altogether.

**Consequence:** In [ADE's boundary model]({{< ref "ai-engineering/agents/environment/ade" >}}#definitions-and-boundaries), permission settings sit *on the boundary* (written in the repo, enforced by only one harness), while credential and sandbox access sit in [ADE Access]({{< ref "ai-engineering/agents/environment/ade" >}}#access) and infrastructure. Grouping risky commands under `infra:*` is helpful for human clarity and basic harness prompts, **but a Taskfile namespace is not a security boundary**. Real protection has to live below the command layer--in which credentials exist in the agent's environment/sandbox in the first place ([Where an approval rule goes]({{< ref "ai-engineering/agents/agents-md/agents-md-fixes-and-changes" >}}#where-an-approval-rule-goes)).

---

## 3. Holding space: system-wide dimensions (not built "by commands" alone)


While analyzing commands, two structural axes emerged: **what epistemic/workflow job an action performs** and **what blast radius / side effects it can have**.

Crucially, **neither of these should be built solely through Taskfile commands.** An agent acts through file reads/edits, search tools, git, raw shell calls, Python one-liners, MCP servers, and browsers--not just `task <name>`. Treating these axes as "Taskfile rules" puts architectural weight on the wrong layer. Following [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}#6-workflow-activities), we hold them here as **system-wide ADE dimensions** to evaluate alongside `AGENTS.md`, harness roles, and sandboxing:

### 3.1 Candidate dimension A: epistemic and workflow role of operations


Across the engineering workflow ([Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}})), operations on the environment fall into four roles:

| Role | Question or outcome | Examples (commands *and* non-command tools) |
| --- | --- | --- |
| **1. Provisioning & sync** | Is the workspace/contract in a known state? | `task repo:init`, `uv sync`, `task api:generate`, worktree setup |
| **2. Reality probes (Observation)** | What does the code, data, or running system actually do right now? | `Read`/`Grep`, `task config:show`, `task db:status`, read-only SQL/API queries, trace capture |
| **3. Invariant & evaluation checks** | Does the candidate change satisfy structural, behavioral, and contract rules? | `task quality:verify`, `import-linter`, `task scenario:e2e`, `eval:*` suites |
| **4. State actuation** | What local code, container state, or external resource are we changing? | `Edit`/`Write`, `task quality:fmt`, `task stack:up`, git commits, `task infra:*` |

*Open question in holding space:* Which reality probes deserve named `Taskfile` commands, and which are better left to general agent tools (`Read`, `Grep`, ad-hoc `uv run python`, or MCP inspect tools) so `Taskfile.yml` stays small?

### 3.2 Candidate dimension B: effect and blast-radius tiers


Every action available to an agent--whether through `task` or raw tools--has a blast radius:

| Tier | Scope of effect | What enforces it for real (beyond command names) |
| --- | --- | --- |
| **Tier 0: Purely read-only** | Reads repo files, local service status, logs, or dry-run plans; mutates nothing | Read-only filesystem/sandbox mode; read-only DB credentials |
| **Tier 1: Worktree-local reversible** | Edits working tree, `.venv`, or isolated local containers/volumes | Git worktree boundary + container project/port scoping |
| **Tier 2: Local destructive or contract-changing** | Deletes local data volumes or changes shared API schemas/migrations | Explicit confirmation / `--dry-run` + contract diff review in CI/PR |
| **Tier 3: External, billed, or shared state** | Cloud GPUs (`RunPod`), shared staging/prod, publishing, git push/merge | **Absent credentials in agent `.env`**; scoped/short-lived tokens; human-gated CI/CD or secret broker |

*Open question in holding space:* How should ADE roles (for example, an *Investigation* or *Independent Reviewer* assistant vs. an *Implementation* assistant in [Participants & Roles]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#roles)) bind to these tiers at the **harness/sandbox level**, with `Taskfile` naming merely mirroring those boundaries for convenience?

---

## 4. Explicit design prototypes and future trade-offs


Following [Improving the environment]({{< ref "ai-engineering/agents/environment/ade" >}}#improving-the-environment) and Build Protocol, environment machinery should earn its keep against observed agent failures rather than being added speculatively. The patterns below are **explicit prototypes, not baseline requirements**--adopt them in `python-repo-template` or individual projects only when session observations (catalog bypasses, hung turns, port collisions, stale command errors, or permission friction) justify the maintenance cost.

### Prototype 1: Standardized non-blocking service verbs (`up`, `status`, `logs`, `down`, `clean`)


- **Idea:** Where a project runs local services, make `up` detach and wait for readiness (`--wait`), always include `status` (non-zero exit when unhealthy), make `logs` bounded by default (saving full logs to `.local/logs/`), keep data on `down`, and put volume deletion behind `clean` (with `--dry-run`). Keep foreground hot-reload under an explicit human verb like `watch` or `dev`.
- **Trade-off:** Slightly more setup in `Taskfile.yml` or a small helper script compared to raw `uvicorn --reload`, in exchange for eliminating hung agent turns and missing `status` checks.

### Prototype 2: Automatic Git-worktree stack isolation


- **Idea:** Extend `lang-assistant`'s `local_stack.py` pattern so that when no `--slug` is passed, `COMPOSE_PROJECT_NAME`, host port offsets (or dynamic ports printed by `status`), and volume names derive automatically from the current Git worktree name/hash.
- **Trade-off:** Dynamic or offset ports mean developers cannot rely on a single memorized `localhost:8000` URL across worktrees (requiring `status` or a local reverse proxy). Worth adopting only when actively running multiple local stacks across parallel worktrees.

### Prototype 3: On-demand diagnostic bundles (`diag:*`) and read-only query wrappers


- **Idea:** Generalize `sem-rag`'s `collect-query-context` and non-interactive read-only `db:query -- "..."` for projects with stateful backends, queues, or multi-step LLM/RAG pipelines.
- **Trade-off:** High value in complex pipelines where reproducing traces manually is slow; dead weight in simple stateless libraries or prototypes where `pytest` and container logs already show everything needed.

### Prototype 4: ADE link and command drift check (`quality:ade`)


- **Idea:** Add a fast Python test or script check verifying that every public command in `Taskfile.yml` has a namespace and `desc`, that every `task <name>` cited in `AGENTS.md`, `README.md`, and `docs/evergreen/` exists (and is not a compatibility alias), and that configured `.githooks` / script paths exist on disk.
- **Trade-off:** Prevents silent rot like `knowledge-assistant`'s removed `task frontend:run` and `sem-rag`'s deleted `.githooks`, at the cost of maintaining a small regex/YAML test and conventions for quoting hypothetical command examples in docs.

### Prototype 5: Declarative policy sync + externalized Tier 3 secrets


- **Idea:** Move paid/remote credentials (`RUNPOD_API_KEY`, deployment tokens) out of the workspace `.env` into a secret store or human-only wrapper (`bb` secrets / `1password` / host keychain prompt), and generate or lint `.claude/settings.json` and Codex rules from a single repo policy list.
- **Trade-off:** Solves both raw-shell secret bypasses and multi-harness permission drift, but adds friction when a human developer wants to run `infra:runpod:up` quickly and requires updating the generator whenever harness config formats change.
