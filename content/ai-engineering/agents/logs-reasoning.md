---
draft: false
toc: true
title: "Reasoning Log: Modeling the Domain Around AGENTS.md"
description: "Step-by-step working notes on modeling the domain around AGENTS.md: workflows, goals, the approach, participants, where to start on a project, a minimal AGENTS.md, and how the environment, the agent customization, and the harness separate."
linkTitle: "Reasoning Log"
---

This log records how the model of the domain around `AGENTS.md` was built. [Reasoning steps](#reasoning-steps) keeps the detailed discussion in the order the thoughts came up, one numbered step per idea; new steps go after the last one. [Terms](#terms), at the end, gives short definitions of the main terms.

## Reasoning steps

### 1. Starting Point (User Notes)


> Where do we need to start? I don't think we should start by writing or reading rules, or by putting a set of rules into the `AGENTS.md` file. We have to start by understanding and structuring the broader picture. It's about modeling, conceptualizing, and deciding what to do first.
>
> So I think we could start with **goals** and **types of work**. They're related because a coding agent doesn't just write code or create text; it creates something, or it helps us and works with us on something.

#### Key premises from our discussion


1. **Do not start by listing rules for `AGENTS.md`.** Before deciding what lines go into an instruction file, we need to conceptualize the space: what we are trying to achieve, what kinds of work happen, who participates, what processes run, and how coordination works.
2. **Start with project, product, and human workflow goals--not abstract agent properties.** Concepts like *reliable autonomy* and *alignment with local reality* are technical characteristics on an **instrumental (agent-system) plane**. In a real project, the primary goals sit on the product and engineering plane: how people frame problems, reduce uncertainty, analyze trade-offs, make decisions, and deliver maintainable, dependable software.
3. **Start from how people actually use (and misuse) AI in engineering (SDLC) workflows.** When people introduce software assistants into existing workflows, the default failure mode is "generate code and accept it"--bypassing framing, investigation, and trade-off analysis. We need to design workflows and environments that counteract that failure mode.
4. **Define the core features of a good approach across all work--not just software architecture.** Explicit decision points, generating multiple options or hypotheses, analyzing trade-offs explicitly, separating facts from assumptions, and running targeted checks apply not only in system design, but also in bug resolution, investigation, product framing, implementation, and review.
5. **Hold "Types of Work" in a working space to test their usefulness.** Software assistants do not only produce code diffs; they also assist with product framing, investigation, diagnosis, system design, verification, and environment upkeep.

### 2. Critique of the Current Model in `agents-md-0.md`


In [agents-md-0.md]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}), the section **The system around the file** (lines 38-65) sketches a system view (*Participants*, *Processes*, *Goal*). Analyzing the full note against that sketch reveals four structural gaps:

1. **Plane 2 goals are presented as the primary goal.**
   - `agents-md-0.md` states: *"The goal is to increase the agent's reliable autonomy on project work."*
   - *Critique:* Reliable autonomy is a property of the agent setup (Plane 2), not the goal of the software project (Plane 1). If you optimize for autonomy without anchoring it in product value, system maintainability, and team comprehension ([project-ownership.md]({{< ref "ai-engineering/agents/project-ownership" >}})), an agent can autonomously produce working, test-passing code that solves the wrong problem, adds accidental complexity, or creates comprehension and intent debt.
2. **Implicit "code-change" bias despite mentioning other work.**
   - Lines 62-64 and 239 briefly note that work extends beyond code changes to *investigations, debugging, root-cause diagnoses, and design proposals*.
   - *Critique:* Almost every other section (*Three jobs*, *Premises*, *Baseline checks*, *Placement table*) implicitly assumes the task is **"write a code change that passes `make test` and linters and gets merged."** Non-code work has different sources of truth, different failure modes, and a different definition of "done."
3. **Participants mix active actors with passive substrates.**
   - `agents-md-0.md` lists four participants: *People, Agents, The repository, The harness*.
   - *Critique:* *People* and *Agents* are active actors that make decisions and take actions. *The repository* (and the wider Agent Development Environment in [ade.md]({{< ref "ai-engineering/agents/environment/ade" >}})) and *the harness* are the environment and runtime substrate they act within. Furthermore, `agents-md-0.md` uses "harness" in the wide sense (including tests, scripts, and CI), whereas [ade.md]({{< ref "ai-engineering/agents/environment/ade" >}}) separates the **Agent Harness** (tool runtime) from the **Agent Development Environment (ADE)** (repo structure, docs, commands, checks).
4. **Processes are flattened into three steps (`Session -> Review -> Maintenance`).**
   - *Critique:* This skips **Framing / Specifying** (how rough intent becomes a question, brief, contract, or plan before or across sessions) and treats a session as a single shot rather than an iterative loop that may move between investigation, design, and implementation across multiple sessions.

### 3. Plane 1 Deep Dive: Engineering Workflows and How People Use Assistants


Moved to [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}). That note covers what good engineering workflows do, how people short-circuit them with assistants ("generate and accept"), and how an assistant can help at each step of the lifecycle.

### 4. Goals: Two Distinct Planes


Moved to [Two Planes of Goals for Engineering Work with Assistants]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}). This step framed the problem as how assistants can help people carry out the whole engineering workflow without giving up understanding and ownership, and it split the goals into two planes. Plane 1 held five product, engineering, and workflow goals, which are primary. Plane 2 held four goals for the agent setup and the environment, which serve Plane 1, with reliable autonomy as their combined outcome. [Step 19](#19-reorganizing-the-two-planes-of-goals) reorganizes both planes; the note keeps this version in its appendix.

### 5. The Approach: Core Features of Deliberate Reasoning and Decision-Making


> *User note:* We need to introduce the features of a good approach: explicit decision points, considering different options, choosing between them, and explicitly considering trade-offs. This isn't only for software design. We also use these elements (explicit decisions and the analysis of several options or hypotheses) when we resolve bugs, search for something, or investigate.

Moved to [Features of a Good Approach to Engineering Work]({{< ref "ai-engineering/agents/sdlc/approach" >}}). This step defined the Approach as the reasoning and decision-making practice for any task: goals say why we work, activities say what we work on, and the Approach says how we work. It explained why assistants need it, listed seven features, and showed them in four kinds of work. [Step 12](#12-grouping-the-approachs-features-by-the-problem-solving-cycle) regroups the features by the problem-solving cycle.

### 6. Workflow Activities


Moved to [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}). This step first held six types of work in a holding space to test how well they structure the domain and how each one needs different context, tools, and acceptance criteria. The six turned out to be the activities of the engineering workflow. [Step 9](#9-workflow-activities-and-related-cycles) describes the comparison, and [step 10](#10-activities-phases-and-cycles-as-separate-notes) explains why the activities got their own note.

### 7. Participants, Substrates, Processes, and Coordination


Moved to [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}). This step separated the active participants (people and agents in their roles) from the substrates they work in (the agent runtime and the Agent Development Environment), described four nested loops of work, and listed five coordination mechanisms. The coordination mechanisms are in a separate note, [Coordination Mechanisms Between People and Agents]({{< ref "ai-engineering/agents/environment/coordination-mechanisms" >}}).

### 8. What This Means for Building `AGENTS.md`


When we view `AGENTS.md` through this domain model instead of starting from a list of rules:

- `AGENTS.md` is **not** a manual for coding; it is the **entry-point router and default-corrector** at the boundary between the *Agent Runtime* and the *Agent Development Environment*.
- Its three jobs (*Where to look*, *What differs here*, *What done means*) operationalize **the Approach** across **all activities**, not just coding:
  - *Where to look* routes to product briefs, architecture/ADRs, feature contracts, and diagnostic commands as well as build/test commands--so the agent checks authoritative sources instead of guessing.
  - *What differs here* corrects generic assumptions in investigation, design, and implementation alike, preventing single-path tunnel vision on local edge cases.
  - *What done means* pairs **baseline checks** (for code/config changes) with **decision-point and verification expectations** (separating observed facts from assumptions, comparing options/trade-offs when needed, escalating unowned decisions, and stating what was checked vs. left unchecked).

### 9. Workflow Activities and Related Cycles


The six types of work in step 6 match the six activities of the [engineering workflow]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) one for one. Framing, investigation, design, implementation, and verification and review have the same names in both lists. The sixth row, environment and knowledge upkeep, is part of the sixth activity: release, operation, and learning includes turning repeated mistakes into updated contracts, checks, commands, and `AGENTS.md` rules. The rows describe steps of the workflow, so they're activities, and the table moved out of the log. It's now in [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}). An activity can still be a task on its own, such as investigating an incident, so the same table covers both cases.

The comparison of the six cycles in the vault moved to [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}). This step reached four conclusions:

- The problem-solving cycle (frame, choose, act, and look back and learn) runs inside each activity.
- The activities split the project cycle into smaller steps. Step 10 revises this.
- The Problem and Response Cycle and the improvement cycle sit outside the activities.
- Environment upkeep is the look-back part of the problem-solving cycle, applied to the agent environment.

It left one open question, now tracked in Engineering Activities: the outputs table has no row for release and operation.

### 10. Activities, Phases, and Cycles as Separate Notes


The question was whether to reason about the workflow in terms of SDLC phases. Activities, phases, and cycles are three different ideas:

- An **activity** is a kind of work with its own output, context, and definition of done. A task given to an assistant is usually one activity, such as "investigate this" or "review this".
- A **phase** is a period in a project's life that ends with an objective or decision, such as an approved design or a release decision. The [Project Design and Delivery Cycle]({{< ref "ai-engineering/delivery/design-and-delivery" >}}) defines a phase as a grouping of related activities and lists five reference phases.
- A **cycle** is a pattern that repeats at one level: inside an activity, across a project, before a project, or on a running product.

Activities and phases look related because some share a name: the framing phase is mostly framing work. But one activity appears in several phases. Investigation happens during framing, during build, and during an incident in operation. Organizing by phases would describe each activity several times. So each activity is defined once, and the phases act as a timeline: a table shows which activities each phase uses most and what ends the phase. The phase sets how much evidence and care an activity needs at that point. This revises step 9, which treated the activities as smaller steps of the project cycle. It also fits [discovery-and-delivery.md]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}), which classifies work by its purpose and says the time it happens doesn't decide its kind.

Each activity also has two levels. The general definition holds in any project. A project's version names that project's sources of truth, commands, checks, owners, and local definition of done. The project's version lives in the project, and `AGENTS.md` routes the agent to it (step 8).

The result is three notes in `sdlc/`: [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) for the activities and phases, [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}) for the cycles, and [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) as the overview.

### 11. Building Workflows Bottom-Up from Real Tasks


Steps 6 to 10 define activities, phases, and cycles from the top down. The other direction is to build the workflow from experience: do real tasks in real projects, reflect on what happened, compare the cases, and generalize only what holds across them. Then look for optimizations: skills, commands, checks, or `AGENTS.md` lines that would have made the cases go better. This follows grounded theory, as the earlier [AI Project Foundation]({{< ref "projects/ai-dev-foundation/starter-kit-and-foundation" >}}) draft does, and the earlier Engineering Knowledge Loop note describes the same movement for engineering in general.

The unit of experience is a task, which brings in a level between activities and projects. A task type is a recurring kind of task that people give an assistant, such as fixing a bug, finding a root cause, investigating a problem, framing a ticket, implementing a feature, or refactoring. A task type combines several activities and has its own starting point, output, and definition of done. Task types are closer to what step 1 meant by "types of work"; the first list in step 6 held activities instead.

[Sandbox-First Capability Discovery]({{< ref "ai/design/workflow-design/sandbox-first-capability-discovery-llm-agents" >}}) adds the experimental side: start each task type with a minimal setup that limits consequences and leaves the method open, and keep only the added structure that proves its value against that baseline. This makes the features of the Approach (step 5, now in [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}})) hypotheses that the cases test.

The approach is now its own note: [Bottom-Up Approach to Building Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}). It has the candidate task types, the steps of the work, a draft case record, and related notes.

### 12. Grouping the Approach's Features by the Problem-Solving Cycle


The question was whether step 5 defines the features of a good approach for all work, beyond architecture. Step 5 says so and applies the features to four kinds of work, but it was the only place they were defined, and several parts still leaned toward design:

- The wording used design terms: requirements and invariants, trade-off criteria such as blast radius and rollback risk, and questioning unnecessary machinery.
- All the notes step 5 drew on were about review and design.
- Feature 6 joined working backward from the outcome, which is part of framing, with independent verification, which is part of looking back. Feature 7 joined revisiting decisions with scaling the depth of the work, which applies to every feature.
- No feature covered acting, and none covered recording what was learned, although the team's understanding is the second output of the [engineering workflow]({{< ref "ai-engineering/agents/sdlc/workflows" >}}).
- The table of examples had four columns that didn't match the six activities. Release was missing, design and implementation shared a column, and bug resolution is a task type (step 11).

The problem-solving cycle (step 9) is the most general structure in the vault, and it runs inside every activity. Grouping the features by its four parts gives each feature one place in the cycle and shows the gaps. The result is ten features and one rule:

- **Frame:** start from the outcome; separate what is known, what is assumed, and what is unknown.
- **Choose:** consider more than one option or explanation; compare the options against criteria that fit the situation; before committing, check the uncertainty that would change the choice; make the decision explicit and give it an owner.
- **Act:** act within the decision, in steps small enough to check and undo.
- **Look back and learn:** check the result independently of the explanation; when an assumption fails, revisit the decisions that depend on it; record what was learned where the next task will find it.
- **Across all parts:** scale the depth to the consequence, uncertainty, and reversibility of the work.

The old features 1 to 5 keep their meaning, in general wording. Old feature 6 became "start from the outcome" and "check independently", and old feature 7 became "revisit the decisions" and the rule about depth. Acting and recording are new. The design details became examples in a table with all six activities. Other vault notes state parts of the same idea in general terms, such as the problem-solving framework, [Discovery and Delivery]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}), and the enabling principles in [My Perspective on AI Engineering]({{< ref "ai-engineering/approach/my-perspective" >}}); they're now among the related notes. The features moved to their own note, [Features of a Good Approach to Engineering Work]({{< ref "ai-engineering/agents/sdlc/approach" >}}).

### 13. Ideas from the Design Research on Human-AI Collaboration


The question was whether the design research notes on human-AI collaboration could help the reasoning about participants and processes (step 7). Three subagents read [02-human-ai-collaboration]({{< ref "ai/design-research/02-human-ai-collaboration" >}}), the reading routes in [collab-and-joint-work]({{< ref "ai/design-research/collab-and-joint-work" >}}), and two notes the routes link to, on participant profiles and on evaluating collaboration. Most findings point the same way: our roles combine doing the work with the authority to decide about it. The main ideas are:

- **Participants:** a task assigns four responsibilities (supply information, do the work, judge the result, commit it), and accountability stays with people. Automated checks also judge, and a check is independent when its failures differ from the author's. Agents get a level of autonomy for each type of action, with a trigger.
- **Substrates:** accepting a change into shared work differs from authorizing an effect outside it, so merge isn't the only commitment point. Task state differs from lasting knowledge, and both lack records such as a decision log, standing instructions, and who wrote and approved a change. People need a way to watch and steer the agent's work.
- **Processes:** collaboration modes (such as delegate, propose and review, reason together) work inside each loop, and transitions (handoff, escalation, takeover, return of control) connect them. People decide at named decision points, and review needs conditions. Shared documents don't make common ground, investigation may need its own loop, and the collaboration itself can be tested.

The comment files call most of this material unverified proposals, so these are ideas to test, and none of them is applied yet. The findings, with their sources and the changes they suggest, are in [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#findings-from-the-design-research).

### 14. Describing Participants by Responsibility


Step 13 found that our roles combine doing the work with the authority to decide about it: the reviewer both judges a change and approves its merge, and the agent roles don't say what they may decide. The design research offers a way to separate these. A task assigns four responsibilities: supply information, do the work, judge the result, and commit it. Three properties decide who can hold each one: capability (what a participant can do), authority (what it may do, which the system grants and the substrates enforce), and accountability (who answers for the result, which always stays with a person).

Describing every role by these four responsibilities changes the list of participants:

- **The reviewer's two responsibilities come apart.** Judging can go to agents and automated checks; committing a merge stays with a person who holds merge authority.
- **Two kinds of people were missing.** The engineer working with the agent directs it during the session and judges its output first. A domain expert or a user supplies observations and unwritten context.
- **Automated checks become participants.** Tests, linters, structural checks, and CI do judging work, although they also belong to the substrates.
- **An agent role is a configuration.** It's a model, its harness configuration (tools, permissions, and what starts it), and its access to the ADE. A checker agent is independent only when its failures don't share a cause with the author's: a different context, different evidence, or a different model.
- **Learning is a separate question.** A task can also ask who needs to learn from doing it, so that people keep their understanding of the system.

The new version, with a table of roles against the four responsibilities, is in [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#participants); the earlier list is kept in its appendix. Autonomy levels and triggers for agent roles, the authority layer of the substrates, and the processes aren't reworked yet.

### 15. Autonomy and Triggers for Agent Roles


Step 14 left open how much each agent role may do on its own and what starts it; the upkeep agent had no trigger at all. The harness only offers allow, ask, and deny, which say whether an action may run but not whether the agent should notice something, suggest it, or prepare it for a person. The design research separates four things: noticing a problem, deciding to act on it, acting, and holding the authority to act. It sets autonomy for each type of action with five levels: observe, suggest, prepare, act with approval, and act and report.

Applied to our agent roles:

- **Each agent role gets a starting level for each type of action.** Reading and editing in its own branch are act and report for the collaborator agent; changing shared data needs approval; merging and deploying aren't allowed for any agent. The independent checker agent doesn't edit what it judges. The upkeep agent observes repeated failures and prepares fixes as pull requests.
- **Each agent role gets a rule for taking initiative:** a trigger, a scope, and when it stops or asks. The upkeep agent's trigger is a schedule or the same failure in several sessions or CI runs.
- **The level depends on the action and the evidence.** Capability, checks that would catch mistakes, reversibility, and written context raise it; consequence, ambiguity, novelty, unwritten context, and difficulty of checking lower it. This is the same rule as scaling depth in the Approach (step 12). Reported confidence doesn't raise it.
- **Levels change one step at a time, in both directions.** The framing of a task can set a different level for that task, and the maintenance loop changes the starting levels based on measured results.

The starting levels and triggers are proposals for the bottom-up cases (step 11) to test. They're in [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#autonomy-and-triggers-for-agent-roles).

### 16. What the Substrates Hold


Step 7 described the substrates as a list of parts. The design research suggests looking at what they're for: they hold the state everyone relies on, apart from any participant's memory. An agent's context window is only a view of that state, and agents don't learn between sessions, so what the project learns has to be written into the substrates. This view brings out three distinctions the earlier list didn't make:

- **Lasting knowledge and task state.** The knowledge layer mixed knowledge that outlives tasks (`AGENTS.md`, docs, contracts) with the state of one task (the plan, the handoff, its decisions and open questions). They have different lifetimes and change at different rates. A decision that exists only in a chat transcript isn't state the next session can rely on.
- **Contributions and effects.** Accepting a contribution into shared work can be undone; authorizing an effect outside the workspace may not be. The points where work becomes shared or consequential are commitment points, and the merge is only one of them.
- **Authority as its own layer.** Permissions, branch protection, CI gates, and deploy gates all enforce who may commit what. Seen together, they form an authority layer, where the rules are strict, while the rules for how participants work can stay open.

The runtime also needs a way for people to watch and steer the agent's work, which the earlier list left out. The revised section is in [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#substrates). It stays at the level of these distinctions; detailed structures, such as lists of commitment points and who authorizes each one, can wait until real tasks show which ones are needed.

### 17. Keeping the Analysis Conceptual


Step 15 turned the findings into detailed structures: tables of starting autonomy levels for each agent role and of what starts each role. That was early. At this stage the model needs its concepts and the distinctions between them; detailed structures should come from real tasks, as the bottom-up approach (step 11) describes. Step 16 already kept the substrates at the level of distinctions. The autonomy section is now cut back the same way: autonomy is set for each type of action, there are several steps between not acting and acting freely, each agent role needs a rule for taking initiative, and the level depends on consequence, reversibility, and evidence. The roles table from step 14 stays, because it's how the note shows the four responsibilities.

### 18. Goals of the Processes and Processes Derived from Them


Moved to [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}). This step didn't start from the four loops of step 7. It started from what we need to achieve: results that hold, understanding and ownership kept by people, cheap deliberate work, and a better next task. Then it looked at the features of people, agents, and automated checks that make those goals hard to reach, and derived nine processes from the places where a goal meets such a feature. The collaboration view describes the steps inside each process.

### 19. Reorganizing the Two Planes of Goals


The question was whether the two planes of step 4 still fit the model. Two problems came up.

Plane 1 was named for product, engineering, and workflow goals, but it had only one product goal: dependable production behavior. Solving the right problem wasn't a goal, although step 2 names solving the wrong problem as the main risk of optimizing the agent for its own sake. The five goals also mixed three kinds: product goals, engineering goals, and making deliberate work cheaper than the shortcut, which is a goal only because assistants are in the work.

Plane 2 described the agent alone: its alignment, its self-correction, its evidence, and its autonomy. Since then the model has three kinds of participants (step 14), substrates that hold the shared state (step 16), and processes derived from the goals and the features of the participants (step 18). Reliable autonomy as the combined outcome also conflicts with step 15, where autonomy is set for each type of action and changes with evidence.

The reorganized version:

- **Plane 1 has product goals and engineering goals.** The product goals are solving the right problem and behavior people can rely on. The engineering goals are results that hold, and understanding and ownership, which are the two outputs of the engineering workflow. Explicit decisions owned by people, and the links from intent to operation, are parts of the engineering goals.
- **Two conditions sit between the planes.** Cheap deliberate work and a better next task come from features of agents: generating is cheap, and agents remember nothing between sessions. These are the last two of the four goals in step 18.
- **Plane 2 says what the agent roles and the substrates give the participants for the processes to run.** It has six goals: the agent works from the project's reality, work can be checked as it's done and by someone else, people can see and steer the work, commitments go through the people who own them, task state lives outside any participant's memory, and the environment and autonomy change with evidence. Each one serves one or more of the processes of step 18, so Plane 2 is the third view of the processes that step 18 left open.
- **The combined outcome of Plane 2 becomes autonomy matched to evidence:** assistants do as much of the work as the evidence supports while the Plane 1 goals hold.

The new version and the earlier one are in [Two Planes of Goals for Engineering Work with Assistants]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}). It stays at the level of goals; what each goal needs from the environment can come from real tasks (step 11).

### 20. Reflecting on the Model So Far


Steps 1 to 19 built a model of the work from the top down: goals on two planes, the features of a good approach, activities, phases, and cycles, the participants and their responsibilities, autonomy, the substrates, the processes, and the coordination mechanisms. Step 8 said what `AGENTS.md` is for. None of it has been used yet. We haven't chosen a project, done a task with the model in mind, or recorded a case.

Looking back at how the model was built:

- **Most steps reworked an earlier step.** Step 12 regrouped the approach of step 5, steps 14 to 16 reworked the participants and substrates of step 7, step 18 stopped deriving the processes from the four loops, and step 19 reorganized the goals of step 4. Each rework made the model more consistent with itself, but consistency inside the model doesn't show that it helps on real tasks.
- **The model hasn't followed its own method.** Step 11 says to build the workflow from real tasks and keep only the structure that proves its value. Everything in steps 1 to 19 is structure that hasn't been tested yet. Step 17 caught one case of early structuring, but the concepts themselves are also untested.
- **The model is large.** If it went into `AGENTS.md` directly, it would become the long list of rules that step 1 said not to start with.

What the model is good for at this point:

- **Labels for cases.** Activities, task types, processes, and the features of the approach give names for what happens in a task and where it goes wrong (step 11).
- **Questions about a project's environment.** The Plane 2 goals ask what an agent can find, how work gets checked, what people can see, what is enforced, and where task state lives.
- **A way to place a fix.** When a task goes wrong, the model helps decide whether the fix belongs in `AGENTS.md`, a command, a check, a doc, the authority settings, or the workflow.

So the next step is to use the model on a project, and to stop refining the concepts until cases show a gap in them.

### 21. Where to Start with One Project


The starting point follows from the bottom-up approach (step 11) and from what `AGENTS.md` is for (step 8). `AGENTS.md` is one part of the environment, so the work on a project starts with the environment as it is, and the file grows from what the agent can't find or gets wrong.

1. **Choose one project and two or three task types.** The project should be active, with real tasks coming up, and someone who can judge the results should own it. Task types with different outputs show more, such as fixing a bug, investigating a question, and implementing a small feature.
2. **Survey the project's environment before writing anything.** The Plane 2 goals give the questions: where the sources of truth, conventions, and intent are, and whether an agent would find them; which commands and checks exist and how fast they run; what people can see of an agent's work; what is enforced (harness permissions, branch protection, CI, and deploy); and where the state of a task would live. The survey shows the gaps. Some are best fixed in `AGENTS.md`, others in a command, a check, or a doc.
3. **Run the first tasks with a minimal setup.** Keep the project's current environment, set the limits on consequences (agents don't merge or deploy, and decisions that belong to people stay with them), and give the agent the goal and the context. A task or two with no new `AGENTS.md` shows the agent's default behavior in this project and serves as the baseline.
4. **Record each task as a case and reflect on it.** The case record is in the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}). For each problem, the case notes where the fix belongs.
5. **Add only what a case shows is needed.** The first `AGENTS.md` lines, commands, or checks come from the survey and the first cases, and each stays only if later tasks go better with it. After several cases of one task type, the cases are compared and what holds is generalized.

The other things besides `AGENTS.md` are the parts of the environment that the survey and the cases point to: commands that run the checks, docs that state intent and contracts, a place for task state such as plans and handoffs, the permissions and branch protection, and a place to keep the case records.

Two decisions are open: which project and task types to start with, and where to keep the case records. Both are open questions in the Bottom-Up Approach.

### 22. A Loop for Testing and Revising the Working Model


Step 20 found that the model hasn't been tested, and step 21 says how to start on a project. Starting on a project tests the project's environment, but the model also needs a loop of its own: apply it on real tasks, reflect on whether it helped, and improve it. This step names the model and adds that loop.

- **The working model** is the set of concepts in the notes of `sdlc/` and in this log: goals, the approach, activities, phases, and cycles, participants and substrates, processes, and coordination. It's in use and expected to change.
- **Three loops at different levels.** The problem-solving cycle changes what we do in a task. Learning across tasks changes a project's environment within the working model. The model revision loop changes the working model itself.
- **The loop:** apply the model on a task, reflect on the model as well as the task, compare across cases, revise the concepts, and apply the revised model.
- **What it needs:** a known set of notes, claims that a case can test for each concept, a section on the model in each case record, a reflection after each task and a review across cases, this log as the record of changes, and signs of whether the model helps.

The loop is in [Testing and Revising the Working Model]({{< ref "ai-engineering/agents/sdlc/model-revision-loop" >}}). The case record in the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) now has an item for the model.

### 24. The Agent's Features as a Factor in the Design of AGENTS.md


> *User note:* We can design the smallest possible `AGENTS.md`. These are LLM-based agents, and they have their own features, including strengths, so the design has to take them into account.

The model so far looks at the features of agents mostly as problems: they follow a single path, remember nothing between sessions, and can't be accountable (step 18). For `AGENTS.md`, their strengths count as well. Agents bring general engineering knowledge, read and search the repository at low cost, infer conventions from the code, run commands and recover from errors, load docs and skills when a task needs them, follow written instructions closely, and ask the person when something is unclear. What they can't do by themselves is know what isn't written down, tell current material from stale material, remember earlier sessions, override a strong default without a cue, know the consequences outside the repository, and know which checks count as done.

Together the two lists give a test for each line of the root file: the agent can't get the line's content by itself or gets it wrong, and most sessions need it. What fails the test goes to a skill, a doc, a check or permission setting, or a nested `AGENTS.md`, which take the agent's context only when a task needs them. Because agents follow instructions closely, an unneeded line costs more than its length: the agent acts on it where it doesn't apply. What the agent does by itself changes with each model, so the result of the test changes too.

The factor and the test are in Agent Features as a Factor in the Design of AGENTS.md.

### 25. What a Team Can Set in a Harness It Doesn't Change


> *User note:* Let's constrain the situation: we can't change the harness freely, only set its configuration, as in Droid. `AGENTS.md` is one small part of the context assembled for the agent. We need to define what we can set, so that `AGENTS.md` can be minimal and hold only principles, with skills, guardrails, tools, and commands for the rest.

Step 24 counted the agent's features. Other factors bear on the design too: other sources of the agent's context and behavior (the harness, the rest of the environment, and the person in the session), the setting the file works in (the project, the mix of tasks, whether a person is present, and who shares the file), and what a line costs and what it saves. This step fixes one of them: the harness stays as it is, and the team only sets what it reads.

The harness decides most of the context. In one Codex session, its tool definitions and system prompt were 77% of the first request, and `AGENTS.md` was about 5%. What the team can set falls into groups: instructions the harness loads (the root, nested, and user-level files), knowledge the agent loads when it needs it (skills, docs, subagents, and commands the person invokes), tools and commands, limits on actions (permission rules, modes, the sandbox, and hooks), checks on results (hooks, checks as commands, git hooks, and CI), context added by events, session settings, and controls outside the harness.

Three properties decide where something goes: when it takes the agent's context, whether it holds when the agent doesn't follow it, and who it reaches. The root `AGENTS.md` is the only part that is guidance, loads in every session, and reaches every harness. So it holds the project's principles, and procedures go to skills, workflows to commands, forbidden actions to permission rules and the sandbox, and required checks to commands that hooks and CI run.

The list and the properties are in [What a Team Can Set in a Harness It Doesn't Change]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}), with Claude Code, Codex, and Droid as examples.

### 26. Reworking the Agent Development Environment Note


> *User note:* The note on the Agent Development Environment isn't aligned with the latest changes. Introduce the feedforward and feedback controls from Böckeler's article on harness engineering, describe the command layer in more established terms, and introduce `AGENTS.md` there too. The environment can contain everything: the methodological parts, `AGENTS.md`, skills, different roles, and many other components.

The note was reworked along these lines:

- **The environment is everything the team builds around a harness it doesn't change**, following step 25. Its parts are the code, instruction files, project knowledge and task state, skills and agent roles, tools (the command layer, scripts, and MCP servers), checks, limits on actions, the workspace and its provisioning, and working practices. The working practices are the written part of what Diaz et al. call the methodological harness, which the earlier version left to Agentic DevEx. Agentic DevEx is now the practice of building and improving the environment, which Böckeler calls the steering loop.
- **Böckeler's controls are the main way to describe the parts.** Guides steer the agent before it acts, and sensors check what it did. Each is computational or inferential. Tools and limits are the two other kinds of parts, because the environment also gives the agent the means to act and decides what it may do.
- **The command layer is described as build automation**: a task runner gives each workflow a named target. In terms of controls, it's how the environment runs its computational guides and sensors, the same way in the session, in hooks, and in CI.
- **`AGENTS.md` is one part of the environment**, the only one that is guidance, loads in every session, and reaches every harness. Its content follows the test of step 24.
- **The goals follow the six Plane 2 goals of step 19**, with two more that are specific to the environment: every agent gets the same environment, and the codebase stays coherent. Reliable autonomy is gone.

The architecture tree now groups the parts by kind of control. The reworked note is [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}), and the earlier version is kept as ade-0.

### 27. Project Knowledge as Its Own Note


After step 26, the sections on project knowledge were half of the ADE note: the three dimensions of project knowledge, the example layout, repository docs, shared agent docs, linked directories, task directories, local files, and how `AGENTS.md` points the agent to each source. They moved unchanged into [Project Knowledge in the Agent Development Environment]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}). The ADE note keeps a short section on project knowledge and task state that points there, and the links from other notes now go to the new note.

### 28. Separating the Agent Development Environment from the Execution Environment


> *User note:* Separate our Agent Development Environment from the environment where the agent starts. They're different things. The development environment isn't broader, it's different: it's also methodological, and it could contain skills, roles, workflows, configs, and more. We need to structure it, later or maybe now. And it's strictly different from the environment where the agent starts.

The notes used "environment" for two things. The ADE note listed the workspace among the environment's parts, and [Where Coding Agents Run]({{< ref "ai-engineering/agents/environment/where-agents-run" >}}) used the VS Code term *execution environment* for the workspace. They're now separate:

- **The Agent Development Environment** is a designed set of artifacts that the team writes and keeps: knowledge, instructions, skills, roles, working practices, commands, checks, configuration, and setup definitions. There's one per project, plus the parts projects share, and it changes through reviewed changes.
- **The execution environment** is the place where one session runs: the machine or container, the workspace in it, the isolation around it, and the credentials there. The setup definitions create it, there are many of them, and it changes through setup and through what the agent and people do in it.

The ADE reaches the agent through the execution environment, and the two can drift apart, as when a fresh sandbox lacks the linked shared docs. In the ADE note, the part "workspace and provisioning" became "setup definitions", the execution environment got its own section and its own branch in the architecture tree, and the limits became settings: sandbox settings and the scope of credentials. The notes on where agents run and on environment controls now say that they describe the execution environment.

Two questions are open:

- **How to structure the ADE.** The ADE note groups its parts by kind of control: guides, sensors, tools, and limits. The parts can also be grouped by kind of artifact: knowledge, instructions, working practices and workflows, skills, roles, commands and checks, harness configuration, and setup definitions. The two groupings cut across each other: a skill can be a guide or a sensor, and harness configuration holds limits as well as hooks that run sensors. Which grouping comes first is left for later.
- **Where the execution environment sits among the substrates.** [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}) has three substrates: the agent runtime, the ADE, and the authority layer. The execution environment is close to the agent runtime, but it also holds the running application, which the substrates place in the ADE as part of the subject system.

### 29. Grouping the ADE by Kind of Artifact


The first open question of step 28 was decided: the ADE note now groups its parts by kind of artifact, and the kind of control becomes a column. The groups are the code, instruction files, project knowledge and task state, working practices and workflows, skills, agent roles, commands and tools, checks, harness configuration, repository and platform settings, and setup definitions. The table in the note gives each group its kind of control (guide, sensor, tool, or limit) and its reach (one harness, the harnesses that read it, or every agent and person).

Two changes came with the regrouping:

- **Limits on actions are split by who reads them.** Permission rules, modes, sandbox settings, and hooks are harness configuration, read by one harness. Branch protection, required review, deploy rights, and the scope of credentials are repository and platform settings, which hold outside every harness.
- **Workflows join the working practices.** A workflow for a type of task, such as fixing a bug, is a written practice. A skill can carry out its steps, and commands can run its checks.

The architecture tree follows the same groups.

### 30. Agent Configuration as a Layer of Its Own


> *User note:* We have to separate the harness from the agent role, as VS Code does. The agent role and what it can hold, such as tools and the workflows we build, are separate from the harness: they have a different lifecycle, and a team creates and shares them. We need to name it, and first understand what could be in it. It isn't methodological, as Diaz et al. say: we can create roles, or different `AGENTS.md` files that we share as templates and assemble. As with ordinary applications, we configure them and manage their configurations.

The VS Code docs separate the harness from the agent role, the instructions, tools, and behavior that apply to a task. VS Code calls the whole set agent customizations: instructions, skills, custom agents, tools through MCP, hooks, prompt files, and plugins that bundle them, at the user, workspace, or organization level.

The proposed name for this part is **agent configuration**: the agent roles, instructions, skills, prompts and commands, runnable workflows, tool connections, policies, hooks, model settings, and packages that turn a general harness into the agents a team uses. It differs from the rest of the ADE in three ways: it's about the agents, it's reused across projects, and it's written for a harness and assembled from layers. It's configuration in the sense of an ordinary application, data that shapes how fixed software behaves, so the methodological harness of Diaz et al. doesn't fit it. Working practices, written workflows included, stay in the ADE.

With it, four things come together in a session: a version of the harness, the agent configuration resolved for the project, the person, and the task, a checkout of the ADE, and an execution environment to run in. Each has its own lifecycle: the vendor releases the harness, the team releases the configuration and shares it across projects, the ADE changes with the project, and the execution environment lasts a session or a task.

Managing it follows the practice of managing an application's configuration: layers with overrides from the organization to the session, templates and assembly, packages and distribution, rendering for each harness, versions and releases, checks and tests, and watching for drift. An agent role in the configuration is how a participant role from steps 14 and 15 becomes something a harness can run.

If the layer is adopted, instruction files, skills, agent roles, and harness configuration move out of the ADE, while the project's own part of the configuration still lives in the project's repository. The ADE note hasn't been changed yet. The proposal, with what the layer can contain and the names considered, is in [Agent Configuration]({{< ref "ai-engineering/agents/customization/agent-customization" >}}).

### 31. Adopting the Agent Configuration


The proposal of step 30 was adopted. Instruction files, skills, agent roles, and harness configuration moved from the ADE note to [Agent Configuration]({{< ref "ai-engineering/agents/customization/agent-customization" >}}), which now describes each of them. The ADE is now the project and what it gives every participant: the code, project knowledge and task state, working practices and written workflows, commands and tools, checks, repository and platform settings, and setup definitions.

Three things changed with the move:

- **The boundary with the harness has a layer in the middle.** The earlier ADE note had parts "on the boundary", which the team writes and one harness reads. These parts are now the agent configuration, together with `AGENTS.md`, which several harnesses read.
- **The limits are split between two layers.** Permission rules, modes, and sandbox settings are policies in the agent configuration. Branch protection, required review, deploy rights, and the scope of credentials stay in the ADE as repository and platform settings.
- **Böckeler's outer harness covers both layers.** The controls the team adds come from the agent configuration (`AGENTS.md`, skills, and reviewer roles) and from the ADE (the code, docs, tests, and linters).

The architecture tree has a separate branch for the agent configuration, next to the agent runtime, the execution environment, and the ADE.

### 32. Not Knowing How to Evaluate the System


> *User note:* We built this system, and we don't know how to evaluate it. The first problem is formulating what we want. Do we, as developers or other team members, understand the behavior we want? "Make the ticket better" isn't a goal. And this isn't a usual AI system: it's the whole system of engineering work with agents, and it's complex. Before we evaluate it, or try to understand how it behaves, we need the framing: the goals of the processes.

Steps 1 to 31 describe a system: goals, an approach, activities, participants, processes, the ADE, the agent configuration, and the execution environment. Two loops are meant to improve it: learning across tasks, which is the ninth process of step 18, and the model revision loop of step 22. Both depend on telling whether a task went well, and no step says how to tell. Step 22 lists signs that the model helps, such as fewer corrections by people, but a sign isn't a statement of what we want. The gap has been there since step 20.

**Where the difficulty is:**

- **Formulating comes first.** Without a stated goal we can record a session and describe it, and we can't judge it. "Make the agent handle tickets better" doesn't say what would be different, for whom, or in which situations.
- **The general evaluation framework assumes another situation.** It describes a team that builds an AI product and evaluates its behavior for users. Here the result comes from people, agents, checks, the environment, and the workflow together, and the people who would evaluate the system work inside it. The team didn't build the agent, the same agent gives different results with different people, tasks don't repeat, and some effects show up weeks later.
- **The goals we have are at the wrong level.** The Plane 1 goals of step 19 are too general to compare with a session. Step 18 says which goal each process serves, and it doesn't say what is true when a process runs well.

**What this step did:**

- **Goals at three levels, later dropped from the evaluation log.** The work as a whole (Plane 1 and the two conditions), each process, and an activity in a project. In the log they became one plain step: say what a good result is for one kind of task, as a list someone can tick off.
- **A goal for each process.** Each of the nine processes got a statement of what is true when it runs well, and a sign that it wasn't reached. The note that held them was deleted later.
- **A log of its own.** [Reasoning Log: Evaluating Engineering Work with Agents]({{< ref "ai-engineering/agents/evaluation/logs-evaluation" >}}) restates the problem in a developer's words, lists first candidate questions, and works out what a good result looks like for one kind of task.

**Reflecting on it:**

- **The first draft evaluated the agent.** It asked what the agent should do and wrote every wanted behavior as "the agent does this". That's the mistake step 2 names and step 19 removed from Plane 2. The thing being evaluated is the whole system, so a wanted behavior can belong to a person or to a check as much as to the agent.
- **The first draft also started from behavior.** It asked "what behavior do we want?" before any goal was stated. A behavior is a means, and without a goal behind it there's no way to choose among the many behaviors that are easy to see. The goals had to come first.
- **The drafts were too abstract.** Three levels of goals and a goal for each process came before anything a developer would recognize from their own work. The evaluation log was rewritten to start from a developer's questions, and the process goals became a checklist to read after a team has looked at its own pull requests.
- **This step is top-down again.** Step 20 said to stop refining the concepts until cases show a gap, and the process goals are derived from the model, as steps 1 to 19 were. What speaks for them is step 22: each concept needs a claim that a case can test, and the goals and their signs are such claims. They're hypotheses until cases use them.
- **Evaluating against these goals is partly circular.** The goals come from the model, so an evaluation against them shows whether the work follows the model. It doesn't show whether the model's processes are the right ones. The Plane 1 goals are the check from outside: the result holds, and people understand and own it. They show up late and are the hardest to see in a session.
- **How to evaluate is still unanswered.** The evaluation log first answered its own questions with a table of pull requests and saved tickets. That came too early and was removed: the questions were first guesses, and they have to come from cases in our work before anyone answers them.

**Open:**

- How do we see the goals that show up late, such as understanding and ownership, close enough to a task to learn from it?
- When do we evaluate the whole system, and when one part with the others held fixed?
- Where are sessions kept, so there's evidence to look at? The case record of step 11 keeps a description of the task and doesn't keep the session.
- Should the case record note, for each task, which signs from the process goals appeared? That would test the goals on the first cases of step 21 without building anything new.

### 33. Task Types Describe the Work, Whoever Does It


> *User note:* The task types are framed as tasks that people give an assistant. Why concentrate only on what the assistant does? Task types should be common to all participants.

Step 11 defined a task type as a recurring kind of task given to an assistant, and [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}) collected about fifty types on that definition. Nothing that defines a type depends on who does the task: the starting point, the output, the definition of done, and the activities are the same for a person, an agent, or both. [Participants and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}) already treats a participant as a person, an agent, or an automated check, so the old definition tied the catalog to one kind of participant.

**What changed:**

- **The definition.** A task type is now a recurring kind of task in engineering work, whoever does it. The name stayed. "Type of work" was the early name for activities (step 6), and "work item type" is a term from issue trackers for records such as stories and bugs.
- **Three types turned out to be general.** "Review work an agent did alone" became "review work done without supervision", which also covers outside contributors. "Update agent instructions" became "update project instructions", since `AGENTS.md` and onboarding guides for people are both project knowledge. "Set agent policies" became "decide who may do which task types", which also covers new team members.
- **Delegation profiles describe a participant without a track record.** The default levels fit a new agent role and a new team member alike. The evidence a participant gives doesn't depend on who did the work; the track record sets the level, and accountability stays with a person.
- **Programs are measured by what one reviewer can check in one go,** and no longer by one agent session.
- **Measures can compare participants on the same type.** Labeling work that people do today gives the baseline that problem 61 in [Problems]({{< ref "ai-engineering/agents/problems/problems" >}}) says is missing.

**Reflecting on it:** This is the mistake the first draft of step 32 made: putting the agent at the center when the subject is the whole system of work. Step 32 found it in the evaluation; here it was in the catalog of tasks.

### 34. Problems, Their Layers, and the Features behind Them


> *User note:* We should decouple two things: the usual problems of work with agents, and the problems of understanding whether our changes to the agents and the other parts help. A team can have problems with a pull request with ordinary developers, and more problems with a pull request once agents are introduced. The third thing is that after we change a parameter, such as `AGENTS.md`, we need a way to estimate the quality of the pull requests.

Step 32 ended with the evaluation log answering its own questions too early. The log then collected problems first, and they became a list of 91 in [Problems in Engineering Work with Agents]({{< ref "ai-engineering/agents/problems/problems" >}}). This step looked at how the problems relate to each other and to the model.

**What this step did:**

- **Links between problems.** One problem often leads to another. [Sequences of Problems in Engineering Work with Agents]({{< ref "ai-engineering/agents/problems/problem-sequences" >}}) draws 116 links and finds two loops: one of review and understanding, and one in the agent setup.
- **Three layers.** The list is regrouped into problems a team has without agents, problems that appear with agents, and problems of telling whether a change helps. Each layer 1 row was split into the problem itself and what agents change in it.
- **Features behind the problems.** [Features behind the Problems in Work with Agents]({{< ref "ai-engineering/agents/problems/problem-features" >}}) traces 88 of the 91 problems back to fifteen facts the team doesn't control: six about the work, three about people, and six about agents.
- **Six features added to the model.** Seven of the fifteen were already in the features of the participants in step 18, and two more were there in part. The other six were added to [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}#features-of-the-participants-and-the-work-that-bear-on-the-goals): four features of the work, and two of agents.
- **A tenth process.** Only learning across tasks touched layer 3, and it covers writing down what a task taught. Finding out whether a change helped wasn't in any process, although the bottom-up approach of step 11 and the task types of step 33 describe a method for it. Checking whether a change helped is now the tenth process. It's derived from the three features behind layer 3 and the goal of a better next task.

**Reflecting on it:**

- **The first grouping mixed the layers.** Eight classes came first, and one of them, seeing and judging results, held problems from all three layers. The user's distinction separated them.
- **Much of what looked like agent problems was there before.** The loop of review and understanding sits entirely in layer 1. Agents push into it at a few points: cheap writing meets limited attention, and output that looks the same right or wrong meets checks that show only what they were written for.
- **The model had no features behind layer 3.** Every task is different, the value of the work is hard to count, and an agent's behavior isn't fixed. None of the three was in step 18, so no process could be derived for telling whether a change helps. That's the gap step 32 found from the other side.
- **"Known before agents" and "present without agents" are different.** Five problems follow a pattern that older work describes and still appear only with agents, such as a review handed to another agent.
- **The new note first called them conditions.** Step 19 already uses that word for two goals, cheap deliberate work and a better next task. So the note uses the model's word, feature.
- **This step is top-down again.** The links, the layers, and the features are reasoning from how the problems are worded. No case from our work is behind them, as step 20 would require.

**Added later:** the list got three more problems, 92 to 94, about a result that depends on many parameters, some of them hidden. The counts above are from before that. With the three problems, the sequences have 126 links, and the loop in the agent setup now runs through layer 3: a growing setup means more parameters, so the cause of a bad result is harder to tell, and more lines get added. The three problems fit none of the fifteen features well. So a sixteenth was added to the features note and to the model's features of the work: the result of a task depends on many things at once, some of them can't be seen, and the effect of changing one depends on the others. The tenth process now names it and records the setup with each result. [The bottom-up approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}#many-parameters-some-of-them-hidden) describes the problem.

**Open:**

- The tenth process has a method only for tasks that come in types and in some number. What does a small team do with a handful of tasks of one type?
- What tells the team that a new version of the model or the harness changed the agent's behavior?
- Does a case from our work show any of the links?

### 35. Renaming the Agent Configuration and Sorting Its Parts


> *User note:* Maybe it's not only configuration. Maybe we can rearrange or rename the agent configuration, because it can contain different things.

Steps 30 and 31 named the layer agent configuration and listed ten parts. The parts differ in what the harness does with them, and only some are configuration in the usual sense:

- **Text the model reads**: instructions, skills, saved prompts and commands, and the prompts of agent roles. The harness puts the text into the context, and the agent weighs it.
- **Settings the harness applies**: permission rules, modes, sandbox settings, the model and reasoning effort, tool lists, and connections to MCP servers. The harness enforces them.
- **Code the harness runs**: hooks, plugins that change behavior, and custom tools. This is the extend level of the ADE note, and the team maintains it as code.
- **Bundles**: agent roles, runnable workflows, and packages, which combine the other three.

**What changed:**

- **The layer is now the agent customization.** VS Code uses the word for the same set of parts, and it covers text and code as well as settings. Step 30 turned it down because it suggests personal adjustments, but VS Code also uses it for what an organization requires. *Configuration* now names only the settings, and the practices of managing the layer keep their name.
- **The note is sorted by the four kinds.** [Agent Customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}) replaces its list of parts with a table of the four kinds, and the architecture tree in the ADE note groups the parts the same way.

**Open:**

- Code that replaces tools or takes over compaction changes parts the harness owns. Does it belong in this layer or with the harness?
- Not everything a team can change around a session is in this layer. The model, the harness's own code, the ADE, the execution environment, the authority layer, the working practices, and the task input are also things to change. No note lists them together yet.

### 36. Listing What a Team Can Change Around a Session


> *User note:* Yes, write it, and also maybe move them into a separate section.

Step 35 left one gap open: the agent customization is only one of the things a team can change. [What a Team Can Change Around an Agent Session]({{< ref "ai-engineering/agents/customization/what-can-change" >}}) lists all of them: the task, the model, the harness, the agent customization, the ADE, the execution environment, the authority layer, and the participants. For each it gives what can change, who changes it, how long a change lasts, and which note describes it.

**What this step did:**

- **A new section.** The overview, [Agent Customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}), and [What a Team Can Set in a Harness It Doesn't Change]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}) moved into `customization/`. The ADE, the execution environment, and the comparisons of how agents restrict and check actions stay in `environment/`.
- **Four ways the parts differ**: who makes the change, who it reaches, whether it holds when the agent doesn't follow it, and how much work it takes. Two parts change without the team: new versions of the harness and of the model.
- **Where a change belongs.** The rules come from earlier notes: a capability goes into the ADE when it can work there, a limit goes where it holds, the root `AGENTS.md` keeps only what most sessions need, and what one task needs stays in the task.

**Open:**

- Who owns the budgets for time, tokens, and compute, which could be one more part to change?
- When a problem comes back, which part should the team change first?

### 37. Separating Workflows from Activities, and Untangling Approach, Processes, and Cycles


Looking across `sdlc/` after steps 28 to 36 showed four tangles in the working model:

- **"Workflow" meant four things without separating them:** the six-activity lifecycle (`workflows.md` and `cycles.md`), the concrete steps for one task type (`bottom-up-approach.md` and `ade.md`), a runnable multi-stage pipeline (`agent-customization.md` and `independent-verification-workflows.md`), and the process loops (`participants-and-processes.md`). In `task-types.md`, only two of the ~42 task types use all six activities, so treating the six activities as "the workflow" made every task look like a six-step waterfall.
- **`approach.md` and `processes.md` overlapped without a stated boundary.** Six of the ten items mapped one-to-one, leaving the reader with two parallel ten-item lists.
- **Three loop lists lived side by side:** seven cycles in `cycles.md`, step 7's four nested loops still in the body of `participants-and-processes.md`, and the three learning loops in `model-revision-loop.md`.
- **`participants-and-processes.md` lagged behind steps 28 to 36,** still listing three substrates (`Agent runtime`, `ADE`, `Authority layer`) instead of the five layers in `what-can-change.md`.

**What changed:**

- **Each note in `sdlc/` owns one question**, mapped in [SDLC Index]({{< ref "ai-engineering/agents/sdlc" >}}).
- **[Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) defines a workflow** as how participants, tools, and checks carry out a [task type]({{< ref "ai-engineering/agents/sdlc/task-types" >}}) using the subset of [activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) that task type needs, and names the three forms a workflow can take in a team's setup: a written working practice in the ADE, a skill or agent role in the agent customization, or an orchestrated pipeline with deterministic gates.
- **[Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}) and [Processes]({{< ref "ai-engineering/agents/sdlc/processes" >}}) state their boundary.** The Approach covers how to reason inside a step, even when one person works alone. Processes cover what changes once work is split across people, stateless agents, and checks: six reasoning practices turn into handoffs and gates across participants, and four new coordination jobs appear (allocating autonomy, keeping human understanding, keeping continuity outside session memory, and checking whether a setup change helped). The ten processes are grouped by job with their numbering kept fixed.
- **[Participants and Substrates]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}) aligns its substrates with steps 28 to 36** (harness, agent customization, ADE, execution environment, and authority layer) and moves step 7's four nested loops and design-research notes to the appendix, keeping its file path and heading anchors intact.
- **[Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}) connects the vault's cycles to the three learning speeds** in [Testing and Revising the Working Model]({{< ref "ai-engineering/agents/sdlc/model-revision-loop" >}}), and the superseded blueprint `sdlc-workflows-handoff.md` moved to `input/`.

### 38. Reframing Workflows as a Six-Part Format and Adding a First Example


Even after step 37, `workflows.md` was still mostly an essay contrasting good engineering with the "generate and accept" shortcut, and it still held two sections that belonged elsewhere: the five-concept organization list and the six-activity shortcut table. It did not state what a concrete workflow has to specify.

**What changed:**

- **Kept the filename `workflows.md`** so existing links and the published URL stay intact, and reframed it around a **six-part workflow format** for one task type: scope and starting input, steps (activity, participant, output), decision points, checks (self-checks and independent checks), backtracks, and placement in the project setup.
- **Reassigned two sections out of `workflows.md`:** the five-concept map (*Activities, Task types, Workflows, Phases, Cycles*) moved to [SDLC Index]({{< ref "ai-engineering/agents/sdlc" >}}), and the six-activity shortcut table moved to [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}). `workflows.md` keeps a short section on the "generate and accept" shortcut because several notes link to it for that term.
- **Created the first concrete example:** [Workflow Example: Fix a Bug]({{< ref "ai-engineering/agents/sdlc/workflow-fix-a-bug" >}}) writes out the **Fix a bug** task type in the six-part format as a draft hypothesis to test and trim on actual tasks.
- **Renamed `participants-and-processes.md` to `participants-and-substrates.md`** using `_scripts/rename_note.py` so the filename matches its scope, updating 40 internal links across 16 files.

### 39. Renaming "Frame a Ticket" to "Frame a Problem" and Adding Its Workflow


**Frame a ticket** tied the framing task type to an issue tracker, even though framing starts from rough ideas, user feedback, chat threads, incident follow-ups, or unclear bug reports as well as tickets.

**What changed:**

- **Renamed the task type from `Frame a ticket` to `Frame a problem`** across [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}), [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}), [SDLC Index]({{< ref "ai-engineering/agents/sdlc" >}}), and [Workflow Example: Fix a Bug]({{< ref "ai-engineering/agents/sdlc/workflow-fix-a-bug" >}}), matching Activity 1 (*Problem & Opportunity Framing*) and [Defining the Product Before Building]({{< ref "ai-engineering/agents/ai-assisted-development/product-framing" >}}).
- **Created [Workflow Example: Frame a Problem]({{< ref "ai-engineering/agents/sdlc/workflow-frame-a-problem" >}})** in the six-part workflow format. This tests the format on a task that produces a document with low automated checkability (where checks rely on verifying code claims and getting owner decisions) and links directly as the prerequisite for [Workflow Example: Fix a Bug]({{< ref "ai-engineering/agents/sdlc/workflow-fix-a-bug" >}}) when expected behavior is unclear.
