---
draft: false
toc: true
title: "Coordination Mechanisms Between People and Agents"
description: "Five ways people and agents keep their work coordinated in a project: progressive disclosure, a source-of-truth hierarchy, guidance and mechanical enforcement, decision ownership and escalation, and continuity across sessions and tools."
linkTitle: "Coordination"
---

This note holds the coordination mechanisms from step 7 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}). The rest of step 7, the participants (people and agents), the substrates they work in, and the processes they run, is in [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}). The mechanisms below describe how the participants keep their work coordinated through the [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}) and `AGENTS.md`.

## Five Coordination Mechanisms


1. **Progressive Disclosure (Routing vs. Content):** `AGENTS.md` stays a short, always-loaded map; detailed domain knowledge, runbooks, and contracts load only when the task type needs them.
2. **Epistemic Authority (Source-of-Truth Hierarchy):** Explicit rules for which source wins when files disagree (e.g., `docs/evergreen/` > code/historical notes; project `docs/` > shared `agent-docs/`), plus distinguishing *current code behavior* from *intended product behavior*.
3. **Feedforward Guidance vs. Mechanical Enforcement:** Short prose in `AGENTS.md` steers local defaults on the first attempt; permissions, hooks, structural checks, and tests enforce mandatory rules and provide recovery instructions in their failure messages.
4. **Decision Ownership & Escalation Boundaries:** Clear separation between routine execution choices (agent-owned) and product, architecture, contract, or high-risk operational choices (human-owned, requiring the agent to stop and present options).
5. **Cross-Session & Cross-Tool Continuity:** A single shared core (`AGENTS.md` + `Taskfile`) across agent tools, explicit task handoff artifacts (`plan.md`, `handoff.md`), and a rationale log for environment changes.
