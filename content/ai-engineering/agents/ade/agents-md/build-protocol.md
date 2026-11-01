---
draft: false
toc: true
title: "Building AGENTS.md from Evidence"
aliases:
  - "/ai-engineering/agents/agents-md/build-protocol/"
  - "/ai-engineering/agents/agents-md/build/agents-md-build-protocol/"
  - "/ai-engineering/agents/agents-md/build/build-protocol/"
  - "/ai-engineering/agents/agents-md/build/"
description: "A procedure for maintaining a root AGENTS.md from observed agent behavior: start minimal, find failures, place each fix where it belongs, record the change and its expected effect, check results, and remove lines that stop helping."
linkTitle: "Build Protocol"
---

[Designing the root AGENTS.md]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}) defines the characteristics and design rules of a good root `AGENTS.md`. This note turns its maintenance rules into a procedure: start with a minimal file, make changes based on observed failures or project decisions, and evaluate their effects on the relevant tasks that follow. Treat each change as a hypothesis about agent behavior.

{{< callout context="note" title="The loop" icon="outline/info-circle" >}}
1. Start with the smallest useful file.
2. Observe agents working on real tasks.
3. For recurring or costly failures, choose where to apply the fix.
4. If the fix belongs in `AGENTS.md`, make a focused change and record its rationale.
5. Evaluate the change on the relevant tasks that follow, then keep, revise, or remove it.

At any point, remove instructions that no longer help, and review the entire file after significant changes to the model, tools, or repository.
{{< /callout >}}

## Start with the smallest useful file


Start with only the repository's purpose, the location of canonical documentation, baseline checks, and known hard constraints, as described in [Start with the smallest useful file]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#start-with-the-smallest-useful-file). Keep setup instructions and general command references in the README and runbook, with links from `AGENTS.md`. See [python-repo-template](https://github.com/valery-judah/python-repo-template) for an example.

Avoid speculative sections; add guidance when observed failures or project decisions justify it. Starting small makes recurring agent failures easier to identify and helps determine what guidance to add.

## Observe agents on real tasks


To assess the file's effect, examine agent sessions and the results of code review ([Only agent behavior shows it]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/agents-md-verification" >}}#only-agent-behavior-shows-it)). Look for failures, including:

- Unnecessary searches before finding the correct file, documentation, or command.
- Skipped checks or incorrect verification commands.
- Violations of project defaults, such as using `pip` instead of `uv`.
- Violations of project constraints or architecture boundaries.
- The same review issue recurring across changes.
- Tasks left incomplete or decisions made without required clarification.

Record each failure, even an isolated one, with a link to the relevant session or pull request. Prioritize recurring or costly failures for investigation.

## Choose where to apply the fix


Most fixes do not belong in `AGENTS.md`. Use the [placement table]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#put-each-fix-where-it-works-best) to choose where to address the problem:

- Put detailed explanations in canonical documentation.
- Automate repeated workflows through scripts or task targets.
- Enforce code behavior through tests, and architecture constraints through structural tests or lint rules, all run in CI.
- Document feature-specific requirements in a feature contract backed by tests.
- Enforce approval requirements, such as "ask before deploying," through permission settings or review gates ([Approval rules]({{< ref "ai-engineering/agents/ade/agents-md/agents-md-examples" >}}#approval-rules)).
- Keep package-specific, domain-specific, or frequently changing guidance in nested `AGENTS.md` files or domain documentation.
- Put tool-specific guidance in that tool's instruction file, such as `CLAUDE.md`.

Add guidance to the root file only when it defines a short, broadly applicable, stable project default that agents cannot reliably infer from the repository ([Treat context as a budget]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#treat-context-as-a-budget)).

## Make one change with its reason


Commit each substantive change separately to make its rationale and observed effects easier to track. Group related instructions that address the same failure in one commit. Routine updates, such as correcting documentation links, may also be batched.

Record the trigger, expected effect, and removal condition in the commit message, as the [Justified]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#desired-characteristics) characteristic requires:

```text
AGENTS.md: use uv for Python commands

Trigger: agents used `pip install` in three sessions (links).
Expected effect: agents install dependencies with `uv sync`, run tools with `uv run`, and avoid `pip install`.
Removal condition: equivalent behavior is enforced or consistently observed without this instruction.
```


Describe the expected effect as observable agent behavior, such as commands executed, files changed, or mistakes avoided. Without an observable expected effect, it becomes difficult to evaluate whether the instruction helps or deserves to remain. For example, compare these instructions:

| Instruction | Expected effect |
| --- | --- |
| "Install dependencies with `uv sync`. Run Python tools with `uv run`. Do not use `pip install`." | Agents use `uv sync` and `uv run` for the relevant tasks, and avoid `pip install`. |
| "Write clean, maintainable code." | No specific behavioral change is defined. The instruction duplicates general engineering expectations. |

The first instruction can be evaluated on tasks that install dependencies or run Python tools. The second specifies no concrete project requirement or observable behavioral change, so it does not belong in the root file.

For frequently edited files or projects with multiple contributors, maintain a separate change log, such as `docs/agents-md-log.md`. Each entry records the date, the change, its trigger, its expected effect, and its removal condition. Later, add the observed results and the decision to keep, revise, or remove the change. Keep change history, evaluation notes, and provisional labels outside `AGENTS.md` because they consume context in every session. A brief explanation that the agent needs to apply a rule correctly can stay in the file.

Before merging, review the change against the [design rules]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#the-rules).

## Evaluate the change on relevant tasks


Evaluate a change after observing relevant tasks, rather than after a fixed period. Then decide:

- **Keep** the instruction when relevant observations support its expected effect. Record the evidence.
- **Revise** the instruction when agents misunderstand or only partially follow it. Clarify the wording, or move the requirement to a place where it works better, such as a check or a nested file.
- **Remove** the instruction when evidence shows that it is ineffective or unnecessary. If no relevant tasks have occurred, defer the decision.

A few observations provide limited evidence because agent behavior varies across runs and tasks. For consequential changes, compare agent outcomes on representative tasks with and without the instruction, as described in the [experimentation primer]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/coding-agent-experimentation-primer" >}}).

## Remove instructions that no longer help


Periodically review instructions for continued relevance and effectiveness. Consider removing an instruction, replacing it with a reference, or moving it elsewhere when:

- The requirement is now enforced by a check, script, or permission setting.
- Agents consistently follow the requirement without the instruction, for example after a model upgrade.
- The instruction duplicates canonical documentation.
- The instruction applies to few tasks, such as those in one package or domain, and fits better in a nested file or domain document.
- The instruction is outdated or references commands, paths, or documentation that no longer exist.
- The instruction has no recorded rationale, and its purpose cannot be established.

Correct an outdated instruction when its requirement still holds. Investigate an instruction with no recorded rationale before removing it.

For low-risk instructions with uncertain value, compare agent behavior with and without them on relevant tasks. If removal causes a regression, restore or revise the instruction and record the evidence.

Retain hard constraints, including secrets handling, irreversible operations, and security boundaries, until equivalent enforcement is in place. Do not remove them to test whether they help.

Record each removal with its rationale and expected effect, as you would an addition. Review the entire file after major model or tool upgrades or significant repository changes ([Agents, tools, and models change]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#agents-tools-and-models-change)).
