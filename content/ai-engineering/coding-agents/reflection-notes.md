---
draft: false
toc: true
title: "Reflection Notes"
linkTitle: "Reflection Notes"
---
# Goals


checklist; advides list; practices; like what in the refactoring.io

checklist for beginners

how to understand that these will be useful

# Different types of systems


is this difference essential for our workflow and configuration?

# Principles

### Vague problems and premature coding


Sometimes problem is vague or complex so detailed implementation plans the coding agents love to produce ahead of time is moving us in the wrong direction. The main problems is: first to understand that we don't have enough information to make a decision. The second is framing the problem itself.

For the first problem (understanding where you are) I'm use the 'alignment and based principle' -

My main approach here is to isolate and first try to frame the problem in the isolated setting.

so the solution here is PoC and isolated experiments. As usually we could bring here common SDLC practices. The guiding principle in the understanding the plan has redundant details is to ask yourself - what and how this detail help us to implement and guarantee the MVP invariants and requirements.

### Overengineering


Codex and other agents relly like to overengineer code as well as conceptual model. it could propose 20 fields and a whole subsystem with very complex logic to operate on them, when it's enough a structrure with 2 fields. And the simple phrase in agents.md "don't overengineer" doesn't' really help. Solution: varous guardrails - principles of software engineering, minimalism, step by step, cross-review with adversarial agent. but the main is principles

I started be really glad when I see Bob is deleting the code, not adding one.

# Planning and Designing, Decisions


so, we could decide on different steps

create plan - discuss it (but there the problem you cannot have all information)

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

also there are foundational engineering principles based on which we can build and refactor our system: modularity, abstraction, ...

To work with idiosyncrasy in an agent-ready target system, treat every deviation from common practice as an architectural cost that should be justified, documented, or removed.

# Initial scaffold


python: uv, ... link to the:

# Context Management


[[ai-engineering/coding-agents/agents.md]]

# Documentation

#todo reformulate

the problem of misalignment of docs and code is really harsh here. Why: because we're moving very fast. Sometimes old (non aligned) documents are such misleading that the agent is really going in the wrong direction. =>

- balance: create a minimal set of canonical docs, runbooks which is useful for agent to quickly understand your current work and be easy to support aligning with current project state
- adrs, evergreen mvp documentation to get the agent (and you) the direction and hard base to work. for example in the mvp for docforge I set the main (link)
- logs: use workstreams/md documents to plan and fix your work
- handoffs between session (use one default handoff documents)

# Reflection and Improvement


regularly use some note to fix reflection,

procedure to experimentation?

how to use reflection? procedures, schedule, ...
