---
draft: false
toc: true
title: "Coding-Agent Reflection Notes"
description: "Working observations on agent overengineering, uncertainty, conventional architecture, provisional planning, canonical documentation, and recoverable workstreams, with open questions about reflection and experimentation."
linkTitle: "Coding-Agent Reflection Notes"
---
# Goals


checklist; advides list; practices; like what in the refactoring.io

checklist for beginners

how to understand that these will be useful

# Different types of systems


is this difference essential for the workflow and configuration?

# Principles

### Vague problems and premature coding


When a problem is vague or complex, detailed implementation plans can create premature commitment. The first task is to recognize insufficient information; the second is to frame the problem.

Isolate the uncertain part and use a proof of concept or a focused experiment to clarify it. Plan details are useful when they help implement or verify the MVP requirements and invariants.

## Overengineering


Codex and other agents relly like to overengineer code as well as conceptual model. it could propose 20 fields and a whole subsystem with very complex logic to operate on them, when it's enough a structrure with 2 fields. And the simple phrase in agents.md "don't overengineer" doesn't' really help. Solution: varous guardrails - principles of software engineering, minimalism, step by step, cross-review with adversarial agent. but the main is principles

Deleting unnecessary code can be a better outcome than adding more implementation.

# Planning and Designing, Decisions


The workflow can separate the following steps:

create a provisional plan -> discuss it -> revise as missing information becomes available

or create several worktrees and compare the code and it's actual work and then ... (kind of POC)

# Agent Features


differences with humans - agents don't have long-memory, so every time they start from 0. -> long memory + quick introduction + (what else)

### Context overflow


use handoff and plans

### They have imperfect uncertainty calibration


Agents often do not naturally say "I am unsure." They may confidently choose a path when the codebase contains conflicting signals.

**Risk:**

The agent makes a migration, changes an API, or deletes code based on an assumption.

### They do not inherently know what is safe to change


Humans know which files are sensitive. Agents do not.

### They imitate nearby patterns, even bad ones


Agents often follow local code style. Usually good, but dangerous if old code is deprecated.

others in [[ai-engineering/coding-agents/agents.md#Assumptions and Useful facts]]

# Workflow and ...


augment, not replace

for investigation and understanding

# harness


how to build and use 'agents.md' mechanism

# Favor Conventionality and Diagnose Deviations


Architecture of the Target System

{{< callout context="note" title="**Principle of Least Astonishment**" icon="outline/info-circle" >}}
Agent-ready systems should minimize architectural and procedural surprise.
{{< /callout >}}

-> The target system should be predictable to a competent newcomer.

The target system should favor conventional and predictable design. Its structure, naming, tooling, testing strategy, and architectural boundaries should follow patterns that are familiar to a competent software engineer encountering the project for the first time. Since coding agents are trained largely on conventional software projects, they can be regarded as having similar expectations about project organization and development workflows. This does not require the system to be generic or simplistic; rather, local conventions and architectural choices should be easy to infer, consistent across the codebase, and aligned with common software engineering practice. In the sense, agent-ready systems should follow the .

Foundational engineering principles such as modularity and abstraction guide system construction and refactoring.

To work with idiosyncrasy in an agent-ready target system, treat every deviation from common practice as an architectural cost that should be justified, documented, or removed.

# Initial scaffold


python: uv, ... link to the:

# Context Management


[[ai-engineering/coding-agents/agents.md]]

# Documentation

#todo reformulate

Rapid development can leave documentation inconsistent with code. Stale documents can misdirect an agent, so documentation needs explicit maintenance:

- Maintain a minimal set of canonical documents and runbooks that help an agent understand current work and remain easy to align with the project state.
- Record consequential decisions in ADRs and keep MVP documentation current to give both maintainers and agents a stable basis for decisions.
- Use workstream logs to record plans, evidence, decisions, and completed work.
- handoffs between session (use one default handoff documents)

# Reflection and Improvement


regularly use some note to fix reflection,

procedure to experimentation?

how to use reflection? procedures, schedule, ...
