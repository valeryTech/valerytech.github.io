---
draft: false
toc: true
title: "Coding-Agent Reflection Notes"
description: "Use focused experiments before committing to a design; counter agent overengineering with conventional architecture, canonical documents, and workstream notes that survive session changes."
linkTitle: "Coding-Agent Reflection Notes"
---
# Goals


Develop a checklist, advice, and practices, similar to those in refactoring.io.

Include a checklist for beginners.

Open question: how can the usefulness of these materials be assessed?

# Different types of systems


Open question: do differences between system types require different workflows and configurations?

# Principles

### Vague problems and premature coding


When a problem is vague or complex, detailed implementation plans can create premature commitment. The first task is to recognize insufficient information; the second is to frame the problem.

Isolate the uncertain part and use a proof of concept or a focused experiment to clarify it. Plan details are useful when they help implement or verify the MVP requirements and invariants.

## Overengineering


Codex and other agents often overengineer both code and conceptual models. An agent might propose 20 fields and a subsystem with complex logic when a structure with 2 fields would be enough. A simple instruction in agents.md, "don't overengineer," does not seem to help much. Possible guardrails include software engineering principles, minimalism, step-by-step work, and cross-review by an adversarial agent. Engineering principles are the main safeguard.

Deleting unnecessary code can be a better outcome than adding more implementation.

# Planning and Designing, Decisions


The workflow can separate the following steps:

create a provisional plan -> discuss it -> revise as missing information becomes available

Another option is to create several worktrees and compare the implementations and their actual behavior, as in a proof of concept. The next step remains to be defined.

# Agent Features


Working assumption: unlike humans, agents lack long-term memory and start from 0 each time. Possible support: long-term memory and a quick introduction. Open question: what else is needed?

### Context overflow


Use handoff notes and plans.

### They have imperfect uncertainty calibration


Agents often do not naturally say "I am unsure." They may confidently choose a path when the codebase contains conflicting signals.

**Risk:**

The agent makes a migration, changes an API, or deletes code based on an assumption.

### They do not inherently know what is safe to change


Humans know which files are sensitive. Agents do not.

### They imitate nearby patterns, even bad ones


Agents often follow local code style. Usually good, but dangerous if old code is deprecated.

others in [Agents Md]({{< ref "ai-engineering/coding-agents/agents-md/agents-md" >}}#assumptions)

# Workflow and ...


Use agents to augment human work rather than replace it, especially for investigation and understanding.

# harness


Open question: how should the 'agents.md' mechanism be built and used?

# Favor Conventionality and Diagnose Deviations


Architecture of the Target System

{{< callout context="note" title="**Principle of Least Astonishment**" icon="outline/info-circle" >}}
Agent-ready systems should minimize architectural and procedural surprise.

The target system should be predictable to a competent newcomer.
{{< /callout >}}


The target system should favor conventional and predictable design. Its structure, naming, tooling, testing strategy, and architectural boundaries should follow patterns that are familiar to a competent software engineer encountering the project for the first time. Since coding agents are trained largely on conventional software projects, they can be regarded as having similar expectations about project organization and development workflows. This does not require the system to be generic or simplistic; rather, local conventions and architectural choices should be easy to infer, consistent across the codebase, and aligned with common software engineering practice. #todo Complete the unfinished reference to the principle agent-ready systems should follow.

Foundational engineering principles such as modularity and abstraction guide system construction and refactoring.

To work with idiosyncrasy in an agent-ready target system, treat every deviation from common practice as an architectural cost that should be justified, documented, or removed.

# Initial scaffold


Python scaffold: uv. #todo Add the remaining tools and the intended reference link.

# Context Management


[Agents Md]({{< ref "ai-engineering/coding-agents/agents-md/agents-md" >}})

# Documentation

#todo reformulate

Rapid development can leave documentation inconsistent with code. Stale documents can misdirect an agent, so documentation needs explicit maintenance:

- Maintain a minimal set of canonical documents and runbooks that help an agent understand current work and remain easy to align with the project state.
- Record consequential decisions in ADRs and keep MVP documentation current to give both maintainers and agents a stable basis for decisions.
- Use workstream logs to record plans, evidence, decisions, and completed work.
- Use one default handoff document between sessions.

# Reflection and Improvement


Record reflections regularly in a dedicated note.

Open questions:

- What procedure should guide experimentation?
- How should reflection work in practice: procedures, schedule, and other details?
