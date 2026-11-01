---
draft: false
toc: true
title: "Research agenda: AGENTS.md and reliable coding-agent autonomy"
description: "Study when repository instructions earn their recurring cost: eight questions connect loading, placement, length, failure remedies, maintenance, and escalation to accepted changes and total human effort."
linkTitle: "Coding-Agent Research Agenda"
---
# Research agenda: `AGENTS.md` and reliable coding-agent autonomy


**Document type:** Research questions

**Date:** 18 October 2026

**Basis:** *AGENTS.md -- Operating Model* (`agents-md.md`)

**Status:** Scope and questions only; experimental methodology will be developed separately.

## Purpose


The existing guide proposes an operating model for coding agents: provide concise project-specific onboarding, route agents to canonical sources, use validation and tooling to enforce important rules, and improve the surrounding system when failures recur. Those are useful working hypotheses, but the agents, tools, and available evidence have changed.

This research will determine which recommendations remain supported, where they apply, and which should be revised. The object of evaluation is the full **user-repository-agent system**, with `AGENTS.md` as one component.

**Primary research question**

> Under what conditions do repository instructions and supporting tools help current coding agents deliver correct, reviewable changes with less total human effort?

## Research questions

### RQ1. When does an `AGENTS.md` file improve results?


**Core question.** Across coding agents, repositories, and task types, when does an instruction file improve correctness, adherence to local conventions, and total human effort?

**Questions to investigate**

- How do results compare with no instruction file (but existing repository documentation available), a minimal human-written file, a comprehensive human-written file, and an automatically generated file?
- Which effects depend on repository complexity, documentation quality, agent familiarity with the stack, and task duration?
- Does the file improve architectural consistency or review quality even when benchmark task-success rates stay unchanged?
- What additional execution cost or maintenance burden does the file create?

**Guide claims to revisit:** "What `AGENTS.md` is"; "Start with the smallest useful file."

### RQ2. Which assumptions about context and memory remain accurate?


**Core question.** What do current coding-agent products actually load, retain, retrieve, and apply across tasks and sessions?

**Questions to investigate**

- How do tools such as Codex, Claude Code, Cursor, and comparable agents handle instruction loading, nested files, working-directory scope, and precedence?
- What persists across fresh sessions, resumed sessions, context compaction, and subagent execution?
- When are repository instructions reliably available, and when do agents need to discover or retrieve them?
- How should the guide's claim that agents reconstruct project context "from scratch every time" be qualified for products with persistent memory or other state?

**Guide claims to revisit:** "Onboarding"; "Agents work from assembled context"; guidance on nested files.

### RQ3. Which kinds of instructions earn their place?


**Core question.** Which categories of instruction measurably improve an agent's behavior beyond its existing knowledge and defaults?

**Questions to investigate**

- Compare local commands, architecture constraints, examples, explicit procedures, scope limits, verification requirements, and generic engineering reminders.
- Does an agent's knowledge of a practice reliably translate into applying it without a reminder?
- Which repository details can agents infer dependably from code, tests, and configuration, and which need explicit explanation?
- When do examples or decision procedures work better than short declarative rules?

**Guide claims to revisit:** "Agents bring generic priors"; "Add only project-specific defaults."

### RQ4. Is shorter instruction context consistently better?


**Core question.** How do instruction length, relevance, ordering, duplication, ambiguity, and count independently affect completion quality and adherence?

**Questions to investigate**

- If required information is held constant, does compressing the text improve outcomes?
- Are any useful length thresholds stable across agents, models, task types, or session lengths?
- Do prominent placement and source-authority cues matter more than raw token count?
- How much additional cost comes from loading instructions, and how much from extra exploration or validation caused by following them?

**Guide claims to revisit:** "Context is limited and signals are mixed"; "Treat context as a budget."

### RQ5. When does routing to documentation work better than including guidance directly?


**Core question.** Where should project knowledge live so agents find it and apply it at the right moment?

**Questions to investigate**

- Compare the same guidance in the root `AGENTS.md`, scoped or nested files, linked canonical documentation, documentation indexes, and selectively loaded skills.
- How often does an agent fail to recognize that a linked source is needed? Which routing descriptions increase discovery?
- What must be visible before the first action, and what can safely be retrieved later?
- How do information placement and source-of-truth rules behave when documents are stale, inconsistent, or competing?

**Guide claims to revisit:** "Make it a map, not a manual"; "Separate stable root rules from changing domain knowledge."

### RQ6. How should recurring failures be diagnosed and addressed?


**Core question.** For a recurring agent failure, which change reduces future failures at the lowest total cost?

**Questions to investigate**

- Compare changes to `AGENTS.md`, canonical documentation, scripts, clearer error messages, tests, linters, CI, task requests, and agent or model selection.
- How can the analysis distinguish missing knowledge from failed retrieval, ignored instructions, ambiguous requirements, and capability limits?
- When an automated check already enforces an invariant, is a brief explanation or recovery procedure still useful?
- When is a repeated failure evidence of a problem in the surrounding workflow, and when is that explanation insufficient?

**Guide claims to revisit:** "Prefer enforcement over prose"; "Convert repeated failures into harness improvements."

### RQ7. How should instructions be maintained and removed?


**Core question.** Which maintenance practices keep repository guidance accurate, consistent, and useful as projects and agents change?

**Questions to investigate**

- What causes stale, conflicting, duplicated, or obsolete rules, and how often do those rules produce observable mistakes?
- Which ownership and review triggers work best for commands, paths, architecture rules, and nested files?
- Does continually adding rules after failures improve generalization to new tasks, or overfit to prior incidents?
- What evidence should justify editing, relocating, consolidating, or deleting a rule?

**Guide claims to revisit:** "Add modules only when they are earned"; "Canonical sources"; "Anti-patterns to avoid."

### RQ8. What validation and human involvement produce reliable autonomy?


**Core question.** How should verification requirements and human escalation vary with task complexity, uncertainty, and error consequences?

**Questions to investigate**

- When is one repository-wide verification command sufficient, and when are targeted tests, broader checks, or independent review necessary?
- Which instructions reduce unnecessary interruptions without suppressing useful requests for human judgment?
- How should quality account for incomplete requirements, architectural violations, review effort, and defects discovered after acceptance?
- Which decisions should remain with the human, and how should agents recognize that boundary?

**Guide claims to revisit:** "Validation"; "Reliable autonomy"; "User goals."

## Evidence requirements across all questions


The research should use multiple forms of evidence, keeping them distinct:

1. **Current product documentation and observable behavior.** Record product and model versions, scope, precedence, retrieval, and memory behavior. Separate documented features from behavior verified in practice.
2. **Controlled evaluations.** Prefer comparable tasks and repository states, clear baselines, repeated runs, explicit success criteria, uncertainty estimates, and independent assessment of correctness.
3. **Firsthand practitioner evidence.** Look for concrete before-and-after configurations, exact interventions, task mix, observation period, failures, costs, and human review effort. Treat anecdotes as hypotheses when those details are absent.
4. **Explanations and competing hypotheses.** For each claimed effect, describe a plausible mechanism, alternative causes, limits of applicability, and evidence that would weaken the conclusion.

**Primary outcomes to consider:** accepted task completion and total human time, including preparation, steering, review, correction, and instruction maintenance.

**Secondary outcomes to consider:** execution time, model/tool cost, validation quality, policy or architecture violations, unrelated changes, post-acceptance defects, and unnecessary or missed escalations. Adoption and usage statistics help describe practice but do not, by themselves, establish effectiveness.

## Expected research output


For each question, produce a concise synthesis containing:

- What the guide currently assumes or recommends.
- The strongest supporting evidence and the strongest counterevidence.
- The conditions, products, repository types, and tasks for which the finding appears to apply.
- Open uncertainties and plausible alternative explanations.
- A recommendation for the guide: **retain, qualify, rewrite, or remove**.

Recommendations should distinguish established behavior from tentative practitioner consensus and avoid universal advice where the evidence is conditional.

## Recommended investigation order


Begin with **RQ1, RQ2, RQ4, and RQ5**. These challenge the central assumptions about whether instruction files help, what agents actually remember or load, how instruction length affects behavior, and where information should live. Then investigate instruction content (RQ3), failure interventions (RQ6), maintenance (RQ7), and validation or escalation policy (RQ8).

## Starting references for verification


These are initial leads from the question-formulation discussion, **not yet a completed literature review**. Verify publication details, methodology, findings, and applicability during the research phase.

- *Evaluating AGENTS.md* -- https://arxiv.org/abs/2602.11988
- Empirical study of `AGENTS.md` and development performance -- https://arxiv.org/abs/2601.20404
- Vercel, *AGENTS.md outperforms skills in our agent evals* -- https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
- Claude Code documentation, *Memory* -- https://code.claude.com/docs/en/memory

## Boundary of this document


This document defines **what to investigate and why**. It does not yet define task sampling, experimental conditions, randomization, scoring rubrics, statistical analyses, or the rules for declaring an improvement. Those belong in the next document: an **experimental methodology and evaluation protocol** derived from these questions.
