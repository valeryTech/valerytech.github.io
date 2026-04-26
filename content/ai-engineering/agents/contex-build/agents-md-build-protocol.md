---
draft: false
toc: true
title: "Agents Md Build Protocol"
linkTitle: "Agents Md Build Protocol"
---
# Building `AGENTS.md` with minimalism, modularity, and evidence-based iteration


This document specifies a **protocol** for creating and evolving `AGENTS.md` in an agent-first repository. The emphasis is on:

- starting with an **absolute minimum**,
- adding new elements **one at a time** under explicit criteria,
- keeping `AGENTS.md` **modular** and **short** (a routing layer, not a handbook),
- confirming additions through **observed outcomes** and removing anything that doesn't pay for its context cost.

## 1) What `AGENTS.md` is


`AGENTS.md` is the stable, first-read entry point for agents. It should function primarily as:

- a **repo map / table of contents**,
- a **validation and workflow launchpad**,
- a small set of **high-leverage invariants** (only when necessary).

### Non-goals


`AGENTS.md` is **not**:

- the full engineering handbook,
- a comprehensive architecture document,
- a style guide replacement,
- a dumping ground for "everything important."

## 2) Core design constraints

### Context is a budget


Every line in `AGENTS.md` competes with:

- task context (the actual code, diffs, error logs),
- relevant docs needed for the specific change.

Therefore, `AGENTS.md` must remain **small** and defer details to canonical docs.

### Prefer routes over repetition


When a topic needs more than a few lines, it should be moved to a canonical document and **linked**, not duplicated.

### Prefer enforcement over prose


If a rule is important, aim to eventually:

- enforce it in CI,
- enforce via lint/static analysis,
- enforce via scripts or structural tests.

When enforcement exists, `AGENTS.md` should shrink to a link or short reminder.

## 3) Target structure: core + modules


`AGENTS.md` should be designed as:

- **Core** (always present, minimal, stable)
- **Optional modules** (added only when proven useful; independent; removable)

### 3.1 Core sections (start here and keep forever)


The permanent core should remain extremely small:

1. **Repo purpose**
   - one short paragraph: what the system is, key components, where to start
2. **Required validation**
   - exact commands (tests/lint/build/smoke), not prose
3. **Canonical docs**
   - links to architecture map, plans, security, reliability, specs

If your repo uses "knowledge store" docs (e.g., `docs/` structure), `AGENTS.md` should point to those indexes rather than repeat them.

### 3.2 Optional modules (add only when earned)


Each module should be:

- **self-contained**,
- **scoped to one problem class**,
- **short**,
- **unambiguous**,
- **replaceable** by enforcement or canonical docs.

Examples of modules:

- `## Hard constraints (must not violate)`
- `## Architecture boundaries (layering, deps)`
- `## Data & migrations`
- `## Definition of done (PR expectations)`
- `## Escalate to human when`

## 4) Protocol for adding new elements (evidence-driven)


Every new section or rule is treated as a **hypothesis**.

### 4.1 The "New Element Proposal" format


Before adding anything, write (in a separate log file; see Section 7):

- **Element name**: e.g., "Hard constraints"
- **Motivation**: what failure mode or ambiguity was observed?
- **Expected effect**: what should improve and how will we notice?
- **Scope**: when is it relevant?
- **Location**: does it belong in `AGENTS.md` or a canonical doc?
- **Length limit**: max lines for this element
- **Exit condition**: when to remove/demote it (e.g., once CI enforces it)

### 4.2 Admission criteria (must pass all)


An element may be added to `AGENTS.md` only if:

1. **Evidence exists**
   - There is a recurring failure mode or repeated confusion.
2. **High leverage**
   - It prevents a costly or frequent class of mistakes.
3. **Short**
   - It can be stated in **≤ 5-10 lines** (or a short bullet list).
   - If not, it belongs in a canonical doc with a link.
4. **Stable**
   - It is unlikely to churn weekly.
   - If it will churn, it belongs in scripts/CI or a canonical doc with an owner.
5. **Measurable**
   - You can tell whether it helped by observing behavior or outcomes.
6. **Not redundant**
   - It does not duplicate a canonical doc or already-enforced tooling.

### 4.3 One change at a time


Add only **one element** (or one small edit) per iteration cycle. This makes attribution possible:

- If outcomes improve, you know what changed.
- If outcomes worsen, rollback is obvious.

### 4.4 "Provisional" status


New elements should be marked as provisional for a short window, e.g.:

- "(provisional)" label next to the heading, or
- added behind a short note in the experiment log.

After the evaluation window, either:

- **promote** (keep as standard),
- **revise** (tighten or relocate),
- **remove** (it didn't pay for itself).

## 5) Criteria for modularity


Modularity means each section has a clear job and can be removed without collapsing the rest.

### 5.1 Module boundaries


A module should cover exactly one of:

- "What must never happen" (constraints)
- "How to verify" (validation)
- "Where to look" (navigation)
- "How to finish" (definition of done)
- "When to stop and escalate" (human judgement triggers)

Avoid mixing these concerns.

### 5.2 Independence rules


A module should:

- not require reading another module to understand it,
- avoid nested policies ("see above"),
- prefer links to canonical docs for detail.

### 5.3 Size caps


Set a strict cap:

- Core: ideally **50-120 lines total**
- Any module: ideally **≤ 10-20 lines**

If a module exceeds its cap, split it into:

- a short summary + link, or
- a canonical doc + link.

### 5.4 Naming and scannability


Use headings that communicate intent:

- "Hard constraints"
- "Required validation"
- "Architecture boundaries"
- "Escalate to human when"

Avoid vague headings like:

- "Guidelines"
- "Best practices"
- "Notes"

## 6) Protocol for removing or demoting elements (anti-rot)


A section must be removed or demoted if any of the following is true:

1. **Redundant with enforcement**
   - CI/lint/script now enforces it; keep only a link/reminder.
2. **Low relevance**
   - It rarely applies or doesn't measurably change behavior.
3. **High churn**
   - It changes too frequently, causing drift.
4. **Too long**
   - It violates size caps; move detail to canonical docs.
5. **Misleading**
   - It is outdated, ambiguous, or causes incorrect actions.

### Removal protocol


- Delete the section from `AGENTS.md`
- Add or update the canonical doc if the information still matters
- Update the experiment log:
  - removal reason
  - replacement (if any)
  - date

## 7) Keep an explicit experiment log (outside `AGENTS.md`)


To avoid polluting `AGENTS.md` with meta content, maintain:

`docs/agents-md-evolution.md`

Minimum fields per entry:

- Date
- Change (added/edited/removed)
- Motivation (failure mode)
- Expected effect
- Observed outcome
- Decision (keep/revise/remove)
- Links to examples (PRs, incidents, tasks)

This log is the operational memory of why `AGENTS.md` looks the way it does.

## 8) Lightweight measurement signals (practical "ablation")


You do not need formal A/B testing to decide whether an element helped. Use operational signals:

- **Navigation**: agents find the right doc path earlier (fewer wrong turns)
- **Validation**: agents run required checks without prompting
- **Correctness**: fewer violations of architecture/security constraints
- **Review load**: fewer repeated review comments on targeted issues
- **Cycle time**: fewer iterations to reach an acceptable PR
- **Incident rate**: fewer regressions in the addressed area

### Section-level usefulness testing (informal ablation)


If uncertain:

- remove the section temporarily (short period),
- observe whether the prior failure mode returns,
- re-add only if the cost is obvious.

This keeps the file lean and evidence-based.

## 9) Implementation plan: v0 -> v3 rollout

### v0 (day 0): absolute minimal `AGENTS.md`


Only core sections:

- repo purpose
- required validation commands
- canonical docs links

No constraints, no style guidance, no process prose.

### v1: add one module


Pick the single highest-frequency failure mode.

Add exactly one short module, e.g. "Hard constraints."

### v2: revise or revert


After several tasks:

- tighten wording,
- move long content to canonical docs,
- remove if it does not help.

### v3: add a second module (only if needed)


Add the next module only if it targets a different class of failures.

This sequence ensures the file grows by evidence, not by anticipation.

## 10) Starter minimal `AGENTS.md` template (v0)

```markdown
# AGENTS.md

## Repo purpose
<One paragraph describing what this repo is, key entry points, primary runtime(s).>

## Required validation
- Tests: <command>
- Lint/format: <command>
- Build: <command>
- Smoke check (if applicable): <command or steps>

## Canonical docs
- Architecture map: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Plans: [docs/PLANS.md](./docs/PLANS.md)
- Security: [docs/SECURITY.md](./docs/SECURITY.md)
- Reliability: [docs/RELIABILITY.md](./docs/RELIABILITY.md)
- Product/specs index: [docs/product-specs/index.md](./docs/product-specs/index.md)
- Design docs index: [docs/design-docs/index.md](./docs/design-docs/index.md)
```

## 11) Module templates (for earned additions)

### Module: Hard constraints (example)


Use only if you see repeated violations.

```markdown
## Hard constraints (must not violate)
- Secrets: never commit or print tokens/credentials; use <secret system>.
- PII: do not log/store <PII types>; see [docs/SECURITY.md](./docs/SECURITY.md).
- Auth changes: require tests + review by <owner/team>.
```

### Module: Definition of done (example)


Use only if agents often stop too early.

```markdown
## Definition of done (for PRs)
- Required checks pass: <CI jobs>
- Local verification run: <commands>
- PR description includes:
  - what changed / why
  - how to reproduce
  - evidence (logs/screenshots) when applicable
```

### Module: Escalate to human when (example)


Use only if agents attempt high-risk decisions.

```markdown
## Escalate to a human when
- touching authentication/authorization or crypto
- modifying data migrations with irreversible risk
- changing architectural boundaries / module ownership
- reliability regressions or production incident response
```

## 12) Governance: who edits what


Recommended:

- `AGENTS.md` edits require review from a small set of owners (e.g., platform team).
- Any "hard constraint" must link to a canonical doc or enforcement mechanism.
- Any section added must be logged in `docs/agents-md-evolution.md`.

## 13) Summary: the operating rule set


- Start with **v0 minimal**.
- Add **one element at a time**, only with evidence and measurable intent.
- Keep modules **short, independent, and replaceable**.
- Prefer **links and enforcement** over prose.
- Maintain a **change log** and prune aggressively.

This is the practical path to an `AGENTS.md` that stays useful under real agent workloads.
