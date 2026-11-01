---
draft: false
toc: true
title: "Why It Is Hard to Tell Whether AGENTS.md Works"
aliases:
  - "/ai-engineering/agents/agents-md/evaluation/agents-md-verification/"
description: "Reading AGENTS.md and running static checks cannot show whether the file improves agent behavior. That takes behavioral evidence, which is costly and depends on the agent, model, repository, and task. Without it, decisions rely on indirect measures."
linkTitle: "Does It Work"
---

Review can establish whether `AGENTS.md` is clear and consistent with the project. Static checks can verify its references, commands, and length. Neither establishes whether its instructions improve agent behavior.

This follows a broader principle: [evaluating AI systems requires behavioral evidence]({{< ref "ai-engineering/approach/behavioral-evidence" >}}). Inspecting how an AI system is built does not establish how it behaves. For `AGENTS.md`, the instructions are what reviewers inspect, and agent behavior is what needs to be evaluated.

{{< callout context="caution" title="Core problem" icon="outline/alert-triangle" >}}
Review and static checks can validate `AGENTS.md`, but they cannot establish its effect on agent behavior. Measuring that effect requires observing agents at work and, to assess causality, comparing outcomes with and without the relevant instructions.
{{< /callout >}}

## Reading does not show it


Review can assess whether the instructions are accurate, clear, and consistent with the project. Review cannot establish whether agents follow the instructions, need them, or produce better results because of them. Instructions can appear sound even when they have no effect on agent behavior.

Shared [design rules]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#the-rules) make reviews more consistent, but cannot establish whether the instructions improve agent behavior.

## Static checks do not show it


Static checks can verify properties of the file and its references:

- Links resolve.
- Referenced commands and paths exist.
- The file stays within its length budget.
- The file does not duplicate documentation or mechanically enforced rules.

These checks can identify stale references and some redundant content. Measuring the file's effect requires running agents on tasks and evaluating their behavior.

## Only agent behavior shows it


An instruction improves outcomes only when five conditions hold. The instruction must reach the agent, apply to the task, be acted on, change what the agent would otherwise have done, and improve the result. Establishing these conditions requires observing agent behavior and comparing outcomes, which is costly:

- **It takes relevant tasks.** Effects can be measured only when agents perform tasks to which the instruction applies.
- **Effects require comparison.** An observed run shows what the agent did, but not what it would have done without the instruction. The agent may already have the same information from its prior knowledge, the repository, or other instruction files.
- **Preventive effects are difficult to observe.** Instructions intended to prevent infrequent but costly failures may show little measurable benefit across ordinary runs.
- **Runs vary.** A small number of sessions may not be enough to distinguish an instruction's effect from normal variation.
- **Effects may be delayed.** Some consequences become visible only during review or later work.
- **Observations are dispersed.** The file is used across many agents and contributors, making it difficult to observe outcomes consistently.

## It depends on the setup


An instruction's effectiveness depends on the agent and model version, the harness, the repository, and the task. An instruction that influenced one model may be unnecessary for a newer version. An instruction that was accurate before a refactoring may become outdated afterward.

Evidence of effectiveness applies to a particular setup and should be revisited after significant model, tool, or repository changes.

## Consequences


- **Maintenance decisions rely on incomplete evidence.** When an instruction has no observable effect, it may be redundant, ignored, unclear, or irrelevant to the tasks observed. Each explanation suggests a different response--removing, revising, or retaining the instruction--but the available evidence may not distinguish between them.
- **Content accumulates.** Without evidence of effectiveness, retaining instructions may seem safer than removing them, so the file grows.
- **The effect of revisions remains uncertain.** Without behavioral comparisons, it is difficult to determine whether rewriting or reorganizing the file improved agent performance.

## Directions for a response


Several practices can reduce this uncertainty:

- **Treat instructions as hypotheses.** For each addition, record the behavior it is intended to change and how that change could be observed (see [Make one change with its reason]({{< ref "ai-engineering/agents/ade/agents-md/build-protocol" >}}#make-one-change-with-its-reason)).
- **Prefer enforceable rules.** When possible, encode requirements in lint rules, tests, or CI checks that detect violations automatically ([Prefer enforcement over prose]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#prefer-enforcement-over-prose)). For instructions that cannot be enforced mechanically, identify observable evidence of compliance, such as commands executed or files changed.
- **Use static checks for verifiable properties.** Check references, file length, and detectable stale or duplicate content. Do not treat passing static checks as evidence that instructions improve agent behavior.
- **Evaluate agents on representative tasks.** When a change warrants the effort, compare agent outcomes with and without the relevant instructions (see [Studying improvements]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/coding-agent-experimentation-primer" >}})).
- **Reevaluate after significant setup changes**, especially model or tool upgrades.

The [research agenda]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/coding-agent-research-questions" >}}) identifies questions that still require evidence. [RQ1]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/coding-agent-research-questions" >}}#rq1-when-does-an-agentsmd-file-improve-results) examines when `AGENTS.md` improves agent outcomes, and [RQ7]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/coding-agent-research-questions" >}}#rq7-how-should-instructions-be-maintained-and-removed) examines what evidence should guide instruction revisions and removals.
