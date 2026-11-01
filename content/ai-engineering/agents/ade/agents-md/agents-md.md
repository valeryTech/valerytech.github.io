---
draft: false
toc: true
title: "Designing the Root AGENTS.md"
aliases:
  - "/ai-engineering/agents/agents-md/agents-md/"
description: "The root AGENTS.md is loaded in every session, so every line costs context. This note derives its design rules: keep the file a short map of project defaults, enforce what matters, and justify each line by a failure or a decision."
linkTitle: "Design"
---
## What the root `AGENTS.md` is


In this note, `AGENTS.md` refers to the file at the repository root. Nested `AGENTS.md` files load only when the agent works in their directories and follow separate rules (see [Separate stable root rules from changing domain knowledge](#separate-stable-root-rules-from-changing-domain-knowledge)).

{{< callout context="tip" title="Definition" icon="outline/rocket" >}}
The root `AGENTS.md` provides project context that a coding agent loads at the start of every session. It should tell a capable agent what it cannot infer from the repository or might get wrong by following generic practices: where to look, what differs here, and what done means.
{{< /callout >}}

### Main features


- **Loaded in every session.** The agent reads the root file before every task. In Claude Code, `CLAUDE.md` must import the root `agents.md` file to ensure it loads ([Keep one core for all agents](#keep-one-core-for-all-agents)).
- **Consumes context in every session.** Every line consumes context and attention, even in sessions where it is irrelevant.
- **Guidance, not enforcement.** The agent weighs these instructions against other context, and the file cannot guarantee compliance. Rules that must hold need automated checks or permission settings ([Prefer enforcement over prose](#prefer-enforcement-over-prose)).
- **Shared and versioned.** The file lives in the repository, is reviewed like code, and provides the same guidance to all agents and contributors.

### Why it is worth optimizing


Because every session loads the root file, the context it consumes is multiplied by the number of sessions. A useful line helps agents across tasks. An unnecessary line consumes context in every session. An incorrect line can mislead agents across sessions without any indication that it is wrong ([why]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/agents-md-verification" >}})).

The root file is therefore a high-impact place to remove unnecessary guidance and verify what remains. This recurring cost motivates several design rules, including [Treat context as a budget](#treat-context-as-a-budget) and [Convert repeated failures into harness improvements](#convert-repeated-failures-into-harness-improvements). [Costs and benefits of optimizing AGENTS.md]({{< ref "ai-engineering/agents/ade/agents-md-costs-and-benefits" >}}) estimates this cost in dollars and compares it with the file's effects on execution, human effort, and quality.

### Three jobs


Developers acquire project context through onboarding and daily work. An agent starts each session with general engineering knowledge but must reconstruct the project's local context. The root `AGENTS.md` file supplies that missing context.

**Where to look.** Identify the project, its canonical sources, which source takes precedence when they disagree, and where to find setup instructions, commands, and detailed documentation. Keep the details in those sources so agents load them only when needed.

**What differs here.** State the project's defaults that differ from common practice, such as using `uv` instead of `pip`, and its hard constraints. The agent's general engineering knowledge covers the rest.

**What done means.** Specify the baseline checks as exact commands and, where needed, when the agent should stop and ask for guidance. Feature-specific acceptance checks determine whether the result meets the task's requirements and belong outside the root file ([Define done and when to ask](#define-done-and-when-to-ask)).

## The system around the file

{{< callout context="tip" title="Systemic perspective" icon="outline/rocket" >}}
Designing `AGENTS.md` is one way to influence a larger system: people, agents, the repository, the harness, and the processes connecting them. Other ways to influence the system include canonical documentation, checks, permission settings, review practices, and task design. A change to the file is judged by what it does to the system's results, not by how the file reads.
{{< /callout >}}

### Participants


- **People** set tasks, review results, and maintain the repository. They remain responsible for defining intent and making product, architecture, and risk decisions.
- **Agents** carry out tasks in sessions. They should handle routine execution without silently making decisions that require human ownership or judgment.
- **The repository** contains the sources agents use to understand the project: code, `AGENTS.md`, and canonical documentation such as architecture maps, feature contracts, execution plans, generated schemas, and runbooks.
- **The harness** runs agents, constrains their actions, and checks their work. It includes the tools that load instruction files, permission settings, hooks, scripts, tests, linters, and CI.

### Processes


The file influences outcomes through three recurring processes:

1. **Session.** The harness loads the root file and the user's request at the start of each session. The agent gathers context from the files it opens and tools it runs, interprets that context using its prior knowledge, and acts.
2. **Review.** Automated checks and human reviewers evaluate the result before acceptance.
3. **Maintenance.** People, often assisted by agents, revise the file and harness based on observations from sessions and reviews.

### Goal


The goal is to increase the agent's **reliable autonomy** on project work: its ability to complete larger, more valuable tasks end-to-end while maintaining project quality, following local constraints, validating results, and escalating when it cannot safely proceed. Reliable autonomy is a property of the whole system, not of the agent or `AGENTS.md` alone.

To achieve this, the system makes the project **understandable, navigable, and safe for agents to change**. It provides agents with the context, constraints, tools, and feedback they need, at the right time, to turn user intent into validated project changes, evidence-backed findings, diagnoses, and design proposals.

A good system lets users delegate well-scoped (or not so well-scoped) tasks and receive useful, reviewable results while retaining control over quality, architecture, and risk. This work extends beyond code changes. It includes investigating system behavior, debugging failures, identifying root causes, and proposing design options.

## Premises


The design of `AGENTS.md` rests on the following assumptions.

It targets modern coding agents -- Codex, Claude Code, Cursor-style agents, and similar systems--that already have strong general engineering knowledge, tool-use capabilities, default policies, and learned conventions.

The premises follow the [system's three processes](#the-system-around-the-file): session, review, and maintenance. Each premise links to the [design rules](#design-rules) it supports. All are working hypotheses. The [research agenda]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/coding-agent-research-questions" >}}#standing-of-the-premises) (WIP) records the supporting evidence for each premise and the questions that could confirm or revise it.

### In the session


The file's effect on a session depends on how the agent builds and evaluates its context.

#### Agents work from assembled context


An agent learns about the project from the context available in its session, including the files it opens. A stale document or unrepresentative example can therefore lead it to adopt the wrong convention. `AGENTS.md` should provide minimal orientation: which files to consult, which sources are authoritative, and where to find setup instructions and commands ([Start with the smallest useful file](#start-with-the-smallest-useful-file), [Make it a map, not a manual](#make-it-a-map-not-a-manual)).

#### Agents bring generic priors


Coding agents already have strong prior knowledge of software engineering. They know common project structures, naming conventions, libraries, workflows, and refactoring techniques.

These priors are useful but do not capture a project's local conventions. When local expectations are unclear, an agent may apply general engineering practices that are wrong for the project: introducing unnecessary abstractions, renaming for clarity, expanding a refactor's scope, adding popular dependencies, copying legacy patterns, or using the wrong test framework.

`AGENTS.md` should correct generic assumptions where they conflict with project defaults, without replacing them with a long rulebook ([what differs here](#three-jobs), [Add only project-specific defaults](#add-only-project-specific-defaults)).

#### Instructions compete for attention and authority


An agent's attention is limited. As context grows, individual instructions may receive less weight, making guidance easier to miss in long files, extended sessions, or noisy tool output. Context also varies in authority: user requests, instructions, documentation, nearby code, and test output carry different weight. Some provide instructions; others serve as evidence. The root file should therefore remain short, stable, and focused, with a clear hierarchy of authoritative sources and no duplicated guidance ([Treat context as a budget](#treat-context-as-a-budget), [Separate stable root rules from changing domain knowledge](#separate-stable-root-rules-from-changing-domain-knowledge), [Name the sources of truth](#name-the-sources-of-truth)).

#### Agents weigh instructions rather than obey them


An agent evaluates instructions in `AGENTS.md` alongside the user's request, the code, and other context. The agent may misinterpret an instruction or lose track of it during a long session. The file alone cannot guarantee compliance. Enforcement comes from the harness: permission rules, hooks, tests, and CI (see [Approval rules in AGENTS.md]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#approval-rules)). Rules that must hold should be enforced through checks or permission settings. Repeated failures should prompt improvements to the harness ([Prefer enforcement over prose](#prefer-enforcement-over-prose), [Convert repeated failures into harness improvements](#convert-repeated-failures-into-harness-improvements)).

### At review


The agent's work must be evaluated independently.

#### Plausible completion is not correctness


Agents can produce work that appears complete: readable code, confident summaries, tests that pass without checking the intended behavior, and unreviewed decisions about ambiguous or high-risk matters. Correctness and compliance with project constraints require independent validation through tests, type checks, contracts, or human review.

Post-training reinforces this tendency. It can favor responses that agree with users or sound convincing over ones that are correct, because models are optimized for signals from human raters and reward models. Reinforcement learning on coding tasks rewards passing checks. Models may learn to satisfy those checks without solving the underlying task, for example by modifying tests or scoring code. These training incentives may encourage agents to produce work that appears complete or exploit gaps in validation.

`AGENTS.md` should therefore direct agents to validation commands, task harnesses, contracts, and checks, and specify when to stop and ask for guidance ([Define done and when to ask](#define-done-and-when-to-ask)).

### In maintenance


Many people maintain the file over time, often with limited evidence of its effectiveness.

#### Many agents and people share the file


Multiple people and agents may work in the same repository, while different tools load instruction files differently. A change intended for one agent affects every agent that loads the file, often without visibility into all affected sessions. Maintain one shared core for all agents, and review every change against these design rules ([Keep one core for all agents](#keep-one-core-for-all-agents), [Record and review every change]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}#make-one-change-with-its-reason)).

#### The file's effect shows only in agent behavior


Reading the file can assess its clarity and plausibility; static checks can verify its links and commands. Its effectiveness can only be established by comparing agent behavior with and without the file's guidance ([Why it is hard to tell whether AGENTS.md works]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/agents-md-verification" >}})). The file should therefore start small, with each addition recorded and evaluated separately ([Start with the smallest useful file](#start-with-the-smallest-useful-file), [Convert repeated failures into harness improvements](#convert-repeated-failures-into-harness-improvements), [Record and review every change]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}#make-one-change-with-its-reason)).

#### Agents, tools, and models change


Models improve, tools change how they load and enforce instructions, and repositories evolve. An instruction that helped one model may be unnecessary for its successor, and evidence of effectiveness applies only to the setup in which it was gathered. Date evaluations of effectiveness and repeat them after model or tool upgrades and major repository changes ([Recheck when the setup changes]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}#remove-instructions-that-no-longer-help)).

## Design rules


This section stands on its own. It describes the characteristics of a good root `AGENTS.md` and the problems they address, then presents the design rules in summary and in detail. Each premise in [Premises](#premises) links to the rules derived from it.

### Desired characteristics


The features in the definition apply to every root `AGENTS.md`. The following characteristics distinguish a well-designed root file.

During a session, a good root file has these characteristics:

- **Short.** It stays within a roughly defined fixed length budget, with every line relevant to many tasks. Otherwise, it consumes context in every session and makes important instructions harder to find.
- **Project-specific.** It contains guidance that agents cannot infer from the repository or might get wrong by following general engineering practices. Otherwise, it repeats what agents already know while leaving important project defaults unspecified.
- **A map.** It points to canonical documentation, including the README and runbook for setup and commands, without duplicating their contents. Otherwise, duplicated details can become outdated, leaving agents unsure which source to trust.
- **Clear about authority.** It identifies canonical sources and distinguishes them from reference and historical material. Otherwise, agents may treat outdated documentation and legacy code as equally authoritative.
- **Actionable.** It specifies baseline checks as exact commands and identifies when agents should stop and ask for guidance. Otherwise, agents may submit unvalidated work or make decisions that require human input.
- **Backed by enforcement.** Mandatory rules are enforced through checks or permission settings, which the file may reference. Otherwise, compliance depends on how much weight the agent gives the instruction.

Over time, a good root file should remain:

- **Shared.** A common core serves all agents and contributors, with tool-specific files adding only tool-specific guidance. Otherwise, separate copies diverge, and agents working in the same repository follow inconsistent rules.
- **Justified.** Every line addresses an observed failure or records a project decision. Add each line separately, record its justification, and remove it when it no longer provides value ([Record and review every change]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}#make-one-change-with-its-reason)). Otherwise, speculative guidance accumulates, important fixes become hard to distinguish from filler, and the effect of individual changes becomes difficult to measure.
- **Stable and current.** It changes infrequently and is reviewed after changes to tools, models, or the repository. Otherwise, frequently changing guidance becomes outdated, and instructions tailored to one model may mislead its successor.

### The rules


The rules fall into three groups. The following subsections explain rules 1-11; the [build protocol]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}) implements rules 12 and 13.

**What goes in the file.** These rules keep the file concise, project-specific, clear about authority, and actionable.

1. [Start with the smallest useful file](#start-with-the-smallest-useful-file). Include only the repository's purpose, the location of canonical documentation, baseline checks, and known hard constraints.
2. [Add only project-specific defaults](#add-only-project-specific-defaults). Document what agents cannot infer from the repository or might get wrong by applying general engineering practices.
3. [Treat context as a budget](#treat-context-as-a-budget). Keep only instructions that are short enough to follow correctly, broadly applicable, and stable. Put detailed explanations in linked documentation.
4. [Make it a map, not a manual](#make-it-a-map-not-a-manual). Link to canonical documentation, keeping setup instructions and command references in the README and runbook.
5. [Name the sources of truth](#name-the-sources-of-truth). Identify canonical, reference, and historical sources, and specify which takes precedence when they disagree.
6. [Define done and when to ask](#define-done-and-when-to-ask). Specify the exact baseline checks for each type of change and the conditions that require human input. Keep feature-specific acceptance checks outside the root file.

**What goes elsewhere.** These rules support enforcement, consistency across agents, and stability.

7. [Put each fix where it works best](#put-each-fix-where-it-works-best). Choose where to address a failure based on what the agent lacked: documentation, a script, a test, a structural check, a feature contract, permission settings, a nested file, or tool-specific instructions. Reserve the root file for short, project-specific defaults.
8. [Prefer enforcement over prose](#prefer-enforcement-over-prose). Enforce mandatory rules through checks or permission settings. Keep only a reference in the root file, and make failure messages explain how to recover.
9. [Separate stable root rules from changing domain knowledge](#separate-stable-root-rules-from-changing-domain-knowledge). Keep frequently changing or domain-specific guidance in nested files or domain documentation.
10. [Keep one core for all agents](#keep-one-core-for-all-agents). Tool-specific files should import the shared core and contain only additional guidance for that tool.

**How the file changes.** These rules ensure that changes remain justified and the file stays current.

11. [Convert repeated failures into harness improvements](#convert-repeated-failures-into-harness-improvements). Add guidance only to address a recurring or costly failure, or to document a project decision. Fix the environment first, and add guidance to the root file only when rule 7 calls for it.
12. [Record and review every change]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}#make-one-change-with-its-reason). Document each change's rationale, review it against the design rules, and remove unjustified lines.
13. [Recheck when the setup changes]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}#remove-instructions-that-no-longer-help). After significant changes to models, tools, or the repository, reassess existing guidance and remove instructions that no longer help.

### What goes in the file

#### Start with the smallest useful file


Do not write a comprehensive `AGENTS.md` upfront. A large initial version can accumulate generic advice, duplicated documentation, and speculative rules, making actual agent failures harder to identify.

Start with an empty file or a minimal template containing:

- the repository's purpose;
- the location of canonical documentation, including setup and command references;
- baseline checks as exact commands;
- known, broadly applicable hard constraints.

Keep setup instructions and other commands in the README and runbook, with links from `AGENTS.md` ([Make it a map, not a manual](#make-it-a-map-not-a-manual)). See [python-repo-template](https://github.com/valery-judah/python-repo-template) for an example.

#### Add only project-specific defaults


The most valuable instructions describe local defaults that agents cannot infer from the repository and might get wrong by following common engineering practices:

- the agent uses `pip`, but the project uses `uv`;
- the agent runs `pytest`, but the project expects `make test`;
- the agent edits generated files instead of source files;
- the agent adds a dependency without checking existing libraries;
- the agent writes tests in the wrong framework;
- the agent violates local architecture boundaries;
- the agent changes public behavior without updating the contract.

Do not add rules like "write clean code" or "follow best practices." Treat agents as capable colleagues with strong general knowledge and limited project-specific context.

{{< callout context="tip" title="Write for a capable colleague" icon="outline/rocket" >}}
Write `AGENTS.md` as onboarding context for a capable engineer who can explore the repository, use tools, recognize patterns, and make sound decisions.
{{< /callout >}}

#### Treat context as a budget


Every line of the root file competes with task-relevant context, including source files, diffs, test output, error logs, design documents, and user instructions. Include an instruction in the root file only if it meets three criteria:

- **It is short enough to follow.** The instruction should fit in a few lines without losing the detail needed for correct execution, such as "Run tools with `uv run`. Do not use `pip`." Guidance requiring steps, conditions, or exceptions--such as how to write a migration without locking a table--belongs in canonical documentation, linked from the root file ([example]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#something-that-takes-explaining)).
- **It applies to many tasks.** Instructions specific to one package, domain, or feature belong closer to the relevant code, where they do not consume context in unrelated sessions.
- **It is stable.** Put frequently changing guidance in nested files or domain documentation ([Separate stable root rules from changing domain knowledge](#separate-stable-root-rules-from-changing-domain-knowledge)).

Place guidance that fails these criteria, or is better enforced mechanically, according to the [placement table](#put-each-fix-where-it-works-best).

#### Make it a map, not a manual

{{< callout context="note" title="Routing principle" icon="outline/info-circle" >}}
The root file should direct agents to authoritative sources without duplicating their contents.
{{< /callout >}}


`AGENTS.md` should not contain all project knowledge. It should direct agents to relevant information when they need it. This is progressive disclosure: the root file loads in every session, while detailed information is loaded only when relevant to the task.

Commands are a common source of duplication. The README covers basic setup--installation, environment creation, and local execution--and links to the runbook. The runbook contains the complete command reference and operational procedures. `AGENTS.md` links to both. Include commands in `AGENTS.md` only when they specify required agent behavior: baseline checks ([Define done and when to ask](#define-done-and-when-to-ask)) or corrections to generic defaults, such as using `uv` instead of `pip` ([Add only project-specific defaults](#add-only-project-specific-defaults)). If no runbook exists, create one instead of adding the command reference to the root file.

A task runner, such as Go Task or Make, gives each workflow a name. With commands grouped by namespace and a catalog the agent can print, such as `task help`, the root file needs one line for commands. [Command layer]({{< ref "ai-engineering/agents/ade/command-layer" >}}) describes how the projects name and group commands and what that gives agents ([What the isolation gives agents]({{< ref "ai-engineering/agents/ade/command-layer" >}}#what-the-isolation-gives-agents)).

#### Name the sources of truth


Agents learn from the materials they read and may treat outdated documentation or legacy code as authoritative. Identify canonical, reference-only, and historical sources, and specify which takes precedence when they disagree. Link to these sources without duplicating their content.

For example: `docs/evergreen/` is canonical, `docs/delivery/` is reference-only, and `docs/workstreams/` is historical.

#### Define done and when to ask


Done has two levels; the root file defines only the first.

**Baseline checks** verify standard project requirements through linting, type checking, tests, and builds. Because these checks are consistent across tasks of the same type, the root file specifies their exact commands. Exact commands eliminate ambiguity between alternatives such as `pytest` and `make test`. Specify the checks required for each type of change: documentation-only changes may require none, while code changes require full verification. Passing these checks establishes that the change satisfies the conditions they test. It does not establish that the task's requirements are met.

**Acceptance** determines whether the result meets the task's requirements and preserves the feature's required behavior. Evaluate acceptance against the task and the [feature contract](#put-each-fix-where-it-works-best), using regression tests, tests for new behavior, or manual checks in the running application. For investigations, diagnoses, and design proposals, acceptance depends on supporting evidence, such as a reproducible failure. Because acceptance checks vary by feature, often require manual work, and lack a standard workflow, they remain outside the root file. Once an acceptance check becomes repeatable, automate it as a script or test, as described in the [placement table](#put-each-fix-where-it-works-best).

Specify when to stop and ask only for situations agents have mishandled without explicit guidance. Agents already default to asking before risky actions. Enforce restrictions on permitted actions through permission settings ([Approval rules in AGENTS.md]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#approval-rules)).

### What goes elsewhere

#### Put each fix where it works best


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

See [Repeated failures]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#repeated-failures) for examples of the first six cases and [Approval rules]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#approval-rules) for the seventh. For task targets, [Subsystem commands and scenarios]({{< ref "ai-engineering/agents/ade/command-layer" >}}#subsystem-commands-and-scenarios) shows how a workflow becomes one command built from smaller ones. The following rules explain enforcement, nested files, and tool-specific instructions.

A **structural check** verifies code organization: permitted module dependencies, file locations and naming conventions, and consistency between related artifacts such as generated code and its schema. Architecture boundaries are a common example, including one-way dependencies between layers and cross-cutting concerns accessed through a single interface.

A **feature contract** is a short document defining a feature's required behavior: rules, edge cases, behavior that looks wrong but is deliberate, scope boundaries, and the tests that verify each requirement. Agents could need feature contracts to distinguish intentional behavior from bugs, especially when their [generic priors](#agents-bring-generic-priors) suggest a different implementation. Tests enforce the contract's key requirements.

#### Prefer enforcement over prose


Eventually enforce important rules through CI, linting, scripts, tests, or structural checks. `AGENTS.md` should reference these enforcement mechanisms. Once a rule is enforced mechanically, reduce its explanation in `AGENTS.md` to a brief reminder or link.

Core principles of harness engineering are to provide clear boundaries, predictable structure, accessible tools, fast tests, and actionable feedback. Every check should report which rule failed and how to recover, since agents use failure messages to decide what to do next.

Rules governing permitted actions, such as "ask before deploying," belong in permission settings. See [Approval rules in AGENTS.md]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#approval-rules) for how to enforce these restrictions. When commands are grouped by what they can affect, such as remote operations under `infra:*`, one permission rule covers a whole group ([Keeping risky commands apart]({{< ref "ai-engineering/agents/ade/command-layer" >}}#keeping-risky-commands-apart)).

#### Separate stable root rules from changing domain knowledge


Keep stable, repository-wide rules in the root `AGENTS.md`. Place frequently changing guidance in the handbook, domain or feature documentation, or package-level `AGENTS.md` files. In monorepos, place package-specific rules in that package's nested `AGENTS.md`.

#### Keep one core for all agents


Keep guidance shared by all coding agents in the root `AGENTS.md`. Tool-specific files, such as `CLAUDE.md`, should reference or import the shared core and contain only tool-specific additions. Separate copies can diverge, causing agents in the same repository to follow inconsistent rules.

Claude Code requires an explicit import. Claude Code reads `AGENTS.md` automatically only when no `CLAUDE.md` exists. Once `CLAUDE.md` is present, it must import the shared core using `@AGENTS.md`, or the core stops loading.

### How the file changes

#### Convert repeated failures into harness improvements


Do not add a line or a section because it sounds useful. Add guidance only to address an observed failure that recurs or is costly, or to document a project decision that agents cannot infer.

Repeated agent failures may indicate a gap in the harness. When an agent repeats a mistake, address its underlying cause rather than merely correcting the output or adding another instruction to `AGENTS.md`. Use the [placement table](#put-each-fix-where-it-works-best) to choose an improvement that reduces the likelihood of recurrence. Reserve the root file for short, stable, project-specific defaults ([Treat context as a budget](#treat-context-as-a-budget)).

This prevents `AGENTS.md` from accumulating unnecessary instructions and turns repeated failures into lasting improvements. The [build protocol]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}) describes how to evaluate an observed failure, make a change, and decide whether to retain it.

## Follow-up questions


These questions concern the wider repository and harness. They are open issues to investigate, not additional rules for the root `AGENTS.md`.

### Low-frequency, high-risk constraints


When should a constraint that applies to few tasks but has severe consequences appear in the root file? Risk may justify keeping a short reminder even when the rule does not apply to many sessions. Investigate how to weigh severity and likelihood against recurring context cost, and whether permission settings, checks, or review gates can handle the risk without a root instruction.

### Documentation drift and conflicting sources


Canonical docs, feature contracts, tests, and implementation can diverge when their changes are not governed by a maintenance protocol. Investigate how the repository should prevent, detect, and reconcile that drift: who owns each source, which changes require related documents or tests to be updated, what can be checked automatically, and how conflicting evidence gets resolved. Also clarify what an agent should do when it finds a disagreement, distinguishing the code's current behavior from the project's intended behavior. This is a repository maintenance and source-of-truth problem; the root `AGENTS.md` should at most route the agent to the resulting protocol.

### Several agent tools in one repository


Several agent tools, such as Claude Code, Codex, Factory Droid, and GitHub Copilot, may work in the same repository ([Many agents and people share the file](#many-agents-and-people-share-the-file)). They load instruction files by different rules, and each has its own permission settings. [Keep one core for all agents](#keep-one-core-for-all-agents) covers the shared instructions. Restrictions are harder to keep in sync. A restriction that one tool can enforce, such as denying a command or a web domain in Claude Code, may have no matching setting in another tool. The same rule is then enforced for one agent and only written down for another.

Investigate how to keep restrictions in sync across tools: whether to keep one list of the repository's restrictions and generate each tool's settings from it, how to detect when the settings drift apart, and what to do when a tool cannot enforce a restriction. Controls outside the tools, such as removing access and requiring review, apply to every agent ([Approval rules]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#approval-rules)). Grouping commands by risk reduces the number of rules to keep in sync, because one rule can cover a namespace ([Keeping risky commands apart]({{< ref "ai-engineering/agents/ade/command-layer" >}}#keeping-risky-commands-apart)). Also clarify which tools may work in the repository, and how the team knows which ones its members use. For a tool that cannot enforce a restriction, a line in `AGENTS.md` is the only layer left, and the agent may not follow it.
