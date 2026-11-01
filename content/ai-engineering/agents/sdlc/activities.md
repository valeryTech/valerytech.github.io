---
draft: false
toc: true
title: "Engineering Activities"
description: "The six general activities of engineering work, what each one produces and needs, the problem-solving cycle inside each, which activities each project phase uses most, and what a project's own version of an activity states."
linkTitle: "Activities"
---

An activity is a kind of engineering work with its own output, context, and definition of done. This note defines the six activities in general terms, so the definitions hold in any project. Each project then implements them in its own way. [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) gives the overview, and [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}) describes the cycles the activities belong to. The [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) tests these definitions against real tasks, which combine activities into task types. The activities first appeared as "types of work" in step 6 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}); step 10 there explains why they're in their own note.

## The Six Activities


Each activity can serve discovery (reducing uncertainty that matters to a decision), delivery (building, verifying, releasing, and operating behavior people can rely on), or both.

1. **Problem & Opportunity Framing:** Understanding who is affected, what needs to change, what the product should promise (and *not* promise), and what open questions remain.
2. **Investigation & Uncertainty Reduction:** Identifying which assumptions could break the plan and testing them against the real code, data, contracts, or running system before committing.
3. **Trade-off Analysis & Design Decisions:** Comparing useful alternatives against real constraints (data ownership, consistency, retries, failure handling, cost) and deciding what implementation must preserve.
4. **Implementation:** Writing the code, configuration, migrations, and tests to fulfill the agreed design.
5. **Verification & Review:** Checking that the change actually works--including failure paths, callers, and edge cases--independently of the author's assumptions.
6. **Release, Operation & Learning:** Deploying with clear limits, monitoring, rollback/recovery, and feeding production evidence back into the next decision.

An activity can be one step of a larger change or a task on its own, such as investigating an incident. Skills that support each activity are listed in the [Reading Map]({{< ref "ai-engineering/agents/sdlc/reading-map" >}}).

## Outputs, Context, and Acceptance for Each Activity


Each activity produces a different output, needs different context from the environment, and has its own definition of done.

| Activity | What We Are Doing | Primary Output / Artifact | What the Agent Needs from the Environment | What "Done / Acceptance" Means |
| :--- | :--- | :--- | :--- | :--- |
| **1. Product Framing & Scoping** *(cf. [product-framing.md]({{< ref "ai-engineering/agents/ai-assisted-development/product-framing" >}}))* | Clarifying who the change is for, the workflow, fixed requirements vs. assumptions, and open questions | Product brief, scope definition, list of open decisions for the owner | Product docs (`docs/product/`, `evergreen/`), existing behavior, issue context | Next step can proceed without guessing product intent; assumptions and open product choices are explicit |
| **2. Investigation & Diagnosis** *(cf. [working-with-an-agent.md]({{< ref "ai-engineering/agents/ai-assisted-development/working-with-an-agent" >}}))* | Answering a specific question about system behavior, reproducing a bug, triaging an incident, or testing an assumption with a prototype | Evidence-backed finding, root-cause diagnosis, reproducer, or measurement note | Codebase, **running local stack**, logs/traces/metrics, diagnostic commands, read-only data access | Question is answered (or bounded) with reproducible evidence, cited files/logs, and explicit statement of what remains unknown |
| **3. System Design & Planning** *(cf. [system-design-decisions.md]({{< ref "ai-engineering/agents/ai-assisted-development/system-design-decisions" >}}))* | Turning intended behavior into components, data ownership, failure/retry rules, trade-offs, and an implementation plan | Design note, ADR (`docs/adr/`), feature contract, or `plan.md` | Architecture docs, existing contracts, schemas, constraints, findings from investigation | Trade-offs and failure modes are addressed; rules that implementation must preserve are explicit; human owner approves key design choices |
| **4. Implementation & Refactoring** | Writing or changing code, configuration, migrations, and tests within agreed design and architecture boundaries | Code/config diff + tests + updated contract/docs | Command layer (`Taskfile`), local conventions, feature contracts, linters, structural checks, test suite | Baseline checks (`task quality:verify`) pass **and** the change satisfies the feature contract / design rules |
| **5. Verification, Testing & Review** *(cf. [code-review.md]({{< ref "ai-engineering/agents/ai-assisted-development/code-review" >}}), [testing-during-review.md]({{< ref "ai-engineering/agents/ai-assisted-development/testing-during-review" >}}))* | Independently checking whether a change or component meets requirements, handles failures, and respects contracts | Review report, failure-mode test cases, eval results, or drift audit | Diff/PR, requirements/brief, feature contracts, running system or test harness, eval datasets | Claims are verified independently of the author's explanation; blocking risks and unverified assumptions are surfaced |
| **6. Environment & Knowledge Upkeep** *(cf. [ade.md]({{< ref "ai-engineering/agents/environment/ade" >}}), build-protocol.md)* | Turning recurring failures or project decisions into better docs, commands, checks, or `AGENTS.md` rules; cleaning up drift | Updated canonical docs, Taskfile target, lint/structural rule, or justified `AGENTS.md` change | Session/review observations, placement rules, change log (`trigger`, `expected effect`, `removal condition`) | Fix is placed at the right layer (preferring enforcement/tooling over prose) and measurably reduces recurring friction |

Row 6 covers only environment and knowledge upkeep. The release and operation part of activity 6 has no row yet.

## The Cycle Inside Each Activity


Inside each activity, the reasoning goes through the four parts of the [problem-solving cycle]({{< ref "ai-engineering/agents/sdlc/cycles" >}}#the-problem-solving-cycle): frame, choose, act, and look back and learn. The table shows what each part looks like in each activity. [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}) lists the practices for each part, with examples for each activity.

| Activity | Frame | Choose | Act | Look back and learn |
| :--- | :--- | :--- | :--- | :--- |
| **1. Framing** | Who is affected and what should change | Which scope and product promise to commit to | Draft the brief; ask the owner about open product choices | Check that the next step can proceed without guessing intent |
| **2. Investigation** | The question, and the assumptions that could break the plan | Which hypothesis to test first, and how | Run a reproducer, query, trace check, or prototype | Record what was observed and what remains unknown |
| **3. Design decisions** | Constraints, failure modes, and what must hold | Compare useful alternatives, including the simplest | Record the decision and what implementation must preserve | Revisit the decision when an assumption behind it fails |
| **4. Implementation** | The agreed design and local conventions | Which small change comes next | Write the change and run baseline checks | Fix from check output; send a broken premise back to design |
| **5. Verification and review** | The requirements and the failure modes that matter | Which checks would expose a wrong implementation | Run the checks independently of the author | State what was checked and what wasn't; decide to merge, request changes, or escalate |
| **6. Release, operation, and learning** | What people may rely on, and the limits | Rollout scope and recovery plan | Release with monitoring and a way to roll back | Feed production evidence and repeated mistakes back into framing and the environment |

## Activities in Each Phase


The [Project Design and Delivery Cycle]({{< ref "ai-engineering/delivery/design-and-delivery" >}}) defines a phase as "a configurable grouping of related activities oriented toward a delivery objective or decision." A phase is a period in a project's life, and an activity is a kind of work. Every phase can use every activity, so each activity is defined once above. The table shows which activities each phase uses most and what objective or decision ends the phase.

| Phase | Objective or decision that ends it | Activities used most |
| :--- | :--- | :--- |
| **1. Product and artifact framing** | Agreed product promises, guarantees, invariants, and use cases that the design builds on | Framing, investigation |
| **2. Design** | An approved design for the system, the AI behavior, and the evaluation harness | Investigation, design decisions, verification and review of the design |
| **3. Baseline and prototyping** | Evidence that the chosen approach works on a narrow baseline (inferred: the source note lists this phase without describing it) | Investigation, implementation of prototypes, verification |
| **4. Build, product evaluation, and release** | A release decision backed by validation evidence and a rollout and rollback plan | Implementation, verification and review, release |
| **5. Operation and evolution** | No final decision: production evidence keeps deciding what to change next | Operation, investigation of incidents, learning and environment upkeep, framing of the next change |

The phase sets the standard for an activity: how much evidence it needs, how much exposure is acceptable, and which obligations apply. An investigation during framing can use a quick prototype. An investigation during operation works against a production system and needs more care. Teams can start at any phase, and later evidence can send work back to an earlier one.

## A Project's Version of an Activity


The definitions above hold in any project. Each project implements each activity in its own way. A project's version of an activity states:

- **Sources of truth:** which docs, contracts, and data the activity reads, and which one wins when they disagree.
- **Commands and tools:** how to run the system, reproduce a problem, run checks, or deploy.
- **Checks:** which checks must pass and which failure modes need a test.
- **Owners and escalation:** who decides what, and when the agent must stop and ask.
- **Local definition of done:** what the output must contain and what evidence it needs.

The column "What the Agent Needs from the Environment" in the outputs table lists what each activity needs in general. A project's version names where those things are in that project. It lives in the project's docs, command catalog (`Taskfile`), and checks, and `AGENTS.md` routes the agent to it with its three jobs: where to look, what differs here, and what done means (step 8 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}})).

A short template for one activity:

```markdown
## Investigation in <project>

- Sources of truth:
- Commands and tools:
- Checks:
- Owners and escalation:
- Done means:
```

## Open Questions


- The outputs table has no row for release and operation; its sixth row covers only upkeep.
- The activity names differ slightly between the list, the outputs table, and the shortcut table in [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}).
- Phase 3, baseline and prototyping, has no description in the source note, so its row above is inferred.
