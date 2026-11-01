---
draft: false
toc: true
title: "Repository Expert: Requirements"
description: "Product definition, users, functional and non-functional requirements, guardrails and failure modes for a read-only, citation-first repository expert."
linkTitle: "Requirements"
---

The requirements are written so that each one can later become a measurable test (see [evaluation]({{< ref "projects/code-intelligence/repository-expert/evaluation" >}})). Stage and architecture context is in [roadmap]({{< ref "projects/code-intelligence/repository-expert/roadmap" >}}).

## Product definition


**Purpose.** Help users understand, navigate and reason about a software repository by answering questions grounded in its contents (code, config, docs) and optionally its Git history and build configuration.

Once retrieval is automatic, responsibility for finding evidence moves from the user to the system. The requirements therefore govern the quality of the search as well as the quality of the answer: a search-and-reasoning engine, not only a reasoning engine.

**Non-goals.**

- No code generation: no new functions, classes, patches or ready-to-merge diffs.
- No autonomous changes: no PRs, no commands, no file edits, no test runs, no network calls.
- No guessing about repository facts when evidence is missing.
- No product decisions that are not grounded in repository evidence ("which framework is best").

## Users and jobs


| Persona | Typical question |
| --- | --- |
| New contributor | "How does this repo work? Where do I start?" |
| Maintainer or senior engineer | "What breaks if I change X? Where is Y used?" |
| On-call engineer or SRE | "Where is this config set? What owns this endpoint?" |
| Security reviewer | "Where are auth checks? Any risky patterns?" |
| Manager or PM (light use) | "What does this module do? What are the main components?" |

Top jobs: find where something is implemented or configured; understand architecture and boundaries; trace data and control flow across files; explain why a behavior happens (code plus config plus docs); identify dependencies and impact of a change; summarize conventions (logging, errors, feature flags, config); map entry points (binaries, services, CLI commands, deployment units).

## Functional requirements


**FR1. Grounded answers with citations.** Answers use only repository evidence (and Git metadata if available). Every non-trivial claim cites a file path and line range, for example `[src: auth/handler.go L45-52]`. If evidence is missing or ambiguous, the answer says so and explains what was searched.

*Acceptance:* at least one relevant citation when the repository contains the answer; an explicit "not found in repository evidence" when it does not.

**FR2. Navigation.** Locate the files relevant to a goal ("Where is X configured?", "Where are the DB migrations?") with a short rationale for each.

*Acceptance:* correct files for common queries with few irrelevant ones.

**FR3. Semantic retrieval.** Retrieve by concept, not only keyword: "How is user data saved?" must find `INSERT`, `upsert` or `repo.Save()` even when "saved" appears nowhere.

**FR4. Architecture explanation.** Describe main components, boundaries, layering rules and ownership hints, grounded in docs, structure and entry points.

**FR5. Behavior and flow tracing.** Given a symptom, trace the request lifecycle, event pipeline, job flow or state transition across modules, as a chain of cited steps rather than speculation.

**FR6. Dependency-aware context and impact.** Code is a graph: when retrieval finds a call such as `process_payment()`, the context must include its definition even in another file. "What uses this?" and "what breaks if we change this?" are answered from static references (call sites, imports, route registration, dependency-injection wiring, config usage), with a confidence statement.

**FR7. Build, run, test and deploy guidance without execution.** Based on README, Makefile, package scripts, CI workflows, Dockerfiles and Helm charts. Commands not present in the repository are never invented; "likely" suggestions are labeled as such.

**FR8. No-code-generation contract.** Allowed: explanations, summaries, references, short quoted excerpts of existing code with citations, and plain-language steps ("update config key ..."). Not allowed: newly written code blocks.

**FR9. Change summaries (optional).** Summarize differences between branches, commits or tags: what changed, which components are affected, risk areas, with citations to files or commits.

**FR10. Staleness detection.** Detect when the code on disk differs from the index, and either re-index or warn that the answer may rest on outdated code.

## User experience


- **Clarification.** For underspecified questions ("Where is auth?"), ask one focused question (which service, endpoint, auth type) or give a best-effort map with options.
- **Consistent format.** Answer (one to three paragraphs); Evidence (file and lines with short notes); How to verify (what to read next); Uncertainties.
- **Scope control.** Users can pin a branch, commit or tag; a directory ("only `/services/api`"); a language or module; docs only or code plus config.

## Non-functional requirements


- **Groundedness.** Correctness over fluency; no invented functions, modules, config keys or behavior.
- **Signal-to-noise.** At least 60% of retrieved tokens are directly relevant. High-density logic is preferred over generated mocks, vendor lock files and large JSON blobs.
- **Scale.** Large repositories and monorepos via incremental indexing, scoped search and caching; a defined set of supported languages.
- **Latency.** Indicative budget: retrieval under 2 s, full answer under 8 s, indexing excluded. Degrade gracefully with partial findings and a clear status.
- **Deterministic retrieval.** The same repository state and query return the same chunks; configure the vector store for exact or seeded search.
- **Security.** Treat repository content as potentially adversarial (prompt injection in docs and comments). Never reveal secrets; redact credentials. Enforce access control consistent with repository permissions.
- **Privacy and governance.** A clear retention policy for repository content in logs and indices; index and cache deletion on request; no training on private code without explicit permission.
- **Auditability.** Every answer is reproducible from the commit hash, index version and citations; "show me why" expands the evidence.

## Negative requirements


- **No retrieval of secrets.** Exclude `.env`, `secrets.yaml` and files with high-entropy strings that look like keys at indexing time; never print a hard-coded secret.
- **No invented integration.** If retrieval finds a frontend file and a backend file but no code connecting them, say "I see both files but cannot find the code that connects them" instead of describing a hypothetical integration.
- **Generated code excluded.** Exclude or de-prioritize large generated files (`package-lock.json`, `*_pb2.py`) unless explicitly asked, since they dilute the index.

## Failure modes to handle safely


- **Ambiguous symbols** (several `Config`, `Client`, `Handler`): show the candidates.
- **Generated or vendored code**: detect and de-prioritize.
- **Stale docs versus code**: surface the conflict ("README says X, code shows Y").
- **Missing context**: ask for the service, module or version.

## Success metrics


- Time to answer for common questions (onboarding, impact analysis).
- Fewer "where is X?" interruptions to maintainers.
- User-rated helpfulness and trust, especially "did it cite evidence?".
- Usefulness during incidents (config, entry point and ownership questions).
