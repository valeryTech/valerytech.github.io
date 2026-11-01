---
draft: false
toc: true
title: "Participants, Substrates, and Processes"
description: "Who works on a project with agents, described by four responsibilities, the substrates they work in, and the four nested loops they run, with findings from the design research on human-AI collaboration."
linkTitle: "Participants and Processes"
---

This note was extracted from step 7 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}), which models the domain around `AGENTS.md`. It describes who works on a project (participants), the environment they work in (substrates), and the processes they run. The [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}) describes the environment in more detail, and [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}) describes the other cycles of engineering work. How the participants coordinate their work is in a separate note, [Coordination Mechanisms Between People and Agents]({{< ref "ai-engineering/agents/environment/coordination-mechanisms" >}}). [Findings from the Design Research](#findings-from-the-design-research) collects ideas from the design research notes on human-AI collaboration that could change this model.

## Participants


A participant is a person, an agent, or an automated check that contributes to the work. Each task assigns four responsibilities among the participants:

- **Supply information:** provide the facts, intent, and unwritten context the task needs.
- **Do the work:** produce the result, such as a change, a finding, or a brief.
- **Judge the result:** check whether the result is right, and say what the check covered.
- **Commit the result:** accept it into shared work, such as merging a change, or authorize an effect outside the workspace, such as a deploy.

A handoff moves one of these responsibilities to another participant. One participant can hold several of them, and one person often holds several roles: in a small team, the engineer working with the agent may also be the reviewer and the owner. The roles keep the responsibilities apart, so it's clear which one a person is exercising at a given point.

### Capability, Authority, and Accountability


Three properties decide who can hold a responsibility:

- **Capability** is what a participant can do. It belongs to the participant and depends on the task and on the context the participant has.
- **Authority** is what a participant may do. The system grants it, and the substrates enforce it through harness permissions, branch protection and required reviews, CI gates, and deploy gates (the [authority layer](#substrates)).
- **Accountability** is who answers for the result. It always stays with a person. An agent can hold a permission to commit some results, but the person who granted the permission or started the session answers for what the agent commits.

Work can go to an agent by capability. Decisions go by authority, by consequence, and by how well the result can be checked.

### Roles


People hold roles in the project. An agent role is a model together with its harness configuration (its tools, its permissions, and what starts it) and its access to the ADE, so the same model can fill several roles. The table describes each role by the responsibilities it holds.

| Role | Supplies information | Does the work | Judges | Commits |
| :--- | :--- | :--- | :--- | :--- |
| **Engineer working with the agent** | The task, its context, and corrections during the session | Directs the agent and does part of the work | The agent's output, as the first check | Routine choices within the agreed design, and opening the change for review |
| **Intent or product owner** | The problem, the intent, and priorities | -- | Whether the result meets the intent | Scope and product decisions |
| **System or architecture owner** | Constraints and design context | -- | Design trade-offs and risks | Architecture decisions, contract changes, and accepting risk |
| **Reviewer** | -- | -- | The change and its evidence | Merge |
| **Environment maintainer** | How the environment is meant to work | Changes to the ADE and `AGENTS.md` | Proposals from the upkeep agent | Changes to the ADE and `AGENTS.md` |
| **Domain expert or user** | Observations and unwritten context | -- | Whether the result fits real use | -- |
| **Collaborator agent** | Findings from code, docs, logs, and the running app | Framing, investigation, design, and implementation | Its own work, as a first check | Routine local choices within its permissions |
| **Independent checker agent** | -- | -- | The change, from its own context and evidence | -- |
| **Upkeep agent** | Drift and repeated mistakes it detects | Small maintenance fixes, proposed as changes | -- | -- |
| **Automated checks** | Check output | -- | Specific properties, such as behavior, types, structure, and style | Can block a merge, as a gate that people set up |

What the table shows:

- **The reviewer's two responsibilities are separate.** Judging can go to agents and automated checks as well as to people. Committing a merge stays with a person who holds merge authority.
- **People do part of the work.** The engineer working with the agent directs it during the session and is usually the first to judge its output.
- **Automated checks judge.** Compilers, tests, linters, structural checks, and CI live in the command and control layer of the substrates, but the work they do is judging. Each property needs its own judge: behavior goes to tests and CI, claims about the running system go to the app and its logs, and intent and trade-offs go to the person who owns them.
- **A check is independent when its failures don't share a cause with the author's.** An independent checker agent is independent only if it uses a different context, different evidence, or a different model from the agent that did the work. A second call to the same model with the same context can repeat the same mistake.
- **Someone has to keep learning from the work.** Besides the four responsibilities, a task can ask who needs to learn from doing it. If agents do all the implementation, the architecture owner can lose their understanding of the code, which is the comprehension debt described in [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}).

### Autonomy and Triggers for Agent Roles


An agent role's autonomy is set for each type of action it can take. Noticing a problem, deciding to act on it, acting, and holding the authority to act are four separate things: an agent can see that a migration looks unsafe without being allowed to change it. Between not acting and acting freely there are several steps: the agent can observe, suggest, prepare a result for a person to apply, act after a person approves, or act and report. The harness's allow, ask, and deny settings cover only the last of these steps. Observing, suggesting, and preparing come from the role's instructions and from where the agent may write.

An agent role also needs a rule for taking initiative: what starts it, what its scope is, and when it stops or asks. In the earlier version of the model, the upkeep agent had no trigger at all.

The level for a type of action depends on the action and on evidence. A higher level fits when the agent has shown it can do the action, checks would catch its mistakes, the action can be undone, and the context it needs is written down. A lower level fits when a mistake would be costly, the goal is ambiguous, the situation is new, the action depends on unwritten context, or the result is hard to check. An agent's reported confidence doesn't raise the level. These factors match the rule for scaling depth in [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}): consequence, uncertainty, and reversibility.

Levels change with evidence, in both directions. The framing of a task can set a different level for that task, and the maintenance loop changes the usual levels based on results. This follows the same split as the [commitment points](#contributions-effects-and-commitment-points) and sandbox-first capability discovery in the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}): open about method and strict about consequences.

Sources: [Collaborative-System Design Practices]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}), "2. Tool -> participant", "5. Design explicit initiative rules", and "6. Use progressive autonomy", and [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices-comments" >}}), "Initiative and authority need separate rules" and "Confidence and reversibility are insufficient by themselves"; [Augmenting Human Work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}), "Allocate work based on task properties" and "Proposed introduction into an existing organization".

### Open Questions About Participants


- Which levels and triggers each agent role needs. Real tasks should show this.
- Whether automated checks belong among the participants or stay in the substrates, since they appear in both.
- Where the accountable person is recorded for work an agent commits.

## Substrates


The substrates are the space the participants work in. Their main job is to hold the state that everyone relies on, apart from any participant's memory. An agent's context window is only one view of that state, and the view is gone when the session ends. Agents don't learn between sessions, so whatever the project learns has to be written into the substrates, which is what the maintenance loop does.

The substrates have three parts:

- **Agent runtime:** the model, its loop, its tools, and its context and memory. It also gives people a way to watch and steer the agent's work: to see what it's doing and why, to interrupt it, and to change a constraint while it works. The earlier version of the model left this out.
- **Agent Development Environment:** the subject system (code, data, and the running application), the knowledge the project keeps, and the commands and checks.
- **Authority layer:** the places where the system enforces who may commit what, such as harness permissions, branch protection, CI gates, and deploy gates. They're scattered across tools; treating them as one layer shows what they have in common.

### Lasting Knowledge and Task State


The project keeps two kinds of knowledge with different lifetimes. Lasting knowledge, such as `AGENTS.md`, docs, contracts, and decision records, outlives any one task, and every later session depends on it. Task state, such as the plan, the handoff, the decisions made during the task, the standing instructions people give ("ask me before changing scope"), and the open questions, belongs to one task and changes all the time. The earlier version of the model put both in one knowledge layer.

The chat history isn't task state: a decision that exists only in a transcript can't be relied on by the next session. When a task ends, what's worth keeping moves from task state into lasting knowledge. Because people and agents both edit lasting knowledge, who wrote and who approved each change becomes part of it.

### Contributions, Effects, and Commitment Points


Work becomes consequential at a few points. Accepting a contribution into shared work, such as merging a change, can be undone. Authorizing an effect outside the workspace, such as a deploy, a migration, or a sent message, may not be undoable. A proposed action and an executed action are also different states: a drafted migration hasn't changed any data yet.

A commitment point is a point where work becomes shared or has an effect outside the workspace. The earlier model named only the merge. Others are changes to `AGENTS.md` and CI, which every later session works in, changes to contracts that other systems rely on, migrations, deploys, and actions in outside systems. The rules for how participants work can stay open, while the rules at commitment points are strict. This is the same split as in sandbox-first capability discovery: open about method and strict about consequences.

The design research also lists boundaries a system design should make explicit, among them state, control, authority, effect, trust, time, provenance, and resources. This model covers provenance only partly, and it doesn't yet say who owns the budgets for time, tokens, and compute.

Sources: [Programmable Environments for Human-AI Collaboration]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}), "Executive summary" and "Architectural synthesis and research agenda"; [Collaborative-System Design Practices]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}), "1. Interaction -> collaboration" and "7. Preserve human steering"; [Joint Activity and Collaboration Model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}), "4. Stay mutually observable and directable", and [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}), "Review, acceptance, and authority"; [Human-AI Collaboration Evaluation]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}), "Cross-cutting collaboration audit".

## Processes: Four Nested Loops


These four loops are the description of the processes from step 7 of the Reasoning Log. [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}) derives the processes from the goals and from the features of the participants instead of starting from loops.

1. **Framing & Specifying Loop:** Connecting a problem to a brief, investigation question, or design before (or while) committing to implementation.
2. **Session Execution Loop (Inner Loop):** Orienting via `AGENTS.md` \(\rightarrow\) gathering context from authoritative sources or the running app \(\rightarrow\) acting/testing \(\rightarrow\) self-correcting from check output \(\rightarrow\) escalating open decisions or saving state (`plan.md`) for the next session.
3. **Verification & Review Loop (Middle Loop):** Evaluating the output and its evidence against baseline checks and the acceptance criteria of each activity. When implementation or review disproves an assumption, the loop routes back to *Investigation* or *Design*.
4. **Environment & Knowledge Maintenance Loop (Outer Loop):** Observing recurring mistakes, friction, or drift across sessions and updating the ADE, docs, checks, or `AGENTS.md`.

## Findings from the Design Research


The [design research collection]({{< ref "ai/design-research/00-index" >}}) has notes on human-AI collaboration that bear on this model. Three subagents read the notes in [02-human-ai-collaboration]({{< ref "ai/design-research/02-human-ai-collaboration" >}}) and the reading routes in [collab-and-joint-work]({{< ref "ai/design-research/collab-and-joint-work" >}}), including two notes the routes link to: [Participant Profiles and Work Allocation]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) and [Human-AI Collaboration Evaluation]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}). The comment files call most of this material unverified proposals from LLM conversations, so the findings are ideas to test. Findings 1 to 3 are applied in [Participants](#participants) and findings 4 to 6 in [Substrates](#substrates); the others aren't applied yet. Most of them point the same way: our roles combine doing the work with the authority to decide about it.

### Findings About Participants


1. **Each role combines four responsibilities.** A task assigns four things: who supplies information, who does the work, who judges the result, and who may commit it. A handoff moves one of them. The notes also separate what a participant can do (capability), what it may do (authority), and who answers for the result (accountability). Capability belongs to the participant, the system grants authority, and accountability stays with people. Work can go to an agent by capability, while decisions go by authority, consequence, and how well the result can be checked. Two more questions are who needs to learn from doing the work, such as an architecture owner who keeps an understanding of the code, and who supplies observations and unwritten context, such as a domain expert or a user.
   - *In our model:* the reviewer both judges and approves merges, the agent roles don't say what they may decide, and no participant supplies observations or unwritten context.
   - *Possible change:* describe each role by the four responsibilities, state that accountability stays with a person, and define an agent role as a model, its harness configuration, and its access to the ADE.
   - *Status:* applied in [Participants](#participants).
   - *Sources:* [Joint Activity and Collaboration Model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}), "The most important abstraction may be responsibility", and [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}), "Framework responsibility allocation"; [Participant Profiles and Work Allocation]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}), "4. Proposed changes to the participant-model dimensions", and [its comments]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation-comments" >}}), "Participant properties and assigned authority"; [Augmenting Human Work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}), "The deeper model"; [Programmable Environments for Human-AI Collaboration]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}), "Architectural synthesis and research agenda"; [Collaboration Patterns: A Research Synthesis]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}), "Executive summary".
2. **Checks are participants, and a check is independent when its failures differ from the author's.** Producing, checking, and deciding are separate jobs. Compilers, tests, static analysis, and sandbox runs do checking work. A check is independent when its failures don't share a cause with the author's, and a second call to the same model may not meet that condition.
   - *In our model:* tests and CI are listed as substrate, and the independent checker agent may run on the same model as the executor.
   - *Possible change:* count automated checks among the participants that judge, and match each property to a checker: behavior to tests and CI, claims about the running system to the app and its logs, and intent and trade-offs to the person who owns them. State what makes the checker agent independent: its context, its evidence, or its model.
   - *Status:* applied in [Participants](#participants).
   - *Sources:* [Augmenting Human Work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}), "Verification deserves its own subsystem"; [Participant Profiles and Work Allocation]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}), "4. Verification", and [its comments]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation-comments" >}}), "Profiles depend on tasks and conditions".
3. **Agents get a level of autonomy for each type of action, with a trigger.** Awareness, initiative, action, and authority are separate. Each type of action gets a level: observe, suggest, prepare, act with approval, or act and report. A rule for taking initiative states its trigger, its scope, and when to stop or ask. Autonomy grows in stages (shadow, assist, bounded delegation, supervised execution, conditional autonomy) only on measured results, and it can also be lowered. More autonomy fits when capability, the quality of checks, reversibility, and the completeness of context are high. Less fits when consequence, ambiguity, novelty, reliance on unwritten context, or difficulty of checking are high.
   - *In our model:* the runtime has only allow, ask, and deny, and no agent role says what starts it. The upkeep agent has no trigger.
   - *Possible change:* give each agent role a table of action types with a level and a trigger, record a task's autonomy level when the task is framed, and let the maintenance loop change the levels based on evidence.
   - *Status:* applied in [Autonomy and Triggers for Agent Roles](#autonomy-and-triggers-for-agent-roles).
   - *Sources:* [Collaborative-System Design Practices]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}), "2. Tool -> participant", "5. Design explicit initiative rules", and "6. Use progressive autonomy", and [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices-comments" >}}), "Initiative and authority need separate rules"; [Augmenting Human Work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}), "Allocate work based on task properties" and "Proposed introduction into an existing organization".

### Findings About Substrates


4. **Accepting a contribution differs from authorizing an effect.** Accepting a change into shared work and authorizing an action with effects outside the workspace are separate decisions. Shared work can be undone, and an outside effect may not be. A proposed action and an executed action should be clearly different states, and the right person should hold authority at the moment of commitment. The notes treat authority and effects as their own plane, apart from knowledge and from the record of work, and they advise stricter limits on commitments than on reasoning.
   - *In our model:* merge is the only commitment we name, although agents can change the running app and its data during a session. Authority is spread across harness permissions and CI.
   - *Possible change:* list the commitment points (merge, deploy, migrations and changes to shared data, edits to `AGENTS.md` and CI) with who authorizes each one and whether it can be undone. Add an authority layer to the substrates: harness permissions, branch protection, and merge and deploy gates. Keep the session loop light and put firm rules at these points.
   - *Status:* applied in [Contributions, Effects, and Commitment Points](#contributions-effects-and-commitment-points).
   - *Sources:* [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}), "Review, acceptance, and authority"; [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}), "Review and control"; [Human-AI Collaboration Evaluation]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}), "Cross-cutting collaboration audit" (commitment control and reversibility), and [its comments]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation-comments" >}}), "Awareness, directability, and recovery"; [Programmable Environments for Human-AI Collaboration]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}), "Executive summary".
5. **Task state and lasting knowledge are different, and both miss records.** Decisions, constraints, open questions, and standing instructions, such as "ask me before changing scope", should persist outside the chat history. Shared state must exist apart from any participant's memory; an agent's context window is one view of it. Storing state isn't the same as learning. The notes list boundaries a design should make explicit: state, control, authority, effect, trust, time, provenance, and resources. When people and agents edit one lasting artifact, they need limits on what each contributes, a history, and records of who changed and approved what.
   - *In our model:* the knowledge layer mixes lasting docs and ADRs with current work state (`plan.md`, `handoff.md`). There's no decision log, no place for standing instructions or open hypotheses, no record of who wrote or approved a change, and no budget.
   - *Possible change:* give task state its own layer with a decision log and standing instructions. Record who wrote and who approved each change to the knowledge layer, since both the environment maintainer and the upkeep agent edit `AGENTS.md`. Use the list of boundaries as a checklist for the substrates. State that agents don't learn between sessions, so the maintenance loop is how the system learns.
   - *Status:* applied in [Lasting Knowledge and Task State](#lasting-knowledge-and-task-state).
   - *Sources:* [Collaborative-System Design Practices]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}), "1. Interaction -> collaboration" and "7. Preserve human steering"; [its comments]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation-comments" >}}), "Grounding, common ground, persistence, and learning"; [Programmable Environments for Human-AI Collaboration]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}), "Architectural synthesis and research agenda"; [Human-AI Collaboration Patterns]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}), "The collaboration pattern catalog" (joint construction).
6. **People need to watch and steer the agent's work.** Each side needs to see what the other is doing and why, and needs to be able to redirect it.
   - *In our model:* the runtime lists only permissions, and the session loop is described from the agent's side.
   - *Possible change:* add a way to watch and steer to the runtime (the transcript, the plan, diffs, and interrupting), and a way for a person to step in during the session loop and for the agent to notice edits people make meanwhile.
   - *Status:* applied in [Substrates](#substrates); stepping in during the session loop belongs to the processes, which aren't reworked yet.
   - *Sources:* [Joint Activity and Collaboration Model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}), "4. Stay mutually observable and directable".

### Findings About Processes


7. **Collaboration modes work inside each loop, and transitions connect them.** The modes are elicit, delegate, propose and review, critique or coach, reason together, and build together. The transitions are handoff, escalation, takeover, and return of control. A transition needs a trigger, a reason, a summary of the state, open questions, clear authority afterward, and a way back. Escalation happens when authority, uncertainty, risk, or access blocks progress; a handoff is an ordinary transfer. One main risk is a person taking over after a long autonomous run without knowing what happened.
   - *In our model:* the loops are phases of work. The session loop puts escalation and saving state for the next session in one step and has no return of control.
   - *Possible change:* add the modes as a second axis: framing uses eliciting and reasoning together, the session loop uses delegation, and verification uses propose and review and critique. Separate escalation from handoff.
   - *Sources:* [Human-AI Collaboration Patterns]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}), "A first-principles model and the vocabulary practitioners actually use" and "The collaboration pattern catalog" (handoff and escalation), and [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}), "Later report taxonomy"; [Collaboration Patterns: A Research Synthesis]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}), "Executive summary".
8. **People decide at real decision points, and review needs conditions.** Reviewing every step makes a person a slow approver who leans on the agent's answer. People step in at decisions: intent, trade-off, commitment, ambiguity, exception, residual risk, and policy. For a decision with high stakes, the person forms a view before seeing the agent's recommendation. Approval turns into rubber-stamping when a diff is too large to read or requests for approval come too often.
   - *In our model:* the session loop escalates open decisions without naming kinds of decisions, and the verification loop assumes the reviewer can judge.
   - *Possible change:* use the seven decision points as categories of escalation, each with an owning role. Add conditions for review to the verification loop: a diff small enough to read, attached evidence, and enough context. Add keeping people's understanding of the system as a concern of the maintenance loop.
   - *Sources:* [Augmenting Human Work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}), "Human decision points should be designed as decision points"; [Human-AI Collaboration Patterns]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}), "The collaboration pattern catalog" (proposal and review) and "Choosing the right pattern".
9. **Shared documents don't make common ground, and investigation has its own loop.** Common ground is what participants understand the same way: terms, assumptions, the current state, and past decisions. Shared documents support it, but they don't show that both sides read them the same way. Work that aims at understanding follows its own loop: observe, organize the evidence, form a hypothesis, find gaps, and revise. The person decides what counts as evidence.
   - *In our model:* orienting with `AGENTS.md` is assumed to be enough, and investigation appears only as the place the verification loop routes back to.
   - *Possible change:* add a grounding step at framing and at the start of a session: the agent restates the goal, its assumptions, and its plan, and a person confirms or corrects them. Record decisions as agreed, rejected, deferred, or unresolved. Consider an investigation loop that records questions, hypotheses, and evidence in task state.
   - *Sources:* [Joint Activity and Collaboration Model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}), "2. Maintain common ground", and [its comments]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}), "Common ground and stored context"; [Sensemaking and Epistemic Action]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}), "Sensemaking".
10. **The collaboration itself can be tested.** Test the person and the agent as a pair: hide a fact they need, plant a plausible error, change a constraint during the run, or break a tool, and check whether they notice and recover. Runs with no planted error count needless rejections.
    - *In our model:* the maintenance loop watches for the agent's mistakes, but not for errors the reviewer misses or for too much trust.
    - *Possible change:* add periodic checks to the maintenance loop: a PR with a planted error, a brief with a missing fact, a constraint change during a session, and a fresh session that starts from `handoff.md` alone.
    - *Sources:* [Human-AI Collaboration Evaluation]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}), "Pattern-specific validation" and "Cross-cutting collaboration audit", and [its comments]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation-comments" >}}), "Study conditions and baselines".

### Findings About Coordination


Some sections are mainly about coordination and belong with [Coordination Mechanisms Between People and Agents]({{< ref "ai-engineering/agents/environment/coordination-mechanisms" >}}): the policy for taking initiative (act, propose, ask, yield, renegotiate) in [Augmenting Human Work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}), "Proposed introduction into an existing organization"; the sequence of alignment, grounding, coordination, observability, commitment, and repair in [Collaboration Patterns: A Research Synthesis]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}); [Joint Activity and Collaboration Model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}), "3. Coordinate the work"; [Collaborative-System Design Practices]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}), "3. Model the shared workspace"; and [Participant Profiles and Work Allocation]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}), "7. Escalation". They overlap the mechanisms on decision ownership and on continuity across sessions.

### What Was Ruled Out


The sections on languages and user interfaces, product examples, history, productivity studies, the method for checking a model's completeness, bibliographies, and notes about reorganizing the sources. None of the notes cover agents checking other agents.

## Appendix: Earlier Version of the Participants


This is the participants part of step 7 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}), before the participants were described by responsibility. It's kept for comparison.

- **Active Participants (Actors & Roles)**
  - **People:** *Intent/Product Owner* (sets problem, scope, product decisions), *System/Architecture Owner* (owns design trade-offs, invariants, risk boundaries), *Reviewer* (calibrates trust, verifies evidence, approves merges), *Environment Maintainer* (curates ADE and `AGENTS.md`).
  - **Agents (Software Assistants):** *Collaborator/Executor* (works on framing, investigation, design, or implementation), *Independent Checker/Reviewer* (evaluates work skeptically), *Upkeep/Cleanup Agent* (detects drift and proposes small maintenance fixes).

## Appendix: Earlier Version of the Substrates


This is the substrates part of step 7 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}), before task state, the authority layer, and the commitment points were added. It's kept for comparison.

- **Substrates (The Space They Work In)**
  - **Agent Runtime / Harness:** Model, loop, tool execution, context/memory management, mechanical permission enforcement (`allow / ask / deny`).
  - **Agent Development Environment (ADE) & Repository:**
    - *Subject system:* Source code, schemas, data, and the **running application** (services, DB, UI, logs, metrics).
    - *Knowledge layer:* `AGENTS.md`, canonical docs (`evergreen/`), product/design docs, feature contracts, ADRs, shared `agent-docs/`, task state (`tasks/<id>/`, `plan.md`, `handoff.md`).
    - *Command & control layer:* Named command catalog (`Taskfile`/`Makefile`), scripts, test suites, linters, structural checks, git hooks, CI.
