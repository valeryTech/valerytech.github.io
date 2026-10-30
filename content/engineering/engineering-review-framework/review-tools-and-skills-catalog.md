---
draft: false
toc: true
description: "Local wrappers, unfinished review experiments, and skill collections, with short descriptions and possible uses in the Engineering Review Framework."
title: "Review Tools And Skills Catalog"
linkTitle: "Review Tools and Skills Catalog"
---

These are current examples of the agents, skills, workflows, and harnesses described in [Review Agents, Skills, and Tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}}). Other implementations can fill the same roles or address new review needs.

Local sources inspected on 2026-04-20. Descriptions reflect the current source files; the tools and skills were not executed as part of this inventory. Links point to local checkouts.

## Wrappers and review experiments


| Project or note | What it contains | Possible use in the framework |
| --- | --- | --- |
| agent-harness | Python orchestration for staged design, implementation, separate verification and critique, and recorded execution evidence. Workers start as fresh Codex processes with role-specific inputs and permissions. | Explore separate reviewers for requirements, design, implementation, and verification. The orchestration exists; the investigation into an effective isolated-agent review system is unfinished. |
| System/PR review notes | Experimental review reasoning: reconstruct the system and change, challenge important claims, and build executable experiments to look for failures. | Supply ideas for technical review when inspection leaves a concrete question, such as retry safety or compatibility. These are research notes, with alternative flows still being explored. |
| agent-harness-prompt-practices | A worktree of the same harness repository on `codex/llm-specified-prompt-practices`. Current prompt work covers evidence, minimalism, fact checks, review, and correction. | Experiment with how reviewer instructions affect unsupported findings, unnecessary changes, and verification claims. Treat it as a prompt experiment within the unfinished harness investigation. |
| agent-workflow / EML | Local skill packaging, stage prompts, and workstream helpers, including `rws` and `build-data-viewer`. The Python CLI currently has a minimal placeholder entry point. | Use the stage-wrapper design as a smaller way to explore one fresh-context analysis at a time. The useful entry here is the skill and its references. |

### What isolation currently means


The framework's [Backward Design and Independent Verification]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}}) note summarizes the two approaches explored in the harness and links to the original investigation, including failure-based coverage and independent test authorship.

In `agent-harness`, the worker adapter starts an ephemeral process for each stage. Design and review roles use read-only access; implementation roles can write. Some verification roles receive behavioral requirements without the implementation plan, and critics receive separate inputs.

In `rws`, the child receives no inherited conversation, only the selected task, stage instructions, sources, required prior analysis, and one output destination. It shares the filesystem with the parent. Its restricted output scope is an instruction; fresh context alone does not establish filesystem isolation or independent evidence.

The current `rws` registry covers workflow, conditions, responsibilities, interface, workflow verification, and architecture. General PR-review stages would need explicit definitions.

A small experiment for this framework could give two fresh reviewers the same requirements and revision: one checks requirements and scope; the other checks technical behavior and simplicity. Keep their initial findings separate, then examine the supported issues together. Add an executable probe when a specific claim needs testing. This is a proposed trial, not a validated review recipe.

## Local skills

### Harness and EML


The two EML source locations below contain different skills; their directory names alone do not establish which are installed.

| Skill | Description and framework use |
| --- | --- |
| applying-minimalism (worktree version) | Tests whether added behavior or structure is necessary; prefers omission, reuse, adaptation, and composition. Supports the engineering-principles review while preserving required behavior and safeguards. |
| rws | Runs one named stage in a fresh-context subagent and saves its result. Supports experiments with separately scoped analysis and verification. |
| build-data-viewer | Builds a local viewer for evaluation datasets, coverage, cases, and provenance. Useful when reviewing an evaluation dataset or harness. |
| product-framing | Clarifies actors, intended outcomes, workflows, capabilities, and scope. Supports business context and requirements when product intent is unclear. |
| experiment | Defines a decision-relevant empirical question, evidence, and verdict. Supports uncertain product or quality claims; its current emphasis is product experiments. |

### Ponytail


| Skill | Description and framework use |
| --- | --- |
| ponytail-review | Reviews a change and connected callers for defects, security, expected load, missing tests, performance, and unnecessary code. A candidate for the main technical review; reports findings without editing code. |
| ponytail-audit | Maps and reviews a repository or subsystem, then ranks findings. Useful for an explicitly broader system review. |
| ponytail | Guides implementation toward the smallest complete change, reuse, and preserved safeguards. Useful when addressing accepted findings. |
| ponytail-debt | Lists recorded `shortcut:` and older `ponytail:` comments. Helps reviewers inspect deliberate limitations and whether their conditions still hold. |
| ponytail-help | Explains the collection's commands and levels. A usage reference. |
| ponytail-gain | Displays the project's benchmark savings. Background for evaluating the tool; it supplies no evidence about the change under review. |

### Matt Pocock: review and engineering reasoning


| Skill | Description and framework use |
| --- | --- |
| code-review | Runs separate Standards and Spec reviewers against a fixed comparison point. Supports checking conventions, requirement coverage, and scope. Its code-smell suggestions remain contextual heuristics. |
| diagnosing-bugs | Builds a reproducible failure, narrows it, tests hypotheses, and verifies a fix. Useful for investigating a concrete review finding. |
| codebase-design | Examines how much behavior a module provides behind its interface and where it can be tested. Supports abstraction, coupling, and testability discussions. |
| improve-codebase-architecture | Finds architectural friction and presents possible refactorings. Useful for a focused design review when maintainability is part of the task. |
| tdd | Develops behavior through failing and passing tests at agreed interfaces; discusses weak assertions and implementation coupling. Useful for test review and regression fixes. |
| domain-modeling | Clarifies domain terms and records them in glossaries and architecture decisions. Supports requirements and contract discussions. |
| grilling, grill-me | Questions unresolved design decisions; `grill-me` delegates to `grilling`. Useful when a consequential assumption needs clarification. |
| grill-with-docs | Combines design questioning with domain documentation. Useful when review resolves a decision that should be retained. |
| research | Investigates primary sources and records cited findings. Supports checking unfamiliar APIs, dependencies, or technical claims. |
| prototype | Builds a disposable logic or UI prototype to answer a design question. Useful when behavior needs to be exercised before a decision. |
| pr | Writes a concise change description with before/after evidence and consequences. Supports author preparation and makes review evidence easier to inspect. |

These are different review lenses. A standards/spec check does not establish all runtime properties, and a defect review still needs the intended requirements. Select the lens that addresses the actual question.

### Other skills in the directory


These are supporting options, with a smaller or indirect role in review.

| Skills | Description and possible use |
| --- | --- |
| ask-matt, setup-matt-pocock-skills | Select a skill and configure the collection's project conventions. Relevant when adopting this collection. |
| to-spec, to-tickets | Turn agreed work into a specification and dependent implementation slices. Can preserve requirements and follow-up work identified during review. |
| implement, implement-spec | Implement specified work, with the latter coordinating a task graph. Relevant after findings become accepted implementation tasks. |
| triage, wayfinder | Classify incoming work or resolve a larger set of decisions. Useful when review reveals a separate investigation. |
| retro, writing-for-agents | Learn from agent sessions and improve instructions. Can refine review prompts after observing repeated misses or false positives. |
| handoff | Records context and source pointers for another agent. Useful for continuing an investigation; it carries previous reasoning forward. |
| to-questionnaire | Packages unanswered decisions for someone with the needed knowledge. Useful for unresolved requirements. |
| teach, wait-what | Explain a concept or rephrase an unclear answer. Communication support for review discussions. |
| wizard | Builds a guided script for steps requiring human action. Occasionally useful for environment setup or manual verification. |
| setup-pre-commit, git-guardrails-claude-code | Set up commit-time checks or Git command guards. Support automated checks and agent access controls. |
| migrate-to-shoehorn, scaffold-exercises | Migrate TypeScript test fixtures or create learning exercises. Specialized utilities with no general review role. |

The collection also has an explicit `in-progress` directory:

- chief-of-staff coordinates longer agent work; claude-handoff continues work in a fresh background agent. Possible orchestration references, still marked in progress.
- loop-me explores workflow specifications through questions; setup-ts-deep-modules configures TypeScript module-boundary checks. Possible requirements and architecture support.
- writing-fragments, writing-shape, and writing-beats collect and organize writing material. They have no direct engineering-review role.

## Using this catalog


For an ordinary change, select a relevant review skill and supply the purpose, requirements, comparison point, and surrounding code. Use the [reference lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}) to identify any additional concern. Bring in a focused investigation only when it answers a concrete review question.

The wrappers are ways to arrange the work; the skills provide instructions for particular activities. Several skills also edit files, commit changes, or publish tracker items, so their described workflow should be checked when selecting them. Listing a skill here does not invoke it or make it a required part of review.

See [Review Agents, Skills, and Tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}}) for shared guidance on context, access, and assessing findings.
