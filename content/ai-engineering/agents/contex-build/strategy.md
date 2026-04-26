---
draft: false
toc: true
title: "Strategy"
linkTitle: "Strategy"
---
Yes. I would treat `AGENTS.md` as a **small control surface**, not a documentation dump.

Your instincts are correct on both points:

- **Minimalism first**: a large instruction file quickly becomes counterproductive because it consumes context, blurs priorities, and rots. The attached OpenAI doc explicitly argues for "map, not manual," noting that one giant `AGENTS.md` crowds out task-relevant context and becomes hard to verify.
- **Step-by-step expansion**: the same doc's model is progressive disclosure -- start with a small stable entry point, then route the agent to deeper sources of truth only as needed.

So the build method I'd recommend is:

## 1. Treat every section as a hypothesis


Do not ask, "What should an ideal `AGENTS.md` contain?"

Ask, "What is the smallest instruction that measurably improves agent behavior?"

Each added section should be justified by one of these:

- it prevents a recurring failure
- it reduces navigation time
- it improves validation quality
- it removes ambiguity the agent repeatedly mishandles

That means `AGENTS.md` evolves by **observed failure modes**, not by completeness fantasies.

## 2. Build it in phases

### Phase 0: absolute minimum


Start with only 3 things:

1. **What this repo is**
    - one short paragraph
2. **How to validate changes**
    - exact commands
3. **Where the canonical docs live**
    - links to architecture / security / plans / specs

That is enough to make the file useful while keeping it small.

A v0 can be as short as this:

```md
# AGENTS.md

## Repo purpose
Short description of the product/service and main runtime.

## Required validation
- Run: <test command>
- Run: <lint command>
- Run: <build or smoke-test command>

## Canonical docs
- Architecture: ./ARCHITECTURE.md
- Plans: ./docs/PLANS.md
- Security: ./docs/SECURITY.md
- Reliability: ./docs/RELIABILITY.md
```


If this already improves outcomes, keep it. Do not add more because it feels incomplete.

### Phase 1: add one module at a time


Only after observing real agent behavior, add one narrowly scoped section.

Examples:

- "Hard constraints"
- "PR definition of done"
- "Architecture boundaries"
- "Data migration rules"
- "Where active plans live"

Each addition should answer a concrete problem such as:

- agents skip smoke tests
- agents violate layering
- agents modify generated files incorrectly
- agents miss security-sensitive boundaries

### Phase 2: promote stable sections


Once a section consistently improves results across multiple tasks, promote it from experiment to standard.

If it does not clearly help, remove it.

That is effectively ablation, though in practice I would call it **section-level usefulness testing** rather than formal A/B. The unit of evaluation is: "Did this section materially improve agent outcomes?"

## 3. Make the file modular by design


I would not make modularity mean "many long sections."

I would make it mean: **a set of small, optional, replaceable modules with clear jobs.**

A good mental model is:

- **Core**: always present
- **Modules**: only included if they have proven value

### Core


The permanent base should stay tiny:

- repo purpose
- validation commands
- canonical doc map

### Optional modules


Each optional section should be independent and scoped.

Examples:

- `## Hard constraints`
- `## Architecture boundaries`
- `## Data and migrations`
- `## Definition of done`
- `## Escalate to human when`

This is consistent with the attached doc's idea that `AGENTS.md` should stay short and act as a routing layer into a structured repo knowledge base.

## 4. Give each section an explicit contract


Every heading should have a reason to exist.

For each section, define:

- **Purpose**: what behavior it is trying to change
- **Trigger**: what failure or ambiguity caused it to be added
- **Expected effect**: what should improve
- **Owner**: who can edit/remove it
- **Exit condition**: when it should be deleted, split, or moved elsewhere

This avoids passive accumulation.

For example:

### `## Architecture boundaries`


- Purpose: prevent invalid dependency edges
- Trigger: agent repeatedly imports UI code into domain layer
- Expected effect: fewer structural review comments
- Exit condition: once structural lint fully enforces this, reduce section to a link

That last point matters: if a rule becomes mechanically enforced, `AGENTS.md` should shrink, not grow.

## 5. Prefer links over prose whenever possible


If a topic needs more than a few lines, it probably does not belong in `AGENTS.md`.

Use a rule like:

- **<= 5 lines**: can live in `AGENTS.md`
- **> 5 lines**: move to canonical doc and link it

This preserves the "table of contents" role described in the source.

## 6. Use a section admission test


Before adding any new heading, require "yes" to all of these:

1. Is there repeated evidence this information is needed?
2. Can it be stated clearly in a few lines?
3. Is it stable enough not to rot immediately?
4. Is it not already enforced elsewhere?
5. Can we tell whether it helped?

If any answer is "no," do not add it yet.

## 7. Use a section removal test too


A section should be removed or demoted if:

- it duplicates a canonical doc
- it repeats things the agent already infers reliably
- it became obsolete
- it is now enforced by CI or lint
- it is rarely relevant
- it increases length without reducing failure rate

This is how you keep minimalism real instead of aspirational.

## 8. Maintain an experiment log outside `AGENTS.md`


Do not clutter `AGENTS.md` with rationale. Keep that in a separate file such as:

`docs/agents-md-evolution.md`

Track:

- date added
- section name
- why it was added
- tasks/failures that motivated it
- observed effect
- keep / revise / remove decision

This gives you a disciplined iteration loop without making the instruction file self-referential.

## 9. Measure usefulness with practical signals


You do not need a formal research setup. A lightweight operational loop is enough.

For each change to `AGENTS.md`, look at:

- did the agent choose the right docs faster?
- did it run the required validation without prompting?
- did it avoid known architectural/security mistakes?
- did review comments decrease on the targeted issue?
- did the section get consulted in the tasks it was meant to affect?

If not, the section likely does not deserve to stay.

## 10. Keep the repo modular too, not just the file


The attached doc makes an important broader point: agent performance depends on repository-legible knowledge, not on one instruction blob. The repo should hold the real knowledge base in structured docs, plans, schemas, and references.

So the real architecture is:

- `AGENTS.md` = entry point
- `ARCHITECTURE.md` = system map
- `docs/...` = modular knowledge store
- CI/lint = enforcement

That means section modularity in `AGENTS.md` should mirror doc modularity in the repo.

## A concrete operating model


I would use this lifecycle:

### v0


Only:

- repo purpose
- validation commands
- doc map

### v1


Add exactly one section after observing one repeated problem.

Example:

- `## Hard constraints`

### v2


Refine wording or remove it after a few tasks.

### v3


Add second section only if it solves a different class of failure.

This keeps the file growing by evidence, not by anticipation.

## My recommended structure

### Permanent core


These should almost always exist:

- `## Repo purpose`
- `## Required validation`
- `## Canonical docs`

### Candidate modules


These are optional and should be earned:

- `## Hard constraints`
- `## Architecture boundaries`
- `## Data and migrations`
- `## Definition of done`
- `## Escalate to human when`

### Things I would avoid early


Do not start with:

- long style guides
- generic coding advice
- team culture notes
- deep product semantics
- exhaustive workflow instructions

Those usually belong in linked docs, not in the entry point.

## A useful rule of thumb


A section belongs in `AGENTS.md` only if it is:

- **short**
- **stable**
- **high leverage**
- **frequently relevant**
- **not better enforced elsewhere**

That is the filter I would use.

## Bottom line


I would build `AGENTS.md` as a **minimal core plus experimentally validated modules**.

Not:

- "write the perfect file up front"

But:

- start tiny
- observe failures
- add one section at a time
- measure whether it helped
- remove anything that does not pay for its context cost

That approach is aligned with the attached document's core ideas: keep `AGENTS.md` short, use it as a map, and rely on progressive disclosure into a structured repository knowledge base.

I can turn this into a concrete v0 -> v3 rollout plan or a minimal first draft of `AGENTS.md`.
