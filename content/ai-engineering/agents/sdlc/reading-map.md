---
draft: false
toc: true
title: "SDLC Workflows: Reading Map"
description: "Links to vault notes on engineering workflows, grouped by topic: the lifecycle, discovery, work with assistants, review, decisions, investigation, evidence, reflection, bottom-up learning, and the agent environment."
linkTitle: "Reading Map"
---

This map collects notes related to [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) and the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}). Each section groups notes by topic, with one line on what each note covers.

## Engineering lifecycle


- [Discovery and Delivery]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}): the decision, the evidence needed, and the obligations involved decide whether work is discovery, delivery, or both.
- [Principles and Decision Logic for AI Product Work]({{< ref "ai/product/operating-model/operating-model" >}}): eight principles that connect the condition to improve, alternatives, assumptions, and production responsibilities to the next commitment.
- [Production Commitment]({{< ref "ai/product/operating-model/production-commitment" >}}): a production promise includes limits and failure behavior; a commitment record makes accepted uncertainty explicit.
- [Solution Utility Ladder]({{< ref "ai/product/operating-model/solution-utility-ladder" >}}): steps from valid output to job completion, improvement over alternatives, and the intended change.
- [AI Product Design and Delivery Framework]({{< ref "ai-engineering/delivery/design-and-delivery" >}}): a lifecycle that links problem framing, system design, build, release, and operation.
- [Problem and Response Cycle]({{< ref "ai-engineering/delivery/outer-cycle" >}}): frame the problem and desired outcome before choosing a response, and define evidence that may require revising or stopping the project.
- [AI Product Improvement System]({{< ref "ai-engineering/evaluation/framework/product-improvement-system-revised" >}}): the improvement cycle on a running product: probe and observe, build understanding, decide what should change, implement and validate, and verify the effect.
- [Goals of AI Product Delivery]({{< ref "ai-engineering/approach/goals" >}}): user-task success as the top goal, with contracts, controlled changes, failure diagnosis, and production feedback as supporting capabilities.
- [Engineering Delivery Techniques Guide]({{< ref "engineering/delivery-techniques/engineering-delivery-techniques-guide" >}}): choose a delivery technique by uncertainty and lifecycle stage.
- [Walking Skeleton: Workflow Validation]({{< ref "engineering/delivery-techniques/walking-skeleton-workflow-validation" >}}): one narrow end-to-end workflow to check boundaries, contracts, observability, and failure handling first.

## Discovery, uncertainty, and prototyping


These notes cover the discovery side of the lifecycle: working before the problem is precise, naming which unknowns are open, and using cheap prototypes to learn. Start with the operation model, which describes the process, then the uncertainty ladder.

- [Exploratory Design Inquiry: Operation Model]({{< ref "ai/product/discovery/analysis-or-operation-model" >}}): the discovery process. The object of inquiry is an evolving situation model (frames, observations, questions, possibilities, commitments), and each move (research, reframing, prototype, comparison) is chosen for what it can reveal next.
- [Uncertainty Ladder]({{< ref "ai/product/discovery/uncertainty-ladder" >}}): five kinds of unknown between an idea and its effect (possibility, approach, feasibility, operation, value), and what evidence would close each for one claim.
- [Uncertainty Ladder Applied to the Cases]({{< ref "ai/product/discovery/uncertainty-ladder-applied" >}}): the ladder on Wallet capture, the Still companion, and the recruiting coordinator, with a table of open rungs.
- [Uncertainty Ladder: Sources and Earlier Draft]({{< ref "ai/product/discovery/uncertainty-ladder-sources" >}}): research support for the ladder and how each rung links to probes, diagnosis, and planning.
- [Discovery, Prototyping, and Sensemaking: Document Map]({{< ref "ai/product/discovery/map" >}}): your own reading path through the discovery notes, with a suggested starting order.
- [LLM Roles in Discovery]({{< ref "ai/product/discovery/discovery-llm-roles" >}}): an exploration brief that gives an LLM purpose and room to make possibilities concrete, kept apart from the note that holds the current situation.
- [Structuring Exploratory Design Inquiry]({{< ref "ai/product/discovery/discovery-analysis" >}}): five layers that connect the choice of move (frame, learn, expand, distinguish) to the situation model and six principles.
- [Exploratory Design Inquiry: Research Synthesis]({{< ref "ai/product/discovery/inquiry-research-synthesis" >}}): Schön's problem setting, sensemaking, co-evolution, and how prototypes and comparisons reshape understanding.
- [Exploratory Discovery and Prototyping: Research Notes]({{< ref "ai/product/discovery/discovery" >}}): the long research notes behind the synthesis, using search over personal notes as the example.
- [Discovery Vocabulary]({{< ref "ai/product/discovery/dictionary" >}}): how sketches, frames, prototypes, observations, rationale, and decisions differ from the product they lead to.
- [Discovery Approaches: Relations and Proposed Edits]({{< ref "ai/product/discovery/discovery-relations-and-proposed-changes" >}}): learning within one inquiry vs. across cases vs. across applications.
- [Discovery Directions Map and Recall Audit]({{< ref "ai/product/discovery/discovery-directions-and-recall-audit" >}}): a cross-topic map of bottom-up learning, with search coverage and limits.
- [Risk, Assumptions, and Evidence]({{< ref "ai/product/risk-areas/risk-areas-model" >}}): what must be true, what supports it, and what failure would cost, for the intended change, the solution, and operation.
- [Sensemaking and Epistemic Action]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}): people and AI revise representations, hypotheses, and beliefs during an investigation.
- [AI Discovery Platform]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}}): the loop from uncertainty to experiment, evidence, and decision, with disposable prototypes and durable evidence.
- [Baseline, Prototype, and Feasibility]({{< ref "ai-engineering/delivery/df-prototype" >}}): a thin, instrumented end-to-end baseline for testing feasibility before production hardening.
- [Walking Skeleton: Definition and Examples]({{< ref "engineering/delivery-techniques/walking-skeleton-basics" >}}): the first delivery slice, its acceptance criteria, and its lifespan.
- [Experiments vs. Features: Practitioner Excerpts]({{< ref "ai/product/product-model/experiments-vs-features" >}}): roadmaps built on timeboxed experiments and capability funnels.
- AI Prototyping at Uber: an experience report on prototypes for exploration, alignment, and scope decisions.

## Work with software assistants across the lifecycle


- [Building and Reviewing Software with AI]({{< ref "ai-engineering/agents/ai-assisted-development" >}}): index of the series that follows a change from product framing through coding-agent work, testing, and merge review.
- [Defining the Product Before Building]({{< ref "ai-engineering/agents/ai-assisted-development/product-framing" >}}): a brief that separates agreed requirements from existing behavior, assumptions, and open choices.
- [Working with a Coding Agent]({{< ref "ai-engineering/agents/ai-assisted-development/working-with-an-agent" >}}): the loop of defining, building, explaining, testing, and reviewing a change, with focused investigations and clear decision ownership.
- [Common Mistakes in AI-Assisted Development]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}}): guessed requirements, missed callers, unnecessary machinery, and unsafe API assumptions that pass tests, with ways to correct them.
- [Project Understanding and Ownership]({{< ref "ai-engineering/agents/project-ownership" >}}): how coding agents can hide gaps in a team's knowledge of its system; comprehension and intent debt.
- [Progressive Autonomy in AI Workflows]({{< ref "ai/design/workflow-design/workflow-design" >}}): inspectable decisions and explicit action limits as a path from recommendations to bounded execution.

## Review and verification


- [A Practical Review Process]({{< ref "ai-engineering/agents/ai-assisted-development/review-process" >}}): eight review steps from intended behavior to a recommendation grounded in evidence.
- [Reviewing Software Changes]({{< ref "ai-engineering/agents/ai-assisted-development/code-review" >}}): follow a change through requirements, surrounding code, design, and tests; treat explanations as claims to check.
- [Testing a Change During Review]({{< ref "ai-engineering/agents/ai-assisted-development/testing-during-review" >}}): the payment-retry example with a lost response after commit.
- [Independent Verification Workflows for Coding Agents]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}}): why LLM-written tests and reviews repeat the code's assumptions, and how the `agent-harness` and `$rws` workflows separate who defines correctness, who implements, and who tries to disprove the result.

### Engineering Review Framework


The framework in [topics/engineering/engineering-review-framework]({{< ref "engineering/engineering-review-framework" >}}) reviews a change in layers: context and requirements first, then principles and technical quality, then testing, AI-specific risks, and tools.

- [Engineering Review Framework Overview]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}): the review layers and the order in which to use them.
- [Engineering Review Framework: Rationale and Use]({{< ref "engineering/engineering-review-framework/framework-rationale-and-use" >}}): how to keep context, choose review depth, and scale it to consequence and reversibility.
- [Business, Product, and Feature Context]({{< ref "engineering/engineering-review-framework/business-product-and-feature-context" >}}): the business problem, users, expected outcome, scope, constraints, and success measures of a change.
- [Requirements and Quality Targets in Review]({{< ref "engineering/engineering-review-framework/requirements-and-quality-targets" >}}): define behavior, quality targets, constraints, and verification criteria before judging the implementation.
- [Software Engineering Principles]({{< ref "engineering/engineering-review-framework/software-engineering-principles" >}}): shared engineering goals across paradigms, with design techniques that fit the language and dependencies.
- [Technical Review Guide]({{< ref "engineering/engineering-review-framework/technical-review-guide" >}}): logic, APIs, state, data, dependencies, security, and operability.
- [Testing, CI, and PR Review Guide]({{< ref "engineering/engineering-review-framework/testing-ci-and-pr-review-guide" >}}): how tests, CI, author preparation, and human review combine.
- [LLM-Specific Review Guide]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}}): invented APIs, unsupported assumptions, weak tests, and unverified execution claims in AI-assisted changes.
- [Backward Design and Independent Verification]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}}): work backward from outcomes to required behavior, then design checks around consequential failures.
- [Engineering Review Framework: Assessment and Trial]({{< ref "engineering/engineering-review-framework/workflow-trial-and-recommendations" >}}): a trial on a payment-retry change and five proposed revisions to the framework.
- [Review Agents, Skills, and Tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}}): roles for agents, skills, and tools, chosen by the review question.
- [Review Tools and Skills Catalog]({{< ref "engineering/engineering-review-framework/review-tools-and-skills-catalog" >}}): local wrappers, review experiments, and the EML, Ponytail, and Matt Pocock skill collections.
- [Engineering Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}): reference lists for each review layer.

## Skills for each workflow activity


The [Review Tools and Skills Catalog]({{< ref "engineering/engineering-review-framework/review-tools-and-skills-catalog" >}}) describes these skills in the context of review. The table below groups the same skills by the six activities in [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}). Links point to local checkouts under `~/projects`. Several skills edit files, commit, or publish tracker items, so check a skill's workflow before using it. Most of these skills support review and implementation. For discovery and prototyping, use EML prototype, which answers one decision-relevant question with the smallest credible runnable artifact, together with Pocock prototype and research and EML experiment.

| Activity | Skills | What they help with |
| :--- | :--- | :--- |
| **1. Problem & product framing** | EML product-framing; Pocock domain-modeling, grilling / grill-me, to-questionnaire, loop-me (in progress) | Clarify actors, outcomes, scope, and domain terms; question unresolved decisions; package open questions for the person who can answer them |
| **2. Investigation & uncertainty reduction** | Pocock research, prototype, diagnosing-bugs, triage; EML prototype, experiment | Check primary sources, build a disposable prototype that answers one question, reproduce a failure and test hypotheses, define a decision-relevant experiment |
| **3. Trade-off analysis & design** | Pocock codebase-design, improve-codebase-architecture, grill-with-docs, wayfinder; harness applying-minimalism | Judge module depth, coupling, and testability; find architectural friction; question and record design decisions; test whether added structure is necessary |
| **4. Implementation** | ponytail; Pocock tdd, to-spec, to-tickets, implement, implement-spec | Keep the change small and complete; develop behavior through tests at agreed interfaces; turn agreed work into a spec and slices |
| **5. Verification & review** | ponytail-review, ponytail-audit, ponytail-debt; Pocock code-review, pr; EML rws | Review a change and its callers, audit a subsystem, inspect recorded shortcuts, run separate standards and spec reviewers, describe a change with evidence, run one analysis stage in a fresh context |
| **6. Release, upkeep & reflection** | Pocock retro, writing-for-agents, handoff, setup-pre-commit, git-guardrails-claude-code | Learn from agent sessions and improve instructions, pass context to the next session, add commit-time checks and Git guards |

## Decisions, options, and trade-offs


- [Making System Design Decisions]({{< ref "ai-engineering/agents/ai-assisted-development/system-design-decisions" >}}): components, data ownership, failure rules, focused checks of assumptions, and what implementation must preserve.
- [Decision Records for Uncertainty]({{< ref "ai/product/product-model/decision-records" >}}): records for approach decisions, problem reformulations, and reasons to continue, change, or stop work.
- [Common Trade-offs in System Design]({{< ref "system-design/elements/common-trade-offs" >}}): recurring trade-offs, what each side gains and costs, and the signal that tips the choice.
- [System Design Problem-Solving Checklist]({{< ref "system-design/problem-solving-checklist" >}}): framing a design problem, tracing behavior, comparing alternatives, and checking failures.
- [Backward Design]({{< ref "engineering/progressive/backward-design-der" >}}): trace user needs through outcomes, workflows, capabilities, and system responsibilities.
- [Intent-Driven Architecture]({{< ref "engineering/progressive/intent-driven-architecture" >}}): domain language, use cases, and decision records that keep intent in the architecture.
- [Design Science Method]({{< ref "ai-engineering/delivery/design-science" >}}): excerpts on problem explication, requirements, alternative designs, and design rationale.
- [Premature Abstraction in Software Design]({{< ref "engineering/premature-abstraction" >}}): speculative generality and the wrong abstraction.
- [Ambiguity in AI Systems]({{< ref "ai/design/ambiguity" >}}): the gap between specified and plausible behavior, and how to match clarification and controls to risk.

## Investigation, debugging, and hypotheses


- [Investigating AI Product Behavior]({{< ref "ai-engineering/causal-stack" >}}): record what happened, compare explanations, test a change, and follow its effect.
- [Debugging a Failed Customer Task]({{< ref "ai-engineering/causal-stack/debugging" >}}): the first visible mismatch guides competing explanations and focused checks before choosing a fix.
- [Cases from Product Use]({{< ref "ai-engineering/causal-stack/cases" >}}): a case links an attempted job to its outcome, with competing explanations and a next check.
- [Claims to Check in Product Work]({{< ref "ai-engineering/causal-stack/claims" >}}): scoped expectations, counterexamples, and revision rules for engineering claims.
- [Focused Checks for AI Product Behavior]({{< ref "ai-engineering/causal-stack/checks" >}}): turn a product question into cases, a judgment rule, and a comparison.
- Hypothesis: working notes on hypothesis-driven design decisions.
- Problem-solving framework v0.1: framing, possible solutions, acting on the best one, and looking back.
- 5 Whys: distinguishing claims from facts in root-cause analysis.
- [Investigation and Epistemics]({{< ref "ai/design-research/04-investigation-and-epistemics" >}}): research notes on investigations with evidence operations, provenance, and explicit uncertainty.

## Evidence and claims


- [Evidence in Software Engineering]({{< ref "engineering/evidence" >}}): what evidence a claim about engineering practice needs.
- [Critical Stance and Evidence-Based Practice]({{< ref "engineering/evidence/critical-stance" >}}): skepticism, practical tests, and reflection; checking a claim vs. examining the measurement behind it.
- [Causal Claims Need a Comparison]({{< ref "engineering/evidence/causal-claims" >}}): a claim that a practice caused an outcome needs a counterfactual.
- [Disciplined AI Experimentation]({{< ref "ai-engineering/approach/experimentation" >}}): an experiment names the decision, baseline, change, cases, and judgment rule.
- [AI Engineering Working Assumptions]({{< ref "ai-engineering/working-assumptions" >}}): plausible proposals are cheap; good experiments and discriminating evidence are scarce.
- [A Reference Example Is Not Ground Truth]({{< ref "ai/product/operating-model/reference-example-is-not-ground-truth" >}}): separate facts, requirements, reference examples, and evaluator judgments.
- [Judgment and Findings in AI Evaluation]({{< ref "ai-engineering/evaluation/framework/30-judgment-and-findings" >}}): criteria, evidence, and explicit denominators for scoped findings.

## Reflection and learning from experience


- Reflective Practice: definitions, levels, and practical strategies for reflection.
- Engineering Knowledge Loop: how repeated delivery experience becomes reusable engineering knowledge, with a local problem-solving loop and a cross-project learning loop.
- Experiential Learning Cycle: source notes on experiential learning, reflective practice, and inductive and abductive learning.
- [Learning Through Real Product Use]({{< ref "ai-engineering/causal-stack/learning-from-real-use" >}}): build one usable path, inspect real attempts, compare changes, and record which questions improved decisions.
- [Data Flywheel]({{< ref "ai-engineering/delivery/flywheel" >}}): turning product use into traceable evidence and reusable learning assets.
- Reflection, Q3 2024: includes the goal to write guides on analyzing requirements and designing complex systems.

## Bottom-up learning and grounded theory


These notes cover building workflows from experience: doing real tasks, comparing the cases, and generalizing what holds. Start with the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}), which describes our approach. The Engineering Knowledge Loop and Reflective Practice are listed under reflection, [Premature Abstraction]({{< ref "engineering/premature-abstraction" >}}) under decisions, and the [Discovery Directions Map]({{< ref "ai/product/discovery/discovery-directions-and-recall-audit" >}}) under discovery. The approach uses grounded theory and Sandbox-First Capability Discovery as methods; the AI Project Foundation and the Engineering Knowledge Loop are earlier notes on the same idea.

- [Bottom-Up Approach to Building Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}): real tasks of a few task types, a minimal starting setup, case records, comparison across cases, and added structure that has to prove its value.
- [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}): recurring kinds of tasks in engineering work, whoever does them, grouped by what they start from and produce, with views, delegation profiles, and measures for each type.
- [AI Project Foundation: Working Draft]({{< ref "projects/ai-dev-foundation/starter-kit-and-foundation" >}}): an earlier draft with an approach inspired by grounded theory for developing shared tools and practices across AI projects.
- [Sandbox-First Capability Discovery for LLM Agents]({{< ref "ai/design/workflow-design/sandbox-first-capability-discovery-llm-agents" >}}): a minimal sandbox, repeated trials, and ablations to find which workflow structures help an agent.
- [Working Ideas: Workflow Evolution and Autonomy]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/09-workflow-evolution-and-autonomy" >}}): starting deterministic and adding the LLM, or starting with the LLM and adding structure after observing its behavior.
- [A Practical Way to Study Coding-Agent Improvements]({{< ref "ai-engineering/agents/evaluation/coding-agent-experimentation-primer" >}}): choosing a study method for a coding-agent question, with grounded theory among the methods.
- Grounded Theory in AI Failure Analysis: failure analysis as an adaptation of grounded theory, with sampling and saturation problems.
- [Failure Understanding in AI Evaluation]({{< ref "ai-engineering/evaluation/framework/20-error-analysis" >}}): comparing incidents to build failure categories and turn them into criteria.
- Grounded theory sources: Glaser and Strauss, Charmaz, Birks and Mills, and a grounded theory study of software testing.

## Agent environment and AGENTS.md


- [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}): what a project gives the people and agents working in it, grouped by kind of artifact (the code, project knowledge, working practices and workflows, commands and tools, checks, repository and platform settings, and setup definitions), with each part's kind of feedforward or feedback control, and how it differs from the harness, the agent customization, and the execution environment.
- [Project Knowledge in the Agent Development Environment]({{< ref "ai-engineering/agents/environment/project-knowledge" >}}): what agents need to know about a project and where it's kept: repository docs split by status, shared agent docs, linked directories, task directories, and local files.
- [Command Layer]({{< ref "ai-engineering/agents/environment/command-layer" >}}): how a repository exposes its workflows through named commands in a task runner.
- [Command Layer: Redesign Notes]({{< ref "ai-engineering/agents/environment/command-layer-2" >}}): stepping back from current Taskfile quirks to environment roles across the engineering workflow.
- [Coordination Mechanisms Between People and Agents]({{< ref "ai-engineering/agents/environment/coordination-mechanisms" >}}): five ways people and agents keep their work coordinated, from step 7 of the Reasoning Log.
- [How Coding Agents Check Actions]({{< ref "ai-engineering/agents/environment/action-checks" >}}): when and how six coding agents check commands, file actions, and network calls.
- [AGENTS.md, Initial Version]({{< ref "ai-engineering/agents/agents-md/agents-md-0" >}}): the first draft of the file and the system around it.
- Agent Features as a Factor in the Design of AGENTS.md: what coding agents can and can't do on their own, a test for each line of a minimal root file, and skills for procedures that only some tasks need.
- [Why It Is Hard to Tell Whether AGENTS.md Works]({{< ref "ai-engineering/agents/evaluation/agents-md-verification" >}}): why behavioral evidence is needed and costly.

## Customizing agents


- [What a Team Can Change Around an Agent Session]({{< ref "ai-engineering/agents/customization/what-can-change" >}}): the task, the model, the harness, the agent customization, the Agent Development Environment, the execution environment, the authority layer, and the participants, with how they differ and where a change belongs.
- [Agent Customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}): the layer for the text the model reads, the settings the harness applies, the code the harness runs, and the agent roles, workflows, and packages that bundle them, which a team creates and shares, separate from the harness and from any one project, and managed like an application's configuration.
- [What a Team Can Set in a Harness It Doesn't Change]({{< ref "ai-engineering/agents/customization/harness-configuration" >}}): instruction files, skills, subagents, tools and commands, permission rules, the sandbox, hooks, and checks in Claude Code, Codex, and Droid, with three properties that decide where each part goes.

## Working material in this folder


- [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}): the six general activities, what each one produces and needs, the problem-solving cycle inside each, which activities each phase uses most, and a template for a project's version of an activity.
- [Testing and Revising the Working Model]({{< ref "ai-engineering/agents/sdlc/model-revision-loop" >}}): a loop that applies the concepts of these notes on real tasks, reflects on whether they helped, and revises them.
- [Two Planes of Goals for Engineering Work with Assistants]({{< ref "ai-engineering/agents/sdlc/goal-planes" >}}): product and engineering goals, two conditions that come from working with agents, and goals for the agent setup and the environment that serve them.
- [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}): what the processes need to achieve, the features of the participants and of the work that make it hard, and ten processes derived from them.
- [Participants, Substrates, and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-processes" >}}): people and agents in their roles, the agent runtime and the Agent Development Environment they work in, and the four nested loops.
- [Features of a Good Approach to Engineering Work]({{< ref "ai-engineering/agents/sdlc/approach" >}}): ten practices for reasoning and deciding in any task, grouped by the four parts of the problem-solving cycle, with examples for each activity.
- [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}): seven cycles from the problem-solving cycle to the improvement cycle and the knowledge loop across projects, and how they fit together.
- [Bottom-Up Approach to Building Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}): also listed under bottom-up learning.
- [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}): domain modeling around `AGENTS.md`: goals, the approach, workflow activities, participants, coordination, and how the vault's cycles fit together.
- [Handoff: SDLC Workflows]({{< ref "ai-engineering/agents/sdlc/sdlc-workflows-handoff" >}}): unfinished blueprint for a fuller note on workflows and the approach.
- [Independent Verification Workflows for Coding Agents]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}}): also listed under review and verification.
