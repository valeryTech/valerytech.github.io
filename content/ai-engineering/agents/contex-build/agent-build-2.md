---
draft: false
toc: true
title: "Agent Build 2"
linkTitle: "Agent Build 2"
---
# Rebuild `AGENTS.md` As A Thin Contract Over A Central Agent Handbook

## Summary


Redesign the repo so `AGENTS.md` is a strict, short contract and navigation layer, while a centralized handbook under `docs/` becomes the durable system of record. This follows the strongest lesson from the OpenAI note: a giant `AGENTS.md` wastes context, drifts out of sync, and forces agents to carry too much generic guidance into every task.

The new system should optimize for four goals:

- Fast orientation: an agent can decide what to do next in under a minute.
- Enforceable behavior: important rules are checkable in CI, scripts, or review rubrics.
- Low-context execution: only task-relevant docs are loaded after the root map.
- Continuous maintenance: repeated human feedback is promoted into docs, checks, or automation.

## Structure And Interfaces

### Root interface


Replace the current root `AGENTS.md` with a strict map of roughly 100-150 lines. It should contain only:

- Purpose and precedence
- Command policy and environment invariants
- Task-type matrix for required checks
- Stop/escalation rules
- Review contract
- Pointers to deeper docs by task type

Root `AGENTS.md` should answer only:

- What is this file for?
- What must always be obeyed?
- Which deeper doc should I open next?

### Central handbook


Replace `docs/agentic-docs/` with a cleaner, centralized handbook, for example:

- `docs/handbook/README.md`
- `docs/handbook/01_operating-model.md`
- `docs/handbook/02_task-routing.md`
- `docs/handbook/03_engineering-standards.md`
- `docs/handbook/04_review-and-quality.md`
- `docs/handbook/05_feature-doc-contract.md`
- `docs/handbook/06_golden-principles.md`
- `docs/handbook/07_maintenance-and-governance.md`

Document responsibilities:

- `01_operating-model.md`: human/agent roles, intent-first workflow, when agents should stop
- `02_task-routing.md`: which docs to open for bugfix, feature, refactor, review, docs-only, release work
- `03_engineering-standards.md`: coding constraints, package/tooling policy, architecture invariants
- `04_review-and-quality.md`: required checks, review rubric, acceptance thresholds, determinism rules
- `05_feature-doc-contract.md`: required artifacts and what each one must contain
- `06_golden-principles.md`: opinionated rules that protect legibility and consistency
- `07_maintenance-and-governance.md`: ownership, update triggers, audit cadence, promotion rules

### Feature and domain docs


Keep feature intent outside the handbook:

- `docs/features/<feature>/` for active or high-value feature contracts
- `docs/architecture/` for system and domain maps if needed
- `docs/runbooks/` for operational or debugging flows if needed

Every feature folder should use a slim, explicit contract:

- `00_context.md`
- `01_rfc.md`
- `02_acceptance.md`
- `03_design.md`
- `04_workplan.md`
- `05_test-plan.md` only when risk warrants it
- `06_rollout.md` only when rollout complexity warrants it

## Goals, Principles, And Practices

### Goals


- Make repository knowledge discoverable and legible to agents
- Reduce repeated human steering on routine engineering behavior
- Preserve architectural coherence as throughput increases
- Keep docs small enough to load selectively and maintain continuously

### Principles


- `AGENTS.md` is a table of contents, not the encyclopedia
- Rules belong as close as possible to enforcement
- Stable rules live at the root; changing guidance lives deeper
- Repo knowledge beats tribal knowledge
- Human taste should become explicit policy, then automation where possible
- Constraints should be strongest at boundaries and lighter inside them
- Documentation is part of the runtime environment for agents, not secondary prose

### Maintenance practices


- Any PR that changes workflow, quality gates, architecture boundaries, or operating conventions must update the relevant handbook doc in the same PR
- Any feedback repeated twice should be triaged into one of four destinations:
  - root rule
  - handbook update
  - feature contract change
  - automated enforcement
- Run a weekly handbook audit for stale content, broken links, duplicated rules, and docs that no longer match code reality
- Run a monthly cleanup pass for "golden principle" violations and open targeted refactor tasks
- Prefer deleting obsolete guidance over accumulating exceptions
- Keep root `AGENTS.md` intentionally hard to grow; new additions require proving they apply to most tasks

## Migration Plan


- Rewrite `AGENTS.md` from scratch instead of editing the current rule-dense version in place
- Replace `docs/agentic-docs/` with `docs/handbook/` and rewrite the playbooks to match the new split
- Fix the current documentation inconsistencies during migration rather than preserving them
  Current examples include broken or malformed path references in the existing playbooks
- Create one canonical feature-doc contract and remove overlapping playbook language
- Add a short index in `docs/handbook/README.md` showing "if task is X, open Y next"
- Optionally add lightweight validation later for link integrity, required doc presence, and stale-doc detection

## Test Plan


Validate the new system with these scenarios:

- A fresh agent can complete a docs-only task after reading only `AGENTS.md` and one linked handbook doc
- A feature task routes from `AGENTS.md` to the correct handbook doc, then to the correct feature contract, without ambiguity
- A review task produces findings-first behavior using only the root review contract plus the review handbook doc
- A workflow change PR clearly implies a handbook update in the same change
- A stale or contradictory rule is caught in the weekly audit
- Root `AGENTS.md` remains short after multiple feature additions because details are routed into the handbook instead

## Assumptions And Defaults


- Use the OpenAI model as the primary design input: short root file, repository knowledge as system of record, recurring cleanup, and promotion of repeated taste into enforcement
- Choose a strict-map root rather than a balanced or monolithic `AGENTS.md`
- Use a centralized handbook rather than domain-local playbooks as the default topology
- Treat the current playbooks as disposable inputs, not constraints; rewrite them cleanly instead of adapting around their current structure
