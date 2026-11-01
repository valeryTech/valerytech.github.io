---
draft: false
toc: true
title: "Bottom-Up Approach to Building Engineering Workflows"
description: "Our approach to building engineering workflows with software assistants: describe how the team works now, construct a workflow with agents, test it on real tasks from a minimal setup, and keep only the structure that proves its value."
linkTitle: "Bottom-Up Approach"
---

This note describes our approach to building engineering workflows with software assistants. [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) and [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}) describe the work from the top down. This note describes the other direction: start from real tasks, learn from them, and generalize only what holds across them. The idea started as step 11 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}).

## The Idea


Do real tasks in real projects with an assistant, reflect on what happened, compare the cases, and generalize only what holds across them. Then look for optimizations: skills, commands, checks, or `AGENTS.md` lines that would have made the cases go better. Test each optimization on new tasks before keeping it.

## Methods


The approach uses two methods: grounded theory for learning from cases, and sandbox-first capability discovery for running each case as an experiment.

### Grounded Theory


Grounded theory is a qualitative research method that builds concepts and explanations from observed data. Its main techniques are:

- **Open coding:** labeling what happens in each case.
- **Constant comparison:** comparing each new case with earlier ones.
- **Theoretical sampling:** choosing the next case to test a gap in the current concepts.
- **Saturation:** stopping when new cases add no new concepts.

### Sandbox-First Capability Discovery


[Sandbox-First Capability Discovery]({{< ref "ai/design/workflow-design/sandbox-first-capability-discovery-llm-agents" >}}) gives the experimental side of the approach. An agent's capabilities aren't fully known in advance, and a prescribed workflow can hide useful behavior. So give the agent a safe, general environment and basic tools, let it work on representative tasks with few assumptions about the method, observe what it does, and add specialized components only after experiments show they help. The note sums this up as "open about method and strict about consequences."

Applied to engineering workflows:

- **Start each task type with a minimal setup.** Give the agent the goal, the context it needs, and hard limits on what it can affect: no production access, no unlimited spending, and decisions that belong to a person stay with that person. Leave the order of activities open at first.
- **Record traces and check outcomes.** Keep what the agent did and check the result itself, such as the fix, the finding, or the brief. A correct result shouldn't fail because the agent took a different path than expected.
- **Repeat important tasks and vary them.** One success shows the agent can do a task; repeated success on changed examples shows it does the task dependably.
- **See a need more than once before adding structure.** A required step, a skill, a command, a reviewer agent, or an `AGENTS.md` line is added only after several cases show the same need.
- **Make every added structure prove its value.** Compare results with and without it (an ablation: remove the component and see what changes). Keep it only if it improves the outcome, the effort, or the risk.

This creates a tension with the [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}), which ask for explicit framing, options, and independent verification. We treat those features as hypotheses about which structure helps. The cases show where an agent skips framing or checks its own work in a circle, and those failures justify adding structure, such as a required reproduction step for bug fixes or an independent test writer. Decision ownership is a limit on consequences, so it holds from the start.

## Earlier Notes on the Same Idea


Older notes in the vault describe parts of this idea. They're background; this note is the current version.

- [AI Project Foundation]({{< ref "projects/ai-dev-foundation/starter-kit-and-foundation" >}}): an earlier draft that applies an approach inspired by grounded theory to shared tools and practices across AI projects: start with concrete applications and observations, form tentative concepts, and compare experiences across projects.
- Engineering Knowledge Loop: an earlier model of how engineering experience becomes reusable knowledge. A local problem-solving loop works on one case, and a cross-project loop compares cases, generalizes within limits, and codifies what holds. It points out that a success in one project is local evidence and doesn't yet support a general rule.
- "Building AGENTS.md from Evidence" (deleted in commit 21835fe): applied the idea to `AGENTS.md`: start with a small file, observe agents on real tasks, place each fix where it belongs, check the effect, and remove lines that stop helping.

## Task Types


The unit of experience is a task. A task type is a recurring kind of task in engineering work, whoever does it: a person, an agent, or both together. The cases in this approach are tasks done with an assistant, and the types describe the work itself, so the same types also label work done by people. Task types and activities are two levels: an activity is a kind of work, and a task type is a recurring combination of activities with its own starting point, output, and definition of done.

Candidate task types, held in a holding space until real cases test them. [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}) has a longer list, grouped by what each task starts from and produces:

| Task type | Activities it usually goes through |
| :--- | :--- |
| **Fix a bug** | Investigation (reproduce the bug and find the cause), design decisions (choose a fix: guard the symptom, fix the caller, or change the contract), implementation, and verification (a regression test and nearby variations) |
| **Find a root cause** | Investigation (competing hypotheses and checks that rule them in or out) and verification of the explanation; the result often feeds a design decision |
| **Investigate a problem or answer a question** | Investigation; the output is a finding with evidence and a statement of what remains unknown |
| **Frame a ticket** | Framing, with investigation of current behavior; the output is a brief with open questions for the owner |
| **Implement a feature** | Framing, investigation, design decisions, implementation, verification and review, and release |
| **Refactor** | Investigation (map callers and current behavior), design decisions (the target structure and what must stay the same), implementation in small steps, and verification that behavior didn't change |

## Existing Workflows First, Then New Workflows with Agents


For each task type, the work has two parts. First we describe how the team does this task type now. Then we construct a workflow with agents for it, using the features of LLM-based agents. Real tasks then test the constructed workflow, as the rest of this note describes. This section is a proposal. No case has tested it yet.

### A Similar Method for AI Products


Lipenkova describes a similar order for adding AI to a product. ([Lipenkova 2025](#lipenkova-2025), section 10.1.1) The team first agrees on the user journey for a process, such as writing a sustainability report, and breaks it into stages. It then rates each stage on three criteria: the value of giving the stage to AI, whether AI can do it well enough, and whether the users want to give it away. The stage with the best rating is built first.

Chapter 9 of the same book compares a manual workflow with an agent workflow. ([Lipenkova 2025](#lipenkova-2025), chapter 9) In the manual workflow, the person plans the work, operates the tools, and remembers each step. In the agent workflow, the person states the task, and the agent does the rest and comes back with questions. The chapter advises starting with limited automation and raising it as the agent proves reliable.

We use the same order for the team's own engineering work. Three things differ, and they are our reading of the book:

- The people who describe the workflow are the people who do the work. The description can come from their recent tasks, and it needs no user research.
- The assessment in section 10.1.1 ends with one stage to give to AI first. Ours ends with a workflow for the whole task type, in which steps can move, change, or be added.
- The book rates each stage by value, feasibility, and desirability. We also ask what each feature of agents allows, and what it requires of the steps around it.

### Part 1: Describe the Existing Workflow


Take a few recent tasks of the type, with their tickets, pull requests, and review comments, and write down how the work went:

- the steps in order, and who did each one;
- what each step started from and what it produced;
- which decisions were made, and who made each one;
- what was checked, by whom, and with what;
- what was written down, and what stayed in people's heads;
- where the work waited, went back to an earlier step, or went wrong.

The description says what the team does, which can differ from what its process document says.

Then ask of each step why the team does it. The answer decides what happens to the step in part 2. These four groups are our reasoning:

- **The step produces part of the result:** the fix, the test, or the migration.
- **The step protects the result against a feature of people or of the work.** A ticket exists because what's wanted is in someone's head. A review exists because an author goes with the first idea and sees only part of the system. A CI run exists because people forget to run checks.
- **The step keeps the team's understanding of the system:** reading a colleague's change, or talking a design through.
- **Nobody can say why.** The step is a habit.

The notes already hold part of the description. [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}) gives each type's starting point, output, and definition of done. [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) names the kinds of work the steps belong to. [Layer 1 of the problems list]({{< ref "ai-engineering/agents/problems/problems" >}}#layer-1-problems-a-team-has-without-agents) holds the problems a team has without agents, and the description shows which of them this team has.

### Part 2: Construct a Workflow with Agents


Some things carry over from the existing workflow, whoever does the steps:

- the output of the task type and its definition of done;
- the decisions and their owners;
- the evidence owed for the result ([Delegation Profiles]({{< ref "ai-engineering/agents/sdlc/task-types" >}}#delegation-profiles));
- both outputs of the workflow: a working system, and the team's understanding of it ([Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}})).

The steps are open to change. For each feature of agents, ask what it allows and what it requires. The features come from [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}#features-of-the-participants-and-the-work-that-bear-on-the-goals) and Agent Features. The two right columns are our reasoning.

| Feature of agents | What it allows | What it requires |
| :--- | :--- | :--- |
| Reads, searches, and writes quickly at low cost | Steps that cost a person too much become affordable: reproduce every bug before fixing it, find all callers, build two options and compare them, write the test first | More output arrives than people can read. Tasks get smaller, or review moves from reading every line to checking evidence |
| Has general engineering knowledge and infers conventions from the code | The handover doesn't have to explain common practice or what the code already shows | The handover names where the project departs from common practice |
| Runs commands and reads the results | The agent can check its own work as it goes and correct course | Fast checks with clear messages, and commands the agent can run |
| Knows only what's written down, and keeps nothing between sessions | | A written handover: the goal, the context, the limits, and the definition of done. What a session learned is written where the next one will find it |
| Follows a single path by default | | Steps that ask for more than one option, and a decision point before the agent edits |
| Its output looks the same whether it's right or wrong | | A check that doesn't come from the same idea as the code ([Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}})) |
| Its behavior isn't fixed | The same task can be run more than once and the results compared | One good task doesn't show that the workflow works. Results are compared by task type |
| Acts with a person's access and can't answer for the result | The agent can act on the system as well as suggest | Limits on what it can affect, and a named person who answers for each result |
| Can take any text as an instruction | | Limits on what the agent reads from outside the project, and on what it may do afterwards |

Then go through the steps of the existing workflow with four questions:

1. **Does the step stay with a person?** Decisions the person owns stay, and so do judgments that need unwritten context. A step that keeps the team's understanding stays in some form, because the agent's work doesn't build it.
2. **Can an agent do the step?** If yes, say what the agent needs before the step and which check comes after it. The three criteria of value, feasibility, and desirability apply here to one step. Lipenkova warns that a feature that needs a lot of human oversight can lose all of its gain. ([Lipenkova 2025](#lipenkova-2025), section 10.1.1) For a step, that means: if checking the agent's output takes as much of a person's time as doing the step, the agent adds nothing there.
3. **Does a step that cost too much before become affordable?** The first row of the table lists candidates.
4. **Does the agent's part need a new step around it?** Candidates are writing the handover, reading the agent's plan before it edits, checking the evidence, and recording what the session learned.

The constructed workflow can differ from the existing one in its steps and in their order. Suppose only the implementation step goes to an agent, and nothing else changes. The ticket is as short as before, but the agent can't ask a colleague what it means. The review is the same, but there's more to read. This is the "generate and accept" shortcut described in [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}).

An illustration for a bug fix. It's made up to show the idea, and it doesn't come from a case:

| Existing workflow | Constructed workflow with an agent |
| :--- | :--- |
| A short ticket | A ticket with the expected and the actual behavior |
| The developer reads the code and guesses the cause | The agent reproduces the bug with a failing test |
| | A person confirms that the test shows the bug |
| The developer writes the first fix that works | The agent lists the options for the fix: guard the symptom, fix the caller, or change the contract. A person chooses when a contract changes |
| A test is added if there's time | The agent implements the fix, and the failing test passes |
| A reviewer reads the diff | The pull request says what was checked and what wasn't. A reviewer checks the evidence and reads the diff |

## Many Parameters, Some of Them Hidden


The approach asks every added structure to prove its value. That is hard for a reason that goes beyond agents. The result of a task depends on many parameters, we know only some of them, and so it's hard to tell what one change did. A parameter here is anything the result of a task depends on.

### The Problem in Three Parts


**There are many parameters.** For one task done with an agent, the result depends on at least these:

- the task: the ticket, and the state of the repository when the work starts;
- the person: who runs the session, and how they steer it;
- the agent setup: `AGENTS.md`, the skills, the commands, the hooks, the tools, and the permissions;
- the harness: its version, its built-in prompt, its tool descriptions, and how it shortens a long session;
- the model: its version and its settings;
- the session: which files the agent read, what was said earlier, and what it kept from before;
- the environment: the checks, the CI, and the dependencies.

**Some parameters are hidden.** They are hidden in three ways:

- We know the parameter exists and can't see it, such as the harness's built-in prompt or a change on the vendor's side.
- We could see it and don't record it, such as a setup file in one developer's home folder, the harness version on that day, or what the agent loaded into its context.
- We don't know it exists. We find it only when two results that should match don't.

**The effect of a change is hard to tell.** Even with the parameters known:

- The effect depends on the other parameters. A line in `AGENTS.md` that helped with one model can do nothing with the next one.
- The change acts on more than its target. A line written for one mistake is read in every session, and changes tasks nobody looks at.
- The effect is smaller than the difference between two runs of the same task, or between two tasks.
- Several parameters change in the same week, so the result can't be assigned to one of them.
- Part of the effect shows weeks later.

The three parts and the list of parameters are our reasoning. No case has tested them.

### The Same Problem in Other Fields


The problem is older than agents and wider than machine learning.

- **Problem solving.** Research on complex problem solving studies people who control simulated systems. Frensch and Funke define a complex problem as one where the starting state, the goal, and the barriers between them are complex, change over time, and are intransparent, so the solver doesn't know their exact properties at the start. The same volume lists what makes such a task complex: the large number of variables, their connections, the intransparency, the time lags, and the many goals. ([Frensch and Funke 1995](#frensch-1995))
- **Experiments.** Montgomery's textbook on the design of experiments covers both halves of the problem. Changing one factor at a time fails when factors interact, which means that one factor's effect differs with the level of another. Factors that affect the result and aren't the subject of the experiment are handled by comparing within blocks, where such a factor is the same, and by assigning at random, which averages out the factors nobody listed. ([Montgomery 2017](#montgomery-2017), chapters 1 and 2)
- **Machine learning systems.** Sculley and colleagues describe machine learning systems in which no input is independent of the others, so changing one input, setting, or choice of data changes the behavior of the rest. They call it "Changing Anything Changes Everything". ([Sculley et al. 2015](#sculley-2015))
- **Engineering organizations.** [Causal Claims Need a Comparison]({{< ref "engineering/evidence/causal-claims" >}}) lists what stands between a change and a claim about its effect in organizational data: different projects, the engineers' skill, deadlines, the choice of tasks, and other changes in the same period.
- **Debugging.** "It works on my machine" is the same problem at a small scale: two environments that look the same differ in a parameter nobody recorded.

### What the Approach Does about It


The approach can't remove the problem. These parts of it make the problem smaller. How they connect to the problem is our reasoning.

- **Keep the list of parameters, and record them with each case.** The case record notes the setup at the time: the model and harness versions, the commit of the repository and of the agent setup, and who ran the session. A parameter that's recorded is no longer hidden in the second way.
- **Start with a minimal setup.** Fewer lines, skills, and tools mean fewer parameters that can act on each other.
- **Change one thing at a time, and note what else changed.** This doesn't show how the change depends on other parameters. So a change that was tested with one model is tested again after the model or the harness changes.
- **Compare within one task type.** Tasks of one type share a starting point, an output, and a definition of done, so fewer parameters differ between them. The experiment textbooks call this comparing within a block.
- **Repeat before concluding.** One good task after a change shows little. Several tasks, or the same task run more than once, show more.
- **Remove a component to see what it does.** The comparison with and without it is the most direct test the approach has.
- **Treat a surprise as a sign of a hidden parameter.** When two results that should match don't, look for what differed and add it to the list. Comparing each new case with the earlier ones is how the parameters of the third kind are found.
- **Say what can't be told.** With a few tasks a week, only large effects can be seen. A change with a small effect stays unproven, and the approach removes structure that hasn't proven its value.

The problems list holds this problem as [its own group in layer 3]({{< ref "ai-engineering/agents/problems/problems" >}}#many-parameters-some-of-them-hidden). The working model lists what is behind it among the features of the work, and [Features behind the Problems in Work with Agents]({{< ref "ai-engineering/agents/problems/problem-features" >}}) has it as W7. The tenth process in [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}) is the process that has to work under it.

## How This Relates to the Top-Down Model


- **The top-down notes give a starting vocabulary.** [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) and [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}) are the labels for coding cases. The cases test those labels: if a task doesn't fit the activities, the activities change. [Testing and Revising the Working Model]({{< ref "ai-engineering/agents/sdlc/model-revision-loop" >}}) describes the loop for these changes.
- **Task types combine activities.** The candidate table above says which activities each task type goes through; cases will confirm or correct it.
- **Project-specific findings go into a project's version of an activity.** [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) describes what that version states. Findings that hold across projects go into the general definitions.
- **Optimizations are environment upkeep.** Turning recurring problems into skills, commands, checks, and `AGENTS.md` lines is the environment maintenance loop (step 7 of the Reasoning Log).
- **One case and a comparison of cases match the two loops** of the earlier Engineering Knowledge Loop: the local loop and the cross-project loop.

## Open Questions


- Which task types and projects to start with.
- Where to record cases: in each project, in this vault, or both.
- How many cases are enough before generalizing, for a small team with few cases.
- When task types get their own note.
- How detailed the description of an existing workflow has to be before it's useful.
- Whether to construct one workflow for a task type or two candidates and compare them.

## Related Notes


- [Sandbox-First Capability Discovery for LLM Agents]({{< ref "ai/design/workflow-design/sandbox-first-capability-discovery-llm-agents" >}}): a minimal sandbox, general tools, repeated trials, and ablations to find which workflow structures help.
- [Working Ideas: Workflow Evolution and Autonomy]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/09-workflow-evolution-and-autonomy" >}}): starting deterministic and adding the LLM, or starting with the LLM and adding structure after observing its behavior.
- [Discovery Directions Map and Recall Audit]({{< ref "ai/product/discovery/discovery-directions-and-recall-audit" >}}): a map of bottom-up learning across AI projects, workflow design, failure analysis, and discovery.
- [Premature Abstraction in Software Design]({{< ref "engineering/premature-abstraction" >}}): concrete workflows first, then generalization supported by evidence.
- [A Practical Way to Study Coding-Agent Improvements]({{< ref "ai-engineering/agents/evaluation/coding-agent-experimentation-primer" >}}): choosing a study method for a coding-agent question, with grounded theory among the methods.
- Grounded Theory in AI Failure Analysis: failure analysis as an adaptation of grounded theory, with sampling and saturation problems.
- [Failure Understanding in AI Evaluation]({{< ref "ai-engineering/evaluation/framework/20-error-analysis" >}}): comparing incidents to build failure categories and turn them into criteria.
- Reflective Practice: learning from experience and challenging assumptions.
- Grounded theory sources: Glaser and Strauss, Charmaz, Birks and Mills, and a grounded theory study of software testing.

## References


- Frensch, P. A., & Funke, J. (Eds.) (1995). [Complex Problem Solving: The European Perspective](/sources/fa071f1fee948fe9ce3ecbd3bafae933.bin). Lawrence Erlbaum. ^frensch-1995
- Lipenkova, J. (2025). The Art of AI Product Development: Delivering Business Value. Manning. ISBN 9781633437050. ^lipenkova-2025
- Montgomery, D. C. (2017). Design and Analysis of Experiments (9th ed.). Wiley. ^montgomery-2017
- Sculley, D., Holt, G., Golovin, D., Davydov, E., Phillips, T., Ebner, D., Chaudhary, V., Young, M., Crespo, J.-F., & Dennison, D. (2015). [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems). NeurIPS 2015. ^sculley-2015
