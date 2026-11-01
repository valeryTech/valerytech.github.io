---
draft: false
toc: true
title: "Workflow Example: Frame a Problem"
description: "A concrete workflow for framing a problem with a coding assistant, turning a rough request, idea, or report into a short brief that design or implementation can act on without guessing intent."
linkTitle: "Workflow: Frame a Problem"
---

This note is a concrete example of the six-part workflow format in [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}). It covers the **Frame a problem** task type from [Task Types in Engineering Work]({{< ref "ai-engineering/agents/sdlc/task-types" >}}) and draws on [Defining the Product Before Building]({{< ref "ai-engineering/agents/ai-assisted-development/product-framing" >}}). Like any workflow built before case data exists, it starts as a draft hypothesis to test and trim on actual tasks ([Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}})).

Unlike [Workflow Example: Fix a Bug]({{< ref "ai-engineering/agents/sdlc/workflow-fix-a-bug" >}}), this task type produces a document with no test suite to prove it right. The main risk is that an agent guesses product intent or turns a suggested solution into fixed requirements without checking the problem or the code.

## 1. Scope and Starting Input


- **Task type:** Frame a problem (produces a short brief, with no shipped code).
- **Activities used:** Framing and investigation.
- **Starting input:** Any unframed request or trigger: a rough idea, user feedback, a chat thread, an incident follow-up, a ticket, or a bug report where expected behavior is unclear.
- **Output:** A short brief stating who is affected, the problem to solve, current behavior checked in the code, the intended change, what is included and excluded, fixed constraints, assumptions, and open decisions for the owner.
- **Out of scope:** System architecture and technical design (use **Write or revise a design document**), breaking an agreed design into pull requests (use **Plan a change**), and writing production code.

## 2. Steps


| Step | Activity | Participant | What happens | Output |
| :--- | :--- | :--- | :--- | :--- |
| **1. Check current behavior and history** | Investigation | Collaborator agent | Read the rough input, relevant product docs, past decisions, issues, and the code that currently handles this area. Record what the system actually does today with file references, and list what was not checked. | Note on current behavior with file references |
| **2. Draft the brief and list open decisions** | Framing | Collaborator agent | Separate the problem from any solution suggested in the request. Draft a short brief (people affected, job and outcome, intended change, scope, fixed constraints, assumptions) and list only the open choices whose answers would change the next decision. | Draft brief and open decisions |
| **3. Check facts and questions** | Verification and review | Engineer | Verify claims about current behavior against the repository. Remove implementation choices that slipped in as product requirements, and cut questions the code or docs already answer. | Reviewed draft ready for the owner |
| **4. Decide open product choices** | Framing | Owner (product owner or tech lead) | Answer the open decisions, confirm who is affected and what is in or out of scope, and decide whether the next step is a prototype, a supported feature, a bug fix, or no action. | Product decisions and approved scope |
| **5. Finalize the brief and hand off** | Framing | Collaborator agent and engineer | Update the brief with the owner's decisions, keep remaining assumptions visible with what would make the team revisit them, and name the next task type (such as **Write or revise a design document**, **Implement a feature**, or **Fix a bug**). | Approved brief and next task |
| **6. Record documentation gaps** | Upkeep | Engineer | When framing stalled because product behavior, domain rules, or ownership were undocumented or contradicted the code, update the canonical product doc. | Doc update (when needed) |

## 3. Decision Points


Work pauses for a person at two points:

- **After step 2 (engineer review):** The engineer checks the draft brief before sending it to the owner. This catches misread code, questions that can be answered from the repository, and technical choices disguised as product requirements.
- **After step 3 (owner decision):** The product owner or owning lead answers open product choices, confirms scope and exclusions, and commits to whether work proceeds (and as a prototype, a supported feature, or a bug fix). The agent prepares options and their effects; a person makes product commitments ([Participants and Substrates]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}})).

For a small, reversible clarification (such as an edge case in an internal tool), the engineer who owns the area can combine steps 3 and 4 in one short pass. For work that changes user promises, billing, permissions, security, external APIs, or stored data, keep step 4 with the named product or architecture owner and store the brief where later tasks read it ([Adjusting the Level for One Task]({{< ref "ai-engineering/agents/sdlc/task-types" >}}#adjusting-the-level-for-one-task)).

## 4. Checks


- **Self-checks (steps 1 and 2):** The collaborator agent cites exact files or docs for every claim about current behavior, lists areas it did not read, keeps current behavior separate from intended behavior, checks that every open question would change the next decision, and leaves storage, services, and APIs undecided unless they are fixed constraints.
- **Independent checks (steps 3 and 4):** The engineer checks the agent's code claims against the repository and verifies that a suggested solution in the request did not hide the underlying problem. The owner reads the brief against user and business context that is outside the repository. For a large or risky change, a second engineer or fresh reviewer agent reads the brief alone to check whether someone could design or build from it without guessing product intent.

## 5. Backtracks


- **The request names a solution with no clear problem (step 2 or 3):** Pause drafting requirements and ask the requester what job or failure triggered the request before scoping features.
- **An open decision depends on an unknown fact in the system or data (step 4):** Stop framing and run a short bounded investigation (**Investigate a problem**, **Analyze the impact of a change**, or **Spike or prototype**), then return to step 2 with the finding.
- **Current code already does what is asked or contradicts the product docs (step 1 or 3):** Stop and show the owner the current behavior and docs; the work may become a documentation update, a bug fix, or a closed request.
- **The scope is too big for one buildable brief (step 2 or 4):** Split it into a small first release with clear limits and separate follow-up briefs for later situations.

## 6. Placement in a Project's Setup


| Workflow element | Where it lives | How it holds |
| :--- | :--- | :--- |
| Brief template (people, job, current behavior, intended change, scope, fixed constraints, assumptions, open questions) | Written practice in the [Agent Development Environment]({{< ref "ai-engineering/agents/environment/ade" >}}) (project docs or issue template) | Guidance that people and agents fill out and owners review |
| Framing instructions (separate current behavior from intent, list only questions that change the next decision) | Skill in the [agent customization]({{< ref "ai-engineering/agents/customization/agent-customization" >}}) | Loaded when framing an unclear request |
| Product docs and past decision records the agent reads in step 1 | Project knowledge in the ADE (`docs/product/`, `docs/adr/`) | Source of truth for existing commitments |
| Requirement for owner approval of the brief before starting design or implementation on unclear work | Team intake practice and [authority layer]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}#contributions-effects-and-commitment-points) (owner approval at handoff) | Enforced by owner approval before implementation starts |

## Testing and Trimming This Workflow


Run this workflow on a few unframed requests in one project and record each case ([Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}})). Watch for two signals:

- **Steps that earn their keep:** cases where step 1 exposed existing behavior nobody remembered, or where step 4 stopped the team from building the wrong feature or debating product intent during code review.
- **Steps that add friction without changing decisions:** if the brief template feels heavy on small requests, trim it to a five-line note (problem, current behavior, intended change, exclusions, open questions) and keep the full brief only for larger features or changes with several stakeholders.
