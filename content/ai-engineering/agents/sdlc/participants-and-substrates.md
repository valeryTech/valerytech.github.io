---
draft: false
toc: true
title: "Participants and Substrates"
description: "Who takes part in engineering work with agents, described by four responsibilities, capability, authority, and accountability, and the layers (substrates) that hold shared state and enforce commitments."
linkTitle: "Participants and Substrates"
---

This note describes **who** works on a project with coding agents (participants) and **where** shared state, tools, and limits live (substrates). It started as step 7 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}) and was reworked in steps 14-16 and aligned with steps 28-36. How the participants coordinate is in [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}) (which replaced the earlier four nested loops from step 7) and [Coordination Mechanisms Between People and Agents]({{< ref "ai-engineering/agents/environment/coordination-mechanisms" >}}). The earlier step 7 loops, design-research notes, and drafts are kept in the appendices for comparison.

## Participants


A participant is a person, an agent, or an automated check that contributes to the work. Each task assigns four responsibilities among them:

- **Supply information:** provide the facts, intent, and unwritten context the task needs.
- **Do the work:** produce the result, such as a code change, a finding, or a brief.
- **Judge the result:** check whether the result is right, and state what the check covered.
- **Commit the result:** accept it into shared work (such as merging a pull request) or authorize an effect outside the workspace (such as deploying or running a migration).

A handoff moves one of these responsibilities to another participant. One person often holds several roles -- on a small team, the engineer steering the session may also be the reviewer and the owner -- and keeping the roles distinct makes clear which responsibility is being exercised at each step.

### Capability, Authority, and Accountability


Three properties decide who can hold a responsibility:

- **Capability** is what a participant can do. It depends on the participant, the task, and the available context.
- **Authority** is what a participant may do. The system grants it and enforces it through permission settings, branch protection, required reviews, CI gates, and deploy gates (the [authority layer](#substrates)).
- **Accountability** is who answers for the result. It always stays with a person. An agent may hold permission to commit routine changes, and the person who granted that permission or started the session answers for what it commits.

Work goes to an agent by capability. Decisions go by authority, consequence, and how checkable the result is.

### Roles


People hold roles in the project. An agent role is a model combined with its [Agent Customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}) (instructions, skills, tools, policies, and triggers) and its access to the project environment, so the same model can fill different roles.

| Role | Supplies information | Does the work | Judges | Commits |
| :--- | :--- | :--- | :--- | :--- |
| **Engineer working with the agent** | The task, its context, and corrections during the session | Directs the agent and does part of the work | The agent's output, as the first check | Routine choices within the agreed design, and opening the change for review |
| **Intent or product owner** | The problem, the intent, and priorities | -- | Whether the result meets the intent | Scope and product decisions |
| **System or architecture owner** | Constraints and design context | -- | Design trade-offs and risks | Architecture decisions, contract changes, and accepting risk |
| **Reviewer** | -- | -- | The change and its evidence | Merge |
| **Environment maintainer** | How the environment is meant to work | Changes to the ADE, customization, and `AGENTS.md` | Proposals from the upkeep agent | Changes to the ADE, customization, and `AGENTS.md` |
| **Domain expert or user** | Observations and unwritten context | -- | Whether the result fits real use | -- |
| **Collaborator agent** | Findings from code, docs, logs, and the running app | Framing, investigation, design, and implementation | Its own work, as a first check | Routine local choices within its permissions |
| **Independent checker agent** | -- | -- | The change, from its own context and evidence | -- |
| **Upkeep agent** | Drift and repeated mistakes it detects | Small maintenance fixes, proposed as changes | -- | -- |
| **Automated checks** | Check output | -- | Specific properties, such as behavior, types, structure, and style | Can block a merge, as a gate that people set up |

Key distinctions in the table:

- **Judging and committing are separate.** Agents and automated checks can judge; committing a merge or production effect stays with a person who holds authority.
- **Automated checks are participants that judge.** Compilers, tests, linters, structural checks, and CI check specific properties quickly and repeatably; claims about the running system go to the app and its logs; intent and trade-offs go to the owning person.
- **A check is independent only when its failures don't share a cause with the author's.** An independent checker agent needs a fresh context, different evidence, or a different model from the agent that wrote the change ([Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}})).
- **Someone has to keep learning from doing the work.** If agents write all the code, people lose their grasp of the system -- the comprehension debt described in [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}).

### Autonomy and Triggers for Agent Roles


An agent role's autonomy is set per type of action. Noticing a problem, deciding to act, acting, and holding authority to commit are separate steps. Between doing nothing and acting freely sit five levels: **observe**, **suggest**, **prepare** a result for someone else to apply, **act after approval**, and **act and report** ([Task Types: Delegation Profiles]({{< ref "ai-engineering/agents/sdlc/task-types" >}}#delegation-profiles)). Harness `allow / ask / deny` rules enforce only the boundary around tool execution; observing, suggesting, and preparing come from the role's instructions and write scope.

Each agent role also needs a trigger rule: what starts it, what its scope is, and when it stops and asks.

Higher autonomy fits when the role has a track record on the task type, checks catch mistakes reliably, the action is easy to undo, and the needed context is written down. Lower autonomy fits when mistakes are costly, the goal is ambiguous, the situation is new, context is unwritten, or results are hard to check. An agent's own confidence never raises the level. Levels move up or down with evidence -- open about method, strict about consequences ([Bottom Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}})).

Sources: [Collaborative-System Design Practices]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}) and [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices-comments" >}}); [Augmenting Human Work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}).

### Open Questions About Participants


- Which autonomy levels and triggers each agent role needs in practice (to be tested on real tasks).
- Where the accountable person is recorded when an agent commits routine work directly.

## Substrates


The substrates are the layers the participants work in. Their main job is to hold shared state outside any participant's memory and enforce limits that don't depend on an agent following prose instructions. An agent's context window is only a temporary view of shared state; when the session ends, anything not written into the substrates is gone.

Steps 28-36 of the Reasoning Log refined the earlier three-part split (runtime, ADE, and authority layer) into five distinct layers, summarized together in [What a Team Can Change Around an Agent Session]({{< ref "ai-engineering/agents/customization/what-can-change" >}}):

- **Agent harness (runtime):** the software that runs the session loop, connects to the model and tools, manages context, and lets people watch, steer, and interrupt the agent's work ([Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}})).
- **Agent customization:** the instructions, skills, harness settings, hooks, agent roles, and runnable workflows that turn a general harness into the team's agents across projects ([Agent Customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}})).
- **Agent Development Environment (ADE):** what the project gives every participant -- the code, [Project Knowledge]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}) and task state, written working practices and workflows, [commands]({{< ref "ai-engineering/agents/environment/command-layer" >}}) and tools, checks, repository settings, and setup definitions ([Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}})).
- **Execution environment:** the machine or container where one session runs, holding the workspace, the running application and its local data/logs, sandbox isolation, and active credentials, prepared from the ADE's setup definitions ([Where Coding Agents Run]({{< ref "ai-engineering/agents/environment/where-agents-run" >}})).
- **Authority layer:** the enforcement points across the harness, repository, CI, and deployment systems -- permission rules, sandbox limits, branch protection, required reviews, CI gates, and deploy rights -- that decide who may commit shared changes or trigger external effects.

### Lasting Knowledge and Task State


Within the ADE, the project keeps two kinds of written state with different lifetimes ([Project Knowledge]({{< ref "ai-engineering/agents/environment/project-knowledge" >}})):

- **Lasting knowledge** (`AGENTS.md`, product and architecture docs, contracts, decision records) outlives any single task and guides future sessions. Because both people and upkeep agents can propose edits to lasting knowledge, changes record who wrote and approved them.
- **Task state** (the brief, `plan.md`, `handoff.md`, open questions, standing session instructions such as "ask before changing scope", and decisions made mid-task) belongs to one task and changes constantly. Chat transcripts are not reliable task state. When a task finishes, anything later tasks will need moves from task state into lasting knowledge.

### Contributions, Effects, and Commitment Points


A **commitment point** is any point where work becomes shared or causes an effect outside the workspace:

- **Accepting a contribution into shared work** (such as merging a pull request, or editing `AGENTS.md` and CI rules that every later session runs under) can usually be undone by reverting, though other work may build on it meanwhile.
- **Authorizing an external effect** (such as deploying, running a data migration, changing infrastructure, or sending messages to outside systems) often cannot be undone. Drafting a migration and executing it are distinct states.

Workflows can stay flexible about how an agent investigates or drafts inside its workspace while keeping strict human and mechanical gates at commitment points. Note that the current model does not yet specify who owns time, token, and compute budgets across sessions.

Sources: [Programmable Environments for Human-AI Collaboration]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}); [Collaborative-System Design Practices]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}); [Joint Activity and Collaboration Model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) and [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}); [Human-AI Collaboration Evaluation]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}).

---

## Appendix: Earlier Process Loops and Design-Research Notes

### Processes: Four Nested Loops (Step 7)


This was the step 7 description of processes before step 18 replaced it with the ten derived processes in [Processes]({{< ref "ai-engineering/agents/sdlc/processes" >}}):

1. **Framing & Specifying Loop:** Connecting a problem to a brief, investigation question, or design before committing to implementation.
2. **Session Execution Loop (Inner Loop):** Orienting via `AGENTS.md` \(\rightarrow\) gathering context from authoritative sources or the running app \(\rightarrow\) acting/testing \(\rightarrow\) self-correcting from check output \(\rightarrow\) escalating open decisions or saving state (`plan.md`) for the next session.
3. **Verification & Review Loop (Middle Loop):** Evaluating the output and its evidence against baseline checks and acceptance criteria; routing back to *Investigation* or *Design* when an assumption fails.
4. **Environment & Knowledge Maintenance Loop (Outer Loop):** Observing recurring mistakes, friction, or drift across sessions and updating the ADE, docs, checks, or `AGENTS.md`.

### Findings from the Design Research


The [design research collection]({{< ref "ai/design-research/00-index" >}}) contains notes on human-AI collaboration reviewed in step 13 of the Reasoning Log ([02-human-ai-collaboration]({{< ref "ai/design-research/02-human-ai-collaboration" >}}), [collab-and-joint-work]({{< ref "ai/design-research/collab-and-joint-work" >}}), [Participant Profiles and Work Allocation]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}), and [Human-AI Collaboration Evaluation]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}})). Most of that material comes from exploratory syntheses to be tested against cases.

- **Applied in [Participants](#participants) (Findings 1-3):**
	1. Separating roles into the four responsibilities (supply information, do work, judge, commit) and separating capability, authority, and accountability.
	2. Counting automated checks among judging participants, and defining independence as non-overlapping failure causes.
	3. Setting autonomy per action type (`observe`, `suggest`, `prepare`, `act after approval`, `act and report`) with explicit initiative triggers.
- **Applied in [Substrates](#substrates) (Findings 4-6):**
	4. Separating shared contributions from irreversible external effects at explicit commitment points enforced by an authority layer.
	5. Separating task state from lasting knowledge, with provenance on shared artifacts.
	6. Including observability and human steering in the runtime.
- **Reflected in [Processes]({{< ref "ai-engineering/agents/sdlc/processes" >}}) and [Coordination Mechanisms]({{< ref "ai-engineering/agents/environment/coordination-mechanisms" >}}) (Findings 7-10):**
	7. Collaboration modes (elicit, delegate, propose and review, critique, reason together) and explicit transitions (handoff vs. escalation, takeover, return of control).
	8. Designing human involvement around real decision points (intent, trade-offs, commitments, ambiguity, exceptions, residual risk, policy) with readable review scope so approval doesn't degrade into rubber-stamping.
	9. Treating common ground as verified shared understanding (agent restates goal/assumptions; human confirms) rather than assuming a shared file guarantees alignment.
	10. Testing the human-agent pair directly (e.g., planted defects, missing context, mid-session constraint changes, or handoff-only continuation).

### Earlier Version of Participants and Substrates (Step 7)


- **Active Participants (Step 7):**
	- *People:* Intent/Product Owner, System/Architecture Owner, Reviewer, Environment Maintainer.
	- *Agents:* Collaborator/Executor, Independent Checker/Reviewer, Upkeep/Cleanup Agent.
- **Substrates (Step 7):**
	- *Agent Runtime / Harness:* Model, loop, tool execution, context/memory management, mechanical permissions (`allow / ask / deny`).
	- *ADE & Repository:* Subject system (code, schemas, data, running app), Knowledge layer (`AGENTS.md`, docs, contracts, ADRs, `tasks/<id>/`), and Command & control layer (`Taskfile`, scripts, tests, linters, hooks, CI).
