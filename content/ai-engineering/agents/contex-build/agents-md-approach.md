---
draft: false
toc: true
title: "Agents Md Approach"
linkTitle: "Agents Md Approach"
---
# Approach to build and maintain `AGENTS.md`


This document describes a practical approach for designing, authoring, and maintaining an `AGENTS.md` file in an "agent-first" repository. It is written to be adopted as an internal standard and adapted per-repo.

## Purpose of `AGENTS.md`


`AGENTS.md` is the stable entry point that agents read first. It should function as a **map (table of contents)** that routes agents to the correct sources of truth inside the repository, rather than an encyclopedia of rules.

The underlying goal is **agent legibility**: anything not accessible in-repo (and in-context) is effectively invisible to an agent. Therefore, repository-local, versioned artifacts (markdown, schemas, executable plans, code) must be treated as the system of record, not external docs or chats.

## Goals


1. **Fast orientation**
   - Enable an agent to answer: "What is this repo?", "Where is architecture documented?", "How do I run/validate changes?", "What constraints must I not violate?"
2. **Correct routing**
   - Provide a small, stable set of pointers into deeper, canonical docs (architecture, specs, security, reliability, plans, references).
3. **Context efficiency**
   - Keep the injected content small so it doesn't crowd out task code and relevant docs during execution.
4. **Repository-local knowledge as system of record**
   - Ensure product principles, architectural decisions, and operational practices are discoverable inside the repo (and versioned).
5. **Enforceable constraints**
   - Prefer invariants that are mechanically enforced (CI, linters, structural tests) over prose-only policy.
6. **Progressive disclosure**
   - Agents start with a minimal entry point and are taught where to look next, instead of being overloaded upfront.

## Non-goals


- Not a full engineering handbook.
- Not a replacement for architecture docs, product specs, or security standards.
- Not a dumping ground for "everything important."

## Design principles

### 1) "Map, not manual"


A monolithic instruction file tends to fail:

- it consumes context,
- "everything is important" becomes non-guidance,
- it rots rapidly,
- it's hard to mechanically verify.

Instead, keep `AGENTS.md` short and link to structured docs.

### 2) Progressive disclosure


Structure information in layers:

- **Layer 0**: `AGENTS.md` (entry point)
- **Layer 1**: canonical maps (e.g., `ARCHITECTURE.md`, `docs/PLANS.md`)
- **Layer 2**: domain docs, specs, execution plans, references, generated schemas

### 3) Agent legibility first


Write as if onboarding a new engineer who can only read the repository. Make key decisions, norms, and system boundaries discoverable in-repo.

### 4) Enforce invariants, don't micromanage implementations


Codify what must remain true (boundaries, validation, security, reliability).

Allow flexibility within those boundaries.

### 5) Prefer deterministic workflows


Agents perform best with predictable structure:

- explicit commands,
- explicit "definition of done",
- explicit constraints and escalation conditions.

## Recommended information architecture (repo layout)


A typical "knowledge store" layout:

```text
AGENTS.md
ARCHITECTURE.md
docs/
├── design-docs/
│   ├── index.md
│   ├── core-beliefs.md
│   └── ...
├── exec-plans/
│   ├── active/
│   ├── completed/
│   └── tech-debt-tracker.md
├── generated/
│   └── db-schema.md
├── product-specs/
│   ├── index.md
│   ├── onboarding.md
│   └── ...
├── references/
│   ├── <tool-or-lib>-llms.txt
│   └── ...
├── DESIGN.md
├── FRONTEND.md
├── PLANS.md
├── PRODUCT_SENSE.md
├── QUALITY_SCORE.md
├── RELIABILITY.md
└── SECURITY.md
```


Notes:

- `AGENTS.md` stays short and points into these docs.
- `docs/*/index.md` files should be curated catalogs (not piles) so an agent can navigate intentionally.
- `docs/generated/*` should be generated artifacts that agents can rely on (schema, API surface summaries, etc.).

## Authoring practices for `AGENTS.md`

### Length budget


- Target: **~50-120 lines**.
- If it grows, split content into canonical docs and link them.

### Write in "agent action" form


Prefer:

- explicit commands (`make test`, `pnpm lint`, `./scripts/dev`)
- explicit artifacts ("update `docs/exec-plans/active/<plan>.md`")
- explicit constraints ("must not ...", "must run ...", "must include evidence ...")

Avoid:

- high-level exhortations without enforcement ("write clean code")
- vague language ("be careful", "ensure quality")

### Put hard constraints early


Include a short, high-signal list of invariants such as:

- **Security**: secrets handling, auth boundaries, no credential logging
- **Data**: migrations process, PII rules, schema compatibility
- **Architecture**: layering rules, allowed dependencies, module boundaries
- **Reliability**: required observability, error handling conventions
- **Quality**: test expectations, linting gates, performance budgets

### Make "definition of done" explicit


Agents should know exactly what completion means, including:

- test commands that must pass
- how to validate core user journeys
- what to include in PR description (repro steps, evidence, screenshots/logs)

### Route to deeper sources of truth


Every non-trivial topic should link to a canonical doc:

- Architecture map (`ARCHITECTURE.md`)
- Reliability (`docs/RELIABILITY.md`)
- Security (`docs/SECURITY.md`)
- Product principles (`docs/PRODUCT_SENSE.md`)
- Plans (`docs/PLANS.md` + `docs/exec-plans/...`)
- Code style and tooling (formatter configs + short docs)

### Treat plans as first-class artifacts


Use plans as the operational memory for non-trivial work:

- small change: ephemeral plan in PR body or short checklist
- complex change: execution plan in `docs/exec-plans/active/...`
- completed plans moved to `docs/exec-plans/completed/...`
- known tech debt tracked in `docs/exec-plans/tech-debt-tracker.md`

This supports progressive disclosure and reduces reliance on external context.

## Maintenance practices (preventing rot)

### 1) Ownership


Assign an explicit owner (or rotating DRI) responsible for:

- `AGENTS.md` accuracy
- knowledge base structure
- "doc gardening" backlog

### 2) Mechanical enforcement (CI + linters)


Add CI jobs that validate:

- **Link integrity**: all links in `AGENTS.md` resolve
- **Index integrity**: required `index.md` files exist and include expected sections
- **Structure rules**: required docs exist (`SECURITY.md`, `RELIABILITY.md`, etc.)
- **Freshness markers**: docs declare status and last-verified dates
- **Cross-linking**: e.g., execution plans reference relevant specs/architecture

Implementation idea:

- a `scripts/check_docs.py` lints markdown links, required headings, and doc frontmatter.
- custom lint error messages should include remediation instructions (agents consume these).

### 3) Doc-gardening loop


Run a recurring process (human or agent) that:

- scans for outdated instructions and mismatches with code behavior
- opens fix-up PRs
- flags "attractive nuisance" docs (stale but plausible)

### 4) Update triggers (when `AGENTS.md` must change)


Define explicit triggers, for example:

- repo layout changed (paths moved/renamed)
- boot/test/lint commands changed
- new architectural boundary introduced
- a repeated failure mode occurs ("agents keep breaking X")
- security/reliability policy updated

### 5) Deprecation and verification


Add a minimal metadata pattern to canonical docs (not necessarily `AGENTS.md`):

- **Status**: `draft | verified | deprecated`
- **Last verified**: ISO date
- **Owner**: team/alias
- **Applies to**: scope/domain/module

This lets agents (and humans) reason about trustworthiness.

## Suggested metrics (to keep it healthy)


Operational metrics you can track:

- percentage of PRs that required agent rework due to missing constraints
- number of CI failures attributable to unclear docs
- link-check failure rate
- "doc gardening" PR throughput and backlog age
- time-to-first-successful-run for a new agent session (proxy for onboarding)

## Anti-patterns to avoid


- **One giant `AGENTS.md` encyclopedia**
- **Duplicating canonical docs in `AGENTS.md`**
- **Rules without enforcement**
- **Unscoped "best practices"** that vary by domain (put them in domain docs)
- **External-only knowledge** (Google Docs/Slack threads) without repo encoding

# Appendix A: Starter `AGENTS.md` template (short, map-like)


> Replace placeholders and keep this file intentionally short.

```markdown
# Agent instructions (repo map)

## What this repo is
- <One paragraph: product/service purpose, primary runtime, key entry points>

## Quickstart (local)
- Install: <command(s)>
- Dev server: <command(s)>
- Tests: <command(s)>
- Lint/format: <command(s)>
- Build/release: <command(s)>

## Canonical docs (start here)
- Architecture map: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Product principles: [docs/PRODUCT_SENSE.md](./docs/PRODUCT_SENSE.md)
- Reliability requirements: [docs/RELIABILITY.md](./docs/RELIABILITY.md)
- Security requirements: [docs/SECURITY.md](./docs/SECURITY.md)
- Quality bar: [docs/QUALITY_SCORE.md](./docs/QUALITY_SCORE.md)
- Plans: [docs/PLANS.md](./docs/PLANS.md)
- Active execution plans: [docs/exec-plans/active/](./docs/exec-plans/active/)
- Completed execution plans: [docs/exec-plans/completed/](./docs/exec-plans/completed/)
- Tech debt tracker: [docs/exec-plans/tech-debt-tracker.md](./docs/exec-plans/tech-debt-tracker.md)
- Design docs index: [docs/design-docs/index.md](./docs/design-docs/index.md)
- Product specs index: [docs/product-specs/index.md](./docs/product-specs/index.md)
- References (tooling/library notes): [docs/references/](./docs/references/)

## Hard constraints (must not violate)
- Security:
  - Never commit secrets; use <secret mechanism>.
  - Never log credentials/tokens/PII.
  - Authz/authn changes must include tests + review from <owner>.
- Data:
  - Schema/migrations live in <path>; run <command>.
  - Backward compatibility rules: <rules>.
- Architecture:
  - Layering rule: <rule>; enforced by <lint/test>.
  - Only allowed dependency edges: <summary + link>.
- Reliability:
  - All new endpoints/jobs require structured logging + metrics; see docs/RELIABILITY.md.
- Quality:
  - Changes must include tests for <critical areas>.
  - No disabling flaky tests without quarantine + ticket.

## Definition of done (for PRs)
- Required checks: <CI checks>
- Local verification performed:
  - <command output or brief evidence>
- User-journey validation:
  - <steps or script>
- PR description includes:
  - What changed / why
  - How to reproduce
  - Evidence (logs/screenshots) as applicable

## When to escalate to a human
- Security-sensitive changes (auth, secrets, crypto)
- Data migrations with irreversible risk
- Architecture boundary changes
- Reliability regressions or production incidents
```

# Appendix B: "Doc lint" checklist (CI-friendly)


- `AGENTS.md` exists and is below <N> lines
- links resolve (relative links, section anchors)
- required canonical docs exist
- all `docs/*/index.md` contain:
  - purpose
  - navigation links
  - status/verification metadata
- execution plans use a consistent template
- deprecated docs are clearly marked and linked to replacements
